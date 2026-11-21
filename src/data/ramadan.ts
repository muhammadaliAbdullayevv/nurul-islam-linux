export interface RamadanDua {
  id: string;
  title: string;
  titleUz?: string;
  category: 'suhoor' | 'iftar' | 'ashra' | 'laylatul_qadr' | 'general';
  arabic: string;
  transliteration: string;
  translationEn: string;
  translationUz: string;
  reference: string;
  benefit?: string;
}

export interface DayDua {
  day: number;
  title: string;
  theme: string;
  arabic: string;
  transliteration: string;
  translationEn: string;
  translationUz: string;
  hadithOrAyahRef: string;
}

export const RAMADAN_CORE_DUAS: RamadanDua[] = [
  {
    id: 'suhoor-niyyah',
    title: 'Intention (Niyyah) for Fasting Suhoor',
    titleUz: 'Saharlik (Og‘iz yopish) niyati duosi',
    category: 'suhoor',
    arabic: 'نَوَيْتُ أَنْ أَصُومَ صَوْمَ شَهْرِ رَمَضَانَ مِنَ الْفَجْرِ إِلَى الْمَغْرِبِ، خَالِصًا لِلَّهِ تَعَالَى، اللَّهُ أَكْبَرُ',
    transliteration: 'Nawaytu an asuma sawma shahri Ramadana minal-fajri ilal-maghribi khalisan lillahi ta‘ala, Allahu Akbar',
    translationEn: 'I intend to fast the month of Ramadan from dawn until sunset sincerely for Allah the Almighty, Allah is the Greatest.',
    translationUz: 'Navaytu an asuma sovma shahri ramazona minal fajri ilal mag‘ribi, xolisan lillahi ta’ala. Allohu akbar. (Ramazon oyining ro‘zasini tong otganidan to quyosh botgunicha xolis Alloh taolo uchun tutishni niyat qildim.)',
    reference: 'Traditional Hanafi Suhoor Niyyah',
    benefit: 'Sincere intention before Fajr sets spiritual focus for the entire day of fasting.'
  },
  {
    id: 'iftar-dua-traditional',
    title: 'Iftar Dua (Full Classic Supplication)',
    titleUz: 'Iftorlik (Og‘iz ochish) to‘liq duosi',
    category: 'iftar',
    arabic: 'اللَّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلَىٰ رِزْقِكَ أَفْطَرْتُ، فَاغْفِرْ لِي يَا غَفَّارُ مَا قَدَّمْتُ وَمَا أَخَّرْتُ، بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِينَ',
    transliteration: 'Allahumma laka sumtu wa bika aamantu wa ‘alayka tawakkaltu wa ‘ala rizqika aftartu, faghfir li ya Ghaffaru ma qaddamtu wa ma akhkhartu, bi-rahmatika ya Arhamar-rahimin',
    translationEn: 'O Allah! For You I have fasted, in You I believe, upon You I rely, and with Your provision I break my fast. Forgive me, O All-Forgiving, for my past and future sins, by Your mercy O Most Merciful of the merciful.',
    translationUz: 'Allohumma laka sumtu va bika amantu va ‘alayka tavakkaltu va ‘ala rizqika aftartu, fag‘firli ya G‘afforu ma qoddamtu va ma axxortu, birohmatika ya Arhamar rohimiyn. (Ey Allohim, Sen uchun ro‘za tutdim, Senga iymon keltirdim, Senga tavakkal qildim va bergan rizqing bilan iftor qildim. Ey gunohlarni kechiruvchi Zot, avvalgi va keyingi gunohlarimni O‘z rahmating bilan mag‘firat qilgin!)',
    reference: 'Sunan Abi Dawud / Classical Dua Archive',
    benefit: 'Combines gratitude at breaking the fast with a heartfelt plea for complete forgiveness.'
  },
  {
    id: 'iftar-dua-sahih',
    title: 'Sunnah Iftar Supplication (Sahih)',
    titleUz: 'Sunnat iftorlik duosi (Sahih hadis)',
    category: 'iftar',
    arabic: 'ذَهَبَ الظَّمَأُ، وَابْتَلَّتِ الْعُرُوقُ، وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ',
    transliteration: 'Dhahaba adh-dhama’u, wabtallatil-‘urooqu, wa thabatal-ajru in sha’Allah',
    translationEn: 'The thirst has gone, the veins are moistened, and the reward is confirmed, if Allah wills.',
    translationUz: 'Chanqoq ketdi, tomirlar namlandi va inshaalloh ajr-savob sobit bo‘ldi.',
    reference: 'Sunan Abi Dawud 2357 (Sahih)',
    benefit: 'The Prophet (ﷺ) recited this exact supplication immediately when breaking the fast with dates or water.'
  },
  {
    id: 'laylatul-qadr',
    title: 'Supplication for Laylat al-Qadr (Night of Power)',
    titleUz: 'Qadr kechasi duosi',
    category: 'laylatul_qadr',
    arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
    transliteration: 'Allahumma innaka \'Afuwwun tuhibbul-\'afwa fa\'fu \'anni',
    translationEn: 'O Allah, You are Most Forgiving, and You love forgiveness; so pardon and forgive me.',
    translationUz: 'Allohim, albatta Sen kechirimli Zotsan, kechirishni sevasan, bas meni afv etgin.',
    reference: 'Sunan at-Tirmidhi 3513 (Sahih)',
    benefit: 'Taught directly by the Prophet (ﷺ) to Aisha (RA) for the blessed odd nights of the last 10 days of Ramadan.'
  },
  {
    id: 'ashra-1',
    title: 'First Ashra Dua (Days 1–10: Mercy / Rahmah)',
    titleUz: '1-o\'n kunlik (Rahmat) duosi',
    category: 'ashra',
    arabic: 'رَبِّ اغْفِرْ وَارْحَمْ وَأَنْتَ خَيْرُ الرَّاحِمِينَ',
    transliteration: 'Rabbi-ghfir war-ham wa Anta khayrur-rahimeen',
    translationEn: 'My Lord, forgive and have mercy, for You are the best of the merciful.',
    translationUz: 'Robbim, mag\'firat qilgin va rahm ayla, zotan Sen rahm qiluvchilarning eng yaxshisisan.',
    reference: 'Surah Al-Mu\'minun (23:118)',
    benefit: 'Recited frequently during the first ten days of Ramadan, dedicated to divine mercy.'
  },
  {
    id: 'ashra-2',
    title: 'Second Ashra Dua (Days 11–20: Forgiveness / Maghfirah)',
    titleUz: '2-o\'n kunlik (Mag\'firat) duosi',
    category: 'ashra',
    arabic: 'أَسْتَغْفِرُ اللَّهَ رَبِّي مِنْ كُلِّ ذَنْبٍ وَأَتُوبُ إِلَيْهِ',
    transliteration: 'Astaghfirullaha Rabbi min kulli dhanbin wa atoobu ilayh',
    translationEn: 'I seek forgiveness from Allah, my Lord, from every sin and I turn to Him in repentance.',
    translationUz: 'Robbim Allohdan barcha gunohlarim uchun mag\'firat so\'rayman va Unga tavba qilaman.',
    reference: 'Authentic Istighfar formula',
    benefit: 'Dedicated to cleansing past faults and seeking pardon during the middle ten days.'
  },
  {
    id: 'ashra-3',
    title: 'Third Ashra Dua (Days 21–30: Salvation / Najaat)',
    titleUz: '3-o\'n kunlik (Jahannamdan qutulish) duosi',
    category: 'ashra',
    arabic: 'اللَّهُمَّ أَجِرْنَا مِنَ النَّارِ',
    transliteration: 'Allahumma ajirna minan-naar',
    translationEn: 'O Allah, protect and save us from the punishment of the Fire.',
    translationUz: 'Allohim, bizni jahannam o\'tidan O\'zing saqlagin va xalos etgin.',
    reference: 'Sunan Abi Dawud',
    benefit: 'Seeking liberation from the Hellfire during the final ten days and Laylat al-Qadr.'
  },
  {
    id: 'guest-iftar',
    title: 'Dua for the Host After Eating Iftar as a Guest',
    titleUz: 'Mehmondorchilikda iftor qilganda mezbonga duo',
    category: 'general',
    arabic: 'أَفْطَرَ عِنْدَكُمُ الصَّائِمُونَ، وَأَكَلَ طَعَامَكُمُ الْأَبْرَارُ، وَصَلَّتْ عَلَيْكُمُ الْمَلَائِكَةُ',
    transliteration: 'Aftara \'indakumus-sa\'imoon, wa akala ta\'amakumul-abraar, wa sallat \'alaykumul-mala\'ikah',
    translationEn: 'May fasting people break their fast with you, may the righteous eat your food, and may the angels send blessings upon you.',
    translationUz: 'Huzuringizda ro\'zadorlar og\'iz ochsin, taomingizni yaxshi insonlar yesin va farishtalar sizga salavot aytsin.',
    reference: 'Sunan Abi Dawud 3854',
    benefit: 'Brings profound barakah and divine angelic prayers to generous hosts.'
  }
];

