export interface SurahSummary {
  number: number;
  name: string; // Arabic name
  englishName: string; // Transliterated name e.g. Al-Fatiha
  englishNameTranslation: string; // Meaning e.g. The Opening
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  page: number;
  juz: number;
  tags?: string[];
  description?: string;
}

export interface AyahWord {
  position: number;
  text: string;
}

export interface AyahVerseTiming {
  verseKey: string;
  ayahNumber: number;
  timestampFromMs: number;
  timestampToMs: number;
  segments: Array<[number, number, number]>;
}

export interface Ayah {
  numberInSurah: number;
  number: number;
  text: string; // Arabic text
  words?: AyahWord[]; // Timed Uthmani words for word-by-word highlight
  translation: string; // Current selected translation
  transliteration?: string;
  translations?: {
    en_sahih?: string;
    en_yusufali?: string;
    uz_mansur?: string;
    uz_cyr?: string;
    ru_kuliev?: string;
    ur_jalandhry?: string;
    fr_hamidullah?: string;
    id_indonesian?: string;
    tr_diyanet?: string;
  };
  juz?: number;
  page?: number;
  audioUrl?: string;
}

export interface SurahDetail extends SurahSummary {
  ayahs: Ayah[];
  bismillahPre?: boolean;
  fullAudioUrl?: string;
  audioDurationMs?: number;
  audioReciterId?: number;
  verseTimings?: AyahVerseTiming[];
}

export type AppLanguage = 'uz_lat' | 'uz_cyr' | 'en' | 'ru';

export type TranslationId =
  | 'en_sahih'
  | 'en_yusufali'
  | 'uz_mansur'
  | 'uz_cyr'
  | 'ru_kuliev'
  | 'ur_jalandhry'
  | 'fr_hamidullah'
  | 'id_indonesian'
  | 'tr_diyanet';

export interface TranslationOption {
  id: TranslationId;
  name: string;
  language: string;
  author: string;
}

export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  imsak: string;
  midnight: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
  cityName: string;
  countryName: string;
  timezone?: string;
  region?: string;
  subtitle?: string;
}

export type CalcMethod = 'Uzbekistan' | 'MWL' | 'ISNA' | 'Egypt' | 'Makkah' | 'Karachi' | 'Tehran' | 'Gulf';
export type AsrMethod = 'Standard' | 'Hanafi';
export type ThemeMode = 'day' | 'night';

export interface TasbihPreset {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  target: number;
  meaning?: string;
  category: 'daily' | 'forgiveness' | 'praise' | 'salawat';
  uz?: {
    transliteration: string;
    translation: string;
    meaning?: string;
  };
  ru?: {
    transliteration: string;
    translation: string;
    meaning?: string;
  };
}

export interface AllahName {
  number: number;
  arabic: string;
  transliteration: string;
  meaning: string;
  explanation: string;
  benefit: string;
  uz?: {
    transliteration: string;
    meaning: string;
    explanation: string;
    benefit: string;
  };
  ru?: {
    transliteration: string;
    meaning: string;
    explanation: string;
    benefit: string;
  };
}

export interface DuaItem {
  id: string;
  category: 'morning' | 'evening' | 'rabbana' | 'after_salah' | 'sleeping';
  title: string;
  titleUz?: string;
  titleRu?: string;
  arabic: string;
  transliteration: string;
  translation: string;
  translationUz?: string;
  translationRu?: string;
  reference: string;
  repeatCount: number;
}

export interface Bookmark {
  id: string;
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  timestamp: number;
  note?: string;
}
