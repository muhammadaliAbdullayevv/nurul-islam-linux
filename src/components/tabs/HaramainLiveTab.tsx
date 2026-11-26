import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Hls from 'hls.js';
import {
  Clock,
  Columns2,
  ExternalLink,
  Heart,
  Loader2,
  Maximize2,
  Minimize2,
  Pause,
  PictureInPicture2,
  Play,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Tv,
  Volume2,
  VolumeX,
  WifiOff,
} from 'lucide-react';
import { AppLanguage } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { getCityCurrentDate } from '../../utils/prayerTimes';
import {
  openExternalUrl,
  setNativeKeepScreenOn,
  setNativeVideoFullscreen,
} from '../../utils/nativePrayerBridge';
import {
  RemoteAppConfig,
  getCachedRemoteAppConfig,
  subscribeRemoteAppConfig,
} from '../../utils/remoteAppConfig';
import { quranRadioPlayer } from '../../utils/quranRadioPlayer';
import { hasNativeQuranAudioBridge, nativeStopAudio } from '../../utils/nativeQuranAudio';
import { webQuranPlayer } from '../../utils/webQuranPlayer';

type HaramainChannelId = 'makkah' | 'madinah';
type StreamSourceMode = 'primary' | 'backup' | 'youtube';
type PlayerStatus = 'loading' | 'playing' | 'paused' | 'error';

interface ChannelSpec {
  id: HaramainChannelId;
  arabicTitle: string;
  arabicSubtitle: string;
  lat: number;
  lng: number;
  timezone: string;
  defaultPrimaryHls: string;
  defaultBackupHls: string;
  youtubeChannelId: string;
  youtubeLiveUrl: string;
  accent: 'gold' | 'emerald';
}

const CHANNELS: Record<HaramainChannelId, ChannelSpec> = {
  makkah: {
    id: 'makkah',
    arabicTitle: 'المسجد الحرام · مكة المكرمة',
    arabicSubtitle: 'قناة القرآن الكريم · بث مباشر ٢٤/٧',
    lat: 21.4225,
    lng: 39.8262,
    timezone: 'Asia/Riyadh',
    defaultPrimaryHls: 'https://win.holol.com/live/quran/playlist.m3u8',
    defaultBackupHls: 'https://cdn-globecast.akamaized.net/live/eds/saudi_quran/hls_roku/index.m3u8',
    youtubeChannelId: 'UCos52azQNBgW63_9uDJoPDA',
    youtubeLiveUrl: 'https://www.youtube.com/@SaudiQuranTv/live',
    accent: 'gold',
  },
  madinah: {
    id: 'madinah',
    arabicTitle: 'المسجد النبوي · المدينة المنورة',
    arabicSubtitle: 'قناة السنة النبوية · بث مباشر ٢٤/٧',
    lat: 24.4672,
    lng: 39.6111,
    timezone: 'Asia/Riyadh',
    defaultPrimaryHls: 'https://win.holol.com/live/sunnah/playlist.m3u8',
    defaultBackupHls: 'https://cdn-globecast.akamaized.net/live/eds/saudi_sunnah/hls_roku/index.m3u8',
    youtubeChannelId: 'UCROKYPep-UuODNwyipe6JMw',
    youtubeLiveUrl: 'https://www.youtube.com/@SaudiSunnahTv/live',
    accent: 'emerald',
  },
};

const HARAMAIN_UI: Record<
  AppLanguage,
  {
    makkahName: string;
    makkahSub: string;
    madinahName: string;
    madinahSub: string;
    dualLabel: string;
    livePill: string;
    connecting: string;
    tapForSound: string;
    soundOn: string;
    muted: string;
    serverHd: string;
    serverBackup: string;
    serverYoutube: string;
    openYoutube: string;
    retry: string;
    syncLive: string;
    fullscreen: string;
    pip: string;
    offlineTitle: string;
    offlineDesc: string;
    localTimeLabel: string;
    nextPrayerIn: string;
    prayersTitle: string;
    ummAlQuraNote: string;
    disabledNotice: string;
    makkahDuaBadge: string;
    makkahDuaTitle: string;
    makkahDuaArabic: string;
    makkahDuaTranslit: string;
    makkahDuaMeaning: string;
    makkahDuaSource: string;
    madinahDuaBadge: string;
    madinahDuaTitle: string;
    madinahDuaArabic: string;
    madinahDuaTranslit: string;
    madinahDuaMeaning: string;
    madinahDuaSource: string;
    salawatBtn: string;
    salawatToday: string;
    resetCounter: string;
    adFreeNote: string;
  }
