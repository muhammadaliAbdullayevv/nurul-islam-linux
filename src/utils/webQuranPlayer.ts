/**
 * Persistent Singleton Web & Linux Desktop Quran Audio Player.
 * Keeps Quran recitation playing smoothly across tab switches, drives the
 * floating QuranMiniPlayer bar, integrates with OS/browser Media Session API
 * (lock screen & headphone controls), plays from local IndexedDB offline blobs
 * first when downloaded, and pre-buffers Ayah N+1 for 0ms gapless transitions.
 */
import { ALL_SURAHS } from '../data/surahs';
import {
  DEFAULT_RECITER_ID,
  QuranReciterId,
  getReciterAyahAudioCandidates,
  getReciterById,
} from '../data/quranReciters';
import { Ayah } from '../types';
import { isConstrainedNetwork } from './tabLoaders';
import { addQuranListenSeconds } from './userActivity';
import { getWebOfflineAyahBlobUrl, isWebAudioDownloaded } from './webOfflineAudio';
import { NativeQuranAudioState } from './nativeQuranAudio';

export interface WebQuranPlayParams {
  surahNumber: number;
  surahName: string;
  reciterId: QuranReciterId;
  ayahs: Ayah[];
  startAyahNumber: number;
  offsetSec?: number;
}

class WebQuranPlayer {
  private audio: HTMLAudioElement | null = null;
  private preloadEl: HTMLAudioElement | null = null;
  private preloadMeta: {
    surahNumber: number;
    ayahNumber: number;
    reciterId: QuranReciterId;
    url: string;
  } | null = null;

  private playbackToken = 0;
  private active = false;
  private isPlaying = false;
  private isPreparing = false;
  private surahNumber = 0;
  private surahName = '';
  private reciterId: QuranReciterId = DEFAULT_RECITER_ID;
  private ayahs: Ayah[] = [];
  private currentAyahNumber = 1;
  private listenInterval: number | null = null;
  private listeners = new Set<(st: NativeQuranAudioState) => void>();

  private ensureElements(): HTMLAudioElement {
    if (!this.audio) {
      const el = new Audio();
      el.preload = 'auto';
      this.audio = el;
    }
    return this.audio;
  }

  public getState(): NativeQuranAudioState {
    const rec = getReciterById(this.reciterId);
    const posMs =
      this.audio && Number.isFinite(this.audio.currentTime)
        ? Math.max(0, Math.round(this.audio.currentTime * 1000))
        : 0;
    const durMs =
      this.audio && Number.isFinite(this.audio.duration) && this.audio.duration > 0
        ? Math.round(this.audio.duration * 1000)
        : 0;

    return {
      active: this.active,
      surahNumber: this.surahNumber,
      surahName: this.surahName,
      reciterName: rec.name,
      reciterKey: rec.storageKey,
      fullSurahMode: false,
      ayahNumber: this.currentAyahNumber,
      totalAyahs: this.ayahs.length,
      isPlaying: this.isPlaying,
      isPreparing: this.isPreparing,
      positionMs: posMs,
      durationMs: durMs,
    };
  }

  public subscribe(cb: (st: NativeQuranAudioState) => void): () => void {
    this.listeners.add(cb);
    cb(this.getState());
    return () => {
      this.listeners.delete(cb);
    };
  }

  private emit(): void {
    const snap = this.getState();
    this.listeners.forEach((fn) => fn(snap));
    this.updateMediaSession();
  }

  private syncListenTracker(): void {
    if (this.isPlaying) {
      if (this.listenInterval === null && typeof window !== 'undefined') {
        this.listenInterval = window.setInterval(() => {
          if (this.isPlaying) addQuranListenSeconds(5);
        }, 5000);
      }
    } else if (this.listenInterval !== null && typeof window !== 'undefined') {
      window.clearInterval(this.listenInterval);
      this.listenInterval = null;
    }
  }

