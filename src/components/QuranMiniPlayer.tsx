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
import { MushafIcon } from './icons/IslamicFeatureIcons';

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
    else webQuranPlayer.prevAyah();
  };

  const handleToggle = () => {
    if (isNativeAudio) nativeTogglePlayPause();
    else webQuranPlayer.togglePlayPause();
  };

  const handleNext = () => {
    if (isNativeAudio) nativeNextAyah();
    else webQuranPlayer.nextAyah();
  };

  const handleStop = () => {
    if (isNativeAudio) nativeStopAudio();
    else webQuranPlayer.stop();
  };

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
      className={`shrink-0 px-3 ${showBottomSafePadding ? (isNative ? 'pt-1.5' : 'py-2') : 'pb-1.5 pt-1'} z-30`}
    >
      <div
        className={`flex items-center justify-between gap-2 rounded-2xl border px-3 py-2 transition-colors ${
          isDay
            ? 'bg-white border-[#cde8c3] shadow-[0_4px_14px_rgba(12,71,3,0.08)]'
            : 'bg-slate-900 border-emerald-800/70 shadow-[0_4px_16px_rgba(0,0,0,0.45)]'
        }`}
      >
        <button
          type="button"
          onClick={() => onOpenSurah(audioState.surahNumber, Math.max(1, audioState.ayahNumber))}
          className="flex items-center gap-2.5 min-w-0 flex-1 text-left"
        >
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              isDay
                ? 'bg-[#eef9ea] text-[#158509] border border-[#c5e8bc]'
                : 'bg-emerald-950 text-amber-400 border border-emerald-800/60'
            }`}
          >
            <MushafIcon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className={`text-xs font-bold truncate ${isDay ? 'text-[#0c4703]' : 'text-white'}`}>
              {audioState.surahNumber}. {audioState.surahName}
            </p>
            <p className={`text-[10.5px] truncate tabular-nums ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
              {audioState.ayahNumber}/{audioState.totalAyahs} · {audioState.reciterName}
            </p>
          </div>
        </button>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            disabled={isNativeAudio ? audioState.surahNumber <= 1 : audioState.ayahNumber <= 1}
            className={`p-2 rounded-xl transition active:scale-95 disabled:opacity-35 ${
              isDay
                ? 'bg-[#f1f5f9] text-[#0c4703] hover:bg-[#e1f5db]'
                : 'bg-slate-800 text-slate-200 hover:text-white'
            }`}
            aria-label={isNativeAudio ? 'Previous Surah' : 'Previous Ayah'}
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleToggle}
            className={`p-2 rounded-xl transition active:scale-95 ${
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
            disabled={
              isNativeAudio
                ? audioState.surahNumber >= 114
                : audioState.ayahNumber >= audioState.totalAyahs
            }
            className={`p-2 rounded-xl transition active:scale-95 disabled:opacity-35 ${
              isDay
                ? 'bg-[#f1f5f9] text-[#0c4703] hover:bg-[#e1f5db]'
                : 'bg-slate-800 text-slate-200 hover:text-white'
            }`}
            aria-label={isNativeAudio ? 'Next Surah' : 'Next Ayah'}
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleStop}
            className={`p-2 rounded-xl transition active:scale-95 ${
              isDay
                ? 'bg-[#f1f5f9] text-slate-500 hover:text-rose-600'
                : 'bg-slate-800 text-slate-400 hover:text-rose-400'
            }`}
            aria-label="Stop"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
