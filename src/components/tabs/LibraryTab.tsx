import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronRight,
  Cloud,
  Copy,
  Heart,
  List,
  RefreshCw,
  Search,
  Share2,
  X,
} from 'lucide-react';
import { AppLanguage } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  BookCatalogItem,
  BookCategory,
  BookChapterData,
  BookContentFile,
  resolveLocalizedBookParagraphs,
  resolveLocalizedBookText,
} from '../../types/libraryBook';
import { LOCAL_LIBRARY_CATALOG, getCatalogBookById } from '../../data/libraryCatalog';
import {
  getCachedCloudBookIdsSync,
  listCachedCloudBookIdsAsync,
  loadBookContent,
  loadMergedCatalogSync,
  refreshRemoteLibraryCatalog,
} from '../../utils/libraryBookStore';
import { copyTextSafely } from '../../utils/clipboard';
import {
  generateNurulIslamShareCard,
  shareOrSavePngCard,
} from '../../utils/shareCardGenerator';

const LIBRARY_PROGRESS_KEY = 'nq_library_progress_v2';
const LIBRARY_FAVS_KEY = 'nq_library_favs_v1';
const LIBRARY_FONT_KEY = 'nq_library_font_v1';
const LIBRARY_PAPER_KEY = 'nq_library_paper_v2';

type ShelfFilter = BookCategory | 'offline';

interface BookSavedPosition {
  ch: number;
  pg: number;
}

interface LibraryProgressState {
  readChapterIds: string[];
  lastBookId: string | null;
  lastChapterIndex: number;
  lastPosByBook: Record<string, BookSavedPosition>;
}

function loadLibraryProgress(): LibraryProgressState {
  try {
    const raw = localStorage.getItem(LIBRARY_PROGRESS_KEY) || localStorage.getItem('nq_library_progress_v1');
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<LibraryProgressState>;
      const lastPosByBook: Record<string, BookSavedPosition> = {};
      if (parsed.lastPosByBook && typeof parsed.lastPosByBook === 'object') {
        for (const [k, v] of Object.entries(parsed.lastPosByBook)) {
          if (v && typeof v.ch === 'number' && typeof v.pg === 'number') {
            lastPosByBook[k] = {
              ch: Math.max(0, Math.floor(v.ch)),
              pg: Math.max(0, Math.floor(v.pg)),
            };
          }
        }
      }
      return {
        readChapterIds: Array.isArray(parsed.readChapterIds)
          ? parsed.readChapterIds.filter((x): x is string => typeof x === 'string')
          : [],
        lastBookId: typeof parsed.lastBookId === 'string' ? parsed.lastBookId : null,
        lastChapterIndex: typeof parsed.lastChapterIndex === 'number' ? parsed.lastChapterIndex : 0,
        lastPosByBook,
      };
    }
  } catch {
    // ignore storage errors
  }
  return { readChapterIds: [], lastBookId: null, lastChapterIndex: 0, lastPosByBook: {} };
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

const ROMAN_NUMERALS = [
  'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
  'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
];

function formatChapterNumeral(n: number): string {
  return ROMAN_NUMERALS[n - 1] || String(n);
}

const LIBRARY_UI: Record<
  AppLanguage,
  {
    heroTitle: string;
    heroSubtitle: (books: number, totalPages: number) => string;
    continueReading: string;
    resumeBtn: string;
    searchPlaceholder: string;
    catAll: string;
    catFiqh: string;
    catHadith: string;
    catSpirituality: string;
    catOffline: string;
    catFavs: string;
    pagesUnit: (n: number) => string;
    chaptersUnit: (n: number) => string;
    backToShelf: string;
    contentsTitle: string;
    chapterRoman: (num: string) => string;
    takeawayTitle: string;
    sepiaLabel: string;
    ivoryLabel: string;
    copiedToast: string;
    sharedToast: string;
    emptyList: string;
    publicDomainNote: string;
    swipeWhisper: string;
    pageShort: (n: number) => string;
    loadingBook: string;
    loadingCloudHint: string;
    offlineErrorTitle: string;
    offlineErrorHint: string;
    retryBtn: string;
    offlineBadge: string;
    allLangsLabel: string;
    translatorLabel: string;
  }
