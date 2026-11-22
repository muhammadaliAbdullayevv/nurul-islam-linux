import { AppLanguage } from '../types';
import { latinToCyrillicUz } from '../utils/uzbekScript';

export type ScholarId =
  | 'yassaviy'
  | 'naqshband'
  | 'navoiy'
  | 'gulxaniy'
  | 'olloyor'
  | 'gijduvoniy'
  | 'buxoriy'
  | 'moturidiy'
  | 'marginoniy';

export type WisdomTopicId = 'tawhid' | 'qalb' | 'odob' | 'ilm' | 'mehnat' | 'nafs';

export interface LocalizedTriple {
  uz: string;
  en: string;
  ru: string;
}

export interface WisdomScholarRaw {
  id: ScholarId;
  years: string;
  accent: 'emerald' | 'amber' | 'teal' | 'indigo' | 'rose' | 'sky' | 'violet' | 'lime' | 'orange';
  name: LocalizedTriple;
  title: LocalizedTriple;
  place: LocalizedTriple;
  masterwork: LocalizedTriple;
  bio: LocalizedTriple;
}

export interface WisdomEntryRaw {
  id: string;
  scholarId: ScholarId;
  topic: WisdomTopicId;
  isVerse?: boolean;
  work: LocalizedTriple;
  heading: LocalizedTriple;
  original?: string;
  excerpt: LocalizedTriple;
  sharh: LocalizedTriple;
}

export interface LocalizedScholar {
  id: ScholarId;
  years: string;
  accent: WisdomScholarRaw['accent'];
  name: string;
  title: string;
  place: string;
  masterwork: string;
  bio: string;
}

export interface LocalizedWisdomEntry {
  id: string;
  scholarId: ScholarId;
  topic: WisdomTopicId;
  isVerse: boolean;
  work: string;
  heading: string;
  original?: string;
  excerpt: string;
  sharh: string;
}

export function pickLocalized(triple: LocalizedTriple, lang: AppLanguage): string {
  if (lang === 'en') return triple.en;
  if (lang === 'ru') return triple.ru;
  if (lang === 'uz_cyr') return latinToCyrillicUz(triple.uz);
  return triple.uz;
}

export const WISDOM_TOPICS: Array<{ id: WisdomTopicId; label: LocalizedTriple }> = [
  { id: 'tawhid', label: { uz: 'Tavhid & Iymon', en: 'Tawhid & Faith', ru: 'Таухид и Вера' } },
  { id: 'qalb', label: { uz: 'Qalb & Zikr', en: 'Heart & Dhikr', ru: 'Сердце и Зикр' } },
  { id: 'odob', label: { uz: 'Odob & Axloq', en: 'Adab & Ethics', ru: 'Адаб и Нрав' } },
  { id: 'ilm', label: { uz: 'Ilm & Hikmat', en: 'Knowledge', ru: 'Знания' } },
  { id: 'mehnat', label: { uz: 'Halol Mehnat', en: 'Halal Work', ru: 'Халяльный труд' } },
  { id: 'nafs', label: { uz: 'Nafs Tarbiyasi', en: 'Self-Discipline', ru: 'Воспитание нафса' } },
];

export const WISDOM_SCHOLARS: WisdomScholarRaw[] = [
  {
    id: 'yassaviy',
    years: '1093–1166',
    accent: 'emerald',
    name: { uz: 'Xoja Ahmad Yassaviy', en: 'Khoja Ahmad Yasawi', ru: 'Ходжа Ахмад Яссави' },
    title: { uz: 'Piri Turkiston · Sulton ul-Orifin', en: 'Pir of Turkistan · Master of Wisdom', ru: 'Пир Туркестана · Султан арифов' },
    place: { uz: 'Sayram / Yassi (Turkiston)', en: 'Sayram / Yasi (Turkistan)', ru: 'Сайрам / Ясы (Туркестан)' },
    masterwork: { uz: 'Devoni Hikmat', en: 'Diwan-i Hikmat', ru: 'Диван-и Хикмат' },
    bio: {
      uz: "Markaziy Osiyo turkiy xalqlari orasida islomiy axloq, qalb pokligi, kamtarlik va tavhid ruhini sodda turkiy she'riyat — «Hikmatlar» orqali yoygan buyuk mutasavvif va shoir. Ustozi Yusuf Hamadoniy tarbiyasida kamol topgan.",
      en: 'Great Central Asian spiritual master and Turkic poet who spread Tawhid, humility, compassion, and purification of the heart through accessible Turkic poetry known as Diwan-i Hikmat.',
      ru: 'Великий духовный наставник и тюркский поэт Центральной Азии, распространивший ценности таухида, смирения, милосердия и чистоты сердца через знаменитые стихи «Диван-и Хикмат».',
    },
  },
  {
    id: 'naqshband',
    years: '1318–1389',
    accent: 'amber',
    name: { uz: 'Bahouddin Naqshband', en: 'Bahauddin Naqshband', ru: 'Бахауддин Накшбанд' },
    title: { uz: 'Hazrat Shohi Naqshband · Xojai Buzrug', en: 'Shah-i Naqshband · Great Master', ru: 'Шах-и Накшбанд · Великий Наставник' },
    place: { uz: 'Qasri Hinduvon (Buxoro)', en: 'Qasr-i Hinduwan (Bukhara)', ru: 'Каср-и Хиндуван (Бухара)' },
    masterwork: { uz: 'Kalimoti Qudsiya · «Dil ba yoru, dast ba kor»', en: 'Sacred Principles · Heart with God, Hands at Work', ru: 'Священные принципы · Сердце с Богом, руки в труде' },
    bio: {
      uz: "Jahonga mashhur Naqshbandiya ta'limotining asoschisi. Zohidlikni tarkidunyochilikda emas, balki halol kasb, jamiyatga xizmat, sunnatga qat'iy amal va qalbda Allohni doimiy zikr etishda ko'rgan.",
      en: 'Founder of the world-renowned Naqshbandi spiritual path of Bukhara. He taught that true spirituality lies not in abandoning society, but in earning halal bread, serving people, following the Sunnah, and keeping the heart anchored in Allah.',
      ru: 'Основатель всемирно известного бухарского учения Накшбандия. Учил, что истинная духовность заключается не в отшельничестве, а в халяльном труде, служении людям, следовании Сунне и постоянном поминании Аллаха в сердце.',
    },
  },
  {
    id: 'navoiy',
    years: '1441–1501',
    accent: 'indigo',
    name: { uz: 'Hazrat Alisher Navoiy', en: 'Mir Alisher Navoi', ru: 'Мир Алишер Навои' },
    title: { uz: "Nizomiddin · O'zbek adabiyoti sultoni", en: 'Nizamuddin · Sultan of Turkic Literature', ru: 'Низамуддин · Султан тюркской поэзии' },
    place: { uz: 'Hirot (Temuriylar davlati)', en: 'Herat (Timurid Era)', ru: 'Герат (Эпоха Тимуридов)' },
    masterwork: { uz: "Arba'in (Qirq Hadis) · Mahbub ul-Qulub", en: "Arba'in (40 Hadiths) · Mahbub al-Qulub", ru: 'Арбаин (40 хадисов) · Махбуб аль-Кулуб' },
    bio: {
      uz: "Naqshbandiya tariqatining yirik namoyandasi, mutafakkir, davlat arbobi va shoir. «Arba'in» asarida Payg'ambarimizning ﷺ 40 ta sahih hadisini go'zal o'zbekcha to'rtliklarda talqin qilgan, «Mahbub ul-Qulub»da esa yuksak insoniy odoblarni bayon etgan.",
      en: 'Statesman, thinker, and supreme poet of the Uzbek language who followed the Naqshbandi tradition. In Arba’in he rendered 40 Prophetic hadiths into luminous Uzbek quatrains, and in Mahbub al-Qulub distilled timeless ethics.',
      ru: 'Великий мыслитель, поэт и последователь традиции Накшбандия. В труде «Арбаин» поэтически переложил 40 достоверных хадисов Пророка ﷺ на тюркский язык, а в «Махбуб аль-Кулуб» раскрыл высшие нормы благонравия.',
    },
  },
  {
    id: 'gulxaniy',
    years: '1770–1827',
    accent: 'orange',
    name: { uz: 'Muhammad Sharif Gulxaniy', en: 'Muhammad Sharif Gulkhani', ru: 'Мухаммад Шариф Гульхани' },
    title: { uz: "Qo'qon adabiy muhiti · Masalnavis alloma", en: 'Master of Uzbek Fables & Proverbs', ru: 'Мастер узбекской притчи и пословиц' },
    place: { uz: "Qo'qon (Farg'ona vodiysi)", en: 'Kokand (Fergana Valley)', ru: 'Коканд (Ферганская долина)' },
    masterwork: { uz: 'Zarbulmasal · G‘azallar', en: 'Zarbulmasal (Book of Parables) · Ghazals', ru: 'Зарбулмасал (Свод притч) · Газели' },
    bio: {
      uz: "O'zbek mumtoz adabiyotining yorqin vakili, Qo'qon adabiy muhitining mashhur shoiri va masalnavisi. 400 dan ortiq xalq maqoli va o'tkir axloqiy masallarni jamlagan «Zarbulmasal» asari orqali adolat, halollik, kamtarlik, ilm-hunar va hayo qadriyatlarini kuylagan.",
      en: 'Renowned classical Uzbek poet and fabulist of Kokand. Through his masterpiece Zarbulmasal—weaving over 400 folk proverbs and piercing moral parables—he championed honesty, craft, modesty, consultation, and justice.',
      ru: 'Выдающийся узбекский поэт и баснописец Кокандской литературной школы. В бессмертном труде «Зарбулмасал», объединившем более 400 народных пословиц и притч, воспел справедливость, честность, мастерство и скромность.',
    },
  },
  {
    id: 'olloyor',
    years: '1644–1721',
    accent: 'teal',
    name: { uz: "So'fi Olloyor", en: 'Sufi Allahyar', ru: 'Суфи Аллаяр' },
    title: { uz: 'Ahli Sunna orifi · Hanafiy-Moturidiy shoir', en: 'Hanafi-Maturidi Scholar & Poet', ru: 'Ханафитско-матуридитский учёный и поэт' },
    place: { uz: "Minglar (Kattaqo'rg'on) / Vaxshivor", en: 'Kattakurgan (Samarkand) / Vakhshivor', ru: 'Каттакурган (Самарканд) / Вахшивор' },
    masterwork: { uz: 'Sabotul Ojizin · Maslakul Muttaqin', en: 'Sabat al-Ajizin · Maslak al-Muttaqin', ru: 'Сабат аль-Аджизин · Маслак аль-Муттакин' },
    bio: {
      uz: "O'zbek xonadonlarida asrlar davomida sevib o'qib kelinayotgan «Sabotul Ojizin» asari muallifi. Ahli Sunna aqidasini, Hanafiy fiqhi odoblarini va qalb pokligini ravon va ta'sirchan baytlarda bayon qilgan.",
      en: 'Beloved Uzbek scholar-poet whose Sabat al-Ajizin has been memorized and cherished in Central Asian homes for centuries, uniting Maturidi creed, Hanafi devotion, and heartfelt spiritual counsel.',
      ru: 'Автор любимого в узбекских семьях на протяжении веков труда «Сабат аль-Аджизин», изложивший в доступных и глубоких стихах акыду Ахль ас-Сунна, фикх и духовное воспитание.',
    },
  },
  {
    id: 'gijduvoniy',
    years: '1103–1179',
    accent: 'violet',
    name: { uz: "Abdulxoliq G'ijduvoniy", en: 'Abdulkhaliq Ghijduwani', ru: 'Абдулхалик Гиждувани' },
    title: { uz: 'Xojai Jahon · Xojagon piri', en: 'Khoja-i Jahan · Master of Khwajagan', ru: 'Ходжа-и Джахан · Наставник Ходжагон' },
    place: { uz: "G'ijduvon (Buxoro)", en: 'Gijduvan (Bukhara)', ru: 'Гиждуван (Бухара)' },
    masterwork: { uz: 'Vasiyatnoma · 8 Kalimoti Qudsiya', en: 'Spiritual Testament · 8 Sacred Principles', ru: 'Васиятнома (Завещание) · 8 принципов' },
    bio: {
      uz: "Buxoroning yetti piri ichida birinchi ulug' ustoz, Xojagon-Naqshbandiya silsilasining asosiy poydevorini qo'ygan alloma. Xafiy (maxfiy) zikr, sunnatga sobitlik, bid'atdan uzoqlik va halol mehnat tamoyillarini ishlab chiqqan.",
      en: 'First of the Seven Pirs of Bukhara and architect of the Khwajagan-Naqshbandi methodology. He established silent remembrance of the heart, strict adherence to Quran and Sunnah, and self-reliant halal livelihood.',
      ru: 'Первый из Семи Пиров Бухары, заложивший фундамент школы Ходжагон-Накшбандия. Установил принципы тихого сердечного зикра, строгой приверженности Сунне и независимого халяльного труда.',
    },
  },
  {
    id: 'buxoriy',
    years: '810–870',
    accent: 'sky',
    name: { uz: 'Imom al-Buxoriy', en: 'Imam al-Bukhari', ru: 'Имам аль-Бухари' },
    title: { uz: "Amirul Mo'minin fil-Hadis", en: 'Commander of the Faithful in Hadith', ru: 'Повелитель правоверных в хадисоведении' },
    place: { uz: 'Buxoro / Xartang (Samarqand)', en: 'Bukhara / Khartang (Samarkand)', ru: 'Бухара / Хартанг (Самарканд)' },
    masterwork: { uz: 'Al-Jomi as-Sahih · Al-Adab al-Mufrad', en: 'Sahih al-Bukhari · Al-Adab al-Mufrad', ru: 'Сахих аль-Бухари · Аль-Адаб аль-Муфрад' },
    bio: {
      uz: "Butun islom olamida Qur'oni Karimdan keyingi eng sahih manba sanalgan «Sahihul Buxoriy» hamda go'zal axloq va odoblar majmuasi — «Al-Adab al-Mufrad» asari muallifi. Taqvo, xolislik va ilm fidoyiligining oliy namunasi.",
      en: 'Author of Sahih al-Bukhari—the most authentic collection of Prophetic traditions—and Al-Adab al-Mufrad on Islamic manners. A towering symbol of scholarly rigor, scrupulous honesty, and devotion.',
      ru: 'Автор «Сахих аль-Бухари» — самого достоверного свода хадисов после Корана — и книги благонравия «Аль-Адаб аль-Муфрад». Высший образец богобоязненности, честности и служения знанию.',
    },
  },
  {
    id: 'moturidiy',
    years: '870–944',
    accent: 'rose',
    name: { uz: 'Imom al-Moturidiy', en: 'Imam al-Maturidi', ru: 'Имам аль-Матуриди' },
    title: { uz: 'Imomul Hudo · Ahli Sunna imomi', en: 'Imam of Guidance · Sunni Creed Master', ru: 'Имам аль-Худа · Имам акыды Ахль ас-Сунна' },
    place: { uz: 'Moturid (Samarqand)', en: 'Maturid (Samarkand)', ru: 'Матурид (Самарканд)' },
    masterwork: { uz: "Kitob at-Tavhid · Ta'vilot Ahlis-Sunna", en: "Kitab al-Tawhid · Ta'wilat Ahl al-Sunnah", ru: 'Китаб ат-Таухид · Тавилат Ахль ас-Сунна' },
    bio: {
      uz: "Samarqandda yetishib chiqqan buyuk kalom va tafsir imomi, butun Movarounnahr va turkiy olam amal qiladigan Moturidiya aqida maktabi asoschisi. Aql va vahiy uyg'unligi, bag'rikenglik va mo'tadillikni ilmiy asoslab bergan.",
      en: 'Great Samarkand theologian and Quran exegete who formalized the Maturidi Sunni creed followed across Central Asia. He demonstrated the harmony of sound reason and Divine Revelation with balance and mercy.',
      ru: 'Великий самаркандский теолог и толкователь Корана, основатель матуридитской школы акыды. Научно обосновал гармонию разума и Откровения, умеренность и мудрость исламского вероучения.',
    },
  },
  {
    id: 'marginoniy',
    years: '1123–1197',
    accent: 'lime',
    name: { uz: "Burhoniddin al-Marg'inoniy", en: 'Burhanuddin al-Marghinani', ru: 'Бурхануддин аль-Маргинани' },
    title: { uz: 'Shayxul Islom · Sohibul Hidoya', en: 'Shaykh al-Islam · Author of Al-Hidayah', ru: 'Шейх аль-Ислам · Автор «Аль-Хидаи»' },
    place: { uz: "Rishton / Marg'ilon / Samarqand", en: 'Rishtan / Margilan / Samarkand', ru: 'Риштан / Маргилан / Самарканд' },
    masterwork: { uz: 'Al-Hidoya (Hanafiy fiqhi qomusi)', en: 'Al-Hidayah (Encyclopedia of Hanafi Law)', ru: 'Аль-Хидая (Энциклопедия ханафитского фикха)' },
    bio: {
      uz: "Farg'ona vodiysida tug'ilib, Samarqandda ijod qilgan mashhur Hanafiy faqihi. 13 yil davomida doimiy ro'za va taqvo bilan yozgan «Al-Hidoya» asari sakkiz asrdan beri butun dunyo madrasalarida asosiy fiqh darsligi bo'lib kelmoqda.",
      en: 'Illustrious Hanafi jurist born in the Fergana Valley whose masterwork Al-Hidayah—composed over 13 years of fasting and devotion—has served for eight centuries as the premier reference of Hanafi jurisprudence.',
      ru: 'Выдающийся ханафитский факих из Ферганской долины, чей монументальный труд «Аль-Хидая», написанный за 13 лет в посте и благочестии, уже восемь веков остаётся главным учебником ханафитского права.',
    },
  },
];

