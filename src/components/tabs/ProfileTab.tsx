import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDownCircle,
  ArrowLeft,
  Bell,
  BookOpen,
  Bookmark,
  Check,
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
  MessageSquarePlus,
  Moon,
  Pencil,
  RefreshCw,
  RotateCcw,
  Send,
  Settings,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Sun,
  Trash2,
  Trophy,
  X,
} from 'lucide-react';
import { AppLanguage, Bookmark as BookmarkType, CalcMethod, Coordinates, TranslationId } from '../../types';
import { getLocalizedSurahMeta } from '../../data/surahs';
import { loadCompletedSurahs } from '../../data/juz';
import { getHijriParts, getLocalizedCityLabel } from '../../utils/prayerTimes';
import {
  DEFAULT_ALERT_PREFS,
  PrayerAlertPrefs,
  checkNativeNotificationPermission,
  isNativeAndroidBridgeAvailable,
  openExternalUrl,
  pinPrayerHomeWidget,
  playPrayerChimePreview,
  requestNativeNotificationPermission,
} from '../../utils/nativePrayerBridge';
import {
  FeedbackCategory,
  RemoteAppConfig,
  getCachedRemoteAppConfig,
  submitUserFeedback,
  subscribeRemoteAppConfig,
} from '../../utils/remoteAppConfig';
import {
  RemoteAppRelease,
  UPDATE_SITE_URL,
  UpdateDownloadStatus,
  getLocalAppVersion,
  getReleaseNoteText,
  isNativeUpdaterSupported,
} from '../../utils/appUpdater';
import {
  ACTIVITY_UPDATED_EVENT,
  AchievementBadge,
  computeActivitySummary,
  formatListeningDuration,
  getUserHandle,
  setUserHandle,
} from '../../utils/userActivity';
import {
  CloudBackupMeta,
  getCachedCloudBackupMeta,
  restoreProgressByCodeOrKey,
  subscribeCloudBackupMeta,
  syncOrAutoRestoreProgress,
} from '../../utils/progressSync';
import { useTheme } from '../../contexts/ThemeContext';
import { LANGUAGE_OPTIONS, useLanguage } from '../../contexts/LanguageContext';

interface ProfileTabProps {
  currentCity: Coordinates;
  onOpenCitySelector: () => void;
  onDetectGPS?: () => Promise<{ ok: boolean }> | void;
  calcMethod?: CalcMethod;
  onChangeCalcMethod?: (method: CalcMethod) => void;
  selectedTranslation?: TranslationId;
  onChangeTranslation?: (tr: TranslationId) => void;
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
    settingsTitle: string;
    openSettingsAria: string;
    backToProfileAria: string;
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
    appGroup: string;
    cityRowTitle: string;
    langRowTitle: string;
    themeRowTitle: string;
    showAllBookmarks: (n: number) => string;
    showLessBookmarks: string;
    saveHandleBtn: string;
    editHandleAria: string;
    shortLang: Record<AppLanguage, string>;
    webAlertsTitle: string;
    webAlertsDesc: string;
    downloadApkBtn: string;
    webAutoUpdateSub: string;
    refreshWebBtn: string;
    alertsSimpleSub: string;
    widgetAddShort: string;
    bookmarksHelp: string;
    bookmarksEmptyHint: string;
    openQuranBtn: string;
    khatmCardTitle: string;
    khatmCardSub: (done: number) => string;
  }
