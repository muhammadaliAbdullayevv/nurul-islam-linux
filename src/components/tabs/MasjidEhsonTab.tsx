import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  CreditCard,
  ExternalLink,
  HeartHandshake,
  MapPin,
  Navigation,
  PackageCheck,
  RefreshCw,
  Share2,
  ShieldCheck,
  User,
  Users,
  X,
} from 'lucide-react';
import { Coordinates } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { getOrCreateDeviceId } from '../../utils/deviceId';
import { openExternalUrl } from '../../utils/nativePrayerBridge';
import { UPDATE_SITE_URL } from '../../utils/appUpdater';
import { latinToCyrillicUz } from '../../utils/uzbekScript';
import { MasjidDomeIcon } from '../icons/IslamicFeatureIcons';

export type EhsonCategory = 'hashar' | 'items' | 'money';

export interface EhsonCampaign {
  id: string;
  category: EhsonCategory;
  status: 'active' | 'completed';
  masjidName: string;
  masjidAddress: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  eventDateTime?: string;
  volunteersNeeded?: number;
  rsvpCount: number;
  joinedByMe: boolean;
  itemNeedLabel?: string;
  pledgeCount: number;
  pledgedByMe: boolean;
  targetAmount?: number;
  raisedAmount?: number;
  cardNumber?: string;
  cardHolder?: string;
  paymentUrl?: string;
  verifiedNote?: string;
  createdAt: string;
  updatedAt: string;
}

interface MasjidEhsonTabProps {
  currentCity: Coordinates;
  onOpenMasjidsMap?: () => void;
}

const EHSON_CACHE_KEY = 'nq_ehson_campaigns_v1';

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function formatDistance(km: number, language: string): string {
  if (!Number.isFinite(km)) return '';
  if (km < 1) return `${Math.max(20, Math.round(km * 1000))} m`;
  return `${km.toFixed(1)} ${language === 'ru' ? 'км' : 'km'}`;
}

