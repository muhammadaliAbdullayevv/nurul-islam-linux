import React, { useState, useRef, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Volume2, VolumeX, Award, Flame, BookOpen, Info, X, Sparkles, ChevronRight } from 'lucide-react';
import { TasbihPreset } from '../../types';
import {
  TASBIH_PRESETS,
  ALL_TASBIH_PRESETS,
  getLocalizedTasbihPreset,
  getZikrGuideItems,
  ZikrGuideItem
} from '../../data/azkar';
import { NAMES_OF_ALLAH, getLocalizedAllahName } from '../../data/names99';
import { soundFx } from '../../utils/audio';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

/**
 * Handcrafted 3D Luxury Islamic Misbaha Bead (Pure Scalable Vector Art — 0 KB raster weight, razor-sharp at any DPI)
 * - Primary Bead: Warm Royal Honey-Amber polished gemstone sphere with translucent sub-surface caustic glow
 *   and machined 24k satin-gold cord ferrules.
 * - Divider Bead (every 11th): Imperial Deep Emerald-Jade cabochon spacer framed by double stepped 24k gold collars.
 */
const TasbihGemBead: React.FC<{ isDivider: boolean; isCenter: boolean }> = React.memo(
  ({ isDivider, isCenter }) => {
    if (isDivider) {
      return (
        <svg
          viewBox="0 0 64 64"
          className="w-[46px] h-[46px] max-w-none shrink-0 select-none overflow-visible"
          style={{
            filter: isCenter
              ? 'drop-shadow(0 8px 14px rgba(0, 0, 0, 0.56)) drop-shadow(0 0 12px rgba(251, 191, 36, 0.55))'
              : 'drop-shadow(0 5px 8px rgba(0, 0, 0, 0.48))',
          }}
        >
          {/* Left & Right stepped 24k brushed-gold end-cap ferrules */}
          <rect x="4" y="25" width="7" height="14" rx="3" fill="url(#nqBeadGoldCap)" stroke="#5c3906" strokeWidth="0.7" />
          <rect x="9.5" y="22.5" width="4.5" height="19" rx="2" fill="url(#nqBeadGoldCollar)" stroke="#5c3906" strokeWidth="0.6" />
          <rect x="53" y="25" width="7" height="14" rx="3" fill="url(#nqBeadGoldCap)" stroke="#5c3906" strokeWidth="0.7" />
          <rect x="50" y="22.5" width="4.5" height="19" rx="2" fill="url(#nqBeadGoldCollar)" stroke="#5c3906" strokeWidth="0.6" />

          {/* Imperial Emerald-Jade Spacer Body */}
          <ellipse cx="32" cy="32" rx="20.5" ry="19.5" fill="url(#nqBeadJadeBody)" stroke="rgba(253, 230, 138, 0.45)" strokeWidth="0.8" />
          {/* Internal Jade Caustic Sub-Surface Glow */}
          <ellipse cx="36" cy="39" rx="12" ry="7" fill="url(#nqBeadJadeCaustic)" />
          {/* Gleaming 24k Gold Meridian Accent Ring */}
          <ellipse cx="32" cy="32" rx="3.2" ry="19.3" fill="none" stroke="url(#nqBeadGoldCollar)" strokeWidth="2.1" opacity="0.92" />
          {/* Crisp Studio Glass Specular Highlight */}
          <ellipse cx="25" cy="22.5" rx="7.2" ry="3.8" transform="rotate(-24 25 22.5)" fill="url(#nqBeadGloss)" />
          <circle cx="20.5" cy="27.5" r="1.6" fill="rgba(255,255,255,0.65)" />
        </svg>
      );
    }

    return (
      <svg
        viewBox="0 0 64 64"
        className="w-[54px] h-[54px] max-w-none shrink-0 select-none overflow-visible"
        style={{
          filter: isCenter
            ? 'drop-shadow(0 9px 15px rgba(0, 0, 0, 0.58)) drop-shadow(0 0 13px rgba(251, 191, 36, 0.52))'
            : 'drop-shadow(0 5px 9px rgba(0, 0, 0, 0.48))',
        }}
      >
        {/* Sculpted 24k Satin-Gold Cord Ferrules */}
        <rect x="3.5" y="25.5" width="6.5" height="13" rx="3" fill="url(#nqBeadGoldCap)" stroke="#5c3906" strokeWidth="0.65" />
        <rect x="54" y="25.5" width="6.5" height="13" rx="3" fill="url(#nqBeadGoldCap)" stroke="#5c3906" strokeWidth="0.65" />

        {/* Polished Warm Royal Honey-Amber Spherical Gemstone */}
        <circle cx="32" cy="32" r="22.5" fill="url(#nqBeadAmberBody)" />
        {/* Delicate Warm Translucent Rim Depth */}
        <circle cx="32" cy="32" r="22.1" fill="none" stroke="rgba(255, 241, 194, 0.35)" strokeWidth="0.9" />
        {/* Warm Sub-Surface Translucent Amber Caustic Bounce (bottom-right) */}
        <ellipse cx="37.5" cy="40.5" rx="13" ry="8.5" transform="rotate(-18 37.5 40.5)" fill="url(#nqBeadAmberCaustic)" />
        {/* Subtle Satin-Gold Hairline Trim at Cord Poles */}
        <path d="M 11.2 24.5 Q 13.5 32 11.2 39.5" fill="none" stroke="url(#nqBeadGoldCollar)" strokeWidth="1.6" strokeLinecap="round" opacity="0.85" />
        <path d="M 52.8 24.5 Q 50.5 32 52.8 39.5" fill="none" stroke="url(#nqBeadGoldCollar)" strokeWidth="1.6" strokeLinecap="round" opacity="0.85" />
        {/* Crisp Curved Studio Glass Specular Reflection */}
        <ellipse cx="24" cy="21" rx="8.2" ry="4.4" transform="rotate(-28 24 21)" fill="url(#nqBeadGloss)" />
        <circle cx="18.8" cy="27.2" r="1.9" fill="rgba(255, 253, 240, 0.72)" />
      </svg>
    );
  }
);
TasbihGemBead.displayName = 'TasbihGemBead';

