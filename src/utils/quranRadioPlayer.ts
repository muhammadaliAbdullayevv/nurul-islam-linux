/**
 * Persistent Singleton 24/7 Live Quran Radio Player.
 * - Survives tab navigation so live recitation continues seamlessly while reading Kutubxona, Tasbih, or Home.
 * - Automatically fails over between primary and backup HTTPS MP3 radio hosts.
 * - Integrates with OS / Bluetooth / Lock-Screen Media Session controls.
 * - Coordinates cleanly with Quran Surah playback (pauses Surah audio when Radio starts & vice versa).
 * - Tracks cumulative Quran listening minutes toward Profile XP and badges.
 */
import { QURAN_RADIO_STATIONS, QuranRadioStation, getRadioStationById } from '../data/quranRadioStations';
import { addQuranListenSeconds } from './userActivity';
import { hasNativeQuranAudioBridge, nativeStopAudio } from './nativeQuranAudio';
import { webQuranPlayer } from './webQuranPlayer';

export type RadioPlaybackStatus = 'idle' | 'connecting' | 'playing' | 'paused' | 'error';

export interface QuranRadioState {
  active: boolean;
  stationId: string | null;
  status: RadioPlaybackStatus;
  muted: boolean;
  errorMsg: string | null;
}

const FAV_STORAGE_KEY = 'nq_radio_favorites_v1';
const LAST_STATION_KEY = 'nq_radio_last_station_v1';

export function loadFavoriteRadioIds(): string[] {
  try {
    const raw = localStorage.getItem(FAV_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((id): id is string => typeof id === 'string');
      }
    }
  } catch {
    // ignore storage errors
  }
  return ['mishary', 'makkah_haram'];
}

