import { AppLanguage } from '../types';
import { latinToCyrillicUz } from '../utils/uzbekScript';

export type QuizDeckId = 'prayer' | 'quran' | 'prophets' | 'worship' | 'scholars' | 'ethics';

export interface QuizDeckMeta {
  id: QuizDeckId;
  title: Record<AppLanguage, string>;
  subtitle: Record<AppLanguage, string>;
  accent: 'emerald' | 'amber' | 'sky' | 'violet' | 'rose' | 'teal';
}

export const QUIZ_DECKS: QuizDeckMeta[] = [
  {
    id: 'prayer',
    title: {
      uz_lat: 'Tahorat va Namoz',
      uz_cyr: 'Таҳорат ва Намоз',
      ru: 'Тахарат и Намаз',
      en: 'Wudu & Prayer',
    },
    subtitle: {
      uz_lat: 'Hanafiy fiqhi asoslari',
      uz_cyr: 'Ҳанафий фиқҳи асослари',
      ru: 'Основы ханафитского фикха',
      en: 'Hanafi fiqh essentials',
    },
    accent: 'emerald',
  },
  {
    id: 'quran',
    title: {
      uz_lat: "Qur'oni Karim",
      uz_cyr: 'Қуръони Карим',
      ru: 'Священный Коран',
      en: 'Holy Quran',
    },
    subtitle: {
      uz_lat: 'Suralar, oyatlar va faktlar',
      uz_cyr: 'Суралар, оятлар ва фактлар',
      ru: 'Суры, аяты и знания',
      en: 'Surahs, ayahs & facts',
    },
    accent: 'amber',
  },
  {
    id: 'prophets',
    title: {
      uz_lat: "Payg'ambarlar tarixi",
      uz_cyr: 'Пайғамбарлар тарихи',
      ru: 'История пророков',
      en: 'Prophets & Seerah',
    },
    subtitle: {
      uz_lat: 'Siyrat va muborak qissalar',
      uz_cyr: 'Сийрат ва муборак қиссалар',
      ru: 'Сира и истории пророков',
      en: 'Seerah & noble stories',
    },
    accent: 'sky',
  },
  {
    id: 'worship',
    title: {
      uz_lat: 'Ramazon, Zakot & Zikr',
      uz_cyr: 'Рамазон, Закот & Зикр',
      ru: 'Рамадан, Закят и Зикр',
      en: 'Ramadan, Zakat & Dhikr',
    },
    subtitle: {
      uz_lat: 'Ibodat va iymon arkonlari',
      uz_cyr: 'Ибодат ва иймон арконлари',
      ru: 'Столпы веры и поклонения',
      en: 'Pillars of faith & ibadah',
    },
    accent: 'violet',
  },
  {
    id: 'scholars',
    title: {
      uz_lat: 'Sahobalar va Allomalar',
      uz_cyr: 'Саҳобалар ва Алломалар',
      ru: 'Сподвижники и Учёные',
      en: 'Companions & Scholars',
    },
    subtitle: {
      uz_lat: 'Buyuk sahobalar va Movarounnahr ulamolari',
      uz_cyr: 'Буюк саҳобалар ва Мовароуннаҳр уламолари',
      ru: 'Сподвижники и великие имамы Мавераннахра',
      en: 'Noble Sahabah & great scholars of Transoxiana',
    },
    accent: 'rose',
  },
  {
    id: 'ethics',
    title: {
      uz_lat: 'Islom Odobi va Axloq',
      uz_cyr: 'Ислом Одоби ва Ахлоқ',
      ru: 'Исламский Адаб и Нрав',
      en: 'Islamic Ethics & Manners',
    },
    subtitle: {
      uz_lat: 'Ota-ona haqqi, sunnat odoblari va muomala',
      uz_cyr: 'Ота-она ҳаққи, суннат одоблари ва муомала',
      ru: 'Права родителей, суннаты дня и благой нрав',
      en: 'Parents, daily Sunnahs & noble character',
    },
    accent: 'teal',
  },
];

export interface LocalizedQuizQuestion {
  id: string;
  deck: QuizDeckId;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  source: string;
}

interface RawQuestion {
  id: string;
  deck: QuizDeckId;
  correctIndex: 0 | 1 | 2 | 3;
  uz: { q: string; opts: [string, string, string, string]; exp: string };
  en: { q: string; opts: [string, string, string, string]; exp: string };
  ru: { q: string; opts: [string, string, string, string]; exp: string };
  src?: { uz: string; en: string; ru: string };
}

