import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Moon, 
  Sun, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Volume2, 
  Copy, 
  Check, 
  Flame, 
  Award, 
  Heart, 
  ChevronRight, 
  ChevronLeft,
  Info, 
  MapPin, 
  Utensils, 
  ShieldCheck,
  AlertCircle,
  RotateCcw,
  BookOpen,
  X
} from 'lucide-react';
import { RamadanLanternIcon } from '../icons/IslamicFeatureIcons';
import { Coordinates, PrayerTimes, TranslationId } from '../../types';
import { RAMADAN_CORE_DUAS, RAMADAN_30_DAYS_DUAS, RAMADAN_SUNNAH_TIPS, RamadanDua, DayDua } from '../../data/ramadan';
import { RAMADAN_PREP_DATA, CORE_DUA_RU_OVERRIDES } from '../../data/ramadanPrepData';
import { soundFx } from '../../utils/audio';
import {
  getLocalizedCityLabel,
  getCityCurrentDate,
  getHijriParts,
  getHijriMonthsList,
  hijriToGregorian
} from '../../utils/prayerTimes';
import { LiveRamadanHero, useMinuteDate } from '../LivePrayerClock';
import { latinToCyrillicUz } from '../../utils/uzbekScript';
import { useLanguage, formatGregorianDate } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

interface RamadanTabProps {
  currentCity: Coordinates;
  prayerTimes: PrayerTimes;
  selectedTranslation: TranslationId;
  onOpenCitySelector: () => void;
}

export type FastStatus = 'completed' | 'missed' | 'excused' | 'pending';

