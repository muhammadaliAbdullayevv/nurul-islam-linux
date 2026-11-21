import { AyahVerseTiming, AyahWord, SurahDetail, TranslationId } from '../types';

const DB_NAME = 'nq_surah_cache_db';
const STORE_NAME = 'surahs';
const DB_VERSION = 1;

export interface CachedReciterTiming {
  reciterId: number;
  fullAudioUrl?: string;
  audioDurationMs?: number;
  verseTimings?: AyahVerseTiming[];
  wordsByAyah?: Record<number, AyahWord[]>;
}

// Instant in-memory LRU cache for active session switches
const memoryCache = new Map<string, SurahDetail>();
const timingMemoryCache = new Map<string, CachedReciterTiming>();
const wordsMemoryCache = new Map<number, Record<number, AyahWord[]>>();

function cacheKey(surahNumber: number, translation: TranslationId): string {
  return `${surahNumber}_${translation}`;
}

function timingCacheKey(surahNumber: number, reciterId: number): string {
  return `timing_v2_${reciterId}_${surahNumber}`;
}

function wordsCacheKey(surahNumber: number): string {
  return `words_${surahNumber}`;
}

function openCacheDb(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === 'undefined') return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function getCachedSurahAsync(
  surahNumber: number,
  translation: TranslationId
): Promise<SurahDetail | null> {
  const key = cacheKey(surahNumber, translation);
  const inMem = memoryCache.get(key);
  if (inMem) return inMem;

  const db = await openCacheDb();
  if (!db) return null;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => {
        const data = req.result as SurahDetail | undefined;
        if (data && data.number === surahNumber && Array.isArray(data.ayahs) && data.ayahs.length > 0) {
          memoryCache.set(key, data);
          resolve(data);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export function getCachedSurahSync(surahNumber: number, translation: TranslationId): SurahDetail | null {
  return memoryCache.get(cacheKey(surahNumber, translation)) || null;
}

export async function putCachedSurahAsync(
  surah: SurahDetail,
  translation: TranslationId
): Promise<void> {
  if (!surah || !Array.isArray(surah.ayahs) || surah.ayahs.length === 0) return;
  const key = cacheKey(surah.number, translation);
  memoryCache.set(key, surah);

  const db = await openCacheDb();
  if (!db) return;

  try {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(surah, key);
  } catch {
    // Ignore storage write failure gracefully
  }
}

export async function getCachedReciterTimingAsync(
  surahNumber: number,
  reciterId: number
): Promise<CachedReciterTiming | null> {
  const key = timingCacheKey(surahNumber, reciterId);
  const inMem = timingMemoryCache.get(key);
  if (inMem) return inMem;

  const db = await openCacheDb();
  if (!db) return null;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(key);
      req.onsuccess = () => {
        const data = req.result as CachedReciterTiming | undefined;
        if (data && data.reciterId === reciterId && Array.isArray(data.verseTimings) && data.verseTimings.length > 0) {
          timingMemoryCache.set(key, data);
          resolve(data);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function putCachedReciterTimingAsync(
  surahNumber: number,
  data: CachedReciterTiming
): Promise<void> {
  if (!data || !Array.isArray(data.verseTimings) || data.verseTimings.length === 0) return;
  const key = timingCacheKey(surahNumber, data.reciterId);
  timingMemoryCache.set(key, data);

  const db = await openCacheDb();
  if (!db) return;

  try {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(data, key);
  } catch {
    // Ignore storage write failure gracefully
  }
}

export async function getCachedSurahWordsAsync(
  surahNumber: number
): Promise<Record<number, AyahWord[]> | null> {
  const inMem = wordsMemoryCache.get(surahNumber);
  if (inMem) return inMem;

  const db = await openCacheDb();
  if (!db) return null;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(wordsCacheKey(surahNumber));
      req.onsuccess = () => {
        const data = req.result as Record<number, AyahWord[]> | undefined;
        if (data && Object.keys(data).length > 0) {
          wordsMemoryCache.set(surahNumber, data);
          resolve(data);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function putCachedSurahWordsAsync(
  surahNumber: number,
  wordsByAyah: Record<number, AyahWord[]>
): Promise<void> {
  if (!wordsByAyah || Object.keys(wordsByAyah).length === 0) return;
  wordsMemoryCache.set(surahNumber, wordsByAyah);

  const db = await openCacheDb();
  if (!db) return;

  try {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(wordsByAyah, wordsCacheKey(surahNumber));
  } catch {
    // Ignore storage write failure gracefully
  }
}
