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
const LIBRARY_PAPER_KEY = 'nq_library_paper_v2';

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

type PaperTone = 'sepia' | 'ivory';

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

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
    chapterRoman: (roman: string) => string;
    takeawayTitle: string;
    markRead: string;
    markedRead: string;
    prevPage: string;
    nextPage: string;
    sepiaLabel: string;
    ivoryLabel: string;
    copiedToast: string;
    sharedToast: string;
    emptyFavs: string;
    publicDomainNote: string;
    swipeHint: string;
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
    chapterRoman: (roman) => `${roman} BOB`,
    takeawayTitle: 'Amaliy xulosa',
    markRead: 'O‘qildi',
    markedRead: 'O‘qilgan',
    prevPage: 'Oldingi',
    nextPage: 'Keyingi',
    sepiaLabel: 'Qog‘oz',
    ivoryLabel: 'Oq',
    copiedToast: 'Nusxa olindi',
    sharedToast: 'Ulashish kartasi tayyor',
    emptyFavs: 'Sevimli kitoblaringiz hozircha yo‘q — yurakcha belgisini bosib saqlang.',
    publicDomainNote: 'Barcha kitoblar ochiq klassik islom merosi asosida 100% oflayn o‘qish uchun tayyorlangan',
    swipeHint: 'Sahifani varaqlash uchun chapga yoki o‘ngga suring',
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
    chapterRoman: (roman) => `${roman} БОБ`,
    takeawayTitle: 'Амалий хулоса',
    markRead: 'Ўқилди',
    markedRead: 'Ўқилган',
    prevPage: 'Олдинги',
    nextPage: 'Кейинги',
    sepiaLabel: 'Қоғоз',
    ivoryLabel: 'Оқ',
    copiedToast: 'Нусха олинди',
    sharedToast: 'Улашиш картаси тайёр',
    emptyFavs: 'Севимли китобларингиз ҳозирча йўқ — юракча белгисини босиб сақланг.',
    publicDomainNote: 'Барча китоблар очиқ классик ислом мероси асосида 100% офлайн ўқиш учун тайёрланган',
    swipeHint: 'Саҳифани варақлаш учун чапга ёки ўнгга суринг',
  },
  ru: {
    heroTitle: 'Классическая Исламская Библиотека',
    heroSubtitle: (b, r, t) => `${b} классических книг · прочитано ${r}/${t} глав`,
    continueReading: 'Продолжить чтение',
    resumeBtn: 'Читать',
    searchPlaceholder: 'Поиск книги, автора или темы...',
    catAll: 'Все',
    catFiqh: 'Фикх и Акыда',
    catHadith: 'Хадисы и Сира',
    catSpirituality: 'Наследие и Нравы',
    catFavs: 'Избранное',
    chaptersUnit: (n) => `${n} гл.`,
    backToShelf: 'Библиотека',
    contentsTitle: 'Оглавление',
    chapterRoman: (roman) => `ГЛАВА ${roman}`,
    takeawayTitle: 'Практический вывод',
    markRead: 'Прочитано',
    markedRead: 'Прочитано ✓',
    prevPage: 'Назад',
    nextPage: 'Далее',
    sepiaLabel: 'Бумага',
    ivoryLabel: 'Белый',
    copiedToast: 'Скопировано',
    sharedToast: 'Карточка готова',
    emptyFavs: 'Избранных книг пока нет — нажмите на сердечко, чтобы добавить.',
    publicDomainNote: 'Все книги подготовлены на основе классического наследия и доступны полностью офлайн',
    swipeHint: 'Смахните влево или вправо, чтобы перелистнуть страницу',
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
    contentsTitle: 'Contents',
    chapterRoman: (roman) => `CHAPTER ${roman}`,
    takeawayTitle: 'Practical Reflection',
    markRead: 'Mark Read',
    markedRead: 'Read ✓',
    prevPage: 'Prev',
    nextPage: 'Next',
    sepiaLabel: 'Paper',
    ivoryLabel: 'White',
    copiedToast: 'Copied to clipboard',
    sharedToast: 'Quote card ready',
    emptyFavs: 'No favorite books yet — tap the heart icon on any book to save it.',
    publicDomainNote: 'Curated public-domain classical works crafted for calm 100% offline reading',
    swipeHint: 'Swipe left or right to turn pages',
  },
};

