import { AppLanguage } from '../types';
import { latinToCyrillicUz } from '../utils/uzbekScript';

export interface LifeDuaBlock {
  id: string;
  labelUz: string;
  labelRu: string;
  labelEn: string;
  arabic: string;
  translitUz: string;
  meaningUz: string;
  meaningRu: string;
  meaningEn: string;
  sourceUz: string;
  sourceRu: string;
  sourceEn: string;
}

export interface LifeSituationGuide {
  id:
    | 'janazah'
    | 'cemetery'
    | 'istikharah'
    | 'hojat_tavba'
    | 'newborn'
    | 'sick_visit'
    | 'debt_distress'
    | 'travel';
  accent: 'emerald' | 'amber' | 'sky' | 'violet' | 'rose' | 'teal';
  badgeUz: string;
  badgeRu: string;
  badgeEn: string;
  titleUz: string;
  titleRu: string;
  titleEn: string;
  subtitleUz: string;
  subtitleRu: string;
  subtitleEn: string;
  stepsUz: string[];
  stepsRu: string[];
  stepsEn: string[];
  duas: LifeDuaBlock[];
  notesUz: string[];
  notesRu: string[];
  notesEn: string[];
}

export const LIFE_SITUATION_GUIDES: LifeSituationGuide[] = [
  // ==================== 1. JANOZA VA TA'ZIYA ====================
  {
    id: 'janazah',
    accent: 'emerald',
    badgeUz: 'Farzi kifoya · 4 takbir',
    badgeRu: 'Фарз кифая · 4 такбира',
    badgeEn: 'Fard Kifayah · 4 Takbirs',
    titleUz: 'Janoza namozi va Ta’ziya odobi',
    titleRu: 'Джаназа-намаз и этикет соболезнования',
    titleEn: 'Janazah Prayer & Condolence Etiquette',
    subtitleUz: 'Janoza namozida 4 takbirda o‘qiladigan duolar va musibat ahliga ta’ziya bildirish',
    subtitleRu: 'Порядок 4 такбиров джаназа-намаза, дуа за усопшего и слова соболезнования',
    subtitleEn: 'Step-by-step 4 takbirs of funeral prayer, supplications for the deceased & condolences',
    stepsUz: [
      'Niyat: «Alloh rizoligi uchun ushbu mayyitga (erkak/ayol/go‘dakka) janoza namozini o‘qishni niyat qildim, ushbu imomga iqtido qildim» deb niyat qilinadi.',
      '1-takbir: Imom bilan birga «Allohu akbar» deb quloq qoqilib qo‘l bog‘lanadi va maxfiy ravishda «Sano» duosi («va jalla sanouka» qo‘shimchasi bilan) o‘qiladi.',
      '2-takbir: Qo‘llarni ko‘tarmasdan «Allohu akbar» deyiladi va namozning oxirgi qa’dasida o‘qiladigan «Allohumma solli» va «Allohumma barik» salavotlari o‘qiladi.',
      '3-takbir: Qo‘llarni ko‘tarmasdan «Allohu akbar» deyiladi va mayyitning haqqiga janoza duosi (balog‘atga yetganlar yoki go‘daklar uchun maxsus duo) o‘qiladi.',
      '4-takbir: Qo‘llarni ko‘tarmasdan «Allohu akbar» deyiladi, so‘ng qo‘llar yozilib imom bilan birga o‘ng va chap tomonga «Assalomu alaykum va rohmatulloh» deb salom beriladi.',
    ],
    stepsRu: [
      'Намерение: сделать ният в сердце совершить джаназа-намаз ради Аллаха за данного усопшего, следуя за имамом.',
      '1-й такбир: поднять руки со словами «Аллаху акбар», сложить их и про себя прочитать дуа «Сана» (с добавлением «ва джалля санаука»).',
      '2-й такбир: не поднимая рук, произнести «Аллаху акбар» и прочитать салават Ибрахимия («Аллахумма салли» и «Аллахумма барик»).',
      '3-й такбир: не поднимая рук, произнести «Аллаху акбар» и прочитать дуа за усопшего.',
      '4-й такбир: не поднимая рук, произнести «Аллаху акбар», опустить руки и дать салям направо и налево.',
    ],
    stepsEn: [
      'Intention: Make the intention in your heart to pray the Janazah prayer for the deceased for the sake of Allah behind the Imam.',
      '1st Takbir: Raise hands saying “Allahu Akbar”, fold them, and silently recite the Thana (with “wa jalla thana’uka”).',
      '2nd Takbir: Without raising hands, say “Allahu Akbar” and recite Durood Ibrahim (Allahumma salli & Allahumma barik).',
      '3rd Takbir: Without raising hands, say “Allahu Akbar” and recite the Janazah supplication for the deceased.',
      '4th Takbir: Without raising hands, say “Allahu Akbar”, release hands, and give salam to the right and left with the Imam.',
    ],
    duas: [
      {
        id: 'janazah_sano',
        labelUz: '1-takbirdan keyin: Janoza Sanosi',
        labelRu: 'После 1-го такбира: Дуа «Сана»',
        labelEn: 'After 1st Takbir: Janazah Thana',
        arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَىٰ جَدُّكَ، وَجَلَّ ثَنَاؤُكَ، وَلَا إِلَٰهَ غَيْرُكَ',
        translitUz: 'Subhanakallohumma va bihamdika, va tabarokasmuka, va ta‘ala jadduka, va jalla sana’uka, va la ilaha g‘oyruk.',
        meaningUz: 'Allohim! Seni poklab yod etaman va Senga hamd aytaman, isming muborak, martabang oliy, sanoying (maqtoving) ulug‘dir va Sendan o‘zga iloh yo‘qdir.',
        meaningRu: 'Пречист Ты, о Аллах, и хвала Тебе! Благословенно имя Твоё, превыше всего величие Твоё, велика хвала Тебе, и нет божества, кроме Тебя.',
        meaningEn: 'Glory be to You, O Allah, and praise be to You; blessed is Your Name, exalted is Your Majesty, great is Your praise, and there is no deity other than You.',
        sourceUz: 'Hanafiy fiqhi • Al-Hidoya',
        sourceRu: 'Ханафитский фикх • Аль-Хидая',
        sourceEn: 'Hanafi Fiqh • Al-Hidayah',
      },
      {
        id: 'janazah_adult_dua',
        labelUz: '3-takbirdan keyin: Mayyit haqqiga asosiy duo',
        labelRu: 'После 3-го такбира: Дуа за усопшего',
        labelEn: 'After 3rd Takbir: Main Supplication for the Deceased',
        arabic: 'اللَّهُمَّ اغْفِرْ لِحَيِّنَا وَمَيِّتِنَا، وَشَاهِدِنَا وَغَائِبِنَا، وَصَغِيرِنَا وَكَبِيرِنَا، وَذَكَرِنَا وَأُنثَانَا ۝ اللَّهُمَّ مَنْ أَحْيَيْتَهُ مِنَّا فَأَحْيِهِ عَلَى الْإِسْلَامِ، وَمَنْ تَوَفَّيْتَهُ مِنَّا فَتَوَفَّهُ عَلَى الْإِيمَانِ',
        translitUz: 'Allohummag‘fir lihayyina va mayyitina, va shahidina va g‘o’ibina, va sog‘iyrina va kabiyrina, va zakarina va unsana. Allohumma man ahyaytahu minna fa’ahyihi ‘alal-Islami, va man tavaffaytahu minna fatavaffahu ‘alal-iyman.',
        meaningUz: 'Allohim! Tiriklarimizni va o‘liklarimizni, hozirlarimizni va g‘oyiblarimizni, kichiklarimizni va kattalarimizni, erkaklarimizni va ayollarimizni mag‘firat qilgin! Allohim, bizdan kimni yashatsang, Islomda yashatgin, kimni vafot ettirsang, iymonda vafot ettirgin!',
        meaningRu: 'О Аллах, прости нашим живым и мёртвым, присутствующим и отсутствующим, малым и старым, мужчинам и женщинам! О Аллах, того из нас, кому Ты даруешь жизнь, поддерживай в Исламе, а того, кого заберёшь, упокой в вере (имане)!',
        meaningEn: 'O Allah, forgive our living and our dead, those present and those absent, our young and our old, our males and our females. O Allah, whomever among us You keep alive, keep alive upon Islam, and whomever You cause to die, cause to die upon faith.',
        sourceUz: 'Sunani Termiziy, 1024 • Abu Dovud, 3201',
        sourceRu: 'Сунан ат-Тирмизи 1024 • Абу Дауд 3201',
        sourceEn: 'Jami at-Tirmidhi 1024 • Sunan Abi Dawud 3201',
      },
      {
        id: 'taziya_dua',
        labelUz: 'Musibat ahliga ta’ziya bildirish duosi',
        labelRu: 'Слова соболезнования семье усопшего',
        labelEn: 'Sunnah Words of Condolence to the Family',
        arabic: 'إِنَّ لِلَّهِ مَا أَخَذَ، وَلَهُ مَا أَعْطَىٰ، وَكُلُّ شَيْءٍ عِندَهُ بِأَجَلٍ مُّسَمًّى، فَلْتَصْبِرْ وَلْتَحْتَسِبْ ۝ أَعْظَمَ اللَّهُ أَجْرَكَ، وَأَحْسَنَ عَزَاءَكَ، وَغَفَرَ لِمَيِّتِكَ',
        translitUz: 'Inna lillahi ma axoza va lahu ma a‘to, va kullu shay’in ‘indahu bi’ajalim-musamma, faltasbir val-tahtasib. A‘zomallohu ajroka, va ahsana ‘aza’aka, va g‘ofaro limayyitik.',
        meaningUz: 'Olguchi ham, berguchi ham Allohdir va Uning huzurida har bir narsa belgilangan muddatlidir; sabr qiling va savob umid eting. Alloh ajringizni ulug‘ qilsin, sabringizni go‘zal qilsin va marhumingizni mag‘firat aylasin!',
        meaningRu: 'Поистине, Аллаху принадлежит то, что Он забрал, и то, что Он даровал, и для всего у Него определён свой срок. Да увеличит Аллах вашу награду, дарует прекрасное утешение и простит вашего усопшего!',
        meaningEn: 'Indeed, to Allah belongs what He took and to Him belongs what He gave, and everything with Him has an appointed term. May Allah magnify your reward, comfort you well, and forgive your deceased.',
        sourceUz: 'Sahihul Buxoriy, 1284 • Al-Azkor (Imom Navaviy)',
        sourceRu: 'Сахих аль-Бухари 1284 • Аль-Азкар',
        sourceEn: 'Sahih al-Bukhari 1284 • Al-Adhkar',
      },
    ],
    notesUz: [
      'Janoza namozida ruku va sajda yo‘q, tik turgan holda 4 ta takbir bilan o‘qiladi va tahoratli bo‘lish shart.',
      'Agar 3-takbirdagi uzun duoni yoddan bilmasa, «Allohummag‘fir liy va lahu (ayol bo‘lsa: laha) va lil-mu’miniyna val-mu’minat» yoki «Robbana atina...» duosini o‘qisa ham janoza namozi to‘kis ado bo‘ladi.',
      'Ta’ziya muddati 3 kundir (safarda bo‘lgan kishi kelgach bildirishi joiz).',
    ],
    notesRu: [
      'В джаназа-намазе нет поясных и земных поклонов; обязательным условием является наличие омовения (тахарата).',
      'Если человек ещё не выучил длинное дуа после 3-го такбира, достаточно прочитать «Аллахумма-гфир ли ва ляху ва лиль-муъминина валь-муъминат» или «Раббана атина...».',
    ],
    notesEn: [
      'Janazah prayer has no bowing (ruku) or prostration (sujud) and requires valid Wudu.',
      'If one has not yet memorized the full 3rd-takbir supplication, reciting “Allahummaghfir li wa lahu wa lil-mu’minina wal-mu’minat” or “Rabbana atina...” fulfills the prayer.',
    ],
  },

  // ==================== 2. QABRISTON ZIYORATI ====================
  {
    id: 'cemetery',
    accent: 'teal',
    badgeUz: 'Sunnat odob · Oxirat eslatmasi',
    badgeRu: 'Сунна · Напоминание о Вечности',
    badgeEn: 'Sunnah Etiquette · Reminder of Hereafter',
    titleUz: 'Qabriston ziyorati odobi va duolari',
    titleRu: 'Посещение кладбища: адаб и дуа',
    titleEn: 'Visiting Graves: Sunnah Etiquette & Duas',
    subtitleUz: 'Qabristonga kirganda aytiladigan salom, tilovat va savob bag‘ishlash tartibi',
    subtitleRu: 'Приветствие обитателям могил, чтение Корана и посвящение награды усопшим',
    subtitleEn: 'Greeting the inhabitants of the graves, Quran recitation & dedicating reward',
    stepsUz: [
      'Tahoratli holda, sokinlik va oxiratni tafakkur qilib qabristonga kiriladi.',
      'Qabristonga kirganda Payg‘ambarimiz ﷺ o‘rgatgan umumiy salom va duo («Assalomu alaykum ya ahlad-diyor...») o‘qiladi.',
      'Yaqinlar qabri oldiga borganda qabrga yuzlanib salom beriladi, so‘ng Fotiha, Yosin, Mulk (Taborak) yoki Kofirun, Ixlos (3 marta), Falaq va Nos suralari tilovat qilinadi.',
      'Duo qilayotganda qabrga emas, Qiblaga yuzlanib qo‘l ochiladi va o‘qilgan Qur’on savobi Payg‘ambarimiz ﷺga, ota-ona, qarindoshlar va barcha o‘tgan mo‘minlarga bag‘ishlanadi.',
    ],
    stepsRu: [
      'Входить на кладбище желательно в состоянии омовения, со смирением и размышлением о Вечной жизни.',
      'При входе произнести суннат-приветствие обитателям кладбища («Ас-саляму алейкум я ахляд-дияр...»).',
      'У могилы близких прочитать суры Аль-Фатиха, Ясин, Аль-Мульк или Аль-Ихляс (3 раза), Аль-Фаляк и Ан-Нас.',
      'Во время дуа повернуться лицом к Кибле и попросить Аллаха даровать награду за прочитанное усопшим мусульманам.',
    ],
    stepsEn: [
      'Enter the cemetery calmly, preferably with Wudu, reflecting on the Hereafter.',
      'Upon entering, recite the Prophetic greeting to the believing inhabitants of the graves.',
      'Recite Surah Al-Fatihah, Ya-Sin, Al-Mulk, or Surah Al-Ikhlas (3 times), Al-Falaq, and An-Nas.',
      'Face the Qiblah when making dua and ask Allah to convey the reward of the recitation to the deceased.',
    ],
    duas: [
      {
        id: 'cemetery_salam',
        labelUz: 'Qabristonga kirganda o‘qiladigan sunnat salom va duo',
        labelRu: 'Приветствие и дуа при входе на кладбище',
        labelEn: 'Sunnah Greeting & Supplication Upon Entering a Cemetery',
        arabic: 'السَّلَامُ عَلَيْكُمْ أَهْلَ الدِّيَارِ مِنَ الْمُؤْمِنِينَ وَالْمُسْلِمِينَ، وَإِنَّا إِنْ شَاءَ اللَّهُ بِكُمْ لَاحِقُونَ، نَسْأَلُ اللَّهَ لَنَا وَلَكُمُ الْعَافِيَةَ',
        translitUz: 'Assalamu ‘alaykum ahlad-diyari minal-mu’miniyna val-muslimiyn. Va inna in sha’allohu bikum lahiqun. Nas’alulloha lana va lakumul-‘afiyah.',
        meaningUz: 'Ey mo‘min va musulmonlar diyorining ahli, sizlarga salom bo‘lsin! Inshaalloh, bizlar ham sizlarga qo‘shiluvchimiz. Allohdan o‘zimizga ham, sizlarga ham ofiyat (najot va rahmat) so‘raymiz.',
        meaningRu: 'Мир вам, о обитатели этих мест из числа верующих и мусульман! Поистине, если пожелает Аллах, мы присоединимся к вам. Просим у Аллаха благополучия (прощения) для нас и для вас!',
        meaningEn: 'Peace be upon you, O inhabitants of the dwellings from among the believers and Muslims. Indeed, Allah willing, we shall join you. We ask Allah for well-being for us and for you.',
        sourceUz: 'Sahihi Muslim, 975-hadis',
        sourceRu: 'Сахих Муслим, хадис 975',
        sourceEn: 'Sahih Muslim, Hadith 975',
      },
      {
        id: 'cemetery_dedicate',
        labelUz: 'Tilovat savobini o‘tganlarga bag‘ishlash duosi',
        labelRu: 'Дуа для посвящения награды за чтение Корана усопшим',
        labelEn: 'Supplication Dedicating Quran Recitation Reward to the Deceased',
        arabic: 'اللَّهُمَّ أَوْصِلْ ثَوَابَ مَا قَرَأْنَاهُ إِلَىٰ رُوحِ نَبِيِّنَا مُحَمَّدٍ ﷺ وَإِلَىٰ أَرْوَاحِ آبَائِنَا وَأُمَّهَاتِنَا وَأَقْرِبَائِنَا وَجَمِيعِ الْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ',
        translitUz: 'Allohumma avsil savaba ma qoro’nahu ila ruhi Nabiyyina Muhammadin sollallohu ‘alayhi va sallam, va ila arvahi aba’ina va ummahatina va aqriba’ina va jamiy‘il-mu’miniyna val-mu’minat.',
        meaningUz: 'Allohim! O‘qigan Qur’onimizning savobini Payg‘ambarimiz Muhammad ﷺning muborak ruhlariga hamda ota-onalarimiz, yaqinlarimiz va barcha o‘tgan mo‘min-mo‘minalarning ruhlariga yetkazgin!',
        meaningRu: 'О Аллах, донеси награду за прочитанное нами до души нашего Пророка Мухаммада ﷺ, а также до душ наших отцов, матерей, близких и всех верующих мужчин и женщин!',
        meaningEn: 'O Allah, convey the reward of what we have recited to the soul of our Prophet Muhammad ﷺ, and to the souls of our fathers, mothers, relatives, and all believing men and women.',
        sourceUz: 'Hanafiy fiqhi • Al-Hidoya va Fatovoi Hindiyya',
        sourceRu: 'Ханафитский фикх • Аль-Хидая и Фатава Хиндийя',
        sourceEn: 'Hanafi Fiqh • Al-Hidayah & Fatawa Hindiyyah',
      },
    ],
    notesUz: [
      'Qabr ustiga o‘tirish, qabrni bosish, qabrni o‘pish, tavof qilish yoki sham yoqish Islomda qat’iy man etilgan.',
      'Marhumdan madad so‘ralmaydi — duo faqat Alloh taologa qilinib, marhumning haqqiga mag‘firat va rahmat so‘raladi.',
    ],
    notesRu: [
      'В Исламе запрещено садиться или наступать на могилы, целовать их, зажигать свечи или просить помощи у умерших — дуа обращают только к Аллаху.',
    ],
    notesEn: [
      'Sitting or stepping on graves, kissing graves, lighting candles, or asking the deceased for help is strictly prohibited; supplication is made to Allah alone.',
    ],
  },

  // ==================== 3. ISTIXORA NAMOZI ====================
  {
    id: 'istikharah',
    accent: 'amber',
    badgeUz: '2 rakat sunnat · Xayrli tanlov',
    badgeRu: '2 ракаата сунна · Благой выбор',
    badgeEn: '2 Rak‘ahs Sunnah · Seeking Guidance',
    titleUz: 'Istixora namozi va duosi',
    titleRu: 'Намаз и дуа Истихара',
    titleEn: 'Salat al-Istikharah (Prayer for Guidance)',
    subtitleUz: 'Muhim ish, safar, nikoh yoki qaror oldidan Allohdan xayrlisini so‘rash namozi',
    subtitleRu: 'Намаз и мольба о благом решении перед важным делом, поездкой или браком',
    subtitleEn: 'Prophetic prayer and supplication when making an important life decision',
    stepsUz: [
      'Karohat vaqti bo‘lmagan har qanday paytda tahorat olib, «2 rakat Istixora namozini o‘qishni niyat qildim» deb niyat qilinadi.',
      '1-rakatda Fotiha surasidan so‘ng «Kofirun» surasini, 2-rakatda Fotihadan so‘ng «Ixlos» surasini (yoki o‘zi bilgan suralarni) o‘qish mustahab.',
      'Namoz tugab salom bergach, Allohga hamd va Payg‘ambarimiz ﷺga salavot aytilib, ixlos bilan Istixora duosi o‘qiladi.',
      'Duodagi «haza-l-amro» («mana bu ishni») degan joyga kelganda ko‘nglidan o‘sha niyat qilgan ishini o‘tkazadi.',
    ],
    stepsRu: [
      'В любое разрешённое время совершить 2 ракаата нафиль-намаза с намерением Истихары.',
      'В 1-м ракаате после Аль-Фатихи желательно прочитать суру Аль-Кафирун, во 2-м — Аль-Ихляс.',
      'После саляма воздать хвалу Аллаху, произнести салават и прочитать дуа Истихары.',
      'На словах «хазаль-амр» («это дело») мысленно назвать своё намерение или выбор.',
    ],
    stepsEn: [
      'At any permitted time, pray two non-obligatory rak‘ahs with the intention of Istikharah.',
      'It is recommended to recite Surah Al-Kafirun in the 1st rak‘ah and Surah Al-Ikhlas in the 2nd rak‘ah.',
      'After giving salam, praise Allah, send Salawat upon the Prophet ﷺ, and recite the Istikharah supplication.',
      'When reaching the words “hadha-l-amr” (“this matter”), think of or mention the specific decision.',
    ],
    duas: [
      {
        id: 'istikharah_dua',
        labelUz: 'Payg‘ambarimiz ﷺ o‘rgatgan to‘liq Istixora duosi',
        labelRu: 'Полное дуа Истихара, переданное Пророком ﷺ',
        labelEn: 'Complete Prophetic Dua of Istikharah',
        arabic: 'اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ، وَتَعْلَمُ وَلَا أَعْلَمُ، وَأَنْتَ عَلَّامُ الْغُيُوبِ ۝ اللَّهُمَّ إِنْ كُنْتَ تَعْلَمُ أَنَّ هَٰذَا الْأَمْرَ خَيْرٌ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاقْدُرْهُ لِي وَيَسِّرْهُ لِي ثُمَّ بَارِكْ لِي فِيهِ، وَإِنْ كُنْتَ تَعْلَمُ أَنَّ هَٰذَا الْأَمْرَ شَرٌّ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاصْرِفْهُ عَنِّي وَاصْرِفْنِي عَنْهُ، وَاقْدُرْ لِيَ الْخَيْرَ حَيْثُ كَانَ ثُمَّ أَرْضِنِي بِهِ',
        translitUz: 'Allohumma inniy astaxiyruka bi‘ilmika, va astaqdiruka biqudrotika, va as’aluka min fazlikal-‘aziym. Fa’innaka taqdiru va la aqdiru, va ta‘lamu va la a‘lamu, va anta ‘allamul-g‘uyub. Allohumma in kunta ta‘lamu anna hazal-amro xoyrul-liy fiy diyniy va ma‘ashiy va ‘aqibati amriy faqdurhu liy va yassirhu liy summa barik liy fiyh. Va in kunta ta‘lamu anna hazal-amro sharrul-liy fiy diyniy va ma‘ashiy va ‘aqibati amriy fasrifhu ‘anniy vasrifniy ‘anhu, vaqdur liyal-xoyro haysu kana summa arziniy bih.',
        meaningUz: 'Allohim! Sening ilming bilan Sendan yaxshilik so‘rayman, qudrating bilan Sendan kuch-qobiliyat so‘rayman va ulug‘ fazlingdan tilayman. Zero, Sen Qodirsan, men qodir emasman; Sen bilasan, men bilmayman va Sen g‘ayblarni biluvchi Zotsan. Allohim, agar mana shu ish dinimda, hayotimda va ishimning oqibatida men uchun xayrli ekanini bilsang, uni menga taqdir qil, oson qil va unda menga baraka ber. Agar bu ish dinimda, hayotimda va ishimning oqibatida men uchun yomon ekanini bilsang, uni mendan, meni esa undan uzoqlashtir va qayerda bo‘lsa ham men uchun xayrlisini taqdir qilib, meni undan rozi qil!',
        meaningRu: 'О Аллах, я прошу Тебя помочь мне Твоим знанием и укрепить меня Твоим могуществом и прошу Тебя из Твоей великой милости, ибо Ты можешь, а я не могу, Ты знаешь, а я не знаю, и Ты — Ведающий сокровенное! О Аллах, если Ты знаешь, что это дело станет благом для моей религии, моей жизни и исхода моих дел, то предопредели его мне, облегчи его и благослови меня в нём. А если Ты знаешь, что это дело станет злом для моей религии, моей жизни и исхода моих дел, то отврати его от меня и отврати меня от него и предопредели мне благо, где бы оно ни было, а потом сделай меня довольным им!',
        meaningEn: 'O Allah, I seek Your guidance by virtue of Your knowledge, and I seek ability by virtue of Your power, and I ask You of Your great bounty. For You have power and I have none; You know and I know not; You are the Knower of unseen things. O Allah, if You know that this matter is good for me in my religion, my livelihood, and the outcome of my affair, then decree it for me, make it easy for me, and bless it for me. And if You know that this matter is bad for me in my religion, my livelihood, and the outcome of my affair, then turn it away from me and turn me away from it, and decree for me the good wherever it may be and make me content with it.',
        sourceUz: 'Sahihul Buxoriy, 1162-hadis (Jobir ibn Abdulloh r.a.dan)',
        sourceRu: 'Сахих аль-Бухари, хадис 1162',
        sourceEn: 'Sahih al-Bukhari, Hadith 1162',
      },
    ],
    notesUz: [
      'Istixora natijasida albatta tush ko‘rish shart emas; Alloh taolo qalbga xotirjamlik soladi va xayrli tomonga yo‘lni ochib, osonlashtirib qo‘yadi.',
      'Qalbda aniq qaror va xotirjamlik paydo bo‘lguncha Istixorani 3 yoki 7 marta takrorlash mustahabdir.',
    ],
    notesRu: [
      'После Истихары не обязательно увидеть сон — признаком ответа является облегчение дела и спокойствие в сердце.',
    ],
    notesEn: [
      'Seeing a dream is not required after Istikharah; rather, Allah expands the heart toward what is best and facilitates the path.',
    ],
  },

  // ==================== 4. HOJAT VA TAVBA NAMOZI ====================
  {
    id: 'hojat_tavba',
    accent: 'violet',
    badgeUz: '2 rakat nafl · Mushkul kushod',
    badgeRu: '2 ракаата нафиль · Прощение и нужда',
    badgeEn: '2 Rak‘ahs Nafl · Need & Repentance',
    titleUz: 'Hojat va Tavba namozi hamda duolari',
    titleRu: 'Намаз Хаджат (нужды) и Тауба (покаяния)',
    titleEn: 'Salat al-Hajah (Prayer of Need) & Salat at-Tawbah',
    subtitleUz: 'Mushkul ish chiqqanda yoki gunohdan chin dildan tavba qilganda o‘qiladigan 2 rakat namoz',
    subtitleRu: 'Двухракаатный намаз при жизненной трудности или искреннем покаянии перед Аллахом',
    subtitleEn: 'Two-rak‘ah prayers taught by the Prophet ﷺ in times of need or sincere repentance',
    stepsUz: [
      'Mukammal tahorat olib, karohat bo‘lmagan vaqtda 2 rakat nafl (Hojat yoki Tavba) namozi o‘qiladi.',
      'Salom bergach, Alloh taologa hamdu sano va Payg‘ambarimiz ﷺga salavot aytiladi.',
      'Hojat namozidan so‘ng Hojat duosi, Tavba namozidan so‘ng esa «Sayyidul-istig‘for» (Istig‘forlar sayyidi) o‘qilib, Allohdan chin qalbdan so‘raladi.',
    ],
    stepsRu: [
      'Совершить полноценное омовение и прочитать 2 ракаата нафиль-намаза (Хаджат или Тауба).',
      'После саляма восхвалить Аллаха и благословить Пророка ﷺ.',
      'Прочитать дуа Хаджат или «Саййидуль-истигфар» и обратиться к Аллаху со своей просьбой.',
    ],
    stepsEn: [
      'Perform complete Wudu and pray 2 rak‘ahs of non-obligatory prayer (Salat al-Hajah or Salat at-Tawbah).',
      'After giving salam, praise Allah and send Salawat upon the Prophet ﷺ.',
      'Recite the Dua of Need or Sayyid al-Istighfar and ask Allah sincerely.',
    ],
    duas: [
      {
        id: 'hojat_dua',
        labelUz: 'Hojat namozidan so‘ng o‘qiladigan duo',
        labelRu: 'Дуа после намаза Хаджат',
        labelEn: 'Supplication of Salat al-Hajah',
        arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ الْحَلِيمُ الْكَرِيمُ، سُبْحَانَ اللَّهِ رَبِّ الْعَرْشِ الْعَظِيمِ، الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ، أَسْأَلُكَ مُوجِبَاتِ رَحْمَتِكَ، وَعَزَائِمَ مَغْفِرَتِكَ، وَالْغَنِيمَةَ مِنْ كُلِّ بِرٍّ، وَالسَّلَامَةَ مِنْ كُلِّ إِثْمٍ، لَا تَدَعْ لِي ذَنْبًا إِلَّا غَفَرْتَهُ، وَلَا هَمًّا إِلَّا فَرَّجْتَهُ، وَلَا حَاجَةً هِيَ لَكَ رِضًا إِلَّا قَضَيْتَهَا يَا أَرْحَمَ الرَّاحِمِينَ',
        translitUz: 'La ilaha illallohul-Haliymul-Kariym. Subhanallohi Robbil-‘arshil-‘aziym. Alhamdu lillahi Robbil-‘alamiyn. As’aluka mujibati rohmatika, va ‘aza’ima mag‘firotika, val-g‘oniymata min kulli birrin, vas-salamata min kulli ismin. La tada‘ liy zanban illa g‘ofartahu, va la hamman illa farrojtahu, va la hajatan hiya laka rizon illa qozaytaha ya Arhamar-rohimiyn.',
        meaningUz: 'Halim va Karim Allohdan o‘zga iloh yo‘q. Ulug‘ Arsh Robbi Alloh pokdir. Olamlar Robbi Allohga hamd bo‘lsin! Sendan rahmatingga va mag‘firatingga eltuvchi amallarni, har bir yaxshilikdan ulush va har bir gunohdan salomatlik so‘rayman. Mening hech bir gunohimni qoldirmay mag‘firat qil, hech bir g‘amimni qoldirmay arittir va O‘zing rozi bo‘ladigan hech bir hojatimni qoldirmay ravo qil, ey rahmlilarning eng Rahmlisi!',
        meaningRu: 'Нет божества, кроме Аллаха, Выдержанного, Щедрого! Пречист Аллах, Господь Великого Трона! Хвала Аллаху, Господу миров! Прошу у Тебя того, что ведёт к Твоей милости и Твоему прощению... Не оставь у меня ни одного греха, не простив его, ни одной тревоги, не избавив от неё, и ни одной нужды, угодной Тебе, не удовлетворив её, о Милосерднейший из милосердных!',
        meaningEn: 'There is no deity except Allah, the Forbearing, the Generous. Glory be to Allah, Lord of the Magnificent Throne. Praise be to Allah, Lord of the worlds. I ask You for the means of Your mercy and the certainty of Your forgiveness... Leave no sin of mine unforgiven, no worry unrelieved, and no need that pleases You unfulfilled, O Most Merciful of the merciful.',
        sourceUz: 'Sunani Termiziy, 479 • Ibn Moja, 1384',
        sourceRu: 'Сунан ат-Тирмизи 479 • Ибн Маджа 1384',
        sourceEn: 'Jami at-Tirmidhi 479 • Sunan Ibn Majah 1384',
      },
      {
        id: 'sayyidul_istighfar',
        labelUz: 'Sayyidul-istig‘for (Tavba namozidan so‘ng hamda tong va kechda)',
        labelRu: 'Саййидуль-истигфар (Глава мольб о прощении)',
        labelEn: 'Sayyid al-Istighfar (The Master Supplication for Forgiveness)',
        arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
        translitUz: 'Allohumma anta Robbiy la ilaha illa anta, xolaqtaniy va ana ‘abduka, va ana ‘ala ‘ahdika va va‘dika mastato‘tu, a‘uzu bika min sharri ma sona‘tu, abu’u laka bini‘matika ‘alayya, va abu’u laka bizanbiy fag‘fir liy, fa’innahu la yag‘firuz-zunuba illa ant.',
        meaningUz: 'Allohim! Sen mening Robbimsan, Sendan o‘zga iloh yo‘q. Meni Sen yaratding va men Sening qulingman. Qurbim yetganicha Sening ahding va va’dangdaman. Qilgan yomon ishlarimning sharridan Sendan panoh so‘rayman. Menga bergan ne’matlaringni e’tirof etaman va gunohlarimni ham tan olaman — meni mag‘firat qilgin! Zero, gunohlarni Sendan o‘zga hech kim kechirmaydi.',
        meaningRu: 'О Аллах, Ты — Господь мой, и нет божества, кроме Тебя! Ты сотворил меня, а я — Твой раб, и я буду верен завету с Тобой, пока у меня хватит сил. Прибегаю к Тебе от зла того, что я содеял, признаю милость, оказанную Тобой мне, и признаю грех свой — прости же меня, ибо никто не прощает грехов, кроме Тебя!',
        meaningEn: 'O Allah, You are my Lord, there is no deity except You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favor upon me and I acknowledge my sin, so forgive me, for surely none forgives sins except You.',
        sourceUz: 'Sahihul Buxoriy, 6306-hadis',
        sourceRu: 'Сахих аль-Бухари, хадис 6306',
        sourceEn: 'Sahih al-Bukhari, Hadith 6306',
      },
    ],
    notesUz: [
      'Abu Bakr as-Siddiq (r.a.) rivoyat qilgan hadisda: «Qaysi bir banda gunoh qilib qo‘ysa, so‘ng turib chiroyli tahorat olib 2 rakat namoz o‘qisa va Allohdan istig‘for so‘rasa, Alloh uni albatta kechiradi» deyilgan (Termiziy, 406).',
    ],
    notesRu: [
      'В хадисе Абу Бакра (р.а.) сказано: «Любой раб, совершивший грех, который затем возьмёт омовение, прочитает 2 ракаата намаза и попросит прощения у Аллаха, обязательно будет прощён» (ат-Тирмизи, 406).',
    ],
    notesEn: [
      'Abu Bakr (r.a.) narrated that the Prophet ﷺ said: “No servant commits a sin, then purifies himself well, stands to pray two rak‘ahs, and asks Allah for forgiveness, except that Allah forgives him” (Jami at-Tirmidhi 406).',
    ],
  },

  // ==================== 5. YANGI TUG'ILGAN CHAQALOQ VA AQIQA ====================
  {
    id: 'newborn',
    accent: 'sky',
    badgeUz: 'Sunnat amallar · Azon va Aqiqa',
    badgeRu: 'Сунна · Азан, имя и Акыка',
    badgeEn: 'Sunnah · Newborn Azan, Name & Aqiqah',
    titleUz: 'Yangi tug‘ilgan chaqaloq: Azon, Ism va Aqiqa',
    titleRu: 'Новорождённый: Азан, наречение имени и Акыка',
    titleEn: 'Newborn Baby: Azan, Naming, Tahnik & Aqiqah',
    subtitleUz: 'Farzand tug‘ilganda qulog‘iga azon va takbir aytish, tahnik va Aqiqa sunnatlari',
    subtitleRu: 'Чтение азана и икамата на ушко ребёнку, тахник, имя на 7-й день и правила акыки',
    subtitleEn: 'Calling Azan & Iqamah in the baby’s ears, Tahnik, naming on the 7th day & Aqiqah rules',
    stepsUz: [
      '1. Azon va Takbir: Chaqaloq tug‘ilgach, tahoratli holda Qiblaga yuzlanib, chaqaloqning o‘ng qulog‘iga past va mayin ovozda namoz azoni, chap qulog‘iga esa iqomat (takbir) aytiladi.',
      '2. Tahnik: Xurmo (yoki shirinlik)ni chaynab yumshatib, chaqaloqning tanglayiga surtish va uning haqqiga baraka so‘rab duo qilish sunnatdir.',
      '3. Ism qo‘yish va Aqiqa: Chaqaloqning 7-kuni (yoki 14, 21-kuni, yoxud qodir bo‘lgan paytda) unga go‘zal ma’noli islomiy ism qo‘yiladi, sochi olinib og‘irligicha kumush (yoki qiymati) sadaqa qilinadi va Aqiqa qurbonligi so‘yiladi.',
      '4. Aqiqa miqdori: Qiz bola uchun 1 ta qo‘y, o‘g‘il bola uchun imkon bo‘lsa 2 ta qo‘y (1 ta qo‘y so‘ysa ham sunnat ado bo‘ladi) so‘yiladi.',
    ],
    stepsRu: [
      '1. Азан и Икамат: взяв младенца на руки лицом к Кибле, мягким голосом прочитать азан в правое ушко и икамат в левое ушко.',
      '2. Тахник: размягчить финик, смазать нёбо младенца и сделать дуа о благодати.',
      '3. Имя и Акыка на 7-й день: дать ребёнку благое имя, побрить волосики, раздать милостыню весом волос в серебре и принести жертву акыка (за девочку — 1 баран, за мальчика — 2 или 1 баран по возможности).',
    ],
    stepsEn: [
      '1. Azan & Iqamah: Facing the Qiblah with Wudu, gently recite the Azan in the baby’s right ear and the Iqamah in the left ear.',
      '2. Tahnik: Soften a date, rub a tiny amount on the newborn’s palate, and pray for blessings.',
      '3. Naming & Aqiqah on the 7th day: Give the child an honorable name, shave the hair and give the weight of the hair in silver as charity, and offer the Aqiqah sacrifice (1 sheep for a girl, 2 sheep—or 1 if unable—for a boy).',
    ],
    duas: [
      {
        id: 'newborn_congrats',
        labelUz: 'Farzand ko‘rgan kishini tabriklash duosi',
        labelRu: 'Слова поздравления родителей с рождением ребёнка',
        labelEn: 'Sunnah Congratulation to New Parents',
        arabic: 'بَارَكَ اللَّهُ لَكَ فِي الْمَوْهُوبِ لَكَ، وَشَكَرْتَ الْوَاهِبَ، وَبَلَغَ أَشُدَّهُ، وَرُزِقْتَ بِرَّهُ',
        translitUz: 'Barokallohu laka fil-mavhubi laka, va shakartal-Vahiba, va balag‘o ashuddahu, va ruziqta birroh.',
        meaningUz: 'Alloh senga ato etgan farzandni muborak qilsin, uni Beruvchiga (Allohga) shukr qiluvchi bo‘lgin, u voyaga yetib kamol topsin va uning yaxshiligi (xizmati)dan bahramand bo‘lgin!',
        meaningRu: 'Да благословит тебя Аллах в том, кто дарован тебе, да будешь ты благодарен Дарующему, да достигнет он полной зрелости и да будешь ты наделён его благочестием!',
        meaningEn: 'May Allah bless you in what He has gifted you, may you give thanks to the Giver, may the child reach full maturity, and may you be blessed with their righteousness!',
        sourceUz: 'Al-Azkor (Imom Navaviy) • Hasan Basriy rahimahullohdan',
        sourceRu: 'Аль-Азкар (Имам ан-Навави)',
        sourceEn: 'Al-Adhkar (Imam an-Nawawi)',
      },
      {
        id: 'newborn_protection',
        labelUz: 'Payg‘ambarimiz ﷺ nabiralari Hasan va Husayn (r.a.)ga o‘qigan panoh duolari',
        labelRu: 'Дуа защиты детей от сглаза и всякого зла',
        labelEn: 'Prophetic Protection Dua for Children (Hasan & Husayn)',
        arabic: 'أُعِيذُكُمَا بِكَلِمَاتِ اللَّهِ التَّامَّةِ، مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ، وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ',
        translitUz: 'U‘iyzuka (ikki bolaga: u‘iyzukuma) bikalimatillahit-tammati min kulli shaytoniv-va hammatin, va min kulli ‘aynil-lammah.',
        meaningUz: 'Seni (siz ikkingizni) Allohning mukammal kalimalari bilan har bir shayton va zaharli zararkunandadan hamda har bir yomon ko‘zdan (ko‘z tegishidan) panohga topshiraman.',
        meaningRu: 'Прибегаю для твоей (вашей) защиты к совершенным словам Аллаха от всякого шайтана, вредителя и от всякого дурного глаза!',
        meaningEn: 'I seek protection for you in the Perfect Words of Allah from every devil and poisonous pest, and from every evil, harmful eye.',
        sourceUz: 'Sahihul Buxoriy, 3371-hadis',
        sourceRu: 'Сахих аль-Бухари, хадис 3371',
        sourceEn: 'Sahih al-Bukhari, Hadith 3371',
      },
    ],
    notesUz: [
      'Aqiqa go‘shtidan oila a’zolari, qarindoshlar va qo‘shnilar yeyishi hamda faqirlarga tarqatilishi joiz (xuddi qurbonlik go‘shti kabi).',
    ],
    notesRu: [
      'Мясо акыки, как и мясо курбана, дозволено употреблять самой семье, угощать гостей и раздавать нуждающимся.',
    ],
    notesEn: [
      'Like Qurbani meat, the meat of Aqiqah may be eaten by the family, served to relatives and guests, and shared with the poor.',
    ],
  },

  // ==================== 6. BEMOR ZIYORATI VA SHIFO ====================
  {
    id: 'sick_visit',
    accent: 'rose',
    badgeUz: 'Sunnat ruqya · 7 marta shifo duosi',
    badgeRu: 'Сунна · Дуа исцеления больного',
    badgeEn: 'Sunnah Ruqyah · Healing Supplications',
    titleUz: 'Bemor ziyorati va Shifo (Ruqya) duolari',
    titleRu: 'Посещение больного и дуа об исцелении',
    titleEn: 'Visiting the Sick & Prophetic Healing Duas',
    subtitleUz: 'Bemorni ko‘rgani borganda va tanada og‘riq bo‘lganda o‘qiladigan sahih shifo duolari',
    subtitleRu: 'Достоверные дуа Пророка ﷺ у постели больного и при боли в теле',
    subtitleEn: 'Authentic Prophetic supplications when visiting the ill or experiencing pain',
    stepsUz: [
      'Bemor huzuriga ochiq chehra bilan kirib, unga tasalli va umid beruvchi so‘zlar («La ba’sa tohurun in sha’alloh» — «Hechqisi yo‘q, inshaalloh gunohlardan poklovchidir») aytiladi.',
      'Bemorning bosh tarafida o‘tirib, uning haqqiga 7 marta «As’alullohal-Aziym...» shifo duosi o‘qiladi.',
      'Agar o‘z tanasida biror joy og‘risa, o‘ng qo‘lini og‘riyotgan joyga qo‘yib 3 marta «Bismillah» va 7 marta «A‘uzu billahi va qudrotihi...» duosini o‘qiydi.',
    ],
    stepsRu: [
      'Войти к больному с добрыми словами утешения («Ля баъса тахурун ин шаа-Ллах» — «Не беда, очищение от грехов, если пожелает Аллах»).',
      'Прочитать у изголовья больного 7 раз дуа «Ас’алюллахаль-Азым...».',
      'При боли в собственном теле положить правую руку на больное место, сказать 3 раза «Бисмиллях» и 7 раз дуа защиты.',
    ],
    stepsEn: [
      'Comfort the patient with hopeful words (“La ba’sa tahurun in sha’Allah” — “No harm; a purification, if Allah wills”).',
      'Recite the 7-fold healing supplication (“As’alullahal-‘Azim...”) by the patient.',
      'For pain in one’s own body, place the right hand on the painful spot, say “Bismillah” 3 times, and recite the protection dua 7 times.',
    ],
    duas: [
      {
        id: 'sick_7x',
        labelUz: 'Bemor oldida 7 marta o‘qiladigan shifo duosi',
        labelRu: 'Дуа об исцелении (читается 7 раз у больного)',
        labelEn: 'Healing Supplication Recited 7 Times for the Sick',
        arabic: 'أَسْأَلُ اللَّهَ الْعَظِيمَ، رَبَّ الْعَرْشِ الْعَظِيمِ، أَنْ يَشْفِيَكَ (٧ مَرَّاتٍ)',
        translitUz: 'As’alullohal-‘Aziym, Robbal-‘arshil-‘aziym, ay-yashfiyak. (7 marta)',
        meaningUz: 'Ulug‘ Arshning Robbi bo‘lgan Buyuk Allohdan senga shifo berishini so‘rayman. (Payg‘ambarimiz ﷺ: «Kim bemorni ko‘rgani borib ushbu duoni 7 marta o‘qisa, ajali yetmagan bo‘lsa Alloh unga shifo beradi» deganlar).',
        meaningRu: 'Прошу Великого Аллаха, Господа Великого Трона, исцелить тебя! (7 раз).',
        meaningEn: 'I ask Allah the Mighty, Lord of the Magnificent Throne, to cure you (7 times).',
        sourceUz: 'Sunani Abu Dovud, 3106 • Termiziy, 2083',
        sourceRu: 'Сунан Абу Дауд 3106 • ат-Тирмизи 2083',
        sourceEn: 'Sunan Abi Dawud 3106 • Jami at-Tirmidhi 2083',
      },
      {
        id: 'sick_prophetic',
        labelUz: 'Payg‘ambarimiz ﷺning eng mashhur shifo duolari',
        labelRu: 'Пророческое дуа об исцелении («Аллахумма Раббан-нас...»)',
        labelEn: 'The Prophet’s ﷺ Comprehensive Healing Supplication',
        arabic: 'اللَّهُمَّ رَبَّ النَّاسِ، أَذْهِبِ الْبَأْسَ، اشْفِ أَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا',
        translitUz: 'Allohumma Robban-nas, azhibil-ba’s, ishfi antash-Shafiy, la shifa’a illa shifa’uka, shifa’al-la yug‘odiru saqoma.',
        meaningUz: 'Insonlarning Robbi bo‘lgan Allohim! Dardni ketkazgin va shifo bergin — Sen Shifo beruvchisan! Sening shifoingdan o‘zga shifo yo‘q; hech bir kasallik qoldirmaydigan komil shifo bergin!',
        meaningRu: 'О Аллах, Господь людей! Удали болезнь и исцели, ведь Ты — Исцеляющий! Нет исцеления, кроме Твоего исцеления — исцеления, не оставляющего после себя никакого недуга!',
        meaningEn: 'O Allah, Lord of mankind! Remove the affliction and heal, for You are the Healer. There is no healing except Your healing — a healing that leaves behind no illness.',
        sourceUz: 'Sahihul Buxoriy, 5675 • Sahihi Muslim, 2191',
        sourceRu: 'Сахих аль-Бухари 5675 • Сахих Муслим 2191',
        sourceEn: 'Sahih al-Bukhari 5675 • Sahih Muslim 2191',
      },
      {
        id: 'sick_pain_hand',
        labelUz: 'Tanada og‘riq bo‘lganda o‘ng qo‘lni qo‘yib o‘qiladigan duo',
        labelRu: 'Дуа при боли в теле (положив правую руку на больное место)',
        labelEn: 'Supplication for Pain in the Body (Placing the Right Hand)',
        arabic: 'بِسْمِ اللَّهِ (٣) ۝ أَعُوذُ بِاللَّهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ (٧)',
        translitUz: 'Bismillah (3 marta). A‘uzu billahi va qudrotihi min sharri ma ajidu va uhazir (7 marta).',
        meaningUz: 'Allohning nomi bilan (3 marta). O‘zim sezayotgan va xavfsirayotgan og‘riqning yomonligidan Allohdan va Uning qudratidan panoh so‘rayman (7 marta).',
        meaningRu: 'Бисмиллях (3 раза). Прибегаю к защите Аллаха и Его могущества от зла того, что я ощущаю и чего опасаюсь (7 раз).',
        meaningEn: 'Bismillah (3 times). I seek refuge in Allah and His Power from the evil of what I feel and what I fear (7 times).',
        sourceUz: 'Sahihi Muslim, 2202-hadis',
        sourceRu: 'Сахих Муслим, хадис 2202',
        sourceEn: 'Sahih Muslim, Hadith 2202',
      },
    ],
    notesUz: [
      'Bemor huzurida uzoq o‘tirib uni charchatib qo‘ymaslik, balki qisqa va xayrli duo qilib ko‘nglini ko‘tarish sunnat odoblaridandir.',
    ],
    notesRu: [
      'По этикету сунны не следует утомлять больного долгим визитом — лучше подбодрить его и сделать искреннее дуа.',
    ],
    notesEn: [
      'It is part of Sunnah etiquette to keep visits to the sick gentle and not overly long so the patient can rest.',
    ],
  },

  // ==================== 7. QARZ VA G'AM-TASHVISH ====================
  {
    id: 'debt_distress',
    accent: 'amber',
    badgeUz: 'Qarzdan najot · Qalb taskini',
    badgeRu: 'Избавление от долгов и тревоги',
    badgeEn: 'Relief from Debt, Worry & Distress',
    titleUz: 'Qarz, G‘am-tashvish va Musibatda najot duolari',
    titleRu: 'Дуа для избавления от долгов, печали и тревог',
    titleEn: 'Duas for Paying Off Debt & Overcoming Anxiety',
    subtitleUz: 'Tog‘dek qarzi bo‘lsa ham Alloh O‘zi uzib berishiga sabab bo‘luvchi sahih nabaviy duolar',
    subtitleRu: 'Пророческие мольбы для выплаты долгов, расширения ризка и душевного покоя',
    subtitleEn: 'Authentic Prophetic supplications for settling debts and relieving heavy grief',
    stepsUz: [
      'Qarzni albatta uzishga xolis niyat qilish va halol harakatda bo‘lish (hadisda: «Kim odamlarning molini qaytarib berish niyati bilan olsa, Alloh uning nomidan uzib beradi» deyilgan — Buxoriy, 2387).',
      'Har namozdan so‘ng hamda tong va kechda Hazrati Ali (r.a.) va Anas (r.a.) rivoyat qilgan qarzdan najot duolarini doimiy o‘qib yurish.',
    ],
    stepsRu: [
      'Иметь твёрдое и искреннее намерение вернуть долг (в хадисе аль-Бухари 2387 сказано: «Кто берёт имущество людей с намерением вернуть его, тому Аллах поможет выплатить»).',
      'Постоянно читать пророческие дуа от долгов и тревог после намазов, утром и вечером.',
    ],
    stepsEn: [
      'Maintain a sincere intention to repay every debt (Sahih al-Bukhari 2387: “Whoever takes people’s wealth intending to repay it, Allah will pay it off on his behalf”).',
      'Consistently recite the Prophetic debt-relief supplications after prayers and in the morning and evening.',
    ],
    duas: [
      {
        id: 'debt_ali',
        labelUz: 'Tog‘dek qarzdan ham qutulishga sabab bo‘luvchi duo',
        labelRu: 'Дуа для выплаты долга, которому Пророк ﷺ обучил Али (р.а.)',
        labelEn: 'Prophetic Debt-Relief Dua Taught to Ali (r.a.)',
        arabic: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
        translitUz: 'Allohummakfiniy bihalalika ‘an haromika, va ag‘niniy bifazlika ‘amman sivak.',
        meaningUz: 'Allohim! Menga haloling bilan kifoya qilib, haromingdan uzoq etgin va O‘z fazling bilan meni O‘zingdan boshqalarga muhtoj qilmagin! (Hazrati Ali r.a. aytadilar: «Bo‘yningda Sabir tog‘idek qarz bo‘lsa ham, bu duo bilan Alloh uni uzib beradi»).',
        meaningRu: 'О Аллах, упаси меня дозволенным Тобой от запретного и обогати меня по милости Твоей так, чтобы я не нуждался ни в ком, кроме Тебя!',
        meaningEn: 'O Allah, suffice me with what You have made lawful against what You have made unlawful, and enrich me by Your bounty so that I am independent of all besides You.',
        sourceUz: 'Sunani Termiziy, 3563-hadis',
        sourceRu: 'Сунан ат-Тирмизи, хадис 3563',
        sourceEn: 'Jami at-Tirmidhi, Hadith 3563',
      },
      {
        id: 'debt_anas',
        labelUz: 'G‘am-qayg‘u va qarz og‘irligidan panoh so‘rash duosi',
        labelRu: 'Дуа от тревоги, печали и бремени долгов',
        labelEn: 'Supplication Against Worry, Grief & Being Overwhelmed by Debt',
        arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
        translitUz: 'Allohumma inniy a‘uzu bika minal-hammi val-hazan, val-‘ajzi val-kasal, val-buxli val-jubn, va zola‘id-dayni va g‘olabatir-rijal.',
        meaningUz: 'Allohim! Men Sendan g‘am va qayg‘udan, ojizlik va dangasalikdan, baxillik va qo‘rqoqlikdan, qarzning ezib qo‘yishidan va odamlarning ustimdan g‘olib kelishidan panoh so‘rayman.',
        meaningRu: 'О Аллах, поистине, я прибегаю к Тебе от тревоги и печали, от слабости и лени, от скупости и малодушия, от бремени долга и притеснения со стороны людей!',
        meaningEn: 'O Allah, I seek refuge in You from worry and grief, from helplessness and laziness, from miserliness and cowardice, and from being heavily burdened by debt and overpowered by men.',
        sourceUz: 'Sahihul Buxoriy, 6369-hadis',
        sourceRu: 'Сахих аль-Бухари, хадис 6369',
        sourceEn: 'Sahih al-Bukhari, Hadith 6369',
      },
      {
        id: 'distress_yunus',
        labelUz: 'Yunus (a.s.)ning mushkuldan najot topish duolari',
        labelRu: 'Мольба пророка Юнуса (а.с.) в минуты испытания',
        labelEn: 'Prophet Yunus’s (AS) Supplication in Times of Distress',
        arabic: 'لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
        translitUz: 'La ilaha illa anta subhanaka inniy kuntu minaz-zolimiyn.',
        meaningUz: 'Sendan o‘zga iloh yo‘q, Sen barcha nuqsonlardan Poksan! Albatta, men o‘z nafsimga zulm qiluvchilardan bo‘ldim.',
        meaningRu: 'Нет божества, кроме Тебя! Пречист Ты! Воистину, я был одним из несправедливых.',
        meaningEn: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.',
        sourceUz: "Qur'on, Al-Anbiyo surasi, 87-oyat • Termiziy, 3505",
        sourceRu: 'Коран, сура Аль-Анбия, аят 87 • ат-Тирмизи 3505',
        sourceEn: "Qur'an, Surah Al-Anbiya 21:87 • Jami at-Tirmidhi 3505",
      },
    ],
    notesUz: [
      'Musibat yoki yo‘qotish yetgan zahoti «Inna lillahi va inna ilayhi roji‘un. Allohumma’jurniy fiy musiybatiy va axlif liy xoyrom-minha» desa, Alloh unga ajr berib, o‘rniga yaxshirog‘ini ato etadi (Sahihi Muslim, 918).',
    ],
    notesRu: [
      'При любой потере сунна сразу сказать: «Инна лилляхи ва инна иляйхи раджиун. Аллахумма-джурни фи мусыбати ва ахлиф ли хайран минха» (Сахих Муслим, 918).',
    ],
    notesEn: [
      'Upon any loss or calamity, say immediately: “Inna lillahi wa inna ilayhi raji‘un. Allahumma-jurni fi musibati wa akhlif li khayran minha” (Sahih Muslim 918).',
    ],
  },

  // ==================== 8. SAFAR VA MUSOFIRLIK ====================
  {
    id: 'travel',
    accent: 'emerald',
    badgeUz: 'Safar duosi · Musofir qoidalari',
    badgeRu: 'Дуа в пути · Правила путника',
    badgeEn: 'Travel Duas · Traveler (Musafir) Rules',
    titleUz: 'Safarga va ulovga chiqish odobi hamda duosi',
    titleRu: 'Выход из дома, поездка и правила мусафира',
    titleEn: 'Leaving Home, Travel Duas & Hanafi Traveler Rules',
    subtitleUz: 'Uydan chiqish, avtomobil/samolyotga minish duolari va Hanafiy mazhabida musofirlik hukmi',
    subtitleRu: 'Дуа при выходе из дома и посадке в транспорт, а также сокращение намаза (каср) в пути',
    subtitleEn: 'Duas when leaving home and boarding a vehicle, plus Hanafi Qasr prayer rules',
    stepsUz: [
      'Uydan chiqayotganda «Bismillahi tavakkaltu ‘alalloh...» duosini o‘qib chiqish.',
      'Avtomobil, poyezd yoki samolyotga o‘tirgach «Bismillah, Alhamdulillah» deb Safar duosini («Subhanallaziy saxxora lana haza...») o‘qish.',
      'Hanafiy mazhabida o‘z shahridan 90 km va undan uzoq masofaga (15 kundan kam muddatga) safarga chiqqan kishi shahar chegarasidan chiqishi bilan «Musofir» bo‘ladi va 4 rakatli farz namozlarni (Peshin, Asr, Xufton) 2 rakat qilib (Qasr) o‘qiydi.',
    ],
    stepsRu: [
      'При выходе из дома прочитать дуа «Бисмилляхи, таваккальту аляллах...».',
      'Сев в транспорт, сказать «Бисмиллях, Альхамдулиллях» и прочитать дуа путника («Субханаллязи саххара ляна хаза...»).',
      'В ханафитском мазхабе путник, выехавший за пределы своего города на расстояние от 90 км (менее чем на 15 дней), сокращает 4-ракаатные фарз-намазы (Зухр, Аср, Иша) до 2 ракаатов (каср).',
    ],
    stepsEn: [
      'When stepping out of the house, recite “Bismillahi tawakkaltu ‘alallah...”.',
      'Upon boarding a car, train, or plane, say “Bismillah, Alhamdulillah” and recite the Travel Dua.',
      'In the Hanafi school, one traveling 90 km or more from their city (for less than 15 days at a single destination) shortens 4-rak‘ah Fard prayers (Dhuhr, Asr, Isha) to 2 rak‘ahs (Qasr) once past the city boundary.',
    ],
    duas: [
      {
        id: 'leave_home_dua',
        labelUz: 'Uydan chiqayotganda o‘qiladigan duo',
        labelRu: 'Дуа при выходе из дома',
        labelEn: 'Supplication When Leaving Home',
        arabic: 'بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
        translitUz: 'Bismillahi, tavakkaltu ‘alallohi, va la havla va la quvvata illa billah.',
        meaningUz: 'Allohning nomi bilan, Allohga tavakkal qildim. Kuch va quvvat faqat Alloh bilandir. (Hadisda: kim uydan chiqayotib shu duoni aytsa, unga «Hidoyat qilinding, kifoya qilinding va himoya qilinding» deyiladi va shayton undan uzoqlashadi).',
        meaningRu: 'С именем Аллаха, уповаю на Аллаха, и нет мощи и силы ни у кого, кроме Аллаха!',
        meaningEn: 'In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.',
        sourceUz: 'Sunani Abu Dovud, 5095 • Termiziy, 3426',
        sourceRu: 'Сунан Абу Дауд 5095 • ат-Тирмизи 3426',
        sourceEn: 'Sunan Abi Dawud 5095 • Jami at-Tirmidhi 3426',
      },
      {
        id: 'travel_dua',
        labelUz: 'Ulovga (avtomobil, poyezd, samolyotga) minganda o‘qiladigan Safar duosi',
        labelRu: 'Дуа путника при посадке в транспорт',
        labelEn: 'Supplication for Boarding a Vehicle & Traveling',
        arabic: 'بِسْمِ اللَّهِ، الْحَمْدُ لِلَّهِ ۝ سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَىٰ رَبِّنَا لَمُنْقَلِبُونَ ۝ اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَٰذَا الْبِرَّ وَالتَّقْوَىٰ، وَمِنَ الْعَمَلِ مَا تَرْضَىٰ، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَٰذَا وَاطْوِ عَنَّا بُعْدَهُ، اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ وَالْخَلِيفَةُ فِي الْأَهْلِ',
        translitUz: 'Bismillah, Alhamdulillah. Subhanallaziy saxxora lana haza va ma kunna lahu muqriniyn, va inna ila Robbina lamunqolibun. Allohumma inna nas’aluka fiy safarina hazal-birro vat-taqva, va minal-‘amali ma tarzo. Allohumma havvin ‘alayna safarona haza vatvi ‘anna bu‘dah. Allohumma antas-Sohibu fis-safari val-Xoliyfatu fil-ahl.',
        meaningUz: 'Allohning nomi bilan, Allohga hamd bo‘lsin! Bizga bu (ulov)ni bo‘ysundirib qo‘ygan Zot pokdir, holbuki biz o‘zimiz bunga qodir emas edik. Va albatta biz Robbimizga qaytuvchimiz. Allohim, ushbu safarimizda Sendan yaxshilik, taqvo va O‘zing rozi bo‘ladigan amalni so‘raymiz. Allohim, bu safarimizni bizga yengil qil va uning uzog‘ini yaqin qil! Allohim, safarda Hamroh ham, ahlimizga O‘rinbosar (Himoyachi) ham O‘zingsan!',
        meaningRu: 'С именем Аллаха, хвала Аллаху! Пречист Тот, Кто подчинил нам это, ведь нам такое не было под силу, и, поистине, мы вернёмся к Господу нашему! О Аллах, мы просим Тебя в этом путешествии благочестия, богобоязненности и таких дел, которыми Ты будешь доволен. О Аллах, облегчи нам этот путь и сократи для нас его дальность! О Аллах, Ты — Спутник в путешествии и Хранитель семьи!',
        meaningEn: 'Bismillah, Alhamdulillah. Glory be to Him Who has subjected this to us, and we could never have subdued it by our efforts, and indeed to our Lord we shall return. O Allah, we ask You on this journey of ours for righteousness, piety, and deeds that please You. O Allah, make this journey easy for us and fold up its distance for us. O Allah, You are the Companion on the journey and the Guardian left behind over the family.',
        sourceUz: 'Sahihi Muslim, 1342-hadis • Zuxruf surasi, 13–14-oyatlar',
        sourceRu: 'Сахих Муслим 1342 • Сура Аз-Зухруф, 13–14',
        sourceEn: 'Sahih Muslim 1342 • Surah Az-Zukhruf 43:13–14',
      },
    ],
    notesUz: [
      'Musofirning duosi mustajob bo‘ladigan duolar qatoridadir (Sunani Termiziy, 1905).',
      'Musofir kishi muqim (shu yerlik) imomga iqtido qilsa, imomga ergashib 4 rakatni to‘liq o‘qiydi.',
    ],
    notesRu: [
      'Мольба (дуа) путника входит в число дуа, которые принимаются без преграды (Сунан ат-Тирмизи, 1905).',
      'Если путник (мусафир) молится позади местного имама (мукима), он совершает все 4 ракаата полностью за имамом.',
    ],
    notesEn: [
      'The supplication of a traveler is among the supplications answered without a veil (Jami at-Tirmidhi 1905).',
      'If a traveler prays behind a resident (muqim) Imam, they complete all 4 rak‘ahs following the Imam.',
    ],
  },
];

