import { ALL_SURAHS } from '../data/surahs';
import { Ayah, SurahDetail, TranslationId } from '../types';
import { cyrillicToLatinUz } from './uzbekScript';

/** Compact per-surah row: [globalAyahNumber, arabicUthmani, uzbekCyrMansur, juz, page] */
export type CompactLocalAyahRow = [number, string, string, number, number];

export interface CompactLocalSurahFile {
  n: number;
  a: CompactLocalAyahRow[];
}

const localSurahRawCache = new Map<number, CompactLocalSurahFile>();
const inflightRequests = new Map<number, Promise<CompactLocalSurahFile | null>>();

export function getLocalSurahRawSync(surahNumber: number): CompactLocalSurahFile | null {
  return localSurahRawCache.get(surahNumber) || null;
}

/**
 * Loads the bundled offline Surah text (Arabic Uthmani + Uzbek Alouddin Mansur)
 * from /data/quran/{surahNumber}.json in ~2ms on Android/Desktop (and ~6KB cached on Web).
 */
export async function loadLocalSurahRaw(
  surahNumber: number
): Promise<CompactLocalSurahFile | null> {
  if (surahNumber < 1 || surahNumber > 114) return null;
  const cached = localSurahRawCache.get(surahNumber);
  if (cached) return cached;

  const existing = inflightRequests.get(surahNumber);
  if (existing) return existing;

  const req = (async () => {
    try {
      const res = await fetch(`/data/quran/${surahNumber}.json`);
      if (!res.ok) return null;
      const data = (await res.json()) as CompactLocalSurahFile;
      if (data && data.n === surahNumber && Array.isArray(data.a) && data.a.length > 0) {
        localSurahRawCache.set(surahNumber, data);
        return data;
      }
      return null;
    } catch {
      return null;
    } finally {
      inflightRequests.delete(surahNumber);
    }
  })();

  inflightRequests.set(surahNumber, req);
  return req;
}

/**
 * Builds a complete SurahDetail immediately from bundled offline local data
 * (Arabic Uthmani + Uzbek Latin & Cyrillic Alouddin Mansur, or Arabic + optional external translation map).
 */
export function buildSurahDetailFromLocal(
  raw: CompactLocalSurahFile,
  selectedTranslation: TranslationId,
  externalTranslationByAyah?: Record<number, string> | null
): SurahDetail | null {
  const meta = ALL_SURAHS.find((s) => s.number === raw.n);
  if (!meta) return null;

  const isUzbek = selectedTranslation === 'uz_mansur' || selectedTranslation === 'uz_cyr';
  const sNum = raw.n.toString().padStart(3, '0');

  const ayahs: Ayah[] = raw.a.map((row, idx) => {
    const numberInSurah = idx + 1;
    const [globalNumber, arabicText, uzCyr, juz, page] = row;
    const uzLat = cyrillicToLatinUz(uzCyr);
    const extTrans = externalTranslationByAyah?.[numberInSurah];
    const displayTrans = isUzbek
      ? selectedTranslation === 'uz_mansur'
        ? uzLat
        : uzCyr
      : extTrans || uzLat;

    const aNum = numberInSurah.toString().padStart(3, '0');
    return {
      numberInSurah,
      number: globalNumber,
      text: arabicText,
      translation: displayTrans,
      translations: {
        uz_cyr: uzCyr,
        uz_mansur: uzLat,
        ...(extTrans ? { [selectedTranslation]: extTrans } : {}),
      },
      juz,
      page,
      audioUrl: `https://everyayah.com/data/Alafasy_128kbps/${sNum}${aNum}.mp3`,
    };
  });

  return {
    ...meta,
    ayahs,
    bismillahPre: raw.n !== 1 && raw.n !== 9,
  };
}
