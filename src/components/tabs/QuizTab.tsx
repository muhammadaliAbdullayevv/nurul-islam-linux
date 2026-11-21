import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  Flame,
  GraduationCap,
  HeartHandshake,
  MoonStar,
  RotateCcw,
  ScrollText,
  Shuffle,
  Sparkles,
  Trophy,
  Users,
  XCircle,
} from 'lucide-react';
import { AppLanguage } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  LocalizedQuizQuestion,
  QUIZ_DECKS,
  QuizDeckId,
  TOTAL_KNOWLEDGE_QUESTIONS,
  getLocalizedKnowledgeQuestions,
} from '../../data/knowledgeQuiz';
import {
  ACTIVITY_UPDATED_EVENT,
  computeActivitySummary,
  loadUserActivity,
  recordKnowledgeQuizAnswer,
} from '../../utils/userActivity';

interface QuizRoundItem {
  question: LocalizedQuizQuestion;
  shuffledOptions: Array<{ origIdx: 0 | 1 | 2 | 3; isCorrect: boolean }>;
}

const QUIZ_UI: Record<
  AppLanguage,
  {
    heroTitle: string;
    heroSub: string;
    mixedBtn: string;
    decksHeading: string;
    questionsCount: (n: number) => string;
    moreNeeded: (rank: string, count: number) => string;
    allMastered: string;
    hanafiNote: string;
    backToDecks: string;
    mixedTitle: string;
    masteredChip: string;
    correctTitle: string;
    reviewTitle: string;
    wrongTitle: string;
    explanationLabel: string;
    nextQuestion: string;
    finishRound: string;
    resultHeading: string;
    resultPerfect: string;
    resultGreat: string;
    resultGood: string;
    earnedXp: string;
    newlyMastered: (n: number) => string;
    playAgain: string;
    allDecks: string;
    startLabel: string;
    reviewLabel: string;
    sourceLabel: string;
    mistakesTitle: string;
    mistakesSub: (n: number) => string;
    mistakesBtn: (n: number) => string;
    noMistakesBadge: string;
  }