function getCoverGradient(theme: ClassicalBook['coverTheme']): string {
  switch (theme) {
    case 'walnut':
      return 'from-[#5a3316] via-[#7c4720] to-[#3c1f0b]';
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
  const swipeStartXRef = useRef<number | null>(null);
  const swipeStartYRef = useRef<number | null>(null);

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
  // Default to authentic warm cream book paper so opening any book immediately feels like a real printed volume
  const [paperTone, setPaperTone] = useState<PaperTone>(() => {
    try {
      return localStorage.getItem(LIBRARY_PAPER_KEY) === 'ivory' ? 'ivory' : 'sepia';
    } catch {
      return 'sepia';
    }
  });
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [sharingCard, setSharingCard] = useState(false);

  const activeBook = useMemo(() => getBookById(activeBookId), [activeBookId]);

  const totalChaptersCount = useMemo(
    () => CLASSICAL_BOOKS.reduce((sum, b) => sum + b.chapters.length, 0),
    []
  );

  // Android hardware / gesture back button cleanly exits TOC -> Book Page -> Bookshelf
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

  // Scroll reader container cleanly to top on page turn
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
      const next: PaperTone = prev === 'sepia' ? 'ivory' : 'sepia';
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

  /* ==================== PHYSICAL OPEN-BOOK PAGE VIEW ==================== */
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
    const roman = ROMAN_NUMERALS[chapter.number - 1] || String(chapter.number);

    const bodySizeCls =
      fontScale === 0
        ? 'text-[14.5px] leading-[1.88]'
        : fontScale === 2
        ? 'text-[17.5px] leading-[1.95]'
        : 'text-[16px] leading-[1.92]';

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

    const handleTouchStart = (e: React.TouchEvent) => {
      swipeStartXRef.current = e.changedTouches[0]?.clientX ?? null;
      swipeStartYRef.current = e.changedTouches[0]?.clientY ?? null;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
      if (swipeStartXRef.current === null || swipeStartYRef.current === null) return;
      const dx = (e.changedTouches[0]?.clientX ?? 0) - swipeStartXRef.current;
      const dy = (e.changedTouches[0]?.clientY ?? 0) - swipeStartYRef.current;
      swipeStartXRef.current = null;
      swipeStartYRef.current = null;
      if (Math.abs(dx) > 64 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        if (dx < 0 && chapterIndex < activeBook.chapters.length - 1) {
          goToChapter(chapterIndex + 1);
        } else if (dx > 0 && chapterIndex > 0) {
          goToChapter(chapterIndex - 1);
        }
      }
    };

    // Paper & ink tokens for authentic printed-book feel
    const sheetBg = isSepia
      ? 'bg-[#fbf6ea] border-[#d9c79e] text-[#2a1f12]'
      : isDay
      ? 'bg-[#fffefb] border-[#dcd6c8] text-[#1e1b18]'
      : 'bg-[#0e1714] border-[#253b31] text-[#e7decb]';
    const stackBg1 = isSepia
      ? 'bg-[#f1e5cb] border-[#d2bc8f]'
      : isDay
      ? 'bg-[#f4f1ea] border-[#d5cfc0]'
      : 'bg-[#09100e] border-[#1c2e26]';
    const stackBg2 = isSepia
      ? 'bg-[#e8d8b7] border-[#c8ae7c]'
      : isDay
      ? 'bg-[#eae6dc] border-[#ccc5b5]'
      : 'bg-[#060c0a] border-[#15241e]';
    const ornamentColor = isSepia
      ? 'text-[#8c6428]'
      : isDay
      ? 'text-[#146510]'
      : 'text-[#d8b468]';
    const ruleColor = isSepia
      ? 'border-[#ceb582]/70'
      : isDay
      ? 'border-[#158509]/25'
      : 'border-[#d8b468]/30';
    const mutedInk = isSepia
      ? 'text-[#775e38]'
      : isDay
      ? 'text-slate-500'
      : 'text-[#a89f8c]';
    const dropCapColor = isSepia
      ? 'first-letter:text-[#6e4512]'
      : isDay
      ? 'first-letter:text-[#0c4703]'
      : 'first-letter:text-[#e8c675]';

    return (
      <div
        ref={rootRef}
        className={`space-y-3 pb-8 animate-in fade-in ${isDay ? 'text-slate-900' : 'text-slate-100'}`}
      >
        {/* Whisper-Quiet Top Reading Toolbar (No bulky banner!) */}
        <div className="flex items-center justify-between gap-1.5">
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
              className={`px-2 py-1.5 rounded-xl border text-[11px] font-bold disabled:opacity-35 transition ${
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
              className={`px-2 py-1.5 rounded-xl border text-[11px] font-bold disabled:opacity-35 transition ${
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
                className={`px-2 py-1.5 rounded-xl border text-[11px] font-bold transition ${
                  isSepia
                    ? 'bg-[#f6eedb] border-[#d8c499] text-[#5c3d15]'
                    : 'bg-white border-[#dde3ea] text-slate-700'
                }`}
              >
                {isSepia ? ui.sepiaLabel : ui.ivoryLabel}
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
              disabled={sharingCard}
              onClick={() => void handleShareQuoteCard()}
              className={`p-1.5 rounded-xl border transition disabled:opacity-50 ${
                isDay
                  ? 'bg-white border-[#dde3ea] text-[#0c4703] hover:bg-[#eef9ea]'
                  : 'bg-slate-900 border-emerald-900/60 text-amber-300'
              }`}
              aria-label="Share quote card"
            >
              <Share2 className={`w-4 h-4 ${sharingCard ? 'animate-pulse' : ''}`} />
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

        {toastMsg && (
          <div
            className={`px-3 py-1.5 rounded-xl text-xs font-bold text-center border animate-in fade-in ${
              isDay
                ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                : 'bg-emerald-950 border-emerald-700 text-amber-300'
            }`}
          >
            {toastMsg}
          </div>
        )}

        {/* PHYSICAL BOUND BOOK SHEET WITH STACKED PAGES, SPINE CREASE & ILLUMINATED FRAME */}
        <div
          className="relative pr-2 pb-2"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Underlying Stacked Book Pages (3D physical edge depth) */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 translate-x-2 translate-y-2 rounded-l-[3px] rounded-r-[14px] border ${stackBg2}`}
          />
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 translate-x-1 translate-y-1 rounded-l-[3px] rounded-r-[14px] border ${stackBg1}`}
          />

          {/* Active Printed Book Leaf */}
          <article
            className={`relative rounded-l-[3px] rounded-r-[14px] border overflow-hidden shadow-[0_10px_28px_rgba(32,20,6,0.14)] transition-colors ${sheetBg}`}
          >
            {/* Realistic Left Book-Binding Spine Gutter Shadow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-7"
              style={{
                background: isDay
                  ? 'linear-gradient(90deg, rgba(66,40,12,0.18) 0%, rgba(66,40,12,0.06) 11px, rgba(66,40,12,0) 28px)'
                  : 'linear-gradient(90deg, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.16) 12px, rgba(0,0,0,0) 28px)',
              }}
            />

            {/* Subtle Fine Classical Book Border Frame */}
            <div className="p-3 sm:p-4 pl-5 sm:pl-6">
              <div
                className={`border ${ruleColor} rounded-l-[2px] rounded-r-[10px] px-4 sm:px-7 py-5 sm:py-7 min-h-[62dvh] flex flex-col justify-between`}
              >
                <div>
                  {/* Running Book Header (Classic printed top folio) */}
                  <header className={`pb-3 mb-5 border-b ${ruleColor} text-center space-y-0.5`}>
                    <p
                      className={`font-display text-[10px] sm:text-[11px] uppercase tracking-[0.18em] font-semibold truncate ${mutedInk}`}
                    >
                      {bookTitle}
                    </p>
                    <p className={`text-[10px] italic font-display truncate ${mutedInk} opacity-85`}>
                      {bookAuthor} · {activeBook.era}
                    </p>
                  </header>

                  {/* Ornamental Chapter Opening */}
                  <div className="text-center space-y-1.5 mb-5">
                    <div
                      className={`font-display text-[11px] font-bold tracking-[0.24em] uppercase ${ornamentColor}`}
                    >
                      — {ui.chapterRoman(roman)} —
                    </div>
                    <h1 className="font-display text-[21px] sm:text-[24px] font-bold leading-snug tracking-tight">
                      {chapterTitle}
                    </h1>
                    <div className={`flex items-center justify-center gap-2.5 pt-1 ${ornamentColor} opacity-75`}>
                      <span className={`w-10 border-t ${ruleColor}`} />
                      <span className="text-xs leading-none">❖</span>
                      <span className={`w-10 border-t ${ruleColor}`} />
                    </div>
                  </div>

                  {/* Classical Arabic / Verse Epigraph (Printed inline between rules — no chat bubble!) */}
                  {chapter.sourceQuote && (
                    <blockquote className={`my-5 py-3.5 px-2 border-y ${ruleColor} text-center space-y-2`}>
                      <p
                        dir={isArabicQuote ? 'rtl' : 'ltr'}
                        className={
                          isArabicQuote
                            ? `font-arabic text-[22px] sm:text-[25px] leading-[2.05] ${
                                isSepia ? 'text-[#3c2408]' : isDay ? 'text-[#0c4703]' : 'text-[#f2d388]'
                              }`
                            : `font-display italic text-[15px] sm:text-[16.5px] leading-relaxed whitespace-pre-line ${
                                isSepia ? 'text-[#4c300f]' : isDay ? 'text-[#0c4703]' : 'text-[#f2d388]'
                              }`
                        }
                      >
                        {chapter.sourceQuote}
                      </p>
                      {chapter.sourceLabel && (
                        <footer className={`font-display text-[11px] italic ${mutedInk}`}>
                          — {resolveBookText(chapter.sourceLabel, language)}
                        </footer>
                      )}
                    </blockquote>
                  )}

                  {/* Authentic Justified Serif Book Prose with Illuminated Drop Cap */}
                  <div className={`font-display space-y-4 text-justify ${bodySizeCls}`}>
                    {paragraphs.map((para, idx) => (
                      <p
                        key={idx}
                        className={
                          idx === 0
                            ? `first-letter:float-left first-letter:font-display first-letter:text-[46px] first-letter:font-bold first-letter:leading-[0.84] first-letter:mr-2.5 first-letter:mt-1 ${dropCapColor}`
                            : 'indent-6'
                        }
                      >
                        {para}
                      </p>
                    ))}
                  </div>

                  {/* Classic Book Footnote / Marginalia Reflection */}
                  <aside className="mt-7 pt-4">
                    <div className={`w-20 border-t ${ruleColor} mb-3`} />
                    <div className="flex items-start justify-between gap-2">
                      <p className={`font-display italic text-[13.5px] leading-relaxed ${mutedInk}`}>
                        <span className={`not-italic font-bold mr-1.5 ${ornamentColor}`}>
                          ❖ {ui.takeawayTitle}:
                        </span>
                        {takeaway}
                      </p>
                      <button
                        type="button"
                        onClick={handleCopyChapter}
                        className={`p-1.5 rounded-lg shrink-0 transition opacity-70 hover:opacity-100 ${mutedInk}`}
                        aria-label="Copy passage"
                        title="Copy"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </aside>
                </div>

                {/* Printed Page Folio Number Footer */}
                <footer className={`mt-8 pt-3 border-t ${ruleColor} flex items-center justify-between text-[11px] font-display ${mutedInk}`}>
                  <span className="font-arabic text-xs opacity-80">{activeBook.arabicTitle}</span>
                  <span className="font-bold tracking-widest tabular-nums">
                    — {chapter.number} / {activeBook.chapters.length} —
                  </span>
                </footer>
              </div>
            </div>
          </article>
        </div>

        {/* Clean Page-Turn Footer Controls */}
        <div className="grid grid-cols-3 gap-2 pt-0.5">
          <button
            type="button"
            disabled={chapterIndex <= 0}
            onClick={() => goToChapter(chapterIndex - 1)}
            className={`py-2.5 px-2 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1 transition active:scale-[0.98] disabled:opacity-35 ${cardCls}`}
          >
            <ChevronLeft className="w-4 h-4 shrink-0" />
            <span className="truncate">{ui.prevPage}</span>
          </button>

          <button
            type="button"
            onClick={() => toggleChapterRead(chapter.id)}
            className={`py-2.5 px-2 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1 transition active:scale-[0.98] ${
              isRead
                ? isDay
                  ? 'bg-[#158509] border-[#158509] text-white nq-keep-dark'
                  : 'bg-amber-400 border-amber-400 text-slate-950'
                : isDay
                ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                : 'bg-emerald-950 border-emerald-800 text-emerald-300'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{isRead ? ui.markedRead : ui.markRead}</span>
          </button>

          <button
            type="button"
            disabled={chapterIndex >= activeBook.chapters.length - 1}
            onClick={() => {
              if (!isRead) toggleChapterRead(chapter.id);
              goToChapter(chapterIndex + 1);
            }}
            className={`py-2.5 px-2 rounded-2xl text-xs font-bold flex items-center justify-center gap-1 transition active:scale-[0.98] disabled:opacity-35 ${
              isDay
                ? 'bg-[#158509] hover:bg-[#0c5007] text-white nq-keep-dark'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
            }`}
          >
            <span className="truncate">{ui.nextPage}</span>
            <ChevronRight className="w-4 h-4 shrink-0" />
          </button>
        </div>

        <p className={`text-center text-[10.5px] ${subText}`}>{ui.swipeHint}</p>

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

  /* ==================== CLASSICAL STANDING BOOKSHELF HOME VIEW ==================== */
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

      {/* Realistic 2-Column Hardcover Book Covers Grid */}
      {filteredBooks.length === 0 ? (
        <div className={`rounded-2xl border p-6 text-center text-xs ${cardCls} ${subText}`}>
          {ui.emptyFavs}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                className="group cursor-pointer flex flex-col gap-1.5 active:scale-[0.98] transition"
              >
                {/* Upright Hardcover Book Volume with Spine Groove & Gold Embossed Frame */}
                <div
                  className={`nq-keep-dark relative aspect-[3/4] rounded-l-[4px] rounded-r-[14px] overflow-hidden shadow-md group-hover:shadow-lg transition bg-gradient-to-br ${getCoverGradient(
                    book.coverTheme
                  )} border border-black/20`}
                >
                  {/* Hardcover Left Spine Groove */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 w-3.5 border-r border-white/15"
                    style={{
                      background:
                        'linear-gradient(90deg, rgba(0,0,0,0.42) 0%, rgba(255,255,255,0.12) 45%, rgba(0,0,0,0.28) 100%)',
                    }}
                  />

                  {/* Subtle Gilded Right Page Edge */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-y-1 right-0 w-[3px] bg-gradient-to-b from-[#f4e2b8] via-[#d9bd82] to-[#f4e2b8] opacity-70"
                  />

                  {/* Gold Embossed Inner Book Frame */}
                  <div className="absolute inset-2.5 left-5 border border-[#fde68a]/40 rounded-r-[8px] rounded-l-[2px] p-2.5 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-[9px] font-bold tracking-wider uppercase text-[#fde68a]/85 truncate">
                        {book.era}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavoriteBook(book.id);
                        }}
                        className={`p-0.5 rounded-md transition shrink-0 ${
                          isFav ? 'text-rose-300' : 'text-white/55 hover:text-white'
                        }`}
                        aria-label="Favorite book"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <div className="text-center space-y-1 my-auto py-1">
                      <span className="block text-[10px] text-[#fde68a]/70">❖</span>
                      <p className="font-arabic text-sm sm:text-base text-[#fde68a] leading-snug line-clamp-2">
                        {book.arabicTitle}
                      </p>
                      <h3 className="font-display text-[13px] sm:text-sm font-bold leading-tight text-white line-clamp-3">
                        {resolveBookText(book.title, language)}
                      </h3>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-[10px] text-white/75 text-center line-clamp-1 font-display italic">
                        {resolveBookText(book.author, language)}
                      </p>
                      <div className="w-full h-1 rounded-full bg-black/30 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#fde68a] transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compact Caption under Cover */}
                <div className="flex items-center justify-between px-1 text-[10.5px]">
                  <span className={`font-semibold ${subText}`}>{ui.chaptersUnit(book.chapters.length)}</span>
                  <span className={`font-mono font-bold ${isDay ? 'text-[#158509]' : 'text-amber-300'}`}>
                    {readInBook}/{book.chapters.length}
                  </span>
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
