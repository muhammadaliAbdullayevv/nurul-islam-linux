import { AppLanguage } from '../types';

export type FardPrayerId = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerRichUiStrings {
  topTabSpecialDays: string;
  topTabMonthly: string;
  topTabConverter: string;
  upcomingBadge: string;
  upcomingListTitle: string;
  upcomingRemainingLabel: string;
  tapForDayInfoHint: string;
  detailWhyTitle: string;
  detailDoTitle: string;
  shareSchedule: string;
  copiedToast: string;
  jumpToday: string;
  calibrationTitle: string;
  calibrationHint: string;
  hijriOffsetLabel: string;
  resetOffsets: string;
  monthlySubtitleHint: string;
  daysLeftWord: string;
  withinMonthsPrefix: string;
}

export interface SpecialEventRichDetail {
  whySpecial: string;
  whatToDo: string[];
}

export const PRAYER_RICH_UI: Record<AppLanguage, PrayerRichUiStrings> = {
  uz_lat: {
    topTabSpecialDays: 'Muhim kunlar',
    topTabMonthly: 'Oylik namoz',
    topTabConverter: 'Konvertor',
    upcomingBadge: 'Yaqinlashayotgan muhim sana',
    upcomingListTitle: 'Kelgusi muhim sanalar ro‘yxati',
    upcomingRemainingLabel: 'Qolgan vaqt',
    tapForDayInfoHint: 'Batafsil ma’lumot uchun bosing',
    detailWhyTitle: 'Nima uchun muhim kun?',
    detailDoTitle: 'Bu kunda / oyda nimalar qilinadi?',
    shareSchedule: 'Ulashish',
    copiedToast: 'Nusxalandi!',
    jumpToday: 'Bugunga qaytish',
    calibrationTitle: 'Vaqtni moslashtirish (± daqiqa)',
    calibrationHint: 'Mahalliy masjid taqvimiga aniq moslash uchun',
    hijriOffsetLabel: 'Hijriy kun farqi',
    resetOffsets: 'Asliga qaytarish',
    monthlySubtitleHint: 'Barcha namoz vaqtlari mahalliy vaqtda',
    daysLeftWord: 'kun qoldi',
    withinMonthsPrefix: 'Yillik ko‘rsatkich',
  },
  uz_cyr: {
    topTabSpecialDays: 'Муҳим кунлар',
    topTabMonthly: 'Ойлик намоз',
    topTabConverter: 'Конвертор',
    upcomingBadge: 'Яқинлашаётган муҳим сана',
    upcomingListTitle: 'Келгуси муҳим саналар рўйхати',
    upcomingRemainingLabel: 'Қолган вақт',
    tapForDayInfoHint: 'Батафсил маълумот учун босинг',
    detailWhyTitle: 'Нима учун муҳим кун?',
    detailDoTitle: 'Бу кунда / ойда нималар қилинади?',
    shareSchedule: 'Улашиш',
    copiedToast: 'Нусхаланди!',
    jumpToday: 'Бугунга қайтиш',
    calibrationTitle: 'Вақтни мослаштириш (± дақиқа)',
    calibrationHint: 'Маҳаллий масжид тақвимига аниқ мослаш учун',
    hijriOffsetLabel: 'Ҳижрий кун фарқи',
    resetOffsets: 'Аслига қайтариш',
    monthlySubtitleHint: 'Барча намоз вақтлари маҳаллий вақтда',
    daysLeftWord: 'кун қолди',
    withinMonthsPrefix: 'Йиллик кўрсаткич',
  },
  en: {
    topTabSpecialDays: 'Special Days',
    topTabMonthly: 'Monthly Prayer',
    topTabConverter: 'Converter',
    upcomingBadge: 'Upcoming Special Date',
    upcomingListTitle: 'Upcoming Special Dates',
    upcomingRemainingLabel: 'Time remaining',
    tapForDayInfoHint: 'Tap any date for details',
    detailWhyTitle: 'Why is this day special?',
    detailDoTitle: 'What is recommended on this day / month?',
    shareSchedule: 'Share',
    copiedToast: 'Copied!',
    jumpToday: 'Back to Today',
    calibrationTitle: 'Manual Calibration (± min)',
    calibrationHint: 'Fine-tune times to match your local masjid',
    hijriOffsetLabel: 'Hijri day adjustment',
    resetOffsets: 'Reset offsets',
    monthlySubtitleHint: 'All times shown in city local time',
    daysLeftWord: 'days left',
    withinMonthsPrefix: 'Countdown progress',
  },
  ru: {
    topTabSpecialDays: 'Важные дни',
    topTabMonthly: 'Намаз на месяц',
    topTabConverter: 'Конвертер',
    upcomingBadge: 'Ближайшая важная дата',
    upcomingListTitle: 'Предстоящие важные даты',
    upcomingRemainingLabel: 'Осталось времени',
    tapForDayInfoHint: 'Нажмите на дату для подробностей',
    detailWhyTitle: 'Почему этот день особенный?',
    detailDoTitle: 'Что рекомендуется делать в этот день / месяц?',
    shareSchedule: 'Поделиться',
    copiedToast: 'Скопировано!',
    jumpToday: 'Сегодня',
    calibrationTitle: 'Коррекция времени (± мин)',
    calibrationHint: 'Точная подстройка под расписание мечети',
    hijriOffsetLabel: 'Поправка Хиджры (дни)',
    resetOffsets: 'Сбросить поправки',
    monthlySubtitleHint: 'Все времена по местному времени города',
    daysLeftWord: 'дн. осталось',
    withinMonthsPrefix: 'Прогресс ожидания',
  },
};

