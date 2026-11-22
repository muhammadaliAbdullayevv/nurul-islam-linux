import React, { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import {
  Sparkles,
  Search,
  Copy,
  Check,
  ChevronLeft,
  RefreshCw,
  Bookmark,
  ArrowUpRight,
  Layers,
  Share2,
} from 'lucide-react';
import {
  DuaHandsIcon,
  FortyFardIcon,
  HadithBookIcon,
  NiyatHeartIcon,
  RubElHizbIcon,
  ZikrBeadsIcon,
} from '../icons/IslamicFeatureIcons';
import { DAILY_AZKAR, getLocalizedDuaItem } from '../../data/azkar';
import {
  AYAH_REFLECTIONS,
  CURATED_DUAS,
  CompactHadithEntry,
  HadithCollectionMeta,
  NIYATLAR,
  QIRQ_FARZ,
} from '../../data/knowledgeLibrary';
import { AppLanguage, DuaItem } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { cyrillicToLatinUz, latinToCyrillicUz } from '../../utils/uzbekScript';
import { getHadithCollectionSync, loadHadithCollectionAsync } from '../../utils/hadithIdbCache';
import { loadLocalSurahRaw } from '../../utils/localQuranData';
import { copyTextSafely } from '../../utils/clipboard';
import {
  ShareCardPayload,
  generateNurulIslamShareCard,
  shareOrSavePngCard,
} from '../../utils/shareCardGenerator';

export type HubSection = 'hub' | 'duas' | 'zikr' | 'hadith' | 'ayats' | 'farz' | 'niyat' | 'saved';

interface AzkarTabProps {
  onOpenSurah?: (surahNumber: number, ayahNumber?: number) => void;
  onNavigateTab?: (tabId: string) => void;
  initialSection?: HubSection;
}

interface SavedLibraryItem {
  key: string;
  badge: string;
  text: string;
}

const SAVED_STORAGE_KEY = 'nq_saved_library_v1';
const PAGE_SIZE = 30;

function formatUzFromLatin(text: string, lang: AppLanguage): string {
  return lang === 'uz_cyr' ? latinToCyrillicUz(text) : text;
}

function formatUzFromCyr(text: string, lang: AppLanguage): string {
  return lang === 'uz_cyr' || lang === 'ru' ? text : cyrillicToLatinUz(text);
}

export const AzkarTab: React.FC<AzkarTabProps> = ({
  onOpenSurah,
  onNavigateTab,
  initialSection = 'hub',
}) => {
  const { isDay } = useTheme();
  const { language, t } = useLanguage();

  const [section, setSection] = useState<HubSection>(initialSection);

  useEffect(() => {
    setSection(initialSection);
  }, [initialSection]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [sharingKey, setSharingKey] = useState<string | null>(null);
  const [shareToast, setShareToast] = useState<string | null>(null);

  // Duas sub-filter + tasbih counter state
  const [duaFilter, setDuaFilter] = useState<'all' | 'curated' | 'morning' | 'rabbana' | 'ramadan'>('all');
  const [counterState, setCounterState] = useState<Record<string, number>>({});

  // Farz & Niyat category filters
  const [farzBolim, setFarzBolim] = useState<string>('all');
  const [niyatCat, setNiyatCat] = useState<string>('all');

  // Offline + on-demand cached Hadith / Al-Azkor collections
  const [collectionsMeta, setCollectionsMeta] = useState<HadithCollectionMeta[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<number>(24); // Arba'in 40 default
  const [collectionCache, setCollectionCache] = useState<Record<number, CompactHadithEntry[]>>({});
  const [loadingCol, setLoadingCol] = useState<boolean>(false);
  const [colLoadError, setColLoadError] = useState<number | null>(null);
  const [visibleLimit, setVisibleLimit] = useState<number>(PAGE_SIZE);
  const fetchingRef = useRef<Set<number>>(new Set());

  // Saved bookmarks
  const [savedItems, setSavedItems] = useState<SavedLibraryItem[]>(() => {
    try {
      const raw = localStorage.getItem(SAVED_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage error
    }
    return [];
  });

  const savedKeys = useMemo(() => new Set(savedItems.map((i) => i.key)), [savedItems]);

  const toggleSaved = (key: string, badge: string, text: string) => {
    setSavedItems((prev) => {
      const exists = prev.some((i) => i.key === key);
      const next = exists ? prev.filter((i) => i.key !== key) : [{ key, badge, text }, ...prev];
      try {
        localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore quota error
      }
      return next;
    });
  };

  // Load collections metadata once
  useEffect(() => {
    let active = true;
    fetch('/data/hadith/collections.json')
      .then((r) => (r.ok ? r.json() : []))
      .then((data: HadithCollectionMeta[]) => {
        if (active && Array.isArray(data)) {
          setCollectionsMeta(data);
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const ensureCollectionLoaded = async (cid: number, fileName?: string) => {
    const syncCached = collectionCache[cid] || getHadithCollectionSync(cid);
    if (syncCached) {
      if (!collectionCache[cid]) {
        setCollectionCache((prev) => ({ ...prev, [cid]: syncCached }));
      }
      setColLoadError((prev) => (prev === cid ? null : prev));
      return;
    }
    if (fetchingRef.current.has(cid)) return;
    fetchingRef.current.add(cid);
    setColLoadError((prev) => (prev === cid ? null : prev));
    setLoadingCol(true);
    try {
      const rows = await loadHadithCollectionAsync(cid, fileName);
      setCollectionCache((prev) => ({ ...prev, [cid]: rows }));
      setColLoadError((prev) => (prev === cid ? null : prev));
    } catch {
      setColLoadError(cid);
    } finally {
      fetchingRef.current.delete(cid);
      setLoadingCol(false);
    }
  };

  useEffect(() => {
    if (section === 'zikr') {
      ensureCollectionLoaded(17, 'c_17.json');
    } else if (section === 'hadith') {
      const meta = collectionsMeta.find((c) => c.id === selectedCollectionId);
      ensureCollectionLoaded(selectedCollectionId, meta?.file);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section, selectedCollectionId, collectionsMeta]);

  const handleCopy = (key: string, text: string) => {
    void copyTextSafely(text);
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(null), 1800);
  };

  const showShareToast = useCallback((msg: string) => {
    setShareToast(msg);
    window.setTimeout(() => {
      setShareToast((cur) => (cur === msg ? null : cur));
    }, 2400);
  }, []);

  const handleSharePngCard = useCallback(
    async (
      key: string,
      fileName: string,
      shareTitle: string,
      caption: string,
      payload: Omit<ShareCardPayload, 'isDay'>
    ) => {
      setSharingKey(key);
      try {
        const rendered = await generateNurulIslamShareCard({
          ...payload,
          isDay,
        });
        if (!rendered) throw new Error('Canvas unavailable');
        const savedLabel =
          language === 'ru'
            ? 'Открытка сохранена (PNG)'
            : language === 'en'
            ? 'Card saved as PNG'
            : language === 'uz_cyr'
            ? 'Карта юклаб олинди (PNG)'
            : 'Karta yuklab olindi (PNG)';
        const res = await shareOrSavePngCard({
          rendered,
          fileName,
          shareTitle,
          caption: `${caption}\nNurul Islam · nurulislam.mabdullayev.dev`,
        });
        if (res.method === 'desktop') {
          showShareToast(res.savedPath ? `${savedLabel}: ${res.savedPath}` : savedLabel);
        } else if (res.method === 'download') {
          showShareToast(savedLabel);
        }
      } catch {
        handleCopy(key, caption);
      } finally {
        setSharingKey(null);
      }
    },
    [isDay, language, showShareToast]
  );

  const handleIncrementDua = (id: string, max: number) => {
    setCounterState((prev) => {
      const curr = prev[id] || 0;
      return { ...prev, [id]: curr < max ? curr + 1 : max };
    });
  };

  const ui = {
    uz_lat: {
      hubSubtitle: 'Duolar, Zikrlar, 8 253 Hadis, 45 Oyat, 40 Farz va Niyatlar',
      dailyTitle: 'Kunlik Hikmat',
      openInQuran: 'Qur‘onda ochish',
      openTasbih: 'Tasbehda sanash',
      allSections: 'Bo‘limlar',
      searchPlaceholder: 'Kalit so‘z bo‘yicha qidirish...',
      clear: 'Tozalash',
      loadMore: 'Yana yuklash (+30)',
      loadingCol: 'Yuklanmoqda...',
      savedTitle: 'Saqlanganlar',
      noSaved: 'Hozircha saqlangan hadis yoki zikrlar yo‘q.',
      allFilter: 'Barchasi',
      cards: {
        duas: { title: 'Duolar', desc: 'Kundalik, tonggi-kechki va Ramazon duolari', badge: `${DAILY_AZKAR.length + CURATED_DUAS.length}` },
        zikr: { title: 'Zikrlar', desc: 'Imom Navaviy Al-Azkor to‘plami', badge: '303' },
        hadith: { title: 'Hadislar', desc: '10 ta mo‘tabar hadis kitoblari', badge: '8.2K' },
        ayats: { title: 'Oyatlar', desc: '45 ta tanlangan Qur‘on oyatlari', badge: '45' },
        farz: { title: '40 Farz', desc: 'Imon, Islom, Tahorat va Namoz farzlari', badge: '40' },
        niyat: { title: 'Niyatlar', desc: 'Namoz, Ro‘za va ibodat niyatlari', badge: '19' },
      },
      duaFilters: {
        all: 'Barchasi',
        curated: 'Kundalik (22)',
        morning: 'Tong/Kech',
        rabbana: 'Rabbana',
        ramadan: 'Ramazon',
      },
    },
    uz_cyr: {
      hubSubtitle: 'Дуолар, Зикрлар, 8 253 Ҳадис, 45 Оят, 40 Фарз ва Ниятлар',
      dailyTitle: 'Кунлик Ҳикмат',
      openInQuran: 'Қуръонда очиш',
      openTasbih: 'Тасбеҳда санаш',
      allSections: 'Бўлимлар',
      searchPlaceholder: 'Калит сўз бўйича қидириш...',
      clear: 'Тозалаш',
      loadMore: 'Яна юклаш (+30)',
      loadingCol: 'Юкланмоқда...',
      savedTitle: 'Сақланганлар',
      noSaved: 'Ҳозирча сақланган ҳадис ёки зикрлар йўқ.',
      allFilter: 'Барчаси',
      cards: {
        duas: { title: 'Дуолар', desc: 'Кундалик, тонгги-кечки ва Рамазон дуолари', badge: `${DAILY_AZKAR.length + CURATED_DUAS.length}` },
        zikr: { title: 'Зикрлар', desc: 'Имом Нававий Ал-Азкор тўплами', badge: '303' },
        hadith: { title: 'Ҳадислар', desc: '10 та мўътабар ҳадис китоблари', badge: '8.2K' },
        ayats: { title: 'Оятлар', desc: '45 та танланган Қуръон оятлари', badge: '45' },
        farz: { title: '40 Фарз', desc: 'Имон, Ислом, Таҳорат ва Намоз фарзлари', badge: '40' },
        niyat: { title: 'Ниятлар', desc: 'Намоз, Рўза ва ибодат ниятлари', badge: '19' },
      },
      duaFilters: {
        all: 'Барчаси',
        curated: 'Кундалик (22)',
        morning: 'Тонг/Кеч',
        rabbana: 'Раббана',
        ramadan: 'Рамазон',
      },
    },
    en: {
      hubSubtitle: 'Duas, Azkar, 8,253 Hadiths, 45 Ayahs, 40 Fards & Niyats',
      dailyTitle: 'Daily Ayah Reflection',
      openInQuran: 'Open in Quran',
      openTasbih: 'Count in Tasbih',
      allSections: 'All Sections',
      searchPlaceholder: 'Search text or reference...',
      clear: 'Clear',
      loadMore: 'Load more (+30)',
      loadingCol: 'Loading...',
      savedTitle: 'Saved',
      noSaved: 'No bookmarked items yet. Tap the bookmark icon on any card.',
      allFilter: 'All',
      cards: {
        duas: { title: 'Duas', desc: 'Daily, morning/evening & Ramadan duas', badge: `${DAILY_AZKAR.length + CURATED_DUAS.length}` },
        zikr: { title: 'Azkar', desc: 'Imam Nawawi Al-Azkor collection', badge: '303' },
        hadith: { title: 'Hadith', desc: '10 authentic collections (Uzbek)', badge: '8.2K' },
        ayats: { title: 'Ayahs', desc: '45 selected Quran verses with links', badge: '45' },
        farz: { title: '40 Fards', desc: 'Essential pillars of Faith, Wudu & Prayer', badge: '40' },
        niyat: { title: 'Intentions', desc: 'Prayer, Fasting & Worship Niyats', badge: '19' },
      },
      duaFilters: {
        all: 'All',
        curated: 'Daily (22)',
        morning: 'Morning',
        rabbana: 'Rabbana',
        ramadan: 'Ramadan',
      },
    },
    ru: {
      hubSubtitle: 'Дуа, Зикры, 8 253 Хадиса, 45 Аятов, 40 Фардов и Намерения',
      dailyTitle: 'Аят дня',
      openInQuran: 'Открыть в Коране',
      openTasbih: 'Считать в Тасбихе',
      allSections: 'Разделы',
      searchPlaceholder: 'Поиск по тексту и источнику...',
      clear: 'Сброс',
      loadMore: 'Показать ещё (+30)',
      loadingCol: 'Загрузка...',
      savedTitle: 'Сохранённые',
      noSaved: 'Нет сохранённых записей. Нажмите закладку на любой карточке.',
      allFilter: 'Все',
      cards: {
        duas: { title: 'Дуа', desc: 'Ежедневные, утренние и рамадан дуа', badge: `${DAILY_AZKAR.length + CURATED_DUAS.length}` },
        zikr: { title: 'Зикры', desc: 'Сборник Аль-Азкар имама Навави', badge: '303' },
        hadith: { title: 'Хадисы', desc: '10 достоверных сборников', badge: '8.2K' },
        ayats: { title: 'Аяты', desc: '45 избранных аятов со ссылкой в Коран', badge: '45' },
        farz: { title: '40 Фардов', desc: 'Столпы веры, тахарата и намаза', badge: '40' },
        niyat: { title: 'Намерения', desc: 'Нияты для намаза, поста и поклонения', badge: '19' },
      },
      duaFilters: {
        all: 'Все',
        curated: 'Повседневные',
        morning: 'Утро/Вечер',
        rabbana: 'Раббана',
        ramadan: 'Рамадан',
      },
    },
  }[language];

  const cardCls = isDay
    ? 'bg-white border border-[#dde3ea] rounded-2xl shadow-xs'
    : 'bg-slate-900/90 border border-emerald-900/50 rounded-2xl';

  const hadithCollections = useMemo(
    () => collectionsMeta.filter((c) => c.type === 'hadith'),
    [collectionsMeta]
  );

  const farzCategories = useMemo(
    () => Array.from(new Set(QIRQ_FARZ.map((f) => f.bolim))),
    []
  );
  const niyatCategories = useMemo(
    () => Array.from(new Set(NIYATLAR.map((n) => n.category))),
    []
  );

  const switchSection = (next: HubSection) => {
    setSection(next);
    setSearchQuery('');
    setVisibleLimit(PAGE_SIZE);
  };

  const deferredSearchQuery = useDeferredValue(searchQuery);
  const normalizedQuery = deferredSearchQuery.trim().toLowerCase();

  // Filtered Hadith / Al-Azkor list (convert query once instead of converting 6MB Cyrillic per keystroke)
  const activeCollectionEntries = useMemo(() => {
    const cid = section === 'zikr' ? 17 : selectedCollectionId;
    const rows = collectionCache[cid] || [];
    if (!normalizedQuery) return rows;
    const cyrQuery = latinToCyrillicUz(normalizedQuery).toLowerCase();
    return rows.filter((row) => {
      const rawLower = row.t.toLowerCase();
      return rawLower.includes(normalizedQuery) || (cyrQuery.length > 0 && rawLower.includes(cyrQuery));
    });
  }, [section, selectedCollectionId, collectionCache, normalizedQuery]);

  const hubTiles: Array<{
    id: HubSection;
    title: string;
    desc: string;
    badge: string;
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  }> = [
    { id: 'duas', ...ui.cards.duas, icon: DuaHandsIcon },
    { id: 'zikr', ...ui.cards.zikr, icon: ZikrBeadsIcon },
    { id: 'hadith', ...ui.cards.hadith, icon: HadithBookIcon },
    { id: 'ayats', ...ui.cards.ayats, icon: RubElHizbIcon },
    { id: 'farz', ...ui.cards.farz, icon: FortyFardIcon },
    { id: 'niyat', ...ui.cards.niyat, icon: NiyatHeartIcon },
  ];

  return (
    <div className="space-y-3 pb-6">
      {/* Sticky Section Bar When Inside a Category */}
      {section !== 'hub' && (
        <div
          className={`sticky -top-2.5 z-20 -mx-3.5 px-3.5 pt-2.5 pb-2 border-b space-y-2 ${
            isDay
              ? 'bg-[#ecf1f5] border-[#d5dde6]'
              : 'bg-slate-950 border-emerald-950/90'
          }`}
        >
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => (onNavigateTab ? onNavigateTab('home') : switchSection('hub'))}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 shrink-0 border transition ${
                isDay
                  ? 'bg-[#0c4703] border-[#0c4703] text-white nq-keep-dark'
                  : 'bg-emerald-800 border-emerald-700 text-white'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>{ui.allSections}</span>
            </button>

            {hubTiles.map((tile) => (
              <button
                key={tile.id}
                type="button"
                onClick={() => switchSection(tile.id)}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold shrink-0 border transition ${
                  section === tile.id
                    ? isDay
                      ? 'bg-[#158509] border-[#158509] text-white nq-keep-dark'
                      : 'bg-amber-500 border-amber-400 text-slate-950'
                    : isDay
                    ? 'bg-white border-[#dde3ea] text-slate-700'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                {tile.title}
              </button>
            ))}

            <button
              type="button"
              onClick={() => switchSection('saved')}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold shrink-0 border flex items-center gap-1 transition ${
                section === 'saved'
                  ? isDay
                    ? 'bg-[#158509] border-[#158509] text-white nq-keep-dark'
                    : 'bg-amber-500 border-amber-400 text-slate-950'
                  : isDay
                  ? 'bg-white border-[#dde3ea] text-slate-700'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <Bookmark className="w-3 h-3" />
              <span>
                {ui.savedTitle} ({savedItems.length})
              </span>
            </button>
          </div>

          {section !== 'saved' && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleLimit(PAGE_SIZE);
                }}
                placeholder={ui.searchPlaceholder}
                className={`w-full pl-8 pr-16 py-2 rounded-xl text-xs border outline-none ${
                  isDay
                    ? 'bg-white border-[#dde3ea] text-slate-800'
                    : 'bg-slate-900 border-slate-800 text-slate-100'
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    isDay ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {ui.clear}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* HUB OVERVIEW VIEW */}
      {section === 'hub' && (
        <>
          <p className={`text-xs font-medium px-1 ${isDay ? 'text-slate-600' : 'text-slate-400'}`}>
            {ui.hubSubtitle}
          </p>

          {/* 6 Feature Category Buttons (2x3 Grid) */}
          <div className="grid grid-cols-2 gap-2.5">
            {hubTiles.map((tile) => {
              const IconComp = tile.icon;
              return (
                <button
                  key={tile.id}
                  type="button"
                  onClick={() => switchSection(tile.id)}
                  className={`${cardCls} p-3.5 text-left relative active:scale-[0.98] transition group ${
                    isDay ? 'hover:border-[#158509]/50' : 'hover:border-amber-400/60'
                  }`}
                >
                  <span
                    className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isDay
                        ? 'bg-[#eef9ea] text-[#0c4703] border border-[#c5e8bc]'
                        : 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                    }`}
                  >
                    {tile.badge}
                  </span>

                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 transition group-hover:scale-105 ${
                      isDay
                        ? 'bg-[#f1ffea] text-[#158509] border border-[#d7f0cb]'
                        : 'bg-emerald-950 text-amber-400 border border-emerald-800/60'
                    }`}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>

                  <h3 className={`text-sm font-bold ${isDay ? 'text-slate-900' : 'text-white'}`}>
                    {tile.title}
                  </h3>
                  <p className={`text-[11px] leading-snug mt-0.5 ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                    {tile.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Saved Shortcut Bar */}
          {savedItems.length > 0 && (
            <button
              type="button"
              onClick={() => switchSection('saved')}
              className={`${cardCls} w-full p-3.5 flex items-center justify-between transition`}
            >
              <div className="flex items-center gap-2.5">
                <Bookmark className={`w-4 h-4 ${isDay ? 'text-[#158509]' : 'text-amber-400'}`} />
                <span className={`text-xs font-bold ${isDay ? 'text-slate-800' : 'text-slate-100'}`}>
                  {ui.savedTitle}
                </span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  isDay ? 'bg-[#eef9ea] text-[#0c4703]' : 'bg-emerald-950 text-amber-300'
                }`}
              >
                {savedItems.length}
              </span>
            </button>
          )}
        </>
      )}

      {/* SECTION 1: DUAS (Hisnul Muslim + 27 Curated & Ramadan Duas) */}
      {section === 'duas' && (
        <>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(['all', 'curated', 'morning', 'rabbana', 'ramadan'] as const).map((fKey) => (
              <button
                key={fKey}
                type="button"
                onClick={() => setDuaFilter(fKey)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold shrink-0 border transition ${
                  duaFilter === fKey
                    ? isDay
                      ? 'bg-[#0c4703] border-[#0c4703] text-white nq-keep-dark'
                      : 'bg-amber-500 border-amber-400 text-slate-950'
                    : isDay
                    ? 'bg-white border-[#dde3ea] text-slate-700'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                {ui.duaFilters[fKey]}
              </button>
            ))}
          </div>

          {/* Existing Morning & Rabbana Azkar with Built-in Tap Counters */}
          {(duaFilter === 'all' || duaFilter === 'morning' || duaFilter === 'rabbana') &&
            DAILY_AZKAR.filter((item) => {
              if (duaFilter !== 'all' && item.category !== duaFilter) return false;
              if (!normalizedQuery) return true;
              const loc = getLocalizedDuaItem(item, language);
              return (
                loc.title.toLowerCase().includes(normalizedQuery) ||
                loc.translation.toLowerCase().includes(normalizedQuery) ||
                item.transliteration.toLowerCase().includes(normalizedQuery) ||
                item.arabic.includes(searchQuery)
              );
            }).map((dua: DuaItem) => {
              const loc = getLocalizedDuaItem(dua, language);
              const count = counterState[dua.id] || 0;
              const target = dua.repeatCount || 1;
              const done = count >= target;
              const copyText = `${loc.title}\n\n${dua.arabic}\n\n${dua.transliteration}\n\n"${loc.translation}"\n— ${dua.reference}`;

              return (
                <div
                  key={dua.id}
                  className={`${cardCls} p-4 ${done ? (isDay ? 'border-[#7ecb6f]' : 'border-emerald-600/70') : ''}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className={`text-sm font-bold ${isDay ? 'text-slate-900' : 'text-white'}`}>
                        {loc.title}
                      </h3>
                      <span className={`text-[10.5px] font-medium ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                        {dua.reference}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={sharingKey === `dua_${dua.id}`}
                        onClick={() =>
                          void handleSharePngCard(
                            `dua_${dua.id}`,
                            `nurul-islam-dua-${dua.id}.png`,
                            loc.title,
                            copyText,
                            {
                              eyebrow: `${ui.cards.duas.title} · ${dua.reference}`,
                              metaPill: dua.reference,
                              title: loc.title,
                              featuredText: dua.arabic,
                              featuredIsArabic: true,
                              transliteration: dua.transliteration,
                              bodyText: `«${loc.translation}»`,
                              footerSectionTitle: ui.cards.duas.title,
                            }
                          )
                        }
                        aria-label="Share Dua Card"
                        className={`p-1.5 rounded-lg disabled:opacity-50 ${
                          isDay
                            ? 'text-[#0c4703] hover:bg-[#eef9ea]'
                            : 'text-amber-300 hover:bg-slate-800'
                        }`}
                      >
                        <Share2
                          className={`w-3.5 h-3.5 ${
                            sharingKey === `dua_${dua.id}` ? 'animate-pulse' : ''
                          }`}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleSaved(`dua_${dua.id}`, loc.title, copyText)}
                        className={`p-1.5 rounded-lg ${
                          savedKeys.has(`dua_${dua.id}`)
                            ? isDay
                              ? 'text-[#158509] bg-[#eef9ea]'
                              : 'text-amber-400 bg-amber-400/10'
                            : isDay
                            ? 'text-slate-400 hover:bg-slate-100'
                            : 'text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(dua.id, copyText)}
                        className={`p-1.5 rounded-lg ${isDay ? 'text-slate-400 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800'}`}
                      >
                        {copiedKey === dua.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <p
                    dir="rtl"
                    className={`font-arabic text-xl text-right leading-[2.1] my-2 ${
                      isDay ? 'text-[#0c4703]' : 'text-amber-300'
                    }`}
                  >
                    {dua.arabic}
                  </p>
                  <p className={`text-xs italic mb-1.5 ${isDay ? 'text-slate-700' : 'text-emerald-200/90'}`}>
                    {dua.transliteration}
                  </p>
                  <p className={`text-xs leading-relaxed mb-3 ${isDay ? 'text-slate-600' : 'text-slate-300'}`}>
                    "{loc.translation}"
                  </p>

                  {target > 1 && (
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/70 dark:border-slate-800">
                      <span className={`text-[11px] font-bold ${done ? 'text-emerald-500' : isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                        {done ? '✓' : `${t.azkar.repeatLabel} ${target}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleIncrementDua(dua.id, target)}
                        className={`px-3 py-1 rounded-full text-xs font-bold tabular-nums transition ${
                          done
                            ? isDay
                              ? 'bg-[#158509] text-white nq-keep-dark'
                              : 'bg-emerald-600 text-white'
                            : isDay
                            ? 'bg-[#eef9ea] text-[#0c4703] border border-[#c5e8bc]'
                            : 'bg-slate-800 text-amber-300'
                        }`}
                      >
                        {count} / {target}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

          {/* 27 Curated Everyday & Ramadan Duas from Telegram Bot Data */}
          {(duaFilter === 'all' || duaFilter === 'curated' || duaFilter === 'ramadan') &&
            CURATED_DUAS.filter((d) => {
              if (duaFilter === 'curated' && d.group !== 'daily') return false;
              if (duaFilter === 'ramadan' && d.group !== 'ramadan') return false;
              if (!normalizedQuery) return true;
              const occ = formatUzFromLatin(d.occasion, language).toLowerCase();
              const uz = formatUzFromLatin(d.uz, language).toLowerCase();
              return (
                occ.includes(normalizedQuery) ||
                uz.includes(normalizedQuery) ||
                d.translit.toLowerCase().includes(normalizedQuery)
              );
            }).map((d) => {
              const occasion = formatUzFromLatin(d.occasion, language);
              const uzText = formatUzFromLatin(d.uz, language);
              const translit = formatUzFromLatin(d.translit, language);
              const ref = formatUzFromLatin(d.reference, language);
              const copyText = [occasion, d.arabic, translit, uzText, ref].filter(Boolean).join('\n\n');

              return (
                <div key={d.id} className={`${cardCls} p-4`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mb-1 ${
                          d.group === 'ramadan'
                            ? 'bg-amber-500/15 text-amber-500'
                            : isDay
                            ? 'bg-[#eef9ea] text-[#0c4703]'
                            : 'bg-emerald-950 text-emerald-300'
                        }`}
                      >
                        {ref}
                      </span>
                      <h3 className={`text-sm font-bold ${isDay ? 'text-slate-900' : 'text-white'}`}>
                        {occasion}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={sharingKey === d.id}
                        onClick={() =>
                          void handleSharePngCard(
                            d.id,
                            `nurul-islam-dua-${d.id}.png`,
                            occasion,
                            copyText,
                            {
                              eyebrow: `${ui.cards.duas.title} · ${ref}`,
                              metaPill: ref,
                              title: occasion,
                              featuredText: d.arabic || undefined,
                              featuredIsArabic: Boolean(d.arabic),
                              transliteration: d.arabic ? translit : undefined,
                              bodyText: d.arabic ? uzText : `${translit}\n\n${uzText}`,
                              footerSectionTitle: ui.cards.duas.title,
                            }
                          )
                        }
                        aria-label="Share Dua Card"
                        className={`p-1.5 rounded-lg disabled:opacity-50 ${
                          isDay
                            ? 'text-[#0c4703] hover:bg-[#eef9ea]'
                            : 'text-amber-300 hover:bg-slate-800'
                        }`}
                      >
                        <Share2
                          className={`w-3.5 h-3.5 ${sharingKey === d.id ? 'animate-pulse' : ''}`}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleSaved(d.id, occasion, copyText)}
                        className={`p-1.5 rounded-lg ${
                          savedKeys.has(d.id)
                            ? isDay
                              ? 'text-[#158509] bg-[#eef9ea]'
                              : 'text-amber-400 bg-amber-400/10'
                            : isDay
                            ? 'text-slate-400 hover:bg-slate-100'
                            : 'text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(d.id, copyText)}
                        className={`p-1.5 rounded-lg ${isDay ? 'text-slate-400 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800'}`}
                      >
                        {copiedKey === d.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {d.arabic && (
                    <p
                      dir="rtl"
                      className={`font-arabic text-xl text-right leading-[2.1] my-2 ${
                        isDay ? 'text-[#0c4703]' : 'text-amber-300'
                      }`}
                    >
                      {d.arabic}
                    </p>
                  )}
                  <p className={`text-xs font-semibold italic mb-1 ${isDay ? 'text-slate-800' : 'text-emerald-200'}`}>
                    {translit}
                  </p>
                  <p className={`text-xs leading-relaxed ${isDay ? 'text-slate-600' : 'text-slate-300'}`}>
                    {uzText}
                  </p>
                </div>
              );
            })}
        </>
      )}

      {/* SECTION 2: ZIKRLAR (Al-Azkor 303 + Tasbih Shortcut) */}
      {(section === 'zikr' || section === 'hadith') && (
        <>
          {section === 'zikr' && onNavigateTab && (
            <button
              type="button"
              onClick={() => onNavigateTab('tasbih')}
              className={`w-full py-2.5 px-4 rounded-2xl text-xs font-bold flex items-center justify-between transition ${
                isDay
                  ? 'bg-[#158509] text-white nq-keep-dark shadow-xs'
                  : 'bg-amber-500 text-slate-950'
              }`}
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>{ui.openTasbih}</span>
              </span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}

          {section === 'hadith' && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
              {hadithCollections.map((col) => {
                const colTitle = formatUzFromCyr(col.name_cyr, language);
                const active = col.id === selectedCollectionId;
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => {
                      setSelectedCollectionId(col.id);
                      setVisibleLimit(PAGE_SIZE);
                    }}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold shrink-0 border transition ${
                      active
                        ? isDay
                          ? 'bg-[#0c4703] border-[#0c4703] text-white nq-keep-dark'
                          : 'bg-amber-500 border-amber-400 text-slate-950'
                        : isDay
                        ? 'bg-white border-[#dde3ea] text-slate-700'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    {colTitle} ({col.count})
                  </button>
                );
              })}
            </div>
          )}

          {loadingCol && activeCollectionEntries.length === 0 && (
            <div className={`${cardCls} p-8 text-center`}>
              <RefreshCw className={`w-6 h-6 mx-auto mb-2 animate-spin ${isDay ? 'text-[#158509]' : 'text-amber-400'}`} />
              <p className={`text-xs ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>{ui.loadingCol}</p>
            </div>
          )}

          {!loadingCol &&
            colLoadError === (section === 'zikr' ? 17 : selectedCollectionId) &&
            activeCollectionEntries.length === 0 && (
              <div className={`${cardCls} p-6 text-center space-y-2.5`}>
                <p className={`text-xs font-medium ${isDay ? 'text-slate-600' : 'text-slate-300'}`}>
                  {language === 'ru'
                    ? 'Для первой загрузки сборника требуется интернет (после загрузки он сохранится офлайн).'
                    : language === 'en'
                    ? 'Internet is needed to download this collection once (it stays cached offline afterward).'
                    : language === 'uz_cyr'
                    ? 'Ушбу тўпламни илк бор юклаш учун интернет керак (кейин офлайн ишлайди).'
                    : "Ushbu to'plamni ilk bor yuklash uchun internet kerak (keyin oflayn ishlaydi)."}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const cid = section === 'zikr' ? 17 : selectedCollectionId;
                    const meta = collectionsMeta.find((c) => c.id === cid);
                    void ensureCollectionLoaded(cid, meta?.file);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    isDay
                      ? 'bg-[#158509] text-white nq-keep-dark'
                      : 'bg-amber-400 text-slate-950'
                  }`}
                >
                  {language === 'ru'
                    ? 'Повторить'
                    : language === 'en'
                    ? 'Retry'
                    : language === 'uz_cyr'
                    ? 'Қайта уриниш'
                    : 'Qayta urinish'}
                </button>
              </div>
            )}

          {activeCollectionEntries.slice(0, visibleLimit).map((row, idx) => {
            const cid = section === 'zikr' ? 17 : selectedCollectionId;
            const colMeta = collectionsMeta.find((c) => c.id === cid);
            const colLabel = colMeta ? formatUzFromCyr(colMeta.name_cyr, language) : section === 'zikr' ? 'Al-Azkor' : 'Hadis';
            const displayBody = formatUzFromCyr(row.t, language);
            const itemKey = `had_${cid}_${row.n}_${idx}`;

            return (
              <div key={itemKey} className={`${cardCls} nq-list-item p-4`}>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isDay
                        ? 'bg-[#eef9ea] text-[#0c4703] border border-[#c5e8bc]'
                        : 'bg-emerald-950 text-amber-300 border border-emerald-800/60'
                    }`}
                  >
                    {colLabel} #{row.n || idx + 1}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={sharingKey === itemKey}
                      onClick={() => {
                        const secTitle = section === 'zikr' ? ui.cards.zikr.title : ui.cards.hadith.title;
                        const numLabel = `#${row.n || idx + 1}`;
                        void handleSharePngCard(
                          itemKey,
                          `nurul-islam-${section}-${cid}-${row.n || idx + 1}.png`,
                          `${colLabel} ${numLabel}`,
                          `${colLabel} ${numLabel}\n\n${displayBody}`,
                          {
                            eyebrow: `${secTitle} · ${colLabel}`,
                            metaPill: `${colLabel}  •  ${numLabel}`,
                            title: colLabel,
                            subtitle:
                              section === 'zikr'
                                ? ui.cards.zikr.desc
                                : language === 'ru'
                                ? 'Достоверный хадис'
                                : language === 'en'
                                ? 'Authentic Prophetic Tradition'
                                : language === 'uz_cyr'
                                ? 'Ҳадиси шариф'
                                : 'Hadisi sharif',
                            bodyText: displayBody,
                            footerSectionTitle: secTitle,
                          }
                        );
                      }}
                      aria-label="Share Card"
                      className={`p-1.5 rounded-lg disabled:opacity-50 ${
                        isDay
                          ? 'text-[#0c4703] hover:bg-[#eef9ea]'
                          : 'text-amber-300 hover:bg-slate-800'
                      }`}
                    >
                      <Share2
                        className={`w-3.5 h-3.5 ${sharingKey === itemKey ? 'animate-pulse' : ''}`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSaved(itemKey, `${colLabel} #${row.n}`, displayBody)}
                      className={`p-1.5 rounded-lg ${
                        savedKeys.has(itemKey)
                          ? isDay
                            ? 'text-[#158509] bg-[#eef9ea]'
                            : 'text-amber-400 bg-amber-400/10'
                          : isDay
                          ? 'text-slate-400 hover:bg-slate-100'
                          : 'text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(itemKey, `${colLabel} #${row.n}\n\n${displayBody}`)}
                      className={`p-1.5 rounded-lg ${isDay ? 'text-slate-400 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                      {copiedKey === itemKey ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <p className={`text-xs leading-relaxed whitespace-pre-line ${isDay ? 'text-slate-700' : 'text-slate-200'}`}>
                  {displayBody}
                </p>
              </div>
            );
          })}

          {activeCollectionEntries.length > visibleLimit && (
            <button
              type="button"
              onClick={() => setVisibleLimit((v) => v + PAGE_SIZE)}
              className={`w-full py-2.5 rounded-2xl text-xs font-bold border transition ${
                isDay
                  ? 'bg-white border-[#dde3ea] text-[#0c4703] hover:bg-[#eef9ea]'
                  : 'bg-slate-900 border-emerald-800/60 text-amber-300'
              }`}
            >
              {ui.loadMore} ({visibleLimit} / {activeCollectionEntries.length})
            </button>
          )}
        </>
      )}

      {/* SECTION 4: TANLANGAN OYATLAR (45 Ayahs with Open-in-Quran Link) */}
      {section === 'ayats' &&
        AYAH_REFLECTIONS.filter((a) => {
          if (!normalizedQuery) return true;
          const txt = formatUzFromLatin(a.text_uz, language).toLowerCase();
          const ref = formatUzFromLatin(a.reference, language).toLowerCase();
          return txt.includes(normalizedQuery) || ref.includes(normalizedQuery);
        }).map((ayah) => {
          const textDisplay = formatUzFromLatin(ayah.text_uz, language);
          const refDisplay = formatUzFromLatin(ayah.reference, language);
          const itemKey = `ayah_${ayah.id}`;

          return (
            <div key={ayah.id} className={`${cardCls} p-4`}>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                    isDay
                      ? 'bg-[#eef9ea] text-[#0c4703] border border-[#c5e8bc]'
                      : 'bg-emerald-950 text-amber-300 border border-emerald-800/60'
                  }`}
                >
                  {refDisplay}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={sharingKey === itemKey}
                    onClick={() => {
                      void (async () => {
                        let arabicVerse: string | undefined;
                        if (ayah.surahNumber && ayah.ayahNumber) {
                          const rawSurah = await loadLocalSurahRaw(ayah.surahNumber);
                          const row = rawSurah?.a?.[ayah.ayahNumber - 1];
                          if (row && row[1]) arabicVerse = row[1];
                        }
                        const quranTitle =
                          language === 'ru'
                            ? 'Священный Коран'
                            : language === 'en'
                            ? 'The Holy Quran'
                            : language === 'uz_cyr'
                            ? 'Қуръони Карим'
                            : "Qur'oni Karim";
                        await handleSharePngCard(
                          itemKey,
                          `nurul-islam-ayah-${ayah.surahNumber || ayah.id}-${ayah.ayahNumber || 1}.png`,
                          refDisplay,
                          `${arabicVerse ? `${arabicVerse}\n\n` : ''}«${textDisplay}»\n— ${refDisplay}`,
                          {
                            eyebrow: `${quranTitle} · ${ui.cards.ayats.title}`,
                            metaPill:
                              ayah.surahNumber && ayah.ayahNumber
                                ? `${refDisplay}  •  ${ayah.surahNumber}:${ayah.ayahNumber}`
                                : refDisplay,
                            title: refDisplay,
                            featuredText: arabicVerse,
                            featuredIsArabic: Boolean(arabicVerse),
                            bodyText: `«${textDisplay}»`,
                            footerSectionTitle: quranTitle,
                          }
                        );
                      })();
                    }}
                    aria-label="Share Ayah Card"
                    className={`p-1.5 rounded-lg disabled:opacity-50 ${
                      isDay
                        ? 'text-[#0c4703] hover:bg-[#eef9ea]'
                        : 'text-amber-300 hover:bg-slate-800'
                    }`}
                  >
                    <Share2
                      className={`w-3.5 h-3.5 ${sharingKey === itemKey ? 'animate-pulse' : ''}`}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleSaved(itemKey, refDisplay, textDisplay)}
                    className={`p-1.5 rounded-lg ${
                      savedKeys.has(itemKey)
                        ? isDay
                          ? 'text-[#158509] bg-[#eef9ea]'
                          : 'text-amber-400 bg-amber-400/10'
                        : isDay
                        ? 'text-slate-400 hover:bg-slate-100'
                        : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(itemKey, `«${textDisplay}»\n— ${refDisplay}`)}
                    className={`p-1.5 rounded-lg ${isDay ? 'text-slate-400 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800'}`}
                  >
                    {copiedKey === itemKey ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <p className={`text-xs leading-relaxed ${isDay ? 'text-slate-700' : 'text-slate-200'}`}>
                «{textDisplay}»
              </p>

              {onOpenSurah && ayah.surahNumber && ayah.ayahNumber && (
                <button
                  type="button"
                  onClick={() => onOpenSurah(ayah.surahNumber!, ayah.ayahNumber!)}
                  className={`mt-3 px-3 py-1.5 rounded-xl text-[11px] font-bold inline-flex items-center gap-1 transition ${
                    isDay
                      ? 'bg-[#eef9ea] hover:bg-[#ddf3d6] text-[#0c4703] border border-[#c5e8bc]'
                      : 'bg-emerald-950 text-amber-300 border border-emerald-800/60'
                  }`}
                >
                  <span>{ui.openInQuran}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}

      {/* SECTION 5: 40 FARZ */}
      {section === 'farz' && (
        <>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setFarzBolim('all')}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold shrink-0 border transition ${
                farzBolim === 'all'
                  ? isDay
                    ? 'bg-[#0c4703] border-[#0c4703] text-white nq-keep-dark'
                    : 'bg-amber-500 border-amber-400 text-slate-950'
                  : isDay
                  ? 'bg-white border-[#dde3ea] text-slate-700'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              {ui.allFilter} (40)
            </button>
            {farzCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFarzBolim(cat)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold shrink-0 border transition ${
                  farzBolim === cat
                    ? isDay
                      ? 'bg-[#0c4703] border-[#0c4703] text-white nq-keep-dark'
                      : 'bg-amber-500 border-amber-400 text-slate-950'
                    : isDay
                    ? 'bg-white border-[#dde3ea] text-slate-700'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                {formatUzFromLatin(cat, language)}
              </button>
            ))}
          </div>

          {QIRQ_FARZ.filter((f) => {
            if (farzBolim !== 'all' && f.bolim !== farzBolim) return false;
            if (!normalizedQuery) return true;
            const tStr = formatUzFromLatin(`${f.title} ${f.izoh} ${f.bolim}`, language).toLowerCase();
            return tStr.includes(normalizedQuery);
          }).map((f) => (
            <div key={f.id} className={`${cardCls} p-3.5 flex items-start gap-3`}>
              <span
                className={`w-7 h-7 rounded-xl text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5 ${
                  isDay ? 'bg-[#158509] text-white nq-keep-dark' : 'bg-amber-500 text-slate-950'
                }`}
              >
                {f.id}
              </span>
              <div className="min-w-0 flex-1">
                <span className={`text-[10px] font-bold block ${isDay ? 'text-[#158509]' : 'text-amber-400'}`}>
                  {formatUzFromLatin(f.bolim, language)}
                </span>
                <h3 className={`text-sm font-bold ${isDay ? 'text-slate-900' : 'text-white'}`}>
                  {formatUzFromLatin(f.title, language)}
                </h3>
                <p className={`text-xs leading-relaxed mt-1 ${isDay ? 'text-slate-600' : 'text-slate-300'}`}>
                  {formatUzFromLatin(f.izoh, language)}
                </p>
              </div>
            </div>
          ))}
        </>
      )}

      {/* SECTION 6: NIYATLAR */}
      {section === 'niyat' && (
        <>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setNiyatCat('all')}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold shrink-0 border transition ${
                niyatCat === 'all'
                  ? isDay
                    ? 'bg-[#0c4703] border-[#0c4703] text-white nq-keep-dark'
                    : 'bg-amber-500 border-amber-400 text-slate-950'
                  : isDay
                  ? 'bg-white border-[#dde3ea] text-slate-700'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              {ui.allFilter} (19)
            </button>
            {niyatCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setNiyatCat(cat)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold shrink-0 border transition ${
                  niyatCat === cat
                    ? isDay
                      ? 'bg-[#0c4703] border-[#0c4703] text-white nq-keep-dark'
                      : 'bg-amber-500 border-amber-400 text-slate-950'
                    : isDay
                    ? 'bg-white border-[#dde3ea] text-slate-700'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                {formatUzFromLatin(cat, language)}
              </button>
            ))}
          </div>

          {NIYATLAR.filter((n) => {
            if (niyatCat !== 'all' && n.category !== niyatCat) return false;
            if (!normalizedQuery) return true;
            return formatUzFromLatin(`${n.title} ${n.uz} ${n.category}`, language)
              .toLowerCase()
              .includes(normalizedQuery);
          }).map((n) => {
            const title = formatUzFromLatin(n.title, language);
            const uzText = formatUzFromLatin(n.uz, language);
            const catLabel = formatUzFromLatin(n.category, language);
            return (
              <div key={n.id} className={`${cardCls} p-4`}>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold mb-0.5 ${
                        isDay ? 'text-[#158509]' : 'text-amber-400'
                      }`}
                    >
                      <Layers className="w-3 h-3" />
                      <span>{catLabel}</span>
                    </span>
                    <h3 className={`text-sm font-bold ${isDay ? 'text-slate-900' : 'text-white'}`}>
                      {title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(`niy_${n.id}`, `${title}\n\n${uzText}${n.arabic ? `\n\n${n.arabic}` : ''}`)}
                    className={`p-1.5 rounded-lg ${isDay ? 'text-slate-400 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800'}`}
                  >
                    {copiedKey === `niy_${n.id}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <p className={`text-xs leading-relaxed ${isDay ? 'text-slate-600' : 'text-slate-300'}`}>
                  {uzText}
                </p>
                {n.arabic && (
                  <p
                    className={`mt-2 p-2.5 rounded-xl border text-xs font-medium ${
                      isDay
                        ? 'bg-[#f6fbf4] border-[#d7f0cb] text-[#0c4703]'
                        : 'bg-slate-950/70 border-emerald-900/50 text-amber-300'
                    }`}
                  >
                    {n.arabic}
                  </p>
                )}
              </div>
            );
          })}
        </>
      )}

      {/* SECTION 7: SAVED ITEMS */}
      {section === 'saved' &&
        (savedItems.length === 0 ? (
          <div className={`${cardCls} p-8 text-center`}>
            <Bookmark className="w-6 h-6 mx-auto mb-2 text-slate-400" />
            <p className={`text-xs ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>{ui.noSaved}</p>
          </div>
        ) : (
          savedItems.map((item) => (
            <div key={item.key} className={`${cardCls} p-4`}>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isDay ? 'bg-[#eef9ea] text-[#0c4703]' : 'bg-emerald-950 text-amber-300'
                  }`}
                >
                  {item.badge}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => toggleSaved(item.key, item.badge, item.text)}
                    className={`p-1.5 rounded-lg ${isDay ? 'text-[#158509] bg-[#eef9ea]' : 'text-amber-400 bg-amber-400/10'}`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(item.key, item.text)}
                    className={`p-1.5 rounded-lg ${isDay ? 'text-slate-400 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800'}`}
                  >
                    {copiedKey === item.key ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
              <p className={`text-xs leading-relaxed whitespace-pre-line ${isDay ? 'text-slate-700' : 'text-slate-200'}`}>
                {item.text}
              </p>
            </div>
          ))
        ))}

      {shareToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-xl border border-emerald-600/50 max-w-[90vw] truncate">
          {shareToast}
        </div>
      )}
    </div>
  );
};
