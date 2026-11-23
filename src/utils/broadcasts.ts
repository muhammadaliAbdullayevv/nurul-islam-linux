import { AppLanguage } from '../types';
import { UPDATE_SITE_URL } from './appUpdater';
import { detectClientPlatform } from './remoteAppConfig';

export interface LiveBroadcast {
  id: string;
  title: string;
  body: string;
  tone: 'emerald' | 'gold' | 'urgent';
  actionTab?: string;
  actionLabel?: string;
  actionUrl?: string;
  languages?: string[];
  platforms?: string[];
  startsAt?: string;
  expiresAt?: string;
  createdAt: string;
}

const CACHE_KEY = 'nq_broadcasts_cache';
const DISMISSED_KEY = 'nq_dismissed_broadcasts';

export function getDismissedBroadcastIds(): string[] {
  try {
    const raw = localStorage.getItem(DISMISSED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function dismissBroadcastId(id: string): void {
  try {
    const prev = getDismissedBroadcastIds();
    if (!prev.includes(id)) {
      const next = [...prev.slice(-40), id];
      localStorage.setItem(DISMISSED_KEY, JSON.stringify(next));
    }
  } catch {
    // ignore storage errors
  }
}

export function loadCachedBroadcasts(language?: AppLanguage): LiveBroadcast[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LiveBroadcast[];
    if (!Array.isArray(parsed)) return [];
    const now = Date.now();
    const platform = detectClientPlatform();
    return parsed.filter((item) => {
      if (!item || typeof item.id !== 'string' || !item.title || !item.body) return false;
      if (item.startsAt) {
        const st = Date.parse(item.startsAt);
        if (Number.isFinite(st) && st > now) return false;
      }
      if (item.expiresAt) {
        const exp = Date.parse(item.expiresAt);
        if (Number.isFinite(exp) && exp < now) return false;
      }
      if (language && Array.isArray(item.languages) && item.languages.length > 0 && !item.languages.includes(language)) {
        return false;
      }
      if (Array.isArray(item.platforms) && item.platforms.length > 0 && !item.platforms.includes(platform)) {
        return false;
      }
      return true;
    });
  } catch {
    return [];
  }
}

export async function fetchActiveBroadcasts(language?: AppLanguage): Promise<LiveBroadcast[]> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 5000);
  const platform = detectClientPlatform();
  const params = new URLSearchParams({ t: String(Date.now()), platform });
  if (language) params.set('lang', language);
  try {
    const res = await fetch(`${UPDATE_SITE_URL}/api/broadcasts?${params.toString()}`, {
      cache: 'no-store',
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { broadcasts?: LiveBroadcast[] };
    const list = Array.isArray(data?.broadcasts) ? data.broadcasts : [];
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
    return list;
  } catch {
    return loadCachedBroadcasts(language);
  } finally {
    window.clearTimeout(timer);
  }
}
