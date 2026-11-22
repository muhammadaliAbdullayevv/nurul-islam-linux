/**
 * Centralized dynamic chunk loaders for all lazy tabs & modals.
 * Sharing the exact loader functions between React.lazy() and hover/idle
 * prefetching guarantees zero-spinner instant navigation without duplicate chunks.
 */

export const tabLoaders = {
  quran: () => import('../components/tabs/QuranTab').then((m) => ({ default: m.QuranTab })),
  prayer: () => import('../components/tabs/PrayerTab').then((m) => ({ default: m.PrayerTab })),
  qibla: () => import('../components/tabs/QiblaTab').then((m) => ({ default: m.QiblaTab })),
  tasbih: () => import('../components/tabs/TasbihTab').then((m) => ({ default: m.TasbihTab })),
  azkar: () => import('../components/tabs/AzkarTab').then((m) => ({ default: m.AzkarTab })),
  names: () => import('../components/tabs/NamesTab').then((m) => ({ default: m.NamesTab })),
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
  profile: () => import('../components/tabs/ProfileTab').then((m) => ({ default: m.ProfileTab })),
} as const;

export const modalLoaders = {
  citySelector: () => import('../components/CitySelectorModal').then((m) => ({ default: m.CitySelectorModal })),
  onboarding: () => import('../components/OnboardingModal').then((m) => ({ default: m.OnboardingModal })),
  miniPlayer: () => import('../components/QuranMiniPlayer').then((m) => ({ default: m.QuranMiniPlayer })),
} as const;

export type LazyTabKey = keyof typeof tabLoaders;

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

function normalizeTabKey(rawTabId: string): LazyTabKey | null {
  const base = rawTabId.includes(':') ? rawTabId.split(':')[0] : rawTabId;
  if (base in tabLoaders) {
    return base as LazyTabKey;
  }
  return null;
}

/**
 * Prefetch a single tab chunk silently (idempotent).
 * Safe to invoke on pointer/touch/hover before click completes.
 */
export function prefetchTab(rawTabId: string): void {
  const key = normalizeTabKey(rawTabId);
  if (!key || prefetchedKeys.has(key)) return;
  prefetchedKeys.add(key);
  tabLoaders[key]().catch(() => {
    // Allow retry later if offline/transient network hiccup
    prefetchedKeys.delete(key);
  });
}

export function prefetchCityModal(): void {
  if (prefetchedKeys.has('modal:city')) return;
  prefetchedKeys.add('modal:city');
  modalLoaders.citySelector().catch(() => {
    prefetchedKeys.delete('modal:city');
  });
}

/**
 * Warms the top most-visited tabs during browser idle time in gentle staggered waves
 * so opening Quran, Prayer, Tasbih, Azkar, or Profile feels instant (0ms spinner).
 * Returns a cleanup callback to cancel pending idle handles on unmount.
 */
export function scheduleIdleTabPrefetch(): () => void {
  if (typeof window === 'undefined' || isConstrainedNetwork()) {
    return () => {};
  }

  type IdleWin = Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };
  const win = window as IdleWin;
  let cancelled = false;
  let idleId1: number | null = null;
  let idleId2: number | null = null;
  let timer1: number | null = null;
  let timer2: number | null = null;

  const runWave1 = () => {
    if (cancelled) return;
    prefetchTab('quran');
    prefetchTab('prayer');

    const scheduleWave2 = () => {
      if (cancelled) return;
      if (win.requestIdleCallback) {
        idleId2 = win.requestIdleCallback(
          () => {
            if (cancelled) return;
            prefetchTab('tasbih');
            prefetchTab('azkar');
            prefetchTab('profile');
          },
          { timeout: 3000 }
        );
      } else {
        prefetchTab('tasbih');
        prefetchTab('azkar');
        prefetchTab('profile');
      }
    };
    timer2 = window.setTimeout(scheduleWave2, 900);
  };

  if (win.requestIdleCallback) {
    idleId1 = win.requestIdleCallback(runWave1, { timeout: 2200 });
  } else {
    timer1 = window.setTimeout(runWave1, 1200);
  }

  return () => {
    cancelled = true;
    if (idleId1 !== null && win.cancelIdleCallback) win.cancelIdleCallback(idleId1);
    if (idleId2 !== null && win.cancelIdleCallback) win.cancelIdleCallback(idleId2);
    if (timer1 !== null) window.clearTimeout(timer1);
    if (timer2 !== null) window.clearTimeout(timer2);
  };
}
