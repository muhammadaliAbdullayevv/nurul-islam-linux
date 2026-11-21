import { AppLanguage } from '../types';

export interface LocalizedText {
  uz_lat: string;
  uz_cyr: string;
  en: string;
  ru: string;
}

export interface WuduStep {
  id: string;
  step: number;
  repeat?: number;
  isFard: boolean;
  title: LocalizedText;
  summary: LocalizedText;
  mistakeTip?: LocalizedText;
  arabic?: string;
  translit?: LocalizedText;
  meaning?: LocalizedText;
}

export type PostureKey = 'takbir' | 'qiyam' | 'ruku' | 'qawmah' | 'sujud' | 'jalsa' | 'qada';

export interface PrayerPostureStep {
  id: string;
  step: number;
  posture: PostureKey;
  title: LocalizedText;
  summary: LocalizedText;
  maleNote: LocalizedText;
  femaleNote: LocalizedText;
  mistakeTip: LocalizedText;
  arabic: string;
  translit: LocalizedText;
  meaning: LocalizedText;
}

export interface QiyamRecitationItem {
  id: 'sano' | 'fatiha' | 'ikhlas' | 'kawthar';
  label: LocalizedText;
  surahNumber?: number;
  ayahCount?: number;
  arabic: string;
  translit: LocalizedText;
  meaning: LocalizedText;
}

export interface QadaDuaItem {
  id: 'tahiyyat' | 'salawat' | 'robbana' | 'qunut';
  label: LocalizedText;
  arabic: string;
  translit: LocalizedText;
  meaning: LocalizedText;
}

export interface PrayerRakatSpec {
  id: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  name: LocalizedText;
  breakdown: Array<{ label: LocalizedText; count: number; tone: 'sunnah' | 'fard' | 'witr' }>;
  total: number;
  note: LocalizedText;
  rakatSteps: Array<{
    rakat: number;
    badge: LocalizedText;
    actions: LocalizedText;
  }>;
}

export const WUDU_STEPS: WuduStep[] = [
  {
    id: 'niyyah',
    step: 1,
    isFard: false,
    title: {
      uz_lat: 'Niyat va Bismillah',
      uz_cyr: 'Ният ва Бисмиллаҳ',
      en: 'Intention & Bismillah',
      ru: 'Намерение и Бисмиллях',
    },
    summary: {
      uz_lat: 'Qalbda tahorat olishni niyat qilib, "Bismillahir rohmanir rohim" deb boshlanadi.',
      uz_cyr: 'Қалбда таҳорат олишни ният қилиб, «Бисмиллаҳир роҳманир роҳим» деб бошланади.',
      en: 'Make sincere intention in your heart for Wudu and begin by saying Bismillah.',
      ru: 'Сделайте искреннее намерение совершить тахарат и начните со слов «Бисмиллях».',
    },
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    translit: {
      uz_lat: 'Bismillahir rohmanir rohim',
      uz_cyr: 'Бисмиллаҳир роҳманир роҳим',
      en: 'Bismillahir-Rahmanir-Rahim',
      ru: 'Бисмилляхир-Рахманир-Рахим',
    },
    meaning: {
      uz_lat: 'Mehribon va rahmli Allohning nomi bilan',
      uz_cyr: 'Меҳрибон ва раҳмли Аллоҳнинг номи билан',
      en: 'In the name of Allah, the Entirely Merciful, the Especially Merciful',
      ru: 'Во имя Аллаха Милостивого, Милосердного',
    },
  },
  {
    id: 'hands',
    step: 2,
    repeat: 3,
    isFard: false,
    title: {
      uz_lat: 'Qo‘llarni bandigacha yuvish',
      uz_cyr: 'Қўлларни бандигача ювиш',
      en: 'Wash Both Hands to Wrists',
      ru: 'Омыть кисти рук',
    },
    summary: {
      uz_lat: 'Avval o‘ng, so‘ng chap qo‘l panjalari va barmoqlar orasi 3 marta yaxshilab yuviladi.',
      uz_cyr: 'Аввал ўнг, сўнг чап қўл панжалари ва бармоқлар ораси 3 марта яхшилаб ювилади.',
      en: 'Wash both hands up to the wrists three times, rubbing carefully between all fingers.',
      ru: 'Трижды вымойте правую, затем левую кисть до запястий, тщательно промывая между пальцами.',
    },
    mistakeTip: {
      uz_lat: 'Uzuk yoki soat ostiga suv yetmay qolishidan ehtiyot bo‘ling — uzukni qimirlatib yuving.',
      uz_cyr: 'Узук ёки соат остига сув етмай қолишидан эҳтиёт бўлинг — узукни қимирлатиб ювинг.',
      en: 'Shift tight rings or watches so water reaches every part of the skin beneath.',
      ru: 'Проворачивайте кольца и снимите/сдвиньте часы, чтобы вода попала на всю кожу.',
    },
  },
  {
    id: 'mouth',
    step: 3,
    repeat: 3,
    isFard: false,
    title: {
      uz_lat: 'Og‘izni chayish (Mazmaza)',
      uz_cyr: 'Оғизни чайиш (Мазмаза)',
      en: 'Rinse the Mouth',
      ru: 'Полоскание рта',
    },
    summary: {
      uz_lat: 'O‘ng qo‘l bilan suv olib og‘iz 3 marta yaxshilab chayiladi (ro‘zador emas holda g‘arg‘ara qilinadi).',
      uz_cyr: 'Ўнг қўл билан сув олиб оғиз 3 марта яхшилаб чайилади (рўзадор эмас ҳолда ғарғара қилинади).',
      en: 'Take water with your right hand and rinse your mouth thoroughly three times.',
      ru: 'Набирая воду правой рукой, трижды тщательно прополощите рот.',
    },
    mistakeTip: {
      uz_lat: 'Ro‘za tutgan paytda tomoqqa suv ketib qolmasligi uchun chuqur g‘arg‘ara qilmang.',
      uz_cyr: 'Рўза тутган пайтда томоққа сув кетиб қолмаслиги учун чуқур ғарғара қилманг.',
      en: 'When fasting, rinse gently without deep gargling so water is not swallowed.',
      ru: 'Во время поста полощите аккуратно, не запрокидывая голову для глубокого полоскания горла.',
    },
  },
  {
    id: 'nose',
    step: 4,
    repeat: 3,
    isFard: false,
    title: {
      uz_lat: 'Burunni chayish (Istinshoq)',
      uz_cyr: 'Бурунни чайиш (Истиншоқ)',
      en: 'Rinse the Nostrils',
      ru: 'Промывание носа',
    },
    summary: {
      uz_lat: 'O‘ng qo‘l bilan burunga suv tortib, chap qo‘l bilan 3 marta qoqib tozalanadi.',
      uz_cyr: 'Ўнг қўл билан бурунга сув тортиб, чап қўл билан 3 марта қоқиб тозаланади.',
      en: 'Sniff water gently into the nostrils with the right hand and blow out with the left 3 times.',
      ru: 'Правой рукой трижды наберите воду в нос и мягко высморкайтесь левой рукой.',
    },
  },
  {
    id: 'face',
    step: 5,
    repeat: 3,
    isFard: true,
    title: {
      uz_lat: 'Yuzni yuvish (Farz)',
      uz_cyr: 'Юзни ювиш (Фарз)',
      en: 'Wash the Entire Face (Fard)',
      ru: 'Омыть лицо (Фард)',
    },
    summary: {
      uz_lat: 'Soch chiqqan joydan iyak ostigacha, bir quloq yumshog‘idan ikkinchisigacha 3 marta yuviladi.',
      uz_cyr: 'Соч чиққан жойдан ияк остигача, бир қулоқ юмшоғидан иккинчисигача 3 марта ювилади.',
      en: 'Wash the whole face from hairline to below the chin and ear to ear three times.',
      ru: 'Трижды омойте лицо от линии роста волос до подбородка и от одного уха до другого.',
    },
    mistakeTip: {
      uz_lat: 'Peshona chetlari, qosh usti va iyak osti quruq qolib ketmasin; suvni yuzga qattiq urmang.',
      uz_cyr: 'Пешона четлари, қош усти ва ияк ости қуруқ қолиб кетмасин; сувни юзга қаттиқ урманг.',
      en: 'Do not splash forcefully; gently spread water across temples, eyebrows, and under the chin.',
      ru: 'Не плещите водой резко; мягко распределите воду по вискам и под подбородком.',
    },
  },
  {
    id: 'arms',
    step: 6,
    repeat: 3,
    isFard: true,
    title: {
      uz_lat: 'Qo‘llarni tirsak bilan yuvish (Farz)',
      uz_cyr: 'Қўлларни тирсак билан ювиш (Фарз)',
      en: 'Wash Arms Including Elbows (Fard)',
      ru: 'Омыть руки до локтей (Фард)',
    },
    summary: {
      uz_lat: 'Avval o‘ng qo‘l, so‘ng chap qo‘l barmoq uchidan tirsaklarni ham qo‘shib 3 martadan yuviladi.',
      uz_cyr: 'Аввал ўнг қўл, сўнг чап қўл бармоқ учидан тирсакларни ҳам қўшиб 3 мартадан ювилади.',
      en: 'Wash the right arm then the left arm from fingertips up to and including the elbows 3 times.',
      ru: 'Трижды омойте сначала правую, затем левую руку от кончиков пальцев включая локти.',
    },
    mistakeTip: {
      uz_lat: 'Tirsak suyagining orqa qismi eng ko‘p quruq qolib ketadigan joy — tirsakdan bir oz yuqorisigacha yuving.',
      uz_cyr: 'Тирсак суягининг орқа қисми энг кўп қуруқ қолиб кетадиган жой — тирсакдан бир оз юқорисигача ювинг.',
      en: 'Be sure to wash slightly past the elbow bone—the back of the elbow is often missed.',
      ru: 'Обязательно мойте чуть выше локтя — задняя часть локтевого сгиба часто остаётся сухой.',
    },
  },
  {
    id: 'head',
    step: 7,
    repeat: 1,
    isFard: true,
    title: {
      uz_lat: 'Boshga mash tortish (Farz)',
      uz_cyr: 'Бошга масҳ тортиш (Фарз)',
      en: 'Wipe Head & Ears (Fard)',
      ru: 'Протирание головы — Масх (Фард)',
    },
    summary: {
      uz_lat: 'Ho‘l kaft bilan bosh (kamida 1/4 qismi) peshonadan ensagacha silanadi, so‘ng quloq va bo‘yin artiladi.',
      uz_cyr: 'Ҳўл кафт билан бош (камида 1/4 қисми) пешонадан энсагача силанади, сўнг қулоқ ва бўйин артилади.',
      en: 'With wet hands wipe gently over the head once, then wipe inside the ears and neck.',
      ru: 'Мокрыми ладонями один раз проведите по голове (минимум четверть), затем протрите уши и шею.',
    },
    mistakeTip: {
      uz_lat: 'Bosh ustidan faqat 1 marta mash tortiladi (qayta-qayta suv quyilmaydi).',
      uz_cyr: 'Бош устидан фақат 1 марта масҳ тортилади (қайта-қайта сув қуйилмайди).',
      en: 'Wipe the head only once with damp hands (do not pour water repeatedly over the head).',
      ru: 'Голову протирают влажными руками только один раз (не нужно лить воду повторно).',
    },
  },
  {
    id: 'feet',
    step: 8,
    repeat: 3,
    isFard: true,
    title: {
      uz_lat: 'Oyoqlarni to‘piq bilan yuvish (Farz)',
      uz_cyr: 'Оёқларни тўпиқ билан ювиш (Фарз)',
      en: 'Wash Feet Including Ankles (Fard)',
      ru: 'Омыть ноги до щиколоток (Фард)',
    },
    summary: {
      uz_lat: 'Avval o‘ng, so‘ng chap oyoq to‘piqlarni qo‘shib va barmoq oralarini ishqalab 3 marta yuviladi.',
      uz_cyr: 'Аввал ўнг, сўнг чап оёқ тўпиқларни қўшиб ва бармоқ ораларини ишқалаб 3 марта ювилади.',
      en: 'Wash the right foot then left foot up to and including the ankles 3 times, cleaning between toes.',
      ru: 'Трижды омойте сначала правую, затем левую ногу включая щиколотки и между пальцами.',
    },
    mistakeTip: {
      uz_lat: 'Tovon orqasi va to‘piq suyaklari quruq qolib ketmasin; chap qo‘l chinchalog‘i bilan barmoq oralarini yuving.',
      uz_cyr: 'Товон орқаси ва тўпиқ суяклари қуруқ қолиб кетмасин; чап қўл чинчалоғи билан бармоқ ораларини ювинг.',
      en: 'Never leave the back of the heels or ankle bones dry; run your pinky finger between toes.',
      ru: 'Следите, чтобы пятки и косточки щиколоток не оставались сухими; промывайте между пальцами.',
    },
  },
  {
    id: 'dua',
    step: 9,
    isFard: false,
    title: {
      uz_lat: 'Tahoratdan keyingi duo',
      uz_cyr: 'Таҳоратдан кейинги дуо',
      en: 'Dua After Wudu',
      ru: 'Дуа после тахарата',
    },
    summary: {
      uz_lat: 'Tahorat tugagach, qiblaga qarab Shahodat kalimasi va tavba duosini o‘qish sunnatdir.',
      uz_cyr: 'Таҳорат тугагач, қиблага қараб Шаҳодат калимаси ва тавба дуосини ўқиш суннатдир.',
      en: 'Upon finishing Wudu, recite the Shahadah and closing supplication.',
      ru: 'Завершив омовение, желательно произнести шахаду и дуа очищения.',
    },
    arabic:
      'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ • اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ',
    translit: {
      uz_lat:
        "Ashhadu alla ilaha illallohu vahdahu la sharika lah, va ashhadu anna Muhammadan ‘abduhu va rosuluh. Allohummaj‘alni minat-tavvabina vaj‘alni minal-mutatohhirin.",
      uz_cyr:
        'Ашҳаду алла илаҳа иллаллоҳу ваҳдаҳу ла шарика лаҳ, ва ашҳаду анна Муҳаммадан абдуҳу ва росулуҳ. Аллоҳуммажъални минат-таввабина важъални минал-мутатоҳҳирин.',
      en: 'Ashhadu an la ilaha illallahu wahdahu la sharika lah, wa ashhadu anna Muhammadan ‘abduhu wa rasuluh. Allahummaj‘alni minat-tawwabina waj‘alni minal-mutatahhirin.',
      ru: 'Ашхаду алля иляха илляллаху вахдаху ля шарика лях, ва ашхаду анна Мухаммадан абдуху ва расулюх. Аллахуммадж‘альни минат-таввабина вадж‘альни миналь-мутатаххирин.',
    },
    meaning: {
      uz_lat:
        'Guvohlik beramanki, Allohdan o‘zga iloh yo‘q, U yolg‘izdir. Muhammad Uning bandasi va elchisidir. Allohim, meni ko‘p tavba qiluvchilardan va poklanuvchilardan qilgin.',
      uz_cyr:
        'Гувоҳлик бераманки, Аллоҳдан ўзга илоҳ йўқ, У ёлғиздир. Муҳаммад Унинг бандаси ва элчисидир. Аллоҳим, мени кўп тавба қилувчилардан ва покланувчилардан қилгин.',
      en: 'I testify there is no deity worthy of worship except Allah alone, and Muhammad is His servant and messenger. O Allah, make me among the repentant and the purified.',
      ru: 'Свидетельствую, что нет божества, кроме одного Аллаха, и Мухаммад — Его раб и посланник. О Аллах, сделай меня из числа кающихся и очищающихся.',
    },
  },
];