> = {
  uz_lat: {
    makkahName: 'Makka · Ka’ba',
    makkahSub: 'Masjidul Harom · 24/7',
    madinahName: 'Madina · Ravza',
    madinahSub: 'Masjidun Nabaviy · 24/7',
    dualLabel: 'Ikkalasi',
    livePill: 'JONLI',
    connecting: 'Jonli efirga ulanmoqda...',
    tapForSound: 'Ovozni yoqish',
    soundOn: 'Ovoz yoniq',
    muted: 'Ovoz o‘chiq',
    serverHd: 'HD Efir',
    serverBackup: 'Zaxira',
    serverYoutube: 'YouTube',
    openYoutube: 'YouTube’da ochish',
    retry: 'Qayta urinish',
    syncLive: 'Jonli nuqtaga qaytish',
    fullscreen: 'To‘liq ekran',
    pip: 'Kichik oyna (PiP)',
    offlineTitle: 'Efirga ulanib bo‘lmadi',
    offlineDesc: 'Internet aloqasini tekshiring yoki zaxira server / YouTube orqali tomosha qiling.',
    localTimeLabel: 'Mahalliy vaqt (Saudiya)',
    nextPrayerIn: 'Keyingi namoz:',
    prayersTitle: 'Haramayn namoz vaqtlari',
    ummAlQuraNote: 'Ummul Quro (Makka) taqvimi bo‘yicha',
    disabledNotice: 'Jonli Haramayn efiri hozircha vaqtincha to‘xtatilgan.',
    makkahDuaBadge: 'KA’BANI KO‘RGANDA DUO',
    makkahDuaTitle: 'Baytullohga boqib o‘qiladigan muborak duo',
    makkahDuaArabic:
      'اللَّهُمَّ زِدْ هَذَا الْبَيْتَ تَشْرِيفًا وَتَعْظِيمًا وَتَكْرِيمًا وَمَهَابَةً، وَزِدْ مَنْ شَرَّفَهُ وَكَرَّمَهُ مِمَّنْ حَجَّهُ أَوِ اعْتَمَرَهُ تَشْرِيفًا وَتَكْرِيمًا وَتَعْظِيمًا وَبِرًّا',
    makkahDuaTranslit:
      'Allohumma zid hazal-bayta tashrifan va ta’ziman va takriman va mahabatan, va zid man sharrafahu va karramahu mimman hajjahu av i’tamarahu tashrifan va takriman va ta’ziman va birro.',
    makkahDuaMeaning:
      '“Ey Alloh! Ushbu Baytning sharafini, ulug‘ligini, hurmatini va haybatini ziyoda qil! Uni haj yoki umra qilib ulug‘lagan kishilarning ham sharafi, hurmati, ulug‘ligi va yaxshiligini ziyoda ayla!”',
    makkahDuaSource: 'Imom Shofi’iy («Al-Umm») va Imom Navaviy («Al-Azkor»)',
    madinahDuaBadge: 'SALAVOTI SHARIF',
    madinahDuaTitle: 'Rasululloh ﷺ ga salavot va salom yo‘llang',
    madinahDuaArabic:
      'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
    madinahDuaTranslit:
      'Allohumma solli ‘ala Muhammadin va ‘ala ali Muhammad, kama sollayta ‘ala Ibrohima va ‘ala ali Ibrohim, innaka Hamidun Majid.',
    madinahDuaMeaning:
      '“Ey Alloh! Ibrohim va Ibrohim oilasiga rahmat yo‘llaganingdek, Muhammadga va Muhammad oilasiga ham rahmat yo‘lla. Albatta, Sen maqtovga loyiq va ulug‘ Zotsan!”',
    madinahDuaSource: 'Sahihi Buxoriy (3370) · Sahihi Muslim (406)',
    salawatBtn: 'Salavot aytdim · ﷺ',
    salawatToday: 'Bugungi salavotlar:',
    resetCounter: 'Nolga tushirish',
    adFreeNote: 'Reklamasiz to‘g‘ridan-to‘g‘ri rasmiy HD efir',
  },
  uz_cyr: {
    makkahName: 'Макка · Каъба',
    makkahSub: 'Масжидул Ҳаром · 24/7',
    madinahName: 'Мадина · Равза',
    madinahSub: 'Масжидун Набавий · 24/7',
    dualLabel: 'Иккаласи',
    livePill: 'ЖОНЛИ',
    connecting: 'Жонли эфирга уланмоқда...',
    tapForSound: 'Овозни ёқиш',
    soundOn: 'Овоз ёниқ',
    muted: 'Овоз ўчиқ',
    serverHd: 'HD Эфир',
    serverBackup: 'Захира',
    serverYoutube: 'YouTube',
    openYoutube: 'YouTube’да очиш',
    retry: 'Қайта уриниш',
    syncLive: 'Жонли нуқтага қайтиш',
    fullscreen: 'Тўлиқ экран',
    pip: 'Кичик ойна (PiP)',
    offlineTitle: 'Эфирга уланиб бўлмади',
    offlineDesc: 'Интернет алоқасини текширинг ёки захира сервер / YouTube орқали томоша қилинг.',
    localTimeLabel: 'Маҳаллий вақт (Саудия)',
    nextPrayerIn: 'Кейинги намоз:',
    prayersTitle: 'Ҳарамайн намоз вақтлари',
    ummAlQuraNote: 'Уммул Қуро (Макка) тақвими бўйича',
    disabledNotice: 'Жонли Ҳарамайн эфири ҳозирча вақтинча тўхтатилган.',
    makkahDuaBadge: 'КАЪБАНИ КЎРГАНДА ДУО',
    makkahDuaTitle: 'Байтуллоҳга боқиб ўқиладиган муборак дуо',
    makkahDuaArabic:
      'اللَّهُمَّ زِدْ هَذَا الْبَيْتَ تَشْرِيفًا وَتَعْظِيمًا وَتَكْرِيمًا وَمَهَابَةً، وَزِدْ مَنْ شَرَّفَهُ وَكَرَّمَهُ مِمَّنْ حَجَّهُ أَوِ اعْتَمَرَهُ تَشْرِيفًا وَتَكْرِيمًا وَتَعْظِيمًا وَبِرًّا',
    makkahDuaTranslit:
      'Аллоҳумма зид ҳазал-байта ташрифан ва таъзиман ва такриман ва маҳабатан, ва зид ман шаррафаҳу ва каррамаҳу мимман ҳажжаҳу ав иътамараҳу ташрифан ва такриман ва таъзиман ва бирро.',
    makkahDuaMeaning:
      '«Эй Аллоҳ! Ушбу Байтнинг шарафини, улуғлигини, ҳурматини ва ҳайбатини зиёда қил! Уни ҳаж ёки умра қилиб улуғлаган кишиларнинг ҳам шарафи, ҳурмати, улуғлиги ва яхшилигини зиёда айла!»',
    makkahDuaSource: 'Имом Шофиъий («Ал-Умм») ва Имом Нававий («Ал-Азкор»)',
    madinahDuaBadge: 'САЛАВОТИ ШАРИФ',
    madinahDuaTitle: 'Расулуллоҳ ﷺ га салавот ва салом йўлланг',
    madinahDuaArabic:
      'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
    madinahDuaTranslit:
      'Аллоҳумма солли ъала Муҳаммадин ва ъала али Муҳаммад, кама соллайта ъала Иброҳима ва ъала али Иброҳим, иннака Ҳамидун Мажид.',
    madinahDuaMeaning:
      '«Эй Аллоҳ! Иброҳим ва Иброҳим оиласига раҳмат йўллаганингдек, Муҳаммадга ва Муҳаммад оиласига ҳам раҳмат йўлла. Албатта, Сен мақтовга лойиқ ва улуғ Зотсан!»',
    madinahDuaSource: 'Саҳиҳи Бухорий (3370) · Саҳиҳи Муслим (406)',
    salawatBtn: 'Салавот айтдим · ﷺ',
    salawatToday: 'Бугунги салавотлар:',
    resetCounter: 'Нолга тушириш',
    adFreeNote: 'Рекламасиз тўғридан-тўғри расмий HD эфир',
  },
  ru: {
    makkahName: 'Мекка · Кааба',
    makkahSub: 'Мечеть аль-Харам · 24/7',
    madinahName: 'Медина · Рауда',
    madinahSub: 'Мечеть Пророка ﷺ · 24/7',
    dualLabel: 'Оба экрана',
    livePill: 'ЭФИР',
    connecting: 'Подключение к прямому эфиру...',
    tapForSound: 'Включить звук',
    soundOn: 'Звук включён',
    muted: 'Без звука',
    serverHd: 'HD Эфир',
    serverBackup: 'Резерв',
    serverYoutube: 'YouTube',
    openYoutube: 'Открыть в YouTube',
    retry: 'Повторить',
    syncLive: 'Вернуться в прямой эфир',
    fullscreen: 'На весь экран',
    pip: 'Картинка в картинке',
    offlineTitle: 'Не удалось подключиться',
    offlineDesc: 'Проверьте интернет-соединение или переключитесь на резервный сервер / YouTube.',
    localTimeLabel: 'Местное время (Саудовская Аравия)',
    nextPrayerIn: 'Следующий намаз:',
    prayersTitle: 'Время намаза в Харамайне',
    ummAlQuraNote: 'По календарю Умм аль-Кура (Мекка)',
    disabledNotice: 'Прямая трансляция Харамайн временно приостановлена.',
    makkahDuaBadge: 'ДУА ПРИ ВИДЕ КААБЫ',
    makkahDuaTitle: 'Благословенное дуа при взгляде на Каабу',
    makkahDuaArabic:
      'اللَّهُمَّ زِدْ هَذَا الْبَيْتَ تَشْرِيفًا وَتَعْظِيمًا وَتَكْرِيمًا وَمَهَابَةً، وَزِدْ مَنْ شَرَّفَهُ وَكَرَّمَهُ مِمَّنْ حَجَّهُ أَوِ اعْتَمَرَهُ تَشْرِيفًا وَتَكْرِيمًا وَتَعْظِيمًا وَبِرًّا',
    makkahDuaTranslit:
      'Аллахумма зид хазаль-байта ташрифан ва та‘зыман ва такриман ва махабатан, ва зид ман шаррафаху ва каррамаху мимман хаджжаху ави‘тамараху ташрифан ва такриман ва та‘зыман ва бирра.',
    makkahDuaMeaning:
      '«О Аллах! Увеличь почёт, величие, уважение и благоговение этого Дома! И увеличь почёт, уважение, величие и благочестие того, кто почитает его, совершая к нему хадж или умру!»',
    makkahDuaSource: 'Имам аш-Шафии («Аль-Умм») и имам ан-Навави («Аль-Азкар»)',
    madinahDuaBadge: 'САЛАВАТ ПРОРОКУ ﷺ',
    madinahDuaTitle: 'Направьте салават Посланнику Аллаха ﷺ',
    madinahDuaArabic:
      'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
    madinahDuaTranslit:
      'Аллахумма салли ‘аля Мухаммадин ва ‘аля али Мухаммад, кама салляйта ‘аля Ибрахима ва ‘аля али Ибрахим, иннака Хамидун Маджид.',
    madinahDuaMeaning:
      '«О Аллах! Благослови Мухаммада и род Мухаммада, как Ты благословил Ибрахима и род Ибрахима. Поистине, Ты — Достохвальный, Славный!»',
    madinahDuaSource: 'Сахих аль-Бухари (3370) · Сахих Муслим (406)',
    salawatBtn: 'Прочитал салават · ﷺ',
    salawatToday: 'Салаватов сегодня:',
    resetCounter: 'Сбросить',
    adFreeNote: 'Официальный прямой HD-поток без рекламы',
  },
  en: {
    makkahName: 'Makkah · Kaaba',
    makkahSub: 'Al-Masjid al-Haram · 24/7',
    madinahName: 'Madinah · Nabawi',
    madinahSub: 'Al-Masjid an-Nabawi · 24/7',
    dualLabel: 'Dual View',
    livePill: 'LIVE',
    connecting: 'Connecting to live broadcast...',
    tapForSound: 'Tap for Sound',
    soundOn: 'Sound On',
    muted: 'Muted',
    serverHd: 'HD Live',
    serverBackup: 'Backup',
    serverYoutube: 'YouTube',
    openYoutube: 'Open in YouTube',
    retry: 'Retry',
    syncLive: 'Jump to Live Edge',
    fullscreen: 'Fullscreen',
    pip: 'Picture-in-Picture',
    offlineTitle: 'Unable to reach live stream',
    offlineDesc: 'Check your connection or switch to the Backup server / YouTube Live.',
    localTimeLabel: 'Local Time (Saudi Arabia)',
    nextPrayerIn: 'Next prayer:',
    prayersTitle: 'Haramain Prayer Times',
    ummAlQuraNote: 'Calculated via Umm al-Qura (Makkah)',
    disabledNotice: 'Haramain Live streaming is temporarily paused by administrator.',
    makkahDuaBadge: 'DUA UPON SEEING THE KAABA',
    makkahDuaTitle: 'Supplication when beholding the Sacred House',
    makkahDuaArabic:
      'اللَّهُمَّ زِدْ هَذَا الْبَيْتَ تَشْرِيفًا وَتَعْظِيمًا وَتَكْرِيمًا وَمَهَابَةً، وَزِدْ مَنْ شَرَّفَهُ وَكَرَّمَهُ مِمَّنْ حَجَّهُ أَوِ اعْتَمَرَهُ تَشْرِيفًا وَتَكْرِيمًا وَتَعْظِيمًا وَبِرًّا',
    makkahDuaTranslit:
      'Allahumma zid hadhal-bayta tashrifan wa ta‘ziman wa takriman wa mahabatan, wa zid man sharrafahu wa karramahu mimman hajjahu awi‘tamarahu tashrifan wa takriman wa ta‘ziman wa birra.',
    makkahDuaMeaning:
      '“O Allah, increase this House in honor, magnificence, veneration, and awe; and increase those who honor and revere it by performing Hajj or Umrah in honor, nobility, magnificence, and righteousness.”',
    makkahDuaSource: 'Imam al-Shafi‘i (Al-Umm) & Imam al-Nawawi (Al-Adhkar)',
    madinahDuaBadge: 'SALAWAT UPON THE PROPHET ﷺ',
    madinahDuaTitle: 'Send peace and blessings upon Rasulullah ﷺ',
    madinahDuaArabic:
      'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
    madinahDuaTranslit:
      'Allahumma salli ‘ala Muhammadin wa ‘ala ali Muhammad, kama sallayta ‘ala Ibrahima wa ‘ala ali Ibrahim, innaka Hamidun Majid.',
    madinahDuaMeaning:
      '“O Allah, send prayers upon Muhammad and upon the family of Muhammad, as You sent prayers upon Ibrahim and upon the family of Ibrahim; indeed, You are Praiseworthy and Glorious.”',
    madinahDuaSource: 'Sahih al-Bukhari (3370) · Sahih Muslim (406)',
    salawatBtn: 'Sent Salawat · ﷺ',
    salawatToday: 'Today’s Salawat:',
    resetCounter: 'Reset',
    adFreeNote: 'Ad-free direct official HD livestream',
  },
};