const RAW_QUESTIONS: RawQuestion[] = [
  // ==================== 1. TAHORAT VA NAMOZ (12) ====================
  {
    id: 'pr_01',
    deck: 'prayer',
    correctIndex: 1,
    uz: {
      q: 'Hanafiy mazhabida tahoratning farzlari nechta?',
      opts: ['3 ta', '4 ta', '6 ta', '7 ta'],
      exp: "Tahoratning 4 ta farzi bor: yuzni yuvish, qo'llarni tirsak bilan yuvish, boshning to'rtdan biriga mash tortish va oyoqlarni to'piq bilan yuvish.",
    },
    en: {
      q: 'How many obligatory (Fard) acts are in Wudu according to the Hanafi school?',
      opts: ['3', '4', '6', '7'],
      exp: 'Wudu has 4 Fards: washing the face, washing arms up to elbows, wiping one-quarter of the head, and washing feet up to ankles.',
    },
    ru: {
      q: 'Сколько обязательных действий (фарзов) в омовении (тахарате) в ханафитском мазхабе?',
      opts: ['3', '4', '6', '7'],
      exp: 'В омовении 4 фарза: омыть лицо, руки до локтей, протереть четверть головы и омыть ноги до щиколоток.',
    },
  },
  {
    id: 'pr_02',
    deck: 'prayer',
    correctIndex: 0,
    uz: {
      q: "G'uslning farzlari nechta?",
      opts: ['3 ta', '4 ta', '5 ta', '6 ta'],
      exp: "G'uslning 3 ta farzi bor: og'izni g'arg'ara qilib chayish, burunni achishguncha chayish va butun badanga quruq joy qoldirmay suv yetkazish.",
    },
    en: {
      q: 'How many obligatory (Fard) acts are in Ghusl (ritual bath)?',
      opts: ['3', '4', '5', '6'],
      exp: 'Ghusl has 3 Fards: rinsing the mouth thoroughly, rinsing the nose, and washing the entire body leaving no dry spot.',
    },
    ru: {
      q: 'Сколько фарзов (обязательных действий) в полном омовении (гусле)?',
      opts: ['3', '4', '5', '6'],
      exp: 'В гусле 3 фарза: прополоскать рот, промыть нос и омыть всё тело, не оставляя сухого места.',
    },
  },
  {
    id: 'pr_03',
    deck: 'prayer',
    correctIndex: 2,
    uz: {
      q: 'Namozning jami farzlari (shartlari va ruknlari) nechta?',
      opts: ['8 ta', '10 ta', '12 ta', '14 ta'],
      exp: "Namozda 12 ta farz bor: 6 tasi namozdan tashqaridagi shartlar, 6 tasi namoz ichidagi ruknlardir.",
    },
    en: {
      q: 'How many total Fards (preconditions + pillars) does Salah have in Hanafi fiqh?',
      opts: ['8', '10', '12', '14'],
      exp: 'Salah has 12 Fards in total: 6 external preconditions (Shurut) and 6 internal pillars (Arkan).',
    },
    ru: {
      q: 'Сколько всего фарзов (условий и столпов) в намазе по ханафитскому мазхабу?',
      opts: ['8', '10', '12', '14'],
      exp: 'В намазе 12 фарзов: 6 внешних условий до начала намаза и 6 внутренних столпов внутри намаза.',
    },
  },
  {
    id: 'pr_04',
    deck: 'prayer',
    correctIndex: 2,
    uz: {
      q: 'Vitr namozida Qunut duosi qaysi rakatda o‘qiladi?',
      opts: ['1-rakatda', '2-rakatda', '3-rakatda rukudan oldin', '3-rakatda rukudan keyin'],
      exp: "Hanafiy mazhabida Vitr namozining 3-rakatida Fotiha va zam suradan so'ng takbir aytilib, rukudan oldin Qunut duosi o'qiladi.",
    },
    en: {
      q: 'In Hanafi fiqh, when is Dua Qunut recited in Witr prayer?',
      opts: ['In the 1st rakat', 'In the 2nd rakat', 'In the 3rd rakat before Ruku', 'In the 3rd rakat after Ruku'],
      exp: 'In the Hanafi school, Qunut is recited in the 3rd rakat of Witr after Surah recitation and takbir, before going into Ruku.',
    },
    ru: {
      q: 'Когда читается дуа Кунут в намазе Витр по ханафитскому мазхабу?',
      opts: ['В 1-м ракаате', 'Во 2-м ракаате', 'В 3-м ракаате до руку', 'В 3-м ракаате после руку'],
      exp: 'В ханафитском мазхабе дуа Кунут читается в 3-м ракаате Витра после суры и такбира, перед поясным поклоном (руку).',
    },
  },
  {
    id: 'pr_05',
    deck: 'prayer',
    correctIndex: 1,
    uz: {
      q: 'Hanafiy mazhabida safarda namozni qasr (qisqa) o‘qish masofasi taxminan qancha?',
      opts: ['30 km', '90 km', '150 km', '200 km'],
      exp: "Ulamolar hisobiga ko'ra 18 farsax (taxminan 89–90 km) va undan uzoq safarga 15 kundan kam muddatga chiqqan kishi musofir hisoblanadi.",
    },
    en: {
      q: 'Approximately what travel distance qualifies for shortening prayers (Qasr) in Hanafi fiqh?',
      opts: ['30 km', '90 km', '150 km', '200 km'],
      exp: 'In the Hanafi school, traveling roughly 89–90 km (18 farsakh) with intention to stay under 15 days makes one a traveler (Musafir).',
    },
    ru: {
      q: 'Какое примерно расстояние делает человека путником (мусафиром) для сокращения намаза в ханафитском мазхабе?',
      opts: ['30 км', '90 км', '150 км', '200 км'],
      exp: 'В ханафитском мазхабе расстояние сафара составляет около 89–90 км при намерении остаться менее 15 дней.',
    },
  },
  {
    id: 'pr_06',
    deck: 'prayer',
    correctIndex: 0,
    uz: {
      q: 'Namozda vojib amal esdan chiqib qoldirilsa nima qilinadi?',
      opts: ['Sajdai sahv qilinadi', 'Namoz buziladi', 'Hech narsa qilinmaydi', 'Qayta tahorat olinadi'],
      exp: "Namozdagi vojib amal unutib tark etilsa yoki kechiktirilsa, oxirgi qa'dada o'ng tomonga salom berib ikki marta sajdai sahv qilinadi.",
    },
    en: {
      q: 'What is done if a Wajib (necessary) act is accidentally missed during Salah?',
      opts: ['Perform Sajdah Sahw (prostration of forgetfulness)', 'The prayer is automatically invalid', 'Nothing is required', 'Repeat Wudu'],
      exp: 'Missing or delaying a Wajib act forgetfully is rectified by performing Sajdah Sahw at the end of prayer.',
    },
    ru: {
      q: 'Что необходимо сделать, если в намазе по забывчивости пропущен ваджиб?',
      opts: ['Совершить саджда сахв', 'Намаз сразу нарушается', 'Ничего не требуется', 'Взять новое омовение'],
      exp: 'Пропуск ваджиба по забывчивости исправляется совершением саджда сахв (земных поклонов невнимательности) в конце намаза.',
    },
  },
  {
    id: 'pr_07',
    deck: 'prayer',
    correctIndex: 3,
    uz: {
      q: 'Muqim (safarda bo‘lmagan) kishi mahsiga necha soat mash tortishi mumkin?',
      opts: ['6 soat', '12 soat', '18 soat', '24 soat (1 kecha-kunduz)'],
      exp: "Muqim kishi 1 kecha-kunduz (24 soat), musofir esa 3 kecha-kunduz (72 soat) davomida mahsiga mash tortishi joiz.",
    },
    en: {
      q: 'For how long may a resident (non-traveler) wipe over leather socks (Khuffayn)?',
      opts: ['6 hours', '12 hours', '18 hours', '24 hours (1 day and night)'],
      exp: 'A resident may wipe over Khuffayn for 24 hours, and a traveler for 72 hours (3 days and nights).',
    },
    ru: {
      q: 'Сколько времени житель (не путник) может делать масх на хуффы (кожаные носки)?',
      opts: ['6 часов', '12 часов', '18 часов', '24 часа (сутки)'],
      exp: 'Житель может протирать хуффы 24 часа (сутки), а путник — 72 часа (трое суток).',
    },
  },
  {
    id: 'pr_08',
    deck: 'prayer',
    correctIndex: 1,
    uz: {
      q: 'Qaysi paytda nafl namoz o‘qish makruhi tahrimiy (taqiqlangan) hisoblanadi?',
      opts: ['Tungi tahajjud vaqtida', 'Quyosh chiqayotgan, qiyomga kelgan va botayotgan paytda', 'Peshindan keyin', 'Xuftondan keyin'],
      exp: "Quyosh chiqayotganda, tikkaga kelganda (zavol) va botayotganda namoz o'qish hadis bilan man etilgan.",
    },
    en: {
      q: 'During which times is praying voluntary Salah prohibited?',
      opts: ['During Tahajjud', 'At exact sunrise, solar zenith, and sunset', 'After Dhuhr', 'After Isha'],
      exp: 'Authentic hadith prohibit offering prayer precisely during sunrise, zenith (midday peak), and sunset.',
    },
    ru: {
      q: 'В какое время запрещено (макрух тахриман) совершать добровольный намаз?',
      opts: ['Во время тахаджуда', 'Во время восхода, зенита и заката солнца', 'После Зухра', 'После Иша'],
      exp: 'Хадисы запрещают совершать намаз точно во время восхода, зенита и заката солнца.',
    },
  },
  {
    id: 'pr_09',
    deck: 'prayer',
    correctIndex: 0,
    uz: {
      q: 'Bomdod namozining 2 rakat sunnati qaysi hukmga kiradi?',
      opts: ['Sunnati muakkada (eng kuchli sunnat)', 'Nafl', 'Farzi kifoya', 'Mustahab'],
      exp: "Bomdodning 2 rakat sunnati eng ta'kidlangan sunnat bo'lib, Payg'ambarimiz ﷺ uni safarda ham tark etmaganlar.",
    },
    en: {
      q: 'What is the ruling of the 2 rakats of Sunnah before Fajr?',
      opts: ['Sunnah Muakkadah (strongly emphasized)', 'Optional Nafl', 'Fard Kifayah', 'Mustahab'],
      exp: 'The 2 Sunnah rakats of Fajr are the most emphasized Sunnah prayers; the Prophet ﷺ never left them even while traveling.',
    },
    ru: {
      q: 'Какой статус имеют 2 ракаата сунны перед Фаджром?',
      opts: ['Сунна муаккада (настоятельная сунна)', 'Нафиль', 'Фарз кифая', 'Мустахаб'],
      exp: 'Два ракаата сунны Фаджра — самая сильная сунна, которую Пророк ﷺ не оставлял даже в пути.',
    },
  },
  {
    id: 'pr_10',
    deck: 'prayer',
    correctIndex: 2,
    uz: {
      q: 'Suv topilmaganda yoki suv ishlatish sog‘liqqa zarar qilganda nima qilinadi?',
      opts: ['Namoz qoldiriladi', 'Faqat yuz artiladi', 'Tayammum qilinadi', 'Qazo qilib qoldiriladi'],
      exp: "Suv yo'q bo'lganda yoki kasallik sababli ishlatish zararli bo'lganda pok tuproq jinsidan tayammum qilinadi.",
    },
    en: {
      q: 'What is performed when water is unavailable or harmful to use for health reasons?',
      opts: ['Skip the prayer', 'Wipe only the face', 'Perform Tayammum (dry ablution)', 'Delay until later'],
      exp: 'When water is unavailable or medically harmful, Tayammum is performed with pure earth/dust.',
    },
    ru: {
      q: 'Что совершается при отсутствии воды или если её использование вредит здоровью?',
      opts: ['Намаз пропускается', 'Протирается только лицо', 'Совершается таяммум', 'Откладывается на потом'],
      exp: 'При отсутствии воды или угрозе здоровью совершается таяммум чистой землёй или пылью.',
    },
  },
  {
    id: 'pr_11',
    deck: 'prayer',
    correctIndex: 1,
    uz: {
      q: 'Hanafiy mazhabida Asr namozi vaqti qachon kiradi?',
      opts: ['Har narsaning soyasi 1 barobar bo‘lganda', 'Har narsaning soyasi 2 barobar bo‘lganda', 'Quyosh botishidan 15 daqiqa oldin', 'Peshindan 1 soat o‘tgach'],
      exp: "Imom Abu Hanifa (rahimahulloh) qavllariga ko'ra, har bir narsaning soyasi zavol soyasidan tashqari ikki barobariga yetganda Asr vaqti kiradi.",
    },
    en: {
      q: 'In the Hanafi school, when does Asr prayer time begin?',
      opts: ['When an object’s shadow equals its length (1×)', 'When an object’s shadow equals twice its length (2×)', '15 minutes before sunset', '1 hour after Dhuhr'],
      exp: 'According to Imam Abu Hanifa, Asr begins when the shadow of an object reaches twice its height plus the noon shadow.',
    },
    ru: {
      q: 'Когда наступает время намаза Аср в ханафитском мазхабе?',
      opts: ['Когда тень предмета равна его высоте (1×)', 'Когда тень предмета равна двум его высотам (2×)', 'За 15 минут до заката', 'Через час после Зухра'],
      exp: 'По мнению имама Абу Ханифы, время Асра наступает, когда тень предмета достигает двойной его длины (сверх полуденной тени).',
    },
  },
  {
    id: 'pr_12',
    deck: 'prayer',
    correctIndex: 3,
    uz: {
      q: 'Juma namozining farzi necha rakat?',
      opts: ['4 rakat', '6 rakat', '3 rakat', '2 rakat'],
      exp: "Juma namozining farzi 2 rakat bo'lib, xutbadan so'ng jamoat bilan o'qiladi.",
    },
    en: {
      q: 'How many Fard rakats does Jumuah (Friday) prayer have?',
      opts: ['4 rakats', '6 rakats', '3 rakats', '2 rakats'],
      exp: 'Jumuah Fard prayer consists of 2 rakats prayed in congregation after the Friday Khutbah.',
    },
    ru: {
      q: 'Сколько ракаатов фарза в пятничном (Джума) намазе?',
      opts: ['4 ракаата', '6 ракаатов', '3 ракаата', '2 ракаата'],
      exp: 'Фарз Джума-намаза состоит из 2 ракаатов, которые читаются в джамаате после хутбы.',
    },
  },

  // ==================== 2. QUR'ONI KARIM ILMLARI (12) ====================
  {
    id: 'qr_01',
    deck: 'quran',
    correctIndex: 1,
    uz: {
      q: "Qur'oni Karimda jami nechta sura bor?",
      opts: ['99 ta', '114 ta', '120 ta', '110 ta'],
      exp: "Qur'oni Karim 114 ta sura va 30 ta juz (pora)dan iborat.",
    },
    en: {
      q: 'How many Surahs (chapters) are in the Holy Quran?',
      opts: ['99', '114', '120', '110'],
      exp: 'The Holy Quran contains 114 Surahs arranged into 30 Juz.',
    },
    ru: {
      q: 'Сколько сур в Священном Коране?',
      opts: ['99', '114', '120', '110'],
      exp: 'Священный Коран состоит из 114 сур и разделён на 30 джузов.',
    },
  },
  {
    id: 'qr_02',
    deck: 'quran',
    correctIndex: 0,
    uz: {
      q: "Qur'oni Karimdagi eng uzun sura qaysi?",
      opts: ['Al-Baqara surasi', 'Oli Imron surasi', 'An-Niso surasi', 'Al-A’rof surasi'],
      exp: "Al-Baqara surasi 286 oyatdan iborat bo'lib, Qur'ondagi eng uzun suradir.",
    },
    en: {
      q: 'Which is the longest Surah in the Holy Quran?',
      opts: ['Surah Al-Baqarah', 'Surah Al-Imran', 'Surah An-Nisa', 'Surah Al-Araf'],
      exp: 'Surah Al-Baqarah is the longest Surah with 286 ayahs.',
    },
    ru: {
      q: 'Какая сура является самой длинной в Коране?',
      opts: ['Сура Аль-Бакара', 'Сура Аль Имран', 'Сура Ан-Ниса', 'Сура Аль-Араф'],
      exp: 'Сура Аль-Бакара состоит из 286 аятов и является самой длинной сурой Корана.',
    },
  },
  {
    id: 'qr_03',
    deck: 'quran',
    correctIndex: 2,
    uz: {
      q: "Qur'oni Karimdagi eng qisqa sura qaysi?",
      opts: ['Al-Ixlos', 'Al-Asr', 'Al-Kavsar', 'An-Nos'],
      exp: "Al-Kavsar surasi 3 oyatdan iborat bo'lib, so'zlari soni bo'yicha eng qisqa suradir.",
    },
    en: {
      q: 'Which is the shortest Surah in the Holy Quran?',
      opts: ['Surah Al-Ikhlas', 'Surah Al-Asr', 'Surah Al-Kawthar', 'Surah An-Nas'],
      exp: 'Surah Al-Kawthar consists of 3 brief ayahs and is the shortest Surah in the Quran.',
    },
    ru: {
      q: 'Какая сура является самой короткой в Коране?',
      opts: ['Аль-Ихляс', 'Аль-Аср', 'Аль-Каусар', 'Ан-Нас'],
      exp: 'Сура Аль-Каусар состоит из 3 коротких аятов и является самой короткой в Коране.',
    },
  },
  {
    id: 'qr_04',
    deck: 'quran',
    correctIndex: 3,
    uz: {
      q: "Qaysi sura «Bismillahir Rohmanir Rohiym»siz boshlanadi?",
      opts: ['Al-Anfol', 'Al-Mulk', 'Al-Kahf', 'At-Tavba'],
      exp: "At-Tavba (9-sura) Qur'ondagi «Bismillah»siz boshlanadigan yagona suradir.",
    },
    en: {
      q: 'Which Surah does NOT begin with Bismillah?',
      opts: ['Surah Al-Anfal', 'Surah Al-Mulk', 'Surah Al-Kahf', 'Surah At-Tawbah'],
      exp: 'Surah At-Tawbah (Surah 9) is the only Surah in the Quran that does not begin with Bismillah.',
    },
    ru: {
      q: 'Какая сура Корана начинается без «Бисмиллях»?',
      opts: ['Аль-Анфаль', 'Аль-Мульк', 'Аль-Кахф', 'Ат-Тауба'],
      exp: 'Сура Ат-Тауба (9-я сура) — единственная сура Корана, начинающаяся без «Бисмиллях».',
    },
  },
  {
    id: 'qr_05',
    deck: 'quran',
    correctIndex: 1,
    uz: {
      q: "«Qur'onning qalbi» deb qaysi sura ataladi?",
      opts: ['Ar-Rahmon', 'Yosin', 'Al-Voqea', 'Al-Mulk'],
      exp: "Hadislarda Yosin surasi «Qur'onning qalbi» deb ta'riflangan.",
    },
    en: {
      q: 'Which Surah is famously called "The Heart of the Quran"?',
      opts: ['Surah Ar-Rahman', 'Surah Yasin', 'Surah Al-Waqiah', 'Surah Al-Mulk'],
      exp: 'Surah Yasin is described in Islamic tradition as the heart of the Quran.',
    },
    ru: {
      q: 'Какую суру называют «сердцем Корана»?',
      opts: ['Ар-Рахман', 'Ясин', 'Аль-Вакиа', 'Аль-Мульк'],
      exp: 'Сура Ясин известна в исламской традиции как «сердце Корана».',
    },
  },
  {
    id: 'qr_06',
    deck: 'quran',
    correctIndex: 0,
    uz: {
      q: "Oyatul Kursiy qaysi suraning nechanchi oyatida joylashgan?",
      opts: ['Al-Baqara, 255-oyat', 'Oli Imron, 18-oyat', 'Al-Baqara, 285-oyat', 'An-Nur, 35-oyat'],
      exp: "Qur'ondagi eng ulug' oyat — Oyatul Kursiy Al-Baqara surasining 255-oyatidir.",
    },
    en: {
      q: 'Where is Ayatul Kursi located in the Quran?',
      opts: ['Surah Al-Baqarah, Ayah 255', 'Surah Al-Imran, Ayah 18', 'Surah Al-Baqarah, Ayah 285', 'Surah An-Nur, Ayah 35'],
      exp: 'Ayatul Kursi, the greatest verse in the Quran, is Surah Al-Baqarah verse 255.',
    },
    ru: {
      q: 'В какой суре и каком аяте находится Аят аль-Курси?',
      opts: ['Аль-Бакара, 255-й аят', 'Аль Имран, 18-й аят', 'Аль-Бакара, 285-й аят', 'Ан-Нур, 35-й аят'],
      exp: 'Величайший аят Корана — Аят аль-Курси — это 255-й аят суры Аль-Бакара.',
    },
  },
  {
    id: 'qr_07',
    deck: 'quran',
    correctIndex: 2,
    uz: {
      q: "Payg'ambarimizga ﷺ ilk vahiy bo'lib nozil qilingan oyatlar qaysi suradan?",
      opts: ['Al-Fotiha', 'Al-Muddassir', 'Al-Alaq («Iqro»)', 'Al-Qalam'],
      exp: "Hiro g'orida ilk vahiy bo'lib Al-Alaq surasining dastlabki 5 oyati («O'qi!..») nozil qilingan.",
    },
    en: {
      q: 'From which Surah were the very first verses revealed to Prophet Muhammad ﷺ?',
      opts: ['Al-Fatihah', 'Al-Muddaththir', 'Al-Alaq ("Iqra")', 'Al-Qalam'],
      exp: 'The first five verses of Surah Al-Alaq ("Read in the name of your Lord...") were revealed in Cave Hira.',
    },
    ru: {
      q: 'Из какой суры были ниспосланы самые первые аяты Пророку Мухаммаду ﷺ?',
      opts: ['Аль-Фатиха', 'Аль-Муддассир', 'Аль-Аляк («Читай»)', 'Аль-Калям'],
      exp: 'В пещере Хира первыми были ниспосланы первые 5 аятов суры Аль-Аляк («Читай во имя Господа твоего...»).',
    },
  },
  {
    id: 'qr_08',
    deck: 'quran',
    correctIndex: 1,
    uz: {
      q: "Qaysi sura Qur'onning uchdan biriga teng savobli deb hadisda aytilgan?",
      opts: ['Al-Falaq', 'Al-Ixlos', 'Al-Kofirun', 'Al-Fotiha'],
      exp: "Sahih hadisda Al-Ixlos surasi tavhidni jamlagani bois Qur'onning uchdan biriga barobar ekani bayon qilingan.",
    },
    en: {
      q: 'Which Surah is described in authentic Hadith as equal in reward to one-third of the Quran?',
      opts: ['Al-Falaq', 'Al-Ikhlas', 'Al-Kafirun', 'Al-Fatihah'],
      exp: 'Surah Al-Ikhlas encapsulates pure Tawhid and is described by the Prophet ﷺ as equal to a third of the Quran.',
    },
    ru: {
      q: 'Какая сура приравнивается в награде к трети Корана согласно достоверному хадису?',
      opts: ['Аль-Фаляк', 'Аль-Ихляс', 'Аль-Кафирун', 'Аль-Фатиха'],
      exp: 'Согласно достоверному хадису, чтение суры Аль-Ихляс равно по награде трети Корана.',
    },
  },
  {
    id: 'qr_09',
    deck: 'quran',
    correctIndex: 0,
    uz: {
      q: 'Juma kuni qaysi surani o‘qish sunnat va ikki juma orasida nur bo‘ladi?',
      opts: ['Al-Kahf surasi', 'Al-Mulk surasi', 'Nuh surasi', 'Al-Fath surasi'],
      exp: "Hadisga ko'ra, kim juma kuni Al-Kahf surasini o'qisa, ikki juma o'rtasida uning uchun nur porlab turadi.",
    },
    en: {
      q: 'Which Surah is Sunnah to recite on Friday, illuminating the believer until the next Friday?',
      opts: ['Surah Al-Kahf', 'Surah Al-Mulk', 'Surah Nuh', 'Surah Al-Fath'],
      exp: 'Reciting Surah Al-Kahf on Friday brings spiritual light (Nur) between the two Fridays.',
    },
    ru: {
      q: 'Какую суру является сунной читать в пятницу для света (нура) между двумя пятницами?',
      opts: ['Сура Аль-Кахф', 'Сура Аль-Мульк', 'Сура Нух', 'Сура Аль-Фатх'],
      exp: 'Чтение суры Аль-Кахф в пятницу озаряет верующего светом от одной пятницы до следующей.',
    },
  },
  {
    id: 'qr_10',
    deck: 'quran',
    correctIndex: 3,
    uz: {
      q: "Qaysi surada «Bismillah» ikki marta kelgan?",
      opts: ['Al-Baqara', 'Yusuf', 'Al-Isro', 'An-Naml'],
      exp: "An-Naml (27-sura) boshida ham, 30-oyatda Sulaymon alayhissalomning maktubida ham «Bismillah» zikr qilingan.",
    },
    en: {
      q: 'Which Surah mentions Bismillah twice?',
      opts: ['Al-Baqarah', 'Yusuf', 'Al-Isra', 'An-Naml'],
      exp: 'Surah An-Naml (27) contains Bismillah at the beginning and again in verse 30 in Prophet Sulayman’s letter.',
    },
    ru: {
      q: 'В какой суре «Бисмиллях» встречается дважды?',
      opts: ['Аль-Бакара', 'Юсуф', 'Аль-Исра', 'Ан-Намль'],
      exp: 'В суре Ан-Намль (27) «Бисмиллях» стоит в начале суры и в 30-м аяте в письме пророка Сулеймана.',
    },
  },
  {
    id: 'qr_11',
    deck: 'quran',
    correctIndex: 1,
    uz: {
      q: "Qabr azobidan saqlovchi («Monia») deb ta'riflangan sura qaysi?",
      opts: ['Al-Voqea', 'Al-Mulk (Taborak)', 'Al-Juma', 'Al-Qadr'],
      exp: "Har kecha Al-Mulk (67-sura)ni o'qib yotish qabr azobidan panoh bo'lishi sahih hadislarda kelgan.",
    },
    en: {
      q: 'Which Surah is known as the Protector from the punishment of the grave?',
      opts: ['Al-Waqiah', 'Al-Mulk', 'Al-Jumuah', 'Al-Qadr'],
      exp: 'Reciting Surah Al-Mulk (Surah 67) regularly at night intercedes and protects from the trial of the grave.',
    },
    ru: {
      q: 'Какая сура известна как защищающая от мучений могилы?',
      opts: ['Аль-Вакиа', 'Аль-Мульк', 'Аль-Джума', 'Аль-Кадр'],
      exp: 'Регулярное чтение суры Аль-Мульк (67-я сура) перед сном защищает от мучений могилы.',
    },
  },
  {
    id: 'qr_12',
    deck: 'quran',
    correctIndex: 2,
    uz: {
      q: "Qur'oni Karim necha yil davomida nozil bo'lgan?",
      opts: ['10 yil', '15 yil', '23 yil', '30 yil'],
      exp: "Qur'oni Karim 23 yil davomida (13 yil Makkada va 10 yil Madinada) bosqichma-bosqich nozil bo'lgan.",
    },
    en: {
      q: 'Over how many years was the Holy Quran revealed?',
      opts: ['10 years', '15 years', '23 years', '30 years'],
      exp: 'The Quran was revealed gradually over 23 years: 13 years in Makkah and 10 years in Madinah.',
    },
    ru: {
      q: 'На протяжении скольких лет ниспосылался Священный Коран?',
      opts: ['10 лет', '15 лет', '23 года', '30 лет'],
      exp: 'Коран ниспосылался постепенно в течение 23 лет: 13 лет в Мекке и 10 лет в Медине.',
    },
  },

  // ==================== 3. PAYG'AMBARLAR TARIXI & SIYRAT (12) ====================
  {
    id: 'pp_01',
    deck: 'prophets',
    correctIndex: 0,
    uz: {
      q: "Qur'oni Karimda nechta payg'ambarning nomi ochiq zikr qilingan?",
      opts: ['25 ta', '15 ta', '40 ta', '99 ta'],
      exp: "Qur'oni Karimda 25 nafar payg'ambar (Odam alayhissalomdan Muhammad ﷺgacha) ismlari zikr qilingan.",
    },
    en: {
      q: 'How many Prophets are mentioned by name in the Holy Quran?',
      opts: ['25', '15', '40', '99'],
      exp: '25 Prophets are explicitly mentioned by name in the Quran, from Prophet Adam (AS) to Prophet Muhammad ﷺ.',
    },
    ru: {
      q: 'Сколько пророков упомянуто по имени в Священном Коране?',
      opts: ['25', '15', '40', '99'],
      exp: 'В Коране по имени упомянуты 25 пророков — от Адама (мир ему) до Мухаммада ﷺ.',
    },
  },
  {
    id: 'pp_02',
    deck: 'prophets',
    correctIndex: 2,
    uz: {
      q: '«Ulul Azm» (ulkan matonat sohiblari) payg‘ambarlar nechta?',
      opts: ['3 ta', '4 ta', '5 ta', '7 ta'],
      exp: "Ulul Azm payg'ambarlar 5 nafar: Nuh, Ibrohim, Muso, Iso va Muhammad (alayhimussalom).",
    },
    en: {
      q: 'How many Prophets are honored as "Ulul Azm" (Prophets of Great Resolve)?',
      opts: ['3', '4', '5', '7'],
      exp: 'The 5 Ulul Azm Prophets are Nuh, Ibrahim, Musa, Isa, and Muhammad (peace be upon them all).',
    },
    ru: {
      q: 'Сколько пророков относятся к «Улюль-Азм» (обладателям великой решимости)?',
      opts: ['3', '4', '5', '7'],
      exp: 'К Улюль-Азм относятся 5 пророков: Нух, Ибрахим, Муса, Иса и Мухаммад (мир им всем).',
    },
  },
  {
    id: 'pp_03',
    deck: 'prophets',
    correctIndex: 1,
    uz: {
      q: "Payg'ambarimiz Muhammad ﷺ qaysi shaharda tug'ilganlar?",
      opts: ['Madina', 'Makka', 'Quddus', 'Toif'],
      exp: "Payg'ambarimiz Muhammad ﷺ milodiy 571-yil (Fil yili)da Makka shahrida tavallud topganlar.",
    },
    en: {
      q: 'In which city was Prophet Muhammad ﷺ born?',
      opts: ['Madinah', 'Makkah', 'Jerusalem', 'Taif'],
      exp: 'Prophet Muhammad ﷺ was born in Makkah in the Year of the Elephant (approx. 571 CE).',
    },
    ru: {
      q: 'В каком городе родился Пророк Мухаммад ﷺ?',
      opts: ['Медина', 'Мекка', 'Иерусалим', 'Таиф'],
      exp: 'Пророк Мухаммад ﷺ родился в Мекке в Год Слона (около 571 г. н.э.).',
    },
  },
  {
    id: 'pp_04',
    deck: 'prophets',
    correctIndex: 0,
    uz: {
      q: "Payg'ambarimizga ﷺ ilk vahiy qaysi g'orda kelgan?",
      opts: ["Hiro g'ori", "Savr g'ori", "Uhud g'ori", "Nur vodiysi"],
      exp: "Jabroil alayhissalom ilk vahiyni Makka yaqinidagi Nur tog'idagi Hiro g'orida olib kelganlar.",
    },
    en: {
      q: 'In which cave did Prophet Muhammad ﷺ receive the first revelation?',
      opts: ['Cave of Hira', 'Cave of Thawr', 'Mount Uhud', 'Valley of Mina'],
      exp: 'Angel Jibril (AS) brought the first revelation to Prophet Muhammad ﷺ in the Cave of Hira on Jabal al-Noor.',
    },
    ru: {
      q: 'В какой пещере Пророк Мухаммад ﷺ получил первое откровение?',
      opts: ['Пещера Хира', 'Пещера Саур', 'Гора Ухуд', 'Долина Мина'],
      exp: 'Ангел Джибриль (мир ему) принёс первое откровение в пещере Хира на горе Нур близ Мекки.',
    },
  },
  {
    id: 'pp_05',
    deck: 'prophets',
    correctIndex: 3,
    uz: {
      q: "Ka'bani o'g'li Ismoil alayhissalom bilan birga qayta bunyod etgan payg'ambar kim?",
      opts: ['Nuh alayhissalom', 'Muso alayhissalom', 'Sulaymon alayhissalom', 'Ibrohim alayhissalom'],
      exp: "Ibrohim alayhissalom Allohning amri bilan o'g'li Ismoil alayhissalom yordamida Ka'bani ko'targanlar.",
    },
    en: {
      q: 'Which Prophet rebuilt the Kaaba together with his son Ismail (AS)?',
      opts: ['Prophet Nuh (AS)', 'Prophet Musa (AS)', 'Prophet Sulayman (AS)', 'Prophet Ibrahim (AS)'],
      exp: 'Prophet Ibrahim (AS) and his son Ismail (AS) raised the foundations of the Kaaba by Allah’s command.',
    },
    ru: {
      q: 'Какой пророк вместе со своим сыном Исмаилом (мир им) возвёл стены Каабы?',
      opts: ['Нух (мир ему)', 'Муса (мир ему)', 'Сулейман (мир ему)', 'Ибрахим (мир ему)'],
      exp: 'Пророк Ибрахим вместе с сыном Исмаилом (мир им) возвели фундамент Каабы по велению Аллаха.',
    },
  },
  {
    id: 'pp_06',
    deck: 'prophets',
    correctIndex: 1,
    uz: {
      q: '«Kalimulloh» (Alloh bilan bevosita so‘zlashgan) unvoni qaysi payg‘ambarga berilgan?',
      opts: ['Ibrohim alayhissalom', 'Muso alayhissalom', 'Iso alayhissalom', 'Dovud alayhissalom'],
      exp: "Muso alayhissalom Tur tog'ida Alloh taolo bilan vositasiz so'zlashgani uchun «Kalimulloh» deb nomlangan.",
    },
    en: {
      q: 'Which Prophet is titled "Kalimullah" (the one to whom Allah spoke directly)?',
      opts: ['Prophet Ibrahim (AS)', 'Prophet Musa (AS)', 'Prophet Isa (AS)', 'Prophet Dawud (AS)'],
      exp: 'Prophet Musa (AS) is known as Kalimullah because Allah spoke to him directly at Mount Tur.',
    },
    ru: {
      q: 'Какой пророк носит почётное прозвище «Калимуллах» (собеседник Аллаха)?',
      opts: ['Ибрахим (мир ему)', 'Муса (мир ему)', 'Иса (мир ему)', 'Дауд (мир ему)'],
      exp: 'Пророк Муса (мир ему) удостоен титула Калимуллах, так как Аллах говорил с ним напрямую у горы Тур.',
    },
  },
  {
    id: 'pp_07',
    deck: 'prophets',
    correctIndex: 2,
    uz: {
      q: "Qaysi payg'ambar tush ta'biri ilmi va go'zal sabri bilan mashhur (uning nomida sura bor)?",
      opts: ['Ayyub alayhissalom', 'Zakariyo alayhissalom', 'Yusuf alayhissalom', 'Idris alayhissalom'],
      exp: "Yusuf alayhissalomning qissasi Qur'onda «Ahsanul qasas» (eng go'zal qissa) deb atalgan.",
    },
    en: {
      q: 'Which Prophet was gifted with dream interpretation and whose story is called "The Best of Stories"?',
      opts: ['Prophet Ayyub (AS)', 'Prophet Zakariyya (AS)', 'Prophet Yusuf (AS)', 'Prophet Idris (AS)'],
      exp: 'Surah Yusuf recounts the noble patience and dream-interpretation gift of Prophet Yusuf (AS).',
    },
    ru: {
      q: 'Какой пророк обладал даром толкования снов и чья история названа «лучшим повествованием»?',
      opts: ['Айюб (мир ему)', 'Закария (мир ему)', 'Юсуф (мир ему)', 'Идрис (мир ему)'],
      exp: 'Сура Юсуф повествует о прекрасном терпении и даре толкования снов пророка Юсуфа (мир ему).',
    },
  },
  {
    id: 'pp_08',
    deck: 'prophets',
    correctIndex: 0,
    uz: {
      q: '«La ilaha illa anta, subhanaka inniy kuntu minaz zolimiyn» duosini qaysi payg‘ambar aytgan?',
      opts: ['Yunus alayhissalom', 'Nuh alayhissalom', 'Hud alayhissalom', 'Solih alayhissalom'],
      exp: "Yunus alayhissalom baliq qornida qolganda shu muborak duoni aytib, Allohning najotiga erishganlar.",
    },
    en: {
      q: 'Which Prophet recited the famous dua "La ilaha illa Anta, Subhanaka inni kuntu minaz-zalimin"?',
      opts: ['Prophet Yunus (AS)', 'Prophet Nuh (AS)', 'Prophet Hud (AS)', 'Prophet Salih (AS)'],
      exp: 'Prophet Yunus (AS) called out this supplication from the belly of the whale and Allah rescued him.',
    },
    ru: {
      q: 'Какой пророк произнёс знаменитое дуа «Ля иляха илля Анта, Субханака, инни кунту миназ-залимин»?',
      opts: ['Юнус (мир ему)', 'Нух (мир ему)', 'Худ (мир ему)', 'Салих (мир ему)'],
      exp: 'Пророк Юнус (мир ему) обратился с этой мольбой из чрева кита, и Всевышний даровал ему спасение.',
    },
  },
  {
    id: 'pp_09',
    deck: 'prophets',
    correctIndex: 1,
    uz: {
      q: 'Hijriy taqvim qaysi tarixiy voqeadan boshlanadi?',
      opts: ['Badr g‘azotidan', 'Payg‘ambarimiz ﷺ ning Makkadan Madinaga hijratlaridan', 'Makka fathidan', 'Ilk vahiy nozil bo‘lgan yildan'],
      exp: "Hijriy yil hisobi milodiy 622-yildagi Payg'ambarimiz ﷺ ning Madinaga hijratlaridan boshlanadi.",
    },
    en: {
      q: 'Which historic event marks the beginning of the Islamic Hijri calendar?',
      opts: ['Battle of Badr', 'The Hijrah (migration) from Makkah to Madinah', 'Conquest of Makkah', 'Year of the first revelation'],
      exp: 'The Hijri calendar begins from the migration (Hijrah) of Prophet Muhammad ﷺ to Madinah in 622 CE.',
    },
    ru: {
      q: 'С какого исторического события начинается исламский календарь Хиджры?',
      opts: ['Битва при Бадре', 'Переселение (Хиджра) Пророка ﷺ из Мекки в Медину', 'Открытие Мекки', 'Год первого откровения'],
      exp: 'Летоисчисление по Хиджре начинается с переселения Пророка ﷺ из Мекки в Медину в 622 году.',
    },
  },
  {
    id: 'pp_10',
    deck: 'prophets',
    correctIndex: 3,
    uz: {
      q: 'Islom tarixidagi birinchi xalifa (Chahoryorlarning birinchisi) kim?',
      opts: ['Umar ibn Xattob (r.a.)', 'Usmon ibn Affon (r.a.)', 'Ali ibn Abu Tolib (r.a.)', 'Abu Bakr Siddiq (r.a.)'],
      exp: "Abu Bakr Siddiq (roziyallohu anhu) Payg'ambarimiz ﷺ ning eng yaqin do'sti va birinchi xalifa bo'lganlar.",
    },
    en: {
      q: 'Who was the first Rightly Guided Caliph of Islam?',
      opts: ['Umar ibn al-Khattab (RA)', 'Uthman ibn Affan (RA)', 'Ali ibn Abi Talib (RA)', 'Abu Bakr as-Siddiq (RA)'],
      exp: 'Abu Bakr as-Siddiq (RA), the closest companion of the Prophet ﷺ, served as the first Caliph.',
    },
    ru: {
      q: 'Кто стал первым праведным халифом Ислама?',
      opts: ['Умар ибн аль-Хаттаб (р.а.)', 'Усман ибн Аффан (р.а.)', 'Али ибн Абу Талиб (р.а.)', 'Абу Бакр ас-Сиддик (р.а.)'],
      exp: 'Первым праведным халифом был ближайший сподвижник Пророка ﷺ — Абу Бакр ас-Сиддик (да будет доволен им Аллах).',
    },
  },
  {
    id: 'pp_11',
    deck: 'prophets',
    correctIndex: 2,
    uz: {
      q: "Qaysi payg'ambarga Zabur kitobi nozil qilingan?",
      opts: ['Muso alayhissalom', 'Iso alayhissalom', 'Dovud alayhissalom', 'Ibrohim alayhissalom'],
      exp: "To'rt ilohiy kitob: Tavrot — Musoga, Zabur — Dovudga, Injil — Isoga, Qur'on — Muhammad ﷺga nozil qilingan.",
    },
    en: {
      q: 'To which Prophet was the scripture Zabur (Psalms) revealed?',
      opts: ['Prophet Musa (AS)', 'Prophet Isa (AS)', 'Prophet Dawud (AS)', 'Prophet Ibrahim (AS)'],
      exp: 'The Zabur was revealed to Prophet Dawud (AS), Tawrat to Musa, Injil to Isa, and the Quran to Muhammad ﷺ.',
    },
    ru: {
      q: 'Какому пророку было ниспослано Писание Забур?',
      opts: ['Мусе (мир ему)', 'Исе (мир ему)', 'Дауду (мир ему)', 'Ибрахиму (мир ему)'],
      exp: 'Забур был ниспослан пророку Дауду (мир ему), Таурат — Мусе, Инджиль — Исе, а Коран — Мухаммаду ﷺ.',
    },
  },
  {
    id: 'pp_12',
    deck: 'prophets',
    correctIndex: 0,
    uz: {
      q: 'Og‘ir dard va sinovlarda beqiyos sabri bilan namuna bo‘lgan payg‘ambar kim?',
      opts: ['Ayyub alayhissalom', 'Lut alayhissalom', 'Shuayb alayhissalom', 'Ilyos alayhissalom'],
      exp: "Ayyub alayhissalom ko'p yillik bemorlik va sinovlarda ham shukr va sabrni tark etmaganlar.",
    },
    en: {
      q: 'Which Prophet is famously remembered as the model of patience through severe illness and loss?',
      opts: ['Prophet Ayyub (AS)', 'Prophet Lut (AS)', 'Prophet Shuayb (AS)', 'Prophet Ilyas (AS)'],
      exp: 'Prophet Ayyub (AS) remained grateful and steadfast through years of hardship, and Allah restored his health and blessings.',
    },
    ru: {
      q: 'Какой пророк стал символом великого терпения в тяжёлой болезни и испытаниях?',
      opts: ['Айюб (мир ему)', 'Лут (мир ему)', 'Шуайб (мир ему)', 'Ильяс (мир ему)'],
      exp: 'Пророк Айюб (мир ему) проявил удивительное терпение и благодарность в многолетних испытаниях.',
    },
  },

  // ==================== 4. RAMAZON, ZAKOT & ZIKRLAR (12) ====================
  {
    id: 'wr_01',
    deck: 'worship',
    correctIndex: 1,
    uz: {
      q: 'Islomning asosiy arkonlari (ustunlari) nechta?',
      opts: ['4 ta', '5 ta', '6 ta', '7 ta'],
      exp: "Islomning 5 ustuni: Shahodat kalimasi, Namoz, Zakot, Ramazon ro'zasi va qodir kishiga Haj.",
    },
    en: {
      q: 'How many Pillars of Islam are there?',
      opts: ['4', '5', '6', '7'],
      exp: 'The 5 Pillars of Islam are Shahadah, Salah, Zakat, Fasting in Ramadan, and Hajj for those able.',
    },
    ru: {
      q: 'Сколько столпов в Исламе?',
      opts: ['4', '5', '6', '7'],
      exp: 'Пять столпов Ислама: Шахада, Намаз, Закят, Пост в Рамадан и Хадж для имеющих возможность.',
    },
  },
  {
    id: 'wr_02',
    deck: 'worship',
    correctIndex: 2,
    uz: {
      q: 'Iymonning shartlari (arkonlari) nechta?',
      opts: ['4 ta', '5 ta', '6 ta', '8 ta'],
      exp: "Iymon 6 shartdan iborat: Allohga, farishtalariga, kitoblariga, payg'ambarlariga, oxirat kuniga va qadarga ishonish.",
    },
    en: {
      q: 'How many Articles of Faith (Iman) are there?',
      opts: ['4', '5', '6', '8'],
      exp: 'The 6 Articles of Iman: belief in Allah, His angels, His books, His messengers, the Last Day, and Divine Decree (Qadr).',
    },
    ru: {
      q: 'Сколько столпов веры (Имана)?',
      opts: ['4', '5', '6', '8'],
      exp: 'Шесть столпов Имана: вера в Аллаха, ангелов, Писания, посланников, Судный день и предопределение.',
    },
  },
  {
    id: 'wr_03',
    deck: 'worship',
    correctIndex: 0,
    uz: {
      q: 'Nisobga yetgan va 1 qamariy yil to‘lgan moldan zakot qancha foiz beriladi?',
      opts: ['2.5% (qirqdan biri)', '5%', '10%', '1%'],
      exp: "Nisob miqdoriga (85 gramm tillo qiymati) yetib bir yil to'lgan ortiqcha moldan 2.5% (1/40) zakot beriladi.",
    },
    en: {
      q: 'What percentage of eligible savings above Nisab is paid annually as Zakat?',
      opts: ['2.5% (1/40th)', '5%', '10%', '1%'],
      exp: 'Zakat is 2.5% (one-fortieth) of net zakatable wealth held for one lunar year above the Nisab (85g of gold).',
    },
    ru: {
      q: 'Какой процент от имущества, достигшего нисаба за лунный год, выплачивается в виде закята?',
      opts: ['2,5% (одна сороковая)', '5%', '10%', '1%'],
      exp: 'Закят составляет 2,5% (1/40 часть) от имущества сверх нисаба (эквивалент 85 г золота), пролежавшего один лунный год.',
    },
  },
  {
    id: 'wr_04',
    deck: 'worship',
    correctIndex: 3,
    uz: {
      q: 'Qadr kechasi (Laylatul Qadr) qancha muddatdan yaxshiroq deb Qur’onda marhamat qilingan?',
      opts: ['100 kundan', '10 yildan', '500 oydan', '1000 oydan'],
      exp: "Qadr surasining 3-oyatida: «Qadr kechasi ming oydan yaxshiroqdir» (taxminan 83 yildan ortiq) deyilgan.",
    },
    en: {
      q: 'Laylatul Qadr (Night of Decree) is better than how many months of worship?',
      opts: ['100 days', '10 years', '500 months', '1,000 months'],
      exp: 'Surah Al-Qadr (97:3) states: "The Night of Decree is better than a thousand months" (over 83 years).',
    },
    ru: {
      q: 'Ночь Предопределения (Ляйлятуль-Кадр) лучше скольких месяцев поклонения?',
      opts: ['100 дней', '10 лет', '500 месяцев', '1 000 месяцев'],
      exp: 'В суре Аль-Кадр сказано: «Ночь Предопределения лучше тысячи месяцев» (более 83 лет).',
    },
  },
  {
    id: 'wr_05',
    deck: 'worship',
    correctIndex: 1,
    uz: {
      q: 'Namozdan keyin aytiladigan «Fotima tasbehi» tartibi qanday?',
      opts: ['10 – 10 – 10', '33 Subhanalloh, 33 Alhamdulillah, 33 Allohu Akbar', '50 – 50', '100 Istig‘for'],
      exp: "Har namozdan so'ng 33 marta Subhanalloh, 33 marta Alhamdulillah va 33 marta Allohu Akbar aytib, yuzinchisida tahlil bilan tugatish ulug' sunnatdir.",
    },
    en: {
      q: 'What is the count of Tasbih Fatimah recited after daily prayers?',
      opts: ['10 – 10 – 10', '33 SubhanAllah, 33 Alhamdulillah, 33 Allahu Akbar', '50 – 50', '100 Istighfar'],
      exp: 'Reciting SubhanAllah 33 times, Alhamdulillah 33 times, and Allahu Akbar 33 times after each prayer is a great Sunnah.',
    },
    ru: {
      q: 'Каков порядок тасбиха Фатимы, читаемого после каждого намаза?',
      opts: ['10 – 10 – 10', '33 Субханаллах, 33 Альхамдулиллях, 33 Аллаху Акбар', '50 – 50', '100 Истигфар'],
      exp: 'После намаза сунной является произносить по 33 раза Субханаллах, Альхамдулиллях и Аллаху Акбар.',
    },
  },
  {
    id: 'wr_06',
    deck: 'worship',
    correctIndex: 0,
    uz: {
      q: 'Ro‘zador kishi esidan chiqib biror narsa yeb yoki ichib qo‘ysa ro‘zasi nima bo‘ladi?',
      opts: ['Ro‘zasi buzilmaydi, davom ettiradi', 'Ro‘zasi buziladi va kafforat lozim', 'Faqat qazo tutiladi', 'O‘sha kun hisoblanmaydi'],
      exp: "Sahih hadisga ko'ra, unutib yeb-ichgan ro'zadorni Alloh taomlantirgan bo'ladi — ro'zasi buzilmaydi, darhol to'xtatib davom ettiradi.",
    },
    en: {
      q: 'What happens if a fasting person accidentally eats or drinks out of forgetfulness?',
      opts: ['The fast remains valid; continue fasting', 'The fast is broken and requires Kaffarah', 'Only Qaza is required', 'The day does not count'],
      exp: 'By authentic Hadith, eating or drinking purely out of forgetfulness does not break the fast; simply stop once remembered.',
    },
    ru: {
      q: 'Что происходит с постом, если постящийся поел или попил по забывчивости?',
      opts: ['Пост не нарушается, нужно продолжить', 'Пост нарушен и нужен каффарат', 'Нужно возместить этот день', 'День не засчитывается'],
      exp: 'По достоверному хадису, еда или питьё по забывчивости не нарушают пост — нужно просто прекратить, как только вспомнил.',
    },
  },
  {
    id: 'wr_07',
    deck: 'worship',
    correctIndex: 2,
    uz: {
      q: 'Ramazon oyidan keyin Shavvol oyida necha kun nafl ro‘za tutish bir yillik ro‘za savobini beradi?',
      opts: ['3 kun', '5 kun', '6 kun', '10 kun'],
      exp: "Hadisga ko'ra: «Kim Ramazon ro'zasini tutib, ortidan Shavvoldan 6 kun ro'za tutsa, yil bo'yi ro'za tutgandek bo'ladi».",
    },
    en: {
      q: 'Fasting how many days in Shawwal after Ramadan carries the reward of fasting the whole year?',
      opts: ['3 days', '5 days', '6 days', '10 days'],
      exp: 'Prophet Muhammad ﷺ said that fasting Ramadan followed by 6 days of Shawwal equals the reward of fasting an entire year.',
    },
    ru: {
      q: 'Сколько дней поста в месяце Шавваль после Рамадана дают награду поста за целый год?',
      opts: ['3 дня', '5 дней', '6 дней', '10 дней'],
      exp: 'Пророк ﷺ сообщил, что пост в Рамадан и 6 дней Шавваля приравниваются к посту на протяжении всего года.',
    },
  },
  {
    id: 'wr_08',
    deck: 'worship',
    correctIndex: 1,
    uz: {
      q: 'Ramazon oyida kechalari o‘qiladigan Taroveh namozi Hanafiy mazhabida necha rakat?',
      opts: ['8 rakat', '20 rakat', '12 rakat', '16 rakat'],
      exp: "Hanafiy mazhabida Taroveh namozi 20 rakat (har 2 rakatda salom berib) sunnati muakkadadir.",
    },
    en: {
      q: 'How many rakats is Tarawih prayer in the Hanafi school?',
      opts: ['8 rakats', '20 rakats', '12 rakats', '16 rakats'],
      exp: 'In the Hanafi school, Tarawih is 20 rakats (prayed in sets of two) and is Sunnah Muakkadah during Ramadan.',
    },
    ru: {
      q: 'Сколько ракаатов составляет намаз Таравих в ханафитском мазхабе?',
      opts: ['8 ракаатов', '20 ракаатов', '12 ракаатов', '16 ракаатов'],
      exp: 'В ханафитском мазхабе Таравих состоит из 20 ракаатов (по 2 ракаата) и является настоятельной сунной.',
    },
  },
  {
    id: 'wr_09',
    deck: 'worship',
    correctIndex: 0,
    uz: {
      q: 'Saharlik qilishning hukmi nima?',
      opts: ['Barakali sunnat', 'Farz', 'Makruh', 'Vojib'],
      exp: "Payg'ambarimiz ﷺ: «Saharlik qilinglar, zero saharlikda baraka bordir», deganlar.",
    },
    en: {
      q: 'What is the status of eating Suhoor (pre-dawn meal) before fasting?',
      opts: ['A blessed Sunnah', 'Fard (obligatory)', 'Makruh', 'Wajib'],
      exp: 'The Prophet ﷺ said: "Take Suhoor, for indeed in Suhoor there is blessing (Barakah)."',
    },
    ru: {
      q: 'Какой статус имеет сухур (предрассветный приём пищи) в пост?',
      opts: ['Благословенная сунна', 'Фарз', 'Макрух', 'Ваджиб'],
      exp: 'Пророк ﷺ сказал: «Ешьте перед рассветом (сухур), поистине в сухуре — благодать (баракат)».',
    },
  },
  {
    id: 'wr_10',
    deck: 'worship',
    correctIndex: 3,
    uz: {
      q: '«Tilda yengil, mezonda og‘ir, Rahmonga suyukli ikki kalima» qaysi zikr?',
      opts: ['La havla va la quvvata', 'Astag‘firulloh', 'Hasbunalloh', 'Subhanallohi va bihamdihi, Subhanallohil Aziym'],
      exp: "Buxoriy va Muslim rivoyat qilgan hadisda «Subhanallohi va bihamdihi, Subhanallohil Aziym» kalimalari shunday vasf etilgan.",
    },
    en: {
      q: 'Which two phrases are "light on the tongue, heavy on the scale, and beloved to Ar-Rahman"?',
      opts: ['La hawla wa la quwwata', 'Astaghfirullah', 'HasbunAllah', 'SubhanAllahi wa bihamdihi, SubhanAllahil-Azim'],
      exp: 'Narrated in Bukhari & Muslim: "SubhanAllahi wa bihamdihi, SubhanAllahil-Azim" are light on the tongue and heavy on the Scale.',
    },
    ru: {
      q: 'Какие два слова «легки на языке, тяжелы на Весах и любимы Милостивым»?',
      opts: ['Ля хауля ва ля куввата', 'Астагфируллах', 'Хасбуналлах', 'Субханаллахи ва бихамдихи, Субханаллахиль-Азым'],
      exp: 'В достоверном хадисе Бухари и Муслима так описан зикр «Субханаллахи ва бихамдихи, Субханаллахиль-Азым».',
    },
  },
  {
    id: 'wr_11',
    deck: 'worship',
    correctIndex: 2,
    uz: {
      q: 'Fitr sadaqasini berishning eng afzal vaqti qachon?',
      opts: ['Qurbon hayitida', 'Muharram oyida', 'Ramazon hayiti namozidan oldin', 'Shabon oyida'],
      exp: "Fitr sadaqasi Ramazon oyida, eng afzali hayit namoziga chiqishdan oldin muhtojlarga beriladi.",
    },
    en: {
      q: 'When is the best time to give Zakat al-Fitr (Fitr Sadaqah)?',
      opts: ['On Eid al-Adha', 'In Muharram', 'Before the Eid al-Fitr prayer', 'In Shaban'],
      exp: 'Zakat al-Fitr is given during Ramadan, ideally before the Eid al-Fitr prayer so the needy can celebrate happily.',
    },
    ru: {
      q: 'Когда лучше всего выплатить фитр-садака?',
      opts: ['На Курбан-байрам', 'В месяце Мухаррам', 'До праздничного намаза Ид аль-Фитр', 'В месяце Шаабан'],
      exp: 'Фитр-садака лучше всего отдать нуждающимся до начала праздничного намаза Ураза-байрам.',
    },
  },
  {
    id: 'wr_12',
    deck: 'worship',
    correctIndex: 1,
    uz: {
      q: 'Qaysi kunda tutilgan ro‘za o‘tgan va kelasi yilning kichik gunohlariga kafforat bo‘ladi?',
      opts: ['Ashuro kuni', 'Arafa kuni (Zulhijja 9-kuni)', 'Dushanba kuni', 'Shabon 15-kuni'],
      exp: "Hajda bo'lmagan kishilar uchun Arafa kuni ro'za tutish o'tgan va kelgusi bir yillik gunohlarga kafforat bo'lishi hadisda aytilgan.",
    },
    en: {
      q: 'Fasting on which day expiates minor sins of the previous year and the coming year?',
      opts: ['Day of Ashura', 'Day of Arafah (9th Dhul-Hijjah)', 'Monday', '15th of Shaban'],
      exp: 'For non-pilgrims, fasting on the Day of Arafah expiates the sins of the previous and upcoming year (Sahih Muslim).',
    },
    ru: {
      q: 'Пост в какой день искупает малые грехи прошлого и будущего года?',
      opts: ['День Ашура', 'День Арафа (9-е Зуль-Хиджа)', 'Понедельник', '15-е Шаабана'],
      exp: 'Для не совершающих хадж пост в день Арафа искупает грехи прошлого и предстоящего года (Сахих Муслим).',
    },
  },
  // ==================== +8 NEW PRAYER QUESTIONS (pr_13..pr_20) ====================
  {
    id: 'pr_13',
    deck: 'prayer',
    correctIndex: 1,
    uz: {
      q: 'Hanafiy mazhabida muqim kishi mahsiga mash tortganda uning muddati qancha?',
      opts: ['12 soat', '1 kecha-kunduz (24 soat)', '2 kecha-kunduz (48 soat)', '3 kecha-kunduz (72 soat)'],
      exp: 'Tahorat buzilgach birinchi mash tortilgan paytdan boshlab muqim uchun 24 soat, musofir uchun 72 soat davom etadi.',
    },
    en: {
      q: 'In the Hanafi school, how long can a resident (muqim) wipe over leather socks (khuffayn)?',
      opts: ['12 hours', '1 day and night (24 hours)', '2 days and nights (48 hours)', '3 days and nights (72 hours)'],
      exp: 'For a resident, the wiping period is 24 hours from the first hadath after putting them on; for a traveler it is 72 hours.',
    },
    ru: {
      q: 'Каков срок протирания кожаных носков (масх на хуффайн) для непутника (мукима) в ханафитском мазхабе?',
      opts: ['12 часов', '1 сутки (24 часа)', '2 суток (48 часов)', '3 суток (72 часа)'],
      exp: 'Срок масха для мукима составляет 24 часа, а для путника (мусафира) — 72 часа с момента потери омовения.',
    },
    src: { uz: 'Sahihi Muslim, 276-hadis • Al-Hidoya', en: 'Sahih Muslim 276 • Al-Hidayah', ru: 'Сахих Муслим 276 • Аль-Хидая' },
  },
  {
    id: 'pr_14',
    deck: 'prayer',
    correctIndex: 2,
    uz: {
      q: 'Hanafiy mazhabiga ko‘ra qaysi holat tahoratni buzadi?',
      opts: ['Namozda ovozsiz tabassum qilish', 'Tirnoq olish', 'Badandan qon chiqib oqishi', 'Chivin chaqishi'],
      exp: 'Hanafiy mazhabida yaradan qon yoki yiring chiqib, o‘z joyidan atrofga oqsa tahorat buziladi.',
    },
    en: {
      q: 'According to the Hanafi school, which of the following nullifies Wudu?',
      opts: ['Smiling silently in prayer', 'Trimming nails', 'Blood flowing out from a wound', 'A mosquito bite'],
      exp: 'In Hanafi fiqh, blood or pus that flows beyond the opening of the wound nullifies Wudu.',
    },
    ru: {
      q: 'Что из перечисленного нарушает омовение (тахарат) согласно ханафитскому мазхабу?',
      opts: ['Беззвучная улыбка в намазе', 'Стрижка ногтей', 'Кровь, вытекшая из раны за её пределы', 'Укус комара'],
      exp: 'В ханафитском мазхабе кровь или гной, вытекшие за пределы ранки, нарушают омовение.',
    },
    src: { uz: 'Hanafiy fiqhi • Muxtasarul Viqoya', en: 'Hanafi Fiqh • Mukhtasar al-Wiqayah', ru: 'Ханафитский фикх • Мухтасар аль-Викая' },
  },
  {
    id: 'pr_15',
    deck: 'prayer',
    correctIndex: 2,
    uz: {
      q: 'Hanafiy mazhabida masbuq (imomga kechikib qo‘shilgan kishi) namozni qachon davom ettiradi?',
      opts: ['Imom birinchi salomni berishi bilan', 'Imom tashahhudni tugatishi bilan', 'Imom ikkala tomonga salom bergandan keyin', 'Jamoat turib ketgandan keyin'],
      exp: 'Masbuq imom o‘ng va chap tomonga salom berib bo‘lgach, takbir aytib turadi va qoldirgan rakatlarini o‘qiydi.',
    },
    en: {
      q: 'When does a latecomer (masbuq) stand up to complete missed rak‘ahs in the Hanafi school?',
      opts: ['Immediately on the first salam', 'As soon as Tashahhud ends', 'After the Imam completes salam to both sides', 'After the congregation leaves'],
      exp: 'The masbuq waits until the Imam finishes the salam to verify the Imam has no Sajdah Sahw, then stands to complete missed rak‘ahs.',
    },
    ru: {
      q: 'Когда опоздавший на коллективный намаз (масбук) встаёт для восполнения пропущенных ракаатов?',
      opts: ['Сразу после первого саляма имама', 'Сразу после ташаххуда', 'После того как имам даст салям на обе стороны', 'Когда джамаат разойдётся'],
      exp: 'Масбук ждёт завершения саляма имама (убедившись, что нет саджда сахв), затем встаёт и дочитывает пропущенные ракааты.',
    },
    src: { uz: 'Hanafiy fiqhi • Nurul Izoh', en: 'Hanafi Fiqh • Nur al-Idah', ru: 'Ханафитский фикх • Нур аль-Идах' },
  },
  {
    id: 'pr_16',
    deck: 'prayer',
    correctIndex: 1,
    uz: {
      q: 'Hanafiy mazhabida Sajdai sahv qachon qilinadi?',
      opts: ['Salom berishdan oldin', 'Oxirgi qa’dada o‘ng tomonga bir salom bergandan keyin', 'Namoz tugab duo qilingandan keyin', 'Ruku bilan sajdaning orasida'],
      exp: 'Oxirgi qa’dada «Attahiyyot» o‘qilgach, o‘ng tomonga salom berilib ikki marta sajda qilinadi, so‘ng tashahhud, salavot va duo o‘qilib salom beriladi.',
    },
    en: {
      q: 'In the Hanafi school, when is Sajdah Sahw (prostration of forgetfulness) performed?',
      opts: ['Before giving any salam', 'In the final sitting after giving one salam to the right', 'After finishing dua', 'Between ruku and sujud'],
      exp: 'After reciting Tashahhud in the final sitting, one gives salam to the right, performs two prostrations, then recites Tashahhud, Salawat, dua, and salam.',
    },
    ru: {
      q: 'Когда совершается саджда сахв (земной поклон для исправления ошибки) в ханафитском мазхабе?',
      opts: ['До произнесения саляма', 'В последнем сидении после одного саляма направо', 'После завершения дуа', 'Между руку и суджудом'],
      exp: 'В последнем сидении после «Ат-Тахият» даётся салям направо, совершаются два земных поклона, затем читаются ташаххуд, салават, дуа и даётся салям.',
    },
    src: { uz: 'Hanafiy fiqhi • Al-Hidoya', en: 'Hanafi Fiqh • Al-Hidayah', ru: 'Ханафитский фикх • Аль-Хидая' },
  },
  {
    id: 'pr_17',
    deck: 'prayer',
    correctIndex: 1,
    uz: {
      q: 'Ramazon va Qurbon hayiti namozlarining hukmi Hanafiy mazhabida nima?',
      opts: ['Sunnat', 'Vojib', 'Farzi kifoya', 'Mustahab'],
      exp: 'Juma namozi farz bo‘lgan kishilarga ikki hayit namozini o‘qish Hanafiy mazhabida vojibdir va har birida 6 tadan qo‘shimcha vojib takbir aytiladi.',
    },
    en: {
      q: 'What is the ruling of the two Eid prayers in the Hanafi school?',
      opts: ['Sunnah', 'Wajib (obligatory)', 'Fard Kifayah', 'Mustahabb'],
      exp: 'In the Hanafi school, Eid al-Fitr and Eid al-Adha prayers are Wajib upon those for whom Jumu‘ah is obligatory, with 6 extra Wajib takbirs.',
    },
    ru: {
      q: 'Каков хукм праздничных намазов Ид аль-Фитр и Ид аль-Адха в ханафитском мазхабе?',
      opts: ['Сунна', 'Ваджиб', 'Фарз кифая', 'Мустахаб'],
      exp: 'В ханафитском мазхабе оба праздничных намаза являются ваджибом и совершаются с 6 дополнительными такбирами.',
    },
    src: { uz: 'Hanafiy fiqhi • Muxtasarul Viqoya', en: 'Hanafi Fiqh • Mukhtasar al-Wiqayah', ru: 'Ханафитский фикх • Мухтасар аль-Викая' },
  },
  {
    id: 'pr_18',
    deck: 'prayer',
    correctIndex: 2,
    uz: {
      q: 'Janoza namozida nechta takbir aytiladi va nechta sajda bor?',
      opts: ['3 ta takbir, 1 ta sajda', '4 ta takbir, 2 ta sajda', '4 ta takbir, ruku va sajda yo‘q', '5 ta takbir, ruku va sajda yo‘q'],
      exp: 'Janoza namozi tik turgan holda 4 ta takbir bilan o‘qiladi, unda ruku va sajda bo‘lmaydi, hukmi esa farzi kifoyadir.',
    },
    en: {
      q: 'How many takbirs and prostrations are in the Janazah (funeral) prayer?',
      opts: ['3 takbirs, 1 prostration', '4 takbirs, 2 prostrations', '4 takbirs, with no ruku or sujud', '5 takbirs, with no ruku or sujud'],
      exp: 'Janazah prayer is Fard Kifayah and is performed standing with 4 takbirs and without ruku or sujud.',
    },
    ru: {
      q: 'Сколько такбиров и земных поклонов в джаназа-намазе?',
      opts: ['3 такбира, 1 саджда', '4 такбира, 2 саджда', '4 такбира, без руку и суджуда', '5 такбиров, без руку и суджуда'],
      exp: 'Джаназа-намаз (фарз кифая) совершается стоя с 4 такбирами без поясных и земных поклонов.',
    },
    src: { uz: 'Sahihul Buxoriy, 1333-hadis • Al-Hidoya', en: 'Sahih al-Bukhari 1333 • Al-Hidayah', ru: 'Сахих аль-Бухари 1333 • Аль-Хидая' },
  },
  {
    id: 'pr_19',
    deck: 'prayer',
    correctIndex: 2,
    uz: {
      q: 'Kun davomidagi qaysi uch vaqtda namoz o‘qish makruhi tahrimiy (taqiqlangan) hisoblanadi?',
      opts: ['Bomdoddan oldin, Peshindan keyin, Xuftonda', 'Yomg‘ir paytida, safarda, kasallikda', 'Quyosh chiqayotganda, tikkaga kelganda (zavol) va botayotganda', 'Asrdan oldin va Xuftondan keyin'],
      exp: 'Uqba ibn Omir (r.a.) rivoyat qilgan hadisga binoan quyosh chiqayotgan, qiyomga kelgan va botayotgan paytda namoz o‘qishdan qaytarilgan.',
    },
    en: {
      q: 'During which three times of the day is praying strictly prohibited (makruh tahrimi)?',
      opts: ['Before Fajr, after Dhuhr, at Isha', 'During rain, travel, or illness', 'At sunrise, at solar zenith (istiwā), and at sunset', 'Before Asr and after Isha'],
      exp: 'Based on the hadith of ‘Uqbah ibn ‘Amir (r.a.), prayer is forbidden while the sun rises, when it is directly overhead at zenith, and while it sets.',
    },
    ru: {
      q: 'В какие три периода дня строго запрещено совершать намаз?',
      opts: ['До Фаджра, после Зухра, ночью', 'В дождь, в пути и во время болезни', 'Во время восхода, в зените и во время заката солнца', 'Перед Асром и после Иша'],
      exp: 'Согласно хадису Укбы ибн Амира (р.а.), запрещено молиться во время восхода солнца, когда оно в зените и во время его захода.',
    },
    src: { uz: 'Sahihi Muslim, 831-hadis', en: 'Sahih Muslim, Hadith 831', ru: 'Сахих Муслим, хадис 831' },
  },
  {
    id: 'pr_20',
    deck: 'prayer',
    correctIndex: 1,
    uz: {
      q: 'Namozxon o‘z oldidan o‘tuvchilarni to‘sish uchun qo‘yadigan to‘siq nima deb ataladi?',
      opts: ['Mehrob', 'Sutra', 'Minbar', 'Rahl'],
      exp: 'Sutra — namoz o‘quvchining oldiga qo‘yiladigan to‘siq bo‘lib, u namozxonning sajda o‘rnini himoya qiladi.',
    },
    en: {
      q: 'What is the barrier placed in front of a praying person to prevent others from passing directly across called?',
      opts: ['Mihrab', 'Sutrah', 'Minbar', 'Rahl'],
      exp: 'A Sutrah is an object placed in front of the worshipper as a boundary beyond which people may pass without disturbing the prayer.',
    },
    ru: {
      q: 'Как называется преграда, которую молящийся ставит перед собой, чтобы люди не проходили перед ним?',
      opts: ['Михраб', 'Сутра', 'Минбар', 'Рахль'],
      exp: 'Сутра — предмет или преграда перед молящимся, обозначающая границу места его земного поклона.',
    },
    src: { uz: 'Sahihul Buxoriy, 494-hadis', en: 'Sahih al-Bukhari, Hadith 494', ru: 'Сахих аль-Бухари, хадис 494' },
  },
  // ==================== +8 NEW QURAN QUESTIONS (qr_13..qr_20) ====================
  {
    id: 'qr_13',
    deck: 'quran',
    correctIndex: 2,
    uz: {
      q: "Qur'oni Karimning har bir oyatida «Alloh» lafzi jalolasi qatnashgan yagona sura qaysi?",
      opts: ['Al-Ixlos surasi', 'Ar-Rahmon surasi', 'Al-Mujodala surasi', 'Al-Fath surasi'],
      exp: 'Al-Mujodala surasining barcha 22 ta oyatida Alloh taoloning muborak ismi zikr qilingan.',
    },
    en: {
      q: 'Which is the only Surah in the Quran where the name “Allah” appears in every single ayah?',
      opts: ['Surah Al-Ikhlas', 'Surah Ar-Rahman', 'Surah Al-Mujadilah', 'Surah Al-Fath'],
      exp: 'Surah Al-Mujadilah (58th Surah) mentions the name of Allah in all 22 of its ayahs.',
    },
    ru: {
      q: 'В какой единственной суре Корана имя «Аллах» упоминается в каждом аяте?',
      opts: ['Сура Аль-Ихляс', 'Сура Ар-Рахман', 'Сура Аль-Муджадиля', 'Сура Аль-Фатх'],
      exp: 'Во всех 22 аятах суры Аль-Муджадиля (58-я сура) упоминается имя Всевышнего Аллаха.',
    },
    src: { uz: "Qur'on, Al-Mujodala surasi (58-sura, 1–22-oyatlar)", en: "Qur'an, Surah Al-Mujadilah 58:1–22", ru: 'Коран, сура Аль-Муджадиля 58:1–22' },
  },
  {
    id: 'qr_14',
    deck: 'quran',
    correctIndex: 1,
    uz: {
      q: "Qur'oni Karimda ichida «Bismillahir Rohmanir Rohiym» ikki marta kelgan sura qaysi?",
      opts: ['Al-Baqara surasi', 'An-Naml surasi', 'Maryam surasi', 'Toha surasi'],
      exp: 'An-Naml surasining boshida va 30-oyatida (Sulaymon alayhissalomning Bilqisga maktubida) «Bismillah» kelgan.',
    },
    en: {
      q: 'Which Surah of the Quran contains “Bismillahir-Rahmanir-Rahim” twice?',
      opts: ['Surah Al-Baqarah', 'Surah An-Naml', 'Surah Maryam', 'Surah Ta-Ha'],
      exp: 'Surah An-Naml starts with Bismillah and mentions it a second time in ayah 30 inside Prophet Sulayman’s letter.',
    },
    ru: {
      q: 'В какой суре Корана «Бисмилляхир-Рахманир-Рахим» встречается дважды?',
      opts: ['Сура Аль-Бакара', 'Сура Ан-Намль', 'Сура Марьям', 'Сура Та Ха'],
      exp: 'В суре Ан-Намль «Бисмиллях» стоит в начале суры и в 30-м аяте — в письме пророка Сулеймана (а.с.).',
    },
    src: { uz: "Qur'on, An-Naml surasi, 30-oyat", en: "Qur'an, Surah An-Naml 27:30", ru: 'Коран, сура Ан-Намль, аят 30' },
  },
  {
    id: 'qr_15',
    deck: 'quran',
    correctIndex: 1,
    uz: {
      q: "Qur'oni Karimda nechta tilovat sajdasi (sajdai tilovat) oyati mavjud?",
      opts: ['10 ta', '14 ta', '19 ta', '30 ta'],
      exp: "Hanafiy mazhabiga ko‘ra Qur'oni Karimda 14 ta sajdai tilovat oyati bo‘lib, ularni o‘qigan yoki eshitgan kishiga bir marta sajda qilish vojib bo‘ladi.",
    },
    en: {
      q: 'How many verses of prostration of recitation (Sajdah Tilawah) are in the Quran according to the Hanafi school?',
      opts: ['10', '14', '19', '30'],
      exp: 'There are 14 Sajdah Tilawah verses in the Quran; performing a single prostration upon reciting or hearing one is Wajib in the Hanafi school.',
    },
    ru: {
      q: 'Сколько аятов земного поклона при чтении (саджда тиляват) в Коране согласно ханафитскому мазхабу?',
      opts: ['10', '14', '19', '30'],
      exp: 'В Коране 14 мест саджда тиляват; прочитавшему или услышавшему такой аят совершить один земной поклон является ваджибом.',
    },
    src: { uz: 'Hanafiy fiqhi • Al-Hidoya', en: 'Hanafi Fiqh • Al-Hidayah', ru: 'Ханафитский фикх • Аль-Хидая' },
  },
  {
    id: 'qr_16',
    deck: 'quran',
    correctIndex: 2,
    uz: {
      q: "Qur'oni Karimda eng uzun oyat — «Qarz oyati» (Oyatu d-dayn) qaysi surada joylashgan?",
      opts: ['Oli Imron, 200-oyat', 'An-Niso, 12-oyat', 'Al-Baqara, 282-oyat', 'Al-Moida, 3-oyat'],
      exp: 'Al-Baqara surasining 282-oyati Qur’ondagi eng uzun oyat bo‘lib, qarz va moliyaviy guvohlik qoidalarini bayon qiladi.',
    },
    en: {
      q: 'Where is the longest ayah in the Quran — Ayat ad-Dayn (the Verse of Debt) — located?',
      opts: ['Aal-E-Imran 3:200', 'An-Nisa 4:12', 'Al-Baqarah 2:282', 'Al-Ma’idah 5:3'],
      exp: 'Ayah 282 of Surah Al-Baqarah is the longest verse in the Quran and regulates writing down debts and financial contracts.',
    },
    ru: {
      q: 'В какой суре находится самый длинный аят Корана — «Аят о долге» (Аят ад-Дайн)?',
      opts: ['Алю Имран, аят 200', 'Ан-Ниса, аят 12', 'Аль-Бакара, аят 282', 'Аль-Маида, аят 3'],
      exp: '282-й аят суры Аль-Бакара — самый длинный аят Корана, устанавливающий правила записи долговых обязательств.',
    },
    src: { uz: "Qur'on, Al-Baqara surasi, 282-oyat", en: "Qur'an, Surah Al-Baqarah 2:282", ru: 'Коран, сура Аль-Бакара, аят 282' },
  },
  {
    id: 'qr_17',
    deck: 'quran',
    correctIndex: 1,
    uz: {
      q: '«Fabi-ayyi ala’i Robbikuma tukazzibon» («Robbingizning qaysi ne’matlarini yolg‘onga chiqarasiz?!») oyati qaysi surada 31 marta takrorlangan?',
      opts: ['Al-Voqia surasi', 'Ar-Rahmon surasi', 'Al-Mulk surasi', 'An-Naba surasi'],
      exp: '«Qur’on kelini» deb sifatlangan Ar-Rahmon surasida ushbu oyat inson va jinlarga xitoban 31 marta takrorlanadi.',
    },
    en: {
      q: 'In which Surah is the verse “So which of the favors of your Lord would you deny?” repeated 31 times?',
      opts: ['Surah Al-Waqi‘ah', 'Surah Ar-Rahman', 'Surah Al-Mulk', 'Surah An-Naba'],
      exp: 'In Surah Ar-Rahman (55th Surah), this refrain addressing humans and jinn is repeated 31 times.',
    },
    ru: {
      q: 'В какой суре аят «Какую же из милостей вашего Господа вы считаете ложью?!» повторяется 31 раз?',
      opts: ['Сура Аль-Вакиа', 'Сура Ар-Рахман', 'Сура Аль-Мульк', 'Сура Ан-Наба'],
      exp: 'В суре Ар-Рахман (55-я сура) этот аят, обращённый к людям и джиннам, повторяется 31 раз.',
    },
    src: { uz: "Qur'on, Ar-Rahmon surasi (55-sura)", en: "Qur'an, Surah Ar-Rahman (Surah 55)", ru: 'Коран, сура Ар-Рахман (55-я сура)' },
  },
  {
    id: 'qr_18',
    deck: 'quran',
    correctIndex: 2,
    uz: {
      q: 'Payg‘ambarimiz ﷺ qaysi ikki surani «Zahrovayn» — Qiyomat kuni sohibini soyabon kabi himoya qiluvchi «Ikki nurli sura» deb ataganlar?',
      opts: ['Falaq va Nos suralari', 'Yosin va Mulk suralari', 'Baqara va Oli Imron suralari', 'Kahf va Maryam suralari'],
      exp: 'Sahihi Muslimdagi hadisda Baqara va Oli Imron suralari «Zahrovayn» (ikki nur sochuvchi) deb atalgan.',
    },
    en: {
      q: 'Which two Surahs did the Prophet ﷺ call “Az-Zahrawayn” (The Two Shining Ones) that will shade their reciter on the Day of Judgment?',
      opts: ['Al-Falaq & An-Nas', 'Ya-Sin & Al-Mulk', 'Al-Baqarah & Aal-E-Imran', 'Al-Kahf & Maryam'],
      exp: 'In Sahih Muslim, the Prophet ﷺ urged reciting Al-Baqarah and Aal-E-Imran, calling them Az-Zahrawayn (the Two Bright Ones).',
    },
    ru: {
      q: 'Какие две суры Пророк ﷺ назвал «Аз-Захравайн» (Две сияющие), которые заступятся за читавшего их в Судный день?',
      opts: ['Аль-Фаляк и Ан-Нас', 'Ясин и Аль-Мульк', 'Аль-Бакара и Алю Имран', 'Аль-Кахф и Марьям'],
      exp: 'В хадисе Сахих Муслим суры Аль-Бакара и Алю Имран названы «Аз-Захравайн» — двумя светочами.',
    },
    src: { uz: 'Sahihi Muslim, 804-hadis', en: 'Sahih Muslim, Hadith 804', ru: 'Сахих Муслим, хадис 804' },
  },
  {
    id: 'qr_19',
    deck: 'quran',
    correctIndex: 1,
    uz: {
      q: 'Abu Bakr va Umar (r.a.) davrlarida Qur’oni Karimni jamlab, mushaf holiga keltirish vazifasi qaysi vahiy kotibi sahobaga topshirilgan?',
      opts: ['Muoz ibn Jabal (r.a.)', 'Zayd ibn Sobit (r.a.)', 'Abdulloh ibn Umar (r.a.)', 'Anas ibn Molik (r.a.)'],
      exp: 'Rasululloh ﷺning asosiy vahiy kotiblaridan bo‘lgan Zayd ibn Sobit (r.a.) ham Abu Bakr (r.a.), ham Usmon (r.a.) davrida Qur’onni jamlash hay’atiga boshchilik qilganlar.',
    },
    en: {
      q: 'Which scribe of revelation was entrusted by Abu Bakr and Uthman (r.a.) to lead the compilation of the Quran into a Mushaf?',
      opts: ['Mu‘adh ibn Jabal (r.a.)', 'Zayd ibn Thabit (r.a.)', 'Abdullah ibn Umar (r.a.)', 'Anas ibn Malik (r.a.)'],
      exp: 'Zayd ibn Thabit (r.a.), the chief scribe of revelation, led the compilation of the Quran under both Abu Bakr and Uthman (r.a.).',
    },
    ru: {
      q: 'Какому сподвижнику — писцу откровения — Абу Бакр и Усман (р.а.) поручили возглавить собрание Корана в единый Мусхаф?',
      opts: ['Муаз ибн Джабаль (р.а.)', 'Зайд ибн Сабит (р.а.)', 'Абдуллах ибн Умар (р.а.)', 'Анас ибн Малик (р.а.)'],
      exp: 'Зайд ибн Сабит (р.а.) возглавлял комиссию по собиранию Корана как при Абу Бакре (р.а.), так и при Усмане (р.а.).',
    },
    src: { uz: 'Sahihul Buxoriy, 4986-hadis', en: 'Sahih al-Bukhari, Hadith 4986', ru: 'Сахих аль-Бухари, хадис 4986' },
  },
  {
    id: 'qr_20',
    deck: 'quran',
    correctIndex: 2,
    uz: {
      q: "Har kecha o‘qilsa, insonni qabr azobidan saqlovchi («Al-Moni'a» — to‘suvchi) 30 oyatli sura qaysi?",
      opts: ['Ad-Duxon surasi', 'Al-Voqia surasi', 'Al-Mulk (Taborak) surasi', 'Ar-Rahmon surasi'],
      exp: 'Payg‘ambarimiz ﷺ: «Qur’onda 30 oyatli bir sura borki, sohibini mag‘firat qilinmaguncha shafoat qiladi — u Taborakallaziy biyadihil-mulk surasidir» deganlar.',
    },
    en: {
      q: 'Which 30-ayah Surah intercedes for its reciter and protects from the punishment of the grave when recited every night?',
      opts: ['Surah Ad-Dukhan', 'Surah Al-Waqi‘ah', 'Surah Al-Mulk (Tabarak)', 'Surah Ar-Rahman'],
      exp: 'The Prophet ﷺ taught that Surah Al-Mulk (30 ayahs) intercedes for its companion and shields them from the torment of the grave.',
    },
    ru: {
      q: 'Какая сура из 30 аятов при чтении каждую ночь защищает человека от мучений могилы?',
      opts: ['Сура Ад-Духан', 'Сура Аль-Вакиа', 'Сура Аль-Мульк (Табарак)', 'Сура Ар-Рахман'],
      exp: 'Пророк ﷺ сказал, что сура Аль-Мульк из 30 аятов заступается за читающего её и оберегает от наказания в могиле.',
    },
    src: { uz: 'Sunani Termiziy, 2891-hadis • Abu Dovud, 1400', en: 'Jami at-Tirmidhi 2891 • Abu Dawud 1400', ru: 'Сунан ат-Тирмизи 2891 • Абу Дауд 1400' },
  },
  // ==================== +8 NEW PROPHETS QUESTIONS (pp_13..pp_20) ====================
  {
    id: 'pp_13',
    deck: 'prophets',
    correctIndex: 1,
    uz: {
      q: "Qur'oni Karimda «Ulul-azm» (eng buyuk matonat va sabr sohiblari) deb e’tirof etilgan 5 ta payg‘ambar kimlar?",
      opts: [
        'Odam, Nuh, Ibrohim, Yusuf va Muhammad (alayhimussalom)',
        'Nuh, Ibrohim, Muso, Iso va Muhammad (alayhimussalom)',
        'Ibrohim, Ismoil, Ishoq, Ya’qub va Yusuf (alayhimussalom)',
        'Dovud, Sulaymon, Muso, Horun va Muhammad (alayhimussalom)',
      ],
      exp: 'Ahzob surasi 7-oyat va Shuro surasi 13-oyatda zikr qilingan 5 buyuk payg‘ambar: Nuh, Ibrohim, Muso, Iso va Muhammad ﷺdir.',
    },
    en: {
      q: 'Who are the five “Ulul-‘Azm” (Messengers of Firm Resolve) mentioned in the Quran?',
      opts: [
        'Adam, Nuh, Ibrahim, Yusuf & Muhammad (peace be upon them)',
        'Nuh, Ibrahim, Musa, Isa & Muhammad (peace be upon them)',
        'Ibrahim, Ismail, Ishaq, Ya‘qub & Yusuf (peace be upon them)',
        'Dawud, Sulayman, Musa, Harun & Muhammad (peace be upon them)',
      ],
      exp: 'Named in Surah Al-Ahzab 33:7 and Ash-Shura 42:13, the 5 Ulul-‘Azm messengers are Nuh, Ibrahim, Musa, Isa, and Muhammad ﷺ.',
    },
    ru: {
      q: 'Кто входит в число пяти пророков «Улюль-азм» (обладателей великой стойкости)?',
      opts: [
        'Адам, Нух, Ибрахим, Юсуф и Мухаммад (мир им)',
        'Нух, Ибрахим, Муса, Иса и Мухаммад (мир им)',
        'Ибрахим, Исмаиль, Исхак, Якуб и Юсуф (мир им)',
        'Дауд, Сулейман, Муса, Харун и Мухаммад (мир им)',
      ],
      exp: 'В сурах Аль-Ахзаб (7-й аят) и Аш-Шура (13-й аят) выделены пять посланников Улюль-азм: Нух, Ибрахим, Муса, Иса и Мухаммад ﷺ.',
    },
    src: { uz: "Qur'on, Al-Ahzob 7-oyat va Ash-Shuro 13-oyat", en: "Qur'an, Surah Al-Ahzab 33:7 & Ash-Shura 42:13", ru: 'Коран, суры Аль-Ахзаб 33:7 и Аш-Шура 42:13' },
  },
  {
    id: 'pp_14',
    deck: 'prophets',
    correctIndex: 2,
    uz: {
      q: 'Qaysi payg‘ambarning qissasi Qur’oni Karimda «Ahsanul-qasas» (Qissalarning eng go‘zali) deb atalgan?',
      opts: ['Muso (a.s.) qissasi', 'Sulaymon (a.s.) qissasi', 'Yusuf (a.s.) qissasi', 'Ibrohim (a.s.) qissasi'],
      exp: 'Yusuf surasining 3-oyatida Alloh taolo Yusuf alayhissalom qissasini «Ahsanul-qasas» — eng go‘zal qissa deb atagan.',
    },
    en: {
      q: 'Which Prophet’s story is called “Ahsan al-Qasas” (the Best of Stories) in the Quran?',
      opts: ['Prophet Musa (AS)', 'Prophet Sulayman (AS)', 'Prophet Yusuf (AS)', 'Prophet Ibrahim (AS)'],
      exp: 'In Surah Yusuf (12:3), Allah describes the story of Prophet Yusuf (AS) as “Ahsan al-Qasas” (the fairest and most complete of narratives).',
    },
    ru: {
      q: 'История какого пророка названа в Коране «Ахсануль-касас» (Прекраснейшим из повествований)?',
      opts: ['Пророка Мусы (а.с.)', 'Пророка Сулеймана (а.с.)', 'Пророка Юсуфа (а.с.)', 'Пророка Ибрахима (а.с.)'],
      exp: 'В 3-м аяте суры Юсуф история пророка Юсуфа (а.с.) названа «Ахсануль-касас» — самым прекрасным повествованием.',
    },
    src: { uz: "Qur'on, Yusuf surasi, 3-oyat", en: "Qur'an, Surah Yusuf 12:3", ru: 'Коран, сура Юсуф, аят 3' },
  },
  {
    id: 'pp_15',
    deck: 'prophets',
    correctIndex: 1,
    uz: {
      q: 'Alloh taolo «Zabur» kitobini qaysi payg‘ambarga nozil qilgan?',
      opts: ['Muso (a.s.)', 'Dovud (a.s.)', 'Iso (a.s.)', 'Sulaymon (a.s.)'],
      exp: 'To‘rt ilohiy kitobdan Tavrot — Muso (a.s.)ga, Zabur — Dovud (a.s.)ga, Injil — Iso (a.s.)ga, Qur’on — Muhammad ﷺga nozil qilingan.',
    },
    en: {
      q: 'To which Prophet was the divine scripture “Zabur” (Psalms) revealed?',
      opts: ['Prophet Musa (AS)', 'Prophet Dawud (AS)', 'Prophet Isa (AS)', 'Prophet Sulayman (AS)'],
      exp: 'Allah revealed the Zabur to Prophet Dawud (AS), the Tawrat to Musa (AS), the Injil to Isa (AS), and the Quran to Muhammad ﷺ.',
    },
    ru: {
      q: 'Какому пророку было ниспослано Священное Писание Забур (Псалтырь)?',
      opts: ['Пророку Мусе (а.с.)', 'Пророку Дауду (а.с.)', 'Пророку Исе (а.с.)', 'Пророку Сулейману (а.с.)'],
      exp: 'Забур был ниспослан пророку Дауду (а.с.), Таурат — Мусе (а.с.), Инджиль — Исе (а.с.), а Коран — Пророку Мухаммаду ﷺ.',
    },
    src: { uz: "Qur'on, An-Niso surasi, 163-oyat", en: "Qur'an, Surah An-Nisa 4:163", ru: 'Коран, сура Ан-Ниса, аят 163' },
  },
  {
    id: 'pp_16',
    deck: 'prophets',
    correctIndex: 0,
    uz: {
      q: 'Alloh taolo tomonidan qushlar tili, shamol va jinlar bo‘ysundirib berilgan payg‘ambar kim?',
      opts: ['Sulaymon (a.s.)', 'Idris (a.s.)', 'Hud (a.s.)', 'Solih (a.s.)'],
      exp: 'Dovud alayhissalomning o‘g‘illari Sulaymon alayhissalomga qushlar va chumolilar nutqini anglash hamda ulkan saltanat berilgan.',
    },
    en: {
      q: 'Which Prophet was blessed with understanding the speech of birds and ants, and command over the wind and jinn?',
      opts: ['Prophet Sulayman (AS)', 'Prophet Idris (AS)', 'Prophet Hud (AS)', 'Prophet Salih (AS)'],
      exp: 'Prophet Sulayman (AS), son of Dawud (AS), was taught the language of birds and granted an extraordinary kingdom.',
    },
    ru: {
      q: 'Какому пророку Аллах даровал понимание языка птиц и муравьёв, а также власть над ветром и джиннами?',
      opts: ['Пророку Сулейману (а.с.)', 'Пророку Идрису (а.с.)', 'Пророку Худу (а.с.)', 'Пророку Салиху (а.с.)'],
      exp: 'Пророк Сулейман (а.с.), сын Дауда (а.с.), был наделён знанием речи птиц и великим царством.',
    },
    src: { uz: "Qur'on, An-Naml surasi, 16–19-oyatlar", en: "Qur'an, Surah An-Naml 27:16–19", ru: 'Коран, сура Ан-Намль, аяты 16–19' },
  },
  {
    id: 'pp_17',
    deck: 'prophets',
    correctIndex: 1,
    uz: {
      q: 'Payg‘ambarimiz ﷺ Madinaga hijrat qilib borganlarida musofir va ansorlar birgalikda qurgan birinchi masjid qaysi?',
      opts: ['Masjidul Harom', 'Qubo masjidi', 'Qiblatayn masjidi', 'Masjidul Aqso'],
      exp: 'Islom tarixida taqvo asosida bunyod etilgan birinchi masjid — Madina yaqinidagi Qubo masjididir; unda o‘qilgan 2 rakat namoz umra savobiga teng.',
    },
    en: {
      q: 'What was the very first mosque built in Islam upon the Prophet’s ﷺ arrival during the Hijrah to Madinah?',
      opts: ['Masjid al-Haram', 'Masjid Quba', 'Masjid al-Qiblatayn', 'Masjid al-Aqsa'],
      exp: 'Masjid Quba, founded on piety upon the Prophet’s arrival on the outskirts of Madinah, is the first mosque built in Islamic history.',
    },
    ru: {
      q: 'Какая мечеть стала первой мечетью в истории Ислама, построенной во время хиджры Пророка ﷺ в Медину?',
      opts: ['Масджид аль-Харам', 'Мечеть Куба', 'Масджид аль-Киблятайн', 'Масджид аль-Акса'],
      exp: 'Мечеть Куба вблизи Медины — первая мечеть в истории Ислама, основанная на богобоязненности (сура Ат-Тауба, аят 108).',
    },
    src: { uz: "Qur'on, At-Tavba 108-oyat • Sahihul Buxoriy, 1193", en: "Qur'an, At-Tawbah 9:108 • Sahih al-Bukhari 1193", ru: 'Коран, Ат-Тауба 9:108 • Сахих аль-Бухари 1193' },
  },
  {
    id: 'pp_18',
    deck: 'prophets',
    correctIndex: 0,
    uz: {
      q: 'Musulmonlarning ilk yirik g‘alabasi bo‘lgan Badr jangi hijriy nechanchi yilda va qaysi oyda bo‘lib o‘tgan?',
      opts: ['Hijriy 2-yil, Ramazon oyida', 'Hijriy 3-yil, Shavvol oyida', 'Hijriy 5-yil, Zulqa’da oyida', 'Hijriy 8-yil, Muharram oyida'],
      exp: 'Badr g‘azoti hijriy 2-yil Ramazon oyining 17-kunida (milodiy 624-yil) bo‘lib, Qur’onda «Yawmul-Furqon» (Haq bilan botil ajralgan kun) deb atalgan.',
    },
    en: {
      q: 'In which Hijri year and month did the Battle of Badr take place?',
      opts: ['2 AH, in the month of Ramadan', '3 AH, in Shawwal', '5 AH, in Dhu al-Qi‘dah', '8 AH, in Muharram'],
      exp: 'The Battle of Badr took place on 17 Ramadan, 2 AH (624 CE), and is called Yawm al-Furqan (the Day of Criterion) in the Quran.',
    },
    ru: {
      q: 'В каком году по хиджре и в каком месяце произошло сражение при Бадре?',
      opts: ['Во 2-м году хиджры, в месяце Рамадан', 'В 3-м году хиджры, в Шаввале', 'В 5-м году хиджры, в Зуль-Каада', 'В 8-м году хиджры, в Мухарраме'],
      exp: 'Битва при Бадре произошла 17 Рамадана 2 года по хиджре (624 г.) и названа в Коране «Яумуль-Фуркан» (День Различения).',
    },
    src: { uz: "Qur'on, Al-Anfol surasi, 41-oyat • Sahihul Buxoriy", en: "Qur'an, Surah Al-Anfal 8:41 • Sahih al-Bukhari", ru: 'Коран, сура Аль-Анфаль 8:41 • Сахих аль-Бухари' },
  },
  {
    id: 'pp_19',
    deck: 'prophets',
    correctIndex: 2,
    uz: {
      q: 'Makka fathi (Fathu Makka) hijriy nechanchi yilda sodir bo‘lgan?',
      opts: ['Hijriy 4-yilda', 'Hijriy 6-yilda', 'Hijriy 8-yil, Ramazon oyida', 'Hijriy 10-yilda'],
      exp: 'Makka hijriy 8-yil Ramazon oyida qon to‘kilmasdan fath etildi va Rasululloh ﷺ makkaliklarni umumiy afv etdilar.',
    },
    en: {
      q: 'In which Hijri year did the Conquest of Makkah (Fath Makkah) take place?',
      opts: ['4 AH', '6 AH', '8 AH, in the month of Ramadan', '10 AH'],
      exp: 'Makkah was peacefully opened in Ramadan 8 AH (630 CE), where the Prophet ﷺ granted general amnesty and purified the Ka‘bah of idols.',
    },
    ru: {
      q: 'В каком году по хиджре произошло открытие Мекки (Фатх Мекка)?',
      opts: ['В 4-м году хиджры', 'В 6-м году хиджры', 'В 8-м году хиджры, в месяце Рамадан', 'В 10-м году хиджры'],
      exp: 'Открытие Мекки произошло в месяце Рамадан 8 года по хиджре (630 г.), когда Пророк ﷺ даровал жителям Мекки всеобщее прощение.',
    },
    src: { uz: 'Sahihul Buxoriy, 4276-hadis', en: 'Sahih al-Bukhari, Hadith 4276', ru: 'Сахих аль-Бухари, хадис 4276' },
  },
  {
    id: 'pp_20',
    deck: 'prophets',
    correctIndex: 1,
    uz: {
      q: 'Payg‘ambarimiz Muhammad ﷺ qaysi yoshlarida va qaysi shaharda vafot etganlar?',
      opts: ['60 yoshda, Makkada', '63 yoshda, Madinai Munavvarada', '65 yoshda, Toifda', '61 yoshda, Makkada'],
      exp: 'Rasululloh ﷺ hijriy 11-yil Rabiul-avval oyida 63 yoshlarida Madinai Munavvarada Oisha onamizning hujralarida vafot etganlar.',
    },
    en: {
      q: 'At what age and in which city did Prophet Muhammad ﷺ pass away?',
      opts: ['Age 60, in Makkah', 'Age 63, in Madinah al-Munawwarah', 'Age 65, in Ta’if', 'Age 61, in Makkah'],
      exp: 'The Prophet ﷺ passed away in Rabi‘ al-Awwal 11 AH at the age of 63 in Madinah, and was buried in the chamber of Aisha (r.a.).',
    },
    ru: {
      q: 'В каком возрасте и в каком городе покинул этот мир Пророк Мухаммад ﷺ?',
      opts: ['В 60 лет, в Мекке', 'В 63 года, в лучезарной Медине', 'В 65 лет, в Таифе', 'В 61 год, в Мекке'],
      exp: 'Посланник Аллаха ﷺ скончался в месяце Раби уль-авваль 11 года хиджры в возрасте 63 лет в Медине.',
    },
    src: { uz: 'Sahihul Buxoriy, 4466-hadis', en: 'Sahih al-Bukhari, Hadith 4466', ru: 'Сахих аль-Бухари, хадис 4466' },
  },
  // ==================== +8 NEW WORSHIP QUESTIONS (wr_13..wr_20) ====================
  {
    id: 'wr_13',
    deck: 'worship',
    correctIndex: 1,
    uz: {
      q: 'Hanafiy mazhabida oltin uchun zakot nisobi necha misqol (gramm)?',
      opts: ['10 misqol (~42.5 g)', '20 misqol (~85 g)', '50 misqol (~212 g)', '100 misqol (~425 g)'],
      exp: 'Oltinning nisobi 20 misqol (taxminan 85 gramm), kumushning nisobi esa 200 dirham (taxminan 595 gramm) bo‘lib, undan 2.5% (1/40) zakot beriladi.',
    },
    en: {
      q: 'What is the Nisab (minimum threshold) of gold for Zakat in the Hanafi school?',
      opts: ['10 mithqals (~42.5 g)', '20 mithqals (~85 g)', '50 mithqals (~212 g)', '100 mithqals (~425 g)'],
      exp: 'The Nisab for gold is 20 mithqals (approx. 85 grams) and for silver is 200 dirhams (approx. 595 grams), upon which 2.5% Zakat is due after one lunar year.',
    },
    ru: {
      q: 'Каков нисаб (минимальный порог) золота для выплаты закята в ханафитском мазхабе?',
      opts: ['10 мискалей (~42,5 г)', '20 мискалей (~85 г)', '50 мискалей (~212 г)', '100 мискалей (~425 г)'],
      exp: 'Нисаб золота составляет 20 мискалей (около 85 граммов), а серебра — 200 дирхамов (около 595 граммов).',
    },
    src: { uz: 'Sunani Abu Dovud, 1573 • Al-Hidoya', en: 'Sunan Abi Dawud 1573 • Al-Hidayah', ru: 'Сунан Абу Дауд 1573 • Аль-Хидая' },
  },
  {
    id: 'wr_14',
    deck: 'worship',
    correctIndex: 2,
    uz: {
      q: "Qur'oni Karimning At-Tavba surasi 60-oyatida zakot beriladigan haqdorlar necha toifaga ajratilgan?",
      opts: ['4 toifaga', '6 toifaga', '8 toifaga', '10 toifaga'],
      exp: 'At-Tavba surasi 60-oyatda zakot beriladigan 8 toifa aniq bayon qilingan: faqirlar, miskinlar, zakot xodimlari, qalblari ulfat qilinuvchilar, qullar, qarzdorlar, Alloh yo‘lidagilar va musofirlar.',
    },
    en: {
      q: 'How many eligible categories of Zakat recipients are specified in Surah At-Tawbah (9:60)?',
      opts: ['4 categories', '6 categories', '8 categories', '10 categories'],
      exp: 'Surah At-Tawbah 9:60 specifies 8 categories of Zakat recipients (the poor, the needy, collectors, those whose hearts are reconciled, freeing captives, debtors, in Allah’s cause, and stranded travelers).',
    },
    ru: {
      q: 'Сколько категорий получателей закята установлено в 60-м аяте суры Ат-Тауба?',
      opts: ['4 категории', '6 категорий', '8 категорий', '10 категорий'],
      exp: 'В 60-м аяте суры Ат-Тауба перечислены 8 категорий людей, имеющих право на получение закята.',
    },
    src: { uz: "Qur'on, At-Tavba surasi, 60-oyat", en: "Qur'an, Surah At-Tawbah 9:60", ru: 'Коран, сура Ат-Тауба, аят 60' },
  },
  {
    id: 'wr_15',
    deck: 'worship',
    correctIndex: 1,
    uz: {
      q: 'Ro‘zador kishi ro‘za ekanini unutib (esidan chiqarib) taom yesa yoki suv ichsa, ro‘zasi nima bo‘ladi?',
      opts: ['Ro‘zasi buziladi va kafforat vojib bo‘ladi', 'Ro‘zasi buzilmaydi, eslashi bilan to‘xtatib ro‘zasini davom ettiradi', 'Ro‘zasi buziladi va faqat qazo tutadi', 'Fidya berishi kerak bo‘ladi'],
      exp: 'Payg‘ambarimiz ﷺ: «Kim ro‘zadorligini unutib yesa yoki ichsa, ro‘zasini oxirigacha yetkazsin, chunki uni Alloh yedirib-ichiribdi» deganlar.',
    },
    en: {
      q: 'What is the ruling if a fasting person forgetfully eats or drinks?',
      opts: ['The fast breaks and requires Kaffarah', 'The fast remains valid; they stop upon remembering and complete the fast', 'The fast breaks and requires Qada only', 'Fidyah must be paid'],
      exp: 'The Prophet ﷺ said: “Whoever forgets while fasting and eats or drinks should complete his fast, for it is Allah Who fed him and gave him drink.”',
    },
    ru: {
      q: 'Что происходит с постом, если постящийся по забывчивости поест или попьёт?',
      opts: ['Пост нарушается и требуется каффара', 'Пост не нарушается; вспомнив, нужно прекратить есть и продолжить пост', 'Пост нарушается, требуется только каза', 'Нужно выплатить фидью'],
      exp: 'Пророк ﷺ сказал: «Кто по забывчивости поел или попил, будучи постящимся, пусть доведёт пост до конца — его накормил и напоил Аллах».',
    },
    src: { uz: 'Sahihul Buxoriy, 1933-hadis • Sahihi Muslim, 1155', en: 'Sahih al-Bukhari 1933 • Sahih Muslim 1155', ru: 'Сахих аль-Бухари 1933 • Сахих Муслим 1155' },
  },
  {
    id: 'wr_16',
    deck: 'worship',
    correctIndex: 2,
    uz: {
      q: 'Har qamariy oyning 13, 14 va 15-kunlari tutiladigan sunnat ro‘za qanday nomlanadi?',
      opts: ['Ashuro ro‘zasi', 'Arafot ro‘zasi', 'Ayyomul-biyz (Oq kunlar) ro‘zasi', 'Savm-i visol'],
      exp: 'Oy to‘lishib kechalari yorug‘ bo‘lgani uchun har hijriy oyning 13, 14, 15-kunlari «Ayyomul-biyz» (Oq kunlar) deyiladi va bu kunlarda ro‘za tutish sunnatdir.',
    },
    en: {
      q: 'What are the Sunnah fasts observed on the 13th, 14th, and 15th of every Hijri lunar month called?',
      opts: ['Fast of Ashura', 'Fast of Arafah', 'Ayyam al-Bid (The White Days)', 'Sawm al-Wisal'],
      exp: 'The 13th, 14th, and 15th of each lunar month are called Ayyam al-Bid (the Bright/White Days), and fasting them holds the reward of fasting all year.',
    },
    ru: {
      q: 'Как называется суннат-пост в 13-й, 14-й и 15-й дни каждого лунного месяца?',
      opts: ['Пост Ашура', 'Пост Арафа', 'Айямуль-бид (Белые дни)', 'Саум аль-висаль'],
      exp: '13, 14 и 15-е числа каждого месяца хиджры называются «Айямуль-бид» (белые/лунные дни), пост в которые является сунной.',
    },
    src: { uz: 'Sahihul Buxoriy, 1981 • Sunani Nasoiy, 2422', en: 'Sahih al-Bukhari 1981 • Sunan an-Nasa’i 2422', ru: 'Сахих аль-Бухари 1981 • Сунан ан-Насаи 2422' },
  },
  {
    id: 'wr_17',
    deck: 'worship',
    correctIndex: 1,
    uz: {
      q: 'Ramazonning oxirgi 10 kunligida masjidni lozim tutib, ibodat bilan mashg‘ul bo‘lish nima deb ataladi?',
      opts: ['Tavoif', 'E’tikof', 'Tahajjud', 'Tasbih'],
      exp: 'Ramazon oyining oxirgi o‘n kunligida masjidda e’tikof o‘tirish sunnati muakkadai kifoya hisoblanadi.',
    },
    en: {
      q: 'What is the spiritual retreat in the mosque during the last ten days of Ramadan called?',
      opts: ['Tawaf', 'I‘tikaf', 'Tahajjud', 'Tasbih'],
      exp: 'I‘tikaf is the Sunnah spiritual seclusion in a mosque during the last ten days of Ramadan in devotion and search of Laylat al-Qadr.',
    },
    ru: {
      q: 'Как называется пребывание в мечети с намерением поклонения в последние 10 дней Рамадана?',
      opts: ['Таваф', 'Итикаф', 'Тахаджуд', 'Тасбих'],
      exp: 'Итикаф — сунна уединения в мечети для поклонения Аллаху в последние десять суток месяца Рамадан.',
    },
    src: { uz: 'Sahihul Buxoriy, 2025-hadis', en: 'Sahih al-Bukhari, Hadith 2025', ru: 'Сахих аль-Бухари, хадис 2025' },
  },
  {
    id: 'wr_18',
    deck: 'worship',
    correctIndex: 1,
    uz: {
      q: 'Payg‘ambarimiz ﷺ: «Tillarga yengil, tarozida og‘ir va Rahmonga suyukli ikki kalima» deb qaysi zikrni aytganlar?',
      opts: [
        'Alhamdulillahi Robbil-alamin',
        'Subhanallohi va bihamdihi, Subhanallohil-Aziym',
        'Astaghfirulloha va atubu ilayh',
        'Allohu akbar kabiro',
      ],
      exp: 'Sahihul Buxoriyning eng so‘nggi hadisi aynan shu muborak ikki kalima fazilati bilan yakunlangan.',
    },
    en: {
      q: 'Which dhikr did the Prophet ﷺ describe as “two phrases light on the tongue, heavy on the Scale, and beloved to the Most Merciful”?',
      opts: [
        'Alhamdulillahi Rabbil-‘Alamin',
        'SubhanAllahi wa bihamdihi, SubhanAllahil-‘Azim',
        'Astaghfirullaha wa atubu ilayh',
        'Allahu Akbar Kabira',
      ],
      exp: 'Imam al-Bukhari concluded his entire Sahih with this hadith praising “SubhanAllahi wa bihamdihi, SubhanAllahil-‘Azim”.',
    },
    ru: {
      q: 'Какой зикр Пророк ﷺ назвал «двумя словами, лёгкими для языка, тяжёлыми на Весах и любимыми для Милостивого»?',
      opts: [
        'Альхамдулилляхи Раббиль-алямин',
        'Субханаллахи ва бихамдихи, Субханаллахиль-Азым',
        'Астагфируллаха ва атубу иляйх',
        'Аллаху акбар кабиран',
      ],
      exp: 'Имам аль-Бухари завершил свой сборник «Сахих» этим хадисом о словах «Субханаллахи ва бихамдихи, Субханаллахиль-Азым».',
    },
    src: { uz: 'Sahihul Buxoriy, 7563-hadis • Sahihi Muslim, 2694', en: 'Sahih al-Bukhari 7563 • Sahih Muslim 2694', ru: 'Сахих аль-Бухари 7563 • Сахих Муслим 2694' },
  },
  {
    id: 'wr_19',
    deck: 'worship',
    correctIndex: 2,
    uz: {
      q: 'Payg‘ambarimiz ﷺ «Jannat xazinalaridan bir xazina» deb ta’riflagan zikr qaysi?',
      opts: ['Subhanalloh', 'Alhamdulillah', 'La havla va la quvvata illa billah', 'Allohu akbar'],
      exp: 'Abu Muso al-Ash’ariy (r.a.)ga Rasululloh ﷺ: «La havla va la quvvata illa billah» kalimasi jannat xazinalaridan bir xazina ekanini o‘rgatganlar.',
    },
    en: {
      q: 'Which dhikr phrase did the Prophet ﷺ call “a treasure from the treasures of Paradise”?',
      opts: ['SubhanAllah', 'Alhamdulillah', 'La hawla wa la quwwata illa billah', 'Allahu Akbar'],
      exp: 'The Prophet ﷺ taught Abu Musa al-Ash‘ari (r.a.) that “La hawla wa la quwwata illa billah” is a treasure from the treasures of Jannah.',
    },
    ru: {
      q: 'Какую фразу зикра Пророк ﷺ назвал «сокровищем из сокровищниц Рая»?',
      opts: ['Субханаллах', 'Альхамдулиллях', 'Ля хауля ва ля куввата илля биллях', 'Аллаху акбар'],
      exp: 'Пророк ﷺ сказал Абу Мусе аль-Ашари (р.а.), что слова «Ля хауля ва ля куввата илля биллях» являются сокровищем из сокровищниц Рая.',
    },
    src: { uz: 'Sahihul Buxoriy, 4205-hadis • Sahihi Muslim, 2704', en: 'Sahih al-Bukhari 4205 • Sahih Muslim 2704', ru: 'Сахих аль-Бухари 4205 • Сахих Муслим 2704' },
  },
  {
    id: 'wr_20',
    deck: 'worship',
    correctIndex: 2,
    uz: {
      q: 'Qurbon hayitida bitta tuya yoki qoramol (sigir) necha kishi nomidan qurbonlik qilinishi mumkin?',
      opts: ['Faqat 1 kishi nomidan', '3 kishigacha', '1 kishidan 7 kishigacha', '10 kishigacha'],
      exp: 'Qo‘y yoki echki faqat 1 kishi nomidan, tuya va qoramol esa 1 kishidan 7 kishigacha (barchasi qurbonlik va ibodat niyatida bo‘lsa) so‘yilishi joiz.',
    },
    en: {
      q: 'Up to how many people can share in the Qurbani (Udhiyah) sacrifice of one camel or cow?',
      opts: ['Only 1 person', 'Up to 3 people', 'From 1 up to 7 people', 'Up to 10 people'],
      exp: 'While a sheep or goat suffices for 1 person, a cow or camel can be shared by up to 7 people if all intend worship.',
    },
    ru: {
      q: 'От имени скольких человек максимум можно принести в жертву (курбан) одного верблюда или корову?',
      opts: ['Только от 1 человека', 'До 3 человек', 'От 1 до 7 человек', 'До 10 человек'],
      exp: 'Овца или коза приносится в жертву от одного человека, а крупный рогатый скот или верблюд — от одного до семи человек.',
    },
    src: { uz: 'Sahihi Muslim, 1318-hadis • Al-Hidoya', en: 'Sahih Muslim 1318 • Al-Hidayah', ru: 'Сахих Муслим 1318 • Аль-Хидая' },
  },
  // ==================== 5. SAHOBALAR VA ALLOMALAR (sc_01..sc_20) ====================
  {
    id: 'sc_01',
    deck: 'scholars',
    correctIndex: 2,
    uz: {
      q: 'Tirikligidayoq bitta hadisning o‘zida jannat bashorati berilgan sahobalar («Asharai Mubashshara») necha nafar?',
      opts: ['4 nafar', '7 nafar', '10 nafar', '12 nafar'],
      exp: 'Abu Bakr, Umar, Usmon, Ali, Talha, Zubayr, Abdurahmon ibn Avf, Sa’d ibn Abu Vaqqos, Said ibn Zayd va Abu Ubayda ibn Jarroh (r.a.) — 10 nafar sahobadir.',
    },
    en: {
      q: 'How many Companions are included in the “Asharah Mubashsharah” (promised Paradise in a single narration during their lifetime)?',
      opts: ['4 Companions', '7 Companions', '10 Companions', '12 Companions'],
      exp: 'The 10 promised Jannah in one hadith are Abu Bakr, Umar, Uthman, Ali, Talhah, Zubayr, ‘Abdur-Rahman ibn ‘Awf, Sa‘d, Sa‘id, and Abu ‘Ubaydah (r.a.).',
    },
    ru: {
      q: 'Сколько сподвижников входят в число «Ашара Мубашшара» — обрадованных вестью о Рае при жизни в одном хадисе?',
      opts: ['4 сподвижника', '7 сподвижников', '10 сподвижников', '12 сподвижников'],
      exp: 'В одном хадисе Раем были обрадованы 10 великих сподвижников («Ашара Мубашшара»), включая четырёх праведных халифов.',
    },
    src: { uz: 'Sunani Termiziy, 3747-hadis • Abu Dovud, 4649', en: 'Jami at-Tirmidhi 3747 • Abu Dawud 4649', ru: 'Сунан ат-Тирмизи 3747 • Абу Дауд 4649' },
  },
  {
    id: 'sc_02',
    deck: 'scholars',
    correctIndex: 1,
    uz: {
      q: 'To‘rt xalifai roshidin (Xulafoyir-roshidiyn)ning tarixiy ketma-ketligi qaysi javobda to‘g‘ri ko‘rsatilgan?',
      opts: [
        'Abu Bakr, Usmon, Umar, Ali (r.a.)',
        'Abu Bakr, Umar, Usmon, Ali (r.a.)',
        'Umar, Abu Bakr, Ali, Usmon (r.a.)',
        'Abu Bakr, Ali, Umar, Usmon (r.a.)',
      ],
      exp: 'Rasululloh ﷺdan so‘ng Abu Bakr as-Siddiq (11–13 h.), Umar ibn Xattob (13–23 h.), Usmon ibn Affon (23–35 h.) va Ali ibn Abu Tolib (35–40 h.) xalifa bo‘lganlar.',
    },
    en: {
      q: 'What is the correct chronological order of the four Rightly Guided Caliphs (Khulafa ar-Rashidun)?',
      opts: [
        'Abu Bakr, Uthman, Umar, Ali (r.a.)',
        'Abu Bakr, Umar, Uthman, Ali (r.a.)',
        'Umar, Abu Bakr, Ali, Uthman (r.a.)',
        'Abu Bakr, Ali, Umar, Uthman (r.a.)',
      ],
      exp: 'The four Rightly Guided Caliphs ruled in order: Abu Bakr as-Siddiq, Umar ibn al-Khattab, Uthman ibn ‘Affan, and Ali ibn Abi Talib (r.a.).',
    },
    ru: {
      q: 'В каком варианте указан правильный хронологический порядок четырёх праведных халифов?',
      opts: [
        'Абу Бакр, Усман, Умар, Али (р.а.)',
        'Абу Бакр, Умар, Усман, Али (р.а.)',
        'Умар, Абу Бакр, Али, Усман (р.а.)',
        'Абу Бакр, Али, Умар, Усман (р.а.)',
      ],
      exp: 'Праведный халифат возглавляли поочерёдно: Абу Бакр ас-Сиддик, Умар ибн аль-Хаттаб, Усман ибн Аффан и Али ибн Абу Талиб (р.а.).',
    },
    src: { uz: 'Sunani Abu Dovud, 4646-hadis', en: 'Sunan Abi Dawud, Hadith 4646', ru: 'Сунан Абу Дауд, хадис 4646' },
  },
  {
    id: 'sc_03',
    deck: 'scholars',
    correctIndex: 0,
    uz: {
      q: 'Islomdagi birinchi muazzin bo‘lgan ulug‘ sahoba kim?',
      opts: ['Bilol ibn Raboh al-Habashiy (r.a.)', 'Abdulloh ibn Ummu Maktum (r.a.)', 'Ammor ibn Yosir (r.a.)', 'Salmon al-Forisiy (r.a.)'],
      exp: 'Bilol ibn Raboh (r.a.) Islomda birinchi bo‘lib azon aytgan sahoba va Rasululloh ﷺning muazzinlari edilar.',
    },
    en: {
      q: 'Which noble Companion was the very first Mu’adhdhin (caller to prayer) in Islam?',
      opts: ['Bilal ibn Rabah (r.a.)', 'Abdullah ibn Umm Maktum (r.a.)', '‘Ammar ibn Yasir (r.a.)', 'Salman al-Farisi (r.a.)'],
      exp: 'Bilal ibn Rabah (r.a.) was appointed by the Prophet ﷺ as the first Mu’adhdhin of Islam in Madinah.',
    },
    ru: {
      q: 'Кто из великих сподвижников стал первым муэдзином в Исламе?',
      opts: ['Билял ибн Рабах (р.а.)', 'Абдуллах ибн Умм Мактум (р.а.)', 'Аммар ибн Ясир (р.а.)', 'Сальман аль-Фариси (р.а.)'],
      exp: 'Билял ибн Рабах аль-Хабаши (р.а.) был первым муэдзином Посланника Аллаха ﷺ.',
    },
    src: { uz: 'Sahihul Buxoriy, 605-hadis • Abu Dovud, 499', en: 'Sahih al-Bukhari 605 • Abu Dawud 499', ru: 'Сахих аль-Бухари 605 • Абу Дауд 499' },
  },
  {
    id: 'sc_04',
    deck: 'scholars',
    correctIndex: 1,
    uz: {
      q: 'Payg‘ambarimiz ﷺga birinchi bo‘lib iymon keltirgan inson va mo‘minlar onasi kim?',
      opts: ['Hafsa binti Umar (r.a.)', 'Xadicha binti Xuvaylid (r.a.)', 'Ummu Salama (r.a.)', 'Zaynab binti Jahsh (r.a.)'],
      exp: 'Hazrati Xadicha binti Xuvaylid (r.a.) Rasululloh ﷺga ilk vahiy kelgan kunda birinchi bo‘lib iymon keltirgan va eng og‘ir yillarda suyanch bo‘lgan onamizdirlar.',
    },
    en: {
      q: 'Who was the very first person to believe in Prophet Muhammad ﷺ and accept Islam?',
      opts: ['Hafsah bint Umar (r.a.)', 'Khadijah bint Khuwaylid (r.a.)', 'Umm Salamah (r.a.)', 'Zaynab bint Jahsh (r.a.)'],
      exp: 'Mother of the Believers Khadijah bint Khuwaylid (r.a.) was the first human being to embrace Islam and comfort the Prophet ﷺ after the first revelation.',
    },
    ru: {
      q: 'Кто стал самым первым человеком, уверовавшим в пророческую миссию Мухаммада ﷺ?',
      opts: ['Хафса бинт Умар (р.а.)', 'Хадиджа бинт Хувайлид (р.а.)', 'Умм Саляма (р.а.)', 'Зайнаб бинт Джахш (р.а.)'],
      exp: 'Мать правоверных Хадиджа бинт Хувайлид (р.а.) первой уверовала в Пророка ﷺ и поддерживала его с первых дней откровения.',
    },
    src: { uz: 'Sahihul Buxoriy, 3-hadis va 3816-hadis', en: 'Sahih al-Bukhari, Hadiths 3 & 3816', ru: 'Сахих аль-Бухари, хадисы 3 и 3816' },
  },
  {
    id: 'sc_05',
    deck: 'scholars',
    correctIndex: 2,
    uz: {
      q: 'Payg‘ambarimiz ﷺdan eng ko‘p (5374 ta) hadis rivoyat qilgan sahoba kim?',
      opts: ['Abdulloh ibn Abbos (r.a.)', 'Anas ibn Molik (r.a.)', 'Abu Hurayra — Abdurahmon ibn Saxr (r.a.)', 'Jobir ibn Abdulloh (r.a.)'],
      exp: 'Rasululloh ﷺning duolari barakoti bilan xotiralari nihoyatda kuchli bo‘lgan Abu Hurayra (r.a.) 5374 ta hadis rivoyat qilib, birinchi o‘rinda turadilar.',
    },
    en: {
      q: 'Which Companion narrated the largest number of hadiths (5,374) from the Prophet ﷺ?',
      opts: ['Abdullah ibn ‘Abbas (r.a.)', 'Anas ibn Malik (r.a.)', 'Abu Hurayrah — ‘Abdur-Rahman ibn Sakhr (r.a.)', 'Jabir ibn Abdullah (r.a.)'],
      exp: 'Blessed by the Prophet’s ﷺ supplication for an unfailing memory, Abu Hurayrah (r.a.) narrated 5,374 hadiths.',
    },
    ru: {
      q: 'Кто из сподвижников передал наибольшее количество хадисов (5374) от Пророка ﷺ?',
      opts: ['Абдуллах ибн Аббас (р.а.)', 'Анас ибн Малик (р.а.)', 'Абу Хурайра — Абдуррахман ибн Сахр (р.а.)', 'Джабир ибн Абдуллах (р.а.)'],
      exp: 'Благодаря дуа Пророка ﷺ о крепкой памяти Абу Хурайра (р.а.) передал 5374 хадиса.',
    },
    src: { uz: 'Sahihul Buxoriy, 119-hadis', en: 'Sahih al-Bukhari, Hadith 119', ru: 'Сахих аль-Бухари, хадис 119' },
  },
  {
    id: 'sc_06',
    deck: 'scholars',
    correctIndex: 1,
    uz: {
      q: 'Ahzob (Xandaq) g‘azotida Madina atrofida xandaq qazish taklifini bergan mashhur sahoba kim?',
      opts: ['Xolid ibn Valid (r.a.)', 'Salmon al-Forisiy (r.a.)', 'Suhaib ar-Rumiy (r.a.)', 'Abu Zarr al-G‘iforiy (r.a.)'],
      exp: 'Haqiqat izlab uzoq yurtlardan Madinaga kelgan Salmon al-Forisiy (r.a.) hijriy 5-yilda xandaq qazish maslahatini berganlar.',
    },
    en: {
      q: 'Which Companion suggested digging the defensive trench around Madinah in the Battle of the Trench (Khandaq)?',
      opts: ['Khalid ibn al-Walid (r.a.)', 'Salman al-Farisi (r.a.)', 'Suhayb ar-Rumi (r.a.)', 'Abu Dharr al-Ghifari (r.a.)'],
      exp: 'Salman al-Farisi (r.a.) proposed digging the trench around Madinah in 5 AH, a strategy unknown in Arabia at the time.',
    },
    ru: {
      q: 'Какой сподвижник предложил вырыть оборонительный ров вокруг Медины в битве у Рва (Хандак)?',
      opts: ['Халид ибн аль-Валид (р.а.)', 'Сальман аль-Фариси (р.а.)', 'Сухайб ар-Руми (р.а.)', 'Абу Зарр аль-Гифари (р.а.)'],
      exp: 'Сальман аль-Фариси (р.а.) предложил стратегию рытья рва в 5 году по хиджре, защитившую Медину.',
    },
    src: { uz: 'Siyrati Ibn Hishom • Sahihul Buxoriy, 4101', en: 'Sirah Ibn Hisham • Sahih al-Bukhari 4101', ru: 'Сира Ибн Хишама • Сахих аль-Бухари 4101' },
  },
  {
    id: 'sc_07',
    deck: 'scholars',
    correctIndex: 1,
    uz: {
      q: 'Hanafiy mazhabining asoschisi Imomi A’zam Abu Hanifa rahimahullohning asl ismlari nima?',
      opts: ['Muhammad ibn Idris', 'Nu’mon ibn Sobit (hijriy 80–150)', 'Molik ibn Anas', 'Ahmad ibn Hanbal'],
      exp: 'Imomi A’zam Abu Hanifa rahimahullohning asl ismlari Nu’mon ibn Sobit bo‘lib, hijriy 80-yilda (milodiy 699) Kufada tug‘ilganlar.',
    },
    en: {
      q: 'What was the full name of Imam al-A‘zam Abu Hanifah (founder of the Hanafi school)?',
      opts: ['Muhammad ibn Idris', 'Nu‘man ibn Thabit (80–150 AH)', 'Malik ibn Anas', 'Ahmad ibn Hanbal'],
      exp: 'Imam Abu Hanifah’s name was Nu‘man ibn Thabit, born in Kufa in 80 AH (699 CE) and counted among the Tabi‘un.',
    },
    ru: {
      q: 'Как звали основателя ханафитского мазхаба Имама Абу Ханифу (Имама Агзама)?',
      opts: ['Мухаммад ибн Идрис', 'Нуман ибн Сабит (80–150 гг. х.)', 'Малик ибн Анас', 'Ахмад ибн Ханбаль'],
      exp: 'Настоящее имя Имама Абу Ханифы — Нуман ибн Сабит; он родился в Куфе в 80 году по хиджре (699 г.).',
    },
    src: { uz: 'Tarixi Bag‘dod • Al-Xayrotul-hison', en: 'Tarikh Baghdad • Al-Khayrat al-Hisan', ru: 'Тарих Багдад • Аль-Хайрат аль-хисан' },
  },
  {
    id: 'sc_08',
    deck: 'scholars',
    correctIndex: 2,
    uz: {
      q: 'Hanafiy fiqhi kitoblarida «Sohibayn» («Ikki hamroh shogird») deb Imom Abu Hanifaning qaysi ikki buyuk shogirdi ataladi?',
      opts: [
        'Imom Zufar va Hasan ibn Ziyod',
        'Imom Tahoviy va Imom Karxiy',
        'Imom Abu Yusuf va Imom Muhammad ash-Shayboniy',
        'Imom Marg‘inoniy va Imom Saraxsiy',
      ],
      exp: 'Qoziul-quzot Imom Abu Yusuf va mazhab kitoblarini yozib jamlagan Imom Muhammad ibn Hasan ash-Shayboniy «Sohibayn» deb yuritiladi.',
    },
    en: {
      q: 'Who are the two foremost students of Imam Abu Hanifah known in Hanafi fiqh texts as “As-Sahibayn” (The Two Companions)?',
      opts: [
        'Imam Zufar & Hasan ibn Ziyad',
        'Imam at-Tahawi & Imam al-Karkhi',
        'Imam Abu Yusuf & Imam Muhammad ash-Shaybani',
        'Imam al-Marghinani & Imam as-Sarakhsi',
      ],
      exp: 'Qadi Abu Yusuf and Imam Muhammad ibn al-Hasan ash-Shaybani are collectively called “As-Sahibayn” in Hanafi jurisprudence.',
    },
    ru: {
      q: 'Каких двух выдающихся учеников Имама Абу Ханифы в книгах по фикху называют «Ас-Сахибайн» (Два соратника)?',
      opts: [
        'Имама Зуфара и Хасана ибн Зияда',
        'Имама ат-Тахави и Имама аль-Кархи',
        'Имама Абу Юсуфа и Имама Мухаммада аш-Шайбани',
        'Имама аль-Маргинани и Имама ас-Сарахси',
      ],
      exp: 'Имам Абу Юсуф и Имам Мухаммад ибн аль-Хасан аш-Шайбани именуются в ханафитском фикхе «Ас-Сахибайн».',
    },
    src: { uz: 'Hanafiy fiqhi • Al-Hidoya muqaddimasi', en: 'Hanafi Fiqh • Introduction to Al-Hidayah', ru: 'Ханафитский фикх • Введение к «Аль-Хидая»' },
  },
  {
    id: 'sc_09',
    deck: 'scholars',
    correctIndex: 0,
    uz: {
      q: 'Hadis ilmida «Amirul-mo‘miniyn» unvonini olgan Imom Muhammad ibn Ismoil al-Buxoriy qachon va qayerda tavallud topganlar?',
      opts: ['Hijriy 194-yil (milodiy 810), Buxoroda', 'Hijriy 206-yil, Nishopurda', 'Hijriy 209-yil, Termizda', 'Hijriy 150-yil, Bag‘dodda'],
      exp: 'Imom al-Buxoriy hijriy 194-yil Shavvol oyining 13-kunida Buxoroda tug‘ilganlar va Samarqand yaqinidagi Xartang qishlog‘ida (256 h.) dafn etilganlar.',
    },
    en: {
      q: 'When and where was Imam Muhammad ibn Isma‘il al-Bukhari — compiler of Sahih al-Bukhari — born?',
      opts: ['194 AH (810 CE), in Bukhara', '206 AH, in Nishapur', '209 AH, in Termez', '150 AH, in Baghdad'],
      exp: 'Imam al-Bukhari was born on 13 Shawwal 194 AH (810 CE) in Bukhara and passed away in Khartang near Samarkand in 256 AH.',
    },
    ru: {
      q: 'Когда и где родился великий мухаддис Имам Мухаммад ибн Исмаил аль-Бухари?',
      opts: ['В 194 году хиджры (810 г.), в Бухаре', 'В 206 году хиджры, в Нишапуре', 'В 209 году хиджры, в Термезе', 'В 150 году хиджры, в Багдаде'],
      exp: 'Имам аль-Бухари родился 13 Шавваля 194 года хиджры (810 г.) в Бухаре и покоится в Хартанге близ Самарканда.',
    },
    src: { uz: 'Siyaru a’lomin-nubalo, 12-jild (Imom Zahabiy)', en: 'Siyar A‘lam an-Nubala, Vol. 12', ru: 'Сияр алям ан-нубаля, том 12' },
  },
  {
    id: 'sc_10',
    deck: 'scholars',
    correctIndex: 1,
    uz: {
      q: 'Imom al-Buxoriy o‘zlarining «Al-Jome’ as-Sahih» (Sahihul Buxoriy) to‘plamlarini necha yil davomida saralab yozganlar?',
      opts: ['7 yil', '16 yil', '25 yil', '40 yil'],
      exp: 'Imom Buxoriy 600 ming hadis ichidan eng sahihlarini 16 yil davomida har bir hadisni kiritishdan oldin g‘usl qilib va 2 rakat namoz o‘qib jamlaganlar.',
    },
    en: {
      q: 'Over how many years did Imam al-Bukhari compile and verify his “Al-Jami‘ as-Sahih” (Sahih al-Bukhari)?',
      opts: ['7 years', '16 years', '25 years', '40 years'],
      exp: 'Imam al-Bukhari spent 16 years selecting the authentic hadiths of his Sahih from 600,000 narrations, praying two rak‘ahs before recording each one.',
    },
    ru: {
      q: 'На протяжении скольких лет Имам аль-Бухари составлял свой сборник «Аль-Джами ас-Сахих»?',
      opts: ['7 лет', '16 лет', '25 лет', '40 лет'],
      exp: 'Имам аль-Бухари составлял «Сахих» в течение 16 лет, отбирая достоверные хадисы из 600 тысяч преданий.',
    },
    src: { uz: 'Hadyus-soriy (Ibn Hajar al-Asqaloniy)', en: 'Hady as-Sari (Ibn Hajar al-‘Asqalani)', ru: 'Хадью ас-сари (Ибн Хаджар аль-Аскаляни)' },
  },
  {
    id: 'sc_11',
    deck: 'scholars',
    correctIndex: 2,
    uz: {
      q: '«Al-Jome’ as-Sunan» hamda Payg‘ambarimiz ﷺning muborak siyrat va sifatlari haqidagi «Ash-Shamoil al-Muhammadiyya» asarlarining muallifi kim?',
      opts: ['Imom Abu Dovud', 'Imom an-Nasoiy', 'Imom Abu Iso Muhammad at-Termiziy', 'Imom Ibn Moja'],
      exp: 'Buyuk vatandoshimiz Imom Abu Iso at-Termiziy (209–279 h.) «Sunani Termiziy» va «Shamoili Muhammadiyya» asarlarini ta’lif etganlar.',
    },
    en: {
      q: 'Which great scholar of Termez authored both “Jami‘ at-Tirmidhi” and “Ash-Shama’il al-Muhammadiyyah”?',
      opts: ['Imam Abu Dawud', 'Imam an-Nasa’i', 'Imam Abu ‘Isa Muhammad at-Tirmidhi', 'Imam Ibn Majah'],
      exp: 'Imam Abu ‘Isa Muhammad at-Tirmidhi (209–279 AH), student of Imam al-Bukhari, authored both Jami‘ at-Tirmidhi and Ash-Shama’il al-Muhammadiyyah.',
    },
    ru: {
      q: 'Кто является автором сборника «Сунан» и книги о прекрасных качествах Пророка ﷺ «Аш-Шамаиль аль-Мухаммадийя»?',
      opts: ['Имам Абу Дауд', 'Имам ан-Насаи', 'Имам Абу Иса Мухаммад ат-Тирмизи', 'Имам Ибн Маджа'],
      exp: 'Великий учёный из Термеза Имам Абу Иса ат-Тирмизи (209–279 гг. х.) составил «Сунан ат-Тирмизи» и «Шамаиль Мухаммадийя».',
    },
    src: { uz: 'Siyaru a’lomin-nubalo, 13-jild', en: 'Siyar A‘lam an-Nubala, Vol. 13', ru: 'Сияр алям ан-нубаля, том 13' },
  },
  {
    id: 'sc_12',
    deck: 'scholars',
    correctIndex: 1,
    uz: {
      q: 'Ahli Sunna val-Jamoaning ikki buyuk aqida imomidan biri — «Kitobut-tavhid» muallifi Imom Abu Mansur al-Moturidiy qaysi shaharda yashab ijod qilganlar?',
      opts: ['Bag‘dodda', 'Samarqandda', 'Qohirada', 'Madinada'],
      exp: 'Imomul-hudo Abu Mansur Muhammad al-Moturidiy (vaf. 333 h. / 944 m.) Samarqandning Moturid mahallasida tug‘ilib, Samarqanddagi Chokardiza qabristonida dafn etilganlar.',
    },
    en: {
      q: 'In which city did Imam Abu Mansur al-Maturidi — author of “Kitab at-Tawhid” and leader of the Maturidi creed school — live and teach?',
      opts: ['Baghdad', 'Samarkand', 'Cairo', 'Madinah'],
      exp: 'Imam al-Huda Abu Mansur al-Maturidi (d. 333 AH / 944 CE) was born in Maturid, a district of Samarkand, and rests in Samarkand’s Chokardiza cemetery.',
    },
    ru: {
      q: 'В каком городе жил и трудился автор «Китаб ат-Таухид» и имам вероучения Ахлю-с-Сунна Абу Мансур аль-Матуриди?',
      opts: ['В Багдаде', 'В Самарканде', 'В Каире', 'В Медине'],
      exp: 'Имам аль-Худа Абу Мансур аль-Матуриди (ум. 333 г. х. / 944 г.) родился и жил в Самарканде.',
    },
    src: { uz: 'Kitobut-tavhid • Al-Javohirul-muziyya', en: 'Kitab at-Tawhid • Al-Jawahir al-Mudiyyah', ru: 'Китаб ат-Таухид • Аль-Джавахир аль-мудийя' },
  },
  {
    id: 'sc_13',
    deck: 'scholars',
    correctIndex: 1,
    uz: {
      q: 'Hanafiy mazhabining eng mo‘tabar fiqhiy manbasi bo‘lgan «Al-Hidoya» asarining muallifi kim?',
      opts: [
        'Shamsul-aimma as-Saraxsiy',
        'Burhoniddin Ali ibn Abu Bakr al-Marg‘inoniy',
        'Abul-Barakot an-Nasafiy',
        'Ubaydulloh ibn Mas’ud (Sadrush-sharia)',
      ],
      exp: 'Farg‘ona vodiysining Rishton va Marg‘ilon zaminidan yetishib chiqqan Burhoniddin al-Marg‘inoniy (511–593 h.) «Bidoyatul-mubtadiy» va uning sharhi «Al-Hidoya»ni yozganlar.',
    },
    en: {
      q: 'Who authored “Al-Hidayah”, one of the most authoritative legal texts of the Hanafi school?',
      opts: [
        'Shams al-A’immah as-Sarakhsi',
        'Burhanuddin Ali ibn Abi Bakr al-Marghinani',
        'Abu al-Barakat an-Nasafi',
        '‘Ubaydullah ibn Mas‘ud (Sadr ash-Shari‘ah)',
      ],
      exp: 'Shaykh al-Islam Burhanuddin al-Marghinani (511–593 AH) from the Fergana Valley authored Al-Hidayah over 13 years while fasting continuously.',
    },
    ru: {
      q: 'Кто является автором «Аль-Хидая» — одного из главных трудов по ханафитскому фикху?',
      opts: [
        'Шамсуль-аимма ас-Сарахси',
        'Бурхануддин Али ибн Абу Бакр аль-Маргинани',
        'Абуль-Баракат ан-Насафи',
        'Убайдуллах ибн Масуд (Садруш-шариа)',
      ],
      exp: 'Бурхануддин аль-Маргинани (511–593 гг. х.) из Ферганской долины написал великий труд «Аль-Хидая».',
    },
    src: { uz: 'Al-Favoidul-bahiyya (Abdulhay Laknaviy)', en: 'Al-Fawa’id al-Bahiyyah (al-Laknawi)', ru: 'Аль-Фаваид аль-бахийя (аль-Лакнави)' },
  },
  {
    id: 'sc_14',
    deck: 'scholars',
    correctIndex: 0,
    uz: {
      q: '«Tanbehul-g‘ofiliyn» va «Bo‘stonul-orifiyn» kabi mashhur mav’iza va axloq kitoblarini yozgan «Faqih» laqabli samarqandlik alloma kim?',
      opts: ['Faqih Abu Lays as-Samarqandiy', 'Imom ad-Dorimiy as-Samarqandiy', 'Alouddin as-Samarqandiy', 'Hakim at-Termiziy'],
      exp: '«Imomul-hudo» va «Al-Faqih» unvonlari bilan tanilgan Nasr ibn Muhammad Abu Lays as-Samarqandiy (vaf. 373 h.) tafsir, fiqh va odobga oid mashhur asarlar yozganlar.',
    },
    en: {
      q: 'Which renowned scholar of Samarkand authored “Tanbih al-Ghafilin” (Awakening the Heedless) and “Bustan al-‘Arifin”?',
      opts: ['Faqih Abu al-Layth as-Samarqandi', 'Imam ad-Darimi as-Samarqandi', '‘Ala’uddin as-Samarqandi', 'Al-Hakim at-Tirmidhi'],
      exp: 'Faqih Abu al-Layth Nasr ibn Muhammad as-Samarqandi (d. 373 AH) authored Tanbih al-Ghafilin, Bustan al-‘Arifin, and the Tafsir Bahr al-‘Ulum.',
    },
    ru: {
      q: 'Какой учёный из Самарканда является автором известных книг «Танбихуль-гафилин» и «Бустануль-арифин»?',
      opts: ['Факих Абу Ляйс ас-Самарканди', 'Имам ад-Дарими ас-Самарканди', 'Аляуддин ас-Самарканди', 'Аль-Хаким ат-Тирмизи'],
      exp: 'Факих Абу Ляйс Наср ибн Мухаммад ас-Самарканди (ум. 373 г. х.) написал «Танбихуль-гафилин» и «Бустануль-арифин».',
    },
    src: { uz: 'Al-Javohirul-muziyya fi tabaqotil-hanafiyya', en: 'Al-Jawahir al-Mudiyyah fi Tabaqat al-Hanafiyyah', ru: 'Аль-Джавахир аль-мудийя фи табакат аль-ханафия' },
  },
  {
    id: 'sc_15',
    deck: 'scholars',
    correctIndex: 2,
    uz: {
      q: 'Toshkentdagi «Hazrati Imom» (Hastimom) majmuasi qaysi buyuk alloma nomi bilan bog‘liq?',
      opts: ['Shayx Zayniddin Ko‘kcha', 'Shayx Xovandi Tahur', 'Abu Bakr Muhammad Qaffol ash-Shoshiy (904–976)', 'Xo‘ja Ahror Valiy'],
      exp: '«Qaffol ash-Shoshiy al-Kabir» — Abu Bakr Muhammad ibn Ali ash-Shoshiy (291–365 h.) buyuk faqih, muhaddis va tilshunos bo‘lib, Toshkentda «Hazrati Imom» (Hastimom) nomi bilan e’zozlanadi.',
    },
    en: {
      q: 'After which great 10th-century scholar of Tashkent (Shash) is the Hazrati Imam (Hastimom) complex named?',
      opts: ['Shaykh Zayniddin Kukcha', 'Shaykh Khovandi Tahur', 'Abu Bakr Muhammad al-Qaffal ash-Shashi (904–976 CE)', 'Khwaja Ahrar Wali'],
      exp: 'Imam Abu Bakr Muhammad ibn Ali al-Qaffal ash-Shashi al-Kabir (291–365 AH) is revered in Tashkent as “Hazrati Imam” (Hastimom).',
    },
    ru: {
      q: 'В честь какого великого учёного Шаша (Ташкента) назван комплекс Хазрати Имам (Хастимам)?',
      opts: ['Шейха Зайниддина Кукча', 'Шейха Хованди Тахура', 'Абу Бакра Мухаммада аль-Каффаля аш-Шаши (904–976)', 'Ходжи Ахрара Вали'],
      exp: 'Имам Абу Бакр Мухаммад ибн Али аль-Каффаль аш-Шаши аль-Кабир (291–365 гг. х.) почитается в Ташкенте как Хазрати Имам (Хастимам).',
    },
    src: { uz: 'Vafayotul-a’yon (Ibn Xallikon) • Tabaqotush-shofiiyya', en: 'Wafayat al-A‘yan (Ibn Khallikan)', ru: 'Вафаят аль-аян (Ибн Халликан)' },
  },
  {
    id: 'sc_16',
    deck: 'scholars',
    correctIndex: 1,
    uz: {
      q: '«Dil ba yoru, dast ba kor» («Ko‘ngling Allohda, qo‘ling halol mehnatda bo‘lsin») hikmati qaysi buyuk mutasavvif allomaga tegishli?',
      opts: ['Xo‘ja Ahmad Yassaviy', 'Bahouddin Naqshband Buxoriy', 'Najmiddin Kubro', 'Abduxoliq G‘ijduvoniy'],
      exp: 'Buxorolik buyuk avliyo va Naqshbandiya tariqati peshvosi Xo‘ja Bahouddin Naqshband (1318–1389) ushbu shior bilan halol kasb va doimiy zikrni uyg‘unlashtirganlar.',
    },
    en: {
      q: 'Which great spiritual master of Bukhara taught the principle “Dil ba yoru, dast ba kor” (“Heart with Allah, hands at honest work”)?',
      opts: ['Khwaja Ahmad Yasawi', 'Baha’uddin Naqshband al-Bukhari', 'Najmuddin Kubra', '‘Abdul-Khaliq al-Ghijduwani'],
      exp: 'Khwaja Baha’uddin Naqshband of Bukhara (1318–1389 CE) emphasized combining constant remembrance of Allah in the heart with earning a lawful livelihood.',
    },
    ru: {
      q: 'Кому принадлежит мудрое наставление «Диль ба ёру, даст ба кор» («Сердце — с Аллахом, а руки — в честном труде»)?',
      opts: ['Ходже Ахмаду Ясави', 'Бахауддину Накшбанду аль-Бухари', 'Наджмуддину Кубра', 'Абдулхалику Гидждувани'],
      exp: 'Великий бухарский богослов Бахауддин Накшбанд (1318–1389) учил сочетать поминание Аллаха в сердце с честным трудом.',
    },
    src: { uz: 'Rashahotu aynil-hayot (Faxruddin Ali Safiy)', en: 'Rashahat ‘Ayn al-Hayat', ru: 'Рашахат айн аль-хаят' },
  },
  {
    id: 'sc_17',
    deck: 'scholars',
    correctIndex: 0,
    uz: {
      q: 'Imom Buxoriy va Imom Muslimning ustozlaridan bo‘lgan, to‘qqiz mo‘tabar hadis to‘plamidan biri — «Sunan (Musnad) ad-Dorimiy»ni yozgan alloma kim?',
      opts: ['Imom Abu Muhammad Abdulloh ad-Dorimiy as-Samarqandiy', 'Imom Ibn Xuzayma', 'Imom al-Bayhaqiy', 'Imom ad-Doraqutniy'],
      exp: 'Imom Abdulloh ibn Abdurahmon ad-Dorimiy as-Samarqandiy (181–255 h.) Samarqandda hadis ilmini rivojlantirgan buyuk muhaddis va «Sunani Dorimiy» muallifidirlar.',
    },
    en: {
      q: 'Which teacher of Imam al-Bukhari and Imam Muslim from Samarkand compiled the famous hadith collection “Sunan ad-Darimi”?',
      opts: ['Imam Abu Muhammad Abdullah ad-Darimi as-Samarqandi', 'Imam Ibn Khuzaymah', 'Imam al-Bayhaqi', 'Imam ad-Daraqutni'],
      exp: 'Imam Abdullah ibn ‘Abdur-Rahman ad-Darimi as-Samarqandi (181–255 AH) compiled Sunan ad-Darimi and taught both al-Bukhari and Muslim.',
    },
    ru: {
      q: 'Кто из великих мухаддисов Самарканда был учителем аль-Бухари и Муслима и составил сборник «Сунан ад-Дарими»?',
      opts: ['Имам Абу Мухаммад Абдуллах ад-Дарими ас-Самарканди', 'Имам Ибн Хузайма', 'Имам аль-Байхаки', 'Имам ад-Даракутни'],
      exp: 'Имам Абдуллах ибн Абдуррахман ад-Дарими ас-Самарканди (181–255 гг. х.) — автор знаменитого сборника хадисов «Сунан ад-Дарими».',
    },
    src: { uz: 'Siyaru a’lomin-nubalo, 12-jild', en: 'Siyar A‘lam an-Nubala, Vol. 12', ru: 'Сияр алям ан-нубаля, том 12' },
  },
  {
    id: 'sc_18',
    deck: 'scholars',
    correctIndex: 2,
    uz: {
      q: '«Madorikut-tanzil» (Tafsiri Nasafiy) va Hanafiy fiqhidagi «Kanzud-daqoiq» asarlarini yozgan Qarshi (Nasaf)lik alloma kim?',
      opts: ['Najmiddin Umar an-Nasafiy', 'Abul-Mu’in an-Nasafiy', 'Hofizuddin Abul-Barakot Abdulloh an-Nasafiy', 'Burhoniddin an-Nasafiy'],
      exp: 'Hofizuddin Abul-Barakot Abdulloh ibn Ahmad an-Nasafiy (vaf. 710 h. / 1310 m.) butun islom olamida mashhur «Tafsiri Nasafiy» va «Kanzud-daqoiq» muallifidirlar.',
    },
    en: {
      q: 'Which great scholar from Nasaf (Karshi) authored the renowned Tafsir “Madarik at-Tanzil” and the Hanafi fiqh text “Kanz ad-Daqa’iq”?',
      opts: ['Najmuddin ‘Umar an-Nasafi', 'Abu al-Mu‘in an-Nasafi', 'Hafizuddin Abu al-Barakat Abdullah an-Nasafi', 'Burhanuddin an-Nasafi'],
      exp: 'Hafizuddin Abu al-Barakat Abdullah ibn Ahmad an-Nasafi (d. 710 AH / 1310 CE) authored Madarik at-Tanzil (Tafsir an-Nasafi) and Kanz ad-Daqa’iq.',
    },
    ru: {
      q: 'Какой учёный из Насафа (Карши) написал знаменитый тафсир «Мадарик ат-танзиль» и книгу по фикху «Канз ад-дакаик»?',
      opts: ['Наджмуддин Умар ан-Насафи', 'Абуль-Муин ан-Насафи', 'Хафизуддин Абуль-Баракат Абдуллах ан-Насафи', 'Бурхануддин ан-Насафи'],
      exp: 'Хафизуддин Абуль-Баракат Абдуллах ибн Ахмад ан-Насафи (ум. 710 г. х. / 1310 г.) — автор «Тафсира ан-Насафи» и «Канз ад-дакаик».',
    },
    src: { uz: 'At-Tojul-mukallal • Al-Favoidul-bahiyya', en: 'Al-Fawa’id al-Bahiyyah', ru: 'Аль-Фаваид аль-бахийя' },
  },
  {
    id: 'sc_19',
    deck: 'scholars',
    correctIndex: 1,
    uz: {
      q: 'Mo‘minlar onasi Oisha binti Abu Bakr (r.a.) Payg‘ambarimiz ﷺdan qancha hadis rivoyat qilib, sahobalar orasida eng ko‘p hadis aytganlar qatoridan joy olganlar?',
      opts: ['500 ta hadis', '2210 ta hadis', '850 ta hadis', '1100 ta hadis'],
      exp: 'Hazrati Oisha onamiz (r.a.) 2210 ta hadis rivoyat qilganlar va sahobalar orasida eng kuchli faqiha olimalardan bo‘lganlar.',
    },
    en: {
      q: 'How many hadiths did Mother of the Believers Aisha bint Abi Bakr (r.a.) narrate from the Prophet ﷺ?',
      opts: ['500 hadiths', '2,210 hadiths', '850 hadiths', '1,100 hadiths'],
      exp: 'Aisha bint Abi Bakr (r.a.) narrated 2,210 hadiths and was one of the greatest jurists and teachers among the Companions.',
    },
    ru: {
      q: 'Сколько хадисов передала мать правоверных Аиша бинт Абу Бакр (р.а.) от Посланника Аллаха ﷺ?',
      opts: ['500 хадисов', '2210 хадисов', '850 хадисов', '1100 хадисов'],
      exp: 'Мать правоверных Аиша (р.а.) передала 2210 хадисов и была одним из величайших знатоков фикха среди сподвижников.',
    },
    src: { uz: 'Siyaru a’lomin-nubalo, 2-jild', en: 'Siyar A‘lam an-Nubala, Vol. 2', ru: 'Сияр алям ан-нубаля, том 2' },
  },
  {
    id: 'sc_20',
    deck: 'scholars',
    correctIndex: 0,
    uz: {
      q: 'Payg‘ambarimiz ﷺ tomonidan «Tarjimonul-Qur’on» va «Habrul-Umma» (Ummatning donishmand olimi) deb duo qilingan sahoba kim?',
      opts: ['Abdulloh ibn Abbos (r.a.)', 'Abdulloh ibn Mas’ud (r.a.)', 'Ubay ibn Ka’b (r.a.)', 'Abu Dardo (r.a.)'],
      exp: 'Rasululloh ﷺ amakivachchalari Abdulloh ibn Abbos (r.a.) haqqiga: «Allohim, unga dinni chuqur anglat va tafsirni (ta’vilni) o‘rgat!» deb duo qilganlar.',
    },
    en: {
      q: 'Which Companion was blessed by the Prophet’s ﷺ prayer to understand tafsir and became known as “Tarjuman al-Qur’an” (Interpreter of the Quran)?',
      opts: ['Abdullah ibn ‘Abbas (r.a.)', 'Abdullah ibn Mas‘ud (r.a.)', 'Ubayy ibn Ka‘b (r.a.)', 'Abu ad-Darda (r.a.)'],
      exp: 'The Prophet ﷺ prayed for his cousin Abdullah ibn ‘Abbas (r.a.): “O Allah, grant him deep understanding of the religion and teach him interpretation.”',
    },
    ru: {
      q: 'Какой сподвижник получил прозвище «Тарджумануль-Куръан» (Толкователь Корана) благодаря дуа Пророка ﷺ?',
      opts: ['Абдуллах ибн Аббас (р.а.)', 'Абдуллах ибн Масуд (р.а.)', 'Убайй ибн Кааб (р.а.)', 'Абу ад-Дарда (р.а.)'],
      exp: 'Пророк ﷺ вознёс дуа за своего двоюродного брата Абдуллаха ибн Аббаса (р.а.): «О Аллах, даруй ему глубокое понимание религии и научи толкованию!»',
    },
    src: { uz: 'Sahihul Buxoriy, 143-hadis • Sahihi Muslim, 2477', en: 'Sahih al-Bukhari 143 • Sahih Muslim 2477', ru: 'Сахих аль-Бухари 143 • Сахих Муслим 2477' },
  },
  // ==================== 6. ISLOM ODOBI VA AXLOQ (et_01..et_20) ====================
  {
    id: 'et_01',
    deck: 'ethics',
    correctIndex: 0,
    uz: {
      q: 'Bir sahoba Rasululloh ﷺdan: «Insonlar ichida mening go‘zal muomalamga eng haqli kishi kim?» deb so‘raganida, u zot uch marta kimni aytib, to‘rtinchi marta «Otang» deganlar?',
      opts: ['«Onang» (uch marta)', '«Ustozing» (uch marta)', '«Qo‘shning» (uch marta)', '«Farzanding» (uch marta)'],
      exp: 'Abu Hurayra (r.a.) rivoyat qilgan mashhur hadisda Payg‘ambarimiz ﷺ uch marta «Onang», to‘rtinchi martada esa «So‘ng otang» deb javob berganlar.',
    },
    en: {
      q: 'When asked “Who among people is most deserving of my good companionship?”, whom did the Prophet ﷺ name three times before saying “Then your father”?',
      opts: ['“Your mother” (three times)', '“Your teacher” (three times)', '“Your neighbor” (three times)', '“Your child” (three times)'],
      exp: 'In the hadith of Abu Hurayrah (r.a.), the Prophet ﷺ answered “Your mother” three times in succession, and on the fourth time said “Then your father.”',
    },
    ru: {
      q: 'Кого Пророк ﷺ назвал трижды подряд, отвечая на вопрос «Кто из людей более всего достоин моего хорошего отношения?», прежде чем на четвёртый раз сказать «Твой отец»?',
      opts: ['«Твоя мать» (три раза)', '«Твой учитель» (три раза)', '«Твой сосед» (три раза)', '«Твой ребёнок» (три раза)'],
      exp: 'В известном хадисе Абу Хурайры (р.а.) Посланник Аллаха ﷺ трижды ответил «Твоя мать», а на четвёртый раз — «Затем твой отец».',
    },
    src: { uz: 'Sahihul Buxoriy, 5971-hadis • Sahihi Muslim, 2548', en: 'Sahih al-Bukhari 5971 • Sahih Muslim 2548', ru: 'Сахих аль-Бухари 5971 • Сахих Муслим 2548' },
  },
  {
    id: 'et_02',
    deck: 'ethics',
    correctIndex: 1,
    uz: {
      q: 'Payg‘ambarimiz ﷺ: «Birodaringning yuziga ... qarab boqishing ham sen uchun sadaqadir» deganlar. Nuqtalar o‘rnidagi so‘z nima?',
      opts: ['jiddiy', 'tabassum bilan (ochiq chehra bilan)', 'uzoq', 'sinchkovlik bilan'],
      exp: 'Sunani Termiziyda kelgan sahih hadisda: «Tabassumuka fi vajhi axika laka sadaqatun» — «Birodaring yuziga tabassum qilishing sen uchun sadaqadir» deyilgan.',
    },
    en: {
      q: 'Complete the Prophetic teaching: “Your ... in the face of your brother is charity (sadaqah) for you.”',
      opts: ['seriousness', 'smiling', 'long gaze', 'questioning'],
      exp: 'In Jami‘ at-Tirmidhi, the Prophet ﷺ taught: “Your smile in the face of your brother is an act of charity (sadaqah) for you.”',
    },
    ru: {
      q: 'Завершите хадис Пророка ﷺ: «Твоя ... в лицо твоему брату — это милостыня (садака) для тебя».',
      opts: ['строгость', 'улыбка', 'внимательность', 'просьба'],
      exp: 'В «Сунане» ат-Тирмизи приводится хадис: «Твоя улыбка в лицо твоему брату является для тебя милостыней (садака)».',
    },
    src: { uz: 'Sunani Termiziy, 1956-hadis', en: 'Jami at-Tirmidhi, Hadith 1956', ru: 'Сунан ат-Тирмизи, хадис 1956' },
  },
  {
    id: 'et_03',
    deck: 'ethics',
    correctIndex: 2,
    uz: {
      q: 'Rasululloh ﷺ yosh sahoba Umar ibn Abu Salamaga ovqatlanishning qaysi uchta oltin odobini o‘rgatganlar?',
      opts: [
        'Tez yeyish, tik turib yeyish va gapirmaslik',
        'Idishning o‘rtasidan olish, chap qo‘lda yeyish, suv ichmaslik',
        '«Bismillah» aytish, o‘ng qo‘l bilan yeyish va o‘z oldidan olib yeyish',
        'Faqat yolg‘iz o‘tirib yeyish',
      ],
      exp: 'Payg‘ambarimiz ﷺ: «Ey bola, Allohning ismini ayt («Bismillah» de), o‘ng qo‘ling bilan ye va o‘z oldingdan olib ye!» deb ta’lim berganlar.',
    },
    en: {
      q: 'What three dining manners did the Prophet ﷺ teach the young Companion ‘Umar ibn Abi Salamah?',
      opts: [
        'Eat quickly, stand while eating, and remain silent',
        'Take from the center of the dish, eat with the left hand, avoid water',
        'Mention Allah’s name (“Bismillah”), eat with the right hand, and eat from what is nearest to you',
        'Always eat alone',
      ],
      exp: 'The Prophet ﷺ instructed him: “O boy! Mention the Name of Allah (say Bismillah), eat with your right hand, and eat from what is directly in front of you.”',
    },
    ru: {
      q: 'Каким трём правилам этикета приёма пищи Пророк ﷺ обучил юного сподвижника Умара ибн Абу Саляму?',
      opts: [
        'Есть быстро, стоя и молча',
        'Брать из середины блюда, есть левой рукой, не пить воду',
        'Произнести «Бисмиллях», есть правой рукой и брать еду со своей стороны блюда',
        'Всегда есть в одиночестве',
      ],
      exp: 'Пророк ﷺ сказал: «О мальчик, помяни имя Аллаха, ешь правой рукой и бери то, что находится перед тобой!»',
    },
    src: { uz: 'Sahihul Buxoriy, 5376-hadis • Sahihi Muslim, 2022', en: 'Sahih al-Bukhari 5376 • Sahih Muslim 2022', ru: 'Сахих аль-Бухари 5376 • Сахих Муслим 2022' },
  },
  {
    id: 'et_04',
    deck: 'ethics',
    correctIndex: 2,
    uz: {
      q: 'Salomni to‘liq shaklda — «Assalomu alaykum va rohmatullohi va barokatuh» deb aytgan kishiga nechta savob (hasana) yoziladi?',
      opts: ['10 ta savob', '20 ta savob', '30 ta savob', '15 ta savob'],
      exp: 'Hadisi sharifga ko‘ra: «Assalomu alaykum» desa — 10 ta, «va rohmatulloh»ni qo‘shsa — 20 ta, «va barokatuh»ni ham qo‘shsa — 30 ta savob yoziladi.',
    },
    en: {
      q: 'How many rewards (hasanat) are recorded for greeting with the full salam: “As-salamu ‘alaykum wa rahmatullahi wa barakatuh”?',
      opts: ['10 rewards', '20 rewards', '30 rewards', '15 rewards'],
      exp: 'According to the hadith of ‘Imran ibn Husayn (r.a.), “As-salamu ‘alaykum” earns 10 rewards, adding “wa rahmatullah” earns 20, and adding “wa barakatuh” earns 30 rewards.',
    },
    ru: {
      q: 'Сколько благих дел (хасанатов) записывается тому, кто произносит полное приветствие: «Ас-саляму алейкум ва рахматуллахи ва баракатух»?',
      opts: ['10 наград', '20 наград', '30 наград', '15 наград'],
      exp: 'За «Ас-саляму алейкум» записывается 10 хасанатов, с добавлением «ва рахматуллах» — 20, а с «ва баракатух» — 30 хасанатов.',
    },
    src: { uz: 'Sunani Abu Dovud, 5195 • Termiziy, 2689', en: 'Sunan Abi Dawud 5195 • Jami at-Tirmidhi 2689', ru: 'Сунан Абу Дауд 5195 • Сунан ат-Тирмизи 2689' },
  },
  {
    id: 'et_05',
    deck: 'ethics',
    correctIndex: 1,
    uz: {
      q: 'Payg‘ambarimiz ﷺ: «Kuchli odam kurashda yenggan emas, balki haqiqiy pahlavon — ... o‘zini tuta olgan kishidir» deganlar.',
      opts: ['safarda charchaganda', 'g‘azabi kelgan paytda', 'boylik kelganda', 'tortishuvda ovozini baland qilganda'],
      exp: 'Abu Hurayra (r.a.)dan rivoyat qilingan hadisda haqiqiy kuchli inson g‘azabi kelganda nafsini jilovlay olgan kishi ekani ta’kidlangan.',
    },
    en: {
      q: 'How did the Prophet ﷺ define the truly strong person?',
      opts: [
        'One who never gets tired during travel',
        'Not the one who overcomes people by wrestling, but the one who controls himself when angry',
        'One who speaks loudest in an argument',
        'One who accumulates the most wealth',
      ],
      exp: 'The Prophet ﷺ said: “The strong person is not the one who throws people down in wrestling; rather, the strong person is the one who controls himself at the time of anger.”',
    },
    ru: {
      q: 'Кого Пророк ﷺ назвал по-настоящему сильным человеком?',
      opts: [
        'Того, кто не устаёт в пути',
        'Не того, кто побеждает в борьбе, а того, кто владеет собой в гневе',
        'Того, кто громче всех спорит',
        'Того, кто обладает богатством',
      ],
      exp: 'Пророк ﷺ сказал: «Силён не тот, кто побеждает других в борьбе, а силён тот, кто владеет собой во время гнева».',
    },
    src: { uz: 'Sahihul Buxoriy, 6114-hadis • Sahihi Muslim, 2609', en: 'Sahih al-Bukhari 6114 • Sahih Muslim 2609', ru: 'Сахих аль-Бухари 6114 • Сахих Муслим 2609' },
  },
  {
    id: 'et_06',
    deck: 'ethics',
    correctIndex: 2,
    uz: {
      q: "Qur'oni Karimning qaysi surasida badgumonlik, josuslik qilish va birovning ortidan g‘iybat qilishdan qat’iy qaytarilgan?",
      opts: ['Al-Mulk surasi, 10-oyat', 'Al-Kahf surasi, 28-oyat', 'Al-Hujurot surasi, 12-oyat', 'An-Nur surasi, 35-oyat'],
      exp: 'Go‘zal odoblar surasi bo‘lgan Al-Hujurot surasining 12-oyatida: «Ko‘p gumonlardan chetda bo‘linglar... ayrimlaringiz ayrimlaringizni g‘iybat qilmasin» deb buyurilgan.',
    },
    en: {
      q: 'Which Quranic verse explicitly forbids suspicion, spying on others, and backbiting (ghibah)?',
      opts: ['Surah Al-Mulk 67:10', 'Surah Al-Kahf 18:28', 'Surah Al-Hujurat 49:12', 'Surah An-Nur 24:35'],
      exp: 'Surah Al-Hujurat 49:12 commands believers to avoid much suspicion, not to spy on one another, and not to backbite one another.',
    },
    ru: {
      q: 'В каком аяте Корана строго запрещаются дурные подозрения, выслеживание и злословие за спиной (гыйба)?',
      opts: ['Сура Аль-Мульк, аят 10', 'Сура Аль-Кахф, аят 28', 'Сура Аль-Худжурат, аят 12', 'Сура Ан-Нур, аят 35'],
      exp: 'В 12-м аяте суры Аль-Худжурат Всевышний запрещает многие подозрения, шпионство друг за другом и злословие (гыйба).',
    },
    src: { uz: "Qur'on, Al-Hujurot surasi, 12-oyat", en: "Qur'an, Surah Al-Hujurat 49:12", ru: 'Коран, сура Аль-Худжурат, аят 12' },
  },
  {
    id: 'et_07',
    deck: 'ethics',
    correctIndex: 1,
    uz: {
      q: 'Payg‘ambarimiz ﷺ: «Kim rizqi keng bo‘lishini va umri barakali (uzun) bo‘lishini xohlasa, ... qilsin» deganlar.',
      opts: ['ko‘p safar', 'silai rahm (qarindoshlik aloqalarini bog‘lash)', 'tijoratini o‘zgartirish', 'yolg‘iz yashash'],
      exp: 'Anas ibn Molik (r.a.)dan rivoyat qilingan hadisda silai rahm qilish rizqning kengayishi va umrning barakali bo‘lishiga sabab ekani aytilgan.',
    },
    en: {
      q: 'According to the hadith, what should a person do who wishes for their provision (rizq) to be expanded and their lifespan blessed?',
      opts: ['Travel frequently', 'Maintain ties of kinship (Silat ar-Rahim)', 'Change their trade', 'Live in seclusion'],
      exp: 'The Prophet ﷺ said: “Whoever would love to have his provision expanded and his term of life prolonged should maintain ties of kinship (Silat ar-Rahim).”',
    },
    ru: {
      q: 'Что Пророк ﷺ велел делать тому, кто желает увеличения удела (ризка) и благодати в сроке жизни?',
      opts: ['Много путешествовать', 'Поддерживать родственные узы (силаи рахм)', 'Сменить ремесло', 'Жить уединённо'],
      exp: 'Пророк ﷺ сказал: «Кто желает, чтобы его удел был расширен, а срок жизни продлён, пусть поддерживает родственные связи».',
    },
    src: { uz: 'Sahihul Buxoriy, 5986-hadis • Sahihi Muslim, 2557', en: 'Sahih al-Bukhari 5986 • Sahih Muslim 2557', ru: 'Сахих аль-Бухари 5986 • Сахих Муслим 2557' },
  },
  {
    id: 'et_08',
    deck: 'ethics',
    correctIndex: 0,
    uz: {
      q: 'Payg‘ambarimiz ﷺ: «Jabroil (a.s.) menga ... haqida shu qadar ko‘p vasiyat qildilarki, uni hatto merosxo‘r qilib qo‘yarmikanlar deb o‘yladim» deganlar.',
      opts: ['qo‘shni', 'musofir', 'xodim', 'shogird'],
      exp: 'Islomda qo‘shnichilik haqqi nihoyatda ulug‘ bo‘lib, mo‘min kishi qo‘shnisiga ozor bermasligi va yaxshilik qilishi iymon komilligidandir.',
    },
    en: {
      q: 'About whom did the Prophet ﷺ say: “Jibril kept advising me regarding the ... until I thought he would make him an heir”?',
      opts: ['neighbor', 'traveler', 'employee', 'student'],
      exp: 'Both al-Bukhari and Muslim record: “Jibril continued to advise me about treating the neighbor kindly until I thought he would assign him a share of inheritance.”',
    },
    ru: {
      q: 'О ком Пророк ﷺ сказал: «Джибриль так часто наставлял меня хорошо относиться к ..., что я подумал, не включит ли он его в число наследников»?',
      opts: ['соседу', 'путнику', 'работнику', 'ученику'],
      exp: 'В хадисе аль-Бухари и Муслима подчёркивается великое право соседа в Исламе.',
    },
    src: { uz: 'Sahihul Buxoriy, 6014-hadis • Sahihi Muslim, 2624', en: 'Sahih al-Bukhari 6014 • Sahih Muslim 2624', ru: 'Сахих аль-Бухари 6014 • Сахих Муслим 2624' },
  },
  {
    id: 'et_09',
    deck: 'ethics',
    correctIndex: 1,
    uz: {
      q: 'Sunnatga muvofiq masjidga qaysi oyoq bilan kiriladi va qaysi oyoq bilan chiqiladi?',
      opts: [
        'Chap oyoq bilan kirilib, o‘ng oyoq bilan chiqiladi',
        'O‘ng oyoq bilan («Allohummaftah li abvoba rohmatik» deb) kirilib, chap oyoq bilan chiqiladi',
        'Ikkala holatda ham chap oyoq bilan',
        'Farqi yo‘q',
      ],
      exp: 'Masjidga o‘ng oyoq bilan kirib rahmat eshiklari so‘raladi, chiqishda esa chap oyoq bilan chiqib Allohning fazli so‘raladi.',
    },
    en: {
      q: 'According to the Sunnah, with which foot does one enter and exit the mosque?',
      opts: [
        'Enter with the left foot and exit with the right foot',
        'Enter with the right foot (asking for Allah’s mercy) and exit with the left foot',
        'Both with the left foot',
        'No specific order',
      ],
      exp: 'It is Sunnah to step into the mosque with the right foot saying “Allahumma-ftah li abwaba rahmatik” and step out with the left foot saying “Allahumma inni as’aluka min fadlik.”',
    },
    ru: {
      q: 'С какой ноги по сунне входят в мечеть и с какой выходят из неё?',
      opts: [
        'Входят с левой ноги, выходят с правой',
        'Входят с правой ноги (прося врата милости), а выходят с левой ноги',
        'И входят, и выходят с левой ноги',
        'Не имеет значения',
      ],
      exp: 'По сунне в мечеть входят с правой ноги с дуа «Аллахумма-фтах ли абваба рахматик», а выходят с левой ноги.',
    },
    src: { uz: 'Sahihi Muslim, 713-hadis • Mustadraki Hokim', en: 'Sahih Muslim 713 • Al-Mustadrak', ru: 'Сахих Муслим 713 • Аль-Мустадрак' },
  },
  {
    id: 'et_10',
    deck: 'ethics',
    correctIndex: 2,
    uz: {
      q: 'Aksirgan musulmon kishi «Alhamdulillah» desa, uni eshitgan birodari nima deb javob qaytaradi?',
      opts: ['«Subhanalloh»', '«Borakalloh»', '«Yarhamukalloh» (Alloh senga rahm qilsin)', '«Mashalloh»'],
      exp: 'Aksirgan kishi «Alhamdulillah» deydi, eshitgan kishi «Yarhamukalloh» deydi, aksirgan kishi esa «Yahdikumullohu va yuslihu bolakum» deb duo qaytaradi.',
    },
    en: {
      q: 'When a Muslim sneezes and says “Alhamdulillah”, what is the Sunnah response from someone who hears them?',
      opts: ['“SubhanAllah”', '“BarakAllahu fik”', '“YarhamukAllah” (May Allah have mercy on you)', '“MashaAllah”'],
      exp: 'The sneezer says “Alhamdulillah”, the hearer replies “YarhamukAllah”, and the sneezer responds “Yahdikumullahu wa yuslihu balakum.”',
    },
    ru: {
      q: 'Что по сунне отвечает мусульманин чихнувшему брату, который сказал «Альхамдулиллях»?',
      opts: ['«Субханаллах»', '«Баракаллах»', '«Ярхамукаллах» (Да помилует тебя Аллах)', '«Машааллах»'],
      exp: 'Чихнувший говорит «Альхамдулиллях», услышавший отвечает «Ярхамукаллах», а чихнувший отвечает «Яхдикумуллаху ва юслиху балякум».',
    },
    src: { uz: 'Sahihul Buxoriy, 6224-hadis', en: 'Sahih al-Bukhari, Hadith 6224', ru: 'Сахих аль-Бухари, хадис 6224' },
  },
  {
    id: 'et_11',
    deck: 'ethics',
    correctIndex: 1,
    uz: {
      q: 'Musulmon kishining o‘z dindosh birodari bilan arazlashib, necha kundan ortiq gaplashmay yurishi halol emas?',
      opts: ['1 kundan ortiq', '3 kecha-kunduzdan ortiq', '7 kundan ortiq', '40 kundan ortiq'],
      exp: 'Rasululloh ﷺ: «Musulmon kishiga o‘z birodarini uch kundan ortiq tark etib (arazlab) yurishi halol emas; ularning yaxshirog‘i birinchi bo‘lib salom berganidir» deganlar.',
    },
    en: {
      q: 'Beyond how many days is it unlawful for a Muslim to boycott or shun a fellow Muslim over a personal dispute?',
      opts: ['1 day', '3 days', '7 days', '40 days'],
      exp: 'The Prophet ﷺ said: “It is not lawful for a Muslim to shun his brother for more than three nights... and the better of the two is the one who starts with salam.”',
    },
    ru: {
      q: 'Свыше скольких дней мусульманину запрещено прерывать общение со своим братом по вере из-за личной обиды?',
      opts: ['Свыше 1 дня', 'Свыше 3 дней', 'Свыше 7 дней', 'Свыше 40 дней'],
      exp: 'Пророк ﷺ сказал: «Не дозволено мусульманину оставлять своего брата более чем на три дня... а лучший из них тот, кто первым даст салям».',
    },
    src: { uz: 'Sahihul Buxoriy, 6077-hadis • Sahihi Muslim, 2560', en: 'Sahih al-Bukhari 6077 • Sahih Muslim 2560', ru: 'Сахих аль-Бухари 6077 • Сахих Муслим 2560' },
  },
  {
    id: 'et_12',
    deck: 'ethics',
    correctIndex: 0,
    uz: {
      q: 'Payg‘ambarimiz ﷺ: «Rostgo‘y va omonatdor (halol) tijoratchi Qiyomat kuni kimlar bilan birga bo‘ladi?» deb bashorat berganlar?',
      opts: [
        'Payg‘ambarlar, siddiqlar va shahidlar bilan birga',
        'Podshohlar bilan birga',
        'Sayyohlar bilan birga',
        'Shoirlar bilan birga',
      ],
      exp: 'Imom Termiziy rivoyat qilgan hadisda: «Rostgo‘y, omonatdor savdogar payg‘ambarlar, siddiqlar va shahidlar bilan birgadir» deyilgan.',
    },
    en: {
      q: 'With whom will the truthful, trustworthy merchant be gathered on the Day of Judgment according to the hadith?',
      opts: [
        'With the Prophets, the Siddiqin (truthful), and the Martyrs',
        'With kings and rulers',
        'With travelers',
        'With poets',
      ],
      exp: 'The Prophet ﷺ said: “The truthful, trustworthy merchant is with the Prophets, the Siddiqin, and the Shuhada (martyrs).”',
    },
    ru: {
      q: 'С кем в Судный день будет правдивый и надёжный (честный) торговец согласно хадису Пророка ﷺ?',
      opts: [
        'С пророками, правдивейшими (сиддиками) и шахидами',
        'С правителями',
        'С путешественниками',
        'С поэтами',
      ],
      exp: 'В хадисе ат-Тирмизи сказано: «Правдивый и честный торговец будет вместе с пророками, правдивейшими и павшими мучениками».',
    },
    src: { uz: 'Sunani Termiziy, 1209-hadis', en: 'Jami at-Tirmidhi, Hadith 1209', ru: 'Сунан ат-Тирмизи, хадис 1209' },
  },
  {
    id: 'et_13',
    deck: 'ethics',
    correctIndex: 2,
    uz: {
      q: '«Iymon yetmish nechta ham shoxobchadir: uning eng oliysi “La ilaha illalloh” kalimasi bo‘lsa, eng quyi darajasi ... dir va hayo ham iymondandir».',
      opts: ['ovozni baland qilish', 'ko‘p uxlash', 'yo‘ldan ozor beruvchi narsani olib tashlash', 'savdo qilish'],
      exp: 'Musulmonlar yuradigan yo‘ldan tosh, tikan yoki axlat kabi ozor beruvchi narsani olib tashlash iymon shoxobchalaridan biri hisoblanadi.',
    },
    en: {
      q: 'In the hadith on the branches of faith, the highest branch is saying “La ilaha illallah”, modesty (haya) is a branch of faith, and the lowest branch is:',
      opts: ['Raising one’s voice', 'Sleeping early', 'Removing something harmful from the road', 'Trading in the market'],
      exp: 'Sahih Muslim records that faith has over seventy branches: the highest is “La ilaha illallah”, the lowest is removing an obstacle from the road, and haya (modesty) is part of faith.',
    },
    ru: {
      q: 'Согласно хадису об ответвлениях веры, высшая ветвь иманa — слова «Ля иляха илляллах», стыдливость (хая) — часть веры, а самая малая ветвь — это:',
      opts: ['Громкая речь', 'Ранний сон', 'Убрать с дороги то, что причиняет вред людям', 'Торговля на рынке'],
      exp: 'Устранение препятствия или вреда с дороги, по которой ходят люди, является одной из ветвей веры (Сахих Муслим).',
    },
    src: { uz: 'Sahihi Muslim, 35-hadis • Sahihul Buxoriy, 9', en: 'Sahih Muslim 35 • Sahih al-Bukhari 9', ru: 'Сахих Муслим 35 • Сахих аль-Бухари 9' },
  },
  {
    id: 'et_14',
    deck: 'ethics',
    correctIndex: 1,
    uz: {
      q: 'Inson vafot etganda uning barcha amallari to‘xtaydi, faqat qaysi 3 ta amalidan savob uzluksiz borib turadi?',
      opts: [
        'Qimmat kiyimi, mashinasi va bog‘i',
        'Sadaqai joriya, foydali ilm va haqqiga duo qiluvchi solih farzand',
        'Tijorat do‘koni, oltinlari va uy-joyi',
        'Yozgan maktublari va safarlari',
      ],
      exp: 'Sahihi Muslimda kelgan hadisga ko‘ra: 1) Sadaqai joriya (masjid, ko‘prik, quduq va h.k.), 2) Foydalaniladigan ilm va 3) Haqqiga duo qiluvchi solih farzand savobi o‘limdan keyin ham to‘xtamaydi.',
    },
    en: {
      q: 'When a person dies, all their deeds come to an end except for which three continuing sources of reward?',
      opts: [
        'Fine clothing, mounts, and orchards',
        'Ongoing charity (Sadaqah Jariyah), beneficial knowledge, and a righteous child who prays for them',
        'Commercial shops, gold, and houses',
        'Personal letters and travels',
      ],
      exp: 'In Sahih Muslim, the Prophet ﷺ taught that three deeds continue after death: Sadaqah Jariyah, knowledge from which people benefit, and a righteous child who prays for the deceased.',
    },
    ru: {
      q: 'Когда человек умирает, все его дела прекращаются, кроме каких трёх источников непрерывной награды?',
      opts: [
        'Дорогая одежда, верховое животное и сад',
        'Непрерывная милостыня (садака джария), полезное знание и праведный ребёнок, делающий за него дуа',
        'Торговая лавка, золото и дом',
        'Личные письма и путешествия',
      ],
      exp: 'Согласно хадису в «Сахихе» Муслима, после смерти продолжается награда за садака джария, полезное знание и дуа праведного потомка.',
    },
    src: { uz: 'Sahihi Muslim, 1631-hadis', en: 'Sahih Muslim, Hadith 1631', ru: 'Сахих Муслим, хадис 1631' },
  },
  {
    id: 'et_15',
    deck: 'ethics',
    correctIndex: 2,
    uz: {
      q: 'Payg‘ambarimiz ﷺ: «Kim Allohga va oxirat kuniga iymon keltirgan bo‘lsa, ...» deb til odobi haqida nima buyurganlar?',
      opts: [
        'doimo baland ovozda gapirsin',
        'hamma narsani bahslashsin',
        'yaxshi so‘z aytsin yoki sukut saqlasin',
        'faqat she’r aytsin',
      ],
      exp: 'Tilni behuda va zararli so‘zlardan tiyish, faqat xayrli gap aytish yoki sukut saqlash komil iymon belgilaridandir.',
    },
    en: {
      q: 'What did the Prophet ﷺ command regarding speech: “Whoever believes in Allah and the Last Day should...”?',
      opts: [
        'always speak loudly',
        'debate every matter',
        'speak good or remain silent',
        'only recite poetry',
      ],
      exp: 'In Sahih al-Bukhari and Sahih Muslim, the Prophet ﷺ said: “Whoever believes in Allah and the Last Day, let him speak good or remain silent.”',
    },
    ru: {
      q: 'Что Пророк ﷺ заповедал об этикете речи: «Пусть тот, кто верует в Аллаха и в Последний день, ...»?',
      opts: [
        'всегда говорит громко',
        'спорит по любому поводу',
        'говорит благое или молчит',
        'говорит только стихами',
      ],
      exp: 'В «Сахихах» аль-Бухари и Муслима сказано: «Кто верует в Аллаха и Судный день, пусть говорит благое либо молчит».',
    },
    src: { uz: 'Sahihul Buxoriy, 6018-hadis • Sahihi Muslim, 47', en: 'Sahih al-Bukhari 6018 • Sahih Muslim 47', ru: 'Сахих аль-Бухари 6018 • Сахих Муслим 47' },
  },
  {
    id: 'et_16',
    deck: 'ethics',
    correctIndex: 0,
    uz: {
      q: "Qur'oni Karimning Ibrohim surasi 7-oyatida Alloh taolo: «Qasamki, agar (bergan ne’matlarimga) shukr qilsangiz, albatta ...» deb va’da bergan.",
      opts: [
        '«sizlarga (ne’matlarimni) yanada ziyoda qilurman»',
        '«sizlarni sinovsiz qoldirurman»',
        '«safaringizni qisqa qilurman»',
        '«qishni issiq qilurman»',
      ],
      exp: '«La’in shakartum la-azidannakum» — «Agar shukr qilsangiz, albatta sizlarga yanada ziyoda qilaman» oyati shukrning baraka kaliti ekanini bildiradi.',
    },
    en: {
      q: 'In Surah Ibrahim (14:7), what does Allah promise: “If you are grateful (give thanks), I will surely...”?',
      opts: [
        '“increase you [in blessings]”',
        '“remove all tests from you”',
        '“shorten your journeys”',
        '“make the winter warm”',
      ],
      exp: 'Allah declares in Surah Ibrahim 14:7: “La’in shakartum la-azidannakum” — “If you are grateful, I will surely increase you in favor.”',
    },
    ru: {
      q: 'Что Всевышний Аллах обещал в 7-м аяте суры Ибрахим: «Если вы будете благодарны, то Я непременно ...»?',
      opts: [
        '«приумножу вам (милости и блага)»',
        '«избавлю вас от всех испытаний»',
        '«сокращу ваши пути»',
        '«сделаю зиму тёплой»',
      ],
      exp: 'В 7-м аяте суры Ибрахим сказано: «Ляин шакартум ляазиданнакум» — «Если вы будете благодарны, Я непременно приумножу вам».',
    },
    src: { uz: "Qur'on, Ibrohim surasi, 7-oyat", en: "Qur'an, Surah Ibrahim 14:7", ru: 'Коран, сура Ибрахим, аят 7' },
  },
  {
    id: 'et_17',
    deck: 'ethics',
    correctIndex: 1,
    uz: {
      q: 'Payg‘ambarimiz ﷺ: «Insonlarga rahmat aytmagan (tashakkur qilmagan) kishi ...» deb kimni aytganlar?',
      opts: [
        'boy bo‘lmaydi',
        'Allohga ham shukr qilmagan bo‘ladi («La yashkurulloha man la yashkurun-nas»)',
        'safarga chiqolmaydi',
        'ilm ololmaydi',
      ],
      exp: 'Yaxshilik qilgan insonlarga minnatdorchilik bildirish va «Jazakallohu xayron» deb duo qilish Alloh taologa shukr qilishning uzviy qismidir.',
    },
    en: {
      q: 'Complete the hadith: “He who does not thank people...”',
      opts: [
        'will not become wealthy',
        'has not thanked Allah (“La yashkurullaha man la yashkurun-nas”)',
        'cannot travel far',
        'cannot learn poetry',
      ],
      exp: 'In Sunan Abi Dawud and Jami‘ at-Tirmidhi, the Prophet ﷺ taught: “He who does not thank people does not thank Allah.”',
    },
    ru: {
      q: 'Завершите хадис Пророка ﷺ: «Не благодарит Аллаха тот, кто ...»',
      opts: [
        'не копит богатство',
        'не благодарит людей («Ля яшкуруллаха ман ля яшкурун-нас»)',
        'не отправляется в путь',
        'не слагает стихов',
      ],
      exp: 'В хадисе Абу Дауда и ат-Тирмизи сказано: «Не благодарит Аллаха тот, кто не благодарит людей».',
    },
    src: { uz: 'Sunani Abu Dovud, 4811 • Termiziy, 1954', en: 'Sunan Abi Dawud 4811 • Jami at-Tirmidhi 1954', ru: 'Сунан Абу Дауд 4811 • Сунан ат-Тирмизи 1954' },
  },
  {
    id: 'et_18',
    deck: 'ethics',
    correctIndex: 2,
    uz: {
      q: 'Payg‘ambarimiz ﷺ: «Musulmonning musulmon ustidagi haqqi oltitadir» degan hadislarida bemor bo‘lgan birodar oldidagi qaysi burch zikr qilingan?',
      opts: [
        'Undan qarz so‘rash',
        'Uni yolg‘iz qoldirish',
        'Bemor bo‘lsa, uni borib ziyorat qilish (holidan xabar olish)',
        'Unga og‘ir ish buyurish',
      ],
      exp: 'Olti haq: uchraganda salom berish, chaqirganda borish, nasihat so‘rasa xolis maslahat berish, aksirib hamd aytsa javob qaytarish, bemor bo‘lsa ziyorat qilish va vafot etsa janozasiga qatnashishdir.',
    },
    en: {
      q: 'Among the six mutual rights of a Muslim over another Muslim taught by the Prophet ﷺ, what is one’s duty when a fellow Muslim falls ill?',
      opts: [
        'To ask them for a loan',
        'To leave them completely alone',
        'To visit them and check on their well-being (‘Iyadat al-marid)',
        'To assign them work',
      ],
      exp: 'In Sahih Muslim, the six rights of a Muslim are: greet with salam, accept their invitation, give sincere counsel, respond when they sneeze and praise Allah, visit them when sick, and follow their funeral.',
    },
    ru: {
      q: 'Какая обязанность перед заболевшим братом входит в шесть взаимных прав мусульман друг перед другом?',
      opts: [
        'Попросить у него в долг',
        'Оставить его совсем одного',
        'Навестить его во время болезни (иядатуль-марид)',
        'Поручить ему работу',
      ],
      exp: 'В хадисе Сахих Муслим перечислены 6 прав мусульманина: дать салям, ответить на приглашение, дать искренний совет, ответить чихнувшему, навестить больного и проводить джаназа.',
    },
    src: { uz: 'Sahihi Muslim, 2162-hadis', en: 'Sahih Muslim, Hadith 2162', ru: 'Сахих Муслим, хадис 2162' },
  },
  {
    id: 'et_19',
    deck: 'ethics',
    correctIndex: 1,
    uz: {
      q: 'Payg‘ambarimiz ﷺ uyquga yotishdan oldin qanday holatda va qaysi tomonga yonboshlab yotishni tavsiya qilganlar?',
      opts: [
        'Tahoratsiz va qorin bilan yotishni',
        'Namozga olgandek tahorat olib, o‘ng tomonga yonboshlab zikr va «Muavvizot» suralarini o‘qib yotishni',
        'O‘tirgan holda uxlashni',
        'Ovqat yeb darhol chap tomonga yotishni',
      ],
      exp: 'Baro ibn Ozib (r.a.) hadisiga ko‘ra, tahoratli holda o‘ng tomonga yonboshlab yotish va Ixlos, Falaq, Nos suralarini o‘qib dam solish sunnatdir.',
    },
    en: {
      q: 'What was the Prophet’s ﷺ Sunnah etiquette when going to sleep at night?',
      opts: [
        'Sleeping on the stomach without Wudu',
        'Performing Wudu as for prayer, lying on the right side, and reciting dhikr and the Mu‘awwidhat',
        'Sleeping while sitting upright',
        'Eating heavily and lying on the left side immediately',
      ],
      exp: 'The Prophet ﷺ instructed al-Bara’ ibn ‘Azib (r.a.): “When you go to your bed, perform Wudu as you do for prayer, then lie down on your right side” and recite the nightly adhkar.',
    },
    ru: {
      q: 'Каков суннат-этикет отхода ко сну согласно наставлению Пророка ﷺ?',
      opts: [
        'Ложиться на живот без омовения',
        'Совершить омовение как для намаза, лечь на правый бок и прочитать зикры и суры «Муаввизат»',
        'Спать сидя',
        'Плотно поесть и сразу лечь на левый бок',
      ],
      exp: 'Пророк ﷺ учил совершать перед сном тахарат, ложиться на правый бок и читать суры «Ихляс», «Фаляк», «Нас» и вечерние дуа.',
    },
    src: { uz: 'Sahihul Buxoriy, 247-hadis va 5017-hadis', en: 'Sahih al-Bukhari, Hadiths 247 & 5017', ru: 'Сахих аль-Бухари, хадисы 247 и 5017' },
  },
  {
    id: 'et_20',
    deck: 'ethics',
    correctIndex: 0,
    uz: {
      q: 'Payg‘ambarimiz ﷺ: «Hech kim o‘z qo‘l mehnati bilan topib yegan taomidan yaxshiroq taom yemagan. Allohning payg‘ambari ... ham o‘z qo‘l mehnati bilan kun ko‘rar edilar» deb qaysi payg‘ambarni misol keltirganlar?',
      opts: ['Dovud alayhissalomni', 'Yusuf alayhissalomni', 'Solih alayhissalomni', 'Horun alayhissalomni'],
      exp: 'Podshoh va payg‘ambar bo‘lishlariga qaramay, Dovud alayhissalom temirchilik (sovut yasash) bilan o‘z qo‘l mehnatlari orqali halol rizq topib yeganlar.',
    },
    en: {
      q: 'In praising earning a halal living with one’s own hands, which Prophet did the Messenger of Allah ﷺ cite as eating only from the labor of his own hands?',
      opts: ['Prophet Dawud (AS)', 'Prophet Yusuf (AS)', 'Prophet Salih (AS)', 'Prophet Harun (AS)'],
      exp: 'The Prophet ﷺ said: “No one has ever eaten food better than that earned by the work of his own hands, and indeed the Prophet of Allah, Dawud (AS), used to eat from the work of his own hands.”',
    },
    ru: {
      q: 'Какого пророка Посланник Аллаха ﷺ привёл в пример честного труда: «Никто никогда не вкушал пищи лучше той, что заработана трудом собственных рук...»?',
      opts: ['Пророка Дауда (а.с.)', 'Пророка Юсуфа (а.с.)', 'Пророка Салиха (а.с.)', 'Пророка Харуна (а.с.)'],
      exp: 'Пророк ﷺ сказал: «Поистине, пророк Аллаха Дауд (а.с.) питался тем, что зарабатывал трудом своих собственных рук».',
    },
    src: { uz: 'Sahihul Buxoriy, 2072-hadis', en: 'Sahih al-Bukhari, Hadith 2072', ru: 'Сахих аль-Бухари, хадис 2072' },
  },
];

