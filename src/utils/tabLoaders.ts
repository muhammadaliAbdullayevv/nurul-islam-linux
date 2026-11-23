import { Capacitor } from '@capacitor/core';

/**
 * Centralized dynamic chunk loaders for secondary lazy tabs & modals.
 * Core daily tabs (Home, Quran, Prayer, Qibla, Tasbih, Azkar, Names, Profile)
 * are statically bundled in App.tsx so they open in 0ms with zero spinner.
 * Secondary local tabs are eagerly preloaded right after first paint on native
 * Android APK & Linux Desktop (local disk, 0 network cost), and gently warmed
 * during idle time on public Web.
 */

export const tabLoaders = {
  zakat: () => import('../components/tabs/ZakatTab').then((m) => ({ default: m.ZakatTab })),
  qazo: () => import('../components/tabs/QazoTab').then((m) => ({ default: m.QazoTab })),
  ramadan: () => import('../components/tabs/RamadanTab').then((m) => ({ default: m.RamadanTab })),
  guide: () => import('../components/tabs/PrayerGuideTab').then((m) => ({ default: m.PrayerGuideTab })),
  masjids: () => import('../components/tabs/MasjidsTab').then((m) => ({ default: m.MasjidsTab })),
  ehson: () => import('../components/tabs/MasjidEhsonTab').then((m) => ({ default: m.MasjidEhsonTab })),
  juma: () => import('../components/tabs/JumaTab').then((m) => ({ default: m.JumaTab })),
  quiz: () => import('../components/tabs/QuizTab').then((m) => ({ default: m.QuizTab })),
  hifz: () => import('../components/tabs/HifzTab').then((m) => ({ default: m.HifzTab })),
  life: () => import('../components/tabs/LifeGuideTab').then((m) => ({ default: m.LifeGuideTab })),
  fiqh: () => import('../components/tabs/FiqhTab').then((m) => ({ default: m.FiqhTab })),
  tajweed: () => import('../components/tabs/TajweedTab').then((m) => ({ default: m.TajweedTab })),
  seerah: () => import('../components/tabs/SeerahTab').then((m) => ({ default: m.SeerahTab })),
  wisdom: () => import('../components/tabs/WisdomTab').then((m) => ({ default: m.WisdomTab })),
  library: () => import('../components/tabs/LibraryTab').then((m) => ({ default: m.LibraryTab })),
  radio: () => import('../components/tabs/RadioTab').then((m) => ({ default: m.RadioTab })),
  haramain: () => import('../components/tabs/HaramainLiveTab').then((m) => ({ default: m.HaramainLiveTab })),
} as const;

export const modalLoaders = {
  onboarding: () => import('../components/OnboardingModal').then((m) => ({ default: m.OnboardingModal })),
} as const;

export type LazyTabKey = keyof typeof tabLoaders;

const ALL_LAZY_TAB_KEYS: LazyTabKey[] = [
  'haramain',
  'library',
  'radio',
  'ramadan',
  'wisdom',
  'guide',
  'masjids',
  'juma',
  'zakat',
  'qazo',
  'ehson',
  'quiz',
  'hifz',
  'life',
  'fiqh',
  'tajweed',
  'seerah',
];

const prefetchedKeys = new Set<string>();

interface NetworkInformationLike {
  saveData?: boolean;
  effectiveType?: string;
}

export function isConstrainedNetwork(): boolean {
  if (typeof navigator === 'undefined') return false;
  const conn = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
  if (!conn) return false;
  if (conn.saveData) return true;
  if (conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g') return true;
  return false;
}

function isLocalNativeApp(): boolean {
  if (typeof window === 'undefined') return false;
  if (Capacitor.isNativePlatform()) return true;
  const isDesktop =
    new URLSearchParams(window.location.search).get('desktop') === '1' ||
    Boolean((window as Window & { __NQ_LINUX_DESKTOP__?: boolean }).__NQ_LINUX_DESKTOP__);
  return isDesktop;
}

function normalizeTabKey(rawTabId: string): LazyTabKey | null {
  const base = rawTabId.includes(':') ? rawTabId.split(':')[0] : rawTabId;
  if (base in tabLoaders) {
    return base as LazyTabKey;
  }
  return null;
}

/**
 * Prefetch a single secondary tab chunk silently (idempotent).
 * Safe to invoke on pointer/touch/hover before click completes.
 */
export function prefetchTab(rawTabId: string): void {
  const key = normalizeTabKey(rawTabId);
  if (!key || prefetchedKeys.has(key)) return;
  prefetchedKeys.add(key);
  tabLoaders[key]().catch(() => {
    prefetchedKeys.delete(key);
  });
}

/** No-op retained for callers now that CitySelectorModal is statically bundled (0ms open). */
export function prefetchCityModal(): void {
  // CitySelectorModal is statically imported in App.tsx for instant 0ms launch.
}

/**
 * Warms all secondary tab chunks in small non-blocking waves right after first paint.
 * On native Android APK & Linux Desktop (all assets are local on disk), every tab is
 * warmed within ~600ms so switching anywhere in the app is 100% instant with zero spinner.
 */
export function scheduleIdleTabPrefetch(): () => void {
  if (typeof window === 'undefined') return () => {};
  const localApp = isLocalNativeApp();
  if (!localApp && isConstrainedNetwork()) {
    return () => {};
  }

  let cancelled = false;
  const timers: number[] = [];

  const batchSize = localApp ? 4 : 3;
  const baseDelayMs = localApp ? 120 : 600;
  const stepDelayMs = localApp ? 140 : 550;

  for (let i = 0; i < ALL_LAZY_TAB_KEYS.length; i += batchSize) {
    const batch = ALL_LAZY_TAB_KEYS.slice(i, i + batchSize);
    const waveIdx = Math.floor(i / batchSize);
    const id = window.setTimeout(() => {
      if (cancelled) return;
      for (const key of batch) {
        prefetchTab(key);
      }
    }, baseDelayMs + waveIdx * stepDelayMs);
    timers.push(id);
  }

  return () => {
    cancelled = true;
    for (const id of timers) {
      window.clearTimeout(id);
    }
  };
}
