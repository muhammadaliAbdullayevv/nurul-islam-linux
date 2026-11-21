import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  Edit3,
  Loader2,
  MapPin,
  RotateCcw,
  Swords,
  Timer,
  Trophy,
  UserCheck,
  XCircle,
} from 'lucide-react';
import { NAMES_OF_ALLAH, getLocalizedAllahName } from '../data/names99';
import { AppLanguage } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { getOrCreateDeviceId } from '../utils/deviceId';
import {
  getUserHandle,
  recordNameQuizAnswer,
  recordNameQuizSessionComplete,
  setUserHandle,
} from '../utils/userActivity';
import {
  NamesBattleRoomState,
  getSavedUserCityName,
  leaveBattleRoom,
  pollBattleRoomState,
  startBattleMatchmake,
  submitBattleAnswer,
} from '../utils/namesBattleApi';

const BATTLE_UI: Record<
  AppLanguage,
  {
    heroBadge: string;
    searchingTitle: string;
    searchingSub: string;
    pausedTitle: string;
    pausedSub: string;
    saveNameBtn: string;
    findOpponentBtn: string;
    stopSearchBtn: string;
    youLabel: string;
    partnerLabel: string;
    thinkingStatus: string;
    answeredStatus: string;
    waitingOtherAnswer: string;
    nextQuestionAuto: string;
    victoryTitle: string;
    drawTitle: string;
    defeatTitle: string;
    victorySub: string;
    drawSub: string;
    defeatSub: string;
    correctOutOf10: (c: number, tot: number) => string;
    pointsUnit: string;
    playAgainBtn: string;
    promptText: string;
  }
