export interface CuratedDuaEntry {
  id: string;
  occasion: string;
  arabic: string;
  translit: string;
  uz: string;
  reference: string;
  group: 'daily' | 'ramadan';
}

export interface AyahReflection {
  id: number;
  text_uz: string;
  reference: string;
  surahNumber: number | null;
  ayahNumber: number | null;
}

export interface QirqFarzItem {
  id: number;
  bolim: string;
  title: string;
  izoh: string;
}

export interface NiyatItem {
  id: number;
  category: string;
  title: string;
  uz: string;
  arabic: string;
}

export interface HadithCollectionMeta {
  id: number;
  name_cyr: string;
  type: 'hadith' | 'dua';
  count: number;
  file: string;
}

export interface CompactHadithEntry {
  n: number;
  t: string;
}

export const CURATED_DUAS: CuratedDuaEntry[] = [
  {
    "id": "cur_1",
    "occasion": "Uxlashdan oldin",
    "arabic": "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    "translit": "Bismika Allohumma amutu va ahya",
    "uz": "Alloh nomi bilan o'laman (uxlayman) va tirilaman (uyg'onaman).",
    "reference": "Buxoriy",
    "group": "daily"
  },
  {
    "id": "cur_2",
    "occasion": "Uyg'onganda",
    "arabic": "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    "translit": "Alhamdu lillahil-lazi ahyana ba'da ma amatana va ilayhin-nushur",
    "uz": "Bizni o'ldirgach (uxlatgach) qayta tiriltirgan Allohga hamdlar bo'lsin, oxir-oqibat qaytish ham Ungadir.",
    "reference": "Buxoriy",
    "group": "daily"
  },
  {
    "id": "cur_3",
    "occasion": "Ovqatni boshlashda",
    "arabic": "بِسْمِ اللَّهِ",
    "translit": "Bismillah",
    "uz": "Alloh nomi bilan. (Boshida unutib qolsa, eslagan payti: «Bismillahi avvalahu va oxirahu» — boshida ham, oxirida ham Alloh nomi bilan, deyiladi.)",
    "reference": "Abu Dovud, Termiziy",
    "group": "daily"
  },
  {
    "id": "cur_4",
    "occasion": "Ovqatdan keyin",
    "arabic": "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
    "translit": "Alhamdu lillahil-lazi at'amani haza va razaqanihi min g'ayri havlim-minni va la quvvah",
    "uz": "Meni shu taom bilan sira kuch-quvvatimsiz rizqlantirgan Allohga hamdlar bo'lsin.",
    "reference": "Abu Dovud, Termiziy",
    "group": "daily"
  },
  {
    "id": "cur_5",
    "occasion": "Uydan chiqishda",
    "arabic": "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    "translit": "Bismillahi tavakkaltu 'alalloh, va la havla va la quvvata illa billah",
    "uz": "Alloh nomi bilan, Allohga tavakkal qildim, kuch-quvvat faqat Allohdandir.",
    "reference": "Abu Dovud, Termiziy",
    "group": "daily"
  },
  {
    "id": "cur_6",
    "occasion": "Uyga kirishda",
    "arabic": "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلِجِ وَخَيْرَ الْمَخْرَجِ",
    "translit": "Allohumma inni as'aluka xayral-mavlij va xayral-maxraj",
    "uz": "Ey Alloh, kirishning ham, chiqishning ham yaxshisini Sendan so'rayman.",
    "reference": "Abu Dovud",
    "group": "daily"
  },
  {
    "id": "cur_7",
    "occasion": "Masjidga kirishda",
    "arabic": "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    "translit": "Allohummaftah li abvaba rahmatik",
    "uz": "Ey Alloh, menga rahmating eshiklarini ochgin.",
    "reference": "Muslim",
    "group": "daily"
  },
  {
    "id": "cur_8",
    "occasion": "Masjiddan chiqishda",
    "arabic": "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
    "translit": "Allohumma inni as'aluka min fadlik",
    "uz": "Ey Alloh, Sening fazlingdan so'rayman.",
    "reference": "Muslim",
    "group": "daily"
  },
  {
    "id": "cur_9",
    "occasion": "Safarga chiqishda (ulovga chiqqanda)",
    "arabic": "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
    "translit": "Subhanal-lazi sakhkhara lana haza va ma kunna lahu muqrinin va inna ila robbina lamunqalibun",
    "uz": "Buni bizga bo'ysundirgan Zot pokdir, biz buni o'zimiz uddalay olmasdik. Albatta, biz Robbimizga qaytuvchimiz.",
    "reference": "Qur'oni karim, Zuxruf surasi, 13-14-oyat",
    "group": "daily"
  },
  {
    "id": "cur_10",
    "occasion": "G'am-tashvishda",
    "arabic": "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    "translit": "Hasbunalloohu va ni'mal vakil",
    "uz": "Alloh bizga kifoya, U qanday yaxshi vakil.",
    "reference": "Qur'oni karim, Oli Imron surasi, 173-oyat",
    "group": "daily"
  },
  {
    "id": "cur_11",
    "occasion": "Bemorga duo qilganda (7 marta aytiladi)",
    "arabic": "أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ",
    "translit": "As'alulloohal-'aziyma robbal-'arshil-'aziymi an yashfiyak",
    "uz": "Ulug' Arshning Robbisi bo'lgan Buyuk Allohdan senga shifo berishini so'rayman.",
    "reference": "Abu Dovud, Termiziy",
    "group": "daily"
  },
  {
    "id": "cur_12",
    "occasion": "Yangi kiyim kiyganda",
    "arabic": "الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
    "translit": "Alhamdu lillahil-lazi kasani haza va razaqanihi min g'ayri havlim-minni va la quvvah",
    "uz": "Meni shu kiyim bilan kiyintirgan va sira kuch-quvvatimsiz rizqlantirgan Allohga hamdlar bo'lsin.",
    "reference": "Abu Dovud, Termiziy",
    "group": "daily"
  },
  {
    "id": "cur_13",
    "occasion": "Yomg'ir yog'ganda",
    "arabic": "اللَّهُمَّ صَيِّبًا نَافِعًا",
    "translit": "Allohumma sayyibann nafi'a",
    "uz": "Ey Alloh, (buni) foydali yomg'ir qilgin.",
    "reference": "Buxoriy",
    "group": "daily"
  },
  {
    "id": "cur_14",
    "occasion": "Hojatxonaga kirishda",
    "arabic": "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
    "translit": "Allohumma inni a'uzu bika minal-xubsi val-xabois",
    "uz": "Ey Alloh, yomon jin-sheytonlardan Senga sig'inaman.",
    "reference": "Buxoriy, Muslim",
    "group": "daily"
  },
  {
    "id": "cur_15",
    "occasion": "Hojatxonadan chiqqanda",
    "arabic": "غُفْرَانَكَ",
    "translit": "G'ufronak",
    "uz": "(Ey Alloh,) Sening mag'firatingni so'rayman.",
    "reference": "Abu Dovud, Termiziy",
    "group": "daily"
  },
  {
    "id": "cur_16",
    "occasion": "Ilm so'rashda",
    "arabic": "رَبِّ زِدْنِي عِلْمًا",
    "translit": "Robbi zidni 'ilma",
    "uz": "Parvardigorim, ilmimni ziyoda qilgin.",
    "reference": "Qur'oni karim, Toha surasi, 114-oyat",
    "group": "daily"
  },
  {
    "id": "cur_17",
    "occasion": "Musibat (balo-qazo) yetganda",
    "arabic": "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ",
    "translit": "Inna lillahi va inna ilayhi roji'un",
    "uz": "Albatta, biz Allohnikimiz va, albatta, Unga qaytuvchimiz.",
    "reference": "Qur'oni karim, Baqara surasi, 156-oyat",
    "group": "daily"
  },
  {
    "id": "cur_18",
    "occasion": "Majlis (suhbat) yakunida",
    "arabic": "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ",
    "translit": "Subhanakalloohumma va bihamdika, ashhadu alla ilaha illa anta, astag'firuka va atubu ilayk",
    "uz": "Ey Alloh, Seni poklab, hamding bilan tasbeh aytaman. Guvohlik beramanki, Sendan o'zga iloh yo'q. Sendan mag'firat so'rayman va Senga tavba qilaman. (Kaffaratul-majlis)",
    "reference": "Termiziy",
    "group": "daily"
  },
  {
    "id": "cur_19",
    "occasion": "Qarzdan qutulish uchun",
    "arabic": "اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ",
    "translit": "Allohummakfini bi halolika 'an haromika va ag'nini bi fadlika 'amman sivak",
    "uz": "Ey Alloh, meni halolingni haromingga, fazlingni O'zingdan boshqasiga muhtoj qoldirmasdan yetkazgin.",
    "reference": "Termiziy",
    "group": "daily"
  },
  {
    "id": "cur_20",
    "occasion": "Yangi oy ko'rilganda",
    "arabic": "اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالْأَمْنِ وَالْإِيمَانِ وَالسَّلَامَةِ وَالْإِسْلَامِ",
    "translit": "Allohumma ahillahu 'alayna bil-amni val-iymani vas-salamati val-islam",
    "uz": "Ey Alloh, bu oyni bizga omonlik, imon, salomatlik va Islom bilan tug'dirgin.",
    "reference": "Termiziy, Doraimiy",
    "group": "daily"
  },
  {
    "id": "cur_21",
    "occasion": "Oynaga qaraganda",
    "arabic": "اللَّهُمَّ كَمَا حَسَّنْتَ خَلْقِي فَحَسِّنْ خُلُقِي",
    "translit": "Allohumma kama hassanta xalqi fahassin xuluqi",
    "uz": "Ey Alloh, qanday qilib suratimni chiroyli qilgan bo'lsang, xulqimni ham chiroyli qilgin.",
    "reference": "Ahmad",
    "group": "daily"
  },
  {
    "id": "cur_22",
    "occasion": "G'am-qayg'u, ojizlik va qarzdan Allohga sig'inish",
    "arabic": "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْجُبْنِ وَالْبُخْلِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
    "translit": "Allohumma inni a'uzu bika minal-hammi val-hazani val-'ajzi val-kasali val-jubni val-buxli va dola'id-dayni va g'alabatir-rijal",
    "uz": "Ey Alloh, g'am-tashvish, qayg'u, ojizlik, dangasalik, qo'rqoqlik, baxillik, qarz yuki va odamlarning zug'umidan Senga sig'inaman.",
    "reference": "Buxoriy",
    "group": "daily"
  },
  {
    "id": "ram_ramazon_yetkazish",
    "occasion": "Ramazonga yetkazish duosi",
    "arabic": "",
    "translit": "Allohumma barik lana fi rajabin va sha'bana va ballighna ramazon.",
    "uz": "Allohim, Rajab va Sha'bon oylarini barakotli qilgin va bizni Ramazonga yetkazgin.",
    "reference": "Ramazon / Hisnul Muslim",
    "group": "ramadan"
  },
  {
    "id": "ram_saharlik_niyat",
    "occasion": "Saharlik (ro‘za tutish) niyati",
    "arabic": "",
    "translit": "Navaytu an asuma sovma shahri ramazona minal fajri ilal mag‘ribi, xolisan lillahi ta'ala.",
    "uz": "Alloh taoloning roziligi uchun Ramazon oyining ro‘zasini subhdan to mag‘ribgacha tutmoqni niyat qildim.",
    "reference": "Ramazon / Hisnul Muslim",
    "group": "ramadan"
  },
  {
    "id": "ram_iftor_duosi",
    "occasion": "Iftorlik duosi",
    "arabic": "اللَّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ",
    "translit": "Allohumma laka sumtu va bika aamantu va ‘alayka tavakkaltu va ‘ala rizqika aftartu.",
    "uz": "Alloh nomi bilan, Allohim Sen uchun ro‘za tutdik. Sening rizqing bilan iftorlik qildik, bizlardan (ro‘zamizni) qabul qilgin. Albatta, Sen o‘zinggina eshituvchi, biluvchisan.",
    "reference": "Ramazon / Hisnul Muslim",
    "group": "ramadan"
  },
  {
    "id": "ram_iftor_duosi_2",
    "occasion": "Iftor duosi (ikkinchi rivoyat)",
    "arabic": "",
    "translit": "Zahabaz-zama'u vabtallatil-‘uruqu va sabatal-ajru inshaalloh.",
    "uz": "Chanqoq ketdi, tomirlar namlandi va ajr sobit bo‘ldi, inshaalloh.",
    "reference": "Ramazon / Hisnul Muslim",
    "group": "ramadan"
  },
  {
    "id": "ram_sayyidul_istigfor",
    "occasion": "Sayyidul istig'for",
    "arabic": "",
    "translit": "Allohumma anta robbiy, la ilaha illa anta, xolaqtaniy va ana 'abduka, va ana 'ala 'ahdika va va'dika mastato'tu, a'uzu bika min sharri ma sona'tu, abuu laka bini'matika 'alayya, va abuu bizanbiy, fag'fir liy, fainnahu la yag'firuz-zunuba illa anta.",
    "uz": "Allohim, Sen Rabbimsan, Sendan boshqa iloh yo‘q. Meni yaratgansan va men Sening qulingman... (istig‘for duosi).",
    "reference": "Ramazon / Hisnul Muslim",
    "group": "ramadan"
  }
];

