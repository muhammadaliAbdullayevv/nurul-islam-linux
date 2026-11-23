import React, { useEffect, useMemo, useState } from 'react';
import {
  Heart,
  Loader2,
  Pause,
  Play,
  Radio,
  Search,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  WifiOff,
} from 'lucide-react';
import { AppLanguage } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  RadioCategory,
  getEffectiveRadioStations,
  getRadioStationById,
} from '../../data/quranRadioStations';
import { subscribeRemoteAppConfig } from '../../utils/remoteAppConfig';
import {
  QuranRadioState,
  loadFavoriteRadioIds,
  loadLastRadioStationId,
  quranRadioPlayer,
  saveFavoriteRadioIds,
} from '../../utils/quranRadioPlayer';

const RADIO_UI: Record<
  AppLanguage,
  {
    liveBadge: string;
    connecting: string;
    readyLabel: string;
    pausedLabel: string;
    offlineErr: string;
    retryBtn: string;
    searchPlaceholder: string;
    catAll: string;
    catReciters: string;
    catHaramain: string;
    catCalm: string;
    catFavorites: string;
    backgroundNote: string;
    emptyFav: string;
    stationsCount: (n: number) => string;
  }
> = {
  uz_lat: {
    liveBadge: 'JONLI EFIR · 24/7',
    connecting: 'Efirga ulanmoqda...',
    readyLabel: 'Tinglash uchun bosing',
    pausedLabel: 'To‘xtatildi',
    offlineErr: 'Efirga ulanib bo‘lmadi. Internetni tekshirib qayta urining.',
    retryBtn: 'Qayta urinish',
    searchPlaceholder: 'Qori yoki kanal qidirish...',
    catAll: 'Barchasi',
    catReciters: 'Qorilar',
    catHaramain: 'Haramayn',
    catCalm: 'Sakinat',
    catFavorites: 'Sevimli',
    backgroundNote: 'Boshqa sahifalarga o‘tganingizda ham radio ijro etishda davom etadi',
    emptyFav: 'Sevimli kanallaringiz hozircha yo‘q — yurakcha belgisini bosib saqlang.',
    stationsCount: (n) => `${n} ta jonli kanal`,
  },
  uz_cyr: {
    liveBadge: 'ЖОНЛИ ЭФИР · 24/7',
    connecting: 'Эфирга уланмоқда...',
    readyLabel: 'Тинглаш учун босинг',
    pausedLabel: 'Тўхтатилди',
    offlineErr: 'Эфирга уланиб бўлмади. Интернетни текшириб қайта урининг.',
    retryBtn: 'Қайта уриниш',
    searchPlaceholder: 'Қори ёки канал қидириш...',
    catAll: 'Барчаси',
    catReciters: 'Қорилар',
    catHaramain: 'Ҳарамайн',
    catCalm: 'Сакинат',
    catFavorites: 'Севимли',
    backgroundNote: 'Бошқа саҳифаларга ўтганингизда ҳам радио ижро этишда давом этади',
    emptyFav: 'Севимли каналларингиз ҳозирча йўқ — юракча белгисини босиб сақланг.',
    stationsCount: (n) => `${n} та жонли канал`,
  },
  ru: {
    liveBadge: 'ПРЯМОЙ ЭФИР · 24/7',
    connecting: 'Подключение к эфиру...',
    readyLabel: 'Нажмите для прослушивания',
    pausedLabel: 'На паузе',
    offlineErr: 'Не удалось подключиться. Проверьте интернет и попробуйте снова.',
    retryBtn: 'Повторить',
    searchPlaceholder: 'Поиск чтеца или радиостанции...',
    catAll: 'Все',
    catReciters: 'Чтецы',
    catHaramain: 'Харамайн',
    catCalm: 'Спокойствие',
    catFavorites: 'Избранное',
    backgroundNote: 'Радио продолжит играть в фоне при переходе в другие разделы',
    emptyFav: 'В избранном пока пусто — нажмите на сердечко у любимой станции.',
    stationsCount: (n) => `${n} станций онлайн`,
  },
  en: {
    liveBadge: 'LIVE STREAM · 24/7',
    connecting: 'Connecting to live stream...',
    readyLabel: 'Tap play to listen live',
    pausedLabel: 'Paused',
    offlineErr: 'Could not reach the stream. Check your internet connection and retry.',
    retryBtn: 'Retry',
    searchPlaceholder: 'Search reciter or station...',
    catAll: 'All',
    catReciters: 'Reciters',
    catHaramain: 'Haramain',
    catCalm: 'Serene',
    catFavorites: 'Favorites',
    backgroundNote: 'Keeps playing smoothly in the background while you browse other sections',
    emptyFav: 'No favorite stations yet — tap the heart icon on any station to pin it.',
    stationsCount: (n) => `${n} live channels`,
  },
};

