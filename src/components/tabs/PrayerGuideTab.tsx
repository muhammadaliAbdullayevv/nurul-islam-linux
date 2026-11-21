import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Droplets,
  Sparkles,
  User,
  AlertCircle,
  AlertTriangle,
  Maximize2,
  Volume2,
  Square,
  ShieldAlert,
  Layers,
} from 'lucide-react';
import { WuduNamozGuideIcon } from '../icons/IslamicFeatureIcons';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  FULL_QAADA_DUAS,
  PRAYER_POSTURE_STEPS,
  PRAYER_RAKATS,
  PostureKey,
  QIYAM_RECITATIONS,
  WHAT_BREAKS_WUDU,
  WUDU_STEPS,
  pickLoc,
} from '../../data/prayerGuideData';

const WuduStepDiagramSvg: React.FC<{ stepId: string; isDay: boolean }> = ({ stepId, isDay }) => {
  const stroke = isDay ? '#0c4703' : '#d1fae5';
  const accent = isDay ? '#158509' : '#fbbf24';
  const water = isDay ? '#0ea5e9' : '#38bdf8';
  const fillSoft = isDay ? '#eef9ea' : '#064e3b';

  return (
    <svg viewBox="0 0 120 76" className="w-24 h-16 shrink-0" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="116" height="72" rx="14" fill={fillSoft} stroke={accent} strokeOpacity="0.35" strokeWidth="1.5" />

      {stepId === 'niyyah' && (
        <g stroke={stroke} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M60 16c6 9 10 14 10 20a10 10 0 0 1-20 0c0-6 4-11 10-20z" fill={water} fillOpacity="0.25" stroke={water} />
          <path d="M36 52c6 6 15 8 24 8s18-2 24-8" stroke={accent} />
        </g>
      )}

      {stepId === 'hands' && (
        <g stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M34 56V32c0-2 3-2 3 0v14m0-14V24c0-2 4-2 4 0v18m0-18V22c0-2 4-2 4 0v20m0-18v-2c0-2 4-2 4 0v22l4-6c1-2 4 0 3 2l-6 14H36z" fill={fillSoft} />
          <path d="M72 24l6 8M82 22l4 10" stroke={water} />
          <circle cx="76" cy="46" r="4" fill={water} stroke="none" />
          <circle cx="86" cy="42" r="3" fill={water} stroke="none" />
        </g>
      )}

      {stepId === 'mouth' && (
        <g stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="52" cy="36" r="18" />
          <path d="M44 43c4 3 12 3 16 0" stroke={accent} />
          <path d="M76 48c5-4 8-8 12-8" stroke={water} strokeWidth="3" />
          <circle cx="72" cy="43" r="3" fill={water} stroke="none" />
        </g>
      )}

      {stepId === 'nose' && (
        <g stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M56 18l-8 24h13" />
          <circle cx="67" cy="46" r="3.5" fill={water} stroke="none" />
          <circle cx="76" cy="52" r="2.5" fill={water} stroke="none" />
          <path d="M72 34c5 2 9 6 12 10" stroke={water} />
        </g>
      )}

      {stepId === 'face' && (
        <g stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="60" cy="38" rx="17" ry="22" fill={water} fillOpacity="0.18" stroke={accent} />
          <path d="M51 33h4M65 33h4M55 46c3 2 7 2 10 0" />
          <path d="M36 22v32M84 22v32" stroke={water} strokeDasharray="3 3" />
        </g>
      )}

      {stepId === 'arms' && (
        <g stroke={stroke} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M26 48l28-4 28-14" stroke={accent} strokeWidth="7" strokeOpacity="0.3" />
          <path d="M26 48l28-4 28-14" />
          <circle cx="54" cy="44" r="4.5" fill={accent} stroke="none" />
          <path d="M84 26l8-4" stroke={water} />
        </g>
      )}

      {stepId === 'head' && (
        <g stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="60" cy="41" r="17" />
          <path d="M41 34c4-13 34-13 38 0" stroke={accent} strokeWidth="4" />
          <path d="M46 18h28" stroke={water} strokeDasharray="3 2" />
        </g>
      )}

      {stepId === 'feet' && (
        <g stroke={stroke} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M44 18v26c0 6-6 9-12 9h-2c-3 0-4 5 1 6h54c4 0 5-5 1-6l-24-8V18" fill={water} fillOpacity="0.16" />
          <circle cx="44" cy="43" r="4" fill={accent} stroke="none" />
          <path d="M38 28h28" stroke={accent} strokeDasharray="3 2" />
        </g>
      )}

      {stepId === 'dua' && (
        <g stroke={stroke} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M42 54c-4-8-2-18 4-22l6 14" stroke={accent} />
          <path d="M78 54c4-8 2-18-4-22l-6 14" stroke={accent} />
          <path d="M60 16v8M52 20l4 5M68 20l-4 5" stroke={water} />
        </g>
      )}
    </svg>
  );
};