export const AYAH_REFLECTIONS: AyahReflection[] = [
  {
    "id": 1,
    "text_uz": "Alloh, Undan o'zga iloh yo'q. U tirikdir va qayyumdir. Uni mudroq ham, uyqu ham olmas. Osmonlaru yerdagi narsalar Unikidir. Uning huzurida O'zining iznisiz hech kim shafoat qila olmas. U ularning oldilaridagi narsani ham, ortlaridagi narsani ham bilur. Uning ilmidan hech narsani ihota qila olmaslar, magar O'zi xohlaganini, xolos. Uning kursisi osmonlaru yerni qamragan. U ularni muhofaza qilishdan charchamas. Va U Aliy va Aziym Zotdir.",
    "reference": "Qur'oni karim, Baqara surasi, 255-oyat",
    "surahNumber": 2,
    "ayahNumber": 255
  },
  {
    "id": 2,
    "text_uz": "U osmonlaru yerni olti kunda yaratib, so'ngra (Zoti va ulug'ligiga munosib suratda) Arshga yuksalgan Zotdir. Yerga nima kirganini ham, undan nima chiqqanini ham, osmondan nima tushganini ham, unga nima chiqqanini ham biladir. U, qayerda bo'lsangiz ham, siz bilan birga. Alloh qilayotgan amallaringizni ko'rib turuvchidir.",
    "reference": "Qur'oni karim, Hadid surasi, 4-oyat",
    "surahNumber": 57,
    "ayahNumber": 4
  },
  {
    "id": 3,
    "text_uz": "Albatta, insonni Biz yaratganmiz va uning nafsi nimani vasvasa qilishini ham bilurmiz. Va Biz unga jon tomiridan ham yaqinmiz.",
    "reference": "Qur'oni karim, Qof surasi, 16-oyat",
    "surahNumber": 50,
    "ayahNumber": 16
  },
  {
    "id": 4,
    "text_uz": "Biror so'z aytmas, magar huzurida hoziru nozir borlar.",
    "reference": "Qur'oni karim, Qof surasi, 18-oyat",
    "surahNumber": 50,
    "ayahNumber": 18
  },
  {
    "id": 5,
    "text_uz": "Albatta, Alloh osmonlaru yerdagi barcha narsalarni bilishini anglamadingmi? Agar uchtaning sirli so'zlashuvi bo'lsa, albatta, U zot to'rtinchidir. Beshtaniki bo'lsa, U zot oltinchidir. Bundan oz bo'lsa ham, ko'p bo'lsa ham va qayerda bo'lsalar ham, albatta, Alloh ular bilandir. So'ng qiyomat kunida ularga qilgan ishlaridan xabar beradir. Albatta, Alloh har bir narsani biluvchidir.",
    "reference": "Qur'oni karim, Mujodala surasi, 7-oyat",
    "surahNumber": 58,
    "ayahNumber": 7
  },
  {
    "id": 6,
    "text_uz": "Alloh uni ko'rib turishini bilmasmi?",
    "reference": "Qur'oni karim, Alaq surasi, 14-oyat",
    "surahNumber": 96,
    "ayahNumber": 14
  },
  {
    "id": 7,
    "text_uz": "Ey odamlar! Sizlarni bir jondan yaratgan va undan uning juftini yaratib, ikkovlaridan ko'plab erkagu ayollar taratgan Robbingizdan qo'rqinglar! Nomini ishlatib bir-biringizdan so'rovda bo'ladiganingiz Allohdan va qarindoshlik (aloqalarini uzish)dan qo'rqing. Albatta, Alloh ustingizda kuzatib turuvchi Zotdir.",
    "reference": "Qur'oni karim, Niso surasi, 1-oyat",
    "surahNumber": 4,
    "ayahNumber": 1
  },
  {
    "id": 8,
    "text_uz": "Albatta, Robbing kuzatib turuvchidir.",
    "reference": "Qur'oni karim, Fajr surasi, 14-oyat",
    "surahNumber": 89,
    "ayahNumber": 14
  },
  {
    "id": 9,
    "text_uz": "Qaysi holda bo'lsang, Qur'ondan nimani tilovat etsang, ishlardan qay birini qilsang, albatta, Biz o'shanga kirishayotgan paytinglarda sizlarga guvohmiz. Na yer yuzida va na osmonlarda zarra miqdoridagi, undan kichikroq yoki kattaroq narsa Robbingdan maxfiy bo'la olmas, balki, ochiq-oydin kitobdadir.",
    "reference": "Qur'oni karim, Yunus surasi, 61-oyat",
    "surahNumber": 10,
    "ayahNumber": 61
  },
  {
    "id": 10,
    "text_uz": "G'aybning kalitlari Uning huzurida bo'lib, ularni Uning O'zidan boshqa hech kim bilmas. U yerdagi, quruqlik va dengizdagi narsalarni biladir. Bitta yaproq uzilib tushmaydiki, magar uni ham biladir. Yer tubidagi bir dona don bormi, ho'lu quruq bormi, barchasi Ochiq kitobda bordir.",
    "reference": "Qur'oni karim, An'om surasi, 59-oyat",
    "surahNumber": 6,
    "ayahNumber": 59
  },
  {
    "id": 11,
    "text_uz": "Va siz so'zingizni sir tutasizmi yoki oshkora aytasizmi, albatta, U ko'ngillardagini ham bilguvchi Zotdir.",
    "reference": "Qur'oni karim, Mulk surasi, 13-oyat",
    "surahNumber": 67,
    "ayahNumber": 13
  },
  {
    "id": 12,
    "text_uz": "U, osmonlaru yerdagi narsalarni biladir. Sizlar sir tutayotgan narsani ham va e'lon qilayotgan narsani ham biladir. Alloh ko'krakdagi narsalarni ham biluvchidir.",
    "reference": "Qur'oni karim, Tag'obun surasi, 4-oyat",
    "surahNumber": 64,
    "ayahNumber": 4
  },
  {
    "id": 13,
    "text_uz": "Albatta, Alloh Unga yerda ham, osmonda ham hech narsa maxfiy qolmaydigan Zotdir.",
    "reference": "Qur'oni karim, Oli Imron surasi, 5-oyat",
    "surahNumber": 3,
    "ayahNumber": 5
  },
  {
    "id": 14,
    "text_uz": "U zot ko'zlarning xiyonatini ham, dillar maxfiy tutgan narsalarni ham bilur.",
    "reference": "Qur'oni karim, G'ofir surasi, 19-oyat",
    "surahNumber": 40,
    "ayahNumber": 19
  },
  {
    "id": 15,
    "text_uz": "«Ey o'g'ilcham, albatta, u (amal) agar achitqining bir dona urug'icha bo'lsa-yu, u bir qoya tosh ichida yoki osmonlarda yoxud yerda bo'lsa ham, Alloh uni keltirur. Albatta, Alloh o'ta lutfli va o'ta xabardor Zotdir.»",
    "reference": "Qur'oni karim, Luqmon surasi, 16-oyat",
    "surahNumber": 31,
    "ayahNumber": 16
  },
  {
    "id": 16,
    "text_uz": "Seni qoim bo'lganingda ko'radigan.",
    "reference": "Qur'oni karim, Shuaro surasi, 218-oyat",
    "surahNumber": 26,
    "ayahNumber": 218
  },
  {
    "id": 17,
    "text_uz": "Bas, sen va sen bilan tavba qilganlar mustaqiym turinglar va tug'yonga ketmanglar. Chunki, U nima qilayotganingizni ko'rib turguvchidir.",
    "reference": "Qur'oni karim, Hud surasi, 112-oyat",
    "surahNumber": 11,
    "ayahNumber": 112
  },
  {
    "id": 18,
    "text_uz": "Albatta, Alloh taqvo qilganlar va go'zal ishlar qilganlar bilandir.",
    "reference": "Qur'oni karim, Nahl surasi, 128-oyat",
    "surahNumber": 16,
    "ayahNumber": 128
  },
  {
    "id": 19,
    "text_uz": "Iymon keltirganlar va Allohning zikri ila qalblari orom topganlar. Ayo, Allohning zikri ila qalblar orom topmasmi?",
    "reference": "Qur'oni karim, Ra'd surasi, 28-oyat",
    "surahNumber": 13,
    "ayahNumber": 28
  },
  {
    "id": 20,
    "text_uz": "Bas, Meni eslangiz, sizni eslarman. Va Menga shukr qilingiz, kufr qilmangiz.",
    "reference": "Qur'oni karim, Baqara surasi, 152-oyat",
    "surahNumber": 2,
    "ayahNumber": 152
  },
  {
    "id": 21,
    "text_uz": "Agar bandalarim sendan Meni so'rasalar, Men, albatta, yaqinman. Duo qilguvchi duo qilganda, ijobat qilurman. Bas, Menga ham ijobat qilsinlar va iymon keltirsinlar. Shoyadki, to'g'ri yo'lni topsalar.",
    "reference": "Qur'oni karim, Baqara surasi, 186-oyat",
    "surahNumber": 2,
    "ayahNumber": 186
  },
  {
    "id": 22,
    "text_uz": "Albatta, Men O'zim Allohdirman. Mendan o'zga iloh yo'q. Bas, Menga ibodat qil va Meni zikr etish uchun namozni to'kis ado et.",
    "reference": "Qur'oni karim, Toha surasi, 14-oyat",
    "surahNumber": 20,
    "ayahNumber": 14
  },
  {
    "id": 23,
    "text_uz": "Senga kitobdan vahiy qilingan narsani tilovat qil va namozni to'kis ado et, albatta, namoz fohisha va munkar ishlardan qaytarur. Albatta, Allohning zikri buyuk ishdir. Alloh nima qilsangiz, bilur.",
    "reference": "Qur'oni karim, Ankabut surasi, 45-oyat",
    "surahNumber": 29,
    "ayahNumber": 45
  },
  {
    "id": 24,
    "text_uz": "Ey, iymon keltirganlar! Allohni ko'p zikr qilinglar.",
    "reference": "Qur'oni karim, Ahzob surasi, 41-oyat",
    "surahNumber": 33,
    "ayahNumber": 41
  },
  {
    "id": 25,
    "text_uz": "Albatta, Alloh zikr qilinsa, qalblari titraguvchi, oyatlari tilovat etilsa, iymonlarini ziyoda qilguvchi va Robbilariga tavakkul qilguvchilargina mo'minlardir.",
    "reference": "Qur'oni karim, Anfol surasi, 2-oyat",
    "surahNumber": 8,
    "ayahNumber": 2
  },
  {
    "id": 26,
    "text_uz": "Va ular fohisha ish yoki o'zlariga zulm qilgan chog'larida Allohni eslab, gunohlarini mag'firat qilishni so'rarlar, gunohlarini Allohdan o'zga kim ham mag'firat qilardi? Va ular bilib turib, qilgan gunohlarida bardavom bo'lmaslar.",
    "reference": "Qur'oni karim, Oli Imron surasi, 135-oyat",
    "surahNumber": 3,
    "ayahNumber": 135
  },
  {
    "id": 27,
    "text_uz": "Sen (Mening tarafimdan): «Ey, o'z jonlariga isrof (javr) qilgan bandalarim, Allohning rahmatidan noumid bo'lmang! Albatta, Alloh barcha gunohlarni mag'firat etar. Albatta, Uning O'zi o'ta mag'firatli va o'ta rahimli Zotdir», deb ayt.",
    "reference": "Qur'oni karim, Zumar surasi, 53-oyat",
    "surahNumber": 39,
    "ayahNumber": 53
  },
  {
    "id": 28,
    "text_uz": "Ey imon keltirganlar! Sabr va namoz bilan yordam so'ranglar. Albatta, Alloh sabr qiluvchilar bilan birgadir.",
    "reference": "Qur'oni karim, Baqara surasi, 153-oyat",
    "surahNumber": 2,
    "ayahNumber": 153
  },
  {
    "id": 29,
    "text_uz": "Alloh hech bir jonni toqatidan tashqari narsaga taklif qilmas. Har bir kishining qilgan yaxshiligi o'ziga, qilgan yomonligi ham o'ziga qaytadi.",
    "reference": "Qur'oni karim, Baqara surasi, 286-oyat",
    "surahNumber": 2,
    "ayahNumber": 286
  },
  {
    "id": 30,
    "text_uz": "...Agar biron ishni qat'iy qilmoqchi bo'lsang, Allohga tavakkal qil. Albatta, Alloh tavakkal qiluvchilarni sevadi.",
    "reference": "Qur'oni karim, Oli Imron surasi, 159-oyat",
    "surahNumber": 3,
    "ayahNumber": 159
  },
  {
    "id": 31,
    "text_uz": "Albatta: «Bizning Robbimiz Allohdir», deb, so'ngra shu so'zlarida mustahkam turganlarga farishtalar nozil bo'lib: «Qo'rqmanglar va g'amgin bo'lmanglar, sizlarga va'da qilingan jannat bilan xursand bo'linglar», deydilar.",
    "reference": "Qur'oni karim, Fussilat surasi, 30-oyat",
    "surahNumber": 41,
    "ayahNumber": 30
  },
  {
    "id": 32,
    "text_uz": "Kim erkak yoki ayol bo'lsin, mo'min bo'lgan holda yaxshi amal qilsa, albatta, Biz uni pokiza hayot bilan tiriltiramiz va ularning ajrlarini, albatta, qilib yurgan eng yaxshi amallari bo'yicha beramiz.",
    "reference": "Qur'oni karim, Nahl surasi, 97-oyat",
    "surahNumber": 16,
    "ayahNumber": 97
  },
  {
    "id": 33,
    "text_uz": "(Muso) aytdi: «Parvardigorim! Ko'ksimni keng qilgin, ishimni osonlashtirgin.»",
    "reference": "Qur'oni karim, Toha surasi, 25-26-oyat",
    "surahNumber": 20,
    "ayahNumber": 25
  },
  {
    "id": 34,
    "text_uz": "...«Sendan o'zga iloh yo'q, Sen pok Zotsan. Albatta, men zolimlardan bo'ldim», deb nido qildi.",
    "reference": "Qur'oni karim, Anbiyo surasi, 87-oyat",
    "surahNumber": 21,
    "ayahNumber": 87
  },
  {
    "id": 35,
    "text_uz": "«Parvardigorim! Albatta, men Sen menga nozil qiladigan har qanday yaxshilikka muhtojman», dedi.",
    "reference": "Qur'oni karim, Qasas surasi, 24-oyat",
    "surahNumber": 28,
    "ayahNumber": 24
  },
  {
    "id": 36,
    "text_uz": "Ey odamlar! Sizlar Allohga muhtojsizlar. Alloh esa behojat va hamdga sazovor Zotdir.",
    "reference": "Qur'oni karim, Fotir surasi, 15-oyat",
    "surahNumber": 35,
    "ayahNumber": 15
  },
  {
    "id": 37,
    "text_uz": "...Kim Allohga tavakkal qilsa, U unga kifoya qiladi. Albatta, Alloh O'z ishini yetkazguvchidir. Alloh har bir narsa uchun bir andoza qilib qo'ygandir.",
    "reference": "Qur'oni karim, Taloq surasi, 3-oyat",
    "surahNumber": 65,
    "ayahNumber": 3
  },
  {
    "id": 38,
    "text_uz": "Albatta, qiyinchilik bilan birga yengillik bordir. Albatta, qiyinchilik bilan birga yengillik bordir.",
    "reference": "Qur'oni karim, Inshirah surasi, 5-6-oyat",
    "surahNumber": 94,
    "ayahNumber": 5
  },
  {
    "id": 39,
    "text_uz": "«Parvardigorimiz! Bizga dunyoda ham yaxshilik ber, oxiratda ham yaxshilik ber va bizni do'zax azobidan saqla», deb duo qiluvchilar ham bor.",
    "reference": "Qur'oni karim, Baqara surasi, 201-oyat",
    "surahNumber": 2,
    "ayahNumber": 201
  },
  {
    "id": 40,
    "text_uz": "«Parvardigorimiz! Bizni hidoyat qilganingdan so'ng qalblarimizni og'dirib yuborma va bizga O'z huzuringdan rahmat ato et. Albatta, Sen O'zing cheksiz ato etuvchisan.»",
    "reference": "Qur'oni karim, Oli Imron surasi, 8-oyat",
    "surahNumber": 3,
    "ayahNumber": 8
  },
  {
    "id": 41,
    "text_uz": "«Parvardigorim! Ular meni bolaligimda tarbiya qilganlariga baraka ravishda ularga rahm qilgin», deb ayt.",
    "reference": "Qur'oni karim, Isro surasi, 24-oyat",
    "surahNumber": 17,
    "ayahNumber": 24
  },
  {
    "id": 42,
    "text_uz": "Bizning yo'limizda mehnat (jihod) qilganlarni, albatta, Biz O'z yo'llarimizga hidoyat qilamiz. Albatta, Alloh yaxshilik qiluvchilar bilan birgadir.",
    "reference": "Qur'oni karim, Ankabut surasi, 69-oyat",
    "surahNumber": 29,
    "ayahNumber": 69
  },
  {
    "id": 43,
    "text_uz": "...Albatta, Alloh huzurida eng hurmatlingiz taqvodorroqingizdir. Albatta, Alloh bilguvchi va xabardor Zotdir.",
    "reference": "Qur'oni karim, Hujurot surasi, 13-oyat",
    "surahNumber": 49,
    "ayahNumber": 13
  },
  {
    "id": 44,
    "text_uz": "Bas, (ey ins va jin,) Robbingizning qaysi ne'matlarini inkor etasiz?",
    "reference": "Qur'oni karim, Rahmon surasi, 13-oyat",
    "surahNumber": 55,
    "ayahNumber": 13
  },
  {
    "id": 45,
    "text_uz": "Ularga: «Odamlar sizlarga qarshi katta qo'shin to'pladi, ulardan qo'rqinglar», deyilganda, bu gap ularning imonini yanada ziyoda qildi va ular: «Alloh bizga kifoya qiladi, U qanday yaxshi vakil», dedilar.",
    "reference": "Qur'oni karim, Oli Imron surasi, 173-oyat",
    "surahNumber": 3,
    "ayahNumber": 173
  }
];

