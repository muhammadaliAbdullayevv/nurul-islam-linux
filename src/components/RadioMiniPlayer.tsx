import React from 'react';
import { Capacitor } from '@capacitor/core';
import { Loader2, Pause, Play, Radio, SkipForward, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getRadioStationById } from '../data/quranRadioStations';
import { QuranRadioState, quranRadioPlayer } from '../utils/quranRadioPlayer';

interface RadioMiniPlayerProps {
  radioState: QuranRadioState;
  showBottomSafePadding: boolean;
  onOpenRadio: () => void;
}

export const RadioMiniPlayer: React.FC<RadioMiniPlayerProps> = ({
  radioState,
  showBottomSafePadding,
  onOpenRadio,
}) => {
  const { isDay } = useTheme();
  const { language } = useLanguage();
  const isNative = Capacitor.isNativePlatform();

  if (!radioState.active || !radioState.stationId) return null;

  const station = getRadioStationById(radioState.stationId);
  const isPlaying = radioState.status === 'playing';
  const isConnecting = radioState.status === 'connecting';

  const liveBadge =
    language === 'ru' ? 'ЭФИР' : language === 'en' ? 'LIVE' : language === 'uz_cyr' ? 'ЖОНЛИ' : 'JONLI';

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
          onClick={onOpenRadio}
          className="flex items-center gap-2.5 min-w-0 flex-1 text-left"
        >
          <div
            className={`relative w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              isDay
                ? 'bg-[#eef9ea] text-[#158509] border border-[#c5e8bc]'
                : 'bg-emerald-950 text-amber-400 border border-emerald-800/60'
            }`}
          >
            <Radio className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
            {isPlaying && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className={`px-1.5 py-0.2 rounded-md text-[9px] font-extrabold tracking-wider shrink-0 ${
                  isPlaying
                    ? 'bg-rose-500 text-white'
                    : isDay
                    ? 'bg-slate-100 text-slate-600'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {liveBadge}
              </span>
              <p className={`text-xs font-bold truncate ${isDay ? 'text-[#0c4703]' : 'text-white'}`}>
                {station.name[language]}
              </p>
            </div>
            <p className={`text-[10.5px] truncate ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
              {station.subtitle[language]}
            </p>
          </div>
        </button>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => quranRadioPlayer.togglePlayPause(station.id)}
            className={`p-2 rounded-xl transition active:scale-95 ${
              isDay ? 'bg-[#158509] text-white' : 'bg-amber-400 text-slate-950'
            }`}
            aria-label={isPlaying ? 'Pause Radio' : 'Play Radio'}
          >
            {isConnecting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
          </button>

          <button
            type="button"
            onClick={() => quranRadioPlayer.playRelative(1)}
            className={`p-2 rounded-xl transition active:scale-95 ${
              isDay
                ? 'bg-[#f1f5f9] text-[#0c4703] hover:bg-[#e1f5db]'
                : 'bg-slate-800 text-slate-200 hover:text-white'
            }`}
            aria-label="Next Station"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => quranRadioPlayer.stop()}
            className={`p-2 rounded-xl transition active:scale-95 ${
              isDay
                ? 'bg-[#f1f5f9] text-slate-500 hover:text-rose-600'
                : 'bg-slate-800 text-slate-400 hover:text-rose-400'
            }`}
            aria-label="Stop Radio"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
