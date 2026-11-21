import { AppLanguage, AsrMethod, CalcMethod, Coordinates, PrayerTimes } from '../types';
import {
  LocationEntry,
  LocationRegionId,
  REGION_MAP,
  UZBEKISTAN_LOCATIONS,
} from '../data/uzbekistanDistricts';
import { cyrillicToLatinUz, latinToCyrillicUz } from './uzbekScript';
import {
  findNearestOfflineVillage,
  getUzbekistanTimezone,
  inferUzbekistanRegionFromText,
  UZ_ISO_TO_REGION,
} from './uzbekistanVillages';

const WORLD_CITIES_RAW: Array<{
  cityName: string;
  countryName: string;
  latitude: number;
  longitude: number;
  timezone: string;
  labels: Record<AppLanguage, string>;
}> = [
  { cityName: 'Makkah', countryName: 'Saudi Arabia', latitude: 21.4225, longitude: 39.8262, timezone: 'Asia/Riyadh', labels: { uz_lat: 'Makka', uz_cyr: 'Макка', en: 'Makkah', ru: 'Мекка' } },
  { cityName: 'Madinah', countryName: 'Saudi Arabia', latitude: 24.5247, longitude: 39.5692, timezone: 'Asia/Riyadh', labels: { uz_lat: 'Madina', uz_cyr: 'Мадина', en: 'Madinah', ru: 'Медина' } },
  { cityName: 'Istanbul', countryName: 'Turkey', latitude: 41.0082, longitude: 28.9784, timezone: 'Europe/Istanbul', labels: { uz_lat: 'Istanbul', uz_cyr: 'Истанбул', en: 'Istanbul', ru: 'Стамбул' } },
  { cityName: 'Almaty', countryName: 'Kazakhstan', latitude: 43.2220, longitude: 76.8512, timezone: 'Asia/Almaty', labels: { uz_lat: 'Almati', uz_cyr: 'Алмати', en: 'Almaty', ru: 'Алматы' } },
  { cityName: 'Astana', countryName: 'Kazakhstan', latitude: 51.1694, longitude: 71.4491, timezone: 'Asia/Almaty', labels: { uz_lat: 'Ostona', uz_cyr: 'Остона', en: 'Astana', ru: 'Астана' } },
  { cityName: 'Bishkek', countryName: 'Kyrgyzstan', latitude: 42.8746, longitude: 74.5698, timezone: 'Asia/Bishkek', labels: { uz_lat: 'Bishkek', uz_cyr: 'Бишкек', en: 'Bishkek', ru: 'Бишкек' } },
  { cityName: 'Dushanbe', countryName: 'Tajikistan', latitude: 38.5598, longitude: 68.7870, timezone: 'Asia/Dushanbe', labels: { uz_lat: 'Dushanbe', uz_cyr: 'Душанбе', en: 'Dushanbe', ru: 'Душанбе' } },
  { cityName: 'Baku', countryName: 'Azerbaijan', latitude: 40.4093, longitude: 49.8671, timezone: 'Asia/Baku', labels: { uz_lat: 'Boku', uz_cyr: 'Боку', en: 'Baku', ru: 'Баку' } },
  { cityName: 'Cairo', countryName: 'Egypt', latitude: 30.0444, longitude: 31.2357, timezone: 'Africa/Cairo', labels: { uz_lat: 'Qohira', uz_cyr: 'Қоҳира', en: 'Cairo', ru: 'Каир' } },
  { cityName: 'Dubai', countryName: 'UAE', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai', labels: { uz_lat: 'Dubay', uz_cyr: 'Дубай', en: 'Dubai', ru: 'Дубай' } },
  { cityName: 'Moscow', countryName: 'Russia', latitude: 55.7558, longitude: 37.6173, timezone: 'Europe/Moscow', labels: { uz_lat: 'Moskva', uz_cyr: 'Москва', en: 'Moscow', ru: 'Москва' } },
  { cityName: 'London', countryName: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London', labels: { uz_lat: 'London', uz_cyr: 'Лондон', en: 'London', ru: 'Лондон' } },
  { cityName: 'New York', countryName: 'United States', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York', labels: { uz_lat: 'Nyu-York', uz_cyr: 'Нью-Йорк', en: 'New York', ru: 'Нью-Йорк' } },
  { cityName: 'Jakarta', countryName: 'Indonesia', latitude: -6.2088, longitude: 106.8456, timezone: 'Asia/Jakarta', labels: { uz_lat: 'Jakarta', uz_cyr: 'Жакарта', en: 'Jakarta', ru: 'Джакарта' } },
  { cityName: 'Kuala Lumpur', countryName: 'Malaysia', latitude: 3.1390, longitude: 101.6869, timezone: 'Asia/Kuala_Lumpur', labels: { uz_lat: 'Kuala-Lumpur', uz_cyr: 'Куала-Лумпур', en: 'Kuala Lumpur', ru: 'Куала-Лумпур' } },
];

const WORLD_LOCATIONS: LocationEntry[] = WORLD_CITIES_RAW.map((c) => ({
  ...c,
  region: 'world',
}));

export const CITIES: LocationEntry[] = [...UZBEKISTAN_LOCATIONS, ...WORLD_LOCATIONS];

const LOCATION_BY_CITY_NAME: Record<string, LocationEntry> = Object.fromEntries(
  CITIES.map((entry) => [entry.cityName, entry])
);

const COUNTRY_LOCALE_NAMES: Record<string, Record<AppLanguage, string>> = {
  Uzbekistan: { uz_lat: "O'zbekiston", uz_cyr: 'Ўзбекистон', en: 'Uzbekistan', ru: 'Узбекистан' },
  'Saudi Arabia': { uz_lat: 'Saudiya Arabistoni', uz_cyr: 'Саудия Арабистони', en: 'Saudi Arabia', ru: 'Саудовская Аравия' },
  Turkey: { uz_lat: 'Turkiya', uz_cyr: 'Туркия', en: 'Turkey', ru: 'Турция' },
  Kazakhstan: { uz_lat: "Qozog'iston", uz_cyr: 'Қозоғистон', en: 'Kazakhstan', ru: 'Казахстан' },
  Kyrgyzstan: { uz_lat: "Qirg'iziston", uz_cyr: 'Қирғизистон', en: 'Kyrgyzstan', ru: 'Киргизия' },
  Tajikistan: { uz_lat: 'Tojikiston', uz_cyr: 'Тожикистон', en: 'Tajikistan', ru: 'Таджикистан' },
  Azerbaijan: { uz_lat: 'Ozarbayjon', uz_cyr: 'Озарбайжон', en: 'Azerbaijan', ru: 'Азербайджан' },
  Egypt: { uz_lat: 'Misr', uz_cyr: 'Миср', en: 'Egypt', ru: 'Египет' },
  UAE: { uz_lat: 'BAA', uz_cyr: 'БАА', en: 'UAE', ru: 'ОАЭ' },
  Russia: { uz_lat: 'Rossiya', uz_cyr: 'Россия', en: 'Russia', ru: 'Россия' },
  'United Kingdom': { uz_lat: 'Buyuk Britaniya', uz_cyr: 'Буюк Британия', en: 'United Kingdom', ru: 'Великобритания' },
  'United States': { uz_lat: 'AQSh', uz_cyr: 'АҚШ', en: 'United States', ru: 'США' },
  Indonesia: { uz_lat: 'Indoneziya', uz_cyr: 'Индонезия', en: 'Indonesia', ru: 'Индонезия' },
  Malaysia: { uz_lat: 'Malayziya', uz_cyr: 'Малайзия', en: 'Malaysia', ru: 'Малайзия' },
};

export function normalizeLocationSearch(input: string): string {
  const latinized = /[А-Яа-яЁёЎўҚқҒғҲҳ]/.test(input) ? cyrillicToLatinUz(input) : input;
  return latinized
    .toLowerCase()
    .replace(/['‘’`ʼʻ"”]/g, '')
    .replace(/[-–—]+/g, ' ')
    .replace(/([cs])h/g, '$1\u0001')
    .replace(/h/g, 'x')
    .replace(/\u0001/g, 'h')
    .replace(/q/g, 'k')
    .replace(/\s+/g, ' ')
    .trim();
}

const LEGACY_UZ_PLACE_RENAMES: Record<string, string> = {
  toytepa: 'Nurafshon',
  'nurafshon toytepa': 'Nurafshon',
  'nurafshan toytepa': 'Nurafshon',
  nurafshan: 'Nurafshon',
};

export function cleanModernUzPlaceName(rawName: string): string {
  if (!rawName) return rawName;
  // Strip parenthetical legacy names returned by OSM Nominatim, e.g. "Nurafshon (Toytepa)" -> "Nurafshon"
  const stripped = rawName.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
  const normFull = normalizeLocationSearch(rawName);
  if (LEGACY_UZ_PLACE_RENAMES[normFull]) {
    return LEGACY_UZ_PLACE_RENAMES[normFull];
  }
  const normStripped = normalizeLocationSearch(stripped);
  if (LEGACY_UZ_PLACE_RENAMES[normStripped]) {
    return LEGACY_UZ_PLACE_RENAMES[normStripped];
  }
  return stripped || rawName.trim();
}

export function getLocalizedCityLabel(
  cityName: string,
  countryName: string,
  lang: AppLanguage,
  regionId?: string
): { city: string; country: string; region: string; searchTerms: string } {
  const canonicalCityName =
    countryName === 'Uzbekistan' ? cleanModernUzPlaceName(cityName) : cityName;
  const known = LOCATION_BY_CITY_NAME[canonicalCityName] || LOCATION_BY_CITY_NAME[cityName];
  const resolvedRegionId = (regionId || known?.region) as LocationRegionId | undefined;
  const regionDef = resolvedRegionId ? REGION_MAP[resolvedRegionId] : undefined;
  const cityVariants = known?.labels;
  const countryVariants = COUNTRY_LOCALE_NAMES[countryName];
  let city = cityVariants ? cityVariants[lang] : canonicalCityName;
  if (!cityVariants && countryName === 'Uzbekistan') {
    const hasCyrillic = /[А-Яа-яЁёЎўҚқҒғҲҳ]/.test(canonicalCityName);
    if (lang === 'uz_cyr' && !hasCyrillic) {
      city = latinToCyrillicUz(canonicalCityName);
    } else if (lang === 'uz_lat' && hasCyrillic) {
      city = cyrillicToLatinUz(canonicalCityName);
    }
  }
  const country = countryVariants ? countryVariants[lang] : countryName;
  const region = regionDef ? regionDef.fullLabel[lang] : '';

  const rawSearch = [
    cityName,
    countryName,
    ...(cityVariants ? Object.values(cityVariants) : []),
    ...(countryVariants ? Object.values(countryVariants) : []),
    ...(regionDef ? Object.values(regionDef.fullLabel) : []),
    ...(regionDef ? Object.values(regionDef.shortLabel) : []),
    known?.aliases || '',
  ].join(' ');

  return {
    city,
    country,
    region,
    searchTerms: normalizeLocationSearch(rawSearch),
  };
}

// Kaaba coordinates
const KAABA_LAT = 21.422487;
const KAABA_LNG = 39.826206;

export function calculateQibla(latitude: number, longitude: number): { bearing: number; distanceKm: number } {
  const phi1 = (latitude * Math.PI) / 180;
  const phi2 = (KAABA_LAT * Math.PI) / 180;
  const deltaLambda = ((KAABA_LNG - longitude) * Math.PI) / 180;

  const y = Math.sin(deltaLambda);
  const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda);
  let qibla = (Math.atan2(y, x) * 180) / Math.PI;
  qibla = (qibla + 360) % 360;

  // Great circle distance in KM
  const R = 6371; // Earth radius in km
  const deltaPhi = ((KAABA_LAT - latitude) * Math.PI) / 180;
  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = Math.round(R * c);

  return { bearing: Math.round(qibla), distanceKm };
}

export function getTimezoneOffsetHours(date: Date, timeZone?: string, fallbackLng?: number): number {
  if (timeZone) {
    try {
      const utcStr = date.toLocaleString('en-US', { timeZone: 'UTC' });
      const tzStr = date.toLocaleString('en-US', { timeZone });
      return (new Date(tzStr).getTime() - new Date(utcStr).getTime()) / 3600000;
    } catch {
      // Fallback below
    }
  }
  if (fallbackLng !== undefined) {
    return Math.round(fallbackLng / 15);
  }
  return -date.getTimezoneOffset() / 60;
}

export function getCityCurrentDate(date: Date = new Date(), timeZone?: string): Date {
  if (!timeZone) return date;
  try {
    const tzStr = date.toLocaleString('en-US', { timeZone });
    return new Date(tzStr);
  } catch {
    return date;
  }
}

// Astronomical prayer time calculation
export interface PrayerAdjustments {
  fajr: number;
  sunrise: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
  hijriDays: number;
}

const ADJUSTMENTS_STORAGE_KEY = 'nq_prayer_adjustments';

export const DEFAULT_PRAYER_ADJUSTMENTS: PrayerAdjustments = {
  fajr: 0,
  sunrise: 0,
  dhuhr: 0,
  asr: 0,
  maghrib: 0,
  isha: 0,
  hijriDays: 0,
};

function clampAdj(val: unknown, min: number, max: number): number {
  const num = typeof val === 'number' && Number.isFinite(val) ? Math.round(val) : 0;
  return Math.max(min, Math.min(max, num));
}

export function loadPrayerAdjustments(): PrayerAdjustments {
  try {
    const raw = localStorage.getItem(ADJUSTMENTS_STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<PrayerAdjustments>;
      return {
        fajr: clampAdj(p.fajr, -15, 15),
        sunrise: clampAdj(p.sunrise, -15, 15),
        dhuhr: clampAdj(p.dhuhr, -15, 15),
        asr: clampAdj(p.asr, -15, 15),
        maghrib: clampAdj(p.maghrib, -15, 15),
        isha: clampAdj(p.isha, -15, 15),
        hijriDays: clampAdj(p.hijriDays, -2, 2),
      };
    }
  } catch {
    // Ignore storage error
  }
  return { ...DEFAULT_PRAYER_ADJUSTMENTS };
}

export function savePrayerAdjustments(next: PrayerAdjustments): void {
  const sanitized: PrayerAdjustments = {
    fajr: clampAdj(next.fajr, -15, 15),
    sunrise: clampAdj(next.sunrise, -15, 15),
    dhuhr: clampAdj(next.dhuhr, -15, 15),
    asr: clampAdj(next.asr, -15, 15),
    maghrib: clampAdj(next.maghrib, -15, 15),
    isha: clampAdj(next.isha, -15, 15),
    hijriDays: clampAdj(next.hijriDays, -2, 2),
  };
  try {
    localStorage.setItem(ADJUSTMENTS_STORAGE_KEY, JSON.stringify(sanitized));
    window.dispatchEvent(new Event('nq:prayer-adjustments-changed'));
  } catch {
    // Ignore storage error
  }
}

function computeSolarPosition(
  year: number,
  month: number,
  day: number,
  tzOffsetHours: number
): { declination: number; eotHours: number } {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const jd =
    Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + B - 1524.5;
  // Julian days since J2000.0 evaluated near local solar noon
  const D = jd + (12 - tzOffsetHours) / 24 - 2451545.0;

  const g = ((((357.529 + 0.98560028 * D) % 360) + 360) % 360) * (Math.PI / 180);
  const q = (((280.459 + 0.98564736 * D) % 360) + 360) % 360;
  const L = (((q + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) % 360) + 360) % 360;
  const Lrad = L * (Math.PI / 180);
  const e = (23.439 - 0.00000036 * D) * (Math.PI / 180);

  let ra = (Math.atan2(Math.cos(e) * Math.sin(Lrad), Math.cos(Lrad)) * 180) / Math.PI / 15;
  ra = ((ra % 24) + 24) % 24;
  const declination = (Math.asin(Math.sin(e) * Math.sin(Lrad)) * 180) / Math.PI;

  let eotHours = q / 15 - ra;
  if (eotHours > 12) eotHours -= 24;
  if (eotHours < -12) eotHours += 24;

  return { declination, eotHours };
}

export function calculatePrayerTimes(
  date: Date,
  lat: number,
  lng: number,
  method: CalcMethod = 'Uzbekistan',
  asrMethod: AsrMethod = 'Hanafi',
  timeZone?: string,
  adjustments?: PrayerAdjustments
): PrayerTimes {
  const adj = adjustments ?? loadPrayerAdjustments();
  const cityDate = getCityCurrentDate(date, timeZone);

  // City's actual timezone offset in hours
  const tzOffset = getTimezoneOffsetHours(date, timeZone, lng);

  // High-precision Meeus/NOAA solar declination & Equation of Time
  const { declination, eotHours } = computeSolarPosition(
    cityDate.getFullYear(),
    cityDate.getMonth() + 1,
    cityDate.getDate(),
    tzOffset
  );

  // True Solar Noon in fractional local hours
  const solarNoon = 12 + tzOffset - lng / 15 - eotHours;

  // Calculation parameters for Fajr and Isha angle
  let fajrAngle = 15.5;
  let ishaAngle = 15;
  if (method === 'MWL') { fajrAngle = 18; ishaAngle = 17; }
  else if (method === 'ISNA') { fajrAngle = 15; ishaAngle = 15; }
  else if (method === 'Egypt') { fajrAngle = 19.5; ishaAngle = 17.5; }
  else if (method === 'Makkah') { fajrAngle = 18.5; ishaAngle = 19; }
  else if (method === 'Karachi') { fajrAngle = 18; ishaAngle = 18; }
  else if (method === 'Uzbekistan') { fajrAngle = 15.5; ishaAngle = 15; }

  const sunriseHour = solarNoon - hourAngle(lat, declination, -0.8333) / 15 + adj.sunrise / 60;
  const sunsetHour = solarNoon + hourAngle(lat, declination, -0.8333) / 15;

  const fajrHour = solarNoon - hourAngle(lat, declination, -fajrAngle) / 15 + adj.fajr / 60;
  const ishaHour = solarNoon + hourAngle(lat, declination, -ishaAngle) / 15 + adj.isha / 60;

  // Asr calculation
  const asrShadow = asrMethod === 'Hanafi' ? 2 : 1;
  const phi = (lat * Math.PI) / 180;
  const delta = (declination * Math.PI) / 180;
  const asrAltitude = (Math.atan(1 / (asrShadow + Math.tan(Math.abs(phi - delta)))) * 180) / Math.PI;
  const asrHour = solarNoon + hourAngle(lat, declination, asrAltitude) / 15 + adj.asr / 60;

  // Fiqh precaution buffers: +2m after solar noon (Zawal), +2m after sunset
  const dhuhrHour = solarNoon + 2 / 60 + adj.dhuhr / 60;
  const maghribHour = sunsetHour + 2 / 60 + adj.maghrib / 60;
  const imsakHour = fajrHour - 10 / 60;
  const midnightHour = maghribHour + (sunriseHour + 24 - maghribHour) / 2;

  return {
    imsak: formatTime(imsakHour),
    fajr: formatTime(fajrHour),
    sunrise: formatTime(sunriseHour),
    dhuhr: formatTime(dhuhrHour),
    asr: formatTime(asrHour),
    maghrib: formatTime(maghribHour),
    isha: formatTime(ishaHour),
    midnight: formatTime(midnightHour % 24),
  };
}

function hourAngle(lat: number, declination: number, altitude: number): number {
  const phi = (lat * Math.PI) / 180;
  const delta = (declination * Math.PI) / 180;
  const alpha = (altitude * Math.PI) / 180;

  const cosH = (Math.sin(alpha) - Math.sin(phi) * Math.sin(delta)) / (Math.cos(phi) * Math.cos(delta));
  const clampedCosH = Math.max(-1, Math.min(1, cosH));
  return (Math.acos(clampedCosH) * 180) / Math.PI;
}

function formatTime(hours: number): string {
  const normalized = (hours % 24 + 24) % 24;
  const totalMinutes = Math.round(normalized * 60) % 1440;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export interface NextPrayerInfo {
  name: string;
  arabicName: string;
  timeStr: string;
  timeLeftStr: string;
  progressPercent: number;
  isPassed: boolean;
  nextId: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  activeId: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  activeName: string;
  activeArabicName: string;
  activeTimeStr: string;
}

export interface SacredWindows {
  duhaStart: string;
  duhaEnd: string;
  sunriseMakruhEnd: string;
  zawalStart: string;
  sunsetMakruhStart: string;
  lastThirdNight: string;
  currentMakruh: 'sunrise' | 'zawal' | 'sunset' | null;
  isDuhaActive: boolean;
  isTahajjudActive: boolean;
}

function parseTimeMin(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function formatMinHHMM(totalMin: number): string {
  const norm = ((Math.round(totalMin) % 1440) + 1440) % 1440;
  const h = Math.floor(norm / 60);
  const m = norm % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function computeSacredWindows(
  prayers: PrayerTimes,
  currentTime: Date = new Date(),
  timeZone?: string
): SacredWindows {
  const cityNow = getCityCurrentDate(currentTime, timeZone);
  const nowMin = cityNow.getHours() * 60 + cityNow.getMinutes();

  const fajrMin = parseTimeMin(prayers.fajr);
  const sunriseMin = parseTimeMin(prayers.sunrise);
  const dhuhrMin = parseTimeMin(prayers.dhuhr);
  const maghribMin = parseTimeMin(prayers.maghrib);

  const sunriseMakruhEndMin = sunriseMin + 16;
  const duhaStartMin = sunriseMin + 18;
  const zawalStartMin = dhuhrMin - 10;
  const sunsetMakruhStartMin = maghribMin - 12;

  const nightDurationMin = fajrMin >= maghribMin ? fajrMin - maghribMin : fajrMin + 1440 - maghribMin;
  const lastThirdMin = (maghribMin + (nightDurationMin * 2) / 3) % 1440;

  let currentMakruh: SacredWindows['currentMakruh'] = null;
  if (nowMin >= sunriseMin && nowMin < sunriseMakruhEndMin) {
    currentMakruh = 'sunrise';
  } else if (nowMin >= zawalStartMin && nowMin < dhuhrMin) {
    currentMakruh = 'zawal';
  } else if (nowMin >= sunsetMakruhStartMin && nowMin < maghribMin) {
    currentMakruh = 'sunset';
  }

  const isDuhaActive = nowMin >= duhaStartMin && nowMin < zawalStartMin;
  const isTahajjudActive =
    lastThirdMin > fajrMin
      ? nowMin >= lastThirdMin || nowMin < fajrMin
      : nowMin >= lastThirdMin && nowMin < fajrMin;

  return {
    duhaStart: formatMinHHMM(duhaStartMin),
    duhaEnd: formatMinHHMM(zawalStartMin),
    sunriseMakruhEnd: formatMinHHMM(sunriseMakruhEndMin),
    zawalStart: formatMinHHMM(zawalStartMin),
    sunsetMakruhStart: formatMinHHMM(sunsetMakruhStartMin),
    lastThirdNight: formatMinHHMM(lastThirdMin),
    currentMakruh,
    isDuhaActive,
    isTahajjudActive,
  };
}

export function getNextPrayer(
  prayers: PrayerTimes,
  currentTime: Date = new Date(),
  timeZone?: string
): NextPrayerInfo {
  const cityNow = getCityCurrentDate(currentTime, timeZone);

  const list = [
    { id: 'fajr' as const, name: "Fajr", arabic: "الفجر", time: prayers.fajr },
    { id: 'sunrise' as const, name: "Sunrise", arabic: "الشروق", time: prayers.sunrise },
    { id: 'dhuhr' as const, name: "Dhuhr", arabic: "الظهر", time: prayers.dhuhr },
    { id: 'asr' as const, name: "Asr", arabic: "العصر", time: prayers.asr },
    { id: 'maghrib' as const, name: "Maghrib", arabic: "المغرب", time: prayers.maghrib },
    { id: 'isha' as const, name: "Isha", arabic: "العشاء", time: prayers.isha }
  ];

  const nowMin = cityNow.getHours() * 60 + cityNow.getMinutes() + cityNow.getSeconds() / 60;

  let next = list.find(p => {
    const [h, m] = p.time.split(':').map(Number);
    return h * 60 + m > nowMin;
  });

  let prev = list[list.length - 1];
  let isNextTomorrow = false;

  if (!next) {
    next = list[0]; // Fajr tomorrow
    isNextTomorrow = true;
  }

  for (let i = list.length - 1; i >= 0; i--) {
    const [h, m] = list[i].time.split(':').map(Number);
    if (h * 60 + m <= nowMin) {
      prev = list[i];
      break;
    }
  }

  const [nextH, nextM] = next.time.split(':').map(Number);
  const nextMin = isNextTomorrow ? (nextH + 24) * 60 + nextM : nextH * 60 + nextM;
  const diffMin = Math.max(0, nextMin - nowMin);

  const hoursLeft = Math.floor(diffMin / 60);
  const minsLeft = Math.floor(diffMin % 60);
  const secsLeft = Math.floor((diffMin * 60) % 60);

  const [prevH, prevM] = prev.time.split(':').map(Number);
  const prevMin = prevH * 60 + prevM;
  const totalWindow = nextMin >= prevMin ? Math.max(1, nextMin - prevMin) : (24 * 60 - prevMin) + nextMin;
  const elapsed = nowMin >= prevMin ? nowMin - prevMin : (24 * 60 - prevMin) + nowMin;
  const progressPercent = Math.min(100, Math.max(0, (elapsed / totalWindow) * 100));

  return {
    name: next.name,
    arabicName: next.arabic,
    timeStr: next.time,
    timeLeftStr: `${hoursLeft.toString().padStart(2, '0')}:${minsLeft.toString().padStart(2, '0')}:${secsLeft.toString().padStart(2, '0')}`,
    progressPercent,
    isPassed: false,
    nextId: next.id,
    activeId: prev.id,
    activeName: prev.id === 'sunrise' ? 'Duha (Post-Sunrise)' : prev.name,
    activeArabicName: prev.id === 'sunrise' ? 'الضحى' : prev.arabic,
    activeTimeStr: prev.time
  };
}

const HIJRI_MONTHS: Record<AppLanguage, string[]> = {
  uz_lat: [
    'Muharram', 'Safar', "Rabiul avval", "Rabiul oxir",
    'Jumadul avval', 'Jumadul oxir', 'Rajab', "Sha'bon",
    'Ramazon', 'Shavvol', 'Zulqa’da', 'Zulhijja',
  ],
  uz_cyr: [
    'Муҳаррам', 'Сафар', 'Рабиул аввал', 'Рабиул охир',
    'Жумадул аввал', 'Жумадул охир', 'Ражаб', 'Шаъбон',
    'Рамазон', 'Шаввол', 'Зулқаъда', 'Зулҳижжа',
  ],
  en: [
    'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
    'Jumada al-Awwal', 'Jumada al-Akhirah', 'Rajab', "Sha'ban",
    'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah',
  ],
  ru: [
    'Мухаррам', 'Сафар', 'Раби аль-авваль', 'Раби ас-сани',
    'Джумада аль-уля', 'Джумада аль-ахира', 'Раджаб', 'Шаабан',
    'Рамадан', 'Шавваль', 'Зуль-када', 'Зуль-хиджа',
  ],
};

function computeTabularHijri(date: Date): { day: number; month: number; year: number } {
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();

  let m = month + 1;
  let y = year;
  if (m < 3) {
    y -= 1;
    m += 12;
  }

  let a = Math.floor(y / 100);
  let b = 2 - a + Math.floor(a / 4);
  if (y < 1583) b = 0;
  if (y === 1582) {
    if (m > 10) b = -10;
    if (m === 10) {
      b = 0;
      if (day > 4) b = -10;
    }
  }

  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524;
  const iyear = 10631 / 30;
  const epochastro = 1948084;
  const shift1 = 8.01 / 60;

  let z = jd - epochastro;
  const cyc = Math.floor(z / 10631);
  z -= 10631 * cyc;
  const j = Math.floor((z - shift1) / iyear);
  const iy = 30 * cyc + j;
  z -= Math.floor(j * iyear + shift1);
  let im = Math.floor((z + 28.5001) / 29.5);
  if (im === 13) im = 12;
  const id = z - Math.floor(29.5001 * im - 29);

  return { day: id, month: im, year: iy };
}

export function getHijriParts(
  date: Date = new Date(),
  respectAdjustment: boolean = true
): { day: number; month: number; year: number } {
  const hijriOffsetDays = respectAdjustment ? loadPrayerAdjustments().hijriDays : 0;
  const targetDate = hijriOffsetDays !== 0 ? new Date(date.getTime() + hijriOffsetDays * 86400000) : date;

  try {
    const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }).formatToParts(targetDate);

    const pYear = Number(parts.find((p) => p.type === 'year')?.value);
    const pMonth = Number(parts.find((p) => p.type === 'month')?.value);
    const pDay = Number(parts.find((p) => p.type === 'day')?.value);

    if (pYear > 1300 && pYear < 1800 && pMonth >= 1 && pMonth <= 12 && pDay >= 1) {
      return { day: pDay, month: pMonth, year: pYear };
    }
  } catch {
    // Fall back to tabular calculation below
  }

  return computeTabularHijri(targetDate);
}

export function getHijriMonthsList(lang: AppLanguage): string[] {
  return HIJRI_MONTHS[lang];
}

export function getHijriDate(
  date: Date = new Date(),
  lang: AppLanguage = 'en',
  respectAdjustment: boolean = true
): string {
  const { day, month, year } = getHijriParts(date, respectAdjustment);
  const mName = HIJRI_MONTHS[lang][Math.max(0, Math.min(11, month - 1))];
  return `${day} ${mName}, ${year}`;
}

function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
}

export function findNearestCity(latitude: number, longitude: number): LocationEntry {
  let best = CITIES[0];
  let bestDist = Infinity;

  for (const city of CITIES) {
    const dist = haversineDistanceKm(latitude, longitude, city.latitude, city.longitude);
    if (dist < bestDist) {
      bestDist = dist;
      best = city;
    }
  }
  return best;
}

export async function resolveRegionFromCoords(
  latitude: number,
  longitude: number,
  lang: AppLanguage = 'uz_lat'
): Promise<{
  cityName: string;
  countryName: string;
  timezone?: string;
  region?: LocationRegionId;
  subtitle?: string;
}> {
  const nearestCity = findNearestCity(latitude, longitude);
  const nearestCityDistKm = haversineDistanceKm(
    latitude,
    longitude,
    nearestCity.latitude,
    nearestCity.longitude
  );
  const nearestVillageHit = await findNearestOfflineVillage(latitude, longitude);
  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone || nearestCity.timezone;

  const preferOfflineVillage = Boolean(
    nearestVillageHit &&
      nearestVillageHit.distanceKm < 6.0 &&
      nearestVillageHit.distanceKm < nearestCityDistKm &&
      nearestCityDistKm > 3.5
  );

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);
    const acceptLang = lang === 'ru' ? 'ru' : lang === 'en' ? 'en' : 'uz';
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=${acceptLang}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const addr = data?.address || {};
      const cc = String(addr.country_code || '').toLowerCase();
      const isUz = cc === 'uz';

      const iso4 = typeof addr['ISO3166-2-lvl4'] === 'string' ? addr['ISO3166-2-lvl4'].toUpperCase() : '';
      const resolvedUzRegion: LocationRegionId | undefined = isUz
        ? UZ_ISO_TO_REGION[iso4] ||
          inferUzbekistanRegionFromText(addr.state || addr.county) ||
          nearestVillageHit?.village.region ||
          (nearestCity.countryName === 'Uzbekistan' ? nearestCity.region : undefined)
        : undefined;

      const explicitVillage: string =
        addr.village ||
        addr.hamlet ||
        addr.isolated_dwelling ||
        (isUz && resolvedUzRegion !== 'uz_tashkent_city'
          ? addr.neighbourhood || addr.quarter || addr.suburb || ''
          : '');
      const explicitCityOrTown: string =
        addr.town ||
        (isUz && resolvedUzRegion === 'uz_tashkent_city' ? addr.suburb || addr.district : '') ||
        addr.city ||
        addr.municipality ||
        '';
      const explicitBroadLocality: string =
        addr.county || addr.state_district || addr.state || '';

      let chosenName = cleanModernUzPlaceName(
        explicitVillage || explicitCityOrTown || explicitBroadLocality
      );

      // If Nominatim only returned a broad district/county (or if we are in a distinct rural village outside a city center),
      // use the exact offline GeoNames village when the user is directly inside it.
      if (
        !explicitVillage &&
        isUz &&
        resolvedUzRegion !== 'uz_tashkent_city' &&
        nearestVillageHit &&
        nearestVillageHit.distanceKm <= 2.5 &&
        nearestVillageHit.distanceKm < nearestCityDistKm &&
        (!explicitCityOrTown || nearestCityDistKm > 2.5)
      ) {
        chosenName = cleanModernUzPlaceName(nearestVillageHit.village.name);
      }

      if (!chosenName) {
        chosenName = cleanModernUzPlaceName(
          preferOfflineVillage && nearestVillageHit
            ? nearestVillageHit.village.name
            : nearestCity.cityName
        );
      }

      const countyLabel = typeof addr.county === 'string' ? cleanModernUzPlaceName(addr.county) : '';
      const subtitle =
        countyLabel && normalizeLocationSearch(countyLabel) !== normalizeLocationSearch(chosenName)
          ? countyLabel
          : undefined;

      return {
        cityName: chosenName,
        countryName: isUz ? 'Uzbekistan' : addr.country || nearestCity.countryName,
        timezone: isUz ? getUzbekistanTimezone(resolvedUzRegion) : localTz,
        region: resolvedUzRegion || (isUz ? 'uz_tashkent_region' : 'world'),
        subtitle,
      };
    }
  } catch {
    // Offline or timeout: fall back cleanly to nearest offline village or district
  }

  if (preferOfflineVillage && nearestVillageHit) {
    return {
      cityName: nearestVillageHit.village.name,
      countryName: 'Uzbekistan',
      timezone: nearestVillageHit.village.timezone,
      region: nearestVillageHit.village.region,
    };
  }

  return {
    cityName: nearestCity.cityName,
    countryName: nearestCity.countryName,
    timezone: nearestCity.timezone || localTz,
    region: nearestCity.region,
  };
}

export interface CalcMethodOption {
  id: CalcMethod;
  label: string;
  angles: string;
}

type SupportedCalcMethod = 'Uzbekistan' | 'MWL' | 'Makkah' | 'Egypt' | 'ISNA' | 'Karachi';

const CALC_METHOD_LABELS: Record<SupportedCalcMethod, Record<AppLanguage, string>> = {
  Uzbekistan: {
    uz_lat: "O'zbekiston Musulmonlari Idorasi (O'MI)",
    uz_cyr: 'Ўзбекистон Мусулмонлари Идораси (ЎМИ)',
    en: "Muslim Board of Uzbekistan (O'MI)",
    ru: 'Управление мусульман Узбекистана (УМУ)',
  },
  MWL: {
    uz_lat: 'Butunjahon Islom Ligasi (MWL)',
    uz_cyr: 'Бутунжаҳон Ислом Лигаси (MWL)',
    en: 'Muslim World League (MWL)',
    ru: 'Всемирная исламская лига (MWL)',
  },
  Makkah: {
    uz_lat: 'Umm al-Quro universiteti, Makka',
    uz_cyr: 'Умм ал-Қуро университети, Макка',
    en: 'Umm Al-Qura University, Makkah',
    ru: 'Умм аль-Кура, Мекка',
  },
  Egypt: {
    uz_lat: 'Misr Bosh Boshqarmasi',
    uz_cyr: 'Миср Бош Бошқармаси',
    en: 'Egyptian General Authority',
    ru: 'Египетское управление',
  },
  ISNA: {
    uz_lat: 'ISNA (Shimoliy Amerika)',
    uz_cyr: 'ISNA (Шимолий Америка)',
    en: 'ISNA (North America)',
    ru: 'ISNA (Северная Америка)',
  },
  Karachi: {
    uz_lat: 'Karochi Islom fanlari universiteti',
    uz_cyr: 'Карочи Ислом фанлари университети',
    en: 'Univ. of Islamic Sciences, Karachi',
    ru: 'Исламский университет, Карачи',
  },
};

const CALC_METHOD_ANGLES: Record<SupportedCalcMethod, string> = {
  Uzbekistan: '15.5° / 15°',
  MWL: '18° / 17°',
  Makkah: '18.5° / 19°',
  Egypt: '19.5° / 17.5°',
  ISNA: '15° / 15°',
  Karachi: '18° / 18°',
};

export function getCalcMethodOptions(language: AppLanguage): CalcMethodOption[] {
  return (['Uzbekistan', 'MWL', 'Makkah', 'Egypt', 'ISNA', 'Karachi'] as SupportedCalcMethod[]).map((id) => ({
    id,
    label: `${CALC_METHOD_LABELS[id][language]} (${CALC_METHOD_ANGLES[id]})`,
    angles: CALC_METHOD_ANGLES[id],
  }));
}

function approxGregorianFromHijri(hYear: number, hMonth: number, hDay: number): Date {
  const jd =
    Math.floor((11 * hYear + 3) / 30) +
    354 * hYear +
    30 * hMonth -
    Math.floor((hMonth - 1) / 2) +
    hDay +
    1948440 -
    385;

  let l = jd + 68569;
  const n = Math.floor((4 * l) / 146097);
  l = l - Math.floor((146097 * n + 3) / 4);
  const i = Math.floor((4000 * (l + 1)) / 1461001);
  l = l - Math.floor((1461 * i) / 4) + 31;
  const j = Math.floor((80 * l) / 2447);
  const gDay = l - Math.floor((2447 * j) / 80);
  l = Math.floor(j / 11);
  const gMonth = j + 2 - 12 * l;
  const gYear = 100 * (n - 49) + i + l;

  return new Date(gYear, gMonth - 1, gDay, 12, 0, 0);
}

/** Converts a Hijri date (year, month 1..12, day 1..30) to exact matching Gregorian Date. */
export function hijriToGregorian(hYear: number, hMonth: number, hDay: number): Date {
  const clampedMonth = Math.max(1, Math.min(12, Math.floor(hMonth)));
  const clampedDay = Math.max(1, Math.min(30, Math.floor(hDay)));
  const base = approxGregorianFromHijri(hYear, clampedMonth, clampedDay);

  for (let delta = 0; delta <= 5; delta++) {
    const offsets = delta === 0 ? [0] : [-delta, delta];
    for (const off of offsets) {
      const candidate = new Date(base.getTime());
      candidate.setDate(base.getDate() + off);
      const parts = getHijriParts(candidate);
      if (parts.year === hYear && parts.month === clampedMonth && parts.day === clampedDay) {
        return candidate;
      }
    }
  }

  // If 30 was requested in a 29-day Hijri month, fall back to day 29
  if (clampedDay === 30) {
    return hijriToGregorian(hYear, clampedMonth, 29);
  }
  return base;
}

export interface IslamicSpecialDate {
  id: string;
  hDay: number;
  hMonth: number;
  hYear: number;
  hijriLabel: string;
  title: string;
  description: string;
  gregorianDate: Date;
}

const SPECIAL_ISLAMIC_EVENTS: Array<{
  id: string;
  hDay: number;
  hMonth: number;
  titles: Record<AppLanguage, string>;
  descs: Record<AppLanguage, string>;
}> = [
  {
    id: 'hijri-new-year',
    hDay: 1,
    hMonth: 1,
    titles: {
      uz_lat: 'Hijriy Yangi yil',
      uz_cyr: 'Ҳижрий Янги йил',
      en: 'Islamic New Year',
      ru: 'Исламский Новый год',
    },
    descs: {
      uz_lat: 'Muharram oyining birinchi kuni',
      uz_cyr: 'Муҳаррам ойининг биринчи куни',
      en: 'First day of Muharram',
      ru: 'Первый день месяца Мухаррам',
    },
  },
  {
    id: 'ashura',
    hDay: 10,
    hMonth: 1,
    titles: {
      uz_lat: 'Ashuro kuni',
      uz_cyr: 'Ашуро куни',
      en: 'Day of Ashura',
      ru: 'День Ашура',
    },
    descs: {
      uz_lat: 'Sunnat ro‘za va shukrona kuni',
      uz_cyr: 'Суннат рўза ва шукрона куни',
      en: 'Recommended day of voluntary fasting',
      ru: 'День желательного поста',
    },
  },
  {
    id: 'mawlid',
    hDay: 12,
    hMonth: 3,
    titles: {
      uz_lat: 'Mavlid an-Nabiy ﷺ',
      uz_cyr: 'Мавлид ан-Набий ﷺ',
      en: 'Mawlid al-Nabi ﷺ',
      ru: 'Мавлид ан-Наби ﷺ',
    },
    descs: {
      uz_lat: 'Payg‘ambarimiz ﷺ tavallud oylari',
      uz_cyr: 'Пайғамбаримиз ﷺ таваллуд ойлари',
      en: 'Commemoration of the Prophet’s ﷺ birth month',
      ru: 'Памятная дата рождения Пророка ﷺ',
    },
  },
  {
    id: 'rajab-start',
    hDay: 1,
    hMonth: 7,
    titles: {
      uz_lat: 'Rajab oyi boshi',
      uz_cyr: 'Ражаб ойи боши',
      en: 'Start of Rajab',
      ru: 'Начало месяца Раджаб',
    },
    descs: {
      uz_lat: 'Muborak uch oylarning boshlanishi',
      uz_cyr: 'Муборак уч ойларнинг бошланиши',
      en: 'Beginning of the sacred month of Rajab',
      ru: 'Начало священного месяца Раджаб',
    },
  },
  {
    id: 'isra-miraj',
    hDay: 27,
    hMonth: 7,
    titles: {
      uz_lat: 'Isro va Me’roj kechasi',
      uz_cyr: 'Исро ва Меърож кечаси',
      en: 'Isra and Mi’raj',
      ru: 'Ночь Исра и Мирадж',
    },
    descs: {
      uz_lat: 'Besh vaqt namoz farz qilingan kecha',
      uz_cyr: 'Беш вақт намоз фарз қилинган кеча',
      en: 'Night Journey & gift of daily prayers',
      ru: 'Ночь Вознесения и дарования намаза',
    },
  },
  {
    id: 'shaban-barah',
    hDay: 15,
    hMonth: 8,
    titles: {
      uz_lat: 'Baroat kechasi',
      uz_cyr: 'Бароат кечаси',
      en: 'Mid-Sha’ban (Bara’ah)',
      ru: 'Ночь Бараат (15 Шаабана)',
    },
    descs: {
      uz_lat: 'Mag‘firat va duo kechasi',
      uz_cyr: 'Мағфират ва дуо кечаси',
      en: 'Blessed night of mercy and forgiveness',
      ru: 'Благословенная ночь прощения и дуа',
    },
  },
  {
    id: 'ramadan-start',
    hDay: 1,
    hMonth: 9,
    titles: {
      uz_lat: 'Ramazon oyi boshi',
      uz_cyr: 'Рамазон ойи боши',
      en: 'Start of Ramadan',
      ru: 'Начало Рамадана',
    },
    descs: {
      uz_lat: 'Ro‘za va Qur’on oyining ilk kuni',
      uz_cyr: 'Рўза ва Қуръон ойининг илк куни',
      en: 'First day of fasting in Ramadan',
      ru: 'Первый день священного поста',
    },
  },
  {
    id: 'laylatul-qadr',
    hDay: 27,
    hMonth: 9,
    titles: {
      uz_lat: 'Qadr kechasi (27-kecha)',
      uz_cyr: 'Қадр кечаси (27-кеча)',
      en: 'Laylatul Qadr (27th Night)',
      ru: 'Ночь предопределения (27 Рамадана)',
    },
    descs: {
      uz_lat: 'Ming oydan yaxshiroq muborak tun',
      uz_cyr: 'Минг ойдан яхшироқ муборак тун',
      en: 'Night better than a thousand months',
      ru: 'Ночь, лучшая тысячи месяцев',
    },
  },
  {
    id: 'eid-fitr',
    hDay: 1,
    hMonth: 10,
    titles: {
      uz_lat: 'Ramazon hayiti (Iydul Fitr)',
      uz_cyr: 'Рамазон ҳайити (Ийдул Фитр)',
      en: 'Eid al-Fitr',
      ru: 'Ураза-байрам (Ид аль-Фитр)',
    },
    descs: {
      uz_lat: 'Muborak Ramazon yakuni bayrami',
      uz_cyr: 'Муборак Рамазон якуни байрами',
      en: 'Festival of breaking the fast',
      ru: 'Праздник разговения',
    },
  },
  {
    id: 'arafah',
    hDay: 9,
    hMonth: 12,
    titles: {
      uz_lat: 'Arafa kuni',
      uz_cyr: 'Арафа куни',
      en: 'Day of Arafah',
      ru: 'День Арафа',
    },
    descs: {
      uz_lat: 'Hajning eng ulug‘ rukni va duo kuni',
      uz_cyr: 'Ҳажнинг энг улуғ рукни ва дуо куни',
      en: 'Peak day of Hajj and recommended fasting',
      ru: 'Великий день стояния на Арафате',
    },
  },
  {
    id: 'eid-adha',
    hDay: 10,
    hMonth: 12,
    titles: {
      uz_lat: 'Qurbon hayiti (Iydul Adho)',
      uz_cyr: 'Қурбон ҳайити (Ийдул Адҳо)',
      en: 'Eid al-Adha',
      ru: 'Курбан-байрам (Ид аль-Адха)',
    },
    descs: {
      uz_lat: 'Qurbonlik va bayram kunlari boshi',
      uz_cyr: 'Қурбонлик ва байрам кунлари боши',
      en: 'Festival of Sacrifice',
      ru: 'Праздник жертвоприношения',
    },
  },
];

export function getIslamicSpecialDates(hYear: number, lang: AppLanguage): IslamicSpecialDate[] {
  return SPECIAL_ISLAMIC_EVENTS.map((ev) => ({
    id: ev.id,
    hDay: ev.hDay,
    hMonth: ev.hMonth,
    hYear,
    hijriLabel: `${ev.hDay} ${HIJRI_MONTHS[lang][ev.hMonth - 1]}, ${hYear}`,
    title: ev.titles[lang],
    description: ev.descs[lang],
    gregorianDate: hijriToGregorian(hYear, ev.hMonth, ev.hDay),
  }));
}
