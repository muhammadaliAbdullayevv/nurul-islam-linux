import { SurahDetail, SurahSummary } from '../types';

export const ALL_SURAHS: SurahSummary[] = [
  { number: 1, name: "الفاتحة", englishName: "Al-Fatihah", englishNameTranslation: "The Opening", numberOfAyahs: 7, revelationType: "Meccan", page: 1, juz: 1, tags: ["Praise", "Prayer", "Guidance", "Foundation"], description: "The foundational surah recited in every unit of prayer, summarizing the entire message of the Quran." },
  { number: 2, name: "البقرة", englishName: "Al-Baqarah", englishNameTranslation: "The Cow", numberOfAyahs: 286, revelationType: "Medinan", page: 2, juz: 1, tags: ["Faith", "Laws", "Ayatul Kursi", "Prophets", "Fasting"], description: "The longest surah containing guidance on worship, ethics, legal codes, and the greatest verse: Ayatul Kursi." },
  { number: 3, name: "آل عمران", englishName: "Ali 'Imran", englishNameTranslation: "Family of Imran", numberOfAyahs: 200, revelationType: "Medinan", page: 50, juz: 3, tags: ["Jesus", "Mary", "Steadfastness", "Battle of Uhud"], description: "Addresses the believers and the People of the Book, emphasizing steadfastness and the miraculous birth of Jesus." },
  { number: 4, name: "النساء", englishName: "An-Nisa", englishNameTranslation: "The Women", numberOfAyahs: 176, revelationType: "Medinan", page: 77, juz: 4, tags: ["Justice", "Orphans", "Inheritance", "Family"], description: "Establishes rights for women, orphans, social justice, and laws of inheritance." },
  { number: 5, name: "المائدة", englishName: "Al-Ma'idah", englishNameTranslation: "The Table Spread", numberOfAyahs: 120, revelationType: "Medinan", page: 106, juz: 6, tags: ["Covenants", "Dietary Laws", "Christianity", "Truth"], description: "Details religious duties, dietary rules, contracts, and the final completion of Islam." },
  { number: 6, name: "الأنعام", englishName: "Al-An'am", englishNameTranslation: "The Cattle", numberOfAyahs: 165, revelationType: "Meccan", page: 128, juz: 7, tags: ["Tawhid", "Creation", "Ibrahim", "Monotheism"], description: "A profound defense of pure Monotheism (Tawhid) and the marvels of divine creation." },
  { number: 7, name: "الأعراف", englishName: "Al-A'raf", englishNameTranslation: "The Heights", numberOfAyahs: 206, revelationType: "Meccan", page: 151, juz: 8, tags: ["Stories of Prophets", "Adam", "Iblis", "Judgment"], description: "Narrates the struggle between prophets and their peoples from Adam to Moses." },
  { number: 8, name: "الأنفال", englishName: "Al-Anfal", englishNameTranslation: "The Spoils of War", numberOfAyahs: 75, revelationType: "Medinan", page: 177, juz: 9, tags: ["Battle of Badr", "Trust in Allah", "Unity"], description: "Revealed after the pivotal victory at Badr, teaching divine assistance and spiritual discipline." },
  { number: 9, name: "التوبة", englishName: "At-Tawbah", englishNameTranslation: "The Repentance", numberOfAyahs: 129, revelationType: "Medinan", page: 187, juz: 10, tags: ["Repentance", "Hypocrisy", "Charity", "Tabuk"], description: "Focuses on sincere repentance and distinguishing true believers from hypocrites." },
  { number: 10, name: "يونس", englishName: "Yunus", englishNameTranslation: "Jonah", numberOfAyahs: 109, revelationType: "Meccan", page: 208, juz: 11, tags: ["Patience", "Divine Signs", "Prophet Yunus"], description: "Emphasizes the power of repentance through the story of Yunus and his people." },
  { number: 11, name: "هود", englishName: "Hud", englishNameTranslation: "Hud", numberOfAyahs: 123, revelationType: "Meccan", page: 221, juz: 11, tags: ["Noah", "Hud", "Salih", "Steadfastness"], description: "Contains dramatic narratives of past civilizations who rejected divine warnings." },
  { number: 12, name: "يوسف", englishName: "Yusuf", englishNameTranslation: "Joseph", numberOfAyahs: 111, revelationType: "Meccan", page: 235, juz: 12, tags: ["Patience", "Beauty", "Forgiveness", "Family"], description: "Described as 'the most beautiful of stories', displaying how patience leads to ultimate victory." },
  { number: 13, name: "الرعد", englishName: "Ar-Ra'd", englishNameTranslation: "The Thunder", numberOfAyahs: 43, revelationType: "Medinan", page: 249, juz: 13, tags: ["Peace of Heart", "Nature", "Thunder", "Truth"], description: "Features the renowned verse: 'Verily, in the remembrance of Allah do hearts find rest.'" },
  { number: 14, name: "إبراهيم", englishName: "Ibrahim", englishNameTranslation: "Abraham", numberOfAyahs: 52, revelationType: "Meccan", page: 255, juz: 13, tags: ["Gratitude", "Prayer", "Prophet Ibrahim", "Makkah"], description: "Celebrates the prayers of Prophet Ibrahim and the blessings bestowed upon those who give thanks." },
  { number: 15, name: "الحجر", englishName: "Al-Hijr", englishNameTranslation: "The Rocky Tract", numberOfAyahs: 99, revelationType: "Meccan", page: 262, juz: 14, tags: ["Preservation of Quran", "Angels", "Creation"], description: "Guarantees divine protection of the Holy Quran against any corruption." },
  { number: 16, name: "النحل", englishName: "An-Nahl", englishNameTranslation: "The Bee", numberOfAyahs: 128, revelationType: "Meccan", page: 267, juz: 14, tags: ["Blessings", "Nature", "Bees", "Honey", "Gratitude"], description: "Known as the Chapter of Blessings, highlighting natural wonders from rain to honey." },
  { number: 17, name: "الإسراء", englishName: "Al-Isra", englishNameTranslation: "The Night Journey", numberOfAyahs: 111, revelationType: "Meccan", page: 282, juz: 15, tags: ["Night Journey", "Parents", "Morals", "Bani Isra'il"], description: "Begins with the miraculous Night Journey (Isra & Mi'raj) and commands kindness to parents." },
  { number: 18, name: "الكهف", englishName: "Al-Kahf", englishNameTranslation: "The Cave", numberOfAyahs: 110, revelationType: "Meccan", page: 293, juz: 15, tags: ["Friday", "Sleepers of Cave", "Musa & Khidr", "Dhul-Qarnayn", "Dajjal Protection"], description: "Recited every Friday for divine light and protection from the trials of the modern age." },
  { number: 19, name: "مريم", englishName: "Maryam", englishNameTranslation: "Mary", numberOfAyahs: 98, revelationType: "Meccan", page: 305, juz: 16, tags: ["Virgin Mary", "Prophet Isa", "Zakariya", "Mercy"], description: "Vividly narrates the blessed birth of Prophet Isa (Jesus) and the piety of Maryam." },
  { number: 20, name: "طه", englishName: "Taha", englishNameTranslation: "Ta-Ha", numberOfAyahs: 135, revelationType: "Meccan", page: 312, juz: 16, tags: ["Musa", "Comfort", "Prayer", "Burning Bush"], description: "Reassures the Prophet and details Musa's encounter with Allah at the sacred valley of Tuwa." },
  { number: 21, name: "الأنبياء", englishName: "Al-Anbiya", englishNameTranslation: "The Prophets", numberOfAyahs: 112, revelationType: "Meccan", page: 322, juz: 17, tags: ["Unity of Prophethood", "Ibrahim", "Ayyub", "Yunus"], description: "Showcases the shared mission and earnest supplications of numerous prophets in their trials." },
  { number: 22, name: "الحج", englishName: "Al-Hajj", englishNameTranslation: "The Pilgrimage", numberOfAyahs: 78, revelationType: "Medinan", page: 332, juz: 17, tags: ["Hajj", "Sacrifice", "Day of Resurrection"], description: "Proclaims the rituals of Hajj and describes the awe of the Day of Judgment." },
  { number: 23, name: "المؤمنون", englishName: "Al-Mu'minun", englishNameTranslation: "The Believers", numberOfAyahs: 118, revelationType: "Meccan", page: 342, juz: 18, tags: ["Success", "Humility in Salah", "Modesty", "Paradise"], description: "Lists the supreme qualities of true believers who inherit Jannat al-Firdaws." },
  { number: 24, name: "النور", englishName: "An-Nur", englishNameTranslation: "The Light", numberOfAyahs: 64, revelationType: "Medinan", page: 350, juz: 18, tags: ["Ayat an-Nur", "Modesty", "Hijab", "Purity", "Family"], description: "Features the majestic Verse of Light (Ayat an-Nur) and guides for moral purity." },
  { number: 25, name: "الفرقان", englishName: "Al-Furqan", englishNameTranslation: "The Criterion", numberOfAyahs: 77, revelationType: "Meccan", page: 359, juz: 18, tags: ["Criterion", "Servants of the Merciful", "Repentance"], description: "Contrasts truth and falsehood, ending with the noble traits of 'Ibad ar-Rahman'." },
  { number: 26, name: "الشعراء", englishName: "Ash-Shu'ara", englishNameTranslation: "The Poets", numberOfAyahs: 227, revelationType: "Meccan", page: 367, juz: 19, tags: ["Stories of Prophets", "Truth vs Rhetoric", "Faith"], description: "Reassures the Prophet with recurring affirmations of divine power and mercy." },
  { number: 27, name: "النمل", englishName: "An-Naml", englishNameTranslation: "The Ant", numberOfAyahs: 93, revelationType: "Meccan", page: 377, juz: 19, tags: ["Sulayman", "Queen of Sheba", "Animals", "Wisdom"], description: "Chronicles Prophet Sulayman's kingdom, his communication with animals, and Bilqis." },
  { number: 28, name: "القصص", englishName: "Al-Qasas", englishNameTranslation: "The Stories", numberOfAyahs: 88, revelationType: "Meccan", page: 385, juz: 20, tags: ["Musa Childhood", "Pharaoh", "Qarun", "Humility"], description: "Narrates Musa's infant journey on the Nile through his confrontation with Pharaoh and Qarun." },
  { number: 29, name: "العنكبوت", englishName: "Al-'Ankabut", englishNameTranslation: "The Spider", numberOfAyahs: 69, revelationType: "Meccan", page: 396, juz: 20, tags: ["Trials", "Spider Web", "Perseverance", "Salah"], description: "Explains that believers will face trials, comparing idols to fragile spider webs." },
  { number: 30, name: "الروم", englishName: "Ar-Rum", englishNameTranslation: "The Romans", numberOfAyahs: 60, revelationType: "Meccan", page: 404, juz: 21, tags: ["Prophecy", "Signs in Nature", "Marriage", "Languages"], description: "Foresees the Roman comeback and meditates on love and mercy in marriage." },
  { number: 31, name: "لقمان", englishName: "Luqman", englishNameTranslation: "Luqman", numberOfAyahs: 34, revelationType: "Meccan", page: 411, juz: 21, tags: ["Luqman's Advice", "Parents", "Humility", "Wisdom"], description: "Luqman the Wise's timeless moral counsel to his beloved son." },
  { number: 32, name: "السجدة", englishName: "As-Sajdah", englishNameTranslation: "The Prostration", numberOfAyahs: 30, revelationType: "Meccan", page: 415, juz: 21, tags: ["Prostration", "Creation", "Friday Dawn Prayer"], description: "Often recited on Friday morning prayers; calls for reverence before the Creator." },
  { number: 33, name: "الأحزاب", englishName: "Al-Ahzab", englishNameTranslation: "The Combined Forces", numberOfAyahs: 73, revelationType: "Medinan", page: 418, juz: 21, tags: ["Battle of Trench", "Prophet Character", "Salawat", "Hijab"], description: "Records the siege of Madinah, proclaims the Prophet as an excellent role model, and commands Salawat." },
  { number: 34, name: "سبأ", englishName: "Saba", englishNameTranslation: "Sheba", numberOfAyahs: 54, revelationType: "Meccan", page: 428, juz: 22, tags: ["Dawud", "Sulayman", "Dam of Ma'rib", "Gratitude"], description: "Examines how civilizations prosper through gratitude and collapse when ungrateful." },
  { number: 35, name: "فاطر", englishName: "Fatir", englishNameTranslation: "The Originator", numberOfAyahs: 45, revelationType: "Meccan", page: 434, juz: 22, tags: ["Angels", "Creation", "Dependence on Allah"], description: "Praises the Originator of heaven and earth and reminds mankind of their constant need for Allah." },
  { number: 36, name: "يس", englishName: "Yasin", englishNameTranslation: "Ya-Sin", numberOfAyahs: 83, revelationType: "Meccan", page: 440, juz: 22, tags: ["Heart of Quran", "Resurrection", "Signs", "Praise"], description: "Celebrated as the 'Heart of the Quran', affirming the truth of revelation, cosmos, and afterlife." },
  { number: 37, name: "الصافات", englishName: "As-Saffat", englishNameTranslation: "Those Who Set The Ranks", numberOfAyahs: 182, revelationType: "Meccan", page: 446, juz: 23, tags: ["Angels", "Ibrahim Sacrifice", "Prophets"], description: "Depicts angels standing in ranks and Ibrahim's profound test with his son." },
  { number: 38, name: "ص", englishName: "Sad", englishNameTranslation: "Sad", numberOfAyahs: 88, revelationType: "Meccan", page: 453, juz: 23, tags: ["Dawud", "Sulayman", "Ayyub", "Repentance"], description: "Presents stories of Dawud, Sulayman, and Ayyub turning back to Allah in deep repentance." },
  { number: 39, name: "الزمر", englishName: "Az-Zumar", englishNameTranslation: "The Crowds", numberOfAyahs: 75, revelationType: "Meccan", page: 458, juz: 23, tags: ["Forgiveness of Sins", "Sincerity", "Paradise"], description: "Contains the reassuring promise: 'Despair not of the mercy of Allah; indeed, Allah forgives all sins.'" },
  { number: 40, name: "غافر", englishName: "Ghafir", englishNameTranslation: "The Forgiver", numberOfAyahs: 85, revelationType: "Meccan", page: 467, juz: 24, tags: ["Forgiveness", "Believer of Pharaoh", "Prayer Answered"], description: "Highlights Allah's names: Forgiver of Sin and Accepter of Repentance; urges callers to make Dua." },
  { number: 55, name: "الرحمن", englishName: "Ar-Rahman", englishNameTranslation: "The Beneficent", numberOfAyahs: 78, revelationType: "Medinan", page: 531, juz: 27, tags: ["Beauty of Quran", "Favors of Allah", "Paradise", "Jannah"], description: "The jewel of the Quran with the recurring refrain: 'Which of the favors of your Lord will you deny?'" },
  { number: 56, name: "الواقعة", englishName: "Al-Waqi'ah", englishNameTranslation: "The Inevitable", numberOfAyahs: 96, revelationType: "Meccan", page: 534, juz: 27, tags: ["Wealth & Barakah", "Three Groups", "Resurrection"], description: "Recited for spiritual and material barakah, dividing mankind into three categories in the hereafter." },
  { number: 67, name: "الملك", englishName: "Al-Mulk", englishNameTranslation: "The Sovereignty", numberOfAyahs: 30, revelationType: "Meccan", page: 562, juz: 29, tags: ["Nightly Recitation", "Grave Protection", "Creation", "Dominion"], description: "The interceding Surah recited nightly for protection and light in the grave." },
  { number: 93, name: "الضحى", englishName: "Ad-Duha", englishNameTranslation: "The Morning Hours", numberOfAyahs: 11, revelationType: "Meccan", page: 596, juz: 30, tags: ["Comfort", "Hope", "Orphans", "Gratitude"], description: "A heartwarming balm of solace from Allah to the Prophet, promising that the future will be brighter." },
  { number: 94, name: "الشرح", englishName: "Ash-Sharh", englishNameTranslation: "The Relief", numberOfAyahs: 8, revelationType: "Meccan", page: 596, juz: 30, tags: ["Ease with Hardship", "Relief", "Hope"], description: "Affirms that with every hardship comes ease, opening the heart with optimism." },
  { number: 97, name: "القدر", englishName: "Al-Qadr", englishNameTranslation: "The Power", numberOfAyahs: 5, revelationType: "Meccan", page: 598, juz: 30, tags: ["Ramadan", "Night of Decree", "Angels", "Peace"], description: "Extols Laylat al-Qadr (The Night of Decree), which is better than a thousand months." },
  { number: 103, name: "العصر", englishName: "Al-'Asr", englishNameTranslation: "The Declining Day", numberOfAyahs: 3, revelationType: "Meccan", page: 601, juz: 30, tags: ["Time", "Success", "Patience", "Truth"], description: "Imam Al-Shafi'i noted that if only this short Surah were revealed, it would suffice mankind." },
  { number: 108, name: "الكوثر", englishName: "Al-Kawthar", englishNameTranslation: "The Abundance", numberOfAyahs: 3, revelationType: "Meccan", page: 602, juz: 30, tags: ["River of Paradise", "Abundance", "Sacrifice"], description: "The shortest Surah, comforting the Prophet with the boundless heavenly river of Al-Kawthar." },
  { number: 112, name: "الإخلاص", englishName: "Al-Ikhlas", englishNameTranslation: "The Sincerity", numberOfAyahs: 4, revelationType: "Meccan", page: 604, juz: 30, tags: ["Tawhid", "One Third of Quran", "Purity of Faith"], description: "Equates to one-third of the Quran in reward, pure essence of monotheism: Allah is One and Absolute." },
  { number: 113, name: "الفلق", englishName: "Al-Falaq", englishNameTranslation: "The Daybreak", numberOfAyahs: 5, revelationType: "Meccan", page: 604, juz: 30, tags: ["Protection", "Mu'awwidhatayn", "Evil Eye", "Envy"], description: "Powerful shield seeking refuge from darkness, envy, and unseen harms." },
  { number: 114, name: "الناس", englishName: "An-Nas", englishNameTranslation: "Mankind", numberOfAyahs: 6, revelationType: "Meccan", page: 604, juz: 30, tags: ["Protection", "Waswas", "Mankind", "King of Men"], description: "The concluding Surah of the Holy Quran, seeking refuge in the Lord, King, and God of mankind." },
];