  private updateMediaSession(): void {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    try {
      const ms = navigator.mediaSession;
      if (!this.active) {
        ms.playbackState = 'none';
        return;
      }
      const rec = getReciterById(this.reciterId);
      if (typeof MediaMetadata !== 'undefined') {
        ms.metadata = new MediaMetadata({
          title: `${this.surahNumber}. ${this.surahName} (${this.currentAyahNumber}/${this.ayahs.length})`,
          artist: rec.name,
          album: 'Nurul Islam',
          artwork: [
            { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          ],
        });
      }
      ms.playbackState = this.isPlaying ? 'playing' : 'paused';
      ms.setActionHandler('play', () => this.resume());
      ms.setActionHandler('pause', () => this.pause());
      ms.setActionHandler('previoustrack', () => this.prevAyah());
      ms.setActionHandler('nexttrack', () => this.nextAyah());
      ms.setActionHandler('stop', () => this.stop());
    } catch {
      // Ignore MediaSession browser quirks
    }
  }

  public clearPrebuffer(): void {
    if (this.preloadEl) {
      this.preloadEl.onerror = null;
      this.preloadEl.pause();
      this.preloadEl.removeAttribute('src');
      this.preloadEl.load();
    }
    this.preloadMeta = null;
  }

  public prebufferAyah(
    surahNumber: number,
    ayahs: Ayah[],
    ayahNum: number,
    reciterId: QuranReciterId
  ): void {
    if (isConstrainedNetwork()) return;
    const targetObj = ayahs.find((a) => a.numberInSurah === ayahNum);
    if (!targetObj) return;

    const rec = getReciterById(reciterId);
    if (isWebAudioDownloaded(surahNumber, rec.storageKey)) {
      return; // Already cached locally in IndexedDB
    }

    if (
      this.preloadMeta &&
      this.preloadMeta.surahNumber === surahNumber &&
      this.preloadMeta.ayahNumber === ayahNum &&
      this.preloadMeta.reciterId === reciterId
    ) {
      return;
    }

    const candidates = getReciterAyahAudioCandidates(
      reciterId,
      surahNumber,
      targetObj.numberInSurah,
      targetObj.number
    );
    if (candidates.length === 0) return;

    if (!this.preloadEl) {
      const el = new Audio();
      el.preload = 'auto';
      this.preloadEl = el;
    }
    const pre = this.preloadEl;

    const tryPreload = (candIdx: number) => {
      if (candIdx >= candidates.length) {
        this.preloadMeta = null;
        return;
      }
      const url = candidates[candIdx];
      this.preloadMeta = { surahNumber, ayahNumber: ayahNum, reciterId, url };
      pre.onerror = () => tryPreload(candIdx + 1);
      pre.src = url;
      pre.preload = 'auto';
      pre.load();
    };

    tryPreload(0);
  }

  public loadAndPlay(params: WebQuranPlayParams): void {
    this.surahNumber = params.surahNumber;
    this.surahName = params.surahName;
    this.reciterId = params.reciterId;
    this.ayahs = params.ayahs;
    this.active = true;
    this.playAyahInternal(params.startAyahNumber, params.offsetSec || 0);
  }

  public jumpToAyah(ayahNumber: number, offsetSec = 0): void {
    if (!this.active || this.ayahs.length === 0) return;
    this.playAyahInternal(ayahNumber, offsetSec);
  }

  public seekWithinCurrentAyah(offsetSec: number): void {
    if (!this.audio || !this.active) return;
    const clamped =
      this.audio.duration && Number.isFinite(this.audio.duration)
        ? Math.min(Math.max(0, offsetSec), Math.max(0, this.audio.duration - 0.1))
        : Math.max(0, offsetSec);
    this.audio.currentTime = clamped;
    this.emit();
    if (!this.isPlaying) {
      this.resume();
    }
  }

  public getLiveAudioTiming(): { currentTimeSec: number; durationSec: number } {
    if (!this.audio) return { currentTimeSec: 0, durationSec: 0 };
    return {
      currentTimeSec: Number.isFinite(this.audio.currentTime) ? this.audio.currentTime : 0,
      durationSec: Number.isFinite(this.audio.duration) ? this.audio.duration : 0,
    };
  }

  private playAyahInternal(ayahNumberInSurah: number, offsetSec = 0): void {
    const ayahObj = this.ayahs.find((a) => a.numberInSurah === ayahNumberInSurah);
    if (!ayahObj) {
      this.stop();
      return;
    }

    const rec = getReciterById(this.reciterId);
    const urls = getReciterAyahAudioCandidates(
      this.reciterId,
      this.surahNumber,
      ayahObj.numberInSurah,
      ayahObj.number
    );
    if (urls.length === 0) return;

    const token = ++this.playbackToken;
    this.currentAyahNumber = ayahNumberInSurah;
    this.isPreparing = true;
    this.active = true;
    this.emit();

    const attachHandlers = (el: HTMLAudioElement, onFail: () => void) => {
      let appliedSeek = false;
      el.onloadedmetadata = () => {
        if (token !== this.playbackToken) return;
        if (!appliedSeek && offsetSec > 0 && el.duration && Number.isFinite(el.duration)) {
          appliedSeek = true;
          el.currentTime = Math.min(offsetSec, Math.max(0, el.duration - 0.15));
        }
        this.emit();
      };
      el.onerror = () => {
        if (token !== this.playbackToken) return;
        onFail();
      };
      el.onended = () => {
        if (token !== this.playbackToken) return;
        const nextObj = this.ayahs.find((a) => a.numberInSurah === ayahNumberInSurah + 1);
        if (nextObj) {
          this.playAyahInternal(nextObj.numberInSurah, 0);
        } else {
          // End of Surah: pause cleanly at end (keep mini-player available)
          this.isPlaying = false;
          this.isPreparing = false;
          this.syncListenTracker();
          this.emit();
        }
      };
    };

    const startStandardFlow = () => {
      const audio = this.ensureElements();
      audio.onended = null;
      audio.onloadedmetadata = null;
      audio.onerror = null;

      this.prebufferAyah(this.surahNumber, this.ayahs, ayahNumberInSurah + 1, this.reciterId);

      const playCandidatesList = (candidateUrls: string[]) => {
        const tryCandidate = (candIdx: number) => {
          if (token !== this.playbackToken || candIdx >= candidateUrls.length) {
            if (token === this.playbackToken) {
              this.isPlaying = false;
              this.isPreparing = false;
              this.syncListenTracker();
              this.emit();
            }
            return;
          }

          attachHandlers(audio, () => {
            if (candIdx + 1 < candidateUrls.length) {
              tryCandidate(candIdx + 1);
            } else {
              this.isPlaying = false;
              this.isPreparing = false;
              this.syncListenTracker();
              this.emit();
            }
          });

          audio.src = candidateUrls[candIdx];
          audio.load();
          audio
            .play()
            .then(() => {
              if (token !== this.playbackToken) return;
              this.isPlaying = true;
              this.isPreparing = false;
              this.syncListenTracker();
              this.emit();
            })
            .catch((err: unknown) => {
              if (token !== this.playbackToken) return;
              if ((err as { name?: string })?.name === 'AbortError') return;
              if (candIdx + 1 < candidateUrls.length) {
                tryCandidate(candIdx + 1);
              } else {
                this.isPlaying = false;
                this.isPreparing = false;
                this.syncListenTracker();
                this.emit();
              }
            });
        };
        tryCandidate(0);
      };

      if (isWebAudioDownloaded(this.surahNumber, rec.storageKey)) {
        void getWebOfflineAyahBlobUrl(this.surahNumber, rec.storageKey, ayahNumberInSurah).then(
          (offlineUrl) => {
            if (token !== this.playbackToken) return;
            playCandidatesList(offlineUrl ? [offlineUrl, ...urls] : urls);
          }
        );
        return;
      }

      playCandidatesList(urls);
    };

    // Promote pre-buffered element if ready for 0ms gapless playback
    const preEl = this.preloadEl;
    const preMeta = this.preloadMeta;
    const canPromote = Boolean(
      offsetSec <= 0 &&
        preEl &&
        preMeta &&
        preMeta.surahNumber === this.surahNumber &&
        preMeta.ayahNumber === ayahNumberInSurah &&
        preMeta.reciterId === this.reciterId &&
        urls.includes(preMeta.url) &&
        preEl.readyState >= 2
    );

    if (canPromote && preEl) {
      const prevActive = this.audio;
      if (prevActive) {
        prevActive.onended = null;
        prevActive.onloadedmetadata = null;
        prevActive.onerror = null;
        prevActive.pause();
      }
      this.audio = preEl;
      this.preloadEl = prevActive || new Audio();
      this.preloadEl.preload = 'auto';
      this.preloadMeta = null;

      preEl.onerror = null;
      preEl.currentTime = 0;
      attachHandlers(preEl, () => {
        if (token === this.playbackToken) startStandardFlow();
      });

      this.prebufferAyah(this.surahNumber, this.ayahs, ayahNumberInSurah + 1, this.reciterId);

      preEl
        .play()
        .then(() => {
          if (token !== this.playbackToken) return;
          this.isPlaying = true;
          this.isPreparing = false;
          this.syncListenTracker();
          this.emit();
        })
        .catch((err: unknown) => {
          if (token !== this.playbackToken) return;
          if ((err as { name?: string })?.name === 'AbortError') return;
          if (prevActive) {
            this.audio = prevActive;
            this.preloadEl = preEl;
            preEl.pause();
          }
          startStandardFlow();
        });
      return;
    }

    startStandardFlow();
  }

  public pause(): void {
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
    }
    this.isPlaying = false;
    this.isPreparing = false;
    this.syncListenTracker();
    this.emit();
  }

