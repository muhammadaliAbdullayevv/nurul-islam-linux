import React, { useState, useEffect, useRef, useCallback, useMemo, Suspense, lazy } from 'react';
import { ArrowDownCircle, CloudDownload, X } from 'lucide-react';
import { AndroidShell } from './components/AndroidShell';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LanguageProvider, LANGUAGE_OPTIONS, useLanguage } from './contexts/LanguageContext';
import { HomeTab } from './components/tabs/HomeTab';
import { useDayKey } from './components/LivePrayerClock';
import {
  hasNativeQuranAudioBridge,
  getNativeAudioState,
  subscribeNativeAudioState,
  consumeNativePendingOpen,
  getAllDownloadProgress,
  subscribeAllAudioDownloads,
  AudioDownloadProgress,
  NativeQuranAudioState,
} from './utils/nativeQuranAudio';
import type { HubSection } from './components/tabs/AzkarTab';
import { AppLanguage, AsrMethod, Bookmark, CalcMethod, Coordinates, TranslationId } from './types';
import {
  DEFAULT_CITY,
  calculatePrayerTimes,
  cleanModernUzPlaceName,
  findNearestCity,
  isLocationKnownInCatalog,
  loadFullLocationCatalog,
  resolveRegionFromCoords,
} from './utils/prayerTimes';
import {
  PrayerAlertPrefs,
  loadAlertPrefs,
  saveAlertPrefs,
  syncNativeAlertsAndWidget
} from './utils/nativePrayerBridge';
import {
  RemoteAppRelease,
  UpdateDownloadStatus,
  canRequestNativeInstallPermission,
  checkForAppUpdate,
  isDesktopRpmUpdaterSupported,
  startInAppUpdate,
  getReleaseNoteText
} from './utils/appUpdater';
import { HOME_PAGE2_LEARNED_EVENT, sendAnonymousHeartbeat } from './utils/telemetry';
import { addQuranListenSeconds, resetUserActivity } from './utils/userActivity';
import { modalLoaders, scheduleIdleTabPrefetch, tabLoaders } from './utils/tabLoaders';

