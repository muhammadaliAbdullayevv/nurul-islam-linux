import { API_BASE_URLS } from './appUpdater';
import {
  getHardwareDeviceId,
  getOrCreateDeviceId,
  loadNativeProgressBackup,
  saveNativeProgressBackup,
} from './deviceId';
import { ACTIVITY_UPDATED_EVENT } from './userActivity';

export const PROGRESS_RESTORED_EVENT = 'nq:progress-restored';
export const PROGRESS_SYNC_STATE_EVENT = 'nq:progress-sync-state';
export const PROGRESS_PROMPT_EVENT = 'nq:progress-restore-prompt';

const SYNC_META_STORAGE_KEY = 'nq_cloud_backup_meta_v1';
const RESTORE_PROMPT_DECISION_KEY = 'nq_restore_prompt_decided_v1';

export interface PendingRestoreCandidate {
  matchedBy: string;
  recoveryCode: string;
  score: number;
  summary: CloudBackupSummary;
  updatedAt: string | null;
  snapshot: Record<string, string>;
}

let pendingRestoreCandidate: PendingRestoreCandidate | null = null;

export function getPendingRestoreCandidate(): PendingRestoreCandidate | null {
  return pendingRestoreCandidate;
}

export function subscribeRestorePrompt(
  listener: (candidate: PendingRestoreCandidate | null) => void
): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => listener(pendingRestoreCandidate);
  window.addEventListener(PROGRESS_PROMPT_EVENT, handler);
  return () => window.removeEventListener(PROGRESS_PROMPT_EVENT, handler);
}

function setPendingRestoreCandidate(next: PendingRestoreCandidate | null): void {
  pendingRestoreCandidate = next;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(PROGRESS_PROMPT_EVENT));
  }
}

export function acceptPendingRestoreCandidate(): boolean {
  if (!pendingRestoreCandidate) return false;
  const cand = pendingRestoreCandidate;
  try {
    localStorage.setItem(RESTORE_PROMPT_DECISION_KEY, 'accepted');
  } catch {
    // ignore
  }
  applyProgressSnapshotToLocal(cand.snapshot, true);
  saveCloudBackupMeta({
    recoveryCode: cand.recoveryCode || getCachedCloudBackupMeta().recoveryCode,
    lastSyncedAt: cand.updatedAt || new Date().toISOString(),
    score: cand.score,
    summary: cand.summary,
    lastRestoredBy: cand.matchedBy,
  });
  setPendingRestoreCandidate(null);
  void syncOrAutoRestoreProgress({ force: true });
  return true;
}

export function dismissPendingRestoreCandidate(): void {
  try {
    localStorage.setItem(RESTORE_PROMPT_DECISION_KEY, 'declined');
  } catch {
    // ignore
  }
  setPendingRestoreCandidate(null);
  void syncOrAutoRestoreProgress({ force: true, confirmOverwrite: true });
}

export const USER_PROGRESS_KEYS = [
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
] as const;

export interface CloudBackupSummary {
  completedSurahs: number;
  bookmarks: number;
  tasbihBeads: number;
  namesMastered: number;
  knowledgeMastered: number;
  booksStarted: number;
  fastedDays: number;
  handle: string;
  city: string;
}

export interface CloudBackupMeta {
  recoveryCode: string;
  recoveryKeyHint: string;
  lastSyncedAt: string | null;
  score: number;
  summary: CloudBackupSummary | null;
  lastRestoredBy?: string;
}

function safeParse<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function collectLocalProgressSnapshot(): Record<string, string> {
  const snap: Record<string, string> = {};
  try {
    for (const key of USER_PROGRESS_KEYS) {
      const val = localStorage.getItem(key);
      if (val !== null && val !== undefined && val !== '') {
        snap[key] = val;
      }
    }
  } catch {
    // ignore storage errors
  }
  return snap;
}