> = {
  uz_lat: {
    heroTitle: 'Klassik Islom Kutubxonasi',
    heroSubtitle: (b, p) => `${b} ta mo‘tabar kitob · ${p.toLocaleString()}+ sahifa`,
    continueReading: 'O‘qishni davom ettirish',
    resumeBtn: 'Davom etish',
    searchPlaceholder: 'Kitob, muallif yoki tarjimon qidirish...',
    catAll: 'Barchasi',
    catFiqh: 'Fiqh & Aqida',
    catHadith: 'Hadis & Siyrat',
    catSpirituality: 'Tarbiya & Zikr',
    catOffline: 'Oflayn',
    catFavs: 'Sevimli',
    pagesUnit: (n) => `~${n} bet`,
    chaptersUnit: (n) => `${n} bob`,
    backToShelf: 'Kutubxona',
    contentsTitle: 'Mundarija',
    chapterRoman: (num) => `${num} BOB`,
    takeawayTitle: 'Amaliy xulosa',
    sepiaLabel: 'Qog‘oz',
    ivoryLabel: 'Oq',
    copiedToast: 'Nusxa olindi',
    sharedToast: 'Ulashish kartasi tayyor',
    emptyList: 'Mos kitob topilmadi.',
    publicDomainNote: 'Barcha kitoblar faqat haqiqiy, ishonchli va inson tomonidan tarjima qilingan mo‘tabar nashrlardir (AI matnlarsiz)',
    swipeWhisper: '← suring →',
    pageShort: (n) => `${n}-bet`,
    loadingBook: 'Kitob sahifalari tayyorlanmoqda...',
    loadingCloudHint: 'Bir marta yuklangach doimiy oflayn saqlanadi',
    offlineErrorTitle: 'Kitobni yuklab bo‘lmadi',
    offlineErrorHint: 'Internetga ulanib bir marta ochsangiz, keyin 100% oflayn o‘qishingiz mumkin.',
    retryBtn: 'Qayta urinish',
    offlineBadge: 'Oflayn',
    allLangsLabel: 'Barcha tillar',
    translatorLabel: 'Tarjima / Nashr',
  },
  uz_cyr: {
    heroTitle: 'Классик Ислом Кутубхонаси',
    heroSubtitle: (b, p) => `${b} та мўътабар китоб · ${p.toLocaleString()}+ саҳифа`,
    continueReading: 'Ўқишни давом эттириш',
    resumeBtn: 'Давом этиш',
    searchPlaceholder: 'Китоб, муаллиф ёки таржимон қидириш...',
    catAll: 'Барчаси',
    catFiqh: 'Фиқҳ & Ақида',
    catHadith: 'Ҳадис & Сийрат',
    catSpirituality: 'Тарбия & Зикр',
    catOffline: 'Офлайн',
    catFavs: 'Севимли',
    pagesUnit: (n) => `~${n} бет`,
    chaptersUnit: (n) => `${n} боб`,
    backToShelf: 'Кутубхона',
    contentsTitle: 'Мундарижа',
    chapterRoman: (num) => `${num} БОБ`,
    takeawayTitle: 'Амалий хулоса',
    sepiaLabel: 'Қоғоз',
    ivoryLabel: 'Оқ',
    copiedToast: 'Нусха олинди',
    sharedToast: 'Улашиш картаси тайёр',
    emptyList: 'Мос китоб топилмади.',
    publicDomainNote: 'Барча китоблар фақат ҳақиқий, ишончли ва инсон томонидан таржима қилинган мўътабар нашрлардир',
    swipeWhisper: '← суринг →',
    pageShort: (n) => `${n}-бет`,
    loadingBook: 'Китоб саҳифалари тайёрланмоқда...',
    loadingCloudHint: 'Бир марта юклангач доимий офлайн сақланади',
    offlineErrorTitle: 'Китобни юклаб бўлмади',
    offlineErrorHint: 'Интернетга уланиб бир марта очсангиз, кейин 100% офлайн ўқишингиз мумкин.',
    retryBtn: 'Қайта уриниш',
    offlineBadge: 'Офлайн',
    allLangsLabel: 'Барча тиллар',
    translatorLabel: 'Таржима / Нашр',
  },
  ru: {
    heroTitle: 'Классическая Исламская Библиотека',
    heroSubtitle: (b, p) => `${b} подлинных книг · ${p.toLocaleString()}+ страниц`,
    continueReading: 'Продолжить чтение',
    resumeBtn: 'Читать',
    searchPlaceholder: 'Поиск книги, автора или переводчика...',
    catAll: 'Все',
    catFiqh: 'Фикх и Акыда',
    catHadith: 'Хадисы и Сира',
    catSpirituality: 'Зикр и Нравы',
    catOffline: 'Офлайн',
    catFavs: 'Избранное',
    pagesUnit: (n) => `~${n} стр.`,
    chaptersUnit: (n) => `${n} гл.`,
    backToShelf: 'Библиотека',
    contentsTitle: 'Оглавление',
    chapterRoman: (num) => `ГЛАВА ${num}`,
    takeawayTitle: 'Практический вывод',
    sepiaLabel: 'Бумага',
    ivoryLabel: 'Белый',
    copiedToast: 'Скопировано',
    sharedToast: 'Карточка готова',
    emptyList: 'Подходящие книги не найдены.',
    publicDomainNote: 'Только подлинные опубликованные человеческие переводы и оригиналы (без текстов ИИ)',
    swipeWhisper: '← листайте →',
    pageShort: (n) => `стр. ${n}`,
    loadingBook: 'Загрузка страниц книги...',
    loadingCloudHint: 'После загрузки книга сохраняется офлайн навсегда',
    offlineErrorTitle: 'Не удалось загрузить книгу',
    offlineErrorHint: 'Подключитесь к интернету один раз, чтобы сохранить книгу для офлайн-чтения.',
    retryBtn: 'Повторить',
    offlineBadge: 'Офлайн',
    allLangsLabel: 'Все языки',
    translatorLabel: 'Перевод / Издание',
  },
  en: {
    heroTitle: 'Classical Islamic Library',
    heroSubtitle: (b, p) => `${b} authentic books · ${p.toLocaleString()}+ pages`,
    continueReading: 'Continue Reading',
    resumeBtn: 'Resume',
    searchPlaceholder: 'Search book, scholar, or translator...',
    catAll: 'All',
    catFiqh: 'Fiqh & Creed',
    catHadith: 'Hadith & Seerah',
    catSpirituality: 'Remembrance & Ethics',
    catOffline: 'Offline',
    catFavs: 'Favorites',
    pagesUnit: (n) => `~${n} pp.`,
    chaptersUnit: (n) => `${n} ch.`,
    backToShelf: 'Library',
    contentsTitle: 'Contents',
    chapterRoman: (num) => `CHAPTER ${num}`,
    takeawayTitle: 'Practical Reflection',
    sepiaLabel: 'Paper',
    ivoryLabel: 'White',
    copiedToast: 'Copied to clipboard',
    sharedToast: 'Quote card ready',
    emptyList: 'No matching books found.',
    publicDomainNote: 'Strictly verified, verbatim human-translated editions and classical originals (zero AI-written books)',
    swipeWhisper: '← swipe →',
    pageShort: (n) => `p. ${n}`,
    loadingBook: 'Opening book pages...',
    loadingCloudHint: 'Saves permanently offline after first download',
    offlineErrorTitle: 'Could not download book',
    offlineErrorHint: 'Connect to the internet once to save this volume permanently for offline reading.',
    retryBtn: 'Try again',
    offlineBadge: 'Offline',
    allLangsLabel: 'All languages',
    translatorLabel: 'Translation / Edition',
  },
};

function formatBookLangBadge(langs: BookCatalogItem['contentLangs']): string {
  const order: Array<'uz' | 'ru' | 'en' | 'ar'> = ['uz', 'ru', 'en', 'ar'];
  const labels: Record<'uz' | 'ru' | 'en' | 'ar', string> = {
    uz: 'O‘Z',
    ru: 'RU',
    en: 'EN',
    ar: 'AR',
  };
  return order.filter((l) => langs.includes(l)).map((l) => labels[l]).join(' · ');
}

