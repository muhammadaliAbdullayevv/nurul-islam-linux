import { Capacitor } from '@capacitor/core';
import { AppLanguage } from '../types';
import { API_BASE_URLS, getLocalAppVersion, isDesktopRpmUpdaterSupported } from './appUpdater';
import { getOrCreateDeviceId } from './deviceId';
import type { LiveBroadcast } from './broadcasts';

export interface RemoteExtraRadioStation {
  id: string;
  name: string;
  arabicName: string;
  subtitle: string;
  category: 'reciters' | 'haramain' | 'calm';
  streamUrl: string;
}

export interface RemoteAppConfig {
  updatedAt: string | null;
  forceWebReloadNonce: number;
  hijriDayOffset: number;
  ramadanMode: 'auto' | 'force_on' | 'force_off';
  features: {
    ehson: boolean;
    radio: boolean;
    haramain: boolean;
    library: boolean;
    namesBattle: boolean;
    masjids: boolean;
    broadcasts: boolean;
    zakat: boolean;
    ramadan: boolean;
  };
  haramainLive: {
    makkahUrl: string;
    madinahUrl: string;
  };
  maintenance: {
    enabled: boolean;
    title: string;
    message: string;
  };
  zakat: {
    goldPriceUsd: number;
    officialNisabUzs: number;
    nisabNote: string;
  };
  links: {
    playStoreUrl: string;
    telegramUrl: string;
    supportEmail: string;
    privacyPolicyUrl: string;
    websiteUrl: string;
  };
  radio: {
    disabledStationIds: string[];
    extraStations: RemoteExtraRadioStation[];
  };
  prayerNotice: {
    enabled: boolean;
    text: string;
  };
  reviewPrompt: {
    enabled: boolean;
    minOpens: number;
  };
}

export interface DirectDeviceMessage {
  id: string;
  title: string;
  body: string;
  tone: 'emerald' | 'gold' | 'urgent';
  actionTab?: string;
  actionUrl?: string;
  sentAt: string;
}

export interface PendingDeviceCommand {
  id: string;
  type: 'reload' | 'reset_cache' | 'force_update';
  issuedAt: string;
}

export interface DeviceDirective {
  role: 'user' | 'tester' | 'vip';
  bypassMaintenance: boolean;
  blocked: boolean;
  blockReason: string;
  disabledFeatures: string[];
  directMessage: DirectDeviceMessage | null;
  pendingCommand: PendingDeviceCommand | null;
}