export const QIRQ_FARZ: QirqFarzItem[] = [
  {
    "id": 1,
    "bolim": "Imonning shartlari",
    "title": "Allohning borligi va birligiga ishonish",
    "izoh": "Imonning birinchi va eng asosiy sharti — yolg'iz Allohga, Uning sherigi yo'qligiga qalban ishonish."
  },
  {
    "id": 2,
    "bolim": "Imonning shartlari",
    "title": "Farishtalarga ishonish",
    "izoh": "Allohning nurdan yaratgan, gunoh qilmaydigan maxluqlari — farishtalarning borligiga ishonish."
  },
  {
    "id": 3,
    "bolim": "Imonning shartlari",
    "title": "Kitoblarga ishonish",
    "izoh": "Alloh payg'ambarlarga nozil qilgan barcha ilohiy kitoblarga (jumladan Qur'oni Karimga) ishonish."
  },
  {
    "id": 4,
    "bolim": "Imonning shartlari",
    "title": "Payg'ambarlarga ishonish",
    "izoh": "Odam alayhissalomdan Muhammad sollallohu alayhi vasallamgacha bo'lgan barcha payg'ambarlarga ishonish."
  },
  {
    "id": 5,
    "bolim": "Imonning shartlari",
    "title": "Oxirat kuniga (qiyomatga) ishonish",
    "izoh": "O'limdan keyingi hayotga, qayta tirilish, hisob-kitob va jannat-do'zaxga ishonish."
  },
  {
    "id": 6,
    "bolim": "Imonning shartlari",
    "title": "Taqdirga ishonish",
    "izoh": "Yaxshi va yomonning, barcha voqealarning Alloh taqdiri bilan bo'lishiga ishonish."
  },
  {
    "id": 7,
    "bolim": "Islomning shartlari",
    "title": "Kalimai shahodat aytish",
    "izoh": "\"Ashhadu an la ilaha illalloh va ashhadu anna Muhammadan abduhu va rasuluh\" deb tilda iqror bo'lish."
  },
  {
    "id": 8,
    "bolim": "Islomning shartlari",
    "title": "Besh vaqt namoz o'qish",
    "izoh": "Har kuni bomdod, peshin, asr, shom va xufton namozlarini vaqtida ado etish."
  },
  {
    "id": 9,
    "bolim": "Islomning shartlari",
    "title": "Ramazon oyida ro'za tutish",
    "izoh": "Har yili Ramazon oyida kuch yetganlarga ro'za tutish farz qilingan."
  },
  {
    "id": 10,
    "bolim": "Islomning shartlari",
    "title": "Zakot berish",
    "izoh": "Nisob miqdoridagi boylikka ega bo'lgan musulmon har yili zakotini chiqarishi farz."
  },
  {
    "id": 11,
    "bolim": "Islomning shartlari",
    "title": "Haj qilish",
    "izoh": "Moliyaviy va jismoniy imkoni bo'lgan har bir musulmonga umrida bir marta haj farz."
  },
  {
    "id": 12,
    "bolim": "Tahoratning farzlari",
    "title": "Yuzni yuvish",
    "izoh": "Peshona sochidan iyak tagigacha, bir quloqdan ikkinchi quloqqacha yuzni bir marta yuvish."
  },
  {
    "id": 13,
    "bolim": "Tahoratning farzlari",
    "title": "Ikki qo'lni tirsaklari bilan yuvish",
    "izoh": "Qo'llarni barmoq uchlaridan tirsaklargacha, tirsaklarni ham qo'shib yuvish."
  },
  {
    "id": 14,
    "bolim": "Tahoratning farzlari",
    "title": "Boshga mas'h tortish",
    "izoh": "Ho'l qo'l bilan boshning kamida to'rtdan bir qismini artib o'tish."
  },
  {
    "id": 15,
    "bolim": "Tahoratning farzlari",
    "title": "Ikki oyoqni to'piqlari bilan yuvish",
    "izoh": "Oyoqlarni barmoq uchlaridan to'piqlargacha, to'piqlarni ham qo'shib yuvish."
  },
  {
    "id": 16,
    "bolim": "G'uslning farzlari",
    "title": "Og'izga suv olib chayqash",
    "izoh": "Madmada — og'izning har tarafiga suv yetkazib chayqash."
  },
  {
    "id": 17,
    "bolim": "G'uslning farzlari",
    "title": "Burunga suv tortish",
    "izoh": "Istinshoq — burun ichiga yumshoq joyigacha suv tortish."
  },
  {
    "id": 18,
    "bolim": "G'uslning farzlari",
    "title": "Butun badanni yuvish",
    "izoh": "Sochning tagidan tortib, badanning hech bir joyini qoldirmay suv bilan yuvish."
  },
  {
    "id": 19,
    "bolim": "Tayammumning farzlari",
    "title": "Niyat qilish",
    "izoh": "Suv topilmagan yoki ishlatish mumkin bo'lmaganda tayammumga niyat qilish."
  },
  {
    "id": 20,
    "bolim": "Tayammumning farzlari",
    "title": "Yuz va qo'llarga mas'h tortish",
    "izoh": "Pok tuproqqa ikki marta urib, birinchisida yuzga, ikkinchisida tirsakkacha qo'llarga mas'h tortish."
  },
  {
    "id": 21,
    "bolim": "Namozning shartlari",
    "title": "Hadasdan pok bo'lish",
    "izoh": "Namozdan oldin tahorat yoki kerak bo'lsa g'usl qilib pok bo'lish."
  },
  {
    "id": 22,
    "bolim": "Namozning shartlari",
    "title": "Badanni najosatdan pok qilish",
    "izoh": "Tanadagi har qanday najosatni namozdan oldin tozalash."
  },
  {
    "id": 23,
    "bolim": "Namozning shartlari",
    "title": "Kiyimni najosatdan pok qilish",
    "izoh": "Namoz o'qiladigan kiyimda najosat bo'lmasligi kerak."
  },
  {
    "id": 24,
    "bolim": "Namozning shartlari",
    "title": "Namoz o'qiladigan joyni pok qilish",
    "izoh": "Sajda qilinadigan joy toza va najosatdan pok bo'lishi shart."
  },
  {
    "id": 25,
    "bolim": "Namozning shartlari",
    "title": "Avratni yopish",
    "izoh": "Erkak va ayolning shariat belgilagan avrat qismlarini kiyim bilan yopish."
  },
  {
    "id": 26,
    "bolim": "Namozning shartlari",
    "title": "Qiblaga yuzlanish",
    "izoh": "Namoz paytida yuzni Makkadagi Ka'ba tomon — qiblaga qaratish."
  },
  {
    "id": 27,
    "bolim": "Namozning shartlari",
    "title": "Vaqtni bilish",
    "izoh": "Har bir namozni o'z vaqti kirganidan keyin o'qish."
  },
  {
    "id": 28,
    "bolim": "Namozning shartlari",
    "title": "Niyat qilish",
    "izoh": "Qaysi namozni o'qiyotganini qalban va tilda niyat qilish."
  },
  {
    "id": 29,
    "bolim": "Namozning farzlari",
    "title": "Takbiri tahrima",
    "izoh": "\"Allohu akbar\" deb namozni boshlash — iftitoh takbiri."
  },
  {
    "id": 30,
    "bolim": "Namozning farzlari",
    "title": "Qiyom",
    "izoh": "Farz namozlarda kuch yetgan holda tik turib o'qish."
  },
  {
    "id": 31,
    "bolim": "Namozning farzlari",
    "title": "Qiroat",
    "izoh": "Qiyomda kamida bir oyat miqdorida Qur'ondan tilovat qilish."
  },
  {
    "id": 32,
    "bolim": "Namozning farzlari",
    "title": "Ruku",
    "izoh": "Egilib, qo'llarni tizzaga qo'yib ta'zim qilish."
  },
  {
    "id": 33,
    "bolim": "Namozning farzlari",
    "title": "Sajda",
    "izoh": "Har rakatda ikki marta peshona, burun, ikki qo'l, ikki tizza va oyoq uchlarini yerga qo'yib sajda qilish."
  },
  {
    "id": 34,
    "bolim": "Namozning farzlari",
    "title": "Qa'dai oxira",
    "izoh": "Namoz oxirida \"at-tahiyyat\" o'qiladigan miqdorda o'tirish."
  },
  {
    "id": 35,
    "bolim": "Ro'zaning farzlari",
    "title": "Ro'zaga niyat qilish",
    "izoh": "Har kuni ro'za tutishga qalban (saharlik paytidan oldin) niyat qilish."
  },
  {
    "id": 36,
    "bolim": "Ro'zaning farzlari",
    "title": "Ro'zani buzuvchi narsalardan tiyilish",
    "izoh": "Tong otishidan kun botguncha yemay-ichmay, ro'zani buzuvchi ishlardan saqlanish."
  },
  {
    "id": 37,
    "bolim": "Zakotning farzi",
    "title": "Zakotni niyat bilan berish",
    "izoh": "Nisobga yetgan moldan Alloh belgilagan ulushni niyat qilib, mustahiq kishilarga berish."
  },
  {
    "id": 38,
    "bolim": "Hajning farzlari",
    "title": "Ihrom bog'lash",
    "izoh": "Haj yoki umraga niyat qilib, belgilangan joyda ihromga kirish."
  },
  {
    "id": 39,
    "bolim": "Hajning farzlari",
    "title": "Arofatda turish",
    "izoh": "Vuquf — Arofat kuni (9-zulhijja) Arofat maydonida bir lahza bo'lsa ham turish."
  },
  {
    "id": 40,
    "bolim": "Hajning farzlari",
    "title": "Tavofi ziyorat",
    "izoh": "Haj kunlarida Ka'bani ziyorat tavofini qilish."
  }
];

