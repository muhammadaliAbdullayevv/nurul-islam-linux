export type FiqhCategory = 'tahorat' | 'namoz' | 'roza' | 'zakot_savdo' | 'oila_kundalik';

export type FiqhRulingTone = 'valid' | 'breaks' | 'wajib' | 'sunnah' | 'caution';

export interface FiqhQAItem {
  id: string;
  category: FiqhCategory;
  rulingTone: FiqhRulingTone;
  rulingBadge: string;
  question: string;
  shortAnswer: string;
  details: string[];
  source: string;
  tags: string[];
}

export const FIQH_CATEGORIES: Array<{
  id: 'all' | FiqhCategory;
  labelUz: string;
  labelRu: string;
  labelEn: string;
}> = [
  { id: 'all', labelUz: 'Barchasi', labelRu: 'Все', labelEn: 'All' },
  { id: 'tahorat', labelUz: "Tahorat va G'usl", labelRu: 'Тахарат и Гусль', labelEn: 'Wudu & Ghusl' },
  { id: 'namoz', labelUz: 'Namoz va Jamoat', labelRu: 'Намаз и Джамаат', labelEn: 'Prayer & Congregation' },
  { id: 'roza', labelUz: "Ro'za", labelRu: 'Пост (Ураза)', labelEn: 'Fasting' },
  { id: 'zakot_savdo', labelUz: 'Zakot va Halol kasb', labelRu: 'Закят и Торговля', labelEn: 'Zakat & Trade' },
  { id: 'oila_kundalik', labelUz: 'Kundalik va Oila', labelRu: 'Семья и Быт', labelEn: 'Family & Daily Life' },
];