export const EXISTING_QUESTION_SOURCES: Record<string, { uz: string; en: string; ru: string }> = {
  pr_01: { uz: "Qur'on, Al-Moida surasi, 6-oyat", en: "Qur'an, Surah Al-Ma'idah 5:6", ru: 'Коран, сура Аль-Маида, аят 6' },
  pr_02: { uz: "Hanafiy fiqhi • Muxtasarul Viqoya", en: 'Hanafi Fiqh • Mukhtasar al-Wiqayah', ru: 'Ханафитский фикх • Мухтасар аль-Викая' },
  pr_03: { uz: "Qur'on, An-Niso surasi, 43-oyat", en: "Qur'an, Surah An-Nisa 4:43", ru: 'Коран, сура Ан-Ниса, аят 43' },
  pr_04: { uz: 'Sahihul Buxoriy, 528-hadis', en: 'Sahih al-Bukhari, Hadith 528', ru: 'Сахих аль-Бухари, хадис 528' },
  pr_05: { uz: "Hanafiy fiqhi • Al-Hidoya", en: 'Hanafi Fiqh • Al-Hidayah', ru: 'Ханафитский фикх • Аль-Хидая' },
  pr_06: { uz: "Hanafiy fiqhi • Nurul Izoh", en: 'Hanafi Fiqh • Nur al-Idah', ru: 'Ханафитский фикх • Нур аль-Идах' },
  pr_07: { uz: "Hanafiy fiqhi • Muxtasarul Viqoya", en: 'Hanafi Fiqh • Mukhtasar al-Wiqayah', ru: 'Ханафитский фикх • Мухтасар аль-Викая' },
  pr_08: { uz: "Hanafiy fiqhi • Al-Hidoya", en: 'Hanafi Fiqh • Al-Hidayah', ru: 'Ханафитский фикх • Аль-Хидая' },
  pr_09: { uz: "Hanafiy fiqhi • Al-Hidoya", en: 'Hanafi Fiqh • Al-Hidayah', ru: 'Ханафитский фикх • Аль-Хидая' },
  pr_10: { uz: "Qur'on, Al-Jumu'a surasi, 9-oyat", en: "Qur'an, Surah Al-Jumu'ah 62:9", ru: 'Коран, сура Аль-Джумуа, аят 9' },
  pr_11: { uz: 'Sahihul Buxoriy va Sahihi Muslim', en: 'Sahih al-Bukhari & Sahih Muslim', ru: 'Сахих аль-Бухари и Сахих Муслим' },
  pr_12: { uz: 'Sahihi Muslim, 684-hadis', en: 'Sahih Muslim, Hadith 684', ru: 'Сахих Муслим, хадис 684' },
  qr_01: { uz: "Qur'oni Karim • Mushaf tartibi", en: "Holy Qur'an • Mushaf Order", ru: 'Священный Коран • Порядок Мусхафа' },
  qr_02: { uz: "Qur'on, Al-Alaq surasi, 1–5-oyatlar", en: "Qur'an, Surah Al-'Alaq 96:1–5", ru: 'Коран, сура Аль-Аляк, аяты 1–5' },
  qr_03: { uz: "Qur'on, Al-Baqara surasi (286 oyat)", en: "Qur'an, Surah Al-Baqarah (286 ayahs)", ru: 'Коран, сура Аль-Бакара (286 аятов)' },
  qr_04: { uz: "Qur'on, Al-Kavsar surasi (3 oyat)", en: "Qur'an, Surah Al-Kawthar (3 ayahs)", ru: 'Коран, сура Аль-Каусар (3 аята)' },
  qr_05: { uz: "Qur'on, Al-Baqara surasi, 255-oyat", en: "Qur'an, Surah Al-Baqarah 2:255", ru: 'Коран, сура Аль-Бакара, аят 255' },
  qr_06: { uz: "Qur'on, At-Tavba surasi, 1-oyat", en: "Qur'an, Surah At-Tawbah 9:1", ru: 'Коран, сура Ат-Тауба, аят 1' },
  qr_07: { uz: 'Sunani Termiziy, 2887-hadis', en: 'Jami at-Tirmidhi, Hadith 2887', ru: 'Сунан ат-Тирмизи, хадис 2887' },
  qr_08: { uz: 'Sahihul Buxoriy, 5015-hadis', en: 'Sahih al-Bukhari, Hadith 5015', ru: 'Сахих аль-Бухари, хадис 5015' },
  qr_09: { uz: 'Sahihi Muslim, 797-hadis', en: 'Sahih Muslim, Hadith 797', ru: 'Сахих Муслим, хадис 797' },
  qr_10: { uz: 'Sahihi Muslim, 809-hadis', en: 'Sahih Muslim, Hadith 809', ru: 'Сахих Муслим, хадис 809' },
  qr_11: { uz: "Qur'on, Al-Qadr surasi, 1–3-oyatlar", en: "Qur'an, Surah Al-Qadr 97:1–3", ru: 'Коран, сура Аль-Кадр, аяты 1–3' },
  qr_12: { uz: "Ulumul Qur'on • Siyrat manbalari", en: "Ulum al-Qur'an • Seerah Sources", ru: 'Улюм аль-Коран • Источники Сиры' },
  pp_01: { uz: "Qur'oni Karim • Aqida matnlari", en: "Holy Qur'an • Creed Texts", ru: 'Священный Коран • Тексты акыды' },
  pp_02: { uz: "Qur'on, Al-Baqara surasi, 30–37-oyatlar", en: "Qur'an, Surah Al-Baqarah 2:30–37", ru: 'Коран, сура Аль-Бакара, аяты 30–37' },
  pp_03: { uz: "Qur'on, Al-Ahzob surasi, 40-oyat", en: "Qur'an, Surah Al-Ahzab 33:40", ru: 'Коран, сура Аль-Ахзаб, аят 40' },
  pp_04: { uz: "Qur'on, Al-Baqara surasi, 127-oyat", en: "Qur'an, Surah Al-Baqarah 2:127", ru: 'Коран, сура Аль-Бакара, аят 127' },
  pp_05: { uz: "Qur'on, Hud surasi, 37–44-oyatlar", en: "Qur'an, Surah Hud 11:37–44", ru: 'Коран, сура Худ, аяты 37–44' },
  pp_06: { uz: "Qur'on, An-Niso surasi, 164-oyat", en: "Qur'an, Surah An-Nisa 4:164", ru: 'Коран, сура Ан-Ниса, аят 164' },
  pp_07: { uz: "Qur'on, As-Soffot surasi, 139–148-oyatlar", en: "Qur'an, Surah As-Saffat 37:139–148", ru: 'Коран, сура Ас-Саффат, аяты 139–148' },
  pp_08: { uz: "Qur'on, Al-Anbiyo surasi, 83–84-oyatlar", en: "Qur'an, Surah Al-Anbiya 21:83–84", ru: 'Коран, сура Аль-Анбия, аяты 83–84' },
  pp_09: { uz: 'Siyrati Ibn Hishom • Sahihi Muslim', en: 'Sirah Ibn Hisham • Sahih Muslim', ru: 'Сира Ибн Хишама • Сахих Муслим' },
  pp_10: { uz: 'Sahihul Buxoriy, 3905-hadis', en: 'Sahih al-Bukhari, Hadith 3905', ru: 'Сахих аль-Бухари, хадис 3905' },
  pp_11: { uz: 'Sahihul Buxoriy, 3851-hadis', en: 'Sahih al-Bukhari, Hadith 3851', ru: 'Сахих аль-Бухари, хадис 3851' },
  pp_12: { uz: "Qur'on, Al-Isro surasi, 1-oyat", en: "Qur'an, Surah Al-Isra 17:1", ru: 'Коран, сура Аль-Исра, аят 1' },
  wr_01: { uz: 'Sahihul Buxoriy, 8-hadis • Sahihi Muslim, 16-hadis', en: 'Sahih al-Bukhari 8 • Sahih Muslim 16', ru: 'Сахих аль-Бухари 8 • Сахих Муслим 16' },
  wr_02: { uz: 'Sahihi Muslim, 8-hadis (Jabroil hadisi)', en: 'Sahih Muslim, Hadith 8 (Hadith of Jibril)', ru: 'Сахих Муслим, хадис 8 (хадис Джибриля)' },
  wr_03: { uz: "Qur'on, Al-Baqara surasi, 185-oyat", en: "Qur'an, Surah Al-Baqarah 2:185", ru: 'Коран, сура Аль-Бакара, аят 185' },
  wr_04: { uz: "Hanafiy fiqhi • Al-Hidoya (Zakot kitobi)", en: 'Hanafi Fiqh • Al-Hidayah (Book of Zakat)', ru: 'Ханафитский фикх • Аль-Хидая (Книга закята)' },
  wr_05: { uz: "Hanafiy fiqhi • Muxtasarul Viqoya", en: 'Hanafi Fiqh • Mukhtasar al-Wiqayah', ru: 'Ханафитский фикх • Мухтасар аль-Викая' },
  wr_06: { uz: 'Sahihul Buxoriy, 1503-hadis', en: 'Sahih al-Bukhari, Hadith 1503', ru: 'Сахих аль-Бухари, хадис 1503' },
  wr_07: { uz: 'Sahihi Muslim, 597-hadis', en: 'Sahih Muslim, Hadith 597', ru: 'Сахих Муслим, хадис 597' },
  wr_08: { uz: 'Sahihul Buxoriy, 1899-hadis', en: 'Sahih al-Bukhari, Hadith 1899', ru: 'Сахих аль-Бухари, хадис 1899' },
  wr_09: { uz: 'Sahihul Buxoriy, 6407-hadis', en: 'Sahih al-Bukhari, Hadith 6407', ru: 'Сахих аль-Бухари, хадис 6407' },
  wr_10: { uz: 'Sahihul Buxoriy, 6306-hadis', en: 'Sahih al-Bukhari, Hadith 6306', ru: 'Сахих аль-Бухари, хадис 6306' },
  wr_11: { uz: 'Sahihul Buxoriy, 2736-hadis', en: 'Sahih al-Bukhari, Hadith 2736', ru: 'Сахих аль-Бухари, хадис 2736' },
  wr_12: { uz: 'Sahihi Muslim, 1162-hadis', en: 'Sahih Muslim, Hadith 1162', ru: 'Сахих Муслим, хадис 1162' },
};

