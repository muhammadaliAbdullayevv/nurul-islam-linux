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

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
): void {
  const r = Math.min(radius, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawRubElHizbWatermark(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  strokeStyle: string,
  lineWidth = 1.6
): void {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;

  const side = radius * 1.414;
  // Square 1 (0 deg)
  ctx.strokeRect(-side / 2, -side / 2, side, side);
  // Square 2 (45 deg)
  ctx.save();
  ctx.rotate(Math.PI / 4);
  ctx.strokeRect(-side / 2, -side / 2, side, side);
  ctx.restore();

  // Inner subtle circles
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.56, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.22, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function loadAppIconImage(): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    let settled = false;
    const done = (val: HTMLImageElement | null) => {
      if (settled) return;
      settled = true;
      resolve(val);
    };
    const timer = window.setTimeout(() => done(null), 1200);
    img.onload = () => {
      window.clearTimeout(timer);
      done(img);
    };
    img.onerror = () => {
      window.clearTimeout(timer);
      done(null);
    };
    img.src = '/pwa-192x192.png';
  });
}

function wrapCanvasLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const lines: string[] = [];
  const paragraphs = text.split('\n');
  for (const para of paragraphs) {
    const words = para.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push('');
      continue;
    }
    let current = words[0];
    for (let i = 1; i < words.length; i++) {
      const candidate = `${current} ${words[i]}`;
      if (ctx.measureText(candidate).width <= maxWidth) {
        current = candidate;
      } else {
        lines.push(current);
        current = words[i];
      }
    }
    lines.push(current);
  }
  return lines;
}