export const WISDOM_ENTRIES: WisdomEntryRaw[] = [
  // ==================== 1. XOJA AHMAD YASSAVIY ====================
  {
    id: 'yas_01',
    scholarId: 'yassaviy',
    topic: 'tawhid',
    isVerse: true,
    work: { uz: 'Devoni Hikmat · 1-hikmat', en: 'Diwan-i Hikmat · Hikmat 1', ru: 'Диван-и Хикмат · Хикмат 1' },
    heading: { uz: 'Bismilloh bilan boshlangan hikmat', en: 'Wisdom Begun with Bismillah', ru: 'Мудрость, начатая с Бисмиллях' },
    original:
      "Bismilloh deb bayon aylab hikmat aytib,\nToliblarg'a durru gavhar sochtim mano.\nRiyozatni qattig' tortib, qonlar yutib,\nMen daftari soniy so'zin ochtim mano.",
    excerpt: {
      uz: "«Bismilloh» deb hikmat bayon etib, ilm va ma'rifat toliblariga dur-u gavhar kabi so'zlarni sochdim. Qattiq riyozat va mashaqqatlar chekib, qalb daftaridan hikmat eshiklarini ochdim.",
      en: 'Saying “Bismillah”, I set forth wisdom and scattered pearls and jewels for sincere seekers. Enduring deep spiritual discipline and hardship, I opened the second book of inner truth.',
      ru: 'Произнеся «Бисмиллях», я изложил мудрость и рассыпал жемчуга для искренних искателей. Пройдя через суровое духовное воспитание и испытания, я открыл врата сокровенной мудрости.',
    },
    sharh: {
      uz: "Har bir xayrli ishni Allohning ismi — «Bismilloh» bilan boshlash baraka garovidir. Yassaviy hikmatlari quruq nazariya emas, balki hayotiy mashaqqat, sabr va ixlosdan tug'ilgan ma'naviy tajribadir.",
      en: 'Beginning every worthy endeavor with Bismillah brings barakah. Yasawi reminds us that authentic spiritual insight is born not of empty talk, but of patient discipline and sincerity.',
      ru: 'Всякое благое дело обретает благодать, когда начинается с «Бисмиллях». Яссави напоминает, что подлинная мудрость рождается из терпения, усердия и искренности, а не из пустых слов.',
    },
  },
  {
    id: 'yas_02',
    scholarId: 'yassaviy',
    topic: 'odob',
    isVerse: true,
    work: { uz: 'Devoni Hikmat', en: 'Diwan-i Hikmat', ru: 'Диван-и Хикмат' },
    heading: { uz: "Ko'ngli siniqlarga marham bo'lish", en: 'Being a Balm to the Broken-Hearted', ru: 'Быть бальзамом для разбитых сердец' },
    original:
      "Qayerda ko'rsang ko'ngli siniq, marham bo'lgil,\nAndog' mazlum yo'lda qolsa, hamdam bo'lgil.\nRo'zi mahshar dargohig'a mahram bo'lgil,\nMolu mulkdin kechganlardin bo'ldum mano.",
    excerpt: {
      uz: "Qayerda ko'ngli o'ksik, qalbi siniq insonni ko'rsang, unga malham bo'l; mazlum va g'arib yo'lda qolsa, unga hamroh va ko'makchi bo'l — shunda Qiyomat kuni Allohning rahmatiga yaqin bo'lasan.",
      en: 'Wherever you see a broken-hearted soul, be a healing balm; if the oppressed or lonely is stranded on the road, walk beside them — so that on the Day of Gathering you may draw near to Allah’s mercy.',
      ru: 'Где бы ты ни увидел человека с разбитым сердцем — стань ему целебным бальзамом; если обиженный остался в пути — стань ему опорой, чтобы в День Суда быть близким к милости Аллаха.',
    },
    sharh: {
      uz: "Islomda ibodat faqat joynamoz ustida emas, balki yetim, g'arib va ko'ngli o'ksik bandalarning qalbini shod etish bilan mukammal bo'ladi. Bir kishining dilini og'ritmaslik va ko'nglini ko'tarish eng ulug' sadaqalardandir.",
      en: 'Devotion in Islam reaches completeness through mercy to people. Uplifting a grieving or vulnerable heart is one of the fastest pathways to Allah’s pleasure.',
      ru: 'Богослужение обретает полноту через милосердие к людям. Утешить опечаленного и поддержать слабого — один из самых благородных путей к довольству Всевышнего.',
    },
  },
  {
    id: 'yas_03',
    scholarId: 'yassaviy',
    topic: 'nafs',
    isVerse: true,
    work: { uz: 'Devoni Hikmat', en: 'Diwan-i Hikmat', ru: 'Диван-и Хикмат' },
    heading: { uz: 'Nafsni jilovlash — eng katta kurash', en: 'Taming the Nafs: The Greatest Struggle', ru: 'Обуздание нафса — главная борьба' },
    original:
      "Nafsim meni yo'ldin urub xor ayladi,\nTermulturub xaloyiqqa zor ayladi.\nZikr aytdurmay shayton bila yor ayladi,\nHozirsen deb nafs boshini yanchtim mano.",
    excerpt: {
      uz: "Jilovlanmagan nafs insonni to'g'ri yo'ldan ozdirib xor qiladi, o'zgalar oldida muhtoj va muftalo etadi, zikrdan chalg'itib shaytonga do'st qiladi. Alloh hamisha hozir va ko'rib turguvchi ekanini anglab, nafs havosini yengdim.",
      en: 'An unchecked ego leads a person astray, humiliates them before creation, and pulls them away from remembrance. Remembering that Allah is ever-present and witnessing, I crushed the arrogance of my nafs.',
      ru: 'Необузданный нафс сбивает человека с верного пути, унижает его и отвлекает от поминания Аллаха. Осознав, что Всевышний всегда видит нас, я обуздал страсти своего нафса.',
    },
    sharh: {
      uz: "Insonning eng xavfli dushmani tashqarida emas, ichidagi kibr, hasad va shahvatga undovchi nafsdir. «Alloh meni ko'rib turibdi» (ehson) tuyg'usi nafsni tarbiyalashning eng samarali vositasidir.",
      en: 'Our fiercest adversary is rarely outside us—it is unchecked pride, envy, and appetite within. Living with Ihsan (constant awareness that Allah sees us) is the surest cure.',
      ru: 'Главный враг человека — не извне, а внутри: гордыня, зависть и потакание страстям. Постоянное осознание того, что Аллах видит нас (ихсан), — лучшее лекарство для души.',
    },
  },
  {
    id: 'yas_04',
    scholarId: 'yassaviy',
    topic: 'qalb',
    isVerse: true,
    work: { uz: 'Devoni Hikmat', en: 'Diwan-i Hikmat', ru: 'Диван-и Хикмат' },
    heading: { uz: 'Sahar vaqtining fayzi va tavba', en: 'The Radiance of Dawn & Repentance', ru: 'Благодать рассветных часов и покаяние' },
    original:
      "Saharlarda tura kelgil, zikr aytg'il,\nHaq yodidin g'ofil bo'lma, tavba qilg'il.\nKo'z yoshingni daryo qilib duo qilg'il,\nRahmat daryo jo'sh urganda yetgum mano.",
    excerpt: {
      uz: "Sahar chog'larida uyg'onib Allohni zikr et, Haqning yodidan g'ofil bo'lma va chin dildan tavba qil. Samimiy ko'z yosh bilan duo qil — Allohning cheksiz rahmat daryosi jo'sh urgan paytda najot topasan.",
      en: 'Rise in the quiet pre-dawn hours, remember Allah, do not slip into heedlessness, and turn in sincere repentance. Supplicate with a softened heart when the ocean of Divine Mercy overflows.',
      ru: 'Просыпайся в предрассветные часы, поминай Всевышнего, не поддавайся беспечности и искренне кайся. Возноси мольбу с мягким сердцем, когда изливается океан Божьей милости.',
    },
    sharh: {
      uz: "Bomdoddan oldingi sahar vaqti — duolar ijobat bo'ladigan, qalb eng musaffo bo'ladigan muborak soatdir. Hatto ikki rakat tahajjud va qisqa istig'for kun bo'yi qalbga osoyishtalik beradi.",
      en: 'The pre-dawn hour before Fajr is the purest time of stillness and answered prayers. Even two quiet rakats and a few moments of istighfar infuse the entire day with serenity.',
      ru: 'Предрассветный час перед Фаджром — самое чистое время для искренней мольбы. Даже два ракаата тахаджуда и короткий истигфар дарят покой на весь день.',
    },
  },
  {
    id: 'yas_05',
    scholarId: 'yassaviy',
    topic: 'ilm',
    isVerse: true,
    work: { uz: 'Devoni Hikmat', en: 'Diwan-i Hikmat', ru: 'Диван-и Хикмат' },
    heading: { uz: 'Amalsiz olimlik va riyodan ogohlantirish', en: 'Warning Against Knowledge Without Action', ru: 'Предостережение от знаний без дел' },
    original:
      "Olimman deb kitob o'qur, ma'no bilmas,\nKo'p oyatning mazmunini dilga ilmas.\nTakabburlik aylab, xalqni ko'zga ilmas,\nOlim emas, johil erur andog' kishi.",
    excerpt: {
      uz: "«Olimman» deb kitob varaqlasa-yu, ma'nosiga amal qilmasa, oyatlar hikmatini qalbiga joylamasa va kibrlanib odamlarni mensimasa — bunday odam haqiqiy olim emas, balki johildir.",
      en: 'Whoever claims to be learned yet misses the spirit of what they read, fails to live by the verses, and looks down on people in pride is not a true scholar, but ignorant.',
      ru: 'Тот, кто называет себя учёным, но не воплощает смысл прочитанного в жизни и с высокомерием смотрит на людей, — на самом деле не учёный, а невежда.',
    },
    sharh: {
      uz: "Haqiqiy ilm kishini kibrli emas, aksincha kamtarin, muloyim va amalda peshqadam qiladi. Ilmning mevasi — go'zal axloq va xolis amaldir.",
      en: 'Authentic knowledge never inflates the ego—it cultivates humility, gentleness, and upright action. The true fruit of learning is noble character.',
      ru: 'Истинное знание не рождает гордыню — оно делает человека скромнее, мягче и деятельнее в добре. Плод знания — благородный нрав.',
    },
  },
  {
    id: 'yas_06',
    scholarId: 'yassaviy',
    topic: 'mehnat',
    isVerse: true,
    work: { uz: 'Devoni Hikmat', en: 'Diwan-i Hikmat', ru: 'Диван-и Хикмат' },
    heading: { uz: 'Umr g‘animati va ezgu amal', en: 'Treasuring Fleeting Time', ru: 'Ценность быстротечной жизни' },
    original:
      "Ey birodar, bu dunyoning umri ozdir,\nG'aflat ichra o'tgan kunlar barchasi bozdir.\nYaxshilik qil, qo'ldan kelsa, elga xizmat,\nOxiratda hamroh bo'lur solih amal.",
    excerpt: {
      uz: "Ey birodar, bu dunyoning umri qisqadir, g'aflatda o'tgan har bir kun qo'ldan ketgan g'animatdir. Qo'lingdan kelgancha elga xizmat va yaxshilik qil — oxiratda senga faqat solih amaling hamroh bo'ladi.",
      en: 'O brother, life in this world is brief; every day spent in heedlessness slips away forever. Serve people and do good while you can—for only righteous deeds will accompany you into the Hereafter.',
      ru: 'О брат, земная жизнь коротка, и каждый день в беспечности уходит безвозвратно. Твори добро и служи людям, пока есть силы — в Вечность тебя проводят лишь праведные дела.',
    },
    sharh: {
      uz: "Xoja Ahmad Yassaviy o'zi ham yog'ochdan qoshiq va cho'michlar yasab halol rizq topgan va topganini muhtojlarga ulashgan. Har bir kunimizni foydali mehnat va xayrli ish bilan bezash — sunnatdir.",
      en: 'Yasawi himself carved wooden spoons with his own hands to earn a halal living and shared with the needy. Filling each day with honest work and kindness is a timeless Sunnah.',
      ru: 'Сам Ахмад Яссави зарабатывал на жизнь собственным ремеслом — резьбой по дереву — и помогал нуждающимся. Наполнять каждый день честным трудом и добром — живая Сунна.',
    },
  },

  // ==================== 2. BAHOUDDIN NAQSHBAND ====================
  {
    id: 'naq_01',
    scholarId: 'naqshband',
    topic: 'mehnat',
    isVerse: false,
    work: { uz: 'Naqshbandiya bosh shiori · Rashahot', en: 'Core Maxim · Rashahat', ru: 'Главный девиз · Рашахат' },
    heading: { uz: '«Dil ba yoru, dast ba kor!»', en: '“Heart with the Beloved, Hands at Work!”', ru: '«Сердце с Богом, а руки в труде!»' },
    original: 'دِل با یار و دَست با کار',
    excerpt: {
      uz: "«Qalbing Alloh bilan, qo'ling esa halol mehnatda bo'lsin!» — Haqiqiy mo'min dunyoni tark etib boqimanda bo'lmaydi; u kasb-hunar qiladi, oilasini boqadi, elga foyda keltiradi va ayni chog'da qalbini Allohning zikridan uzmaydi.",
      en: '“Keep your heart with Allah and your hands engaged in honest work!” A true believer does not retreat into idleness; they work diligently, provide for their family, serve society, and keep their heart connected to Allah.',
      ru: '«Пусть сердце твоё будет с Аллахом, а руки — в честном труде!» Истинный верующий не уходит в безделье: он трудится, кормит семью, приносит пользу людям и при этом не отрывает сердце от поминания Творца.',
    },
    sharh: {
      uz: "Bu oltin qoida butun Movarounnahr madaniyatining tayanchiga aylangan. Bugungi zamonda ham talaba, shifokor, muhandis yoki tadbirkor o'z ishini sidqidildan va halol bajarsa, uning mehnati ham ibodat darajasiga ko'tariladi.",
      en: 'This golden maxim shaped Central Asian civilization. Today, whether you are a student, doctor, engineer, or merchant, performing honest work with excellence and remembrance turns daily labor into worship.',
      ru: 'Этот золотой принцип стал опорой культуры Мавераннахра. И сегодня честный, добросовестный труд врача, инженера, учителя или мастера при чистом намерении возвышается до степени поклонения.',
    },
  },
  {
    id: 'naq_02',
    scholarId: 'naqshband',
    topic: 'qalb',
    isVerse: false,
    work: { uz: 'Kalimoti Qudsiya · Naqshbandiya asoslari', en: 'Kalimat-i Qudsiyya · Sacred Principles', ru: 'Калимат-и Кудсийя · Священные принципы' },
    heading: { uz: 'Xilvat dar anjuman (El ichida xotirjamlik)', en: 'Solitude Within the Crowd', ru: 'Уединение среди людей' },
    original: 'خَلوَت دَر اَنجُمَن',
    excerpt: {
      uz: "«Tashqarida xalq bilan birga bo'l, ichkarida esa Haq bilan!» — Ya'ni odamlar orasida yashab, muomala va tirikchilik qilarkan, qalbingni g'aflat va dunyo g'ulg'ulasiga asir qilma; botiningda Alloh bilan bog'liqlikni saqla.",
      en: '“Outwardly be with people, inwardly be with Allah.” Engage warmly in community, family, and work without letting noise, anxiety, or worldliness conquer your inner sanctuary of remembrance.',
      ru: '«Внешне будь с людьми, внутренне — с Всевышним». Живи в обществе, общайся и трудись, но не позволяй суете и тревогам захватить твоё сердце — храни внутреннюю связь с Аллахом.',
    },
    sharh: {
      uz: "Shovqinli va shoshqaloq zamonaviy hayotda qalb xotirjamligini saqlash eng muhim mahoratdir. Ish orasida ham qisqa «Subhanalloh», «Alhamdulillah» deb qalbni uyg'oq tutish — «Xilvat dar anjuman»ning amaliy ko'rinishidir.",
      en: 'In today’s noisy digital world, guarding inner stillness is priceless. Quietly remembering Allah in the midst of traffic, meetings, or study brings “solitude within the crowd” to life.',
      ru: 'В шумном ритме современной жизни хранить внутренний покой бесценно. Тихое поминание Аллаха в дороге, на работе или учёбе — живое воплощение принципа «Хальват дар анджуман».',
    },
  },
  {
    id: 'naq_03',
    scholarId: 'naqshband',
    topic: 'nafs',
    isVerse: false,
    work: { uz: 'Kalimoti Qudsiya', en: 'Kalimat-i Qudsiyya', ru: 'Калимат-и Кудсийя' },
    heading: { uz: 'Hush dar dam va Nazar bar qadam', en: 'Awareness in Every Breath & Watchful Steps', ru: 'Осознанность дыхания и внимание к шагам' },
    original: 'هُوش دَر دَم · نَظَر بَر قَدَم',
    excerpt: {
      uz: "«Hush dar dam» — har bir nafasni g'aflatdan xoli, Allohning ne'matini his qilib olishdir. «Nazar bar qadam» — ko'zni behuda narsalardan tiyib, qadamini o'ylab bosish va maqsaddan chalg'imaslikdir.",
      en: '“Hush dar dam” means taking each breath consciously rather than in heedlessness. “Nazar bar qadam” means keeping your gaze modest and focused on your own steps, free from pointless distraction.',
      ru: '«Хуш дар дам» — осознавать каждый вдох без беспечности, помня о милости Творца. «Назар бар кадам» — оберегать взор от лишнего и твёрдо следить за собственными шагами, не отвлекаясь на суету.',
    },
    sharh: {
      uz: "Birovning aybini izlash yoki keraksiz ma'lumotlarga ko'z yugurtirish qalb nurini so'ndiradi. O'z qadamiga, o'z nafasiga va o'z amallariga e'tibor qaratgan inson ruhiy sokinlik topadi.",
      en: 'Constantly comparing ourselves to others or scrolling aimlessly scatters the heart. Watching your own breath, gaze, and responsibilities restores clarity and peace.',
      ru: 'Бесцельное сравнение себя с другими и суетливое поглощение лишнего рассеивают сердце. Внимание к собственному дыханию, взгляду и делам возвращает душевную ясность.',
    },
  },
  {
    id: 'naq_04',
    scholarId: 'naqshband',
    topic: 'mehnat',
    isVerse: false,
    work: { uz: 'Anisut-tolibin (Saloh ibn Muborak)', en: 'Anis al-Talibin', ru: 'Анис ат-Талибин' },
    heading: { uz: 'Halol luqma — ibodat va duo asosi', en: 'Halal Provision: The Root of Accepted Worship', ru: 'Халяльный заработок — корень поклонения' },
    excerpt: {
      uz: "Bahouddin Naqshband aytdilar: «Ibodat o'n qismdan iborat: uning to'qqiz qismi halol rizq talab qilish, bir qismi esa qolgan ibodatlardir. Luqma pok bo'lmasa, qalbda xushu va ma'rifat nuri paydo bo'lmaydi».",
      en: 'Bahauddin Naqshband taught: “Worship consists of ten parts: nine parts are seeking pure halal sustenance, and one part is all other acts of devotion. Without lawful nourishment, the heart cannot taste spiritual clarity.”',
      ru: 'Бахауддин Накшбанд говорил: «Поклонение состоит из десяти частей: девять из них — поиск чистого халяльного пропитания, а одна — остальные виды поклонения. Без чистой пищи сердце не обретёт света».',
    },
    sharh: {
      uz: "Hazrat Naqshband umr bo'yi o'z qo'llari bilan kimxob mato to'qib, arpa ekib kun kechirganlar va podshohlarning hadyalarini qabul qilmaganlar. Halol topish va halol yeyish — baraka va duolar ijobatining kalitidir.",
      en: 'Imam Naqshband personally wove silk brocade and farmed barley, declining royal gifts to preserve pure independence. Honest earnings open the doors of barakah and answered prayers.',
      ru: 'Хазрат Накшбанд сам ткал парчу и возделывал землю, отказываясь от даров правителей. Честный заработок — ключ к благодати в доме и принятию молитв.',
    },
  },
  {
    id: 'naq_05',
    scholarId: 'naqshband',
    topic: 'odob',
    isVerse: false,
    work: { uz: 'Rashahot aynil-hayot', en: 'Rashahat Ayn al-Hayat', ru: 'Рашахат Айн аль-Хаят' },
    heading: { uz: "Kamtarlik va hech kimga ozor bermaslik", en: 'True Humility & Harmlessness', ru: 'Истинное смирение и непричинение вреда' },
    excerpt: {
      uz: "Undan so'radilar: «Bu darajaga qanday yetishdingiz?» Dedilar: «Hech qachon o'zimni biror insondan ustun ko'rmadim; hatto yo'ldagi itni ko'rsam ham, uning mendan yaxshiroq bo'lishi mumkinligini o'yladim va qo'limdan kelgancha barchaga yaxshilik qildim».",
      en: 'When asked how he attained his spiritual station, he replied: “I never viewed myself as superior to anyone; I strove to carry no arrogance in my heart and to bring comfort rather than harm to every creature.”',
      ru: 'Когда его спросили, как он достиг такой духовной высоты, он ответил: «Я никогда не считал себя лучше кого-либо и старался никому не причинять обиды, принося лишь добро».',
    },
    sharh: {
      uz: "O'zini boshqalardan yuqori tutish — barcha ruhiy illatlarning ildizidir. Kamtarlik insonning qadrini tushirmaydi, aksincha uni Alloh va odamlar nazdida aziz qiladi.",
      en: 'Feeling superior to others is the hidden root of spiritual decline. Genuine humility never lowers a person—it elevates them in dignity before both Allah and humanity.',
      ru: 'Высокомерие — корень духовных болезней. Искренняя скромность не унижает человека, а возвышает его перед Богом и людьми.',
    },
  },
  {
    id: 'naq_06',
    scholarId: 'naqshband',
    topic: 'qalb',
    isVerse: false,
    work: { uz: 'Kalimoti Qudsiya · Safar dar vatan', en: 'Kalimat-i Qudsiyya · Journey Homeward', ru: 'Калимат-и Кудсийя · Путешествие внутри себя' },
    heading: { uz: 'Safar dar vatan va Vuqufi zamoniy', en: 'Inner Journey & Daily Self-Accounting', ru: 'Внутреннее странствие и самоотчёт' },
    original: 'سَفَر دَر وَطَن · وُقُوفِ زَمَانِی',
    excerpt: {
      uz: "«Safar dar vatan» — yomon xulqlardan go'zal axloq sari ichki safar qilishdir. «Vuqufi zamoniy» esa har soat va har kecha o'z holini sarhisob qilish: agar toatda o'tgan bo'lsa shukr etish, g'aflatda o'tgan bo'lsa istig'for aytishdir.",
      en: '“Safar dar watan” is the inward journey from blameworthy habits to noble character. “Wuquf-i zamani” is pausing regularly to review your hours: offering gratitude for moments of goodness and seeking forgiveness for heedlessness.',
      ru: '«Сафар дар ватан» — внутренний путь от дурных привычек к благородству. «Вукуф-и замани» — регулярный самоотчёт: благодарить Аллаха за благое время и просить прощения за упущенное.',
    },
    sharh: {
      uz: "Har kecha uxlashdan oldin 2 daqiqa o'zingizga savol bering: «Bugun kimga yaxshilik qildim? Qaysi ishimda xatoga yo'l qo'ydim?» — bu Naqshbandiya tariqatidagi eng kuchli o'z-o'zini tarbiyalash odatidir.",
      en: 'Take two quiet minutes before sleep each night to ask: “Whom did I benefit today, and where did I slip?” That daily reflection steadily transforms character.',
      ru: 'Уделяйте перед сном две минуты спокойному самоотчёту: «Кому я сегодня помог? Где допустил оплошность?» Эта привычка удивительным образом очищает жизнь.',
    },
  },

  // ==================== 3. ALISHER NAVOIY ====================
  {
    id: 'nav_01',
    scholarId: 'navoiy',
    topic: 'odob',
    isVerse: true,
    work: { uz: "Arba'in (Qirq Hadis) · 1-hadis", en: "Arba'in (40 Hadiths) · Hadith 1", ru: 'Арбаин (40 хадисов) · Хадис 1' },
    heading: { uz: 'Kamil iymon mezoni', en: 'The Measure of Complete Faith', ru: 'Мерило совершенной веры' },
    original:
      "Mo'min ermastur ulki iymondin,\nRo'zgorida yuz safo ko'rgay.\nTokki qardoshig'a ravo ko'rmas,\nHar nekim o'ziga ravo ko'rgay.",
    excerpt: {
      uz: "«O'ziga ravo ko'rgan yaxshilikni birodariga ham ravo ko'rmaguncha hech biringiz komil mo'min bo'la olmaysiz» (Sahihul Buxoriy, 13-hadis) — Navoiy bu hadisni eng birinchi ruboiy qilib tanlagan.",
      en: '“None of you truly attains complete faith until he loves for his brother what he loves for himself.” (Sahih al-Bukhari 13) — Navoi chose this very hadith to open his Forty Hadiths.',
      ru: '«Не уверует никто из вас по-настоящему, пока не пожелает своему брату того же блага, что желает себе» (Сахих аль-Бухари, 13) — именно этим хадисом Навои открыл свой «Арбаин».',
    },
    sharh: {
      uz: "Hasad va xudbinlik ketgan joyda chinakam birodarlik boshlanadi. Do'stingiz, qo'shningiz va hamkasbingizning muvaffaqiyatiga o'z yutug'ingizdek quvonish — komil iymon belgisidir.",
      en: 'True brotherhood begins where envy and selfishness end. Rejoicing sincerely in a neighbor’s or colleague’s blessing as if it were your own is the hallmark of mature faith.',
      ru: 'Настоящее братство начинается там, где исчезает зависть. Искренне радоваться успеху ближнего, как своему собственному, — признак зрелой веры.',
    },
  },
  {
    id: 'nav_02',
    scholarId: 'navoiy',
    topic: 'mehnat',
    isVerse: true,
    work: { uz: "Arba'in (Qirq Hadis)", en: "Arba'in (40 Hadiths)", ru: 'Арбаин (40 хадисов)' },
    heading: { uz: 'Insonlarning eng yaxshisi kim?', en: 'Who Is the Best Among People?', ru: 'Кто лучший из людей?' },
    original:
      "Xalq aro yaxshiroq, deding, kimdur?\nEshitib, ayla shubha raf' andin:\nYaxshiroqdur ulki, xalq aro ko'prak,\nYetsa naf'i uning ulusg'a andin.",
    excerpt: {
      uz: "«Insonlarning eng yaxshisi — odamlarga ko'proq foydasi tegadigan kishidir» (Hadisi sharif). Navoiy: «Odamlar orasida eng yaxshisi kim deb so'rasang, shubhasiz el-yurtga ko'proq manfaati yetadigan insondir».",
      en: '“The best of people are those who bring the greatest benefit to others.” Navoi renders it in verse: ask without doubt who excels among humanity—it is the one whose kindness and usefulness reach the most people.',
      ru: '«Лучший из людей тот, кто приносит наибольшую пользу людям». Навои воспел этот хадис: если спросишь, кто лучший среди людей — без сомнения тот, от кого обществу больше всего пользы.',
    },
    sharh: {
      uz: "Insonning qadri qancha mol to'plagani bilan emas, balki boshqalarning og'irini yengil qilgani, ilm, mehr va foydali mehnati bilan o'lchanadi.",
      en: 'A person’s true stature is measured not by how much they accumulate, but by how many lives they ease through knowledge, kindness, and service.',
      ru: 'Истинная ценность человека измеряется не накопленным богатством, а тем, скольким людям он облегчил жизнь знаниями, трудом и заботой.',
    },
  },
  {
    id: 'nav_03',
    scholarId: 'navoiy',
    topic: 'odob',
    isVerse: true,
    work: { uz: 'Hayrat ul-Abror · Ota-ona hurmati', en: 'Hayrat al-Abrar · Honoring Parents', ru: 'Хайрат аль-Абрар · Почитание родителей' },
    heading: { uz: 'Ota-onaga ehtirom va xizmat', en: 'Devotion to Mother and Father', ru: 'Почтение и служение родителям' },
    original:
      "Boshni fido ayla ato qoshig'a,\nJismni qil sadqa ano boshig'a.\nTun-kuningga aylagali nur fosh,\nBirisin oy angla, birisin quyosh.",
    excerpt: {
      uz: "Otang oldida boshingni egib ehtirom ko'rsat, onang yo'lida bor kuchingni fido qil. Hayotingning tuni va kunini yoritib turishi uchun birini oy, ikkinchisini esa quyosh deb bil!",
      en: 'Bow your head in reverence before your father, devote your strength to your mother’s care; to keep both your night and day illuminated, regard one as the moon and the other as the sun.',
      ru: 'Склони голову в почтении перед отцом, отдай силы ради заботы о матери; чтобы твой день и твоя ночь всегда были озарены светом — считай одного луной, а другую солнцем.',
    },
    sharh: {
      uz: "Qur'oni Karimda Allohga ibodatdan so'ng darhol ota-onaga yaxshilik qilish buyurilgan. Navoiy ota-onani hayotimizning quyoshi va oyi deya ta'riflab, ularning duosini olish saodat kaliti ekanini eslatadi.",
      en: 'Right after worship of Allah, the Quran commands excellence toward parents. Calling them the sun and moon of our lives, Navoi reminds us that their prayers are the key to every blessing.',
      ru: 'Сразу после поклонения Всевышнему Коран велит благодеяние родителям. Называя их солнцем и луной нашей жизни, Навои напоминает, что их благословение — ключ к счастью.',
    },
  },
  {
    id: 'nav_04',
    scholarId: 'navoiy',
    topic: 'nafs',
    isVerse: true,
    work: { uz: "Arba'in (Qirq Hadis) · Qanoat", en: "Arba'in (40 Hadiths) · Contentment", ru: 'Арбаин (40 хадисов) · Довольство малым' },
    heading: { uz: 'Haqiqiy boylik — qalb to‘qligidadir', en: 'True Wealth Is Richness of the Soul', ru: 'Истинное богатство — богатство души' },
    original:
      "Tama'u hirs rishtasin uzgil,\nQanoat mulkini o'zingga tuzgil.\nBoylik ermas durur ko'p molu davlat,\nHaqiqiy boylik — nafsing to'qlig'idur.",
    excerpt: {
      uz: "«Boylik mol-dunyo ko'pligida emas, balki nafsning to'qligida (qanoatida)dir» (Sahihul Buxoriy, 6446-hadis). Tama va ochko'zlik arqonini uzib, qanoat mulkini topgan inson eng badavlat kishidir.",
      en: '“Wealth is not an abundance of possessions; true wealth is the richness and contentment of the soul.” (Sahih al-Bukhari 6446). Sever the rope of greed, and contentment makes you sovereign.',
      ru: '«Богатство не в обилии имущества, а в богатстве души (довольстве малым)» (Сахих аль-Бухари, 6446). Разорвав путы алчности, человек обретает подлинную свободу и достаток.',
    },
    sharh: {
      uz: "Qanoat — dangasalik emas, balki halol harakat qilib, Alloh bergan rizqqa rozi bo'lish va birovning qo'liga qaramaslikdir. Qanoatli qalb doim xotirjam va shukrli bo'ladi.",
      en: 'Contentment is not laziness—it is striving lawfully while remaining grateful for what Allah grants and never coveting what others own.',
      ru: 'Довольство малым — не лень, а честный труд с благодарностью за дарованное Аллахом и свобода от зависти к чужому.',
    },
  },
  {
    id: 'nav_05',
    scholarId: 'navoiy',
    topic: 'odob',
    isVerse: true,
    work: { uz: "Arba'in · Shirin so'z sadaqasi", en: "Arba'in · Kind Speech Is Charity", ru: 'Арбаин · Доброе слово — милостыня' },
    heading: { uz: 'Yaxshi so‘z — ulug‘ sadaqa', en: 'A Kind Word Is Charity', ru: 'Доброе слово — великая милостыня' },
    original:
      "Do'zax o'tidin qutilmoq istasang,\nYarim xurmo ila bo'lsin saxovat.\nAgar qo'lingda yo'q ersa ul ham,\nShirin so'z ila ayla elga muruvvat.",
    excerpt: {
      uz: "«Yarimta xurmo sadaqa qilib bo'lsa ham o'zingizni do'zax o'tidan saqlang; agar uni ham topolmasangiz, shirin so'z bilan!» (Sahihul Buxoriy). Navoiy qo'lda mol bo'lmasa ham, mehrli va go'zal so'z bilan ko'ngil olishni buyuk ehson deb ta'riflaydi.",
      en: '“Shield yourself from the Fire even with half a date; and if you do not have that, then with a kind word.” (Sahih al-Bukhari). Even without wealth, gentle speech is noble charity.',
      ru: '«Защитите себя от Огня хотя бы половинкой финика, а если нет и этого — то добрым словом» (Сахих аль-Бухари). Тёплое и бережное слово — милостыня, доступная каждому.',
    },
    sharh: {
      uz: "Ko'pincha bir og'iz mehrli so'z, tabassum va dalda insonning tushkun kunini yoritib yuboradi. Tilimizni g'iybat va qo'pollikdan saqlab, yaxshilikka ishlatish har kuni qila oladigan sadaqamizdir.",
      en: 'A single sincere word of encouragement can lift someone’s entire day. Guarding the tongue from harshness and choosing kindness is charity available to everyone, every day.',
      ru: 'Одно искреннее доброе слово способно согреть человека в трудный день. Беречь язык от грубости и дарить поддержку — милостыня, доступная каждый день.',
    },
  },
  {
    id: 'nav_06',
    scholarId: 'navoiy',
    topic: 'ilm',
    isVerse: false,
    work: { uz: 'Mahbub ul-Qulub', en: 'Mahbub al-Qulub (Beloved of Hearts)', ru: 'Махбуб аль-Кулуб (Возлюбленный сердец)' },
    heading: { uz: 'Til va qalb birligi — rostgo‘ylik', en: 'Harmony of Heart and Tongue', ru: 'Единство сердца и языка — правдивость' },
    excerpt: {
      uz: "«Rostgo'ylik — eng go'zal libos, yolg'onchilik esa inson sharafini yemiruvchi zangdir. Odamning kamoli uning so'zi bilan amali bir xil bo'lishidadir. Tilini asragan — boshini va iymonini asraydi».",
      en: '“Truthfulness is the finest garment, while falsehood is rust that corrodes human dignity. A person’s nobility lies in their words matching their deeds; whoever guards their tongue safeguards their faith.”',
      ru: '«Правдивость — лучшее украшение, а ложь — ржавчина, разрушающая человеческое достоинство. Благородство человека в том, чтобы слово его не расходилось с делом».',
    },
    sharh: {
      uz: "Navoiy «Mahbub ul-Qulub»da jamiyatning har bir toifasi uchun axloqiy mezonlarni ko'rsatgan. Va'daga vafo, halol so'z va tilni tiyish insonni el orasida hurmatli va ishonchli qiladi.",
      en: 'In Mahbub al-Qulub, Navoi lays down ethical compass points for every walk of life. Keeping promises and speaking truthfully builds lasting trust in family, work, and community.',
      ru: 'В «Махбуб аль-Кулуб» Навои оставил нравственный ориентир для всех слоёв общества. Верность слову и честность рождают прочное доверие в семье и деле.',
    },
  },

  // ==================== 4. SO'FI OLLOYOR ====================
  {
    id: 'oll_01',
    scholarId: 'olloyor',
    topic: 'tawhid',
    isVerse: true,
    work: { uz: 'Sabotul Ojizin · Tavhid bobi', en: 'Sabat al-Ajizin · Chapter on Tawhid', ru: 'Сабат аль-Аджизин · Глава о Таухиде' },
    heading: { uz: 'Allohning yagonaligi va o‘xshashi yo‘qligi', en: 'Pure Tawhid: Beyond All Likeness', ru: 'Чистый Таухид: Аллах не подобен ничему' },
    original:
      "Sano avval Xudoyi behisobg'a,\nKi bir dur, o'xshamas hech bir sabobg'a.\nNa makon bor Unga, na jismu surat,\nAzaldin bor erur, boqiy abad-dur.",
    excerpt: {
      uz: "Avvalo cheksiz hamd-u sano yagona Allohgadir: U hech bir maxluqqa o'xshamas. Uning makoni, jismi va surati yo'qdir; U azaldan bor va abadiy boqiy Zotdir.",
      en: 'First and foremost, boundless praise belongs to the One Allah, Who resembles nothing in creation. He has no physical body, shape, or place; He exists eternally without beginning or end.',
      ru: 'Прежде всего безграничная хвала Единому Аллаху, Который не подобен ничему из творений. Он не ограничен местом, не имеет тела и образа; Он Предвечен и Вечен.',
    },
    sharh: {
      uz: "So'fi Olloyor Ahli Sunna (Moturidiya) aqidasining eng muhim qoidasini xalqona tilda tushuntirgan: Alloh taolo makon va zamonni yaratgan Zotdir, U maxluqotlarning sifatlaridan pokdir («Laysa kamislihi shay'»).",
      en: 'Sufi Allahyar expresses the foundational Sunni Maturidi creed in memorable verse: Allah created time and space and transcends every attribute of created things (Quran 42:11).',
      ru: 'Суфи Аллаяр простыми и точными стихами передаёт основу вероубеждения Ахль ас-Сунна (матуридизма): Всевышний создал время и пространство и чист от любых качеств творений (Коран, 42:11).',
    },
  },
  {
    id: 'oll_02',
    scholarId: 'olloyor',
    topic: 'ilm',
    isVerse: true,
    work: { uz: 'Sabotul Ojizin', en: 'Sabat al-Ajizin', ru: 'Сабат аль-Аджизин' },
    heading: { uz: 'Shariat — haqiqiy tariqatning ildizidir', en: 'Shariah Is the Indispensable Root', ru: 'Шариат — незыблемый корень духовности' },
    original:
      "Shariat — bir daraxtdur, mevasi — haq,\nShariatsiz tariqat — barchasi shaq.\nAgar ming yil riyozat cheksa odam,\nShariatdan chiqarsa, topmagay dam.",
    excerpt: {
      uz: "Shariat — mustahkam daraxt, ma'rifat esa uning mevasidir. Shariatsiz da'vo qilingan har qanday yo'l puchdir. Inson ming yil riyozat cheksa ham, Qur'on va Sunnat chegarasidan chiqsa, najot topmaydi.",
      en: 'Shariah is the living tree and spiritual insight is its fruit; any path claiming spirituality outside Shariah is hollow. Even a thousand years of austerity bring no peace if one leaves the Quran and Sunnah.',
      ru: 'Шариат — крепкое дерево, а духовное познание — его плод. Любой путь в обход Шариата — иллюзия. Даже тысяча лет аскезы не принесут блага вне Корана и Сунны.',
    },
    sharh: {
      uz: "Bu baytlar tasavvuf haqidagi eng muhim mezondir: chinakam tasavvuf — farz namoz, ro'za, halol-harom va Payg'ambarimiz ﷺ sunnatlariga mukammal amal qilishning go'zal qalb bilan uyg'unlashuvidir.",
      en: 'These lines set the gold standard of authentic Islamic spirituality: genuine tasawwuf never bypasses prayer, fasting, halal living, or Sunnah—it brings ihsan (excellence and sincerity) into them.',
      ru: 'Эти строки задают главный критерий подлинной духовности: истинный тасаввуф не отменяет намаз, пост и нормы халяля, а наполняет следование Сунне живой искренностью.',
    },
  },
  {
    id: 'oll_03',
    scholarId: 'olloyor',
    topic: 'nafs',
    isVerse: true,
    work: { uz: 'Sabotul Ojizin', en: 'Sabat al-Ajizin', ru: 'Сабат аль-Аджизин' },
    heading: { uz: 'Ojizlikni anglash va kibru havodan saqlanish', en: 'Recognizing Servitude & Avoiding Pride', ru: 'Осознание смирения и защита от гордыни' },
    original:
      "O'zingni bil, ey banda, ojiz-u kam,\nTakabburlik qilurg'a qo'yma bir dam.\nBirovni xor ko'rma, kibr etib sen,\nYaratgan barchani teng ko'rguvchi ul.",
    excerpt: {
      uz: "Ey banda, o'zingning ojiz va Allohga muhtoj ekaningni unutma, bir lahza ham kibrga berilma. Hech kimni kamsitma — zero barcha bandalarni yaratgan va taqvoga qarab baholaydigan Zot Allohdir.",
      en: 'Know yourself, O servant, as humble and ever in need of Allah; never yield even a moment to arrogance. Belittle no one—for the Creator weighs hearts by taqwa, not status.',
      ru: 'Помни, о раб Божий, о своей нужде в Создателе и ни на миг не поддавайся гордыне. Никого не унижай, ибо Творец оценивает людей по богобоязненности, а не по положению.',
    },
    sharh: {
      uz: "«Sabotul Ojizin» — «Ojizlarning matonati» demakdir. Alloh huzurida o'z ojizligini tan olgan kishi eng kuchli ma'naviy quvvatga — tavakkul va sobitlikka erishadi.",
      en: '“Sabat al-Ajizin” means “Steadfastness of the Humble.” Paradoxically, acknowledging our complete dependence on Allah grants unshakable inner resilience.',
      ru: '«Сабат аль-Аджизин» означает «Стойкость смиренных». Признание своей полной зависимости от Всевышнего дарит сердцу непоколебимую внутреннюю опору.',
    },
  },
  {
    id: 'oll_04',
    scholarId: 'olloyor',
    topic: 'odob',
    isVerse: true,
    work: { uz: 'Sabotul Ojizin', en: 'Sabat al-Ajizin', ru: 'Сабат аль-Аджизин' },
    heading: { uz: 'Solih suhbat va yaxshi do‘st tanlash', en: 'The Power of Righteous Company', ru: 'Сила праведного окружения' },
    original:
      "Yomon suhbat kishini yo'ldin ozdir,\nYaxshi hamroh dilga iymon yozdir.\nBuzilgay pok ko'ngil badxulq aro,\nSolihlar majlisin qilgil mudaro.",
    excerpt: {
      uz: "Yomon ulfat va g'ofil davra insonni to'g'ri yo'ldan ozdiradi, yaxshi va solih hamroh esa qalbga iymon va hikmat nurlarini naqshlaydi. Pok ko'ngil yomon xulqlilar orasida xiralashadi — doimo solihlar davrasini izla.",
      en: 'Heedless company pulls the heart off course, whereas righteous friends engrave faith and wisdom upon the soul. Guard your heart by choosing companions who remind you of Allah.',
      ru: 'Дурное окружение сбивает с прямого пути, а праведный спутник укрепляет в сердце веру и мудрость. Оберегай чистоту души, выбирая друзей, напоминающих о добре.',
    },
    sharh: {
      uz: "Inson o'zi ko'p muloqot qiladigan muhitning xulqini yuqtiradi. G'iybat va shikoyat ko'p bo'lgan davralardan uzoq bo'lib, ilm, odob va yaxshilik ulashuvchi do'stlar bilan hamnafas bo'lish qalbni tiriltiradi.",
      en: 'We gradually absorb the character of those we spend time with. Stepping back from gossip and surrounding yourself with principled, uplifting people revitalizes both faith and peace of mind.',
      ru: 'Человек невольно перенимает нравы своего круга. Избегая сплетен и выбирая достойных, светлых собеседников, мы укрепляем и веру, и душевный покой.',
    },
  },
  {
    id: 'oll_05',
    scholarId: 'olloyor',
    topic: 'qalb',
    isVerse: true,
    work: { uz: 'Sabotul Ojizin · Sabr va Tavakkul', en: 'Sabat al-Ajizin · Patience & Trust', ru: 'Сабат аль-Аджизин · Терпение и Упование' },
    heading: { uz: 'Sabr — har mushkulning kaliti', en: 'Patience Unlocks Every Hardship', ru: 'Терпение — ключ ко всякому испытанию' },
    original:
      "Balo kelsa, shikoyat qilma xalqqa,\nTayan yolg'iz karamli ul ulug' Haqqa.\nSabr qilsang, ajr-u rohat yetishgay,\nQorong'u tun ketib, tonglar otishgay.",
    excerpt: {
      uz: "Boshingga sinov tushganda odamlarga arz-dod qilib tushkunlikka tushma; yolg'iz karamli Allohga suyan. Chiroyli sabr qilsang, ulkan ajr va yengillik keladi — har qorong'u kecha ortidan albatta tong otadi.",
      en: 'When trials strike, do not sink into despair complaining to people; lean upon the Most Generous Lord. Through graceful patience comes both reward and relief—after every dark night, dawn surely breaks.',
      ru: 'Когда приходит испытание, не впадай в уныние и жалобы — обопрись на Милостивого Господа. За красивым терпением непременно приходят награда и облегчение: после самой тёмной ночи всегда наступает рассвет.',
    },
    sharh: {
      uz: "Sabr — qiyinchilikka jim chidashgina emas, balki tushkunlikka tushmay, sabablarni ishga solib, natijani Allohning hikmatiga topshirishdir («Fa inna ma'al usri yusro»).",
      en: 'Patience is not passive resignation—it is staying calm, taking wise action, and entrusting the outcome to Allah’s wisdom, knowing that “with hardship comes ease.”',
      ru: 'Терпение — не пассивная покорность, а спокойное упорство: делать всё зависящее от себя и доверять исход мудрости Аллаха.',
    },
  },
  {
    id: 'oll_06',
    scholarId: 'olloyor',
    topic: 'ilm',
    isVerse: true,
    work: { uz: 'Sabotul Ojizin', en: 'Sabat al-Ajizin', ru: 'Сабат аль-Аджизин' },
    heading: { uz: 'Ilm bilan qilingan ibodatning fazilati', en: 'Worship Guided by Sacred Knowledge', ru: 'Поклонение, освещённое знанием' },
    original:
      "Amal qilsang agar bilmay masoil,\nBo'lur ko'p zahmating behuda, zoyil.\nAvval o'rgan namoz, ro'za, halolni,\nSo'ngra topgil saodatli kamolni.",
    excerpt: {
      uz: "Masalalarni bilmay turib amal qilsang, ko'p mashaqqating zoye ketishi mumkin. Avvalo namoz, ro'za, tahorat va halol-harom ilmini to'g'ri o'rgan — shundagina haqiqiy kamolot va saodatga yetasan.",
      en: 'If you strive in worship without learning its proper rulings, much effort may go astray. First learn prayer, purification, fasting, and what is lawful—then ascend toward true spiritual perfection.',
      ru: 'Если совершать поклонение, не зная его основ, многие старания могут пропасть напрасно. Прежде изучи правила намаза, поста, чистоты и халяля — и обретёшь истинное совершенство.',
    },
    sharh: {
      uz: "Har bir musulmonga kundalik hayotida zarur bo'lgan aqida, tahorat, namoz va halol savdo-muomala ilmini o'rganish farzi ayndir. Ilmli ibodat qalbga xotirjamlik va ishonch beradi.",
      en: 'Learning the essential rulings of belief, prayer, purification, and honest dealings is a personal duty for every Muslim—it replaces doubt with serene confidence.',
      ru: 'Изучение основ веры, омовения, намаза и честных сделок — обязанность каждого мусульманина. Осознанное поклонение избавляет от сомнений и приносит уверенность.',
    },
  },

  // ==================== 5. ABDULXOLIQ G'IJDUVONIY ====================
  {
    id: 'gij_01',
    scholarId: 'gijduvoniy',
    topic: 'tawhid',
    isVerse: false,
    work: { uz: 'Vasiyatnoma (Avliyoi Kabirga vasiyat)', en: 'Wasiyyatnama (Spiritual Testament)', ru: 'Васиятнома (Духовное завещание)' },
    heading: { uz: 'Taqvo va Sunnatga mahkam yopishish', en: 'Hold Fast to Taqwa and the Sunnah', ru: 'Держись богобоязненности и Сунны' },
    excerpt: {
      uz: "«Ey farzand! Senga barcha ishlaringda ilm, amal va taqvoni lozim tutishingni vasiyat qilaman. Salafi solihlar yo'lini tut, Ahli Sunna val Jamoa e'tiqodidan qilcha og'ma, fiqh va hadis o'rgan, bid'at va johil da'vogarlardan uzoq bo'l!»",
      en: '“O my son! Hold fast to knowledge, righteous action, and taqwa in every matter. Follow the path of the righteous predecessors, never deviate from the Sunni creed, study fiqh and hadith, and stay far from innovation and ignorant claimants.”',
      ru: '«О сын мой! Завещаю тебе во всех делах держаться знаний, праведных дел и богобоязненности. Следуй пути праведных предков, не отступай от убеждений Ахль ас-Сунна, изучай фикх и хадисы и сторонись нововведений».',
    },
    sharh: {
      uz: "Buxoroning birinchi piri Xoja Abdulxoliq G'ijduvoniyning ushbu vasiyati islomiy ma'rifatning sof, mo'tadil va ilmga asoslangan yo'lini ko'rsatib beradi.",
      en: 'This opening counsel of the First Pir of Bukhara defines Central Asian spirituality at its purest: anchored in authentic knowledge, Sunnah, and balance.',
      ru: 'Это завещание Первого Пира Бухары показывает истинное лицо духовной школы Мавераннахра — ясной, умеренной и основанной на прочном знании.',
    },
  },
  {
    id: 'gij_02',
    scholarId: 'gijduvoniy',
    topic: 'qalb',
    isVerse: false,
    work: { uz: 'Vasiyatnoma · Zikri xafiy', en: 'Wasiyyatnama · Silent Remembrance', ru: 'Васиятнома · Тихий зикр' },
    heading: { uz: 'Zikri xafiy — riyodan xoli qalb zikri', en: 'Silent Dhikr: Sincerity Beyond Ostentation', ru: 'Тихий зикр — искренность без показухи' },
    excerpt: {
      uz: "«Allohni qalbingda sokin va maxfiy zikr qil. Chunki maxfiy zikr riyodan eng uzoq, ixlosga eng yaqindir; uni faqat Alloh biladi va bandaning qalbini tun-u kun nur bilan to'ldiradi».",
      en: '“Remember Allah quietly within your heart. Silent dhikr is farthest from showing off and closest to pure sincerity; known only to Allah, it quietly illuminates the heart day and night.”',
      ru: '«Поминай Аллаха тихо, в глубине сердца. Тайный зикр дальше всего от показухи и ближе всего к чистой искренности: о нём ведает лишь Всевышний, и он наполняет сердце светом день и ночь».',
    },
    sharh: {
      uz: "Xojagon-Naqshbandiya maktabining eng ajib xususiyati — «Zikri xafiy»dir. Odamlar ko'zidan yashirin qilingan zikr va sadaqa qalbni riyo kasalligidan himoya qiladi.",
      en: 'Silent dhikr is the signature legacy of the Khwajagan-Naqshbandi school. Devotion hidden from public applause protects the heart from vanity.',
      ru: 'Тихий сердечный зикр — отличительная черта школы Ходжагон-Накшбандия. Поклонение, скрытое от чужих глаз, надёжно защищает сердце от тщеславия.',
    },
  },
  {
    id: 'gij_03',
    scholarId: 'gijduvoniy',
    topic: 'nafs',
    isVerse: false,
    work: { uz: 'Vasiyatnoma', en: 'Wasiyyatnama', ru: 'Васиятнома' },
    heading: { uz: 'Kam yeyish, kam uxlash, kam gapirish', en: 'Moderation in Food, Sleep & Speech', ru: 'Умеренность в еде, сне и словах' },
    excerpt: {
      uz: "«Ko'p yeyishdan, ko'p uxlashdan va behuda ko'p gapirishdan saqlan. Zero ortiqcha taom qalbni og'irlashtiradi, ortiqcha uyqu umrni qisqartiradi, ortiqcha so'z esa insonni xato va g'iybatga boshlaydi».",
      en: '“Guard yourself against excess in eating, excess in sleeping, and idle chatter. Overeating dulls the heart, oversleeping wastes life, and excessive speech invites slips and backbiting.”',
      ru: '«Оберегай себя от излишеств в еде, сне и пустых разговорах. Переедание утяжеляет сердце, лишний сон сокращает жизнь, а многословие ведёт к ошибкам и злословию».',
    },
    sharh: {
      uz: "Mo'tadillik nafaqat ma'naviy, balki tibbiy va intizomiy jihatdan ham oltin qoidadir. Tanni yengil, vaqtni qadrli va tilni o'lchovli tutgan inson kunini unumli va barakali o'tkazadi.",
      en: 'Moderation is both spiritual wisdom and modern health science. Keeping the body light, sleep disciplined, and speech measured sharpens focus and inner peace.',
      ru: 'Умеренность — золотое правило как духовности, так и здоровья. Бережное отношение к телу, времени и слову делает каждый день ясным и плодотворным.',
    },
  },
  {
    id: 'gij_04',
    scholarId: 'gijduvoniy',
    topic: 'mehnat',
    isVerse: false,
    work: { uz: 'Vasiyatnoma', en: 'Wasiyyatnama', ru: 'Васиятнома' },
    heading: { uz: 'Shuhratparastlikdan qochish va halol mehnat', en: 'Shun Fame & Earn Independent Halal Bread', ru: 'Сторонись славы и живи честным трудом' },
    excerpt: {
      uz: "«Shuhratga intilma, chunki shuhratda ofat bor. Mansab va maqtov ortidan quvma; o'z halol mehnating bilan rizq top, shunda boshing baland, qalbing ozod va so'zing haq bo'ladi».",
      en: '“Do not chase fame, for fame carries hidden peril. Never flatter the powerful for status; earn your living by honest hands so your dignity stays intact and your heart remains free.”',
      ru: '«Не гонись за славой, ибо в ней скрыта опасность. Не ищи похвалы сильных мира сего — живи честным трудом своих рук, и твоё сердце останется свободным, а слово правдивым».',
    },
    sharh: {
      uz: "Ijtimoiy tarmoqlar va «layk»lar asrida G'ijduvoniyning «shuhratga intilma» degan o'giti naqadar dolzarb! Ixlos bilan, odamlar maqtovi uchun emas, Alloh roziligi uchun qilingan ishning savobi ham, barakasi ham boqiydir.",
      en: 'In an age of social media likes and viral attention, Ghijduwani’s warning against chasing fame feels remarkably modern. Work done for Allah’s pleasure—not applause—brings lasting barakah.',
      ru: 'В эпоху соцсетей и погони за вниманием совет Гиждувани звучит особенно актуально: дела, совершённые ради довольства Аллаха, а не ради похвалы, приносят вечную благодать.',
    },
  },
  {
    id: 'gij_05',
    scholarId: 'gijduvoniy',
    topic: 'odob',
    isVerse: false,
    work: { uz: 'Vasiyatnoma', en: 'Wasiyyatnama', ru: 'Васиятнома' },
    heading: { uz: 'Jamoat namozi va oila-qo‘shniga go‘zal muomala', en: 'Congregational Prayer & Kindness to Family', ru: 'Коллективный намаз и доброта к близким' },
    excerpt: {
      uz: "«Besh vaqt namozni jamoat bilan ado etishga haris bo'l. Ahli oilangga muloyim, qo'shningga g'amxo'r, musofirga mehmondo'st bo'l; birovning aybini yashir va odamlar bilan bahs-janjal qilma».",
      en: '“Be eager for the five daily prayers in congregation. Be gentle with your family, caring toward neighbors, and generous to travelers; conceal the faults of others and avoid pointless quarrels.”',
      ru: '«Стремись совершать пять намазов в джамаате. Будь мягок с семьёй, заботлив к соседям и гостеприимен к путникам; скрывай чужие недостатки и избегай пустых споров».',
    },
    sharh: {
      uz: "Uyda xushmuomala bo'lish, qo'shnining holidan xabar olish va janjaldan tiyilish — mo'minning kundalik ko'zgusidir. Qayerda janjal emas, mehr hukmron bo'lsa, o'sha xonadonga baraka yog'iladi.",
      en: 'Gentleness at home, checking on neighbors, and walking away from petty arguments mirror true faith. Mercy invites barakah into every household.',
      ru: 'Мягкость в семье, забота о соседях и отказ от пустых ссор — живое зеркало веры. Там, где царит доброта, в доме всегда будет благодать.',
    },
  },
  {
    id: 'gij_06',
    scholarId: 'gijduvoniy',
    topic: 'qalb',
    isVerse: false,
    work: { uz: 'Kalimoti Qudsiya · Bozgasht & Nigohdosht', en: 'Kalimat-i Qudsiyya · Return & Vigilance', ru: 'Калимат-и Кудсийя · Возвращение и Бдительность' },
    heading: { uz: 'Bozgasht: «Ilohiy, maqsadim Sening roziligingdir»', en: 'Bazgasht: Renewing Pure Intention', ru: 'Базгашт: «О Аллах, цель моя — Твоё довольство»' },
    original: 'اِلٰهِى اَنْتَ مَقْصُودِى وَ رِضَاكَ مَطْلُوبِى',
    excerpt: {
      uz: "«Bozgasht» — har zikrdan so'ng qalbda «Ilohiy, mening yagona maqsadim Sensan va istagim Sening roziligingdir» deya niyatni yangilashdir. «Nigohdosht» esa qalbni yomon xayol va vasvasalardan hushyor qo'riqlashdir.",
      en: '“Bazgasht” is returning the heart during dhikr to the prayer: “O Allah, You alone are my goal and Your pleasure is what I seek.” “Nigahdasht” is watching the doorway of the heart against distracting or harmful thoughts.',
      ru: '«Базгашт» — обновлять намерение в сердце словами: «О Аллах, Ты — моя цель, и Твоего довольства я ищу». «Нигахдашт» — бдительно хранить сердце от дурных и суетных мыслей.',
    },
    sharh: {
      uz: "Kun davomida niyatimiz tez-tez chalg'ib turadi. Shu qisqa muborak jumlani («Ilohiy, maqsadim Sening roziligingdir») qalbda takrorlash har bir ishimizga pok niyat va kuch bag'ishlaydi.",
      en: 'Our intentions drift easily during busy days. Repeating “O Allah, Your pleasure is my goal” realigns work, study, and worship in a single heartbeat.',
      ru: 'В суете дня намерение легко сбивается. Повторяя в сердце «О Аллах, цель моя — Твоё довольство», мы возвращаем чистоту и смысл каждому шагу.',
    },
  },

  // ==================== 6. IMOM AL-BUXORIY ====================
  {
    id: 'bux_01',
    scholarId: 'buxoriy',
    topic: 'qalb',
    isVerse: false,
    work: { uz: 'Sahihul Buxoriy · 1-hadis', en: 'Sahih al-Bukhari · Hadith 1', ru: 'Сахих аль-Бухари · Хадис 1' },
    heading: { uz: 'Barcha amallar niyatga qarab baholanadi', en: 'Every Deed Is Weighed by Its Intention', ru: 'Дела оцениваются по намерениям' },
    original: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    excerpt: {
      uz: "Imom al-Buxoriy ulug' «Sahih» kitoblarini bejiz «Albatta amallar niyatlarga bog'liqdir va har bir kishiga niyat qilgan narsasi berilur» hadisi bilan boshlamaganlar. Chunki xolis niyatsiz eng katta amal ham vaznsiz, xolis niyat bilan qilingan kichik amal esa ulug'dir.",
      en: 'Imam al-Bukhari deliberately opened his monumental Sahih with: “Verily, actions are judged by intentions, and every person shall have what they intended.” Pure intention turns even small daily acts into weighty worship.',
      ru: 'Имам аль-Бухари не случайно открыл свой великий «Сахих» хадисом: «Поистине, дела оцениваются по намерениям, и каждому воздастся по его намерению». Чистое намерение возвышает даже малое благое дело.',
    },
    sharh: {
      uz: "O'qish, ishlash, oilaga taom tayyorlash, ota-onaga qo'ng'iroq qilish — barchasini «Alloh roziligi uchun» degan niyat bilan qilsangiz, oddiy odatlaringiz ham savobli ibodatga aylanadi.",
      en: 'Studying, working, cooking for your family, or calling your parents—when anchored with the intention of pleasing Allah, ordinary routines transform into continuous reward.',
      ru: 'Учёба, работа, забота о семье, звонок родителям — если совершать их с искренним намерением ради довольства Аллаха, повседневные дела превращаются в непрерывную награду.',
    },
  },
  {
    id: 'bux_02',
    scholarId: 'buxoriy',
    topic: 'ilm',
    isVerse: false,
    work: { uz: 'Sahihul Buxoriy · Ilm kitobi, 10-bob', en: 'Sahih al-Bukhari · Book of Knowledge, Ch. 10', ru: 'Сахих аль-Бухари · Книга знаний, гл. 10' },
    heading: { uz: 'Ilm — so‘z va amaldan oldindir', en: 'Knowledge Precedes Speech and Action', ru: 'Знание предшествует слову и делу' },
    original: 'بَابُ الْعِلْمِ قَبْلَ الْقَوْلِ وَالْعَمَلِ',
    excerpt: {
      uz: "Imom al-Buxoriy «Ilm kitobi»da mashhur bob ochganlar: «Ilm so'z va amaldan oldindir», dalil qilib Allohning «Bas, bilgin (ilm olgin): Allohdan o'zga iloh yo'qdir va gunohing uchun istig'for ayt» (Muhammad surasi, 19-oyat) oyatini keltirganlar.",
      en: 'Imam al-Bukhari famously titled Chapter 10 of the Book of Knowledge: “Knowledge comes before speech and action,” citing Quran 47:19 — “So know that there is no god except Allah, and seek forgiveness.”',
      ru: 'Имам аль-Бухари назвал знаменитую главу в «Книге знаний»: «Знание прежде слов и дел», приведя в довод аят Корана (47:19): «Знай же, что нет божества, кроме Аллаха, и проси прощения».',
    },
    sharh: {
      uz: "Gapirishdan, hukm chiqarishdan yoki biror ishga kirishishdan oldin aniq ilm va dalilga suyanish — Buxoriy maktabining bosh qoidasidir. Tekshirilmagan xabar va bilimsiz fatvolardan saqlanish mo'minning farosatidir.",
      en: 'Verifying facts before speaking, judging, or acting is the core spirit of Bukhari’s scholarship. Resisting rumors and unverified claims is a vital Islamic ethic today.',
      ru: 'Проверять знания прежде слов и выводов — основа школы имама аль-Бухари. В наше время особенно важно не распространять непроверенные слухи и опираться на достоверные источники.',
    },
  },
  {
    id: 'bux_03',
    scholarId: 'buxoriy',
    topic: 'odob',
    isVerse: false,
    work: { uz: 'Imom al-Buxoriy hayotidan · Siyar A’lom an-Nubalo', en: 'Biography of Imam al-Bukhari · Siyar', ru: 'Из жизнеописания имама аль-Бухари' },
    heading: { uz: 'G‘iybatdan mutlaqo pok til', en: 'A Tongue Completely Free of Backbiting', ru: 'Язык, совершенно чистый от злословия' },
    excerpt: {
      uz: "Imom al-Buxoriy aytganlar: «Men Alloh taologa biror kimsani g'iybat qilganim sababli hisobga tortilmagan holda yo'liqishni umid qilaman!». Hatto zaif roviylar haqida gapirganda ham qo'pol so'z ishlatmay, «fihi nazar» (unda mulohaza bor) deb nihoyatda odob bilan ifodalaganlar.",
      en: 'Imam al-Bukhari said: “I hope to meet Allah without Him ever calling me to account for having backbitten anyone.” Even when evaluating unreliable narrators, he never used harsh insults—only gentle scholarly phrases.',
      ru: 'Имам аль-Бухари говорил: «Я надеюсь встретить Аллаха так, чтобы Он не спросил с меня за злословие о ком-либо». Даже оценивая ненадёжных передатчиков, он никогда не допускал грубости, используя лишь мягкие научные выражения.',
    },
    sharh: {
      uz: "Hadis tanqidi kabi o'ta nozik ilmiy ishda ham birovning sha'niga hurmat saqlay olgan Imom al-Buxoriy bizga til odobining yuksak namunasini qoldirganlar.",
      en: 'If Imam al-Bukhari could critique historical sources with complete dignity and zero cruelty, we surely can speak about neighbors, coworkers, and strangers online with grace and restraint.',
      ru: 'Если имам аль-Бухари сумел сохранить безупречную деликатность даже в критическом научном труде, то и нам тем более следует беречь честь людей в повседневных беседах и в сети.',
    },
  },
  {
    id: 'bux_04',
    scholarId: 'buxoriy',
    topic: 'odob',
    isVerse: false,
    work: { uz: 'Al-Adab al-Mufrad · 1–3-boblar', en: 'Al-Adab al-Mufrad · Chapters 1–3', ru: 'Аль-Адаб аль-Муфрад · Главы 1–3' },
    heading: { uz: 'Ota-ona roziligi va silai rahm', en: 'Parents’ Pleasure & Keeping Ties of Kinship', ru: 'Довольство родителей и родственные узы' },
    excerpt: {
      uz: "Imom al-Buxoriy axloq va odob haqidagi mashhur «Al-Adab al-Mufrad» asarini aynan ota-onaga yaxshilik qilish va qarindoshlar bilan aloqani bog'lash (silai rahm) boblari bilan boshlaganlar: «Robbning roziligi ota-onaning roziligidadir».",
      en: 'Imam al-Bukhari opened his celebrated book of ethics, Al-Adab al-Mufrad, with honoring parents and maintaining family ties, recording the hadith: “The pleasure of the Lord lies in the pleasure of the parents.”',
      ru: 'Имам аль-Бухари открыл свою знаменитую книгу «Аль-Адаб аль-Муфрад» главами о благодеянии родителям и поддержании родственных связей: «Довольство Господа — в довольстве родителей».',
    },
    sharh: {
      uz: "Buxoriyning o'zi ham bolaligida ko'zi ojiz bo'lib qolganda, onasining tunlari qilgan duosi barakotidan shifo topgan. Ota-ona va qarindoshlarga mehr ko'rsatish — rizq va umr barakasi sababidir.",
      en: 'Al-Bukhari himself lost his sight as a child and recovered through his mother’s tearful nightly prayers. Honoring parents and checking on relatives expands both lifespan and provision.',
      ru: 'Сам имам в детстве потерял зрение и прозрел благодаря ночным молитвам матери. Забота о родителях и родных приумножает благодать в жизни и уделе.',
    },
  },
  {
    id: 'bux_05',
    scholarId: 'buxoriy',
    topic: 'nafs',
    isVerse: false,
    work: { uz: 'Sahihul Buxoriy (6114) · Al-Adab al-Mufrad', en: 'Sahih al-Bukhari (6114) · Al-Adab al-Mufrad', ru: 'Сахих аль-Бухари (6114) · Аль-Адаб аль-Муфрад' },
    heading: { uz: 'Haqiqiy polvon — g‘azabini yenga olgan kishidir', en: 'True Strength Is Mastering Anger', ru: 'Истинная сила — владеть собой в гневе' },
    excerpt: {
      uz: "«Kuchli inson kurashda raqibini yiqitgan kishi emas; haqiqiy kuchli inson — g'azabi kelgan paytda o'zini tiya olgan kishidir». Imom al-Buxoriy bu hadisni odob va bag'rikenglikning eng yorqin mezonlaridan biri sifatida rivoyat qilganlar.",
      en: '“The strong person is not the one who overcomes others in wrestling; rather, the truly strong person is the one who controls themselves in a moment of anger.”',
      ru: '«Силён не тот, кто побеждает в борьбе, а тот, кто способен совладать с собой в минуту гнева». Имам аль-Бухари передал этот хадис как высшее мерило выдержки.',
    },
    sharh: {
      uz: "G'azab lahzasida 10 soniya sukut saqlash, «A'uzu billahi minash-shaytonir rojim» deyish va o'tirib olish — oilani ham, do'stlikni ham, qalb xotirjamligini ham saqlab qoladi.",
      en: 'Pausing for ten seconds in anger, saying “A’udhu billahi minash-shaytanir-rajim,” and softening your tone saves marriages, friendships, and peace of mind.',
      ru: 'Пауза на десять секунд в гневе, слова «Аузу билляхи минаш-шайтанир-раджим» и спокойный тон спасают семьи, дружбу и собственное сердце.',
    },
  },
  {
    id: 'bux_06',
    scholarId: 'buxoriy',
    topic: 'ilm',
    isVerse: false,
    work: { uz: 'Sahihul Buxoriy yozilish tarixi', en: 'History of Compiling Sahih al-Bukhari', ru: 'История составления «Сахих аль-Бухари»' },
    heading: { uz: '16 yillik mehnat va har bir hadisdan oldin 2 rakat namoz', en: '16 Years of Devotion & Prayer Before Every Entry', ru: '16 лет труда и два ракаата перед каждым хадисом' },
    excerpt: {
      uz: "Imom al-Buxoriy aytganlar: «Men “Al-Jomi as-Sahih” kitobimga birorta hadisni kiritishdan avval g'usl qilib, ikki rakat istixora namozi o'qib, uning sahihligiga to'liq ishonch hosil qilganimdan keyingina yozdim».",
      en: 'Imam al-Bukhari recounted: “I never recorded a single hadith in my Sahih without first bathing, praying two rakats of Istikharah, and verifying its authenticity beyond doubt.”',
      ru: 'Имам аль-Бухари рассказывал: «Я не внёс ни одного хадиса в свой “Сахих”, не совершив предварительно омовение, не прочитав два ракаата молитвы истихара и не убедившись полностью в его достоверности».',
    },
    sharh: {
      uz: "Buyuk natijalar shoshqaloqlik bilan emas, balki sabr, halol mas'uliyat va Allohdan madad so'rab qilingan izchil mehnat bilan dunyoga keladi. Shuning uchun «Sahihul Buxoriy» 12 asrdan beri barhayotdir.",
      en: 'Enduring masterpieces are never born of haste—they grow from patience, meticulous integrity, and seeking Allah’s guidance. That is why Sahih al-Bukhari still illuminates the world 12 centuries later.',
      ru: 'Великие труды рождаются не из спешки, а из терпения, предельной ответственности и упования на Аллаха. Поэтому «Сахих аль-Бухари» остаётся светочем уже двенадцать веков.',
    },
  },

  // ==================== 7. IMOM AL-MOTURIDIY ====================
  {
    id: 'mot_01',
    scholarId: 'moturidiy',
    topic: 'ilm',
    isVerse: false,
    work: { uz: 'Kitob at-Tavhid · Bilish nazariyasi', en: 'Kitab al-Tawhid · Epistemology', ru: 'Китаб ат-Таухид · Теория познания' },
    heading: { uz: 'Aql va vahiy — bir-birini to‘ldiruvchi ikki nur', en: 'Reason and Revelation: Two Harmonious Lights', ru: 'Разум и Откровение — два дополняющих света' },
    excerpt: {
      uz: "Imom al-Moturidiy «Kitob at-Tavhid»da haqiqatga eltuvchi uchta ilm manbaini asoslab berganlar: sog'lom sezgi a'zolari (iyyon), ishonchli xabar va vahiy (xabari sodiq) hamda sog'lom tafakkur (aql). Sog'lom aql bilan ilohiy vahiy hech qachon zid kelmaydi.",
      en: 'In Kitab al-Tawhid, Imam al-Maturidi established three valid sources of knowledge: sound sensory observation, truthful report/revelation, and sound reason. Authentic reason and Divine Revelation never contradict.',
      ru: 'В «Китаб ат-Таухид» имам аль-Матуриди обосновал три источника достоверного знания: здоровые органы чувств, правдивое сообщение (Откровение) и здравый разум. Истинный разум и Откровение никогда не противоречат друг другу.',
    },
    sharh: {
      uz: "Aynan Moturidiya maktabining aql va ilmga bergan bu yuksak e'tibori tufayli Samarqand va Buxoroda Al-Xorazmiy, Ibn Sino, Beruniy va Ulug'bek kabi buyuk olimlar yetishib chiqqan. Islom — ilm va tafakkur dinidir.",
      en: 'This Maturidi embrace of sound reason alongside revelation helped fuel the Central Asian Golden Age of Khwarizmi, Ibn Sina, Biruni, and Ulugh Beg. Islam honors both faith and inquiry.',
      ru: 'Именно уважение матуридитской школы к разуму и науке способствовало расцвету золотого века Самарканда и Бухары — эпохе аль-Хорезми, Ибн Сины, Беруни и Улугбека.',
    },
  },
  {
    id: 'mot_02',
    scholarId: 'moturidiy',
    topic: 'tawhid',
    isVerse: false,
    work: { uz: 'Kitob at-Tavhid · Hikmat tushunchasi', en: 'Kitab al-Tawhid · Divine Wisdom', ru: 'Китаб ат-Таухид · О Божественной мудрости' },
    heading: { uz: 'Hikmat — har narsani o‘z munosib o‘rniga qo‘yishdir', en: 'Hikmah: Placing Everything in Its Rightful Place', ru: 'Мудрость — ставить каждую вещь на своё место' },
    excerpt: {
      uz: "Imom al-Moturidiyning mashhur ta'rifi: «Hikmat — har bir narsani o'z munosib o'rniga qo'yish va haqqi bor har bir narsaga haqqini berishdir». Alloh taolo Hakim Zotdir; Uning yaratishida ham, sinovlarida ham hech bir behuda ish yo'q.",
      en: 'Imam al-Maturidi famously defined Hikmah as “placing every single thing in its rightful place and granting every right its due.” Because Allah is Al-Hakim, nothing in His creation or decree is ever in vain.',
      ru: 'Знаменитое определение имама аль-Матуриди: «Мудрость — это умение поставить каждую вещь на подобающее ей место и воздать должное». Всевышний Мудр, и в Его мироздании и испытаниях нет ничего напрасного.',
    },
    sharh: {
      uz: "Hayotimizda darhol tushunolmaydigan qiyinchiliklar kelganda, Moturidiyning ushbu hikmat qoidasini eslash qalbga chuqur sokinlik beradi: Allohning har bir taqdirida biz hali ko'rmagan ulkan hikmat bor.",
      en: 'When life brings twists we cannot yet understand, remembering al-Maturidi’s principle of Divine Hikmah calms the anxious heart: there is wisdom behind every decree.',
      ru: 'Когда жизнь приносит испытания, смысл которых пока скрыт, принцип Божественной мудрости дарит сердцу покой: ничто не происходит напрасно.',
    },
  },
  {
    id: 'mot_03',
    scholarId: 'moturidiy',
    topic: 'tawhid',
    isVerse: false,
    work: { uz: "Ta'vilot Ahlis-Sunna · Mo'tadillik", en: "Ta'wilat Ahl al-Sunnah · Moderation", ru: 'Тавилат Ахль ас-Сунна · Умеренность' },
    heading: { uz: 'Mo‘minni takfir qilmaslik va bag‘rikenglik', en: 'Rejecting Extremism & Preserving Unity', ru: 'Отказ от крайностей и единство уммы' },
    excerpt: {
      uz: "Imom al-Moturidiy Ahli Sunna e'tiqodini qat'iy himoya qilganlar: «Qibla ahlidan bo'lgan musulmon kishi katta gunoh qilib qo'ysa ham, uni halol sanamasa, iymondan chiqib kofir bo'lmaydi; u tavba eshigi ochiq bo'lgan osiy mo'mindir».",
      en: 'Imam al-Maturidi firmly upheld Sunni moderation: “A believer of the Qiblah who commits a major sin—without declaring it lawful—does not leave faith; the door of repentance and Allah’s mercy remains open.”',
      ru: 'Имам аль-Матуриди твёрдо отстаивал умеренность Ахль ас-Сунна: «Мусульманин, обращённый к Кибле, не выходит из веры из-за греха, если не считает его дозволенным; врата покаяния и милости Аллаха всегда открыты».',
    },
    sharh: {
      uz: "Bu mo'tadil aqida musulmonlarni fitna, takfir va adovatdan saqlaydi. Odamlar ustidan hukm chiqarish o'rniga ularga nasihat, duo va rahmat bilan yondashish — Ahli Sunna yo'lidir.",
      en: 'This balanced creed shields communities from harshness, sectarianism, and extremism—calling us to compassion, prayer, and sincere counsel rather than condemning fellow believers.',
      ru: 'Это взвешенное вероубеждение оберегает общество от радикализма и раскола, призывая к милосердию, доброму совету и молитве за ближних.',
    },
  },
  {
    id: 'mot_04',
    scholarId: 'moturidiy',
    topic: 'nafs',
    isVerse: false,
    work: { uz: 'Kitob at-Tavhid · Ixtiyor va Kasb', en: 'Kitab al-Tawhid · Free Choice & Responsibility', ru: 'Китаб ат-Таухид · Выбор и ответственность' },
    heading: { uz: 'Insonning ixtiyori va mas’uliyati', en: 'Human Choice & Moral Responsibility', ru: 'Свобода выбора и личная ответственность' },
    excerpt: {
      uz: "Imom al-Moturidiy insonni na ojiz qo'g'irchoq (jabriya), na o'zini mustaqil xoliq deb biluvchi (qadariya) sifatida ko'radi: «Alloh bandaga juz'iy ixtiyor (tanlov erki) bergan. Yaxshilik yoki yomonlikni tanlashda inson o'z qaroriga mas'uldir».",
      en: 'Imam al-Maturidi charted the balanced middle way: humans are neither helpless puppets nor independent of God. Allah granted us genuine moral choice (ikhtiyar), making us responsible for our decisions and effort.',
      ru: 'Имам аль-Матуриди обосновал золотую середину: человек не безвольная кукла и не независимый от Бога творец. Всевышний даровал нам свободу выбора (ихтияр), и мы несём ответственность за свои поступки.',
    },
    sharh: {
      uz: "«Taqdirim shu ekan» deb harakatsiz o'tirish yoki xatoni taqdirga to'nkash to'g'ri emas. Moturidiy ta'limoti insonni faol bo'lishga, to'g'ri tanlov qilishga va o'z hayoti uchun mas'uliyatni his etishga chorlaydi.",
      en: 'Blaming laziness or mistakes on destiny is never the Sunni way. Maturidi theology empowers us to take ownership of our choices, act ethically, and trust Allah with the outcome.',
      ru: 'Оправдывать лень или ошибки судьбой неверно. Учение аль-Матуриди вдохновляет брать ответственность за свой выбор, действовать разумно и уповать на Аллаха.',
    },
  },
  {
    id: 'mot_05',
    scholarId: 'moturidiy',
    topic: 'qalb',
    isVerse: false,
    work: { uz: "Ta'vilot Ahlis-Sunna · Xavf va Rajo", en: "Ta'wilat Ahl al-Sunnah · Fear and Hope", ru: 'Тавилат Ахль ас-Сунна · Страх и Надежда' },
    heading: { uz: 'Qo‘rquv va umid muvozanati', en: 'The Balance of Reverence and Hope', ru: 'Равновесие трепета и надежды' },
    excerpt: {
      uz: "«Mo'min qalbi xavf (gunohdan qo'rqish) va rajo (Alloh rahmatidan umidvorlik) qanotlari o'rtasida yashaydi. Allohning rahmatidan noumid bo'lish ham, Uning hisobidan xotirjam g'ofil bo'lish ham to'g'ri emas».",
      en: '“The believer’s heart flies between two wings: reverence of accountability and hope in Allah’s vast mercy. Neither despairing of His forgiveness nor growing complacent in sin is befitting of faith.”',
      ru: '«Сердце верующего летит на двух крыльях: трепет перед ответственностью и надежда на безграничную милость Аллаха. Недопустимы ни отчаяние в Его прощении, ни беспечность в грехе».',
    },
    sharh: {
      uz: "Xato qilganingizda shayton sizni noumidlikka tushirmoqchi bo'ladi — shunda Allohning rahmatini eslang. Yaxshi amal qilganda esa kibr kelishi mumkin — shunda kamtarlik va tavozuni eslang.",
      en: 'When you stumble, remember Allah’s boundless mercy so you never despair; when you succeed, remember humility so you never grow arrogant.',
      ru: 'Когда оступишься — помни о безграничной милости Аллаха, чтобы не отчаяться; когда преуспеешь — помни о смирении, чтобы не возгордиться.',
    },
  },
  {
    id: 'mot_06',
    scholarId: 'moturidiy',
    topic: 'odob',
    isVerse: false,
    work: { uz: "Ta'vilot Ahlis-Sunna · Qur'on tafsiri", en: "Ta'wilat Ahl al-Sunnah · Quran Exegesis", ru: 'Тавилат Ахль ас-Сунна · Толкование Корана' },
    heading: { uz: 'Go‘zal bahs va ilmiy odob', en: 'Wisdom & Courtesy in Dialogue', ru: 'Мудрость и благородство в диалоге' },
    excerpt: {
      uz: "Imom al-Moturidiy o'zga fikrlilar bilan bahslarda doimo dalil, xotirjamlik va chiroyli muomalani tanlaganlar: «Haqiqat baqir-chaqir va haqorat bilan emas, balki aniq hujjat va hikmatli so'z bilan isbotlanadi».",
      en: 'In his debates and writings, Imam al-Maturidi modeled calm intellectual courtesy: “Truth is established not through shouting or insults, but through clear evidence and words of wisdom.”',
      ru: 'В полемике и научных трудах имам аль-Матуриди всегда являл выдержку и уважение: «Истина утверждается не криком и оскорблениями, а ясным доводом и мудрым словом».',
    },
    sharh: {
      uz: "Haq gapni ham qo'pollik bilan aytsangiz, odamlar qalbini yopib qo'yadi. «Robbingiz yo'liga hikmat va chiroyli mav'iza bilan da'vat qiling» oyati Moturidiy merosining jonli ruhidir.",
      en: 'Even a true point fails to reach hearts when delivered harshly. Speaking with calm proof and genuine respect embodies Quran 16:125.',
      ru: 'Даже правдивые слова отталкивают, если сказаны с грубостью. Спокойный довод и уважение к собеседнику открывают сердца.',
    },
  },

  // ==================== 8. BURHONIDDIN AL-MARG'INONIY ====================
  {
    id: 'mar_01',
    scholarId: 'marginoniy',
    topic: 'ilm',
    isVerse: false,
    work: { uz: 'Al-Hidoya · Hanafiy fiqhi asosi', en: 'Al-Hidayah · Spirit of Hanafi Fiqh', ru: 'Аль-Хидая · Дух ханафитского фикха' },
    heading: { uz: 'Fiqh — insonning o‘z foyda va zararini anglashidir', en: 'Fiqh: Knowing What Benefits & Harms the Soul', ru: 'Фикх — познание пользы и вреда для души' },
    excerpt: {
      uz: "Imom Abu Hanifa va Burhoniddin al-Marg'inoniy maktabiga ko'ra: «Fiqh — nafsning o'z foydasi (haq-huquqi) va zararini (burch va mas'uliyatini) chuqur anglashidir». Shariat qoidalari insonni qiynash uchun emas, uni ikki dunyo saodatiga boshlash uchun nozil qilingan.",
      en: 'In the school of Imam Abu Hanifa and al-Marghinani, “Fiqh is the soul’s deep discernment of what benefits it and what harms it.” Sacred law was revealed not to burden humanity, but to guide it toward wellbeing in both worlds.',
      ru: 'В школе имама Абу Ханифы и аль-Маргинани «Фикх — это глубокое познание душой своих прав и обязанностей, своей пользы и вреда». Законы Шариата ниспосланы не для обременения, а для блага человека в обоих мирах.',
    },
    sharh: {
      uz: "«Al-Hidoya» asari 800 yildan beri butun dunyoda eng yuksak huquqiy-fiqhiy asar sifatida o'rganilishining siri — undagi hayotiy adolat, mantiqiy aniqlik va insonparvarlik ruhidir.",
      en: 'The secret behind Al-Hidayah’s 800-year worldwide prestige is its clarity, logical coherence, and deep compassion for real human circumstances.',
      ru: 'Секрет восьмивекового авторитета «Аль-Хидаи» во всём мире — в её точности, логике и глубоком внимании к реальной жизни человека.',
    },
  },
  {
    id: 'mar_02',
    scholarId: 'marginoniy',
    topic: 'odob',
    isVerse: false,
    work: { uz: 'Al-Hidoya · Yengillashtirish qoidasi', en: 'Al-Hidayah · Principle of Ease', ru: 'Аль-Хидая · Принцип облегчения' },
    heading: { uz: 'Mashaqqat yengillikni jalb qiladi', en: 'Hardship Begets Ease', ru: 'Затруднение приносит облегчение' },
    original: 'الْمَشَقَّةُ تَجْلِبُ التَّيْسِيرَ',
    excerpt: {
      uz: "Hanafiy fiqhi va «Al-Hidoya»ning bosh tamoyillaridan biri: «Mashaqqat yengillikni chaqiradi». Bemor, musofir, keksalar va nochor insonlar uchun shariatda ruxsat va yengilliklar berilgan — din og'irlik emas, rahmatdir.",
      en: 'A foundational maxim woven throughout Al-Hidayah is: “Hardship brings ease.” For the sick, travelers, the elderly, and those in difficulty, Islamic law opens doors of mercy and accommodation.',
      ru: 'Один из стержневых принципов «Аль-Хидаи»: «Затруднение влечёт за собой облегчение». Для больных, путников и пожилых в исламском праве предусмотрены милосердные послабления.',
    },
    sharh: {
      uz: "Alloh taolo: «Alloh sizlarga yengillikni istaydi, qiyinchilikni istamaydi» (Baqara, 185) deb marhamat qilgan. Marg'inoniy fiqhni odamlarga osonlik va rahmat ulashuvchi tirik ilm sifatida taqdim etgan.",
      en: 'Allah declares in Quran 2:185: “Allah intends ease for you and does not intend hardship.” Al-Marghinani presented fiqh as a living mercy rather than rigid harshness.',
      ru: 'В Коране (2:185) сказано: «Аллах желает вам облегчения и не желает вам затруднения». Аль-Маргинани раскрыл фикх как живую милость, а не сухое бремя.',
    },
  },
  {
    id: 'mar_03',
    scholarId: 'marginoniy',
    topic: 'mehnat',
    isVerse: false,
    work: { uz: 'Al-Hidoya · Savdo va Omonat bobi', en: 'Al-Hidayah · Trade & Trustworthiness', ru: 'Аль-Хидая · Книга торговли и аманата' },
    heading: { uz: 'Savdoda rostgo‘ylik va omonatga sadoqat', en: 'Honesty in Commerce & Keeping Trusts', ru: 'Честность в торговле и верность аманату' },
    excerpt: {
      uz: "«Al-Hidoya»ning muomalot bo'limida ta'kidlanishicha: savdoda molning aybini yashirish, o'lchovdan urib qolish va kelishuvga xiyonat qilish qat'iyan haromdir. Halol bitim, aniq shartnoma va omonatni bekamu ko'st qaytarish — jamiyat barqarorligining ustunidir.",
      en: 'Al-Hidayah’s chapters on transactions emphasize that concealing defects, cheating in weights, or breaching agreements is strictly forbidden. Clear contracts and faithful stewardship of trusts sustain prosperous societies.',
      ru: 'В главах «Аль-Хидаи» о сделках подчёркивается строгий запрет на сокрытие изъянов товара, обвес и нарушение договора. Ясные условия и верность доверенному (аманату) — опора благополучия общества.',
    },
    sharh: {
      uz: "Bugungi biznes, frilans va ish munosabatlarida ham Marg'inoniy o'giti aynan qo'llaniladi: aniq kelishuv, vaqtida to'lov va mijozni aldamaslik eng barakali daromad manbaidir.",
      en: 'Whether in modern business, freelancing, or everyday trade, al-Marghinani’s ethics shine: transparent agreements, fair wages paid on time, and zero deception bring true barakah.',
      ru: 'В современном бизнесе и работе завет аль-Маргинани остаётся непреложным: прозрачные договорённости, своевременная оплата и честность с клиентом приносят наибольшую благодать.',
    },
  },
  {
    id: 'mar_04',
    scholarId: 'marginoniy',
    topic: 'ilm',
    isVerse: false,
    work: { uz: 'Al-Hidoya muqaddimasi · 13 yillik xizmat', en: 'Preface of Al-Hidayah · 13 Years of Service', ru: 'Предисловие к «Аль-Хидае» · 13 лет труда' },
    heading: { uz: 'Ilmga fidoyilik va kamtarlik', en: 'Humility & Perseverance in Scholarship', ru: 'Самоотверженность и скромность в науке' },
    excerpt: {
      uz: "Burhoniddin al-Marg'inoniy 13 yil davomida «Al-Hidoya»ni yozar ekan, biron kun ro'zasini tark etmagan, ammo buni hech kimga bildirmaganlar; kitob muqaddimasida esa bor ilm va tavfiqni faqat Allohning fazliga nisbat berganlar.",
      en: 'While composing Al-Hidayah over thirteen years, al-Marghinani fasted continuously in secret so no one knew, and in his preface attributed every flash of legal insight purely to Allah’s grace.',
      ru: 'Тринадцать лет работая над «Аль-Хидаей», аль-Маргинани тайно держал пост, скрывая это от окружающих, а в предисловии приписал всё знание и успех исключительно милости Всевышнего.',
    },
    sharh: {
      uz: "O'z mehnati bilan maqtanmaslik, ustozlarini hurmat bilan yodga olish va katta maqsad yo'lida yillar davomida sabr bilan ishlash — har bir ilm tolibi uchun eng go'zal ibratdir.",
      en: 'Working steadily toward a noble goal for years without boasting—and crediting your teachers and Allah—is the finest example for every student and builder.',
      ru: 'Годами терпеливо трудиться ради благой цели без самовосхваления, с благодарностью учителям и Творцу — лучший пример для каждого искателя знаний.',
    },
  },
  {
    id: 'mar_05',
    scholarId: 'marginoniy',
    topic: 'odob',
    isVerse: false,
    work: { uz: 'Al-Hidoya · Adolat va Qozilik odobi', en: 'Al-Hidayah · Ethics of Justice', ru: 'Аль-Хидая · Этика справедливости' },
    heading: { uz: 'Adolatda tenglik — boyu kambag‘al barobardir', en: 'Equal Justice for Rich and Poor Alike', ru: 'Равенство перед справедливостью' },
    excerpt: {
      uz: "«Al-Hidoya»ning qozilik odobi bobida aytiladi: «Adolat qiluvchi kishi o'z huzuridagi ikki da'vogarga — biri boy, biri kambag'al bo'lsa ham — o'tirishda, qarashda va so'z tinglashda teng munosabatda bo'lishi shart; hatto biriga ko'proq tabassum qilishdan ham tiyilsin».",
      en: 'In Al-Hidayah’s chapter on judicial ethics: “A judge must treat two disputants—whether wealthy or poor—with complete equality in seating, gaze, and listening, avoiding even favoring one with a warmer smile.”',
      ru: 'В главе «Аль-Хидаи» о правосудии сказано: «Судья обязан проявлять абсолютное равенство к обеим сторонам — богатому и бедному — в месте сидения, взгляде и выслушивании, не выделяя никого даже более тёплой улыбкой».',
    },
    sharh: {
      uz: "Bu oliy adolat me'yori nafaqat sudyalarga, balki ota-onalarga (farzandlar o'rtasida), ustozlarga (shogirdlar o'rtasida) va rahbarlarga (xodimlar o'rtasida) ham teng tegishlidir.",
      en: 'This uncompromising standard of fairness guides not only judges, but parents among their children, teachers among students, and leaders among teams.',
      ru: 'Этот высокий стандарт справедливости важен не только для судей, но и для родителей, учителей и руководителей в отношении к близким и коллегам.',
    },
  },
  {
    id: 'mar_06',
    scholarId: 'marginoniy',
    topic: 'qalb',
    isVerse: false,
    work: { uz: 'Al-Hidoya · Ibodat va Xushu', en: 'Al-Hidayah · Presence in Worship', ru: 'Аль-Хидая · Смирение в поклонении' },
    heading: { uz: 'Tashqi tartib va ichki xushu uyg‘unligi', en: 'Uniting Outward Precision & Inner Devotion', ru: 'Гармония внешней точности и смирения сердца' },
    excerpt: {
      uz: "Marg'inoniy namoz, zakot va ro'za ahkomlarini bayon qilar ekan, ibodatning zohiriy shartlari bilan birga botiniy ma'nosiga ham urg'u beradi: «Namozda shoshilmaslik (tuma'nina) va qalb hozirligi — ibodatga jon kirituvchi ruhdir».",
      en: 'While detailing prayer, zakat, and fasting, al-Marghinani stresses both outward precision and inner presence: “Unhurried composure (tuma’ninah) and an attentive heart are the living soul of prayer.”',
      ru: 'Излагая правила намаза, закята и поста, аль-Маргинани подчёркивает неразрывность формы и духа: «Неспешность (туманина) и присутствие сердца — это душа молитвы».',
    },
    sharh: {
      uz: "Namozni shoshilib ado etish o'rniga ruku va sajdalarda bir oz sokin to'xtash, o'qiyotgan sura va tasbehlarning ma'nosini his qilish ibodatimizni haqiqiy rohatga aylantiradi.",
      en: 'Slowing down in ruku and sujud instead of rushing through prayer—and feeling the meaning of the words—turns every salah into genuine rest for the soul.',
      ru: 'Если не торопиться в поясном и земном поклонах, а прочувствовать смысл произносимых слов, каждый намаз становится настоящим отдохновением для души.',
    },
  },

  // ==================== 9. MUHAMMAD SHARIF GULXANIY ====================
  {
    id: 'gul_01',
    scholarId: 'gulxaniy',
    topic: 'odob',
    isVerse: false,
    work: { uz: 'Zarbulmasal · «Toshbaqa bilan Chayon» masali', en: 'Zarbulmasal · The Tortoise & the Scorpion', ru: 'Зарбулмасал · Притча о Черепахе и Скорпионе' },
    heading: { uz: 'Toshbaqa bilan Chayon: Do‘st tanlashda farosat', en: 'The Tortoise & Scorpion: Discernment in Friendship', ru: 'Черепаха и Скорпион: разборчивость в дружбе' },
    original: '«Yaxshiga yondash, yomondan qoch!»',
    excerpt: {
      uz: "Toshbaqa daryodan o'tolmay turgan chayonga rahm qilib yelkasiga mindiradi. Suv o'rtasida chayon toshbaqaning kosasiga nishini sancha boshlaydi va «Odatim shunday — chaqmay turolmayman» deydi. Shunda toshbaqa suvga sho'ng'ib, xoin hamrohdan qutuladi.",
      en: 'A kind tortoise carries a stranded scorpion across a river on its shell. Midway across, the scorpion strikes its back, excusing itself: “It is simply my nature to sting.” Recognizing treachery, the tortoise dives beneath the water to save itself.',
      ru: 'Добрая черепаха переправляет скорпиона через реку на своём панцире. Посреди реки скорпион начинает жалить её, оправдываясь: «Такова моя природа». Поняв коварство спутника, черепаха ныряет в глубину и избавляется от предателя.',
    },
    sharh: {
      uz: "Gulxaniy bu mashhur masal orqali mo'min kishining hushyor va farosatli bo'lishini uqtiradi: tabiatida hasad, xiyonat va ozor berish odati bor kimsaga sir va ishonch topshirilmaydi.",
      en: 'Through this classic parable, Gulkhani teaches moral discernment: compassion never requires naivety—do not entrust your secrets or safety to someone whose proven habit is betrayal.',
      ru: 'Этой знаменитой притчей Гульхани учит проницательности: доброта не означает наивности — нельзя доверять тайны и судьбу тому, чья привычка — коварство и предательство.',
    },
  },
  {
    id: 'gul_02',
    scholarId: 'gulxaniy',
    topic: 'ilm',
    isVerse: false,
    work: { uz: 'Zarbulmasal · «Maymun bilan Najjor» masali', en: 'Zarbulmasal · The Monkey & the Carpenter', ru: 'Зарбулмасал · Притча об Обезьяне и Плотнике' },
    heading: { uz: 'Maymun bilan Najjor: Bilmagan ishga aralashmaslik', en: 'The Monkey & Carpenter: Respecting True Craft', ru: 'Обезьяна и Плотник: опасность невежества' },
    original: '«O‘z hunaringni bil — bilmagan ishga burun suqma!»',
    excerpt: {
      uz: "Duradgor (najjor) yog'ochni arra bilan yorib, orasiga pona qoqib dam olgani ketadi. Uni chetdan kuzatgan maymun o'zini usta sanab yog'och ustiga o'tirib ponani sug'urib oladi — yoriq yopilib, qattiq qisilib sharmanda va azobga qoladi.",
      en: 'A carpenter splits a log with a wedge and steps away to rest. Thinking it looks easy, an observing monkey climbs onto the log and pulls out the wedge—only for the timber to snap shut and trap it in pain.',
      ru: 'Плотник расщепляет бревно, вставляет клин и уходит передохнуть. Обезьяна, вообразив себя мастером, садится на бревно и выдергивает клин — бревно захлопывается, прищемляя её.',
    },
    sharh: {
      uz: "Ilmsiz va tajribasiz holda o'zgalarga ko'r-ko'rona taqlid qilish yoki o'z sohasi bo'lmagan nozik ishlarga (ayniqsa din, tabobat va huquqqa) aralashish kishini ham, atrofdagilarni ham ziyon ko'rishiga olib keladi.",
      en: 'Blind imitation without training—or meddling arrogantly in fields you have not studied—inevitably backfires. Master your craft honestly and respect genuine expertise.',
      ru: 'Слепое подражание без знаний и самонадеянное вмешательство в чужое ремесло всегда приводят к беде. Уважай мастерство и сначала основательно учись сам.',
    },
  },
  {
    id: 'gul_03',
    scholarId: 'gulxaniy',
    topic: 'odob',
    isVerse: false,
    work: { uz: 'Zarbulmasal · «Tuya bilan Bo‘taloq» masali', en: 'Zarbulmasal · The Camel & Her Calf', ru: 'Зарбулмасал · Притча о Верблюдице и Верблюжонке' },
    heading: { uz: 'Tuya bilan Bo‘taloq: Mazlumlarga rahm va adolat', en: 'The Camel & Calf: Compassion & Justice', ru: 'Верблюдица и Верблюжонок: сострадание и справедливость' },
    excerpt: {
      uz: "Jazirama cho'lda og'ir yuk ostida borayotgan ona tuyaga och qolgan bo'taloq yalinadi: «Onajon, biroz to'xtang, sut emayin!» Ona tuya ko'z yosh bilan javob beradi: «Bolajonim, burundug'im sarbonning qo'lida — ixtiyorim o'zimda bo'lsa, seni shunday qiynarmidim?»",
      en: 'Beneath scorching desert sun, a hungry calf pleads with its burdened mother camel to pause so it may nurse. Weeping, the mother replies: “My child, the halter is in the driver’s hand—had I any choice, would I let you suffer?”',
      ru: 'В палящей пустыне голодный верблюжонок просит нагруженную мать остановиться хоть на миг. Верблюдица отвечает со слезами: «Дитя моё, поводья в чужих руках — разве по своей воле я мучила бы тебя?»',
    },
    sharh: {
      uz: "Gulxaniy bu yurakni titratuvchi masal bilan insonlarni adolatli bo'lishga, qo'l ostidagi xodim, ojiz va mazlumlarga haddan tashqari og'ir yuk yuklamaslikka va rahm-shafqatli bo'lishga chaqiradi.",
      en: 'Through this deeply moving fable, Gulkhani awakens empathy for the overburdened and reminds anyone holding authority to rule with mercy and fairness.',
      ru: 'Этой пронзительной притчей Гульхани пробуждает сострадание к обездоленным и напоминает каждому, кто наделён властью, о милосердии и справедливости.',
    },
  },
  {
    id: 'gul_04',
    scholarId: 'gulxaniy',
    topic: 'nafs',
    isVerse: false,
    work: { uz: 'Zarbulmasal · Yapaloqqush va Boyo‘g‘li qissasi', en: 'Zarbulmasal · Story of the Owls', ru: 'Зарбулмасал · Повесть о Совах' },
    heading: { uz: 'Isrof, kibr va soxta dabdabaning kulgili oqibati', en: 'Exposing Greed, Vanity & Wasteful Boasting', ru: 'Обличение алчности, тщеславия и расточительства' },
    excerpt: {
      uz: "Yapaloqqush bilan Boyo'g'li quda bo'lish chog'ida bir-biriga quruq maqtanib, hatto xaroba va vayronalarni «mingta saroy» deb qalin qilib talab qiladilar. Gulxaniy bu hajv orqali to'y-hashamdagi isrof, manmanlik va tama'girlikni ayovsiz fosh etadi.",
      en: 'While arranging a marriage, two boastful owls demand a thousand ruined estates as dowry, pretending wasteland is royal splendor. Gulkhani uses sharp satire to expose greed, vanity, and wasteful wedding ostentation.',
      ru: 'Сватаясь друг с другом, тщеславные совы требуют в калым тысячу развалин, выдавая руины за дворцы. Тонкой сатирой Гульхани высмеивает алчность, показуху и расточительство на тоях.',
    },
    sharh: {
      uz: "Bugungi kunda ham ortiqcha dabdaba, qarzga botib to'y qilish va «odamlar nima deydi» deb isrofga berilish katta illatdir. Gulxaniy 200 yil avval bizni soddalik, qanoat va halol kamtarlikka chaqirgan.",
      en: 'Two centuries later, Gulkhani’s satire still hits home: plunging into debt for lavish weddings and chasing social prestige brings only ruin. Simplicity and contentment bring real barakah.',
      ru: 'Даже спустя двести лет сатира Гульхани поразительно актуальна: погоня за показухой и долги ради пышных торжеств разрушают благополучие. Истинная благодать — в скромности.',
    },
  },
  {
    id: 'gul_05',
    scholarId: 'gulxaniy',
    topic: 'ilm',
    isVerse: false,
    work: { uz: 'Zarbulmasal · Xalq hikmati', en: 'Zarbulmasal · Proverb of Consultation', ru: 'Зарбулмасал · Мудрость совета' },
    heading: { uz: 'Maslahatli kengash tarqamas', en: 'Counselled Plans Never Fall Apart', ru: 'Дело, решённое советом, не распадётся' },
    original: '«Maslahatli to‘y tarqamas, kengashli el buzilmas.»',
    excerpt: {
      uz: "Gulxaniy «Zarbulmasal»da ish boshlashdan avval dono va xolis kishilar bilan mashvarat (shuro) qilishni qayta-qayta ta'kidlaydi: o'z bilganidan qolmaydigan o'jar odam pushaymon bo'ladi, kengashib ish tutgan esa baraka topadi.",
      en: 'Throughout Zarbulmasal, Gulkhani repeatedly highlights the wisdom of shura (consultation): stubbornness invites regret, while seeking wise, sincere counsel safeguards every venture.',
      ru: 'На страницах «Зарбулмасала» Гульхани вновь и вновь подчёркивает силу доброго совета (шуры): упрямство ведёт к раскаянию, а мудрое совещание хранит дело от краха.',
    },
    sharh: {
      uz: "Qur'oni Karimda ham mo'minlarning muhim sifati «ishlari o'zaro mashvarat bilan bo'lur» (Sho'ro, 38) deb madh etilgan. Oila, ilm va biznes qarorlarida tajribali kishilar fikrini tinglash — donolik belgisidir.",
      en: 'The Quran praises believers as those “whose affairs are conducted by mutual consultation” (42:38). Listening to wise elders and trusted advisors is a mark of strength, not weakness.',
      ru: 'Коран восхваляет верующих тем, что «их дела решаются взаимным советом» (42:38). Прислушиваться к опытным и искренним людям — признак зрелой мудрости.',
    },
  },
  {
    id: 'gul_06',
    scholarId: 'gulxaniy',
    topic: 'odob',
    isVerse: false,
    work: { uz: 'Zarbulmasal · Hayo va Or-nomus', en: 'Zarbulmasal · Modesty & Honor', ru: 'Зарбулмасал · Стыдливость и честь' },
    heading: { uz: 'Uyat — o‘limdan qattiqdir', en: 'Loss of Honor Cuts Deeper Than Death', ru: 'Позор тяжелее смерти' },
    original: '«Uyat o‘limdan qattiq.»',
    excerpt: {
      uz: "Gulxaniy keltirgan bu qadimiy hikmat inson qadr-qimmati, hayo va vijdonning naqadar muqaddasligini eslatadi: mol-dunyo ketishi mumkin, lekin nomus, uyat va halol nom yo'qolsa, uni qaytarish eng mushkuldir.",
      en: 'This timeless proverb woven into Zarbulmasal reminds us how sacred modesty (haya) and integrity are: wealth may come and go, but preserving honor and conscience is priceless.',
      ru: 'Эта древняя мудрость из «Зарбулмасала» напоминает о бесценности совести и стыдливости (хая): богатство приходит и уходит, но честное имя дороже всего.',
    },
    sharh: {
      uz: "Payg'ambarimiz ﷺ: «Hayo iymondandir» deganlar. Har bir qadamda vijdon va hayoni mezonga aylantirgan kishi har ikki dunyoda izzat topadi.",
      en: 'The Prophet ﷺ said: “Modesty (haya) is a branch of faith.” Letting conscience and dignity guide every choice protects a person in both worlds.',
      ru: 'Пророк ﷺ сказал: «Стыдливость — часть веры». Человек, сверяющий каждый шаг с совестью, обретает уважение и покой.',
    },
  },
  {
    id: 'gul_07',
    scholarId: 'gulxaniy',
    topic: 'mehnat',
    isVerse: false,
    work: { uz: 'Zarbulmasal · Vaqt va Mehnat qadri', en: 'Zarbulmasal · Value of Time & Diligence', ru: 'Зарбулмасал · Ценность времени и труда' },
    heading: { uz: 'Bugungi ishni ertaga qo‘yma', en: 'Never Put Off Today’s Duty Until Tomorrow', ru: 'Не откладывай сегодняшнее дело на завтра' },
    original: '«Bugungi ishni ertaga qo‘yma; tomchi yig‘ilib ko‘l bo‘lur.»',
    excerpt: {
      uz: "Gulxaniy asarida dangasalik va ishni ortga surish keskin qoralanadi: kichik harakatlar uzluksiz davom etsa ulkan natija beradi («tomchi yig'ilib ko'l bo'lur»), ammo «ertaga qilaman» deb yurgan kishi fursatni boy beradi.",
      en: 'Gulkhani sharply criticizes procrastination: steady small steps accumulate into a lake (“drops gather into a pool”), whereas endlessly delaying until tomorrow steals life’s blessings.',
      ru: 'Гульхани осуждает лень и промедление: малые постоянные усилия наполняют целое озеро («из капель собирается озеро»), а привычка откладывать всё на завтра крадёт время и успех.',
    },
    sharh: {
      uz: "Namozni vaqtida o'qish, va'dani kechiktirmaslik va har kuni kichik bo'lsa ham foydali ishni oxiriga yetkazish — muvaffaqiyat va barakaning sodda siridir.",
      en: 'Praying on time, honoring commitments promptly, and finishing one meaningful task daily is the quiet formula behind lasting barakah.',
      ru: 'Вовремя совершать намаз, не затягивать обещания и каждый день доводить до конца полезное дело — простой секрет благодати и успеха.',
    },
  },
  {
    id: 'gul_08',
    scholarId: 'gulxaniy',
    topic: 'odob',
    isVerse: false,
    work: { uz: 'Zarbulmasal · Rostgo‘ylik', en: 'Zarbulmasal · Enduring Truth', ru: 'Зарбулмасал · Сила правды' },
    heading: { uz: 'Yolg‘on masal uzoqqa bormas', en: 'Falsehood Never Stands for Long', ru: 'Ложь не устоит долго' },
    original: '«Yolg‘on masal turmas, egri tayoq to‘g‘ri soya bermas.»',
    excerpt: {
      uz: "Gulxaniy hiyla, laganbardorlik va yolg'on bilan kun ko'ruvchilarni hajv qilar ekan, haqiqat baribir yuzaga chiqishini va egri yo'l bilan to'g'ri natijaga erishib bo'lmasligini uqtiradi.",
      en: 'Exposing flattery and deceit, Gulkhani underscores that a crooked stick never casts a straight shadow—falsehood eventually collapses, while honesty endures.',
      ru: 'Высмеивая хитрость и лесть, Гульхани подчёркивает: кривая палка не даст прямой тени — ложь неизбежно раскроется, а правда выстоит.',
    },
    sharh: {
      uz: "Qisqa muddatda yolg'on foyda bergandek tuyulishi mumkin, ammo uzoq muddatda faqat to'g'rilik, halollik va ishonch insonni yuksaltiradi.",
      en: 'Deceit may seem like a shortcut in the moment, yet over a lifetime only integrity builds lasting trust and peace of heart.',
      ru: 'Обман может казаться лёгким путём на мгновение, но на долгой дистанции только честность дарует доверие и спокойствие сердца.',
    },
  },
  {
    id: 'gul_09',
    scholarId: 'gulxaniy',
    topic: 'ilm',
    isVerse: false,
    work: { uz: 'Zarbulmasal · So‘z va Hikmat qadri', en: 'Zarbulmasal · Treasure of Stored Wisdom', ru: 'Зарбулмасал · Сокровище мудрых слов' },
    heading: { uz: 'Yoshlikda o‘rganilgan hikmatning mevasi', en: 'Wisdom Learned Early Blossoms in Maturity', ru: 'Плоды мудрости, усвоенной смолоду' },
    excerpt: {
      uz: "Gulxaniy hikmat va maqollarni yod olib ulg'ayish haqida shunday yozadi: «Katta bo'lib, aql va tajriba egasi bo'lganlarida, yodlab olgan naqllari ustida tafakkur qilib ko'rsalar, dillari naqadar bebaho hikmatlar bilan to'lganini anglaydilar».",
      en: 'Gulkhani reflects on memorizing proverbs and wisdom in youth: when people mature and gain life experience, reflecting on the wise sayings stored in their hearts reveals an inexhaustible inner treasury.',
      ru: 'Гульхани писал о ценности мудрости, усвоенной с юных лет: когда человек взрослеет и обретает опыт, размышление над сохранёнными в памяти притчами открывает в сердце бесценное сокровище.',
    },
    sharh: {
      uz: "Farzandlarga bolalikdan Qur'on oyatlari, hadislar va ajdodlarimizning hikmatli maqollarini singdirib borish — ularga butun umr yo'l ko'rsatuvchi ma'naviy chiroq berish demakdir.",
      en: 'Planting Quranic values, Prophetic ethics, and ancestral proverbs in young hearts equips them with a moral compass for life.',
      ru: 'Прививать детям с малых лет ценности Корана, хадисов и народной мудрости — значит подарить им надёжный духовный компас на всю жизнь.',
    },
  },
  {
    id: 'gul_10',
    scholarId: 'gulxaniy',
    topic: 'nafs',
    isVerse: true,
    work: { uz: 'Gulxaniy g‘azallari · «Bermoq» radifli g‘azal', en: 'Ghazals of Gulkhani · On Generosity & Dignity', ru: 'Газели Гульхани · О щедрости и достоинстве' },
    heading: { uz: 'Saxovat va qanoat — mard kishining ziynati', en: 'Generosity & Contentment Adorn Noble Souls', ru: 'Щедрость и довольство — украшение благородных' },
    original:
      "Hirs-u tama' bandi bo'lma, ozga qanoat ayla,\nElga yaxshilik qilib, pokiza noming saqla.\nBirovning minnatidan qochib halol non yegan,\nShohlar taxtidan ortiq rohat-u izzat topar.",
    excerpt: {
      uz: "Hirs va tama'ga qul bo'lma, ozgina halol rizqqa qanoat qil va odamlarga yaxshilik ulashib pok nomingni saqla. Birovning minnatidan uzoq yurib o'z mehnati bilan kun ko'rgan kishi shohlar taxtidan ham ortiqroq xotirjamlik topadi.",
      en: 'Never become a captive of greed; be content with pure sustenance and guard an honorable name through kindness. Whoever eats honest bread free of anyone’s favor enjoys greater peace than kings upon thrones.',
      ru: 'Не становись пленником алчности, довольствуйся чистым уделом и храни доброе имя делами. Живущий честным трудом без одолжений обретает покой выше царского трона.',
    },
    sharh: {
      uz: "Gulxaniy o'zi ham hayotda oddiy hammom go'laxisida mehnat qilib, kibr va laganbardorlikdan yiroq yashagan va shuning uchun «Gulxaniy» taxallusini tanlagan. Pok vijdon — eng oliy boylikdir.",
      en: 'Gulkhani himself worked humbly tending a bathhouse furnace—taking his pen name from the stove (“gulxan”)—rather than compromising his dignity for flattery.',
      ru: 'Сам Гульхани скромно трудился истопником (отсюда его псевдоним «Гульхани»), предпочитая честную независимость придворной лести.',
    },
  },

  // ==================== ENRICHED VERIFIED WORKS FOR ALL 8 SCHOLARS ====================
  // --- Xoja Ahmad Yassaviy (+3 verified from Devoni Hikmat) ---
  {
    id: 'yas_07',
    scholarId: 'yassaviy',
    topic: 'nafs',
    isVerse: true,
    work: { uz: 'Devoni Hikmat · 13–14 yosh hikmati', en: 'Diwan-i Hikmat · Verse of Humility', ru: 'Диван-и Хикмат · Стих о смирении' },
    heading: { uz: 'Takabburni yerga urib, tuproqsifat bo‘lish', en: 'Crushing Arrogance & Becoming Humble as Earth', ru: 'Повергнуть гордыню и стать скромным как земля' },
    original:
      "O'n uchimda nafs havosin qo'lga oldim,\nNafs boshiga yuz-ming balo qamrab soldim.\nTakabburni yerga urib bosib oldim,\nO'n to'rtimda tufroqsifat bo'ldim mano.",
    excerpt: {
      uz: "Yoshlikdan nafs havosini jilovlab, kibr va manmanlikni yerga urdim; tuproq kabi kamtarin, hammaga manfaatli va xokisor bo'lishni o'rgandim.",
      en: 'From youth I took hold of my ego’s whims, cast arrogance down to the ground, and learned to become as humble and nurturing as the earth itself.',
      ru: 'С юных лет я обуздал страсти нафса, поверг высокомерие наземь и научился быть скромным и полезным всем, словно плодородная земля.',
    },
    sharh: {
      uz: "Tuproq barcha mavjudotni ko'taradi, unga qancha og'irlik tushsa ham, u o'rniga gullar va mevalar undirib beradi. Yassaviy «tuproqsifat bo'lish» deganda ana shunday bag'rikeng kamtarlikni nazarda tutgan.",
      en: 'Earth bears every footstep patiently and responds by growing flowers and fruit. To be “like dust” in Yasawi’s verse means carrying strength wrapped in boundless humility.',
      ru: 'Земля терпеливо выносит любую тяжесть и отвечает цветами и плодами. Быть «подобным земле» в стихах Яссави — значит сочетать внутреннюю силу с глубоким смирением.',
    },
  },
  {
    id: 'yas_08',
    scholarId: 'yassaviy',
    topic: 'ilm',
    isVerse: true,
    work: { uz: 'Devoni Hikmat · Ona tilida ma’rifat', en: 'Diwan-i Hikmat · Wisdom in the Mother Tongue', ru: 'Диван-и Хикмат · Мудрость на родном языке' },
    heading: { uz: 'Oyat va hadis ma’nosini xalq tilida yetkazish', en: 'Sharing Quran & Hadith Wisdom in Plain Language', ru: 'Доносить смысл Корана и хадисов на родном языке' },
    original:
      "Xushlamaydur olimlar bizni aytgan turkini,\nOriflardan eshitsang, ochar ko'ngil mulkini.\nOyat, hadis ma'nosi turkiy bo'lsa muvofiq,\nMa'nisiga yetganlar, yerga qo'yar bo'rkini.",
    excerpt: {
      uz: "Ba'zi kibor olimlar turkiy tilda hikmat aytganimizni xushlamasalar-da, oriflardan eshitsang qalb mulkini ochadi. Zero Qur'on oyati va hadis ma'nolari ona tilimizda ravon tushuntirilsa, haqiqatga yetgan kishi bosh egib hurmat qiladi.",
      en: 'Even if elitists frowned upon our Turkic verse, sincere seekers find it opens the kingdom of the heart—for when Quranic and Prophetic meanings are conveyed clearly in people’s own tongue, those who grasp them bow in awe.',
      ru: 'Пусть иные снобы недолюбливали нашу тюркскую речь, но для ищущего она открывает врата сердца: когда смысл аятов и хадисов ясно звучит на родном языке, постигшие его склоняют головы в почтении.',
    },
    sharh: {
      uz: "Xoja Ahmad Yassaviy islomiy ma'rifatni oddiy xalq qalbiga ona tilimiz — turkiy-o'zbek tilida olib kirgan buyuk ustozdir. Ilm murakkab so'zlarda emas, inson qalbiga yetib boradigan tushunarli hikmatdadir.",
      en: 'Ahmad Yasawi pioneered bringing Islamic ethics and spiritual wisdom directly to everyday people in Turkic/Uzbek—showing that real scholarship illuminates hearts rather than showing off jargon.',
      ru: 'Ахмад Яссави стал первопроходцем, донёсшим исламскую мудрость до простого народа на родном языке. Подлинное знание призвано просвещать сердца, а не кичиться сложностью.',
    },
  },
  {
    id: 'yas_09',
    scholarId: 'yassaviy',
    topic: 'odob',
    isVerse: true,
    work: { uz: 'Devoni Hikmat · Yetim va mazlum haqqi', en: 'Diwan-i Hikmat · Rights of Orphans & the Poor', ru: 'Диван-и Хикмат · Права сирот и обездоленных' },
    heading: { uz: 'G‘arib, faqir va yetimning haqqidan qo‘rqish', en: 'Protecting the Rights of Orphans & the Vulnerable', ru: 'Остерегайся посягать на права сирот и слабых' },
    original:
      "G'ariblig'da yuz yil tursa, erur mehmon,\nTaxtu baxtu bo'stonlari erur zindon.\nG'arib, faqir, yetimlarning haqqin yegan,\nO'shal zolim do'zax ichra qolur hayron.",
    excerpt: {
      uz: "Inson bu dunyoda yuz yil yashasa ham vaqtincha mehmondir. Shuning uchun g'arib, muhtoj va yetimlarning haqqiga xiyonat qilishdan qattiq saqlan — ularning ko'z yoshi va duosi Alloh huzurida pardasizdir.",
      en: 'Even if one lives a hundred years in this world, they remain only a passing guest. Guard yourself strictly against consuming the rights of orphans, the poor, and the vulnerable.',
      ru: 'Даже прожив сто лет в этом мире, человек остаётся лишь временным гостем. Строго оберегайся посягать на права сирот, бедняков и беззащитных.',
    },
    sharh: {
      uz: "Yetimning boshini silash, xodimning haqqini kechiktirmay berish va ojizni himoya qilish — jamiyatga rahmat va baraka olib keluvchi eng buyuk amallardandir.",
      en: 'Caring for orphans, paying workers promptly, and defending the vulnerable draw Allah’s mercy upon an entire community.',
      ru: 'Забота о сиротах, честная и своевременная оплата труда и защита слабых призывают милость Всевышнего на всё общество.',
    },
  },

  // --- Bahouddin Naqshband (+3 verified from Rashahot & Kalimoti Qudsiya) ---
  {
    id: 'naq_07',
    scholarId: 'naqshband',
    topic: 'odob',
    isVerse: false,
    work: { uz: 'Anisut-tolibin · Suhbat fazilati', en: 'Anis al-Talibin · Virtue of Companionship', ru: 'Анис ат-Талибин · Благодать доброго общения' },
    heading: { uz: '«Yo‘limiz xilvatda emas, solih suhbatdadir»', en: '“Our Path Is Righteous Companionship, Not Isolation”', ru: '«Наш путь — в благом общении, а не в затворничестве»' },
    excerpt: {
      uz: "Hazrat Bahouddin Naqshband aytdilar: «Bizning tariqatimiz suhbatdadir! Xilvatda (uzlatda) shuhrat va manmanlik xavfi bor, xayr-baraka esa solih insonlar bilan birgalikda, jamiyat ichida yaxshilik ulashishdadir».",
      en: 'Bahauddin Naqshband declared: “Our path is rooted in righteous companionship (suhbah)! Seclusion carries the hidden danger of vanity and fame, whereas true blessing lies in community and shared goodness.”',
      ru: 'Бахауддин Накшбанд говорил: «Наш путь — в благом общении (сухбате)! В затворничестве таится опасность тщеславия, а истинная благодать — в единстве с праведными людьми и пользе обществу».',
    },
    sharh: {
      uz: "Insonlardan uzilib yolg'iz qolish emas, balki yaxshi insonlar bilan yelkama-yelka turib oilaga, mahallaga va jamiyatga foyda keltirish Naqshbandiya maktabining eng go'zal xususiyatidir.",
      en: 'Rather than retreating from people, standing shoulder-to-shoulder with good people to uplift family and community is the hallmark of Naqshbandi wisdom.',
      ru: 'Не бегство от мира, а совместное созидание с достойными людьми на благо семьи и общества — главная красота школы Накшбандия.',
    },
  },
  {
    id: 'naq_08',
    scholarId: 'naqshband',
    topic: 'qalb',
    isVerse: false,
    work: { uz: 'Kalimoti Qudsiya · Yodkard va Yoddosht', en: 'Kalimat-i Qudsiyya · Yodkard & Yoddosht', ru: 'Калимат-и Кудсийя · Йодкард и Йоддошт' },
    heading: { uz: 'Yodkard va Yoddosht: Qalbda doimiy uyg‘oqlik', en: 'Yodkard & Yoddosht: Effortless Heart Awareness', ru: 'Йодкард и Йоддошт: живая память сердца' },
    original: 'یَادکَرد · یَاددَاشت',
    excerpt: {
      uz: "«Yodkard» — til va qalb bilan Allohni muntazam zikr qilib borishdir. Bu odat qalbga chuqur o'rnashgach, «Yoddosht» — ya'ni mashaqqatsiz, tabiiy ravishda har doim Alloh huzurida ekanini his qilib yashash darajasiga yetiladi.",
      en: '“Yodkard” is steady, intentional remembrance of Allah. Once rooted deeply, it blossoms into “Yoddosht”—an effortless, serene awareness of Allah’s presence in every moment of daily life.',
      ru: '«Йодкард» — постоянное осознанное поминание Аллаха. Укоренившись в сердце, оно переходит в «Йоддошт» — естественное, спокойное ощущение близости Всевышнего в каждый миг жизни.',
    },
    sharh: {
      uz: "Har kun tong va kechqurun oz bo'lsa-da muntazam zikr qilish vaqt o'tishi bilan qalbga osoyishtalik va stressga qarshi mustahkam immunitet beradi.",
      en: 'A few consistent minutes of morning and evening remembrance gradually build deep emotional calm and resilience against daily anxiety.',
      ru: 'Ежедневный утренний и вечерний зикр постепенно дарит душе глубокий покой и устойчивость перед житейскими тревогами.',
    },
  },
  {
    id: 'naq_09',
    scholarId: 'naqshband',
    topic: 'odob',
    isVerse: false,
    work: { uz: 'Rashahot aynil-hayot', en: 'Rashahat Ayn al-Hayat', ru: 'Рашахат Айн аль-Хаят' },
    heading: { uz: 'Yomonlikka yaxshilik bilan javob qaytarish', en: 'Answering Harshness with Grace', ru: 'Отвечать добром на грубость' },
    excerpt: {
      uz: "Hazrat Naqshband nasihat qilardilar: «Agar bir kishi senga ozor bersa, unga qahr bilan javob qaytarmagin; balki unga yaxshilik tila va duo qil. Zero olovni olov bilan emas, suv bilan o'chiradilar».",
      en: 'Imam Naqshband counseled: “When someone wrongs you, do not answer with bitterness; wish them guidance and pray for them—for fire is never extinguished by fire, only by cool water.”',
      ru: 'Хазрат Накшбанд наставлял: «Если кто-то обидел тебя, не отвечай злобой — пожелай ему добра и помолись за него, ибо огонь тушат не огнём, а водой».',
    },
    sharh: {
      uz: "«Yomonlikni eng go'zal narsa (yaxshilik) bilan daf qil» (Fussilat, 34). G'azabga sabr va mehr bilan javob berish nafaqat raqib qalbini yumshatadi, balki o'zingizni ham adovat yukidan xalos qiladi.",
      en: '“Repel evil with that which is better” (Quran 41:34). Responding with grace softens hearts and frees you from carrying resentment.',
      ru: '«Оттолкни зло тем, что лучше» (Коран, 41:34). Добродушный ответ смягчает сердца и освобождает самого человека от тяжести обид.',
    },
  },

  // --- Alisher Navoiy (+4 verified from Arba'in & Mahbub ul-Qulub) ---
  {
    id: 'nav_07',
    scholarId: 'navoiy',
    topic: 'odob',
    isVerse: true,
    work: { uz: "Arba'in (Qirq Hadis) · 3-hadis", en: "Arba'in (40 Hadiths) · Hadith 3", ru: 'Арбаин (40 хадисов) · Хадис 3' },
    heading: { uz: 'Haqiqiy musulmon — tili va qo‘lidan el omon topgan kishidir', en: 'A True Muslim Brings Safety by Tongue and Hand', ru: 'Истинный мусульманин — от чьего языка и рук люди в безопасности' },
    original:
      "Kim musulmonlig' aylasa da'vo,\nChin emas, gar fido qilur jonlar.\nUl musulmondururki, solimdur\nTiliyu ilgidin musulmonlar.",
    excerpt: {
      uz: "«Haqiqiy musulmon — boshqa musulmonlar uning tili va qo'lidan salomat (omon) bo'lgan kishidir» (Sahihul Buxoriy, 10-hadis). Navoiy: «Quruq da'vo emas, balki tilidan ham, qo'lidan ham odamlarga ozor yetmasligi haqiqiy musulmonlik belgisidir».",
      en: '“The true Muslim is the one from whose tongue and hand others are safe.” (Sahih al-Bukhari 10). Navoi writes that mere claims mean nothing unless people experience genuine safety from our speech and actions.',
      ru: '«Мусульманин — это тот, от языка и рук которого защищены другие люди» (Сахих аль-Бухари, 10). Навои подчёркивает: подлинная вера подтверждается не словами, а безопасностью людей от нашей речи и поступков.',
    },
    sharh: {
      uz: "Bugun «til va qo'l» deganda telefonimizdagi izohlar, xabarlar va internetdagi munosabatlarimiz ham kiradi. Hech kimga behuda dilozorlik qilmaslik — eng oliy musulmonlik odobidir.",
      en: 'Today our “tongue and hand” also include our messages, comments, and posts online. Bringing safety and kindness wherever we interact is living Prophetic character.',
      ru: 'Сегодня «язык и руки» включают и наши сообщения и комментарии в сети. Не причинять людям боли ни в жизни, ни в интернете — высшая культура верующего.',
    },
  },
  {
    id: 'nav_08',
    scholarId: 'navoiy',
    topic: 'tawhid',
    isVerse: true,
    work: { uz: "Arba'in (Qirq Hadis) · 2-hadis", en: "Arba'in (40 Hadiths) · Hadith 2", ru: 'Арбаин (40 хадисов) · Хадис 2' },
    heading: { uz: 'Alloh uchun yaxshi ko‘rish va Alloh uchun berish', en: 'Loving and Giving Purely for Allah', ru: 'Любить и отдавать ради Аллаха' },
    original:
      "Kimgakim hubbu bug'zu man'u ato\nHaq uchun bo'ldi jazm, bil, oning\nKim erur Tangri lutfidin komil\nAhli iymon qoshida iymoni.",
    excerpt: {
      uz: "«Kim Alloh uchun bersa, Alloh uchun man qilsa, Alloh uchun yaxshi ko'rsa va Alloh uchun yomon ko'rsa, batahqiq, iymonini mukammal qilibdi» (Sunani Abu Dovud). Navoiy xolislikni komil iymonning mezoni sifatida tarannum etgan.",
      en: '“Whoever gives for Allah, withholds for Allah, loves for Allah, and dislikes for Allah has perfected their faith.” Navoi celebrates pure sincerity as the summit of Iman.',
      ru: '«Кто дарит ради Аллаха, удерживает ради Аллаха, любит и отвергает ради Аллаха — тот довёл свою веру до совершенства». Навои воспевает искренность как вершину веры.',
    },
    sharh: {
      uz: "Do'stligimiz manfaat uchun emas, balki yaxshilik va taqvo ustida qurilsa, u abadiy va barakali bo'ladi. Har bir ehsonni Alloh roziligi uchun qilsangiz, minnat va xafagarchilik qolmaydi.",
      en: 'Friendships built on goodness rather than selfish gain endure forever, and charity given purely for Allah frees you from expecting gratitude in return.',
      ru: 'Дружба, основанная на добре, а не на выгоде, долговечна, а помощь ради Аллаха освобождает от обид и ожидания благодарности.',
    },
  },
  {
    id: 'nav_09',
    scholarId: 'navoiy',
    topic: 'ilm',
    isVerse: true,
    work: { uz: 'Mahbub ul-Qulub · Ustoz haqqi', en: 'Mahbub al-Qulub · Honoring Teachers', ru: 'Махбуб аль-Кулуб · Почтение к наставнику' },
    heading: { uz: 'Ustozning bir harf o‘rgatgan haqqi', en: 'The Priceless Debt to a Teacher', ru: 'Бесценный труд учителя' },
    original:
      "Haq yo'lida kim senga bir harf o'qitmish ranj ila,\nAylamak bo'lmas ado oning haqin yuz ganj ila.",
    excerpt: {
      uz: "Kim senga haq va ilm yo'lida mashaqqat chekib bittagina harf o'rgatgan bo'lsa ham, uning haqqini yuzta xazina bilan ham to'liq ado etib bo'lmaydi!",
      en: 'Whoever took the pains to teach you even a single letter on the path of truth—you could never fully repay their debt even with a hundred treasuries.',
      ru: 'Тому, кто с трудом обучил тебя хоть одной букве на пути истины, не воздать сполна даже сотней сокровищ.',
    },
    sharh: {
      uz: "Navoiyning bu o'lmas bayti o'zbek xalqining ustozga bo'lgan chuqur ehtiromini ifodalaydi. Ustozlarini e'zozlab, ularning haqqiga duo qilib yurgan shogird ilmida doimo baraka bo'ladi.",
      en: 'This immortal couplet embodies Uzbek reverence for teachers. Honoring your mentors and praying for them brings lasting barakah into everything you learn.',
      ru: 'Это бессмертное двустишие Навои воплощает глубокое уважение к наставникам. Почтение к учителям и молитва за них приносят особую благодать в знаниях.',
    },
  },
  {
    id: 'nav_10',
    scholarId: 'navoiy',
    topic: 'odob',
    isVerse: true,
    work: { uz: "Arba'in (Qirq Hadis) · 4-hadis", en: "Arba'in (40 Hadiths) · Hadith 4", ru: 'Арбаин (40 хадисов) · Хадис 4' },
    heading: { uz: 'Mo‘minda baxillik va yomon xulq jamlanmaydi', en: 'Stinginess & Bad Character Do Not Fit a Believer', ru: 'Скупость и дурной нрав несовместимы с верой' },
    original:
      "Mo'min ersang, qilib duringni nisor,\nEl bila ravshan o'l nechukkim sham'.\nNegakim, Tangri hech mo'minda\nBuxlu badxulqliqni etmas jam'.",
    excerpt: {
      uz: "«Ikki xislat — baxillik va yomon xulq mo'minda aslo birga jamlanmaydi» (Sunani Termiziy). Navoiy mo'minni atrofdagilarga nur va saxovat ulashuvchi shamga qiyoslaydi.",
      en: '“Two traits are never gathered together in a believer: stinginess and bad character.” (Jami at-Tirmidhi). Navoi likens the believer to a glowing candle radiating warmth and generosity.',
      ru: '«Два качества не соединяются в верующем: скупость и дурной нрав» (Сунан ат-Тирмизи). Навои сравнивает верующего со свечой, дарящей людям свет и тепло.',
    },
    sharh: {
      uz: "Saxiylik faqat pul bilan emas — tabassum, chiroyli muomala, vaqt ajratish va ilm ulashish bilan ham bo'ladi. Qalbi keng va xulqi go'zal inson hamma joyda azizdir.",
      en: 'Generosity goes far beyond money—it shines through a warm smile, patience, time, and kindness. An open heart and gentle character are cherished everywhere.',
      ru: 'Щедрость проявляется не только в деньгах, но и в улыбке, мягком нраве, внимании и доброте. Великодушного человека любят повсюду.',
    },
  },

  // --- So'fi Olloyor (+3 verified from Sabotul Ojizin) ---
  {
    id: 'oll_07',
    scholarId: 'olloyor',
    topic: 'tawhid',
    isVerse: true,
    work: { uz: 'Sabotul Ojizin · Muqaddima (1–2-baytlar)', en: 'Sabat al-Ajizin · Opening Praise', ru: 'Сабат аль-Аджизин · Вступление' },
    heading: { uz: 'Sano lil-xoliqi g‘abrovu aflok', en: 'Praise to the Creator of Earth and Heavens', ru: 'Хвала Создателю земли и небес' },
    original:
      "Sano lil-xoliqi g'abrovu aflok,\nYaratdi qatradin bir gavhari pok.\nSamovot uyini tutdi muallaq,\nJahona hukmini ko'rsatdi mutlaq.",
    excerpt: {
      uz: "Yer va osmonlarni yaratgan Xoliqqa behad hamd-u sano bo'lsin — U bir tomchidan pok gavhar (inson)ni yaratdi, osmonlarni ustunsiz tutib turdi va butun olamda mutlaq hikmatli hukmini joriy qildi.",
      en: 'All praise to the Creator of earth and heavens, Who fashioned a pure jewel (humanity) from a single drop, raised the skies without pillars, and governs all worlds with absolute wisdom.',
      ru: 'Хвала Создателю земли и небес, сотворившему из капли чистую жемчужину — человека, воздвигшему небосвод без опор и утвердившему во вселенной Свою совершенную власть.',
    },
    sharh: {
      uz: "«Sabotul Ojizin»ning asrlar davomida yod olingan ushbu ilk baytlari insonni yaratilish mo'jizasi haqida tafakkur qilishga va Yaratganga shukr aytishga chorlaydi.",
      en: 'Memorized for centuries across Uzbekistan, these opening couplets invite us to pause in awe at creation and begin every chapter of life with gratitude to Allah.',
      ru: 'Эти знаменитые вступительные строки «Сабат аль-Аджизин», которые веками учили наизусть, побуждают к размышлению о чуде творения и благодарности Всевышнему.',
    },
  },
  {
    id: 'oll_08',
    scholarId: 'olloyor',
    topic: 'qalb',
    isVerse: true,
    work: { uz: 'Sabotul Ojizin · Na’ti Rasululloh ﷺ', en: 'Sabat al-Ajizin · Praise of the Prophet ﷺ', ru: 'Сабат аль-Аджизин · Восхваление Пророка ﷺ' },
    heading: { uz: 'Olamlar rahmati Rasulullohga ﷺ salovot', en: 'Salawat Upon the Mercy to All Worlds ﷺ', ru: 'Салават Милости для миров ﷺ' },
    original:
      "Durudi beadad hodiyi ding'a,\nRasuli «rahmatan lil-olamin»g'a.\nXudoning do'sti muxtorul-qurayshiy,\nMudom ummat uchun talx erdi ayshi.",
    excerpt: {
      uz: "Din hidoyatchisi va «olamlarga rahmat» qilib yuborilgan Rasulullohga ﷺ behisob salovot va salomlar bo'lsin! U Zot ummatining g'amini chekib, ularning najoti uchun doim kuyunib yashaganlar.",
      en: 'Countless blessings and peace upon the Guide of Faith, sent as “a mercy to all worlds” ﷺ — Allah’s beloved Messenger whose heart constantly cared and prayed for the salvation of his Ummah.',
      ru: 'Бесчисленные благословения Наставнику веры, посланному как «милость для миров» ﷺ — возлюбленному Посланнику, всё сердце которого неустанно болело за спасение своей уммы.',
    },
    sharh: {
      uz: "Payg'ambarimizga ﷺ muhabbat — ul Zotga ko'p salovot aytish va sunnatlariga — yumshoqlik, rostgo'ylik va ummatga g'amxo'rlik xulqlariga ergashish bilan isbotlanadi.",
      en: 'Love for the Prophet ﷺ shines both through abundant Salawat and by living his Sunnah of gentleness, honesty, and care for others.',
      ru: 'Любовь к Пророку ﷺ проявляется в частом салавате и следовании его Сунне — мягкости, честности и заботе о людях.',
    },
  },
  {
    id: 'oll_09',
    scholarId: 'olloyor',
    topic: 'qalb',
    isVerse: true,
    work: { uz: 'Sabotul Ojizin · Nasihat qabul qilish', en: 'Sabat al-Ajizin · Softness of Heart', ru: 'Сабат аль-Аджизин · Восприимчивость к совету' },
    heading: { uz: 'Qattiq toshga yomg‘ir yog‘sa ham ko‘karmas', en: 'Rain Cannot Make Hard Stone Bloom', ru: 'На жёстком камне трава не взойдёт даже от дождя' },
    original:
      "Nasihat tinglamas dil saxti mahjub,\nKo'karmas toshga yomg'ur yog'sa ham ko'p.",
    excerpt: {
      uz: "Qotib qolgan, pardalangan qalb qancha pand-nasihat eshitsa ham ta'sirlanmaydi — xuddi qattiq xarsang tosh ustiga qancha ko'p yomg'ir yog'masin, undan maysa unib chiqmaganidek.",
      en: 'A hardened, veiled heart takes no benefit from counsel—just as even abundant rain falling upon solid stone brings forth no green blade of grass.',
      ru: 'Очерствевшее, закрытое сердце не внемлет наставлениям — точно так же, как на голом камне не вырастет зелень, сколько бы ни шёл дождь.',
    },
    sharh: {
      uz: "Qalbni yumshoq tutish uchun Qur'on tilovati, istig'for, yetimlarga mehr va xolis nasihatni kibrsiz tinglay olish fazilati juda muhimdir.",
      en: 'Keep the heart fertile and receptive through Quran recitation, istighfar, kindness to the vulnerable, and the humility to welcome sincere advice.',
      ru: 'Чтобы сердце оставалось мягким и живым, нужны чтение Корана, покаяние, доброта к слабым и смирение, позволяющее принимать добрый совет.',
    },
  },

  // --- Abdulxoliq G'ijduvoniy (+3 verified from Vasiyatnoma & Kalimoti Qudsiya) ---
  {
    id: 'gij_07',
    scholarId: 'gijduvoniy',
    topic: 'qalb',
    isVerse: false,
    work: { uz: 'Kalimoti Qudsiya · Vuqufi Qalbiy & Adadiy', en: 'Kalimat-i Qudsiyya · Heart Presence in Dhikr', ru: 'Калимат-и Кудсийя · Присутствие сердца в зикре' },
    heading: { uz: 'Vuqufi qalbiy: Til emas, qalb ham uyg‘oq bo‘lsin', en: 'Wuquf-i Qalbi: Let the Heart Join the Tongue', ru: 'Вукуф-и кальби: пусть сердце бодрствует вместе с языком' },
    original: 'وُقُوفِ قَلْبِی · وُقُوفِ عَدَدِی',
    excerpt: {
      uz: "«Vuqufi qalbiy» — zikr va ibodat chog'ida faqat tilni qimirlatib qo'ymay, qalbni ham Allohga yuzlantirib hushyor tutishdir. «Vuqufi adadiy» esa zikr soniga e'tibor berib, xayol tarqalib ketishining oldini olishdir.",
      en: '“Wuquf-i qalbi” means keeping the heart genuinely attentive to Allah rather than letting the tongue move mechanically. “Wuquf-i adadi” uses mindful counting to anchor focus and prevent wandering thoughts.',
      ru: '«Вукуф-и кальби» — обращать к Аллаху само сердце, чтобы зикр не был лишь механическим движением языка. «Вукуф-и адади» — внимательный счёт зикра, удерживающий мысли от рассеивания.',
    },
    sharh: {
      uz: "Tasbeh o'girganda shoshilmay, har bir «Subhanalloh», «Alhamdulillah» va «Allohu Akbar»ning ma'nosini qalbda his qilib aytish — g'aflat bilan aytilgan mingta zikrdan afzaldir.",
      en: 'Thirty-three unhurried tasbihs felt deeply in the heart outweigh a thousand rushed repetitions uttered in distraction.',
      ru: 'Тридцать три неспешных тасбиха, прочувствованных сердцем, ценнее тысячи рассеянных повторений.',
    },
  },
  {
    id: 'gij_08',
    scholarId: 'gijduvoniy',
    topic: 'mehnat',
    isVerse: false,
    work: { uz: 'Vasiyatnoma · Yashirin sadaqa', en: 'Wasiyyatnama · Secret Generosity', ru: 'Васиятнома · Тайная щедрость' },
    heading: { uz: 'Halol topib, yashirincha ehson qilish', en: 'Earn Lawfully and Give Quietly', ru: 'Зарабатывай честно и помогай тайно' },
    excerpt: {
      uz: "«O'z peshona tering bilan topgan halol rizqingdan muhtojlarga yashirincha ulashgin. O'ng qo'ling berganini chap qo'ling bilmasin — shunda sening sadaqang ham riyodan pok, muhtojning esa izzati omon qoladi».",
      en: '“Share secretly with those in need from the lawful bread earned by your own sweat. Let not your left hand know what your right hand gives—so your charity stays pure and the recipient’s dignity stays intact.”',
      ru: '«Делись с нуждающимися тайно из честного заработка своих рук. Пусть левая рука не знает, что даёт правая — так твоя милостыня останется искренней, а достоинство человека не будет задето».',
    },
    sharh: {
      uz: "Birovga yordam berganda uni rasmga tushirib maqtanmaslik va muhtojni xijolat qilmaslik — haqiqiy ehson odobidir.",
      en: 'Helping quietly without filming, boasting, or embarrassing the person in need preserves both sincerity and human dignity.',
      ru: 'Помогать тихо, без хвастовства и смущения нуждающегося — высшая культура благотворительности.',
    },
  },
  {
    id: 'gij_09',
    scholarId: 'gijduvoniy',
    topic: 'ilm',
    isVerse: false,
    work: { uz: 'Vasiyatnoma · Ilm va Ustoz odobi', en: 'Wasiyyatnama · Respecting Scholars & Humility', ru: 'Васиятнома · Почтение к учёным' },
    heading: { uz: 'Haqiqiy olimlarni e’zozlash va da’vodan saqlanish', en: 'Honor True Scholars & Avoid Empty Claims', ru: 'Почитай истинных учёных и сторонись самозванства' },
    excerpt: {
      uz: "«O'zingni hech qachon avliyo yoki kamolot egasi deb da'vo qilma; ahli ilm va solih ulamolarni hurmat qil, din ishlarida shaxsiy havoyi fikringni emas, Qur'on, Sunnat va mujtahid imomlar yo'lini ustun tut».",
      en: '“Never claim spiritual rank for yourself; honor people of authentic knowledge, and prioritize the Quran, Sunnah, and grounded scholarship over personal whims.”',
      ru: '«Никогда не приписывай себе высоких духовных степеней; уважай истинных учёных и ставь Коран, Сунну и прочное знание выше личных домыслов».',
    },
    sharh: {
      uz: "Xojai Jahon G'ijduvoniyning bu o'giti bugungi kunda ham har xil asossiz da'volar va bilimsiz maslahatchilardan saqlanishda mustahkam mezon bo'lib xizmat qiladi.",
      en: 'Ghijduwani’s counsel remains a timely safeguard against self-proclaimed gurus—always measure claims against sound knowledge and humility.',
      ru: 'Это наставление Гиждувани остаётся надёжной защитой от самозванцев: любое духовное слово проверяется прочным знанием и скромностью.',
    },
  },

  // --- Imom al-Buxoriy (+3 verified from Sahih al-Bukhari) ---
  {
    id: 'bux_07',
    scholarId: 'buxoriy',
    topic: 'mehnat',
    isVerse: false,
    work: { uz: 'Sahihul Buxoriy · 6464-hadis', en: 'Sahih al-Bukhari · Hadith 6464', ru: 'Сахих аль-Бухари · Хадис 6464' },
    heading: { uz: 'Oz bo‘lsa ham davomli amal — eng suyuklisidir', en: 'Small Consistent Deeds Are Most Beloved to Allah', ru: 'Малые, но постоянные дела — самые любимые у Аллаха' },
    original: 'أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ',
    excerpt: {
      uz: "Imom al-Buxoriy rivoyat qilgan mashhur hadisi sharif: «Alloh taologa eng suyukli amal — oz bo'lsa-da, muntazam davom etib turadiganidir». Bir kunda haddan ortiq toliqib keyin tashlab qo'ygandan ko'ra, har kuni oz-ozdan sobit qadam bo'lish afzaldir.",
      en: 'Imam al-Bukhari recorded: “The deeds most beloved to Allah are those done consistently, even if they are small.” Steady daily devotion outlasts short bursts of burnout.',
      ru: 'Имам аль-Бухари передал хадис: «Самые любимые дела перед Аллахом — те, которые совершаются постоянно, даже если они невелики». Постоянство важнее разового порыва.',
    },
    sharh: {
      uz: "Har kuni 1 sahifa Qur'on o'qish, 33 marta tasbeh aytish yoki 1 ta yangi hikmat o'rganish bir yilda ulkan ma'naviy xazinaga aylanadi.",
      en: 'One page of Quran, one quiet dhikr session, or one act of kindness every single day builds a life-changing spiritual treasury over a year.',
      ru: 'Одна страница Корана, короткий ежедневный зикр или одно доброе дело в день за год превращаются в огромное духовное богатство.',
    },
  },
  {
    id: 'bux_08',
    scholarId: 'buxoriy',
    topic: 'odob',
    isVerse: false,
    work: { uz: 'Sahihul Buxoriy · 6018-hadis', en: 'Sahih al-Bukhari · Hadith 6018', ru: 'Сахих аль-Бухари · Хадис 6018' },
    heading: { uz: 'Yaxshi gapir yoki sukut saqla, qo‘shni va mehmonga ikrom qil', en: 'Speak Good or Stay Silent, Honor Neighbor & Guest', ru: 'Говори благое или молчи, чти соседа и гостя' },
    original: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
    excerpt: {
      uz: "«Kim Allohga va oxirat kuniga iymon keltirgan bo'lsa, yaxshi so'z aytsin yoki jim tursin; qo'shnisini hurmat qilsin; mehmoniga ikrom ko'rsatsin!» — Imom al-Buxoriy bu hadisni go'zal axloqning uch ustuni sifatida keltirganlar.",
      en: '“Whoever believes in Allah and the Last Day, let them speak good or remain silent; let them honor their neighbor; and let them honor their guest.” (Sahih al-Bukhari 6018).',
      ru: '«Кто верует в Аллаха и Последний день, пусть говорит благое или молчит; пусть оказывает почёт соседу; пусть щедро принимает гостя» (Сахих аль-Бухари, 6018).',
    },
    sharh: {
      uz: "O'zbekona mehmondo'stlik, mahalla-qo'shnichilik hurmati va o'ylab gapirish madaniyati aynan shu muborak hadisdan suv ichgan.",
      en: 'Central Asian hospitality, warm neighborhood bonds, and thoughtful speech draw directly from this prophetic standard.',
      ru: 'Традиции гостеприимства, добрососедства и сдержанности речи напрямую питаются этим благословенным хадисом.',
    },
  },
  {
    id: 'bux_09',
    scholarId: 'buxoriy',
    topic: 'nafs',
    isVerse: false,
    work: { uz: 'Sahihul Buxoriy · 6412-hadis', en: 'Sahih al-Bukhari · Hadith 6412', ru: 'Сахих аль-Бухари · Хадис 6412' },
    heading: { uz: 'Qadriga yetilmaydigan ikki buyuk ne’mat', en: 'Two Great Blessings Most People Waste', ru: 'Две великие милости, которые люди часто упускают' },
    original: 'نِعْمَتَانِ مَغْبُونٌ فِيهِمَا كَثِيرٌ مِنَ النَّاسِ: الصِّحَّةُ وَالْفَرَاغُ',
    excerpt: {
      uz: "«Ikki ne'mat borki, ko'pchilik insonlar ularning qadriga yetmay aldanib qoladilar: ular — sog'lik-salomatlik va bo'sh vaqtdir» (Sahihul Buxoriy, 6412).",
      en: '“There are two blessings which many people lose track of and waste: good health and free time.” (Sahih al-Bukhari 6412).',
      ru: '«Есть две милости, в отношении которых многие люди оказываются в убытке: это здоровье и свободное время» (Сахих аль-Бухари, 6412).',
    },
    sharh: {
      uz: "Kasal bo'lmasdan turib sog'likning, band bo'lmasdan turib bo'sh vaqtning qadriga yetish — uni behuda o'yin-kulgiga emas, ilm, ibodat, oila va foydali hunarga sarflashdir.",
      en: 'Treasure health before illness arrives and spare hours before life crowds them—invest them in faith, learning, family, and meaningful work.',
      ru: 'Цени здоровье до болезни и свободный час до занятости — вкладывай их в веру, знания, семью и полезный труд.',
    },
  },

  // --- Imom al-Moturidiy (+3 verified from Kitob at-Tavhid & Ta'vilot) ---
  {
    id: 'mot_07',
    scholarId: 'moturidiy',
    topic: 'tawhid',
    isVerse: false,
    work: { uz: 'Kitob at-Tavhid · Dalili tamonu‘', en: 'Kitab al-Tawhid · Proof of Cosmic Harmony', ru: 'Китаб ат-Таухид · Довод о гармонии мироздания' },
    heading: { uz: 'Koinotdagi mukammal tartib — Tavhidning yorqin dalilidir', en: 'Universal Order Points Clearly to One Creator', ru: 'Совершенный порядок вселенной — ясный довод Таухида' },
    excerpt: {
      uz: "Imom al-Moturidiy «Kitob at-Tavhid»da isbotlaydilar: «Agar koinotda bittadan ortiq iloh bo'lganida, ularning irodalari to'qnashib, osmonlar va yerdagi bu mukammal tartib-intizom bir lahzada buzilib ketgan bo'lardi. Demak, olamning Yaratuvchisi va Boshqaruvchisi Yagona Allohdir».",
      en: 'In Kitab al-Tawhid, Imam al-Maturidi argues: “Had there been more than one deity, competing wills would have shattered the flawless harmony of the cosmos. The unified laws of heaven and earth testify to the Oneness of Allah.”',
      ru: 'В «Китаб ат-Таухид» имам аль-Матуриди доказывает: «Если бы у мироздания было более одного божества, противоречие воль мгновенно разрушило бы безупречный порядок небес и земли. Единство законов космоса свидетельствует о Единственности Аллаха».',
    },
    sharh: {
      uz: "Kechayu kunduz almashinuvi, fasllar tartibi va tabiatdagi nozik muvozanat ustida fikr yuritish inson qalbidagi iymonni yanada chuqurlashtiradi.",
      en: 'Reflecting on the precision of day and night, changing seasons, and natural laws turns everyday wonder into deeper conviction.',
      ru: 'Размышление над сменой дня и ночи, гармонией природы и точностью законов вселенной укрепляет живую убеждённость сердца.',
    },
  },
  {
    id: 'mot_08',
    scholarId: 'moturidiy',
    topic: 'qalb',
    isVerse: false,
    work: { uz: "Ta'vilot Ahlis-Sunna · Shukr haqiqati", en: "Ta'wilat Ahl al-Sunnah · Essence of Gratitude", ru: 'Тавилат Ахль ас-Сунна · Суть благодарности' },
    heading: { uz: 'Haqiqiy shukr — ne’matni to‘g‘ri o‘rinda ishlatishdir', en: 'True Gratitude Is Using Blessings Rightly', ru: 'Истинная благодарность — верное применение благ' },
    excerpt: {
      uz: "Imom al-Moturidiy shukrning uch darajasini bayon qilganlar: ne'mat Allohdan ekanini qalbda tan olish, til bilan hamd aytish va eng muhimi — berilgan sog'lik, ilm va mol ne'matlarini Alloh rozi bo'ladigan xayrli yo'lda ishlatishdir.",
      en: 'Imam al-Maturidi explained three dimensions of gratitude (shukr): recognizing the Giver in the heart, praising Him with the tongue, and—most crucially—using health, knowledge, and wealth for good.',
      ru: 'Имам аль-Матуриди раскрыл три ступени благодарности: признавать сердцем, что благо от Аллаха, восхвалять Его языком и главное — направлять здоровье, знания и достаток на благие дела.',
    },
    sharh: {
      uz: "Shukr faqat «Alhamdulillah» deyish bilan cheklanmaydi; ko'z, qo'l, aql va boylikni yaxshilikka xizmat qildirish — amaliy shukrdir va u ne'matni yanada ziyoda qiladi.",
      en: 'Gratitude shines brightest in action: putting our eyes, hands, intellect, and resources to work for goodness multiplies every blessing.',
      ru: 'Благодарность сильнее всего проявляется в делах: когда наш разум, руки и достаток служат добру, милости приумножаются.',
    },
  },
  {
    id: 'mot_09',
    scholarId: 'moturidiy',
    topic: 'ilm',
    isVerse: false,
    work: { uz: 'Kitob at-Tavhid · Taqlid va Tafakkur', en: 'Kitab al-Tawhid · Reflection Over Blind Imitation', ru: 'Китаб ат-Таухид · Осмысленная вера' },
    heading: { uz: 'Tafakkur va dalil bilan mustahkamlangan iymon', en: 'Faith Strengthened by Reflection & Understanding', ru: 'Вера, укреплённая размышлением и знанием' },
    excerpt: {
      uz: "Imom al-Moturidiy har bir musulmonni o'z e'tiqodini tushunib, aql va dalil bilan mustahkamlashga undaganlar: ko'r-ko'rona taqliddan ko'ra, Qur'on ma'nolarini anglab, olam hikmatini mushohada etish qalbni shubhalardan himoya qiladi.",
      en: 'Imam al-Maturidi encouraged believers to anchor their faith in understanding rather than passive imitation—reflecting on Quranic guidance and the signs in creation shields the heart from doubt.',
      ru: 'Имам аль-Матуриди призывал верующих укреплять убеждения осмысленным пониманием, а не слепым подражанием: постижение смыслов Корана защищает сердце от сомнений.',
    },
    sharh: {
      uz: "O'qish, savol berish, ishonchli olimlardan o'rganish va tafakkur qilish — Moturidiy merosining eng go'zal ilmiy an'anasidir.",
      en: 'Reading thoughtfully, asking honest questions, and learning from authentic scholars carries forward Samarkand’s proud intellectual heritage.',
      ru: 'Вдумчивое чтение, искренний поиск истины и обучение у достоверных учёных продолжают великую самаркандскую традицию.',
    },
  },

  // --- Burhoniddin al-Marg'inoniy (+3 verified from Al-Hidoya) ---
  {
    id: 'mar_07',
    scholarId: 'marginoniy',
    topic: 'odob',
    isVerse: false,
    work: { uz: 'Al-Hidoya · Zararni daf qilish qoidasi', en: 'Al-Hidayah · Preventing Harm', ru: 'Аль-Хидая · Запрет причинения вреда' },
    heading: { uz: 'Zarar berish ham, zararga zarar bilan javob berish ham yo‘q', en: 'Neither Cause Harm Nor Reciprocate Harm', ru: 'Нельзя причинять вред ни первому, ни в ответ' },
    original: 'لَا ضَرَرَ وَلَا ضِرَارَ',
    excerpt: {
      uz: "«Al-Hidoya»ning barcha muomala va qo'shnichilik boblarida amal qiluvchi ulug' qoida: inson o'z mulkidan foydalanganda ham qo'shnisiga, jamoat yo'liga, suvga va tabiatga zarar yetkazishi joiz emas.",
      en: 'A guiding principle across Al-Hidayah’s chapters on property and neighbors: even when using your own property, you may not cause harm to neighbors, public roads, shared water, or the environment.',
      ru: 'Важнейшее правило «Аль-Хидаи» в главах о соседстве и праве: даже пользуясь собственным имуществом, человек не имеет права вредить соседям, дорогам, воде и природе.',
    },
    sharh: {
      uz: "Yo'lni to'sib mashina qo'ymaslik, kechasi shovqin solmaslik, chiqindi tashlamaslik va atrofdagilar tinchligini asrash — Hanafiy fiqhining kundalik madaniyatidir.",
      en: 'Parking considerately, keeping noise respectful at night, not littering, and protecting shared spaces are everyday expressions of Hanafi civic ethics.',
      ru: 'Уважительная парковка, тишина ночью, чистота на улицах и бережное отношение к общему пространству — живое проявление ханафитской культуры.',
    },
  },
  {
    id: 'mar_08',
    scholarId: 'marginoniy',
    topic: 'odob',
    isVerse: false,
    work: { uz: 'Al-Hidoya · Nikoh va Nafaqa bobi', en: 'Al-Hidayah · Family Rights & Kindness', ru: 'Аль-Хидая · Глава о семье и правах супругов' },
    heading: { uz: 'Oilada o‘zaro hurmat va ayol haq-huquqlarini himoya qilish', en: 'Protecting Family Harmony & Women’s Rights', ru: 'Гармония семьи и защита прав женщины' },
    excerpt: {
      uz: "Burhoniddin al-Marg'inoniy «Al-Hidoya»da ayolning roziligisiz nikoh bog'lanmasligini, uning mahr, halol nafaqa, alohida turar joy va go'zal muomala haqqini aniq huquqiy kafolatlar bilan mustahkamlab qo'yganlar.",
      en: 'In Al-Hidayah, al-Marghinani safeguarded women’s explicit consent in marriage alongside their full legal rights to mahr, dignified maintenance, shelter, and kind treatment.',
      ru: 'В «Аль-Хидае» аль-Маргинани чётко закрепил обязательность согласия женщины на брак, её права на махр, достойное обеспечение, жильё и доброе отношение.',
    },
    sharh: {
      uz: "Hanafiy fiqhi oilani zo'ravonlik emas, balki mehr-muhabbat, mas'uliyat va o'zaro hurmat poydevoriga quradi. Oilasiga eng yaxshi muomala qiluvchi kishi — insonlarning eng yaxshisidir.",
      en: 'Hanafi jurisprudence builds the home on mercy, dignity, and mutual responsibility—echoing the Prophetic teaching that the best of you are those best to their families.',
      ru: 'Ханафитское право строит семью на милосердии, достоинстве и взаимной ответственности: лучший из людей тот, кто лучше всех относится к своей семье.',
    },
  },
  {
    id: 'mar_09',
    scholarId: 'marginoniy',
    topic: 'mehnat',
    isVerse: false,
    work: { uz: 'Al-Hidoya · Qarz va Va’daga vafo bobi', en: 'Al-Hidayah · Honoring Debts & Extending Mercy', ru: 'Аль-Хидая · Верность долгам и милосердие' },
    heading: { uz: 'Qarzni vaqtida ado etish va qiynalganga muhlat berish', en: 'Repaying Debts Promptly & Showing Mercy to the Struggling', ru: 'Возвращать долги вовремя и давать отсрочку нуждающемуся' },
    excerpt: {
      uz: "«Al-Hidoya»da qarz munosabatlarida ikki tomonlama adolat belgilangan: imkoni bor qarzdor qarzini kechiktirishi zulmdir; haqiqatda qiyin ahvolga tushib qolgan insonga muhlat berish yoki qarzidan kechish esa ulkan savob va saxovatdir.",
      en: 'Al-Hidayah teaches two-sided justice in lending: deliberately delaying repayment when able is injustice, while granting respite—or forgiving part of a debt—for someone truly in hardship earns immense reward.',
      ru: '«Аль-Хидая» утверждает обоюдную справедливость в долгах: затягивать возврат при наличии средств — несправедливость, а дать отсрочку попавшему в беду — великое благодеяние.',
    },
    sharh: {
      uz: "Qarz olganda yozib qo'yish va va'da qilingan kunda chiroyli qaytarish insonlar o'rtasidagi ishonch va do'stlikni asrab qoladi.",
      en: 'Recording loans clearly and repaying on the promised date preserves friendships, dignity, and community trust.',
      ru: 'Чёткая запись долга и своевременный возврат оберегают дружбу, честь и взаимное доверие людей.',
    },
  },
];

