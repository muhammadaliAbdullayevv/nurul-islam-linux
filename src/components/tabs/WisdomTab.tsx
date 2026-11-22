import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  MapPin,
  ScrollText,
  Search,
  Share2,
  Sparkles,
  X,
} from 'lucide-react';
import { AppLanguage } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  LocalizedScholar,
  LocalizedWisdomEntry,
  ScholarId,
  WISDOM_ENTRIES,
  WISDOM_SCHOLARS,
  WISDOM_TOPICS,
  WisdomTopicId,
  getDailyWisdomEntry,
  getLocalizedScholar,
  getLocalizedWisdomEntry,
  pickLocalized,
} from '../../data/wisdomData';
import {
  RenderedPngCard,
  generateNurulIslamShareCard,
  shareOrSavePngCard,
} from '../../utils/shareCardGenerator';
import { copyTextSafely } from '../../utils/clipboard';

const SAVED_WISDOM_KEY = 'nq_wisdom_bookmarks_v1';

type ViewMode = 'scholars' | 'feed' | 'saved';

function loadSavedWisdomIds(): string[] {
  try {
    const raw = localStorage.getItem(SAVED_WISDOM_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((id): id is string => typeof id === 'string');
      }
    }
  } catch {
    // ignore
  }
  return [];
}

