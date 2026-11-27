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
      className={`shrink-0 w-full rounded-t-3xl border-t-2 overflow-hidden z-30 transition-colors ${
        isDay
          ? 'bg-[#f2fbef] border-[#9fd895] shadow-[0_-6px_20px_rgba(12,71,3,0.08)]'
          : 'bg-slate-900/95 border-emerald-700/80 shadow-[0_-6px_22px_rgba(0,0,0,0.48)]'
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-3.5 py-2">
        <button
          type="button"
          onClick={onOpenRadio}
          className="flex items-center gap-2.5 min-w-0 flex-1 text-left"
        >
          <div
            className={`relative w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              isDay
                ? 'bg-[#e1f5da] text-[#158509] border border-[#b2e0a8]'
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
            <p className={`text-[10.5px] truncate ${isDay ? 'text-slate-600' : 'text-slate-400'}`}>
              {station.subtitle[language]}
            </p>
          </div>
        </button>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => quranRadioPlayer.togglePlayPause(station.id)}
            className={`p-2 rounded-xl transition active:scale-95 shadow-xs ${
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
            className={`p-2 rounded-xl border transition active:scale-95 ${
              isDay
                ? 'bg-white border-[#c3e2bc] text-[#0c4703] hover:bg-[#e1f5db]'
                : 'bg-slate-800 border-emerald-800/60 text-slate-200 hover:text-white'
            }`}
            aria-label="Next Station"
          >
            <SkipForward className="w-3.5 h-3.5 fill-current" />
          </button>

          <button
            type="button"
            onClick={() => quranRadioPlayer.stop()}
            className={`p-2 rounded-xl border transition active:scale-95 ${
              isDay
                ? 'bg-white border-[#d7e2dd] text-slate-500 hover:text-rose-600'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-rose-400'
            }`}
            aria-label="Stop Radio"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

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