export const DEFAULT_REMOTE_APP_CONFIG: RemoteAppConfig = {
  updatedAt: null,
  forceWebReloadNonce: 0,
  hijriDayOffset: 0,
  ramadanMode: 'auto',
  features: {
    ehson: true,
    radio: true,
    haramain: true,
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

export const DEFAULT_DEVICE_DIRECTIVE: DeviceDirective = {
  role: 'user',
  bypassMaintenance: false,
  blocked: false,
  blockReason: '',
  disabledFeatures: [],
  directMessage: null,
  pendingCommand: null,
};

const STORAGE_KEY = 'nq_remote_app_config_v1';
const DIRECTIVE_STORAGE_KEY = 'nq_device_directive_v1';
const BROADCASTS_CACHE_KEY = 'nq_broadcasts_cache';
const LAST_CMD_KEY = 'nq_last_executed_cmd_id_v1';
const WEB_RELOAD_NONCE_KEY = 'nq_seen_web_reload_nonce_v1';
const CONFIG_EVENT = 'nq:remote-app-config-updated';
const DIRECTIVE_EVENT = 'nq:device-directive-updated';
const BROADCASTS_EVENT = 'nq:live-broadcasts-updated';
export const REMOTE_FORCE_UPDATE_EVENT = 'nq:remote-force-update';

let memoryConfig: RemoteAppConfig | null = null;
let memoryDirective: DeviceDirective | null = null;
let memoryBroadcasts: LiveBroadcast[] | null = null;
let lastSyncEtag: string | null = null;
let syncInFlight: Promise<void> | null = null;
let lastSyncAtMs = 0;

function mergeConfig(raw: unknown): RemoteAppConfig {
  if (!raw || typeof raw !== 'object') return DEFAULT_REMOTE_APP_CONFIG;
  const r = raw as Partial<RemoteAppConfig>;
  const hijriRaw = Number(r.hijriDayOffset);
  const nonceRaw = Number(r.forceWebReloadNonce);
  return {
    updatedAt: typeof r.updatedAt === 'string' ? r.updatedAt : null,
    forceWebReloadNonce: Number.isFinite(nonceRaw) && nonceRaw >= 0 ? Math.floor(nonceRaw) : 0,
    hijriDayOffset: Number.isFinite(hijriRaw) ? Math.max(-2, Math.min(2, Math.round(hijriRaw))) : 0,
    ramadanMode: r.ramadanMode === 'force_on' || r.ramadanMode === 'force_off' ? r.ramadanMode : 'auto',
    features: {
      ...DEFAULT_REMOTE_APP_CONFIG.features,
      ...(r.features && typeof r.features === 'object' ? r.features : {}),
    },
    haramainLive: {
      makkahUrl: typeof r.haramainLive?.makkahUrl === 'string' ? r.haramainLive.makkahUrl.trim() : '',
      madinahUrl: typeof r.haramainLive?.madinahUrl === 'string' ? r.haramainLive.madinahUrl.trim() : '',
    },
    maintenance: {
      ...DEFAULT_REMOTE_APP_CONFIG.maintenance,
      ...(r.maintenance && typeof r.maintenance === 'object' ? r.maintenance : {}),
    },
    zakat: {
      ...DEFAULT_REMOTE_APP_CONFIG.zakat,
      ...(r.zakat && typeof r.zakat === 'object' ? r.zakat : {}),
    },
    links: {
      ...DEFAULT_REMOTE_APP_CONFIG.links,
      ...(r.links && typeof r.links === 'object' ? r.links : {}),
    },
    radio: {
      disabledStationIds: Array.isArray(r.radio?.disabledStationIds)
        ? r.radio.disabledStationIds.filter((x): x is string => typeof x === 'string')
        : [],
      extraStations: Array.isArray(r.radio?.extraStations)
        ? r.radio.extraStations.filter(
            (x): x is RemoteExtraRadioStation =>
              Boolean(x && typeof x.id === 'string' && typeof x.name === 'string' && typeof x.streamUrl === 'string')
          )
        : [],
    },
    prayerNotice: {
      ...DEFAULT_REMOTE_APP_CONFIG.prayerNotice,
      ...(r.prayerNotice && typeof r.prayerNotice === 'object' ? r.prayerNotice : {}),
    },
    reviewPrompt: {
      ...DEFAULT_REMOTE_APP_CONFIG.reviewPrompt,
      ...(r.reviewPrompt && typeof r.reviewPrompt === 'object' ? r.reviewPrompt : {}),
    },
  };
}

function mergeDirective(raw: unknown): DeviceDirective {
  if (!raw || typeof raw !== 'object') return DEFAULT_DEVICE_DIRECTIVE;
  const r = raw as Partial<DeviceDirective>;
  return {
    role: r.role === 'tester' || r.role === 'vip' ? r.role : 'user',
    bypassMaintenance: Boolean(r.bypassMaintenance),
    blocked: Boolean(r.blocked),
    blockReason: typeof r.blockReason === 'string' ? r.blockReason : '',
    disabledFeatures: Array.isArray(r.disabledFeatures)
      ? r.disabledFeatures.filter((x): x is string => typeof x === 'string')
      : [],
    directMessage:
      r.directMessage && typeof r.directMessage === 'object' && typeof r.directMessage.id === 'string'
        ? r.directMessage
        : null,
    pendingCommand:
      r.pendingCommand && typeof r.pendingCommand === 'object' && typeof r.pendingCommand.id === 'string'
        ? r.pendingCommand
        : null,
  };
}

export function getCachedRemoteAppConfig(): RemoteAppConfig {
  if (memoryConfig) return memoryConfig;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      memoryConfig = mergeConfig(JSON.parse(raw));
      return memoryConfig;
    }
  } catch {
    // ignore
  }
  memoryConfig = DEFAULT_REMOTE_APP_CONFIG;
  return memoryConfig;
}

export function getCachedDeviceDirective(): DeviceDirective {
  if (memoryDirective) return memoryDirective;
  try {
    const raw = localStorage.getItem(DIRECTIVE_STORAGE_KEY);
    if (raw) {
      memoryDirective = mergeDirective(JSON.parse(raw));
      return memoryDirective;
    }
  } catch {
    // ignore
  }
  memoryDirective = DEFAULT_DEVICE_DIRECTIVE;
  return memoryDirective;
}