> = {
  uz_lat: {
    heroBadge: '1v1 Jonli Bellashuv · 10 savol',
    searchingTitle: 'Raqib qidirilmoqda...',
    searchingSub: 'Ushbu sahifada bo‘lgan ikki foydalanuvchi avtomatik ulanadi va 10 ta savolli bellashuv boshlanadi',
    pausedTitle: '99 Ism Bellashuvi',
    pausedSub: 'Onlayn raqib bilan 10 ta savolda kuch sinashish uchun qidiruvni boshlang',
    saveNameBtn: 'Saqlash',
    findOpponentBtn: 'Raqib izlash',
    stopSearchBtn: 'Qidiruvni to‘xtatish',
    youLabel: 'Siz',
    partnerLabel: 'Raqib',
    thinkingStatus: 'O‘ylamoqda...',
    answeredStatus: 'Javob berdi ✓',
    waitingOtherAnswer: 'Raqib javobi kutilmoqda...',
    nextQuestionAuto: 'Keyingi savol ochilmoqda...',
    victoryTitle: 'G‘alaba! Barakalla!',
    drawTitle: 'Do‘stona Durang!',
    defeatTitle: 'Ajoyib Bellashuv!',
    victorySub: 'Siz 99 Ism bellashuvida yuqori natija bilan g‘olib bo‘ldingiz!',
    drawSub: 'Ikkalangiz ham teng ball to‘pladingiz — ilmingiz ziyoda bo‘lsin!',
    defeatSub: 'Raqibingiz bu safar ko‘proq ball oldi — yana urinib ko‘ring!',
    correctOutOf10: (c, t) => `${c}/${t} to‘g‘ri`,
    pointsUnit: 'ball',
    playAgainBtn: 'Yana raqib izlash',
    promptText: 'Ushbu muborak ismning ma’nosini tezroq toping:',
  },
  uz_cyr: {
    heroBadge: '1v1 Жонли Беллашув · 10 савол',
    searchingTitle: 'Рақиб қидирилмоқда...',
    searchingSub: 'Ушбу саҳифада бўлган икки фойдаланувчи автоматик уланади ва 10 та саволли беллашув бошланади',
    pausedTitle: '99 Исм Беллашуви',
    pausedSub: 'Онлайн рақиб билан 10 та саволда куч синашиш учун қидирувни бошланг',
    saveNameBtn: 'Сақлаш',
    findOpponentBtn: 'Рақиб излаш',
    stopSearchBtn: 'Қидирувни тўхтатиш',
    youLabel: 'Сиз',
    partnerLabel: 'Рақиб',
    thinkingStatus: 'Ўйламоқда...',
    answeredStatus: 'Жавоб берди ✓',
    waitingOtherAnswer: 'Рақиб жавоби кутилмоқда...',
    nextQuestionAuto: 'Кейинги савол очилмоқда...',
    victoryTitle: 'Ғалаба! Баракалла!',
    drawTitle: 'Дўстона Дуранг!',
    defeatTitle: 'Ажойиб Беллашув!',
    victorySub: 'Сиз 99 Исм беллашувида юқори натижа билан ғолиб бўлдингиз!',
    drawSub: 'Иккалангиз ҳам тенг балл тўпладингиз — илмингиз зиёда бўлсин!',
    defeatSub: 'Рақибингиз бу сафар кўпроқ балл олди — яна уриниб кўринг!',
    correctOutOf10: (c, t) => `${c}/${t} тўғри`,
    pointsUnit: 'балл',
    playAgainBtn: 'Яна рақиб излаш',
    promptText: 'Ушбу муборак исмнинг маъносини тезроқ топинг:',
  },
  ru: {
    heroBadge: '1v1 Онлайн Дуэль · 10 вопросов',
    searchingTitle: 'Поиск соперника...',
    searchingSub: 'Два пользователя на этой странице подключаются автоматически к дуэли из 10 вопросов',
    pausedTitle: 'Дуэль по 99 Именам',
    pausedSub: 'Нажмите кнопку ниже, чтобы найти онлайн-соперника',
    saveNameBtn: 'Сохранить',
    findOpponentBtn: 'Найти соперника',
    stopSearchBtn: 'Остановить поиск',
    youLabel: 'Вы',
    partnerLabel: 'Соперник',
    thinkingStatus: 'Думает...',
    answeredStatus: 'Ответил ✓',
    waitingOtherAnswer: 'Ожидание ответа соперника...',
    nextQuestionAuto: 'Переход к следующему вопросу...',
    victoryTitle: 'Победа! Машааллах!',
    drawTitle: 'Дружеская ничья!',
    defeatTitle: 'Достойная игра!',
    victorySub: 'Вы одержали победу в дуэли по 99 Именам Аллаха!',
    drawSub: 'Вы набрали одинаковое количество очков!',
    defeatSub: 'Соперник набрал больше очков — попробуйте ещё раз!',
    correctOutOf10: (c, t) => `${c}/${t} верно`,
    pointsUnit: 'очк.',
    playAgainBtn: 'Найти соперника снова',
    promptText: 'Быстрее выберите значение этого Имени:',
  },
  en: {
    heroBadge: '1v1 Live Quiz Battle · 10 Questions',
    searchingTitle: 'Finding opponent...',
    searchingSub: 'When two users are on this page, they connect automatically for a 10-question battle',
    pausedTitle: '99 Names Quiz Battle',
    pausedSub: 'Start searching to automatically connect with another player',
    saveNameBtn: 'Save',
    findOpponentBtn: 'Find Opponent',
    stopSearchBtn: 'Stop Searching',
    youLabel: 'You',
    partnerLabel: 'Opponent',
    thinkingStatus: 'Thinking...',
    answeredStatus: 'Answered ✓',
    waitingOtherAnswer: 'Waiting for opponent’s answer...',
    nextQuestionAuto: 'Loading next question...',
    victoryTitle: 'Victory! MashaAllah!',
    drawTitle: 'Friendly Draw!',
    defeatTitle: 'Great Match!',
    victorySub: 'You won the 99 Names Quiz Battle!',
    drawSub: 'Both of you scored the exact same points!',
    defeatSub: 'Your opponent scored higher this round — play another match!',
    correctOutOf10: (c, t) => `${c}/${t} correct`,
    pointsUnit: 'pts',
    playAgainBtn: 'Find Opponent Again',
    promptText: 'Pick the meaning of this blessed Name:',
  },
};

