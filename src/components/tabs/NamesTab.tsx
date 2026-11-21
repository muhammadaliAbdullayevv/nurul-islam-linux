import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Check, Flame, RotateCcw, Search, Sparkles, Swords, Trophy } from 'lucide-react';
import { NAMES_OF_ALLAH, getLocalizedAllahName } from '../../data/names99';
import { NamesBattleArena } from '../NamesBattleArena';
import { AllahName, AppLanguage } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  ACTIVITY_UPDATED_EVENT,
  computeActivitySummary,
  loadUserActivity,
  recordNameQuizAnswer,
  recordNameQuizSessionComplete,
} from '../../utils/userActivity';

interface NamesTabProps {
  initialMode?: 'list' | 'quiz' | 'battle';
}

interface QuizQuestion {
  target: AllahName;
  options: AllahName[];
}

const QUIZ_UI: Record<
  AppLanguage,
  {
    listTab: string;
    quizTab: string;
    battleTab: string;
    questionOf: (idx: number, total: number) => string;
    prompt: string;
    correctBanner: string;
    wrongBanner: string;
    nextBtn: string;
    finishBtn: string;
    roundDoneTitle: string;
    roundDoneSub: (score: number, total: number) => string;
    xpEarnedLabel: string;
    masteredLabel: string;
    playAgainBtn: string;
    backToListBtn: string;
    streakLabel: (n: number) => string;
    masteredBadge: string;
  }