export const RAMADAN_30_DAYS_DUAS: DayDua[] = [
  {
    day: 1,
    title: 'Welcoming the Sacred Month',
    theme: 'Sincerity & Renewal of Faith',
    arabic: 'اللَّهُمَّ اجْعَلْ صِيَامِي فِيهِ صِيَامَ الصَّائِمِينَ وَقِيَامِي فِيهِ قِيَامَ الْقَائِمِينَ',
    transliteration: 'Allahumma-j\'al siyami feehi siyamas-sa\'imeen wa qiyami feehi qiyamal-qa\'imeen',
    translationEn: 'O Allah, make my fast in this month like the fast of those who sincerely fast, and my night standing like that of the devout standers.',
    translationUz: 'Allohim, bu oyda ro\'zamni xolis ro\'zadorlarning ro\'zasidek, kechki ibodatimni haqiqiy qoyimlardek qilgin.',
    hadithOrAyahRef: 'Surah Al-Baqarah 2:183'
  },
  {
    day: 2,
    title: 'Divine Pleasure & Mercy',
    theme: 'Drawing Near to Allah\'s Contentment',
    arabic: 'اللَّهُمَّ قَرِّبْنِي فِيهِ إِلَىٰ مَرْضَاتِكَ وَجَنِّبْنِي فِيهِ مِنْ سَخَطِكَ وَنَقِمَاتِكَ',
    transliteration: 'Allahumma qarribni feehi ila mardatika wa jannibni feehi min sakhatika wa naqimatik',
    translationEn: 'O Allah, bring me closer in this day to Your good pleasure, and distance me from Your anger and wrath.',
    translationUz: 'Allohim, meni O\'zingning rizoligingga yaqinlashtir va g\'azabing hamda azobingdan uzoq qilgin.',
    hadithOrAyahRef: 'Hadith: "Whoever fasts Ramadan with faith and seeking reward..."'
  },
  {
    day: 3,
    title: 'Wisdom & Mindfulness',
    theme: 'Seeking Pure Knowledge & Discernment',
    arabic: 'اللَّهُمَّ ارْزُقْنِي فِيهِ الذِّهْنَ وَالتَّنْبِيهَ وَبَاعِدْنِي فِيهِ مِنَ السَّفَاهَةِ وَالتَّمْوِيهِ',
    transliteration: 'Allahummar-zuqni feehidh-dhihna wat-tanbeeh, wa ba\'idni feehi minas-safahati wat-tamweeh',
    translationEn: 'O Allah, bestow upon me alertness and wisdom, and keep me far from folly and deception.',
    translationUz: 'Allohim, menga zakovat va hushyorlik ato etgin, nodonlik va adashishdan uzoq tutgin.',
    hadithOrAyahRef: 'Surah Al-Baqarah 2:185'
  },
  {
    day: 4,
    title: 'Strength to Uphold Commandments',
    theme: 'Sweetness of Worship',
    arabic: 'اللَّهُمَّ قَوِّنِي فِيهِ عَلَىٰ إِقَامَةِ أَمْرِكَ وَأَذِقْنِي فِيهِ حَلَاوَةَ ذِكْرِكَ',
    transliteration: 'Allahumma qawwini feehi \'ala iqamati amrik, wa adhiqni feehi halawata dhikrik',
    translationEn: 'O Allah, grant me strength to fulfill Your commands, and let me taste the sweetness of Your remembrance.',
    translationUz: 'Allohim, amrlaringni ado etishda menga quvvat ber va zikringning shirin lazzatini totitgin.',
    hadithOrAyahRef: 'Surah Ar-Ra\'d 13:28'
  },
  {
    day: 5,
    title: 'Among the Penitents',
    theme: 'Joining the Righteous',
    arabic: 'اللَّهُمَّ اجْعَلْنِي فِيهِ مِنَ الْمُسْتَغْفِرِينَ وَاجْعَلْنِي فِيهِ مِنْ عِبَادِكَ الصَّالِحِينَ',
    transliteration: 'Allahummaj-\'alni feehi minal-mustaghfireen, waj-\'alni feehi min \'ibadikas-saliheen',
    translationEn: 'O Allah, place me in this day among those who ask for forgiveness, and make me one of Your righteous servants.',
    translationUz: 'Allohim, meni bu kunda istig\'for aytuvchilardan va solih bandalaring safida qilgin.',
    hadithOrAyahRef: 'Surah Al-Imran 3:135'
  },
  {
    day: 6,
    title: 'Protection from Degradation',
    theme: 'Preservation of Dignity',
    arabic: 'اللَّهُمَّ لَا تَخْذُلْنِي فِيهِ لِتَعَرُّضِ مَعْصِيَتِكَ وَأَعِزَّنِي بِطَاعَتِكَ',
    transliteration: 'Allahumma la takhdhulni feehi li-ta\'arrudi ma\'siyatik, wa a\'izzani bi-ta\'atik',
    translationEn: 'O Allah, do not forsake me through disobedience to You, and honor me with obedience to Your guidance.',
    translationUz: 'Allohim, Senga osiy bo\'lishim tufayli meni xor qilmagin, toating bilan meni aziz qilgin.',
    hadithOrAyahRef: 'Surah Al-Furqan 25:70'
  },
  {
    day: 7,
    title: 'Perseverance in Fasting and Night Prayers',
    theme: 'Devotion and Qiyam',
    arabic: 'اللَّهُمَّ أَعِنِّي فِيهِ عَلَىٰ صِيَامِهِ وَقِيَامِهِ وَجَنِّبْنِي فِيهِ مِنْ هَفَوَاتِهِ وَآثَامِهِ',
    transliteration: 'Allahumma a\'inni feehi \'ala siyamihi wa qiyamihi, wa jannibni feehi min hafawatihi wa athamih',
    translationEn: 'O Allah, assist me during this day in keeping its fast and standing for prayer, and save me from mistakes and sins.',
    translationUz: 'Allohim, bu oyning ro\'zasi va qiyomida menga ko\'maklash, behuda so\'z va gunohlardan asra.',
    hadithOrAyahRef: 'Hadith: "Fasting is a shield..."'
  },
  {
    day: 8,
    title: 'Compassion for Orphans & Feeding the Needy',
    theme: 'Sadaqah & Social Mercy',
    arabic: 'اللَّهُمَّ ارْزُقْنِي فِيهِ رَحْمَةَ الْأَيْتَامِ وَإِطْعَامَ الطَّعَامِ وَإِفْشَاءَ السَّلَامِ',
    transliteration: 'Allahummar-zuqni feehi rahmatal-aytami wa it\'amat-ta\'ami wa ifsha\'as-salam',
    translationEn: 'O Allah, grant me kindness towards orphans, feeding the hungry, and spreading peace.',
    translationUz: 'Allohim, yetimlarga rahm qilishni, taom ulashishni va salomni yoyishni nasib etgin.',
    hadithOrAyahRef: 'Surah Al-Insan 76:8'
  },
  {
    day: 9,
    title: 'Boundless Mercy of the First Ashra',
    theme: 'Surrounding with Divine Care',
    arabic: 'اللَّهُمَّ اجْعَلْ لِي فِيهِ نَصِيبًا مِنْ رَحْمَتِكَ الْوَاسِعَةِ وَاهْدِنِي فِيهِ لِبَرَاهِينِكَ السَّاطِعَةِ',
    transliteration: 'Allahummaj-\'al lee feehi naseeban min rahmatikal-wasi\'ah, wahdini feehi li-barahinikas-sati\'ah',
    translationEn: 'O Allah, apportion for me a generous share of Your vast mercy, and guide me toward Your clear proofs.',
    translationUz: 'Allohim, keng rahmatingdan menga nasib etgin va ravshan dalillaring sari boshlagin.',
    hadithOrAyahRef: 'Surah Al-A\'raf 7:156'
  },
  {
    day: 10,
    title: 'True Trust & Reliance (Tawakkul)',
    theme: 'Completing the Ashra of Mercy',
    arabic: 'اللَّهُمَّ اجْعَلْنِي فِيهِ مِنَ الْمُتَوَكِّلِينَ عَلَيْكَ وَاجْعَلْنِي فِيهِ مِنَ الْفَائِزِينَ لَدَيْكَ',
    transliteration: 'Allahummaj-\'alni feehi minal-mutawakkileena \'alayk, waj-\'alni feehi minal-fa\'izeena ladayk',
    translationEn: 'O Allah, make me in this day among those who place full trust in You, and among the triumphant in Your presence.',
    translationUz: 'Allohim, meni Senga tavakkul qiluvchilardan va huzuringda zafar quchuvchilardan qilgin.',
    hadithOrAyahRef: 'Surah At-Talaq 65:3'
  },
  {
    day: 11,
    title: 'Love for Piety, Hatred for Corruption',
    theme: 'Beginning the Ashra of Maghfirah (Forgiveness)',
    arabic: 'اللَّهُمَّ حَبِّبْ إِلَيَّ فِيهِ الْإِحْسَانَ وَكَرِّهْ إِلَيَّ فِيهِ الْفُسُوقَ وَالْعِصْيَانَ',
    transliteration: 'Allahumma habbib ilayya feehil-ihsan, wa karrih ilayya feehil-fusooqa wal-\'isyan',
    translationEn: 'O Allah, make good deeds beloved to me, and make corruption and disobedience detestable to me.',
    translationUz: 'Allohim, yaxshilikni menga suyukli qil, fisq-fujur va osiylikni esa ko\'nglimga yoqimsiz ayla.',
    hadithOrAyahRef: 'Surah Al-Hujurat 49:7'
  },
  {
    day: 12,
    title: 'Adornment of Modesty & Chastity',
    theme: 'Spiritual Cleanliness',
    arabic: 'اللَّهُمَّ زَيِّنِّي فِيهِ بِالسِّتْرِ وَالْعَفَافِ وَاسْتُرْنِي فِيهِ بِلِبَاسِ الْقُنُوعِ وَالْكَفَافِ',
    transliteration: 'Allahumma zayyinnee feehi bis-sitri wal-\'afaf, wasturnee feehi bi-libasil-qunoo\'i wal-kafaf',
    translationEn: 'O Allah, beautify me with modesty and chastity, and clothe me with contentment and moderation.',
    translationUz: 'Allohim, meni hayo va iffat bilan ziynatla, qanoat va pokiza libos bilan o\'ragin.',
    hadithOrAyahRef: 'Surah Al-A\'raf 7:26'
  },
  {
    day: 13,
    title: 'Purity from Impurities & Patience in Trials',
    theme: 'Steadfast Heart',
    arabic: 'اللَّهُمَّ طَهِّرْنِي فِيهِ مِنَ الدَّنَسِ وَالْأَقْذَارِ وَصَبِّرْنِي فِيهِ عَلَىٰ كَائِنَاتِ الْأَقْدَارِ',
    transliteration: 'Allahumma tahhirnee feehi minad-danasi wal-aqdhar, wa sabbirnee feehi \'ala ka\'inatil-aqdar',
    translationEn: 'O Allah, purify me from uncleanliness and impurities, and give me patience over decrees that befall.',
    translationUz: 'Allohim, meni illat va kirikliklardan pokla, taqdiring hukmlariga sabrli qilgin.',
    hadithOrAyahRef: 'Surah Al-Baqarah 2:155'
  },
  {
    day: 14,
    title: 'Overlooking Slips & Errors',
    theme: 'Mutual Forgiveness',
    arabic: 'اللَّهُمَّ لَا تُؤَاخِذْنِي فِيهِ بِالْعَثَرَاتِ وَأَقِلْنِي فِيهِ مِنَ الْخَطَايَا وَالْهَفَوَاتِ',
    transliteration: 'Allahumma la tu\'akhidhnee feehi bil-\'atharat, wa aqilnee feehi minal-khataya wal-hafawat',
    translationEn: 'O Allah, do not hold me accountable for inadvertent slips, and excuse my faults and shortcomings.',
    translationUz: 'Allohim, adashishlarim tufayli meni jazolama, xatolarim va kamchiliklarimni afv et.',
    hadithOrAyahRef: 'Surah Al-Baqarah 2:286'
  },
  {
    day: 15,
    title: 'Humility of the Heart (Khushu\')',
    theme: 'Sincere Devotion',
    arabic: 'اللَّهُمَّ ارْزُقْنِي فِيهِ طَاعَةَ الْخَاشِعِينَ وَاشْرَحْ فِيهِ صَدْرِي بِإِنَابَةِ الْمُخْبِتِينَ',
    transliteration: 'Allahummar-zuqnee feehi ta\'atal-khashi\'een, washrah feehi sadree bi-inabatil-mukhbiteen',
    translationEn: 'O Allah, grant me the humble obedience of the reverent, and expand my chest with sincere turning of the devout.',
    translationUz: 'Allohim, menga xushu\'li kishilarning itoatini ber va qalbimni xolis tavba qiluvchilar kabi kengaytir.',
    hadithOrAyahRef: 'Surah Al-Mu\'minun 23:1-2'
  },
  {
    day: 16,
    title: 'Company of the Righteous',
    theme: 'Protecting One\'s Circle',
    arabic: 'اللَّهُمَّ وَفِّقْنِي فِيهِ لِمُوَافَقَةِ الْأَبْرَارِ وَجَنِّبْنِي فِيهِ مُرَافَقَةَ الْأَشْرَارِ',
    transliteration: 'Allahumma waffiqnee feehi li-muwafaqatil-abraar, wa jannibnee feehi murafaqatal-ashrar',
    translationEn: 'O Allah, guide me toward companionship with the righteous, and save me from association with the wicked.',
    translationUz: 'Allohim, yaxshilar bilan hamroh bo\'lishimga yo\'l och, yomonlar davrasidan yiroq qilgin.',
    hadithOrAyahRef: 'Surah At-Tawbah 9:119'
  },
  {
    day: 17,
    title: 'Fulfillment of Righteous Hopes',
    theme: 'Commemorating the Victory of Badr',
    arabic: 'اللَّهُمَّ اهْدِنِي فِيهِ لِصَالِحِ الْأَعْمَالِ وَاقْضِ لِي فِيهِ الْحَوَائِجَ وَالْآمَالَ',
    transliteration: 'Allahummah-dinee feehi li-salihil-a\'mal, waqdi lee feehil-hawa\'ija wal-amal',
    translationEn: 'O Allah, guide me to noble deeds, and fulfill for me all noble hopes and legitimate aspirations.',
    translationUz: 'Allohim, solih amallar sari hidoyat qil, barcha ezgu ehtiyojlarim va orzularimni ijobat et.',
    hadithOrAyahRef: 'Surah Ali \'Imran 3:123'
  },
  {
    day: 18,
    title: 'Barakah of the Suhoor Hours',
    theme: 'Dawn Blessings',
    arabic: 'اللَّهُمَّ نَبِّهْنِي فِيهِ لِبَرَكَاتِ أَسْحَارِهِ وَنَوِّرْ فِيهِ قَلْبِي بِضِيَاءِ أَنْوَارِهِ',
    transliteration: 'Allahumma nabbihnee feehi li-barakati asharih, wa nawwir feehi qalbee bi-diya\'i anwarih',
    translationEn: 'O Allah, awaken me to the barakah of its dawn hours (Suhoor), and illuminate my heart with its divine lights.',
    translationUz: 'Allohim, saharlik paytlarining barakasidan meni ogoh ayla, qalbimni nurlaring ziyosi ila yorit.',
    hadithOrAyahRef: 'Hadith: "Take Suhoor, for indeed in Suhoor there is barakah."'
  },
  {
    day: 19,
    title: 'Abundance of Good Rewards',
    theme: 'Maximizing Fasting Rewards',
    arabic: 'اللَّهُمَّ وَفِّرْ فِيهِ حَظِّي مِنْ بَرَكَاتِهِ وَسَهِّلْ سَبِيلِي إِلَىٰ خَيْرَاتِهِ',
    transliteration: 'Allahumma waffir feehi hazzee min barakatih, wa sahhil sabeeli ila khayratih',
    translationEn: 'O Allah, multiply my portion from its blessings, and ease my pathway toward its abundant virtues.',
    translationUz: 'Allohim, bu oyning barakotidan mening ulushimni ziyoda qil, xayrli ishlarga yo\'limni osonlashtir.',
    hadithOrAyahRef: 'Surah Al-Baqarah 2:148'
  },
  {
    day: 20,
    title: 'Gates of Paradise & Repulsion of Satan',
    theme: 'Completing the Ashra of Maghfirah',
    arabic: 'اللَّهُمَّ افْتَحْ لِي فِيهِ أَبْوَابَ الْجِنَانِ وَأَغْلِقْ عَنِّي فِيهِ أَبْوَابَ النِّيرَانِ',
    transliteration: 'Allahummaf-tah lee feehi abwabal-jinan, wa aghliq \'annee feehi abwaban-neeran',
    translationEn: 'O Allah, open for me the gates of Gardens (Jannah), and close against me the gates of the Fire.',
    translationUz: 'Allohim, menga jannat eshiklarini ochgin va jahannam eshiklarini berk etgin.',
    hadithOrAyahRef: 'Hadith: "When Ramadan enters, the gates of Jannah are opened..."'
  },
  {
    day: 21,
    title: 'Entering the Last 10 Nights',
    theme: 'Ashra of Najaat & Seeking Laylat al-Qadr',
    arabic: 'اللَّهُمَّ اجْعَلْ لِي فِيهِ إِلَىٰ مَرْضَاتِكَ دَلِيلًا وَلَا تَجْعَلْ لِلشَّيْطَانِ فِيهِ عَلَيَّ سَبِيلًا',
    transliteration: 'Allahummaj-\'al lee feehi ila mardatika daleela, wa la taj\'al lish-shaytani feehi \'alayya sabeela',
    translationEn: 'O Allah, appoint for me a clear guide to Your pleasure, and do not let Satan find any way against me.',
    translationUz: 'Allohim, O\'zingning roziliging sari menga yo\'l ko\'rsat, shaytonning ustimdan yo\'l topishiga yo\'l qo\'yma.',
    hadithOrAyahRef: 'Hadith: "Seek Laylat al-Qadr in the odd nights of the last 10 days."'
  },
  {
    day: 22,
    title: 'Showers of Divine Favor',
    theme: 'Steadfastness in the Final Stretch',
    arabic: 'اللَّهُمَّ افْتَحْ لِي فِيهِ أَبْوَابَ فَضْلِكَ وَأَنْزِلْ عَلَيَّ فِيهِ بَرَكَاتِكَ',
    transliteration: 'Allahummaf-tah lee feehi abwaba fadlik, wa anzil \'alayya feehi barakatik',
    translationEn: 'O Allah, open for me the gates of Your bounties, and send down upon me Your divine blessings.',
    translationUz: 'Allohim, O\'z fazling eshiklarini menga ochgin va ustimga barakotlaringni yog\'dirgin.',
    hadithOrAyahRef: 'Surah Al-Jumu\'ah 62:10'
  },
  {
    day: 23,
    title: 'Purification from All Defects',
    theme: 'Readiness for Laylat al-Qadr',
    arabic: 'اللَّهُمَّ اغْسِلْنِي فِيهِ مِنَ الذُّنُوبِ وَطَهِّرْنِي فِيهِ مِنَ الْعُيُوبِ',
    transliteration: 'Allahummagh-silnee feehi minadh-dhunoob, wa tahhirnee feehi minal-\'uyoob',
    translationEn: 'O Allah, wash away my sins completely and purify me from all spiritual blemishes.',
    translationUz: 'Allohim, gunohlarimni yuvib tashlagin va barcha ayb-nuqsonlardan meni poklagin.',
    hadithOrAyahRef: 'Surah At-Tahrim 66:8'
  },
  {
    day: 24,
    title: 'Seeking What Pleases Allah',
    theme: 'Alignment with the Divine Will',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ فِيهِ مَا يُرْضِيكَ وَأَعُوذُ بِكَ مِمَّا يُؤْذِيكَ',
    transliteration: 'Allahumma innee as\'aluka feehi ma yurdeek, wa a\'oodhu bika mimma yu\'dheek',
    translationEn: 'O Allah, I ask You for all that pleases You, and I seek refuge in You from that which displeases You.',
    translationUz: 'Allohim, bu kunda Senga xush keladigan amallarni so\'rayman, Seni norozi qiladigan narsalardan panoh tilayman.',
    hadithOrAyahRef: 'Surah Al-Bayyinah 98:8'
  },
  {
    day: 25,
    title: 'Devotion to the Sunnah of Muhammad (ﷺ)',
    theme: 'Prophetic Guidance',
    arabic: 'اللَّهُمَّ اجْعَلْنِي فِيهِ مُحِبًّا لِأَوْلِيَائِكَ وَمُعَادِيًا لِأَعْدَائِكَ مُسْتَنًّا بِسُنَّةِ خَاتَمِ أَنْبِيَائِكَ',
    transliteration: 'Allahummaj-\'alnee feehi muhibban li-awliya\'ik, wa mu\'adiyan li-a\'da\'ik, mustannan bi-sunnati khatami ambiya\'ik',
    translationEn: 'O Allah, make me a lover of Your righteous friends, averse to Your enemies, and an upholder of the Sunnah of Your final Prophet.',
    translationUz: 'Allohim, do\'stlaringni yaxshi ko\'ruvchi, dushmanlaringdan yiroq bo\'luvchi va Payg\'ambaring sunnatiga ergashuvchi qilgin.',
    hadithOrAyahRef: 'Surah Ali \'Imran 3:31'
  },
  {
    day: 26,
    title: 'Forgiving Hidden Flaws',
    theme: 'Acceptance of Good Deeds',
    arabic: 'اللَّهُمَّ اجْعَلْ سَعْيِي فِيهِ مَشْكُورًا وَذَنْبِي فِيهِ مَغْفُورًا وَعَمَلِي فِيهِ مَقْبُولًا',
    transliteration: 'Allahummaj-\'al sa\'yee feehi mashkoora, wa dhambee feehi maghfoora, wa \'amalee feehi maqboola',
    translationEn: 'O Allah, make my striving appreciated, my sins forgiven, and my righteous deeds accepted.',
    translationUz: 'Allohim, harakatlarimni qadrli, gunohlarimni kechirilgan va barcha amallarimni qabul qilingan aylagin.',
    hadithOrAyahRef: 'Surah Al-Insan 76:22'
  },
  {
    day: 27,
    title: 'Blessed Laylat al-Qadr',
    theme: 'The Night Better Than a Thousand Months',
    arabic: 'اللَّهُمَّ ارْزُقْنِي فِيهِ فَضْلَ لَيْلَةِ الْقَدْرِ وَصَيِّرْ أُمُورِي فِيهِ مِنَ الْعُسْرِ إِلَى الْيُسْرِ',
    transliteration: 'Allahummar-zuqnee feehi fadla Laylatil-Qadr, wa sayyir umooree feehi minal-\'usri ilal-yusr',
    translationEn: 'O Allah, bestow upon me the virtue of Laylat al-Qadr, and transform my difficulties into abundant ease.',
    translationUz: 'Allohim, menga Qadr kechasining fazlini nasib etgin va ishlarimni qiyinchilikdan osonlikka aylantirgin.',
    hadithOrAyahRef: 'Surah Al-Qadr 97:1-5'
  },
  {
    day: 28,
    title: 'Enrichment Through Voluntary Deeds (Nawafil)',
    theme: 'Closeness Through Sunnah',
    arabic: 'اللَّهُمَّ وَفِّرْ حَظِّي فِيهِ مِنَ النَّوَافِلِ وَأَكْرِمْنِي فِيهِ بِإِحْضَارِ الْمَسَائِلِ',
    transliteration: 'Allahumma waffir hazzee feehi minan-nawafil, wa akrimnee feehi bi-ihdaril-masa\'il',
    translationEn: 'O Allah, increase my portion of voluntary worship, and honor me with prompt answering of supplications.',
    translationUz: 'Allohim, nafl ibodatlardan nasibamni ziyoda etgin va duolarimni tezda ijobat qilish ila mukofotlagin.',
    hadithOrAyahRef: 'Hadith Qudsi: "My servant continues to draw near to Me with Nawafil..."'
  },
  {
    day: 29,
    title: 'Enveloping in Unconditional Mercy',
    theme: 'Perseverance to the Final Hour',
    arabic: 'اللَّهُمَّ غَشِّنِي فِيهِ بِالرَّحْمَةِ وَارْزُقْنِي فِيهِ التَّوْفِيقَ وَالْعِصْمَةَ وَطَهِّرْ قَلْبِي',
    transliteration: 'Allahumma ghash-shinee feehi bir-rahmah, war-zuqnee feehit-tawfeeqa wal-\'ismah, wa tahhir qalbee',
    translationEn: 'O Allah, envelop me in Your mercy, grant me success and protection from error, and purify my heart.',
    translationUz: 'Allohim, meni rahmating bilan chulg\'agin, tavfiq va himoyangni ato ayla, qalbimni pokiza qil.',
    hadithOrAyahRef: 'Surah Al-Baqarah 2:185'
  },
  {
    day: 30,
    title: 'Gratitude & Acceptance of the Entire Month',
    theme: 'Welcoming Eid al-Fitr with Purity',
    arabic: 'اللَّهُمَّ اجْعَلْ صِيَامِي فِيهِ بِالشُّكْرِ وَالْقَبُولِ عَلَىٰ مَا تَرْضَاهُ وَيَرْضَاهُ الرَّسُولُ',
    transliteration: 'Allahummaj-\'al siyamee feehi bish-shukri wal-qabooli \'ala ma tardahu wa yardahur-Rasool',
    translationEn: 'O Allah, make my fasting in this month accepted with gratitude, in accordance with what pleases You and pleases the Messenger.',
    translationUz: 'Allohim, bu oydagi ro\'zamni O\'zing va Rasuling rozi bo\'ladigan tarzda shukr va qabul aylagin.',
    hadithOrAyahRef: 'Surah Al-Baqarah 2:185 ("...and that you may magnify Allah for having guided you, and that you may be thankful.")'
  }
];

