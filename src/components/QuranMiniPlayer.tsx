import React from 'react';
import { Capacitor } from '@capacitor/core';
import { Pause, Play, SkipBack, SkipForward, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import {
  NativeQuranAudioState,
  hasNativeQuranAudioBridge,
  nativeNextAyah,
  nativePrevAyah,
  nativeStopAudio,
  nativeTogglePlayPause,
} from '../utils/nativeQuranAudio';
import { webQuranPlayer } from '../utils/webQuranPlayer';

interface QuranMiniPlayerProps {
  audioState: NativeQuranAudioState;
  showBottomSafePadding: boolean;
  onOpenSurah: (surahNumber: number, ayahNumber: number) => void;
}

export const QuranMiniPlayer: React.FC<QuranMiniPlayerProps> = ({
  audioState,
  showBottomSafePadding,
  onOpenSurah,
}) => {
  const { isDay } = useTheme();
  const isNative = Capacitor.isNativePlatform();

  const isNativeAudio = hasNativeQuranAudioBridge();

  if (!audioState.active || audioState.surahNumber <= 0) return null;

  const handlePrev = () => {
    if (isNativeAudio) nativePrevAyah();
    else webQuranPlayer.switchSurah(-1);
  };

  const handleToggle = () => {
    if (isNativeAudio) nativeTogglePlayPause();
    else webQuranPlayer.togglePlayPause();
  };

  const handleNext = () => {
    if (isNativeAudio) nativeNextAyah();
    else webQuranPlayer.switchSurah(1);
  };

  const handleStop = () => {
    if (isNativeAudio) nativeStopAudio();
    else webQuranPlayer.stop();
  };

  const progressPct =
    audioState.totalAyahs > 0
      ? Math.min(100, Math.max(4, Math.round((Math.max(1, audioState.ayahNumber) / audioState.totalAyahs) * 100)))
      : 0;

  return (
    <div
      style={
        showBottomSafePadding && isNative
          ? {
              paddingBottom:
                'calc(max(env(safe-area-inset-bottom, 0px), var(--safe-area-inset-bottom, 0px)) + 8px)',
            }
          : undefined
      }
      className={`shrink-0 w-full rounded-t-3xl border-t-2 overflow-hidden z-30 transition-colors ${
        isDay
          ? 'bg-[#f2fbef] border-[#9fd895] shadow-[0_-6px_20px_rgba(12,71,3,0.08)]'
          : 'bg-slate-900/95 border-emerald-700/80 shadow-[0_-6px_22px_rgba(0,0,0,0.48)]'
      }`}
    >
      {/* Thin embedded progress accent along top curve */}
      <div className={`w-full h-[2.5px] ${isDay ? 'bg-[#d6efd0]' : 'bg-emerald-950'}`}>
        <div
          className={`h-full transition-all duration-300 ${isDay ? 'bg-[#158509]' : 'bg-amber-400'}`}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-2 px-3.5 py-2">
        <button
          type="button"
          onClick={() => onOpenSurah(audioState.surahNumber, Math.max(1, audioState.ayahNumber))}
          className="flex items-center gap-2.5 min-w-0 flex-1 text-left"
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
              {audioState.surahNumber}. {audioState.surahName}
            </p>
            <p className={`text-[10.5px] truncate tabular-nums ${isDay ? 'text-slate-600' : 'text-slate-400'}`}>
              {audioState.ayahNumber}/{audioState.totalAyahs} · {audioState.reciterName}
            </p>
          </div>
        </button>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            disabled={audioState.surahNumber <= 1}
            className={`p-2 rounded-xl border transition active:scale-95 disabled:opacity-35 ${
              isDay
                ? 'bg-white border-[#c3e2bc] text-[#0c4703] hover:bg-[#e1f5db]'
                : 'bg-slate-800 border-emerald-800/60 text-slate-200 hover:text-white'
            }`}
            aria-label="Previous Surah"
          >
            <SkipBack className="w-3.5 h-3.5 fill-current" />
          </button>

          <button
            type="button"
            onClick={handleToggle}
            className={`p-2 rounded-xl transition active:scale-95 shadow-xs ${
              isDay
                ? 'bg-[#158509] text-white'
                : 'bg-amber-400 text-slate-950'
            }`}
            aria-label={audioState.isPlaying ? 'Pause' : 'Play'}
          >
            {audioState.isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={audioState.surahNumber >= 114}
            className={`p-2 rounded-xl border transition active:scale-95 disabled:opacity-35 ${
              isDay
                ? 'bg-white border-[#c3e2bc] text-[#0c4703] hover:bg-[#e1f5db]'
                : 'bg-slate-800 border-emerald-800/60 text-slate-200 hover:text-white'
            }`}
            aria-label="Next Surah"
          >
            <SkipForward className="w-3.5 h-3.5 fill-current" />
          </button>

          <button
            type="button"
            onClick={handleStop}
            className={`p-2 rounded-xl border transition active:scale-95 ${
              isDay
                ? 'bg-white border-[#d7e2dd] text-slate-500 hover:text-rose-600'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-rose-400'
            }`}
            aria-label="Stop"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Colored separator line dividing the docked Mini-Player and the Bottom Navigation Bar */}
      {!showBottomSafePadding && (
        <div
          className={`mx-3.5 h-[1.5px] rounded-full ${
            isDay ? 'bg-[#9bd691]' : 'bg-emerald-800/85'
          }`}
        />
      )}
    </div>
  );
};
