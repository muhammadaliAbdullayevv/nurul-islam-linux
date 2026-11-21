import { AppLanguage, Coordinates } from '../types';
import { LocationRegionId } from '../data/uzbekistanDistricts';
import { cleanModernUzPlaceName, normalizeLocationSearch } from './prayerTimes';

interface RawVillageDataset {
  r: LocationRegionId[];
  v: Array<[name: string, regionIdx: number, lat: number, lng: number]>;
}

export interface IndexedVillage {
  name: string;
  normName: string;
  region: LocationRegionId;
  latitude: number;
  longitude: number;
  timezone: 'Asia/Tashkent' | 'Asia/Samarkand';
}

export interface VillageSearchResult extends Coordinates {
  region?: LocationRegionId;
  subtitle?: string;
  isVillage: boolean;
  source: 'offline_village' | 'online';
}

const WESTERN_UZ_REGIONS = new Set<LocationRegionId>([
  'uz_samarkand',
  'uz_bukhara',
  'uz_kashkadarya',
  'uz_surkhandarya',
  'uz_navoi',
  'uz_khorezm',
  'uz_karakalpakstan',
]);

export function getUzbekistanTimezone(region?: LocationRegionId): 'Asia/Tashkent' | 'Asia/Samarkand' {
  return region && WESTERN_UZ_REGIONS.has(region) ? 'Asia/Samarkand' : 'Asia/Tashkent';
}

let cachedVillages: IndexedVillage[] | null = null;
let loadPromise: Promise<IndexedVillage[]> | null = null;

/**
 * Lazy-loads the offline Uzbekistan villages dataset (~7,800 villages across all 14 regions).
 * Cached in memory after first load so startup bundle size and boot latency stay zero.
 */
export async function loadUzbekistanVillages(): Promise<IndexedVillage[]> {
  if (cachedVillages) return cachedVillages;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    try {
      const res = await fetch('/data/uz-villages.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as RawVillageDataset;
      const regions = data.r || [];
      const rows = data.v || [];
      const indexed: IndexedVillage[] = new Array(rows.length);
      for (let i = 0; i < rows.length; i++) {
        const [name, regIdx, lat, lng] = rows[i];
        const region = regions[regIdx] || 'uz_tashkent_region';
        indexed[i] = {
          name,
          normName: normalizeLocationSearch(name),
          region,
          latitude: lat,
          longitude: lng,
          timezone: getUzbekistanTimezone(region),
        };
      }
      cachedVillages = indexed;
      return indexed;
    } catch (err) {
      console.warn('Could not load offline Uzbekistan villages:', err);
      loadPromise = null;
      return [];
    }
  })();

  return loadPromise;
}

export function getCachedUzbekistanVillages(): IndexedVillage[] {
  return cachedVillages || [];
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
}

/**
 * Finds the nearest offline Uzbekistan village to a GPS coordinate.
 * Returns null if outside Uzbekistan bounding box or dataset unavailable.
 */
export async function findNearestOfflineVillage(
  latitude: number,
  longitude: number
): Promise<{ village: IndexedVillage; distanceKm: number } | null> {
  if (latitude < 36.5 || latitude > 46.0 || longitude < 55.5 || longitude > 74.0) {
    return null;
  }
  const villages = await loadUzbekistanVillages();
  if (villages.length === 0) return null;

  let best: IndexedVillage | null = null;
  let bestDist = Infinity;
  for (let i = 0; i < villages.length; i++) {
    const v = villages[i];
    // Fast bounding-box pre-filter (~25 km)
    if (Math.abs(v.latitude - latitude) > 0.25 || Math.abs(v.longitude - longitude) > 0.35) {
      continue;
    }
    const dist = haversineKm(latitude, longitude, v.latitude, v.longitude);
    if (dist < bestDist) {
      bestDist = dist;
      best = v;
    }
  }
  if (!best) return null;
  return { village: best, distanceKm: bestDist };
}

/**
 * Fast synchronous search across the cached 7,800+ offline Uzbekistan villages.
 */
