export interface SeerahChapter {
  id: string;
  yearLabel: string;
  period: 'makkah' | 'madinah';
  titleUz: string;
  summaryUz: string;
  keyEventsUz: string[];
  lessonUz: string;
  sourceUz: string;
}

export interface ProphetStoryItem {
  id: number;
  nameUz: string;
  arabicName: string;
  titleBadgeUz: string;
  summaryUz: string;
  miraclesAndKeyFactsUz: string[];
  moralUz: string;
  quranRefsUz: string;
}

export const SEERAH_CHAPTERS: SeerahChapter[] = [
  {
    id: 'birth-youth',
    yearLabel: 'Milodiy 571 – 595 (Fil yili)',
    period: 'makkah',
    titleUz: "1. Muborak tavallud va «Al-Amin» yoshlik davri",
    summaryUz: "Payg'ambarimiz Muhammad ibn Abdulloh ﷺ Rabi'ul-avval oyining 12-kuni (Fil voqeasidan 50 kun o'tib) Makkai Mukarramada dunyoga keldilar.",
    keyEventsUz: [
      "Otalarining ismi Abdulloh, onalarining ismi Omina binti Vahb, bobolari Abdulmuttalib.",
      "Go'daklik chog'larida Bani Sa'd qabilasida Halimai Sa'diya onamiz tarbiyasida bo'ldilar.",
      "6 yoshlarida onalari Omina, 8 yoshlarida bobolari Abdulmuttalib vafot etgach, amakilari Abu Tolib qaramog'ida ulg'aydilar.",
      "Yoshliklaridan rostgo'ylik va omonatdorlikda tengsiz bo'lganlari sababli Makka ahli u zotni «Al-Amin» (Eng ishonchli, omonatdor) deb atadi va 25 yoshlarida Xadicha binti Xuvaylid розияллоҳу анҳоga uylandilar."
    ],
    lessonUz: "Haqiqiy mo'min har qanday jamiyatda eng avvalo rostgo'yligi va omonatga xiyonat qilmasligi bilan tanilishi lozim.",
    sourceUz: "Ibn Hishom «As-Siyra an-Nabaviya», Imom Buxoriy"
  },
  {
    id: 'first-revelation',
    yearLabel: 'Milodiy 610 (40 yosh)',
    period: 'makkah',
    titleUz: "2. Hiro g'oridagi ilk vahiy — «Iqro'!» (O'qi!)",
    summaryUz: "Ramazon oyining Qadr kechasida Hiro g'orida Jabroil alayhissalom orqali Alaq surasining dastlabki 5 oyati nozil bo'ldi.",
    keyEventsUz: [
      "Ilk kalima «Iqro' bismi Robbikal-laziy xolaq» — «Yaratgan Robbing nomi bilan o'qi!» bo'ldi.",
      "Ayollar ichidan birinchi bo'lib Xadicha onamiz, erkaklardan Abu Bakr Siddiq, bolalardan Ali ibn Abu Tolib va ozod qilingan qullardan Zayd ibn Horisa iymon keltirdilar.",
      "Dastlabki 3 yil davomida da'vat maxfiy olib borilib, Arqam ibn Abul Arqam hovlisida sahobalar ilm va Qur'on o'rgandilar."
    ],
    lessonUz: "Islom dini ilm o'qish va ma'rifat bilan boshlangan; qiyin paytda oilaning va sodiq do'stning daldasi eng katta tayanchdir.",
    sourceUz: "Sahihi Buxoriy (Vahiyning boshlanishi bobi)"
  },
  {
    id: 'public-dawah-isra',
    yearLabel: 'Milodiy 613 – 621',
    period: 'makkah',
    titleUz: "3. Oshkora da'vat, Sabr yillari hamda Isro va Me'roj",
    summaryUz: "13 yillik Makka davrida musulmonlar og'ir sinovlarga sabr qildilar, Habashistonga hijrat qildilar va Me'roj kechasida 5 vaqt namoz farz qilindi.",
    keyEventsUz: [
      "Mushriklarning tazyiqi kuchayganda sahobalarning bir guruhi adolatli podshoh Najoshiy yurtiga — Habashistonga hijrat qildi.",
      "Bani Hoshim darasidagi 3 yillik qamal va «Mahzunlik yili»da (Xadicha onamiz va Abu Tolib vafoti) ham Rasululloh ﷺ sabr va shafqat namunasi bo'ldilar.",
      "Isro va Me'roj mo'jizasida Rasululloh ﷺ bir kechada Masjidul Haromdan Masjidul Aqsoga, u yerdan yetti qavat osmonga ko'tarildilar va ummatga 5 vaqt namoz tuhfa etildi."
    ],
    lessonUz: "Har bir qiyinchilik ortidan yengillik keladi; Namoz — mo'minning Me'roji va Alloh bilan bevosita muloqotidir.",
    sourceUz: "Isro surasi 1-oyat, Sahihi Muslim"
  },
  {
    id: 'hijrah-madinah',
    yearLabel: 'Milodiy 622 (Hijriy 1-yil)',
    period: 'madinah',
    titleUz: "4. Madinai Munavvaraga Hijrat va Islom birodarligi",
    summaryUz: "Rasululloh ﷺ Abu Bakr Siddiq hamrohligida Madinaga hijrat qildilar — bu voqea Islom tarixida yangi davr va Hijriy taqvimning boshlanishi bo'ldi.",
    keyEventsUz: [
      "Yo'lda Savr g'orida Allohning hifzu himoyasi bilan mushriklardan omon qoldilar («Mahzun bo'lma, albatta Alloh biz bilan!» — Tavba, 40).",
      "Qubo masjidiga asos soldilar va Madinada Masjidun-Nabaviyni sahobalar bilan birga qurdilar.",
      "Makkalik Muhojirlar bilan Madinalik Ansorlar o'rtasida tarixda misli ko'rilmagan «Muoxot» (aka-ukalik, birodarlik) rishtasini bog'ladilar."
    ],
    lessonUz: "Masjid va halol birodarlik — sog'lom jamiyatning ikki ustunidir.",
    sourceUz: "Tavba surasi 40-oyat, Sahihi Buxoriy"
  },
  {
    id: 'badr-uhud-khandaq',
    yearLabel: 'Milodiy 624 – 627 (Hijriy 2–5-yillar)',
    period: 'madinah',
    titleUz: "5. Badr, Uhud va Xandaq — Iymon va Ibrat sinovlari",
    summaryUz: "Madina davlatini himoya qilish yo'lida Badrda (313 sahoba), Uhudda va Xandaq (Ahzob) janglarida buyuk saboqlar namoyon bo'ldi.",
    keyEventsUz: [
      "Hijriy 2-yil Ramazonning 17-kunida Badrda 313 nafar musulmon o'zlaridan uch barobar ko'p qo'shin ustidan Allohning madadi bilan g'alaba qozondi. Asirlarga esa 10 ta musulmon bolasiga o'qish-yozishni o'rgatish evaziga ozodlik berildi!",
      "Hijriy 3-yil Uhud tog'i etagida kamonchilar tepalikni vaqtli tark etishi natijasida Rasululloh ﷺning amriga to'liq itoat etish qanchalik muhim ekani ayon bo'ldi.",
      "Hijriy 5-yil Xandaq (Ahzob) voqeasida Salmon Forsiy розияллоҳу анҳу maslahati bilan Madina atrofiga xandaq qazilib, mashvarat (kengashish) barakasi bilan urushsiz g'alaba qozonildi."
    ],
    lessonUz: "Intizom, o'zaro mashvarat va hatto urush sharoitida ham ilm-savodga e'tibor berish — Nabaviy sunnatdir.",
    sourceUz: "Oli Imron va Ahzob suralari, Ibn Hishom"
  },
  {
    id: 'hudaybiyah-fath',
    yearLabel: 'Milodiy 628 – 630 (Hijriy 6–8-yillar)',
    period: 'madinah',
    titleUz: "6. Hudaybiya sulhi va Makka Fathi — Buyuk kechirimlilik",
    summaryUz: "Hudaybiya tinchlik sulhi Qur'onda «Fathi mubin» (Ochiq g'alaba) deb ataldi va hijriy 8-yilda Makka qon to'kilmasdan fath etildi.",
    keyEventsUz: [
      "Hudaybiya sulhi tufayli 2 yil ichida Islomni qabul qilganlar soni avvalgi 19 yildagidan bir necha barobar ko'paydi.",
      "Hijriy 8-yil Ramazon oyida 10 000 sahoba bilan Makka fath etildi va Ka'ba butlardan tozalandi.",
      "Rasululloh ﷺ 20 yil davomida ozor bergan Makka ahliga qasos olmasdan: «Bugun sizlarga malomat yo'q, boringlar, barchangiz ozodsiz!» deb umumiy afv e'lon qildilar."
    ],
    lessonUz: "Kuch-qudratga ega bo'lganda kechira olish — Payg'ambarimiz ﷺning eng ulug' xulqlaridandir.",
    sourceUz: "Fath surasi 1-oyat, Sahihi Buxoriy"
  },
  {
    id: 'farewell-legacy',
    yearLabel: 'Milodiy 632 (Hijriy 10–11-yillar)',
    period: 'madinah',
    titleUz: "7. Vidolashuv Hajji (Hajjatul Vado') va Boqiy Omonat",
    summaryUz: "Hijriy 10-yilda 100 000 dan ziyod sahoba ishtirokida Vidolashuv hajji ado etildi va insoniyat tarixidagi eng ulug' Xutba aytildi.",
    keyEventsUz: [
      "Arafotda «Bugun sizlarga diningizni mukammal qilib berdim» (Moida, 3) oyati nozil bo'ldi.",
      "Vidolashuv xutbasida qon, mol va or-nomus daxlsizligi, ribo (sudxo'rlik) haromligi, ayollar haq-huquqiga ehtiyot bo'lish va barcha insonlarning tengligi e'lon qilindi.",
      "«Sizlarga ikki narsani qoldirdim, ularni mahkam tutsangiz aslo adashmaysiz: Allohning Kitobi (Qur'on) va mening Sunnatim!»",
      "Hijriy 11-yil 12-Rabi'ul-avval kuni (63 yoshlarida) Madinada Rafiqul A'loga rihlat qildilar va Ravzai Mutohharaga dafn etildilar."
    ],
    lessonUz: "Qur'oni Karim va Sunnati Nabaviyani mahkam tutish — ikki dunyo saodatining yagona kafolatidir.",
    sourceUz: "Moida surasi 3-oyat, Sahihi Muslim"
  }
];

