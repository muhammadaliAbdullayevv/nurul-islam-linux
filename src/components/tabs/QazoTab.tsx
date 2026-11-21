import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  Plus,
  Minus,
  RotateCcw,
  Calculator,
  Moon,
  Clock,
  Sparkles,
  User,
  Calendar,
  HeartPulse,
  ShieldCheck,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage, formatGregorianDate } from '../../contexts/LanguageContext';

interface QazoCounts {
  fajr: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
  witr: number;
  fasts: number;
  bonusPrayers: number;
  bonusFasts: number;
}

type TrackScope = 'both' | 'prayers' | 'fasts';
type Gender = 'male' | 'female';

interface QazoProfile {
  setupDone: boolean;
  scope: TrackScope;
  gender: Gender;
  balighAge: number;
  cycleDaysPerMonth: number;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  prayerStartYear: number;
  prayerStartMonth: number;
  prayerStartDay: number;
  fastStartYear: number;
  fastStartMonth: number;
  fastStartDay: number;
  gapMonths: number;
  gapDays: number;
  bufferDays: number;
}

const QAZO_STORAGE_KEY = 'nq_qazo_counts';
const QAZO_PROFILE_KEY = 'nq_qazo_profile_v1';
const LUNAR_YEAR_DAYS = 354.367;
const LUNAR_MONTH_DAYS = 29.5306;
const MS_PER_DAY = 86_400_000;

const DEFAULT_COUNTS: QazoCounts = {
  fajr: 0,
  dhuhr: 0,
  asr: 0,
  maghrib: 0,
  isha: 0,
  witr: 0,
  fasts: 0,
  bonusPrayers: 0,
  bonusFasts: 0,
};

function createDefaultProfile(): QazoProfile {
  const now = new Date();
  return {
    setupDone: false,
    scope: 'both',
    gender: 'male',
    balighAge: 12,
    cycleDaysPerMonth: 5,
    birthYear: 2000,
    birthMonth: 1,
    birthDay: 1,
    prayerStartYear: now.getFullYear(),
    prayerStartMonth: now.getMonth() + 1,
    prayerStartDay: now.getDate(),
    fastStartYear: now.getFullYear(),
    fastStartMonth: now.getMonth() + 1,
    fastStartDay: now.getDate(),
    gapMonths: 0,
    gapDays: 0,
    bufferDays: 30,
  };
}

function loadQazo(): QazoCounts {
  try {
    const raw = localStorage.getItem(QAZO_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<QazoCounts>;
      return {
        fajr: Math.max(0, Number(parsed.fajr) || 0),
        dhuhr: Math.max(0, Number(parsed.dhuhr) || 0),
        asr: Math.max(0, Number(parsed.asr) || 0),
        maghrib: Math.max(0, Number(parsed.maghrib) || 0),
        isha: Math.max(0, Number(parsed.isha) || 0),
        witr: Math.max(0, Number(parsed.witr) || 0),
        fasts: Math.max(0, Number(parsed.fasts) || 0),
        bonusPrayers: Math.max(0, Number(parsed.bonusPrayers) || 0),
        bonusFasts: Math.max(0, Number(parsed.bonusFasts) || 0),
      };
    }
  } catch {
    // Ignore storage error
  }
  return DEFAULT_COUNTS;
}

function loadQazoProfile(): QazoProfile {
  try {
    const raw = localStorage.getItem(QAZO_PROFILE_KEY);
    if (raw) {
      return { ...createDefaultProfile(), ...JSON.parse(raw) };
    }
    // If user already used manual Qazo counts previously, don't block them behind wizard
    const oldCounts = localStorage.getItem(QAZO_STORAGE_KEY);
    if (oldCounts) {
      const parsed = JSON.parse(oldCounts) as Partial<QazoCounts>;
      const hasAny =
        (parsed.fajr || 0) +
          (parsed.dhuhr || 0) +
          (parsed.asr || 0) +
          (parsed.maghrib || 0) +
          (parsed.isha || 0) +
          (parsed.witr || 0) +
          (parsed.fasts || 0) >
        0;
      if (hasAny) {
        return { ...createDefaultProfile(), setupDone: true };
      }
    }
  } catch {
    // Ignore
  }
  return createDefaultProfile();
}

function safeDate(year: number, month: number, day: number): Date {
  const y = Math.max(1930, Math.min(2035, Math.floor(year) || 2000));
  const m = Math.max(1, Math.min(12, Math.floor(month) || 1));
  const maxDay = new Date(y, m, 0).getDate();
  const d = Math.max(1, Math.min(maxDay, Math.floor(day) || 1));
  return new Date(y, m - 1, d, 12, 0, 0);
}

