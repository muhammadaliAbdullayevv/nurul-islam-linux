import { Capacitor } from '@capacitor/core';
import { AppLanguage } from '../types';
import { API_BASE_URLS, getLocalAppVersion, isDesktopRpmUpdaterSupported } from './appUpdater';
import { getOrCreateDeviceId } from './deviceId';

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
  hijriDayOffset: number;
  ramadanMode: 'auto' | 'force_on' | 'force_off';
  features: {
    ehson: boolean;
    radio: boolean;
    library: boolean;
    namesBattle: boolean;
    masjids: boolean;
    broadcasts: boolean;
    zakat: boolean;
    ramadan: boolean;
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

export const DEFAULT_REMOTE_APP_CONFIG: RemoteAppConfig = {
  updatedAt: null,
  hijriDayOffset: 0,
  ramadanMode: 'auto',
  features: {
    ehson: true,
    radio: true,
    library: true,
    namesBattle: true,
    masjids: true,
    broadcasts: true,
    zakat: true,
    ramadan: true,
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
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.nurulquran.app',
    telegramUrl: 'https://t.me/nurulislam_uz',
    supportEmail: 'support@mabdullayev.dev',
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

const STORAGE_KEY = 'nq_remote_app_config_v1';
const LAST_FETCH_KEY = 'nq_remote_app_config_ts_v1';
const CONFIG_EVENT = 'nq:remote-app-config-updated';

let memoryConfig: RemoteAppConfig | null = null;

function mergeConfig(raw: unknown): RemoteAppConfig {
  if (!raw || typeof raw !== 'object') return DEFAULT_REMOTE_APP_CONFIG;
  const r = raw as Partial<RemoteAppConfig>;
  const hijriRaw = Number(r.hijriDayOffset);
  return {
    updatedAt: typeof r.updatedAt === 'string' ? r.updatedAt : null,
    hijriDayOffset: Number.isFinite(hijriRaw) ? Math.max(-2, Math.min(2, Math.round(hijriRaw))) : 0,
    ramadanMode: r.ramadanMode === 'force_on' || r.ramadanMode === 'force_off' ? r.ramadanMode : 'auto',
    features: {
      ...DEFAULT_REMOTE_APP_CONFIG.features,
      ...(r.features && typeof r.features === 'object' ? r.features : {}),
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

export function getCachedRemoteAppConfig(): RemoteAppConfig {
  if (memoryConfig) return memoryConfig;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      memoryConfig = mergeConfig(JSON.parse(raw));
      return memoryConfig;
    }
  } catch {
    // ignore storage errors
  }
  memoryConfig = DEFAULT_REMOTE_APP_CONFIG;
  return memoryConfig;
}

export function subscribeRemoteAppConfig(listener: (cfg: RemoteAppConfig) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => listener(getCachedRemoteAppConfig());
  window.addEventListener(CONFIG_EVENT, handler);
  return () => window.removeEventListener(CONFIG_EVENT, handler);
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

export async function fetchRemoteAppConfig(force = false): Promise<RemoteAppConfig> {
  if (!force) {
    try {
      const lastTs = Number(localStorage.getItem(LAST_FETCH_KEY) || 0);
      if (lastTs && Date.now() - lastTs < 5 * 60_000) {
        return getCachedRemoteAppConfig();
      }
    } catch {
      // ignore
    }
  }

  for (const baseUrl of API_BASE_URLS) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 5000);
    try {
      const res = await fetch(`${baseUrl}/api/app-config?t=${Date.now()}`, {
        cache: 'no-store',
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { config?: unknown };
      if (data?.config) {
        const merged = mergeConfig(data.config);
        memoryConfig = merged;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          localStorage.setItem(LAST_FETCH_KEY, String(Date.now()));
        } catch {
          // ignore
        }
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event(CONFIG_EVENT));
        }
        return merged;
      }
    } catch {
      // try next mirror or keep cached config
    } finally {
      window.clearTimeout(timer);
    }
  }
  return getCachedRemoteAppConfig();
}

export type FeedbackCategory = 'bug' | 'suggestion' | 'prayer_time' | 'content' | 'other';

export async function submitUserFeedback(params: {
  category: FeedbackCategory;
  message: string;
  contact?: string;
  language: AppLanguage;
  city: string;
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