export function searchOfflineVillages(
  normalizedQuery: string,
  activeRegion: 'all' | LocationRegionId = 'all',
  limit: number = 40
): VillageSearchResult[] {
  const villages = cachedVillages;
  if (!villages || villages.length === 0) return [];
  if (activeRegion === 'world') return [];

  if (!normalizedQuery) {
    if (activeRegion === 'all') return [];
    const regionItems: VillageSearchResult[] = [];
    for (let i = 0; i < villages.length && regionItems.length < limit; i++) {
      const v = villages[i];
      if (v.region !== activeRegion) continue;
      regionItems.push({
        cityName: v.name,
        countryName: 'Uzbekistan',
        latitude: v.latitude,
        longitude: v.longitude,
        timezone: v.timezone,
        region: v.region,
        isVillage: true,
        source: 'offline_village',
      });
    }
    return regionItems;
  }

  const exact: IndexedVillage[] = [];
  const prefix: IndexedVillage[] = [];
  const contains: IndexedVillage[] = [];

  for (let i = 0; i < villages.length; i++) {
    const v = villages[i];
    if (activeRegion !== 'all' && v.region !== activeRegion) continue;
    if (v.normName === normalizedQuery) {
      exact.push(v);
    } else if (v.normName.startsWith(normalizedQuery)) {
      if (prefix.length < limit) prefix.push(v);
    } else if (v.normName.includes(normalizedQuery)) {
      if (contains.length < limit) contains.push(v);
    }
  }

  const merged = [...exact, ...prefix, ...contains].slice(0, limit);
  return merged.map((v) => ({
    cityName: v.name,
    countryName: 'Uzbekistan',
    latitude: v.latitude,
    longitude: v.longitude,
    timezone: v.timezone,
    region: v.region,
    isVillage: true,
    source: 'offline_village',
  }));
}

export const UZ_ISO_TO_REGION: Record<string, LocationRegionId> = {
  'UZ-TK': 'uz_tashkent_city',
  'UZ-TO': 'uz_tashkent_region',
  'UZ-AN': 'uz_andijan',
  'UZ-FA': 'uz_fergana',
  'UZ-NG': 'uz_namangan',
  'UZ-SA': 'uz_samarkand',
  'UZ-BU': 'uz_bukhara',
  'UZ-JI': 'uz_jizzakh',
  'UZ-SI': 'uz_sirdaryo',
  'UZ-QA': 'uz_kashkadarya',
  'UZ-SU': 'uz_surkhandarya',
  'UZ-NW': 'uz_navoi',
  'UZ-XO': 'uz_khorezm',
  'UZ-QR': 'uz_karakalpakstan',
};

export function inferUzbekistanRegionFromText(stateText?: string): LocationRegionId | undefined {
  if (!stateText) return undefined;
  const s = normalizeLocationSearch(stateText);
  if (!s) return undefined;
  if (s.includes('toshkentsh') || s.includes('tashkentcity') || s === 'toshkent' || s === 'tashkent') {
    return 'uz_tashkent_city';
  }
  if (s.includes('toshkent') || s.includes('tashkent')) return 'uz_tashkent_region';
  if (s.includes('andij') || s.includes('andiz')) return 'uz_andijan';
  if (s.includes('fargon') || s.includes('fergan')) return 'uz_fergana';
  if (s.includes('namang')) return 'uz_namangan';
  if (s.includes('samark') || s.includes('samarq')) return 'uz_samarkand';
  if (s.includes('buxor') || s.includes('bukhar')) return 'uz_bukhara';
  if (s.includes('jizz') || s.includes('djiz') || s.includes('dzhiz')) return 'uz_jizzakh';
  if (s.includes('sirdar') || s.includes('syrdar')) return 'uz_sirdaryo';
  if (s.includes('kashkad') || s.includes('qashqad')) return 'uz_kashkadarya';
  if (s.includes('surxon') || s.includes('surkhan')) return 'uz_surkhandarya';
  if (s.includes('navoi')) return 'uz_navoi';
  if (s.includes('xorazm') || s.includes('khorezm')) return 'uz_khorezm';
  if (s.includes('korakalp') || s.includes('qoraqalp') || s.includes('karakalp')) {
    return 'uz_karakalpakstan';
  }
  return undefined;
}

const VALID_PHOTON_PLACE_VALUES = new Set([
  'village',
  'hamlet',
  'town',
  'city',
  'suburb',
  'quarter',
  'neighbourhood',
  'locality',
  'isolated_dwelling',
  'borough',
  'municipality',
  'district',
]);

/**
 * Live online village/town/settlement search powered by OpenStreetMap Photon
 * (with Open-Meteo Geocoding fallback). Covers any village, mahalla, or town
 * in Uzbekistan and worldwide even beyond the 7,800+ offline villages.
 */
