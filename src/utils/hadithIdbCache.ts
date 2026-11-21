import { CompactHadithEntry } from '../data/knowledgeLibrary';
import { UPDATE_SITE_URL } from './appUpdater';

const DB_NAME = 'nq_hadith_cache_db';
const STORE_NAME = 'collections';
const DB_VERSION = 1;

// Bundled offline collections kept directly inside the app package
const BUNDLED_HADITH_IDS = new Set<number>([17, 22]);

const memoryCache = new Map<number, CompactHadithEntry[]>();

function openHadithDb(): Promise<IDBDatabase | null> {
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

async function getFromIdb(cid: number): Promise<CompactHadithEntry[] | null> {
  const db = await openHadithDb();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(cid);
      req.onsuccess = () => {
        const data = req.result as CompactHadithEntry[] | undefined;
        if (Array.isArray(data) && data.length > 0) {
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

async function putToIdb(cid: number, rows: CompactHadithEntry[]): Promise<void> {
  if (!Array.isArray(rows) || rows.length === 0) return;
  const db = await openHadithDb();
  if (!db) return;
  try {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(rows, cid);
  } catch {
    // Ignore storage quota errors gracefully
  }
}

/**
 * Parses large JSON strings (e.g. 6 MB commentary book) off the main UI thread
 * using a lightweight ephemeral Blob Web Worker so scrolling & animations stay 60fps.
 */
function parseJsonOffMainThread<T>(rawText: string): Promise<T> {
  if (
    rawText.length < 120_000 ||
    typeof Worker === 'undefined' ||
    typeof Blob === 'undefined' ||
    typeof URL === 'undefined'
  ) {
    return Promise.resolve(JSON.parse(rawText) as T);
  }

  return new Promise((resolve, reject) => {
    let blobUrl = '';
    let worker: Worker | null = null;
    try {
      const blob = new Blob(
        ['self.onmessage=function(e){try{self.postMessage({ok:true,data:JSON.parse(e.data)});}catch(err){self.postMessage({ok:false,err:String(err)});}};'],
        { type: 'application/javascript' }
      );
      blobUrl = URL.createObjectURL(blob);
      worker = new Worker(blobUrl);
      const cleanup = () => {
        if (worker) {
          worker.terminate();
          worker = null;
        }
        if (blobUrl) {
          URL.revokeObjectURL(blobUrl);
          blobUrl = '';
        }
      };
      worker.onmessage = (ev: MessageEvent<{ ok: boolean; data?: T; err?: string }>) => {
        cleanup();
        if (ev.data?.ok) {
          resolve(ev.data.data as T);
        } else {
          try {
            resolve(JSON.parse(rawText) as T);
          } catch (e) {
            reject(e);
          }
        }
      };
      worker.onerror = () => {
        cleanup();
        try {
          resolve(JSON.parse(rawText) as T);
        } catch (e) {
          reject(e);
        }
      };
      worker.postMessage(rawText);
    } catch {
      if (worker) worker.terminate();
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      try {
        resolve(JSON.parse(rawText) as T);
      } catch (e) {
        reject(e);
      }
    }
  });
}

export function getHadithCollectionSync(cid: number): CompactHadithEntry[] | null {
  return memoryCache.get(cid) || null;
}

export async function getCachedHadithIdsAsync(): Promise<Set<number>> {
  const cached = new Set<number>(BUNDLED_HADITH_IDS);
  memoryCache.forEach((_, id) => cached.add(id));
  const db = await openHadithDb();
  if (!db) return cached;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).getAllKeys();
      req.onsuccess = () => {
        for (const k of req.result || []) {
          const n = Number(k);
          if (Number.isFinite(n) && n > 0) cached.add(n);
        }
        resolve(cached);
      };
      req.onerror = () => resolve(cached);
    } catch {
      resolve(cached);
    }
  });
}

export async function loadHadithCollectionAsync(
  cid: number,
  fileName?: string
): Promise<CompactHadithEntry[]> {
  const inMem = memoryCache.get(cid);
  if (inMem) return inMem;

  const fromIdb = await getFromIdb(cid);
  if (fromIdb) {
    memoryCache.set(cid, fromIdb);
    return fromIdb;
  }

  const file = fileName || `c_${cid}.json`;
  const urls: string[] = BUNDLED_HADITH_IDS.has(cid)
    ? [`/data/hadith/${file}`, `${UPDATE_SITE_URL}/data/hadith/${file}`]
    : [`${UPDATE_SITE_URL}/data/hadith/${file}`, `/data/hadith/${file}`];

  for (const url of urls) {
    try {
      const resp = await fetch(url);
      if (!resp.ok) continue;
      const contentType = resp.headers.get('content-type') || '';
      // Avoid accidentally parsing SPA index.html fallback on 404
      if (contentType.includes('text/html')) continue;
      const rawText = await resp.text();
      if (!rawText || rawText.trimStart().startsWith('<')) continue;
      const rows = await parseJsonOffMainThread<CompactHadithEntry[]>(rawText);
      if (Array.isArray(rows) && rows.length > 0) {
        memoryCache.set(cid, rows);
        if (!BUNDLED_HADITH_IDS.has(cid)) {
          void putToIdb(cid, rows);
        }
        return rows;
      }
    } catch {
      // Try next URL candidate
    }
  }

  throw new Error(`Failed to load hadith collection ${cid}`);
}