// Complete list generator to ensure all 114 surahs are searchable
const SURAH_NAMES_ALL: Array<[number, string, string, string, number, 'Meccan' | 'Medinan', number, number]> = [
  [41, "فصلت", "Fussilat", "Explained in Detail", 54, "Meccan", 477, 24],
  [42, "الشورى", "Ash-Shura", "The Consultation", 53, "Meccan", 483, 25],
  [43, "الزخرف", "Az-Zukhruf", "The Ornaments of Gold", 89, "Meccan", 489, 25],
  [44, "الدخان", "Ad-Dukhan", "The Smoke", 59, "Meccan", 496, 25],
  [45, "الجاثية", "Al-Jathiyah", "The Crouching", 37, "Meccan", 499, 25],
  [46, "الأحقاف", "Al-Ahqaf", "The Wind-Curved Sandhills", 35, "Meccan", 502, 26],
  [47, "محمد", "Muhammad", "Muhammad", 38, "Medinan", 507, 26],
  [48, "الفتح", "Al-Fath", "The Victory", 29, "Medinan", 511, 26],
  [49, "الحجرات", "Al-Hujurat", "The Rooms", 18, "Medinan", 515, 26],
  [50, "ق", "Qaf", "Qaf", 45, "Meccan", 518, 26],
  [51, "الذاريات", "Adh-Dhariyat", "The Winnowing Winds", 60, "Meccan", 520, 26],
  [52, "الطور", "At-Tur", "The Mount", 49, "Meccan", 523, 27],
  [53, "النجم", "An-Najm", "The Star", 62, "Meccan", 526, 27],
  [54, "القمر", "Al-Qamar", "The Moon", 55, "Meccan", 528, 27],
  [57, "الحديد", "Al-Hadid", "The Iron", 29, "Medinan", 537, 27],
  [58, "المجادلة", "Al-Mujadila", "The Pleading Woman", 22, "Medinan", 542, 28],
  [59, "الحشر", "Al-Hashr", "The Exile", 24, "Medinan", 545, 28],
  [60, "الممتحنة", "Al-Mumtahanah", "The Examined One", 13, "Medinan", 549, 28],
  [61, "الصف", "As-Saff", "The Ranks", 14, "Medinan", 551, 28],
  [62, "الجمعة", "Al-Jumu'ah", "The Congregation", 11, "Medinan", 553, 28],
  [63, "المنافقون", "Al-Munafiqun", "The Hypocrites", 11, "Medinan", 554, 28],
  [64, "التغابن", "At-Taghabun", "Mutual Loss and Gain", 18, "Medinan", 556, 28],
  [65, "الطلاق", "At-Talaq", "The Divorce", 12, "Medinan", 558, 28],
  [66, "التحريم", "At-Tahrim", "The Prohibition", 12, "Medinan", 560, 28],
  [68, "القلم", "Al-Qalam", "The Pen", 52, "Meccan", 564, 29],
  [69, "الحاقة", "Al-Haqqah", "The Reality", 52, "Meccan", 566, 29],
  [70, "المعارج", "Al-Ma'arij", "The Ascending Stairways", 44, "Meccan", 568, 29],
  [71, "نوح", "Nuh", "Noah", 28, "Meccan", 570, 29],
  [72, "الجن", "Al-Jinn", "The Jinn", 28, "Meccan", 572, 29],
  [73, "المزمل", "Al-Muzzammil", "The Enshrouded One", 20, "Meccan", 574, 29],
  [74, "المدثر", "Al-Muddaththir", "The Cloaked One", 56, "Meccan", 575, 29],
  [75, "القيامة", "Al-Qiyamah", "The Resurrection", 40, "Meccan", 577, 29],
  [76, "الإنسان", "Al-Insan", "Man", 31, "Medinan", 578, 29],
  [77, "المرسلات", "Al-Mursalat", "The Emissaries", 50, "Meccan", 580, 29],
  [78, "النبأ", "An-Naba", "The Tidings", 40, "Meccan", 582, 30],
  [79, "النازعات", "An-Nazi'at", "Those Who Drag Forth", 46, "Meccan", 583, 30],
  [80, "عبس", "'Abasa", "He Frowned", 42, "Meccan", 585, 30],
  [81, "التكوير", "At-Takwir", "The Overthrowing", 29, "Meccan", 586, 30],
  [82, "الانفطار", "Al-Infitar", "The Cleaving", 19, "Meccan", 587, 30],
  [83, "المطففين", "Al-Mutaffifin", "Defrauding", 36, "Meccan", 587, 30],
  [84, "الانشقاق", "Al-Inshiqaq", "The Splitting Open", 25, "Meccan", 589, 30],
  [85, "البروج", "Al-Buruj", "The Mansions of the Stars", 22, "Meccan", 590, 30],
  [86, "الطارق", "At-Tariq", "The Morning Star", 17, "Meccan", 591, 30],
  [87, "الأعلى", "Al-A'la", "The Most High", 19, "Meccan", 591, 30],
  [88, "الغاشية", "Al-Ghashiyah", "The Overwhelming", 26, "Meccan", 592, 30],
  [89, "الفجر", "Al-Fajr", "The Dawn", 30, "Meccan", 593, 30],
  [90, "البلد", "Al-Balad", "The City", 20, "Meccan", 594, 30],
  [91, "الشمس", "Ash-Shams", "The Sun", 15, "Meccan", 595, 30],
  [92, "الليل", "Al-Layl", "The Night", 21, "Meccan", 595, 30],
  [95, "التين", "At-Tin", "The Fig", 8, "Meccan", 597, 30],
  [96, "العلق", "Al-'Alaq", "The Clot", 19, "Meccan", 597, 30],
  [98, "البينة", "Al-Bayyinah", "The Clear Evidence", 8, "Medinan", 598, 30],
  [99, "الزلزلة", "Az-Zalzalah", "The Earthquake", 8, "Medinan", 599, 30],
  [100, "العاديات", "Al-'Adiyat", "The Courser", 11, "Meccan", 599, 30],
  [101, "القارعة", "Al-Qari'ah", "The Calamity", 11, "Meccan", 600, 30],
  [102, "التكاثر", "At-Takathur", "The Rivalry in World Increase", 8, "Meccan", 600, 30],
  [104, "الهمزة", "Al-Humazah", "The Traducer", 9, "Meccan", 601, 30],
  [105, "الفيل", "Al-Fil", "The Elephant", 5, "Meccan", 601, 30],
  [106, "قريش", "Quraysh", "Quraysh", 4, "Meccan", 602, 30],
  [107, "الماعون", "Al-Ma'un", "Small Kindness", 7, "Meccan", 602, 30],
  [109, "الكافرون", "Al-Kafirun", "The Disbelievers", 6, "Meccan", 603, 30],
  [110, "النصر", "An-Nasr", "The Divine Support", 3, "Medinan", 603, 30],
  [111, "المسد", "Al-Masad", "The Palm Fibre", 5, "Meccan", 603, 30]
];

