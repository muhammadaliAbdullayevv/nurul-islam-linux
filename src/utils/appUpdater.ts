import { AppLanguage } from '../types';

export const UPDATE_SITE_URL = 'https://nurulislam.mabdullayev.dev';
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.nurulquran.app';
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

function getUpdaterBridge(): UpdaterJsBridge | null {
  const win = window as Window & { NqUpdaterBridge?: UpdaterJsBridge };
  return win.NqUpdaterBridge || null;
}

export function isNativeUpdaterSupported(): boolean {
  return Boolean(getUpdaterBridge());
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
  return { versionCode: 75, versionName: '1.8.56' };
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

export function startInAppUpdate(
  apkUrl: string,
  onProgress: (pct: number, status: UpdateDownloadStatus) => void
): void {
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