export const FIQH_QA_LIST: FiqhQAItem[] = [
  // ======================== 1. TAHORAT VA G'USL ========================
  {
    id: 'tahorat-blood',
    category: 'tahorat',
    rulingTone: 'breaks',
    rulingBadge: 'Oqsa tahorat buziladi',
    question: "Badandan qon yoki yiring chiqsa tahorat buziladimi?",
    shortAnswer: "Hanafiy mazhabida qon yoki yiring yara joyidan chetga oqib chiqsa, tahorat buziladi. Agar faqat ko'rinsa-yu, joyidan oqmasa, buzilmaydi.",
    details: [
      "Igna uchidek qon chiqib, o'z o'rnidan yon-atrofga tarqalmasa (oqmasa), tahorat ketmaydi.",
      "Tish qonaganda qon tupukdan ko'p bo'lsa (qizil rang ustun bo'lsa) yoki teng bo'lsa, tahoratni buzadi; agar tupuk ko'p bo'lib, qon rangi juda kam (sarg'ish) bo'lsa, buzmaydi.",
      "Yaradan oqqan qonni paxta bilan artib turganda, paxta olib tashlansa oqadigan darajada ko'p bo'lsa, tahorat buziladi."
    ],
    source: "Hidoya, Muxtasarul Viqoya (Tahorat bobi)",
    tags: ['qon', 'tish', 'yiring', 'yara', 'tahorat']
  },
  {
    id: 'tahorat-nail-polish-cream',
    category: 'tahorat',
    rulingTone: 'caution',
    rulingBadge: "Suv o'tishi shart",
    question: "Tirnoq bo'yog'i (lak) yoki qo'l kremi tahoratga to'sqinlik qiladimi?",
    shortAnswer: "Suv o'tkazmaydigan qatlam hosil qiluvchi tirnoq bo'yog'i (lak) tahorat va g'uslga monelik qiladi. Oddiy singib ketadigan krem esa zarar qilmaydi.",
    details: [
      "Tahorat va g'uslda yuvilishi farz bo'lgan a'zolarning har bir nuqtasiga suv tegishi shart.",
      "Oddiy lak, elim, xamir yoki qalin bo'yoq tirnoq va teri ustida suv o'tkazmas parda hosil qilgani uchun uni ketkazib keyin tahorat olinadi.",
      "Xina (tabiiy xina rangi) va teriga singib ketadigan oddiy yog' yoki namlantiruvchi krem suv yetishiga to'sqinlik qilmaydi."
    ],
    source: "Fatvoi Olamgiriya, Raddul Muhtor",
    tags: ['lak', 'krem', 'tirnoq', 'xina', 'kosmetika']
  },
  {
    id: 'tahorat-mahsi-socks',
    category: 'tahorat',
    rulingTone: 'valid',
    rulingBadge: 'Shartlari bilan joiz',
    question: "Mahsi yoki paypoqqa mash tortishning shartlari nima?",
    shortAnswer: "Charm mahsiga mash tortish joiz. Oddiy yupqa ip yoki sintetik paypoqqa mash tortish Hanafiy mazhabida joiz emas.",
    details: [
      "1-shart: Mahsi to'liq tahorat ustiga (oyoq yuvilgandan so'ng) kiyilgan bo'lishi kerak.",
      "2-shart: Mahsi to'piqlarni yopib turishi va yirtig'i oyoqning kichik barmog'idan uch barobar katta bo'lmasligi lozim.",
      "3-shart: Muqim (uyda turgan) kishi 1 kecha-kunduz (24 soat), musofir esa 3 kecha-kunduz (72 soat) mash tortishi mumkin. Muddat tahorat birinchi marta buzilgan vaqtdan boshlanadi.",
      "Oddiy yupqa paypoqqa mash tortib bo'lmaydi; faqat suv o'tkazmaydigan, bog'ichsiz tikka turadigan va bir necha chaqirim yurishga chidaydigan qalin maxsus paypoq-mahsigagina ruxsat etilgan."
    ],
    source: "Muxtasarul Viqoya, Maroqil Faloh",
    tags: ['mahsi', 'paypoq', 'mash', 'musofir', 'tahorat']
  },
  {
    id: 'tahorat-sleep',
    category: 'tahorat',
    rulingTone: 'breaks',
    rulingBadge: 'Yonboshlab uxlasa buziladi',
    question: "Qanday holatda uxlash tahoratni buzadi?",
    shortAnswer: "Chalqancha, yuztuban yoki yonboshlab yotib uxlash, yoxud biror narsaga suyanib (u olinsa yiqiladigan darajada) uxlash tahoratni buzadi.",
    details: [
      "Namozda tik turgan, ruku'da, sajdada yoki o'tirgan holatda (dumbasi yerga mustahkam tegib turgan holda) bir oz mudrab qolsa, tahorat buzilmaydi.",
      "Ammo biror devor yoki o'rindiq suyanchig'iga suyanib qattiq uxlab qolsa va suyanchiq olinsa yiqiladigan holatda bo'lsa, tahorat ketadi.",
      "Hushidan ketish esa har qanday holatda tahoratni buzadi."
    ],
    source: "Hidoya, Nurul Izoh",
    tags: ['uyqu', 'uxlash', 'mudrash', 'tahorat']
  },
  {
    id: 'tahorat-vomit',
    category: 'tahorat',
    rulingTone: 'breaks',
    rulingBadge: "Og'iz to'lsa buziladi",
    question: "Qayt qilish (qusish) tahoratni buzadimi?",
    shortAnswer: "Agar qayt og'iz to'la miqdorda bo'lsa (og'izni zo'rg'a tutib turadigan darajada), tahoratni buzadi. Ozgina kekirish yoki og'iz to'lmagan qayt buzmaydi.",
    details: [
      "Yeyilgan ovqat, ichilgan suv, safro yoki quyuq qon og'iz to'lib qayt qilinsa, tahorat sinadi.",
      "Balg'am (shilimshiq) qayt qilinsa, og'iz to'la bo'lsa ham Imom Abu Hanifa va Imom Muhammad nazdida tahoratni buzmaydi.",
      "Ozgina-ozginadan bir sabab ( bir xil ko'ngil aynishi) bilan bir necha marta qayt qilib, jamlanganda og'iz to'ladigan miqdorga yetsa, tahorat buziladi."
    ],
    source: "Muxtasarul Viqoya, Badoye'us Sanoye'",
    tags: ['qusish', 'qayt', 'balgam', 'tahorat']
  },
  {
    id: 'tahorat-ghusl-fard',
    category: 'tahorat',
    rulingTone: 'wajib',
    rulingBadge: '3 ta farzi bor',
    question: "G'uslning farzlari nechta va u qanday qilinadi?",
    shortAnswer: "Hanafiy mazhabida g'uslning farzi 3 ta: 1) Og'izni g'arg'ara qilib chayish; 2) Burunga achishtirguncha suv tortish; 3) Butun badanni igna uchidek quruq joy qoldirmay yuvish.",
    details: [
      "G'uslni niyat va «Bismillah» bilan boshlab, avval qo'llarni, avrat joylarni yuvish va namozdagidek tahorat olish sunnatdir.",
      "So'ngra boshga, keyin o'ng yelkaga va chap yelkaga 3 martadan suv quyib butun tanani ishqalab yuviladi.",
      "Ayollarning sochi o'rilgan bo'lsa, sochning tagiga (bosh terisiga) suv tegsa kifoya — o'rilgan sochni yechish shart emas. Ammo soch yoyilgan bo'lsa, to'liq yuvilishi shart.",
      "G'usl qilgan kishi alohida tahorat olmasdan namoz o'qishi mumkin, chunki g'usl ichiga tahorat ham kiradi."
    ],
    source: "Hidoya, Muxtasarul Viqoya (G'usl bobi)",
    tags: ['gusl', 'farz', 'soch', 'poklik']
  },
  {
    id: 'tahorat-tayammum',
    category: 'tahorat',
    rulingTone: 'valid',
    rulingBadge: 'Uzrli holatda joiz',
    question: "Qachon suv o'rniga tayammum qilish mumkin va u qanday bajariladi?",
    shortAnswer: "Suv topilmaganda (taxminan 1.8 km masofada suv bo'lmasa) yoki suv ishlatish kasallikni og'irlashtirishi aniq bo'lganda toza tuproq jinsiga tayammum qilinadi.",
    details: [
      "1. Poklanish va namoz o'qishni niyat qilib, ikki kaftni toza tuproq, qum, tosh yoki changli devorga urib, yuzga to'liq mash tortiladi.",
      "2. Ikkinchi marta kaftlarni tuproq jinsiga urib, ikkala qo'lga tirsaklari bilan qo'shib mash tortiladi.",
      "Tayammum ham tahorat, ham g'usl o'rniga o'tadi. Suv topilishi yoki kasallik tuzalishi bilan tayammum o'z kuchini yo'qotadi."
    ],
    source: "Muxtasarul Viqoya (Tayammum bobi)",
    tags: ['tayammum', 'suv', 'kasal', 'safar']
  },

  // ======================== 2. NAMOZ VA JAMOAT ========================
  {
    id: 'namoz-sajdai-sahv',
    category: 'namoz',
    rulingTone: 'wajib',
    rulingBadge: 'Vojib kechiksa qilinadi',
    question: "Sajdai sahv qachon va qanday qilinadi?",
    shortAnswer: "Namozda farz amal kechiktirilsa yoki vojib amal unutib tark etilsa, oxirgi qa'dada «Attahiyyot»dan so'ng o'ng tomonga salom berib, 2 marta sajda qilinadi.",
    details: [
      "Sajdai sahv sabablari: Fotihadan keyin zam surani unutish, Vojib bo'lgan 1-qa'dada o'tirmay 3-rakatga turib ketish, Vitrda Qunut duosini unutish, yoki rakatlar sonida ikkilanib qolish.",
      "Tartibi: Oxirgi qa'dada faqat «Attahiyyot» o'qilib, o'ng tomonga bir marta salom beriladi va «Allohu akbar» deb 2 marta sajda qilinadi.",
      "So'ngra qayta o'tirib: «Attahiyyot», «Salavot» va «Robbana atina...» duolari o'qilib, o'ng va chapga salom berib namoz tugatiladi.",
      "Jamoat namozida imomga ergashgan kishi o'zi xato qilsa sajdai sahv qilmaydi; faqat imom xato qilsa, imom bilan birga qiladi."
    ],
    source: "Hidoya, Raddul Muhtor (Sajdai sahv bobi)",
    tags: ['sajdai sahv', 'xato', 'unutish', 'rakat', 'vojib']
  },
  {
    id: 'namoz-masbuq',
    category: 'namoz',
    rulingTone: 'wajib',
    rulingBadge: 'Masbuq qoidasi',
    question: "Jamoat namoziga kechikib (2, 3 yoki 4-rakatda) qo'shilgan kishi (masbuq) namozni qanday davom ettiradi?",
    shortAnswer: "Imomga ruku'da yoki ruku'dan oldin yetishgan kishi o'sha rakatga ulgurgan hisoblanadi. Imom salom berganda masbuq salom bermay o'rnidan turib, o'tkazib yuborgan rakatlarini to'ldiradi.",
    details: [
      "Agar imomga ruku'da yetishsangiz: tik turgan holda «Allohu akbar» deb takbiri tahrima aytib, keyin ruku'ga egilasiz — bu rakat sizga hisoblanadi.",
      "Agar imom ruku'dan bosh ko'targandan keyin qo'shilsangiz, u rakat hisoblanmaydi va imom salom bergach qayta o'qiysiz.",
      "Imom ikki tomonga salom bergach, masbuq salom bermasdan «Allohu akbar» deb turadi, «Subhanakallohumma», «A'uzu-Bismillah», «Fotiha» va «Zam sura» bilan yetishmagan rakatlarini yakka o'zi o'qib tugatadi."
    ],
    source: "Muxtasarul Viqoya, Fatvoi Olamgiriya",
    tags: ['masbuq', 'jamoat', 'kechikish', 'imom', 'ruku']
  },
  {
    id: 'namoz-qunut-substitute',
    category: 'namoz',
    rulingTone: 'valid',
    rulingBadge: "O'rniga duo o'qiladi",
    question: "Vitr namozida Qunut duosini hali yodlamagan kishi nima o'qiydi?",
    shortAnswer: "Qunut duosini to'liq yodlagunicha uning o'rniga «Robbana atina fid-dunya hasanatan va fil-axiroti hasanatan va qina 'azaban-nar» duosini yoki 3 marta «Allohummag'fir liy» deb o'qishi joiz.",
    details: [
      "Vitr namozining 3-rakatida Fotiha va zam suradan so'ng «Allohu akbar» deb qo'llar quloq barobarida ko'tarilib bog'lanadi va Qunut duosi o'qiladi.",
      "Hali yodlay olmagan kishi Qunut o'rniga hech narsa o'qimay jim turmasligi kerak, balki «Robbana atina...» oyatini yoki 3 marta «Yo Robbi» / «Allohummag'fir liy» (Allohim, meni mag'firat qil) deb aytishi vojib o'rniga o'tadi.",
      "Shu bilan birga Qunut duosini tezroq yodlashga harakat qilish lozim."
    ],
    source: "Fatvoi Olamgiriya, Maroqil Faloh",
    tags: ['vitr', 'qunut', 'duo', 'yodlash']
  },
  {
    id: 'namoz-doubt-rakat',
    category: 'namoz',
    rulingTone: 'caution',
    rulingBadge: "Gumon ustuniga amal qilinadi",
    question: "Namozda 3-rakatdamanmi yoki 4-rakatdami deb ikkilanib qolsa nima qilinadi?",
    shortAnswer: "Agar bunday holat ko'p uchrab tursa, ko'ngli ko'proq moyil bo'lgan (g'olib gumon) tomonga amal qiladi. Agar birinchi marta bo'lsa, namozni yangidan boshlaydi.",
    details: [
      "Agar ikkilanishda bir tomonga ham ko'ngli moyil bo'lmasa (50/50 bo'lib qolsa), ozrog'ini (masalan, 3 va 4 orasida ikkilansa — 3-rakatni) oladi.",
      "Bunda ehtiyotan 3-rakatda ham (chunki u aslida 4-rakat bo'lishi mumkin) qa'dada o'tirib «Attahiyyot» o'qiydi, keyin yana 1 rakat qo'shib oxirida Sajdai sahv qiladi."
    ],
    source: "Hidoya, Nurul Izoh",
    tags: ['rakat', 'ikkilanish', 'gumon', 'unutish']
  },
  {
    id: 'namoz-makruh-times',
    category: 'namoz',
    rulingTone: 'breaks',
    rulingBadge: '3 ta vaqtda namoz joiz emas',
    question: "Kun davomida qaysi vaqtlarda namoz o'qish va qazo o'qish mumkin emas?",
    shortAnswer: "Quyosh chiqayotgan vaqtda (~15-20 daqiqa), quyosh tikkaga kelgan qiyom vaqtida (Peshindan ~10 daqiqa oldin) va quyosh botayotgan vaqtda har qanday namoz (farz, qazo, nafl) o'qish harom/makruhdir.",
    details: [
      "1. Quyosh chiqishni boshlagandan to nayza bo'yi ko'tarilguncha (taxminan 15–20 daqiqa).",
      "2. Quyosh qoq tikkaga (zenitga) kelganda — Peshin kirishidan 10 daqiqa avval.",
      "3. Quyosh sarg'ayib botishga yaqinlashganda (Shomdan ~20 daqiqa oldin) — bu vaqtda faqatgina o'sha kunning Asr farzinigina o'qib olish mumkin, qazo va nafl o'qilmaydi.",
      "Bomdod namozi o'qilgandan to quyosh chiqquncha va Asr o'qilgandan to quyosh botguncha nafl namoz o'qish makruh, ammo qazo namozlarini (quyosh botish arafasidagi 20 daqiqadan tashqari) o'qish mumkin."
    ],
    source: "Muxtasarul Viqoya (Namoz vaqtlari bobi)",
    tags: ['makruh', 'vaqt', 'qazo', 'quyosh', 'asr', 'bomdod']
  },
  {
    id: 'namoz-travel-qasr',
    category: 'namoz',
    rulingTone: 'wajib',
    rulingBadge: '4 rakatli farzlar 2 rakat o\'qiladi',
    question: "Safarda (musofirlikda) namoz qachondan qasr (qisqartirib) o'qiladi?",
    shortAnswer: "O'z shahri (yoki qishlog'i) chegarasidan ~90 km va undan uzoq masofani ko'zlab yo'lga chiqqan kishi shahar uylaridan uzilishi bilanoq musofir bo'ladi va 4 rakatli farzlarni 2 rakat qilib o'qiydi.",
    details: [
      "Hanafiy mazhabida safarda 4 rakatli farz namozlarni (Peshin, Asr, Xufton) 2 rakat qilib o'qish ruxsatgina emas, balki VOJIBdir.",
      "Bomdodning 2 rakat farzi va Shomning 3 rakat farzi hamda Vitrning 3 rakati qisqartirilmaydi.",
      "Shoshilinch yo'lda bo'lmasa, sunnat namozlar to'liq o'qiladi; yo'lda shoshilinch holatda (Bomdod sunnatidan tashqari) sunnatlarni tark etishda gunoh yo'q.",
      "Borilgan joyda 15 kun yoki undan ko'p turishni niyat qilsa, muqim bo'lib namozlarni to'liq 4 rakat o'qiydi; 15 kundan kam tursa, musofir hukmida qoladi."
    ],
    source: "Hidoya, Fatvoi Olamgiriya (Musofir namozi bobi)",
    tags: ['safar', 'musofir', 'qasr', '90 km', 'masofa']
  },

  // ======================== 3. RO'ZA ========================
  {
    id: 'roza-injection-drops',
    category: 'roza',
    rulingTone: 'valid',
    rulingBadge: "Mushak va tomir ukoli buzmaydi",
    question: "Ro'zador kishi ukol olsa yoki ko'ziga dori tomizsa ro'zasi ochiladimi?",
    shortAnswer: "Teri ostiga va mushakka qilinadigan dori ukollari hamda ko'zga tomiziladigan dori ro'zani buzmaydi. Ammo burun va quloqqa dori tomizish ro'zani buzadi.",
    details: [
      "Ko'zdan dimog' va oshqozonga tabiiy ochiq yo'l bo'lmagani uchun ko'z tomchisi (hatto ta'mi tomoqda sezilsa ham) ro'zani buzmaydi.",
      "Davolanish maqsadida mushak (yonbosh) yoki teri ostiga olinadigan ukol (shu jumladan insulin) ro'zani ochmaydi. Oziqlantiruvchi kapelnitsa (glyukoza va vitaminli osma ukol) esa ro'za ma'nosiga zid bo'lgani uchun iftordan keyinga qoldiriladi.",
      "Burunga va quloq pardasi teshik bo'lsa quloqqa suyuq dori tomizish ichkariga yetib borgani sababli ro'zani buzadi (faqat qazo tutiladi)."
    ],
    source: "O'zbekiston Musulmonlari Idorasi Fatvo markazi, Raddul Muhtor",
    tags: ['ukol', 'ko\'z tomchisi', 'burun', 'dori', 'roza']
  },
  {
    id: 'roza-toothpaste-miswak',
    category: 'roza',
    rulingTone: 'caution',
    rulingBadge: 'Misvok sunnat, pasta makruh',
    question: "Ro'zada tish pastasi yoki misvok bilan tish yuvish mumkinmi?",
    shortAnswer: "Misvok yoki pastasiz tish cho'tkasi ishlatish sunnat va ro'zani buzmaydi. Tish pastasi bilan yuvish esa tomoqdan o'tib ketish xavfi borligi uchun makruh (agar ichga ketsa ro'za buziladi).",
    details: [
      "Tishni tish pastasi bilan saharlik vaqti tugamasdan oldin yuvib olish eng afzal yo'ldir.",
      "Kunduzi misvok yoki suvda namlangan toza tish cho'tkasini ishlatish hech qanday zarar qilmaydi.",
      "Tahoratda og'iz va burunni chayganda ro'zador kishi g'arg'ara qilmasdan ehtiyot bo'lib chayadi."
    ],
    source: "Fatvoi Olamgiriya, Maroqil Faloh",
    tags: ['tish', 'pasta', 'misvok', 'roza']
  },
  {
    id: 'roza-forgetful-eating',
    category: 'roza',
    rulingTone: 'valid',
    rulingBadge: "Unutib yesa ro'za buzilmaydi",
    question: "Ro'zador ekanini unutib biror narsa yeb yoki ichib qo'ysa nima bo'ladi?",
    shortAnswer: "Ro'zadorligini butunlay unutib ovqat yeb yoki suv ichib qo'ysa, ro'zasi buzilmaydi. Eslagani zahoti og'zidagi luqmani chiqarib tashlab, ro'zasini davom ettiradi.",
    details: [
      "Payg'ambarimiz ﷺ: «Kim ro'zador holida unutib yesa yoki ichsa, ro'zasini oxirigacha yetkazsin. Zero uni Alloh yedirib-ichiribdi», deganlar (Imom Buxoriy va Muslim).",
      "Ammo ro'zadorligini eslagandan keyin og'zidagi narsani yutib yuborsa, ro'zasi buziladi."
    ],
    source: "Sahihi Buxoriy (1933-hadis), Hidoya",
    tags: ['unutish', 'yeb qoyish', 'suv', 'roza']
  },

  // ======================== 4. ZAKOT VA HALOL KASB ========================
  {
    id: 'zakot-who-receives',
    category: 'zakot_savdo',
    rulingTone: 'wajib',
    rulingBadge: 'Ota-ona va farzandga berilmaydi',
    question: "Zakot va fitr sadaqasini qaysi qarindoshlarga berish mumkin va kimga mumkin emas?",
    shortAnswer: "Zakotni o'z ota-onasiga (bobo-buvisiga), o'z farzandlariga (nabiralariga) va turmush o'rtog'iga berish joiz emas. Ammo muhtoj aka-uka, opa-singil, amaki, tog'a, amma va xolalarga berish ikki hissa savoblidir.",
    details: [
      "Zakot berilishi uchun oluvchi kishi nisob miqdoridan kam molga ega (faqir yoki miskin) bo'lishi va zakot moliga to'liq egalik qilishi (tamlik) shart.",
      "Yaqin qarindoshlardan aka-uka, opa-singil, ularning farzandlari, amaki-amma, tog'a-xolalar muhtoj bo'lsa, zakotni avvalo ularga berish ham zakot, ham silai rahm savobini beradi.",
      "Masjid qurilishiga zakot pulidan to'g'ridan-to'g'ri berilmaydi (chunki tamlik sharti topilmaydi); masjidga oddiy nafl ehson va sadaqai joriya qilinadi."
    ],
    source: "Hidoya, Muxtasarul Viqoya (Zakot bobi)",
    tags: ['zakot', 'fitr', 'qarindosh', 'ota-ona', 'masjid']
  },
  {
    id: 'savdo-nasiya-installment',
    category: 'zakot_savdo',
    rulingTone: 'valid',
    rulingBadge: 'Narx aniq kelishilsa halol',
    question: "Nasiyaga (bo'lib to'lashga) naqd narxidan qimmatroq sotish halolmi?",
    shortAnswer: "Savdo vaqtida tovarning yakuniy narxi va to'lov muddati aniq belgilab olinsa, nasiya narxining naqd narxdan qimmatroq bo'lishi Hanafiy mazhabida haloldir.",
    details: [
      "1-shart: Savdo bitimi tuzilayotgan paytda xaridorga «naqdga buncha, 6 oy nasiyaga buncha» deb, ikkisidan bittasi aniq tanlanishi va qat'iy narx belgilanishi shart.",
      "2-shart: Agar xaridor oylik to'lovni kechiktirib qo'ysa, kelishilgan narx ustiga penya (jarima foizi) qo'shish qat'iyan harom (ribo) hisoblanadi.",
      "3-shart: Sotuvchi o'z mulkiga kirmagan (hali sotib olmagan) narsani sotishi joiz emas."
    ],
    source: "Hidoya, Muomalot fiqhi (Bay' bobi)",
    tags: ['nasiya', 'bo\'lib to\'lash', 'savdo', 'ribo', 'penya']
  },

  // ======================== 5. KUNDALIK VA OILA ========================
  {
    id: 'oila-quran-gift-deceased',
    category: 'oila_kundalik',
    rulingTone: 'sunnah',
    rulingBadge: "Savobi marhumga yetib boradi",
    question: "O'tgan yaqinlarimiz haqqiga Qur'on tilovat qilib va sadaqa berib savobini bag'ishlash yetib boradimi?",
    shortAnswer: "Ahli sunna val jamoa va Hanafiy mazhabi e'tiqodiga ko'ra, o'qilgan Qur'on tilovati, berilgan sadaqa, istig'for va duolar savobi marhumlarga to'liq yetib boradi.",
    details: [
      "Fotiha, Ixlos (3 yoki 11 marta), Mulk, Yosin suralarini o'qib: «Allohim, ushbu tilovatdan hosil bo'lgan savobni ota-onam va o'tgan yaqinlarim ruhiga yetkazgin», deb duo qilinadi.",
      "Marhumning nomidan muhtojlarga taom ulashish, suv chiqarish, masjid va ilm yo'liga ehson qilish eng ulug' sadaqai joriyadir."
    ],
    source: "Aqoidi Nasafiya sharhi, Raddul Muhtor",
    tags: ['marhum', 'tilovat', 'savob', 'ota-ona', 'sadaqa']
  },
  {
    id: 'oila-oath-kaffarah',
    category: 'oila_kundalik',
    rulingTone: 'wajib',
    rulingBadge: 'Qasam buzilsa kafforat vojib',
    question: "«Vallohi» yoki «Alloh nomi bilan qasam» deb aytilgan qasam buzilsa nima qilinadi?",
    shortAnswer: "Kelajakdagi bir ish uchun Alloh nomi bilan ichilgan qasam buzilsa, qasam kafforatini ado etish vojib bo'ladi: 10 ta miskinni to'ydirish (yoki kiyintirish), bunga qodir bo'lmasa ketma-ket 3 kun ro'za tutish.",
    details: [
      "1. Avvalo 10 nafar miskinga ertalabki va kechki taom (yoki har biriga yarim so' bug'doy / fitr sadaqasi qiymatida mablag') beriladi. Bir miskinga 10 kun davomida bersa ham bo'ladi.",
      "2. Faqat moliyaviy jihatdan bunga umuman qurbi yetmagan kishigina uzluksiz 3 kun ketma-ket kafforat ro'zasini tutadi (Agar puli bo'la turib ro'za tutsa, kafforat o'rniga o'tmaydi).",
      "Xayrli ishni qilmaslikka qasam ichib qo'ygan kishi (masalan, «falon qarindoshimnikiga bormayman» desa), Payg'ambarimiz ﷺ buyurganlaridek, xayrli ishni qiladi va qasami uchun kafforat beradi."
    ],
    source: "Moida surasi 89-oyat, Hidoya (Qasam bobi)",
    tags: ['qasam', 'kafforat', 'vallohi', 'miskin']
  }
];
