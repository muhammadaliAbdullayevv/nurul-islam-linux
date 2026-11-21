import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  MapPin,
  Navigation,
  RefreshCw,
  Search,
  ExternalLink,
  Compass,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { MasjidDomeIcon, MasjidEhsonIcon } from '../icons/IslamicFeatureIcons';
import { Coordinates } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { getLocalizedCityLabel } from '../../utils/prayerTimes';
import { openExternalUrl } from '../../utils/nativePrayerBridge';

interface MasjidsTabProps {
  currentCity: Coordinates;
  onDetectGPS: () => Promise<{ ok: boolean }> | void;
  onOpenCitySelector: () => void;
  onOpenEhson?: () => void;
}

interface MosqueResult {
  id: string;
  name: string;
  lat: number;
  lng: number;
  distanceKm: number;
  address?: string;
}

interface PhotonFeature {
  properties?: {
    osm_type?: string;
    osm_id?: number;
    osm_key?: string;
    osm_value?: string;
    name?: string;
    street?: string;
    housenumber?: string;
    locality?: string;
    district?: string;
    city?: string;
    county?: string;
    state?: string;
  };
  geometry?: {
    coordinates?: [number, number];
  };
}

interface NominatimItem {
  osm_type?: string;
  osm_id?: number;
  class?: string;
  type?: string;
  lat?: string;
  lon?: string;
  name?: string;
  display_name?: string;
}

const CACHE_KEY = 'nq_masjids_cache_v2';
const CACHE_TTL_MS = 30 * 60 * 1000;
const PHOTON_ENDPOINT = 'https://photon.komoot.io/api/';
const NOMINATIM_ENDPOINT = 'https://nominatim.openstreetmap.org/search';
const EXCLUDE_WORSHIP_RE =
  /church|cathedral|chapel|synagogue|temple|kingdom hall|церков|храм|собор|синагог|часовн|кост[её]л|кирх/i;

const OFFLINE_LANDMARK_MASJIDS: Array<{
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
}> = [
  { id: 'off_hazrati_imom', name: 'Hazrati Imom Jome Masjidi', lat: 41.3372, lng: 69.2398, address: 'Zarqo‘ynar ko‘chasi, Olmazor, Toshkent' },
  { id: 'off_minor', name: 'Minor Jome Masjidi', lat: 41.3264, lng: 69.2869, address: 'Kichik halqa yo‘li, Yunusobod, Toshkent' },
  { id: 'off_kokcha', name: 'Shayx Zayniddin (Ko‘kcha) Masjidi', lat: 41.3186, lng: 69.2036, address: 'Ko‘kcha darvoza, Shayxontohur, Toshkent' },
  { id: 'off_islom_ota', name: 'Islom Ota Jome Masjidi', lat: 41.2981, lng: 69.3177, address: 'Farg‘ona yo‘li, Yashnobod, Toshkent' },
  { id: 'off_novza', name: 'Novza Jome Masjidi', lat: 41.2917, lng: 69.2229, address: 'Bunyodkor shoh ko‘chasi, Chilonzor, Toshkent' },
  { id: 'off_rakat', name: 'Rakat Jome Masjidi', lat: 41.2952, lng: 69.2571, address: 'Yakkasaroy tumani, Toshkent' },
  { id: 'off_jizzax_markaziy', name: 'Xo‘ja Nuriddin Jome Masjidi', lat: 40.1235, lng: 67.8481, address: 'Jizzax shahri' },
  { id: 'off_sam_hazrati_xizr', name: 'Hazrati Xizr Masjidi', lat: 39.6626, lng: 66.9838, address: 'Samarqand shahri' },
  { id: 'off_sam_xuja_ahror', name: 'Xo‘ja Ahrori Vali Masjidi', lat: 39.6223, lng: 66.9602, address: 'Samarqand tumani' },
  { id: 'off_bux_kalon', name: 'Masjidi Kalon', lat: 39.7759, lng: 64.4148, address: 'Buxoro shahri' },
  { id: 'off_andijon', name: 'Devonaboy Jome Masjidi', lat: 40.7859, lng: 72.3504, address: 'Andijon shahri' },
  { id: 'off_fargona', name: 'Jome Masjidi (Farg‘ona)', lat: 40.3866, lng: 71.7872, address: 'Farg‘ona shahri' },
  { id: 'off_namangan', name: 'Mulla Qirg‘iz (Atoulloxon) Masjidi', lat: 41.0005, lng: 71.6725, address: 'Namangan shahri' },
  { id: 'off_qarshi', name: 'Ko‘k Gumbaz Jome Masjidi', lat: 38.8674, lng: 65.7929, address: 'Qarshi shahri' },
  { id: 'off_termiz', name: 'Hakim at-Termiziy Masjidi', lat: 37.2654, lng: 67.1869, address: 'Termiz tumani' },
  { id: 'off_nukus', name: 'Imom Eshon Muhammad Jome Masjidi', lat: 42.4648, lng: 59.6122, address: 'Nukus shahri' },
  { id: 'off_urganch', name: 'Oxun Bobo Jome Masjidi', lat: 41.5513, lng: 60.6317, address: 'Urganch shahri' },
  { id: 'off_navoiy', name: 'Hazrat Alisher Navoiy Masjidi', lat: 40.0972, lng: 65.3775, address: 'Navoiy shahri' },
  { id: 'off_guliston', name: 'Tavhid Jome Masjidi', lat: 40.4915, lng: 68.7811, address: 'Guliston shahri' },
];

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function formatDistance(km: number, language: string): string {
  if (km < 1) {
    return `${Math.max(10, Math.round(km * 1000))} m`;
  }
  const unit = language === 'ru' ? 'км' : 'km';
  return `${km.toFixed(1)} ${unit}`;
}

