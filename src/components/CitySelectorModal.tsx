import React from 'react';
import { Capacitor } from '@capacitor/core';
import { Navigation, X } from 'lucide-react';
import { Coordinates } from '../types';
import { getLocalizedCityLabel } from '../utils/prayerTimes';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LocationBrowser } from './LocationBrowser';

interface CitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCity: Coordinates;
  onSelectCity: (city: Coordinates) => void;
  onDetectGPS: () => void;
}

export const CitySelectorModal: React.FC<CitySelectorModalProps> = ({
  isOpen,
  onClose,
  currentCity,
  onSelectCity,
  onDetectGPS,
}) => {
  const { isDay } = useTheme();
  const { language, t } = useLanguage();
  const isNative = Capacitor.isNativePlatform();

  if (!isOpen) return null;

  const currentLoc = getLocalizedCityLabel(
    currentCity.cityName,
    currentCity.countryName,
    language,
    currentCity.region
  );

  const currentSubtitle = [
    currentCity.subtitle,
    currentLoc.region && currentCity.region !== 'world' ? currentLoc.region : '',
    !currentLoc.region || currentCity.region === 'world' ? currentLoc.country : '',
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 backdrop-blur-md z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in ${
        isDay ? 'bg-stone-950/45' : 'bg-slate-950/85'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={
          isNative
            ? {
                paddingBottom:
                  'calc(max(env(safe-area-inset-bottom, 0px), var(--safe-area-inset-bottom, 0px)) + 8px)',
              }
            : undefined
        }
        className={`border rounded-t-3xl sm:rounded-3xl max-w-md w-full h-[86vh] max-h-[86vh] flex flex-col shadow-2xl overflow-hidden ${
          isDay
            ? 'bg-white border-[#dde3ea] text-slate-900'
            : 'bg-slate-900 border-emerald-800/80 text-white'
        }`}
      >
        {/* Drag Handle (Mobile) */}
        <div className="pt-2.5 pb-0.5 flex justify-center sm:hidden shrink-0">
          <div className={`w-10 h-1 rounded-full ${isDay ? 'bg-slate-300' : 'bg-slate-700'}`} />
        </div>

        {/* Header */}
        <div
          className={`px-4 py-3 border-b flex items-center justify-between shrink-0 ${
            isDay ? 'border-slate-100' : 'border-emerald-900/40'
          }`}
        >
          <div className="min-w-0 pr-2">
            <h3 className={`font-bold text-base truncate ${isDay ? 'text-slate-900' : 'text-white'}`}>
              {t.cityModal.title}
            </h3>
            <p className={`text-xs truncate ${isDay ? 'text-[#158509]' : 'text-emerald-400'}`}>
              {currentLoc.city}
              {currentSubtitle ? ` · ${currentSubtitle}` : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-xl transition shrink-0 ${
              isDay
                ? 'bg-[#ecf1f5] text-slate-600 hover:text-slate-900'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
            aria-label={t.names.closeBtn}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* GPS Auto Button + Shared Districts & Villages Browser */}
        <div className="px-4 pt-3 pb-4 flex flex-col min-h-0 flex-1 space-y-2.5">
          <button
            type="button"
            onClick={() => {
              onDetectGPS();
              onClose();
            }}
            className="w-full shrink-0 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-[#158509] hover:bg-[#0c5007] text-white font-bold text-xs shadow-md transition active:scale-[0.99]"
          >
            <Navigation className="w-4 h-4 shrink-0" />
            <span>{t.cityModal.useGps}</span>
          </button>

          <LocationBrowser
            selectedCity={currentCity}
            onSelectCity={(city) => {
              onSelectCity(city);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
};
