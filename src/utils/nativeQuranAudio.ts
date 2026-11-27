import {
  DEFAULT_RECITER_ID,
  QuranReciterId,
  getReciterFullSurahAudioCandidates,
} from '../data/quranReciters';

export interface NativeQuranAudioState {
  active: boolean;
  surahNumber: number;
  surahName: string;
  reciterName: string;
  reciterKey?: string;
  fullSurahMode?: boolean;
  ayahNumber: number;
  totalAyahs: number;
  isPlaying: boolean;
  isPreparing?: boolean;
  positionMs: number;
  durationMs: number;
}

export interface NativeAyahQueueItem {
  ayahNumber: number;
  urls: string[];
}

export interface NativeLoadAudioPayload {
  surahNumber: number;
  surahName: string;
  reciterName: string;
  reciterKey?: string;
  everyAyahFolder?: string;
  mp3QuranBase?: string;
  preferFullSurah?: boolean;
  ayahLabelPrefix: string;
  startAyahNumber: number;
  startFraction?: number;
  seekOffsetMs: number;
  totalAyahs: number;
  fullUrls: string[];
  surahCatalog?: Array<{ name: string; ayahs: number }>;
  ayahs: NativeAyahQueueItem[];
}

interface NativeQuranAudioBridge {
  loadAndPlay: (payloadJson: string) => void;
  togglePlayPause: () => void;
  play: () => void;
  pause: () => void;
  nextAyah: () => void;
  prevAyah: () => void;
  seekMs: (ms: number) => void;
  jumpToAyah: (ayahNum: number, seekFraction: number, offsetMs: number) => void;
  stop: () => void;
  getState: () => string;
  consumePendingOpen?: () => string;
  isSurahAudioDownloaded?: (surahNumber: number) => boolean;
  isSurahAudioDownloadedForReciter?: (surahNumber: number, reciterKey: string) => boolean;
  downloadSurahAudio?: (surahNumber: number, urlsJson: string) => void;
  removeOfflineSurahAudio?: (surahNumber: number) => void;
  removeOfflineSurahAudioForReciter?: (surahNumber: number, reciterKey: string) => void;
  getDownloadStatesJson?: () => string;
}

export type AudioDownloadStatus = 'idle' | 'downloading' | 'done' | 'error';
export interface AudioDownloadProgress {
  status: AudioDownloadStatus;
  pct: number;
}

const downloadStore: Record<number, AudioDownloadProgress> = {};
const downloadListeners = new Set<(map: Record<number, AudioDownloadProgress>) => void>();
let downloadBridgeHooked = false;

function ensureDownloadHooked(): void {
  if (downloadBridgeHooked || typeof window === 'undefined') return;
  downloadBridgeHooked = true;

  // Hydrate any in-flight downloads that started before current subscriber mounted
  try {
    const raw = getBridge()?.getDownloadStatesJson?.();
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, { status?: string; pct?: number }>;
      for (const [k, v] of Object.entries(parsed)) {
        const sNum = Number(k);
        if (sNum > 0 && (v.status === 'downloading' || v.status === 'error')) {
          downloadStore[sNum] = {
            status: v.status,
            pct: Math.max(0, Math.min(100, Number(v.pct) || 0)),
          };
        }
      }
    }
  } catch {
    // ignore
  }

  const win = window as Window & {
    __nqOnAudioDownload?: (surahNumber: number, status: AudioDownloadStatus, pct: number) => void;
  };
  const prev = win.__nqOnAudioDownload;
  win.__nqOnAudioDownload = (surahNum, status, pct) => {
    if (status === 'idle') {
      delete downloadStore[surahNum];
    } else {
      downloadStore[surahNum] = { status, pct };
    }
    if (prev) prev(surahNum, status, pct);
    const snapshot = { ...downloadStore };
    downloadListeners.forEach((fn) => fn(snapshot));
  };
}

function getBridge(): NativeQuranAudioBridge | null {
  const win = window as Window & { NqQuranAudioBridge?: NativeQuranAudioBridge };
  return win.NqQuranAudioBridge || null;
}

export function hasNativeQuranAudioBridge(): boolean {
  return getBridge() !== null;
}

export function getFullSurahAudioCandidates(
  surahNumber: number,
  qdcUrl?: string,
  reciterId: QuranReciterId = DEFAULT_RECITER_ID
): string[] {
  return getReciterFullSurahAudioCandidates(reciterId, surahNumber, qdcUrl);
}

export function getNativeAudioState(): NativeQuranAudioState {
  const bridge = getBridge();
  if (!bridge) {
    return {
      active: false,
      surahNumber: 0,
      surahName: '',
      reciterName: '',
      ayahNumber: 0,
      totalAyahs: 0,
      isPlaying: false,
      positionMs: 0,
      durationMs: 0,
    };
  }
  try {
    return JSON.parse(bridge.getState()) as NativeQuranAudioState;
  } catch {
    return {
      active: false,
      surahNumber: 0,
      surahName: '',
      reciterName: '',
      ayahNumber: 0,
      totalAyahs: 0,
      isPlaying: false,
      positionMs: 0,
      durationMs: 0,
    };
  }
}