export function computeSnapshotScore(snap: Record<string, string>): number {
  const completedSurahs = safeParse<unknown[]>(snap.nq_quran_completed_surahs, []);
  const bookmarks = safeParse<unknown[]>(snap.nq_bookmarks, []);
  const tasbih = safeParse<{ totalBeads?: number }>(snap.nq_tasbih_stats, {});
  const act = safeParse<{
    masteredNameNumbers?: number[];
    masteredKnowledgeIds?: string[];
    quranListenSeconds?: number;
  }>(snap.nq_user_activity_v1, {});
  const lib = safeParse<Record<string, unknown>>(snap.nq_library_progress_v2, {});
  const ramadan = safeParse<Record<string, string>>(snap.nq_ramadan_fasts, {});
  const qazo = safeParse<Record<string, number>>(snap.nq_qazo_counts, {});
  const hifz = safeParse<unknown[]>(snap.nq_hifz_mastered_v1, []);
  const muallim = safeParse<unknown[]>(snap.nq_muallimi_soniy_done_v1, []);
  const lastRead = safeParse<{ surahNumber?: number } | null>(snap.nq_quran_last_read, null);

  const surahCount = Array.isArray(completedSurahs) ? completedSurahs.length : 0;
  const bookmarkCount = Array.isArray(bookmarks) ? bookmarks.length : 0;
  const beads = Math.max(0, Number(tasbih?.totalBeads) || 0);
  const namesCount = Array.isArray(act?.masteredNameNumbers) ? act.masteredNameNumbers.length : 0;
  const knowCount = Array.isArray(act?.masteredKnowledgeIds) ? act.masteredKnowledgeIds.length : 0;
  const listenSec = Math.max(0, Number(act?.quranListenSeconds) || 0);
  const bookCount = lib && typeof lib === 'object' ? Object.keys(lib).length : 0;
  const fastCount =
    ramadan && typeof ramadan === 'object'
      ? Object.values(ramadan).filter((v) => v === 'completed').length
      : 0;
  const qazoSum =
    qazo && typeof qazo === 'object'
      ? Object.values(qazo).reduce((s, n) => s + (Number(n) || 0), 0)
      : 0;
  const hifzCount = Array.isArray(hifz) ? hifz.length : 0;
  const muallimCount = Array.isArray(muallim) ? muallim.length : 0;
  const hasLastRead = Boolean(lastRead && Number(lastRead.surahNumber) >= 1);
  const wisdomBm = safeParse<unknown[]>(snap.nq_wisdom_bookmarks_v1, []);
  const savedLib = safeParse<unknown[]>(snap.nq_saved_library_v1, []);
  const jumaSalawat = safeParse<{ count?: number }>(snap.nq_juma_salawat_v1, {});
  const wisdomCount = Array.isArray(wisdomBm) ? wisdomBm.length : 0;
  const savedLibCount = Array.isArray(savedLib) ? savedLib.length : 0;
  const salawatCount = Math.max(0, Number(jumaSalawat?.count) || 0);

  return (
    surahCount * 120 +
    bookmarkCount * 60 +
    Math.min(50_000, Math.floor(beads / 2)) +
    namesCount * 40 +
    knowCount * 35 +
    Math.floor(listenSec / 15) +
    bookCount * 50 +
    fastCount * 45 +
    (qazoSum > 0 ? 80 : 0) +
    hifzCount * 40 +
    muallimCount * 35 +
    wisdomCount * 30 +
    savedLibCount * 30 +
    Math.min(5_000, salawatCount * 2) +
    (hasLastRead ? 40 : 0)
  );
}

function mergeUniqueJsonArray(aRaw?: string, bRaw?: string): string {
  const a = safeParse<unknown[]>(aRaw, []);
  const b = safeParse<unknown[]>(bRaw, []);
  const listA = Array.isArray(a) ? a : [];
  const listB = Array.isArray(b) ? b : [];
  return JSON.stringify(Array.from(new Set([...listA, ...listB])));
}

/**
 * Non-destructively merges an incoming cloud/native snapshot with current localStorage
 * so restoring never wipes out any newly added local bookmarks, surahs, or beads.
 */