function fitCanvasTextBlock(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  buildFont: (size: number) => string,
  startSize: number,
  minSize: number,
  maxLines: number,
  lineHeightRatio: number
): { fontSize: number; lineHeight: number; lines: string[]; height: number } {
  let fontSize = startSize;
  let lines: string[] = [];

  while (fontSize >= minSize) {
    ctx.font = buildFont(fontSize);
    lines = wrapCanvasLines(ctx, text, maxWidth);
    if (lines.length <= maxLines) break;
    fontSize -= 2;
  }

  if (fontSize < minSize) {
    fontSize = minSize;
    ctx.font = buildFont(fontSize);
    lines = wrapCanvasLines(ctx, text, maxWidth);
  }

  if (lines.length > maxLines) {
    const trimmed = lines.slice(0, maxLines);
    let last = trimmed[maxLines - 1].replace(/[.,;:—–\-\s]+$/, '');
    while (last.length > 8 && ctx.measureText(`${last}…`).width > maxWidth) {
      last = last.slice(0, -1).trimEnd();
    }
    trimmed[maxLines - 1] = `${last}…`;
    lines = trimmed;
  }

  const lineHeight = Math.round(fontSize * lineHeightRatio);
  const visualHeight =
    lines.length <= 1
      ? Math.round(fontSize * 1.18)
      : (lines.length - 1) * lineHeight + Math.round(fontSize * 1.18);
  return { fontSize, lineHeight, lines, height: visualHeight };
}

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
): Promise<{ dataUrl: string; blob: Blob | null } | null> {
  const canvas = document.createElement('canvas');
  const W = 1080;
  const H = 1350;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const { isDay, sectionTitle, sharhLabel, topicLabel } = options;
  const appIcon = await loadAppIconImage();

  // Wait briefly for web fonts if available (Lora / DM Sans / Amiri)
  try {
    if (document.fonts && document.fonts.ready) {
      await Promise.race([
        document.fonts.ready,
        new Promise((r) => window.setTimeout(r, 250)),
      ]);
    }
  } catch {
    // ignore
  }

  const SANS = '"DM Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  const SERIF = '"Lora", Georgia, "Times New Roman", serif';
  const ARABIC = '"Amiri", Georgia, serif';

  // ==================== 1. MODERN NURUL ISLAM BACKDROP ====================
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  if (isDay) {
    // Signature Nurul Islam vibrant emerald gradient (matches Home/Wisdom Hero)
    bgGrad.addColorStop(0, '#093e04');
    bgGrad.addColorStop(0.42, '#137709');
    bgGrad.addColorStop(0.78, '#1b7a28');
    bgGrad.addColorStop(1, '#0b4407');
  } else {
    // Deep Obsidian Emerald (matches Nurul Islam Night Mode)
    bgGrad.addColorStop(0, '#02100b');
    bgGrad.addColorStop(0.45, '#07271c');
    bgGrad.addColorStop(0.82, '#093424');
    bgGrad.addColorStop(1, '#03120c');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Soft modern ambient light blooms
  const bloomTop = ctx.createRadialGradient(W * 0.88, 120, 30, W * 0.88, 120, 560);
  bloomTop.addColorStop(
    0,
    isDay ? 'rgba(208, 243, 159, 0.30)' : 'rgba(251, 191, 36, 0.19)'
  );
  bloomTop.addColorStop(1, 'rgba(251, 191, 36, 0)');
  ctx.fillStyle = bloomTop;
  ctx.fillRect(0, 0, W, H);

  const bloomBottom = ctx.createRadialGradient(W * 0.14, H - 180, 20, W * 0.14, H - 180, 520);
  bloomBottom.addColorStop(
    0,
    isDay ? 'rgba(134, 239, 172, 0.18)' : 'rgba(16, 185, 129, 0.18)'
  );
  bloomBottom.addColorStop(1, 'rgba(16, 185, 129, 0)');
  ctx.fillStyle = bloomBottom;
  ctx.fillRect(0, 0, W, H);

  // Delicate geometric Rub el Hizb sacred star watermarks in outer corners
  const watermarkStroke = isDay
    ? 'rgba(255, 255, 255, 0.08)'
    : 'rgba(251, 191, 36, 0.09)';
  drawRubElHizbWatermark(ctx, W - 78, 108, 155, watermarkStroke, 1.8);
  drawRubElHizbWatermark(ctx, 84, H - 120, 140, watermarkStroke, 1.8);

  // Subtle modern outer glass inset border
  ctx.save();
  drawRoundedRect(ctx, 26, 26, W - 52, H - 52, 48);
  ctx.strokeStyle = isDay
    ? 'rgba(255, 255, 255, 0.15)'
    : 'rgba(52, 211, 153, 0.16)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  // ==================== 2. TOP EYEBROW BRAND PILL ====================
  const eyebrowText = topicLabel
    ? `✦  ${sectionTitle.toUpperCase()}  ·  ${topicLabel.toUpperCase()}`
    : `✦  ${sectionTitle.toUpperCase()}`;
  ctx.font = `700 18px ${SANS}`;
  const eyebrowW = Math.min(W - 160, ctx.measureText(eyebrowText).width + 54);
  const eyebrowX = (W - eyebrowW) / 2;
  const eyebrowY = 50;
  const eyebrowH = 44;

  ctx.save();
  drawRoundedRect(ctx, eyebrowX, eyebrowY, eyebrowW, eyebrowH, 22);
  ctx.fillStyle = isDay
    ? 'rgba(255, 255, 255, 0.14)'
    : 'rgba(251, 191, 36, 0.12)';
  ctx.fill();
  ctx.strokeStyle = isDay
    ? 'rgba(255, 255, 255, 0.28)'
    : 'rgba(251, 191, 36, 0.30)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = isDay ? '#ecfccb' : '#fde68a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(eyebrowText, W / 2, eyebrowY + eyebrowH / 2 + 1, eyebrowW - 36);
  ctx.restore();

  // ==================== 3. ELEVATED MAIN FLOATING CARD ====================
  const cardX = 68;
  const cardY = 120;
  const cardW = W - 136; // 944
  const cardH = 1036;
  const cardR = 44;

  // Multi-layered soft drop shadow
  ctx.save();
  ctx.shadowColor = isDay ? 'rgba(5, 36, 10, 0.34)' : 'rgba(0, 0, 0, 0.58)';
  ctx.shadowBlur = 46;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 20;
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, cardR);
  const cardBg = ctx.createLinearGradient(cardX, cardY, cardX, cardY + cardH);
  if (isDay) {
    cardBg.addColorStop(0, '#ffffff');
    cardBg.addColorStop(0.55, '#fbfef9');
    cardBg.addColorStop(1, '#f3faf0');
  } else {
    cardBg.addColorStop(0, '#0c241b');
    cardBg.addColorStop(0.55, '#0a2018');
    cardBg.addColorStop(1, '#071711');
  }
  ctx.fillStyle = cardBg;
  ctx.fill();
  ctx.restore();

  // Clipped inner card details (top accent ribbon + subtle inner header tint + corner star)
  ctx.save();
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, cardR);
  ctx.clip();

  // Soft tinted header aura inside top of card
  const headerAura = ctx.createLinearGradient(cardX, cardY, cardX, cardY + 250);
  if (isDay) {
    headerAura.addColorStop(0, 'rgba(238, 249, 234, 0.95)');
    headerAura.addColorStop(1, 'rgba(255, 255, 255, 0)');
  } else {
    headerAura.addColorStop(0, 'rgba(16, 185, 129, 0.12)');
    headerAura.addColorStop(1, 'rgba(10, 32, 24, 0)');
  }
  ctx.fillStyle = headerAura;
  ctx.fillRect(cardX, cardY, cardW, 250);

  // Subtle geometric star medallion tucked inside card top-right
  drawRubElHizbWatermark(
    ctx,
    cardX + cardW - 56,
    cardY + 56,
    92,
    isDay ? 'rgba(21, 133, 9, 0.06)' : 'rgba(251, 191, 36, 0.07)',
    1.5
  );

  // Crisp top gradient ribbon (Nurul Islam Emerald → Lime → Warm Gold)
  const topBar = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY);
  if (isDay) {
    topBar.addColorStop(0, '#0c5007');
    topBar.addColorStop(0.45, '#158509');
    topBar.addColorStop(0.8, '#65a30d');
    topBar.addColorStop(1, '#eab308');
  } else {
    topBar.addColorStop(0, '#10b981');
    topBar.addColorStop(0.5, '#fbbf24');
    topBar.addColorStop(1, '#10b981');
  }
  ctx.fillStyle = topBar;
  ctx.fillRect(cardX, cardY, cardW, 8);
  ctx.restore();

  // Crisp specular outer card border
  ctx.save();
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, cardR);
  ctx.strokeStyle = isDay
    ? 'rgba(255, 255, 255, 0.92)'
    : 'rgba(52, 211, 153, 0.28)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // ==================== 4. SCHOLAR IDENTITY HEADER ====================
  const innerPadX = 68;
  const contentMaxW = cardW - innerPadX * 2; // 808
  let y = cardY + 58;

  // Work & Years pill badge
  const metaText = `${entry.work}  •  ${scholar.years}`;
  ctx.font = `700 20px ${SANS}`;
  const metaPillW = Math.min(contentMaxW, ctx.measureText(metaText).width + 48);
  const metaPillX = W / 2 - metaPillW / 2;
  const metaPillH = 42;

  ctx.save();
  drawRoundedRect(ctx, metaPillX, y, metaPillW, metaPillH, 21);
  ctx.fillStyle = isDay ? '#eef9ea' : 'rgba(251, 191, 36, 0.13)';
  ctx.fill();
  ctx.strokeStyle = isDay ? '#c3e5b9' : 'rgba(251, 191, 36, 0.32)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = isDay ? '#0c4703' : '#fde68a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(metaText, W / 2, y + metaPillH / 2 + 1, metaPillW - 32);
  ctx.restore();

  y += metaPillH + 34;

  // Scholar Name (auto-sized so long names fit cleanly on 1 line)
  let nameSize = 44;
  ctx.font = `700 ${nameSize}px ${SERIF}`;
  while (nameSize > 32 && ctx.measureText(scholar.name).width > contentMaxW) {
    nameSize -= 2;
    ctx.font = `700 ${nameSize}px ${SERIF}`;
  }
  ctx.save();
  ctx.fillStyle = isDay ? '#0c4703' : '#fde68a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(scholar.name, W / 2, y + nameSize * 0.72, contentMaxW);
  ctx.restore();

  y += Math.round(nameSize * 0.95) + 14;

  // Entry Heading / Subtitle
  const headingFit = fitCanvasTextBlock(
    ctx,
    entry.heading,
    contentMaxW - 24,
    (sz) => `600 ${sz}px ${SANS}`,
    24,
    19,
    2,
    1.32
  );
  ctx.save();
  ctx.font = `600 ${headingFit.fontSize}px ${SANS}`;
  ctx.fillStyle = isDay ? '#475569' : '#a7f3d0';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  for (let i = 0; i < headingFit.lines.length; i++) {
    ctx.fillText(headingFit.lines[i], W / 2, y + i * headingFit.lineHeight);
  }
  ctx.restore();

  y += headingFit.height + 24;

  // Ornamental thin divider with center diamond
  ctx.save();
  const divGrad = ctx.createLinearGradient(W / 2 - 190, y, W / 2 + 190, y);
  if (isDay) {
    divGrad.addColorStop(0, 'rgba(21, 133, 9, 0)');
    divGrad.addColorStop(0.5, 'rgba(21, 133, 9, 0.35)');
    divGrad.addColorStop(1, 'rgba(21, 133, 9, 0)');
  } else {
    divGrad.addColorStop(0, 'rgba(251, 191, 36, 0)');
    divGrad.addColorStop(0.5, 'rgba(251, 191, 36, 0.45)');
    divGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
  }
  ctx.strokeStyle = divGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 190, y);
  ctx.lineTo(W / 2 - 18, y);
  ctx.moveTo(W / 2 + 18, y);
  ctx.lineTo(W / 2 + 190, y);
  ctx.stroke();

  // Center diamond ornament
  ctx.translate(W / 2, y);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = isDay ? '#d99b1e' : '#fbbf24';
  ctx.fillRect(-5, -5, 10, 10);
  ctx.restore();

  // ==================== 5. DYNAMICALLY BALANCED WISDOM BODY ====================
  const bodyTop = y + 30;
  const bodyBottom = cardY + cardH - 44;
  const availH = bodyBottom - bodyTop;

  const hasOriginal = Boolean(entry.original && entry.original.trim());
  const isArabicOriginal = Boolean(
    hasOriginal && /[\u0600-\u06FF]/.test(entry.original || '')
  );

  // Measure Verse Box (if present)
  const versePadX = 42;
  const versePadY = isArabicOriginal ? 30 : 28;
  const verseInnerW = contentMaxW - versePadX * 2 - 14;
  const verseFit = hasOriginal
    ? fitCanvasTextBlock(
        ctx,
        entry.original!.trim(),
        verseInnerW,
        (sz) =>
          isArabicOriginal ? `700 ${sz}px ${ARABIC}` : `italic 600 ${sz}px ${SERIF}`,
        isArabicOriginal ? 44 : 35,
        isArabicOriginal ? 30 : 24,
        6,
        isArabicOriginal ? 1.62 : 1.48
      )
    : null;
  const verseBoxH = verseFit
    ? Math.max(isArabicOriginal ? 114 : 98, verseFit.height + versePadY * 2)
    : 0;

  // Measure Main Excerpt
  const excerptMaxW = hasOriginal ? contentMaxW - 24 : contentMaxW - 86;
  const excerptFit = fitCanvasTextBlock(
    ctx,
    entry.excerpt.trim(),
    excerptMaxW,
    (sz) => (hasOriginal ? `500 ${sz}px ${SANS}` : `600 ${sz}px ${SERIF}`),
    hasOriginal ? 30 : 37,
    hasOriginal ? 22 : 25,
    hasOriginal ? 7 : 8,
    1.46
  );
  const excerptBlockH = hasOriginal ? excerptFit.height : excerptFit.height + 64;

  // Measure Optional Sharh Box if vertical space comfortably allows
  const gapAfterVerse = hasOriginal ? 28 : 0;
  const gapBeforeSharh = 28;
  const usedWithoutSharh = verseBoxH + gapAfterVerse + excerptBlockH;
  const remainingForSharh = availH - usedWithoutSharh - gapBeforeSharh;

  let sharhFit: ReturnType<typeof fitCanvasTextBlock> | null = null;
  let sharhBoxH = 0;
  if (entry.sharh && entry.sharh.trim() && remainingForSharh >= 118) {
    const maxSharhLines = remainingForSharh >= 152 ? 3 : 2;
    const candidate = fitCanvasTextBlock(
      ctx,
      entry.sharh.trim(),
      contentMaxW - 64,
      (sz) => `400 ${sz}px ${SANS}`,
      21,
      18,
      maxSharhLines,
      1.38
    );
    const boxH = candidate.height + 64;
    if (boxH <= remainingForSharh) {
      sharhFit = candidate;
      sharhBoxH = boxH;
    }
  }

  const totalContentH =
    verseBoxH +
    gapAfterVerse +
    excerptBlockH +
    (sharhFit ? gapBeforeSharh + sharhBoxH : 0);

  // Vertically center the measured stack within [bodyTop, bodyBottom]
  let curY = bodyTop + Math.max(0, Math.round((availH - totalContentH) * 0.46));

  // --- Render Verse Box (when original exists) ---
  if (verseFit) {
    const boxX = cardX + innerPadX;
    const boxW = contentMaxW;

    ctx.save();
    drawRoundedRect(ctx, boxX, curY, boxW, verseBoxH, 28);
    const vBg = ctx.createLinearGradient(boxX, curY, boxX + boxW, curY + verseBoxH);
    if (isDay) {
      vBg.addColorStop(0, '#eef9ea');
      vBg.addColorStop(1, '#fafdf5');
    } else {
      vBg.addColorStop(0, 'rgba(6, 78, 59, 0.36)');
      vBg.addColorStop(1, 'rgba(15, 39, 30, 0.52)');
    }
    ctx.fillStyle = vBg;
    ctx.fill();
    ctx.strokeStyle = isDay ? '#c7e6be' : 'rgba(52, 211, 153, 0.28)';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Accent side bar (emerald-to-gold gradient; right side if Arabic RTL)
    const barW = 7;
    const barX = isArabicOriginal ? boxX + boxW - barW - 14 : boxX + 14;
    const barY = curY + 20;
    const barH = verseBoxH - 40;
    drawRoundedRect(ctx, barX, barY, barW, barH, 4);
    const barGrad = ctx.createLinearGradient(barX, barY, barX, barY + barH);
    if (isDay) {
      barGrad.addColorStop(0, '#158509');
      barGrad.addColorStop(1, '#d99b1e');
    } else {
      barGrad.addColorStop(0, '#fbbf24');
      barGrad.addColorStop(1, '#10b981');
    }
    ctx.fillStyle = barGrad;
    ctx.fill();

    // Subtle decorative opening quote mark
    if (!isArabicOriginal) {
      ctx.font = `700 84px ${SERIF}`;
      ctx.fillStyle = isDay
        ? 'rgba(21, 133, 9, 0.10)'
        : 'rgba(251, 191, 36, 0.11)';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('“', boxX + 28, curY + 4);
    }

    // Verse lines (optically centered vertically inside verse box)
    ctx.font = isArabicOriginal
      ? `700 ${verseFit.fontSize}px ${ARABIC}`
      : `italic 600 ${verseFit.fontSize}px ${SERIF}`;
    ctx.fillStyle = isDay ? '#0c4703' : '#fef3c7';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const textCenterX = W / 2 + (isArabicOriginal ? -4 : 4);
    const verseStartY =
      curY + Math.round((verseBoxH - verseFit.height) / 2) + (isArabicOriginal ? -2 : 0);
    for (let i = 0; i < verseFit.lines.length; i++) {
      ctx.fillText(
        verseFit.lines[i],
        textCenterX,
        verseStartY + i * verseFit.lineHeight
      );
    }
    ctx.restore();

    curY += verseBoxH + gapAfterVerse;
  }

  // --- Render Main Excerpt ---
  if (hasOriginal) {
    ctx.save();
    ctx.font = `500 ${excerptFit.fontSize}px ${SANS}`;
    ctx.fillStyle = isDay ? '#1e293b' : '#f1f5f9';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let i = 0; i < excerptFit.lines.length; i++) {
      ctx.fillText(excerptFit.lines[i], W / 2, curY + i * excerptFit.lineHeight);
    }
    ctx.restore();
    curY += excerptBlockH;
  } else {
    // Featured quote container when excerpt is the primary wisdom statement
    const boxX = cardX + innerPadX;
    const boxW = contentMaxW;
    ctx.save();
    drawRoundedRect(ctx, boxX, curY, boxW, excerptBlockH, 28);
    const qBg = ctx.createLinearGradient(boxX, curY, boxX + boxW, curY + excerptBlockH);
    if (isDay) {
      qBg.addColorStop(0, '#f1faf0');
      qBg.addColorStop(1, '#fafdf7');
    } else {
      qBg.addColorStop(0, 'rgba(6, 78, 59, 0.34)');
      qBg.addColorStop(1, 'rgba(15, 39, 30, 0.50)');
    }
    ctx.fillStyle = qBg;
    ctx.fill();
    ctx.strokeStyle = isDay ? '#c7e6be' : 'rgba(52, 211, 153, 0.28)';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Left emerald-gold accent bar
    const barGrad = ctx.createLinearGradient(boxX + 14, curY + 22, boxX + 14, curY + excerptBlockH - 22);
    if (isDay) {
      barGrad.addColorStop(0, '#158509');
      barGrad.addColorStop(1, '#d99b1e');
    } else {
      barGrad.addColorStop(0, '#fbbf24');
      barGrad.addColorStop(1, '#10b981');
    }
    drawRoundedRect(ctx, boxX + 14, curY + 22, 7, excerptBlockH - 44, 4);
    ctx.fillStyle = barGrad;
    ctx.fill();

    // Decorative quote glyph
    ctx.font = `700 92px ${SERIF}`;
    ctx.fillStyle = isDay
      ? 'rgba(21, 133, 9, 0.10)'
      : 'rgba(251, 191, 36, 0.11)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('“', boxX + 30, curY + 4);

    // Excerpt lines
    ctx.font = `600 ${excerptFit.fontSize}px ${SERIF}`;
    ctx.fillStyle = isDay ? '#0f172a' : '#f8fafc';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let i = 0; i < excerptFit.lines.length; i++) {
      ctx.fillText(
        excerptFit.lines[i],
        W / 2 + 4,
        curY + 32 + i * excerptFit.lineHeight
      );
    }
    ctx.restore();
    curY += excerptBlockH;
  }

  // --- Render Sharh / Reflection Callout Box ---
  if (sharhFit) {
    curY += gapBeforeSharh;
    const sX = cardX + innerPadX;
    const sW = contentMaxW;

    ctx.save();
    drawRoundedRect(ctx, sX, curY, sW, sharhBoxH, 24);
    ctx.fillStyle = isDay ? '#f8fafc' : 'rgba(2, 14, 10, 0.52)';
    ctx.fill();
    ctx.strokeStyle = isDay ? '#e2e8f0' : 'rgba(16, 185, 129, 0.22)';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Label row
    ctx.font = `700 16px ${SANS}`;
    ctx.fillStyle = isDay ? '#158509' : '#6ee7b7';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(`✦  ${sharhLabel.toUpperCase()}`, W / 2, curY + 18);

    // Sharh lines
    ctx.font = `400 ${sharhFit.fontSize}px ${SANS}`;
    ctx.fillStyle = isDay ? '#475569' : '#cbd5e1';
    for (let i = 0; i < sharhFit.lines.length; i++) {
      ctx.fillText(
        sharhFit.lines[i],
        W / 2,
        curY + 46 + i * sharhFit.lineHeight
      );
    }
    ctx.restore();
  }

  // ==================== 6. MODERN FROSTED BRAND FOOTER BAR ====================
  const footX = cardX;
  const footY = cardY + cardH + 28; // 1184
  const footW = cardW;
  const footH = 112;

  ctx.save();
  drawRoundedRect(ctx, footX, footY, footW, footH, 30);
  ctx.fillStyle = isDay
    ? 'rgba(255, 255, 255, 0.14)'
    : 'rgba(255, 255, 255, 0.06)';
  ctx.fill();
  ctx.strokeStyle = isDay
    ? 'rgba(255, 255, 255, 0.26)'
    : 'rgba(251, 191, 36, 0.24)';
  ctx.lineWidth = 1.6;
  ctx.stroke();

  // App Icon Badge (left)
  const iconSize = 68;
  const iconX = footX + 24;
  const iconY = footY + (footH - iconSize) / 2;

  ctx.save();
  drawRoundedRect(ctx, iconX, iconY, iconSize, iconSize, 18);
  ctx.clip();
  if (appIcon) {
    ctx.drawImage(appIcon, iconX, iconY, iconSize, iconSize);
  } else {
    ctx.fillStyle = '#0b5239';
    ctx.fillRect(iconX, iconY, iconSize, iconSize);
    ctx.fillStyle = '#f2cc7b';
    ctx.font = `700 34px ${SERIF}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('☪', iconX + iconSize / 2, iconY + iconSize / 2 + 2);
  }
  ctx.restore();

  // Subtle gold ring around app icon
  ctx.save();
  drawRoundedRect(ctx, iconX, iconY, iconSize, iconSize, 18);
  ctx.strokeStyle = 'rgba(253, 230, 138, 0.55)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // Brand title & subtitle next to icon
  const brandTextX = iconX + iconSize + 20;
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 28px ${SERIF}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('Nurul Islam', brandTextX, footY + 23);

  ctx.fillStyle = isDay ? '#d0f39f' : '#fde68a';
  ctx.font = `600 18px ${SANS}`;
  ctx.fillText(sectionTitle, brandTextX, footY + 60);

  // Domain pill (right)
  const domainText = 'nurulislam.mabdullayev.dev';
  ctx.font = `600 19px ${SANS}`;
  const domW = ctx.measureText(domainText).width + 38;
  const domH = 44;
  const domX = footX + footW - domW - 24;
  const domY = footY + (footH - domH) / 2;

  drawRoundedRect(ctx, domX, domY, domW, domH, 22);
  ctx.fillStyle = isDay
    ? 'rgba(6, 40, 10, 0.34)'
    : 'rgba(16, 185, 129, 0.14)';
  ctx.fill();
  ctx.strokeStyle = isDay
    ? 'rgba(208, 243, 159, 0.34)'
    : 'rgba(52, 211, 153, 0.30)';
  ctx.lineWidth = 1.4;
  ctx.stroke();

  ctx.fillStyle = isDay ? '#ffffff' : '#a7f3d0';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(domainText, domX + domW / 2, domY + domH / 2 + 1);
  ctx.restore();

  const dataUrl = canvas.toDataURL('image/png');
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), 'image/png');
  });
  return { dataUrl, blob };
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
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(lines);
        } else {
          throw new Error('Clipboard API unavailable');
        }
      } catch {
        // Fallback for non-HTTPS localhost WebKit2GTK or older WebViews
        const ta = document.createElement('textarea');
        ta.value = lines;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand('copy');
        } catch {
          // ignore
        }
        ta.remove();
      }
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
        const { dataUrl, blob } = rendered;
        const fileName = `nurul-islam-${scholar.id}-${entry.id}.png`;
        const caption = `${entry.excerpt}\n— ${scholar.name} (${entry.work})\nNurul Islam · nurulislam.mabdullayev.dev`;

        // 1. Native Android Share Sheet (FileProvider + ACTION_SEND image/png)
        const androidBridge = (
          window as Window & {
            NqNativeBridge?: {
              shareImageBase64?: (b64: string, name: string, text: string) => boolean;
            };
          }
        ).NqNativeBridge;
        if (androidBridge && typeof androidBridge.shareImageBase64 === 'function') {
          const ok = androidBridge.shareImageBase64(dataUrl, fileName, caption);
          if (ok) return;
        }

        // 2. Native Linux Desktop wrapper (saves to ~/Pictures/Nurul-Islam, copies to clipboard & opens image)
        const isDesktop =
          new URLSearchParams(window.location.search).get('desktop') === '1' ||
          Boolean((window as Window & { __NQ_LINUX_DESKTOP__?: boolean }).__NQ_LINUX_DESKTOP__);
        if (isDesktop && window.location.hostname === '127.0.0.1') {
          try {
            const resp = await fetch('/__desktop_save_image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ dataUrl, fileName }),
            });
            if (resp.ok) {
              const info = (await resp.json()) as { ok?: boolean; path?: string };
              if (info.ok) {
                showToast(info.path ? `${ui.cardSavedMsg}: ${info.path}` : ui.cardSavedMsg);
                return;
              }
            }
          } catch {
            // fall through to browser download
          }
        }

        // 3. Modern Mobile/Web Browsers: Web Share API with PNG File
        if (blob) {
          const file = new File([blob], fileName, { type: 'image/png' });
          const nav = navigator as Navigator & {
            canShare?: (data: ShareData) => boolean;
          };
          if (nav.share && (!nav.canShare || nav.canShare({ files: [file] }))) {
            try {
              await nav.share({
                title: `${scholar.name} — ${entry.heading}`,
                text: caption,
                files: [file],
              });
              return;
            } catch (err) {
              if ((err as { name?: string })?.name === 'AbortError') return;
            }
          }
        }

        // 4. Standard browser PNG download fallback
        const a = document.createElement('a');
        a.href = blob ? URL.createObjectURL(blob) : dataUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        if (blob && a.href.startsWith('blob:')) {
          const revokeTarget = a.href;
          window.setTimeout(() => URL.revokeObjectURL(revokeTarget), 4000);
        }
        showToast(ui.cardSavedMsg);
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
