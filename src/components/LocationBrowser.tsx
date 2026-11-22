import React, { useEffect, useMemo, useState } from 'react';
import { Check, Globe2, Loader2, MapPin, Search, X } from 'lucide-react';
import { AppLanguage, Coordinates } from '../types';
import {
  WORLD_LOCATIONS,
  getLocalizedCityLabel,
  normalizeLocationSearch,
  registerLocationEntries,
} from '../utils/prayerTimes';
import {
  LOCATION_REGIONS,
  LocationEntry,
  LocationRegionId,
  REGION_MAP,
  UZBEKISTAN_LOCATIONS,
} from '../data/uzbekistanDistricts';

registerLocationEntries(UZBEKISTAN_LOCATIONS);
const ALL_CITIES: LocationEntry[] = [...UZBEKISTAN_LOCATIONS, ...WORLD_LOCATIONS];
import {
  getCachedUzbekistanVillages,
  loadUzbekistanVillages,
  searchLocationsOnline,
  searchOfflineVillages,
  VillageSearchResult,
} from '../utils/uzbekistanVillages';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface LocationBrowserProps {
  selectedCity: Coordinates | null;
  onSelectCity: (city: Coordinates) => void;
  /** Optional custom max height class for inline usage (e.g. inside onboarding) */
  listClassName?: string;
}

const LABELS: Record<
  AppLanguage,
  {
    all: string;
    districtsTab: string;
    villagesTab: string;
    districtsHeading: string;
    villagesHeading: string;
    onlineHeading: string;
    villageBadge: string;
    searchingOnline: string;
    loadMore: (remaining: number) => string;
    villageHint: string;
  }
> = {
  uz_lat: {
    all: 'Barchasi',
    districtsTab: 'Shahar va tumanlar',
    villagesTab: 'Qishloqlar',
    districtsHeading: 'Shahar va tumanlar',
    villagesHeading: 'Qishloqlar',
    onlineHeading: 'Boshqa qishloq va hududlar (Onlayn)',
    villageBadge: 'Qishloq',
    searchingOnline: 'Boshqa qishloqlar qidirilmoqda...',
    loadMore: (n) => `Yana ko'rsatish (${n})`,
    villageHint: "Qishloq yoki mahalla nomini yozib ham qidirishingiz mumkin",
  },
  uz_cyr: {
    all: 'Барчаси',
    districtsTab: 'Шаҳар ва туманлар',
    villagesTab: 'Қишлоқлар',
    districtsHeading: 'Шаҳар ва туманлар',
    villagesHeading: 'Қишлоқлар',
    onlineHeading: 'Бошқа қишлоқ ва ҳудудлар (Онлайн)',
    villageBadge: 'Қишлоқ',
    searchingOnline: 'Бошқа қишлоқлар қидирилмоқда...',
    loadMore: (n) => `Яна кўрсатиш (${n})`,
    villageHint: 'Қишлоқ ёки маҳалла номини ёзиб ҳам қидиришингиз мумкин',
  },
  en: {
    all: 'All',
    districtsTab: 'Cities & Districts',
    villagesTab: 'Villages',
    districtsHeading: 'Cities & Districts',
    villagesHeading: 'Villages',
    onlineHeading: 'More Villages & Places (Online)',
    villageBadge: 'Village',
    searchingOnline: 'Searching more villages online...',
    loadMore: (n) => `Show more (${n})`,
    villageHint: 'Type any city, district, or village name to search',
  },
  ru: {
    all: 'Все',
    districtsTab: 'Города и районы',
    villagesTab: 'Сёла и посёлки',
    districtsHeading: 'Города и районы',
    villagesHeading: 'Сёла и посёлки',
    onlineHeading: 'Другие сёла и места (Онлайн)',
    villageBadge: 'Село',
    searchingOnline: 'Поиск других сёл онлайн...',
    loadMore: (n) => `Показать ещё (${n})`,
    villageHint: 'Введите название города, района или села для поиска',
  },
};

function isSameLocation(a: Coordinates | null, b: Coordinates): boolean {
  if (!a) return false;
  if (a.cityName !== b.cityName) return false;
  return (
    Math.abs(a.latitude - b.latitude) < 0.03 &&
    Math.abs(a.longitude - b.longitude) < 0.03
  );
}

