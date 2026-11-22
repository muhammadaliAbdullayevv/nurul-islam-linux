/**
 * Local Offline Quran Audio Cache for Web & Linux Desktop (IndexedDB Blob Storage).
 * Mirrors Android's native QuranAudioService offline downloader so tapping the
 * Download button on Web/PWA or Linux Desktop downloads real MP3 audio locally
 * for 100% offline playback with live percentage progress.
 */
import { AudioDownloadProgress } from './nativeQuranAudio';

const DB_NAME = 'nq_offline_audio_v1';
const BLOB_STORE = 'ayah_blobs';
const META_STORE = 'surah_meta';
const DB_VERSION = 1;
const INDEX_STORAGE_KEY = 'nq_web_offline_audio_index_v1';

interface WebAudioMeta {
  key: string;
  surahNumber: number;
  reciterKey: string;
  ayahCount: number;
  savedAt: number;
}

const activeDownloads: Record<number, AudioDownloadProgress> = {};
const listeners = new Set<(map: Record<number, AudioDownloadProgress>) => void>();

// Track active object URLs so we can reuse and avoid leaking memory
const liveBlobUrlCache = new Map<string, string>();

function metaKey(surahNumber: number, reciterKey: string): string {
  return `${reciterKey}_${surahNumber}`;
}

function ayahBlobKey(surahNumber: number, reciterKey: string, ayahNumber: number): string {
  return `${reciterKey}_${surahNumber}_${ayahNumber}`;
}

function emitProgress(): void {
  const snap = { ...activeDownloads };
  listeners.forEach((fn) => fn(snap));
}

function readIndexSet(): Set<string> {
  try {
    const raw = localStorage.getItem(INDEX_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return new Set(parsed.filter((k): k is string => typeof k === 'string'));
      }
    }
  } catch {
    // ignore
  }
  return new Set();
}