const QuranTab = lazy(tabLoaders.quran);
const PrayerTab = lazy(tabLoaders.prayer);
const QiblaTab = lazy(tabLoaders.qibla);
const TasbihTab = lazy(tabLoaders.tasbih);
const AzkarTab = lazy(tabLoaders.azkar);
const NamesTab = lazy(tabLoaders.names);
const ZakatTab = lazy(tabLoaders.zakat);
const QazoTab = lazy(tabLoaders.qazo);
const RamadanTab = lazy(tabLoaders.ramadan);
const PrayerGuideTab = lazy(tabLoaders.guide);
const MasjidsTab = lazy(tabLoaders.masjids);
const MasjidEhsonTab = lazy(tabLoaders.ehson);
const JumaTab = lazy(tabLoaders.juma);
const QuizTab = lazy(tabLoaders.quiz);
const HifzTab = lazy(tabLoaders.hifz);
const LifeGuideTab = lazy(tabLoaders.life);
const FiqhTab = lazy(tabLoaders.fiqh);
const TajweedTab = lazy(tabLoaders.tajweed);
const SeerahTab = lazy(tabLoaders.seerah);
const WisdomTab = lazy(tabLoaders.wisdom);
const ProfileTab = lazy(tabLoaders.profile);
const CitySelectorModal = lazy(modalLoaders.citySelector);
const OnboardingModal = lazy(modalLoaders.onboarding);
const QuranMiniPlayer = lazy(modalLoaders.miniPlayer);

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const { isDay } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('home');
  const [azkarInitialSection, setAzkarInitialSection] = useState<HubSection>('hub');
  const [namesInitialMode, setNamesInitialMode] = useState<'list' | 'quiz'>('list');
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number | null>(null);
  const [selectedAyahNumber, setSelectedAyahNumber] = useState<number | null>(null);
  const [isReadingSurah, setIsReadingSurah] = useState(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    try {
      if (localStorage.getItem('nq_onboarding_done') === '1') return false;
      if (localStorage.getItem('nq_onboarding_in_progress') === '1') return true;
      if (localStorage.getItem('nq_city') && localStorage.getItem('nq_language')) {
        localStorage.setItem('nq_onboarding_done', '1');
        return false;
      }
      localStorage.setItem('nq_onboarding_in_progress', '1');
      return true;
    } catch {
      return false;
    }
  });
  const [alertPrefs, setAlertPrefs] = useState<PrayerAlertPrefs>(loadAlertPrefs);
  const [updateRelease, setUpdateRelease] = useState<RemoteAppRelease | null>(null);
  const [updateStatus, setUpdateStatus] = useState<UpdateDownloadStatus>('idle');
  const [updateProgress, setUpdateProgress] = useState<number>(0);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [nativeAudioState, setNativeAudioState] = useState<NativeQuranAudioState>(() =>
    getNativeAudioState()
  );
  const [downloadMap, setDownloadMap] = useState<Record<number, AudioDownloadProgress>>(() =>
    getAllDownloadProgress()
  );
  const tabHistoryRef = useRef<string[]>([]);
  const updateStatusRef = useRef<UpdateDownloadStatus>('idle');
  const updateReleaseRef = useRef<RemoteAppRelease | null>(null);
  const showOnboardingRef = useRef<boolean>(showOnboarding);
  const dismissedUpdateCodeRef = useRef<number | null>(null);
  const lastUpdateCheckAtRef = useRef<number>(0);
  const isCheckingUpdateRef = useRef<boolean>(false);
  const hiddenAtRef = useRef<number | null>(null);

  useEffect(() => {
    updateStatusRef.current = updateStatus;
  }, [updateStatus]);

  useEffect(() => {
    updateReleaseRef.current = updateRelease;
  }, [updateRelease]);

  useEffect(() => {
    showOnboardingRef.current = showOnboarding;
    // If an update was found while first-run onboarding was open, show it right after onboarding finishes
    if (!showOnboarding && updateReleaseRef.current && dismissedUpdateCodeRef.current !== updateReleaseRef.current.versionCode) {
      setIsUpdateModalOpen(true);
    }
  }, [showOnboarding]);

  const handleDismissUpdateModal = useCallback(() => {
    if (updateReleaseRef.current && !updateReleaseRef.current.forceUpdate) {
      dismissedUpdateCodeRef.current = updateReleaseRef.current.versionCode;
    }
    setIsUpdateModalOpen(false);
  }, []);

  const handleCheckUpdate = useCallback(async (silent = false, forceCheck = false) => {
    if (isCheckingUpdateRef.current) return;
    if (
      silent &&
      (updateStatusRef.current === 'downloading' ||
        updateStatusRef.current === 'installing' ||
        updateStatusRef.current === 'needs_permission')
    ) {
      return;
    }
    const now = Date.now();
    if (silent && !forceCheck && now - lastUpdateCheckAtRef.current < 10_000) {
      return;
    }

    isCheckingUpdateRef.current = true;
    lastUpdateCheckAtRef.current = now;
    if (!silent) {
      dismissedUpdateCodeRef.current = null;
      setUpdateStatus('checking');
    }
    try {
      const { hasUpdate, remote } = await checkForAppUpdate();
      if (hasUpdate && remote) {
        setUpdateRelease(remote);
        setUpdateStatus('available');
        const wasDismissed =
          silent &&
          !remote.forceUpdate &&
          dismissedUpdateCodeRef.current === remote.versionCode;
        if (remote.forceUpdate || (!wasDismissed && !showOnboardingRef.current)) {
          setIsUpdateModalOpen(true);
        }
      } else {
        setUpdateRelease(null);
        setIsUpdateModalOpen(false);
        if (!silent) {
          setUpdateStatus('up_to_date');
        }
      }
    } catch {
      if (!silent) {
        setUpdateStatus('error');
      }
    } finally {
      isCheckingUpdateRef.current = false;
    }
  }, []);

  const handleStartUpdate = useCallback(() => {
    const rel = updateReleaseRef.current || updateRelease;
    if (!rel) return;
    setUpdateProgress(0);
    setUpdateStatus('downloading');
    startInAppUpdate(
      rel.apkUrl,
      (pct, status) => {
        setUpdateProgress(pct);
        setUpdateStatus(status);
      },
      rel.rpmUrl
    );
  }, [updateRelease]);

  // Check for updates immediately on app launch, on resume from background, on reconnect, and every 60s while open
  useEffect(() => {
    const initialTimer = window.setTimeout(() => {
      void handleCheckUpdate(true, true);
    }, 500);

    const handleResumeCheck = () => {
      if (
        !isDesktopRpmUpdaterSupported() &&
        updateStatusRef.current === 'needs_permission' &&
        updateReleaseRef.current &&
        canRequestNativeInstallPermission()
      ) {
        handleStartUpdate();
        return;
      }
      if (hiddenAtRef.current !== null && Date.now() - hiddenAtRef.current >= 30_000) {
        dismissedUpdateCodeRef.current = null;
      }
      hiddenAtRef.current = null;
      void handleCheckUpdate(true);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        hiddenAtRef.current = Date.now();
      } else if (document.visibilityState === 'visible') {
        handleResumeCheck();
      }
    };

    const onWindowFocus = () => {
      if (document.visibilityState === 'visible') {
        handleResumeCheck();
      }
    };

    const onOnline = () => {
      void handleCheckUpdate(true, true);
    };

    const win = window as Window & { __nqOnAppResume?: () => void };
    win.__nqOnAppResume = handleResumeCheck;

    const livePollId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        void handleCheckUpdate(true, true);
      }
    }, 60_000);

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('focus', onWindowFocus);
    window.addEventListener('online', onOnline);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(livePollId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('focus', onWindowFocus);
      window.removeEventListener('online', onOnline);
      if (win.__nqOnAppResume === handleResumeCheck) {
        delete win.__nqOnAppResume;
      }
    };
  }, [handleCheckUpdate, handleStartUpdate]);

  const navigateToTab = useCallback(
    (nextTab: string) => {
      if (nextTab === 'azkar') {
        setAzkarInitialSection('hub');
      } else if (nextTab.startsWith('azkar:')) {
        const sub = nextTab.slice('azkar:'.length) as HubSection;
        setAzkarInitialSection(sub);
        nextTab = 'azkar';
      } else if (nextTab === 'names') {
        setNamesInitialMode('list');
      } else if (nextTab === 'names:quiz') {
        setNamesInitialMode('quiz');
        nextTab = 'names';
      }
      if (nextTab !== activeTab) {
        tabHistoryRef.current = [...tabHistoryRef.current.slice(-19), activeTab];
        setActiveTab(nextTab);
      }
      if (nextTab !== 'quran') {
        setSelectedSurahNumber(null);
        setIsReadingSurah(false);
      }
    },
    [activeTab]
  );

  const handleBack = useCallback((): boolean => {
    if (isUpdateModalOpen) {
      if (!updateRelease?.forceUpdate) {
        handleDismissUpdateModal();
      }
      return true;
    }
    if (isCityModalOpen) {
      setIsCityModalOpen(false);
      return true;
    }
    if (showOnboarding) {
      return true;
    }

    const backEvent = new CustomEvent('nq:android-back', { cancelable: true });
    const notCanceled = window.dispatchEvent(backEvent);
    if (!notCanceled) {
      return true;
    }

    if (tabHistoryRef.current.length > 0) {
      const prevTab = tabHistoryRef.current[tabHistoryRef.current.length - 1];
      tabHistoryRef.current = tabHistoryRef.current.slice(0, -1);
      setActiveTab(prevTab);
      if (prevTab !== 'quran') {
        setSelectedSurahNumber(null);
        setIsReadingSurah(false);
      }
      return true;
    }

    if (activeTab !== 'home') {
      setActiveTab('home');
      setSelectedSurahNumber(null);
      setIsReadingSurah(false);
      return true;
    }

    return false;
  }, [activeTab, handleDismissUpdateModal, isCityModalOpen, isUpdateModalOpen, showOnboarding, updateRelease?.forceUpdate]);

  // Android hardware / gesture back button support
  useEffect(() => {
    const win = window as Window & { __nqOnAndroidBack?: () => boolean };
    win.__nqOnAndroidBack = handleBack;
    return () => {
      delete win.__nqOnAndroidBack;
    };
  }, [handleBack]);

  // User Preferences
  const [currentCity, setCurrentCity] = useState<Coordinates>(() => {
    try {
      const saved = localStorage.getItem('nq_city');
      if (saved) {
        const parsed = JSON.parse(saved) as Coordinates;
        if (parsed && typeof parsed.cityName === 'string') {
          const cleanedName =
            parsed.countryName === 'Uzbekistan'
              ? cleanModernUzPlaceName(parsed.cityName)
              : parsed.cityName;
          if (cleanedName !== parsed.cityName) {
            const migrated = { ...parsed, cityName: cleanedName };
            localStorage.setItem('nq_city', JSON.stringify(migrated));
            return migrated;
          }
          return parsed;
        }
      }
    } catch {
      // ignore parse errors
    }
    return DEFAULT_CITY; // Default: Tashkent
  });
  const [, setCityCatalogVersion] = useState(0);

  // Zero-spinner background prefetch of top tabs once Home settles (respects Data Saver)
  useEffect(() => {
    if (showOnboarding) return;
    return scheduleIdleTabPrefetch();
  }, [showOnboarding]);

  // If saved location is a non-capital Uzbekistan district, hydrate full district labels lazily on idle
  useEffect(() => {
    if (
      currentCity.countryName === 'Uzbekistan' &&
      !isLocationKnownInCatalog(currentCity.cityName)
    ) {
      let alive = true;
      void loadFullLocationCatalog().then(() => {
        if (alive) setCityCatalogVersion((v) => v + 1);
      });
      return () => {
        alive = false;
      };
    }
  }, [currentCity.cityName, currentCity.countryName]);

  const [calcMethod, setCalcMethod] = useState<CalcMethod>(() => {
    return (localStorage.getItem('nq_calcmethod') as CalcMethod) || 'Uzbekistan';
  });

  const asrMethod: AsrMethod = 'Hanafi';

  const [selectedTranslation, setSelectedTranslation] = useState<TranslationId>(() => {
    return (localStorage.getItem('nq_translation') as TranslationId) || 'uz_mansur';
  });

  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const saved = localStorage.getItem('nq_bookmarks');
    return saved ? JSON.parse(saved) : [
      { id: '1-1', surahNumber: 1, surahName: 'Al-Fatihah', ayahNumber: 1, timestamp: Date.now() },
      { id: '24-35', surahNumber: 24, surahName: 'An-Nur', ayahNumber: 35, timestamp: Date.now() }
    ];
  });

  const handleSelectCity = useCallback((nextCity: Coordinates) => {
    setCurrentCity(nextCity);
    try {
      localStorage.setItem('nq_city', JSON.stringify(nextCity));
    } catch {
      // Ignore storage error
    }
  }, []);

  // Save changes to localStorage (only persist nq_city once onboarding is done so fresh installs cannot bypass onboarding)
  useEffect(() => {
    if (showOnboarding) return;
    try {
      localStorage.setItem('nq_city', JSON.stringify(currentCity));
    } catch {
      // Ignore storage error
    }
  }, [currentCity, showOnboarding]);

  useEffect(() => {
    localStorage.setItem('nq_calcmethod', calcMethod);
  }, [calcMethod]);

  useEffect(() => {
    localStorage.setItem('nq_asrmethod', 'Hanafi');
  }, []);

  useEffect(() => {
    localStorage.setItem('nq_translation', selectedTranslation);
  }, [selectedTranslation]);

  useEffect(() => {
    localStorage.setItem('nq_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Track cumulative Quran listening duration while native Android audio plays
  useEffect(() => {
    if (!nativeAudioState.active || !nativeAudioState.isPlaying) return;
    const id = window.setInterval(() => {
      addQuranListenSeconds(5);
    }, 5000);
    return () => window.clearInterval(id);
  }, [nativeAudioState.active, nativeAudioState.isPlaying]);

  // Anonymous telemetry heartbeat for Owner Control Center analytics (zero PII)
  useEffect(() => {
    const send = () => {
      void sendAnonymousHeartbeat({
        language,
        city: currentCity.cityName,
        theme: isDay ? 'day' : 'night',
      });
    };
    const timer = window.setTimeout(send, 3200);
    window.addEventListener(HOME_PAGE2_LEARNED_EVENT, send);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(HOME_PAGE2_LEARNED_EVENT, send);
    };
  }, [language, currentCity.cityName, isDay]);

  // Auto-resolve any previously saved generic GPS label to an actual region name
  useEffect(() => {
    const isGenericLabel =
      currentCity.countryName === 'GPS Coordinates' ||
      currentCity.cityName === 'Detected Location' ||
      currentCity.cityName === 'Current Location';

    if (isGenericLabel) {
      resolveRegionFromCoords(currentCity.latitude, currentCity.longitude, language).then((resolved) => {
        setCurrentCity((prev) => ({
          ...prev,
          cityName: resolved.cityName,
          countryName: resolved.countryName,
          timezone: resolved.timezone || prev.timezone,
          region: resolved.region || prev.region,
          subtitle: resolved.subtitle,
        }));
      });
    }
  }, [currentCity.cityName, currentCity.countryName, currentCity.latitude, currentCity.longitude, language]);

  // Handle GPS detection and resolve to human-readable village, district, or city name (with IP geolocation fallback for Linux Desktop / PCs without GPS hardware)
  const handleDetectGPS = (): Promise<{ ok: boolean }> => {
    const applyCoords = async (latitude: number, longitude: number): Promise<{ ok: boolean }> => {
      const nearest = findNearestCity(latitude, longitude);
      const provisional: Coordinates = {
        cityName: nearest.cityName,
        countryName: nearest.countryName,
        latitude,
        longitude,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || nearest.timezone,
        region: nearest.region,
      };
      setCurrentCity(provisional);
      const resolved = await resolveRegionFromCoords(latitude, longitude, language);
      const finalCity: Coordinates = {
        cityName: resolved.cityName,
        countryName: resolved.countryName,
        latitude,
        longitude,
        timezone: resolved.timezone || nearest.timezone,
        region: resolved.region || nearest.region,
        subtitle: resolved.subtitle,
      };
      handleSelectCity(finalCity);
      return { ok: true };
    };

    const tryIpGeolocationFallback = async (): Promise<{ ok: boolean }> => {
      const endpoints = [
        '/__desktop_geoip',
        'https://ipinfo.io/json',
        'http://ip-api.com/json/',
      ];
      for (const url of endpoints) {
        try {
          const res = await fetch(url, { cache: 'no-store' });
          if (!res.ok) continue;
          const data = (await res.json()) as {
            ok?: boolean;
            latitude?: number | string;
            longitude?: number | string;
            lat?: number | string;
            lon?: number | string;
            loc?: string;
          };
          let lat = Number(data.latitude ?? data.lat);
          let lng = Number(data.longitude ?? data.lon);
          if ((!Number.isFinite(lat) || !Number.isFinite(lng)) && typeof data.loc === 'string') {
            const parts = data.loc.split(',');
            if (parts.length === 2) {
              lat = Number(parts[0]);
              lng = Number(parts[1]);
            }
          }
          if (Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0)) {
            return await applyCoords(lat, lng);
          }
        } catch {
          // try next endpoint
        }
      }
      return { ok: false };
    };

    const isDesktopShell =
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('desktop') === '1';

    if (isDesktopShell || !('geolocation' in navigator)) {
      return tryIpGeolocationFallback();
    }

    return new Promise((resolve) => {
      let settled = false;
      const fallbackTimer = window.setTimeout(async () => {
        if (settled) return;
        settled = true;
        const fallbackRes = await tryIpGeolocationFallback();
        resolve(fallbackRes);
      }, 2500);

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          if (settled) return;
          settled = true;
          window.clearTimeout(fallbackTimer);
          const { latitude, longitude } = pos.coords;
          const res = await applyCoords(latitude, longitude);
          resolve(res);
        },
        async (err) => {
          if (settled) return;
          settled = true;
          window.clearTimeout(fallbackTimer);
          console.warn('Hardware GPS unavailable, using IP geolocation fallback:', err);
          const fallbackRes = await tryIpGeolocationFallback();
          resolve(fallbackRes);
        },
        { enableHighAccuracy: true, timeout: 2400, maximumAge: 60000 }
      );
    });
  };

  const handleOpenSurah = useCallback(
    (surahNumber: number, ayahNumber?: number) => {
      setSelectedSurahNumber(surahNumber);
      setSelectedAyahNumber(ayahNumber ?? null);
      if (activeTab !== 'quran') {
        tabHistoryRef.current = [...tabHistoryRef.current.slice(-19), activeTab];
        setActiveTab('quran');
      }
    },
    [activeTab]
  );

  // Sync global native QuranAudioService state + handle tapping notification to jump straight to Surah
  useEffect(() => {
    if (!hasNativeQuranAudioBridge()) return;
    const refreshFromNative = () => setNativeAudioState(getNativeAudioState());
    refreshFromNative();
    const unsub = subscribeNativeAudioState((st) => {
      setNativeAudioState(st);
    });
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        refreshFromNative();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    const pending = consumeNativePendingOpen();
    if (pending) {
      setSelectedSurahNumber(pending.surahNumber);
      setSelectedAyahNumber(pending.ayahNumber);
      setActiveTab('quran');
    }
    const win = window as Window & {
      __nqOpenQuranFromNotif?: (surahNumber: number, ayahNumber: number) => void;
    };
    win.__nqOpenQuranFromNotif = (surahNum: number, ayahNum: number) => {
      setSelectedSurahNumber(surahNum);
      setSelectedAyahNumber(Math.max(1, ayahNum));
      setActiveTab('quran');
    };
    return () => {
      unsub();
      document.removeEventListener('visibilitychange', onVisibility);
      if (win.__nqOpenQuranFromNotif) {
        delete win.__nqOpenQuranFromNotif;
      }
    };
  }, []);

  useEffect(() => {
    if (!hasNativeQuranAudioBridge()) return;
    return subscribeAllAudioDownloads((map) => setDownloadMap(map));
  }, []);

  const [adjVersion, setAdjVersion] = useState(0);

  useEffect(() => {
    const onAdjChange = () => setAdjVersion((v) => v + 1);
    window.addEventListener('nq:prayer-adjustments-changed', onAdjChange);
    return () => window.removeEventListener('nq:prayer-adjustments-changed', onAdjChange);
  }, []);

  useEffect(() => {
    saveAlertPrefs(alertPrefs);
  }, [alertPrefs]);

  useEffect(() => {
    syncNativeAlertsAndWidget({
      currentCity,
      calcMethod,
      asrMethod,
      language,
      t,
      alertPrefs,
    });
  }, [currentCity, calcMethod, asrMethod, language, t, alertPrefs, adjVersion]);

  const handleToggleBookmark = useCallback((surahNumber: number, surahName: string, ayahNumber: number) => {
    const id = `${surahNumber}-${ayahNumber}`;
    setBookmarks(prev => {
      const exists = prev.some(b => b.id === id);
      if (exists) {
        return prev.filter(b => b.id !== id);
      } else {
        return [...prev, { id, surahNumber, surahName, ayahNumber, timestamp: Date.now() }];
      }
    });
  }, []);

  const handleRemoveBookmark = useCallback((id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const handleClearBookmarks = useCallback(() => {
    setBookmarks([]);
  }, []);

  const handleResetPreferences = () => {
    setCurrentCity(DEFAULT_CITY);
    setCalcMethod('Uzbekistan');
    setSelectedTranslation('uz_mansur');
    setLanguage('uz_lat');
    setBookmarks([]);
    try {
      localStorage.removeItem('nq_ramadan_fasts');
      localStorage.removeItem('nq_tasbih_stats');
      localStorage.removeItem('nq_tasbih_custom');
      localStorage.removeItem('nq_tasbih_prefs');
      localStorage.removeItem('nq_prayer_adjustments');
      localStorage.removeItem('nq_adhan_reciter');
      resetUserActivity();
      window.dispatchEvent(new Event('nq:prayer-adjustments-changed'));
    } catch {
      // Ignore storage error
    }
  };

  const dayKey = useDayKey();
  const prayerTimes = useMemo(
    () =>
      calculatePrayerTimes(
        new Date(),
        currentCity.latitude,
        currentCity.longitude,
        calcMethod,
        asrMethod,
        currentCity.timezone
      ),
    [dayKey, currentCity.latitude, currentCity.longitude, calcMethod, asrMethod, currentCity.timezone, adjVersion]
  );

  const handleSelectLanguage = (lang: AppLanguage) => {
    setLanguage(lang);
    const meta = LANGUAGE_OPTIONS.find((opt) => opt.id === lang);
    if (meta) {
      setSelectedTranslation(meta.defaultTranslation);
    }
  };

  const activeDownloading = useMemo(() => {
    const entries = Object.entries(downloadMap)
      .map(([k, v]) => ({ surahNumber: Number(k), ...v }))
      .filter((e) => e.status === 'downloading');
    return entries.length > 0 ? entries[0] : null;
  }, [downloadMap]);

  const showGlobalDownloadBanner = Boolean(
    activeDownloading && !(activeTab === 'quran' && isReadingSurah)
  );
  const showMiniPlayer = Boolean(
    nativeAudioState.active && !(activeTab === 'quran' && isReadingSurah)
  );
  const isSecondaryFooterTab = !['home', 'tasbih', 'quran', 'profile'].includes(activeTab);

  return (
    <>
      <AndroidShell
        activeTab={activeTab}
        activeSubTab={activeTab === 'azkar' ? `azkar:${azkarInitialSection}` : activeTab}
        hideBottomNav={activeTab === 'quran' && isReadingSurah}
        onTabChange={navigateToTab}
        onBack={handleBack}
        onSelectLanguage={handleSelectLanguage}
        topBanner={
          updateRelease && !isUpdateModalOpen && !showOnboarding ? (
            <button
              type="button"
              onClick={() => setIsUpdateModalOpen(true)}
              className={`w-full shrink-0 px-3.5 py-2 flex items-center justify-between gap-2 text-left border-b transition active:opacity-90 z-30 ${
                isDay
                  ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                  : 'bg-emerald-950/95 border-emerald-800/70 text-amber-300'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <ArrowDownCircle className="w-4 h-4 shrink-0 animate-bounce" />
                <span className="text-xs font-bold truncate">
                  {t.updates.newVersionAvailable} · v{updateRelease.versionName}
                </span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${
                  isDay ? 'bg-[#158509] text-white' : 'bg-amber-400 text-slate-950'
                }`}
              >
                {t.updates.updateNowBtn}
              </span>
            </button>
          ) : undefined
        }
        miniPlayer={
          showGlobalDownloadBanner || showMiniPlayer ? (
            <>
              {showGlobalDownloadBanner && activeDownloading && (
                <div
                  className={`shrink-0 px-3 ${
                    !showMiniPlayer && isSecondaryFooterTab ? 'pb-2 pt-1' : 'pt-1.5 pb-1'
                  } z-30`}
                >
                  <button
                    type="button"
                    onClick={() => handleOpenSurah(activeDownloading.surahNumber, 1)}
                    className={`w-full rounded-2xl border px-3 py-2 text-left transition ${
                      isDay
                        ? 'bg-white border-[#cde8c3] text-[#0c4703] shadow-xs'
                        : 'bg-slate-900 border-emerald-800/70 text-emerald-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs font-semibold mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <CloudDownload className="w-4 h-4 shrink-0 animate-pulse" />
                        <span className="truncate">
                          {t.features.quran} #{activeDownloading.surahNumber} · {t.updates.downloading}...
                        </span>
                      </div>
                      <span className="font-mono font-bold tabular-nums shrink-0">
                        {activeDownloading.pct}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-black/15 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-200 ${
                          isDay ? 'bg-[#158509]' : 'bg-amber-400'
                        }`}
                        style={{ width: `${Math.max(4, activeDownloading.pct)}%` }}
                      />
                    </div>
                  </button>
                </div>
              )}
              {showMiniPlayer && (
                <Suspense fallback={null}>
                  <QuranMiniPlayer
                    audioState={nativeAudioState}
                    showBottomSafePadding={isSecondaryFooterTab}
                    onOpenSurah={handleOpenSurah}
                  />
                </Suspense>
              )}
            </>
          ) : undefined
        }
      >
        {/* Render Tab Contents */}
        {activeTab === 'home' && (
          <HomeTab
            prayerTimes={prayerTimes}
            currentCity={currentCity}
            onOpenSurah={handleOpenSurah}
            onNavigateTab={navigateToTab}
            selectedTranslation={selectedTranslation}
            onOpenCitySelector={() => setIsCityModalOpen(true)}
            isOnboardingOpen={showOnboarding}
          />
        )}

        {activeTab !== 'home' && activeTab !== 'profile' && (
          <div
            className={
              activeTab === 'quran' && isReadingSurah
                ? 'flex-1 min-h-0 h-full flex flex-col'
                : activeTab === 'ramadan'
                ? 'nq-ramadan-day-scope'
                : undefined
            }
          >
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-16">
                  <div className="w-7 h-7 rounded-full border-2 border-[#158509]/30 border-t-[#158509] animate-spin" />
                </div>
              }
            >
              {activeTab === 'quran' && (
                <QuranTab
                  initialSurahNumber={selectedSurahNumber}
                  initialAyahNumber={selectedAyahNumber}
                  onCloseSurahDetail={() => {
                    setSelectedSurahNumber(null);
                    setSelectedAyahNumber(null);
                  }}
                  onSurahDetailActiveChange={setIsReadingSurah}
                  selectedTranslation={selectedTranslation}
                  onChangeTranslation={setSelectedTranslation}
                  bookmarks={bookmarks}
                  onToggleBookmark={handleToggleBookmark}
                />
              )}

              {activeTab === 'ramadan' && (
                <RamadanTab
                  currentCity={currentCity}
                  prayerTimes={prayerTimes}
                  selectedTranslation={selectedTranslation}
                  onOpenCitySelector={() => setIsCityModalOpen(true)}
                />
              )}

              {activeTab === 'prayer' && (
                <PrayerTab
                  currentCity={currentCity}
                  onSelectCity={setCurrentCity}
                  calcMethod={calcMethod}
                  onChangeCalcMethod={setCalcMethod}
                  asrMethod={asrMethod}
                  onDetectGPS={handleDetectGPS}
                  onOpenCitySelector={() => setIsCityModalOpen(true)}
                  alertPrefs={alertPrefs}
                  onChangeAlertPrefs={setAlertPrefs}
                />
              )}

              {activeTab === 'qibla' && (
                <QiblaTab
                  currentCity={currentCity}
                  onOpenCitySelector={() => setIsCityModalOpen(true)}
                />
              )}

              {activeTab === 'tasbih' && (
                <TasbihTab />
              )}

              {activeTab === 'azkar' && (
                <AzkarTab
                  onOpenSurah={handleOpenSurah}
                  onNavigateTab={navigateToTab}
                  initialSection={azkarInitialSection}
                />
              )}

              {activeTab === 'names' && (
                <NamesTab initialMode={namesInitialMode} />
              )}

              {activeTab === 'zakat' && (
                <ZakatTab />
              )}

              {activeTab === 'qazo' && (
                <QazoTab />
              )}

              {activeTab === 'guide' && (
                <PrayerGuideTab />
              )}

              {activeTab === 'masjids' && (
                <MasjidsTab
                  currentCity={currentCity}
                  onDetectGPS={handleDetectGPS}
                  onOpenCitySelector={() => setIsCityModalOpen(true)}
                  onOpenEhson={() => navigateToTab('ehson')}
                />
              )}

              {activeTab === 'ehson' && (
                <MasjidEhsonTab
                  currentCity={currentCity}
                  onOpenMasjidsMap={() => navigateToTab('masjids')}
                />
              )}

              {activeTab === 'juma' && (
                <JumaTab
                  prayerTimes={prayerTimes}
                  currentCity={currentCity}
                  onOpenSurah={handleOpenSurah}
                />
              )}

              {activeTab === 'quiz' && <QuizTab />}

              {activeTab === 'hifz' && <HifzTab />}

              {activeTab === 'life' && <LifeGuideTab />}

              {activeTab === 'fiqh' && <FiqhTab />}

              {activeTab === 'tajweed' && <TajweedTab />}

              {activeTab === 'seerah' && <SeerahTab />}

              {activeTab === 'wisdom' && <WisdomTab />}
            </Suspense>
          </div>
        )}

        {activeTab === 'profile' && (
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-16">
                <div className="w-7 h-7 rounded-full border-2 border-[#158509]/30 border-t-[#158509] animate-spin" />
              </div>
            }
          >
            <ProfileTab
              currentCity={currentCity}
              onOpenCitySelector={() => setIsCityModalOpen(true)}
              onDetectGPS={handleDetectGPS}
              calcMethod={calcMethod}
              onChangeCalcMethod={setCalcMethod}
              selectedTranslation={selectedTranslation}
              onChangeTranslation={setSelectedTranslation}
              onSelectLanguage={handleSelectLanguage}
              alertPrefs={alertPrefs}
              onChangeAlertPrefs={setAlertPrefs}
              todayFajrTime={prayerTimes.fajr}
              updateRelease={updateRelease}
              updateStatus={updateStatus}
              updateProgress={updateProgress}
              onCheckUpdate={() => handleCheckUpdate(false)}
              onStartUpdate={handleStartUpdate}
              bookmarks={bookmarks}
              onRemoveBookmark={handleRemoveBookmark}
              onClearBookmarks={handleClearBookmarks}
              onResetPreferences={handleResetPreferences}
              onOpenSurah={handleOpenSurah}
              onNavigateTab={navigateToTab}
              onOpenNamesQuiz={() => navigateToTab('names:quiz')}
            />
          </Suspense>
        )}
      </AndroidShell>

      {/* First-Run Onboarding Intro (lazy-loaded only for first-run users) */}
      {showOnboarding && (
        <Suspense fallback={null}>
          <OnboardingModal
            isOpen={showOnboarding}
            onFinish={() => {
              try {
                localStorage.setItem('nq_onboarding_done', '1');
                localStorage.removeItem('nq_onboarding_in_progress');
                localStorage.setItem('nq_city', JSON.stringify(currentCity));
              } catch {
                // Ignore storage error
              }
              setShowOnboarding(false);
            }}
            currentCity={currentCity}
            onSelectCity={handleSelectCity}
            onDetectGPS={handleDetectGPS}
            onSelectLanguage={handleSelectLanguage}
            alertPrefs={alertPrefs}
            onChangeAlertPrefs={setAlertPrefs}
          />
        </Suspense>
      )}

      {/* City Selector Modal (lazy-loaded on demand / hover prefetch) */}
      {isCityModalOpen && (
        <Suspense fallback={null}>
          <CitySelectorModal
            isOpen={isCityModalOpen}
            onClose={() => setIsCityModalOpen(false)}
            currentCity={currentCity}
            onSelectCity={handleSelectCity}
            onDetectGPS={handleDetectGPS}
          />
        </Suspense>
      )}

      {/* In-App Self-Update Modal */}
      {isUpdateModalOpen && updateRelease && (
        <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`w-full max-w-sm rounded-3xl border p-5 space-y-4 shadow-2xl ${
              isDay
                ? 'bg-white border-[#dde3ea] text-slate-900'
                : 'bg-slate-900 border-emerald-700/70 text-slate-100'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2.5 rounded-2xl ${
                    isDay ? 'bg-[#eef9ea] text-[#158509]' : 'bg-emerald-950 text-amber-400'
                  }`}
                >
                  <ArrowDownCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">{t.updates.newVersionAvailable}</h3>
                  <p className={`text-xs font-mono ${isDay ? 'text-[#0c4703]' : 'text-amber-300'}`}>
                    v{updateRelease.versionName} ({updateRelease.versionCode})
                  </p>
                </div>
              </div>

              {!updateRelease.forceUpdate && updateStatus !== 'downloading' && (
                <button
                  type="button"
                  onClick={handleDismissUpdateModal}
                  className={`p-1.5 rounded-xl ${
                    isDay ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'
                  }`}
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {updateRelease.forceUpdate && (
              <div
                className={`px-3 py-2 rounded-xl border text-[11px] font-semibold ${
                  isDay
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-amber-950/60 border-amber-500/40 text-amber-200'
                }`}
              >
                {language === 'ru'
                  ? 'Для продолжения работы необходимо обновить приложение до новой версии.'
                  : language === 'en'
                  ? 'Please update to the latest version to continue using Nurul Islam.'
                  : language === 'uz_cyr'
                  ? 'Давом этиш учун иловани янги талқинга янгилаш мажбурий.'
                  : 'Davom etish uchun ilovani yangi talqinga yangilash majburiy.'}
              </div>
            )}

            {getReleaseNoteText(updateRelease, language) && (
              <div
                className={`p-3 rounded-2xl border text-xs leading-relaxed ${
                  isDay ? 'bg-[#ecf1f5] border-[#dde3ea] text-slate-700' : 'bg-slate-950 border-emerald-900/50 text-slate-300'
                }`}
              >
                {getReleaseNoteText(updateRelease, language)}
              </div>
            )}

            {updateStatus === 'downloading' && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span>{t.updates.downloading}...</span>
                  <span>{updateProgress}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-black/15 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-200 ${
                      isDay ? 'bg-[#158509]' : 'bg-amber-400'
                    }`}
                    style={{ width: `${Math.max(4, updateProgress)}%` }}
                  />
                </div>
              </div>
            )}

            {updateStatus === 'needs_permission' && (
              <p className="text-xs text-amber-600 dark:text-amber-300 font-medium">
                {isDesktopRpmUpdaterSupported()
                  ? language === 'ru'
                    ? 'Для установки обновления введите пароль администратора в системном окне.'
                    : language === 'en'
                    ? 'Administrator password is required in the system prompt to install the RPM update.'
                    : language === 'uz_cyr'
                    ? 'Янгилашни ўрнатиш учун тизим ойнасида администратор паролини киритинг.'
                    : "Yangilashni o'rnatish uchun tizim oynasida administrator parolini kiriting."
                  : t.updates.needsPerm}
              </p>
            )}

            {updateStatus === 'installing' && (
              <p className={`text-xs font-semibold ${isDay ? 'text-[#0c4703]' : 'text-emerald-300'}`}>
                {isDesktopRpmUpdaterSupported()
                  ? language === 'ru'
                    ? 'Установка обновления RPM... Введите пароль администратора; после установки приложение перезапустится автоматически.'
                    : language === 'en'
                    ? 'Installing RPM update... Enter your password in the system prompt; the app will restart automatically.'
                    : language === 'uz_cyr'
                    ? 'RPM янгиланиш ўрнатилмоқда... Тизим ойнасида паролни киритинг, илова автоматик қайта очилади.'
                    : "RPM yangilanish o'rnatilmoqda... Tizim oynasida parolni kiriting, ilova avtomatik qayta ochiladi."
                  : t.updates.installing}
              </p>
            )}

            {updateStatus === 'error' && (
              <p className="text-xs text-rose-500 font-medium">{t.updates.errorMsg}</p>
            )}

            <div className="flex items-center gap-2 pt-1">
              {!updateRelease.forceUpdate && (
                <button
                  type="button"
                  onClick={handleDismissUpdateModal}
                  disabled={updateStatus === 'downloading' || updateStatus === 'installing'}
                  className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold transition disabled:opacity-40 ${
                    isDay
                      ? 'bg-[#ecf1f5] border-[#dde3ea] text-slate-700'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  {t.updates.laterBtn}
                </button>
              )}

              <button
                type="button"
                onClick={handleStartUpdate}
                disabled={updateStatus === 'downloading' || updateStatus === 'installing'}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition disabled:opacity-50 ${
                  isDay
                    ? 'bg-[#158509] hover:bg-[#0c5007] text-white'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                }`}
              >
                {updateStatus === 'downloading'
                  ? `${updateProgress}%`
                  : updateStatus === 'installing'
                  ? t.updates.installing
                  : t.updates.updateNowBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
