import { API_BASE_URLS } from './appUpdater';
import { getOrCreateDeviceId } from './deviceId';
import { getUserHandle } from './userActivity';

export interface BattleQuestionPayload {
  target: number;
  options: [number, number, number, number];
}

export interface BattleAnswerHistoryItem {
  answered: boolean;
  isCorrect: boolean | null;
  pickedNumber: number | null;
  points: number;
}

export interface BattlePlayerState {
  deviceId: string;
  handle: string;
  city: string;
  isBot: boolean;
  score: number;
  correctCount: number;
  history: BattleAnswerHistoryItem[];
}

export interface NamesBattleRoomState {
  roomId: string;
  roomCode: string;
  isPublic: boolean;
  status: 'waiting' | 'playing' | 'finished';
  currentQuestionIndex: number;
  totalQuestions: number;
  questionTimeLimitMs: number;
  questionRemainingMs: number;
  bothAnsweredCurrent: boolean;
  questions: BattleQuestionPayload[];
  player1: BattlePlayerState | null;
  player2: BattlePlayerState | null;
}

export interface WaitingBattleLobbyItem {
  roomId: string;
  roomCode: string;
  hostHandle: string;
  hostCity: string;
  totalQuestions: number;
  createdAt: number;
}

function getApiBase(): string {
  return API_BASE_URLS[0] || 'https://nurulislam.mabdullayev.dev';
}

export function getSavedUserCityName(): string {
  try {
    const raw = localStorage.getItem('nq_city');
    if (raw) {
      const parsed = JSON.parse(raw) as { cityName?: string; region?: string };
      if (parsed.cityName) return parsed.cityName;
      if (parsed.region) return parsed.region;
    }
  } catch {
    // ignore
  }
  return 'Toshkent';
}

export async function fetchBattleLobby(): Promise<{
  waitingRooms: WaitingBattleLobbyItem[];
  activeMatches: number;
}> {
  const deviceId = getOrCreateDeviceId();
  const res = await fetch(
    `${getApiBase()}/api/names-battle/lobby?deviceId=${encodeURIComponent(deviceId)}`,
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error('Failed to load battle lobby');
  return res.json();
}

export async function startBattleMatchmake(params: {
  mode: 'quick' | 'create' | 'join';
  roomCode?: string;
  roomId?: string;
  handle?: string;
  city?: string;
}): Promise<NamesBattleRoomState> {
  const res = await fetch(`${getApiBase()}/api/names-battle/matchmake`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      deviceId: getOrCreateDeviceId(),
      handle: params.handle || getUserHandle(),
      city: params.city || getSavedUserCityName(),
      mode: params.mode,
      roomCode: params.roomCode || '',
      roomId: params.roomId || '',
    }),
  });
  const data = await res.json();
  if (!res.ok || !data.room) {
    throw new Error(data.error || 'Matchmaking error');
  }
  return data.room as NamesBattleRoomState;
}

export async function startBattleWithBot(roomId: string): Promise<NamesBattleRoomState> {
  const res = await fetch(`${getApiBase()}/api/names-battle/start-bot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      deviceId: getOrCreateDeviceId(),
      roomId,
    }),
  });
  const data = await res.json();
  if (!res.ok || !data.room) {
    throw new Error(data.error || 'Failed to start bot match');
  }
  return data.room as NamesBattleRoomState;
}

export async function pollBattleRoomState(roomId: string): Promise<NamesBattleRoomState> {
  const deviceId = getOrCreateDeviceId();
  const res = await fetch(
    `${getApiBase()}/api/names-battle/state?roomId=${encodeURIComponent(
      roomId
    )}&deviceId=${encodeURIComponent(deviceId)}`,
    { cache: 'no-store' }
  );
  const data = await res.json();
  if (!res.ok || !data.room) {
    throw new Error(data.error || 'Room not found');
  }
  return data.room as NamesBattleRoomState;
}

export async function submitBattleAnswer(params: {
  roomId: string;
  qIndex: number;
  pickedNumber: number;
}): Promise<NamesBattleRoomState> {
  const res = await fetch(`${getApiBase()}/api/names-battle/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      deviceId: getOrCreateDeviceId(),
      roomId: params.roomId,
      qIndex: params.qIndex,
      pickedNumber: params.pickedNumber,
    }),
  });
  const data = await res.json();
  if (!res.ok || !data.room) {
    throw new Error(data.error || 'Failed to submit answer');
  }
  return data.room as NamesBattleRoomState;
}

export async function leaveBattleRoom(roomId: string): Promise<void> {
  try {
    await fetch(`${getApiBase()}/api/names-battle/leave`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId: getOrCreateDeviceId(),
        roomId,
      }),
    });
  } catch {
    // ignore network errors on leave
  }
}
