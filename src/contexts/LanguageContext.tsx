import React, { createContext, useCallback, useContext, useState } from 'react';
import { AppLanguage, TranslationId } from '../types';

export interface LanguageOptionMeta {
  id: AppLanguage;
  shortCode: string;
  label: string;
  nativeLabel: string;
  defaultTranslation: TranslationId;
}

export const LANGUAGE_OPTIONS: LanguageOptionMeta[] = [
  {
    id: 'uz_lat',
    shortCode: "O'Z",
    label: "O'zbekcha (Lotin)",
    nativeLabel: "O'zbekcha (Lotin)",
    defaultTranslation: 'uz_mansur',
  },
  {
    id: 'uz_cyr',
    shortCode: 'ЎЗ',
    label: 'Ўзбекча (Кирилл)',
    nativeLabel: 'Ўзбекча (Кирилл)',
    defaultTranslation: 'uz_cyr',
  },
  {
    id: 'en',
    shortCode: 'EN',
    label: 'English',
    nativeLabel: 'English',
    defaultTranslation: 'en_sahih',
  },
  {
    id: 'ru',
    shortCode: 'РУ',
    label: 'Русский',
    nativeLabel: 'Русский',
    defaultTranslation: 'ru_kuliev',
  },
];

export interface TranslationStrings {
  appTitle: string;
  mainMenuBack: string;
  backLabel: string;
  day: string;
  night: string;
  nav: {
    home: string;
    tasbih: string;
    quran: string;
    profile: string;
  };
  tabTitles: {
    home: string;
    tasbih: string;
    quran: string;
    profile: string;
    ramadan: string;
    prayer: string;
    qibla: string;
    azkar: string;
    names: string;
    zakat: string;
    qazo: string;
    guide: string;
    masjids: string;
    juma: string;
    ehson: string;
    quiz: string;
    hifz: string;
    life: string;
    fiqh: string;
    tajweed: string;
    seerah: string;
    wisdom: string;
    library: string;
    radio: string;
    haramain: string;
  };
  home: {
    nextPrayer: string;
    now: string;
    remaining: string;
    changeLocation: string;
  };
  prayers: {
    imsak: string;
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
    midnight: string;
  };
  features: {
    quran: string;
    ramadan: string;
    prayer: string;
    qibla: string;
    tasbih: string;
    azkar: string;
    names: string;
    zakat: string;
    qazo: string;
    guide: string;
    masjids: string;
    juma: string;
    ehson: string;
    quiz: string;
    hifz: string;
    life: string;
    fiqh: string;
    tajweed: string;
    seerah: string;
    wisdom: string;
    library: string;
    radio: string;
    haramain: string;
  };
  cityModal: {
    title: string;
    subtitle: string;
    useGps: string;
    searchPlaceholder: string;
    noResults: string;
  };
  profile: {
    subtitle: string;
    greeting: string;
    companion: string;
    savedAyahsStat: string;
    ramadanFastsStat: string;
    totalTasbihStat: string;
    localTimezone: string;
    languageTitle: string;
    languageHint: string;
    themeTitle: string;
    dayTitle: string;
    dayDesc: string;
    nightTitle: string;
    nightDesc: string;
    locationTitle: string;
    gpsBtn: string;
    gpsDetecting: string;
    gpsSuccess: string;
    gpsError: string;
    changeCityBtn: string;
    translationTitle: string;
    prayerCalcTitle: string;
    calcAuthorityLabel: string;
    asrMadhhabLabel: string;
    standardLabel: string;
    hanafiLabel: string;
    bookmarksTitle: string;
    clearAll: string;
    noBookmarks: string;
    shortcutsTitle: string;
    dataPrivacyTitle: string;
    resetBtn: string;
    resetConfirm: string;
    resetConfirmBtn: string;
    resetCancelBtn: string;
    aboutTitle: string;
    aboutVersion: string;
    aboutDesc: string;
  };
  quran: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allSurahs: string;
    meccan: string;
    medinan: string;
    saved: string;
    backToSurahs: string;
    translationLabel: string;
    recite: string;
    pause: string;
    loading: string;
    versesUnit: string;
    ayahWord: string;
    prevSurah: string;
    nextSurah: string;
    prevAyah: string;
    nextAyah: string;
    noResults: string;
    continueReading: string;
    resumeBtn: string;
    juzTab: string;
    juzLabel: string;
    jumaKahfTitle: string;
    jumaKahfDesc: string;
    openBtn: string;
    khatmProgress: string;
    markReadBtn: string;
    markedReadLabel: string;
    saveOfflineBtn: string;
    savedOfflineLabel: string;
    startsAtAyah: string;
  };
  alerts: {
    title: string;
    enableLabel: string;
    enableDesc: string;
    permNeeded: string;
    allowPermBtn: string;
    preReminderLabel: string;
    offOpt: string;
    minSuffix: string;
    testBtn: string;
    testSent: string;
    widgetTitle: string;
    widgetDesc: string;
    addWidgetBtn: string;
    widgetRequested: string;
  };
  updates: {
    title: string;
    currentVersion: string;
    newVersionAvailable: string;
    checkBtn: string;
    checking: string;
    upToDate: string;
    updateNowBtn: string;
    laterBtn: string;
    downloading: string;
    installing: string;
    needsPerm: string;
    errorMsg: string;
  };
  prayerTab: {
    dailySchedule: string;
    playAdhan: string;
    stopAdhan: string;
    monthlySchedule: string;
    settingsBtn: string;
    timeRemainingTo: string;
    autoGps: string;
    settingsTitle: string;
    calcMethodLabel: string;
    asrMethodLabel: string;
    standardOpt: string;
    hanafiOpt: string;
    nextBadge: string;
    nowBadge: string;
    weeklyTitle: string;
    showSchedule: string;
    hideSchedule: string;
    dayCol: string;
    rakatUnit: string;
    imsakNote: string;
    sunriseNote: string;
    midnightNote: string;
    fardSection: string;
    sunnahMarkersSection: string;
    cityTimeLabel: string;
    todayTab: string;
    monthlyTab: string;
    calendarTab: string;
    specialDatesTitle: string;
    converterTitle: string;
    gregToHijri: string;
    hijriToGreg: string;
    dayLabel: string;
    monthNameLabel: string;
    yearLabel: string;
    daysLeft: string;
    todayWord: string;
    passedWord: string;
    hijriYearLabel: string;
  };
  tasbih: {
    targetLabel: string;
    cyclesLabel: string;
    tapToCount: string;
    totalSets: string;
    totalBeads: string;
    completedWord: string;
    toggleSound: string;
    resetCounter: string;
    guideBtn: string;
    guideTitle: string;
    guideSubtitle: string;
    startOnTasbih: string;
    stepWord: string;
    autoSequenceDone: string;
    benefitLabel: string;
    infoBtn: string;
    exitGuideBtn: string;
  };
  qazo: {
    subtitle: string;
    totalRemaining: string;
    prayersTab: string;
    fastsTab: string;
    witr: string;
    addDayBtn: string;
    subDayBtn: string;
    calcTitle: string;
    yearsLabel: string;
    monthsLabel: string;
    daysLabel: string;
    applyCalcBtn: string;
    fastsRemaining: string;
    allCaughtUp: string;
    resetAllBtn: string;
    wizardBtn: string;
    wizardTitle: string;
    wizardSubtitle: string;
    trackTypeLabel: string;
    bothType: string;
    prayersOnlyType: string;
    fastsOnlyType: string;
    genderLabel: string;
    maleLabel: string;
    femaleLabel: string;
    femaleCycleHint: string;
    malePubertyHint: string;
    cycleDaysLabel: string;
    balighAgeLabel: string;
    birthDateLabel: string;
    balighDatePreview: string;
    prayerStartDateLabel: string;
    fastStartDateLabel: string;
    todayShortcut: string;
    gapSectionTitle: string;
    gapSectionDesc: string;
    bufferSectionTitle: string;
    bufferHint: string;
    extraDaysLabel: string;
    calculateAndStartBtn: string;
    skipManualBtn: string;
    summaryBreakdown: string;
    yearShort: string;
    monthShort: string;
    dayShort: string;
    completedBonusBadge: string;
    bonusCounterLabel: string;
    nextStepBtn: string;
    prevStepBtn: string;
  };
  names: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    meaningLabel: string;
    benefitLabel: string;
    closeBtn: string;
    noResults: string;
  };
  azkar: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    clearBtn: string;
    allDuas: string;
    morningAzkar: string;
    rabbanaDuas: string;
    repeatLabel: string;
    completedBtn: string;
    reciteBtn: string;
  };
  qibla: {
    title: string;
    subtitle: string;
    alignedMsg: string;
    rotateMsg: string;
    bearingLabel: string;
    fromNorth: string;
    toMakkah: string;
    simulatorTitle: string;
    northLabel: string;
    snapBtn: string;
    accuracyTitle: string;
    accuracyDesc: string;
    liveSensor: string;
    manualMode: string;
    phoneHeadingLabel: string;
    cardinalN: string;
    cardinalE: string;
    cardinalS: string;
    cardinalW: string;
  };
  zakat: {
    title: string;
    subtitle: string;
    obligatoryBadge: string;
    belowNisabBadge: string;
    totalDueLabel: string;
    netZakatableLabel: string;
    nisabLevelLabel: string;
    cashLabel: string;
    goldOwnedLabel: string;
    goldPriceLabel: string;
    investmentsLabel: string;
    debtsLabel: string;
  };
  ramadan: {
    holyMonth: string;
    ramadanKareem: string;
    suhoorIftarTimes: string;
    fastingInProgress: string;
    eatingWindow: string;
    targetLabel: string;
    untilIftar: string;
    untilSuhoor: string;
    elapsedLabel: string;
    suhoorTitle: string;
    suhoorNote: string;
    iftarTitle: string;
    iftarNote: string;
    trackerTitle: string;
    trackerHint: string;
    fastedBadge: string;
    fastedStat: string;
    qadaStat: string;
    excusedStat: string;
    remainingStat: string;
    pendingExcusedLegend: string;
    secCore: string;
    secAshras: string;
    sec30Days: string;
    secTips: string;
    daysRange1: string;
    daysRange2: string;
    daysRange3: string;
    ashra1Title: string;
    ashra1Name: string;
    ashra1Sub: string;
    ashra2Title: string;
    ashra2Name: string;
    ashra2Sub: string;
    ashra3Title: string;
    ashra3Name: string;
    ashra3Sub: string;
    dayOfRamadan: string;
    dayWord: string;
    practicalTip: string;
    refLabel: string;
  };
}

