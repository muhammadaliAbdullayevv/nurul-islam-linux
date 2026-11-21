import { AppLanguage, DuaItem, TasbihPreset } from '../types';
import { latinToCyrillicUz } from '../utils/uzbekScript';

export const TASBIH_PRESETS: TasbihPreset[] = [
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'SubhanAllah',
    translation: 'Glory be to Allah',
    target: 33,
    meaning: 'Declaring Allah free of all imperfections.',
    category: 'praise',
    uz: {
      transliteration: 'Subhanalloh',
      translation: 'Alloh barcha nuqsonlardan pokdir',
      meaning: 'Allohni barcha aybu nuqsonlardan poklab yod etish.',
    },
    ru: {
      transliteration: 'Субханаллах',
      translation: 'Пречист Аллах от всех недостатков',
      meaning: 'Восхваление и очищение Всевышнего от любых изъянов.',
    },
  },
  {
    id: 'alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    translation: 'All praise is due to Allah',
    target: 33,
    meaning: 'Acknowledging every blessing with gratitude.',
    category: 'praise',
    uz: {
      transliteration: 'Alhamdulillah',
      translation: 'Barcha hamdu sanolar Allohga xosdir',
      meaning: "Har bir ne'mat uchun Allohga shukr aytish.",
    },
    ru: {
      transliteration: 'Альхамдулиллях',
      translation: 'Вся хвала принадлежит Аллаху',
      meaning: 'Благодарность Аллаху за каждую милость.',
    },
  },
  {
    id: 'allahuakbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    translation: 'Allah is the Greatest',
    target: 34,
    meaning: 'Allah is greater than any fear, problem or power.',
    category: 'praise',
    uz: {
      transliteration: 'Allohu Akbar',
      translation: 'Alloh hammadan buyukdir',
      meaning: 'Alloh barcha narsadan ulug‘ va qudratlidir.',
    },
    ru: {
      transliteration: 'Аллаху Акбар',
      translation: 'Аллах Превелик',
      meaning: 'Величие Аллаха превыше всего сущего.',
    },
  },
  {
    id: 'astaghfirullah',
    arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    transliteration: 'Astaghfirullah wa atubu ilayh',
    translation: 'I seek forgiveness from Allah and turn to Him',
    target: 100,
    meaning: 'Removes sorrow and cleanses the heart.',
    category: 'forgiveness',
    uz: {
      transliteration: "Astag'firulloh va atubu ilayh",
      translation: "Allohdan mag'firat so'rayman va Unga tavba qilaman",
      meaning: "G'am-tashvishni ketkazib, qalbni poklaydi.",
    },
    ru: {
      transliteration: 'Астагфируллах ва атубу иляйх',
      translation: 'Прошу прощения у Аллаха и каюсь перед Ним',
      meaning: 'Очищает сердце и приносит душевный покой.',
    },
  },
  {
    id: 'lailahaillallah',
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    transliteration: 'La ilaha illallahu wahdahu la shareeka lah',
    translation: 'There is no deity except Allah alone',
    target: 100,
    meaning: 'The best remembrance and declaration of pure monotheism.',
    category: 'daily',
    uz: {
      transliteration: 'La ilaha illallohu vahdahu la sharika lah',
      translation: "Yolg'iz Allohdan o'zga iloh yo'q, Uning sherigi ham yo'q",
      meaning: 'Zikrlarning eng afzali va tavhid kalimasi.',
    },
    ru: {
      transliteration: 'Ля иляха илляллаху вахдаху ля шарика лях',
      translation: 'Нет божества, кроме одного Аллаха, нет у Него сотоварища',
      meaning: 'Лучшее поминание и свидетельство единобожия.',
    },
  },
  {
    id: 'salawat',
    arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ',
    transliteration: "Allahumma salli 'ala Muhammadin wa 'ala ali Muhammad",
    translation: 'O Allah, send blessings upon Muhammad and his family',
    target: 100,
    meaning: 'Invites ten blessings from Allah for each salawat recited.',
    category: 'salawat',
    uz: {
      transliteration: 'Allohumma solli ala Muhammadin va ala oli Muhammad',
      translation: 'Allohim, Muhammadga va ul zotning oilasiga salovot yubor',
      meaning: 'Har bir salovot uchun Allohdan o‘n barobar rahmat yog‘iladi.',
    },
    ru: {
      transliteration: 'Аллахумма салли аля Мухаммадин ва аля али Мухаммад',
      translation: 'О Аллах, благослови Мухаммада и семейство Мухаммада',
      meaning: 'За каждый салават Аллах ниспосылает десять благословений.',
    },
  },
  {
    id: 'hawqala',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ',
    transliteration: "La hawla wa la quwwata illa billahil 'Aliyyil 'Adheem",
    translation: 'There is no power nor strength except through Allah',
    target: 33,
    meaning: 'A treasure from the treasures of Paradise.',
    category: 'daily',
    uz: {
      transliteration: 'La havla va la quvvata illa billahil Aliyyil Aziym',
      translation: 'Oliy va Buyuk Allohdan o‘zga kuch va qudrat yo‘q',
      meaning: 'Jannat xazinalaridan biri bo‘lgan muborak kalima.',
    },
    ru: {
      transliteration: 'Ля хауля ва ля куввата илля билляхиль-Алиййиль-Азым',
      translation: 'Нет мощи и силы ни у кого, кроме Высокого и Великого Аллаха',
      meaning: 'Одно из сокровищ Рая.',
    },
  },
];

