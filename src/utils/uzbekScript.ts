/**
 * Bidirectional Uzbek Latin <-> Uzbek Cyrillic transliterator.
 * Used to render offline/online Uzbek translations and religious texts cleanly in both scripts.
 */

const APOSTROPHES = `['’‘ʻʼ\`]`;

const LATIN_DIGRAPH_RULES: Array<[RegExp, string]> = [
  [new RegExp(`O${APOSTROPHES}`, 'g'), 'Ў'],
  [new RegExp(`o${APOSTROPHES}`, 'g'), 'ў'],
  [new RegExp(`G${APOSTROPHES}`, 'g'), 'Ғ'],
  [new RegExp(`g${APOSTROPHES}`, 'g'), 'ғ'],
  [/SH/g, 'Ш'],
  [/Sh/g, 'Ш'],
  [/sh/g, 'ш'],
  [/CH/g, 'Ч'],
  [/Ch/g, 'Ч'],
  [/ch/g, 'ч'],
  [/YO/g, 'Ё'],
  [/Yo/g, 'Ё'],
  [/yo/g, 'ё'],
  [/YU/g, 'Ю'],
  [/Yu/g, 'Ю'],
  [/yu/g, 'ю'],
  [/YA/g, 'Я'],
  [/Ya/g, 'Я'],
  [/ya/g, 'я'],
  [/YE/g, 'Е'],
  [/Ye/g, 'Е'],
  [/ye/g, 'е'],
  [/TS/g, 'Ц'],
  [/Ts/g, 'Ц'],
  [/ts/g, 'ц'],
];

const LATIN_CHAR_MAP: Record<string, string> = {
  A: 'А', Ā: 'А', B: 'Б', D: 'Д', E: 'Е', F: 'Ф', G: 'Г', H: 'Ҳ', I: 'И', Ī: 'И',
  J: 'Ж', K: 'К', L: 'Л', M: 'М', N: 'Н', O: 'О', P: 'П', Q: 'Қ',
  R: 'Р', S: 'С', T: 'Т', U: 'У', Ū: 'У', V: 'В', X: 'Х', Y: 'Й', Z: 'З',
  a: 'а', ā: 'а', b: 'б', d: 'д', e: 'е', f: 'ф', g: 'г', h: 'ҳ', i: 'и', ī: 'и',
  j: 'ж', k: 'к', l: 'л', m: 'м', n: 'н', o: 'о', p: 'п', q: 'қ',
  r: 'р', s: 'с', t: 'т', u: 'у', ū: 'у', v: 'в', x: 'х', y: 'й', z: 'з',
};

const CYRILLIC_CHAR_MAP: Record<string, string> = {
  А: 'A', Б: 'B', В: 'V', Г: 'G', Д: 'D', Ё: 'Yo', Ж: 'J', З: 'Z',
  И: 'I', Й: 'Y', К: 'K', Л: 'L', М: 'M', Н: 'N', О: 'O', П: 'P',
  Р: 'R', С: 'S', Т: 'T', У: 'U', Ф: 'F', Х: 'X', Ц: 'Ts', Ч: 'Ch',
  Ш: 'Sh', Ъ: "'", Э: 'E', Ю: 'Yu', Я: 'Ya', Ў: "O'", Қ: 'Q', Ғ: "G'",
  Ҳ: 'H', Ь: '', Ы: 'I', Щ: 'Shch',
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', ё: 'yo', ж: 'j', з: 'z',
  и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p',
  р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'x', ц: 'ts', ч: 'ch',
  ш: 'sh', ъ: "'", э: 'e', ю: 'yu', я: 'ya', ў: "o'", қ: 'q', ғ: "g'",
  ҳ: 'h', ь: '', ы: 'i', щ: 'shch',
};

const LATIN_VOWELS = /[aeoʻiuāīūOAEIUĀĪŪo'ўаеиоуўэюяАЕИОУЎЭЮЯ]/;
const CYRILLIC_VOWELS = /[аеёиоуўэюяАЕЁИОУЎЭЮЯ]/;

/**
 * Converts Uzbek Latin text into Uzbek Cyrillic script.
 */
export function latinToCyrillicUz(text: string): string {
  if (!text) return '';

  // Normalize initial/post-vowel E/e -> Э/э before digraphs
  let result = text.replace(/(^|[^A-Za-zĀāĪīŪū'’‘ʻʼ])([Ee])/g, (m, prefix, ch) => {
    // Keep "ye" handled by digraph rule; only standalone E/e at word start
    return m ? `${prefix}${ch === 'E' ? 'Э' : 'э'}` : m;
  });

  // Restore эе if "Ye"/"ye" became "эе" (Wait: regex above skips 'e' after 'Y/y' because Y is in A-Za-z)
  // Handle word-initial "Ye" -> "Е", remaining vowels before e -> э
  for (const [pattern, replacement] of LATIN_DIGRAPH_RULES) {
    result = result.replace(pattern, replacement);
  }

  // Remaining vowel + e -> vowel + э
  result = result.replace(new RegExp(`(${LATIN_VOWELS.source})e`, 'g'), '$1э');
  result = result.replace(new RegExp(`(${LATIN_VOWELS.source})E`, 'g'), '$1Э');

  // Drop leading Arabic 'ayn apostrophe right after hyphen/space (e.g. Al-'Alīm -> Ал-Алим)
  result = result.replace(new RegExp(`(^|[\\s-])${APOSTROPHES}(?=[A-Za-zĀāĪīŪūА-Яа-яЎўҚқҒғҲҳ])`, 'g'), '$1');

  // Standalone apostrophe used as tutuq belgisi (') -> ъ
  result = result.replace(new RegExp(`([A-Za-zĀāĪīŪūА-Яа-яЎўҚқҒғҲҳ])${APOSTROPHES}`, 'g'), '$1ъ');

  let out = '';
  for (const ch of result) {
    out += LATIN_CHAR_MAP[ch] ?? ch;
  }
  return out;
}

/**
 * Converts Uzbek Cyrillic text (e.g. Muhammad Sodiq API translation) into Uzbek Latin script.
 */
export function cyrillicToLatinUz(text: string): string {
  if (!text) return '';
  let out = '';

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const prev = i > 0 ? text[i - 1] : '';

    if (ch === 'Е' || ch === 'е') {
      const isWordStartOrAfterVowel = !prev || !/[А-Яа-яЁёЎўҚқҒғҲҳъь]/.test(prev) || CYRILLIC_VOWELS.test(prev);
      if (isWordStartOrAfterVowel) {
        out += ch === 'Е' ? 'Ye' : 'ye';
      } else {
        out += ch === 'Е' ? 'E' : 'e';
      }
      continue;
    }

    out += CYRILLIC_CHAR_MAP[ch] ?? ch;
  }

  return out;
}
