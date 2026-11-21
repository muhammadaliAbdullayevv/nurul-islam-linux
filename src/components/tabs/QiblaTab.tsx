import React, { useState, useEffect, useRef } from 'react';
import { Compass, MapPin, Navigation, Info, CheckCircle2, Radio } from 'lucide-react';
import { QiblaKaabaIcon } from '../icons/IslamicFeatureIcons';
import { Coordinates } from '../../types';
import { calculateQibla, getLocalizedCityLabel } from '../../utils/prayerTimes';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

interface QiblaTabProps {
  currentCity: Coordinates;
  onOpenCitySelector: () => void;
}

interface CompassBridge {
  start: (lat: number, lng: number) => void;
  updateCoordinates: (lat: number, lng: number) => void;
  stop: () => void;
  getState: () => string;
}

function shortestAngleDiff(fromDeg: number, toDeg: number): number {
  return ((toDeg - fromDeg + 540) % 360) - 180;
}

export const QiblaTab: React.FC<QiblaTabProps> = ({ currentCity, onOpenCitySelector }) => {
  const { isDay } = useTheme();
  const { language, t } = useLanguage();
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [hasCompassSensor, setHasCompassSensor] = useState(false);
  const [manualHeading, setManualHeading] = useState<number>(0);

  // Continuous unwrapped CSS angles so crossing 0°/360° never spins backwards
  const unwrappedDialRef = useRef<number>(0);
  const smoothedHeadingRef = useRef<number | null>(null);
  const [dialAngle, setDialAngle] = useState<number>(0);

  const { bearing: qiblaBearing, distanceKm } = calculateQibla(
    currentCity.latitude,
    currentCity.longitude
  );

  // Sync city coordinates to native Android compass bridge when it changes
  useEffect(() => {
    const win = window as Window & { NqCompassBridge?: CompassBridge };
    if (win.NqCompassBridge) {
      try {
        win.NqCompassBridge.updateCoordinates(currentCity.latitude, currentCity.longitude);
      } catch {
        // Ignore bridge call error
      }
    }
  }, [currentCity.latitude, currentCity.longitude]);

  useEffect(() => {
    const applySmoothHeading = (rawHeading: number) => {
      const normalized = ((rawHeading % 360) + 360) % 360;
      if (smoothedHeadingRef.current === null) {
        smoothedHeadingRef.current = normalized;
      } else {
        const delta = shortestAngleDiff(smoothedHeadingRef.current, normalized);
        // Low-pass filter to reduce jitter without lag
        smoothedHeadingRef.current = ((smoothedHeadingRef.current + delta * 0.35) % 360 + 360) % 360;
      }
      setDeviceHeading(Math.round(smoothedHeadingRef.current));
      setHasCompassSensor(true);
    };

    const win = window as Window & { NqCompassBridge?: CompassBridge };
    if (win.NqCompassBridge) {
      try {
        win.NqCompassBridge.start(currentCity.latitude, currentCity.longitude);
      } catch {
        // Ignore startup error
      }

      const pollTimer = window.setInterval(() => {
        try {
          const parsed = JSON.parse(win.NqCompassBridge!.getState()) as {
            active?: boolean;
            heading?: number;
          };
          if (parsed.active && typeof parsed.heading === 'number' && Number.isFinite(parsed.heading)) {
            applySmoothHeading(parsed.heading);
          }
        } catch {
          // Ignore parse error
        }
      }, 50);

      return () => {
        window.clearInterval(pollTimer);
        try {
          win.NqCompassBridge?.stop();
        } catch {
          // Ignore stop error
        }
      };
    }

    // Web fallback: ONLY trust true absolute orientation or Safari webkitCompassHeading
    const handleAbsoluteOrientation = (e: Event) => {
      const ev = e as DeviceOrientationEvent & { webkitCompassHeading?: number };
      let heading: number | null = null;
      if (typeof ev.webkitCompassHeading === 'number' && Number.isFinite(ev.webkitCompassHeading)) {
        heading = ev.webkitCompassHeading;
      } else if (ev.absolute === true && typeof ev.alpha === 'number' && Number.isFinite(ev.alpha)) {
        heading = (360 - ev.alpha) % 360;
      }
      if (heading !== null) {
        applySmoothHeading(heading);
      }
    };

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientationabsolute', handleAbsoluteOrientation, true);
      window.addEventListener('deviceorientation', handleAbsoluteOrientation, true);
    }

    return () => {
      if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
        window.removeEventListener('deviceorientationabsolute', handleAbsoluteOrientation, true);
        window.removeEventListener('deviceorientation', handleAbsoluteOrientation, true);
      }
    };
  }, [currentCity.latitude, currentCity.longitude]);

  const currentHeading = hasCompassSensor ? deviceHeading : manualHeading;

  // Keep continuous unwrapped compass dial angle (-currentHeading)
  useEffect(() => {
    const targetDial = -currentHeading;
    const diff = shortestAngleDiff(unwrappedDialRef.current, targetDial);
    unwrappedDialRef.current += diff;
    setDialAngle(unwrappedDialRef.current);
  }, [currentHeading]);

  // Signed shortest offset from current phone top to Qibla (-180..+180)
  const angularOffset = Math.abs(shortestAngleDiff(currentHeading, qiblaBearing));
  const isAligned = angularOffset <= 4;
  const localizedCity = getLocalizedCityLabel(currentCity.cityName, currentCity.countryName, language, currentCity.region);

  return (
    <div className={`space-y-4 pb-8 ${isDay ? 'text-slate-900' : 'text-slate-100'}`}>
      {/* Top Location + Live Sensor Bar (No Redundant Page Title) */}
      <div className="flex items-center justify-between gap-2">
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
            hasCompassSensor
              ? isDay
                ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                : 'bg-emerald-950/90 border-emerald-700/60 text-emerald-300'
              : isDay
              ? 'bg-white border-[#dde3ea] text-slate-600'
              : 'bg-slate-900 border-emerald-900/60 text-slate-300'
          }`}
        >
          <Radio className={`w-3.5 h-3.5 ${hasCompassSensor ? 'animate-pulse text-[#158509]' : 'opacity-60'}`} />
          <span>{hasCompassSensor ? t.qibla.liveSensor : t.qibla.manualMode}</span>
        </div>

        <button
          type="button"
          onClick={onOpenCitySelector}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold shrink-0 transition ${
            isDay
              ? 'bg-white border-[#dde3ea] text-slate-800 hover:bg-[#eef9ea]'
              : 'bg-slate-900 border-emerald-900/60 text-emerald-300 hover:text-white'
          }`}
        >
          <MapPin className={`w-3.5 h-3.5 ${isDay ? 'text-[#158509]' : 'text-amber-400'}`} />
          <span>{localizedCity.city}</span>
        </button>
      </div>

      {/* Alignment Status Banner */}
      <div
        className={`p-3.5 rounded-2xl flex items-center justify-between transition border ${
          isAligned
            ? isDay
              ? 'bg-[#0c5007] border-[#158509] text-white shadow-md nq-keep-dark'
              : 'bg-emerald-950 border-amber-400 text-amber-300 shadow-lg shadow-emerald-950/80'
            : isDay
            ? 'bg-white border-[#dde3ea] text-slate-800 shadow-xs'
            : 'bg-slate-900/90 border-emerald-900/40 text-slate-300'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {isAligned ? (
            <CheckCircle2 className={`w-5 h-5 shrink-0 ${isDay ? 'text-[#d0f39f]' : 'text-amber-400'}`} />
          ) : (
            <Navigation
              className={`w-5 h-5 shrink-0 transition-transform ${
                isDay ? 'text-[#158509]' : 'text-emerald-400'
              }`}
              style={{ transform: `rotate(${qiblaBearing - currentHeading}deg)` }}
            />
          )}
          <div>
            <p className={`text-xs font-bold ${isAligned ? 'text-white' : isDay ? 'text-slate-900' : 'text-white'}`}>
              {isAligned ? t.qibla.alignedMsg : t.qibla.rotateMsg}
            </p>
            <p
              className={`text-[11px] ${
                isAligned ? 'text-white/85' : isDay ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              {t.qibla.bearingLabel}{' '}
              <span className={`font-mono font-bold ${isAligned ? 'text-[#d0f39f]' : isDay ? 'text-[#0c4703]' : 'text-amber-300'}`}>
                {qiblaBearing}°
              </span>{' '}
              {t.qibla.fromNorth} · {t.qibla.phoneHeadingLabel}{' '}
              <span className="font-mono font-semibold">{currentHeading}°</span>
            </p>
          </div>
        </div>

        <div className="text-right shrink-0 pl-2">
          <span className={`font-mono font-bold text-sm ${isAligned ? 'text-white' : isDay ? 'text-slate-900' : 'text-white'}`}>
            {distanceKm.toLocaleString()} km
          </span>
          <span className={`text-[10px] block ${isAligned ? 'text-white/80' : isDay ? 'text-slate-500' : 'text-slate-400'}`}>
            {t.qibla.toMakkah}
          </span>
        </div>
      </div>

      {/* Physical Compass Rose Ring (Rotates with Phone so North/East/South/West + Kaaba match Real World!) */}
      <div className="relative flex flex-col items-center justify-center py-3">
        {/* Fixed Top Lubber Pointer showing straight ahead of the phone */}
        <div className="mb-1.5 flex flex-col items-center">
          <div
            className={`w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[11px] transition-colors ${
              isAligned ? 'border-t-amber-400' : isDay ? 'border-t-[#158509]' : 'border-t-emerald-400'
            }`}
          />
        </div>

        <div className="relative flex items-center justify-center">
          <div
            className={`absolute w-72 h-72 rounded-full blur-2xl transition-all duration-500 ${
              isAligned ? 'bg-amber-400/25' : isDay ? 'bg-[#158509]/10' : 'bg-emerald-600/15'
            }`}
          />

          <div
            className={`nq-keep-dark relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 flex items-center justify-center shadow-2xl ${
              isAligned
                ? 'border-amber-400 bg-gradient-to-b from-[#0a3c06] via-[#0c5007] to-slate-950 shadow-amber-500/20'
                : 'border-emerald-900/80 bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-950 shadow-emerald-950/70'
            }`}
          >
            {/* Rotating True-North World Ring (Ticks + Cardinals + Kaaba Needle attached at True Qibla Bearing) */}
            <div
              className="absolute inset-0 flex items-center justify-center transition-transform duration-100 ease-out"
              style={{ transform: `rotate(${dialAngle}deg)` }}
            >
              {/* Compass Degree Ticks */}
              {Array.from({ length: 36 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute inset-0 flex justify-center pointer-events-none"
                  style={{ transform: `rotate(${i * 10}deg)` }}
                >
                  <div
                    className={`mt-1.5 w-0.5 ${
                      i === 0
                        ? 'h-4 bg-rose-400'
                        : i % 9 === 0
                        ? 'h-3.5 bg-amber-400'
                        : 'h-2 bg-emerald-700/80'
                    }`}
                  />
                </div>
              ))}

              {/* True Cardinal Labels Rotating with the Compass Ring */}
              <span className="absolute top-5 font-bold text-xs text-rose-400 tracking-wide">
                {t.qibla.cardinalN}
              </span>
              <span className="absolute right-5 font-bold text-xs text-slate-300">
                {t.qibla.cardinalE}
              </span>
              <span className="absolute bottom-5 font-bold text-xs text-slate-300">
                {t.qibla.cardinalS}
              </span>
              <span className="absolute left-5 font-bold text-xs text-slate-300">
                {t.qibla.cardinalW}
              </span>

              {/* Kaaba Qibla Arrow fixed inside the World Ring at exact qiblaBearing° clockwise from North */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ transform: `rotate(${qiblaBearing}deg)` }}
              >
                <div className="relative flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-xl p-1 flex items-center justify-center shadow-lg mb-1 transition ${
                      isAligned
                        ? 'bg-gradient-to-br from-amber-300 to-amber-500 shadow-amber-400/60 scale-105'
                        : 'bg-gradient-to-br from-amber-400 to-amber-600 shadow-amber-500/40'
                    }`}
                  >
                    <div className="w-full h-full bg-slate-950 rounded-lg flex items-center justify-center border border-amber-300/70">
                      <span className="font-arabic text-amber-400 text-xs font-bold">كعبة</span>
                    </div>
                  </div>

                  <div className="w-0 h-0 border-l-[13px] border-l-transparent border-r-[13px] border-r-transparent border-b-[40px] border-b-amber-400 drop-shadow" />

                  <div className="w-7 h-7 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center shadow-inner my-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  </div>

                  <div className="w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-t-[32px] border-t-slate-600/80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Compass Simulator (Only active/interactive when compass sensor is unavailable or for desktop testing) */}
      {!hasCompassSensor && (
        <div
          className={`p-4 rounded-2xl border space-y-2 ${
            isDay
              ? 'bg-white border-[#dde3ea] shadow-xs'
              : 'bg-slate-900/80 border-emerald-900/50'
          }`}
        >
          <div className="flex items-center justify-between text-xs">
            <span className={`flex items-center gap-1.5 font-medium ${isDay ? 'text-slate-600' : 'text-slate-300'}`}>
              <QiblaKaabaIcon className={`w-4 h-4 ${isDay ? 'text-[#158509]' : 'text-amber-400'}`} />
              <span>{t.qibla.simulatorTitle}</span>
            </span>
            <span className={`font-mono font-bold ${isDay ? 'text-[#0c4703]' : 'text-amber-300'}`}>
              {currentHeading}°
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="360"
            value={manualHeading}
            onChange={(e) => setManualHeading(Number(e.target.value))}
            className={`w-full cursor-pointer ${isDay ? 'accent-[#158509]' : 'accent-amber-400'}`}
          />

          <div className={`flex items-center justify-between text-[11px] pt-1 ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
            <span>{t.qibla.northLabel}</span>
            <button
              type="button"
              onClick={() => setManualHeading(qiblaBearing)}
              className={`font-bold underline transition ${
                isDay ? 'text-[#158509] hover:text-[#0c4703]' : 'text-emerald-400 hover:text-amber-300'
              }`}
            >
              {t.qibla.snapBtn} ({qiblaBearing}°)
            </button>
            <span>360°</span>
          </div>
        </div>
      )}

      {/* Guidance Note */}
      <div
        className={`p-4 rounded-2xl border text-xs space-y-1 ${
          isDay
            ? 'bg-[#eef9ea] border-[#c5e8bc] text-slate-700'
            : 'bg-emerald-950/40 border-emerald-900/40 text-slate-300'
        }`}
      >
        <p className={`font-bold flex items-center gap-1.5 ${isDay ? 'text-[#0c4703]' : 'text-amber-400'}`}>
          <Info className="w-3.5 h-3.5" />
          <span>{t.qibla.accuracyTitle}</span>
        </p>
        <p className={`leading-relaxed ${isDay ? 'text-slate-600' : 'text-slate-400'}`}>{t.qibla.accuracyDesc}</p>
      </div>
    </div>
  );
};
