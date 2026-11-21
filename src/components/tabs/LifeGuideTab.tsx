import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Baby,
  BookOpen,
  Check,
  Compass,
  Copy,
  HandHeart,
  HeartPulse,
  Landmark,
  ShieldAlert,
  Sparkles,
  Users,
} from 'lucide-react';
import { AppLanguage } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  LIFE_SITUATION_GUIDES,
  LifeSituationGuide,
  getLocalizedSituationGuide,
} from '../../data/lifeGuideData';

const UI_TEXT: Record<
  AppLanguage,
  {
    heroBadge: string;
    heroTitle: string;
    heroSub: string;
    backToHub: string;
    stepsHeading: string;
    duasHeading: string;
    notesHeading: string;
    copyBtn: string;
    copiedBtn: string;
    sourceLabel: string;
    openGuide: string;
  }
> = {
  uz_lat: {
    heroBadge: 'Hanafiy fiqhi va Sunnat odoblari',
    heroTitle: 'Hayotiy Vaziyatlar Qo‘llanmasi',
    heroSub: 'Janoza, qabriston ziyorati, istixora, aqiqa, shifo, qarz va safar duolari',
    backToHub: 'Bo‘limlar',
    stepsHeading: 'Bajarish tartibi (Qadam-baqadam)',
    duasHeading: 'O‘qiladigan duolar va zikrlar',
    notesHeading: 'Muhim odoblar va eslatmalar',
    copyBtn: 'Nusxalash',
    copiedBtn: 'Nusxalandi',
    sourceLabel: 'Manba',
    openGuide: 'Batafsil',
  },
  uz_cyr: {
    heroBadge: 'Ҳанафий фиқҳи ва Суннат одоблари',
    heroTitle: 'Ҳаётий Вазиятлар Қўлланмаси',
    heroSub: 'Жаноза, қабристон зиёрати, истихора, ақиқа, шифо, қарз ва сафар дуолари',
    backToHub: 'Бўлимлар',
    stepsHeading: 'Бажариш тартиби (Қадам-бақадам)',
    duasHeading: 'Ўқиладиган дуолар ва зикрлар',
    notesHeading: 'Муҳим одоблар ва эслатмалар',
    copyBtn: 'Нусхалаш',
    copiedBtn: 'Нусхаланди',
    sourceLabel: 'Манба',
    openGuide: 'Батафсил',
  },
  ru: {
    heroBadge: 'Ханафитский фикх и адабы Сунны',
    heroTitle: 'Руководство для жизненных ситуаций',
    heroSub: 'Джаназа, посещение кладбища, истихара, акыка, исцеление, долги и сафар',
    backToHub: 'Разделы',
    stepsHeading: 'Пошаговый порядок действий',
    duasHeading: 'Читаемые дуа и зикры',
    notesHeading: 'Важные правила и адабы',
    copyBtn: 'Копировать',
    copiedBtn: 'Скопировано',
    sourceLabel: 'Источник',
    openGuide: 'Открыть',
  },
  en: {
    heroBadge: 'Hanafi Fiqh & Sunnah Etiquette',
    heroTitle: 'Real-Life Situations Guide',
    heroSub: 'Janazah, visiting graves, Istikharah, Aqiqah, healing, debt relief & travel',
    backToHub: 'Guides',
    stepsHeading: 'Step-by-Step Instructions',
    duasHeading: 'Authentic Duas & Recitations',
    notesHeading: 'Important Etiquette & Rulings',
    copyBtn: 'Copy',
    copiedBtn: 'Copied',
    sourceLabel: 'Source',
    openGuide: 'Open',
  },
};

function renderSituationIcon(id: LifeSituationGuide['id']) {
  switch (id) {
    case 'janazah':
      return <Users className="w-5 h-5" />;
    case 'cemetery':
      return <Landmark className="w-5 h-5" />;
    case 'istikharah':
      return <Sparkles className="w-5 h-5" />;
    case 'hojat_tavba':
      return <HandHeart className="w-5 h-5" />;
    case 'newborn':
      return <Baby className="w-5 h-5" />;
    case 'sick_visit':
      return <HeartPulse className="w-5 h-5" />;
    case 'debt_distress':
      return <ShieldAlert className="w-5 h-5" />;
    case 'travel':
      return <Compass className="w-5 h-5" />;
  }
}

