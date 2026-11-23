import { AppLanguage } from '../types';
import { latinToCyrillicUz } from '../utils/uzbekScript';

export type BookCategory = 'all' | 'fiqh' | 'hadith' | 'spirituality' | 'favorites';

export interface LocalizedBookText {
  uz_lat: string;
  ru: string;
  en: string;
}

export interface BookChapter {
  id: string;
  number: number;
  title: LocalizedBookText;
  /** Public-domain classical Arabic or Chagatai/Old-Uzbek primary source excerpt */
  sourceQuote?: string;
  sourceLabel?: LocalizedBookText;
  paragraphs: {
    uz_lat: string[];
    ru: string[];
    en: string[];
  };
  takeaway: LocalizedBookText;
}

export interface ClassicalBook {
  id: string;
  category: 'fiqh' | 'hadith' | 'spirituality';
  coverTheme: 'emerald' | 'walnut' | 'navy' | 'burgundy' | 'teal';
  arabicTitle: string;
  title: LocalizedBookText;
  author: LocalizedBookText;
  era: string;
  /** Public domain justification shown cleanly in Book Info */
  heritageBadge: LocalizedBookText;
  summary: LocalizedBookText;
  chapters: BookChapter[];
}

export function resolveBookText(text: LocalizedBookText, lang: AppLanguage): string {
  if (lang === 'uz_cyr') return latinToCyrillicUz(text.uz_lat);
  if (lang === 'ru') return text.ru;
  if (lang === 'en') return text.en;
  return text.uz_lat;
}

export function resolveBookParagraphs(
  paragraphs: BookChapter['paragraphs'],
  lang: AppLanguage
): string[] {
  if (lang === 'uz_cyr') return paragraphs.uz_lat.map((p) => latinToCyrillicUz(p));
  if (lang === 'ru') return paragraphs.ru;
  if (lang === 'en') return paragraphs.en;
  return paragraphs.uz_lat;
}