export const NIYATLAR: NiyatItem[] = [
  {
    "id": 1,
    "category": "Namoz niyati",
    "title": "Bomdod namozi farzi",
    "uz": "Men bugungi bomdod namozining ikki rakat farzini Alloh rizosi uchun, qiblaga yuzlanib o'qishga niyat qildim.",
    "arabic": ""
  },
  {
    "id": 2,
    "category": "Namoz niyati",
    "title": "Peshin namozi farzi",
    "uz": "Men bugungi peshin namozining to'rt rakat farzini Alloh rizosi uchun, qiblaga yuzlanib o'qishga niyat qildim.",
    "arabic": ""
  },
  {
    "id": 3,
    "category": "Namoz niyati",
    "title": "Asr namozi farzi",
    "uz": "Men bugungi asr namozining to'rt rakat farzini Alloh rizosi uchun, qiblaga yuzlanib o'qishga niyat qildim.",
    "arabic": ""
  },
  {
    "id": 4,
    "category": "Namoz niyati",
    "title": "Shom namozi farzi",
    "uz": "Men bugungi shom namozining uch rakat farzini Alloh rizosi uchun, qiblaga yuzlanib o'qishga niyat qildim.",
    "arabic": ""
  },
  {
    "id": 5,
    "category": "Namoz niyati",
    "title": "Xufton namozi farzi",
    "uz": "Men bugungi xufton namozining to'rt rakat farzini Alloh rizosi uchun, qiblaga yuzlanib o'qishga niyat qildim.",
    "arabic": ""
  },
  {
    "id": 6,
    "category": "Namoz niyati",
    "title": "Vitr namozi",
    "uz": "Men uch rakat vitr namozini Alloh rizosi uchun, qiblaga yuzlanib o'qishga niyat qildim.",
    "arabic": ""
  },
  {
    "id": 7,
    "category": "Namoz niyati",
    "title": "Juma namozi",
    "uz": "Men bugungi juma namozining ikki rakat farzini imomga iqtido qilib, Alloh rizosi uchun o'qishga niyat qildim.",
    "arabic": ""
  },
  {
    "id": 8,
    "category": "Namoz niyati",
    "title": "Hayit (Iyd) namozi",
    "uz": "Men hayit namozining ikki rakat vojibini imomga iqtido qilib, Alloh rizosi uchun o'qishga niyat qildim.",
    "arabic": ""
  },
  {
    "id": 9,
    "category": "Namoz niyati",
    "title": "Tarovih namozi",
    "uz": "Men ramazon oyining tarovih namozini Alloh rizosi uchun o'qishga niyat qildim. (Har ikki rakatda alohida niyat qilinadi.)",
    "arabic": ""
  },
  {
    "id": 10,
    "category": "Namoz niyati",
    "title": "Janoza namozi",
    "uz": "Men ushbu marhum (yoki marhuma) uchun janoza namozini Alloh rizosi uchun, imomga iqtido qilib o'qishga niyat qildim.",
    "arabic": ""
  },
  {
    "id": 11,
    "category": "Ro'za niyati",
    "title": "Ramazon ro'zasi",
    "uz": "Men ertangi kunni ramazon oyining farz ro'zasi sifatida tutishga niyat qildim.",
    "arabic": "نَوَيْتُ أَنْ أَصُومَ غَدًا مِنْ شَهْرِ رَمَضَانَ — Navaytu an asuma g'adan min shahri romadan"
  },
  {
    "id": 12,
    "category": "Ro'za niyati",
    "title": "Qazo ro'za",
    "uz": "Men zimmamdagi qazo bo'lib qolgan ro'zani ertaga tutishga niyat qildim.",
    "arabic": ""
  },
  {
    "id": 13,
    "category": "Ro'za niyati",
    "title": "Nafl (ixtiyoriy) ro'za",
    "uz": "Men bugun (yoki ertaga) ixtiyoriy (nafl) ro'za tutishga niyat qildim. (Nafl ro'zaning niyatini kun yarmigacha biror narsa yemagan bo'lsa ham qilish mumkin.)",
    "arabic": ""
  },
  {
    "id": 14,
    "category": "Poklanish niyati",
    "title": "G'usl (katta tahorat)",
    "uz": "Men katta tahoratsizlikdan (janobat, hayz yoki nifosdan) poklanish uchun g'usl qilishga niyat qildim.",
    "arabic": ""
  },
  {
    "id": 15,
    "category": "Poklanish niyati",
    "title": "Tayammum",
    "uz": "Men suv topilmagani (yoki ishlata olmaganim) sababli tahorat yoki g'usl o'rniga tayammum qilishga niyat qildim.",
    "arabic": ""
  },
  {
    "id": 16,
    "category": "Boshqa ibodatlar niyati",
    "title": "Zakot",
    "uz": "Men ushbu mol-mulkimning zakotini Alloh rizosi uchun, zakot sifatida ajratib berishga niyat qildim.",
    "arabic": ""
  },
  {
    "id": 17,
    "category": "Boshqa ibodatlar niyati",
    "title": "I'tikof",
    "uz": "Men masjidda turgan muddatimni Alloh rizosi uchun i'tikofga niyat qildim.",
    "arabic": ""
  },
  {
    "id": 18,
    "category": "Boshqa ibodatlar niyati",
    "title": "Qurbonlik",
    "uz": "Men ushbu qurbonlikni Alloh rizosi uchun qurbonlik qilishga niyat qildim.",
    "arabic": ""
  },
  {
    "id": 19,
    "category": "Boshqa ibodatlar niyati",
    "title": "Haj / Umra (ihrom)",
    "uz": "Men haj (yoki umra) ibodatini ado etishga niyat qildim.",
    "arabic": "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ — Labbayk Allohumma labbayk, labbayka la sharika laka labbayk (Talbiya)"
  }
];
