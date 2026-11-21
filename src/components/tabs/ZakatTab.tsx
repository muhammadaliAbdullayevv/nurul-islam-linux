import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

export const ZakatTab: React.FC = () => {
  const { isDay } = useTheme();
  const { t } = useLanguage();
  const [cash, setCash] = useState<string>('5000');
  const [goldGrams, setGoldGrams] = useState<string>('0');
  const [goldPricePerGram, setGoldPricePerGram] = useState<string>('75');
  const [investments, setInvestments] = useState<string>('0');
  const [debts, setDebts] = useState<string>('0');

  const cashVal = parseFloat(cash) || 0;
  const goldVal = (parseFloat(goldGrams) || 0) * (parseFloat(goldPricePerGram) || 75);
  const investVal = parseFloat(investments) || 0;
  const debtVal = parseFloat(debts) || 0;

  const totalAssets = cashVal + goldVal + investVal;
  const netZakatable = Math.max(0, totalAssets - debtVal);

  const nisabGoldThreshold = 85 * (parseFloat(goldPricePerGram) || 75);
  const isEligible = netZakatable >= nisabGoldThreshold;
  const zakatDue = isEligible ? netZakatable * 0.025 : 0;

  const labelCls = `block font-semibold mb-1 ${isDay ? 'text-slate-700' : 'text-slate-300'}`;
  const inputCls = isDay
    ? 'w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono focus:outline-none focus:border-[#158509]'
    : 'w-full bg-slate-950 border border-emerald-800/80 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-amber-400';

  return (
    <div className={`space-y-4 pb-8 ${isDay ? 'text-slate-900' : 'text-slate-100'}`}>
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight flex items-center gap-2 ${isDay ? 'text-slate-900' : 'text-white'}`}>
            {t.zakat.title}
          </h1>
          <p className={`text-xs font-medium ${isDay ? 'text-[#158509]' : 'text-emerald-400'}`}>
            {t.zakat.subtitle}
          </p>
        </div>
      </div>

      {/* Result Card */}
      <div
        className={`p-5 rounded-3xl border shadow-lg text-center space-y-2 ${
          isDay
            ? 'nq-hero-day border-[#0a4306] text-white'
            : 'bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 border-emerald-700/60 text-white'
        }`}
      >
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border inline-block ${
            isDay
              ? 'text-[#d0f39f] bg-white/12 border-white/20'
              : 'text-amber-300 bg-emerald-900/60 border-emerald-700/40'
          }`}
        >
          {isEligible ? t.zakat.obligatoryBadge : t.zakat.belowNisabBadge}
        </span>

        <p className="text-xs text-white/85">{t.zakat.totalDueLabel}</p>
        <h2 className={`text-4xl font-black font-mono drop-shadow ${isDay ? 'text-[#fde68a]' : 'text-amber-400'}`}>
          ${zakatDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h2>

        <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs text-white/90">
          <span>
            {t.zakat.netZakatableLabel}: <b>${netZakatable.toLocaleString()}</b>
          </span>
          <span>
            {t.zakat.nisabLevelLabel}: <b>${nisabGoldThreshold.toLocaleString()}</b>
          </span>
        </div>
      </div>

      {/* Inputs Form */}
      <div
        className={`space-y-3 p-4 rounded-3xl border text-xs ${
          isDay
            ? 'bg-white border-[#dde3ea] shadow-xs'
            : 'bg-slate-900/80 border-emerald-900/40'
        }`}
      >
        <div>
          <label className={labelCls}>{t.zakat.cashLabel}</label>
          <input
            type="number"
            value={cash}
            onChange={(e) => setCash(e.target.value)}
            className={inputCls}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={labelCls}>{t.zakat.goldOwnedLabel}</label>
            <input
              type="number"
              value={goldGrams}
              onChange={(e) => setGoldGrams(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>{t.zakat.goldPriceLabel}</label>
            <input
              type="number"
              value={goldPricePerGram}
              onChange={(e) => setGoldPricePerGram(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>{t.zakat.investmentsLabel}</label>
          <input
            type="number"
            value={investments}
            onChange={(e) => setInvestments(e.target.value)}
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>{t.zakat.debtsLabel}</label>
          <input
            type="number"
            value={debts}
            onChange={(e) => setDebts(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>
    </div>
  );
};