export function nativeLoadAndPlay(payload: NativeLoadAudioPayload): void {
  getBridge()?.loadAndPlay(JSON.stringify(payload));
}

export function nativeTogglePlayPause(): void {
  getBridge()?.togglePlayPause();
}

export function nativeNextAyah(): void {
  getBridge()?.nextAyah();
}

export function nativePrevAyah(): void {
  getBridge()?.prevAyah();
}

export function nativeSeekMs(ms: number): void {
  getBridge()?.seekMs(Math.round(Math.max(0, ms)));
}

export function nativeJumpToAyah(
  ayahNumber: number,
  seekFraction = -1,
  offsetMs = 0
): void {
  getBridge()?.jumpToAyah(ayahNumber, seekFraction, Math.round(Math.max(0, offsetMs)));
}

export function nativeStopAudio(): void {
  getBridge()?.stop();
}

export function isNativeAudioDownloaded(surahNumber: number, reciterKey = 'alafasy'): boolean {
  try {
    const bridge = getBridge();
    if (!bridge) return false;
    if (typeof bridge.isSurahAudioDownloadedForReciter === 'function') {
      return Boolean(bridge.isSurahAudioDownloadedForReciter(surahNumber, reciterKey));
    }
    return Boolean(bridge.isSurahAudioDownloaded?.(surahNumber));
  } catch {
    return false;
  }
}

export function downloadNativeSurahAudio(
  surahNumber: number,
  payload:
    | string[]
    | {
        ayahs: NativeAyahQueueItem[];
        fullUrls?: string[];
        reciterKey?: string;
        preferFullSurah?: boolean;
      }
): void {
  ensureDownloadHooked();
  downloadStore[surahNumber] = { status: 'downloading', pct: 0 };
  const snapshot = { ...downloadStore };
  downloadListeners.forEach((fn) => fn(snapshot));
  getBridge()?.downloadSurahAudio?.(surahNumber, JSON.stringify(payload));
}

export function removeNativeSurahAudio(surahNumber: number, reciterKey = 'alafasy'): void {
  ensureDownloadHooked();
  delete downloadStore[surahNumber];
  const snapshot = { ...downloadStore };
  downloadListeners.forEach((fn) => fn(snapshot));
  const bridge = getBridge();
  if (typeof bridge?.removeOfflineSurahAudioForReciter === 'function') {
    bridge.removeOfflineSurahAudioForReciter(surahNumber, reciterKey);
  } else {
    bridge?.removeOfflineSurahAudio?.(surahNumber);
  }
}

export function getAllDownloadProgress(): Record<number, AudioDownloadProgress> {
  ensureDownloadHooked();
  return { ...downloadStore };
}

export function getSurahDownloadProgress(surahNumber: number): AudioDownloadProgress | null {
  ensureDownloadHooked();
  if (downloadStore[surahNumber]) {
    return downloadStore[surahNumber];
  }
  if (isNativeAudioDownloaded(surahNumber)) {
    return { status: 'done', pct: 100 };
  }
  return null;
}

export function subscribeAllAudioDownloads(
  cb: (map: Record<number, AudioDownloadProgress>) => void
): () => void {
  ensureDownloadHooked();
  downloadListeners.add(cb);
  cb({ ...downloadStore });
  return () => {
    downloadListeners.delete(cb);
  };
}

export function subscribeNativeAudioDownload(
  cb: (surahNumber: number, status: AudioDownloadStatus, pct: number) => void
): () => void {
  ensureDownloadHooked();
  const win = window as Window & {
    __nqOnAudioDownload?: (
      surahNumber: number,
      status: AudioDownloadStatus,
      pct: number
    ) => void;
  };
  const prev = win.__nqOnAudioDownload;
  win.__nqOnAudioDownload = (surahNum, status, pct) => {
    if (prev) prev(surahNum, status, pct);
    cb(surahNum, status, pct);
  };
  return () => {
    win.__nqOnAudioDownload = prev;
  };
}

export function consumeNativePendingOpen(): { surahNumber: number; ayahNumber: number } | null {
  const bridge = getBridge();
  if (!bridge?.consumePendingOpen) return null;
  try {
    const parsed = JSON.parse(bridge.consumePendingOpen()) as {
      surahNumber?: number;
      ayahNumber?: number;
    };
    if (parsed.surahNumber && parsed.surahNumber > 0) {
      return {
        surahNumber: parsed.surahNumber,
        ayahNumber: Math.max(1, parsed.ayahNumber || 1),
      };
    }
  } catch {
    // ignore
  }
  return null;
}

export function subscribeNativeAudioState(
  cb: (state: NativeQuranAudioState) => void
): () => void {
  const win = window as Window & {
    __nqOnNativeAudioState?: (state: NativeQuranAudioState) => void;
  };
  const prev = win.__nqOnNativeAudioState;
  win.__nqOnNativeAudioState = (state: NativeQuranAudioState) => {
    if (prev) prev(state);
    cb(state);
  };
  return () => {
    if (win.__nqOnNativeAudioState) {
      win.__nqOnNativeAudioState = prev;
    }
  };
}