export const LocationBrowser: React.FC<LocationBrowserProps> = ({
  selectedCity,
  onSelectCity,
  listClassName = 'flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-3',
}) => {
  const { isDay } = useTheme();
  const { language, t } = useLanguage();
  const ui = LABELS[language] || LABELS.uz_lat;

  const [search, setSearch] = useState('');
  const [activeRegion, setActiveRegion] = useState<'all' | LocationRegionId>('all');
  const [regionTab, setRegionTab] = useState<'districts' | 'villages'>('districts');
  const [villagePageLimit, setVillagePageLimit] = useState(80);
  const [villagesReady, setVillagesReady] = useState(() => getCachedUzbekistanVillages().length > 0);
  const [onlineResults, setOnlineResults] = useState<VillageSearchResult[]>([]);
  const [onlineLoading, setOnlineLoading] = useState(false);

  // Lazy-load 7,800+ offline Uzbekistan villages once on mount
  useEffect(() => {
    if (villagesReady) return;
    let active = true;
    void loadUzbekistanVillages().then((rows) => {
      if (active && rows.length > 0) {
        setVillagesReady(true);
      }
    });
    return () => {
      active = false;
    };
  }, [villagesReady]);

  const normalizedQuery = normalizeLocationSearch(search);

  // Offline cities & districts filter
  const filteredDistricts = useMemo(() => {
    return ALL_CITIES.filter((c) => {
      if (!normalizedQuery && activeRegion !== 'all' && c.region !== activeRegion) {
        return false;
      }
      if (!normalizedQuery) return true;
      const loc = getLocalizedCityLabel(c.cityName, c.countryName, language, c.region);
      return loc.searchTerms.includes(normalizedQuery);
    });
  }, [activeRegion, language, normalizedQuery]);

  // Count of offline villages in the currently selected Uzbekistan region
  const regionVillageCount = useMemo(() => {
    if (!villagesReady || activeRegion === 'all' || activeRegion === 'world') return 0;
    const all = getCachedUzbekistanVillages();
    let count = 0;
    for (let i = 0; i < all.length; i++) {
      if (all[i].region === activeRegion) count++;
    }
    return count;
  }, [activeRegion, villagesReady]);

  // Offline villages matching search query OR region browse mode
  const filteredOfflineVillages = useMemo(() => {
    if (!villagesReady) return [];
    if (normalizedQuery.length >= 2) {
      return searchOfflineVillages(normalizedQuery, activeRegion, 45);
    }
    if (!normalizedQuery && activeRegion !== 'all' && activeRegion !== 'world' && regionTab === 'villages') {
      return searchOfflineVillages('', activeRegion, villagePageLimit);
    }
    return [];
  }, [activeRegion, normalizedQuery, regionTab, villagePageLimit, villagesReady]);

  // Debounced live online search (Photon OSM + Open-Meteo) when query >= 2 chars
  useEffect(() => {
    const trimmed = search.trim();
    if (trimmed.length < 2) {
      setOnlineResults([]);
      setOnlineLoading(false);
      return;
    }

    const controller = new AbortController();
    setOnlineLoading(true);

    const timer = window.setTimeout(() => {
      void searchLocationsOnline(trimmed, language, controller.signal)
        .then((hits) => {
          if (!controller.signal.aborted) {
            setOnlineResults(hits);
            setOnlineLoading(false);
          }
        })
        .catch(() => {
          if (!controller.signal.aborted) {
            setOnlineResults([]);
            setOnlineLoading(false);
          }
        });
    }, 350);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [language, search]);

  // Deduplicate online results against already-shown offline districts & villages
  const dedupedOnlineResults = useMemo(() => {
    if (onlineResults.length === 0) return [];
    return onlineResults.filter((item) => {
      const nItem = normalizeLocationSearch(item.cityName);
      for (const d of filteredDistricts) {
        if (
          Math.abs(d.latitude - item.latitude) < 0.05 &&
          Math.abs(d.longitude - item.longitude) < 0.05 &&
          normalizeLocationSearch(d.cityName) === nItem
        ) {
          return false;
        }
      }
      for (const v of filteredOfflineVillages) {
        if (
          Math.abs(v.latitude - item.latitude) < 0.04 &&
          Math.abs(v.longitude - item.longitude) < 0.04 &&
          normalizeLocationSearch(v.cityName) === nItem
        ) {
          return false;
        }
      }
      return true;
    });
  }, [filteredDistricts, filteredOfflineVillages, onlineResults]);

  const groupedByRegion = useMemo(() => {
    if (normalizedQuery || activeRegion !== 'all') return null;
    const map = new Map<LocationRegionId, LocationEntry[]>();
    for (const r of LOCATION_REGIONS) {
      map.set(r.id, []);
    }
    for (const c of filteredDistricts) {
      const bucket = map.get(c.region);
      if (bucket) bucket.push(c);
    }
    return LOCATION_REGIONS.map((r) => ({
      region: r,
      items: map.get(r.id) || [],
    })).filter((g) => g.items.length > 0);
  }, [activeRegion, filteredDistricts, normalizedQuery]);

  const renderDistrictButton = (c: LocationEntry) => {
    const loc = getLocalizedCityLabel(c.cityName, c.countryName, language, c.region);
    const isSelected = isSameLocation(selectedCity, c);
    const subtitle = loc.region && c.region !== 'world' ? `${loc.region}, ${loc.country}` : loc.country;

    return (
      <button
        key={`dist-${c.cityName}-${c.countryName}`}
        type="button"
        onClick={() =>
          onSelectCity({
            cityName: c.cityName,
            countryName: c.countryName,
            latitude: c.latitude,
            longitude: c.longitude,
            timezone: c.timezone,
            region: c.region,
          })
        }
        className={`w-full flex items-center justify-between py-2.5 px-2.5 rounded-xl transition ${
          isSelected
            ? isDay
              ? 'bg-[#eef9ea] text-[#0c4703] font-bold'
              : 'bg-emerald-950/60 text-amber-300 font-bold'
            : isDay
            ? 'hover:bg-[#ecf1f5] text-slate-800'
            : 'hover:bg-slate-800 text-slate-200'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <MapPin
            className={`w-4 h-4 shrink-0 ${
              isSelected
                ? isDay
                  ? 'text-[#158509]'
                  : 'text-amber-400'
                : 'text-slate-400'
            }`}
          />
          <div className="text-left min-w-0">
            <p className="text-xs font-semibold truncate">{loc.city}</p>
            <p className={`text-[10px] truncate ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
              {subtitle}
            </p>
          </div>
        </div>

        {isSelected && (
          <Check className={`w-4 h-4 shrink-0 ${isDay ? 'text-[#158509]' : 'text-amber-400'}`} />
        )}
      </button>
    );
  };

  const renderVillageButton = (v: VillageSearchResult, idx: number) => {
    const loc = getLocalizedCityLabel(v.cityName, v.countryName, language, v.region);
    const isSelected = isSameLocation(selectedCity, v);
    const regionPart = loc.region && v.region !== 'world' ? loc.region : '';
    const subtitleParts = [v.subtitle, regionPart, loc.country].filter(Boolean);
    const subtitle = subtitleParts.join(', ');

    return (
      <button
        key={`vil-${v.source}-${v.cityName}-${v.latitude}-${v.longitude}-${idx}`}
        type="button"
        onClick={() =>
          onSelectCity({
            cityName: v.cityName,
            countryName: v.countryName,
            latitude: v.latitude,
            longitude: v.longitude,
            timezone: v.timezone,
            region: v.region,
            subtitle: v.subtitle,
          })
        }
        className={`w-full flex items-center justify-between py-2.5 px-2.5 rounded-xl transition ${
          isSelected
            ? isDay
              ? 'bg-[#eef9ea] text-[#0c4703] font-bold'
              : 'bg-emerald-950/60 text-amber-300 font-bold'
            : isDay
            ? 'hover:bg-[#ecf1f5] text-slate-800'
            : 'hover:bg-slate-800 text-slate-200'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {v.source === 'online' ? (
            <Globe2
              className={`w-4 h-4 shrink-0 ${
                isSelected
                  ? isDay
                    ? 'text-[#158509]'
                    : 'text-amber-400'
                  : isDay
                  ? 'text-[#158509]/70'
                  : 'text-emerald-400/70'
              }`}
            />
          ) : (
            <MapPin
              className={`w-4 h-4 shrink-0 ${
                isSelected
                  ? isDay
                    ? 'text-[#158509]'
                    : 'text-amber-400'
                  : 'text-slate-400'
              }`}
            />
          )}
          <div className="text-left min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <p className="text-xs font-semibold truncate">{loc.city}</p>
              {v.isVillage && (
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold shrink-0 ${
                    isDay
                      ? 'bg-[#eef9ea] text-[#158509]'
                      : 'bg-emerald-950/90 text-emerald-300'
                  }`}
                >
                  {ui.villageBadge}
                </span>
              )}
            </div>
            <p className={`text-[10px] truncate ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
              {subtitle}
            </p>
          </div>
        </div>

        {isSelected && (
          <Check className={`w-4 h-4 shrink-0 ${isDay ? 'text-[#158509]' : 'text-amber-400'}`} />
        )}
      </button>
    );
  };

  const showRegionSubTabs = !normalizedQuery && activeRegion !== 'all' && activeRegion !== 'world' && regionVillageCount > 0;
  const hasAnyResults =
    filteredDistricts.length > 0 ||
    filteredOfflineVillages.length > 0 ||
    dedupedOnlineResults.length > 0;

  return (
    <div className="flex flex-col min-h-0 flex-1 space-y-2.5">
      {/* Search Input */}
      <div className="relative shrink-0">
        <Search
          className={`absolute left-3.5 top-3 w-4 h-4 ${
            isDay ? 'text-[#158509]' : 'text-emerald-400'
          }`}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            const next = e.target.value;
            setSearch(next);
            if (next.trim() && activeRegion !== 'all') {
              setActiveRegion('all');
            }
          }}
          placeholder={t.cityModal.searchPlaceholder}
          className={`w-full border rounded-xl pl-10 pr-9 py-2.5 text-xs focus:outline-none ${
            isDay
              ? 'bg-[#ecf1f5] border-[#dde3ea] text-slate-900 placeholder-slate-400 focus:border-[#158509]'
              : 'bg-slate-950 border-emerald-900/60 text-white placeholder-slate-400 focus:border-amber-400'
          }`}
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className={`absolute right-2.5 top-2 p-1 rounded-lg ${
              isDay ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-white'
            }`}
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Horizontal Region Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 shrink-0">
        <button
          type="button"
          onClick={() => {
            setActiveRegion('all');
            setRegionTab('districts');
            setSearch('');
          }}
          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap border transition shrink-0 ${
            activeRegion === 'all' && !normalizedQuery
              ? isDay
                ? 'bg-[#158509] text-white border-[#158509]'
                : 'bg-amber-500 text-slate-950 border-amber-400'
              : isDay
              ? 'bg-[#ecf1f5] text-slate-600 border-[#dde3ea] hover:text-slate-900'
              : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:text-white'
          }`}
        >
          {ui.all}
        </button>
        {LOCATION_REGIONS.map((reg) => {
          const selected = activeRegion === reg.id;
          return (
            <button
              key={reg.id}
              type="button"
              onClick={() => {
                setActiveRegion(reg.id);
                setRegionTab('districts');
                setVillagePageLimit(80);
                setSearch('');
              }}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap border transition shrink-0 ${
                selected
                  ? isDay
                    ? 'bg-[#158509] text-white border-[#158509]'
                    : 'bg-amber-500 text-slate-950 border-amber-400'
                  : isDay
                  ? 'bg-[#ecf1f5] text-slate-600 border-[#dde3ea] hover:text-slate-900'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              {reg.shortLabel[language]}
            </button>
          );
        })}
      </div>

      {/* Districts vs Villages Sub-toggle when a specific Uzbekistan region is tapped */}
      {showRegionSubTabs && (
        <div
          className={`grid grid-cols-2 gap-1 p-1 rounded-xl border shrink-0 ${
            isDay ? 'bg-[#ecf1f5] border-[#dde3ea]' : 'bg-slate-950 border-slate-800'
          }`}
        >
          <button
            type="button"
            onClick={() => setRegionTab('districts')}
            className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition ${
              regionTab === 'districts'
                ? isDay
                  ? 'bg-white text-[#158509] shadow-xs'
                  : 'bg-emerald-950 text-amber-300 shadow-xs'
                : isDay
                ? 'text-slate-500'
                : 'text-slate-400'
            }`}
          >
            {ui.districtsTab} ({filteredDistricts.length})
          </button>
          <button
            type="button"
            onClick={() => setRegionTab('villages')}
            className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition ${
              regionTab === 'villages'
                ? isDay
                  ? 'bg-white text-[#158509] shadow-xs'
                  : 'bg-emerald-950 text-amber-300 shadow-xs'
                : isDay
                ? 'text-slate-500'
                : 'text-slate-400'
            }`}
          >
            {ui.villagesTab} ({regionVillageCount})
          </button>
        </div>
      )}

      {/* Scrollable Results List */}
      <div className={listClassName}>
        {!normalizedQuery && groupedByRegion ? (
          <>
            <p className={`px-2 text-[10px] ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
              {ui.villageHint}
            </p>
            {groupedByRegion.map(({ region, items }) => (
              <div key={region.id} className="space-y-0.5">
                <div
                  className={`sticky top-0 z-10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${
                    isDay
                      ? 'bg-white/95 text-[#158509]'
                      : 'bg-slate-900/95 text-emerald-400'
                  }`}
                >
                  {REGION_MAP[region.id].fullLabel[language]} ({items.length})
                </div>
                <div className={`divide-y ${isDay ? 'divide-slate-100' : 'divide-slate-800/60'}`}>
                  {items.map(renderDistrictButton)}
                </div>
              </div>
            ))}
          </>
        ) : !normalizedQuery && showRegionSubTabs && regionTab === 'villages' ? (
          <div className="space-y-2">
            <div className={`divide-y ${isDay ? 'divide-slate-100' : 'divide-slate-800/60'}`}>
              {filteredOfflineVillages.map(renderVillageButton)}
            </div>
            {filteredOfflineVillages.length < regionVillageCount && (
              <button
                type="button"
                onClick={() => setVillagePageLimit((prev) => prev + 100)}
                className={`w-full py-2 rounded-xl border text-[11px] font-semibold transition ${
                  isDay
                    ? 'bg-[#ecf1f5] border-[#dde3ea] text-[#158509] hover:bg-[#e2ece7]'
                    : 'bg-slate-950 border-slate-800 text-emerald-300 hover:bg-slate-800'
                }`}
              >
                {ui.loadMore(regionVillageCount - filteredOfflineVillages.length)}
              </button>
            )}
          </div>
        ) : !normalizedQuery ? (
          <div className={`divide-y ${isDay ? 'divide-slate-100' : 'divide-slate-800/60'}`}>
            {filteredDistricts.map(renderDistrictButton)}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDistricts.length > 0 && (
              <div className="space-y-0.5">
                <div
                  className={`sticky top-0 z-10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${
                    isDay ? 'bg-white/95 text-[#158509]' : 'bg-slate-900/95 text-emerald-400'
                  }`}
                >
                  {ui.districtsHeading} ({filteredDistricts.length})
                </div>
                <div className={`divide-y ${isDay ? 'divide-slate-100' : 'divide-slate-800/60'}`}>
                  {filteredDistricts.map(renderDistrictButton)}
                </div>
              </div>
            )}

            {filteredOfflineVillages.length > 0 && (
              <div className="space-y-0.5">
                <div
                  className={`sticky top-0 z-10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${
                    isDay ? 'bg-white/95 text-[#158509]' : 'bg-slate-900/95 text-emerald-400'
                  }`}
                >
                  {ui.villagesHeading} ({filteredOfflineVillages.length})
                </div>
                <div className={`divide-y ${isDay ? 'divide-slate-100' : 'divide-slate-800/60'}`}>
                  {filteredOfflineVillages.map(renderVillageButton)}
                </div>
              </div>
            )}

            {dedupedOnlineResults.length > 0 && (
              <div className="space-y-0.5">
                <div
                  className={`sticky top-0 z-10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${
                    isDay ? 'bg-white/95 text-[#158509]' : 'bg-slate-900/95 text-emerald-400'
                  }`}
                >
                  {ui.onlineHeading}
                </div>
                <div className={`divide-y ${isDay ? 'divide-slate-100' : 'divide-slate-800/60'}`}>
                  {dedupedOnlineResults.map(renderVillageButton)}
                </div>
              </div>
            )}

            {onlineLoading && (
              <div
                className={`flex items-center justify-center gap-2 py-3 text-[11px] ${
                  isDay ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#158509]" />
                <span>{ui.searchingOnline}</span>
              </div>
            )}

            {!onlineLoading && !hasAnyResults && (
              <p className={`text-center py-8 text-xs ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                {t.cityModal.noResults}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