export function getLocalizedSituationGuide(
  item: LifeSituationGuide,
  lang: AppLanguage
): {
  badge: string;
  title: string;
  subtitle: string;
  steps: string[];
  notes: string[];
  duas: Array<{
    id: string;
    label: string;
    arabic: string;
    translit: string;
    meaning: string;
    source: string;
  }>;
} {
  if (lang === 'uz_cyr') {
    return {
      badge: latinToCyrillicUz(item.badgeUz),
      title: latinToCyrillicUz(item.titleUz),
      subtitle: latinToCyrillicUz(item.subtitleUz),
      steps: item.stepsUz.map((s) => latinToCyrillicUz(s)),
      notes: item.notesUz.map((n) => latinToCyrillicUz(n)),
      duas: item.duas.map((d) => ({
        id: d.id,
        label: latinToCyrillicUz(d.labelUz),
        arabic: d.arabic,
        translit: latinToCyrillicUz(d.translitUz),
        meaning: latinToCyrillicUz(d.meaningUz),
        source: latinToCyrillicUz(d.sourceUz),
      })),
    };
  }
  if (lang === 'ru') {
    return {
      badge: item.badgeRu,
      title: item.titleRu,
      subtitle: item.subtitleRu,
      steps: item.stepsRu,
      notes: item.notesRu,
      duas: item.duas.map((d) => ({
        id: d.id,
        label: d.labelRu,
        arabic: d.arabic,
        translit: latinToCyrillicUz(d.translitUz),
        meaning: d.meaningRu,
        source: d.sourceRu,
      })),
    };
  }
  if (lang === 'en') {
    return {
      badge: item.badgeEn,
      title: item.titleEn,
      subtitle: item.subtitleEn,
      steps: item.stepsEn,
      notes: item.notesEn,
      duas: item.duas.map((d) => ({
        id: d.id,
        label: d.labelEn,
        arabic: d.arabic,
        translit: d.translitUz,
        meaning: d.meaningEn,
        source: d.sourceEn,
      })),
    };
  }
  return {
    badge: item.badgeUz,
    title: item.titleUz,
    subtitle: item.subtitleUz,
    steps: item.stepsUz,
    notes: item.notesUz,
    duas: item.duas.map((d) => ({
      id: d.id,
      label: d.labelUz,
      arabic: d.arabic,
      translit: d.translitUz,
      meaning: d.meaningUz,
      source: d.sourceUz,
    })),
  };
}