export function applyProgressSnapshotToLocal(
  incoming: Record<string, string>,
  preferIncomingSettings = true
): boolean {
  if (!incoming || typeof incoming !== 'object') return false;
  const current = collectLocalProgressSnapshot();
  const merged: Record<string, string> = preferIncomingSettings
    ? { ...current, ...incoming }
    : { ...incoming, ...current };

  // 1. Set-union completed ID arrays
  for (const key of [
    'nq_quran_completed_surahs',
    'nq_hifz_mastered_v1',
    'nq_muallimi_soniy_done_v1',
    'nq_library_favs_v1',
    'nq_radio_favorites_v1',
  ]) {
    if (current[key] && incoming[key]) {
      merged[key] = mergeUniqueJsonArray(current[key], incoming[key]);
    }
  }

  // 2. Bookmarks union
  if (current.nq_bookmarks && incoming.nq_bookmarks) {
    const curB = safeParse<Array<{ id?: string; surahNumber?: number; ayahNumber?: number }>>(
      current.nq_bookmarks,
      []
    );
    const incB = safeParse<Array<{ id?: string; surahNumber?: number; ayahNumber?: number }>>(
      incoming.nq_bookmarks,
      []
    );
    if (Array.isArray(curB) && Array.isArray(incB)) {
      const map = new Map<string, unknown>();
      for (const item of [...curB, ...incB]) {
        if (item && typeof item === 'object') {
          const k = item.id || `${item.surahNumber}:${item.ayahNumber}`;
          if (k) map.set(k, item);
        }
      }
      merged.nq_bookmarks = JSON.stringify(Array.from(map.values()));
    }
  }

  // 3. User Activity union & max counters
  if (current.nq_user_activity_v1 && incoming.nq_user_activity_v1) {
    const aCur = safeParse<Record<string, unknown>>(current.nq_user_activity_v1, {});
    const aInc = safeParse<Record<string, unknown>>(incoming.nq_user_activity_v1, {});
    const names = Array.from(
      new Set([
        ...(Array.isArray(aCur.masteredNameNumbers) ? (aCur.masteredNameNumbers as number[]) : []),
        ...(Array.isArray(aInc.masteredNameNumbers) ? (aInc.masteredNameNumbers as number[]) : []),
      ])
    );
    const know = Array.from(
      new Set([
        ...(Array.isArray(aCur.masteredKnowledgeIds) ? (aCur.masteredKnowledgeIds as string[]) : []),
        ...(Array.isArray(aInc.masteredKnowledgeIds) ? (aInc.masteredKnowledgeIds as string[]) : []),
      ])
    );
    const missed = Array.from(
      new Set([
        ...(Array.isArray(aCur.missedKnowledgeIds) ? (aCur.missedKnowledgeIds as string[]) : []),
        ...(Array.isArray(aInc.missedKnowledgeIds) ? (aInc.missedKnowledgeIds as string[]) : []),
      ])
    ).filter((id) => !know.includes(id));

    merged.nq_user_activity_v1 = JSON.stringify({
      masteredNameNumbers: names,
      quizCorrectTotal: Math.max(Number(aCur.quizCorrectTotal) || 0, Number(aInc.quizCorrectTotal) || 0),
      quizSessionsCompleted: Math.max(
        Number(aCur.quizSessionsCompleted) || 0,
        Number(aInc.quizSessionsCompleted) || 0
      ),
      quizBestStreak: Math.max(Number(aCur.quizBestStreak) || 0, Number(aInc.quizBestStreak) || 0),
      quranListenSeconds: Math.max(
        Number(aCur.quranListenSeconds) || 0,
        Number(aInc.quranListenSeconds) || 0
      ),
      masteredKnowledgeIds: know,
      missedKnowledgeIds: missed,
      knowledgeCorrectTotal: Math.max(
        Number(aCur.knowledgeCorrectTotal) || 0,
        Number(aInc.knowledgeCorrectTotal) || 0
      ),
    });
  }

  // 4. Tasbih max totalBeads
  if (current.nq_tasbih_stats && incoming.nq_tasbih_stats) {
    const tCur = safeParse<Record<string, unknown>>(current.nq_tasbih_stats, {});
    const tInc = safeParse<Record<string, unknown>>(incoming.nq_tasbih_stats, {});
    const curTotal = Number(tCur.totalBeads) || 0;
    const incTotal = Number(tInc.totalBeads) || 0;
    merged.nq_tasbih_stats = JSON.stringify({
      ...(incTotal >= curTotal ? tInc : tCur),
      totalBeads: Math.max(curTotal, incTotal),
    });
  }

  // 5. Library progress v2 per book
  if (current.nq_library_progress_v2 && incoming.nq_library_progress_v2) {
    const lCur = safeParse<Record<string, { updatedAt?: number }>>(current.nq_library_progress_v2, {});
    const lInc = safeParse<Record<string, { updatedAt?: number }>>(incoming.nq_library_progress_v2, {});
    const out = { ...lCur };
    for (const [bookId, entry] of Object.entries(lInc)) {
      const prev = out[bookId];
      if (!prev || (Number(entry?.updatedAt) || 0) >= (Number(prev?.updatedAt) || 0)) {
        out[bookId] = entry;
      }
    }
    merged.nq_library_progress_v2 = JSON.stringify(out);
  }

  // 6. Ramadan fasts
  if (current.nq_ramadan_fasts && incoming.nq_ramadan_fasts) {
    const rCur = safeParse<Record<string, string>>(current.nq_ramadan_fasts, {});
    const rInc = safeParse<Record<string, string>>(incoming.nq_ramadan_fasts, {});
    merged.nq_ramadan_fasts = JSON.stringify({ ...rCur, ...rInc });
  }

  // Ensure onboarding is marked done when restoring a valid snapshot
  if (Object.keys(merged).length > 0) {
    merged.nq_onboarding_done = '1';
  }

  let changed = false;
  applyingSnapshotInternally = true;
  try {
    for (const key of USER_PROGRESS_KEYS) {
      const nextVal = merged[key];
      if (typeof nextVal === 'string' && nextVal.length > 0) {
        const prevVal = localStorage.getItem(key);
        if (prevVal !== nextVal) {
          localStorage.setItem(key, nextVal);
          changed = true;
        }
      }
    }
    localStorage.removeItem('nq_onboarding_in_progress');
    saveNativeProgressBackup(JSON.stringify(merged));
  } catch {
    // ignore storage errors
  } finally {
    applyingSnapshotInternally = false;
  }

  if (changed && typeof window !== 'undefined') {
    window.dispatchEvent(new Event(ACTIVITY_UPDATED_EVENT));
    window.dispatchEvent(new Event(PROGRESS_RESTORED_EVENT));
  }
  return changed;
}

