import { AppLanguage } from '../types';
import { cyrillicToLatinUz, latinToCyrillicUz } from '../utils/uzbekScript';

export type BookCategory = 'all' | 'fiqh' | 'hadith' | 'spirituality' | 'favorites';

export type BookCoverTheme = 'emerald' | 'walnut' | 'navy' | 'burgundy' | 'teal';

export type BookStorageKind = 'bundled' | 'cloud';

export interface LocalizedBookField {
  uz_lat?: string;
  uz_cyr?: string;
  en?: string;
  ru?: string;
}

export interface LocalizedParagraphField {
  uz_lat?: string[];
  uz_cyr?: string[];
  en?: string[];
  ru?: string[];
}

export interface BookChapterData {
  id: string;
  number: number;
  title: LocalizedBookField;
  sourceQuote?: string;
  sourceLabel?: LocalizedBookField;
  paragraphs: LocalizedParagraphField;
  takeaway?: LocalizedBookField;
}

export interface BookCatalogItem {
  id: string;
  category: Exclude<BookCategory, 'all' | 'favorites'>;
  coverTheme: BookCoverTheme;
  era: string;
  arabicTitle: string;
  title: LocalizedBookField;
  author: LocalizedBookField;
  summary: LocalizedBookField;
  chaptersCount: number;
  estimatedPages: number;
  storage: BookStorageKind;
  sizeKb: number;
  /** Content languages natively present in body text (uz_lat auto-provides uz_cyr and vice versa). */
  contentLangs: Array<'uz' | 'ru' | 'en' | 'ar'>;
}

export interface BookContentFile {
  id: string;
  version: number;
  chapters: BookChapterData[];
}

export interface LibraryCatalogManifest {
  version: number;
  updatedAt: string;
  books: BookCatalogItem[];
}

/**
 * Resolves localized book text with automatic bidirectional Uzbek Latin <-> Cyrillic
 * transliteration and smart fallback order (uz -> ru -> en) so every book renders cleanly.
 */
export function resolveLocalizedBookText(
  field: LocalizedBookField | undefined,
  lang: AppLanguage,
  preferredContentLang?: 'uz' | 'ru' | 'en'
): string {
  if (!field) return '';

  if (preferredContentLang === 'ru' && field.ru) return field.ru;
  if (preferredContentLang === 'en' && field.en) return field.en;
  if (preferredContentLang === 'uz') {
    if (lang === 'uz_cyr') {
      if (field.uz_cyr) return field.uz_cyr;
      if (field.uz_lat) return latinToCyrillicUz(field.uz_lat);
    } else {
      if (field.uz_lat) return field.uz_lat;
      if (field.uz_cyr) return cyrillicToLatinUz(field.uz_cyr);
    }
  }

  if (lang === 'uz_cyr') {
    if (field.uz_cyr) return field.uz_cyr;
    if (field.uz_lat) return latinToCyrillicUz(field.uz_lat);
    return field.ru || field.en || '';
  }

  if (lang === 'uz_lat') {
    if (field.uz_lat) return field.uz_lat;
    if (field.uz_cyr) return cyrillicToLatinUz(field.uz_cyr);
    return field.ru || field.en || '';
  }

  if (lang === 'ru') {
    if (field.ru) return field.ru;
    if (field.en) return field.en;
    if (field.uz_lat) return field.uz_lat;
    if (field.uz_cyr) return field.uz_cyr;
    return '';
  }

  // English
  if (field.en) return field.en;
  if (field.ru) return field.ru;
  if (field.uz_lat) return field.uz_lat;
  if (field.uz_cyr) return cyrillicToLatinUz(field.uz_cyr);
  return '';
}

/**
 * Resolves chapter paragraphs with automatic Uzbek Latin <-> Cyrillic script conversion.
 */
export function resolveLocalizedBookParagraphs(
  field: LocalizedParagraphField | undefined,
  lang: AppLanguage,
  preferredContentLang?: 'uz' | 'ru' | 'en'
): string[] {
  if (!field) return [];

  if (preferredContentLang === 'ru' && field.ru?.length) return field.ru;
  if (preferredContentLang === 'en' && field.en?.length) return field.en;
  if (preferredContentLang === 'uz') {
    if (lang === 'uz_cyr') {
      if (field.uz_cyr?.length) return field.uz_cyr;
      if (field.uz_lat?.length) return field.uz_lat.map(latinToCyrillicUz);
    } else {
      if (field.uz_lat?.length) return field.uz_lat;
      if (field.uz_cyr?.length) return field.uz_cyr.map(cyrillicToLatinUz);
    }
  }

  if (lang === 'uz_cyr') {
    if (field.uz_cyr?.length) return field.uz_cyr;
    if (field.uz_lat?.length) return field.uz_lat.map(latinToCyrillicUz);
    if (field.ru?.length) return field.ru;
    if (field.en?.length) return field.en;
    return [];
  }

  if (lang === 'uz_lat') {
    if (field.uz_lat?.length) return field.uz_lat;
    if (field.uz_cyr?.length) return field.uz_cyr.map(cyrillicToLatinUz);
    if (field.ru?.length) return field.ru;
    if (field.en?.length) return field.en;
    return [];
  }

  if (lang === 'ru') {
    if (field.ru?.length) return field.ru;
    if (field.en?.length) return field.en;
    if (field.uz_lat?.length) return field.uz_lat;
    if (field.uz_cyr?.length) return field.uz_cyr;
    return [];
  }

  if (field.en?.length) return field.en;
  if (field.ru?.length) return field.ru;
  if (field.uz_lat?.length) return field.uz_lat;
  if (field.uz_cyr?.length) return field.uz_cyr.map(cyrillicToLatinUz);
  return [];
}