> = {
  uz_lat: {
    heroTitle: 'Ilm Viktorinasi',
    heroSub: "Fiqh, Qur'on, siyrat, allomalar va odob bo'yicha 120 ta savol",
    mixedBtn: 'Aralash test (10 savol · +15 XP)',
    decksHeading: "Mavzular bo'yicha to'plamlar",
    questionsCount: (n) => `${n} savol`,
    moreNeeded: (rank, c) => `${rank} maqomigacha yana ${c} ta savol`,
    allMastered: "Barcha 120 savol muvaffaqiyatli o'zlashtirildi!",
    hanafiNote: "Savollar va izohlar Hanafiy mazhabi va sahih manbalarga muvofiq tayyorlangan.",
    backToDecks: "Bo'limlar",
    mixedTitle: 'Aralash test',
    masteredChip: "O'zlashtirilgan",
    correctTitle: "Barakalla! Yangi bilim o'zlashtirildi",
    reviewTitle: "To'g'ri javob! Bilim mustahkamlandi",
    wrongTitle: "Noto'g'ri javob — izohni o'qib oling",
    explanationLabel: 'Izoh',
    nextQuestion: 'Keyingi savol',
    finishRound: "Natijani ko'rish",
    resultHeading: 'Test yakunlandi!',
    resultPerfect: 'Ajoyib! Barcha savollarga bexato javob berdingiz.',
    resultGreat: "Zo'r natija! Ilmingiz yana boyidi.",
    resultGood: "Yaxshi boshlanish! Izohlarni takrorlab yana urinib ko'ring.",
    earnedXp: "To'plangan XP",
    newlyMastered: (n) => `+${n} ta yangi savol o'zlashtirildi`,
    playAgain: 'Qayta yechish',
    allDecks: "Barcha mavzular",
    startLabel: 'Boshlash',
    reviewLabel: 'Takrorlash',
    sourceLabel: 'Manba',
    mistakesTitle: 'Xatolar ustida ishlash',
    mistakesSub: (n) => `${n} ta savolda xato qilgansiz — to'g'ri topib o'zlashtiring`,
    mistakesBtn: (n) => `Xatolarni tuzatish (${n})`,
    noMistakesBadge: "Barcha yechilgan savollar bexato o'zlashtirilgan!",
  },
  uz_cyr: {
    heroTitle: 'Илм Викторинаси',
    heroSub: 'Фиқҳ, Қуръон, сийрат, алломалар ва одоб бўйича 120 та савол',
    mixedBtn: 'Аралаш тест (10 савол · +15 XP)',
    decksHeading: 'Мавзулар бўйича тўпламлар',
    questionsCount: (n) => `${n} савол`,
    moreNeeded: (rank, c) => `${rank} мақомигача яна ${c} та савол`,
    allMastered: 'Барча 120 савол муваффақиятли ўзлаштирилди!',
    hanafiNote: 'Саволлар ва изоҳлар Ҳанафий мазҳаби ва саҳиҳ манбаларга мувофиқ тайёрланган.',
    backToDecks: 'Бўлимлар',
    mixedTitle: 'Аралаш тест',
    masteredChip: 'Ўзлаштирилган',
    correctTitle: 'Баракалла! Янги билим ўзлаштирилди',
    reviewTitle: 'Тўғри жавоб! Билим мустаҳкамланди',
    wrongTitle: 'Нотўғри жавоб — изоҳни ўқиб олинг',
    explanationLabel: 'Изоҳ',
    nextQuestion: 'Кейинги савол',
    finishRound: 'Натижани кўриш',
    resultHeading: 'Тест якунланди!',
    resultPerfect: 'Ажойиб! Барча саволларга бехато жавоб бердингиз.',
    resultGreat: 'Зўр натижа! Илмингиз яна бойиди.',
    resultGood: 'Яхши бошланиш! Изоҳларни такрорлаб яна уриниб кўринг.',
    earnedXp: 'Тўпланган XP',
    newlyMastered: (n) => `+${n} та янги савол ўзлаштирилди`,
    playAgain: 'Қайта ечиш',
    allDecks: 'Барча мавзулар',
    startLabel: 'Бошлаш',
    reviewLabel: 'Такрорлаш',
    sourceLabel: 'Манба',
    mistakesTitle: 'Хатолар устида ишлаш',
    mistakesSub: (n) => `${n} та саволда хато қилгансиз — тўғри топиб ўзлаштиринг`,
    mistakesBtn: (n) => `Хатоларни тузатиш (${n})`,
    noMistakesBadge: 'Барча ечилган саволлар бехато ўзлаштирилган!',
  },
  ru: {
    heroTitle: 'Исламская викторина',
    heroSub: '120 вопросов по фикху, Корану, сире, учёным и исламскому адабу',
    mixedBtn: 'Смешанный тест (10 вопросов · +15 XP)',
    decksHeading: 'Тематические наборы',
    questionsCount: (n) => `${n} вопр.`,
    moreNeeded: (rank, c) => `До ранга «${rank}» ещё ${c} вопросов`,
    allMastered: 'Все 120 вопросов успешно освоены!',
    hanafiNote: 'Вопросы и пояснения составлены по ханафитскому мазхабу и достоверным источникам.',
    backToDecks: 'Темы',
    mixedTitle: 'Смешанный тест',
    masteredChip: 'Освоен',
    correctTitle: 'Отлично! Новый вопрос освоен',
    reviewTitle: 'Верно! Знание закреплено',
    wrongTitle: 'Неверно — прочитайте пояснение',
    explanationLabel: 'Пояснение',
    nextQuestion: 'Следующий вопрос',
    finishRound: 'Показать результат',
    resultHeading: 'Тест завершён!',
    resultPerfect: 'Превосходно! Все ответы безошибочны.',
    resultGreat: 'Отличный результат! Ваши знания растут.',
    resultGood: 'Хорошее начало! Повторите пояснения и попробуйте снова.',
    earnedXp: 'Заработано XP',
    newlyMastered: (n) => `+${n} новых вопросов освоено`,
    playAgain: 'Пройти снова',
    allDecks: 'Все темы',
    startLabel: 'Начать',
    reviewLabel: 'Повторить',
    sourceLabel: 'Источник',
    mistakesTitle: 'Работа над ошибками',
    mistakesSub: (n) => `Вопросов для исправления: ${n} — ответьте верно, чтобы освоить`,
    mistakesBtn: (n) => `Исправить ошибки (${n})`,
    noMistakesBadge: 'Нет ошибок — все пройденные вопросы освоены верно!',
  },
  en: {
    heroTitle: 'Islamic Knowledge Quiz',
    heroSub: '120 questions across Fiqh, Quran, Seerah, Scholars & Ethics',
    mixedBtn: 'Mixed Quiz (10 questions · +15 XP)',
    decksHeading: 'Topic Decks',
    questionsCount: (n) => `${n} Qs`,
    moreNeeded: (rank, c) => `${c} more questions to reach ${rank}`,
    allMastered: 'All 120 questions mastered!',
    hanafiNote: 'Questions and explanations follow the Hanafi school and authentic Islamic sources.',
    backToDecks: 'Decks',
    mixedTitle: 'Mixed Quiz',
    masteredChip: 'Mastered',
    correctTitle: 'Well done! New question mastered',
    reviewTitle: 'Correct! Knowledge reinforced',
    wrongTitle: 'Not quite — read the explanation below',
    explanationLabel: 'Explanation',
    nextQuestion: 'Next Question',
    finishRound: 'See Results',
    resultHeading: 'Quiz Complete!',
    resultPerfect: 'Flawless! Every single answer was correct.',
    resultGreat: 'Great result! Your Islamic knowledge is growing.',
    resultGood: 'Good start! Review the notes and try another round.',
    earnedXp: 'XP Earned',
    newlyMastered: (n) => `+${n} newly mastered`,
    playAgain: 'Play Again',
    allDecks: 'All Decks',
    startLabel: 'Start',
    reviewLabel: 'Review',
    sourceLabel: 'Source',
    mistakesTitle: 'Mistake Review',
    mistakesSub: (n) => `${n} missed question${n === 1 ? '' : 's'} waiting to be mastered`,
    mistakesBtn: (n) => `Fix Mistakes (${n})`,
    noMistakesBadge: 'Zero pending mistakes — all answered questions mastered!',
  },
};

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }
  return copy;
}