export function getCachedCloudBackupMeta(): CloudBackupMeta {
  const raw = safeParse<Partial<CloudBackupMeta>>(
    typeof localStorage !== 'undefined' ? localStorage.getItem(SYNC_META_STORAGE_KEY) : null,
    {}
  );
  const snap = collectLocalProgressSnapshot();
  const handle = snap.nq_user_handle || '';
  return {
    recoveryCode: raw.recoveryCode || (/^NI-[A-Z0-9]{5,8}$/i.test(handle) ? handle.toUpperCase() : ''),
    recoveryKeyHint: raw.recoveryKeyHint || '',
    lastSyncedAt: raw.lastSyncedAt || null,
    score: typeof raw.score === 'number' ? raw.score : computeSnapshotScore(snap),
    summary: raw.summary || null,
    lastRestoredBy: raw.lastRestoredBy,
  };
}

function saveCloudBackupMeta(next: Partial<CloudBackupMeta>): CloudBackupMeta {
  const merged: CloudBackupMeta = {
    ...getCachedCloudBackupMeta(),
    ...next,
  };
  try {
    localStorage.setItem(SYNC_META_STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // ignore
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(PROGRESS_SYNC_STATE_EVENT));
  }
  return merged;
}

export function subscribeCloudBackupMeta(listener: (meta: CloudBackupMeta) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => listener(getCachedCloudBackupMeta());
  window.addEventListener(PROGRESS_SYNC_STATE_EVENT, handler);
  return () => window.removeEventListener(PROGRESS_SYNC_STATE_EVENT, handler);
}

