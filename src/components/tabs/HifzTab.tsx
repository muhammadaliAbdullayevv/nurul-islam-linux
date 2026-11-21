import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Play,
  Repeat,
  Sparkles,
  Square,
  Volume2,
} from 'lucide-react';
import { AppLanguage } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  HIFZ_LESSONS,
  HifzCategory,
  HifzLesson,
  HifzVerseItem,
  getLocalizedHifzVerse,
} from '../../data/hifzData';
import {
  getReciterAyahAudioCandidates,
  loadSelectedReciterId,
} from '../../data/quranReciters';

const HIFZ_STORAGE_KEY = 'nq_hifz_mastered_v1';

interface HifzProgressState {
  masteredLessonIds: string[];
  masteredVerseKeys: string[];
}

function loadHifzProgress(): HifzProgressState {
  try {
    const raw = localStorage.getItem(HIFZ_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<HifzProgressState>;
      return {
        masteredLessonIds: Array.isArray(parsed.masteredLessonIds) ? parsed.masteredLessonIds : [],
        masteredVerseKeys: Array.isArray(parsed.masteredVerseKeys) ? parsed.masteredVerseKeys : [],
      };
    }
  } catch {
    // ignore
  }
  return { masteredLessonIds: [], masteredVerseKeys: [] };
}