export const GUIDE_EXTRA_PRESETS: TasbihPreset[] = [
  {
    id: 'subhanallah_bihamdihi',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ',
    transliteration: "SubhanAllahi wa bihamdihi, SubhanAllahil 'Adheem",
    translation: 'Glory and praise be to Allah, Glory be to Allah the Supreme',
    target: 100,
    meaning: 'Two phrases light on the tongue, heavy on the Scale of deeds, and beloved to the Most Merciful.',
    category: 'praise',
    uz: {
      transliteration: 'Subhanallohi va bihamdihi, Subhanallohil Aziym',
      translation: 'Allohga hamd bilan Uni poklayman, Buyuk Alloh barcha nuqsonlardan pokdir',
      meaning: "Tilda yengil, mezon tarozisida og'ir va Rahmonga eng mahbub bo'lgan ikki kalima.",
    },
    ru: {
      transliteration: 'Субханаллахи ва бихамдихи, Субханаллахиль-Азым',
      translation: 'Пречист Аллах и хвала Ему, Пречист Аллах Великий',
      meaning: 'Два слова, лёгких на языке, тяжёлых на Весах деяний и любимых Милостивым.',
    },
  },
  {
    id: 'hasbunallah',
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    transliteration: "Hasbunallahu wa ni'mal wakeel",
    translation: 'Sufficient for us is Allah, and He is the best Disposer of affairs',
    target: 33,
    meaning: 'Recited when facing worry, hardship, or trusting Allah completely.',
    category: 'daily',
    uz: {
      transliteration: "Hasbunallohu va ni'mal vakil",
      translation: 'Bizga Allohning O‘zi kifoya, U qanday ham yaxshi vakil!',
      meaning: "Qiyinchilik, xavotir va tashvish chog'larida Allohga tavakkal qilish zikri.",
    },
    ru: {
      transliteration: 'Хасбуналлаху ва нималь-вакиль',
      translation: 'Достаточно нам Аллаха, и как прекрасен этот Покровитель!',
      meaning: 'Читается в трудную минуту и при уповании на Всевышнего.',
    },
  },
];

export const ALL_TASBIH_PRESETS: TasbihPreset[] = [...TASBIH_PRESETS, ...GUIDE_EXTRA_PRESETS];

export interface ZikrGuideItem {
  id: string;
  situation: string;
  whenToSay: string;
  virtue: string;
  countLabel: string;
  presetIds: string[]; // Multi-step if >1 (e.g. ['subhanallah', 'alhamdulillah', 'allahuakbar'])
}

