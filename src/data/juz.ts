import { SurahDetail, TranslationId } from '../types';

export interface JuzEntry {
  juz: number;
  startSurah: number;
  startAyah: number;
  endSurah: number;
  endAyah: number;
}

export const QURAN_JUZ_LIST: JuzEntry[] = [
  { juz: 1, startSurah: 1, startAyah: 1, endSurah: 2, endAyah: 141 },
  { juz: 2, startSurah: 2, startAyah: 142, endSurah: 2, endAyah: 252 },
  { juz: 3, startSurah: 2, startAyah: 253, endSurah: 3, endAyah: 92 },
  { juz: 4, startSurah: 3, startAyah: 93, endSurah: 4, endAyah: 23 },
  { juz: 5, startSurah: 4, startAyah: 24, endSurah: 4, endAyah: 147 },
  { juz: 6, startSurah: 4, startAyah: 148, endSurah: 5, endAyah: 81 },
  { juz: 7, startSurah: 5, startAyah: 82, endSurah: 6, endAyah: 110 },
  { juz: 8, startSurah: 6, startAyah: 111, endSurah: 7, endAyah: 87 },
  { juz: 9, startSurah: 7, startAyah: 88, endSurah: 8, endAyah: 40 },
  { juz: 10, startSurah: 8, startAyah: 41, endSurah: 9, endAyah: 92 },
  { juz: 11, startSurah: 9, startAyah: 93, endSurah: 11, endAyah: 5 },
  { juz: 12, startSurah: 11, startAyah: 6, endSurah: 12, endAyah: 52 },
  { juz: 13, startSurah: 12, startAyah: 53, endSurah: 14, endAyah: 52 },
  { juz: 14, startSurah: 15, startAyah: 1, endSurah: 16, endAyah: 128 },
  { juz: 15, startSurah: 17, startAyah: 1, endSurah: 18, endAyah: 74 },
  { juz: 16, startSurah: 18, startAyah: 75, endSurah: 20, endAyah: 135 },
  { juz: 17, startSurah: 21, startAyah: 1, endSurah: 22, endAyah: 78 },
  { juz: 18, startSurah: 23, startAyah: 1, endSurah: 25, endAyah: 20 },
  { juz: 19, startSurah: 25, startAyah: 21, endSurah: 27, endAyah: 55 },
  { juz: 20, startSurah: 27, startAyah: 56, endSurah: 29, endAyah: 45 },
  { juz: 21, startSurah: 29, startAyah: 46, endSurah: 33, endAyah: 30 },
  { juz: 22, startSurah: 33, startAyah: 31, endSurah: 36, endAyah: 27 },
  { juz: 23, startSurah: 36, startAyah: 28, endSurah: 39, endAyah: 31 },
  { juz: 24, startSurah: 39, startAyah: 32, endSurah: 41, endAyah: 46 },
  { juz: 25, startSurah: 41, startAyah: 47, endSurah: 45, endAyah: 37 },
  { juz: 26, startSurah: 46, startAyah: 1, endSurah: 51, endAyah: 30 },
  { juz: 27, startSurah: 51, startAyah: 31, endSurah: 57, endAyah: 29 },
  { juz: 28, startSurah: 58, startAyah: 1, endSurah: 66, endAyah: 12 },
  { juz: 29, startSurah: 67, startAyah: 1, endSurah: 77, endAyah: 50 },
  { juz: 30, startSurah: 78, startAyah: 1, endSurah: 114, endAyah: 6 },
];

export interface LastReadState {
  surahNumber: number;
  ayahNumber: number;
  updatedAt: number;
}

const LAST_READ_KEY = 'nq_quran_last_read';
const COMPLETED_SURAHS_KEY = 'nq_quran_completed_surahs';
const LEGACY_OFFLINE_CACHE_PREFIX = 'nq_quran_offline_v1_';
const OFFLINE_INDEX_KEY = 'nq_quran_offline_ids_v2';

let legacyMigrated = false;

/**
 * Migrate any legacy full-Surah JSON blobs out of localStorage (which has a strict 5MB limit)
 * into a lightweight ID index. Full Surah texts live in bundled /data/quran/*.json + IndexedDB.
 */