export const TOTAL_KNOWLEDGE_QUESTIONS = RAW_QUESTIONS.length;

export function getLocalizedKnowledgeQuestions(
  lang: AppLanguage,
  deck?: QuizDeckId
): LocalizedQuizQuestion[] {
  const source = deck ? RAW_QUESTIONS.filter((q) => q.deck === deck) : RAW_QUESTIONS;
  return source.map((item) => {
    const srcObj = item.src || EXISTING_QUESTION_SOURCES[item.id] || {
      uz: 'Islomiy manbalar',
      en: 'Islamic sources',
      ru: 'Исламские источники',
    };
    if (lang === 'en') {
      return {
        id: item.id,
        deck: item.deck,
        question: item.en.q,
        options: item.en.opts,
        correctIndex: item.correctIndex,
        explanation: item.en.exp,
        source: srcObj.en,
      };
    }
    if (lang === 'ru') {
      return {
        id: item.id,
        deck: item.deck,
        question: item.ru.q,
        options: item.ru.opts,
        correctIndex: item.correctIndex,
        explanation: item.ru.exp,
        source: srcObj.ru,
      };
    }
    if (lang === 'uz_cyr') {
      return {
        id: item.id,
        deck: item.deck,
        question: latinToCyrillicUz(item.uz.q),
        options: [
          latinToCyrillicUz(item.uz.opts[0]),
          latinToCyrillicUz(item.uz.opts[1]),
          latinToCyrillicUz(item.uz.opts[2]),
          latinToCyrillicUz(item.uz.opts[3]),
        ],
        correctIndex: item.correctIndex,
        explanation: latinToCyrillicUz(item.uz.exp),
        source: latinToCyrillicUz(srcObj.uz),
      };
    }
    return {
      id: item.id,
      deck: item.deck,
      question: item.uz.q,
      options: item.uz.opts,
      correctIndex: item.correctIndex,
      explanation: item.uz.exp,
      source: srcObj.uz,
    };
  });
}
