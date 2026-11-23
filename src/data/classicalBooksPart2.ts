import { CLASSICAL_BOOKS_PART_1, ClassicalBook } from './classicalBooksPart1';

export { resolveBookParagraphs, resolveBookText } from './classicalBooksPart1';
export type { BookCategory, BookChapter, ClassicalBook, LocalizedBookText } from './classicalBooksPart1';

const CLASSICAL_BOOKS_PART_2: ClassicalBook[] = [
  {
    id: 'navoiy-arbain-siroj',
    category: 'spirituality',
    coverTheme: 'emerald',
    arabicTitle: 'أربعين وسراج المسلمين',
    title: {
      uz_lat: 'Arba’in va Sirojul Muslimin',
      ru: 'Арбаин и Сирадж аль-Муслимин',
      en: 'Arba’in & Siraj al-Muslimin',
    },
    author: {
      uz_lat: 'Hazrat Alisher Navoiy',
      ru: 'Алишер Навои',
      en: 'Alisher Navoi',
    },
    era: '1441–1501',
    heritageBadge: {
      uz_lat: 'O‘zbek klassik merosi · XV asr',
      ru: 'Классическое узбекское наследие · XV в.',
      en: 'Uzbek Classical Heritage · 15th c.',
    },
    summary: {
      uz_lat: 'Buyuk mutafakkir Alisher Navoiyning qirq hadis asosidagi she’riy ruboiylari hamda «Sirojul Muslimin» (Musulmonlar chirog‘i) asaridan saralangan boblar.',
      ru: 'Поэтические четверостишия Алишера Навои на сорок хадисов и главы из «Сирадж аль-Муслимин» («Светоч мусульман») о вере и нравах.',
      en: 'Alisher Navoi’s poetic quatrains rendering forty Prophetic hadiths alongside selections from Siraj al-Muslimin (The Lamp of Muslims).',
    },
    chapters: [
      {
        id: 'navo-1',
        number: 1,
        title: {
          uz_lat: 'Insonlarning eng yaxshisi — foydalisidir',
          ru: 'Лучший из людей — приносящий пользу другим',
          en: 'The Best of People Benefit Others',
        },
        sourceQuote: 'Xalq aro yaxshiroq deding kimdur?\nEshitib ayla shubha raf’in ham:\nYaxshiroq bil ani ulus arokim,\nYetsa ko‘prak ulusqa naf’i ham.',
        sourceLabel: {
          uz_lat: 'Alisher Navoiy · Arba’in (Qirq Hadis)',
          ru: 'Алишер Навои · Арбаин (Сорок хадисов)',
          en: 'Alisher Navoi · Arba’in',
        },
        paragraphs: {
          uz_lat: [
            'Alisher Navoiy «Arba’in» asarida Rasululloh ﷺ ning eng hikmatli qirq hadislarini turkiy tilda go‘zal ruboiylarga solib, o‘zbek adabiyoti va ma’naviyatining bebaho durdonasini yaratgan.',
            'Ushbu ruboiyda «Insonlarning eng yaxshisi — odamlarga ko‘proq foydasi tegadigan kishidir» degan nabaviy hadis tarannum etiladi. Mo‘min kishi faqat o‘zini emas, atrofdagilarning ham og‘irini yengil qilishni o‘ylaydi.',
            'Jamiyatga foyda keltirish ulkan boylikni talab qilmaydi: halol kasb, to‘g‘ri maslahat, ilm ulashish va yaxshi muomala ham ulug‘ xizmatdir.',
          ],
          ru: [
            'В книге «Арбаин» Алишер Навои переложил сорок пророческих хадисов в изящные четверостишия на родном языке, создав жемчужину духовной литературы.',
            'Это четверостишие раскрывает хадис: «Лучший из людей тот, кто приносит наибольшую пользу людям». Достоинство человека измеряется не тем, что он взял у мира, а тем добром, которое он подарил.',
            'Приносить пользу можно в каждом дне: честным трудом, добрым советом, поддержкой и уважительным отношением.',
          ],
          en: [
            'In Arba’in, Alisher Navoi wove forty Prophetic traditions into luminous classical Uzbek quatrains, creating a timeless masterpiece of Central Asian spirituality.',
            'This quatrain illuminates the Prophetic saying: "The best of people are those most beneficial to others." True nobility is measured not by what we accumulate, but by the good we bring into others’ lives.',
            'Service does not require great fortune—honest work, wise counsel, sharing knowledge, and gentle manners all uplift the community.',
          ],
        },
        takeaway: {
          uz_lat: 'O‘zingizga kundalik shior qiling: «Bugun kimga va qanday yaxshilik qila olaman?»',
          ru: 'Пусть каждый день начинается с вопроса: «Кому и чем я могу помочь сегодня?»',
          en: 'Ask yourself each morning: "Who can I quietly help or encourage today?"',
        },
      },
      {
        id: 'navo-2',
        number: 2,
        title: {
          uz_lat: 'Qanoat — tuganmas xazinadir',
          ru: 'Довольство малым — неиссякаемое сокровище',
          en: 'Contentment Is an Unending Treasure',
        },
        sourceQuote: 'Kimki bo‘lsa qanoat ichra muqim,\nBo‘lur ul ganj topqon eldin beh.',
        sourceLabel: {
          uz_lat: 'Alisher Navoiy · Qanoat haqidagi ruboiy',
          ru: 'Алишер Навои · О довольстве малым',
          en: 'Alisher Navoi · Quatrain on Contentment',
        },
        paragraphs: {
          uz_lat: [
            'Navoiy qanoatni hech qachon tugamaydigan xazinaga qiyoslaydi. Hirs va ochko‘zlik insonni ming boylik ichida ham kambag‘al qilib qo‘yadi; qanoat esa oddiy hayotni ham huzurli va barakali qiladi.',
            'Qanoat — dangasalik emas. U halol mehnat qilib, Alloh bergan nasibaga rozi bo‘lish, hasad va o‘zgalarning moliga ko‘z tikishdan pok yurishdir.',
            '«Sirojul Muslimin» asarida ham Navoiy qalb xotirjamligini shariat chegaralarini hurmat qilish va shukronalikda ko‘radi.',
          ],
          ru: [
            'Навои называет довольство малым (канаат) неиссякаемой сокровищницей. Жадность делает человека нищим даже среди золота, а благодарное сердце находит покой в простом достатке.',
            'Канаат — это не бездействие, а честный труд без зависти, с внутренним принятием того удела, который дарует Всевышний.',
            'В «Сирадж аль-Муслимин» поэт также связывает душевный покой с честностью, благодарностью и соблюдением границ дозволенного.',
          ],
          en: [
            'Navoi compares contentment (qana’at) to an inexhaustible treasury. Greed leaves a person feeling poor amid luxury, whereas gratitude brings serene richness to modest means.',
            'Contentment is never laziness—it is striving honestly without envy while gratefully accepting the provision Allah grants.',
            'In Siraj al-Muslimin, Navoi likewise links inner peace to ethical boundaries and constant thankfulness.',
          ],
        },
        takeaway: {
          uz_lat: 'O‘zingizni boshqalarning tashqi hayoti bilan solishtirmang — o‘zingizdagi ne’matlarni sanab shukr qiling.',
          ru: 'Не сравнивайте свою жизнь с чужой витриной — сосчитайте собственные милости и ощутите покой.',
          en: 'Stop comparing your life with others’ outward display; count your own blessings to feel immediate peace.',
        },
      },
      {
        id: 'navo-3',
        number: 3,
        title: {
          uz_lat: '«Sirojul Muslimin» — Musulmonlar chirog‘i',
          ru: '«Сирадж аль-Муслимин» — Светоч мусульман',
          en: 'Siraj al-Muslimin — The Lamp of Muslims',
        },
        sourceQuote: 'Ilm o‘rganmoq erur har mo‘minga farz,\nAmal birla bo‘lur ul nuri mahz.',
        sourceLabel: {
          uz_lat: 'Alisher Navoiy · Sirojul Muslimin (1499)',
          ru: 'Алишер Навои · Сирадж аль-Муслимин (1499)',
          en: 'Alisher Navoi · Siraj al-Muslimin (1499)',
        },
        paragraphs: {
          uz_lat: [
            'Hazrat Navoiy umrining so‘nggi yillarida (1499-yilda) xalqqa din asoslari — imon, tahorat, namoz, ro‘za, zakot va hajni tushunarli she’riy tilda bayon etish uchun «Sirojul Muslimin» risolasini bitgan.',
            'Asarning bosh g‘oyasi — diniy savodxonlik va ma’rifatni yoyishdir. Navoiy johillikni zulmat, haqiqiy ilm va go‘zal amalni esa inson yo‘lini yorituvchi chiroq deb ta’riflaydi.',
            'Shu bois ota-bobolarimiz bu asarni yosh avlodga imon va odob maktabi sifatida o‘qitib kelganlar.',
          ],
          ru: [
            'В последние годы жизни (1499 г.) Алишер Навои написал трактат «Сирадж аль-Муслимин», чтобы в доступной стихотворной форме разъяснить народу основы веры, омовения, намаза, поста, закята и хаджа.',
            'Главная идея произведения — свет просвещения: невежество подобно темноте, а подлинное знание, соединённое с добрым делом, освещает путь человека.',
            'Не одно поколение в Мавераннахре начинало своё духовное воспитание именно с этих светлых строк.',
          ],
          en: [
            'In 1499, near the end of his life, Alisher Navoi composed Siraj al-Muslimin in clear poetic verse to teach ordinary readers the essentials of faith, purification, prayer, fasting, zakat, and pilgrimage.',
            'Its guiding theme is illumination: ignorance leaves the traveler in darkness, while sound knowledge joined to righteous conduct lights the entire path.',
            'For generations across Central Asia, families cherished this concise poem as a lamp for faith and character.',
          ],
        },
        takeaway: {
          uz_lat: 'Har hafta kamida bir yangi foydali ilm o‘rganing — ilm qalbni yorituvchi chiroqdir.',
          ru: 'Каждую неделю узнавайте что-то новое и полезное для веры и жизни — знание освещает путь.',
          en: 'Learn at least one new beneficial insight every week—sound knowledge lights the way ahead.',
        },
      },
    ],
  },
  {
    id: 'zarnujiy-talim',
    category: 'spirituality',
    coverTheme: 'navy',
    arabicTitle: 'تعليم المتعلم طريق التعلم',
    title: {
      uz_lat: 'Ta’limul Muta’allim',
      ru: 'Талим аль-Мутааллим (Путь искателя знаний)',
      en: 'Instruction of the Student (Ta’lim al-Muta’allim)',
    },
    author: {
      uz_lat: 'Imom Burhoniddin az-Zarnujiy',
      ru: 'Имам Бурхануддин аз-Зарнуджи',
      en: 'Imam Burhan al-Din al-Zarnuji',
    },
    era: 'XII–XIII asr (vaf. 1223)',
    heritageBadge: {
      uz_lat: 'Movarounnahr ilm odobi · XIII asr',
      ru: 'Классика педагогики Мавераннахра · XIII в.',
      en: 'Movarounnahr Classic · 13th c.',
    },
    summary: {
      uz_lat: 'Imom Marg‘inoniy shogirdi Burhoniddin Zarnujiyning ilm olish sirlari, ustozga hurmat, xotirani kuchaytirish va barakali o‘qish qo‘llanmasi.',
      ru: 'Знаменитый классический труд ученика имама аль-Маргинани о методах учёбы, уважении к наставникам, укреплении памяти и дисциплине.',
      en: 'The celebrated Movarounnahr manual by a student of Imam al-Marghinani on study methods, reverence for teachers, memory habits, and steady mastery.',
    },
    chapters: [
      {
        id: 'zar-1',
        number: 1,
        title: {
          uz_lat: 'Ilm olishda niyat va olti shart',
          ru: 'Намерение и шесть условий обретения знаний',
          en: 'Sincere Aim & Six Conditions of Learning',
        },
        sourceQuote: 'أَلَا لَا تَنَالُ الْعِلْمَ إِلَّا بِسِتَّةٍ: ذَكَاءٍ وَحِرْصٍ وَاصْطِبَارٍ وَبُلْغَةٍ وَإِرْشَادِ أُسْتَاذٍ وَطُولِ زَمَانٍ',
        sourceLabel: {
          uz_lat: 'Imom Zarnujiy · Ta’limul Muta’allim',
          ru: 'Имам аз-Зарнуджи · Талим аль-Мутааллим',
          en: 'Imam al-Zarnuji · Ta’lim al-Muta’allim',
        },
        paragraphs: {
          uz_lat: [
            'Movarounnahrning ulug‘ hanafiy olimi Imom Zarnujiy nima uchun ko‘pchilik ko‘p o‘qisa-da, ilmining samarasini ko‘ra olmasligini tahlil qiladi: «Chunki ular ilm olishning odobi va to‘g‘ri yo‘lini unutganlar».',
            'Ilm olishda olti omil jam bo‘lishi kerak: o‘tkir zehn, kuchli ishtiyoq, sabr-matonat, yetarli imkoniyat, mohir ustoz yo‘l-yo‘rig‘i va uzoq vaqt bardavom harakat.',
            'Ilmning niyati faxrlanish yoki boshqalarni yerga urish emas, balki jaholatni ketkazish, Alloh roziligini topish va jamiyatga manfaat yetkazish bo‘lishi kerak.',
          ],
          ru: [
            'Великий ханафитский учёный Мавераннахра имам аз-Зарнуджи объясняет, почему многие усердные студенты не достигают плодов: они пренебрегают методом и этикой обучения.',
            'Успех в учёбе опирается на шесть опор: ясность ума, живое стремление, терпение, достаточные средства, руководство наставника и длительное постоянство.',
            'Намерением в знаниях должно быть избавление от невежества и служение добру, а не стремление к тщеславию.',
          ],
          en: [
            'Imam al-Zarnuji observes why many diligent students fail to reap the fruits of study: they neglect the method and etiquette of learning.',
            'Lasting mastery relies on six pillars: alertness of mind, ardent desire, patience, adequate means, a wise teacher’s guidance, and long, steady perseverance.',
            'The true aim of study is dispelling ignorance, pleasing Allah, and serving humanity—never vanity or winning disputes.',
          ],
        },
        takeaway: {
          uz_lat: 'Har kuni oz bo‘lsa-da (15–20 daqiqa), lekin uzluksiz o‘qish — bir kunda ko‘p o‘qib tashlab qo‘yishdan yuz barobar foydali.',
          ru: 'Ежедневные 20 минут спокойной учёбы приносят больше плодов, чем редкие ночные марафоны.',
          en: 'Twenty focused minutes every single day achieves far more than occasional exhausting cramming.',
        },
      },
      {
        id: 'zar-2',
        number: 2,
        title: {
          uz_lat: 'Ustozga, kitobga va do‘stlarga ehtirom',
          ru: 'Уважение к учителю, книге и выбор спутников',
          en: 'Reverence for Teachers, Books & Companions',
        },
        sourceQuote: 'اعْلَمْ أَنَّ طَالِبَ الْعِلْمِ لَا يَنَالُ الْعِلْمَ وَلَا يَنْتَفِعُ بِهِ إِلَّا بِتَعْظِيمِ الْعِلْمِ وَأَهْلِهِ',
        sourceLabel: {
          uz_lat: 'Ta’limul Muta’allim · Hurmat bobi',
          ru: 'Талим аль-Мутааллим · Об уважении к знанию',
          en: 'Ta’lim al-Muta’allim · Revering Knowledge',
        },
        paragraphs: {
          uz_lat: [
            'Imom Zarnujiy ta’kidlaydiki, tolibi ilm ustozini, kitobini va ilm ahllarini hurmat qilmaguncha ilmidan baraka topmaydi. Kitobni pok holda ushlash, uni tartibli saqlash va ustozga odob bilan quloq solish qalbni ilmga ochadi.',
            'Do‘st tanlashda ham hushyorlik kerak: g‘ayratli, halol va kamtar hamroh insonni yuksaltiradi; dangasa, g‘iybatchi va behuda vaqt o‘tkazuvchi suhbatdosh esa himmatni so‘ndiradi.',
            'Ilmni o‘zaro muzokara (muhokama) qilish va o‘rganganini birovga tushuntirib berish bilimga umr beradi.',
          ],
          ru: [
            'Имам подчёркивает: ученик не обретёт благодати знаний без искреннего уважения к наставнику и к самой книге. Бережное обращение с книгами и внимательность к учителю открывают разум.',
            'Не менее важен выбор окружения: трудолюбивый, честный и скромный товарищ вдохновляет, а беспечная компания гасит стремление.',
            'Доброжелательное обсуждение изученного и передача знаний другим закрепляют понимание надолго.',
          ],
          en: [
            'Al-Zarnuji stresses that no student truly benefits from knowledge without honoring teachers and books. Treating books with care and listening with humility opens the intellect.',
            'Choose companions wisely: industrious, honest, and gentle peers elevate ambition, while idle company drains motivation.',
            'Discussing what you learn calmly and teaching it to another cements understanding deeply.',
          ],
        },
        takeaway: {
          uz_lat: 'Ustozingiz haqiga duo qiling va atrofingizni sizni yaxshilikka chorlaydigan do‘stlar bilan o‘rang.',
          ru: 'Делайте дуа за своих учителей и окружайте себя друзьями, рядом с которыми хочется расти.',
          en: 'Pray for your teachers and surround yourself with friends who inspire steady growth.',
        },
      },
      {
        id: 'zar-3',
        number: 3,
        title: {
          uz_lat: 'Xotirani kuchaytirish va takror sirlari',
          ru: 'Укрепление памяти и искусство повторения',
          en: 'Strengthening Memory & Spaced Review',
        },
        sourceQuote: 'الْحِفْظُ حَرْفَانِ وَالْفَهْمُ وِقْرَانِ',
        sourceLabel: {
          uz_lat: 'Ta’limul Muta’allim · Xotira va takror bobi',
          ru: 'Талим аль-Мутааллим · О памяти и повторении',
          en: 'Ta’lim al-Muta’allim · On Memory & Review',
        },
        paragraphs: {
          uz_lat: [
            'Bundan 800 yil avval Imom Zarnujiy zamonaviy «intervallik takrorlash» usulini yozib qoldirgan: bugungi darsni 5 marta, kechagi darsni 4 marta, undan oldingisini 3 marta takrorlash xotirani temirdek mustahkamlaydi.',
            'Tushunib yodlash ko‘r-ko‘rona yodlashdan afzaldir. Shuningdek, sahar vaqtida o‘qish, Qur’on tilovati, ortiqcha to‘yib yemaslik va gunohlardan tiyilish zehnni ravshanlashtiradi.',
            'Muhim fikrni yozib qo‘yish (daftar tutish) — ilmni bog‘lab qo‘yishdir.',
          ],
          ru: [
            'Ещё 800 лет назад имам аз-Зарнуджи описал метод интервального повторения: повторять сегодняшний урок пять раз, вчерашний — четыре, позавчерашний — три, и так закреплять знания навсегда.',
            'Осмысленное запоминание неизмеримо прочнее механического. Ясности ума помогают утренние часы, чтение Корана, умеренность в еде и чистота жизни.',
            'Записывать ключевые мысли — значит надёжно закрепить знание от забвения.',
          ],
          en: [
            'Eight centuries before modern cognitive science, al-Zarnuji taught spaced repetition: review today’s lesson five times, yesterday’s four times, and the prior day’s three times until it becomes effortless.',
            'Understanding before memorizing endures far longer than rote drills. Dawn study hours, Quran recitation, moderation in eating, and moral clarity sharpen recall.',
            'Writing down key insights anchors knowledge securely against forgetfulness.',
          ],
        },
        takeaway: {
          uz_lat: 'Yangi sura yoki ilm o‘rganganingizda ertasi kuni va bir haftadan keyin albatta bir marta qayta ko‘zdan kechiring.',
          ru: 'Возвращайтесь к выученному на следующий день и через неделю — классическая формула крепкой памяти.',
          en: 'Revisit whatever you learn the next morning and a week later—the timeless secret of lasting memory.',
        },
      },
    ],
  },
  {
    id: 'buxoriy-adab-mufrad',
    category: 'hadith',
    coverTheme: 'teal',
    arabicTitle: 'الأدب المفرد',
    title: {
      uz_lat: 'Al-Adab al-Mufrad (Tanlangan boblar)',
      ru: 'Аль-Адаб аль-Муфрад (Избранные главы)',
      en: 'Al-Adab al-Mufrad (Selected Chapters)',
    },
    author: {
      uz_lat: 'Imom Muhammad ibn Ismoil al-Buxoriy',
      ru: 'Имам Мухаммад ибн Исмаил аль-Бухари',
      en: 'Imam Muhammad ibn Isma’il al-Bukhari',
    },
    era: '810–870',
    heritageBadge: {
      uz_lat: 'Buxoro ulug‘ merosi · IX asr',
      ru: 'Великое наследие Бухары · IX в.',
      en: 'Bukhara Classical Heritage · 9th c.',
    },
    summary: {
      uz_lat: 'Muhaddislar sultoni Imom Buxoriyning islomiy odob, ota-onaga yaxshilik, silai rahm, qo‘shnichilik va mehr-oqibatga bag‘ishlangan asari.',
      ru: 'Сборник великого имама аль-Бухари об исламской этике: почтении к родителям, родственных узах, добрососедстве и милосердии.',
      en: 'Imam al-Bukhari’s dedicated masterpiece on Islamic manners: honoring parents, upholding kinship, kindness to neighbors, and everyday mercy.',
    },
    chapters: [
      {
        id: 'bux-1',
        number: 1,
        title: {
          uz_lat: 'Ota-onaga yaxshilik — Jannat darvozasi',
          ru: 'Благочестие к родителям — врата Рая',
          en: 'Honoring Parents — A Gateway to Paradise',
        },
        sourceQuote: 'رِضَا الرَّبِّ فِي رِضَا الْوَالِدِ، وَسَخَطُ الرَّبِّ فِي سَخَطِ الْوَالِدِ',
        sourceLabel: {
          uz_lat: 'Imom Buxoriy · Al-Adab al-Mufrad, 2-hadis',
          ru: 'Имам аль-Бухари · Аль-Адаб аль-Муфрад, №2',
          en: 'Imam al-Bukhari · Al-Adab al-Mufrad, Hadith 2',
        },
        paragraphs: {
          uz_lat: [
            'Imom Buxoriy «Al-Adab al-Mufrad» asarini aynan ota-onaga yaxshilik bobi bilan boshlaydi. Allohning roziligi ota-onaning roziligida ekani va onaning haqqi uch bor alohida ta’kidlangani hadislarda ochiq bayon etilgan.',
            'Ota-onaga yaxshilik faqat moddiy ta’minot emas, balki ularning huzurida ovozni pastlatish, yumshoq gapirish, xizmatini malol olmaslik va vafotlaridan keyin ham doimo duo hamda sadaqa bilan eslashdir.',
            'Keksaygan ota-onaga mehr ko‘rsatgan farzandning umri va rizqi barakali bo‘ladi.',
          ],
          ru: [
            'Имам аль-Бухари открывает «Аль-Адаб аль-Муфрад» главами о почтении к родителям: довольство Господа связано с довольством родителей, а особое право матери было подчёркнуто Пророком ﷺ трижды.',
            'Забота о родителях — это не только материальная помощь, но и мягкий голос, терпеливое внимание, готовность выслушать и постоянное дуа за них при жизни и после их ухода.',
            'Дом, в котором почитают старших, наполняется спокойствием и благословением.',
          ],
          en: [
            'Imam al-Bukhari opens Al-Adab al-Mufrad with chapters on honoring parents: the Lord’s pleasure is tied to a parent’s pleasure, and a mother’s tender right was emphasized three times by the Prophet ﷺ.',
            'Honoring parents goes beyond financial support—it lives in a soft tone, patience, attentive presence, and unceasing prayers for them throughout life and beyond.',
            'A household where elders are cherished is blessed with warmth and barakah.',
          ],
        },
        takeaway: {
          uz_lat: 'Ota-onangizga «uh» demang, ular bilan suhbatlashganda telefoningizni chetga qo‘yib to‘liq e’tibor bering.',
          ru: 'Разговаривая с родителями, отложите телефон и подарите им полное внимание и тёплую улыбку.',
          en: 'When speaking with your parents, put your phone aside and give them your full, warm attention.',
        },
      },
      {
        id: 'bux-2',
        number: 2,
        title: {
          uz_lat: 'Silai rahm — qarindoshlik rishtalari',
          ru: 'Силяту-р-рахим — укрепление родственных уз',
          en: 'Upholding Family Ties (Silat al-Rahim)',
        },
        sourceQuote: 'لَيْسَ الْوَاصِلُ بِالْمُكَافِئِ، وَلَكِنِ الْوَاصِلُ الَّذِي إِذَا قُطِعَتْ رَحِمُهُ وَصَلَهَا',
        sourceLabel: {
          uz_lat: 'Imom Buxoriy · Al-Adab al-Mufrad, 68-hadis',
          ru: 'Имам аль-Бухари · Аль-Адаб аль-Муфрад, №68',
          en: 'Imam al-Bukhari · Al-Adab al-Mufrad, Hadith 68',
        },
        paragraphs: {
          uz_lat: [
            'Rasululloh ﷺ marhamat qiladilar: «Haqiqiy silai rahm qiluvchi — yaxshilikka yaxshilik bilan javob qaytaruvchi emas, balki qarindoshlik aloqasi uzilganda ham uni qayta bog‘lovchi kishidir».',
            'Kim rizqi keng va umri barakali bo‘lishini istasa, qarindoshlari bilan bordi-keldi qilsin, bemorini ziyorat qilsin va ko‘nglini so‘rab tursin.',
            'Arazlashish va gina saqlash qalbni og‘irlashtiradi; birinchi bo‘lib salom berish esa eng oliyjanob fazilatdir.',
          ],
          ru: [
            'Пророк ﷺ сказал: «Поддерживающий родственные связи — это не тот, кто лишь отвечает взаимностью, а тот, кто восстанавливает связь даже тогда, когда её прервали».',
            'Тому, кто желает широты удела и благодати в жизни, заповедано навещать родных, справляться об их здоровье и не оставлять в трудную минуту.',
            'Первый шаг к примирению и доброе приветствие возвышают человека перед Всевышним.',
          ],
          en: [
            'The Prophet ﷺ taught: "The true upholder of kinship is not merely the one who reciprocates, but the one who reconnects ties even when others cut them off."',
            'Whoever wishes for expansion in sustenance and blessing in years is encouraged to check on relatives, visit the sick, and mend strained bonds.',
            'Taking the first step to greet and reconcile is a mark of true nobility.',
          ],
        },
        takeaway: {
          uz_lat: 'Ancha vaqtdan beri xabar olmagan bir qarindoshingizga bugun salom yo‘llang.',
          ru: 'Напишите или позвоните сегодня родственнику, с которым давно не общались.',
          en: 'Reach out today to a relative you have not checked in on for a while.',
        },
      },
      {
        id: 'bux-3',
        number: 3,
        title: {
          uz_lat: 'Qo‘shnichilik haqqi va rahmdillik',
          ru: 'Права соседа и милосердие к творениям',
          en: 'Kindness to Neighbors & Universal Mercy',
        },
        sourceQuote: 'الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَنُ، ارْحَمُوا مَنْ فِي الأَرْضِ يَرْحَمْكُمْ مَنْ فِي السَّمَاءِ',
        sourceLabel: {
          uz_lat: 'Imom Buxoriy · Al-Adab al-Mufrad, 375-hadis',
          ru: 'Имам аль-Бухари · Аль-Адаб аль-Муфрад, №375',
          en: 'Imam al-Bukhari · Al-Adab al-Mufrad, Hadith 375',
        },
        paragraphs: {
          uz_lat: [
            'Imom Buxoriy qo‘shniga ozor bermaslik, taomdan ulashish va yaxshi qo‘shnichilik qilishni mo‘minning asosiy bezagi sifatida keltiradi. Qo‘shni musulmon bo‘ladimi yoki boshqa dinda — unga chiroyli muomala qilish Islom odobidir.',
            'Asarning eng ta’sirli boblaridan biri barcha jonzotlarga rahmdillikdir: bolalarga mehr, hayvonlarga ozor bermaslik, daraxt ekish va atrofdagilarga tabassum ulashish.',
            '«Rahm qiluvchilarga Rahmon rahm qilur. Yerdagilarga rahm qiling — osmondagi Zot sizga rahm qilur».',
          ],
          ru: [
            'Имам аль-Бухари уделяет особое место правам соседа: не причинять беспокойства, делиться угощением и помогать независимо от происхождения или взглядов соседа.',
            'Особую теплоту книге придают главы о милосердии ко всему живому: нежности к детям, бережном отношении к животным, посадке деревьев и искренней улыбке.',
            '«Милующих помилует Милостивый. Будьте милосердны к тем, кто на земле, и вас помилует Тот, Кто над небесами».',
          ],
          en: [
            'Imam al-Bukhari dedicates memorable chapters to neighbors—never causing harm, sharing food, and showing kindness to every neighbor regardless of background.',
            'Equal warmth shines through his chapters on mercy toward all creation: affection for children, gentleness to animals, planting trees, and greeting others with a sincere smile.',
            '"Those who show mercy are shown mercy by the Most Merciful. Be merciful to those on earth, and the One above the heavens will be merciful to you."',
          ],
        },
        takeaway: {
          uz_lat: 'Ochiq chehra, muloyim salom va kichik rahmdillik — har kuni bajarish mumkin bo‘lgan eng oson sadaqadir.',
          ru: 'Искренняя улыбка, приветливость к соседям и милосердие — ежедневная милостыня, доступная каждому.',
          en: 'A genuine smile, courteous neighborliness, and small acts of mercy are daily charity open to everyone.',
        },
      },
    ],
  },
  {
    id: 'termiziy-shamoil',
    category: 'hadith',
    coverTheme: 'walnut',
    arabicTitle: 'الشمائل المحمدية',
    title: {
      uz_lat: 'Shamoili Muhammadiya',
      ru: 'Аш-Шамаиль аль-Мухаммадия',
      en: 'Al-Shama’il al-Muhammadiyya',
    },
    author: {
      uz_lat: 'Imom Abu Iso at-Termiziy',
      ru: 'Имам Абу Иса ат-Тирмизи',
      en: 'Imam Abu Isa al-Tirmidhi',
    },
    era: '824–892',
    heritageBadge: {
      uz_lat: 'Termiz ulug‘ merosi · IX asr',
      ru: 'Великое наследие Термеза · IX в.',
      en: 'Termez Classical Heritage · 9th c.',
    },
    summary: {
      uz_lat: 'Buyuk vatandoshimiz Imom Termiziyning Payg‘ambarimiz Muhammad ﷺ ning muborak xulqlari, tabassumlari, kamtarliklari va hayot tarzlariga bag‘ishlangan asari.',
      ru: 'Знаменитая книга великого учёного из Термеза о благородном облике, мягком нраве, улыбке, скромности и образе жизни Пророка Мухаммада ﷺ.',
      en: 'Imam al-Tirmidhi’s luminous portrait of the Prophet Muhammad ﷺ—his noble presence, warm smile, humility, daily habits, and boundless compassion.',
    },
    chapters: [
      {
        id: 'ter-1',
        number: 1,
        title: {
          uz_lat: 'Payg‘ambarimiz ﷺ ning go‘zal xulq va kamtarliklari',
          ru: 'Благородный нрав и скромность Пророка ﷺ',
          en: 'The Prophet’s Noble Character & Humility',
        },
        sourceQuote: 'لَمْ يَكُنِ النَّبِيُّ ﷺ فَاحِشًا وَلَا مُتَفَحِّشًا... وَلَا يَجْزِي بِالسَّيِّئَةِ السَّيِّئَةَ، وَلَكِنْ يَعْفُو وَيَصْفَحُ',
        sourceLabel: {
          uz_lat: 'Imom Termiziy · Shamoili Muhammadiya',
          ru: 'Имам ат-Тирмизи · Аш-Шамаиль аль-Мухаммадия',
          en: 'Imam al-Tirmidhi · Al-Shama’il al-Muhammadiyya',
        },
        paragraphs: {
          uz_lat: [
            'Imom Termiziy rivoyat qilgan sahih xabarlarga ko‘ra, Rasululloh ﷺ insonlarning eng muloyimi, eng kamtari va eng kechirimlisi edilar. U zot hech qachon qo‘pol so‘z aytmas, bozorlarda baqirmas va yomonlikka yomonlik bilan javob qaytarmas edilar.',
            'Anas ibn Molik (r.a.) o‘n yil u zotning xizmatlarida bo‘lib shunday guvohlik beradi: «O‘n yil davomida menga biror marta ham “uh” demadilar, qilgan ishim uchun “nega bunday qilding?” deb koyimadilar».',
            'O‘z uylarida oddiy inson kabi oilasiga yordam berar, kiyimini o‘zi tikar va har bir suhbatdoshiga butun vujudi bilan yuzlanib quloq solar edilar.',
          ],
          ru: [
            'По достоверным сообщениям, собранным имамом ат-Тирмизи, Посланник Аллаха ﷺ был самым мягким, скромным и великодушным из людей. Он не произносил грубых слов и никогда не отвечал злом на зло, предпочитая прощение.',
            'Анас ибн Малик (р.а.), служивший ему десять лет, свидетельствовал: «За десять лет он ни разу не упрекнул меня и не сказал даже слова недовольства».',
            'Дома он помогал своей семье в повседневных делах и к каждому собеседнику обращался всем корпусом, даря искреннее внимание.',
          ],
          en: [
            'Through authentic reports gathered by Imam al-Tirmidhi, the Messenger of Allah ﷺ appears as the gentlest, humblest, and most forgiving of human beings. He never used harsh language nor repaid harm with harm, choosing instead to pardon.',
            'Anas ibn Malik (r.a.), who served him for ten full years, testified: "In ten years he never once sighed in irritation at me or scolded me over a task."',
            'At home he helped cheerfully with household chores, and whenever someone spoke to him, he turned fully toward them with undivided respect.',
          ],
        },
        takeaway: {
          uz_lat: 'Oila a’zolaringizga yumshoq muomala qiling va suhbatdoshingizni bo‘lmasdan hurmat bilan tinglang.',
          ru: 'Проявляйте особую мягкость в семье и слушайте собеседника, не перебивая — это живая сунна Пророка ﷺ.',
          en: 'Practice gentle patience at home and listen to others without interrupting—a living Sunnah.',
        },
      },
      {
        id: 'ter-2',
        number: 2,
        title: {
          uz_lat: 'Muborak tabassum va ravon nutq',
          ru: 'Светлая улыбка и ясная речь',
          en: 'His Warm Smile & Measured Speech',
        },
        sourceQuote: 'مَا رَأَيْتُ أَحَدًا أَكْثَرَ تَبَسُّمًا مِنْ رَسُولِ اللَّهِ ﷺ',
        sourceLabel: {
          uz_lat: 'Abdulloh ibn Horis rivoyati · Shamoil',
          ru: 'Абдуллах ибн аль-Харис · Аш-Шамаиль',
          en: 'Abdullah ibn al-Harith · Al-Shama’il',
        },
        paragraphs: {
          uz_lat: [
            'Sahobalar Rasululloh ﷺ dan ko‘ra ko‘proq tabassum qiluvchi insonni ko‘rmaganlarini aytadilar. U zotning kulgilari baland qahqaha emas, balki qalblarni erituvchi iliq va viqorli tabassum edi.',
            'So‘zlaganlarida shoshilmas, har bir jumlani dona-dona va ravon aytar, zarur bo‘lganda tushunarli bo‘lishi uchun muhim gapni uch bora takrorlar edilar.',
            'U zotning majlislarida hazil ham bo‘lardi, ammo faqat haq va ko‘ngilni xushnud etuvchi halol hazil aytardilar.',
          ],
          ru: [
            'Сподвижники отмечали, что не встречали человека, улыбавшегося чаще и теплее, чем Посланник Аллаха ﷺ. Его улыбка согревала сердца, оставаясь сдержанной и благородной.',
            'Говорил он неторопливо и отчётливо, так что каждое слово легко запоминалось, а важные мысли повторял трижды для ясности.',
            'Он умел шутить по-доброму с близкими и детьми, но даже в шутке говорил только правду.',
          ],
          en: [
            'Companions recalled never seeing anyone smile more warmly than the Messenger of Allah ﷺ—never boisterous, always dignified and reassuring.',
            'He spoke unhurriedly and clearly so listeners could absorb every word, repeating vital points three times for clarity.',
            'He shared gentle humor with family and children, yet even in jest spoke only what was true and kind.',
          ],
        },
        takeaway: {
          uz_lat: 'Odamlar bilan iliq tabassum va ravon, xotirjam ovozda muloqot qiling.',
          ru: 'Встречайте людей светлой улыбкой и спокойной, ясной речью.',
          en: 'Meet others with an unhurried voice and a sincere, welcoming smile.',
        },
      },
      {
        id: 'ter-3',
        number: 3,
        title: {
          uz_lat: 'Kundalik hayot, soddalik va shukr',
          ru: 'Простота в быту и благодарное поклонение',
          en: 'Simplicity in Daily Life & Grateful Worship',
        },
        sourceQuote: 'أَفَلَا أَكُونُ عَبْدًا شَكُورًا',
        sourceLabel: {
          uz_lat: 'Imom Termiziy · Shamoili Muhammadiya',
          ru: 'Имам ат-Тирмизи · Аш-Шамаиль',
          en: 'Imam al-Tirmidhi · Al-Shama’il',
        },
        paragraphs: {
          uz_lat: [
            'Rasululloh ﷺ taomda hech qachon ayb topmas edilar: yoqsa yerdilar, yoqmasa indamay qo‘yardilar. Ovqatni «Bismilloh» bilan boshlab, o‘ng qo‘l bilan o‘z oldidan yer va «Alhamdulillah» bilan yakunlar edilar.',
            'Kechalari oyoqlari shishguncha namoz o‘qib, «Yo Rasululloh, barcha gunohlaringiz kechirilgan-ku?» degan savolga: «Shukr qiluvchi banda bo‘lmayinmi?!» deb javob berganlar.',
            'U zotning hayotlari dabdaba va isrofdan yiroq, ammo tozalik, xushbo‘ylik, tartib va qalb kengligiga to‘la edi.',
          ],
          ru: [
            'Посланник Аллаха ﷺ никогда не критиковал еду: если блюдо нравилось, он ел его, а если нет — просто оставлял. Трапезу начинал с «Бисмиллях» и завершал благодарностью Всевышнему.',
            'Когда его спрашивали, зачем он так долго молится по ночам, он отвечал: «Разве мне не быть благодарным рабом?»',
            'Его быт был простым и свободным от излишеств, но всегда исполненным чистоты, аккуратности и щедрости души.',
          ],
          en: [
            'The Prophet ﷺ never criticized food: if he liked a dish he ate it, and if not he quietly left it. He began meals with Bismillah and closed them with heartfelt praise of Allah.',
            'When asked why he stood so long in night prayer despite being forgiven, he answered simply: "Should I not be a grateful servant?"',
            'His life blended humble simplicity with immaculate cleanliness, orderliness, and boundless generosity.',
          ],
        },
        takeaway: {
          uz_lat: 'Taomdan kamchilik topmang, dasturxon boshida shukr ayting va hayotingizda soddalikni qadrlang.',
          ru: 'Благодарите за каждую трапезу, избегайте упрёков за столом и берегите чистоту и простоту в доме.',
          en: 'Never complain about food; honor every meal with gratitude and cherish clean simplicity at home.',
        },
      },
    ],
  },
  {
    id: 'tahoviy-aqida',
    category: 'fiqh',
    coverTheme: 'burgundy',
    arabicTitle: 'العقيدة الطحاوية',
    title: {
      uz_lat: 'Al-Aqida at-Tahoviya',
      ru: 'Аль-Акыда ат-Тахавия',
      en: 'Al-Aqida al-Tahawiyya',
    },
    author: {
      uz_lat: 'Imom Abu Ja’far at-Tahoviy (Hanafiy)',
      ru: 'Имам Абу Джафар ат-Тахави (Ханафи)',
      en: 'Imam Abu Ja’far al-Tahawi (Hanafi)',
    },
    era: '853–933',
    heritageBadge: {
      uz_lat: 'Ummat e’tirof etgan Hanafiy aqida · X asr',
      ru: 'Классическая суннитская акыда · X в.',
      en: 'Universal Sunni Creed · 10th c.',
    },
    summary: {
      uz_lat: 'Imom Abu Hanifa va uning ikki shogirdi — Imom Abu Yusuf hamda Imom Muhammad yo‘lidagi sof Ahli Sunna aqidasining muxtasar matni.',
      ru: 'Краткое и общепризнанное изложение вероубеждения Ахлю-с-Сунна по мазхабу имама Абу Ханифы, Абу Юсуфа и Мухаммада аш-Шайбани.',
      en: 'The universally respected concise statement of Sunni creed articulated according to Imam Abu Hanifa, Abu Yusuf, and Muhammad al-Shaybani.',
    },
    chapters: [
      {
        id: 'tah-1',
        number: 1,
        title: {
          uz_lat: 'Allohni barcha nuqsonlardan pok bilish',
          ru: 'Пречистота Аллаха от всякого подобия творениям',
          en: 'Transcendence of the Creator',
        },
        sourceQuote: 'تَعَالَى عَنِ الْحُدُودِ وَالْغَايَاتِ، وَالأَرْكَانِ وَالأَعْضَاءِ وَالأَدَوَاتِ، لَا تَحْوِيهِ الْجِهَاتُ السِّتُّ كَسَائِرِ الْمُبْتَدَعَاتِ',
        sourceLabel: {
          uz_lat: 'Imom Tahoviy · Al-Aqida at-Tahoviya',
          ru: 'Имам ат-Тахави · Аль-Акыда ат-Тахавия',
          en: 'Imam al-Tahawi · Al-Aqida al-Tahawiyya',
        },
        paragraphs: {
          uz_lat: [
            'Imom Tahoviy bu matnni butun Islom ummati — ayniqsa Hanafiy va Moturidiy ulamolari — asrlar bo‘yi yuksak qadrlaydigan tiniq mezon sifatida yozgan.',
            'Alloh taolo chegaralardan, a’zolardan va makon-zamonga muhtojlikdan mutlaqo pokdir. Olti taraf (yuqori, past, o‘ng, chap, old, orqa) barcha maxluqotlarni o‘rab turadi, ammo Yaratuvchini o‘rab ololmaydi.',
            'U zot borliqni yaratishidan oldin ham Xoliq (Yaratuvchi) edi, hech narsaga muhtoj emas va barcha mavjudot Unga muhtojdir.',
          ],
          ru: [
            'Имам ат-Тахави составил этот текст как ясный эталон вероубеждения, принятый учёными уммы — прежде всего ханафитско-матуридитской школы — на протяжении более тысячи лет.',
            'Всевышний превыше границ, телесных органов и нужды в пространстве: шесть сторон света охватывают творения, но не объемлют Творца.',
            'Он не нуждается ни в ком, тогда как всё сущее ежесекундно нуждается в Нём.',
          ],
          en: [
            'Imam al-Tahawi authored this creed as a crystal-clear benchmark embraced by Sunni—especially Hanafi and Maturidi—scholars for over a millennium.',
            'Allah is supremely above limits, limbs, instruments, or containment by the six directions that encompass created things.',
            'He is utterly self-sufficient while every atom of creation depends on Him at every instant.',
          ],
        },
        takeaway: {
          uz_lat: 'Sof tavhid e’tiqodi qalbga ishonch, aqlga ravshanlik va ibodatga haqiqiy ulug‘vorlik beradi.',
          ru: 'Чистое убеждение в величии Творца наполняет сердце спокойной уверенностью и благоговением.',
          en: 'Sound, pure creed brings calm certainty to the intellect and reverence to worship.',
        },
      },
      {
        id: 'tah-2',
        number: 2,
        title: {
          uz_lat: 'Qur’on — Allohning kalomi va Payg‘ambarimiz ﷺ risolatining haqligi',
          ru: 'Коран — Слово Аллаха и печать пророчества',
          en: 'The Holy Quran & Finality of Prophethood',
        },
        sourceQuote: 'وَإِنَّ مُحَمَّدًا عَبْدُهُ الْمُصْطَفَى، وَنَبِيُّهُ الْمُجْتَبَى، وَرَسُولُهُ الْمُرْتَضَى، وَإِنَّهُ خَاتَمُ الأَنْبِيَاءِ',
        sourceLabel: {
          uz_lat: 'Al-Aqida at-Tahoviya · Risolat bobi',
          ru: 'Аль-Акыда ат-Тахавия · О пророчестве',
          en: 'Al-Aqida al-Tahawiyya · On Prophethood',
        },
        paragraphs: {
          uz_lat: [
            'Muhammad ﷺ Allohning tanlangan bandasi, sevikli payg‘ambari va barcha payg‘ambarlarning so‘nggisi (Xotamul Anbiyo)dir. U zotdan keyin hech qanday payg‘ambar kelmaydi.',
            'Qur’oni Karim — Allohning haq kalomi bo‘lib, bashar so‘ziga o‘xshamas, uni Jabroil (a.s.) orqali Rasululloh ﷺ qalblariga nozil qilingandir. U qiyomatgacha barcha insoniyat uchun hidoyat va rahmat manbaidir.',
            'Payg‘ambarimiz ﷺ ning sahobalari va ahli baytlarini hurmat bilan yaxshi ko‘rish, ularning hech birini yomonlamaslik ham Ahli Sunnaning muhim shioridir.',
          ],
          ru: [
            'Мухаммад ﷺ — избранный раб Аллаха, Его возлюбленный посланник и Печать всех пророков: после него пророков уже не будет.',
            'Священный Коран — Слово Всевышнего, ниспосланное как вечное руководство и милость для всего человечества.',
            'Любовь и почтение к сподвижникам Пророка ﷺ и его благородной семье без крайностей и оскорблений — неотъемлемая черта Ахлю-с-Сунна.',
          ],
          en: [
            'Muhammad ﷺ is Allah’s chosen servant, beloved Messenger, and the Seal of all Prophets—no prophet will come after him.',
            'The Holy Quran is the revealed Word of Allah, sent down as enduring guidance and mercy for all humanity until the end of time.',
            'Respecting and loving the Prophet’s Companions and noble family with balance and dignity is a hallmark of Sunni faith.',
          ],
        },
        takeaway: {
          uz_lat: 'Har kuni Payg‘ambarimiz ﷺ ga salavot ayting va Qur’ondan loaqal bir sahifa o‘qing.',
          ru: 'Ежедневно произносите салават Пророку ﷺ и читайте хотя бы одну страницу Корана.',
          en: 'Send daily blessings (salawat) upon the Prophet ﷺ and read even a single page of the Quran.',
        },
      },
      {
        id: 'tah-3',
        number: 3,
        title: {
          uz_lat: 'Qo‘rquv va umid o‘rtasidagi muvozanat',
          ru: 'Равновесие между страхом и надеждой',
          en: 'Balance Between Awe and Hope',
        },
        sourceQuote: 'وَالأَمْنُ وَالإِيَاسُ يَنْقُلَانِ عَنْ مِلَّةِ الإِسْلَامِ، وَسَبِيلُ الْحَقِّ بَيْنَهُمَا لِأَهْلِ الْقِبْلَةِ',
        sourceLabel: {
          uz_lat: 'Al-Aqida at-Tahoviya · Qalb muvozanati',
          ru: 'Аль-Акыда ат-Тахавия · О надежде и богобоязненности',
          en: 'Al-Aqida al-Tahawiyya · Spiritual Balance',
        },
        paragraphs: {
          uz_lat: [
            'Imom Tahoviy ruhiy hayotning eng nozik sirini bayon qiladi: o‘zini butunlay xotirjam sanab g‘aflatga botish ham, Allohning rahmatidan noumid bo‘lish ham to‘g‘ri emas. Haq yo‘l — ikkisining o‘rtasidadir.',
            'Mo‘min bir qanoti bilan Allohning rahmati va mag‘firatidan umid qiladi, ikkinchi qanoti bilan esa gunohlardan qo‘rqib o‘zini tiyadi. Qush ikki qanotsiz ucholmaganidek, qalb ham umid va taqvo muvozanatida yuksaladi.',
            'Alloh bandaga toqatidan ortiq vazifa yuklamaydi; demak har bir sinov ortida albatta yengillik va hikmat bor.',
          ],
          ru: [
            'Имам ат-Тахави формулирует тонкое правило духовного здоровья: опасны и беспечная самоуверенность, и отчаяние в милости Аллаха. Путь истины лежит между ними.',
            'Подобно птице на двух крыльях, сердце верующего поднимается благодаря равновесию надежды на прощение и трепетной ответственности за свои поступки.',
            'Аллах не возлагает на душу сверх её сил — за каждым испытанием обязательно приходит облегчение.',
          ],
          en: [
            'Imam al-Tahawi articulates a profound law of spiritual health: both careless complacency and despair of divine mercy distort the heart. The straight path walks gracefully between them.',
            'Like a bird soaring on two wings, the believer rises through balanced hope in Allah’s mercy paired with mindful reverence.',
            'Allah never burdens a soul beyond its capacity—within every trial lies hidden wisdom and coming relief.',
          ],
        },
        takeaway: {
          uz_lat: 'Qiyinchilikda aslo noumid bo‘lmang, farovonlikda esa aslo g‘aflatga berilmang.',
          ru: 'Не теряйте надежды в испытаниях и не забывайте о благодарности в благополучии.',
          en: 'Never despair during hardship, and never grow heedless during ease.',
        },
      },
    ],
  },
  {
    id: 'yassaviy-hikmatlar',
    category: 'spirituality',
    coverTheme: 'emerald',
    arabicTitle: 'ديوان حكمت',
    title: {
      uz_lat: 'Devoni Hikmat (Tanlangan hikmatlar)',
      ru: 'Диван-и Хикмат (Избранные мудрости)',
      en: 'Diwan-i Hikmat (Selected Wisdoms)',
    },
    author: {
      uz_lat: 'Xoja Ahmad Yassaviy',
      ru: 'Ходжа Ахмад Ясави',
      en: 'Khoja Ahmad Yasawi',
    },
    era: '1093–1166',
    heritageBadge: {
      uz_lat: 'Turkiston ma’naviy merosi · XII asr',
      ru: 'Духовное наследие Туркестана · XII в.',
      en: 'Turkistan Classical Heritage · 12th c.',
    },
    summary: {
      uz_lat: 'Turkiston piri Xoja Ahmad Yassaviyning qalb uyg‘oqligi, halollik, kamtarlik, yetimparvarlik va Alloh muhabbatiga chorlovchi abadiy hikmatlari.',
      ru: 'Вечные духовные стихи Ходжи Ахмада Ясави о пробуждении сердца, честности, заботе о сиротах, скромности и любви к Творцу.',
      en: 'The enduring Turkistan spiritual verses of Khoja Ahmad Yasawi calling to wakefulness of heart, honesty, caring for orphans, humility, and divine love.',
    },
    chapters: [
      {
        id: 'yas-1',
        number: 1,
        title: {
          uz_lat: 'Bismilloh deb boshlangan hikmat va qalb uyg‘oqligi',
          ru: 'Мудрость, начатая с Бисмиллях, и пробуждение сердца',
          en: 'Wisdom Begun with Bismillah & Awakening the Heart',
        },
        sourceQuote: 'Bismilloh deb bayon aylab hikmat aytib,\nToliblargha durru gavhar sochdim mano.',
        sourceLabel: {
          uz_lat: 'Xoja Ahmad Yassaviy · Devoni Hikmat',
          ru: 'Ходжа Ахмад Ясави · Диван-и Хикмат',
          en: 'Khoja Ahmad Yasawi · Diwan-i Hikmat',
        },
        paragraphs: {
          uz_lat: [
            'Xoja Ahmad Yassaviy Islom nuri va hikmatini Markaziy Osiyo xalqlarining yuragiga sodda, samimiy ona tilida yetkazgan buyuk mutasavvif va tarbiyachidir.',
            'Uning hikmatlari insonni g‘aflat uyqusidan uyg‘otishga chaqiradi: «Ey g‘ofil banda, umring shamoldek o‘tmoqda — ko‘zingni och, qalbingni Allohning zikri bilan tiriltir».',
            'Yassaviy yo‘lida zohiriy da’vo emas, halol mehnat bilan kun ko‘rish (u zot o‘zlari yog‘och qoshiq yo‘nib tirikchilik qilganlar) va qalb pokligi eng oliy fazilatdir.',
          ],
          ru: [
            'Ходжа Ахмад Ясави принёс свет исламской духовности в сердца народов Центральной Азии на живом, понятном каждому родном языке.',
            'Его «хикматы» зовут к пробуждению от душевной спячки: годы летят подобно ветру, и лишь поминание Всевышнего и добрые дела наполняют их смыслом.',
            'Сам наставник жил скромным ремеслом — вырезал деревянные ложки — показывая пример честного труда и подлинного смирения.',
          ],
          en: [
            'Khoja Ahmad Yasawi carried the light of Islamic ethics into the hearts of Central Asia in simple, deeply felt vernacular poetry.',
            'His hikmats gently awaken the soul from heedlessness: seasons pass like wind, and only remembrance of Allah and sincere kindness give our days lasting weight.',
            'Yasawi himself earned his modest living carving wooden spoons—modeling dignity in honest work and unadorned humility.',
          ],
        },
        takeaway: {
          uz_lat: 'Halol kasb va kamtarona hayot — qalb xotirjamligining eng ishonchli manbaidir.',
          ru: 'Честный труд и скромность даруют душе достоинство и спокойствие.',
          en: 'Honest labor and humble living cultivate quiet dignity and inner calm.',
        },
      },
      {
        id: 'yas-2',
        number: 2,
        title: {
          uz_lat: 'G‘arib, yetim va ko‘ngli siniqlarni sevintirish',
          ru: 'Утешение сирот и сокрушённых сердец',
          en: 'Comforting the Lonely and Brokenhearted',
        },
        sourceQuote: 'Qayda ko‘rsang ko‘ngli siniq, marham bo‘lg‘il,\nAndog‘ mazlum yo‘lda qolsa, hamdam bo‘lg‘il.',
        sourceLabel: {
          uz_lat: 'Xoja Ahmad Yassaviy · Mehr-shafqat hikmati',
          ru: 'Ходжа Ахмад Ясави · О милосердии',
          en: 'Khoja Ahmad Yasawi · Verse on Compassion',
        },
        paragraphs: {
          uz_lat: [
            'Yassaviy hikmatlarining eng mashhur baytlaridan biri insonparvarlikning cho‘qqisidir: «Qayerda ko‘ngli siniq kishini ko‘rsang, dardiga malham bo‘l; yo‘lda qolgan mazlumga hamroh bo‘l».',
            'Payg‘ambarimiz ﷺ ham yetimning boshini silash qalb qattiqligini yumshatishini aytganlar. Haqiqiy taqvo faqat masjid burchagida emas, muhtojga uzatilgan yordam qo‘lida namoyon bo‘ladi.',
            'Bir insonning ko‘nglini ovlash va unga umid berish — yuzlab quruq nasihatlardan ta’sirliroq ibodatdir.',
          ],
          ru: [
            'Одни из самых знаменитых строк Ясави звучат как гимн милосердию: «Где встретишь сокрушённое сердце — стань для него бальзамом; если обиженный остался в пути — стань ему опорой».',
            'Подлинная набожность проявляется не в громких словах, а в протянутой руке помощи сироте, одинокому и нуждающемуся.',
            'Утешить опечаленного и подарить надежду — великое поклонение, смягчающее собственное сердце.',
          ],
          en: [
            'Among Yasawi’s most cherished lines is a manifesto of mercy: "Wherever you meet a broken heart, become its balm; whenever the wronged is stranded on the road, become their companion."',
            'True devotion is revealed not merely in words, but in gentle hands extended toward the orphan, the lonely, and the burdened.',
            'Lifting one weary heart carries more spiritual weight than a hundred dry lectures.',
          ],
        },
        takeaway: {
          uz_lat: 'Atrofingizda yordamga yoki bir og‘iz daldaga muhtoj insonni e’tiborsiz qoldirmang.',
          ru: 'Не проходите мимо того, кому сегодня нужна поддержка или одно доброе слово ободрения.',
          en: 'Notice the person near you who quietly needs kindness or encouragement—be that balm today.',
        },
      },
    ],
  },
  {
    id: 'rabguziy-qisas',
    category: 'hadith',
    coverTheme: 'teal',
    arabicTitle: 'قصص الربغوزي',
    title: {
      uz_lat: 'Qisasi Rabg‘uziy (Ibratli qissalar)',
      ru: 'Кисаси Рабгузи (Назидательные предания)',
      en: 'Qisas al-Rabghuzi (Prophetic Stories)',
    },
    author: {
      uz_lat: 'Nosiruddin Burhonuddin Rabg‘uziy',
      ru: 'Насируддин Бурхануддин Рабгузи',
      en: 'Nasir al-Din al-Rabghuzi',
    },
    era: '1310-yil (XIV asr)',
    heritageBadge: {
      uz_lat: 'Xorazm klassik nasri · XIV asr',
      ru: 'Классическая проза Хорезма · XIV в.',
      en: 'Khwarazm Classical Prose · 14th c.',
    },
    summary: {
      uz_lat: 'XIV asrda Xorazmda bitilgan eng qadimiy o‘zbek nasriy obidasi: payg‘ambarlar hayotidan sabr, tavba, adolat va halollik saboqlari.',
      ru: 'Древнейший памятник узбекской классической прозы (XIV в.): назидательные истории пророков о терпении, покаянии, честности и справедливости.',
      en: 'The landmark 14th-century Khwarazm classic of Uzbek prose sharing timeless lessons of patience, repentance, honesty, and courage from the lives of the Prophets.',
    },
    chapters: [
      {
        id: 'rab-1',
        number: 1,
        title: {
          uz_lat: 'Hazrati Odam (a.s.) — Tavba va umid sabog‘i',
          ru: 'Пророк Адам (а.с.) — Урок искреннего покаяния',
          en: 'Prophet Adam (a.s.) — Sincere Repentance & Hope',
        },
        sourceQuote: 'رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ',
        sourceLabel: {
          uz_lat: 'A’rof surasi, 23-oyat · Qisasi Rabg‘uziy',
          ru: 'Сура Аль-Араф, 23 · Кисаси Рабгузи',
          en: 'Surah Al-A’raf 7:23 · Qisas al-Rabghuzi',
        },
        paragraphs: {
          uz_lat: [
            'Rabg‘uziy hazrati Odam (a.s.) qissasida inson tabiatining eng muhim sabog‘ini ochib beradi: xato qilmaslik faqat farishtalarga xos; insonning fazilati esa xatosini tan olib, bahona qidirmasdan Robbisiga tavba bilan qaytishidir.',
            'Iblis o‘z xatosida kibr qilib boshqalarni aybladi va quvildi; Odam (a.s.) esa kamtarlik bilan: «Parvardigoro, biz o‘zimizga zulm qildik, agar bizni kechirmasang, ziyon ko‘ruvchilardan bo‘lamiz» deb yolvordi va kechirildi.',
            'Demak, qaysarlik insonni halokatga, samimiy tavba esa Allohning yaqinligiga olib boradi.',
          ],
          ru: [
            'В истории пророка Адама (а.с.) Рабгузи раскрывает главный урок для человечества: достоинство человека не в безошибочности, а в честном признании вины и искреннем возвращении к Господу.',
            'Иблис возгордился и стал искать оправдания, а Адам (а.с.) со смирением произнёс слова покаяния — и был прощён.',
            'Упрямство отдаляет от истины, а искреннее покаяние открывает новую чистую страницу.',
          ],
          en: [
            'In the story of Prophet Adam (a.s.), al-Rabghuzi highlights an enduring human truth: nobility is not claiming perfection, but honestly acknowledging error without excuses and turning back to Allah.',
            'Iblis clung to pride and blamed others, whereas Adam (a.s.) humbly confessed his wrong and sought forgiveness—and was embraced by divine mercy.',
            'Stubborn pride hardens the soul, while sincere repentance opens a fresh beginning.',
          ],
        },
        takeaway: {
          uz_lat: 'Xato qilganingizda bahona topishga urinmang — uni mardlarcha tan olib, darhol tuzating.',
          ru: 'Признать ошибку честно и сразу исправить её — знак внутренней силы и зрелости.',
          en: 'When you make a mistake, skip excuses—own it courageously and mend it right away.',
        },
      },
      {
        id: 'rab-2',
        number: 2,
        title: {
          uz_lat: 'Hazrati Yusuf (a.s.) — Sabr, iffat va kechirimlilik',
          ru: 'Пророк Юсуф (а.с.) — Терпение, чистота и прощение',
          en: 'Prophet Yusuf (a.s.) — Patience, Integrity & Forgiveness',
        },
        sourceQuote: 'لَا تَثْرِيبَ عَلَيْكُمُ الْيَوْمَ ۖ يَغْفِرُ اللَّهُ لَكُمْ ۖ وَهُوَ أَرْحَمُ الرَّاحِمِينَ',
        sourceLabel: {
          uz_lat: 'Yusuf surasi, 92-oyat · Qisasi Rabg‘uziy',
          ru: 'Сура Юсуф, 92 · Кисаси Рабгузи',
          en: 'Surah Yusuf 12:92 · Qisas al-Rabghuzi',
        },
        paragraphs: {
          uz_lat: [
            'Qudratli sinovlar — quduq, qullik, tuhmat va zindon — hazrati Yusuf (a.s.) ning qalbini qoraytirolmadi. U zot har bir og‘ir damda iffati, halolligi va Allohga bo‘lgan chiroyli gumonini saqlab qoldilar.',
            'Nihoyat, Misr xazinalarining rahbari bo‘lib, o‘zini quduqqa tashlagan og‘alari qarshisida turganlarida ham intiqom olmadilar, balki: «Bugun sizlarga hech qanday malomat yo‘q, Alloh sizlarni mag‘firat qilsin» deb barchalarini kechirdilar.',
            'Rabg‘uziy bu qissadan buyuk xulosa chiqaradi: haqiqiy g‘alaba — kuching yetib turgan paytda kechira olishdir.',
          ],
          ru: [
            'Ни колодец, ни неволя, ни несправедливая темница не ожесточили сердце пророка Юсуфа (а.с.): в каждом испытании он сохранял честность, достоинство и доверие Аллаху.',
            'Обретя власть над Египтом и встретив братьев, предавших его много лет назад, он не стал мстить, а великодушно простил их: «Сегодня нет на вас упрёка».',
            'Высшая победа человека — простить тогда, когда у него есть полная сила ответить обидой.',
          ],
          en: [
            'Neither the dark well, nor slavery, nor wrongful imprisonment embittered Prophet Yusuf (a.s.). Through every hardship he guarded his integrity, dignity, and serene trust in Allah.',
            'When finally elevated to authority in Egypt and facing the brothers who had betrayed him, he chose mercy over vengeance: "No blame rests upon you today; may Allah forgive you."',
            'Al-Rabghuzi draws the timeless moral: the highest victory is forgiving when you hold full power to retaliate.',
          ],
        },
        takeaway: {
          uz_lat: 'Qalbingizda eski gina saqlamang — kechirish eng avvalo o‘z yuragingizga ozodlik beradi.',
          ru: 'Отпустите старые обиды — прощение прежде всего освобождает и исцеляет ваше собственное сердце.',
          en: 'Release old grudges—forgiveness heals and frees your own heart first.',
        },
      },
      {
        id: 'rab-3',
        number: 3,
        title: {
          uz_lat: 'Hazrati Ayyub (a.s.) — Sinovda matonat va shukr',
          ru: 'Пророк Айюб (а.с.) — Стойкость в испытании',
          en: 'Prophet Ayyub (a.s.) — Steadfastness Through Trial',
        },
        sourceQuote: 'أَنِّي مَسَّنِيَ الضُّرُّ وَأَنتَ أَرْحَمُ الرَّاحِمِينَ',
        sourceLabel: {
          uz_lat: 'Anbiyo surasi, 83-oyat · Qisasi Rabg‘uziy',
          ru: 'Сура Аль-Анбия, 83 · Кисаси Рабгузи',
          en: 'Surah Al-Anbiya 21:83 · Qisas al-Rabghuzi',
        },
        paragraphs: {
          uz_lat: [
            'Hazrati Ayyub (a.s.) boylik va sog‘likdan ayrilib uzoq yillar og‘ir dardga chalinganda ham tili shikoyatga emas, hamd va zikrga mashg‘ul bo‘ldi.',
            'U zot duolarida odobning oliy namunasini ko‘rsatdilar: «Yo Robbim, menga zarar yetdi, Sen esa rahmlilarning eng Rahmlisisan». U shikoyat qilmadi, faqat ojizligini Allohning rahmatiga topshirdi.',
            'Sabrning mukofoti o‘laroq Alloh u zotga shifo, ahli oilasi va undan ham ziyoda baraka ato etdi.',
          ],
          ru: [
            'Потеряв достаток и здоровье на долгие годы, пророк Айюб (а.с.) не позволил языку роптать — его сердце оставалось благодарным и поминающим Господа.',
            'Его мольба стала образцом деликатности перед Творцом: «Поистине, меня коснулось зло, а Ты — Милосерднейший из милосердных».',
            'За стойкость и терпение Всевышний даровал ему исцеление и приумноженную благодать.',
          ],
          en: [
            'Even after losing wealth and health for years, Prophet Ayyub (a.s.) kept his tongue anchored in gratitude and remembrance rather than bitterness.',
            'His supplication models sublime spiritual courtesy: "Truly, adversity has touched me, and You are the Most Merciful of the merciful."',
            'In reward for enduring grace, Allah restored his health, his family, and doubled his blessings.',
          ],
        },
        takeaway: {
          uz_lat: 'Og‘ir kunlarda shikoyat o‘rniga Hazrati Ayyub (a.s.) ning go‘zal duosini takrorlang.',
          ru: 'В трудные минуты вместо ропота повторяйте светлую мольбу пророка Айюба (а.с.).',
          en: 'In difficult moments, replace complaint with the serene prayer of Prophet Ayyub (a.s.).',
        },
      },
    ],
  },
  {
    id: 'ibn-atoilloh-hikam',
    category: 'spirituality',
    coverTheme: 'navy',
    arabicTitle: 'الحِكَم العطائية',
    title: {
      uz_lat: 'Al-Hikam (Qalb hikmatlari)',
      ru: 'Аль-Хикам (Жемчужины мудрости)',
      en: 'Al-Hikam (Aphorisms of the Heart)',
    },
    author: {
      uz_lat: 'Imom Ibn Atoilloh al-Iskandariy',
      ru: 'Имам Ибн Атауллах аль-Искандари',
      en: 'Imam Ibn Ata’illah al-Iskandari',
    },
    era: '1260–1309',
    heritageBadge: {
      uz_lat: 'Klassik qalb tarbiyasi · XIII–XIV asr',
      ru: 'Классика духовной мудрости · XIII–XIV вв.',
      en: 'Classical Wisdom · 13th–14th c.',
    },
    summary: {
      uz_lat: 'Yetti asrdan beri musulmon qalblariga sakinat bag‘ishlab kelayotgan chuqur hikmatlar: tavakkul, duo odobi, ne’matni anglash va qalb halovati.',
      ru: 'Знаменитые краткие изречения о духовном покое, уповании на Аллаха, смысле дуа и внутренней ясности, любимые читателями уже семь веков.',
      en: 'Luminous classical aphorisms cherished for seven centuries for their calming insight into trust in Allah, prayer, inner serenity, and gratitude.',
    },
    chapters: [
      {
        id: 'hik-1',
        number: 1,
        title: {
          uz_lat: 'O‘z kuchingga emas, Allohning fazliga tayan',
          ru: 'Опирайся на милость Аллаха, а не на гордыню своих дел',
          en: 'Rely Upon Divine Grace, Not Self-Pride',
        },
        sourceQuote: 'مِنْ عَلَامَةِ الِاعْتِمَادِ عَلَى الْعَمَلِ، نُقْصَانُ الرَّجَاءِ عِنْدَ وُجُودِ الزَّلَلِ',
        sourceLabel: {
          uz_lat: 'Ibn Atoilloh · Al-Hikam, 1-hikmat',
          ru: 'Ибн Атауллах · Аль-Хикам, афоризм №1',
          en: 'Ibn Ata’illah · Al-Hikam, Aphorism 1',
        },
        paragraphs: {
          uz_lat: [
            '«Xato qilib qo‘yganingda Allohning rahmatidan umiding susayib ketishi — sening Allohga emas, o‘z amalingga tayanib qolganingning belgisidir».',
            'Inson yaxshi amal qilganida «men qildim» deb kibrlanmasa va xato qilganida darhol tavba bilan Robbisiga qaytsa, qalbi doimo muvozanatda bo‘ladi.',
            'Bizni najotga yetkazuvchi narsa faqat urinishimizning o‘zi emas, balki Allohning cheksiz rahmati va tavfiqidir.',
          ],
          ru: [
            '«Признаком того, что ты опираешься на собственные дела, служит ослабление надежды на милость Аллаха в минуту проступка».',
            'Когда человек совершает добро без самодовольства, а оступившись, сразу возвращается с покаянием, его сердце остаётся светлым и устойчивым.',
            'Надежда на милость Всевышнего даёт силы вставать снова и продолжать путь к добру.',
          ],
          en: [
            '"One sign of relying on your own deeds rather than on Allah is losing hope whenever you stumble."',
            'When good deeds are done without pride and slips are met with prompt repentance, the heart stays grounded and resilient.',
            'Trusting divine mercy gives us the courage to rise again and keep walking toward goodness.',
          ],
        },
        takeaway: {
          uz_lat: 'Yaxshilikka muvaffaq bo‘lsangiz shukr qiling, xato qilsangiz umidsizlanmay darhol tavba qiling.',
          ru: 'За удачу благодарите Всевышнего, а после ошибки не впадайте в уныние — сразу возвращайтесь к Нему.',
          en: 'Thank Allah for every success, and when you stumble, turn back immediately without despair.',
        },
      },
      {
        id: 'hik-2',
        number: 2,
        title: {
          uz_lat: 'Tadbir tashvishidan qalbni yengillatish',
          ru: 'Освобождение сердца от тревоги о завтрашнем дне',
          en: 'Resting the Heart from Anxious Control',
        },
        sourceQuote: 'أَرِحْ نَفْسَكَ مِنَ التَّدْبِيرِ، فَمَا قَامَ بِهِ غَيْرُكَ عَنْكَ لَا تَقُمْ بِهِ لِنَفْسِكَ',
        sourceLabel: {
          uz_lat: 'Ibn Atoilloh · Al-Hikam, 4-hikmat',
          ru: 'Ибн Атауллах · Аль-Хикам, афоризм №4',
          en: 'Ibn Ata’illah · Al-Hikam, Aphorism 4',
        },
        paragraphs: {
          uz_lat: [
            '«O‘zingni ortiqcha tashvishli tadbirlardan xalos et: sening o‘rningga Alloh zimmasiga olgan narsani (kelajak rizq va taqdirni) o‘ylayverib yuragingni ezma».',
            'Albatta, reja tuzish va halol mehnat qilish kerak. Biroq qo‘lingdan kelganini qilib bo‘lgach, ertangi kunning noma’lum tashvishlari bilan bugungi xotirjamlikni buzish foydasizdir.',
            'Tavakkul — qo‘lni harakatda, qalbni esa Allohga ishonchda sokin saqlashdir.',
          ],
          ru: [
            '«Освободи душу от изнуряющей тревоги: не бери на свои плечи то управление судьбой, которое Всевышний уже взял на Себя».',
            'Разумное планирование и усердный труд необходимы, но после того как сделан честный шаг, бесконечное беспокойство лишь крадёт радость сегодняшнего дня.',
            'Таваккуль — это деятельные руки и спокойное сердце.',
          ],
          en: [
            '"Rest yourself from anxious self-management: what Another has undertaken on your behalf, do not exhaust yourself trying to control."',
            'Thoughtful planning and honest effort belong to us, yet once we have done our part, relentless worry only steals today’s peace.',
            'True tawakkul means active hands paired with a serene heart.',
          ],
        },
        takeaway: {
          uz_lat: 'Reja qiling, harakat qiling, so‘ngra chuqur nafas olib ayting: «Hasbunallohu va ni’mal vakil».',
          ru: 'Сделайте всё зависящее от вас, а затем со спокойным вздохом доверьте итог Всевышнему.',
          en: 'Do your honest part, take a calm breath, and entrust the rest with "Hasbunallahu wa ni’mal wakil."',
        },
      },
      {
        id: 'hik-3',
        number: 3,
        title: {
          uz_lat: 'Duoning ijobati va kechikish hikmati',
          ru: 'Мудрость ответа на дуа и его сроков',
          en: 'The Hidden Wisdom in Answered Prayer',
        },
        sourceQuote: 'لَا يَكُنْ تَأَخُّرُ أَمَدِ الْعَطَاءِ مَعَ الإِلْحَاحِ فِي الدُّعَاءِ مُوجِبًا لِيَأْسِكَ',
        sourceLabel: {
          uz_lat: 'Ibn Atoilloh · Al-Hikam, 6-hikmat',
          ru: 'Ибн Атауллах · Аль-Хикам, афоризм №6',
          en: 'Ibn Ata’illah · Al-Hikam, Aphorism 6',
        },
        paragraphs: {
          uz_lat: [
            '«Ko‘p duo qilganing holda so‘ragan narsangning kechikishi seni noumid qilmasin; zero Alloh senga sen o‘zing uchun tanlagan vaqtda emas, U zot sen uchun eng xayrli deb bilgan vaqtda va shaklda ijobat qilishni va’da qilgan».',
            'Ba’zan bir eshikning yopilishi — insonni yomonlikdan asrash va undan ko‘ra go‘zalroq eshikni ochish uchundir.',
            'Duoning o‘zi ham eng buyuk ibodatdir: ijobat bo‘lmagan deb o‘ylagan hech bir samimiy duo zoye ketmaydi.',
          ],
          ru: [
            '«Пусть задержка ответа при твоём усердном дуа не ввергает тебя в отчаяние: Всевышний обещал ответить в то время и тем образом, которые лучше для тебя, а не просто тогда, когда хочется тебе».',
            'Порой закрытая дверь оберегает нас от скрытого вреда и ведёт к гораздо большему благу.',
            'Ни одна искренняя молитва не пропадает впустую — она либо исполняется, либо отводит беду, либо превращается в награду.',
          ],
          en: [
            '"Do not let the delay of a gift despite persistent supplication cause you to despair; Allah has guaranteed an answer in what He chooses for you, at the time He knows is best—not merely on your timetable."',
            'Sometimes a closed door shields us from unseen harm and gently redirects us toward a far better opening.',
            'No sincere prayer is ever lost: it is either granted, averts hardship, or stored as lasting blessing.',
          ],
        },
        takeaway: {
          uz_lat: 'Duoda sobit bo‘ling va «Yo Robbim, menga eng xayrlisini nasib qil» deb so‘rang.',
          ru: 'Не оставляйте дуа и всегда просите: «О Господь, даруй мне то, в чём наибольшее благо».',
          en: 'Stay steadfast in prayer and ask: "O Lord, grant me whatever holds the greatest good for me."',
        },
      },
    ],
  },
];

export const CLASSICAL_BOOKS: ClassicalBook[] = [
  ...CLASSICAL_BOOKS_PART_1,
  ...CLASSICAL_BOOKS_PART_2,
];

export function getBookById(id: string | null | undefined): ClassicalBook | undefined {
  return CLASSICAL_BOOKS.find((b) => b.id === id);
}
