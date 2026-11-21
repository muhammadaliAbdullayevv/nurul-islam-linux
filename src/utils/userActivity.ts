import { AppLanguage } from '../types';
import { TOTAL_KNOWLEDGE_QUESTIONS } from '../data/knowledgeQuiz';

const HANDLE_STORAGE_KEY = 'nq_user_handle';
const ACTIVITY_STORAGE_KEY = 'nq_user_activity_v1';
const TASBIH_STORAGE_KEY = 'nq_tasbih_stats';
const RAMADAN_STORAGE_KEY = 'nq_ramadan_fasts';
export const ACTIVITY_UPDATED_EVENT = 'nq:activity-changed';

export interface UserActivityState {
  masteredNameNumbers: number[];
  quizCorrectTotal: number;
  quizSessionsCompleted: number;
  quizBestStreak: number;
  quranListenSeconds: number;
  masteredKnowledgeIds: string[];
  missedKnowledgeIds: string[];
  knowledgeCorrectTotal: number;
}

const DEFAULT_ACTIVITY: UserActivityState = {
  masteredNameNumbers: [],
  quizCorrectTotal: 0,
  quizSessionsCompleted: 0,
  quizBestStreak: 0,
  quranListenSeconds: 0,
  masteredKnowledgeIds: [],
  missedKnowledgeIds: [],
  knowledgeCorrectTotal: 0,
};

function emitActivityChanged(): void {
  try {
    window.dispatchEvent(new Event(ACTIVITY_UPDATED_EVENT));
  } catch {
    // ignore non-browser env
  }
}

function generateRandomHandle(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 6; i += 1) {
    const idx = Math.floor(Math.random() * chars.length);
    suffix += chars[idx];
  }
  return `NI-${suffix}`;
}

export function getUserHandle(): string {
  try {
    const saved = localStorage.getItem(HANDLE_STORAGE_KEY);
    if (saved && saved.trim().length >= 2) {
      return saved.trim();
    }
  } catch {
    // ignore storage errors
  }
  const fresh = generateRandomHandle();
  try {
    localStorage.setItem(HANDLE_STORAGE_KEY, fresh);
  } catch {
    // ignore storage errors
  }
  return fresh;
}

export function setUserHandle(nextHandle: string): string {
  const cleaned = nextHandle.replace(/\s+/g, ' ').trim().slice(0, 22);
  const finalHandle = cleaned.length >= 2 ? cleaned : getUserHandle();
  try {
    localStorage.setItem(HANDLE_STORAGE_KEY, finalHandle);
  } catch {
    // ignore storage errors
  }
  emitActivityChanged();
  return finalHandle;
}

export function loadUserActivity(): UserActivityState {
  try {
    const raw = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<UserActivityState>;
      const mastered = Array.isArray(parsed.masteredNameNumbers)
        ? Array.from(
            new Set(
              parsed.masteredNameNumbers
                .map((n) => Number(n))
                .filter((n) => Number.isInteger(n) && n >= 1 && n <= 99)
            )
          )
        : [];
      const masteredKnowledge = Array.isArray(parsed.masteredKnowledgeIds)
        ? Array.from(
            new Set(
              parsed.masteredKnowledgeIds.filter(
                (id): id is string => typeof id === 'string' && id.trim().length > 0 && id.length <= 24
              )
            )
          )
        : [];
      const missedKnowledge = Array.isArray(parsed.missedKnowledgeIds)
        ? Array.from(
            new Set(
              parsed.missedKnowledgeIds.filter(
                (id): id is string => typeof id === 'string' && id.trim().length > 0 && id.length <= 24
              )
            )
          )
        : [];
      return {
        masteredNameNumbers: mastered,
        quizCorrectTotal: Math.max(0, Math.floor(Number(parsed.quizCorrectTotal) || 0)),
        quizSessionsCompleted: Math.max(0, Math.floor(Number(parsed.quizSessionsCompleted) || 0)),
        quizBestStreak: Math.max(0, Math.floor(Number(parsed.quizBestStreak) || 0)),
        quranListenSeconds: Math.max(0, Math.floor(Number(parsed.quranListenSeconds) || 0)),
        masteredKnowledgeIds: masteredKnowledge,
        missedKnowledgeIds: missedKnowledge,
        knowledgeCorrectTotal: Math.max(0, Math.floor(Number(parsed.knowledgeCorrectTotal) || 0)),
      };
    }
  } catch {
    // ignore parse errors
  }
  return { ...DEFAULT_ACTIVITY };
}