> = {
  uz_lat: {
    settingsTitle: 'Sozlamalar',
    openSettingsAria: 'Sozlamalarni ochish',
    backToProfileAria: 'Profilga qaytish',
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
    generalGroup: 'Umumiy',
    prayerGroup: 'Namoz bildirishnomalari',
    appGroup: 'Ilova',
    cityRowTitle: 'Shahar',
    langRowTitle: 'Til',
    themeRowTitle: 'Mavzu',
    showAllBookmarks: (n) => `Barchasini ko'rish (${n})`,
    showLessBookmarks: 'Kamaytirish',
    saveHandleBtn: 'OK',
    editHandleAria: "Foydalanuvchi nomini o'zgartirish",
    shortLang: { uz_lat: "O'zb", uz_cyr: 'Ўзб', ru: 'Рус', en: 'Eng' },
    webAlertsTitle: 'Namoz bildirishnomalari va Vidjetlar',
    webAlertsDesc: "Brauzerlar yopiq sahifada fon eslatmalarini chalolmaydi. 5 vaqt namoz bildirishnomasi va bosh ekran vidjeti uchun rasmiy Android ilovani o'rnating.",
    downloadApkBtn: 'Android APK yuklab olish',
    webAutoUpdateSub: 'Veb-ilova avtomatik yangilanadi',
    refreshWebBtn: 'Yangilash',
    alertsSimpleSub: '5 vaqt namoz · Nurul Islam ovozi',
    widgetAddShort: "Qo'shish",
    bookmarksHelp: "Qur'ondan saqlagan oyatlaringiz — bosib o'sha oyatga o'ting",
    bookmarksEmptyHint: "Qur'on o'qiyotganda istalgan oyatdagi xatcho'p belgisini bosing — bu yerda saqlanadi.",
    openQuranBtn: "Qur'onni ochish",
    khatmCardTitle: "O'qilgan suralar (Xatm)",
    khatmCardSub: (done) => `${done} / 114 sura`,
  },
  uz_cyr: {
    settingsTitle: 'Созламалар',
    openSettingsAria: 'Созламаларни очиш',
    backToProfileAria: 'Профилга қайтиш',
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
    generalGroup: 'Умумий',
    prayerGroup: 'Намоз билдиришномалари',
    appGroup: 'Илова',
    cityRowTitle: 'Шаҳар',
    langRowTitle: 'Тил',
    themeRowTitle: 'Мавзу',
    showAllBookmarks: (n) => `Барчасини кўриш (${n})`,
    showLessBookmarks: 'Камайтириш',
    saveHandleBtn: 'ОК',
    editHandleAria: 'Фойдаланувчи номини ўзгартириш',
    shortLang: { uz_lat: "O'zb", uz_cyr: 'Ўзб', ru: 'Рус', en: 'Eng' },
    webAlertsTitle: 'Намоз билдиришномалари ва Виджетлар',
    webAlertsDesc: 'Браузерлар ёпиқ саҳифада фон эслатмаларини чалолмайди. 5 вақт намоз билдиришномаси ва бош экран виджети учун расмий Android иловани ўрнатинг.',
    downloadApkBtn: 'Android APK юклаб олиш',
    webAutoUpdateSub: 'Веб-илова автоматик янгиланади',
    refreshWebBtn: 'Янгилаш',
    alertsSimpleSub: '5 вақт намоз · Нурул Ислам овози',
    widgetAddShort: 'Қўшиш',
    bookmarksHelp: 'Қуръондан сақлаган оятларингиз — босиб ўша оятга ўтинг',
    bookmarksEmptyHint: 'Қуръон ўқиётганда исталган оятдаги хатчўп белгисини босинг — бу ерда сақланади.',
    openQuranBtn: 'Қуръонни очиш',
    khatmCardTitle: 'Ўқилган суралар (Хатм)',
    khatmCardSub: (done) => `${done} / 114 сура`,
  },
  ru: {
    settingsTitle: 'Настройки',
    openSettingsAria: 'Открыть настройки',
    backToProfileAria: 'Назад в профиль',
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
    generalGroup: 'Основные',
    prayerGroup: 'Уведомления о намазе',
    appGroup: 'Приложение',
    cityRowTitle: 'Город',
    langRowTitle: 'Язык',
    themeRowTitle: 'Тема',
    showAllBookmarks: (n) => `Показать все (${n})`,
    showLessBookmarks: 'Свернуть',
    saveHandleBtn: 'ОК',
    editHandleAria: 'Изменить имя пользователя',
    shortLang: { uz_lat: "O'zb", uz_cyr: 'Ўзб', ru: 'Рус', en: 'Eng' },
    webAlertsTitle: 'Уведомления о намазе и виджеты',
    webAlertsDesc: 'Браузеры не могут подавать фоновые уведомления при закрытой вкладке. Установите Android-приложение для точных напоминаний и виджета.',
    downloadApkBtn: 'Скачать Android APK',
    webAutoUpdateSub: 'Веб-приложение обновляется автоматически',
    refreshWebBtn: 'Обновить',
    alertsSimpleSub: '5 намазов · Фирменный звук Nurul Islam',
    widgetAddShort: 'Добавить',
    bookmarksHelp: 'Сохранённые аяты Корана — нажмите, чтобы открыть нужный аят',
    bookmarksEmptyHint: 'Нажмите значок закладки у любого аята при чтении Корана — он появится здесь.',
    openQuranBtn: 'Открыть Коран',
    khatmCardTitle: 'Прочитанные суры (Хатм)',
    khatmCardSub: (done) => `${done} / 114 сур`,
  },
  en: {
    settingsTitle: 'Settings',
    openSettingsAria: 'Open settings',
    backToProfileAria: 'Back to profile',
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
    generalGroup: 'General',
    prayerGroup: 'Prayer Notifications',
    appGroup: 'Application',
    cityRowTitle: 'Location',
    langRowTitle: 'Language',
    themeRowTitle: 'Appearance',
    showAllBookmarks: (n) => `Show all (${n})`,
    showLessBookmarks: 'Show less',
    saveHandleBtn: 'Save',
    editHandleAria: 'Edit profile handle',
    shortLang: { uz_lat: "O'zb", uz_cyr: 'Ўзб', ru: 'Рус', en: 'Eng' },
    webAlertsTitle: 'Prayer Alerts & Home Widgets',
    webAlertsDesc: 'Web browsers pause closed tabs and cannot ring background prayer alerts. Install the official Android app for reliable 5-time notifications and widgets.',
    downloadApkBtn: 'Download Android APK',
    webAutoUpdateSub: 'Web app updates automatically',
    refreshWebBtn: 'Refresh',
    alertsSimpleSub: 'All 5 daily prayers · Nurul Islam chime',
    widgetAddShort: 'Add',
    bookmarksHelp: 'Your saved Quran verses — tap any item to jump straight to that Ayah',
    bookmarksEmptyHint: 'Tap the bookmark icon on any verse while reading the Quran to save it here.',
    openQuranBtn: 'Open Quran',
    khatmCardTitle: 'Surahs Completed (Khatm)',
    khatmCardSub: (done) => `${done} / 114 surahs`,
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
  calcMethod,
  onSelectLanguage,
  alertPrefs,
  onChangeAlertPrefs,
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

  const rootRef = useRef<HTMLDivElement | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userHandle, setUserHandleState] = useState<string>(() => getUserHandle());
  const [isEditingHandle, setIsEditingHandle] = useState(false);
  const [handleDraft, setHandleDraft] = useState('');
  const [selectedBadgeId, setSelectedBadgeId] = useState<AchievementBadge['id']>('names_10');
  const [activityTick, setActivityTick] = useState(0);

  const [hasNotifPerm, setHasNotifPerm] = useState<boolean>(checkNativeNotificationPermission);
  const [widgetRequested, setWidgetRequested] = useState(false);
  const [showAllBookmarks, setShowAllBookmarks] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [refreshingWeb, setRefreshingWeb] = useState(false);

  const isRamadanSeason = useMemo(() => getHijriParts(new Date()).month === 9, []);
  const [remoteConfig, setRemoteConfig] = useState<RemoteAppConfig>(() => getCachedRemoteAppConfig());
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [fbCategory, setFbCategory] = useState<FeedbackCategory>('suggestion');
  const [fbMessage, setFbMessage] = useState('');
  const [fbContact, setFbContact] = useState('');
  const [fbIncludePrayerDiag, setFbIncludePrayerDiag] = useState(false);
  const [fbSending, setFbSending] = useState(false);
  const [fbResult, setFbResult] = useState<'idle' | 'ok' | 'err'>('idle');

  const [backupMeta, setBackupMeta] = useState<CloudBackupMeta>(() => getCachedCloudBackupMeta());
  const [backupSyncing, setBackupSyncing] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkKeyInput, setLinkKeyInput] = useState('');
  const [linkKeySaving, setLinkKeySaving] = useState(false);
  const [linkKeySavedOk, setLinkKeySavedOk] = useState(false);
  const [restoreInput, setRestoreInput] = useState('');
  const [restoring, setRestoring] = useState(false);
  const [restoreFeedback, setRestoreFeedback] = useState<'idle' | 'ok' | 'not_found' | 'err'>('idle');

  useEffect(() => {
    const unsubBackup = subscribeCloudBackupMeta((m) => setBackupMeta(m));
    void syncOrAutoRestoreProgress();
    return () => unsubBackup();
  }, []);

  useEffect(() => {
    const unsub = subscribeRemoteAppConfig((cfg) => setRemoteConfig(cfg));
    const onOpenFeedback = () => {
      setIsSettingsOpen(true);
      setFbResult('idle');
      setIsFeedbackOpen(true);
    };
    window.addEventListener('nq:open-feedback-modal', onOpenFeedback);
    return () => {
      unsub();
      window.removeEventListener('nq:open-feedback-modal', onOpenFeedback);
    };
  }, []);

  const fbCopy = useMemo(() => {
    if (language === 'ru') {
      return {
        rowTitle: 'Отзыв или сообщить об ошибке',
        rowDesc: 'Напишите напрямую разработчику Nurul Islam',
        privacyTitle: 'Политика конфиденциальности',
        telegramTitle: 'Telegram канал и поддержка',
        modalTitle: 'Отправить отзыв',
        cats: {
          suggestion: 'Идея / Предложение',
          bug: 'Ошибка / Сбой',
          prayer_time: 'Время намаза',
          content: 'Книга / Текст',
          other: 'Другое',
        },
        msgPlaceholder: 'Опишите ваш вопрос, ошибку или пожелание...',
        contactPlaceholder: 'Telegram или email (необязательно)',
        sendBtn: 'Отправить',
        sending: 'Отправка...',
        sentOk: 'Спасибо! Ваше сообщение доставлено команде Nurul Islam.',
        sentErr: 'Не удалось отправить. Проверьте интернет и повторите.',
      };
    }
    if (language === 'en') {
      return {
        rowTitle: 'Send Feedback / Report Issue',
        rowDesc: 'Message the Nurul Islam team directly',
        privacyTitle: 'Privacy Policy',
        telegramTitle: 'Telegram Channel & Support',
        modalTitle: 'Send Feedback',
        cats: {
          suggestion: 'Suggestion',
          bug: 'Bug / Crash',
          prayer_time: 'Prayer Times',
          content: 'Book / Content',
          other: 'Other',
        },
        msgPlaceholder: 'Describe your suggestion, issue, or question...',
        contactPlaceholder: 'Telegram handle or email (optional)',
        sendBtn: 'Submit Feedback',
        sending: 'Sending...',
        sentOk: 'Thank you! Your feedback has been received.',
        sentErr: 'Could not send right now. Check your connection and retry.',
      };
    }
    if (language === 'uz_cyr') {
      return {
        rowTitle: 'Таклиф ёки хатолик юбориш',
        rowDesc: 'Nurul Islam жамоасига бевосита хабар йўлланг',
        privacyTitle: 'Махфийлик сиёсати',
        telegramTitle: 'Telegram канал ва ёрдам',
        modalTitle: 'Мурожаат юбориш',
        cats: {
          suggestion: 'Таклиф',
          bug: 'Хатолик',
          prayer_time: 'Намоз вақти',
          content: 'Китоб / Матн',
          other: 'Бошқа',
        },
        msgPlaceholder: 'Таклифингиз ёки учраган хатоликни ёзинг...',
        contactPlaceholder: 'Telegram ёки email (ихтиёрий)',
        sendBtn: 'Юбориш',
        sending: 'Юборилмоқда...',
        sentOk: 'Раҳмат! Мурожаатингиз қабул қилинди.',
        sentErr: 'Юбориб бўлмади. Интернетни текшириб қайта урининг.',
      };
    }
    return {
      rowTitle: 'Taklif yoki xatolik yuborish',
      rowDesc: 'Nurul Islam jamoasiga bevosita xabar yo‘llang',
      privacyTitle: 'Maxfiylik siyosati',
      telegramTitle: 'Telegram kanal va yordam',
      modalTitle: 'Murojaat yuborish',
      cats: {
        suggestion: 'Taklif',
        bug: 'Xatolik',
        prayer_time: 'Namoz vaqti',
        content: 'Kitob / Matn',
        other: 'Boshqa',
      },
      msgPlaceholder: 'Taklifingiz yoki uchragan xatolikni yozing...',
      contactPlaceholder: 'Telegram yoki email (ixtiyoriy)',
      sendBtn: 'Yuborish',
      sending: 'Yuborilmoqda...',
      sentOk: 'Rahmat! Murojaatingiz qabul qilindi.',
      sentErr: 'Yuborib bo‘lmadi. Internetni tekshirib qayta urining.',
    };
  }, [language]);

  const backupCopy = useMemo(() => {
    if (language === 'ru') {
      return {
        groupTitle: 'Облачное сохранение и восстановление',
        cardTitle: 'Автосохранение прогресса',
        cardSub: 'Коран, закладки, тасбих, каза и книги привязаны к вашему устройству',
        activeBadge: 'Сохранено ✓',
        syncNowBtn: 'Сохранить сейчас',
        codeLabel: 'Ваш код восстановления',
        copyBtn: 'Копировать',
        copiedBtn: 'Скопировано ✓',
        linkTitle: 'Привязать телефон или секретное слово (по желанию)',
        linkSub: 'Чтобы легко вернуть прогресс на новом телефоне без кода',
        linkedHint: (h: string) => `Привязано: ${h}`,
        linkPlaceholder: '+998 90 123 45 67 или секретное слово',
        linkSaveBtn: 'Привязать',
        linkSavedMsg: '✓ Номер/слово успешно привязаны к вашему прогрессу!',
        restoreTitle: 'Восстановить прогресс',
        restorePlaceholder: 'Введите код (NI-XXXXXX) или привязанный телефон',
        restoreBtn: 'Восстановить',
        restoringBtn: 'Проверка...',
        restoreOk: '✓ Весь ваш прогресс и настройки успешно восстановлены!',
        restoreNotFound: 'Резервная копия с таким кодом или номером не найдена.',
        restoreErr: 'Ошибка соединения. Проверьте интернет и повторите.',
      };
    }
    if (language === 'en') {
      return {
        groupTitle: 'Cloud Backup & Progress Recovery',
        cardTitle: 'Automatic Progress Backup',
        cardSub: 'Quran progress, bookmarks, tasbih, qaza & books stay safe even if reinstalled',
        activeBadge: 'Backed up ✓',
        syncNowBtn: 'Sync Now',
        codeLabel: 'Your Recovery Code',
        copyBtn: 'Copy',
        copiedBtn: 'Copied ✓',
        linkTitle: 'Link phone number or secret word (optional)',
        linkSub: 'Restore your progress on any new phone using your phone number',
        linkedHint: (h: string) => `Linked: ${h}`,
        linkPlaceholder: '+998 90 123 45 67 or secret word',
        linkSaveBtn: 'Save',
        linkSavedMsg: '✓ Linked to your cloud backup!',
        restoreTitle: 'Restore Progress from Backup',
        restorePlaceholder: 'Enter code (NI-XXXXXX) or linked phone number',
        restoreBtn: 'Restore',
        restoringBtn: 'Restoring...',
        restoreOk: '✓ All your progress, bookmarks, and settings have been restored!',
        restoreNotFound: 'No backup found for that code or phone number.',
        restoreErr: 'Connection error. Please check your internet and try again.',
      };
    }
    if (language === 'uz_cyr') {
      return {
        groupTitle: 'Булутли захира ва тиклаш',
        cardTitle: 'Маълумотларни автоматик сақлаш',
        cardSub: 'Илова ўчиб кетса ҳам Қуръон, хатчўплар, тасбеҳ, қазо ва китоблар йўқолмайди',
        activeBadge: 'Сақланган ✓',
        syncNowBtn: 'Янгилаш',
        codeLabel: 'Сизнинг тиклаш кодингиз',
        copyBtn: 'Нусхалаш',
        copiedBtn: 'Нусхаланди ✓',
        linkTitle: 'Телефон рақам ёки махфий сўз улаш (ихтиёрий)',
        linkSub: 'Янги телефон олганда кодсиз рақамингиз орқали бир зумда тиклаш учун',
        linkedHint: (h: string) => `Уланган: ${h}`,
        linkPlaceholder: '+998 90 123 45 67 ёки махфий сўз',
        linkSaveBtn: 'Сақлаш',
        linkSavedMsg: '✓ Рақам/махфий сўз захирага муваффақиятли уланди!',
        restoreTitle: 'Бошқа қурилмадан тиклаш',
        restorePlaceholder: 'Тиклаш коди (NI-XXXXXX) ёки уланган телефон рақам',
        restoreBtn: 'Тиклаш',
        restoringBtn: 'Тикланмоқда...',
        restoreOk: '✓ Барча натижа ва созламаларингиз муваффақиятли тикланди!',
        restoreNotFound: 'Бундай код ёки телефон рақам бўйича захира топилмади.',
        restoreErr: 'Тармоқ хатолиги. Интернетни текшириб қайта урининг.',
      };
    }
    return {
      groupTitle: 'Bulutli zaxira va tiklash',
      cardTitle: "Ma'lumotlarni avtomatik saqlash",
      cardSub: "Ilova o'chib ketsa ham Qur'on, xatcho'plar, tasbeh, qazo va kitoblar yo'qolmaydi",
      activeBadge: 'Saqlangan ✓',
      syncNowBtn: 'Yangilash',
      codeLabel: 'Sizning tiklash kodingiz',
      copyBtn: 'Nusxalash',
      copiedBtn: 'Nusxalandi ✓',
      linkTitle: "Telefon raqam yoki maxfiy so'z ulash (ixtiyoriy)",
      linkSub: 'Yangi telefon olganda kodsiz raqamingiz orqali bir zumda tiklash uchun',
      linkedHint: (h: string) => `Ulangan: ${h}`,
      linkPlaceholder: "+998 90 123 45 67 yoki maxfiy so'z",
      linkSaveBtn: 'Saqlash',
      linkSavedMsg: "✓ Raqam/maxfiy so'z zaxiraga muvaffaqiyatli ulandi!",
      restoreTitle: 'Boshqa qurilmadan tiklash',
      restorePlaceholder: 'Tiklash kodi (NI-XXXXXX) yoki ulangan telefon raqam',
      restoreBtn: 'Tiklash',
      restoringBtn: 'Tiklanmoqda...',
      restoreOk: '✓ Barcha natija va sozlamalaringiz muvaffaqiyatli tiklandi!',
      restoreNotFound: "Bunday kod yoki telefon raqam bo'yicha zaxira topilmadi.",
      restoreErr: 'Tarmoq xatoligi. Internetni tekshirib qayta urining.',
    };
  }, [language]);

  const handleManualBackupSync = async () => {
    if (backupSyncing) return;
    setBackupSyncing(true);
    await syncOrAutoRestoreProgress({ force: true });
    setBackupSyncing(false);
  };

  const handleCopyRecoveryCode = async () => {
    const code = backupMeta.recoveryCode || userHandle;
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCodeCopied(true);
      window.setTimeout(() => setCodeCopied(false), 2200);
    } catch {
      // ignore clipboard restriction
    }
  };

  const handleSaveRecoveryKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (linkKeyInput.trim().length < 4 || linkKeySaving) return;
    setLinkKeySaving(true);
    setLinkKeySavedOk(false);
    await syncOrAutoRestoreProgress({ force: true, recoveryKey: linkKeyInput.trim() });
    setLinkKeySaving(false);
    setLinkKeyInput('');
    setLinkKeySavedOk(true);
    window.setTimeout(() => setLinkKeySavedOk(false), 3000);
  };

  const handleRestoreProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (restoreInput.trim().length < 4 || restoring) return;
    setRestoring(true);
    setRestoreFeedback('idle');
    const res = await restoreProgressByCodeOrKey(restoreInput.trim());
    setRestoring(false);
    if (res.ok && res.found) {
      setRestoreFeedback('ok');
      setRestoreInput('');
      setActivityTick((v) => v + 1);
      setUserHandleState(getUserHandle());
    } else if (res.ok && !res.found) {
      setRestoreFeedback('not_found');
    } else {
      setRestoreFeedback('err');
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fbMessage.trim().length < 4 || fbSending) return;
    setFbSending(true);
    setFbResult('idle');
    const uzLoc = getLocalizedCityLabel(
      currentCity.cityName,
      currentCity.countryName,
      'uz_lat',
      currentCity.region
    );
    const prayerDiag = fbIncludePrayerDiag
      ? [
          `Usul: ${calcMethod || 'Uzbekistan'}`,
          uzLoc.region || currentCity.countryName,
          currentCity.subtitle || '',
          currentCity.cityName,
        ]
          .filter(Boolean)
          .join(' · ')
      : '';
    const res = await submitUserFeedback({
      category: fbCategory,
      message: fbMessage,
      contact: fbContact,
      language,
      city: currentCity.cityName,
      region: uzLoc.region || '',
      country: currentCity.countryName || '',
      prayerDiagnostics: prayerDiag,
    });
    setFbSending(false);
    if (res.ok) {
      setFbResult('ok');
      setFbMessage('');
      setFbContact('');
      setFbIncludePrayerDiag(false);
      window.setTimeout(() => {
        setIsFeedbackOpen(false);
        setFbResult('idle');
      }, 1500);
    } else {
      setFbResult('err');
    }
  };
  const completedSurahsCount = useMemo(() => {
    void activityTick;
    return loadCompletedSurahs().length;
  }, [activityTick]);

  useEffect(() => {
    const refresh = () => {
      setActivityTick((v) => v + 1);
      setUserHandleState(getUserHandle());
    };
    window.addEventListener(ACTIVITY_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(ACTIVITY_UPDATED_EVENT, refresh);
  }, []);

  // Android hardware / gesture back button returns smoothly from Settings -> Profile
  useEffect(() => {
    if (!isSettingsOpen) return;
    const onBack = (e: Event) => {
      e.preventDefault();
      setIsSettingsOpen(false);
      setConfirmingReset(false);
    };
    window.addEventListener('nq:android-back', onBack);
    return () => window.removeEventListener('nq:android-back', onBack);
  }, [isSettingsOpen]);

  // Reset viewport scroll smoothly when switching between Profile <-> Settings
  useEffect(() => {
    const scroller = rootRef.current?.closest('.overflow-y-auto') as HTMLElement | null;
    if (scroller) scroller.scrollTop = 0;
  }, [isSettingsOpen]);

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

  const activeBadge = summary.badges.find((b) => b.id === selectedBadgeId) || summary.badges[0];
  const visibleBookmarks = showAllBookmarks ? bookmarks : bookmarks.slice(0, 4);

  const handleSaveName = () => {
    const saved = setUserHandle(handleDraft);
    setUserHandleState(saved);
    setIsEditingHandle(false);
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

  const handleToggleAlerts = () => {
    const nextEnabled = !alertPrefs.enabled;
    if (nextEnabled && !hasNotifPerm) {
      requestNativeNotificationPermission((granted) => {
        setHasNotifPerm(granted);
        if (granted) {
          onChangeAlertPrefs({ ...DEFAULT_ALERT_PREFS, enabled: true });
          playPrayerChimePreview();
        }
      });
    } else {
      onChangeAlertPrefs({ ...DEFAULT_ALERT_PREFS, enabled: nextEnabled });
      if (nextEnabled) playPrayerChimePreview();
    }
  };

  const cardCls = isDay
    ? 'rounded-2xl bg-white border border-[#dde3ea] shadow-xs'
    : 'rounded-2xl bg-slate-900/90 border border-emerald-900/60';

  const groupHeadingCls = isDay
    ? 'px-1.5 text-[10.5px] font-bold uppercase tracking-wider text-[#0c4703]/80'
    : 'px-1.5 text-[10.5px] font-bold uppercase tracking-wider text-emerald-400/90';

  const iconBoxCls = isDay
    ? 'w-9 h-9 rounded-xl bg-[#eef9ea] text-[#158509] flex items-center justify-center shrink-0'
    : 'w-9 h-9 rounded-xl bg-emerald-950 text-amber-400 flex items-center justify-center shrink-0';

  const segWrapCls = isDay
    ? 'inline-flex items-center p-0.5 rounded-xl bg-[#edf2f5] border border-[#dfe6eb] gap-0.5'
    : 'inline-flex items-center p-0.5 rounded-xl bg-slate-950 border border-slate-800 gap-0.5';

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

  if (isSettingsOpen) {
    /* ==================== DEDICATED MODERN SETTINGS VIEW ==================== */
    return (
      <div
        ref={rootRef}
        className={`space-y-4 pb-6 animate-in fade-in ${isDay ? 'text-slate-900' : 'text-slate-100'}`}
      >
        {/* Clean Settings Header */}
        <div className="flex items-center gap-2.5 pt-0.5">
          <button
            type="button"
            onClick={() => {
              setIsSettingsOpen(false);
              setConfirmingReset(false);
            }}
            aria-label={ui.backToProfileAria}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition active:scale-95 ${
              isDay
                ? 'bg-white border-[#dde3ea] text-slate-700 hover:bg-[#eef9ea] hover:text-[#0c4703]'
                : 'bg-slate-900 border-emerald-900/60 text-slate-200 hover:bg-emerald-950'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="font-display text-lg font-bold tracking-tight">{ui.settingsTitle}</h1>
        </div>

        {/* Group 1: General (City, Language, Theme) */}
        <div className="space-y-1.5">
          <div className={groupHeadingCls}>{ui.generalGroup}</div>
          <div className={`${cardCls} divide-y ${dividerCls} overflow-hidden`}>
            {/* City / Location — clean single tappable row (GPS is inside City Selector) */}
            <button
              type="button"
              onClick={onOpenCitySelector}
              className={`w-full px-3.5 py-3 flex items-center justify-between gap-3 text-left transition ${
                isDay ? 'hover:bg-slate-50/80 active:bg-[#eef9ea]/50' : 'hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={iconBoxCls}>
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-bold">{ui.cityRowTitle}</div>
                  <div className={`text-[11.5px] truncate ${subTextCls}`}>{locationDisplay}</div>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 shrink-0 ${subTextCls}`} />
            </button>

            {/* Language — sleek inline segmented pill */}
            <div className="px-3.5 py-3 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-3">
                <div className={iconBoxCls}>
                  <Globe className="w-4 h-4" />
                </div>
                <span className="text-[13px] font-bold">{ui.langRowTitle}</span>
              </div>
              <div className={segWrapCls}>
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
                      className={`px-2.5 py-1.5 rounded-[9px] text-[11px] font-bold transition ${
                        selected
                          ? isDay
                            ? 'bg-white text-[#0c4703] shadow-xs'
                            : 'bg-amber-400 text-slate-950 shadow-xs'
                          : isDay
                          ? 'text-slate-600 hover:text-slate-900'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {ui.shortLang[opt.id]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Theme — sleek inline segmented toggle */}
            <div className="px-3.5 py-3 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-3">
                <div className={iconBoxCls}>
                  {isDay ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </div>
                <span className="text-[13px] font-bold">{ui.themeRowTitle}</span>
              </div>
              <div className={segWrapCls}>
                <button
                  type="button"
                  onClick={() => setTheme('day')}
                  className={`px-2.5 py-1.5 rounded-[9px] text-[11px] font-bold flex items-center gap-1 transition ${
                    isDay
                      ? 'bg-white text-[#0c4703] shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>{t.profile.dayTitle}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('night')}
                  className={`px-2.5 py-1.5 rounded-[9px] text-[11px] font-bold flex items-center gap-1 transition ${
                    !isDay
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>{t.profile.nightTitle}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Group 1.5: Automatic Cloud Progress Backup (Clean, Zero-Friction) */}
        <div className="space-y-1.5">
          <div className={groupHeadingCls}>{backupCopy.groupTitle}</div>
          <div className={`${cardCls} overflow-hidden`}>
            <div className="p-3.5 flex items-start justify-between gap-2.5">
              <div className="flex items-start gap-3 min-w-0">
                <div className={iconBoxCls}>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[13px] font-bold">{backupCopy.cardTitle}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isDay
                          ? 'bg-[#eef9ea] text-[#0c4703] border border-[#c5e8bc]'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                      }`}
                    >
                      {backupCopy.activeBadge}
                    </span>
                  </div>
                  <p className={`text-[11.5px] leading-relaxed mt-0.5 ${subTextCls}`}>
                    {backupCopy.cardSub}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleManualBackupSync}
                disabled={backupSyncing}
                className={`p-2 rounded-xl border transition shrink-0 ${
                  isDay
                    ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-[#eef9ea]'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-emerald-950'
                }`}
                title={backupCopy.syncNowBtn}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${backupSyncing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Group 2: Prayer Notifications & Android Home Widget */}
        <div className="space-y-1.5">
          <div className={groupHeadingCls}>{ui.prayerGroup}</div>
          <div className={`${cardCls} divide-y ${dividerCls} overflow-hidden`}>
            {isPureWeb ? (
              <div className="p-3.5 space-y-3">
                <div className="flex items-start gap-3">
                  <div className={iconBoxCls}>
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold">{ui.webAlertsTitle}</div>
                    <p className={`text-[11.5px] leading-relaxed mt-0.5 ${subTextCls}`}>
                      {ui.webAlertsDesc}
                    </p>
                  </div>
                </div>
                <a
                  href={`${UPDATE_SITE_URL}/downloads/nurul-quran-latest.apk`}
                  download="Nurul-Islam-latest.apk"
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
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
              <div className="p-3.5 space-y-2.5">
                {/* Single Clean ON/OFF Prayer Notification Switch (Nurul Islam Prayer Chime, 5 daily prayers) */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={iconBoxCls}>
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13px] font-bold">{t.alerts.title}</div>
                      <div className={`text-[11.5px] truncate ${subTextCls}`}>{ui.alertsSimpleSub}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={alertPrefs.enabled}
                    onClick={handleToggleAlerts}
                    className={`relative w-12 h-7 rounded-full transition-colors duration-200 shrink-0 ${
                      alertPrefs.enabled
                        ? isDay
                          ? 'bg-[#158509]'
                          : 'bg-amber-400'
                        : isDay
                        ? 'bg-slate-300'
                        : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        alertPrefs.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {alertPrefs.enabled && !hasNotifPerm && (
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
              </div>
            )}

            {/* Native Android Home Widget (Single sleek row) */}
            {isNativeAndroid && (
              <button
                type="button"
                onClick={() => {
                  pinPrayerHomeWidget('strip');
                  setWidgetRequested(true);
                  window.setTimeout(() => setWidgetRequested(false), 2600);
                }}
                className={`w-full px-3.5 py-3 flex items-center justify-between gap-3 text-left transition ${
                  isDay ? 'hover:bg-slate-50/80 active:bg-[#eef9ea]/50' : 'hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={iconBoxCls}>
                    <LayoutGrid className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold">{t.alerts.widgetTitle}</div>
                    <div className={`text-[11.5px] truncate ${subTextCls}`}>{t.alerts.widgetDesc}</div>
                  </div>
                </div>
                <span
                  className={`text-xs font-bold shrink-0 flex items-center gap-0.5 ${
                    isDay ? 'text-[#158509]' : 'text-amber-300'
                  }`}
                >
                  <span>{widgetRequested ? t.alerts.widgetRequested : ui.widgetAddShort}</span>
                  {!widgetRequested && <ChevronRight className="w-3.5 h-3.5" />}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Group 3: App (Version/Updates, About, Reset) */}
        <div className="space-y-1.5">
          <div className={groupHeadingCls}>{ui.appGroup}</div>
          <div className={`${cardCls} divide-y ${dividerCls} overflow-hidden`}>
            {/* Version & Update Check */}
            <div className="px-3.5 py-3 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={iconBoxCls}>
                    <ArrowDownCircle className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold truncate">
                      Nurul Islam{isPureWeb ? ' Web' : ''} · v{getLocalAppVersion().versionName}
                    </div>
                    <div className={`text-[11.5px] truncate ${subTextCls}`}>
                      {isPureWeb ? ui.webAutoUpdateSub : t.updates.title}
                    </div>
                  </div>
                </div>
                {isPureWeb ? (
                  <button
                    type="button"
                    onClick={handleRefreshWebApp}
                    disabled={refreshingWeb}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition shrink-0 disabled:opacity-50 ${
                      isDay
                        ? 'bg-[#eef9ea] text-[#0c4703] hover:bg-[#dff4d8]'
                        : 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900'
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
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition shrink-0 disabled:opacity-50 ${
                      isDay
                        ? 'bg-[#eef9ea] text-[#0c4703] hover:bg-[#dff4d8]'
                        : 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900'
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

            {/* About */}
            <div className="px-3.5 py-3 flex items-start gap-3">
              <div className={iconBoxCls}>
                <Info className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-bold">{t.profile.aboutTitle}</div>
                <p className={`text-[11.5px] leading-relaxed mt-0.5 ${subTextCls}`}>{t.profile.aboutDesc}</p>
              </div>
            </div>

            {/* Direct Feedback / Bug Report Row */}
            <button
              type="button"
              onClick={() => {
                setFbResult('idle');
                setIsFeedbackOpen(true);
              }}
              className={`w-full px-3.5 py-3 flex items-center justify-between gap-3 text-left transition ${
                isDay ? 'hover:bg-slate-50/80 active:bg-[#eef9ea]/50' : 'hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={iconBoxCls}>
                  <MessageSquarePlus className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-bold truncate">{fbCopy.rowTitle}</div>
                  <div className={`text-[11.5px] truncate ${subTextCls}`}>{fbCopy.rowDesc}</div>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 shrink-0 ${subTextCls}`} />
            </button>

            {/* Dynamic Telegram / Support Link */}
            {remoteConfig.links.telegramUrl && (
              <button
                type="button"
                onClick={() => openExternalUrl(remoteConfig.links.telegramUrl)}
                className={`w-full px-3.5 py-3 flex items-center justify-between gap-3 text-left transition ${
                  isDay ? 'hover:bg-slate-50/80' : 'hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={iconBoxCls}>
                    <Send className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold truncate">{fbCopy.telegramTitle}</div>
                    <div className={`text-[11.5px] truncate ${subTextCls}`}>
                      {remoteConfig.links.telegramUrl.replace(/^https?:\/\//, '')}
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 ${subTextCls}`} />
              </button>
            )}

            {/* Dynamic Privacy Policy Link (Play Store Required) */}
            {remoteConfig.links.privacyPolicyUrl && (
              <button
                type="button"
                onClick={() => openExternalUrl(remoteConfig.links.privacyPolicyUrl)}
                className={`w-full px-3.5 py-3 flex items-center justify-between gap-3 text-left transition ${
                  isDay ? 'hover:bg-slate-50/80' : 'hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={iconBoxCls}>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold truncate">{fbCopy.privacyTitle}</div>
                    <div className={`text-[11.5px] truncate ${subTextCls}`}>
                      {remoteConfig.links.privacyPolicyUrl.replace(/^https?:\/\//, '')}
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 ${subTextCls}`} />
              </button>
            )}

            {/* Subtle Reset Row */}
            <div>
              {!confirmingReset ? (
                <button
                  type="button"
                  onClick={() => setConfirmingReset(true)}
                  className={`w-full px-3.5 py-3 flex items-center justify-between gap-3 text-left transition ${
                    isDay ? 'hover:bg-rose-50/70' : 'hover:bg-rose-950/25'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isDay ? 'bg-rose-50 text-rose-600' : 'bg-rose-950/60 text-rose-400'
                      }`}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </div>
                    <span className={`text-[13px] font-bold ${isDay ? 'text-rose-700' : 'text-rose-300'}`}>
                      {t.profile.resetBtn}
                    </span>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isDay ? 'text-rose-300' : 'text-rose-500/60'}`} />
                </button>
              ) : (
                <div
                  className={`p-3.5 space-y-2.5 ${
                    isDay ? 'bg-rose-50/80' : 'bg-rose-950/30'
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

        {/* In-App Feedback & Bug Report Modal */}
        {isFeedbackOpen && (
          <div className="fixed inset-0 z-[75] bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
            <form
              onSubmit={handleSubmitFeedback}
              className={`w-full max-w-sm rounded-3xl border p-5 space-y-3.5 shadow-2xl ${
                isDay
                  ? 'bg-white border-[#dde3ea] text-slate-900'
                  : 'bg-slate-900 border-emerald-800/70 text-slate-100'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={iconBoxCls}>
                    <MessageSquarePlus className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold">{fbCopy.modalTitle}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFeedbackOpen(false)}
                  className={`p-1.5 rounded-xl ${
                    isDay ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'
                  }`}
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {(['suggestion', 'bug', 'prayer_time', 'content', 'other'] as FeedbackCategory[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setFbCategory(cat);
                      if (cat === 'prayer_time') setFbIncludePrayerDiag(true);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition ${
                      fbCategory === cat
                        ? isDay
                          ? 'bg-[#158509] border-[#158509] text-white'
                          : 'bg-amber-400 border-amber-400 text-slate-950'
                        : isDay
                        ? 'bg-slate-50 border-slate-200 text-slate-600'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    {fbCopy.cats[cat]}
                  </button>
                ))}
              </div>

              <textarea
                required
                minLength={4}
                maxLength={1500}
                rows={4}
                value={fbMessage}
                onChange={(e) => setFbMessage(e.target.value)}
                placeholder={fbCopy.msgPlaceholder}
                className={`w-full rounded-2xl border p-3 text-xs leading-relaxed focus:outline-none ${
                  isDay
                    ? 'bg-[#f8fafc] border-slate-300 text-slate-900 focus:border-[#158509]'
                    : 'bg-slate-950 border-emerald-900/70 text-white focus:border-amber-400'
                }`}
              />

              <input
                type="text"
                maxLength={120}
                value={fbContact}
                onChange={(e) => setFbContact(e.target.value)}
                placeholder={fbCopy.contactPlaceholder}
                className={`w-full rounded-xl border px-3 py-2 text-xs focus:outline-none ${
                  isDay
                    ? 'bg-[#f8fafc] border-slate-300 text-slate-900 focus:border-[#158509]'
                    : 'bg-slate-950 border-emerald-900/70 text-white focus:border-amber-400'
                }`}
              />

              <label
                className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-[11px] cursor-pointer ${
                  isDay
                    ? 'bg-[#f6faf5] border-[#dce9d9] text-slate-700'
                    : 'bg-slate-950/70 border-emerald-900/50 text-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={fbIncludePrayerDiag}
                  onChange={(e) => setFbIncludePrayerDiag(e.target.checked)}
                  className="mt-0.5 accent-[#158509]"
                />
                <span>
                  {language === 'ru'
                    ? `Приложить город и метод расчёта намаза (${locationDisplay} · ${calcMethod || 'Uzbekistan'})`
                    : language === 'en'
                    ? `Attach prayer city & calculation method (${locationDisplay} · ${calcMethod || 'Uzbekistan'})`
                    : language === 'uz_cyr'
                    ? `Намоз ҳисоблаш шаҳри ва усулини илова қилиш (${locationDisplay} · ${calcMethod || 'Uzbekistan'})`
                    : `Namoz hisoblash shahri va usulini ilova qilish (${locationDisplay} · ${calcMethod || 'Uzbekistan'})`}
                </span>
              </label>

              {fbResult === 'ok' && (
                <p className={`text-xs font-bold ${isDay ? 'text-[#158509]' : 'text-emerald-400'}`}>
                  ✓ {fbCopy.sentOk}
                </p>
              )}
              {fbResult === 'err' && (
                <p className="text-xs font-semibold text-rose-500">{fbCopy.sentErr}</p>
              )}

              <button
                type="submit"
                disabled={fbSending || fbMessage.trim().length < 4}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition disabled:opacity-50 ${
                  isDay
                    ? 'bg-[#158509] hover:bg-[#0c5007] text-white'
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                }`}
              >
                {fbSending ? fbCopy.sending : fbCopy.sendBtn}
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }

  /* ==================== CLEAN, FOCUSED PROFILE VIEW ==================== */
  return (
    <div
      ref={rootRef}
      className={`space-y-3.5 pb-6 animate-in fade-in ${isDay ? 'text-slate-900' : 'text-slate-100'}`}
    >
      {/* Flagship Identity Hero Card — Settings Gear Icon cleanly anchored top-right */}
      <div
        className={`rounded-3xl p-4 text-white shadow-lg border space-y-3 ${
          isDay ? 'nq-hero-day border-[#0a4306]' : 'nq-hero-night border-emerald-800/60'
        }`}
      >
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
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

          {!isEditingHandle && (
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              aria-label={ui.openSettingsAria}
              title={ui.settingsTitle}
              className="w-9 h-9 rounded-xl bg-white/14 hover:bg-white/24 border border-white/25 text-white flex items-center justify-center shrink-0 transition active:scale-95"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
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

      {/* Asma ul-Husna Signature Card */}
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
            isDay ? 'bg-[#158509] text-white' : 'bg-amber-400 text-slate-950'
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

      {/* Saved Quran Bookmarks — Clear Purpose, 1-Tap Jump to Highlighted Ayah */}
      <div className={`${cardCls} p-3.5 space-y-2.5`}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Bookmark className={`w-4 h-4 shrink-0 ${isDay ? 'text-[#158509]' : 'text-amber-400'}`} />
              <span className="text-[13px] font-bold">
                {t.profile.bookmarksTitle}
                {bookmarks.length > 0 ? ` (${bookmarks.length})` : ''}
              </span>
            </div>
            <p className={`text-[11px] mt-0.5 ${subTextCls}`}>{ui.bookmarksHelp}</p>
          </div>
          {bookmarks.length > 0 && (
            <button
              type="button"
              onClick={onClearBookmarks}
              className={`text-[11px] font-semibold shrink-0 pt-0.5 ${
                isDay ? 'text-rose-600 hover:text-rose-700' : 'text-rose-400 hover:text-rose-300'
              }`}
            >
              {t.profile.clearAll}
            </button>
          )}
        </div>

        {bookmarks.length === 0 ? (
          <div
            className={`rounded-xl border border-dashed p-3 flex items-center justify-between gap-3 ${
              isDay ? 'bg-[#f8fbf7] border-[#d3e4cf]' : 'bg-slate-950/60 border-emerald-900/50'
            }`}
          >
            <p className={`text-[11.5px] leading-relaxed ${subTextCls}`}>{ui.bookmarksEmptyHint}</p>
            <button
              type="button"
              onClick={() => onNavigateTab('quran')}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 flex items-center gap-1 transition active:scale-95 ${
                isDay ? 'bg-[#158509] text-white' : 'bg-amber-400 text-slate-950'
              }`}
            >
              <span>{ui.openQuranBtn}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="space-y-1.5">
            {visibleBookmarks.map((bm) => {
              const surahTitle = getLocalizedSurahMeta(bm.surahNumber, bm.surahName, '', language).name;
              return (
                <div
                  key={bm.id}
                  className={`w-full flex items-center justify-between gap-2 p-2.5 rounded-xl border text-xs transition ${
                    isDay
                      ? 'bg-[#f6faf5] border-[#dce9d9] hover:border-[#158509]/50'
                      : 'bg-slate-950/70 border-slate-800/80 hover:border-amber-400/50'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onOpenSurah(bm.surahNumber, bm.ayahNumber)}
                    className="flex-1 min-w-0 flex items-center gap-2.5 text-left"
                  >
                    <span
                      className={`w-7 h-7 rounded-lg font-mono font-bold text-[11px] flex items-center justify-center shrink-0 ${
                        isDay
                          ? 'bg-[#eef9ea] text-[#0c4703] border border-[#cde8c3]'
                          : 'bg-emerald-950 text-amber-300 border border-emerald-800/60'
                      }`}
                    >
                      {bm.surahNumber}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold truncate">{surahTitle}</div>
                      <div className={`text-[10.5px] font-medium ${isDay ? 'text-[#158509]' : 'text-amber-300'}`}>
                        {t.quran.ayahWord} {bm.ayahNumber}
                      </div>
                    </div>
                  </button>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onRemoveBookmark(bm.id)}
                      className={`p-1.5 rounded-lg transition ${
                        isDay ? 'text-slate-400 hover:text-rose-600' : 'text-slate-500 hover:text-rose-400'
                      }`}
                      aria-label="Remove bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenSurah(bm.surahNumber, bm.ayahNumber)}
                      className={`p-1 rounded-lg ${isDay ? 'text-[#158509]' : 'text-amber-400'}`}
                      aria-label="Open bookmark"
                    >
                      <ChevronRight className="w-4 h-4" />
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

      {/* Year-Round Quran Khatm Progress (Replaces off-season 0/30 Ramadan counter) */}
      <button
        type="button"
        onClick={() => onNavigateTab('quran')}
        className={`${cardCls} w-full px-3.5 py-3 flex items-center justify-between gap-3 text-left transition active:scale-[0.99]`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={iconBoxCls}>
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[12.5px] font-bold truncate">{ui.khatmCardTitle}</span>
              <span className={`text-[11px] font-mono font-bold tabular-nums shrink-0 ${isDay ? 'text-[#158509]' : 'text-amber-300'}`}>
                {ui.khatmCardSub(completedSurahsCount)}
              </span>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDay ? 'bg-slate-100' : 'bg-slate-800'}`}>
              <div
                className={`h-full rounded-full transition-all duration-300 ${isDay ? 'bg-[#158509]' : 'bg-amber-400'}`}
                style={{ width: `${Math.max(completedSurahsCount > 0 ? 4 : 0, Math.round((completedSurahsCount / 114) * 100))}%` }}
              />
            </div>
          </div>
        </div>
        <ChevronRight className={`w-4 h-4 shrink-0 ${subTextCls}`} />
      </button>

      {/* Seasonal Ramadan Fasts Tracker — Only shown during Ramadan or if fasts are already recorded */}
      {(isRamadanSeason || summary.fastedCount > 0) && (
        <button
          type="button"
          onClick={() => onNavigateTab('ramadan')}
          className={`${cardCls} w-full px-3.5 py-3 flex items-center justify-between gap-3 text-left transition active:scale-[0.99]`}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={iconBoxCls}>
              <Moon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12.5px] font-bold truncate">{t.profile.ramadanFastsStat}</span>
                <span className={`text-[11px] font-mono font-bold tabular-nums shrink-0 ${isDay ? 'text-[#158509]' : 'text-amber-300'}`}>
                  {summary.fastedCount} / 30
                </span>
              </div>
              <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDay ? 'bg-slate-100' : 'bg-slate-800'}`}>
                <div
                  className={`h-full rounded-full transition-all duration-300 ${isDay ? 'bg-[#158509]' : 'bg-amber-400'}`}
                  style={{ width: `${Math.min(100, Math.round((summary.fastedCount / 30) * 100))}%` }}
                />
              </div>
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 shrink-0 ${subTextCls}`} />
        </button>
      )}
    </div>
  );
};