export const LifeGuideTab: React.FC = () => {
  const { isDay } = useTheme();
  const { language } = useLanguage();
  const ui = UI_TEXT[language] || UI_TEXT.uz_lat;

  const [activeId, setActiveId] = useState<LifeSituationGuide['id'] | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!activeId) return;
    const onBack = (e: Event) => {
      e.preventDefault();
      setActiveId(null);
    };
    window.addEventListener('nq:android-back', onBack);
    return () => window.removeEventListener('nq:android-back', onBack);
  }, [activeId]);

  const activeGuide = useMemo(
    () => LIFE_SITUATION_GUIDES.find((g) => g.id === activeId) || null,
    [activeId]
  );

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text).catch(() => undefined);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 1800);
  };

  const cardCls = isDay
    ? 'rounded-2xl bg-white border border-[#dde3ea] shadow-xs'
    : 'rounded-2xl bg-slate-900/90 border border-emerald-900/60';
  const subTextCls = isDay ? 'text-slate-500' : 'text-slate-400';

  // ==================== DETAIL VIEW ====================
  if (activeGuide) {
    const loc = getLocalizedSituationGuide(activeGuide, language);

    return (
      <div className={`space-y-3.5 pb-6 animate-in fade-in ${isDay ? 'text-slate-900' : 'text-slate-100'}`}>
        {/* Top Bar */}
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setActiveId(null)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition ${
              isDay
                ? 'bg-white border-[#dde3ea] text-slate-700 hover:border-[#158509]'
                : 'bg-slate-900 border-emerald-900/60 text-slate-200'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{ui.backToHub}</span>
          </button>

          <span className="text-xs font-bold truncate">{loc.title}</span>

          <span
            className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold border shrink-0 ${
              isDay
                ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                : 'bg-emerald-950 border-emerald-800 text-amber-300'
            }`}
          >
            {loc.duas.length} duo
          </span>
        </div>

        {/* Hero Card */}
        <div
          className={`nq-keep-dark rounded-3xl p-4 text-white shadow-lg border space-y-2 ${
            isDay ? 'nq-hero-day border-[#0a4306]' : 'nq-hero-night border-emerald-800/60'
          }`}
        >
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/15 border border-[#fde68a]/40 text-[#fde68a] text-[10.5px] font-bold">
            {loc.badge}
          </span>
          <h1 className="text-lg font-extrabold text-white leading-snug">{loc.title}</h1>
          <p className="text-xs text-white/85 leading-snug">{loc.subtitle}</p>
        </div>

        {/* Step-by-Step Instructions */}
        <div className={`${cardCls} p-4 space-y-2.5`}>
          <h2
            className={`text-xs font-extrabold uppercase tracking-wider ${
              isDay ? 'text-[#0c4703]' : 'text-emerald-400'
            }`}
          >
            {ui.stepsHeading}
          </h2>
          <div className="space-y-2">
            {loc.steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <span
                  className={`w-5 h-5 rounded-lg text-[11px] font-mono font-extrabold flex items-center justify-center shrink-0 mt-0.5 border ${
                    isDay
                      ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                      : 'bg-emerald-950 border-emerald-800 text-amber-300'
                  }`}
                >
                  {idx + 1}
                </span>
                <p className="text-xs leading-relaxed flex-1">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Duas & Recitations */}
        <div className="space-y-2.5">
          <h2
            className={`text-xs font-extrabold uppercase tracking-wider px-1 ${
              isDay ? 'text-[#0c4703]' : 'text-emerald-400'
            }`}
          >
            {ui.duasHeading}
          </h2>

          {loc.duas.map((dua) => {
            const isCopied = copiedId === dua.id;
            return (
              <div key={dua.id} className={`${cardCls} p-4 space-y-2.5`}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xs font-extrabold leading-snug">{dua.label}</h3>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        dua.id,
                        `${dua.label}\n\n${dua.arabic}\n\n${dua.translit}\n\n${dua.meaning}\n(${dua.source})`
                      )
                    }
                    className={`px-2.5 py-1 rounded-xl text-[10.5px] font-bold border flex items-center gap-1 shrink-0 transition ${
                      isCopied
                        ? isDay
                          ? 'bg-[#158509] border-[#0c4703] text-white nq-keep-dark'
                          : 'bg-emerald-600 border-emerald-500 text-white'
                        : isDay
                        ? 'bg-slate-100 border-slate-200 text-slate-700 hover:border-[#158509]'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopied ? ui.copiedBtn : ui.copyBtn}</span>
                  </button>
                </div>

                {/* Arabic Script */}
                <div
                  dir="rtl"
                  className={`font-arabic text-2xl leading-loose text-right ${
                    isDay ? 'text-[#0c4703]' : 'text-amber-300'
                  }`}
                >
                  {dua.arabic}
                </div>

                {/* Phonetic Transliteration */}
                <div
                  className={`text-[13px] font-bold leading-snug rounded-xl px-3 py-2.5 border ${
                    isDay
                      ? 'bg-[#f4faef] border-[#d3eccb] text-[#0c4703]'
                      : 'bg-emerald-950/50 border-emerald-800/60 text-emerald-200'
                  }`}
                >
                  {dua.translit}
                </div>

                {/* Meaning */}
                <p className={`text-xs leading-relaxed ${subTextCls}`}>{dua.meaning}</p>

                {/* Source Citation Badge */}
                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10.5px] font-bold border ${
                      isDay
                        ? 'bg-slate-50 border-slate-200 text-slate-700'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300'
                    }`}
                  >
                    <BookOpen className="w-3 h-3 shrink-0" />
                    <span>
                      {ui.sourceLabel}: {dua.source}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Important Etiquette & Rulings */}
        {loc.notes.length > 0 && (
          <div
            className={`rounded-2xl p-3.5 border space-y-1.5 ${
              isDay
                ? 'bg-amber-50/90 border-amber-200 text-amber-950'
                : 'bg-amber-950/30 border-amber-800/60 text-amber-100'
            }`}
          >
            <h3 className="text-xs font-extrabold">{ui.notesHeading}</h3>
            {loc.notes.map((note, idx) => (
              <p key={idx} className="text-xs leading-relaxed opacity-90">
                • {note}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ==================== HUB OVERVIEW SCREEN ====================
  return (
    <div className={`space-y-3.5 pb-6 ${isDay ? 'text-slate-900' : 'text-slate-100'}`}>
      {/* Hero Banner */}
      <div
        className={`nq-keep-dark rounded-3xl p-4 text-white shadow-lg border space-y-2 ${
          isDay ? 'nq-hero-day border-[#0a4306]' : 'nq-hero-night border-emerald-800/60'
        }`}
      >
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 border border-[#fde68a]/40 text-[#fde68a] text-[11px] font-bold">
          <HandHeart className="w-3.5 h-3.5" />
          <span>{ui.heroBadge}</span>
        </div>
        <h1 className="text-lg font-extrabold tracking-tight text-white">{ui.heroTitle}</h1>
        <p className="text-xs text-white/80 leading-snug">{ui.heroSub}</p>
      </div>

      {/* 8 Situation Guides Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {LIFE_SITUATION_GUIDES.map((item) => {
          const loc = getLocalizedSituationGuide(item, language);
          const iconStyle =
            item.accent === 'emerald'
              ? isDay
                ? 'bg-[#eef9ea] text-[#158509] border-[#c5e8bc]'
                : 'bg-emerald-950 text-emerald-400 border-emerald-800/70'
              : item.accent === 'amber'
              ? isDay
                ? 'bg-amber-50 text-amber-600 border-amber-200'
                : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              : item.accent === 'sky'
              ? isDay
                ? 'bg-sky-50 text-sky-600 border-sky-200'
                : 'bg-sky-500/15 text-sky-300 border-sky-500/30'
              : item.accent === 'rose'
              ? isDay
                ? 'bg-rose-50 text-rose-600 border-rose-200'
                : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
              : item.accent === 'teal'
              ? isDay
                ? 'bg-teal-50 text-teal-600 border-teal-200'
                : 'bg-teal-500/15 text-teal-300 border-teal-500/30'
              : isDay
              ? 'bg-violet-50 text-violet-600 border-violet-200'
              : 'bg-violet-500/15 text-violet-300 border-violet-500/30';

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveId(item.id)}
              className={`${cardCls} p-3.5 text-left flex items-start gap-3 transition active:scale-[0.99] ${
                isDay ? 'hover:border-[#158509]' : 'hover:border-amber-400/70'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 mt-0.5 ${iconStyle}`}
              >
                {renderSituationIcon(item.id)}
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isDay
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {loc.badge}
                  </span>
                  <span
                    className={`text-[10.5px] font-bold shrink-0 ${
                      isDay ? 'text-[#158509]' : 'text-amber-300'
                    }`}
                  >
                    {ui.openGuide} →
                  </span>
                </div>

                <h3 className="text-[13.5px] font-extrabold leading-snug">{loc.title}</h3>
                <p className={`text-[11.5px] leading-snug line-clamp-2 ${subTextCls}`}>
                  {loc.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