const DICTIONARY: Record<AppLanguage, TranslationStrings> = {
  uz_lat: {
    appTitle: 'Nurul Islam',
    mainMenuBack: 'Bosh menyu',
    backLabel: 'Orqaga',
    day: 'Kunduz',
    night: 'Tun',
    nav: {
      home: 'Asosiy',
      tasbih: 'Tasbeh',
      quran: "Qur'on",
      profile: 'Profil',
    },
    tabTitles: {
      home: 'Nurul Islam',
      tasbih: 'Tasbeh',
      quran: "Qur'oni Karim",
      profile: 'Profil va Sozlamalar',
      ramadan: 'Ramazon Taqvimi',
      prayer: 'Taqvim',
      qibla: 'Qibla Kompasi',
      azkar: 'Duo, Zikr va Hadis',
      names: 'Allohning 99 Ismi',
      zakat: 'Zakot Kalkulyatori',
      qazo: 'Qazo Hisobi',
      guide: 'Tahorat va Namoz',
      masjids: 'Yaqin Masjidlar',
      juma: 'Juma Rejimi',
      ehson: 'Masjidga Ehson',
      quiz: 'Ilm Viktorinasi',
      hifz: 'Yodlash Ustazi',
      life: 'Hayotiy Vaziyatlar',
      fiqh: 'Kunlik Savol-Javoblar',
      tajweed: 'Arab Alifbosi va Tajvid',
      seerah: "Siyrat va Payg'ambarlar",
      wisdom: 'Allomalar va Hikmatlar',
      library: 'Islom Kutubxonasi',
      radio: "Qur'on Radiosi",
      haramain: 'Makka & Madina Jonli',
    },
    home: {
      nextPrayer: 'Keyingi namoz',
      now: 'Hozir:',
      remaining: 'qoldi',
      changeLocation: "Hududni o'zgartirish",
    },
    prayers: {
      imsak: 'Saharlik',
      fajr: 'Bomdod',
      sunrise: 'Quyosh',
      dhuhr: 'Peshin',
      asr: 'Asr',
      maghrib: 'Shom',
      isha: 'Xufton',
      midnight: 'Tahajjud',
    },
    features: {
      quran: "Qur'on",
      ramadan: 'Ramazon',
      prayer: 'Taqvim',
      qibla: 'Qibla',
      tasbih: 'Tasbeh',
      azkar: 'Boshqa',
      names: '99 Ism',
      zakat: 'Zakot',
      qazo: 'Qazo',
      guide: 'Tahorat & Namoz',
      masjids: 'Masjidlar',
      juma: 'Juma',
      ehson: 'Masjidga Ehson',
      quiz: 'Ilm Viktorinasi',
      hifz: 'Yodlash Ustazi',
      life: 'Hayotiy Vaziyatlar',
      fiqh: 'Kunlik Savol-Javoblar',
      tajweed: 'Arab Alifbosi va Tajvid',
      seerah: "Siyrat va Payg'ambarlar",
      wisdom: 'Allomalar & Hikmat',
      library: 'Kutubxona',
      radio: "Qur'on Radiosi",
      haramain: 'Makka & Madina',
    },
    cityModal: {
      title: 'Shahar, tuman yoki qishloq',
      subtitle: 'Aniq namoz vaqtlari va Qibla yo‘nalishi uchun',
      useGps: 'Joriy joylashuvni aniqlash (GPS)',
      searchPlaceholder: 'Shahar, tuman yoki qishloq nomini yozing...',
      noResults: 'Hudud topilmadi',
    },
    profile: {
      subtitle: 'Til, namoz sozlamalari va xatcho‘plar',
      greeting: 'Assalomu alaykum',
      companion: 'Nurul Islam Hamrohi',
      savedAyahsStat: 'Saqlangan oyatlar',
      ramadanFastsStat: "Ramazon ro'zasi",
      totalTasbihStat: 'Jami tasbeh',
      localTimezone: 'Mahalliy vaqt mintaqasi',
      languageTitle: 'Ilova tili',
      languageHint: 'Interfeys va tarjimalar uchun tilni tanlang',
      themeTitle: "Ko'rinish mavzusi",
      dayTitle: 'Kunduzgi rejim',
      dayDesc: 'Yorqin yashil va sokin oq',
      nightTitle: 'Tungi rejim',
      nightDesc: "Tinch qorong'i zumrad",
      locationTitle: 'Joriy hudud',
      gpsBtn: 'GPS',
      gpsDetecting: 'Aniqlanmoqda...',
      gpsSuccess: 'Hudud yangilandi',
      gpsError: 'GPS ruxsati berilmadi',
      changeCityBtn: "O'zgartirish",
      translationTitle: "Qur'on va duo tarjimasi",
      prayerCalcTitle: 'Namoz vaqti hisobi',
      calcAuthorityLabel: 'Hisoblash usuli:',
      asrMadhhabLabel: 'Asr mazhabi:',
      standardLabel: "Shofe'iy / Standart",
      hanafiLabel: 'Hanafiy',
      bookmarksTitle: 'Saqlangan xatcho‘plar',
      clearAll: 'Tozalash',
      noBookmarks: "Hali saqlangan oyatlar yo'q.",
      shortcutsTitle: "Tezkor bo'limlar",
      dataPrivacyTitle: "Ma'lumotlar va sozlamalar",
      resetBtn: 'Sozlamalarni tiklash',
      resetConfirm: 'Barcha saqlangan sozlamalar boshlang‘ich holatga qaytarilsinmi?',
      resetConfirmBtn: 'Tasdiqlash',
      resetCancelBtn: 'Bekor qilish',
      aboutTitle: 'Ilova haqida',
      aboutVersion: 'Nurul Islam • Talqin 1.0',
      aboutDesc: "Aniq namoz vaqtlari, Qibla kompasi, Qur'oni Karim tarjimalari va kundalik zikrlar to'plami. Barcha sozlamalar qurilmangizda mahalliy saqlanadi.",
    },
    quran: {
      title: "Qur'oni Karim",
      subtitle: "114 Sura • 6 236 Oyat • Ko'p tilli tarjima",
      searchPlaceholder: 'Sura nomi, raqami yoki ma’nosini izlang...',
      allSurahs: 'Barcha 114 Sura',
      meccan: 'Makkiy',
      medinan: 'Madaniy',
      saved: 'Saqlangan',
      backToSurahs: 'Suralar',
      translationLabel: 'Tarjima:',
      recite: 'Tinglash',
      pause: 'Pauza',
      loading: 'Sura oyatlari yuklanmoqda...',
      versesUnit: 'oyat',
      ayahWord: 'Oyat',
      prevSurah: 'Oldingi sura',
      nextSurah: 'Keyingi sura',
      prevAyah: 'Oldingi oyat',
      nextAyah: 'Keyingi oyat',
      noResults: 'Sura topilmadi',
      continueReading: "O'qishni davom ettirish",
      resumeBtn: 'Davom etish',
      juzTab: '30 Juz',
      juzLabel: 'Juz',
      jumaKahfTitle: 'Juma sunnati · Kahf surasi',
      jumaKahfDesc: 'Juma kuni Kahf surasini o‘qish fazilati',
      openBtn: 'Ochish',
      khatmProgress: 'Xatm progressi',
      markReadBtn: "O'qildi deb belgilash",
      markedReadLabel: "O'qilgan ✓",
      saveOfflineBtn: 'Oflayn saqlash',
      savedOfflineLabel: 'Oflayn saqlangan ✓',
      startsAtAyah: 'boshlanishi:',
    },
    alerts: {
      title: 'Namoz bildirishnomalari',
      enableLabel: 'Namoz vaqti eslatmalarini yoqish',
      enableDesc: 'Har bir namoz vaqtida telefon orqali ogohlantirish',
      permNeeded: 'Bildirishnoma ruxsati kerak',
      allowPermBtn: 'Ruxsat berish',
      preReminderLabel: 'Oldindan eslatish:',
      offOpt: "O'chiq",
      minSuffix: 'daq',
      testBtn: 'Sinov xabari yuborish',
      testSent: 'Sinov xabari yuborildi ✓',
      widgetTitle: 'Asosiy ekran vidjeti',
      widgetDesc: 'Telefon bosh ekranida bugungi 5 namoz vaqti va keyingi namozni ko‘ring.',
      addWidgetBtn: "Vidjetni ekranga qo'shish",
      widgetRequested: "Vidjet qo'shish oynasi ochildi ✓",
    },
    updates: {
      title: 'Ilova yangilanishi',
      currentVersion: 'Joriy talqin',
      newVersionAvailable: 'Yangi talqin tayyor!',
      checkBtn: 'Yangilanishni tekshirish',
      checking: 'Tekshirilmoqda...',
      upToDate: 'Eng so‘nggi talqin o‘rnatilgan ✓',
      updateNowBtn: 'Hozir yangilash',
      laterBtn: 'Keyinroq',
      downloading: 'Yuklanmoqda',
      installing: "O'rnatish oynasi ochilmoqda...",
      needsPerm: "O'rnatish ruxsatini yoqing va qayta bosing",
      errorMsg: 'Server bilan ulanib bo‘lmadi',
    },
    prayerTab: {
      dailySchedule: 'Bugungi namoz vaqtlari',
      playAdhan: 'Azon tinglash',
      stopAdhan: "Azonni to'xtatish",
      monthlySchedule: 'Oylik taqvim',
      settingsBtn: 'Hisob usuli',
      timeRemainingTo: 'Qolgan vaqt:',
      autoGps: 'GPS aniqlash',
      settingsTitle: 'Hisoblash sozlamalari',
      calcMethodLabel: 'Hisoblash usuli:',
      asrMethodLabel: 'Asr mazhabi:',
      standardOpt: "Standart (Shofe'iy, Molikiy, Hanbaliy)",
      hanafiOpt: 'Hanafiy (Ikki barobar soya)',
      nextBadge: 'KEYINGI',
      nowBadge: 'HOZIR',
      weeklyTitle: '7 kunlik namoz jadvali',
      showSchedule: "Jadvalni ko'rsatish",
      hideSchedule: 'Yashirish',
      dayCol: 'Kun',
      rakatUnit: 'rakat',
      imsakNote: 'Saharlik chegarasi',
      sunriseNote: 'Bomdod vaqti tugashi',
      midnightNote: 'Tunning yarmi / Tahajjud',
      fardSection: '5 vaqt farz namozlar',
      sunnahMarkersSection: 'Vaqt belgilari',
      cityTimeLabel: 'Shahar vaqti',
      todayTab: 'Bugun',
      monthlyTab: 'Oylik taqvim',
      calendarTab: 'Hijriy va Kunlar',
      specialDatesTitle: 'Muhim islomiy sanalar',
      converterTitle: 'Hijriy ↔ Milodiy tarjimon',
      gregToHijri: 'Milodiydan → Hijriyga',
      hijriToGreg: 'Hijriydan → Milodiyga',
      dayLabel: 'Kun',
      monthNameLabel: 'Oy',
      yearLabel: 'Yil',
      daysLeft: 'kun qoldi',
      todayWord: 'Bugun!',
      passedWord: 'O‘tgan',
      hijriYearLabel: 'Hijriy yil',
    },
    tasbih: {
      targetLabel: 'Maqsad',
      cyclesLabel: 'Sikl',
      tapToCount: 'BOSING YOKI SURING',
      totalSets: 'Yakunlangan',
      totalBeads: 'Jami zikr',
      completedWord: 'marta',
      toggleSound: 'Ovozni yoqish/o‘chirish',
      resetCounter: 'Hisobni nolga tushirish',
      guideBtn: 'Zikrlar',
      guideTitle: 'Qaysi zikrni aytish kerak?',
      guideSubtitle: 'Holatingizga mos zikrni tanlang va darhol sanang',
      startOnTasbih: 'Tasbehda boshlash',
      stepWord: 'Bosqich',
      autoSequenceDone: 'To‘liq tasbeh (33+33+34) yakunlandi!',
      benefitLabel: 'Fazilati va qachon aytilishi',
      infoBtn: 'Zikr haqida ma’lumot',
      exitGuideBtn: 'Yopish',
    },
    qazo: {
      subtitle: 'Qazo namozlari va ro‘zalar hisobi',
      totalRemaining: 'Qolgan jami qazo',
      prayersTab: 'Namozlar',
      fastsTab: 'Ro‘za',
      witr: 'Vitr',
      addDayBtn: '+1 kun (6 namoz)',
      subDayBtn: '-1 kun (bajarildi)',
      calcTitle: 'Muddat bo‘yicha qo‘shish',
      yearsLabel: 'Yil',
      monthsLabel: 'Oy',
      daysLabel: 'Kun',
      applyCalcBtn: 'Ro‘yxatga qo‘shish',
      fastsRemaining: 'Qolgan qazo ro‘zalar',
      allCaughtUp: 'Barcha qazolar ado etilgan!',
      resetAllBtn: 'Nolga tushirish',
      wizardBtn: 'Qazo hisoblagich',
      wizardTitle: 'Qazo hisobini aniqlash',
      wizardSubtitle: 'Tug‘ilgan sana va ibodat boshlagan davringiz asosida aniq hisoblang',
      trackTypeLabel: 'Nimani hisoblamoqchisiz?',
      bothType: 'Namoz va Ro‘za',
      prayersOnlyType: 'Faqat Namoz',
      fastsOnlyType: 'Faqat Ro‘za',
      genderLabel: 'Jinsingiz (shariat hisobi uchun)',
      maleLabel: 'Erkak',
      femaleLabel: 'Ayol',
      femaleCycleHint: 'Ayollar uchun oylik hayz kunlari namoz qazosidan chegiriladi, biroq Ramazon ro‘zasi qazosi saqlanadi.',
      malePubertyHint: 'O‘g‘il bolalar uchun balog‘at yoshi odatda qamariy 12–15 yosh oralig‘ida belgilanadi.',
      cycleDaysLabel: 'Oyiga o‘rtacha hayz kunlari:',
      balighAgeLabel: 'Balog‘atga yetgan yosh (qamariy):',
      birthDateLabel: 'Tug‘ilgan sanangiz (Yil / Oy / Kun)',
      balighDatePreview: 'Taxminiy balog‘at sanasi:',
      prayerStartDateLabel: 'Namoz o‘qishni boshlagan sana',
      fastStartDateLabel: 'Ro‘za tutishni boshlagan sana',
      todayShortcut: 'Bugundan',
      gapSectionTitle: 'Oradagi uzilish va kasallik davri',
      gapSectionDesc: 'Namozni boshlagandan keyin kasallik yoki boshqa sabab bilan o‘qilmay qolgan muddat bo‘lsa kiriting:',
      bufferSectionTitle: 'Ehtiyot va bonus kunlar qo‘shish',
      bufferHint: 'Shubhada qolmaslik uchun ko‘proq kun belgilash tavsiya etiladi. Haqiqiy qazolaringizdan ko‘proq o‘qisangiz ham, ortiqchasi siz uchun nafl (bonus) namoz sifatida yoziladi!',
      extraDaysLabel: 'Qo‘shimcha ehtiyot kunlari:',
      calculateAndStartBtn: 'Hisoblash va boshlash',
      skipManualBtn: 'Qo‘lda kiritishga o‘tish',
      summaryBreakdown: 'Taxminiy muddat:',
      yearShort: 'yil',
      monthShort: 'oy',
      dayShort: 'kun',
      completedBonusBadge: 'Bonus (Nafl)',
      bonusCounterLabel: 'Ortiqcha o‘qilgan bonus (nafl) ibodatlar:',
      nextStepBtn: 'Keyingi',
      prevStepBtn: 'Orqaga',
    },
    names: {
      title: 'Allohning 99 Ismi',
      subtitle: "Asmo ul-Husno: ma'nolari va fazilatlari",
      searchPlaceholder: 'Ism, ma’no yoki raqamni izlang (1–99)...',
      meaningLabel: "Ma'nosi va izohi",
      benefitLabel: 'Ruhiy foydasi va fazilati',
      closeBtn: 'Yopish',
      noResults: 'Mos ism topilmadi',
    },
    azkar: {
      title: 'Zikr va Duolar',
      subtitle: 'Kundalik zikrlar va Rabbana duolari',
      searchPlaceholder: 'Duo izlang (masalan: Istig‘for, Ota-ona, Tong)...',
      clearBtn: 'Tozalash',
      allDuas: 'Barcha duolar',
      morningAzkar: 'Tonggi zikrlar',
      rabbanaDuas: 'Rabbana duolari',
      repeatLabel: 'Takror:',
      completedBtn: '✓ Bajarildi',
      reciteBtn: 'Zikr (+1)',
    },
    qibla: {
      title: 'Qibla Kompasi',
      subtitle: "Ka'ba yo'nalishi va aniq azimut",
      alignedMsg: "Muqaddas Ka'ba tomon to'g'rilandi!",
      rotateMsg: "Oltin o'q yuqoriga qaraguncha buring",
      bearingLabel: "Qibla yo'nalishi:",
      fromNorth: 'Shimoldan',
      toMakkah: 'Makkagacha',
      simulatorTitle: 'Kompas tekshiruvchisi (qo‘lda burish)',
      northLabel: '0° (Shimol)',
      snapBtn: 'Qiblaga tekislash',
      accuracyTitle: 'Aniq sferik hisoblash',
      accuracyDesc:
        "Makka shahridagi Ka'ba (21.4225° Sh, 39.8262° Shq) koordinatalari asosida hisoblangan. Telefoningiz kompasini kalibrlash uchun uni havoda 8 raqami shaklida harakatlantiring.",
      liveSensor: 'Jonli kompas sensori',
      manualMode: 'Qo‘lda boshqarish',
      phoneHeadingLabel: 'Telefon yo‘nalishi:',
      cardinalN: 'Sh',
      cardinalE: 'Shq',
      cardinalS: 'J',
      cardinalW: 'G‘',
    },
    zakat: {
      title: 'Zakot Kalkulyatori',
      subtitle: 'Yillik 2,5% zakot miqdorini hisoblash',
      obligatoryBadge: 'Zakot berish farz (Nisobga yetgan)',
      belowNisabBadge: 'Nisob miqdoridan kam',
      totalDueLabel: 'To‘lanadigan zakot (2,5%)',
      netZakatableLabel: 'Sof mol-mulk',
      nisabLevelLabel: 'Nisob chegarasi',
      cashLabel: 'Naqd pul va bank hisoblari ($):',
      goldOwnedLabel: 'Oltin miqdori (gramm):',
      goldPriceLabel: '1 gr oltin narxi ($):',
      investmentsLabel: 'Tijorat mollari va sarmoyalar ($):',
      debtsLabel: 'Qarzlar va joriy xarajatlar ($):',
    },
    ramadan: {
      holyMonth: 'Muborak oy',
      ramadanKareem: 'Ramazon Karim',
      suhoorIftarTimes: 'Saharlik va Iftorlik',
      fastingInProgress: "Ro'za vaqti (Kunduz)",
      eatingWindow: 'Iftorlik va Saharlik oraliği',
      targetLabel: 'Vaqt:',
      untilIftar: 'Iftorlikkacha qolgan vaqt (Shom)',
      untilSuhoor: 'Saharlik tugashigacha (Bomdod)',
      elapsedLabel: "o'tdi",
      suhoorTitle: 'Saharlik (Og‘iz yopish)',
      suhoorNote: "Bomdoddan 10 daqiqa oldin yopish sunnat",
      iftarTitle: 'Iftorlik (Shom)',
      iftarNote: "Xurmo va suv bilan og'iz ochish",
      trackerTitle: "30 kunlik ro'za nazorati",
      trackerHint: 'Kunni bosing: Tutildi ✓ • Qazo • Uzrli',
      fastedBadge: "Tutildi",
      fastedStat: 'Tutildi',
      qadaStat: 'Qazo',
      excusedStat: 'Uzrli',
      remainingStat: 'Qoldi',
      pendingExcusedLegend: 'Kutilmoqda / Uzrli',
      secCore: 'Saharlik va Iftor duolari',
      secAshras: "3 o'n kunlik",
      sec30Days: '30 kunlik duolar',
      secTips: 'Sunnat odoblari',
      daysRange1: '1–10 kunlar',
      daysRange2: '11–20 kunlar',
      daysRange3: '21–30 kunlar',
      ashra1Title: '1-Ashra',
      ashra1Name: 'Rahmat o‘n kunligi',
      ashra1Sub: '1–10 kunlar • Allohning rahmati',
      ashra2Title: '2-Ashra',
      ashra2Name: "Mag'firat o'n kunligi",
      ashra2Sub: '11–20 kunlar • Gunohlardan poklanish',
      ashra3Title: '3-Ashra',
      ashra3Name: 'Najot o‘n kunligi',
      ashra3Sub: '21–30 kunlar • Qadr kechasi va najot',
      dayOfRamadan: '-kun · Ramazon',
      dayWord: 'Kun',
      practicalTip: 'Amaliy tavsiya:',
      refLabel: 'Manba:',
    },
  },
  uz_cyr: {
    appTitle: 'Nurul Islam',
    mainMenuBack: 'Бош меню',
    backLabel: 'Орқага',
    day: 'Кундуз',
    night: 'Тун',
    nav: {
      home: 'Асосий',
      tasbih: 'Тасбеҳ',
      quran: 'Қуръон',
      profile: 'Профил',
    },
    tabTitles: {
      home: 'Nurul Islam',
      tasbih: 'Тасбеҳ',
      quran: 'Қуръони Карим',
      profile: 'Профил ва Созламалар',
      ramadan: 'Рамазон Тақвими',
      prayer: 'Тақвим',
      qibla: 'Қибла Компаси',
      azkar: 'Дуо, Зикр ва Ҳадис',
      names: 'Аллоҳнинг 99 Исми',
      zakat: 'Закот Калкулятори',
      qazo: 'Қазо Ҳисоби',
      guide: 'Таҳорат ва Намоз',
      masjids: 'Яқин Масжидлар',
      juma: 'Жума Режими',
      ehson: 'Масжидга Эҳсон',
      quiz: 'Илм Викторинаси',
      hifz: 'Ёдлаш Устази',
      life: 'Ҳаётий Вазиятлар',
      fiqh: 'Кунлик Савол-Жавоблар',
      tajweed: 'Араб Алифбоси ва Тажвид',
      seerah: 'Сийрат ва Пайғамбарлар',
      wisdom: 'Алломалар ва Ҳикматлар',
      library: 'Ислом Кутубхонаси',
      radio: 'Қуръон Радиоси',
      haramain: 'Макка & Мадина Жонли',
    },
    home: {
      nextPrayer: 'Кейинги намоз',
      now: 'Ҳозир:',
      remaining: 'қолди',
      changeLocation: 'Ҳудудни ўзгартириш',
    },
    prayers: {
      imsak: 'Саҳарлик',
      fajr: 'Бомдод',
      sunrise: 'Қуёш',
      dhuhr: 'Пешин',
      asr: 'Аср',
      maghrib: 'Шом',
      isha: 'Хуфтон',
      midnight: 'Таҳажжуд',
    },
    features: {
      quran: 'Қуръон',
      ramadan: 'Рамазон',
      prayer: 'Тақвим',
      qibla: 'Қибла',
      tasbih: 'Тасбеҳ',
      azkar: 'Бошқа',
      names: '99 Исм',
      zakat: 'Закот',
      qazo: 'Қазо',
      guide: 'Таҳорат & Намоз',
      masjids: 'Масжидлар',
      juma: 'Жума',
      ehson: 'Масжид Эҳсон',
      quiz: 'Илм Викторинаси',
      hifz: 'Ёдлаш Устази',
      life: 'Ҳаётий Дуолар',
      fiqh: 'Савол-Жавоб',
      tajweed: 'Алифбо & Тажвид',
      seerah: 'Сийрат & Қиссалар',
      wisdom: 'Алломалар & Ҳикмат',
      library: 'Кутубхона',
      radio: 'Қуръон Радиоси',
      haramain: 'Макка & Мадина',
    },
    cityModal: {
      title: 'Шаҳар, туман ёки қишлоқ',
      subtitle: 'Аниқ намоз вақтлари ва Қибла йўналиши учун',
      useGps: 'Жорий жойлашувни аниқлаш (GPS)',
      searchPlaceholder: 'Шаҳар, туман ёки қишлоқ номини ёзинг...',
      noResults: 'Ҳудуд топилмади',
    },
    profile: {
      subtitle: 'Тил, намоз созламалари ва хатчўплар',
      greeting: 'Ассалому алайкум',
      companion: 'Nurul Islam Ҳамроҳи',
      savedAyahsStat: 'Сақланган оятлар',
      ramadanFastsStat: 'Рамазон рўзаси',
      totalTasbihStat: 'Жами тасбеҳ',
      localTimezone: 'Маҳаллий вақт минтақаси',
      languageTitle: 'Илова тили',
      languageHint: 'Интерфейс ва таржималар учун тилни танланг',
      themeTitle: 'Кўриниш мавзуси',
      dayTitle: 'Кундузги режим',
      dayDesc: 'Ёрқин яшил ва сокин оқ',
      nightTitle: 'Тунги режим',
      nightDesc: 'Тинч қоронғи зумрад',
      locationTitle: 'Жорий ҳудуд',
      gpsBtn: 'GPS',
      gpsDetecting: 'Аниқланмоқда...',
      gpsSuccess: 'Ҳудуд янгиланди',
      gpsError: 'GPS рухсати берилмади',
      changeCityBtn: 'Ўзгартириш',
      translationTitle: 'Қуръон ва дуо таржимаси',
      prayerCalcTitle: 'Намоз вақти ҳисоби',
      calcAuthorityLabel: 'Ҳисоблаш усули:',
      asrMadhhabLabel: 'Аср мазҳаби:',
      standardLabel: 'Шофеъий / Стандарт',
      hanafiLabel: 'Ҳанафий',
      bookmarksTitle: 'Сақланган хатчўплар',
      clearAll: 'Тозалаш',
      noBookmarks: 'Ҳали сақланган оятлар йўқ.',
      shortcutsTitle: 'Тезкор бўлимлар',
      dataPrivacyTitle: 'Маълумотлар ва созламалар',
      resetBtn: 'Созламаларни тиклаш',
      resetConfirm: 'Барча сақланган созламалар бошланғич ҳолатга қайтарилсинми?',
      resetConfirmBtn: 'Тасдиқлаш',
      resetCancelBtn: 'Бекор қилиш',
      aboutTitle: 'Илова ҳақида',
      aboutVersion: 'Nurul Islam • Талқин 1.0',
      aboutDesc: 'Аниқ намоз вақтлари, Қибла компаси, Қуръони Карим таржималари ва кундалик зикрлар тўплами. Барча созламалар қурилмангизда маҳаллий сақланади.',
    },
    quran: {
      title: 'Қуръони Карим',
      subtitle: '114 Сура • 6 236 Оят • Кўп тилли таржима',
      searchPlaceholder: 'Сура номи, рақами ёки маъносини изланг...',
      allSurahs: 'Барча 114 Сура',
      meccan: 'Маккий',
      medinan: 'Маданий',
      saved: 'Сақланган',
      backToSurahs: 'Суралар',
      translationLabel: 'Таржима:',
      recite: 'Тинглаш',
      pause: 'Пауза',
      loading: 'Сура оятлари юкланмоқда...',
      versesUnit: 'оят',
      ayahWord: 'Оят',
      prevSurah: 'Олдинги сура',
      nextSurah: 'Кейинги сура',
      prevAyah: 'Олдинги оят',
      nextAyah: 'Кейинги оят',
      noResults: 'Сура топилмади',
      continueReading: 'Ўқишни давом эттириш',
      resumeBtn: 'Давом этиш',
      juzTab: '30 Жуз',
      juzLabel: 'Жуз',
      jumaKahfTitle: 'Жума суннати · Каҳф сураси',
      jumaKahfDesc: 'Жума куни Каҳф сурасини ўқиш фазилати',
      openBtn: 'Очиш',
      khatmProgress: 'Хатм прогресси',
      markReadBtn: 'Ўқилди деб белгилаш',
      markedReadLabel: 'Ўқилган ✓',
      saveOfflineBtn: 'Офлайн сақлаш',
      savedOfflineLabel: 'Офлайн сақланган ✓',
      startsAtAyah: 'бошланиши:',
    },
    alerts: {
      title: 'Намоз билдиришномалари',
      enableLabel: 'Намоз вақти эслатмаларини ёқиш',
      enableDesc: 'Ҳар бир намоз вақтида телефон орқали огоҳлантириш',
      permNeeded: 'Билдиришнома рухсати керак',
      allowPermBtn: 'Рухсат бериш',
      preReminderLabel: 'Олдиндан эслатиш:',
      offOpt: 'Ўчиқ',
      minSuffix: 'дақ',
      testBtn: 'Синов хабари юбориш',
      testSent: 'Синов хабари юборилди ✓',
      widgetTitle: 'Асосий экран виджети',
      widgetDesc: 'Телефон бош экранида бугунги 5 намоз вақти ва кейинги намозни кўринг.',
      addWidgetBtn: 'Виджетни экранга қўшиш',
      widgetRequested: 'Виджет қўшиш ойнаси очилди ✓',
    },
    updates: {
      title: 'Илова янгиланиши',
      currentVersion: 'Жорий талқин',
      newVersionAvailable: 'Янги талқин тайёр!',
      checkBtn: 'Янгиланишни текшириш',
      checking: 'Текширилмоқда...',
      upToDate: 'Энг сўнгги талқин ўрнатилган ✓',
      updateNowBtn: 'Ҳозир янгилаш',
      laterBtn: 'Кейинроқ',
      downloading: 'Юкланмоқда',
      installing: 'Ўрнатиш ойнаси очилмоқда...',
      needsPerm: 'Ўрнатиш рухсатини ёқинг ва қайта босинг',
      errorMsg: 'Сервер билан уланиб бўлмади',
    },
    prayerTab: {
      dailySchedule: 'Бугунги намоз вақтлари',
      playAdhan: 'Азон тинглаш',
      stopAdhan: 'Азонни тўхтатиш',
      monthlySchedule: 'Ойлик тақвим',
      settingsBtn: 'Ҳисоб усули',
      timeRemainingTo: 'Қолган вақт:',
      autoGps: 'GPS аниқлаш',
      settingsTitle: 'Ҳисоблаш созламалари',
      calcMethodLabel: 'Ҳисоблаш усули:',
      asrMethodLabel: 'Аср мазҳаби:',
      standardOpt: 'Стандарт (Шофеъий, Моликий, Ҳанбалий)',
      hanafiOpt: 'Ҳанафий (Икки баробар соя)',
      nextBadge: 'КЕЙИНГИ',
      nowBadge: 'ҲОЗИР',
      weeklyTitle: '7 кунлик намоз жадвали',
      showSchedule: 'Жадвални кўрсатиш',
      hideSchedule: 'Яшириш',
      dayCol: 'Кун',
      rakatUnit: 'ракат',
      imsakNote: 'Саҳарлик чегараси',
      sunriseNote: 'Бомдод вақти тугаши',
      midnightNote: 'Туннинг ярми / Таҳажжуд',
      fardSection: '5 вақт фарз намозлар',
      sunnahMarkersSection: 'Вақт белгилари',
      cityTimeLabel: 'Шаҳар вақти',
      todayTab: 'Бугун',
      monthlyTab: 'Ойлик тақвим',
      calendarTab: 'Ҳижрий ва Кунлар',
      specialDatesTitle: 'Муҳим исломий саналар',
      converterTitle: 'Ҳижрий ↔ Милодий таржимон',
      gregToHijri: 'Милодийдан → Ҳижрийга',
      hijriToGreg: 'Ҳижрийдан → Милодийга',
      dayLabel: 'Кун',
      monthNameLabel: 'Ой',
      yearLabel: 'Йил',
      daysLeft: 'кун қолди',
      todayWord: 'Бугун!',
      passedWord: 'Ўтган',
      hijriYearLabel: 'Ҳижрий йил',
    },
    tasbih: {
      targetLabel: 'Мақсад',
      cyclesLabel: 'Цикл',
      tapToCount: 'БОСИНГ ЁКИ СУРИНГ',
      totalSets: 'Якунланган',
      totalBeads: 'Жами зикр',
      completedWord: 'марта',
      toggleSound: 'Овозни ёқиш/ўчириш',
      resetCounter: 'Ҳисобни нолга тушириш',
      guideBtn: 'Зикрлар',
      guideTitle: 'Қайси зикрни айтиш керак?',
      guideSubtitle: 'Ҳолатингизга мос зикрни танланг ва дарҳол сананг',
      startOnTasbih: 'Тасбеҳда бошлаш',
      stepWord: 'Босқич',
      autoSequenceDone: 'Тўлиқ тасбеҳ (33+33+34) якунланди!',
      benefitLabel: 'Фазилати ва қачон айтилиши',
      infoBtn: 'Зикр ҳақида маълумот',
      exitGuideBtn: 'Ёпиш',
    },
    qazo: {
      subtitle: 'Қазо намозлари ва рўзалар ҳисоби',
      totalRemaining: 'Қолган жами қазо',
      prayersTab: 'Намозлар',
      fastsTab: 'Рўза',
      witr: 'Витр',
      addDayBtn: '+1 кун (6 намоз)',
      subDayBtn: '-1 кун (бажарилди)',
      calcTitle: 'Муддат бўйича қўшиш',
      yearsLabel: 'Йил',
      monthsLabel: 'Ой',
      daysLabel: 'Кун',
      applyCalcBtn: 'Рўйхатга қўшиш',
      fastsRemaining: 'Қолган қазо рўзалар',
      allCaughtUp: 'Барча қазолар адо этилган!',
      resetAllBtn: 'Нолга тушириш',
      wizardBtn: 'Қазо ҳисоблагич',
      wizardTitle: 'Қазо ҳисобини аниқлаш',
      wizardSubtitle: 'Туғилган сана ва ибодат бошлаган даврингиз асосида аниқ ҳисобланг',
      trackTypeLabel: 'Нимани ҳисобламоқчисиз?',
      bothType: 'Намоз ва Рўза',
      prayersOnlyType: 'Фақат Намоз',
      fastsOnlyType: 'Фақат Рўза',
      genderLabel: 'Жинсингиз (шариат ҳисоби учун)',
      maleLabel: 'Эркак',
      femaleLabel: 'Аёл',
      femaleCycleHint: 'Аёллар учун ойлик ҳайз кунлари намоз қазосидан чегирилади, бироқ Рамазон рўзаси қазоси сақланади.',
      malePubertyHint: 'Ўғил болалар учун балоғат ёши одатда қамарий 12–15 ёш оралиғида белгиланади.',
      cycleDaysLabel: 'Ойига ўртача ҳайз кунлари:',
      balighAgeLabel: 'Балоғатга етган ёш (қамарий):',
      birthDateLabel: 'Туғилган санангиз (Йил / Ой / Кун)',
      balighDatePreview: 'Тахминий балоғат санаси:',
      prayerStartDateLabel: 'Намоз ўқишни бошлаган сана',
      fastStartDateLabel: 'Рўза тутишни бошлаган сана',
      todayShortcut: 'Бугундан',
      gapSectionTitle: 'Орадаги узилиш ва касаллик даври',
      gapSectionDesc: 'Намозни бошлагандан кейин касаллик ёки бошқа сабаб билан ўқилмай қолган муддат бўлса киритинг:',
      bufferSectionTitle: 'Эҳтиёт ва бонус кунлар қўшиш',
      bufferHint: 'Шубҳада қолмаслик учун кўпроқ кун белгилаш тавсия этилади. Ҳақиқий қазоларингиздан кўпроқ ўқисангиз ҳам, ортиқчаси сиз учун нафл (бонус) намоз сифатида ёзилади!',
      extraDaysLabel: 'Қўшимча эҳтиёт кунлари:',
      calculateAndStartBtn: 'Ҳисоблаш ва бошлаш',
      skipManualBtn: 'Қўлда киритишга ўтиш',
      summaryBreakdown: 'Тахминий муддат:',
      yearShort: 'йил',
      monthShort: 'ой',
      dayShort: 'кун',
      completedBonusBadge: 'Бонус (Нафл)',
      bonusCounterLabel: 'Ортиқча ўқилган бонус (нафл) ибодатлар:',
      nextStepBtn: 'Кейинги',
      prevStepBtn: 'Орқага',
    },
    names: {
      title: 'Аллоҳнинг 99 Исми',
      subtitle: 'Асмо ул-Ҳусно: маънолари ва фазилатлари',
      searchPlaceholder: 'Исм, маъно ёки рақамни изланг (1–99)...',
      meaningLabel: 'Маъноси ва изоҳи',
      benefitLabel: 'Руҳий фойдаси ва фазилати',
      closeBtn: 'Ёпиш',
      noResults: 'Мос исм топилмади',
    },
    azkar: {
      title: 'Зикр ва Дуолар',
      subtitle: 'Кундалик зикрлар ва Раббана дуолари',
      searchPlaceholder: 'Дуо изланг (масалан: Истиғфор, Ота-она, Тонг)...',
      clearBtn: 'Тозалаш',
      allDuas: 'Барча дуолар',
      morningAzkar: 'Тонгги зикрлар',
      rabbanaDuas: 'Раббана дуолари',
      repeatLabel: 'Такрор:',
      completedBtn: '✓ Бажарилди',
      reciteBtn: 'Зикр (+1)',
    },
    qibla: {
      title: 'Қибла Компаси',
      subtitle: 'Каъба йўналиши ва аниқ азимут',
      alignedMsg: 'Муқаддас Каъба томон тўғриланди!',
      rotateMsg: 'Олтин ўқ юқорига қарагунча буринг',
      bearingLabel: 'Қибла йўналиши:',
      fromNorth: 'Шимолдан',
      toMakkah: 'Маккагача',
      simulatorTitle: 'Компас текширувчиси (қўлда буриш)',
      northLabel: '0° (Шимол)',
      snapBtn: 'Қиблага текислаш',
      accuracyTitle: 'Аниқ сферик ҳисоблаш',
      accuracyDesc:
        'Макка шаҳридаги Каъба (21.4225° Ш, 39.8262° Шқ) координаталари асосида ҳисобланган. Телефонингиз компасини калибрлаш учун уни ҳавода 8 рақами шаклида ҳаракатлантиринг.',
      liveSensor: 'Жонли компас сенсори',
      manualMode: 'Қўлда бошқариш',
      phoneHeadingLabel: 'Телефон йўналиши:',
      cardinalN: 'Ш',
      cardinalE: 'Шқ',
      cardinalS: 'Ж',
      cardinalW: 'Ғ',
    },
    zakat: {
      title: 'Закот Калкулятори',
      subtitle: 'Йиллик 2,5% закот миқдорини ҳисоблаш',
      obligatoryBadge: 'Закот бериш фарз (Нисобга етган)',
      belowNisabBadge: 'Нисоб миқдоридан кам',
      totalDueLabel: 'Тўланадиган закот (2,5%)',
      netZakatableLabel: 'Соф мол-мулк',
      nisabLevelLabel: 'Нисоб чегараси',
      cashLabel: 'Нақд пул ва банк ҳисоблари ($):',
      goldOwnedLabel: 'Олтин миқдори (грамм):',
      goldPriceLabel: '1 гр олтин нархи ($):',
      investmentsLabel: 'Тижорат моллари ва сармоялар ($):',
      debtsLabel: 'Қарзлар ва жорий харажатлар ($):',
    },
    ramadan: {
      holyMonth: 'Муборак ой',
      ramadanKareem: 'Рамазон Карим',
      suhoorIftarTimes: 'Саҳарлик ва Ифторлик',
      fastingInProgress: 'Рўза вақти (Кундуз)',
      eatingWindow: 'Ифторлик ва Саҳарлик оралиғи',
      targetLabel: 'Вақт:',
      untilIftar: 'Ифторликкача қолган вақт (Шом)',
      untilSuhoor: 'Саҳарлик тугашигача (Бомдод)',
      elapsedLabel: 'ўтди',
      suhoorTitle: 'Саҳарлик (Оғиз ёпиш)',
      suhoorNote: 'Бомдоддан 10 дақиқа олдин ёпиш суннат',
      iftarTitle: 'Ифторлик (Шом)',
      iftarNote: 'Хурмо ва сув билан оғиз очиш',
      trackerTitle: '30 кунлик рўза назорати',
      trackerHint: 'Кунни босинг: Тутилди ✓ • Қазо • Узрли',
      fastedBadge: 'Тутилди',
      fastedStat: 'Тутилди',
      qadaStat: 'Қазо',
      excusedStat: 'Узрли',
      remainingStat: 'Қолди',
      pendingExcusedLegend: 'Кутилмоқда / Узрли',
      secCore: 'Саҳарлик ва Ифтор дуолари',
      secAshras: '3 ўн кунлик',
      sec30Days: '30 кунлик дуолар',
      secTips: 'Суннат одоблари',
      daysRange1: '1–10 кунлар',
      daysRange2: '11–20 кунлар',
      daysRange3: '21–30 кунлар',
      ashra1Title: '1-Ашра',
      ashra1Name: 'Раҳмат ўн кунлиги',
      ashra1Sub: '1–10 кунлар • Аллоҳнинг раҳмати',
      ashra2Title: '2-Ашра',
      ashra2Name: 'Мағфират ўн кунлиги',
      ashra2Sub: '11–20 кунлар • Гуноҳлардан покланиш',
      ashra3Title: '3-Ашра',
      ashra3Name: 'Нажот ўн кунлиги',
      ashra3Sub: '21–30 кунлар • Қадр кечаси ва нажот',
      dayOfRamadan: '-кун · Рамазон',
      dayWord: 'Кун',
      practicalTip: 'Амалий тавсия:',
      refLabel: 'Манба:',
    },
  },
  en: {
    appTitle: 'Nurul Islam',
    mainMenuBack: 'Main Menu',
    backLabel: 'Back',
    day: 'Day',
    night: 'Night',
    nav: {
      home: 'Home',
      tasbih: 'Tasbih',
      quran: 'Quran',
      profile: 'Profile',
    },
    tabTitles: {
      home: 'Nurul Islam',
      tasbih: 'Tasbih',
      quran: 'The Holy Quran',
      profile: 'Profile & Settings',
      ramadan: 'Ramadan Hub',
      prayer: 'Islamic Calendar',
      qibla: 'Qibla Compass',
      azkar: 'Duas, Hadith & Ayahs',
      names: '99 Names of Allah',
      zakat: 'Zakat Calculator',
      qazo: 'Qazo Tracker',
      guide: 'Wudu & Prayer Guide',
      masjids: 'Nearby Masjids',
      juma: 'Juma Mode',
      ehson: 'Masjid Support',
      quiz: 'Islamic Quiz',
      hifz: 'Hifz Trainer',
      life: 'Life Situations Guide',
      fiqh: 'Hanafi Fiqh Q&A',
      tajweed: 'Arabic & Tajweed',
      seerah: 'Seerah & 25 Prophets',
      wisdom: 'Scholars & Wisdom',
      library: 'Islamic Library',
      radio: 'Quran Radio Live',
      haramain: 'Makkah & Madinah Live',
    },
    home: {
      nextPrayer: 'Next Prayer',
      now: 'Now:',
      remaining: 'remaining',
      changeLocation: 'Change Location',
    },
    prayers: {
      imsak: 'Imsak',
      fajr: 'Fajr',
      sunrise: 'Sunrise',
      dhuhr: 'Dhuhr',
      asr: 'Asr',
      maghrib: 'Maghrib',
      isha: 'Isha',
      midnight: 'Midnight',
    },
    features: {
      quran: 'Quran',
      ramadan: 'Ramadan',
      prayer: 'Calendar',
      qibla: 'Qibla',
      tasbih: 'Tasbih',
      azkar: 'More',
      names: '99 Names',
      zakat: 'Zakat',
      qazo: 'Qazo',
      guide: 'Wudu & Prayer',
      masjids: 'Masjids',
      juma: 'Juma',
      ehson: 'Masjid Ehson',
      quiz: 'Islamic Quiz',
      hifz: 'Hifz Trainer',
      life: 'Life Guide',
      fiqh: 'Fiqh Q&A',
      tajweed: 'Alphabet & Tajweed',
      seerah: 'Seerah & Prophets',
      wisdom: 'Scholars & Wisdom',
      library: 'Library',
      radio: 'Quran Radio',
      haramain: 'Makkah & Madinah',
    },
    cityModal: {
      title: 'Select Location',
      subtitle: 'For accurate local prayer calculations & Qibla',
      useGps: 'Use My Current Location (GPS)',
      searchPlaceholder: 'Search city, district or village...',
      noResults: 'No matching location found',
    },
    profile: {
      subtitle: 'Language, prayer preferences & saved bookmarks',
      greeting: 'Assalamu Alaikum',
      companion: 'Nurul Islam Companion',
      savedAyahsStat: 'Saved Ayahs',
      ramadanFastsStat: 'Ramadan Fasts',
      totalTasbihStat: 'Total Tasbih',
      localTimezone: 'Local Prayer Timezone',
      languageTitle: 'App Language',
      languageHint: 'Choose language for interface and menus',
      themeTitle: 'Appearance Theme',
      dayTitle: 'Day Mode',
      dayDesc: 'Warm light & Islamic green',
      nightTitle: 'Night Mode',
      nightDesc: 'Calm dark emerald',
      locationTitle: 'Current Location',
      gpsBtn: 'GPS',
      gpsDetecting: 'Detecting...',
      gpsSuccess: 'Location updated',
      gpsError: 'GPS unavailable or denied',
      changeCityBtn: 'Change City',
      translationTitle: 'Quran & Dua Translation',
      prayerCalcTitle: 'Prayer Calculation Settings',
      calcAuthorityLabel: 'Calculation Authority:',
      asrMadhhabLabel: 'Asr Juristic Madhhab:',
      standardLabel: "Shafi'i / Standard",
      hanafiLabel: 'Hanafi',
      bookmarksTitle: 'Saved Bookmarks',
      clearAll: 'Clear All',
      noBookmarks: 'No bookmarked verses yet.',
      shortcutsTitle: 'Quick Shortcuts',
      dataPrivacyTitle: 'Data & Preferences',
      resetBtn: 'Reset Preferences',
      resetConfirm: 'Reset all saved preferences, bookmarks, and counters?',
      resetConfirmBtn: 'Confirm Reset',
      resetCancelBtn: 'Cancel',
      aboutTitle: 'About Nurul Islam',
      aboutVersion: 'Nurul Islam • v1.0',
      aboutDesc: 'Accurate prayer times, Qibla compass, Quran translations & daily Azkar. All settings and progress stay private on your device.',
    },
    quran: {
      title: 'The Holy Quran',
      subtitle: '114 Surahs • 6,236 Verses • Multi-translation',
      searchPlaceholder: 'Search by name, meaning, or number...',
      allSurahs: 'All 114 Surahs',
      meccan: 'Meccan',
      medinan: 'Medinan',
      saved: 'Saved',
      backToSurahs: 'Surahs',
      translationLabel: 'Translation:',
      recite: 'Recite',
      pause: 'Pause',
      loading: 'Loading sacred verses...',
      versesUnit: 'Ayahs',
      ayahWord: 'Ayah',
      prevSurah: 'Previous Surah',
      nextSurah: 'Next Surah',
      prevAyah: 'Previous Ayah',
      nextAyah: 'Next Ayah',
      noResults: 'No matching Surah found',
      continueReading: 'Continue Reading',
      resumeBtn: 'Resume',
      juzTab: '30 Juz',
      juzLabel: 'Juz',
      jumaKahfTitle: 'Friday Sunnah · Surah Al-Kahf',
      jumaKahfDesc: 'Read Surah Al-Kahf this blessed Friday',
      openBtn: 'Open',
      khatmProgress: 'Khatm Progress',
      markReadBtn: 'Mark as Read',
      markedReadLabel: 'Completed ✓',
      saveOfflineBtn: 'Save Offline',
      savedOfflineLabel: 'Saved Offline ✓',
      startsAtAyah: 'starts at',
    },
    alerts: {
      title: 'Prayer Notifications',
      enableLabel: 'Enable Daily Prayer Alerts',
      enableDesc: 'Scheduled background notifications for daily prayers',
      permNeeded: 'Notification permission required',
      allowPermBtn: 'Allow',
      preReminderLabel: 'Pre-prayer reminder:',
      offOpt: 'Off',
      minSuffix: 'm',
      testBtn: 'Send Test Alert',
      testSent: 'Test alert sent ✓',
      widgetTitle: 'Home Screen Widget',
      widgetDesc: 'See today’s 5 prayer times and next prayer countdown right on your home screen.',
      addWidgetBtn: 'Add Widget to Home Screen',
      widgetRequested: 'Widget prompt opened ✓',
    },
    updates: {
      title: 'App Updates',
      currentVersion: 'Current Version',
      newVersionAvailable: 'New Update Available!',
      checkBtn: 'Check for Updates',
      checking: 'Checking...',
      upToDate: 'You have the latest version ✓',
      updateNowBtn: 'Update Now',
      laterBtn: 'Later',
      downloading: 'Downloading',
      installing: 'Opening installer...',
      needsPerm: 'Enable install permission and tap again',
      errorMsg: 'Could not reach update server',
    },
    prayerTab: {
      dailySchedule: "Today's Prayer Times",
      playAdhan: 'Play Adhan',
      stopAdhan: 'Stop Adhan',
      monthlySchedule: 'Monthly View',
      settingsBtn: 'Calculation',
      timeRemainingTo: 'Remaining:',
      autoGps: 'Auto GPS',
      settingsTitle: 'Calculation Settings',
      calcMethodLabel: 'Calculation Method:',
      asrMethodLabel: 'Asr Juristic Method:',
      standardOpt: "Standard (Shafi'i, Maliki, Hanbali)",
      hanafiOpt: 'Hanafi (Double Shadow)',
      nextBadge: 'NEXT',
      nowBadge: 'NOW',
      weeklyTitle: '7-Day Prayer Timetable',
      showSchedule: 'Show Schedule',
      hideSchedule: 'Hide',
      dayCol: 'Day',
      rakatUnit: 'Rakats',
      imsakNote: 'Suhoor Cutoff (Imsak)',
      sunriseNote: 'End of Fajr Window',
      midnightNote: 'Islamic Midnight / Qiyam',
      fardSection: '5 Daily Obligatory Prayers',
      sunnahMarkersSection: 'Daily Sunnah & Time Windows',
      cityTimeLabel: 'Local time',
      todayTab: 'Today',
      monthlyTab: 'Monthly',
      calendarTab: 'Hijri & Dates',
      specialDatesTitle: 'Sacred Islamic Dates',
      converterTitle: 'Hijri ↔ Gregorian Converter',
      gregToHijri: 'Gregorian → Hijri',
      hijriToGreg: 'Hijri → Gregorian',
      dayLabel: 'Day',
      monthNameLabel: 'Month',
      yearLabel: 'Year',
      daysLeft: 'days left',
      todayWord: 'Today!',
      passedWord: 'Passed',
      hijriYearLabel: 'Hijri Year',
    },
    tasbih: {
      targetLabel: 'Target',
      cyclesLabel: 'Completed',
      tapToCount: 'TAP OR SLIDE BEADS',
      totalSets: 'Total Sets',
      totalBeads: 'Total Beads',
      completedWord: 'Done',
      toggleSound: 'Toggle bead sound',
      resetCounter: 'Reset counter',
      guideBtn: 'Guide',
      guideTitle: 'What Should I Recite?',
      guideSubtitle: 'Choose a guided dhikr by situation and start counting',
      startOnTasbih: 'Start on Tasbih',
      stepWord: 'Step',
      autoSequenceDone: 'Complete 33+33+34 Tasbih finished!',
      benefitLabel: 'Virtue & When to Say',
      infoBtn: 'About this dhikr',
      exitGuideBtn: 'Close',
    },
    qazo: {
      subtitle: 'Track & fulfill missed prayers and fasts',
      totalRemaining: 'Total Remaining Qazo',
      prayersTab: 'Prayers',
      fastsTab: 'Fasting',
      witr: 'Witr',
      addDayBtn: '+1 Day (All 6)',
      subDayBtn: '-1 Day (Done)',
      calcTitle: 'Bulk Estimate Calculator',
      yearsLabel: 'Years',
      monthsLabel: 'Months',
      daysLabel: 'Days',
      applyCalcBtn: 'Add to Tracker',
      fastsRemaining: 'Remaining Qazo Fasts',
      allCaughtUp: 'All Qazo fulfilled!',
      resetAllBtn: 'Reset All',
      wizardBtn: 'Smart Estimator',
      wizardTitle: 'Calculate Your Qazo',
      wizardSubtitle: 'Estimate missed prayers & fasts accurately from your birth and worship start dates',
      trackTypeLabel: 'What would you like to track?',
      bothType: 'Prayers & Fasting',
      prayersOnlyType: 'Prayers Only',
      fastsOnlyType: 'Fasting Only',
      genderLabel: 'Gender (for Fiqh calculation rules)',
      maleLabel: 'Male',
      femaleLabel: 'Female',
      femaleCycleHint: 'For women, monthly menstrual days are deducted from missed prayers automatically, while missed Ramadan fasts remain due.',
      malePubertyHint: 'In Hanafi fiqh estimation, boys typically become Mukallaf (obligated) around 12–15 lunar years.',
      cycleDaysLabel: 'Average cycle days / month:',
      balighAgeLabel: 'Puberty (Baligh) age (lunar yrs):',
      birthDateLabel: 'Date of Birth (Year / Month / Day)',
      balighDatePreview: 'Estimated Baligh date:',
      prayerStartDateLabel: 'Date you started praying regularly',
      fastStartDateLabel: 'Date you started fasting Ramadan',
      todayShortcut: 'Today',
      gapSectionTitle: 'Sick or Interrupted Prayer Periods',
      gapSectionDesc: 'If you paused or couldn’t pray during any time after starting, add those months or days:',
      bufferSectionTitle: 'Precautionary Safety Buffer',
      bufferHint: 'We recommend setting a few extra days to be safe—even if you pray more than your actual missed prayers, every extra prayer counts as voluntary (Nafl) bonus reward!',
      extraDaysLabel: 'Extra safety days:',
      calculateAndStartBtn: 'Calculate & Save',
      skipManualBtn: 'Set Manually',
      summaryBreakdown: 'Estimated time span:',
      yearShort: 'yr',
      monthShort: 'mo',
      dayShort: 'days',
      completedBonusBadge: 'Bonus (Nafl)',
      bonusCounterLabel: 'Extra bonus (Nafl) prayers completed:',
      nextStepBtn: 'Next',
      prevStepBtn: 'Back',
    },
    names: {
      title: '99 Names of Allah',
      subtitle: 'Asma ul-Husna with spiritual meanings & benefits',
      searchPlaceholder: 'Search name, meaning, or number (1–99)...',
      meaningLabel: 'Meaning & Significance',
      benefitLabel: 'Spiritual Benefit',
      closeBtn: 'Close',
      noResults: 'No matching name found',
    },
    azkar: {
      title: 'Azkar & Duas',
      subtitle: 'Fortress of the Muslim & Rabbana Duas',
      searchPlaceholder: 'Search Duas (e.g. Forgiveness, Parents, Morning)...',
      clearBtn: 'Clear',
      allDuas: 'All Duas',
      morningAzkar: 'Morning Azkar',
      rabbanaDuas: 'Rabbana Duas',
      repeatLabel: 'Repeat:',
      completedBtn: '✓ Completed',
      reciteBtn: 'Recite (+1)',
    },
    qibla: {
      title: 'Qibla Compass',
      subtitle: 'Accurate Kaaba Direction & Bearing',
      alignedMsg: 'Aligned with Holy Kaaba!',
      rotateMsg: 'Rotate until the gold arrow faces top',
      bearingLabel: 'Qibla Bearing:',
      fromNorth: 'from North',
      toMakkah: 'to Makkah',
      simulatorTitle: 'Interactive Compass Simulator',
      northLabel: '0° (North)',
      snapBtn: 'Snap to True Qibla',
      accuracyTitle: 'Accurate Great-Circle Navigation',
      accuracyDesc:
        'Calculated toward the Kaaba (21.4225° N, 39.8262° E) in Makkah. On mobile devices with a compass sensor, move your phone in a figure-8 motion to calibrate.',
      liveSensor: 'Live Compass Sensor',
      manualMode: 'Manual Calibration',
      phoneHeadingLabel: 'Phone Heading:',
      cardinalN: 'N',
      cardinalE: 'E',
      cardinalS: 'S',
      cardinalW: 'W',
    },
    zakat: {
      title: 'Zakat Calculator',
      subtitle: 'Calculate 2.5% Annual Wealth Purification',
      obligatoryBadge: 'Zakat is Obligatory (Fard)',
      belowNisabBadge: 'Below Nisab Threshold',
      totalDueLabel: 'Total Zakat Due (2.5%)',
      netZakatableLabel: 'Net Zakatable',
      nisabLevelLabel: 'Nisab Level',
      cashLabel: 'Cash & Bank Balances ($):',
      goldOwnedLabel: 'Gold Owned (grams):',
      goldPriceLabel: 'Gold Price / Gram ($):',
      investmentsLabel: 'Stocks, Merchandise & Crypto ($):',
      debtsLabel: 'Short-Term Debts & Expenses Due ($):',
    },
    ramadan: {
      holyMonth: 'The Holy Month',
      ramadanKareem: 'Ramadan Kareem',
      suhoorIftarTimes: 'Suhoor & Iftar Times',
      fastingInProgress: 'Fasting in Progress',
      eatingWindow: 'Eating Window (Night)',
      targetLabel: 'Target:',
      untilIftar: 'Time Until Iftar (Maghrib)',
      untilSuhoor: 'Time Until Suhoor Closes (Fajr)',
      elapsedLabel: 'elapsed',
      suhoorTitle: 'Suhoor (Imsak)',
      suhoorNote: 'Stop eating 10m before Fajr',
      iftarTitle: 'Iftar (Maghrib)',
      iftarNote: 'Break fast with dates & water',
      trackerTitle: '30-Day Fasting Tracker',
      trackerHint: 'Tap any day: Fasted ✓ • Qada • Excused',
      fastedBadge: 'Fasted',
      fastedStat: 'Fasted',
      qadaStat: 'Qada',
      excusedStat: 'Excused',
      remainingStat: 'Remaining',
      pendingExcusedLegend: 'Pending / Excused',
      secCore: 'Suhoor & Iftar Duas',
      secAshras: '3 Ashras',
      sec30Days: 'Daily 30-Day Duas',
      secTips: 'Sunnah Etiquette',
      daysRange1: 'Days 1–10',
      daysRange2: 'Days 11–20',
      daysRange3: 'Days 21–30',
      ashra1Title: '1st Ashra',
      ashra1Name: 'Ashra of Mercy',
      ashra1Sub: 'Days 1 to 10 • Divine compassion',
      ashra2Title: '2nd Ashra',
      ashra2Name: 'Ashra of Forgiveness',
      ashra2Sub: 'Days 11 to 20 • Cleansing all faults',
      ashra3Title: '3rd Ashra',
      ashra3Name: 'Ashra of Salvation',
      ashra3Sub: 'Days 21 to 30 • Laylat al-Qadr & refuge',
      dayOfRamadan: 'of Ramadan',
      dayWord: 'Day',
      practicalTip: 'Practical Tip:',
      refLabel: 'Ref:',
    },
  },
  ru: {
    appTitle: 'Nurul Islam',
    mainMenuBack: 'Главное меню',
    backLabel: 'Назад',
    day: 'День',
    night: 'Ночь',
    nav: {
      home: 'Главная',
      tasbih: 'Тасбих',
      quran: 'Коран',
      profile: 'Профиль',
    },
    tabTitles: {
      home: 'Nurul Islam',
      tasbih: 'Тасбих',
      quran: 'Священный Коран',
      profile: 'Профиль и Настройки',
      ramadan: 'Рамадан',
      prayer: 'Исламский Календарь',
      qibla: 'Компас Киблы',
      azkar: 'Дуа, Зикр и Хадисы',
      names: '99 Имён Аллаха',
      zakat: 'Калькулятор Закята',
      qazo: 'Учёт Када',
      guide: 'Тахарат и Намаз',
      masjids: 'Мечети рядом',
      juma: 'Режим Джума',
      ehson: 'Помощь мечетям',
      quiz: 'Исламская викторина',
      hifz: 'Хифз сур и дуа',
      life: 'Жизненные ситуации',
      fiqh: 'Вопросы и Ответы (Фикх)',
      tajweed: 'Арабский и Таджвид',
      seerah: 'Сира и 25 Пророков',
      wisdom: 'Учёные и Мудрости',
      library: 'Исламская Библиотека',
      radio: 'Коран Радио 24/7',
      haramain: 'Мекка и Медина Live',
    },
    home: {
      nextPrayer: 'Следующая молитва',
      now: 'Сейчас:',
      remaining: 'осталось',
      changeLocation: 'Изменить регион',
    },
    prayers: {
      imsak: 'Имсак',
      fajr: 'Фаджр',
      sunrise: 'Восход',
      dhuhr: 'Зухр',
      asr: 'Аср',
      maghrib: 'Магриб',
      isha: 'Иша',
      midnight: 'Тахаджуд',
    },
    features: {
      quran: 'Коран',
      ramadan: 'Рамадан',
      prayer: 'Календарь',
      qibla: 'Кибла',
      tasbih: 'Тасбих',
      azkar: 'Ещё',
      names: '99 Имён',
      zakat: 'Закят',
      qazo: 'Када',
      guide: 'Тахарат',
      masjids: 'Мечети',
      juma: 'Джума',
      ehson: 'Помощь мечетям',
      quiz: 'Викторина',
      hifz: 'Хифз сур',
      life: 'Важные дуа',
      fiqh: 'Фикх Q&A',
      tajweed: 'Алифба & Таджвид',
      seerah: 'Сира & Пророки',
      wisdom: 'Учёные & Хикматы',
      library: 'Библиотека',
      radio: 'Коран Радио',
      haramain: 'Мекка и Медина',
    },
    cityModal: {
      title: 'Выберите местоположение',
      subtitle: 'Для точного расписания намаза и Киблы',
      useGps: 'Определить по GPS',
      searchPlaceholder: 'Поиск города, района или села...',
      noResults: 'Местоположение не найдено',
    },
    profile: {
      subtitle: 'Язык, настройки намаза и закладки',
      greeting: 'Ассаляму алейкум',
      companion: 'Спутник Nurul Islam',
      savedAyahsStat: 'Сохранённые аяты',
      ramadanFastsStat: 'Посты Рамадана',
      totalTasbihStat: 'Всего тасбих',
      localTimezone: 'Местный часовой пояс',
      languageTitle: 'Язык приложения',
      languageHint: 'Выберите язык интерфейса и меню',
      themeTitle: 'Тема оформления',
      dayTitle: 'Дневной режим',
      dayDesc: 'Светлый фон и зелёный акцент',
      nightTitle: 'Ночной режим',
      nightDesc: 'Тёмный изумрудный стиль',
      locationTitle: 'Текущий регион',
      gpsBtn: 'GPS',
      gpsDetecting: 'Определение...',
      gpsSuccess: 'Регион обновлён',
      gpsError: 'GPS недоступен или запрещён',
      changeCityBtn: 'Сменить',
      translationTitle: 'Перевод Корана и дуа',
      prayerCalcTitle: 'Настройки расчёта намаза',
      calcAuthorityLabel: 'Метод расчёта:',
      asrMadhhabLabel: 'Мазхаб для Аср:',
      standardLabel: 'Шафиитский / Стандарт',
      hanafiLabel: 'Ханафитский',
      bookmarksTitle: 'Сохранённые аяты',
      clearAll: 'Очистить',
      noBookmarks: 'Пока нет сохранённых аятов.',
      shortcutsTitle: 'Быстрый доступ',
      dataPrivacyTitle: 'Данные и настройки',
      resetBtn: 'Сбросить настройки',
      resetConfirm: 'Сбросить все сохранённые настройки, закладки и счётчики?',
      resetConfirmBtn: 'Подтвердить',
      resetCancelBtn: 'Отмена',
      aboutTitle: 'О приложении',
      aboutVersion: 'Nurul Islam • Версия 1.0',
      aboutDesc: 'Точное время намаза, компас Киблы, переводы Корана и ежедневные азкары. Все данные хранятся локально на вашем устройстве.',
    },
    quran: {
      title: 'Священный Коран',
      subtitle: '114 Сур • 6 236 Аятов • Многоязычный перевод',
      searchPlaceholder: 'Поиск по названию, номеру или смыслу...',
      allSurahs: 'Все 114 Сур',
      meccan: 'Мекканские',
      medinan: 'Мединские',
      saved: 'Избранное',
      backToSurahs: 'Суры',
      translationLabel: 'Перевод:',
      recite: 'Слушать',
      pause: 'Пауза',
      loading: 'Загрузка аятов...',
      versesUnit: 'аятов',
      ayahWord: 'Аят',
      prevSurah: 'Предыдущая сура',
      nextSurah: 'Следующая сура',
      prevAyah: 'Предыдущий аят',
      nextAyah: 'Следующий аят',
      noResults: 'Сура не найдена',
      continueReading: 'Продолжить чтение',
      resumeBtn: 'Продолжить',
      juzTab: '30 Джузов',
      juzLabel: 'Джуз',
      jumaKahfTitle: 'Сунна пятницы · Сура Аль-Кахф',
      jumaKahfDesc: 'Чтение суры Аль-Кахф в благословенную пятницу',
      openBtn: 'Открыть',
      khatmProgress: 'Прогресс хатма',
      markReadBtn: 'Отметить прочитанной',
      markedReadLabel: 'Прочитано ✓',
      saveOfflineBtn: 'Сохранить офлайн',
      savedOfflineLabel: 'Сохранено офлайн ✓',
      startsAtAyah: 'начало:',
    },
    alerts: {
      title: 'Уведомления о намазе',
      enableLabel: 'Включить уведомления о намазах',
      enableDesc: 'Напоминания о наступлении времени каждого намаза',
      permNeeded: 'Требуется разрешение на уведомления',
      allowPermBtn: 'Разрешить',
      preReminderLabel: 'Напомнить заранее:',
      offOpt: 'Выкл',
      minSuffix: 'мин',
      testBtn: 'Тестовое уведомление',
      testSent: 'Тестовое уведомление отправлено ✓',
      widgetTitle: 'Виджет на главный экран',
      widgetDesc: 'Время 5 намазов и следующий намаз прямо на главном экране телефона.',
      addWidgetBtn: 'Добавить виджет на экран',
      widgetRequested: 'Запрос на добавление виджета открыт ✓',
    },
    updates: {
      title: 'Обновление приложения',
      currentVersion: 'Текущая версия',
      newVersionAvailable: 'Доступно обновление!',
      checkBtn: 'Проверить обновления',
      checking: 'Проверка...',
      upToDate: 'У вас установлена последняя версия ✓',
      updateNowBtn: 'Обновить сейчас',
      laterBtn: 'Позже',
      downloading: 'Загрузка',
      installing: 'Открытие установщика...',
      needsPerm: 'Разрешите установку и нажмите снова',
      errorMsg: 'Не удалось связаться с сервером',
    },
    prayerTab: {
      dailySchedule: 'Расписание на сегодня',
      playAdhan: 'Слушать азан',
      stopAdhan: 'Остановить азан',
      monthlySchedule: 'На месяц',
      settingsBtn: 'Расчёт',
      timeRemainingTo: 'Осталось:',
      autoGps: 'Авто GPS',
      settingsTitle: 'Настройки расчёта',
      calcMethodLabel: 'Метод расчёта:',
      asrMethodLabel: 'Мазхаб для Аср:',
      standardOpt: 'Стандарт (Шафиитский, Маликитский)',
      hanafiOpt: 'Ханафитский (Двойная тень)',
      nextBadge: 'ДАЛЕЕ',
      nowBadge: 'СЕЙЧАС',
      weeklyTitle: 'Расписание на 7 дней',
      showSchedule: 'Показать',
      hideSchedule: 'Скрыть',
      dayCol: 'День',
      rakatUnit: 'ракаата',
      imsakNote: 'Завершение сухура',
      sunriseNote: 'Конец времени Фаджр',
      midnightNote: 'Половина ночи / Тахаджуд',
      fardSection: '5 обязательных намазов',
      sunnahMarkersSection: 'Временные ориентиры',
      cityTimeLabel: 'Местное время',
      todayTab: 'Сегодня',
      monthlyTab: 'Месяц',
      calendarTab: 'Хиджра и Даты',
      specialDatesTitle: 'Важные исламские даты',
      converterTitle: 'Конвертер Хиджра ↔ Григорианский',
      gregToHijri: 'Григорианский → Хиджра',
      hijriToGreg: 'Хиджра → Григорианский',
      dayLabel: 'День',
      monthNameLabel: 'Месяц',
      yearLabel: 'Год',
      daysLeft: 'дн. осталось',
      todayWord: 'Сегодня!',
      passedWord: 'Прошло',
      hijriYearLabel: 'Год по Хиджре',
    },
    tasbih: {
      targetLabel: 'Цель',
      cyclesLabel: 'Кругов',
      tapToCount: 'НАЖМИТЕ ИЛИ ПРОВЕДИТЕ',
      totalSets: 'Завершено',
      totalBeads: 'Всего зикров',
      completedWord: 'раз',
      toggleSound: 'Звук чёток',
      resetCounter: 'Сбросить счётчик',
      guideBtn: 'Гид',
      guideTitle: 'Какой зикр читать?',
      guideSubtitle: 'Выберите зикр под ситуацию и начните счёт',
      startOnTasbih: 'Начать на тасбихе',
      stepWord: 'Шаг',
      autoSequenceDone: 'Полный цикл (33+33+34) завершён!',
      benefitLabel: 'Польза и время чтения',
      infoBtn: 'О данном зикре',
      exitGuideBtn: 'Закрыть',
    },
    qazo: {
      subtitle: 'Учёт и восполнение пропущенных намазов и постов',
      totalRemaining: 'Всего осталось Када',
      prayersTab: 'Намазы',
      fastsTab: 'Пост',
      witr: 'Витр',
      addDayBtn: '+1 день (все 6)',
      subDayBtn: '-1 день (восполнен)',
      calcTitle: 'Добавить по сроку',
      yearsLabel: 'Лет',
      monthsLabel: 'Месяцев',
      daysLabel: 'Дней',
      applyCalcBtn: 'Добавить в учёт',
      fastsRemaining: 'Осталось дней поста Када',
      allCaughtUp: 'Все пропущенные намазы восполнены!',
      resetAllBtn: 'Сбросить всё',
      wizardBtn: 'Умный расчёт',
      wizardTitle: 'Расчёт Када',
      wizardSubtitle: 'Точный расчёт пропущенных намазов и постов по дате рождения и началу поклонения',
      trackTypeLabel: 'Что вы хотите рассчитать?',
      bothType: 'Намазы и Пост',
      prayersOnlyType: 'Только Намазы',
      fastsOnlyType: 'Только Пост',
      genderLabel: 'Ваш пол (для расчёта по фикху)',
      maleLabel: 'Мужчина',
      femaleLabel: 'Женщина',
      femaleCycleHint: 'Для женщин дни хайда ежемесячно вычитаются из пропущенных намазов, но дни поста Рамадана остаются к восполнению.',
      malePubertyHint: 'По ханафитскому фикху юноши обычно достигают совершеннолетия (балиг) к 12–15 лунным годам.',
      cycleDaysLabel: 'Средняя длительность цикла (дней/мес):',
      balighAgeLabel: 'Возраст балига (лунных лет):',
      birthDateLabel: 'Дата рождения (Год / Месяц / День)',
      balighDatePreview: 'Примерная дата балига:',
      prayerStartDateLabel: 'Дата начала регулярного намаза',
      fastStartDateLabel: 'Дата начала соблюдения поста',
      todayShortcut: 'Сегодня',
      gapSectionTitle: 'Перерывы или периоды болезни',
      gapSectionDesc: 'Если после начала намаза были перерывы из-за болезни или пропуска, добавьте месяцы/дни:',
      bufferSectionTitle: 'Запас предосторожности (бонус)',
      bufferHint: 'Рекомендуем заложить немного больше дней для уверенности: даже если вы восполните больше нужного, лишние намазы засчитаются вам как нафль (дополнительная награда)!',
      extraDaysLabel: 'Дополнительных дней запаса:',
      calculateAndStartBtn: 'Рассчитать и сохранить',
      skipManualBtn: 'Ввести вручную',
      summaryBreakdown: 'Примерный срок:',
      yearShort: 'г.',
      monthShort: 'мес.',
      dayShort: 'дн.',
      completedBonusBadge: 'Нафль (Бонус)',
      bonusCounterLabel: 'Выполнено дополнительных (нафль) молитв:',
      nextStepBtn: 'Далее',
      prevStepBtn: 'Назад',
    },
    names: {
      title: '99 Имён Аллаха',
      subtitle: 'Асма уль-Хусна: значения и польза',
      searchPlaceholder: 'Поиск имени, значения или номера (1–99)...',
      meaningLabel: 'Значение и смысл',
      benefitLabel: 'Духовная польза',
      closeBtn: 'Закрыть',
      noResults: 'Имя не найдено',
    },
    azkar: {
      title: 'Азкары и Дуа',
      subtitle: 'Ежедневное поминание и дуа Раббана',
      searchPlaceholder: 'Поиск дуа (напр. Прощение, Родители, Утро)...',
      clearBtn: 'Сброс',
      allDuas: 'Все дуа',
      morningAzkar: 'Утренние азкары',
      rabbanaDuas: 'Дуа Раббана',
      repeatLabel: 'Повтор:',
      completedBtn: '✓ Выполнено',
      reciteBtn: 'Читать (+1)',
    },
    qibla: {
      title: 'Компас Киблы',
      subtitle: 'Точное направление на Каабу',
      alignedMsg: 'Направлено точно на Каабу!',
      rotateMsg: 'Поворачивайте, пока золотая стрелка не укажет вверх',
      bearingLabel: 'Азимут Киблы:',
      fromNorth: 'от севера',
      toMakkah: 'до Мекки',
      simulatorTitle: 'Симулятор компаса (ручной поворот)',
      northLabel: '0° (Север)',
      snapBtn: 'Направить на Киблу',
      accuracyTitle: 'Точный расчёт по сфере',
      accuracyDesc:
        'Рассчитано к Священной Каабе (21.4225° N, 39.8262° E) в Мекке. Для калибровки датчика на телефоне опишите им в воздухе знак восьмёрки.',
      liveSensor: 'Живой датчик компаса',
      manualMode: 'Ручной режим',
      phoneHeadingLabel: 'Направление телефона:',
      cardinalN: 'С',
      cardinalE: 'В',
      cardinalS: 'Ю',
      cardinalW: 'З',
    },
    zakat: {
      title: 'Калькулятор Закята',
      subtitle: 'Расчёт ежегодного очистительного взноса 2,5%',
      obligatoryBadge: 'Закят обязателен (выше нисаба)',
      belowNisabBadge: 'Ниже порога нисаба',
      totalDueLabel: 'Сумма закята к выплате (2,5%)',
      netZakatableLabel: 'Облагаемый капитал',
      nisabLevelLabel: 'Уровень нисаба',
      cashLabel: 'Наличные и банковские счета ($):',
      goldOwnedLabel: 'Золото в собственности (грамм):',
      goldPriceLabel: 'Цена за 1 гр золота ($):',
      investmentsLabel: 'Акции, товары и сбережения ($):',
      debtsLabel: 'Краткосрочные долги и расходы ($):',
    },
    ramadan: {
      holyMonth: 'Священный месяц',
      ramadanKareem: 'Рамадан Карим',
      suhoorIftarTimes: 'Время Сухура и Ифтара',
      fastingInProgress: 'Время поста (День)',
      eatingWindow: 'Ночное время приёма пищи',
      targetLabel: 'Цель:',
      untilIftar: 'До Ифтара (Магриб)',
      untilSuhoor: 'До завершения Сухура (Фаджр)',
      elapsedLabel: 'прошло',
      suhoorTitle: 'Сухур (Имсак)',
      suhoorNote: 'Прекратить еду за 10 мин до Фаджра',
      iftarTitle: 'Ифтар (Магриб)',
      iftarNote: 'Разговение финиками и водой',
      trackerTitle: 'Трекер поста (30 дней)',
      trackerHint: 'Нажмите на день: Пост ✓ • Каза • Уваж. причина',
      fastedBadge: 'Пост',
      fastedStat: 'Пост',
      qadaStat: 'Каза',
      excusedStat: 'Уваж.',
      remainingStat: 'Осталось',
      pendingExcusedLegend: 'Ожидание / Уваж.',
      secCore: 'Дуа Сухура и Ифтара',
      secAshras: '3 Декады Рамадана',
      sec30Days: 'Дуа на 30 дней',
      secTips: 'Советы по Сунне',
      daysRange1: 'Дни 1–10',
      daysRange2: 'Дни 11–20',
      daysRange3: 'Дни 21–30',
      ashra1Title: '1-я Декада',
      ashra1Name: 'Декада Милости (Рахма)',
      ashra1Sub: 'Дни 1–10 • Просьба о милости Аллаха',
      ashra2Title: '2-я Декада',
      ashra2Name: 'Декада Прощения (Магфира)',
      ashra2Sub: 'Дни 11–20 • Прощение грехов',
      ashra3Title: '3-я Декада',
      ashra3Name: 'Декада Спасения (Наджат)',
      ashra3Sub: 'Дни 21–30 • Ночь предопределения и спасение',
      dayOfRamadan: '-й день Рамадана',
      dayWord: 'День',
      practicalTip: 'Практический совет:',
      refLabel: 'Источник:',
    },
  },
};