export function getZikrGuideItems(lang: AppLanguage): ZikrGuideItem[] {
  const uzLatItems: ZikrGuideItem[] = [
    {
      id: 'after-prayer',
      situation: 'Namozdan keyingi sunnat tasbeh',
      whenToSay: 'Har bir farz namozdan so‘ng ketma-ket aytiladi',
      virtue: '33 marta Subhanalloh, 33 marta Alhamdulillah va 33–34 marta Allohu Akbar (avtomatik ketma-ket o‘tadi).',
      countLabel: '33 → 33 → 34',
      presetIds: ['subhanallah', 'alhamdulillah', 'allahuakbar'],
    },
    {
      id: 'before-sleep',
      situation: 'Uyqudan oldingi zikr (Fotima tasbehi)',
      whenToSay: 'Kechqurun yotishdan avval o‘qiladi',
      virtue: 'Charchoqni ketkazib, ertangi kunga kuch-quvvat va qalb xotirjamligini beradi.',
      countLabel: '33 → 33 → 34',
      presetIds: ['subhanallah', 'alhamdulillah', 'allahuakbar'],
    },
    {
      id: 'stress-worry',
      situation: 'Tashvish, qo‘rquv va qiyinchilikda',
      whenToSay: 'Siqilganingizda yoki mushkul holatda aytiladi',
      virtue: 'Allohga tavakkalni mustahkamlab, qalbga xotirjamlik va yechim olib kiradi.',
      countLabel: '33',
      presetIds: ['hasbunallah'],
    },
    {
      id: 'strength-energy',
      situation: 'Kuch-quvvat va yengillik so‘rash',
      whenToSay: 'Ishga kirishganda yoki charchaganda',
      virtue: 'Payg‘ambarimiz ﷺ bu kalimani Jannat xazinalaridan biri deb marhamat qilganlar.',
      countLabel: '33',
      presetIds: ['hawqala'],
    },
    {
      id: 'forgiveness',
      situation: 'Gunohlar kechirilishi va baraka (Istig‘for)',
      whenToSay: 'Kun davomida kamida 100 marta',
      virtue: 'G‘am-tashvishdan xalos qiladi, rizqni kengaytiradi va qalbni poklaydi.',
      countLabel: '100',
      presetIds: ['astaghfirullah'],
    },
    {
      id: 'heavy-reward',
      situation: 'Tarozida eng og‘ir va oson zikr',
      whenToSay: 'Yo‘lda, bo‘sh vaqtda va tong-kechda',
      virtue: 'Tongda va kechda 100 martadan aytilganda ulkan savob va mag‘firat va’da qilingan.',
      countLabel: '100',
      presetIds: ['subhanallah_bihamdihi'],
    },
    {
      id: 'friday-salawat',
      situation: 'Juma kuni va Payg‘ambarimiz ﷺ ga Salovat',
      whenToSay: 'Ayniqsa Juma kuni va duodan oldin',
      virtue: 'Bitta salovot aytgan kishiga Alloh o‘nta rahmat yuboradi.',
      countLabel: '100',
      presetIds: ['salawat'],
    },
  ];

  if (lang === 'uz_cyr') {
    return uzLatItems.map((item) => ({
      ...item,
      situation: latinToCyrillicUz(item.situation),
      whenToSay: latinToCyrillicUz(item.whenToSay),
      virtue: latinToCyrillicUz(item.virtue),
    }));
  }

  if (lang === 'ru') {
    return [
      {
        id: 'after-prayer',
        situation: 'Сунна тасбих после намаза',
        whenToSay: 'Сразу после каждого обязательного намаза',
        virtue: 'Последовательность 33 × Субханаллах → 33 × Альхамдулиллях → 34 × Аллаху Акбар (переключается автоматически).',
        countLabel: '33 → 33 → 34',
        presetIds: ['subhanallah', 'alhamdulillah', 'allahuakbar'],
      },
      {
        id: 'before-sleep',
        situation: 'Перед сном (Тасбих Фатимы)',
        whenToSay: 'Вечером перед тем, как уснуть',
        virtue: 'Укрепляет силы на следующий день и дарует спокойствие сердца.',
        countLabel: '33 → 33 → 34',
        presetIds: ['subhanallah', 'alhamdulillah', 'allahuakbar'],
      },
      {
        id: 'stress-worry',
        situation: 'При тревоге, страхе и трудностях',
        whenToSay: 'Когда тяжело на душе или перед важным делом',
        virtue: 'Укрепляет упование на Аллаха и приносит внутреннее облегчение.',
        countLabel: '33',
        presetIds: ['hasbunallah'],
      },
      {
        id: 'strength-energy',
        situation: 'Для сил и помощи Всевышнего',
        whenToSay: 'В течение дня и при усталости',
        virtue: 'Пророк ﷺ назвал эти слова одним из сокровищ Рая.',
        countLabel: '33',
        presetIds: ['hawqala'],
      },
      {
        id: 'forgiveness',
        situation: 'Прощение грехов и благодать (Истигфар)',
        whenToSay: 'Ежедневно по 100 раз',
        virtue: 'Снимает тревогу, очищает сердце и открывает пути удела.',
        countLabel: '100',
        presetIds: ['astaghfirullah'],
      },
      {
        id: 'heavy-reward',
        situation: 'Лёгкий зикр с огромной наградой',
        whenToSay: 'Утром, вечером или в дороге',
        virtue: 'Лёгкие на языке и тяжёлые на Весах деяний слова восхваления.',
        countLabel: '100',
        presetIds: ['subhanallah_bihamdihi'],
      },
      {
        id: 'friday-salawat',
        situation: 'В пятницу и благословение Пророку ﷺ',
        whenToSay: 'Особенно в пятницу и перед дуа',
        virtue: 'За каждый салават Аллах ниспосылает десять благословений.',
        countLabel: '100',
        presetIds: ['salawat'],
      },
    ];
  }

  if (lang === 'en') {
    return [
      {
        id: 'after-prayer',
        situation: 'After-Prayer Sunnah Set',
        whenToSay: 'Right after each obligatory prayer',
        virtue: 'Recite 33 × SubhanAllah → 33 × Alhamdulillah → 34 × Allahu Akbar (auto-advances step by step).',
        countLabel: '33 → 33 → 34',
        presetIds: ['subhanallah', 'alhamdulillah', 'allahuakbar'],
      },
      {
        id: 'before-sleep',
        situation: 'Before Sleep (Tasbih Fatimah)',
        whenToSay: 'At night before going to sleep',
        virtue: 'Prophetic remedy for daily exhaustion, bringing strength and peace.',
        countLabel: '33 → 33 → 34',
        presetIds: ['subhanallah', 'alhamdulillah', 'allahuakbar'],
      },
      {
        id: 'stress-worry',
        situation: 'During Anxiety, Worry & Hardship',
        whenToSay: 'Whenever stressed, anxious, or uncertain',
        virtue: 'Strengthens reliance on Allah and brings calm reassurance to the heart.',
        countLabel: '33',
        presetIds: ['hasbunallah'],
      },
      {
        id: 'strength-energy',
        situation: 'Seeking Strength & Ease',
        whenToSay: 'When starting tasks or feeling overwhelmed',
        virtue: 'Described by the Prophet ﷺ as one of the treasures of Paradise.',
        countLabel: '33',
        presetIds: ['hawqala'],
      },
      {
        id: 'forgiveness',
        situation: 'Seeking Forgiveness & Relief (Istighfar)',
        whenToSay: 'Daily (recommended 100 times)',
        virtue: 'Cleanses sins, relieves grief, and brings continuous provision and mercy.',
        countLabel: '100',
        presetIds: ['astaghfirullah'],
      },
      {
        id: 'heavy-reward',
        situation: 'Light Words, Heavy on the Scale',
        whenToSay: 'Anytime — morning, evening, or commuting',
        virtue: 'Two short phrases beloved to the Most Merciful with immense reward.',
        countLabel: '100',
        presetIds: ['subhanallah_bihamdihi'],
      },
      {
        id: 'friday-salawat',
        situation: 'Friday Sunnah & Salawat on the Prophet ﷺ',
        whenToSay: 'Especially on Fridays and before making Dua',
        virtue: 'Allah sends ten blessings upon whoever sends one blessing upon the Prophet ﷺ.',
        countLabel: '100',
        presetIds: ['salawat'],
      },
    ];
  }

  return uzLatItems;
}