export async function searchLocationsOnline(
  query: string,
  lang: AppLanguage,
  signal?: AbortSignal
): Promise<VillageSearchResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const results: VillageSearchResult[] = [];
  const seenKeys = new Set<string>();

  // 1. Primary: Photon (OpenStreetMap) biased toward Uzbekistan
  try {
    const controller = new AbortController();
    const onAbort = () => controller.abort();
    signal?.addEventListener('abort', onAbort, { once: true });
    const timeoutId = setTimeout(() => controller.abort(), 4200);

    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(trimmed)}&lat=41.3&lon=64.5&limit=12`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    signal?.removeEventListener('abort', onAbort);

    if (res.ok) {
      const data = await res.json();
      const features = Array.isArray(data?.features) ? data.features : [];
      for (const f of features) {
        const props = f?.properties || {};
        const coords = f?.geometry?.coordinates;
        if (!Array.isArray(coords) || coords.length < 2) continue;

        const osmKey = String(props.osm_key || '');
        const osmVal = String(props.osm_value || '');
        const pType = String(props.type || '');
        if (
          osmKey !== 'place' &&
          osmKey !== 'boundary' &&
          !VALID_PHOTON_PLACE_VALUES.has(osmVal) &&
          !VALID_PHOTON_PLACE_VALUES.has(pType)
        ) {
          continue;
        }

        const cc = String(props.countrycode || '').toUpperCase();
        const isUz = cc === 'UZ';
        const name = isUz
          ? cleanModernUzPlaceName(String(props.name || '').trim())
          : String(props.name || '').trim();
        if (!name) continue;

        const lng = Number(coords[0]);
        const lat = Number(coords[1]);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

        const uzRegion = isUz ? inferUzbekistanRegionFromText(props.state || props.county) : undefined;
        const countryName = isUz ? 'Uzbekistan' : String(props.country || 'World');
        const county = props.county ? cleanModernUzPlaceName(String(props.county)) : '';
        const state = props.state ? String(props.state) : '';
        const subtitleParts = [county, !uzRegion ? state : ''].filter(
          (p) => p && normalizeLocationSearch(p) !== normalizeLocationSearch(name)
        );

        const dedupKey = `${normalizeLocationSearch(name)}|${Math.round(lat * 20)}|${Math.round(lng * 20)}`;
        if (seenKeys.has(dedupKey)) continue;
        seenKeys.add(dedupKey);

        results.push({
          cityName: name,
          countryName,
          latitude: lat,
          longitude: lng,
          timezone: isUz ? getUzbekistanTimezone(uzRegion) : undefined,
          region: uzRegion || (isUz ? 'uz_tashkent_region' : 'world'),
          subtitle: subtitleParts.join(', ') || undefined,
          isVillage: osmVal === 'village' || osmVal === 'hamlet' || osmVal === 'isolated_dwelling' || osmVal === 'locality',
          source: 'online',
        });
      }
    }
  } catch {
    // Fall through to Open-Meteo fallback
  }

  // 2. Secondary fallback: Open-Meteo Geocoding (especially strong for GeoNames global villages + exact timezones)
  if (results.length < 3 && !signal?.aborted) {
    try {
      const controller = new AbortController();
      const onAbort = () => controller.abort();
      signal?.addEventListener('abort', onAbort, { once: true });
      const timeoutId = setTimeout(() => controller.abort(), 4200);

      const apiLang = lang === 'ru' ? 'ru' : 'en';
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=10&language=${apiLang}`;
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      signal?.removeEventListener('abort', onAbort);

      if (res.ok) {
        const data = await res.json();
        const items = Array.isArray(data?.results) ? data.results : [];
        for (const item of items) {
          const cc = String(item?.country_code || '').toUpperCase();
          const isUz = cc === 'UZ';
          const name = isUz
            ? cleanModernUzPlaceName(String(item?.name || '').trim())
            : String(item?.name || '').trim();
          const lat = Number(item?.latitude);
          const lng = Number(item?.longitude);
          if (!name || !Number.isFinite(lat) || !Number.isFinite(lng)) continue;

          const uzRegion = isUz ? inferUzbekistanRegionFromText(item?.admin1) : undefined;
          const countryName = isUz ? 'Uzbekistan' : String(item?.country || 'World');
          const admin2 = item?.admin2 ? String(item.admin2) : '';
          const admin1 = item?.admin1 ? String(item.admin1) : '';
          const subtitleParts = [admin2, !uzRegion ? admin1 : ''].filter(
            (p) => p && normalizeLocationSearch(p) !== normalizeLocationSearch(name)
          );

          const dedupKey = `${normalizeLocationSearch(name)}|${Math.round(lat * 20)}|${Math.round(lng * 20)}`;
          if (seenKeys.has(dedupKey)) continue;
          seenKeys.add(dedupKey);

          results.push({
            cityName: name,
            countryName,
            latitude: lat,
            longitude: lng,
            timezone: typeof item?.timezone === 'string' ? item.timezone : isUz ? getUzbekistanTimezone(uzRegion) : undefined,
            region: uzRegion || (isUz ? 'uz_tashkent_region' : 'world'),
            subtitle: subtitleParts.join(', ') || undefined,
            isVillage: item?.feature_code === 'PPL' || item?.feature_code === 'PPLX',
            source: 'online',
          });
        }
      }
    } catch {
      // Offline or aborted: return whatever we have
    }
  }

  // Prefer Uzbekistan results first
  results.sort((a, b) => {
    const aUz = a.countryName === 'Uzbekistan' ? 0 : 1;
    const bUz = b.countryName === 'Uzbekistan' ? 0 : 1;
    return aUz - bUz;
  });

  return results.slice(0, 12);
}
