import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  RotateCcw,
  HandHeart,
} from 'lucide-react';
import { JumaMinbarSunIcon, MushafIcon } from '../icons/IslamicFeatureIcons';
import { Coordinates, PrayerTimes } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { getCityCurrentDate } from '../../utils/prayerTimes';

interface JumaTabProps {
  prayerTimes: PrayerTimes;
  currentCity: Coordinates;
  onOpenSurah: (surahNumber: number, ayahNumber?: number) => void;
}

const CHECKLIST_STORAGE_KEY = 'nq_juma_checklist_v1';
const SALAWAT_STORAGE_KEY = 'nq_juma_salawat_v1';

interface SunnahItem {
  id: string;
  label: { uz_lat: string; uz_cyr: string; en: string; ru: string };
}

const JUMA_SUNNAHS: SunnahItem[] = [
  {
    id: 'ghusl',
    label: {
      uz_lat: 'G‘usl qilish va poklanish',
      uz_cyr: 'Ғусл қилиш ва покланиш',
      en: 'Perform Friday Ghusl (ritual bath)',
      ru: 'Совершить пятничное полное омовение (Гусль)',
    },
  },
  {
    id: 'clean_clothes',
    label: {
      uz_lat: 'Eng toza kiyim kiyish va xushbo‘y sepish',
      uz_cyr: 'Энг тоза кийим кийиш ва хушбўй сепиш',
      en: 'Wear clean/best clothes & apply perfume',
      ru: 'Надеть чистую одежду и нанести благовония',
    },
  },
  {
    id: 'miswak_nails',
    label: {
      uz_lat: 'Misvok ishlatish va tirnoq olish',
      uz_cyr: 'Мисвок ишлатиш ва тирноқ олиш',
      en: 'Use Miswak & trim nails',
      ru: 'Использовать сивак и подстричь ногти',
    },
  },
  {
    id: 'kahf',
    label: {
      uz_lat: 'Kahf surasini (18-sura) o‘qish',
      uz_cyr: 'Каҳф сурасини (18-сура) ўқиш',
      en: 'Recite Surah Al-Kahf (Surah 18)',
      ru: 'Прочитать суру Аль-Кахф (сура 18)',
    },
  },
  {
    id: 'early',
    label: {
      uz_lat: 'Masjidga erta va piyoda borish',
      uz_cyr: 'Масжидга эрта ва пиёда бориш',
      en: 'Go early to the Mosque (walking if possible)',
      ru: 'Отправиться в мечеть пораньше пешком',
    },
  },
  {
    id: 'khutbah',
    label: {
      uz_lat: 'Xutbani diqqat va sukunat bilan tinglash',
      uz_cyr: 'Хутбани диққат ва сукунат билан тинглаш',
      en: 'Listen quietly and attentively to the Khutbah',
      ru: 'Внимательно и молча слушать хутбу',
    },
  },
  {
    id: 'istijobah',
    label: {
      uz_lat: 'Asr va Shom orasida ijobat soatida duo qilish',
      uz_cyr: 'Аср ва Шом орасида ижобат соатида дуо қилиш',
      en: 'Make Dua in the special hour before Maghrib',
      ru: 'Сделать дуа в благословенный час перед Магрибом',
    },
  },
];

function computeIstijobahWindow(maghrib: string): string {
  const parts = maghrib.split(':').map(Number);
  if (parts.length !== 2 || Number.isNaN(parts[0]) || Number.isNaN(parts[1])) {
    return maghrib;
  }
  const endMins = parts[0] * 60 + parts[1];
  const startMins = Math.max(0, endMins - 45);
  const sh = String(Math.floor(startMins / 60)).padStart(2, '0');
  const sm = String(startMins % 60).padStart(2, '0');
  return `${sh}:${sm} – ${maghrib}`;
}