export const WHAT_BREAKS_WUDU: LocalizedText[] = [
  {
    uz_lat: 'Tabiiy yo‘llardan chiqqan narsa (siydik, axlat, yel).',
    uz_cyr: 'Табиий йўллардан чиққан нарса (сийдик, ахлат, ел).',
    en: 'Anything discharged from the private passages (urine, stool, gas).',
    ru: 'Любые естественные выделения (моча, кал, газы).',
  },
  {
    uz_lat: 'Badanning biror joyidan qon yoki yiring chiqib oqishi (Hanafiy mazhabida).',
    uz_cyr: 'Баданнинг бирор жойидан қон ёки йиринг чиқиб оқиши (Ҳанафий мазҳабида).',
    en: 'Flowing blood or pus leaving its wound site (Hanafi school).',
    ru: 'Вытекание крови или гноя за пределы раны (по ханафитскому мазхабу).',
  },
  {
    uz_lat: 'Og‘iz to‘ldirib qusish (o‘qchib chiqishi).',
    uz_cyr: 'Оғиз тўлдириб қусиш.',
    en: 'A mouthful of vomiting.',
    ru: 'Обильная рвота (полным ртом).',
  },
  {
    uz_lat: 'Yonboshlab yoki suyanib chuqur uxlab qolish, hushdan ketish.',
    uz_cyr: 'Ёнбошлаб ёки суяниб чуқур ухлаб қолиш, ҳушдан кетиш.',
    en: 'Deep sleep while lying down/leaning heavily, or fainting.',
    ru: 'Глубокий сон лёжа/с опорой или потеря сознания.',
  },
  {
    uz_lat: 'Namoz ichida yonidagi odam eshitadigan darajada baland kulish.',
    uz_cyr: 'Намоз ичида ёнидаги одам эшитадиган даражада баланд кулиш.',
    en: 'Laughing aloud audibly to others while inside prayer.',
    ru: 'Громкий смех (слышимый окружающим) во время совершения намаза.',
  },
];