const PostureDiagramSvg: React.FC<{ posture: PostureKey; gender: 'male' | 'female'; isDay: boolean }> = ({
  posture,
  gender,
  isDay,
}) => {
  const accent = isDay ? '#158509' : '#fbbf24';
  const bodyStroke = isDay ? '#0c4703' : '#d1fae5';
  const softFill = isDay ? '#eef9ea' : '#064e3b';
  const matColor = isDay ? '#b9e3ab' : '#10b981';

  return (
    <svg viewBox="0 0 180 120" className="w-full max-w-[180px] h-24 mx-auto" fill="none" aria-hidden="true">
      <line x1="20" y1="106" x2="160" y2="106" stroke={matColor} strokeWidth="3.5" strokeLinecap="round" />

      {posture === 'takbir' && (
        <g stroke={bodyStroke} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="90" cy="22" r="9" fill={softFill} />
          {gender === 'female' && <path d="M81 21c2-8 16-8 18 0v13H81z" fill={softFill} strokeWidth="2.2" />}
          <path d="M90 32v34" />
          {gender === 'male' ? (
            <>
              <path d="M90 39L68 41 66 23" stroke={accent} />
              <path d="M90 39l22 2 2-18" stroke={accent} />
            </>
          ) : (
            <>
              <path d="M90 39L72 44 72 31" stroke={accent} />
              <path d="M90 39l18 5V31" stroke={accent} />
            </>
          )}
          <path d="M90 66l-8 38M90 66l8 38" />
        </g>
      )}

      {posture === 'qiyam' && (
        <g stroke={bodyStroke} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="90" cy="22" r="9" fill={softFill} />
          {gender === 'female' && <path d="M81 21c2-8 16-8 18 0v14H81z" fill={softFill} strokeWidth="2.2" />}
          <path d="M90 32v34" />
          {gender === 'male' ? (
            <path d="M90 38l-11 13 11 3M90 38l11 13-11 3" stroke={accent} />
          ) : (
            <path d="M90 38l-10 7 10 2M90 38l10 7-10 2" stroke={accent} />
          )}
          <path d="M90 66l-7 38M90 66l7 38" />
        </g>
      )}

      {posture === 'ruku' && (
        <g stroke={bodyStroke} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <circle cx={gender === 'male' ? 124 : 118} cy={gender === 'male' ? 50 : 42} r="8.5" fill={softFill} />
          <path d={gender === 'male' ? 'M70 50h44' : 'M74 56l35-10'} stroke={accent} />
          <path d={gender === 'male' ? 'M98 50l-8 26' : 'M98 49l-12 26'} stroke={accent} />
          <path d={gender === 'male' ? 'M70 50l4 54' : 'M74 56l4 48'} />
          <path d={gender === 'male' ? 'M76 50l4 54' : 'M80 56l4 48'} />
        </g>
      )}

      {posture === 'qawmah' && (
        <g stroke={bodyStroke} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="90" cy="22" r="9" fill={softFill} />
          <path d="M90 32v34" />
          <path d="M90 38l-11 22M90 38l11 22" stroke={accent} />
          <path d="M90 66l-7 38M90 66l7 38" />
        </g>
      )}

      {posture === 'sujud' && (
        <g stroke={bodyStroke} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M40 104h20l-4-22" />
          <path d={gender === 'male' ? 'M56 82l50-2 22 22' : 'M56 90l46 2 24 10'} stroke={accent} />
          <circle cx="132" cy="96" r="8" fill={softFill} />
          <path d={gender === 'male' ? 'M102 82l6 22h12' : 'M100 92l6 12h14'} stroke={bodyStroke} />
        </g>
      )}

      {(posture === 'jalsa' || posture === 'qada') && (
        <g stroke={bodyStroke} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="78" cy="36" r="9" fill={softFill} />
          {gender === 'female' && <path d="M69 35c2-8 16-8 18 0v13H69z" fill={softFill} strokeWidth="2.2" />}
          <path d="M78 46v40" />
          <path d="M78 86h36v18H60" />
          <path d="M78 56l18 20h16" stroke={accent} />
          {posture === 'qada' && <path d="M112 76l6-7" stroke={accent} strokeWidth="3" />}
        </g>
      )}
    </svg>
  );
};

