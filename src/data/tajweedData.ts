export type MakhrajZone = 'throat' | 'tongue' | 'lips' | 'nasal';

export interface ArabicLetterItem {
  id: number;
  arabic: string;
  nameUz: string;
  soundUz: string;
  zone: MakhrajZone;
  forms: {
    isolated: string;
    initial: string;
    medial: string;
    final: string;
  };
  makhrajUz: string;
  exampleArabic: string;
  exampleTranslit: string;
  exampleMeaningUz: string;
  isHeavy?: boolean;
  isQalqalah?: boolean;
}

export interface MuallimiSoniyDrillCell {
  arabic: string;
  readingUz: string;
  meaningUz?: string;
}

export interface MuallimiSoniyLesson {
  id: number;
  badgeUz: string;
  titleUz: string;
  ruleTipUz: string;
  newLetters: Array<{
    arabic: string;
    nameUz: string;
  }>;
  drills: MuallimiSoniyDrillCell[];
}

export interface HarakatLesson {
  id: string;
  symbolArabic: string;
  titleUz: string;
  ruleUz: string;
  examples: Array<{
    arabic: string;
    reading: string;
  }>;
}

export type TajweedColorTone = 'qalqalah' | 'madd' | 'ghunnah' | 'clear';

export interface TajweedColoredSegment {
  text: string;
  tone?: TajweedColorTone;
}

export interface TajweedRuleLesson {
  id: string;
  titleUz: string;
  badgeUz: string;
  colorTone: TajweedColorTone;
  lettersArabic: string;
  summaryUz: string;
  stepsUz: string[];
  examples: Array<{
    arabic: string;
    segments: TajweedColoredSegment[];
    translit: string;
    noteUz: string;
  }>;
}

