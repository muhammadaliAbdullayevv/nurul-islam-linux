import { AppLanguage, AsrMethod, CalcMethod, Coordinates } from '../types';
import { calculatePrayerTimes, getCityCurrentDate, getHijriDate, getLocalizedCityLabel } from './prayerTimes';
import { formatFullGregorianDate, TranslationStrings } from '../contexts/LanguageContext';

export type AlertPrayerKey = 'imsak' | 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
export type PrayerAlertSoundMode = 'chime' | 'default' | 'silent';

export interface PrayerAlertPrefs {
  enabled: boolean;
  preReminderMins: 0 | 10 | 15;
  soundMode: PrayerAlertSoundMode;
  prayers: Record<AlertPrayerKey, boolean>;
}

const ALERT_PREFS_KEY = 'nq_prayer_alert_prefs';

export const DEFAULT_ALERT_PREFS: PrayerAlertPrefs = {
  enabled: false,
  preReminderMins: 0,
  soundMode: 'chime',
  prayers: {
    imsak: false,
    fajr: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
  },
};

export function loadAlertPrefs(): PrayerAlertPrefs {
  try {
    const raw = localStorage.getItem(ALERT_PREFS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PrayerAlertPrefs>;
      return {
        enabled: Boolean(parsed.enabled),
        preReminderMins: 0,
        soundMode: 'chime',
        prayers: {
          imsak: false,
          fajr: true,
          dhuhr: true,
          asr: true,
          maghrib: true,
          isha: true,
        },
      };
    }
  } catch {
    // Ignore storage error
  }
  return DEFAULT_ALERT_PREFS;
}

export function saveAlertPrefs(prefs: PrayerAlertPrefs): void {
  try {
    localStorage.setItem(ALERT_PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore storage error
  }
}

interface NativePrayerJsBridge {
  syncData: (payloadJson: string) => void;
  hasNotificationPermission: () => boolean;
  requestNotificationPermission: () => void;
  sendTestNotification: (prayerName: string, timeStr: string, city: string) => void;
  requestPinWidget: () => boolean;
  requestPinWidgetByKind?: (kind: string) => boolean;
  openExternalUrl?: (url: string) => boolean;
  setSystemBarsTheme?: (isDay: boolean) => void;
}

function getNativeBridge(): NativePrayerJsBridge | null {
  const win = window as Window & { NqNativeBridge?: NativePrayerJsBridge };
  return win.NqNativeBridge || null;
}

const ALERT_TEMPLATES: Record<
  AppLanguage,
  { alertTitle: string; reminderTitle: string; alertBody: string }
> = {
  uz_lat: {
    alertTitle: '{prayer} vaqti kirdi',
    reminderTitle: '{prayer} namoziga {mins} daqiqa qoldi',
    alertBody: '{city} · {time}',
  },
  uz_cyr: {
    alertTitle: '{prayer} вақти кирди',
    reminderTitle: '{prayer} намозига {mins} дақиқа қолди',
    alertBody: '{city} · {time}',
  },
  en: {
    alertTitle: '{prayer} Prayer Time',
    reminderTitle: '{mins} min until {prayer}',
    alertBody: '{city} · {time}',
  },
  ru: {
    alertTitle: 'Наступило время {prayer}',
    reminderTitle: 'До намаза {prayer} осталось {mins} мин',
    alertBody: '{city} · {time}',
  },
};

const WIDGET_LABELS: Record<
  AppLanguage,
  {
    nowLabel: string;
    nextLabel: string;
    suhoorLabel: string;
    iftorLabel: string;
    ramadanTitle: string;
    suhoorPhase: string;
    fastingPhase: string;
    iftorPhase: string;
  }
> = {
  uz_lat: {
    nowLabel: 'Hozir',
    nextLabel: 'Keyingi',
    suhoorLabel: 'Saharlik',
    iftorLabel: 'Iftorlik',
    ramadanTitle: 'Ramazon · Ro‘za',
    suhoorPhase: 'Saharlik vaqti',
    fastingPhase: 'Iftorgacha ro‘za',
    iftorPhase: 'Iftorlik vaqti',
  },
  uz_cyr: {
    nowLabel: 'Ҳозир',
    nextLabel: 'Кейинги',
    suhoorLabel: 'Саҳарлик',
    iftorLabel: 'Ифторлик',
    ramadanTitle: 'Рамазон · Рўза',
    suhoorPhase: 'Саҳарлик вақти',
    fastingPhase: 'Ифторгача рўза',
    iftorPhase: 'Ифторлик вақти',
  },
  en: {
    nowLabel: 'Now',
    nextLabel: 'Next',
    suhoorLabel: 'Suhoor',
    iftorLabel: 'Iftar',
    ramadanTitle: 'Ramadan · Fasting',
    suhoorPhase: 'Pre-Fajr Suhoor',
    fastingPhase: 'Fasting · To Iftar',
    iftorPhase: 'Iftar Time',
  },
  ru: {
    nowLabel: 'Сейчас',
    nextLabel: 'След.',
    suhoorLabel: 'Сухур',
    iftorLabel: 'Ифтар',
    ramadanTitle: 'Рамадан · Пост',
    suhoorPhase: 'Время сухура',
    fastingPhase: 'Пост до ифтара',
    iftorPhase: 'Время ифтара',
  },
};

export function syncNativeAlertsAndWidget(params: {
  currentCity: Coordinates;
  calcMethod: CalcMethod;
  asrMethod: AsrMethod;
  language: AppLanguage;
  t: TranslationStrings;
  alertPrefs: PrayerAlertPrefs;
}): void {
  const bridge = getNativeBridge();
  if (!bridge) return;

  const { currentCity, calcMethod, asrMethod, language, t, alertPrefs } = params;
  const loc = getLocalizedCityLabel(currentCity.cityName, currentCity.countryName, language, currentCity.region);
  const baseDate = getCityCurrentDate(new Date(), currentCity.timezone);
  const templates = ALERT_TEMPLATES[language];
  const widgetText = WIDGET_LABELS[language];

  const days = Array.from({ length: 14 }, (_, idx) => {
    const d = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + idx, 12, 0, 0);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const times = calculatePrayerTimes(
      d,
      currentCity.latitude,
      currentCity.longitude,
      calcMethod,
      asrMethod,
      currentCity.timezone
    );
    return {
      date: `${yyyy}-${mm}-${dd}`,
      gregorian: formatFullGregorianDate(d, language),
      hijri: getHijriDate(d, language),
      imsak: times.imsak,
      fajr: times.fajr,
      sunrise: times.sunrise,
      dhuhr: times.dhuhr,
      asr: times.asr,
      maghrib: times.maghrib,
      isha: times.isha,
    };
  });

  const payload = {
    city: loc.city,
    labels: {
      fajr: t.prayers.fajr,
      sunrise: t.prayers.sunrise,
      dhuhr: t.prayers.dhuhr,
      asr: t.prayers.asr,
      maghrib: t.prayers.maghrib,
      isha: t.prayers.isha,
      imsak: t.prayers.imsak,
      nowLabel: widgetText.nowLabel,
      nextLabel: widgetText.nextLabel,
      suhoorLabel: widgetText.suhoorLabel,
      iftorLabel: widgetText.iftorLabel,
      ramadanTitle: widgetText.ramadanTitle,
      suhoorPhase: widgetText.suhoorPhase,
      fastingPhase: widgetText.fastingPhase,
      iftorPhase: widgetText.iftorPhase,
      alertTitleTemplate: templates.alertTitle,
      reminderTitleTemplate: templates.reminderTitle,
      alertBodyTemplate: templates.alertBody,
    },
    alerts: alertPrefs,
    days,
  };

  try {
    bridge.syncData(JSON.stringify(payload));
  } catch {
    // Ignore bridge sync error
  }
}

