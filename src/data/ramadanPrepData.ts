import { AppLanguage } from '../types';

export interface RamadanPrepActivity {
  id: 'quran' | 'fasting' | 'night' | 'character' | 'charity';
  title: string;
  encouragement: string;
}

export interface RamadanPrepRuleItem {
  question: string;
  answer: string;
  tip: string;
}

export interface RamadanPrepStrings {
  daysLeftLabel: string;
  reachingDuaArabic: string;
  reachingDuaMeaning: string;
  autoOpenNotice: string;
  prepTitle: string;
  prepSubtitle: string;
  activities: RamadanPrepActivity[];
  duasBtnTitle: string;
  duasBtnSubtitle: string;
  rulesBtnTitle: string;
  rulesBtnSubtitle: string;
  duasModalTitle: string;
  rulesModalTitle: string;
  practicalTipPrefix: string;
  qaBadge: string;
  rules: RamadanPrepRuleItem[];
}

export const CORE_DUA_RU_OVERRIDES: Record<string, { title: string; translation: string }> = {
  'suhoor-niyyah': {
    title: 'Намерение на пост (Сухур)',
    translation: 'Я намереваюсь соблюдать пост месяца Рамадан от рассвета до заката искренне ради Всевышнего Аллаха. Аллах Велик.',
  },
  'iftar-dua-traditional': {
    title: 'Полное дуа разговения (Ифтар)',
    translation: 'О Аллах, ради Тебя я постился, в Тебя уверовал, на Тебя уповал и Твоим уделом разговился. Прости мне, о Всепрощающий, мои прошлые и будущие прегрешения по Твоей милости, о Милосерднейший!',
  },
  'iftar-dua-sahih': {
    title: 'Сунна-дуа при ифтаре (Достоверный хадис)',
    translation: 'Ушла жажда, увлажнились жилы и утвердилась награда, если пожелает Аллах.',
  },
  'laylatul-qadr': {
    title: 'Дуа Ночи Предопределения (Ляйлятуль-Кадр)',
    translation: 'О Аллах, поистине Ты — Прощающий, любишь прощение, так прости же меня!',
  },
  'ashra-1': {
    title: 'Дуа первой декады (дни Милости)',
    translation: 'Господь мой, прости и помилуй, ведь Ты — Лучший из милосердных.',
  },
  'ashra-2': {
    title: 'Дуа второй декады (дни Прощения)',
    translation: 'Прошу прощения у Аллаха, Господа моего, за каждый грех и каюсь перед Ним.',
  },
  'ashra-3': {
    title: 'Дуа третьей декады (избавление от Огня)',
    translation: 'О Аллах, защити и спаси нас от огня Ада.',
  },
  'guest-iftar': {
    title: 'Дуа для хозяина после ифтара в гостях',
    translation: 'Пусть у вас разговляются постящиеся, пусть вашу еду вкушают праведники и пусть благословляют вас ангелы.',
  },
};

