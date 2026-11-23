import { AppLanguage } from '../types';

export type RadioCategory = 'all' | 'reciters' | 'haramain' | 'calm' | 'favorites';

export interface QuranRadioStation {
  id: string;
  category: 'reciters' | 'haramain' | 'calm';
  arabicName: string;
  name: Record<AppLanguage, string>;
  subtitle: Record<AppLanguage, string>;
  accent: 'emerald' | 'amber' | 'teal' | 'indigo';
  /** Verified primary + automatic failover live HTTPS MP3 stream URLs */
  streamUrls: string[];
}

export const QURAN_RADIO_STATIONS: QuranRadioStation[] = [
  {
    id: 'mishary',
    category: 'reciters',
    arabicName: 'مشاري راشد العفاسي',
    name: {
      uz_lat: 'Mishari Rashid Al-Afasiy',
      uz_cyr: 'Мишари Рашид Ал-Афасий',
      en: 'Mishary Rashid Al-Afasy',
      ru: 'Мишари Рашид Аль-Афаси',
    },
    subtitle: {
      uz_lat: '24/7 Murattal · Quvayt',
      uz_cyr: '24/7 Мураттал · Қувайт',
      en: '24/7 Murattal · Kuwait',
      ru: '24/7 Муратталь · Кувейт',
    },
    accent: 'emerald',
    streamUrls: [
      'https://qurango.net/radio/mishary_alafasi',
      'https://stream.radiojar.com/8s5u5tpdtwzuv',
    ],
  },
  {
    id: 'makkah_haram',
    category: 'haramain',
    arabicName: 'إذاعة القرآن الكريم — مكة المكرمة',
    name: {
      uz_lat: 'Makka Harami Radiosi',
      uz_cyr: 'Макка Ҳарами Радиоси',
      en: 'Makkah Quran Radio Live',
      ru: 'Радио Корана — Мекка',
    },
    subtitle: {
      uz_lat: '24/7 Jonli efir · Masjidul Harom',
      uz_cyr: '24/7 Жонли эфир · Масжидул Ҳаром',
      en: '24/7 Live Broadcast · Makkah',
      ru: '24/7 Прямой эфир · Мекка',
    },
    accent: 'amber',
    streamUrls: [
      'https://stream.radiojar.com/0tpy1h0kxtzuv',
      'https://qurango.net/radio/abdulrahman_alsudaes',
    ],
  },
  {
    id: 'yasser',
    category: 'haramain',
    arabicName: 'ياسر الدوسري',
    name: {
      uz_lat: 'Yosir Ad-Dosariy',
      uz_cyr: 'Ёсир Ад-Досарий',
      en: 'Yasser Al-Dosari',
      ru: 'Ясир Ад-Досари',
    },
    subtitle: {
      uz_lat: 'Masjidul Harom imomi · Ta’sirli qiroat',
      uz_cyr: 'Масжидул Ҳаром имоми · Таъсирли қироат',
      en: 'Imam of Makkah · Soulful Recitation',
      ru: 'Имам Заповедной мечети · Мекка',
    },
    accent: 'emerald',
    streamUrls: [
      'https://qurango.net/radio/yasser_aldosari',
      'https://backup.qurango.net/radio/yasser_aldosari',
    ],
  },
  {
    id: 'maher',
    category: 'haramain',
    arabicName: 'ماهر المعيقلي',
    name: {
      uz_lat: 'Mohir Al-Muayqiliy',
      uz_cyr: 'Моҳир Ал-Муайқилий',
      en: 'Maher Al-Muaiqly',
      ru: 'Махер Аль-Муайкли',
    },
    subtitle: {
      uz_lat: 'Masjidul Harom imomi · Ravon qiroat',
      uz_cyr: 'Масжидул Ҳаром имоми · Равон қироат',
      en: 'Imam of Makkah · Calm Murattal',
      ru: 'Имам Заповедной мечети · Спокойное чтение',
    },
    accent: 'teal',
    streamUrls: [
      'https://qurango.net/radio/maher',
      'https://backup.qurango.net/radio/maher',
    ],
  },
  {
    id: 'sudais',
    category: 'haramain',
    arabicName: 'عبدالرحمن السديس',
    name: {
      uz_lat: 'Abdurahmon As-Sudays',
      uz_cyr: 'Абдураҳмон Ас-Судайс',
      en: 'Abdulrahman Al-Sudais',
      ru: 'Абдуррахман Ас-Судайс',
    },
    subtitle: {
      uz_lat: 'Haramayn bosh imomi · Makka',
      uz_cyr: 'Ҳарамайн бош имоми · Макка',
      en: 'Chief Imam of Haramain · Makkah',
      ru: 'Главный имам Харамайна · Мекка',
    },
    accent: 'amber',
    streamUrls: [
      'https://qurango.net/radio/abdulrahman_alsudaes',
      'https://backup.qurango.net/radio/abdulrahman_alsudaes',
    ],
  },
  {
    id: 'shuraim',
    category: 'haramain',
    arabicName: 'سعود الشريم',
    name: {
      uz_lat: 'Saud Ash-Shuraym',
      uz_cyr: 'Сауд Аш-Шурайм',
      en: 'Saud Al-Shuraim',
      ru: 'Сауд Аш-Шурайм',
    },
    subtitle: {
      uz_lat: 'Masjidul Harom · Klassik uslub',
      uz_cyr: 'Масжидул Ҳаром · Классик услуб',
      en: 'Masjid al-Haram · Classic Style',
      ru: 'Масджид аль-Харам · Классика',
    },
    accent: 'emerald',
    streamUrls: [
      'https://qurango.net/radio/saud_alshuraim',
      'https://backup.qurango.net/radio/saud_alshuraim',
    ],
  },
  {
    id: 'hudhaify',
    category: 'haramain',
    arabicName: 'علي الحذيفي',
    name: {
      uz_lat: 'Ali Al-Huzayfiy',
      uz_cyr: 'Али Ал-Ҳузайфий',
      en: 'Ali Al-Hudhaify',
      ru: 'Али Аль-Хузайфи',
    },
    subtitle: {
      uz_lat: 'Masjidun Nabaviy imomi · Madina',
      uz_cyr: 'Масжидун Набавий имоми · Мадина',
      en: 'Imam of Madinah · Measured Tajweed',
      ru: 'Имам Мечети Пророка ﷺ · Медина',
    },
    accent: 'teal',
    streamUrls: [
      'https://qurango.net/radio/ali_alhuthaifi',
      'https://backup.qurango.net/radio/ali_alhuthaifi',
    ],
  },
  {
    id: 'abdulbasit',
    category: 'reciters',
    arabicName: 'عبدالباسط عبدالصمد',
    name: {
      uz_lat: 'Abdulbosit Abdussamad',
      uz_cyr: 'Абдулбосит Абдуссамад',
      en: 'Abdulbasit Abdulsamad',
      ru: 'Абдуль-Басит Абдус-Самад',
    },
    subtitle: {
      uz_lat: 'Murattal · Misr oltin maktabi',
      uz_cyr: 'Мураттал · Миср олтин мактаби',
      en: 'Murattal · Golden Egyptian School',
      ru: 'Муратталь · Золотая школа Египта',
    },
    accent: 'amber',
    streamUrls: [
      'https://qurango.net/radio/abdulbasit_abdulsamad',
      'https://backup.qurango.net/radio/abdulbasit_abdulsamad_mojawwad',
    ],
  },
  {
    id: 'abdulbasit_mujawwad',
    category: 'reciters',
    arabicName: 'عبدالباسط عبدالصمد — مجود',
    name: {
      uz_lat: 'Abdulbosit (Mujawwad)',
      uz_cyr: 'Абдулбосит (Мужаввад)',
      en: 'Abdulbasit (Mujawwad)',
      ru: 'Абдуль-Басит (Муджаввад)',
    },
    subtitle: {
      uz_lat: 'Tantanali maqomli qiroat',
      uz_cyr: 'Тантанали мақомли қироат',
      en: 'Melodic Classical Mujawwad',
      ru: 'Торжественное чтение Муджаввад',
    },
    accent: 'amber',
    streamUrls: [
      'https://backup.qurango.net/radio/abdulbasit_abdulsamad_mojawwad',
      'https://qurango.net/radio/abdulbasit_abdulsamad',
    ],
  },
  {
    id: 'husary',
    category: 'reciters',
    arabicName: 'محمود خليل الحصري',
    name: {
      uz_lat: 'Mahmud Xalil Al-Husariy',
      uz_cyr: 'Маҳмуд Халил Ал-Ҳусарий',
      en: 'Mahmoud Khalil Al-Husary',
      ru: 'Махмуд Халиль Аль-Хусари',
    },
    subtitle: {
      uz_lat: 'Tajvid o‘rganish uchun ideal',
      uz_cyr: 'Тажвид ўрганиш учун идеал',
      en: 'Reference Tajweed · Study Radio',
      ru: 'Эталон таджвида · Для обучения',
    },
    accent: 'emerald',
    streamUrls: [
      'https://qurango.net/radio/mahmoud_khalil_alhussary',
      'https://backup.qurango.net/radio/mohammed_siddiq_alminshawi',
    ],
  },
  {
    id: 'minshawi',
    category: 'reciters',
    arabicName: 'محمد صديق المنشاوي',
    name: {
      uz_lat: 'Muhammad Siddiq Al-Minshaviy',
      uz_cyr: 'Муҳаммад Сиддиқ Ал-Миншавий',
      en: 'Muhammad Siddiq Al-Minshawi',
      ru: 'Мухаммад Сиддик Аль-Миншави',
    },
    subtitle: {
      uz_lat: 'Xushu’ va qalb sokinligi',
      uz_cyr: 'Хушуъ ва қалб сокинлиги',
      en: 'Deeply Reverent · Classic Voice',
      ru: 'Проникновенное классическое чтение',
    },
    accent: 'teal',
    streamUrls: [
      'https://qurango.net/radio/mohammed_siddiq_alminshawi',
      'https://backup.qurango.net/radio/mohammed_siddiq_alminshawi',
    ],
  },
  {
    id: 'ghamdi',
    category: 'reciters',
    arabicName: 'سعد الغامدي',
    name: {
      uz_lat: 'Sa’d Al-G‘omidiy',
      uz_cyr: 'Саъд Ал-Ғомидий',
      en: 'Saad Al-Ghamdi',
      ru: 'Саад Аль-Гамиди',
    },
    subtitle: {
      uz_lat: 'Tiniq va mayin qiroat',
      uz_cyr: 'Тиниқ ва майин қироат',
      en: 'Clear & Gentle Murattal',
      ru: 'Чистое и мягкое чтение',
    },
    accent: 'emerald',
    streamUrls: [
      'https://qurango.net/radio/saad_alghamdi',
      'https://backup.qurango.net/radio/saad_alghamdi',
    ],
  },
  {
    id: 'shatri',
    category: 'reciters',
    arabicName: 'أبو بكر الشاطري',
    name: {
      uz_lat: 'Abu Bakr Ash-Shatriy',
      uz_cyr: 'Абу Бакр Аш-Шатрий',
      en: 'Abu Bakr Al-Shatri',
      ru: 'Абу Бакр Аш-Шатри',
    },
    subtitle: {
      uz_lat: 'Ta’sirchan va samimiy ovoz',
      uz_cyr: 'Таъсирчан ва самимий овоз',
      en: 'Heartfelt Recitation · Jeddah',
      ru: 'Душевное чтение · Джидда',
    },
    accent: 'teal',
    streamUrls: [
      'https://qurango.net/radio/shaik_abu_bakr_al_shatri',
      'https://backup.qurango.net/radio/shaik_abu_bakr_al_shatri',
    ],
  },
  {
    id: 'beautiful_calm',
    category: 'calm',
    arabicName: 'تلاوات خاشعة ومختارة',
    name: {
      uz_lat: 'Xushu’li go‘zal qiroatlar',
      uz_cyr: 'Хушуъли гўзал қироатлар',
      en: 'Calm & Soulful Recitations',
      ru: 'Умиротворяющие чтения',
    },
    subtitle: {
      uz_lat: 'Qalb oromi uchun saralangan qorilar',
      uz_cyr: 'Қалб ороми учун сараланган қорилар',
      en: 'Curated Peaceful Reciters 24/7',
      ru: 'Избранные спокойные чтецы 24/7',
    },
    accent: 'indigo',
    streamUrls: [
      'https://backup.qurango.net/radio/salma',
      'https://backup.qurango.net/radio/tarateel',
    ],
  },
  {
    id: 'short_surahs',
    category: 'calm',
    arabicName: 'تراتيل قصيرة خاشعة',
    name: {
      uz_lat: 'Qisqa suralar va Taratil',
      uz_cyr: 'Қисқа суралар ва Таратил',
      en: 'Short Surahs & Tarateel',
      ru: 'Короткие суры и таратиль',
    },
    subtitle: {
      uz_lat: 'Yodlash va kundalik tinglash uchun',
      uz_cyr: 'Ёдлаш ва кундалик тинглаш учун',
      en: 'Ideal for Daily Listening & Focus',
      ru: 'Для ежедневного слушания и хифза',
    },
    accent: 'indigo',
    streamUrls: [
      'https://backup.qurango.net/radio/tarateel',
      'https://backup.qurango.net/radio/salma',
    ],
  },
  {
    id: 'ruqyah',
    category: 'calm',
    arabicName: 'الرقية الشرعية',
    name: {
      uz_lat: 'Ruqiya Shar’iya (Shifo oyatlari)',
      uz_cyr: 'Руқия Шаръия (Шифо оятлари)',
      en: 'Ruqyah Shariah Radio',
      ru: 'Рукья Шария (Аяты исцеления)',
    },
    subtitle: {
      uz_lat: '24/7 Himoya va shifo oyatlari',
      uz_cyr: '24/7 Ҳимоя ва шифо оятлари',
      en: '24/7 Protection & Healing Verses',
      ru: '24/7 Аяты защиты и исцеления',
    },
    accent: 'emerald',
    streamUrls: [
      'https://backup.qurango.net/radio/roqiah',
      'https://qurango.net/radio/roqiah',
    ],
  },
];

export function getRadioStationById(id: string | null | undefined): QuranRadioStation {
  return QURAN_RADIO_STATIONS.find((s) => s.id === id) || QURAN_RADIO_STATIONS[0];
}