export function getCachedLiveBroadcasts(): LiveBroadcast[] {
  if (memoryBroadcasts) return memoryBroadcasts;
  try {
    const raw = localStorage.getItem(BROADCASTS_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as LiveBroadcast[];
      if (Array.isArray(parsed)) {
        memoryBroadcasts = parsed;
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return [];
}

export function subscribeRemoteAppConfig(listener: (cfg: RemoteAppConfig) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => listener(getCachedRemoteAppConfig());
  window.addEventListener(CONFIG_EVENT, handler);
  return () => window.removeEventListener(CONFIG_EVENT, handler);
}

export function subscribeDeviceDirective(listener: (dir: DeviceDirective) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => listener(getCachedDeviceDirective());
  window.addEventListener(DIRECTIVE_EVENT, handler);
  return () => window.removeEventListener(DIRECTIVE_EVENT, handler);
}

export function subscribeLiveBroadcasts(listener: (list: LiveBroadcast[]) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => listener(getCachedLiveBroadcasts());
  window.addEventListener(BROADCASTS_EVENT, handler);
  return () => window.removeEventListener(BROADCASTS_EVENT, handler);
}

export function detectClientPlatform(): 'android' | 'android-play' | 'desktop' | 'web' {
  if (typeof window !== 'undefined') {
    const win = window as Window & {
      __NQ_LINUX_DESKTOP__?: boolean;
      NqUpdaterBridge?: { isDirectOtaEnabled?: () => boolean };
    };
    if (win.__NQ_LINUX_DESKTOP__ || isDesktopRpmUpdaterSupported()) {
      return 'desktop';
    }
    if (Capacitor.isNativePlatform()) {
      if (typeof win.NqUpdaterBridge?.isDirectOtaEnabled === 'function' && !win.NqUpdaterBridge.isDirectOtaEnabled()) {
        return 'android-play';
      }
      return 'android';
    }
  }
  return 'web';
}

async function sendDeviceAck(payload: { commandId?: string; directMessageId?: string }): Promise<void> {
  const body = JSON.stringify({
    deviceId: getOrCreateDeviceId(),
    ...payload,
  });
  for (const baseUrl of API_BASE_URLS) {
    try {
      const res = await fetch(`${baseUrl}/api/device/ack`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      if (res.ok) return;
    } catch {
      // ignore
    }
  }
}

export async function acknowledgeDirectMessage(directMessageId: string): Promise<void> {
  const cur = getCachedDeviceDirective();
  if (cur.directMessage?.id === directMessageId) {
    memoryDirective = { ...cur, directMessage: null };
    try {
      localStorage.setItem(DIRECTIVE_STORAGE_KEY, JSON.stringify(memoryDirective));
    } catch {
      // ignore
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(DIRECTIVE_EVENT));
    }
  }
  await sendDeviceAck({ directMessageId });
}

async function executePendingCommandOnce(cmd: PendingDeviceCommand): Promise<void> {
  try {
    if (localStorage.getItem(LAST_CMD_KEY) === cmd.id) return;
    localStorage.setItem(LAST_CMD_KEY, cmd.id);
  } catch {
    // continue
  }

  await sendDeviceAck({ commandId: cmd.id });

  if (cmd.type === 'force_update') {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(REMOTE_FORCE_UPDATE_EVENT));
    }
    return;
  }

  if (cmd.type === 'reset_cache') {
    // Safely clear remote/SW caches while PRESERVING user bookmarks, Tasbih, Qazo & Ramadan progress
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(BROADCASTS_CACHE_KEY);
      localStorage.removeItem('nq_dismissed_broadcasts');
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.update()));
      }
    } catch {
      // ignore
    }
    window.location.reload();
    return;
  }

  if (cmd.type === 'reload') {
    if ('serviceWorker' in navigator) {
      try {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.update()));
      } catch {
        // ignore
      }
    }
    window.location.reload();
  }
}

function handleGlobalWebReloadNonce(nonce: number): void {
  if (!nonce || Capacitor.isNativePlatform()) return;
  try {
    const raw = localStorage.getItem(WEB_RELOAD_NONCE_KEY);
    if (!raw) {
      // First boot records baseline nonce without reloading
      localStorage.setItem(WEB_RELOAD_NONCE_KEY, String(nonce));
      return;
    }
    const prev = Number(raw) || 0;
    if (nonce > prev) {
      localStorage.setItem(WEB_RELOAD_NONCE_KEY, String(nonce));
      if ('serviceWorker' in navigator) {
        void navigator.serviceWorker.getRegistrations().then((regs) =>
          Promise.all(regs.map((r) => r.update())).finally(() => window.location.reload())
        );
      } else {
        window.location.reload();
      }
    }
  } catch {
    // ignore
  }
}

