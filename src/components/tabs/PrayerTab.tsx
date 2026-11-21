import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  Navigation,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowLeftRight,
  Sparkles,
  Share2,
  Star,
  X
} from 'lucide-react';
import { AsrMethod, CalcMethod, Coordinates } from '../../types';
import {
  calculatePrayerTimes,
  getHijriDate,
  getHijriParts,
  getHijriMonthsList,
  hijriToGregorian,
  getIslamicSpecialDates,
  IslamicSpecialDate,
  getCityCurrentDate,
  getLocalizedCityLabel
} from '../../utils/prayerTimes';
import { PrayerAlertPrefs } from '../../utils/nativePrayerBridge';
import { PRAYER_RICH_UI, getSpecialEventDetail } from '../../data/prayerRichData';
import { useLanguage, formatGregorianDate } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useMinuteDate } from '../LivePrayerClock';

interface PrayerTabProps {
  currentCity: Coordinates;
  onSelectCity: (city: Coordinates) => void;
  calcMethod: CalcMethod;
  onChangeCalcMethod: (method: CalcMethod) => void;
  asrMethod: AsrMethod;
  onDetectGPS: () => Promise<{ ok: boolean }> | void;
  onOpenCitySelector: () => void;
  alertPrefs: PrayerAlertPrefs;
  onChangeAlertPrefs: (next: PrayerAlertPrefs) => void;
}

