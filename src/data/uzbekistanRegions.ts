import { AppLanguage, Coordinates } from '../types';

export type LocationRegionId =
  | 'uz_tashkent_city'
  | 'uz_tashkent_region'
  | 'uz_andijan'
  | 'uz_fergana'
  | 'uz_namangan'
  | 'uz_sirdaryo'
  | 'uz_jizzakh'
  | 'uz_samarkand'
  | 'uz_kashkadarya'
  | 'uz_surkhandarya'
  | 'uz_bukhara'
  | 'uz_navoi'
  | 'uz_khorezm'
  | 'uz_karakalpakstan'
  | 'world';

export interface RegionDefinition {
  id: LocationRegionId;
  shortLabel: Record<AppLanguage, string>;
  fullLabel: Record<AppLanguage, string>;
}

export const LOCATION_REGIONS: RegionDefinition[] = [
  {
    id: 'uz_tashkent_city',
    shortLabel: { uz_lat: 'Toshkent sh.', uz_cyr: 'Тошкент ш.', en: 'Tashkent', ru: 'Ташкент' },
    fullLabel: { uz_lat: 'Toshkent shahri', uz_cyr: 'Тошкент шаҳри', en: 'Tashkent City', ru: 'г. Ташкент' },
  },
  {
    id: 'uz_tashkent_region',
    shortLabel: { uz_lat: 'Toshkent vil.', uz_cyr: 'Тошкент вил.', en: 'Tashkent Reg.', ru: 'Ташкент. обл.' },
    fullLabel: { uz_lat: 'Toshkent viloyati', uz_cyr: 'Тошкент вилояти', en: 'Tashkent Region', ru: 'Ташкентская область' },
  },
  {
    id: 'uz_andijan',
    shortLabel: { uz_lat: 'Andijon', uz_cyr: 'Андижон', en: 'Andijan', ru: 'Андижан' },
    fullLabel: { uz_lat: 'Andijon viloyati', uz_cyr: 'Андижон вилояти', en: 'Andijan Region', ru: 'Андижанская область' },
  },
  {
    id: 'uz_fergana',
    shortLabel: { uz_lat: "Farg'ona", uz_cyr: 'Фарғона', en: 'Fergana', ru: 'Фергана' },
    fullLabel: { uz_lat: "Farg'ona viloyati", uz_cyr: 'Фарғона вилояти', en: 'Fergana Region', ru: 'Ферганская область' },
  },
  {
    id: 'uz_namangan',
    shortLabel: { uz_lat: 'Namangan', uz_cyr: 'Наманган', en: 'Namangan', ru: 'Наманган' },
    fullLabel: { uz_lat: 'Namangan viloyati', uz_cyr: 'Наманган вилояти', en: 'Namangan Region', ru: 'Наманганская область' },
  },
  {
    id: 'uz_samarkand',
    shortLabel: { uz_lat: 'Samarqand', uz_cyr: 'Самарқанд', en: 'Samarkand', ru: 'Самарканд' },
    fullLabel: { uz_lat: 'Samarqand viloyati', uz_cyr: 'Самарқанд вилояти', en: 'Samarkand Region', ru: 'Самаркандская область' },
  },
  {
    id: 'uz_bukhara',
    shortLabel: { uz_lat: 'Buxoro', uz_cyr: 'Бухоро', en: 'Bukhara', ru: 'Бухара' },
    fullLabel: { uz_lat: 'Buxoro viloyati', uz_cyr: 'Бухоро вилояти', en: 'Bukhara Region', ru: 'Бухарская область' },
  },
  {
    id: 'uz_jizzakh',
    shortLabel: { uz_lat: 'Jizzax', uz_cyr: 'Жиззах', en: 'Jizzakh', ru: 'Джизак' },
    fullLabel: { uz_lat: 'Jizzax viloyati', uz_cyr: 'Жиззах вилояти', en: 'Jizzakh Region', ru: 'Джизакская область' },
  },
  {
    id: 'uz_sirdaryo',
    shortLabel: { uz_lat: 'Sirdaryo', uz_cyr: 'Сирдарё', en: 'Syrdarya', ru: 'Сырдарья' },
    fullLabel: { uz_lat: 'Sirdaryo viloyati', uz_cyr: 'Сирдарё вилояти', en: 'Syrdarya Region', ru: 'Сырдарьинская область' },
  },
  {
    id: 'uz_kashkadarya',
    shortLabel: { uz_lat: 'Qashqadaryo', uz_cyr: 'Қашқадарё', en: 'Kashkadarya', ru: 'Кашкадарья' },
    fullLabel: { uz_lat: 'Qashqadaryo viloyati', uz_cyr: 'Қашқадарё вилояти', en: 'Kashkadarya Region', ru: 'Кашкадарьинская область' },
  },
  {
    id: 'uz_surkhandarya',
    shortLabel: { uz_lat: 'Surxondaryo', uz_cyr: 'Сурхондарё', en: 'Surkhandarya', ru: 'Сурхандарья' },
    fullLabel: { uz_lat: 'Surxondaryo viloyati', uz_cyr: 'Сурхондарё вилояти', en: 'Surkhandarya Region', ru: 'Сурхандарьинская область' },
  },
  {
    id: 'uz_navoi',
    shortLabel: { uz_lat: 'Navoiy', uz_cyr: 'Навоий', en: 'Navoi', ru: 'Навои' },
    fullLabel: { uz_lat: 'Navoiy viloyati', uz_cyr: 'Навоий вилояти', en: 'Navoi Region', ru: 'Навоийская область' },
  },
  {
    id: 'uz_khorezm',
    shortLabel: { uz_lat: 'Xorazm', uz_cyr: 'Хоразм', en: 'Khorezm', ru: 'Хорезм' },
    fullLabel: { uz_lat: 'Xorazm viloyati', uz_cyr: 'Хоразм вилояти', en: 'Khorezm Region', ru: 'Хорезмская область' },
  },
  {
    id: 'uz_karakalpakstan',
    shortLabel: { uz_lat: "Qoraqalpog'iston", uz_cyr: 'Қорақалпоғистон', en: 'Karakalpakstan', ru: 'Каракалпакстан' },
    fullLabel: {
      uz_lat: "Qoraqalpog'iston Resp.",
      uz_cyr: 'Қорақалпоғистон Респ.',
      en: 'Republic of Karakalpakstan',
      ru: 'Республика Каракалпакстан',
    },
  },
  {
    id: 'world',
    shortLabel: { uz_lat: 'Jahon', uz_cyr: 'Жаҳон', en: 'World', ru: 'Мир' },
    fullLabel: { uz_lat: 'Jahon shaharlari', uz_cyr: 'Жаҳон шаҳарлари', en: 'World Cities', ru: 'Города мира' },
  },
];

