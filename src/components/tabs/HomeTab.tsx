import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import {
  MapPin,
  Bell,
  BellOff,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Megaphone,
  Moon,
  Radio,
  Sun,
  Sunrise,
  Sunset,
  CloudSun,
  X,
  Check,
  RotateCcw,
  GripHorizontal,
  ArrowLeftRight,
} from 'lucide-react';
import { LivePrayerRemainingText, useMinuteDate } from '../LivePrayerClock';
import {
  LiveBroadcast,
  dismissBroadcastId,
  fetchActiveBroadcasts,
  getDismissedBroadcastIds,
  loadCachedBroadcasts,
} from '../../utils/broadcasts';
import { openExternalUrl } from '../../utils/nativePrayerBridge';
import { hasLearnedHomePage2, markHomePage2Opened } from '../../utils/telemetry';
import {
  AllahNamesIcon,
  DuaHandsIcon,
  FortyFardIcon,
  HadithBookIcon,
  JumaMinbarSunIcon,
  MasjidDomeIcon,
  MasjidEhsonIcon,
  MushafIcon,
  NiyatHeartIcon,
  PrayerTimeIcon,
  QazoTrackerIcon,
  QiblaKaabaIcon,
  RamadanLanternIcon,
  RubElHizbIcon,
  WuduNamozGuideIcon,
  ZakatHandsIcon,
  ZikrBeadsIcon,
} from '../icons/IslamicFeatureIcons';
import { Coordinates, PrayerTimes, TranslationId } from '../../types';
import { getNextPrayer, getHijriDate, getCityCurrentDate, getLocalizedCityLabel } from '../../utils/prayerTimes';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage, formatGregorianDate } from '../../contexts/LanguageContext';
import { prefetchCityModal, prefetchTab } from '../../utils/tabLoaders';

interface HomeTabProps {
  prayerTimes: PrayerTimes;
  currentCity: Coordinates;
  onOpenSurah?: (surahNumber: number, ayahNumber?: number) => void;
  onNavigateTab: (tabId: string) => void;
  selectedTranslation: TranslationId;
  onOpenCitySelector: () => void;
  isOnboardingOpen?: boolean;
  alertsEnabled?: boolean;
  onToggleAlerts?: () => void;
}

interface HomeFeatureDef {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  imageSrc?: string;
  badge: string;
  highlight?: boolean;
}

const HOME_ORDER_STORAGE_KEY = 'nq_home_feature_order_v1';
const TILES_PER_PAGE = 12;

const DEFAULT_FEATURE_ORDER: string[] = [
  // Page 1 (12 core tiles — Quran, Live Radio, Classical Library front-and-center!)
  'quran',
  'radio',
  'library',
  'ramadan',
  'prayer',
  'qibla',
  'wisdom',
  'guide',
  'masjids',
  'juma',
  'names',
  'zakat',
  // Page 2 (12 tiles)
  'qazo',
  'azkar:duas',
  'azkar:zikr',
  'azkar:hadith',
  'azkar:ayats',
  'azkar:farz',
  'azkar:niyat',
  'ehson',
  'quiz',
  'hifz',
  'life',
  'fiqh',
  // Page 3
  'tajweed',
  'seerah',
];

function loadSavedFeatureOrder(): string[] {
  try {
    const raw = localStorage.getItem(HOME_ORDER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const validSet = new Set(DEFAULT_FEATURE_ORDER);
        // Seamlessly migrate legacy 'tasbih' slot to 'wisdom' in-place (Tasbih is in bottom nav bar)
        const migrated = parsed.map((id) => (id === 'tasbih' ? 'wisdom' : id));
        const seen = new Set<string>();
        const cleaned = migrated.filter((id): id is string => {
          if (typeof id !== 'string' || !validSet.has(id) || seen.has(id)) return false;
          seen.add(id);
          return true;
        });
        const missing = DEFAULT_FEATURE_ORDER.filter((id) => !cleaned.includes(id));
        // Place newly launched flagship tiles ('radio', 'library') right after 'quran' for existing users
        const flagshipNew = missing.filter((id) => id === 'radio' || id === 'library');
        const otherMissing = missing.filter((id) => id !== 'radio' && id !== 'library');
        if (flagshipNew.length > 0) {
          const qIdx = cleaned.indexOf('quran');
          const insertAt = qIdx >= 0 ? qIdx + 1 : 0;
          const next = [...cleaned];
          next.splice(insertAt, 0, ...flagshipNew);
          return [...next, ...otherMissing];
        }
        return [...cleaned, ...missing];
      }
    }
  } catch {
    // ignore
  }
  return [...DEFAULT_FEATURE_ORDER];
}

let persistedHomePage = 0;