/**
 * Unified zero-cache Live Sync (ETag 304 supported):
 * Immediately pulls Remote App Config, Targeted Live Broadcasts, and Per-Device Controls.
 */
export async function syncAppLive(params: {
  language: AppLanguage;
  city: string;
  force?: boolean;
}): Promise<void> {
  const now = Date.now();
  // Coalesce burst focus/visibility triggers within 1.5 seconds, never throttle for minutes!
  if (!params.force && now - lastSyncAtMs < 1500) return;
  if (syncInFlight) return syncInFlight;

  syncInFlight = (async () => {
    lastSyncAtMs = Date.now();
    const local = getLocalAppVersion();
    const platform = detectClientPlatform();
    const deviceId = getOrCreateDeviceId();
    const qs = new URLSearchParams({
      deviceId,
      lang: params.language,
      platform,
      city: params.city || '',
      vcode: String(local.versionCode),
    });

    for (const baseUrl of API_BASE_URLS) {
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), 5000);
      try {
        const headers: Record<string, string> = {};
        if (lastSyncEtag && !params.force) {
          headers['If-None-Match'] = lastSyncEtag;
        }
        const res = await fetch(`${baseUrl}/api/app-sync?${qs.toString()}`, {
          cache: 'no-store',
          headers,
          signal: controller.signal,
        });
        if (res.status === 304) {
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const etag = res.headers.get('ETag');
        if (etag) lastSyncEtag = etag;

        const data = (await res.json()) as {
          config?: unknown;
          broadcasts?: LiveBroadcast[];
          deviceDirective?: unknown;
        };

        if (data?.config) {
          const mergedCfg = mergeConfig(data.config);
          memoryConfig = mergedCfg;
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedCfg));
          } catch {
            // ignore
          }
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event(CONFIG_EVENT));
          }
          handleGlobalWebReloadNonce(mergedCfg.forceWebReloadNonce);
        }

        if (Array.isArray(data?.broadcasts)) {
          memoryBroadcasts = data.broadcasts;
          try {
            localStorage.setItem(BROADCASTS_CACHE_KEY, JSON.stringify(data.broadcasts));
          } catch {
            // ignore
          }
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event(BROADCASTS_EVENT));
          }
        }

        if (data?.deviceDirective) {
          const mergedDir = mergeDirective(data.deviceDirective);
          memoryDirective = mergedDir;
          try {
            localStorage.setItem(DIRECTIVE_STORAGE_KEY, JSON.stringify(mergedDir));
          } catch {
            // ignore
          }
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event(DIRECTIVE_EVENT));
          }
          if (mergedDir.pendingCommand) {
            void executePendingCommandOnce(mergedDir.pendingCommand);
          }
        }
        return;
      } catch {
        // try next mirror or keep cached state offline
      } finally {
        window.clearTimeout(timer);
      }
    }
  })().finally(() => {
    syncInFlight = null;
  });

  return syncInFlight;
}

export async function fetchRemoteAppConfig(force = true): Promise<RemoteAppConfig> {
  const lang = (localStorage.getItem('nq_language') as AppLanguage) || 'uz_lat';
  let city = '';
  try {
    const raw = localStorage.getItem('nq_city');
    if (raw) city = (JSON.parse(raw) as { cityName?: string })?.cityName || '';
  } catch {
    // ignore
  }
  await syncAppLive({ language: lang, city, force });
  return getCachedRemoteAppConfig();
}

// =========================================================================
// Client Crash / Error Monitor (#12)
// =========================================================================
const reportedSessionErrors = new Set<string>();

export function reportClientError(params: {
  scope: string;
  message: string;
  stack?: string;
}): void {
  const msg = String(params.message || '').trim().slice(0, 400);
  if (!msg || reportedSessionErrors.size >= 6) return;
  const sig = `${params.scope}|${msg.slice(0, 100)}`;
  if (reportedSessionErrors.has(sig)) return;
  reportedSessionErrors.add(sig);

  const local = getLocalAppVersion();
  let city = 'Unknown';
  let language = 'uz_lat';
  try {
    const rawCity = localStorage.getItem('nq_city');
    if (rawCity) city = (JSON.parse(rawCity) as { cityName?: string })?.cityName || 'Unknown';
    language = localStorage.getItem('nq_language') || 'uz_lat';
  } catch {
    // ignore
  }

  const body = JSON.stringify({
    scope: params.scope,
    message: msg,
    stack: String(params.stack || '').slice(0, 2000),
    versionName: local.versionName,
    versionCode: local.versionCode,
    platform: detectClientPlatform(),
    language,
    city,
    url: typeof window !== 'undefined' ? window.location.hash || window.location.pathname : '',
  });

  const baseUrl = API_BASE_URLS[0];
  try {
    void fetch(`${baseUrl}/api/client-error`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    });
  } catch {
    // ignore
  }
}