function saveUserActivity(next: UserActivityState): void {
  try {
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore storage errors
  }
  emitActivityChanged();
}

export function recordNameQuizAnswer(
  nameNumber: number,
  isCorrect: boolean,
  currentStreak: number
): { state: UserActivityState; isNewlyMastered: boolean; xpAwarded: number } {
  const prev = loadUserActivity();
  if (!isCorrect) {
    return { state: prev, isNewlyMastered: false, xpAwarded: 0 };
  }
  const alreadyMastered = prev.masteredNameNumbers.includes(nameNumber);
  const masteredNameNumbers = alreadyMastered
    ? prev.masteredNameNumbers
    : [...prev.masteredNameNumbers, nameNumber];
  const next: UserActivityState = {
    ...prev,
    masteredNameNumbers,
    quizCorrectTotal: prev.quizCorrectTotal + 1,
    quizBestStreak: Math.max(prev.quizBestStreak, currentStreak),
  };
  saveUserActivity(next);
  return {
    state: next,
    isNewlyMastered: !alreadyMastered,
    xpAwarded: alreadyMastered ? 5 : 20, // 15 mastery + 5 answer XP for new name; 5 XP for repeat review
  };
}

export function recordNameQuizSessionComplete(): UserActivityState {
  const prev = loadUserActivity();
  const next: UserActivityState = {
    ...prev,
    quizSessionsCompleted: prev.quizSessionsCompleted + 1,
  };
  saveUserActivity(next);
  return next;
}

export function recordKnowledgeQuizAnswer(
  questionId: string,
  isCorrect: boolean
): { state: UserActivityState; isNewlyMastered: boolean; xpAwarded: number } {
  const prev = loadUserActivity();
  if (!isCorrect) {
    const alreadyMissed = prev.missedKnowledgeIds.includes(questionId);
    const next: UserActivityState = alreadyMissed
      ? prev
      : {
          ...prev,
          missedKnowledgeIds: [...prev.missedKnowledgeIds, questionId],
        };
    if (!alreadyMissed) {
      saveUserActivity(next);
    }
    return { state: next, isNewlyMastered: false, xpAwarded: 0 };
  }
  const alreadyMastered = prev.masteredKnowledgeIds.includes(questionId);
  const masteredKnowledgeIds = alreadyMastered
    ? prev.masteredKnowledgeIds
    : [...prev.masteredKnowledgeIds, questionId];
  const missedKnowledgeIds = prev.missedKnowledgeIds.filter((id) => id !== questionId);
  const next: UserActivityState = {
    ...prev,
    masteredKnowledgeIds,
    missedKnowledgeIds,
    knowledgeCorrectTotal: prev.knowledgeCorrectTotal + 1,
  };
  saveUserActivity(next);
  return {
    state: next,
    isNewlyMastered: !alreadyMastered,
    xpAwarded: alreadyMastered ? 5 : 15, // 10 mastery + 5 answer XP for new question; 5 XP for repeat review
  };
}

export function addQuranListenSeconds(deltaSeconds: number): void {
  const safe = Math.floor(deltaSeconds);
  if (safe <= 0 || safe > 120) return;
  const prev = loadUserActivity();
  saveUserActivity({
    ...prev,
    quranListenSeconds: prev.quranListenSeconds + safe,
  });
}

export function resetUserActivity(): void {
  try {
    localStorage.removeItem(ACTIVITY_STORAGE_KEY);
  } catch {
    // ignore
  }
  emitActivityChanged();
}

