export interface ShareCardPayload {
  isDay: boolean;
  eyebrow: string;
  metaPill: string;
  title: string;
  subtitle?: string;
  featuredText?: string;
  featuredIsArabic?: boolean;
  transliteration?: string;
  bodyText: string;
  noteLabel?: string;
  noteText?: string;
  footerSectionTitle: string;
}

export interface RenderedPngCard {
  dataUrl: string;
  blob: Blob | null;
}

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
  ctx.strokeRect(-side / 2, -side / 2, side, side);
  ctx.save();
  ctx.rotate(Math.PI / 4);
  ctx.strokeRect(-side / 2, -side / 2, side, side);
  ctx.restore();

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.56, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.22, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

let cachedAppIcon: HTMLImageElement | null = null;

function loadAppIconImage(): Promise<HTMLImageElement | null> {
  if (cachedAppIcon && cachedAppIcon.complete && cachedAppIcon.naturalWidth > 0) {
    return Promise.resolve(cachedAppIcon);
  }
  return new Promise((resolve) => {
    const img = new Image();
    let settled = false;
    const done = (val: HTMLImageElement | null) => {
      if (settled) return;
      settled = true;
      if (val) cachedAppIcon = val;
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

interface FittedTextBlock {
  fontSize: number;
  lineHeight: number;
  lines: string[];
  height: number;
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
): FittedTextBlock {
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

/**
 * Generates a studio-grade 1080x1350 Nurul Islam PNG quote card matching the active Day/Night app theme.
 * Used uniformly across Wisdom (Hikmatlar), Quran Ayahs, Hadiths, Zikr, and Duas.
 */
export async function generateNurulIslamShareCard(
  payload: ShareCardPayload
): Promise<RenderedPngCard | null> {
  const canvas = document.createElement('canvas');
  const W = 1080;
  const H = 1350;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const {
    isDay,
    eyebrow,
    metaPill,
    title,
    subtitle,
    featuredText,
    featuredIsArabic,
    transliteration,
    bodyText,
    noteLabel,
    noteText,
    footerSectionTitle,
  } = payload;

  const appIcon = await loadAppIconImage();

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
    bgGrad.addColorStop(0, '#093e04');
    bgGrad.addColorStop(0.42, '#137709');
    bgGrad.addColorStop(0.78, '#1b7a28');
    bgGrad.addColorStop(1, '#0b4407');
  } else {
    bgGrad.addColorStop(0, '#02100b');
    bgGrad.addColorStop(0.45, '#07271c');
    bgGrad.addColorStop(0.82, '#093424');
    bgGrad.addColorStop(1, '#03120c');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Ambient soft light blooms
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

  // Subtle geometric Rub el Hizb sacred star watermarks in corners
  const watermarkStroke = isDay
    ? 'rgba(255, 255, 255, 0.08)'
    : 'rgba(251, 191, 36, 0.09)';
  drawRubElHizbWatermark(ctx, W - 78, 108, 155, watermarkStroke, 1.8);
  drawRubElHizbWatermark(ctx, 84, H - 120, 140, watermarkStroke, 1.8);

  // Subtle outer glass inset hairline
  ctx.save();
  drawRoundedRect(ctx, 26, 26, W - 52, H - 52, 48);
  ctx.strokeStyle = isDay
    ? 'rgba(255, 255, 255, 0.15)'
    : 'rgba(52, 211, 153, 0.16)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  // ==================== 2. TOP EYEBROW BRAND PILL ====================
  const eyebrowText = `✦  ${eyebrow.toUpperCase()}`;
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

  // Clipped inner card top aura, corner watermark, and signature top accent bar
  ctx.save();
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, cardR);
  ctx.clip();

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

  drawRubElHizbWatermark(
    ctx,
    cardX + cardW - 56,
    cardY + 56,
    92,
    isDay ? 'rgba(21, 133, 9, 0.06)' : 'rgba(251, 191, 36, 0.07)',
    1.5
  );

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

  // ==================== 4. CARD HEADER BLOCK ====================
  const innerPadX = 68;
  const contentMaxW = cardW - innerPadX * 2; // 808
  let y = cardY + 54;

  // Meta pill badge
  if (metaPill.trim()) {
    ctx.font = `700 20px ${SANS}`;
    const metaPillW = Math.min(contentMaxW, ctx.measureText(metaPill).width + 48);
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
    ctx.fillText(metaPill, W / 2, y + metaPillH / 2 + 1, metaPillW - 32);
    ctx.restore();

    y += metaPillH + 30;
  }

  // Main Title (auto-scales smoothly up to 2 lines if long)
  const titleFit = fitCanvasTextBlock(
    ctx,
    title.trim(),
    contentMaxW,
    (sz) => `700 ${sz}px ${SERIF}`,
    42,
    28,
    2,
    1.24
  );
  ctx.save();
  ctx.font = `700 ${titleFit.fontSize}px ${SERIF}`;
  ctx.fillStyle = isDay ? '#0c4703' : '#fde68a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  for (let i = 0; i < titleFit.lines.length; i++) {
    ctx.fillText(titleFit.lines[i], W / 2, y + i * titleFit.lineHeight);
  }
  ctx.restore();

  y += titleFit.height + (subtitle?.trim() ? 12 : 20);

  // Optional Subtitle
  if (subtitle && subtitle.trim()) {
    const subFit = fitCanvasTextBlock(
      ctx,
      subtitle.trim(),
      contentMaxW - 24,
      (sz) => `600 ${sz}px ${SANS}`,
      23,
      18,
      2,
      1.3
    );
    ctx.save();
    ctx.font = `600 ${subFit.fontSize}px ${SANS}`;
    ctx.fillStyle = isDay ? '#475569' : '#a7f3d0';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let i = 0; i < subFit.lines.length; i++) {
      ctx.fillText(subFit.lines[i], W / 2, y + i * subFit.lineHeight);
    }
    ctx.restore();
    y += subFit.height + 22;
  }

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

  ctx.translate(W / 2, y);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = isDay ? '#d99b1e' : '#fbbf24';
  ctx.fillRect(-5, -5, 10, 10);
  ctx.restore();

  // ==================== 5. DYNAMICALLY BALANCED CONTENT BODY ====================
  const bodyTop = y + 28;
  const bodyBottom = cardY + cardH - 42;
  const availH = Math.max(240, bodyBottom - bodyTop);

  const cleanFeatured = featuredText?.trim() || '';
  const hasFeatured = cleanFeatured.length > 0;
  const isArabicFeatured = Boolean(
    hasFeatured && (featuredIsArabic || /[\u0600-\u06FF]/.test(cleanFeatured))
  );
  const cleanTranslit = transliteration?.trim() || '';
  const cleanBody = bodyText.trim();
  const cleanNote = noteText?.trim() || '';

  // Measure Featured Quote / Arabic Box (if present)
  const versePadX = 42;
  const versePadY = isArabicFeatured ? 28 : 26;
  const verseInnerW = contentMaxW - versePadX * 2 - 16;

  // Give Arabic Ayahs/Duas dynamic max lines based on how much body text follows
  const bodyLen = cleanBody.length;
  const maxFeaturedLines = isArabicFeatured
    ? bodyLen > 240
      ? 5
      : 7
    : 6;

  const verseFit = hasFeatured
    ? fitCanvasTextBlock(
        ctx,
        cleanFeatured,
        verseInnerW,
        (sz) =>
          isArabicFeatured ? `700 ${sz}px ${ARABIC}` : `italic 600 ${sz}px ${SERIF}`,
        isArabicFeatured ? 42 : 35,
        isArabicFeatured ? 24 : 23,
        maxFeaturedLines,
        isArabicFeatured ? 1.58 : 1.46
      )
    : null;
  const verseBoxH = verseFit
    ? Math.max(isArabicFeatured ? 108 : 96, verseFit.height + versePadY * 2)
    : 0;

  // Measure Optional Transliteration (for Duas)
  const translitFit =
    hasFeatured && cleanTranslit
      ? fitCanvasTextBlock(
          ctx,
          cleanTranslit,
          contentMaxW - 36,
          (sz) => `italic 600 ${sz}px ${SANS}`,
          23,
          18,
          4,
          1.38
        )
      : null;

  const gapAfterVerse = hasFeatured ? 24 : 0;
  const gapAfterTranslit = translitFit ? 18 : 0;

  // Measure Main Body Text (auto-fits remaining vertical budget cleanly!)
  const remainingAfterFeatured =
    availH - verseBoxH - gapAfterVerse - (translitFit ? translitFit.height + gapAfterTranslit : 0);

  let bodyFit: FittedTextBlock;
  let bodyBlockH: number;
  if (hasFeatured) {
    // Translation or meaning below featured Arabic/verse box
    const maxBodyLines = Math.max(3, Math.min(10, Math.floor((remainingAfterFeatured - 12) / 34)));
    bodyFit = fitCanvasTextBlock(
      ctx,
      cleanBody,
      contentMaxW - 24,
      (sz) => `500 ${sz}px ${SANS}`,
      bodyLen > 240 ? 26 : 30,
      19,
      maxBodyLines,
      1.44
    );
    bodyBlockH = bodyFit.height;
  } else {
    // Primary statement (Hadith, prose wisdom, or verse translation without Arabic)
    const maxBoxLines = bodyLen > 450 ? 14 : bodyLen > 260 ? 11 : 9;
    bodyFit = fitCanvasTextBlock(
      ctx,
      cleanBody,
      contentMaxW - 86,
      (sz) => (bodyLen > 320 ? `500 ${sz}px ${SANS}` : `600 ${sz}px ${SERIF}`),
      bodyLen > 320 ? 28 : 35,
      19,
      maxBoxLines,
      1.45
    );
    bodyBlockH = bodyFit.height + 64;
  }

  // Measure Optional Bottom Callout Box (Sharh / Translator Note) if space comfortably allows
  const gapBeforeNote = 26;
  const usedBeforeNote =
    verseBoxH +
    gapAfterVerse +
    (translitFit ? translitFit.height + gapAfterTranslit : 0) +
    bodyBlockH;
  const remainingForNote = availH - usedBeforeNote - gapBeforeNote;

  let noteFit: FittedTextBlock | null = null;
  let noteBoxH = 0;
  if (cleanNote && remainingForNote >= 114) {
    const maxNoteLines = remainingForNote >= 152 ? 3 : 2;
    const candidate = fitCanvasTextBlock(
      ctx,
      cleanNote,
      contentMaxW - 64,
      (sz) => `400 ${sz}px ${SANS}`,
      21,
      18,
      maxNoteLines,
      1.38
    );
    const boxH = candidate.height + (noteLabel ? 64 : 40);
    if (boxH <= remainingForNote) {
      noteFit = candidate;
      noteBoxH = boxH;
    }
  }

  const totalContentH =
    usedBeforeNote + (noteFit ? gapBeforeNote + noteBoxH : 0);

  let curY = bodyTop + Math.max(0, Math.round((availH - totalContentH) * 0.46));

  // --- Render Featured Quote / Arabic Box ---
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

    const barW = 7;
    const barX = isArabicFeatured ? boxX + boxW - barW - 14 : boxX + 14;
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

    if (!isArabicFeatured) {
      ctx.font = `700 84px ${SERIF}`;
      ctx.fillStyle = isDay
        ? 'rgba(21, 133, 9, 0.10)'
        : 'rgba(251, 191, 36, 0.11)';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('“', boxX + 28, curY + 4);
    }

    ctx.font = isArabicFeatured
      ? `700 ${verseFit.fontSize}px ${ARABIC}`
      : `italic 600 ${verseFit.fontSize}px ${SERIF}`;
    ctx.fillStyle = isDay ? '#0c4703' : '#fef3c7';
    ctx.direction = isArabicFeatured ? 'rtl' : 'ltr';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const textCenterX = W / 2 + (isArabicFeatured ? -4 : 4);
    const verseStartY =
      curY + Math.round((verseBoxH - verseFit.height) / 2) + (isArabicFeatured ? -2 : 0);
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

  // --- Render Optional Transliteration (Duas) ---
  if (translitFit) {
    ctx.save();
    ctx.font = `italic 600 ${translitFit.fontSize}px ${SANS}`;
    ctx.fillStyle = isDay ? '#158509' : '#6ee7b7';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let i = 0; i < translitFit.lines.length; i++) {
      ctx.fillText(translitFit.lines[i], W / 2, curY + i * translitFit.lineHeight);
    }
    ctx.restore();
    curY += translitFit.height + gapAfterTranslit;
  }

  // --- Render Main Body ---
  if (hasFeatured) {
    ctx.save();
    ctx.font = `500 ${bodyFit.fontSize}px ${SANS}`;
    ctx.fillStyle = isDay ? '#1e293b' : '#f1f5f9';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let i = 0; i < bodyFit.lines.length; i++) {
      ctx.fillText(bodyFit.lines[i], W / 2, curY + i * bodyFit.lineHeight);
    }
    ctx.restore();
    curY += bodyBlockH;
  } else {
    const boxX = cardX + innerPadX;
    const boxW = contentMaxW;
    ctx.save();
    drawRoundedRect(ctx, boxX, curY, boxW, bodyBlockH, 28);
    const qBg = ctx.createLinearGradient(boxX, curY, boxX + boxW, curY + bodyBlockH);
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

    const barGrad = ctx.createLinearGradient(
      boxX + 14,
      curY + 22,
      boxX + 14,
      curY + bodyBlockH - 22
    );
    if (isDay) {
      barGrad.addColorStop(0, '#158509');
      barGrad.addColorStop(1, '#d99b1e');
    } else {
      barGrad.addColorStop(0, '#fbbf24');
      barGrad.addColorStop(1, '#10b981');
    }
    drawRoundedRect(ctx, boxX + 14, curY + 22, 7, bodyBlockH - 44, 4);
    ctx.fillStyle = barGrad;
    ctx.fill();

    ctx.font = `700 92px ${SERIF}`;
    ctx.fillStyle = isDay
      ? 'rgba(21, 133, 9, 0.10)'
      : 'rgba(251, 191, 36, 0.11)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('“', boxX + 30, curY + 4);

    ctx.font =
      bodyLen > 320
        ? `500 ${bodyFit.fontSize}px ${SANS}`
        : `600 ${bodyFit.fontSize}px ${SERIF}`;
    ctx.fillStyle = isDay ? '#0f172a' : '#f8fafc';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const boxStartY = curY + Math.round((bodyBlockH - bodyFit.height) / 2);
    for (let i = 0; i < bodyFit.lines.length; i++) {
      ctx.fillText(bodyFit.lines[i], W / 2 + 4, boxStartY + i * bodyFit.lineHeight);
    }
    ctx.restore();
    curY += bodyBlockH;
  }

  // --- Render Optional Bottom Callout Box ---
  if (noteFit) {
    curY += gapBeforeNote;
    const sX = cardX + innerPadX;
    const sW = contentMaxW;

    ctx.save();
    drawRoundedRect(ctx, sX, curY, sW, noteBoxH, 24);
    ctx.fillStyle = isDay ? '#f8fafc' : 'rgba(2, 14, 10, 0.52)';
    ctx.fill();
    ctx.strokeStyle = isDay ? '#e2e8f0' : 'rgba(16, 185, 129, 0.22)';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    let textTopY = curY + 20;
    if (noteLabel) {
      ctx.font = `700 16px ${SANS}`;
      ctx.fillStyle = isDay ? '#158509' : '#6ee7b7';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(`✦  ${noteLabel.toUpperCase()}`, W / 2, curY + 18);
      textTopY = curY + 46;
    }

    ctx.font = `400 ${noteFit.fontSize}px ${SANS}`;
    ctx.fillStyle = isDay ? '#475569' : '#cbd5e1';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let i = 0; i < noteFit.lines.length; i++) {
      ctx.fillText(noteFit.lines[i], W / 2, textTopY + i * noteFit.lineHeight);
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

  ctx.save();
  drawRoundedRect(ctx, iconX, iconY, iconSize, iconSize, 18);
  ctx.strokeStyle = 'rgba(253, 230, 138, 0.55)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  const brandTextX = iconX + iconSize + 20;
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 28px ${SERIF}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('Nurul Islam', brandTextX, footY + 23);

  ctx.fillStyle = isDay ? '#d0f39f' : '#fde68a';
  ctx.font = `600 18px ${SANS}`;
  ctx.fillText(footerSectionTitle, brandTextX, footY + 60);

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

/**
 * Shares or saves a rendered PNG card cleanly across Android WebView, Linux Desktop wrapper,
 * mobile Web Share API, and standard desktop browser download.
 */
export async function shareOrSavePngCard(params: {
  rendered: RenderedPngCard;
  fileName: string;
  shareTitle: string;
  caption: string;
}): Promise<{ method: 'android' | 'desktop' | 'webshare' | 'download'; savedPath?: string }> {
  const { rendered, fileName, shareTitle, caption } = params;
  const { dataUrl, blob } = rendered;

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
    if (ok) return { method: 'android' };
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
          return { method: 'desktop', savedPath: info.path };
        }
      }
    } catch {
      // Fall through to browser download
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
          title: shareTitle,
          text: caption,
          files: [file],
        });
        return { method: 'webshare' };
      } catch (err) {
        if ((err as { name?: string })?.name === 'AbortError') {
          return { method: 'webshare' };
        }
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
  return { method: 'download' };
}
