import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import {
  Search,
  BookOpen,
  ArrowLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  CheckCircle2,
  ChevronDown,
  CloudDownload,
  Headphones,
  Layers,
  Minus,
  Plus,
  RotateCcw,
  Share2,
  Sparkles,
  Type,
  X,
} from 'lucide-react';
import {
  Ayah,
  AyahVerseTiming,
  AyahWord,
  Bookmark as BookmarkType,
  SurahDetail,
  TranslationId,
  TranslationOption,
} from '../../types';
import { ALL_SURAHS, PRELOADED_SURAHS, getLocalizedSurahMeta } from '../../data/surahs';
import {
  DEFAULT_RECITER_ID,
  QURAN_RECITERS,
  QuranReciterId,
  getReciterAyahAudioCandidates,
  getReciterById,
  loadSelectedReciterId,
  saveSelectedReciterId,
} from '../../data/quranReciters';
import {
  QURAN_JUZ_LIST,
  LastReadState,
  loadLastRead,
  saveLastRead,
  loadCompletedSurahs,
  saveCompletedSurahs,
  loadOfflineSurah,
  saveOfflineSurah,
  removeOfflineSurah,
  isSurahSavedOffline,
  getAllOfflineSavedSurahNumbers,
} from '../../data/juz';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { cyrillicToLatinUz, latinToCyrillicUz } from '../../utils/uzbekScript';
import {
  getCachedReciterTimingAsync,
  getCachedSurahAsync,
  getCachedSurahSync,
  getCachedSurahWordsAsync,
  putCachedReciterTimingAsync,
  putCachedSurahAsync,
  putCachedSurahWordsAsync,
} from '../../utils/surahIdbCache';
import {
  hasNativeQuranAudioBridge,
  getNativeAudioState,
  getFullSurahAudioCandidates,
  nativeLoadAndPlay,
  nativeTogglePlayPause,
  nativeJumpToAyah,
  nativeSeekMs,
  nativeStopAudio,
  isNativeAudioDownloaded,
  downloadNativeSurahAudio,
  removeNativeSurahAudio,
  getAllDownloadProgress,
  subscribeAllAudioDownloads,
  subscribeNativeAudioState,
  AudioDownloadProgress,
  NativeQuranAudioState,
} from '../../utils/nativeQuranAudio';
import {
  buildSurahDetailFromLocal,
  getLocalSurahRawSync,
  loadLocalSurahRaw,
} from '../../utils/localQuranData';
import {
  downloadWebSurahAudio,
  getWebAudioDownloadSnapshot,
  isWebAudioDownloaded,
  removeWebSurahAudio,
  subscribeWebAudioDownloads,
} from '../../utils/webOfflineAudio';
import { webQuranPlayer } from '../../utils/webQuranPlayer';
import { copyTextSafely } from '../../utils/clipboard';
import {
  generateNurulIslamShareCard,
  shareOrSavePngCard,
} from '../../utils/shareCardGenerator';

interface QuranTabProps {
  initialSurahNumber?: number | null;
  initialAyahNumber?: number | null;
  backButtonLabel?: string;
  onCloseSurahDetail?: () => void;
  onSurahDetailActiveChange?: (isActive: boolean) => void;
  selectedTranslation: TranslationId;
  onChangeTranslation: (tr: TranslationId) => void;
  bookmarks: BookmarkType[];
  onToggleBookmark: (surahNumber: number, surahName: string, ayahNumber: number) => void;
}

export const TRANSLATION_OPTIONS: TranslationOption[] = [
  { id: 'uz_mansur', name: "O'zbekcha — Lotin (Alouddin Mansur)", language: "O'zbek (Lotin)", author: 'Alouddin Mansur' },
  { id: 'uz_cyr', name: 'Ўзбекча — Кирилл (Алоуддин Мансур)', language: 'Ўзбек (Кирилл)', author: 'Алоуддин Мансур' },
  { id: 'en_sahih', name: 'English (Sahih International)', language: 'English', author: 'Sahih International' },
  { id: 'ru_kuliev', name: 'Русский (Эльмир Кулиев)', language: 'Русский', author: 'Эльмир Кулиев' },
  { id: 'en_yusufali', name: 'English (Abdullah Yusuf Ali)', language: 'English (Yusuf Ali)', author: 'A. Yusuf Ali' },
  { id: 'ur_jalandhry', name: 'Urdu (Fateh Muhammad Jalandhry)', language: 'Urdu', author: 'Jalandhry' },
  { id: 'fr_hamidullah', name: 'Français (Muhammad Hamidullah)', language: 'Français', author: 'Hamidullah' },
  { id: 'id_indonesian', name: 'Bahasa Indonesia (Kemenag)', language: 'Indonesian', author: 'Kemenag' },
];

function formatAudioTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getAyahTranslation(ayah: Ayah, selectedTranslation: TranslationId): string {
  if (selectedTranslation === 'uz_cyr') {
    if (ayah.translations?.uz_cyr) return ayah.translations.uz_cyr;
    if (ayah.translations?.uz_mansur) return latinToCyrillicUz(ayah.translations.uz_mansur);
  }
  return ayah.translations?.[selectedTranslation] || ayah.translation;
}

function getAyahAudioCandidates(
  surahNumber: number,
  ayah: Ayah,
  reciterId: QuranReciterId = DEFAULT_RECITER_ID
): string[] {
  return getReciterAyahAudioCandidates(reciterId, surahNumber, ayah.numberInSurah, ayah.number);
}

function getSurahTotalDurationSec(surah: SurahDetail | null): number {
  if (!surah) return 0;
  if (surah.audioDurationMs && surah.audioDurationMs > 0) {
    return surah.audioDurationMs / 1000;
  }
  if (surah.verseTimings && surah.verseTimings.length > 0) {
    return surah.verseTimings[surah.verseTimings.length - 1].timestampToMs / 1000;
  }
  return Math.max(surah.ayahs.length * 6, 1);
}

/**
 * Resolve the active Ayah timing at targetMs without jumping to the last ayah
 * during inter-ayah breath pauses or opening silence (e.g., Yasser Ad-Dussary gaps).
 */
function findVerseTimingAtMs(
  timings: AyahVerseTiming[] | undefined,
  targetMs: number
): AyahVerseTiming | undefined {
  if (!timings || timings.length === 0) return undefined;
  if (targetMs <= timings[0].timestampFromMs) return timings[0];
  for (let i = 0; i < timings.length; i += 1) {
    const vt = timings[i];
    if (targetMs >= vt.timestampFromMs && targetMs <= vt.timestampToMs) {
      return vt;
    }
    if (targetMs < vt.timestampFromMs) {
      return timings[Math.max(0, i - 1)];
    }
  }
  return timings[timings.length - 1];
}

function findWordInTimingAtAbsMs(timing: AyahVerseTiming, absMs: number): number | null {
  const segs = timing.segments;
  if (!segs || segs.length === 0) return 1;

  if (absMs <= segs[0][1]) {
    return segs[0][0];
  }

  // Prefer the latest matching segment if adjacent intervals overlap slightly
  let exactPos: number | null = null;
  for (let i = 0; i < segs.length; i += 1) {
    const seg = segs[i];
    if (absMs >= seg[1] && absMs <= seg[2]) {
      exactPos = seg[0];
    }
  }
  if (exactPos !== null) return exactPos;

  // Hold the most recently started word across short intra-ayah breath pauses
  let nearest: [number, number, number] | null = null;
  for (let i = 0; i < segs.length; i += 1) {
    const seg = segs[i];
    if (seg[1] <= absMs) {
      nearest = seg;
    } else {
      break;
    }
  }
  return nearest ? nearest[0] : segs[0][0];
}

const STANDALONE_QURAN_MARK_RE = /^[\u06D6-\u06ED\u06DD\u06DE\u06E9]+$/;

/**
 * Splits an Ayah into Uthmani word tokens while merging standalone pause/waqf signs (ۚ, ۖ, ۞, etc.)
 * with their adjacent word so offline word indices match Quran.com segments 1:1 and never create extra gaps.
 */
function getAyahWordsList(ayah: Ayah): AyahWord[] {
  if (ayah.words && ayah.words.length > 0) {
    return ayah.words;
  }
  const rawTokens = ayah.text.trim().split(/\s+/).filter(Boolean);
  const merged: string[] = [];
  let pendingPrefix = '';

  for (const tok of rawTokens) {
    if (tok === '۞') {
      pendingPrefix = pendingPrefix ? `${pendingPrefix} ${tok}` : tok;
      continue;
    }
    if (STANDALONE_QURAN_MARK_RE.test(tok) && merged.length > 0) {
      merged[merged.length - 1] = `${merged[merged.length - 1]}\u00A0${tok}`;
      continue;
    }
    const finalTok = pendingPrefix ? `${pendingPrefix}\u00A0${tok}` : tok;
    pendingPrefix = '';
    merged.push(finalTok);
  }
  if (pendingPrefix && merged.length > 0) {
    merged[0] = `${pendingPrefix}\u00A0${merged[0]}`;
  }
  return merged.map((text, idx) => ({ position: idx + 1, text }));
}

function resolveProportionalWord(surah: SurahDetail, ayahNum: number, frac: number): number | null {
  const clampedFrac = Math.min(0.999, Math.max(0, frac));
  const ayahObj = surah.ayahs.find((a) => a.numberInSurah === ayahNum);
  if (!ayahObj) return null;
  const wordsList = getAyahWordsList(ayahObj);
  if (wordsList.length === 0) return null;

  const weights = wordsList.map((w) => Math.max(2, w.text.length));
  const totalWeight = weights.reduce((s, w) => s + w, 0);
  const targetWeight = clampedFrac * totalWeight;
  let acc = 0;
  for (let i = 0; i < wordsList.length; i += 1) {
    acc += weights[i];
    if (targetWeight <= acc) return wordsList[i].position;
  }
  return wordsList[wordsList.length - 1].position;
}

interface QdcAudioResponse {
  audio_files?: Array<{
    audio_url?: string;
    duration?: number;
    verse_timings?: Array<{
      verse_key: string;
      timestamp_from: number;
      timestamp_to: number;
      segments?: number[][];
    }>;
  }>;
}

interface QdcVersesResponse {
  verses?: Array<{
    verse_number: number;
    words?: Array<{
      position: number;
      char_type_name: string;
      text_uthmani?: string;
      text?: string;
    }>;
  }>;
}

async function fetchSurahAudioAndWords(
  surahNumber: number,
  reciterId: QuranReciterId = DEFAULT_RECITER_ID
): Promise<{
  fullAudioUrl?: string;
  audioDurationMs?: number;
  verseTimings?: AyahVerseTiming[];
  wordsByAyah: Record<number, AyahWord[]>;
}> {
  // Check local on-device IndexedDB caches first (timings per Qori + shared Uthmani words per Surah)
  const [cachedTiming, cachedWords] = await Promise.all([
    getCachedReciterTimingAsync(surahNumber, reciterId),
    getCachedSurahWordsAsync(surahNumber),
  ]);

  const hasTiming = Boolean(cachedTiming?.verseTimings && cachedTiming.verseTimings.length > 0);
  const existingWords =
    cachedWords && Object.keys(cachedWords).length > 0
      ? cachedWords
      : cachedTiming?.wordsByAyah && Object.keys(cachedTiming.wordsByAyah).length > 0
      ? cachedTiming.wordsByAyah
      : null;

  if (hasTiming && existingWords) {
    return {
      fullAudioUrl: cachedTiming!.fullAudioUrl,
      audioDurationMs: cachedTiming!.audioDurationMs,
      verseTimings: cachedTiming!.verseTimings,
      wordsByAyah: existingWords,
    };
  }

  const [audioRes, wordsRes] = await Promise.allSettled([
    hasTiming
      ? Promise.resolve(null)
      : fetch(
          `https://api.qurancdn.com/api/qdc/audio/reciters/${reciterId}/audio_files?chapter=${surahNumber}&segments=true`
        ),
    existingWords
      ? Promise.resolve(null)
      : fetch(
          `https://api.qurancdn.com/api/qdc/verses/by_chapter/${surahNumber}?words=true&word_fields=text_uthmani&per_page=300`
        ),
  ]);

  let fullAudioUrl: string | undefined = cachedTiming?.fullAudioUrl;
  let audioDurationMs: number | undefined = cachedTiming?.audioDurationMs;
  let verseTimings: AyahVerseTiming[] | undefined = cachedTiming?.verseTimings;

  if (!hasTiming && audioRes.status === 'fulfilled' && audioRes.value && audioRes.value.ok) {
    const audioJson = (await audioRes.value.json()) as QdcAudioResponse;
    const file = audioJson.audio_files?.[0];
    if (file?.verse_timings && file.verse_timings.length > 0) {
      fullAudioUrl = file.audio_url;
      audioDurationMs = file.duration;
      verseTimings = file.verse_timings.map((vt) => {
        const parts = vt.verse_key.split(':');
        const ayahNumber = Number(parts[1]) || 1;
        const cleanSegments: [number, number, number][] = [];
        for (const seg of vt.segments || []) {
          if (
            Array.isArray(seg) &&
            seg.length >= 3 &&
            typeof seg[0] === 'number' &&
            typeof seg[1] === 'number' &&
            typeof seg[2] === 'number' &&
            seg[0] >= 1 &&
            Number.isFinite(seg[1]) &&
            Number.isFinite(seg[2])
          ) {
            const startMs = Math.min(seg[1], seg[2]);
            const endMs = Math.max(seg[1], seg[2]);
            cleanSegments.push([seg[0], startMs, endMs]);
          }
        }
        cleanSegments.sort((a, b) => a[1] - b[1]);
        return {
          verseKey: vt.verse_key,
          ayahNumber,
          timestampFromMs: vt.timestamp_from,
          timestampToMs: vt.timestamp_to,
          segments: cleanSegments,
        };
      });
    }
  }

  let wordsByAyah: Record<number, AyahWord[]> = existingWords || {};
  if (!existingWords && wordsRes.status === 'fulfilled' && wordsRes.value && wordsRes.value.ok) {
    const wordsJson = (await wordsRes.value.json()) as QdcVersesResponse;
    const built: Record<number, AyahWord[]> = {};
    for (const v of wordsJson.verses || []) {
      built[v.verse_number] = (v.words || [])
        .filter((w) => w.char_type_name === 'word')
        .map((w) => ({
          position: w.position,
          text: w.text_uthmani || w.text || '',
        }));
    }
    if (Object.keys(built).length > 0) {
      wordsByAyah = built;
      void putCachedSurahWordsAsync(surahNumber, built);
    }
  }

  if (!hasTiming && verseTimings && verseTimings.length > 0) {
    void putCachedReciterTimingAsync(surahNumber, {
      reciterId,
      fullAudioUrl,
      audioDurationMs,
      verseTimings,
    });
  }

  return { fullAudioUrl, audioDurationMs, verseTimings, wordsByAyah };
}

function fetchWithTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => window.setTimeout(() => resolve(null), timeoutMs)),
  ]);
}

const ARABIC_FONT_SIZE_KEY = 'nq_quran_arabic_font_size';
const TRANS_FONT_SIZE_KEY = 'nq_quran_trans_font_size';
const MUSHAF_BOOK_MODE_KEY = 'nq_quran_mushaf_book_mode';
const DEFAULT_ARABIC_FONT_SIZE = 26;
const DEFAULT_TRANS_FONT_SIZE = 14;
const MIN_ARABIC_FONT_SIZE = 20;
const MAX_ARABIC_FONT_SIZE = 44;
const MIN_TRANS_FONT_SIZE = 12;
const MAX_TRANS_FONT_SIZE = 24;

const ARABIC_INDIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
function toArabicIndicNumber(n: number): string {
  return String(Math.max(0, Math.trunc(n)))
    .split('')
    .map((ch) => ARABIC_INDIC_DIGITS[Number(ch)] ?? ch)
    .join('');
}

function loadSavedFontSize(key: string, fallback: number, min: number, max: number): number {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = Number(raw);
      if (Number.isFinite(parsed)) {
        return Math.max(min, Math.min(max, Math.round(parsed)));
      }
    }
  } catch {
    // ignore
  }
  return fallback;
}

interface AyahCardProps {
  ayah: Ayah;
  surahNumber: number;
  surahName: string;
  selectedTranslation: TranslationId;
  arabicFontSize: number;
  transFontSize: number;
  isDay: boolean;
  isActive: boolean;
  isHighlighted: boolean;
  highlightBadgeLabel?: string;
  isPlayingThis: boolean;
  activeWordPos: number | null;
  isBookmarked: boolean;
  isCopied: boolean;
  isSharing: boolean;
  onPlayAyah: (ayahNum: number) => void;
  onTogglePlayPause: () => void;
  onCopyAyah: (ayah: Ayah) => void;
  onShareAyah: (ayah: Ayah) => void;
  onToggleBookmark: (surahNumber: number, surahName: string, ayahNumber: number) => void;
}