export const NamesBattleArena: React.FC = () => {
  const { isDay } = useTheme();
  const { language } = useLanguage();
  const ui = BATTLE_UI[language] || BATTLE_UI.uz_lat;
  const myDeviceId = useMemo(() => getOrCreateDeviceId(), []);
  const myCity = useMemo(() => getSavedUserCityName(), []);

  const [myHandle, setMyHandle] = useState<string>(() => getUserHandle());
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState<string>(() => getUserHandle());

  const [room, setRoom] = useState<NamesBattleRoomState | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(true);
  const [waitSeconds, setWaitSeconds] = useState(0);
  const [localPickedForQ, setLocalPickedForQ] = useState<Record<number, number>>({});
  const activeRoomIdRef = useRef<string | null>(null);
  const recordedCompletionRoomRef = useRef<string | null>(null);

  const beginQuickSearch = useCallback(
    async (customHandle?: string) => {
      setIsSearching(true);
      setLocalPickedForQ({});
      try {
        const nextRoom = await startBattleMatchmake({
          mode: 'quick',
          handle: customHandle || myHandle,
          city: myCity,
        });
        activeRoomIdRef.current = nextRoom.roomId;
        setRoom(nextRoom);
      } catch {
        // retry automatically via poll effect
      }
    },
    [myCity, myHandle]
  );

  // Automatically start searching for an opponent as soon as user enters this screen
  useEffect(() => {
    void beginQuickSearch();
    return () => {
      if (activeRoomIdRef.current) {
        void leaveBattleRoom(activeRoomIdRef.current);
        activeRoomIdRef.current = null;
      }
    };
  }, [beginQuickSearch]);

  // Poll active room every 800ms; if waiting in queue, also re-check matchmaking every 2.5s so two waiting users always pair up immediately
  useEffect(() => {
    if (!isSearching && (!room || room.status === 'waiting')) return;
    if (room && room.status === 'finished') return;

    let alive = true;

    const poll = async () => {
      try {
        if (!room) {
          const created = await startBattleMatchmake({
            mode: 'quick',
            handle: myHandle,
            city: myCity,
          });
          if (alive) {
            activeRoomIdRef.current = created.roomId;
            setRoom(created);
          }
          return;
        }

        const updated = await pollBattleRoomState(room.roomId);
        if (!alive) return;
        activeRoomIdRef.current = updated.roomId;
        setRoom(updated);
      } catch {
        // ignore transient network glitch
      }
    };

    const id = window.setInterval(poll, 800);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, [isSearching, myCity, myHandle, room]);

  // Track waiting seconds while searching for an opponent
  useEffect(() => {
    if (!isSearching || (room && room.status !== 'waiting')) {
      setWaitSeconds(0);
      return;
    }
    const id = window.setInterval(() => {
      setWaitSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [isSearching, room]);

  // Record session completion when battle finishes
  useEffect(() => {
    if (room && room.status === 'finished' && recordedCompletionRoomRef.current !== room.roomId) {
      recordedCompletionRoomRef.current = room.roomId;
      recordNameQuizSessionComplete();
    }
  }, [room]);

  const handleSaveName = () => {
    const saved = setUserHandle(draftName);
    setMyHandle(saved);
    setDraftName(saved);
    setEditingName(false);
    if (isSearching && (!room || room.status === 'waiting')) {
      void beginQuickSearch(saved);
    }
  };

  const handleStopSearch = async () => {
    setIsSearching(false);
    if (activeRoomIdRef.current) {
      await leaveBattleRoom(activeRoomIdRef.current);
      activeRoomIdRef.current = null;
    }
    setRoom(null);
  };

  const handlePickOption = async (pickedNumber: number) => {
    if (!room || room.status !== 'playing') return;
    const qIdx = room.currentQuestionIndex;
    if (localPickedForQ[qIdx] !== undefined) return;

    const currentQ = room.questions[qIdx];
    if (!currentQ) return;

    setLocalPickedForQ((prev) => ({ ...prev, [qIdx]: pickedNumber }));

    const isCorrect = pickedNumber === currentQ.target;
    if (isCorrect) {
      recordNameQuizAnswer(currentQ.target, true, 1);
    }

    try {
      const updated = await submitBattleAnswer({
        roomId: room.roomId,
        qIndex: qIdx,
        pickedNumber,
      });
      setRoom(updated);
    } catch {
      // poll will sync
    }
  };

  const cardCls = isDay
    ? 'rounded-2xl bg-white border border-[#dde3ea] shadow-xs'
    : 'rounded-2xl bg-slate-900/90 border border-emerald-900/60';
  const subTextCls = isDay ? 'text-slate-500' : 'text-slate-400';

  const { me, opponent } = useMemo(() => {
    if (!room) return { me: null, opponent: null };
    if (room.player1?.deviceId === myDeviceId) {
      return { me: room.player1, opponent: room.player2 };
    }
    if (room.player2?.deviceId === myDeviceId) {
      return { me: room.player2, opponent: room.player1 };
    }
    return { me: room.player1, opponent: room.player2 };
  }, [room, myDeviceId]);

  // ==================== 1. FIND OPPONENT SCREEN (AUTO-CONNECT) ====================
  if (!room || room.status === 'waiting') {
    return (
      <div className={`${cardCls} p-5 text-center space-y-4 animate-in fade-in`}>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#158509]/10 dark:bg-emerald-950 border border-[#158509]/25 dark:border-emerald-800 text-[#0c4703] dark:text-amber-300 text-[11px] font-bold">
          <Swords className="w-3.5 h-3.5" />
          <span>{ui.heroBadge}</span>
        </div>

        {/* Radar Animation */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          {isSearching && (
            <>
              <div
                className={`absolute inset-0 rounded-full animate-ping opacity-25 ${
                  isDay ? 'bg-[#158509]' : 'bg-amber-400'
                }`}
              />
              <div
                className={`absolute inset-2 rounded-full animate-pulse opacity-20 ${
                  isDay ? 'bg-[#158509]' : 'bg-amber-400'
                }`}
              />
            </>
          )}
          <div
            className={`relative w-16 h-16 rounded-2xl flex items-center justify-center border shadow-sm ${
              isDay
                ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#158509]'
                : 'bg-emerald-950 border-emerald-700 text-amber-400'
            }`}
          >
            <Swords className="w-8 h-8" />
          </div>
        </div>

        <div className="space-y-1">
          {isSearching && (
            <div className="text-xs font-mono font-extrabold text-[#158509] dark:text-amber-300">
              00:{String(waitSeconds).padStart(2, '0')}
            </div>
          )}
          <h3 className="text-base font-extrabold">
            {isSearching ? ui.searchingTitle : ui.pausedTitle}
          </h3>
          <p className={`text-xs leading-snug max-w-xs mx-auto ${subTextCls}`}>
            {isSearching ? ui.searchingSub : ui.pausedSub}
          </p>
        </div>

        {/* Player Identity Card */}
        <div
          className={`rounded-2xl px-3.5 py-2.5 border flex items-center justify-between gap-2 text-left ${
            isDay ? 'bg-slate-50 border-[#dde3ea]' : 'bg-slate-950 border-emerald-900/60'
          }`}
        >
          {editingName ? (
            <div className="flex items-center gap-1.5 w-full">
              <input
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                maxLength={20}
                className={`flex-1 rounded-xl border px-2.5 py-1.5 text-xs font-bold outline-none ${
                  isDay
                    ? 'bg-white border-[#dde3ea] text-slate-900'
                    : 'bg-slate-900 border-emerald-800 text-white'
                }`}
              />
              <button
                type="button"
                onClick={handleSaveName}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold ${
                  isDay ? 'bg-[#158509] text-white nq-keep-dark' : 'bg-amber-400 text-slate-950'
                }`}
              >
                {ui.saveNameBtn}
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2.5 min-w-0">
                <UserCheck
                  className={`w-4 h-4 shrink-0 ${isDay ? 'text-[#158509]' : 'text-emerald-400'}`}
                />
                <div className="min-w-0">
                  <span className="text-xs font-extrabold truncate block">{myHandle}</span>
                  <span className={`text-[10.5px] inline-flex items-center gap-1 ${subTextCls}`}>
                    <MapPin className="w-3 h-3" />
                    {myCity}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDraftName(myHandle);
                  setEditingName(true);
                }}
                className={`p-1.5 rounded-xl border transition ${
                  isDay
                    ? 'bg-white border-slate-200 text-slate-600'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>

        {isSearching ? (
          <button
            type="button"
            onClick={handleStopSearch}
            className={`w-full py-2.5 px-4 rounded-2xl border text-xs font-bold transition ${
              isDay
                ? 'bg-white border-[#dde3ea] text-slate-600 hover:bg-slate-50'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            {ui.stopSearchBtn}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void beginQuickSearch()}
            className={`w-full py-3 px-4 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition ${
              isDay
                ? 'bg-[#158509] hover:bg-[#0c5007] text-white nq-keep-dark'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
            }`}
          >
            <Swords className="w-4 h-4" />
            <span>{ui.findOpponentBtn}</span>
          </button>
        )}
      </div>
    );
  }

  // ==================== 2. BATTLE FINISHED RESULT SCREEN ====================
  if (room.status === 'finished') {
    const myScore = me?.score || 0;
    const oppScore = opponent?.score || 0;
    const isWin = myScore > oppScore;
    const isDraw = myScore === oppScore;

    return (
      <div className={`${cardCls} p-5 text-center space-y-4 animate-in fade-in`}>
        <div
          className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center ${
            isWin
              ? isDay
                ? 'bg-[#eef9ea] text-[#158509]'
                : 'bg-emerald-950 text-amber-400'
              : isDraw
              ? 'bg-amber-500/15 text-amber-500'
              : 'bg-slate-500/15 text-slate-500'
          }`}
        >
          <Trophy className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h2 className="text-lg font-extrabold">
            {isWin ? ui.victoryTitle : isDraw ? ui.drawTitle : ui.defeatTitle}
          </h2>
          <p className={`text-xs ${subTextCls}`}>
            {isWin ? ui.victorySub : isDraw ? ui.drawSub : ui.defeatSub}
          </p>
        </div>

        {/* Side-by-Side Final Scoreboard */}
        <div className="grid grid-cols-2 gap-2.5">
          <div
            className={`p-3 rounded-2xl border ${
              isWin
                ? isDay
                  ? 'bg-[#eef9ea] border-[#158509]'
                  : 'bg-emerald-950/70 border-emerald-500'
                : isDay
                ? 'bg-slate-50 border-[#dde3ea]'
                : 'bg-slate-950 border-slate-800'
            }`}
          >
            <div className="text-[10.5px] font-bold uppercase text-[#158509] dark:text-emerald-400">
              {ui.youLabel}
            </div>
            <div className="text-xs font-extrabold truncate mt-0.5">{me?.handle}</div>
            <div className="text-xl font-mono font-extrabold mt-1">
              {myScore} <span className="text-[10px] font-normal">{ui.pointsUnit}</span>
            </div>
            <div className={`text-[11px] font-bold mt-0.5 ${subTextCls}`}>
              {ui.correctOutOf10(me?.correctCount || 0, room.totalQuestions)}
            </div>
          </div>

          <div
            className={`p-3 rounded-2xl border ${
              !isWin && !isDraw
                ? isDay
                  ? 'bg-amber-50 border-amber-400'
                  : 'bg-amber-950/40 border-amber-500'
                : isDay
                ? 'bg-slate-50 border-[#dde3ea]'
                : 'bg-slate-950 border-slate-800'
            }`}
          >
            <div className="text-[10.5px] font-bold uppercase text-amber-600 dark:text-amber-400">
              {ui.partnerLabel}
            </div>
            <div className="text-xs font-extrabold truncate mt-0.5">
              {opponent?.handle || ui.partnerLabel}
            </div>
            <div className="text-xl font-mono font-extrabold mt-1">
              {oppScore} <span className="text-[10px] font-normal">{ui.pointsUnit}</span>
            </div>
            <div className={`text-[11px] font-bold mt-0.5 ${subTextCls}`}>
              {ui.correctOutOf10(opponent?.correctCount || 0, room.totalQuestions)}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void beginQuickSearch()}
          className={`w-full py-3 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition ${
            isDay
              ? 'bg-[#158509] hover:bg-[#0c5007] text-white nq-keep-dark'
              : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>{ui.playAgainBtn}</span>
        </button>
      </div>
    );
  }

  // ==================== 3. LIVE 10-QUESTION BATTLE SCREEN (NO SCROLL) ====================
  const qIdx = room.currentQuestionIndex;
  const activePayload = room.questions[qIdx] || room.questions[0];
  const targetName =
    NAMES_OF_ALLAH.find((n) => n.number === activePayload.target) || NAMES_OF_ALLAH[0];
  const targetLoc = getLocalizedAllahName(targetName, language);

  const myHistoryCur = me?.history?.[qIdx];
  const oppHistoryCur = opponent?.history?.[qIdx];
  const myPickedNumber =
    localPickedForQ[qIdx] ??
    (myHistoryCur?.answered ? myHistoryCur.pickedNumber : null) ??
    null;
  const hasAnswered = myPickedNumber !== null;
  const remainingSec = Math.ceil((room.questionRemainingMs || 0) / 1000);

  return (
    <div className="space-y-2 animate-in fade-in">
      {/* Live 1v1 Scoreboard Bar */}
      <div className={`${cardCls} px-3 py-2 flex items-center justify-between gap-2`}>
        {/* Player 1 (You) */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="text-xs font-extrabold truncate">{me?.handle || myHandle}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`text-xs font-mono font-extrabold ${
                isDay ? 'text-[#158509]' : 'text-emerald-400'
              }`}
            >
              {me?.score || 0} {ui.pointsUnit}
            </span>
            <span className={`text-[10px] font-mono ${subTextCls}`}>
              ({me?.correctCount || 0}/10)
            </span>
          </div>
        </div>

        {/* Center Question Counter & Timer */}
        <div className="flex flex-col items-center shrink-0 px-2">
          <span className="text-[10.5px] font-mono font-extrabold uppercase tracking-wider text-slate-400">
            {qIdx + 1} / {room.totalQuestions}
          </span>
          <div
            className={`mt-0.5 px-2 py-0.5 rounded-full text-xs font-mono font-extrabold inline-flex items-center gap-1 ${
              remainingSec <= 4
                ? 'bg-rose-500/20 text-rose-600 dark:text-rose-300'
                : isDay
                ? 'bg-[#eef9ea] text-[#0c4703]'
                : 'bg-emerald-950 text-amber-300'
            }`}
          >
            <Timer className="w-3 h-3" />
            <span>{remainingSec}s</span>
          </div>
        </div>

        {/* Player 2 (Opponent) */}
        <div className="min-w-0 flex-1 text-right">
          <div className="text-xs font-extrabold truncate">
            {opponent?.handle || ui.partnerLabel}
          </div>
          <div className="flex items-center justify-end gap-1.5 mt-0.5">
            <span className={`text-[10px] font-mono ${subTextCls}`}>
              ({opponent?.correctCount || 0}/10)
            </span>
            <span className="text-xs font-mono font-extrabold text-amber-600 dark:text-amber-400">
              {opponent?.score || 0} {ui.pointsUnit}
            </span>
          </div>
          <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            {oppHistoryCur?.answered ? ui.answeredStatus : ui.thinkingStatus}
          </div>
        </div>
      </div>

      {/* Compact Question Hero Card */}
      <div
        className={`nq-keep-dark rounded-2xl px-4 py-3 text-center text-white space-y-1 shadow-md border ${
          isDay ? 'nq-hero-day border-[#0a4306]' : 'nq-hero-night border-emerald-800/60'
        }`}
      >
        <div className="flex items-center justify-center gap-3">
          <div className="font-arabic text-3xl font-bold text-[#fde68a] leading-tight" dir="rtl">
            {targetName.arabic}
          </div>
          <div className="text-base font-extrabold tracking-tight text-white">
            {targetLoc.transliteration}
          </div>
        </div>
        <p className="text-[11px] text-white/80 leading-snug">{ui.promptText}</p>
      </div>

      {/* 4 Answer Choices */}
      <div className="space-y-1.5">
        {activePayload.options.map((optNum) => {
          const optName = NAMES_OF_ALLAH.find((n) => n.number === optNum) || NAMES_OF_ALLAH[0];
          const optLoc = getLocalizedAllahName(optName, language);
          const isTarget = optNum === activePayload.target;
          const isPicked = myPickedNumber === optNum;

          let btnCls = isDay
            ? 'bg-white border-[#dde3ea] text-slate-800 hover:border-[#158509]'
            : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-emerald-700';

          if (hasAnswered) {
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
              key={optNum}
              type="button"
              disabled={hasAnswered}
              onClick={() => handlePickOption(optNum)}
              className={`w-full py-2.5 px-3.5 rounded-xl border text-left text-xs transition flex items-center justify-between gap-2 ${btnCls}`}
            >
              <span className="leading-snug">{optLoc.meaning}</span>
              {hasAnswered && isTarget && <CheckCircle2 className="w-4 h-4 shrink-0" />}
              {hasAnswered && isPicked && !isTarget && <XCircle className="w-4 h-4 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Auto-Progression Status Strip */}
      {hasAnswered && (
        <div
          className={`rounded-xl px-3 py-2 border text-center text-[11px] font-bold flex items-center justify-center gap-1.5 ${
            isDay
              ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
              : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
          }`}
        >
          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
          <span>
            {room.bothAnsweredCurrent ? ui.nextQuestionAuto : ui.waitingOtherAnswer}
          </span>
        </div>
      )}
    </div>
  );
};