export const PrayerGuideTab: React.FC = () => {
  const { isDay } = useTheme();
  const { language } = useLanguage();
  const [section, setSection] = useState<'wudu' | 'prayer'>('wudu');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [fardOnlyFilter, setFardOnlyFilter] = useState(false);
  const [matMode, setMatMode] = useState(false);

  const [selectedRakatId, setSelectedRakatId] = useState<'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'>('fajr');
  const [selectedQiyamTab, setSelectedQiyamTab] = useState<'sano' | 'fatiha' | 'ikhlas' | 'kawthar'>('sano');
  const [selectedQadaTab, setSelectedQadaTab] = useState<'tahiyyat' | 'salawat' | 'robbana' | 'qunut'>('tahiyyat');

  // Audio player state for Qiyam beginner Surahs (sequential ayahs via Alafasy CDN)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playSessionRef = useRef<number>(0);
  const [playingSurahId, setPlayingSurahId] = useState<string | null>(null);
  const [playingAyahInfo, setPlayingAyahInfo] = useState<{ current: number; total: number } | null>(null);

  const stepRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const stopAudio = useCallback(() => {
    playSessionRef.current += 1;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current = null;
    }
    setPlayingSurahId(null);
    setPlayingAyahInfo(null);
  }, []);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  // Keep screen awake when Joynamoz (Prayer Mat Big Text) mode is toggled on
  useEffect(() => {
    let sentinel: { release?: () => Promise<void> } | null = null;
    let cancelled = false;
    const navWithLock = navigator as Navigator & {
      wakeLock?: { request: (type: 'screen') => Promise<{ release?: () => Promise<void> }> };
    };
    if (matMode && navWithLock.wakeLock) {
      navWithLock.wakeLock
        .request('screen')
        .then((lock) => {
          if (cancelled) {
            lock.release?.().catch(() => undefined);
          } else {
            sentinel = lock;
          }
        })
        .catch(() => undefined);
    }
    return () => {
      cancelled = true;
      sentinel?.release?.().catch(() => undefined);
    };
  }, [matMode]);

  const playSurahAudio = (recId: string, surahNumber: number, ayahCount: number) => {
    if (playingSurahId === recId) {
      stopAudio();
      return;
    }
    stopAudio();
    const sessionId = ++playSessionRef.current;
    setPlayingSurahId(recId);

    const playAyahIndex = (ayahIdx: number) => {
      if (playSessionRef.current !== sessionId || ayahIdx > ayahCount) {
        if (playSessionRef.current === sessionId) stopAudio();
        return;
      }
      setPlayingAyahInfo({ current: ayahIdx, total: ayahCount });
      const sNum = String(surahNumber).padStart(3, '0');
      const aNum = String(ayahIdx).padStart(3, '0');
      const url = `https://everyayah.com/data/Alafasy_128kbps/${sNum}${aNum}.mp3`;
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        if (playSessionRef.current === sessionId) {
          playAyahIndex(ayahIdx + 1);
        }
      };
      audio.onerror = () => {
        if (playSessionRef.current === sessionId) {
          stopAudio();
        }
      };
      audio.play().catch(() => {
        if (playSessionRef.current === sessionId) stopAudio();
      });
    };

    playAyahIndex(1);
  };

  const scrollToStep = (key: string) => {
    const el = stepRefs.current[key];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const ui = {
    uz_lat: {
      wuduTab: 'Tahorat (9 qadam)',
      prayerTab: 'Namoz tartibi',
      male: 'Erkaklar',
      female: 'Ayollar',
      fardBadge: 'FARZ',
      allSteps: 'Barchasi (9)',
      fardsOnly: 'Faqat 4 farz',
      matModeLabel: 'Joynamoz',
      repeatSuffix: 'marta',
      wuduFardsNote:
        'Tahoratning 4 farzi: Yuzni yuvish, Qo‘llarni tirsakkacha yuvish, Boshga mash tortish, Oyoqlarni to‘piqqacha yuvish.',
      breaksTitle: 'Tahoratni buzadigan amallar',
      rakatTitle: 'Namoz va rakatlar tartibi',
      rakatsSuffix: 'rakat',
      rakatFlowTitle: 'Rakatlar bo‘yicha ketma-ketlik',
      postureTimelineTitle: 'Bosqichma-bosqich namoz tartibi',
      genderTip: gender === 'male' ? 'Erkaklar uchun holat' : 'Ayollar uchun holat',
      mistakeLabel: 'Xatodan saqlaning',
      listenAudio: 'Tinglash',
      stopAudio: 'To‘xtatish',
    },
    uz_cyr: {
      wuduTab: 'Таҳорат (9 қадам)',
      prayerTab: 'Намоз тартиби',
      male: 'Эркаклар',
      female: 'Аёллар',
      fardBadge: 'ФАРЗ',
      allSteps: 'Барчаси (9)',
      fardsOnly: 'Фақат 4 фарз',
      matModeLabel: 'Жойнамоз',
      repeatSuffix: 'марта',
      wuduFardsNote:
        'Таҳоратнинг 4 фарзи: Юзни ювиш, Қўлларни тирсаккача ювиш, Бошга масҳ тортиш, Оёқларни тўпиққача ювиш.',
      breaksTitle: 'Таҳоратни бузадиган амаллар',
      rakatTitle: 'Намоз ва ракатлар тартиби',
      rakatsSuffix: 'ракат',
      rakatFlowTitle: 'Ракатлар бўйича кетма-кетлик',
      postureTimelineTitle: 'Босқичма-босқич намоз тартиби',
      genderTip: gender === 'male' ? 'Эркаклар учун ҳолат' : 'Аёллар учун ҳолат',
      mistakeLabel: 'Хатодан сақланинг',
      listenAudio: 'Тинглаш',
      stopAudio: 'Тўхтатиш',
    },
    en: {
      wuduTab: 'Wudu (9 Steps)',
      prayerTab: 'How to Pray',
      male: 'Brothers',
      female: 'Sisters',
      fardBadge: 'FARD',
      allSteps: 'All Steps (9)',
      fardsOnly: '4 Fards Only',
      matModeLabel: 'Large Mat Mode',
      repeatSuffix: 'times',
      wuduFardsNote:
        '4 Obligatory Fards of Wudu: Washing face, arms including elbows, wiping 1/4 head, and washing feet including ankles.',
      breaksTitle: 'What Breaks Wudu',
      rakatTitle: 'Daily Prayers & Rak‘at Guide',
      rakatsSuffix: 'rak‘ats',
      rakatFlowTitle: 'Rakat-by-Rakat Sequence',
      postureTimelineTitle: 'Step-by-Step Prayer Timeline',
      genderTip: gender === 'male' ? 'Brothers Posture Note' : 'Sisters Posture Note',
      mistakeLabel: 'Common Mistake',
      listenAudio: 'Listen',
      stopAudio: 'Stop',
    },
    ru: {
      wuduTab: 'Тахарат (9 шагов)',
      prayerTab: 'Порядок Намаза',
      male: 'Мужчины',
      female: 'Женщины',
      fardBadge: 'ФАРД',
      allSteps: 'Все шаги (9)',
      fardsOnly: 'Только 4 фарда',
      matModeLabel: 'Крупно',
      repeatSuffix: 'раза',
      wuduFardsNote:
        '4 Фарда тахарата: умыть лицо, омыть руки с локтями, протереть голову (масх) и омыть ноги со щиколотками.',
      breaksTitle: 'Что нарушает тахарат',
      rakatTitle: 'Ежедневные намазы и ракааты',
      rakatsSuffix: 'ракаата',
      rakatFlowTitle: 'Порядок по каждому ракаату',
      postureTimelineTitle: 'Пошаговая лента намаза',
      genderTip: gender === 'male' ? 'Особенность для мужчин' : 'Особенность для женщин',
      mistakeLabel: 'Избегайте ошибки',
      listenAudio: 'Слушать',
      stopAudio: 'Стоп',
    },
  }[language];

  const cardCls = isDay
    ? 'bg-white border border-[#dde3ea] rounded-2xl shadow-xs'
    : 'bg-slate-900/90 border border-emerald-900/50 rounded-2xl';

  const visibleWuduSteps = fardOnlyFilter ? WUDU_STEPS.filter((s) => s.isFard) : WUDU_STEPS;
  const activeRakat = PRAYER_RAKATS.find((r) => r.id === selectedRakatId) || PRAYER_RAKATS[0];
  const activeQiyamRec = QIYAM_RECITATIONS.find((q) => q.id === selectedQiyamTab) || QIYAM_RECITATIONS[0];
  const activeQadaDua = FULL_QAADA_DUAS.find((q) => q.id === selectedQadaTab) || FULL_QAADA_DUAS[0];

  const arabicFontCls = matMode ? 'text-[24px] leading-[2.1]' : 'text-lg leading-loose';
  const bodyFontCls = matMode ? 'text-[14px] leading-relaxed' : 'text-xs leading-relaxed';

  return (
    <div className="space-y-3 pb-6">
      {/* Sticky Top Navigation & Quick-Jump Bar */}
      <div
        className={`sticky -top-2.5 z-20 -mx-3.5 px-3.5 pt-2.5 pb-2 border-b space-y-2 ${
          isDay
            ? 'bg-[#ecf1f5] border-[#d5dde6]'
            : 'bg-slate-950 border-emerald-950/90'
        }`}
      >
        {/* Row 1: Wudu vs Prayer Switcher */}
        <div
          className={`p-1 rounded-2xl border grid grid-cols-2 gap-1 ${
            isDay ? 'bg-white border-[#dde3ea]' : 'bg-slate-900 border-emerald-900/50'
          }`}
        >
          <button
            type="button"
            onClick={() => {
              stopAudio();
              setSection('wudu');
            }}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition ${
              section === 'wudu'
                ? isDay
                  ? 'bg-[#158509] text-white shadow-xs nq-keep-dark'
                  : 'bg-amber-500 text-slate-950'
                : isDay
                ? 'text-slate-600'
                : 'text-slate-300'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>{ui.wuduTab}</span>
          </button>

          <button
            type="button"
            onClick={() => setSection('prayer')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition ${
              section === 'prayer'
                ? isDay
                  ? 'bg-[#158509] text-white shadow-xs nq-keep-dark'
                  : 'bg-amber-500 text-slate-950'
                : isDay
                ? 'text-slate-600'
                : 'text-slate-300'
            }`}
          >
            <WuduNamozGuideIcon className="w-4 h-4" />
            <span>{ui.prayerTab}</span>
          </button>
        </div>

        {/* Row 2: Contextual Filter/Gender + Joynamoz Big-Text Mode */}
        <div className="flex items-center gap-1.5">
          {section === 'wudu' ? (
            <div className="flex items-center gap-1 flex-1">
              <button
                type="button"
                onClick={() => setFardOnlyFilter(false)}
                className={`flex-1 py-1.5 px-2.5 rounded-xl text-[11px] font-bold border transition ${
                  !fardOnlyFilter
                    ? isDay
                      ? 'bg-[#0c4703] border-[#0c4703] text-white nq-keep-dark'
                      : 'bg-emerald-700 border-emerald-600 text-white'
                    : isDay
                    ? 'bg-white border-[#dde3ea] text-slate-600'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                {ui.allSteps}
              </button>
              <button
                type="button"
                onClick={() => setFardOnlyFilter(true)}
                className={`flex-1 py-1.5 px-2.5 rounded-xl text-[11px] font-bold border transition ${
                  fardOnlyFilter
                    ? 'bg-rose-600 border-rose-600 text-white'
                    : isDay
                    ? 'bg-white border-[#dde3ea] text-rose-600'
                    : 'bg-slate-900 border-slate-800 text-rose-400'
                }`}
              >
                {ui.fardsOnly}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 flex-1">
              {(['male', 'female'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`flex-1 py-1.5 px-2.5 rounded-xl text-[11px] font-bold border flex items-center justify-center gap-1 transition ${
                    gender === g
                      ? isDay
                        ? 'bg-[#0c4703] border-[#0c4703] text-white nq-keep-dark'
                        : 'bg-emerald-700 border-emerald-600 text-white'
                      : isDay
                      ? 'bg-white border-[#dde3ea] text-slate-600'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <User className="w-3 h-3" />
                  <span>{g === 'male' ? ui.male : ui.female}</span>
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setMatMode((v) => !v)}
            className={`py-1.5 px-2.5 rounded-xl text-[11px] font-bold border flex items-center gap-1 shrink-0 transition ${
              matMode
                ? isDay
                  ? 'bg-amber-500 border-amber-600 text-slate-950'
                  : 'bg-amber-400 border-amber-300 text-slate-950'
                : isDay
                ? 'bg-white border-[#dde3ea] text-slate-700'
                : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}
            title={ui.matModeLabel}
          >
            <Maximize2 className="w-3 h-3" />
            <span>{ui.matModeLabel}</span>
          </button>
        </div>

        {/* Row 3: Quick Step Jump Strip */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5">
          {(section === 'wudu' ? visibleWuduSteps : PRAYER_POSTURE_STEPS).map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => scrollToStep(`${section}_${st.id}`)}
              className={`px-2 py-1 rounded-lg text-[10.5px] font-bold shrink-0 border transition ${
                isDay
                  ? 'bg-white border-[#dde3ea] text-slate-700 hover:border-[#158509]'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-amber-400'
              }`}
            >
              {st.step}. {pickLoc(st.title, language).split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION A: CONTINUOUS VERTICAL WUDU TIMELINE */}
      {section === 'wudu' && (
        <>
          <div
            className={`p-3 rounded-2xl border text-[11px] leading-relaxed flex items-start gap-2 ${
              isDay
                ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                : 'bg-emerald-950/60 border-emerald-800/60 text-emerald-200'
            }`}
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{ui.wuduFardsNote}</span>
          </div>

          <div className="relative pl-4 space-y-3">
            {/* Vertical Timeline Spine */}
            <div
              className={`absolute left-[11px] top-4 bottom-4 w-0.5 rounded-full ${
                isDay ? 'bg-[#cbe8c3]' : 'bg-emerald-900/70'
              }`}
            />

            {visibleWuduSteps.map((step) => (
              <div
                key={step.id}
                ref={(el) => {
                  stepRefs.current[`wudu_${step.id}`] = el;
                }}
                className="relative"
              >
                {/* Timeline Step Node */}
                <span
                  className={`absolute -left-[18px] top-4 w-6 h-6 rounded-full text-[11px] font-extrabold flex items-center justify-center border-2 ${
                    step.isFard
                      ? 'bg-rose-600 border-white text-white'
                      : isDay
                      ? 'bg-[#158509] border-white text-white nq-keep-dark'
                      : 'bg-amber-500 border-slate-950 text-slate-950'
                  }`}
                >
                  {step.step}
                </span>

                <div className={`${cardCls} ${matMode ? 'p-4' : 'p-3.5'} ml-2`}>
                  <div className="flex items-start gap-3">
                    <WuduStepDiagramSvg stepId={step.id} isDay={isDay} />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        {step.isFard && (
                          <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-rose-500/15 text-rose-500 border border-rose-500/30">
                            {ui.fardBadge}
                          </span>
                        )}
                        {step.repeat && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isDay ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-amber-300'
                            }`}
                          >
                            ×{step.repeat} {ui.repeatSuffix}
                          </span>
                        )}
                      </div>

                      <h3 className={`font-bold ${matMode ? 'text-base' : 'text-sm'} ${isDay ? 'text-slate-900' : 'text-white'}`}>
                        {pickLoc(step.title, language)}
                      </h3>
                      <p className={`mt-1 ${bodyFontCls} ${isDay ? 'text-slate-600' : 'text-slate-300'}`}>
                        {pickLoc(step.summary, language)}
                      </p>
                    </div>
                  </div>

                  {step.mistakeTip && (
                    <div
                      className={`mt-2.5 p-2.5 rounded-xl border text-[11px] flex items-start gap-2 ${
                        isDay
                          ? 'bg-amber-50 border-amber-200 text-amber-900'
                          : 'bg-amber-950/30 border-amber-800/50 text-amber-200'
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
                      <span>
                        <strong className="font-bold">{ui.mistakeLabel}: </strong>
                        {pickLoc(step.mistakeTip, language)}
                      </span>
                    </div>
                  )}

                  {step.arabic && (
                    <div
                      className={`mt-2.5 p-3 rounded-xl border ${
                        isDay ? 'bg-[#f6fbf4] border-[#d7f0cb]' : 'bg-slate-950/70 border-emerald-900/50'
                      }`}
                    >
                      <p
                        dir="rtl"
                        className={`font-arabic text-right ${arabicFontCls} ${
                          isDay ? 'text-[#0c4703]' : 'text-amber-300'
                        }`}
                      >
                        {step.arabic}
                      </p>
                      {step.translit && (
                        <p className={`mt-1.5 font-semibold ${matMode ? 'text-[13px]' : 'text-[11px]'} ${isDay ? 'text-slate-800' : 'text-slate-200'}`}>
                          {pickLoc(step.translit, language)}
                        </p>
                      )}
                      {step.meaning && (
                        <p className={`mt-0.5 ${matMode ? 'text-xs' : 'text-[11px]'} ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                          {pickLoc(step.meaning, language)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Nullifiers Card: What Breaks Wudu */}
          <div className={`${cardCls} p-4 border-rose-500/25`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5 mb-2.5">
              <ShieldAlert className="w-4 h-4" />
              <span>{ui.breaksTitle}</span>
            </h3>
            <ul className="space-y-1.5">
              {WHAT_BREAKS_WUDU.map((item, idx) => (
                <li key={idx} className={`flex items-start gap-2 ${bodyFontCls} ${isDay ? 'text-slate-700' : 'text-slate-300'}`}>
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{pickLoc(item, language)}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* SECTION B: CONTINUOUS VERTICAL PRAYER GUIDE + RAKAT FLOW */}
      {section === 'prayer' && (
        <>
          {/* 5 Daily Prayers Rak‘at-by-Rak‘at Flow Explorer */}
          <div className={`${cardCls} p-4`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-2.5 ${isDay ? 'text-[#0c4703]' : 'text-amber-400'}`}>
              <Layers className="w-3.5 h-3.5" />
              <span>{ui.rakatTitle}</span>
            </h3>

            <div className="grid grid-cols-5 gap-1 mb-3">
              {PRAYER_RAKATS.map((spec) => (
                <button
                  key={spec.id}
                  type="button"
                  onClick={() => setSelectedRakatId(spec.id)}
                  className={`py-1.5 px-1 rounded-xl text-[11px] font-bold transition truncate ${
                    selectedRakatId === spec.id
                      ? isDay
                        ? 'bg-[#158509] text-white nq-keep-dark'
                        : 'bg-amber-500 text-slate-950'
                      : isDay
                      ? 'bg-[#ecf1f5] text-slate-700'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {pickLoc(spec.name, language)}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-2.5">
              {activeRakat.breakdown.map((b, idx) => (
                <div
                  key={idx}
                  className={`flex-1 min-w-[85px] p-2 rounded-xl border text-center ${
                    b.tone === 'fard'
                      ? isDay
                        ? 'bg-[#eef9ea] border-[#9fd893] text-[#0c4703]'
                        : 'bg-emerald-950/70 border-emerald-700 text-emerald-200'
                      : b.tone === 'witr'
                      ? isDay
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-amber-950/30 border-amber-700 text-amber-200'
                      : isDay
                      ? 'bg-[#f8fafc] border-[#dde3ea] text-slate-700'
                      : 'bg-slate-800/70 border-slate-700 text-slate-200'
                  }`}
                >
                  <span className="text-[10px] font-semibold block">{pickLoc(b.label, language)}</span>
                  <span className="text-sm font-bold tabular-nums">
                    {b.count} {ui.rakatsSuffix}
                  </span>
                </div>
              ))}
            </div>

            <p className={`text-[11px] leading-relaxed mb-3 ${isDay ? 'text-slate-600' : 'text-slate-300'}`}>
              {pickLoc(activeRakat.note, language)}
            </p>

            {/* Rak‘at-by-Rak‘at Sequence List */}
            <div className="space-y-1.5">
              <p className={`text-[10.5px] font-bold uppercase tracking-wider ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                {ui.rakatFlowTitle}
              </p>
              {activeRakat.rakatSteps.map((rk) => (
                <div
                  key={rk.rakat}
                  className={`p-2.5 rounded-xl border text-[11px] flex items-start gap-2 ${
                    isDay ? 'bg-[#f8fafc] border-[#e2e8f0]' : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
                      isDay ? 'bg-[#eef9ea] text-[#0c4703]' : 'bg-emerald-950 text-amber-300'
                    }`}
                  >
                    {pickLoc(rk.badge, language)}
                  </span>
                  <span className={isDay ? 'text-slate-700' : 'text-slate-200'}>
                    {pickLoc(rk.actions, language)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Continuous Vertical Timeline of 7 Prayer Postures */}
          <div className="flex items-center gap-1.5 px-1 pt-1">
            <Sparkles className={`w-3.5 h-3.5 ${isDay ? 'text-[#158509]' : 'text-amber-400'}`} />
            <span className={`text-[11px] font-bold uppercase tracking-wider ${isDay ? 'text-[#0c4703]' : 'text-amber-400'}`}>
              {ui.postureTimelineTitle}
            </span>
          </div>

          <div className="relative pl-4 space-y-3.5">
            <div
              className={`absolute left-[11px] top-4 bottom-4 w-0.5 rounded-full ${
                isDay ? 'bg-[#cbe8c3]' : 'bg-emerald-900/70'
              }`}
            />

            {PRAYER_POSTURE_STEPS.map((st) => (
              <div
                key={st.id}
                ref={(el) => {
                  stepRefs.current[`prayer_${st.id}`] = el;
                }}
                className="relative"
              >
                <span
                  className={`absolute -left-[18px] top-4 w-6 h-6 rounded-full text-[11px] font-extrabold flex items-center justify-center border-2 ${
                    isDay
                      ? 'bg-[#158509] border-white text-white nq-keep-dark'
                      : 'bg-amber-500 border-slate-950 text-slate-950'
                  }`}
                >
                  {st.step}
                </span>

                <div className={`${cardCls} ${matMode ? 'p-4' : 'p-3.5'} ml-2`}>
                  {/* SVG Diagram */}
                  <div
                    className={`rounded-xl py-1.5 px-3 mb-2.5 border ${
                      isDay ? 'bg-[#f6fbf4] border-[#d7f0cb]' : 'bg-slate-950/70 border-emerald-900/50'
                    }`}
                  >
                    <PostureDiagramSvg posture={st.posture} gender={gender} isDay={isDay} />
                  </div>

                  <h3 className={`font-bold ${matMode ? 'text-base' : 'text-sm'} ${isDay ? 'text-slate-900' : 'text-white'}`}>
                    {st.step}. {pickLoc(st.title, language)}
                  </h3>
                  <p className={`mt-1 ${bodyFontCls} ${isDay ? 'text-slate-600' : 'text-slate-300'}`}>
                    {pickLoc(st.summary, language)}
                  </p>

                  {/* Brothers / Sisters Fiqh Tip */}
                  <div
                    className={`mt-2.5 p-2.5 rounded-xl border text-[11px] ${
                      isDay
                        ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                        : 'bg-emerald-950/50 border-emerald-800/60 text-emerald-200'
                    }`}
                  >
                    <strong className="font-bold">{ui.genderTip}: </strong>
                    <span>
                      {gender === 'male' ? pickLoc(st.maleNote, language) : pickLoc(st.femaleNote, language)}
                    </span>
                  </div>

                  {/* Common Mistake Callout */}
                  <div
                    className={`mt-2 p-2.5 rounded-xl border text-[11px] flex items-start gap-2 ${
                      isDay
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-amber-950/30 border-amber-800/50 text-amber-200'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
                    <span>
                      <strong className="font-bold">{ui.mistakeLabel}: </strong>
                      {pickLoc(st.mistakeTip, language)}
                    </span>
                  </div>

                  {/* Primary Dhikr Block (shown on steps other than Qiyam & Qada where full sub-tabs replace brief snippets) */}
                  {st.id !== 'qiyam' && st.id !== 'qada' && (
                    <div
                      className={`mt-2.5 p-3 rounded-xl border ${
                        isDay ? 'bg-[#f8fafc] border-[#e2e8f0]' : 'bg-slate-950/70 border-slate-800'
                      }`}
                    >
                      <p
                        dir="rtl"
                        className={`font-arabic text-right ${arabicFontCls} ${
                          isDay ? 'text-[#0c4703]' : 'text-amber-300'
                        }`}
                      >
                        {st.arabic}
                      </p>
                      <p className={`mt-1.5 font-semibold ${matMode ? 'text-[13px]' : 'text-[11px]'} ${isDay ? 'text-slate-800' : 'text-slate-200'}`}>
                        {pickLoc(st.translit, language)}
                      </p>
                      <p className={`mt-0.5 ${matMode ? 'text-xs' : 'text-[11px]'} ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                        {pickLoc(st.meaning, language)}
                      </p>
                    </div>
                  )}

                  {/* Step 2 Special Expansion: Full Sano + Fatiha + Beginner Surahs WITH Recitation Audio */}
                  {st.id === 'qiyam' && (
                    <div className="mt-3 space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {QIYAM_RECITATIONS.map((rec) => (
                          <button
                            key={rec.id}
                            type="button"
                            onClick={() => setSelectedQiyamTab(rec.id)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                              selectedQiyamTab === rec.id
                                ? isDay
                                  ? 'bg-[#158509] text-white nq-keep-dark'
                                  : 'bg-amber-500 text-slate-950'
                                : isDay
                                ? 'bg-[#ecf1f5] text-slate-700'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {pickLoc(rec.label, language)}
                          </button>
                        ))}
                      </div>

                      <div
                        className={`p-3 rounded-xl border ${
                          isDay ? 'bg-[#f8fafc] border-[#e2e8f0]' : 'bg-slate-950/70 border-slate-800'
                        }`}
                      >
                        {activeQiyamRec.surahNumber && activeQiyamRec.ayahCount && (
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className={`text-[10.5px] font-bold ${isDay ? 'text-[#0c4703]' : 'text-amber-300'}`}>
                              {pickLoc(activeQiyamRec.label, language)}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                playSurahAudio(
                                  activeQiyamRec.id,
                                  activeQiyamRec.surahNumber!,
                                  activeQiyamRec.ayahCount!
                                )
                              }
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition ${
                                playingSurahId === activeQiyamRec.id
                                  ? 'bg-rose-600 text-white'
                                  : isDay
                                  ? 'bg-[#158509] text-white nq-keep-dark'
                                  : 'bg-amber-500 text-slate-950'
                              }`}
                            >
                              {playingSurahId === activeQiyamRec.id ? (
                                <>
                                  <Square className="w-3 h-3 fill-current" />
                                  <span>
                                    {ui.stopAudio}{' '}
                                    {playingAyahInfo ? `(${playingAyahInfo.current}/${playingAyahInfo.total})` : ''}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-3.5 h-3.5" />
                                  <span>{ui.listenAudio}</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}

                        <p
                          dir="rtl"
                          className={`font-arabic text-right ${arabicFontCls} ${
                            isDay ? 'text-[#0c4703]' : 'text-amber-300'
                          }`}
                        >
                          {activeQiyamRec.arabic}
                        </p>
                        <p className={`mt-2 font-semibold ${matMode ? 'text-[13px]' : 'text-[11px]'} ${isDay ? 'text-slate-800' : 'text-slate-200'}`}>
                          {pickLoc(activeQiyamRec.translit, language)}
                        </p>
                        <p className={`mt-1 ${matMode ? 'text-xs' : 'text-[11px]'} ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                          {pickLoc(activeQiyamRec.meaning, language)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Step 7 Special Expansion: Complete Unabbreviated Attahiyyot, Salawat, Robbana, Qunut */}
                  {st.id === 'qada' && (
                    <div className="mt-3 space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {FULL_QAADA_DUAS.map((dua) => (
                          <button
                            key={dua.id}
                            type="button"
                            onClick={() => setSelectedQadaTab(dua.id)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                              selectedQadaTab === dua.id
                                ? isDay
                                  ? 'bg-[#158509] text-white nq-keep-dark'
                                  : 'bg-amber-500 text-slate-950'
                                : isDay
                                ? 'bg-[#ecf1f5] text-slate-700'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {pickLoc(dua.label, language)}
                          </button>
                        ))}
                      </div>

                      <div
                        className={`p-3 rounded-xl border ${
                          isDay ? 'bg-[#f8fafc] border-[#e2e8f0]' : 'bg-slate-950/70 border-slate-800'
                        }`}
                      >
                        <p
                          dir="rtl"
                          className={`font-arabic text-right ${arabicFontCls} ${
                            isDay ? 'text-[#0c4703]' : 'text-amber-300'
                          }`}
                        >
                          {activeQadaDua.arabic}
                        </p>
                        <p className={`mt-2 font-semibold ${matMode ? 'text-[13px]' : 'text-[11px]'} ${isDay ? 'text-slate-800' : 'text-slate-200'}`}>
                          {pickLoc(activeQadaDua.translit, language)}
                        </p>
                        <p className={`mt-1 ${matMode ? 'text-xs' : 'text-[11px]'} ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                          {pickLoc(activeQadaDua.meaning, language)}
                        </p>
                      </div>

                      {/* Explicit Salam closing line */}
                      <div
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                          isDay ? 'bg-[#eef9ea] border-[#c5e8bc]' : 'bg-emerald-950/60 border-emerald-800/60'
                        }`}
                      >
                        <span className={`text-[11px] font-semibold ${isDay ? 'text-[#0c4703]' : 'text-emerald-200'}`}>
                          {pickLoc(st.translit, language)}
                        </span>
                        <span dir="rtl" className={`font-arabic text-base font-bold ${isDay ? 'text-[#0c4703]' : 'text-amber-300'}`}>
                          {st.arabic}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
