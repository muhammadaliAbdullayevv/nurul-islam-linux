import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Heart,
  List,
  Search,
  Share2,
  Sparkles,
  X,
} from 'lucide-react';
import { AppLanguage } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  BookCategory,
  CLASSICAL_BOOKS,
  ClassicalBook,
  getBookById,
  resolveBookParagraphs,
  resolveBookText,
} from '../../data/classicalBooksPart2';
import { copyTextSafely } from '../../utils/clipboard';
import {
  generateNurulIslamShareCard,
  shareOrSavePngCard,
} from '../../utils/shareCardGenerator';

const LIBRARY_PROGRESS_KEY = 'nq_library_progress_v1';
const LIBRARY_FAVS_KEY = 'nq_library_favs_v1';
const LIBRARY_FONT_KEY = 'nq_library_font_v1';
const LIBRARY_PAPER_KEY = 'nq_library_paper_v1';

interface LibraryProgressState {
  readChapterIds: string[];
  lastBookId: string | null;
  lastChapterIndex: number;
}

function loadLibraryProgress(): LibraryProgressState {
  try {
    const raw = localStorage.getItem(LIBRARY_PROGRESS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<LibraryProgressState>;
      return {
        readChapterIds: Array.isArray(parsed.readChapterIds)
          ? parsed.readChapterIds.filter((x): x is string => typeof x === 'string')
          : [],
        lastBookId: typeof parsed.lastBookId === 'string' ? parsed.lastBookId : null,
        lastChapterIndex: typeof parsed.lastChapterIndex === 'number' ? parsed.lastChapterIndex : 0,
      };
    }
  } catch {
    // ignore storage errors
  }
  return { readChapterIds: [], lastBookId: null, lastChapterIndex: 0 };
}

