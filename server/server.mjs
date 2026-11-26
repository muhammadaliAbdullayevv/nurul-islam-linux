import http from 'node:http';
import fs from 'node:fs/promises';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 8115);
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'ehson.json');
const DEVICES_FILE = path.join(DATA_DIR, 'devices.json');
const DEVICE_CONTROLS_FILE = path.join(DATA_DIR, 'device-controls.json');
const BROADCASTS_FILE = path.join(DATA_DIR, 'broadcasts.json');
const APP_CONFIG_FILE = path.join(DATA_DIR, 'app-config.json');
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedback.json');
const ERRORS_FILE = path.join(DATA_DIR, 'errors.json');
const AUDIT_FILE = path.join(DATA_DIR, 'audit.json');
const TELEGRAM_FILE = path.join(DATA_DIR, 'telegram.json');
const AUTH_FILE = path.join(DATA_DIR, 'auth.json');
const PROGRESS_FILE = path.join(DATA_DIR, 'user-progress.json');
const OWNER_HTML = path.join(__dirname, 'owner.html');
const VERSION_JSON_PATH = process.env.VERSION_JSON_PATH || '/var/www/muslimapp/version.json';

if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

// Monotonic sync version bumped on every config/broadcast/device-control edit for instant ETag invalidation
let globalSyncVersion = Date.now();
function bumpSyncVersion() {
  const now = Date.now();
  globalSyncVersion = now > globalSyncVersion ? now : globalSyncVersion + 1;
  return globalSyncVersion;
}

// =========================================================================
// Rate Limiting & Security Helpers
// =========================================================================
const rateBuckets = new Map();

function checkRateLimit(bucketName, key, maxHits, windowMs) {
  let bucket = rateBuckets.get(bucketName);
  if (!bucket) {
    bucket = new Map();
    rateBuckets.set(bucketName, bucket);
  }
  const now = Date.now();
  const rec = bucket.get(key);
  if (!rec || now > rec.resetAt) {
    bucket.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (rec.count >= maxHits) return false;
  rec.count += 1;
  return true;
}

setInterval(() => {
  const now = Date.now();
  for (const bucket of rateBuckets.values()) {
    for (const [k, rec] of bucket.entries()) {
      if (now > rec.resetAt) bucket.delete(k);
    }
  }
}, 5 * 60_000).unref();

function getClientIp(req) {
  const xff = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  return String(xff).split(',')[0].trim();
}

function maskIp(ip) {
  if (!ip) return 'unknown';
  if (ip.includes('.')) {
    const parts = ip.split('.');
    return parts.length === 4 ? `${parts[0]}.${parts[1]}.${parts[2]}.*` : ip;
  }
  return ip.slice(0, 12) + '...';
}

// =========================================================================
// Auth & Session Store (Never stored inside APK; server-only secret)
// =========================================================================
const loginAttempts = new Map();
const COOKIE_NAME = 'nq_owner_sess';

async function loadOrInitAuth() {
  try {
    const raw = await fs.readFile(AUTH_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    const secret = crypto.randomBytes(32).toString('hex');
    const initialPass = process.env.OWNER_PASSWORD || crypto.randomBytes(9).toString('base64url');
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(initialPass, salt, 64).toString('hex');
    const cfg = { secret, salt, hash, createdAt: new Date().toISOString() };
    await fs.writeFile(AUTH_FILE, JSON.stringify(cfg, null, 2), { mode: 0o600 });
    await fs.writeFile(path.join(DATA_DIR, 'INITIAL_OWNER_PASSWORD.txt'), initialPass + '\n', { mode: 0o600 });
    console.log('[auth] Initialized owner auth config cleanly.');
    return cfg;
  }
}

let authCfg = await loadOrInitAuth();

function verifyPassword(password) {
  if (!password || typeof password !== 'string') return false;
  const derived = crypto.scryptSync(password, authCfg.salt, 64);
  const expected = Buffer.from(authCfg.hash, 'hex');
  return derived.length === expected.length && crypto.timingSafeEqual(derived, expected);
}

function signSessionToken(expMs) {
  const payload = Buffer.from(JSON.stringify({ role: 'owner', exp: expMs })).toString('base64url');
  const sig = crypto.createHmac('sha256', authCfg.secret).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

function verifySessionCookie(req) {
  const raw = req.headers.cookie || '';
  const match = raw.split(';').map((s) => s.trim()).find((s) => s.startsWith(`${COOKIE_NAME}=`));
  if (!match) return false;
  const token = match.slice(COOKIE_NAME.length + 1);
  const dot = token.indexOf('.');
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expectedSig = crypto.createHmac('sha256', authCfg.secret).update(payload).digest('base64url');
  if (sig.length !== expectedSig.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return false;
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return parsed.role === 'owner' && typeof parsed.exp === 'number' && parsed.exp > Date.now();
  } catch {
    return false;
  }
}

function isLocalDevHost(req) {
  const host = String(req.headers.host || '').toLowerCase();
  const proto = String(req.headers['x-forwarded-proto'] || '').toLowerCase();
  if (proto === 'https') return false;
  return host.startsWith('127.0.0.1') || host.startsWith('localhost');
}

function buildCookieHeader(req, value, maxAgeSec) {
  const secureFlag = isLocalDevHost(req) ? '' : '; Secure';
  return `${COOKIE_NAME}=${value}; Path=/; HttpOnly${secureFlag}; SameSite=Lax; Max-Age=${maxAgeSec}`;
}

// =========================================================================
// File-Backed Atomic Stores + High-Scale In-Memory Caches
// =========================================================================
let ehsonChain = Promise.resolve();
let broadcastsChain = Promise.resolve();
let configChain = Promise.resolve();
let deviceControlsChain = Promise.resolve();
let feedbackChain = Promise.resolve();
let errorsChain = Promise.resolve();
let auditChain = Promise.resolve();
let versionChain = Promise.resolve();
let telegramChain = Promise.resolve();

async function readJsonFile(filePath, fallback) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function atomicWriteJson(filePath, data, pretty = true, mode = undefined) {
  const tmp = `${filePath}.tmp.${process.pid}.${Date.now()}`;
  const content = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
  await fs.writeFile(tmp, content, mode ? { encoding: 'utf8', mode } : 'utf8');
  await fs.rename(tmp, filePath);
}

// --- Ehson Store ---
async function readDb() {
  const parsed = await readJsonFile(DATA_FILE, { campaigns: [] });
  return Array.isArray(parsed.campaigns) ? parsed : { campaigns: [] };
}

function withDbWrite(mutator) {
  const next = ehsonChain.then(async () => {
    const db = await readDb();
    const res = await mutator(db);
    await atomicWriteJson(DATA_FILE, db, true);
    return res;
  });
  ehsonChain = next.catch(() => {});
  return next;
}

// --- High-Scale In-Memory Devices Cache with Debounced Disk Flush ---
const devicesState = {
  devices: {},
  dailyActiveSets: new Map(), // 'YYYY-MM-DD' -> Set<deviceId>
  lastLiveSyncMs: new Map(), // deviceId -> timestamp ms (volatile live-online presence)
  dirty: false,
  flushing: false,
};

async function initDevicesCache() {
  const parsed = await readJsonFile(DEVICES_FILE, { devices: {}, dailyActive: {} });
  devicesState.devices = parsed && typeof parsed.devices === 'object' && parsed.devices ? parsed.devices : {};
  devicesState.dailyActiveSets.clear();
  const rawDaily = parsed && typeof parsed.dailyActive === 'object' && parsed.dailyActive ? parsed.dailyActive : {};
  for (const [day, arr] of Object.entries(rawDaily)) {
    if (Array.isArray(arr)) {
      devicesState.dailyActiveSets.set(day, new Set(arr));
    }
  }
}

await initDevicesCache();

function serializeDevicesState() {
  const dailyActive = {};
  for (const [day, set] of devicesState.dailyActiveSets.entries()) {
    dailyActive[day] = Array.from(set);
  }
  return {
    devices: devicesState.devices,
    dailyActive,
  };
}

async function flushDevicesToDisk(force = false) {
  if ((!devicesState.dirty && !force) || devicesState.flushing) return;
  devicesState.flushing = true;
  devicesState.dirty = false;
  try {
    await atomicWriteJson(DEVICES_FILE, serializeDevicesState(), false);
  } catch (err) {
    devicesState.dirty = true;
    console.error('[devices flush error]', err);
  } finally {
    devicesState.flushing = false;
  }
}

const flushInterval = setInterval(() => {
  void flushDevicesToDisk(false);
  void flushProgressToDisk(false);
}, 15_000);
flushInterval.unref();

// --- User Progress Cloud Backup & Auto-Restore Store (RAM cached + 15s atomic disk flush) ---
const ALLOWED_PROGRESS_KEYS = new Set([
  'nq_user_handle',
  'nq_user_activity_v1',
  'nq_bookmarks',
  'nq_quran_last_read',
  'nq_quran_completed_surahs',
  'nq_quran_reciter_id',
  'nq_translation',
  'nq_hifz_mastered_v1',
  'nq_muallimi_soniy_done_v1',
  'nq_tasbih_stats',
  'nq_tasbih_custom',
  'nq_tasbih_prefs',
  'nq_qazo_counts',
  'nq_qazo_profile_v1',
  'nq_ramadan_fasts',
  'nq_juma_salawat_v1',
  'nq_juma_checklist_v1',
  'nq_juma_profile_v1',
  'nq_juma_custom_config_v1',
  'nq_library_progress_v1',
  'nq_library_progress_v2',
  'nq_library_favs_v1',
  'nq_library_font_v1',
  'nq_library_paper_v2',
  'nq_saved_library_v1',
  'nq_wisdom_bookmarks_v1',
  'nq_radio_favorites_v1',
  'nq_radio_last_station_v1',
  'nq_city',
  'nq_language',
  'nq_theme',
  'nq_calcmethod',
  'nq_asrmethod',
  'nq_prayer_adjustments',
  'nq_prayer_alert_prefs',
  'nq_adhan_reciter',
  'nq_home_feature_order_v1',
  'nq_home_page2_learned_v1',
  'nq_onboarding_done',
]);

const progressState = {
  records: {}, // primaryId -> record
  dirty: false,
  flushing: false,
};

async function initProgressCache() {
  const parsed = await readJsonFile(PROGRESS_FILE, { records: {} });
  progressState.records =
    parsed && typeof parsed.records === 'object' && parsed.records ? parsed.records : {};
}

await initProgressCache();

async function flushProgressToDisk(force = false) {
  if ((!progressState.dirty && !force) || progressState.flushing) return;
  progressState.flushing = true;
  progressState.dirty = false;
  try {
    await atomicWriteJson(PROGRESS_FILE, { records: progressState.records }, false);
  } catch (err) {
    progressState.dirty = true;
    console.error('[progress flush error]', err);
  } finally {
    progressState.flushing = false;
  }
}

function generateDeterministicRecoveryCode(seedId) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const digest = crypto.createHash('sha256').update(`nq_rec_v1:${seedId}`).digest();
  let code = '';
  for (let i = 0; i < 6; i += 1) {
    code += alphabet[digest[i] % alphabet.length];
  }
  return `NI-${code}`;
}

function normalizeRecoveryInput(raw) {
  if (typeof raw !== 'string') return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';
  // If looks like a phone number (7+ digits, only digits/+/spaces/dashes/parens), normalize to last 9 digits
  const digitsOnly = trimmed.replace(/\D/g, '');
  if (digitsOnly.length >= 9 && /^[\d+\s()-]+$/.test(trimmed)) {
    return `phone:${digitsOnly.slice(-9)}`;
  }
  return `key:${trimmed.toLowerCase().replace(/\s+/g, '')}`;
}

function hashRecoveryKey(normKey) {
  if (!normKey) return '';
  return crypto.createHash('sha256').update(`nq_rk_v1:${normKey}`).digest('hex').slice(0, 32);
}

function buildRecoveryKeyHint(raw) {
  if (typeof raw !== 'string' || !raw.trim()) return '';
  const trimmed = raw.trim();
  const digitsOnly = trimmed.replace(/\D/g, '');
  if (digitsOnly.length >= 9 && /^[\d+\s()-]+$/.test(trimmed)) {
    return `••• ${digitsOnly.slice(-4)}`;
  }
  if (trimmed.length <= 3) return '•••';
  return `${trimmed.slice(0, 2)}•••${trimmed.slice(-1)}`;
}

function extractSamePhoneSignature(req) {
  const ip = getClientIp(req);
  const ua = String(req.headers['user-agent'] || '');
  // Match Android device model in User-Agent e.g. "Android 14; SM-S918B Build/..." or "Android 13; 2312DRA50G"
  const androidMatch = ua.match(/Android\s+[\d.]+;\s*([^;)]+?)(?:\s+Build\/|\))/i);
  if (!androidMatch || !androidMatch[1]) return '';
  const model = androidMatch[1].trim().toLowerCase().replace(/\s+/g, '_').slice(0, 40);
  if (!model || model === 'k' || model === 'wv' || model.length < 3) return '';
  return crypto.createHash('sha1').update(`nq_fp_v1:${ip}|${model}`).digest('hex').slice(0, 20);
}

function sanitizeProgressSnapshot(raw) {
  if (!raw || typeof raw !== 'object') return {};
  const clean = {};
  let totalBytes = 0;
  for (const [k, v] of Object.entries(raw)) {
    if (!ALLOWED_PROGRESS_KEYS.has(k)) continue;
    if (typeof v !== 'string') continue;
    if (v.length > 24_000) continue;
    totalBytes += k.length + v.length;
    if (totalBytes > 64_000) break;
    clean[k] = v;
  }
  return clean;
}