function ensureOfflineIndexMigrated(): Set<string> {
  const indexSet = new Set<string>();
  try {
    const rawIdx = localStorage.getItem(OFFLINE_INDEX_KEY);
    if (rawIdx) {
      const parsed = JSON.parse(rawIdx);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (typeof item === 'string') indexSet.add(item);
        }
      }
    }

    if (!legacyMigrated) {
      legacyMigrated = true;
      const legacyKeysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i);
        if (key && key.startsWith(LEGACY_OFFLINE_CACHE_PREFIX)) {
          const rest = key.slice(LEGACY_OFFLINE_CACHE_PREFIX.length);
          if (rest) indexSet.add(rest);
          legacyKeysToRemove.push(key);
        }
      }
      if (legacyKeysToRemove.length > 0) {
        for (const k of legacyKeysToRemove) {
          localStorage.removeItem(k);
        }
        localStorage.setItem(OFFLINE_INDEX_KEY, JSON.stringify(Array.from(indexSet)));
      }
    }
  } catch {
    // Ignore storage access errors
  }
  return indexSet;
}

function writeOfflineIndex(indexSet: Set<string>): void {
  try {
    localStorage.setItem(OFFLINE_INDEX_KEY, JSON.stringify(Array.from(indexSet)));
  } catch {
    // Ignore storage access errors
  }
}

export function loadLastRead(): LastReadState | null {
  try {
    const raw = localStorage.getItem(LAST_READ_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<LastReadState>;
    if (
      typeof parsed.surahNumber === 'number' &&
      parsed.surahNumber >= 1 &&
      parsed.surahNumber <= 114 &&
      typeof parsed.ayahNumber === 'number' &&
      parsed.ayahNumber >= 1
    ) {
      return {
        surahNumber: parsed.surahNumber,
        ayahNumber: parsed.ayahNumber,
        updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : Date.now(),
      };
    }
  } catch {
    // Ignore storage error
  }
  return null;
}

export function saveLastRead(surahNumber: number, ayahNumber: number): LastReadState {
  const next: LastReadState = {
    surahNumber,
    ayahNumber: Math.max(1, ayahNumber),
    updatedAt: Date.now(),
  };
  try {
    localStorage.setItem(LAST_READ_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage error
  }
  return next;
}

export function loadCompletedSurahs(): number[] {
  try {
    const raw = localStorage.getItem(COMPLETED_SURAHS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((n): n is number => typeof n === 'number' && n >= 1 && n <= 114);
      }
    }
  } catch {
    // Ignore
  }
  return [];
}

export function saveCompletedSurahs(nums: number[]): void {
  try {
    localStorage.setItem(COMPLETED_SURAHS_KEY, JSON.stringify(Array.from(new Set(nums))));
  } catch {
    // Ignore
  }
}

function entryKey(surahNumber: number, translation: TranslationId): string {
  return `${surahNumber}_${translation}`;
}

export function loadOfflineSurah(_surahNumber: number, _translation: TranslationId): SurahDetail | null {
  // Full Surah objects are served from bundled /data/quran/*.json and IndexedDB (surahIdbCache.ts)
  // so localStorage never fills up its 5MB quota.
  ensureOfflineIndexMigrated();
  return null;
}

export function saveOfflineSurah(surah: SurahDetail, translation: TranslationId): boolean {
  try {
    const idx = ensureOfflineIndexMigrated();
    idx.add(entryKey(surah.number, translation));
    writeOfflineIndex(idx);
    return true;
  } catch {
    return false;
  }
}

export function removeOfflineSurah(surahNumber: number, translation: TranslationId): void {
  try {
    const idx = ensureOfflineIndexMigrated();
    idx.delete(entryKey(surahNumber, translation));
    writeOfflineIndex(idx);
    localStorage.removeItem(`${LEGACY_OFFLINE_CACHE_PREFIX}${entryKey(surahNumber, translation)}`);
  } catch {
    // Ignore
  }
}

export function isSurahSavedOffline(surahNumber: number, translation: TranslationId): boolean {
  const idx = ensureOfflineIndexMigrated();
  return idx.has(entryKey(surahNumber, translation));
}

export function getAllOfflineSavedSurahNumbers(translation: TranslationId): Set<number> {
  const result = new Set<number>();
  const idx = ensureOfflineIndexMigrated();
  const suffix = `_${translation}`;
  for (const key of idx) {
    if (key.endsWith(suffix)) {
      const num = parseInt(key.slice(0, key.length - suffix.length), 10);
      if (num >= 1 && num <= 114) result.add(num);
    }
  }
  return result;
}
