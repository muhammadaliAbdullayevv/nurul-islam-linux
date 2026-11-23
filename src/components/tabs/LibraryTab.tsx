import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Check,
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
  lastPageByBook: Record<string, number>;
}

function loadLibraryProgress(): LibraryProgressState {
  try {
    const raw = localStorage.getItem(LIBRARY_PROGRESS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<LibraryProgressState>;
      const rawMap = parsed.lastPageByBook;
      const lastPageByBook: Record<string, number> = {};
      if (rawMap && typeof rawMap === 'object') {
        for (const [k, v] of Object.entries(rawMap)) {
          if (typeof v === 'number' && Number.isFinite(v) && v >= 0) {
            lastPageByBook[k] = Math.floor(v);
          }
        }
      }
      return {
        readChapterIds: Array.isArray(parsed.readChapterIds)
          ? parsed.readChapterIds.filter((x): x is string => typeof x === 'string')
          : [],
        lastBookId: typeof parsed.lastBookId === 'string' ? parsed.lastBookId : null,
        lastChapterIndex: typeof parsed.lastChapterIndex === 'number' ? parsed.lastChapterIndex : 0,
        lastPageByBook,
      };
    }
  } catch {
    // ignore storage errors
  }
  return { readChapterIds: [], lastBookId: null, lastChapterIndex: 0, lastPageByBook: {} };
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
    sepiaLabel: string;
    ivoryLabel: string;
    copiedToast: string;
    sharedToast: string;
    emptyFavs: string;
    publicDomainNote: string;
    swipeWhisper: string;
    pageShort: (n: number) => string;
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
    sepiaLabel: 'Qog‘oz',
    ivoryLabel: 'Oq',
    copiedToast: 'Nusxa olindi',
    sharedToast: 'Ulashish kartasi tayyor',
    emptyFavs: 'Sevimli kitoblaringiz hozircha yo‘q — yurakcha belgisini bosib saqlang.',
    publicDomainNote: 'Barcha kitoblar ochiq klassik islom merosi asosida 100% oflayn o‘qish uchun tayyorlangan',
    swipeWhisper: '← suring →',
    pageShort: (n) => `${n}-bet`,
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
    sepiaLabel: 'Қоғоз',
    ivoryLabel: 'Оқ',
    copiedToast: 'Нусха олинди',
    sharedToast: 'Улашиш картаси тайёр',
    emptyFavs: 'Севимли китобларингиз ҳозирча йўқ — юракча белгисини босиб сақланг.',
    publicDomainNote: 'Барча китоблар очиқ классик ислом мероси асосида 100% офлайн ўқиш учун тайёрланган',
    swipeWhisper: '← суринг →',
    pageShort: (n) => `${n}-бет`,
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
    sepiaLabel: 'Бумага',
    ivoryLabel: 'Белый',
    copiedToast: 'Скопировано',
    sharedToast: 'Карточка готова',
    emptyFavs: 'Избранных книг пока нет — нажмите на сердечко, чтобы добавить.',
    publicDomainNote: 'Все книги подготовлены на основе классического наследия и доступны полностью офлайн',
    swipeWhisper: '← листайте →',
    pageShort: (n) => `стр. ${n}`,
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
    sepiaLabel: 'Paper',
    ivoryLabel: 'White',
    copiedToast: 'Copied to clipboard',
    sharedToast: 'Quote card ready',
    emptyFavs: 'No favorite books yet — tap the heart icon on any book to save it.',
    publicDomainNote: 'Curated public-domain classical works crafted for calm 100% offline reading',
    swipeWhisper: '← swipe →',
    pageShort: (n) => `p. ${n}`,
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

type BookPageItem =
  | { kind: 'chapter-header'; romanLabel: string; title: string }
  | { kind: 'epigraph'; quote: string; label?: string; isArabic: boolean }
  | { kind: 'paragraph'; text: string; isFirstInChapter: boolean; isContinuation: boolean }
  | { kind: 'takeaway'; text: string };

interface BookPage {
  chapterIndex: number;
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  pageNumber: number;
  isLastPageOfChapter: boolean;
  items: BookPageItem[];
}

function getBodySizeClass(fontScale: number): string {
  if (fontScale === 0) return 'text-[14px] leading-[1.8]';
  if (fontScale === 2) return 'text-[17px] leading-[1.86]';
  return 'text-[15.5px] leading-[1.83]';
}

function createMeasurementNode(
  item: BookPageItem,
  isFirstOnPage: boolean,
  bodySizeCls: string,
  takeawayTitle: string
): HTMLElement {
  if (item.kind === 'chapter-header') {
    const wrap = document.createElement('div');
    wrap.className = 'text-center mb-3';
    const romanEl = document.createElement('div');
    romanEl.className = 'font-display text-[10.5px] font-bold tracking-[0.24em] uppercase';
    romanEl.textContent = `— ${item.romanLabel} —`;
    const h1 = document.createElement('h1');
    h1.className = 'font-display text-[19px] sm:text-[22px] font-bold leading-snug tracking-tight mt-1';
    h1.textContent = item.title;
    const orn = document.createElement('div');
    orn.className = 'flex items-center justify-center gap-2.5 pt-1';
    orn.innerHTML = '<span class="w-10 border-t"></span><span class="text-[11px] leading-none">❖</span><span class="w-10 border-t"></span>';
    wrap.append(romanEl, h1, orn);
    return wrap;
  }

  if (item.kind === 'epigraph') {
    const bq = document.createElement('blockquote');
    bq.className = `${isFirstOnPage ? 'mb-3' : 'my-2.5'} py-2.5 px-1.5 border-y text-center`;
    const p = document.createElement('p');
    p.dir = item.isArabic ? 'rtl' : 'ltr';
    p.className = item.isArabic
      ? 'font-arabic text-[20px] sm:text-[23px] leading-[1.92]'
      : 'font-display italic text-[14px] sm:text-[15.5px] leading-relaxed whitespace-pre-line';
    p.textContent = item.quote;
    bq.appendChild(p);
    if (item.label) {
      const ft = document.createElement('footer');
      ft.className = 'font-display text-[10.5px] italic mt-1';
      ft.textContent = `— ${item.label}`;
      bq.appendChild(ft);
    }
    return bq;
  }

  if (item.kind === 'paragraph') {
    const p = document.createElement('p');
    const spacing = isFirstOnPage ? '' : 'mt-3';
    const deco = item.isFirstInChapter
      ? 'first-letter:float-left first-letter:font-display first-letter:text-[42px] first-letter:font-bold first-letter:leading-[0.84] first-letter:mr-2 first-letter:mt-1'
      : item.isContinuation
      ? ''
      : 'indent-6';
    p.className = `flow-root font-display text-justify ${bodySizeCls} ${spacing} ${deco}`;
    p.textContent = item.text;
    return p;
  }

  // takeaway
  const aside = document.createElement('aside');
  aside.className = isFirstOnPage ? 'pt-1' : 'mt-4 pt-2.5';
  const rule = document.createElement('div');
  rule.className = 'w-16 border-t mb-2';
  const row = document.createElement('div');
  row.className = 'flex items-start justify-between gap-2';
  const p = document.createElement('p');
  p.className = 'font-display italic text-[12.5px] sm:text-[13px] leading-relaxed';
  const labelSpan = document.createElement('span');
  labelSpan.className = 'not-italic font-bold mr-1.5';
  labelSpan.textContent = `❖ ${takeawayTitle}:`;
  p.append(labelSpan, document.createTextNode(item.text));
  const iconSpacer = document.createElement('span');
  iconSpacer.className = 'w-6 h-6 shrink-0';
  row.append(p, iconSpacer);
  aside.append(rule, row);
  return aside;
}

/**
 * Pixel-accurate DOM pagination engine: flows every chapter across fixed-height
 * physical book leaves so zero vertical scrolling or line clipping ever occurs
 * on any viewport height, width, language, or font scale.
 */
function paginateClassicalBook(
  book: ClassicalBook,
  language: AppLanguage,
  fontScale: number,
  stageWidth: number,
  stageHeight: number,
  chapterRomanFn: (roman: string) => string,
  takeawayTitle: string
): BookPage[] {
  const bodySizeCls = getBodySizeClass(fontScale);

  // Fallback before initial ResizeObserver tick
  if (typeof document === 'undefined' || stageWidth < 120 || stageHeight < 140) {
    return book.chapters.map((ch, idx) => {
      const roman = ROMAN_NUMERALS[ch.number - 1] || String(ch.number);
      const chapterTitle = resolveBookText(ch.title, language);
      const paragraphs = resolveBookParagraphs(ch.paragraphs, language);
      const items: BookPageItem[] = [
        { kind: 'chapter-header', romanLabel: chapterRomanFn(roman), title: chapterTitle },
      ];
      if (ch.sourceQuote) {
        items.push({
          kind: 'epigraph',
          quote: ch.sourceQuote,
          label: ch.sourceLabel ? resolveBookText(ch.sourceLabel, language) : undefined,
          isArabic: /[\u0600-\u06FF]/.test(ch.sourceQuote),
        });
      }
      if (paragraphs[0]) {
        items.push({
          kind: 'paragraph',
          text: paragraphs[0],
          isFirstInChapter: true,
          isContinuation: false,
        });
      }
      return {
        chapterIndex: idx,
        chapterId: ch.id,
        chapterNumber: ch.number,
        chapterTitle,
        pageNumber: idx + 1,
        isLastPageOfChapter: true,
        items,
      };
    });
  }

  const measurer = document.createElement('div');
  measurer.style.position = 'fixed';
  measurer.style.left = '-99999px';
  measurer.style.top = '0';
  measurer.style.width = `${stageWidth}px`;
  measurer.style.visibility = 'hidden';
  measurer.style.pointerEvents = 'none';
  measurer.style.boxSizing = 'border-box';
  measurer.style.overflow = 'hidden';
  document.body.appendChild(measurer);

  // 10px bottom safety margin prevents font descender clipping across WebKit2GTK/Android WebView
  const maxH = Math.max(120, Math.floor(stageHeight) - 10);
  const allPages: BookPage[] = [];

  try {
    book.chapters.forEach((ch, chIdx) => {
      const roman = ROMAN_NUMERALS[ch.number - 1] || String(ch.number);
      const chapterTitle = resolveBookText(ch.title, language);
      const paragraphs = resolveBookParagraphs(ch.paragraphs, language);
      const takeaway = resolveBookText(ch.takeaway, language);

      const queue: BookPageItem[] = [
        { kind: 'chapter-header', romanLabel: chapterRomanFn(roman), title: chapterTitle },
      ];
      if (ch.sourceQuote) {
        queue.push({
          kind: 'epigraph',
          quote: ch.sourceQuote,
          label: ch.sourceLabel ? resolveBookText(ch.sourceLabel, language) : undefined,
          isArabic: /[\u0600-\u06FF]/.test(ch.sourceQuote),
        });
      }
      paragraphs.forEach((pText, pIdx) => {
        if (pText.trim()) {
          queue.push({
            kind: 'paragraph',
            text: pText.trim(),
            isFirstInChapter: pIdx === 0,
            isContinuation: false,
          });
        }
      });
      if (takeaway.trim()) {
        queue.push({ kind: 'takeaway', text: takeaway.trim() });
      }

      const chapterLeafItems: BookPageItem[][] = [];
      let curItems: BookPageItem[] = [];
      measurer.innerHTML = '';

      const flushPage = () => {
        if (curItems.length > 0) {
          chapterLeafItems.push(curItems);
          curItems = [];
          measurer.innerHTML = '';
        }
      };

      const pushItemToMeasurer = (item: BookPageItem) => {
        const node = createMeasurementNode(item, curItems.length === 0, bodySizeCls, takeawayTitle);
        measurer.appendChild(node);
        return node;
      };

      let qi = 0;
      let safetyGuards = 0;
      while (qi < queue.length && safetyGuards < 500) {
        safetyGuards += 1;
        const item = queue[qi];
        const testNode = pushItemToMeasurer(item);

        if (measurer.scrollHeight <= maxH) {
          curItems.push(item);
          qi += 1;
          continue;
        }

        // Did not fit as a whole
        measurer.removeChild(testNode);

        if (item.kind === 'paragraph') {
          const words = item.text.split(/\s+/).filter(Boolean);
          if (words.length <= 1) {
            if (curItems.length > 0) {
              flushPage();
              continue;
            }
            curItems.push(item);
            qi += 1;
            continue;
          }

          // Binary search maximum words that fit on the remaining vertical space
          const probe = createMeasurementNode(
            { ...item, text: '' },
            curItems.length === 0,
            bodySizeCls,
            takeawayTitle
          );
          measurer.appendChild(probe);

          let lo = 1;
          let hi = words.length - 1;
          let bestK = 0;
          while (lo <= hi) {
            const mid = (lo + hi) >> 1;
            probe.textContent = words.slice(0, mid).join(' ');
            if (measurer.scrollHeight <= maxH) {
              bestK = mid;
              lo = mid + 1;
            } else {
              hi = mid - 1;
            }
          }
          measurer.removeChild(probe);

          // Avoid a cramped 1-line stub at the bottom of a page when we can start fresh on next leaf
          if (bestK < 8 && curItems.length > 0 && words.length > 10) {
            flushPage();
            continue;
          }

          if (bestK === 0) {
            if (curItems.length > 0) {
              flushPage();
              continue;
            }
            // Extreme tiny screen safety: guarantee forward progress
            bestK = Math.min(words.length, 10);
          }

          // Avoid leaving a tiny 1–5 word orphan alone at the top of the next page
          if (words.length - bestK > 0 && words.length - bestK < 6 && bestK >= 14) {
            bestK = Math.max(8, words.length - 7);
          }

          const headText = words.slice(0, bestK).join(' ');
          const tailText = words.slice(bestK).join(' ');

          curItems.push({ ...item, text: headText });
          flushPage();

          if (tailText) {
            queue[qi] = {
              kind: 'paragraph',
              text: tailText,
              isFirstInChapter: false,
              isContinuation: true,
            };
          } else {
            qi += 1;
          }
        } else {
          // Non-splittable block (chapter-header, epigraph, takeaway)
          if (curItems.length > 0) {
            flushPage();
            continue;
          }
          // Empty page: accept item as-is so we never stall
          curItems.push(item);
          flushPage();
          qi += 1;
        }
      }

      flushPage();

      chapterLeafItems.forEach((leafItems, leafIdx) => {
        allPages.push({
          chapterIndex: chIdx,
          chapterId: ch.id,
          chapterNumber: ch.number,
          chapterTitle,
          pageNumber: allPages.length + 1,
          isLastPageOfChapter: leafIdx === chapterLeafItems.length - 1,
          items: leafItems,
        });
      });
    });
  } finally {
    document.body.removeChild(measurer);
  }

  return allPages;
}

export interface LibraryTabProps {
  onBookOpenChange?: (isOpen: boolean) => void;
}

export const LibraryTab: React.FC<LibraryTabProps> = ({ onBookOpenChange }) => {
  const { isDay } = useTheme();
  const { language } = useLanguage();
  const ui = LIBRARY_UI[language] || LIBRARY_UI.uz_lat;

  const bodyStageRef = useRef<HTMLDivElement | null>(null);
  const bookDeckRef = useRef<HTMLDivElement | null>(null);

  // Interactive drag-to-turn refs
  const pointerIdRef = useRef<number | null>(null);
  const startXRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const lastDxRef = useRef<number>(0);
  const animTimerRef = useRef<number | null>(null);

  const [progress, setProgress] = useState<LibraryProgressState>(loadLibraryProgress);
  const [favorites, setFavorites] = useState<string[]>(loadLibraryFavs);
  const [category, setCategory] = useState<BookCategory>('all');
  const [search, setSearch] = useState('');

  const [activeBookId, setActiveBookId] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pendingChapterTarget, setPendingChapterTarget] = useState<number | null>(null);
  const [isTocOpen, setIsTocOpen] = useState<boolean>(false);
  const [stageSize, setStageSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const [fontsReadyTick, setFontsReadyTick] = useState(0);

  // Live swipe animation state
  const [dragX, setDragX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [animatingTo, setAnimatingTo] = useState<null | 'next' | 'prev' | 'cancel'>(null);

  const [fontScale, setFontScale] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(LIBRARY_FONT_KEY);
      if (raw !== null) {
        const saved = Number(raw);
        if (Number.isInteger(saved) && saved >= 0 && saved <= 2) return saved;
      }
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

  // Tell AppShell to lock viewport height with zero vertical scroll while reading a book
  useEffect(() => {
    onBookOpenChange?.(Boolean(activeBookId));
    return () => onBookOpenChange?.(false);
  }, [activeBookId, onBookOpenChange]);

  // Re-measure cleanly once custom Lora / Amiri fonts finish loading
  useEffect(() => {
    if (!activeBookId || typeof document === 'undefined' || !document.fonts?.ready) return;
    let alive = true;
    void document.fonts.ready.then(() => {
      if (alive) setFontsReadyTick((n) => n + 1);
    });
    return () => {
      alive = false;
    };
  }, [activeBookId]);

  // Measure the exact fixed reading stage inside the book margin frame
  useEffect(() => {
    if (!activeBookId) return;
    const el = bodyStageRef.current;
    if (!el) return;

    const updateSize = () => {
      const w = Math.floor(el.clientWidth);
      const h = Math.floor(el.clientHeight);
      if (w > 0 && h > 0) {
        setStageSize((prev) => (prev.width === w && prev.height === h ? prev : { width: w, height: h }));
      }
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    window.addEventListener('resize', updateSize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, [activeBookId]);

  // Paginate the open book across exact screen-height physical book leaves
  const pages = useMemo<BookPage[]>(() => {
    if (!activeBook) return [];
    // fontsReadyTick intentionally triggers accurate re-measurement once webfonts settle
    void fontsReadyTick;
    return paginateClassicalBook(
      activeBook,
      language,
      fontScale,
      stageSize.width,
      stageSize.height,
      ui.chapterRoman,
      ui.takeawayTitle
    );
  }, [activeBook, fontScale, fontsReadyTick, language, stageSize.height, stageSize.width, ui.chapterRoman, ui.takeawayTitle]);

  // Keep pageIndex strictly in bounds when fontScale / viewport resizes
  useEffect(() => {
    if (!activeBook || pages.length === 0) return;
    if (pendingChapterTarget !== null) {
      const idx = pages.findIndex((p) => p.chapterIndex === pendingChapterTarget);
      if (idx >= 0) {
        setPageIndex(idx);
      }
      if (stageSize.width > 0 && stageSize.height > 0) {
        setPendingChapterTarget(null);
      }
      return;
    }
    if (pageIndex >= pages.length) {
      setPageIndex(Math.max(0, pages.length - 1));
    }
  }, [activeBook, pageIndex, pages, pendingChapterTarget, stageSize.height, stageSize.width]);

  // Cleanup any running turn animation timer on unmount or book close
  useEffect(() => {
    return () => {
      if (animTimerRef.current !== null) {
        window.clearTimeout(animTimerRef.current);
      }
    };
  }, []);

  const currentPage = pages[pageIndex] || pages[0] || null;

  // Automatically track reading position & mark chapters read effortlessly as the reader turns pages
  useEffect(() => {
    if (!activeBook || !currentPage) return;

    setProgress((prev) => {
      const sameBook = prev.lastBookId === activeBook.id;
      const sameChapter = prev.lastChapterIndex === currentPage.chapterIndex;
      const sameSavedPage = prev.lastPageByBook[activeBook.id] === pageIndex;
      if (sameBook && sameChapter && sameSavedPage) return prev;
      const next: LibraryProgressState = {
        ...prev,
        lastBookId: activeBook.id,
        lastChapterIndex: currentPage.chapterIndex,
        lastPageByBook: {
          ...prev.lastPageByBook,
          [activeBook.id]: pageIndex,
        },
      };
      saveLibraryProgress(next);
      return next;
    });

    if (!currentPage.isLastPageOfChapter) return;
    const chId = currentPage.chapterId;
    const timer = window.setTimeout(() => {
      setProgress((prev) => {
        if (prev.readChapterIds.includes(chId)) return prev;
        const next: LibraryProgressState = {
          ...prev,
          readChapterIds: [...prev.readChapterIds, chId],
        };
        saveLibraryProgress(next);
        return next;
      });
    }, 650);
    return () => window.clearTimeout(timer);
  }, [activeBook, currentPage, pageIndex]);

  // Animated page turn helper (used by swipe release AND keyboard Left/Right arrows)
  const triggerTurn = useCallback(
    (direction: 'next' | 'prev') => {
      if (animatingTo !== null || pages.length <= 1) return;
      if (direction === 'next' && pageIndex >= pages.length - 1) return;
      if (direction === 'prev' && pageIndex <= 0) return;

      const deckWidth = bookDeckRef.current?.clientWidth || 360;
      setIsDragging(false);
      setAnimatingTo(direction);
      setDragX(direction === 'next' ? -(deckWidth + 36) : deckWidth);

      if (animTimerRef.current !== null) {
        window.clearTimeout(animTimerRef.current);
      }
      animTimerRef.current = window.setTimeout(() => {
        setPageIndex((cur) =>
          direction === 'next'
            ? Math.min(pages.length - 1, cur + 1)
            : Math.max(0, cur - 1)
        );
        setAnimatingTo(null);
        setDragX(0);
        animTimerRef.current = null;
      }, 220);
    },
    [animatingTo, pageIndex, pages.length]
  );

  // Desktop keyboard navigation (Left / Right / PageUp / PageDown)
  useEffect(() => {
    if (!activeBookId || isTocOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        triggerTurn('next');
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        triggerTurn('prev');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeBookId, isTocOpen, triggerTurn]);

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

  const showToast = (msg: string) => {
    setToastMsg(msg);
    window.setTimeout(() => {
      setToastMsg((cur) => (cur === msg ? null : cur));
    }, 2200);
  };

  const openBook = (bookId: string, chIdx?: number) => {
    const book = getBookById(bookId);
    if (!book) return;
    setActiveBookId(bookId);
    setIsTocOpen(false);
    setDragX(0);
    setIsDragging(false);
    setAnimatingTo(null);
    if (typeof chIdx === 'number') {
      setPendingChapterTarget(Math.max(0, Math.min(book.chapters.length - 1, chIdx)));
      setPageIndex(0);
    } else {
      const savedPage = progress.lastPageByBook[bookId];
      if (typeof savedPage === 'number' && savedPage >= 0) {
        setPendingChapterTarget(null);
        setPageIndex(savedPage);
      } else {
        setPendingChapterTarget(0);
        setPageIndex(0);
      }
    }
  };

  const jumpToChapter = (chIdx: number) => {
    const targetPageIdx = pages.findIndex((p) => p.chapterIndex === chIdx);
    if (targetPageIdx >= 0) {
      setPageIndex(targetPageIdx);
    } else {
      setPendingChapterTarget(chIdx);
    }
    setDragX(0);
    setIsDragging(false);
    setAnimatingTo(null);
    setIsTocOpen(false);
  };

  const toggleFavoriteBook = (bookId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [bookId, ...prev];
      saveLibraryFavs(next);
      return next;
    });
  };

  const cycleFontScale = (delta: 1 | -1) => {
    const activeChIdx = currentPage?.chapterIndex ?? 0;
    setFontScale((prev) => {
      const next = Math.max(0, Math.min(2, prev + delta));
      if (next !== prev) {
        setPendingChapterTarget(activeChIdx);
        try {
          localStorage.setItem(LIBRARY_FONT_KEY, String(next));
        } catch {
          // ignore
        }
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

  /* ==================== FULL-SCREEN ZERO-SCROLL SWIPE BOOK READER ==================== */
  if (activeBook && currentPage) {
    const chapter = activeBook.chapters[currentPage.chapterIndex] || activeBook.chapters[0];
    const bookTitle = resolveBookText(activeBook.title, language);
    const bookAuthor = resolveBookText(activeBook.author, language);
    const chapterTitle = resolveBookText(chapter.title, language);
    const paragraphs = resolveBookParagraphs(chapter.paragraphs, language);
    const takeaway = resolveBookText(chapter.takeaway, language);
    const isFav = favorites.includes(activeBook.id);
    const isSepia = isDay && paperTone === 'sepia';
    const isArabicQuote = Boolean(chapter.sourceQuote && /[\u0600-\u06FF]/.test(chapter.sourceQuote));
    const bodySizeCls = getBodySizeClass(fontScale);

    const prevPage = pageIndex > 0 ? pages[pageIndex - 1] : null;
    const nextPage = pageIndex < pages.length - 1 ? pages[pageIndex + 1] : null;

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

    // Unified touch + mouse pointer drag handlers for natural book page turning
    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      if (animatingTo !== null) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('button')) return;

      pointerIdRef.current = e.pointerId;
      startXRef.current = e.clientX;
      startTimeRef.current = performance.now();
      lastDxRef.current = 0;
      setIsDragging(true);
      setDragX(0);
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // ignore if unsupported
      }
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging || pointerIdRef.current !== e.pointerId) return;
      const rawDx = e.clientX - startXRef.current;
      let dx = rawDx;
      if (rawDx > 0 && !prevPage) {
        dx = Math.min(32, rawDx * 0.16);
      } else if (rawDx < 0 && !nextPage) {
        dx = Math.max(-32, rawDx * 0.16);
      }
      lastDxRef.current = dx;
      setDragX(dx);
    };

    const finishPointerDrag = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging || pointerIdRef.current !== e.pointerId) return;
      pointerIdRef.current = null;
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        // ignore
      }

      const dx = lastDxRef.current;
      const elapsed = Math.max(1, performance.now() - startTimeRef.current);
      const velocity = dx / elapsed; // px per ms
      const deckWidth = bookDeckRef.current?.clientWidth || 360;
      const threshold = Math.min(64, deckWidth * 0.15);

      if ((dx < -threshold || (dx < -16 && velocity < -0.3)) && nextPage) {
        triggerTurn('next');
      } else if ((dx > threshold || (dx > 16 && velocity > 0.3)) && prevPage) {
        triggerTurn('prev');
      } else {
        setIsDragging(false);
        setAnimatingTo('cancel');
        setDragX(0);
        if (animTimerRef.current !== null) {
          window.clearTimeout(animTimerRef.current);
        }
        animTimerRef.current = window.setTimeout(() => {
          setAnimatingTo(null);
          animTimerRef.current = null;
        }, 190);
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

    const deckWidth = bookDeckRef.current?.clientWidth || 360;
    const turnTransition =
      animatingTo !== null ? 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none';

    const renderPageLeaf = (page: BookPage, measureRef?: React.RefObject<HTMLDivElement | null>) => (
      <article
        className={`relative w-full h-full flex flex-col rounded-l-[3px] rounded-r-[14px] border overflow-hidden shadow-[0_10px_28px_rgba(32,20,6,0.16)] ${sheetBg}`}
      >
        {/* Realistic Left Book-Binding Spine Gutter Shadow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-7 z-10"
          style={{
            background: isDay
              ? 'linear-gradient(90deg, rgba(66,40,12,0.18) 0%, rgba(66,40,12,0.06) 11px, rgba(66,40,12,0) 28px)'
              : 'linear-gradient(90deg, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.16) 12px, rgba(0,0,0,0) 28px)',
          }}
        />

        {/* Classical Printed Book Margin Frame — fills 100% height with zero scroll */}
        <div className="p-2.5 sm:p-4 pl-4 sm:pl-6 flex-1 min-h-0 flex flex-col">
          <div
            className={`border ${ruleColor} rounded-l-[2px] rounded-r-[10px] px-4 sm:px-7 py-3 sm:py-5 flex-1 min-h-0 flex flex-col overflow-hidden`}
          >
            {/* Fixed Running Book Header */}
            <header className={`shrink-0 pb-2 mb-2.5 border-b ${ruleColor} text-center space-y-0.5`}>
              <p
                className={`font-display text-[10px] sm:text-[11px] uppercase tracking-[0.18em] font-semibold truncate ${mutedInk}`}
              >
                {bookTitle}
              </p>
              <p className={`text-[9.5px] sm:text-[10px] italic font-display truncate ${mutedInk} opacity-85`}>
                {page.items[0]?.kind === 'chapter-header'
                  ? `${bookAuthor} · ${activeBook.era}`
                  : `${ui.chapterRoman(ROMAN_NUMERALS[page.chapterNumber - 1] || String(page.chapterNumber))} · ${page.chapterTitle}`}
              </p>
            </header>

            {/* Exact Screen-Fit Reading Stage (Zero Vertical Scroll!) */}
            <div ref={measureRef} className="flex-1 min-h-0 overflow-hidden">
              {page.items.map((item, idx) => {
                const isFirstOnPage = idx === 0;

                if (item.kind === 'chapter-header') {
                  return (
                    <div key={`hdr-${idx}`} className="text-center mb-3">
                      <div
                        className={`font-display text-[10.5px] font-bold tracking-[0.24em] uppercase ${ornamentColor}`}
                      >
                        — {item.romanLabel} —
                      </div>
                      <h1 className="font-display text-[19px] sm:text-[22px] font-bold leading-snug tracking-tight mt-1">
                        {item.title}
                      </h1>
                      <div className={`flex items-center justify-center gap-2.5 pt-1 ${ornamentColor} opacity-75`}>
                        <span className={`w-10 border-t ${ruleColor}`} />
                        <span className="text-[11px] leading-none">❖</span>
                        <span className={`w-10 border-t ${ruleColor}`} />
                      </div>
                    </div>
                  );
                }

                if (item.kind === 'epigraph') {
                  return (
                    <blockquote
                      key={`epi-${idx}`}
                      className={`${isFirstOnPage ? 'mb-3' : 'my-2.5'} py-2.5 px-1.5 border-y ${ruleColor} text-center`}
                    >
                      <p
                        dir={item.isArabic ? 'rtl' : 'ltr'}
                        className={
                          item.isArabic
                            ? `font-arabic text-[20px] sm:text-[23px] leading-[1.92] ${
                                isSepia ? 'text-[#3c2408]' : isDay ? 'text-[#0c4703]' : 'text-[#f2d388]'
                              }`
                            : `font-display italic text-[14px] sm:text-[15.5px] leading-relaxed whitespace-pre-line ${
                                isSepia ? 'text-[#4c300f]' : isDay ? 'text-[#0c4703]' : 'text-[#f2d388]'
                              }`
                        }
                      >
                        {item.quote}
                      </p>
                      {item.label && (
                        <footer className={`font-display text-[10.5px] italic mt-1 ${mutedInk}`}>
                          — {item.label}
                        </footer>
                      )}
                    </blockquote>
                  );
                }

                if (item.kind === 'paragraph') {
                  return (
                    <p
                      key={`p-${idx}`}
                      className={`flow-root font-display text-justify ${bodySizeCls} ${
                        isFirstOnPage ? '' : 'mt-3'
                      } ${
                        item.isFirstInChapter
                          ? `first-letter:float-left first-letter:font-display first-letter:text-[42px] first-letter:font-bold first-letter:leading-[0.84] first-letter:mr-2 first-letter:mt-1 ${dropCapColor}`
                          : item.isContinuation
                          ? ''
                          : 'indent-6'
                      }`}
                    >
                      {item.text}
                    </p>
                  );
                }

                // takeaway footnote
                return (
                  <aside key={`tk-${idx}`} className={isFirstOnPage ? 'pt-1' : 'mt-4 pt-2.5'}>
                    <div className={`w-16 border-t ${ruleColor} mb-2`} />
                    <div className="flex items-start justify-between gap-2">
                      <p className={`font-display italic text-[12.5px] sm:text-[13px] leading-relaxed ${mutedInk}`}>
                        <span className={`not-italic font-bold mr-1.5 ${ornamentColor}`}>
                          ❖ {ui.takeawayTitle}:
                        </span>
                        {item.text}
                      </p>
                      <button
                        type="button"
                        onClick={handleCopyChapter}
                        className={`p-1 rounded-lg shrink-0 transition opacity-70 hover:opacity-100 ${mutedInk}`}
                        aria-label="Copy passage"
                        title="Copy"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </aside>
                );
              })}
            </div>

            {/* Printed Book Folio Footer (No buttons — pure swipe pagination) */}
            <footer
              className={`shrink-0 pt-2 mt-2 border-t ${ruleColor} flex items-center justify-between gap-2 text-[10.5px] font-display ${mutedInk}`}
            >
              <span className="font-arabic text-xs opacity-80 truncate">{activeBook.arabicTitle}</span>
              {page.pageNumber === 1 && pages.length > 1 && (
                <span className="text-[10px] italic opacity-65 whitespace-nowrap">
                  {ui.swipeWhisper}
                </span>
              )}
              <span className="font-bold tracking-widest tabular-nums shrink-0">
                — {page.pageNumber} / {pages.length} —
              </span>
            </footer>
          </div>
        </div>
      </article>
    );

    const showingForwardSwipe = dragX < 0 || animatingTo === 'next';
    const showingBackwardSwipe = dragX > 0 || animatingTo === 'prev';
    const currentLeafTransform =
      showingForwardSwipe
        ? `translate3d(${dragX}px, 0, 0) rotate(${Math.max(-2.2, (dragX / Math.max(200, deckWidth)) * 2)}deg)`
        : !prevPage && dragX > 0
        ? `translate3d(${dragX}px, 0, 0)`
        : 'translate3d(0, 0, 0)';

    return (
      <div
        className={`flex-1 min-h-0 h-full flex flex-col gap-2 pt-2 pb-1 overflow-hidden animate-in fade-in ${
          isDay ? 'text-slate-900' : 'text-slate-100'
        }`}
      >
        {/* Whisper-Quiet Top Reading Toolbar */}
        <div className="shrink-0 flex items-center justify-between gap-1.5">
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

        {/* FULL-SCREEN INTERACTIVE SWIPE BOOK DECK (No Next/Prev/O'qildi buttons, zero scroll) */}
        <div
          ref={bookDeckRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishPointerDrag}
          onPointerCancel={finishPointerDrag}
          className="relative flex-1 min-h-0 pr-2 pb-2 overflow-hidden select-none touch-none cursor-grab active:cursor-grabbing"
        >
          {/* Floating Copy/Share Toast Overlay (never shifts book height!) */}
          {toastMsg && (
            <div
              className={`pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 z-40 px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-md animate-in fade-in ${
                isDay
                  ? 'bg-[#eef9ea] border-[#b7e2ad] text-[#0c4703]'
                  : 'bg-emerald-950 border-emerald-700 text-amber-300'
              }`}
            >
              {toastMsg}
            </div>
          )}

          {/* Stacked Physical Book Page Edges Underneath */}
          {pages.length - 1 - pageIndex >= 2 && (
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 right-2 bottom-2 translate-x-2 translate-y-2 rounded-l-[3px] rounded-r-[14px] border ${stackBg2}`}
            />
          )}
          {pages.length - 1 - pageIndex >= 1 && (
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 right-2 bottom-2 translate-x-1 translate-y-1 rounded-l-[3px] rounded-r-[14px] border ${stackBg1}`}
            />
          )}

          {/* Inner Positioned Leaf Stage */}
          <div className="relative w-full h-full">
            {/* Layer 1: Revealed Next Page underneath when swiping left */}
            {showingForwardSwipe && nextPage && (
              <div className="absolute inset-0 z-10 pointer-events-none">
                {renderPageLeaf(nextPage)}
              </div>
            )}

            {/* Layer 2: Active Current Page Leaf */}
            <div
              className="absolute inset-0 z-20 will-change-transform"
              style={{
                transform: currentLeafTransform,
                transition: turnTransition,
              }}
            >
              {renderPageLeaf(currentPage, bodyStageRef)}
            </div>

            {/* Layer 3: Incoming Previous Page sliding smoothly back over from left when swiping right */}
            {showingBackwardSwipe && prevPage && (
              <div
                className="absolute inset-0 z-30 will-change-transform pointer-events-none"
                style={{
                  transform: `translate3d(${dragX - deckWidth}px, 0, 0)`,
                  transition: turnTransition,
                }}
              >
                {renderPageLeaf(prevPage)}
              </div>
            )}
          </div>
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
                  const selected = idx === currentPage.chapterIndex;
                  const done = progress.readChapterIds.includes(ch.id);
                  const firstPageOfChapter = pages.find((p) => p.chapterIndex === idx)?.pageNumber;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => jumpToChapter(idx)}
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
                      <div className="flex items-center gap-1.5 shrink-0">
                        {firstPageOfChapter && (
                          <span className={`text-[10.5px] font-mono ${subText}`}>
                            {ui.pageShort(firstPageOfChapter)}
                          </span>
                        )}
                        <ChevronRight className={`w-4 h-4 ${subText}`} />
                      </div>
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
              onClick={() => openBook(lastBook.id)}
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
