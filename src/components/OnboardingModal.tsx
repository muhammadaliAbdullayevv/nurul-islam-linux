import React, { useState } from 'react';
import { Bell, Check, ChevronLeft, ChevronRight, Globe, Loader2, MapPin, Navigation, Sparkles } from 'lucide-react';
import { AppLanguage, Coordinates } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { LANGUAGE_OPTIONS } from '../contexts/LanguageContext';
import { getLocalizedCityLabel } from '../utils/prayerTimes';
import {
  PrayerAlertPrefs,
  checkNativeNotificationPermission,
  requestNativeNotificationPermission,
} from '../utils/nativePrayerBridge';
import { LocationBrowser } from './LocationBrowser';

interface OnboardingModalProps {
  isOpen: boolean;
  onFinish: () => void;
  currentCity: Coordinates;
  onSelectCity: (city: Coordinates) => void;
  onDetectGPS: () => Promise<{ ok: boolean }>;
  onSelectLanguage: (lang: AppLanguage) => void;
  alertPrefs: PrayerAlertPrefs;
  onChangeAlertPrefs: (next: PrayerAlertPrefs) => void;
}

const INTRO_TEXT: Record<
  AppLanguage,
  {
    stepOf: (s: number, total: number) => string;
    step1Title: string;
    step1Desc: string;
    pickLangHint: string;
    step2Title: string;
    step2Desc: string;
    selectedLocLabel: string;
    notSelectedLoc: string;
    pickLocHint: string;
    detectGpsBtn: string;
    detectingGps: string;
    gpsDetected: string;
    gpsError: string;
    step3Title: string;
    step3Desc: string;
    enableNotifBtn: string;
    notifEnabledBadge: string;
    notifLaterHint: string;
    backBtn: string;
    nextBtn: string;
    startBtn: string;
  }