function buildRound(
  questions: LocalizedQuizQuestion[],
  masteredIds: Set<string>,
  count: number
): QuizRoundItem[] {
  const unmastered = shuffleArray(questions.filter((q) => !masteredIds.has(q.id)));
  const mastered = shuffleArray(questions.filter((q) => masteredIds.has(q.id)));
  const picked = [...unmastered, ...mastered].slice(0, Math.min(count, questions.length));
  return picked.map((q) => {
    const indexed = ([0, 1, 2, 3] as const).map((idx) => ({
      origIdx: idx,
      isCorrect: idx === q.correctIndex,
    }));
    return {
      question: q,
      shuffledOptions: shuffleArray(indexed),
    };
  });
}

function renderDeckIcon(deckId: QuizDeckId) {
  if (deckId === 'prayer') return <Sparkles className="w-5 h-5" />;
  if (deckId === 'quran') return <BookOpen className="w-5 h-5" />;
  if (deckId === 'prophets') return <ScrollText className="w-5 h-5" />;
  if (deckId === 'scholars') return <Users className="w-5 h-5" />;
  if (deckId === 'ethics') return <HeartHandshake className="w-5 h-5" />;
  return <MoonStar className="w-5 h-5" />;
}

export const QuizTab: React.FC = () => {
  const { isDay } = useTheme();
  const { language } = useLanguage();
  const ui = QUIZ_UI[language] || QUIZ_UI.uz_lat;

  const [activityTick, setActivityTick] = useState(0);
  const [activeDeck, setActiveDeck] = useState<QuizDeckId | 'mixed' | 'mistakes' | null>(null);
  const [roundItems, setRoundItems] = useState<QuizRoundItem[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [pickedOptionIdx, setPickedOptionIdx] = useState<number | null>(null);
  const [lastXpAwarded, setLastXpAwarded] = useState(0);
  const [lastWasNew, setLastWasNew] = useState(false);
  const [roundScore, setRoundScore] = useState(0);
  const [roundXp, setRoundXp] = useState(0);
  const [roundNewlyMastered, setRoundNewlyMastered] = useState(0);
  const [streak, setStreak] = useState(0);
  const [roundFinished, setRoundFinished] = useState(false);

  useEffect(() => {
    const refresh = () => setActivityTick((v) => v + 1);
    window.addEventListener(ACTIVITY_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(ACTIVITY_UPDATED_EVENT, refresh);
  }, []);

  // Intercept Android back button when inside a quiz round to return to deck hub cleanly
  useEffect(() => {
    if (!activeDeck) return;
    const onAndroidBack = (e: Event) => {
      e.preventDefault();
      setActiveDeck(null);
      setRoundFinished(false);
      setPickedOptionIdx(null);
    };
    window.addEventListener('nq:android-back', onAndroidBack);
    return () => window.removeEventListener('nq:android-back', onAndroidBack);
  }, [activeDeck]);

  const summary = useMemo(() => {
    void activityTick;
    return computeActivitySummary(language);
  }, [activityTick, language]);

  const masteredSet = useMemo(() => {
    void activityTick;
    return new Set(loadUserActivity().masteredKnowledgeIds);
  }, [activityTick]);

  const missedSet = useMemo(() => {
    void activityTick;
    return new Set(loadUserActivity().missedKnowledgeIds);
  }, [activityTick]);

  const allQuestions = useMemo(() => getLocalizedKnowledgeQuestions(language), [language]);

  const deckStats = useMemo(() => {
    const map: Record<QuizDeckId, { total: number; mastered: number }> = {
      prayer: { total: 0, mastered: 0 },
      quran: { total: 0, mastered: 0 },
      prophets: { total: 0, mastered: 0 },
      worship: { total: 0, mastered: 0 },
      scholars: { total: 0, mastered: 0 },
      ethics: { total: 0, mastered: 0 },
    };
    for (const q of allQuestions) {
      map[q.deck].total += 1;
      if (masteredSet.has(q.id)) {
        map[q.deck].mastered += 1;
      }
    }
    return map;
  }, [allQuestions, masteredSet]);

  const startRound = (target: QuizDeckId | 'mixed' | 'mistakes') => {
    const act = loadUserActivity();
    const freshSet = new Set(act.masteredKnowledgeIds);
    const freshMissed = new Set(act.missedKnowledgeIds);
    let pool: LocalizedQuizQuestion[];
    if (target === 'mixed') {
      pool = allQuestions;
    } else if (target === 'mistakes') {
      const missedPool = allQuestions.filter((q) => freshMissed.has(q.id));
      pool = missedPool.length > 0 ? missedPool : allQuestions;
    } else {
      pool = allQuestions.filter((q) => q.deck === target);
    }
    const count = target === 'mixed' ? 10 : pool.length;
    setRoundItems(buildRound(pool, freshSet, count));
    setActiveDeck(target);
    setQIndex(0);
    setPickedOptionIdx(null);
    setLastXpAwarded(0);
    setLastWasNew(false);
    setRoundScore(0);
    setRoundXp(0);
    setRoundNewlyMastered(0);
    setStreak(0);
    setRoundFinished(false);
  };

  // Re-localize active round text if user switches language mid-session
  const currentItem = roundItems[qIndex] || null;
  const localizedCurrentQuestion = useMemo(() => {
    if (!currentItem) return null;
    return allQuestions.find((q) => q.id === currentItem.question.id) || currentItem.question;
  }, [allQuestions, currentItem]);

  const handlePickOption = (optIdx: number) => {
    if (!currentItem || pickedOptionIdx !== null) return;
    setPickedOptionIdx(optIdx);
    const chosen = currentItem.shuffledOptions[optIdx];
    if (chosen?.isCorrect) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setRoundScore((s) => s + 1);
      const { isNewlyMastered, xpAwarded } = recordKnowledgeQuizAnswer(
        currentItem.question.id,
        true
      );
      setLastXpAwarded(xpAwarded);
      setLastWasNew(isNewlyMastered);
      setRoundXp((prev) => prev + xpAwarded);
      if (isNewlyMastered) {
        setRoundNewlyMastered((prev) => prev + 1);
      }
    } else {
      recordKnowledgeQuizAnswer(currentItem.question.id, false);
      setStreak(0);
      setLastXpAwarded(0);
      setLastWasNew(false);
    }
  };

  const handleNext = () => {
    if (qIndex + 1 >= roundItems.length) {
      setRoundFinished(true);
    } else {
      setQIndex((i) => i + 1);
      setPickedOptionIdx(null);
      setLastXpAwarded(0);
      setLastWasNew(false);
    }
  };

  const cardCls = isDay
    ? 'rounded-2xl bg-white border border-[#dde3ea] shadow-xs'
    : 'rounded-2xl bg-slate-900/90 border border-emerald-900/60';
  const subTextCls = isDay ? 'text-slate-500' : 'text-slate-400';

  const activeDeckTitle = useMemo(() => {
    if (!activeDeck) return '';
    if (activeDeck === 'mixed') return ui.mixedTitle;
    if (activeDeck === 'mistakes') return ui.mistakesTitle;
    const found = QUIZ_DECKS.find((d) => d.id === activeDeck);
    return found ? found.title[language] || found.title.uz_lat : '';
  }, [activeDeck, language, ui.mistakesTitle, ui.mixedTitle]);

  // ==================== HUB SCREEN ====================
  if (!activeDeck) {
    return (
      <div className={`space-y-3.5 pb-6 ${isDay ? 'text-slate-900' : 'text-slate-100'}`}>
        {/* Flagship Hero Card */}
        <div
          className={`nq-keep-dark rounded-3xl p-4 text-white shadow-lg border space-y-3 ${
            isDay ? 'nq-hero-day border-[#0a4306]' : 'nq-hero-night border-emerald-800/60'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 border border-[#fde68a]/40 text-[#fde68a] text-[11px] font-bold">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{summary.knowledgeRank}</span>
              </div>
              <h1 className="text-lg font-extrabold tracking-tight text-white mt-1.5">
                {ui.heroTitle}
              </h1>
              <p className="text-xs text-white/80 mt-0.5 leading-snug">{ui.heroSub}</p>
            </div>
            <div className="px-3 py-2 rounded-2xl bg-black/25 border border-white/15 text-center shrink-0">
              <div className="text-lg font-extrabold text-[#fde68a] tabular-nums leading-none">
                {summary.knowledgeMastered}
              </div>
              <div className="text-[10px] text-white/75 mt-0.5 font-semibold">
                / {TOTAL_KNOWLEDGE_QUESTIONS}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-white/85">
                {summary.knowledgeNextGoal !== null && summary.knowledgeNextRank
                  ? ui.moreNeeded(
                      summary.knowledgeNextRank,
                      Math.max(1, summary.knowledgeNextGoal - summary.knowledgeMastered)
                    )
                  : ui.allMastered}
              </span>
              <span className="font-mono font-bold text-[#d0f39f] tabular-nums">
                {summary.knowledgeProgressPct}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-white/15 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#d0f39f] to-[#fde68a] transition-all duration-300"
                style={{ width: `${Math.max(4, summary.knowledgeProgressPct)}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => startRound('mixed')}
            className="w-full py-2.5 px-4 rounded-2xl bg-[#fde68a] hover:bg-[#fcd34d] text-[#0c4703] text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.99]"
          >
            <Shuffle className="w-4 h-4" />
            <span>{ui.mixedBtn}</span>
          </button>
        </div>

        {/* Smart Mistake Review Card ("Xatolar ustida ishlash") */}
        {missedSet.size > 0 ? (
          <div
            className={`rounded-2xl p-3.5 border flex items-center justify-between gap-3 ${
              isDay
                ? 'bg-rose-50/90 border-rose-200 text-rose-950'
                : 'bg-rose-950/40 border-rose-800/70 text-rose-100'
            }`}
          >
            <div className="flex items-start gap-2.5 min-w-0">
              <div
                className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
                  isDay
                    ? 'bg-rose-100 border-rose-200 text-rose-600'
                    : 'bg-rose-900/60 border-rose-700/70 text-rose-300'
                }`}
              >
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-extrabold leading-snug">{ui.mistakesTitle}</h3>
                <p
                  className={`text-[11px] mt-0.5 leading-snug ${
                    isDay ? 'text-rose-700' : 'text-rose-200/80'
                  }`}
                >
                  {ui.mistakesSub(missedSet.size)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => startRound('mistakes')}
              className={`px-3 py-2 rounded-xl text-[11px] font-extrabold shrink-0 transition active:scale-[0.98] ${
                isDay
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                  : 'bg-rose-500 hover:bg-rose-400 text-white shadow-xs'
              }`}
            >
              {ui.mistakesBtn(missedSet.size)}
            </button>
          </div>
        ) : summary.knowledgeMastered > 0 ? (
          <div
            className={`rounded-2xl px-3.5 py-2.5 border flex items-center gap-2 text-[11px] font-bold ${
              isDay
                ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                : 'bg-emerald-950/60 border-emerald-800/70 text-emerald-300'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{ui.noMistakesBadge}</span>
          </div>
        ) : null}

        {/* 6 Topic Decks Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2
              className={`text-xs font-bold uppercase tracking-wider ${
                isDay ? 'text-[#0c4703]' : 'text-emerald-400'
              }`}
            >
              {ui.decksHeading}
            </h2>
            <span className={`text-[11px] font-semibold ${subTextCls}`}>
              6 × 20 = {TOTAL_KNOWLEDGE_QUESTIONS}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {QUIZ_DECKS.map((deck) => {
              const stat = deckStats[deck.id];
              const pct = stat.total > 0 ? Math.round((stat.mastered / stat.total) * 100) : 0;
              const isComplete = stat.total > 0 && stat.mastered >= stat.total;

              const iconStyle =
                deck.accent === 'emerald'
                  ? isDay
                    ? 'bg-[#eef9ea] text-[#158509] border-[#c5e8bc]'
                    : 'bg-emerald-950 text-emerald-400 border-emerald-800/70'
                  : deck.accent === 'amber'
                  ? isDay
                    ? 'bg-amber-50 text-amber-600 border-amber-200'
                    : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  : deck.accent === 'sky'
                  ? isDay
                    ? 'bg-sky-50 text-sky-600 border-sky-200'
                    : 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                  : deck.accent === 'rose'
                  ? isDay
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                  : deck.accent === 'teal'
                  ? isDay
                    ? 'bg-teal-50 text-teal-600 border-teal-200'
                    : 'bg-teal-500/15 text-teal-300 border-teal-500/30'
                  : isDay
                  ? 'bg-violet-50 text-violet-600 border-violet-200'
                  : 'bg-violet-500/15 text-violet-300 border-violet-500/30';

              const barColor =
                deck.accent === 'emerald'
                  ? isDay
                    ? 'bg-[#158509]'
                    : 'bg-emerald-400'
                  : deck.accent === 'amber'
                  ? 'bg-amber-500'
                  : deck.accent === 'sky'
                  ? 'bg-sky-500'
                  : deck.accent === 'rose'
                  ? 'bg-rose-500'
                  : deck.accent === 'teal'
                  ? 'bg-teal-500'
                  : 'bg-violet-500';

              return (
                <button
                  key={deck.id}
                  type="button"
                  onClick={() => startRound(deck.id)}
                  className={`${cardCls} p-3.5 text-left flex flex-col justify-between gap-2.5 transition active:scale-[0.98] ${
                    isDay ? 'hover:border-[#158509]/50' : 'hover:border-amber-400/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${iconStyle}`}
                    >
                      {renderDeckIcon(deck.id)}
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold tabular-nums ${
                        isComplete
                          ? isDay
                            ? 'bg-[#158509] text-white nq-keep-dark'
                            : 'bg-emerald-600 text-white'
                          : isDay
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {stat.mastered}/{stat.total}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-[13px] font-bold leading-snug">
                      {deck.title[language] || deck.title.uz_lat}
                    </h3>
                    <p className={`text-[11px] mt-0.5 leading-snug line-clamp-2 ${subTextCls}`}>
                      {deck.subtitle[language] || deck.subtitle.uz_lat}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className={`h-1.5 rounded-full overflow-hidden ${isDay ? 'bg-slate-100' : 'bg-slate-800'}`}>
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10.5px] font-bold">
                      <span className={subTextCls}>{ui.questionsCount(stat.total)}</span>
                      <span className={isDay ? 'text-[#158509]' : 'text-amber-300'}>
                        {isComplete ? ui.reviewLabel : ui.startLabel} →
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hanafi Authenticity Note */}
        <div
          className={`${cardCls} px-3.5 py-2.5 flex items-start gap-2.5 text-[11px] leading-relaxed ${subTextCls}`}
        >
          <Award className={`w-4 h-4 shrink-0 mt-0.5 ${isDay ? 'text-[#158509]' : 'text-amber-400'}`} />
          <span>{ui.hanafiNote}</span>
        </div>
      </div>
    );
  }

  // ==================== ROUND RESULT SCREEN ====================
  if (roundFinished) {
    const total = Math.max(1, roundItems.length);
    const ratio = roundScore / total;
    const message =
      ratio === 1 ? ui.resultPerfect : ratio >= 0.7 ? ui.resultGreat : ui.resultGood;

    return (
      <div className={`space-y-4 pb-6 animate-in fade-in ${isDay ? 'text-slate-900' : 'text-slate-100'}`}>
        <div
          className={`nq-keep-dark rounded-3xl p-5 text-white shadow-lg border text-center space-y-3 ${
            isDay ? 'nq-hero-day border-[#0a4306]' : 'nq-hero-night border-emerald-800/60'
          }`}
        >
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/15 border border-[#fde68a]/40 flex items-center justify-center text-[#fde68a]">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#d0f39f]">
              {activeDeckTitle}
            </div>
            <h2 className="text-xl font-extrabold text-white mt-0.5">{ui.resultHeading}</h2>
            <p className="text-xs text-white/80 mt-1">{message}</p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="rounded-2xl bg-black/25 border border-white/15 py-2.5 px-3">
              <div className="text-2xl font-extrabold text-white tabular-nums">
                {roundScore} / {total}
              </div>
              <div className="text-[10.5px] text-white/75 mt-0.5">{summary.knowledgeRank}</div>
            </div>
            <div className="rounded-2xl bg-black/25 border border-white/15 py-2.5 px-3">
              <div className="text-2xl font-extrabold text-[#fde68a] tabular-nums">
                +{roundXp} XP
              </div>
              <div className="text-[10.5px] text-[#d0f39f] mt-0.5">{ui.earnedXp}</div>
            </div>
          </div>

          {roundNewlyMastered > 0 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d0f39f]/20 border border-[#d0f39f]/40 text-[#d0f39f] text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{ui.newlyMastered(roundNewlyMastered)}</span>
            </div>
          )}
        </div>

        {/* Updated Global Progress */}
        <div className={`${cardCls} p-4 space-y-2`}>
          <div className="flex items-center justify-between text-xs font-bold">
            <span>{summary.knowledgeRank}</span>
            <span className={`font-mono ${isDay ? 'text-[#158509]' : 'text-amber-300'}`}>
              {summary.knowledgeMastered} / {TOTAL_KNOWLEDGE_QUESTIONS}
            </span>
          </div>
          <div className={`h-2 rounded-full overflow-hidden ${isDay ? 'bg-slate-100' : 'bg-slate-800'}`}>
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isDay ? 'bg-[#158509]' : 'bg-amber-400'
              }`}
              style={{ width: `${summary.knowledgeProgressPct}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => startRound(activeDeck)}
            className={`py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-[0.99] ${
              isDay
                ? 'bg-[#158509] hover:bg-[#0c5007] text-white nq-keep-dark shadow-xs'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{ui.playAgain}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveDeck(null);
              setRoundFinished(false);
            }}
            className={`py-3 px-4 rounded-2xl text-xs font-bold border flex items-center justify-center gap-1.5 transition active:scale-[0.99] ${
              isDay
                ? 'bg-white border-[#dde3ea] text-slate-700 hover:border-[#158509]'
                : 'bg-slate-900 border-emerald-900/60 text-slate-200 hover:border-amber-400'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{ui.allDecks}</span>
          </button>
        </div>
      </div>
    );
  }

  // ==================== ACTIVE QUESTION SCREEN ====================
  if (!currentItem || !localizedCurrentQuestion) return null;
  const isAnswered = pickedOptionIdx !== null;
  const pickedCorrect =
    pickedOptionIdx !== null && Boolean(currentItem.shuffledOptions[pickedOptionIdx]?.isCorrect);
  const alreadyMastered = masteredSet.has(currentItem.question.id);
  const letters = ['A', 'B', 'C', 'D'];
  const progressPct = Math.round(((qIndex + (isAnswered ? 1 : 0)) / Math.max(1, roundItems.length)) * 100);

  return (
    <div className={`space-y-2 pb-2 animate-in fade-in ${isDay ? 'text-slate-900' : 'text-slate-100'}`}>
      {/* Top Quiz Header */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => {
            setActiveDeck(null);
            setPickedOptionIdx(null);
          }}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-xs font-bold transition ${
            isDay
              ? 'bg-white border-[#dde3ea] text-slate-700 hover:border-[#158509]'
              : 'bg-slate-900 border-emerald-900/60 text-slate-200'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{ui.backToDecks}</span>
        </button>

        <span className="text-xs font-bold truncate">{activeDeckTitle}</span>

        <div className="flex items-center gap-1.5 shrink-0">
          {streak >= 2 && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 text-[11px] font-extrabold tabular-nums">
              <Flame className="w-3 h-3" />
              {streak}
            </span>
          )}
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${
              isDay
                ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                : 'bg-emerald-950 border-emerald-800 text-amber-300'
            }`}
          >
            {qIndex + 1} / {roundItems.length}
          </span>
        </div>
      </div>

      {/* Round Progress Bar */}
      <div className={`h-1.5 rounded-full overflow-hidden ${isDay ? 'bg-slate-200' : 'bg-slate-800'}`}>
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isDay ? 'bg-[#158509]' : 'bg-amber-400'
          }`}
          style={{ width: `${Math.max(6, progressPct)}%` }}
        />
      </div>

      {/* Question Hero Card */}
      <div
        className={`nq-keep-dark rounded-2xl p-3.5 text-white shadow-md border space-y-1.5 ${
          isDay ? 'nq-hero-day border-[#0a4306]' : 'nq-hero-night border-emerald-800/60'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#d0f39f]">
            #{qIndex + 1} · {QUIZ_DECKS.find((d) => d.id === currentItem.question.deck)?.title[language]}
          </span>
          {alreadyMastered && !isAnswered && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/15 text-[#d0f39f] text-[10px] font-bold">
              <Check className="w-3 h-3" />
              {ui.masteredChip}
            </span>
          )}
        </div>
        <h2 className="text-[14.5px] font-bold leading-snug text-white">
          {localizedCurrentQuestion.question}
        </h2>
      </div>

      {/* 4 Answer Options */}
      <div className="space-y-1.5">
        {currentItem.shuffledOptions.map((opt, idx) => {
          const isPicked = pickedOptionIdx === idx;
          let btnCls = isDay
            ? 'bg-white border-[#dde3ea] text-slate-800 hover:border-[#158509]'
            : 'bg-slate-900 border-emerald-900/60 text-slate-100 hover:border-amber-400/70';
          let badgeCls = isDay
            ? 'bg-[#eef9ea] text-[#0c4703] border-[#c5e8bc]'
            : 'bg-emerald-950 text-amber-300 border-emerald-800';

          if (isAnswered) {
            if (opt.isCorrect) {
              btnCls = isDay
                ? 'bg-[#158509] border-[#0c4703] text-white nq-keep-dark shadow-xs'
                : 'bg-emerald-700 border-emerald-500 text-white shadow-xs';
              badgeCls = 'bg-white/20 text-white border-white/30';
            } else if (isPicked && !opt.isCorrect) {
              btnCls = isDay
                ? 'bg-rose-50 border-rose-400 text-rose-800'
                : 'bg-rose-950/70 border-rose-500 text-rose-200';
              badgeCls = isDay
                ? 'bg-rose-200 text-rose-900 border-rose-300'
                : 'bg-rose-900 text-rose-200 border-rose-700';
            } else {
              btnCls = isDay
                ? 'bg-white/60 border-slate-200 text-slate-400'
                : 'bg-slate-900/50 border-slate-800 text-slate-500';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={isAnswered}
              onClick={() => handlePickOption(idx)}
              className={`w-full py-2.5 px-3 rounded-xl border text-left flex items-center gap-2.5 transition active:scale-[0.99] ${btnCls}`}
            >
              <span
                className={`w-6 h-6 rounded-lg border text-[11px] font-extrabold flex items-center justify-center shrink-0 ${badgeCls}`}
              >
                {isAnswered && opt.isCorrect ? (
                  <Check className="w-3.5 h-3.5" />
                ) : isAnswered && isPicked && !opt.isCorrect ? (
                  <XCircle className="w-3.5 h-3.5" />
                ) : (
                  letters[idx]
                )}
              </span>
              <span className="text-xs font-semibold leading-snug flex-1">
                {localizedCurrentQuestion.options[opt.origIdx]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Feedback & Explanation Box */}
      {isAnswered && (
        <div className="space-y-2 animate-in fade-in">
          <div
            className={`rounded-2xl border p-3 space-y-1.5 ${
              pickedCorrect
                ? isDay
                  ? 'bg-[#eef9ea] border-[#b7e2ad] text-[#0c4703]'
                  : 'bg-emerald-950/70 border-emerald-700/70 text-emerald-200'
                : isDay
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-rose-950/50 border-rose-800/70 text-rose-200'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-extrabold">
                {pickedCorrect ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 shrink-0" />
                )}
                <span>
                  {pickedCorrect
                    ? lastWasNew
                      ? ui.correctTitle
                      : ui.reviewTitle
                    : ui.wrongTitle}
                </span>
              </div>
              {lastXpAwarded > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-extrabold shrink-0 ${
                    isDay
                      ? 'bg-[#158509] text-white nq-keep-dark'
                      : 'bg-amber-400 text-slate-950'
                  }`}
                >
                  +{lastXpAwarded} XP
                </span>
              )}
            </div>
            <p className="text-[11.5px] leading-snug opacity-90">
              <span className="font-bold">{ui.explanationLabel}: </span>
              {localizedCurrentQuestion.explanation}
            </p>
            {localizedCurrentQuestion.source && (
              <div>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10.5px] font-bold border ${
                    pickedCorrect
                      ? isDay
                        ? 'bg-white/80 border-[#b7e2ad] text-[#0c4703]'
                        : 'bg-emerald-900/50 border-emerald-700/70 text-emerald-100'
                      : isDay
                      ? 'bg-white/80 border-rose-200 text-rose-800'
                      : 'bg-rose-900/50 border-rose-700/70 text-rose-100'
                  }`}
                >
                  <BookOpen className="w-3 h-3 shrink-0" />
                  <span>
                    {ui.sourceLabel}: {localizedCurrentQuestion.source}
                  </span>
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition active:scale-[0.99] ${
              isDay
                ? 'bg-[#158509] hover:bg-[#0c5007] text-white nq-keep-dark shadow-sm'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm'
            }`}
          >
            <span>{qIndex + 1 >= roundItems.length ? ui.finishRound : ui.nextQuestion}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