const SPECIAL_EVENT_DETAILS: Record<string, Record<AppLanguage, SpecialEventRichDetail>> = {
  'hijri-new-year': {
    uz_lat: {
      whySpecial:
        'Hazrati Umar (r.a.) davrida Payg‘ambarimiz ﷺ ning Makka shahridan Madinaga hijratlari xotirasi sifatida Muharram oyi Hijriy yil boshi etib belgilangan. Muharram Alloh harom qilgan to‘rt muqaddas oydan biridir.',
      whatToDo: [
        'Yangi yilni shukr, istig‘for va solih niyatlar bilan kutib olish',
        'Muharram oyida nafl ro‘za tutishni ko‘paytirish',
        'Oila va qarindoshlar bilan silai rahmni mustahkamlash',
      ],
    },
    uz_cyr: {
      whySpecial:
        'Ҳазрати Умар (р.а.) даврида Пайғамбаримиз ﷺ нинг Макка шаҳридан Мадинага ҳижратлари хотираси сифатида Муҳаррам ойи Ҳижрий йил боши этиб белгиланган. Муҳаррам Аллоҳ ҳаром қилган тўрт муқаддас ойдан биридир.',
      whatToDo: [
        'Янги йилни шукр, истиғфор ва солиҳ ниятлар билан кутиб олиш',
        'Муҳаррам ойида нафл рўза тутишни кўпайтириш',
        'Оила ва қариндошлар билан силаи раҳмни мустаҳкамлаш',
      ],
    },
    en: {
      whySpecial:
        'Established under Caliph Umar (r.a.) to mark the Prophetic Hijrah from Makkah to Madinah. Muharram is also one of the four Sacred Months in the Quran.',
      whatToDo: [
        'Reflect on past deeds, renew sincere intentions, and ask forgiveness',
        'Fast voluntary days in Muharram — the best fasting month after Ramadan',
        'Strengthen family ties and offer extra charity',
      ],
    },
    ru: {
      whySpecial:
        'Установлено при халифе Умаре (р.а.) в честь переселения Пророка ﷺ из Мекки в Медину. Мухаррам также входит в четыре священных месяца года.',
      whatToDo: [
        'Встретить год с покаянием, благодарностью и благими намерениями',
        'Соблюдать добровольный пост в месяц Мухаррам',
        'Укреплять родственные связи и совершать садака',
      ],
    },
  },
  ashura: {
    uz_lat: {
      whySpecial:
        'Ashuro (10-Muharram) kuni Alloh taolo Muso (a.s.) va Bani Isroilni Fir’avn zulmidan qutqargan ulug‘ shukrona kunidir. Payg‘ambarimiz ﷺ bu kunda ro‘za tutganlar va o‘tgan bir yillik kichik gunohlarga kafforat bo‘lishini aytganlar.',
      whatToDo: [
        '9- va 10-Muharram (yoki 10- va 11-Muharram) kunlari sunnat ro‘za tutish',
        'Oilaga kengchilik qilish, mehribonlik va ehson ko‘rsatish',
        'Istig‘for, duo va shukr zikrlarini ko‘paytirish',
      ],
    },
    uz_cyr: {
      whySpecial:
        'Ашуро (10-Муҳаррам) куни Аллоҳ таоло Мусо (а.с.) ва Бани Исроилни Фиръавн зулмидан қутқарган улуғ шукрона кунидир. Пайғамбаримиз ﷺ бу кунда рўза тутганлар ва ўтган бир йиллик кичик гуноҳларга каффорат бўлишини айтганлар.',
      whatToDo: [
        '9- ва 10-Муҳаррам (ёки 10- ва 11-Муҳаррам) кунлари суннат рўза тутиш',
        'Оилага кенгчилик қилиш, меҳрибонлик ва эҳсон кўрсатиш',
        'Истиғфор, дуо ва шукр зикрларини кўпайтириш',
      ],
    },
    en: {
      whySpecial:
        'On 10 Muharram, Allah saved Prophet Musa (a.s.) and his people from Pharaoh. Prophet Muhammad ﷺ fasted Ashura and taught that fasting it expiates the minor sins of the previous year.',
      whatToDo: [
        'Fast on 9 & 10 Muharram (or 10 & 11) following the Sunnah',
        'Be generous with family, guests, and those in need',
        'Engage in extra repentance, gratitude, and Quran recitation',
      ],
    },
    ru: {
      whySpecial:
        'В день Ашура (10 Мухаррама) Аллах спас пророка Мусу (а.с.) от Фараона. Пост в этот день, по словам Пророка ﷺ, искупает малые грехи прошлого года.',
      whatToDo: [
        'Соблюдать пост 9 и 10 (или 10 и 11) Мухаррама по Сунне',
        'Проявлять щедрость к семье и подавать милостыню',
        'Усилить истигфар, дуа и благодарность Всевышнему',
      ],
    },
  },
  mawlid: {
    uz_lat: {
      whySpecial:
        'Rabiul avval oyining 12-kuni olamlarga rahmat bo‘lgan Payg‘ambarimiz Muhammad ﷺ ning tavallud topgan muborak oylari sifatida musulmonlar tomonidan ehtirom bilan eslanadi.',
      whatToDo: [
        'Payg‘ambarimiz ﷺ ga ko‘p-ko‘p salovot va salom yo‘llash',
        'Ul zotning siyratlari, go‘zal xulqlari va hadislarini o‘rganish',
        'Yetimlar, muhtojlar va qo‘shnilarga yaxshilik ulashish',
      ],
    },
    uz_cyr: {
      whySpecial:
        'Рабиул аввал ойининг 12-куни оламларга раҳмат бўлган Пайғамбаримиз Муҳаммад ﷺ нинг таваллуд топган муборак ойлари сифатида мусулмонлар томонидан эҳтиром билан эсланади.',
      whatToDo: [
        'Пайғамбаримиз ﷺ га кўп-кўп саловот ва салом йўллаш',
        'Ул зотнинг сийратлари, гўзал хулқлари ва ҳадисларини ўрганиш',
        'Етимлар, муҳтожлар ва қўшниларга яхшилик улашиш',
      ],
    },
    en: {
      whySpecial:
        'Rabi al-Awwal commemorates the birth of Prophet Muhammad ﷺ, sent as a mercy to all worlds.',
      whatToDo: [
        'Send abundant Salawat (blessings) upon the Prophet ﷺ',
        'Read Seerah stories and revive a forgotten Prophetic Sunnah',
        'Feed the poor and show kindness to family and neighbors',
      ],
    },
    ru: {
      whySpecial:
        'Месяц Раби аль-авваль напоминает о рождении Пророка Мухаммада ﷺ — милости для миров.',
      whatToDo: [
        'Читать больше салаватов Пророку ﷺ',
        'Изучать жизнеописание (сиру) и применять Сунну в жизни',
        'Угощать родных, соседей и помогать нуждающимся',
      ],
    },
  },
  'rajab-start': {
    uz_lat: {
      whySpecial:
        'Rajab — Qur’oni Karimda zikr etilgan to‘rt harom (muqaddas) oyning biri hamda Ramazon oyiga ruhiy tayyorgarlik ko‘riladigan muborak uch oylarning (Rajab–Sha’bon–Ramazon) boshlanishidir.',
      whatToDo: [
        '«Allohumma barik lana fi Rajaba va Sha’bana va ballig‘na Ramazon» duosini o‘qish',
        'Nafl ro‘zalar (dushanba/payshanba) va istig‘forni ko‘paytirish',
        'Ramazon oyiga qalb, namoz va Qur’on tilovati bilan hozirlik ko‘rish',
      ],
    },
    uz_cyr: {
      whySpecial:
        'Ражаб — Қуръони Каримда зикр этилган тўрт ҳаром (муқаддас) ойнинг бири ҳамда Рамазон ойига руҳий тайёргарлик кўриладиган муборак уч ойларнинг (Ражаб–Шаъбон–Рамазон) бошланишидир.',
      whatToDo: [
        '«Аллоҳумма барик лана фи Ражаба ва Шаъбана ва баллиғна Рамазон» дуосини ўқиш',
        'Нафл рўзалар (душанба/пайшанба) ва истиғфорни кўпайтириш',
        'Рамазон ойига қалб, намоз ва Қуръон тиловати билан ҳозирлик кўриш',
      ],
    },
    en: {
      whySpecial:
        'Rajab is one of the four Sacred Months in Islam and marks the spiritual countdown leading through Sha’ban into Ramadan.',
      whatToDo: [
        'Make Dua for blessings in Rajab & Sha’ban and to witness Ramadan',
        'Begin consistent voluntary fasting, night prayer, and Istighfar',
        'Reconcile ties and cut back on harmful habits ahead of Ramadan',
      ],
    },
    ru: {
      whySpecial:
        'Раджаб — один из четырёх священных месяцев Ислама и начало духовной подготовки к Шаабану и Рамадану.',
      whatToDo: [
        'Читать дуа о благословении в Раджабе, Шаабане и достижении Рамадана',
        'Увеличить истигфар, садака и чтение Корана',
        'Привыкать к добровольному посту (понедельник/четверг)',
      ],
    },
  },
  'isra-miraj': {
    uz_lat: {
      whySpecial:
        'Isro va Me’roj — Payg‘ambarimiz ﷺ ning Makka Masjidul Haromdan Quddusdagi Masjidul Aqsoga tungi sayrlari va osmonlarga ko‘tarilishlari sodir bo‘lgan tun. Aynan shu kechada ummatga besh vaqt namoz farz qilingan.',
      whatToDo: [
        'Besh vaqt namozni o‘z vaqtida va xushu bilan ado etishga ahd qilish',
        'Tungi nafl namozlar, salovot va duolar bilan mashg‘ul bo‘lish',
        'Qur’oni Karimning Isro surasini ma’nolari bilan o‘qish',
      ],
    },
    uz_cyr: {
      whySpecial:
        'Исро ва Меърож — Пайғамбаримиз ﷺ нинг Макка Масжидул Ҳаромдан Қуддусдаги Масжидул Ақсога тунги сайрлари ва осмонларга кўтарилишлари содир бўлган тун. Айнан шу кечада умматга беш вақт намоз фарз қилинган.',
      whatToDo: [
        'Беш вақт намозни ўз вақтида ва хушуъ билан адо этишга аҳд қилиш',
        'Тунги нафл намозлар, саловот ва дуолар билан машғул бўлиш',
        'Қуръони Каримнинг Исро сурасини маънолари билан ўқиш',
      ],
    },
    en: {
      whySpecial:
        'Commemorates the Night Journey from Makkah to Al-Aqsa and Ascension (Mi’raj), during which the gift of five daily Salah prayers was ordained.',
      whatToDo: [
        'Renew commitment to guarding all five daily prayers on time',
        'Reflect on Surah Al-Isra and offer extra night prayers and Dua',
        'Send frequent Salawat upon the Prophet ﷺ',
      ],
    },
    ru: {
      whySpecial:
        'Знаменует Ночное путешествие Пророка ﷺ в Аль-Аксу и Вознесение на небеса (Мирадж), когда умме были предписаны пять ежедневных намазов.',
      whatToDo: [
        'Укрепить постоянство и смиренность в пяти обязательных намазах',
        'Совершить ночные молитвы, читать Коран и дуа',
        'Увеличить салават Пророку ﷺ',
      ],
    },
  },
  'shaban-barah': {
    uz_lat: {
      whySpecial:
        'Sha’bon oyining 15-kechasi (Laylatul Baroat) — hadislarda Alloh taolo shirk va adovatda bo‘lmagan bandalarini mag‘firat qilishi zikr etilgan muborak kecha, shuningdek Ramazonga 15 kun qolganini eslatuvchi sanadir.',
      whatToDo: [
        'Qalbdan adovat va ginalarni chiqarib, kechirim so‘rash',
        'Istig‘for, duo va kechagi tahajjud namozi o‘qish',
        'Ertasi kuni (15-Sha’bon) nafl ro‘za tutish',
      ],
    },
    uz_cyr: {
      whySpecial:
        'Шаъбон ойининг 15-кечаси (Лайлатул Бароат) — ҳадисларда Аллоҳ таоло ширк ва адоватда бўлмаган бандаларини мағфират қилиши зикр этилган муборак кеча, шунингдек Рамазонга 15 кун қолганини эслатувчи санадир.',
      whatToDo: [
        'Қалбдан адоват ва гиналарни чиқариб, кечирим сўраш',
        'Истиғфор, дуо ва кечаги таҳажжуд намози ўқиш',
        'Эртаси куни (15-Шаъбон) нафл рўза тутиш',
      ],
    },
    en: {
      whySpecial:
        'The 15th night of Sha’ban highlights Allah’s vast mercy and forgiveness for those free of malice and shirk, just two weeks before Ramadan begins.',
      whatToDo: [
        'Clear your heart of grudges and reconcile with others',
        'Seek sincere forgiveness and pray Qiyam in the quiet night',
        'Consider fasting on the 13th–15th white days of Sha’ban',
      ],
    },
    ru: {
      whySpecial:
        'Ночь Бараат (15 Шаабана) — ночь особой милости и прощения Всевышнего для тех, кто очистил сердце от ширка и вражды, за две недели до Рамадана.',
      whatToDo: [
        'Простить обиды, примириться с близкими и просить прощения у Аллаха',
        'Провести часть ночи в дуа, зикре и добровольной молитве',
        'Держать пост в светлые дни Шаабана (13–15 числа)',
      ],
    },
  },
  'ramadan-start': {
    uz_lat: {
      whySpecial:
        'Ramazon — Qur’oni Karim nozil bo‘lgan, jannat eshiklari ochilib, jahannam eshiklari yopiladigan va musulmonlarga ro‘za farz qilingan yilning eng ulug‘ oyidir.',
      whatToDo: [
        'Saharlikka turib, xolis niyat bilan kunduzlari ro‘za tutish',
        'Har kecha Tarovih namozini o‘qish va Qur’on xatmiga kirishish',
        'Kambag‘al va muhtojlarga sadaqa, iftorlik va zakot ulashish',
        'Til va qalbni g‘iybat, janjal va behuda ishlardan saqlash',
      ],
    },
    uz_cyr: {
      whySpecial:
        'Рамазон — Қуръони Карим нозил бўлган, жаннат эшиклари очилиб, жаҳаннам эшиклари ёпиладиган ва мусулмонларга рўза фарз қилинган йилнинг энг улуғ ойидир.',
      whatToDo: [
        'Саҳарликка туриб, холис ният билан кундузлари рўза тутиш',
        'Ҳар кеча Таровиҳ намозини ўқиш ва Қуръон хатмига киришиш',
        'Камбағал ва муҳтожларга садақа, ифторлик ва закот улашиш',
        'Тил ва қалбни ғийбат, жанжал ва беҳуда ишлардан сақлаш',
      ],
    },
    en: {
      whySpecial:
        'The holiest month of the year, in which the Quran was first revealed, gates of Mercy open, and obligatory fasting (Sawm) cultivates Taqwa.',
      whatToDo: [
        'Fast sincerely from Fajr until Maghrib with Suhoor & Iftar',
        'Recite Quran daily and attend or pray Taraweeh each night',
        'Multiply charity, feed fasting people, and seek Laylatul Qadr',
      ],
    },
    ru: {
      whySpecial:
        'Священный месяц ниспослания Корана, в котором открываются врата милости, а обязательный пост воспитывает богобоязненность.',
      whatToDo: [
        'Соблюдать обязательный пост с искренним намерением от Фаджра до Магриба',
        'Ежедневно читать Коран и совершать ночной намаз Таравих',
        'Раздавать милостыню и угощать постящихся на ифтар',
      ],
    },
  },
  'laylatul-qadr': {
    uz_lat: {
      whySpecial:
        'Qadr kechasi (Laylatul Qadr) — Qur’oni Karim nozil qilingan va «ming oydan (83 yildan ortiq vaqtdan) yaxshiroq» deb Qur’onda ta’riflangan Ramazonning oxirgi o‘n kunligidagi eng buyuk tundir.',
      whatToDo: [
        '«Allohumma innaka ‘afuvvun tuhibbul ‘afva fa’fu ‘anni» duosini ko‘p o‘qish',
        'Kechani tahajjud namozi, Qur’on tilovati va tavba-istig‘for bilan o‘tkazish',
        'Oxirgi o‘n kechaning barcha toq kunlarida (21, 23, 25, 27, 29) ibodatda hushyor bo‘lish',
      ],
    },
    uz_cyr: {
      whySpecial:
        'Қадр кечаси (Лайлатул Қадр) — Қуръони Карим нозил қилинган ва «минг ойдан (83 йилдан ортиқ вақтдан) яхшироқ» деб Қуръонда таърифланган Рамазоннинг охирги ўн кунлигидаги энг буюк тундир.',
      whatToDo: [
        '«Аллоҳумма иннака афуввун туҳиббул афва фаъфу анни» дуосини кўп ўқиш',
        'Кечани таҳажжуд намози, Қуръон тиловати ва тавба-истиғфор билан ўтказиш',
        'Охирги ўн кечанинг барча тоқ кунларида (21, 23, 25, 27, 29) ибодатда ҳушёр бўлиш',
      ],
    },
    en: {
      whySpecial:
        'The Night of Decree when the Quran was sent down; the Quran states worship in it is better than 1,000 months (83+ years). Sought across the odd nights of Ramadan’s last ten days.',
      whatToDo: [
        'Repeat: "Allahumma innaka Afuwwun tuhibbul afwa fa’fu anni"',
        'Spend the night in Qiyam/Tahajjud, Quran recitation, and heartfelt Dua',
        'Give extra charity, even a small amount each odd night',
      ],
    },
    ru: {
      whySpecial:
        'Ночь Предопределения и ниспослания Корана, поклонение в которую лучше тысячи месяцев (более 83 лет). Ищется в нечётные ночи последних десяти дней Рамадана.',
      whatToDo: [
        'Многократно читать дуа: «Аллахумма иннака ‘Афуввун тухиббуль-‘афва фа‘фу ‘анни»',
        'Провести ночь в тахаджуде, чтении Корана и покаянии',
        'Совершать милостыню в последние нечётные ночи',
      ],
    },
  },
  'eid-fitr': {
    uz_lat: {
      whySpecial:
        'Ramazon hayiti (Iydul Fitr) — bir oylik muborak ro‘za ibodatini ado etib, Allohga shukrona sifatida Payg‘ambarimiz ﷺ davrlaridan beri nishonlab kelinadigan muqaddas bayramdir.',
      whatToDo: [
        'Hayit namozidan oldin Fitr sadaqasini muhtojlarga yetkazish',
        'G‘usl olib, eng chiroyli toza kiyimlarni kiyish va takbir aytish',
        'Hayit namozini o‘qish, ota-ona, qarindoshlar va qo‘shnilarni tabriklash',
      ],
    },
    uz_cyr: {
      whySpecial:
        'Рамазон ҳайити (Ийдул Фитр) — бир ойлик муборак рўза ибодатини адо этиб, Аллоҳга шукрона сифатида Пайғамбаримиз ﷺ даврларидан бери нишонлаб келинадиган муқаддас байрамдир.',
      whatToDo: [
        'Ҳайит намозидан олдин Фитр садақасини муҳтожларга етказиш',
        'Ғусл олиб, энг чиройли тоза кийимларни кийиш ва такбир айтиш',
        'Ҳайит намозини ўқиш, ота-она, қариндошлар ва қўшниларни табриклаш',
      ],
    },
    en: {
      whySpecial:
        'Marks the joyful completion of Ramadan’s fasting, instituted by Prophet Muhammad ﷺ as a day of gratitude, brotherhood, and shared celebration.',
      whatToDo: [
        'Pay Zakat al-Fitr strictly before the Eid prayer',
        'Perform Ghusl, eat an odd number of dates, and recite Eid Takbeer',
        'Attend Eid prayer and visit parents, relatives, and friends',
      ],
    },
    ru: {
      whySpecial:
        'Праздник завершения благословенного месяца Рамадан, установленный Пророком ﷺ как день благодарности, радости и единства уммы.',
      whatToDo: [
        'Выплатить Закят аль-Фитр строго до праздничного намаза',
        'Совершить гусль, надеть лучшую одежду и произносить такбиры',
        'Посетить праздничную молитву и поздравить родителей и близких',
      ],
    },
  },
  arafah: {
    uz_lat: {
      whySpecial:
        'Arafa kuni (9-Zulhijja) — haj ibodatining eng asosiy rukni ado etiladigan va duolar eng ko‘p ijobat bo‘ladigan yilning eng afzal kunidir. Hajga bormaganlar uchun ro‘za tutish o‘tgan va kelgusi 2 yillik gunohlarga kafforat bo‘lishi hadisda bayon qilingan.',
      whatToDo: [
        'Hajda bo‘lmaganlar uchun Arafa kuni ro‘za tutish',
        'Bomdoddan boshlab Takbiri Tashriq, tahlil («La ilaha illalloh») va duolarni ko‘paytirish',
        'Ota-ona, farzandlar va butun ummat haqqiga samimiy duo qilish',
      ],
    },
    uz_cyr: {
      whySpecial:
        'Арафа куни (9-Зулҳижжа) — ҳаж ибодатининг энг асосий рукни адо этиладиган ва дуолар энг кўп ижобат бўладиган йилнинг энг афзал кунидир. Ҳажга бормаганлар учун рўза тутиш ўтган ва келгуси 2 йиллик гуноҳларга каффорат бўлиши ҳадисда баён қилинган.',
      whatToDo: [
        'Ҳажда бўлмаганлар учун Арафа куни рўза тутиш',
        'Бомдоддан бошлаб Такбири Ташриқ, таҳлил («Ла илаҳа иллаллоҳ») ва дуоларни кўпайтириш',
        'Ота-она, фарзандлар ва бутун уммат ҳаққига самимий дуо қилиш',
      ],
    },
    en: {
      whySpecial:
        'The 9th of Dhu al-Hijjah — the pinnacle day of Hajj and the best day of the year for accepted Dua. Fasting it for non-pilgrims expiates the sins of the past and coming year.',
      whatToDo: [
        'Fast on the Day of Arafah (for those not performing Hajj)',
        'Recite abundant Dhikr, Takbeerat Tashreeq, and heartfelt personal Dua',
        'Prepare with gratitude for Eid al-Adha',
      ],
    },
    ru: {
      whySpecial:
        '9-й день Зуль-хиджи — главный день Хаджа и лучший день года для принятия дуа. Пост в этот день для не находящихся в паломничестве искупает малые грехи двух лет.',
      whatToDo: [
        'Держать пост в день Арафа (для тех, кто не в Хадже)',
        'Читать такбиры Ташрик, зикр и искренние мольбы (дуа)',
        'Просить благословения для семьи и всей уммы',
      ],
    },
  },
  'eid-adha': {
    uz_lat: {
      whySpecial:
        'Qurbon hayiti (10-Zulhijja) — Ibrohim (a.s.) va Ismoil (a.s.) ning Alloh yo‘lidagi mislsiz itoati va taslimiyati xotirasiga qiyomatgacha qoldirilgan eng katta islomiy bayramdir.',
      whatToDo: [
        'Hayit namozidan so‘ng qodir bo‘lganlar qurbonlik so‘yib, muhtojlarga ulashishi',
        'Tashriq kunlari (9–13 Zulhijja) har farz namozdan keyin Takbiri Tashriq aytish',
        'Bayram kunlari ro‘za tutmaslik, qarindosh-urug‘larni ziyorat qilib, quvonch ulashish',
      ],
    },
    uz_cyr: {
      whySpecial:
        'Қурбон ҳайити (10-Зулҳижжа) — Иброҳим (а.с.) ва Исмоил (а.с.) нинг Аллоҳ йўлидаги мислсиз итоати ва таслимияти хотирасига қиёматгача қолдирилган энг катта исломий байрамдир.',
      whatToDo: [
        'Ҳайит намозидан сўнг қодир бўлганлар қурбонлик сўйиб, муҳтожларга улашиши',
        'Ташриқ кунлари (9–13 Зулҳижжа) ҳар фарз намоздан кейин Такбири Ташриқ айтиш',
        'Байрам кунлари рўза тутмаслик, қариндош-уруғларни зиёрат қилиб, қувонч улашиш',
      ],
    },
    en: {
      whySpecial:
        'Commemorates Prophet Ibrahim (a.s.) and Isma’il’s (a.s.) complete devotion and submission to Allah. Celebrated on 10 Dhu al-Hijjah across the Muslim world.',
      whatToDo: [
        'Attend Eid prayer and recite Takbeerat through the Days of Tashreeq',
        'Perform Udhiyah (Qurbani) if able and share meat with the poor and neighbors',
        'Visit family, celebrate joyfully, and abstain from fasting on Eid & Tashreeq days',
      ],
    },
    ru: {
      whySpecial:
        'Великий праздник жертвоприношения (10 Зуль-хиджи) в память о глубокой покорности пророков Ибрахима (а.с.) и Исмаила (а.с.) воле Всевышнего.',
      whatToDo: [
        'Совершить праздничный намаз и произносить такбиры в дни Ташрика',
        'Принести жертву (Курбан) при наличии возможности и раздать мясо нуждающимся',
        'Навещать родных, дарить радость и не соблюдать пост в праздничные дни',
      ],
    },
  },
};

export function getSpecialEventDetail(eventId: string, lang: AppLanguage): SpecialEventRichDetail {
  const entry = SPECIAL_EVENT_DETAILS[eventId];
  if (entry) {
    return entry[lang] || entry.en;
  }
  return {
    whySpecial: '',
    whatToDo: [],
  };
}
