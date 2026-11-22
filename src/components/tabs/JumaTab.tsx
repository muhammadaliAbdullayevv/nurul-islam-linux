import React, { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Check,
  CheckCircle2,
  Circle,
  Clock,
  Eye,
  EyeOff,
  HandHeart,
  Plus,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { JumaMinbarSunIcon, MushafIcon } from '../icons/IslamicFeatureIcons';
import { AppLanguage, Coordinates, PrayerTimes } from '../../types';
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
const PROFILE_STORAGE_KEY = 'nq_juma_profile_v1';
const CUSTOM_CONFIG_STORAGE_KEY = 'nq_juma_custom_config_v1';

type JumaProfileMode = 'men' | 'women';

interface LocalizedLabel {
  uz_lat: string;
  uz_cyr: string;
  en: string;
  ru: string;
}

interface PresetSunnahItem {
  id: string;
  label: LocalizedLabel;
}

interface CustomTaskItem {
  id: string;
  text: string;
}

interface ProfileChecklistConfig {
  hiddenIds: string[];
  customItems: CustomTaskItem[];
  orderIds: string[];
}

type AllProfileConfigs = Record<JumaProfileMode, ProfileChecklistConfig>;

const MEN_JUMA_SUNNAHS: PresetSunnahItem[] = [
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
    id: 'salawat',
    label: {
      uz_lat: 'Payg‘ambarimizga ﷺ ko‘p salovot aytish',
      uz_cyr: 'Пайғамбаримизга ﷺ кўп саловот айтиш',
      en: 'Send abundant Salawat upon the Prophet ﷺ',
      ru: 'Многократно читать салават Пророку ﷺ',
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

const WOMEN_JUMA_SUNNAHS: PresetSunnahItem[] = [
  {
    id: 'w_ghusl_nails',
    label: {
      uz_lat: 'G‘usl qilish, poklanish va tirnoq olish',
      uz_cyr: 'Ғусл қилиш, покланиш ва тирноқ олиш',
      en: 'Perform Ghusl, purify & trim nails',
      ru: 'Совершить Гусль, очиститься и подстричь ногти',
    },
  },
  {
    id: 'w_clean_home',
    label: {
      uz_lat: 'Uyda eng toza va ozoda libos kiyish',
      uz_cyr: 'Уйда энг тоза ва озода либос кийиш',
      en: 'Wear clean, neat clothes at home',
      ru: 'Надеть чистую и опрятную одежду дома',
    },
  },
  {
    id: 'w_kahf',
    label: {
      uz_lat: 'Kahf surasini (18-sura) o‘qish',
      uz_cyr: 'Каҳф сурасини (18-сура) ўқиш',
      en: 'Recite Surah Al-Kahf (Surah 18)',
      ru: 'Прочитать суру Аль-Кахф (сура 18)',
    },
  },
  {
    id: 'w_dhuhr_home',
    label: {
      uz_lat: 'Peshin namozini uyda o‘z vaqtida xushu bilan o‘qish',
      uz_cyr: 'Пешин намозини уйда ўз вақтида хушу билан ўқиш',
      en: 'Pray Dhuhr at home on time with Khushu',
      ru: 'Совершить намаз Зухр дома вовремя со смирением',
    },
  },
  {
    id: 'w_salawat',
    label: {
      uz_lat: 'Payg‘ambarimizga ﷺ ko‘p salovot aytish',
      uz_cyr: 'Пайғамбаримизга ﷺ кўп саловот айтиш',
      en: 'Send abundant Salawat upon the Prophet ﷺ',
      ru: 'Многократно читать салават Пророку ﷺ',
    },
  },
  {
    id: 'w_family_sadaqah',
    label: {
      uz_lat: 'Ota-ona, oila va yaqinlarga mehr va sadaqa ulashish',
      uz_cyr: 'Ота-она, оила ва яқинларга меҳр ва садақа улашиш',
      en: 'Share charity & kindness with parents and family',
      ru: 'Дать садаку и проявить заботу к родителям и семье',
    },
  },
  {
    id: 'w_istijobah',
    label: {
      uz_lat: 'Asr va Shom orasida ijobat soatida duo qilish',
      uz_cyr: 'Аср ва Шом орасида ижобат соатида дуо қилиш',
      en: 'Make Dua in the special hour before Maghrib',
      ru: 'Сделать дуа в благословенный час перед Магрибом',
    },
  },
];

const QUICK_SUGGESTIONS: LocalizedLabel[] = [
  {
    uz_lat: 'Sadaqa berish',
    uz_cyr: 'Садақа бериш',
    en: 'Give Friday Sadaqah',
    ru: 'Дать пятничную садаку',
  },
  {
    uz_lat: 'Ota-onaga qo‘ng‘iroq qilish / hol so‘rash',
    uz_cyr: 'Ота-онага қўнғироқ қилиш / ҳол сўраш',
    en: 'Call or visit parents',
    ru: 'Позвонить или навестить родителей',
  },
  {
    uz_lat: 'Yosin yoki Mulk surasini o‘qish',
    uz_cyr: 'Ёсин ёки Мулк сурасини ўқиш',
    en: 'Recite Surah Ya-Sin or Al-Mulk',
    ru: 'Прочитать суру Ясин или Аль-Мульк',
  },
  {
    uz_lat: 'O‘tganlar haqqiga duo va istig‘for aytish',
    uz_cyr: 'Ўтганлар ҳаққига дуо ва истиғфор айтиш',
    en: 'Make Dua for deceased loved ones',
    ru: 'Сделать дуа за ушедших близких',
  },
];

function createDefaultConfig(mode: JumaProfileMode): ProfileChecklistConfig {
  const presets = mode === 'women' ? WOMEN_JUMA_SUNNAHS : MEN_JUMA_SUNNAHS;
  return {
    hiddenIds: [],
    customItems: [],
    orderIds: presets.map((p) => p.id),
  };
}

function loadSavedProfile(): JumaProfileMode {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw === 'women' || raw === 'men') return raw;
  } catch {
    // ignore
  }
  return 'men';
}

function sanitizeProfileConfig(
  mode: JumaProfileMode,
  raw?: Partial<ProfileChecklistConfig>
): ProfileChecklistConfig {
  const def = createDefaultConfig(mode);
  if (!raw) return def;

  const presetIds = new Set(def.orderIds);
  const hiddenIds = Array.isArray(raw.hiddenIds)
    ? Array.from(new Set(raw.hiddenIds.filter((id): id is string => typeof id === 'string' && presetIds.has(id))))
    : [];

  const customItems: CustomTaskItem[] = Array.isArray(raw.customItems)
    ? raw.customItems
        .filter(
          (it): it is CustomTaskItem =>
            Boolean(it) &&
            typeof it.id === 'string' &&
            typeof it.text === 'string' &&
            it.text.trim().length > 0
        )
        .map((it) => ({ id: it.id, text: it.text.trim().slice(0, 120) }))
    : [];

  const validAll = new Set<string>([...presetIds, ...customItems.map((c) => c.id)]);
  const seen = new Set<string>();
  const cleanedOrder = Array.isArray(raw.orderIds)
    ? raw.orderIds.filter((id): id is string => {
        if (typeof id !== 'string' || !validAll.has(id) || seen.has(id)) return false;
        seen.add(id);
        return true;
      })
    : [];

  for (const id of validAll) {
    if (!seen.has(id)) {
      cleanedOrder.push(id);
    }
  }

  return {
    hiddenIds,
    customItems,
    orderIds: cleanedOrder,
  };
}

function loadAllConfigs(): AllProfileConfigs {
  try {
    const raw = localStorage.getItem(CUSTOM_CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AllProfileConfigs>;
      return {
        men: sanitizeProfileConfig('men', parsed.men),
        women: sanitizeProfileConfig('women', parsed.women),
      };
    }
  } catch {
    // ignore
  }
  return {
    men: createDefaultConfig('men'),
    women: createDefaultConfig('women'),
  };
}

function saveAllConfigs(next: AllProfileConfigs): void {
  try {
    localStorage.setItem(CUSTOM_CONFIG_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

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

  const [profileMode, setProfileMode] = useState<JumaProfileMode>(() => loadSavedProfile());
  const [allConfigs, setAllConfigs] = useState<AllProfileConfigs>(() => loadAllConfigs());
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [newTaskText, setNewTaskText] = useState<string>('');

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

  const handleSwitchProfile = (nextMode: JumaProfileMode) => {
    setProfileMode(nextMode);
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, nextMode);
    } catch {
      // ignore
    }
  };

  const updateCurrentConfig = (updater: (cur: ProfileChecklistConfig) => ProfileChecklistConfig) => {
    setAllConfigs((prev) => {
      const updated: AllProfileConfigs = {
        ...prev,
        [profileMode]: updater(prev[profileMode]),
      };
      saveAllConfigs(updated);
      return updated;
    });
  };

  const currentConfig = allConfigs[profileMode];
  const activePresets = profileMode === 'women' ? WOMEN_JUMA_SUNNAHS : MEN_JUMA_SUNNAHS;

  const resolvedAllItems = useMemo(() => {
    const presetMap = new Map<string, PresetSunnahItem>();
    for (const p of activePresets) presetMap.set(p.id, p);
    const customMap = new Map<string, CustomTaskItem>();
    for (const c of currentConfig.customItems) customMap.set(c.id, c);

    const hiddenSet = new Set(currentConfig.hiddenIds);
    const out: Array<{
      id: string;
      text: string;
      isCustom: boolean;
      hidden: boolean;
    }> = [];

    for (const id of currentConfig.orderIds) {
      const preset = presetMap.get(id);
      if (preset) {
        out.push({
          id,
          text: preset.label[language] || preset.label.uz_lat,
          isCustom: false,
          hidden: hiddenSet.has(id),
        });
        continue;
      }
      const custom = customMap.get(id);
      if (custom) {
        out.push({
          id,
          text: custom.text,
          isCustom: true,
          hidden: false,
        });
      }
    }
    return out;
  }, [activePresets, currentConfig, language]);

  const visibleItems = useMemo(
    () => resolvedAllItems.filter((it) => !it.hidden),
    [resolvedAllItems]
  );

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

  const handleAddCustomTask = (rawText?: string) => {
    const text = (rawText ?? newTaskText).trim().slice(0, 120);
    if (!text) return;
    const exists = resolvedAllItems.some(
      (it) => !it.hidden && it.text.toLowerCase() === text.toLowerCase()
    );
    if (exists) {
      if (rawText === undefined) setNewTaskText('');
      return;
    }
    const id = `custom_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    updateCurrentConfig((cur) => ({
      ...cur,
      customItems: [...cur.customItems, { id, text }],
      orderIds: [...cur.orderIds, id],
    }));
    if (rawText === undefined) setNewTaskText('');
  };

  const handleTogglePresetVisibility = (id: string) => {
    updateCurrentConfig((cur) => {
      const isHidden = cur.hiddenIds.includes(id);
      return {
        ...cur,
        hiddenIds: isHidden ? cur.hiddenIds.filter((x) => x !== id) : [...cur.hiddenIds, id],
      };
    });
  };

  const handleDeleteCustomTask = (id: string) => {
    updateCurrentConfig((cur) => ({
      ...cur,
      customItems: cur.customItems.filter((c) => c.id !== id),
      orderIds: cur.orderIds.filter((x) => x !== id),
    }));
  };

  const handleMoveItem = (id: string, dir: -1 | 1) => {
    updateCurrentConfig((cur) => {
      const idx = cur.orderIds.indexOf(id);
      const targetIdx = idx + dir;
      if (idx < 0 || targetIdx < 0 || targetIdx >= cur.orderIds.length) return cur;
      const nextOrder = [...cur.orderIds];
      const [moved] = nextOrder.splice(idx, 1);
      nextOrder.splice(targetIdx, 0, moved);
      return { ...cur, orderIds: nextOrder };
    });
  };

  const handleResetChecklistConfig = () => {
    updateCurrentConfig(() => createDefaultConfig(profileMode));
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

  const completedCount = visibleItems.filter((s) => checkedIds[s.id]).length;
  const totalCount = visibleItems.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const istijobahWindow = computeIstijobahWindow(prayerTimes.maghrib);

  const ui = (
    {
      uz_lat: {
        heroBadge: isFriday ? 'Bugun Juma Muborak!' : `Jumagacha ${daysUntilFriday} kun`,
        heroTitle: 'Sayyidul Ayyom — Juma Rejimi',
        jumaTimeLabel: profileMode === 'women' ? 'Peshin (Juma kuni)' : 'Juma (Peshin) vaqti',
        duaWindowLabel: 'Ijobat soati (Shomgacha)',
        kahfTitle: 'Kahf surasi (18-sura · 110 oyat)',
        kahfDesc: '«Kim Juma kuni Kahf surasini o‘qisa, ikki Juma oralig‘ida unga nur porlaydi.»',
        readKahfBtn: 'Kahf surasini o‘qish',
        checklistTitle: 'Juma sunnatlari ro‘yxati',
        menTab: 'Erkaklar uchun',
        womenTab: 'Ayollar uchun',
        womenNote:
          'Hanafiy mazhabida ayollarga Juma namozi farz emas — uyda Peshin namozi, Kahf surasi, salovot va duolar bilan Jumaning to‘liq fazilatiga erishiladi.',
        customizeBtn: 'Moslash',
        doneBtn: 'Tayyor',
        resetBtn: 'Standart',
        addPlaceholder: 'Yangi Juma vazifasini yozing...',
        addBtn: 'Qo‘shish',
        suggestionsLabel: 'Tez qo‘shish:',
        hiddenTag: 'Yashirilgan',
        customTag: 'Shaxsiy',
        emptyHint: 'Hamma vazifalar yashirilgan — "Moslash" orqali qo‘shing yoki yoqing.',
        salawatTitle: 'Juma Salovot Hisoblagichi',
        salawatTapHint: 'Salovot aytib bosing',
        arabicSalawat: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
        translitSalawat: 'Allohumma solli ‘ala Muhammadin va ‘ala ali Muhammad',
      },
      uz_cyr: {
        heroBadge: isFriday ? 'Бугун Жума Муборак!' : `Жумагача ${daysUntilFriday} кун`,
        heroTitle: 'Саййидул Айём — Жума Режими',
        jumaTimeLabel: profileMode === 'women' ? 'Пешин (Жума куни)' : 'Жума (Пешин) вақти',
        duaWindowLabel: 'Ижобат соати (Шомгача)',
        kahfTitle: 'Каҳф сураси (18-сура · 110 оят)',
        kahfDesc: '«Ким Жума куни Каҳф сурасини ўқиса, икки Жума оралиғида унга нур порлайди.»',
        readKahfBtn: 'Каҳф сурасини ўқиш',
        checklistTitle: 'Жума суннатлари рўйхати',
        menTab: 'Эркаклар учун',
        womenTab: 'Аёллар учун',
        womenNote:
          'Ҳанафий мазҳабида аёлларга Жума намози фарз эмас — уйда Пешин намози, Каҳф сураси, саловот ва дуолар билан Жуманинг тўлиқ фазилатига эришилади.',
        customizeBtn: 'Мослаш',
        doneBtn: 'Тайёр',
        resetBtn: 'Стандарт',
        addPlaceholder: 'Янги Жума вазифасини ёзинг...',
        addBtn: 'Қўшиш',
        suggestionsLabel: 'Тез қўшиш:',
        hiddenTag: 'Яширилган',
        customTag: 'Шахсий',
        emptyHint: 'Ҳамма вазифалар яширилган — «Мослаш» орқали қўшинг ёки ёқинг.',
        salawatTitle: 'Жума Саловот Ҳисоблагичи',
        salawatTapHint: 'Саловот айтиб босинг',
        arabicSalawat: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
        translitSalawat: 'Аллоҳумма солли ъала Муҳаммадин ва ъала али Муҳаммад',
      },
      en: {
        heroBadge: isFriday ? 'Juma Mubarak Today!' : `${daysUntilFriday} days until Friday`,
        heroTitle: 'Juma Mode & Friday Sunnahs',
        jumaTimeLabel: profileMode === 'women' ? 'Dhuhr Time (Friday)' : 'Juma / Dhuhr Time',
        duaWindowLabel: 'Dua Acceptance Window',
        kahfTitle: 'Surah Al-Kahf (Surah 18 · 110 Ayahs)',
        kahfDesc: '“Whoever reads Surah Al-Kahf on Friday, a light will shine for them until the next Friday.”',
        readKahfBtn: 'Open Surah Al-Kahf',
        checklistTitle: 'Friday Sunnah Checklist',
        menTab: 'For Men',
        womenTab: 'For Women',
        womenNote:
          'In the Hanafi school, Juma congregation is not obligatory for women — praying Dhuhr at home with Surah Al-Kahf, Salawat, charity & Dua brings the full blessings of Friday.',
        customizeBtn: 'Customize',
        doneBtn: 'Done',
        resetBtn: 'Reset',
        addPlaceholder: 'Add your own Friday task...',
        addBtn: 'Add',
        suggestionsLabel: 'Quick add:',
        hiddenTag: 'Hidden',
        customTag: 'Custom',
        emptyHint: 'All tasks are hidden — tap Customize to enable or add tasks.',
        salawatTitle: 'Friday Salawat Counter',
        salawatTapHint: 'Tap after sending Salawat',
        arabicSalawat: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
        translitSalawat: 'Allahumma salli ‘ala Muhammadin wa ‘ala ali Muhammad',
      },
      ru: {
        heroBadge: isFriday ? 'Сегодня благословенная Джума!' : `До Джумы ${daysUntilFriday} дн.`,
        heroTitle: 'Режим Джума и Сунны пятницы',
        jumaTimeLabel: profileMode === 'women' ? 'Время Зухр (пятница)' : 'Время Джума / Зухр',
        duaWindowLabel: 'Час ответа на дуа',
        kahfTitle: 'Сура Аль-Кахф (сура 18 · 110 аятов)',
        kahfDesc: '«Кто прочитает суру Аль-Кахф в пятницу, того озарит свет до следующей пятницы.»',
        readKahfBtn: 'Читать суру Аль-Кахф',
        checklistTitle: 'Чек-лист сунн пятницы',
        menTab: 'Для мужчин',
        womenTab: 'Для женщин',
        womenNote:
          'В ханафитском мазхабе пятничный намаз в мечети не обязателен для женщин — совершение Зухра дома, сура Аль-Кахф, салаваты и дуа даруют полную благодать пятницы.',
        customizeBtn: 'Настроить',
        doneBtn: 'Готово',
        resetBtn: 'Сброс',
        addPlaceholder: 'Добавить свою задачу на пятницу...',
        addBtn: 'Добавить',
        suggestionsLabel: 'Быстро добавить:',
        hiddenTag: 'Скрыто',
        customTag: 'Своя',
        emptyHint: 'Все задачи скрыты — нажмите «Настроить», чтобы включить или добавить.',
        salawatTitle: 'Счётчик Салаватов',
        salawatTapHint: 'Нажимайте при чтении салата',
        arabicSalawat: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
        translitSalawat: 'Аллахумма салли ‘аля Мухаммадин ва ‘аля али Мухаммад',
      },
    } as Record<AppLanguage, Record<string, string>>
  )[language];

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

      {/* Customizable Friday Sunnah Checklist (Men / Women Presets + Personal Tasks) */}
      <div className={cardCls}>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <h3
            className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 min-w-0 ${
              isDay ? 'text-[#0c4703]' : 'text-amber-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{ui.checklistTitle}</span>
          </h3>

          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold tabular-nums ${
                isDay ? 'bg-[#eef9ea] text-[#0c4703]' : 'bg-emerald-950 text-amber-300'
              }`}
            >
              {completedCount} / {totalCount}
            </span>
            <button
              type="button"
              onClick={() => setIsEditMode((v) => !v)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold inline-flex items-center gap-1 border transition active:scale-95 ${
                isEditMode
                  ? isDay
                    ? 'bg-[#158509] border-[#0c5007] text-white nq-keep-dark'
                    : 'bg-amber-400 border-amber-300 text-slate-950'
                  : isDay
                  ? 'bg-[#f8fafc] border-[#dde3ea] text-slate-700 hover:border-[#158509]/50'
                  : 'bg-slate-950 border-emerald-900/60 text-slate-200 hover:border-amber-400/50'
              }`}
            >
              {isEditMode ? <Check className="w-3 h-3" /> : <SlidersHorizontal className="w-3 h-3" />}
              <span>{isEditMode ? ui.doneBtn : ui.customizeBtn}</span>
            </button>
          </div>
        </div>

        {/* Men / Women Preset Selector */}
        <div
          className={`grid grid-cols-2 gap-1 p-1 rounded-xl border mb-2.5 ${
            isDay ? 'bg-[#f1f5f9] border-[#dde3ea]' : 'bg-slate-950 border-emerald-900/60'
          }`}
        >
          {(
            [
              { id: 'men' as const, label: ui.menTab },
              { id: 'women' as const, label: ui.womenTab },
            ] as const
          ).map((tab) => {
            const active = profileMode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSwitchProfile(tab.id)}
                className={`py-1.5 px-2.5 rounded-lg text-[11.5px] font-extrabold transition ${
                  active
                    ? isDay
                      ? 'bg-[#158509] text-white shadow-xs nq-keep-dark'
                      : 'bg-amber-400 text-slate-950 shadow-xs'
                    : isDay
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Respectful Hanafi note when Women mode is selected */}
        {profileMode === 'women' && (
          <p
            className={`text-[11px] leading-snug px-3 py-2 rounded-xl border mb-2.5 ${
              isDay
                ? 'bg-[#f6fbf4] border-[#d3e9cc] text-[#0c4703]'
                : 'bg-emerald-950/50 border-emerald-800/60 text-emerald-200'
            }`}
          >
            {ui.womenNote}
          </p>
        )}

        {/* Progress Bar */}
        <div className="w-full h-1.5 rounded-full overflow-hidden mb-3 bg-slate-200 dark:bg-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isDay ? 'bg-[#158509]' : 'bg-amber-400'
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Edit / Customize Toolbar: Add Custom Task + Quick Suggestions + Reset */}
        {isEditMode && (
          <div
            className={`rounded-2xl border p-3 mb-3 space-y-2.5 ${
              isDay ? 'bg-[#f8fcf7] border-[#cde8c3]' : 'bg-slate-950/80 border-emerald-800/60'
            }`}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddCustomTask();
              }}
              className="flex items-center gap-1.5"
            >
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder={ui.addPlaceholder}
                maxLength={120}
                className={`flex-1 min-w-0 px-3 py-2 rounded-xl border text-xs outline-none transition ${
                  isDay
                    ? 'bg-white border-[#dde3ea] text-slate-900 focus:border-[#158509]'
                    : 'bg-slate-900 border-emerald-900/70 text-white focus:border-amber-400'
                }`}
              />
              <button
                type="submit"
                disabled={!newTaskText.trim()}
                className={`px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1 shrink-0 transition active:scale-95 disabled:opacity-45 ${
                  isDay
                    ? 'bg-[#158509] text-white nq-keep-dark'
                    : 'bg-amber-400 text-slate-950'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{ui.addBtn}</span>
              </button>
            </form>

            {/* Quick-add Sunnah Suggestions */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[10.5px] font-bold ${isDay ? 'text-slate-600' : 'text-slate-400'}`}>
                  {ui.suggestionsLabel}
                </span>
                <button
                  type="button"
                  onClick={handleResetChecklistConfig}
                  className={`inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-lg border transition ${
                    isDay
                      ? 'bg-white border-slate-200 text-slate-600 hover:text-rose-600'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-amber-300'
                  }`}
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{ui.resetBtn}</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_SUGGESTIONS.map((sug, idx) => {
                  const text = sug[language] || sug.uz_lat;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddCustomTask(text)}
                      className={`px-2.5 py-1 rounded-full border text-[10.5px] font-semibold inline-flex items-center gap-1 transition active:scale-95 ${
                        isDay
                          ? 'bg-white border-[#c5e8bc] text-[#0c4703] hover:bg-[#eef9ea]'
                          : 'bg-emerald-950/60 border-emerald-800/70 text-emerald-200 hover:border-amber-400/60'
                      }`}
                    >
                      <Plus className="w-2.5 h-2.5" />
                      <span>{text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Checklist Rows (Normal Mode vs Edit Mode) */}
        {isEditMode ? (
          <div className="space-y-1.5">
            {resolvedAllItems.map((item, idx) => (
              <div
                key={item.id}
                className={`p-2 rounded-xl border flex items-center gap-2 transition ${
                  item.hidden
                    ? isDay
                      ? 'bg-slate-100/75 border-dashed border-slate-300 text-slate-400'
                      : 'bg-slate-950/40 border-dashed border-slate-800 text-slate-500'
                    : isDay
                    ? 'bg-[#f8fafc] border-[#e2e8f0] text-slate-800'
                    : 'bg-slate-950/65 border-slate-800 text-slate-100'
                }`}
              >
                {/* Reorder Up/Down */}
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveItem(item.id, -1)}
                    aria-label="Move up"
                    className="p-0.5 rounded hover:bg-black/10 disabled:opacity-25"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === resolvedAllItems.length - 1}
                    onClick={() => handleMoveItem(item.id, 1)}
                    aria-label="Move down"
                    className="p-0.5 rounded hover:bg-black/10 disabled:opacity-25"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>

                <div className="min-w-0 flex-1">
                  <span className={`text-xs font-semibold block ${item.hidden ? 'line-through' : ''}`}>
                    {item.text}
                  </span>
                  {item.isCustom && (
                    <span
                      className={`text-[9.5px] font-bold uppercase tracking-wider ${
                        isDay ? 'text-[#158509]' : 'text-amber-300'
                      }`}
                    >
                      {ui.customTag}
                    </span>
                  )}
                  {item.hidden && (
                    <span className="text-[9.5px] font-bold uppercase tracking-wider opacity-75">
                      {ui.hiddenTag}
                    </span>
                  )}
                </div>

                {item.isCustom ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteCustomTask(item.id)}
                    aria-label="Delete task"
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleTogglePresetVisibility(item.id)}
                    aria-label={item.hidden ? 'Show task' : 'Hide task'}
                    className={`p-1.5 rounded-lg shrink-0 transition ${
                      item.hidden
                        ? isDay
                          ? 'bg-slate-200 text-slate-600'
                          : 'bg-slate-800 text-slate-300'
                        : isDay
                        ? 'bg-[#eef9ea] text-[#158509]'
                        : 'bg-emerald-950 text-emerald-300'
                    }`}
                  >
                    {item.hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : visibleItems.length === 0 ? (
          <p className={`text-xs text-center py-4 ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
            {ui.emptyHint}
          </p>
        ) : (
          <div className="space-y-2">
            {visibleItems.map((item) => {
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
                  <span className={`text-xs font-semibold flex-1 ${done ? 'line-through opacity-80' : ''}`}>
                    {item.text}
                  </span>
                </button>
              );
            })}
          </div>
        )}
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