function saveWisdomIds(ids: string[]): void {
  try {
    localStorage.setItem(SAVED_WISDOM_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

interface WisdomUiStrings {
  badge: string;
  title: string;
  subtitle: string;
  dailyTag: string;
  tabScholars: string;
  tabFeed: string;
  tabSaved: string;
  allTopics: string;
  searchPlaceholder: string;
  excerptsCount: (n: number) => string;
  backToScholars: string;
  sharhTitle: string;
  showSharh: string;
  hideSharh: string;
  copyBtn: string;
  copiedBtn: string;
  shareCardBtn: string;
  sharingCard: string;
  cardSavedMsg: string;
  noResults: string;
  noSavedTitle: string;
  noSavedDesc: string;
  masterworkLabel: string;
  aboutScholar: string;
  worksHeading: string;
}

const UI_COPY: Record<AppLanguage, WisdomUiStrings> = {
  uz_lat: {
    badge: 'Movarounnahr Ma’naviy Merosi · 9 Alloma',
    title: 'Allomalar va Hikmatlar',
    subtitle: 'Yassaviy, Bahouddin Naqshband, Navoiy, Gulxaniy, So‘fi Olloyor, G‘ijduvoniy, Buxoriy, Moturidiy va Marg‘inoniy ijodidan durdonalar',
    dailyTag: 'Kunlik Hikmat',
    tabScholars: 'Allomalar',
    tabFeed: 'Hikmatlar',
    tabSaved: 'Saqlangan',
    allTopics: 'Barchasi',
    searchPlaceholder: 'Alloma, hikmat, bayt yoki mavzu izlang...',
    excerptsCount: (n) => `${n} ta hikmat`,
    backToScholars: 'Barcha allomalar',
    sharhTitle: 'Sharh va hayotiy xulosa',
    showSharh: 'Sharhni o‘qish',
    hideSharh: 'Sharhni yopish',
    copyBtn: 'Nusxa',
    copiedBtn: 'Nusxalandi',
    shareCardBtn: 'Karta ulashish',
    sharingCard: 'Tayyorlanmoqda...',
    cardSavedMsg: 'Hikmat kartasi yuklab olindi',
    noResults: 'So‘rovingiz bo‘yicha hikmat topilmadi',
    noSavedTitle: 'Hali hikmat saqlanmagan',
    noSavedDesc: 'Yoqtirgan hikmatlaringizdagi belgini bosing — ular shu yerda jamlanadi.',
    masterworkLabel: 'Asosiy asar:',
    aboutScholar: 'Alloma haqida',
    worksHeading: 'Ijodidan sara namunalar',
  },
  uz_cyr: {
    badge: 'Мовароуннаҳр Маънавий Мероси · 9 Аллома',
    title: 'Алломалар ва Ҳикматлар',
    subtitle: 'Яссавий, Баҳоуддин Нақшбанд, Навоий, Гулханий, Сўфи Оллоёр, Ғиждувоний, Бухорий, Мотуридий ва Марғиноний ижодидан дурдоналар',
    dailyTag: 'Кунлик Ҳикмат',
    tabScholars: 'Алломалар',
    tabFeed: 'Ҳикматлар',
    tabSaved: 'Сақланган',
    allTopics: 'Барчаси',
    searchPlaceholder: 'Аллома, ҳикмат, байт ёки мавзу изланг...',
    excerptsCount: (n) => `${n} та ҳикмат`,
    backToScholars: 'Барча алломалар',
    sharhTitle: 'Шарҳ ва ҳаётий хулоса',
    showSharh: 'Шарҳни ўқиш',
    hideSharh: 'Шарҳни ёпиш',
    copyBtn: 'Нусха',
    copiedBtn: 'Нусхаланди',
    shareCardBtn: 'Карта улашиш',
    sharingCard: 'Тайёрланмоқда...',
    cardSavedMsg: 'Ҳикмат картаси юклаб олинди',
    noResults: 'Сўровингиз бўйича ҳикмат топилмади',
    noSavedTitle: 'Ҳали ҳикмат сақланмаган',
    noSavedDesc: 'Ёқтирган ҳикматларингиздаги белгини босинг — улар шу ерда жамланади.',
    masterworkLabel: 'Асосий асар:',
    aboutScholar: 'Аллома ҳақида',
    worksHeading: 'Ижодидан сара намуналар',
  },
  en: {
    badge: 'Transoxiana Spiritual Heritage · 9 Masters',
    title: 'Scholars & Wisdom',
    subtitle: 'Timeless poetry, aphorisms & parables from Yasawi, Naqshband, Navoi, Gulkhani, Sufi Allahyar, Ghijduwani, Bukhari, Maturidi & Marghinani',
    dailyTag: 'Daily Wisdom',
    tabScholars: 'Scholars',
    tabFeed: 'Wisdom',
    tabSaved: 'Saved',
    allTopics: 'All Topics',
    searchPlaceholder: 'Search scholar, verse, or theme...',
    excerptsCount: (n) => `${n} gems`,
    backToScholars: 'All Scholars',
    sharhTitle: 'Commentary & Reflection',
    showSharh: 'Read commentary',
    hideSharh: 'Hide commentary',
    copyBtn: 'Copy',
    copiedBtn: 'Copied',
    shareCardBtn: 'Share Card',
    sharingCard: 'Rendering...',
    cardSavedMsg: 'Wisdom card saved as PNG',
    noResults: 'No matching wisdom found',
    noSavedTitle: 'No saved wisdom yet',
    noSavedDesc: 'Tap the bookmark icon on any excerpt to build your personal treasury.',
    masterworkLabel: 'Masterwork:',
    aboutScholar: 'Biography',
    worksHeading: 'Selected Excerpts',
  },
  ru: {
    badge: 'Духовное наследие Мавераннахра · 9 Учёных',
    title: 'Учёные и Мудрости',
    subtitle: 'Избранные хикматы, притчи и наставления Яссави, Накшбанда, Навои, Гульхани, Суфи Аллаяра, Гиждувани, Бухари, Матуриди и Маргинани',
    dailyTag: 'Мудрость дня',
    tabScholars: 'Учёные',
    tabFeed: 'Мудрости',
    tabSaved: 'Избранное',
    allTopics: 'Все темы',
    searchPlaceholder: 'Поиск по учёному, стиху или теме...',
    excerptsCount: (n) => `${n} изречений`,
    backToScholars: 'Все учёные',
    sharhTitle: 'Комментарий и смысл',
    showSharh: 'Читать шарх',
    hideSharh: 'Скрыть шарх',
    copyBtn: 'Копия',
    copiedBtn: 'Скопировано',
    shareCardBtn: 'Открытка',
    sharingCard: 'Создание...',
    cardSavedMsg: 'Открытка сохранена (PNG)',
    noResults: 'По вашему запросу ничего не найдено',
    noSavedTitle: 'Избранное пока пусто',
    noSavedDesc: 'Нажмите на закладку у понравившегося хикмата — он сохранится здесь.',
    masterworkLabel: 'Главный труд:',
    aboutScholar: 'Об учёном',
    worksHeading: 'Избранные образцы наследия',
  },
};

const ACCENT_STYLES: Record<
  LocalizedScholar['accent'],
  { dayBg: string; dayBorder: string; dayBadge: string; nightBg: string; nightBorder: string; nightBadge: string }
> = {
  emerald: {
    dayBg: 'bg-gradient-to-br from-[#eef9ea] to-white',
    dayBorder: 'border-[#bfe3b5]',
    dayBadge: 'bg-[#158509] text-white',
    nightBg: 'bg-gradient-to-br from-emerald-950/80 to-slate-900',
    nightBorder: 'border-emerald-700/60',
    nightBadge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
  },
  amber: {
    dayBg: 'bg-gradient-to-br from-amber-50/90 to-white',
    dayBorder: 'border-amber-200',
    dayBadge: 'bg-amber-600 text-white',
    nightBg: 'bg-gradient-to-br from-amber-950/45 to-slate-900',
    nightBorder: 'border-amber-600/45',
    nightBadge: 'bg-amber-400/20 text-amber-300 border border-amber-400/40',
  },
  indigo: {
    dayBg: 'bg-gradient-to-br from-indigo-50/85 to-white',
    dayBorder: 'border-indigo-200',
    dayBadge: 'bg-indigo-600 text-white',
    nightBg: 'bg-gradient-to-br from-indigo-950/55 to-slate-900',
    nightBorder: 'border-indigo-600/45',
    nightBadge: 'bg-indigo-400/20 text-indigo-300 border border-indigo-400/40',
  },
  teal: {
    dayBg: 'bg-gradient-to-br from-teal-50/85 to-white',
    dayBorder: 'border-teal-200',
    dayBadge: 'bg-teal-700 text-white',
    nightBg: 'bg-gradient-to-br from-teal-950/60 to-slate-900',
    nightBorder: 'border-teal-600/45',
    nightBadge: 'bg-teal-400/20 text-teal-300 border border-teal-400/40',
  },
  violet: {
    dayBg: 'bg-gradient-to-br from-violet-50/85 to-white',
    dayBorder: 'border-violet-200',
    dayBadge: 'bg-violet-700 text-white',
    nightBg: 'bg-gradient-to-br from-violet-950/55 to-slate-900',
    nightBorder: 'border-violet-600/45',
    nightBadge: 'bg-violet-400/20 text-violet-300 border border-violet-400/40',
  },
  sky: {
    dayBg: 'bg-gradient-to-br from-sky-50/85 to-white',
    dayBorder: 'border-sky-200',
    dayBadge: 'bg-sky-700 text-white',
    nightBg: 'bg-gradient-to-br from-sky-950/55 to-slate-900',
    nightBorder: 'border-sky-600/45',
    nightBadge: 'bg-sky-400/20 text-sky-300 border border-sky-400/40',
  },
  rose: {
    dayBg: 'bg-gradient-to-br from-rose-50/85 to-white',
    dayBorder: 'border-rose-200',
    dayBadge: 'bg-rose-700 text-white',
    nightBg: 'bg-gradient-to-br from-rose-950/50 to-slate-900',
    nightBorder: 'border-rose-600/45',
    nightBadge: 'bg-rose-400/20 text-rose-300 border border-rose-400/40',
  },
  lime: {
    dayBg: 'bg-gradient-to-br from-lime-50/85 to-white',
    dayBorder: 'border-lime-300/80',
    dayBadge: 'bg-lime-700 text-white',
    nightBg: 'bg-gradient-to-br from-lime-950/45 to-slate-900',
    nightBorder: 'border-lime-600/45',
    nightBadge: 'bg-lime-400/20 text-lime-300 border border-lime-400/40',
  },
  orange: {
    dayBg: 'bg-gradient-to-br from-orange-50/90 to-white',
    dayBorder: 'border-orange-200',
    dayBadge: 'bg-orange-600 text-white',
    nightBg: 'bg-gradient-to-br from-orange-950/50 to-slate-900',
    nightBorder: 'border-orange-600/45',
    nightBadge: 'bg-orange-400/20 text-orange-300 border border-orange-400/40',
  },
};

interface HikmatCardOptions {
  isDay: boolean;
  sectionTitle: string;
  sharhLabel: string;
  topicLabel?: string;
}

export async function generateHikmatCardData(
  scholar: LocalizedScholar,
  entry: LocalizedWisdomEntry,
  options: HikmatCardOptions
): Promise<RenderedPngCard | null> {
  const { isDay, sectionTitle, sharhLabel, topicLabel } = options;
  return generateNurulIslamShareCard({
    isDay,
    eyebrow: topicLabel ? `${sectionTitle} · ${topicLabel}` : sectionTitle,
    metaPill: `${entry.work}  •  ${scholar.years}`,
    title: scholar.name,
    subtitle: entry.heading,
    featuredText: entry.original,
    bodyText: entry.excerpt,
    noteLabel: entry.sharh ? sharhLabel : undefined,
    noteText: entry.sharh,
    footerSectionTitle: sectionTitle,
  });
}

export const WisdomTab: React.FC = () => {
  const { isDay } = useTheme();
  const { language } = useLanguage();
  const ui = UI_COPY[language] || UI_COPY.uz_lat;

  const [viewMode, setViewMode] = useState<ViewMode>('scholars');
  const [selectedScholarId, setSelectedScholarId] = useState<ScholarId | null>(null);
  const [activeTopic, setActiveTopic] = useState<'all' | WisdomTopicId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedIds, setSavedIds] = useState<string[]>(() => loadSavedWisdomIds());
  const [expandedSharhIds, setExpandedSharhIds] = useState<Set<string>>(() => new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sharingId, setSharingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const scholars = useMemo(
    () => WISDOM_SCHOLARS.map((s) => getLocalizedScholar(s, language)),
    [language]
  );

  const scholarMap = useMemo(() => {
    const map = new Map<ScholarId, LocalizedScholar>();
    for (const s of scholars) map.set(s.id, s);
    return map;
  }, [scholars]);

  const allEntries = useMemo(
    () => WISDOM_ENTRIES.map((e) => getLocalizedWisdomEntry(e, language)),
    [language]
  );

  const dailyEntry = useMemo(() => {
    const raw = getDailyWisdomEntry();
    return getLocalizedWisdomEntry(raw, language);
  }, [language]);

  const dailyScholar = scholarMap.get(dailyEntry.scholarId) || scholars[0];
  const selectedScholar = selectedScholarId ? scholarMap.get(selectedScholarId) || null : null;

  // Support Android back button when inside a scholar detail view
  useEffect(() => {
    if (!selectedScholarId) return;
    const onBack = (e: Event) => {
      e.preventDefault();
      setSelectedScholarId(null);
    };
    window.addEventListener('nq:android-back', onBack);
    return () => window.removeEventListener('nq:android-back', onBack);
  }, [selectedScholarId]);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    window.setTimeout(() => {
      setToastMsg((cur) => (cur === msg ? null : cur));
    }, 2400);
  }, []);

  const toggleSaved = useCallback((id: string) => {
    setSavedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev];
      saveWisdomIds(next);
      return next;
    });
  }, []);

  const toggleSharh = useCallback((id: string) => {
    setExpandedSharhIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleCopyText = useCallback(
    async (entry: LocalizedWisdomEntry, scholar: LocalizedScholar) => {
      const lines = [
        `${scholar.name} (${entry.work})`,
        '',
        entry.original ? `${entry.original}\n` : '',
        entry.excerpt,
        '',
        `— ${entry.sharh}`,
        '',
        'Nurul Islam · nurulislam.mabdullayev.dev',
      ]
        .filter((l, i, arr) => !(l === '' && arr[i - 1] === ''))
        .join('\n');
      await copyTextSafely(lines);
      setCopiedId(entry.id);
      window.setTimeout(() => setCopiedId((cur) => (cur === entry.id ? null : cur)), 1800);
    },
    []
  );

  const handleShareCard = useCallback(
    async (entry: LocalizedWisdomEntry, scholar: LocalizedScholar) => {
      setSharingId(entry.id);
      try {
        const topicMeta = WISDOM_TOPICS.find((t) => t.id === entry.topic);
        const topicLabel = topicMeta ? pickLocalized(topicMeta.label, language) : undefined;
        const rendered = await generateHikmatCardData(scholar, entry, {
          isDay,
          sectionTitle: ui.title,
          sharhLabel: ui.sharhTitle,
          topicLabel,
        });
        if (!rendered) throw new Error('Canvas unavailable');
        const fileName = `nurul-islam-${scholar.id}-${entry.id}.png`;
        const caption = `${entry.excerpt}\n— ${scholar.name} (${entry.work})\nNurul Islam · nurulislam.mabdullayev.dev`;

        const res = await shareOrSavePngCard({
          rendered,
          fileName,
          shareTitle: `${scholar.name} — ${entry.heading}`,
          caption,
        });
        if (res.method === 'desktop') {
          showToast(res.savedPath ? `${ui.cardSavedMsg}: ${res.savedPath}` : ui.cardSavedMsg);
        } else if (res.method === 'download') {
          showToast(ui.cardSavedMsg);
        }
      } catch {
        await handleCopyText(entry, scholar);
      } finally {
        setSharingId(null);
      }
    },
    [handleCopyText, isDay, language, showToast, ui.cardSavedMsg, ui.sharhTitle, ui.title]
  );

  const scholarEntries = useMemo(() => {
    if (!selectedScholarId) return [];
    return allEntries.filter((e) => e.scholarId === selectedScholarId);
  }, [allEntries, selectedScholarId]);

  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allEntries.filter((entry) => {
      if (viewMode === 'saved' && !savedIds.includes(entry.id)) return false;
      if (activeTopic !== 'all' && entry.topic !== activeTopic) return false;
      if (!q) return true;
      const sch = scholarMap.get(entry.scholarId);
      const haystack = [
        sch?.name || '',
        sch?.title || '',
        entry.work,
        entry.heading,
        entry.original || '',
        entry.excerpt,
        entry.sharh,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [activeTopic, allEntries, savedIds, scholarMap, searchQuery, viewMode]);

  const verseSizeCls = 'text-[15px] leading-[1.7]';
  const bodySizeCls = 'text-[13.5px] leading-relaxed';

  const cardSurfaceCls = isDay
    ? 'bg-white border-[#dde3ea] text-slate-900 shadow-xs'
    : 'bg-slate-900/90 border-emerald-900/60 text-slate-100';
  const subTextCls = isDay ? 'text-slate-600' : 'text-slate-400';

  const renderEntryCard = (entry: LocalizedWisdomEntry, showScholarBadge: boolean) => {
    const scholar = scholarMap.get(entry.scholarId) || scholars[0];
    const isSaved = savedIds.includes(entry.id);
    const isSharhOpen = expandedSharhIds.has(entry.id);
    const topicMeta = WISDOM_TOPICS.find((t) => t.id === entry.topic);
    const topicLabel = topicMeta ? pickLocalized(topicMeta.label, language) : '';
    const isCopied = copiedId === entry.id;
    const isSharing = sharingId === entry.id;

    return (
      <article
        key={entry.id}
        className={`rounded-3xl border p-4 space-y-3 transition ${cardSurfaceCls}`}
      >
        {/* Top Metadata Row */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 space-y-1">
            {showScholarBadge && (
              <button
                type="button"
                onClick={() => setSelectedScholarId(scholar.id)}
                className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold transition ${
                  isDay
                    ? 'text-[#0c4703] hover:text-[#158509]'
                    : 'text-amber-300 hover:text-amber-200'
                }`}
              >
                <ScrollText className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{scholar.name}</span>
              </button>
            )}
            <h3 className="text-sm font-extrabold leading-snug">{entry.heading}</h3>
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isDay
                    ? 'bg-[#eef9ea] text-[#0c4703] border border-[#c5e8bc]'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800/70'
                }`}
              >
                {entry.work}
              </span>
              {topicLabel && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    isDay
                      ? 'bg-slate-100 text-slate-600'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {topicLabel}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => toggleSaved(entry.id)}
            aria-label="Bookmark"
            className={`p-2 rounded-xl border shrink-0 transition active:scale-90 ${
              isSaved
                ? isDay
                  ? 'bg-[#158509] border-[#0c5007] text-white'
                  : 'bg-amber-400 border-amber-300 text-slate-950'
                : isDay
                ? 'bg-slate-50 border-slate-200 text-slate-500 hover:text-[#158509]'
                : 'bg-slate-950 border-emerald-900/60 text-slate-400 hover:text-amber-300'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Classical Verse / Arabic-Persian Motto Box */}
        {entry.original && (
          <div
            className={`rounded-2xl border px-3.5 py-3 ${
              isDay
                ? 'bg-gradient-to-br from-[#f6fcf4] to-[#fbfdf6] border-[#d3e9cc] text-[#0c4703]'
                : 'bg-emerald-950/55 border-emerald-800/60 text-amber-200'
            }`}
          >
            <p
              className={`font-serif italic whitespace-pre-line font-semibold ${verseSizeCls} ${
                /[\u0600-\u06FF]/.test(entry.original) ? 'text-right font-arabic not-italic text-lg leading-loose' : ''
              }`}
            >
              {entry.original}
            </p>
          </div>
        )}

        {/* Plain Meaning / Excerpt */}
        <p className={`${bodySizeCls} ${isDay ? 'text-slate-800' : 'text-slate-200'}`}>
          {entry.excerpt}
        </p>

        {/* Expandable Sharh (Commentary) */}
        <div
          className={`rounded-2xl border overflow-hidden ${
            isDay
              ? 'bg-[#f8fafc] border-[#e2e8f0]'
              : 'bg-slate-950/75 border-emerald-900/45'
          }`}
        >
          <button
            type="button"
            onClick={() => toggleSharh(entry.id)}
            className="w-full px-3 py-2 flex items-center justify-between gap-2 text-left"
          >
            <span
              className={`text-[11.5px] font-bold flex items-center gap-1.5 ${
                isDay ? 'text-[#0c4703]' : 'text-emerald-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>{isSharhOpen ? ui.hideSharh : ui.showSharh}</span>
            </span>
            {isSharhOpen ? (
              <ChevronUp className="w-4 h-4 opacity-70" />
            ) : (
              <ChevronDown className="w-4 h-4 opacity-70" />
            )}
          </button>
          {isSharhOpen && (
            <div
              className={`px-3 pb-3 pt-0.5 text-xs leading-relaxed border-t ${
                isDay
                  ? 'border-slate-200/80 text-slate-700'
                  : 'border-emerald-900/40 text-slate-300'
              }`}
            >
              <p className="font-bold text-[10.5px] uppercase tracking-wider opacity-65 mb-1 mt-1.5">
                {ui.sharhTitle}
              </p>
              <p>{entry.sharh}</p>
            </div>
          )}
        </div>

        {/* Action Bar: Copy + Share PNG Quote Card */}
        <div className="flex items-center gap-2 pt-0.5">
          <button
            type="button"
            onClick={() => void handleCopyText(entry, scholar)}
            className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold inline-flex items-center justify-center gap-1.5 transition active:scale-95 ${
              isDay
                ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-[#eef9ea] hover:border-[#c5e8bc] hover:text-[#0c4703]'
                : 'bg-slate-950 border-emerald-900/60 text-slate-200 hover:border-emerald-700'
            }`}
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-[#158509]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? ui.copiedBtn : ui.copyBtn}</span>
          </button>

          <button
            type="button"
            disabled={isSharing}
            onClick={() => void handleShareCard(entry, scholar)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-50 ${
              isDay
                ? 'bg-[#158509] hover:bg-[#0c5007] text-white nq-keep-dark'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
            }`}
          >
            {isSharing ? (
              <Download className="w-3.5 h-3.5 animate-bounce" />
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
            <span>{isSharing ? ui.sharingCard : ui.shareCardBtn}</span>
          </button>
        </div>
      </article>
    );
  };

  // ==================== DEDICATED SCHOLAR PROFILE & WORKS VIEW ====================
  if (selectedScholar) {
    const acc = ACCENT_STYLES[selectedScholar.accent];
    return (
      <div className="space-y-4 pb-6">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setSelectedScholarId(null)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition active:scale-95 ${
              isDay
                ? 'bg-white border-[#dde3ea] text-[#0c4703] hover:bg-[#eef9ea]'
                : 'bg-slate-900 border-emerald-900/60 text-emerald-300 hover:bg-emerald-950'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{ui.backToScholars}</span>
          </button>
        </div>

        {/* Scholar Hero Card */}
        <section
          className={`rounded-3xl border p-5 space-y-3 ${
            isDay ? `${acc.dayBg} ${acc.dayBorder}` : `${acc.nightBg} ${acc.nightBorder}`
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                isDay ? acc.dayBadge : acc.nightBadge
              }`}
            >
              {selectedScholar.years}
            </span>
            <span className={`inline-flex items-center gap-1 text-xs font-semibold ${subTextCls}`}>
              <MapPin className="w-3.5 h-3.5" />
              <span>{selectedScholar.place}</span>
            </span>
          </div>

          <div>
            <h2 className="font-display text-xl font-extrabold tracking-tight">
              {selectedScholar.name}
            </h2>
            <p
              className={`text-xs font-bold mt-0.5 ${
                isDay ? 'text-[#0c4703]' : 'text-amber-300'
              }`}
            >
              {selectedScholar.title}
            </p>
          </div>

          <div
            className={`rounded-2xl border px-3 py-2 text-xs ${
              isDay
                ? 'bg-white/80 border-slate-200/80 text-slate-700'
                : 'bg-slate-950/60 border-emerald-900/50 text-slate-200'
            }`}
          >
            <span className="font-bold opacity-75">{ui.masterworkLabel} </span>
            <span className="font-extrabold">{selectedScholar.masterwork}</span>
          </div>

          <div className="space-y-1">
            <p className="text-[10.5px] font-bold uppercase tracking-wider opacity-65">
              {ui.aboutScholar}
            </p>
            <p className={`text-xs leading-relaxed ${isDay ? 'text-slate-700' : 'text-slate-300'}`}>
              {selectedScholar.bio}
            </p>
          </div>
        </section>

        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-extrabold flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#158509] dark:text-amber-400" />
            <span>{ui.worksHeading}</span>
          </h3>
          <span className={`text-xs font-bold ${subTextCls}`}>
            {ui.excerptsCount(scholarEntries.length)}
          </span>
        </div>

        <div className="space-y-3">
          {scholarEntries.map((entry) => renderEntryCard(entry, false))}
        </div>

        {toastMsg && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-xl border border-emerald-600/50">
            {toastMsg}
          </div>
        )}
      </div>
    );
  }

  // ==================== MAIN HERITAGE HUB ====================
  return (
    <div className="space-y-3 pb-6">
      {/* Compact Daily Hikmat Banner Only */}
      <section
        className={`rounded-2xl p-3 space-y-2 border ${
          isDay
            ? 'bg-gradient-to-br from-[#0b4a06] via-[#136c13] to-[#1e7f2b] border-[#0c5007] text-white shadow-sm nq-keep-dark'
            : 'bg-gradient-to-br from-[#06241b] via-[#0a3625] to-[#051812] border-emerald-800/70 text-white shadow-lg'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#d0f39f] shrink-0">
            ✦ {ui.dailyTag}
          </span>
          <button
            type="button"
            onClick={() => setSelectedScholarId(dailyScholar.id)}
            className="text-[11px] font-bold text-[#fde68a] hover:underline truncate"
          >
            {dailyScholar.name} →
          </button>
        </div>

        {dailyEntry.original ? (
          <p className="font-serif italic text-[13px] leading-snug text-[#fef3c7] whitespace-pre-line line-clamp-3">
            {dailyEntry.original}
          </p>
        ) : (
          <p className="text-xs leading-snug text-white/95 line-clamp-3">{dailyEntry.excerpt}</p>
        )}

        <div className="flex items-center justify-between gap-2 pt-0.5">
          <span className="text-[10.5px] text-white/70 truncate">{dailyEntry.work}</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => void handleCopyText(dailyEntry, dailyScholar)}
              className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-[11px] font-bold text-white inline-flex items-center gap-1 transition active:scale-95"
            >
              {copiedId === dailyEntry.id ? (
                <Check className="w-3 h-3 text-[#d0f39f]" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              <span>{copiedId === dailyEntry.id ? ui.copiedBtn : ui.copyBtn}</span>
            </button>
            <button
              type="button"
              disabled={sharingId === dailyEntry.id}
              onClick={() => void handleShareCard(dailyEntry, dailyScholar)}
              className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-[11px] font-extrabold text-slate-950 inline-flex items-center gap-1 transition active:scale-95 disabled:opacity-50"
            >
              <Share2 className="w-3 h-3" />
              <span>{sharingId === dailyEntry.id ? ui.sharingCard : ui.shareCardBtn}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Primary View Switcher */}
      <div
        className={`grid grid-cols-3 gap-1 p-1 rounded-2xl border ${
          isDay ? 'bg-white border-[#dde3ea]' : 'bg-slate-900 border-emerald-900/60'
        }`}
      >
        {(
          [
            { id: 'scholars' as const, label: `${ui.tabScholars} (${scholars.length})` },
            { id: 'feed' as const, label: `${ui.tabFeed} (${allEntries.length})` },
            {
              id: 'saved' as const,
              label: savedIds.length > 0 ? `${ui.tabSaved} (${savedIds.length})` : ui.tabSaved,
            },
          ] as const
        ).map((tab) => {
          const active = viewMode === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setViewMode(tab.id)}
              className={`py-2 px-2 rounded-xl text-[11.5px] font-extrabold transition truncate ${
                active
                  ? isDay
                    ? 'bg-[#158509] text-white shadow-xs nq-keep-dark'
                    : 'bg-amber-400 text-slate-950 shadow-xs'
                  : isDay
                  ? 'text-slate-600 hover:bg-slate-50'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* SCHOLARS GALLERY VIEW */}
      {viewMode === 'scholars' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {scholars.map((sch) => {
            const acc = ACCENT_STYLES[sch.accent];
            const count = WISDOM_ENTRIES.filter((e) => e.scholarId === sch.id).length;
            return (
              <button
                key={sch.id}
                type="button"
                onClick={() => setSelectedScholarId(sch.id)}
                className={`w-full text-left rounded-3xl border p-4 space-y-2.5 transition active:scale-[0.985] hover:shadow-md ${
                  isDay ? `${acc.dayBg} ${acc.dayBorder}` : `${acc.nightBg} ${acc.nightBorder}`
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold ${
                      isDay ? acc.dayBadge : acc.nightBadge
                    }`}
                  >
                    {sch.years}
                  </span>
                  <span
                    className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full ${
                      isDay ? 'bg-white/90 text-slate-700 border border-slate-200' : 'bg-slate-950/70 text-slate-300 border border-emerald-900/60'
                    }`}
                  >
                    {ui.excerptsCount(count)}
                  </span>
                </div>

                <div>
                  <h2 className="font-display text-base font-extrabold leading-tight">
                    {sch.name}
                  </h2>
                  <p
                    className={`text-[11px] font-bold mt-0.5 ${
                      isDay ? 'text-[#0c4703]' : 'text-amber-300'
                    }`}
                  >
                    {sch.title}
                  </p>
                </div>

                <p className={`text-xs leading-relaxed line-clamp-2 ${subTextCls}`}>
                  {sch.bio}
                </p>

                <div className="flex items-center justify-between gap-2 pt-1 text-[11px]">
                  <span className={`font-semibold truncate ${isDay ? 'text-slate-700' : 'text-slate-300'}`}>
                    📖 {sch.masterwork}
                  </span>
                  <span className={`font-extrabold shrink-0 ${isDay ? 'text-[#158509]' : 'text-amber-300'}`}>
                    →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ALL WISDOM FEED & SAVED VIEW */}
      {(viewMode === 'feed' || viewMode === 'saved') && (
        <div className="space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search
              className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${subTextCls}`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={ui.searchPlaceholder}
              className={`w-full pl-10 pr-9 py-2.5 rounded-2xl border text-xs font-medium outline-none transition ${
                isDay
                  ? 'bg-white border-[#dde3ea] text-slate-900 focus:border-[#158509]'
                  : 'bg-slate-900 border-emerald-900/60 text-white focus:border-amber-400'
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 opacity-60 hover:opacity-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Topic Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            <button
              type="button"
              onClick={() => setActiveTopic('all')}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold shrink-0 border transition ${
                activeTopic === 'all'
                  ? isDay
                    ? 'bg-[#158509] border-[#0c5007] text-white nq-keep-dark'
                    : 'bg-amber-400 border-amber-300 text-slate-950'
                  : isDay
                  ? 'bg-white border-[#dde3ea] text-slate-700'
                  : 'bg-slate-900 border-emerald-900/60 text-slate-300'
              }`}
            >
              {ui.allTopics}
            </button>
            {WISDOM_TOPICS.map((topic) => {
              const active = activeTopic === topic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setActiveTopic(topic.id)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold shrink-0 border transition ${
                    active
                      ? isDay
                        ? 'bg-[#158509] border-[#0c5007] text-white nq-keep-dark'
                        : 'bg-amber-400 border-amber-300 text-slate-950'
                      : isDay
                      ? 'bg-white border-[#dde3ea] text-slate-700'
                      : 'bg-slate-900 border-emerald-900/60 text-slate-300'
                  }`}
                >
                  {pickLocalized(topic.label, language)}
                </button>
              );
            })}
          </div>

          {/* Results List */}
          {filteredEntries.length === 0 ? (
            <div className={`rounded-3xl border p-8 text-center space-y-1.5 ${cardSurfaceCls}`}>
              <ScrollText className="w-8 h-8 mx-auto opacity-35" />
              <p className="text-sm font-bold">
                {viewMode === 'saved' && !searchQuery && activeTopic === 'all'
                  ? ui.noSavedTitle
                  : ui.noResults}
              </p>
              {viewMode === 'saved' && !searchQuery && activeTopic === 'all' && (
                <p className={`text-xs ${subTextCls}`}>{ui.noSavedDesc}</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEntries.map((entry) => renderEntryCard(entry, true))}
            </div>
          )}
        </div>
      )}

      {toastMsg && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-xl border border-emerald-600/50">
          {toastMsg}
        </div>
      )}
    </div>
  );
};