export function getLocalizedTasbihPreset(preset: TasbihPreset, lang: AppLanguage) {
  if (lang === 'en') {
    return {
      transliteration: preset.transliteration,
      translation: preset.translation,
      meaning: preset.meaning || '',
    };
  }
  if (lang === 'uz_lat' && preset.uz) {
    return {
      transliteration: preset.uz.transliteration,
      translation: preset.uz.translation,
      meaning: preset.uz.meaning || '',
    };
  }
  if (lang === 'uz_cyr' && preset.uz) {
    return {
      transliteration: latinToCyrillicUz(preset.uz.transliteration),
      translation: latinToCyrillicUz(preset.uz.translation),
      meaning: latinToCyrillicUz(preset.uz.meaning || ''),
    };
  }
  if (lang === 'ru' && preset.ru) {
    return {
      transliteration: preset.ru.transliteration,
      translation: preset.ru.translation,
      meaning: preset.ru.meaning || '',
    };
  }
  return {
    transliteration: preset.transliteration,
    translation: preset.translation,
    meaning: preset.meaning || '',
  };
}

export const DAILY_AZKAR: DuaItem[] = [
  {
    id: 'morning-1',
    category: 'morning',
    title: 'Sayyid al-Istighfar (Master Supplication)',
    titleUz: 'Sayyidul Istig‘for (Istig‘forlarning sayyidi)',
    titleRu: 'Саййидуль-Истигфар (Господин покаяния)',
    arabic:
      'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration:
      "Allahumma Anta Rabbi la ilaha illa Anta, khalaqtani wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika mastata'tu, a'udhu bika min sharri ma sana'tu, abu'u laka bini'matika 'alayya, wa abu'u bidhanbi faghfir li, fa-innahu la yaghfiru dh-dhunuba illa Anta.",
    translation:
      'O Allah, You are my Lord, there is no deity worthy of worship except You. You created me and I am Your servant... So forgive me, for none can forgive sins except You.',
    translationUz:
      "Allohim, Sen mening Robbimsan. Sendan o'zga iloh yo'q. Meni Sen yaratding va men Sening bandangman. Qudratim yetgunicha Sening ahding va va'dangdaman. Qilgan yomon ishlardan Sendan panoh so'rayman. Menga bergan ne'matlaringni e'tirof etaman va gunohlarimni ham tan olaman. Meni kechirgin, zero gunohlarni faqat Sen kechirasan.",
    translationRu:
      'О Аллах, Ты — мой Господь, и нет божества, кроме Тебя. Ты сотворил меня, и я — Твой раб... Прости же меня, ибо никто не прощает грехи, кроме Тебя.',
    reference: 'Sahih al-Bukhari 6306',
    repeatCount: 1,
  },
  {
    id: 'morning-2',
    category: 'morning',
    title: 'Protection Against All Harm',
    titleUz: 'Har qanday balo-qazodan panoh duosi',
    titleRu: 'Защита от всякого вреда',
    arabic:
      'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration:
      "Bismillahi l-ladhi la yadurru ma'as-mihi shay'un fil-ardi wa la fis-sama'i wa Huwas-Sami'ul-'Alim",
    translation:
      'In the name of Allah, with whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, All-Knowing.',
    translationUz:
      "Allohning nomi bilan boshlaymanki, Uning ismi bilan na yerda va na osmonda hech narsa zarar yetkaza olmaydi. U Eshituvchi va Biluvchidir.",
    translationRu:
      'С именем Аллаха, с именем Которого ничто не причинит вреда ни на земле, ни на небе, и Он — Слышащий, Знающий.',
    reference: 'Sunan Abi Dawud 5088',
    repeatCount: 3,
  },
  {
    id: 'morning-3',
    category: 'morning',
    title: 'Praise Equal to Creation',
    titleUz: 'Allohga cheksiz tasbeh va hamd',
    titleRu: 'Восхваление по числу творений',
    arabic:
      'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ',
    transliteration:
      "Subhan Allahi wa bihamdihi, 'adada khalqihi, wa rida nafsihi, wa zinata 'arshihi, wa midada kalimatih",
    translation:
      'Glory be to Allah and His is the praise, equal to the number of His creation, the pleasure of His Self, the weight of His Throne, and the ink of His words.',
    translationUz:
      "Allohga maxluqotlari sonicha, O'zining roziligicha, Arshining vaznicha va kalimalari siyohicha hamdu tasbeh aytaman.",
    translationRu:
      'Слава Аллаху и хвала Ему столько раз, сколько существует Его творений, сколько доставит Ему удовольствие, сколько весит Его Трон и сколько чернил нужно для записи Его слов.',
    reference: 'Sahih Muslim 2726',
    repeatCount: 3,
  },
  {
    id: 'rabbana-1',
    category: 'rabbana',
    title: 'Good in Both Worlds',
    titleUz: 'Ikki dunyo saodati duosi',
    titleRu: 'Благо в этом мире и в вечной жизни',
    arabic:
      'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transliteration:
      "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar",
    translation:
      'Our Lord, give us in this world that which is good and in the Hereafter that which is good and protect us from the punishment of the Fire.',
    translationUz:
      "Ey Robbimiz, bizga bu dunyoda ham yaxshilik bergin, oxiratda ham yaxshilik bergin va bizni do'zax azobidan saqla.",
    translationRu:
      'Господь наш! Одари нас добром в этом мире и добром в Последней жизни и защити нас от мучений в Огне.',
    reference: 'Baqara 2:201',
    repeatCount: 1,
  },
  {
    id: 'rabbana-2',
    category: 'rabbana',
    title: 'Steadfastness of Heart',
    titleUz: 'Qalb sobitligi duosi',
    titleRu: 'Стойкость сердца на истине',
    arabic:
      'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً ۚ إِنَّكَ أَنتَ الْوَهَّابُ',
    transliteration:
      "Rabbana la tuzigh qulubana ba'da idh hadaytana wa hab lana min ladunka rahmah, innaka Antal-Wahhab",
    translation:
      'Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy. Indeed, You are the Bestower.',
    translationUz:
      "Ey Robbimiz, bizni hidoyat qilganingdan so'ng qalblarimizni toydirma va bizga O'z huzuringdan rahmat ato et. Albatta, Sen ko'plab ato etuvchisan.",
    translationRu:
      'Господь наш! Не уклоняй наши сердца в сторону после того, как Ты наставил нас на прямой путь, и даруй нам милость от Себя, ведь Ты — Дарующий!',
    reference: 'Oli Imron 3:8',
    repeatCount: 1,
  },
  {
    id: 'rabbana-3',
    category: 'rabbana',
    title: 'Dua for Parents',
    titleUz: 'Ota-ona haqiga duo',
    titleRu: 'Молитва за родителей',
    arabic: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    transliteration: 'Rabbi r-hamhuma kama rabbayani sagheera',
    translation:
      'My Lord, have mercy upon them as they brought me up when I was small.',
    translationUz:
      "Ey Robbim, ular meni go'dakligimda tarbiya qilganlaridek, Sen ham ularga rahm qilgin.",
    translationRu:
      'Господи! Помилуй их, ведь они растили меня ребёнком.',
    reference: 'Isro 17:24',
    repeatCount: 3,
  },
];

export function getLocalizedDuaItem(dua: DuaItem, lang: AppLanguage) {
  if (lang === 'en') {
    return {
      title: dua.title,
      translation: dua.translation,
    };
  }
  if (lang === 'uz_lat') {
    return {
      title: dua.titleUz || dua.title,
      translation: dua.translationUz || dua.translation,
    };
  }
  if (lang === 'uz_cyr') {
    return {
      title: latinToCyrillicUz(dua.titleUz || dua.title),
      translation: latinToCyrillicUz(dua.translationUz || dua.translation),
    };
  }
  return {
    title: dua.titleRu || dua.title,
    translation: dua.translationRu || dua.translation,
  };
}
