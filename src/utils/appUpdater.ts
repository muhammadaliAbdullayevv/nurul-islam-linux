import { AppLanguage } from '../types';

export const UPDATE_SITE_URL = 'https://nurulislam.mabdullayev.dev';
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=app.nurul.islam';
export const DEFAULT_LINUX_RPM_URL = `${UPDATE_SITE_URL}/linux/nurul-islam-latest.rpm`;
export const UPDATE_MANIFEST_URL = `${UPDATE_SITE_URL}/version.json`;
export const API_BASE_URLS = [UPDATE_SITE_URL];

export interface LocalAppVersion {
  versionCode: number;
  versionName: string;
}

export interface RemoteAppRelease {
  versionCode: number;
  versionName: string;
  apkUrl: string;
  rpmUrl?: string;
  forceUpdate?: boolean;
  minSupportedVersionCode?: number;
  notes?: Partial<Record<AppLanguage, string>> | string;
}

export type UpdateDownloadStatus =
  | 'idle'
  | 'checking'
  | 'available'
  | 'up_to_date'
  | 'downloading'
  | 'needs_permission'
  | 'installing'
  | 'error';

interface UpdaterJsBridge {
  getAppVersionJson: () => string;
  isDirectOtaEnabled?: () => boolean;
  canRequestPackageInstalls: () => boolean;
  openInstallPermissionSettings: () => void;
  downloadAndInstall: (apkUrl: string) => void;
}

interface DesktopWindowBridge extends Window {
  NqUpdaterBridge?: UpdaterJsBridge;
  __NQ_LINUX_DESKTOP__?: boolean;
  __NQ_DESKTOP_RPM_UPDATER__?: boolean;
  __NQ_DESKTOP_VERSION__?: Partial<LocalAppVersion>;
}

function getUpdaterBridge(): UpdaterJsBridge | null {
  const win = window as DesktopWindowBridge;
  return win.NqUpdaterBridge || null;
}

export function isDesktopRpmUpdaterSupported(): boolean {
  if (typeof window === 'undefined') return false;
  const win = window as DesktopWindowBridge;
  if (win.__NQ_DESKTOP_RPM_UPDATER__ === true) return true;
  if (win.__NQ_DESKTOP_RPM_UPDATER__ === false) return false;
  // Fallback detection if opened via ?desktop=1 on localhost wrapper
  return (
    new URLSearchParams(window.location.search).get('desktop') === '1' &&
    window.location.hostname === '127.0.0.1'
  );
}

export function isNativeUpdaterSupported(): boolean {
  return Boolean(getUpdaterBridge()) || isDesktopRpmUpdaterSupported();
}

export function canRequestNativeInstallPermission(): boolean {
  const bridge = getUpdaterBridge();
  if (!bridge) return true;
  try {
    return Boolean(bridge.canRequestPackageInstalls());
  } catch {
    return false;
  }
}

export function getLocalAppVersion(): LocalAppVersion {
  const bridge = getUpdaterBridge();
  if (bridge) {
    try {
      const parsed = JSON.parse(bridge.getAppVersionJson()) as Partial<LocalAppVersion>;
      if (typeof parsed.versionCode === 'number' && typeof parsed.versionName === 'string') {
        return { versionCode: parsed.versionCode, versionName: parsed.versionName };
      }
    } catch {
      // Fallback below
    }
  }
  if (typeof window !== 'undefined') {
    const dv = (window as DesktopWindowBridge).__NQ_DESKTOP_VERSION__;
    if (dv && typeof dv.versionCode === 'number' && typeof dv.versionName === 'string') {
      return { versionCode: dv.versionCode, versionName: dv.versionName };
    }
  }
  return { versionCode: 98, versionName: '1.8.79' };
}

export function getReleaseNoteText(release: RemoteAppRelease, language: AppLanguage): string {
  if (!release.notes) return '';
  if (typeof release.notes === 'string') return release.notes;
  return (
    release.notes[language] ||
    release.notes.uz_lat ||
    release.notes.en ||
    release.notes.ru ||
    ''
  );
}