export const HomeTab: React.FC<HomeTabProps> = ({
  prayerTimes,
  currentCity,
  onNavigateTab,
  onOpenCitySelector,
  isOnboardingOpen = false,
  alertsEnabled = false,
  onToggleAlerts,
}) => {
  const { isDay } = useTheme();
  const { language, t } = useLanguage();
  const currentTime = useMinuteDate();
  const [alertToast, setAlertToast] = useState<'on' | 'off' | null>(null);
  const alertToastTimerRef = useRef<number | null>(null);
  const prevAlertsEnabledRef = useRef<boolean>(alertsEnabled);

  useEffect(() => {
    if (prevAlertsEnabledRef.current !== alertsEnabled) {
      prevAlertsEnabledRef.current = alertsEnabled;
      setAlertToast(alertsEnabled ? 'on' : 'off');
      if (alertToastTimerRef.current !== null) {
        window.clearTimeout(alertToastTimerRef.current);
      }
      alertToastTimerRef.current = window.setTimeout(() => {
        setAlertToast(null);
      }, 2200);
    }
  }, [alertsEnabled]);

  useEffect(() => {
    return () => {
      if (alertToastTimerRef.current !== null) {
        window.clearTimeout(alertToastTimerRef.current);
      }
    };
  }, []);

  const alertCopy = useMemo(() => {
    if (language === 'uz_cyr') {
      return {
        onToast: 'Намоз билдиришномаси ёқилди',
        offToast: 'Намоз билдиришномаси ўчирилди',
        ariaOn: 'Намоз билдиришномасини ўчириш',
        ariaOff: 'Намоз билдиришномасини ёқиш',
      };
    }
    if (language === 'ru') {
      return {
        onToast: 'Уведомления о намазе включены',
        offToast: 'Уведомления о намазе выключены',
        ariaOn: 'Выключить уведомления о намазе',
        ariaOff: 'Включить уведомления о намазе',
      };
    }
    if (language === 'en') {
      return {
        onToast: 'Prayer notifications enabled',
        offToast: 'Prayer notifications muted',
        ariaOn: 'Disable prayer notifications',
        ariaOff: 'Enable prayer notifications',
      };
    }
    return {
      onToast: 'Namoz bildirishnomasi yoqildi',
      offToast: "Namoz bildirishnomasi o'chirildi",
      ariaOn: "Namoz bildirishnomasini o'chirish",
      ariaOff: 'Namoz bildirishnomasini yoqish',
    };
  }, [language]);
  const [homePage, setHomePage] = useState<number>(() => persistedHomePage);
  const [hasLearnedPage2, setHasLearnedPage2] = useState<boolean>(() => hasLearnedHomePage2());
  const [peekTrackPct, setPeekTrackPct] = useState<number>(0);
  const [showSwipeOverlay, setShowSwipeOverlay] = useState<boolean>(false);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const peekTimersRef = useRef<number[]>([]);
  const [broadcasts, setBroadcasts] = useState<LiveBroadcast[]>(() => loadCachedBroadcasts());
  const [dismissedIds, setDismissedIds] = useState<string[]>(() => getDismissedBroadcastIds());

  // Reorderable feature state (Long-press & move anywhere across Page 1 and Page 2)
  const [featureOrder, setFeatureOrder] = useState<string[]>(() => loadSavedFeatureOrder());
  const [isReorderMode, setIsReorderMode] = useState<boolean>(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragPointer, setDragPointer] = useState<{ x: number; y: number } | null>(null);

  const longPressTimerRef = useRef<number | null>(null);
  const pressOriginRef = useRef<{ x: number; y: number; id: string } | null>(null);
  const suppressNextClickRef = useRef<boolean>(false);
  const lastEdgeFlipAtRef = useRef<number>(0);
  const draggingIdRef = useRef<string | null>(null);
  const homePageRef = useRef<number>(homePage);

  useEffect(() => {
    homePageRef.current = homePage;
  }, [homePage]);

  useEffect(() => {
    draggingIdRef.current = draggingId;
  }, [draggingId]);

  const saveOrder = useCallback((nextOrder: string[]) => {
    setFeatureOrder(nextOrder);
    try {
      localStorage.setItem(HOME_ORDER_STORAGE_KEY, JSON.stringify(nextOrder));
    } catch {
      // ignore
    }
  }, []);

  // Intercept Android back button when in Reorder Mode
  useEffect(() => {
    if (!isReorderMode) return;
    const onBack = (e: Event) => {
      e.preventDefault();
      setIsReorderMode(false);
      setDraggingId(null);
      setDragPointer(null);
    };
    window.addEventListener('nq:android-back', onBack);
    return () => window.removeEventListener('nq:android-back', onBack);
  }, [isReorderMode]);

  useEffect(() => {
    let alive = true;
    fetchActiveBroadcasts().then((list) => {
      if (alive) setBroadcasts(list);
    });
    return () => {
      alive = false;
    };
  }, []);

  const activeBroadcast = useMemo(
    () => broadcasts.find((b) => !dismissedIds.includes(b.id)) || null,
    [broadcasts, dismissedIds]
  );

  const handleDismissBroadcast = (id: string) => {
    dismissBroadcastId(id);
    setDismissedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleBroadcastAction = (b: LiveBroadcast) => {
    if (b.actionTab && b.actionTab.trim()) {
      onNavigateTab(b.actionTab.trim());
      return;
    }
    if (b.actionUrl && /^https?:\/\//i.test(b.actionUrl.trim())) {
      openExternalUrl(b.actionUrl.trim());
    }
  };

  const broadcastDefaultCta =
    language === 'ru'
      ? 'Открыть'
      : language === 'en'
      ? 'Open'
      : language === 'uz_cyr'
      ? 'Очиш'
      : 'Ochish';

  const { nextPrayer, hijriStr, gregorianStr, isFriday } = useMemo(() => {
    const next = getNextPrayer(prayerTimes, currentTime, currentCity.timezone);
    const cityNow = getCityCurrentDate(currentTime, currentCity.timezone);
    return {
      nextPrayer: next,
      hijriStr: getHijriDate(cityNow, language),
      gregorianStr: formatGregorianDate(cityNow, language),
      isFriday: cityNow.getDay() === 5,
    };
  }, [prayerTimes, currentTime, currentCity.timezone, language]);

  const fridayPillText =
    language === 'ru' ? 'Джума' : language === 'en' ? 'Juma' : 'Juma';
  const fridayBadgeText =
    language === 'ru'
      ? 'Сегодня'
      : language === 'en'
      ? 'Today'
      : language === 'uz_cyr'
      ? 'Бугун'
      : 'Bugun';

  const regionOnlyLabel = getLocalizedCityLabel(
    currentCity.cityName,
    currentCity.countryName,
    language,
    currentCity.region
  ).city;

  const prayerLabels = t.prayers as Record<string, string>;
  const nextPrayerLabel = prayerLabels[nextPrayer.nextId] || nextPrayer.name;
  const activePrayerLabel = prayerLabels[nextPrayer.activeId] || nextPrayer.activeName;

  const fivePrayers = [
    { id: 'fajr' as const, name: t.prayers.fajr, time: prayerTimes.fajr, icon: Sunrise },
    { id: 'dhuhr' as const, name: t.prayers.dhuhr, time: prayerTimes.dhuhr, icon: Sun },
    { id: 'asr' as const, name: t.prayers.asr, time: prayerTimes.asr, icon: CloudSun },
    { id: 'maghrib' as const, name: t.prayers.maghrib, time: prayerTimes.maghrib, icon: Sunset },
    { id: 'isha' as const, name: t.prayers.isha, time: prayerTimes.isha, icon: Moon },
  ];

  const allFeaturesMap = useMemo(() => {
    const list: HomeFeatureDef[] = [
      { id: 'quran', label: t.features.quran, icon: MushafIcon, imageSrc: '/icons/home/quran.webp', badge: '114' },
      { id: 'radio', label: t.features.radio, icon: Radio, imageSrc: '/icons/home/radio.webp', badge: 'LIVE' },
      { id: 'library', label: t.features.library, icon: HadithBookIcon, imageSrc: '/icons/home/library.webp', badge: '13' },
      { id: 'ramadan', label: t.features.ramadan, icon: RamadanLanternIcon, imageSrc: '/icons/home/ramadan.webp', badge: '' },
      { id: 'prayer', label: t.features.prayer, icon: PrayerTimeIcon, imageSrc: '/icons/home/prayer.webp', badge: '' },
      { id: 'qibla', label: t.features.qibla, icon: QiblaKaabaIcon, imageSrc: '/icons/home/qibla.webp', badge: '' },
      { id: 'wisdom', label: t.features.wisdom, icon: HadithBookIcon, imageSrc: '/icons/home/wisdom.webp', badge: '9' },
      { id: 'guide', label: t.features.guide, icon: WuduNamozGuideIcon, imageSrc: '/icons/home/guide.webp', badge: '' },
      { id: 'masjids', label: t.features.masjids, icon: MasjidDomeIcon, imageSrc: '/icons/home/masjids.webp', badge: '' },
      {
        id: 'juma',
        label: t.features.juma,
        icon: JumaMinbarSunIcon,
        imageSrc: '/icons/home/juma.webp',
        badge: isFriday ? fridayBadgeText : '',
        highlight: isFriday,
      },
      { id: 'names', label: t.features.names, icon: AllahNamesIcon, imageSrc: '/icons/home/names.webp', badge: '99' },
      { id: 'zakat', label: t.features.zakat, icon: ZakatHandsIcon, imageSrc: '/icons/home/zakat.webp', badge: '' },
      { id: 'qazo', label: t.features.qazo, icon: QazoTrackerIcon, imageSrc: '/icons/home/qazo.webp', badge: '' },
      {
        id: 'azkar:duas',
        label: language === 'ru' ? 'Дуа' : language === 'en' ? 'Duas' : language === 'uz_cyr' ? 'Дуолар' : 'Duolar',
        icon: DuaHandsIcon,
        imageSrc: '/icons/home/duas.webp',
        badge: '',
      },
      {
        id: 'azkar:zikr',
        label: language === 'ru' ? 'Зикры' : language === 'en' ? 'Azkar' : language === 'uz_cyr' ? 'Зикрлар' : 'Zikrlar',
        icon: ZikrBeadsIcon,
        imageSrc: '/icons/home/zikr.webp',
        badge: '303',
      },
      {
        id: 'azkar:hadith',
        label: language === 'ru' ? 'Хадисы' : language === 'en' ? 'Hadiths' : language === 'uz_cyr' ? 'Ҳадислар' : 'Hadislar',
        icon: HadithBookIcon,
        imageSrc: '/icons/home/hadith.webp',
        badge: '8.2K',
      },
      {
        id: 'azkar:ayats',
        label: language === 'ru' ? 'Аяты' : language === 'en' ? 'Selected Ayahs' : language === 'uz_cyr' ? 'Оятлар' : 'Oyatlar',
        icon: RubElHizbIcon,
        imageSrc: '/icons/home/ayats.webp',
        badge: '45',
      },
      {
        id: 'azkar:farz',
        label: language === 'ru' ? '40 Фардов' : language === 'en' ? '40 Fards' : language === 'uz_cyr' ? '40 Фарз' : '40 Farz',
        icon: FortyFardIcon,
        imageSrc: '/icons/home/farz.webp',
        badge: '40',
      },
      {
        id: 'azkar:niyat',
        label: language === 'ru' ? 'Нияты' : language === 'en' ? 'Intentions' : language === 'uz_cyr' ? 'Ниятлар' : 'Niyatlar',
        icon: NiyatHeartIcon,
        imageSrc: '/icons/home/niyat.webp',
        badge: '19',
      },
      {
        id: 'ehson',
        label: t.features.ehson,
        icon: MasjidEhsonIcon,
        imageSrc: '/icons/home/ehson.webp',
        badge: '',
      },
      {
        id: 'quiz',
        label: t.features.quiz,
        icon: GraduationCap,
        imageSrc: '/icons/home/quiz.webp',
        badge: '120',
      },
      {
        id: 'hifz',
        label: t.features.hifz,
        icon: MushafIcon,
        imageSrc: '/icons/home/hifz.webp',
        badge: '18',
      },
      {
        id: 'life',
        label: t.features.life,
        icon: DuaHandsIcon,
        imageSrc: '/icons/home/life.webp',
        badge: '8',
      },
      {
        id: 'fiqh',
        label:
          language === 'ru'
            ? 'Фикх Q&A'
            : language === 'en'
            ? 'Fiqh Q&A'
            : language === 'uz_cyr'
            ? 'Савол-Жавоб'
            : 'Savol-Javob',
        icon: HadithBookIcon,
        imageSrc: '/icons/home/fiqh.webp',
        badge: '19',
      },
      {
        id: 'tajweed',
        label:
          language === 'ru'
            ? 'Алифба & Таджвид'
            : language === 'en'
            ? 'Alphabet & Tajweed'
            : language === 'uz_cyr'
            ? 'Алифбо & Тажвид'
            : 'Alifbo & Tajvid',
        icon: MushafIcon,
        imageSrc: '/icons/home/tajweed.webp',
        badge: '10',
      },
      {
        id: 'seerah',
        label:
          language === 'ru'
            ? 'Сира & Пророки'
            : language === 'en'
            ? 'Seerah & Prophets'
            : language === 'uz_cyr'
            ? 'Сийрат & Қиссалар'
            : 'Siyrat & Qissalar',
        icon: MasjidDomeIcon,
        imageSrc: '/icons/home/seerah.webp',
        badge: '25',
      },
    ];
    const map = new Map<string, HomeFeatureDef>();
    for (const f of list) map.set(f.id, f);
    return map;
  }, [fridayBadgeText, isFriday, language, t.features]);

  const orderedFeatures = useMemo(() => {
    const out: HomeFeatureDef[] = [];
    for (const id of featureOrder) {
      const f = allFeaturesMap.get(id);
      if (f) out.push(f);
    }
    for (const [id, f] of allFeaturesMap.entries()) {
      if (!featureOrder.includes(id)) out.push(f);
    }
    return out;
  }, [allFeaturesMap, featureOrder]);

  const featurePages = useMemo(() => {
    const pages: HomeFeatureDef[][] = [];
    for (let i = 0; i < orderedFeatures.length; i += TILES_PER_PAGE) {
      pages.push(orderedFeatures.slice(i, i + TILES_PER_PAGE));
    }
    return pages.length > 0 ? pages : [[]];
  }, [orderedFeatures]);

  const totalPages = featurePages.length;

  const clearPeekTimers = () => {
    for (const id of peekTimersRef.current) {
      window.clearTimeout(id);
    }
    peekTimersRef.current = [];
  };

  const goToHomePage = useCallback(
    (nextPage: number) => {
      const clamped = Math.max(0, Math.min(totalPages - 1, nextPage));
      clearPeekTimers();
      setPeekTrackPct(0);
      setShowSwipeOverlay(false);
      persistedHomePage = clamped;
      homePageRef.current = clamped;
      setHomePage(clamped);
      if (clamped >= 1) {
        markHomePage2Opened();
        setHasLearnedPage2(true);
      }
    },
    [totalPages]
  );

  // Move a dragged feature to the target feature's slot
  const moveFeatureToTarget = useCallback(
    (sourceId: string, targetId: string) => {
      if (!sourceId || !targetId || sourceId === targetId) return;
      setFeatureOrder((prev) => {
        const srcIdx = prev.indexOf(sourceId);
        const dstIdx = prev.indexOf(targetId);
        if (srcIdx === -1 || dstIdx === -1 || srcIdx === dstIdx) return prev;
        const next = [...prev];
        // If moving across pages (Page 1 <-> Page 2), swap directly so each page stays 12 tiles
        const srcPage = Math.floor(srcIdx / TILES_PER_PAGE);
        const dstPage = Math.floor(dstIdx / TILES_PER_PAGE);
        if (srcPage !== dstPage) {
          next[srcIdx] = targetId;
          next[dstIdx] = sourceId;
        } else {
          next.splice(srcIdx, 1);
          next.splice(dstIdx, 0, sourceId);
        }
        try {
          localStorage.setItem(HOME_ORDER_STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    []
  );

  // Move a feature directly to the other page (Page 1 <-> Page 2)
  const moveFeatureToPage = useCallback(
    (featId: string, targetPage: number) => {
      setFeatureOrder((prev) => {
        const srcIdx = prev.indexOf(featId);
        if (srcIdx === -1) return prev;
        const currentPage = Math.floor(srcIdx / TILES_PER_PAGE);
        if (currentPage === targetPage) return prev;
        const slotInPage = srcIdx % TILES_PER_PAGE;
        const dstIdx = Math.min(prev.length - 1, targetPage * TILES_PER_PAGE + slotInPage);
        const next = [...prev];
        const displaced = next[dstIdx];
        next[dstIdx] = featId;
        next[srcIdx] = displaced;
        try {
          localStorage.setItem(HOME_ORDER_STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
      goToHomePage(targetPage);
    },
    [goToHomePage]
  );

  const clearLongPressTimer = () => {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleTilePointerDown = (featId: string, clientX: number, clientY: number) => {
    clearLongPressTimer();
    pressOriginRef.current = { x: clientX, y: clientY, id: featId };

    if (isReorderMode) {
      suppressNextClickRef.current = true;
      setDraggingId(featId);
      draggingIdRef.current = featId;
      setDragPointer({ x: clientX, y: clientY });
      return;
    }

    longPressTimerRef.current = window.setTimeout(() => {
      longPressTimerRef.current = null;
      suppressNextClickRef.current = true;
      try {
        navigator.vibrate?.(35);
      } catch {
        // ignore
      }
      setIsReorderMode(true);
      setDraggingId(featId);
      draggingIdRef.current = featId;
      setDragPointer({ x: clientX, y: clientY });
    }, 360);
  };

  const handleGlobalPointerMove = useCallback(
    (clientX: number, clientY: number) => {
      const origin = pressOriginRef.current;
      if (origin && !draggingIdRef.current) {
        const dist = Math.hypot(clientX - origin.x, clientY - origin.y);
        if (dist > 14) {
          clearLongPressTimer();
        }
      }

      const activeDragId = draggingIdRef.current;
      if (!activeDragId) return;

      setDragPointer({ x: clientX, y: clientY });

      // Check if dragging near left/right edge or onto page switcher tab to flip between Page 1 and Page 2
      const now = Date.now();
      const vw = window.innerWidth || 380;
      if (now - lastEdgeFlipAtRef.current > 650) {
        if (clientX < 42 && homePageRef.current > 0) {
          lastEdgeFlipAtRef.current = now;
          const nextP = homePageRef.current - 1;
          moveFeatureToPage(activeDragId, nextP);
          return;
        }
        if (clientX > vw - 42 && homePageRef.current < totalPages - 1) {
          lastEdgeFlipAtRef.current = now;
          const nextP = homePageRef.current + 1;
          moveFeatureToPage(activeDragId, nextP);
          return;
        }
      }

      // Hit-test target tile or page pill under pointer
      const el = document.elementFromPoint(clientX, clientY);
      if (!el) return;

      const pageDropEl = el.closest('[data-drop-page]') as HTMLElement | null;
      if (pageDropEl && now - lastEdgeFlipAtRef.current > 500) {
        const targetP = Number(pageDropEl.dataset.dropPage);
        if (Number.isFinite(targetP) && targetP !== homePageRef.current) {
          lastEdgeFlipAtRef.current = now;
          moveFeatureToPage(activeDragId, targetP);
          return;
        }
      }

      const tileEl = el.closest('[data-feat-id]') as HTMLElement | null;
      const targetId = tileEl?.dataset.featId;
      if (targetId && targetId !== activeDragId) {
        moveFeatureToTarget(activeDragId, targetId);
      }
    },
    [moveFeatureToPage, moveFeatureToTarget, totalPages]
  );

  const handleGlobalPointerUp = useCallback(() => {
    clearLongPressTimer();
    pressOriginRef.current = null;
    if (draggingIdRef.current) {
      setDraggingId(null);
      draggingIdRef.current = null;
      setDragPointer(null);
      window.setTimeout(() => {
        suppressNextClickRef.current = false;
      }, 80);
    }
  }, []);

  useEffect(() => {
    if (!isReorderMode && !draggingId) return;
    const onMouseMove = (e: MouseEvent) => handleGlobalPointerMove(e.clientX, e.clientY);
    const onMouseUp = () => handleGlobalPointerUp();
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [draggingId, handleGlobalPointerMove, handleGlobalPointerUp, isReorderMode]);

  // Native gliding swipe-left hand gesture overlay + wide Page 2 peek until the user genuinely opens Page 2 once
  useEffect(() => {
    if (hasLearnedPage2 || isOnboardingOpen || homePage !== 0 || isReorderMode) {
      clearPeekTimers();
      setPeekTrackPct(0);
      setShowSwipeOverlay(false);
      return;
    }

    const tStart = window.setTimeout(() => {
      setPeekTrackPct(19);
      setShowSwipeOverlay(true);
    }, 600);
    const tSpringBack = window.setTimeout(() => setPeekTrackPct(0), 2350);
    const tFadeOut = window.setTimeout(() => setShowSwipeOverlay(false), 3400);

    peekTimersRef.current.push(tStart, tSpringBack, tFadeOut);

    return () => {
      clearPeekTimers();
      setPeekTrackPct(0);
      setShowSwipeOverlay(false);
    };
  }, [hasLearnedPage2, isOnboardingOpen, homePage, isReorderMode]);

  const swipeOverlayCopy =
    language === 'ru'
      ? { title: 'Смахните влево', sub: '+12 разделов' }
      : language === 'en'
      ? { title: 'Swipe left', sub: '+12 features' }
      : language === 'uz_cyr'
      ? { title: 'Чапга суринг', sub: '+12 та бўлим' }
      : { title: 'Chapga suring', sub: "+12 ta bo'lim" };

  const reorderCopy = useMemo(() => {
    if (language === 'ru') {
      return {
        hint: 'Перетащите кнопку или нажмите ⇄ для переноса на 1-ю стр.',
        reset: 'Сброс',
        done: 'Готово',
        page1: '1-я стр.',
        page2: '2-я стр.',
        toPage1: 'На 1-ю',
        toPage2: 'На 2-ю',
      };
    }
    if (language === 'en') {
      return {
        hint: 'Drag any tile to reorder or move across Page 1 & Page 2',
        reset: 'Reset',
        done: 'Done',
        page1: 'Page 1',
        page2: 'Page 2',
        toPage1: 'To P.1',
        toPage2: 'To P.2',
      };
    }
    if (language === 'uz_cyr') {
      return {
        hint: 'Тугмани суриб жойини ўзгартиринг ёки 1-бетга ўтказинг',
        reset: 'Стандарт',
        done: 'Тайёр',
        page1: '1-саҳифа',
        page2: '2-саҳифа',
        toPage1: '1-бетга',
        toPage2: '2-бетга',
      };
    }
    return {
      hint: "Bo'limni surib joyini o'zgartiring yoki 1-betga o'tkazing",
      reset: 'Standart',
      done: 'Tayyor',
      page1: '1-sahifa',
      page2: '2-sahifa',
      toPage1: '1-betga',
      toPage2: '2-betga',
    };
  }, [language]);

  const handleSwipeStart = (x: number, y: number) => {
    if (isReorderMode || draggingIdRef.current) return;
    clearPeekTimers();
    setPeekTrackPct(0);
    setShowSwipeOverlay(false);
    swipeStartRef.current = { x, y };
  };
  const handleSwipeEnd = (x: number, y: number) => {
    if (isReorderMode || draggingIdRef.current) {
      swipeStartRef.current = null;
      return;
    }
    const start = swipeStartRef.current;
    swipeStartRef.current = null;
    if (!start) return;
    const dx = x - start.x;
    const dy = y - start.y;
    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.15) {
      const next = dx < 0 ? Math.min(totalPages - 1, homePage + 1) : Math.max(0, homePage - 1);
      goToHomePage(next);
    }
  };

  const activeDraggingDef = draggingId ? allFeaturesMap.get(draggingId) || null : null;
  const isCapacitorNative = Capacitor.isNativePlatform();
  const isDesktopApp =
    typeof window !== 'undefined' &&
    (new URLSearchParams(window.location.search).get('desktop') === '1' ||
      Boolean((window as Window & { __NQ_LINUX_DESKTOP__?: boolean }).__NQ_LINUX_DESKTOP__));
  const [isWideViewport, setIsWideViewport] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : false
  );

  useEffect(() => {
    if (typeof window === 'undefined' || isCapacitorNative) return;
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = (e: MediaQueryListEvent) => setIsWideViewport(e.matches);
    setIsWideViewport(mq.matches);
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, [isCapacitorNative]);

  const useWidescreenHome = isDesktopApp || (!isCapacitorNative && isWideViewport);

  if (useWidescreenHome) {
    return (
      <div className="space-y-4 pb-6">
        {/* Widescreen Desktop Prayer Hero Dashboard */}
        <div
          onMouseEnter={() => prefetchTab('prayer')}
          onClick={() => onNavigateTab('prayer')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onNavigateTab('prayer');
          }}
          className={`w-full p-5 rounded-3xl transition cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-5 items-center ${
            isDay
              ? 'bg-gradient-to-br from-[#0c5007] via-[#157a17] to-[#2e8537] text-white shadow-md shadow-emerald-950/15'
              : 'bg-gradient-to-br from-[#07291F] via-[#0B3B1F] to-[#061813] border border-emerald-800/60 text-white shadow-xl'
          }`}
        >
          <div className="lg:col-span-5 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex items-center gap-1.5">
                <span className="text-xs font-semibold text-white/85 truncate">
                  {gregorianStr} · <span className="text-[#d0f39f]">{hijriStr}</span>
                </span>
                {isFriday && (
                  <button
                    type="button"
                    onMouseEnter={() => prefetchTab('juma')}
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateTab('juma');
                    }}
                    className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold shrink-0 hover:bg-amber-300 transition active:scale-95"
                  >
                    {fridayPillText}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onMouseEnter={prefetchCityModal}
                  onFocus={prefetchCityModal}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenCitySelector();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 hover:bg-black/35 border border-white/20 text-xs font-semibold text-white transition shrink-0"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#d0f39f]" />
                  <span>{regionOnlyLabel}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-white/80" />
                </button>
                {onToggleAlerts && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleAlerts();
                    }}
                    aria-label={alertsEnabled ? alertCopy.ariaOn : alertCopy.ariaOff}
                    aria-pressed={alertsEnabled}
                    title={alertsEnabled ? alertCopy.ariaOn : alertCopy.ariaOff}
                    className={`w-7 h-7 rounded-full border flex items-center justify-center transition active:scale-90 shrink-0 ${
                      alertsEnabled
                        ? isDay
                          ? 'bg-[#d0f39f] border-[#d0f39f] text-[#0c4703] shadow-sm'
                          : 'bg-amber-400 border-amber-300 text-slate-950 shadow-sm'
                        : 'bg-black/25 hover:bg-black/35 border-white/20 text-white/80'
                    }`}
                  >
                    {alertsEnabled ? (
                      <Bell className="w-3.5 h-3.5 fill-current" />
                    ) : (
                      <BellOff className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {alertToast && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/35 border border-white/20 text-[11px] font-semibold text-[#d0f39f] animate-in fade-in">
                {alertToast === 'on' ? <Bell className="w-3 h-3" /> : <BellOff className="w-3 h-3 text-white/75" />}
                <span>{alertToast === 'on' ? alertCopy.onToast : alertCopy.offToast}</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-4 pt-1">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/75 block">
                  {t.home.nextPrayer}
                </span>
                <div className="flex items-baseline gap-2.5 mt-0.5">
                  <h2 className="font-display text-3xl font-extrabold tracking-tight text-white">
                    {nextPrayerLabel}
                  </h2>
                  <span className="tabular-nums text-xl font-bold text-[#d0f39f]">
                    {nextPrayer.timeStr}
                  </span>
                </div>
                <p className="text-xs text-white/85 mt-1">
                  {t.home.now} <span className="font-bold text-white">{activePrayerLabel}</span> (
                  {nextPrayer.activeTimeStr})
                </p>
              </div>

              <div className="text-right px-4 py-2.5 rounded-2xl bg-black/25 border border-white/15">
                <LivePrayerRemainingText
                  prayerTimes={prayerTimes}
                  timezone={currentCity.timezone}
                  className="tabular-nums text-xl font-extrabold tracking-tight text-[#d0f39f] block"
                />
                <span className="text-[11px] text-white/75 block">{t.home.remaining}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-5 gap-2 p-2 rounded-2xl bg-black/20 border border-white/15">
            {fivePrayers.map((p) => {
              const isActive = nextPrayer.activeId === p.id;
              const isNext = nextPrayer.nextId === p.id;
              const IconComp = p.icon;
              return (
                <div
                  key={p.id}
                  className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition ${
                    isActive
                      ? 'bg-white/22 border-[#d0f39f] shadow-xs'
                      : isNext
                      ? 'bg-white/12 border-white/40'
                      : 'bg-black/15 border-white/10'
                  }`}
                >
                  <IconComp
                    className={`w-4 h-4 mb-1 ${
                      isActive ? 'text-[#d0f39f]' : 'text-white/90'
                    }`}
                  />
                  <span
                    className={`text-xs font-bold ${
                      isActive ? 'text-[#d0f39f]' : 'text-white'
                    }`}
                  >
                    {p.name}
                  </span>
                  <span className="tabular-nums text-sm font-extrabold text-white mt-0.5">
                    {p.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Owner Broadcast Banner on Widescreen Web / Desktop */}
        {activeBroadcast && (
          <div
            className={`rounded-2xl border px-4 py-3 flex items-center justify-between gap-3 shadow-xs ${
              activeBroadcast.tone === 'urgent'
                ? isDay
                  ? 'bg-rose-50 border-rose-300 text-rose-950'
                  : 'bg-rose-950/75 border-rose-500/60 text-rose-100'
                : activeBroadcast.tone === 'gold'
                ? isDay
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-amber-950/65 border-amber-500/60 text-amber-100'
                : isDay
                ? 'bg-[#eef9ea] border-[#b7e2ad] text-[#0c4703]'
                : 'bg-emerald-950/85 border-emerald-700/70 text-emerald-100'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  activeBroadcast.tone === 'urgent'
                    ? 'bg-rose-600 text-white'
                    : activeBroadcast.tone === 'gold'
                    ? 'bg-amber-500 text-white'
                    : isDay
                    ? 'bg-[#158509] text-white'
                    : 'bg-emerald-800 text-[#d0f39f]'
                }`}
              >
                <Megaphone className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-extrabold truncate">{activeBroadcast.title}</h3>
                <p className="text-[11.5px] opacity-85 line-clamp-1 mt-0.5">{activeBroadcast.body}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {(activeBroadcast.actionTab || activeBroadcast.actionUrl) && (
                <button
                  type="button"
                  onClick={() => handleBroadcastAction(activeBroadcast)}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                    isDay
                      ? 'bg-[#158509] text-white hover:bg-[#0c5007]'
                      : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                  }`}
                >
                  <span>{activeBroadcast.actionLabel || broadcastDefaultCta}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => handleDismissBroadcast(activeBroadcast.id)}
                className="p-1 rounded-lg opacity-65 hover:opacity-100 transition"
                aria-label="Dismiss announcement"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* All 24 Features Widescreen 6-Column Desktop Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {orderedFeatures.map((feat) => {
            const IconComp = feat.icon;
            const isHighlighted = Boolean(feat.highlight);
            return (
              <button
                key={feat.id}
                type="button"
                onMouseEnter={() => prefetchTab(feat.id)}
                onFocus={() => prefetchTab(feat.id)}
                onClick={() => onNavigateTab(feat.id)}
                className={`relative min-h-[104px] flex flex-col items-center justify-center p-3 rounded-2xl border transition group cursor-pointer ${
                  isHighlighted
                    ? isDay
                      ? 'bg-[#eef9ea] border-[#7ecb6f] shadow-xs'
                      : 'bg-amber-950/35 border-amber-400/70'
                    : isDay
                    ? 'bg-white border-[#dde3ea] hover:border-[#158509] shadow-xs'
                    : 'bg-slate-900/90 border-emerald-900/50 hover:border-amber-400/70'
                }`}
              >
                {feat.badge && (
                  <span
                    className={`absolute top-2 right-2 text-[10px] font-bold rounded-full px-2 py-0.5 leading-tight ${
                      isDay
                        ? 'bg-[#eef9ea] text-[#0c4703] border border-[#c5e8bc]'
                        : 'bg-amber-400 text-slate-950'
                    }`}
                  >
                    {feat.badge}
                  </span>
                )}

                {feat.imageSrc ? (
                  <div className="w-12 h-12 flex items-center justify-center group-hover:scale-105 transition mb-1.5">
                    <img
                      src={feat.imageSrc}
                      alt={feat.label}
                      className="w-full h-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.18)]"
                    />
                  </div>
                ) : (
                  <div className="w-11 h-11 rounded-full flex items-center justify-center mb-1.5 bg-[#eef9ea] text-[#158509]">
                    <IconComp className="w-5 h-5" />
                  </div>
                )}

                <span
                  className={`text-xs font-extrabold text-center leading-tight line-clamp-2 ${
                    isDay
                      ? 'text-slate-800 group-hover:text-[#0c4703]'
                      : 'text-slate-100 group-hover:text-amber-300'
                  }`}
                >
                  {feat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 min-h-0 flex flex-col ${isDay ? 'text-slate-900' : 'text-slate-100'}`}>
      {/* FULL-BLEED PRAYER TIMES HERO BANNER */}
      <div
        onTouchStart={() => prefetchTab('prayer')}
        onMouseEnter={() => prefetchTab('prayer')}
        onClick={() => onNavigateTab('prayer')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onNavigateTab('prayer');
        }}
        className={`w-full px-4 pt-3 pb-3.5 rounded-b-3xl transition cursor-pointer shrink-0 ${
          isDay
            ? 'bg-gradient-to-br from-[#0c5007] via-[#157a17] to-[#2e8537] text-white shadow-md shadow-emerald-950/15'
            : 'bg-gradient-to-br from-[#07291F] via-[#0B3B1F] to-[#061813] border-b border-emerald-800/60 text-white shadow-xl'
        }`}
      >
        {/* Top Row: Date + Region-Only Location Pill */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="min-w-0 flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-white/80 truncate leading-tight">
              {gregorianStr} · <span className="text-[#d0f39f]">{hijriStr}</span>
            </span>
            {isFriday && (
              <button
                type="button"
                onTouchStart={() => prefetchTab('juma')}
                onMouseEnter={() => prefetchTab('juma')}
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateTab('juma');
                }}
                className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold shrink-0 hover:bg-amber-300 transition active:scale-95"
              >
                {fridayPillText}
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 max-w-[54%] shrink-0">
            <button
              type="button"
              onTouchStart={prefetchCityModal}
              onMouseEnter={prefetchCityModal}
              onClick={(e) => {
                e.stopPropagation();
                onOpenCitySelector();
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/22 hover:bg-black/32 border border-white/20 text-[11px] font-medium text-white transition active:scale-95 min-w-0"
              title={t.home.changeLocation}
            >
              <MapPin className="w-3 h-3 text-[#d0f39f] shrink-0" />
              <span className="truncate">{regionOnlyLabel}</span>
              <ChevronDown className="w-3 h-3 text-white/80 shrink-0" />
            </button>

            {onToggleAlerts && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleAlerts();
                }}
                aria-label={alertsEnabled ? alertCopy.ariaOn : alertCopy.ariaOff}
                aria-pressed={alertsEnabled}
                title={alertsEnabled ? alertCopy.ariaOn : alertCopy.ariaOff}
                className={`w-7 h-7 rounded-full border flex items-center justify-center transition active:scale-90 shrink-0 ${
                  alertsEnabled
                    ? isDay
                      ? 'bg-[#d0f39f] border-[#d0f39f] text-[#0c4703] shadow-sm'
                      : 'bg-amber-400 border-amber-300 text-slate-950 shadow-sm'
                    : 'bg-black/22 hover:bg-black/32 border-white/20 text-white/80'
                }`}
              >
                {alertsEnabled ? (
                  <Bell className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <BellOff className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
        </div>

        {alertToast && (
          <div className="mb-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/35 border border-white/20 text-[10.5px] font-semibold text-[#d0f39f] animate-in fade-in">
            {alertToast === 'on' ? <Bell className="w-3 h-3" /> : <BellOff className="w-3 h-3 text-white/75" />}
            <span>{alertToast === 'on' ? alertCopy.onToast : alertCopy.offToast}</span>
          </div>
        )}

        {/* Main Prayer Row: Upcoming Prayer + Countdown */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/75 block">
              {t.home.nextPrayer}
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <h2 className="font-display text-[25px] font-semibold tracking-tight leading-none text-white">
                {nextPrayerLabel}
              </h2>
              <span className="tabular-nums text-lg font-semibold text-[#d0f39f]">
                {nextPrayer.timeStr}
              </span>
            </div>
            <p className="text-[11px] text-white/80 mt-0.5">
              {t.home.now} <span className="font-semibold text-white">{activePrayerLabel}</span> ({nextPrayer.activeTimeStr})
            </p>
          </div>

          <div className="text-right px-3 py-1.5 rounded-2xl bg-black/22 border border-white/15 shrink-0">
            <LivePrayerRemainingText
              prayerTimes={prayerTimes}
              timezone={currentCity.timezone}
              className="tabular-nums text-base font-semibold tracking-tight text-[#d0f39f] block leading-tight"
            />
            <span className="text-[10px] text-white/75 block">
              {t.home.remaining}
            </span>
          </div>
        </div>

        {/* Unified 5-Prayer Strip */}
        <div className="grid grid-cols-5 gap-1 p-1 mt-2.5 rounded-2xl bg-black/20 border border-white/12">
          {fivePrayers.map((p) => {
            const isActive = nextPrayer.activeId === p.id;
            const isNext = nextPrayer.nextId === p.id;
            const IconComp = p.icon;

            return (
              <div
                key={p.id}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl border transition ${
                  isActive
                    ? 'bg-white/22 border-[#d0f39f] shadow-xs'
                    : isNext
                    ? 'bg-white/12 border-white/40'
                    : 'bg-black/15 border-white/10'
                }`}
              >
                <div className="flex items-center gap-1 mb-0.5">
                  <IconComp
                    className={`w-3.5 h-3.5 ${
                      isActive
                        ? 'text-[#d0f39f]'
                        : isNext
                        ? 'text-white'
                        : 'text-white/85'
                    }`}
                  />
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#d0f39f]" />}
                </div>

                <span
                  className={`text-[11px] leading-tight truncate max-w-full ${
                    isActive
                      ? 'text-[#d0f39f] font-bold'
                      : isNext
                      ? 'text-white font-semibold'
                      : 'text-white/90 font-medium'
                  }`}
                >
                  {p.name}
                </span>

                <span
                  className={`tabular-nums text-[12px] font-bold mt-0.5 ${
                    isActive ? 'text-white' : isNext ? 'text-[#d0f39f]' : 'text-white/95'
                  }`}
                >
                  {p.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* LIVE OWNER BROADCAST BANNER */}
      {activeBroadcast && !isReorderMode && (
        <div className="px-3.5 pt-2 shrink-0">
          <div
            className={`rounded-2xl border px-3 py-2.5 flex items-start gap-2.5 shadow-xs ${
              activeBroadcast.tone === 'urgent'
                ? isDay
                  ? 'bg-rose-50 border-rose-300 text-rose-950'
                  : 'bg-rose-950/75 border-rose-500/60 text-rose-100'
                : activeBroadcast.tone === 'gold'
                ? isDay
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-amber-950/65 border-amber-500/60 text-amber-100'
                : isDay
                ? 'bg-[#eef9ea] border-[#b7e2ad] text-[#0c4703]'
                : 'bg-emerald-950/85 border-emerald-700/70 text-emerald-100'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                activeBroadcast.tone === 'urgent'
                  ? isDay
                    ? 'bg-rose-600 text-white'
                    : 'bg-rose-500/30 text-rose-200'
                  : activeBroadcast.tone === 'gold'
                  ? isDay
                    ? 'bg-amber-500 text-white'
                    : 'bg-amber-400/25 text-amber-300'
                  : isDay
                  ? 'bg-[#158509] text-white'
                  : 'bg-emerald-800/80 text-[#d0f39f]'
              }`}
            >
              <Megaphone className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-1.5">
                <h3 className="text-xs font-extrabold leading-snug truncate">
                  {activeBroadcast.title}
                </h3>
                <button
                  type="button"
                  onClick={() => handleDismissBroadcast(activeBroadcast.id)}
                  className="p-0.5 rounded-lg opacity-65 hover:opacity-100 transition shrink-0"
                  aria-label="Dismiss announcement"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] leading-snug opacity-85 line-clamp-2 mt-0.5">
                {activeBroadcast.body}
              </p>
              {(activeBroadcast.actionTab || activeBroadcast.actionUrl) && (
                <button
                  type="button"
                  onClick={() => handleBroadcastAction(activeBroadcast)}
                  className={`mt-1.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold transition active:scale-95 ${
                    activeBroadcast.tone === 'urgent'
                      ? isDay
                        ? 'bg-rose-600 text-white hover:bg-rose-700'
                        : 'bg-rose-500 text-white hover:bg-rose-400'
                      : activeBroadcast.tone === 'gold'
                      ? isDay
                        ? 'bg-amber-500 text-white hover:bg-amber-600'
                        : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                      : isDay
                      ? 'bg-[#158509] text-white hover:bg-[#0c5007]'
                      : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                  }`}
                >
                  <span>{activeBroadcast.actionLabel || broadcastDefaultCta}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SWIPEABLE & LONG-PRESS REORDERABLE FEATURE GRID */}
      <div className="flex-1 min-h-0 flex flex-col pt-1.5 pb-2">
        {/* Top Bar: Either Edit/Reorder Toolbar OR Clean Page Dots */}
        {isReorderMode ? (
          <div className="px-3.5 pb-1.5 shrink-0">
            <div
              className={`rounded-2xl border px-2.5 py-1.5 flex items-center justify-between gap-1.5 ${
                isDay
                  ? 'bg-[#eef9ea] border-[#b7e2ad] text-[#0c4703]'
                  : 'bg-emerald-950/90 border-amber-400/60 text-amber-200'
              }`}
            >
              {/* Dynamic Page 1 / Page 2 / Page 3 Drop & Switch Pills */}
              <div className="flex items-center gap-1">
                {featurePages.map((_, pIdx) => {
                  const active = homePage === pIdx;
                  return (
                    <button
                      key={pIdx}
                      type="button"
                      data-drop-page={pIdx}
                      onClick={() => goToHomePage(pIdx)}
                      className={`px-2.5 py-1 rounded-xl text-[10.5px] font-extrabold transition ${
                        active
                          ? isDay
                            ? 'bg-[#158509] text-white nq-keep-dark'
                            : 'bg-amber-400 text-slate-950'
                          : isDay
                          ? 'bg-white text-slate-700 border border-[#c5e8bc]'
                          : 'bg-slate-900 text-slate-300 border border-emerald-800'
                      }`}
                    >
                      {pIdx === 0 ? reorderCopy.page1 : pIdx === 1 ? reorderCopy.page2 : `${pIdx + 1}`}
                    </button>
                  );
                })}
              </div>

              <span className="text-[10px] font-bold truncate hidden sm:inline">
                {reorderCopy.hint}
              </span>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => saveOrder([...DEFAULT_FEATURE_ORDER])}
                  className={`px-2 py-1 rounded-xl text-[10.5px] font-bold inline-flex items-center gap-1 border ${
                    isDay
                      ? 'bg-white border-[#c5e8bc] text-slate-700'
                      : 'bg-slate-900 border-emerald-800 text-slate-200'
                  }`}
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{reorderCopy.reset}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsReorderMode(false);
                    setDraggingId(null);
                    setDragPointer(null);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[10.5px] font-extrabold inline-flex items-center gap-1 ${
                    isDay
                      ? 'bg-[#158509] text-white nq-keep-dark'
                      : 'bg-amber-400 text-slate-950'
                  }`}
                >
                  <Check className="w-3 h-3" />
                  <span>{reorderCopy.done}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="flex items-center justify-center gap-2 pb-1.5 px-3.5 shrink-0"
            role="tablist"
            aria-label="Home pages"
          >
            <div className="flex items-center gap-1.5">
              {featurePages.map((_, idx) => {
                const isActivePage = homePage === idx;
                const showPulseDot = !hasLearnedPage2 && idx === 1 && homePage === 0;
                return (
                  <button
                    key={idx}
                    type="button"
                    role="tab"
                    data-drop-page={idx}
                    aria-selected={isActivePage}
                    aria-label={`Page ${idx + 1}`}
                    onClick={() => goToHomePage(idx)}
                    className={`relative h-1.5 rounded-full transition-all duration-300 ${
                      isActivePage
                        ? isDay
                          ? 'w-5 bg-[#158509]'
                          : 'w-5 bg-amber-400'
                        : showPulseDot
                        ? isDay
                          ? 'w-2 bg-[#158509]/55'
                          : 'w-2 bg-amber-400/65'
                        : isDay
                        ? 'w-1.5 bg-slate-300 hover:bg-slate-400'
                        : 'w-1.5 bg-slate-700 hover:bg-slate-600'
                    }`}
                  >
                    {showPulseDot && (
                      <span
                        className={`absolute inset-0 rounded-full animate-ping opacity-60 ${
                          isDay ? 'bg-[#158509]' : 'bg-amber-400'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Horizontal Swipe Viewport */}
        <div
          className={`relative flex-1 min-h-0 overflow-hidden ${
            isReorderMode ? 'touch-none select-none' : 'touch-pan-y select-none'
          }`}
          onTouchStart={(e) => {
            const t0 = e.changedTouches[0];
            if (t0) handleSwipeStart(t0.clientX, t0.clientY);
          }}
          onTouchMove={(e) => {
            const tm = e.touches[0];
            if (tm) handleGlobalPointerMove(tm.clientX, tm.clientY);
          }}
          onTouchEnd={(e) => {
            handleGlobalPointerUp();
            const t1 = e.changedTouches[0];
            if (t1) handleSwipeEnd(t1.clientX, t1.clientY);
          }}
          onTouchCancel={() => handleGlobalPointerUp()}
          onMouseDown={(e) => handleSwipeStart(e.clientX, e.clientY)}
          onMouseUp={(e) => handleSwipeEnd(e.clientX, e.clientY)}
        >
          <div
            className="h-full flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              width: `${totalPages * 100}%`,
              transform: `translateX(-${(homePage * 100) / totalPages + peekTrackPct}%)`,
            }}
          >
            {featurePages.map((pageItems, pageIdx) => (
              <div
                key={pageIdx}
                className="h-full px-3.5 grid grid-cols-3 grid-rows-4 gap-1.5 shrink-0"
                style={{ width: `${100 / totalPages}%` }}
              >
                {pageItems.map((feat) => {
                  const IconComp = feat.icon;
                  const isHighlighted = Boolean(feat.highlight);
                  const isBeingDragged = draggingId === feat.id;
                  const targetOtherPage = (pageIdx + 1) % totalPages;

                  return (
                    <div
                      key={feat.id}
                      data-feat-id={feat.id}
                      onContextMenu={(e) => e.preventDefault()}
                      onMouseEnter={() => prefetchTab(feat.id)}
                      onTouchStart={(e) => {
                        prefetchTab(feat.id);
                        const t0 = e.touches[0];
                        if (t0) handleTilePointerDown(feat.id, t0.clientX, t0.clientY);
                      }}
                      onMouseDown={(e) => {
                        if (e.button === 0) handleTilePointerDown(feat.id, e.clientX, e.clientY);
                      }}
                      onClick={() => {
                        if (suppressNextClickRef.current) {
                          suppressNextClickRef.current = false;
                          return;
                        }
                        if (isReorderMode) return;
                        onNavigateTab(feat.id);
                      }}
                      role="button"
                      tabIndex={0}
                      className={`relative w-full h-full min-h-[64px] flex flex-col items-center justify-center px-1.5 py-1.5 rounded-2xl border transition group cursor-pointer select-none ${
                        isBeingDragged
                          ? isDay
                            ? 'opacity-45 scale-95 border-2 border-dashed border-[#158509] bg-[#eef9ea]'
                            : 'opacity-45 scale-95 border-2 border-dashed border-amber-400 bg-emerald-950/60'
                          : isReorderMode
                          ? isDay
                            ? 'bg-white border-[#158509]/70 ring-1 ring-[#158509]/25 shadow-xs'
                            : 'bg-slate-900 border-amber-400/70 ring-1 ring-amber-400/25'
                          : isHighlighted
                          ? isDay
                            ? 'bg-[#eef9ea] border-[#7ecb6f] shadow-xs active:scale-[0.98]'
                            : 'bg-amber-950/35 border-amber-400/70 active:scale-[0.98]'
                          : isDay
                          ? 'bg-white border-[#dde3ea] hover:border-[#158509]/45 shadow-xs active:scale-[0.98]'
                          : 'bg-slate-900/90 border-emerald-900/50 hover:border-amber-400/70 active:scale-[0.98]'
                      }`}
                    >
                      {/* In Reorder Mode: show quick 1-tap "Move to Page 1 / Page 2" button + grip icon */}
                      {isReorderMode ? (
                        <>
                          <span
                            className={`absolute top-1 left-1.5 p-0.5 rounded-md ${
                              isDay ? 'text-[#158509]' : 'text-amber-300'
                            }`}
                          >
                            <GripHorizontal className="w-3.5 h-3.5" />
                          </span>
                          <button
                            type="button"
                            onTouchStart={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              moveFeatureToPage(feat.id, targetOtherPage);
                            }}
                            className={`absolute top-1 right-1 px-1.5 py-0.5 rounded-lg text-[8.5px] font-extrabold inline-flex items-center gap-0.5 shadow-2xs transition active:scale-90 ${
                              isDay
                                ? 'bg-[#158509] text-white nq-keep-dark'
                                : 'bg-amber-400 text-slate-950'
                            }`}
                          >
                            <ArrowLeftRight className="w-2.5 h-2.5" />
                            <span>{pageIdx === 0 ? reorderCopy.toPage2 : reorderCopy.toPage1}</span>
                          </button>
                        </>
                      ) : (
                        feat.badge && (
                          <span
                            className={`absolute top-1.5 right-1.5 text-[9px] font-semibold rounded-full px-1.5 py-0.5 leading-tight ${
                              isHighlighted
                                ? 'bg-amber-400 text-slate-950'
                                : isDay
                                ? 'bg-[#eef9ea] text-[#0c4703] border border-[#c5e8bc]'
                                : 'bg-amber-400 text-slate-950'
                            }`}
                          >
                            {feat.badge}
                          </span>
                        )
                      )}

                      {feat.imageSrc ? (
                        <div className="w-[44px] h-[44px] flex items-center justify-center group-hover:scale-105 transition mb-0.5 pointer-events-none">
                          <img
                            src={feat.imageSrc}
                            alt={feat.label}
                            draggable={false}
                            className="w-full h-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.18)]"
                            decoding="async"
                          />
                        </div>
                      ) : (
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-105 transition mb-1 pointer-events-none ${
                            isHighlighted
                              ? isDay
                                ? 'bg-[#158509] text-white'
                                : 'bg-amber-400 text-slate-950'
                              : isDay
                              ? 'bg-[#f1ffea] text-[#158509] border border-[#d7f0cb]'
                              : 'bg-emerald-950/90 border border-emerald-800/50 text-amber-300'
                          }`}
                        >
                          <IconComp className="w-[21px] h-[21px]" />
                        </div>
                      )}

                      <span
                        className={`text-[11.5px] font-semibold transition text-center leading-tight line-clamp-2 pointer-events-none ${
                          isDay
                            ? 'text-slate-800 group-hover:text-[#0c4703]'
                            : 'text-slate-100 group-hover:text-amber-300'
                        }`}
                      >
                        {feat.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Floating Drag Ghost Following User's Finger */}
          {activeDraggingDef && dragPointer && (
            <div
              className={`fixed z-50 pointer-events-none w-24 h-20 -ml-12 -mt-10 rounded-2xl border-2 flex flex-col items-center justify-center p-1.5 shadow-2xl scale-105 ${
                isDay
                  ? 'bg-white/95 border-[#158509] text-[#0c4703]'
                  : 'bg-slate-900/95 border-amber-400 text-white'
              }`}
              style={{
                left: `${dragPointer.x}px`,
                top: `${dragPointer.y}px`,
              }}
            >
              {activeDraggingDef.imageSrc && (
                <img
                  src={activeDraggingDef.imageSrc}
                  alt={activeDraggingDef.label}
                  className="w-10 h-10 object-contain"
                />
              )}
              <span className="text-[10.5px] font-extrabold text-center truncate max-w-full mt-0.5">
                {activeDraggingDef.label}
              </span>
            </div>
          )}

          {/* Gliding Swipe-Left Hand Gesture Overlay */}
          {!hasLearnedPage2 && homePage === 0 && !isReorderMode && (
            <div
              className={`pointer-events-none absolute inset-x-3.5 inset-y-0 z-30 rounded-2xl flex flex-col items-center justify-center gap-2 transition-opacity duration-500 ease-out ${
                showSwipeOverlay ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundColor: isDay ? 'rgba(15, 23, 42, 0.42)' : 'rgba(2, 6, 23, 0.55)',
                backdropFilter: 'blur(1.5px)',
              }}
            >
              <div className="relative h-12 w-32 flex items-center justify-center">
                <div
                  className="nq-swipe-trail absolute right-7 h-2.5 rounded-full"
                  style={{
                    background: isDay
                      ? 'linear-gradient(90deg, rgba(208, 243, 159, 0.95), rgba(208, 243, 159, 0))'
                      : 'linear-gradient(90deg, rgba(251, 191, 36, 0.95), rgba(251, 191, 36, 0))',
                  }}
                />
                <div
                  className={`nq-swipe-hand w-11 h-11 rounded-full flex items-center justify-center shadow-lg ${
                    isDay
                      ? 'bg-white text-[#0c4703]'
                      : 'bg-amber-400 text-slate-950'
                  }`}
                >
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2" />
                    <path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2" />
                    <path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8" />
                    <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                  </svg>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm font-extrabold tracking-tight text-white drop-shadow">
                  {swipeOverlayCopy.title}
                </p>
                <p className="text-[11px] font-semibold text-[#d0f39f] drop-shadow-xs">
                  {swipeOverlayCopy.sub}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
