import { AppLanguage } from '../types';

export type QuranReciterId = 7 | 97;

export interface QuranReciterMeta {
  id: QuranReciterId;
  storageKey: string;
  name: string;
  shortName: string;
  arabicName: string;
  style: Record<AppLanguage, string>;
  everyAyahFolder: string;
  quranCdnFolder?: string;
  islamicNetEdition?: string;
  mp3QuranBase: string;
  /** True when QDC word timestamps were generated against the full-Surah mp3quran master (e.g. Ad-Dussary). */
  preferFullSurahStream?: boolean;
  extraFullMirrors?: (surahNum: number, pad3: string) => string[];
}

export const DEFAULT_RECITER_ID: QuranReciterId = 7;
const RECITER_STORAGE_KEY = 'nq_quran_reciter_id';
export const RECITER_CHANGED_EVENT = 'nq:reciter-changed';

export const QURAN_RECITERS: QuranReciterMeta[] = [
  {
    id: 7,
    storageKey: 'alafasy',
    name: 'Mishary Rashid Al-Afasy',
    shortName: 'Al-Afasy',
    arabicName: 'مشاري راشد العفاسي',
    style: { uz_lat: 'Murattal', uz_cyr: 'Мураттал', ru: 'Муратталь', en: 'Murattal' },
    everyAyahFolder: 'Alafasy_128kbps',
    quranCdnFolder: 'Alafasy/mp3',
    islamicNetEdition: 'ar.alafasy',
    mp3QuranBase: 'https://server8.mp3quran.net/afs',
    extraFullMirrors: (surahNum, pad3) => [
      `https://cdn.mp3quran.net/audio/mishary-alafasy/r1/${pad3}.mp3`,
      `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNum}.mp3`,
    ],
  },
  {
    id: 97,
    storageKey: 'dussary',
    name: 'Yasser Ad-Dussary',
    shortName: 'Ad-Dussary',
    arabicName: 'ياسر الدوسري',
    style: { uz_lat: 'Murattal', uz_cyr: 'Мураттал', ru: 'Муратталь', en: 'Murattal' },
    everyAyahFolder: 'Yasser_Ad-Dussary_128kbps',
    mp3QuranBase: 'https://download.quranicaudio.com/quran/yasser_ad-dussary',
    preferFullSurahStream: false,
    extraFullMirrors: (_surahNum, pad3) => [
      `https://download.quranicaudio.com/quran/yasser_ad-dussary/${pad3}.mp3`,
      `https://server11.mp3quran.net/yasser/${pad3}.mp3`,
    ],
  },
];

const VALID_IDS = new Set<number>(QURAN_RECITERS.map((r) => r.id));

export function getReciterById(id: number): QuranReciterMeta {
  return QURAN_RECITERS.find((r) => r.id === id) || QURAN_RECITERS[0];
}

export function loadSelectedReciterId(): QuranReciterId {
  try {
    const raw = localStorage.getItem(RECITER_STORAGE_KEY);
    if (raw) {
      const parsed = Number(raw);
      if (VALID_IDS.has(parsed)) {
        return parsed as QuranReciterId;
      }
    }
  } catch {
    // ignore storage error
  }
  return DEFAULT_RECITER_ID;
}

export function saveSelectedReciterId(id: QuranReciterId): void {
  try {
    localStorage.setItem(RECITER_STORAGE_KEY, String(id));
    window.dispatchEvent(new Event(RECITER_CHANGED_EVENT));
  } catch {
    // ignore storage error
  }
}

export function getReciterAyahAudioCandidates(
  reciterId: QuranReciterId,
  surahNumber: number,
  ayahNumberInSurah: number,
  globalAyahNumber?: number
): string[] {
  const reciter = getReciterById(reciterId);
  const sNum = surahNumber.toString().padStart(3, '0');
  const aNum = ayahNumberInSurah.toString().padStart(3, '0');
  const candidates: string[] = [
    `https://everyayah.com/data/${reciter.everyAyahFolder}/${sNum}${aNum}.mp3`,
  ];
  if (reciter.quranCdnFolder) {
    candidates.push(`https://audio.qurancdn.com/${reciter.quranCdnFolder}/${sNum}${aNum}.mp3`);
  }
  if (reciter.islamicNetEdition && globalAyahNumber && globalAyahNumber > 0) {
    candidates.push(
      `https://cdn.islamic.network/quran/audio/128/${reciter.islamicNetEdition}/${globalAyahNumber}.mp3`
    );
  }
  return candidates;
}

export function getReciterFullSurahAudioCandidates(
  reciterId: QuranReciterId,
  surahNumber: number,
  qdcUrl?: string
): string[] {
  const reciter = getReciterById(reciterId);
  const pad3 = surahNumber.toString().padStart(3, '0');
  const candidates: string[] = [`${reciter.mp3QuranBase}/${pad3}.mp3`];
  if (reciter.extraFullMirrors) {
    for (const mirror of reciter.extraFullMirrors(surahNumber, pad3)) {
      if (!candidates.includes(mirror)) candidates.push(mirror);
    }
  }
  if (qdcUrl) {
    const normalizedQdc = qdcUrl.replace(/([^:])\/\/+/g, '$1/');
    if (!candidates.includes(normalizedQdc)) {
      candidates.unshift(normalizedQdc);
    }
  }
  return candidates;
}