> = {
  uz_lat: {
    listTab: "99 Ism",
    quizTab: 'Test (+XP)',
    battleTab: 'Bellashuv 1v1',
    questionOf: (i, tot) => `Savol ${i} / ${tot}`,
    prompt: "Ushbu muborak ismning ma'nosini tanlang",
    correctBanner: "Barakalla! To'g'ri javob",
    wrongBanner: "To'g'ri javob:",
    nextBtn: 'Keyingi savol',
    finishBtn: 'Natijani ko‘rish',
    roundDoneTitle: 'Raund yakunlandi!',
    roundDoneSub: (s, tot) => `${tot} ta savoldan ${s} tasiga to'g'ri javob berdingiz`,
    xpEarnedLabel: 'Olingan XP',
    masteredLabel: "O'zlashtirilgan ismlar",
    playAgainBtn: 'Yana test yechish',
    backToListBtn: "Ro'yxatga qaytish",
    streakLabel: (n) => `${n} ketma-ket`,
    masteredBadge: "O'zlashtirildi",
  },
  uz_cyr: {
    listTab: '99 Исм',
    quizTab: 'Тест (+XP)',
    battleTab: 'Беллашув 1v1',
    questionOf: (i, tot) => `Савол ${i} / ${tot}`,
    prompt: 'Ушбу муборак исмнинг маъносини танланг',
    correctBanner: 'Баракалла! Тўғри жавоб',
    wrongBanner: 'Тўғри жавоб:',
    nextBtn: 'Кейинги савол',
    finishBtn: 'Натижани кўриш',
    roundDoneTitle: 'Раунд якунланди!',
    roundDoneSub: (s, tot) => `${tot} та саволдан ${s} тасига тўғри жавоб бердингиз`,
    xpEarnedLabel: 'Олинган XP',
    masteredLabel: 'Ўзлаштирилган исмлар',
    playAgainBtn: 'Яна тест ечиш',
    backToListBtn: 'Рўйхатга қайтиш',
    streakLabel: (n) => `${n} кетма-кет`,
    masteredBadge: 'Ўзлаштирилди',
  },
  ru: {
    listTab: '99 Имён',
    quizTab: 'Тест (+XP)',
    battleTab: 'Дуэль 1v1',
    questionOf: (i, tot) => `Вопрос ${i} из ${tot}`,
    prompt: 'Выберите значение этого прекрасного имени',
    correctBanner: 'Отлично! Верный ответ',
    wrongBanner: 'Правильный ответ:',
    nextBtn: 'Следующий вопрос',
    finishBtn: 'Показать итог',
    roundDoneTitle: 'Раунд завершён!',
    roundDoneSub: (s, tot) => `Верных ответов: ${s} из ${tot}`,
    xpEarnedLabel: 'Получено XP',
    masteredLabel: 'Освоено имён',
    playAgainBtn: 'Пройти ещё раунд',
    backToListBtn: 'Вернуться к списку',
    streakLabel: (n) => `${n} подряд`,
    masteredBadge: 'Освоено',
  },
  en: {
    listTab: '99 Names',
    quizTab: 'Solo Quiz',
    battleTab: '1v1 Battle',
    questionOf: (i, tot) => `Question ${i} of ${tot}`,
    prompt: 'Choose the meaning of this blessed Name',
    correctBanner: 'Well done! Correct answer',
    wrongBanner: 'Correct answer:',
    nextBtn: 'Next Question',
    finishBtn: 'View Results',
    roundDoneTitle: 'Round Complete!',
    roundDoneSub: (s, tot) => `You answered ${s} out of ${tot} correctly`,
    xpEarnedLabel: 'XP Earned',
    masteredLabel: 'Names Mastered',
    playAgainBtn: 'Play Another Round',
    backToListBtn: 'Back to List',
    streakLabel: (n) => `${n} streak`,
    masteredBadge: 'Mastered',
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

function buildQuizRound(masteredIds: number[], lang: AppLanguage, count = 10): QuizQuestion[] {
  const masteredSet = new Set(masteredIds);
  const unmastered = shuffleArray(NAMES_OF_ALLAH.filter((n) => !masteredSet.has(n.number)));
  const mastered = shuffleArray(NAMES_OF_ALLAH.filter((n) => masteredSet.has(n.number)));
  const targets = [...unmastered, ...mastered].slice(0, count);

  return targets.map((target) => {
    const targetMeaning = getLocalizedAllahName(target, lang).meaning.toLowerCase();
    const seenMeanings = new Set<string>([targetMeaning]);
    const distractors: AllahName[] = [];

    for (const cand of shuffleArray(NAMES_OF_ALLAH)) {
      if (cand.number === target.number) continue;
      const candMeaning = getLocalizedAllahName(cand, lang).meaning.toLowerCase();
      if (seenMeanings.has(candMeaning)) continue;
      seenMeanings.add(candMeaning);
      distractors.push(cand);
      if (distractors.length === 3) break;
    }

    return {
      target,
      options: shuffleArray([target, ...distractors]),
    };
  });
}

export const NamesTab: React.FC<NamesTabProps> = ({ initialMode = 'list' }) => {
  const { isDay } = useTheme();
  const { language, t } = useLanguage();
  const ui = QUIZ_UI[language] || QUIZ_UI.uz_lat;

  const [mode, setMode] = useState<'list' | 'quiz' | 'battle'>(initialMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedName, setSelectedName] = useState<AllahName | null>(null);
  const [activityVersion, setActivityVersion] = useState(0);

  // Quiz round state
  const [questions, setQuestions] = useState<QuizQuestion[]>(() =>
    buildQuizRound(loadUserActivity().masteredNameNumbers, language)
  );
  const [qIndex, setQIndex] = useState(0);
  const [pickedOptionNum, setPickedOptionNum] = useState<number | null>(null);
  const [roundScore, setRoundScore] = useState(0);
  const [roundXp, setRoundXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastXpAwarded, setLastXpAwarded] = useState(0);
  const [roundFinished, setRoundFinished] = useState(false);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    const onUpdate = () => setActivityVersion((v) => v + 1);
    window.addEventListener(ACTIVITY_UPDATED_EVENT, onUpdate);
    return () => window.removeEventListener(ACTIVITY_UPDATED_EVENT, onUpdate);
  }, []);

  const startFreshRound = useCallback(() => {
    const currentMastered = loadUserActivity().masteredNameNumbers;
    setQuestions(buildQuizRound(currentMastered, language));
    setQIndex(0);
    setPickedOptionNum(null);
    setRoundScore(0);
    setRoundXp(0);
    setStreak(0);
    setLastXpAwarded(0);
    setRoundFinished(false);
  }, [language]);

  useEffect(() => {
    const handleBack = (e: Event) => {
      if (selectedName) {
        e.preventDefault();
        setSelectedName(null);
      } else if ((mode === 'quiz' || mode === 'battle') && initialMode === 'list') {
        e.preventDefault();
        setMode('list');
      }
    };
    window.addEventListener('nq:android-back', handleBack);
    return () => window.removeEventListener('nq:android-back', handleBack);
  }, [selectedName, mode, initialMode]);

  const masteredSet = useMemo(() => {
    void activityVersion;
    return new Set(loadUserActivity().masteredNameNumbers);
  }, [activityVersion]);

  const summary = useMemo(() => {
    void activityVersion;
    return computeActivitySummary(language);
  }, [activityVersion, language]);

  const filteredNames = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return NAMES_OF_ALLAH;
    return NAMES_OF_ALLAH.filter((n) => {
      const loc = getLocalizedAllahName(n, language);
      return (
        loc.transliteration.toLowerCase().includes(q) ||
        loc.meaning.toLowerCase().includes(q) ||
        n.transliteration.toLowerCase().includes(q) ||
        n.meaning.toLowerCase().includes(q) ||
        n.arabic.includes(q) ||
        n.number.toString() === q
      );
    });
  }, [searchQuery, language]);

  const selectedLocalized = selectedName ? getLocalizedAllahName(selectedName, language) : null;
  const activeQuestion = questions[qIndex] || null;
  const namesPct = Math.round((summary.namesMastered / 99) * 100);

  const handlePickOption = (optionNumber: number) => {
    if (!activeQuestion || pickedOptionNum !== null) return;
    setPickedOptionNum(optionNumber);
    const isCorrect = optionNumber === activeQuestion.target.number;
    const nextStreak = isCorrect ? streak + 1 : 0;
    setStreak(nextStreak);

    if (isCorrect) {
      setRoundScore((s) => s + 1);
      const { xpAwarded } = recordNameQuizAnswer(activeQuestion.target.number, true, nextStreak);
      setLastXpAwarded(xpAwarded);
      setRoundXp((prev) => prev + xpAwarded);
    } else {
      setLastXpAwarded(0);
    }
  };

  const handleNextQuestion = () => {
    if (qIndex + 1 >= questions.length) {
      recordNameQuizSessionComplete();
      setRoundFinished(true);
    } else {
      setQIndex((i) => i + 1);
      setPickedOptionNum(null);
      setLastXpAwarded(0);
    }
  };

  return (
    <div className={`${mode !== 'list' ? 'space-y-2 pb-2' : 'space-y-3.5 pb-8'} ${isDay ? 'text-slate-900' : 'text-slate-100'}`}>
      {/* Header (shown in list mode; in quiz/battle mode the top shell bar + mastery strip already display title & count) */}
      {mode === 'list' && (
        <div className="flex items-center justify-between pt-0.5">
          <div>
            <h1 className={`text-xl font-bold tracking-tight ${isDay ? 'text-slate-900' : 'text-white'}`}>
              {t.names.title}
            </h1>
            <p className={`text-xs font-medium ${isDay ? 'text-[#158509]' : 'text-emerald-400'}`}>
              {t.names.subtitle}
            </p>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
              isDay
                ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                : 'bg-emerald-950 border-emerald-800 text-amber-300'
            }`}
          >
            {summary.namesMastered} / 99
          </span>
        </div>
      )}

      {/* 3-Tab Mode Switcher: 99 Names List | Solo Quiz | 1v1 Live Battle */}
      <div
        className={`grid grid-cols-3 gap-1 p-1 rounded-2xl border ${
          isDay ? 'bg-white border-[#dde3ea]' : 'bg-slate-900 border-emerald-900/60'
        }`}
      >
        <button
          type="button"
          onClick={() => setMode('list')}
          className={`py-1.5 px-2 rounded-xl text-xs font-bold transition truncate ${
            mode === 'list'
              ? isDay
                ? 'bg-[#158509] text-white shadow-xs nq-keep-dark'
                : 'bg-amber-400 text-slate-950 shadow-xs'
              : isDay
              ? 'text-slate-600 hover:text-slate-900'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {ui.listTab}
        </button>
        <button
          type="button"
          onClick={() => {
            if (mode !== 'quiz') {
              startFreshRound();
              setMode('quiz');
            }
          }}
          className={`py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
            mode === 'quiz'
              ? isDay
                ? 'bg-[#158509] text-white shadow-xs nq-keep-dark'
                : 'bg-amber-400 text-slate-950 shadow-xs'
              : isDay
              ? 'text-slate-600 hover:text-slate-900'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{ui.quizTab}</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('battle')}
          className={`py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
            mode === 'battle'
              ? isDay
                ? 'bg-[#158509] text-white shadow-xs nq-keep-dark'
                : 'bg-amber-400 text-slate-950 shadow-xs'
              : isDay
              ? 'text-slate-600 hover:text-slate-900'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Swords className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{ui.battleTab}</span>
        </button>
      </div>

      {mode === 'battle' ? (
        <NamesBattleArena />
      ) : mode === 'list' ? (
        <>
          {/* Search Bar */}
          <div className="relative">
            <Search
              className={`absolute left-4 top-3.5 w-4 h-4 ${
                isDay ? 'text-[#158509]' : 'text-emerald-400'
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.names.searchPlaceholder}
              className={`w-full border rounded-2xl pl-11 pr-4 py-3 text-sm shadow-inner focus:outline-none ${
                isDay
                  ? 'bg-white border-[#dde3ea] focus:border-[#158509] text-slate-900 placeholder-slate-400'
                  : 'bg-slate-900 border-emerald-900/60 focus:border-amber-500/80 text-white placeholder-slate-400'
              }`}
            />
          </div>

          {/* Grid of 99 Names */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {filteredNames.map((name) => {
              const loc = getLocalizedAllahName(name, language);
              const isMastered = masteredSet.has(name.number);
              return (
                <button
                  key={name.number}
                  type="button"
                  onClick={() => setSelectedName(name)}
                  className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between group shadow-xs ${
                    isDay
                      ? isMastered
                        ? 'bg-white border-[#b6e3aa] hover:border-[#158509]'
                        : 'bg-white border-[#dde3ea] hover:border-[#158509]'
                      : isMastered
                      ? 'bg-slate-900/90 border-emerald-700/80 hover:border-amber-400/70'
                      : 'bg-slate-900/80 border-emerald-900/40 hover:border-amber-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`w-6 h-6 rounded-lg border font-bold text-[10px] flex items-center justify-center font-mono ${
                        isMastered
                          ? isDay
                            ? 'bg-[#158509] border-[#0c4703] text-white nq-keep-dark'
                            : 'bg-emerald-600 border-emerald-500 text-white'
                          : isDay
                          ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                          : 'bg-emerald-950 border-emerald-800 text-amber-400'
                      }`}
                    >
                      {isMastered ? <Check className="w-3.5 h-3.5" /> : name.number}
                    </span>
                    <span
                      className={`font-arabic text-2xl group-hover:scale-105 transition font-medium ${
                        isDay ? 'text-[#0c4703]' : 'text-amber-400'
                      }`}
                    >
                      {name.arabic}
                    </span>
                  </div>

                  <div className="mt-3">
                    <h3
                      className={`font-bold text-xs transition ${
                        isDay ? 'text-slate-900 group-hover:text-[#158509]' : 'text-white group-hover:text-amber-200'
                      }`}
                    >
                      {loc.transliteration}
                    </h3>
                    <p className={`text-[11px] truncate mt-0.5 ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                      {loc.meaning}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {filteredNames.length === 0 && (
            <div className={`text-center py-12 text-xs ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
              {t.names.noResults}
            </div>
          )}
        </>
      ) : (
        /* ==================== QUIZ MODE (Single-screen, no scroll needed) ==================== */
        <div className="space-y-2 animate-in fade-in">
          {/* Compact Mastery Rank Strip */}
          <div
            className={`rounded-xl border px-3 py-2 flex items-center gap-3 shadow-xs ${
              isDay ? 'bg-white border-[#dde3ea]' : 'bg-slate-900 border-emerald-900/60'
            }`}
          >
            <span className={`text-[11px] font-bold shrink-0 ${isDay ? 'text-[#0c4703]' : 'text-amber-300'}`}>
              {summary.namesRank}
            </span>
            <div className={`h-1.5 flex-1 rounded-full overflow-hidden ${isDay ? 'bg-slate-100' : 'bg-slate-800'}`}>
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isDay ? 'bg-[#158509]' : 'bg-amber-400'
                }`}
                style={{ width: `${namesPct}%` }}
              />
            </div>
            <span className={`text-[11px] font-mono font-bold shrink-0 ${isDay ? 'text-[#158509]' : 'text-emerald-400'}`}>
              {summary.namesMastered}/99
            </span>
          </div>

          {roundFinished ? (
            /* Round Summary Card */
            <div
              className={`rounded-3xl border p-5 text-center space-y-3.5 shadow-lg ${
                isDay ? 'bg-white border-[#dde3ea]' : 'bg-slate-900 border-emerald-800/70'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center ${
                  isDay ? 'bg-[#eef9ea] text-[#158509]' : 'bg-emerald-950 text-amber-400'
                }`}
              >
                <Trophy className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h2 className="font-display text-xl font-bold">{ui.roundDoneTitle}</h2>
                <p className={`text-xs ${isDay ? 'text-slate-600' : 'text-slate-300'}`}>
                  {ui.roundDoneSub(roundScore, questions.length)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div
                  className={`p-2.5 rounded-2xl border ${
                    isDay ? 'bg-[#ecf1f5] border-[#dde3ea]' : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className={`text-[11px] ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                    {ui.xpEarnedLabel}
                  </div>
                  <div className={`text-lg font-extrabold font-mono mt-0.5 ${isDay ? 'text-[#158509]' : 'text-amber-300'}`}>
                    +{roundXp} XP
                  </div>
                </div>
                <div
                  className={`p-2.5 rounded-2xl border ${
                    isDay ? 'bg-[#ecf1f5] border-[#dde3ea]' : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className={`text-[11px] ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                    {ui.masteredLabel}
                  </div>
                  <div className="text-lg font-extrabold font-mono mt-0.5">
                    {summary.namesMastered} / 99
                  </div>
                </div>
              </div>

              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  isDay
                    ? 'bg-[#eef9ea] text-[#0c4703] border border-[#c5e8bc]'
                    : 'bg-emerald-950 text-amber-300 border border-emerald-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{summary.namesRank}</span>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  onClick={startFreshRound}
                  className={`w-full py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                    isDay
                      ? 'bg-[#158509] hover:bg-[#0c5007] text-white nq-keep-dark'
                      : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{ui.playAgainBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('list')}
                  className={`w-full py-2.5 rounded-2xl border text-xs font-semibold transition ${
                    isDay
                      ? 'bg-[#ecf1f5] border-[#dde3ea] text-slate-700'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  {ui.backToListBtn}
                </button>
              </div>
            </div>
          ) : (
            activeQuestion && (
              <>
                {/* Compact Question Hero Card */}
                <div
                  className={`nq-keep-dark rounded-2xl px-4 py-3 text-center text-white space-y-1 shadow-md border ${
                    isDay ? 'nq-hero-day border-[#0a4306]' : 'nq-hero-night border-emerald-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[#d0f39f]">
                    <span>{ui.questionOf(qIndex + 1, questions.length)}</span>
                    <div className="flex items-center gap-1.5">
                      {streak >= 2 && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-400/20 text-[#fde68a]">
                          <Flame className="w-3 h-3" />
                          <span>{ui.streakLabel(streak)}</span>
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full bg-white/14 text-[#fde68a] font-mono">
                        {masteredSet.has(activeQuestion.target.number) ? '+5 XP' : '+20 XP'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-0.5">
                    <div className="font-arabic text-3xl font-bold text-[#fde68a] leading-tight" dir="rtl">
                      {activeQuestion.target.arabic}
                    </div>
                    <div className="text-base font-extrabold tracking-tight text-white">
                      {getLocalizedAllahName(activeQuestion.target, language).transliteration}
                    </div>
                  </div>
                  <p className="text-[11px] text-white/80 leading-snug">{ui.prompt}</p>
                </div>

                {/* 4 Answer Choices */}
                <div className="space-y-1.5">
                  {activeQuestion.options.map((opt) => {
                    const optLoc = getLocalizedAllahName(opt, language);
                    const isTarget = opt.number === activeQuestion.target.number;
                    const isPicked = pickedOptionNum === opt.number;
                    const answered = pickedOptionNum !== null;

                    let btnCls = isDay
                      ? 'bg-white border-[#dde3ea] text-slate-800 hover:border-[#158509]'
                      : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-emerald-700';

                    if (answered) {
                      if (isTarget) {
                        btnCls = isDay
                          ? 'bg-[#eef9ea] border-[#158509] text-[#0c4703] font-bold'
                          : 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold';
                      } else if (isPicked) {
                        btnCls = isDay
                          ? 'bg-rose-50 border-rose-400 text-rose-800'
                          : 'bg-rose-950/60 border-rose-500 text-rose-300';
                      } else {
                        btnCls = isDay
                          ? 'bg-white/60 border-slate-200 text-slate-400'
                          : 'bg-slate-900/50 border-slate-800/70 text-slate-500';
                      }
                    }

                    return (
                      <button
                        key={opt.number}
                        type="button"
                        disabled={answered}
                        onClick={() => handlePickOption(opt.number)}
                        className={`w-full py-2.5 px-3.5 rounded-xl border text-left text-xs transition flex items-center justify-between gap-2 ${btnCls}`}
                      >
                        <span className="leading-snug">{optLoc.meaning}</span>
                        {answered && isTarget && lastXpAwarded > 0 && isPicked && (
                          <span className="font-mono text-[11px] font-bold shrink-0">+{lastXpAwarded} XP</span>
                        )}
                        {answered && isTarget && !isPicked && (
                          <Check className="w-4 h-4 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Compact Explanation & Next Button (fits without scrolling) */}
                {pickedOptionNum !== null && (
                  <div
                    className={`p-2.5 rounded-2xl border space-y-2 animate-in fade-in ${
                      pickedOptionNum === activeQuestion.target.number
                        ? isDay
                          ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                          : 'bg-emerald-950/60 border-emerald-700/70 text-emerald-200'
                        : isDay
                        ? 'bg-amber-50 border-amber-200 text-amber-950'
                        : 'bg-slate-900 border-amber-700/60 text-amber-200'
                    }`}
                  >
                    <div className="text-[11px] leading-snug">
                      <span className="font-bold block">
                        {pickedOptionNum === activeQuestion.target.number
                          ? ui.correctBanner
                          : `${ui.wrongBanner} ${getLocalizedAllahName(activeQuestion.target, language).meaning}`}
                      </span>
                      <span className="opacity-90 line-clamp-2">
                        {getLocalizedAllahName(activeQuestion.target, language).explanation}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className={`w-full py-2.5 rounded-xl text-xs font-extrabold transition ${
                        isDay
                          ? 'bg-[#158509] hover:bg-[#0c5007] text-white nq-keep-dark'
                          : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                      }`}
                    >
                      {qIndex + 1 >= questions.length ? ui.finishBtn : ui.nextBtn}
                    </button>
                  </div>
                )}
              </>
            )
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selectedName && selectedLocalized && (
        <div
          onClick={() => setSelectedName(null)}
          className={`fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${
            isDay ? 'bg-slate-950/45' : 'bg-slate-950/80'
          }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`border rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative text-center ${
              isDay
                ? 'bg-white border-[#dde3ea] text-slate-900'
                : 'bg-slate-900 border-emerald-700/60 text-white'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span
                className={`w-8 h-8 rounded-xl border font-bold text-xs flex items-center justify-center font-mono ${
                  isDay
                    ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                    : 'bg-emerald-950 border-emerald-800 text-amber-400'
                }`}
              >
                #{selectedName.number}
              </span>
              {masteredSet.has(selectedName.number) && (
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                    isDay
                      ? 'bg-[#eef9ea] text-[#158509] border border-[#c5e8bc]'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                  }`}
                >
                  <Check className="w-3 h-3" />
                  <span>{ui.masteredBadge}</span>
                </span>
              )}
            </div>

            <h2
              className={`font-arabic text-5xl font-bold py-2 ${
                isDay ? 'text-[#0c4703]' : 'text-amber-300'
              }`}
            >
              {selectedName.arabic}
            </h2>

            <div>
              <h3 className="text-xl font-bold">{selectedLocalized.transliteration}</h3>
              <p className={`text-xs font-semibold ${isDay ? 'text-[#158509]' : 'text-amber-400'}`}>
                {selectedLocalized.meaning}
              </p>
            </div>

            <div
              className={`text-xs space-y-2 text-left p-4 rounded-2xl border ${
                isDay
                  ? 'bg-[#ecf1f5] border-[#dde3ea] text-slate-700'
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">
                  {t.names.meaningLabel}
                </span>
                <p className="mt-0.5 leading-relaxed">{selectedLocalized.explanation}</p>
              </div>
              <div className={`pt-2 border-t ${isDay ? 'border-slate-200' : 'border-slate-800'}`}>
                <span
                  className={`text-[10px] font-bold uppercase block ${
                    isDay ? 'text-[#158509]' : 'text-emerald-400'
                  }`}
                >
                  {t.names.benefitLabel}
                </span>
                <p className={`mt-0.5 leading-relaxed ${isDay ? 'text-slate-700' : 'text-emerald-200'}`}>
                  {selectedLocalized.benefit}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedName(null)}
              className="nq-keep-dark w-full py-2.5 rounded-xl bg-[#158509] hover:bg-[#0c5007] text-white font-bold text-xs transition"
            >
              {t.names.closeBtn}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