function safeJsonParse(str, fallback) {
  if (typeof str !== 'string' || !str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

function summarizeSnapshot(snap) {
  const completedSurahsArr = safeJsonParse(snap.nq_quran_completed_surahs, []);
  const bookmarksArr = safeJsonParse(snap.nq_bookmarks, []);
  const tasbihObj = safeJsonParse(snap.nq_tasbih_stats, {});
  const actObj = safeJsonParse(snap.nq_user_activity_v1, {});
  const libObj = safeJsonParse(snap.nq_library_progress_v2, {});
  const ramadanObj = safeJsonParse(snap.nq_ramadan_fasts, {});
  const qazoObj = safeJsonParse(snap.nq_qazo_counts, {});
  const hifzArr = safeJsonParse(snap.nq_hifz_mastered_v1, []);
  const muallimArr = safeJsonParse(snap.nq_muallimi_soniy_done_v1, []);
  const cityObj = safeJsonParse(snap.nq_city, {});
  const lastReadObj = safeJsonParse(snap.nq_quran_last_read, null);

  const completedSurahs = Array.isArray(completedSurahsArr) ? completedSurahsArr.length : 0;
  const bookmarks = Array.isArray(bookmarksArr) ? bookmarksArr.length : 0;
  const tasbihBeads = Math.max(0, Number(tasbihObj?.totalBeads) || 0);
  const namesMastered = Array.isArray(actObj?.masteredNameNumbers) ? actObj.masteredNameNumbers.length : 0;
  const knowledgeMastered = Array.isArray(actObj?.masteredKnowledgeIds) ? actObj.masteredKnowledgeIds.length : 0;
  const quranListenSeconds = Math.max(0, Number(actObj?.quranListenSeconds) || 0);
  const booksStarted = libObj && typeof libObj === 'object' ? Object.keys(libObj).length : 0;
  const fastedDays =
    ramadanObj && typeof ramadanObj === 'object'
      ? Object.values(ramadanObj).filter((v) => v === 'completed').length
      : 0;
  const qazoTotal =
    qazoObj && typeof qazoObj === 'object'
      ? Object.values(qazoObj).reduce((acc, n) => acc + (Number(n) || 0), 0)
      : 0;
  const hifzCount = Array.isArray(hifzArr) ? hifzArr.length : 0;
  const muallimCount = Array.isArray(muallimArr) ? muallimArr.length : 0;
  const hasLastRead = Boolean(lastReadObj && Number(lastReadObj.surahNumber) >= 1);

  const score =
    completedSurahs * 120 +
    bookmarks * 60 +
    Math.min(50_000, Math.floor(tasbihBeads / 2)) +
    namesMastered * 40 +
    knowledgeMastered * 35 +
    Math.floor(quranListenSeconds / 15) +
    booksStarted * 50 +
    fastedDays * 45 +
    (qazoTotal > 0 ? 80 : 0) +
    hifzCount * 40 +
    muallimCount * 35 +
    (hasLastRead ? 40 : 0);

  return {
    score,
    summary: {
      completedSurahs,
      bookmarks,
      tasbihBeads,
      namesMastered,
      knowledgeMastered,
      booksStarted,
      fastedDays,
      handle: cleanStr(snap.nq_user_handle, 24) || '',
      city: cleanStr(cityObj?.cityName, 60) || '',
    },
  };
}

function mergeUniqueArrayJson(aStr, bStr) {
  const a = safeJsonParse(aStr, []);
  const b = safeJsonParse(bStr, []);
  if (!Array.isArray(a) && !Array.isArray(b)) return aStr || bStr || '[]';
  const listA = Array.isArray(a) ? a : [];
  const listB = Array.isArray(b) ? b : [];
  return JSON.stringify(Array.from(new Set([...listA, ...listB])));
}

function mergeSnapshotsServer(olderSnap, newerSnap) {
  const base = { ...olderSnap, ...newerSnap };

  // 1. Set-union arrays of completed IDs
  for (const arrKey of [
    'nq_quran_completed_surahs',
    'nq_hifz_mastered_v1',
    'nq_muallimi_soniy_done_v1',
    'nq_library_favs_v1',
    'nq_radio_favorites_v1',
  ]) {
    if (olderSnap[arrKey] && newerSnap[arrKey]) {
      base[arrKey] = mergeUniqueArrayJson(olderSnap[arrKey], newerSnap[arrKey]);
    } else {
      base[arrKey] = newerSnap[arrKey] || olderSnap[arrKey];
    }
  }

  // 2. Bookmarks union by id or surahNumber:ayahNumber
  if (olderSnap.nq_bookmarks && newerSnap.nq_bookmarks) {
    const bOld = safeJsonParse(olderSnap.nq_bookmarks, []);
    const bNew = safeJsonParse(newerSnap.nq_bookmarks, []);
    if (Array.isArray(bOld) && Array.isArray(bNew)) {
      const map = new Map();
      for (const item of [...bOld, ...bNew]) {
        if (item && typeof item === 'object') {
          const key = item.id || `${item.surahNumber}:${item.ayahNumber}`;
          if (key) map.set(key, item);
        }
      }
      base.nq_bookmarks = JSON.stringify(Array.from(map.values()));
    }
  }

  // 3. User Activity (XP, mastered names, quiz questions, listening seconds)
  if (olderSnap.nq_user_activity_v1 && newerSnap.nq_user_activity_v1) {
    const aOld = safeJsonParse(olderSnap.nq_user_activity_v1, {});
    const aNew = safeJsonParse(newerSnap.nq_user_activity_v1, {});
    const names = Array.from(
      new Set([
        ...(Array.isArray(aOld.masteredNameNumbers) ? aOld.masteredNameNumbers : []),
        ...(Array.isArray(aNew.masteredNameNumbers) ? aNew.masteredNameNumbers : []),
      ])
    );
    const know = Array.from(
      new Set([
        ...(Array.isArray(aOld.masteredKnowledgeIds) ? aOld.masteredKnowledgeIds : []),
        ...(Array.isArray(aNew.masteredKnowledgeIds) ? aNew.masteredKnowledgeIds : []),
      ])
    );
    const missed = Array.from(
      new Set([
        ...(Array.isArray(aOld.missedKnowledgeIds) ? aOld.missedKnowledgeIds : []),
        ...(Array.isArray(aNew.missedKnowledgeIds) ? aNew.missedKnowledgeIds : []),
      ])
    ).filter((id) => !know.includes(id));

    base.nq_user_activity_v1 = JSON.stringify({
      masteredNameNumbers: names,
      quizCorrectTotal: Math.max(Number(aOld.quizCorrectTotal) || 0, Number(aNew.quizCorrectTotal) || 0),
      quizSessionsCompleted: Math.max(
        Number(aOld.quizSessionsCompleted) || 0,
        Number(aNew.quizSessionsCompleted) || 0
      ),
      quizBestStreak: Math.max(Number(aOld.quizBestStreak) || 0, Number(aNew.quizBestStreak) || 0),
      quranListenSeconds: Math.max(Number(aOld.quranListenSeconds) || 0, Number(aNew.quranListenSeconds) || 0),
      masteredKnowledgeIds: know,
      missedKnowledgeIds: missed,
      knowledgeCorrectTotal: Math.max(
        Number(aOld.knowledgeCorrectTotal) || 0,
        Number(aNew.knowledgeCorrectTotal) || 0
      ),
    });
  }

  // 4. Tasbih stats (preserve highest totalBeads)
  if (olderSnap.nq_tasbih_stats && newerSnap.nq_tasbih_stats) {
    const tOld = safeJsonParse(olderSnap.nq_tasbih_stats, {});
    const tNew = safeJsonParse(newerSnap.nq_tasbih_stats, {});
    const oldTotal = Number(tOld.totalBeads) || 0;
    const newTotal = Number(tNew.totalBeads) || 0;
    base.nq_tasbih_stats = JSON.stringify({
      ...(oldTotal > newTotal ? tOld : tNew),
      totalBeads: Math.max(oldTotal, newTotal),
    });
  }

  // 5. Library progress v2 (merge per bookId keeping latest updatedAt)
  if (olderSnap.nq_library_progress_v2 && newerSnap.nq_library_progress_v2) {
    const lOld = safeJsonParse(olderSnap.nq_library_progress_v2, {});
    const lNew = safeJsonParse(newerSnap.nq_library_progress_v2, {});
    if (lOld && typeof lOld === 'object' && lNew && typeof lNew === 'object') {
      const mergedLib = { ...lOld };
      for (const [bookId, entry] of Object.entries(lNew)) {
        const prev = mergedLib[bookId];
        if (!prev || (Number(entry?.updatedAt) || 0) >= (Number(prev?.updatedAt) || 0)) {
          mergedLib[bookId] = entry;
        }
      }
      base.nq_library_progress_v2 = JSON.stringify(mergedLib);
    }
  }

  // 6. Ramadan fasts (merge per day)
  if (olderSnap.nq_ramadan_fasts && newerSnap.nq_ramadan_fasts) {
    const rOld = safeJsonParse(olderSnap.nq_ramadan_fasts, {});
    const rNew = safeJsonParse(newerSnap.nq_ramadan_fasts, {});
    if (rOld && typeof rOld === 'object' && rNew && typeof rNew === 'object') {
      base.nq_ramadan_fasts = JSON.stringify({ ...rOld, ...rNew });
    }
  }

  // Clear undefined keys
  for (const k of Object.keys(base)) {
    if (base[k] === undefined) delete base[k];
  }
  return base;
}

function findProgressRecord({ hardwareId = '', deviceId = '', codeOrKey = '', deviceFp = '', allowFpMatch = false }) {
  const records = Object.values(progressState.records);

  // 1. Explicit Recovery Code or Linked Phone/Secret Key search
  if (codeOrKey) {
    const cleanCode = codeOrKey.trim().toUpperCase();
    const withPrefix = cleanCode.startsWith('NI-') ? cleanCode : `NI-${cleanCode}`;
    const normKey = normalizeRecoveryInput(codeOrKey);
    const keyHash = hashRecoveryKey(normKey);

    let bestMatch = null;
    for (const rec of records) {
      if (!rec) continue;
      const codeMatched =
        rec.recoveryCode &&
        (rec.recoveryCode.toUpperCase() === cleanCode || rec.recoveryCode.toUpperCase() === withPrefix);
      const handleMatched =
        rec.summary?.handle &&
        (rec.summary.handle.toUpperCase() === cleanCode || rec.summary.handle.toUpperCase() === withPrefix);
      const keyMatched = Boolean(keyHash && rec.recoveryKeyHash && rec.recoveryKeyHash === keyHash);
      if (codeMatched || handleMatched || keyMatched) {
        if (!bestMatch || (rec.score || 0) > (bestMatch.score || 0)) {
          bestMatch = rec;
        }
      }
    }
    return bestMatch ? { record: bestMatch, matchedBy: 'code' } : { record: null, matchedBy: '' };
  }

  // 2. Exact Android Hardware ID match (survives uninstall & reinstall on same phone)
  if (hardwareId && validDeviceId(hardwareId)) {
    const directHw = progressState.records[hardwareId];
    if (directHw) return { record: directHw, matchedBy: 'hardwareId' };
    for (const rec of records) {
      if (rec && (rec.hardwareId === hardwareId || (Array.isArray(rec.deviceIds) && rec.deviceIds.includes(hardwareId)))) {
        return { record: rec, matchedBy: 'hardwareId' };
      }
    }
  }

  // 3. Exact Device ID match
  if (deviceId && validDeviceId(deviceId)) {
    const directDev = progressState.records[deviceId];
    if (directDev) return { record: directDev, matchedBy: 'deviceId' };
    for (const rec of records) {
      if (rec && Array.isArray(rec.deviceIds) && rec.deviceIds.includes(deviceId)) {
        return { record: rec, matchedBy: 'deviceId' };
      }
    }
  }

  // 4. Automatic Same-Phone Reinstall Fingerprint Match (Same IP + Exact Android Phone Model within 30 days)
  if (allowFpMatch && deviceFp) {
    const cutoffMs = Date.now() - 30 * 86400_000;
    let bestFpRec = null;
    for (const rec of records) {
      if (!rec || rec.deviceFp !== deviceFp) continue;
      const hasData = (rec.score || 0) > 0 || Boolean(rec.summary?.city || rec.summary?.handle);
      if (!hasData) continue;
      const updatedMs = Date.parse(rec.updatedAt || '') || 0;
      if (updatedMs < cutoffMs) continue;
      if (!bestFpRec || (rec.score || 0) > (bestFpRec.score || 0)) {
        bestFpRec = rec;
      }
    }
    if (bestFpRec) {
      return { record: bestFpRec, matchedBy: 'deviceFingerprint' };
    }
  }

  return { record: null, matchedBy: '' };
}

// --- Per-Device Controls Store (RAM cached for instant O(1) live sync) ---
const ALLOWED_CONTROL_FEATURES = new Set([
  'ehson',
  'haramain',
  'radio',
  'library',
  'namesBattle',
  'masjids',
  'feedback',
  'zakat',
  'ramadan',
]);

let deviceControlsCache = (await readJsonFile(DEVICE_CONTROLS_FILE, { controls: {} }))?.controls || {};
if (!deviceControlsCache || typeof deviceControlsCache !== 'object') deviceControlsCache = {};

function sanitizeDeviceControl(raw, existing = {}) {
  const b = raw && typeof raw === 'object' ? raw : {};
  const role = ['user', 'tester', 'vip'].includes(b.role) ? b.role : existing.role || 'user';
  const disabledFeatures = Array.isArray(b.disabledFeatures)
    ? Array.from(new Set(b.disabledFeatures.filter((x) => ALLOWED_CONTROL_FEATURES.has(x))))
    : Array.isArray(existing.disabledFeatures)
    ? existing.disabledFeatures
    : [];

  let directMessage = existing.directMessage || null;
  if (b.clearDirectMessage === true || b.directMessage === null) {
    directMessage = null;
  } else if (b.directMessage && typeof b.directMessage === 'object') {
    const title = cleanStr(b.directMessage.title, 120);
    const body = cleanStr(b.directMessage.body, 400);
    if (title || body) {
      const tone = ['emerald', 'gold', 'urgent'].includes(b.directMessage.tone)
        ? b.directMessage.tone
        : 'emerald';
      const actionTab = ALLOWED_BROADCAST_TABS.has(b.directMessage.actionTab) ? b.directMessage.actionTab : '';
      const actionUrl = cleanUrl(b.directMessage.actionUrl, 300);
      const changed =
        !existing.directMessage ||
        existing.directMessage.title !== title ||
        existing.directMessage.body !== body ||
        existing.directMessage.tone !== tone;
      directMessage = {
        id: changed ? crypto.randomUUID() : existing.directMessage.id,
        title: title || 'Nurul Islam',
        body,
        tone,
        actionTab,
        actionUrl,
        sentAt: changed ? new Date().toISOString() : existing.directMessage.sentAt,
        seenAt: changed ? null : existing.directMessage.seenAt || null,
      };
    }
  }

  return {
    label: b.label !== undefined ? cleanStr(b.label, 80) : existing.label || '',
    notes: b.notes !== undefined ? cleanStr(b.notes, 300) : existing.notes || '',
    role,
    bypassMaintenance:
      b.bypassMaintenance !== undefined ? Boolean(b.bypassMaintenance) : Boolean(existing.bypassMaintenance),
    blocked: b.blocked !== undefined ? Boolean(b.blocked) : Boolean(existing.blocked),
    blockReason: b.blockReason !== undefined ? cleanStr(b.blockReason, 300) : existing.blockReason || '',
    disabledFeatures,
    directMessage,
    pendingCommand: existing.pendingCommand || null,
    updatedAt: new Date().toISOString(),
  };
}

function withDeviceControlsWrite(mutator) {
  const next = deviceControlsChain.then(async () => {
    const res = await mutator(deviceControlsCache);
    await atomicWriteJson(DEVICE_CONTROLS_FILE, { controls: deviceControlsCache }, true);
    bumpSyncVersion();
    return res;
  });
  deviceControlsChain = next.catch(() => {});
  return next;
}

function getDeviceControl(deviceId) {
  if (!deviceId || !validDeviceId(deviceId)) return null;
  return deviceControlsCache[deviceId] || null;
}

function isDeviceBlockedOrRestricted(deviceId, featureKey = null) {
  const ctrl = getDeviceControl(deviceId);
  if (!ctrl) return { blocked: false, reason: '' };
  if (ctrl.blocked) {
    return {
      blocked: true,
      reason: ctrl.blockReason || 'Ushbu qurilmaga cheklov qo‘yilgan.',
    };
  }
  if (featureKey && Array.isArray(ctrl.disabledFeatures) && ctrl.disabledFeatures.includes(featureKey)) {
    return {
      blocked: true,
      reason: 'Ushbu bo‘lim sizning qurilmangiz uchun vaqtincha cheklangan.',
    };
  }
  return { blocked: false, reason: '' };
}

function buildPublicDeviceDirective(deviceId) {
  const ctrl = getDeviceControl(deviceId);
  if (!ctrl) {
    return {
      role: 'user',
      bypassMaintenance: false,
      blocked: false,
      blockReason: '',
      disabledFeatures: [],
      directMessage: null,
      pendingCommand: null,
    };
  }
  return {
    role: ctrl.role || 'user',
    bypassMaintenance: Boolean(ctrl.bypassMaintenance),
    blocked: Boolean(ctrl.blocked),
    blockReason: ctrl.blockReason || '',
    disabledFeatures: Array.isArray(ctrl.disabledFeatures) ? ctrl.disabledFeatures : [],
    directMessage:
      ctrl.directMessage && !ctrl.directMessage.seenAt
        ? {
            id: ctrl.directMessage.id,
            title: ctrl.directMessage.title,
            body: ctrl.directMessage.body,
            tone: ctrl.directMessage.tone,
            actionTab: ctrl.directMessage.actionTab || '',
            actionUrl: ctrl.directMessage.actionUrl || '',
            sentAt: ctrl.directMessage.sentAt,
          }
        : null,
    pendingCommand:
      ctrl.pendingCommand && !ctrl.pendingCommand.executedAt
        ? {
            id: ctrl.pendingCommand.id,
            type: ctrl.pendingCommand.type,
            issuedAt: ctrl.pendingCommand.issuedAt,
          }
        : null,
  };
}

// --- Broadcasts Store (RAM cached for fast /api/app-sync) ---
let broadcastsCache = (await readJsonFile(BROADCASTS_FILE, { broadcasts: [] }))?.broadcasts || [];
if (!Array.isArray(broadcastsCache)) broadcastsCache = [];

function withBroadcastsWrite(mutator) {
  const next = broadcastsChain.then(async () => {
    const db = { broadcasts: broadcastsCache };
    const res = await mutator(db);
    broadcastsCache = db.broadcasts;
    await atomicWriteJson(BROADCASTS_FILE, db, true);
    bumpSyncVersion();
    return res;
  });
  broadcastsChain = next.catch(() => {});
  return next;
}

function filterActiveBroadcasts({ lang = '', platform = '', city = '', versionCode = 0 } = {}) {
  if (cachedAppConfig.features.broadcasts === false) return [];
  const nowMs = Date.now();
  const normCity = cleanStr(city, 80).toLowerCase();
  const vCode = Number(versionCode) || 0;

  return broadcastsCache
    .filter((item) => {
      if (!item || item.active === false) return false;
      if (item.startsAt) {
        const stMs = Date.parse(item.startsAt);
        if (Number.isFinite(stMs) && stMs > nowMs) return false;
      }
      if (item.expiresAt) {
        const expMs = Date.parse(item.expiresAt);
        if (Number.isFinite(expMs) && expMs < nowMs) return false;
      }
      if (lang && Array.isArray(item.languages) && item.languages.length > 0 && !item.languages.includes(lang)) {
        return false;
      }
      if (platform && Array.isArray(item.platforms) && item.platforms.length > 0 && !item.platforms.includes(platform)) {
        return false;
      }
      if (Array.isArray(item.cities) && item.cities.length > 0) {
        if (!normCity) return false;
        const matched = item.cities.some((c) => normCity.includes(String(c).toLowerCase()));
        if (!matched) return false;
      }
      if (Number.isInteger(item.maxVersionCode) && item.maxVersionCode > 0 && vCode > 0) {
        if (vCode > item.maxVersionCode) return false;
      }
      return true;
    })
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    .slice(0, 6);
}

// --- Live Remote App Config Store ---
const DEFAULT_APP_CONFIG = {
  updatedAt: null,
  forceWebReloadNonce: 0,
  hijriDayOffset: 0,
  ramadanMode: 'auto',
  features: {
    ehson: true,
    haramain: true,
    radio: true,
    library: true,
    namesBattle: true,
    masjids: true,
    broadcasts: true,
    zakat: true,
    ramadan: true,
  },
  haramainLive: {
    makkahUrl: '',
    madinahUrl: '',
  },
  maintenance: {
    enabled: false,
    title: '',
    message: '',
  },
  zakat: {
    goldPriceUsd: 85,
    officialNisabUzs: 0,
    nisabNote: '',
  },
  links: {
    playStoreUrl: 'https://play.google.com/store/apps/details?id=app.nurul.islam',
    telegramUrl: 'https://t.me/nurulislam_uz',
    supportEmail: 'MuhammadaliAbdullayevv@gmail.com',
    privacyPolicyUrl: 'https://nurulislam.mabdullayev.dev/privacy.html',
    websiteUrl: 'https://nurulislam.mabdullayev.dev',
  },
  radio: {
    disabledStationIds: [],
    extraStations: [],
  },
  prayerNotice: {
    enabled: false,
    text: '',
  },
  reviewPrompt: {
    enabled: true,
    minOpens: 5,
  },
};

function cleanUrl(val, max = 300) {
  const s = cleanStr(val, max);
  if (!s) return '';
  return /^https?:\/\//i.test(s) ? s : '';
}

function sanitizeAppConfig(raw) {
  const src = raw && typeof raw === 'object' ? raw : {};
  const f = src.features && typeof src.features === 'object' ? src.features : {};
  const m = src.maintenance && typeof src.maintenance === 'object' ? src.maintenance : {};
  const z = src.zakat && typeof src.zakat === 'object' ? src.zakat : {};
  const l = src.links && typeof src.links === 'object' ? src.links : {};
  const r = src.radio && typeof src.radio === 'object' ? src.radio : {};
  const hl = src.haramainLive && typeof src.haramainLive === 'object' ? src.haramainLive : {};
  const p = src.prayerNotice && typeof src.prayerNotice === 'object' ? src.prayerNotice : {};
  const rp = src.reviewPrompt && typeof src.reviewPrompt === 'object' ? src.reviewPrompt : {};

  const hijriRaw = Number(src.hijriDayOffset);
  const hijriDayOffset = Number.isFinite(hijriRaw) ? Math.max(-2, Math.min(2, Math.round(hijriRaw))) : 0;
  const ramadanMode = ['auto', 'force_on', 'force_off'].includes(src.ramadanMode) ? src.ramadanMode : 'auto';

  const disabledStationIds = Array.isArray(r.disabledStationIds)
    ? r.disabledStationIds.map((x) => cleanStr(x, 60)).filter(Boolean).slice(0, 50)
    : [];

  const extraStations = Array.isArray(r.extraStations)
    ? r.extraStations
        .map((st) => {
          if (!st || typeof st !== 'object') return null;
          const id = cleanStr(st.id, 48).replace(/[^a-zA-Z0-9_-]/g, '');
          const name = cleanStr(st.name, 80);
          const streamUrl = cleanUrl(st.streamUrl, 300);
          if (!id || !name || !streamUrl) return null;
          return {
            id,
            name,
            arabicName: cleanStr(st.arabicName, 80) || name,
            subtitle: cleanStr(st.subtitle, 100) || '24/7 Live Stream',
            category: ['reciters', 'haramain', 'calm'].includes(st.category) ? st.category : 'reciters',
            streamUrl,
          };
        })
        .filter(Boolean)
        .slice(0, 20)
    : [];

  const goldPriceUsd = Number(z.goldPriceUsd);
  const officialNisabUzs = Number(z.officialNisabUzs);
  const minOpens = Number(rp.minOpens);
  const reloadNonce = Number(src.forceWebReloadNonce);

  return {
    updatedAt: typeof src.updatedAt === 'string' ? src.updatedAt : null,
    forceWebReloadNonce: Number.isFinite(reloadNonce) && reloadNonce >= 0 ? Math.floor(reloadNonce) : 0,
    hijriDayOffset,
    ramadanMode,
    features: {
      ehson: f.ehson !== false,
      haramain: f.haramain !== false,
      radio: f.radio !== false,
      library: f.library !== false,
      namesBattle: f.namesBattle !== false,
      masjids: f.masjids !== false,
      broadcasts: f.broadcasts !== false,
      zakat: f.zakat !== false,
      ramadan: f.ramadan !== false,
    },
    haramainLive: {
      makkahUrl: cleanUrl(hl.makkahUrl, 300),
      madinahUrl: cleanUrl(hl.madinahUrl, 300),
    },
    maintenance: {
      enabled: Boolean(m.enabled),
      title: cleanStr(m.title, 120),
      message: cleanStr(m.message, 400),
    },
    zakat: {
      goldPriceUsd:
        Number.isFinite(goldPriceUsd) && goldPriceUsd > 10 && goldPriceUsd < 5000
          ? Math.round(goldPriceUsd * 100) / 100
          : DEFAULT_APP_CONFIG.zakat.goldPriceUsd,
      officialNisabUzs: Number.isFinite(officialNisabUzs) && officialNisabUzs >= 0 ? Math.round(officialNisabUzs) : 0,
      nisabNote: cleanStr(z.nisabNote, 200),
    },
    links: {
      playStoreUrl: cleanUrl(l.playStoreUrl, 300) || DEFAULT_APP_CONFIG.links.playStoreUrl,
      telegramUrl: cleanUrl(l.telegramUrl, 300) || DEFAULT_APP_CONFIG.links.telegramUrl,
      supportEmail: cleanStr(l.supportEmail, 120) || DEFAULT_APP_CONFIG.links.supportEmail,
      privacyPolicyUrl: cleanUrl(l.privacyPolicyUrl, 300) || DEFAULT_APP_CONFIG.links.privacyPolicyUrl,
      websiteUrl: cleanUrl(l.websiteUrl, 300) || DEFAULT_APP_CONFIG.links.websiteUrl,
    },
    radio: {
      disabledStationIds,
      extraStations,
    },
    prayerNotice: {
      enabled: Boolean(p.enabled),
      text: cleanStr(p.text, 240),
    },
    reviewPrompt: {
      enabled: rp.enabled !== false,
      minOpens: Number.isFinite(minOpens) ? Math.max(2, Math.min(50, Math.round(minOpens))) : 5,
    },
  };
}

let cachedAppConfig = sanitizeAppConfig(await readJsonFile(APP_CONFIG_FILE, DEFAULT_APP_CONFIG));

function writeAppConfig(nextRaw) {
  const next = configChain.then(async () => {
    const clean = sanitizeAppConfig({
      ...cachedAppConfig,
      ...nextRaw,
      updatedAt: new Date().toISOString(),
    });
    await atomicWriteJson(APP_CONFIG_FILE, clean, true);
    cachedAppConfig = clean;
    bumpSyncVersion();
    return clean;
  });
  configChain = next.catch(() => {});
  return next;
}

// --- Feedback & Bug Inbox Store ---
async function readFeedbackDb() {
  const parsed = await readJsonFile(FEEDBACK_FILE, { items: [] });
  return { items: Array.isArray(parsed?.items) ? parsed.items : [] };
}

function withFeedbackWrite(mutator) {
  const next = feedbackChain.then(async () => {
    const db = await readFeedbackDb();
    const res = await mutator(db);
    if (db.items.length > 1000) db.items = db.items.slice(0, 1000);
    await atomicWriteJson(FEEDBACK_FILE, db, true);
    return res;
  });
  feedbackChain = next.catch(() => {});
  return next;
}

// --- Client Crash / Error Monitor Store ---
async function readErrorsDb() {
  const parsed = await readJsonFile(ERRORS_FILE, { items: [] });
  return { items: Array.isArray(parsed?.items) ? parsed.items : [] };
}

function withErrorsWrite(mutator) {
  const next = errorsChain.then(async () => {
    const db = await readErrorsDb();
    const res = await mutator(db);
    if (db.items.length > 250) db.items = db.items.slice(0, 250);
    await atomicWriteJson(ERRORS_FILE, db, true);
    return res;
  });
  errorsChain = next.catch(() => {});
  return next;
}

// --- Owner Telegram Alerts Store (mode 0600, never exposed in plaintext!) ---
const DEFAULT_TELEGRAM_CFG = {
  enabled: false,
  botToken: '',
  chatId: '',
  onFeedback: true,
  onEhsonPledge: true,
  onCrash: true,
  onLoginFail: true,
  updatedAt: null,
};

let telegramCfg = {
  ...DEFAULT_TELEGRAM_CFG,
  ...(await readJsonFile(TELEGRAM_FILE, DEFAULT_TELEGRAM_CFG)),
};

function sanitizeTelegramForOwner(cfg) {
  const tok = cfg.botToken || '';
  const maskedToken = tok.length > 10 ? `${tok.slice(0, 6)}...${tok.slice(-4)}` : tok ? '***' : '';
  return {
    enabled: Boolean(cfg.enabled),
    hasToken: Boolean(tok),
    maskedToken,
    chatId: cfg.chatId || '',
    onFeedback: cfg.onFeedback !== false,
    onEhsonPledge: cfg.onEhsonPledge !== false,
    onCrash: cfg.onCrash !== false,
    onLoginFail: cfg.onLoginFail !== false,
    updatedAt: cfg.updatedAt || null,
  };
}

function writeTelegramConfig(patch) {
  const next = telegramChain.then(async () => {
    const newToken = typeof patch.botToken === 'string' && patch.botToken.trim().length > 10
      ? patch.botToken.trim().slice(0, 120)
      : patch.clearToken === true
      ? ''
      : telegramCfg.botToken;
    const updated = {
      enabled: patch.enabled !== undefined ? Boolean(patch.enabled) : Boolean(telegramCfg.enabled),
      botToken: newToken,
      chatId: patch.chatId !== undefined ? cleanStr(String(patch.chatId), 40) : telegramCfg.chatId,
      onFeedback: patch.onFeedback !== undefined ? Boolean(patch.onFeedback) : telegramCfg.onFeedback,
      onEhsonPledge: patch.onEhsonPledge !== undefined ? Boolean(patch.onEhsonPledge) : telegramCfg.onEhsonPledge,
      onCrash: patch.onCrash !== undefined ? Boolean(patch.onCrash) : telegramCfg.onCrash,
      onLoginFail: patch.onLoginFail !== undefined ? Boolean(patch.onLoginFail) : telegramCfg.onLoginFail,
      updatedAt: new Date().toISOString(),
    };
    await atomicWriteJson(TELEGRAM_FILE, updated, true, 0o600);
    telegramCfg = updated;
    return updated;
  });
  telegramChain = next.catch(() => {});
  return next;
}

async function sendOwnerTelegramAlert(text, force = false) {
  if ((!telegramCfg.enabled && !force) || !telegramCfg.botToken || !telegramCfg.chatId) {
    return { ok: false, error: 'Telegram alerts not configured' };
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(`https://api.telegram.org/bot${telegramCfg.botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: telegramCfg.chatId,
        text: String(text).slice(0, 3800),
        disable_web_page_preview: true,
      }),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      return { ok: false, error: data.description || `HTTP ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Network error' };
  } finally {
    clearTimeout(timer);
  }
}

// --- Audit Log Store ---
async function readAuditDb() {
  const parsed = await readJsonFile(AUDIT_FILE, { entries: [] });
  return { entries: Array.isArray(parsed?.entries) ? parsed.entries : [] };
}

function recordAudit(action, detail, req) {
  const ip = req ? maskIp(getClientIp(req)) : 'system';
  const entry = {
    id: crypto.randomUUID(),
    action: cleanStr(action, 60),
    detail: cleanStr(detail, 260),
    ip,
    at: new Date().toISOString(),
  };
  const next = auditChain.then(async () => {
    const db = await readAuditDb();
    db.entries.unshift(entry);
    if (db.entries.length > 250) db.entries = db.entries.slice(0, 250);
    await atomicWriteJson(AUDIT_FILE, db, true);
    return entry;
  });
  auditChain = next.catch(() => {});
  return next;
}

// --- OTA version.json Writer ---
function writeVersionJson(nextObj) {
  const next = versionChain.then(async () => {
    await atomicWriteJson(VERSION_JSON_PATH, nextObj, true);
    bumpSyncVersion();
    return nextObj;
  });
  versionChain = next.catch(() => {});
  return next;
}

// =========================================================================
// Helpers
// =========================================================================
function sendJson(res, status, data, extraHeaders = {}) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, If-None-Match',
    'Access-Control-Expose-Headers': 'ETag',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'X-Content-Type-Options': 'nosniff',
    ...extraHeaders,
  });
  res.end(body);
}