let syncInFlight: Promise<CloudBackupMeta> | null = null;
let lastUploadedSig = '';

/**
 * Boot-time automatic recovery:
 * 1. First checks Android Native SharedPreferences backup (`NqNativeBridge.loadProgressBackup()`).
 * 2. Then checks VPS Cloud Backup (`POST /api/progress/sync`), which matches by:
 *    - Android `hardwareId` (`Settings.Secure.ANDROID_ID` hash — survives uninstall/reinstall)
 *    - `deviceId`
 *    - Same-Phone Fingerprint (`Client IP + Android Device Model from User-Agent`) when local progress is empty!
 */
export async function syncOrAutoRestoreProgress(options?: {
  force?: boolean;
  recoveryKey?: string;
  clearRecoveryKey?: boolean;
  confirmOverwrite?: boolean;
}): Promise<CloudBackupMeta> {
  if (syncInFlight && !options?.recoveryKey && !options?.clearRecoveryKey && !options?.confirmOverwrite) {
    return syncInFlight;
  }

  const run = (async (): Promise<CloudBackupMeta> => {
    const promptDecided =
      typeof localStorage !== 'undefined' && Boolean(localStorage.getItem(RESTORE_PROMPT_DECISION_KEY));

    // Step 1: On Android, check if native SharedPreferences has a backup when localStorage was wiped
    const localSnapBefore = collectLocalProgressSnapshot();
    const localScoreBefore = computeSnapshotScore(localSnapBefore);
    const nativeRaw = loadNativeProgressBackup();
    if (nativeRaw && localScoreBefore === 0 && !promptDecided) {
      const nativeSnap = safeParse<Record<string, string>>(nativeRaw, {});
      const nativeScore = computeSnapshotScore(nativeSnap);
      if (nativeScore > 0) {
        const completedArr = safeParse<unknown[]>(nativeSnap.nq_quran_completed_surahs, []);
        const bmArr = safeParse<unknown[]>(nativeSnap.nq_bookmarks, []);
        const tasbihObj = safeParse<{ totalBeads?: number }>(nativeSnap.nq_tasbih_stats, {});
        const actObj = safeParse<{
          masteredNameNumbers?: number[];
          masteredKnowledgeIds?: number[];
        }>(nativeSnap.nq_user_activity_v1, {});
        const libObj = safeParse<Record<string, unknown>>(nativeSnap.nq_library_progress_v2, {});
        const cityObj = safeParse<{ cityName?: string }>(nativeSnap.nq_city, {});
        setPendingRestoreCandidate({
          matchedBy: 'nativeBackup',
          recoveryCode: nativeSnap.nq_user_handle || '',
          score: nativeScore,
          summary: {
            completedSurahs: Array.isArray(completedArr) ? completedArr.length : 0,
            bookmarks: Array.isArray(bmArr) ? bmArr.length : 0,
            tasbihBeads: Math.max(0, Number(tasbihObj?.totalBeads) || 0),
            namesMastered: Array.isArray(actObj?.masteredNameNumbers)
              ? actObj.masteredNameNumbers.length
              : 0,
            knowledgeMastered: Array.isArray(actObj?.masteredKnowledgeIds)
              ? actObj.masteredKnowledgeIds.length
              : 0,
            booksStarted: libObj && typeof libObj === 'object' ? Object.keys(libObj).length : 0,
            fastedDays: 0,
            handle: nativeSnap.nq_user_handle || '',
            city: cityObj?.cityName || '',
          },
          updatedAt: new Date().toISOString(),
          snapshot: nativeSnap,
        });
      }
    }

    const snapshot = collectLocalProgressSnapshot();
    const score = computeSnapshotScore(snapshot);

    // Mirror current progress to Android SharedPreferences if non-empty
    if (score > 0 || Object.keys(snapshot).length > 3) {
      saveNativeProgressBackup(JSON.stringify(snapshot));
    }

    const sig = `${score}|${Object.keys(snapshot).length}|${snapshot.nq_quran_last_read || ''}|${
      snapshot.nq_bookmarks?.length || 0
    }|${snapshot.nq_quran_completed_surahs?.length || 0}|${snapshot.nq_tasbih_stats || ''}|${
      snapshot.nq_user_activity_v1?.length || 0
    }|${snapshot.nq_library_progress_v2?.length || 0}|${snapshot.nq_qazo_counts || ''}|${
      snapshot.nq_user_handle || ''
    }`;

    if (
      !options?.force &&
      !options?.recoveryKey &&
      !options?.clearRecoveryKey &&
      !options?.confirmOverwrite &&
      sig === lastUploadedSig &&
      getCachedCloudBackupMeta().lastSyncedAt
    ) {
      return getCachedCloudBackupMeta();
    }

    const deviceId = getOrCreateDeviceId();
    const hardwareId = getHardwareDeviceId();
    const body = JSON.stringify({
      deviceId,
      hardwareId,
      score,
      snapshot,
      ...(options?.recoveryKey !== undefined ? { recoveryKey: options.recoveryKey } : {}),
      ...(options?.clearRecoveryKey ? { clearRecoveryKey: true } : {}),
      ...(options?.confirmOverwrite || promptDecided ? { confirmOverwrite: true } : {}),
    });

    for (const baseUrl of API_BASE_URLS) {
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), 6500);
      try {
        const res = await fetch(`${baseUrl}/api/progress/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          signal: controller.signal,
        });
        if (!res.ok) continue;
        const data = (await res.json()) as {
          ok?: boolean;
          promptRestore?: boolean;
          autoRestored?: boolean;
          matchedBy?: string;
          recoveryCode?: string;
          recoveryKeyHint?: string;
          score?: number;
          summary?: CloudBackupSummary;
          updatedAt?: string;
          snapshot?: Record<string, string>;
        };
        if (!data?.ok) continue;

        if (
          data.promptRestore &&
          !promptDecided &&
          Number(data.score) > 0 &&
          score === 0 &&
          data.snapshot &&
          Object.keys(data.snapshot).length > 0 &&
          data.summary
        ) {
          setPendingRestoreCandidate({
            matchedBy: data.matchedBy || 'cloud',
            recoveryCode: data.recoveryCode || '',
            score: Number(data.score) || 0,
            summary: data.summary,
            updatedAt: data.updatedAt || null,
            snapshot: data.snapshot,
          });
          return getCachedCloudBackupMeta();
        }

        // If user now has local progress (score > 0), mark prompt decided so we never show a stale restore prompt mid-session
        if (score > 0 && !promptDecided) {
          try {
            localStorage.setItem(RESTORE_PROMPT_DECISION_KEY, 'active');
          } catch {
            // ignore
          }
        }

        if (data.autoRestored && data.snapshot && Object.keys(data.snapshot).length > 0) {
          applyProgressSnapshotToLocal(data.snapshot, score === 0);
        }

        lastUploadedSig = sig;
        return saveCloudBackupMeta({
          recoveryCode: data.recoveryCode || getCachedCloudBackupMeta().recoveryCode,
          recoveryKeyHint:
            data.recoveryKeyHint !== undefined
              ? data.recoveryKeyHint
              : getCachedCloudBackupMeta().recoveryKeyHint,
          lastSyncedAt: data.updatedAt || new Date().toISOString(),
          score: typeof data.score === 'number' ? data.score : score,
          summary: data.summary || getCachedCloudBackupMeta().summary,
          ...(data.autoRestored ? { lastRestoredBy: data.matchedBy || 'cloud' } : {}),
        });
      } catch {
        // try next mirror
      } finally {
        window.clearTimeout(timer);
      }
    }

    return getCachedCloudBackupMeta();
  })();

  syncInFlight = run.finally(() => {
    syncInFlight = null;
  });
  return syncInFlight;
}

const PROGRESS_KEY_SET = new Set<string>(USER_PROGRESS_KEYS);
let interceptorInstalled = false;
let autoWatchDebounceTimer: number | undefined;
let applyingSnapshotInternally = false;

/**
 * Intercepts `localStorage.setItem` across the entire app so ANY change in Tasbih,
 * Quran bookmarks/last-read/completed surahs, Quiz/Asma mastery, Qazo, Ramadan, or Library
 * immediately mirrors to Android Native SharedPreferences and syncs to the VPS within 1.2s.
 */
export function installAutoProgressInterceptor(): void {
  if (interceptorInstalled || typeof window === 'undefined' || typeof Storage === 'undefined') {
    return;
  }
  interceptorInstalled = true;
  const origSetItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function (key: string, value: string): void {
    origSetItem.call(this, key, value);
    if (applyingSnapshotInternally || !PROGRESS_KEY_SET.has(key)) return;
    // Immediately mirror to native Android SharedPreferences (<0.5ms)
    try {
      const snap = collectLocalProgressSnapshot();
      if (computeSnapshotScore(snap) > 0) {
        saveNativeProgressBackup(JSON.stringify(snap));
      }
    } catch {
      // ignore
    }
    if (autoWatchDebounceTimer) window.clearTimeout(autoWatchDebounceTimer);
    autoWatchDebounceTimer = window.setTimeout(() => {
      void syncOrAutoRestoreProgress();
    }, 1200);
  };
}

/**
 * Manual 1-tap restore by Recovery Code (`NI-XXXXXX`) or Linked Phone / Passphrase.
 */
export async function restoreProgressByCodeOrKey(codeOrKey: string): Promise<{
  ok: boolean;
  found: boolean;
  summary?: CloudBackupSummary;
  recoveryCode?: string;
  error?: string;
}> {
  const clean = codeOrKey.trim();
  if (clean.length < 4) {
    return { ok: false, found: false, error: 'too_short' };
  }
  const deviceId = getOrCreateDeviceId();
  const hardwareId = getHardwareDeviceId();
  const body = JSON.stringify({
    deviceId,
    hardwareId,
    codeOrKey: clean,
    autoDetect: false,
  });

  for (const baseUrl of API_BASE_URLS) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 7000);
    try {
      const res = await fetch(`${baseUrl}/api/progress/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        signal: controller.signal,
      });
      if (!res.ok) continue;
      const data = (await res.json()) as {
        ok?: boolean;
        found?: boolean;
        matchedBy?: string;
        recoveryCode?: string;
        recoveryKeyHint?: string;
        score?: number;
        summary?: CloudBackupSummary;
        updatedAt?: string;
        snapshot?: Record<string, string>;
      };
      if (!data?.ok) continue;
      if (!data.found || !data.snapshot) {
        return { ok: true, found: false };
      }

      applyProgressSnapshotToLocal(data.snapshot, true);
      saveCloudBackupMeta({
        recoveryCode: data.recoveryCode || getCachedCloudBackupMeta().recoveryCode,
        recoveryKeyHint: data.recoveryKeyHint || getCachedCloudBackupMeta().recoveryKeyHint,
        lastSyncedAt: data.updatedAt || new Date().toISOString(),
        score: typeof data.score === 'number' ? data.score : computeSnapshotScore(data.snapshot),
        summary: data.summary || null,
        lastRestoredBy: 'code',
      });
      // Immediately push merged union back so this device is linked cleanly
      void syncOrAutoRestoreProgress({ force: true });
      return {
        ok: true,
        found: true,
        summary: data.summary,
        recoveryCode: data.recoveryCode,
      };
    } catch {
      // try next mirror
    } finally {
      window.clearTimeout(timer);
    }
  }
  return { ok: false, found: false, error: 'network_error' };
}
