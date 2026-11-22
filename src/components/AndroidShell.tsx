import React, { useState, useRef, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import {
  ArrowLeft,
  Home,
  User,
  Smartphone,
  Monitor,
  Battery,
  Wifi,
  Signal,
  Sun,
  Moon,
  Globe,
  Check,
  GraduationCap,
  Scale,
  Compass,
  Sparkles,
} from 'lucide-react';
import {
  AllahNamesIcon,
  DuaHandsIcon,
  MasjidDomeIcon,
  MasjidEhsonIcon,
  MushafIcon,
  PrayerTimeIcon,
  QiblaKaabaIcon,
  RamadanLanternIcon,
  WuduNamozGuideIcon,
  ZikrBeadsIcon,
} from './icons/IslamicFeatureIcons';
import { PWAInstallButton } from './PWAInstallButton';
import { OfflineIndicator } from './OfflineIndicator';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage, LANGUAGE_OPTIONS } from '../contexts/LanguageContext';
import { AppLanguage } from '../types';
import { prefetchTab } from '../utils/tabLoaders';

interface AndroidShellProps {
  children: React.ReactNode;
  activeTab: string;
  activeSubTab?: string;
  onTabChange: (tabId: string) => void;
  onBack?: () => void;
  hideBottomNav?: boolean;
  onSelectLanguage?: (lang: AppLanguage) => void;
  topBanner?: React.ReactNode;
  miniPlayer?: React.ReactNode;
}

const PRIMARY_BOTTOM_TABS = new Set(['home', 'tasbih', 'quran', 'profile']);