function writeIndexSet(set: Set<string>): void {
  try {
    localStorage.setItem(INDEX_STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch {
    // ignore
  }
}

function openAudioDb(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === 'undefined') return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(BLOB_STORE)) {
          db.createObjectStore(BLOB_STORE);
        }
        if (!db.objectStoreNames.contains(META_STORE)) {
          db.createObjectStore(META_STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

function idbPut(db: IDBDatabase, storeName: string, key: string, value: unknown): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(storeName, 'readwrite');
      tx.objectStore(storeName).put(value, key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

function idbGet<T>(db: IDBDatabase, storeName: string, key: string): Promise<T | null> {
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(storeName, 'readonly');
      const req = tx.objectStore(storeName).get(key);
      req.onsuccess = () => resolve((req.result as T) ?? null);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export function isWebAudioDownloaded(surahNumber: number, reciterKey: string): boolean {
  return readIndexSet().has(metaKey(surahNumber, reciterKey));
}

export function getWebAudioDownloadSnapshot(): Record<number, AudioDownloadProgress> {
  return { ...activeDownloads };
}

export function subscribeWebAudioDownloads(
  cb: (map: Record<number, AudioDownloadProgress>) => void
): () => void {
  listeners.add(cb);
  cb({ ...activeDownloads });
  return () => {
    listeners.delete(cb);
  };
}

async function fetchAudioBlobFromCandidates(urls: string[]): Promise<Blob | null> {
  for (const url of urls) {
    try {
      const resp = await fetch(url, { mode: 'cors' });
      if (!resp.ok) continue;
      const blob = await resp.blob();
      if (blob.size > 800) {
        return blob;
      }
    } catch {
      // Try next mirror
    }
  }
  return null;
}

export async function downloadWebSurahAudio(
  surahNumber: number,
  reciterKey: string,
  ayahs: Array<{ ayahNumber: number; urls: string[] }>
): Promise<boolean> {
  if (activeDownloads[surahNumber]?.status === 'downloading') {
    return false;
  }
  const db = await openAudioDb();
  if (!db || ayahs.length === 0) return false;

  activeDownloads[surahNumber] = { status: 'downloading', pct: 0 };
  emitProgress();

  const total = ayahs.length;
  let completed = 0;
  let failed = 0;
  const CONCURRENCY = 4;

  const queue = [...ayahs];
  const workers = Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) break;
      const key = ayahBlobKey(surahNumber, reciterKey, item.ayahNumber);
      const existing = await idbGet<Blob>(db, BLOB_STORE, key);
      if (existing && existing.size > 800) {
        completed += 1;
      } else {
        const blob = await fetchAudioBlobFromCandidates(item.urls);
        if (blob) {
          await idbPut(db, BLOB_STORE, key, blob);
          completed += 1;
        } else {
          failed += 1;
        }
      }
      const pct = Math.min(99, Math.round(((completed + failed) / total) * 100));
      if (activeDownloads[surahNumber]?.pct !== pct) {
        activeDownloads[surahNumber] = { status: 'downloading', pct };
        emitProgress();
      }
    }
  });

  await Promise.all(workers);

  if (completed > 0 && failed === 0) {
    const mKey = metaKey(surahNumber, reciterKey);
    const meta: WebAudioMeta = {
      key: mKey,
      surahNumber,
      reciterKey,
      ayahCount: total,
      savedAt: Date.now(),
    };
    await idbPut(db, META_STORE, mKey, meta);
    const idx = readIndexSet();
    idx.add(mKey);
    writeIndexSet(idx);
    activeDownloads[surahNumber] = { status: 'done', pct: 100 };
    emitProgress();
    return true;
  }

  activeDownloads[surahNumber] = { status: 'error', pct: 0 };
  emitProgress();
  window.setTimeout(() => {
    if (activeDownloads[surahNumber]?.status === 'error') {
      delete activeDownloads[surahNumber];
      emitProgress();
    }
  }, 3000);
  return false;
}

export async function removeWebSurahAudio(
  surahNumber: number,
  reciterKey: string,
  ayahCount = 300
): Promise<void> {
  const mKey = metaKey(surahNumber, reciterKey);
  const idx = readIndexSet();
  idx.delete(mKey);
  writeIndexSet(idx);
  delete activeDownloads[surahNumber];
  emitProgress();

  // Revoke any cached blob URLs for this surah
  const prefix = `${reciterKey}_${surahNumber}_`;
  for (const [k, url] of liveBlobUrlCache.entries()) {
    if (k.startsWith(prefix)) {
      URL.revokeObjectURL(url);
      liveBlobUrlCache.delete(k);
    }
  }

  const db = await openAudioDb();
  if (!db) return;
  try {
    const tx = db.transaction([BLOB_STORE, META_STORE], 'readwrite');
    tx.objectStore(META_STORE).delete(mKey);
    const bStore = tx.objectStore(BLOB_STORE);
    for (let a = 1; a <= ayahCount; a++) {
      bStore.delete(ayahBlobKey(surahNumber, reciterKey, a));
    }
  } catch {
    // ignore
  }
}

export async function getWebOfflineAyahBlobUrl(
  surahNumber: number,
  reciterKey: string,
  ayahNumber: number
): Promise<string | null> {
  const key = ayahBlobKey(surahNumber, reciterKey, ayahNumber);
  const cachedUrl = liveBlobUrlCache.get(key);
  if (cachedUrl) return cachedUrl;

  const db = await openAudioDb();
  if (!db) return null;

  const blob = await idbGet<Blob>(db, BLOB_STORE, key);
  if (!blob || blob.size < 800) return null;

  // Keep memory lean: cap live object URLs at 40
  if (liveBlobUrlCache.size >= 40) {
    const oldestKey = liveBlobUrlCache.keys().next().value;
    if (oldestKey) {
      const oldUrl = liveBlobUrlCache.get(oldestKey);
      if (oldUrl) URL.revokeObjectURL(oldUrl);
      liveBlobUrlCache.delete(oldestKey);
    }
  }

  const url = URL.createObjectURL(blob);
  liveBlobUrlCache.set(key, url);
  return url;
}