// Merge all surahs and sort by number 1-114
const existingNumbers = new Set(ALL_SURAHS.map(s => s.number));
SURAH_NAMES_ALL.forEach(([number, name, englishName, englishNameTranslation, numberOfAyahs, revelationType, page, juz]) => {
  if (!existingNumbers.has(number)) {
    ALL_SURAHS.push({
      number,
      name,
      englishName,
      englishNameTranslation,
      numberOfAyahs,
      revelationType,
      page,
      juz,
      tags: ["Quran", englishNameTranslation]
    });
  }
});

ALL_SURAHS.sort((a, b) => a.number - b.number);

// Built-in offline high-quality Surah content with multi-language translations (English & Uzbek)
export const PRELOADED_SURAHS: Record<number, SurahDetail> = {
  1: {
    number: 1,
    name: "الفاتحة",
    englishName: "Al-Fatihah",
    englishNameTranslation: "The Opening",
    numberOfAyahs: 7,
    revelationType: "Meccan",
    page: 1,
    juz: 1,
    bismillahPre: false,
    audioDurationMs: 46490,
    verseTimings: [
      {
        verseKey: "1:1",
        ayahNumber: 1,
        timestampFromMs: 0,
        timestampToMs: 6090,
        segments: [[1, 0, 580], [2, 580, 1409], [3, 1409, 2502], [4, 2502, 5840]]
      },
      {
        verseKey: "1:2",
        ayahNumber: 2,
        timestampFromMs: 6090,
        timestampToMs: 11680,
        segments: [[1, 6025, 7025], [2, 7025, 7885], [3, 7885, 8515], [4, 8515, 11550]]
      },
      {
        verseKey: "1:3",
        ayahNumber: 3,
        timestampFromMs: 11680,
        timestampToMs: 16300,
        segments: [[1, 11615, 12855], [2, 12855, 16180]]
      },
      {
        verseKey: "1:4",
        ayahNumber: 4,
        timestampFromMs: 16300,
        timestampToMs: 20950,
        segments: [[1, 16245, 17065], [2, 17065, 17665], [3, 17665, 20830]]
      },
      {
        verseKey: "1:5",
        ayahNumber: 5,
        timestampFromMs: 20950,
        timestampToMs: 27660,
        segments: [[1, 20885, 21875], [2, 21875, 22645], [3, 22645, 23765], [4, 23765, 27520]]
      },
      {
        verseKey: "1:6",
        ayahNumber: 6,
        timestampFromMs: 27660,
        timestampToMs: 33250,
        segments: [[1, 27585, 28325], [2, 28325, 29225], [3, 29225, 33110]]
      },
      {
        verseKey: "1:7",
        ayahNumber: 7,
        timestampFromMs: 33250,
        timestampToMs: 46490,
        segments: [[1, 33185, 33935], [2, 33935, 34855], [3, 34855, 35875], [4, 35875, 36805], [5, 36805, 37395], [6, 37395, 38565], [7, 38565, 39565], [8, 39565, 39855], [9, 39855, 46360]]
      }
    ],
    ayahs: [
      {
        numberInSurah: 1,
        number: 1,
        text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
        transliteration: "Bismillāhi r-raḥmāni r-raḥīm",
        translations: {
          en_sahih: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
          en_yusufali: "In the name of Allah, Most Gracious, Most Merciful.",
          uz_mansur: "Mehribon va rahmli Allohning nomi bilan (boshlayman).",
          ru_kuliev: "Во имя Аллаха, Милостивого, Милосердного!",
          ur_jalandhry: "شروع اللہ کا نام لے کر جو بڑا مہربان نہایت رحم والا ہے",
          fr_hamidullah: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux.",
          id_indonesian: "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang."
        },
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001001.mp3"
      },
      {
        numberInSurah: 2,
        number: 2,
        text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        translation: "[All] praise is [due] to Allah, Lord of the worlds -",
        transliteration: "Al-ḥamdu lillāhi rabbi l-'ālamīn",
        translations: {
          en_sahih: "[All] praise is [due] to Allah, Lord of the worlds -",
          en_yusufali: "Praise be to Allah, the Cherisher and Sustainer of the worlds;",
          uz_mansur: "Hamd olamlarning Robbi Allohgagina xosdir.",
          ru_kuliev: "Хвала Аллаху, Господу миров,",
          ur_jalandhry: "سب تعریف اللہ ہی کو (زیبا) ہے جو تمام جہانوں کا پالنے والا ہے",
          fr_hamidullah: "Louange à Allah, Seigneur de l'univers.",
          id_indonesian: "Segala puji bagi Allah, Tuhan seluruh alam."
        },
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001002.mp3"
      },
      {
        numberInSurah: 3,
        number: 3,
        text: "الرَّحْمَٰنِ الرَّحِيمِ",
        translation: "The Entirely Merciful, the Especially Merciful,",
        transliteration: "Ar-raḥmāni r-raḥīm",
        translations: {
          en_sahih: "The Entirely Merciful, the Especially Merciful,",
          en_yusufali: "Most Gracious, Most Merciful;",
          uz_mansur: "U Mehribon va Rahmlidir.",
          ru_kuliev: "Милостивому, Милосердному,",
          ur_jalandhry: "بڑا مہربان نہایت رحم کرنے والا",
          fr_hamidullah: "Le Tout Miséricordieux, le Très Miséricordieux,",
          id_indonesian: "Yang Maha Pengasih, Maha Penyayang."
        },
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001003.mp3"
      },
      {
        numberInSurah: 4,
        number: 4,
        text: "مَالِكِ يَوْمِ الدِّينِ",
        translation: "Sovereign of the Day of Recompense.",
        transliteration: "Māliki yawmi d-dīn",
        translations: {
          en_sahih: "Sovereign of the Day of Recompense.",
          en_yusufali: "Master of the Day of Judgment.",
          uz_mansur: "Jazo (qiyomat) kunining podshohi va egasidir.",
          ru_kuliev: "Властелину Дня воздаяния!",
          ur_jalandhry: "روز جزا کا مالک",
          fr_hamidullah: "Maître du Jour de la rétribution.",
          id_indonesian: "Pemilik hari pembalasan."
        },
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001004.mp3"
      },
      {
        numberInSurah: 5,
        number: 5,
        text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
        translation: "It is You we worship and You we ask for help.",
        transliteration: "Iyyāka na'budu wa-iyyāka nasta'īn",
        translations: {
          en_sahih: "It is You we worship and You we ask for help.",
          en_yusufali: "Thee do we worship, and Thine aid we seek.",
          uz_mansur: "Faqat Sengagina ibodat qilamiz va faqat Sendangina yordam so'raymiz.",
          ru_kuliev: "Тебе одному мы поклоняемся и Тебя одного молим о помощи.",
          ur_jalandhry: "(اے پروردگار) ہم تیری ہی عبادت کرتے ہیں اور تجھ ہی سے مدد مانگتے ہیں",
          fr_hamidullah: "C'est Toi [Seul] que nous adorons, et c'est Toi [Seul] dont nous implorons secours.",
          id_indonesian: "Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami mohon pertolongan."
        },
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001005.mp3"
      },
      {
        numberInSurah: 6,
        number: 6,
        text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
        translation: "Guide us to the straight path -",
        transliteration: "Ihdinā ṣ-ṣirāṭa l-mustaqīm",
        translations: {
          en_sahih: "Guide us to the straight path -",
          en_yusufali: "Show us the straight way,",
          uz_mansur: "Bizni to'g'ri yo'lga boshlagin.",
          ru_kuliev: "Веди нас прямым путём,",
          ur_jalandhry: "ہم کو سیدھے راستے پر چلا",
          fr_hamidullah: "Guide-nous dans le droit chemin,",
          id_indonesian: "Tunjukilah kami jalan yang lurus,"
        },
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001006.mp3"
      },
      {
        numberInSurah: 7,
        number: 7,
        text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
        translation: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.",
        transliteration: "Ṣirāṭa lladhīna an'amta 'alayhim ghayri l-maghḍūbi 'alayhim walā ḍ-ḍāllīn",
        translations: {
          en_sahih: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.",
          en_yusufali: "The way of those on whom Thou hast bestowed Thy Grace, those whose (portion) is not wrath, and who go not astray.",
          uz_mansur: "O'zing ne'mat berganlarning yo'liga, g'azabga uchraganlarning va adashganlarning yo'liga emas.",
          ru_kuliev: "путём тех, кого Ты облагодетельствовал, не тех, на кого пал гнев, и не заблудших.",
          ur_jalandhry: "ان لوگوں کے راستے جن پر تو اپنا فضل و کرم کرتا رہا نہ ان کے جن پر غصے ہوتا رہا اور نہ گمراہوں کے",
          fr_hamidullah: "Le chemin de ceux que Tu as comblés de faveurs, non pas de ceux qui ont encouru Ta colère, ni des égarés.",
          id_indonesian: "(yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat."
        },
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001007.mp3"
      }
    ]
  },
  67: {
    number: 67,
    name: "الملك",
    englishName: "Al-Mulk",
    englishNameTranslation: "The Sovereignty",
    numberOfAyahs: 30,
    revelationType: "Meccan",
    page: 562,
    juz: 29,
    bismillahPre: true,
    ayahs: [
      {
        numberInSurah: 1,
        number: 5242,
        text: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
        translation: "Blessed is He in whose hand is dominion, and He is over all things competent -",
        transliteration: "Tabāraka lladhī biyadihi l-mulku wahuwa 'alā kulli shay'in qadīr",
        translations: {
          en_sahih: "Blessed is He in whose hand is dominion, and He is over all things competent -",
          uz_mansur: "Hukmronlik qo'lida bo'lgan Zot buyuk va barakotlidir. U har bir narsaga qodirdir.",
          ru_kuliev: "Благословен Тот, в Чьей Руке власть, и Он способен на всякую вещь,",
          ur_jalandhry: "وہ (ذات) جس کے ہاتھ میں بادشاہی ہے بڑی برکت والی ہے اور وہ ہر چیز پر قادر ہے",
          fr_hamidullah: "Béni soit celui dans la main de qui est la royauté, et Il est Omnipotent."
        },
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/067001.mp3"
      },
      {
        numberInSurah: 2,
        number: 5243,
        text: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ",
        translation: "[He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving -",
        transliteration: "Alladhī khalaqa l-mawta wal-ḥayāta liyabluwakum ayyukum aḥsanu 'amalā, wahuwa l-'azīzu l-ghafūr",
        translations: {
          en_sahih: "[He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving -",
          uz_mansur: "U qaysilaringiz chiroyliroq amallarni qilishingizni sinash uchun o'lim va hayotni yaratgan Zotdir. U Qudratli va Kechirimli zotdir.",
          ru_kuliev: "Кто сотворил смерть и жизнь, чтобы испытать вас и увидеть, чьи деяния окажутся лучше. Он — Могущественный, Прощающий.",
          ur_jalandhry: "جس نے موت اور زندگی کو پیدا کیا تاکہ تمہاری آزمائش کرے کہ تم میں کون عمل کے لحاظ سے بہتر ہے اور وہ زبردست بخشنے والا ہے",
          fr_hamidullah: "Celui qui a créé la mort et la vie afin de vous éprouver (et de savoir) qui de vous est le meilleur en œuvre, et c'est Lui le Puissant, le Pardonneur."
        },
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/067002.mp3"
      },
      {
        numberInSurah: 3,
        number: 5244,
        text: "الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ",
        translation: "[And] who created seven heavens in layers. You see no flaw in the creation of the Most Merciful. So look again; do you see any rift?",
        transliteration: "Alladhī khalaqa sab'a samāwātin ṭibāqan, mā tarā fī khalqi r-raḥmāni min tafāwut, farji'i l-baṣara hal tarā min fuṭūr",
        translations: {
          en_sahih: "[And] who created seven heavens in layers. You see no flaw in the creation of the Most Merciful. So look again; do you see any rift?",
          uz_mansur: "U yetti osmonni qat-qat qilib yaratgandir. Mehribon Zotning yaratishida hech bir nomutanosiblikni ko'rmaysan. Yana bir bor qarab ko'r-chi, biror nuqson ko'rarmikansan?",
          ru_kuliev: "Он создал семь небес одно над другим. В творении Милостивого ты не увидишь никакой несообразности. Взгляни ещё раз. Видишь ли ты какую-нибудь трещину?",
          ur_jalandhry: "جس نے سات آسمان اوپر تلے بنائے، تو رحمٰن کی آفرینش میں کوئی نقص نہ دیکھے گا۔ آنکھ اٹھا کر دیکھ بھلا تجھ کو کوئی شگاف نظر آتا ہے؟",
          fr_hamidullah: "Celui qui a créé sept cieux superposés sans que tu voies de disproportion en la création du Tout Miséricordieux. Ramène [sur elle] le regard. Y vois-tu une brèche quelconque?"
        },
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/067003.mp3"
      }
    ]
  },
  112: {
    number: 112,
    name: "الإخلاص",
    englishName: "Al-Ikhlas",
    englishNameTranslation: "The Sincerity",
    numberOfAyahs: 4,
    revelationType: "Meccan",
    page: 604,
    juz: 30,
    bismillahPre: true,
    ayahs: [
      {
        numberInSurah: 1,
        number: 6222,
        text: "قُلْ هُوَ اللَّهُ أَحَدٌ",
        translation: "Say, \"He is Allah, [who is] One,",
        transliteration: "Qul huwa llāhu aḥad",
        translations: {
          en_sahih: "Say, \"He is Allah, [who is] One,",
          uz_mansur: "Ayting: «U Alloh Yagonadir.",
          ru_kuliev: "Скажи: «Он — Аллах Единый,",
          ur_jalandhry: "کہو کہ وہ اللہ ایک ہے",
          fr_hamidullah: "Dis: «Il est Allah, Unique."
        },
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/112001.mp3"
      },
      {
        numberInSurah: 2,
        number: 6223,
        text: "اللَّهُ الصَّمَدُ",
        translation: "Allah, the Eternal Refuge.",
        transliteration: "Allāhu ṣ-ṣamad",
        translations: {
          en_sahih: "Allah, the Eternal Refuge.",
          uz_mansur: "Alloh Somaddir (barcha hojatlar bilan qasd qilinuvchi, hech kimga muhtoj bo'lmagan Zotdir).",
          ru_kuliev: "Аллах Самодостаточный.",
          ur_jalandhry: "اللہ بے نیاز ہے",
          fr_hamidullah: "Allah, Le Seul à être imploré pour ce que nous désirons."
        },
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/112002.mp3"
      },
      {
        numberInSurah: 3,
        number: 6224,
        text: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
        translation: "He neither begets nor is born,",
        transliteration: "Lam yalid walam yūlad",
        translations: {
          en_sahih: "He neither begets nor is born,",
          uz_mansur: "U tug'magan va tug'ilmagan ham.",
          ru_kuliev: "Он не родил и не был рождён,",
          ur_jalandhry: "نہ اس کی کوئی اولاد ہے اور نہ وہ کسی کی اولاد ہے",
          fr_hamidullah: "Il n'a jamais engendré, n'a pas été engendré non plus."
        },
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/112003.mp3"
      },
      {
        numberInSurah: 4,
        number: 6225,
        text: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
        translation: "Nor is there to Him any equivalent.\"",
        transliteration: "Walam yakul-lahū kufuwan aḥad",
        translations: {
          en_sahih: "Nor is there to Him any equivalent.\"",
          uz_mansur: "Va Unga hech kim teng bo'lmagandir».",
          ru_kuliev: "и нет никого равного Ему».",
          ur_jalandhry: "اور کوئی اس کا ہمسر نہیں",
          fr_hamidullah: "Et nul n'est égal à Lui»."
        },
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/112004.mp3"
      }
    ]
  },
  113: {
    number: 113,
    name: "الفلق",
    englishName: "Al-Falaq",
    englishNameTranslation: "The Daybreak",
    numberOfAyahs: 5,
    revelationType: "Meccan",
    page: 604,
    juz: 30,
    bismillahPre: true,
    ayahs: [
      {
        numberInSurah: 1,
        number: 6226,
        text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
        translation: "Say, \"I seek refuge in the Lord of daybreak",
        transliteration: "Qul a'ūdhu bi-rabbi l-falaq",
        translations: {
          en_sahih: "Say, \"I seek refuge in the Lord of daybreak",
          uz_mansur: "Ayting: «Tong Robbidan panoh so'rayman,",
          ru_kuliev: "Скажи: «Прибегаю к защите Господа рассвета",
          ur_jalandhry: "کہو کہ میں صبح کے پروردگار کی پناہ مانگتا ہوں"
        },
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/113001.mp3"
      },
      {
        numberInSurah: 2,
        number: 6227,
        text: "مِن شَرِّ مَا خَلَقَ",
        translation: "From the evil of that which He created",
        transliteration: "Min sharri mā khalaq",
        translations: {
          en_sahih: "From the evil of that which He created",
          uz_mansur: "U yaratgan narsalarning yomonligidan,",
          ru_kuliev: "от зла того, что Он сотворил,",
          ur_jalandhry: "ہر چیز کی برائی سے جو اس نے پیدا کی"
        },
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/113002.mp3"
      },
      {
        numberInSurah: 3,
        number: 6228,
        text: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
        translation: "And from the evil of darkness when it settles",
        transliteration: "Wamin sharri ghāsiqin idhā waqab",
        translations: {
          en_sahih: "And from the evil of darkness when it settles",
          uz_mansur: "Va qorong'iligi kirgan tunning yomonligidan,",
          ru_kuliev: "от зла мрака, когда он наступает,",
          ur_jalandhry: "اور شب تاریک کی برائی سے جب اس کا اندھیرا چھا جائے"
        },
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/113003.mp3"
      },
      {
        numberInSurah: 4,
        number: 6229,
        text: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ",
        translation: "And from the evil of the blowers in knots",
        transliteration: "Wamin sharri n-naffāthāti fī l-'uqad",
        translations: {
          en_sahih: "And from the evil of the blowers in knots",
          uz_mansur: "Va tugunlarga dam soluvchilarning yomonligidan,",
          ru_kuliev: "от зла колдуний, дующих на узлы,",
          ur_jalandhry: "اور گنڈھوں پر دم کرنے والیوں کی برائی سے"
        },
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/113004.mp3"
      },
      {
        numberInSurah: 5,
        number: 6230,
        text: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
        translation: "And from the evil of an envier when he envies.\"",
        transliteration: "Wamin sharri ḥāsidin idhā ḥasad",
        translations: {
          en_sahih: "And from the evil of an envier when he envies.\"",
          uz_mansur: "Va hasadchining hasad qilgan paytdagi yomonligidan».",
          ru_kuliev: "от зла завистника, когда он завидует».",
          ur_jalandhry: "اور حسد کرنے والے کی برائی سے جب وہ حسد کرنے لگے"
        },
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/113005.mp3"
      }
    ]
  },
  114: {
    number: 114,
    name: "الناس",
    englishName: "An-Nas",
    englishNameTranslation: "Mankind",
    numberOfAyahs: 6,
    revelationType: "Meccan",
    page: 604,
    juz: 30,
    bismillahPre: true,
    ayahs: [
      {
        numberInSurah: 1,
        number: 6231,
        text: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
        translation: "Say, \"I seek refuge in the Lord of mankind,",
        transliteration: "Qul a'ūdhu bi-rabbi n-nās",
        translations: {
          en_sahih: "Say, \"I seek refuge in the Lord of mankind,",
          uz_mansur: "Ayting: «Odamlar Robbidan panoh so'rayman,",
          ru_kuliev: "Скажи: «Прибегаю к защите Господа людей,",
          ur_jalandhry: "کہو کہ میں لوگوں کے پروردگار کی پناہ مانگتا ہوں"
        },
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/114001.mp3"
      },
      {
        numberInSurah: 2,
        number: 6232,
        text: "مَلِكِ النَّاسِ",
        translation: "The Sovereign of mankind,",
        transliteration: "Maliki n-nās",
        translations: {
          en_sahih: "The Sovereign of mankind,",
          uz_mansur: "Odamlar Podshohidan,",
          ru_kuliev: "Царя людей,",
          ur_jalandhry: "(یعنی) لوگوں کے بادشاہ کی"
        },
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/114002.mp3"
      },
      {
        numberInSurah: 3,
        number: 6233,
        text: "إِلَٰهِ النَّاسِ",
        translation: "The God of mankind,",
        transliteration: "Ilāhi n-nās",
        translations: {
          en_sahih: "The God of mankind,",
          uz_mansur: "Odamlar Ilohidan,",
          ru_kuliev: "Бога людей,",
          ur_jalandhry: "لوگوں کے معبود برحق کی"
        },
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/114003.mp3"
      },
      {
        numberInSurah: 4,
        number: 6234,
        text: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
        translation: "From the evil of the retreating whisperer -",
        transliteration: "Min sharri l-waswāsi l-khannās",
        translations: {
          en_sahih: "From the evil of the retreating whisperer -",
          uz_mansur: "Yashirinib olib, vasvasa soluvchining yomonligidan,",
          ru_kuliev: "от зла искусителя отступающего (при поминании Аллаха),",
          ur_jalandhry: "(شیطان) وسوسہ انداز کی برائی سے جو (خدا کا نام سن کر) پیچھے ہٹ جاتا ہے"
        },
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/114004.mp3"
      },
      {
        numberInSurah: 5,
        number: 6235,
        text: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ",
        translation: "Who whispers into the breasts of mankind -",
        transliteration: "Alladhī yuwaswisu fī ṣudūri n-nās",
        translations: {
          en_sahih: "Who whispers into the breasts of mankind -",
          uz_mansur: "Odamlarning qalbiga vasvasa soladigan,",
          ru_kuliev: "который наущает в груди людей,",
          ur_jalandhry: "جو لوگوں کے دلوں میں وسوسے ڈالتا ہے"
        },
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/114005.mp3"
      },
      {
        numberInSurah: 6,
        number: 6236,
        text: "مِنَ الْجِنَّةِ وَالنَّاسِ",
        translation: "From among the jinn and mankind.\"",
        transliteration: "Mina l-jinnati wan-nās",
        translations: {
          en_sahih: "From among the jinn and mankind.\"",
          uz_mansur: "Jinlardan va insonlardan bo'lgan (shaytonning yomonligidan)» panoh so'rayman.",
          ru_kuliev: "от джиннов и людей».",
          ur_jalandhry: "وہ جنّات میں سے (ہو) یا انسانوں میں سے"
        },
        audioUrl: "https://everyayah.com/data/Alafasy_128kbps/114006.mp3"
      }
    ]
  }
};

