import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDownCircle,
  Bell,
  BookOpen,
  Bookmark,
  Check,
  ChevronDown,
  ChevronRight,
  Download,
  Flame,
  Globe,
  GraduationCap,
  Headphones,
  Info,
  LayoutGrid,
  Lock,
  MapPin,
  Moon,
  Navigation,
  Pencil,
  RefreshCw,
  RotateCcw,
  Sliders,
  Smartphone,
  Sparkles,
  Sun,
  Trash2,
  Trophy,
  Upload,
  Volume2,
  X,
} from 'lucide-react';
import { AppLanguage, Bookmark as BookmarkType, CalcMethod, Coordinates, TranslationId } from '../../types';
import { TRANSLATION_OPTIONS } from './QuranTab';
import { getLocalizedSurahMeta } from '../../data/surahs';
import { getCalcMethodOptions, getLocalizedCityLabel } from '../../utils/prayerTimes';
import {
  AlertPrayerKey,
  PrayerAlertPrefs,
  PrayerAlertSoundMode,
  checkNativeNotificationPermission,
  isNativeAndroidBridgeAvailable,
  pinPrayerHomeWidget,
  playPrayerChimePreview,
  requestNativeNotificationPermission,
  triggerTestPrayerAlert,
} from '../../utils/nativePrayerBridge';
import {
  RemoteAppRelease,
  UPDATE_SITE_URL,
  UpdateDownloadStatus,
  getLocalAppVersion,
  getReleaseNoteText,
  isNativeUpdaterSupported,
} from '../../utils/appUpdater';
import { downloadUserBackupJson, restoreUserBackupJson } from '../../utils/backupData';
import {
  ACTIVITY_UPDATED_EVENT,
  AchievementBadge,
  computeActivitySummary,
  formatListeningDuration,
  getUserHandle,
  setUserHandle,
} from '../../utils/userActivity';
import { useTheme } from '../../contexts/ThemeContext';
import { LANGUAGE_OPTIONS, useLanguage } from '../../contexts/LanguageContext';

interface ProfileTabProps {
  currentCity: Coordinates;
  onOpenCitySelector: () => void;
  onDetectGPS: () => Promise<{ ok: boolean }> | void;
  calcMethod: CalcMethod;
  onChangeCalcMethod: (method: CalcMethod) => void;
  selectedTranslation: TranslationId;
  onChangeTranslation: (tr: TranslationId) => void;
  onSelectLanguage?: (lang: AppLanguage) => void;
  alertPrefs: PrayerAlertPrefs;
  onChangeAlertPrefs: (next: PrayerAlertPrefs) => void;
  todayFajrTime: string;
  updateRelease: RemoteAppRelease | null;
  updateStatus: UpdateDownloadStatus;
  updateProgress: number;
  onCheckUpdate: () => void;
  onStartUpdate: () => void;
  bookmarks: BookmarkType[];
  onRemoveBookmark: (id: string) => void;
  onClearBookmarks: () => void;
  onResetPreferences: () => void;
  onOpenSurah: (surahNumber: number, ayahNumber?: number) => void;
  onNavigateTab: (tabId: string) => void;
  onOpenNamesQuiz: () => void;
}

const PROFILE_UI: Record<
  AppLanguage,
  {
    progressTab: string;
    settingsTab: string;
    nextLevelLabel: (lvl: number) => string;
    asmaCardTitle: string;
    asmaMasteredAll: string;
    asmaMoreNeeded: (rank: string, count: number) => string;
    startQuizBtn: string;
    ilmCardTitle: string;
    ilmMoreNeeded: (rank: string, count: number) => string;
    ilmMasteredAll: string;
    ilmPlayBtn: string;
    tasbihSub: string;
    quranSub: string;
    badgesTitle: string;
    badgeEarned: string;
    generalGroup: string;
    prayerGroup: string;
    advancedCalcTitle: string;
    hanafiAutoNote: string;
    onLabel: string;
    offLabel: string;
    showAllBookmarks: (n: number) => string;
    showLessBookmarks: string;
    saveHandleBtn: string;
    editHandleAria: string;
    widgetFull: string;
    widgetStrip: string;
    widgetRamadan: string;
    shortLang: Record<AppLanguage, string>;
    webAlertsTitle: string;
    webAlertsDesc: string;
    downloadApkBtn: string;
    webAutoUpdateSub: string;
    refreshWebBtn: string;
    backupTitle: string;
    backupDesc: string;
    exportBtn: string;
    importBtn: string;
    exportSuccess: (n: number) => string;
    importSuccess: (n: number) => string;
    importInvalid: string;
    soundLabel: string;
    soundChime: string;
    soundSystem: string;
    soundSilent: string;
  }