export const QIYAM_RECITATIONS: QiyamRecitationItem[] = [
  {
    id: 'sano',
    label: { uz_lat: 'Sano duosi', uz_cyr: 'Сано дуоси', en: 'Sana', ru: 'Сана' },
    arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَىٰ جَدُّكَ وَلَا إِلَٰهَ غَيْرُكَ',
    translit: {
      uz_lat: 'Subhanakallohumma va bihamdika va tabarokasmuka va ta‘ala jadduka va la ilaha g‘oyruk.',
      uz_cyr: 'Субҳанакаллоҳумма ва биҳамдика ва табарокасмука ва таъала жаддука ва ла илаҳа ғойрук.',
      en: 'Subhanakallahumma wa bihamdika wa tabarakasmuka wa ta‘ala jadduka wa la ilaha ghayruk.',
      ru: 'Субханакаллахумма ва бихамдика ва табаракасмука ва та‘аля джаддука ва ля иляха гайрук.',
    },
    meaning: {
      uz_lat: 'Allohim, Sen poksan va Senga hamd bo‘lsin. Isming muborak va shoning oliydir, Sendan o‘zga iloh yo‘q.',
      uz_cyr: 'Аллоҳим, Сен поксан ва Сенга ҳамд бўлсин. Исминг муборак ва шонинг олийдир, Сендан ўзга илоҳ йўқ.',
      en: 'Glory be to You, O Allah, and praise be to You; blessed is Your Name, exalted is Your Majesty, and none has the right to be worshipped but You.',
      ru: 'Пречист Ты, о Аллах, и хвала Тебе! Благословенно имя Твоё, высоко величие Твоё, и нет божества, кроме Тебя.',
    },
  },
  {
    id: 'fatiha',
    label: { uz_lat: 'Fotiha surasi', uz_cyr: 'Фотиҳа сураси', en: 'Al-Fatiha', ru: 'Аль-Фатиха' },
    surahNumber: 1,
    ayahCount: 7,
    arabic:
      'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    translit: {
      uz_lat:
        'Bismillahir rohmanir rohim. Alhamdu lillahi robbil ‘alamin. Ar-rohmanir rohim. Maliki yavmid-din. Iyyaka na‘budu va iyyaka nasta‘in. Ihdinas-sirotol mustaqim. Sirotol-lazina an‘amta ‘alayhim g‘oyril mag‘zubi ‘alayhim valaz-zollin. (Omin)',
      uz_cyr:
        'Бисмиллаҳир роҳманир роҳим. Алҳамду лиллаҳи роббил ъаламин. Ар-роҳманир роҳим. Малики явмид-дин. Ийяка наъбуду ва ийяка настаъин. Иҳдинас-сиротол мустақим. Сиротол-лазина анъамта ъалайҳим ғойрил мағзуби ъалайҳим валаз-золлин. (Омин)',
      en: 'Bismillahir-Rahmanir-Rahim. Al-hamdu lillahi Rabbil-‘alamin. Ar-Rahmanir-Rahim. Maliki yawmid-din. Iyyaka na‘budu wa iyyaka nasta‘in. Ihdinas-siratal-mustaqim. Siratal-ladhina an‘amta ‘alayhim ghayril-maghdubi ‘alayhim walad-dallin. (Amin)',
      ru: 'Бисмилляхир-Рахманир-Рахим. Альхамду лилляхи Раббиль-‘алямин. Ар-Рахманир-Рахим. Малики яумид-дин. Ийяка на‘буду ва ийяка наста‘ин. Ихдинас-сыраталь-мустакым. Сыратал-лязина ан‘амта ‘алейхим гайриль-магдуби ‘алейхим ва ляд-даллин. (Амин)',
    },
    meaning: {
      uz_lat:
        'Olamlar Parvardigori Allohga hamdlar bo‘lsin. U Mehribon, Rahmli, Qiyomat kunining egasidir. Sengagina ibodat qilamiz va Sendangina yordam so‘raymiz. Bizni to‘g‘ri yo‘lga hidoyat qilgin...',
      uz_cyr:
        'Оламлар Парвардигори Аллоҳга ҳамдлар бўлсин. У Меҳрибон, Раҳмли, Қиёмат кунининг эгасидир. Сенгагина ибодат қиламиз ва Сендангина ёрдам сўраймиз. Бизни тўғри йўлга ҳидоят қилгин...',
      en: 'All praise is due to Allah, Lord of the worlds—the Entirely Merciful, Master of the Day of Judgment. You alone we worship and ask for help. Guide us to the straight path...',
      ru: 'Хвала Аллаху, Господу миров, Милостивому, Властелину Дня воздаяния! Тебе одному мы поклоняемся и Тебя одного молим о помощи. Веди нас прямым путём...',
    },
  },
  {
    id: 'ikhlas',
    label: { uz_lat: 'Ixlos surasi', uz_cyr: 'Ихлос сураси', en: 'Al-Ikhlas', ru: 'Аль-Ихляс' },
    surahNumber: 112,
    ayahCount: 4,
    arabic:
      'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
    translit: {
      uz_lat: 'Qul huvallohu ahad. Allohus-somad. Lam yalid va lam yulad. Va lam yakul-lahu kufuvan ahad.',
      uz_cyr: 'Қул ҳуваллоҳу аҳад. Аллоҳус-сомад. Лам ялид ва лам юлад. Ва лам якул-лаҳу куфуван аҳад.',
      en: 'Qul huwallahu ahad. Allahus-samad. Lam yalid wa lam yulad. Wa lam yakun lahu kufuwan ahad.',
      ru: 'Куль хуваллаху ахад. Аллахус-самад. Лям ялид ва лям юляд. Ва лям якуль-ляху куфуван ахад.',
    },
    meaning: {
      uz_lat: 'Ayting: "U Alloh yagonadir. Alloh behojatdir. U tug‘magan va tug‘ilmagandir. Va Unga hech kim teng emasdir."',
      uz_cyr: 'Айтинг: «У Аллоҳ ягонадир. Аллоҳ беҳожатдир. У туғмаган ва туғилмагандир. Ва Унга ҳеч ким тенг эмасдир.»',
      en: 'Say: "He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born, nor is there to Him any equivalent."',
      ru: 'Скажи: «Он — Аллах Единый, Аллах Самодостаточный. Он не родил и не был рождён, и нет никого равного Ему».',
    },
  },
  {
    id: 'kawthar',
    label: { uz_lat: 'Kavsar surasi', uz_cyr: 'Кавсар сураси', en: 'Al-Kawthar', ru: 'Аль-Каусар' },
    surahNumber: 108,
    ayahCount: 3,
    arabic:
      'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ ۝ فَصَلِّ لِرَبِّكَ وَانْحَرْ ۝ إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ',
    translit: {
      uz_lat: 'Inna a‘toynakal-kavsar. Fasolli lirobbika vanhar. Inna shaniaka huval abtar.',
      uz_cyr: 'Инна аътойнакал-кавсар. Фасолли лироббика ванҳар. Инна шаниака ҳувал абтар.',
      en: 'Inna a‘taynakal-kawthar. Fasalli lirabbika wanhar. Inna shani’aka huwal-abtar.',
      ru: 'Инна а‘тайнакаль-каусар. Фасалли лираббика ванхар. Инна шани’ака хуваль-абтар.',
    },
    meaning: {
      uz_lat: 'Albatta, Biz senga Kavsarni ato etdik. Bas, Parvardigoring uchun namoz o‘qi va qurbonlik qil!',
      uz_cyr: 'Албатта, Биз сенга Кавсарни ато этдик. Бас, Парвардигоринг учун намоз ўқи ва қурбонлик қил!',
      en: 'Indeed, We have granted you Al-Kawthar. So pray to your Lord and sacrifice.',
      ru: 'Поистине, Мы даровали тебе Аль-Каусар (обилие). Помолись же Господу твоему и заколи жертву.',
    },
  },
];

