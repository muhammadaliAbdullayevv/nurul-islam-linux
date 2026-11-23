import {
  BookCatalogItem,
  BookContentFile,
  LibraryCatalogManifest,
} from '../types/libraryBook';
import { UPDATE_SITE_URL } from './appUpdater';

const DB_NAME = 'nq_library_books_db';
const DB_VERSION = 1;
const STORE_NAME = 'books';
const REMOTE_CATALOG_CACHE_KEY = 'nq_library_remote_catalog_v1';
const CACHED_BOOK_IDS_KEY = 'nq_library_cached_ids_v1';

const memoryBookCache = new Map<string, BookContentFile>();

function openBooksDb(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === 'undefined') return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function readBookFromIdb(bookId: string): Promise<BookContentFile | null> {
  const db = await openBooksDb();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(bookId);
      req.onsuccess = () => {
        const val = req.result as BookContentFile | undefined;
        resolve(val && Array.isArray(val.chapters) && val.chapters.length > 0 ? val : null);
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function writeBookToIdb(book: BookContentFile): Promise<void> {
  const db = await openBooksDb();
  if (!db) return;
  await new Promise<void>((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(book);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export function getCachedCloudBookIdsSync(): string[] {
  try {
    const raw = localStorage.getItem(CACHED_BOOK_IDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function recordCachedCloudBookId(bookId: string): void {
  try {
    const cur = getCachedCloudBookIdsSync();
    if (!cur.includes(bookId)) {
      localStorage.setItem(CACHED_BOOK_IDS_KEY, JSON.stringify([...cur, bookId]));
    }
  } catch {
    // ignore storage quota errors
  }
}

export async function listCachedCloudBookIdsAsync(): Promise<string[]> {
  const db = await openBooksDb();
  if (!db) return getCachedCloudBookIdsSync();
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).getAllKeys();
      req.onsuccess = () => {
        const ids = (req.result || []).filter((k): k is string => typeof k === 'string');
        try {
          localStorage.setItem(CACHED_BOOK_IDS_KEY, JSON.stringify(ids));
        } catch {
          // ignore
        }
        resolve(ids);
      };
      req.onerror = () => resolve(getCachedCloudBookIdsSync());
    } catch {
      resolve(getCachedCloudBookIdsSync());
    }
  });
}

/**
 * Merges local bundled catalog with any previously cached remote VPS catalog
 * so the bookshelf renders immediately with 0ms delay.
 */
export function loadMergedCatalogSync(localBooks: BookCatalogItem[]): BookCatalogItem[] {
  const byId = new Map<string, BookCatalogItem>();
  for (const item of localBooks) {
    byId.set(item.id, item);
  }
  try {
    const raw = localStorage.getItem(REMOTE_CATALOG_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<LibraryCatalogManifest>;
      if (Array.isArray(parsed.books)) {
        for (const item of parsed.books) {
          if (item && typeof item.id === 'string' && !byId.has(item.id)) {
            byId.set(item.id, item);
          }
        }
      }
    }
  } catch {
    // ignore corrupt cache
  }
  return Array.from(byId.values());
}

const CLOUD_BOOKS_BASE_URL = `${UPDATE_SITE_URL}/data/hadith/books`;

/**
 * Refreshes the cloud catalog manifest from nurulislam.mabdullayev.dev/data/hadith/books/catalog.json
 * (served with gzip + Access-Control-Allow-Origin: * for Android, Linux Desktop, and Web)
 * so new books added to the VPS appear automatically without requiring an app update.
 */
export async function refreshRemoteLibraryCatalog(
  localBooks: BookCatalogItem[]
): Promise<BookCatalogItem[]> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 7000);
  try {
    const urls = [
      `${CLOUD_BOOKS_BASE_URL}/catalog.json`,
      '/data/hadith/books/catalog.json',
    ];
    for (const url of urls) {
      try {
        const resp = await fetch(url, {
          cache: 'no-cache',
          signal: controller.signal,
        });
        if (!resp.ok) continue;
        const manifest = (await resp.json()) as Partial<LibraryCatalogManifest>;
        if (!Array.isArray(manifest.books) || manifest.books.length === 0) continue;

        try {
          localStorage.setItem(REMOTE_CATALOG_CACHE_KEY, JSON.stringify(manifest));
        } catch {
          // ignore quota error
        }

        const byId = new Map<string, BookCatalogItem>();
        // Keep local bundled books as bundled (offline-first); overlay any newer remote cloud metadata/additions
        for (const local of localBooks) {
          byId.set(local.id, local);
        }
        for (const remote of manifest.books) {
          if (!remote || typeof remote.id !== 'string') continue;
          const existing = byId.get(remote.id);
          if (existing && existing.storage === 'bundled') {
            continue;
          }
          byId.set(remote.id, { ...remote, storage: 'cloud' });
        }
        return Array.from(byId.values());
      } catch {
        // try next URL
      }
    }
  } finally {
    window.clearTimeout(timer);
  }
  return loadMergedCatalogSync(localBooks);
}

/**
 * Loads a book's full chapters from:
 * 1. In-memory cache (0ms)
 * 2. IndexedDB permanent offline cache (for previously opened cloud books)
 * 3. Local bundled `/data/books/<id>.json` (for core offline books)
 * 4. Remote VPS `https://nurulislam.mabdullayev.dev/books/<id>.json` (auto-saved permanently to IndexedDB!)
 */
export async function loadBookContent(item: BookCatalogItem): Promise<BookContentFile> {
  const mem = memoryBookCache.get(item.id);
  if (mem) return mem;

  // Check IndexedDB cache first (instant offline reopen for downloaded cloud books)
  const idbHit = await readBookFromIdb(item.id);
  if (idbHit) {
    memoryBookCache.set(item.id, idbHit);
    return idbHit;
  }

  const candidateUrls =
    item.storage === 'bundled'
      ? [`/data/books/${item.id}.json`, `${CLOUD_BOOKS_BASE_URL}/${item.id}.json`]
      : [`${CLOUD_BOOKS_BASE_URL}/${item.id}.json`, `/data/books/${item.id}.json`];

  let lastErr: unknown = null;
  for (const url of candidateUrls) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 14000);
    try {
      const resp = await fetch(url, { signal: controller.signal });
      if (!resp.ok) {
        lastErr = new Error(`HTTP ${resp.status} for ${url}`);
        continue;
      }
      const parsed = (await resp.json()) as Partial<BookContentFile>;
      if (!parsed || !Array.isArray(parsed.chapters) || parsed.chapters.length === 0) {
        lastErr = new Error(`Invalid book payload for ${item.id}`);
        continue;
      }
      const bookData: BookContentFile = {
        id: item.id,
        version: typeof parsed.version === 'number' ? parsed.version : 1,
        chapters: parsed.chapters,
      };
      memoryBookCache.set(item.id, bookData);
      if (item.storage === 'cloud') {
        await writeBookToIdb(bookData);
        recordCachedCloudBookId(item.id);
      }
      return bookData;
    } catch (err) {
      lastErr = err;
    } finally {
      window.clearTimeout(timer);
    }
  }

  throw lastErr instanceof Error ? lastErr : new Error(`Failed to load book ${item.id}`);
}
