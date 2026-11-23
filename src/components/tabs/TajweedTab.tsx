import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Play,
  Sparkles,
  Square,
  Volume2,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { latinToCyrillicUz } from '../../utils/uzbekScript';
import {
  ARABIC_ALPHABET_28,
  ArabicLetterItem,
  MUALLIMI_SONIY_LESSONS,
  MakhrajZone,
  TAJWEED_RULES,
  TajweedColorTone,
} from '../../data/tajweedData';
import { getTajweedAudioUrl } from '../../data/tajweedAudioMap';

type TajweedMode = 'lessons' | 'alphabet' | 'rules' | 'quiz';

const COMPLETED_LESSONS_KEY = 'nq_muallimi_soniy_done_v1';

function loadCompletedLessons(): number[] {
  try {
    const raw = localStorage.getItem(COMPLETED_LESSONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((n): n is number => typeof n === 'number');
      }
    }
  } catch {
    // ignore
  }
  return [];
}

export const TajweedTab: React.FC = () => {
  const { isDay } = useTheme();
  const { language } = useLanguage();

  const [mode, setMode] = useState<TajweedMode>('lessons');

  // Comfort Controls: Speed (Slow 0.68x vs Normal 0.92x), Show/Hide Reading Hint, Arabic Font Scale
  const [slowAudio, setSlowAudio] = useState<boolean>(true);
  const [showReadingHint, setShowReadingHint] = useState<boolean>(true);
  const [fontScale, setFontScale] = useState<0 | 1 | 2>(1);

  // Muallimi Soniy Progressive Lessons State
  const [activeLessonId, setActiveLessonId] = useState<number>(1);
  const [completedLessons, setCompletedLessons] = useState<number[]>(() =>
    loadCompletedLessons()
  );
  const [activeDrillIdx, setActiveDrillIdx] = useState<number | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const autoPlayTimerRef = useRef<number | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const speakTokenRef = useRef<number>(0);

  // 28 Alphabet & 5-Zone Makhraj State
  const [selectedZone, setSelectedZone] = useState<'all' | MakhrajZone>('all');
  const [selectedLetter, setSelectedLetter] = useState<ArabicLetterItem>(
    ARABIC_ALPHABET_28[0]
  );

  // Practice Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);

  const loc = useCallback(
    (text: string) => (language === 'uz_cyr' ? latinToCyrillicUz(text) : text),
    [language]
  );

  const stopAudioPlayback = useCallback(() => {
    speakTokenRef.current += 1;
    const el = audioElRef.current;
    if (el) {
      el.onended = null;
      el.onerror = null;
      try {
        el.pause();
        el.currentTime = 0;
      } catch {
        // ignore
      }
    }
    try {
      window.speechSynthesis?.cancel();
    } catch {
      // ignore
    }
  }, []);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayTimerRef.current !== null) {
      window.clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
    setIsAutoPlaying(false);
    stopAudioPlayback();
  }, [stopAudioPlayback]);

  useEffect(() => {
    return () => stopAutoPlay();
  }, [stopAutoPlay]);

  const speakArabic = useCallback(
    (arabicText: string, onEnd?: () => void) => {
      stopAudioPlayback();
      const myToken = speakTokenRef.current;
      let finished = false;
      const done = () => {
        if (finished || speakTokenRef.current !== myToken) return;
        finished = true;
        onEnd?.();
      };

      // Primary path: 100% offline bundled Arabic MP3 clips (works reliably on Android APK, Linux Desktop, iOS & Web)
      const audioUrl = getTajweedAudioUrl(arabicText);
      if (audioUrl && typeof Audio !== 'undefined') {
        try {
          if (!audioElRef.current) {
            audioElRef.current = new Audio();
          }
          const el = audioElRef.current;
          el.preload = 'auto';
          el.src = audioUrl;
          const rate = slowAudio ? 0.76 : 1.0;
          el.playbackRate = rate;
          (el as HTMLAudioElement & { preservesPitch?: boolean }).preservesPitch = true;
          el.onended = () => done();
          el.onerror = () => done();
          const playPromise = el.play();
          if (playPromise && typeof playPromise.then === 'function') {
            playPromise.catch(() => done());
          }
          return;
        } catch {
          // fall through to Web Speech fallback below
        }
      }

      // Secondary fallback (only if an unmapped phrase is ever triggered)
      try {
        if ('speechSynthesis' in window) {
          const utter = new SpeechSynthesisUtterance(arabicText);
          utter.lang = 'ar-SA';
          utter.rate = slowAudio ? 0.68 : 0.94;
          utter.onend = () => done();
          utter.onerror = () => done();
          window.speechSynthesis.speak(utter);
          return;
        }
      } catch {
        // fallback timer below
      }
      if (onEnd) {
        autoPlayTimerRef.current = window.setTimeout(done, 1200);
      }
    },
    [slowAudio, stopAudioPlayback]
  );

  const currentLesson = useMemo(
    () =>
      MUALLIMI_SONIY_LESSONS.find((l) => l.id === activeLessonId) ||
      MUALLIMI_SONIY_LESSONS[0],
    [activeLessonId]
  );

  const handleToggleAutoPlayLesson = useCallback(() => {
    if (isAutoPlaying) {
      stopAutoPlay();
      return;
    }
    const drills = currentLesson.drills;
    if (!drills.length) return;
    setIsAutoPlaying(true);

    const playStep = (idx: number) => {
      if (idx >= drills.length) {
        setIsAutoPlaying(false);
        setActiveDrillIdx(null);
        return;
      }
      setActiveDrillIdx(idx);
      speakArabic(drills[idx].arabic, () => {
        autoPlayTimerRef.current = window.setTimeout(() => {
          playStep(idx + 1);
        }, 650);
      });
    };

    playStep(0);
  }, [currentLesson.drills, isAutoPlaying, speakArabic, stopAutoPlay]);

  const toggleLessonCompleted = (lessonId: number) => {
    setCompletedLessons((prev) => {
      const next = prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId];
      try {
        localStorage.setItem(COMPLETED_LESSONS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  useEffect(() => {
    if (mode === 'lessons') return;
    const onBack = (e: Event) => {
      e.preventDefault();
      stopAutoPlay();
      setMode('lessons');
    };
    window.addEventListener('nq:android-back', onBack);
    return () => window.removeEventListener('nq:android-back', onBack);
  }, [mode, stopAutoPlay]);

  const copy = useMemo(() => {
    if (language === 'ru') {
      return {
        badge: 'МУАЛЛИМИ САНИ · АХМАД ХАДИ МАКСУДИ',
        title: 'Муаллими Сани и Таджвид',
        sub: 'Пошаговые уроки чтения Корана с нуля: доска упражнений, 5 зон махраджа и цветной таджвид',
        tabLessons: '10 Уроков',
        tabAlphabet: '28 Букв',
        tabRules: 'Таджвид',
        tabQuiz: 'Тренировка',
        slowLabel: '🐢 Медленно 0.7×',
        normLabel: '🔊 Обычный 1.0×',
        hintOn: 'Чтение вкл.',
        hintOff: 'Без подсказок',
        boardTitle: 'ДОСКА УПРАЖНЕНИЙ (НАЖМИТЕ ДЛЯ ПРОСЛУШИВАНИЯ)',
        autoPlay: 'Авто-чтение',
        stopPlay: 'Стоп',
        markDone: 'Урок освоен ✓',
        markedDone: 'Освоено ✓',
        nextLesson: 'Следующий урок →',
        zoneAll: 'Все (28)',
        zoneThroat: '1. Горло (6)',
        zoneTongue: '2. Язык (17)',
        zoneLips: '3. Губы (4)',
        zoneNasal: '4. Гунна (1)',
        heavyBadge: 'Твёрдая',
        softBadge: 'Мягкая',
        qalqBadge: 'Калькаля',
        listenBtn: 'Слушать',
        formIsolated: 'Отдельно',
        formInitial: 'В начале',
        formMedial: 'В середине',
        formFinal: 'В конце',
        makhrajTitle: 'Махрадж (место выхода звука):',
        exampleTitle: 'Пример из Корана:',
        legendQalq: 'Калькаля (ق ط ب ج د)',
        legendGhun: 'Гунна / Идгам / Ихфа',
        legendMadd: 'Мадд (2–6 харакатов)',
        quizPrompt: 'Какая это арабская буква?',
        nextBtn: 'Следующая буква',
      };
    }
    if (language === 'en') {
      return {
        badge: 'MUALLIMI SANI · STEP-BY-STEP QAIDA',
        title: 'Muallimi Sani & Tajweed',
        sub: 'Progressive Arabic reading lessons from scratch: interactive Qaida board, 5 Makhraj zones, and color-coded Tajweed',
        tabLessons: '10 Lessons',
        tabAlphabet: '28 Letters',
        tabRules: 'Tajweed',
        tabQuiz: 'Practice',
        slowLabel: '🐢 Slow 0.7×',
        normLabel: '🔊 Normal 1.0×',
        hintOn: 'Hints On',
        hintOff: 'Pure Arabic',
        boardTitle: 'PRACTICE BOARD (TAP ANY WORD TO LISTEN)',
        autoPlay: 'Auto-Recite',
        stopPlay: 'Stop',
        markDone: 'Mark Lesson Complete ✓',
        markedDone: 'Completed ✓',
        nextLesson: 'Next Lesson →',
        zoneAll: 'All (28)',
        zoneThroat: '1. Throat (6)',
        zoneTongue: '2. Tongue (17)',
        zoneLips: '3. Lips (4)',
        zoneNasal: '4. Nasal (1)',
        heavyBadge: 'Heavy',
        softBadge: 'Light',
        qalqBadge: 'Qalqalah',
        listenBtn: 'Listen',
        formIsolated: 'Isolated',
        formInitial: 'Start',
        formMedial: 'Middle',
        formFinal: 'End',
        makhrajTitle: 'Makhraj (Articulation Point):',
        exampleTitle: 'Qur’anic Example:',
        legendQalq: 'Qalqalah (ق ط ب ج د)',
        legendGhun: 'Ghunnah / Idgham / Ikhfa',
        legendMadd: 'Madd (Elongation 2–6)',
        quizPrompt: 'Which Arabic letter is this?',
        nextBtn: 'Next Letter',
      };
    }
    if (language === 'uz_cyr') {
      return {
        badge: 'МУАЛЛИМИ СОНИЙ · АҲМАД ҲОДИЙ МАҚСУДИЙ',
        title: 'Муаллими Соний ва Тажвид',
        sub: '0 дан Қуръон ўқишгача 10 та босқичли дарс, овозли машқ тахтаси, 5 махраж ҳудуди ва рангли тажвид',
        tabLessons: '10 Дарс',
        tabAlphabet: '28 Ҳарф',
        tabRules: 'Тажвид',
        tabQuiz: 'Синов',
        slowLabel: '🐢 Секин 0.7×',
        normLabel: '🔊 Оддий 1.0×',
        hintOn: 'Ўқилиши очиқ',
        hintOff: 'Фақат арабча',
        boardTitle: 'МАШҚ ТАХТАСИ (СЎЗ УСТИГА БОСИБ ТИНГЛАНГ)',
        autoPlay: 'Авто-ўқиш',
        stopPlay: 'Тўхтатиш',
        markDone: 'Дарсни ўзлаштирдим ✓',
        markedDone: 'Ўзлаштирилди ✓',
        nextLesson: 'Кейинги дарс →',
        zoneAll: 'Барчаси (28)',
        zoneThroat: '1. Бўғиз (6)',
        zoneTongue: '2. Тил (17)',
        zoneLips: '3. Икки лаб (4)',
        zoneNasal: '4. Димоғ (1)',
        heavyBadge: 'Йўғон',
        softBadge: 'Ингичка',
        qalqBadge: 'Қалқала',
        listenBtn: 'Тинглаш',
        formIsolated: 'Алоҳида',
        formInitial: 'Бошида',
        formMedial: 'Ўртасида',
        formFinal: 'Охирида',
        makhrajTitle: 'Махражи (товуш чиқиш жойи):',
        exampleTitle: 'Қуръоний мисол:',
        legendQalq: 'Қалқала (ق ط ب ج د)',
        legendGhun: 'Ғунна / Идғом / Иқлоб / Иxфо',
        legendMadd: 'Мад (Чўзиш 2–6 ҳаракат)',
        quizPrompt: 'Ушбу араб ҳарфининг номи ва товуши қайси?',
        nextBtn: 'Кейинги ҳарф',
      };
    }
    return {
      badge: 'MUALLIMI SONIY · AHMAD HODIY MAQSUDIY',
      title: 'Muallimi Soniy va Tajvid',
      sub: "0 dan Qur'on o'qishgacha 10 ta bosqichli dars, ovozli mashq taxtasi, 5 maxraj hududi va rangli tajvid",
      tabLessons: '10 Dars',
      tabAlphabet: '28 Harf',
      tabRules: 'Tajvid',
      tabQuiz: 'Sinov',
      slowLabel: '🐢 Sekin 0.7×',
      normLabel: '🔊 Oddiy 1.0×',
      hintOn: "O'qilishi ochiq",
      hintOff: 'Faqat arabcha',
      boardTitle: "MASHQ TAXTASI (SO'Z USTIGA BOSIB TINGLANG)",
      autoPlay: "Avto-o'qish",
      stopPlay: "To'xtatish",
      markDone: "Darsni o'zlashtirdim ✓",
      markedDone: "O'zlashtirildi ✓",
      nextLesson: 'Keyingi dars →',
      zoneAll: 'Barchasi (28)',
      zoneThroat: "1. Bo'g'iz (6)",
      zoneTongue: '2. Til (17)',
      zoneLips: '3. Ikki lab (4)',
      zoneNasal: "4. Dimog' (1)",
      heavyBadge: "Yo'g'on",
      softBadge: 'Ingichka',
      qalqBadge: 'Qalqala',
      listenBtn: 'Tinglash',
      formIsolated: 'Alohida',
      formInitial: 'Boshida',
      formMedial: "O'rtasida",
      formFinal: 'Oxirida',
      makhrajTitle: 'Maxraji (tovush chiqish joyi):',
      exampleTitle: "Qur'oniy misol:",
      legendQalq: 'Qalqala (ق ط ب ج د)',
      legendGhun: "G'unna / Idg'om / Iqlob / Ixfo",
      legendMadd: "Mad (Cho'zish 2–6 harakat)",
      quizPrompt: 'Ushbu arab harfining nomi va tovushi qaysi?',
      nextBtn: 'Keyingi harf',
    };
  }, [language]);

  const arabicSizeCls =
    fontScale === 0 ? 'text-xl' : fontScale === 1 ? 'text-2xl' : 'text-3xl';

  const filteredAlphabet = useMemo(() => {
    if (selectedZone === 'all') return ARABIC_ALPHABET_28;
    return ARABIC_ALPHABET_28.filter((l) => l.zone === selectedZone);
  }, [selectedZone]);

  const quizQuestions = useMemo(() => {
    return ARABIC_ALPHABET_28.map((target, idx) => {
      const distractors = ARABIC_ALPHABET_28.filter((l) => l.id !== target.id)
        .sort((a, b) => ((a.id * 7 + idx) % 13) - ((b.id * 7 + idx) % 13))
        .slice(0, 3);
      const options = [target, ...distractors].sort(
        (a, b) => ((a.id * 3 + idx) % 11) - ((b.id * 3 + idx) % 11)
      );
      return { target, options };
    });
  }, []);

  const currentQuiz = quizQuestions[quizIndex % quizQuestions.length];

  const handleSelectQuizOption = (id: number) => {
    if (selectedOptionId !== null) return;
    setSelectedOptionId(id);
    if (id === currentQuiz.target.id) {
      setQuizScore((s) => s + 1);
      speakArabic(currentQuiz.target.arabic);
    }
  };

  const getSegmentColorClass = (tone?: TajweedColorTone) => {
    if (!tone) return '';
    if (tone === 'qalqalah') {
      return isDay
        ? 'text-blue-700 underline decoration-blue-500/70 decoration-2'
        : 'text-sky-400 underline decoration-sky-400/70 decoration-2';
    }
    if (tone === 'madd') {
      return isDay
        ? 'text-red-600 underline decoration-red-500/70 decoration-2'
        : 'text-rose-400 underline decoration-rose-400/70 decoration-2';
    }
    if (tone === 'ghunnah') {
      return isDay
        ? 'text-[#158509] underline decoration-[#158509]/70 decoration-2'
        : 'text-emerald-400 underline decoration-emerald-400/70 decoration-2';
    }
    return isDay ? 'text-amber-700' : 'text-amber-300';
  };

  const completedPct = Math.round(
    (completedLessons.length / MUALLIMI_SONIY_LESSONS.length) * 100
  );

  return (
    <div className="space-y-3 pb-4">
      {/* Hero Banner with Lesson Progress Bar */}
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
          <div className="text-right shrink-0">
            <div className="px-2.5 py-1 rounded-xl bg-black/25 border border-white/20 text-xs font-extrabold text-[#fde68a] tabular-nums">
              {completedLessons.length} / {MUALLIMI_SONIY_LESSONS.length} ✓
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-black/25 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#fde68a] transition-all duration-300"
            style={{ width: `${Math.max(6, completedPct)}%` }}
          />
        </div>
      </div>

      {/* 4 Sub-Tab Switcher */}
      <div
        className={`grid grid-cols-4 gap-1 p-1 rounded-2xl border ${
          isDay
            ? 'bg-white border-[#dde3ea] shadow-xs'
            : 'bg-slate-900 border-emerald-900/50'
        }`}
      >
        {(
          [
            { id: 'lessons', label: copy.tabLessons },
            { id: 'alphabet', label: copy.tabAlphabet },
            { id: 'rules', label: copy.tabRules },
            { id: 'quiz', label: copy.tabQuiz },
          ] as const
        ).map((tab) => {
          const active = mode === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                stopAutoPlay();
                setMode(tab.id);
              }}
              className={`py-2 px-1.5 rounded-xl text-[11px] font-extrabold transition truncate ${
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

      {/* Comfort Toolbar (Speed, Reading Hint Toggle, Arabic Font Size) */}
      {mode !== 'quiz' && (
        <div
          className={`rounded-2xl border px-2.5 py-2 flex items-center justify-between gap-1.5 ${
            isDay
              ? 'bg-white border-[#cde5c7] shadow-2xs'
              : 'bg-slate-900/95 border-emerald-800/60'
          }`}
        >
          {/* Audio Speed Toggle */}
          <button
            type="button"
            onClick={() => setSlowAudio((s) => !s)}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold border transition active:scale-95 ${
              slowAudio
                ? isDay
                  ? 'bg-[#eef9ea] border-[#b7e2ad] text-[#0c4703]'
                  : 'bg-emerald-950 border-emerald-700 text-emerald-300'
                : isDay
                ? 'bg-slate-100 border-slate-200 text-slate-700'
                : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            {slowAudio ? copy.slowLabel : copy.normLabel}
          </button>

          {/* Show/Hide Reading Hint Toggle */}
          <button
            type="button"
            onClick={() => setShowReadingHint((h) => !h)}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold border inline-flex items-center gap-1 transition active:scale-95 ${
              showReadingHint
                ? isDay
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-amber-950/60 border-amber-700/70 text-amber-300'
                : isDay
                ? 'bg-slate-100 border-slate-200 text-slate-700'
                : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            {showReadingHint ? (
              <Eye className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <EyeOff className="w-3.5 h-3.5 shrink-0" />
            )}
            <span>{showReadingHint ? copy.hintOn : copy.hintOff}</span>
          </button>

          {/* Arabic Font Scale A- / A+ */}
          <button
            type="button"
            onClick={() => setFontScale((f) => ((f + 1) % 3) as 0 | 1 | 2)}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold border transition active:scale-95 ${
              isDay
                ? 'bg-slate-50 border-slate-200 text-slate-700'
                : 'bg-slate-800 border-slate-700 text-slate-200'
            }`}
          >
            A{fontScale === 0 ? '' : fontScale === 1 ? '+' : '++'}
          </button>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODE 1: MUALLIMI SONIY 10 PROGRESSIVE LESSONS & QAIDA PRACTICE BOARD  */}
      {/* ===================================================================== */}
      {mode === 'lessons' && (
        <div className="space-y-3">
          {/* Horizontal 1..10 Lesson Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {MUALLIMI_SONIY_LESSONS.map((les) => {
              const isSelected = les.id === currentLesson.id;
              const isDone = completedLessons.includes(les.id);
              return (
                <button
                  key={les.id}
                  type="button"
                  onClick={() => {
                    stopAutoPlay();
                    setActiveDrillIdx(null);
                    setActiveLessonId(les.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap border transition flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? isDay
                        ? 'bg-[#158509] border-[#158509] text-white nq-keep-dark shadow-2xs'
                        : 'bg-amber-400 border-amber-400 text-slate-950'
                      : isDone
                      ? isDay
                        ? 'bg-[#eef9ea] border-[#b7e2ad] text-[#0c4703]'
                        : 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                      : isDay
                      ? 'bg-white border-[#dde3ea] text-slate-700'
                      : 'bg-slate-900 border-emerald-900/50 text-slate-300'
                  }`}
                >
                  <span>{les.id}-dars</span>
                  {isDone && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>

          {/* Active Lesson Card */}
          <div
            className={`rounded-3xl border p-4 space-y-3.5 ${
              isDay
                ? 'bg-white border-[#cde5c7] shadow-xs'
                : 'bg-slate-900/95 border-emerald-800/60 shadow-md'
            }`}
          >
            {/* Lesson Header + Auto-Recite Button */}
            <div className="flex items-start justify-between gap-2.5">
              <div className="space-y-1 min-w-0">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                    isDay
                      ? 'bg-[#eef9ea] border-[#b7e2ad] text-[#158509]'
                      : 'bg-emerald-950 border-emerald-800 text-amber-300'
                  }`}
                >
                  {loc(currentLesson.badgeUz)}
                </span>
                <h3
                  className={`text-sm font-extrabold leading-snug ${
                    isDay ? 'text-[#0c4703]' : 'text-white'
                  }`}
                >
                  {loc(currentLesson.titleUz)}
                </h3>
              </div>

              <button
                type="button"
                onClick={handleToggleAutoPlayLesson}
                className={`px-3 py-2 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 shrink-0 transition active:scale-95 ${
                  isAutoPlaying
                    ? 'bg-rose-600 text-white'
                    : isDay
                    ? 'bg-[#158509] text-white nq-keep-dark'
                    : 'bg-amber-400 text-slate-950'
                }`}
              >
                {isAutoPlaying ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>{copy.stopPlay}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{copy.autoPlay}</span>
                  </>
                )}
              </button>
            </div>

            {/* New Letters Introduced in this Lesson */}
            <div
              className={`rounded-2xl border p-2.5 flex items-center justify-center gap-2 flex-wrap ${
                isDay
                  ? 'bg-[#f8fcf7] border-[#d5ebd0]'
                  : 'bg-slate-950/65 border-emerald-900/50'
              }`}
              dir="rtl"
            >
              {currentLesson.newLetters.map((nl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => speakArabic(nl.arabic)}
                  className={`px-3.5 py-1.5 rounded-xl border text-center transition active:scale-95 ${
                    isDay
                      ? 'bg-white border-[#cde5c7] hover:border-[#158509]'
                      : 'bg-slate-900 border-emerald-800 hover:border-amber-400'
                  }`}
                >
                  <div
                    className={`font-arabic font-bold ${arabicSizeCls} ${
                      isDay ? 'text-[#0c4703]' : 'text-amber-300'
                    }`}
                  >
                    {nl.arabic}
                  </div>
                  <div
                    className={`text-[10px] font-extrabold mt-0.5 ${
                      isDay ? 'text-slate-600' : 'text-slate-300'
                    }`}
                  >
                    {loc(nl.nameUz)}
                  </div>
                </button>
              ))}
            </div>

            {/* Teacher's Explanation Tip */}
            <div
              className={`rounded-2xl border-l-4 px-3.5 py-2.5 text-xs leading-relaxed ${
                isDay
                  ? 'bg-[#f4fbf2] border-l-[#158509] text-slate-700'
                  : 'bg-emerald-950/45 border-l-amber-400 text-slate-200'
              }`}
            >
              {loc(currentLesson.ruleTipUz)}
            </div>

            {/* Interactive RTL Qaida Mashq Board */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10.5px] font-extrabold uppercase tracking-wider">
                <span className={isDay ? 'text-[#158509]' : 'text-amber-300'}>
                  {copy.boardTitle}
                </span>
                <span className={isDay ? 'text-slate-400' : 'text-slate-500'}>
                  🔊 {currentLesson.drills.length}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2" dir="rtl">
                {currentLesson.drills.map((cell, idx) => {
                  const isActive = activeDrillIdx === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        stopAutoPlay();
                        setActiveDrillIdx(idx);
                        speakArabic(cell.arabic);
                      }}
                      className={`rounded-2xl border p-2.5 text-center transition active:scale-95 flex flex-col items-center justify-center ${
                        isActive
                          ? isDay
                            ? 'bg-[#eef9ea] border-2 border-[#158509] shadow-sm'
                            : 'bg-emerald-950 border-2 border-amber-400 shadow-sm'
                          : isDay
                          ? 'bg-[#fcfdfa] border-[#d5e6d0] hover:border-[#158509]'
                          : 'bg-slate-950/80 border-emerald-900/55 hover:border-amber-400/60'
                      }`}
                    >
                      <div
                        className={`font-arabic font-bold leading-relaxed ${arabicSizeCls} ${
                          isDay ? 'text-slate-900' : 'text-white'
                        }`}
                      >
                        {cell.arabic}
                      </div>
                      {showReadingHint && (
                        <div
                          dir="ltr"
                          className={`text-[10.5px] font-extrabold mt-1 truncate max-w-full ${
                            isDay ? 'text-[#158509]' : 'text-amber-300'
                          }`}
                        >
                          {loc(cell.readingUz)}
                        </div>
                      )}
                      {showReadingHint && cell.meaningUz && (
                        <div
                          dir="ltr"
                          className={`text-[9.5px] truncate max-w-full ${
                            isDay ? 'text-slate-500' : 'text-slate-400'
                          }`}
                        >
                          ({loc(cell.meaningUz)})
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lesson Completion & Next Lesson Footer */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => toggleLessonCompleted(currentLesson.id)}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border inline-flex items-center justify-center gap-1.5 transition active:scale-98 ${
                  completedLessons.includes(currentLesson.id)
                    ? isDay
                      ? 'bg-[#158509] border-[#158509] text-white nq-keep-dark'
                      : 'bg-emerald-700 border-emerald-600 text-white'
                    : isDay
                    ? 'bg-[#eef9ea] border-[#b7e2ad] text-[#0c4703]'
                    : 'bg-emerald-950 border-emerald-800 text-emerald-300'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  {completedLessons.includes(currentLesson.id)
                    ? copy.markedDone
                    : copy.markDone}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  stopAutoPlay();
                  setActiveDrillIdx(null);
                  const nextId =
                    currentLesson.id < MUALLIMI_SONIY_LESSONS.length
                      ? currentLesson.id + 1
                      : 1;
                  setActiveLessonId(nextId);
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border transition active:scale-98 ${
                  isDay
                    ? 'bg-slate-50 border-slate-200 text-slate-800 hover:border-[#158509]'
                    : 'bg-slate-800 border-slate-700 text-slate-200'
                }`}
              >
                {copy.nextLesson}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODE 2: 28 ARABIC LETTERS & 5-ZONE MAKHRAJ MAP                        */}
      {/* ===================================================================== */}
      {mode === 'alphabet' && (
        <div className="space-y-3">
          {/* 5-Zone Makhraj Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {(
              [
                { id: 'all', label: copy.zoneAll },
                { id: 'throat', label: copy.zoneThroat },
                { id: 'tongue', label: copy.zoneTongue },
                { id: 'lips', label: copy.zoneLips },
                { id: 'nasal', label: copy.zoneNasal },
              ] as const
            ).map((z) => {
              const active = selectedZone === z.id;
              return (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => setSelectedZone(z.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap border transition shrink-0 ${
                    active
                      ? isDay
                        ? 'bg-[#158509] border-[#158509] text-white nq-keep-dark'
                        : 'bg-amber-400 border-amber-400 text-slate-950'
                      : isDay
                      ? 'bg-white border-[#dde3ea] text-slate-700'
                      : 'bg-slate-900 border-emerald-900/50 text-slate-300'
                  }`}
                >
                  {z.label}
                </button>
              );
            })}
          </div>

          {/* Selected Letter Interactive Detail Card */}
          <div
            className={`rounded-3xl border p-4 space-y-3 ${
              isDay
                ? 'bg-white border-[#cde5c7] shadow-xs'
                : 'bg-slate-900/95 border-emerald-800/60 shadow-md'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => speakArabic(selectedLetter.arabic)}
                  className={`w-16 h-16 rounded-2xl border flex items-center justify-center font-arabic text-4xl font-bold shrink-0 transition active:scale-95 ${
                    isDay
                      ? 'bg-[#eef9ea] border-[#b7e2ad] text-[#0c4703]'
                      : 'bg-emerald-950 border-emerald-700 text-amber-300'
                  }`}
                >
                  {selectedLetter.arabic}
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-extrabold ${
                        isDay
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      #{selectedLetter.id} / 28
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${
                        selectedLetter.isHeavy
                          ? isDay
                            ? 'bg-amber-50 border-amber-200 text-amber-800'
                            : 'bg-amber-950/60 border-amber-800 text-amber-300'
                          : isDay
                          ? 'bg-[#eef9ea] border-[#b7e2ad] text-[#158509]'
                          : 'bg-emerald-950 border-emerald-800 text-emerald-300'
                      }`}
                    >
                      {selectedLetter.isHeavy ? copy.heavyBadge : copy.softBadge}
                    </span>
                    {selectedLetter.isQalqalah && (
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${
                          isDay
                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                            : 'bg-sky-950/60 border-sky-800 text-sky-300'
                        }`}
                      >
                        🔵 {copy.qalqBadge}
                      </span>
                    )}
                  </div>
                  <h3
                    className={`text-base font-extrabold mt-1 ${
                      isDay ? 'text-[#0c4703]' : 'text-white'
                    }`}
                  >
                    {loc(selectedLetter.nameUz)}
                  </h3>
                  <p
                    className={`text-xs font-semibold ${
                      isDay ? 'text-slate-600' : 'text-slate-300'
                    }`}
                  >
                    {loc(selectedLetter.soundUz)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => speakArabic(selectedLetter.exampleArabic)}
                className={`px-3 py-2 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 shrink-0 transition active:scale-95 ${
                  isDay
                    ? 'bg-[#158509] text-white nq-keep-dark'
                    : 'bg-amber-400 text-slate-950'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{copy.listenBtn}</span>
              </button>
            </div>

            {/* 4 Contextual Writing Shapes (RTL) */}
            <div className="grid grid-cols-4 gap-2 text-center" dir="rtl">
              {(
                [
                  { label: copy.formIsolated, val: selectedLetter.forms.isolated },
                  { label: copy.formInitial, val: selectedLetter.forms.initial },
                  { label: copy.formMedial, val: selectedLetter.forms.medial },
                  { label: copy.formFinal, val: selectedLetter.forms.final },
                ] as const
              ).map((f, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl border py-2 px-1.5 ${
                    isDay
                      ? 'bg-slate-50 border-slate-200/80'
                      : 'bg-slate-950/70 border-emerald-900/50'
                  }`}
                >
                  <div
                    className={`font-arabic font-bold leading-normal ${arabicSizeCls} ${
                      isDay ? 'text-[#0c4703]' : 'text-amber-300'
                    }`}
                  >
                    {f.val}
                  </div>
                  <div
                    className={`text-[10px] font-bold mt-0.5 ${
                      isDay ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    {f.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Makhraj & Qur'anic Example */}
            <div
              className={`rounded-2xl border-l-4 px-3.5 py-2.5 space-y-1 ${
                isDay
                  ? 'bg-[#f4fbf2] border-l-[#158509]'
                  : 'bg-emerald-950/45 border-l-amber-400'
              }`}
            >
              <div
                className={`text-[10.5px] font-extrabold uppercase tracking-wider ${
                  isDay ? 'text-[#158509]' : 'text-amber-300'
                }`}
              >
                {copy.makhrajTitle}
              </div>
              <p
                className={`text-xs leading-relaxed ${
                  isDay ? 'text-slate-700' : 'text-slate-200'
                }`}
              >
                {loc(selectedLetter.makhrajUz)}
              </p>
            </div>

            <div
              onClick={() => speakArabic(selectedLetter.exampleArabic)}
              role="button"
              tabIndex={0}
              className={`rounded-2xl border p-3 flex items-center justify-between gap-3 cursor-pointer transition active:scale-[0.99] ${
                isDay
                  ? 'bg-slate-50 border-slate-200 hover:border-[#158509]'
                  : 'bg-slate-950 border-emerald-900/50 hover:border-amber-400/60'
              }`}
            >
              <div>
                <div
                  className={`text-[10px] font-extrabold uppercase tracking-wider ${
                    isDay ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  {copy.exampleTitle}
                </div>
                {showReadingHint && (
                  <div
                    className={`text-xs font-extrabold mt-0.5 ${
                      isDay ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    {loc(selectedLetter.exampleTranslit)} —{' '}
                    <span className="font-normal opacity-80">
                      ({loc(selectedLetter.exampleMeaningUz)})
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`font-arabic font-bold ${arabicSizeCls} ${
                    isDay ? 'text-[#0c4703]' : 'text-amber-300'
                  }`}
                >
                  {selectedLetter.exampleArabic}
                </span>
                <Volume2
                  className={`w-4 h-4 ${isDay ? 'text-[#158509]' : 'text-amber-400'}`}
                />
              </div>
            </div>
          </div>

          {/* Filtered 28 Letter RTL Grid */}
          <div className="grid grid-cols-4 gap-2" dir="rtl">
            {filteredAlphabet.map((item) => {
              const isSelected = selectedLetter.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedLetter(item);
                    speakArabic(item.arabic);
                  }}
                  className={`rounded-2xl border p-2.5 flex flex-col items-center justify-center transition active:scale-95 relative ${
                    isSelected
                      ? isDay
                        ? 'bg-[#158509] border-[#158509] text-white nq-keep-dark shadow-sm'
                        : 'bg-amber-400 border-amber-400 text-slate-950 shadow-sm'
                      : isDay
                      ? 'bg-white border-[#cde5c7] text-slate-800 hover:border-[#158509]'
                      : 'bg-slate-900 border-emerald-900/55 text-slate-100 hover:border-amber-400/60'
                  }`}
                >
                  <span
                    className={`absolute top-1.5 right-2 text-[9px] font-mono font-bold ${
                      isSelected
                        ? isDay
                          ? 'text-white/80'
                          : 'text-slate-900/70'
                        : 'opacity-45'
                    }`}
                  >
                    {item.id}
                  </span>
                  <span className={`font-arabic font-bold leading-snug ${arabicSizeCls}`}>
                    {item.arabic}
                  </span>
                  {showReadingHint && (
                    <span className="text-[11px] font-extrabold mt-0.5 truncate max-w-full">
                      {loc(item.nameUz)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODE 3: COLOR-CODED TAJWEED RULES                                     */}
      {/* ===================================================================== */}
      {mode === 'rules' && (
        <div className="space-y-3">
          {/* Color Legend Card */}
          <div
            className={`rounded-2xl border p-3 flex flex-wrap items-center gap-2 ${
              isDay
                ? 'bg-white border-[#cde5c7]'
                : 'bg-slate-900/95 border-emerald-800/60'
            }`}
          >
            <span
              className={`px-2.5 py-1 rounded-xl text-[10.5px] font-extrabold ${
                isDay ? 'bg-blue-50 text-blue-700' : 'bg-sky-950 text-sky-300'
              }`}
            >
              🔵 {copy.legendQalq}
            </span>
            <span
              className={`px-2.5 py-1 rounded-xl text-[10.5px] font-extrabold ${
                isDay ? 'bg-[#eef9ea] text-[#158509]' : 'bg-emerald-950 text-emerald-300'
              }`}
            >
              🟢 {copy.legendGhun}
            </span>
            <span
              className={`px-2.5 py-1 rounded-xl text-[10.5px] font-extrabold ${
                isDay ? 'bg-red-50 text-red-700' : 'bg-rose-950 text-rose-300'
              }`}
            >
              🔴 {copy.legendMadd}
            </span>
          </div>

          {TAJWEED_RULES.map((rule) => (
            <div
              key={rule.id}
              className={`rounded-3xl border p-4 space-y-3 ${
                isDay
                  ? 'bg-white border-[#cde5c7] shadow-xs'
                  : 'bg-slate-900/95 border-emerald-800/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      isDay
                        ? 'bg-[#eef9ea] border-[#b7e2ad] text-[#158509]'
                        : 'bg-emerald-950 border-emerald-800 text-amber-300'
                    }`}
                  >
                    <BookOpen className="w-3 h-3" />
                    {loc(rule.badgeUz)}
                  </span>
                  <h3
                    className={`text-sm font-extrabold leading-snug ${
                      isDay ? 'text-[#0c4703]' : 'text-white'
                    }`}
                  >
                    {loc(rule.titleUz)}
                  </h3>
                </div>
                <div
                  className={`px-3 py-1.5 rounded-xl font-arabic text-base font-bold border shrink-0 ${
                    isDay
                      ? 'bg-slate-50 border-slate-200 text-[#0c4703]'
                      : 'bg-slate-950 border-emerald-800 text-amber-300'
                  }`}
                >
                  {rule.lettersArabic}
                </div>
              </div>

              <p
                className={`text-xs leading-relaxed ${
                  isDay ? 'text-slate-700' : 'text-slate-200'
                }`}
              >
                {loc(rule.summaryUz)}
              </p>

              <div className="space-y-1.5">
                {rule.stepsUz.map((st, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2 text-xs leading-relaxed ${
                      isDay ? 'text-slate-600' : 'text-slate-300'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                        isDay ? 'text-[#158509]' : 'text-amber-400'
                      }`}
                    />
                    <span>{loc(st)}</span>
                  </div>
                ))}
              </div>

              {/* Color-Coded Qur'anic Examples */}
              <div className="space-y-2 pt-1">
                {rule.examples.map((ex, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => speakArabic(ex.arabic)}
                    className={`w-full text-left rounded-2xl border p-3 flex items-center justify-between gap-3 transition active:scale-[0.99] ${
                      isDay
                        ? 'bg-[#f8fcf7] border-[#cde5c7]'
                        : 'bg-slate-950/80 border-emerald-900/55'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      {showReadingHint && (
                        <div
                          className={`text-xs font-extrabold ${
                            isDay ? 'text-[#0c4703]' : 'text-amber-300'
                          }`}
                        >
                          {loc(ex.translit)}
                        </div>
                      )}
                      <div
                        className={`text-[11px] mt-0.5 ${
                          isDay ? 'text-slate-600' : 'text-slate-400'
                        }`}
                      >
                        {loc(ex.noteUz)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        dir="rtl"
                        className={`font-arabic font-bold ${arabicSizeCls} ${
                          isDay ? 'text-slate-900' : 'text-white'
                        }`}
                      >
                        {ex.segments.map((seg, sIdx) => (
                          <span key={sIdx} className={getSegmentColorClass(seg.tone)}>
                            {seg.text}
                          </span>
                        ))}
                      </span>
                      <Volume2 className="w-4 h-4 text-[#158509] shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODE 4: PRACTICE QUIZ                                                 */}
      {/* ===================================================================== */}
      {mode === 'quiz' && (
        <div
          className={`rounded-3xl border p-4 space-y-4 ${
            isDay
              ? 'bg-white border-[#cde5c7] shadow-xs'
              : 'bg-slate-900/95 border-emerald-800/60'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-extrabold">
            <span className="inline-flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-[#158509]" />
              <span>
                {quizIndex + 1} / {quizQuestions.length}
              </span>
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full ${
                isDay
                  ? 'bg-[#eef9ea] text-[#158509]'
                  : 'bg-emerald-950 text-amber-300'
              }`}
            >
              ✓ {quizScore}
            </span>
          </div>

          <div className="text-center space-y-2 py-2">
            <button
              type="button"
              onClick={() => speakArabic(currentQuiz.target.arabic)}
              className={`w-24 h-24 rounded-3xl border-2 mx-auto flex items-center justify-center font-arabic text-5xl font-bold transition active:scale-95 ${
                isDay
                  ? 'bg-[#eef9ea] border-[#158509] text-[#0c4703]'
                  : 'bg-emerald-950 border-amber-400 text-amber-300'
              }`}
            >
              {currentQuiz.target.arabic}
            </button>
            <p className={`text-xs font-bold ${isDay ? 'text-slate-600' : 'text-slate-300'}`}>
              {copy.quizPrompt}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {currentQuiz.options.map((opt) => {
              const isPicked = selectedOptionId === opt.id;
              const isCorrect = opt.id === currentQuiz.target.id;
              const showFeedback = selectedOptionId !== null;

              let btnCls = isDay
                ? 'bg-slate-50 border-slate-200 text-slate-800 hover:border-[#158509]'
                : 'bg-slate-950 border-emerald-900/60 text-slate-100';

              if (showFeedback) {
                if (isCorrect) {
                  btnCls = 'bg-[#158509] border-[#158509] text-white nq-keep-dark';
                } else if (isPicked) {
                  btnCls = 'bg-rose-600 border-rose-600 text-white';
                }
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectQuizOption(opt.id)}
                  className={`p-3 rounded-2xl border text-left transition active:scale-98 ${btnCls}`}
                >
                  <div className="text-sm font-extrabold">{loc(opt.nameUz)}</div>
                  <div className="text-[11px] opacity-80 truncate mt-0.5">
                    {loc(opt.soundUz)}
                  </div>
                </button>
              );
            })}
          </div>

          {selectedOptionId !== null && (
            <button
              type="button"
              onClick={() => {
                setSelectedOptionId(null);
                setQuizIndex((i) => (i + 1) % quizQuestions.length);
              }}
              className={`w-full py-3 rounded-2xl text-xs font-extrabold transition active:scale-98 ${
                isDay
                  ? 'bg-[#158509] text-white nq-keep-dark'
                  : 'bg-amber-400 text-slate-950'
              }`}
            >
              {copy.nextBtn} →
            </button>
          )}
        </div>
      )}
    </div>
  );
};