export const JumaTab: React.FC<JumaTabProps> = ({ prayerTimes, currentCity, onOpenSurah }) => {
  const { isDay } = useTheme();
  const { language } = useLanguage();

  const cityNow = getCityCurrentDate(new Date(), currentCity.timezone);
  const dayOfWeek = cityNow.getDay(); // 5 = Friday
  const isFriday = dayOfWeek === 5;
  const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7;

  // Cycle key tied to current week's Friday (YYYY-MM-DD)
  const fridayDateKey = useMemo(() => {
    const offset = isFriday ? 0 : (5 - dayOfWeek + 7) % 7;
    const fDate = new Date(cityNow.getFullYear(), cityNow.getMonth(), cityNow.getDate() + offset);
    return `${fDate.getFullYear()}-${String(fDate.getMonth() + 1).padStart(2, '0')}-${String(
      fDate.getDate()
    ).padStart(2, '0')}`;
  }, [cityNow, dayOfWeek, isFriday]);

  const todayKey = `${cityNow.getFullYear()}-${cityNow.getMonth() + 1}-${cityNow.getDate()}`;

  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(CHECKLIST_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { weekKey: string; items: Record<string, boolean> };
        if (parsed.weekKey === fridayDateKey && parsed.items) return parsed.items;
      }
    } catch {
      // Ignore storage error
    }
    return {};
  });

  const [salawatCount, setSalawatCount] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(SALAWAT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { dateKey: string; count: number };
        if (parsed.dateKey === todayKey) return parsed.count || 0;
      }
    } catch {
      // Ignore storage error
    }
    return 0;
  });

  const [salawatTarget, setSalawatTarget] = useState<100 | 300>(100);

  const toggleSunnah = (id: string) => {
    setCheckedIds((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(
          CHECKLIST_STORAGE_KEY,
          JSON.stringify({ weekKey: fridayDateKey, items: next })
        );
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const incrementSalawat = () => {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(12);
    }
    setSalawatCount((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem(SALAWAT_STORAGE_KEY, JSON.stringify({ dateKey: todayKey, count: next }));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const resetSalawat = () => {
    setSalawatCount(0);
    try {
      localStorage.setItem(SALAWAT_STORAGE_KEY, JSON.stringify({ dateKey: todayKey, count: 0 }));
    } catch {
      // Ignore
    }
  };

  const completedCount = JUMA_SUNNAHS.filter((s) => checkedIds[s.id]).length;
  const istijobahWindow = computeIstijobahWindow(prayerTimes.maghrib);

  const ui = {
    uz_lat: {
      heroBadge: isFriday ? 'Bugun Juma Muborak!' : `Jumagacha ${daysUntilFriday} kun`,
      heroTitle: 'Sayyidul Ayyom — Juma Rejimi',
      jumaTimeLabel: 'Juma (Peshin) vaqti',
      duaWindowLabel: 'Ijobat soati (Shomgacha)',
      kahfTitle: 'Kahf surasi (18-sura · 110 oyat)',
      kahfDesc: '«Kim Juma kuni Kahf surasini o‘qisa, ikki Juma oralig‘ida unga nur porlaydi.»',
      readKahfBtn: 'Kahf surasini o‘qish',
      checklistTitle: 'Juma sunnatlari ro‘yxati',
      salawatTitle: 'Juma Salovot Hisoblagichi',
      salawatTapHint: 'Salovot aytib bosing',
      goalPrefix: 'Maqsad:',
      arabicSalawat: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
      translitSalawat: 'Allohumma solli ‘ala Muhammadin va ‘ala ali Muhammad',
    },
    uz_cyr: {
      heroBadge: isFriday ? 'Бугун Жума Муборак!' : `Жумагача ${daysUntilFriday} кун`,
      heroTitle: 'Саййидул Айём — Жума Режими',
      jumaTimeLabel: 'Жума (Пешин) вақти',
      duaWindowLabel: 'Ижобат соати (Шомгача)',
      kahfTitle: 'Каҳф сураси (18-сура · 110 оят)',
      kahfDesc: '«Ким Жума куни Каҳф сурасини ўқиса, икки Жума оралиғида унга нур порлайди.»',
      readKahfBtn: 'Каҳф сурасини ўқиш',
      checklistTitle: 'Жума суннатлари рўйхати',
      salawatTitle: 'Жума Саловот Ҳисоблагичи',
      salawatTapHint: 'Саловот айтиб босинг',
      goalPrefix: 'Мақсад:',
      arabicSalawat: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
      translitSalawat: 'Аллоҳумма солли ъала Муҳаммадин ва ъала али Муҳаммад',
    },
    en: {
      heroBadge: isFriday ? 'Juma Mubarak Today!' : `${daysUntilFriday} days until Friday`,
      heroTitle: 'Juma Mode & Friday Sunnahs',
      jumaTimeLabel: 'Juma / Dhuhr Time',
      duaWindowLabel: 'Dua Acceptance Window',
      kahfTitle: 'Surah Al-Kahf (Surah 18 · 110 Ayahs)',
      kahfDesc: '“Whoever reads Surah Al-Kahf on Friday, a light will shine for them until the next Friday.”',
      readKahfBtn: 'Open Surah Al-Kahf',
      checklistTitle: 'Friday Sunnah Checklist',
      salawatTitle: 'Friday Salawat Counter',
      salawatTapHint: 'Tap after sending Salawat',
      goalPrefix: 'Goal:',
      arabicSalawat: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
      translitSalawat: 'Allahumma salli ‘ala Muhammadin wa ‘ala ali Muhammad',
    },
    ru: {
      heroBadge: isFriday ? 'Сегодня благословенная Джума!' : `До Джумы ${daysUntilFriday} дн.`,
      heroTitle: 'Режим Джума и Сунны пятницы',
      jumaTimeLabel: 'Время Джума / Зухр',
      duaWindowLabel: 'Час ответа на дуа',
      kahfTitle: 'Сура Аль-Кахф (сура 18 · 110 аятов)',
      kahfDesc: '«Кто прочитает суру Аль-Кахф в пятницу, того озарит свет до следующей пятницы.»',
      readKahfBtn: 'Читать суру Аль-Кахф',
      checklistTitle: 'Чек-лист сунн пятницы',
      salawatTitle: 'Счётчик Салаватов',
      salawatTapHint: 'Нажимайте при чтении салата',
      goalPrefix: 'Цель:',
      arabicSalawat: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
      translitSalawat: 'Аллахумма салли ‘аля Мухаммадин ва ‘аля али Мухаммад',
    },
  }[language];

  const cardCls = isDay
    ? 'bg-white border border-[#dde3ea] rounded-2xl p-4 shadow-xs'
    : 'bg-slate-900/90 border border-emerald-900/50 rounded-2xl p-4';

  return (
    <div className="space-y-3 pb-4">
      {/* Juma Hero Card */}
      <div
        className={`rounded-3xl p-4 border text-white ${
          isDay
            ? 'bg-gradient-to-br from-[#0c5007] via-[#157a17] to-[#2e8537] border-[#0c4703] nq-keep-dark shadow-md'
            : 'bg-gradient-to-br from-[#07291F] via-[#0B3B1F] to-[#1a1a2e] border-amber-500/35 shadow-xl'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-bold">
            <JumaMinbarSunIcon className="w-3.5 h-3.5" />
            <span>{ui.heroBadge}</span>
          </span>
        </div>

        <h2 className="font-display text-lg font-bold leading-snug">{ui.heroTitle}</h2>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="p-2.5 rounded-xl bg-black/25 border border-white/15">
            <span className="text-[10px] text-white/75 block">{ui.jumaTimeLabel}</span>
            <span className="text-base font-bold text-[#d0f39f] tabular-nums">{prayerTimes.dhuhr}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-black/25 border border-white/15">
            <span className="text-[10px] text-white/75 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-300" />
              <span>{ui.duaWindowLabel}</span>
            </span>
            <span className="text-sm font-bold text-amber-300 tabular-nums">{istijobahWindow}</span>
          </div>
        </div>
      </div>

      {/* 1-Tap Surah Al-Kahf Card */}
      <div className={cardCls}>
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isDay
                ? 'bg-[#eef9ea] text-[#158509] border border-[#c5e8bc]'
                : 'bg-emerald-950 text-amber-400 border border-emerald-800/60'
            }`}
          >
            <MushafIcon className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className={`text-sm font-bold ${isDay ? 'text-slate-900' : 'text-white'}`}>
              {ui.kahfTitle}
            </h3>
            <p className={`text-[11.5px] leading-relaxed mt-1 ${isDay ? 'text-slate-600' : 'text-slate-300'}`}>
              {ui.kahfDesc}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenSurah(18, 1)}
          className={`w-full mt-3 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-[0.99] ${
            isDay
              ? 'bg-[#158509] hover:bg-[#0c5007] text-white nq-keep-dark'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
          }`}
        >
          <MushafIcon className="w-4 h-4" />
          <span>{ui.readKahfBtn}</span>
        </button>
      </div>

      {/* Friday Sunnah Checklist */}
      <div className={cardCls}>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isDay ? 'text-[#0c4703]' : 'text-amber-400'}`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>{ui.checklistTitle}</span>
          </h3>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-bold tabular-nums ${
              isDay ? 'bg-[#eef9ea] text-[#0c4703]' : 'bg-emerald-950 text-amber-300'
            }`}
          >
            {completedCount} / {JUMA_SUNNAHS.length}
          </span>
        </div>

        <div className="w-full h-1.5 rounded-full overflow-hidden mb-3 bg-slate-200 dark:bg-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isDay ? 'bg-[#158509]' : 'bg-amber-400'
            }`}
            style={{ width: `${Math.round((completedCount / JUMA_SUNNAHS.length) * 100)}%` }}
          />
        </div>

        <div className="space-y-2">
          {JUMA_SUNNAHS.map((item) => {
            const done = Boolean(checkedIds[item.id]);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleSunnah(item.id)}
                className={`w-full text-left p-2.5 rounded-xl border flex items-center gap-2.5 transition ${
                  done
                    ? isDay
                      ? 'bg-[#eef9ea] border-[#9fd893] text-[#0c4703]'
                      : 'bg-emerald-950/60 border-emerald-700/70 text-emerald-200'
                    : isDay
                    ? 'bg-[#f8fafc] border-[#e2e8f0] text-slate-800'
                    : 'bg-slate-950/60 border-slate-800 text-slate-200'
                }`}
              >
                {done ? (
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${isDay ? 'text-[#158509]' : 'text-amber-400'}`} />
                ) : (
                  <Circle className="w-4 h-4 shrink-0 text-slate-400" />
                )}
                <span className={`text-xs font-semibold ${done ? 'line-through opacity-80' : ''}`}>
                  {item.label[language] || item.label.uz_lat}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Salawat Counter */}
      <div className={cardCls}>
        <div className="flex items-center justify-between gap-2 mb-2">
          <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isDay ? 'text-[#0c4703]' : 'text-amber-400'}`}>
            <HandHeart className="w-3.5 h-3.5" />
            <span>{ui.salawatTitle}</span>
          </h3>

          <div className="flex items-center gap-1">
            {([100, 300] as const).map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => setSalawatTarget(goal)}
                className={`px-2 py-0.5 rounded-lg text-[10.5px] font-bold ${
                  salawatTarget === goal
                    ? isDay
                      ? 'bg-[#158509] text-white nq-keep-dark'
                      : 'bg-amber-500 text-slate-950'
                    : isDay
                    ? 'bg-[#ecf1f5] text-slate-600'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {goal}
              </button>
            ))}
            <button
              type="button"
              onClick={resetSalawat}
              className={`p-1 rounded-lg ${isDay ? 'text-slate-500 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800'}`}
              aria-label="Reset Salawat counter"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div
          className={`p-3 rounded-xl border mb-3 ${
            isDay ? 'bg-[#f6fbf4] border-[#d7f0cb]' : 'bg-slate-950/70 border-emerald-900/50'
          }`}
        >
          <p
            dir="rtl"
            className={`font-arabic text-lg text-center leading-loose ${
              isDay ? 'text-[#0c4703]' : 'text-amber-300'
            }`}
          >
            {ui.arabicSalawat}
          </p>
          <p className={`text-[11px] text-center mt-1 ${isDay ? 'text-slate-600' : 'text-slate-300'}`}>
            {ui.translitSalawat}
          </p>
        </div>

        <button
          type="button"
          onClick={incrementSalawat}
          className={`w-full py-3.5 px-4 rounded-2xl font-bold flex items-center justify-between transition active:scale-[0.98] ${
            isDay
              ? 'bg-[#158509] hover:bg-[#0c5007] text-white nq-keep-dark shadow-sm'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm'
          }`}
        >
          <span className="text-xs">{ui.salawatTapHint}</span>
          <span className="text-xl font-extrabold tabular-nums">
            {salawatCount} <span className="text-xs opacity-75">/ {salawatTarget}</span>
          </span>
        </button>
      </div>
    </div>
  );
};