export const RadioTab: React.FC = () => {
  const { isDay } = useTheme();
  const { language } = useLanguage();
  const ui = RADIO_UI[language] || RADIO_UI.uz_lat;

  const [radioState, setRadioState] = useState<QuranRadioState>(() => quranRadioPlayer.getState());
  const [selectedId, setSelectedId] = useState<string>(
    () => quranRadioPlayer.getState().stationId || loadLastRadioStationId()
  );
  const [category, setCategory] = useState<RadioCategory>('all');
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => loadFavoriteRadioIds());
  const [stations, setStations] = useState(() => getEffectiveRadioStations());

  useEffect(() => {
    return subscribeRemoteAppConfig(() => {
      setStations(getEffectiveRadioStations());
    });
  }, []);

  useEffect(() => {
    return quranRadioPlayer.subscribe((st) => {
      setRadioState(st);
      if (st.stationId) {
        setSelectedId(st.stationId);
      }
    });
  }, []);

  const currentStation = useMemo(() => getRadioStationById(selectedId), [selectedId, stations]);
  const isCurrentActive = radioState.active && radioState.stationId === currentStation.id;
  const isPlaying = isCurrentActive && radioState.status === 'playing';
  const isConnecting = isCurrentActive && radioState.status === 'connecting';
  const isError = isCurrentActive && radioState.status === 'error';

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev];
      saveFavoriteRadioIds(next);
      return next;
    });
  };

  const filteredStations = useMemo(() => {
    const q = search.trim().toLowerCase();
    return stations.filter((st) => {
      if (category === 'favorites' && !favorites.includes(st.id)) return false;
      if (category !== 'all' && category !== 'favorites' && st.category !== category) return false;
      if (!q) return true;
      return (
        st.name[language].toLowerCase().includes(q) ||
        st.name.en.toLowerCase().includes(q) ||
        st.subtitle[language].toLowerCase().includes(q) ||
        st.arabicName.includes(q)
      );
    });
  }, [category, favorites, language, search]);

  const cardCls = isDay
    ? 'bg-white border-[#dde3ea] shadow-xs'
    : 'bg-slate-900/90 border-emerald-900/60';
  const subText = isDay ? 'text-slate-500' : 'text-slate-400';

  const categories: Array<{ id: RadioCategory; label: string }> = [
    { id: 'all', label: ui.catAll },
    { id: 'haramain', label: ui.catHaramain },
    { id: 'reciters', label: ui.catReciters },
    { id: 'calm', label: ui.catCalm },
    { id: 'favorites', label: ui.catFavorites },
  ];

  return (
    <div className={`space-y-3.5 pb-6 animate-in fade-in ${isDay ? 'text-slate-900' : 'text-slate-100'}`}>
      {/* Flagship Live Radio Console Hero */}
      <div
        className={`nq-keep-dark rounded-3xl p-4 sm:p-5 text-white border shadow-lg space-y-4 ${
          isDay ? 'nq-hero-day border-[#0a4306]' : 'nq-hero-night border-emerald-800/60'
        }`}
      >
        {/* Top Row: Live Pulse Pill + Channel Count + Favorite + Mute */}
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/25 border border-white/15">
            <span
              className={`w-2 h-2 rounded-full ${
                isPlaying
                  ? 'bg-rose-400 animate-ping'
                  : isConnecting
                  ? 'bg-amber-300 animate-pulse'
                  : 'bg-[#d0f39f]/70'
              }`}
            />
            <span className="text-[10px] font-extrabold tracking-wider uppercase text-[#d0f39f]">
              {ui.liveBadge}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => toggleFavorite(currentStation.id)}
              className={`w-8 h-8 rounded-xl border flex items-center justify-center transition active:scale-90 ${
                favorites.includes(currentStation.id)
                  ? 'bg-rose-500/25 border-rose-300/60 text-rose-200'
                  : 'bg-white/12 border-white/20 text-white/80 hover:bg-white/20'
              }`}
              aria-label="Toggle favorite station"
            >
              <Heart
                className={`w-4 h-4 ${favorites.includes(currentStation.id) ? 'fill-current' : ''}`}
              />
            </button>
            <button
              type="button"
              onClick={() => quranRadioPlayer.toggleMute()}
              className="w-8 h-8 rounded-xl bg-white/12 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition active:scale-90"
              aria-label={radioState.muted ? 'Unmute' : 'Mute'}
            >
              {radioState.muted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-[#d0f39f]" />}
            </button>
          </div>
        </div>

        {/* Station Identity & Live Equalizer Bars */}
        <div className="text-center space-y-1.5 py-1">
          <p className="font-arabic text-xl sm:text-2xl text-[#fde68a] leading-relaxed">
            {currentStation.arabicName}
          </p>
          <h2 className="font-display text-xl font-extrabold tracking-tight text-white leading-tight">
            {currentStation.name[language]}
          </h2>
          <p className="text-xs text-white/80">{currentStation.subtitle[language]}</p>

          {/* Animated Soundwave Indicator */}
          <div className="flex items-end justify-center gap-1 h-6 pt-2" aria-hidden="true">
            {[0.45, 0.85, 0.6, 1.0, 0.7, 0.9, 0.5, 0.8, 0.4].map((scale, idx) => (
              <span
                key={idx}
                className={`w-1 rounded-full transition-all duration-300 ${
                  isPlaying
                    ? 'bg-gradient-to-t from-[#d0f39f] to-[#fde68a] animate-pulse'
                    : 'bg-white/25'
                }`}
                style={{
                  height: isPlaying ? `${Math.round(scale * 22)}px` : '5px',
                  animationDelay: `${idx * 90}ms`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Transport Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => quranRadioPlayer.playRelative(-1)}
            className="w-11 h-11 rounded-2xl bg-white/14 hover:bg-white/22 border border-white/20 text-white flex items-center justify-center transition active:scale-95"
            aria-label="Previous station"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => quranRadioPlayer.togglePlayPause(currentStation.id)}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-[#d0f39f] to-[#fde68a] text-[#0c4703] shadow-lg flex items-center justify-center transition active:scale-95 hover:brightness-105"
            aria-label={isPlaying ? 'Pause live radio' : 'Play live radio'}
          >
            {isConnecting ? (
              <Loader2 className="w-7 h-7 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-7 h-7 fill-current" />
            ) : (
              <Play className="w-7 h-7 fill-current ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => quranRadioPlayer.playRelative(1)}
            className="w-11 h-11 rounded-2xl bg-white/14 hover:bg-white/22 border border-white/20 text-white flex items-center justify-center transition active:scale-95"
            aria-label="Next station"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Status Footer / Error Retry */}
        {isError ? (
          <div className="rounded-2xl bg-rose-950/60 border border-rose-400/40 px-3 py-2 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <WifiOff className="w-4 h-4 text-rose-300 shrink-0" />
              <span className="text-rose-100 leading-snug">{ui.offlineErr}</span>
            </div>
            <button
              type="button"
              onClick={() => quranRadioPlayer.playStation(currentStation.id)}
              className="px-2.5 py-1 rounded-xl bg-white text-rose-900 font-bold text-[11px] shrink-0"
            >
              {ui.retryBtn}
            </button>
          </div>
        ) : (
          <p className="text-center text-[11px] text-white/75">
            {isConnecting
              ? ui.connecting
              : isPlaying
              ? ui.backgroundNote
              : isCurrentActive && radioState.status === 'paused'
              ? ui.pausedLabel
              : ui.readyLabel}
          </p>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className={`absolute left-3.5 top-3 w-4 h-4 ${isDay ? 'text-[#158509]' : 'text-emerald-400'}`} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={ui.searchPlaceholder}
          className={`w-full border rounded-2xl pl-10 pr-4 py-2.5 text-sm focus:outline-none transition ${
            isDay
              ? 'bg-white border-[#dde3ea] text-slate-900 placeholder-slate-400 focus:border-[#158509]'
              : 'bg-slate-900 border-emerald-900/60 text-white placeholder-slate-400 focus:border-amber-400'
          }`}
        />
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
        {categories.map((cat) => {
          const active = category === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap transition shrink-0 ${
                active
                  ? isDay
                    ? 'bg-[#158509] border-[#158509] text-white nq-keep-dark shadow-xs'
                    : 'bg-amber-400 border-amber-400 text-slate-950 shadow-xs'
                  : isDay
                  ? 'bg-white border-[#dde3ea] text-slate-700 hover:border-[#158509]/50'
                  : 'bg-slate-900 border-emerald-900/60 text-slate-300 hover:border-amber-400/60'
              }`}
            >
              {cat.label}
              {cat.id === 'favorites' && favorites.length > 0 ? ` (${favorites.length})` : ''}
            </button>
          );
        })}
      </div>

      {/* Station Directory */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className={`text-[11px] font-bold uppercase tracking-wider ${isDay ? 'text-[#0c4703]/80' : 'text-emerald-400/90'}`}>
            {ui.stationsCount(filteredStations.length)}
          </span>
        </div>

        {filteredStations.length === 0 ? (
          <div className={`rounded-2xl border p-5 text-center text-xs ${cardCls} ${subText}`}>
            {ui.emptyFav}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredStations.map((st) => {
              const isSelected = st.id === currentStation.id;
              const stActive = radioState.active && radioState.stationId === st.id;
              const stPlaying = stActive && radioState.status === 'playing';
              const stConnecting = stActive && radioState.status === 'connecting';
              const isFav = favorites.includes(st.id);

              return (
                <div
                  key={st.id}
                  onClick={() => {
                    setSelectedId(st.id);
                    quranRadioPlayer.togglePlayPause(st.id);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedId(st.id);
                      quranRadioPlayer.togglePlayPause(st.id);
                    }
                  }}
                  className={`rounded-2xl border p-3 flex items-center justify-between gap-3 cursor-pointer transition active:scale-[0.99] ${
                    stPlaying || stConnecting
                      ? isDay
                        ? 'bg-[#eef9ea] border-[#158509] shadow-sm'
                        : 'bg-emerald-950/85 border-amber-400 shadow-md'
                      : isSelected
                      ? isDay
                        ? 'bg-[#f8fcf7] border-[#9cd692]'
                        : 'bg-slate-900 border-emerald-700/80'
                      : `${cardCls} ${isDay ? 'hover:border-[#158509]/45' : 'hover:border-emerald-700'}`
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition ${
                        stPlaying || stConnecting
                          ? isDay
                            ? 'bg-[#158509] text-white nq-keep-dark'
                            : 'bg-amber-400 text-slate-950'
                          : isDay
                          ? 'bg-[#eef9ea] text-[#158509]'
                          : 'bg-emerald-950 text-amber-300'
                      }`}
                    >
                      {stConnecting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : stPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Radio className="w-4 h-4" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-[13px] font-bold truncate">{st.name[language]}</span>
                        {stPlaying && (
                          <span className="px-1.5 py-0.2 rounded-md bg-rose-500 text-white text-[9px] font-extrabold uppercase shrink-0">
                            LIVE
                          </span>
                        )}
                      </div>
                      <div className={`text-[11px] truncate ${subText}`}>{st.subtitle[language]}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(st.id);
                    }}
                    className={`p-2 rounded-xl transition shrink-0 ${
                      isFav
                        ? 'text-rose-500 bg-rose-500/10'
                        : isDay
                        ? 'text-slate-400 hover:text-rose-500'
                        : 'text-slate-500 hover:text-rose-400'
                    }`}
                    aria-label="Favorite station"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