> = {
  uz_lat: {
    progressTab: 'Natijalar & Daraja',
    settingsTab: 'Sozlamalar',
    nextLevelLabel: (lvl) => `${lvl}-darajagacha`,
    asmaCardTitle: 'Asma ul-Husna',
    asmaMasteredAll: 'Barcha darajalar muvaffaqiyatli zabt etildi!',
    asmaMoreNeeded: (rank, c) => `${rank} maqomigacha yana ${c} ta ism`,
    startQuizBtn: 'Bilim testini boshlash (+20 XP)',
    ilmCardTitle: 'Ilm Viktorinasi',
    ilmMoreNeeded: (rank, c) => `${rank} maqomigacha yana ${c} savol`,
    ilmMasteredAll: "Barcha 120 savol o'zlashtirildi!",
    ilmPlayBtn: 'Yechish',
    tasbihSub: 'Tasbeh zikri',
    quranSub: "Qur'on tinglash",
    badgesTitle: 'Yutuq nishonlari',
    badgeEarned: 'Olindi',
    generalGroup: 'Asosiy sozlamalar',
    prayerGroup: 'Namoz va Bildirishnomalar',
    advancedCalcTitle: "Qo'shimcha hisoblash",
    hanafiAutoNote: "Mazhab avtomatik Hanafiy qilib sozlangan.",
    onLabel: 'Yoqilgan',
    offLabel: "O'chirilgan",
    showAllBookmarks: (n) => `Barchasini ko'rish (${n})`,
    showLessBookmarks: 'Kamaytirish',
    saveHandleBtn: 'OK',
    editHandleAria: "Foydalanuvchi nomini o'zgartirish",
    widgetFull: "To'liq (4×2)",
    widgetStrip: 'Faqat 5 vaqt (4×1)',
    widgetRamadan: 'Ramazon (4×2)',
    shortLang: { uz_lat: "O'zb", uz_cyr: 'Ўзб', ru: 'Рус', en: 'Eng' },
    webAlertsTitle: 'Azon bildirishnomalari va Vidjetlar',
    webAlertsDesc: "Brauzerlar yopiq sahifada fon azonini chalolmaydi. 5 vaqt namoz azoni va bosh ekran vidjetlari uchun rasmiy Android ilovani o'rnating.",
    downloadApkBtn: 'Android APK yuklab olish',
    webAutoUpdateSub: 'Veb-ilova avtomatik yangilanadi',
    refreshWebBtn: 'Yangilash',
    backupTitle: "Ma'lumotlarni zaxiralash",
    backupDesc: "Xatcho'plar, Qazo, Hifz, Tasbeh, Juma ro'yxati va barcha sozlamalarni faylga saqlang yoki tiklang.",
    exportBtn: 'Zaxira (.json)',
    importBtn: 'Tiklash',
    exportSuccess: (n) => `Zaxira fayli yuklab olindi (${n} ta yozuv)`,
    importSuccess: (n) => `${n} ta yozuv tiklandi! Ilova qayta yuklanmoqda...`,
    importInvalid: "Noto'g'ri fayl. Faqat Nurul Islam .json zaxira faylini tanlang.",
    soundLabel: 'Bildirishnoma ovozi',
    soundChime: 'Maxsus ovoz',
    soundSystem: 'Tizim',
    soundSilent: 'Ovozsiz',
  },
  uz_cyr: {
    progressTab: 'Натижалар & Даража',
    settingsTab: 'Созламалар',
    nextLevelLabel: (lvl) => `${lvl}-даражагача`,
    asmaCardTitle: 'Асма ул-Ҳусна',
    asmaMasteredAll: 'Барча даражалар муваффақиятли забт этилди!',
    asmaMoreNeeded: (rank, c) => `${rank} мақомигача яна ${c} та исм`,
    startQuizBtn: 'Билим тестини бошлаш (+20 XP)',
    ilmCardTitle: 'Илм Викторинаси',
    ilmMoreNeeded: (rank, c) => `${rank} мақомигача яна ${c} савол`,
    ilmMasteredAll: 'Барча 120 савол ўзлаштирилди!',
    ilmPlayBtn: 'Ечиш',
    tasbihSub: 'Тасбеҳ зикри',
    quranSub: 'Қуръон тинглаш',
    badgesTitle: 'Ютуқ нишонлари',
    badgeEarned: 'Олинди',
    generalGroup: 'Асосий созламалар',
    prayerGroup: 'Намоз ва Билдиришномалар',
    advancedCalcTitle: 'Қўшимча ҳисоблаш',
    hanafiAutoNote: 'Мазҳаб автоматик Ҳанафий қилиб созланган.',
    onLabel: 'Ёқилган',
    offLabel: 'Ўчирилган',
    showAllBookmarks: (n) => `Барчасини кўриш (${n})`,
    showLessBookmarks: 'Камайтириш',
    saveHandleBtn: 'ОК',
    editHandleAria: 'Фойдаланувчи номини ўзгартириш',
    widgetFull: 'Тўлиқ (4×2)',
    widgetStrip: 'Фақат 5 вақт (4×1)',
    widgetRamadan: 'Рамазон (4×2)',
    shortLang: { uz_lat: "O'zb", uz_cyr: 'Ўзб', ru: 'Рус', en: 'Eng' },
    webAlertsTitle: 'Азон билдиришномалари ва Виджетлар',
    webAlertsDesc: 'Браузерлар ёпиқ саҳифада фон азонини чалолмайди. 5 вақт намоз азони ва бош экран виджетлари учун расмий Android иловани ўрнатинг.',
    downloadApkBtn: 'Android APK юклаб олиш',
    webAutoUpdateSub: 'Веб-илова автоматик янгиланади',
    refreshWebBtn: 'Янгилаш',
    backupTitle: 'Маълумотларни захиралаш',
    backupDesc: 'Хатчўплар, Қазо, Ҳифз, Тасбеҳ, Жума рўйхати ва барча созламаларни файлга сақланг ёки тикланг.',
    exportBtn: 'Захира (.json)',
    importBtn: 'Тиклаш',
    exportSuccess: (n) => `Захира файли юклаб олинди (${n} та ёзув)`,
    importSuccess: (n) => `${n} та ёзув тикланди! Илова қайта юкланмоқда...`,
    importInvalid: 'Нотўғри файл. Фақат Nurul Islam .json захира файлини танланг.',
    soundLabel: 'Билдиришнома овози',
    soundChime: 'Махсус овоз',
    soundSystem: 'Тизим',
    soundSilent: 'Овозсиз',
  },
  ru: {
    progressTab: 'Прогресс и Уровень',
    settingsTab: 'Настройки',
    nextLevelLabel: (lvl) => `До уровня ${lvl}`,
    asmaCardTitle: 'Асма уль-Хусна',
    asmaMasteredAll: 'Все ступени успешно покорены!',
    asmaMoreNeeded: (rank, c) => `До ранга «${rank}» ещё ${c} имён`,
    startQuizBtn: 'Начать тест знаний (+20 XP)',
    ilmCardTitle: 'Исламская викторина',
    ilmMoreNeeded: (rank, c) => `До ранга «${rank}» ещё ${c} вопр.`,
    ilmMasteredAll: 'Все 120 вопросов освоены!',
    ilmPlayBtn: 'Играть',
    tasbihSub: 'Зикры в Тасбихе',
    quranSub: 'Прослушано Корана',
    badgesTitle: 'Достижения',
    badgeEarned: 'Получено',
    generalGroup: 'Основные настройки',
    prayerGroup: 'Намаз и Уведомления',
    advancedCalcTitle: 'Метод расчёта',
    hanafiAutoNote: 'Мазхаб автоматически установлен как Ханафитский.',
    onLabel: 'Вкл',
    offLabel: 'Выкл',
    showAllBookmarks: (n) => `Показать все (${n})`,
    showLessBookmarks: 'Свернуть',
    saveHandleBtn: 'ОК',
    editHandleAria: 'Изменить имя пользователя',
    widgetFull: 'Полный (4×2)',
    widgetStrip: 'Только 5 молитв (4×1)',
    widgetRamadan: 'Рамадан (4×2)',
    shortLang: { uz_lat: "O'zb", uz_cyr: 'Ўзб', ru: 'Рус', en: 'Eng' },
    webAlertsTitle: 'Уведомления азана и виджеты',
    webAlertsDesc: 'Браузеры не могут воспроизводить фоновый азан при закрытой вкладке. Установите Android-приложение для точных будильников азана и виджетов.',
    downloadApkBtn: 'Скачать Android APK',
    webAutoUpdateSub: 'Веб-приложение обновляется автоматически',
    refreshWebBtn: 'Обновить',
    backupTitle: 'Резервная копия данных',
    backupDesc: 'Сохраните или восстановите закладки, Казо, Хифз, Тасбих, список Джума и все настройки в файл.',
    exportBtn: 'Сохранить (.json)',
    importBtn: 'Восстановить',
    exportSuccess: (n) => `Резервная копия сохранена (${n} записей)`,
    importSuccess: (n) => `Восстановлено ${n} записей! Перезагрузка...`,
    importInvalid: 'Неверный файл. Выберите файл резервной копии Nurul Islam (.json).',
    soundLabel: 'Звук уведомления',
    soundChime: 'Особый звук',
    soundSystem: 'Системный',
    soundSilent: 'Без звука',
  },
  en: {
    progressTab: 'Progress & Ranks',
    settingsTab: 'Settings',
    nextLevelLabel: (lvl) => `Toward Level ${lvl}`,
    asmaCardTitle: 'Asma ul-Husna',
    asmaMasteredAll: 'Highest mastery tier achieved!',
    asmaMoreNeeded: (rank, c) => `${c} more names to reach ${rank}`,
    startQuizBtn: 'Start 99 Names Quiz (+20 XP)',
    ilmCardTitle: 'Islamic Knowledge Quiz',
    ilmMoreNeeded: (rank, c) => `${c} more Qs to reach ${rank}`,
    ilmMasteredAll: 'All 120 questions mastered!',
    ilmPlayBtn: 'Play',
    tasbihSub: 'Tasbih Dhikr',
    quranSub: 'Quran Listening',
    badgesTitle: 'Achievement Seals',
    badgeEarned: 'Unlocked',
    generalGroup: 'General Preferences',
    prayerGroup: 'Prayer & Notifications',
    advancedCalcTitle: 'Calculation Authority',
    hanafiAutoNote: 'Juristic school is set automatically to Hanafi.',
    onLabel: 'Enabled',
    offLabel: 'Off',
    showAllBookmarks: (n) => `Show all (${n})`,
    showLessBookmarks: 'Show less',
    saveHandleBtn: 'Save',
    editHandleAria: 'Edit profile handle',
    widgetFull: 'Full Prayer (4×2)',
    widgetStrip: '5 Prayers Only (4×1)',
    widgetRamadan: 'Ramadan (4×2)',
    shortLang: { uz_lat: "O'zb", uz_cyr: 'Ўзб', ru: 'Рус', en: 'Eng' },
    webAlertsTitle: 'Adhan Alarms & Home Widgets',
    webAlertsDesc: 'Web browsers pause closed tabs and cannot ring background Adhan alarms. Install the official Android app for 5-time alarms and widgets.',
    downloadApkBtn: 'Download Android APK',
    webAutoUpdateSub: 'Web app stays updated automatically',
    refreshWebBtn: 'Refresh',
    backupTitle: 'Backup & Restore Data',
    backupDesc: 'Export or restore your Bookmarks, Qazo, Hifz, Tasbih, custom Juma list, and preferences as a JSON file.',
    exportBtn: 'Backup (.json)',
    importBtn: 'Restore',
    exportSuccess: (n) => `Backup downloaded (${n} items)`,
    importSuccess: (n) => `Restored ${n} items! Reloading app...`,
    importInvalid: 'Invalid backup file. Please pick a Nurul Islam .json backup.',
    soundLabel: 'Notification sound',
    soundChime: 'Prayer Chime',
    soundSystem: 'System',
    soundSilent: 'Silent',
  },
};