export const CLASSICAL_BOOKS_PART_1: ClassicalBook[] = [
  {
    id: 'navaviy-arbain',
    category: 'hadith',
    coverTheme: 'emerald',
    arabicTitle: 'الأربعون النووية',
    title: {
      uz_lat: 'Arba’in (Qirq Hadis)',
      ru: 'Сорок хадисов (Арбаин)',
      en: 'Al-Arba’in (Forty Hadiths)',
    },
    author: {
      uz_lat: 'Imom Yahyo ibn Sharaf an-Navaviy',
      ru: 'Имам Яхья ибн Шараф ан-Навави',
      en: 'Imam Yahya ibn Sharaf al-Nawawi',
    },
    era: '1233–1277',
    heritageBadge: {
      uz_lat: 'Klassik meros · XIII asr',
      ru: 'Классическое наследие · XIII в.',
      en: 'Classical Public Domain · 13th c.',
    },
    summary: {
      uz_lat: 'Islom dinining asosiy ustunlari, ixlos, odob va qalb pokligini jamlagan eng mashhur qirq hadis sharhi.',
      ru: 'Знаменитый классический сборник основополагающих хадисов об искренности, столпах Ислама, благонравии и чистоте сердца.',
      en: 'The timeless classical collection of foundational Prophetic traditions on sincerity, pillars of faith, ethics, and purity of heart.',
    },
    chapters: [
      {
        id: 'nav-1',
        number: 1,
        title: {
          uz_lat: 'Amallar niyatga bog‘liqdir',
          ru: 'Дела оцениваются по намерениям',
          en: 'Actions Are Judged by Intentions',
        },
        sourceQuote: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
        sourceLabel: {
          uz_lat: '1-hadis · Imom Buxoriy va Muslim rivoyati',
          ru: 'Хадис №1 · Аль-Бухари и Муслим',
          en: 'Hadith 1 · Sahih al-Bukhari & Muslim',
        },
        paragraphs: {
          uz_lat: [
            'Imom Navaviy o‘zining mashhur «Arba’in» to‘plamini aynan niyat hadisi bilan boshlagan. Ulamolar ushbu hadisni Islom ilmining uchdan bir qismi deb ataganlar, chunki bandaning barcha zohiriy va botiniy amallari qalbdagi maqsad bilan qadr topadi.',
            'Bir xil ibodat yoki oddiy kundalik ish — masalan, halol rizq topish, ilm o‘rganish yoki oilaga yordam berish — faqat Alloh roziligi uchun qilinsa, savobli ibodatga aylanadi. Aksincha, riyo va maqtov uchun qilingan ulkan ish ham barakasini yo‘qotadi.',
            'Shuning uchun har bir ishni boshlashdan avval bir lahza to‘xtab: «Men buni kimning roziligi uchun qilyapman?» deb o‘zidan so‘rash mo‘minning eng go‘zal odatidir.',
          ],
          ru: [
            'Имам ан-Навави открыл свой знаменитый сборник именно хадисом о намерении. Учёные называли этот хадис третью всей религии, поскольку ценность любого внешнего поступка определяется тем, что скрыто в сердце человека.',
            'Даже повседневные дела — честный труд, забота о семье, стремление к знаниям — превращаются в поклонение, когда совершаются ради довольства Всевышнего. И напротив, великое дело лишается благодати, если им движет показуха.',
            'Перед началом любого дела полезно на мгновение остановиться и искренне спросить себя: «Ради чего я совершаю этот шаг?»',
          ],
          en: [
            'Imam al-Nawawi deliberately opened his celebrated Forty Hadiths with the tradition of intention. Classical jurists described this single hadith as a third of all Islamic knowledge, because every outward deed takes its spiritual weight from the heart’s inner aim.',
            'Even ordinary daily routines—earning an honest livelihood, caring for family, or studying—become acts of worship when rooted in sincerity. Conversely, outward grandeur loses its spiritual fruit when driven by ostentation.',
            'Pausing for one quiet breath before beginning any deed to renew sincerity transforms routine life into continuous remembrance.',
          ],
        },
        takeaway: {
          uz_lat: 'Har tong va har yangi ish oldidan niyatni yangilang: «Yo Robbim, ushbu amalimni O‘zingning roziliging uchun xolis qil».',
          ru: 'Обновляйте намерение каждое утро и перед каждым важным делом, стремясь к искренности перед Всевышним.',
          en: 'Renew your intention each morning and before major tasks: sincerity turns ordinary effort into lasting reward.',
        },
      },
      {
        id: 'nav-2',
        number: 2,
        title: {
          uz_lat: 'Islom, Imon va Ehson (Jibril hadisi)',
          ru: 'Ислам, Иман и Ихсан (Хадис Джибриля)',
          en: 'Islam, Iman, and Ihsan (Hadith of Jibril)',
        },
        sourceQuote: 'الإِحْسَانُ أَنْ تَعْبُدَ اللَّهَ كَأَنَّكَ تَرَاهُ، فَإِنْ لَمْ تَكُنْ تَرَاهُ فَإِنَّهُ يَرَاكَ',
        sourceLabel: {
          uz_lat: '2-hadis · Imom Muslim rivoyati',
          ru: 'Хадис №2 · Сахих Муслим',
          en: 'Hadith 2 · Sahih Muslim',
        },
        paragraphs: {
          uz_lat: [
            'Hazrati Umar (r.a.) rivoyat qilgan ushbu ulug‘ hadisda Jabroil (a.s.) inson qiyofasida kelib, sahobalarga dinning uch asosiy bosqichini — Islom, Imon va Ehsonni ta’lim berganlar.',
            'Islom — zohiriy ibodatlar: shahodat, besh vaqt namoz, zakot, Ramazon ro‘zasi va qodir kishiga hajdir. Imon esa qalb e’tiqodi: Allohga, farishtalarga, ilohiy kitoblarga, payg‘ambarlarga, oxirat kuniga va qadarning yaxshi-yomoniga ishonishdir.',
            'Eng oliy maqom bo‘lmish Ehson — Allohni ko‘rib turgandek ibodat qilish, agar sen Uni ko‘rmasang-da, U seni doimo ko‘rib turganini his etib yashashdir. Ehson insonni yolg‘izlikda ham pok va adolatli saqlaydi.',
          ],
          ru: [
            'В этом великом хадисе от Умара (р.а.) ангел Джибриль (а.с.) предстал в облике путника, чтобы научить сподвижников трём ступеням религии: Исламу, Иману и Ихсану.',
            'Ислам охватывает внешние столпы поклонения: свидетельство веры, пятикратный намаз, закят, пост в Рамадан и хадж. Иман — убеждённость сердца в Аллахе, ангелах, Писаниях, пророках, Судном дне и предопределении.',
            'Высшая ступень, Ихсан — это поклонение Аллаху так, словно ты видишь Его, а если не видишь, то помнишь, что Он всегда видит тебя. Это живое ощущение присутствия Творца хранит человека от несправедливости даже наедине с собой.',
          ],
          en: [
            'In this foundational narrative transmitted by Umar ibn al-Khattab (r.a.), Angel Jibril (a.s.) appeared before the Companions to map the three ascending dimensions of the faith: Islam, Iman, and Ihsan.',
            'Islam anchors outward devotion through the testimony of faith, five daily prayers, zakat, Ramadan fasting, and pilgrimage. Iman anchors inner conviction in Allah, His angels, scriptures, messengers, the Last Day, and divine decree.',
            'Ihsan crowns both: worshiping Allah as though you see Him, and knowing that though you do not see Him, He sees you. Living with this awareness nurtures excellence in worship and integrity in private.',
          ],
        },
        takeaway: {
          uz_lat: 'Namozda va odamlar bilan muomalada Ehsonni eslang — Alloh ko‘rib turganini his qilgan qalb xotirjam bo‘ladi.',
          ru: 'Помните об Ихсане в молитве и в общении с людьми — осознание взгляда Всевышнего дарит сердцу покой и честность.',
          en: 'Carry the awareness of Ihsan into both prayer and daily dealings—it brings calm focus and quiet honesty.',
        },
      },
      {
        id: 'nav-3',
        number: 3,
        title: {
          uz_lat: 'Halol aniq, harom aniq va qalb salomatligi',
          ru: 'Явное дозволенное, запретное и чистота сердца',
          en: 'Clarity of Halal & Haram and the Sound Heart',
        },
        sourceQuote: 'أَلَا وَإِنَّ فِي الْجَسَدِ مُضْغَةً إِذَا صَلَحَتْ صَلَحَ الْجَسَدُ كُلُّهُ... أَلَا وَهِيَ الْقَلْبُ',
        sourceLabel: {
          uz_lat: '6-hadis · Imom Buxoriy va Muslim rivoyati',
          ru: 'Хадис №6 · Аль-Бухари и Муслим',
          en: 'Hadith 6 · Sahih al-Bukhari & Muslim',
        },
        paragraphs: {
          uz_lat: [
            'Rasululloh ﷺ halol va haromning ochiq-oydin ekanini, ularning o‘rtasida esa ko‘pchilik bilmaydigan shubhali narsalar borligini ta’kidladilar. Kim shubhalardan saqlansa, dini va obro‘sini asrab qoladi.',
            'Hadisning yakunida inson hayotining markazi ko‘rsatiladi: «Ogoh bo‘ling, tanada bir parcha go‘sht bor; u tuzalsa, butun tana tuzaladi, u buzilsa, butun tana buziladi — u qalbdir».',
            'Shu bois faqat tashqi ko‘rinishni emas, qalbni hasad, kibr va g‘aflatdan poklash har bir musulmonning eng muhim kundalik vazifasidir.',
          ],
          ru: [
            'Пророк ﷺ разъяснил, что дозволенное и запретное очевидны, а между ними есть сомнительные вещи. Тот, кто остерегается сомнительного, оберегает свою религию и честь.',
            'В завершении хадиса раскрывается центр духовной жизни человека: «Поистине, в теле есть кусочек плоти: если он праведен, праведно всё тело; если он испорчен, испорчено всё тело — это сердце».',
            'Очищение сердца от зависти, гордыни и беспечности делает правильными и слова, и поступки.',
          ],
          en: [
            'The Prophet ﷺ taught that what is lawful and unlawful is clear, while between them lie doubtful matters. Guarding oneself against doubtful gray areas protects both faith and personal honor.',
            'The hadith concludes by identifying the true compass of a human being: "Surely in the body is a piece of flesh—if it is sound, the whole body is sound; if it is corrupt, the whole body is corrupt. Truly, it is the heart."',
            'Tending the heart against envy, pride, and heedlessness naturally refines outward speech and character.',
          ],
        },
        takeaway: {
          uz_lat: 'Shubhali foydadan voz kechib, halol va xotirjam yo‘lni tanlang — qalb halovatini aynan shu saqlaydi.',
          ru: 'Отказ от сомнительной выгоды ради чистого и дозволенного хранит спокойствие и свет сердца.',
          en: 'Leave doubtful gains for what is clearly lawful—peace of heart lives in clarity.',
        },
      },
      {
        id: 'nav-4',
        number: 4,
        title: {
          uz_lat: 'Go‘zal xulq, muloyim so‘z va qardoshlik',
          ru: 'Благонравие, доброе слово и братство',
          en: 'Noble Character, Gentle Speech & Brotherhood',
        },
        sourceQuote: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
        sourceLabel: {
          uz_lat: '13, 15 va 18-hadislar jamlamasi',
          ru: 'Хадисы №13, 15 и 18 · Ан-Навави',
          en: 'Hadiths 13, 15 & 18 · Al-Nawawi',
        },
        paragraphs: {
          uz_lat: [
            'Imom Navaviy jamlagan ijtimoiy odob hadislari uch oltin qoidaga tayanadi: o‘zingga ravo ko‘rgan yaxshilikni birodaringga ham ravo ko‘rish, faqat foydali so‘z aytish yoki sukut saqlash, hamda odamlar bilan chiroyli xulq ila muomala qilish.',
            'Tilni g‘iybat, behuda bahs va ranjituvchi so‘zlardan tiyish imonning amaliy belgisidir. Qo‘shniga hurmat va mehmonga izzat ham aynan shu hadisda imon bilan bog‘langan.',
            'Agar inson xato qilib qo‘ysa, uning ortidan darhol yaxshilik qilish o‘sha xatoning izini yuvadi. Bu umidsizlikka tushmasdan doimo isloh sari intilishga o‘rgatadi.',
          ],
          ru: [
            'Социальная этика сборника строится на трёх золотых правилах: желать брату того же блага, что и себе, говорить благое или хранить молчание, и проявлять прекрасный нрав в общении с людьми.',
            'Сдержанность языка от сплетен и резких слов, уважение к соседу и радушие к гостю названы прямыми признаками живой веры.',
            'А если человек оступился, Пророк ﷺ учит сразу совершить благое дело вслед за проступком, чтобы стереть его след и не впадать в отчаяние.',
          ],
          en: [
            'The social ethics of Al-Arba’in rest on three golden habits: loving for your neighbor what you love for yourself, speaking good or keeping a dignified silence, and meeting people with noble character.',
            'Restraining the tongue from gossip and harshness, honoring neighbors, and welcoming guests are linked directly to belief in Allah and the Last Day.',
            'Whenever a person slips, following a mistake immediately with a good deed erases its trace—teaching steady growth without despair.',
          ],
        },
        takeaway: {
          uz_lat: 'Gapirishdan oldin uch narsani o‘ylang: bu so‘z to‘g‘rimi, foydalimi va ko‘ngilni og‘ritmaydimi?',
          ru: 'Прежде чем сказать слово, проверьте его: правдиво ли оно, полезно ли и не ранит ли сердце другого?',
          en: 'Before speaking, weigh every word: is it true, helpful, and kind?',
        },
      },
    ],
  },
  {
    id: 'gazzoliy-ey-farzand',
    category: 'spirituality',
    coverTheme: 'walnut',
    arabicTitle: 'أيها الولد',
    title: {
      uz_lat: 'Ey Farzand (Ayyuhal Valad)',
      ru: 'О сын мой! (Айюхаль-Валад)',
      en: 'Letter to a Disciple (Ayyuhal Walad)',
    },
    author: {
      uz_lat: 'Imom Abu Homid al-G‘azzoliy',
      ru: 'Имам Абу Хамид аль-Газали',
      en: 'Imam Abu Hamid al-Ghazali',
    },
    era: '1058–1111',
    heritageBadge: {
      uz_lat: 'Klassik meros · XI–XII asr',
      ru: 'Классическое наследие · XI–XII вв.',
      en: 'Classical Public Domain · 11th–12th c.',
    },
    summary: {
      uz_lat: 'Hujjatul Islom Imom G‘azzoliyning shogirdiga yozgan samimiy nasihatnomasi: amalsiz ilmning zarari, vaqt qadri va qalb tarbiyasi.',
      ru: 'Искреннее духовное наставление имама аль-Газали своему ученику: о единстве знания и поступков, цене времени и воспитании души.',
      en: 'Imam al-Ghazali’s intimate letter of fatherly counsel to his longtime student on uniting knowledge with action, guarding time, and inner refinement.',
    },
    chapters: [
      {
        id: 'gaz-1',
        number: 1,
        title: {
          uz_lat: 'Amalsiz ilm — mevasiz daraxtdir',
          ru: 'Знание без дел подобно дереву без плодов',
          en: 'Knowledge Without Action Bears No Fruit',
        },
        sourceQuote: 'أَيُّهَا الْوَلَدُ، الْعِلْمُ بِلَا عَمَلٍ جُنُونٌ، وَالْعَمَلُ بِلَا عِلْمٍ لَا يَكُونُ',
        sourceLabel: {
          uz_lat: 'Imom G‘azzoliy · Ayyuhal Valad',
          ru: 'Имам аль-Газали · Айюхаль-Валад',
          en: 'Imam al-Ghazali · Ayyuhal Walad',
        },
        paragraphs: {
          uz_lat: [
            'Uzoq yillar ilm tahsil qilgan bir shogird ustozi Imom G‘azzoliyga murojaat qilib: «Ustoz, umrim bo‘yi ko‘p kitob o‘qidim, endi menga qabrimda ham, oxiratda ham hamroh bo‘ladigan eng zarur nasihatni yozib bering», deb so‘radi.',
            'Imom G‘azzoliy samimiyat bilan javob berdilar: «Ey farzand! Agar inson yuz yil ilm o‘qib, minglab kitob to‘plasa-yu, unga amal qilmasa, bu ilm uni Allohning rahmatiga yaqinlashtirmaydi. Ilm — yo‘l chirog‘i, amal esa o‘sha yo‘ldan yurishdir».',
            'Odamning hayotini ko‘p narsani bilish emas, balki bilgan ozgina haqiqatiga sadoqat bilan amal qilish o‘zgartiradi.',
          ],
          ru: [
            'Один из старших учеников обратился к имаму аль-Газали с просьбой дать краткое наставление, которое станет его опорой на всю жизнь и принесёт пользу в вечности.',
            'Имам ответил с отеческой теплотой: «О сын мой! Даже если человек проведёт сто лет в чтении и соберёт тысячи книг, без воплощения знаний в делах они не приблизят его к милости Всевышнего. Знание — это свет, а поступок — шаг по освещённой дороге».',
            'Душу меняет не обилие прочитанных страниц, а верность хотя бы малой истине, воплощённой в повседневной жизни.',
          ],
          en: [
            'After years of studying many disciplines, a devoted student wrote to Imam al-Ghazali asking for a concise counsel that would benefit him in life and accompany him into eternity.',
            'Al-Ghazali replied gently: "O dear son! Even if a person studies for a hundred years and gathers a thousand books, knowledge left unpracticed does not draw one closer to divine mercy. Knowledge is the lantern; action is walking the road."',
            'What transforms character is not collecting endless information, but faithfully living out the wisdom we already know.',
          ],
        },
        takeaway: {
          uz_lat: 'Bugun o‘qigan yoki bilgan bitta yaxshi amalni kechiktirmasdan hayotingizga tatbiq eting.',
          ru: 'Воплотите в жизнь хотя бы одно благое знание уже сегодня — малое, но постоянное дело ценнее громких слов.',
          en: 'Put one lesson you already know into action today—small, steady practice outweighs endless reading.',
        },
      },
      {
        id: 'gaz-2',
        number: 2,
        title: {
          uz_lat: 'Umr va vaqtning bebaho qadri',
          ru: 'Бесценность времени и отпущенных дней',
          en: 'Guarding the Priceless Gift of Time',
        },
        sourceQuote: 'إِنَّ مِنْ عَلَامَةِ إِعْرَاضِ اللَّهِ تَعَالَى عَنِ الْعَبْدِ اشْتِغَالَهُ بِمَا لَا يَعْنِيهِ',
        sourceLabel: {
          uz_lat: 'Imom G‘azzoliy nasihati',
          ru: 'Наставление имама аль-Газали',
          en: 'Counsel of Imam al-Ghazali',
        },
        paragraphs: {
          uz_lat: [
            'Imom G‘azzoliy shogirdini umrni befoyda bahslar, g‘iybat va foydasiz mashg‘ulotlarda zoye qilishdan qattiq ogohlantiradi: «Ey farzand! O‘tgan bir soatingni hech qanday boylik evaziga qaytara olmaysan».',
            'Insonning yoshi qirqdan oshib, yaxshiliklari yomonliklaridan ustun kelmasa, darhol o‘zini hisob-kitob qilishi lozim. Har bir tong — yangi imkoniyat, har bir tun — qalbni sarhisob qilish fursatidir.',
            'Keraksiz ishlardan yuz o‘girish qalbga sokinlik, zehniga ravshanlik va ibodatiga lazzat olib keladi.',
          ],
          ru: [
            'Имам аль-Газали предостерегает ученика от растраты жизни на пустые споры и бесполезные занятия: «О сын мой! Никаким богатством мира невозможно вернуть один напрасно прожитый час».',
            'Каждое утро — новый дар и возможность стать лучше, а каждый вечер — тихая минута для честного самоотчёта перед сном.',
            'Отказ от суеты освобождает сердце для спокойствия, ясного разума и сладости молитвы.',
          ],
          en: [
            'Al-Ghazali warns against letting life slip away in needless arguments and distractions: "O dear son! No wealth on earth can buy back a single hour spent carelessly."',
            'Every morning is a fresh trust and every evening a quiet moment for honest self-reflection before sleep.',
            'Stepping away from trivial noise restores mental clarity, serenity, and presence in worship.',
          ],
        },
        takeaway: {
          uz_lat: 'Kechqurun uxlashdan oldin 2 daqiqa o‘zingizdan so‘rang: bugun qaysi yaxshi ish qildim va ertaga nimani yaxshilayman?',
          ru: 'Уделяйте две тихие минуты перед сном честному итогу дня: за что поблагодарить и что улучшить завтра.',
          en: 'Take two quiet minutes before sleep each night to reflect on what you did well and one thing to improve tomorrow.',
        },
      },
      {
        id: 'gaz-3',
        number: 3,
        title: {
          uz_lat: 'Sahar vaqtining nuri va kamtarlik',
          ru: 'Свет предрассветных часов и смирение',
          en: 'The Serenity of Dawn & Humility',
        },
        sourceQuote: 'وَبِالْأَسْحَارِ هُمْ يَسْتَغْفِرُونَ',
        sourceLabel: {
          uz_lat: 'Zoriyot surasi, 18-oyat · G‘azzoliy sharhi',
          ru: 'Сура Аз-Зарият, 18 · Размышление аль-Газали',
          en: 'Surah Adh-Dhariyat 51:18 · Al-Ghazali’s Reflection',
        },
        paragraphs: {
          uz_lat: [
            'Imom G‘azzoliy aytadi: «Ey farzand! Kechalari hamma uxlayotgan paytda sahar chog‘i uyg‘onib, qisqa bo‘lsa-da istig‘for va duo qilish qalbni yumshatadi». Tunning so‘nggi qismi duolar ijobat bo‘ladigan muborak palladir.',
            'Shuningdek, u zot to‘rt narsani aslo unutmaslikni vasiyat qiladi: Alloh bilan muomalada ixlos, insonlar bilan muomalada adolat, nafsga qarshi sabot va ne’matlarga shukr.',
            'Kamtarlik insonni pastlatmaydi, aksincha, Alloh huzurida ham, odamlar qalbida ham yuksalishiga sabab bo‘ladi.',
          ],
          ru: [
            'Имам напоминает: «О сын мой! Даже несколько минут искреннего поминания и просьбы о прощении на рассвете, когда мир ещё спит, смягчают сердце и наполняют день светом».',
            'Он завещает хранить четыре опоры: искренность перед Аллахом, справедливость к людям, терпение в воспитании собственного нрава и благодарность за каждую милость.',
            'Истинное смирение никогда не унижает человека — напротив, оно возвышает его достоинство.',
          ],
          en: [
            'Al-Ghazali counsels: "O dear son! Even a few quiet moments of seeking forgiveness before dawn, while the world sleeps, soften the heart and illuminate the entire day."',
            'He summarizes a balanced life in four anchors: sincerity toward Allah, fairness toward people, patience with oneself, and gratitude in every circumstance.',
            'True humility never diminishes a person—it quietly elevates dignity before both God and people.',
          ],
        },
        takeaway: {
          uz_lat: 'Bomdoddan biroz oldin uyg‘onib, sokinlikda «Astag‘firulloh» va samimiy duo aytishni odat qiling.',
          ru: 'Привыкните просыпаться чуть раньше фаджра хотя бы для двух минут тихого истигфара и дуа.',
          en: 'Wake just a few minutes before Fajr for quiet istighfar and heartfelt supplication.',
        },
      },
    ],
  },
  {
    id: 'maqsudiy-ibodati-islomiya',
    category: 'fiqh',
    coverTheme: 'teal',
    arabicTitle: 'عبادة إسلامية',
    title: {
      uz_lat: 'Ibodati Islomiya',
      ru: 'Ибадати Исламия (Основы поклонения)',
      en: 'Ibadat-i Islamiya (Hanafi Worship Manual)',
    },
    author: {
      uz_lat: 'Ahmad Hodiy Maqsudiy',
      ru: 'Ахмад Хади Максуди',
      en: 'Ahmad Hadi Maqsudi',
    },
    era: '1868–1941',
    heritageBadge: {
      uz_lat: 'Hanafiy klassik darslik · XX asr boshi',
      ru: 'Классический ханафитский учебник · нач. XX в.',
      en: 'Classic Hanafi Primer · Early 20th c.',
    },
    summary: {
      uz_lat: 'Markaziy Osiyo xalqlarining eng sevimli klassik Hanafiy qo‘llanmasi: imon, tahorat, g‘usl, namoz, ro‘za va zakotning ravon bayoni.',
      ru: 'Знаменитое классическое пособие по ханафитскому фикху: ясное изложение основ веры, омовения, намаза, поста и закята.',
      en: 'The beloved Central Asian classical Hanafi primer presenting faith, purification, prayer, fasting, and zakat in crystal-clear lessons.',
    },
    chapters: [
      {
        id: 'maq-1',
        number: 1,
        title: {
          uz_lat: 'Imon va Islom shartlari',
          ru: 'Столпы Имана и Ислама',
          en: 'Foundations of Iman and Islam',
        },
        sourceQuote: 'آمَنْتُ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ وَالْيَوْمِ الآخِرِ وَالْقَدَرِ خَيْرِهِ وَشَرِّهِ مِنَ اللَّهِ تَعَالَى',
        sourceLabel: {
          uz_lat: 'Imoni Mufassal · Ibodati Islomiya',
          ru: 'Иман Муфассаль · Ибадати Исламия',
          en: 'Detailed Creed · Ibadat-i Islamiya',
        },
        paragraphs: {
          uz_lat: [
            'Ahmad Hodiy Maqsudiy «Ibodati Islomiya» asarini har bir mo‘min bilishi shart bo‘lgan e’tiqod va ibodat asoslari bilan boshlaydi. Islom besh ustunga bino qilingan: kalimai shahodat, har kuni besh vaqt namoz, Ramazon ro‘zasi, nisobga yetgan moldan zakot va qodir bo‘lgan kishiga umrida bir marta haj.',
            'Imonning yetti rukni qalb bilan tasdiqlanib, til bilan iqror qilinadi: Allohning birligiga, farishtalariga, nozil qilgan kitoblariga, payg‘ambarlariga, qiyomat kuniga, yaxshilik va yomonlik Allohning taqdiri bilan bo‘lishiga hamda o‘limdan keyin qayta tirilishga ishonish.',
            'Ushbu asoslar to‘g‘ri bo‘lgandagina insonning barcha ibodatlari mustahkam poydevorga ega bo‘ladi.',
          ],
          ru: [
            'Ахмад Хади Максуди начинает «Ибадати Исламия» с основ веры и поклонения. Ислам опирается на пять столпов: свидетельство единобожия, ежедневный пятикратный намаз, пост в месяц Рамадан, закят с имущества, достигшего нисаба, и хадж раз в жизни при возможности.',
            'Вера (Иман) охватывает убеждённость сердца в Едином Аллахе, Его ангелах, Писаниях, посланниках, Судном дне, предопределении добра и зла и воскрешении после смерти.',
            'Когда фундамент веры твёрд и ясен, каждое поклонение обретает глубину и постоянство.',
          ],
          en: [
            'Ahmad Hadi Maqsudi opens his classic Hanafi manual with the pillars every Muslim builds upon: the testimony of faith, five daily prayers, Ramadan fasting, zakat for those meeting the threshold, and Hajj once in a lifetime if able.',
            'Iman comprises heartfelt conviction in Allah, His angels, revealed books, messengers, the Day of Judgment, divine decree of good and hardship, and resurrection after death.',
            'When creed is sound and clear, every outward act of worship stands on firm ground.',
          ],
        },
        takeaway: {
          uz_lat: 'Farzandlarga va o‘zimizga «Imoni Mufassal» ma’nosini ravon tushunish eng go‘zal ma’naviy poydevordir.',
          ru: 'Ясное понимание смысла «Иман Муфассаль» — лучшая духовная опора для каждого мусульманина и его семьи.',
          en: 'Understanding the meaning of Iman Mufassal builds a clear spiritual foundation for the whole family.',
        },
      },
      {
        id: 'maq-2',
        number: 2,
        title: {
          uz_lat: 'Tahorat va G‘uslning farzlari (Hanafiy)',
          ru: 'Фарды омовения (Вуду) и Гусля по Ханафи',
          en: 'Obligatory Acts of Wudu & Ghusl (Hanafi)',
        },
        sourceQuote: 'الطُّهُورُ شَطْرُ الإِيمَانِ',
        sourceLabel: {
          uz_lat: 'Poklik imonning yarmidir · Sahihi Muslim',
          ru: 'Чистота — половина веры · Сахих Муслим',
          en: 'Purification is half of faith · Sahih Muslim',
        },
        paragraphs: {
          uz_lat: [
            'Hanafiy mazhabida tahoratning to‘rtta farzi bor: 1) yuzni soch chiqqan joydan iyak ostigacha va quloqdan quloqqacha yuvish; 2) ikki qo‘lni tirsaklar bilan qo‘shib yuvish; 3) boshning to‘rtdan bir qismiga mas’h tortish; 4) ikki oyoqni to‘piqlari bilan qo‘shib yuvish.',
            'Tahoratda bismilloh aytish, og‘iz va burunni uch marta chayish, quloqlarga mas’h tortish va tartibga rioya qilish sunnatdir. Suvni isrof qilmaslik esa tahorat odobining muhim qismidir.',
            'G‘uslning uchta farzi bor: og‘izni g‘arg‘ara qilib chayish, burunni achishguncha chayish hamda butun badanni birorta quruq joy qoldirmay yuvish.',
          ],
          ru: [
            'В ханафитском мазхабе у малого омовения (вуду) четыре обязательных действия (фарда): 1) омыть лицо полностью; 2) омыть обе руки включая локти; 3) протереть влажной рукой не менее четверти головы; 4) омыть обе стопы включая щиколотки.',
            'Произнесение «Бисмиллях», троекратное полоскание рта и носа, протирание ушей и соблюдение порядка являются сунной. Важно беречь воду и не допускать расточительства.',
            'У полного омовения (гусля) три фарда: тщательно прополоскать рот, промыть нос и омыть всё тело так, чтобы не осталось сухого участка.',
          ],
          en: [
            'In the Hanafi school, Wudu has four obligatory elements (fard): washing the entire face, washing both arms including the elbows, wiping at least a quarter of the head, and washing both feet including the ankles.',
            'Beginning with Bismillah, rinsing the mouth and nose three times, wiping the ears, and keeping the sequence are emphasized Sunnahs, while conserving water is a hallmark of Prophetic etiquette.',
            'Ghusl has three obligatory elements: rinsing the mouth thoroughly, rinsing the nose, and washing the entire body without leaving any dry spot.',
          ],
        },
        takeaway: {
          uz_lat: 'Tahoratni shoshilmasdan, suvni tejab va har a’zoni to‘liq yuvib olish namozdagi xushu’ning kalitidir.',
          ru: 'Неспешное и аккуратное омовение без расточительства воды готовит сердце к спокойному намазу.',
          en: 'Performing Wudu unhurriedly and without wasting water prepares the heart for focused prayer.',
        },
      },
      {
        id: 'maq-3',
        number: 3,
        title: {
          uz_lat: 'Namozning 12 farzi va xushu’ odobi',
          ru: '12 фардов намаза и сосредоточенность',
          en: 'The 12 Pillars of Prayer & Focus',
        },
        sourceQuote: 'إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا',
        sourceLabel: {
          uz_lat: 'Niso surasi, 103-oyat · Hanafiy fiqhi',
          ru: 'Сура Ан-Ниса, 103 · Ханафитский фикх',
          en: 'Surah An-Nisa 4:103 · Hanafi Fiqh',
        },
        paragraphs: {
          uz_lat: [
            'Namozning olti farzi namozdan tashqarida (shartlari): badan, kiyim va joyning pokligi, tahoratli bo‘lish, avratni yopish, Qiblaga yuzlanish, vaqtning kirishi va niyat qilishdir.',
            'Olti farzi esa namozning ichida (ruknlari): takbiri tahrima («Allohu akbar»), qiyom (tik turish), qiroat (Qur’on o‘qish), ruku’, sajda hamda oxirgi qadada tashahhud miqdoricha o‘tirishdir.',
            'Ruku’ va sajdada a’zolar bir lahza sokin turishi (ta’dili arkon) vojib bo‘lib, shoshilib o‘qilgan namozning ruhi yo‘qoladi. Namoz — bandaning Robbi bilan eng yaqin suhbatidir.',
          ],
          ru: [
            'Шесть условий намаза выполняются до его начала: чистота тела, одежды и места, наличие омовения, прикрытие аурата, обращение к Кибле, наступление времени молитвы и намерение.',
            'Шесть столпов выполняются внутри намаза: вступительный такбир («Аллаху Акбар»), стояние (кыям), чтение Корана (кыраат), поясной поклон (руку), земной поклон (саджда) и заключительное сидение.',
            'Спокойствие тела в каждом поклоне (тадиль аркан) является ваджибом — спешка лишает молитву её духовной красоты.',
          ],
          en: [
            'Six conditions precede prayer: purity of body, clothes, and place; ritual ablution; modest covering; facing the Qibla; entry of the prayer time; and sincere intention.',
            'Six integral pillars occur inside prayer: the opening Takbir, standing (qiyam), Quran recitation, bowing (ruku), prostration (sujud), and the final sitting.',
            'Pausing in stillness during bowing and prostration (ta’dil al-arkan) is Wajib in Hanafi law and preserves the dignity and serenity of prayer.',
          ],
        },
        takeaway: {
          uz_lat: 'Har ruku’ va sajdada shoshmasdan tasbehlarni dona-dona ayting — namoz qalbning rohatiga aylanadi.',
          ru: 'Не спешите в поясных и земных поклонах: спокойное произнесение тасбиха превращает намаз в отдых для души.',
          en: 'Pause calmly in every bowing and prostration—unhurried prayer becomes true rest for the heart.',
        },
      },
      {
        id: 'maq-4',
        number: 4,
        title: {
          uz_lat: 'Ro‘za va Zakotning hikmati',
          ru: 'Мудрость поста и закята',
          en: 'The Wisdom of Fasting and Zakat',
        },
        sourceQuote: 'الصِّيَامُ جُنَّةٌ',
        sourceLabel: {
          uz_lat: 'Ro‘za qalqondir · Sahihi Buxoriy',
          ru: 'Пост — это щит · Сахих аль-Бухари',
          en: 'Fasting is a shield · Sahih al-Bukhari',
        },
        paragraphs: {
          uz_lat: [
            'Ro‘za — tong otishidan quyosh botgunigacha niyat bilan yeb-ichishdan va nafsoniy shahvatlardan tiyilishdir. Uning asl hikmati nafsni tarbiyalash, sabr-toqatni oshirish va muhtojlar holini his etishdir.',
            'Zakot esa nisob miqdoriga (85 gramm oltin qiymatiga) yetgan va bir qamariy yil saqlangan ortiqcha boylikning qirqdan bir qismini (2.5%) haqdor kambag‘al va muhtojlarga berishdir.',
            'Zakot boylikni kamaytirmaydi, balki uni poklaydi, barakasini oshiradi va jamiyatda mehr-oqibat ko‘prigini mustahkamlaydi.',
          ],
          ru: [
            'Пост — это осознанное воздержание от пищи, питья и страстей от рассвета до заката ради Всевышнего. Он воспитывает силу воли, терпение и сострадание к нуждающимся.',
            'Закят — обязательное очищение имущества: выплата 2,5% (одной сороковой части) от свободных сбережений, достигших нисаба (стоимости 85 г золота) и пролежавших один лунный год.',
            'Закят не уменьшает достаток — он очищает богатство, приносит благодать и укрепляет милосердие в обществе.',
          ],
          en: [
            'Fasting is abstaining from food, drink, and base desires from dawn to sunset with sincere intention. Its deeper wisdom cultivates self-restraint, gratitude, and empathy for those in need.',
            'Zakat is the annual 2.5% obligation on surplus savings reaching the nisab threshold (85g of gold) held for one lunar year, given to eligible recipients.',
            'Rather than shrinking wealth, zakat purifies it, invites blessing, and strengthens solidarity across the community.',
          ],
        },
        takeaway: {
          uz_lat: 'Ro‘za qalbni poklaydi, zakot va sadaqa esa rizqni barakali qiladi.',
          ru: 'Пост очищает душу, а закят и милостыня наполняют достаток благодатью.',
          en: 'Fasting purifies the soul, while zakat and charity bring lasting blessing to wealth.',
        },
      },
    ],
  },
  {
    id: 'abu-hanifa-fiqh-akbar',
    category: 'fiqh',
    coverTheme: 'navy',
    arabicTitle: 'الفقه الأكبر',
    title: {
      uz_lat: 'Al-Fiqh al-Akbar',
      ru: 'Аль-Фикх аль-Акбар (Великое знание)',
      en: 'Al-Fiqh al-Akbar (The Greater Understanding)',
    },
    author: {
      uz_lat: 'Imom A’zam Abu Hanifa (r.a.)',
      ru: 'Имам Абу Ханифа (р.а.)',
      en: 'Imam Abu Hanifa (r.a.)',
    },
    era: '699–767',
    heritageBadge: {
      uz_lat: 'Klassik Hanafiy aqida · VIII asr',
      ru: 'Классическая акыда · VIII в.',
      en: 'Classical Public Domain · 8th c.',
    },
    summary: {
      uz_lat: 'Imomi A’zam Abu Hanifaning tavhid, Allohning sifatlari, qadar va Ahli Sunna e’tiqodini bayon etuvchi mo‘tabar asari.',
      ru: 'Основополагающий классический труд имама Абу Ханифы о единобожии, атрибутах Аллаха, предопределении и вероубеждении Ахлю-с-Сунна.',
      en: 'Imam Abu Hanifa’s landmark treatise articulating Islamic monotheism, divine attributes, free will & decree, and Sunni orthodoxy.',
    },
    chapters: [
      {
        id: 'han-1',
        number: 1,
        title: {
          uz_lat: 'Tavhid — Allohning yakkayu yagonaligi',
          ru: 'Таухид — Единственность Всевышнего',
          en: 'Tawhid — The Absolute Oneness of Allah',
        },
        sourceQuote: 'أَصْلُ التَّوْحِيدِ وَمَا يَصِحُّ الِاعْتِقَادُ عَلَيْهِ... اللَّهُ وَاحِدٌ لَا مِنْ طَرِيقِ الْعَدَدِ وَلَكِنْ مِنْ طَرِيقِ أَنَّهُ لَا شَرِيكَ لَهُ',
        sourceLabel: {
          uz_lat: 'Imom Abu Hanifa · Al-Fiqh al-Akbar',
          ru: 'Имам Абу Ханифа · Аль-Фикх аль-Акбар',
          en: 'Imam Abu Hanifa · Al-Fiqh al-Akbar',
        },
        paragraphs: {
          uz_lat: [
            'Imom Abu Hanifa (r.a.) aqida ilmini «Al-Fiqh al-Akbar» — eng buyuk tushuncha deb ataganlar, chunki Robbi haqidagi to‘g‘ri e’tiqod barcha ilmlarning tojidir.',
            'Alloh taolo yagonadir — son jihatidan emas, balki sherigi, o‘xshashi va tengi yo‘qligi jihatidan yagonadir. U zot maxluqotlarning birortasiga o‘xshamaydi va maxluqotlardan hech biri Unga o‘xshamaydi.',
            'Allohning barcha zotiy va fe’liy sifatlari (Hayot, Qudrat, Ilm, Kalom, Eshitish, Ko‘rish, Iroda) azaliydir va maxluqotlar sifatlaridan mutlaqo pokdir.',
          ],
          ru: [
            'Имам Абу Ханифа назвал науку о вероубеждении «Величайшим пониманием», потому что правильное познание Творца является вершиной всех знаний.',
            'Всевышний Аллах Един не в смысле числа, а в том смысле, что у Него нет сотоварища, равного или подобного Ему. Он не похож ни на одно из Своих творений.',
            'Все Его совершенные атрибуты — Жизнь, Могущество, Знание, Речь, Слух, Зрение и Воля — извечны и свободны от любых недостатков творений.',
          ],
          en: [
            'Imam Abu Hanifa termed creed "the Greater Understanding" because knowing one’s Creator accurately is the crown of all human knowledge.',
            'Allah is One—not merely numerically, but in having no partner, equal, or likeness whatsoever. Nothing in creation resembles Him, nor does He resemble anything He created.',
            'All His sublime attributes—Life, Power, Knowledge, Speech, Hearing, Sight, and Will—are eternal and completely transcendent beyond created limitations.',
          ],
        },
        takeaway: {
          uz_lat: 'Yagona Allohga tayanish qalbni barcha qo‘rquv va qulliklardan ozod qiladi.',
          ru: 'Упование на Единого Творца освобождает сердце от суеверий и страха перед творениями.',
          en: 'Relying upon the One Creator frees the heart from superstition and fear of creation.',
        },
      },
      {
        id: 'han-2',
        number: 2,
        title: {
          uz_lat: 'Qadar va insonning ixtiyori',
          ru: 'Предопределение и свобода выбора человека',
          en: 'Divine Decree & Human Responsibility',
        },
        sourceQuote: 'أَفْعَالُ الْعِبَادِ كُلُّهَا مِنَ الْحَرَكَةِ وَالسُّكُونِ كَسْبُهُمْ عَلَى الْحَقِيقَةِ، وَاللَّهُ تَعَالَى خَالِقُهَا',
        sourceLabel: {
          uz_lat: 'Al-Fiqh al-Akbar · Qadar bobi',
          ru: 'Аль-Фикх аль-Акбар · О предопределении',
          en: 'Al-Fiqh al-Akbar · On Qadar',
        },
        paragraphs: {
          uz_lat: [
            'Imom Abu Hanifa Ahli Sunna va Moturidiya-Hanafiy yo‘lining oltin muvozanatini go‘zal bayon etadi: borliqda hamma narsa Allohning ilmi va qudrati bilan yaratiladi, biroq insonga aql va ixtiyor (kasb) berilgan.',
            'Alloh bandasini gunohga majburlamaydi va yaxshilikdan to‘smaydi. Shuning uchun inson yaxshi amali uchun savobga, yomon ixtiyori uchun esa mas’uliyatga loyiqdir.',
            'Bu muvozanat musulmonni na umidsiz tanballikka (jabriyaga), na kibrli o‘zboshimchalikka tushiradi — balki sababini qilib, natijani Allohga topshirishga o‘rgatadi.',
          ],
          ru: [
            'Имам Абу Ханифа раскрывает золотую середину вероубеждения: всё во Вселенной происходит по знанию и воле Аллаха, но человеку дарованы разум и свобода выбора (касб).',
            'Всевышний никого не принуждает к греху и не удерживает от добра. Поэтому человек несёт ответственность за свой выбор и получает награду за благие поступки.',
            'Такое понимание избавляет от пассивного фатализма и гордыни, уча прилагать все усилия и уповать на Аллаха.',
          ],
          en: [
            'Imam Abu Hanifa outlines the balanced Hanafi-Sunni understanding: while Allah is Creator of all existence, human beings possess genuine moral choice and accountability (kasb).',
            'Allah does not compel anyone into sin nor prevent anyone from doing good; hence reward and responsibility are completely just.',
            'This middle path prevents both lazy fatalism and arrogance: we strive wholeheartedly with available means and entrust the outcome to Allah.',
          ],
        },
        takeaway: {
          uz_lat: 'Qo‘lingizdan kelgan eng yaxshi harakatni qiling va natijasida Allohning hikmatiga rozi bo‘ling.',
          ru: 'Приложите максимум честных усилий и со спокойным сердцем примите результат от Всевышнего.',
          en: 'Do your utmost with sound effort, then rest peacefully in Allah’s wisdom.',
        },
      },
      {
        id: 'han-3',
        number: 3,
        title: {
          uz_lat: 'Katta gunoh qilgan mo‘minni kofir demaslik',
          ru: 'Справедливость и милость: верующий не выводится из веры за грех',
          en: 'Mercy & Balance: A Believer Is Not Declared Disbeliever for Sin',
        },
        sourceQuote: 'وَلَا نُكَفِّرُ مُسْلِمًا بِذَنْبٍ مِنَ الذُّنُوبِ وَإِنْ كَانَتْ كَبِيرَةً إِذَا لَمْ يَسْتَحِلَّهَا',
        sourceLabel: {
          uz_lat: 'Al-Fiqh al-Akbar · Ummat birligi qoidasi',
          ru: 'Аль-Фикх аль-Акбар · Единство уммы',
          en: 'Al-Fiqh al-Akbar · Preserving Community Unity',
        },
        paragraphs: {
          uz_lat: [
            'Imom Abu Hanifa ekstremizm va takfirchilikka qarshi buyuk mezonni belgilagan: «Biz biror musulmonni, garchi katta gunoh qilgan bo‘lsa ham — agar o‘sha gunohni halol sanamasa — kofirga chiqarmaymiz».',
            'Gunohkor mo‘min tavbaga chaqiriladi, uning uchun hidoyat va mag‘firat so‘raladi. Alloh xohlasa uni kechiradi, xohlasa adolati bilan jazolaydi, ammo qalbida imoni bor kishi uchun umid eshigi hech qachon yopilmaydi.',
            'Bu mo‘tadil hanafiy tamoyil asrlar davomida jamiyatda tinchlik, bag‘rikenglik va musulmonlar birdamligini saqlab kelgan.',
          ],
          ru: [
            'Имам Абу Ханифа сформулировал великий щит против крайностей: «Мы не объявляем неверующим ни одного мусульманина за совершённый им грех, даже тяжкий, если только он не считает этот грех дозволенным».',
            'Оступившегося верующего мягко призывают к покаянию и просят для него прощения — двери милости Аллаха всегда открыты до последнего вздоха.',
            'Этот взвешенный ханафитский принцип веками хранил мир, милосердие и единство мусульманских обществ.',
          ],
          en: [
            'Imam Abu Hanifa established a timeless safeguard against extremism: "We do not declare any Muslim a disbeliever on account of a sin—even a major one—so long as they do not declare the forbidden lawful."',
            'A believer who stumbles is invited kindly toward repentance, and hope in Allah’s mercy remains wide open.',
            'This balanced Hanafi principle has protected social harmony, compassion, and unity across generations.',
          ],
        },
        takeaway: {
          uz_lat: 'Odamlar haqida hukm chiqarishga shoshilmang — o‘zingizni isloh qiling va boshqalarga yaxshilik tilang.',
          ru: 'Не спешите осуждать других: заботьтесь о чистоте собственного сердца и желайте людям наставления.',
          en: 'Refrain from harsh judgment of others; focus on mending your own heart and wishing guidance for all.',
        },
      },
    ],
  },
  {
    id: 'sofi-olloyor-sabotul-ojizin',
    category: 'spirituality',
    coverTheme: 'burgundy',
    arabicTitle: 'ثبات العاجزين',
    title: {
      uz_lat: 'Sabotul Ojizin',
      ru: 'Саботул Ожизин (Стойкость смиренных)',
      en: 'Sabat al-Ajizin (Steadfastness of the Humble)',
    },
    author: {
      uz_lat: 'So‘fi Olloyor (r.a.)',
      ru: 'Суфи Аллаяр (р.а.)',
      en: 'Sufi Allahyar (r.a.)',
    },
    era: '1644–1721',
    heritageBadge: {
      uz_lat: 'O‘zbek klassik merosi · XVII–XVIII asr',
      ru: 'Классическое узбекское наследие · XVII–XVIII вв.',
      en: 'Uzbek Classical Heritage · 17th–18th c.',
    },
    summary: {
      uz_lat: 'Movarounnahrda uch asrdan beri xalq sevib o‘qiydigan nazmiy asar: e’tiqod sofligi, nafsni jilovlash, shukr va oxirat yodi.',
      ru: 'Классическая поэма Мавераннахра, веками читаемая в каждой семье: чистота веры, обуздание эго, благодарность и духовная стойкость.',
      en: 'The beloved Movarounnahr classical verse treatise cherished for centuries for its lucid guidance on creed, self-discipline, and gratitude.',
    },
    chapters: [
      {
        id: 'sof-1',
        number: 1,
        title: {
          uz_lat: 'Hamd va e’tiqod mustahkamligi',
          ru: 'Восхваление Творца и твёрдость убеждений',
          en: 'Praise of the Creator & Firm Faith',
        },
        sourceQuote: 'Sano hamdu sano ul Podshohga,\nKi jon berdi bu tuproqdek tanohga.',
        sourceLabel: {
          uz_lat: 'So‘fi Olloyor · Sabotul Ojizin muqaddimasi',
          ru: 'Суфи Аллаяр · Вступление к «Саботул Ожизин»',
          en: 'Sufi Allahyar · Opening of Sabat al-Ajizin',
        },
        paragraphs: {
          uz_lat: [
            'So‘fi Olloyor «Sabotul Ojizin» (Ojiz bandalarning sabot-matonati) asarini oddiy xalq ham sof Hanafiy-Moturidiy e’tiqodini oson yodlab olishi uchun go‘zal turkiy-o‘zbek baytlarida yozgan.',
            'Shoir avvalo insonning o‘z ojizligini anglashi — Allohning buyukligini tanishning ilk qadami ekanini ta’kidlaydi. O‘zini mukammal va bexato sanagan nafs hech qachon haqiqiy kamolotga yetolmaydi.',
            'Har bir nafas Allohning in’omi ekanini eslash qalbni g‘ururdan tozalab, shukr va muhabbat bilan to‘ldiradi.',
          ],
          ru: [
            'Суфи Аллаяр написал «Саботул Ожизин» («Стойкость смиренных») в ясных тюркско-узбекских стихах, чтобы каждый человек мог легко запомнить основы правильной веры и нравственности.',
            'Поэт подчёркивает, что осознание собственной ограниченности — первый шаг к познанию величия Творца. Гордыня закрывает путь к росту, а смирение открывает сердце свету.',
            'Память о том, что каждый вдох является даром Всевышнего, превращает жизнь в благодарность.',
          ],
          en: [
            'Sufi Allahyar composed Sabat al-Ajizin ("Steadfastness of the Humble") in rhythmic classical Uzbek couplets so everyday families could easily memorize sound creed and spiritual etiquette.',
            'He emphasizes that recognizing one’s human fragility is the first doorway to knowing divine majesty; arrogance halts growth while humility opens the heart.',
            'Remembering that every single breath is a gift transforms daily life into quiet gratitude.',
          ],
        },
        takeaway: {
          uz_lat: 'Har kuni ne’matlar — sog‘lik, tinchlik va imon uchun «Alhamdulillah» deb shukr aytishni unutmang.',
          ru: 'Ежедневно благодарите Всевышнего за здоровье, мир и веру — благодарность приумножает блага.',
          en: 'Pause daily to say Alhamdulillah for health, peace, and faith—gratitude multiplies every blessing.',
        },
      },
      {
        id: 'sof-2',
        number: 2,
        title: {
          uz_lat: 'Nafsni tarbiyalash va g‘azabni yutish',
          ru: 'Воспитание нафса и сдержанность в гневе',
          en: 'Mastering the Ego & Restraining Anger',
        },
        sourceQuote: 'Agar mardsan, o‘zingning nafsingni yeng,\nKi dushman ichra eng xavflisi — nafsdir.',
        sourceLabel: {
          uz_lat: 'So‘fi Olloyor hikmati · Sabotul Ojizin',
          ru: 'Мудрость Суфи Аллаяра · Саботул Ожизин',
          en: 'Wisdom of Sufi Allahyar · Sabat al-Ajizin',
        },
        paragraphs: {
          uz_lat: [
            'So‘fi Olloyor nafsni jilovsiz otga qiyoslaydi: agar uni aql, shariat va sabr jilovi bilan boshqarmasang, egasini chohga qulatadi.',
            'Haqiqiy botirlik birovga baqirish yoki ranjitish emas, balki g‘azab kelgan chog‘da o‘zini tuta bilish, kechirish va yumshoq muomala qilishdir.',
            'Nafsni tarbiyalashning eng samarali yo‘li — halol luqma, oz va ma’noli so‘z, solih insonlar suhbati hamda zikrga bardavom bo‘lishdir.',
          ],
          ru: [
            'Суфи Аллаяр сравнивает необузданное эго (нафс) со строптивым конём: без узды разума, веры и терпения оно сбрасывает всадника.',
            'Подлинное мужество проявляется не в крике и обиде, а в умении сдержать гнев, простить и ответить добротой.',
            'Три верных помощника в воспитании души — честный заработок, сдержанная речь и общение с благородными людьми.',
          ],
          en: [
            'Sufi Allahyar compares an untamed ego (nafs) to an unbridled horse: without the reins of reason, faith, and patience, it throws its rider.',
            'True strength is not raising one’s voice or winning quarrels, but mastering anger, forgiving, and responding with grace.',
            'Honest livelihood, measured speech, and righteous company steadily refine the ego.',
          ],
        },
        takeaway: {
          uz_lat: 'Jahlingiz chiqqan paytda bir necha soniya sukut saqlang va «A’uzu billahi minash shaytonir rojiym» deng.',
          ru: 'В минуту гнева сделайте паузу, сохраните молчание и обратитесь к Аллаху за защитой — вы сбережёте мир в семье.',
          en: 'When anger rises, hold silence for a breath and seek refuge in Allah—you will protect relationships you value.',
        },
      },
      {
        id: 'sof-3',
        number: 3,
        title: {
          uz_lat: 'Ota-ona duosi va yaxshilik qoldirish',
          ru: 'Благословение родителей и добрый след',
          en: 'Parents’ Prayers & Leaving a Noble Legacy',
        },
        sourceQuote: 'Qilgil yaxshilik, yo‘lda tashla, ey yor,\nXoliq bilar, bilmasa ham xaloyiq.',
        sourceLabel: {
          uz_lat: 'Movarounnahr odob merosi',
          ru: 'Нравственное наследие Мавераннахра',
          en: 'Movarounnahr Ethical Heritage',
        },
        paragraphs: {
          uz_lat: [
            'So‘fi Olloyor ijodida ota-onaga hurmat, ustozga ehtirom va odamlarga minnatsiz yaxshilik qilish markaziy o‘rin tutadi. Minnat bilan qilingan ehsonning savobi ketadi, xolis qilingan kichik yordam esa abadiy qoladi.',
            'Dunyo o‘tkinchi karvonsaroy kabidir: inson o‘zi bilan faqat solih amallarini, yaxshi nomini va odamlar qalbida qoldirgan mehrini olib ketadi.',
            'Har kuni kamida bir kishining ko‘nglini ko‘tarish — qo‘ng‘iroq qilib hol so‘rash, tabassum qilish yoki duo qilish — «Sabotul Ojizin» ruhiga eng mos hayot tarzidir.',
          ],
          ru: [
            'Почитание родителей, уважение к наставникам и бескорыстная доброта занимают центральное место в наставлениях Суфи Аллаяра. Упрёк стирает награду благодеяния, а искренняя помощь остаётся навечно.',
            'Этот мир подобен караван-сараю: человек уносит с собой лишь праведные дела, доброе имя и тепло, подаренное сердцам людей.',
            'Порадовать хотя бы одного человека в день — позвонить родителям, улыбнуться или искренне помочь — живое воплощение этой мудрости.',
          ],
          en: [
            'Honoring parents, respecting teachers, and doing good without reminding others of favors stand at the heart of Sufi Allahyar’s legacy. Boasting erases charity, while quiet kindness endures forever.',
            'This world is a brief waystation: we carry onward only righteous deeds, a good name, and the warmth we leave in others’ hearts.',
            'Brightening even one person’s day—calling a parent, offering a sincere smile, or helping quietly—embodies this timeless heritage.',
          ],
        },
        takeaway: {
          uz_lat: 'Bugun ota-onangiz yoki yaqinlaringizdan biriga qo‘ng‘iroq qilib, iliq so‘z ayting va duosini oling.',
          ru: 'Позвоните сегодня родителям или близким, скажите тёплые слова и попросите их дуа.',
          en: 'Call your parents or a loved one today with warm words and ask for their prayers.',
        },
      },
    ],
  },
];
