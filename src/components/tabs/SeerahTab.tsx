import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Compass,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { latinToCyrillicUz } from '../../utils/uzbekScript';
import { PROPHETS_25_LIST, SEERAH_CHAPTERS } from '../../data/seerahData';

type SeerahSection = 'seerah' | 'prophets';

export const SeerahTab: React.FC = () => {
  const { isDay } = useTheme();
  const { language } = useLanguage();

  const [section, setSection] = useState<SeerahSection>('seerah');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSeerahId, setExpandedSeerahId] = useState<string | null>(
    SEERAH_CHAPTERS[0]?.id || null
  );
  const [expandedProphetId, setExpandedProphetId] = useState<number | null>(1);

  const loc = useCallback(
    (text: string) => (language === 'uz_cyr' ? latinToCyrillicUz(text) : text),
    [language]
  );

  useEffect(() => {
    if (!searchQuery.trim() && section === 'seerah') return;
    const onBack = (e: Event) => {
      if (searchQuery.trim()) {
        e.preventDefault();
        setSearchQuery('');
        return;
      }
      if (section !== 'seerah') {
        e.preventDefault();
        setSection('seerah');
      }
    };
    window.addEventListener('nq:android-back', onBack);
    return () => window.removeEventListener('nq:android-back', onBack);
  }, [searchQuery, section]);

  const copy = useMemo(() => {
    if (language === 'ru') {
      return {
        badge: 'СИРА ПРОРОКА ﷺ · 25 ПРОРОКОВ',
        title: 'Сира и Истории Пророков',
        sub: 'Хронология жизни Пророка Мухаммада ﷺ и истории 25 пророков, упомянутых в Священном Коране',
        tabSeerah: 'Сира Пророка ﷺ (7)',
        tabProphets: '25 Пророков (25)',
        searchPh: 'Поиск пророка или события (Хиджра, Бадр, Юсуф, Муса...)',
        makkahBadge: 'Мекканский период',
        madinahBadge: 'Мединский период',
        eventsTitle: 'Ключевые события:',
        lessonTitle: 'Урок и мудрость (Ибрат):',
        sourceLabel: 'Источник:',
        quranLabel: 'Упоминание в Коране:',
        empty: 'Ничего не найдено',
      };
    }
    if (language === 'en') {
      return {
        badge: 'PROPHETIC SEERAH · 25 PROPHETS',
        title: 'Seerah & Stories of Prophets',
        sub: 'Chronological life of Prophet Muhammad ﷺ and stories of the 25 Prophets mentioned in the Holy Qur’an',
        tabSeerah: 'Seerah ﷺ (7)',
        tabProphets: '25 Prophets (25)',
        searchPh: 'Search prophet or event (Hijrah, Badr, Yusuf, Musa...)',
        makkahBadge: 'Makkan Period',
        madinahBadge: 'Madinan Period',
        eventsTitle: 'Key Historical Events:',
        lessonTitle: 'Moral & Wisdom:',
        sourceLabel: 'Source:',
        quranLabel: 'Qur’anic References:',
        empty: 'No matching entries found',
      };
    }
    if (language === 'uz_cyr') {
      return {
        badge: 'СИЙРАТИ НАБАВИЯ · 25 ПАЙҒАМБАР',
        title: 'Сийрат ва Пайғамбарлар Қиссаси',
        sub: 'Пайғамбаримиз Муҳаммад ﷺ ҳаёт йўллари ҳамда Қуръони Каримда зикр қилинган 25 пайғамбар тарихи',
        tabSeerah: 'Сийрат ﷺ (7)',
        tabProphets: '25 Пайғамбар (25)',
        searchPh: 'Қидирув: Ҳижрат, Бадр, Юсуф, Мусо, Иброҳим...',
        makkahBadge: 'Макка даври',
        madinahBadge: 'Мадина даври',
        eventsTitle: 'Муҳим воқеалар ва фактлар:',
        lessonTitle: 'Ибрат ва ҳикмат:',
        sourceLabel: 'Манба:',
        quranLabel: 'Қуръоний оятлар:',
        empty: 'Қидирув бўйича маълумот топилмади',
      };
    }
    return {
      badge: 'SIYRATI NABAVIYA · 25 PAYG\'AMBAR',
      title: "Siyrat va Payg'ambarlar Qissasi",
      sub: "Payg'ambarimiz Muhammad ﷺ hayot yo'llari hamda Qur'oni Karimda zikr qilingan 25 payg'ambar tarixi",
      tabSeerah: 'Siyrat ﷺ (7)',
      tabProphets: "25 Payg'ambar (25)",
      searchPh: 'Qidiruv: Hijrat, Badr, Yusuf, Muso, Ibrohim...',
      makkahBadge: 'Makka davri',
      madinahBadge: 'Madina davri',
      eventsTitle: 'Muhim voqealar va faktlar:',
      lessonTitle: 'Ibrat va hikmat:',
      sourceLabel: 'Manba:',
      quranLabel: "Qur'oniy oyatlar:",
      empty: "Qidiruv bo'yicha ma'lumot topilmadi",
    };
  }, [language]);

  const filteredSeerah = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return SEERAH_CHAPTERS;
    return SEERAH_CHAPTERS.filter((ch) => {
      const hayLat = `${ch.titleUz} ${ch.summaryUz} ${ch.keyEventsUz.join(' ')} ${ch.lessonUz}`.toLowerCase();
      const hayCyr = latinToCyrillicUz(hayLat).toLowerCase();
      return hayLat.includes(q) || hayCyr.includes(q);
    });
  }, [searchQuery]);

  const filteredProphets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return PROPHETS_25_LIST;
    return PROPHETS_25_LIST.filter((p) => {
      const hayLat = `${p.nameUz} ${p.titleBadgeUz} ${p.summaryUz} ${p.miraclesAndKeyFactsUz.join(' ')} ${p.moralUz}`.toLowerCase();
      const hayCyr = latinToCyrillicUz(hayLat).toLowerCase();
      return hayLat.includes(q) || hayCyr.includes(q);
    });
  }, [searchQuery]);

  return (
    <div className="space-y-3 pb-4">
      {/* Hero Banner */}
      <div
        className={`nq-keep-dark rounded-3xl p-4 border relative overflow-hidden space-y-2.5 ${
          isDay
            ? 'bg-gradient-to-br from-[#0b4a06] via-[#158509] to-[#1b9c21] border-[#0c5007] text-white shadow-md shadow-emerald-950/15'
            : 'bg-gradient-to-br from-[#07291F] via-[#0B3B1F] to-[#061813] border-emerald-800/60 text-white shadow-xl'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 border border-[#fde68a]/45 text-[#fde68a] text-[10px] font-extrabold tracking-wide mb-1.5">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>{copy.badge}</span>
            </div>
            <h2 className="font-display text-lg font-extrabold leading-tight text-white">
              {copy.title}
            </h2>
            <p className="text-xs text-white/85 leading-snug mt-0.5">{copy.sub}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-black/20 border border-white/20 flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5 text-[#fde68a]" />
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-white/75 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={copy.searchPh}
            className="w-full pl-9 pr-8 py-2 rounded-2xl bg-black/25 border border-white/20 text-xs text-white placeholder:text-white/65 focus:outline-none focus:border-[#fde68a]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-white/80 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2-Tab Switcher: Prophet's Seerah vs 25 Prophets */}
      <div
        className={`grid grid-cols-2 gap-1.5 p-1 rounded-2xl border ${
          isDay
            ? 'bg-white border-[#dde3ea] shadow-xs'
            : 'bg-slate-900 border-emerald-900/50'
        }`}
      >
        {(
          [
            { id: 'seerah', label: copy.tabSeerah },
            { id: 'prophets', label: copy.tabProphets },
          ] as const
        ).map((tab) => {
          const active = section === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSection(tab.id)}
              className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition ${
                active
                  ? isDay
                    ? 'bg-[#158509] text-white nq-keep-dark shadow-2xs'
                    : 'bg-amber-400 text-slate-950'
                  : isDay
                  ? 'text-slate-600 hover:text-[#0c4703]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ==================== SECTION 1: SEERAH TIMELINE ==================== */}
      {section === 'seerah' && (
        <div className="space-y-2.5">
          {filteredSeerah.length === 0 ? (
            <div
              className={`rounded-3xl border p-6 text-center text-xs font-bold ${
                isDay
                  ? 'bg-white border-[#dde3ea] text-slate-500'
                  : 'bg-slate-900 border-emerald-900/40 text-slate-400'
              }`}
            >
              {copy.empty}
            </div>
          ) : (
            filteredSeerah.map((ch) => {
              const isOpen = expandedSeerahId === ch.id;
              return (
                <div
                  key={ch.id}
                  className={`rounded-2xl border transition overflow-hidden ${
                    isDay
                      ? isOpen
                        ? 'bg-white border-[#158509] shadow-xs'
                        : 'bg-white border-[#cde5c7]'
                      : isOpen
                      ? 'bg-slate-900 border-amber-400/70 shadow-md'
                      : 'bg-slate-900/90 border-emerald-800/55'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedSeerahId(isOpen ? null : ch.id)}
                    className="w-full text-left p-3.5 flex items-start justify-between gap-2.5"
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${
                            ch.period === 'makkah'
                              ? isDay
                                ? 'bg-amber-50 border-amber-200 text-amber-800'
                                : 'bg-amber-950/60 border-amber-800 text-amber-300'
                              : isDay
                              ? 'bg-[#eef9ea] border-[#b7e2ad] text-[#158509]'
                              : 'bg-emerald-950 border-emerald-800 text-emerald-300'
                          }`}
                        >
                          {ch.period === 'makkah' ? copy.makkahBadge : copy.madinahBadge}
                        </span>
                        <span
                          className={`text-[10.5px] font-mono font-bold ${
                            isDay ? 'text-slate-500' : 'text-slate-400'
                          }`}
                        >
                          {loc(ch.yearLabel)}
                        </span>
                      </div>

                      <h3
                        className={`text-[13.5px] font-extrabold leading-snug ${
                          isDay ? 'text-[#0c4703]' : 'text-white'
                        }`}
                      >
                        {loc(ch.titleUz)}
                      </h3>

                      {!isOpen && (
                        <p
                          className={`text-xs line-clamp-2 leading-relaxed ${
                            isDay ? 'text-slate-600' : 'text-slate-300'
                          }`}
                        >
                          {loc(ch.summaryUz)}
                        </p>
                      )}
                    </div>

                    <ChevronDown
                      className={`w-4 h-4 shrink-0 mt-1 transition-transform ${
                        isOpen ? 'rotate-180 text-[#158509]' : 'text-slate-400'
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div
                      className={`px-3.5 pb-3.5 pt-1 space-y-3 border-t ${
                        isDay ? 'border-slate-100' : 'border-emerald-900/40'
                      }`}
                    >
                      <p
                        className={`text-xs font-semibold leading-relaxed ${
                          isDay ? 'text-slate-700' : 'text-slate-200'
                        }`}
                      >
                        {loc(ch.summaryUz)}
                      </p>

                      <div className="space-y-1.5">
                        <div
                          className={`text-[10.5px] font-extrabold uppercase tracking-wider ${
                            isDay ? 'text-[#158509]' : 'text-amber-300'
                          }`}
                        >
                          {copy.eventsTitle}
                        </div>
                        {ch.keyEventsUz.map((ev, i) => (
                          <div
                            key={i}
                            className={`flex items-start gap-2 text-xs leading-relaxed ${
                              isDay ? 'text-slate-700' : 'text-slate-200'
                            }`}
                          >
                            <CheckCircle2
                              className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                                isDay ? 'text-[#158509]' : 'text-amber-400'
                              }`}
                            />
                            <span>{loc(ev)}</span>
                          </div>
                        ))}
                      </div>

                      <div
                        className={`rounded-xl border-l-4 px-3 py-2.5 space-y-0.5 ${
                          isDay
                            ? 'bg-[#f4fbf2] border-l-[#158509]'
                            : 'bg-emerald-950/45 border-l-amber-400'
                        }`}
                      >
                        <div
                          className={`text-[10px] font-extrabold uppercase tracking-wider ${
                            isDay ? 'text-[#158509]' : 'text-amber-300'
                          }`}
                        >
                          {copy.lessonTitle}
                        </div>
                        <p
                          className={`text-xs font-bold leading-relaxed ${
                            isDay ? 'text-[#0c4703]' : 'text-emerald-100'
                          }`}
                        >
                          {loc(ch.lessonUz)}
                        </p>
                      </div>

                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border ${
                          isDay
                            ? 'bg-slate-50 border-slate-200 text-slate-600'
                            : 'bg-slate-950 border-emerald-900/60 text-amber-300'
                        }`}
                      >
                        <BookOpen className="w-3.5 h-3.5 text-[#158509]" />
                        <span>
                          {copy.sourceLabel} {loc(ch.sourceUz)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ==================== SECTION 2: 25 PROPHETS ==================== */}
      {section === 'prophets' && (
        <div className="space-y-2.5">
          {filteredProphets.length === 0 ? (
            <div
              className={`rounded-3xl border p-6 text-center text-xs font-bold ${
                isDay
                  ? 'bg-white border-[#dde3ea] text-slate-500'
                  : 'bg-slate-900 border-emerald-900/40 text-slate-400'
              }`}
            >
              {copy.empty}
            </div>
          ) : (
            filteredProphets.map((p) => {
              const isOpen = expandedProphetId === p.id;
              return (
                <div
                  key={p.id}
                  className={`rounded-2xl border transition overflow-hidden ${
                    isDay
                      ? isOpen
                        ? 'bg-white border-[#158509] shadow-xs'
                        : 'bg-white border-[#cde5c7]'
                      : isOpen
                      ? 'bg-slate-900 border-amber-400/70 shadow-md'
                      : 'bg-slate-900/90 border-emerald-800/55'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedProphetId(isOpen ? null : p.id)}
                    className="w-full text-left p-3.5 flex items-start justify-between gap-2.5"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${
                            isDay
                              ? 'bg-[#eef9ea] border-[#b7e2ad] text-[#158509]'
                              : 'bg-emerald-950 border-emerald-800 text-amber-300'
                          }`}
                        >
                          {loc(p.titleBadgeUz)}
                        </span>
                        <span
                          className={`font-arabic text-sm font-bold ${
                            isDay ? 'text-[#0c4703]' : 'text-amber-300'
                          }`}
                        >
                          {p.arabicName}
                        </span>
                      </div>

                      <h3
                        className={`text-[13.5px] font-extrabold leading-snug ${
                          isDay ? 'text-[#0c4703]' : 'text-white'
                        }`}
                      >
                        {loc(p.nameUz)}
                      </h3>

                      {!isOpen && (
                        <p
                          className={`text-xs line-clamp-2 leading-relaxed ${
                            isDay ? 'text-slate-600' : 'text-slate-300'
                          }`}
                        >
                          {loc(p.summaryUz)}
                        </p>
                      )}
                    </div>

                    <ChevronDown
                      className={`w-4 h-4 shrink-0 mt-1 transition-transform ${
                        isOpen ? 'rotate-180 text-[#158509]' : 'text-slate-400'
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div
                      className={`px-3.5 pb-3.5 pt-1 space-y-3 border-t ${
                        isDay ? 'border-slate-100' : 'border-emerald-900/40'
                      }`}
                    >
                      <p
                        className={`text-xs font-semibold leading-relaxed ${
                          isDay ? 'text-slate-700' : 'text-slate-200'
                        }`}
                      >
                        {loc(p.summaryUz)}
                      </p>

                      <div className="space-y-1.5">
                        {p.miraclesAndKeyFactsUz.map((fact, i) => (
                          <div
                            key={i}
                            className={`flex items-start gap-2 text-xs leading-relaxed ${
                              isDay ? 'text-slate-700' : 'text-slate-200'
                            }`}
                          >
                            <CheckCircle2
                              className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                                isDay ? 'text-[#158509]' : 'text-amber-400'
                              }`}
                            />
                            <span>{loc(fact)}</span>
                          </div>
                        ))}
                      </div>

                      <div
                        className={`rounded-xl border-l-4 px-3 py-2.5 space-y-0.5 ${
                          isDay
                            ? 'bg-[#f4fbf2] border-l-[#158509]'
                            : 'bg-emerald-950/45 border-l-amber-400'
                        }`}
                      >
                        <div
                          className={`text-[10px] font-extrabold uppercase tracking-wider ${
                            isDay ? 'text-[#158509]' : 'text-amber-300'
                          }`}
                        >
                          {copy.lessonTitle}
                        </div>
                        <p
                          className={`text-xs font-bold leading-relaxed ${
                            isDay ? 'text-[#0c4703]' : 'text-emerald-100'
                          }`}
                        >
                          {loc(p.moralUz)}
                        </p>
                      </div>

                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border ${
                          isDay
                            ? 'bg-slate-50 border-slate-200 text-slate-600'
                            : 'bg-slate-950 border-emerald-900/60 text-amber-300'
                        }`}
                      >
                        <BookOpen className="w-3.5 h-3.5 text-[#158509]" />
                        <span>
                          {copy.quranLabel} {loc(p.quranRefsUz)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
