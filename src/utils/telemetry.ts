import { Capacitor } from '@capacitor/core';
import { AppLanguage } from '../types';
import { getOrCreateDeviceId } from './deviceId';
import { API_BASE_URLS, getLocalAppVersion } from './appUpdater';

const LAST_PING_KEY = 'nq_telemetry_last_sig_v1';
const PAGE2_LEARNED_KEY = 'nq_home_page2_learned_v1';
const PING_TTL_MS = 3 * 3600_000;

export const HOME_PAGE2_LEARNED_EVENT = 'nq:home-page2-learned';

export function hasLearnedHomePage2(): boolean {
  try {
    const raw = localStorage.getItem(PAGE2_LEARNED_KEY);
    if (!raw) return false;
    if (raw === '1' || raw === 'true') return true;
    const parsed = JSON.parse(raw) as { learned?: boolean };
    return Boolean(parsed.learned);
  } catch {
    return false;
  }
}

/**
 * Records that the user genuinely opened the second Home features page.
 * Returns true if this was the user's very first time discovering Page 2.
 */
export function markHomePage2Opened(): boolean {
  const alreadyLearned = hasLearnedHomePage2();
  try {
    const raw = localStorage.getItem(PAGE2_LEARNED_KEY);
    let prevCount = 0;
    let firstOpenedAt = new Date().toISOString();
    if (raw && raw.startsWith('{')) {
      const parsed = JSON.parse(raw) as { openCount?: number; firstOpenedAt?: string };
      prevCount = typeof parsed.openCount === 'number' ? parsed.openCount : 0;
      if (parsed.firstOpenedAt) firstOpenedAt = parsed.firstOpenedAt;
    }
    localStorage.setItem(
      PAGE2_LEARNED_KEY,
      JSON.stringify({
        learned: true,
        openCount: prevCount + 1,
        firstOpenedAt,
        lastOpenedAt: new Date().toISOString(),
      })
    );
  } catch {
    // ignore storage error
  }
  if (!alreadyLearned && typeof window !== 'undefined') {
    window.dispatchEvent(new Event(HOME_PAGE2_LEARNED_EVENT));
  }
  return !alreadyLearned;
}

/**
 * Sends a privacy-safe anonymous device heartbeat so the Owner Control Center
 * can track total installs, active users, versions, languages, regions, and Page 2 discovery.
 */
export async function sendAnonymousHeartbeat(params: {
  language: AppLanguage;
  city: string;
  theme: 'day' | 'night';
  openedPage2?: boolean;
}): Promise<void> {
  const local = getLocalAppVersion();
  const platform = Capacitor.isNativePlatform() ? 'android' : 'web';
  const openedPage2 = params.openedPage2 ?? hasLearnedHomePage2();
  const sig = `${local.versionCode}|${params.language}|${params.city}|${params.theme}|p2:${openedPage2 ? 1 : 0}`;

  try {
    const raw = localStorage.getItem(LAST_PING_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { sig?: string; ts?: number };
      if (parsed.sig === sig && typeof parsed.ts === 'number' && Date.now() - parsed.ts < PING_TTL_MS) {
        return;
      }
    }
  } catch {
    // ignore
  }

  const payload = JSON.stringify({
    deviceId: getOrCreateDeviceId(),
    platform,
    versionCode: local.versionCode,
    versionName: local.versionName,
    language: params.language,
    city: params.city,
    theme: params.theme,
    openedPage2,
  });

  for (const baseUrl of API_BASE_URLS) {
    try {
      const res = await fetch(`${baseUrl}/api/telemetry/ping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
      });
      if (res.ok) {
        try {
          localStorage.setItem(LAST_PING_KEY, JSON.stringify({ sig, ts: Date.now() }));
        } catch {
          // ignore
        }
        return;
      }
    } catch {
      // try next mirror
    }
  }
}