async function readBodyJson(req, limitBytes = 131072) {
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if (total > limitBytes) throw new Error('Payload too large');
    chunks.push(chunk);
  }
  const str = Buffer.concat(chunks).toString('utf8').trim();
  return str ? JSON.parse(str) : {};
}

function sanitizeCampaignForPublic(c, deviceId) {
  const rsvps = Array.isArray(c.rsvpDevices) ? c.rsvpDevices : [];
  const pledges = Array.isArray(c.pledges) ? c.pledges : [];
  return {
    id: c.id,
    category: c.category,
    status: c.status || 'active',
    masjidName: c.masjidName,
    masjidAddress: c.masjidAddress || '',
    lat: c.lat,
    lng: c.lng,
    title: c.title,
    description: c.description || '',
    eventDateTime: c.eventDateTime || '',
    volunteersNeeded: Number(c.volunteersNeeded) || 0,
    rsvpCount: rsvps.length,
    joinedByMe: Boolean(deviceId && rsvps.includes(deviceId)),
    itemNeedLabel: c.itemNeedLabel || '',
    pledgeCount: pledges.length,
    pledgedByMe: Boolean(deviceId && pledges.some((p) => p.deviceId === deviceId)),
    targetAmount: Number(c.targetAmount) || 0,
    raisedAmount: Number(c.raisedAmount) || 0,
    cardNumber: c.cardNumber || '',
    cardHolder: c.cardHolder || '',
    paymentUrl: c.paymentUrl || '',
    verifiedNote: c.verifiedNote || '',
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}

function cleanStr(val, max = 300) {
  return typeof val === 'string' ? val.trim().slice(0, max) : '';
}

function validDeviceId(id) {
  return typeof id === 'string' && /^[a-zA-Z0-9_-]{8,80}$/.test(id);
}

function getUzDateStr(tsMs = Date.now()) {
  return new Date(tsMs + 5 * 3600_000).toISOString().slice(0, 10);
}

function countBy(items, keyFn) {
  const map = new Map();
  for (const item of items) {
    const k = keyFn(item) || 'Unknown';
    map.set(k, (map.get(k) || 0) + 1);
  }
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({ label, count }));
}