export const RamadanTab: React.FC<RamadanTabProps> = ({
  currentCity,
  prayerTimes,
  selectedTranslation,
  onOpenCitySelector
}) => {
  const { isDay } = useTheme();
  const { language, t } = useLanguage();
  const prep = RAMADAN_PREP_DATA[language] || RAMADAN_PREP_DATA.en;
  const nowMinute = useMinuteDate();
  const [prepModal, setPrepModal] = useState<'duas' | 'rules' | null>(null);

  useEffect(() => {
    const onBack = (e: Event) => {
      if (prepModal) {
        e.preventDefault();
        setPrepModal(null);
      }
    };
    window.addEventListener('nq:android-back', onBack);
    return () => window.removeEventListener('nq:android-back', onBack);
  }, [prepModal]);

  const isUzbekTrans =
    language === 'uz_lat' ||
    language === 'uz_cyr' ||
    selectedTranslation === 'uz_mansur' ||
    selectedTranslation === 'uz_cyr';
  const formatTrans = (uzText: string, enText: string) => {
    if (language === 'uz_cyr' || (language !== 'en' && selectedTranslation === 'uz_cyr')) {
      return latinToCyrillicUz(uzText);
    }
    if (language === 'uz_lat' || selectedTranslation === 'uz_mansur') return uzText;
    return enText;
  };
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeDuaSection, setActiveDuaSection] = useState<'core' | 'ashras' | '30days' | 'tips'>('core');
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [activeAshra, setActiveAshra] = useState<1 | 2 | 3>(1);

  // Fasting tracker state saved in localStorage
  const [fastingDays, setFastingDays] = useState<Record<number, FastStatus>>(() => {
    try {
      const saved = localStorage.getItem('nq_ramadan_fasts');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Default initial mock progress: days 1-12 completed, 13 current
    const initial: Record<number, FastStatus> = {};
    for (let i = 1; i <= 30; i++) {
      if (i <= 10) initial[i] = 'completed';
      else if (i === 11) initial[i] = 'completed';
      else initial[i] = 'pending';
    }
    return initial;
  });

  // Save fasting tracker changes
  useEffect(() => {
    try {
      localStorage.setItem('nq_ramadan_fasts', JSON.stringify(fastingDays));
    } catch {
      // ignore
    }
  }, [fastingDays]);

  const [imsakH, imsakM] = prayerTimes.imsak.split(':').map(Number);
  void imsakH;
  void imsakM;

  // Fasting statistics
  const completedCount = Object.values(fastingDays).filter(s => s === 'completed').length;
  const missedCount = Object.values(fastingDays).filter(s => s === 'missed').length;
  const excusedCount = Object.values(fastingDays).filter(s => s === 'excused').length;
  const daysRemaining = 30 - completedCount;

  // Toggle day status
  const toggleDayStatus = (dayNum: number) => {
    soundFx.playClick();
    if (navigator.vibrate) navigator.vibrate(25);

    setFastingDays(prev => {
      const current = prev[dayNum] || 'pending';
      let next: FastStatus = 'completed';
      if (current === 'pending') next = 'completed';
      else if (current === 'completed') next = 'missed';
      else if (current === 'missed') next = 'excused';
      else next = 'pending';

      const updated = { ...prev, [dayNum]: next };

      // Milestone trigger: If day 10, 20 or 30 completed
      if (next === 'completed' && (dayNum === 10 || dayNum === 20 || dayNum === 30)) {
        soundFx.playCompletionChime();
        try {
          confetti({
            particleCount: 70,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#f59e0b', '#10b981', '#fbbf24', '#34d399']
          });
        } catch {
          // fallback
        }
      }

      return updated;
    });
  };

  const handleCopyDua = (title: string, arabic: string, transliteration: string, translation: string, id: string) => {
    const text = `${title}\n\n${arabic}\n\n${transliteration}\n\n"${translation}"`;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const selectedDayDua = RAMADAN_30_DAYS_DUAS.find(d => d.day === selectedDayNumber) || RAMADAN_30_DAYS_DUAS[0];

  // Check city's current Hijri month: when NOT Ramadan (month !== 9), render Pre-Ramadan Preparation View
  const cityNow = getCityCurrentDate(nowMinute, currentCity.timezone);
  const cityHijri = getHijriParts(cityNow);
  const isRamadanNow = cityHijri.month === 9;

  if (!isRamadanNow) {
    const cityMidnightMs = new Date(cityNow.getFullYear(), cityNow.getMonth(), cityNow.getDate(), 12, 0, 0).getTime();
    const targetRamadanYear = cityHijri.month < 9 ? cityHijri.year : cityHijri.year + 1;
    const ramadanStartDate = hijriToGregorian(targetRamadanYear, 9, 1);
    const daysUntilRamadan = Math.max(0, Math.round((ramadanStartDate.getTime() - cityMidnightMs) / 86400000));
    const hijriMonthNames = getHijriMonthsList(language);
    const ramadanStartLabel = `1 ${hijriMonthNames[8]}, ${targetRamadanYear} · ${formatGregorianDate(
      ramadanStartDate,
      language
    )}, ${ramadanStartDate.getFullYear()}`;

    const activityIcons = {
      quran: BookOpen,
      fasting: Sun,
      night: Moon,
      character: Heart,
      charity: Sparkles,
    } as const;

    return (
      <div className={`space-y-4 pb-8 ${isDay ? 'text-slate-900' : 'text-slate-100'}`}>
        {/* Hero Countdown + Reaching Ramadan Dua Card (With Glowing Crescent Moon & Illuminated Fanous Lantern) */}
        <div
          className={`nq-keep-dark relative overflow-hidden rounded-3xl border p-5 shadow-xl text-white ${
            isDay
              ? 'bg-gradient-to-br from-[#083805] via-[#126812] to-[#1e7729] border-[#0c4703]'
              : 'bg-gradient-to-br from-emerald-950 via-[#08281c] to-slate-950 border-emerald-700/60'
          }`}
        >
          {/* Ambient radial glow + Bespoke Crescent Moon & Hanging Golden Fanous Lantern SVG */}
          <div className="pointer-events-none absolute -top-10 -right-8 w-52 h-52 rounded-full bg-amber-300/20 blur-3xl" />
          <svg
            viewBox="0 0 170 155"
            className="pointer-events-none absolute -top-1 right-1 w-40 h-36 select-none"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="fanousAura" cx="62%" cy="55%" r="48%">
                <stop offset="0%" stopColor="#fde047" stopOpacity="0.62" />
                <stop offset="48%" stopColor="#f59e0b" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="crescentMist" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef9c3" stopOpacity="0.42" />
                <stop offset="100%" stopColor="#bbf7d0" stopOpacity="0.12" />
              </linearGradient>
              <linearGradient id="lanternMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <linearGradient id="lanternGlass" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="55%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>

            {/* Luminous Crescent Moon Backdrop */}
            <path
              d="M94 22 A46 46 0 1 0 132 104 A36 36 0 1 1 94 22 Z"
              fill="url(#crescentMist)"
            />
            {/* Tiny twilight stars */}
            <circle cx="44" cy="34" r="1.5" fill="#fef08a" opacity="0.65" />
            <circle cx="30" cy="64" r="1.1" fill="#d9f99d" opacity="0.5" />
            <circle cx="148" cy="30" r="1.4" fill="#fef08a" opacity="0.7" />

            {/* Soft Warm Candlelight Aura behind Lantern */}
            <circle cx="108" cy="84" r="46" fill="url(#fanousAura)" />

            {/* Hanging Chain from Top Border */}
            <line x1="108" y1="0" x2="108" y2="30" stroke="url(#lanternMetal)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="108" cy="31" r="3" fill="none" stroke="url(#lanternMetal)" strokeWidth="1.8" />

            {/* Ornate Dome Cap */}
            <path d="M98 44 Q108 32 118 44 Z" fill="url(#lanternMetal)" />
            <rect x="93" y="44" width="30" height="4" rx="2" fill="url(#lanternMetal)" />

            {/* Glowing Glass Body */}
            <path d="M95 48 L121 48 L125 82 L91 82 Z" fill="url(#lanternGlass)" opacity="0.95" />
            {/* Filigree Ribs */}
            <path d="M95 48 L121 48 L125 82 L91 82 Z" fill="none" stroke="#92400e" strokeWidth="1.5" strokeLinejoin="round" />
            <line x1="108" y1="48" x2="108" y2="82" stroke="#92400e" strokeWidth="1.2" opacity="0.75" />
            <path d="M97 65 Q108 55 119 65" fill="none" stroke="#92400e" strokeWidth="1.1" opacity="0.7" />
            {/* Inner bright flame */}
            <ellipse cx="108" cy="67" rx="4.5" ry="7.5" fill="#ffffff" opacity="0.88" />

            {/* Tapering Pedestal Base */}
            <rect x="89" y="82" width="38" height="3.5" rx="1.5" fill="url(#lanternMetal)" />
            <path d="M95 85.5 L121 85.5 L116 95 L100 95 Z" fill="url(#lanternMetal)" />
            <circle cx="108" cy="98" r="2.2" fill="#fde047" />
          </svg>

          <div className="relative z-10 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-2.5 max-w-[68%]">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-5xl font-black font-mono text-white leading-none tabular-nums drop-shadow-xs">
                    {daysUntilRamadan}
                  </span>
                  <span className="text-sm font-extrabold uppercase tracking-wider text-amber-300 leading-tight">
                    {prep.daysLeftLabel}
                  </span>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/28 border border-white/20 text-[#d0f39f] text-[11px] font-semibold backdrop-blur-xs">
                  <Calendar className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span className="truncate">{ramadanStartLabel}</span>
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-center pt-1">
              <p className="font-arabic text-xl sm:text-2xl text-amber-100 leading-relaxed drop-shadow-xs" dir="rtl">
                {prep.reachingDuaArabic}
              </p>
              <p className="text-xs text-white/90 leading-relaxed">
                {prep.reachingDuaMeaning}
              </p>
            </div>

            <div className="flex justify-center pt-0.5">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/28 border border-white/15 text-[11px] font-medium text-[#d0f39f] text-center">
                <Clock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>{prep.autoOpenNotice}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Encouraging Preparation Reminder Card (No Checkboxes) */}
        <div
          className={`rounded-3xl border p-4 space-y-3.5 ${
            isDay ? 'bg-white border-[#dde3ea] shadow-sm' : 'bg-slate-900 border-emerald-900/60 shadow-lg'
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className={`w-4 h-4 shrink-0 ${isDay ? 'text-[#158509]' : 'text-amber-300'}`} />
              <h3 className={`text-base font-extrabold leading-snug ${isDay ? 'text-[#0c4703]' : 'text-white'}`}>
                {prep.prepTitle}
              </h3>
            </div>
            <p className={`text-xs leading-relaxed ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
              {prep.prepSubtitle}
            </p>
          </div>

          <div className="space-y-2.5">
            {prep.activities.map((item) => {
              const IconComp = activityIcons[item.id];
              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-2xl border flex items-start gap-3 ${
                    isDay
                      ? 'bg-[#f7faf6] border-[#e3ece0]'
                      : 'bg-slate-950/75 border-emerald-900/50'
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                      isDay ? 'bg-[#eef9ea] text-[#158509]' : 'bg-emerald-950 text-amber-300'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <h4 className={`text-xs font-bold ${isDay ? 'text-slate-900' : 'text-white'}`}>
                      {item.title}
                    </h4>
                    <p className={`text-[11.5px] leading-relaxed ${isDay ? 'text-slate-600' : 'text-slate-300'}`}>
                      {item.encouragement}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom 2 Quick Knowledge Cards: Duas & Localized Rules Q&A */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setPrepModal('duas')}
            className={`p-3.5 rounded-2xl border text-left transition active:scale-95 flex flex-col justify-between gap-2.5 ${
              isDay
                ? 'bg-white border-[#dde3ea] hover:border-[#158509] shadow-xs'
                : 'bg-slate-900 border-emerald-900/60 hover:border-amber-400/60'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isDay ? 'bg-[#eef9ea] text-[#158509]' : 'bg-emerald-950 text-amber-300'
                }`}
              >
                <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
                  <path
                    d="M15.8 5.2a6 6 0 1 0 5.6 8.2 4.8 4.8 0 1 1-5.6-8.2z"
                    fill="#f59e0b"
                  />
                  <path
                    d="M5 17.5c0-1.1.9-2 2-2h2.2c.6 0 1.2.3 1.6.8l1.6 2a2 2 0 0 1-1.5 3.2H7c-1.1 0-2-.9-2-2v-2zm18 0c0-1.1-.9-2-2-2h-2.2c-.6 0-1.2.3-1.6.8l-1.6 2a2 2 0 0 0 1.5 3.2H21c1.1 0 2-.9 2-2v-2z"
                    fill="currentColor"
                    opacity="0.9"
                  />
                </svg>
              </div>
              <ChevronRight className={`w-4 h-4 ${isDay ? 'text-slate-400' : 'text-slate-500'}`} />
            </div>
            <div>
              <p className={`text-xs font-bold leading-snug ${isDay ? 'text-slate-900' : 'text-white'}`}>
                {prep.duasBtnTitle}
              </p>
              <p className={`text-[10.5px] mt-0.5 ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                {prep.duasBtnSubtitle}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPrepModal('rules')}
            className={`p-3.5 rounded-2xl border text-left transition active:scale-95 flex flex-col justify-between gap-2.5 ${
              isDay
                ? 'bg-white border-[#dde3ea] hover:border-[#158509] shadow-xs'
                : 'bg-slate-900 border-emerald-900/60 hover:border-amber-400/60'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center relative ${
                  isDay ? 'bg-[#eef9ea] text-[#158509]' : 'bg-emerald-950 text-emerald-300'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 px-1 py-0.2 rounded-md bg-amber-400 text-slate-950 text-[8px] font-black">
                  {prep.qaBadge}
                </span>
              </div>
              <ChevronRight className={`w-4 h-4 ${isDay ? 'text-slate-400' : 'text-slate-500'}`} />
            </div>
            <div>
              <p className={`text-xs font-bold leading-snug ${isDay ? 'text-slate-900' : 'text-white'}`}>
                {prep.rulesBtnTitle}
              </p>
              <p className={`text-[10.5px] mt-0.5 ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                {prep.rulesBtnSubtitle}
              </p>
            </div>
          </button>
        </div>

        {/* Centered Compact Modal for Duas or Localized Fasting Q&A */}
        {prepModal && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setPrepModal(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-sm rounded-3xl border p-4 space-y-3 shadow-2xl max-h-[82vh] overflow-y-auto ${
                isDay ? 'bg-white border-[#dde3ea] text-slate-900' : 'bg-slate-900 border-emerald-800 text-slate-100'
              }`}
            >
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-inherit">
                <h4 className={`text-sm font-extrabold ${isDay ? 'text-[#0c4703]' : 'text-amber-300'}`}>
                  {prepModal === 'duas' ? prep.duasModalTitle : prep.rulesModalTitle}
                </h4>
                <button
                  type="button"
                  onClick={() => setPrepModal(null)}
                  className={`p-1.5 rounded-xl border shrink-0 ${
                    isDay ? 'bg-[#ecf1f5] border-[#dde3ea] text-slate-600' : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {prepModal === 'duas' ? (
                <div className="space-y-3">
                  {RAMADAN_CORE_DUAS.map((d) => {
                    const ruOverride = language === 'ru' ? CORE_DUA_RU_OVERRIDES[d.id] : undefined;
                    const titleStr = ruOverride
                      ? ruOverride.title
                      : isUzbekTrans && d.titleUz
                      ? formatTrans(d.titleUz, d.title)
                      : d.title;
                    const transStr = ruOverride
                      ? ruOverride.translation
                      : formatTrans(d.translationUz, d.translationEn);
                    return (
                      <div
                        key={d.id}
                        className={`p-3 rounded-2xl border space-y-2 ${
                          isDay ? 'bg-[#f8fafc] border-[#dde3ea]' : 'bg-slate-950/70 border-emerald-900/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-xs font-bold ${isDay ? 'text-[#0c4703]' : 'text-amber-300'}`}>
                            {titleStr}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleCopyDua(titleStr, d.arabic, d.transliteration, transStr, d.id)}
                            className={`p-1.5 rounded-lg border ${
                              isDay ? 'bg-white border-[#dde3ea] text-slate-500' : 'bg-slate-900 border-slate-800 text-slate-300'
                            }`}
                            aria-label="Copy Dua"
                          >
                            {copiedId === d.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <p className={`font-arabic text-lg text-right leading-loose ${isDay ? 'text-slate-900' : 'text-amber-100'}`} dir="rtl">
                          {d.arabic}
                        </p>
                        <p className={`text-[11px] font-mono ${isDay ? 'text-[#158509]' : 'text-emerald-300'}`}>
                          {d.transliteration}
                        </p>
                        <p className={`text-[11px] italic leading-relaxed ${isDay ? 'text-slate-600' : 'text-slate-300'}`}>
                          "{transStr}"
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {prep.rules.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border space-y-1.5 ${
                        isDay ? 'bg-[#f8fafc] border-[#dde3ea]' : 'bg-slate-950/70 border-emerald-900/50'
                      }`}
                    >
                      <h5 className={`text-xs font-bold ${isDay ? 'text-[#0c4703]' : 'text-amber-300'}`}>
                        {item.question}
                      </h5>
                      <p className={`text-[11.5px] leading-relaxed ${isDay ? 'text-slate-700' : 'text-slate-200'}`}>
                        {item.answer}
                      </p>
                      <div
                        className={`p-2 rounded-xl border text-[11px] leading-snug ${
                          isDay ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]' : 'bg-emerald-950/60 border-emerald-800/50 text-emerald-300'
                        }`}
                      >
                        <span className="font-bold">{prep.practicalTipPrefix} </span>
                        {item.tip}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-8 text-slate-100">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-amber-400">
            <RamadanLanternIcon className="w-4 h-4 text-amber-400" />
            <span>{t.ramadan.holyMonth}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            {t.ramadan.ramadanKareem}
          </h1>
        </div>

        {/* City selector badge */}
        <button
          onClick={onOpenCitySelector}
          className="flex flex-col items-end bg-emerald-950/70 hover:bg-emerald-900/70 border border-emerald-800/50 px-3 py-1.5 rounded-xl transition text-right shadow-sm"
        >
          <div className="flex items-center gap-1 text-emerald-300 text-xs font-medium">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{getLocalizedCityLabel(currentCity.cityName, currentCity.countryName, language, currentCity.region).city}</span>
          </div>
          <span className="text-[10px] text-amber-400 font-semibold">{t.ramadan.suhoorIftarTimes}</span>
        </button>
      </div>

      {/* Hero Card: Live Suhoor & Iftar Tracker with Countdown */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 border border-amber-500/40 p-5 shadow-2xl shadow-emerald-950/70">
        {/* Decorative Crescent Moon Glow */}
        <div className="absolute -right-6 -top-6 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <LiveRamadanHero
            prayerTimes={prayerTimes}
            timezone={currentCity.timezone}
            labels={{
              fastingInProgress: t.ramadan.fastingInProgress,
              eatingWindow: t.ramadan.eatingWindow,
              targetLabel: t.ramadan.targetLabel,
              untilIftar: t.ramadan.untilIftar,
              untilSuhoor: t.ramadan.untilSuhoor,
              elapsedLabel: t.ramadan.elapsedLabel,
              fajrLabel: t.prayers.fajr,
              maghribLabel: t.prayers.maghrib,
              iftarTitle: t.ramadan.iftarTitle,
              imsakLabel: t.prayers.imsak,
            }}
          />

          {/* Quick Suhoor & Iftar Times Pill Row */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-emerald-800/50">
            {/* Suhoor Box */}
            <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1">
                  <Moon className="w-3 h-3 text-emerald-400" />
                  <span>{t.ramadan.suhoorTitle}</span>
                </p>
                <p className="text-lg font-bold font-mono text-white mt-0.5">{prayerTimes.imsak}</p>
                <p className="text-[10px] text-emerald-400">{t.ramadan.suhoorNote}</p>
              </div>
              <span className="font-arabic text-emerald-400 text-lg">سحور</span>
            </div>

            {/* Iftar Box */}
            <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-600/40 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-amber-300 font-semibold uppercase flex items-center gap-1">
                  <Sun className="w-3 h-3 text-amber-400" />
                  <span>{t.ramadan.iftarTitle}</span>
                </p>
                <p className="text-lg font-bold font-mono text-amber-300 mt-0.5">{prayerTimes.maghrib}</p>
                <p className="text-[10px] text-amber-400/90">{t.ramadan.iftarNote}</p>
              </div>
              <span className="font-arabic text-amber-400 text-lg">إفطار</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fasting Progress Tracker Card (30 Days) */}
      <div className="rounded-3xl bg-slate-900/90 border border-emerald-900/60 p-5 space-y-4 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-950">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>{t.ramadan.trackerTitle}</span>
            </h3>
            <p className="text-xs text-slate-400">{t.ramadan.trackerHint}</p>
          </div>

          <span className="text-xs font-mono font-bold text-amber-300 bg-emerald-950 px-2.5 py-1 rounded-xl border border-emerald-800/80 shrink-0">
            {completedCount} / 30 {t.ramadan.fastedBadge}
          </span>
        </div>

        {/* Fasting Stats Bar */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/40">
            <span className="text-[10px] text-slate-400 block">{t.ramadan.fastedStat}</span>
            <span className="text-base font-bold font-mono text-emerald-300">{completedCount}</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-amber-950/50 border border-amber-700/40">
            <span className="text-[10px] text-slate-400 block">{t.ramadan.qadaStat}</span>
            <span className="text-base font-bold font-mono text-amber-300">{missedCount}</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">{t.ramadan.excusedStat}</span>
            <span className="text-base font-bold font-mono text-slate-300">{excusedCount}</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">{t.ramadan.remainingStat}</span>
            <span className="text-base font-bold font-mono text-amber-400">{daysRemaining}</span>
          </div>
        </div>

        {/* 30-Day Interactive Calendar Grid */}
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 30 }).map((_, idx) => {
            const dayNum = idx + 1;
            const status = fastingDays[dayNum] || 'pending';

            let bgClass = 'bg-slate-950 border-slate-800 text-slate-400 hover:border-emerald-700';
            let icon = null;

            if (status === 'completed') {
              bgClass = 'bg-emerald-900/80 border-emerald-500 text-white font-bold shadow-sm';
              icon = <Check className="w-3 h-3 text-amber-300" />;
            } else if (status === 'missed') {
              bgClass = 'bg-amber-900/60 border-amber-500 text-amber-200 font-bold';
              icon = <Clock className="w-3 h-3 text-amber-300" />;
            } else if (status === 'excused') {
              bgClass = 'bg-slate-800 border-slate-700 text-slate-300';
              icon = <ShieldCheck className="w-3 h-3 text-slate-400" />;
            }

            return (
              <button
                key={dayNum}
                onClick={() => toggleDayStatus(dayNum)}
                className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition active:scale-95 text-xs ${bgClass}`}
                title={`Day ${dayNum}: ${status}`}
              >
                <span className="font-mono text-[11px] font-semibold">{dayNum}</span>
                <div className="h-3.5 flex items-center justify-center mt-0.5">
                  {icon || <span className="text-[9px] text-slate-600">•</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 pt-1">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>{t.ramadan.fastedStat}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>{t.ramadan.qadaStat}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
            <span>{t.ramadan.pendingExcusedLegend}</span>
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs for Ramadan Duas */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setActiveDuaSection('core')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
            activeDuaSection === 'core'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'bg-slate-900 text-slate-300 border border-slate-800'
          }`}
        >
          {t.ramadan.secCore}
        </button>

        <button
          onClick={() => setActiveDuaSection('ashras')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
            activeDuaSection === 'ashras'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'bg-slate-900 text-slate-300 border border-slate-800'
          }`}
        >
          {t.ramadan.secAshras}
        </button>

        <button
          onClick={() => setActiveDuaSection('30days')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
            activeDuaSection === '30days'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'bg-slate-900 text-slate-300 border border-slate-800'
          }`}
        >
          {t.ramadan.sec30Days}
        </button>

        <button
          onClick={() => setActiveDuaSection('tips')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
            activeDuaSection === 'tips'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'bg-slate-900 text-slate-300 border border-slate-800'
          }`}
        >
          {t.ramadan.secTips}
        </button>
      </div>

      {/* SECTION 1: CORE SUHOOR & IFTAR DUAS */}
      {activeDuaSection === 'core' && (
        <div className="space-y-3">
          {RAMADAN_CORE_DUAS.map((dua) => {
            const trans = formatTrans(dua.translationUz, dua.translationEn);
            const isCopied = copiedId === dua.id;

            return (
              <div
                key={dua.id}
                className="p-5 rounded-3xl bg-slate-900/80 border border-emerald-900/50 hover:border-amber-500/50 transition space-y-3 shadow-md"
              >
                <div className="flex items-center justify-between pb-2 border-b border-emerald-950 text-xs">
                  <div>
                    <span className="font-bold text-amber-300 block">{dua.title}</span>
                    {dua.titleUz && (
                      <span className="text-[11px] text-emerald-400 font-medium">
                        {selectedTranslation === 'uz_cyr' ? latinToCyrillicUz(dua.titleUz) : dua.titleUz}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleCopyDua(dua.title, dua.arabic, dua.transliteration, trans, dua.id)}
                    className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition"
                    title="Copy Dua"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Arabic Calligraphy */}
                <div className="py-2 text-right">
                  <p className="font-arabic text-2xl sm:text-3xl text-amber-100 leading-loose font-medium">
                    {dua.arabic}
                  </p>
                </div>

                {/* Transliteration */}
                <p className="text-xs text-amber-200/90 font-mono tracking-wide leading-relaxed">
                  {dua.transliteration}
                </p>

                {/* Translation */}
                <div className="pt-2 border-t border-slate-800/50">
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{trans}"
                  </p>
                  {isUzbekTrans && dua.translationEn && (
                    <p className="text-[11px] text-slate-400/80 mt-1 italic">
                      English: "{dua.translationEn}"
                    </p>
                  )}
                </div>

                {/* Reference & Benefit */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/40 text-[10px] text-slate-400">
                  <span className="text-emerald-400 font-medium">{dua.reference}</span>
                  {dua.benefit && <span className="text-slate-400 truncate max-w-[200px]">{dua.benefit}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SECTION 2: THE 3 ASHRAS OF RAMADAN */}
      {activeDuaSection === 'ashras' && (
        <div className="space-y-4">
          {/* Ashra Selector */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setActiveAshra(1)}
              className={`p-3 rounded-2xl text-left border transition ${
                activeAshra === 1
                  ? 'bg-emerald-950 border-amber-400 text-amber-300 shadow-md'
                  : 'bg-slate-900 border-emerald-900/40 text-slate-300'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-emerald-400 block">{t.ramadan.daysRange1}</span>
              <span className="text-xs font-bold block">{t.ramadan.ashra1Title}</span>
              <span className="text-[10px] text-slate-400">{t.ramadan.ashra1Name}</span>
            </button>

            <button
              onClick={() => setActiveAshra(2)}
              className={`p-3 rounded-2xl text-left border transition ${
                activeAshra === 2
                  ? 'bg-emerald-950 border-amber-400 text-amber-300 shadow-md'
                  : 'bg-slate-900 border-emerald-900/40 text-slate-300'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-amber-400 block">{t.ramadan.daysRange2}</span>
              <span className="text-xs font-bold block">{t.ramadan.ashra2Title}</span>
              <span className="text-[10px] text-slate-400">{t.ramadan.ashra2Name}</span>
            </button>

            <button
              onClick={() => setActiveAshra(3)}
              className={`p-3 rounded-2xl text-left border transition ${
                activeAshra === 3
                  ? 'bg-emerald-950 border-amber-400 text-amber-300 shadow-md'
                  : 'bg-slate-900 border-emerald-900/40 text-slate-300'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-purple-400 block">{t.ramadan.daysRange3}</span>
              <span className="text-xs font-bold block">{t.ramadan.ashra3Title}</span>
              <span className="text-[10px] text-slate-400">{t.ramadan.ashra3Name}</span>
            </button>
          </div>

          {/* Active Ashra Content */}
          {activeAshra === 1 && (
            <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 border border-emerald-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-amber-300 text-base">{t.ramadan.ashra1Name}</h3>
                  <p className="text-xs text-emerald-400">{t.ramadan.ashra1Sub}</p>
                </div>
                <span className="text-2xl font-arabic text-amber-400">رحمة</span>
              </div>

              <div className="py-3 text-right">
                <p className="font-arabic text-3xl text-white leading-loose font-medium">
                  رَبِّ اغْفِرْ وَارْحَمْ وَأَنْتَ خَيْرُ الرَّاحِمِينَ
                </p>
              </div>

              <p className="text-xs text-amber-200 font-mono">
                Rabbi-ghfir war-ham wa Anta khayrur-rahimeen
              </p>

              <div className="pt-2 border-t border-slate-800">
                <p className="text-xs text-slate-300 italic">
                  "{formatTrans(
                    "Robbim, mag'firat qilgin va rahm ayla, zotan Sen rahm qiluvchilarning eng yaxshisisan.",
                    "My Lord, forgive and have mercy, for You are the best of the merciful."
                  )}"
                </p>
                <span className="text-[10px] text-emerald-400 mt-1 block">Surah Al-Mu'minun (23:118)</span>
              </div>
            </div>
          )}

          {activeAshra === 2 && (
            <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-950/60 via-slate-900 to-slate-950 border border-amber-600/60 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-amber-300 text-base">{t.ramadan.ashra2Name}</h3>
                  <p className="text-xs text-amber-400">{t.ramadan.ashra2Sub}</p>
                </div>
                <span className="text-2xl font-arabic text-amber-400">مغفرة</span>
              </div>

              <div className="py-3 text-right">
                <p className="font-arabic text-3xl text-white leading-loose font-medium">
                  أَسْتَغْفِرُ اللَّهَ رَبِّي مِنْ كُلِّ ذَنْبٍ وَأَتُوبُ إِلَيْهِ
                </p>
              </div>

              <p className="text-xs text-amber-200 font-mono">
                Astaghfirullaha Rabbi min kulli dhanbin wa atoobu ilayh
              </p>

              <div className="pt-2 border-t border-slate-800">
                <p className="text-xs text-slate-300 italic">
                  "{formatTrans(
                    "Robbim Allohdan barcha gunohlarim uchun mag'firat so'rayman va Unga tavba qilaman.",
                    "I seek forgiveness from Allah, my Lord, from every sin and I turn to Him in repentance."
                  )}"
                </p>
                <span className="text-[10px] text-amber-400 mt-1 block">Sunnah Formula of Istighfar</span>
              </div>
            </div>
          )}

          {activeAshra === 3 && (
            <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-950/60 via-slate-900 to-slate-950 border border-purple-600/60 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-purple-300 text-base">{t.ramadan.ashra3Name}</h3>
                  <p className="text-xs text-purple-300">{t.ramadan.ashra3Sub}</p>
                </div>
                <span className="text-2xl font-arabic text-purple-300">نجاة</span>
              </div>

              <div className="py-3 text-right">
                <p className="font-arabic text-3xl text-white leading-loose font-medium">
                  اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي
                </p>
              </div>

              <p className="text-xs text-amber-200 font-mono">
                Allahumma innaka 'Afuwwun tuhibbul-'afwa fa'fu 'anni
              </p>

              <div className="pt-2 border-t border-slate-800">
                <p className="text-xs text-slate-300 italic">
                  "{formatTrans(
                    "Allohim, albatta Sen kechirimli Zotsan, kechirishni sevasan, bas meni afv etgin.",
                    "O Allah, You are Most Forgiving, and You love forgiveness; so pardon and forgive me."
                  )}"
                </p>
                <span className="text-[10px] text-purple-300 mt-1 block">Sunan at-Tirmidhi 3513 (Laylat al-Qadr Dua)</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: DAILY 30-DAY RAMADAN DUAS & REFLECTIONS */}
      {activeDuaSection === '30days' && (
        <div className="space-y-4">
          {/* Day Selector Ribbon */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedDayNumber(prev => Math.max(1, prev - 1))}
              disabled={selectedDayNumber === 1}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-bold text-amber-300">
              {selectedDayNumber} {t.ramadan.dayOfRamadan}
            </span>

            <button
              onClick={() => setSelectedDayNumber(prev => Math.min(30, prev + 1))}
              disabled={selectedDayNumber === 30}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Day Chips Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {Array.from({ length: 30 }).map((_, i) => {
              const dNum = i + 1;
              const isSelected = selectedDayNumber === dNum;
              return (
                <button
                  key={dNum}
                  onClick={() => setSelectedDayNumber(dNum)}
                  className={`w-9 h-9 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center shrink-0 border ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {dNum}
                </button>
              );
            })}
          </div>

          {/* Active Day Card */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-emerald-800/60 space-y-3 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-950">
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  {t.ramadan.dayWord} {selectedDayDua.day} • {selectedDayDua.theme}
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">{selectedDayDua.title}</h3>
              </div>

              <button
                onClick={() => handleCopyDua(
                  `${t.ramadan.dayWord} ${selectedDayDua.day}`,
                  selectedDayDua.arabic,
                  selectedDayDua.transliteration,
                  formatTrans(selectedDayDua.translationUz, selectedDayDua.translationEn),
                  `day-${selectedDayDua.day}`
                )}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              >
                {copiedId === `day-${selectedDayDua.day}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="py-3 text-right">
              <p className="font-arabic text-2xl text-amber-100 leading-loose font-medium">
                {selectedDayDua.arabic}
              </p>
            </div>

            <p className="text-xs text-amber-200/90 font-mono tracking-wide leading-relaxed">
              {selectedDayDua.transliteration}
            </p>

            <div className="pt-2 border-t border-slate-800">
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "{formatTrans(selectedDayDua.translationUz, selectedDayDua.translationEn)}"
              </p>
              {isUzbekTrans && (
                <p className="text-[11px] text-slate-400/80 mt-1 italic">
                  English: "{selectedDayDua.translationEn}"
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800/60 text-[10px] text-emerald-400 font-medium">
              {t.ramadan.refLabel} {selectedDayDua.hadithOrAyahRef}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: SUNNAH FASTING ETIQUETTE & HEALTH TIPS */}
      {activeDuaSection === 'tips' && (
        <div className="space-y-3">
          {RAMADAN_SUNNAH_TIPS.map((tip, idx) => (
            <div key={idx} className="p-4 rounded-3xl bg-slate-900/80 border border-emerald-900/50 space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-900/60 text-amber-400">
                  <Utensils className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-white text-xs">{tip.title}</h4>
              </div>

              <p className="text-xs text-slate-300 italic leading-relaxed">
                {tip.desc}
              </p>

              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-[11px] text-emerald-300">
                <span className="font-bold text-amber-300">{t.ramadan.practicalTip} </span>
                {tip.tip}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
