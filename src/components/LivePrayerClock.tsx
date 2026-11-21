import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { PrayerTimes } from '../types';
import { getCityCurrentDate, getNextPrayer } from '../utils/prayerTimes';

function formatDayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/**
 * Only re-renders when the local calendar date actually rolls over (once per 24h),
 * preventing unnecessary root App re-renders every minute while reading Quran or using Tasbih.
 */
export function useDayKey(): string {
  const [dayKey, setDayKey] = useState<string>(() => formatDayKey(new Date()));

  useEffect(() => {
    const check = () => {
      const next = formatDayKey(new Date());
      setDayKey((prev) => (prev === next ? prev : next));
    };
    const id = window.setInterval(check, 30_000);
    const onVis = () => {
      if (document.visibilityState === 'visible') check();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return dayKey;
}

/**
 * Ticks once every ~15s only changing when the formatted minute key changes,
 * avoiding costly full-tab re-renders every second for Hijri dates and prayer tables.
 */
export function useMinuteDate(): Date {
  const [minuteDate, setMinuteDate] = useState<Date>(() => new Date());

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setMinuteDate((prev) => {
        if (
          prev.getFullYear() === now.getFullYear() &&
          prev.getMonth() === now.getMonth() &&
          prev.getDate() === now.getDate() &&
          prev.getHours() === now.getHours() &&
          prev.getMinutes() === now.getMinutes()
        ) {
          return prev;
        }
        return now;
      });
    };

    const id = window.setInterval(tick, 5000);
    return () => window.clearInterval(id);
  }, []);

  return minuteDate;
}