export function readTasbihTotalBeads(): number {
  try {
    const raw = localStorage.getItem(TASBIH_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { totalBeads?: number };
      if (typeof parsed.totalBeads === 'number' && Number.isFinite(parsed.totalBeads)) {
        return Math.max(0, Math.floor(parsed.totalBeads));
      }
    }
  } catch {
    // ignore
  }
  return 0;
}

export function readRamadanFastedCount(): number {
  try {
    const raw = localStorage.getItem(RAMADAN_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, string>;
      return Object.values(parsed).filter((v) => v === 'completed').length;
    }
  } catch {
    // ignore
  }
  return 0;
}

export interface AchievementBadge {
  id: 'names_10' | 'tasbih_1000' | 'quran_1h' | 'ilm_20' | 'names_master';
  title: string;
  desc: string;
  bonusXp: number;
  unlocked: boolean;
}

export interface ActivitySummary {
  totalXp: number;
  level: number;
  levelStartXp: number;
  nextLevelXp: number;
  levelProgressPct: number;
  overallTitle: string;
  namesMastered: number;
  namesStageIndex: number; // 0..4
  namesStageLabels: string[];
  namesRank: string;
  namesNextGoal: number | null;
  namesNextRank: string | null;
  knowledgeMastered: number;
  knowledgeTotal: number;
  knowledgeStageIndex: number; // 0..4
  knowledgeRank: string;
  knowledgeNextGoal: number | null;
  knowledgeNextRank: string | null;
  knowledgeProgressPct: number;
  tasbihBeads: number;
  tasbihRank: string;
  tasbihNextGoal: number;
  tasbihProgressPct: number;
  quranMinutes: number;
  quranRank: string;
  quranNextGoalMinutes: number;
  quranProgressPct: number;
  fastedCount: number;
  badges: AchievementBadge[];
}

const NAMES_STAGES: Record<AppLanguage, string[]> = {
  uz_lat: ['Boshlovchi', 'Izlanuvchi', 'Zikr ahli', 'Bilimdon', 'Asma ul-Husna ustasi'],
  uz_cyr: ['Бошловчи', 'Изланувчи', 'Зикр аҳли', 'Билимдон', 'Асма ул-Ҳусна устаси'],
  ru: ['Новичок', 'Искатель', 'Усердный', 'Знаток', 'Мастер Асма уль-Хусна'],
  en: ['Beginner', 'Seeker', 'Devoted', 'Scholar', 'Asma ul-Husna Master'],
};

const NAMES_SHORT_STEPS: Record<AppLanguage, string[]> = {
  uz_lat: ['Boshlovchi', 'Izlanuvchi', 'Zikr ahli', 'Bilimdon', 'Usta'],
  uz_cyr: ['Бошловчи', 'Изланувчи', 'Зикр аҳли', 'Билимдон', 'Уста'],
  ru: ['Новичок', 'Искатель', 'Усердный', 'Знаток', 'Мастер'],
  en: ['Beginner', 'Seeker', 'Devoted', 'Scholar', 'Master'],
};

const KNOWLEDGE_RANKS: Record<AppLanguage, [string, string, string, string, string]> = {
  uz_lat: ['Boshlovchi', 'Tolib', 'Zukko', 'Ilm ahli', 'Ilm ustasi'],
  uz_cyr: ['Бошловчи', 'Толиб', 'Зукко', 'Илм аҳли', 'Илм устаси'],
  ru: ['Новичок', 'Искатель', 'Эрудит', 'Знаток', 'Мастер знаний'],
  en: ['Beginner', 'Student', 'Insightful', 'Scholar', 'Knowledge Master'],
};

const TASBIH_RANKS: Record<AppLanguage, [string, string, string, string]> = {
  uz_lat: ['Boshlovchi', 'Zokir', 'Sobit Zokir', 'Tasbeh ustasi'],
  uz_cyr: ['Бошловчи', 'Зокир', 'Собит Зокир', 'Тасбеҳ устаси'],
  ru: ['Новичок', 'Закир', 'Стойкий', 'Мастер тасбиха'],
  en: ['Beginner', 'Remembrancer', 'Steadfast', 'Tasbih Master'],
};