function saveHifzProgress(next: HifzProgressState): void {
  try {
    localStorage.setItem(HIFZ_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

type HideStage = 'full' | 'half' | 'hidden';
type RepeatCount = 1 | 3 | 5 | 0; // 0 = infinite loop

const UI_TEXT: Record<
  AppLanguage,
  {
    heroBadge: string;
    heroTitle: string;
    heroSub: string;
    tabAll: string;
    tabSurahs: string;
    tabDuas: string;
    masteredChip: string;
    inProgressChip: (done: number, total: number) => string;
    backToList: string;
    playAll: string;
    stopAudio: string;
    repeatLabel: string;
    memoryModeLabel: string;
    modeFull: string;
    modeHalf: string;
    modeHidden: string;
    tapToPeek: string;
    markVerseDone: string;
    verseDone: string;
    markLessonMastered: string;
    lessonMasteredBtn: string;
    whenToReadLabel: string;
    playingLoop: (cur: number, max: number) => string;
  }
> = {
  uz_lat: {
    heroBadge: 'Hifz va Talaffuz Ustazi',
    heroTitle: 'Namoz Suralari va Duolari',
    heroSub: 'Oyatma-oyat audio takrorlash va so‘zlarni yashirib yodlash mashqi',
    tabAll: 'Barchasi (18)',
    tabSurahs: '12 Namoz surasi',
    tabDuas: '6 Namoz duosi',
    masteredChip: 'Yodlangan',
    inProgressChip: (d, t) => `${d}/${t} satr`,
    backToList: 'Ro‘yxat',
    playAll: 'Ketma-ket eshitish',
    stopAudio: 'To‘xtatish',
    repeatLabel: 'Takror:',
    memoryModeLabel: 'Yodlash rejimi:',
    modeFull: '1. Ochiq',
    modeHalf: '2. Yarim yashirin',
    modeHidden: '3. Yoddan sinash',
    tapToPeek: 'Ko‘rish uchun ustiga bosing',
    markVerseDone: 'Yodladim',
    verseDone: 'Yodlandi',
    markLessonMastered: 'To‘liq yodladim deb belgilash',
    lessonMasteredBtn: 'Alhamdulillah, to‘liq yodlangan!',
    whenToReadLabel: 'Qachon o‘qiladi:',
    playingLoop: (c, m) => (m === 0 ? `${c}× ∞` : `${c}/${m}×`),
  },
  uz_cyr: {
    heroBadge: 'Ҳифз ва Талаффуз Устази',
    heroTitle: 'Намоз Суралари ва Дуолари',
    heroSub: 'Оятма-оят аудио такрорлаш ва сўзларни яшириб ёдлаш машқи',
    tabAll: 'Барчаси (18)',
    tabSurahs: '12 Намоз сураси',
    tabDuas: '6 Намоз дуоси',
    masteredChip: 'Ёдланган',
    inProgressChip: (d, t) => `${d}/${t} сатр`,
    backToList: 'Рўйхат',
    playAll: 'Кетма-кет эшитиш',
    stopAudio: 'Тўхтатиш',
    repeatLabel: 'Такрор:',
    memoryModeLabel: 'Ёдлаш режими:',
    modeFull: '1. Очиқ',
    modeHalf: '2. Ярим яширин',
    modeHidden: '3. Ёддан синаш',
    tapToPeek: 'Кўриш учун устига босинг',
    markVerseDone: 'Ёдладим',
    verseDone: 'Ёдланди',
    markLessonMastered: 'Тўлиқ ёдладим деб белгилаш',
    lessonMasteredBtn: 'Алҳамдулиллаҳ, тўлиқ ёдланган!',
    whenToReadLabel: 'Қачон ўқилади:',
    playingLoop: (c, m) => (m === 0 ? `${c}× ∞` : `${c}/${m}×`),
  },
  ru: {
    heroBadge: 'Тренажёр заучивания (Хифз)',
    heroTitle: 'Суры и Дуа для Намаза',
    heroSub: 'Повтор аятов с аудио и режим скрытия слов для проверки памяти',
    tabAll: 'Все (18)',
    tabSurahs: '12 сур намаза',
    tabDuas: '6 дуа намаза',
    masteredChip: 'Выучено',
    inProgressChip: (d, t) => `${d}/${t} стр.`,
    backToList: 'К списку',
    playAll: 'Слушать подряд',
    stopAudio: 'Стоп',
    repeatLabel: 'Повтор:',
    memoryModeLabel: 'Режим памяти:',
    modeFull: '1. Открыто',
    modeHalf: '2. Половина скрыта',
    modeHidden: '3. По памяти',
    tapToPeek: 'Нажмите на карточку, чтобы подсмотреть',
    markVerseDone: 'Выучил',
    verseDone: 'Выучено',
    markLessonMastered: 'Отметить как полностью выученное',
    lessonMasteredBtn: 'Альхамдулиллях, полностью выучено!',
    whenToReadLabel: 'Когда читается:',
    playingLoop: (c, m) => (m === 0 ? `${c}× ∞` : `${c}/${m}×`),
  },
  en: {
    heroBadge: 'Hifz & Recitation Trainer',
    heroTitle: 'Prayer Surahs & Duas',
    heroSub: 'Ayah-by-ayah audio loop and word-hiding memory practice',
    tabAll: 'All (18)',
    tabSurahs: '12 Prayer Surahs',
    tabDuas: '6 Prayer Duas',
    masteredChip: 'Memorized',
    inProgressChip: (d, t) => `${d}/${t} lines`,
    backToList: 'Back',
    playAll: 'Play All',
    stopAudio: 'Stop',
    repeatLabel: 'Repeat:',
    memoryModeLabel: 'Memory stage:',
    modeFull: '1. Full Text',
    modeHalf: '2. Half Hidden',
    modeHidden: '3. Recite Blind',
    tapToPeek: 'Tap card to reveal text',
    markVerseDone: 'Memorized',
    verseDone: 'Learned',
    markLessonMastered: 'Mark Entire Lesson as Memorized',
    lessonMasteredBtn: 'Alhamdulillah, Fully Memorized!',
    whenToReadLabel: 'When recited:',
    playingLoop: (c, m) => (m === 0 ? `${c}× ∞` : `${c}/${m}×`),
  },
};

function maskHalfText(text: string): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= 2) return `${words[0] || ''} • • •`;
  const keepCount = Math.ceil(words.length / 2);
  const shown = words.slice(0, keepCount).join(' ');
  const hiddenDots = words
    .slice(keepCount)
    .map(() => '•••')
    .join(' ');
  return `${shown} ${hiddenDots}`;
}

export const HifzTab: React.FC = () => {
  const { isDay } = useTheme();
  const { language } = useLanguage();
  const ui = UI_TEXT[language] || UI_TEXT.uz_lat;

  const [filter, setFilter] = useState<'all' | HifzCategory>('all');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [hideStage, setHideStage] = useState<HideStage>('full');
  const [peekedVerses, setPeekedVerses] = useState<Set<number>>(new Set());
  const [repeatTarget, setRepeatTarget] = useState<RepeatCount>(3);
  const [progress, setProgress] = useState<HifzProgressState>(() => loadHifzProgress());

  // Audio playback state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingVerseNum, setPlayingVerseNum] = useState<number | null>(null);
  const [currentRepeatStep, setCurrentRepeatStep] = useState<number>(1);
  const [isAutoSequence, setIsAutoSequence] = useState<boolean>(false);
  const repeatTargetRef = useRef<RepeatCount>(repeatTarget);
  const autoSequenceRef = useRef<boolean>(false);
  const activeLessonRef = useRef<HifzLesson | null>(null);

  useEffect(() => {
    repeatTargetRef.current = repeatTarget;
  }, [repeatTarget]);

  const activeLesson = useMemo(
    () => HIFZ_LESSONS.find((l) => l.id === activeLessonId) || null,
    [activeLessonId]
  );

  useEffect(() => {
    activeLessonRef.current = activeLesson;
  }, [activeLesson]);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
      audioRef.current = null;
    }
    autoSequenceRef.current = false;
    setIsAutoSequence(false);
    setPlayingVerseNum(null);
    setCurrentRepeatStep(1);
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  // Intercept Android back button when inside a lesson
  useEffect(() => {
    if (!activeLessonId) return;
    const onBack = (e: Event) => {
      e.preventDefault();
      stopAudio();
      setActiveLessonId(null);
      setPeekedVerses(new Set());
    };
    window.addEventListener('nq:android-back', onBack);
    return () => window.removeEventListener('nq:android-back', onBack);
  }, [activeLessonId]);

  const playVerseWithRepeat = (verse: HifzVerseItem, step = 1, sequenceMode = false) => {
    if (!verse.surahNumber || !verse.ayahNumber) return;

    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
    }

    const reciterId = loadSelectedReciterId();
    const candidates = getReciterAyahAudioCandidates(
      reciterId,
      verse.surahNumber,
      verse.ayahNumber
    );
    let candidateIdx = 0;

    const tryPlay = () => {
      if (candidateIdx >= candidates.length) {
        stopAudio();
        return;
      }
      const audio = new Audio(candidates[candidateIdx]);
      audioRef.current = audio;
      setPlayingVerseNum(verse.num);
      setCurrentRepeatStep(step);

      audio.onended = () => {
        const target = repeatTargetRef.current;
        if (target === 0 || step < target) {
          // Repeat same verse again
          playVerseWithRepeat(verse, step + 1, autoSequenceRef.current);
          return;
        }
        // Finished repeating this verse; check if we should advance to the next verse
        if (autoSequenceRef.current && activeLessonRef.current) {
          const playableVerses = activeLessonRef.current.verses.filter(
            (v) => v.surahNumber && v.ayahNumber
          );
          const curIdx = playableVerses.findIndex((v) => v.num === verse.num);
          if (curIdx >= 0 && curIdx + 1 < playableVerses.length) {
            playVerseWithRepeat(playableVerses[curIdx + 1], 1, true);
            return;
          }
        }
        stopAudio();
      };

      audio.onerror = () => {
        candidateIdx += 1;
        tryPlay();
      };

      audio.play().catch(() => {
        candidateIdx += 1;
        tryPlay();
      });
    };

    autoSequenceRef.current = sequenceMode;
    setIsAutoSequence(sequenceMode);
    tryPlay();
  };

  const handleTogglePlayAll = () => {
    if (!activeLesson) return;
    if (playingVerseNum !== null) {
      stopAudio();
      return;
    }
    const firstPlayable = activeLesson.verses.find((v) => v.surahNumber && v.ayahNumber);
    if (firstPlayable) {
      playVerseWithRepeat(firstPlayable, 1, true);
    }
  };

  const toggleVerseMastered = (lesson: HifzLesson, verseNum: number) => {
    const key = `${lesson.id}:${verseNum}`;
    setProgress((prev) => {
      const exists = prev.masteredVerseKeys.includes(key);
      const nextVerseKeys = exists
        ? prev.masteredVerseKeys.filter((k) => k !== key)
        : [...prev.masteredVerseKeys, key];

      const allDone = lesson.verses.every((v) =>
        nextVerseKeys.includes(`${lesson.id}:${v.num}`)
      );
      let nextLessonIds = prev.masteredLessonIds;
      if (allDone && !nextLessonIds.includes(lesson.id)) {
        nextLessonIds = [...nextLessonIds, lesson.id];
      } else if (!allDone && nextLessonIds.includes(lesson.id)) {
        nextLessonIds = nextLessonIds.filter((id) => id !== lesson.id);
      }

      const next = {
        masteredLessonIds: nextLessonIds,
        masteredVerseKeys: nextVerseKeys,
      };
      saveHifzProgress(next);
      return next;
    });
  };

  const toggleWholeLessonMastered = (lesson: HifzLesson) => {
    setProgress((prev) => {
      const isMastered = prev.masteredLessonIds.includes(lesson.id);
      const lessonVerseKeys = lesson.verses.map((v) => `${lesson.id}:${v.num}`);
      const nextLessonIds = isMastered
        ? prev.masteredLessonIds.filter((id) => id !== lesson.id)
        : [...prev.masteredLessonIds, lesson.id];
      const nextVerseKeys = isMastered
        ? prev.masteredVerseKeys.filter((k) => !lessonVerseKeys.includes(k))
        : Array.from(new Set([...prev.masteredVerseKeys, ...lessonVerseKeys]));
      const next = {
        masteredLessonIds: nextLessonIds,
        masteredVerseKeys: nextVerseKeys,
      };
      saveHifzProgress(next);
      return next;
    });
  };

  const filteredLessons = useMemo(() => {
    if (filter === 'all') return HIFZ_LESSONS;
    return HIFZ_LESSONS.filter((l) => l.category === filter);
  }, [filter]);

  const cardCls = isDay
    ? 'rounded-2xl bg-white border border-[#dde3ea] shadow-xs'
    : 'rounded-2xl bg-slate-900/90 border border-emerald-900/60';
  const subTextCls = isDay ? 'text-slate-500' : 'text-slate-400';

  const totalLessons = HIFZ_LESSONS.length;
  const masteredCount = progress.masteredLessonIds.length;
  const masteredPct = Math.round((masteredCount / Math.max(1, totalLessons)) * 100);

  // ==================== LESSON TRAINER VIEW ====================
  if (activeLesson) {
    const hasAudio = activeLesson.verses.some((v) => v.surahNumber && v.ayahNumber);
    const isLessonMastered = progress.masteredLessonIds.includes(activeLesson.id);
    const doneVersesCount = activeLesson.verses.filter((v) =>
      progress.masteredVerseKeys.includes(`${activeLesson.id}:${v.num}`)
    ).length;

    return (
      <div className={`space-y-3 pb-6 animate-in fade-in ${isDay ? 'text-slate-900' : 'text-slate-100'}`}>
        {/* Top Bar */}
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              stopAudio();
              setActiveLessonId(null);
              setPeekedVerses(new Set());
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition ${
              isDay
                ? 'bg-white border-[#dde3ea] text-slate-700 hover:border-[#158509]'
                : 'bg-slate-900 border-emerald-900/60 text-slate-200'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{ui.backToList}</span>
          </button>

          <span className="text-xs font-bold truncate">
            {activeLesson.title[language] || activeLesson.title.uz_lat}
          </span>

          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border shrink-0 ${
              isDay
                ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                : 'bg-emerald-950 border-emerald-800 text-amber-300'
            }`}
          >
            {doneVersesCount}/{activeLesson.verses.length}
          </span>
        </div>

        {/* Lesson Hero Card */}
        <div
          className={`nq-keep-dark rounded-3xl p-4 text-white shadow-lg border space-y-2.5 ${
            isDay ? 'nq-hero-day border-[#0a4306]' : 'nq-hero-night border-emerald-800/60'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/15 border border-[#fde68a]/40 text-[#fde68a] text-[10.5px] font-bold">
                {activeLesson.badge}
              </span>
              <h1 className="text-lg font-extrabold text-white mt-1">
                {activeLesson.title[language] || activeLesson.title.uz_lat}
              </h1>
              <p className="text-xs text-white/80 leading-snug mt-0.5">
                {activeLesson.subtitle[language] || activeLesson.subtitle.uz_lat}
              </p>
            </div>
            <div className="font-arabic text-2xl font-bold text-[#fde68a] shrink-0" dir="rtl">
              {activeLesson.arabicTitle}
            </div>
          </div>

          <div className="rounded-2xl bg-black/20 border border-white/15 px-3 py-2 text-[11px] text-white/90 leading-snug">
            <span className="font-bold text-[#d0f39f]">{ui.whenToReadLabel} </span>
            {activeLesson.whenToRead[language] || activeLesson.whenToRead.uz_lat}
          </div>

          {/* Audio Loop Bar (for Surahs & Ayat al-Kursi) */}
          {hasAudio && (
            <div className="flex items-center justify-between gap-2 pt-0.5 flex-wrap">
              <button
                type="button"
                onClick={handleTogglePlayAll}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition active:scale-[0.98] ${
                  playingVerseNum !== null
                    ? 'bg-rose-500 text-white'
                    : 'bg-[#fde68a] hover:bg-[#fcd34d] text-[#0c4703]'
                }`}
              >
                {playingVerseNum !== null ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>{ui.stopAudio}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{ui.playAll}</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1 bg-black/25 border border-white/15 rounded-xl p-1">
                <Repeat className="w-3.5 h-3.5 text-[#fde68a] ml-1.5 mr-0.5" />
                {([1, 3, 5, 0] as RepeatCount[]).map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setRepeatTarget(cnt)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-extrabold transition ${
                      repeatTarget === cnt
                        ? 'bg-[#fde68a] text-[#0c4703]'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {cnt === 0 ? '∞' : `${cnt}×`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3-Stage Memory Hide / Blur Switcher */}
        <div className={`${cardCls} p-1.5 grid grid-cols-3 gap-1`}>
          {(
            [
              { id: 'full', label: ui.modeFull, icon: Eye },
              { id: 'half', label: ui.modeHalf, icon: Sparkles },
              { id: 'hidden', label: ui.modeHidden, icon: EyeOff },
            ] as const
          ).map((st) => {
            const Icon = st.icon;
            const active = hideStage === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => {
                  setHideStage(st.id);
                  setPeekedVerses(new Set());
                }}
                className={`py-2 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition ${
                  active
                    ? isDay
                      ? 'bg-[#158509] text-white nq-keep-dark shadow-xs'
                      : 'bg-amber-400 text-slate-950 shadow-xs'
                    : isDay
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{st.label}</span>
              </button>
            );
          })}
        </div>

        {hideStage !== 'full' && (
          <div className={`text-center text-[11px] font-medium ${subTextCls}`}>
            {ui.tapToPeek}
          </div>
        )}

        {/* Verses / Lines List */}
        <div className="space-y-2.5">
          {activeLesson.verses.map((verse) => {
            const loc = getLocalizedHifzVerse(verse, language);
            const isVerseDone = progress.masteredVerseKeys.includes(
              `${activeLesson.id}:${verse.num}`
            );
            const isPlayingThis = playingVerseNum === verse.num;
            const isPeeked = peekedVerses.has(verse.num);
            const effectiveStage: HideStage = isPeeked ? 'full' : hideStage;
            const canPlayVerse = Boolean(verse.surahNumber && verse.ayahNumber);

            return (
              <div
                key={verse.num}
                onClick={() => {
                  if (hideStage !== 'full') {
                    setPeekedVerses((prev) => {
                      const next = new Set(prev);
                      if (next.has(verse.num)) next.delete(verse.num);
                      else next.add(verse.num);
                      return next;
                    });
                  }
                }}
                className={`${cardCls} p-3.5 space-y-2.5 transition ${
                  isPlayingThis
                    ? isDay
                      ? 'ring-2 ring-[#158509] border-[#158509]'
                      : 'ring-2 ring-amber-400 border-amber-400'
                    : isVerseDone
                    ? isDay
                      ? 'border-[#b7e2ad] bg-[#f8fdf6]'
                      : 'border-emerald-700/70'
                    : ''
                }`}
              >
                {/* Top Verse Action Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-6 h-6 rounded-lg text-[11px] font-mono font-extrabold flex items-center justify-center border ${
                        isVerseDone
                          ? isDay
                            ? 'bg-[#158509] border-[#0c4703] text-white nq-keep-dark'
                            : 'bg-emerald-600 border-emerald-500 text-white'
                          : isDay
                          ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                          : 'bg-emerald-950 border-emerald-800 text-amber-300'
                      }`}
                    >
                      {verse.num}
                    </span>

                    {canPlayVerse && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isPlayingThis && !isAutoSequence) {
                            stopAudio();
                          } else {
                            playVerseWithRepeat(verse, 1, false);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 border transition ${
                          isPlayingThis
                            ? isDay
                              ? 'bg-[#158509] border-[#0c4703] text-white nq-keep-dark'
                              : 'bg-amber-400 border-amber-300 text-slate-950'
                            : isDay
                            ? 'bg-slate-100 border-slate-200 text-slate-700 hover:border-[#158509]'
                            : 'bg-slate-800 border-slate-700 text-slate-200'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>
                          {isPlayingThis
                            ? ui.playingLoop(currentRepeatStep, repeatTarget)
                            : repeatTarget === 0
                            ? '∞'
                            : `${repeatTarget}×`}
                        </span>
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleVerseMastered(activeLesson, verse.num);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 border transition ${
                      isVerseDone
                        ? isDay
                          ? 'bg-[#eef9ea] border-[#158509] text-[#0c4703]'
                          : 'bg-emerald-950 border-emerald-600 text-emerald-300'
                        : isDay
                        ? 'bg-white border-slate-200 text-slate-600 hover:border-[#158509]'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isVerseDone ? ui.verseDone : ui.markVerseDone}</span>
                  </button>
                </div>

                {/* Arabic Script */}
                <div
                  dir="rtl"
                  className={`font-arabic text-2xl leading-loose text-right transition ${
                    isDay ? 'text-[#0c4703]' : 'text-amber-300'
                  } ${
                    effectiveStage === 'hidden'
                      ? 'blur-md select-none opacity-60'
                      : effectiveStage === 'half'
                      ? 'opacity-95'
                      : ''
                  }`}
                >
                  {effectiveStage === 'half' ? maskHalfText(verse.arabic) : verse.arabic}
                </div>

                {/* Uzbek Phonetic Transliteration */}
                <div
                  className={`text-[13.5px] font-bold leading-snug rounded-xl px-3 py-2 border transition ${
                    isDay
                      ? 'bg-[#f4faef] border-[#d3eccb] text-[#0c4703]'
                      : 'bg-emerald-950/50 border-emerald-800/60 text-emerald-200'
                  } ${effectiveStage === 'hidden' ? 'blur-sm select-none' : ''}`}
                >
                  {effectiveStage === 'half'
                    ? maskHalfText(loc.transliteration)
                    : loc.transliteration}
                </div>

                {/* Translation / Meaning */}
                <p className={`text-xs leading-relaxed ${subTextCls}`}>{loc.meaning}</p>
              </div>
            );
          })}
        </div>

        {/* Mark Whole Surah / Dua as Memorized Button */}
        <button
          type="button"
          onClick={() => toggleWholeLessonMastered(activeLesson)}
          className={`w-full py-3 px-4 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition active:scale-[0.99] ${
            isLessonMastered
              ? isDay
                ? 'bg-[#eef9ea] border-2 border-[#158509] text-[#0c4703]'
                : 'bg-emerald-950 border-2 border-emerald-500 text-emerald-300'
              : isDay
              ? 'bg-[#158509] hover:bg-[#0c5007] text-white nq-keep-dark shadow-sm'
              : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isLessonMastered ? ui.lessonMasteredBtn : ui.markLessonMastered}</span>
        </button>
      </div>
    );
  }

  // ==================== HUB OVERVIEW SCREEN ====================
  return (
    <div className={`space-y-3.5 pb-6 ${isDay ? 'text-slate-900' : 'text-slate-100'}`}>
      {/* Hero Banner */}
      <div
        className={`nq-keep-dark rounded-3xl p-4 text-white shadow-lg border space-y-3 ${
          isDay ? 'nq-hero-day border-[#0a4306]' : 'nq-hero-night border-emerald-800/60'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 border border-[#fde68a]/40 text-[#fde68a] text-[11px] font-bold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{ui.heroBadge}</span>
            </div>
            <h1 className="text-lg font-extrabold tracking-tight text-white mt-1.5">
              {ui.heroTitle}
            </h1>
            <p className="text-xs text-white/80 mt-0.5 leading-snug">{ui.heroSub}</p>
          </div>
          <div className="px-3 py-2 rounded-2xl bg-black/25 border border-white/15 text-center shrink-0">
            <div className="text-lg font-extrabold text-[#fde68a] tabular-nums leading-none">
              {masteredCount}
            </div>
            <div className="text-[10px] text-white/75 mt-0.5 font-semibold">/ {totalLessons}</div>
          </div>
        </div>

        <div className="h-1.5 rounded-full bg-white/15 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#d0f39f] to-[#fde68a] transition-all duration-300"
            style={{ width: `${Math.max(5, masteredPct)}%` }}
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className={`${cardCls} p-1 grid grid-cols-3 gap-1`}>
        {(
          [
            { id: 'all', label: ui.tabAll },
            { id: 'surahs', label: ui.tabSurahs },
            { id: 'duas', label: ui.tabDuas },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition ${
              filter === tab.id
                ? isDay
                  ? 'bg-[#158509] text-white nq-keep-dark shadow-xs'
                  : 'bg-amber-400 text-slate-950 shadow-xs'
                : isDay
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Lessons List */}
      <div className="space-y-2">
        {filteredLessons.map((lesson) => {
          const isMastered = progress.masteredLessonIds.includes(lesson.id);
          const doneVerses = lesson.verses.filter((v) =>
            progress.masteredVerseKeys.includes(`${lesson.id}:${v.num}`)
          ).length;

          return (
            <button
              key={lesson.id}
              type="button"
              onClick={() => {
                setActiveLessonId(lesson.id);
                setPeekedVerses(new Set());
              }}
              className={`${cardCls} w-full p-3.5 text-left flex items-center justify-between gap-3 transition active:scale-[0.99] ${
                isDay ? 'hover:border-[#158509]' : 'hover:border-amber-400/70'
              }`}
            >
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isDay
                        ? 'bg-[#eef9ea] text-[#0c4703] border border-[#c5e8bc]'
                        : 'bg-emerald-950 text-amber-300 border border-emerald-800'
                    }`}
                  >
                    {lesson.badge}
                  </span>
                  {isMastered ? (
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isDay
                          ? 'bg-[#158509] text-white nq-keep-dark'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      {ui.masteredChip}
                    </span>
                  ) : doneVerses > 0 ? (
                    <span className={`text-[10.5px] font-mono font-bold ${subTextCls}`}>
                      {ui.inProgressChip(doneVerses, lesson.verses.length)}
                    </span>
                  ) : null}
                </div>

                <h3 className="text-sm font-extrabold leading-snug">
                  {lesson.title[language] || lesson.title.uz_lat}
                </h3>
                <p className={`text-xs leading-snug line-clamp-1 ${subTextCls}`}>
                  {lesson.subtitle[language] || lesson.subtitle.uz_lat}
                </p>
              </div>

              <div className="text-right shrink-0">
                <div
                  dir="rtl"
                  className={`font-arabic text-xl font-bold ${
                    isDay ? 'text-[#0c4703]' : 'text-amber-300'
                  }`}
                >
                  {lesson.arabicTitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