const STATS_STORAGE_KEY = 'nq_tasbih_stats';

function loadStoredTotals(): { cycles: number; totalBeads: number } {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { totalCycles?: number; totalBeads?: number };
      return {
        cycles: typeof parsed.totalCycles === 'number' ? parsed.totalCycles : 0,
        totalBeads: typeof parsed.totalBeads === 'number' ? parsed.totalBeads : 0,
      };
    }
  } catch {
    // Ignore storage error
  }
  return { cycles: 0, totalBeads: 0 };
}

const NAMES_MODE_LABELS = {
  uz_lat: {
    btn: 'Allohning ismlari',
    completedMsg: 'Allohning 99 go‘zal ismi to‘liq zikr qilindi!',
    title: 'Allohning 99 go‘zal ismi',
  },
  uz_cyr: {
    btn: 'Аллоҳнинг исмлари',
    completedMsg: 'Аллоҳнинг 99 гўзал исми тўлиқ зикр қилинди!',
    title: 'Аллоҳнинг 99 гўзал исми',
  },
  en: {
    btn: '99 Names',
    completedMsg: 'Completed reciting all 99 Names of Allah!',
    title: '99 Names of Allah',
  },
  ru: {
    btn: '99 Имён',
    completedMsg: 'Вы завершили зикр всех 99 Имён Аллаха!',
    title: '99 Имён Аллаха',
  },
} as const;