export function saveFavoriteRadioIds(ids: string[]): void {
  try {
    localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

export function loadLastRadioStationId(): string {
  try {
    const saved = localStorage.getItem(LAST_STATION_KEY);
    if (saved && QURAN_RADIO_STATIONS.some((s) => s.id === saved)) {
      return saved;
    }
  } catch {
    // ignore
  }
  return QURAN_RADIO_STATIONS[0].id;
}

class QuranRadioPlayer {
  private audio: HTMLAudioElement | null = null;
  private active = false;
  private stationId: string | null = null;
  private status: RadioPlaybackStatus = 'idle';
  private muted = false;
  private errorMsg: string | null = null;
  private token = 0;
  private listenInterval: number | null = null;
  private listeners = new Set<(state: QuranRadioState) => void>();

  private ensureAudio(): HTMLAudioElement {
    if (!this.audio) {
      const el = new Audio();
      el.preload = 'none';
      el.crossOrigin = 'anonymous';
      this.audio = el;
    }
    return this.audio;
  }

  public getState(): QuranRadioState {
    return {
      active: this.active,
      stationId: this.stationId,
      status: this.status,
      muted: this.muted,
      errorMsg: this.errorMsg,
    };
  }

  public subscribe(cb: (state: QuranRadioState) => void): () => void {
    this.listeners.add(cb);
    cb(this.getState());
    return () => {
      this.listeners.delete(cb);
    };
  }

  private emit(): void {
    const snap = this.getState();
    this.listeners.forEach((fn) => fn(snap));
    this.syncMediaSession();
    this.syncListenTracker();
  }

  private syncListenTracker(): void {
    if (this.status === 'playing' && !this.muted) {
      if (this.listenInterval === null && typeof window !== 'undefined') {
        this.listenInterval = window.setInterval(() => {
          if (this.status === 'playing' && !this.muted) {
            addQuranListenSeconds(5);
          }
        }, 5000);
      }
    } else if (this.listenInterval !== null && typeof window !== 'undefined') {
      window.clearInterval(this.listenInterval);
      this.listenInterval = null;
    }
  }

  private syncMediaSession(): void {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    try {
      const ms = navigator.mediaSession;
      if (!this.active || !this.stationId) {
        return;
      }
      const station = getRadioStationById(this.stationId);
      if (typeof MediaMetadata !== 'undefined') {
        ms.metadata = new MediaMetadata({
          title: station.name.en,
          artist: 'Nurul Islam · Live Quran Radio',
          album: station.arabicName,
          artwork: [
            { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          ],
        });
      }
      ms.playbackState = this.status === 'playing' ? 'playing' : 'paused';
      ms.setActionHandler('play', () => this.resume());
      ms.setActionHandler('pause', () => this.pause());
      ms.setActionHandler('stop', () => this.stop());
      ms.setActionHandler('previoustrack', () => this.playRelative(-1));
      ms.setActionHandler('nexttrack', () => this.playRelative(1));
    } catch {
      // ignore unsupported MediaSession actions
    }
  }

  private stopConflictingQuranAudio(): void {
    try {
      if (hasNativeQuranAudioBridge()) {
        nativeStopAudio();
      }
      if (webQuranPlayer.getState().active) {
        webQuranPlayer.stop();
      }
    } catch {
      // ignore
    }
  }

  public playStation(stationId: string): void {
    const station = getRadioStationById(stationId);
    this.stopConflictingQuranAudio();

    try {
      localStorage.setItem(LAST_STATION_KEY, station.id);
    } catch {
      // ignore
    }

    const myToken = ++this.token;
    this.active = true;
    this.stationId = station.id;
    this.status = 'connecting';
    this.errorMsg = null;
    this.emit();

    void this.tryStreamUrls(station, 0, myToken);
  }

  private async tryStreamUrls(
    station: QuranRadioStation,
    idx: number,
    myToken: number
  ): Promise<void> {
    if (myToken !== this.token) return;
    const url = station.streamUrls[idx];
    if (!url) {
      this.status = 'error';
      this.errorMsg = 'offline';
      this.emit();
      return;
    }

    const el = this.ensureAudio();
    el.onplaying = null;
    el.onwaiting = null;
    el.onerror = null;
    el.onpause = null;

    try {
      el.pause();
      el.src = url;
      el.muted = this.muted;
      el.load();
    } catch {
      void this.tryStreamUrls(station, idx + 1, myToken);
      return;
    }

    let failedOver = false;
    const failOver = () => {
      if (failedOver || myToken !== this.token) return;
      failedOver = true;
      window.clearTimeout(connectTimeout);
      void this.tryStreamUrls(station, idx + 1, myToken);
    };

    const connectTimeout = window.setTimeout(() => {
      if (myToken === this.token && this.status === 'connecting') {
        failOver();
      }
    }, 9000);

    el.onplaying = () => {
      if (myToken !== this.token) return;
      window.clearTimeout(connectTimeout);
      this.status = 'playing';
      this.errorMsg = null;
      this.emit();
    };

    el.onwaiting = () => {
      if (myToken !== this.token) return;
      if (this.status === 'playing') {
        this.status = 'connecting';
        this.emit();
      }
    };

    el.onerror = () => {
      failOver();
    };

    try {
      await el.play();
    } catch {
      failOver();
    }
  }

  public pause(): void {
    if (!this.audio) return;
    this.token += 1;
    try {
      this.audio.pause();
      // Drop live buffer cleanly so resuming reconnects to real-time live edge
      this.audio.removeAttribute('src');
      this.audio.load();
    } catch {
      // ignore
    }
    this.status = 'paused';
    this.emit();
  }

  public resume(): void {
    const id = this.stationId || loadLastRadioStationId();
    this.playStation(id);
  }

  public togglePlayPause(stationId?: string): void {
    const targetId = stationId || this.stationId || loadLastRadioStationId();
    if (this.active && this.stationId === targetId) {
      if (this.status === 'playing' || this.status === 'connecting') {
        this.pause();
      } else {
        this.playStation(targetId);
      }
      return;
    }
    this.playStation(targetId);
  }

  public playRelative(delta: 1 | -1): void {
    const curId = this.stationId || loadLastRadioStationId();
    const curIdx = QURAN_RADIO_STATIONS.findIndex((s) => s.id === curId);
    const nextIdx =
      (Math.max(0, curIdx) + delta + QURAN_RADIO_STATIONS.length) % QURAN_RADIO_STATIONS.length;
    this.playStation(QURAN_RADIO_STATIONS[nextIdx].id);
  }

  public toggleMute(): void {
    this.muted = !this.muted;
    if (this.audio) {
      this.audio.muted = this.muted;
    }
    this.emit();
  }

  public stop(): void {
    this.token += 1;
    if (this.audio) {
      this.audio.onplaying = null;
      this.audio.onwaiting = null;
      this.audio.onerror = null;
      try {
        this.audio.pause();
        this.audio.removeAttribute('src');
        this.audio.load();
      } catch {
        // ignore
      }
    }
    this.active = false;
    this.status = 'idle';
    this.errorMsg = null;
    this.emit();
  }
}

export const quranRadioPlayer = new QuranRadioPlayer();