// ============================================================================
// 1. AHMAD HODIY MAQSUDIY — "MUALLIMI SONIY" 10 PROGRESSIVE LESSONS
// ============================================================================
export const MUALLIMI_SONIY_LESSONS: MuallimiSoniyLesson[] = [
  {
    id: 1,
    badgeUz: '1-DARS · HARAKATLAR VA ILK HARFLAR',
    titleUz: "Alif (ا), Ro (ر), Za (ز) — Harakatlar va Sukun",
    ruleTipUz: "Fatha (ـَ) «a/o», Kasra (ـِ) «i», Damma (ـُ) «u» tovushini beradi. Sukun (ـْ) esa harfni unlisiz to'xtatib o'qitadi. Alif, Ro va Za o'zidan keyingi harfga ulanmaydi.",
    newLetters: [
      { arabic: 'ا', nameUz: 'Alif' },
      { arabic: 'ر', nameUz: 'Ro' },
      { arabic: 'ز', nameUz: 'Za' },
    ],
    drills: [
      { arabic: 'أَ إِ أُ', readingUz: 'A · I · U' },
      { arabic: 'رَ رِ رُ', readingUz: 'Ro · Ri · Ru' },
      { arabic: 'زَ زِ زُ', readingUz: 'Za · Zi · Zu' },
      { arabic: 'أَرْ', readingUz: 'Ar' },
      { arabic: 'إِرْ', readingUz: 'Ir' },
      { arabic: 'أُرْ', readingUz: 'Ur' },
      { arabic: 'أَزْ', readingUz: 'Az' },
      { arabic: 'زَرَ', readingUz: 'Za-ro' },
      { arabic: 'زُرِ', readingUz: 'Zu-ri' },
      { arabic: 'أَزَرَ', readingUz: 'A-za-ro' },
      { arabic: 'أَزْرِ', readingUz: 'Az-ri' },
      { arabic: 'زَرْزَرَ', readingUz: 'Zar-za-ro' },
    ],
  },
  {
    id: 2,
    badgeUz: '2-DARS · QO\'SHILUVCHI HARFLAR (1-QISM)',
    titleUz: "Mim (م), Ta (ت), Nun (ن), Ya (ي), Ba (ب) harflari",
    ruleTipUz: "Ushbu 5 ta harf so'z boshida, o'rtasida va oxirida o'zidan keyingi harfga qo'shilib yoziladi. Nuqtalarning joylashuviga (ustida yoki ostida ekaniga) e'tibor bering.",
    newLetters: [
      { arabic: 'م', nameUz: 'Mim' },
      { arabic: 'ت', nameUz: 'Ta' },
      { arabic: 'ن', nameUz: 'Nun' },
      { arabic: 'ي', nameUz: 'Ya' },
      { arabic: 'ب', nameUz: 'Ba' },
    ],
    drills: [
      { arabic: 'أَمَرَ', readingUz: 'A-ma-ro', meaningUz: 'Buyurdi' },
      { arabic: 'مَرَضَ', readingUz: 'Ma-ro' },
      { arabic: 'تَمْرٌ', readingUz: 'Tam-run', meaningUz: 'Xurmo' },
      { arabic: 'بَرَزَ', readingUz: 'Ba-ro-za' },
      { arabic: 'بِنْتٌ', readingUz: 'Bin-tun', meaningUz: 'Qiz farzand' },
      { arabic: 'بَيْتٌ', readingUz: 'Bay-tun', meaningUz: 'Uy' },
      { arabic: 'نَبَاتٌ', readingUz: 'Na-ba-tun', meaningUz: "O'simlik" },
      { arabic: 'مَنْبَرٌ', readingUz: 'Man-ba-run', meaningUz: 'Minbar' },
      { arabic: 'يَتِيمٌ', readingUz: 'Ya-ti-mun', meaningUz: 'Yetim' },
    ],
  },
  {
    id: 3,
    badgeUz: '3-DARS · QO\'SHILUVCHI HARFLAR (2-QISM)',
    titleUz: "Kaf (ك), Lam (ل), Vov (و), Ha (ه) harflari",
    ruleTipUz: "Kaf (ك) so'z boshida «كـ» shakliga kiradi. Lam va Alif qo'shilganda «لَا» (Laa) ko'rinishida yoziladi. Vov (و) o'zidan keyingi harfga qo'shilmaydi.",
    newLetters: [
      { arabic: 'ك', nameUz: 'Kaf' },
      { arabic: 'ل', nameUz: 'Lam' },
      { arabic: 'و', nameUz: 'Vov' },
      { arabic: 'ه', nameUz: 'Ha' },
    ],
    drills: [
      { arabic: 'كَتَبَ', readingUz: 'Ka-ta-ba', meaningUz: 'Yozdi' },
      { arabic: 'كِتَابٌ', readingUz: 'Ki-ta-bun', meaningUz: 'Kitob' },
      { arabic: 'مَلَكٌ', readingUz: 'Ma-la-kun', meaningUz: 'Farishta' },
      { arabic: 'كَلَامٌ', readingUz: 'Ka-la-mun', meaningUz: 'Kalom / So\'z' },
      { arabic: 'وَلَدٌ', readingUz: 'Va-la-dun', meaningUz: 'Bola' },
      { arabic: 'لَيْلٌ', readingUz: 'Lay-lun', meaningUz: 'Tun' },
      { arabic: 'ذَهَبَ', readingUz: 'Za-ha-ba' },
      { arabic: 'نَهْرٌ', readingUz: 'Nah-run', meaningUz: 'Daryo' },
      { arabic: 'لَهَبٍ', readingUz: 'La-ha-bin', meaningUz: 'Alanga' },
    ],
  },
  {
    id: 4,
    badgeUz: '4-DARS · LAB, TIL ORQA VA HUSHTAK HARFLARI',
    titleUz: "Fa (ف), Qof (ق), Shin (ش), Sin (س) harflari",
    ruleTipUz: "Fa (ف) ustida 1 ta nuqta (ingichka), Qof (ق) ustida 2 ta nuqta (yo'g'on va qalqala harfi). Sin (س) nuqtasiz, Shin (ش) ustida esa 3 ta nuqta bo'ladi.",
    newLetters: [
      { arabic: 'ف', nameUz: 'Fa' },
      { arabic: 'ق', nameUz: 'Qof' },
      { arabic: 'ش', nameUz: 'Shin' },
      { arabic: 'س', nameUz: 'Sin' },
    ],
    drills: [
      { arabic: 'فَلَقٌ', readingUz: 'Fa-la-qun', meaningUz: 'Tong' },
      { arabic: 'قَلَمٌ', readingUz: 'Qo-la-mun', meaningUz: 'Qalam' },
      { arabic: 'قَمَرٌ', readingUz: 'Qo-ma-run', meaningUz: 'Oy' },
      { arabic: 'قَلْبٌ', readingUz: 'Qol-bun', meaningUz: 'Qalb' },
      { arabic: 'شَمْسٌ', readingUz: 'Sham-sun', meaningUz: 'Quyosh' },
      { arabic: 'شُكْرٌ', readingUz: 'Shuk-run', meaningUz: 'Shukr' },
      { arabic: 'سَلَامٌ', readingUz: 'Sa-la-mun', meaningUz: 'Salom / Tinchlik' },
      { arabic: 'مُسْلِمٌ', readingUz: 'Mus-li-mun', meaningUz: 'Musulmon' },
      { arabic: 'سَفَرٌ', readingUz: 'Sa-fa-run', meaningUz: 'Safar' },
    ],
  },
  {
    id: 5,
    badgeUz: '5-DARS · BO\'G\'IZ VA TIL O\'RTA HARFLARI',
    titleUz: "Jim (ج), Ha (ح), Xo (خ), 'Ayn (ع), G'oyn (غ)",
    ruleTipUz: "Jim (ج — ostida 1 nuqta), Ha (ح — nuqtasiz, bo'g'iz o'rtasidan yumshoq), Xo (خ — ustida 1 nuqta, yo'g'on). 'Ayn (ع — nuqtasiz chuqur bo'g'izdan) va G'oyn (غ — ustida 1 nuqta).",
    newLetters: [
      { arabic: 'ج', nameUz: 'Jim' },
      { arabic: 'ح', nameUz: 'Ha' },
      { arabic: 'خ', nameUz: 'Xo' },
      { arabic: 'ع', nameUz: "'Ayn" },
      { arabic: 'غ', nameUz: "G'oyn" },
    ],
    drills: [
      { arabic: 'مَسْجِدٌ', readingUz: 'Mas-ji-dun', meaningUz: 'Masjid' },
      { arabic: 'جَبَلٌ', readingUz: 'Ja-ba-lun', meaningUz: "Tog'" },
      { arabic: 'حَمْدٌ', readingUz: 'Ham-dun', meaningUz: 'Hamd / Maqtov' },
      { arabic: 'بَحْرٌ', readingUz: 'Bah-run', meaningUz: 'Dengiz' },
      { arabic: 'خُبْزٌ', readingUz: 'Xub-zun', meaningUz: 'Non' },
      { arabic: 'خَيْرٌ', readingUz: 'Xoy-run', meaningUz: 'Yaxshilik' },
      { arabic: 'عِلْمٌ', readingUz: "'Il-mun", meaningUz: 'Ilm' },
      { arabic: 'عَمَلٌ', readingUz: "'A-ma-lun", meaningUz: 'Amal' },
      { arabic: 'غَفُورٌ', readingUz: "G'o-fu-run", meaningUz: "Mag'firatli" },
    ],
  },
  {
    id: 6,
    badgeUz: '6-DARS · YO\'G\'ON VA TISH ORASI HARFLARI',
    titleUz: "Sod (ص), Dod (ض), To (ط), Zo (ظ), Dal (د), Zal (ذ), Sa (ث)",
    ruleTipUz: "Sod (ص), Dod (ض), To (ط), Zo (ظ) — yo'g'on (isti'lo) harflari bo'lib, fatha bilan «O» unlisiga moyil o'qiladi. Sa (ث), Zal (ذ) va Zo (ظ) da til uchi old tishlar orasiga biroz tegadi.",
    newLetters: [
      { arabic: 'ص', nameUz: 'Sod' },
      { arabic: 'ض', nameUz: 'Dod' },
      { arabic: 'ط', nameUz: 'To' },
      { arabic: 'ظ', nameUz: 'Zo' },
      { arabic: 'د', nameUz: 'Dal' },
      { arabic: 'ذ', nameUz: 'Zal' },
      { arabic: 'ث', nameUz: 'Sa' },
    ],
    drills: [
      { arabic: 'صَبْرٌ', readingUz: 'Sob-run', meaningUz: 'Sabr' },
      { arabic: 'صِرَاطَ', readingUz: 'Si-roo-to', meaningUz: "To'g'ri yo'l" },
      { arabic: 'أَرْضٌ', readingUz: 'Ar-dun', meaningUz: 'Yer' },
      { arabic: 'طَهُورٌ', readingUz: 'To-hu-run', meaningUz: 'Poklovchi' },
      { arabic: 'ظُلْمٌ', readingUz: 'Zul-mun', meaningUz: 'Zulm' },
      { arabic: 'دِينٌ', readingUz: 'Di-nun', meaningUz: 'Din' },
      { arabic: 'ذِكْرٌ', readingUz: 'Zik-run', meaningUz: 'Zikr' },
      { arabic: 'ثَوَابٌ', readingUz: 'Sa-va-bun', meaningUz: 'Savob' },
      { arabic: 'كَوْثَرُ', readingUz: 'Kav-sa-ru', meaningUz: 'Kavsar' },
    ],
  },
  {
    id: 7,
    badgeUz: '7-DARS · MAD TABIIY (CHO\'ZIQ UNLILAR)',
    titleUz: "Mad harflari: Alif (ـَا), Ya (ـِي), Vov (ـُو) — 2 harakat cho'zish",
    ruleTipUz: "Fathadan keyin harakatsiz Alif (ـَا = ā), Kasradan keyin sukunli Ya (ـِي = ī), Dammadan keyin sukunli Vov (ـُو = ū) kelsa, tovush 2 harakat (1 soniya) cho'zib o'qiladi.",
    newLetters: [
      { arabic: 'ـَا', nameUz: 'Mad Alif (Ā)' },
      { arabic: 'ـِي', nameUz: 'Mad Ya (Ī)' },
      { arabic: 'ـُو', nameUz: 'Mad Vov (Ū)' },
    ],
    drills: [
      { arabic: 'بَا بِي بُو', readingUz: 'Baa · Bii · Buu' },
      { arabic: 'تَا تِي تُو', readingUz: 'Taa · Tii · Tuu' },
      { arabic: 'قَالَ', readingUz: 'Qoo-la', meaningUz: 'Aytdi' },
      { arabic: 'كَانَ', readingUz: 'Kaa-na', meaningUz: "Bo'ldi" },
      { arabic: 'دِينِي', readingUz: 'Dii-nii', meaningUz: 'Dinim' },
      { arabic: 'فِيهَا', readingUz: 'Fii-haa', meaningUz: 'Uning ichida' },
      { arabic: 'نُورٌ', readingUz: 'Nuu-run', meaningUz: 'Nur' },
      { arabic: 'يَقُولُ', readingUz: 'Ya-quu-lu', meaningUz: 'Aytadi' },
      { arabic: 'غَفُورٌ رَحِيمٌ', readingUz: "G'o-fuu-run Ro-hiim" },
    ],
  },
  {
    id: 8,
    badgeUz: '8-DARS · TANVIN VA TASHDID (SHADDA)',
    titleUz: "Tanvin (ـً ـٍ ـٌ) va Tashdid (ـّ) mashqlari",
    ruleTipUz: "Tanvin so'z oxiriga «-an, -in, -un» tovushini qo'shadi. Tashdid (ـّ) esa harfni ikkilantirib (kuch bilan bosib) o'qitadi. Tashdidli Nun (نّ) va Mim (مّ) 2 harakat g'unna qilinadi.",
    newLetters: [
      { arabic: 'ـً ـٍ ـٌ', nameUz: 'Tanvin (-an/-in/-un)' },
      { arabic: 'ـّ', nameUz: 'Tashdid (2×)' },
    ],
    drills: [
      { arabic: 'أَحَدٌ', readingUz: 'A-ha-dun', meaningUz: 'Yagona' },
      { arabic: 'عَلِيمًا', readingUz: "'A-lii-man", meaningUz: 'Biluvchi' },
      { arabic: 'كُفُوًا', readingUz: 'Ku-fu-van', meaningUz: 'Teng' },
      { arabic: 'رَبِّ', readingUz: 'Rob-bi', meaningUz: 'Robbim' },
      { arabic: 'إِنَّ', readingUz: 'In-na (g\'unna)', meaningUz: 'Albatta' },
      { arabic: 'ثُمَّ', readingUz: 'Sum-ma (g\'unna)', meaningUz: "So'ngra" },
      { arabic: 'جَنَّةٌ', readingUz: 'Jan-na-tun', meaningUz: 'Jannat' },
      { arabic: 'مُحَمَّدٌ', readingUz: 'Mu-ham-ma-dun', meaningUz: 'Muhammad ﷺ' },
      { arabic: 'عَمَّ', readingUz: "'Am-ma", meaningUz: 'Nima haqida' },
    ],
  },
  {
    id: 9,
    badgeUz: '9-DARS · QALQALA VA LAFZI JALOLA',
    titleUz: "Qalqala (ق ط ب ج د) va «Alloh» (اللَّه) lafzini o'qish",
    ruleTipUz: "«Qutbu jaddin» (ق ط ب ج د) harflari sukunli kelsa tebratib o'qiladi. «Alloh» (اللَّه) lafzidan oldin fatha yoki damma kelsa yo'g'on («Alloh»), kasra kelsa ingichka («Bismillahi») o'qiladi.",
    newLetters: [
      { arabic: 'ق ط ب ج د', nameUz: '5 ta Qalqala' },
      { arabic: 'اللَّهُ', nameUz: 'Lafzi Jalola' },
    ],
    drills: [
      { arabic: 'أَحَدْ', readingUz: 'A-had (qalqala)' },
      { arabic: 'الصَّمَدْ', readingUz: 'As-so-mad (qalqala)' },
      { arabic: 'الْفَلَقْ', readingUz: 'Al-fa-laq (qalqala)' },
      { arabic: 'يَجْعَلْ', readingUz: "Yaj-'al (qalqala)" },
      { arabic: 'أَطْعَمَهُمْ', readingUz: "At-'a-ma-hum" },
      { arabic: 'هُوَ اللَّهُ', readingUz: 'Hu-vallohu (yo\'g\'on)' },
      { arabic: 'رَسُولُ اللَّهِ', readingUz: 'Ro-suu-lullohi (yo\'g\'on)' },
      { arabic: 'بِسْمِ اللَّهِ', readingUz: 'Bis-millahi (ingichka)' },
      { arabic: 'الْحَمْدُ لِلَّهِ', readingUz: 'Al-ham-du lillahi' },
    ],
  },
  {
    id: 10,
    badgeUz: '10-DARS · AMALIY YAKUNIY MASHQ (FOTIHA VA IXLOS)',
    titleUz: "Fotiha va Ixlos suralarini tajvid bilan bo'g'inlab o'qish",
    ruleTipUz: "O'rganilgan barcha qoidalarni (Mad, Tashdid, Izhor, Qalqala va Lafzi Jalola) Fotiha va Ixlos suralari oyatlarida amaliy qo'llab o'qing.",
    newLetters: [
      { arabic: 'الْفَاتِحَة', nameUz: 'Fotiha surasi' },
      { arabic: 'الْإِخْلَاص', nameUz: 'Ixlos surasi' },
    ],
    drills: [
      { arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readingUz: 'Bismillaahir-Rohmaanir-Rohiim' },
      { arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', readingUz: "Alhamdu lillaahi Robbil-'aalamiin" },
      { arabic: 'الرَّحْمَٰنِ الرَّحِيمِ', readingUz: 'Ar-Rohmaanir-Rohiim' },
      { arabic: 'مَالِكِ يَوْمِ الدِّينِ', readingUz: 'Maaliki yavmid-diin' },
      { arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', readingUz: "Iyyaaka na'budu va iyyaaka nasta'iin" },
      { arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', readingUz: 'Ihdinas-sirootol-mustaqiim' },
      { arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ', readingUz: 'Qul huvalloohu ahad' },
      { arabic: 'اللَّهُ الصَّمَدُ', readingUz: 'Alloohus-somad' },
      { arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', readingUz: 'Lam yalid va lam yuulad' },
    ],
  },
];

// ============================================================================
// 2. 28 ARABIC LETTERS WITH 5-ZONE MAKHRAJ CLASSIFICATION
// ============================================================================
export const ARABIC_ALPHABET_28: ArabicLetterItem[] = [
  {
    id: 1,
    arabic: 'ا',
    nameUz: 'Alif',
    soundUz: "A / I / U (harakatga qarab) yoki cho'ziq Ā",
    zone: 'throat',
    forms: { isolated: 'ا', initial: 'ا', medial: 'ـا', final: 'ـا' },
    makhrajUz: "Bo'g'iz va og'iz bo'shlig'idan erkin chiqadi. O'zidan keyingi harfga qo'shilmaydi.",
    exampleArabic: 'اللَّهُ',
    exampleTranslit: 'Allohu',
    exampleMeaningUz: 'Alloh',
  },
  {
    id: 2,
    arabic: 'ب',
    nameUz: 'Ba',
    soundUz: 'B (lab harfi, qalqala harfi)',
    zone: 'lips',
    isQalqalah: true,
    forms: { isolated: 'ب', initial: 'بـ', medial: 'ـبـ', final: 'ـب' },
    makhrajUz: "Ikki labning bir-biriga tegishidan chiqadi. Ostida 1 ta nuqtasi bor.",
    exampleArabic: 'بِسْمِ',
    exampleTranslit: 'Bismi',
    exampleMeaningUz: 'Ismi bilan',
  },
  {
    id: 3,
    arabic: 'ت',
    nameUz: 'Ta',
    soundUz: 'T (yumshoq t)',
    zone: 'tongue',
    forms: { isolated: 'ت', initial: 'تـ', medial: 'ـتـ', final: 'ـت' },
    makhrajUz: "Til uchi oldingi yuqori tishlarning tubiga tegishidan chiqadi. Ustida 2 ta nuqtasi bor.",
    exampleArabic: 'تَوْبَةٌ',
    exampleTranslit: 'Tavbatun',
    exampleMeaningUz: 'Tavba',
  },
  {
    id: 4,
    arabic: 'ث',
    nameUz: 'Sa',
    soundUz: 'S (til uchi tishlar orasidan)',
    zone: 'tongue',
    forms: { isolated: 'ث', initial: 'ثـ', medial: 'ـثـ', final: 'ـث' },
    makhrajUz: "Til uchini oldingi yuqori va pastki tishlar orasiga biroz chiqarib yumshoq talaffuz qilinadi. Ustida 3 ta nuqtasi bor.",
    exampleArabic: 'ثَوَابٌ',
    exampleTranslit: 'Savabun',
    exampleMeaningUz: 'Savob',
  },
  {
    id: 5,
    arabic: 'ج',
    nameUz: 'Jim',
    soundUz: 'J (qalqala harfi)',
    zone: 'tongue',
    isQalqalah: true,
    forms: { isolated: 'ج', initial: 'جـ', medial: 'ـجـ', final: 'ـج' },
    makhrajUz: "Til o'rtasi yuqori tanglayga tegishidan chiqadi. Qornida (ostida) 1 ta nuqtasi bor.",
    exampleArabic: 'جَنَّةٌ',
    exampleTranslit: 'Jannatun',
    exampleMeaningUz: 'Jannat',
  },
  {
    id: 6,
    arabic: 'ح',
    nameUz: 'Ha',
    soundUz: "H (bo'g'iz o'rtasidan, nuqtasiz)",
    zone: 'throat',
    forms: { isolated: 'ح', initial: 'حـ', medial: 'ـحـ', final: 'ـح' },
    makhrajUz: "Bo'g'izning o'rta qismidan biroz qisilib, sof va yumshoq «h» bo'lib chiqadi.",
    exampleArabic: 'حَمْدٌ',
    exampleTranslit: 'Hamdun',
    exampleMeaningUz: 'Maqtov (Hamd)',
  },
  {
    id: 7,
    arabic: 'خ',
    nameUz: 'Xo',
    soundUz: "X (yo'g'on x)",
    zone: 'throat',
    isHeavy: true,
    forms: { isolated: 'خ', initial: 'خـ', medial: 'ـخـ', final: 'ـخ' },
    makhrajUz: "Bo'g'izning og'izga eng yaqin yuqori qismidan qirilib, yo'g'on talaffuz qilinadi. Ustida 1 ta nuqtasi bor.",
    exampleArabic: 'خَيْرٌ',
    exampleTranslit: 'Xoyrun',
    exampleMeaningUz: 'Yaxshilik',
  },
  {
    id: 8,
    arabic: 'د',
    nameUz: 'Dal',
    soundUz: 'D (qalqala harfi)',
    zone: 'tongue',
    isQalqalah: true,
    forms: { isolated: 'د', initial: 'د', medial: 'ـد', final: 'ـد' },
    makhrajUz: "Til uchi oldingi yuqori tishlarning tubiga tegishidan chiqadi. O'zidan keyingi harfga ulanmaydi.",
    exampleArabic: 'دِينٌ',
    exampleTranslit: 'Dinun',
    exampleMeaningUz: 'Din / Jazo kuni',
  },
  {
    id: 9,
    arabic: 'ذ',
    nameUz: 'Zal',
    soundUz: 'Z (til uchi tishlar orasidan)',
    zone: 'tongue',
    forms: { isolated: 'ذ', initial: 'ذ', medial: 'ـذ', final: 'ـذ' },
    makhrajUz: "Til uchi yuqori va pastki old tishlar orasiga biroz tegib, yumshoq «z» bo'lib chiqadi.",
    exampleArabic: 'ذِكْرٌ',
    exampleTranslit: 'Zikrun',
    exampleMeaningUz: 'Zikr (eslash)',
  },
  {
    id: 10,
    arabic: 'ر',
    nameUz: 'Ro',
    soundUz: "R (fatha/dammada yo'g'on, kasrada ingichka)",
    zone: 'tongue',
    forms: { isolated: 'ر', initial: 'ر', medial: 'ـر', final: 'ـر' },
    makhrajUz: "Til uchi yuqori old tishlar milkiga tegib titrashidan chiqadi.",
    exampleArabic: 'رَحْمَةٌ',
    exampleTranslit: 'Rohmatun',
    exampleMeaningUz: 'Rahmat',
  },
  {
    id: 11,
    arabic: 'ز',
    nameUz: 'Za',
    soundUz: 'Z (hushtaksimon aniq z)',
    zone: 'tongue',
    forms: { isolated: 'ز', initial: 'ز', medial: 'ـز', final: 'ـز' },
    makhrajUz: "Til uchi pastki old tishlar ichki qismiga yaqinlashib, o'tkir «z» tovushi chiqadi.",
    exampleArabic: 'زَكَاةٌ',
    exampleTranslit: 'Zakatun',
    exampleMeaningUz: 'Zakot (poklik)',
  },
  {
    id: 12,
    arabic: 'س',
    nameUz: 'Sin',
    soundUz: 'S (ingichka aniq s)',
    zone: 'tongue',
    forms: { isolated: 'س', initial: 'سـ', medial: 'ـسـ', final: 'ـس' },
    makhrajUz: "Til uchi pastki old tishlarga yaqinlashib, hushtaksimon sof «s» chiqadi.",
    exampleArabic: 'سَلَامٌ',
    exampleTranslit: 'Salamun',
    exampleMeaningUz: 'Tinchlik / Salom',
  },
  {
    id: 13,
    arabic: 'ش',
    nameUz: 'Shin',
    soundUz: 'Sh',
    zone: 'tongue',
    forms: { isolated: 'ش', initial: 'شـ', medial: 'ـشـ', final: 'ـش' },
    makhrajUz: "Til o'rtasi tanglayga yaqinlashib, havo og'iz ichida yoyilib «sh» chiqadi. Ustida 3 ta nuqtasi bor.",
    exampleArabic: 'شُكْرٌ',
    exampleTranslit: 'Shukrun',
    exampleMeaningUz: 'Shukr',
  },
  {
    id: 14,
    arabic: 'ص',
    nameUz: 'Sod',
    soundUz: "S (yo'g'on Sod)",
    zone: 'tongue',
    isHeavy: true,
    forms: { isolated: 'ص', initial: 'صـ', medial: 'ـصـ', final: 'ـص' },
    makhrajUz: "Til uchi pastki tishlarga yaqinlashib, til orqasi yuqori tanglayga ko'tarilgan holda yo'g'on «so» talaffuz qilinadi.",
    exampleArabic: 'صَبْرٌ',
    exampleTranslit: 'Sobrun',
    exampleMeaningUz: 'Sabr',
  },
  {
    id: 15,
    arabic: 'ض',
    nameUz: 'Dod',
    soundUz: "D / Z (yo'g'on Dod)",
    zone: 'tongue',
    isHeavy: true,
    forms: { isolated: 'ض', initial: 'ضـ', medial: 'ـضـ', final: 'ـض' },
    makhrajUz: "Tilning yon qirrasi yuqori oziq tishlarga tegishidan chiqadigan yo'g'on va ulug'vor harf.",
    exampleArabic: 'ضُحًى',
    exampleTranslit: 'Duhan',
    exampleMeaningUz: 'Choshgoh vaqti',
  },
  {
    id: 16,
    arabic: 'ط',
    nameUz: 'To',
    soundUz: "T (yo'g'on To, qalqala harfi)",
    zone: 'tongue',
    isHeavy: true,
    isQalqalah: true,
    forms: { isolated: 'ط', initial: 'طـ', medial: 'ـطـ', final: 'ـط' },
    makhrajUz: "Til uchi yuqori tishlar tubiga tegib, til orqasi tanglayga ko'tarilgan holda yo'g'on «to» chiqadi.",
    exampleArabic: 'طَهُورٌ',
    exampleTranslit: 'Tohurun',
    exampleMeaningUz: 'Poklovchi',
  },
  {
    id: 17,
    arabic: 'ظ',
    nameUz: 'Zo',
    soundUz: "Z (yo'g'on, til uchi tishlar orasidan)",
    zone: 'tongue',
    isHeavy: true,
    forms: { isolated: 'ظ', initial: 'ظـ', medial: 'ـظـ', final: 'ـظ' },
    makhrajUz: "Til uchi old tishlar orasiga chiqib, til orqasi ko'tarilgan holda yo'g'on «zo» aytiladi.",
    exampleArabic: 'ظُلْمٌ',
    exampleTranslit: 'Zulmun',
    exampleMeaningUz: 'Zulm',
  },
  {
    id: 18,
    arabic: 'ع',
    nameUz: "'Ayn",
    soundUz: "'A (bo'g'iz o'rtasidan chuqur)",
    zone: 'throat',
    forms: { isolated: 'ع', initial: 'عـ', medial: 'ـعـ', final: 'ـع' },
    makhrajUz: "Bo'g'izning o'rta qismidan ovoz paychalarini biroz siqib chiqariladi.",
    exampleArabic: 'عِلْمٌ',
    exampleTranslit: "'Ilmun",
    exampleMeaningUz: 'Ilm',
  },
  {
    id: 19,
    arabic: 'غ',
    nameUz: "G'oyn",
    soundUz: "G' (yo'g'on g')",
    zone: 'throat',
    isHeavy: true,
    forms: { isolated: 'غ', initial: 'غـ', medial: 'ـغـ', final: 'ـغ' },
    makhrajUz: "Bo'g'izning yuqori qismidan yo'g'on «g'» tovushi chiqadi. Ustida 1 ta nuqtasi bor.",
    exampleArabic: 'غَفُورٌ',
    exampleTranslit: "G'ofurun",
    exampleMeaningUz: "Mag'firat qiluvchi",
  },
  {
    id: 20,
    arabic: 'ف',
    nameUz: 'Fa',
    soundUz: 'F',
    zone: 'lips',
    forms: { isolated: 'ف', initial: 'فـ', medial: 'ـفـ', final: 'ـف' },
    makhrajUz: "Yuqori old tishlarning uchi pastki labning ichki nam qismiga tegishidan chiqadi.",
    exampleArabic: 'فَلَقٌ',
    exampleTranslit: 'Falaqun',
    exampleMeaningUz: 'Tong',
  },
  {
    id: 21,
    arabic: 'ق',
    nameUz: 'Qof',
    soundUz: "Q (yo'g'on, qalqala harfi)",
    zone: 'tongue',
    isHeavy: true,
    isQalqalah: true,
    forms: { isolated: 'ق', initial: 'قـ', medial: 'ـقـ', final: 'ـق' },
    makhrajUz: "Tilning eng orqa qismi yumshoq tanglayga tegishidan yo'g'on «q» chiqadi. Ustida 2 ta nuqtasi bor.",
    exampleArabic: 'قُرْآنٌ',
    exampleTranslit: "Qur'anun",
    exampleMeaningUz: "Qur'on",
  },
  {
    id: 22,
    arabic: 'ك',
    nameUz: 'Kaf',
    soundUz: 'K (ingichka k)',
    zone: 'tongue',
    forms: { isolated: 'ك', initial: 'كـ', medial: 'ـكـ', final: 'ـك' },
    makhrajUz: "Qof harfi chiqadigan joydan biroz oldinroqdan, til orqasi qattiq tanglayga tegib yumshoq «k» chiqadi.",
    exampleArabic: 'كِتَابٌ',
    exampleTranslit: 'Kitabun',
    exampleMeaningUz: 'Kitob',
  },
  {
    id: 23,
    arabic: 'ل',
    nameUz: 'Lam',
    soundUz: 'L',
    zone: 'tongue',
    forms: { isolated: 'ل', initial: 'لـ', medial: 'ـلـ', final: 'ـل' },
    makhrajUz: "Tilning old qirrasi yuqori tishlar milkiga tegishidan chiqadi.",
    exampleArabic: 'لَيْلٌ',
    exampleTranslit: 'Laylun',
    exampleMeaningUz: 'Tun',
  },
  {
    id: 24,
    arabic: 'م',
    nameUz: 'Mim',
    soundUz: "M (ikki lab va g'unna bilan)",
    zone: 'lips',
    forms: { isolated: 'م', initial: 'مـ', medial: 'ـمـ', final: 'ـم' },
    makhrajUz: "Ikki labning bir-biriga yumshoq yopishishidan va burun dimog'idan (g'unna) chiqadi.",
    exampleArabic: 'مَسْجِدٌ',
    exampleTranslit: 'Masjidun',
    exampleMeaningUz: 'Masjid',
  },
  {
    id: 25,
    arabic: 'ن',
    nameUz: 'Nun',
    soundUz: "N (til uchi va dimog' g'unnasi bilan)",
    zone: 'nasal',
    forms: { isolated: 'ن', initial: 'نـ', medial: 'ـنـ', final: 'ـن' },
    makhrajUz: "Til uchi yuqori old tishlar milkiga tegib, ovoz dimog'dan (g'unna bilan) chiqadi.",
    exampleArabic: 'نُورٌ',
    exampleTranslit: 'Nurun',
    exampleMeaningUz: 'Nur',
  },
  {
    id: 26,
    arabic: 'ه',
    nameUz: 'Ha (Hoi havvaz)',
    soundUz: "H (ko'krak va bo'g'iz tubidan)",
    zone: 'throat',
    forms: { isolated: 'ه', initial: 'هـ', medial: 'ـهـ', final: 'ـه' },
    makhrajUz: "Bo'g'izning eng tubidan (ko'krakka yaqin joydan) nafas bilan erkin chiqadi.",
    exampleArabic: 'هُدًى',
    exampleTranslit: 'Hudan',
    exampleMeaningUz: 'Hidoyat',
  },
  {
    id: 27,
    arabic: 'و',
    nameUz: 'Vov',
    soundUz: "V / W yoki cho'ziq Ū",
    zone: 'lips',
    forms: { isolated: 'و', initial: 'و', medial: 'ـو', final: 'ـو' },
    makhrajUz: "Ikki labni oldinga dumaloq cho'chchaytirib (tishni labga tekkizmasdan) aytiladi.",
    exampleArabic: 'وُضُوءٌ',
    exampleTranslit: "Vudu'un",
    exampleMeaningUz: 'Tahorat',
  },
  {
    id: 28,
    arabic: 'ي',
    nameUz: 'Ya',
    soundUz: "Y yoki cho'ziq Ī",
    zone: 'tongue',
    forms: { isolated: 'ي', initial: 'يـ', medial: 'ـيـ', final: 'ـي' },
    makhrajUz: "Til o'rtasi tanglayga ko'tarilishidan chiqadi. Ostida 2 ta nuqtasi bor.",
    exampleArabic: 'يَوْمٌ',
    exampleTranslit: 'Yavmun',
    exampleMeaningUz: 'Kun',
  },
];

// ============================================================================
// 3. COLOR-CODED TAJWEED RULES (BLUE = QALQALAH, RED = MADD, GREEN = GHUNNAH)
// ============================================================================
export const TAJWEED_RULES: TajweedRuleLesson[] = [
  {
    id: 'qalqalah',
    titleUz: "1. Qalqala qoidasi (قُطْبُ جَدٍّ — 5 ta harf)",
    badgeUz: "🔵 Ko'k rang · Tebratib o'qish",
    colorTone: 'qalqalah',
    lettersArabic: 'ق ط ب ج د',
    summaryUz: "«Qutbu jaddin» (ق ط ب ج د) harflaridan biri sukunli bo'lib kelsa yoki oyat oxirida to'xtaganda (vaqfda) sukun bo'lib qolsa, harf maxrajidan aks-sado berib tebratib chiqariladi.",
    stepsUz: [
      "Qalqala harflari 5 ta: Qof (ق), To (ط), Ba (ب), Jim (ج), Dal (د).",
      "So'z o'rtasida sukunli kelsa — kichik qalqala (يَجْعَلْ — yaj'al).",
      "Oyat oxirida to'xtaganda kelsa — katta qalqala (أَحَدْ — ahad, الْفَلَقْ — al-falaq)."
    ],
    examples: [
      {
        arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        segments: [
          { text: 'قُلْ هُوَ اللَّهُ أَحَ' },
          { text: 'دٌ', tone: 'qalqalah' },
        ],
        translit: 'Qul huvallohu ahad',
        noteUz: "«Ahad»da to'xtaganda ko'k rangdagi Dal (دْ) qalqala qilinadi",
      },
      {
        arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
        segments: [
          { text: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَ' },
          { text: 'قِ', tone: 'qalqalah' },
        ],
        translit: "Qul a'uzu birobbil-falaq",
        noteUz: "«Falaq»da to'xtaganda ko'k rangdagi Qof (قْ) qalqala qilinadi",
      },
      {
        arabic: 'أَلَمْ يَجْعَلْ كَيْدَهُمْ',
        segments: [
          { text: 'أَلَمْ يَ' },
          { text: 'جْ', tone: 'qalqalah' },
          { text: 'عَلْ كَيْدَهُمْ' },
        ],
        translit: "Alam yaj'al kaydahum",
        noteUz: "So'z o'rtasidagi sukunli Jim (جْ) tebratib o'qiladi",
      },
    ],
  },
  {
    id: 'madd',
    titleUz: "2. Madd (Cho'zish) qoidasi — ا و ي",
    badgeUz: "🔴 Qizil rang · 2–6 harakat cho'zish",
    colorTone: 'madd',
    lettersArabic: 'ا و ي',
    summaryUz: "Fathadan keyin Alif (ـَا), Kasradan keyin sukunli Ya (ـِي), Dammadan keyin sukunli Vov (ـُو) kelsa, tovush 2 harakatdan 6 harakatgacha cho'zib o'qiladi.",
    stepsUz: [
      "Tabiiy madd (2 harakat): oddiy cho'ziq unli 2 harakat cho'ziladi (مَالِكِ — Maaliki).",
      "Muttasil / Munfasil madd (4–5 harakat): madd harfidan keyin Hamza (ء / أ) kelsa 4–5 harakat cho'ziladi (جَاءَ — Jaaa'a).",
      "Lozim madd (6 harakat): madd harfidan keyin tashdidli harf kelsa 6 harakat cho'ziladi (وَلَا الضَّالِّينَ)."
    ],
    examples: [
      {
        arabic: 'مَالِكِ يَوْمِ الدِّينِ',
        segments: [
          { text: 'مَ' },
          { text: 'ا', tone: 'madd' },
          { text: 'لِكِ يَوْمِ الدِّ' },
          { text: 'ينِ', tone: 'madd' },
        ],
        translit: 'Maaliki yavmid-diin',
        noteUz: 'Qizil rangdagi «Maa» 2 harakat, «diin» vaqfda 2–4 harakat cho\'ziladi',
      },
      {
        arabic: 'إِذَا جَاءَ نَصْرُ اللَّهِ',
        segments: [
          { text: 'إِذَ' },
          { text: 'ا', tone: 'madd' },
          { text: ' ' },
          { text: 'جَاءَ', tone: 'madd' },
          { text: ' نَصْرُ اللَّهِ' },
        ],
        translit: "Izaa jaaa'a nasrulloh",
        noteUz: '«Jaaa\'a» — Hamzali Muttasil madd (4–5 harakat cho\'ziladi)',
      },
      {
        arabic: 'وَلَا الضَّالِّينَ',
        segments: [
          { text: 'وَلَا الضَّ' },
          { text: 'الِّ', tone: 'madd' },
          { text: 'ينَ' },
        ],
        translit: 'Valad-doooolliin',
        noteUz: '«Dooool» — Tashdid kelgani uchun 6 harakat Lozim madd cho\'ziladi',
      },
    ],
  },
  {
    id: 'ghunnah-idgham',
    titleUz: "3. G'unna va Idg'om (نّ مّ hamda يَرْمُلُونَ)",
    badgeUz: "🟢 Yashil rang · Dimog'da 2 harakat",
    colorTone: 'ghunnah',
    lettersArabic: 'نّ مّ · ي ر م ل و ن',
    summaryUz: "Tashdidli Nun (نّ) va Mim (مّ), shuningdek sukunli Nun yoki Tanvindan keyin «Yanmu» (ي ن م و) harflari kelganda ovoz dimog'da 2 harakat g'unna bilan ushlab o'qiladi.",
    stepsUz: [
      "Tashdidli Nun va Mim (إِنَّ, ثُمَّ, عَمَّ) har doim 2 harakat g'unna qilinadi.",
      "Sukunli Nun (نْ) yoki Tanvindan keyin «ي ن م و» kelsa, g'unnali idg'om qilinadi (مَنْ يَعْمَلْ → May-ya'mal).",
      "«ل» va «ر» harflarida esa g'unnasiz to'liq kirgizib o'qiladi (مِنْ رَبِّهِمْ → Mir-robbihim)."
    ],
    examples: [
      {
        arabic: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
        segments: [
          { text: 'إِ' },
          { text: 'نَّ', tone: 'ghunnah' },
          { text: 'ا أَعْطَيْنَاكَ الْكَوْثَرَ' },
        ],
        translit: "Innaa a'toynaakal-kavsar",
        noteUz: "Yashil rangdagi tashdidli Nun (نَّ) 2 harakat g'unna bilan ushlanadi",
      },
      {
        arabic: 'فَمَنْ يَعْمَلْ مِثْقَالَ',
        segments: [
          { text: 'فَمَ' },
          { text: 'نْ يَ', tone: 'ghunnah' },
          { text: 'عْمَلْ مِثْقَالَ' },
        ],
        translit: "Famay-ya'mal misqoola",
        noteUz: "«Man ya'mal» → «May-ya'mal» (2 harakat g'unnali idg'om)",
      },
      {
        arabic: 'مِنْ رَبِّهِمْ',
        segments: [
          { text: 'مِ' },
          { text: 'نْ رَ', tone: 'ghunnah' },
          { text: 'بِّهِمْ' },
        ],
        translit: 'Mir-robbihim',
        noteUz: "«Min robbihim» → «Mir-robbihim» (Ro harfiga kirgizib o'qiladi)",
      },
    ],
  },
  {
    id: 'iqlab-ikhfa',
    titleUz: "4. Iqlob (ب) va Ixfo (15 ta harfda yashirin g'unna)",
    badgeUz: "🟢 Yashil rang · Iqlob va Ixfo",
    colorTone: 'ghunnah',
    lettersArabic: 'ب · ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك',
    summaryUz: "Sukunli Nun (نْ) yoki Tanvindan keyin Ba (ب) kelsa «m» ga aylanadi (Iqlob). Qolgan 15 ta harfdan biri kelsa, tilni tanglayga bosmasdan 2 harakat yashirin g'unna qilinadi (Ixfo).",
    stepsUz: [
      "Iqlob: «مِنْ بَعْدِ» → «Mim-ba'di» (Nun «Mim»ga aylanib 2 harakat g'unna qilinadi).",
      "Ixfo: «مِنْ شَرِّ» → «Min-sharri» (Nun yashirilib, dimog'da 2 harakat g'unna qilinadi)."
    ],
    examples: [
      {
        arabic: 'مِنْ بَعْدِ',
        segments: [
          { text: 'مِ' },
          { text: 'نْ بَ', tone: 'ghunnah' },
          { text: 'عْدِ' },
        ],
        translit: "Mim-ba'di",
        noteUz: "Iqlob: Ba (ب) oldidan Nun tovushi «Mim»ga aylanadi",
      },
      {
        arabic: 'مِنْ شَرِّ مَا خَلَقَ',
        segments: [
          { text: 'مِ' },
          { text: 'نْ شَ', tone: 'ghunnah' },
          { text: 'رِّ مَا خَلَ' },
          { text: 'قَ', tone: 'qalqalah' },
        ],
        translit: 'Min-sharri maa xolaq',
        noteUz: "«Min-sharri»da yashil Ixfo g'unnasi, «xolaq» oxirida ko'k Qalqala",
      },
      {
        arabic: 'وَأَنْتُمْ تَعْلَمُونَ',
        segments: [
          { text: 'وَأَ' },
          { text: 'نْتُ', tone: 'ghunnah' },
          { text: 'مْ تَعْلَمُونَ' },
        ],
        translit: "Va an-tum ta'lamuun",
        noteUz: "«An-tum»da Ta (ت) harfi oldidan 2 harakat Ixfo qilinadi",
      },
    ],
  },
  {
    id: 'izhar',
    titleUz: "5. Izhor — 6 ta bo'g'iz harfi oldidan aniq o'qish",
    badgeUz: "⚪ G'unnasiz · Aniq talaffuz",
    colorTone: 'clear',
    lettersArabic: 'ء ه ع ح غ خ',
    summaryUz: "Sukunli Nun (نْ) yoki Tanvindan keyin 6 ta bo'g'iz harflaridan biri (ء ه ع ح غ خ) kelsa, «n» tovushi cho'zilmasdan, g'unnasiz va aniq talaffuz qilinadi.",
    stepsUz: [
      "Bo'g'iz harflari 6 ta: Hamza (ء), Ha (ه), 'Ayn (ع), Ha (ح), G'oyn (غ), Xo (خ)."
    ],
    examples: [
      {
        arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ',
        segments: [
          { text: 'صِرَاطَ الَّذِينَ أَ' },
          { text: 'نْعَ', tone: 'clear' },
          { text: 'مْتَ عَلَيْهِمْ' },
        ],
        translit: "Sirootollaziina an'amta 'alayhim",
        noteUz: "«An'amta» — Nun'dan keyin 'Ayn (ع) kelgani uchun aniq o'qiladi",
      },
      {
        arabic: 'وَآمَنَهُمْ مِنْ خَوْفٍ',
        segments: [
          { text: 'وَآمَنَهُمْ مِ' },
          { text: 'نْ خَ', tone: 'clear' },
          { text: 'وْفٍ' },
        ],
        translit: 'Va aamanahum min xovf',
        noteUz: "«Min xovf» — Nun'dan keyin Xo (خ) kelgani uchun aniq o'qiladi",
      },
    ],
  },
];

export const HARAKAT_LESSONS: HarakatLesson[] = [
  {
    id: 'fatha',
    symbolArabic: 'بَ',
    titleUz: 'Fatha (Zabar) — Harf ustidagi qiya chiziqcha',
    ruleUz: "Harf ustiga qo'yiladi va ingichka harflarni «A», yo'g'on harflarni (خ ص ض ط ظ غ ق) esa «O» unlisiga moyil qilib o'qitadi.",
    examples: [
      { arabic: 'بَ تَ ثَ', reading: 'Ba - Ta - Sa' },
      { arabic: 'صَ طَ قَ', reading: 'So - To - Qo' },
      { arabic: 'كَتَبَ', reading: 'Ka-ta-ba' },
    ],
  },
  {
    id: 'kasra',
    symbolArabic: 'بِ',
    titleUz: 'Kasra (Zer) — Harf ostidagi qiya chiziqcha',
    ruleUz: "Harf ostiga qo'yiladi va harfni «I» unlisi bilan o'qitadi.",
    examples: [
      { arabic: 'بِ تِ سِ', reading: 'Bi - Ti - Si' },
      { arabic: 'بِسْمِ', reading: 'Bismi' },
      { arabic: 'عَلِمَ', reading: "'A-li-ma" },
    ],
  },
  {
    id: 'damma',
    symbolArabic: 'بُ',
    titleUz: 'Damma (Pesh) — Harf ustidagi «و» shaklli belgi',
    ruleUz: "Harf ustiga qo'yiladi va lablarni oldinga jamlab «U» unlisi bilan o'qitadi.",
    examples: [
      { arabic: 'بُ تُ نُ', reading: 'Bu - Tu - Nu' },
      { arabic: 'كُتُبُ', reading: 'Ku-tu-bu' },
      { arabic: 'رُسُلُ', reading: 'Ru-su-lu' },
    ],
  },
  {
    id: 'sukun',
    symbolArabic: 'بْ',
    titleUz: "Sukun (Jazm) — Unlisiz tinch o'qish belgisi",
    ruleUz: "Ustida sukun (ـْ) bo'lgan harf o'zidan oldingi harakatli harfga urilib, unlisiz to'xtab o'qiladi.",
    examples: [
      { arabic: 'أَبْ إِبْ أُبْ', reading: 'Ab - Ib - Ub' },
      { arabic: 'الْحَمْدُ', reading: 'Al-ham-du' },
      { arabic: 'نَعْبُدُ', reading: "Na'-bu-du" },
    ],
  },
  {
    id: 'tashdid',
    symbolArabic: 'بّ',
    titleUz: "Tashdid (Shadda) — Harfni ikkilantirib o'qish",
    ruleUz: "Ustida tashdid (ـّ) bo'lgan harf ikki marta (birinchisi sukunli, ikkinchisi harakatli) kuch bilan o'qiladi. Nun (نّ) va Mim (مّ) tashdidli kelsa, 2 harakat g'unna qilinadi.",
    examples: [
      { arabic: 'رَبِّ', reading: 'Rob-bi' },
      { arabic: 'إِنَّ', reading: "In-na (g'unna)" },
      { arabic: 'ثُمَّ', reading: "Sum-ma (g'unna)" },
    ],
  },
  {
    id: 'tanwin',
    symbolArabic: 'بً بٍ بٌ',
    titleUz: 'Tanvin — Ikki zabar (-an), ikki zer (-in), ikki pesh (-un)',
    ruleUz: "So'z oxirida kelib, harf oxiriga sukunli «n» (نْ) tovushini qo'shadi: ـً (-an/-on), ـٍ (-in), ـٌ (-un).",
    examples: [
      { arabic: 'أَحَدٌ', reading: 'Ahadun' },
      { arabic: 'عَلِيمًا', reading: "'Aliman" },
      { arabic: 'سَلَامٍ', reading: 'Salamin' },
    ],
  },
];