export const MasjidsTab: React.FC<MasjidsTabProps> = ({
  currentCity,
  onDetectGPS,
  onOpenCitySelector,
  onOpenEhson,
}) => {
  const { isDay } = useTheme();
  const { language } = useLanguage();
  const [radiusKm, setRadiusKm] = useState<number>(5);
  const [mosques, setMosques] = useState<MosqueResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);

  const loc = getLocalizedCityLabel(currentCity.cityName, currentCity.countryName, language, currentCity.region);

  const ui = {
    uz_lat: {
      gpsBtn: 'GPS aniqlash',
      changeCity: 'Hudud',
      radiusLabel: 'Qidiruv masofasi',
      searchPlaceholder: 'Masjid nomi bo‘yicha qidirish...',
      refresh: 'Yangilash',
      loading: 'Yaqin masjidlar qidirilmoqda...',
      empty: 'Tanlangan radiusda masjid topilmadi. Radiusni kattaroq qilib ko‘ring.',
      errorOffline: 'Tarmoq orqali masjidlarni yuklab bo‘lmadi. Google Maps orqali qidirishingiz mumkin.',
      routeBtn: 'Yo‘nalish',
      walkSuffix: 'piyoda',
      driveSuffix: 'avto',
      minUnit: 'daq',
      openAllMaps: 'Barchasini Xaritada ochish',
      defaultName: 'Masjid',
    },
    uz_cyr: {
      gpsBtn: 'GPS аниқлаш',
      changeCity: 'Ҳудуд',
      radiusLabel: 'Қидирув масофаси',
      searchPlaceholder: 'Масжид номи бўйича қидириш...',
      refresh: 'Янгилаш',
      loading: 'Яқин масжидлар қидирилмоқда...',
      empty: 'Танланган радиусда масжид топилмади. Радиусни каттароқ қилиб кўринг.',
      errorOffline: 'Тармоқ орқали масжидларни юклаб бўлмади. Google Maps орқали қидиришингиз мумкин.',
      routeBtn: 'Йўналиш',
      walkSuffix: 'пиёда',
      driveSuffix: 'авто',
      minUnit: 'дақ',
      openAllMaps: 'Барчасини Харитада очиш',
      defaultName: 'Масжид',
    },
    en: {
      gpsBtn: 'Use Live GPS',
      changeCity: 'Location',
      radiusLabel: 'Search Radius',
      searchPlaceholder: 'Filter mosques by name...',
      refresh: 'Refresh',
      loading: 'Searching nearby mosques...',
      empty: 'No mosques found within this radius. Try expanding to 10–25 km.',
      errorOffline: 'Could not reach map directory online. You can open nearby search directly in Maps.',
      routeBtn: 'Directions',
      walkSuffix: 'walk',
      driveSuffix: 'drive',
      minUnit: 'min',
      openAllMaps: 'Search in Maps App',
      defaultName: 'Masjid',
    },
    ru: {
      gpsBtn: 'Точный GPS',
      changeCity: 'Регион',
      radiusLabel: 'Радиус поиска',
      searchPlaceholder: 'Поиск по названию мечети...',
      refresh: 'Обновить',
      loading: 'Поиск ближайших мечетей...',
      empty: 'В выбранном радиусе мечети не найдены. Увеличьте радиус.',
      errorOffline: 'Не удалось загрузить список онлайн. Откройте поиск напрямую на картах.',
      routeBtn: 'Маршрут',
      walkSuffix: 'пешком',
      driveSuffix: 'авто',
      minUnit: 'мин',
      openAllMaps: 'Открыть на картах',
      defaultName: 'Мечеть',
    },
  }[language];

  const fetchNearbyMosques = useCallback(
    async (forceRefresh = false) => {
      const lat = Number(currentCity.latitude.toFixed(4));
      const lng = Number(currentCity.longitude.toFixed(4));
      const cacheKey = `${lat}_${lng}_${radiusKm}_${language}`;

      if (!forceRefresh) {
        try {
          const cachedRaw = localStorage.getItem(CACHE_KEY);
          if (cachedRaw) {
            const parsed = JSON.parse(cachedRaw) as {
              key: string;
              timestamp: number;
              items: MosqueResult[];
            };
            if (parsed.key === cacheKey && Date.now() - parsed.timestamp < CACHE_TTL_MS) {
              setMosques(parsed.items);
              setErrorMsg(null);
              return;
            }
          }
        } catch {
          // Ignore invalid cache
        }
      }

      setLoading(true);
      setErrorMsg(null);

      const degLat = radiusKm / 111.0;
      const degLng = radiusKm / (111.0 * Math.max(0.25, Math.cos(toRad(lat))));
      const minLon = (lng - degLng).toFixed(5);
      const minLat = (lat - degLat).toFixed(5);
      const maxLon = (lng + degLng).toFixed(5);
      const maxLat = (lat + degLat).toFixed(5);
      const bboxParam = `${minLon},${minLat},${maxLon},${maxLat}`;

      const deduped = new Map<string, MosqueResult>();
      let networkSucceeded = false;

      const addCandidate = (
        id: string,
        rawName: string | undefined,
        pLat: number,
        pLng: number,
        address?: string
      ) => {
        const cleanName = (rawName || '').trim() || ui.defaultName;
        if (EXCLUDE_WORSHIP_RE.test(cleanName)) return;
        const distanceKm = haversineKm(lat, lng, pLat, pLng);
        if (distanceKm > radiusKm + 0.5) return;
        const uniqueKey = `${cleanName.toLowerCase()}_${pLat.toFixed(4)}_${pLng.toFixed(4)}`;
        if (!deduped.has(uniqueKey)) {
          deduped.set(uniqueKey, {
            id,
            name: cleanName,
            lat: pLat,
            lng: pLng,
            distanceKm,
            address: address || undefined,
          });
        }
      };

      // 1) Primary fast OpenStreetMap search via Komoot Photon (multi-script: Uzbek + Russian + English)
      try {
        const queries = ['masjid', 'мечеть', 'mosque'];
        const responses = await Promise.all(
          queries.map(async (q) => {
            const controller = new AbortController();
            const timer = window.setTimeout(() => controller.abort(), 9000);
            try {
              const url =
                `${PHOTON_ENDPOINT}?q=${encodeURIComponent(q)}` +
                `&osm_tag=amenity:place_of_worship` +
                `&lat=${lat}&lon=${lng}&bbox=${bboxParam}&limit=35`;
              const resp = await fetch(url, { signal: controller.signal });
              window.clearTimeout(timer);
              if (!resp.ok) return null;
              networkSucceeded = true;
              return (await resp.json()) as { features?: PhotonFeature[] };
            } catch {
              window.clearTimeout(timer);
              return null;
            }
          })
        );

        for (const payload of responses) {
          if (!payload?.features) continue;
          for (const f of payload.features) {
            const coords = f.geometry?.coordinates;
            const props = f.properties;
            if (!coords || coords.length < 2 || !props) continue;
            const [pLng, pLat] = coords;
            if (typeof pLat !== 'number' || typeof pLng !== 'number') continue;
            const street = props.street || '';
            const house = props.housenumber || '';
            const area = props.locality || props.district || props.city || props.county || '';
            const addrParts = [street && house ? `${street}, ${house}` : street, area].filter(Boolean);
            addCandidate(
              `${props.osm_type || 'N'}_${props.osm_id || `${pLat}_${pLng}`}`,
              props.name,
              pLat,
              pLng,
              addrParts.join(' · ')
            );
          }
        }
      } catch {
        // Continue to Nominatim backup
      }

      // 2) Backup via OpenStreetMap Nominatim if Photon returned nothing or failed
      if (deduped.size === 0) {
        for (const q of ['masjid', 'mosque']) {
          const controller = new AbortController();
          const timer = window.setTimeout(() => controller.abort(), 9000);
          try {
            const viewbox = `${minLon},${maxLat},${maxLon},${minLat}`;
            const url =
              `${NOMINATIM_ENDPOINT}?format=json&q=${encodeURIComponent(q)}` +
              `&viewbox=${viewbox}&bounded=1&limit=30`;
            const resp = await fetch(url, { signal: controller.signal });
            window.clearTimeout(timer);
            if (!resp.ok) continue;
            networkSucceeded = true;
            const items = (await resp.json()) as NominatimItem[];
            for (const item of items) {
              if (item.class !== 'amenity' || item.type !== 'place_of_worship') continue;
              const pLat = parseFloat(item.lat || '');
              const pLng = parseFloat(item.lon || '');
              if (Number.isNaN(pLat) || Number.isNaN(pLng)) continue;
              const addr = item.display_name
                ? item.display_name.split(',').slice(1, 4).map((s) => s.trim()).join(', ')
                : undefined;
              addCandidate(
                `${item.osm_type || 'N'}_${item.osm_id || `${pLat}_${pLng}`}`,
                item.name || item.display_name?.split(',')[0],
                pLat,
                pLng,
                addr
              );
            }
            if (deduped.size > 0) break;
          } catch {
            window.clearTimeout(timer);
          }
        }
      }

      // 3) Offline curated landmark fallback when offline (no network)
      if (!networkSucceeded && deduped.size === 0) {
        const offlineNearby = OFFLINE_LANDMARK_MASJIDS.map((m) => ({
          ...m,
          distanceKm: haversineKm(lat, lng, m.lat, m.lng),
        }))
          .filter((m) => m.distanceKm <= Math.max(radiusKm, 35))
          .sort((a, b) => a.distanceKm - b.distanceKm);

        if (offlineNearby.length > 0) {
          setMosques(offlineNearby);
          setErrorMsg(null);
          setLoading(false);
          return;
        }

        setLoading(false);
        setErrorMsg(ui.errorOffline);
        return;
      }

      const sorted = Array.from(deduped.values()).sort((a, b) => a.distanceKm - b.distanceKm);
      setMosques(sorted);
      setLoading(false);

      try {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ key: cacheKey, timestamp: Date.now(), items: sorted })
        );
      } catch {
        // Ignore storage quota error
      }
    },
    [currentCity.latitude, currentCity.longitude, language, radiusKm, ui.defaultName, ui.errorOffline]
  );

  useEffect(() => {
    fetchNearbyMosques(false);
  }, [fetchNearbyMosques]);

  const filteredMosques = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return mosques;
    return mosques.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        (m.address && m.address.toLowerCase().includes(q))
    );
  }, [mosques, searchQuery]);

  const handleGpsSnap = async () => {
    setGpsLoading(true);
    try {
      await onDetectGPS();
    } finally {
      setGpsLoading(false);
    }
  };

  const openGoogleMapsAll = () => {
    const url = `https://www.google.com/maps/search/mosque/@${currentCity.latitude},${currentCity.longitude},14z`;
    openExternalUrl(url);
  };

  const openDirections = (mosque: MosqueResult) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${mosque.lat},${mosque.lng}`;
    openExternalUrl(url);
  };

  const cardCls = isDay
    ? 'bg-white border border-[#dde3ea] rounded-2xl p-3.5 shadow-xs'
    : 'bg-slate-900/90 border border-emerald-900/50 rounded-2xl p-3.5';

  return (
    <div className="space-y-3 pb-4">
      {onOpenEhson && (
        <button
          type="button"
          onClick={onOpenEhson}
          className={`w-full rounded-2xl border px-3.5 py-2.5 flex items-center justify-between gap-2 transition active:scale-[0.99] ${
            isDay
              ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703] shadow-xs'
              : 'bg-emerald-950/70 border-emerald-800/60 text-amber-300'
          }`}
        >
          <span className="flex items-center gap-2 min-w-0 text-xs font-bold">
            <MasjidEhsonIcon className="w-4 h-4 shrink-0" />
            <span className="truncate">
              {language === 'ru'
                ? 'Хашар и помощь мечетям'
                : language === 'en'
                ? 'Masjid Hashar & Verified Support'
                : language === 'uz_cyr'
                ? 'Масжидларга эҳсон ва ҳашар'
                : 'Masjidga ehson va hashar e’lonlari'}
            </span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-75" />
        </button>
      )}
      {/* Location & Radius Controls */}
      <div className={cardCls}>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                isDay
                  ? 'bg-[#eef9ea] text-[#158509] border border-[#c5e8bc]'
                  : 'bg-emerald-950 text-amber-400 border border-emerald-800/50'
              }`}
            >
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className={`text-sm font-bold truncate ${isDay ? 'text-slate-900' : 'text-white'}`}>
                {loc.city}
              </p>
              <p className={`text-[10.5px] tabular-nums ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                {currentCity.latitude.toFixed(3)}, {currentCity.longitude.toFixed(3)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleGpsSnap}
              disabled={gpsLoading}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 transition ${
                isDay
                  ? 'bg-[#158509] text-white nq-keep-dark'
                  : 'bg-amber-500 text-slate-950'
              }`}
            >
              <Compass className={`w-3.5 h-3.5 ${gpsLoading ? 'animate-spin' : ''}`} />
              <span>{ui.gpsBtn}</span>
            </button>

            <button
              type="button"
              onClick={onOpenCitySelector}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border transition ${
                isDay
                  ? 'bg-[#ecf1f5] border-[#dde3ea] text-slate-700'
                  : 'bg-slate-800 border-slate-700 text-slate-200'
              }`}
            >
              {ui.changeCity}
            </button>
          </div>
        </div>

        {/* Radius Pills + Refresh */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            {[2, 5, 10, 25].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRadiusKm(r)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  radiusKm === r
                    ? isDay
                      ? 'bg-[#0c4703] text-white nq-keep-dark'
                      : 'bg-amber-500 text-slate-950'
                    : isDay
                    ? 'bg-[#ecf1f5] text-slate-700'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {r} km
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => fetchNearbyMosques(true)}
            disabled={loading}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 border ${
              isDay
                ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                : 'bg-emerald-950 border-emerald-800 text-emerald-300'
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            <span>{ui.refresh}</span>
          </button>
        </div>

        {/* Search Input + Direct Maps Button */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={ui.searchPlaceholder}
              className={`w-full pl-8 pr-3 py-2 rounded-xl text-xs border outline-none ${
                isDay
                  ? 'bg-[#f8fafc] border-[#dde3ea] text-slate-800'
                  : 'bg-slate-950 border-slate-800 text-slate-100'
              }`}
            />
          </div>
          <button
            type="button"
            onClick={openGoogleMapsAll}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 border ${
              isDay
                ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                : 'bg-emerald-950 border-emerald-800 text-amber-300'
            }`}
            title={ui.openAllMaps}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Maps</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className={`${cardCls} text-center py-8`}>
          <RefreshCw
            className={`w-6 h-6 mx-auto mb-2 animate-spin ${
              isDay ? 'text-[#158509]' : 'text-amber-400'
            }`}
          />
          <p className={`text-xs font-medium ${isDay ? 'text-slate-600' : 'text-slate-300'}`}>
            {ui.loading}
          </p>
        </div>
      )}

      {/* Offline / Error Fallback */}
      {!loading && errorMsg && (
        <div
          className={`p-4 rounded-2xl border space-y-3 ${
            isDay ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-amber-950/30 border-amber-800/60 text-amber-200'
          }`}
        >
          <div className="flex items-start gap-2 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={openGoogleMapsAll}
            className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 ${
              isDay ? 'bg-[#158509] text-white nq-keep-dark' : 'bg-amber-500 text-slate-950'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{ui.openAllMaps}</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !errorMsg && filteredMosques.length === 0 && (
        <div className={`${cardCls} text-center py-8`}>
          <MasjidDomeIcon className="w-7 h-7 mx-auto mb-2 text-slate-400" />
          <p className={`text-xs ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>{ui.empty}</p>
        </div>
      )}

      {/* Mosque Results List */}
      {!loading &&
        filteredMosques.map((mosque) => {
          const walkMins = Math.max(1, Math.round((mosque.distanceKm / 4.8) * 60));
          const driveMins = Math.max(1, Math.round((mosque.distanceKm / 28) * 60));

          return (
            <div key={mosque.id} className={`${cardCls} flex items-center justify-between gap-3`}>
              <div className="min-w-0 flex-1">
                <h3 className={`text-sm font-bold truncate ${isDay ? 'text-slate-900' : 'text-white'}`}>
                  {mosque.name}
                </h3>
                {mosque.address && (
                  <p className={`text-[11px] truncate mt-0.5 ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                    {mosque.address}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold tabular-nums ${
                      isDay
                        ? 'bg-[#eef9ea] text-[#0c4703] border border-[#c5e8bc]'
                        : 'bg-emerald-950 text-amber-300 border border-emerald-800/60'
                    }`}
                  >
                    {formatDistance(mosque.distanceKm, language)}
                  </span>
                  <span
                    className={`text-[10.5px] flex items-center gap-1 ${
                      isDay ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    {mosque.distanceKm <= 1.8
                      ? `${walkMins} ${ui.minUnit} (${ui.walkSuffix})`
                      : `${driveMins} ${ui.minUnit} (${ui.driveSuffix})`}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openDirections(mosque)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition active:scale-95 ${
                  isDay
                    ? 'bg-[#158509] hover:bg-[#0c5007] text-white nq-keep-dark'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                }`}
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{ui.routeBtn}</span>
              </button>
            </div>
          );
        })}
    </div>
  );
};