function csvEscape(val) {
  const s = String(val ?? '');
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const ALLOWED_BROADCAST_TABS = new Set([
  '',
  'quran',
  'haramain',
  'library',
  'radio',
  'prayer',
  'ramadan',
  'ehson',
  'masjids',
  'juma',
  'names',
  'quiz',
  'zakat',
  'qazo',
  'guide',
  'tajweed',
  'wisdom',
  'fiqh',
  'hifz',
  'seerah',
  'life',
  'azkar',
]);

const ALLOWED_LANGS = new Set(['uz_lat', 'uz_cyr', 'ru', 'en']);
const ALLOWED_PLATFORMS = new Set(['android', 'android-play', 'desktop', 'web']);

// =========================================================================
// Real-Time 99 Names 1v1 Quiz Battle Engine (10 Questions per Match)
// =========================================================================
const QUESTION_TIME_LIMIT_MS = 12_000;
const REVEAL_PAUSE_MS = 1_500;
const BATTLE_ROOMS = new Map();

const BOT_PROFILES = [
  { handle: 'Zukko_Tolib', city: 'Samarqand' },
  { handle: 'Al_Buxoriy_99', city: 'Buxoro' },
  { handle: 'Ixlos_Nur', city: 'Toshkent' },
  { handle: 'Fargona_Ilm', city: 'Farg‘ona' },
  { handle: 'Andijon_Ziyo', city: 'Andijon' },
  { handle: 'Xorazm_Hikmat', city: 'Urganch' },
];

function shuffleNums(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }
  return copy;
}

function generate10NamesQuestions(count = 10) {
  const all99 = Array.from({ length: 99 }, (_, i) => i + 1);
  const targets = shuffleNums(all99).slice(0, count);
  return targets.map((target) => {
    const pool = shuffleNums(all99.filter((n) => n !== target && Math.abs(n - target) > 1));
    const distractors = pool.slice(0, 3);
    return { target, options: shuffleNums([target, ...distractors]) };
  });
}

function generateRoomCode() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const code = String(Math.floor(1000 + Math.random() * 9000));
    let taken = false;
    for (const r of BATTLE_ROOMS.values()) {
      if (r.roomCode === code && r.status !== 'finished') {
        taken = true;
        break;
      }
    }
    if (!taken) return code;
  }
  return String(Math.floor(1000 + Math.random() * 9000));
}

function createPlayerSlot(deviceId, handle, city, isBot = false) {
  return {
    deviceId,
    handle: cleanStr(handle, 24) || 'NI-Tolib',
    city: cleanStr(city, 40) || 'Toshkent',
    isBot,
    score: 0,
    correctCount: 0,
    answers: {},
    lastSeenAt: Date.now(),
  };
}

function cleanupStaleBattleRooms() {
  const now = Date.now();
  for (const [id, room] of BATTLE_ROOMS.entries()) {
    const maxAge = room.status === 'waiting' ? 10 * 60_000 : 25 * 60_000;
    if (now - room.updatedAt > maxAge) BATTLE_ROOMS.delete(id);
  }
}

function scheduleBotAnswerForQuestion(room, qIndex) {
  if (!room.player2 || !room.player2.isBot) return;
  if (room.botScheduledForQ === qIndex) return;
  room.botScheduledForQ = qIndex;
  const q = room.questions[qIndex];
  if (!q) return;
  const isCorrect = Math.random() < 0.76;
  const delayMs = Math.floor(2400 + Math.random() * 4200);
  room.botNextAnswerAt = room.questionStartedAt + delayMs;
  const wrongOpts = q.options.filter((n) => n !== q.target);
  room.botPlannedPick = isCorrect
    ? q.target
    : wrongOpts[Math.floor(Math.random() * wrongOpts.length)] || q.options[0];
}

function tickBattleRoom(room) {
  if (!room || room.status !== 'playing') return;
  const now = Date.now();
  const qIdx = room.currentQuestionIndex;
  if (qIdx >= room.questions.length) {
    room.status = 'finished';
    room.updatedAt = now;
    return;
  }
  if (room.player2 && room.player2.isBot) {
    scheduleBotAnswerForQuestion(room, qIdx);
    if (!room.player2.answers[qIdx] && now >= (room.botNextAnswerAt || 0)) {
      recordBattleAnswer(room, room.player2.deviceId, qIdx, room.botPlannedPick);
    }
  }
  const p1Ans = Boolean(room.player1?.answers[qIdx]);
  const p2Ans = Boolean(room.player2?.answers[qIdx]);
  const elapsed = now - room.questionStartedAt;

  if (p1Ans && p2Ans) {
    if (!room.bothAnsweredAt) room.bothAnsweredAt = now;
    if (now - room.bothAnsweredAt >= REVEAL_PAUSE_MS) advanceBattleQuestion(room, now);
  } else if (elapsed >= QUESTION_TIME_LIMIT_MS + REVEAL_PAUSE_MS) {
    if (room.player1 && !room.player1.answers[qIdx]) {
      room.player1.answers[qIdx] = { pickedNumber: 0, isCorrect: false, points: 0, timeMs: QUESTION_TIME_LIMIT_MS };
    }
    if (room.player2 && !room.player2.answers[qIdx]) {
      room.player2.answers[qIdx] = { pickedNumber: 0, isCorrect: false, points: 0, timeMs: QUESTION_TIME_LIMIT_MS };
    }
    advanceBattleQuestion(room, now);
  }
}

function advanceBattleQuestion(room, now = Date.now()) {
  if (room.currentQuestionIndex + 1 >= room.questions.length) {
    room.status = 'finished';
    room.finishedAt = now;
    room.updatedAt = now;
  } else {
    room.currentQuestionIndex += 1;
    room.questionStartedAt = now;
    room.bothAnsweredAt = null;
    room.updatedAt = now;
    if (room.player2 && room.player2.isBot) scheduleBotAnswerForQuestion(room, room.currentQuestionIndex);
  }
}

function recordBattleAnswer(room, deviceId, qIndex, pickedNumber) {
  if (!room || room.status !== 'playing' || qIndex !== room.currentQuestionIndex) return false;
  const player =
    room.player1?.deviceId === deviceId
      ? room.player1
      : room.player2?.deviceId === deviceId
      ? room.player2
      : null;
  if (!player || player.answers[qIndex]) return false;
  const q = room.questions[qIndex];
  if (!q) return false;
  const now = Date.now();
  const timeMs = Math.max(200, Math.min(QUESTION_TIME_LIMIT_MS, now - room.questionStartedAt));
  const isCorrect = Number(pickedNumber) === q.target;
  const speedBonus = isCorrect
    ? Math.max(10, Math.round(((QUESTION_TIME_LIMIT_MS - timeMs) / QUESTION_TIME_LIMIT_MS) * 50))
    : 0;
  const points = isCorrect ? 100 + speedBonus : 0;

  player.answers[qIndex] = { pickedNumber: Number(pickedNumber) || 0, isCorrect, points, timeMs };
  if (isCorrect) {
    player.score += points;
    player.correctCount += 1;
  }
  player.lastSeenAt = now;
  room.updatedAt = now;
  if (room.player1?.answers[qIndex] && room.player2?.answers[qIndex] && !room.bothAnsweredAt) {
    room.bothAnsweredAt = now;
  }
  return true;
}

function serializePlayerForClient(p, totalQuestions, revealCurrentIdx, viewerDeviceId) {
  if (!p) return null;
  const isViewer = p.deviceId === viewerDeviceId;
  const history = [];
  for (let i = 0; i < totalQuestions; i += 1) {
    const ans = p.answers[i];
    if (!ans) history.push({ answered: false, isCorrect: null, pickedNumber: null, points: 0 });
    else if (isViewer || i < revealCurrentIdx) {
      history.push({ answered: true, isCorrect: ans.isCorrect, pickedNumber: ans.pickedNumber, points: ans.points });
    } else {
      history.push({ answered: true, isCorrect: ans.isCorrect, pickedNumber: null, points: ans.points });
    }
  }
  return {
    deviceId: p.deviceId,
    handle: p.handle,
    city: p.city,
    isBot: Boolean(p.isBot),
    score: p.score,
    correctCount: p.correctCount,
    history,
  };
}

function serializeBattleRoom(room, viewerDeviceId) {
  tickBattleRoom(room);
  const now = Date.now();
  const qIdx = room.currentQuestionIndex;
  const elapsed = room.status === 'playing' ? Math.max(0, now - room.questionStartedAt) : 0;
  const remainingMs = room.status === 'playing' ? Math.max(0, QUESTION_TIME_LIMIT_MS - elapsed) : 0;
  const bothAnswered = Boolean(room.player1?.answers[qIdx] && room.player2?.answers[qIdx]);
  const revealUpTo =
    room.status === 'finished' ? room.questions.length : bothAnswered || remainingMs === 0 ? qIdx + 1 : qIdx;
  return {
    roomId: room.roomId,
    roomCode: room.roomCode,
    isPublic: room.isPublic,
    status: room.status,
    currentQuestionIndex: qIdx,
    totalQuestions: room.questions.length,
    questionTimeLimitMs: QUESTION_TIME_LIMIT_MS,
    questionRemainingMs: remainingMs,
    bothAnsweredCurrent: bothAnswered,
    questions: room.questions,
    player1: serializePlayerForClient(room.player1, room.questions.length, revealUpTo, viewerDeviceId),
    player2: serializePlayerForClient(room.player2, room.questions.length, revealUpTo, viewerDeviceId),
  };
}

function getBattleSummary() {
  cleanupStaleBattleRooms();
  const now = Date.now();
  const seenIds = new Set();
  let playing = 0;
  let waiting = 0;
  for (const r of BATTLE_ROOMS.values()) {
    if (seenIds.has(r.roomId)) continue;
    seenIds.add(r.roomId);
    if (r.status === 'playing' && now - r.updatedAt < 120_000) playing += 1;
    else if (r.status === 'waiting' && now - r.updatedAt < 180_000) waiting += 1;
  }
  return { activeMatches: playing, waitingRooms: waiting };
}

function countOnlineNow() {
  const now = Date.now();
  const cutoff = 2 * 60_000;
  let count = 0;
  const counted = new Set();
  for (const [id, ts] of devicesState.lastLiveSyncMs.entries()) {
    if (now - ts <= cutoff) {
      count += 1;
      counted.add(id);
    }
  }
  for (const d of Object.values(devicesState.devices)) {
    if (!counted.has(d.id) && now - (Date.parse(d.lastSeenAt || '') || 0) <= cutoff) {
      count += 1;
    }
  }
  return count;
}