function getCoverGradient(theme: BookCatalogItem['coverTheme']): string {
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

interface ChapterLeaf {
  chapterIndex: number;
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  leafIndexInChapter: number;
  isLastLeafOfChapter: boolean;
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
    orn.innerHTML =
      '<span class="w-10 border-t"></span><span class="text-[11px] leading-none">❖</span><span class="w-10 border-t"></span>';
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
    const allowDropCap =
      item.isFirstInChapter && /^[A-Za-zА-Яа-яЁёЎўҚқҒғҲҳ]/.test(item.text);
    const deco = allowDropCap
      ? 'first-letter:float-left first-letter:font-display first-letter:text-[42px] first-letter:font-bold first-letter:leading-[0.84] first-letter:mr-2 first-letter:mt-1'
      : item.isContinuation
      ? ''
      : 'indent-6';
    p.className = `flow-root font-display text-justify ${bodySizeCls} ${spacing} ${deco}`;
    p.textContent = item.text;
    return p;
  }

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
 * Paginates ONE chapter into exact screen-height physical book leaves in <3ms.
 * Because we paginate per-chapter on demand, even a 300-page book opens instantaneously!
 */
function paginateSingleChapter(
  ch: BookChapterData,
  chIdx: number,
  language: AppLanguage,
  preferredContentLang: 'uz' | 'ru' | 'en' | undefined,
  fontScale: number,
  stageWidth: number,
  stageHeight: number,
  chapterRomanFn: (num: string) => string,
  takeawayTitle: string
): ChapterLeaf[] {
  const bodySizeCls = getBodySizeClass(fontScale);
  const roman = formatChapterNumeral(ch.number);
  const chapterTitle = resolveLocalizedBookText(ch.title, language);
  const paragraphs = resolveLocalizedBookParagraphs(ch.paragraphs, language, preferredContentLang);
  const takeaway = resolveLocalizedBookText(ch.takeaway, language, preferredContentLang);

  // Fallback leaf before ResizeObserver settles
  if (typeof document === 'undefined' || stageWidth < 120 || stageHeight < 140) {
    const items: BookPageItem[] = [
      { kind: 'chapter-header', romanLabel: chapterRomanFn(roman), title: chapterTitle },
    ];
    if (ch.sourceQuote) {
      items.push({
        kind: 'epigraph',
        quote: ch.sourceQuote,
        label: ch.sourceLabel ? resolveLocalizedBookText(ch.sourceLabel, language) : undefined,
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
    return [
      {
        chapterIndex: chIdx,
        chapterId: ch.id,
        chapterNumber: ch.number,
        chapterTitle,
        leafIndexInChapter: 0,
        isLastLeafOfChapter: true,
        items,
      },
    ];
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

  const maxH = Math.max(120, Math.floor(stageHeight) - 18);
  const leafItemLists: BookPageItem[][] = [];

  try {
    const queue: BookPageItem[] = [
      { kind: 'chapter-header', romanLabel: chapterRomanFn(roman), title: chapterTitle },
    ];
    if (ch.sourceQuote) {
      // Keep long Arabic epigraphs cleanly trimmed at a word boundary so header + quote + prose sit balanced on Leaf 1
      let safeQuote = ch.sourceQuote.trim();
      if (safeQuote.length > 220) {
        const cut = safeQuote.slice(0, 220);
        const lastSpace = cut.lastIndexOf(' ');
        safeQuote = `${(lastSpace > 140 ? cut.slice(0, lastSpace) : cut).trim()}…`;
      }
      queue.push({
        kind: 'epigraph',
        quote: safeQuote,
        label: ch.sourceLabel ? resolveLocalizedBookText(ch.sourceLabel, language) : undefined,
        isArabic: /[\u0600-\u06FF]/.test(safeQuote),
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

    let curItems: BookPageItem[] = [];
    measurer.innerHTML = '';

    const flushLeaf = () => {
      if (curItems.length > 0) {
        leafItemLists.push(curItems);
        curItems = [];
        measurer.innerHTML = '';
      }
    };

    const appendToMeasurer = (item: BookPageItem) => {
      const node = createMeasurementNode(item, curItems.length === 0, bodySizeCls, takeawayTitle);
      measurer.appendChild(node);
      return node;
    };

    let qi = 0;
    let safety = 0;
    while (qi < queue.length && safety < 1500) {
      safety += 1;
      const item = queue[qi];
      const testNode = appendToMeasurer(item);

      if (measurer.scrollHeight <= maxH) {
        curItems.push(item);
        qi += 1;
        continue;
      }

      measurer.removeChild(testNode);

      if (item.kind === 'paragraph') {
        const words = item.text.split(/\s+/).filter(Boolean);
        if (words.length <= 1) {
          if (curItems.length > 0) {
            flushLeaf();
            continue;
          }
          curItems.push(item);
          qi += 1;
          continue;
        }

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

        if (bestK < 8 && curItems.length > 0 && words.length > 10) {
          flushLeaf();
          continue;
        }

        if (bestK === 0) {
          if (curItems.length > 0) {
            flushLeaf();
            continue;
          }
          bestK = Math.min(words.length, 10);
        }

        if (words.length - bestK > 0 && words.length - bestK < 6 && bestK >= 14) {
          bestK = Math.max(8, words.length - 7);
        }

        const headText = words.slice(0, bestK).join(' ');
        const tailText = words.slice(bestK).join(' ');

        curItems.push({ ...item, text: headText });
        flushLeaf();

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
        if (curItems.length > 0) {
          flushLeaf();
          continue;
        }
        curItems.push(item);
        flushLeaf();
        qi += 1;
      }
    }

    flushLeaf();
  } finally {
    document.body.removeChild(measurer);
  }

  return leafItemLists.map((items, idx) => ({
    chapterIndex: chIdx,
    chapterId: ch.id,
    chapterNumber: ch.number,
    chapterTitle,
    leafIndexInChapter: idx,
    isLastLeafOfChapter: idx === leafItemLists.length - 1,
    items,
  }));
}

function estimateChapterPageCount(
  ch: BookChapterData,
  language: AppLanguage,
  preferredContentLang: 'uz' | 'ru' | 'en' | undefined,
  stageWidth: number,
  stageHeight: number,
  fontScale: number
): number {
  const paras = resolveLocalizedBookParagraphs(ch.paragraphs, language, preferredContentLang);
  const chars =
    paras.reduce((acc, p) => acc + p.length + 28, 0) +
    (ch.sourceQuote ? Math.min(340, ch.sourceQuote.length) * 1.4 : 0) +
    180;
  const area = stageWidth > 120 && stageHeight > 140 ? stageWidth * stageHeight : 320 * 540;
  const pxPerChar = fontScale === 2 ? 270 : fontScale === 0 ? 195 : 228;
  const charsPerPage = Math.max(380, Math.round(area / pxPerChar));
  return Math.max(1, Math.ceil(chars / charsPerPage));
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
  const chapterLeavesCacheRef = useRef<Map<string, ChapterLeaf[]>>(new Map());

  // Interactive drag-to-turn refs
  const pointerIdRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const lastDxRef = useRef<number>(0);
  const animTimerRef = useRef<number | null>(null);

  const [catalog, setCatalog] = useState<BookCatalogItem[]>(() =>
    loadMergedCatalogSync(LOCAL_LIBRARY_CATALOG)
  );
  const [cachedCloudIds, setCachedCloudIds] = useState<string[]>(getCachedCloudBookIdsSync);
  const [progress, setProgress] = useState<LibraryProgressState>(loadLibraryProgress);
  const [favorites, setFavorites] = useState<string[]>(loadLibraryFavs);
  const [shelfFilter, setShelfFilter] = useState<ShelfFilter>('all');
  const [langFilter, setLangFilter] = useState<'all' | 'uz' | 'ru' | 'en'>('all');
  const [search, setSearch] = useState('');

  // Open book state
  const [activeBookId, setActiveBookId] = useState<string | null>(null);
  const [activeBookContent, setActiveBookContent] = useState<BookContentFile | null>(null);
  const [loadingBook, setLoadingBook] = useState(false);
  const [loadBookError, setLoadBookError] = useState<string | null>(null);
  const [chapterIndex, setChapterIndex] = useState<number>(0);
  const [pageInChapter, setPageInChapter] = useState<number>(0);
  const [contentLangOverride, setContentLangOverride] = useState<'auto' | 'uz' | 'ru' | 'en'>('auto');
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
  const [paperTone, setPaperTone] = useState<PaperTone>(() => {
    try {
      return localStorage.getItem(LIBRARY_PAPER_KEY) === 'ivory' ? 'ivory' : 'sepia';
    } catch {
      return 'sepia';
    }
  });
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [sharingCard, setSharingCard] = useState(false);

  // Hydrate cached cloud book IDs from IndexedDB and refresh VPS remote catalog in background
  useEffect(() => {
    let alive = true;
    void listCachedCloudBookIdsAsync().then((ids) => {
      if (alive) setCachedCloudIds(ids);
    });
    void refreshRemoteLibraryCatalog(LOCAL_LIBRARY_CATALOG).then((merged) => {
      if (alive && merged.length > 0) setCatalog(merged);
    });
    return () => {
      alive = false;
    };
  }, []);

  const activeBookMeta = useMemo(
    () => getCatalogBookById(catalog, activeBookId),
    [activeBookId, catalog]
  );

  // Tell AppShell to lock viewport height with zero vertical scroll while reading a book
  useEffect(() => {
    onBookOpenChange?.(Boolean(activeBookId));
    return () => onBookOpenChange?.(false);
  }, [activeBookId, onBookOpenChange]);

  // Re-measure once custom Lora/Amiri fonts settle
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

  // Measure the exact fixed reading stage inside the book frame
  useEffect(() => {
    if (!activeBookId || !activeBookContent) return;
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
  }, [activeBookContent, activeBookId]);

  // Clear pagination cache when layout metrics or language change
  useEffect(() => {
    chapterLeavesCacheRef.current.clear();
  }, [activeBookId, contentLangOverride, fontScale, fontsReadyTick, language, stageSize.height, stageSize.width]);

  // Cleanup any running turn animation timer on unmount
  useEffect(() => {
    return () => {
      if (animTimerRef.current !== null) {
        window.clearTimeout(animTimerRef.current);
      }
    };
  }, []);

  const preferredContentLang: 'uz' | 'ru' | 'en' | undefined =
    contentLangOverride === 'auto' ? undefined : contentLangOverride;

  const getChapterLeaves = useCallback(
    (chIdx: number): ChapterLeaf[] => {
      if (!activeBookContent) return [];
      const ch = activeBookContent.chapters[chIdx];
      if (!ch) return [];
      const key = `${activeBookContent.id}:${chIdx}:${language}:${contentLangOverride}:${fontScale}:${stageSize.width}x${stageSize.height}:${fontsReadyTick}`;
      const hit = chapterLeavesCacheRef.current.get(key);
      if (hit) return hit;

      const computed = paginateSingleChapter(
        ch,
        chIdx,
        language,
        preferredContentLang,
        fontScale,
        stageSize.width,
        stageSize.height,
        ui.chapterRoman,
        ui.takeawayTitle
      );
      chapterLeavesCacheRef.current.set(key, computed);
      return computed;
    },
    [
      activeBookContent,
      contentLangOverride,
      fontScale,
      fontsReadyTick,
      language,
      preferredContentLang,
      stageSize.height,
      stageSize.width,
      ui.chapterRoman,
      ui.takeawayTitle,
    ]
  );

  // Instant leaves for current chapter + adjacent cross-chapter preview leaves
  const currentChapterLeaves = useMemo(
    () => (activeBookContent ? getChapterLeaves(chapterIndex) : []),
    [activeBookContent, chapterIndex, getChapterLeaves]
  );

  const safePageInChapter = Math.max(
    0,
    Math.min(Math.max(0, currentChapterLeaves.length - 1), pageInChapter)
  );
  const currentLeaf = currentChapterLeaves[safePageInChapter] || null;

  const nextLeaf = useMemo<ChapterLeaf | null>(() => {
    if (!activeBookContent || !currentLeaf) return null;
    if (safePageInChapter < currentChapterLeaves.length - 1) {
      return currentChapterLeaves[safePageInChapter + 1];
    }
    if (chapterIndex < activeBookContent.chapters.length - 1) {
      const nextChLeaves = getChapterLeaves(chapterIndex + 1);
      return nextChLeaves[0] || null;
    }
    return null;
  }, [activeBookContent, chapterIndex, currentChapterLeaves, currentLeaf, getChapterLeaves, safePageInChapter]);

  const prevLeaf = useMemo<ChapterLeaf | null>(() => {
    if (!activeBookContent || !currentLeaf) return null;
    if (safePageInChapter > 0) {
      return currentChapterLeaves[safePageInChapter - 1];
    }
    if (chapterIndex > 0) {
      const prevChLeaves = getChapterLeaves(chapterIndex - 1);
      return prevChLeaves[prevChLeaves.length - 1] || null;
    }
    return null;
  }, [activeBookContent, chapterIndex, currentChapterLeaves, currentLeaf, getChapterLeaves, safePageInChapter]);

  // Compute accurate global page numbers across the entire book (using exact cache where measured + calibrated estimate elsewhere)
  const { chapterStartPages, totalBookPages } = useMemo(() => {
    if (!activeBookContent) return { chapterStartPages: [] as number[], totalBookPages: 1 };
    const starts: number[] = [];
    let running = 1;
    activeBookContent.chapters.forEach((ch, idx) => {
      starts.push(running);
      const key = `${activeBookContent.id}:${idx}:${language}:${contentLangOverride}:${fontScale}:${stageSize.width}x${stageSize.height}:${fontsReadyTick}`;
      const cached = chapterLeavesCacheRef.current.get(key);
      const count = cached
        ? cached.length
        : estimateChapterPageCount(
            ch,
            language,
            preferredContentLang,
            stageSize.width,
            stageSize.height,
            fontScale
          );
      running += count;
    });
    return { chapterStartPages: starts, totalBookPages: Math.max(1, running - 1) };
  }, [
    activeBookContent,
    chapterIndex,
    contentLangOverride,
    fontScale,
    fontsReadyTick,
    language,
    preferredContentLang,
    stageSize.height,
    stageSize.width,
  ]);

  const getGlobalPageNumber = (leaf: ChapterLeaf): number => {
    const start = chapterStartPages[leaf.chapterIndex] || 1;
    return start + leaf.leafIndexInChapter;
  };

  // Clamp pageInChapter if font scale shrinks page count
  useEffect(() => {
    if (currentChapterLeaves.length > 0 && pageInChapter >= currentChapterLeaves.length) {
      setPageInChapter(currentChapterLeaves.length - 1);
    }
  }, [currentChapterLeaves.length, pageInChapter]);

  // Automatically save exact reading position & auto-mark completed chapters read
  useEffect(() => {
    if (!activeBookMeta || !currentLeaf) return;

    setProgress((prev) => {
      const prevPos = prev.lastPosByBook[activeBookMeta.id];
      if (
        prev.lastBookId === activeBookMeta.id &&
        prev.lastChapterIndex === currentLeaf.chapterIndex &&
        prevPos?.ch === currentLeaf.chapterIndex &&
        prevPos?.pg === safePageInChapter
      ) {
        return prev;
      }
      const next: LibraryProgressState = {
        ...prev,
        lastBookId: activeBookMeta.id,
        lastChapterIndex: currentLeaf.chapterIndex,
        lastPosByBook: {
          ...prev.lastPosByBook,
          [activeBookMeta.id]: { ch: currentLeaf.chapterIndex, pg: safePageInChapter },
        },
      };
      saveLibraryProgress(next);
      return next;
    });

    if (!currentLeaf.isLastLeafOfChapter) return;
    const chId = currentLeaf.chapterId;
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
  }, [activeBookMeta, currentLeaf, safePageInChapter]);

  // Animated cross-chapter swipe turn
  const triggerTurn = useCallback(
    (direction: 'next' | 'prev') => {
      if (animatingTo !== null || !activeBookContent) return;
      if (direction === 'next' && !nextLeaf) return;
      if (direction === 'prev' && !prevLeaf) return;

      const deckWidth = bookDeckRef.current?.clientWidth || 360;
      setIsDragging(false);
      setAnimatingTo(direction);
      setDragX(direction === 'next' ? -(deckWidth + 36) : deckWidth);

      if (animTimerRef.current !== null) {
        window.clearTimeout(animTimerRef.current);
      }
      animTimerRef.current = window.setTimeout(() => {
        if (direction === 'next' && nextLeaf) {
          setChapterIndex(nextLeaf.chapterIndex);
          setPageInChapter(nextLeaf.leafIndexInChapter);
        } else if (direction === 'prev' && prevLeaf) {
          setChapterIndex(prevLeaf.chapterIndex);
          setPageInChapter(prevLeaf.leafIndexInChapter);
        }
        setAnimatingTo(null);
        setDragX(0);
        animTimerRef.current = null;
      }, 220);
    },
    [activeBookContent, animatingTo, nextLeaf, prevLeaf]
  );

  // Desktop keyboard page turn (Left / Right / PageUp / PageDown)
  useEffect(() => {
    if (!activeBookId || !activeBookContent || isTocOpen) return;
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
  }, [activeBookContent, activeBookId, isTocOpen, triggerTurn]);

  // Android hardware / gesture back button cleanly exits TOC -> Book -> Bookshelf
  useEffect(() => {
    if (!activeBookId) return;
    const onBack = (e: Event) => {
      e.preventDefault();
      if (isTocOpen) {
        setIsTocOpen(false);
        return;
      }
      setActiveBookId(null);
      setActiveBookContent(null);
      setLoadBookError(null);
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

  const fetchAndOpenBook = useCallback(async (meta: BookCatalogItem, resumePos?: BookSavedPosition) => {
    setActiveBookId(meta.id);
    setActiveBookContent(null);
    setLoadBookError(null);
    setLoadingBook(true);
    setIsTocOpen(false);
    setContentLangOverride('auto');
    setDragX(0);
    setIsDragging(false);
    setAnimatingTo(null);

    try {
      const content = await loadBookContent(meta);
      setActiveBookContent(content);
      const targetCh = resumePos
        ? Math.max(0, Math.min(content.chapters.length - 1, resumePos.ch))
        : 0;
      const targetPg = resumePos ? Math.max(0, resumePos.pg) : 0;
      setChapterIndex(targetCh);
      setPageInChapter(targetPg);
      if (meta.storage === 'cloud') {
        setCachedCloudIds((prev) => (prev.includes(meta.id) ? prev : [...prev, meta.id]));
      }
    } catch (err) {
      setLoadBookError(err instanceof Error ? err.message : 'Download failed');
    } finally {
      setLoadingBook(false);
    }
  }, []);

  const openBook = (bookId: string) => {
    const meta = getCatalogBookById(catalog, bookId);
    if (!meta) return;
    const savedPos = progress.lastPosByBook[bookId] || { ch: 0, pg: 0 };
    void fetchAndOpenBook(meta, savedPos);
  };

  const closeBook = () => {
    setActiveBookId(null);
    setActiveBookContent(null);
    setLoadBookError(null);
    setIsTocOpen(false);
  };

  const jumpToChapter = (chIdx: number) => {
    setChapterIndex(chIdx);
    setPageInChapter(0);
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
    setFontScale((prev) => {
      const next = Math.max(0, Math.min(2, prev + delta));
      if (next !== prev) {
        setPageInChapter(0);
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

  const isBookOfflineReady = useCallback(
    (b: BookCatalogItem) => b.storage === 'bundled' || cachedCloudIds.includes(b.id),
    [cachedCloudIds]
  );

  const filteredBooks = useMemo(() => {
    const q = search.trim().toLowerCase();
    const userPrefLang: 'uz' | 'ru' | 'en' =
      language === 'ru' ? 'ru' : language === 'en' ? 'en' : 'uz';

    const matched = catalog.filter((book) => {
      if (langFilter !== 'all' && !book.contentLangs.includes(langFilter)) return false;
      if (shelfFilter === 'favorites' && !favorites.includes(book.id)) return false;
      if (shelfFilter === 'offline' && !isBookOfflineReady(book)) return false;
      if (
        shelfFilter !== 'all' &&
        shelfFilter !== 'favorites' &&
        shelfFilter !== 'offline' &&
        book.category !== shelfFilter
      ) {
        return false;
      }
      if (!q) return true;
      const tStr = resolveLocalizedBookText(book.title, language).toLowerCase();
      const aStr = resolveLocalizedBookText(book.author, language).toLowerCase();
      const trStr = resolveLocalizedBookText(book.translator, language).toLowerCase();
      const sStr = resolveLocalizedBookText(book.summary, language).toLowerCase();
      return (
        tStr.includes(q) ||
        aStr.includes(q) ||
        trStr.includes(q) ||
        sStr.includes(q) ||
        (book.title.uz_lat || '').toLowerCase().includes(q) ||
        (book.title.en || '').toLowerCase().includes(q) ||
        (book.title.ru || '').toLowerCase().includes(q)
      );
    });

    // Always surface books natively available in the user's selected app language FIRST!
    return matched.sort((a, b) => {
      const aMatches = a.contentLangs.includes(userPrefLang) ? 1 : 0;
      const bMatches = b.contentLangs.includes(userPrefLang) ? 1 : 0;
      if (aMatches !== bMatches) return bMatches - aMatches;
      return 0;
    });
  }, [catalog, favorites, isBookOfflineReady, langFilter, language, search, shelfFilter]);

  const cardCls = isDay
    ? 'bg-white border-[#dde3ea] shadow-xs'
    : 'bg-slate-900/90 border-emerald-900/60';
  const subText = isDay ? 'text-slate-500' : 'text-slate-400';

  const totalPagesLibrary = useMemo(
    () => catalog.reduce((sum, b) => sum + b.estimatedPages, 0),
    [catalog]
  );
  const offlineReadyCount = useMemo(
    () => catalog.filter((b) => isBookOfflineReady(b)).length,
    [catalog, isBookOfflineReady]
  );
  const langCounts = useMemo(
    () => ({
      uz: catalog.filter((b) => b.contentLangs.includes('uz')).length,
      ru: catalog.filter((b) => b.contentLangs.includes('ru')).length,
      en: catalog.filter((b) => b.contentLangs.includes('en')).length,
    }),
    [catalog]
  );

  /* ==================== FULL-SCREEN ZERO-SCROLL SWIPE BOOK READER ==================== */
  if (activeBookMeta) {
    const bookTitle = resolveLocalizedBookText(activeBookMeta.title, language);
    const bookAuthor = resolveLocalizedBookText(activeBookMeta.author, language);
    const bookTranslator = resolveLocalizedBookText(activeBookMeta.translator, language);
    const isFav = favorites.includes(activeBookMeta.id);
    const isSepia = isDay && paperTone === 'sepia';
    const bodySizeCls = getBodySizeClass(fontScale);

    // Support 1-tap switching whenever a book offers 2+ translation languages (e.g. O'Z/EN on Arba'in, RU/EN on Bukhari)
    const switchableLangs = activeBookMeta.contentLangs.filter(
      (l): l is 'uz' | 'ru' | 'en' => l === 'uz' || l === 'ru' || l === 'en'
    );
    const showLangSwitch = switchableLangs.length >= 2;
    const defaultActiveLang: 'uz' | 'ru' | 'en' =
      language === 'ru' && switchableLangs.includes('ru')
        ? 'ru'
        : language === 'en' && switchableLangs.includes('en')
        ? 'en'
        : (language === 'uz_lat' || language === 'uz_cyr') && switchableLangs.includes('uz')
        ? 'uz'
        : switchableLangs.includes('ru')
        ? 'ru'
        : switchableLangs[0] || 'en';
    const activeLangChip: 'uz' | 'ru' | 'en' =
      contentLangOverride !== 'auto' && switchableLangs.includes(contentLangOverride)
        ? contentLangOverride
        : defaultActiveLang;
    const cycleBookContentLang = () => {
      if (!showLangSwitch) return;
      const curIdx = switchableLangs.indexOf(activeLangChip);
      const next = switchableLangs[(curIdx + 1) % switchableLangs.length];
      setContentLangOverride(next);
    };

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

    const activeChapter = activeBookContent?.chapters[chapterIndex];

    const handleCopyChapter = () => {
      if (!activeChapter) return;
      const chTitle = resolveLocalizedBookText(activeChapter.title, language);
      const paras = resolveLocalizedBookParagraphs(activeChapter.paragraphs, language, preferredContentLang);
      const tk = resolveLocalizedBookText(activeChapter.takeaway, language, preferredContentLang);
      const lines = [
        `${bookTitle} — ${bookAuthor}`,
        chTitle,
        '',
        ...(activeChapter.sourceQuote ? [activeChapter.sourceQuote, ''] : []),
        ...paras,
        ...(tk ? ['', `${ui.takeawayTitle}: ${tk}`] : []),
      ];
      void copyTextSafely(lines.join('\n'));
      showToast(ui.copiedToast);
    };

    const handleShareQuoteCard = async () => {
      if (!activeChapter) return;
      setSharingCard(true);
      try {
        const chTitle = resolveLocalizedBookText(activeChapter.title, language);
        const paras = resolveLocalizedBookParagraphs(activeChapter.paragraphs, language, preferredContentLang);
        const tk = resolveLocalizedBookText(activeChapter.takeaway, language, preferredContentLang);
        const isArabicQuote = Boolean(
          activeChapter.sourceQuote && /[\u0600-\u06FF]/.test(activeChapter.sourceQuote)
        );
        const rendered = await generateNurulIslamShareCard({
          isDay,
          eyebrow: ui.backToShelf,
          metaPill: `${bookAuthor} · ${activeBookMeta.era}`,
          title: bookTitle,
          subtitle: chTitle,
          featuredText: activeChapter.sourceQuote,
          featuredIsArabic: isArabicQuote,
          bodyText: paras[0] || tk || chTitle,
          noteLabel: tk ? ui.takeawayTitle : undefined,
          noteText: tk || undefined,
          footerSectionTitle: 'Nurul Islam · Kutubxona',
        });
        if (!rendered) {
          handleCopyChapter();
          return;
        }
        await shareOrSavePngCard({
          rendered,
          fileName: `nurul-islam-book-${activeBookMeta.id}-${activeChapter.number}.png`,
          shareTitle: `${bookTitle} — ${chTitle}`,
          caption: `${bookTitle} (${bookAuthor}) · ${chTitle}`,
        });
        showToast(ui.sharedToast);
      } catch {
        handleCopyChapter();
      } finally {
        setSharingCard(false);
      }
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      if (animatingTo !== null || !currentLeaf) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('button')) return;

      pointerIdRef.current = e.pointerId;
      isDraggingRef.current = true;
      startXRef.current = e.clientX;
      startTimeRef.current = performance.now();
      lastDxRef.current = 0;
      setIsDragging(true);
      setDragX(0);
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current || pointerIdRef.current !== e.pointerId) return;
      const rawDx = e.clientX - startXRef.current;
      let dx = rawDx;
      if (rawDx > 0 && !prevLeaf) {
        dx = Math.min(32, rawDx * 0.16);
      } else if (rawDx < 0 && !nextLeaf) {
        dx = Math.max(-32, rawDx * 0.16);
      }
      lastDxRef.current = dx;
      setDragX(dx);
    };

    const finishPointerDrag = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current || pointerIdRef.current !== e.pointerId) return;
      isDraggingRef.current = false;
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
      const velocity = dx / elapsed;
      const deckWidth = bookDeckRef.current?.clientWidth || 360;
      const threshold = Math.min(64, deckWidth * 0.15);

      if ((dx < -threshold || (dx < -16 && velocity < -0.3)) && nextLeaf) {
        triggerTurn('next');
      } else if ((dx > threshold || (dx > 16 && velocity > 0.3)) && prevLeaf) {
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

    const deckWidth = bookDeckRef.current?.clientWidth || 360;
    const turnTransition =
      animatingTo !== null ? 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none';

    const renderPageLeaf = (
      leaf: ChapterLeaf,
      measureRef?: React.RefObject<HTMLDivElement | null>
    ) => {
      const globalNum = getGlobalPageNumber(leaf);
      return (
        <article
          className={`relative w-full h-full flex flex-col rounded-l-[3px] rounded-r-[14px] border overflow-hidden shadow-[0_10px_28px_rgba(32,20,6,0.16)] ${sheetBg}`}
        >
          {/* Left Book-Binding Spine Gutter Shadow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-7 z-10"
            style={{
              background: isDay
                ? 'linear-gradient(90deg, rgba(66,40,12,0.18) 0%, rgba(66,40,12,0.06) 11px, rgba(66,40,12,0) 28px)'
                : 'linear-gradient(90deg, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.16) 12px, rgba(0,0,0,0) 28px)',
            }}
          />

          {/* Classical Printed Margin Frame */}
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
                  {leaf.items[0]?.kind === 'chapter-header'
                    ? `${bookAuthor} · ${activeBookMeta.era}`
                    : `${ui.chapterRoman(formatChapterNumeral(leaf.chapterNumber))} · ${leaf.chapterTitle}`}
                </p>
              </header>

              {/* Exact Screen-Fit Reading Stage (Zero Vertical Scroll!) */}
              <div ref={measureRef} className="flex-1 min-h-0 overflow-hidden">
                {leaf.items.map((item, idx) => {
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
                    const allowDropCap =
                      item.isFirstInChapter && /^[A-Za-zА-Яа-яЁёЎўҚқҒғҲҳ]/.test(item.text);
                    return (
                      <p
                        key={`p-${idx}`}
                        className={`flow-root font-display text-justify ${bodySizeCls} ${
                          isFirstOnPage ? '' : 'mt-3'
                        } ${
                          allowDropCap
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

              {/* Printed Book Folio Footer (Pure Swipe Pagination — Zero Buttons) */}
              <footer
                className={`shrink-0 pt-2 mt-2 border-t ${ruleColor} flex items-center justify-between gap-2 text-[10.5px] font-display ${mutedInk}`}
              >
                <span className="font-arabic text-xs opacity-80 truncate">{activeBookMeta.arabicTitle}</span>
                {globalNum === 1 && totalBookPages > 1 && (
                  <span className="text-[10px] italic opacity-65 whitespace-nowrap">
                    {ui.swipeWhisper}
                  </span>
                )}
                <span className="font-bold tracking-widest tabular-nums shrink-0">
                  — {globalNum} / {totalBookPages} —
                </span>
              </footer>
            </div>
          </div>
        </article>
      );
    };

    const showingForwardSwipe = dragX < 0 || animatingTo === 'next';
    const showingBackwardSwipe = dragX > 0 || animatingTo === 'prev';
    const currentLeafTransform =
      showingForwardSwipe
        ? `translate3d(${dragX}px, 0, 0) rotate(${Math.max(-2.2, (dragX / Math.max(200, deckWidth)) * 2)}deg)`
        : !prevLeaf && dragX > 0
        ? `translate3d(${dragX}px, 0, 0)`
        : 'translate3d(0, 0, 0)';

    return (
      <div
        className={`flex-1 min-h-0 h-full flex flex-col gap-2 pt-2 pb-1 overflow-hidden animate-in fade-in ${
          isDay ? 'text-slate-900' : 'text-slate-100'
        }`}
      >
        {/* Whisper-Quiet Top Reading Toolbar */}
        <div className="shrink-0 flex items-center justify-between gap-1">
          <button
            type="button"
            onClick={closeBook}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-xl border text-xs font-bold transition active:scale-95 shrink-0 ${
              isDay
                ? 'bg-white border-[#dde3ea] text-[#0c4703] hover:bg-[#eef9ea]'
                : 'bg-slate-900 border-emerald-900/60 text-emerald-300'
            }`}
            aria-label={ui.backToShelf}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className={showLangSwitch ? 'hidden sm:inline' : ''}>{ui.backToShelf}</span>
          </button>

          <div className="flex items-center gap-1 shrink-0">
            {showLangSwitch && (
              <button
                type="button"
                onClick={cycleBookContentLang}
                className={`px-2 py-1.5 rounded-xl border text-[10.5px] font-extrabold uppercase transition ${
                  isDay
                    ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                    : 'bg-emerald-950 border-emerald-800 text-amber-300'
                }`}
                title="Switch translation language"
              >
                {activeLangChip === 'uz' ? 'O‘Z' : activeLangChip.toUpperCase()}
              </button>
            )}
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
              disabled={!activeBookContent}
              onClick={() => setIsTocOpen(true)}
              className={`p-1.5 rounded-xl border transition disabled:opacity-40 ${
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
              disabled={sharingCard || !activeBookContent}
              onClick={() => void handleShareQuoteCard()}
              className={`p-1.5 rounded-xl border transition disabled:opacity-40 ${
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
              onClick={() => toggleFavoriteBook(activeBookMeta.id)}
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

        {/* FULL-SCREEN INTERACTIVE SWIPE BOOK DECK */}
        <div
          ref={bookDeckRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishPointerDrag}
          onPointerCancel={finishPointerDrag}
          className="relative flex-1 min-h-0 pr-2 pb-2 overflow-hidden select-none touch-none cursor-grab active:cursor-grabbing"
        >
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

          {/* Stacked Physical Page Edges */}
          {(!currentLeaf || nextLeaf) && (
            <>
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 right-2 bottom-2 translate-x-2 translate-y-2 rounded-l-[3px] rounded-r-[14px] border ${stackBg2}`}
              />
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 right-2 bottom-2 translate-x-1 translate-y-1 rounded-l-[3px] rounded-r-[14px] border ${stackBg1}`}
              />
            </>
          )}

          <div className="relative w-full h-full">
            {/* Loading / Offline Fallback Sheet for Cloud Volumes */}
            {(loadingBook || loadBookError || !currentLeaf) && (
              <article
                className={`relative w-full h-full flex flex-col rounded-l-[3px] rounded-r-[14px] border overflow-hidden shadow-[0_10px_28px_rgba(32,20,6,0.16)] ${sheetBg}`}
              >
                <div className="p-3 sm:p-4 pl-5 sm:pl-6 flex-1 min-h-0 flex flex-col">
                  <div
                    className={`border ${ruleColor} rounded-l-[2px] rounded-r-[10px] px-6 py-8 flex-1 flex flex-col items-center justify-center text-center gap-4`}
                  >
                    <p className={`font-arabic text-2xl ${ornamentColor}`}>{activeBookMeta.arabicTitle}</p>
                    <h2 className="font-display text-xl font-bold">{bookTitle}</h2>
                    <p className={`font-display italic text-xs ${mutedInk}`}>{bookAuthor}</p>
                    {bookTranslator && (
                      <p className={`text-[11px] max-w-xs leading-snug opacity-85 ${mutedInk}`}>
                        {ui.translatorLabel}: {bookTranslator}
                      </p>
                    )}

                    {loadBookError ? (
                      <div className="space-y-3 pt-2 max-w-xs">
                        <p className="text-xs font-bold text-rose-600 dark:text-rose-300">
                          {ui.offlineErrorTitle}
                        </p>
                        <p className={`text-xs leading-relaxed ${mutedInk}`}>{ui.offlineErrorHint}</p>
                        <button
                          type="button"
                          onClick={() => void fetchAndOpenBook(activeBookMeta, progress.lastPosByBook[activeBookMeta.id])}
                          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition active:scale-95 ${
                            isDay ? 'bg-[#158509] text-white' : 'bg-amber-400 text-slate-950'
                          }`}
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>{ui.retryBtn}</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2 pt-3 flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full border-2 border-[#158509]/25 border-t-[#158509] dark:border-amber-400/25 dark:border-t-amber-400 animate-spin" />
                        <p className={`text-xs font-semibold ${mutedInk}`}>{ui.loadingBook}</p>
                        {activeBookMeta.storage === 'cloud' && (
                          <p className={`text-[11px] opacity-80 ${mutedInk}`}>{ui.loadingCloudHint}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            )}

            {/* Layer 1: Revealed Next Page underneath when swiping left */}
            {currentLeaf && showingForwardSwipe && nextLeaf && (
              <div className="absolute inset-0 z-10 pointer-events-none">
                {renderPageLeaf(nextLeaf)}
              </div>
            )}

            {/* Layer 2: Active Current Page Leaf */}
            {currentLeaf && (
              <div
                className="absolute inset-0 z-20 will-change-transform"
                style={{
                  transform: currentLeafTransform,
                  transition: turnTransition,
                }}
              >
                {renderPageLeaf(currentLeaf, bodyStageRef)}
              </div>
            )}

            {/* Layer 3: Incoming Previous Page sliding smoothly back over from left */}
            {currentLeaf && showingBackwardSwipe && prevLeaf && (
              <div
                className="absolute inset-0 z-30 will-change-transform pointer-events-none"
                style={{
                  transform: `translate3d(${dragX - deckWidth}px, 0, 0)`,
                  transition: turnTransition,
                }}
              >
                {renderPageLeaf(prevLeaf)}
              </div>
            )}
          </div>
        </div>

        {/* Table of Contents (Mundarija) Sheet */}
        {isTocOpen && activeBookContent && (
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
                <div className="min-w-0">
                  <h3 className="text-sm font-extrabold">{ui.contentsTitle}</h3>
                  <p className={`text-[11px] truncate ${subText}`}>
                    {bookTitle} · {ui.chaptersUnit(activeBookContent.chapters.length)}
                  </p>
                  {bookTranslator && (
                    <p className={`text-[10.5px] mt-0.5 leading-snug ${subText}`}>
                      {ui.translatorLabel}: {bookTranslator}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsTocOpen(false)}
                  className={`p-1.5 rounded-xl shrink-0 ${isDay ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-300'}`}
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="overflow-y-auto p-3 space-y-1.5">
                {activeBookContent.chapters.map((ch, idx) => {
                  const selected = idx === chapterIndex;
                  const done = progress.readChapterIds.includes(ch.id);
                  const startPg = chapterStartPages[idx];
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
                        <span className="text-xs font-bold leading-snug line-clamp-2">
                          {resolveLocalizedBookText(ch.title, language)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {startPg && (
                          <span className={`text-[10.5px] font-mono ${subText}`}>
                            {ui.pageShort(startPg)}
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

  /* ==================== HYBRID STANDING HARDCOVER BOOKSHELF VIEW ==================== */
  const lastBook = getCatalogBookById(catalog, progress.lastBookId);

  const filterTabs: Array<{ id: ShelfFilter; label: string }> = [
    { id: 'all', label: `${ui.catAll} (${catalog.length})` },
    { id: 'fiqh', label: ui.catFiqh },
    { id: 'hadith', label: ui.catHadith },
    { id: 'spirituality', label: ui.catSpirituality },
    { id: 'offline', label: `${ui.catOffline} (${offlineReadyCount})` },
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
            <p className="text-xs text-white/90 font-semibold mt-1">
              {ui.heroSubtitle(catalog.length, totalPagesLibrary)}
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-black/25 border border-white/15 font-mono text-[11px] font-extrabold text-[#fde68a] shrink-0">
            {offlineReadyCount}/{catalog.length} {ui.offlineBadge}
          </span>
        </div>

        {lastBook && (
          <div className="rounded-2xl bg-black/25 border border-white/15 px-3 py-2.5 flex items-center justify-between gap-2.5">
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#d0f39f] block">
                {ui.continueReading}
              </span>
              <p className="text-xs font-bold text-white truncate">
                {resolveLocalizedBookText(lastBook.title, language)} · {(progress.lastPosByBook[lastBook.id]?.ch ?? progress.lastChapterIndex) + 1}-bob
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

      {/* Category & Offline Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
        {filterTabs.map((cat) => {
          const active = shelfFilter === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setShelfFilter(cat.id)}
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

      {/* Language Filter Bar (O'zbekcha / Русский / English) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {(
          [
            { id: 'all', label: ui.allLangsLabel },
            { id: 'uz', label: `O‘zbekcha (${langCounts.uz})` },
            { id: 'ru', label: `Русский (${langCounts.ru})` },
            { id: 'en', label: `English (${langCounts.en})` },
          ] as Array<{ id: 'all' | 'uz' | 'ru' | 'en'; label: string }>
        ).map((lf) => {
          const active = langFilter === lf.id;
          return (
            <button
              key={lf.id}
              type="button"
              onClick={() => setLangFilter(lf.id)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border whitespace-nowrap transition shrink-0 ${
                active
                  ? isDay
                    ? 'bg-[#eef9ea] border-[#158509] text-[#0c4703]'
                    : 'bg-emerald-950 border-amber-400 text-amber-300'
                  : isDay
                  ? 'bg-white/80 border-[#dde3ea] text-slate-600 hover:border-[#158509]/40'
                  : 'bg-slate-900/80 border-emerald-900/50 text-slate-400 hover:border-amber-400/50'
              }`}
            >
              {lf.label}
            </button>
          );
        })}
      </div>

      {/* Realistic Standing Hardcover Book Covers Grid */}
      {filteredBooks.length === 0 ? (
        <div className={`rounded-2xl border p-6 text-center text-xs ${cardCls} ${subText}`}>
          {ui.emptyList}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filteredBooks.map((book) => {
            const isFav = favorites.includes(book.id);
            const offlineReady = isBookOfflineReady(book);
            const savedPos = progress.lastPosByBook[book.id];
            const progressPct = savedPos
              ? Math.min(100, Math.round(((savedPos.ch + 1) / Math.max(1, book.chaptersCount)) * 100))
              : 0;

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
                      <span className="px-1.5 py-0.5 rounded-md bg-black/30 border border-[#fde68a]/30 text-[8.5px] font-extrabold tracking-wider uppercase text-[#fde68a] truncate">
                        {formatBookLangBadge(book.contentLangs)}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        {!offlineReady && (
                          <span title="Cloud book (caches offline on open)" className="text-[#fde68a]/80">
                            <Cloud className="w-3 h-3" />
                          </span>
                        )}
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
                    </div>

                    <div className="text-center space-y-1 my-auto py-1">
                      <span className="block text-[10px] text-[#fde68a]/70">❖</span>
                      <p className="font-arabic text-sm sm:text-base text-[#fde68a] leading-snug line-clamp-2">
                        {book.arabicTitle}
                      </p>
                      <h3 className="font-display text-[12.5px] sm:text-[13.5px] font-bold leading-tight text-white line-clamp-3">
                        {resolveLocalizedBookText(book.title, language)}
                      </h3>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-[9.5px] text-white/75 text-center line-clamp-1 font-display italic">
                        {resolveLocalizedBookText(book.author, language)}
                      </p>
                      <div className="w-full h-1 rounded-full bg-black/30 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#fde68a] transition-all duration-300"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compact Caption under Cover showing REAL Book Length */}
                <div className="flex items-center justify-between px-1 text-[10.5px]">
                  <span className={`font-semibold truncate ${subText}`}>
                    {ui.chaptersUnit(book.chaptersCount)} · {ui.pagesUnit(book.estimatedPages)}
                  </span>
                  <span
                    className={`font-mono font-bold shrink-0 ${
                      offlineReady
                        ? isDay
                          ? 'text-[#158509]'
                          : 'text-emerald-300'
                        : isDay
                        ? 'text-slate-400'
                        : 'text-amber-300/75'
                    }`}
                  >
                    {offlineReady ? '✓' : `${book.sizeKb}KB`}
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