function formatCardNumber4(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 16) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8, 12)} ${digits.slice(12, 16)}`;
  }
  return raw.trim();
}

function detectCardBrand(raw: string, fallbackLabel: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('9860')) return `HUMO · ${fallbackLabel}`;
  if (digits.startsWith('8600') || digits.startsWith('5614') || digits.startsWith('6262')) {
    return `UZCARD · ${fallbackLabel}`;
  }
  if (digits.startsWith('4')) return `VISA · ${fallbackLabel}`;
  if (digits.startsWith('5')) return `MASTERCARD · ${fallbackLabel}`;
  return fallbackLabel;
}

function capitalizeFirst(str: string): string {
  const cleaned = str.replace(/\s+/g, ' ').trim();
  if (!cleaned) return '';
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export const MasjidEhsonTab: React.FC<MasjidEhsonTabProps> = ({
  currentCity,
  onOpenMasjidsMap,
}) => {
  const { isDay } = useTheme();
  const { language } = useLanguage();
  const deviceId = useMemo(() => getOrCreateDeviceId(), []);

  const locText = useCallback(
    (text?: string) => {
      if (!text) return '';
      return language === 'uz_cyr' ? latinToCyrillicUz(text) : text;
    },
    [language]
  );

  const copy = useMemo(() => {
    if (language === 'ru') {
      return {
        heroBadge: 'ПОДТВЕРЖДЕНО ИМАМОМ И МУТАВАЛЛИ',
        heroTitle: 'Помощь мечетям и Хашар',
        heroSub: 'Выберите мечеть из списка, чтобы увидеть реквизиты и подробности помощи',
        statActiveLabel: 'Активных',
        statVerifiedLabel: 'Проверено',
        statSadaqahTop: 'Садака',
        statSadaqahSub: 'Джария',
        all: 'Все',
        hashar: 'Хашар',
        items: 'Инвентарь',
        money: 'Садака',
        refresh: 'Обновить',
        emptyTitle: 'Пока нет активных объявлений в этой категории',
        emptyBody: 'Новые хашары и подтверждённые сборы мечетей появятся здесь после согласования с имамами.',
        openMapBtn: 'Найти мечети рядом',
        openDetailBtn: 'Подробнее',
        backToList: 'Назад к списку мечетей',
        tagMoney: 'Благотворительность',
        tagHashar: 'Хашар',
        tagItems: 'Инвентарь',
        needHeaderMoney: 'НУЖДА МЕЧЕТИ · БЛАГОТВОРИТЕЛЬНЫЙ СБОР',
        needHeaderHashar: 'ОБЩЕСТВЕННЫЙ ХАШАР В МЕЧЕТИ',
        needHeaderItems: 'НУЖДА МЕЧЕТИ · ИНВЕНТАРЬ',
        going: 'Я пойду на хашар',
        joined: 'Я записан ✓',
        volunteers: 'участников',
        map: 'На карте',
        share: 'Поделиться',
        bringItem: 'Я принесу это',
        brought: 'Записан ✓',
        pledgedCount: 'чел. откликнулись',
        pledgeOpen: 'Требуется помощь',
        officialCard: 'ОФИЦИАЛЬНАЯ КАРТА',
        defaultCardHolder: 'Счёт мутавалли мечети',
        copyCard: 'Копировать',
        copied: 'Скопировано ✓',
        openPay: 'Оплатить онлайн',
        verifiedBadge: '✓ Проверено имамом и мутавалли',
        completedBadge: '✓ Завершено',
        raisedLabel: 'Собрано:',
        targetLabel: 'Цель:',
        som: 'сум',
        modalTitle: 'Доставка в мечеть',
        modalSub: 'Оставьте имя и телефон (необязательно), чтобы ответственный в мечети мог связаться с вами.',
        namePh: 'Ваше имя (необязательно)',
        phonePh: 'Телефон +998... (необязательно)',
        notePh: 'Примечание (например: принесу завтра утром)',
        confirmPledge: 'Подтвердить помощь',
        cancelPledge: 'Отменить запись',
        offlineErr: 'Не удалось обновить данные. Проверьте интернет.',
      };
    }
    if (language === 'en') {
      return {
        heroBadge: 'IMAM & MUTAWALLI VERIFIED',
        heroTitle: 'Masjid Support & Hashar',
        heroSub: 'Tap any masjid below to view full charity details, card numbers, and needs',
        statActiveLabel: 'Active Ads',
        statVerifiedLabel: 'Verified',
        statSadaqahTop: 'Sadaqah',
        statSadaqahSub: 'Jariyah',
        all: 'All',
        hashar: 'Hashar',
        items: 'Supplies',
        money: 'Donations',
        refresh: 'Refresh',
        emptyTitle: 'No active masjid campaigns in this tab',
        emptyBody: 'Verified community hashar days and mosque needs will appear here once confirmed with local imams.',
        openMapBtn: 'View Nearby Masjids',
        openDetailBtn: 'Details',
        backToList: 'Back to masjids list',
        tagMoney: 'Financial Aid',
        tagHashar: 'Hashar',
        tagItems: 'Supplies',
        needHeaderMoney: 'MASJID NEED · FINANCIAL CHARITY',
        needHeaderHashar: 'COMMUNITY MASJID HASHAR',
        needHeaderItems: 'MASJID NEED · SUPPLIES',
        going: 'Join Hashar',
        joined: 'Joined ✓',
        volunteers: 'volunteers',
        map: 'View on Map',
        share: 'Share with Friends',
        bringItem: 'I will bring this',
        brought: 'Pledged ✓',
        pledgedCount: 'pledged',
        pledgeOpen: 'Needed now',
        officialCard: 'OFFICIAL CARD',
        defaultCardHolder: 'Official masjid caretaker account',
        copyCard: 'Copy',
        copied: 'Copied ✓',
        openPay: 'Pay Online',
        verifiedBadge: '✓ Verified by Imam & Mutawalli',
        completedBadge: '✓ Completed',
        raisedLabel: 'Raised:',
        targetLabel: 'Goal:',
        som: 'UZS',
        modalTitle: 'Pledge Supplies to Masjid',
        modalSub: 'Optionally share your name and phone so the mosque caretaker can coordinate with you.',
        namePh: 'Your name (optional)',
        phonePh: 'Phone +998... (optional)',
        notePh: 'Note (e.g., will drop off tomorrow morning)',
        confirmPledge: 'Confirm Pledge',
        cancelPledge: 'Cancel Pledge',
        offlineErr: 'Could not reach server. Showing cached data.',
      };
    }
    if (language === 'uz_cyr') {
      return {
        heroBadge: 'ИМОМ ВА МУТАВАЛЛИ ТАСДИҚЛАГАН',
        heroTitle: 'Масжидга Эҳсон ва Ҳашар',
        heroSub: 'Рўйхатдан масжидни танланг — тўлиқ эҳсон тафсилотлари ва карта рақами масжид саҳифасида очилади',
        statActiveLabel: 'Фаол эълон',
        statVerifiedLabel: 'Тасдиқланган',
        statSadaqahTop: 'Садақаи',
        statSadaqahSub: 'Жория',
        all: 'Барчаси',
        hashar: 'Ҳашар',
        items: 'Жиҳоз',
        money: 'Эҳсон',
        refresh: 'Янгилаш',
        emptyTitle: 'Бу бўлимда ҳозирча фаол эълонлар йўқ',
        emptyBody: 'Яқин масжидларда ҳашар ёки тасдиқланган эҳтиёжлар пайдо бўлса, шу ерда кўринади.',
        openMapBtn: 'Яқин масжидларни кўриш',
        openDetailBtn: 'Батафсил',
        backToList: 'Масжидлар рўйхатига қайтиш',
        tagMoney: 'Пул эҳсони',
        tagHashar: 'Ҳашар',
        tagItems: 'Жиҳоз',
        needHeaderMoney: 'МАСЖИД ЭҲТИЁЖИ · ПУЛ ЭҲСОНИ',
        needHeaderHashar: 'МАСЖИД ОБОДЛИГИ · ҲАШАР',
        needHeaderItems: 'МАСЖИД ЭҲТИЁЖИ · ЖИҲОЗ ВА АНЖОМ',
        going: 'Мен бораман',
        joined: 'Ёзилдим ✓',
        volunteers: 'киши боради',
        map: 'Харитада кўриш',
        share: 'Дўстларга улашиш',
        bringItem: 'Мен олиб бораман',
        brought: 'Олиб бораман ✓',
        pledgedCount: 'киши етказади',
        pledgeOpen: 'Етказиш очиқ',
        officialCard: 'РАСМИЙ КАРТА',
        defaultCardHolder: 'Масжид мутаваллиси ҳисоб картаси',
        copyCard: 'Нусхалаш',
        copied: 'Нусхаланди ✓',
        openPay: 'Онлайн ўтказиш',
        verifiedBadge: '✓ Имом ва мутавалли тасдиқлаган',
        completedBadge: '✓ Якунланди',
        raisedLabel: 'Йиғилди:',
        targetLabel: 'Мақсад:',
        som: 'сўм',
        modalTitle: 'Масжидга жиҳоз етказиш',
        modalSub: 'Масжид масъули боғланиши учун исм ва телефонингизни ёзишингиз мумкин (ихтиёрий).',
        namePh: 'Исмингиз (ихтиёрий)',
        phonePh: 'Телефон +998... (ихтиёрий)',
        notePh: 'Изоҳ (масалан: эртага эрталаб олиб бораман)',
        confirmPledge: 'Тасдиқлаш',
        cancelPledge: 'Ёзувни бекор қилиш',
        offlineErr: 'Сервер билан алоқа узилди.',
      };
    }
    return {
      heroBadge: 'IMOM VA MUTAVALLI TASDIQLAGAN',
      heroTitle: 'Masjidga Ehson va Hashar',
      heroSub: "Ro'yxatdan masjidni tanlang — to'liq ehson tafsilotlari va karta raqami masjid sahifasida ochiladi",
      statActiveLabel: "Faol e'lon",
      statVerifiedLabel: 'Tasdiqlangan',
      statSadaqahTop: 'Sadaqai',
      statSadaqahSub: 'Joriya',
      all: 'Barchasi',
      hashar: 'Hashar',
      items: 'Jihoz',
      money: 'Ehson',
      refresh: 'Yangilash',
      emptyTitle: "Bu bo'limda hozircha faol e'lonlar yo'q",
      emptyBody: "Yaqin atrofdagi masjidlarda hashar yoki tasdiqlangan ehtiyojlar e'lon qilinsa, shu yerda ko'rinadi.",
      openMapBtn: "Yaqin masjidlarni ko'rish",
      openDetailBtn: 'Batafsil',
      backToList: "Masjidlar ro'yxatiga qaytish",
      tagMoney: 'Pul ehsoni',
      tagHashar: 'Hashar',
      tagItems: 'Jihoz',
      needHeaderMoney: 'MASJID EHTIYOJI · PUL EHSONI',
      needHeaderHashar: 'MASJID OBODLIGI · HASHAR',
      needHeaderItems: 'MASJID EHTIYOJI · JIHOZ VA ANJOM',
      going: 'Men boraman',
      joined: 'Yozildim ✓',
      volunteers: 'kishi boradi',
      map: "Xaritada ko'rish",
      share: "Do'stlarga ulashish",
      bringItem: 'Men olib boraman',
      brought: 'Olib boraman ✓',
      pledgedCount: 'kishi yetkazadi',
      pledgeOpen: 'Yetkazish ochiq',
      officialCard: 'RASMIY KARTA',
      defaultCardHolder: 'Masjid mutavallisi hisob kartasi',
      copyCard: 'Nusxalash',
      copied: 'Nusxalandi ✓',
      openPay: "Onlayn o'tkazish",
      verifiedBadge: '✓ Imom va mutavalli tasdiqlagan',
      completedBadge: '✓ Yakunlandi',
      raisedLabel: "Yig'ildi:",
      targetLabel: 'Maqsad:',
      som: "so'm",
      modalTitle: 'Masjidga jihoz yetkazish',
      modalSub: "Masjid mas'uli bog'lanishi uchun ism va telefon raqamingizni qoldirishingiz mumkin (ixtiyoriy).",
      namePh: 'Ismingiz (ixtiyoriy)',
      phonePh: 'Telefon +998... (ixtiyoriy)',
      notePh: 'Izoh (masalan: ertaga ertalab olib boraman)',
      confirmPledge: 'Tasdiqlash',
      cancelPledge: 'Bekor qilish',
      offlineErr: "Serverdan yangilab bo'lmadi. Saqlangan ro'yxat ko'rsatilmoqda.",
    };
  }, [language]);

  const [filterCat, setFilterCat] = useState<'all' | EhsonCategory>('all');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<EhsonCampaign[]>(() => {
    try {
      const raw = localStorage.getItem(EHSON_CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });
  const [loading, setLoading] = useState(false);
  const [netError, setNetError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pledgeModalItem, setPledgeModalItem] = useState<EhsonCampaign | null>(null);
  const [pledgeName, setPledgeName] = useState('');
  const [pledgePhone, setPledgePhone] = useState('');
  const [pledgeNote, setPledgeNote] = useState('');

  // Intercept Android hardware back & header back button when viewing a specific masjid page
  useEffect(() => {
    if (!selectedCampaignId && !pledgeModalItem) return;
    const onAndroidBack = (e: Event) => {
      if (pledgeModalItem) {
        e.preventDefault();
        setPledgeModalItem(null);
        return;
      }
      if (selectedCampaignId) {
        e.preventDefault();
        setSelectedCampaignId(null);
      }
    };
    window.addEventListener('nq:android-back', onAndroidBack);
    return () => window.removeEventListener('nq:android-back', onAndroidBack);
  }, [pledgeModalItem, selectedCampaignId]);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setNetError('');
    try {
      const res = await fetch(
        `${UPDATE_SITE_URL}/api/ehson?deviceId=${encodeURIComponent(deviceId)}`,
        { cache: 'no-store' }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { campaigns?: EhsonCampaign[] };
      const list = Array.isArray(data.campaigns) ? data.campaigns : [];
      setCampaigns(list);
      try {
        localStorage.setItem(EHSON_CACHE_KEY, JSON.stringify(list));
      } catch {
        // ignore quota errors
      }
    } catch {
      setNetError(campaigns.length > 0 ? copy.offlineErr : '');
    } finally {
      setLoading(false);
    }
  }, [campaigns.length, copy.offlineErr, deviceId]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const catCounts = useMemo(() => {
    return {
      all: campaigns.length,
      hashar: campaigns.filter((c) => c.category === 'hashar').length,
      items: campaigns.filter((c) => c.category === 'items').length,
      money: campaigns.filter((c) => c.category === 'money').length,
      activeTotal: campaigns.filter((c) => c.status === 'active').length,
    };
  }, [campaigns]);

  const withDistanceList = useMemo(() => {
    return campaigns.map((c) => ({
      ...c,
      distKm:
        Number.isFinite(c.lat) && Number.isFinite(c.lng)
          ? haversineKm(currentCity.latitude, currentCity.longitude, c.lat, c.lng)
          : Infinity,
    }));
  }, [campaigns, currentCity.latitude, currentCity.longitude]);

  const sortedFiltered = useMemo(() => {
    const filtered =
      filterCat === 'all'
        ? withDistanceList
        : withDistanceList.filter((c) => c.category === filterCat);
    return [...filtered].sort((a, b) => {
      if (a.status !== b.status) return a.status === 'active' ? -1 : 1;
      return a.distKm - b.distKm;
    });
  }, [filterCat, withDistanceList]);

  const selectedCampaign = useMemo(() => {
    if (!selectedCampaignId) return null;
    return withDistanceList.find((c) => c.id === selectedCampaignId) || null;
  }, [selectedCampaignId, withDistanceList]);

  // All campaigns belonging to the selected masjid (with the tapped campaign first)
  const selectedMasjidCampaigns = useMemo(() => {
    if (!selectedCampaign) return [];
    const targetName = selectedCampaign.masjidName.trim().toLowerCase();
    const sameMasjid = withDistanceList.filter(
      (c) => c.masjidName.trim().toLowerCase() === targetName
    );
    return sameMasjid.sort((a, b) => {
      if (a.id === selectedCampaign.id) return -1;
      if (b.id === selectedCampaign.id) return 1;
      return 0;
    });
  }, [selectedCampaign, withDistanceList]);

  const upsertCampaign = (updated: EhsonCampaign) => {
    setCampaigns((prev) => {
      const next = prev.map((c) => (c.id === updated.id ? updated : c));
      try {
        localStorage.setItem(EHSON_CACHE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleToggleRsvp = async (item: EhsonCampaign) => {
    if (busyId || item.status === 'completed') return;
    setBusyId(item.id);
    try {
      const res = await fetch(`${UPDATE_SITE_URL}/api/ehson/${item.id}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId }),
      });
      if (res.ok) {
        const data = (await res.json()) as { campaign?: EhsonCampaign };
        if (data.campaign) upsertCampaign(data.campaign);
      }
    } catch {
      setNetError(copy.offlineErr);
    } finally {
      setBusyId(null);
    }
  };

  const submitPledge = async (item: EhsonCampaign, cancel: boolean) => {
    if (busyId) return;
    setBusyId(item.id);
    try {
      const res = await fetch(`${UPDATE_SITE_URL}/api/ehson/${item.id}/pledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId,
          cancel,
          name: pledgeName,
          phone: pledgePhone,
          note: pledgeNote,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { campaign?: EhsonCampaign };
        if (data.campaign) upsertCampaign(data.campaign);
        setPledgeModalItem(null);
        setPledgeName('');
        setPledgePhone('');
        setPledgeNote('');
      }
    } catch {
      setNetError(copy.offlineErr);
    } finally {
      setBusyId(null);
    }
  };

  const handleCopyCard = (id: string, card: string) => {
    navigator.clipboard?.writeText(card.replace(/\s+/g, '')).catch(() => {});
    setCopiedId(id);
    window.setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 2000);
  };

  const handleShare = (item: EhsonCampaign) => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`;
    const cardLine = item.cardNumber
      ? `\n💳 ${formatCardNumber4(item.cardNumber)}${item.cardHolder ? ` (${item.cardHolder})` : ''}`
      : '';
    const text = `🕌 ${item.masjidName}${item.masjidAddress ? ` (${item.masjidAddress})` : ''}\n📌 ${capitalizeFirst(item.title)}${item.eventDateTime ? `\n🕒 ${item.eventDateTime}` : ''}${cardLine}\n📍 ${mapUrl}`;
    if (navigator.share) {
      navigator.share({ title: item.masjidName, text }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text).catch(() => {});
      setCopiedId(`share_${item.id}`);
      window.setTimeout(() => setCopiedId(null), 1800);
    }
  };

  return (
    <div className="space-y-3 pb-4">
      {/* ===================================================================== */}
      {/* VIEW 2: DEDICATED MASJID DETAIL PAGE                                  */}
      {/* ===================================================================== */}
      {selectedCampaign ? (
        <div className="space-y-3">
          {/* Back to Masjid List button */}
          <button
            type="button"
            onClick={() => setSelectedCampaignId(null)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-extrabold transition active:scale-95 ${
              isDay
                ? 'bg-white border-[#cde5c7] text-[#0c4703] shadow-2xs'
                : 'bg-slate-900 border-emerald-800/60 text-amber-300'
            }`}
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>{copy.backToList}</span>
          </button>

          {/* Masjid Profile Hero Header Card */}
          <div
            className={`rounded-3xl border p-4 space-y-3 ${
              isDay
                ? 'bg-white border-[#cde5c7] shadow-xs'
                : 'bg-slate-900/95 border-emerald-800/60 shadow-md'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${
                  isDay
                    ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#158509]'
                    : 'bg-emerald-950 border-emerald-800 text-amber-300'
                }`}
              >
                <MasjidDomeIcon className="w-6 h-6" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h2
                    className={`text-base font-extrabold leading-snug ${
                      isDay ? 'text-[#0c4703]' : 'text-white'
                    }`}
                  >
                    {locText(capitalizeFirst(selectedCampaign.masjidName))}
                  </h2>
                  {Number.isFinite(selectedCampaign.distKm) && (
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 ${
                        isDay
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {formatDistance(selectedCampaign.distKm, language)}
                    </span>
                  )}
                </div>

                {selectedCampaign.masjidAddress && (
                  <p
                    className={`text-xs mt-1 flex items-center gap-1 ${
                      isDay ? 'text-slate-600' : 'text-slate-300'
                    }`}
                  >
                    <MapPin
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isDay ? 'text-[#158509]' : 'text-amber-400'
                      }`}
                    />
                    <span>{locText(selectedCampaign.masjidAddress)}</span>
                  </p>
                )}

                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      selectedCampaign.status === 'completed'
                        ? isDay
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-slate-800 text-slate-300'
                        : isDay
                        ? 'bg-[#eef9ea] text-[#158509] border border-[#b7e2ad]'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-700/70'
                    }`}
                  >
                    {selectedCampaign.status === 'completed'
                      ? copy.completedBadge
                      : copy.verifiedBadge}
                  </span>
                </div>
              </div>
            </div>

            {/* Map & Share quick actions inside Masjid Header */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() =>
                  openExternalUrl(
                    `https://www.google.com/maps/search/?api=1&query=${selectedCampaign.lat},${selectedCampaign.lng}`
                  )
                }
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border inline-flex items-center justify-center gap-1.5 transition active:scale-[0.98] ${
                  isDay
                    ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                    : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                }`}
              >
                <Navigation className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{copy.map}</span>
              </button>

              <button
                type="button"
                onClick={() => handleShare(selectedCampaign)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border inline-flex items-center justify-center gap-1.5 transition active:scale-[0.98] ${
                  isDay
                    ? 'bg-slate-50 border-[#dde3ea] text-slate-700'
                    : 'bg-slate-800 border-slate-700 text-slate-200'
                }`}
              >
                {copiedId === `share_${selectedCampaign.id}` ? (
                  <Check className="w-3.5 h-3.5 text-[#158509] shrink-0" />
                ) : (
                  <Share2 className="w-3.5 h-3.5 shrink-0" />
                )}
                <span className="truncate">
                  {copiedId === `share_${selectedCampaign.id}` ? copy.copied : copy.share}
                </span>
              </button>
            </div>
          </div>

          {/* Full Ehson Campaign Detail Card(s) for this Masjid */}
          {selectedMasjidCampaigns.map((item) => {
            const isCompleted = item.status === 'completed';
            const pctMoney =
              item.targetAmount && item.targetAmount > 0
                ? Math.min(100, Math.round(((item.raisedAmount || 0) / item.targetAmount) * 100))
                : 0;
            const pctVolunteers =
              item.volunteersNeeded && item.volunteersNeeded > 0
                ? Math.min(100, Math.round((item.rsvpCount / item.volunteersNeeded) * 100))
                : 0;

            const needHeaderLabel =
              item.category === 'hashar'
                ? copy.needHeaderHashar
                : item.category === 'items'
                ? copy.needHeaderItems
                : copy.needHeaderMoney;

            return (
              <div
                key={item.id}
                className={`rounded-3xl border p-4 space-y-3.5 ${
                  isCompleted ? 'opacity-75' : ''
                } ${
                  isDay
                    ? 'bg-white border-[#cde5c7] shadow-xs'
                    : 'bg-slate-900/95 border-emerald-800/60 shadow-md'
                }`}
              >
                {/* Need Callout Box */}
                <div
                  className={`rounded-2xl border-l-4 px-3.5 py-3 space-y-1 ${
                    isDay
                      ? 'bg-slate-50/90 border-l-[#158509]'
                      : 'bg-slate-950/60 border-l-amber-400'
                  }`}
                >
                  <div
                    className={`text-[10px] font-extrabold uppercase tracking-wider ${
                      isDay ? 'text-[#158509]' : 'text-amber-300'
                    }`}
                  >
                    {needHeaderLabel}
                  </div>
                  <h4
                    className={`text-sm font-extrabold leading-snug ${
                      isDay ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    {locText(capitalizeFirst(item.title))}
                  </h4>
                  {item.description && (
                    <p
                      className={`text-xs leading-relaxed pt-0.5 ${
                        isDay ? 'text-slate-600' : 'text-slate-300'
                      }`}
                    >
                      {locText(item.description)}
                    </p>
                  )}
                </div>

                {/* Hashar Section */}
                {item.category === 'hashar' && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold ${
                          isDay ? 'text-slate-700' : 'text-slate-200'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5 text-[#158509]" />
                        {locText(item.eventDateTime) || '—'}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 font-extrabold tabular-nums ${
                          isDay ? 'text-[#158509]' : 'text-amber-300'
                        }`}
                      >
                        <Users className="w-3.5 h-3.5" />
                        {item.volunteersNeeded
                          ? `${item.rsvpCount} / ${item.volunteersNeeded} ${copy.volunteers}`
                          : `${item.rsvpCount} ${copy.volunteers}`}
                      </span>
                    </div>

                    {item.volunteersNeeded ? (
                      <div
                        className={`w-full h-2 rounded-full overflow-hidden ${
                          isDay ? 'bg-slate-100' : 'bg-slate-800'
                        }`}
                      >
                        <div
                          className={`h-full rounded-full transition-all ${
                            isDay
                              ? 'bg-gradient-to-r from-[#158509] to-emerald-500'
                              : 'bg-amber-400'
                          }`}
                          style={{ width: `${Math.max(6, pctVolunteers)}%` }}
                        />
                      </div>
                    ) : null}

                    <button
                      type="button"
                      disabled={isCompleted || busyId === item.id}
                      onClick={() => handleToggleRsvp(item)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-extrabold transition active:scale-[0.99] disabled:opacity-50 ${
                        item.joinedByMe
                          ? isDay
                            ? 'bg-[#158509] text-white nq-keep-dark'
                            : 'bg-amber-400 text-slate-950'
                          : isDay
                          ? 'bg-[#158509] hover:bg-[#0c5007] text-white nq-keep-dark'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                      }`}
                    >
                      {item.joinedByMe ? copy.joined : copy.going}
                    </button>
                  </div>
                )}

                {/* Items / Supplies Section */}
                {item.category === 'items' && (
                  <div className="space-y-2.5">
                    {item.itemNeedLabel && (
                      <div
                        className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
                          isDay
                            ? 'bg-amber-50 border border-amber-200 text-amber-900'
                            : 'bg-amber-950/35 border border-amber-800/50 text-amber-200'
                        }`}
                      >
                        <PackageCheck className="w-4 h-4 shrink-0" />
                        <span>{locText(item.itemNeedLabel)}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-xs font-semibold ${
                          isDay ? 'text-slate-600' : 'text-slate-300'
                        }`}
                      >
                        {item.pledgeCount > 0
                          ? `${item.pledgeCount} ${copy.pledgedCount}`
                          : copy.pledgeOpen}
                      </span>

                      <button
                        type="button"
                        disabled={isCompleted || busyId === item.id}
                        onClick={() => setPledgeModalItem(item)}
                        className={`py-2 px-3.5 rounded-xl text-xs font-extrabold transition active:scale-[0.98] disabled:opacity-50 ${
                          item.pledgedByMe
                            ? 'bg-amber-600 text-white'
                            : isDay
                            ? 'bg-[#158509] text-white nq-keep-dark'
                            : 'bg-amber-400 text-slate-950'
                        }`}
                      >
                        {item.pledgedByMe ? copy.brought : copy.bringItem}
                      </button>
                    </div>
                  </div>
                )}

                {/* Money / Financial Verified Aid Section */}
                {item.category === 'money' && (
                  <div className="space-y-2.5">
                    {item.targetAmount ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs tabular-nums">
                          <span
                            className={`font-extrabold ${
                              isDay ? 'text-[#0c4703]' : 'text-emerald-300'
                            }`}
                          >
                            {copy.raisedLabel} {(item.raisedAmount || 0).toLocaleString()}{' '}
                            {copy.som}
                          </span>
                          <span
                            className={`font-semibold ${
                              isDay ? 'text-slate-500' : 'text-slate-400'
                            }`}
                          >
                            {copy.targetLabel} {item.targetAmount.toLocaleString()} {copy.som}
                          </span>
                        </div>
                        <div
                          className={`w-full h-2 rounded-full overflow-hidden ${
                            isDay ? 'bg-slate-200/80' : 'bg-slate-800'
                          }`}
                        >
                          <div
                            className={`h-full rounded-full transition-all ${
                              isDay
                                ? 'bg-gradient-to-r from-[#158509] to-emerald-500'
                                : 'bg-amber-400'
                            }`}
                            style={{ width: `${Math.max(6, pctMoney)}%` }}
                          />
                        </div>
                      </div>
                    ) : null}

                    {/* Emerald Banking Card with 4-Digit Spacing & Brand Badge */}
                    {item.cardNumber && (
                      <div className="nq-keep-dark rounded-2xl p-3.5 bg-gradient-to-br from-[#0f291e] to-[#134e32] border border-emerald-700/50 text-white flex items-center justify-between gap-2.5 shadow-xs">
                        <div className="min-w-0">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#fde68a]/20 border border-[#fde68a]/40 text-[#fde68a] text-[9.5px] font-extrabold tracking-wide mb-1">
                            <CreditCard className="w-3 h-3" />
                            {detectCardBrand(item.cardNumber, copy.officialCard)}
                          </span>
                          <div className="font-mono text-sm font-extrabold tracking-wider text-white">
                            {formatCardNumber4(item.cardNumber)}
                          </div>
                          <div className="text-[11px] text-emerald-200/90 truncate mt-0.5 flex items-center gap-1">
                            <User className="w-3 h-3 shrink-0" />
                            <span className="truncate">
                              {item.cardHolder ? locText(item.cardHolder) : copy.defaultCardHolder}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyCard(item.id, item.cardNumber!)}
                          className={`px-3 py-2 rounded-xl text-xs font-extrabold inline-flex items-center gap-1 shrink-0 transition active:scale-95 ${
                            copiedId === item.id
                              ? 'bg-emerald-500 text-white'
                              : 'bg-[#fde68a] hover:bg-[#fcd34d] text-[#0c4703]'
                          }`}
                        >
                          {copiedId === item.id ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>{copiedId === item.id ? copy.copied : copy.copyCard}</span>
                        </button>
                      </div>
                    )}

                    {item.paymentUrl && (
                      <button
                        type="button"
                        onClick={() => openExternalUrl(item.paymentUrl!)}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-extrabold inline-flex items-center justify-center gap-1.5 border ${
                          isDay
                            ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                            : 'bg-emerald-950 border-emerald-800 text-amber-300'
                        }`}
                      >
                        <span>{copy.openPay}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}

                {/* Verified Imam/Mutavalli Footnote */}
                {item.verifiedNote && (
                  <div
                    className={`flex items-center gap-1.5 text-[11px] font-bold ${
                      isDay ? 'text-[#158509]' : 'text-emerald-400'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{locText(item.verifiedNote)}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* =================================================================== */
        /* VIEW 1: COMPACT MASJID LISTING PAGE                                 */
        /* =================================================================== */
        <>
          {/* Hero Banner with 3-Stat Summary Strip */}
          <div
            className={`nq-keep-dark rounded-3xl p-4 border relative overflow-hidden space-y-3 ${
              isDay
                ? 'bg-gradient-to-br from-[#0b4a06] via-[#158509] to-[#1b9c21] border-[#0c5007] text-white shadow-md shadow-emerald-950/15'
                : 'bg-gradient-to-br from-[#07291F] via-[#0B3B1F] to-[#061813] border-emerald-800/60 text-white shadow-xl'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 border border-[#fde68a]/45 text-[#fde68a] text-[10px] font-extrabold tracking-wide mb-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>{copy.heroBadge}</span>
                </div>
                <h2 className="font-display text-lg font-extrabold leading-tight text-white">
                  {copy.heroTitle}
                </h2>
                <p className="text-xs text-white/85 leading-snug mt-0.5">{copy.heroSub}</p>
              </div>
              <button
                type="button"
                onClick={fetchCampaigns}
                disabled={loading}
                className="p-2 rounded-xl bg-black/20 hover:bg-black/30 border border-white/20 text-white transition active:scale-95 shrink-0"
                aria-label={copy.refresh}
              >
                <RefreshCw className={`w-4 h-4 text-white ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-black/22 border border-white/15 py-1.5 px-2 text-center">
                <div className="text-sm font-extrabold text-[#fde68a] tabular-nums">
                  {catCounts.activeTotal} {language === 'ru' || language === 'en' ? '' : 'ta'}
                </div>
                <div className="text-[10px] text-white/80 font-medium">{copy.statActiveLabel}</div>
              </div>
              <div className="rounded-xl bg-black/22 border border-white/15 py-1.5 px-2 text-center">
                <div className="text-sm font-extrabold text-[#fde68a]">100%</div>
                <div className="text-[10px] text-white/80 font-medium">
                  {copy.statVerifiedLabel}
                </div>
              </div>
              <div className="rounded-xl bg-black/22 border border-white/15 py-1.5 px-2 text-center">
                <div className="text-sm font-extrabold text-[#fde68a]">{copy.statSadaqahTop}</div>
                <div className="text-[10px] text-white/80 font-medium">{copy.statSadaqahSub}</div>
              </div>
            </div>
          </div>

          {/* Category Filter Pills with Live Counts */}
          <div
            className={`grid grid-cols-4 gap-1 p-1 rounded-2xl border ${
              isDay
                ? 'bg-white border-[#dde3ea] shadow-xs'
                : 'bg-slate-900 border-emerald-900/50'
            }`}
          >
            {(
              [
                { id: 'all', label: copy.all, count: catCounts.all },
                { id: 'hashar', label: copy.hashar, count: catCounts.hashar },
                { id: 'items', label: copy.items, count: catCounts.items },
                { id: 'money', label: copy.money, count: catCounts.money },
              ] as const
            ).map((tab) => {
              const active = filterCat === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterCat(tab.id)}
                  className={`py-2 px-1.5 rounded-xl text-[11px] font-extrabold transition flex items-center justify-center gap-1 ${
                    active
                      ? isDay
                        ? 'bg-[#158509] text-white shadow-xs nq-keep-dark'
                        : 'bg-amber-400 text-slate-950'
                      : isDay
                      ? 'text-slate-600 hover:text-[#0c4703]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="truncate">{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[9.5px] font-mono tabular-nums ${
                      active
                        ? isDay
                          ? 'bg-white/25 text-white'
                          : 'bg-slate-950/20 text-slate-950'
                        : isDay
                        ? 'bg-slate-100 text-slate-500'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {netError && (
            <div
              className={`px-3 py-2 rounded-xl border text-xs ${
                isDay
                  ? 'bg-amber-50 border-amber-200 text-amber-800'
                  : 'bg-amber-950/40 border-amber-800/50 text-amber-200'
              }`}
            >
              {netError}
            </div>
          )}

          {/* Compact Scannable Masjid Rows */}
          {sortedFiltered.length === 0 ? (
            <div
              className={`rounded-3xl border p-6 text-center space-y-2.5 ${
                isDay
                  ? 'bg-white border-[#dde3ea] text-slate-700'
                  : 'bg-slate-900/85 border-emerald-900/40 text-slate-200'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center ${
                  isDay
                    ? 'bg-[#eef9ea] text-[#158509] border border-[#c5e8bc]'
                    : 'bg-emerald-950 text-amber-300 border border-emerald-800/50'
                }`}
              >
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className={`text-sm font-bold ${isDay ? 'text-slate-900' : 'text-white'}`}>
                {copy.emptyTitle}
              </h3>
              <p
                className={`text-xs leading-relaxed ${
                  isDay ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                {copy.emptyBody}
              </p>
              {onOpenMasjidsMap && (
                <button
                  type="button"
                  onClick={onOpenMasjidsMap}
                  className={`mt-1 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition active:scale-95 ${
                    isDay
                      ? 'bg-[#eef9ea] text-[#0c4703] border border-[#c5e8bc]'
                      : 'bg-emerald-950 text-amber-300 border border-emerald-800/60'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  {copy.openMapBtn}
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2.5">
              {sortedFiltered.map((item) => {
                const isCompleted = item.status === 'completed';
                const distText = Number.isFinite(item.distKm)
                  ? formatDistance(item.distKm, language)
                  : '';
                const categoryBadge =
                  item.category === 'hashar'
                    ? {
                        label: copy.tagHashar,
                        cls: isDay
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-amber-950/60 text-amber-300 border-amber-800/60',
                      }
                    : item.category === 'items'
                    ? {
                        label: copy.tagItems,
                        cls: isDay
                          ? 'bg-sky-50 text-sky-800 border-sky-200'
                          : 'bg-sky-950/60 text-sky-300 border-sky-800/60',
                      }
                    : {
                        label: copy.tagMoney,
                        cls: isDay
                          ? 'bg-[#eef9ea] text-[#158509] border-[#b7e2ad]'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-800',
                      };

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedCampaignId(item.id)}
                    className={`w-full text-left rounded-2xl border p-3 flex items-center justify-between gap-2.5 transition active:scale-[0.99] ${
                      isCompleted ? 'opacity-75' : ''
                    } ${
                      isDay
                        ? 'bg-white border-[#cde5c7] hover:border-[#158509] shadow-2xs'
                        : 'bg-slate-900/95 border-emerald-800/60 hover:border-amber-400/60 shadow-sm'
                    }`}
                  >
                    {/* Mosque Icon with Verified Check Dot */}
                    <div className="relative shrink-0">
                      <div
                        className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${
                          isDay
                            ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#158509]'
                            : 'bg-emerald-950 border-emerald-800 text-amber-300'
                        }`}
                      >
                        <MasjidDomeIcon className="w-5 h-5" />
                      </div>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black border-2 ${
                          isDay
                            ? 'bg-[#158509] text-white border-white'
                            : 'bg-emerald-500 text-slate-950 border-slate-900'
                        }`}
                      >
                        ✓
                      </span>
                    </div>

                    {/* Masjid Name, Address & 1-Line Need Preview */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-[13.5px] font-extrabold leading-snug truncate ${
                          isDay ? 'text-[#0c4703]' : 'text-white'
                        }`}
                      >
                        {locText(capitalizeFirst(item.masjidName))}
                      </h3>

                      {item.masjidAddress && (
                        <p
                          className={`text-[11px] truncate mt-0.5 flex items-center gap-1 ${
                            isDay ? 'text-slate-500' : 'text-slate-400'
                          }`}
                        >
                          <MapPin
                            className={`w-3 h-3 shrink-0 ${
                              isDay ? 'text-[#158509]' : 'text-amber-400'
                            }`}
                          />
                          <span className="truncate">{locText(item.masjidAddress)}</span>
                        </p>
                      )}

                      <div className="flex items-center gap-1.5 mt-1.5 min-w-0">
                        <span
                          className={`px-2 py-0.5 rounded-md border text-[9.5px] font-extrabold shrink-0 ${categoryBadge.cls}`}
                        >
                          {categoryBadge.label}
                        </span>
                        <span
                          className={`text-[11px] font-bold truncate ${
                            isDay ? 'text-slate-700' : 'text-slate-200'
                          }`}
                        >
                          {locText(capitalizeFirst(item.title))}
                        </span>
                      </div>
                    </div>

                    {/* Right Column: Distance + "Batafsil >" */}
                    <div className="flex flex-col items-end justify-between gap-1.5 shrink-0">
                      {distText && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            isDay
                              ? 'bg-slate-100 text-slate-600'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {distText}
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center gap-0.5 px-2.5 py-1 rounded-xl text-[10.5px] font-extrabold border ${
                          isDay
                            ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#158509]'
                            : 'bg-emerald-950/80 border-emerald-800 text-amber-300'
                        }`}
                      >
                        <span>{copy.openDetailBtn}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Supply Pledge Modal ("Men olib boraman") */}
      {pledgeModalItem && (
        <div
          onClick={() => setPledgeModalItem(null)}
          className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-sm rounded-3xl border p-4 space-y-3 shadow-2xl ${
              isDay
                ? 'bg-white border-[#cde5c7] text-slate-900'
                : 'bg-slate-950 border-emerald-800/70 text-slate-100'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className={`text-sm font-bold ${isDay ? 'text-[#0c4703]' : 'text-amber-300'}`}>
                  {copy.modalTitle}
                </h3>
                <p className={`text-[11.5px] mt-0.5 ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                  {locText(pledgeModalItem.masjidName)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPledgeModalItem(null)}
                className={`p-1.5 rounded-xl ${
                  isDay ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-300'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className={`text-xs leading-relaxed ${isDay ? 'text-slate-600' : 'text-slate-300'}`}>
              {copy.modalSub}
            </p>

            <div className="space-y-2">
              <input
                type="text"
                value={pledgeName}
                onChange={(e) => setPledgeName(e.target.value)}
                placeholder={copy.namePh}
                className={`w-full px-3 py-2 rounded-xl border text-xs ${
                  isDay
                    ? 'bg-slate-50 border-[#dde3ea]'
                    : 'bg-slate-900 border-emerald-900/50 text-white'
                }`}
              />
              <input
                type="tel"
                value={pledgePhone}
                onChange={(e) => setPledgePhone(e.target.value)}
                placeholder={copy.phonePh}
                className={`w-full px-3 py-2 rounded-xl border text-xs ${
                  isDay
                    ? 'bg-slate-50 border-[#dde3ea]'
                    : 'bg-slate-900 border-emerald-900/50 text-white'
                }`}
              />
              <input
                type="text"
                value={pledgeNote}
                onChange={(e) => setPledgeNote(e.target.value)}
                placeholder={copy.notePh}
                className={`w-full px-3 py-2 rounded-xl border text-xs ${
                  isDay
                    ? 'bg-slate-50 border-[#dde3ea]'
                    : 'bg-slate-900 border-emerald-900/50 text-white'
                }`}
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              {pledgeModalItem.pledgedByMe && (
                <button
                  type="button"
                  disabled={busyId === pledgeModalItem.id}
                  onClick={() => submitPledge(pledgeModalItem, true)}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold bg-rose-500/15 text-rose-600"
                >
                  {copy.cancelPledge}
                </button>
              )}
              <button
                type="button"
                disabled={busyId === pledgeModalItem.id}
                onClick={() => submitPledge(pledgeModalItem, false)}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold ${
                  isDay ? 'bg-[#158509] text-white' : 'bg-amber-400 text-slate-950'
                }`}
              >
                {copy.confirmPledge}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