export const TasbihTab: React.FC = () => {
  const { isDay } = useTheme();
  const { language, t } = useLanguage();
  const namesUi = NAMES_MODE_LABELS[language] || NAMES_MODE_LABELS.en;

  const [activePreset, setActivePreset] = useState<TasbihPreset>(TASBIH_PRESETS[0]);
  const [is99NamesMode, setIs99NamesMode] = useState<boolean>(false);
  const [guidedQueue, setGuidedQueue] = useState<{ title: string; presetIds: string[]; index: number } | null>(null);
  const [sequenceNotice, setSequenceNotice] = useState(false);

  const [count, setCount] = useState<number>(0);
  const [step, setStep] = useState<number>(0);
  const [totals, setTotals] = useState(loadStoredTotals);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [pulseGlow, setPulseGlow] = useState<boolean>(false);

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const didSwipeRef = useRef<boolean>(false);

  const beadSlotRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const ropeWeave1Ref = useRef<SVGPathElement | null>(null);
  const ropeWeave2Ref = useRef<SVGPathElement | null>(null);
  const stepSlideRef = useRef({ current: 0, vel: 0 });

  const localizedPreset = getLocalizedTasbihPreset(activePreset, language);
  const guideItems = useMemo(() => getZikrGuideItems(language), [language]);

  // Ensure the active preset chip appears in the top strip even when launched from extended guide presets
  const visibleChips = useMemo(() => {
    const inBase = TASBIH_PRESETS.some((p) => p.id === activePreset.id);
    return inBase ? TASBIH_PRESETS : [activePreset, ...TASBIH_PRESETS];
  }, [activePreset]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STATS_STORAGE_KEY,
        JSON.stringify({ totalCycles: totals.cycles, totalBeads: totals.totalBeads })
      );
    } catch {
      // Ignore storage error
    }
  }, [totals]);

  useEffect(() => {
    if (!sequenceNotice) return;
    const timer = window.setTimeout(() => setSequenceNotice(false), 2400);
    return () => window.clearTimeout(timer);
  }, [sequenceNotice]);

  // Smooth bead-glide along the fixed silk cord ONLY while sliding after a tap/swipe (zero floating)
  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();

    const applyFixedBeadPositions = (stepFloat: number) => {
      const braidOffset = stepFloat * 14;
      ropeWeave1Ref.current?.setAttribute('stroke-dashoffset', braidOffset.toFixed(2));
      ropeWeave2Ref.current?.setAttribute('stroke-dashoffset', (braidOffset + 1.5).toFixed(2));

      beadSlotRefs.current.forEach((el, beadId) => {
        const floatOffset = beadId - stepFloat;
        const clampedAbs = Math.abs(floatOffset);
        const tCurve = Math.min(1.08, Math.max(-0.08, 0.5 + floatOffset * 0.122));
        const mt = 1 - tCurve;

        const bx = mt * mt * -18 + 2 * mt * tCurve * 180 + tCurve * tCurve * 378;
        const by = mt * mt * 86 + 2 * mt * tCurve * 16 + tCurve * tCurve * 86;
        const dx = 2 * mt * (180 - -18) + 2 * tCurve * (378 - 180);
        const dy = 2 * mt * (16 - 86) + 2 * tCurve * (86 - 16);
        const tangentDeg = Math.atan2(dy, dx) * (180 / Math.PI);

        const centerProximity = Math.max(0, 1 - clampedAbs);
        const beadScale = 1 - Math.min(4.0, clampedAbs) * 0.055 + centerProximity * 0.18;

        el.style.left = `${(bx / 360) * 100}%`;
        el.style.top = `${(by / 110) * 100}%`;
        el.style.opacity = '1';
        el.style.transform = `translate(-50%, -50%) rotate(${tangentDeg.toFixed(2)}deg) scale(${beadScale.toFixed(3)})`;
        el.style.zIndex = String(Math.round(12 - Math.min(10, clampedAbs)));
      });
    };

    const tickSlide = (now: number) => {
      const dt = Math.min(0.032, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      const s = stepSlideRef.current;
      const diff = step - s.current;
      const acc = diff * 240 - s.vel * 28;
      s.vel += acc * dt;
      s.current += s.vel * dt;

      if (Math.abs(step - s.current) < 0.0015 && Math.abs(s.vel) < 0.01) {
        s.current = step;
        s.vel = 0;
        applyFixedBeadPositions(step);
        return;
      }

      applyFixedBeadPositions(s.current);
      rafId = window.requestAnimationFrame(tickSlide);
    };

    if (Math.abs(step - stepSlideRef.current.current) < 0.0015) {
      stepSlideRef.current.current = step;
      stepSlideRef.current.vel = 0;
      applyFixedBeadPositions(step);
      return;
    }

    rafId = window.requestAnimationFrame(tickSlide);
    return () => window.cancelAnimationFrame(rafId);
  }, [step]);

  useEffect(() => {
    if (!pulseGlow) return;
    const timer = window.setTimeout(() => setPulseGlow(false), 160);
    return () => window.clearTimeout(timer);
  }, [pulseGlow]);

  // Close guide or info sheet cleanly on Android native Back button
  useEffect(() => {
    const handleBack = (e: Event) => {
      if (isInfoOpen) {
        e.preventDefault();
        setIsInfoOpen(false);
        return;
      }
      if (isGuideOpen) {
        e.preventDefault();
        setIsGuideOpen(false);
      }
    };
    window.addEventListener('nq:android-back', handleBack);
    return () => window.removeEventListener('nq:android-back', handleBack);
  }, [isGuideOpen, isInfoOpen]);

  const activeTarget = is99NamesMode ? NAMES_OF_ALLAH.length : activePreset.target;
  const activeAllahNameObj = NAMES_OF_ALLAH[count % NAMES_OF_ALLAH.length];
  const localizedAllahName = getLocalizedAllahName(activeAllahNameObj, language);

  const handleSelectChip = (preset: TasbihPreset) => {
    setIs99NamesMode(false);
    setGuidedQueue(null);
    setSequenceNotice(false);
    setActivePreset(preset);
    setCount(0);
  };

  const handleSelect99NamesChip = () => {
    setIs99NamesMode(true);
    setGuidedQueue(null);
    setSequenceNotice(false);
    setCount(0);
  };

  const handleStartFromGuide = (item: ZikrGuideItem) => {
    const firstId = item.presetIds[0];
    const firstPreset = ALL_TASBIH_PRESETS.find((p) => p.id === firstId) || TASBIH_PRESETS[0];
    setIs99NamesMode(false);
    setActivePreset(firstPreset);
    setCount(0);
    setSequenceNotice(false);
    if (item.presetIds.length > 1) {
      setGuidedQueue({ title: item.situation, presetIds: item.presetIds, index: 0 });
    } else {
      setGuidedQueue(null);
    }
    setIsGuideOpen(false);
  };

  const advanceBead = () => {
    if (soundEnabled) {
      soundFx.playClick();
    }
    if (navigator.vibrate) {
      navigator.vibrate(25);
    }

    setPulseGlow(true);
    setStep((s) => s + 1);
    const nextCount = count + 1;

    if (nextCount >= activeTarget) {
      setCount(0);
      setTotals((prev) => ({
        cycles: prev.cycles + 1,
        totalBeads: prev.totalBeads + 1,
      }));
      if (soundEnabled) {
        soundFx.playCompletionChime();
      }
      if (navigator.vibrate) {
        navigator.vibrate([60, 50, 100]);
      }

      if (is99NamesMode) {
        setSequenceNotice(true);
      } else if (guidedQueue) {
        const nextIdx = guidedQueue.index + 1;
        if (nextIdx < guidedQueue.presetIds.length) {
          const nextPreset = ALL_TASBIH_PRESETS.find((p) => p.id === guidedQueue.presetIds[nextIdx]);
          if (nextPreset) {
            setActivePreset(nextPreset);
            setGuidedQueue({ ...guidedQueue, index: nextIdx });
            return;
          }
        } else {
          // Completed full guided 33 -> 33 -> 34 set
          const resetFirst = ALL_TASBIH_PRESETS.find((p) => p.id === guidedQueue.presetIds[0]);
          if (resetFirst) setActivePreset(resetFirst);
          setGuidedQueue({ ...guidedQueue, index: 0 });
          setSequenceNotice(true);
        }
      }

      try {
        confetti({
          particleCount: 45,
          spread: 55,
          origin: { y: 0.72 },
          colors: ['#158509', '#d0f39f', '#f59e0b', '#34d399'],
        });
      } catch {
        // Confetti fallback
      }
    } else {
      setCount(nextCount);
      setTotals((prev) => ({
        ...prev,
        totalBeads: prev.totalBeads + 1,
      }));
    }
  };

  const handleReset = () => {
    setCount(0);
    setSequenceNotice(false);
    if (guidedQueue) {
      const resetFirst = ALL_TASBIH_PRESETS.find((p) => p.id === guidedQueue.presetIds[0]);
      if (resetFirst) setActivePreset(resetFirst);
      setGuidedQueue({ ...guidedQueue, index: 0 });
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    didSwipeRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerStartRef.current || didSwipeRef.current) return;
    const dx = Math.abs(e.clientX - pointerStartRef.current.x);
    const dy = Math.abs(e.clientY - pointerStartRef.current.y);
    if (dx > 24 || dy > 24) {
      didSwipeRef.current = true;
      advanceBead();
    }
  };

  const handlePointerUp = () => {
    if (pointerStartRef.current && !didSwipeRef.current) {
      advanceBead();
    }
    pointerStartRef.current = null;
    didSwipeRef.current = false;
  };

  const progressPct = Math.min(100, Math.round((count / activeTarget) * 100));
  const beadOffsets = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];

  return (
    <div
      className={`flex-1 min-h-0 h-full flex flex-col gap-2 overflow-hidden ${
        isDay ? 'text-slate-900' : 'text-slate-100'
      }`}
    >
      {/* Row 1: Guide Button + Sound & Reset (Separated from Preset Chips) */}
      <div className="flex items-center justify-between gap-2 shrink-0">
        <button
          type="button"
          onClick={() => setIsGuideOpen(true)}
          className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shrink-0 ${
            isDay
              ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703] hover:bg-[#e1f5db]'
              : 'bg-emerald-950 border-emerald-700/80 text-amber-300 hover:bg-emerald-900'
          }`}
          title={t.tasbih.guideTitle}
        >
          <BookOpen className="w-3.5 h-3.5 shrink-0" />
          <span>{t.tasbih.guideBtn}</span>
        </button>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border transition active:scale-95 ${
              soundEnabled
                ? isDay
                  ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                  : 'bg-emerald-950 border-emerald-700 text-emerald-300'
                : isDay
                ? 'bg-white border-[#dde3ea] text-slate-400'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            aria-label={t.tasbih.toggleSound}
            title={t.tasbih.toggleSound}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className={`p-2 rounded-xl border transition active:scale-95 ${
              isDay
                ? 'bg-white border-[#dde3ea] text-slate-600 hover:text-slate-900'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            aria-label={t.tasbih.resetCounter}
            title={t.tasbih.resetCounter}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Row 2: Full-Width Scrollable Zikr Chips (Allohning ismlari first, SubhanAllah default) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 shrink-0">
        <button
          type="button"
          onClick={handleSelect99NamesChip}
          className={`px-3 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition border flex items-center gap-1 shrink-0 ${
            is99NamesMode
              ? isDay
                ? 'bg-[#158509] text-white border-[#0c4703] nq-keep-dark'
                : 'bg-amber-400 text-slate-950 border-amber-300'
              : isDay
              ? 'bg-white text-slate-700 border-[#dde3ea] hover:bg-[#eef9ea]'
              : 'bg-slate-900 text-slate-300 border-emerald-900/50 hover:bg-emerald-950'
          }`}
        >
          <Sparkles className="w-3 h-3 shrink-0" />
          <span>{namesUi.btn}</span>
          <span className="opacity-75 font-mono text-[11px] shrink-0">(99)</span>
        </button>

        {visibleChips.map((preset) => {
          const isActive = !is99NamesMode && activePreset.id === preset.id;
          const loc = getLocalizedTasbihPreset(preset, language);
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectChip(preset)}
              className={`px-3 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition border flex items-center gap-1 shrink-0 max-w-[180px] ${
                isActive
                  ? isDay
                    ? 'bg-[#158509] text-white border-[#0c4703] nq-keep-dark'
                    : 'bg-amber-400 text-slate-950 border-amber-300'
                  : isDay
                  ? 'bg-white text-slate-700 border-[#dde3ea] hover:bg-[#eef9ea]'
                  : 'bg-slate-900 text-slate-300 border-emerald-900/50 hover:bg-emerald-950'
              }`}
            >
              <span className="truncate">{loc.transliteration}</span>
              <span className="opacity-75 font-mono text-[11px] shrink-0">({preset.target})</span>
            </button>
          );
        })}
      </div>

      {/* Active Dhikr / 99 Names Display Card */}
      <div
        className={`relative rounded-3xl border px-4 py-2.5 text-center shrink-0 transition ${
          sequenceNotice
            ? isDay
              ? 'bg-[#eef9ea] border-[#158509] shadow-sm'
              : 'bg-emerald-950/90 border-amber-400 shadow-lg'
            : isDay
            ? 'bg-white border-[#dde3ea] shadow-xs'
            : 'bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border-emerald-800/50 shadow-lg'
        }`}
      >
        <button
          type="button"
          onClick={() => setIsInfoOpen(true)}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-xl transition ${
            isDay
              ? 'text-slate-400 hover:text-[#158509] hover:bg-[#eef9ea]'
              : 'text-slate-400 hover:text-amber-300 hover:bg-emerald-950'
          }`}
          aria-label={t.tasbih.infoBtn}
          title={t.tasbih.infoBtn}
        >
          <Info className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-center gap-1.5 mb-0.5 flex-wrap px-6">
          <span
            className={`text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full border ${
              isDay
                ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                : 'bg-emerald-950 border-emerald-800/60 text-amber-400'
            }`}
          >
            {is99NamesMode
              ? `#${activeAllahNameObj.number} / 99 · ${namesUi.title}`
              : guidedQueue
              ? `${t.tasbih.stepWord} ${guidedQueue.index + 1}/${guidedQueue.presetIds.length} · ${t.tasbih.targetLabel}: ${activeTarget}`
              : `${t.tasbih.targetLabel}: ${activeTarget} • ${t.tasbih.cyclesLabel}: ${totals.cycles}`}
          </span>
        </div>

        <h2
          className={`font-arabic text-2xl sm:text-[26px] font-semibold my-0.5 leading-snug ${
            isDay ? 'text-[#0c4703]' : 'text-amber-300'
          }`}
          dir="rtl"
        >
          {is99NamesMode ? activeAllahNameObj.arabic : activePreset.arabic}
        </h2>
        <p
          className={`tracking-tight ${
            is99NamesMode ? 'text-lg sm:text-xl font-extrabold' : 'text-sm sm:text-base font-bold'
          } ${isDay ? 'text-slate-900' : 'text-white'}`}
        >
          {is99NamesMode ? localizedAllahName.transliteration : localizedPreset.transliteration}
        </p>
        <p
          className={`text-xs mt-0.5 line-clamp-1 px-4 ${
            sequenceNotice
              ? isDay
                ? 'text-[#158509] font-semibold'
                : 'text-amber-300 font-semibold'
              : isDay
              ? 'text-slate-500'
              : 'text-slate-400'
          }`}
        >
          {sequenceNotice
            ? is99NamesMode
              ? namesUi.completedMsg
              : t.tasbih.autoSequenceDone
            : is99NamesMode
            ? localizedAllahName.meaning
            : localizedPreset.translation}
        </p>
      </div>

      {/* Compact 2-Column Stats Strip */}
      <div className="grid grid-cols-2 gap-2 shrink-0">
        <div
          className={`px-3 py-2 rounded-2xl border flex items-center gap-2 ${
            isDay ? 'bg-white border-[#dde3ea] shadow-xs' : 'bg-slate-900/80 border-emerald-900/50'
          }`}
        >
          <div
            className={`p-1.5 rounded-xl shrink-0 ${
              isDay ? 'bg-[#eef9ea] text-[#158509]' : 'bg-emerald-900/60 text-amber-400'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <p className={`text-[10px] truncate ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
              {t.tasbih.totalSets}
            </p>
            <p className={`text-xs font-bold truncate ${isDay ? 'text-slate-900' : 'text-white'}`}>
              {totals.cycles} {t.tasbih.completedWord}
            </p>
          </div>
        </div>

        <div
          className={`px-3 py-2 rounded-2xl border flex items-center gap-2 ${
            isDay ? 'bg-white border-[#dde3ea] shadow-xs' : 'bg-slate-900/80 border-emerald-900/50'
          }`}
        >
          <div
            className={`p-1.5 rounded-xl shrink-0 ${
              isDay ? 'bg-[#eef9ea] text-[#158509]' : 'bg-emerald-900/60 text-amber-400'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <p className={`text-[10px] truncate ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
              {t.tasbih.totalBeads}
            </p>
            <p className={`text-xs font-bold font-mono truncate ${isDay ? 'text-slate-900' : 'text-white'}`}>
              {totals.totalBeads.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Spacer pushes Interactive Real Tasbih Stage into Lower Ergonomic Zone */}
      <div className="flex-1 min-h-0" />

      {/* Lower Real Animated Tasbih Bead Stage (Tap or Slide Any Direction) */}
      <div
        role="button"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          pointerStartRef.current = null;
          didSwipeRef.current = false;
        }}
        style={{
          WebkitTapHighlightColor: 'transparent',
          outline: 'none',
          boxShadow: 'none',
        }}
        className={`nq-keep-dark relative w-full h-52 sm:h-56 rounded-[28px] border-2 overflow-hidden select-none touch-none cursor-pointer outline-none focus:outline-none flex flex-col justify-between px-4 py-3.5 shrink-0 ${
          isDay
            ? 'bg-gradient-to-b from-[#0b4707] via-[#136c13] to-[#083405] border-[#158509]/70'
            : 'bg-gradient-to-b from-emerald-950 via-[#07261d] to-slate-950 border-emerald-700/60'
        }`}
      >
        {/* Top Counter Readout + Smooth Progress Bar */}
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
              {count}
            </span>
            <span className="text-sm font-bold text-[#d0f39f] font-mono">
              / {activeTarget}
            </span>
          </div>

          <div className="w-28 sm:w-32 space-y-1 text-right">
            <span className="text-[11px] font-mono font-bold text-[#d0f39f]">{progressPct}%</span>
            <div className="w-full h-2 rounded-full bg-black/30 overflow-hidden border border-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#d0f39f] to-amber-300 transition-all duration-200"
                style={{ width: `${Math.max(4, progressPct)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Fixed Braided Silk Tasbih Cord & Solid Carved Pearl-Gold Beads */}
        <div className="relative w-full h-28 flex items-center justify-center pointer-events-none">
          <svg
            viewBox="0 0 360 110"
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="tasbihRopeBase" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6b4a1e" />
                <stop offset="25%" stopColor="#c9a25e" />
                <stop offset="50%" stopColor="#f0d592" />
                <stop offset="75%" stopColor="#c9a25e" />
                <stop offset="100%" stopColor="#6b4a1e" />
              </linearGradient>
              <radialGradient id="tasbihCenterHalo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(251, 191, 36, 0.34)" />
                <stop offset="65%" stopColor="rgba(251, 191, 36, 0.09)" />
                <stop offset="100%" stopColor="rgba(251, 191, 36, 0)" />
              </radialGradient>
              {/* Shared Luxury 3D Gemstone Bead Gradients */}
              <radialGradient id="nqBeadAmberBody" cx="34%" cy="28%" r="72%" fx="28%" fy="22%">
                <stop offset="0%" stopColor="#fff2c2" />
                <stop offset="22%" stopColor="#f8c85c" />
                <stop offset="56%" stopColor="#d98218" />
                <stop offset="84%" stopColor="#8f4007" />
                <stop offset="100%" stopColor="#4a1d02" />
              </radialGradient>
              <radialGradient id="nqBeadAmberCaustic" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(255, 224, 130, 0.72)" />
                <stop offset="55%" stopColor="rgba(245, 166, 35, 0.28)" />
                <stop offset="100%" stopColor="rgba(245, 166, 35, 0)" />
              </radialGradient>
              <radialGradient id="nqBeadJadeBody" cx="34%" cy="28%" r="72%" fx="28%" fy="22%">
                <stop offset="0%" stopColor="#a7f3d0" />
                <stop offset="24%" stopColor="#34d399" />
                <stop offset="58%" stopColor="#059669" />
                <stop offset="85%" stopColor="#065f46" />
                <stop offset="100%" stopColor="#022c22" />
              </radialGradient>
              <radialGradient id="nqBeadJadeCaustic" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(167, 243, 208, 0.65)" />
                <stop offset="60%" stopColor="rgba(16, 185, 129, 0.22)" />
                <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
              </radialGradient>
              <linearGradient id="nqBeadGoldCap" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8c5a12" />
                <stop offset="28%" stopColor="#fde68a" />
                <stop offset="50%" stopColor="#fff7d6" />
                <stop offset="74%" stopColor="#d49b2a" />
                <stop offset="100%" stopColor="#5c3605" />
              </linearGradient>
              <linearGradient id="nqBeadGoldCollar" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#7a4c0b" />
                <stop offset="30%" stopColor="#fef08a" />
                <stop offset="55%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#663c05" />
              </linearGradient>
              <linearGradient id="nqBeadGloss" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.88)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0.04)" />
              </linearGradient>
            </defs>

            {/* Subtle warm spotlight behind active center bead */}
            <circle
              cx="180"
              cy="51"
              r={pulseGlow ? '46' : '38'}
              fill="url(#tasbihCenterHalo)"
              className="transition-[r] duration-150"
            />

            {/* Soft silk cord drop shadow on emerald felt */}
            <path
              d="M -18 89.2 Q 180 20 378 89.2"
              fill="none"
              stroke="rgba(0, 0, 0, 0.34)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            {/* Recessed dark core edge of slender braided silk cord */}
            <path
              d="M -18 86 Q 180 16 378 86"
              fill="none"
              stroke="#3b260b"
              strokeWidth="1.45"
              strokeLinecap="round"
            />

            {/* Fine proportional gold-silk braided cord */}
            <path
              d="M -18 86 Q 180 16 378 86"
              fill="none"
              stroke="url(#tasbihRopeBase)"
              strokeWidth="1.15"
              strokeLinecap="round"
            />

            {/* Woven diagonal silk braid texture */}
            <path
              ref={ropeWeave1Ref}
              d="M -18 86 Q 180 16 378 86"
              fill="none"
              stroke="rgba(74, 46, 12, 0.58)"
              strokeWidth="0.55"
              strokeDasharray="2.0 2.0"
            />
            <path
              ref={ropeWeave2Ref}
              d="M -18 85.65 Q 180 15.65 378 85.65"
              fill="none"
              stroke="rgba(255, 245, 212, 0.85)"
              strokeWidth="0.42"
              strokeDasharray="1.6 2.4"
            />
          </svg>

          {beadOffsets.map((offset) => {
            const beadId = step + offset;
            const liveFloatOffset = beadId - stepSlideRef.current.current;
            const tCurve = Math.min(1.08, Math.max(-0.08, 0.5 + liveFloatOffset * 0.122));
            const mt = 1 - tCurve;
            const bx = mt * mt * -18 + 2 * mt * tCurve * 180 + tCurve * tCurve * 378;
            const by = mt * mt * 86 + 2 * mt * tCurve * 16 + tCurve * tCurve * 86;
            const dx = 2 * mt * (180 - -18) + 2 * tCurve * (378 - 180);
            const dy = 2 * mt * (16 - 86) + 2 * tCurve * (86 - 16);
            const tangentDeg = Math.atan2(dy, dx) * (180 / Math.PI);

            const clampedAbs = Math.abs(liveFloatOffset);
            const leftPct = (bx / 360) * 100;
            const topPct = (by / 110) * 100;
            const isCenter = offset === 0;
            const isDividerBead = beadId !== 0 && beadId % 11 === 0;
            const centerProximity = Math.max(0, 1 - clampedAbs);
            const beadScale = 1 - Math.min(4.0, clampedAbs) * 0.055 + centerProximity * 0.18;

            return (
              <div
                key={beadId}
                ref={(el) => {
                  if (el) {
                    beadSlotRefs.current.set(beadId, el);
                  } else {
                    beadSlotRefs.current.delete(beadId);
                  }
                }}
                className="absolute will-change-transform"
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  opacity: 1,
                  transform: `translate(-50%, -50%) rotate(${tangentDeg.toFixed(1)}deg) scale(${beadScale.toFixed(3)})`,
                  zIndex: Math.round(12 - Math.min(10, clampedAbs)),
                }}
              >
                <TasbihGemBead isDivider={isDividerBead} isCenter={isCenter} />
              </div>
            );
          })}
        </div>

        <p className="relative z-10 text-center text-[10px] font-bold tracking-widest uppercase text-white/75">
          {t.tasbih.tapToCount}
        </p>
      </div>

      {/* ZIKR GUIDE BOTTOM SHEET ("What to say on Tasbih?") */}
      {isGuideOpen && (
        <div
          onClick={() => setIsGuideOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md max-h-[82dvh] rounded-t-3xl sm:rounded-3xl border flex flex-col overflow-hidden shadow-2xl ${
              isDay
                ? 'bg-[#ecf1f5] border-[#dde3ea] text-slate-900'
                : 'bg-slate-900 border-emerald-800/70 text-slate-100'
            }`}
          >
            {/* Header */}
            <div
              className={`px-4 py-3.5 border-b flex items-center justify-between shrink-0 ${
                isDay ? 'bg-white border-[#dde3ea]' : 'bg-slate-950 border-emerald-900/50'
              }`}
            >
              <div className="min-w-0">
                <h3 className={`text-sm font-bold flex items-center gap-1.5 ${isDay ? 'text-[#0c4703]' : 'text-amber-300'}`}>
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span className="truncate">{t.tasbih.guideTitle}</span>
                </h3>
                <p className={`text-[11px] truncate mt-0.5 ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                  {t.tasbih.guideSubtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsGuideOpen(false)}
                className={`p-1.5 rounded-xl shrink-0 ${
                  isDay ? 'bg-[#ecf1f5] text-slate-600' : 'bg-slate-800 text-slate-300'
                }`}
                aria-label={t.tasbih.exitGuideBtn}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Situation Cards */}
            <div className="flex-1 min-h-0 overflow-y-auto p-3.5 space-y-2.5">
              {guideItems.map((item) => {
                const primaryPreset =
                  ALL_TASBIH_PRESETS.find((p) => p.id === item.presetIds[0]) || TASBIH_PRESETS[0];
                const locPrimary = getLocalizedTasbihPreset(primaryPreset, language);

                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border p-3.5 space-y-2 ${
                      isDay
                        ? 'bg-white border-[#dde3ea] shadow-xs'
                        : 'bg-slate-950/80 border-emerald-900/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className={`text-xs font-bold ${isDay ? 'text-slate-900' : 'text-white'}`}>
                          {item.situation}
                        </p>
                        <p className={`text-[11px] ${isDay ? 'text-[#158509] font-medium' : 'text-emerald-400'}`}>
                          {item.whenToSay}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[10.5px] font-mono font-bold whitespace-nowrap shrink-0 border ${
                          isDay
                            ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                            : 'bg-emerald-950 border-emerald-700 text-amber-300'
                        }`}
                      >
                        {item.countLabel}
                      </span>
                    </div>

                    <div
                      className={`p-2.5 rounded-xl border space-y-1 ${
                        isDay ? 'bg-[#f8fafc] border-slate-200/80' : 'bg-slate-900/80 border-slate-800'
                      }`}
                    >
                      <p
                        className={`font-arabic text-lg text-right leading-relaxed ${
                          isDay ? 'text-[#0c4703]' : 'text-amber-300'
                        }`}
                        dir="rtl"
                      >
                        {primaryPreset.arabic}
                      </p>
                      <p className={`text-xs font-semibold ${isDay ? 'text-slate-900' : 'text-white'}`}>
                        {locPrimary.transliteration}
                      </p>
                      <p className={`text-[11px] leading-relaxed ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                        {locPrimary.translation}
                      </p>
                    </div>

                    <p className={`text-[11px] leading-relaxed ${isDay ? 'text-slate-600' : 'text-slate-300'}`}>
                      {item.virtue}
                    </p>

                    <button
                      type="button"
                      onClick={() => handleStartFromGuide(item)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-[0.99] ${
                        isDay
                          ? 'bg-[#158509] hover:bg-[#0c5007] text-white nq-keep-dark'
                          : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                      }`}
                    >
                      <span>{t.tasbih.startOnTasbih}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CURRENT DHIKR INFO POPUP */}
      {isInfoOpen && (
        <div
          onClick={() => setIsInfoOpen(false)}
          className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-sm rounded-3xl border p-4 space-y-3 shadow-2xl ${
              isDay
                ? 'bg-white border-[#dde3ea] text-slate-900'
                : 'bg-slate-900 border-emerald-800 text-slate-100'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${isDay ? 'text-[#0c4703]' : 'text-amber-300'}`}>
                {t.tasbih.benefitLabel}
              </span>
              <button
                type="button"
                onClick={() => setIsInfoOpen(false)}
                className={`p-1 rounded-lg ${isDay ? 'text-slate-400' : 'text-slate-400'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p
              className={`font-arabic text-2xl text-center py-1 ${isDay ? 'text-[#0c4703]' : 'text-amber-300'}`}
              dir="rtl"
            >
              {is99NamesMode ? activeAllahNameObj.arabic : activePreset.arabic}
            </p>
            <p className="text-xs font-bold text-center">
              {is99NamesMode
                ? `${activeAllahNameObj.number}. ${localizedAllahName.transliteration}`
                : localizedPreset.transliteration}
            </p>
            <p className={`text-xs text-center ${isDay ? 'text-slate-600' : 'text-slate-300'}`}>
              {is99NamesMode ? localizedAllahName.meaning : localizedPreset.translation}
            </p>

            {(is99NamesMode ? localizedAllahName.explanation : localizedPreset.meaning) && (
              <div
                className={`p-3 rounded-2xl border text-xs leading-relaxed space-y-1 ${
                  isDay ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]' : 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
                }`}
              >
                <p>{is99NamesMode ? localizedAllahName.explanation : localizedPreset.meaning}</p>
                {is99NamesMode && localizedAllahName.benefit && (
                  <p className="font-semibold opacity-90">{localizedAllahName.benefit}</p>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsInfoOpen(false)}
              className={`w-full py-2.5 rounded-xl text-xs font-bold ${
                isDay ? 'bg-[#158509] text-white' : 'bg-amber-400 text-slate-950'
              }`}
            >
              {t.tasbih.exitGuideBtn}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