export const FULL_QAADA_DUAS: QadaDuaItem[] = [
  {
    id: 'tahiyyat',
    label: { uz_lat: 'Attahiyyot', uz_cyr: 'Аттаҳийёт', en: 'At-Tahiyyat', ru: 'Ат-Тахият' },
    arabic:
      'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    translit: {
      uz_lat:
        "Attahiyyatu lillahi vas-solavatu vat-toyyibat. Assalamu ‘alayka ayyuhan-nabiyyu va rohmatullohi va barokatuh. Assalamu ‘alayna va ‘ala ‘ibadillahis-solihin. Ashhadu alla ilaha illallohu va ashhadu anna Muhammadan ‘abduhu va rosuluh.",
      uz_cyr:
        'Аттаҳийяту лиллаҳи вас-солавату ват-тоййибат. Ассаламу ъалайка айюҳан-набийю ва роҳматуллоҳи ва барокатуҳ. Ассаламу ъалайна ва ъала ъибадиллаҳис-солиҳин. Ашҳаду алла илаҳа иллаллоҳу ва ашҳаду анна Муҳаммадан ъабдуҳу ва росулуҳ.',
      en: 'At-tahiyyatu lillahi was-salawatu wat-tayyibat. As-salamu ‘alayka ayyuhan-nabiyyu wa rahmatullahi wa barakatuh. As-salamu ‘alayna wa ‘ala ‘ibadillahis-salihin. Ashhadu an la ilaha illallahu wa ashhadu anna Muhammadan ‘abduhu wa rasuluh.',
      ru: 'Ат-тахияту лилляхи вас-салавату ват-таййибат. Ас-саляму ‘алейка айюхан-набийю ва рахматуллахи ва баракятух. Ас-саляму ‘алейна ва ‘аля ‘ибадилляхис-салихин. Ашхаду алля иляха илляллах ва ашхаду анна Мухаммадан ‘абдуху ва расулюх.',
    },
    meaning: {
      uz_lat:
        'Barcha ta’zimlar, duolar va pok amallar Alloh uchundir. Ey Payg‘ambar, sizga salom, Allohning rahmati va barakoti bo‘lsin. Bizga va Allohning solih bandalariga ham salom bo‘lsin. Guvohlik beramanki, Allohdan o‘zga iloh yo‘q va Muhammad Uning bandasi va elchisidir.',
      uz_cyr:
        'Барча таъзимлар, дуолар ва пок амаллар Аллоҳ учундир. Эй Пайғамбар, сизга салом, Аллоҳнинг раҳмати ва баракоти бўлсин. Бизга ва Аллоҳнинг солиҳ бандаларига ҳам салом бўлсин.',
      en: 'All greetings, prayers and pure words are for Allah. Peace, mercy and blessings of Allah be upon you, O Prophet, and upon us and all righteous servants of Allah.',
      ru: 'Все приветствия, молитвы и благие слова принадлежат Аллаху. Мир тебе, о Пророк, милость Аллаха и Его благословение. Мир нам и всем праведным рабам Аллаха.',
    },
  },
  {
    id: 'salawat',
    label: { uz_lat: 'Salovat', uz_cyr: 'Саловат', en: 'Salawat', ru: 'Салават' },
    arabic:
      'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ • اللَّهُمَّ بَارِكْ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
    translit: {
      uz_lat:
        "Allohumma solli ‘ala Muhammadin va ‘ala ali Muhammad, kama sollayta ‘ala Ibrohima va ‘ala ali Ibrohim, innaka hamidum-majid. Allohumma barik ‘ala Muhammadin va ‘ala ali Muhammad, kama barokta ‘ala Ibrohima va ‘ala ali Ibrohim, innaka hamidum-majid.",
      uz_cyr:
        'Аллоҳумма солли ъала Муҳаммадин ва ъала али Муҳаммад, кама соллайта ъала Иброҳима ва ъала али Иброҳим, иннака ҳамидум-мажид. Аллоҳумма барик ъала Муҳаммадин ва ъала али Муҳаммад, кама барокта ъала Иброҳима ва ъала али Иброҳим, иннака ҳамидум-мажид.',
      en: 'Allahumma salli ‘ala Muhammadin wa ‘ala ali Muhammad, kama sallayta ‘ala Ibrahima wa ‘ala ali Ibrahim, innaka Hamidum-Majid. Allahumma barik ‘ala Muhammadin wa ‘ala ali Muhammad, kama barakta ‘ala Ibrahima wa ‘ala ali Ibrahim, innaka Hamidum-Majid.',
      ru: 'Аллахумма салли ‘аля Мухаммадин ва ‘аля али Мухаммад, кяма салляйта ‘аля Ибрахима ва ‘аля али Ибрахим, иннака Хамидум-Маджид. Аллахумма барик ‘аля Мухаммадин ва ‘аля али Мухаммад...',
    },
    meaning: {
      uz_lat:
        'Allohim! Ibrohimga va u zotning oilasiga rahmat yo‘llaganingdek, Muhammadga va u zotning oilasiga ham rahmat va baraka yo‘lla. Albatta, Sen maqtovga sazovor va ulug‘ zotsan.',
      uz_cyr:
        'Аллоҳим! Иброҳимга ва у зотнинг оиласига раҳмат йўллаганингдек, Муҳаммадга ва у зотнинг оиласига ҳам раҳмат ва барака йўлла.',
      en: 'O Allah, send mercy and blessings upon Muhammad and the family of Muhammad as You sent mercy and blessings upon Ibrahim and his family. Truly You are Praiseworthy and Glorious.',
      ru: 'О Аллах, благослови Мухаммада и род Мухаммада, как Ты благословил Ибрахима и род Ибрахима. Поистине, Ты — Достойный хвалы, Славный.',
    },
  },
  {
    id: 'robbana',
    label: { uz_lat: 'Robbana duosi', uz_cyr: 'Роббана дуоси', en: 'Closing Dua', ru: 'Дуа Раббана' },
    arabic:
      'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ • رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ',
    translit: {
      uz_lat:
        "Robbana atina fid-dunya hasanatan va fil axiroti hasanatan va qina ‘azaban-nar. Robbanag‘firli va livalidayya va lilmu’minina yavma yaqumul-hisab.",
      uz_cyr:
        'Роббана атина фид-дуня ҳасанатан ва фил ахироти ҳасанатан ва қина ъазабан-нар. Роббанағфирли ва ливалидайя ва лилмуъминина явма яқумул-ҳисаб.',
      en: 'Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina ‘adhaban-nar. Rabbanaghfir li wa liwalidayya wa lil-mu’minina yawma yaqumul-hisab.',
      ru: 'Раббана атина фид-дунья хасанатан ва филь-ахирати хасанатан ва кына ‘азабан-нар. Раббанагфир ли ва ливалидайя ва лиль-му’минина яума якумуль-хисаб.',
    },
    meaning: {
      uz_lat:
        'Parvardigoro, bizga bu dunyoda ham yaxshilik, oxiratda ham yaxshilik ber va bizni do‘zax azobidan saqla! Hisob kuni meni, ota-onamni va mo‘minlarni mag‘firat qil.',
      uz_cyr:
        'Парвардигоро, бизга бу дунёда ҳам яхшилик, охиратда ҳам яхшилик бер ва бизни дўзах азобидан сақла!',
      en: 'Our Lord, grant us good in this world and good in the Hereafter, and protect us from the punishment of the Fire. Forgive me, my parents, and all believers on the Day of Account.',
      ru: 'Господь наш! Даруй нам добро в этом мире и добро в Последней жизни и защити нас от огня Ада. Прости меня, моих родителей и всех верующих в День расчёта.',
    },
  },
  {
    id: 'qunut',
    label: { uz_lat: 'Qunut (Vitr)', uz_cyr: 'Қунут (Витр)', en: 'Qunut (Witr)', ru: 'Кунут (Витр)' },
    arabic:
      'اللَّهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنَسْتَهْدِيكَ وَنُؤْمِنُ بِكَ وَنَتُوبُ إِلَيْكَ وَنَتَوَكَّلُ عَلَيْكَ وَنُثْنِي عَلَيْكَ الْخَيْرَ كُلَّهُ نَشْكُرُكَ وَلَا نَكْفُرُكَ وَنَخْلَعُ وَنَتْرُكُ مَنْ يَفْجُرُكَ • اللَّهُمَّ إِيَّاكَ نَعْبُدُ وَلَكَ نُصَلِّي وَنَسْجُدُ وَإِلَيْكَ نَسْعَىٰ وَنَحْفِدُ نَرْجُو رَحْمَتَكَ وَنَخْشَىٰ عَذَابَكَ إِنَّ عَذَابَكَ بِالْكُفَّارِ مُلْحِقٌ',
    translit: {
      uz_lat:
        "Allohumma inna nasta‘inuka va nastag‘firuk, va nastahdika va nu’minu bik, va natubu ilayka va natavakkalu ‘alayk, va nusni ‘alaykal-xoyro kullah, nashkuruka va la nakfuruk, va naxla‘u va natruku may-yafjuruk. Allohumma iyyaka na‘budu va laka nusolli va nasjud, va ilayka nas‘a va nahfid, narju rohmataka va naxsha ‘azabak, inna ‘azabaka bil-kuffari mulhiq.",
      uz_cyr:
        'Аллоҳумма инна настаъинука ва настағфирук, ва настаҳдика ва нуъмину бик, ва натубу илайка ва натаваккалу ъалайк, ва нусни ъалайкал-хойро куллаҳ, нашкурука ва ла накфурук, ва нахлаъу ва натруку май-яфжурук. Аллоҳумма ийяка наъбуду ва лака нусолли ва насжуд, ва илайка насъа ва наҳфид, наржу роҳматака ва нахша ъазабак, инна ъазабака бил-куффари мулҳиқ.',
      en: 'Allahumma inna nasta‘inuka wa nastaghfiruk, wa nu’minu bika wa natawakkalu ‘alayk... Allahumma iyyaka na‘budu wa laka nusalli wa nasjud, wa ilayka nas‘a wa nahfid, narju rahmataka wa nakhsha ‘adhabak...',
      ru: 'Аллахумма инна наста‘инука ва настагфирук, ва ну’мину бика ва натаваккалю ‘алейк... Аллахумма ийяка на‘буду ва ляка нусалли ва насджуд...',
    },
    meaning: {
      uz_lat:
        'Allohim, Sendangina madad va mag‘firat so‘raymiz, Senga iymon keltirib tavakkal qilamiz. Sengagina ibodat qilib, Sening uchun namoz o‘qib sajda qilamiz. Rahmatingdan umidvormiz, azobingdan qo‘rqamiz.',
      uz_cyr:
        'Аллоҳим, Сендангина мадад ва мағфират сўраймиз, Сенга иймон келтириб таваккал қиламиз. Сенгагина ибодат қилиб, Сенинг учун намоз ўқиб сажда қиламиз.',
      en: 'O Allah, we seek Your help, forgiveness, and guidance, believe in You and rely on You. You alone we worship and to You we pray and prostrate; we hope for Your mercy and fear Your punishment.',
      ru: 'О Аллах, мы просим Твоей помощи, прощения и руководства, веруем в Тебя и уповаем на Тебя. Тебе одному поклоняемся, молимся и совершаем земные поклоны.',
    },
  },
];

