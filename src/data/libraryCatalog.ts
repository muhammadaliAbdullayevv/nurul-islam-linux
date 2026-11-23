import { BookCatalogItem } from '../types/libraryBook';

/**
 * Lightweight metadata catalog for Nurul Islam's Hybrid Classical Islamic Library.
 * - Core bundled classics load instantly offline from /data/books/<id>.json.
 * - Extended full-length volumes download on tap from https://nurulislam.mabdullayev.dev/books/<id>.json
 *   and cache permanently offline in IndexedDB.
 */
export const LOCAL_LIBRARY_CATALOG: BookCatalogItem[] = [
  {
    "id": "arbain-nawawi",
    "storage": "bundled",
    "category": "hadith",
    "coverTheme": "emerald",
    "era": "1233–1277",
    "arabicTitle": "الأربعون النووية",
    "title": {
      "uz_lat": "Arba‘in (To‘liq 42 Hadis)",
      "ru": "Сорок хадисов ан-Навави (полн.)",
      "en": "Forty Hadith of an-Nawawi (Complete 42)"
    },
    "author": {
      "uz_lat": "Imom Yahyo ibn Sharaf an-Navaviy",
      "ru": "Имам Яхья ибн Шараф ан-Навави",
      "en": "Imam Yahya ibn Sharaf an-Nawawi"
    },
    "summary": {
      "uz_lat": "Islom asoslarini jamlagan barcha 42 ta mashhur sahih hadislar to‘liq matni.",
      "ru": "Полное собрание из 42 фундаментальных хадисов ислама.",
      "en": "All 42 foundational hadiths of Islam with classical Arabic text."
    },
    "chaptersCount": 42,
    "estimatedPages": 78,
    "sizeKb": 87,
    "contentLangs": [
      "ar",
      "en"
    ]
  },
  {
    "id": "al-azkor-navaviy",
    "storage": "bundled",
    "category": "spirituality",
    "coverTheme": "teal",
    "era": "1233–1277",
    "arabicTitle": "الأذكار النووية",
    "title": {
      "uz_lat": "Al-Azkor (303 Duo va Zikr)",
      "ru": "Аль-Азкар (303 зикра и дуа)",
      "en": "Al-Adhkar (303 Remembrances)"
    },
    "author": {
      "uz_lat": "Imom Yahyo ibn Sharaf an-Navaviy",
      "ru": "Имам ан-Навави",
      "en": "Imam an-Nawawi"
    },
    "summary": {
      "uz_lat": "Kunlik hayotning barcha holatlariga oid 303 ta mo‘tabar zikr va duolar to‘plami.",
      "ru": "Собрание из 303 достоверных зикров и мольб на каждый день.",
      "en": "Comprehensive collection of 303 authentic daily supplications and remembrances."
    },
    "chaptersCount": 26,
    "estimatedPages": 242,
    "sizeKb": 307,
    "contentLangs": [
      "uz"
    ]
  },
  {
    "id": "ibodati-islomiya",
    "storage": "bundled",
    "category": "fiqh",
    "coverTheme": "navy",
    "era": "1868–1941",
    "arabicTitle": "عبادة إسلامية",
    "title": {
      "uz_lat": "Ibodati Islomiya (To‘liq 16 Bob)",
      "ru": "Ибадати Исламия (16 глав)",
      "en": "Ibadati Islamiya (Complete Hanafi Guide)"
    },
    "author": {
      "uz_lat": "Ahmad Hodiy Maqsudiy",
      "ru": "Ахмад Хади Максуди",
      "en": "Ahmad Hadi Maqsudi"
    },
    "summary": {
      "uz_lat": "Hanafiy mazhabi asosida iymon, tahorat, g‘usl, namoz, ro‘za, zakot va haj qo‘llanmasi.",
      "ru": "Полное ханафитское руководство по вере, очищению, намазу, посту, закяту и хаджу.",
      "en": "Complete 16-chapter Hanafi manual of faith, purification, prayer, fasting, zakat, and Hajj."
    },
    "chaptersCount": 16,
    "estimatedPages": 56,
    "sizeKb": 120,
    "contentLangs": [
      "ar",
      "uz",
      "ru",
      "en"
    ]
  },
  {
    "id": "ayyuhal-valad",
    "storage": "bundled",
    "category": "spirituality",
    "coverTheme": "walnut",
    "era": "1058–1111",
    "arabicTitle": "أيها الولد",
    "title": {
      "uz_lat": "Ey Farzand (Ayyuhal Valad)",
      "ru": "О сын мой! (Айюхаль Валад)",
      "en": "O Beloved Son (Ayyuhal Walad)"
    },
    "author": {
      "uz_lat": "Imom Abu Homid al-G‘azzoliy",
      "ru": "Имам Абу Хамид аль-Газали",
      "en": "Imam Abu Hamid al-Ghazali"
    },
    "summary": {
      "uz_lat": "Ilm va amal birligi, ixlos va qalb tarbiyasi haqida 16 ta o‘lmas nasihat.",
      "ru": "16 бессмертных наставлений о единстве знания и дел, искренности и воспитании сердца.",
      "en": "16 timeless counsels on uniting knowledge with action, sincerity, and spiritual discipline."
    },
    "chaptersCount": 16,
    "estimatedPages": 45,
    "sizeKb": 97,
    "contentLangs": [
      "ar",
      "uz",
      "ru",
      "en"
    ]
  },
  {
    "id": "al-fiqh-al-akbar",
    "storage": "bundled",
    "category": "fiqh",
    "coverTheme": "navy",
    "era": "699–767",
    "arabicTitle": "الفقه الأكبر",
    "title": {
      "uz_lat": "Al-Fiqh al-Akbar (12 Bob)",
      "ru": "Аль-Фикх аль-Акбар (12 глав)",
      "en": "Al-Fiqh al-Akbar (12 Chapters)"
    },
    "author": {
      "uz_lat": "Imom A‘zam Abu Hanifa",
      "ru": "Имам Абу Ханифа",
      "en": "Imam Abu Hanifa"
    },
    "summary": {
      "uz_lat": "Tavhid, Allohning sifatlari, qadar va Ahli Sunna aqidasi asoslari.",
      "ru": "Основы таухида, атрибутов Аллаха, предопределения и вероубеждения Ахлю Сунна.",
      "en": "Foundational treatise on Sunni creed, divine attributes, destiny, and faith."
    },
    "chaptersCount": 12,
    "estimatedPages": 43,
    "sizeKb": 91,
    "contentLangs": [
      "ar",
      "uz",
      "ru",
      "en"
    ]
  },
  {
    "id": "aqoidi-tahoviya",
    "storage": "bundled",
    "category": "fiqh",
    "coverTheme": "emerald",
    "era": "853–933",
    "arabicTitle": "العقيدة الطحاوية",
    "title": {
      "uz_lat": "Aqoidi Tahoviya (105 Modda)",
      "ru": "Акыда ат-Тахавия (105 пунктов)",
      "en": "Al-Aqidah at-Tahawiyyah (105 Articles)"
    },
    "author": {
      "uz_lat": "Imom Abu Ja‘far at-Tahoviy",
      "ru": "Имам Абу Джафар ат-Тахави",
      "en": "Imam Abu Ja‘far at-Tahawi"
    },
    "summary": {
      "uz_lat": "Ahli Sunna val-Jamoa aqidaviy e‘tiqodining barcha 105 moddasi va sharhi.",
      "ru": "Все 105 положений вероубеждения Ахлю Сунна валь-Джамаа с пояснениями.",
      "en": "All 105 classical articles of Sunni creed systematically presented in 15 chapters."
    },
    "chaptersCount": 15,
    "estimatedPages": 58,
    "sizeKb": 124,
    "contentLangs": [
      "ar",
      "uz",
      "ru",
      "en"
    ]
  },
  {
    "id": "talim-mutaallim",
    "storage": "bundled",
    "category": "spirituality",
    "coverTheme": "teal",
    "era": "XII–XIII asr",
    "arabicTitle": "تعليم المتعلم",
    "title": {
      "uz_lat": "Ta‘lim ul-Muta‘allim (13 Bob)",
      "ru": "Талим аль-Мутааллим (13 глав)",
      "en": "Instruction of the Student (All 13 Chapters)"
    },
    "author": {
      "uz_lat": "Burhoniddin az-Zarnujiy",
      "ru": "Бурхануддин аз-Зарнуджи",
      "en": "Burhan al-Din al-Zarnuji"
    },
    "summary": {
      "uz_lat": "Ilm olish sirlari, ustoz hurmati, xotirani kuchaytirish va barakali tahsil odoblari.",
      "ru": "Все 13 глав классического трактата о методах, этике и секретах успешного обучения.",
      "en": "All 13 original chapters on intention, teacher reverence, memory, and scholarly discipline."
    },
    "chaptersCount": 13,
    "estimatedPages": 36,
    "sizeKb": 77,
    "contentLangs": [
      "ar",
      "uz",
      "ru",
      "en"
    ]
  },
  {
    "id": "yuz-hadis-sharh",
    "storage": "bundled",
    "category": "hadith",
    "coverTheme": "burgundy",
    "era": "Klassik to‘plam",
    "arabicTitle": "مائة حديث وشرحها",
    "title": {
      "uz_lat": "100 Mo‘tabar Hadis va Sharh",
      "ru": "100 избранных хадисов с шархом",
      "en": "100 Selected Hadiths with Commentary"
    },
    "author": {
      "uz_lat": "Klassik Muhaddislar Merosi",
      "ru": "Классическое наследие мухаддисов",
      "en": "Classical Hadith Heritage"
    },
    "summary": {
      "uz_lat": "Ilm, odob, oila, ibodat va go‘zal xulq haqida 100 ta hadis va tushuntirish.",
      "ru": "100 достоверных хадисов с практическими пояснениями.",
      "en": "100 authentic hadiths with practical commentary organized into 20 chapters."
    },
    "chaptersCount": 20,
    "estimatedPages": 25,
    "sizeKb": 27,
    "contentLangs": [
      "uz"
    ]
  },
  {
    "id": "sabot-ul-ojizin",
    "storage": "bundled",
    "category": "spirituality",
    "coverTheme": "burgundy",
    "era": "1644–1721",
    "arabicTitle": "ثبات العاجزين",
    "title": {
      "uz_lat": "Sabot ul-Ojizin (12 Bob)",
      "ru": "Сабат уль-Аджизин (12 глав)",
      "en": "Thabat al-Ajizin (12 Chapters)"
    },
    "author": {
      "uz_lat": "So‘fi Olloyor",
      "ru": "Суфи Аллаяр",
      "en": "Sufi Allahyar"
    },
    "summary": {
      "uz_lat": "Movarounnahr xalqining eng sevimli aqida va nafs tarbiyasi nazmiy asari.",
      "ru": "Знаменитый классический труд по акыде и духовному воспитанию в стихах.",
      "en": "Beloved Central Asian poetic classic of Sunni creed and spiritual refinement."
    },
    "chaptersCount": 12,
    "estimatedPages": 34,
    "sizeKb": 71,
    "contentLangs": [
      "ar",
      "uz",
      "ru",
      "en"
    ]
  },
  {
    "id": "mahbub-ul-qulub",
    "storage": "bundled",
    "category": "spirituality",
    "coverTheme": "emerald",
    "era": "1441–1501",
    "arabicTitle": "محبوب القلوب",
    "title": {
      "uz_lat": "Mahbub ul-Qulub (12 Bob)",
      "ru": "Махбуб уль-Кулуб (12 глав)",
      "en": "Beloved of Hearts (12 Chapters)"
    },
    "author": {
      "uz_lat": "Alisher Navoiy",
      "ru": "Алишер Навои",
      "en": "Alisher Navoi"
    },
    "summary": {
      "uz_lat": "Jamiyat toifalari, go‘zal axloq, halol kasb va qalb pokligi haqida shoh asar.",
      "ru": "Классический труд о нравственности, ремесле, щедрости и чистоте сердца.",
      "en": "Masterpiece on ethics, virtuous professions, humility, and timeless aphorisms."
    },
    "chaptersCount": 12,
    "estimatedPages": 32,
    "sizeKb": 65,
    "contentLangs": [
      "uz",
      "ru",
      "en"
    ]
  },
  {
    "id": "devoni-hikmat",
    "storage": "bundled",
    "category": "spirituality",
    "coverTheme": "walnut",
    "era": "1093–1166",
    "arabicTitle": "ديوان حكمت",
    "title": {
      "uz_lat": "Devoni Hikmat (12 Bob)",
      "ru": "Диван-и Хикмат (12 глав)",
      "en": "Diwan-i Hikmat (12 Chapters)"
    },
    "author": {
      "uz_lat": "Xoja Ahmad Yassaviy",
      "ru": "Ходжа Ахмад Ясави",
      "en": "Khoja Ahmad Yasawi"
    },
    "summary": {
      "uz_lat": "Turkiston ma‘naviy merosining durdonasi — tavhid, kamtarlik va g‘ariblarga rahm hikmatlari.",
      "ru": "Жемчужина духовного наследия Туркестана о любви к Аллаху, смирении и милосердии.",
      "en": "Timeless Turkestan spiritual wisdom on devotion, humility, and compassion."
    },
    "chaptersCount": 12,
    "estimatedPages": 30,
    "sizeKb": 62,
    "contentLangs": [
      "uz",
      "ru",
      "en"
    ]
  },
  {
    "id": "qobusnoma",
    "storage": "bundled",
    "category": "spirituality",
    "coverTheme": "navy",
    "era": "1021–1098",
    "arabicTitle": "قابوس نامه",
    "title": {
      "uz_lat": "Qobusnoma (14 Bob)",
      "ru": "Кабуснаме (14 глав)",
      "en": "Qabusnama (14 Chapters)"
    },
    "author": {
      "uz_lat": "Kaykovus (Unsurulmaoliy)",
      "ru": "Кей-Кавус",
      "en": "Kaykavus ibn Iskandar"
    },
    "summary": {
      "uz_lat": "Otaning farzandiga hayot, ilm, hunar, do‘stlik, mehmondorchilik va adolat nasihatlari.",
      "ru": "Наставления отца сыну об этикете, науках, ремесле, дружбе и справедливости.",
      "en": "A father’s classic mirror of ethics, knowledge, craft, hospitality, and wisdom."
    },
    "chaptersCount": 14,
    "estimatedPages": 37,
    "sizeKb": 73,
    "contentLangs": [
      "uz",
      "ru",
      "en"
    ]
  },
  {
    "id": "al-adab-al-mufrad",
    "storage": "bundled",
    "category": "hadith",
    "coverTheme": "emerald",
    "era": "810–870",
    "arabicTitle": "الأدب المفرد",
    "title": {
      "uz_lat": "Al-Adab al-Mufrad (12 Bob)",
      "ru": "Аль-Адаб аль-Муфрад (12 глав)",
      "en": "Al-Adab al-Mufrad (12 Chapters)"
    },
    "author": {
      "uz_lat": "Imom Muhammad ibn Ismoil al-Buxoriy",
      "ru": "Имам аль-Бухари",
      "en": "Imam al-Bukhari"
    },
    "summary": {
      "uz_lat": "Ota-ona hurmati, qo‘shni haqqi, silai rahm va go‘zal muomala haqida nabaviy hadislar.",
      "ru": "Пророческие наставления об уважении к родителям, соседях и благом нраве.",
      "en": "Imam al-Bukhari’s timeless treasury of Prophetic manners and family compassion."
    },
    "chaptersCount": 12,
    "estimatedPages": 32,
    "sizeKb": 68,
    "contentLangs": [
      "ar",
      "uz",
      "ru",
      "en"
    ]
  },
  {
    "id": "shamoili-muhammadiya",
    "storage": "bundled",
    "category": "hadith",
    "coverTheme": "teal",
    "era": "824–892",
    "arabicTitle": "الشمائل المحمدية",
    "title": {
      "uz_lat": "Shamoili Muhammadiya (12 Bob)",
      "ru": "Шамаиль аль-Мухаммадия (12 глав)",
      "en": "Shama‘il al-Muhammadiyya (12 Chapters)"
    },
    "author": {
      "uz_lat": "Imom Abu Iso at-Termiziy",
      "ru": "Имам ат-Тирмизи",
      "en": "Imam at-Tirmidhi"
    },
    "summary": {
      "uz_lat": "Payg‘ambarimiz Muhammad ﷺ ning muborak siyratlari, xulqlari, tabassumlari va ibodatlari.",
      "ru": "Благородный облик, нравственность, скромность и образ жизни Пророка Мухаммада ﷺ.",
      "en": "Complete classical portrait of the noble character, habits, and mercy of Prophet Muhammad ﷺ."
    },
    "chaptersCount": 12,
    "estimatedPages": 33,
    "sizeKb": 69,
    "contentLangs": [
      "ar",
      "uz",
      "ru",
      "en"
    ]
  },
  {
    "id": "tanbehul-gofilin",
    "storage": "bundled",
    "category": "spirituality",
    "coverTheme": "burgundy",
    "era": "944–983",
    "arabicTitle": "تنبيه الغافلين",
    "title": {
      "uz_lat": "Tanbehul G‘ofilin (12 Bob)",
      "ru": "Танбих аль-Гафилин (12 глав)",
      "en": "Awakening the Heedless (12 Chapters)"
    },
    "author": {
      "uz_lat": "Abu Lays Samarqandiy",
      "ru": "Абу Лейс Самарканди",
      "en": "Abu al-Layth al-Samarqandi"
    },
    "summary": {
      "uz_lat": "Samarqandlik buyuk faqihning ixlos, tavba, sabr, ota-ona haqqi va qalb uyg‘oqligi haqida asari.",
      "ru": "Духовные напоминания великого самаркандского учёного об искренности, покаянии и терпении.",
      "en": "Heart-awakening reminders on sincerity, repentance, patience, and mindfulness."
    },
    "chaptersCount": 12,
    "estimatedPages": 33,
    "sizeKb": 68,
    "contentLangs": [
      "ar",
      "uz",
      "ru",
      "en"
    ]
  },
  {
    "id": "hisn-al-muslim",
    "storage": "bundled",
    "category": "spirituality",
    "coverTheme": "emerald",
    "era": "Sunnat Duolari",
    "arabicTitle": "حصن المسلم",
    "title": {
      "uz_lat": "Hisn al-Muslim (Kundalik Duolar)",
      "ru": "Крепость мусульманина (12 глав)",
      "en": "Fortress of the Muslim (12 Chapters)"
    },
    "author": {
      "uz_lat": "Sahih Sunnat Duolari",
      "ru": "Достоверные дуа из Сунны",
      "en": "Authenticated Prophetic Supplications"
    },
    "summary": {
      "uz_lat": "Tonggi-kechki zikrlar, masjid, safar, g‘am-tashvish, shifo va istixora duolari.",
      "ru": "Утренние и вечерние зикры, дуа в пути, при тревоге, болезни и истихаре.",
      "en": "Daily morning/evening adhkar, masjid, travel, distress, healing, and Istikhara duas."
    },
    "chaptersCount": 12,
    "estimatedPages": 36,
    "sizeKb": 71,
    "contentLangs": [
      "ar",
      "uz",
      "ru",
      "en"
    ]
  },
  {
    "id": "al-hidoya-selected",
    "storage": "cloud",
    "category": "fiqh",
    "coverTheme": "navy",
    "era": "1135–1197",
    "arabicTitle": "الهداية في شرح بداية المبتدي",
    "title": {
      "uz_lat": "Al-Hidoya (Hanafiy Fiqh Asoslari)",
      "ru": "Аль-Хидая (Основы ханафитского фикха)",
      "en": "Al-Hidayah (Core Hanafi Jurisprudence)"
    },
    "author": {
      "uz_lat": "Burhoniddin al-Marg‘inoniy",
      "ru": "Бурхануддин аль-Маргинани",
      "en": "Burhan al-Din al-Marghinani"
    },
    "summary": {
      "uz_lat": "Farg‘onalik buyuk mujtahidning tahorat, ibodat, nikoh, savdo va adolat bo‘yicha 12 asosiy bobi.",
      "ru": "12 ключевых глав величайшего труда по ханафитскому праву.",
      "en": "12 foundational chapters of the preeminent Hanafi legal masterpiece from Fergana."
    },
    "chaptersCount": 12,
    "estimatedPages": 42,
    "sizeKb": 93,
    "contentLangs": [
      "ar",
      "uz",
      "ru",
      "en"
    ]
  },
  {
    "id": "kitob-at-tavhid",
    "storage": "cloud",
    "category": "fiqh",
    "coverTheme": "teal",
    "era": "853–944",
    "arabicTitle": "كتاب التوحيد",
    "title": {
      "uz_lat": "Kitob at-Tavhid (Moturidiy Aqida)",
      "ru": "Китаб ат-Таухид (Школа Матуриди)",
      "en": "Kitab al-Tawhid (Maturidi Theology)"
    },
    "author": {
      "uz_lat": "Imom Abu Mansur al-Moturidiy",
      "ru": "Имам Абу Мансур аль-Матуриди",
      "en": "Imam Abu Mansur al-Maturidi"
    },
    "summary": {
      "uz_lat": "Samarqand Moturidiya maktabining aql va naql uyg‘unligi, ilm manbalari va tavhid asoslari.",
      "ru": "Учение самаркандской школы матуридизма о гармонии разума и Откровения.",
      "en": "Samarkand Maturidi theology on epistemology, divine wisdom, and human responsibility."
    },
    "chaptersCount": 10,
    "estimatedPages": 36,
    "sizeKb": 80,
    "contentLangs": [
      "ar",
      "uz",
      "ru",
      "en"
    ]
  },
  {
    "id": "muqaddimat-jazariya",
    "storage": "cloud",
    "category": "fiqh",
    "coverTheme": "emerald",
    "era": "1350–1429",
    "arabicTitle": "المقدمة الجزرية",
    "title": {
      "uz_lat": "Muqaddimat ul-Jazariya (Tajvid)",
      "ru": "Мукаддима аль-Джазария (Таджвид)",
      "en": "Al-Muqaddimah al-Jazariyyah (Tajweed)"
    },
    "author": {
      "uz_lat": "Imom Shamsiddin ibn al-Jazariy",
      "ru": "Имам Ибн аль-Джазари",
      "en": "Imam Ibn al-Jazari"
    },
    "summary": {
      "uz_lat": "Qur‘on qiroati va tajvid ilmining eng mo‘tabar manzum asari — maxraj, sifat, madd va vaqf.",
      "ru": "Классический трактат по науке таджвида: махраджи, сифаты, мадд и правила остановки.",
      "en": "Definitive 10-chapter classical Tajweed manual covering articulation, attributes, and pauses."
    },
    "chaptersCount": 10,
    "estimatedPages": 36,
    "sizeKb": 80,
    "contentLangs": [
      "ar",
      "uz",
      "ru",
      "en"
    ]
  },
  {
    "id": "naqshbandiya-11-qoida",
    "storage": "cloud",
    "category": "spirituality",
    "coverTheme": "walnut",
    "era": "1103–1389",
    "arabicTitle": "الكلمات القدسية النقشبندية",
    "title": {
      "uz_lat": "11 Naqshbandiy Qoida va Maqomot",
      "ru": "11 принципов Накшбандия",
      "en": "The 11 Naqshbandi Spiritual Principles"
    },
    "author": {
      "uz_lat": "G‘ijduvoniy va Bahouddin Naqshband",
      "ru": "Гиждувани и Бахауддин Накшбанд",
      "en": "Ghijduwani & Baha al-Din Naqshband"
    },
    "summary": {
      "uz_lat": "«Dil ba Yoru dast ba kor» tamoyili hamda 11 qutlug‘ kalimotning hayotiy sharhi.",
      "ru": "Подробное раскрытие 11 священных принципов пути Накшбандия.",
      "en": "All 11 sacred principles of Bukhara’s Naqshbandi heritage for mindful living."
    },
    "chaptersCount": 11,
    "estimatedPages": 26,
    "sizeKb": 56,
    "contentLangs": [
      "ar",
      "uz",
      "ru",
      "en"
    ]
  },
  {
    "id": "qutadgu-bilig",
    "storage": "cloud",
    "category": "spirituality",
    "coverTheme": "burgundy",
    "era": "1019–1077",
    "arabicTitle": "قوتادغو بيليك",
    "title": {
      "uz_lat": "Qutadg‘u Bilig (Saodat Bilimi)",
      "ru": "Кутадгу Билиг (Благодатное знание)",
      "en": "Kutadgu Bilig (Wisdom of Royal Glory)"
    },
    "author": {
      "uz_lat": "Yusuf Xos Hojib",
      "ru": "Юсуф Баласагуни",
      "en": "Yusuf Khass Hajib"
    },
    "summary": {
      "uz_lat": "Adolat, aql, baxt va qanoat timsollari orqali inson va jamiyat kamoloti haqida doston.",
      "ru": "Классическая поэма о справедливости, разуме, труде и культуре речи.",
      "en": "11th-century Central Asian Islamic classic on justice, intellect, craft, and ethics."
    },
    "chaptersCount": 10,
    "estimatedPages": 25,
    "sizeKb": 51,
    "contentLangs": [
      "uz",
      "ru",
      "en"
    ]
  },
  {
    "id": "hadith-qudsi-40",
    "storage": "cloud",
    "category": "hadith",
    "coverTheme": "emerald",
    "era": "Sahih Qudsiy",
    "arabicTitle": "الأربعون القدسية",
    "title": {
      "uz_lat": "Qirq Qudsiy Hadis (To‘liq 40 Hadis)",
      "ru": "40 хадисов Кудси (полный текст)",
      "en": "Forty Hadith Qudsi (Complete 40)"
    },
    "author": {
      "uz_lat": "Hadisi Qudsiylar To‘plami",
      "ru": "Сборник священных хадисов Кудси",
      "en": "Classical Forty Hadith Qudsi"
    },
    "summary": {
      "uz_lat": "Alloh taoloning marhamati, tavba, ibodat va muhabbatiga oid barcha 40 Qudsiy hadis.",
      "ru": "Полное собрание из 40 священных хадисов Кудси с арабским оригиналом.",
      "en": "All 40 Sacred Hadith Qudsi with full Arabic text and authentic English translation."
    },
    "chaptersCount": 40,
    "estimatedPages": 84,
    "sizeKb": 95,
    "contentLangs": [
      "ar",
      "en"
    ]
  },
  {
    "id": "hadith-dehlawi-40",
    "storage": "cloud",
    "category": "hadith",
    "coverTheme": "teal",
    "era": "1703–1762",
    "arabicTitle": "أربعون شاه ولي الله الدهلوي",
    "title": {
      "uz_lat": "Shoh Valiyulloh Arba‘ini (40 Hadis)",
      "ru": "40 хадисов Шаха Валиуллаха",
      "en": "Forty Hadith of Shah Waliullah Dehlawi"
    },
    "author": {
      "uz_lat": "Shoh Valiyulloh Dehlaviy",
      "ru": "Шах Валиуллах Дехлави",
      "en": "Shah Waliullah Dehlawi"
    },
    "summary": {
      "uz_lat": "Yodlashga qulay, qisqa va hikmatli 40 ta nabaviy hadislar to‘plami.",
      "ru": "40 кратких и глубоких пророческих изречений для запоминания.",
      "en": "40 concise, memorable prophetic sayings selected by Shah Waliullah Dehlawi."
    },
    "chaptersCount": 40,
    "estimatedPages": 40,
    "sizeKb": 20,
    "contentLangs": [
      "ar",
      "en"
    ]
  },
  {
    "id": "kimyoyi-saodat-full",
    "storage": "cloud",
    "category": "spirituality",
    "coverTheme": "walnut",
    "era": "1058–1111",
    "arabicTitle": "كيمياء السعادة",
    "title": {
      "uz_lat": "Kimyoyi Saodat (To‘liq 8 Bob)",
      "ru": "Кимийа ас-Саадат (Эликсир счастья)",
      "en": "The Alchemy of Happiness (Complete)"
    },
    "author": {
      "uz_lat": "Imom Abu Homid al-G‘azzoliy",
      "ru": "Имам Абу Хамид аль-Газали",
      "en": "Imam Abu Hamid al-Ghazali"
    },
    "summary": {
      "uz_lat": "Nafsni tanish, Allohni tanish, dunyo va oxirat haqiqati haqida to‘liq klassik nashr.",
      "ru": "Полное классическое издание «Эликсира счастья» в 8 главах.",
      "en": "Complete 8-chapter public-domain classic on self-knowledge and love of God."
    },
    "chaptersCount": 8,
    "estimatedPages": 176,
    "sizeKb": 126,
    "contentLangs": [
      "en"
    ]
  },
  {
    "id": "gulistan-sadi",
    "storage": "cloud",
    "category": "spirituality",
    "coverTheme": "burgundy",
    "era": "1210–1291",
    "arabicTitle": "گلستان سعدي",
    "title": {
      "uz_lat": "Guliston (To‘liq 8 Bob)",
      "ru": "Гулистан — Розовый сад (8 глав)",
      "en": "The Gulistan (Complete 8 Chapters)"
    },
    "author": {
      "uz_lat": "Shayx Sa‘diy Sheroziy",
      "ru": "Шейх Саади Ширази",
      "en": "Sa‘di of Shiraz"
    },
    "summary": {
      "uz_lat": "Sharq adabiyotining shoh asari — hikoyatlar, qanoat, sukut va suhbat odobi.",
      "ru": "Бессмертный «Розовый сад» Саади — все 8 глав притч и мудрости.",
      "en": "Complete 8-chapter public-domain classic of moral tales, wit, and spiritual insight."
    },
    "chaptersCount": 8,
    "estimatedPages": 171,
    "sizeKb": 116,
    "contentLangs": [
      "en"
    ]
  },
  {
    "id": "bukhari-iman-ilm",
    "storage": "cloud",
    "category": "hadith",
    "coverTheme": "emerald",
    "era": "810–870",
    "arabicTitle": "صحيح البخاري — الإيمان والعلم",
    "title": {
      "uz_lat": "Sahih al-Buxoriy: Vahiy, Iymon va Ilm",
      "ru": "Сахих аль-Бухари: Откровение, Вера и Знание",
      "en": "Sahih al-Bukhari: Revelation, Faith & Knowledge"
    },
    "author": {
      "uz_lat": "Imom Muhammad ibn Ismoil al-Buxoriy",
      "ru": "Имам аль-Бухари",
      "en": "Imam al-Bukhari"
    },
    "summary": {
      "uz_lat": "Sahih al-Buxoriyning dastlabki uchta buyuk kitobi: Vahiy, Iymon va Ilm (134 sahih hadis).",
      "ru": "Первые три книги Сахих аль-Бухари: Откровение, Вера и Знание (134 хадиса).",
      "en": "Complete opening 3 books of Sahih al-Bukhari (134 authentic hadiths)."
    },
    "chaptersCount": 17,
    "estimatedPages": 140,
    "sizeKb": 258,
    "contentLangs": [
      "ar",
      "ru",
      "en"
    ]
  },
  {
    "id": "bukhari-adab",
    "storage": "cloud",
    "category": "hadith",
    "coverTheme": "navy",
    "era": "810–870",
    "arabicTitle": "صحيح البخاري — كتاب الأدب",
    "title": {
      "uz_lat": "Sahih al-Buxoriy: Odob va Axloq Kitobi",
      "ru": "Сахих аль-Бухари: Книга Благонравия (Адаб)",
      "en": "Sahih al-Bukhari: Book of Good Manners"
    },
    "author": {
      "uz_lat": "Imom Muhammad ibn Ismoil al-Buxoriy",
      "ru": "Имам аль-Бухари",
      "en": "Imam al-Bukhari"
    },
    "summary": {
      "uz_lat": "250+ sahih hadis: ota-ona, qo‘shni, rahm-shafqat, rostgo‘ylik va insoniy munosabatlar.",
      "ru": "Более 250 достоверных хадисов о благонравии, семье и милосердии.",
      "en": "Over 250 authentic hadiths on character, parents, kindness, and etiquette."
    },
    "chaptersCount": 25,
    "estimatedPages": 182,
    "sizeKb": 337,
    "contentLangs": [
      "ar",
      "ru",
      "en"
    ]
  },
  {
    "id": "bukhari-riqaq",
    "storage": "cloud",
    "category": "hadith",
    "coverTheme": "burgundy",
    "era": "810–870",
    "arabicTitle": "صحيح البخاري — كتاب الرقاق",
    "title": {
      "uz_lat": "Sahih al-Buxoriy: Qalbni Yumshatish (Riqoq)",
      "ru": "Сахих аль-Бухари: Смягчение сердец (Рикак)",
      "en": "Sahih al-Bukhari: Softening the Hearts"
    },
    "author": {
      "uz_lat": "Imom Muhammad ibn Ismoil al-Buxoriy",
      "ru": "Имам аль-Бухари",
      "en": "Imam al-Bukhari"
    },
    "summary": {
      "uz_lat": "180+ sahih hadis: qanoat, umr qadri, qalb xotirjamligi va oxirat eslatmalari.",
      "ru": "Более 180 хадисов о ценности времени, довольстве и памяти о Вечности.",
      "en": "Over 180 authentic hadiths on gratitude, humility, and spiritual mindfulness."
    },
    "chaptersCount": 19,
    "estimatedPages": 142,
    "sizeKb": 257,
    "contentLangs": [
      "ar",
      "ru",
      "en"
    ]
  },
  {
    "id": "bukhari-daawat",
    "storage": "cloud",
    "category": "hadith",
    "coverTheme": "teal",
    "era": "810–870",
    "arabicTitle": "صحيح البخاري — كتاب الدعوات",
    "title": {
      "uz_lat": "Sahih al-Buxoriy: Duolar Kitobi",
      "ru": "Сахих аль-Бухари: Книга Мольб (Даават)",
      "en": "Sahih al-Bukhari: Book of Invocations"
    },
    "author": {
      "uz_lat": "Imom Muhammad ibn Ismoil al-Buxoriy",
      "ru": "Имам аль-Бухари",
      "en": "Imam al-Bukhari"
    },
    "summary": {
      "uz_lat": "Payg‘ambarimiz ﷺ ning eng sahih duolari, istig‘for va zikr fazilatlari (108 hadis).",
      "ru": "Достоверные пророческие мольбы, истигфар и достоинство поминания (108 хадисов).",
      "en": "108 authentic hadiths preserving the Prophet’s supplications and remembrances."
    },
    "chaptersCount": 14,
    "estimatedPages": 102,
    "sizeKb": 174,
    "contentLangs": [
      "ar",
      "ru",
      "en"
    ]
  },
  {
    "id": "bukhari-anbiyo",
    "storage": "cloud",
    "category": "hadith",
    "coverTheme": "walnut",
    "era": "810–870",
    "arabicTitle": "صحيح البخاري — كتاب الأنبياء",
    "title": {
      "uz_lat": "Sahih al-Buxoriy: Payg‘ambarlar Qissalari",
      "ru": "Сахих аль-Бухари: Истории Пророков",
      "en": "Sahih al-Bukhari: Stories of the Prophets"
    },
    "author": {
      "uz_lat": "Imom Muhammad ibn Ismoil al-Buxoriy",
      "ru": "Имам аль-Бухари",
      "en": "Imam al-Bukhari"
    },
    "summary": {
      "uz_lat": "Odam (a.s.) dan Iso (a.s.) gacha barcha payg‘ambarlar haqidagi 160+ sahih hadislar.",
      "ru": "Более 160 достоверных хадисов о пророках от Адама до Исы (мир им).",
      "en": "Over 160 authentic traditions narrating the lives of the Prophets (peace be upon them)."
    },
    "chaptersCount": 20,
    "estimatedPages": 166,
    "sizeKb": 312,
    "contentLangs": [
      "ar",
      "ru",
      "en"
    ]
  },
  {
    "id": "bukhari-quran-virtues",
    "storage": "cloud",
    "category": "hadith",
    "coverTheme": "emerald",
    "era": "810–870",
    "arabicTitle": "صحيح البخاري — فضائل القرآن",
    "title": {
      "uz_lat": "Sahih al-Buxoriy: Qur‘on Fazilatlari",
      "ru": "Сахих аль-Бухари: Достоинства Корана",
      "en": "Sahih al-Bukhari: Virtues of the Qur‘an"
    },
    "author": {
      "uz_lat": "Imom Muhammad ibn Ismoil al-Buxoriy",
      "ru": "Имам аль-Бухари",
      "en": "Imam al-Bukhari"
    },
    "summary": {
      "uz_lat": "Qur‘oni Karim jamlanishi, suralar fazilati va qiroat odoblari haqida 84 sahih hadis.",
      "ru": "84 достоверных хадиса о собирании Корана, достоинствах сур и искусстве чтения.",
      "en": "84 authentic hadiths on the revelation, compilation, and virtues of the Holy Qur‘an."
    },
    "chaptersCount": 13,
    "estimatedPages": 73,
    "sizeKb": 132,
    "contentLangs": [
      "ar",
      "ru",
      "en"
    ]
  },
  {
    "id": "bukhari-tahajjud-siyam",
    "storage": "cloud",
    "category": "fiqh",
    "coverTheme": "navy",
    "era": "810–870",
    "arabicTitle": "صحيح البخاري — التهجد والصيام",
    "title": {
      "uz_lat": "Sahih al-Buxoriy: Tahajjud va Ro‘za",
      "ru": "Сахих аль-Бухари: Тахаджуд и Пост",
      "en": "Sahih al-Bukhari: Night Prayer & Fasting"
    },
    "author": {
      "uz_lat": "Imom Muhammad ibn Ismoil al-Buxoriy",
      "ru": "Имам аль-Бухари",
      "en": "Imam al-Bukhari"
    },
    "summary": {
      "uz_lat": "Tungi ibodat, saharlik, Ramazon ro‘zasi va nafl ro‘zalar haqida 185 sahih hadis.",
      "ru": "185 хадисов о ночной молитве тахаджуд и благословенном посте.",
      "en": "185 authentic hadiths covering Tahajjud night prayers and Ramadan fasting."
    },
    "chaptersCount": 18,
    "estimatedPages": 116,
    "sizeKb": 211,
    "contentLangs": [
      "ar",
      "ru",
      "en"
    ]
  },
  {
    "id": "muslim-iman",
    "storage": "cloud",
    "category": "hadith",
    "coverTheme": "emerald",
    "era": "815–875",
    "arabicTitle": "صحيح مسلم — كتاب الإيمان",
    "title": {
      "uz_lat": "Sahih Muslim: Iymon Kitobi",
      "ru": "Сахих Муслим: Книга Веры (Иман)",
      "en": "Sahih Muslim: The Book of Faith"
    },
    "author": {
      "uz_lat": "Imom Muslim ibn al-Hajjoj",
      "ru": "Имам Муслим ибн аль-Хаджадж",
      "en": "Imam Muslim ibn al-Hajjaj"
    },
    "summary": {
      "uz_lat": "Sahih Muslimning eng yirik kitobi — iymon shoxlari, tavhid va islom asoslari (280 hadis).",
      "ru": "Фундаментальная Книга Веры из Сахих Муслим (280 хадисов).",
      "en": "The monumental Book of Faith from Sahih Muslim (280 authentic traditions)."
    },
    "chaptersCount": 24,
    "estimatedPages": 199,
    "sizeKb": 382,
    "contentLangs": [
      "ar",
      "ru",
      "en"
    ]
  },
  {
    "id": "muslim-birr",
    "storage": "cloud",
    "category": "hadith",
    "coverTheme": "teal",
    "era": "815–875",
    "arabicTitle": "صحيح مسلم — البر والصلة والآداب",
    "title": {
      "uz_lat": "Sahih Muslim: Yaxshilik va Silai Rahm",
      "ru": "Сахих Муслим: Благочестие и Родство",
      "en": "Sahih Muslim: Virtue & Family Ties"
    },
    "author": {
      "uz_lat": "Imom Muslim ibn al-Hajjoj",
      "ru": "Имам Муслим ибн аль-Хаджадж",
      "en": "Imam Muslim ibn al-Hajjaj"
    },
    "summary": {
      "uz_lat": "220+ sahih hadis: yaxshilik, qarindoshchilik, birodarlik va zulmdan saqlanish.",
      "ru": "Более 220 хадисов о благочестии, родственных узах и братстве.",
      "en": "Over 220 hadiths on righteousness, family bonds, mercy, and character."
    },
    "chaptersCount": 21,
    "estimatedPages": 120,
    "sizeKb": 148,
    "contentLangs": [
      "ar",
      "ru",
      "en"
    ]
  },
  {
    "id": "muslim-zuhd",
    "storage": "cloud",
    "category": "spirituality",
    "coverTheme": "walnut",
    "era": "815–875",
    "arabicTitle": "صحيح مسلم — الزهد والرقائق",
    "title": {
      "uz_lat": "Sahih Muslim: Zuhd va Riqoqat Kitobi",
      "ru": "Сахих Муслим: Книга Зухда и Сердец",
      "en": "Sahih Muslim: Zuhd & Softening Hearts"
    },
    "author": {
      "uz_lat": "Imom Muslim ibn al-Hajjoj",
      "ru": "Имам Муслим ибн аль-Хаджадж",
      "en": "Imam Muslim ibn al-Hajjaj"
    },
    "summary": {
      "uz_lat": "Dunyoda kamtarlik, ixlos va qalbni poklash haqida 106 sahih hadis.",
      "ru": "106 достоверных хадисов о скромности, искренности и очищении души.",
      "en": "106 authentic hadiths on detachment, sincerity, and inner peace."
    },
    "chaptersCount": 10,
    "estimatedPages": 69,
    "sizeKb": 93,
    "contentLangs": [
      "ar",
      "ru",
      "en"
    ]
  },
  {
    "id": "tirmidhi-birr",
    "storage": "cloud",
    "category": "hadith",
    "coverTheme": "burgundy",
    "era": "824–892",
    "arabicTitle": "جامع الترمذي — البر والصلة",
    "title": {
      "uz_lat": "Jome‘ at-Termiziy: Yaxshilik va Odob",
      "ru": "Джами ат-Тирмизи: Благочестие и Родство",
      "en": "Jami‘ at-Tirmidhi: Righteousness & Kinship"
    },
    "author": {
      "uz_lat": "Imom Abu Iso at-Termiziy",
      "ru": "Имам ат-Тирмизи",
      "en": "Imam at-Tirmidhi"
    },
    "summary": {
      "uz_lat": "Termizlik buyuk muhaddis to‘plagan yaxshilik, silai rahm va rahmdillik hadislari.",
      "ru": "Собрание хадисов имама ат-Тирмизи о доброте, милосердии и родстве.",
      "en": "139 chapters and traditions from Termez’s great scholar on kindness and kinship."
    },
    "chaptersCount": 18,
    "estimatedPages": 71,
    "sizeKb": 57,
    "contentLangs": [
      "ar",
      "en"
    ]
  },
  {
    "id": "tirmidhi-zuhd",
    "storage": "cloud",
    "category": "spirituality",
    "coverTheme": "emerald",
    "era": "824–892",
    "arabicTitle": "جامع الترمذي — كتاب الزهد",
    "title": {
      "uz_lat": "Jome‘ at-Termiziy: Zuhd va Taqvo",
      "ru": "Джами ат-Тирмизи: Книга Зухда",
      "en": "Jami‘ at-Tirmidhi: Book of Zuhd"
    },
    "author": {
      "uz_lat": "Imom Abu Iso at-Termiziy",
      "ru": "Имам ат-Тирмизи",
      "en": "Imam at-Tirmidhi"
    },
    "summary": {
      "uz_lat": "Taqvo, qanoat, tavakkul va solih amallar haqida 111 ta hadis.",
      "ru": "111 хадисов о богобоязненности, уповании и умеренности.",
      "en": "111 classical traditions on piety, contentment, and reliance upon Allah."
    },
    "chaptersCount": 14,
    "estimatedPages": 73,
    "sizeKb": 56,
    "contentLangs": [
      "ar",
      "en"
    ]
  },
  {
    "id": "abudawud-adab",
    "storage": "cloud",
    "category": "hadith",
    "coverTheme": "navy",
    "era": "817–889",
    "arabicTitle": "سنن أبي داود — كتاب الأدب",
    "title": {
      "uz_lat": "Sunan Abu Dovud: Odob va Muomala",
      "ru": "Сунан Абу Дауда: Книга Этикета (Адаб)",
      "en": "Sunan Abi Dawud: Book of General Behavior"
    },
    "author": {
      "uz_lat": "Imom Abu Dovud as-Sijistoniy",
      "ru": "Имам Абу Дауд",
      "en": "Imam Abu Dawud"
    },
    "summary": {
      "uz_lat": "Kundalik hayot, salomlashish, ruxsat so‘rash, do‘stlik va axloq bo‘yicha 260 hadis.",
      "ru": "260 хадисов о повседневном этикете, приветствии, гостеприимстве и нравах.",
      "en": "260 prophetic traditions detailing everyday Islamic manners and social grace."
    },
    "chaptersCount": 22,
    "estimatedPages": 148,
    "sizeKb": 215,
    "contentLangs": [
      "ar",
      "ru",
      "en"
    ]
  },
  {
    "id": "ibnmajah-zuhd",
    "storage": "cloud",
    "category": "spirituality",
    "coverTheme": "walnut",
    "era": "824–887",
    "arabicTitle": "سنن ابن ماجه — كتاب الزهد",
    "title": {
      "uz_lat": "Sunan Ibn Moja: Zuhd va Oxirat",
      "ru": "Сунан Ибн Маджа: Зухд и Вечность",
      "en": "Sunan Ibn Majah: Book of Asceticism"
    },
    "author": {
      "uz_lat": "Imom Ibn Moja al-Qazviniy",
      "ru": "Имам Ибн Маджа",
      "en": "Imam Ibn Majah"
    },
    "summary": {
      "uz_lat": "240+ hadis: kamtarlik, tavba, sabr, qanoat va oxiratga tayyorgarlik.",
      "ru": "Более 240 хадисов о смирении, покаянии и духовном очищении.",
      "en": "Over 240 traditions on humility, repentance, patience, and spiritual awareness."
    },
    "chaptersCount": 25,
    "estimatedPages": 161,
    "sizeKb": 124,
    "contentLangs": [
      "ar",
      "en"
    ]
  },
  {
    "id": "malik-muwatta-ibodat",
    "storage": "cloud",
    "category": "fiqh",
    "coverTheme": "teal",
    "era": "711–795",
    "arabicTitle": "موطأ الإمام مالك — العبادات",
    "title": {
      "uz_lat": "Al-Muvatto: Namoz, Juma, Ramazon va Zakot",
      "ru": "Аль-Муватта: Молитва, Рамадан и Закят",
      "en": "Muwatta Malik: Prayer, Fasting & Zakat"
    },
    "author": {
      "uz_lat": "Imom Molik ibn Anas",
      "ru": "Имам Малик ибн Анас",
      "en": "Imam Malik ibn Anas"
    },
    "summary": {
      "uz_lat": "Islom tarixidagi ilk fiqhiy-hadisiy asarning ibodatlar bo‘limi (220 rivoyat).",
      "ru": "Раздел поклонения из древнейшего свода хадисов и фикха имама Малика.",
      "en": "220 classical reports on prayer times, congregation, Ramadan, and Zakat."
    },
    "chaptersCount": 22,
    "estimatedPages": 209,
    "sizeKb": 154,
    "contentLangs": [
      "ar",
      "en"
    ]
  },
  {
    "id": "nasai-qiyam-iman",
    "storage": "cloud",
    "category": "hadith",
    "coverTheme": "burgundy",
    "era": "829–915",
    "arabicTitle": "سنن النسائي — قيام الليل والإيمان",
    "title": {
      "uz_lat": "Sunan an-Nasoiy: Tungi Namoz va Iymon",
      "ru": "Сунан ан-Насаи: Ночная молитва и Вера",
      "en": "Sunan an-Nasa‘i: Night Prayer & Faith"
    },
    "author": {
      "uz_lat": "Imom Ahmad an-Nasoiy",
      "ru": "Имам ан-Насаи",
      "en": "Imam an-Nasa‘i"
    },
    "summary": {
      "uz_lat": "Tungi namoz, vitr, nafl ibodatlar va iymon alomatlari haqida 230 hadis.",
      "ru": "230 хадисов о ночном стоянии в молитве и признаках крепкой веры.",
      "en": "230 traditions on night prayer (Qiyam al-Layl), Witr, and the signs of faith."
    },
    "chaptersCount": 23,
    "estimatedPages": 136,
    "sizeKb": 104,
    "contentLangs": [
      "ar",
      "en"
    ]
  }
];

export function getCatalogBookById(
  books: BookCatalogItem[],
  id: string | null | undefined
): BookCatalogItem | null {
  if (!id) return null;
  return books.find((b) => b.id === id) || null;
}