> = {
  uz_lat: {
    stepOf: (s, t) => `${s} / ${t}-qadam`,
    step1Title: 'Nurul Islamga xush kelibsiz',
    step1Desc: "Davom etish uchun ilova tilini tanlang",
    pickLangHint: "Davom etish uchun quyidagi tillardan birini tanlang",
    step2Title: 'Joylashuvingizni tanlang',
    step2Desc: "Shahar, tuman yoki qishlog'ingizni tanlang — namoz vaqtlari va Qibla aniq hisoblanadi.",
    selectedLocLabel: 'Tanlangan hudud:',
    notSelectedLoc: 'Hali tanlanmagan',
    pickLocHint: "Davom etish uchun GPS bosing yoki shahar, tuman yoxud qishlog'ingizni tanlang",
    detectGpsBtn: 'GPS orqali avtomatik aniqlash',
    detectingGps: 'Joylashuv aniqlanmoqda...',
    gpsDetected: 'Joylashuv muvaffaqiyatli aniqlandi',
    gpsError: "GPS yoqilmagan yoki ruxsat berilmadi — quyidan qo'lda tanlang",
    step3Title: 'Namoz eslatmalari',
    step3Desc: 'Har bir namoz vaqtida azon va eslatma xabarnomalarini oling.',
    enableNotifBtn: 'Bildirishnomalarni yoqish',
    notifEnabledBadge: 'Namoz eslatmalari yoqildi',
    notifLaterHint: "Istalgan vaqtda Profil bo'limidan o'zgartirishingiz mumkin.",
    backBtn: 'Orqaga',
    nextBtn: 'Davom etish',
    startBtn: 'Ilovani boshlash',
  },
  uz_cyr: {
    stepOf: (s, t) => `${s} / ${t}-қадам`,
    step1Title: 'Nurul Islam га хуш келибсиз',
    step1Desc: 'Давом этиш учун илова тилини танланг',
    pickLangHint: 'Давом этиш учун қуйидаги тиллардан бирини танланг',
    step2Title: 'Жойлашувингизни танланг',
    step2Desc: 'Шаҳар, туман ёки қишлоғингизни танланг — намоз вақтлари ва Қибла аниқ ҳисобланади.',
    selectedLocLabel: 'Танланган ҳудуд:',
    notSelectedLoc: 'Ҳали танланмаган',
    pickLocHint: 'Давом этиш учун GPS босинг ёки шаҳар, туман ёхуд қишлоғингизни танланг',
    detectGpsBtn: 'GPS орқали автоматик аниқлаш',
    detectingGps: 'Жойлашув аниқланмоқда...',
    gpsDetected: 'Жойлашув муваффақиятли аниқланди',
    gpsError: 'GPS ёқилмаган ёки рухсат берилмади — қуйидан қўлда танланг',
    step3Title: 'Намоз эслатмалари',
    step3Desc: 'Ҳар бир намоз вақтида азон ва эслатма хабарномаларини олинг.',
    enableNotifBtn: 'Билдиришномаларни ёқиш',
    notifEnabledBadge: 'Намоз эслатмалари ёқилди',
    notifLaterHint: 'Исталган вақтда Профил бўлимидан ўзгартиришингиз мумкин.',
    backBtn: 'Орқага',
    nextBtn: 'Давом этиш',
    startBtn: 'Иловани бошлаш',
  },
  ru: {
    stepOf: (s, t) => `Шаг ${s} из ${t}`,
    step1Title: 'Добро пожаловать в Nurul Islam',
    step1Desc: 'Выберите удобный язык интерфейса и переводов',
    pickLangHint: 'Выберите язык из списка, чтобы продолжить',
    step2Title: 'Укажите местоположение',
    step2Desc: 'Выберите город, район или село для точного расписания намаза и Киблы.',
    selectedLocLabel: 'Выбранный регион:',
    notSelectedLoc: 'Ещё не выбрано',
    pickLocHint: 'Нажмите GPS или выберите город, район либо село ниже',
    detectGpsBtn: 'Определить автоматически (GPS)',
    detectingGps: 'Определяем местоположение...',
    gpsDetected: 'Местоположение определено',
    gpsError: 'Не удалось получить GPS — выберите вручную ниже',
    step3Title: 'Уведомления о намазе',
    step3Desc: 'Получайте своевременные напоминания и азан к каждому намазу.',
    enableNotifBtn: 'Включить уведомления',
    notifEnabledBadge: 'Уведомления включены',
    notifLaterHint: 'Вы всегда можете изменить это в разделе Профиль.',
    backBtn: 'Назад',
    nextBtn: 'Далее',
    startBtn: 'Начать',
  },
  en: {
    stepOf: (s, t) => `Step ${s} of ${t}`,
    step1Title: 'Welcome to Nurul Islam',
    step1Desc: 'Choose your preferred language to get started',
    pickLangHint: 'Select a language above to continue',
    step2Title: 'Set Your Location',
    step2Desc: 'Select your city, district, or village for accurate prayer times and Qibla.',
    selectedLocLabel: 'Selected location:',
    notSelectedLoc: 'Not selected yet',
    pickLocHint: 'Tap GPS or choose your city, district, or village below to continue',
    detectGpsBtn: 'Detect Automatically (GPS)',
    detectingGps: 'Detecting location...',
    gpsDetected: 'Location detected successfully',
    gpsError: 'GPS unavailable or denied — choose manually below',
    step3Title: 'Prayer Notifications',
    step3Desc: 'Get timely Adhan and pre-prayer reminders for daily prayers.',
    enableNotifBtn: 'Enable Notifications',
    notifEnabledBadge: 'Prayer notifications enabled',
    notifLaterHint: 'You can customize or disable alerts anytime in Profile.',
    backBtn: 'Back',
    nextBtn: 'Continue',
    startBtn: 'Start Using App',
  },
};

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onFinish,
  currentCity,
  onSelectCity,
  onDetectGPS,
  onSelectLanguage,
  alertPrefs,
  onChangeAlertPrefs,
}) => {
  const { isDay } = useTheme();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  // Start with NO language chosen by default; display intro UI in Uzbek Latin until user taps one
  const [selectedLang, setSelectedLang] = useState<AppLanguage | null>(null);
  // Start with NO location confirmed until user detects via GPS or selects a city/district/village
  const [hasPickedLocation, setHasPickedLocation] = useState(false);
  const [gpsState, setGpsState] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle');
  const [notifDenied, setNotifDenied] = useState(false);

  if (!isOpen) return null;

  const uiLang: AppLanguage = selectedLang || 'uz_lat';
  const ui = INTRO_TEXT[uiLang] || INTRO_TEXT.uz_lat;
  const loc = getLocalizedCityLabel(
    currentCity.cityName,
    currentCity.countryName,
    uiLang,
    currentCity.region
  );

  const selectedLocationSubtitle = [
    currentCity.subtitle,
    loc.region && currentCity.region !== 'world' ? loc.region : '',
    loc.country,
  ]
    .filter(Boolean)
    .join(', ');

  const handleChooseLanguage = (langId: AppLanguage) => {
    setSelectedLang(langId);
    onSelectLanguage(langId);
  };

  const handleChooseCity = (city: Coordinates) => {
    onSelectCity(city);
    setHasPickedLocation(true);
    setGpsState('idle');
  };

  const handleGps = async () => {
    setGpsState('loading');
    try {
      const res = await onDetectGPS();
      if (res.ok) {
        setGpsState('ok');
        setHasPickedLocation(true);
      } else {
        setGpsState('err');
      }
    } catch {
      setGpsState('err');
    }
  };

  const handleEnableNotifications = () => {
    setNotifDenied(false);
    const alreadyGranted = checkNativeNotificationPermission();
    if (alreadyGranted) {
      onChangeAlertPrefs({ ...alertPrefs, enabled: true });
      return;
    }
    requestNativeNotificationPermission((granted) => {
      if (granted) {
        onChangeAlertPrefs({ ...alertPrefs, enabled: true });
      } else {
        setNotifDenied(true);
      }
    });
  };

  const canProceed =
    step === 1 ? selectedLang !== null : step === 2 ? hasPickedLocation : true;

  return (
    <div
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), var(--safe-area-inset-top, 0px), 12px)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), var(--safe-area-inset-bottom, 0px), 12px)',
      }}
      className={`fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-4 backdrop-blur-md animate-in fade-in ${
        isDay ? 'bg-[#ecf1f5]/95 text-slate-900' : 'bg-slate-950/95 text-slate-100'
      }`}
    >
      <div
        className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden flex flex-col ${
          step === 2 ? 'h-[90vh] max-h-[90vh]' : 'max-h-[90vh]'
        } ${
          isDay
            ? 'bg-white border-[#dde3ea]'
            : 'bg-slate-900 border-emerald-800/70'
        }`}
      >
        {/* Top Progress Bar (No Skip Button) */}
        <div
          className={`px-5 pt-4 pb-3 flex items-center justify-between border-b shrink-0 ${
            isDay ? 'border-slate-100' : 'border-emerald-950/80'
          }`}
        >
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((dot) => (
              <span
                key={dot}
                className={`h-2 rounded-full transition-all duration-200 ${
                  step === dot
                    ? `w-6 ${isDay ? 'bg-[#158509]' : 'bg-amber-400'}`
                    : step > dot
                    ? `w-2 ${isDay ? 'bg-[#158509]/50' : 'bg-emerald-500'}`
                    : `w-2 ${isDay ? 'bg-slate-200' : 'bg-slate-800'}`
                }`}
              />
            ))}
            <span className={`ml-1.5 text-[11px] font-semibold ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
              {ui.stepOf(step, 3)}
            </span>
          </div>
        </div>

        {/* Body */}
        {step === 1 && (
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
            <div className="space-y-5 animate-in fade-in">
              <div className="text-center space-y-2.5">
                <img
                  src="/pwa-192x192.png"
                  alt="Nurul Islam"
                  className="w-16 h-16 rounded-2xl mx-auto shadow-lg border border-emerald-700/30"
                />
                <h2 className="font-display text-xl font-bold tracking-tight">
                  {ui.step1Title}
                </h2>
                <p className={`text-xs leading-relaxed ${isDay ? 'text-slate-600' : 'text-slate-300'}`}>
                  {ui.step1Desc}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {LANGUAGE_OPTIONS.map((opt) => {
                  const selected = selectedLang === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleChooseLanguage(opt.id)}
                      className={`w-full px-4 py-3.5 rounded-2xl border flex items-center justify-between transition active:scale-[0.99] ${
                        selected
                          ? isDay
                            ? 'bg-[#eef9ea] border-[#158509] text-[#0c4703] shadow-xs'
                            : 'bg-emerald-950/70 border-amber-400 text-amber-300 shadow-xs'
                          : isDay
                          ? 'bg-[#ecf1f5] border-[#dde3ea] text-slate-800 hover:bg-slate-100'
                          : 'bg-slate-950 border-slate-800 text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Globe
                          className={`w-4 h-4 shrink-0 ${
                            selected
                              ? isDay
                                ? 'text-[#158509]'
                                : 'text-amber-400'
                              : 'text-slate-400'
                          }`}
                        />
                        <div className="text-left">
                          <p className="text-sm font-bold">{opt.nativeLabel}</p>
                          <p className={`text-[11px] ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                            {opt.label}
                          </p>
                        </div>
                      </div>
                      {selected && (
                        <Check className={`w-4 h-4 shrink-0 ${isDay ? 'text-[#158509]' : 'text-amber-400'}`} />
                      )}
                    </button>
                  );
                })}
              </div>

              {!selectedLang && (
                <p className={`text-center text-[11px] font-medium ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                  {ui.pickLangHint}
                </p>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-4 sm:p-5 flex flex-col min-h-0 flex-1 space-y-3 animate-in fade-in">
            <div className="text-center space-y-1 shrink-0">
              <h2 className="font-display text-lg font-bold">{ui.step2Title}</h2>
              <p className={`text-[11px] leading-relaxed ${isDay ? 'text-slate-600' : 'text-slate-300'}`}>
                {ui.step2Desc}
              </p>
            </div>

            {/* Selected Location Status Card */}
            <div
              className={`px-3.5 py-2.5 rounded-2xl border flex items-center justify-between gap-2 shrink-0 ${
                hasPickedLocation
                  ? isDay
                    ? 'bg-[#eef9ea] border-[#b7e4ae]'
                    : 'bg-emerald-950/60 border-emerald-700'
                  : isDay
                  ? 'bg-[#ecf1f5] border-[#dde3ea]'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <MapPin
                  className={`w-4 h-4 shrink-0 ${
                    hasPickedLocation
                      ? isDay
                        ? 'text-[#158509]'
                        : 'text-amber-400'
                      : 'text-slate-400'
                  }`}
                />
                <div className="min-w-0">
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                    {ui.selectedLocLabel}
                  </p>
                  {hasPickedLocation ? (
                    <>
                      <p className={`text-xs font-bold truncate ${isDay ? 'text-[#0c4703]' : 'text-amber-200'}`}>
                        {loc.city}
                      </p>
                      <p className={`text-[10px] truncate ${isDay ? 'text-[#158509]' : 'text-emerald-400'}`}>
                        {selectedLocationSubtitle}
                      </p>
                    </>
                  ) : (
                    <p className={`text-xs font-semibold ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                      {ui.notSelectedLoc}
                    </p>
                  )}
                </div>
              </div>
              {hasPickedLocation && (
                <Check className={`w-4 h-4 shrink-0 ${isDay ? 'text-[#158509]' : 'text-amber-400'}`} />
              )}
            </div>

            {/* GPS Auto-Detect Button */}
            <div className="space-y-1.5 shrink-0">
              <button
                type="button"
                onClick={handleGps}
                disabled={gpsState === 'loading'}
                className="w-full py-2.5 px-4 rounded-2xl bg-[#158509] hover:bg-[#0c5007] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.99] disabled:opacity-60"
              >
                {gpsState === 'loading' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4" />
                )}
                <span>{gpsState === 'loading' ? ui.detectingGps : ui.detectGpsBtn}</span>
              </button>

              {gpsState === 'ok' && (
                <p className="text-center text-[11px] font-semibold text-[#158509] flex items-center justify-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>{ui.gpsDetected}</span>
                </p>
              )}
              {gpsState === 'err' && (
                <p className="text-center text-[11px] font-medium text-amber-600 dark:text-amber-400">
                  {ui.gpsError}
                </p>
              )}
            </div>

            {/* Inline Cities, Districts & Villages Picker */}
            <LocationBrowser
              selectedCity={hasPickedLocation ? currentCity : null}
              onSelectCity={handleChooseCity}
            />
          </div>
        )}

        {step === 3 && (
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
            <div className="space-y-5 animate-in fade-in">
              <div className="text-center space-y-2">
                <div
                  className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center ${
                    isDay ? 'bg-[#eef9ea] text-[#158509]' : 'bg-emerald-950 text-amber-400'
                  }`}
                >
                  <Bell className="w-7 h-7" />
                </div>
                <h2 className="font-display text-lg font-bold">{ui.step3Title}</h2>
                <p className={`text-xs leading-relaxed ${isDay ? 'text-slate-600' : 'text-slate-300'}`}>
                  {ui.step3Desc}
                </p>
              </div>

              {alertPrefs.enabled ? (
                <div
                  className={`p-4 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold ${
                    isDay
                      ? 'bg-[#eef9ea] border-[#c5e8bc] text-[#0c4703]'
                      : 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{ui.notifEnabledBadge}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleEnableNotifications}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#158509] hover:bg-[#0c5007] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition active:scale-[0.99]"
                >
                  <Bell className="w-4 h-4" />
                  <span>{ui.enableNotifBtn}</span>
                </button>
              )}

              {notifDenied && (
                <p className="text-center text-xs text-amber-600 dark:text-amber-400">
                  {ui.notifLaterHint}
                </p>
              )}

              <p className={`text-center text-[11px] ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
                {ui.notifLaterHint}
              </p>
            </div>
          </div>
        )}

        {/* Footer Controls */}
        <div
          className={`px-5 py-3.5 border-t shrink-0 space-y-2 ${
            isDay ? 'border-slate-100 bg-slate-50/70' : 'border-emerald-950/80 bg-slate-950/60'
          }`}
        >
          {step === 2 && !hasPickedLocation && (
            <p className={`text-center text-[11px] font-medium ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>
              {ui.pickLocHint}
            </p>
          )}
          <div className="flex items-center gap-2.5">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev === 3 ? 2 : 1))}
                className={`px-4 py-3 rounded-2xl border text-xs font-semibold flex items-center gap-1 transition ${
                  isDay
                    ? 'bg-white border-[#dde3ea] text-slate-700 hover:bg-slate-50'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{ui.backBtn}</span>
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                disabled={!canProceed}
                onClick={() => {
                  if (!canProceed) return;
                  setStep((prev) => (prev === 1 ? 2 : 3));
                }}
                className="flex-1 py-3 px-4 rounded-2xl bg-[#158509] hover:bg-[#0c5007] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>{ui.nextBtn}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onFinish}
                className="flex-1 py-3 px-4 rounded-2xl bg-[#158509] hover:bg-[#0c5007] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition active:scale-[0.99]"
              >
                <Sparkles className="w-4 h-4" />
                <span>{ui.startBtn}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