  public resume(): void {
    if (!this.active) return;
    if (this.audio && this.audio.src) {
      this.audio
        .play()
        .then(() => {
          this.isPlaying = true;
          this.isPreparing = false;
          this.syncListenTracker();
          this.emit();
        })
        .catch(() => {
          this.playAyahInternal(this.currentAyahNumber, 0);
        });
      return;
    }
    this.playAyahInternal(this.currentAyahNumber, 0);
  }

  public togglePlayPause(): void {
    if (this.isPlaying) this.pause();
    else this.resume();
  }

  public switchSurah(delta: -1 | 1): void {
    if (!this.active || this.surahNumber <= 0) return;
    const targetNum = Math.max(1, Math.min(114, this.surahNumber + delta));
    if (targetNum === this.surahNumber) {
      this.playAyahInternal(1, 0);
      return;
    }
    const nextMeta = ALL_SURAHS.find((s) => s.number === targetNum);
    if (!nextMeta) return;
    const placeholderAyahs: Ayah[] = Array.from({ length: nextMeta.numberOfAyahs }, (_, idx) => ({
      numberInSurah: idx + 1,
      number: 0,
      text: '',
      translation: '',
    }));
    this.loadAndPlay({
      surahNumber: nextMeta.number,
      surahName: nextMeta.englishName,
      reciterId: this.reciterId,
      ayahs: placeholderAyahs,
      startAyahNumber: 1,
      offsetSec: 0,
    });
  }

  public nextAyah(): void {
    if (!this.active || this.ayahs.length === 0) return;
    const next = this.ayahs.find((a) => a.numberInSurah === this.currentAyahNumber + 1);
    if (next) {
      this.playAyahInternal(next.numberInSurah, 0);
    } else if (this.surahNumber < 114) {
      this.switchSurah(1);
    }
  }

  public prevAyah(): void {
    if (!this.active || this.ayahs.length === 0) return;
    if (this.audio && this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
      this.emit();
      return;
    }
    const prev = this.ayahs.find((a) => a.numberInSurah === this.currentAyahNumber - 1);
    if (prev) {
      this.playAyahInternal(prev.numberInSurah, 0);
    } else {
      this.playAyahInternal(1, 0);
    }
  }

  public stop(): void {
    this.playbackToken += 1;
    if (this.audio) {
      this.audio.pause();
      this.audio.onended = null;
      this.audio.onloadedmetadata = null;
      this.audio.onerror = null;
      this.audio.removeAttribute('src');
      this.audio.load();
    }
    this.clearPrebuffer();
    this.active = false;
    this.isPlaying = false;
    this.isPreparing = false;
    this.syncListenTracker();
    this.emit();
  }
}

export const webQuranPlayer = new WebQuranPlayer();