export const REGION_MAP: Record<LocationRegionId, RegionDefinition> = Object.fromEntries(
  LOCATION_REGIONS.map((r) => [r.id, r])
) as Record<LocationRegionId, RegionDefinition>;

export interface LocationEntry extends Coordinates {
  region: LocationRegionId;
  labels: Record<AppLanguage, string>;
  aliases?: string;
}

// Lightweight regional centers kept synchronously in startup bundle so Home & Prayer
// render major Uzbekistan cities immediately without loading all 215+ districts.
export const CORE_UZBEKISTAN_CAPITALS: LocationEntry[] = [
  { cityName: 'Tashkent', countryName: 'Uzbekistan', region: 'uz_tashkent_city', latitude: 41.2995, longitude: 69.2401, timezone: 'Asia/Tashkent', labels: { uz_lat: 'Toshkent', uz_cyr: 'Тошкент', en: 'Tashkent', ru: 'Ташкент' } },
  { cityName: 'Nurafshon', countryName: 'Uzbekistan', region: 'uz_tashkent_region', latitude: 41.0355, longitude: 69.3585, timezone: 'Asia/Tashkent', labels: { uz_lat: 'Nurafshon', uz_cyr: 'Нурафшон', en: 'Nurafshon', ru: 'Нурафшон' } },
  { cityName: 'Andijan', countryName: 'Uzbekistan', region: 'uz_andijan', latitude: 40.7821, longitude: 72.3442, timezone: 'Asia/Tashkent', labels: { uz_lat: 'Andijon shahri', uz_cyr: 'Андижон шаҳри', en: 'Andijan', ru: 'Андижан' } },
  { cityName: 'Fergana', countryName: 'Uzbekistan', region: 'uz_fergana', latitude: 40.3842, longitude: 71.7843, timezone: 'Asia/Tashkent', labels: { uz_lat: "Farg'ona shahri", uz_cyr: 'Фарғона шаҳри', en: 'Fergana', ru: 'Фергана' } },
  { cityName: 'Namangan', countryName: 'Uzbekistan', region: 'uz_namangan', latitude: 40.9983, longitude: 71.6726, timezone: 'Asia/Tashkent', labels: { uz_lat: 'Namangan shahri', uz_cyr: 'Наманган шаҳри', en: 'Namangan', ru: 'Наманган' } },
  { cityName: 'Gulistan', countryName: 'Uzbekistan', region: 'uz_sirdaryo', latitude: 40.4897, longitude: 68.7842, timezone: 'Asia/Tashkent', labels: { uz_lat: 'Guliston shahri', uz_cyr: 'Гулистон шаҳри', en: 'Gulistan', ru: 'Гулистан' } },
  { cityName: 'Jizzakh', countryName: 'Uzbekistan', region: 'uz_jizzakh', latitude: 40.1158, longitude: 67.8422, timezone: 'Asia/Tashkent', labels: { uz_lat: 'Jizzax shahri', uz_cyr: 'Жиззах шаҳри', en: 'Jizzakh', ru: 'Джизак' } },
  { cityName: 'Samarkand', countryName: 'Uzbekistan', region: 'uz_samarkand', latitude: 39.6542, longitude: 66.9597, timezone: 'Asia/Samarkand', labels: { uz_lat: 'Samarqand shahri', uz_cyr: 'Самарқанд шаҳри', en: 'Samarkand', ru: 'Самарканд' } },
  { cityName: 'Karshi', countryName: 'Uzbekistan', region: 'uz_kashkadarya', latitude: 38.8606, longitude: 65.7891, timezone: 'Asia/Samarkand', labels: { uz_lat: 'Qarshi shahri', uz_cyr: 'Қарши шаҳри', en: 'Karshi', ru: 'Карши' } },
  { cityName: 'Termez', countryName: 'Uzbekistan', region: 'uz_surkhandarya', latitude: 37.2242, longitude: 67.2783, timezone: 'Asia/Samarkand', labels: { uz_lat: 'Termiz shahri', uz_cyr: 'Термиз шаҳри', en: 'Termez', ru: 'Термез' } },
  { cityName: 'Bukhara', countryName: 'Uzbekistan', region: 'uz_bukhara', latitude: 39.7747, longitude: 64.4286, timezone: 'Asia/Samarkand', labels: { uz_lat: 'Buxoro shahri', uz_cyr: 'Бухоро шаҳри', en: 'Bukhara', ru: 'Бухара' } },
  { cityName: 'Navoi', countryName: 'Uzbekistan', region: 'uz_navoi', latitude: 40.0844, longitude: 65.3792, timezone: 'Asia/Samarkand', labels: { uz_lat: 'Navoiy shahri', uz_cyr: 'Навоий шаҳри', en: 'Navoi', ru: 'Навои' } },
  { cityName: 'Urgench', countryName: 'Uzbekistan', region: 'uz_khorezm', latitude: 41.55, longitude: 60.6333, timezone: 'Asia/Samarkand', labels: { uz_lat: 'Urganch shahri', uz_cyr: 'Урганч шаҳри', en: 'Urgench', ru: 'Ургенч' } },
  { cityName: 'Nukus', countryName: 'Uzbekistan', region: 'uz_karakalpakstan', latitude: 42.4619, longitude: 59.6166, timezone: 'Asia/Samarkand', labels: { uz_lat: 'Nukus shahri', uz_cyr: 'Нукус шаҳри', en: 'Nukus', ru: 'Нукус' } },
];

export const DEFAULT_TASHKENT_CITY: LocationEntry = CORE_UZBEKISTAN_CAPITALS[0];