function useSecondTick(): Date {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

export const LiveCityClock: React.FC<{ timezone?: string; className?: string }> = ({
  timezone,
  className = '',
}) => {
  const now = useSecondTick();
  const cityNow = getCityCurrentDate(now, timezone);
  const clockStr = `${String(cityNow.getHours()).padStart(2, '0')}:${String(cityNow.getMinutes()).padStart(2, '0')}:${String(cityNow.getSeconds()).padStart(2, '0')}`;
  return <span className={className}>{clockStr}</span>;
};

export const LivePrayerRemainingText: React.FC<{
  prayerTimes: PrayerTimes;
  timezone?: string;
  className?: string;
}> = ({ prayerTimes, timezone, className = '' }) => {
  const now = useSecondTick();
  const next = getNextPrayer(prayerTimes, now, timezone);
  return <span className={className}>{next.timeLeftStr}</span>;
};

interface LivePrayerHeroCountdownProps {
  prayerTimes: PrayerTimes;
  timezone?: string;
  remainingTextClassName: string;
  progressTrackClassName: string;
  progressFillClassName: string;
  labelBelow: React.ReactNode;
  showArc?: boolean;
}

export const LivePrayerHeroCountdown: React.FC<LivePrayerHeroCountdownProps> = ({
  prayerTimes,
  timezone,
  remainingTextClassName,
  progressTrackClassName,
  progressFillClassName,
  labelBelow,
  showArc = false,
}) => {
  const now = useSecondTick();
  const next = getNextPrayer(prayerTimes, now, timezone);
  const pct = Math.max(4, Math.min(100, next.progressPercent));

  // Position celestial orb along semi-elliptical horizon arc (rx=94, ry=38)
  const theta = Math.PI * (1 - pct / 100);
  const orbX = 120 + 94 * Math.cos(theta);
  const orbY = 50 - 38 * Math.sin(theta);
  const isNightOrb = next.activeId === 'isha' || next.activeId === 'maghrib' || next.activeId === 'fajr';

  return (
    <>
      {showArc && (
        <div className="relative mx-auto w-full max-w-[260px] -mb-2 select-none pointer-events-none">
          <svg viewBox="0 0 240 58" className="w-full h-14 overflow-visible">
            <defs>
              <linearGradient id="nqHorizonProg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
                <stop offset="100%" stopColor="#fde68a" />
              </linearGradient>
              <radialGradient id="nqOrbGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(253, 230, 138, 0.85)" />
                <stop offset="100%" stopColor="rgba(253, 230, 138, 0)" />
              </radialGradient>
            </defs>
            {/* Dashed horizon arc track */}
            <path
              d="M 26 50 A 94 38 0 0 1 214 50"
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="2"
              strokeDasharray="3 4"
              strokeLinecap="round"
            />
            {/* Active elapsed arc */}
            <path
              d="M 26 50 A 94 38 0 0 1 214 50"
              fill="none"
              stroke="url(#nqHorizonProg)"
              strokeWidth="2.5"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray="100"
              strokeDashoffset={(100 - pct).toFixed(1)}
            />
            {/* Endpoint window markers */}
            <circle cx="26" cy="50" r="2.5" fill="rgba(255,255,255,0.45)" />
            <circle cx="214" cy="50" r="2.5" fill="#d0f39f" />
            <text x="26" y="61" textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize="8.5" fontFamily="monospace">
              {next.activeTimeStr}
            </text>
            <text x="214" y="61" textAnchor="middle" fill="rgba(208,243,159,0.9)" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
              {next.timeStr}
            </text>
            {/* Moving Sun / Moon orb */}
            <circle cx={orbX} cy={orbY} r="10" fill="url(#nqOrbGlow)" />
            <circle
              cx={orbX}
              cy={orbY}
              r="4.5"
              fill={isNightOrb ? '#fef3c7' : '#fde047'}
              stroke="#ffffff"
              strokeWidth="1.2"
            />
          </svg>
        </div>
      )}
      <h2 className={remainingTextClassName}>{next.timeLeftStr}</h2>
      <p className="text-xs text-white/85 font-medium">{labelBelow}</p>
      <div className={progressTrackClassName}>
        <div className={progressFillClassName} style={{ width: `${pct}%` }} />
      </div>
    </>
  );
};

interface LiveRamadanHeroProps {
  prayerTimes: PrayerTimes;
  timezone?: string;
  labels: {
    fastingInProgress: string;
    eatingWindow: string;
    targetLabel: string;
    untilIftar: string;
    untilSuhoor: string;
    elapsedLabel: string;
    fajrLabel: string;
    maghribLabel: string;
    iftarTitle: string;
    imsakLabel: string;
  };
}

export const LiveRamadanHero: React.FC<LiveRamadanHeroProps> = ({
  prayerTimes,
  timezone,
  labels,
}) => {
  const now = useSecondTick();
  const cityNow = getCityCurrentDate(now, timezone);
  const currentMinutes = cityNow.getHours() * 60 + cityNow.getMinutes() + cityNow.getSeconds() / 60;

  const [fajrH, fajrM] = prayerTimes.fajr.split(':').map(Number);
  const [maghribH, maghribM] = prayerTimes.maghrib.split(':').map(Number);

  const fajrMinutes = fajrH * 60 + fajrM;
  const maghribMinutes = maghribH * 60 + maghribM;
  const isFastingNow = currentMinutes >= fajrMinutes && currentMinutes < maghribMinutes;

  let countdownLabel = '';
  let countdownTimeStr = '';
  let targetEventTime = '';
  let progressPercent = 0;

  if (isFastingNow) {
    countdownLabel = labels.untilIftar;
    targetEventTime = prayerTimes.maghrib;
    const diff = Math.max(0, maghribMinutes - currentMinutes);
    const hrs = Math.floor(diff / 60);
    const mins = Math.floor(diff % 60);
    const secs = Math.floor((diff * 60) % 60);
    countdownTimeStr = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    const totalFastingWindow = maghribMinutes - fajrMinutes;
    const elapsed = currentMinutes - fajrMinutes;
    progressPercent = Math.min(100, Math.max(0, (elapsed / totalFastingWindow) * 100));
  } else {
    countdownLabel = labels.untilSuhoor;
    targetEventTime = prayerTimes.imsak;
    const diff =
      currentMinutes < fajrMinutes
        ? fajrMinutes - currentMinutes
        : 24 * 60 - currentMinutes + fajrMinutes;
    const hrs = Math.floor(diff / 60);
    const mins = Math.floor(diff % 60);
    const secs = Math.floor((diff * 60) % 60);
    countdownTimeStr = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    const nightTotal = 24 * 60 - maghribMinutes + fajrMinutes;
    const nightElapsed =
      currentMinutes >= maghribMinutes
        ? currentMinutes - maghribMinutes
        : 24 * 60 - maghribMinutes + currentMinutes;
    progressPercent = Math.min(100, Math.max(0, (nightElapsed / nightTotal) * 100));
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
            isFastingNow
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-emerald-900/70 text-emerald-300 border-emerald-700/50'
          }`}
        >
          {isFastingNow ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>{labels.fastingInProgress}</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              <span>{labels.eatingWindow}</span>
            </>
          )}
        </span>

        <span className="text-xs text-slate-300 font-medium">
          {labels.targetLabel} <b className="text-amber-300 font-mono">{targetEventTime}</b>
        </span>
      </div>

      <div className="text-center my-4">
        <p className="text-xs text-emerald-300/90 font-medium tracking-wide uppercase">
          {countdownLabel}
        </p>
        <h2 className="text-4xl sm:text-5xl font-black font-mono tracking-wider text-amber-300 drop-shadow mt-1 tabular-nums">
          {countdownTimeStr}
        </h2>

        <div className="w-full bg-slate-950/80 rounded-full h-2.5 mt-3 p-0.5 border border-emerald-800/60 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 via-amber-400 to-amber-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 font-mono">
          <span>
            {isFastingNow
              ? `${labels.fajrLabel}: ${prayerTimes.fajr}`
              : `${labels.maghribLabel}: ${prayerTimes.maghrib}`}
          </span>
          <span>
            {Math.round(progressPercent)}% {labels.elapsedLabel}
          </span>
          <span>
            {isFastingNow
              ? `${labels.iftarTitle}: ${prayerTimes.maghrib}`
              : `${labels.imsakLabel}: ${prayerTimes.imsak}`}
          </span>
        </div>
      </div>
    </>
  );
};