export function getLocalizedScholar(
  scholar: WisdomScholarRaw,
  lang: AppLanguage
): LocalizedScholar {
  return {
    id: scholar.id,
    years: scholar.years,
    accent: scholar.accent,
    name: pickLocalized(scholar.name, lang),
    title: pickLocalized(scholar.title, lang),
    place: pickLocalized(scholar.place, lang),
    masterwork: pickLocalized(scholar.masterwork, lang),
    bio: pickLocalized(scholar.bio, lang),
  };
}

export function getLocalizedWisdomEntry(
  entry: WisdomEntryRaw,
  lang: AppLanguage
): LocalizedWisdomEntry {
  return {
    id: entry.id,
    scholarId: entry.scholarId,
    topic: entry.topic,
    isVerse: Boolean(entry.isVerse),
    work: pickLocalized(entry.work, lang),
    heading: pickLocalized(entry.heading, lang),
    original: entry.original,
    excerpt: pickLocalized(entry.excerpt, lang),
    sharh: pickLocalized(entry.sharh, lang),
  };
}

export function getDailyWisdomEntry(date: Date = new Date()): WisdomEntryRaw {
  const startOfYear = new Date(date.getFullYear(), 0, 0).getTime();
  const dayOfYear = Math.floor((date.getTime() - startOfYear) / 86_400_000);
  const idx = ((dayOfYear + date.getFullYear()) % WISDOM_ENTRIES.length + WISDOM_ENTRIES.length) % WISDOM_ENTRIES.length;
  return WISDOM_ENTRIES[idx];
}