let errorMonitorInstalled = false;
export function installGlobalErrorMonitor(): void {
  if (errorMonitorInstalled || typeof window === 'undefined') return;
  errorMonitorInstalled = true;

  window.addEventListener('error', (ev) => {
    const msg = ev.message || (ev.error && ev.error.message) || '';
    if (!msg || /ResizeObserver loop/i.test(msg)) return;
    reportClientError({
      scope: 'window',
      message: msg,
      stack: ev.error?.stack || `${ev.filename || ''}:${ev.lineno || 0}`,
    });
  });

  window.addEventListener('unhandledrejection', (ev) => {
    const reason = ev.reason;
    const msg =
      typeof reason === 'string'
        ? reason
        : reason && typeof reason.message === 'string'
        ? reason.message
        : '';
    if (!msg || /AbortError|The user aborted|Failed to fetch/i.test(msg)) return;
    reportClientError({
      scope: 'promise',
      message: msg,
      stack: reason?.stack || '',
    });
  });
}

// =========================================================================
// Smart 5-Star Rating Funnel Helpers (#9)
// =========================================================================
const OPEN_COUNT_KEY = 'nq_app_open_count_v1';
const REVIEW_STATE_KEY = 'nq_review_prompt_state_v1';

export function recordAppOpenAndShouldPromptReview(cfg: RemoteAppConfig): boolean {
  if (!cfg.reviewPrompt?.enabled) return false;
  try {
    const count = (Number(localStorage.getItem(OPEN_COUNT_KEY) || 0) || 0) + 1;
    localStorage.setItem(OPEN_COUNT_KEY, String(count));
    const minOpens = Math.max(2, cfg.reviewPrompt.minOpens || 5);
    if (count < minOpens) return false;

    const raw = localStorage.getItem(REVIEW_STATE_KEY);
    if (raw) {
      const st = JSON.parse(raw) as { status?: string; snoozeUntil?: number };
      if (st.status === 'rated' || st.status === 'feedback') return false;
      if (st.snoozeUntil && Date.now() < st.snoozeUntil) return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function markReviewPromptAction(action: 'rated' | 'feedback' | 'later'): void {
  try {
    if (action === 'later') {
      localStorage.setItem(
        REVIEW_STATE_KEY,
        JSON.stringify({ status: 'snoozed', snoozeUntil: Date.now() + 14 * 86400_000 })
      );
    } else {
      localStorage.setItem(REVIEW_STATE_KEY, JSON.stringify({ status: action, at: Date.now() }));
    }
  } catch {
    // ignore
  }
}

// =========================================================================
// Feedback Submission
// =========================================================================
export type FeedbackCategory = 'bug' | 'suggestion' | 'prayer_time' | 'content' | 'other';

export async function submitUserFeedback(params: {
  category: FeedbackCategory;
  message: string;
  contact?: string;
  language: AppLanguage;
  city: string;
  region?: string;
  country?: string;
  prayerDiagnostics?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const local = getLocalAppVersion();
  const payload = JSON.stringify({
    category: params.category,
    message: params.message.trim(),
    contact: (params.contact || '').trim(),
    deviceId: getOrCreateDeviceId(),
    platform: detectClientPlatform(),
    versionName: local.versionName,
    versionCode: local.versionCode,
    language: params.language,
    city: params.city,
    region: params.region || '',
    country: params.country || '',
    prayerDiagnostics: (params.prayerDiagnostics || '').trim(),
  });

  for (const baseUrl of API_BASE_URLS) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 7000);
    try {
      const res = await fetch(`${baseUrl}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        signal: controller.signal,
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) return { ok: true };
      return { ok: false, error: data.error || `HTTP ${res.status}` };
    } catch {
      // fallback
    } finally {
      window.clearTimeout(timer);
    }
  }
  return { ok: false, error: 'network_error' };
}