export const RAMADAN_SUNNAH_TIPS = [
  {
    title: 'Delay Suhoor & Hasten Iftar',
    desc: 'The Prophet (ﷺ) said: "People will continue to prosper as long as they hasten to break the fast." (Sahih al-Bukhari)',
    tip: 'Finish Suhoor 10-15 minutes before Fajr and break fast immediately upon hearing the Maghrib Azan.'
  },
  {
    title: 'Break Fast with Fresh Dates or Water',
    desc: 'The Prophet (ﷺ) broke his fast with fresh dates before praying; if not fresh, then dried dates; if none, then a few sips of water.',
    tip: 'Dates rapidly replenish low blood glucose levels and restore electrolytes naturally.'
  },
  {
    title: 'Guarding the Tongue and Heart',
    desc: 'The Prophet (ﷺ) said: "Whoever does not leave false speech and acting upon it, Allah has no need of him leaving his food and drink." (Al-Bukhari)',
    tip: 'If someone provokes or insults you, say gently: "Inni sa\'im" (Indeed, I am fasting).'
  },
  {
    title: 'Multiplying Generosity & Charity',
    desc: 'Ibn Abbas (RA) reported that the Messenger of Allah (ﷺ) was the most generous of people, and even more generous in Ramadan like the blowing wind.',
    tip: 'Set aside a small daily Sadaqah, feed a fasting neighbor, or donate Zakat al-Fitr early.'
  }
];