export async function checkForAppUpdate(): Promise<{
  hasUpdate: boolean;
  local: LocalAppVersion;
  remote: RemoteAppRelease | null;
}> {
  const local = getLocalAppVersion();
  let lastError: unknown = null;

  for (const baseUrl of API_BASE_URLS) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 6000);
    try {
      const res = await fetch(`${baseUrl}/version.json?t=${Date.now()}`, {
        cache: 'no-store',
        signal: controller.signal,
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = (await res.json()) as Partial<RemoteAppRelease>;
      if (
        typeof data.versionCode !== 'number' ||
        typeof data.versionName !== 'string' ||
        typeof data.apkUrl !== 'string'
      ) {
        throw new Error('Invalid release manifest');
      }

      const minSupported =
        typeof data.minSupportedVersionCode === 'number' && Number.isFinite(data.minSupportedVersionCode)
          ? data.minSupportedVersionCode
          : undefined;
      const effectiveForce =
        Boolean(data.forceUpdate) ||
        (minSupported !== undefined && local.versionCode < minSupported);

      const remote: RemoteAppRelease = {
        versionCode: data.versionCode,
        versionName: data.versionName,
        apkUrl: data.apkUrl,
        rpmUrl:
          typeof data.rpmUrl === 'string' && data.rpmUrl.startsWith('https://')
            ? data.rpmUrl
            : DEFAULT_LINUX_RPM_URL,
        forceUpdate: effectiveForce,
        minSupportedVersionCode: minSupported,
        notes: data.notes,
      };

      return {
        hasUpdate: remote.versionCode > local.versionCode,
        local,
        remote,
      };
    } catch (err) {
      lastError = err;
    } finally {
      window.clearTimeout(timer);
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Update check failed');
}

let desktopPollTimer: number | null = null;

function startDesktopRpmUpdate(
  rpmUrl: string,
  onProgress: (pct: number, status: UpdateDownloadStatus) => void
): void {
  if (desktopPollTimer !== null) {
    window.clearInterval(desktopPollTimer);
    desktopPollTimer = null;
  }

  const targetUrl = rpmUrl || DEFAULT_LINUX_RPM_URL;
  onProgress(1, 'downloading');

  void fetch('/__desktop_update/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rpmUrl: targetUrl }),
  })
    .then(async (res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      desktopPollTimer = window.setInterval(async () => {
        try {
          const stRes = await fetch('/__desktop_update/status', { cache: 'no-store' });
          if (!stRes.ok) return;
          const st = (await stRes.json()) as { status?: string; pct?: number };
          const pct = Math.max(0, Math.min(100, Number(st.pct) || 0));
          const raw = st.status || 'downloading';
          if (raw === 'downloading') {
            onProgress(pct, 'downloading');
          } else if (raw === 'installing' || raw === 'restarting') {
            onProgress(raw === 'restarting' ? 100 : Math.max(96, pct), 'installing');
            if (raw === 'restarting' && desktopPollTimer !== null) {
              window.clearInterval(desktopPollTimer);
              desktopPollTimer = null;
            }
          } else if (raw === 'needs_permission') {
            if (desktopPollTimer !== null) {
              window.clearInterval(desktopPollTimer);
              desktopPollTimer = null;
            }
            onProgress(0, 'needs_permission');
          } else if (raw === 'error') {
            if (desktopPollTimer !== null) {
              window.clearInterval(desktopPollTimer);
              desktopPollTimer = null;
            }
            onProgress(0, 'error');
          }
        } catch {
          // Local server closes briefly while relaunching updated binary
        }
      }, 260);
    })
    .catch(() => {
      onProgress(0, 'error');
    });
}

export function startInAppUpdate(
  apkUrl: string,
  onProgress: (pct: number, status: UpdateDownloadStatus) => void,
  rpmUrl?: string
): void {
  if (isDesktopRpmUpdaterSupported()) {
    startDesktopRpmUpdate(rpmUrl || DEFAULT_LINUX_RPM_URL, onProgress);
    return;
  }

  const bridge = getUpdaterBridge();
  if (!bridge) {
    window.open(apkUrl, '_blank', 'noopener,noreferrer');
    onProgress(100, 'installing');
    return;
  }

  if (typeof bridge.isDirectOtaEnabled === 'function' && !bridge.isDirectOtaEnabled()) {
    window.open(PLAY_STORE_URL, '_blank', 'noopener,noreferrer');
    onProgress(100, 'installing');
    return;
  }

  const win = window as Window & {
    __nqOnUpdateProgress?: (pct: number, status: string) => void;
  };

  win.__nqOnUpdateProgress = (pct: number, status: string) => {
    const mapped: UpdateDownloadStatus =
      status === 'downloading' ||
      status === 'needs_permission' ||
      status === 'installing' ||
      status === 'error'
        ? status
        : 'downloading';
    onProgress(pct, mapped);
  };

  bridge.downloadAndInstall(apkUrl);
}
