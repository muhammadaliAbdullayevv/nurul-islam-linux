import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BookOpenCheck,
  CheckCircle2,
  ChevronDown,
  Scale,
  Search,
  Share2,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { latinToCyrillicUz } from '../../utils/uzbekScript';
import {
  FIQH_CATEGORIES,
  FIQH_QA_LIST,
  FiqhCategory,
  FiqhQAItem,
  FiqhRulingTone,
} from '../../data/fiqhData';

export const FiqhTab: React.FC = () => {
  const { isDay } = useTheme();
  const { language } = useLanguage();

  const [selectedCat, setSelectedCat] = useState<'all' | FiqhCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(FIQH_QA_LIST[0]?.id || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loc = useCallback(
    (text: string) => (language === 'uz_cyr' ? latinToCyrillicUz(text) : text),
    [language]
  );

  // Intercept Android back if a search filter is active
  useEffect(() => {
    if (!searchQuery.trim() && selectedCat === 'all') return;
    const onBack = (e: Event) => {
      if (searchQuery.trim()) {
        e.preventDefault();
        setSearchQuery('');
        return;
      }
      if (selectedCat !== 'all') {
        e.preventDefault();
        setSelectedCat('all');
      }
    };
    window.addEventListener('nq:android-back', onBack);
    return () => window.removeEventListener('nq:android-back', onBack);
  }, [searchQuery, selectedCat]);

  const copy = useMemo(() => {
    if (language === 'ru') {
      return {
        badge: 'ХАНАФИТСКИЙ ФИКХ · ИСТОЧНИКИ',
        title: 'Вопросы и Ответы (Фикх)',
        sub: 'Достоверные ответы на ежедневные вопросы о тахарате, намазе, посте и закяте по мазхабу Абу Ханифы',
        searchPh: 'Поиск: сажда сахв, махси, укол, кровь...',
        sourceLabel: 'Источник:',
        detailsLabel: 'Подробные правила и условия:',
        share: 'Поделиться ответом',
        copied: 'Скопировано ✓',
        empty: 'По вашему запросу ничего не найдено',
      };
    }
    if (language === 'en') {
      return {
        badge: 'AUTHENTIC HANAFI FIQH',
        title: 'Everyday Fiqh Q&A',
        sub: 'Verified Hanafi rulings on Wudu, Prayer, Sajdah Sahw, Masbuq, Fasting, and Zakat',
        searchPh: 'Search: sajdah sahw, socks, blood, fast...',
        sourceLabel: 'Source:',
        detailsLabel: 'Detailed Ruling & Conditions:',
        share: 'Share Answer',
        copied: 'Copied ✓',
        empty: 'No matching question found',
      };
    }
    if (language === 'uz_cyr') {
      return {
        badge: 'ҲАНАФИЙ ФИҚҲИ · ИШОНЧЛИ МАНБА',
        title: 'Кунлик Савол-Жавоблар',
        sub: 'Таҳорат, намоз, саждаи саҳв, масбуқ, рўза ва закот бўйича энг кўп сўраладиган масалалар',
        searchPh: 'Қидирув: саждаи саҳв, маҳси, қон, укол...',
        sourceLabel: 'Манба:',
        detailsLabel: 'Батафсил ҳукм ва шартлар:',
        share: 'Улашиш',
        copied: 'Нусхаланди ✓',
        empty: 'Қидирув бўйича савол топилмади',
      };
    }
    return {
      badge: 'HANAFIY FIQHI · ISHONCHLI MANBA',
      title: 'Kunlik Savol-Javoblar',
      sub: "Tahorat, namoz, sajdai sahv, masbuq, ro'za va zakot bo'yicha eng ko'p so'raladigan masalalar",
      searchPh: 'Qidiruv: sajdai sahv, mahsi, qon, ukol...',
      sourceLabel: 'Manba:',
      detailsLabel: 'Batafsil hukm va shartlar:',
      share: 'Ulashish',
      copied: 'Nusxalandi ✓',
      empty: "Qidiruv bo'yicha savol topilmadi",
    };
  }, [language]);

  const filteredList = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return FIQH_QA_LIST.filter((item) => {
      if (selectedCat !== 'all' && item.category !== selectedCat) return false;
      if (!q) return true;
      const haystackLat = `${item.question} ${item.shortAnswer} ${item.details.join(' ')} ${item.tags.join(' ')}`.toLowerCase();
      const haystackCyr = latinToCyrillicUz(haystackLat).toLowerCase();
      return haystackLat.includes(q) || haystackCyr.includes(q);
    });
  }, [searchQuery, selectedCat]);

  const getToneStyle = (tone: FiqhRulingTone) => {
    switch (tone) {
      case 'valid':
        return isDay
          ? 'bg-[#eef9ea] text-[#158509] border-[#b7e2ad]'
          : 'bg-emerald-950 text-emerald-300 border-emerald-700/70';
      case 'breaks':
        return isDay
          ? 'bg-rose-50 text-rose-700 border-rose-200'
          : 'bg-rose-950/70 text-rose-300 border-rose-800/70';
      case 'wajib':
        return isDay
          ? 'bg-amber-50 text-amber-800 border-amber-200'
          : 'bg-amber-950/70 text-amber-300 border-amber-700/70';
      case 'sunnah':
        return isDay
          ? 'bg-sky-50 text-sky-800 border-sky-200'
          : 'bg-sky-950/70 text-sky-300 border-sky-800/70';
      default:
        return isDay
          ? 'bg-slate-100 text-slate-700 border-slate-200'
          : 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const handleShare = (item: FiqhQAItem) => {
    const text = `⚖️ ${loc(item.question)}\n\n✅ ${loc(item.shortAnswer)}\n\n${item.details
      .map((d) => `• ${loc(d)}`)
      .join('\n')}\n\n📚 ${copy.sourceLabel} ${loc(item.source)}`;
    if (navigator.share) {
      navigator.share({ title: loc(item.question), text }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text).catch(() => {});
      setCopiedId(item.id);
      window.setTimeout(() => setCopiedId(null), 1800);
    }
  };

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
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>{copy.badge}</span>
            </div>
            <h2 className="font-display text-lg font-extrabold leading-tight text-white">
              {copy.title}
            </h2>
            <p className="text-xs text-white/85 leading-snug mt-0.5">{copy.sub}</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-black/20 border border-white/20 flex items-center justify-center shrink-0">
            <Scale className="w-5 h-5 text-[#fde68a]" />
          </div>
        </div>

        {/* Instant Search Input */}
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

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
        {FIQH_CATEGORIES.map((cat) => {
          const active = selectedCat === cat.id;
          const label =
            language === 'ru'
              ? cat.labelRu
              : language === 'en'
              ? cat.labelEn
              : loc(cat.labelUz);
          const count =
            cat.id === 'all'
              ? FIQH_QA_LIST.length
              : FIQH_QA_LIST.filter((q) => q.category === cat.id).length;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCat(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap border transition flex items-center gap-1.5 shrink-0 ${
                active
                  ? isDay
                    ? 'bg-[#158509] border-[#158509] text-white nq-keep-dark shadow-2xs'
                    : 'bg-amber-400 border-amber-400 text-slate-950'
                  : isDay
                  ? 'bg-white border-[#dde3ea] text-slate-700 hover:border-[#158509]/50'
                  : 'bg-slate-900 border-emerald-900/50 text-slate-300'
              }`}
            >
              <span>{label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  active
                    ? isDay
                      ? 'bg-white/25 text-white'
                      : 'bg-slate-950/20 text-slate-950'
                    : isDay
                    ? 'bg-slate-100 text-slate-500'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Q&A Accordion Cards */}
      {filteredList.length === 0 ? (
        <div
          className={`rounded-3xl border p-6 text-center space-y-2 ${
            isDay
              ? 'bg-white border-[#dde3ea] text-slate-600'
              : 'bg-slate-900/85 border-emerald-900/40 text-slate-300'
          }`}
        >
          <p className="text-xs font-bold">{copy.empty}</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredList.map((item) => {
            const isOpen = expandedId === item.id;
            return (
              <div
                key={item.id}
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
                  onClick={() => setExpandedId(isOpen ? null : item.id)}
                  className="w-full text-left p-3.5 flex items-start justify-between gap-2.5"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-extrabold ${getToneStyle(
                        item.rulingTone
                      )}`}
                    >
                      {loc(item.rulingBadge)}
                    </span>
                    <h3
                      className={`text-[13.5px] font-extrabold leading-snug ${
                        isDay ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      {loc(item.question)}
                    </h3>
                    {!isOpen && (
                      <p
                        className={`text-xs line-clamp-2 leading-relaxed ${
                          isDay ? 'text-slate-600' : 'text-slate-300'
                        }`}
                      >
                        {loc(item.shortAnswer)}
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
                    {/* Short Direct Ruling Box */}
                    <div
                      className={`rounded-xl border-l-4 px-3 py-2.5 text-xs font-bold leading-relaxed ${
                        isDay
                          ? 'bg-[#f4fbf2] border-l-[#158509] text-[#0c4703]'
                          : 'bg-emerald-950/50 border-l-amber-400 text-emerald-100'
                      }`}
                    >
                      {loc(item.shortAnswer)}
                    </div>

                    {/* Step-by-step conditions */}
                    <div className="space-y-1.5">
                      <div
                        className={`text-[10.5px] font-extrabold uppercase tracking-wider ${
                          isDay ? 'text-slate-500' : 'text-amber-300/90'
                        }`}
                      >
                        {copy.detailsLabel}
                      </div>
                      {item.details.map((step, idx) => (
                        <div
                          key={idx}
                          className={`flex items-start gap-2 text-xs leading-relaxed ${
                            isDay ? 'text-slate-700' : 'text-slate-200'
                          }`}
                        >
                          <CheckCircle2
                            className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                              isDay ? 'text-[#158509]' : 'text-amber-400'
                            }`}
                          />
                          <span>{loc(step)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Footer: Classical Source + Share Button */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border min-w-0 ${
                          isDay
                            ? 'bg-slate-50 border-slate-200 text-slate-700'
                            : 'bg-slate-950 border-emerald-800/60 text-amber-300'
                        }`}
                      >
                        <BookOpenCheck className="w-3.5 h-3.5 shrink-0 text-[#158509]" />
                        <span className="truncate">
                          {copy.sourceLabel} {loc(item.source)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleShare(item)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border inline-flex items-center gap-1 shrink-0 transition active:scale-95 ${
                          isDay
                            ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                            : 'bg-emerald-950 border-emerald-800 text-emerald-300'
                        }`}
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>{copiedId === item.id ? copy.copied : copy.share}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