function CircularRing({
  pct,
  size,
  stroke,
  color,
  track,
  children,
}: {
  pct: number;
  size: number;
  stroke: number;
  color: string;
  track: string;
  children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, pct));
  const offset = c - (clamped / 100) * c;
  return (
    <div className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      {children && <div className="absolute inset-0 flex items-center justify-center">{children}</div>}
    </div>
  );
}

function LevelCrest({ level, pct }: { level: number; pct: number }) {
  const r = 27;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.max(0, Math.min(100, pct)) / 100) * c;
  return (
    <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
      <svg width={64} height={64} className="-rotate-90 absolute inset-0">
        <defs>
          <linearGradient id="nqGoldArc" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d0f39f" />
            <stop offset="100%" stopColor="#fde68a" />
          </linearGradient>
        </defs>
        <circle cx={32} cy={32} r={r} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth={3.5} />
        <circle
          cx={32}
          cy={32}
          r={r}
          fill="none"
          stroke="url(#nqGoldArc)"
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <svg viewBox="0 0 48 48" className="w-11 h-11 text-[#fde68a]">
        <polygon
          points="24,3 30,9 39,9 39,18 45,24 39,30 39,39 30,39 24,45 18,39 9,39 9,30 3,24 9,18 9,9 18,9"
          fill="rgba(253,230,138,0.14)"
          stroke="rgba(253,230,138,0.68)"
          strokeWidth="1.5"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="text-[8px] font-bold uppercase tracking-widest text-[#d0f39f]">LVL</span>
        <span className="text-[17px] font-extrabold text-white mt-0.5 tabular-nums">{level}</span>
      </div>
    </div>
  );
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  currentCity,
  onOpenCitySelector,
  onDetectGPS,
  calcMethod,
  onChangeCalcMethod,
  selectedTranslation,
  onChangeTranslation,
  onSelectLanguage,
  alertPrefs,
  onChangeAlertPrefs,
  todayFajrTime,
  updateRelease,
  updateStatus,
  updateProgress,
  onCheckUpdate,
  onStartUpdate,
  bookmarks,
  onRemoveBookmark,
  onClearBookmarks,
  onResetPreferences,
  onOpenSurah,
  onNavigateTab,
  onOpenNamesQuiz,
}) => {
  const { isDay, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const ui = PROFILE_UI[language] || PROFILE_UI.uz_lat;
  const isNativeAndroid = isNativeAndroidBridgeAvailable();
  const isNativeUpdater = isNativeUpdaterSupported();
  const isPureWeb = !isNativeAndroid && !isNativeUpdater;

  const [subTab, setSubTab] = useState<'progress' | 'settings'>('progress');
  const [userHandle, setUserHandleState] = useState<string>(() => getUserHandle());
  const [isEditingHandle, setIsEditingHandle] = useState(false);
  const [handleDraft, setHandleDraft] = useState('');
  const [selectedBadgeId, setSelectedBadgeId] = useState<AchievementBadge['id']>('names_10');
  const [activityTick, setActivityTick] = useState(0);

  const [gpsStatus, setGpsStatus] = useState<'idle' | 'detecting' | 'ok' | 'err'>('idle');
  const [hasNotifPerm, setHasNotifPerm] = useState<boolean>(checkNativeNotificationPermission);
  const [testSent, setTestSent] = useState(false);
  const [widgetRequested, setWidgetRequested] = useState<'rich' | 'strip' | 'ramadan' | null>(null);
  const [showAdvancedCalc, setShowAdvancedCalc] = useState(false);
  const [showAllBookmarks, setShowAllBookmarks] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [backupNotice, setBackupNotice] = useState<{ kind: 'ok' | 'err'; msg: string } | null>(null);
  const [refreshingWeb, setRefreshingWeb] = useState(false);
  const restoreInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const refresh = () => {
      setActivityTick((v) => v + 1);
      setUserHandleState(getUserHandle());
    };
    window.addEventListener(ACTIVITY_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(ACTIVITY_UPDATED_EVENT, refresh);
  }, []);

  const summary = useMemo(() => {
    void activityTick;
    return computeActivitySummary(language);
  }, [activityTick, language]);

  const loc = getLocalizedCityLabel(
    currentCity.cityName,
    currentCity.countryName,
    language,
    currentCity.region
  );
  const locationDisplay =
    loc.region && currentCity.region !== 'world' ? `${loc.city} · ${loc.region}` : `${loc.city}, ${loc.country}`;

  const calcOptions = getCalcMethodOptions(language);
  const activeCalcOption = calcOptions.find((o) => o.id === calcMethod) || calcOptions[0];
  const activeBadge = summary.badges.find((b) => b.id === selectedBadgeId) || summary.badges[0];
  const visibleBookmarks = showAllBookmarks ? bookmarks : bookmarks.slice(0, 4);

  const handleSaveName = () => {
    const saved = setUserHandle(handleDraft);
    setUserHandleState(saved);
    setIsEditingHandle(false);
  };

  const handleGpsClick = async () => {
    setGpsStatus('detecting');
    try {
      const res = await onDetectGPS();
      setGpsStatus(res && res.ok === false ? 'err' : 'ok');
    } catch {
      setGpsStatus('err');
    }
    window.setTimeout(() => setGpsStatus('idle'), 2600);
  };

  const handleExportBackup = () => {
    const res = downloadUserBackupJson();
    if (res.ok) {
      setBackupNotice({ kind: 'ok', msg: ui.exportSuccess(res.count) });
    } else {
      setBackupNotice({ kind: 'err', msg: ui.importInvalid });
    }
    window.setTimeout(() => setBackupNotice(null), 3500);
  };

  const handleRestoreFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      const res = restoreUserBackupJson(text);
      if (res.ok) {
        setBackupNotice({ kind: 'ok', msg: ui.importSuccess(res.restoredCount) });
        window.setTimeout(() => window.location.reload(), 950);
      } else {
        setBackupNotice({ kind: 'err', msg: ui.importInvalid });
        window.setTimeout(() => setBackupNotice(null), 4000);
      }
    } catch {
      setBackupNotice({ kind: 'err', msg: ui.importInvalid });
      window.setTimeout(() => setBackupNotice(null), 4000);
    }
  };

  const handleRefreshWebApp = async () => {
    setRefreshingWeb(true);
    try {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        await reg?.update();
      }
    } catch {
      // Reload anyway
    }
    window.location.reload();
  };

  const cardCls = isDay
    ? 'rounded-2xl bg-white border border-[#dde3ea] shadow-xs'
    : 'rounded-2xl bg-slate-900/90 border border-emerald-900/60';

  const groupHeadingCls = isDay
    ? 'px-1 text-[10px] font-bold uppercase tracking-wider text-[#0c4703]'
    : 'px-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400';

  const iconBoxCls = isDay
    ? 'w-8 h-8 rounded-xl bg-[#eef9ea] text-[#158509] flex items-center justify-center shrink-0'
    : 'w-8 h-8 rounded-xl bg-emerald-950 text-amber-400 flex items-center justify-center shrink-0';

  const subTextCls = isDay ? 'text-slate-500' : 'text-slate-400';
  const dividerCls = isDay ? 'divide-slate-100' : 'divide-slate-800/80';
  const ringTrack = isDay ? '#e2e8f0' : '#1e293b';

  const renderBadgeIcon = (id: AchievementBadge['id']) => {
    if (id === 'names_10') return <Sparkles className="w-4 h-4" />;
    if (id === 'tasbih_1000') return <Flame className="w-4 h-4" />;
    if (id === 'quran_1h') return <Headphones className="w-4 h-4" />;
    if (id === 'ilm_20') return <GraduationCap className="w-4 h-4" />;
    return <Trophy className="w-4 h-4" />;
  };

  const namesPct = Math.round((summary.namesMastered / 99) * 100);

  return (
    <div className={`space-y-3.5 pb-6 ${isDay ? 'text-slate-900' : 'text-slate-100'}`}>
      {/* Flagship Identity Hero Card */}
      <div
        className={`rounded-3xl p-4 text-white shadow-lg border space-y-3 ${
          isDay ? 'nq-hero-day border-[#0a4306]' : 'nq-hero-night border-emerald-800/60'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <LevelCrest level={summary.level} pct={summary.levelProgressPct} />

          <div className="flex-1 min-w-0">
            {isEditingHandle ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={handleDraft}
                  onChange={(e) => setHandleDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName();
                    if (e.key === 'Escape') setIsEditingHandle(false);
                  }}
                  maxLength={22}
                  autoFocus
                  className="w-full min-w-0 px-2.5 py-1 rounded-xl bg-white text-slate-900 text-xs font-bold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveName}
                  className="px-2.5 py-1 rounded-xl bg-[#d0f39f] text-[#0c4703] text-xs font-bold shrink-0"
                >
                  {ui.saveHandleBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingHandle(false)}
                  className="p-1 rounded-xl bg-white/15 text-white shrink-0"
                  aria-label="Cancel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 min-w-0">
                <h1 className="text-base font-extrabold tracking-tight text-white truncate">
                  {userHandle}
                </h1>
                <button
                  type="button"
                  onClick={() => {
                    setHandleDraft(userHandle);
                    setIsEditingHandle(true);
                  }}
                  className="p-1 rounded-lg bg-white/12 hover:bg-white/22 text-[#d0f39f] transition shrink-0"
                  aria-label={ui.editHandleAria}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-white/14 border border-[#fde68a]/40 text-[#fde68a] text-[11px] font-bold">
                {summary.overallTitle}
              </span>
              <span className="text-[11px] text-white/85 flex items-center gap-1 truncate max-w-full">
                <MapPin className="w-3 h-3 text-[#d0f39f] shrink-0" />
                <span className="truncate">{locationDisplay}</span>
              </span>
            </div>
          </div>
        </div>

        {/* XP Progress Footer */}
        <div className="bg-black/20 border border-white/12 rounded-2xl px-3 py-2 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-white/80 font-medium">{ui.nextLevelLabel(summary.level + 1)}</span>
            <span className="font-mono font-bold text-[#fde68a] tabular-nums">
              {summary.totalXp.toLocaleString()} / {summary.nextLevelXp.toLocaleString()} XP
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-white/15 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#d0f39f] to-[#fde68a] transition-all duration-300"
              style={{ width: `${Math.max(4, summary.levelProgressPct)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Two-Tab Segmented Switch: Progress & Ranks | Settings */}
      <div className={`grid grid-cols-2 gap-1 p-1 ${cardCls}`}>
        <button
          type="button"
          onClick={() => setSubTab('progress')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition ${
            subTab === 'progress'
              ? isDay
                ? 'bg-[#158509] text-white shadow-xs'
                : 'bg-amber-400 text-slate-950 shadow-xs'
              : subTextCls
          }`}
        >
          {ui.progressTab}
        </button>
        <button
          type="button"
          onClick={() => setSubTab('settings')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition ${
            subTab === 'settings'
              ? isDay
                ? 'bg-[#158509] text-white shadow-xs'
                : 'bg-amber-400 text-slate-950 shadow-xs'
              : subTextCls
          }`}
        >
          {ui.settingsTab}
        </button>
      </div>

      {subTab === 'progress' ? (
        /* ==================== TAB 1: PROGRESS & RANKS ==================== */
        <div className="space-y-3 animate-in fade-in">
          {/* Asma ul-Husna Signature Card (Progress + 5-Step Rank Path + Link to Names Quiz) */}
          <div className={`${cardCls} p-4 space-y-3.5`}>
            <div className="flex items-center gap-3.5">
              <CircularRing
                pct={namesPct}
                size={58}
                stroke={5}
                color={isDay ? '#158509' : '#fbbf24'}
                track={ringTrack}
              >
                <div className="text-center leading-none">
                  <div className={`text-sm font-extrabold tabular-nums ${isDay ? 'text-[#0c4703]' : 'text-amber-300'}`}>
                    {summary.namesMastered}
                  </div>
                  <div className={`text-[9px] font-semibold ${subTextCls}`}>/99</div>
                </div>
              </CircularRing>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold truncate">{ui.asmaCardTitle}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold shrink-0 border ${
                      isDay
                        ? 'bg-[#eef9ea] text-[#0c4703] border-[#c5e8bc]'
                        : 'bg-emerald-950 text-amber-300 border-emerald-700/60'
                    }`}
                  >
                    {summary.namesRank}
                  </span>
                </div>
                <p className={`text-[11px] mt-0.5 ${subTextCls}`}>
                  {summary.namesNextGoal !== null && summary.namesNextRank
                    ? ui.asmaMoreNeeded(summary.namesNextRank, summary.namesNextGoal - summary.namesMastered)
                    : ui.asmaMasteredAll}
                </p>
              </div>
            </div>

            {/* 5-Stage Visual Rank Journey */}
            <div className="relative flex items-center justify-between pt-0.5">
              <div className={`absolute left-4 right-4 top-2 h-0.5 ${isDay ? 'bg-slate-200' : 'bg-slate-800'}`} />
              <div
                className={`absolute left-4 top-2 h-0.5 transition-all duration-300 ${
                  isDay ? 'bg-[#158509]' : 'bg-amber-400'
                }`}
                style={{ width: `${(summary.namesStageIndex / 4) * 88}%` }}
              />
              {summary.namesStageLabels.map((label, idx) => {
                const reached = idx <= summary.namesStageIndex;
                const current = idx === summary.namesStageIndex;
                return (
                  <div key={label} className="relative z-10 flex flex-col items-center gap-1 w-14">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[8px] font-bold ${
                        reached
                          ? isDay
                            ? 'bg-[#158509] border-[#d0f39f] text-white'
                            : 'bg-amber-400 border-emerald-950 text-slate-950'
                          : isDay
                          ? 'bg-white border-slate-300 text-slate-400'
                          : 'bg-slate-900 border-slate-700 text-slate-500'
                      }`}
                    >
                      {reached ? <Check className="w-2.5 h-2.5" /> : null}
                    </div>
                    <span
                      className={`text-[9px] text-center leading-tight ${
                        current
                          ? isDay
                            ? 'font-bold text-[#0c4703]'
                            : 'font-bold text-amber-300'
                          : subTextCls
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={onOpenNamesQuiz}
              className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-[0.99] ${
                isDay
                  ? 'bg-[#158509] hover:bg-[#0c5007] text-white shadow-xs'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{ui.startQuizBtn}</span>
            </button>
          </div>

          {/* Symmetrical Pair: Tasbih & Quran Listening */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => onNavigateTab('tasbih')}
              className={`${cardCls} p-3.5 space-y-2.5 text-left transition active:scale-[0.99]`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isDay ? 'bg-[#eef9ea] text-[#158509]' : 'bg-emerald-950 text-emerald-400'
                  }`}
                >
                  <Flame className="w-4 h-4" />
                </div>
                <CircularRing
                  pct={summary.tasbihProgressPct}
                  size={36}
                  stroke={3.5}
                  color={isDay ? '#158509' : '#34d399'}
                  track={ringTrack}
                >
                  <span className="text-[9px] font-bold tabular-nums">{summary.tasbihProgressPct}%</span>
                </CircularRing>
              </div>
              <div>
                <div className="text-base font-extrabold tabular-nums">
                  {summary.tasbihBeads.toLocaleString()}
                </div>
                <div className={`text-[11px] ${subTextCls}`}>{ui.tasbihSub}</div>
              </div>
              <div
                className={`pt-1.5 border-t flex items-center justify-between text-[11px] ${
                  isDay ? 'border-slate-100' : 'border-slate-800'
                }`}
              >
                <span className={`font-bold truncate ${isDay ? 'text-[#0c4703]' : 'text-emerald-400'}`}>
                  {summary.tasbihRank}
                </span>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${subTextCls}`} />
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('quran')}
              className={`${cardCls} p-3.5 space-y-2.5 text-left transition active:scale-[0.99]`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isDay ? 'bg-amber-50 text-amber-600' : 'bg-amber-500/15 text-amber-400'
                  }`}
                >
                  <Headphones className="w-4 h-4" />
                </div>
                <CircularRing
                  pct={summary.quranProgressPct}
                  size={36}
                  stroke={3.5}
                  color="#d97706"
                  track={ringTrack}
                >
                  <span className="text-[9px] font-bold tabular-nums">{summary.quranProgressPct}%</span>
                </CircularRing>
              </div>
              <div>
                <div className="text-base font-extrabold tabular-nums">
                  {formatListeningDuration(summary.quranMinutes, language)}
                </div>
                <div className={`text-[11px] ${subTextCls}`}>{ui.quranSub}</div>
              </div>
              <div
                className={`pt-1.5 border-t flex items-center justify-between text-[11px] ${
                  isDay ? 'border-slate-100' : 'border-slate-800'
                }`}
              >
                <span className={`font-bold truncate ${isDay ? 'text-amber-700' : 'text-amber-300'}`}>
                  {summary.quranRank}
                </span>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${subTextCls}`} />
              </div>
            </button>
          </div>

          {/* Islamic Knowledge Quiz Progress Card */}
          <button
            type="button"
            onClick={() => onNavigateTab('quiz')}
            className={`${cardCls} w-full p-3.5 flex items-center gap-3 text-left transition active:scale-[0.99]`}
          >
            <CircularRing
              pct={summary.knowledgeProgressPct}
              size={50}
              stroke={4.5}
              color={isDay ? '#158509' : '#fbbf24'}
              track={ringTrack}
            >
              <div className="text-center leading-none">
                <div className={`text-xs font-extrabold tabular-nums ${isDay ? 'text-[#0c4703]' : 'text-amber-300'}`}>
                  {summary.knowledgeMastered}
                </div>
                <div className={`text-[8.5px] font-semibold ${subTextCls}`}>/{summary.knowledgeTotal}</div>
              </div>
            </CircularRing>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <GraduationCap className={`w-3.5 h-3.5 shrink-0 ${isDay ? 'text-[#158509]' : 'text-amber-400'}`} />
                <span className="text-[13px] font-bold truncate">{ui.ilmCardTitle}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 border ${
                    isDay
                      ? 'bg-[#eef9ea] text-[#0c4703] border-[#c5e8bc]'
                      : 'bg-emerald-950 text-amber-300 border-emerald-700/60'
                  }`}
                >
                  {summary.knowledgeRank}
                </span>
              </div>
              <p className={`text-[11px] mt-0.5 truncate ${subTextCls}`}>
                {summary.knowledgeNextGoal !== null && summary.knowledgeNextRank
                  ? ui.ilmMoreNeeded(
                      summary.knowledgeNextRank,
                      Math.max(1, summary.knowledgeNextGoal - summary.knowledgeMastered)
                    )
                  : ui.ilmMasteredAll}
              </p>
            </div>

            <span
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold shrink-0 flex items-center gap-0.5 ${
                isDay
                  ? 'bg-[#158509] text-white'
                  : 'bg-amber-400 text-slate-950'
              }`}
            >
              <span>{ui.ilmPlayBtn}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </button>

          {/* Interactive Achievement Seal Medallions */}
          <div className={`${cardCls} p-3.5 space-y-3`}>
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isDay ? 'text-[#0c4703]' : 'text-emerald-400'
                }`}
              >
                {ui.badgesTitle}
              </span>
              <span className={`text-xs font-bold tabular-nums ${isDay ? 'text-[#158509]' : 'text-amber-300'}`}>
                {summary.badges.filter((b) => b.unlocked).length} / {summary.badges.length}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1">
              {summary.badges.map((b) => {
                const selected = b.id === activeBadge.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBadgeId(b.id)}
                    className={`flex flex-col items-center gap-1 p-1 rounded-xl border transition ${
                      selected
                        ? isDay
                          ? 'bg-[#eef9ea] border-[#158509]'
                          : 'bg-emerald-950/80 border-amber-400'
                        : 'border-transparent'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition ${
                        b.unlocked
                          ? isDay
                            ? 'bg-gradient-to-br from-[#eef9ea] via-[#fef9c3] to-[#fde68a] border-amber-400 text-[#0c4703] shadow-xs'
                            : 'bg-gradient-to-br from-emerald-900 to-amber-500/30 border-amber-400 text-amber-300'
                          : isDay
                          ? 'bg-slate-100 border-slate-200 text-slate-400'
                          : 'bg-slate-950 border-slate-800 text-slate-600'
                      }`}
                    >
                      {b.unlocked ? renderBadgeIcon(b.id) : <Lock className="w-3.5 h-3.5" />}
                    </div>
                    <span className={`text-[9.5px] font-semibold text-center leading-tight ${b.unlocked ? '' : subTextCls}`}>
                      {b.title}
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              className={`px-3 py-2 rounded-xl text-[11px] flex items-center justify-between gap-2 ${
                isDay ? 'bg-[#ecf1f5] text-slate-700' : 'bg-slate-950 text-slate-300'
              }`}
            >
              <div className="min-w-0">
                <span className="font-bold">{activeBadge.title}:</span> {activeBadge.desc}
              </div>
              <span
                className={`font-mono font-bold shrink-0 ${
                  activeBadge.unlocked
                    ? isDay
                      ? 'text-[#158509]'
                      : 'text-emerald-400'
                    : subTextCls
                }`}
              >
                {activeBadge.unlocked ? `✓ ${ui.badgeEarned}` : `+${activeBadge.bonusXp} XP`}
              </span>
            </div>
          </div>

          {/* Compact Ramadan & Bookmarks Summary Strip */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => onNavigateTab('ramadan')}
              className={`${cardCls} px-3.5 py-2.5 flex items-center justify-between text-left`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Moon className={`w-4 h-4 shrink-0 ${isDay ? 'text-[#158509]' : 'text-amber-400'}`} />
                <div className="min-w-0">
                  <div className={`text-[10px] font-semibold uppercase truncate ${subTextCls}`}>
                    {t.profile.ramadanFastsStat}
                  </div>
                  <div className="text-xs font-extrabold tabular-nums">{summary.fastedCount} / 30</div>
                </div>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${subTextCls}`} />
            </button>

            <button
              type="button"
              onClick={() => setSubTab('settings')}
              className={`${cardCls} px-3.5 py-2.5 flex items-center justify-between text-left`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Bookmark className={`w-4 h-4 shrink-0 ${isDay ? 'text-[#158509]' : 'text-amber-400'}`} />
                <div className="min-w-0">
                  <div className={`text-[10px] font-semibold uppercase truncate ${subTextCls}`}>
                    {t.profile.savedAyahsStat}
                  </div>
                  <div className="text-xs font-extrabold tabular-nums">{bookmarks.length}</div>
                </div>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${subTextCls}`} />
            </button>
          </div>
        </div>
      ) : (
        /* ==================== TAB 2: GROUPED CLEAN SETTINGS ==================== */
        <div className="space-y-3.5 animate-in fade-in">
          {/* Group 1: General Preferences */}
          <div className="space-y-1.5">
            <div className={groupHeadingCls}>{ui.generalGroup}</div>
            <div className={`${cardCls} divide-y ${dividerCls}`}>
              {/* Location & GPS */}
              <div className="p-3.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={iconBoxCls}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">{locationDisplay}</div>
                    <div className={`text-[11px] truncate ${subTextCls}`}>
                      {currentCity.timezone || t.profile.localTimezone} · {currentCity.latitude.toFixed(2)}°,{' '}
                      {currentCity.longitude.toFixed(2)}°
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleGpsClick}
                    disabled={gpsStatus === 'detecting'}
                    className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold flex items-center gap-1 transition ${
                      gpsStatus === 'ok'
                        ? 'bg-[#158509] border-[#0c4703] text-white'
                        : gpsStatus === 'err'
                        ? 'bg-rose-500/15 border-rose-500/40 text-rose-500'
                        : isDay
                        ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                        : 'bg-emerald-950 border-emerald-700/70 text-emerald-300'
                    }`}
                  >
                    {gpsStatus === 'ok' ? <Check className="w-3 h-3" /> : <Navigation className="w-3 h-3" />}
                    <span>
                      {gpsStatus === 'detecting'
                        ? '...'
                        : gpsStatus === 'ok'
                        ? 'OK'
                        : t.profile.gpsBtn}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={onOpenCitySelector}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition ${
                      isDay
                        ? 'bg-[#158509] hover:bg-[#0c5007] text-white'
                        : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                    }`}
                  >
                    {t.profile.changeCityBtn}
                  </button>
                </div>
              </div>

              {/* Language 4-Pill Row */}
              <div className="p-3.5 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className={iconBoxCls}>
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">{t.profile.languageTitle}</div>
                    <div className={`text-[11px] ${subTextCls}`}>{t.profile.languageHint}</div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {LANGUAGE_OPTIONS.map((opt) => {
                    const selected = language === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          if (onSelectLanguage) onSelectLanguage(opt.id);
                          else setLanguage(opt.id);
                        }}
                        className={`py-2 px-1.5 rounded-xl text-[11px] font-bold border transition text-center ${
                          selected
                            ? isDay
                              ? 'bg-[#158509] text-white border-[#158509]'
                              : 'bg-amber-400 text-slate-950 border-amber-300'
                            : isDay
                            ? 'bg-[#ecf1f5] text-slate-700 border-[#dde3ea]'
                            : 'bg-slate-950 text-slate-300 border-slate-800'
                        }`}
                      >
                        {ui.shortLang[opt.id]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Day / Night Theme Row */}
              <div className="p-3.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={iconBoxCls}>
                    {isDay ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold">{t.profile.themeTitle}</div>
                    <div className={`text-[11px] ${subTextCls}`}>
                      {isDay ? t.profile.dayTitle : t.profile.nightTitle}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setTheme('day')}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border flex items-center gap-1 transition ${
                      isDay
                        ? 'bg-[#158509] text-white border-[#158509]'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>{t.profile.dayTitle}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('night')}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border flex items-center gap-1 transition ${
                      !isDay
                        ? 'bg-amber-400 text-slate-950 border-amber-300'
                        : 'bg-[#ecf1f5] text-slate-700 border-[#dde3ea]'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>{t.profile.nightTitle}</span>
                  </button>
                </div>
              </div>

              {/* Quran Translation Dropdown */}
              <div className="p-3.5 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className={iconBoxCls}>
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold">{t.profile.translationTitle}</div>
                </div>
                <select
                  value={selectedTranslation}
                  onChange={(e) => onChangeTranslation(e.target.value as TranslationId)}
                  className={`w-full border text-xs font-semibold rounded-xl p-2.5 focus:outline-none ${
                    isDay
                      ? 'bg-[#ecf1f5] border-[#dde3ea] text-slate-900 focus:border-[#158509]'
                      : 'bg-slate-950 border-emerald-800/80 text-white focus:border-amber-400'
                  }`}
                >
                  {TRANSLATION_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Group 2: Prayer Alerts, Native Widgets & Collapsible Advanced Calculation */}
          <div className="space-y-1.5">
            <div className={groupHeadingCls}>{ui.prayerGroup}</div>
            <div className={`${cardCls} divide-y ${dividerCls}`}>
              {/* Notifications (Native Android/Desktop controls, or honest Web guidance on pure browsers) */}
              {isPureWeb ? (
                <div className="p-3.5 space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <div className={iconBoxCls}>
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold">{ui.webAlertsTitle}</div>
                      <p className={`text-[11px] leading-relaxed mt-0.5 ${subTextCls}`}>
                        {ui.webAlertsDesc}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`${UPDATE_SITE_URL}/downloads/nurul-quran-latest.apk`}
                    download="Nurul-Islam-latest.apk"
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      isDay
                        ? 'bg-[#158509] hover:bg-[#0c5007] text-white'
                        : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                    }`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{ui.downloadApkBtn}</span>
                  </a>
                </div>
              ) : (
              <div className="p-3.5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={iconBoxCls}>
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold">{t.alerts.title}</div>
                      <div className={`text-[11px] truncate ${subTextCls}`}>{t.alerts.enableDesc}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const nextEnabled = !alertPrefs.enabled;
                      if (nextEnabled && !hasNotifPerm) {
                        requestNativeNotificationPermission((granted) => {
                          setHasNotifPerm(granted);
                          if (granted) onChangeAlertPrefs({ ...alertPrefs, enabled: true });
                        });
                      } else {
                        onChangeAlertPrefs({ ...alertPrefs, enabled: nextEnabled });
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition border shrink-0 ${
                      alertPrefs.enabled
                        ? isDay
                          ? 'bg-[#158509] text-white border-[#0c4703]'
                          : 'bg-amber-400 text-slate-950 border-amber-300'
                        : isDay
                        ? 'bg-[#ecf1f5] text-slate-600 border-[#dde3ea]'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {alertPrefs.enabled ? ui.onLabel : ui.offLabel}
                  </button>
                </div>

                {!hasNotifPerm && (
                  <div
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs ${
                      isDay
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-amber-950/40 border-amber-700/50 text-amber-200'
                    }`}
                  >
                    <span>{t.alerts.permNeeded}</span>
                    <button
                      type="button"
                      onClick={() =>
                        requestNativeNotificationPermission((granted) => setHasNotifPerm(granted))
                      }
                      className={`px-2.5 py-1 rounded-lg font-bold shrink-0 ${
                        isDay ? 'bg-[#158509] text-white' : 'bg-amber-400 text-slate-950'
                      }`}
                    >
                      {t.alerts.allowPermBtn}
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-1.5">
                  {(
                    [
                      { key: 'imsak', label: t.prayers.imsak },
                      { key: 'fajr', label: t.prayers.fajr },
                      { key: 'dhuhr', label: t.prayers.dhuhr },
                      { key: 'asr', label: t.prayers.asr },
                      { key: 'maghrib', label: t.prayers.maghrib },
                      { key: 'isha', label: t.prayers.isha },
                    ] as Array<{ key: AlertPrayerKey; label: string }>
                  ).map((item) => {
                    const active = alertPrefs.prayers[item.key];
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() =>
                          onChangeAlertPrefs({
                            ...alertPrefs,
                            prayers: { ...alertPrefs.prayers, [item.key]: !active },
                          })
                        }
                        className={`py-2 px-2 rounded-xl border text-[11px] font-semibold flex items-center justify-center gap-1 transition ${
                          active
                            ? isDay
                              ? 'bg-[#eef9ea] border-[#158509] text-[#0c4703]'
                              : 'bg-emerald-950 border-emerald-600 text-emerald-300'
                            : isDay
                            ? 'bg-[#ecf1f5] border-[#dde3ea] text-slate-400'
                            : 'bg-slate-950 border-slate-800 text-slate-500'
                        }`}
                      >
                        {active && <Check className="w-3 h-3 shrink-0" />}
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className={`text-xs ${isDay ? 'text-slate-600' : 'text-slate-300'}`}>
                    {t.alerts.preReminderLabel}
                  </span>
                  <div className="flex items-center gap-1">
                    {([0, 10, 15] as const).map((mins) => {
                      const selected = alertPrefs.preReminderMins === mins;
                      return (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => onChangeAlertPrefs({ ...alertPrefs, preReminderMins: mins })}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                            selected
                              ? isDay
                                ? 'bg-[#158509] text-white border-[#0c4703]'
                                : 'bg-amber-400 text-slate-950 border-amber-300'
                              : isDay
                              ? 'bg-[#ecf1f5] text-slate-700 border-[#dde3ea]'
                              : 'bg-slate-950 text-slate-400 border-slate-800'
                          }`}
                        >
                          {mins === 0 ? t.alerts.offOpt : `${mins} ${t.alerts.minSuffix}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className={`text-xs ${isDay ? 'text-slate-600' : 'text-slate-300'}`}>
                    {ui.soundLabel}
                  </span>
                  <div className="flex items-center gap-1">
                    {(
                      [
                        { id: 'chime', label: ui.soundChime },
                        { id: 'default', label: ui.soundSystem },
                        { id: 'silent', label: ui.soundSilent },
                      ] as Array<{ id: PrayerAlertSoundMode; label: string }>
                    ).map((opt) => {
                      const selected = (alertPrefs.soundMode || 'chime') === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            onChangeAlertPrefs({ ...alertPrefs, soundMode: opt.id });
                            if (opt.id === 'chime') {
                              playPrayerChimePreview();
                            }
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border flex items-center gap-1 transition ${
                            selected
                              ? isDay
                                ? 'bg-[#158509] text-white border-[#0c4703]'
                                : 'bg-amber-400 text-slate-950 border-amber-300'
                              : isDay
                              ? 'bg-[#ecf1f5] text-slate-700 border-[#dde3ea]'
                              : 'bg-slate-950 text-slate-400 border-slate-800'
                          }`}
                        >
                          {opt.id === 'chime' && <Volume2 className="w-3 h-3 shrink-0" />}
                          <span>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const send = () => {
                      triggerTestPrayerAlert(
                        t.prayers.fajr,
                        todayFajrTime,
                        loc.city,
                        alertPrefs.soundMode || 'chime'
                      );
                      setTestSent(true);
                      window.setTimeout(() => setTestSent(false), 2400);
                    };
                    if (!hasNotifPerm) {
                      requestNativeNotificationPermission((granted) => {
                        setHasNotifPerm(granted);
                        if (granted) send();
                      });
                      return;
                    }
                    send();
                  }}
                  className={`w-full py-2 rounded-xl border text-xs font-semibold transition ${
                    isDay
                      ? 'bg-[#ecf1f5] hover:bg-[#eef9ea] border-[#dde3ea] text-[#0c4703]'
                      : 'bg-slate-950 hover:bg-emerald-950 border-slate-800 text-emerald-300'
                  }`}
                >
                  {testSent ? t.alerts.testSent : `${t.alerts.testBtn} (${todayFajrTime})`}
                </button>
              </div>
              )}

              {/* Native Android Widgets (Hidden cleanly on Web/Browser) */}
              {isNativeAndroid && (
                <div className="p-3.5 space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className={iconBoxCls}>
                      <LayoutGrid className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">{t.alerts.widgetTitle}</div>
                      <div className={`text-[11px] ${subTextCls}`}>{t.alerts.widgetDesc}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      pinPrayerHomeWidget('strip');
                      setWidgetRequested('strip');
                      window.setTimeout(() => setWidgetRequested(null), 2600);
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition ${
                      isDay
                        ? 'bg-[#158509] hover:bg-[#0c5007] text-white'
                        : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                    }`}
                  >
                    {widgetRequested ? t.alerts.widgetRequested : t.alerts.addWidgetBtn}
                  </button>
                </div>
              )}

              {/* Collapsible Advanced Calculation Method (Always Hanafi) */}
              <div className="p-3.5 space-y-2.5">
                <button
                  type="button"
                  onClick={() => setShowAdvancedCalc((prev) => !prev)}
                  className="w-full flex items-center justify-between gap-2 text-left"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={iconBoxCls}>
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold">{ui.advancedCalcTitle}</div>
                      <div className={`text-[11px] truncate ${subTextCls}`}>
                        {activeCalcOption?.label}
                      </div>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform ${subTextCls} ${
                      showAdvancedCalc ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {showAdvancedCalc && (
                  <div className="space-y-2 pt-1">
                    <select
                      value={calcMethod}
                      onChange={(e) => onChangeCalcMethod(e.target.value as CalcMethod)}
                      className={`w-full border text-xs font-medium rounded-xl p-2.5 focus:outline-none ${
                        isDay
                          ? 'bg-[#ecf1f5] border-[#dde3ea] text-slate-900 focus:border-[#158509]'
                          : 'bg-slate-950 border-emerald-800/80 text-white focus:border-amber-400'
                      }`}
                    >
                      {calcOptions.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <p className={`text-[11px] ${subTextCls}`}>{ui.hanafiAutoNote}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Group 3: Expandable Saved Bookmarks */}
          <div className={`${cardCls} p-3.5 space-y-2.5`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bookmark className={`w-4 h-4 ${isDay ? 'text-[#158509]' : 'text-amber-400'}`} />
                <span className="text-xs font-bold">
                  {t.profile.bookmarksTitle} ({bookmarks.length})
                </span>
              </div>
              {bookmarks.length > 0 && (
                <button
                  type="button"
                  onClick={onClearBookmarks}
                  className={`text-[11px] font-semibold ${
                    isDay ? 'text-rose-600 hover:text-rose-700' : 'text-rose-400 hover:text-rose-300'
                  }`}
                >
                  {t.profile.clearAll}
                </button>
              )}
            </div>

            {bookmarks.length === 0 ? (
              <p className={`text-xs ${subTextCls}`}>{t.profile.noBookmarks}</p>
            ) : (
              <div className="space-y-1.5">
                {visibleBookmarks.map((bm) => {
                  const surahTitle = getLocalizedSurahMeta(bm.surahNumber, bm.surahName, '', language).name;
                  return (
                    <div
                      key={bm.id}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs ${
                        isDay ? 'bg-[#ecf1f5] border-[#dde3ea]' : 'bg-slate-950/70 border-slate-800/80'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => onOpenSurah(bm.surahNumber, bm.ayahNumber)}
                        className="flex-1 min-w-0 flex items-center gap-2 text-left"
                      >
                        <BookOpen className={`w-3.5 h-3.5 shrink-0 ${isDay ? 'text-[#158509]' : 'text-amber-400'}`} />
                        <span className="font-semibold truncate">{surahTitle}</span>
                        <span className={`tabular-nums shrink-0 ${isDay ? 'text-[#0c4703]' : 'text-emerald-400'}`}>
                          {t.quran.ayahWord} {bm.ayahNumber}
                        </span>
                      </button>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => onRemoveBookmark(bm.id)}
                          className={`p-1 rounded-lg ${isDay ? 'text-slate-400 hover:text-rose-600' : 'text-slate-500 hover:text-rose-400'}`}
                          aria-label="Remove bookmark"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenSurah(bm.surahNumber, bm.ayahNumber)}
                          className="p-0.5 text-slate-400"
                          aria-label="Open bookmark"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {bookmarks.length > 4 && (
                  <button
                    type="button"
                    onClick={() => setShowAllBookmarks((prev) => !prev)}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition ${
                      isDay ? 'text-[#158509] hover:bg-[#eef9ea]' : 'text-amber-300 hover:bg-emerald-950/60'
                    }`}
                  >
                    {showAllBookmarks ? ui.showLessBookmarks : ui.showAllBookmarks(bookmarks.length)}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Group 3b: Backup & Restore User Progress (.json) */}
          <div className={`${cardCls} p-3.5 space-y-2.5`}>
            <div className="flex items-start gap-2.5">
              <div className={iconBoxCls}>
                <Download className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold">{ui.backupTitle}</div>
                <p className={`text-[11px] leading-relaxed mt-0.5 ${subTextCls}`}>{ui.backupDesc}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleExportBackup}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  isDay
                    ? 'bg-[#158509] hover:bg-[#0c5007] text-white'
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>{ui.exportBtn}</span>
              </button>
              <button
                type="button"
                onClick={() => restoreInputRef.current?.click()}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  isDay
                    ? 'bg-[#ecf1f5] hover:bg-[#eef9ea] border-[#dde3ea] text-[#0c4703]'
                    : 'bg-slate-950 hover:bg-emerald-950 border-slate-800 text-emerald-300'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{ui.importBtn}</span>
              </button>
              <input
                ref={restoreInputRef}
                type="file"
                accept="application/json,.json"
                onChange={handleRestoreFileChange}
                className="hidden"
              />
            </div>
            {backupNotice && (
              <p
                className={`text-[11px] font-semibold ${
                  backupNotice.kind === 'ok'
                    ? isDay
                      ? 'text-[#158509]'
                      : 'text-emerald-400'
                    : 'text-rose-500'
                }`}
              >
                {backupNotice.msg}
              </p>
            )}
          </div>

          {/* Group 4: Unified Updates, About & Safe Reset Card */}
          <div className={`${cardCls} divide-y ${dividerCls}`}>
            <div className="p-3.5 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={iconBoxCls}>
                    <ArrowDownCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">
                      Nurul Islam{isPureWeb ? ' Web' : ''} · v{getLocalAppVersion().versionName} ({getLocalAppVersion().versionCode})
                    </div>
                    <div className={`text-[11px] ${subTextCls}`}>
                      {isPureWeb ? ui.webAutoUpdateSub : t.updates.title}
                    </div>
                  </div>
                </div>
                {isPureWeb ? (
                  <button
                    type="button"
                    onClick={handleRefreshWebApp}
                    disabled={refreshingWeb}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 border transition disabled:opacity-50 ${
                      isDay
                        ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                        : 'bg-emerald-950 border-emerald-800 text-emerald-300'
                    }`}
                  >
                    <RefreshCw className={`w-3 h-3 ${refreshingWeb ? 'animate-spin' : ''}`} />
                    <span>{ui.refreshWebBtn}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onCheckUpdate}
                    disabled={updateStatus === 'checking' || updateStatus === 'downloading'}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 border transition disabled:opacity-50 ${
                      isDay
                        ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                        : 'bg-emerald-950 border-emerald-800 text-emerald-300'
                    }`}
                  >
                    <RefreshCw className={`w-3 h-3 ${updateStatus === 'checking' ? 'animate-spin' : ''}`} />
                    <span>{updateStatus === 'checking' ? t.updates.checking : t.updates.checkBtn}</span>
                  </button>
                )}
              </div>

              {!isPureWeb && updateRelease && updateStatus !== 'up_to_date' && (
                <div
                  className={`p-3 rounded-xl border space-y-2 ${
                    isDay ? 'bg-[#eef9ea] border-[#c5e8bc]' : 'bg-emerald-950/60 border-emerald-700/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className={isDay ? 'text-[#0c4703]' : 'text-amber-300'}>
                      {t.updates.newVersionAvailable}
                    </span>
                    <span className="font-mono">v{updateRelease.versionName}</span>
                  </div>
                  {getReleaseNoteText(updateRelease, language) && (
                    <p className={`text-[11px] ${isDay ? 'text-slate-700' : 'text-slate-300'}`}>
                      {getReleaseNoteText(updateRelease, language)}
                    </p>
                  )}
                  {updateStatus === 'downloading' && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span>{t.updates.downloading}...</span>
                        <span>{updateProgress}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-black/15 overflow-hidden">
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
                    <p className="text-[11px] text-amber-600 dark:text-amber-300 font-medium">
                      {t.updates.needsPerm}
                    </p>
                  )}
                  {updateStatus === 'installing' && (
                    <p className={`text-[11px] font-semibold ${isDay ? 'text-[#0c4703]' : 'text-emerald-300'}`}>
                      {t.updates.installing}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={onStartUpdate}
                    disabled={updateStatus === 'downloading' || updateStatus === 'installing'}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition disabled:opacity-50 ${
                      isDay
                        ? 'bg-[#158509] hover:bg-[#0c5007] text-white'
                        : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                    }`}
                  >
                    {updateStatus === 'downloading'
                      ? `${t.updates.downloading} ${updateProgress}%`
                      : updateStatus === 'installing'
                      ? t.updates.installing
                      : t.updates.updateNowBtn}
                  </button>
                </div>
              )}

              {updateStatus === 'up_to_date' && (
                <p className={`text-xs font-semibold ${isDay ? 'text-[#158509]' : 'text-emerald-400'}`}>
                  {t.updates.upToDate}
                </p>
              )}
              {updateStatus === 'error' && (
                <p className="text-xs text-rose-500 font-medium">{t.updates.errorMsg}</p>
              )}
            </div>

            <div className="p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <Info className={`w-3.5 h-3.5 ${isDay ? 'text-[#158509]' : 'text-amber-400'}`} />
                <span>{t.profile.aboutTitle}</span>
              </div>
              <p className={`text-[11px] leading-relaxed ${subTextCls}`}>{t.profile.aboutDesc}</p>
            </div>

            <div className="p-3.5">
              {!confirmingReset ? (
                <button
                  type="button"
                  onClick={() => setConfirmingReset(true)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition ${
                    isDay
                      ? 'bg-[#ecf1f5] hover:bg-rose-50 border-[#dde3ea] text-slate-700 hover:text-rose-700'
                      : 'bg-slate-950 hover:bg-rose-950/30 border-slate-800 text-slate-200 hover:text-rose-300'
                  }`}
                >
                  <span>{t.profile.resetBtn}</span>
                  <RotateCcw className="w-3.5 h-3.5 opacity-70" />
                </button>
              ) : (
                <div
                  className={`p-3 rounded-xl border space-y-2.5 ${
                    isDay ? 'bg-rose-50 border-rose-200' : 'bg-rose-950/30 border-rose-800/60'
                  }`}
                >
                  <p className={`text-xs font-medium ${isDay ? 'text-rose-900' : 'text-rose-200'}`}>
                    {t.profile.resetConfirm}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmingReset(false)}
                      className={`py-2 rounded-xl border text-xs font-semibold ${
                        isDay
                          ? 'bg-white border-slate-200 text-slate-700'
                          : 'bg-slate-900 border-slate-700 text-slate-300'
                      }`}
                    >
                      {t.profile.resetCancelBtn}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onResetPreferences();
                        setConfirmingReset(false);
                      }}
                      className="py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition"
                    >
                      {t.profile.resetConfirmBtn}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