export const PROPHETS_25_LIST: ProphetStoryItem[] = [
  {
    id: 1,
    nameUz: "1. Odam alayhissalom",
    arabicName: "آدَم عليه السلام",
    titleBadgeUz: "Abul-Bashar (Insoniyat otasi)",
    summaryUz: "Alloh taolo Odam alayhissalomni tuproqdan yaratib, O'z ruhidan pufladi, barcha narsalarning ismlarini (ilmni) o'rgatdi va yer yuzida birinchi xalifa hamda ilk payg'ambar qildi.",
    miraclesAndKeyFactsUz: [
      "Farishtalar Odam a.s.ga hurmat yuzasidan sajda qildilar, faqat Iblis kibrlanib bosh tortdi.",
      "Xatodan so'ng darhol «Robbana zolamna anfusana...» deb chin tavba qildilar va Alloh tavbalarini qabul etdi."
    ],
    moralUz: "Kibr (Iblisning xatosi) halokatga, xatoni tan olib darhol tavba qilish (Odam a.s. yo'li) najotga eltadi.",
    quranRefsUz: "Baqara: 30–38, A'rof: 11–25"
  },
  {
    id: 2,
    nameUz: "2. Idris alayhissalom",
    arabicName: "إِدْرِيس عليه السلام",
    titleBadgeUz: "Ilk qalam bilan yozgan zot",
    summaryUz: "Odam va Shis alayhissalomlardan keyin yuborilgan, ko'p kitob o'qigan, qalam bilan yozgan va kiyim tikishni boshlab bergan siddiq payg'ambar.",
    miraclesAndKeyFactsUz: [
      "Qur'onda «U siddiq (o'ta rostgo'y) payg'ambar edi va Biz uni oliy maqomga ko'tardik» deb madh etilgan."
    ],
    moralUz: "Ilm, hunar va ibodatni jamlash mo'minni oliy darajaga ko'taradi.",
    quranRefsUz: "Maryam: 56–57, Anbiyo: 85"
  },
  {
    id: 3,
    nameUz: "3. Nuh alayhissalom",
    arabicName: "نُوح عليه السلام",
    titleBadgeUz: "Shayxul-Anbiyo · Ulul-'Azm",
    summaryUz: "Qavmlarini 950 yil davomida tinimsiz tavhidga chorlagan va buyuk To'fonda Allohning amri bilan najot kemasini qurgan Ulul-'Azm payg'ambar.",
    miraclesAndKeyFactsUz: [
      "Kecha-yu kunduz, maxfiy va oshkora 950 yil da'vat qildilar.",
      "Iymon keltirganlar va har bir jonivordan bir juftdan kemaga chiqarilib, To'fondan omon qoldilar."
    ],
    moralUz: "Haq yo'lda sabr-matonat va iymon kemasida bo'lish eng katta to'fonlardan ham qutqaradi.",
    quranRefsUz: "Nuh surasi, Hud: 25–48, Ankabut: 14"
  },
  {
    id: 4,
    nameUz: "4. Hud alayhissalom",
    arabicName: "هُود عليه السلام",
    titleBadgeUz: "Od qavmiga yuborilgan",
    summaryUz: "O'z kuch-quvvatlari va baland qasrlariga mag'rur bo'lgan Od qavmini yagona Allohga ibodat qilishga va kibrdan qaytishga chaqirdilar.",
    miraclesAndKeyFactsUz: [
      "Od qavmi: «Bizdan kuchliroq kim bor?» deb kibrga berildi va 7 kecha 8 kun davom etgan bo'ron bilan halok qilindi."
    ],
    moralUz: "Mol-mulk va jismoniy kuch-qudrat Allohga shukr qilinmasa insonni qutqara olmaydi.",
    quranRefsUz: "Hud: 50–60, Fussilat: 15, Haqqo: 6–8"
  },
  {
    id: 5,
    nameUz: "5. Solih alayhissalom",
    arabicName: "صَالِح عليه السلام",
    titleBadgeUz: "Samud qavmi va Mo'jizaviy Tuya",
    summaryUz: "Tog' toshlarini o'yib uylar yasagan Samud qavmiga yuborildilar. Qavm talabi bilan Alloh taolo qattiq qoyatosh ichidan mo'jizaviy Tuyani chiqardi.",
    miraclesAndKeyFactsUz: [
      "Qavm ogohlantirishga qaramay mo'jizaviy tuyani so'yib yubordi va 3 kundan so'ng dahshatli qichqiriq (sayha) bilan halok bo'ldi."
    ],
    moralUz: "Allohning ne'matlari va chegaralariga tajovuz qilish og'ir oqibat keltiradi.",
    quranRefsUz: "Hud: 61–68, Shu'aro: 141–159, Shams: 11–15"
  },
  {
    id: 6,
    nameUz: "6. Ibrohim alayhissalom",
    arabicName: "إِبْرَاهِيم عليه السلام",
    titleBadgeUz: "Xalilulloh (Allohning do'sti) · Ulul-'Azm",
    summaryUz: "Tavhid bayroqdori, Namrud olovidan omon chiqqan, o'g'illari Ismoil a.s. bilan Ka'bai Muazzamani qayta tiklagan payg'ambarlar otasi.",
    miraclesAndKeyFactsUz: [
      "Alloh taolo olovga: «Ey olov, Ibrohimga salqin va salomatlik bo'l!» deb amr qildi (Anbiyo, 69).",
      "Allohning har bir imtihonidan (olov, hijrat, qurbonlik, Ka'ba qurilishi) komil tavakkul bilan o'tdilar."
    ],
    moralUz: "Allohga chin tavakkul qilgan bandaga hatto olov ham zarar yetkaza olmaydi.",
    quranRefsUz: "Baqara: 124–132, Ibrohim surasi, Anbiyo: 51–71"
  },
  {
    id: 7,
    nameUz: "7. Lut alayhissalom",
    arabicName: "لُوط عليه السلام",
    titleBadgeUz: "Ibrohim a.s.ning jiyanlari",
    summaryUz: "Sado'm va G'amora ahliga yuborilib, ularni fahsh va axloqsizlikdan poklikka qaytishga da'vat qildilar.",
    miraclesAndKeyFactsUz: [
      "Itoat etmagan fahsh ahli ustiga tosh yog'dirilib yer osti-ustun qilindi, Lut a.s. va mo'minlar qutqarildi."
    ],
    moralUz: "Iffat va oilaviy poklikni saqlash jamiyat omonligining shartidir.",
    quranRefsUz: "Hud: 77–83, A'rof: 80–84"
  },
  {
    id: 8,
    nameUz: "8. Ismoil alayhissalom",
    arabicName: "إِسْمَاعِيل عليه السلام",
    titleBadgeUz: "Zabihulloh · Zamzam va Ka'ba",
    summaryUz: "Ibrohim va Hojar onamizning to'ng'ich farzandi, go'dakliklarida qadamlarining ostidan Zamzam bulog'i otilib chiqqan, Qurbonlik sinovida yuksak itoat ko'rsatgan payg'ambar.",
    miraclesAndKeyFactsUz: [
      "«Ey otajon, sizga buyurilgan ishni bajaring, inshaalloh meni sabr qiluvchilardan topasiz» dedilar (Soffat, 102).",
      "Otalariga yordam berib Ka'ba devorlarini ko'tardilar va Payg'ambarimiz Muhammad ﷺning ulug' bobolaridan bo'ldilar."
    ],
    moralUz: "Ota-onaga hurmat va Alloh amriga bo'ysunish avlodlarga abadiy baraka keltiradi.",
    quranRefsUz: "Baqara: 125–129, Soffat: 101–107, Maryam: 54–55"
  },
  {
    id: 9,
    nameUz: "9. Ishoq alayhissalom",
    arabicName: "إِسْحَاق عليه السلام",
    titleBadgeUz: "Ibrohim va Sora onamiz farzandi",
    summaryUz: "Ibrohim a.s. va Sora onamizga keksalik chog'larida farishtalar bashorati bilan berilgan muborak payg'ambar.",
    miraclesAndKeyFactsUz: [
      "Shom va Falastin diyorida tavhid da'vatini davom ettirdilar; u zotning naslidan Ya'qub, Yusuf, Muso, Dovud, Sulaymon va Iso alayhimussalomlar chiqdi."
    ],
    moralUz: "Allohning qudratidan hech qachon umid uzilmaydi.",
    quranRefsUz: "Hud: 71–73, Soffat: 112–113"
  },
  {
    id: 10,
    nameUz: "10. Ya'qub alayhissalom",
    arabicName: "يَعْقُوب عليه السلام",
    titleBadgeUz: "Isroil · «Sabrun Jamil» sohibi",
    summaryUz: "Ishoq a.s.ning o'g'li, Yusuf a.s.ning mehribon otasi. O'g'illari Yusufdan ayriliqda yillar davomida «Sabrun Jamil» (Chiroyli sabr) qilib, qayg'ularini faqat Allohga arz etdilar.",
    miraclesAndKeyFactsUz: [
      "Yusuf a.s.ning ko'ylaklari yuzlariga tashlanganda ko'zlari yana nurga to'lib ochildi.",
      "Vafotlari oldidan farzandlaridan faqat yagona Allohga ibodat qilish ahdini oldilar."
    ],
    moralUz: "«Men dardu hasratimni faqat Allohning O'ziga shikoyat qilaman» (Yusuf, 86).",
    quranRefsUz: "Baqara: 132–133, Yusuf surasi"
  },
  {
    id: 11,
    nameUz: "11. Yusuf alayhissalom",
    arabicName: "يُوسُف عليه السلام",
    titleBadgeUz: "Ahsanul-Qasas (Eng go'zal qissa)",
    summaryUz: "Hasad tufayli quduqqa tashlangan, qullikka sotilgan, tuhmatdan zindonda yotgan, ammo iffati, sabri va tush ta'biri ilmi bilan Misr xazinalari vaziri darajasiga ko'tarilgan payg'ambar.",
    miraclesAndKeyFactsUz: [
      "Gunohga chorlanganda: «Ma'azalloh! (Alloh saqlasin!)» deb iffatni zindondan ustun qo'ydilar.",
      "Misrni 7 yillik qurg'oqchilikdan oqilona iqtisodiy reja bilan qutqardilar va o'zlariga zulm qilgan akalarini to'liq kechirdilar."
    ],
    moralUz: "Taqvo va sabr qilgan kishini Alloh quduq va zindon tubidan eng yuksak izzatga olib chiqadi.",
    quranRefsUz: "Yusuf surasi (1–111-oyatlar)"
  },
  {
    id: 12,
    nameUz: "12. Ayyub alayhissalom",
    arabicName: "أَيُّوب عليه السلام",
    titleBadgeUz: "Sabr va Shukr timsoli",
    summaryUz: "Mol-mulk, farzandlar va tana salomatligi bilan og'ir imtihon qilinganda ham 18 yil davomida tili va qalbi zikrdan to'xtamagan sabr namunalari.",
    miraclesAndKeyFactsUz: [
      "«Robbim, menga musibat yetdi, O'zing rahmlilarning eng rahmlisisan!» (Anbiyo, 83) deb duo qildilar.",
      "Alloh u zotga oyoqlari ostidan shifobaxsh suv chiqarib berdi, sog'liqlari va oilalarini ikki barobar ziyoda qilib qaytardi."
    ],
    moralUz: "Bemorlik va musibatda shikoyat emas, chiroyli duo va sabr shifo kalitidir.",
    quranRefsUz: "Anbiyo: 83–84, Sod: 41–44"
  },
  {
    id: 13,
    nameUz: "13. Shu'ayb alayhissalom",
    arabicName: "شُعَيْب عليه السلام",
    titleBadgeUz: "Xatibul-Anbiyo (Payg'ambarlar notig'i)",
    summaryUz: "Madyan va Ayka ahliga yuborilib, ularni tavhidga hamda tarozi va o'lchovdan urib qolmaslikka (halol savdoga) chaqirdilar.",
    miraclesAndKeyFactsUz: [
      "«O'lchov va tarozini to'liq tortinglar, odamlarning narsalarini urib qolmanglar!» (A'rof, 85)."
    ],
    moralUz: "Savdoda tarozi va haqdan urib qolish butun jamiyat barakasini ketkazadi.",
    quranRefsUz: "A'rof: 85–93, Hud: 84–95"
  },
  {
    id: 14,
    nameUz: "14. Muso alayhissalom",
    arabicName: "مُوسَى عليه السلام",
    titleBadgeUz: "Kalimulloh · Ulul-'Azm",
    summaryUz: "Qur'onda eng ko'p zikr qilingan Ulul-'Azm payg'ambar. Alloh u zot bilan bevosita gaplashgan, Tavrot kitobi nozil qilingan va Bani Isroilni Fir'avn zulmidan qutqarganlar.",
    miraclesAndKeyFactsUz: [
      "Asolari ajdahoga aylanishi, qo'llari oppoq nur taratishi va Qizil dengizning ikkiga bo'linishi kabi 9 ta ulug' mo'jiza berildi.",
      "Xizr alayhissalom bilan safarlarida (Kahf surasi) ilohiy taqdir hikmatlari bayon qilindi."
    ],
    moralUz: "Zulm qanchalik ulkan ko'rinmasin, Allohning haq va'dasi oldida mag'lub bo'lishga mahkumdir.",
    quranRefsUz: "Toha, Qasas, Shu'aro, Kahf: 60–82"
  },
  {
    id: 15,
    nameUz: "15. Horun alayhissalom",
    arabicName: "هَارُون عليه السلام",
    titleBadgeUz: "Muso a.s.ning akalari va vaziri",
    summaryUz: "Muso a.s.ning duolari bilan u zotga yordamchi va payg'ambar qilib berilgan, fasohatli va muloyim payg'ambar.",
    miraclesAndKeyFactsUz: [
      "Fir'avn saroyida va Sinay tog'i safarida Muso a.s.ning eng yaqin tayanchi bo'ldilar."
    ],
    moralUz: "Aka-uka va birodarlarning haq yo'lda yelka-yelka turishi eng katta ne'matdir.",
    quranRefsUz: "Toha: 29–36, Qasas: 34–35"
  },
  {
    id: 16,
    nameUz: "16. Zul-Kifl alayhissalom",
    arabicName: "ذُو الْكِفْل عليه السلام",
    titleBadgeUz: "Ahdiga vafodor va sabrli",
    summaryUz: "Kunduzi ro'za tutish, kechasi ibodat qilish va odamlar orasida g'azablanmay adolat bilan hukm qilish kafiligini (ahdini) olib, unga to'liq vafo qilgan solih payg'ambar.",
    miraclesAndKeyFactsUz: [
      "Qur'onda Ismoil va Idris a.s. bilan bir qatorda sabr va solihlikda maqtalganlar."
    ],
    moralUz: "Berilgan va'da va olingan mas'uliyatni g'azablanmasdan ado etish ulug' fazilatdir.",
    quranRefsUz: "Anbiyo: 85–86, Sod: 48"
  },
  {
    id: 17,
    nameUz: "17. Dovud alayhissalom",
    arabicName: "دَاوُود عليه السلام",
    titleBadgeUz: "Zabur sohibi · Adolatli podshoh",
    summaryUz: "Ham payg'ambarlik, ham podshohlik berilgan, Zabur kitobi nozil qilingan, bir kun ro'za tutib bir kun og'iz ochgan (eng afzal nafl ro'za) ulug' zot.",
    miraclesAndKeyFactsUz: [
      "Zabur tilovat qilganlarida tog'lar va qushlar u zot bilan birga tasbeh aytar edi.",
      "Temir u zotning qo'llarida xamirdek yumshatilgan bo'lib, podshoh bo'lsalar ham o'z qo'l mehnatlari (sovut yasash) orqasidan kun ko'rar edilar."
    ],
    moralUz: "Eng pokiza rizq — insonning o'z halol mehnati bilan topgan luqmasidir.",
    quranRefsUz: "Saba': 10–11, Sod: 17–26"
  },
  {
    id: 18,
    nameUz: "18. Sulaymon alayhissalom",
    arabicName: "سُلَيْمَان عليه السلام",
    titleBadgeUz: "Dovud a.s.ning o'g'li · Hikmat va Mulk",
    summaryUz: "Alloh taolo u zotga shamolni, jinlarni bo'ysundirib bergan va qushlar hamda chumolilar tilini tushunish ne'matini ato etgan payg'ambar-podshoh.",
    miraclesAndKeyFactsUz: [
      "Chumolilar vodiysidan o'tayotib bitta chumolining so'zini eshitib tabassum qildilar va kichik jonzotga ham ozor bermaslik uchun qo'shinni to'xtatdilar (Naml, 18–19).",
      "Saba' malikasi Bilqis va uning qavmini yagona Allohga iymon keltirishiga sabab bo'ldilar."
    ],
    moralUz: "Har qancha boylik va mansab berilsa ham: «Bu Robbimning men shukr qilamanmi-yo'qmi deb sinash uchun bergan fazlidir» deyish kerak.",
    quranRefsUz: "Naml: 15–44, Saba': 12–14"
  },
  {
    id: 19,
    nameUz: "19. Ilyos alayhissalom",
    arabicName: "إِلْيَاس عليه السلام",
    titleBadgeUz: "Ba'alabak ahliga yuborilgan",
    summaryUz: "Shom diyorida «Ba'l» nomli oltin sanamga sig'inayotgan qavmni yagona Yaratuvchiga qaytishga da'vat qilgan payg'ambar.",
    miraclesAndKeyFactsUz: [
      "Qur'onda «Ilyosga salom bo'lsin! Biz chiroyli amal qiluvchilarni shunday mukofotlaymiz» deb ulug'langanlar."
    ],
    moralUz: "Botil odatlar ko'paysa ham haqiqatni chiroyli hikmat bilan eslatish lozim.",
    quranRefsUz: "An'om: 85, Soffat: 123–132"
  },
  {
    id: 20,
    nameUz: "20. Al-Yasa' alayhissalom",
    arabicName: "الْيَسَع عليه السلام",
    titleBadgeUz: "Ilyos a.s.ning davomchilari",
    summaryUz: "Ilyos alayhissalomdan so'ng Bani Isroilga Tavrot hukmlari asosida yo'l ko'rsatgan va Qur'onda «tanlab olingan eng yaxshi zotlardan» deb ta'riflangan payg'ambar.",
    miraclesAndKeyFactsUz: [
      "Ustozlari Ilyos a.s. boshlagan tavhid va adolat yo'lini sadoqat bilan davom ettirdilar."
    ],
    moralUz: "Ustoz va solih ajdodlarning xayrli ishlarini davom ettirish baraka manbaidir.",
    quranRefsUz: "An'om: 86, Sod: 48"
  },
  {
    id: 21,
    nameUz: "21. Yunus alayhissalom",
    arabicName: "يُونُس عليه السلام",
    titleBadgeUz: "Zun-Nun (Hut / Baliq sohibi)",
    summaryUz: "Ninava (Mosul) ahliga yuborilgan payg'ambar. Uch qavat zulmat (tun, dengiz tubi va ulkan baliq qorni) ichida eng ulug' tasbeh duosini o'qib najot topdilar.",
    miraclesAndKeyFactsUz: [
      "«Laa ilaaha illaa Anta subhaanaka inniy kuntu minaz-zoolimiyn» tasbehini tinimsiz aytdilar va Alloh u zotni g'amdan qutqardi (Anbiyo, 87–88).",
      "U zotning 100 000 dan ortiq qavmi chin tavba qilib, azobdan qutulgan yagona qavm bo'ldi."
    ],
    moralUz: "Qanday og'ir tanglik bo'lmasin, Yunus a.s. tasbehi («Laa ilaaha illaa Anta...») mo'min uchun najot kalitidir.",
    quranRefsUz: "Yunus: 98, Anbiyo: 87–88, Soffat: 139–148"
  },
  {
    id: 22,
    nameUz: "22. Zakariyo alayhissalom",
    arabicName: "زَكَرِيَّا عليه السلام",
    titleBadgeUz: "Maryam onamizning homiylari",
    summaryUz: "Quddusdagi Baytul-Maqdisda xizmat qilgan, Maryam onamizga homiylik qilgan va keksalikda Allohdan solih farzand so'rab duo qilgan payg'ambar.",
    miraclesAndKeyFactsUz: [
      "Mehrobda namoz o'qiyotganlarida farishtalar u zotga Yahyo ismli solih o'g'il xushxabarini berdilar."
    ],
    moralUz: "Samimiy va mahfiy qilingan duo hatto imkonsiz ko'ringan eshiklarni ham ochadi.",
    quranRefsUz: "Oli Imron: 37–41, Maryam: 2–11"
  },
  {
    id: 23,
    nameUz: "23. Yahyo alayhissalom",
    arabicName: "يَحْيَى عليه السلام",
    titleBadgeUz: "Yoshlikdan hikmat va taqvo sohibi",
    summaryUz: "Zakariyo a.s.ning o'g'li. Bolalik chog'laridayoq Alloh u zotga Chuqur hikmat, rahm-shafqat, poklik va ota-onaga yuksak yaxshilik qilish fazilatini berdi.",
    miraclesAndKeyFactsUz: [
      "«Ey Yahyo, Kitobni (Tavrotni) mahkam tut! — dedik va unga go'dakligidayoq hikmat ato etdik» (Maryam, 12).",
      "Haqiqat va shariat hukmini himoya qilish yo'lida shahid bo'ldilar."
    ],
    moralUz: "Yoshlikdan ilm, taqvo va ota-onaga mehrli bo'lish Alloh huzurida eng sevimli sifatdir.",
    quranRefsUz: "Maryam: 12–15, Oli Imron: 39"
  },
  {
    id: 24,
    nameUz: "24. Iso alayhissalom",
    arabicName: "عِيسَى عليه السلام",
    titleBadgeUz: "Masih · Kalimatulloh · Ulul-'Azm",
    summaryUz: "Pokiza Maryam binti Imrondan otasiz, Allohning «Bo'l!» degan kalimasi bilan mo'jizaviy dunyoga kelgan, Injil kitobi berilgan va Payg'ambarimiz Ahmad (Muhammad ﷺ) kelishlari haqida bashorat bergan Ulul-'Azm payg'ambar.",
    miraclesAndKeyFactsUz: [
      "Beshikda go'dak hollarida tilga kirib: «Men Allohning bandasiman. U menga Kitob berdi va meni payg'ambar qildi» dedilar (Maryam, 30).",
      "Allohning izni bilan tug'ma ko'r va pes kasallarini davoladilar, loydan qush yasab puflaganlarida Alloh izni bilan uchib ketdi.",
      "Alloh taolo u zotni dushmanlar makridan saqlab, O'z huzuriga — osmonga tirik ko'tardi."
    ],
    moralUz: "Iso alayhissalom Allohning ulug' bandasi va rasulidir; u zot kamtarlik, rahm-shafqat va tavhidga chorlaganlar.",
    quranRefsUz: "Oli Imron: 45–59, Maryam: 16–36, Saf: 6"
  },
  {
    id: 25,
    nameUz: "25. Muhammad Mustafo ﷺ",
    arabicName: "مُحَمَّدٌ رَسُولُ اللَّهِ ﷺ",
    titleBadgeUz: "Xotamul-Anbiyo · Rahmatan lil-'Alamin",
    summaryUz: "Barcha payg'ambarlarning yakunlovchisi (Xotamun-Nabiyyin), butun olamlarga rahmat qilib yuborilgan va qiyomatga qadar o'zgarmas mo'jiza — Qur'oni Karim nozil qilingan sevikli Payg'ambarimiz ﷺ.",
    miraclesAndKeyFactsUz: [
      "Eng buyuk va boqiy mo'jizalari — Qur'oni Karimdir.",
      "Oyning ikkiga bo'linishi (Inshiqoqul-Qamar), Isro va Me'roj, barmoqlari orasidan suv otilib chiqishi va go'zal axloqlari («Albatta, Siz buyuk xulq uzradirsiz» — Qalam, 4) u zotning haq payg'ambarlik dalillaridir."
    ],
    moralUz: "Payg'ambarimiz ﷺni sevish — u zotning sunnatlariga ergashish, go'zal xulqli bo'lish va ko'p salavot aytish bilan namoyon bo'ladi.",
    quranRefsUz: "Anbiyo: 107, Ahzob: 40, Qalam: 4"
  }
];