function saveLibraryProgress(state: LibraryProgressState): void {
  try {
    localStorage.setItem(LIBRARY_PROGRESS_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

function loadLibraryFavs(): string[] {
  try {
    const raw = localStorage.getItem(LIBRARY_FAVS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.filter((x): x is string => typeof x === 'string');
    }
  } catch {
    // ignore
  }
  return [];
}

function saveLibraryFavs(ids: string[]): void {
  try {
    localStorage.setItem(LIBRARY_FAVS_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

type PaperTone = 'default' | 'sepia';

const LIBRARY_UI: Record<
  AppLanguage,
  {
    heroTitle: string;
    heroSubtitle: (books: number, readCh: number, totalCh: number) => string;
    continueReading: string;
    resumeBtn: string;
    searchPlaceholder: string;
    catAll: string;
    catFiqh: string;
    catHadith: string;
    catSpirituality: string;
    catFavs: string;
    chaptersUnit: (n: number) => string;
    backToShelf: string;
    contentsTitle: string;
    chapterWord: (n: number, total: number) => string;
    takeawayTitle: string;
    markRead: string;
    markedRead: string;
    prevChapter: string;
    nextChapter: string;
    sepiaLabel: string;
    defaultPaperLabel: string;
    copiedToast: string;
    sharedToast: string;
    emptyFavs: string;
    publicDomainNote: string;
  }
> = {
  uz_lat: {
    heroTitle: 'Klassik Islom Kutubxonasi',
    heroSubtitle: (b, r, t) => `${b} ta mo‘tabar asar · ${r}/${t} bob o‘qildi`,
    continueReading: 'O‘qishni davom ettirish',
    resumeBtn: 'Davom etish',
    searchPlaceholder: 'Kitob, muallif yoki mavzu qidirish...',
    catAll: 'Barchasi',
    catFiqh: 'Fiqh & Aqida',
    catHadith: 'Hadis & Siyrat',
    catSpirituality: 'Tarbiya & Meros',
    catFavs: 'Sevimli',
    chaptersUnit: (n) => `${n} bob`,
    backToShelf: 'Kutubxona',
    contentsTitle: 'Mundarija',
    chapterWord: (n, total) => `${n}-bob / ${total}`,
    takeawayTitle: 'Amaliy xulosa',
    markRead: 'O‘qildi deb belgilash',
    markedRead: 'O‘qilgan',
    prevChapter: 'Oldingi',
    nextChapter: 'Keyingi bob',
    sepiaLabel: 'Qog‘oz',
    defaultPaperLabel: 'Oddiy',
    copiedToast: 'Nusxa olindi',
    sharedToast: 'Ulashish kartasi tayyor',
    emptyFavs: 'Sevimli kitoblaringiz hozircha yo‘q — yurakcha belgisini bosib saqlang.',
    publicDomainNote: 'Barcha kitoblar ochiq klassik islom merosi asosida oflayn o‘qish uchun tayyorlangan',
  },
  uz_cyr: {
    heroTitle: 'Классик Ислом Кутубхонаси',
    heroSubtitle: (b, r, t) => `${b} та мўътабар асар · ${r}/${t} боб ўқилди`,
    continueReading: 'Ўқишни давом эттириш',
    resumeBtn: 'Давом этиш',
    searchPlaceholder: 'Китоб, муаллиф ёки мавзу қидириш...',
    catAll: 'Барчаси',
    catFiqh: 'Фиқҳ & Ақида',
    catHadith: 'Ҳадис & Сийрат',
    catSpirituality: 'Тарбия & Мерос',
    catFavs: 'Севимли',
    chaptersUnit: (n) => `${n} боб`,
    backToShelf: 'Кутубхона',
    contentsTitle: 'Мундарижа',
    chapterWord: (n, total) => `${n}-боб / ${total}`,
    takeawayTitle: 'Амалий хулоса',
    markRead: 'Ўқилди деб белгилаш',
    markedRead: 'Ўқилган',
    prevChapter: 'Олдинги',
    nextChapter: 'Кейинги боб',
    sepiaLabel: 'Қоғоз',
    defaultPaperLabel: 'Оддий',
    copiedToast: 'Нусха олинди',
    sharedToast: 'Улашиш картаси тайёр',
    emptyFavs: 'Севимли китобларингиз ҳозирча йўқ — юракча белгисини босиб сақланг.',
    publicDomainNote: 'Барча китоблар очиқ классик ислом мероси асосида офлайн ўқиш учун тайёрланган',
  },
  ru: {
    heroTitle: 'Классическая Исламская Библиотека',
    heroSubtitle: (b, r, t) => `${b} классических книг · прочитано ${r}/${t} глав`,
    continueReading: 'Продолжить чтение',
    resumeBtn: 'Продолжить',
    searchPlaceholder: 'Поиск книги, автора или темы...',
    catAll: 'Все',
    catFiqh: 'Фикх и Акыда',
    catHadith: 'Хадисы и Сира',
    catSpirituality: 'Наследие и Нравы',
    catFavs: 'Избранное',
    chaptersUnit: (n) => `${n} гл.`,
    backToShelf: 'Библиотека',
    contentsTitle: 'Оглавление',
    chapterWord: (n, total) => `Глава ${n} из ${total}`,
    takeawayTitle: 'Практический вывод',
    markRead: 'Отметить прочитанной',
    markedRead: 'Прочитано',
    prevChapter: 'Назад',
    nextChapter: 'Следующая',
    sepiaLabel: 'Бумага',
    defaultPaperLabel: 'Обычный',
    copiedToast: 'Скопировано',
    sharedToast: 'Карточка готова',
    emptyFavs: 'Избранных книг пока нет — нажмите на сердечко, чтобы добавить.',
    publicDomainNote: 'Все книги подготовлены на основе классического наследия и доступны полностью офлайн',
  },
  en: {
    heroTitle: 'Classical Islamic Library',
    heroSubtitle: (b, r, t) => `${b} timeless classics · ${r}/${t} chapters read`,
    continueReading: 'Continue Reading',
    resumeBtn: 'Resume',
    searchPlaceholder: 'Search book, scholar, or topic...',
    catAll: 'All',
    catFiqh: 'Fiqh & Creed',
    catHadith: 'Hadith & Seerah',
    catSpirituality: 'Heritage & Ethics',
    catFavs: 'Favorites',
    chaptersUnit: (n) => `${n} ch.`,
    backToShelf: 'Library',
    contentsTitle: 'Chapters',
    chapterWord: (n, total) => `Chapter ${n} of ${total}`,
    takeawayTitle: 'Practical Reflection',
    markRead: 'Mark as Read',
    markedRead: 'Completed',
    prevChapter: 'Previous',
    nextChapter: 'Next Chapter',
    sepiaLabel: 'Paper',
    defaultPaperLabel: 'Standard',
    copiedToast: 'Copied to clipboard',
    sharedToast: 'Quote card ready',
    emptyFavs: 'No favorite books yet — tap the heart icon on any book to save it.',
    publicDomainNote: 'Curated public-domain classical works built for calm 100% offline reading',
  },
};

function getCoverGradient(theme: ClassicalBook['coverTheme']): string {
  switch (theme) {
    case 'walnut':
      return 'from-[#5a3316] via-[#7c4720] to-[#3f220d]';
    case 'navy':
      return 'from-[#0c2340] via-[#153b66] to-[#08172b]';
    case 'burgundy':
      return 'from-[#5c1624] via-[#7f1d32] to-[#3b0c16]';
    case 'teal':
      return 'from-[#094340] via-[#0f6660] to-[#062d2b]';
    case 'emerald':
    default:
      return 'from-[#0a4606] via-[#147514] to-[#072e04]';
  }
}

export const LibraryTab: React.FC = () => {
  const { isDay } = useTheme();
  const { language } = useLanguage();
  const ui = LIBRARY_UI[language] || LIBRARY_UI.uz_lat;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState<LibraryProgressState>(loadLibraryProgress);
  const [favorites, setFavorites] = useState<string[]>(loadLibraryFavs);
  const [category, setCategory] = useState<BookCategory>('all');
  const [search, setSearch] = useState('');

  const [activeBookId, setActiveBookId] = useState<string | null>(null);
  const [chapterIndex, setChapterIndex] = useState<number>(0);
  const [isTocOpen, setIsTocOpen] = useState<boolean>(false);
  const [fontScale, setFontScale] = useState<number>(() => {
    try {
      const saved = Number(localStorage.getItem(LIBRARY_FONT_KEY));
      if (saved >= 0 && saved <= 2) return saved;
    } catch {
      // ignore
    }
    return 1;
  });
  const [paperTone, setPaperTone] = useState<PaperTone>(() => {
    try {
      return localStorage.getItem(LIBRARY_PAPER_KEY) === 'sepia' ? 'sepia' : 'default';
    } catch {
      return 'default';
    }
  });
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [sharingCard, setSharingCard] = useState(false);

  const activeBook = useMemo(() => getBookById(activeBookId), [activeBookId]);

  const totalChaptersCount = useMemo(
    () => CLASSICAL_BOOKS.reduce((sum, b) => sum + b.chapters.length, 0),
    []
  );

  // Android hardware / gesture back button cleanly exits TOC -> Reader -> Bookshelf
  useEffect(() => {
    if (!activeBookId) return;
    const onBack = (e: Event) => {
      e.preventDefault();
      if (isTocOpen) {
        setIsTocOpen(false);
        return;
      }
      setActiveBookId(null);
    };
    window.addEventListener('nq:android-back', onBack);
    return () => window.removeEventListener('nq:android-back', onBack);
  }, [activeBookId, isTocOpen]);

  // Scroll reader container to top on chapter change
  useEffect(() => {
    const scroller = rootRef.current?.closest('.overflow-y-auto') as HTMLElement | null;
    if (scroller) scroller.scrollTop = 0;
  }, [activeBookId, chapterIndex]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    window.setTimeout(() => {
      setToastMsg((cur) => (cur === msg ? null : cur));
    }, 2200);
  };

  const openBook = (bookId: string, chIdx?: number) => {
    const book = getBookById(bookId);
    if (!book) return;
    const resolvedIdx =
      typeof chIdx === 'number'
        ? Math.max(0, Math.min(book.chapters.length - 1, chIdx))
        : progress.lastBookId === bookId
        ? Math.max(0, Math.min(book.chapters.length - 1, progress.lastChapterIndex))
        : 0;
    setActiveBookId(bookId);
    setChapterIndex(resolvedIdx);
    setIsTocOpen(false);
    setProgress((prev) => {
      const next: LibraryProgressState = {
        ...prev,
        lastBookId: bookId,
        lastChapterIndex: resolvedIdx,
      };
      saveLibraryProgress(next);
      return next;
    });
  };

  const goToChapter = (nextIdx: number) => {
    if (!activeBook) return;
    const safeIdx = Math.max(0, Math.min(activeBook.chapters.length - 1, nextIdx));
    setChapterIndex(safeIdx);
    setIsTocOpen(false);
    setProgress((prev) => {
      const next: LibraryProgressState = {
        ...prev,
        lastBookId: activeBook.id,
        lastChapterIndex: safeIdx,
      };
      saveLibraryProgress(next);
      return next;
    });
  };

  const toggleChapterRead = (chapterId: string) => {
    setProgress((prev) => {
      const exists = prev.readChapterIds.includes(chapterId);
      const readChapterIds = exists
        ? prev.readChapterIds.filter((id) => id !== chapterId)
        : [...prev.readChapterIds, chapterId];
      const next = { ...prev, readChapterIds };
      saveLibraryProgress(next);
      return next;
    });
  };

  const toggleFavoriteBook = (bookId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [bookId, ...prev];
      saveLibraryFavs(next);
      return next;
    });
  };

  const cycleFontScale = (delta: 1 | -1) => {
    setFontScale((prev) => {
      const next = Math.max(0, Math.min(2, prev + delta));
      try {
        localStorage.setItem(LIBRARY_FONT_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const togglePaperTone = () => {
    setPaperTone((prev) => {
      const next: PaperTone = prev === 'sepia' ? 'default' : 'sepia';
      try {
        localStorage.setItem(LIBRARY_PAPER_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  };

  const filteredBooks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return CLASSICAL_BOOKS.filter((book) => {
      if (category === 'favorites' && !favorites.includes(book.id)) return false;
      if (category !== 'all' && category !== 'favorites' && book.category !== category) return false;
      if (!q) return true;
      const tStr = resolveBookText(book.title, language).toLowerCase();
      const aStr = resolveBookText(book.author, language).toLowerCase();
      const sStr = resolveBookText(book.summary, language).toLowerCase();
      return (
        tStr.includes(q) ||
        aStr.includes(q) ||
        sStr.includes(q) ||
        book.title.uz_lat.toLowerCase().includes(q) ||
        book.title.en.toLowerCase().includes(q)
      );
    });
  }, [category, favorites, language, search]);

  const cardCls = isDay
    ? 'bg-white border-[#dde3ea] shadow-xs'
    : 'bg-slate-900/90 border-emerald-900/60';
  const subText = isDay ? 'text-slate-500' : 'text-slate-400';

  /* ==================== BOOK CHAPTER E-READER VIEW ==================== */
  if (activeBook) {
    const chapter = activeBook.chapters[chapterIndex] || activeBook.chapters[0];
    const bookTitle = resolveBookText(activeBook.title, language);
    const bookAuthor = resolveBookText(activeBook.author, language);
    const chapterTitle = resolveBookText(chapter.title, language);
    const paragraphs = resolveBookParagraphs(chapter.paragraphs, language);
    const takeaway = resolveBookText(chapter.takeaway, language);
    const isRead = progress.readChapterIds.includes(chapter.id);
    const isFav = favorites.includes(activeBook.id);
    const isSepia = isDay && paperTone === 'sepia';
    const isArabicQuote = Boolean(chapter.sourceQuote && /[\u0600-\u06FF]/.test(chapter.sourceQuote));

    const bodySizeCls =
      fontScale === 0
        ? 'text-[14px] leading-[1.78]'
        : fontScale === 2
        ? 'text-[17px] leading-[1.85]'
        : 'text-[15.5px] leading-[1.82]';

    const handleCopyChapter = () => {
      const lines = [
        `${bookTitle} — ${bookAuthor}`,
        chapterTitle,
        '',
        ...(chapter.sourceQuote ? [chapter.sourceQuote, ''] : []),
        ...paragraphs,
        '',
        `${ui.takeawayTitle}: ${takeaway}`,
      ];
      void copyTextSafely(lines.join('\n'));
      showToast(ui.copiedToast);
    };

    const handleShareQuoteCard = async () => {
      setSharingCard(true);
      try {
        const rendered = await generateNurulIslamShareCard({
          isDay,
          eyebrow: ui.backToShelf,
          metaPill: `${bookAuthor} · ${activeBook.era}`,
          title: bookTitle,
          subtitle: chapterTitle,
          featuredText: chapter.sourceQuote,
          featuredIsArabic: isArabicQuote,
          bodyText: paragraphs[0] || takeaway,
          noteLabel: ui.takeawayTitle,
          noteText: takeaway,
          footerSectionTitle: 'Nurul Islam · Kutubxona',
        });
        if (!rendered) {
          handleCopyChapter();
          return;
        }
        await shareOrSavePngCard({
          rendered,
          fileName: `nurul-islam-book-${activeBook.id}-${chapter.number}.png`,
          shareTitle: `${bookTitle} — ${chapterTitle}`,
          caption: `${bookTitle} (${bookAuthor}) · ${chapterTitle}\n${takeaway}`,
        });
        showToast(ui.sharedToast);
      } catch {
        handleCopyChapter();
      } finally {
        setSharingCard(false);
      }
    };

    return (
      <div
        ref={rootRef}
        className={`space-y-3 pb-8 animate-in fade-in ${isDay ? 'text-slate-900' : 'text-slate-100'}`}
      >
        {/* Clean Reader Top Bar */}
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setActiveBookId(null)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition active:scale-95 shrink-0 ${
              isDay
                ? 'bg-white border-[#dde3ea] text-[#0c4703] hover:bg-[#eef9ea]'
                : 'bg-slate-900 border-emerald-900/60 text-emerald-300'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{ui.backToShelf}</span>
          </button>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => cycleFontScale(-1)}
              disabled={fontScale === 0}
              className={`px-2 py-1.5 rounded-xl border text-[11px] font-bold disabled:opacity-40 transition ${
                isDay ? 'bg-white border-[#dde3ea] text-slate-700' : 'bg-slate-900 border-emerald-900/60 text-slate-200'
              }`}
              aria-label="Decrease font size"
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => cycleFontScale(1)}
              disabled={fontScale === 2}
              className={`px-2 py-1.5 rounded-xl border text-[11px] font-bold disabled:opacity-40 transition ${
                isDay ? 'bg-white border-[#dde3ea] text-slate-700' : 'bg-slate-900 border-emerald-900/60 text-slate-200'
              }`}
              aria-label="Increase font size"
            >
              A+
            </button>
            {isDay && (
              <button
                type="button"
                onClick={togglePaperTone}
                className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition ${
                  isSepia
                    ? 'bg-[#f6eedb] border-[#d8c499] text-[#5c3d15]'
                    : 'bg-white border-[#dde3ea] text-slate-700'
                }`}
              >
                {isSepia ? ui.sepiaLabel : ui.defaultPaperLabel}
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsTocOpen(true)}
              className={`p-1.5 rounded-xl border transition ${
                isDay
                  ? 'bg-white border-[#dde3ea] text-[#0c4703] hover:bg-[#eef9ea]'
                  : 'bg-slate-900 border-emerald-900/60 text-amber-300'
              }`}
              aria-label={ui.contentsTitle}
              title={ui.contentsTitle}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => toggleFavoriteBook(activeBook.id)}
              className={`p-1.5 rounded-xl border transition ${
                isFav
                  ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-700/50 dark:text-rose-300'
                  : isDay
                  ? 'bg-white border-[#dde3ea] text-slate-500'
                  : 'bg-slate-900 border-emerald-900/60 text-slate-400'
              }`}
              aria-label="Favorite book"
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Book Identity Ribbon */}
        <div
          className={`nq-keep-dark rounded-3xl p-4 text-white border shadow-md bg-gradient-to-br ${getCoverGradient(
            activeBook.coverTheme
          )} border-white/15`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <span className="inline-block px-2 py-0.5 rounded-full bg-black/25 border border-white/15 text-[10px] font-bold text-[#fde68a]">
                {ui.chapterWord(chapter.number, activeBook.chapters.length)}
              </span>
              <h1 className="font-display text-lg font-extrabold leading-snug text-white">
                {bookTitle}
              </h1>
              <p className="text-xs text-white/80">
                {bookAuthor} · {activeBook.era}
              </p>
            </div>
            <span className="font-arabic text-base text-[#fde68a]/90 text-right shrink-0">
              {activeBook.arabicTitle}
            </span>
          </div>
        </div>

        {toastMsg && (
          <div
            className={`px-3 py-2 rounded-2xl text-xs font-bold text-center border animate-in fade-in ${
              isDay
                ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                : 'bg-emerald-950 border-emerald-700 text-amber-300'
            }`}
          >
            {toastMsg}
          </div>
        )}

        {/* Main Reading Paper Card */}
        <article
          className={`rounded-3xl border p-4 sm:p-6 space-y-4 transition-colors ${
            isSepia
              ? 'bg-[#faf4e6] border-[#e4d5b7] text-[#2c2113] shadow-sm'
              : isDay
              ? 'bg-white border-[#dde3ea] text-slate-900 shadow-xs'
              : 'bg-slate-900/95 border-emerald-900/60 text-slate-100'
          }`}
        >
          <div className="flex items-start justify-between gap-2 pb-3 border-b border-current/10">
            <h2 className="font-display text-lg sm:text-xl font-bold leading-snug">
              {chapter.number}. {chapterTitle}
            </h2>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleCopyChapter}
                className={`p-2 rounded-xl transition ${
                  isSepia
                    ? 'bg-[#efe4cc] text-[#5c3d15] hover:bg-[#e5d4b3]'
                    : isDay
                    ? 'bg-[#f1f5f9] text-slate-600 hover:text-[#0c4703]'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
                aria-label="Copy chapter"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={sharingCard}
                onClick={() => void handleShareQuoteCard()}
                className={`p-2 rounded-xl transition disabled:opacity-50 ${
                  isSepia
                    ? 'bg-[#efe4cc] text-[#5c3d15] hover:bg-[#e5d4b3]'
                    : isDay
                    ? 'bg-[#eef9ea] text-[#0c4703] hover:bg-[#dff4d8]'
                    : 'bg-emerald-950 text-amber-300 hover:text-amber-200'
                }`}
                aria-label="Share quote card"
              >
                <Share2 className={`w-3.5 h-3.5 ${sharingCard ? 'animate-pulse' : ''}`} />
              </button>
            </div>
          </div>

          {/* Authentic Classical Source Quote */}
          {chapter.sourceQuote && (
            <div
              className={`rounded-2xl border p-4 space-y-2 ${
                isSepia
                  ? 'bg-[#f3e8d0] border-[#dcc69c]'
                  : isDay
                  ? 'bg-[#f4fbf1] border-[#cde8c3]'
                  : 'bg-emerald-950/55 border-emerald-800/60'
              }`}
            >
              <p
                dir={isArabicQuote ? 'rtl' : 'ltr'}
                className={
                  isArabicQuote
                    ? `font-arabic text-xl sm:text-2xl leading-[2.05] text-right ${
                        isSepia ? 'text-[#2b1e0e]' : isDay ? 'text-[#0c4703]' : 'text-amber-200'
                      }`
                    : `font-display italic text-sm sm:text-base leading-relaxed whitespace-pre-line ${
                        isSepia ? 'text-[#422c11]' : isDay ? 'text-[#0c4703]' : 'text-amber-200'
                      }`
                }
              >
                {chapter.sourceQuote}
              </p>
              {chapter.sourceLabel && (
                <p
                  className={`text-[11px] font-semibold ${
                    isSepia ? 'text-[#73562d]' : isDay ? 'text-[#158509]' : 'text-emerald-300/90'
                  }`}
                >
                  — {resolveBookText(chapter.sourceLabel, language)}
                </p>
              )}
            </div>
          )}

          {/* Reading Paragraphs */}
          <div className={`space-y-3.5 ${bodySizeCls}`}>
            {paragraphs.map((para, idx) => (
              <p key={idx} className={isSepia ? 'text-[#2c2113]' : isDay ? 'text-slate-700' : 'text-slate-200'}>
                {para}
              </p>
            ))}
          </div>

          {/* Practical Reflection Box */}
          <div
            className={`rounded-2xl border p-3.5 space-y-1 ${
              isSepia
                ? 'bg-[#efe4cc]/80 border-[#d6be91]'
                : isDay
                ? 'bg-amber-50/85 border-amber-200/90'
                : 'bg-amber-950/30 border-amber-600/40'
            }`}
          >
            <div
              className={`flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider ${
                isSepia ? 'text-[#6e4917]' : isDay ? 'text-amber-800' : 'text-amber-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>{ui.takeawayTitle}</span>
            </div>
            <p
              className={`text-[13px] leading-relaxed font-medium ${
                isSepia ? 'text-[#3b2912]' : isDay ? 'text-amber-950' : 'text-amber-100'
              }`}
            >
              {takeaway}
            </p>
          </div>

          {/* Mark Chapter Completed */}
          <button
            type="button"
            onClick={() => toggleChapterRead(chapter.id)}
            className={`w-full py-2.5 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition active:scale-[0.99] ${
              isRead
                ? isDay
                  ? 'bg-[#158509] border-[#158509] text-white nq-keep-dark'
                  : 'bg-amber-400 border-amber-400 text-slate-950'
                : isDay
                ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703] hover:bg-[#e1f5da]'
                : 'bg-emerald-950 border-emerald-800 text-emerald-300 hover:bg-emerald-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isRead ? ui.markedRead : ui.markRead}</span>
          </button>
        </article>

        {/* Previous / Next Chapter Navigation */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            disabled={chapterIndex <= 0}
            onClick={() => goToChapter(chapterIndex - 1)}
            className={`py-3 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-[0.99] disabled:opacity-40 ${cardCls}`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{ui.prevChapter}</span>
          </button>

          <button
            type="button"
            disabled={chapterIndex >= activeBook.chapters.length - 1}
            onClick={() => {
              if (!isRead) toggleChapterRead(chapter.id);
              goToChapter(chapterIndex + 1);
            }}
            className={`py-3 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-[0.99] disabled:opacity-40 ${
              isDay
                ? 'bg-[#158509] hover:bg-[#0c5007] text-white nq-keep-dark'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
            }`}
          >
            <span>{ui.nextChapter}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Table of Contents (Mundarija) Sheet */}
        {isTocOpen && (
          <div
            onClick={() => setIsTocOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md max-h-[80dvh] rounded-t-3xl sm:rounded-3xl border flex flex-col overflow-hidden shadow-2xl ${
                isDay
                  ? 'bg-white border-[#dde3ea] text-slate-900'
                  : 'bg-slate-900 border-emerald-800/80 text-slate-100'
              }`}
            >
              <div
                className={`px-4 py-3.5 border-b flex items-center justify-between ${
                  isDay ? 'border-slate-100' : 'border-emerald-900/50'
                }`}
              >
                <div>
                  <h3 className="text-sm font-extrabold">{ui.contentsTitle}</h3>
                  <p className={`text-[11px] ${subText}`}>{bookTitle}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTocOpen(false)}
                  className={`p-1.5 rounded-xl ${isDay ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-300'}`}
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="overflow-y-auto p-3 space-y-1.5">
                {activeBook.chapters.map((ch, idx) => {
                  const selected = idx === chapterIndex;
                  const done = progress.readChapterIds.includes(ch.id);
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => goToChapter(idx)}
                      className={`w-full p-3 rounded-2xl border flex items-center justify-between gap-2 text-left transition ${
                        selected
                          ? isDay
                            ? 'bg-[#eef9ea] border-[#158509] text-[#0c4703]'
                            : 'bg-emerald-950 border-amber-400 text-amber-200'
                          : isDay
                          ? 'bg-slate-50/70 border-slate-200/80 hover:border-[#158509]/50'
                          : 'bg-slate-950/70 border-slate-800 hover:border-emerald-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`w-7 h-7 rounded-xl font-mono text-xs font-bold flex items-center justify-center shrink-0 ${
                            done
                              ? isDay
                                ? 'bg-[#158509] text-white'
                                : 'bg-amber-400 text-slate-950'
                              : isDay
                              ? 'bg-white border border-slate-200 text-slate-700'
                              : 'bg-slate-900 border border-slate-700 text-slate-300'
                          }`}
                        >
                          {done ? <Check className="w-3.5 h-3.5" /> : ch.number}
                        </span>
                        <span className="text-xs font-bold leading-snug">
                          {resolveBookText(ch.title, language)}
                        </span>
                      </div>
                      <ChevronRight className={`w-4 h-4 shrink-0 ${subText}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ==================== BOOKSHELF HOME VIEW ==================== */
  const lastBook = getBookById(progress.lastBookId);
  const lastChapter = lastBook?.chapters[progress.lastChapterIndex] || lastBook?.chapters[0];
  const overallPct = Math.round(
    (progress.readChapterIds.length / Math.max(1, totalChaptersCount)) * 100
  );

  const categories: Array<{ id: BookCategory; label: string }> = [
    { id: 'all', label: ui.catAll },
    { id: 'fiqh', label: ui.catFiqh },
    { id: 'hadith', label: ui.catHadith },
    { id: 'spirituality', label: ui.catSpirituality },
    { id: 'favorites', label: ui.catFavs },
  ];

  return (
    <div
      ref={rootRef}
      className={`space-y-3.5 pb-6 animate-in fade-in ${isDay ? 'text-slate-900' : 'text-slate-100'}`}
    >
      {/* Library Hero + Continue Reading */}
      <div
        className={`nq-keep-dark rounded-3xl p-4 text-white border shadow-lg space-y-3 ${
          isDay ? 'nq-hero-day border-[#0a4306]' : 'nq-hero-night border-emerald-800/60'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#d0f39f]">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{ui.heroTitle}</span>
            </div>
            <p className="text-xs text-white/85 mt-1">
              {ui.heroSubtitle(CLASSICAL_BOOKS.length, progress.readChapterIds.length, totalChaptersCount)}
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-black/25 border border-white/15 font-mono text-xs font-extrabold text-[#fde68a] shrink-0">
            {overallPct}%
          </span>
        </div>

        <div className="w-full h-1.5 rounded-full bg-white/15 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#d0f39f] to-[#fde68a] transition-all duration-300"
            style={{ width: `${Math.max(overallPct > 0 ? 4 : 2, overallPct)}%` }}
          />
        </div>

        {lastBook && lastChapter && (
          <div className="rounded-2xl bg-black/25 border border-white/15 px-3 py-2.5 flex items-center justify-between gap-2.5">
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#d0f39f] block">
                {ui.continueReading}
              </span>
              <p className="text-xs font-bold text-white truncate">
                {resolveBookText(lastBook.title, language)} · {lastChapter.number}-bob
              </p>
            </div>
            <button
              type="button"
              onClick={() => openBook(lastBook.id, progress.lastChapterIndex)}
              className="px-3 py-1.5 rounded-xl bg-[#d0f39f] text-[#0c4703] text-xs font-extrabold shrink-0 active:scale-95 transition"
            >
              {ui.resumeBtn}
            </button>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className={`absolute left-3.5 top-3 w-4 h-4 ${isDay ? 'text-[#158509]' : 'text-emerald-400'}`} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={ui.searchPlaceholder}
          className={`w-full border rounded-2xl pl-10 pr-4 py-2.5 text-sm focus:outline-none transition ${
            isDay
              ? 'bg-white border-[#dde3ea] text-slate-900 placeholder-slate-400 focus:border-[#158509]'
              : 'bg-slate-900 border-emerald-900/60 text-white placeholder-slate-400 focus:border-amber-400'
          }`}
        />
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
        {categories.map((cat) => {
          const active = category === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap transition shrink-0 ${
                active
                  ? isDay
                    ? 'bg-[#158509] border-[#158509] text-white nq-keep-dark shadow-xs'
                    : 'bg-amber-400 border-amber-400 text-slate-950 shadow-xs'
                  : isDay
                  ? 'bg-white border-[#dde3ea] text-slate-700 hover:border-[#158509]/50'
                  : 'bg-slate-900 border-emerald-900/60 text-slate-300 hover:border-amber-400/60'
              }`}
            >
              {cat.label}
              {cat.id === 'favorites' && favorites.length > 0 ? ` (${favorites.length})` : ''}
            </button>
          );
        })}
      </div>

      {/* Classic Hardcover Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className={`rounded-2xl border p-6 text-center text-xs ${cardCls} ${subText}`}>
          {ui.emptyFavs}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredBooks.map((book) => {
            const readInBook = book.chapters.filter((ch) =>
              progress.readChapterIds.includes(ch.id)
            ).length;
            const pct = Math.round((readInBook / Math.max(1, book.chapters.length)) * 100);
            const isFav = favorites.includes(book.id);

            return (
              <div
                key={book.id}
                onClick={() => openBook(book.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openBook(book.id);
                  }
                }}
                className={`rounded-2xl border overflow-hidden cursor-pointer transition active:scale-[0.99] flex flex-col ${cardCls} ${
                  isDay ? 'hover:border-[#158509]/60' : 'hover:border-amber-400/60'
                }`}
              >
                {/* Classic Leather Spine Book Cover Header */}
                <div
                  className={`nq-keep-dark relative px-3.5 py-3 text-white bg-gradient-to-br ${getCoverGradient(
                    book.coverTheme
                  )}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-black/25 border border-white/15 text-[9.5px] font-bold text-[#fde68a] truncate">
                      {resolveBookText(book.heritageBadge, language)}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavoriteBook(book.id);
                      }}
                      className={`p-1 rounded-lg transition shrink-0 ${
                        isFav ? 'text-rose-300 bg-black/25' : 'text-white/65 hover:text-white'
                      }`}
                      aria-label="Favorite book"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <p className="font-arabic text-base text-[#fde68a]/90 mt-2 text-right">
                    {book.arabicTitle}
                  </p>
                  <h3 className="font-display text-[15px] font-extrabold leading-snug text-white mt-0.5">
                    {resolveBookText(book.title, language)}
                  </h3>
                  <p className="text-[11px] text-white/80 truncate mt-0.5">
                    {resolveBookText(book.author, language)}
                  </p>
                </div>

                {/* Book Card Body */}
                <div className="p-3.5 flex-1 flex flex-col justify-between gap-2.5">
                  <p className={`text-[12px] leading-relaxed line-clamp-2 ${subText}`}>
                    {resolveBookText(book.summary, language)}
                  </p>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold">
                      <span className={subText}>{ui.chaptersUnit(book.chapters.length)}</span>
                      <span className={`font-mono ${isDay ? 'text-[#158509]' : 'text-amber-300'}`}>
                        {readInBook}/{book.chapters.length}
                      </span>
                    </div>
                    <div
                      className={`w-full h-1.5 rounded-full overflow-hidden ${
                        isDay ? 'bg-slate-100' : 'bg-slate-800'
                      }`}
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isDay ? 'bg-[#158509]' : 'bg-amber-400'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className={`text-center text-[11px] px-2 pt-1 ${subText}`}>{ui.publicDomainNote}</p>
    </div>
  );
};