export function isNativeAndroidBridgeAvailable(): boolean {
  return Boolean(getNativeBridge());
}

export function checkNativeNotificationPermission(): boolean {
  const bridge = getNativeBridge();
  if (bridge) {
    return bridge.hasNotificationPermission();
  }
  if (typeof Notification !== 'undefined') {
    return Notification.permission === 'granted';
  }
  return false;
}

export function requestNativeNotificationPermission(onResult?: (granted: boolean) => void): void {
  const bridge = getNativeBridge();
  if (bridge) {
    const win = window as Window & { __nqOnNotificationPermission?: (ok: boolean) => void };
    win.__nqOnNotificationPermission = (ok: boolean) => {
      onResult?.(ok);
      delete win.__nqOnNotificationPermission;
    };
    bridge.requestNotificationPermission();
    return;
  }

  if (typeof Notification !== 'undefined') {
    Notification.requestPermission()
      .then((res) => onResult?.(res === 'granted'))
      .catch(() => onResult?.(false));
  } else {
    onResult?.(false);
  }
}

let previewChimeAudio: HTMLAudioElement | null = null;

export function playPrayerChimePreview(): void {
  if (typeof Audio === 'undefined') return;
  try {
    if (!previewChimeAudio) {
      previewChimeAudio = new Audio('/sounds/prayer-chime.mp3');
      previewChimeAudio.preload = 'auto';
    }
    previewChimeAudio.pause();
    previewChimeAudio.currentTime = 0;
    void previewChimeAudio.play().catch(() => undefined);
  } catch {
    // Ignore audio playback errors
  }
}

export function triggerTestPrayerAlert(
  prayerName: string,
  timeStr: string,
  city: string,
  soundMode: PrayerAlertSoundMode = 'chime'
): void {
  const bridge = getNativeBridge();
  if (bridge) {
    bridge.sendTestNotification(prayerName, timeStr, city);
    return;
  }
  if (soundMode === 'chime') {
    playPrayerChimePreview();
  }
  if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    new Notification(`${prayerName} · ${timeStr}`, { body: city });
  }
}

export function pinPrayerHomeWidget(kind: 'rich' | 'strip' | 'ramadan' = 'rich'): boolean {
  const bridge = getNativeBridge();
  if (bridge) {
    if (typeof bridge.requestPinWidgetByKind === 'function') {
      return bridge.requestPinWidgetByKind(kind);
    }
    return bridge.requestPinWidget();
  }
  return false;
}

export function openExternalUrl(url: string): void {
  const bridge = getNativeBridge();
  if (bridge && typeof bridge.openExternalUrl === 'function') {
    const handled = bridge.openExternalUrl(url);
    if (handled) return;
  }
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function syncNativeSystemBarsTheme(isDay: boolean): void {
  const bridge = getNativeBridge();
  if (bridge && typeof bridge.setSystemBarsTheme === 'function') {
    try {
      bridge.setSystemBarsTheme(Boolean(isDay));
    } catch {
      // ignore bridge errors
    }
  }
}