export const PRAYER_POSTURE_STEPS: PrayerPostureStep[] = [
  {
    id: 'takbir',
    step: 1,
    posture: 'takbir',
    title: {
      uz_lat: 'Niyat va Takbiri Tahrima',
      uz_cyr: 'Ният ва Такбири Таҳрима',
      en: 'Intention & Opening Takbir',
      ru: 'Намерение и Такбир Тахрима',
    },
    summary: {
      uz_lat: 'Qiblaga yuzlanib namoz niyat qilinadi va "Allohu Akbar" deb namozga kiriladi.',
      uz_cyr: 'Қиблага юзланиб намоз ният қилинади ва «Аллоҳу Акбар» деб намозга кирилади.',
      en: 'Face the Qibla, make intention for the prayer, raise your hands and say Allahu Akbar.',
      ru: 'Встаньте лицом к Кибле, сделайте намерение и поднимите руки со словами «Аллаху Акбар».',
    },
    maleNote: {
      uz_lat: 'Bosh barmoqlar quloq yumshog‘i barobariga ko‘tariladi, kaftlar qiblaga qaraydi.',
      uz_cyr: 'Бош бармоқлар қулоқ юмшоғи баробарига кўтарилади, кафтлар қиблага қарайди.',
      en: 'Raise hands until thumbs align with earlobes; palms face Qibla.',
      ru: 'Большие пальцы на уровне мочек ушей, ладони к Кибле.',
    },
    femaleNote: {
      uz_lat: 'Qo‘llar yelka barobarigacha ko‘tariladi, yenglar bilan yopilgan holda.',
      uz_cyr: 'Қўллар елка баробаригача кўтарилади, енглар билан ёпилган ҳолда.',
      en: 'Raise hands smoothly up to shoulder level.',
      ru: 'Руки поднимаются только до уровня плеч.',
    },
    mistakeTip: {
      uz_lat: 'Jamoat namozida imomdan oldin takbir aytib yoki harakat qilib yubormang.',
      uz_cyr: 'Жамоат намозида имомдан олдин такбир айтиб ёки ҳаракат қилиб юборманг.',
      en: 'In congregation, never begin Takbir or any movement ahead of the Imam.',
      ru: 'В коллективном намазе никогда не начинайте такбир или движения раньше имама.',
    },
    arabic: 'اللَّهُ أَكْبَرُ',
    translit: { uz_lat: 'Allohu Akbar', uz_cyr: 'Аллоҳу Акбар', en: 'Allahu Akbar', ru: 'Аллаху Акбар' },
    meaning: { uz_lat: 'Alloh eng ulug‘dir', uz_cyr: 'Аллоҳ энг улуғдир', en: 'Allah is the Greatest', ru: 'Аллах Превелик' },
  },
  {
    id: 'qiyam',
    step: 2,
    posture: 'qiyam',
    title: {
      uz_lat: 'Qiyom (Sano, Fotiha va Zami sura)',
      uz_cyr: 'Қиём (Сано, Фотиҳа ва Зами сура)',
      en: 'Qiyam (Standing & Recitation)',
      ru: 'Кыям (Чтение Саны, Фатихи и суры)',
    },
    summary: {
      uz_lat: 'Qo‘llar bog‘lanib Sano, A‘uzu-Bismillah, Fotiha surasi va bir qisqa sura o‘qiladi (to‘liq matn va audio pastda).',
      uz_cyr: 'Қўллар боғланиб Сано, Аъузу-Бисмиллаҳ, Фотиҳа сураси ва бир қисқа сура ўқилади (тўлиқ матн ва аудио пастда).',
      en: 'Fold hands and recite Sana, A‘uzu-Bismillah, Surah Al-Fatiha, and a short Surah (full text & audio below).',
      ru: 'Сложите руки и прочитайте Сану, Фатиху и короткую суру (полный текст и аудио ниже).',
    },
    maleNote: {
      uz_lat: 'O‘ng kaft chap qo‘l ustiga qo‘yilib kindik ostida bog‘lanadi; oyoqlar orasi ~4 barmoq.',
      uz_cyr: 'Ўнг кафт чап қўл устига қўйилиб киндик остида боғланади; оёқлар ораси ~4 бармоқ.',
      en: 'Right hand over left below the navel; feet comfortably apart.',
      ru: 'Правая кисть поверх левой ниже пупка.',
    },
    femaleNote: {
      uz_lat: 'O‘ng kaft chap qo‘l ustiga qo‘yilib ko‘krak ustida yengil tutiladi; tovonlar yaqin.',
      uz_cyr: 'Ўнг кафт чап қўл устига қўйилиб кўкрак устида енгил тутилади; товонлар яқин.',
      en: 'Place right hand gently over left across the chest; feet kept closer together.',
      ru: 'Правая кисть кладётся на левую на груди.',
    },
    mistakeTip: {
      uz_lat: 'Qiyomda ko‘zlar sajda qilinadigan joyga tikiladi; uyoq-buyoqqa qaralmaydi.',
      uz_cyr: 'Қиёмда кўзлар сажда қилинадиган жойга тикилади; уёқ-буёққа қаралмайди.',
      en: 'Keep gaze fixed gently on the place of Sujud—avoid looking around.',
      ru: 'Во время чтения взгляд направлен на место земного поклона.',
    },
    arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَىٰ جَدُّكَ وَلَا إِلَٰهَ غَيْرُكَ',
    translit: {
      uz_lat: 'Subhanakallohumma va bihamdika va tabarokasmuka va ta‘ala jadduka va la ilaha g‘oyruk.',
      uz_cyr: 'Субҳанакаллоҳумма ва биҳамдика ва табарокасмука ва таъала жаддука ва ла илаҳа ғойрук.',
      en: 'Subhanakallahumma wa bihamdika wa tabarakasmuka wa ta‘ala jadduka wa la ilaha ghayruk.',
      ru: 'Субханакаллахумма ва бихамдика ва табаракасмука ва та‘аля джаддука ва ля иляха гайрук.',
    },
    meaning: {
      uz_lat: 'Allohim, Sen poksan va Senga hamd bo‘lsin. Isming muborak va shoning oliydir.',
      uz_cyr: 'Аллоҳим, Сен поксан ва Сенга ҳамд бўлсин. Исминг муборак ва шонинг олийдир.',
      en: 'Glory be to You, O Allah, and praise be to You; blessed is Your Name and exalted is Your Majesty.',
      ru: 'Пречист Ты, о Аллах, и хвала Тебе!',
    },
  },
  {
    id: 'ruku',
    step: 3,
    posture: 'ruku',
    title: {
      uz_lat: 'Ruku (Egilish)',
      uz_cyr: 'Руку (Эгилиш)',
      en: 'Ruku (Bowing)',
      ru: 'Руку (Поясной поклон)',
    },
    summary: {
      uz_lat: '"Allohu Akbar" deb egilinadi va 3 marta "Subhana Robbiyal-Azim" aytiladi.',
      uz_cyr: '«Аллоҳу Акбар» деб эгилинади ва 3 марта «Субҳана Роббиял-Азим» айтилади.',
      en: 'Say Allahu Akbar while bowing, and say "Subhana Rabbiyal-Adheem" 3 times.',
      ru: 'Произнесите «Аллаху Акбар», поклонитесь и трижды скажите «Субхана Раббияль-Азым».',
    },
    maleNote: {
      uz_lat: 'Orqa va bosh bir tekisda bo‘ladi, barmoqlar ochilib tizzalar mahkam ushlanadi.',
      uz_cyr: 'Орқа ва бош бир текисда бўлади, бармоқлар очилиб тиззалар маҳкам ушланади.',
      en: 'Back flat parallel to floor; grip knees firmly with fingers spread.',
      ru: 'Спина прямая, пальцы рук обхватывают колени.',
    },
    femaleNote: {
      uz_lat: 'Biroz kamroq egilinadi, qo‘llar tizzaga yengil qo‘yiladi va tirsaklar biqinga yaqin tutiladi.',
      uz_cyr: 'Бироз камроқ эгилинади, қўллар тиззага енгил қўйилади ва тирсаклар биқинга яқин тутилади.',
      en: 'Bow moderately with fingers kept together on knees and elbows tucked near sides.',
      ru: 'Наклон чуть меньше, пальцы сомкнуты на коленях, локти прижаты к бокам.',
    },
    mistakeTip: {
      uz_lat: 'Tizzalarni bukib yoki boshni juda past/baland qilib olmang — belingiz tekis bo‘lsin.',
      uz_cyr: 'Тиззаларни букиб ёки бошни жуда паст/баланд қилиб олманг — белингиз текис бўлсин.',
      en: 'Avoid bending knees forward or craning the neck upward; keep back straight.',
      ru: 'Не сгибайте колени и не задирайте голову — держите спину ровно.',
    },
    arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
    translit: {
      uz_lat: 'Subhana Robbiyal-Azim (3 marta)',
      uz_cyr: 'Субҳана Роббиял-Азим (3 марта)',
      en: 'Subhana Rabbiyal-Adheem (3 times)',
      ru: 'Субхана Раббияль-Азым (3 раза)',
    },
    meaning: {
      uz_lat: 'Ulug‘ Parvardigorim barcha nuqsonlardan pokdir',
      uz_cyr: 'Улуғ Парвардигорим барча нуқсонлардан покдир',
      en: 'Glory be to my Lord, the Almighty',
      ru: 'Пречист мой Великий Господь',
    },
  },
  {
    id: 'qawmah',
    step: 4,
    posture: 'qawmah',
    title: {
      uz_lat: 'Qavma (Rukudan tiklanish)',
      uz_cyr: 'Қавма (Рукудан тикланиш)',
      en: 'Qawmah (Standing Upright)',
      ru: 'Кавма (Выпрямление)',
    },
    summary: {
      uz_lat: 'Rukudan qaddini tiklab, tasbeh va hamd aytiladi (ta‘dili arkon — xotirjam to‘xtash).',
      uz_cyr: 'Рукудан қаддини тиклаб, тасбеҳ ва ҳамд айтилади.',
      en: 'Rise smoothly until completely upright and pause briefly (tuma’ninah) before sujud.',
      ru: 'Выпрямитесь полностью и на мгновение замрите перед земным поклоном.',
    },
    maleNote: {
      uz_lat: 'Qo‘llar yon tomonga tushirilib tik turiladi (imom ortida faqat "Robbana lakal hamd" aytiladi).',
      uz_cyr: 'Қўллар ён томонга туширилиб тик турилади.',
      en: 'Stand upright with arms at sides; behind Imam say only "Rabbana lakal-hamd".',
      ru: 'Руки опущены по швам; за имамом произносят только «Раббана лякаль-хамд».',
    },
    femaleNote: {
      uz_lat: 'Qo‘llar yon tomonda xotirjam tutilib to‘liq tik turiladi.',
      uz_cyr: 'Қўллар ён томонда хотиржам тутилиб тўлиқ тик турилади.',
      en: 'Stand upright calmly with arms lowered at sides.',
      ru: 'Спокойно выпрямитесь, опустив руки по бокам.',
    },
    mistakeTip: {
      uz_lat: 'Rukudan yarim ko‘tarilib darrov sajdaga tushib ketmang — bel to‘liq tiklanishi vojibdir.',
      uz_cyr: 'Рукудан ярим кўтарилиб дарров саждага тушиб кетманг — бел тўлиқ тикланиши вожибдир.',
      en: 'Never rush down into Sujud before your spine is fully upright and still.',
      ru: 'Не торопитесь опускаться в саджду, не выпрямив спину полностью.',
    },
    arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ • رَبَّنَا لَكَ الْحَمْدُ',
    translit: {
      uz_lat: "Sami‘allohu liman hamidah. Robbana lakal hamd.",
      uz_cyr: 'Самиъаллоҳу лиман ҳамидаҳ. Роббана лакал ҳамд.',
      en: 'Sami‘allahu liman hamidah. Rabbana lakal-hamd.',
      ru: 'Сами‘аллаху лиман хамидах. Раббана лякаль-хамд.',
    },
    meaning: {
      uz_lat: 'Alloh O‘ziga hamd aytuvchini eshitadi. Parvardigoro, hamd Sengagina xosdir!',
      uz_cyr: 'Аллоҳ Ўзига ҳамд айтувчини эшитади. Парвардигоро, ҳамд Сенгагина хосдир!',
      en: 'Allah hears whoever praises Him. Our Lord, to You belongs all praise.',
      ru: 'Аллах слышит того, кто восхваляет Его. Господь наш, Тебе хвала!',
    },
  },
  {
    id: 'sujud',
    step: 5,
    posture: 'sujud',
    title: {
      uz_lat: 'Sajda (Ikki marta)',
      uz_cyr: 'Сажда (Икки марта)',
      en: 'Sujud (Prostration x2)',
      ru: 'Саджда (Земной поклон x2)',
    },
    summary: {
      uz_lat: 'Avval tizzalar, so‘ng kaftlar, burun va peshona yerga qo‘yiladi. "Subhana Robbiyal-A‘la" 3 marta aytiladi.',
      uz_cyr: 'Аввал тиззалар, сўнг кафтлар, бурун ва пешона ерга қўйилади. «Субҳана Роббиял-Аъла» 3 марта айтилади.',
      en: 'Touch knees, palms, nose and forehead to the ground; recite Subhana Rabbiyal-A‘la 3 times.',
      ru: 'Коснитесь пола коленями, ладонями, носом и лбом; трижды скажите «Субхана Раббияль-А‘ля».',
    },
    maleNote: {
      uz_lat: 'Tirsaklar yerdan va qorindan ko‘tarib tutiladi; oyoq barmoqlari qiblaga bukiladi.',
      uz_cyr: 'Тирсаклар ердан ва қориндан кўтариб тутилади; оёқ бармоқлари қиблага букилади.',
      en: 'Keep forearms lifted off the ground and elbows away from sides; toes bent facing Qibla.',
      ru: 'Локти приподняты от пола и отведены от боков, пальцы ног направлены к Кибле.',
    },
    femaleNote: {
      uz_lat: 'Yig‘iq holda sajda qilinadi: tirsaklar yerga yaqin/qo‘yilgan, qorin songa yaqin bo‘ladi.',
      uz_cyr: 'Йиғиқ ҳолда сажда қилинади: тирсаклар ерга яқин/қўйилган, қорин сонга яқин бўлади.',
      en: 'Keep posture compact: arms lowered gently toward floor and torso close to thighs.',
      ru: 'Поза собрана: предплечья опущены на пол, корпус приближен к бёдрам.',
    },
    mistakeTip: {
      uz_lat: 'Sajdada ikki oyoq uchi yerdan ko‘tarilib ketmasin, burun uchi peshona bilan birga yerga tegsin.',
      uz_cyr: 'Саждада икки оёқ учи ердан кўтарилиб кетмасин, бурун учи пешона билан бирга ерга тегсин.',
      en: 'Keep both feet planted (never lifted into the air) and touch both nose and forehead cleanly.',
      ru: 'Следите, чтобы носки ног не отрывались от пола, а нос и лоб касались коврика.',
    },
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
    translit: {
      uz_lat: 'Subhana Robbiyal-A‘la (3 marta)',
      uz_cyr: 'Субҳана Роббиял-Аъла (3 марта)',
      en: 'Subhana Rabbiyal-A‘la (3 times)',
      ru: 'Субхана Раббияль-А‘ля (3 раза)',
    },
    meaning: {
      uz_lat: 'Eng Oliy Parvardigorim barcha nuqsonlardan pokdir',
      uz_cyr: 'Энг Олий Парвардигорим барча нуқсонлардан покдир',
      en: 'Glory be to my Lord, the Most High',
      ru: 'Пречист мой Всевышний Господь',
    },
  },
  {
    id: 'jalsa',
    step: 6,
    posture: 'jalsa',
    title: {
      uz_lat: 'Jalsa (Ikki sajda orasi)',
      uz_cyr: 'Жалса (Икки сажда ораси)',
      en: 'Jalsa (Sitting Between Prostrations)',
      ru: 'Джальса (Сидение между поклонами)',
    },
    summary: {
      uz_lat: '"Allohu Akbar" deb ko‘tarilib bir nafas xotirjam o‘tiriladi, so‘ng ikkinchi sajdaga boriladi.',
      uz_cyr: '«Аллоҳу Акбар» деб кўтарилиб бир нафас хотиржам ўтирилади, сўнг иккинчи саждага борилади.',
      en: 'Sit upright peacefully between the two sajdahs and ask forgiveness before the second sujud.',
      ru: 'Поднимитесь со словами «Аллаху Акбар», спокойно присядьте, затем совершите второй поклон.',
    },
    maleNote: {
      uz_lat: 'Chap oyoq ustiga o‘tirilib, o‘ng oyoq barmoqlari qiblaga tik qilinadi.',
      uz_cyr: 'Чап оёқ устига ўтирилиб, ўнг оёқ бармоқлари қиблага тик қилинади.',
      en: 'Sit on the left foot with the right foot upright, toes toward Qibla.',
      ru: 'Сядьте на левую ступню, правую ступню поставьте вертикально.',
    },
    femaleNote: {
      uz_lat: 'Oyoqlar o‘ng tomonga chiqarilib chap yonboshga qulay o‘tiriladi.',
      uz_cyr: 'Оёқлар ўнг томонга чиқарилиб чап ёнбошга қулай ўтирилади.',
      en: 'Sit comfortably tilting toward the left hip with both feet tucked toward the right.',
      ru: 'Обе стопы выводятся вправо, сидение на левом бедре (таваррук).',
    },
    mistakeTip: {
      uz_lat: 'Birinchi sajdadan to‘liq o‘tirib ulgurmasdan ikkinchi sajdaga shoshilmang.',
      uz_cyr: 'Биринчи саждадан тўлиқ ўтириб улгурмасдан иккинчи саждага шошилманг.',
      en: 'Do not rock halfway between prostrations; sit upright for a calm pause.',
      ru: 'Обязательно полностью выпрямьте спину в сидении между двумя садждами.',
    },
    arabic: 'رَبِّ اغْفِرْ لِي',
    translit: {
      uz_lat: 'Robbig‘firli (mag‘firat so‘rash)',
      uz_cyr: 'Роббиғфирли (мағфират сўраш)',
      en: 'Rabbighfir li (My Lord, forgive me)',
      ru: 'Раббигфирли (Господь, прости меня)',
    },
    meaning: {
      uz_lat: 'Parvardigorim, meni mag‘firat qilgin',
      uz_cyr: 'Парвардигорим, мени мағфират қилгин',
      en: 'O my Lord, forgive me',
      ru: 'Господь мой, прости меня',
    },
  },
  {
    id: 'qada',
    step: 7,
    posture: 'qada',
    title: {
      uz_lat: 'Qa‘da (Attahiyyot, Salovat) va Salom',
      uz_cyr: 'Қаъда (Аттаҳийёт, Саловат) ва Салом',
      en: 'Tashahhud, Salawat & Salam',
      ru: 'Ташаххуд, Салават и Салям',
    },
    summary: {
      uz_lat: 'Oxirgi rakatda Attahiyyot, Salovat va Robbana duolari to‘liq o‘qilib, o‘ng va chap yelkaga salom beriladi (to‘liq duolar pastda).',
      uz_cyr: 'Охирги ракатда Аттаҳийёт, Саловат ва Роббана дуолари тўлиқ ўқилиб, ўнг ва чап елкага салом берилади (тўлиқ дуолар пастда).',
      en: 'In final sitting recite full At-Tahiyyat, Salawat Ibrahimiyyah and closing dua, then give Salam right and left (full texts below).',
      ru: 'В последнем сидении полностью читаются Ат-Тахият, Салават, дуа и даётся салям направо и налево.',
    },
    maleNote: {
      uz_lat: 'Shahodatda "La ilaha"da ko‘rsatkich barmoq ko‘tarilib "illalloh"da tushiriladi.',
      uz_cyr: 'Шаҳодатда «Ла илаҳа»да кўрсаткич бармоқ кўтарилиб «иллаллоҳ»да туширилади.',
      en: 'Raise index finger at "La ilaha" and lower at "illallah" while sitting on the left foot.',
      ru: 'При словах «Ля иляха» указательный палец поднимается и опускается на «илляллах».',
    },
    femaleNote: {
      uz_lat: 'Oyoqlar o‘ng tomonga chiqarilgan holda o‘tirilib Attahiyyot va Salovat o‘qiladi.',
      uz_cyr: 'Оёқлар ўнг томонга чиқарилган ҳолда ўтирилиб Аттаҳийёт ва Саловат ўқилади.',
      en: 'Sit calmly with feet directed right, hands resting softly on thighs.',
      ru: 'Обе ноги справа, кисти мягко на бёдрах; чтение Ташаххуда и салям.',
    },
    mistakeTip: {
      uz_lat: '3 va 4 rakatli namozlarning 2-rakat qa‘dasida Salovat o‘qilmaydi — faqat Attahiyyotdan keyin 3-rakatga turiladi!',
      uz_cyr: '3 ва 4 ракатли намозларнинг 2-ракат қаъдасида Саловат ўқилмайди — фақат Аттаҳийётдан кейин 3-ракатга турилади!',
      en: 'In the first sitting (2nd rakat of 3/4-rakat prayers), stop after At-Tahiyyat and stand up—save Salawat for the final sitting!',
      ru: 'В первом сидении (после 2-го раката из 3/4) читают только Ат-Тахият, а Салават — только в последнем!',
    },
    arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
    translit: {
      uz_lat: "Assalamu alaykum va rohmatulloh (avval o‘ng, so‘ng chap yelkaga)",
      uz_cyr: 'Ассаламу алайкум ва роҳматуллоҳ (аввал ўнг, сўнг чап елкага)',
      en: 'As-salamu alaykum wa rahmatullah (turn right, then left)',
      ru: 'Ас-саляму алейкум ва рахматуллах (сначала направо, затем налево)',
    },
    meaning: {
      uz_lat: 'Sizga tinchlik va Allohning rahmati bo‘lsin',
      uz_cyr: 'Сизга тинчлик ва Аллоҳнинг раҳмати бўлсин',
      en: 'Peace and mercy of Allah be upon you',
      ru: 'Мир вам и милость Аллаха',
    },
  },
];