export interface LocalizedSurahMeta {
  name: string;
  meaning: string;
}

const SURAH_TRANSLATIONS: Record<
  number,
  { uz: string; uzMeaning: string; ru: string; ruMeaning: string }
> = {
  1: { uz: 'Fotiha', uzMeaning: 'Ochuvchi', ru: 'Аль-Фатиха', ruMeaning: 'Открывающая' },
  2: { uz: 'Baqara', uzMeaning: 'Sigir', ru: 'Аль-Бакара', ruMeaning: 'Корова' },
  3: { uz: 'Oli Imron', uzMeaning: 'Imron xonadoni', ru: 'Али Имран', ruMeaning: 'Семейство Имрана' },
  4: { uz: 'Niso', uzMeaning: 'Ayollar', ru: 'Ан-Ниса', ruMeaning: 'Женщины' },
  5: { uz: 'Moida', uzMeaning: 'Dasturxon', ru: 'Аль-Маида', ruMeaning: 'Трапеза' },
  6: { uz: "An'om", uzMeaning: 'Chorva mollari', ru: 'Аль-Анам', ruMeaning: 'Скот' },
  7: { uz: "A'rof", uzMeaning: 'Balandliklar', ru: 'Аль-Араф', ruMeaning: 'Ограды' },
  8: { uz: 'Anfol', uzMeaning: "O'ljalar", ru: 'Аль-Анфаль', ruMeaning: 'Трофеи' },
  9: { uz: 'Tavba', uzMeaning: 'Tavba', ru: 'Ат-Тауба', ruMeaning: 'Покаяние' },
  10: { uz: 'Yunus', uzMeaning: 'Yunus payg‘ambar', ru: 'Юнус', ruMeaning: 'Йунус (Иона)' },
  11: { uz: 'Hud', uzMeaning: 'Hud payg‘ambar', ru: 'Худ', ruMeaning: 'Худ' },
  12: { uz: 'Yusuf', uzMeaning: 'Yusuf payg‘ambar', ru: 'Юсуф', ruMeaning: 'Йусуф (Иосиф)' },
  13: { uz: "Ra'd", uzMeaning: 'Momaqaldiroq', ru: 'Ар-Рад', ruMeaning: 'Гром' },
  14: { uz: 'Ibrohim', uzMeaning: 'Ibrohim payg‘ambar', ru: 'Ибрахим', ruMeaning: 'Ибрахим (Авраам)' },
  15: { uz: 'Hijr', uzMeaning: 'Toshli vodiy', ru: 'Аль-Хиджр', ruMeaning: 'Хиджр' },
  16: { uz: 'Nahl', uzMeaning: 'Asalari', ru: 'Ан-Нахль', ruMeaning: 'Пчёлы' },
  17: { uz: 'Isro', uzMeaning: 'Tungi sayr', ru: 'Аль-Исра', ruMeaning: 'Ночной перенос' },
  18: { uz: 'Kahf', uzMeaning: "G'or", ru: 'Аль-Кахф', ruMeaning: 'Пещера' },
  19: { uz: 'Maryam', uzMeaning: 'Bibi Maryam', ru: 'Марьям', ruMeaning: 'Марьям (Мария)' },
  20: { uz: 'Toha', uzMeaning: 'Toha', ru: 'Та Ха', ruMeaning: 'Та Ха' },
  21: { uz: 'Anbiyo', uzMeaning: 'Payg‘ambarlar', ru: 'Аль-Анбия', ruMeaning: 'Пророки' },
  22: { uz: 'Haj', uzMeaning: 'Haj ibodati', ru: 'Аль-Хадж', ruMeaning: 'Паломничество' },
  23: { uz: "Mu'minun", uzMeaning: "Mo'minlar", ru: 'Аль-Муминун', ruMeaning: 'Верующие' },
  24: { uz: 'Nur', uzMeaning: 'Nur', ru: 'Ан-Нур', ruMeaning: 'Свет' },
  25: { uz: 'Furqon', uzMeaning: 'Haq bilan botilni ajratuvchi', ru: 'Аль-Фуркан', ruMeaning: 'Различение' },
  26: { uz: 'Shuaro', uzMeaning: 'Shoirlar', ru: 'Аш-Шуара', ruMeaning: 'Поэты' },
  27: { uz: 'Naml', uzMeaning: 'Chumoli', ru: 'Ан-Намль', ruMeaning: 'Муравьи' },
  28: { uz: 'Qasas', uzMeaning: 'Qissalar', ru: 'Аль-Касас', ruMeaning: 'Рассказ' },
  29: { uz: 'Ankabut', uzMeaning: "O'rgimchak", ru: 'Аль-Анкабут', ruMeaning: 'Паук' },
  30: { uz: 'Rum', uzMeaning: 'Rimliklar', ru: 'Ар-Рум', ruMeaning: 'Римляне' },
  31: { uz: 'Luqmon', uzMeaning: 'Luqmoni Hakim', ru: 'Лукман', ruMeaning: 'Лукман' },
  32: { uz: 'Sajda', uzMeaning: 'Sajda', ru: 'Ас-Саджда', ruMeaning: 'Земной поклон' },
  33: { uz: 'Ahzob', uzMeaning: 'Firqalar', ru: 'Аль-Ахзаб', ruMeaning: 'Союзники' },
  34: { uz: "Saba'", uzMeaning: "Saba' qavmi", ru: 'Саба', ruMeaning: 'Саба (Сава)' },
  35: { uz: 'Fotir', uzMeaning: 'Yaratuvchi', ru: 'Фатыр', ruMeaning: 'Творец' },
  36: { uz: 'Yosin', uzMeaning: 'Yosin', ru: 'Йа Син', ruMeaning: 'Йа Син' },
  37: { uz: 'Soffat', uzMeaning: 'Saf tortuvchilar', ru: 'Ас-Саффат', ruMeaning: 'Выстроившиеся в ряды' },
  38: { uz: 'Sod', uzMeaning: 'Sod harfi', ru: 'Сад', ruMeaning: 'Сад' },
  39: { uz: 'Zumar', uzMeaning: 'Jamoatlar', ru: 'Аз-Зумар', ruMeaning: 'Толпы' },
  40: { uz: "G'ofir", uzMeaning: "Mag'firat qiluvchi", ru: 'Гафир', ruMeaning: 'Прощающий' },
  41: { uz: 'Fussilat', uzMeaning: 'Mufassal bayon qilingan', ru: 'Фуссилят', ruMeaning: 'Разъяснены' },
  42: { uz: 'Shuro', uzMeaning: 'Maslahat (Sho‘ro)', ru: 'Аш-Шура', ruMeaning: 'Совет' },
  43: { uz: 'Zuxruf', uzMeaning: 'Zeb-ziynat', ru: 'Аз-Зухруф', ruMeaning: 'Украшения' },
  44: { uz: 'Duxon', uzMeaning: 'Tutun', ru: 'Ад-Духан', ruMeaning: 'Дым' },
  45: { uz: 'Josiya', uzMeaning: 'Tiz cho‘kuvchi', ru: 'Аль-Джасия', ruMeaning: 'Коленопреклонённые' },
  46: { uz: 'Ahqof', uzMeaning: 'Qumtepalar', ru: 'Аль-Ахкаф', ruMeaning: 'Барханы' },
  47: { uz: 'Muhammad', uzMeaning: 'Muhammad payg‘ambar', ru: 'Мухаммад', ruMeaning: 'Мухаммад' },
  48: { uz: 'Fath', uzMeaning: "G'alaba", ru: 'Аль-Фатх', ruMeaning: 'Победа' },
  49: { uz: 'Hujurot', uzMeaning: 'Hujralar', ru: 'Аль-Худжурат', ruMeaning: 'Комнаты' },
  50: { uz: 'Qof', uzMeaning: 'Qof harfi', ru: 'Каф', ruMeaning: 'Каф' },
  51: { uz: 'Zoriyot', uzMeaning: 'Sochuvchi shamollar', ru: 'Аз-Зарият', ruMeaning: 'Рассеивающие прах' },
  52: { uz: 'Tur', uzMeaning: 'Tur tog‘i', ru: 'Ат-Тур', ruMeaning: 'Гора' },
  53: { uz: 'Najm', uzMeaning: 'Yulduz', ru: 'Ан-Наджм', ruMeaning: 'Звезда' },
  54: { uz: 'Qamar', uzMeaning: 'Oy', ru: 'Аль-Камар', ruMeaning: 'Месяц' },
  55: { uz: 'Rahmon', uzMeaning: 'Mehribon', ru: 'Ар-Рахман', ruMeaning: 'Милостивый' },
  56: { uz: 'Voqea', uzMeaning: 'Muqarrar voqea (Qiyomat)', ru: 'Аль-Вакиа', ruMeaning: 'Событие' },
  57: { uz: 'Hadid', uzMeaning: 'Temir', ru: 'Аль-Хадид', ruMeaning: 'Железо' },
  58: { uz: 'Mujodala', uzMeaning: 'Bahs-munozara', ru: 'Аль-Муджадиля', ruMeaning: 'Препирающаяся' },
  59: { uz: 'Hashr', uzMeaning: "To'planish", ru: 'Аль-Хашр', ruMeaning: 'Сбор' },
  60: { uz: 'Mumtahana', uzMeaning: 'Imtihon qilinuvchi ayol', ru: 'Аль-Мумтахана', ruMeaning: 'Испытуемая' },
  61: { uz: 'Sof', uzMeaning: 'Saf', ru: 'Ас-Сафф', ruMeaning: 'Ряды' },
  62: { uz: 'Juma', uzMeaning: 'Juma namozi', ru: 'Аль-Джумуа', ruMeaning: 'Собрание (Пятница)' },
  63: { uz: 'Munofiqun', uzMeaning: 'Munofiqlar', ru: 'Аль-Мунафикун', ruMeaning: 'Лицемеры' },
  64: { uz: "Tag'obun", uzMeaning: 'Ziyon ko‘rish', ru: 'Ат-Тагабун', ruMeaning: 'Взаимное обделение' },
  65: { uz: 'Taloq', uzMeaning: 'Taloq hukmlari', ru: 'Ат-Таляк', ruMeaning: 'Развод' },
  66: { uz: 'Tahrim', uzMeaning: 'Harom qilish', ru: 'Ат-Тахрим', ruMeaning: 'Запрещение' },
  67: { uz: 'Mulk', uzMeaning: 'Podshohlik (Mulk)', ru: 'Аль-Мульк', ruMeaning: 'Власть' },
  68: { uz: 'Qalam', uzMeaning: 'Qalam', ru: 'Аль-Калям', ruMeaning: 'Письменная трость' },
  69: { uz: 'Haaqqa', uzMeaning: 'Aniq ro‘y beruvchi', ru: 'Аль-Хакка', ruMeaning: 'Неминуемое' },
  70: { uz: "Ma'orij", uzMeaning: "Osmon pog'onalari", ru: 'Аль-Мааридж', ruMeaning: 'Ступени' },
  71: { uz: 'Nuh', uzMeaning: 'Nuh payg‘ambar', ru: 'Нух', ruMeaning: 'Нух (Ной)' },
  72: { uz: 'Jin', uzMeaning: 'Jinlar', ru: 'Аль-Джинн', ruMeaning: 'Джинны' },
  73: { uz: 'Muzzammil', uzMeaning: 'O‘ralib olgan', ru: 'Аль-Муззаммиль', ruMeaning: 'Закутавшийся' },
  74: { uz: 'Muddassir', uzMeaning: 'Burkanib olgan', ru: 'Аль-Муддассир', ruMeaning: 'Завернувшийся' },
  75: { uz: 'Qiyomat', uzMeaning: 'Qiyomat kuni', ru: 'Аль-Кияма', ruMeaning: 'Воскресение' },
  76: { uz: 'Inson', uzMeaning: 'Inson', ru: 'Аль-Инсан', ruMeaning: 'Человек' },
  77: { uz: 'Mursalot', uzMeaning: 'Yuborilgan shamollar', ru: 'Аль-Мурсалят', ruMeaning: 'Посылаемые' },
  78: { uz: "Naba'", uzMeaning: 'Ulug‘ xabar', ru: 'Ан-Наба', ruMeaning: 'Весть' },
  79: { uz: "Nazi'ot", uzMeaning: "Sug'urib oluvchi farishtalar", ru: 'Ан-Назиат', ruMeaning: 'Исторгающие' },
  80: { uz: 'Abasa', uzMeaning: 'Qosh chimirdi', ru: 'Абаса', ruMeaning: 'Нахмурился' },
  81: { uz: 'Takvir', uzMeaning: 'O‘ralish (Quyosh so‘nishi)', ru: 'Ат-Таквир', ruMeaning: 'Скручивание' },
  82: { uz: 'Infitor', uzMeaning: 'Yorilish', ru: 'Аль-Инфитар', ruMeaning: 'Раскалывание' },
  83: { uz: 'Mutoffifun', uzMeaning: "O'lchovdan urib qoluvchilar", ru: 'Аль-Мутаффифин', ruMeaning: 'Обвешивающие' },
  84: { uz: 'Inshiqoq', uzMeaning: 'Osmon yorilishi', ru: 'Аль-Иншикак', ruMeaning: 'Разверзнется' },
  85: { uz: 'Buruj', uzMeaning: 'Burjlar (Yulduzlar)', ru: 'Аль-Бурудж', ruMeaning: 'Созвездия' },
  86: { uz: 'Toriq', uzMeaning: 'Tungi yulduz', ru: 'Ат-Тарик', ruMeaning: 'Ночной путник' },
  87: { uz: "A'lo", uzMeaning: 'Eng oliy Zot', ru: 'Аль-Аля', ruMeaning: 'Всевышний' },
  88: { uz: "G'oshiya", uzMeaning: "O'rab oluvchi (Qiyomat)", ru: 'Аль-Гашия', ruMeaning: 'Покрывающее' },
  89: { uz: 'Fajr', uzMeaning: 'Tong', ru: 'Аль-Фаджр', ruMeaning: 'Заря' },
  90: { uz: 'Balad', uzMeaning: 'Shahar (Makka)', ru: 'Аль-Баляд', ruMeaning: 'Город' },
  91: { uz: 'Shams', uzMeaning: 'Quyosh', ru: 'Аш-Шамс', ruMeaning: 'Солнце' },
  92: { uz: 'Layl', uzMeaning: 'Kecha', ru: 'Аль-Лейль', ruMeaning: 'Ночь' },
  93: { uz: 'Zuho', uzMeaning: 'Choshgoh vaqti', ru: 'Ад-Духа', ruMeaning: 'Утро' },
  94: { uz: 'Sharh', uzMeaning: 'Qalbni kengaytirish', ru: 'Аш-Шарх', ruMeaning: 'Раскрытие' },
  95: { uz: 'Tin', uzMeaning: 'Anjir', ru: 'Ат-Тин', ruMeaning: 'Смоковница' },
  96: { uz: 'Alaq', uzMeaning: 'Laxta qon', ru: 'Аль-Аляк', ruMeaning: 'Сгусток' },
  97: { uz: 'Qadr', uzMeaning: 'Qadr kechasi', ru: 'Аль-Кадр', ruMeaning: 'Предопределение' },
  98: { uz: 'Bayyina', uzMeaning: 'Aniq hujjat', ru: 'Аль-Баййина', ruMeaning: 'Ясное знамение' },
  99: { uz: 'Zalzala', uzMeaning: 'Zilzila', ru: 'Аз-Зальзаля', ruMeaning: 'Сотрясение' },
  100: { uz: 'Odiyat', uzMeaning: 'Chopqir otlar', ru: 'Аль-Адият', ruMeaning: 'Скачущие' },
  101: { uz: "Qori'a", uzMeaning: 'Qalbni larzaga soluvchi', ru: 'Аль-Кариа', ruMeaning: 'Великое бедствие' },
  102: { uz: 'Takosur', uzMeaning: "Ko'paytirish musobaqasi", ru: 'Ат-Такасур', ruMeaning: 'Страсть к приумножению' },
  103: { uz: 'Asr', uzMeaning: 'Asr vaqti (Zamon)', ru: 'Аль-Аср', ruMeaning: 'Предвечернее время' },
  104: { uz: 'Humaza', uzMeaning: "G'iybatchi", ru: 'Аль-Хумаза', ruMeaning: 'Хулитель' },
  105: { uz: 'Fil', uzMeaning: 'Fil', ru: 'Аль-Филь', ruMeaning: 'Слон' },
  106: { uz: 'Quraysh', uzMeaning: 'Quraysh qabilasi', ru: 'Курайш', ruMeaning: 'Курайшиты' },
  107: { uz: "Mo'un", uzMeaning: 'Arzimagan yordam', ru: 'Аль-Маун', ruMeaning: 'Мелочь' },
  108: { uz: 'Kavsar', uzMeaning: 'Kavsar hovuzi (Ko‘p yaxshilik)', ru: 'Аль-Каусар', ruMeaning: 'Изобилие' },
  109: { uz: 'Kofirun', uzMeaning: 'Kofirlar', ru: 'Аль-Кафирун', ruMeaning: 'Неверующие' },
  110: { uz: 'Nasr', uzMeaning: 'Yordam (G‘alaba)', ru: 'Ан-Наср', ruMeaning: 'Помощь' },
  111: { uz: 'Masad', uzMeaning: 'Pishiq tola', ru: 'Аль-Масад', ruMeaning: 'Пальмовые волокна' },
  112: { uz: 'Ixlos', uzMeaning: 'Xolis iymon', ru: 'Аль-Ихляс', ruMeaning: 'Очищение веры' },
  113: { uz: 'Falaq', uzMeaning: 'Tong', ru: 'Аль-Фаляк', ruMeaning: 'Рассвет' },
  114: { uz: 'Nos', uzMeaning: 'Odamlar', ru: 'Ан-Нас', ruMeaning: 'Люди' },
};

import { latinToCyrillicUz } from '../utils/uzbekScript';
import { AppLanguage } from '../types';

export function getLocalizedSurahMeta(
  surahNumber: number,
  fallbackEnglishName: string,
  fallbackMeaning: string,
  language: AppLanguage
): LocalizedSurahMeta {
  const entry = SURAH_TRANSLATIONS[surahNumber];
  if (!entry || language === 'en') {
    return { name: fallbackEnglishName, meaning: fallbackMeaning };
  }
  if (language === 'uz_lat') {
    return { name: entry.uz, meaning: entry.uzMeaning };
  }
  if (language === 'uz_cyr') {
    return {
      name: latinToCyrillicUz(entry.uz),
      meaning: latinToCyrillicUz(entry.uzMeaning),
    };
  }
  return { name: entry.ru, meaning: entry.ruMeaning };
}