function formatDaysSpan(
  totalDays: number,
  t: ReturnType<typeof useLanguage>['t']
): string {
  const safe = Math.max(0, Math.round(totalDays));
  const years = Math.floor(safe / 365);
  const remAfterYears = safe % 365;
  const months = Math.floor(remAfterYears / 30);
  const days = remAfterYears % 30;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${t.qazo.yearShort}`);
  if (months > 0) parts.push(`${months} ${t.qazo.monthShort}`);
  if (days > 0 || parts.length === 0) parts.push(`${days} ${t.qazo.dayShort}`);
  return parts.join(' · ');
}

function computeEstimation(profile: QazoProfile) {
  const birth = safeDate(profile.birthYear, profile.birthMonth, profile.birthDay);
  const balighDate = new Date(
    birth.getTime() + Math.round(profile.balighAge * LUNAR_YEAR_DAYS) * MS_PER_DAY
  );
  const prayerStart = safeDate(
    profile.prayerStartYear,
    profile.prayerStartMonth,
    profile.prayerStartDay
  );
  const fastStart = safeDate(
    profile.fastStartYear,
    profile.fastStartMonth,
    profile.fastStartDay
  );

  const rawMissedPrayerDays = Math.max(
    0,
    Math.round((prayerStart.getTime() - balighDate.getTime()) / MS_PER_DAY)
  );
  const gapTotalDays =
    Math.max(0, profile.gapMonths) * 30 + Math.max(0, profile.gapDays);

  let netPrayerDays = rawMissedPrayerDays + gapTotalDays;
  if (profile.gender === 'female') {
    const cycleRate = Math.max(0, Math.min(15, profile.cycleDaysPerMonth)) / LUNAR_MONTH_DAYS;
    const deductedDays = Math.round(netPrayerDays * cycleRate);
    netPrayerDays = Math.max(0, netPrayerDays - deductedDays);
  }
  const finalPrayerDays =
    profile.scope === 'fasts' ? 0 : netPrayerDays + Math.max(0, profile.bufferDays);

  // Missed Ramadan fasts: every lunar year since Baligh carries ~29.5 Ramadan fasting days
  const rawMissedFastSpanDays = Math.max(
    0,
    Math.round((fastStart.getTime() - balighDate.getTime()) / MS_PER_DAY)
  );
  const estimatedMissedRamadans = Math.floor(rawMissedFastSpanDays / LUNAR_YEAR_DAYS);
  const baseFastDays = Math.round(estimatedMissedRamadans * 29.5);
  const gapFastDays = Math.round((gapTotalDays / LUNAR_YEAR_DAYS) * 29.5);
  const bufferFastDays = profile.bufferDays > 0 ? Math.min(10, Math.ceil(profile.bufferDays / 10)) : 0;
  const finalFastDays =
    profile.scope === 'prayers' ? 0 : baseFastDays + gapFastDays + bufferFastDays;

  return {
    balighDate,
    finalPrayerDays,
    finalPrayerRakatsCount: finalPrayerDays * 6,
    finalFastDays,
  };
}

type PrayerKey = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'witr';

export const QazoTab: React.FC = () => {
  const { isDay } = useTheme();
  const { language, t } = useLanguage();

  const [profile, setProfile] = useState<QazoProfile>(loadQazoProfile);
  const [counts, setCounts] = useState<QazoCounts>(loadQazo);
  const [wizardOpen, setWizardOpen] = useState<boolean>(() => !loadQazoProfile().setupDone);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [draft, setDraft] = useState<QazoProfile>(loadQazoProfile);

  const [section, setSection] = useState<'prayers' | 'fasts'>(() =>
    loadQazoProfile().scope === 'fasts' ? 'fasts' : 'prayers'
  );
  const [showCalc, setShowCalc] = useState(false);
  const [calcYears, setCalcYears] = useState('0');
  const [calcMonths, setCalcMonths] = useState('1');
  const [calcDays, setCalcDays] = useState('0');

  useEffect(() => {
    try {
      localStorage.setItem(QAZO_STORAGE_KEY, JSON.stringify(counts));
    } catch {
      // Ignore storage error
    }
  }, [counts]);

  useEffect(() => {
    try {
      localStorage.setItem(QAZO_PROFILE_KEY, JSON.stringify(profile));
    } catch {
      // Ignore storage error
    }
  }, [profile]);

  useEffect(() => {
    const onBack = (e: Event) => {
      if (!wizardOpen) return;
      if (wizardStep > 1) {
        e.preventDefault();
        setWizardStep((s) => (s === 3 ? 2 : 1));
      } else if (profile.setupDone) {
        e.preventDefault();
        setWizardOpen(false);
      }
    };
    window.addEventListener('nq:android-back', onBack);
    return () => window.removeEventListener('nq:android-back', onBack);
  }, [wizardOpen, wizardStep, profile.setupDone]);

  const estimate = useMemo(() => computeEstimation(draft), [draft]);

  const totalPrayersRemaining =
    counts.fajr + counts.dhuhr + counts.asr + counts.maghrib + counts.isha + counts.witr;
  const avgDaysRemaining = Math.ceil(totalPrayersRemaining / 6);

  const handleOpenWizard = () => {
    setDraft(profile);
    setWizardStep(1);
    setWizardOpen(true);
  };

  const handleApplyWizard = () => {
    const finalized: QazoProfile = { ...draft, setupDone: true };
    const result = computeEstimation(finalized);
    setProfile(finalized);
    setCounts({
      fajr: result.finalPrayerDays,
      dhuhr: result.finalPrayerDays,
      asr: result.finalPrayerDays,
      maghrib: result.finalPrayerDays,
      isha: result.finalPrayerDays,
      witr: result.finalPrayerDays,
      fasts: result.finalFastDays,
      bonusPrayers: counts.bonusPrayers,
      bonusFasts: counts.bonusFasts,
    });
    if (finalized.scope === 'fasts') {
      setSection('fasts');
    } else {
      setSection('prayers');
    }
    setWizardOpen(false);
  };

  const handleSkipManual = () => {
    setProfile((prev) => ({ ...prev, setupDone: true }));
    setWizardOpen(false);
  };

  const updatePrayer = (key: PrayerKey, delta: number) => {
    setCounts((prev) => {
      if (delta < 0 && prev[key] <= 0) {
        // Excess prayed beyond remaining Qazo counts cleanly as Bonus (Nafl) reward!
        return { ...prev, bonusPrayers: prev.bonusPrayers + Math.abs(delta) };
      }
      return { ...prev, [key]: Math.max(0, prev[key] + delta) };
    });
  };

  const updateAllDay = (deltaDays: number) => {
    setCounts((prev) => {
      if (deltaDays < 0) {
        let bonusAdded = 0;
        const keys: PrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'witr'];
        const updated = { ...prev };
        for (const k of keys) {
          if (updated[k] >= 1) {
            updated[k] -= 1;
          } else {
            bonusAdded += 1;
          }
        }
        updated.bonusPrayers += bonusAdded;
        return updated;
      }
      return {
        ...prev,
        fajr: Math.max(0, prev.fajr + deltaDays),
        dhuhr: Math.max(0, prev.dhuhr + deltaDays),
        asr: Math.max(0, prev.asr + deltaDays),
        maghrib: Math.max(0, prev.maghrib + deltaDays),
        isha: Math.max(0, prev.isha + deltaDays),
        witr: Math.max(0, prev.witr + deltaDays),
      };
    });
  };

  const updateFast = (delta: number) => {
    setCounts((prev) => {
      if (delta < 0 && prev.fasts <= 0) {
        return { ...prev, bonusFasts: prev.bonusFasts + Math.abs(delta) };
      }
      return { ...prev, fasts: Math.max(0, prev.fasts + delta) };
    });
  };

  const applyBulkCalculation = (e: React.FormEvent) => {
    e.preventDefault();
    const totalDaysToAdd =
      Math.max(0, parseInt(calcYears, 10) || 0) * 365 +
      Math.max(0, parseInt(calcMonths, 10) || 0) * 30 +
      Math.max(0, parseInt(calcDays, 10) || 0);
    if (totalDaysToAdd > 0) {
      updateAllDay(totalDaysToAdd);
      setShowCalc(false);
    }
  };

  const setStartToday = () => {
    const now = new Date();
    setDraft((prev) => ({
      ...prev,
      prayerStartYear: now.getFullYear(),
      prayerStartMonth: now.getMonth() + 1,
      prayerStartDay: now.getDate(),
      fastStartYear: now.getFullYear(),
      fastStartMonth: now.getMonth() + 1,
      fastStartDay: now.getDate(),
    }));
  };

  const prayerItems: Array<{ key: PrayerKey; label: string; arabic: string }> = [
    { key: 'fajr', label: t.prayers.fajr, arabic: 'الفجر' },
    { key: 'dhuhr', label: t.prayers.dhuhr, arabic: 'الظهر' },
    { key: 'asr', label: t.prayers.asr, arabic: 'العصر' },
    { key: 'maghrib', label: t.prayers.maghrib, arabic: 'المغرب' },
    { key: 'isha', label: t.prayers.isha, arabic: 'العشاء' },
    { key: 'witr', label: t.qazo.witr, arabic: 'الوتر' },
  ];

  const cardCls = isDay
    ? 'rounded-2xl bg-white border border-[#dde3ea] shadow-xs'
    : 'rounded-2xl bg-slate-900/85 border border-emerald-900/50';

  const inputCls = isDay
    ? 'w-full rounded-xl border border-[#dde3ea] bg-[#ecf1f5] p-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#158509]'
    : 'w-full rounded-xl border border-emerald-800 bg-slate-950 p-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400';

  // ======================== GUIDED QAZO SETUP WIZARD ========================
  if (wizardOpen) {
    return (
      <div className={`space-y-3.5 pb-8 ${isDay ? 'text-slate-900' : 'text-slate-100'}`}>
        {/* Wizard Hero */}
        <div
          className={`nq-keep-dark rounded-3xl border p-4 text-white shadow-lg ${
            isDay
              ? 'bg-gradient-to-br from-[#0c5007] via-[#157a17] to-[#2e8537] border-[#0a4306]'
              : 'bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 border-emerald-700/50'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-lg font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#d0f39f]" />
                <span>{t.qazo.wizardTitle}</span>
              </h2>
              <p className="text-[11px] text-white/80 mt-0.5">{t.qazo.wizardSubtitle}</p>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-black/25 border border-white/15 font-mono text-xs font-bold text-[#d0f39f] shrink-0">
              {wizardStep} / 3
            </span>
          </div>

          <div className="mt-3 w-full h-1.5 rounded-full bg-black/25 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#d0f39f] transition-all duration-300"
              style={{ width: `${(wizardStep / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: Scope & Gender Fiqh Rule */}
        {wizardStep === 1 && (
          <div className="space-y-3">
            <div className={`${cardCls} p-4 space-y-2.5`}>
              <label className={`text-xs font-bold block ${isDay ? 'text-[#0c4703]' : 'text-amber-300'}`}>
                {t.qazo.trackTypeLabel}
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { id: 'both', label: t.qazo.bothType },
                    { id: 'prayers', label: t.qazo.prayersOnlyType },
                    { id: 'fasts', label: t.qazo.fastsOnlyType },
                  ] as const
                ).map((opt) => {
                  const active = draft.scope === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setDraft((p) => ({ ...p, scope: opt.id }))}
                      className={`py-2.5 px-2 rounded-xl border text-[11px] font-bold transition ${
                        active
                          ? isDay
                            ? 'bg-[#158509] text-white border-[#0c4703] nq-keep-dark'
                            : 'bg-amber-400 text-slate-950 border-amber-300'
                          : isDay
                          ? 'bg-[#ecf1f5] text-slate-700 border-[#dde3ea]'
                          : 'bg-slate-950 text-slate-300 border-slate-800'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={`${cardCls} p-4 space-y-3`}>
              <label className={`text-xs font-bold flex items-center gap-1.5 ${isDay ? 'text-[#0c4703]' : 'text-amber-300'}`}>
                <User className="w-3.5 h-3.5" />
                <span>{t.qazo.genderLabel}</span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'male', label: t.qazo.maleLabel, defaultAge: 12 },
                    { id: 'female', label: t.qazo.femaleLabel, defaultAge: 9 },
                  ] as const
                ).map((g) => {
                  const active = draft.gender === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() =>
                        setDraft((p) => ({ ...p, gender: g.id, balighAge: g.defaultAge }))
                      }
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition ${
                        active
                          ? isDay
                            ? 'bg-[#158509] text-white border-[#0c4703] nq-keep-dark'
                            : 'bg-amber-400 text-slate-950 border-amber-300'
                          : isDay
                          ? 'bg-[#ecf1f5] text-slate-700 border-[#dde3ea]'
                          : 'bg-slate-950 text-slate-300 border-slate-800'
                      }`}
                    >
                      {g.label}
                    </button>
                  );
                })}
              </div>

              <div
                className={`p-2.5 rounded-xl border text-[11px] leading-relaxed ${
                  isDay
                    ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                    : 'bg-emerald-950/60 border-emerald-800/60 text-emerald-200'
                }`}
              >
                {draft.gender === 'female' ? t.qazo.femaleCycleHint : t.qazo.malePubertyHint}
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div>
                  <label className={`text-[11px] block mb-1 ${isDay ? 'text-slate-600' : 'text-slate-400'}`}>
                    {t.qazo.balighAgeLabel}
                  </label>
                  <input
                    type="number"
                    min={9}
                    max={18}
                    value={draft.balighAge}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        balighAge: Math.max(9, Math.min(18, Number(e.target.value) || 12)),
                      }))
                    }
                    className={inputCls}
                  />
                </div>

                {draft.gender === 'female' && (
                  <div>
                    <label className={`text-[11px] block mb-1 ${isDay ? 'text-slate-600' : 'text-slate-400'}`}>
                      {t.qazo.cycleDaysLabel}
                    </label>
                    <input
                      type="number"
                      min={3}
                      max={10}
                      value={draft.cycleDaysPerMonth}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          cycleDaysPerMonth: Math.max(3, Math.min(10, Number(e.target.value) || 5)),
                        }))
                      }
                      className={inputCls}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Birth Date & Prayer/Fasting Start Dates */}
        {wizardStep === 2 && (
          <div className="space-y-3">
            {/* Birth Date */}
            <div className={`${cardCls} p-4 space-y-2.5`}>
              <label className={`text-xs font-bold flex items-center gap-1.5 ${isDay ? 'text-[#0c4703]' : 'text-amber-300'}`}>
                <Calendar className="w-3.5 h-3.5" />
                <span>{t.qazo.birthDateLabel}</span>
              </label>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className={`text-[10px] block mb-1 ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                    {t.prayerTab.yearLabel}
                  </label>
                  <input
                    type="number"
                    min={1930}
                    max={2022}
                    value={draft.birthYear}
                    onChange={(e) => setDraft((p) => ({ ...p, birthYear: Number(e.target.value) }))}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={`text-[10px] block mb-1 ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                    {t.prayerTab.monthNameLabel}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={draft.birthMonth}
                    onChange={(e) => setDraft((p) => ({ ...p, birthMonth: Number(e.target.value) }))}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={`text-[10px] block mb-1 ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                    {t.prayerTab.dayLabel}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={draft.birthDay}
                    onChange={(e) => setDraft((p) => ({ ...p, birthDay: Number(e.target.value) }))}
                    className={inputCls}
                  />
                </div>
              </div>

              <p className={`text-[11px] font-medium ${isDay ? 'text-[#158509]' : 'text-emerald-300'}`}>
                {t.qazo.balighDatePreview}{' '}
                <span className="font-bold">
                  {formatGregorianDate(estimate.balighDate, language)} {estimate.balighDate.getFullYear()}
                </span>
              </p>
            </div>

            {/* Prayer Start Date */}
            {draft.scope !== 'fasts' && (
              <div className={`${cardCls} p-4 space-y-2.5`}>
                <div className="flex items-center justify-between gap-2">
                  <label className={`text-xs font-bold ${isDay ? 'text-[#0c4703]' : 'text-amber-300'}`}>
                    {t.qazo.prayerStartDateLabel}
                  </label>
                  <button
                    type="button"
                    onClick={setStartToday}
                    className={`px-2 py-0.5 rounded-lg text-[10.5px] font-bold border ${
                      isDay ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]' : 'bg-emerald-950 border-emerald-700 text-amber-300'
                    }`}
                  >
                    {t.qazo.todayShortcut}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className={`text-[10px] block mb-1 ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                      {t.prayerTab.yearLabel}
                    </label>
                    <input
                      type="number"
                      min={1950}
                      max={2035}
                      value={draft.prayerStartYear}
                      onChange={(e) => setDraft((p) => ({ ...p, prayerStartYear: Number(e.target.value) }))}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={`text-[10px] block mb-1 ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                      {t.prayerTab.monthNameLabel}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={draft.prayerStartMonth}
                      onChange={(e) => setDraft((p) => ({ ...p, prayerStartMonth: Number(e.target.value) }))}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={`text-[10px] block mb-1 ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                      {t.prayerTab.dayLabel}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={31}
                      value={draft.prayerStartDay}
                      onChange={(e) => setDraft((p) => ({ ...p, prayerStartDay: Number(e.target.value) }))}
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Fasting Start Date */}
            {draft.scope !== 'prayers' && (
              <div className={`${cardCls} p-4 space-y-2.5`}>
                <label className={`text-xs font-bold block ${isDay ? 'text-[#0c4703]' : 'text-amber-300'}`}>
                  {t.qazo.fastStartDateLabel}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className={`text-[10px] block mb-1 ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                      {t.prayerTab.yearLabel}
                    </label>
                    <input
                      type="number"
                      min={1950}
                      max={2035}
                      value={draft.fastStartYear}
                      onChange={(e) => setDraft((p) => ({ ...p, fastStartYear: Number(e.target.value) }))}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={`text-[10px] block mb-1 ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                      {t.prayerTab.monthNameLabel}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={draft.fastStartMonth}
                      onChange={(e) => setDraft((p) => ({ ...p, fastStartMonth: Number(e.target.value) }))}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={`text-[10px] block mb-1 ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                      {t.prayerTab.dayLabel}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={31}
                      value={draft.fastStartDay}
                      onChange={(e) => setDraft((p) => ({ ...p, fastStartDay: Number(e.target.value) }))}
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Sick/Stopped Interruptions & Safety Bonus Buffer */}
        {wizardStep === 3 && (
          <div className="space-y-3">
            {/* Interrupted / Sick Periods */}
            <div className={`${cardCls} p-4 space-y-2.5`}>
              <h3 className={`text-xs font-bold flex items-center gap-1.5 ${isDay ? 'text-[#0c4703]' : 'text-amber-300'}`}>
                <HeartPulse className="w-3.5 h-3.5" />
                <span>{t.qazo.gapSectionTitle}</span>
              </h3>
              <p className={`text-[11px] leading-relaxed ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                {t.qazo.gapSectionDesc}
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className={`text-[11px] block mb-1 ${isDay ? 'text-slate-600' : 'text-slate-400'}`}>
                    {t.qazo.monthsLabel}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={600}
                    value={draft.gapMonths}
                    onChange={(e) => setDraft((p) => ({ ...p, gapMonths: Math.max(0, Number(e.target.value) || 0) }))}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={`text-[11px] block mb-1 ${isDay ? 'text-slate-600' : 'text-slate-400'}`}>
                    {t.qazo.daysLabel}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={365}
                    value={draft.gapDays}
                    onChange={(e) => setDraft((p) => ({ ...p, gapDays: Math.max(0, Number(e.target.value) || 0) }))}
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            {/* Caution / Bonus Buffer Recommendation */}
            <div className={`${cardCls} p-4 space-y-2.5`}>
              <h3 className={`text-xs font-bold flex items-center gap-1.5 ${isDay ? 'text-[#0c4703]' : 'text-amber-300'}`}>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.qazo.bufferSectionTitle}</span>
              </h3>
              <p
                className={`p-2.5 rounded-xl border text-[11px] leading-relaxed ${
                  isDay
                    ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                    : 'bg-emerald-950/60 border-emerald-800/60 text-emerald-200'
                }`}
              >
                {t.qazo.bufferHint}
              </p>

              <div className="flex items-center gap-1.5 flex-wrap">
                {[0, 15, 30, 60, 90].map((d) => {
                  const selected = draft.bufferDays === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDraft((p) => ({ ...p, bufferDays: d }))}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition ${
                        selected
                          ? isDay
                            ? 'bg-[#158509] text-white border-[#0c4703]'
                            : 'bg-amber-400 text-slate-950 border-amber-300'
                          : isDay
                          ? 'bg-[#ecf1f5] text-slate-700 border-[#dde3ea]'
                          : 'bg-slate-950 text-slate-300 border-slate-800'
                      }`}
                    >
                      +{d} {t.qazo.dayShort}
                    </button>
                  );
                })}
              </div>

              <div>
                <label className={`text-[11px] block mb-1 ${isDay ? 'text-slate-600' : 'text-slate-400'}`}>
                  {t.qazo.extraDaysLabel}
                </label>
                <input
                  type="number"
                  min={0}
                  max={2000}
                  value={draft.bufferDays}
                  onChange={(e) => setDraft((p) => ({ ...p, bufferDays: Math.max(0, Number(e.target.value) || 0) }))}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Live Calculation Preview */}
            <div
              className={`p-4 rounded-2xl border space-y-1.5 ${
                isDay ? 'bg-[#eef9ea] border-[#158509]/50' : 'bg-emerald-950/80 border-amber-400/50'
              }`}
            >
              {draft.scope !== 'fasts' && (
                <>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>{t.qazo.prayersTab}:</span>
                    <span className="font-mono">
                      {estimate.finalPrayerRakatsCount.toLocaleString()} ({estimate.finalPrayerDays.toLocaleString()} {t.qazo.dayShort})
                    </span>
                  </div>
                  <p className={`text-[11px] ${isDay ? 'text-[#0c4703]' : 'text-amber-300'}`}>
                    {t.qazo.summaryBreakdown} {formatDaysSpan(estimate.finalPrayerDays, t)}
                  </p>
                </>
              )}
              {draft.scope !== 'prayers' && (
                <div className="flex items-center justify-between text-xs font-bold pt-1">
                  <span>{t.qazo.fastsTab}:</span>
                  <span className="font-mono">
                    {estimate.finalFastDays.toLocaleString()} {t.qazo.dayShort}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Wizard Navigation Footer */}
        <div className="flex items-center gap-2 pt-1">
          {wizardStep > 1 ? (
            <button
              type="button"
              onClick={() => setWizardStep((s) => (s === 3 ? 2 : 1))}
              className={`px-4 py-3 rounded-2xl border text-xs font-bold flex items-center gap-1 ${
                isDay ? 'bg-white border-[#dde3ea] text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t.qazo.prevStepBtn}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSkipManual}
              className={`px-3.5 py-3 rounded-2xl border text-xs font-semibold ${
                isDay ? 'bg-white border-[#dde3ea] text-slate-600' : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              {t.qazo.skipManualBtn}
            </button>
          )}

          {wizardStep < 3 ? (
            <button
              type="button"
              onClick={() => setWizardStep((s) => (s === 1 ? 2 : 3))}
              className={`flex-1 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1 transition ${
                isDay ? 'bg-[#158509] text-white nq-keep-dark' : 'bg-amber-400 text-slate-950'
              }`}
            >
              <span>{t.qazo.nextStepBtn}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleApplyWizard}
              className={`flex-1 py-3 rounded-2xl text-xs font-bold transition ${
                isDay ? 'bg-[#158509] text-white nq-keep-dark' : 'bg-amber-400 text-slate-950'
              }`}
            >
              {t.qazo.calculateAndStartBtn}
            </button>
          )}
        </div>
      </div>
    );
  }

  // ======================== MAIN QAZO TRACKER DASHBOARD ========================
  return (
    <div className={`space-y-3.5 pb-8 ${isDay ? 'text-slate-900' : 'text-slate-100'}`}>
      {/* Hero Summary Card with Years/Months/Days & Bonus Mode */}
      <div
        className={`nq-keep-dark rounded-3xl border p-5 text-white shadow-lg ${
          isDay
            ? 'bg-gradient-to-br from-[#0c5007] via-[#157a17] to-[#2e8537] border-[#0a4306]'
            : 'bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 border-emerald-700/50'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/80">
              {t.qazo.totalRemaining}
            </p>
            <h2 className="text-3xl font-black font-mono mt-0.5 text-[#d0f39f]">
              {section === 'prayers'
                ? totalPrayersRemaining.toLocaleString()
                : counts.fasts.toLocaleString()}
            </h2>
            <p className="text-xs font-semibold text-white/90 mt-1">
              {section === 'prayers'
                ? `${avgDaysRemaining.toLocaleString()} ${t.qazo.dayShort} · ${formatDaysSpan(avgDaysRemaining, t)}`
                : formatDaysSpan(counts.fasts, t)}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleOpenWizard}
              className="px-2.5 py-2 rounded-xl bg-black/25 hover:bg-black/35 border border-white/15 text-[#d0f39f] text-[11px] font-bold flex items-center gap-1 transition active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.qazo.wizardBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => setCounts(DEFAULT_COUNTS)}
              className="p-2 rounded-xl bg-black/25 hover:bg-black/35 border border-white/15 text-white/85 transition active:scale-95"
              title={t.qazo.resetAllBtn}
              aria-label={t.qazo.resetAllBtn}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bonus (Nafl) Counter Bar */}
        {(counts.bonusPrayers > 0 || counts.bonusFasts > 0 || totalPrayersRemaining === 0) && (
          <div className="mt-3 px-3 py-1.5 rounded-xl bg-black/20 border border-[#d0f39f]/35 flex items-center justify-between text-[11px]">
            <span className="text-white/85">{t.qazo.bonusCounterLabel}</span>
            <span className="font-mono font-bold text-[#d0f39f]">
              +{(section === 'prayers' ? counts.bonusPrayers : counts.bonusFasts).toLocaleString()}
            </span>
          </div>
        )}

        {/* Mode Switcher: Prayers vs Fasts */}
        <div className="grid grid-cols-2 gap-2 mt-3.5 p-1 rounded-2xl bg-black/25 border border-white/15">
          <button
            type="button"
            onClick={() => setSection('prayers')}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              section === 'prayers'
                ? 'bg-[#d0f39f] text-[#0c4703] shadow-xs'
                : 'text-white/85 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{t.qazo.prayersTab}</span>
          </button>

          <button
            type="button"
            onClick={() => setSection('fasts')}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              section === 'fasts'
                ? 'bg-[#d0f39f] text-[#0c4703] shadow-xs'
                : 'text-white/85 hover:text-white'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>{t.qazo.fastsTab}</span>
          </button>
        </div>
      </div>

      {section === 'prayers' ? (
        <>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => updateAllDay(1)}
              className={`py-2.5 px-2 rounded-2xl border text-[11px] font-bold transition active:scale-95 ${
                isDay
                  ? 'bg-white border-[#dde3ea] text-slate-800 hover:bg-[#eef9ea]'
                  : 'bg-slate-900 border-emerald-900/60 text-slate-200 hover:bg-emerald-950'
              }`}
            >
              {t.qazo.addDayBtn}
            </button>

            <button
              type="button"
              onClick={() => updateAllDay(-1)}
              className={`py-2.5 px-2 rounded-2xl border text-[11px] font-bold transition active:scale-95 ${
                isDay
                  ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                  : 'bg-emerald-950 border-emerald-700/70 text-emerald-300'
              }`}
            >
              {totalPrayersRemaining === 0 ? `${t.qazo.subDayBtn} (${t.qazo.completedBonusBadge})` : t.qazo.subDayBtn}
            </button>

            <button
              type="button"
              onClick={() => setShowCalc((prev) => !prev)}
              className={`py-2.5 px-2 rounded-2xl border text-[11px] font-bold flex items-center justify-center gap-1 transition active:scale-95 ${
                showCalc
                  ? isDay
                    ? 'bg-[#158509] text-white border-[#0c4703] nq-keep-dark'
                    : 'bg-amber-400 text-slate-950 border-amber-300'
                  : isDay
                  ? 'bg-white border-[#dde3ea] text-slate-700'
                  : 'bg-slate-900 border-emerald-900/60 text-amber-300'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span className="truncate">{t.qazo.calcTitle}</span>
            </button>
          </div>

          {showCalc && (
            <form onSubmit={applyBulkCalculation} className={`${cardCls} p-4 space-y-3`}>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className={`text-[11px] block mb-1 ${isDay ? 'text-slate-600' : 'text-slate-400'}`}>
                    {t.qazo.yearsLabel}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={80}
                    value={calcYears}
                    onChange={(e) => setCalcYears(e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={`text-[11px] block mb-1 ${isDay ? 'text-slate-600' : 'text-slate-400'}`}>
                    {t.qazo.monthsLabel}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={11}
                    value={calcMonths}
                    onChange={(e) => setCalcMonths(e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={`text-[11px] block mb-1 ${isDay ? 'text-slate-600' : 'text-slate-400'}`}>
                    {t.qazo.daysLabel}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={calcDays}
                    onChange={(e) => setCalcDays(e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition ${
                  isDay ? 'bg-[#158509] text-white' : 'bg-amber-400 text-slate-950'
                }`}
              >
                {t.qazo.applyCalcBtn}
              </button>
            </form>
          )}

          <div className="space-y-2">
            {prayerItems.map((item) => {
              const val = counts[item.key];
              return (
                <div
                  key={item.key}
                  className={`${cardCls} p-3.5 flex items-center justify-between gap-2`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm ${isDay ? 'text-slate-900' : 'text-white'}`}>
                        {item.label}
                      </span>
                      <span className={`font-arabic text-sm ${isDay ? 'text-[#158509]' : 'text-amber-400'}`}>
                        {item.arabic}
                      </span>
                    </div>
                    {val === 0 && (
                      <p className={`text-[11px] flex items-center gap-1 mt-0.5 ${isDay ? 'text-[#158509]' : 'text-emerald-400'}`}>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{t.qazo.allCaughtUp}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updatePrayer(item.key, -1)}
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center transition active:scale-95 ${
                        val === 0
                          ? isDay
                            ? 'bg-[#158509] border-[#0c4703] text-white nq-keep-dark'
                            : 'bg-amber-400 border-amber-300 text-slate-950'
                          : isDay
                          ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                          : 'bg-emerald-950 border-emerald-700 text-emerald-300'
                      }`}
                      title={val === 0 ? t.qazo.completedBonusBadge : `Complete 1 ${item.label}`}
                      aria-label={`Complete 1 ${item.label}`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <span className={`w-14 text-center font-mono font-bold text-base ${isDay ? 'text-slate-900' : 'text-white'}`}>
                      {val}
                    </span>

                    <button
                      type="button"
                      onClick={() => updatePrayer(item.key, 1)}
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center transition active:scale-95 ${
                        isDay
                          ? 'bg-[#ecf1f5] border-[#dde3ea] text-slate-700 hover:bg-slate-200'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                      }`}
                      aria-label={`Add 1 ${item.label}`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className={`${cardCls} p-5 text-center space-y-4`}>
          <p className={`text-xs font-semibold uppercase tracking-wider ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
            {t.qazo.fastsRemaining}
          </p>

          <div className="flex items-center justify-center gap-5">
            <button
              type="button"
              onClick={() => updateFast(-1)}
              className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition active:scale-95 ${
                counts.fasts === 0
                  ? isDay
                    ? 'bg-[#158509] border-[#0c4703] text-white nq-keep-dark'
                    : 'bg-amber-400 border-amber-300 text-slate-950'
                  : isDay
                  ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                  : 'bg-emerald-950 border-emerald-700 text-emerald-300'
              }`}
              aria-label="Complete 1 Qazo fast"
            >
              <Minus className="w-5 h-5" />
            </button>

            <span className={`text-4xl font-black font-mono min-w-[72px] ${isDay ? 'text-slate-900' : 'text-white'}`}>
              {counts.fasts}
            </span>

            <button
              type="button"
              onClick={() => updateFast(1)}
              className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition active:scale-95 ${
                isDay
                  ? 'bg-[#ecf1f5] border-[#dde3ea] text-slate-700 hover:bg-slate-200'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
              }`}
              aria-label="Add 1 Qazo fast"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