export const RAMADAN_PREP_DATA: Record<AppLanguage, RamadanPrepStrings> = {
  uz_lat: {
    daysLeftLabel: 'kun qoldi',
    reachingDuaArabic: 'اللَّهُمَّ بَارِكْ لَنَا فِي رَجَبٍ وَشَعْبَانَ وَبَلِّغْنَا رَمَضَانَ',
    reachingDuaMeaning: 'Allohim, bizga Rajab va Sha’bonda baraka ber va Ramazonga yetkazgin',
    autoOpenNotice: 'Bu sahifa Ramazon boshlanganda avtomatik ochiladi',
    prepTitle: 'Ramazonga o‘zingizni shu amallarga tayyorlang',
    prepSubtitle: 'Muborak oy kirib kelishidan oldin qalb va tanani go‘zal odatlarga ko‘niktirib boring:',
    activities: [
      {
        id: 'quran',
        title: 'Kunlik Qur’on tilovati odati',
        encouragement: 'Har namozdan keyin atigi bir necha sahifa o‘qishni boshlang — shunda Ramazonda to‘liq xatm qilish yengil va lazzatli bo‘ladi.',
      },
      {
        id: 'fasting',
        title: 'Dushanba va Payshanba nafl ro‘zalari',
        encouragement: 'Oyda bir necha marta sunnat ro‘za tutish nafsingizni chiniqtiradi va Ramazonning ilk kunlarini osoyishta o‘tkazishga yordam beradi.',
      },
      {
        id: 'night',
        title: 'Bomdoddan oldin uyg‘onish va duo',
        encouragement: 'Tongdan 15 daqiqa avval uyg‘onib ikki rakat tahajjud va duo qilishga odatlaning — saharlikka turish osonlashadi.',
      },
      {
        id: 'character',
        title: 'Til va qalbni poklash',
        encouragement: 'Gina-kuduratni kechiring, ortiqcha gap va jahlni zikr hamda sabr bilan almashtiring — Ramazon pok qalbda yanada fayzli bo‘ladi.',
      },
      {
        id: 'charity',
        title: 'Qazo ro‘zalar va ehson rejasi',
        encouragement: 'Avvalgi qolgan qazo ro‘zalaringizni tutib qo‘ying va muhtojlarga yordam berish uchun hozirdan niyat hamda ehson ajrating.',
      },
    ],
    duasBtnTitle: 'Saharlik va Iftorlik duolari',
    duasBtnSubtitle: 'To‘liq matn va tarjima',
    rulesBtnTitle: 'Ro‘za qoidalari va savol-javob',
    rulesBtnSubtitle: 'Muhim fiqhiy eslatmalar',
    duasModalTitle: 'Saharlik, Iftorlik va Ramazon duolari',
    rulesModalTitle: 'Ro‘za qoidalari va savol-javoblar',
    practicalTipPrefix: 'Muhim eslatma:',
    qaBadge: 'S/J',
    rules: [
      {
        question: 'Saharlikka uxlab qolsa nima bo‘ladi?',
        answer: 'Saharlik vaqti (Bomdod kirishi) o‘tib ketgan bo‘lsa ham, hali quyosh tikkaga kelmasidan (Zavoldan oldin) hech narsa yeb-ichmagan bo‘lsangiz, qalbdan niyat qilib o‘sha kunning ro‘zasini davom ettirishingiz mumkin.',
        tip: 'Imkon qadar Bomdoddan 10–15 daqiqa oldin saharlikni yakunlab, og‘iz yopish sunnat va barakadir.',
      },
      {
        question: 'Ro‘zador holatda unutib yeb-ichib qo‘ysa ro‘za buziladimi?',
        answer: 'Yo‘q! Payg‘ambarimiz ﷺ: «Kim ro‘zador holda unutib yeb yoki ichib qo‘ysa, ro‘zasini oxiriga yetkazsin; uni Alloh yedirdi va ichirdi», deb marhamat qilganlar. Esga tushgan zahoti og‘izdagini chiqarib, ro‘zani davom ettiriladi.',
        tip: 'Unutib yeb qo‘yganda o‘sha kun uchun qazo ham, kafforat ham lozim bo‘lmaydi.',
      },
      {
        question: 'Tish yuvish (misvok / cho‘tka) va g‘usl qilish mumkinmi?',
        answer: 'Ha, suv yoki tish pastasi halqumdan (tomoqdan) ichkariga o‘tib ketmasligi sharti bilan tish tozalash va salqinlanish uchun cho‘milish joiz. Ammo ehtiyotsizlik tufayli ichkariga suv ketsa, ro‘za buziladi.',
        tip: 'Kunduzi pastasiz namlangan cho‘tka yoki misvok ishlatish eng xavfsiz va afzal yo‘ldir.',
      },
      {
        question: 'Qachon og‘iz ochish (iftor) sunnatga muvofiq?',
        answer: 'Shom vaqti kirishi bilanoq kechiktirmasdan xurmo yoki toza suv bilan og‘iz ochish sunnat. Hadisda insonlar iftorni tezlatganlaricha yaxshilikda bardavom bo‘lishlari aytilgan.',
        tip: 'Iftor paytida duolar ijobat bo‘ladi — «Allohumma laka sumtu...» to‘liq duosini o‘qib, ota-ona va yaqinlar haqqiga duo qiling.',
      },
    ],
  },
  uz_cyr: {
    daysLeftLabel: 'кун қолди',
    reachingDuaArabic: 'اللَّهُمَّ بَارِكْ لَنَا فِي رَجَبٍ وَشَعْبَانَ وَبَلِّغْنَا رَمَضَانَ',
    reachingDuaMeaning: 'Аллоҳим, бизга Ражаб ва Шаъбонда барака бер ва Рамазонга етказгин',
    autoOpenNotice: 'Бу саҳифа Рамазон бошланганда автоматик очилади',
    prepTitle: 'Рамазонга ўзингизни шу амалларга тайёрланг',
    prepSubtitle: 'Муборак ой кириб келишидан олдин қалб ва танани гўзал одатларга кўниктириб боринг:',
    activities: [
      {
        id: 'quran',
        title: 'Кунлик Қуръон тиловати одати',
        encouragement: 'Ҳар намоздан кейин атиги бир неча саҳифа ўқишни бошланг — шунда Рамазонда тўлиқ хатм қилиш енгил ва лаззатли бўлади.',
      },
      {
        id: 'fasting',
        title: 'Душанба ва Пайшанба нафл рўзалари',
        encouragement: 'Ойда бир неча марта суннат рўза тутиш нафсингизни чиниқтиради ва Рамазоннинг илк кунларини осойишта ўтказишга ёрдам беради.',
      },
      {
        id: 'night',
        title: 'Бомдоддан олдин уйғониш ва дуо',
        encouragement: 'Тонгдан 15 дақиқа аввал уйғониб икки ракат таҳажжуд ва дуо қилишга одатланинг — саҳарликка туриш осонлашади.',
      },
      {
        id: 'character',
        title: 'Тил ва қалбни поклаш',
        encouragement: 'Гина-кудуратни кечиринг, ортиқча гап ва жаҳлни зикр ҳамда сабр билан алмаштиринг — Рамазон пок қалбда янада файзли бўлади.',
      },
      {
        id: 'charity',
        title: 'Қазо рўзалар ва эҳсон режаси',
        encouragement: 'Аввалги қолган қазо рўзаларингизни тутиб қўйинг ва муҳтожларга ёрдам бериш учун ҳозирдан ният ҳамда эҳсон ажратинг.',
      },
    ],
    duasBtnTitle: 'Саҳарлик ва Ифторлик дуолари',
    duasBtnSubtitle: 'Тўлиқ матн ва таржима',
    rulesBtnTitle: 'Рўза қоидалари ва савол-жавоб',
    rulesBtnSubtitle: 'Муҳим фиқҳий эслатмалар',
    duasModalTitle: 'Саҳарлик, Ифторлик ва Рамазон дуолари',
    rulesModalTitle: 'Рўза қоидалари ва савол-жавоблар',
    practicalTipPrefix: 'Муҳим эслатма:',
    qaBadge: 'С/Ж',
    rules: [
      {
        question: 'Саҳарликка ухлаб қолса нима бўлади?',
        answer: 'Саҳарлик вақти (Бомдод кириши) ўтиб кетган бўлса ҳам, ҳали қуёш тиккага келмасидан (Заволдан олдин) ҳеч нарса еб-ичмаган бўлсангиз, қалбдан ният қилиб ўша куннинг рўзасини давом эттиришингиз мумкин.',
        tip: 'Имкон қадар Бомдоддан 10–15 дақиқа олдин саҳарликни якунлаб, оғиз ёпиш суннат ва баракадир.',
      },
      {
        question: 'Рўзадор ҳолатда унутиб еб-ичиб қўйса рўза бузиладими?',
        answer: 'Йўқ! Пайғамбаримиз ﷺ: «Ким рўзадор ҳолда унутиб еб ёки ичиб қўйса, рўзасини охирига етказсин; уни Аллоҳ едирди ва ичирди», деб марҳамат қилганлар. Эсга тушган заҳоти оғиздагини чиқариб, рўзани давом эттирилади.',
        tip: 'Унутиб еб қўйганда ўша кун учун қазо ҳам, каффорат ҳам лозим бўлмайди.',
      },
      {
        question: 'Тиш ювиш (мисвок / чўтка) ва ғусл қилиш мумкинми?',
        answer: 'Ҳа, сув ёки тиш пастаси ҳалқумдан (томоқдан) ичкарига ўтиб кетмаслиги шарти билан тиш тозалаш ва салқинланиш учун чўмилиш жоиз. Аммо эҳтиётсизлик туфайли ичкарига сув кетса, рўза бузилади.',
        tip: 'Кундузи пастасиз намланган чўтка ёки мисвок ишлатиш энг хавфсиз ва афзал йўлдир.',
      },
      {
        question: 'Қачон оғиз очиш (ифтор) суннатга мувофиқ?',
        answer: 'Шом вақти кириши биланоқ кечиктирмасдан хурмо ёки тоза сув билан оғиз очиш суннат. Ҳадисда инсонлар ифторни тезлатганларича яхшиликда бардавом бўлишлари айтилган.',
        tip: 'Ифтор пайтида дуолар ижобат бўлади — «Аллоҳумма лака сумту...» тўлиқ дуосини ўқиб, ота-она ва яқинлар ҳаққига дуо қилинг.',
      },
    ],
  },
  en: {
    daysLeftLabel: 'days left',
    reachingDuaArabic: 'اللَّهُمَّ بَارِكْ لَنَا فِي رَجَبٍ وَشَعْبَانَ وَبَلِّغْنَا رَمَضَانَ',
    reachingDuaMeaning: 'O Allah, bless us in Rajab and Sha’ban, and let us reach Ramadan',
    autoOpenNotice: 'This page will automatically open when Ramadan starts',
    prepTitle: 'Prepare yourself for Ramadan with these habits',
    prepSubtitle: 'Start building gentle, consistent steps now so your heart greets the blessed month ready and energized:',
    activities: [
      {
        id: 'quran',
        title: 'Build a daily Quran rhythm',
        encouragement: 'Reading even 2–4 pages after each prayer starting today makes completing the Quran in Ramadan smooth and deeply rewarding.',
      },
      {
        id: 'fasting',
        title: 'Practice Monday & Thursday fasting',
        encouragement: 'A few voluntary fasts ahead of time prepare both your body and discipline so the first week of Ramadan feels peaceful.',
      },
      {
        id: 'night',
        title: 'Wake up early for quiet Dua & Qiyam',
        encouragement: 'Try rising 15 minutes before Fajr for two rakats and sincere Dua — waking up for Suhoor will soon feel effortless.',
      },
      {
        id: 'character',
        title: 'Guard your speech & soften your heart',
        encouragement: 'Forgive old grudges and replace rushed frustration with dhikr and patience — Ramadan shines brightest in a tranquil heart.',
      },
      {
        id: 'charity',
        title: 'Complete Qazo fasts & plan generosity',
        encouragement: 'Clear any missed fasts from previous years and set aside charity early to multiply blessings when Ramadan begins.',
      },
    ],
    duasBtnTitle: 'Suhoor & Iftar Duas',
    duasBtnSubtitle: 'Complete texts & meaning',
    rulesBtnTitle: 'Fasting Rules & Q&A',
    rulesBtnSubtitle: 'Essential guidance',
    duasModalTitle: 'Essential Ramadan Duas',
    rulesModalTitle: 'Fasting Rules & Q&A',
    practicalTipPrefix: 'Note:',
    qaBadge: 'Q&A',
    rules: [
      {
        question: 'What if I oversleep and miss Suhoor?',
        answer: 'Your fast is still valid! Even if Fajr time has already started, as long as you have eaten or drunk nothing and form the intention from the heart before midday (Zawal), you can continue fasting.',
        tip: 'Whenever possible, wake up for Suhoor because the Prophet ﷺ said: "Take Suhoor, for in Suhoor there is blessing."',
      },
      {
        question: 'Does eating or drinking forgetfully break the fast?',
        answer: 'No. The Prophet ﷺ said whoever eats or drinks out of forgetfulness should complete their fast, for Allah fed and gave them drink. Stop as soon as you remember and keep fasting.',
        tip: 'Neither Qazo nor expiation (Kaffarah) is required for accidental eating or drinking.',
      },
      {
        question: 'Are brushing teeth and showering allowed while fasting?',
        answer: 'Yes, using a miswak, dry/lightly damp brush, or showering to cool down is permitted as long as water or toothpaste is not swallowed down the throat.',
        tip: 'Brushing thoroughly right after Suhoor and avoiding flavored toothpaste during daytime helps stay cautious.',
      },
      {
        question: 'When should Iftar be broken and what is the Sunnah?',
        answer: 'Break the fast immediately once Maghrib enters with fresh or dried dates, or plain water, before praying Maghrib.',
        tip: 'Duas at Iftar are not rejected — recite the full Iftar Dua ("Allahumma laka sumtu... fagfir li ya Ghaffar...") and supplicate for your loved ones.',
      },
    ],
  },
  ru: {
    daysLeftLabel: 'дн. осталось',
    reachingDuaArabic: 'اللَّهُمَّ بَارِكْ لَنَا فِي رَجَبٍ وَشَعْبَانَ وَبَلِّغْنَا رَمَضَانَ',
    reachingDuaMeaning: 'О Аллах, благослови нас в Раджабе и Шаабане и позволь нам достичь Рамадана',
    autoOpenNotice: 'Эта страница откроется автоматически с наступлением Рамадана',
    prepTitle: 'Подготовьте себя к Рамадану с этими делами',
    prepSubtitle: 'Начните прививать себе эти благие привычки заранее, чтобы встретить священный месяц с лёгкостью и радостью:',
    activities: [
      {
        id: 'quran',
        title: 'Ежедневное чтение Корана',
        encouragement: 'Начните читать хотя бы по 2–4 страницы после каждого намаза уже сейчас — и в Рамадан полное прочтение (хатм) дастся легко.',
      },
      {
        id: 'fasting',
        title: 'Добровольный пост (Пн / Чт)',
        encouragement: 'Несколько дней поста по Сунне заранее укрепят тело и дух, чтобы первые дни Рамадана прошли спокойно.',
      },
      {
        id: 'night',
        title: 'Раннее пробуждение перед Фаджром',
        encouragement: 'Приучайтесь вставать на 15 минут раньше утреннего намаза для двух ракаатов и дуа — сухур станет привычным и благодатным.',
      },
      {
        id: 'character',
        title: 'Чистота речи и сердца',
        encouragement: 'Простите старые обиды и заменяйте спешку на зикр и терпение — благодать Рамадана особенно ощутима в мягком сердце.',
      },
      {
        id: 'charity',
        title: 'Восполнение Када и план садака',
        encouragement: 'Восполните пропущенные посты прошлых лет и заранее отложите средства на милостыню к началу священного месяца.',
      },
    ],
    duasBtnTitle: 'Дуа для Сухура и Ифтара',
    duasBtnSubtitle: 'Полный текст и перевод',
    rulesBtnTitle: 'Правила поста и вопросы',
    rulesBtnSubtitle: 'Важные ответы',
    duasModalTitle: 'Основные дуа Рамадана',
    rulesModalTitle: 'Правила поста и ответы на вопросы',
    practicalTipPrefix: 'Совет:',
    qaBadge: 'В/О',
    rules: [
      {
        question: 'Что делать, если проспал сухур?',
        answer: 'Пост всё равно действителен! Если с наступления Фаджра вы ничего не ели и не пили, можно вознамериться сердцем до полудня (заваля) и продолжать пост.',
        tip: 'По возможности старайтесь вставать на сухур, так как Пророк ﷺ сказал: «Ешьте сухур, ведь в нём благодать».',
      },
      {
        question: 'Нарушает ли пост еда или питьё по забывчивости?',
        answer: 'Нет! Если постящийся поел или попил по забывчивости, он прекращает, как только вспомнит, и продолжает пост — его накормил Сам Аллах.',
        tip: 'За случайный глоток или еду по забывчивости ни восполнения (када), ни искупления не требуется.',
      },
      {
        question: 'Можно ли чистить зубы и принимать душ в пост?',
        answer: 'Да, пользоваться сиваком, слегка влажной щёткой или принимать прохладный душ разрешено при условии, что вода и паста не попадут в горло.',
        tip: 'Надёжнее чистить зубы с пастой сразу после сухура, а днём ограничиваться мисваком.',
      },
      {
        question: 'Когда нужно разговляться и что читать на ифтар?',
        answer: 'По Сунне важно не откладывать разговение и открыть пост сразу с наступлением Магриба фиником или водой.',
        tip: 'Время ифтара — момент принятия дуа: прочтите полное дуа «Аллахумма ляка сумту... фагфир ли йа Гаффар...» и помолитесь за близких.',
      },
    ],
  },
};