const WEEKDAYS: Record<AppLanguage, string[]> = {
  uz_lat: ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'],
  uz_cyr: ['Якш', 'Душ', 'Сеш', 'Чор', 'Пай', 'Жум', 'Шан'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  ru: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
};

const MONTHS: Record<AppLanguage, string[]> = {
  uz_lat: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'],
  uz_cyr: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  ru: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
};

const FULL_WEEKDAYS: Record<AppLanguage, string[]> = {
  uz_lat: ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'],
  uz_cyr: ['Якшанба', 'Душанба', 'Сешанба', 'Чоршанба', 'Пайшанба', 'Жума', 'Шанба'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  ru: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
};

const FULL_MONTHS: Record<AppLanguage, string[]> = {
  uz_lat: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'],
  uz_cyr: ['Январ', 'Феврал', 'Март', 'Апрел', 'Май', 'Июн', 'Июл', 'Август', 'Сентябр', 'Октябр', 'Ноябр', 'Декабр'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  ru: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
};

export function formatGregorianDate(date: Date, lang: AppLanguage): string {
  const wd = WEEKDAYS[lang][date.getDay()];
  const day = date.getDate();
  const mon = MONTHS[lang][date.getMonth()];
  return lang === 'en' ? `${wd}, ${mon} ${day}` : `${wd}, ${day} ${mon}`;
}

export function formatFullGregorianDate(date: Date, lang: AppLanguage): string {
  const wd = FULL_WEEKDAYS[lang][date.getDay()];
  const day = date.getDate();
  const mon = FULL_MONTHS[lang][date.getMonth()];
  return lang === 'en' ? `${wd}, ${mon} ${day}` : `${wd}, ${day} ${mon}`;
}

interface LanguageContextValue {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  meta: LanguageOptionMeta;
  t: TranslationStrings;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    try {
      const saved = localStorage.getItem('nq_language');
      if (saved === 'uz_lat' || saved === 'uz_cyr' || saved === 'en' || saved === 'ru') {
        return saved;
      }
    } catch {
      // Ignore storage error
    }
    return 'uz_lat';
  });

  const setLanguage = useCallback((next: AppLanguage) => {
    setLanguageState(next);
    try {
      localStorage.setItem('nq_language', next);
    } catch {
      // Ignore storage error
    }
  }, []);

  const meta = LANGUAGE_OPTIONS.find((opt) => opt.id === language) || LANGUAGE_OPTIONS[0];
  const t = DICTIONARY[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, meta, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