export const PRAYER_RAKATS: PrayerRakatSpec[] = [
  {
    id: 'fajr',
    name: { uz_lat: 'Bomdod', uz_cyr: 'Бомдод', en: 'Fajr', ru: 'Фаджр' },
    breakdown: [
      { label: { uz_lat: 'Sunnat', uz_cyr: 'Суннат', en: 'Sunnah', ru: 'Сунна' }, count: 2, tone: 'sunnah' },
      { label: { uz_lat: 'Farz', uz_cyr: 'Фарз', en: 'Fard', ru: 'Фард' }, count: 2, tone: 'fard' },
    ],
    total: 4,
    note: {
      uz_lat: 'Jami 4 rakat (2 sunnat + 2 farz). Farzda (imom/yakka erkaklar) qiroat ovoz chiqarib o‘qiladi.',
      uz_cyr: 'Жами 4 ракат (2 суннат + 2 фарз).',
      en: '4 rakats total (2 Sunnah + 2 Fard). Fard recitation is aloud.',
      ru: 'Всего 4 раката (2 Сунна + 2 Фард). В фарде чтение вслух.',
    },
    rakatSteps: [
      {
        rakat: 1,
        badge: { uz_lat: '1-rakat', uz_cyr: '1-ракат', en: '1st Rakat', ru: '1-й ракат' },
        actions: {
          uz_lat: 'Niyat → Takbir → Sano → Fotiha + Zami sura → Ruku → Qavma → 2× Sajda.',
          uz_cyr: 'Ният → Такбир → Сано → Фотиҳа + Зами сура → Руку → Қавма → 2× Сажда.',
          en: 'Intention → Takbir → Sana → Fatiha + Surah → Ruku → Qawmah → 2× Sujud.',
          ru: 'Намерение → Такбир → Сана → Фатиха + сура → Руку → Кавма → 2× Саджда.',
        },
      },
      {
        rakat: 2,
        badge: { uz_lat: '2-rakat (Yakun)', uz_cyr: '2-ракат (Якун)', en: '2nd Rakat (Final)', ru: '2-й ракат (Финал)' },
        actions: {
          uz_lat: 'Bismillah + Fotiha + Zami sura → Ruku → 2× Sajda → Qa‘da (Attahiyyot + Salovat + Robbana) → Salom.',
          uz_cyr: 'Бисмиллаҳ + Фотиҳа + Зами сура → Руку → 2× Сажда → Қаъда (Аттаҳийёт + Саловат + Роббана) → Салом.',
          en: 'Fatiha + Surah → Ruku → 2× Sujud → Final Sitting (At-Tahiyyat + Salawat + Dua) → Salam.',
          ru: 'Фатиха + сура → Руку → 2× Саджда → Финальное сидение (Ат-Тахият + Салават + Дуа) → Салям.',
        },
      },
    ],
  },
  {
    id: 'dhuhr',
    name: { uz_lat: 'Peshin', uz_cyr: 'Пешин', en: 'Dhuhr', ru: 'Зухр' },
    breakdown: [
      { label: { uz_lat: 'Ilk Sunnat', uz_cyr: 'Илк Суннат', en: 'Sunnah', ru: 'Сунна' }, count: 4, tone: 'sunnah' },
      { label: { uz_lat: 'Farz', uz_cyr: 'Фарз', en: 'Fard', ru: 'Фард' }, count: 4, tone: 'fard' },
      { label: { uz_lat: 'So‘nggi Sunnat', uz_cyr: 'Сўнгги Суннат', en: 'Sunnah', ru: 'Сунна' }, count: 2, tone: 'sunnah' },
    ],
    total: 10,
    note: {
      uz_lat: 'Jami 10 rakat (Juma kuni farz o‘rniga 2 rakat Juma farzi o‘qiladi). Barcha rakatlar maxfiy o‘qiladi.',
      uz_cyr: 'Жами 10 ракат. Барча ракатлар махфий ўқилади.',
      en: '10 rakats total (silent recitation). On Friday, replaced by Juma prayer.',
      ru: 'Всего 10 ракатов (читается про себя). В пятницу заменяется Джумой.',
    },
    rakatSteps: [
      {
        rakat: 1,
        badge: { uz_lat: '1-rakat', uz_cyr: '1-ракат', en: '1st Rakat', ru: '1-й ракат' },
        actions: {
          uz_lat: 'Niyat → Takbir → Sano → Fotiha + Zami sura → Ruku → 2× Sajda.',
          uz_cyr: 'Ният → Такбир → Сано → Фотиҳа + Зами сура → Руку → 2× Сажда.',
          en: 'Intention → Takbir → Sana → Fatiha + Surah → Ruku → 2× Sujud.',
          ru: 'Намерение → Такбир → Сана → Фатиха + сура → Руку → 2× Саджда.',
        },
      },
      {
        rakat: 2,
        badge: { uz_lat: '2-rakat', uz_cyr: '2-ракат', en: '2nd Rakat', ru: '2-й ракат' },
        actions: {
          uz_lat: 'Fotiha + Zami sura → Ruku → 2× Sajda → 1-Qa‘da (FAQAT Attahiyyot → Allohu Akbar deb turiladi).',
          uz_cyr: 'Фотиҳа + Зами сура → Руку → 2× Сажда → 1-Қаъда (ФАҚАТ Аттаҳийёт).',
          en: 'Fatiha + Surah → Ruku → 2× Sujud → First Sitting (At-Tahiyyat ONLY, then stand).',
          ru: 'Фатиха + сура → Руку → 2× Саджда → Первое сидение (ТОЛЬКО Ат-Тахият, затем встать).',
        },
      },
      {
        rakat: 3,
        badge: { uz_lat: '3-rakat', uz_cyr: '3-ракат', en: '3rd Rakat', ru: '3-й ракат' },
        actions: {
          uz_lat: 'Farzda: FAQAT Fotiha (zami surasiz!). Sunnatda: Fotiha + Zami sura → Ruku → 2× Sajda.',
          uz_cyr: 'Фарзда: ФАҚАТ Фотиҳа (зами сурасиз!). Суннатда: Фотиҳа + Зами сура → Руку → 2× Сажда.',
          en: 'In Fard: Fatiha ONLY (no extra surah!). In 4 Sunnah: Fatiha + Surah → Ruku → 2× Sujud.',
          ru: 'В фарде: ТОЛЬКО Фатиха (без второй суры!). В 4 Сунне: Фатиха + сура → Руку → 2× Саджда.',
        },
      },
      {
        rakat: 4,
        badge: { uz_lat: '4-rakat (Yakun)', uz_cyr: '4-ракат (Якун)', en: '4th Rakat (Final)', ru: '4-й ракат (Финал)' },
        actions: {
          uz_lat: 'Farzda: faqat Fotiha (Sunnatda: Fotiha+Sura) → Ruku → 2× Sajda → Oxirgi Qa‘da (Attahiyyot+Salovat+Duo) → Salom.',
          uz_cyr: 'Фарзда: фақат Фотиҳа → Руку → 2× Сажда → Охирги Қаъда (Аттаҳийёт+Саловат+Дуо) → Салом.',
          en: 'In Fard: Fatiha only → Ruku → 2× Sujud → Final Sitting (Tahiyyat+Salawat+Dua) → Salam.',
          ru: 'В фарде: только Фатиха → Руку → 2× Саджда → Финальное сидение (Тахият+Салават+Дуа) → Салям.',
        },
      },
    ],
  },
  {
    id: 'asr',
    name: { uz_lat: 'Asr', uz_cyr: 'Аср', en: 'Asr', ru: 'Аср' },
    breakdown: [
      { label: { uz_lat: 'Farz', uz_cyr: 'Фарз', en: 'Fard', ru: 'Фард' }, count: 4, tone: 'fard' },
    ],
    total: 4,
    note: {
      uz_lat: '4 rakat Farz (maxfiy o‘qiladi). Xohlaganlar avval 4 rakat g‘ayri muakkada sunnat o‘qishlari mumkin.',
      uz_cyr: '4 ракат Фарз (махфий ўқилади).',
      en: '4 Fard rakats (silent recitation; same 4-rakat Fard sequence as Dhuhr).',
      ru: '4 раката Фард (читается про себя; порядок как в 4 ракатах фарда Зухра).',
    },
    rakatSteps: [
      {
        rakat: 1,
        badge: { uz_lat: '1-rakat', uz_cyr: '1-ракат', en: '1st Rakat', ru: '1-й ракат' },
        actions: {
          uz_lat: 'Niyat → Takbir → Sano → Fotiha + Zami sura → Ruku → 2× Sajda.',
          uz_cyr: 'Ният → Такбир → Сано → Фотиҳа + Зами сура → Руку → 2× Сажда.',
          en: 'Intention → Takbir → Sana → Fatiha + Surah → Ruku → 2× Sujud.',
          ru: 'Намерение → Такбир → Сана → Фатиха + сура → Руку → 2× Саджда.',
        },
      },
      {
        rakat: 2,
        badge: { uz_lat: '2-rakat', uz_cyr: '2-ракат', en: '2nd Rakat', ru: '2-й ракат' },
        actions: {
          uz_lat: 'Fotiha + Zami sura → Ruku → 2× Sajda → 1-Qa‘da (FAQAT Attahiyyot).',
          uz_cyr: 'Фотиҳа + Зами сура → Руку → 2× Сажда → 1-Қаъда (ФАҚАТ Аттаҳийёт).',
          en: 'Fatiha + Surah → Ruku → 2× Sujud → First Sitting (At-Tahiyyat ONLY).',
          ru: 'Фатиха + сура → Руку → 2× Саджда → Первое сидение (ТОЛЬКО Ат-Тахият).',
        },
      },
      {
        rakat: 3,
        badge: { uz_lat: '3-rakat', uz_cyr: '3-ракат', en: '3rd Rakat', ru: '3-й ракат' },
        actions: {
          uz_lat: 'FAQAT Fotiha (zami surasiz!) → Ruku → 2× Sajda.',
          uz_cyr: 'ФАҚАТ Фотиҳа (зами сурасиз!) → Руку → 2× Сажда.',
          en: 'Fatiha ONLY (no extra surah) → Ruku → 2× Sujud.',
          ru: 'ТОЛЬКО Фатиха (без второй суры) → Руку → 2× Саджда.',
        },
      },
      {
        rakat: 4,
        badge: { uz_lat: '4-rakat (Yakun)', uz_cyr: '4-ракат (Якун)', en: '4th Rakat (Final)', ru: '4-й ракат (Финал)' },
        actions: {
          uz_lat: 'FAQAT Fotiha → Ruku → 2× Sajda → Oxirgi Qa‘da (Attahiyyot+Salovat+Duo) → Salom.',
          uz_cyr: 'ФАҚАТ Фотиҳа → Руку → 2× Сажда → Охирги Қаъда → Салом.',
          en: 'Fatiha ONLY → Ruku → 2× Sujud → Final Sitting (Tahiyyat+Salawat+Dua) → Salam.',
          ru: 'ТОЛЬКО Фатиха → Руку → 2× Саджда → Финальное сидение → Салям.',
        },
      },
    ],
  },
  {
    id: 'maghrib',
    name: { uz_lat: 'Shom', uz_cyr: 'Шом', en: 'Maghrib', ru: 'Магриб' },
    breakdown: [
      { label: { uz_lat: 'Farz', uz_cyr: 'Фарз', en: 'Fard', ru: 'Фард' }, count: 3, tone: 'fard' },
      { label: { uz_lat: 'Sunnat', uz_cyr: 'Суннат', en: 'Sunnah', ru: 'Сунна' }, count: 2, tone: 'sunnah' },
    ],
    total: 5,
    note: {
      uz_lat: 'Jami 5 rakat: avval 3 rakat Farz (1-2-rakatda jahriy), so‘ng 2 rakat Sunnat o‘qiladi.',
      uz_cyr: 'Жами 5 ракат: аввал 3 ракат Фарз, сўнг 2 ракат Суннат ўқилади.',
      en: '5 rakats total: 3 Fard (first 2 aloud) followed by 2 Sunnah.',
      ru: 'Всего 5 ракатов: сначала 3 Фард (первые 2 вслух), затем 2 Сунна.',
    },
    rakatSteps: [
      {
        rakat: 1,
        badge: { uz_lat: '1-rakat', uz_cyr: '1-ракат', en: '1st Rakat', ru: '1-й ракат' },
        actions: {
          uz_lat: 'Niyat → Takbir → Sano → Fotiha + Zami sura → Ruku → 2× Sajda.',
          uz_cyr: 'Ният → Такбир → Сано → Фотиҳа + Зами сура → Руку → 2× Сажда.',
          en: 'Intention → Takbir → Sana → Fatiha + Surah → Ruku → 2× Sujud.',
          ru: 'Намерение → Такбир → Сана → Фатиха + сура → Руку → 2× Саджда.',
        },
      },
      {
        rakat: 2,
        badge: { uz_lat: '2-rakat', uz_cyr: '2-ракат', en: '2nd Rakat', ru: '2-й ракат' },
        actions: {
          uz_lat: 'Fotiha + Zami sura → Ruku → 2× Sajda → 1-Qa‘da (FAQAT Attahiyyot → turiladi).',
          uz_cyr: 'Фотиҳа + Зами сура → Руку → 2× Сажда → 1-Қаъда (ФАҚАТ Аттаҳийёт).',
          en: 'Fatiha + Surah → Ruku → 2× Sujud → First Sitting (At-Tahiyyat ONLY).',
          ru: 'Фатиха + сура → Руку → 2× Саджда → Первое сидение (ТОЛЬКО Ат-Тахият).',
        },
      },
      {
        rakat: 3,
        badge: { uz_lat: '3-rakat (Farz yakuni)', uz_cyr: '3-ракат (Якун)', en: '3rd Rakat (Final)', ru: '3-й ракат (Финал)' },
        actions: {
          uz_lat: 'FAQAT Fotiha (zami surasiz) → Ruku → 2× Sajda → Oxirgi Qa‘da (Attahiyyot+Salovat+Duo) → Salom.',
          uz_cyr: 'ФАҚАТ Фотиҳа → Руку → 2× Сажда → Охирги Қаъда → Салом.',
          en: 'Fatiha ONLY → Ruku → 2× Sujud → Final Sitting (Tahiyyat+Salawat+Dua) → Salam.',
          ru: 'ТОЛЬКО Фатиха → Руку → 2× Саджда → Финальное сидение → Салям.',
        },
      },
    ],
  },
  {
    id: 'isha',
    name: { uz_lat: 'Xufton', uz_cyr: 'Хуфтон', en: 'Isha', ru: 'Иша' },
    breakdown: [
      { label: { uz_lat: 'Farz', uz_cyr: 'Фарз', en: 'Fard', ru: 'Фард' }, count: 4, tone: 'fard' },
      { label: { uz_lat: 'Sunnat', uz_cyr: 'Суннат', en: 'Sunnah', ru: 'Сунна' }, count: 2, tone: 'sunnah' },
      { label: { uz_lat: 'Vitr', uz_cyr: 'Витр', en: 'Witr', ru: 'Витр' }, count: 3, tone: 'witr' },
    ],
    total: 9,
    note: {
      uz_lat: '4 Farz + 2 Sunnat + 3 rakat Vitr vojib (Vitrning 3-rakatida Qunut duosi o‘qiladi!).',
      uz_cyr: '4 Фарз + 2 Суннат + 3 ракат Витр вожиб (3-ракатда Қунут дуоси ўқилади).',
      en: '4 Fard + 2 Sunnah + 3 Witr Wajib (with Qunut Takbir & Dua in the 3rd rakat of Witr).',
      ru: '4 Фард + 2 Сунна + 3 Витр (в 3-м ракате Витра читается дуа Кунут).',
    },
    rakatSteps: [
      {
        rakat: 1,
        badge: { uz_lat: 'Farz 1–2', uz_cyr: 'Фарз 1–2', en: 'Fard 1–2', ru: 'Фард 1–2' },
        actions: {
          uz_lat: '1-rakat: Sano + Fotiha + Zami sura. 2-rakat: Fotiha + Zami sura → 1-Qa‘da (faqat Attahiyyot).',
          uz_cyr: '1-ракат: Сано + Фотиҳа + Сура. 2-ракат: Фотиҳа + Сура → 1-Қаъда (фақат Аттаҳийёт).',
          en: 'Rakat 1: Sana + Fatiha + Surah. Rakat 2: Fatiha + Surah → 1st Sitting (Tahiyyat only).',
          ru: '1-й: Сана + Фатиха + сура. 2-й: Фатиха + сура → 1-е сидение (только Ат-Тахият).',
        },
      },
      {
        rakat: 2,
        badge: { uz_lat: 'Farz 3–4', uz_cyr: 'Фарз 3–4', en: 'Fard 3–4', ru: 'Фард 3–4' },
        actions: {
          uz_lat: '3 va 4-rakatlarda FAQAT Fotiha → 4-rakat oxirida to‘liq Qa‘da → Salom. So‘ng 2 rakat Sunnat.',
          uz_cyr: '3 ва 4-ракатларда ФАҚАТ Фотиҳа → Охирги Қаъда → Салом. Сўнг 2 ракат Суннат.',
          en: 'Rakats 3–4: Fatiha ONLY → Final Sitting → Salam. Then pray 2 rakats Sunnah.',
          ru: '3-й и 4-й ракаты: ТОЛЬКО Фатиха → Финальное сидение → Салям. Затем 2 Сунны.',
        },
      },
      {
        rakat: 3,
        badge: { uz_lat: 'Vitr 3-rakat', uz_cyr: 'Витр 3-ракат', en: 'Witr 3rd Rakat', ru: 'Витр 3-й ракат' },
        actions: {
          uz_lat: 'Vitr 3-rakatida Fotiha + Zami suradan keyin qo‘llar quloqqacha ko‘tarilib "Allohu Akbar" aytiladi, qo‘l bog‘lanib QUNUT DUOSI o‘qiladi → Ruku → Sajda → Qa‘da → Salom.',
          uz_cyr: 'Витр 3-ракатида Фотиҳа + Зами сурадан кейин такбир айтилиб ҚУНУТ ДУОСИ ўқилади → Руку → Сажда → Қаъда → Салом.',
          en: 'In 3rd Witr rakat: after Fatiha + Surah, raise hands saying Allahu Akbar, fold hands and recite DUA AL-QUNUT → Ruku → Sujud → Salam.',
          ru: 'В 3-м ракате Витра: после Фатихи и суры поднять руки со словами «Аллаху Акбар», сложить руки и прочитать ДУА КУНУТ → Руку → Саджда → Салям.',
        },
      },
    ],
  },
];

export function pickLoc(obj: LocalizedText, lang: AppLanguage): string {
  return obj[lang] || obj.uz_lat;
}