const QURAN_RANKS: Record<AppLanguage, [string, string, string, string]> = {
  uz_lat: ['Tinglovchi', 'Muhib', 'Sodiq tinglovchi', "Qur'on oshnosi"],
  uz_cyr: ['Тингловчи', 'Муҳиб', 'Содиқ тингловчи', 'Қуръон ошноси'],
  ru: ['Слушатель', 'Любящий', 'Преданный', 'Друг Корана'],
  en: ['Listener', 'Lover of Quran', 'Devoted Listener', 'Companion of Quran'],
};

const BADGE_COPY: Record<
  AppLanguage,
  Record<AchievementBadge['id'], { title: string; desc: string }>
> = {
  uz_lat: {
    names_10: { title: 'Ilk 10 Ism', desc: "Allohning 10 ta ismini testda to'g'ri toping" },
    tasbih_1000: { title: 'Zokir 1,000', desc: 'Tasbehda jami 1 000 ta zikrga yeting' },
    quran_1h: { title: 'Qiroat Muhibi', desc: "Kamida 1 soat Qur'on qiroati tinglang" },
    ilm_20: { title: 'Ilm Tolibi', desc: "Ilm viktorinasida 20 ta savolni to'g'ri yeching" },
    names_master: { title: 'Asma Ustasi', desc: "Kamida 90 ta ismni testda o'zlashtiring" },
  },
  uz_cyr: {
    names_10: { title: 'Илк 10 Исм', desc: 'Аллоҳнинг 10 та исмини тестда тўғри топинг' },
    tasbih_1000: { title: 'Зокир 1,000', desc: 'Тасбеҳда жами 1 000 та зикрга етинг' },
    quran_1h: { title: 'Қироат Муҳиби', desc: 'Камида 1 соат Қуръон қироати тингланг' },
    ilm_20: { title: 'Илм Толиби', desc: 'Илм викторинасида 20 та саволни тўғри ечинг' },
    names_master: { title: 'Асма Устаси', desc: 'Камида 90 та исмни тестда ўзлаштиринг' },
  },
  ru: {
    names_10: { title: '10 Имён', desc: 'Ответьте верно на 10 разных Имён Аллаха' },
    tasbih_1000: { title: 'Закир 1 000', desc: 'Совершите 1 000 зикров в Тасбихе' },
    quran_1h: { title: '1 час Корана', desc: 'Прослушайте не менее 1 часа чтения Корана' },
    ilm_20: { title: 'Искатель знаний', desc: 'Освойте 20 вопросов в Исламской викторине' },
    names_master: { title: 'Мастер Асма', desc: 'Освойте 90+ Имён Аллаха в тесте' },
  },
  en: {
    names_10: { title: 'First 10 Names', desc: 'Answer 10 unique Names of Allah correctly' },
    tasbih_1000: { title: '1,000 Dhikr', desc: 'Reach 1,000 total beads in Tasbih' },
    quran_1h: { title: '1h Recitation', desc: 'Listen to 1 hour of Quran recitation' },
    ilm_20: { title: 'Knowledge Seeker', desc: 'Master 20 questions in the Islamic Quiz' },
    names_master: { title: 'Asma Master', desc: 'Master 90+ Names of Allah in the quiz' },
  },
};

function cumulativeXpForLevel(level: number): number {
  if (level <= 1) return 0;
  // Level 1 -> 2: 150 XP, 2 -> 3: 200 XP, 3 -> 4: 250 XP, ...
  let total = 0;
  for (let l = 1; l < level; l += 1) {
    total += 100 + l * 50;
  }
  return total;
}

export function formatListeningDuration(minutes: number, lang: AppLanguage): string {
  if (minutes < 60) {
    if (lang === 'en') return `${minutes}m`;
    if (lang === 'ru') return `${minutes} мин`;
    if (lang === 'uz_cyr') return `${minutes} дақ`;
    return `${minutes} daq`;
  }
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (lang === 'en') return m > 0 ? `${h}h ${m}m` : `${h}h`;
  if (lang === 'ru') return m > 0 ? `${h}ч ${m}м` : `${h}ч`;
  if (lang === 'uz_cyr') return m > 0 ? `${h}с ${m}д` : `${h} соат`;
  return m > 0 ? `${h}s ${m}d` : `${h} soat`;
}