function stopConflictingAppAudio(): void {
  try {
    const rState = quranRadioPlayer.getState();
    if (rState.active || rState.status === 'playing' || rState.status === 'connecting') {
      quranRadioPlayer.stop();
    }
  } catch {
    // ignore
  }
  try {
    if (hasNativeQuranAudioBridge()) {
      nativeStopAudio();
    } else {
      webQuranPlayer.pause();
    }
  } catch {
    // ignore
  }
}

function getTodaySalawatStorageKey(): string {
  const d = new Date();
  return `nq_haramain_salawat_${d.getFullYear()}_${d.getMonth() + 1}_${d.getDate()}`;
}

function loadTodaySalawatCount(): number {
  try {
    const raw = localStorage.getItem(getTodaySalawatStorageKey());
    const n = Number(raw);
    return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
  } catch {
    return 0;
  }
}

interface StreamPlayerCardProps {
  channel: ChannelSpec;
  title: string;
  subtitle: string;
  customPrimaryUrl: string;
  muted: boolean;
  onMutedChange: (nextMuted: boolean) => void;
  compact?: boolean;
  isDay: boolean;
  ui: (typeof HARAMAIN_UI)[AppLanguage];
  localClock: string;
}

const StreamPlayerCard: React.FC<StreamPlayerCardProps> = ({
  channel,
  title,
  subtitle,
  customPrimaryUrl,
  muted,
  onMutedChange,
  compact = false,
  isDay,
  ui,
  localClock,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [sourceMode, setSourceMode] = useState<StreamSourceMode>('primary');
  const [status, setStatus] = useState<PlayerStatus>('loading');
  const [reloadNonce, setReloadNonce] = useState<number>(0);
  const [needsSoundTap, setNeedsSoundTap] = useState<boolean>(false);
  const [resolutionLabel, setResolutionLabel] = useState<string>('HD');
  const [pipSupported, setPipSupported] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const pinchRef = useRef<{
    active: boolean;
    initialDist: number;
    initialScale: number;
    panStartX: number;
    panStartY: number;
    originPanX: number;
    originPanY: number;
  }>({
    active: false,
    initialDist: 0,
    initialScale: 1,
    panStartX: 0,
    panStartY: 0,
    originPanX: 0,
    originPanY: 0,
  });

  const primaryUrl =
    customPrimaryUrl && /^https?:\/\//i.test(customPrimaryUrl)
      ? customPrimaryUrl
      : channel.defaultPrimaryHls;
  const backupUrl = channel.defaultBackupHls;

  // Reset to primary HD stream & 1x zoom whenever switching channel
  useEffect(() => {
    setSourceMode('primary');
    setStatus('loading');
    setNeedsSoundTap(false);
    setResolutionLabel('HD');
    setZoomScale(1);
    setPan({ x: 0, y: 0 });
  }, [channel.id, primaryUrl]);

  // Handle Android hardware Back button to exit fullscreen cleanly
  useEffect(() => {
    if (!isFullscreen) return;
    const onBack = (e: Event) => {
      e.preventDefault();
      setIsFullscreen(false);
      setNativeVideoFullscreen(false);
    };
    window.addEventListener('nq:android-back', onBack);
    return () => window.removeEventListener('nq:android-back', onBack);
  }, [isFullscreen]);

  // Ensure fullscreen orientation resets if component unmounts
  useEffect(() => {
    return () => {
      setNativeVideoFullscreen(false);
    };
  }, []);

  useEffect(() => {
    setPipSupported(
      typeof document !== 'undefined' &&
        'pictureInPictureEnabled' in document &&
        Boolean((document as Document & { pictureInPictureEnabled?: boolean }).pictureInPictureEnabled)
    );
  }, []);

  // Sync mute state immediately to active <video> element
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
    if (!muted) {
      setNeedsSoundTap(false);
      stopConflictingAppAudio();
    }
  }, [muted]);

  // Attach HLS stream or native Safari HLS whenever channel/sourceMode/reloadNonce changes
  useEffect(() => {
    if (sourceMode === 'youtube') {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      setStatus('playing');
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    let loadWatchdog: number | null = null;
    let waitingTimer: number | null = null;
    const streamUrl = sourceMode === 'primary' ? primaryUrl : backupUrl;

    setStatus('loading');
    setResolutionLabel(sourceMode === 'primary' ? '720p HD' : 'SD');

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const clearWaitingTimer = () => {
      if (waitingTimer !== null) {
        window.clearTimeout(waitingTimer);
        waitingTimer = null;
      }
    };

    const triggerFailover = () => {
      if (cancelled) return;
      clearWaitingTimer();
      if (sourceMode === 'primary') {
        setSourceMode('backup');
      } else {
        setStatus('error');
      }
    };

    const startPlayback = async () => {
      if (cancelled || !video) return;
      video.muted = muted;
      try {
        await video.play();
        if (!cancelled) {
          clearWaitingTimer();
          setStatus('playing');
          if (!muted) stopConflictingAppAudio();
        }
      } catch (err) {
        if (cancelled) return;
        const name = err instanceof Error ? err.name : '';
        // Browser blocked unmuted autoplay: fall back gracefully to muted playback + show Tap for Sound pill
        if (!video.muted && (name === 'NotAllowedError' || name === 'AbortError')) {
          video.muted = true;
          onMutedChange(true);
          setNeedsSoundTap(true);
          try {
            await video.play();
            if (!cancelled) {
              clearWaitingTimer();
              setStatus('playing');
            }
          } catch {
            if (!cancelled) setStatus('paused');
          }
        } else {
          setStatus('paused');
        }
      }
    };

    const onPlaying = () => {
      if (cancelled) return;
      clearWaitingTimer();
      if (loadWatchdog) {
        window.clearTimeout(loadWatchdog);
        loadWatchdog = null;
      }
      setStatus('playing');
      if (video.videoHeight >= 700) {
        setResolutionLabel('720p HD');
      } else if (video.videoHeight > 0) {
        setResolutionLabel(`${video.videoHeight}p`);
      }
    };

    const onTimeUpdate = () => {
      if (!cancelled && !video.paused && video.readyState >= 2) {
        clearWaitingTimer();
        setStatus((prev) => (prev === 'loading' ? 'playing' : prev));
      }
    };

    // Debounce waiting event by 1600ms so brief 10-second segment transitions never flash a black loading screen
    const onWaiting = () => {
      if (cancelled) return;
      clearWaitingTimer();
      waitingTimer = window.setTimeout(() => {
        if (!cancelled && video.readyState < 3) {
          setStatus('loading');
        }
      }, 1600);
    };

    const onPause = () => {
      clearWaitingTimer();
      if (!cancelled && video.readyState >= 2) setStatus('paused');
    };

    const onVideoError = () => {
      if (!cancelled) triggerFailover();
    };

    video.addEventListener('playing', onPlaying);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('pause', onPause);
    video.addEventListener('error', onVideoError);

    // Failover watchdog if first frame doesn't arrive within 14s
    loadWatchdog = window.setTimeout(() => {
      if (!cancelled && video.readyState < 2) {
        triggerFailover();
      }
    }, 14_000);

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        capLevelToPlayerSize: false,
        startLevel: -1,
        abrEwmaDefaultEstimate: 8_000_000,
        backBufferLength: 30,
        maxBufferLength: 60,
        maxMaxBufferLength: 120,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 6,
        fragLoadingTimeOut: 18000,
        fragLoadingMaxRetry: 6,
        manifestLoadingTimeOut: 12000,
        manifestLoadingMaxRetry: 4,
      });
      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // Lock immediately to the highest resolution / bitrate HD stream level
        if (Array.isArray(hls.levels) && hls.levels.length > 0) {
          let bestIdx = hls.levels.length - 1;
          let bestScore = -1;
          hls.levels.forEach((lvl, idx) => {
            const score = (lvl.height || 0) * 1_000_000 + (lvl.bitrate || 0);
            if (score >= bestScore) {
              bestScore = score;
              bestIdx = idx;
            }
          });
          hls.currentLevel = bestIdx;
          hls.loadLevel = bestIdx;
          hls.nextLevel = bestIdx;
          const topLvl = hls.levels[bestIdx];
          if (topLvl?.height) {
            setResolutionLabel(topLvl.height >= 700 ? `${topLvl.height}p HD` : `${topLvl.height}p`);
          }
        }
        void startPlayback();
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_e, data) => {
        const lvl = hls.levels[data.level];
        if (lvl?.height) {
          setResolutionLabel(lvl.height >= 700 ? `${lvl.height}p HD` : `${lvl.height}p`);
        }
      });

      let mediaRecoveryAttempts = 0;
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (cancelled || !data.fatal) return;
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR && mediaRecoveryAttempts < 3) {
          mediaRecoveryAttempts += 1;
          hls.startLoad();
          return;
        }
        if (data.type === Hls.ErrorTypes.MEDIA_ERROR && mediaRecoveryAttempts < 3) {
          mediaRecoveryAttempts += 1;
          hls.recoverMediaError();
          return;
        }
        hls.destroy();
        hlsRef.current = null;
        triggerFailover();
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      video.load();
      void startPlayback();
    } else {
      setSourceMode('youtube');
    }

    return () => {
      cancelled = true;
      clearWaitingTimer();
      if (loadWatchdog) window.clearTimeout(loadWatchdog);
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('error', onVideoError);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      try {
        video.pause();
        video.removeAttribute('src');
        video.load();
      } catch {
        // ignore
      }
    };
  }, [backupUrl, channel.id, primaryUrl, reloadNonce, sourceMode]);

  const handleTogglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video || sourceMode === 'youtube') return;
    if (video.paused) {
      stopConflictingAppAudio();
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [sourceMode]);

  const handleToggleMute = useCallback(() => {
    const next = !muted;
    onMutedChange(next);
    const video = videoRef.current;
    if (video) {
      video.muted = next;
      if (!next) {
        stopConflictingAppAudio();
        setNeedsSoundTap(false);
        if (video.paused) {
          void video.play().catch(() => {});
        }
      }
    }
  }, [muted, onMutedChange]);

  const handleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => {
      const next = !prev;
      setNativeVideoFullscreen(next);
      if (!next) {
        setZoomScale(1);
        setPan({ x: 0, y: 0 });
      }
      return next;
    });
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        pinchRef.current.active = true;
        pinchRef.current.initialDist = Math.max(10, Math.hypot(dx, dy));
        pinchRef.current.initialScale = zoomScale;
      } else if (e.touches.length === 1 && zoomScale > 1.02) {
        pinchRef.current.active = false;
        pinchRef.current.panStartX = e.touches[0].clientX;
        pinchRef.current.panStartY = e.touches[0].clientY;
        pinchRef.current.originPanX = pan.x;
        pinchRef.current.originPanY = pan.y;
      }
    },
    [pan.x, pan.y, zoomScale]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length === 2 && pinchRef.current.active) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const rawScale = pinchRef.current.initialScale * (dist / pinchRef.current.initialDist);
        const clamped = Math.max(1, Math.min(4, rawScale));
        setZoomScale(clamped);
        if (clamped <= 1.02) {
          setPan({ x: 0, y: 0 });
        }
      } else if (e.touches.length === 1 && !pinchRef.current.active && zoomScale > 1.02) {
        const box = containerRef.current;
        const maxPanX = box ? ((zoomScale - 1) * box.clientWidth) / 2 : 160;
        const maxPanY = box ? ((zoomScale - 1) * box.clientHeight) / 2 : 100;
        const nextX = pinchRef.current.originPanX + (e.touches[0].clientX - pinchRef.current.panStartX);
        const nextY = pinchRef.current.originPanY + (e.touches[0].clientY - pinchRef.current.panStartY);
        setPan({
          x: Math.max(-maxPanX, Math.min(maxPanX, nextX)),
          y: Math.max(-maxPanY, Math.min(maxPanY, nextY)),
        });
      }
    },
    [zoomScale]
  );

  const handleTouchEnd = useCallback(() => {
    pinchRef.current.active = false;
    if (zoomScale <= 1.04) {
      setZoomScale(1);
      setPan({ x: 0, y: 0 });
    }
  }, [zoomScale]);

  const handlePiP = useCallback(async () => {
    const video = videoRef.current as
      | (HTMLVideoElement & { requestPictureInPicture?: () => Promise<unknown> })
      | null;
    if (!video || typeof video.requestPictureInPicture !== 'function') return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSyncLive = useCallback(() => {
    setReloadNonce((n) => n + 1);
  }, []);

  const youtubeEmbedUrl = `https://www.youtube.com/embed/live_stream?channel=${channel.youtubeChannelId}&autoplay=1&mute=${
    muted ? 1 : 0
  }&rel=0&modestbranding=1&playsinline=1`;

  const accentBadgeCls =
    channel.accent === 'gold'
      ? 'from-amber-500/25 to-amber-600/10 border-amber-400/40 text-amber-200'
      : 'from-emerald-500/25 to-emerald-600/10 border-emerald-400/40 text-emerald-200';

  return (
    <div
      className={
        isFullscreen
          ? 'fixed inset-0 z-[160] w-screen h-screen bg-black flex flex-col justify-between overflow-hidden'
          : `-mx-3.5 sm:mx-0 rounded-none sm:rounded-3xl overflow-hidden border-y sm:border shadow-xl transition-colors ${
              isDay
                ? 'bg-white border-[#dce6dc] shadow-emerald-950/8'
                : 'bg-[#081711] border-emerald-800/45 shadow-black/40'
            }`
      }
    >
      {/* Full Phone-Width Cinema Video Viewport (Two-Finger Pinch-to-Zoom enabled) */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: zoomScale > 1.02 ? 'none' : 'pan-y' }}
        className={
          isFullscreen
            ? 'relative flex-1 w-full h-full bg-black overflow-hidden select-none group flex items-center justify-center'
            : 'relative w-full aspect-video bg-[#040c09] overflow-hidden select-none group'
        }
      >
        {sourceMode === 'youtube' ? (
          <iframe
            key={`${channel.id}-yt-${reloadNonce}`}
            src={youtubeEmbedUrl}
            title={title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted={muted}
            onClick={handleTogglePlay}
            style={{
              transform:
                zoomScale > 1.01
                  ? `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoomScale})`
                  : undefined,
              transformOrigin: 'center center',
            }}
            className={`w-full h-full cursor-pointer transition-transform duration-75 ${
              isFullscreen ? 'object-contain' : 'object-cover'
            }`}
          />
        )}

        {/* Top Subtle Vignette Overlay */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/75 via-black/30 to-transparent" />

        {/* Top-Left Live Status + Channel Badge */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 pointer-events-none">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-600/95 text-white text-[10.5px] font-extrabold tracking-wider shadow-lg backdrop-blur-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {ui.livePill}
              {compact && <span className="opacity-95 font-extrabold">· {title}</span>}
              {!compact && sourceMode !== 'youtube' && (
                <span className="opacity-90 font-bold">· {resolutionLabel}</span>
              )}
            </span>

            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r border text-[10.5px] font-bold backdrop-blur-md ${accentBadgeCls}`}
            >
              <Clock className="w-3 h-3" />
              <span className="tabular-nums">{localClock}</span>
            </span>
          </div>

          {!compact && (
            <div className="hidden sm:flex flex-col items-end text-right drop-shadow">
              <span
                className="text-white/95 text-xs font-bold leading-tight"
                style={{ fontFamily: "'Amiri', serif" }}
                dir="rtl"
              >
                {channel.arabicTitle}
              </span>
              <span className="text-[10px] text-white/70 font-medium">{subtitle}</span>
            </div>
          )}
        </div>

        {/* Loading Spinner Overlay */}
        {sourceMode !== 'youtube' && status === 'loading' && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-black/45 backdrop-blur-[2px] gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-black/60 border border-white/15 flex items-center justify-center shadow-lg">
              <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
            </div>
            <span className="text-xs font-semibold text-white/90 px-3 py-1 rounded-full bg-black/50">
              {ui.connecting}
            </span>
          </div>
        )}

        {/* Tap for Sound Floating CTA (when autoplay had to start muted) */}
        {sourceMode !== 'youtube' && status === 'playing' && (needsSoundTap || muted) && (
          <button
            type="button"
            onClick={handleToggleMute}
            className="absolute bottom-3.5 left-3.5 inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/75 hover:bg-black/90 text-white border border-white/25 text-xs font-bold shadow-xl backdrop-blur-md transition active:scale-95"
          >
            <VolumeX className="w-4 h-4 text-amber-400" />
            <span>{ui.tapForSound}</span>
          </button>
        )}

        {/* Paused Center Play Overlay */}
        {sourceMode !== 'youtube' && status === 'paused' && (
          <button
            type="button"
            onClick={handleTogglePlay}
            aria-label="Play"
            className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-[#158509]/92 hover:bg-[#199e0b] text-white flex items-center justify-center shadow-2xl border-2 border-white/30 transition active:scale-95"
          >
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </button>
        )}

        {/* Error Recovery Overlay */}
        {sourceMode !== 'youtube' && status === 'error' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-5 text-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/20 border border-rose-400/30 text-rose-300 flex items-center justify-center">
              <WifiOff className="w-5 h-5" />
            </div>
            <div className="space-y-1 max-w-xs">
              <p className="text-sm font-bold text-white">{ui.offlineTitle}</p>
              <p className="text-[11.5px] text-slate-300 leading-relaxed">{ui.offlineDesc}</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSourceMode('primary');
                  setReloadNonce((n) => n + 1);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#158509] hover:bg-[#199b0b] text-white text-xs font-bold transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {ui.retry}
              </button>
              <button
                type="button"
                onClick={() => setSourceMode('youtube')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/12 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition"
              >
                <Tv className="w-3.5 h-3.5" />
                {ui.serverYoutube}
              </button>
              <button
                type="button"
                onClick={() => openExternalUrl(channel.youtubeLiveUrl)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600/85 hover:bg-rose-600 text-white text-xs font-bold transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {ui.openYoutube}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Clean Control Dock Below Video */}
      <div
        className={`px-3.5 py-3 flex flex-wrap items-center justify-between gap-2.5 border-t ${
          isDay ? 'bg-[#f8fbf7] border-[#e4ece3]' : 'bg-[#0b1d16] border-emerald-900/50'
        }`}
      >
        {/* Left: Playback & Audio Controls */}
        <div className="flex items-center gap-1.5">
          {sourceMode !== 'youtube' && (
            <>
              <button
                type="button"
                onClick={handleTogglePlay}
                className={`inline-flex items-center justify-center w-9 h-9 rounded-xl font-bold transition active:scale-95 ${
                  isDay
                    ? 'bg-[#158509] hover:bg-[#116f07] text-white shadow-xs'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
                title={status === 'playing' ? 'Pause' : 'Play'}
              >
                {status === 'playing' ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={handleToggleMute}
                className={`inline-flex items-center gap-1.5 px-3 h-9 rounded-xl text-xs font-bold border transition active:scale-95 ${
                  muted
                    ? isDay
                      ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                      : 'bg-amber-500/15 border-amber-500/35 text-amber-200 hover:bg-amber-500/25'
                    : isDay
                    ? 'bg-white border-[#d6e2d5] text-slate-700 hover:bg-emerald-50'
                    : 'bg-emerald-950/70 border-emerald-800/60 text-emerald-100 hover:bg-emerald-900/70'
                }`}
              >
                {muted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className={`w-4 h-4 ${isDay ? 'text-[#158509]' : 'text-emerald-400'}`} />
                )}
                <span className="hidden sm:inline">{muted ? ui.muted : ui.soundOn}</span>
              </button>

              <button
                type="button"
                onClick={handleSyncLive}
                title={ui.syncLive}
                className={`inline-flex items-center justify-center w-9 h-9 rounded-xl border transition active:scale-95 ${
                  isDay
                    ? 'bg-white border-[#d6e2d5] text-slate-600 hover:bg-emerald-50 hover:text-[#158509]'
                    : 'bg-emerald-950/60 border-emerald-800/50 text-slate-300 hover:bg-emerald-900/60 hover:text-white'
                }`}
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </>
          )}

          {sourceMode !== 'youtube' && pipSupported && (
            <button
              type="button"
              onClick={() => void handlePiP()}
              title={ui.pip}
              className={`hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-xl border transition active:scale-95 ${
                isDay
                  ? 'bg-white border-[#d6e2d5] text-slate-600 hover:bg-emerald-50 hover:text-[#158509]'
                  : 'bg-emerald-950/60 border-emerald-800/50 text-slate-300 hover:bg-emerald-900/60 hover:text-white'
              }`}
            >
              <PictureInPicture2 className="w-4 h-4" />
            </button>
          )}

          {sourceMode !== 'youtube' && (
            <button
              type="button"
              onClick={handleFullscreen}
              title={ui.fullscreen}
              className={`inline-flex items-center justify-center w-9 h-9 rounded-xl border transition active:scale-95 ${
                isFullscreen
                  ? 'bg-[#158509] border-[#158509] text-white'
                  : isDay
                  ? 'bg-white border-[#d6e2d5] text-slate-600 hover:bg-emerald-50 hover:text-[#158509]'
                  : 'bg-emerald-950/60 border-emerald-800/50 text-slate-300 hover:bg-emerald-900/60 hover:text-white'
              }`}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Right: Server Selector + External YouTube Fallback */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div
            className={`inline-flex items-center p-0.5 rounded-xl border text-[11px] font-bold ${
              isDay
                ? 'bg-[#edf3ec] border-[#d6e2d5]'
                : 'bg-[#06130e] border-emerald-900/60'
            }`}
          >
            {(
              [
                { id: 'primary', label: ui.serverHd },
                { id: 'backup', label: ui.serverBackup },
                { id: 'youtube', label: ui.serverYoutube },
              ] as Array<{ id: StreamSourceMode; label: string }>
            ).map((opt) => {
              const active = sourceMode === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setSourceMode(opt.id);
                    if (opt.id !== 'youtube') setReloadNonce((n) => n + 1);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg transition ${
                    active
                      ? isDay
                        ? 'bg-white text-[#116b08] shadow-xs'
                        : 'bg-emerald-600 text-white shadow-xs'
                      : isDay
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => openExternalUrl(channel.youtubeLiveUrl)}
            title={ui.openYoutube}
            className={`inline-flex items-center gap-1 px-2.5 h-8 rounded-xl text-[11px] font-bold border transition ${
              isDay
                ? 'bg-white border-[#d6e2d5] text-slate-600 hover:border-rose-300 hover:text-rose-600'
                : 'bg-emerald-950/60 border-emerald-800/50 text-slate-300 hover:border-rose-500/50 hover:text-rose-300'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden md:inline">YouTube</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const HaramainLiveTab: React.FC = () => {
  const { isDay } = useTheme();
  const { language, t } = useLanguage();
  const ui = HARAMAIN_UI[language] || HARAMAIN_UI.uz_lat;

  const [activeChannel, setActiveChannel] = useState<HaramainChannelId>('makkah');
  const [dualView, setDualView] = useState<boolean>(false);
  const [makkahMuted, setMakkahMuted] = useState<boolean>(false);
  const [madinahMuted, setMadinahMuted] = useState<boolean>(true);
  const [now, setNow] = useState<Date>(() => new Date());
  const [salawatCount, setSalawatCount] = useState<number>(() => loadTodaySalawatCount());
  const [salawatPulse, setSalawatPulse] = useState<boolean>(false);
  const [remoteConfig, setRemoteConfig] = useState<RemoteAppConfig>(() => getCachedRemoteAppConfig());

  useEffect(() => {
    return subscribeRemoteAppConfig((cfg) => setRemoteConfig(cfg));
  }, []);

  // Stop background Quran Radio / Surah audio on opening Live TV so sound never overlaps + keep phone screen awake
  useEffect(() => {
    stopConflictingAppAudio();
    setNativeKeepScreenOn(true);
    let wakeSentinel: { release?: () => Promise<void> } | null = null;
    const nav = navigator as Navigator & {
      wakeLock?: { request?: (type: 'screen') => Promise<{ release?: () => Promise<void> }> };
    };
    if (nav.wakeLock?.request) {
      nav.wakeLock
        .request('screen')
        .then((s) => {
          wakeSentinel = s;
        })
        .catch(() => {});
    }
    return () => {
      setNativeKeepScreenOn(false);
      wakeSentinel?.release?.().catch(() => {});
    };
  }, []);

  // Live 1-second clock for Saudi local time & next Haramain prayer countdown
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Single-channel mode: keep selected channel unmuted when switching tabs
  const handleSelectChannel = useCallback((ch: HaramainChannelId) => {
    setDualView(false);
    setActiveChannel(ch);
    if (ch === 'makkah') {
      setMakkahMuted(false);
      setMadinahMuted(true);
    } else {
      setMadinahMuted(false);
      setMakkahMuted(true);
    }
  }, []);

  const handleToggleDual = useCallback(() => {
    setDualView((prev) => {
      const next = !prev;
      if (next) {
        // In split dual-view, only keep activeChannel unmuted to prevent clashing audio
        if (activeChannel === 'makkah') {
          setMakkahMuted(false);
          setMadinahMuted(true);
        } else {
          setMadinahMuted(false);
          setMakkahMuted(true);
        }
      }
      return next;
    });
  }, [activeChannel]);

  const handleMakkahMuteChange = useCallback(
    (nextMuted: boolean) => {
      setMakkahMuted(nextMuted);
      if (dualView && !nextMuted) {
        setMadinahMuted(true);
      }
    },
    [dualView]
  );

  const handleMadinahMuteChange = useCallback(
    (nextMuted: boolean) => {
      setMadinahMuted(nextMuted);
      if (dualView && !nextMuted) {
        setMakkahMuted(true);
      }
    },
    [dualView]
  );

  const currentSpec = CHANNELS[activeChannel];

  // Live Makkah & Madinah local Saudi clock
  const haramainSchedule = useMemo(() => {
    const tzDate = getCityCurrentDate(now, currentSpec.timezone);
    const hh = String(tzDate.getHours()).padStart(2, '0');
    const mm = String(tzDate.getMinutes()).padStart(2, '0');
    const shortClock = `${hh}:${mm}`;
    return { shortClock };
  }, [currentSpec.timezone, now]);

  const handleIncrementSalawat = useCallback(() => {
    setSalawatCount((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem(getTodaySalawatStorageKey(), String(next));
      } catch {
        // ignore
      }
      return next;
    });
    setSalawatPulse(true);
    window.setTimeout(() => setSalawatPulse(false), 180);
    try {
      navigator.vibrate?.(18);
    } catch {
      // ignore
    }
  }, []);

  const handleResetSalawat = useCallback(() => {
    setSalawatCount(0);
    try {
      localStorage.setItem(getTodaySalawatStorageKey(), '0');
    } catch {
      // ignore
    }
  }, []);

  if (remoteConfig.features.haramain === false) {
    return (
      <div className="px-4 py-10 max-w-xl mx-auto">
        <div
          className={`rounded-3xl border p-6 text-center space-y-2 ${
            isDay
              ? 'bg-white border-[#dce6dc] text-slate-700'
              : 'bg-[#0b1d16] border-emerald-800/50 text-slate-200'
          }`}
        >
          <Tv className="w-8 h-8 mx-auto text-emerald-600" />
          <p className="text-sm font-bold">{ui.disabledNotice}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-0 sm:px-4 pt-1 pb-24 max-w-5xl mx-auto space-y-3.5">
      {/* Luxury Channel Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div
          className={`grid grid-cols-2 gap-1.5 p-1.5 rounded-2xl border flex-1 ${
            isDay
              ? 'bg-[#edf3ec] border-[#d6e2d5]'
              : 'bg-[#071610] border-emerald-900/60'
          }`}
        >
          {/* Makkah Button */}
          <button
            type="button"
            onClick={() => handleSelectChannel('makkah')}
            className={`relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all ${
              !dualView && activeChannel === 'makkah'
                ? isDay
                  ? 'bg-white text-slate-900 shadow-md ring-1 ring-amber-400/50'
                  : 'bg-gradient-to-r from-amber-500/20 to-emerald-950 text-white shadow-md ring-1 ring-amber-400/45'
                : isDay
                ? 'text-slate-600 hover:bg-white/60'
                : 'text-slate-300 hover:bg-emerald-950/60'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base shadow-xs ${
                !dualView && activeChannel === 'makkah'
                  ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-amber-300 ring-1 ring-amber-400/50'
                  : isDay
                  ? 'bg-slate-900/90 text-amber-300'
                  : 'bg-slate-900 text-amber-300'
              }`}
            >
              🕋
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-[13px] font-extrabold truncate">{ui.makkahName}</span>
                {!dualView && activeChannel === 'makkah' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
                )}
              </div>
              <div
                className={`text-[10.5px] truncate ${
                  isDay ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                {ui.makkahSub}
              </div>
            </div>
          </button>

          {/* Madinah Button */}
          <button
            type="button"
            onClick={() => handleSelectChannel('madinah')}
            className={`relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all ${
              !dualView && activeChannel === 'madinah'
                ? isDay
                  ? 'bg-white text-slate-900 shadow-md ring-1 ring-[#158509]/45'
                  : 'bg-gradient-to-r from-emerald-600/25 to-emerald-950 text-white shadow-md ring-1 ring-emerald-400/45'
                : isDay
                ? 'text-slate-600 hover:bg-white/60'
                : 'text-slate-300 hover:bg-emerald-950/60'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base shadow-xs ${
                !dualView && activeChannel === 'madinah'
                  ? 'bg-gradient-to-br from-[#158509] to-[#0e5a05] text-amber-200 ring-1 ring-emerald-300/40'
                  : isDay
                  ? 'bg-[#158509]/90 text-amber-100'
                  : 'bg-emerald-900 text-emerald-200'
              }`}
            >
              🕌
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-[13px] font-extrabold truncate">{ui.madinahName}</span>
                {!dualView && activeChannel === 'madinah' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
                )}
              </div>
              <div
                className={`text-[10.5px] truncate ${
                  isDay ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                {ui.madinahSub}
              </div>
            </div>
          </button>
        </div>

        {/* Desktop / Tablet Split Dual-View Toggle */}
        <button
          type="button"
          onClick={handleToggleDual}
          className={`hidden md:inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border text-xs font-extrabold transition shrink-0 ${
            dualView
              ? 'bg-[#158509] border-[#158509] text-white shadow-md'
              : isDay
              ? 'bg-white border-[#d6e2d5] text-slate-700 hover:border-[#158509]/50 hover:text-[#158509]'
              : 'bg-[#0b1d16] border-emerald-800/60 text-emerald-100 hover:bg-emerald-900/50'
          }`}
        >
          <Columns2 className="w-4 h-4" />
          <span>{ui.dualLabel}</span>
        </button>
      </div>

      {/* Live Video Stage (Single Cinema or Side-by-Side Dual View) */}
      {dualView ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <StreamPlayerCard
            channel={CHANNELS.makkah}
            title={ui.makkahName}
            subtitle={ui.makkahSub}
            customPrimaryUrl={remoteConfig.haramainLive.makkahUrl}
            muted={makkahMuted}
            onMutedChange={handleMakkahMuteChange}
            compact
            isDay={isDay}
            ui={ui}
            localClock={haramainSchedule.shortClock}
          />
          <StreamPlayerCard
            channel={CHANNELS.madinah}
            title={ui.madinahName}
            subtitle={ui.madinahSub}
            customPrimaryUrl={remoteConfig.haramainLive.madinahUrl}
            muted={madinahMuted}
            onMutedChange={handleMadinahMuteChange}
            compact
            isDay={isDay}
            ui={ui}
            localClock={haramainSchedule.shortClock}
          />
        </div>
      ) : (
        <StreamPlayerCard
          channel={currentSpec}
          title={activeChannel === 'makkah' ? ui.makkahName : ui.madinahName}
          subtitle={activeChannel === 'makkah' ? ui.makkahSub : ui.madinahSub}
          customPrimaryUrl={
            activeChannel === 'makkah'
              ? remoteConfig.haramainLive.makkahUrl
              : remoteConfig.haramainLive.madinahUrl
          }
          muted={activeChannel === 'makkah' ? makkahMuted : madinahMuted}
          onMutedChange={
            activeChannel === 'makkah' ? handleMakkahMuteChange : handleMadinahMuteChange
          }
          isDay={isDay}
          ui={ui}
          localClock={haramainSchedule.shortClock}
        />
      )}

      {/* Subtle Ad-Free Official Stream Pill */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold opacity-75">
        <Sparkles className={`w-3.5 h-3.5 ${isDay ? 'text-[#158509]' : 'text-emerald-400'}`} />
        <span>{ui.adFreeNote}</span>
      </div>

      {/* Spiritual Companion Card (Kaaba Sighting Dua for Makkah / Salawat for Madinah) */}
      <div
        className={`rounded-3xl border p-5 space-y-3.5 ${
          activeChannel === 'makkah'
            ? isDay
              ? 'bg-gradient-to-br from-[#fffdf7] via-white to-[#f6faf5] border-amber-200/80 shadow-sm'
              : 'bg-gradient-to-br from-[#16130a] via-[#0b1913] to-[#081510] border-amber-500/25'
            : isDay
            ? 'bg-gradient-to-br from-[#f2fbf0] via-white to-[#f7fbf6] border-[#c8e4c4] shadow-sm'
            : 'bg-gradient-to-br from-[#071f14] via-[#091913] to-[#07140f] border-emerald-500/25'
        }`}
      >
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider ${
                activeChannel === 'makkah'
                  ? isDay
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-amber-500/20 text-amber-200'
                  : isDay
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-emerald-500/20 text-emerald-200'
              }`}
            >
              {activeChannel === 'makkah' ? ui.makkahDuaBadge : ui.madinahDuaBadge}
            </span>
            <h3 className="text-sm sm:text-base font-extrabold mt-1.5">
              {activeChannel === 'makkah' ? ui.makkahDuaTitle : ui.madinahDuaTitle}
            </h3>
          </div>

          {/* 1-Tap Calm Salawat / Dhikr Counter */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleIncrementSalawat}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-extrabold text-white shadow-sm transition active:scale-95 ${
                salawatPulse ? 'scale-105' : ''
              } ${
                activeChannel === 'makkah'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-[#158509] hover:bg-[#116f07]'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>{ui.salawatBtn}</span>
              <span className="px-2 py-0.5 rounded-full bg-black/20 tabular-nums text-[11px]">
                {salawatCount}
              </span>
            </button>
            {salawatCount > 0 && (
              <button
                type="button"
                onClick={handleResetSalawat}
                title={ui.resetCounter}
                className={`w-8 h-8 rounded-xl border flex items-center justify-center transition ${
                  isDay
                    ? 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <p
          dir="rtl"
          className={`text-xl sm:text-2xl leading-[2.05] text-right font-semibold py-2 px-3.5 rounded-2xl ${
            isDay
              ? 'bg-black/[0.025] text-slate-900'
              : 'bg-white/[0.03] text-amber-50'
          }`}
          style={{ fontFamily: "'Amiri', serif" }}
        >
          {activeChannel === 'makkah' ? ui.makkahDuaArabic : ui.madinahDuaArabic}
        </p>

        <div className="space-y-1.5">
          <p
            className={`text-xs italic leading-relaxed ${
              isDay ? 'text-slate-600' : 'text-emerald-200/80'
            }`}
          >
            {activeChannel === 'makkah' ? ui.makkahDuaTranslit : ui.madinahDuaTranslit}
          </p>
          <p
            className={`text-xs sm:text-[13px] leading-relaxed font-medium ${
              isDay ? 'text-slate-800' : 'text-slate-200'
            }`}
          >
            {activeChannel === 'makkah' ? ui.makkahDuaMeaning : ui.madinahDuaMeaning}
          </p>
          <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
            <span className={`text-[11px] font-semibold ${isDay ? 'text-slate-400' : 'text-slate-400'}`}>
              {activeChannel === 'makkah' ? ui.makkahDuaSource : ui.madinahDuaSource}
            </span>
            {salawatCount > 0 && (
              <span className={`text-[11px] font-bold ${isDay ? 'text-[#158509]' : 'text-emerald-400'}`}>
                {ui.salawatToday} {salawatCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