// =========================================================================
// HTTP Server
// =========================================================================
const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, If-None-Match',
        'Access-Control-Expose-Headers': 'ETag',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      });
      res.end();
      return;
    }

    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;
    const ip = getClientIp(req);

    // 1. Owner Control Panel HTML UI (Served at /owner)
    if ((req.method === 'GET' || req.method === 'HEAD') && (pathname === '/owner' || pathname === '/owner/')) {
      const html = await fs.readFile(OWNER_HTML, 'utf8');
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'no-referrer',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      });
      res.end(req.method === 'HEAD' ? undefined : html);
      return;
    }

    // 1.5 Public Health Check
    if (req.method === 'GET' && pathname === '/api/health') {
      const mem = process.memoryUsage();
      const battles = getBattleSummary();
      sendJson(res, 200, {
        ok: true,
        uptimeSec: Math.floor(process.uptime()),
        memoryRssMb: Math.round((mem.rss / 1048576) * 10) / 10,
        activeBattles: battles.activeMatches,
        devicesTracked: Object.keys(devicesState.devices).length,
        onlineNow: countOnlineNow(),
        syncVersion: globalSyncVersion,
        serverTime: new Date().toISOString(),
      });
      return;
    }

    // 2. Unified Live Sync Endpoint (ETag 304 + zero HTTP cache + per-device directives!)
    if (req.method === 'GET' && pathname === '/api/app-sync') {
      const deviceId = cleanStr(url.searchParams.get('deviceId') || '', 80);
      const lang = cleanStr(url.searchParams.get('lang') || '', 16);
      const platform = cleanStr(url.searchParams.get('platform') || '', 24);
      const city = cleanStr(url.searchParams.get('city') || '', 80);
      const vcode = Number(url.searchParams.get('vcode') || 0) || 0;

      if (validDeviceId(deviceId)) {
        devicesState.lastLiveSyncMs.set(deviceId, Date.now());
      }

      const ctrl = getDeviceControl(deviceId);
      const etagInput = `${globalSyncVersion}|${ctrl?.updatedAt || ''}|${ctrl?.pendingCommand?.id || ''}|${ctrl?.directMessage?.id || ''}|${lang}|${platform}|${city.toLowerCase()}|${vcode}`;
      const etag = `"${crypto.createHash('sha1').update(etagInput).digest('hex').slice(0, 16)}"`;

      if (req.headers['if-none-match'] === etag) {
        res.writeHead(304, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Expose-Headers': 'ETag',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          ETag: etag,
        });
        res.end();
        return;
      }

      const broadcasts = filterActiveBroadcasts({ lang, platform, city, versionCode: vcode });
      const deviceDirective = buildPublicDeviceDirective(deviceId);

      sendJson(
        res,
        200,
        {
          syncVersion: globalSyncVersion,
          config: cachedAppConfig,
          broadcasts,
          deviceDirective,
          serverTime: new Date().toISOString(),
        },
        { ETag: etag }
      );
      return;
    }

    // 2.05 Device Command / Direct Message Acknowledgment Receipt
    if (req.method === 'POST' && pathname === '/api/device/ack') {
      if (!checkRateLimit('device_ack', ip, 60, 60_000)) {
        sendJson(res, 429, { error: 'Rate limit exceeded' });
        return;
      }
      const body = await readBodyJson(req, 4096);
      if (!validDeviceId(body.deviceId)) {
        sendJson(res, 400, { error: 'Invalid deviceId' });
        return;
      }
      const commandId = cleanStr(body.commandId, 80);
      const directMessageId = cleanStr(body.directMessageId, 80);
      await withDeviceControlsWrite((controls) => {
        const ctrl = controls[body.deviceId];
        if (!ctrl) return;
        const nowIso = new Date().toISOString();
        if (commandId && ctrl.pendingCommand && ctrl.pendingCommand.id === commandId && !ctrl.pendingCommand.executedAt) {
          ctrl.pendingCommand.executedAt = nowIso;
          ctrl.updatedAt = nowIso;
        }
        if (
          directMessageId &&
          ctrl.directMessage &&
          ctrl.directMessage.id === directMessageId &&
          !ctrl.directMessage.seenAt
        ) {
          ctrl.directMessage.seenAt = nowIso;
          ctrl.updatedAt = nowIso;
        }
      });
      sendJson(res, 200, { ok: true });
      return;
    }

    // 2.1 Public Remote App Config (Zero cache so changes take effect immediately!)
    if (req.method === 'GET' && pathname === '/api/app-config') {
      sendJson(res, 200, { config: cachedAppConfig, syncVersion: globalSyncVersion });
      return;
    }

    // 2.2 Public Client Crash / Error Reporter
    if (req.method === 'POST' && pathname === '/api/client-error') {
      if (!checkRateLimit('client_error', ip, 25, 10 * 60_000)) {
        sendJson(res, 429, { error: 'Rate limit exceeded' });
        return;
      }
      const body = await readBodyJson(req, 16384);
      const message = cleanStr(body.message, 400);
      if (!message) {
        sendJson(res, 400, { error: 'message required' });
        return;
      }
      const scope = cleanStr(body.scope, 40) || 'window';
      const versionName = cleanStr(body.versionName, 24) || 'unknown';
      const versionCode = Number(body.versionCode) || 0;
      const platform = cleanStr(body.platform, 24) || 'unknown';
      const stack = cleanStr(body.stack, 2000);
      const fp = crypto
        .createHash('sha1')
        .update(`${scope}|${versionCode}|${message.slice(0, 140)}`)
        .digest('hex')
        .slice(0, 16);
      const nowIso = new Date().toISOString();

      let isNewGroup = false;
      let hitCount = 1;
      await withErrorsWrite((db) => {
        const existing = db.items.find((x) => x.fingerprint === fp);
        if (existing) {
          existing.count += 1;
          existing.lastSeenAt = nowIso;
          existing.resolved = false;
          if (stack && !existing.stack) existing.stack = stack;
          hitCount = existing.count;
        } else {
          isNewGroup = true;
          db.items.unshift({
            id: crypto.randomUUID(),
            fingerprint: fp,
            scope,
            message,
            stack,
            versionName,
            versionCode,
            platform,
            language: cleanStr(body.language, 16) || 'uz_lat',
            city: cleanStr(body.city, 80) || 'Unknown',
            url: cleanStr(body.url, 200),
            count: 1,
            resolved: false,
            firstSeenAt: nowIso,
            lastSeenAt: nowIso,
          });
        }
      });

      if (telegramCfg.onCrash && (isNewGroup || hitCount === 10 || hitCount === 50)) {
        void sendOwnerTelegramAlert(
          `🚨 Nurul Islam Xatolik (${isNewGroup ? 'YANGI' : hitCount + ' marta'})\nVersiya: v${versionName} (${platform})\nJoy: ${scope}\nXabar: ${message}`
        );
      }

      sendJson(res, 201, { ok: true });
      return;
    }

    // 2.3 Public User Feedback / Bug Report Submission
    if (req.method === 'POST' && pathname === '/api/feedback') {
      if (!checkRateLimit('feedback', ip, 10, 15 * 60_000)) {
        sendJson(res, 429, { error: 'Too many submissions. Please try again later.' });
        return;
      }
      const body = await readBodyJson(req, 16384);
      if (validDeviceId(body.deviceId)) {
        const guard = isDeviceBlockedOrRestricted(body.deviceId, 'feedback');
        if (guard.blocked) {
          sendJson(res, 403, { error: guard.reason });
          return;
        }
      }
      const message = cleanStr(body.message, 1500);
      if (message.length < 4) {
        sendJson(res, 400, { error: 'Message is too short' });
        return;
      }
      const allowedCats = ['bug', 'suggestion', 'prayer_time', 'content', 'other'];
      const category = allowedCats.includes(body.category) ? body.category : 'suggestion';
      const item = {
        id: crypto.randomUUID(),
        category,
        message,
        contact: cleanStr(body.contact, 120),
        deviceIdFull: validDeviceId(body.deviceId) ? body.deviceId : '',
        deviceId: validDeviceId(body.deviceId)
          ? `${body.deviceId.slice(0, 6)}...${body.deviceId.slice(-4)}`
          : 'anonymous',
        platform: cleanStr(body.platform, 24) || 'unknown',
        versionName: cleanStr(body.versionName, 24) || 'unknown',
        versionCode: Number(body.versionCode) || 0,
        language: cleanStr(body.language, 16) || 'uz_lat',
        city: cleanStr(body.city, 80) || 'Unknown',
        region: cleanStr(body.region, 80),
        country: cleanStr(body.country, 60),
        prayerDiagnostics: cleanStr(body.prayerDiagnostics, 180),
        status: 'new',
        ownerNote: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await withFeedbackWrite((db) => {
        db.items.unshift(item);
      });
      if (telegramCfg.onFeedback) {
        const locLine = [item.country, item.region, item.city].filter(Boolean).join(' · ');
        void sendOwnerTelegramAlert(
          `💬 Yangi murojaat (${category})\nHudud: ${locLine} · v${item.versionName} (${item.platform})${item.prayerDiagnostics ? '\nNamoz diag: ' + item.prayerDiagnostics : ''}${item.contact ? '\nAloqa: ' + item.contact : ''}\n\n${message}`
        );
      }
      sendJson(res, 201, { ok: true, id: item.id });
      return;
    }

    // 2.4 Anonymous Telemetry Ping (O(1) RAM update + 15s batched atomic disk flush)
    if (req.method === 'POST' && pathname === '/api/telemetry/ping') {
      if (!checkRateLimit('telemetry', ip, 60, 60_000)) {
        sendJson(res, 429, { error: 'Rate limit exceeded' });
        return;
      }
      const body = await readBodyJson(req, 8192);
      if (!validDeviceId(body.deviceId)) {
        sendJson(res, 400, { error: 'Invalid deviceId' });
        return;
      }
      const nowMs = Date.now();
      const nowIso = new Date(nowMs).toISOString();
      const todayKey = getUzDateStr(nowMs);
      const existing = devicesState.devices[body.deviceId];
      devicesState.devices[body.deviceId] = {
        id: body.deviceId,
        firstSeenAt: existing?.firstSeenAt || nowIso,
        lastSeenAt: nowIso,
        pings: (existing?.pings || 0) + 1,
        handle: cleanStr(body.handle, 24) || existing?.handle || '',
        platform: cleanStr(body.platform, 24) || existing?.platform || 'android',
        versionName: cleanStr(body.versionName, 24) || existing?.versionName || 'unknown',
        versionCode: Number(body.versionCode) || existing?.versionCode || 0,
        language: cleanStr(body.language, 16) || existing?.language || 'uz_lat',
        city: cleanStr(body.city, 80) || existing?.city || 'Unknown',
        region: cleanStr(body.region, 80) || existing?.region || '',
        district: cleanStr(body.district, 80) || existing?.district || '',
        country: cleanStr(body.country, 60) || existing?.country || '',
        theme: cleanStr(body.theme, 16) || existing?.theme || 'day',
        page2Tracked: Boolean(existing?.page2Tracked || typeof body.openedPage2 === 'boolean'),
        openedPage2:
          typeof body.openedPage2 === 'boolean'
            ? Boolean(existing?.openedPage2 || body.openedPage2)
            : Boolean(existing?.openedPage2),
        openedPage2At: existing?.openedPage2At || (body.openedPage2 === true ? nowIso : null),
      };
      devicesState.lastLiveSyncMs.set(body.deviceId, nowMs);

      let daySet = devicesState.dailyActiveSets.get(todayKey);
      if (!daySet) {
        daySet = new Set();
        devicesState.dailyActiveSets.set(todayKey, daySet);
      }
      daySet.add(body.deviceId);

      if (devicesState.dailyActiveSets.size > 90) {
        const sortedDays = Array.from(devicesState.dailyActiveSets.keys()).sort();
        while (sortedDays.length > 90) {
          const oldest = sortedDays.shift();
          if (oldest) devicesState.dailyActiveSets.delete(oldest);
        }
      }
      devicesState.dirty = true;
      sendJson(res, 200, { ok: true });
      return;
    }

    // 2.5 Automatic User Progress Cloud Backup & Zero-Login Restore (/api/progress/sync & /api/progress/restore)
    if (req.method === 'POST' && pathname === '/api/progress/sync') {
      if (!checkRateLimit('progress_sync', ip, 60, 60_000)) {
        sendJson(res, 429, { error: 'Rate limit exceeded' });
        return;
      }
      const body = await readBodyJson(req, 98304);
      const deviceId = cleanStr(body.deviceId, 80);
      const hardwareId = cleanStr(body.hardwareId, 80);
      if (!validDeviceId(deviceId) && !validDeviceId(hardwareId)) {
        sendJson(res, 400, { error: 'Valid deviceId or hardwareId required' });
        return;
      }

      const incomingSnap = sanitizeProgressSnapshot(body.snapshot);
      const { score: incomingScore, summary: incomingSummary } = summarizeSnapshot(incomingSnap);
      const deviceFp = extractSamePhoneSignature(req);

      const { record: existing, matchedBy } = findProgressRecord({
        hardwareId,
        deviceId,
        deviceFp,
        allowFpMatch: incomingScore === 0,
      });

      // If fresh empty install and we found an existing backup via hardwareId/deviceId/same-phone fingerprint,
      // DO NOT overwrite it — return `promptRestore: true` (or `autoRestored: true`) with the snapshot so the app can ask the user with a 1-tap restore dialog!
      const existingHasData =
        existing && ((existing.score || 0) > 0 || Boolean(existing.summary?.city || existing.summary?.handle));
      if (existingHasData && incomingScore === 0 && body.confirmOverwrite !== true) {
        sendJson(res, 200, {
          ok: true,
          promptRestore: true,
          matchedBy,
          recoveryCode: existing.recoveryCode,
          recoveryKeyHint: existing.recoveryKeyHint || '',
          score: existing.score || 0,
          summary: existing.summary,
          updatedAt: existing.updatedAt,
          snapshot: existing.snapshot,
        });
        return;
      }

      const primaryId = existing?.primaryId || (validDeviceId(hardwareId) ? hardwareId : deviceId);
      const nowIso = new Date().toISOString();
      const prevSnap = existing?.snapshot || {};
      const prevScore = existing?.score || 0;

      // Non-destructive union merge: keep richer preferences if incoming is lower score, while unioning all progress arrays
      const mergedSnap =
        prevScore > incomingScore
          ? mergeSnapshotsServer(incomingSnap, prevSnap)
          : mergeSnapshotsServer(prevSnap, incomingSnap);
      const { score: mergedScore, summary: mergedSummary } = summarizeSnapshot(mergedSnap);

      let recoveryKeyHash = existing?.recoveryKeyHash || '';
      let recoveryKeyHint = existing?.recoveryKeyHint || '';
      if (typeof body.recoveryKey === 'string') {
        const trimmedKey = body.recoveryKey.trim();
        if (trimmedKey === '') {
          if (body.clearRecoveryKey === true) {
            recoveryKeyHash = '';
            recoveryKeyHint = '';
          }
        } else if (trimmedKey.length >= 4) {
          const norm = normalizeRecoveryInput(trimmedKey);
          recoveryKeyHash = hashRecoveryKey(norm);
          recoveryKeyHint = buildRecoveryKeyHint(trimmedKey);
        }
      }

      // Use user's NI-XXXXXX handle as their recovery code if it has that format, else deterministic NI-XXXXXX
      const handleStr = mergedSummary.handle || '';
      const recoveryCode =
        existing?.recoveryCode ||
        (/^NI-[A-Z0-9]{5,8}$/i.test(handleStr)
          ? handleStr.toUpperCase()
          : generateDeterministicRecoveryCode(primaryId));

      const deviceIds = Array.from(
        new Set([
          ...(Array.isArray(existing?.deviceIds) ? existing.deviceIds : []),
          ...(validDeviceId(deviceId) ? [deviceId] : []),
          ...(validDeviceId(hardwareId) ? [hardwareId] : []),
        ])
      ).slice(0, 8);

      const record = {
        primaryId,
        deviceIds,
        hardwareId: validDeviceId(hardwareId) ? hardwareId : existing?.hardwareId || '',
        recoveryCode,
        recoveryKeyHash,
        recoveryKeyHint,
        deviceFp: deviceFp || existing?.deviceFp || '',
        score: mergedScore,
        summary: mergedSummary,
        snapshot: mergedSnap,
        createdAt: existing?.createdAt || nowIso,
        updatedAt: nowIso,
      };

      // Only persist to store if user has meaningful state or linked a recovery key or record already exists
      if (existing || mergedScore > 0 || recoveryKeyHash || Object.keys(mergedSnap).length > 0) {
        progressState.records[primaryId] = record;
        progressState.dirty = true;
        if (typeof body.recoveryKey === 'string' && body.recoveryKey.trim().length >= 4) {
          await flushProgressToDisk(true);
        }
      }

      const shouldApplyRemote = prevScore > incomingScore;
      sendJson(res, 200, {
        ok: true,
        autoRestored: shouldApplyRemote,
        matchedBy: matchedBy || 'self',
        recoveryCode: record.recoveryCode,
        recoveryKeyHint: record.recoveryKeyHint,
        score: record.score,
        summary: record.summary,
        updatedAt: record.updatedAt,
        snapshot: shouldApplyRemote ? record.snapshot : undefined,
      });
      return;
    }

    if (req.method === 'POST' && pathname === '/api/progress/restore') {
      if (!checkRateLimit('progress_restore', ip, 25, 5 * 60_000)) {
        sendJson(res, 429, { error: 'Too many restore attempts. Please wait a few minutes.' });
        return;
      }
      const body = await readBodyJson(req, 16384);
      const deviceId = cleanStr(body.deviceId, 80);
      const hardwareId = cleanStr(body.hardwareId, 80);
      const codeOrKey = cleanStr(body.codeOrKey, 80);
      const autoDetect = Boolean(body.autoDetect);
      const deviceFp = extractSamePhoneSignature(req);

      const { record, matchedBy } = findProgressRecord({
        hardwareId,
        deviceId,
        codeOrKey,
        deviceFp,
        allowFpMatch: autoDetect,
      });

      if (!record || !record.snapshot || Object.keys(record.snapshot).length === 0) {
        sendJson(res, 200, { ok: true, found: false });
        return;
      }

      if (validDeviceId(deviceId) && !record.deviceIds.includes(deviceId)) {
        record.deviceIds = [deviceId, ...record.deviceIds].slice(0, 8);
        progressState.dirty = true;
      }
      if (validDeviceId(hardwareId) && !record.hardwareId) {
        record.hardwareId = hardwareId;
        progressState.dirty = true;
      }
      if (deviceFp && !record.deviceFp) {
        record.deviceFp = deviceFp;
        progressState.dirty = true;
      }

      sendJson(res, 200, {
        ok: true,
        found: true,
        matchedBy,
        recoveryCode: record.recoveryCode,
        recoveryKeyHint: record.recoveryKeyHint || '',
        score: record.score || 0,
        summary: record.summary,
        updatedAt: record.updatedAt,
        snapshot: record.snapshot,
      });
      return;
    }

    // 3. Public App Endpoints (/api/broadcasts, /api/ehson)
    if (req.method === 'GET' && pathname === '/api/broadcasts') {
      const lang = cleanStr(url.searchParams.get('lang') || '', 16);
      const platform = cleanStr(url.searchParams.get('platform') || '', 24);
      const city = cleanStr(url.searchParams.get('city') || '', 80);
      const versionCode = Number(url.searchParams.get('vcode') || 0) || 0;
      const activeList = filterActiveBroadcasts({ lang, platform, city, versionCode });
      sendJson(res, 200, { broadcasts: activeList, updatedAt: new Date().toISOString() });
      return;
    }

    if (req.method === 'GET' && pathname === '/api/ehson') {
      const deviceId = url.searchParams.get('deviceId') || '';
      const db = await readDb();
      const sorted = [...db.campaigns].sort((a, b) => {
        if ((a.status || 'active') !== (b.status || 'active')) {
          return (a.status || 'active') === 'active' ? -1 : 1;
        }
        return String(b.createdAt).localeCompare(String(a.createdAt));
      });
      sendJson(res, 200, {
        campaigns: sorted.map((c) => sanitizeCampaignForPublic(c, validDeviceId(deviceId) ? deviceId : '')),
        updatedAt: new Date().toISOString(),
      });
      return;
    }

    const rsvpMatch = pathname.match(/^\/api\/ehson\/([a-zA-Z0-9_-]+)\/rsvp$/);
    if (req.method === 'POST' && rsvpMatch) {
      if (!checkRateLimit('ehson_write', ip, 30, 5 * 60_000)) {
        sendJson(res, 429, { error: 'Too many requests' });
        return;
      }
      const campaignId = rsvpMatch[1];
      const body = await readBodyJson(req, 8192);
      if (!validDeviceId(body.deviceId)) {
        sendJson(res, 400, { error: 'Invalid deviceId' });
        return;
      }
      const guard = isDeviceBlockedOrRestricted(body.deviceId, 'ehson');
      if (guard.blocked) {
        sendJson(res, 403, { error: guard.reason });
        return;
      }
      const updated = await withDbWrite((db) => {
        const item = db.campaigns.find((c) => c.id === campaignId);
        if (!item) return null;
        if (!Array.isArray(item.rsvpDevices)) item.rsvpDevices = [];
        const idx = item.rsvpDevices.indexOf(body.deviceId);
        if (idx >= 0) item.rsvpDevices.splice(idx, 1);
        else item.rsvpDevices.push(body.deviceId);
        item.updatedAt = new Date().toISOString();
        return sanitizeCampaignForPublic(item, body.deviceId);
      });
      if (!updated) {
        sendJson(res, 404, { error: 'Not found' });
        return;
      }
      sendJson(res, 200, { campaign: updated });
      return;
    }

    const pledgeMatch = pathname.match(/^\/api\/ehson\/([a-zA-Z0-9_-]+)\/pledge$/);
    if (req.method === 'POST' && pledgeMatch) {
      if (!checkRateLimit('ehson_write', ip, 30, 5 * 60_000)) {
        sendJson(res, 429, { error: 'Too many requests' });
        return;
      }
      const campaignId = pledgeMatch[1];
      const body = await readBodyJson(req, 8192);
      if (!validDeviceId(body.deviceId)) {
        sendJson(res, 400, { error: 'Invalid deviceId' });
        return;
      }
      const guard = isDeviceBlockedOrRestricted(body.deviceId, 'ehson');
      if (guard.blocked) {
        sendJson(res, 403, { error: guard.reason });
        return;
      }
      let masjidLabel = '';
      const updated = await withDbWrite((db) => {
        const item = db.campaigns.find((c) => c.id === campaignId);
        if (!item) return null;
        masjidLabel = `${item.masjidName}: ${item.title}`;
        if (!Array.isArray(item.pledges)) item.pledges = [];
        const existingIdx = item.pledges.findIndex((p) => p.deviceId === body.deviceId);
        if (body.cancel === true && existingIdx >= 0) {
          item.pledges.splice(existingIdx, 1);
        } else if (existingIdx >= 0) {
          item.pledges[existingIdx] = {
            deviceId: body.deviceId,
            name: cleanStr(body.name, 80),
            phone: cleanStr(body.phone, 40),
            note: cleanStr(body.note, 200),
            createdAt: item.pledges[existingIdx].createdAt,
          };
        } else {
          item.pledges.push({
            deviceId: body.deviceId,
            name: cleanStr(body.name, 80),
            phone: cleanStr(body.phone, 40),
            note: cleanStr(body.note, 200),
            createdAt: new Date().toISOString(),
          });
        }
        item.updatedAt = new Date().toISOString();
        return sanitizeCampaignForPublic(item, body.deviceId);
      });
      if (!updated) {
        sendJson(res, 404, { error: 'Not found' });
        return;
      }
      if (telegramCfg.onEhsonPledge && body.cancel !== true) {
        void sendOwnerTelegramAlert(
          `🕌 Yangi Ehson va’dasi!\n${masjidLabel}\nIsm: ${cleanStr(body.name, 80) || 'Anonim'}\nTel: ${cleanStr(body.phone, 40) || '—'}\nIzoh: ${cleanStr(body.note, 200) || '—'}`
        );
      }
      sendJson(res, 200, { campaign: updated });
      return;
    }

    // 3.5 Real-Time 99 Names 1v1 Quiz Battle Endpoints (/api/names-battle/*)
    if (pathname.startsWith('/api/names-battle/')) {
      cleanupStaleBattleRooms();

      if (req.method === 'GET' && pathname === '/api/names-battle/lobby') {
        const deviceId = url.searchParams.get('deviceId') || '';
        const now = Date.now();
        const waitingRooms = [];
        let activeMatches = 0;
        for (const r of BATTLE_ROOMS.values()) {
          if (r.status === 'playing' && now - r.updatedAt < 120_000) activeMatches += 1;
          else if (
            r.status === 'waiting' &&
            r.isPublic &&
            r.player1 &&
            r.player1.deviceId !== deviceId &&
            now - r.updatedAt < 180_000
          ) {
            waitingRooms.push({
              roomId: r.roomId,
              roomCode: r.roomCode,
              hostHandle: r.player1.handle,
              hostCity: r.player1.city,
              totalQuestions: r.questions.length,
              createdAt: r.createdAt,
            });
          }
        }
        sendJson(res, 200, { waitingRooms: waitingRooms.slice(0, 10), activeMatches });
        return;
      }

      if (req.method === 'POST' && pathname === '/api/names-battle/matchmake') {
        const body = await readBodyJson(req, 8192);
        if (!validDeviceId(body.deviceId)) {
          sendJson(res, 400, { error: 'Invalid deviceId' });
          return;
        }
        const guard = isDeviceBlockedOrRestricted(body.deviceId, 'namesBattle');
        if (guard.blocked) {
          sendJson(res, 403, { error: guard.reason });
          return;
        }
        const mode = ['quick', 'create', 'join'].includes(body.mode) ? body.mode : 'quick';
        const handle = cleanStr(body.handle, 24) || 'NI-Tolib';
        const city = cleanStr(body.city, 40) || 'Toshkent';
        const now = Date.now();

        if (mode === 'join') {
          const code = cleanStr(body.roomCode, 12);
          const targetRoomId = cleanStr(body.roomId, 60);
          let targetRoom = null;
          for (const r of BATTLE_ROOMS.values()) {
            if ((targetRoomId && r.roomId === targetRoomId) || (code && r.roomCode === code)) {
              targetRoom = r;
              break;
            }
          }
          if (!targetRoom || targetRoom.status === 'finished') {
            sendJson(res, 404, { error: 'Xona topilmadi yoki bellashuv yakunlangan' });
            return;
          }
          if (targetRoom.player1?.deviceId === body.deviceId || targetRoom.player2?.deviceId === body.deviceId) {
            sendJson(res, 200, { room: serializeBattleRoom(targetRoom, body.deviceId) });
            return;
          }
          if (targetRoom.player2) {
            sendJson(res, 409, { error: 'Bu xonada bellashuv allaqachon boshlangan' });
            return;
          }
          targetRoom.player2 = createPlayerSlot(body.deviceId, handle, city, false);
          targetRoom.status = 'playing';
          targetRoom.startedAt = now;
          targetRoom.questionStartedAt = now;
          targetRoom.updatedAt = now;
          sendJson(res, 200, { room: serializeBattleRoom(targetRoom, body.deviceId) });
          return;
        }

        if (mode === 'quick') {
          let matchRoom = null;
          for (const r of BATTLE_ROOMS.values()) {
            if (
              r.status === 'waiting' &&
              r.isPublic &&
              r.player1 &&
              r.player1.deviceId !== body.deviceId &&
              now - (r.player1.lastSeenAt || r.updatedAt) < 6_000
            ) {
              matchRoom = r;
              break;
            }
          }
          if (matchRoom) {
            matchRoom.player2 = createPlayerSlot(body.deviceId, handle, city, false);
            matchRoom.status = 'playing';
            matchRoom.startedAt = now;
            matchRoom.questionStartedAt = now;
            matchRoom.updatedAt = now;
            sendJson(res, 200, { room: serializeBattleRoom(matchRoom, body.deviceId) });
            return;
          }
        }

        for (const [id, r] of BATTLE_ROOMS.entries()) {
          if (r.status === 'waiting' && r.player1?.deviceId === body.deviceId) BATTLE_ROOMS.delete(id);
        }

        const roomId = crypto.randomUUID();
        const roomCode = generateRoomCode();
        const newRoom = {
          roomId,
          roomCode,
          isPublic: mode === 'quick',
          status: 'waiting',
          currentQuestionIndex: 0,
          questions: generate10NamesQuestions(10),
          player1: createPlayerSlot(body.deviceId, handle, city, false),
          player2: null,
          createdAt: now,
          updatedAt: now,
          startedAt: null,
          questionStartedAt: now,
          bothAnsweredAt: null,
        };
        BATTLE_ROOMS.set(roomId, newRoom);
        sendJson(res, 201, { room: serializeBattleRoom(newRoom, body.deviceId) });
        return;
      }

      if (req.method === 'POST' && pathname === '/api/names-battle/start-bot') {
        const body = await readBodyJson(req, 8192);
        const room = BATTLE_ROOMS.get(cleanStr(body.roomId, 60));
        if (!room || room.status !== 'waiting') {
          sendJson(res, 404, { error: 'Waiting room not found' });
          return;
        }
        const botProfile = BOT_PROFILES[Math.floor(Math.random() * BOT_PROFILES.length)];
        const now = Date.now();
        room.player2 = createPlayerSlot(
          `bot_${crypto.randomBytes(4).toString('hex')}`,
          botProfile.handle,
          botProfile.city,
          true
        );
        room.status = 'playing';
        room.startedAt = now;
        room.questionStartedAt = now;
        room.updatedAt = now;
        scheduleBotAnswerForQuestion(room, 0);
        sendJson(res, 200, { room: serializeBattleRoom(room, body.deviceId) });
        return;
      }

      if (req.method === 'GET' && pathname === '/api/names-battle/state') {
        const roomId = cleanStr(url.searchParams.get('roomId') || '', 60);
        const deviceId = cleanStr(url.searchParams.get('deviceId') || '', 80);
        let room = BATTLE_ROOMS.get(roomId);
        if (!room) {
          sendJson(res, 404, { error: 'Room not found' });
          return;
        }
        const now = Date.now();
        if (room.player1?.deviceId === deviceId) {
          room.player1.lastSeenAt = now;
          if (room.status === 'waiting') room.updatedAt = now;
        } else if (room.player2?.deviceId === deviceId) {
          room.player2.lastSeenAt = now;
        }

        if (room.status === 'waiting' && room.player1) {
          for (const other of BATTLE_ROOMS.values()) {
            if (
              other.roomId !== room.roomId &&
              other.status === 'waiting' &&
              other.player1 &&
              other.player1.deviceId !== room.player1.deviceId &&
              now - (other.player1.lastSeenAt || other.updatedAt) < 6_000
            ) {
              other.player2 = room.player1;
              other.status = 'playing';
              other.startedAt = now;
              other.questionStartedAt = now;
              other.updatedAt = now;
              BATTLE_ROOMS.set(room.roomId, other);
              room = other;
              break;
            }
          }
        }

        sendJson(res, 200, { room: serializeBattleRoom(room, deviceId) });
        return;
      }

      if (req.method === 'POST' && pathname === '/api/names-battle/answer') {
        const body = await readBodyJson(req, 8192);
        const room = BATTLE_ROOMS.get(cleanStr(body.roomId, 60));
        if (!room) {
          sendJson(res, 404, { error: 'Room not found' });
          return;
        }
        recordBattleAnswer(room, body.deviceId, Number(body.qIndex), Number(body.pickedNumber));
        sendJson(res, 200, { room: serializeBattleRoom(room, body.deviceId) });
        return;
      }

      if (req.method === 'POST' && pathname === '/api/names-battle/leave') {
        const body = await readBodyJson(req, 8192);
        const roomId = cleanStr(body.roomId, 60);
        const room = BATTLE_ROOMS.get(roomId);
        if (room && room.status === 'waiting' && room.player1?.deviceId === body.deviceId) {
          BATTLE_ROOMS.delete(roomId);
        }
        sendJson(res, 200, { ok: true });
        return;
      }
    }

    // 4. Owner Auth Endpoints (/api/owner/...)
    if (pathname === '/api/owner/session' && req.method === 'GET') {
      sendJson(res, 200, { authenticated: verifySessionCookie(req) });
      return;
    }

    if (pathname === '/api/owner/login' && req.method === 'POST') {
      const now = Date.now();
      const rec = loginAttempts.get(ip) || { count: 0, resetAt: now + 5 * 60_000 };
      if (now > rec.resetAt) {
        rec.count = 0;
        rec.resetAt = now + 5 * 60_000;
      }
      if (rec.count >= 6) {
        sendJson(res, 429, { error: 'Juda ko‘p urinish. 5 daqiqa kuting.' });
        return;
      }

      const body = await readBodyJson(req, 4096);
      if (!verifyPassword(body.password)) {
        rec.count += 1;
        loginAttempts.set(ip, rec);
        void recordAudit('login_failed', `Failed owner login attempt (${rec.count}/6)`, req);
        if (telegramCfg.onLoginFail) {
          void sendOwnerTelegramAlert(
            `⚠️ Nurul Islam Owner Panel: noto‘g‘ri parol urinishi (${rec.count}/6) · IP: ${maskIp(ip)}`
          );
        }
        sendJson(res, 401, { error: 'Parol noto‘g‘ri' });
        return;
      }
      loginAttempts.delete(ip);
      const token = signSessionToken(now + 14 * 24 * 3600_000);
      void recordAudit('login_success', 'Owner signed into Control Center', req);
      sendJson(
        res,
        200,
        { authenticated: true },
        { 'Set-Cookie': buildCookieHeader(req, token, 14 * 24 * 3600) }
      );
      return;
    }

    if (pathname === '/api/owner/logout' && req.method === 'POST') {
      void recordAudit('logout', 'Owner signed out', req);
      sendJson(res, 200, { ok: true }, { 'Set-Cookie': buildCookieHeader(req, '', 0) });
      return;
    }

    // =========================================================================
    // Protected Owner APIs
    // =========================================================================
    if (pathname.startsWith('/api/owner/')) {
      if (!verifySessionCookie(req)) {
        sendJson(res, 401, { error: 'Unauthorized' });
        return;
      }

      // Change Owner Password
      if (pathname === '/api/owner/change-password' && req.method === 'POST') {
        const body = await readBodyJson(req, 4096);
        if (!verifyPassword(body.currentPassword)) {
          sendJson(res, 400, { error: 'Joriy parol noto‘g‘ri' });
          return;
        }
        const nextPass = typeof body.newPassword === 'string' ? body.newPassword : '';
        if (nextPass.length < 8) {
          sendJson(res, 400, { error: 'Yangi parol kamida 8 ta belgi bo‘lsin' });
          return;
        }
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.scryptSync(nextPass, salt, 64).toString('hex');
        const nextCfg = { ...authCfg, salt, hash, updatedAt: new Date().toISOString() };
        await fs.writeFile(AUTH_FILE, JSON.stringify(nextCfg, null, 2), { mode: 0o600 });
        await fs.rm(path.join(DATA_DIR, 'INITIAL_OWNER_PASSWORD.txt'), { force: true });
        authCfg = nextCfg;
        void recordAudit('password_changed', 'Owner password updated', req);
        sendJson(res, 200, { ok: true });
        return;
      }

      // Full Executive Owner Dashboard Stats
      if (pathname === '/api/owner/stats' && req.method === 'GET') {
        const [ehsonDb, feedbackDb, errorsDb, liveVersion] = await Promise.all([
          readDb(),
          readFeedbackDb(),
          readErrorsDb(),
          readJsonFile(VERSION_JSON_PATH, null),
        ]);

        const list = Object.values(devicesState.devices);
        const now = Date.now();
        const ms24h = 24 * 3600_000;
        const ms7d = 7 * 24 * 3600_000;
        const ms30d = 30 * 24 * 3600_000;
        const todayKey = getUzDateStr(now);

        let active24h = 0;
        let active7d = 0;
        let active30d = 0;
        let newToday = 0;
        let new7d = 0;
        let returningUsers = 0;
        let onLatestVersion = 0;
        const latestCode = Number(liveVersion?.versionCode) || 0;
        const newByDay = new Map();

        for (const d of list) {
          const lastMs = Date.parse(d.lastSeenAt || '') || 0;
          const firstMs = Date.parse(d.firstSeenAt || '') || 0;
          if (now - lastMs <= ms24h) active24h += 1;
          if (now - lastMs <= ms7d) active7d += 1;
          if (now - lastMs <= ms30d) active30d += 1;
          if ((d.pings || 1) >= 2 || lastMs - firstMs > 12 * 3600_000) returningUsers += 1;
          if (latestCode > 0 && Number(d.versionCode) >= latestCode) onLatestVersion += 1;

          if (firstMs > 0) {
            const firstDay = getUzDateStr(firstMs);
            newByDay.set(firstDay, (newByDay.get(firstDay) || 0) + 1);
            if (firstDay === todayKey) newToday += 1;
            if (now - firstMs <= ms7d) new7d += 1;
          }
        }

        const dailySeries = [];
        for (let i = 29; i >= 0; i -= 1) {
          const dayStr = getUzDateStr(now - i * 86400_000);
          const activeSet = devicesState.dailyActiveSets.get(dayStr);
          dailySeries.push({
            date: dayStr,
            activeCount: activeSet ? activeSet.size : 0,
            newCount: newByDay.get(dayStr) || 0,
          });
        }

        const trackedP2 = list.filter((d) => d.page2Tracked);
        const openedP2 = trackedP2.filter((d) => d.openedPage2).length;
        const page2Discovery = {
          trackedTotal: trackedP2.length,
          opened: openedP2,
          notOpened: Math.max(0, trackedP2.length - openedP2),
          pct: trackedP2.length > 0 ? Math.round((openedP2 / trackedP2.length) * 100) : 0,
        };

        const stickinessPct = active30d > 0 ? Math.round((active24h / active30d) * 100) : 0;
        const latestAdoptionPct = list.length > 0 && latestCode > 0 ? Math.round((onLatestVersion / list.length) * 100) : 0;

        const ctrlVals = Object.values(deviceControlsCache);
        const blockedCount = ctrlVals.filter((c) => c?.blocked).length;
        const testersCount = ctrlVals.filter((c) => c?.role === 'tester' || c?.role === 'vip').length;

        const campaigns = ehsonDb.campaigns || [];
        const activeEhson = campaigns.filter((c) => (c.status || 'active') === 'active').length;
        const totalRsvps = campaigns.reduce((acc, c) => acc + (Array.isArray(c.rsvpDevices) ? c.rsvpDevices.length : 0), 0);
        const totalPledges = campaigns.reduce((acc, c) => acc + (Array.isArray(c.pledges) ? c.pledges.length : 0), 0);

        const activeBroadcasts = broadcastsCache.filter((b) => {
          if (!b || b.active === false) return false;
          if (b.expiresAt && Number.isFinite(Date.parse(b.expiresAt)) && Date.parse(b.expiresAt) < now) return false;
          return true;
        }).length;

        const feedbackItems = feedbackDb.items || [];
        const openFeedback = feedbackItems.filter((x) => x.status === 'new').length;
        const errorItems = errorsDb.items || [];
        const unresolvedErrors = errorItems.filter((x) => !x.resolved).length;
        const battles = getBattleSummary();

        const mem = process.memoryUsage();
        let devicesFileKb = 0;
        try {
          devicesFileKb = Math.round((statSync(DEVICES_FILE).size / 1024) * 10) / 10;
        } catch {}

        sendJson(res, 200, {
          users: {
            total: list.length,
            onlineNow: countOnlineNow(),
            active24h,
            active7d,
            active30d,
            stickinessPct,
            returningUsers,
            newToday,
            new7d,
            onLatestVersion,
            latestAdoptionPct,
            blockedCount,
            testersCount,
            byVersion: countBy(list, (d) => d.versionName),
            byPlatform: countBy(list, (d) => d.platform),
            byLanguage: countBy(list, (d) => d.language),
            byRegion: countBy(list, (d) => d.region || d.country || d.city).slice(0, 20),
            byCity: countBy(list, (d) => (d.region && d.city && d.region !== d.city ? `${d.city} (${d.region})` : d.city)).slice(0, 20),
            byCountry: countBy(list, (d) => d.country || 'Uzbekistan').slice(0, 15),
            byTheme: countBy(list, (d) => d.theme),
            page2Discovery,
            dailySeries,
          },
          ehson: {
            total: campaigns.length,
            active: activeEhson,
            completed: campaigns.length - activeEhson,
            totalRsvps,
            totalPledges,
          },
          broadcasts: {
            total: broadcastsCache.length,
            active: activeBroadcasts,
          },
          feedback: {
            total: feedbackItems.length,
            newCount: openFeedback,
          },
          errors: {
            totalGroups: errorItems.length,
            unresolvedGroups: unresolvedErrors,
            totalEvents: errorItems.reduce((a, b) => a + (b.count || 1), 0),
          },
          battles,
          configSummary: {
            hijriDayOffset: cachedAppConfig.hijriDayOffset,
            ramadanMode: cachedAppConfig.ramadanMode,
            maintenanceEnabled: cachedAppConfig.maintenance.enabled,
            disabledFeatures: Object.entries(cachedAppConfig.features)
              .filter(([, enabled]) => !enabled)
              .map(([key]) => key),
            updatedAt: cachedAppConfig.updatedAt,
          },
          system: {
            uptimeSec: Math.floor(process.uptime()),
            memoryRssMb: Math.round((mem.rss / 1048576) * 10) / 10,
            heapUsedMb: Math.round((mem.heapUsed / 1048576) * 10) / 10,
            totalSysMemMb: Math.round(os.totalmem() / 1048576),
            freeSysMemMb: Math.round(os.freemem() / 1048576),
            loadAvg1m: Math.round((os.loadavg()[0] || 0) * 100) / 100,
            nodeVersion: process.version,
            devicesFileKb,
            syncVersion: globalSyncVersion,
            liveVersion,
            serverTime: new Date().toISOString(),
          },
        });
        return;
      }

      // =========================================================================
      // Device & User Control Management APIs (/api/owner/devices*)
      // =========================================================================
      if (pathname === '/api/owner/devices' && req.method === 'GET') {
        const now = Date.now();
        const onlineCutoff = 2 * 60_000;
        const list = Object.values(devicesState.devices)
          .sort((a, b) => {
            const aSync = devicesState.lastLiveSyncMs.get(a.id) || Date.parse(a.lastSeenAt || '') || 0;
            const bSync = devicesState.lastLiveSyncMs.get(b.id) || Date.parse(b.lastSeenAt || '') || 0;
            return bSync - aSync;
          })
          .map((d) => {
            const liveMs = devicesState.lastLiveSyncMs.get(d.id) || Date.parse(d.lastSeenAt || '') || 0;
            const ctrl = deviceControlsCache[d.id] || null;
            return {
              id: d.id,
              shortId: `${String(d.id).slice(0, 6)}...${String(d.id).slice(-4)}`,
              handle: d.handle || '',
              city: d.city || 'Unknown',
              region: d.region || '',
              district: d.district || '',
              country: d.country || '',
              platform: d.platform || 'android',
              versionName: d.versionName || 'unknown',
              versionCode: Number(d.versionCode) || 0,
              language: d.language || 'uz_lat',
              theme: d.theme || 'day',
              pings: d.pings || 1,
              openedPage2: d.page2Tracked ? Boolean(d.openedPage2) : null,
              firstSeenAt: d.firstSeenAt,
              lastSeenAt: liveMs > (Date.parse(d.lastSeenAt || '') || 0) ? new Date(liveMs).toISOString() : d.lastSeenAt,
              isOnline: now - liveMs <= onlineCutoff,
              control: ctrl,
            };
          });
        sendJson(res, 200, { devices: list });
        return;
      }

      const devCtrlMatch = pathname.match(/^\/api\/owner\/devices\/([a-zA-Z0-9_-]+)\/control$/);
      if (devCtrlMatch && req.method === 'PUT') {
        const devId = devCtrlMatch[1];
        if (!validDeviceId(devId)) {
          sendJson(res, 400, { error: 'Invalid deviceId' });
          return;
        }
        const body = await readBodyJson(req, 16384);
        const saved = await withDeviceControlsWrite((controls) => {
          const nextCtrl = sanitizeDeviceControl(body, controls[devId] || {});
          controls[devId] = nextCtrl;
          return nextCtrl;
        });
        void recordAudit(
          'device_control_updated',
          `${devId.slice(0, 8)} (${saved.label || saved.role}) blocked=${saved.blocked}, bypass=${saved.bypassMaintenance}, msg=${Boolean(saved.directMessage)}`,
          req
        );
        sendJson(res, 200, { control: saved });
        return;
      }

      const devCmdMatch = pathname.match(/^\/api\/owner\/devices\/([a-zA-Z0-9_-]+)\/command$/);
      if (devCmdMatch && req.method === 'POST') {
        const devId = devCmdMatch[1];
        if (!validDeviceId(devId)) {
          sendJson(res, 400, { error: 'Invalid deviceId' });
          return;
        }
        const body = await readBodyJson(req, 4096);
        const type = ['reload', 'reset_cache', 'force_update'].includes(body.type) ? body.type : '';
        if (!type) {
          sendJson(res, 400, { error: 'Invalid command type' });
          return;
        }
        const saved = await withDeviceControlsWrite((controls) => {
          const cur = controls[devId] || sanitizeDeviceControl({}, {});
          cur.pendingCommand = {
            id: crypto.randomUUID(),
            type,
            issuedAt: new Date().toISOString(),
            executedAt: null,
          };
          cur.updatedAt = new Date().toISOString();
          controls[devId] = cur;
          return cur;
        });
        void recordAudit('device_command_sent', `Command '${type}' -> ${devId.slice(0, 8)}`, req);
        sendJson(res, 200, { control: saved });
        return;
      }

      const devDelMatch = pathname.match(/^\/api\/owner\/devices\/([a-zA-Z0-9_-]+)$/);
      if (devDelMatch && req.method === 'DELETE') {
        const devId = devDelMatch[1];
        const existed = Boolean(devicesState.devices[devId] || deviceControlsCache[devId]);
        delete devicesState.devices[devId];
        devicesState.lastLiveSyncMs.delete(devId);
        devicesState.dirty = true;
        await flushDevicesToDisk(true);
        await withDeviceControlsWrite((controls) => {
          delete controls[devId];
        });
        if (existed) void recordAudit('device_deleted', `Purged device ${devId.slice(0, 8)}`, req);
        sendJson(res, existed ? 200 : 404, { ok: existed });
        return;
      }

      // Global Force Web/PWA Client Reload
      if (pathname === '/api/owner/force-web-reload' && req.method === 'POST') {
        const saved = await writeAppConfig({
          ...cachedAppConfig,
          forceWebReloadNonce: Date.now(),
        });
        void recordAudit('force_web_reload', `Triggered global web refresh nonce=${saved.forceWebReloadNonce}`, req);
        sendJson(res, 200, { ok: true, forceWebReloadNonce: saved.forceWebReloadNonce });
        return;
      }

      // Remote App Config Read & Update
      if (pathname === '/api/owner/app-config' && req.method === 'GET') {
        sendJson(res, 200, { config: cachedAppConfig });
        return;
      }

      if (pathname === '/api/owner/app-config' && req.method === 'PUT') {
        const body = await readBodyJson(req, 65536);
        const saved = await writeAppConfig(body.config || body);
        const disabled = Object.entries(saved.features)
          .filter(([, v]) => !v)
          .map(([k]) => k);
        void recordAudit(
          'app_config_updated',
          `Hijri ${saved.hijriDayOffset >= 0 ? '+' : ''}${saved.hijriDayOffset}, Ramadan=${saved.ramadanMode}, Maint=${saved.maintenance.enabled}, Disabled=[${disabled.join(',')}]`,
          req
        );
        sendJson(res, 200, { config: saved, syncVersion: globalSyncVersion });
        return;
      }

      // OTA / Play Store version.json Read & Update
      if (pathname === '/api/owner/ota-version' && req.method === 'GET') {
        const liveVersion = await readJsonFile(VERSION_JSON_PATH, null);
        sendJson(res, 200, { version: liveVersion });
        return;
      }

      if (pathname === '/api/owner/ota-version' && req.method === 'PUT') {
        const b = await readBodyJson(req, 65536);
        const vCode = Number(b.versionCode);
        const vName = cleanStr(b.versionName, 32);
        const apkUrl = cleanUrl(b.apkUrl, 300);
        const rpmUrl = cleanUrl(b.rpmUrl, 300);
        if (!Number.isInteger(vCode) || vCode < 1 || !vName || !apkUrl) {
          sendJson(res, 400, { error: 'versionCode, versionName, and valid https apkUrl are required' });
          return;
        }
        const minCode = Number(b.minSupportedVersionCode);
        const rawNotes = b.notes && typeof b.notes === 'object' ? b.notes : {};
        const nextVersion = {
          versionCode: vCode,
          versionName: vName,
          apkUrl,
          ...(rpmUrl ? { rpmUrl } : {}),
          forceUpdate: Boolean(b.forceUpdate),
          minSupportedVersionCode: Number.isInteger(minCode) && minCode >= 1 ? minCode : vCode,
          notes: {
            uz_lat: cleanStr(rawNotes.uz_lat, 1200),
            uz_cyr: cleanStr(rawNotes.uz_cyr, 1200),
            en: cleanStr(rawNotes.en, 1200),
            ru: cleanStr(rawNotes.ru, 1200),
          },
        };
        await writeVersionJson(nextVersion);
        void recordAudit(
          'ota_version_updated',
          `v${vName} (code ${vCode}), forceUpdate=${nextVersion.forceUpdate}, minSupported=${nextVersion.minSupportedVersionCode}`,
          req
        );
        sendJson(res, 200, { version: nextVersion });
        return;
      }

      // Client Errors / Crash Monitor APIs
      if (pathname === '/api/owner/errors' && req.method === 'GET') {
        const edb = await readErrorsDb();
        sendJson(res, 200, { items: edb.items });
        return;
      }

      if (pathname === '/api/owner/errors/clear' && req.method === 'POST') {
        await withErrorsWrite((db) => {
          db.items = db.items.filter((x) => !x.resolved);
        });
        void recordAudit('errors_cleared', 'Cleared resolved crash records', req);
        sendJson(res, 200, { ok: true });
        return;
      }

      const errMatch = pathname.match(/^\/api\/owner\/errors\/([a-zA-Z0-9_-]+)$/);
      if (errMatch && req.method === 'PATCH') {
        const id = errMatch[1];
        const b = await readBodyJson(req, 4096);
        const updated = await withErrorsWrite((db) => {
          const item = db.items.find((x) => x.id === id);
          if (!item) return null;
          if (typeof b.resolved === 'boolean') item.resolved = b.resolved;
          return item;
        });
        sendJson(res, updated ? 200 : 404, updated ? { item: updated } : { error: 'Not found' });
        return;
      }

      if (errMatch && req.method === 'DELETE') {
        const id = errMatch[1];
        const removed = await withErrorsWrite((db) => {
          const before = db.items.length;
          db.items = db.items.filter((x) => x.id !== id);
          return db.items.length < before;
        });
        sendJson(res, removed ? 200 : 404, { ok: removed });
        return;
      }

      // Telegram Owner Alerts Config APIs
      if (pathname === '/api/owner/telegram' && req.method === 'GET') {
        sendJson(res, 200, { telegram: sanitizeTelegramForOwner(telegramCfg) });
        return;
      }

      if (pathname === '/api/owner/telegram' && req.method === 'PUT') {
        const body = await readBodyJson(req, 8192);
        const saved = await writeTelegramConfig(body);
        void recordAudit('telegram_updated', `enabled=${saved.enabled}, chatId=${saved.chatId || 'empty'}`, req);
        sendJson(res, 200, { telegram: sanitizeTelegramForOwner(saved) });
        return;
      }

      if (pathname === '/api/owner/telegram/test' && req.method === 'POST') {
        const r = await sendOwnerTelegramAlert(
          `✅ Nurul Islam Owner Control Center: Telegram bildirishnomalari muvaffaqiyatli ulandi!\nVaqt: ${new Date().toISOString()}`,
          true
        );
        sendJson(res, r.ok ? 200 : 400, r);
        return;
      }

      // Feedback & Bug Inbox CRUD
      if (pathname === '/api/owner/feedback' && req.method === 'GET') {
        const fdb = await readFeedbackDb();
        sendJson(res, 200, { items: fdb.items });
        return;
      }

      const fbMatch = pathname.match(/^\/api\/owner\/feedback\/([a-zA-Z0-9_-]+)$/);
      if (fbMatch && req.method === 'PATCH') {
        const id = fbMatch[1];
        const b = await readBodyJson(req, 8192);
        const updated = await withFeedbackWrite((db) => {
          const item = db.items.find((x) => x.id === id);
          if (!item) return null;
          if (['new', 'reviewed', 'resolved'].includes(b.status)) item.status = b.status;
          if (b.ownerNote !== undefined) item.ownerNote = cleanStr(b.ownerNote, 400);
          item.updatedAt = new Date().toISOString();
          return item;
        });
        if (!updated) {
          sendJson(res, 404, { error: 'Not found' });
          return;
        }
        void recordAudit('feedback_updated', `Feedback ${id.slice(0, 8)} -> ${updated.status}`, req);
        sendJson(res, 200, { item: updated });
        return;
      }

      if (fbMatch && req.method === 'DELETE') {
        const id = fbMatch[1];
        const removed = await withFeedbackWrite((db) => {
          const before = db.items.length;
          db.items = db.items.filter((x) => x.id !== id);
          return db.items.length < before;
        });
        if (removed) void recordAudit('feedback_deleted', `Deleted feedback ${id.slice(0, 8)}`, req);
        sendJson(res, removed ? 200 : 404, { ok: removed });
        return;
      }

      // Audit Log
      if (pathname === '/api/owner/audit' && req.method === 'GET') {
        const adb = await readAuditDb();
        sendJson(res, 200, { entries: adb.entries.slice(0, 80) });
        return;
      }

      // Export Anonymized Devices as CSV
      if (pathname === '/api/owner/export/devices.csv' && req.method === 'GET') {
        const list = Object.values(devicesState.devices).sort((a, b) =>
          String(b.lastSeenAt).localeCompare(String(a.lastSeenAt))
        );
        const rows = [
          ['ShortID', 'Label', 'Role', 'Blocked', 'Handle', 'Platform', 'Version', 'VersionCode', 'Language', 'Country', 'Region', 'District', 'City', 'Theme', 'Pings', 'Page2Opened', 'FirstSeen', 'LastSeen'].join(','),
        ];
        for (const d of list) {
          const ctrl = deviceControlsCache[d.id] || {};
          rows.push(
            [
              `${String(d.id).slice(0, 6)}...${String(d.id).slice(-4)}`,
              ctrl.label || '',
              ctrl.role || 'user',
              ctrl.blocked ? 'yes' : 'no',
              d.handle || '',
              d.platform || 'android',
              d.versionName || 'unknown',
              d.versionCode || 0,
              d.language || 'uz_lat',
              d.country || '',
              d.region || '',
              d.district || '',
              d.city || 'Unknown',
              d.theme || 'day',
              d.pings || 1,
              d.page2Tracked ? (d.openedPage2 ? 'yes' : 'no') : '',
              d.firstSeenAt || '',
              d.lastSeenAt || '',
            ]
              .map(csvEscape)
              .join(',')
          );
        }
        const dateTag = getUzDateStr();
        void recordAudit('export_devices_csv', `Exported ${list.length} devices to CSV`, req);
        res.writeHead(200, {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="nurulislam-devices-${dateTag}.csv"`,
          'Cache-Control': 'no-store',
        });
        res.end('\uFEFF' + rows.join('\n'));
        return;
      }

      // Full JSON Data Backup (NEVER includes auth.json or telegram.json tokens!)
      if (pathname === '/api/owner/backup' && req.method === 'GET') {
        await flushDevicesToDisk(true);
        const [ehsonDb, feedbackDb, errorsDb, auditDb, liveVersion] = await Promise.all([
          readDb(),
          readFeedbackDb(),
          readErrorsDb(),
          readAuditDb(),
          readJsonFile(VERSION_JSON_PATH, null),
        ]);
        const payload = {
          exportedAt: new Date().toISOString(),
          app: 'Nurul Islam Owner Backup',
          appConfig: cachedAppConfig,
          liveVersion,
          ehson: ehsonDb,
          broadcasts: { broadcasts: broadcastsCache },
          feedback: feedbackDb,
          errors: errorsDb,
          deviceControls: deviceControlsCache,
          devices: serializeDevicesState(),
          audit: auditDb,
        };
        const dateTag = getUzDateStr();
        void recordAudit('backup_downloaded', 'Downloaded full non-secret JSON backup', req);
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Disposition': `attachment; filename="nurulislam-backup-${dateTag}.json"`,
          'Cache-Control': 'no-store',
        });
        res.end(JSON.stringify(payload, null, 2));
        return;
      }

      // Campaigns CRUD
      if (pathname === '/api/owner/campaigns' && req.method === 'GET') {
        const db = await readDb();
        sendJson(res, 200, { campaigns: db.campaigns });
        return;
      }

      if (pathname === '/api/owner/campaigns' && req.method === 'POST') {
        const b = await readBodyJson(req, 32768);
        const category = ['hashar', 'items', 'money'].includes(b.category) ? b.category : 'hashar';
        const masjidName = cleanStr(b.masjidName, 140);
        const title = cleanStr(b.title, 180);
        if (!masjidName || !title) {
          sendJson(res, 400, { error: 'masjidName and title are required' });
          return;
        }
        const now = new Date().toISOString();
        const campaign = {
          id: crypto.randomUUID(),
          category,
          status: 'active',
          masjidName,
          masjidAddress: cleanStr(b.masjidAddress, 240),
          lat: Number.isFinite(Number(b.lat)) ? Number(b.lat) : 41.3111,
          lng: Number.isFinite(Number(b.lng)) ? Number(b.lng) : 69.2797,
          title,
          description: cleanStr(b.description, 600),
          eventDateTime: cleanStr(b.eventDateTime, 80),
          volunteersNeeded: Math.max(0, Number(b.volunteersNeeded) || 0),
          rsvpDevices: [],
          itemNeedLabel: cleanStr(b.itemNeedLabel, 180),
          pledges: [],
          targetAmount: Math.max(0, Number(b.targetAmount) || 0),
          raisedAmount: Math.max(0, Number(b.raisedAmount) || 0),
          cardNumber: cleanStr(b.cardNumber, 40),
          cardHolder: cleanStr(b.cardHolder, 100),
          paymentUrl: cleanUrl(b.paymentUrl, 300),
          verifiedNote: cleanStr(b.verifiedNote, 160) || 'Masjid mutavallisi bilan tasdiqlangan',
          createdAt: now,
          updatedAt: now,
        };
        await withDbWrite((db) => {
          db.campaigns.unshift(campaign);
          return campaign;
        });
        void recordAudit('ehson_created', `${masjidName}: ${title}`, req);
        sendJson(res, 201, { campaign });
        return;
      }

      const itemMatch = pathname.match(/^\/api\/owner\/campaigns\/([a-zA-Z0-9_-]+)$/);
      if (itemMatch && req.method === 'PATCH') {
        const id = itemMatch[1];
        const b = await readBodyJson(req, 32768);
        const updated = await withDbWrite((db) => {
          const item = db.campaigns.find((c) => c.id === id);
          if (!item) return null;
          if (b.status === 'active' || b.status === 'completed') item.status = b.status;
          if (['hashar', 'items', 'money'].includes(b.category)) item.category = b.category;
          if (b.masjidName !== undefined) item.masjidName = cleanStr(b.masjidName, 140);
          if (b.masjidAddress !== undefined) item.masjidAddress = cleanStr(b.masjidAddress, 240);
          if (b.lat !== undefined && Number.isFinite(Number(b.lat))) item.lat = Number(b.lat);
          if (b.lng !== undefined && Number.isFinite(Number(b.lng))) item.lng = Number(b.lng);
          if (b.title !== undefined) item.title = cleanStr(b.title, 180);
          if (b.description !== undefined) item.description = cleanStr(b.description, 600);
          if (b.eventDateTime !== undefined) item.eventDateTime = cleanStr(b.eventDateTime, 80);
          if (b.volunteersNeeded !== undefined) item.volunteersNeeded = Math.max(0, Number(b.volunteersNeeded) || 0);
          if (b.itemNeedLabel !== undefined) item.itemNeedLabel = cleanStr(b.itemNeedLabel, 180);
          if (b.targetAmount !== undefined) item.targetAmount = Math.max(0, Number(b.targetAmount) || 0);
          if (b.raisedAmount !== undefined) item.raisedAmount = Math.max(0, Number(b.raisedAmount) || 0);
          if (b.cardNumber !== undefined) item.cardNumber = cleanStr(b.cardNumber, 40);
          if (b.cardHolder !== undefined) item.cardHolder = cleanStr(b.cardHolder, 100);
          if (b.paymentUrl !== undefined) item.paymentUrl = cleanUrl(b.paymentUrl, 300);
          if (b.verifiedNote !== undefined) item.verifiedNote = cleanStr(b.verifiedNote, 160);
          item.updatedAt = new Date().toISOString();
          return item;
        });
        if (!updated) {
          sendJson(res, 404, { error: 'Not found' });
          return;
        }
        void recordAudit('ehson_updated', `${updated.masjidName}: ${updated.title} (${updated.status})`, req);
        sendJson(res, 200, { campaign: updated });
        return;
      }

      if (itemMatch && req.method === 'DELETE') {
        const id = itemMatch[1];
        const removed = await withDbWrite((db) => {
          const before = db.campaigns.length;
          db.campaigns = db.campaigns.filter((c) => c.id !== id);
          return db.campaigns.length < before;
        });
        if (removed) void recordAudit('ehson_deleted', `Deleted campaign ${id.slice(0, 8)}`, req);
        sendJson(res, removed ? 200 : 404, { ok: removed });
        return;
      }

      // Owner Broadcasts CRUD (with City + MaxVersionCode targeting!)
      if (pathname === '/api/owner/broadcasts' && req.method === 'GET') {
        sendJson(res, 200, { broadcasts: broadcastsCache });
        return;
      }

      if (pathname === '/api/owner/broadcasts' && req.method === 'POST') {
        const b = await readBodyJson(req, 16384);
        const title = cleanStr(b.title, 140);
        const bodyText = cleanStr(b.body, 400);
        if (!title || !bodyText) {
          sendJson(res, 400, { error: 'title and body are required' });
          return;
        }
        const tone = ['emerald', 'gold', 'urgent'].includes(b.tone) ? b.tone : 'emerald';
        const actionTab = ALLOWED_BROADCAST_TABS.has(b.actionTab) ? b.actionTab : '';
        const safeUrl = cleanUrl(b.actionUrl, 300);
        const languages = Array.isArray(b.languages) ? b.languages.filter((x) => ALLOWED_LANGS.has(x)) : [];
        const platforms = Array.isArray(b.platforms) ? b.platforms.filter((x) => ALLOWED_PLATFORMS.has(x)) : [];
        const cities = Array.isArray(b.cities)
          ? b.cities.map((c) => cleanStr(c, 50)).filter(Boolean).slice(0, 20)
          : [];
        const maxVcNum = Number(b.maxVersionCode);
        const maxVersionCode = Number.isInteger(maxVcNum) && maxVcNum > 0 ? maxVcNum : null;
        const now = new Date().toISOString();
        const item = {
          id: crypto.randomUUID(),
          title,
          body: bodyText,
          tone,
          actionTab,
          actionLabel: cleanStr(b.actionLabel, 40),
          actionUrl: safeUrl,
          languages,
          platforms,
          cities,
          maxVersionCode,
          active: true,
          startsAt: cleanStr(b.startsAt, 40),
          expiresAt: cleanStr(b.expiresAt, 40),
          createdAt: now,
          updatedAt: now,
        };
        await withBroadcastsWrite((db) => {
          db.broadcasts.unshift(item);
          return item;
        });
        void recordAudit('broadcast_created', `${title} (${tone})`, req);
        sendJson(res, 201, { broadcast: item });
        return;
      }

      const bMatch = pathname.match(/^\/api\/owner\/broadcasts\/([a-zA-Z0-9_-]+)$/);
      if (bMatch && req.method === 'PATCH') {
        const id = bMatch[1];
        const b = await readBodyJson(req, 16384);
        const updated = await withBroadcastsWrite((db) => {
          const item = db.broadcasts.find((x) => x.id === id);
          if (!item) return null;
          if (typeof b.active === 'boolean') item.active = b.active;
          if (b.title !== undefined) item.title = cleanStr(b.title, 140);
          if (b.body !== undefined) item.body = cleanStr(b.body, 400);
          if (['emerald', 'gold', 'urgent'].includes(b.tone)) item.tone = b.tone;
          if (b.actionTab !== undefined && ALLOWED_BROADCAST_TABS.has(b.actionTab)) item.actionTab = b.actionTab;
          if (b.actionLabel !== undefined) item.actionLabel = cleanStr(b.actionLabel, 40);
          if (b.actionUrl !== undefined) item.actionUrl = cleanUrl(b.actionUrl, 300);
          if (Array.isArray(b.languages)) item.languages = b.languages.filter((x) => ALLOWED_LANGS.has(x));
          if (Array.isArray(b.platforms)) item.platforms = b.platforms.filter((x) => ALLOWED_PLATFORMS.has(x));
          if (Array.isArray(b.cities)) item.cities = b.cities.map((c) => cleanStr(c, 50)).filter(Boolean).slice(0, 20);
          if (b.maxVersionCode !== undefined) {
            const mv = Number(b.maxVersionCode);
            item.maxVersionCode = Number.isInteger(mv) && mv > 0 ? mv : null;
          }
          if (b.startsAt !== undefined) item.startsAt = cleanStr(b.startsAt, 40);
          if (b.expiresAt !== undefined) item.expiresAt = cleanStr(b.expiresAt, 40);
          item.updatedAt = new Date().toISOString();
          return item;
        });
        if (!updated) {
          sendJson(res, 404, { error: 'Not found' });
          return;
        }
        void recordAudit('broadcast_updated', `${updated.title} (active=${updated.active})`, req);
        sendJson(res, 200, { broadcast: updated });
        return;
      }

      if (bMatch && req.method === 'DELETE') {
        const id = bMatch[1];
        const removed = await withBroadcastsWrite((db) => {
          const before = db.broadcasts.length;
          db.broadcasts = db.broadcasts.filter((x) => x.id !== id);
          return db.broadcasts.length < before;
        });
        if (removed) void recordAudit('broadcast_deleted', `Deleted broadcast ${id.slice(0, 8)}`, req);
        sendJson(res, removed ? 200 : 404, { ok: removed });
        return;
      }
    }

    sendJson(res, 404, { error: 'Not found' });
  } catch (err) {
    console.error('[server error]', err);
    sendJson(res, 500, { error: 'Internal server error' });
  }
});

async function handleShutdown(signal) {
  console.log(`[server] Received ${signal}, flushing devices cache...`);
  try {
    await flushDevicesToDisk(true);
  } catch (err) {
    console.error('[shutdown flush error]', err);
  }
  server.close(() => {
    process.exit(0);
  });
  setTimeout(() => process.exit(0), 2500).unref();
}

process.on('SIGTERM', () => void handleShutdown('SIGTERM'));
process.on('SIGINT', () => void handleShutdown('SIGINT'));

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Nurul-Islam Owner & API Server listening on 127.0.0.1:${PORT}`);
});