const GREGORIAN_MONTHS: Record<string, string[]> = {
  uz_lat: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'],
  uz_cyr: ['Январ', 'Феврал', 'Март', 'Апрел', 'Май', 'Июн', 'Июл', 'Август', 'Сентабр', 'Октабр', 'Ноябр', 'Декабр'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
};

type TaqvimViewMode = 'special' | 'monthly' | 'converter';

interface UpcomingSpecialItem extends IslamicSpecialDate {
  diffDays: number;
}

export const PrayerTab: React.FC<PrayerTabProps> = ({
  currentCity,
  calcMethod,
  asrMethod,
  onDetectGPS,
  onOpenCitySelector,
}) => {
  const { isDay } = useTheme();
  const { language, t } = useLanguage();
  const rich = PRAYER_RICH_UI[language] || PRAYER_RICH_UI.en;

  const now = useMinuteDate();
  const [viewMode, setViewMode] = useState<TaqvimViewMode>('special');
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'detecting' | 'ok' | 'err'>('idle');
  const [shareCopied, setShareCopied] = useState(false);
  const [selectedSpecialEvent, setSelectedSpecialEvent] = useState<UpcomingSpecialItem | null>(null);

  const initialCityDate = getCityCurrentDate(new Date(), currentCity.timezone);
  const [viewMonth, setViewMonth] = useState(initialCityDate.getMonth());
  const [viewYear, setViewYear] = useState(initialCityDate.getFullYear());
  const [selectedMonthlyDay, setSelectedMonthlyDay] = useState<number>(initialCityDate.getDate());

  // Hijri / Gregorian converter states
  const initialHijri = getHijriParts(initialCityDate);
  const [convDir, setConvDir] = useState<'g2h' | 'h2g'>('g2h');
  const [gDay, setGDay] = useState(initialCityDate.getDate());
  const [gMonth, setGMonth] = useState(initialCityDate.getMonth() + 1);
  const [gYear, setGYear] = useState(initialCityDate.getFullYear());

  const [hDay, setHDay] = useState(initialHijri.day);
  const [hMonth, setHMonth] = useState(initialHijri.month);
  const [hYear, setHYear] = useState(initialHijri.year);

  useEffect(() => {
    const onBack = (e: Event) => {
      if (selectedSpecialEvent) {
        e.preventDefault();
        setSelectedSpecialEvent(null);
      }
    };
    window.addEventListener('nq:android-back', onBack);
    return () => window.removeEventListener('nq:android-back', onBack);
  }, [selectedSpecialEvent]);

  const cityNow = useMemo(
    () => getCityCurrentDate(now, currentCity.timezone),
    [now, currentCity.timezone]
  );
  const cityDayKey = `${cityNow.getFullYear()}-${cityNow.getMonth()}-${cityNow.getDate()}`;
  const cityMidnightMs = new Date(cityNow.getFullYear(), cityNow.getMonth(), cityNow.getDate(), 12, 0, 0).getTime();

  const hijriMonths = getHijriMonthsList(language);
  const gregMonths = GREGORIAN_MONTHS[language] || GREGORIAN_MONTHS.en;
  const loc = getLocalizedCityLabel(currentCity.cityName, currentCity.countryName, language, currentCity.region);

  // Ordered chronological list of upcoming special Islamic dates (next 355+ days, no duplicates by id)
  const upcomingDatesList = useMemo<UpcomingSpecialItem[]>(() => {
    const currentHYear = getHijriParts(cityNow).year;
    const rawCombined = [
      ...getIslamicSpecialDates(currentHYear, language),
      ...getIslamicSpecialDates(currentHYear + 1, language),
    ];

    const seenIds = new Set<string>();
    const items: UpcomingSpecialItem[] = [];

    for (const ev of rawCombined) {
      const diffDays = Math.round((ev.gregorianDate.getTime() - cityMidnightMs) / 86400000);
      if (diffDays < 0 || seenIds.has(ev.id)) continue;
      seenIds.add(ev.id);
      items.push({
        ...ev,
        diffDays,
      });
    }

    return items.sort((a, b) => a.diffDays - b.diffDays);
  }, [cityNow, cityMidnightMs, language]);

  const nextUpcomingEvent = upcomingDatesList[0] || null;

  const handleGpsClick = async () => {
    setGpsStatus('detecting');
    try {
      const result = await onDetectGPS();
      setGpsStatus(result && result.ok === false ? 'err' : 'ok');
    } catch {
      setGpsStatus('err');
    }
    window.setTimeout(() => setGpsStatus('idle'), 2600);
  };

  // Monthly timetable rows for selected viewMonth / viewYear
  const monthDays = useMemo(() => {
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const [todayYStr, todayMStr, todayDStr] = cityDayKey.split('-');
    const todayY = Number(todayYStr);
    const todayM = Number(todayMStr);
    const todayD = Number(todayDStr);

    return Array.from({ length: daysInMonth }, (_, idx) => {
      const dayNum = idx + 1;
      const d = new Date(viewYear, viewMonth, dayNum, 12, 0, 0);
      const hp = getHijriParts(d);
      const times = calculatePrayerTimes(
        d,
        currentCity.latitude,
        currentCity.longitude,
        calcMethod,
        asrMethod,
        currentCity.timezone
      );
      return {
        dayNum,
        isFriday: d.getDay() === 5,
        hijriDay: hp.day,
        hijriMonthName: hijriMonths[Math.max(0, Math.min(11, hp.month - 1))],
        hijriYear: hp.year,
        isToday: viewYear === todayY && viewMonth === todayM && dayNum === todayD,
        times,
      };
    });
  }, [viewYear, viewMonth, currentCity, calcMethod, asrMethod, cityDayKey, hijriMonths]);

  const monthHijriSpan = useMemo(() => {
    if (monthDays.length === 0) return '';
    const first = monthDays[0];
    const last = monthDays[monthDays.length - 1];
    if (first.hijriMonthName === last.hijriMonthName) {
      return `${first.hijriMonthName}, ${first.hijriYear}`;
    }
    return `${first.hijriMonthName} – ${last.hijriMonthName}, ${last.hijriYear}`;
  }, [monthDays]);

  const shiftMonth = (delta: number) => {
    const d = new Date(viewYear, viewMonth + delta, 1);
    setViewMonth(d.getMonth());
    setViewYear(d.getFullYear());
    setSelectedMonthlyDay(1);
  };

  const isViewingCurrentMonth =
    viewMonth === cityNow.getMonth() && viewYear === cityNow.getFullYear();

  const handleShareMonthly = async () => {
    const lines = [
      `🕌 ${loc.city} — ${gregMonths[viewMonth]} ${viewYear} (${monthHijriSpan})`,
      '',
      `${t.prayerTab.dayCol} | ${t.prayers.fajr} | ${t.prayers.sunrise} | ${t.prayers.dhuhr} | ${t.prayers.asr} | ${t.prayers.maghrib} | ${t.prayers.isha}`,
      ...monthDays.map(
        (r) =>
          `${String(r.dayNum).padStart(2, '0')} (${r.hijriDay}) | ${r.times.fajr} | ${r.times.sunrise} | ${r.times.dhuhr} | ${r.times.asr} | ${r.times.maghrib} | ${r.times.isha}`
      ),
    ];
    const text = lines.join('\n');
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${loc.city} — ${gregMonths[viewMonth]} ${viewYear}`,
          text,
        });
        return;
      }
    } catch {
      // Fall back to clipboard
    }
    try {
      await navigator.clipboard.writeText(text);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 2000);
    } catch {
      // Clipboard blocked
    }
  };

  // Converter computed results
  const convertedGregDateObj = useMemo(() => {
    const safeYear = Math.max(1900, Math.min(2200, Number(gYear) || 2026));
    const safeMonth = Math.max(1, Math.min(12, Number(gMonth) || 1));
    const maxDay = new Date(safeYear, safeMonth, 0).getDate();
    const safeDay = Math.max(1, Math.min(maxDay, Number(gDay) || 1));
    return new Date(safeYear, safeMonth - 1, safeDay, 12, 0, 0);
  }, [gDay, gMonth, gYear]);

  const g2hResult = useMemo(
    () => getHijriDate(convertedGregDateObj, language, false),
    [convertedGregDateObj, language]
  );

  const h2gResultDate = useMemo(() => {
    const safeYear = Math.max(1300, Math.min(1600, Number(hYear) || 1448));
    return hijriToGregorian(safeYear, hMonth, hDay);
  }, [hDay, hMonth, hYear]);

  const selectedEventRichDetail = selectedSpecialEvent
    ? getSpecialEventDetail(selectedSpecialEvent.id, language)
    : null;

  return (
    <div className={`space-y-3.5 pb-8 ${isDay ? 'text-slate-900' : 'text-slate-100'}`}>
      {/* Top 3 Side Buttons: Muhim kunlar (Default) | Oylik namoz | Konvertor */}
      <div
        className={`grid grid-cols-3 gap-1.5 p-1 rounded-2xl border ${
          isDay ? 'bg-white border-[#dde3ea]' : 'bg-slate-900 border-emerald-900/60'
        }`}
      >
        <button
          type="button"
          onClick={() => setViewMode('special')}
          className={`py-2 px-1.5 rounded-xl text-[11.5px] font-bold truncate transition ${
            viewMode === 'special'
              ? isDay
                ? 'bg-[#158509] text-white shadow-xs nq-keep-dark'
                : 'bg-amber-400 text-slate-950 shadow-xs'
              : isDay
              ? 'text-slate-600 hover:text-slate-900'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {rich.topTabSpecialDays}
        </button>

        <button
          type="button"
          onClick={() => setViewMode('monthly')}
          className={`py-2 px-1.5 rounded-xl text-[11.5px] font-bold truncate transition ${
            viewMode === 'monthly'
              ? isDay
                ? 'bg-[#158509] text-white shadow-xs nq-keep-dark'
                : 'bg-amber-400 text-slate-950 shadow-xs'
              : isDay
              ? 'text-slate-600 hover:text-slate-900'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {rich.topTabMonthly}
        </button>

        <button
          type="button"
          onClick={() => setViewMode('converter')}
          className={`py-2 px-1.5 rounded-xl text-[11.5px] font-bold truncate transition ${
            viewMode === 'converter'
              ? isDay
                ? 'bg-[#158509] text-white shadow-xs nq-keep-dark'
                : 'bg-amber-400 text-slate-950 shadow-xs'
              : isDay
              ? 'text-slate-600 hover:text-slate-900'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {rich.topTabConverter}
        </button>
      </div>

      {/* VIEW 1 (DEFAULT): MUHIM KUNLAR — UPCOMING SPECIAL DATE HERO + CHRONOLOGICAL UPCOMING LIST (NO CALENDAR) */}
      {viewMode === 'special' && (
        <div className="space-y-3.5">
          {/* Next Upcoming Special Date Spotlight Card */}
          {nextUpcomingEvent && (
            <button
              type="button"
              onClick={() => setSelectedSpecialEvent(nextUpcomingEvent)}
              className={`nq-keep-dark w-full text-left relative overflow-hidden rounded-3xl border p-4 shadow-lg transition active:scale-[0.99] text-white ${
                isDay
                  ? 'bg-gradient-to-br from-[#0b4707] via-[#136c13] to-[#237a2d] border-[#0c4703]'
                  : 'bg-gradient-to-br from-emerald-950 via-[#0a2b20] to-slate-950 border-emerald-700/60'
              }`}
            >
              <div className="pointer-events-none absolute -top-10 -right-10 w-36 h-36 rounded-full bg-amber-300/15 blur-2xl" />

              <div className="relative flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/25 border border-white/15 text-[#d0f39f] text-[10px] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
                    <span className="truncate">{rich.upcomingBadge}</span>
                  </div>

                  <h3 className="text-lg font-extrabold leading-snug text-white truncate">
                    {nextUpcomingEvent.title}
                  </h3>

                  <p className="text-xs font-semibold text-amber-200 truncate">
                    {nextUpcomingEvent.hijriLabel} · {formatGregorianDate(nextUpcomingEvent.gregorianDate, language)},{' '}
                    {nextUpcomingEvent.gregorianDate.getFullYear()}
                  </p>

                  <p className="text-[11px] text-white/80 line-clamp-2 leading-relaxed">
                    {nextUpcomingEvent.description}
                  </p>
                </div>

                {/* Bold Countdown Badge */}
                <div className="shrink-0 w-20 h-20 rounded-2xl bg-black/25 border border-amber-300/35 flex flex-col items-center justify-center text-center shadow-inner">
                  {nextUpcomingEvent.diffDays === 0 ? (
                    <>
                      <Star className="w-5 h-5 text-amber-300 fill-amber-300 mb-0.5" />
                      <span className="text-[11px] font-black text-[#d0f39f] uppercase leading-tight">
                        {t.prayerTab.todayWord}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl font-black font-mono text-amber-300 leading-none tabular-nums">
                        {nextUpcomingEvent.diffDays}
                      </span>
                      <span className="text-[10px] font-bold text-[#d0f39f] mt-1 leading-tight px-1">
                        {rich.daysLeftWord}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </button>
          )}

          {/* Chronological Upcoming Special Dates List (matching first upcoming day cleanly) */}
          <div
            className={`rounded-3xl border overflow-hidden ${
              isDay ? 'bg-white border-[#dde3ea] shadow-sm' : 'bg-slate-900 border-emerald-900/60 shadow-lg'
            }`}
          >
            <div
              className={`px-4 py-3 border-b flex items-center justify-between gap-2 ${
                isDay ? 'bg-[#f7faf6] border-[#e5ebe3]' : 'bg-slate-950/60 border-emerald-900/50'
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <Calendar className={`w-4 h-4 shrink-0 ${isDay ? 'text-[#158509]' : 'text-amber-300'}`} />
                <h3 className={`text-xs font-extrabold uppercase tracking-wider truncate ${isDay ? 'text-[#0c4703]' : 'text-amber-300'}`}>
                  {rich.upcomingListTitle}
                </h3>
              </div>
              <span className={`text-[10px] font-medium shrink-0 ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                {rich.tapForDayInfoHint}
              </span>
            </div>

            <div className={isDay ? 'divide-y divide-slate-100' : 'divide-y divide-slate-800/60'}>
              {upcomingDatesList.map((ev, idx) => {
                const gregFull = `${formatGregorianDate(ev.gregorianDate, language)}, ${ev.gregorianDate.getFullYear()}`;
                const isSoon = ev.diffDays <= 45;
                const isFirstUpcoming = idx === 0;

                return (
                  <button
                    key={`${ev.id}-${ev.hYear}`}
                    type="button"
                    onClick={() => setSelectedSpecialEvent(ev)}
                    className={`w-full text-left p-3.5 transition-colors flex items-start justify-between gap-3 ${
                      isFirstUpcoming
                        ? isDay
                          ? 'bg-[#f4fbf1] hover:bg-[#eef9ea]'
                          : 'bg-emerald-950/35 hover:bg-emerald-950/55'
                        : isDay
                        ? 'hover:bg-[#f6faf4] active:bg-[#eef9ea]'
                        : 'hover:bg-slate-800/40 active:bg-emerald-950/50'
                    }`}
                  >
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <p className={`text-sm font-bold truncate ${isDay ? 'text-slate-900' : 'text-white'}`}>
                        {ev.title}
                      </p>
                      <p className={`text-[11px] font-semibold truncate ${isDay ? 'text-[#0c4703]' : 'text-emerald-300'}`}>
                        {ev.hijriLabel} · <span className="font-mono font-medium opacity-80">{gregFull}</span>
                      </p>
                      <p className={`text-[11px] line-clamp-1 ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                        {ev.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                      <span
                        className={`px-2.5 py-1 rounded-xl text-[10.5px] font-bold whitespace-nowrap border font-mono tabular-nums ${
                          ev.diffDays === 0
                            ? isDay
                              ? 'bg-[#158509] text-white border-[#0c4703] nq-keep-dark'
                              : 'bg-amber-400 text-slate-950 border-amber-300'
                            : isSoon
                            ? isDay
                              ? 'bg-[#eef9ea] text-[#0c4703] border-[#c5e8bc]'
                              : 'bg-emerald-950 text-amber-300 border-amber-500/40'
                            : isDay
                            ? 'bg-slate-100 text-slate-700 border-slate-200'
                            : 'bg-slate-950 text-emerald-300 border-emerald-900/60'
                        }`}
                      >
                        {ev.diffDays === 0
                          ? t.prayerTab.todayWord
                          : `${ev.diffDays} ${t.prayerTab.daysLeft}`}
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 ${isDay ? 'text-slate-400' : 'text-slate-500'}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: MODERN PROFESSIONAL MONTHLY PRAYER TIMETABLE */}
      {viewMode === 'monthly' && (
        <div className="space-y-3">
          {/* City & GPS Bar */}
          <div
            className={`flex items-center justify-between gap-2 p-3 rounded-2xl border ${
              isDay ? 'bg-white border-[#dde3ea] shadow-xs' : 'bg-slate-900/90 border-emerald-900/50 shadow-sm'
            }`}
          >
            <button type="button" onClick={onOpenCitySelector} className="flex items-center gap-2.5 text-left group min-w-0">
              <div
                className={`p-2 rounded-xl shrink-0 transition group-hover:scale-105 ${
                  isDay ? 'bg-[#eef9ea] text-[#158509]' : 'bg-emerald-900/60 text-amber-400'
                }`}
              >
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className={`text-[10.5px] truncate ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                  {t.profile.locationTitle}
                </p>
                <p className={`text-sm font-bold truncate ${isDay ? 'text-slate-900' : 'text-white'}`}>
                  {loc.city}, {loc.country}
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={handleGpsClick}
              disabled={gpsStatus === 'detecting'}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 shrink-0 transition ${
                gpsStatus === 'ok'
                  ? isDay
                    ? 'bg-[#158509] border-[#0c4703] text-white nq-keep-dark'
                    : 'bg-emerald-600 border-emerald-500 text-white'
                  : gpsStatus === 'err'
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-500'
                  : isDay
                  ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703] hover:bg-[#e1f5db]'
                  : 'bg-emerald-950 border-emerald-800/80 text-emerald-300 hover:text-white'
              }`}
            >
              {gpsStatus === 'ok' ? <Check className="w-3.5 h-3.5" /> : <Navigation className="w-3.5 h-3.5" />}
              <span>
                {gpsStatus === 'detecting'
                  ? t.profile.gpsDetecting
                  : gpsStatus === 'ok'
                  ? t.profile.gpsSuccess
                  : gpsStatus === 'err'
                  ? t.profile.gpsError
                  : t.prayerTab.autoGps}
              </span>
            </button>
          </div>

          {/* Editorial Timetable Card */}
          <div
            className={`rounded-3xl border overflow-hidden ${
              isDay ? 'bg-white border-[#dde3ea] shadow-sm' : 'bg-slate-900 border-emerald-900/60 shadow-lg'
            }`}
          >
            {/* Header Toolbar */}
            <div
              className={`p-3.5 border-b space-y-2.5 ${
                isDay ? 'bg-[#f7faf6] border-[#e5ebe3]' : 'bg-slate-950/60 border-emerald-900/50'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => shiftMonth(-1)}
                  className={`p-2 rounded-xl border transition active:scale-95 ${
                    isDay ? 'bg-white border-[#dde3ea] text-slate-700' : 'bg-slate-900 border-emerald-900 text-slate-300'
                  }`}
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="text-center min-w-0">
                  <p className={`text-sm font-extrabold truncate ${isDay ? 'text-slate-900' : 'text-white'}`}>
                    {gregMonths[viewMonth]} {viewYear}
                  </p>
                  <p className={`text-[11px] font-semibold truncate ${isDay ? 'text-[#158509]' : 'text-amber-300'}`}>
                    {monthHijriSpan}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => shiftMonth(1)}
                  className={`p-2 rounded-xl border transition active:scale-95 ${
                    isDay ? 'bg-white border-[#dde3ea] text-slate-700' : 'bg-slate-900 border-emerald-900 text-slate-300'
                  }`}
                  aria-label="Next month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className={`text-[10.5px] font-medium truncate ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                  {rich.monthlySubtitleHint}
                </span>

                <div className="flex items-center gap-1.5 shrink-0">
                  {!isViewingCurrentMonth && (
                    <button
                      type="button"
                      onClick={() => {
                        setViewMonth(cityNow.getMonth());
                        setViewYear(cityNow.getFullYear());
                        setSelectedMonthlyDay(cityNow.getDate());
                      }}
                      className={`px-2.5 py-1 rounded-xl text-[10.5px] font-bold border transition ${
                        isDay
                          ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                          : 'bg-emerald-950 border-emerald-700 text-amber-300'
                      }`}
                    >
                      {rich.jumpToday}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleShareMonthly}
                    className={`px-2.5 py-1 rounded-xl text-[10.5px] font-bold border flex items-center gap-1 transition ${
                      shareCopied
                        ? isDay
                          ? 'bg-[#158509] border-[#0c4703] text-white nq-keep-dark'
                          : 'bg-emerald-600 border-emerald-500 text-white'
                        : isDay
                        ? 'bg-white border-[#dde3ea] text-slate-700 hover:bg-[#eef9ea]'
                        : 'bg-slate-900 border-emerald-800 text-emerald-300'
                    }`}
                  >
                    {shareCopied ? <Check className="w-3 h-3" /> : <Share2 className="w-3 h-3" />}
                    <span>{shareCopied ? rich.copiedToast : rich.shareSchedule}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Clean Modern Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr
                    className={`text-[9.5px] uppercase tracking-wider font-bold border-b ${
                      isDay
                        ? 'bg-[#f1f6ef] border-[#dfe8dc] text-[#0c4703]/80'
                        : 'bg-emerald-950/50 border-emerald-900/70 text-emerald-300/80'
                    }`}
                  >
                    <th className={`py-2.5 pl-3 pr-1.5 sticky left-0 z-10 ${isDay ? 'bg-[#f1f6ef]' : 'bg-[#092119]'}`}>
                      {t.prayerTab.dayCol}
                    </th>
                    <th className="py-2.5 px-1 text-center">{t.prayers.fajr}</th>
                    <th className="py-2.5 px-1 text-center opacity-75">{t.prayers.sunrise}</th>
                    <th className="py-2.5 px-1 text-center">{t.prayers.dhuhr}</th>
                    <th className="py-2.5 px-1 text-center">{t.prayers.asr}</th>
                    <th className="py-2.5 px-1 text-center">{t.prayers.maghrib}</th>
                    <th className="py-2.5 pl-1 pr-2.5 text-center">{t.prayers.isha}</th>
                  </tr>
                </thead>
                <tbody className={isDay ? 'divide-y divide-slate-100' : 'divide-y divide-slate-800/60'}>
                  {monthDays.map((row) => {
                    const isSelectedRow = selectedMonthlyDay === row.dayNum;
                    const rowBg = row.isToday
                      ? isDay
                        ? 'bg-[#e6f6e0] text-[#0c4703] font-bold'
                        : 'bg-emerald-950/75 text-amber-300 font-bold'
                      : isSelectedRow
                      ? isDay
                        ? 'bg-slate-50 text-slate-900 font-semibold'
                        : 'bg-slate-800/50 text-white font-semibold'
                      : row.isFriday
                      ? isDay
                        ? 'bg-[#fafdf9] text-slate-800'
                        : 'bg-emerald-950/20 text-slate-200'
                      : isDay
                      ? 'bg-white text-slate-700'
                      : 'bg-slate-900 text-slate-300';

                    const stickyBg = row.isToday
                      ? isDay
                        ? 'bg-[#e6f6e0]'
                        : 'bg-[#072a1f]'
                      : isSelectedRow
                      ? isDay
                        ? 'bg-slate-50'
                        : 'bg-[#1a2434]'
                      : row.isFriday
                      ? isDay
                        ? 'bg-[#fafdf9]'
                        : 'bg-[#0b1f1a]'
                      : isDay
                      ? 'bg-white'
                      : 'bg-slate-900';

                    return (
                      <tr
                        key={row.dayNum}
                        onClick={() => setSelectedMonthlyDay(row.dayNum)}
                        className={`text-[11px] cursor-pointer transition-colors ${rowBg}`}
                      >
                        <td className={`py-2.5 pl-3 pr-1.5 whitespace-nowrap sticky left-0 z-10 ${stickyBg}`}>
                          <div className="flex items-center gap-1">
                            <span
                              className={`w-1 h-4 rounded-full shrink-0 ${
                                row.isToday
                                  ? 'bg-[#158509] dark:bg-amber-400'
                                  : row.isFriday
                                  ? 'bg-emerald-400/70'
                                  : 'bg-transparent'
                              }`}
                            />
                            <span className="font-mono font-bold tabular-nums w-4 text-right">{row.dayNum}</span>
                            <span
                              className={`text-[9px] font-mono tabular-nums px-1 py-0.5 rounded-md ${
                                row.isToday
                                  ? isDay
                                    ? 'bg-[#158509] text-white'
                                    : 'bg-amber-400 text-slate-950'
                                  : isDay
                                  ? 'bg-slate-100 text-slate-500'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {row.hijriDay}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-1 text-center font-mono tabular-nums">{row.times.fajr}</td>
                        <td className="py-2.5 px-1 text-center font-mono tabular-nums opacity-65">{row.times.sunrise}</td>
                        <td className="py-2.5 px-1 text-center font-mono tabular-nums">{row.times.dhuhr}</td>
                        <td className="py-2.5 px-1 text-center font-mono tabular-nums">{row.times.asr}</td>
                        <td className="py-2.5 px-1 text-center font-mono tabular-nums">{row.times.maghrib}</td>
                        <td className="py-2.5 pl-1 pr-2.5 text-center font-mono tabular-nums">{row.times.isha}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: DEDICATED HIJRIY-MILODIY KONVERTOR */}
      {viewMode === 'converter' && (
        <div
          className={`rounded-3xl border p-4 space-y-3.5 ${
            isDay ? 'bg-white border-[#dde3ea] shadow-sm' : 'bg-slate-900 border-emerald-900/60 shadow-lg'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <h3 className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${isDay ? 'text-[#0c4703]' : 'text-amber-300'}`}>
              <ArrowLeftRight className="w-4 h-4" />
              <span>{t.prayerTab.converterTitle}</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl border border-inherit bg-black/5 dark:bg-slate-950">
            <button
              type="button"
              onClick={() => setConvDir('g2h')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition ${
                convDir === 'g2h'
                  ? isDay
                    ? 'bg-[#158509] text-white nq-keep-dark'
                    : 'bg-amber-400 text-slate-950'
                  : isDay
                  ? 'text-slate-600'
                  : 'text-slate-400'
              }`}
            >
              {t.prayerTab.gregToHijri}
            </button>
            <button
              type="button"
              onClick={() => setConvDir('h2g')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition ${
                convDir === 'h2g'
                  ? isDay
                    ? 'bg-[#158509] text-white nq-keep-dark'
                    : 'bg-amber-400 text-slate-950'
                  : isDay
                  ? 'text-slate-600'
                  : 'text-slate-400'
              }`}
            >
              {t.prayerTab.hijriToGreg}
            </button>
          </div>

          {convDir === 'g2h' ? (
            <div className="space-y-3.5">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className={`text-[10.5px] font-semibold block mb-1 ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                    {t.prayerTab.dayLabel}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={gDay}
                    onChange={(e) => setGDay(Number(e.target.value))}
                    className={`w-full rounded-xl border p-2.5 text-xs font-mono font-bold ${
                      isDay ? 'bg-[#ecf1f5] border-[#dde3ea] text-slate-900' : 'bg-slate-950 border-emerald-800 text-white'
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-[10.5px] font-semibold block mb-1 ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                    {t.prayerTab.monthNameLabel}
                  </label>
                  <select
                    value={gMonth}
                    onChange={(e) => setGMonth(Number(e.target.value))}
                    className={`w-full rounded-xl border p-2.5 text-xs font-semibold ${
                      isDay ? 'bg-[#ecf1f5] border-[#dde3ea] text-slate-900' : 'bg-slate-950 border-emerald-800 text-white'
                    }`}
                  >
                    {gregMonths.map((name, idx) => (
                      <option key={idx} value={idx + 1}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`text-[10.5px] font-semibold block mb-1 ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                    {t.prayerTab.yearLabel}
                  </label>
                  <input
                    type="number"
                    min={1900}
                    max={2150}
                    value={gYear}
                    onChange={(e) => setGYear(Number(e.target.value))}
                    className={`w-full rounded-xl border p-2.5 text-xs font-mono font-bold ${
                      isDay ? 'bg-[#ecf1f5] border-[#dde3ea] text-slate-900' : 'bg-slate-950 border-emerald-800 text-white'
                    }`}
                  />
                </div>
              </div>

              <div
                className={`p-4 rounded-2xl border text-center space-y-1 ${
                  isDay ? 'bg-[#eef9ea] border-[#c5e8bc]' : 'bg-emerald-950/70 border-emerald-700/60'
                }`}
              >
                <p className={`text-lg font-extrabold ${isDay ? 'text-[#0c4703]' : 'text-amber-300'}`}>
                  {g2hResult}
                </p>
                <p className={`text-xs font-medium ${isDay ? 'text-slate-600' : 'text-slate-300'}`}>
                  {formatGregorianDate(convertedGregDateObj, language)}, {convertedGregDateObj.getFullYear()}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className={`text-[10.5px] font-semibold block mb-1 ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                    {t.prayerTab.dayLabel}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={hDay}
                    onChange={(e) => setHDay(Number(e.target.value))}
                    className={`w-full rounded-xl border p-2.5 text-xs font-mono font-bold ${
                      isDay ? 'bg-[#ecf1f5] border-[#dde3ea] text-slate-900' : 'bg-slate-950 border-emerald-800 text-white'
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-[10.5px] font-semibold block mb-1 ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                    {t.prayerTab.monthNameLabel}
                  </label>
                  <select
                    value={hMonth}
                    onChange={(e) => setHMonth(Number(e.target.value))}
                    className={`w-full rounded-xl border p-2.5 text-xs font-semibold ${
                      isDay ? 'bg-[#ecf1f5] border-[#dde3ea] text-slate-900' : 'bg-slate-950 border-emerald-800 text-white'
                    }`}
                  >
                    {hijriMonths.map((name, idx) => (
                      <option key={idx} value={idx + 1}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`text-[10.5px] font-semibold block mb-1 ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                    {t.prayerTab.yearLabel}
                  </label>
                  <input
                    type="number"
                    min={1350}
                    max={1550}
                    value={hYear}
                    onChange={(e) => setHYear(Number(e.target.value))}
                    className={`w-full rounded-xl border p-2.5 text-xs font-mono font-bold ${
                      isDay ? 'bg-[#ecf1f5] border-[#dde3ea] text-slate-900' : 'bg-slate-950 border-emerald-800 text-white'
                    }`}
                  />
                </div>
              </div>

              <div
                className={`p-4 rounded-2xl border text-center space-y-1 ${
                  isDay ? 'bg-[#eef9ea] border-[#c5e8bc]' : 'bg-emerald-950/70 border-emerald-700/60'
                }`}
              >
                <p className={`text-lg font-extrabold ${isDay ? 'text-[#0c4703]' : 'text-amber-300'}`}>
                  {formatGregorianDate(h2gResultDate, language)} {h2gResultDate.getFullYear()}
                </p>
                <p className={`text-xs font-medium ${isDay ? 'text-slate-600' : 'text-slate-300'}`}>
                  {hDay} {hijriMonths[Math.max(0, Math.min(11, hMonth - 1))]}, {hYear}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Compact Centered Small-Screen Detail Modal when a Special Date is tapped */}
      {selectedSpecialEvent && selectedEventRichDetail && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedSpecialEvent(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-sm rounded-3xl border p-4 space-y-3.5 shadow-2xl max-h-[82vh] overflow-y-auto ${
              isDay ? 'bg-white border-[#dde3ea] text-slate-900' : 'bg-slate-900 border-emerald-800 text-slate-100'
            }`}
          >
            <div className="flex items-start justify-between gap-2.5">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Sparkles className={`w-3.5 h-3.5 shrink-0 ${isDay ? 'text-[#158509]' : 'text-amber-300'}`} />
                  <span className={`text-[10.5px] font-bold uppercase tracking-wider ${isDay ? 'text-[#158509]' : 'text-amber-300'}`}>
                    {selectedSpecialEvent.hijriLabel}
                  </span>
                </div>
                <h4 className="text-lg font-extrabold leading-snug mt-0.5">
                  {selectedSpecialEvent.title}
                </h4>
                <p className={`text-xs mt-0.5 ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                  {formatGregorianDate(selectedSpecialEvent.gregorianDate, language)},{' '}
                  {selectedSpecialEvent.gregorianDate.getFullYear()} ·{' '}
                  <span className={`font-mono font-semibold ${isDay ? 'text-[#158509]' : 'text-amber-300'}`}>
                    {selectedSpecialEvent.diffDays === 0
                      ? t.prayerTab.todayWord
                      : `${selectedSpecialEvent.diffDays} ${rich.daysLeftWord}`}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSpecialEvent(null)}
                className={`p-2 rounded-xl border shrink-0 ${
                  isDay ? 'bg-[#ecf1f5] border-[#dde3ea] text-slate-600' : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Why/When Special */}
            {selectedEventRichDetail.whySpecial && (
              <div className="space-y-1">
                <p className={`text-[11px] font-bold uppercase tracking-wider ${isDay ? 'text-[#0c4703]' : 'text-amber-300'}`}>
                  {rich.detailWhyTitle}
                </p>
                <p className={`text-xs leading-relaxed ${isDay ? 'text-slate-700' : 'text-slate-300'}`}>
                  {selectedEventRichDetail.whySpecial}
                </p>
              </div>
            )}

            {/* What is Done / Recommended Worship */}
            {selectedEventRichDetail.whatToDo.length > 0 && (
              <div className="space-y-1.5">
                <p className={`text-[11px] font-bold uppercase tracking-wider ${isDay ? 'text-[#0c4703]' : 'text-amber-300'}`}>
                  {rich.detailDoTitle}
                </p>
                <ul className="space-y-1.5">
                  {selectedEventRichDetail.whatToDo.map((act, i) => (
                    <li
                      key={i}
                      className={`p-2.5 rounded-xl border text-xs flex items-start gap-2 ${
                        isDay ? 'bg-[#f8fafc] border-[#dde3ea] text-slate-700' : 'bg-slate-950/70 border-emerald-900/50 text-slate-200'
                      }`}
                    >
                      <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isDay ? 'text-[#158509]' : 'text-amber-300'}`} />
                      <span className="leading-snug">{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