export const AndroidShell: React.FC<AndroidShellProps> = ({
  children,
  activeTab,
  activeSubTab,
  onTabChange,
  onBack,
  hideBottomNav = false,
  onSelectLanguage,
  topBanner,
  miniPlayer,
}) => {
  const { isDay, toggleTheme } = useTheme();
  const { language, setLanguage, meta, t } = useLanguage();
  const isDesktopApp =
    typeof window !== 'undefined' &&
    (new URLSearchParams(window.location.search).get('desktop') === '1' ||
      Boolean((window as Window & { __NQ_LINUX_DESKTOP__?: boolean }).__NQ_LINUX_DESKTOP__));
  const isNative = Capacitor.isNativePlatform() || isDesktopApp;
  const [isPhoneFrame, setIsPhoneFrame] = useState(!isNative);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLangMenuOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isLangMenuOpen]);

  const showPhoneFrame = !isNative && isPhoneFrame;
  const currentTimeStr = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const tabTitleMap = t.tabTitles as Record<string, string>;
  const activeTitle = tabTitleMap[activeTab] || t.appTitle;
  const isSecondaryFeature = !PRIMARY_BOTTOM_TABS.has(activeTab);
  const shouldHideBottomNav = Boolean(hideBottomNav || isSecondaryFeature);

  // Clean 4-button Material 3 Bottom Navigation Bar (Mobile)
  const bottomNavItems = [
    { id: 'home', label: t.nav.home, icon: Home, badge: '' },
    { id: 'tasbih', label: t.nav.tasbih, icon: ZikrBeadsIcon, badge: '' },
    { id: 'quran', label: t.nav.quran, icon: MushafIcon, badge: '114' },
    { id: 'profile', label: t.nav.profile, icon: User, badge: '' },
  ];

  // Desktop Left Sidebar Navigation Items (2-Column Grid — All 26 items visible at once)
  const desktopSidebarItems = [
    { id: 'home', label: t.nav.home, icon: Home, imageSrc: '', badge: '24' },
    { id: 'quran', label: t.features.quran, icon: MushafIcon, imageSrc: '/icons/home/quran.webp', badge: '114' },
    { id: 'prayer', label: t.features.prayer, icon: PrayerTimeIcon, imageSrc: '/icons/home/prayer.webp', badge: '' },
    { id: 'ramadan', label: t.features.ramadan, icon: RamadanLanternIcon, imageSrc: '/icons/home/ramadan.webp', badge: '' },
    { id: 'qibla', label: t.features.qibla, icon: QiblaKaabaIcon, imageSrc: '/icons/home/qibla.webp', badge: '' },
    { id: 'tasbih', label: t.features.tasbih, icon: ZikrBeadsIcon, imageSrc: '/icons/home/tasbih.webp', badge: '' },
    {
      id: 'guide',
      label: language === 'ru' ? 'Тахарат' : language === 'en' ? 'Wudu & Prayer' : language === 'uz_cyr' ? 'Таҳорат' : 'Tahorat & Namoz',
      icon: WuduNamozGuideIcon,
      imageSrc: '/icons/home/guide.webp',
      badge: '',
    },
    { id: 'masjids', label: t.features.masjids, icon: MasjidDomeIcon, imageSrc: '/icons/home/masjids.webp', badge: '' },
    { id: 'juma', label: t.features.juma, icon: Sparkles, imageSrc: '/icons/home/juma.webp', badge: '' },
    { id: 'names', label: t.features.names, icon: AllahNamesIcon, imageSrc: '/icons/home/names.webp', badge: '99' },
    { id: 'zakat', label: t.features.zakat, icon: Scale, imageSrc: '/icons/home/zakat.webp', badge: '' },
    { id: 'qazo', label: t.features.qazo, icon: PrayerTimeIcon, imageSrc: '/icons/home/qazo.webp', badge: '' },
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
      icon: MushafIcon,
      imageSrc: '/icons/home/hadith.webp',
      badge: '42',
    },
    {
      id: 'azkar:ayats',
      label: language === 'ru' ? 'Аяты' : language === 'en' ? 'Ayahs' : language === 'uz_cyr' ? 'Оятлар' : 'Oyatlar',
      icon: MushafIcon,
      imageSrc: '/icons/home/ayats.webp',
      badge: '45',
    },
    {
      id: 'azkar:farz',
      label: language === 'ru' ? '40 Фардов' : language === 'en' ? '40 Fards' : language === 'uz_cyr' ? '40 Фарз' : '40 Farz',
      icon: Scale,
      imageSrc: '/icons/home/farz.webp',
      badge: '40',
    },
    {
      id: 'azkar:niyat',
      label: language === 'ru' ? 'Нияты' : language === 'en' ? 'Intentions' : language === 'uz_cyr' ? 'Ниятлар' : 'Niyatlar',
      icon: DuaHandsIcon,
      imageSrc: '/icons/home/niyat.webp',
      badge: '19',
    },
    {
      id: 'ehson',
      label: language === 'ru' ? 'Эхсон' : language === 'en' ? 'Masjid Ehson' : language === 'uz_cyr' ? 'Масжид Эҳсон' : 'Masjid Ehson',
      icon: MasjidEhsonIcon,
      imageSrc: '/icons/home/ehson.webp',
      badge: '',
    },
    {
      id: 'quiz',
      label: language === 'ru' ? 'Викторина' : language === 'en' ? 'Quiz' : language === 'uz_cyr' ? 'Викторина' : 'Viktorina',
      icon: GraduationCap,
      imageSrc: '/icons/home/quiz.webp',
      badge: '120',
    },
    {
      id: 'hifz',
      label: language === 'ru' ? 'Хифз сур' : language === 'en' ? 'Hifz' : language === 'uz_cyr' ? 'Ёдлаш (Ҳифз)' : 'Yodlash (Hifz)',
      icon: MushafIcon,
      imageSrc: '/icons/home/hifz.webp',
      badge: '18',
    },
    {
      id: 'life',
      label: language === 'ru' ? 'Важные дуа' : language === 'en' ? 'Life Guide' : language === 'uz_cyr' ? 'Ҳаётий Дуо' : 'Hayotiy Duo',
      icon: DuaHandsIcon,
      imageSrc: '/icons/home/life.webp',
      badge: '8',
    },
    {
      id: 'fiqh',
      label: language === 'ru' ? 'Фикх Q&A' : language === 'en' ? 'Fiqh Q&A' : language === 'uz_cyr' ? 'Савол-Жавоб' : 'Savol-Javob',
      icon: Scale,
      imageSrc: '/icons/home/fiqh.webp',
      badge: '19',
    },
    {
      id: 'tajweed',
      label: language === 'ru' ? 'Таджвид' : language === 'en' ? 'Tajweed' : language === 'uz_cyr' ? 'Алифбо & Тажвид' : 'Alifbo & Tajvid',
      icon: Sparkles,
      imageSrc: '/icons/home/tajweed.webp',
      badge: '10',
    },
    {
      id: 'seerah',
      label: language === 'ru' ? 'Сира & Пророки' : language === 'en' ? 'Seerah' : language === 'uz_cyr' ? 'Сийрат & Қисса' : 'Siyrat & Qissa',
      icon: Compass,
      imageSrc: '/icons/home/seerah.webp',
      badge: '25',
    },
    { id: 'profile', label: t.nav.profile, icon: User, imageSrc: '', badge: '' },
  ];

  // ===========================================================================
  // NATIVE LINUX DESKTOP WIDESCREEN EDITION (?desktop=1)
  // ===========================================================================
  if (isDesktopApp) {
    return (
      <div
        className={`h-screen w-screen overflow-hidden flex selection:bg-[#158509] selection:text-white transition-colors duration-200 ${
          isDay
            ? 'bg-gradient-to-br from-[#e4efe1] via-[#edf3ec] to-[#e1ece0] text-slate-900'
            : 'bg-gradient-to-br from-[#03110c] via-[#061a13] to-[#020c09] text-slate-100'
        }`}
      >
        {/* Left Rich 3D Studio 2-Column Sidebar Rail (All 26 items visible at once) */}
        <aside
          className={`w-80 shrink-0 h-full flex flex-col border-r select-none shadow-lg z-20 ${
            isDay
              ? 'bg-white/95 border-[#c9dec4] text-slate-800'
              : 'bg-[#061813]/95 border-emerald-900/70 text-slate-100'
          }`}
        >
          {/* App Brand Header */}
          <div
            className={`px-3.5 py-2.5 flex items-center justify-between border-b shrink-0 ${
              isDay
                ? 'bg-gradient-to-r from-[#0b4a06] via-[#158509] to-[#1b9c21] border-[#0c5007] text-white'
                : 'bg-gradient-to-r from-[#041710] via-[#092b1d] to-[#051a12] border-emerald-900/70 text-white'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src="/pwa-192x192.png"
                alt={t.appTitle}
                className="w-8 h-8 rounded-xl border border-[#fde68a]/60 object-cover shrink-0 shadow-xs"
              />
              <div className="min-w-0">
                <div className="font-display text-base font-extrabold tracking-tight leading-none text-white truncate">
                  {t.appTitle}
                </div>
                <div className="text-[9.5px] font-bold text-[#fde68a] mt-0.5">
                  ✦ Desktop Edition · 24 bo&apos;lim
                </div>
              </div>
            </div>
          </div>

          {/* 2-Column × 13-Row Grid — All 26 Items Fit on Screen simultaneously */}
          <div className="flex-1 min-h-0 p-2 grid grid-cols-2 grid-rows-[repeat(13,minmax(0,1fr))] gap-1.5 overflow-y-auto">
            {desktopSidebarItems.map((item) => {
              const effectiveTab = activeSubTab || activeTab;
              const isActive =
                effectiveTab === item.id ||
                (activeTab === 'azkar' && effectiveTab === 'azkar:hub' && item.id === 'azkar:duas');
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => prefetchTab(item.id)}
                  onFocus={() => prefetchTab(item.id)}
                  onClick={() => onTabChange(item.id)}
                  className={`relative w-full h-full min-h-[34px] flex items-center gap-2 px-2 py-1 rounded-xl border text-left transition group ${
                    isActive
                      ? isDay
                        ? 'bg-gradient-to-r from-[#0c5007] to-[#158509] border-[#0c4703] text-white shadow-xs nq-keep-dark'
                        : 'bg-gradient-to-r from-amber-400 to-amber-500 border-amber-300 text-slate-950 shadow-xs'
                      : isDay
                      ? 'bg-[#f8fcf7] border-[#d6e8d2] text-slate-800 hover:bg-[#eef9ea] hover:border-[#158509]/60'
                      : 'bg-emerald-950/45 border-emerald-900/60 text-slate-200 hover:bg-emerald-950 hover:border-amber-400/60'
                  }`}
                >
                  {item.imageSrc ? (
                    <img
                      src={item.imageSrc}
                      alt={item.label}
                      className="w-6 h-6 object-contain shrink-0 drop-shadow-2xs group-hover:scale-105 transition"
                    />
                  ) : (
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                        isActive
                          ? isDay
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-950/15 text-slate-950'
                          : isDay
                          ? 'bg-[#eef9ea] text-[#158509]'
                          : 'bg-emerald-950 text-amber-300'
                      }`}
                    >
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <span className="text-[11px] font-extrabold leading-tight truncate flex-1">
                    {item.label}
                  </span>

                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.2 rounded-md text-[8.5px] font-mono font-extrabold shrink-0 ${
                        isActive
                          ? isDay
                            ? 'bg-white/25 text-white'
                            : 'bg-slate-950/20 text-slate-950'
                          : isDay
                          ? 'bg-[#eef9ea] text-[#0c4703]'
                          : 'bg-emerald-950 text-amber-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Compact Bottom Sidebar Controls: Language & Day/Night Theme */}
          <div
            className={`p-2 border-t flex items-center gap-1.5 shrink-0 ${
              isDay ? 'border-[#d5e6d0] bg-[#f6fbf4]' : 'border-emerald-900/50 bg-slate-950/70'
            }`}
          >
            <div className="grid grid-cols-4 gap-1 flex-1">
              {LANGUAGE_OPTIONS.map((opt) => {
                const isSelected = language === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      if (onSelectLanguage) onSelectLanguage(opt.id);
                      else setLanguage(opt.id);
                    }}
                    className={`py-1 px-1 rounded-lg text-[10px] font-extrabold border truncate transition ${
                      isSelected
                        ? isDay
                          ? 'bg-[#158509] border-[#158509] text-white nq-keep-dark'
                          : 'bg-amber-400 border-amber-400 text-slate-950'
                        : isDay
                        ? 'bg-white border-[#cde5c7] text-slate-700 hover:border-[#158509]'
                        : 'bg-slate-900 border-emerald-900/60 text-slate-300'
                    }`}
                  >
                    {opt.shortCode}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className={`py-1 px-2.5 rounded-lg text-[10.5px] font-extrabold border inline-flex items-center gap-1 shrink-0 transition ${
                isDay
                  ? 'bg-white border-[#cde5c7] text-[#0c4703] hover:border-[#158509]'
                  : 'bg-slate-900 border-emerald-800/70 text-amber-300'
              }`}
            >
              {isDay ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#158509]" />
                  <span>{t.day}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.night}</span>
                </>
              )}
            </button>
          </div>
        </aside>

        {/* Main Right Widescreen Desktop Workspace */}
        <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
          {/* Rich Emerald Desktop Top Header Bar */}
          <header
            className={`px-6 py-3 border-b flex items-center justify-between gap-4 shrink-0 shadow-xs ${
              isDay
                ? 'bg-white/95 border-[#c9dec4] text-slate-900'
                : 'bg-[#072119]/95 border-emerald-900/60 text-white'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {activeTab !== 'home' && (
                <button
                  type="button"
                  onClick={() => (onBack ? onBack() : onTabChange('home'))}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-extrabold transition active:scale-95 ${
                    isDay
                      ? 'bg-[#eef9ea] border-[#b7e2ad] text-[#0c4703] hover:bg-[#e1f5da]'
                      : 'bg-emerald-950 border-emerald-800 text-amber-300'
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t.backLabel}</span>
                </button>
              )}
              <h1
                className={`font-display text-lg font-extrabold tracking-tight truncate ${
                  isDay ? 'text-[#0c4703]' : 'text-white'
                }`}
              >
                {activeTitle}
              </h1>
            </div>

            <div
              className={`px-3 py-1 rounded-full text-xs font-mono font-extrabold border ${
                isDay
                  ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                  : 'bg-emerald-950 border-emerald-800 text-amber-300'
              }`}
            >
              {currentTimeStr}
            </div>
          </header>

          {topBanner}

          {/* Centered Desktop Stage with Proper Height Forwarding for Virtualized Readers (QuranTab / TasbihTab) */}
          <div className="flex-1 min-h-0 flex flex-col items-center overflow-hidden px-6 py-4">
            <div
              className={`w-full ${
                activeTab === 'home' ? 'max-w-5xl' : 'max-w-[780px]'
              } flex-1 min-h-0 flex flex-col rounded-3xl border shadow-xl overflow-hidden ${
                isDay
                  ? 'bg-[#f4f8f3] border-[#c5e0bf]'
                  : 'bg-slate-950/95 border-emerald-900/70'
              }`}
            >
              <div
                className={`flex-1 min-h-0 h-full no-scrollbar relative ${
                  activeTab === 'home'
                    ? 'flex flex-col overflow-y-auto p-5'
                    : activeTab === 'tasbih'
                    ? 'flex flex-col overflow-hidden px-3.5 pt-2.5 pb-2.5'
                    : hideBottomNav
                    ? 'flex flex-col overflow-hidden px-3.5 pt-0 pb-0'
                    : 'overflow-y-auto px-3.5 pt-2.5 pb-4'
                }`}
              >
                {children}
              </div>
            </div>
          </div>

          {miniPlayer}
          <OfflineIndicator />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-start selection:bg-[#158509] selection:text-white transition-colors duration-200 ${
        isDay ? 'bg-[#ecf1f5] text-slate-900' : 'bg-slate-950 text-slate-100'
      } ${isNative ? 'p-0 h-[100dvh] overflow-hidden' : 'p-0 sm:p-4'}`}
    >
      {/* Top Device Preview Mode Toggle Toolbar (Web Preview Only) */}
      {!isNative && (
        <header
          className={`w-full max-w-4xl py-2 px-4 flex items-center justify-between text-xs border-b mb-2 ${
            isDay
              ? 'text-slate-600 border-slate-300/70'
              : 'text-slate-400 border-slate-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#158509] animate-pulse" />
            <span className={`font-semibold ${isDay ? 'text-slate-900' : 'text-slate-200'}`}>
              Nurul Islam
            </span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full border ${
                isDay
                  ? 'text-[#0c4703] bg-[#eef9ea] border-[#c5e8bc]'
                  : 'text-emerald-400 bg-emerald-950/80 border-emerald-800/40'
              }`}
            >
              Android App
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <PWAInstallButton />

            <div
              className={`p-1 rounded-xl flex items-center border ${
                isDay ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
              }`}
            >
              <button
                onClick={() => setIsPhoneFrame(true)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  isPhoneFrame
                    ? 'bg-[#158509] text-white shadow'
                    : isDay
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Phone Frame</span>
              </button>

              <button
                onClick={() => setIsPhoneFrame(false)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  !isPhoneFrame
                    ? 'bg-[#158509] text-white shadow'
                    : isDay
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Full Responsive</span>
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Container: Android Frame or Fullscreen */}
      <main
        className={`w-full transition-colors duration-200 relative flex flex-col ${
          isDay ? 'bg-[#ecf1f5]' : 'bg-slate-950'
        } ${
          showPhoneFrame
            ? `max-w-[430px] min-h-[880px] h-[92vh] max-h-[920px] rounded-[48px] border-[10px] overflow-hidden shadow-2xl ${
                isDay
                  ? 'border-slate-800 shadow-slate-400/40 ring-1 ring-slate-300'
                  : 'border-slate-800 shadow-emerald-950/70 ring-1 ring-slate-700/50'
              }`
            : isNative
            ? 'h-full overflow-hidden'
            : 'max-w-2xl min-h-screen'
        }`}
      >
        {/* Android Status Bar (Shown in Phone Frame Mode) */}
        {showPhoneFrame && (
          <div
            className={`h-9 w-full px-7 flex items-center justify-between text-xs select-none z-30 shrink-0 text-white ${
              isDay ? 'bg-[#0c4703]' : 'bg-[#051f05]'
            }`}
          >
            <span className="font-semibold text-xs tracking-tight">{currentTimeStr}</span>

            {/* Center Camera Punch-hole Notch */}
            <div className="w-4 h-4 rounded-full bg-black border border-slate-800 shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
            </div>

            <div className="flex items-center gap-2">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <div className="flex items-center gap-1 text-[11px] tabular-nums">
                <span>98%</span>
                <Battery className="w-4 h-4 text-[#d0f39f]" />
              </div>
            </div>
          </div>
        )}

        {/* Solid Deep Islamic Green App Top Bar */}
        <div
          style={
            isNative
              ? {
                  paddingTop:
                    'calc(max(env(safe-area-inset-top, 0px), var(--safe-area-inset-top, 0px)) + 16px)',
                }
              : undefined
          }
          className={`w-full px-4 pb-3 ${!isNative ? 'pt-3' : ''} flex items-center justify-between gap-2 shrink-0 z-30 border-b ${
            isDay
              ? 'bg-[#0c4703] border-[#1a6810] text-white shadow-sm'
              : 'bg-[#051f05] border-emerald-950 text-white'
          }`}
        >
          {isSecondaryFeature ? (
            <div className="relative flex items-center justify-between min-w-0 flex-1">
              <button
                type="button"
                onClick={() => (onBack ? onBack() : onTabChange('home'))}
                className="relative z-10 flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/12 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold transition active:scale-95 shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t.backLabel}</span>
              </button>

              <span className="absolute left-1/2 -translate-x-1/2 font-display text-[15px] font-semibold tracking-tight text-white truncate max-w-[56%] text-center pointer-events-none">
                {activeTitle}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 min-w-0">
              <img
                src="/pwa-192x192.png"
                alt={t.appTitle}
                className="w-7 h-7 rounded-xl border border-white/20 object-cover shrink-0 shadow-xs"
              />
              <span className="font-display text-[17px] font-semibold tracking-tight text-white truncate">
                {t.appTitle}
              </span>
            </div>
          )}

          {!isSecondaryFeature && !hideBottomNav && (
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Compact App Language Switcher */}
              <div ref={langMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsLangMenuOpen((prev) => !prev)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/14 hover:bg-white/22 border border-white/20 text-white text-xs font-semibold transition active:scale-95"
                  aria-label="Change App Language"
                >
                  <Globe className="w-3.5 h-3.5 text-[#d0f39f]" />
                  <span>{meta.shortCode}</span>
                </button>

                {isLangMenuOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-48 rounded-2xl border shadow-xl overflow-hidden z-50 ${
                      isDay
                        ? 'bg-white border-[#dde3ea] text-slate-800'
                        : 'bg-slate-900 border-emerald-800/80 text-slate-100'
                    }`}
                  >
                    {LANGUAGE_OPTIONS.map((opt) => {
                      const isSelected = language === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            if (onSelectLanguage) {
                              onSelectLanguage(opt.id);
                            } else {
                              setLanguage(opt.id);
                            }
                            setIsLangMenuOpen(false);
                          }}
                          className={`w-full px-3.5 py-2.5 text-left text-xs font-medium flex items-center justify-between transition ${
                            isSelected
                              ? isDay
                                ? 'bg-[#eef9ea] text-[#0c4703] font-semibold'
                                : 'bg-emerald-950 text-amber-300 font-semibold'
                              : isDay
                              ? 'hover:bg-slate-50 text-slate-700'
                              : 'hover:bg-slate-800 text-slate-200'
                          }`}
                        >
                          <span>{opt.nativeLabel}</span>
                          {isSelected && (
                            <Check
                              className={`w-3.5 h-3.5 ${
                                isDay ? 'text-[#158509]' : 'text-amber-400'
                              }`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/14 hover:bg-white/22 border border-white/20 text-white text-xs font-medium transition active:scale-95 shrink-0"
                aria-label="Toggle Day and Night theme"
              >
                {isDay ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-[#d0f39f]" />
                    <span>{t.day}</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-[#d0f39f]" />
                    <span>{t.night}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {topBanner}

        {/* Viewport Content */}
        <div
          style={
            isNative && isSecondaryFeature
              ? {
                  paddingBottom:
                    'calc(1rem + max(env(safe-area-inset-bottom, 0px), var(--safe-area-inset-bottom, 0px)))',
                }
              : undefined
          }
          className={`flex-1 min-h-0 no-scrollbar relative ${
            activeTab === 'home'
              ? 'flex flex-col overflow-y-auto'
              : activeTab === 'tasbih'
              ? 'flex flex-col overflow-hidden px-3.5 pt-2.5 pb-2.5'
              : hideBottomNav
              ? 'flex flex-col overflow-hidden px-3.5 pt-0 pb-0'
              : 'overflow-y-auto px-3.5 pt-2.5 pb-4'
          }`}
        >
          {children}
        </div>

        {miniPlayer}

        {/* Modern Elevated 4-Button Bottom Navigation Dock */}
        {!shouldHideBottomNav && (
          <nav
            style={
              isNative
                ? {
                    paddingBottom:
                      'calc(max(env(safe-area-inset-bottom, 0px), var(--safe-area-inset-bottom, 0px)) + 10px)',
                  }
                : undefined
            }
            className={`shrink-0 rounded-t-3xl border-t px-3 pt-2.5 ${
              !isNative ? 'pb-2.5' : ''
            } flex items-stretch gap-2 z-40 select-none transition-colors ${
              isDay
                ? 'bg-white border-[#d6dfe8] shadow-[0_-8px_26px_rgba(12,71,3,0.09)]'
                : 'bg-slate-950 border-emerald-900/70 shadow-[0_-8px_26px_rgba(0,0,0,0.45)]'
            }`}
          >
            {bottomNavItems.map((item) => {
              const isActive = activeTab === item.id;
              const IconComp = item.icon;

              return (
                <button
                  key={item.id}
                  onTouchStart={() => prefetchTab(item.id)}
                  onMouseEnter={() => prefetchTab(item.id)}
                  onClick={() => onTabChange(item.id)}
                  className={`relative flex-1 flex flex-col items-center justify-center py-2 px-1.5 rounded-2xl border transition-all duration-200 active:scale-95 ${
                    isActive
                      ? isDay
                        ? 'bg-gradient-to-b from-[#158509] to-[#0c5007] border-[#0c4703] text-white shadow-md shadow-[#158509]/25'
                        : 'bg-gradient-to-b from-amber-400 to-amber-500 border-amber-300 text-slate-950 shadow-md shadow-amber-500/25'
                      : isDay
                      ? 'bg-[#f1f5f9] border-[#dbe3ec] text-slate-800 hover:bg-[#e7eff6] hover:border-[#c3d3c0]'
                      : 'bg-slate-900/95 border-emerald-900/60 text-slate-100 hover:bg-slate-800'
                  }`}
                >
                  <IconComp
                    strokeWidth={isActive ? 2.4 : 2.05}
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive
                        ? 'scale-105'
                        : isDay
                        ? 'text-[#0c4703]'
                        : 'text-emerald-300'
                    }`}
                  />

                  <span
                    className={`text-[11.5px] mt-1 leading-none tracking-tight truncate max-w-full ${
                      isActive
                        ? 'font-bold'
                        : isDay
                        ? 'font-semibold text-slate-800'
                        : 'font-semibold text-slate-200'
                    }`}
                  >
                    {item.label}
                  </span>

                  {item.badge && (
                    <span
                      className={`absolute top-1 right-1.5 text-[9px] font-bold rounded-full px-1.5 py-0.2 leading-tight shadow-xs ${
                        isActive
                          ? isDay
                            ? 'bg-[#d0f39f] text-[#0c4703]'
                            : 'bg-slate-950 text-amber-300'
                          : isDay
                          ? 'bg-[#0c4703] text-white'
                          : 'bg-emerald-800 text-amber-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        )}

        {/* Android Gesture Bar */}
        {showPhoneFrame && (
          <div
            className={`h-3 w-full flex items-center justify-center shrink-0 z-50 ${
              isDay ? 'bg-white' : 'bg-slate-950'
            }`}
          >
            <div
              className={`w-32 h-1 rounded-full ${
                isDay ? 'bg-slate-300' : 'bg-slate-600/70'
              }`}
            />
          </div>
        )}
      </main>

      <OfflineIndicator />
    </div>
  );
};