const AyahCard = React.memo<AyahCardProps>(
  ({
    ayah,
    surahNumber,
    surahName,
    selectedTranslation,
    arabicFontSize,
    transFontSize,
    isDay,
    isActive,
    isHighlighted,
    highlightBadgeLabel,
    isPlayingThis,
    activeWordPos,
    isBookmarked,
    isCopied,
    isSharing,
    onPlayAyah,
    onTogglePlayPause,
    onCopyAyah,
    onShareAyah,
    onToggleBookmark,
  }) => {
    const transText = getAyahTranslation(ayah, selectedTranslation);
    const renderWords = getAyahWordsList(ayah);

    return (
      <div
        id={`ayah-${ayah.numberInSurah}`}
        onClick={() => onPlayAyah(ayah.numberInSurah)}
        className={`${isActive || isHighlighted ? '' : 'nq-ayah-card '}p-4 rounded-2xl border cursor-pointer transition-all duration-300 active:scale-[0.995] ${
          isActive
            ? isDay
              ? 'bg-[#eef9ea] border-[#158509] shadow-md ring-1 ring-[#158509]/30'
              : 'bg-emerald-950/90 border-amber-400 shadow-lg'
            : isHighlighted
            ? isDay
              ? 'bg-amber-50/95 border-amber-400 shadow-md ring-2 ring-amber-400/50'
              : 'bg-amber-950/40 border-amber-400 shadow-lg ring-2 ring-amber-400/45'
            : isDay
            ? 'bg-white border-[#dde3ea] shadow-xs'
            : 'bg-slate-900/75 border-emerald-900/40'
        }`}
      >
        <div
          className={`flex items-center justify-between pb-2.5 border-b text-xs ${
            isHighlighted
              ? isDay
                ? 'border-amber-200/80'
                : 'border-amber-500/30'
              : isDay
              ? 'border-slate-100'
              : 'border-emerald-900/30'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`w-7 h-7 rounded-xl font-bold text-xs flex items-center justify-center font-mono shrink-0 ${
                isActive
                  ? isDay
                    ? 'bg-[#158509] text-white nq-keep-dark'
                    : 'bg-amber-400 text-slate-950'
                  : isHighlighted
                  ? isDay
                    ? 'bg-amber-500 text-white nq-keep-dark'
                    : 'bg-amber-400 text-slate-950'
                  : isDay
                  ? 'bg-[#eef9ea] text-[#0c4703] border border-[#cde8c3]'
                  : 'bg-emerald-950 text-amber-300 border border-emerald-800/50'
              }`}
            >
              {ayah.numberInSurah}
            </span>
            <span className={`text-[11px] font-medium shrink-0 ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
              {surahNumber}:{ayah.numberInSurah}
            </span>
            {isHighlighted && highlightBadgeLabel && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold truncate ${
                  isDay
                    ? 'bg-amber-200/80 text-amber-950 border border-amber-300'
                    : 'bg-amber-400/20 text-amber-200 border border-amber-400/40'
                }`}
              >
                <BookmarkCheck className="w-3 h-3 shrink-0" />
                <span className="truncate">{highlightBadgeLabel}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (isActive) {
                  onTogglePlayPause();
                } else {
                  onPlayAyah(ayah.numberInSurah);
                }
              }}
              className={`p-2 rounded-xl transition ${
                isPlayingThis
                  ? isDay
                    ? 'bg-[#158509] text-white nq-keep-dark'
                    : 'bg-amber-400 text-slate-950'
                  : isDay
                  ? 'bg-[#f1f5f9] text-[#0c4703] hover:bg-[#e1f5db]'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
              aria-label="Play Ayah"
            >
              {isPlayingThis ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              disabled={isSharing}
              onClick={(e) => {
                e.stopPropagation();
                onShareAyah(ayah);
              }}
              className={`p-2 rounded-xl transition disabled:opacity-50 ${
                isDay
                  ? 'bg-[#f1f5f9] text-[#0c4703] hover:bg-[#e1f5db]'
                  : 'bg-slate-800 text-amber-300 hover:text-amber-200'
              }`}
              aria-label="Share Ayah Card"
            >
              <Share2 className={`w-3.5 h-3.5 ${isSharing ? 'animate-pulse' : ''}`} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onCopyAyah(ayah);
              }}
              className={`p-2 rounded-xl transition ${
                isDay
                  ? 'bg-[#f1f5f9] text-slate-600 hover:text-[#0c4703]'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
              aria-label="Copy Ayah"
            >
              {isCopied ? (
                <Check className="w-3.5 h-3.5 text-[#158509]" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(surahNumber, surahName, ayah.numberInSurah);
              }}
              className={`p-2 rounded-xl transition ${
                isBookmarked
                  ? isDay
                    ? 'bg-[#eef9ea] text-[#158509]'
                    : 'bg-amber-500/20 text-amber-300'
                  : isDay
                  ? 'bg-[#f1f5f9] text-slate-600 hover:text-[#0c4703]'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
              aria-label="Bookmark Ayah"
            >
              {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div className="py-3 text-right" dir="rtl">
          <p
            style={{ fontSize: `${arabicFontSize}px`, lineHeight: 2.05 }}
            className={`font-arabic font-normal transition-[font-size] duration-150 ${
              isDay ? 'text-slate-900' : 'text-amber-50'
            }`}
          >
            {renderWords.map((word, idx) => {
              const isWordActive = isActive && activeWordPos === word.position;
              return (
                <React.Fragment key={word.position}>
                  <span
                    className={`rounded-md px-0.5 -mx-0.5 transition-colors duration-100 ${
                      isWordActive
                        ? isDay
                          ? 'bg-[#158509] text-white nq-keep-dark'
                          : 'bg-amber-400/35 text-amber-200'
                        : ''
                    }`}
                  >
                    {word.text}
                  </span>
                  {idx < renderWords.length - 1 ? ' ' : ''}
                </React.Fragment>
              );
            })}
          </p>
        </div>

        <p
          style={{ fontSize: `${transFontSize}px`, lineHeight: 1.62 }}
          className={`transition-[font-size] duration-150 ${
            isDay ? 'text-slate-700' : 'text-slate-300'
          }`}
        >
          {transText}
        </p>
      </div>
    );
  }
);
AyahCard.displayName = 'AyahCard';

export const QuranTab: React.FC<QuranTabProps> = ({
  initialSurahNumber,
  initialAyahNumber,
  backButtonLabel,
  onCloseSurahDetail,
  onSurahDetailActiveChange,
  selectedTranslation,
  bookmarks,
  onToggleBookmark,
}) => {
  const { isDay } = useTheme();
  const { language, t } = useLanguage();
  const isNative = Capacitor.isNativePlatform();

  const [activeSurahNumber, setActiveSurahNumber] = useState<number | null>(initialSurahNumber || null);
  const [activeSurahData, setActiveSurahData] = useState<SurahDetail | null>(null);
  const [isLoadingSurah, setIsLoadingSurah] = useState(false);
  const [highlightedAyah, setHighlightedAyah] = useState<number | null>(
    initialAyahNumber && initialAyahNumber >= 1 ? initialAyahNumber : null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'juz' | 'bookmarks'>('all');
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);
  const [sharingAyah, setSharingAyah] = useState<number | null>(null);
  const [shareToast, setShareToast] = useState<string | null>(null);
  const [lastRead, setLastRead] = useState<LastReadState | null>(loadLastRead);
  const [completedSurahs, setCompletedSurahs] = useState<number[]>(loadCompletedSurahs);
  const [offlineSavedSet, setOfflineSavedSet] = useState<Set<number>>(() =>
    getAllOfflineSavedSurahNumbers(selectedTranslation)
  );
  const [isCurrentSavedOffline, setIsCurrentSavedOffline] = useState(false);
  const [downloadMap, setDownloadMap] = useState<Record<number, AudioDownloadProgress>>(() =>
    hasNativeQuranAudioBridge() ? getAllDownloadProgress() : getWebAudioDownloadSnapshot()
  );
  const [visibleAyahCount, setVisibleAyahCount] = useState(35);

  // Audio playback state (supports full-Surah continuous audio + word highlighting + 2 Qori reciters)
  const [selectedReciterId, setSelectedReciterId] = useState<QuranReciterId>(loadSelectedReciterId);
  const [isReciterPickerOpen, setIsReciterPickerOpen] = useState(false);
  const [isFontSheetOpen, setIsFontSheetOpen] = useState(false);
  const [isMushafBookMode, setIsMushafBookMode] = useState<boolean>(false);
  const [bookPageIdx, setBookPageIdx] = useState<number>(0);
  const bookTouchStartRef = useRef<{ x: number; y: number } | null>(null);
  const bookPageScrollRef = useRef<HTMLDivElement | null>(null);
  const lastAutoTurnedAyahRef = useRef<string | null>(null);
  const [arabicFontSize, setArabicFontSize] = useState<number>(() =>
    loadSavedFontSize(ARABIC_FONT_SIZE_KEY, DEFAULT_ARABIC_FONT_SIZE, MIN_ARABIC_FONT_SIZE, MAX_ARABIC_FONT_SIZE)
  );
  const [transFontSize, setTransFontSize] = useState<number>(() =>
    loadSavedFontSize(TRANS_FONT_SIZE_KEY, DEFAULT_TRANS_FONT_SIZE, MIN_TRANS_FONT_SIZE, MAX_TRANS_FONT_SIZE)
  );
  const [currentPlayingAyah, setCurrentPlayingAyah] = useState<number | null>(null);
  const [activeWordPos, setActiveWordPos] = useState<number | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  const selectedReciterIdRef = useRef<QuranReciterId>(selectedReciterId);
  selectedReciterIdRef.current = selectedReciterId;
  const activeReciter = getReciterById(selectedReciterId);

  const versesScrollRef = useRef<HTMLDivElement | null>(null);
  const ayahSentinelRef = useRef<HTMLDivElement | null>(null);
  const directoryListRef = useRef<HTMLDivElement | null>(null);
  const savedListScrollTopRef = useRef<number>(0);
  const tappedListSurahRef = useRef<number | null>(null);
  const shouldRestoreListScrollRef = useRef<boolean>(false);
  const prevTranslationRef = useRef<TranslationId>(selectedTranslation);
  const activeSurahRef = useRef<SurahDetail | null>(null);
  const loadedSurahIdRef = useRef<number | null>(null);
  const lastNativeSurahRef = useRef<number>(0);
  const currentAyahRef = useRef<number | null>(null);
  const activeWordRef = useRef<number | null>(null);
  const lastScrolledAyahKeyRef = useRef<string | null>(null);
  const rafRef = useRef<number | null>(null);
  const pendingAutoPlayRef = useRef<boolean>(false);
  const targetScrollAyahRef = useRef<number>(1);
  const playAyahRef = useRef<
    (
      ayahNum: number,
      offsetSec?: number,
      reciterOverrideId?: QuranReciterId,
      initialWordPos?: number,
      offsetFrac?: number
    ) => void
  >(() => {});
  const loadSurahRef = useRef<(surahNum: number, autoPlay?: boolean, targetAyah?: number) => void>(() => {});

  useEffect(() => {
    setOfflineSavedSet(getAllOfflineSavedSurahNumbers(selectedTranslation));
  }, [selectedTranslation]);

  useEffect(() => {
    if (activeSurahNumber) {
      setIsCurrentSavedOffline(isSurahSavedOffline(activeSurahNumber, selectedTranslation));
    } else {
      setIsCurrentSavedOffline(false);
    }
  }, [activeSurahNumber, selectedTranslation]);

  useEffect(() => {
    if (activeSurahNumber && currentPlayingAyah) {
      setLastRead(saveLastRead(activeSurahNumber, currentPlayingAyah));
      setVisibleAyahCount((prev) =>
        currentPlayingAyah + 10 > prev ? currentPlayingAyah + 25 : prev
      );
    }
  }, [activeSurahNumber, currentPlayingAyah]);

  // Incrementally reveal remaining ayahs on scroll for long surahs (Al-Baqara, etc.)
  useEffect(() => {
    const sentinel = ayahSentinelRef.current;
    const total = activeSurahData?.ayahs.length || 0;
    if (!sentinel || visibleAyahCount >= total) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisibleAyahCount((prev) => Math.min(total, prev + 35));
        }
      },
      { root: versesScrollRef.current, rootMargin: '320px 0px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [activeSurahData?.number, activeSurahData?.ayahs.length, visibleAyahCount]);

  // Scroll cleanly & reliably to target Ayah (when opening a Saved Bookmark, resuming, or jumping from Juz index)
  useEffect(() => {
    const target = targetScrollAyahRef.current;
    if (isLoadingSurah || !activeSurahData || activeSurahData.ayahs.length === 0 || target < 1) return;

    if (visibleAyahCount < target) {
      setVisibleAyahCount(Math.min(activeSurahData.ayahs.length, target + 15));
      return;
    }

    const scrollToTarget = (smooth: boolean): boolean => {
      const el = document.getElementById(`ayah-${target}`);
      if (!el) return false;
      const container = versesScrollRef.current;
      if (container && container.scrollHeight > container.clientHeight + 4) {
        const cRect = container.getBoundingClientRect();
        const eRect = el.getBoundingClientRect();
        const offsetInContainer = eRect.top - cRect.top + container.scrollTop;
        const targetTop =
          eRect.height > cRect.height - 28
            ? Math.max(0, offsetInContainer - 12)
            : Math.max(0, offsetInContainer - (cRect.height - eRect.height) / 2);
        container.scrollTo({ top: targetTop, behavior: smooth ? 'smooth' : 'auto' });
        return true;
      }
      if (target === 1) {
        container?.scrollTo({ top: 0, behavior: 'auto' });
        return true;
      }
      el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'center' });
      return Boolean(container && container.scrollHeight > container.clientHeight + 4);
    };

    let raf2 = 0;
    let settleTimer = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const moved = scrollToTarget(false);
        // Re-center once after Arabic webfont / layout paint settles
        settleTimer = window.setTimeout(() => {
          const settled = scrollToTarget(false);
          if (moved || settled) {
            targetScrollAyahRef.current = 0;
          }
        }, 160);
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.clearTimeout(settleTimer);
    };
  }, [activeSurahData, isLoadingSurah, visibleAyahCount, highlightedAyah]);

  useEffect(() => {
    activeSurahRef.current = activeSurahData;
    if (activeSurahData) {
      setAudioDuration(getSurahTotalDurationSec(activeSurahData));
    }
  }, [activeSurahData]);

  const stopRaf = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const prebufferAyah = useCallback(
    (surah: SurahDetail | null, ayahNum: number, reciterId: QuranReciterId) => {
      if (!surah || hasNativeQuranAudioBridge()) return;
      webQuranPlayer.prebufferAyah(surah.number, surah.ayahs, ayahNum, reciterId);
    },
    []
  );

  useEffect(() => {
    return () => {
      stopRaf();
    };
  }, [stopRaf]);

  // Smoothly auto-scroll the scrollable Surah container to keep the active ayah centered (once per ayah transition)
  useEffect(() => {
    if (currentPlayingAyah === null || !activeSurahData?.number) {
      lastScrolledAyahKeyRef.current = null;
      return;
    }
    const scrollKey = `${activeSurahData.number}:${currentPlayingAyah}`;
    if (lastScrolledAyahKeyRef.current === scrollKey) return;

    const rafId = requestAnimationFrame(() => {
      const el = document.getElementById(`ayah-${currentPlayingAyah}`);
      const container = versesScrollRef.current;
      if (!el) return;
      lastScrolledAyahKeyRef.current = scrollKey;
      if (container) {
        const cRect = container.getBoundingClientRect();
        const eRect = el.getBoundingClientRect();
        const offsetInContainer = eRect.top - cRect.top + container.scrollTop;
        const targetTop = Math.max(0, offsetInContainer - (cRect.height - eRect.height) / 2);
        container.scrollTo({ top: targetTop, behavior: 'smooth' });
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    return () => cancelAnimationFrame(rafId);
  }, [currentPlayingAyah, visibleAyahCount, activeSurahData?.number]);

  const resolveWordForAyahTime = useCallback(
    (
      surah: SurahDetail,
      ayahNum: number,
      localTimeMs: number,
      localDurMs: number,
      expectedReciterId: QuranReciterId
    ): number | null => {
      const hasMatchingTimings =
        surah.audioReciterId === expectedReciterId &&
        Boolean(surah.verseTimings && surah.verseTimings.length > 0);
      const timing = hasMatchingTimings
        ? surah.verseTimings?.find((vt) => vt.ayahNumber === ayahNum)
        : undefined;

      if (timing && timing.segments.length > 0 && timing.timestampToMs > timing.timestampFromMs) {
        const qdcSpanMs = timing.timestampToMs - timing.timestampFromMs;
        const safeTimeMs = Math.max(0, localTimeMs);
        // When per-ayah audio matches QDC span closely (same master with minor trailing silence),
        // use direct 1:1 real-time milliseconds so extra trailing silence never lags highlights.
        const useDirectMs =
          localDurMs <= 0 || !Number.isFinite(localDurMs) || Math.abs(localDurMs - qdcSpanMs) <= 2200;
        const absMs = useDirectMs
          ? Math.min(timing.timestampToMs, timing.timestampFromMs + safeTimeMs)
          : timing.timestampFromMs +
            Math.min(0.999, Math.max(0, safeTimeMs / localDurMs)) * qdcSpanMs;
        return findWordInTimingAtAbsMs(timing, absMs);
      }

      const frac =
        localDurMs > 0 && Number.isFinite(localDurMs)
          ? Math.min(0.999, Math.max(0, localTimeMs / localDurMs))
          : 0;
      return resolveProportionalWord(surah, ayahNum, frac);
    },
    []
  );

  const resolveWordForFullSurahMs = useCallback(
    (
      surah: SurahDetail,
      ayahNum: number,
      mappedMs: number,
      fallbackFrac: number,
      expectedReciterId: QuranReciterId
    ): number | null => {
      const hasMatchingTimings =
        surah.audioReciterId === expectedReciterId &&
        Boolean(surah.verseTimings && surah.verseTimings.length > 0);
      const timing = hasMatchingTimings
        ? surah.verseTimings?.find((vt) => vt.ayahNumber === ayahNum)
        : undefined;

      if (timing && timing.segments.length > 0 && timing.timestampToMs > timing.timestampFromMs) {
        // Stay unhighlighted while opening Bismillah / Isti'adhah plays before Ayah 1 begins
        if (mappedMs < timing.timestampFromMs - 150) {
          return null;
        }
        return findWordInTimingAtAbsMs(timing, mappedMs);
      }

      return resolveProportionalWord(surah, ayahNum, fallbackFrac);
    },
    []
  );

  // Cumulative overall progress + spoken word sync across the whole Surah
  const syncProgressAndWord = useCallback(
    (
      ayahNum: number,
      localTimeSec: number,
      localDurSec: number,
      reciterOverrideId?: QuranReciterId
    ) => {
      const surah = activeSurahRef.current;
      if (!surah) return;

      const expectedReciterId = reciterOverrideId ?? selectedReciterIdRef.current;
      const totalSec = getSurahTotalDurationSec(surah);
      setAudioDuration((prev) => (Math.abs(prev - totalSec) >= 0.25 ? totalSec : prev));

      const hasMatchingTimings =
        surah.audioReciterId === expectedReciterId &&
        Boolean(surah.verseTimings && surah.verseTimings.length > 0);
      const timing = hasMatchingTimings
        ? surah.verseTimings?.find((vt) => vt.ayahNumber === ayahNum)
        : undefined;
      const ayahSpanSec = timing
        ? Math.max(0.25, (timing.timestampToMs - timing.timestampFromMs) / 1000)
        : 0;
      const frac =
        localDurSec > 0 && Number.isFinite(localDurSec)
          ? Math.min(1, Math.max(0, localTimeSec / localDurSec))
          : ayahSpanSec > 0
          ? Math.min(1, Math.max(0, localTimeSec / ayahSpanSec))
          : 0;

      let nextOverallSec: number;
      if (timing) {
        const ayahStartSec = timing.timestampFromMs / 1000;
        const useDirect =
          localDurSec <= 0 ||
          !Number.isFinite(localDurSec) ||
          Math.abs(localDurSec - ayahSpanSec) <= 2.2;
        nextOverallSec = Math.min(
          totalSec,
          useDirect ? ayahStartSec + Math.min(ayahSpanSec, Math.max(0, localTimeSec)) : ayahStartSec + frac * ayahSpanSec
        );
      } else {
        const idx = Math.max(0, surah.ayahs.findIndex((a) => a.numberInSurah === ayahNum));
        const count = Math.max(1, surah.ayahs.length);
        nextOverallSec = Math.min(totalSec, ((idx + frac) / count) * totalSec);
      }
      setAudioCurrentTime((prev) => (Math.abs(prev - nextOverallSec) >= 0.08 ? nextOverallSec : prev));

      const nextWordPos = resolveWordForAyahTime(
        surah,
        ayahNum,
        localTimeSec * 1000,
        localDurSec * 1000,
        expectedReciterId
      );
      if (activeWordRef.current !== nextWordPos) {
        activeWordRef.current = nextWordPos;
        setActiveWordPos(nextWordPos);
      }
    },
    [resolveWordForAyahTime]
  );

  // Subscribe globally so background downloads persist across tab & surah switches (Android + Web/Desktop)
  useEffect(() => {
    const onMapUpdate = (map: Record<number, AudioDownloadProgress>) => {
      setDownloadMap(map);
      if (Object.values(map).some((v) => v.status === 'done')) {
        setOfflineSavedSet(getAllOfflineSavedSurahNumbers(selectedTranslation));
      }
    };
    return hasNativeQuranAudioBridge()
      ? subscribeAllAudioDownloads(onMapUpdate)
      : subscribeWebAudioDownloads(onMapUpdate);
  }, [selectedTranslation]);

  // Sync React UI with background native QuranAudioService
  const applyNativeState = useCallback(
    (st: NativeQuranAudioState) => {
      const currentSurah = activeSurahRef.current;
      const prevNativeSurah = lastNativeSurahRef.current;
      lastNativeSurahRef.current = st.active && st.surahNumber > 0 ? st.surahNumber : 0;

      if (
        currentSurah &&
        st.active &&
        st.surahNumber > 0 &&
        prevNativeSurah > 0 &&
        st.surahNumber !== prevNativeSurah &&
        st.surahNumber !== currentSurah.number &&
        !pendingAutoPlayRef.current &&
        loadedSurahIdRef.current === currentSurah.number
      ) {
        // Notification / mini-player actively switched to a different Surah while reader is open: follow it
        loadSurahRef.current(st.surahNumber, false, Math.max(1, st.ayahNumber || 1));
        return;
      }
      if (!currentSurah || !st.active || st.surahNumber !== currentSurah.number) {
        if (!st.active) {
          setIsAudioPlaying(false);
          setCurrentPlayingAyah(null);
          setActiveWordPos(null);
          currentAyahRef.current = null;
          activeWordRef.current = null;
        }
        return;
      }

      const playingReciterId: QuranReciterId =
        (st.reciterKey
          ? QURAN_RECITERS.find((r) => r.storageKey === st.reciterKey)?.id
          : undefined) ?? selectedReciterIdRef.current;

      if (st.fullSurahMode && st.durationMs > 0) {
        const posSec = Math.max(0, st.positionMs / 1000);
        const durSec = Math.max(1, st.durationMs / 1000);
        const clampedPos = Math.min(durSec, posSec);
        setAudioCurrentTime((prev) => (Math.abs(prev - clampedPos) >= 0.08 ? clampedPos : prev));
        setAudioDuration((prev) => (Math.abs(prev - durSec) >= 0.25 ? durSec : prev));

        const hasMatchingTimings =
          currentSurah.audioReciterId === playingReciterId &&
          Boolean(currentSurah.verseTimings && currentSurah.verseTimings.length > 0);
        const timingsEndMs = hasMatchingTimings
          ? currentSurah.verseTimings![currentSurah.verseTimings!.length - 1].timestampToMs
          : 0;
        let resolvedAyah = st.ayahNumber > 0 ? st.ayahNumber : 1;
        let resolvedFrac = 0;
        let mappedMs = st.positionMs;

        if (hasMatchingTimings && timingsEndMs > 0 && currentSurah.verseTimings) {
          const diffMs = st.durationMs - timingsEndMs;
          // Direct 1:1 clock when audio matches QDC master (e.g. Yasser Ad-Dussary mp3quran: 0..2.6s trailing silence)
          mappedMs =
            Math.abs(diffMs) <= 3500
              ? st.positionMs
              : diffMs > 3500
              ? Math.max(0, st.positionMs - diffMs)
              : (st.positionMs / st.durationMs) * timingsEndMs;
          const vt = findVerseTimingAtMs(currentSurah.verseTimings, mappedMs);
          if (vt) {
            resolvedAyah = vt.ayahNumber;
            const span = Math.max(1, vt.timestampToMs - vt.timestampFromMs);
            resolvedFrac = Math.min(1, Math.max(0, (mappedMs - vt.timestampFromMs) / span));
          }
        } else {
          const sliceMs = st.durationMs / Math.max(1, currentSurah.ayahs.length);
          const ayahStartMs = Math.max(0, resolvedAyah - 1) * sliceMs;
          resolvedFrac = sliceMs > 0 ? (st.positionMs - ayahStartMs) / sliceMs : 0;
        }

        const nextWord = resolveWordForFullSurahMs(
          currentSurah,
          resolvedAyah,
          mappedMs,
          resolvedFrac,
          playingReciterId
        );
        if (activeWordRef.current !== nextWord) {
          activeWordRef.current = nextWord;
          setActiveWordPos(nextWord);
        }

        if (currentAyahRef.current !== resolvedAyah) {
          currentAyahRef.current = resolvedAyah;
          setCurrentPlayingAyah(resolvedAyah);
        }
      } else if (st.ayahNumber > 0) {
        if (currentAyahRef.current !== st.ayahNumber) {
          currentAyahRef.current = st.ayahNumber;
          setCurrentPlayingAyah(st.ayahNumber);
        }
        if (!(st.isPreparing && st.positionMs <= 0 && (activeWordRef.current ?? 1) > 1)) {
          syncProgressAndWord(
            st.ayahNumber,
            Math.max(0, st.positionMs / 1000),
            Math.max(0, st.durationMs / 1000),
            playingReciterId
          );
        }
      }
      setIsAudioPlaying(Boolean(st.isPlaying));
    },
    [resolveWordForFullSurahMs, syncProgressAndWord]
  );

  useEffect(() => {
    if (hasNativeQuranAudioBridge()) {
      applyNativeState(getNativeAudioState());
      return subscribeNativeAudioState(applyNativeState);
    }
    applyNativeState(webQuranPlayer.getState());
    return webQuranPlayer.subscribe(applyNativeState);
  }, [applyNativeState, activeSurahData?.number]);

  // 60fps smooth progress animation & real-time word highlight loop
  useEffect(() => {
    if (!isAudioPlaying) {
      stopRaf();
      return;
    }

    if (hasNativeQuranAudioBridge()) {
      let lastPoll = 0;
      const tickNative = (ts: number) => {
        if (ts - lastPoll >= 50) {
          lastPoll = ts;
          applyNativeState(getNativeAudioState());
        }
        rafRef.current = requestAnimationFrame(tickNative);
      };
      rafRef.current = requestAnimationFrame(tickNative);
      return () => stopRaf();
    }

    const tick = () => {
      const ayahNum = currentAyahRef.current;
      if (ayahNum === null) return;
      const { currentTimeSec, durationSec } = webQuranPlayer.getLiveAudioTiming();
      if (!(currentTimeSec <= 0 && durationSec <= 0 && (activeWordRef.current ?? 1) > 1)) {
        syncProgressAndWord(ayahNum, currentTimeSec, durationSec);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => stopRaf();
  }, [isAudioPlaying, stopRaf, syncProgressAndWord, applyNativeState]);

  const startPlayingFromAyah = useCallback(
    (
      ayahNumberInSurah: number,
      offsetWithinAyahSec = 0,
      reciterOverrideId?: QuranReciterId,
      initialWordPos?: number,
      offsetWithinAyahFrac = 0
    ) => {
      const surah = activeSurahRef.current;
      if (!surah) return;
      const ayahObj = surah.ayahs.find((a) => a.numberInSurah === ayahNumberInSurah);
      if (!ayahObj) return;

      const reciterId = reciterOverrideId ?? selectedReciterIdRef.current;
      const reciter = getReciterById(reciterId);
      const urls = getAyahAudioCandidates(surah.number, ayahObj, reciterId);
      if (urls.length === 0) return;

      const resolvedInitWord = initialWordPos && initialWordPos >= 1 ? initialWordPos : 1;

      if (hasNativeQuranAudioBridge()) {
        const curNative = getNativeAudioState();
        const preferFullSurah = Boolean(reciter.preferFullSurahStream);
        currentAyahRef.current = ayahNumberInSurah;
        activeWordRef.current = resolvedInitWord;
        setCurrentPlayingAyah(ayahNumberInSurah);
        setActiveWordPos(resolvedInitWord);
        setIsAudioPlaying(true);

        const hasMatchingTimings =
          surah.audioReciterId === reciterId &&
          Boolean(surah.verseTimings && surah.verseTimings.length > 0);
        const vt = hasMatchingTimings
          ? surah.verseTimings!.find((v) => v.ayahNumber === ayahNumberInSurah)
          : undefined;

        let startFrac = -1;
        let seekOffsetMs = Math.round(offsetWithinAyahSec * 1000);

        if (preferFullSurah) {
          if (vt) {
            // Exact millisecond seek into the full-Surah master (preserves Bismillah on Ayah 1 when offset is 0)
            startFrac = -1;
            seekOffsetMs =
              ayahNumberInSurah === 1 && offsetWithinAyahSec <= 0
                ? 0
                : Math.max(0, Math.round(vt.timestampFromMs + offsetWithinAyahSec * 1000));
          } else {
            startFrac =
              surah.ayahs.length > 0
                ? Math.max(0, (ayahNumberInSurah - 1) / surah.ayahs.length)
                : 0;
          }
        } else {
          startFrac =
            surah.ayahs.length > 0
              ? Math.max(0, (ayahNumberInSurah - 1) / surah.ayahs.length)
              : 0;
          if (vt && hasMatchingTimings) {
            const totalMs =
              surah.audioDurationMs ||
              surah.verseTimings![surah.verseTimings!.length - 1].timestampToMs;
            if (totalMs > 0) {
              startFrac = Math.min(
                0.98,
                Math.max(0, (vt.timestampFromMs + offsetWithinAyahSec * 1000) / totalMs)
              );
            }
          }
        }

        const sameSurahAndReciter =
          curNative.active &&
          curNative.surahNumber === surah.number &&
          (!curNative.reciterKey || curNative.reciterKey === reciter.storageKey) &&
          Boolean(curNative.fullSurahMode) === preferFullSurah;

        if (sameSurahAndReciter) {
          nativeJumpToAyah(ayahNumberInSurah, startFrac, seekOffsetMs);
        } else {
          const loc = getLocalizedSurahMeta(
            surah.number,
            surah.englishName,
            surah.englishNameTranslation,
            language
          );
          const ayahPrefix =
            language === 'ru'
              ? 'Аят'
              : language === 'en'
              ? 'Ayah'
              : language === 'uz_cyr'
              ? 'Оят'
              : 'Oyat';
          const qdcFullUrl =
            surah.audioReciterId === reciterId ? surah.fullAudioUrl : undefined;
          nativeLoadAndPlay({
            surahNumber: surah.number,
            surahName: loc.name,
            reciterName: reciter.name,
            reciterKey: reciter.storageKey,
            everyAyahFolder: reciter.everyAyahFolder,
            mp3QuranBase: reciter.mp3QuranBase,
            preferFullSurah,
            ayahLabelPrefix: ayahPrefix,
            startAyahNumber: ayahNumberInSurah,
            startFraction: startFrac,
            seekOffsetMs,
            totalAyahs: surah.ayahs.length,
            fullUrls: getFullSurahAudioCandidates(surah.number, qdcFullUrl, reciterId),
            surahCatalog: ALL_SURAHS.map((s) => ({
              name: getLocalizedSurahMeta(
                s.number,
                s.englishName,
                s.englishNameTranslation,
                language
              ).name,
              ayahs: s.numberOfAyahs,
            })),
            ayahs: surah.ayahs.map((a) => ({
              ayahNumber: a.numberInSurah,
              urls: getAyahAudioCandidates(surah.number, a, reciterId),
            })),
          });
        }
        return;
      }

      const curWeb = webQuranPlayer.getState();
      currentAyahRef.current = ayahNumberInSurah;
      activeWordRef.current = resolvedInitWord;
      setCurrentPlayingAyah(ayahNumberInSurah);
      setActiveWordPos(resolvedInitWord);

      const sameWebSurahAndReciter =
        curWeb.active &&
        curWeb.surahNumber === surah.number &&
        curWeb.reciterKey === reciter.storageKey;

      if (sameWebSurahAndReciter) {
        webQuranPlayer.jumpToAyah(ayahNumberInSurah, offsetWithinAyahSec, offsetWithinAyahFrac);
      } else {
        const loc = getLocalizedSurahMeta(
          surah.number,
          surah.englishName,
          surah.englishNameTranslation,
          language
        );
        webQuranPlayer.loadAndPlay({
          surahNumber: surah.number,
          surahName: loc.name,
          reciterId,
          ayahs: surah.ayahs,
          startAyahNumber: ayahNumberInSurah,
          offsetSec: offsetWithinAyahSec,
          offsetFraction: offsetWithinAyahFrac,
        });
      }
    },
    [language]
  );

  useEffect(() => {
    playAyahRef.current = startPlayingFromAyah;
  }, [startPlayingFromAyah]);

  const handleTogglePlayPause = useCallback(() => {
    const surah = activeSurahRef.current;
    if (hasNativeQuranAudioBridge()) {
      const curNative = getNativeAudioState();
      const reciter = getReciterById(selectedReciterIdRef.current);
      if (
        curNative.active &&
        surah &&
        curNative.surahNumber === surah.number &&
        (!curNative.reciterKey || curNative.reciterKey === reciter.storageKey) &&
        Boolean(curNative.fullSurahMode) === Boolean(reciter.preferFullSurahStream)
      ) {
        nativeTogglePlayPause();
        setIsAudioPlaying(!curNative.isPlaying);
        return;
      }
      if (surah && surah.ayahs.length > 0) {
        playAyahRef.current(currentAyahRef.current ?? surah.ayahs[0].numberInSurah, 0);
      }
      return;
    }

    const curWeb = webQuranPlayer.getState();
    const reciter = getReciterById(selectedReciterIdRef.current);
    if (
      curWeb.active &&
      surah &&
      curWeb.surahNumber === surah.number &&
      curWeb.reciterKey === reciter.storageKey
    ) {
      webQuranPlayer.togglePlayPause();
      setIsAudioPlaying(!curWeb.isPlaying);
      return;
    }

    if (surah && surah.ayahs.length > 0) {
      playAyahRef.current(currentAyahRef.current ?? surah.ayahs[0].numberInSurah, 0);
    }
  }, []);

  const handlePlayAyahCard = useCallback((ayahNum: number) => {
    playAyahRef.current(ayahNum, 0, undefined, 1, 0);
  }, []);

  const handlePlayWord = useCallback((ayahNum: number, wordPos: number) => {
    const surah = activeSurahRef.current;
    if (!surah || wordPos <= 1) {
      playAyahRef.current(ayahNum, 0, undefined, 1, 0);
      return;
    }

    const reciterId = selectedReciterIdRef.current;
    const hasMatchingTimings =
      surah.audioReciterId === reciterId &&
      Boolean(surah.verseTimings && surah.verseTimings.length > 0);
    const vt = hasMatchingTimings
      ? surah.verseTimings!.find((v) => v.ayahNumber === ayahNum)
      : undefined;

    let offsetSec = 0;
    let offsetFrac = 0;

    if (vt && vt.segments && vt.segments.length > 0) {
      const exactSeg =
        vt.segments.find((s) => s[0] === wordPos) ||
        [...vt.segments].reverse().find((s) => s[0] <= wordPos);
      if (exactSeg) {
        offsetSec = Math.max(0, (exactSeg[1] - vt.timestampFromMs) / 1000);
        const spanMs = Math.max(1, vt.timestampToMs - vt.timestampFromMs);
        offsetFrac = Math.min(0.96, Math.max(0, (exactSeg[1] - vt.timestampFromMs) / spanMs));
      }
    }

    if (offsetSec <= 0 && offsetFrac <= 0) {
      const ayahObj = surah.ayahs.find((a) => a.numberInSurah === ayahNum);
      if (ayahObj) {
        const wordsList = getAyahWordsList(ayahObj);
        if (wordsList.length > 1) {
          const weights = wordsList.map((w) => Math.max(2, w.text.length));
          const totalWeight = weights.reduce((s, w) => s + w, 0);
          let beforeWeight = 0;
          for (const w of wordsList) {
            if (w.position >= wordPos) break;
            beforeWeight += Math.max(2, w.text.length);
          }
          offsetFrac = totalWeight > 0 ? Math.min(0.95, Math.max(0, beforeWeight / totalWeight)) : 0;
        }
      }
    }

    playAyahRef.current(ayahNum, offsetSec, undefined, wordPos, offsetFrac);
  }, []);

  const onToggleBookmarkRef = useRef(onToggleBookmark);
  onToggleBookmarkRef.current = onToggleBookmark;
  const handleToggleBookmarkStable = useCallback(
    (surahNum: number, surahName: string, ayahNum: number) => {
      onToggleBookmarkRef.current(surahNum, surahName, ayahNum);
    },
    []
  );

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOverallSec = Number(e.target.value);
    const surah = activeSurahRef.current;
    if (!surah || Number.isNaN(newOverallSec)) return;

    setAudioCurrentTime(newOverallSec);

    if (hasNativeQuranAudioBridge()) {
      const curNative = getNativeAudioState();
      if (curNative.active && curNative.surahNumber === surah.number && curNative.fullSurahMode) {
        nativeSeekMs(newOverallSec * 1000);
        return;
      }
    }

    if (
      surah.audioReciterId === selectedReciterIdRef.current &&
      surah.verseTimings &&
      surah.verseTimings.length > 0
    ) {
      const targetMs = newOverallSec * 1000;
      const timing = findVerseTimingAtMs(surah.verseTimings, targetMs)!;
      const offsetSec = Math.max(0, (targetMs - timing.timestampFromMs) / 1000);
      if (hasNativeQuranAudioBridge()) {
        const curNative = getNativeAudioState();
        if (curNative.active && curNative.surahNumber === surah.number && curNative.ayahNumber === timing.ayahNumber) {
          nativeSeekMs(offsetSec * 1000);
          syncProgressAndWord(timing.ayahNumber, offsetSec, curNative.durationMs / 1000);
        } else {
          startPlayingFromAyah(timing.ayahNumber, offsetSec);
        }
        return;
      }
      const curWeb = webQuranPlayer.getState();
      if (
        curWeb.active &&
        curWeb.surahNumber === surah.number &&
        curWeb.ayahNumber === timing.ayahNumber
      ) {
        webQuranPlayer.seekWithinCurrentAyah(offsetSec);
        syncProgressAndWord(timing.ayahNumber, offsetSec, curWeb.durationMs / 1000);
      } else {
        startPlayingFromAyah(timing.ayahNumber, offsetSec);
      }
      return;
    }

    const totalDur = Math.max(1, getSurahTotalDurationSec(surah));
    const idx = Math.min(
      surah.ayahs.length - 1,
      Math.max(0, Math.floor((newOverallSec / totalDur) * surah.ayahs.length))
    );
    const targetAyah = surah.ayahs[idx];
    if (targetAyah) {
      startPlayingFromAyah(targetAyah.numberInSurah, 0);
    }
  };

  const loadSurah = useCallback(
    async (surahNumber: number, autoPlay = false, targetAyah = 1) => {
      if (surahNumber < 1 || surahNumber > 114) return;
      loadedSurahIdRef.current = surahNumber;
      pendingAutoPlayRef.current = autoPlay;
      targetScrollAyahRef.current = Math.max(1, targetAyah);
      setVisibleAyahCount(Math.max(35, targetAyah + 12));
      setLastRead(saveLastRead(surahNumber, targetAyah));
      setActiveSurahNumber(surahNumber);
      const curPlayer = hasNativeQuranAudioBridge()
        ? getNativeAudioState()
        : webQuranPlayer.getState();
      if (!curPlayer.active || curPlayer.surahNumber !== surahNumber) {
        setIsAudioPlaying(false);
        setCurrentPlayingAyah(null);
        setActiveWordPos(null);
        currentAyahRef.current = null;
        activeWordRef.current = null;
        setAudioCurrentTime(0);
      }

      const cachedOffline =
        getCachedSurahSync(surahNumber, selectedTranslation) ||
        loadOfflineSurah(surahNumber, selectedTranslation) ||
        (await getCachedSurahAsync(surahNumber, selectedTranslation));
      if (loadedSurahIdRef.current !== surahNumber) return;

      const isUzbekTrans = selectedTranslation === 'uz_mansur' || selectedTranslation === 'uz_cyr';

      // Fast-path: load bundled offline Surah text (/data/quran/{n}.json) in ~2ms for ALL 114 Surahs!
      let localBundledSurah: SurahDetail | null = null;
      if (!cachedOffline && !PRELOADED_SURAHS[surahNumber]) {
        const localRaw =
          getLocalSurahRawSync(surahNumber) || (await loadLocalSurahRaw(surahNumber));
        if (loadedSurahIdRef.current !== surahNumber) return;
        if (localRaw && isUzbekTrans) {
          localBundledSurah = buildSurahDetailFromLocal(localRaw, selectedTranslation);
          if (localBundledSurah) {
            void putCachedSurahAsync(localBundledSurah, selectedTranslation);
          }
        }
      }

      if (PRELOADED_SURAHS[surahNumber] || cachedOffline || localBundledSurah) {
        const rawBase = cachedOffline || localBundledSurah || PRELOADED_SURAHS[surahNumber];
        const reciterForLoad = selectedReciterIdRef.current;

        // Hydrate per-Qori timings & shared Uthmani words from on-device IndexedDB immediately (~2ms)
        // and strip any stale timings belonging to a different Qori so Al-Afasy timings never leak!
        const [cachedReciterTiming, cachedWords] = await Promise.all([
          getCachedReciterTimingAsync(surahNumber, reciterForLoad),
          getCachedSurahWordsAsync(surahNumber),
        ]);
        if (loadedSurahIdRef.current !== surahNumber || selectedReciterIdRef.current !== reciterForLoad) return;

        const hasSameReciterTimings =
          rawBase.audioReciterId === reciterForLoad &&
          Boolean(rawBase.verseTimings && rawBase.verseTimings.length > 0);
        const initialTimings =
          cachedReciterTiming?.verseTimings && cachedReciterTiming.verseTimings.length > 0
            ? cachedReciterTiming.verseTimings
            : hasSameReciterTimings
            ? rawBase.verseTimings
            : undefined;
        const initialDurationMs =
          cachedReciterTiming?.audioDurationMs ??
          (hasSameReciterTimings ? rawBase.audioDurationMs : undefined);
        const initialFullUrl =
          cachedReciterTiming?.fullAudioUrl ??
          (hasSameReciterTimings ? rawBase.fullAudioUrl : undefined);

        const baseSurah: SurahDetail = {
          ...rawBase,
          audioReciterId: initialTimings ? reciterForLoad : undefined,
          fullAudioUrl: initialFullUrl,
          audioDurationMs: initialDurationMs,
          verseTimings: initialTimings,
          ayahs: cachedWords
            ? rawBase.ayahs.map((a) => ({
                ...a,
                words: cachedWords[a.numberInSurah] || a.words,
              }))
            : rawBase.ayahs,
        };

        activeSurahRef.current = baseSurah;
        setActiveSurahData(baseSurah);
        applyNativeState(
          hasNativeQuranAudioBridge() ? getNativeAudioState() : webQuranPlayer.getState()
        );
        if (targetAyah <= 1) {
          versesScrollRef.current?.scrollTo({ top: 0 });
        }
        if (baseSurah.audioDurationMs) {
          setAudioDuration(baseSurah.audioDurationMs / 1000);
        }

        const needsMetadataFetch =
          !initialTimings || !baseSurah.ayahs.some((a) => a.words && a.words.length > 0);

        // If auto-playing and Qori timings are not cached locally yet, await them briefly (max 2.5s)
        // so Word 1 highlights with the exact active Qori's segments immediately.
        if (pendingAutoPlayRef.current && needsMetadataFetch) {
          try {
            const meta = await fetchWithTimeout(
              fetchSurahAudioAndWords(surahNumber, reciterForLoad),
              2500
            );
            if (loadedSurahIdRef.current !== surahNumber || selectedReciterIdRef.current !== reciterForLoad) return;
            if (meta && (meta.verseTimings?.length || Object.keys(meta.wordsByAyah).length > 0)) {
              const enriched: SurahDetail = {
                ...baseSurah,
                fullAudioUrl: meta.fullAudioUrl ?? baseSurah.fullAudioUrl,
                audioDurationMs: meta.audioDurationMs ?? baseSurah.audioDurationMs,
                audioReciterId: meta.verseTimings?.length ? reciterForLoad : baseSurah.audioReciterId,
                verseTimings: meta.verseTimings ?? baseSurah.verseTimings,
                ayahs: baseSurah.ayahs.map((a) => ({
                  ...a,
                  words: meta.wordsByAyah[a.numberInSurah] || a.words,
                })),
              };
              activeSurahRef.current = enriched;
              setActiveSurahData(enriched);
              void putCachedSurahAsync(enriched, selectedTranslation);
              if (cachedOffline && isSurahSavedOffline(surahNumber, selectedTranslation)) {
                saveOfflineSurah(enriched, selectedTranslation);
              }
              if (enriched.audioDurationMs) setAudioDuration(enriched.audioDurationMs / 1000);
            }
          } catch {
            // Proceed to play even if offline
          }
        }

        if (pendingAutoPlayRef.current) {
          pendingAutoPlayRef.current = false;
          startPlayingFromAyah(targetAyah, 0, reciterForLoad);
        } else {
          // Silently pre-buffer the first visible ayah so tapping Play starts with 0ms lag
          prebufferAyah(activeSurahRef.current, targetAyah, reciterForLoad);
        }

        // Enrich with live audio stream & word timings for active Qori in background if still missing
        if (
          !activeSurahRef.current?.verseTimings?.length ||
          activeSurahRef.current.audioReciterId !== reciterForLoad ||
          !activeSurahRef.current.ayahs.some((a) => a.words && a.words.length > 0)
        ) {
          try {
            const { fullAudioUrl, audioDurationMs, verseTimings, wordsByAyah } =
              await fetchSurahAudioAndWords(surahNumber, reciterForLoad);
            if (loadedSurahIdRef.current !== surahNumber || selectedReciterIdRef.current !== reciterForLoad) return;
            if (verseTimings?.length || Object.keys(wordsByAyah).length > 0) {
              const latestBase = activeSurahRef.current || baseSurah;
              const enriched: SurahDetail = {
                ...latestBase,
                fullAudioUrl: fullAudioUrl ?? latestBase.fullAudioUrl,
                audioDurationMs: audioDurationMs ?? latestBase.audioDurationMs,
                audioReciterId: verseTimings?.length ? reciterForLoad : latestBase.audioReciterId,
                verseTimings: verseTimings ?? latestBase.verseTimings,
                ayahs: latestBase.ayahs.map((a) => ({
                  ...a,
                  words: wordsByAyah[a.numberInSurah] || a.words,
                })),
              };
              activeSurahRef.current = enriched;
              setActiveSurahData(enriched);
              void putCachedSurahAsync(enriched, selectedTranslation);
              if (cachedOffline && isSurahSavedOffline(surahNumber, selectedTranslation)) {
                saveOfflineSurah(enriched, selectedTranslation);
              }
              if (enriched.audioDurationMs) setAudioDuration(enriched.audioDurationMs / 1000);
            }
          } catch {
            // Audio already started cleanly from baseSurah
          }
        }
        return;
      }

      const meta = ALL_SURAHS.find((s) => s.number === surahNumber);
      const localRawForNonUz =
        getLocalSurahRawSync(surahNumber) || (await loadLocalSurahRaw(surahNumber));
      if (loadedSurahIdRef.current !== surahNumber) return;

      // Show local bundled Arabic text immediately while non-Uzbek translation fetches (0ms blank wait!)
      const instantLocalSurah = localRawForNonUz
        ? buildSurahDetailFromLocal(localRawForNonUz, selectedTranslation)
        : null;

      if (instantLocalSurah) {
        activeSurahRef.current = instantLocalSurah;
        setActiveSurahData(instantLocalSurah);
        setIsLoadingSurah(false);
        versesScrollRef.current?.scrollTo({ top: 0 });
      } else {
        if (meta) {
          setActiveSurahData({
            ...meta,
            bismillahPre: surahNumber !== 1 && surahNumber !== 9,
            ayahs: [],
          });
        }
        setIsLoadingSurah(true);
        versesScrollRef.current?.scrollTo({ top: 0 });
      }

      try {
        let edition = 'en.sahih';
        if (isUzbekTrans) edition = 'uz.sodik';
        else if (selectedTranslation === 'ru_kuliev') edition = 'ru.kuliev';
        else if (selectedTranslation === 'en_yusufali') edition = 'en.yusufali';
        else if (selectedTranslation === 'ur_jalandhry') edition = 'ur.jalandhry';
        else if (selectedTranslation === 'fr_hamidullah') edition = 'fr.hamidullah';
        else if (selectedTranslation === 'id_indonesian') edition = 'id.indonesian';

        const fetchUzMansur = async (): Promise<Record<number, string> | null> => {
          if (!isUzbekTrans) return null;
          try {
            const res = await fetch(
              `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/uzb-alauddinmansour/${surahNumber}.json`
            );
            if (!res.ok) return null;
            const data = (await res.json()) as { chapter?: Array<{ verse: number; text: string }> };
            if (!Array.isArray(data.chapter) || data.chapter.length === 0) return null;
            const map: Record<number, string> = {};
            for (const item of data.chapter) {
              if (item.verse && item.text) {
                map[item.verse] = item.text.trim();
              }
            }
            return map;
          } catch {
            return null;
          }
        };

        const reciterForFetch = selectedReciterIdRef.current;

        // NEVER block Surah text display on heavy qurancdn word timings — kick off in background!
        const qdcBgPromise = fetchSurahAudioAndWords(surahNumber, reciterForFetch).catch(() => ({
          fullAudioUrl: undefined,
          audioDurationMs: undefined,
          verseTimings: undefined,
          wordsByAyah: {} as Record<number, AyahWord[]>,
        }));

        const [arabicRes, mansurMap, fallbackTransRes] = await Promise.all([
          localRawForNonUz
            ? Promise.resolve(null)
            : fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`),
          localRawForNonUz ? Promise.resolve(null) : fetchUzMansur(),
          isUzbekTrans
            ? Promise.resolve(null)
            : fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/${edition}`),
        ]);

        // Only fetch uz.sodik if Alauddin Mansur concise endpoint was unavailable
        let sodikJson: { data?: { ayahs?: Array<{ text?: string }> } } | null = null;
        if (isUzbekTrans && !localRawForNonUz && !mansurMap) {
          try {
            const r = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/uz.sodik`);
            if (r.ok) sodikJson = await r.json();
          } catch {
            sodikJson = null;
          }
        }

        if (loadedSurahIdRef.current !== surahNumber) return;

        const transJson = fallbackTransRes ? await fallbackTransRes.json() : sodikJson;
        let builtSurah: SurahDetail;

        if (localRawForNonUz) {
          const extMap: Record<number, string> = {};
          const transRows = (transJson?.data?.ayahs || []) as Array<{
            numberInSurah?: number;
            text?: string;
          }>;
          transRows.forEach((row, idx) => {
            const num = row.numberInSurah || idx + 1;
            if (row.text) extMap[num] = row.text;
          });
          builtSurah =
            buildSurahDetailFromLocal(localRawForNonUz, selectedTranslation, extMap) ||
            instantLocalSurah!;
        } else {
          const arabicJson = await arabicRes!.json();

          const stripLongTafsirNote = (text: string): string => {
            const stripped = text.replace(/\([^()]{70,}\)/g, '').replace(/\s{2,}/g, ' ').trim();
            return stripped || text;
          };

          const sMeta = ALL_SURAHS.find((s) => s.number === surahNumber)!;
          const ayahs: Ayah[] = (arabicJson.data.ayahs || []).map(
            (
              a: { numberInSurah: number; number: number; text: string; juz?: number; page?: number },
              idx: number
            ) => {
              const concMansur = mansurMap?.[a.numberInSurah];
              const rawFallback = transJson?.data?.ayahs?.[idx]?.text;
              const rawText = concMansur
                ? concMansur
                : rawFallback
                ? isUzbekTrans
                  ? stripLongTafsirNote(rawFallback)
                  : rawFallback
                : 'Translation unavailable offline.';
              const transText =
                selectedTranslation === 'uz_mansur' ? cyrillicToLatinUz(rawText) : rawText;
              const sNum = surahNumber.toString().padStart(3, '0');
              const aNum = a.numberInSurah.toString().padStart(3, '0');

              return {
                numberInSurah: a.numberInSurah,
                number: a.number,
                text: a.text,
                translation: transText,
                translations: {
                  [selectedTranslation]: transText,
                  ...(isUzbekTrans
                    ? { uz_cyr: rawText, uz_mansur: cyrillicToLatinUz(rawText) }
                    : {}),
                },
                juz: a.juz,
                page: a.page,
                audioUrl: `https://everyayah.com/data/Alafasy_128kbps/${sNum}${aNum}.mp3`,
              };
            }
          );

          builtSurah = {
            ...sMeta,
            ayahs,
            bismillahPre: surahNumber !== 1 && surahNumber !== 9,
          };
        }

        activeSurahRef.current = builtSurah;
        setActiveSurahData(builtSurah);
        setIsLoadingSurah(false);
        void putCachedSurahAsync(builtSurah, selectedTranslation);

        if (pendingAutoPlayRef.current) {
          pendingAutoPlayRef.current = false;
          startPlayingFromAyah(1, 0, reciterForFetch);
        } else {
          prebufferAyah(builtSurah, targetAyah, reciterForFetch);
        }

        // Hydrate word timings & fullAudioUrl silently in the background once text is visible
        void qdcBgPromise.then((qdcData) => {
          if (
            loadedSurahIdRef.current !== surahNumber ||
            selectedReciterIdRef.current !== reciterForFetch
          ) {
            return;
          }
          if (qdcData.verseTimings?.length || Object.keys(qdcData.wordsByAyah).length > 0) {
            const latest = activeSurahRef.current || builtSurah;
            const enriched: SurahDetail = {
              ...latest,
              fullAudioUrl: qdcData.fullAudioUrl ?? latest.fullAudioUrl,
              audioDurationMs: qdcData.audioDurationMs ?? latest.audioDurationMs,
              audioReciterId: qdcData.verseTimings?.length ? reciterForFetch : latest.audioReciterId,
              verseTimings: qdcData.verseTimings ?? latest.verseTimings,
              ayahs: latest.ayahs.map((a) => ({
                ...a,
                words: qdcData.wordsByAyah[a.numberInSurah] || a.words,
              })),
            };
            activeSurahRef.current = enriched;
            setActiveSurahData(enriched);
            void putCachedSurahAsync(enriched, selectedTranslation);
            if (enriched.audioDurationMs) {
              setAudioDuration(enriched.audioDurationMs / 1000);
            }
          }
        });
      } catch {
        if (loadedSurahIdRef.current !== surahNumber) return;
        if (!instantLocalSurah) {
          const sMeta = ALL_SURAHS.find((s) => s.number === surahNumber)!;
          const locMeta = getLocalizedSurahMeta(
            sMeta.number,
            sMeta.englishName,
            sMeta.englishNameTranslation,
            language
          );
          setActiveSurahData({
            ...sMeta,
            bismillahPre: surahNumber !== 1 && surahNumber !== 9,
            ayahs: [
              {
                numberInSurah: 1,
                number: 1,
                text: sMeta.name,
                translation: `${sMeta.number}. ${locMeta.name} (${locMeta.meaning}) — ${sMeta.numberOfAyahs} ${t.quran.versesUnit}.`,
                audioUrl: `https://everyayah.com/data/Alafasy_128kbps/${surahNumber
                  .toString()
                  .padStart(3, '0')}001.mp3`,
              },
            ],
          });
        }
        pendingAutoPlayRef.current = false;
      } finally {
        if (loadedSurahIdRef.current === surahNumber) {
          setIsLoadingSurah(false);
        }
      }
    },
    [
      applyNativeState,
      language,
      prebufferAyah,
      selectedTranslation,
      startPlayingFromAyah,
      t.quran.versesUnit,
    ]
  );

  useEffect(() => {
    loadSurahRef.current = loadSurah;
  }, [loadSurah]);

  useEffect(() => {
    if (initialSurahNumber) {
      savedListScrollTopRef.current = 0;
      tappedListSurahRef.current = initialSurahNumber;
      const target = initialAyahNumber && initialAyahNumber >= 1 ? initialAyahNumber : null;
      setHighlightedAyah(target);
      loadSurah(initialSurahNumber, false, target || 1);
    }
  }, [initialSurahNumber, initialAyahNumber, loadSurah]);

  const toggleMarkSurahRead = useCallback((surahNum: number) => {
    setCompletedSurahs((prev) => {
      const next = prev.includes(surahNum)
        ? prev.filter((n) => n !== surahNum)
        : [...prev, surahNum];
      saveCompletedSurahs(next);
      return next;
    });
  }, []);

  const handleSelectReciter = useCallback(
    async (nextId: QuranReciterId) => {
      const prevId = selectedReciterIdRef.current;
      setSelectedReciterId(nextId);
      selectedReciterIdRef.current = nextId;
      saveSelectedReciterId(nextId);
      setIsReciterPickerOpen(false);
      if (prevId === nextId) return;

      const curSurah = activeSurahRef.current;
      if (!curSurah) return;

      const wasPlaying = isAudioPlaying;
      const resumeAyah = currentAyahRef.current || curSurah.ayahs[0]?.numberInSurah || 1;

      // Immediately clear previous Qori's timings so stale highlights NEVER flash on the new Qori
      activeWordRef.current = null;
      setActiveWordPos(null);
      const clearedSurah: SurahDetail = {
        ...curSurah,
        audioReciterId: undefined,
        fullAudioUrl: undefined,
        audioDurationMs: undefined,
        verseTimings: undefined,
      };
      activeSurahRef.current = clearedSurah;
      setActiveSurahData(clearedSurah);

      try {
        // Load exact timings for the new Qori BEFORE starting playback (0ms from IndexedDB, ~200ms first time)
        const meta = await fetchWithTimeout(fetchSurahAudioAndWords(curSurah.number, nextId), 2500);
        if (loadedSurahIdRef.current !== curSurah.number || selectedReciterIdRef.current !== nextId) {
          return;
        }
        if (meta && (meta.verseTimings?.length || Object.keys(meta.wordsByAyah).length > 0)) {
          const updated: SurahDetail = {
            ...clearedSurah,
            fullAudioUrl: meta.fullAudioUrl,
            audioDurationMs: meta.audioDurationMs,
            audioReciterId: meta.verseTimings?.length ? nextId : undefined,
            verseTimings: meta.verseTimings,
            ayahs: clearedSurah.ayahs.map((a) => ({
              ...a,
              words: meta.wordsByAyah[a.numberInSurah] || a.words,
            })),
          };
          activeSurahRef.current = updated;
          setActiveSurahData(updated);
          if (meta.audioDurationMs) {
            setAudioDuration(meta.audioDurationMs / 1000);
          }
        }
      } catch {
        // Fallback audio mirrors still work even if timing metadata is offline
      }

      if (wasPlaying && loadedSurahIdRef.current === curSurah.number && selectedReciterIdRef.current === nextId) {
        startPlayingFromAyah(resumeAyah, 0, nextId);
      } else {
        // Ensure any paused background service holding the previous reciter is cleared so it never resumes with the old Qori
        if (hasNativeQuranAudioBridge()) {
          const curNative = getNativeAudioState();
          const nextRec = getReciterById(nextId);
          if (curNative.active && curNative.reciterKey && curNative.reciterKey !== nextRec.storageKey) {
            nativeStopAudio();
          }
        } else {
          const curWeb = webQuranPlayer.getState();
          const nextRec = getReciterById(nextId);
          if (curWeb.active && curWeb.reciterKey && curWeb.reciterKey !== nextRec.storageKey) {
            webQuranPlayer.stop();
          }
        }
      }
    },
    [isAudioPlaying, startPlayingFromAyah]
  );

  const toggleOfflineSave = useCallback(() => {
    if (!activeSurahData || activeSurahData.ayahs.length === 0) return;
    const surahNum = activeSurahData.number;
    const reciterId = selectedReciterIdRef.current;
    const reciter = getReciterById(reciterId);
    const dlEntry = downloadMap[surahNum];
    if (dlEntry?.status === 'downloading') {
      return; // Already downloading in background
    }

    const nativeDownloaded =
      hasNativeQuranAudioBridge() && isNativeAudioDownloaded(surahNum, reciter.storageKey);
    const webDownloaded =
      !hasNativeQuranAudioBridge() && isWebAudioDownloaded(surahNum, reciter.storageKey);
    const alreadyDone = hasNativeQuranAudioBridge()
      ? nativeDownloaded && isCurrentSavedOffline
      : webDownloaded && isCurrentSavedOffline;

    if (alreadyDone) {
      removeOfflineSurah(surahNum, selectedTranslation);
      if (hasNativeQuranAudioBridge()) {
        removeNativeSurahAudio(surahNum, reciter.storageKey);
      } else {
        void removeWebSurahAudio(surahNum, reciter.storageKey, activeSurahData.ayahs.length);
      }
      setIsCurrentSavedOffline(false);
    } else {
      saveOfflineSurah(activeSurahData, selectedTranslation);
      void putCachedSurahAsync(activeSurahData, selectedTranslation);
      setIsCurrentSavedOffline(true);
      if (hasNativeQuranAudioBridge()) {
        if (!nativeDownloaded) {
          const qdcUrl =
            activeSurahData.audioReciterId === reciterId ? activeSurahData.fullAudioUrl : undefined;
          downloadNativeSurahAudio(surahNum, {
            reciterKey: reciter.storageKey,
            preferFullSurah: Boolean(reciter.preferFullSurahStream),
            ayahs: activeSurahData.ayahs.map((a) => ({
              ayahNumber: a.numberInSurah,
              urls: getAyahAudioCandidates(surahNum, a, reciterId),
            })),
            fullUrls: getFullSurahAudioCandidates(surahNum, qdcUrl, reciterId),
          });
        }
      } else if (!webDownloaded) {
        void downloadWebSurahAudio(
          surahNum,
          reciter.storageKey,
          activeSurahData.ayahs.map((a) => ({
            ayahNumber: a.numberInSurah,
            urls: getAyahAudioCandidates(surahNum, a, reciterId),
          }))
        );
      }
    }
    setOfflineSavedSet(getAllOfflineSavedSurahNumbers(selectedTranslation));
  }, [activeSurahData, downloadMap, isCurrentSavedOffline, selectedTranslation]);

  const switchReaderSurah = useCallback(
    (delta: -1 | 1) => {
      if (!activeSurahData) return;
      const target = activeSurahData.number + delta;
      if (target < 1 || target > 114) return;
      // Always load via loadSurah so the target Surah gets exact per-Qori synced playback
      // instead of falling back to mismatched mp3quran full-Surah streams.
      loadSurah(target, isAudioPlaying, 1);
    },
    [activeSurahData, isAudioPlaying, loadSurah]
  );

  useEffect(() => {
    if (prevTranslationRef.current !== selectedTranslation) {
      prevTranslationRef.current = selectedTranslation;
      if (activeSurahNumber && !PRELOADED_SURAHS[activeSurahNumber]) {
        loadSurah(activeSurahNumber);
      }
    }
  }, [selectedTranslation, activeSurahNumber, loadSurah]);

  const closeSurahDetail = useCallback(() => {
    loadedSurahIdRef.current = null;
    shouldRestoreListScrollRef.current = true;
    setHighlightedAyah(null);
    setActiveSurahNumber(null);
    setActiveSurahData(null);
    if (onCloseSurahDetail) onCloseSurahDetail();
  }, [onCloseSurahDetail]);

  // Restore exact Surah directory scroll position synchronously before paint (zero shake/flicker)
  useLayoutEffect(() => {
    if (activeSurahNumber !== null || !shouldRestoreListScrollRef.current) return;
    shouldRestoreListScrollRef.current = false;

    const targetTop = savedListScrollTopRef.current;
    const targetSurah = tappedListSurahRef.current;
    const scrollContainer = directoryListRef.current?.closest('.overflow-y-auto') as HTMLElement | null;

    if (scrollContainer && targetTop > 0) {
      scrollContainer.scrollTop = targetTop;
      return;
    }
    if (targetSurah) {
      const card = document.getElementById(`surah-card-${targetSurah}`);
      card?.scrollIntoView({ block: 'center', behavior: 'instant' as ScrollBehavior });
    }
  }, [activeSurahNumber]);

  const updateArabicFontSize = useCallback((next: number) => {
    const clamped = Math.max(MIN_ARABIC_FONT_SIZE, Math.min(MAX_ARABIC_FONT_SIZE, Math.round(next)));
    setArabicFontSize(clamped);
    try {
      localStorage.setItem(ARABIC_FONT_SIZE_KEY, String(clamped));
    } catch {
      // ignore
    }
  }, []);

  const updateTransFontSize = useCallback((next: number) => {
    const clamped = Math.max(MIN_TRANS_FONT_SIZE, Math.min(MAX_TRANS_FONT_SIZE, Math.round(next)));
    setTransFontSize(clamped);
    try {
      localStorage.setItem(TRANS_FONT_SIZE_KEY, String(clamped));
    } catch {
      // ignore
    }
  }, []);

  const toggleMushafBookMode = useCallback(() => {
    setIsMushafBookMode((prev) => !prev);
  }, []);

  // Build balanced Mushaf Book Pages for the active Surah (respecting real Madinah Mushaf page breaks + comfortable word density)
  const mushafBookPages = React.useMemo(() => {
    if (!activeSurahData || activeSurahData.ayahs.length === 0) return [];
    const pages: Array<{
      pageIndex: number;
      mushafPage: number;
      juz: number;
      ayahs: Ayah[];
      isFirstPage: boolean;
    }> = [];

    const MAX_WORDS_PER_BOOK_LEAF = 82;
    let currentBucket: Ayah[] = [];
    let currentWords = 0;
    let currentMushafPage = activeSurahData.ayahs[0]?.page || activeSurahData.page || 1;
    let currentJuz = activeSurahData.ayahs[0]?.juz || activeSurahData.juz || 1;

    const flushBucket = () => {
      if (currentBucket.length === 0) return;
      pages.push({
        pageIndex: pages.length,
        mushafPage: currentMushafPage,
        juz: currentJuz,
        ayahs: currentBucket,
        isFirstPage: pages.length === 0,
      });
      currentBucket = [];
      currentWords = 0;
    };

    for (const ayah of activeSurahData.ayahs) {
      const ayahWordsCount = getAyahWordsList(ayah).length;
      const ayahMushafPage = ayah.page || currentMushafPage;
      const ayahJuz = ayah.juz || currentJuz;

      const crossedMushafPage =
        currentBucket.length > 0 && ayah.page && ayah.page !== currentMushafPage;
      const exceededLeafWords =
        currentBucket.length > 0 && currentWords + ayahWordsCount > MAX_WORDS_PER_BOOK_LEAF;

      if (crossedMushafPage || exceededLeafWords) {
        flushBucket();
      }
      if (currentBucket.length === 0) {
        currentMushafPage = ayahMushafPage;
        currentJuz = ayahJuz;
      }
      currentBucket.push(ayah);
      currentWords += ayahWordsCount;
    }
    flushBucket();
    return pages;
  }, [activeSurahData]);

  const turnToBookPage = useCallback(
    (targetIdx: number) => {
      if (mushafBookPages.length === 0) return;
      const clamped = Math.max(0, Math.min(mushafBookPages.length - 1, targetIdx));
      setBookPageIdx((prev) => {
        if (prev !== clamped) {
          bookPageScrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
        }
        return clamped;
      });
    },
    [mushafBookPages.length]
  );

  // Reset or jump to initial Ayah's book page when Surah changes or when entering Mushaf Book Mode
  useEffect(() => {
    if (!activeSurahData || mushafBookPages.length === 0) {
      setBookPageIdx(0);
      return;
    }
    const focusAyah = currentPlayingAyah ?? highlightedAyah ?? 1;
    const foundIdx = mushafBookPages.findIndex((p) =>
      p.ayahs.some((a) => a.numberInSurah === focusAyah)
    );
    setBookPageIdx(foundIdx >= 0 ? foundIdx : 0);
  }, [activeSurahData?.number, mushafBookPages.length, isMushafBookMode]);

  // Automatically turn the Mushaf book page ONLY when currentPlayingAyah actually transitions to a new Ayah
  // (never when the user manually swipes pages to browse ahead/behind and tap another Ayah!)
  useEffect(() => {
    if (!isMushafBookMode || currentPlayingAyah === null || !activeSurahData || mushafBookPages.length === 0) {
      lastAutoTurnedAyahRef.current = null;
      return;
    }
    const ayahKey = `${activeSurahData.number}:${currentPlayingAyah}`;
    if (lastAutoTurnedAyahRef.current === ayahKey) return;
    lastAutoTurnedAyahRef.current = ayahKey;

    const targetPageIdx = mushafBookPages.findIndex((p) =>
      p.ayahs.some((a) => a.numberInSurah === currentPlayingAyah)
    );
    if (targetPageIdx >= 0) {
      setBookPageIdx((prev) => {
        if (prev !== targetPageIdx) {
          bookPageScrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
        }
        return targetPageIdx;
      });
    }
    // Also ensure the active ayah inside the book page is scrolled into view if font size is large
    const rafId = requestAnimationFrame(() => {
      const el = document.getElementById(`mushaf-ayah-${currentPlayingAyah}`);
      const container = bookPageScrollRef.current;
      if (el && container && container.scrollHeight > container.clientHeight + 8) {
        const cRect = container.getBoundingClientRect();
        const eRect = el.getBoundingClientRect();
        const offset = eRect.top - cRect.top + container.scrollTop;
        const targetTop = Math.max(0, offset - (cRect.height - eRect.height) / 2);
        container.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
    return () => cancelAnimationFrame(rafId);
  }, [activeSurahData, currentPlayingAyah, isMushafBookMode, mushafBookPages]);

  // Intercept Android hardware / gesture back button:
  // If inside Mushaf Book Mode, step back to the Surah Translation page first before exiting to the Surahs list!
  useEffect(() => {
    const handleBack = (e: Event) => {
      if (isReciterPickerOpen) {
        e.preventDefault();
        setIsReciterPickerOpen(false);
        return;
      }
      if (isFontSheetOpen) {
        e.preventDefault();
        setIsFontSheetOpen(false);
        return;
      }
      if (isMushafBookMode) {
        e.preventDefault();
        setIsMushafBookMode(false);
        return;
      }
      if (activeSurahNumber) {
        e.preventDefault();
        closeSurahDetail();
      }
    };
    window.addEventListener('nq:android-back', handleBack);
    return () => window.removeEventListener('nq:android-back', handleBack);
  }, [activeSurahNumber, closeSurahDetail, isFontSheetOpen, isMushafBookMode, isReciterPickerOpen]);

  // Hide the bottom navigation dock synchronously before paint while inside the Surah reader view
  useLayoutEffect(() => {
    onSurahDetailActiveChange?.(Boolean(activeSurahNumber && activeSurahData));
    return () => onSurahDetailActiveChange?.(false);
  }, [activeSurahNumber, activeSurahData, onSurahDetailActiveChange]);

  const handleCopyAyah = useCallback(
    (ayah: Ayah) => {
      const surah = activeSurahRef.current;
      if (!surah) return;
      const loc = getLocalizedSurahMeta(
        surah.number,
        surah.englishName,
        surah.englishNameTranslation,
        language
      );
      const transText = getAyahTranslation(ayah, selectedTranslation);
      const textToCopy = `${ayah.text}\n\n"${transText}"\n- ${loc.name} (${surah.number}:${ayah.numberInSurah})`;
      void copyTextSafely(textToCopy);
      setCopiedAyah(ayah.numberInSurah);
      setTimeout(() => setCopiedAyah(null), 2000);
    },
    [language, selectedTranslation]
  );

  const showShareToast = useCallback((msg: string) => {
    setShareToast(msg);
    window.setTimeout(() => {
      setShareToast((cur) => (cur === msg ? null : cur));
    }, 2400);
  }, []);

  const handleShareAyahCard = useCallback(
    async (ayah: Ayah) => {
      const surah = activeSurahRef.current;
      if (!surah) return;
      setSharingAyah(ayah.numberInSurah);
      try {
        const loc = getLocalizedSurahMeta(
          surah.number,
          surah.englishName,
          surah.englishNameTranslation,
          language
        );
        const transText = getAyahTranslation(ayah, selectedTranslation);
        const trMeta = TRANSLATION_OPTIONS.find((o) => o.id === selectedTranslation);

        const quranTitle =
          language === 'ru'
            ? 'Священный Коран'
            : language === 'en'
            ? 'The Holy Quran'
            : language === 'uz_cyr'
            ? 'Қуръони Карим'
            : "Qur'oni Karim";
        const ayahWord =
          language === 'ru'
            ? 'Аят'
            : language === 'en'
            ? 'Ayah'
            : language === 'uz_cyr'
            ? 'Оят'
            : 'Oyat';
        const transLabel =
          language === 'ru'
            ? 'Перевод смысла'
            : language === 'en'
            ? 'Translation'
            : language === 'uz_cyr'
            ? 'Маънолар таржимаси'
            : "Ma'nolar tarjimasi";
        const savedLabel =
          language === 'ru'
            ? 'Открытка аята сохранена (PNG)'
            : language === 'en'
            ? 'Ayah card saved as PNG'
            : language === 'uz_cyr'
            ? 'Оят картаси юклаб олинди'
            : 'Oyat kartasi yuklab olindi';

        const rendered = await generateNurulIslamShareCard({
          isDay,
          eyebrow: `${quranTitle} · ${loc.name}`,
          metaPill: `${surah.number}:${ayah.numberInSurah}  •  ${ayahWord} ${ayah.numberInSurah}  •  \u2067${surah.name}\u2069`,
          title: `${surah.number}. ${loc.name}`,
          subtitle: loc.meaning,
          featuredText: ayah.text,
          featuredIsArabic: true,
          bodyText: transText,
          noteLabel: trMeta ? transLabel : undefined,
          noteText: trMeta ? trMeta.author : undefined,
          footerSectionTitle: quranTitle,
        });
        if (!rendered) throw new Error('Canvas unavailable');

        const fileName = `nurul-islam-ayah-${surah.number}-${ayah.numberInSurah}.png`;
        const caption = `${ayah.text}\n\n«${transText}»\n— ${loc.name} (${surah.number}:${ayah.numberInSurah})\nNurul Islam · nurulislam.mabdullayev.dev`;
        const res = await shareOrSavePngCard({
          rendered,
          fileName,
          shareTitle: `${loc.name} (${surah.number}:${ayah.numberInSurah})`,
          caption,
        });
        if (res.method === 'desktop') {
          showShareToast(res.savedPath ? `${savedLabel}: ${res.savedPath}` : savedLabel);
        } else if (res.method === 'download') {
          showShareToast(savedLabel);
        }
      } catch {
        handleCopyAyah(ayah);
      } finally {
        setSharingAyah(null);
      }
    },
    [handleCopyAyah, isDay, language, selectedTranslation, showShareToast]
  );

  const filteredSurahs = ALL_SURAHS.filter((surah) => {
    const loc = getLocalizedSurahMeta(
      surah.number,
      surah.englishName,
      surah.englishNameTranslation,
      language
    );
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      loc.name.toLowerCase().includes(q) ||
      loc.meaning.toLowerCase().includes(q) ||
      surah.englishName.toLowerCase().includes(q) ||
      surah.englishNameTranslation.toLowerCase().includes(q) ||
      surah.number.toString() === q;

    if (!matchesSearch) return false;
    if (filterType === 'bookmarks') return bookmarks.some((b) => b.surahNumber === surah.number);
    return true;
  });

  const reciterModalTitle =
    language === 'ru'
      ? 'Выберите чтеца (Кари)'
      : language === 'en'
      ? 'Choose Qari Reciter'
      : language === 'uz_cyr'
      ? 'Қорини танланг'
      : 'Qorini tanlang';

  const reciterPickerModal = isReciterPickerOpen ? (
    <div
      onClick={() => setIsReciterPickerOpen(false)}
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-sm rounded-3xl border p-4 space-y-3 shadow-2xl animate-in fade-in zoom-in-95 duration-150 ${
          isDay
            ? 'bg-white border-[#dde3ea] text-slate-900'
            : 'bg-slate-900 border-emerald-800/80 text-slate-100'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isDay ? 'bg-[#eef9ea] text-[#158509]' : 'bg-emerald-950 text-amber-400'
              }`}
            >
              <Headphones className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold">{reciterModalTitle}</h3>
          </div>
          <button
            type="button"
            onClick={() => setIsReciterPickerOpen(false)}
            className={`p-1.5 rounded-xl ${
              isDay ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'
            }`}
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1.5 max-h-[60vh] overflow-y-auto no-scrollbar">
          {QURAN_RECITERS.map((rec) => {
            const isSelected = rec.id === selectedReciterId;
            return (
              <button
                key={rec.id}
                type="button"
                onClick={() => void handleSelectReciter(rec.id)}
                className={`w-full px-3 py-2.5 rounded-2xl border flex items-center justify-between gap-2.5 text-left transition active:scale-[0.99] ${
                  isSelected
                    ? isDay
                      ? 'bg-[#eef9ea] border-[#158509] text-[#0c4703]'
                      : 'bg-emerald-950 border-amber-400 text-amber-200'
                    : isDay
                    ? 'bg-white border-[#dde3ea] hover:border-[#158509]/50 text-slate-800'
                    : 'bg-slate-950/70 border-slate-800 hover:border-emerald-700 text-slate-200'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold truncate">{rec.name}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[9.5px] font-bold shrink-0 ${
                        isSelected
                          ? isDay
                            ? 'bg-[#158509] text-white nq-keep-dark'
                            : 'bg-amber-400 text-slate-950'
                          : isDay
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {rec.style[language]}
                    </span>
                  </div>
                  <p className="font-arabic text-xs opacity-75 truncate mt-0.5">
                    {rec.arabicName}
                  </p>
                </div>
                {isSelected && (
                  <Check
                    className={`w-4 h-4 shrink-0 ${
                      isDay ? 'text-[#158509]' : 'text-amber-400'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  ) : null;

  // ======================== SURAH DETAIL READER VIEW ========================
  if (activeSurahNumber && activeSurahData) {
    const displayAyahNum =
      currentPlayingAyah ?? highlightedAyah ?? (activeSurahData.ayahs[0]?.numberInSurah || 1);
    const totalLoadedAyahs = activeSurahData.ayahs.length;
    const locActiveSurah = getLocalizedSurahMeta(
      activeSurahData.number,
      activeSurahData.englishName,
      activeSurahData.englishNameTranslation,
      language
    );
    const progressPercent =
      audioDuration > 0 ? Math.min(100, Math.max(0, (audioCurrentTime / audioDuration) * 100)) : 0;

    const dlEntry = downloadMap[activeSurahData.number];
    const isDlActive = dlEntry?.status === 'downloading';
    const isAudioDone = hasNativeQuranAudioBridge()
      ? dlEntry?.status === 'done' ||
        isNativeAudioDownloaded(activeSurahData.number, activeReciter.storageKey)
      : dlEntry?.status === 'done' ||
        isWebAudioDownloaded(activeSurahData.number, activeReciter.storageKey);
    const isOfflineReady = isCurrentSavedOffline && isAudioDone;

    const fontCopy =
      language === 'ru'
        ? {
            btnTitle: 'Размер шрифта',
            arabicLabel: 'Арабский',
            transLabel: 'Перевод',
            reset: 'Стандарт',
          }
        : language === 'en'
        ? {
            btnTitle: 'Font Size',
            arabicLabel: 'Arabic',
            transLabel: 'Translation',
            reset: 'Default',
          }
        : language === 'uz_cyr'
        ? {
            btnTitle: 'Шрифт ўлчами',
            arabicLabel: 'Арабча',
            transLabel: 'Ўзбекча',
            reset: 'Стандарт',
          }
        : {
            btnTitle: "Shrift o'lchami",
            arabicLabel: 'Arabcha',
            transLabel: "O'zbekcha",
            reset: 'Standart',
          };

    return (
      <div className="flex-1 min-h-0 h-full flex flex-col overflow-hidden">
        {/* Clean Single-Row Surah Top Header: Back | Title | Mushaf Book + Font Size (Aa) + Download */}
        <div
          className={`shrink-0 z-20 -mx-3.5 px-3.5 py-2 border-b flex items-center justify-between gap-1.5 ${
            isDay
              ? 'bg-[#ecf1f5] border-[#d6dfe8] text-slate-900'
              : 'bg-slate-950 border-emerald-900/50 text-white'
          }`}
        >
          <button
            type="button"
            onClick={() => {
              if (isMushafBookMode) {
                setIsMushafBookMode(false);
              } else {
                closeSurahDetail();
              }
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition active:scale-95 shrink-0 ${
              isDay
                ? 'bg-white border-[#dde3ea] text-[#0c4703] hover:bg-[#eef9ea]'
                : 'bg-slate-900 border-emerald-900/60 text-emerald-300 hover:text-white'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{backButtonLabel || t.quran.backToSurahs}</span>
          </button>

          <h1
            className={`font-display text-[15px] font-bold tracking-tight truncate text-center flex-1 min-w-0 ${
              isDay ? 'text-[#0c4703]' : 'text-white'
            }`}
          >
            {activeSurahData.number}. {locActiveSurah.name}
          </h1>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Full Quran Only (Mushaf Book Mode) Toggle Button — Right of Surah Name, Left of Shrift (Aa) Button */}
            <button
              type="button"
              onClick={toggleMushafBookMode}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-extrabold transition active:scale-95 flex items-center gap-1 shrink-0 ${
                isMushafBookMode
                  ? isDay
                    ? 'bg-[#158509] border-[#0c4703] text-white nq-keep-dark shadow-xs'
                    : 'bg-amber-400 border-amber-300 text-slate-950 shadow-xs'
                  : isDay
                  ? 'bg-white border-[#dde3ea] text-[#0c4703] hover:bg-[#eef9ea]'
                  : 'bg-slate-900 border-emerald-900/60 text-amber-300 hover:text-white'
              }`}
              title={
                language === 'ru'
                  ? 'Режим Мусхафа (Книга)'
                  : language === 'en'
                  ? 'Mushaf Book Mode (Arabic Only)'
                  : language === 'uz_cyr'
                  ? 'Мусҳаф (Китоб) режими'
                  : 'Mushaf (Kitob) rejimi'
              }
              aria-label="Toggle Mushaf Book Mode"
            >
              <BookOpen className="w-4 h-4" />
            </button>

            {/* Shrift Size (Aa) Customization Toggle Button */}
            <button
              type="button"
              onClick={() => setIsFontSheetOpen((prev) => !prev)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-extrabold transition active:scale-95 flex items-center gap-1 shrink-0 ${
                isFontSheetOpen
                  ? isDay
                    ? 'bg-[#158509] border-[#0c4703] text-white nq-keep-dark'
                    : 'bg-amber-400 border-amber-300 text-slate-950'
                  : isDay
                  ? 'bg-white border-[#dde3ea] text-[#0c4703] hover:bg-[#eef9ea]'
                  : 'bg-slate-900 border-emerald-900/60 text-amber-300 hover:text-white'
              }`}
              title={fontCopy.btnTitle}
              aria-label={fontCopy.btnTitle}
            >
              <Type className="w-3.5 h-3.5" />
              <span className="text-[11px] leading-none">Aa</span>
            </button>

            <button
              type="button"
              onClick={toggleOfflineSave}
              disabled={isLoadingSurah || activeSurahData.ayahs.length === 0 || isDlActive}
              className={`px-2 py-1.5 rounded-xl border transition active:scale-95 disabled:opacity-90 flex items-center gap-1 shrink-0 ${
                isDlActive
                  ? isDay
                    ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#158509]'
                    : 'bg-emerald-950 border-emerald-700 text-amber-300'
                  : isOfflineReady
                  ? isDay
                    ? 'bg-[#158509] border-[#0c4703] text-white nq-keep-dark'
                    : 'bg-emerald-800 border-emerald-600 text-white'
                  : isDay
                  ? 'bg-white border-[#dde3ea] text-slate-600 hover:text-[#0c4703]'
                  : 'bg-slate-900 border-emerald-900/60 text-slate-300 hover:text-white'
              }`}
              title={
                isDlActive
                  ? `${dlEntry.pct}%`
                  : isOfflineReady
                  ? t.quran.savedOfflineLabel
                  : t.quran.saveOfflineBtn
              }
              aria-label={isOfflineReady ? t.quran.savedOfflineLabel : t.quran.saveOfflineBtn}
            >
              {isDlActive ? (
                <>
                  <CloudDownload className="w-4 h-4 animate-pulse" />
                  <span className="text-[11px] font-bold tabular-nums">{dlEntry.pct}%</span>
                </>
              ) : isOfflineReady ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <CloudDownload className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Distinct Tinted & Bordered Font Size (Shrift) Box — No space-eating title, with high-contrast X button */}
        {isFontSheetOpen && (
          <div className="shrink-0 z-20 pt-2 pb-1">
            <div
              className={`rounded-2xl border-2 px-3 py-2.5 space-y-2 shadow-sm ${
                isDay
                  ? 'bg-[#eef9ea] border-[#78c968] text-slate-900'
                  : 'bg-emerald-950/95 border-amber-400/75 text-slate-100'
              }`}
            >
              {/* Row 1: Arabcha Control + Visible Close (X) Button */}
              <div className="flex items-center gap-2">
                <span
                  className={`w-[72px] text-xs font-extrabold shrink-0 ${
                    isDay ? 'text-[#0c4703]' : 'text-amber-300'
                  }`}
                >
                  {fontCopy.arabicLabel}
                </span>

                <button
                  type="button"
                  onClick={() => updateArabicFontSize(arabicFontSize - 2)}
                  disabled={arabicFontSize <= MIN_ARABIC_FONT_SIZE}
                  className={`w-7 h-7 rounded-xl border flex items-center justify-center transition active:scale-90 disabled:opacity-35 shrink-0 ${
                    isDay
                      ? 'bg-white border-[#a8db9d] text-[#0c4703]'
                      : 'bg-slate-900 border-emerald-700 text-slate-100'
                  }`}
                  aria-label="Decrease Arabic font size"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <input
                  type="range"
                  min={MIN_ARABIC_FONT_SIZE}
                  max={MAX_ARABIC_FONT_SIZE}
                  step={1}
                  value={arabicFontSize}
                  onChange={(e) => updateArabicFontSize(Number(e.target.value))}
                  className="flex-1 min-w-[60px] accent-[#158509] h-1.5 rounded-lg cursor-pointer"
                />

                <button
                  type="button"
                  onClick={() => updateArabicFontSize(arabicFontSize + 2)}
                  disabled={arabicFontSize >= MAX_ARABIC_FONT_SIZE}
                  className={`w-7 h-7 rounded-xl border flex items-center justify-center transition active:scale-90 disabled:opacity-35 shrink-0 ${
                    isDay
                      ? 'bg-white border-[#a8db9d] text-[#0c4703]'
                      : 'bg-slate-900 border-emerald-700 text-slate-100'
                  }`}
                  aria-label="Increase Arabic font size"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>

                <span
                  className={`w-10 text-center font-mono font-extrabold py-0.5 rounded-lg text-[10.5px] border shrink-0 ${
                    isDay
                      ? 'bg-white border-[#b7e2ad] text-[#0c4703]'
                      : 'bg-slate-900 border-emerald-800 text-amber-300'
                  }`}
                >
                  {arabicFontSize}
                </span>

                {isMushafBookMode && (
                  <button
                    type="button"
                    onClick={() => updateArabicFontSize(DEFAULT_ARABIC_FONT_SIZE)}
                    className={`w-7 h-7 rounded-xl border flex items-center justify-center transition active:scale-90 shrink-0 ${
                      isDay
                        ? 'bg-white border-[#a8db9d] text-slate-600 hover:text-[#0c4703]'
                        : 'bg-slate-900 border-emerald-700 text-slate-300 hover:text-white'
                    }`}
                    aria-label={fontCopy.reset}
                    title={fontCopy.reset}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsFontSheetOpen(false)}
                  className={`w-7 h-7 rounded-xl border flex items-center justify-center transition active:scale-90 shrink-0 ${
                    isDay
                      ? 'bg-white border-[#78c968] text-[#0c4703] hover:bg-rose-50 hover:text-rose-600'
                      : 'bg-slate-900 border-amber-400/70 text-amber-300 hover:text-white'
                  }`}
                  aria-label="Close Font Settings"
                  title="Yopish"
                >
                  <X className="w-4 h-4 stroke-[2.4]" />
                </button>
              </div>

              {/* Row 2: O'zbekcha / Translation Control + Default Reset Button (Hidden in Arabic-Only Mushaf Mode) */}
              {!isMushafBookMode && (
                <div className="flex items-center gap-2">
                  <span
                    className={`w-[72px] text-xs font-extrabold shrink-0 ${
                      isDay ? 'text-[#0c4703]' : 'text-amber-300'
                    }`}
                  >
                    {fontCopy.transLabel}
                  </span>

                  <button
                    type="button"
                    onClick={() => updateTransFontSize(transFontSize - 1)}
                    disabled={transFontSize <= MIN_TRANS_FONT_SIZE}
                    className={`w-7 h-7 rounded-xl border flex items-center justify-center transition active:scale-90 disabled:opacity-35 shrink-0 ${
                      isDay
                        ? 'bg-white border-[#a8db9d] text-[#0c4703]'
                        : 'bg-slate-900 border-emerald-700 text-slate-100'
                    }`}
                    aria-label="Decrease Translation font size"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <input
                    type="range"
                    min={MIN_TRANS_FONT_SIZE}
                    max={MAX_TRANS_FONT_SIZE}
                    step={1}
                    value={transFontSize}
                    onChange={(e) => updateTransFontSize(Number(e.target.value))}
                    className="flex-1 min-w-[60px] accent-[#158509] h-1.5 rounded-lg cursor-pointer"
                  />

                  <button
                    type="button"
                    onClick={() => updateTransFontSize(transFontSize + 1)}
                    disabled={transFontSize >= MAX_TRANS_FONT_SIZE}
                    className={`w-7 h-7 rounded-xl border flex items-center justify-center transition active:scale-90 disabled:opacity-35 shrink-0 ${
                      isDay
                        ? 'bg-white border-[#a8db9d] text-[#0c4703]'
                        : 'bg-slate-900 border-emerald-700 text-slate-100'
                    }`}
                    aria-label="Increase Translation font size"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>

                  <span
                    className={`w-10 text-center font-mono font-extrabold py-0.5 rounded-lg text-[10.5px] border shrink-0 ${
                      isDay
                        ? 'bg-white border-[#b7e2ad] text-[#0c4703]'
                        : 'bg-slate-900 border-emerald-800 text-amber-300'
                    }`}
                  >
                    {transFontSize}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      updateArabicFontSize(DEFAULT_ARABIC_FONT_SIZE);
                      updateTransFontSize(DEFAULT_TRANS_FONT_SIZE);
                    }}
                    className={`w-7 h-7 rounded-xl border flex items-center justify-center transition active:scale-90 shrink-0 ${
                      isDay
                        ? 'bg-white border-[#a8db9d] text-slate-600 hover:text-[#0c4703]'
                        : 'bg-slate-900 border-emerald-700 text-slate-300 hover:text-white'
                    }`}
                    aria-label={fontCopy.reset}
                    title={fontCopy.reset}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Independently Scrollable Middle Verses Area (Or Full-Screen Mushaf View when Book Mode is active) */}
        <div
          ref={versesScrollRef}
          className={`flex-1 min-h-0 -mx-3.5 ${
            isMushafBookMode && !isLoadingSurah
              ? 'flex flex-col overflow-hidden px-2 pt-1.5 pb-1.5'
              : 'overflow-y-auto no-scrollbar px-3.5'
          }`}
        >
          {/* Loading State Centered Inside Middle Container */}
          {isLoadingSurah && (
            <div className="h-full flex flex-col items-center justify-center py-12 space-y-3">
              <div
                className={`w-9 h-9 border-4 border-t-transparent rounded-full animate-spin ${
                  isDay ? 'border-[#158509]' : 'border-amber-400'
                }`}
              />
              <p className={`text-xs font-medium ${isDay ? 'text-slate-600' : 'text-slate-400'}`}>
                {t.quran.loading}
              </p>
            </div>
          )}

          {/* ======================== FULL-SCREEN MUSHAF READER MODE (ARABIC ONLY + CLEAN SWIPE + WORD-ONLY HIGHLIGHT) ======================== */}
          {!isLoadingSurah && isMushafBookMode && mushafBookPages.length > 0 && (() => {
            const safeIdx = Math.max(0, Math.min(mushafBookPages.length - 1, bookPageIdx));
            const curLeaf = mushafBookPages[safeIdx];
            const totalLeaves = mushafBookPages.length;

            const centeredPageIndicator =
              language === 'ru'
                ? `${safeIdx + 1} / ${totalLeaves}`
                : language === 'en'
                ? `${safeIdx + 1} / ${totalLeaves}`
                : language === 'uz_cyr'
                ? `${safeIdx + 1} / ${totalLeaves}`
                : `${safeIdx + 1} / ${totalLeaves}`;

            return (
              <div
                className="flex-1 min-h-0 flex flex-col select-none"
                onTouchStart={(e) => {
                  const t0 = e.changedTouches[0];
                  if (t0) {
                    bookTouchStartRef.current = { x: t0.clientX, y: t0.clientY };
                  }
                }}
                onTouchEnd={(e) => {
                  const start = bookTouchStartRef.current;
                  bookTouchStartRef.current = null;
                  const t1 = e.changedTouches[0];
                  if (!start || !t1) return;
                  const dx = t1.clientX - start.x;
                  const dy = t1.clientY - start.y;
                  if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy) * 1.15) {
                    // Arabic Mushaf (Right-to-Left flow):
                    // Swiping to the RIGHT (dx > 0) pulls the next page from the left (1/3 -> 2/3 -> 3/3 -> Next Surah).
                    // Swiping to the LEFT (dx < 0) goes back to the previous page (3/3 -> 2/3 -> 1/3 -> Previous Surah).
                    if (dx > 0) {
                      if (safeIdx < totalLeaves - 1) {
                        turnToBookPage(safeIdx + 1);
                      } else if (activeSurahData.number < 114) {
                        switchReaderSurah(1);
                      }
                    } else {
                      if (safeIdx > 0) {
                        turnToBookPage(safeIdx - 1);
                      } else if (activeSurahData.number > 1) {
                        switchReaderSurah(-1);
                      }
                    }
                  }
                }}
              >
                {/* Clean Full-Height Mushaf Frame (Zero 3D GPU tilt, works smoothly on all phones) */}
                <div
                  key={`${activeSurahData.number}-leaf-${safeIdx}`}
                  className={`relative flex-1 min-h-0 flex flex-col rounded-2xl border-2 overflow-hidden transition-colors duration-150 ${
                    isDay
                      ? 'bg-[#fcf8ee] border-[#c8a962] shadow-sm'
                      : 'bg-[#071a14] border-amber-500/65 shadow-md'
                  }`}
                >
                  {/* Top Bar: Page Indicator Placed Cleanly in the Exact Middle (No Arabic title on right, no Mushaf bet/juz text) */}
                  <div
                    className={`shrink-0 px-3 py-1.5 border-b flex items-center justify-center ${
                      isDay
                        ? 'bg-[#f4ebd4]/90 border-[#dec484] text-[#5a4312]'
                        : 'bg-emerald-950/90 border-amber-500/40 text-amber-300'
                    }`}
                  >
                    <span className="font-mono text-xs font-extrabold tracking-wider">
                      {centeredPageIndicator}
                    </span>
                  </div>

                  {/* Full-Bleed Inner Ornate Mushaf Page Body */}
                  <div
                    ref={bookPageScrollRef}
                    className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-1.5"
                  >
                    <div
                      className={`min-h-full rounded-xl border px-3.5 py-3 flex flex-col justify-between ${
                        isDay
                          ? 'border-[#dfc588] bg-[#fdfaf2]/95'
                          : 'border-amber-500/35 bg-[#081f18]/85'
                      }`}
                    >
                      {/* Opening Bismillah on Page 1 (Without duplicate Arabic Surah box) */}
                      {curLeaf.isFirstPage && activeSurahData.bismillahPre && (
                        <div className="mb-2.5 pb-1.5 border-b border-dashed border-[#dfc588]/70 text-center">
                          <p
                            style={{
                              fontSize: `${Math.max(20, Math.round(arabicFontSize * 0.88))}px`,
                              lineHeight: 1.75,
                            }}
                            className={`font-arabic ${
                              isDay ? 'text-[#0c4703]' : 'text-amber-200'
                            }`}
                          >
                            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                          </p>
                        </div>
                      )}

                      {/* Continuous Flowing RTL Arabic Mushaf Text — Word-Only Highlighting & Uniform Uthmani Spacing */}
                      <div
                        dir="rtl"
                        style={{
                          fontSize: `${arabicFontSize}px`,
                          lineHeight: 2.12,
                          textAlign: 'right',
                        }}
                        className={`font-arabic font-normal my-auto transition-[font-size] duration-150 ${
                          isDay ? 'text-slate-900' : 'text-amber-50'
                        }`}
                      >
                        {curLeaf.ayahs.map((ayah) => {
                          const isAyahActive = currentPlayingAyah === ayah.numberInSurah;
                          const wordsList = getAyahWordsList(ayah);
                          const effectiveWordPos = isAyahActive
                            ? activeWordPos ?? wordsList[0]?.position ?? 1
                            : null;

                          return (
                            <span
                              key={ayah.numberInSurah}
                              id={`mushaf-ayah-${ayah.numberInSurah}`}
                              onClick={() => handlePlayAyahCard(ayah.numberInSurah)}
                              className="inline cursor-pointer"
                            >
                              {wordsList.map((word, wIdx) => {
                                const isWordActive =
                                  isAyahActive && effectiveWordPos === word.position;
                                const isLastWord = wIdx === wordsList.length - 1;
                                return (
                                  <React.Fragment key={word.position}>
                                    <span
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handlePlayWord(ayah.numberInSurah, word.position);
                                      }}
                                      className={`rounded-md px-1 -mx-1 py-0.5 transition-colors duration-100 ${
                                        isWordActive
                                          ? isDay
                                            ? 'bg-[#158509] text-white nq-keep-dark shadow-2xs'
                                            : 'bg-amber-400 text-slate-950 shadow-2xs'
                                          : ''
                                      }`}
                                    >
                                      {word.text}
                                    </span>
                                    {isLastWord ? '\u00A0' : ' '}
                                  </React.Fragment>
                                );
                              })}
                              {/* Ornate Mushaf Ayah End Medallion ﴿١﴾ attached cleanly with non-breaking space */}
                              <span
                                className={`inline whitespace-nowrap text-[0.76em] font-bold select-none ${
                                  isAyahActive
                                    ? isDay
                                      ? 'text-[#158509]'
                                      : 'text-amber-300'
                                    : isDay
                                    ? 'text-[#8b6914]'
                                    : 'text-amber-400/85'
                                }`}
                              >
                                ﴿{toArabicIndicNumber(ayah.numberInSurah)}﴾
                              </span>{' '}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Verses Reading Stream (pb-10 ensures last Ayah always scrolls cleanly above the bottom player without clipping) */}
          {!isLoadingSurah && !isMushafBookMode && (
            <div className="space-y-3 pt-3 pb-10">
            {activeSurahData.bismillahPre && (
              <div
                className={`text-center py-3 px-4 rounded-2xl border ${
                  isDay
                    ? 'bg-white border-[#dde3ea] text-[#0c4703]'
                    : 'bg-slate-900/70 border-emerald-900/40 text-amber-200'
                }`}
              >
                <p
                  style={{ fontSize: `${Math.max(20, Math.round(arabicFontSize * 0.92))}px`, lineHeight: 1.85 }}
                  className="font-arabic transition-[font-size] duration-150"
                >
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              </div>
            )}

            {(() => {
              const bookmarkedSet = new Set<number>();
              for (const b of bookmarks) {
                if (b.surahNumber === activeSurahData.number) {
                  bookmarkedSet.add(b.ayahNumber);
                }
              }
              const savedAyahBadgeLabel =
                language === 'uz_cyr'
                  ? 'Сақланган оят'
                  : language === 'ru'
                  ? 'Сохранённый аят'
                  : language === 'en'
                  ? 'Saved Ayah'
                  : 'Saqlangan oyat';
              return activeSurahData.ayahs.slice(0, visibleAyahCount).map((ayah) => {
                const isActive = currentPlayingAyah === ayah.numberInSurah;
                const isHighlighted = highlightedAyah === ayah.numberInSurah;
                return (
                  <AyahCard
                    key={ayah.numberInSurah}
                    ayah={ayah}
                    surahNumber={activeSurahData.number}
                    surahName={locActiveSurah.name}
                    selectedTranslation={selectedTranslation}
                    arabicFontSize={arabicFontSize}
                    transFontSize={transFontSize}
                    isDay={isDay}
                    isActive={isActive}
                    isHighlighted={isHighlighted}
                    highlightBadgeLabel={bookmarkedSet.has(ayah.numberInSurah) ? savedAyahBadgeLabel : undefined}
                    isPlayingThis={isActive && isAudioPlaying}
                    activeWordPos={isActive ? activeWordPos : null}
                    isBookmarked={bookmarkedSet.has(ayah.numberInSurah)}
                    isCopied={copiedAyah === ayah.numberInSurah}
                    isSharing={sharingAyah === ayah.numberInSurah}
                    onPlayAyah={handlePlayAyahCard}
                    onTogglePlayPause={handleTogglePlayPause}
                    onCopyAyah={handleCopyAyah}
                    onShareAyah={handleShareAyahCard}
                    onToggleBookmark={handleToggleBookmarkStable}
                  />
                );
              });
            })()}
            {visibleAyahCount < activeSurahData.ayahs.length && (
              <div ref={ayahSentinelRef} className="py-3 text-center">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleAyahCount((prev) =>
                      Math.min(activeSurahData.ayahs.length, prev + 35)
                    )
                  }
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                    isDay
                      ? 'bg-white border-[#dde3ea] text-[#0c4703] hover:bg-[#eef9ea]'
                      : 'bg-slate-900 border-emerald-800/60 text-amber-300 hover:bg-emerald-950'
                  }`}
                >
                  + {Math.min(35, activeSurahData.ayahs.length - visibleAyahCount)} / {activeSurahData.ayahs.length - visibleAyahCount}
                </button>
              </div>
            )}
            </div>
          )}
        </div>

        {/* Bottom Audio Player:
            - In Mushaf Book Mode: Shows ONLY the compact 1-row Home-style docked bottom bar (rounded-t-3xl) so the Mushaf book opens at maximum full-screen height.
            - In Normal Verse + Translation Mode: Shows the frosted-glass Surah player. */}
        {isMushafBookMode ? (
          <div
            style={
              isNative
                ? {
                    paddingBottom:
                      'calc(max(env(safe-area-inset-bottom, 0px), var(--safe-area-inset-bottom, 0px)) + 8px)',
                  }
                : undefined
            }
            className={`shrink-0 -mx-3.5 rounded-t-3xl border-t-2 overflow-hidden z-30 transition-colors ${
              isDay
                ? 'bg-[#f2fbef] border-[#9fd895] shadow-[0_-6px_20px_rgba(12,71,3,0.08)]'
                : 'bg-slate-900/95 border-emerald-700/80 shadow-[0_-6px_22px_rgba(0,0,0,0.48)]'
            }`}
          >
            {/* Thin embedded progress accent along top curve */}
            <div className={`w-full h-[2.5px] ${isDay ? 'bg-[#d6efd0]' : 'bg-emerald-950'}`}>
              <div
                className={`h-full transition-all duration-200 ${
                  isDay ? 'bg-[#158509]' : 'bg-amber-400'
                }`}
                style={{
                  width: `${
                    progressPercent > 0
                      ? progressPercent
                      : totalLoadedAyahs > 0
                      ? Math.min(100, Math.max(4, Math.round((displayAyahNum / totalLoadedAyahs) * 100)))
                      : 0
                  }%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between gap-2 px-3.5 py-2">
              <button
                type="button"
                onClick={() => setIsReciterPickerOpen(true)}
                className="flex items-center gap-2.5 min-w-0 flex-1 text-left"
                title={activeReciter.name}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isDay
                      ? 'bg-[#e1f5da] text-[#158509] border border-[#b2e0a8]'
                      : 'bg-emerald-950 text-amber-400 border border-emerald-800/60'
                  }`}
                >
                  <img
                    src="/icons/home/quran.webp"
                    alt=""
                    className="w-5 h-5 object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-bold truncate ${isDay ? 'text-[#0c4703]' : 'text-white'}`}>
                    {activeSurahData.number}. {locActiveSurah.name}
                  </p>
                  <p className={`text-[10.5px] truncate tabular-nums flex items-center gap-1 ${isDay ? 'text-slate-600' : 'text-slate-400'}`}>
                    <span>
                      {displayAyahNum}/{totalLoadedAyahs} · {activeReciter.shortName}
                    </span>
                    <ChevronDown className="w-3 h-3 shrink-0 opacity-75" />
                  </p>
                </div>
              </button>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => switchReaderSurah(-1)}
                  disabled={activeSurahData.number <= 1}
                  className={`p-2 rounded-xl border transition active:scale-95 disabled:opacity-35 ${
                    isDay
                      ? 'bg-white border-[#c3e2bc] text-[#0c4703] hover:bg-[#e1f5db]'
                      : 'bg-slate-800 border-emerald-800/60 text-slate-200 hover:text-white'
                  }`}
                  aria-label={t.quran.prevSurah}
                >
                  <SkipBack className="w-3.5 h-3.5 fill-current" />
                </button>

                <button
                  type="button"
                  onClick={handleTogglePlayPause}
                  className={`p-2 rounded-xl transition active:scale-95 shadow-xs ${
                    isDay
                      ? 'bg-[#158509] text-white nq-keep-dark'
                      : 'bg-amber-400 text-slate-950'
                  }`}
                  aria-label={isAudioPlaying ? t.quran.pause : t.quran.recite}
                >
                  {isAudioPlaying ? (
                    <Pause className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => switchReaderSurah(1)}
                  disabled={activeSurahData.number >= 114}
                  className={`p-2 rounded-xl border transition active:scale-95 disabled:opacity-35 ${
                    isDay
                      ? 'bg-white border-[#c3e2bc] text-[#0c4703] hover:bg-[#e1f5db]'
                      : 'bg-slate-800 border-emerald-800/60 text-slate-200 hover:text-white'
                  }`}
                  aria-label={t.quran.nextSurah}
                >
                  <SkipForward className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            style={
              isNative
                ? {
                    paddingBottom:
                      'calc(max(env(safe-area-inset-bottom, 0px), var(--safe-area-inset-bottom, 0px)) + 10px)',
                  }
                : undefined
            }
            className={`shrink-0 z-30 -mx-3.5 px-3 pt-2 ${!isNative ? 'pb-3' : ''} backdrop-blur-md border-t transition-colors ${
              isDay
                ? 'bg-[#ecf1f5]/70 border-white/60'
                : 'bg-slate-950/70 border-emerald-900/35'
            }`}
          >
            <div
              className={`rounded-3xl border px-4 py-3 backdrop-blur-xl transition-colors ${
                isDay
                  ? 'bg-white/82 border-white/90 shadow-[0_6px_22px_rgba(12,71,3,0.10)] ring-1 ring-[#cde8c3]/60'
                  : 'bg-slate-900/82 border-emerald-800/60 shadow-[0_6px_22px_rgba(0,0,0,0.55)]'
              }`}
            >
              {/* Compact Top Info Strip + Qori Reciter Switcher */}
              <div className="flex items-center justify-between gap-2 text-[11px] mb-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <button
                    type="button"
                    onClick={() => setIsReciterPickerOpen(true)}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10.5px] font-bold transition active:scale-95 max-w-[155px] ${
                      isDay
                        ? 'bg-[#eef9ea]/90 text-[#0c4703] border-[#c5e8bc] hover:border-[#158509]'
                        : 'bg-emerald-950/90 text-amber-300 border-emerald-800/70 hover:border-amber-400'
                    }`}
                    title={activeReciter.name}
                  >
                    <Headphones className="w-3 h-3 shrink-0" />
                    <span className="truncate">{activeReciter.shortName}</span>
                    <ChevronDown className="w-3 h-3 shrink-0 opacity-75" />
                  </button>
                  <span
                    className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold shrink-0 ${
                      isDay
                        ? 'bg-[#f1f5f9]/90 text-slate-700 border border-[#dde3ea]'
                        : 'bg-slate-800/90 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {displayAyahNum}/{totalLoadedAyahs}
                  </span>
                </div>
                <span className={`tabular-nums font-medium shrink-0 ${isDay ? 'text-slate-600' : 'text-slate-300'}`}>
                  {formatAudioTime(audioCurrentTime)} / {formatAudioTime(audioDuration)}
                </span>
              </div>

              {/* Soft 60fps Linear Progress Track with Clamped Thumb */}
              <div className="relative h-5 flex items-center mb-1.5">
                <div
                  className={`w-full h-1.5 rounded-full overflow-hidden ${
                    isDay ? 'bg-[#e2e8f0]/90' : 'bg-slate-800/90'
                  }`}
                >
                  <div
                    className={`h-full rounded-full ${
                      isDay
                        ? 'bg-gradient-to-r from-[#158509] to-[#2e9a22]'
                        : 'bg-gradient-to-r from-amber-500 to-amber-300'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Smooth Clamped Thumb Dot (Never clips past track edges) */}
                <div
                  className={`absolute w-3.5 h-3.5 rounded-full border-2 shadow-sm pointer-events-none -translate-x-1/2 ${
                    isDay
                      ? 'bg-[#158509] border-white'
                      : 'bg-amber-400 border-slate-950'
                  }`}
                  style={{ left: `clamp(7px, ${progressPercent}%, calc(100% - 7px))` }}
                />

                <input
                  type="range"
                  min={0}
                  max={audioDuration > 0 ? audioDuration : 100}
                  step={0.01}
                  value={audioDuration > 0 ? Math.min(audioCurrentTime, audioDuration) : 0}
                  onChange={handleSeek}
                  disabled={audioDuration <= 0 && currentPlayingAyah === null}
                  aria-label="Overall Surah Audio Progress"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              {/* Clean 3-Control Centered Surah Transport Bar: Prev Surah, Play/Pause, Next Surah */}
              <div className="flex items-center justify-center gap-6 pt-0.5">
                {/* Previous Surah */}
                <button
                  type="button"
                  onClick={() => switchReaderSurah(-1)}
                  disabled={activeSurahData.number <= 1}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition active:scale-95 disabled:opacity-30 ${
                    isDay
                      ? 'bg-[#eef3f7]/90 text-[#0c4703] hover:bg-[#e1f5db]'
                      : 'bg-slate-800/90 text-emerald-300 hover:bg-slate-700'
                  }`}
                  aria-label={t.quran.prevSurah}
                  title={t.quran.prevSurah}
                >
                  <SkipBack className="w-4 h-4 fill-current" />
                </button>

                {/* Primary Play / Pause */}
                <button
                  type="button"
                  onClick={handleTogglePlayPause}
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition active:scale-95 ${
                    isDay
                      ? 'bg-gradient-to-br from-[#158509] to-[#0c4703] text-white nq-keep-dark'
                      : 'bg-gradient-to-br from-amber-300 to-amber-500 text-slate-950'
                  }`}
                  aria-label={isAudioPlaying ? t.quran.pause : t.quran.recite}
                >
                  {isAudioPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </button>

                {/* Next Surah */}
                <button
                  type="button"
                  onClick={() => switchReaderSurah(1)}
                  disabled={activeSurahData.number >= 114}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition active:scale-95 disabled:opacity-30 ${
                    isDay
                      ? 'bg-[#eef3f7]/90 text-[#0c4703] hover:bg-[#e1f5db]'
                      : 'bg-slate-800/90 text-emerald-300 hover:bg-slate-700'
                  }`}
                  aria-label={t.quran.nextSurah}
                  title={t.quran.nextSurah}
                >
                  <SkipForward className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>
          </div>
        )}

        {reciterPickerModal}

        {shareToast && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-xl border border-emerald-600/50 max-w-[90vw] truncate">
            {shareToast}
          </div>
        )}
      </div>
    );
  }

  // ======================== SURAH DIRECTORY & SEARCH VIEW ========================
  const isFriday = new Date().getDay() === 5;
  const lastReadSurahMeta = lastRead
    ? ALL_SURAHS.find((s) => s.number === lastRead.surahNumber)
    : undefined;
  const locLastRead = lastReadSurahMeta
    ? getLocalizedSurahMeta(
        lastReadSurahMeta.number,
        lastReadSurahMeta.englishName,
        lastReadSurahMeta.englishNameTranslation,
        language
      )
    : null;
  const khatmPct = Math.round((completedSurahs.length / 114) * 100);

  return (
    <div className="space-y-2.5 pb-6">
      {/* Smart Quran Banner: Continue Reading + Khatm Progress */}
      <div
        className={`nq-keep-dark rounded-3xl border p-3.5 text-white shadow-sm space-y-2.5 ${
          isDay
            ? 'nq-hero-day border-[#13690f]/40'
            : 'nq-hero-night border-emerald-800/60'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#d0f39f] block">
              {lastRead && locLastRead ? t.quran.continueReading : t.quran.khatmProgress}
            </span>
            {lastRead && locLastRead ? (
              <p className="text-sm font-bold text-white truncate mt-0.5">
                {lastRead.surahNumber}. {locLastRead.name} · {t.quran.ayahWord} {lastRead.ayahNumber}
              </p>
            ) : (
              <p className="text-sm font-bold text-white truncate mt-0.5">
                {completedSurahs.length} / 114 {t.tabTitles.quran}
              </p>
            )}
          </div>

          {lastRead && locLastRead && (
            <button
              type="button"
              onClick={() => loadSurah(lastRead.surahNumber, false, lastRead.ayahNumber)}
              className="px-3 py-1.5 rounded-xl bg-[#d0f39f] text-[#0c4703] text-xs font-bold shrink-0 active:scale-95 transition"
            >
              {t.quran.resumeBtn}
            </button>
          )}
        </div>

        {/* Khatm Goal Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10.5px] text-white/85">
            <span>{t.quran.khatmProgress}</span>
            <span className="font-mono font-bold text-[#fde68a]">
              {completedSurahs.length}/114 ({khatmPct}%)
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/15 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#d0f39f] to-[#fde68a] transition-all duration-500"
              style={{ width: `${Math.max(2, khatmPct)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Friday Sunnah Card (Highlighted on Juma, compact shortcut) */}
      {isFriday && (
        <div
          className={`rounded-2xl border px-3 py-2.5 flex items-center justify-between gap-2 ${
            isDay
              ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
              : 'bg-emerald-950/70 border-amber-400/50 text-amber-200'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`p-1.5 rounded-xl shrink-0 ${
                isDay ? 'bg-[#158509] text-white nq-keep-dark' : 'bg-amber-400 text-slate-950'
              }`}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold truncate">{t.quran.jumaKahfTitle}</p>
              <p className={`text-[10.5px] truncate ${isDay ? 'text-slate-600' : 'text-slate-300'}`}>
                {t.quran.jumaKahfDesc}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => loadSurah(18)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition active:scale-95 ${
              isDay ? 'bg-[#158509] text-white nq-keep-dark' : 'bg-amber-400 text-slate-950'
            }`}
          >
            {t.quran.openBtn}
          </button>
        </div>
      )}

      {/* Clean Search Bar */}
      <div className="relative">
        <Search
          className={`absolute left-3.5 top-3 w-4 h-4 ${
            isDay ? 'text-[#158509]' : 'text-emerald-400'
          }`}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.quran.searchPlaceholder}
          className={`w-full border rounded-2xl pl-10 pr-16 py-2.5 text-sm focus:outline-none transition ${
            isDay
              ? 'bg-white border-[#dde3ea] text-slate-900 placeholder-slate-400 focus:border-[#158509]'
              : 'bg-slate-900 border-emerald-900/60 text-white placeholder-slate-400 focus:border-amber-400'
          }`}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className={`absolute right-3 top-2.5 text-xs px-2 py-0.5 rounded-lg font-medium ${
              isDay ? 'bg-[#ecf1f5] text-slate-600' : 'bg-slate-800 text-slate-300'
            }`}
          >
            ✕
          </button>
        )}
      </div>

      {/* Uniform Full-Width 3-Column Segmented Control: All 114 | 30 Juz | Saved */}
      <div
        className={`grid grid-cols-3 gap-1 p-1 rounded-2xl border ${
          isDay ? 'bg-white border-[#dde3ea] shadow-xs' : 'bg-slate-900 border-emerald-900/60'
        }`}
      >
        <button
          type="button"
          onClick={() => setFilterType('all')}
          className={`py-2 px-2 rounded-xl text-[11.5px] font-bold transition truncate ${
            filterType === 'all'
              ? isDay
                ? 'bg-[#158509] text-white nq-keep-dark shadow-xs'
                : 'bg-amber-400 text-slate-950 shadow-xs'
              : isDay
              ? 'text-slate-600 hover:text-slate-900'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {t.quran.allSurahs}
        </button>

        <button
          type="button"
          onClick={() => setFilterType('juz')}
          className={`py-2 px-2 rounded-xl text-[11.5px] font-bold transition flex items-center justify-center gap-1 truncate ${
            filterType === 'juz'
              ? isDay
                ? 'bg-[#158509] text-white nq-keep-dark shadow-xs'
                : 'bg-amber-400 text-slate-950 shadow-xs'
              : isDay
              ? 'text-slate-600 hover:text-slate-900'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{t.quran.juzTab}</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterType('bookmarks')}
          className={`py-2 px-2 rounded-xl text-[11.5px] font-bold transition flex items-center justify-center gap-1 truncate ${
            filterType === 'bookmarks'
              ? isDay
                ? 'bg-[#158509] text-white nq-keep-dark shadow-xs'
                : 'bg-amber-400 text-slate-950 shadow-xs'
              : isDay
              ? 'text-slate-600 hover:text-slate-900'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">
            {t.quran.saved} ({bookmarks.length})
          </span>
        </button>
      </div>

      {/* 30 JUZ INDEX VIEW OR SURAH LIST */}
      {filterType === 'juz' ? (
        <div className="space-y-2">
          {QURAN_JUZ_LIST.filter((entry) => {
            const q = searchQuery.toLowerCase().trim();
            if (!q) return true;
            const startMeta = ALL_SURAHS.find((s) => s.number === entry.startSurah);
            const locStart = startMeta
              ? getLocalizedSurahMeta(startMeta.number, startMeta.englishName, startMeta.englishNameTranslation, language)
              : null;
            return (
              entry.juz.toString() === q ||
              `${t.quran.juzLabel} ${entry.juz}`.toLowerCase().includes(q) ||
              Boolean(locStart?.name.toLowerCase().includes(q))
            );
          }).map((entry) => {
            const startMeta = ALL_SURAHS.find((s) => s.number === entry.startSurah)!;
            const locStart = getLocalizedSurahMeta(
              startMeta.number,
              startMeta.englishName,
              startMeta.englishNameTranslation,
              language
            );
            return (
              <button
                key={entry.juz}
                type="button"
                onClick={() => loadSurah(entry.startSurah, false, entry.startAyah)}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition text-left active:scale-[0.99] ${
                  isDay
                    ? 'bg-white border-[#dde3ea] hover:border-[#158509]/50 shadow-xs'
                    : 'bg-slate-900/80 border-emerald-900/40 hover:border-amber-400/50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl font-bold text-xs font-mono flex items-center justify-center shrink-0 border ${
                      isDay
                        ? 'bg-[#eef9ea] border-[#cde8c3] text-[#0c4703]'
                        : 'bg-emerald-950 border-emerald-800/80 text-amber-300'
                    }`}
                  >
                    {entry.juz}
                  </div>
                  <div className="min-w-0">
                    <p className={`font-semibold text-sm ${isDay ? 'text-slate-900' : 'text-white'}`}>
                      {t.quran.juzLabel} {entry.juz}
                    </p>
                    <p className={`text-xs truncate ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                      {t.quran.startsAtAyah}{' '}
                      <span className={isDay ? 'text-[#158509] font-medium' : 'text-emerald-300'}>
                        {locStart.name} ({entry.startSurah}:{entry.startAyah})
                      </span>
                    </p>
                  </div>
                </div>

                <ChevronRight className={`w-4 h-4 shrink-0 ${isDay ? 'text-slate-400' : 'text-slate-500'}`} />
              </button>
            );
          })}
        </div>
      ) : (
        <div ref={directoryListRef} className="space-y-2">
          {filteredSurahs.map((surah) => {
            const hasBookmark = bookmarks.some((b) => b.surahNumber === surah.number);
            const isRead = completedSurahs.includes(surah.number);
            const isCached = Boolean(PRELOADED_SURAHS[surah.number] || offlineSavedSet.has(surah.number));
            const locSurah = getLocalizedSurahMeta(
              surah.number,
              surah.englishName,
              surah.englishNameTranslation,
              language
            );

            const cardDl = downloadMap[surah.number];
            const cardDlActive = cardDl?.status === 'downloading';
            const cardAudioDone = hasNativeQuranAudioBridge()
              ? cardDl?.status === 'done' ||
                isNativeAudioDownloaded(surah.number, activeReciter.storageKey)
              : cardDl?.status === 'done' ||
                isWebAudioDownloaded(surah.number, activeReciter.storageKey);
            const cardFullySaved = isCached && cardAudioDone;

            return (
              <div
                key={surah.number}
                id={`surah-card-${surah.number}`}
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  const scrollContainer = e.currentTarget.closest('.overflow-y-auto') as HTMLElement | null;
                  savedListScrollTopRef.current = scrollContainer?.scrollTop ?? 0;
                  tappedListSurahRef.current = surah.number;
                  loadSurah(surah.number);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    tappedListSurahRef.current = surah.number;
                    loadSurah(surah.number);
                  }
                }}
                className={`nq-surah-row w-full flex items-center justify-between p-3.5 rounded-2xl border transition text-left cursor-pointer active:scale-[0.99] ${
                  isDay
                    ? 'bg-white border-[#dde3ea] hover:border-[#158509]/50 shadow-xs'
                    : 'bg-slate-900/80 border-emerald-900/40 hover:border-amber-400/50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMarkSurahRead(surah.number);
                    }}
                    title={t.quran.markReadBtn}
                    className={`w-10 h-10 rounded-xl font-bold text-xs font-mono flex items-center justify-center shrink-0 border transition active:scale-90 ${
                      isRead
                        ? isDay
                          ? 'bg-[#158509] border-[#0c4703] text-white nq-keep-dark'
                          : 'bg-amber-400 border-amber-300 text-slate-950'
                        : isDay
                        ? 'bg-[#eef9ea] border-[#cde8c3] text-[#0c4703]'
                        : 'bg-emerald-950 border-emerald-800/80 text-amber-300'
                    }`}
                  >
                    {surah.number}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`font-semibold text-sm truncate ${
                          isDay ? 'text-slate-900' : 'text-white'
                        }`}
                      >
                        {locSurah.name}
                      </span>
                      {hasBookmark && (
                        <BookmarkCheck
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isDay ? 'text-[#158509]' : 'text-amber-400'
                          }`}
                        />
                      )}
                      {cardDlActive ? (
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold tabular-nums shrink-0 ${
                            isDay
                              ? 'bg-[#eef9ea] text-[#158509] border border-[#c5e8bc]'
                              : 'bg-emerald-950 text-amber-300 border border-emerald-800'
                          }`}
                        >
                          {cardDl.pct}%
                        </span>
                      ) : cardFullySaved ? (
                        <CheckCircle2
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isDay ? 'text-[#158509]' : 'text-emerald-400'
                          }`}
                        />
                      ) : null}
                    </div>
                    <p className={`text-xs truncate ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                      {locSurah.meaning} ·{' '}
                      <span className={isDay ? 'text-[#158509] font-medium' : 'text-emerald-400'}>
                        {surah.numberOfAyahs} {t.quran.versesUnit}
                      </span>
                    </p>
                  </div>
                </div>

                <ChevronRight
                  className={`w-4 h-4 shrink-0 ${
                    isDay ? 'text-slate-400' : 'text-slate-500'
                  }`}
                />
              </div>
            );
          })}

          {filteredSurahs.length === 0 && (
            <div className="text-center py-14 space-y-2">
              <BookOpen className={`w-9 h-9 mx-auto ${isDay ? 'text-slate-400' : 'text-slate-600'}`} />
              <p className={`text-sm font-medium ${isDay ? 'text-slate-600' : 'text-slate-400'}`}>
                {t.quran.noResults}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