export function computeActivitySummary(lang: AppLanguage): ActivitySummary {
  const act = loadUserActivity();
  const tasbihBeads = readTasbihTotalBeads();
  const fastedCount = readRamadanFastedCount();
  const namesMastered = act.masteredNameNumbers.length;
  const knowledgeMastered = act.masteredKnowledgeIds.length;
  const knowledgeTotal = TOTAL_KNOWLEDGE_QUESTIONS;
  const quranMinutes = Math.floor(act.quranListenSeconds / 60);

  // Badges
  const bCopy = BADGE_COPY[lang] || BADGE_COPY.uz_lat;
  const badges: AchievementBadge[] = [
    {
      id: 'names_10',
      title: bCopy.names_10.title,
      desc: bCopy.names_10.desc,
      bonusXp: 100,
      unlocked: namesMastered >= 10,
    },
    {
      id: 'tasbih_1000',
      title: bCopy.tasbih_1000.title,
      desc: bCopy.tasbih_1000.desc,
      bonusXp: 150,
      unlocked: tasbihBeads >= 1000,
    },
    {
      id: 'quran_1h',
      title: bCopy.quran_1h.title,
      desc: bCopy.quran_1h.desc,
      bonusXp: 150,
      unlocked: quranMinutes >= 60,
    },
    {
      id: 'ilm_20',
      title: bCopy.ilm_20.title,
      desc: bCopy.ilm_20.desc,
      bonusXp: 200,
      unlocked: knowledgeMastered >= 20,
    },
    {
      id: 'names_master',
      title: bCopy.names_master.title,
      desc: bCopy.names_master.desc,
      bonusXp: 500,
      unlocked: namesMastered >= 90,
    },
  ];

  const badgeXp = badges.reduce((sum, b) => sum + (b.unlocked ? b.bonusXp : 0), 0);
  const totalXp =
    namesMastered * 15 +
    act.quizCorrectTotal * 5 +
    knowledgeMastered * 10 +
    act.knowledgeCorrectTotal * 5 +
    Math.floor(tasbihBeads / 10) +
    quranMinutes * 5 +
    badgeXp;

  // Level calculation
  let level = 1;
  while (cumulativeXpForLevel(level + 1) <= totalXp && level < 99) {
    level += 1;
  }
  const levelStartXp = cumulativeXpForLevel(level);
  const nextLevelXp = cumulativeXpForLevel(level + 1);
  const span = Math.max(1, nextLevelXp - levelStartXp);
  const levelProgressPct = Math.min(100, Math.round(((totalXp - levelStartXp) / span) * 100));

  // Asma ul-Husna 5-tier rank
  const nLabels = NAMES_STAGES[lang] || NAMES_STAGES.uz_lat;
  const nShort = NAMES_SHORT_STEPS[lang] || NAMES_SHORT_STEPS.uz_lat;
  let namesStageIndex = 0;
  let namesNextGoal: number | null = 10;
  if (namesMastered >= 90) {
    namesStageIndex = 4;
    namesNextGoal = null;
  } else if (namesMastered >= 60) {
    namesStageIndex = 3;
    namesNextGoal = 90;
  } else if (namesMastered >= 30) {
    namesStageIndex = 2;
    namesNextGoal = 60;
  } else if (namesMastered >= 10) {
    namesStageIndex = 1;
    namesNextGoal = 30;
  }
  const namesRank = nLabels[namesStageIndex];
  const namesNextRank = namesStageIndex < 4 ? nLabels[namesStageIndex + 1] : null;

  // Islamic Knowledge Quiz 5-tier rank (0..19, 20..49, 50..84, 85..119, 120)
  const kLabels = KNOWLEDGE_RANKS[lang] || KNOWLEDGE_RANKS.uz_lat;
  let knowledgeStageIndex = 0;
  let knowledgeNextGoal: number | null = 20;
  if (knowledgeMastered >= knowledgeTotal) {
    knowledgeStageIndex = 4;
    knowledgeNextGoal = null;
  } else if (knowledgeMastered >= 85) {
    knowledgeStageIndex = 3;
    knowledgeNextGoal = knowledgeTotal;
  } else if (knowledgeMastered >= 50) {
    knowledgeStageIndex = 2;
    knowledgeNextGoal = 85;
  } else if (knowledgeMastered >= 20) {
    knowledgeStageIndex = 1;
    knowledgeNextGoal = 50;
  }
  const knowledgeRank = kLabels[knowledgeStageIndex];
  const knowledgeNextRank = knowledgeStageIndex < 4 ? kLabels[knowledgeStageIndex + 1] : null;
  const knowledgeProgressPct = Math.min(
    100,
    Math.round((knowledgeMastered / Math.max(1, knowledgeTotal)) * 100)
  );

  // Tasbih 4-tier rank
  const tLabels = TASBIH_RANKS[lang] || TASBIH_RANKS.uz_lat;
  let tasbihIdx = 0;
  let tasbihNextGoal = 500;
  if (tasbihBeads >= 25000) {
    tasbihIdx = 3;
    tasbihNextGoal = 25000;
  } else if (tasbihBeads >= 5000) {
    tasbihIdx = 2;
    tasbihNextGoal = 25000;
  } else if (tasbihBeads >= 500) {
    tasbihIdx = 1;
    tasbihNextGoal = 5000;
  }
  const tasbihProgressPct = Math.min(100, Math.round((tasbihBeads / tasbihNextGoal) * 100));

  // Quran Listening 4-tier rank
  const qLabels = QURAN_RANKS[lang] || QURAN_RANKS.uz_lat;
  let qIdx = 0;
  let quranNextGoalMinutes = 30;
  if (quranMinutes >= 900) {
    qIdx = 3;
    quranNextGoalMinutes = 900;
  } else if (quranMinutes >= 180) {
    qIdx = 2;
    quranNextGoalMinutes = 900;
  } else if (quranMinutes >= 30) {
    qIdx = 1;
    quranNextGoalMinutes = 180;
  }
  const quranProgressPct = Math.min(100, Math.round((quranMinutes / quranNextGoalMinutes) * 100));

  // Overall Hero Title: showcase highest prestige title earned
  let overallTitle = nLabels[0];
  if (namesStageIndex === 4) {
    overallTitle = nLabels[4];
  } else if (knowledgeStageIndex === 4) {
    overallTitle = kLabels[4];
  } else if (tasbihIdx === 3) {
    overallTitle = tLabels[3];
  } else if (qIdx === 3) {
    overallTitle = qLabels[3];
  } else if (namesStageIndex >= 1) {
    overallTitle = nLabels[namesStageIndex];
  } else if (knowledgeStageIndex >= 1) {
    overallTitle = kLabels[knowledgeStageIndex];
  } else if (tasbihIdx >= 1) {
    overallTitle = tLabels[tasbihIdx];
  } else if (qIdx >= 1) {
    overallTitle = qLabels[qIdx];
  }

  return {
    totalXp,
    level,
    levelStartXp,
    nextLevelXp,
    levelProgressPct,
    overallTitle,
    namesMastered,
    namesStageIndex,
    namesStageLabels: nShort,
    namesRank,
    namesNextGoal,
    namesNextRank,
    knowledgeMastered,
    knowledgeTotal,
    knowledgeStageIndex,
    knowledgeRank,
    knowledgeNextGoal,
    knowledgeNextRank,
    knowledgeProgressPct,
    tasbihBeads,
    tasbihRank: tLabels[tasbihIdx],
    tasbihNextGoal,
    tasbihProgressPct,
    quranMinutes,
    quranRank: qLabels[qIdx],
    quranNextGoalMinutes,
    quranProgressPct,
    fastedCount,
    badges,
  };
}
