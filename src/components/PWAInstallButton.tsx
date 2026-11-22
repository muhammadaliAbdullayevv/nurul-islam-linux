import React, { useState } from 'react';
import { Capacitor } from '@capacitor/core';
import {
  Download,
  Smartphone,
  Monitor,
  Globe,
  X,
  Check,
  Copy,
  Share2,
  Sparkles,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { AppLanguage } from '../types';
import { DEFAULT_LINUX_RPM_URL, UPDATE_SITE_URL } from '../utils/appUpdater';
import { copyTextSafely } from '../utils/clipboard';

const APK_DOWNLOAD_URL = `${UPDATE_SITE_URL}/downloads/nurul-quran-latest.apk`;

interface InstallCopy {
  btnShort: string;
  btnFull: string;
  modalTitle: string;
  modalSub: string;
  pwaTitle: string;
  pwaDesc: string;
  pwaBtn: string;
  iosTitle: string;
  iosSteps: string[];
  androidBrowserHint: string;
  apkTitle: string;
  apkBadge: string;
  apkDesc: string;
  apkBtn: string;
  linuxTitle: string;
  linuxDesc: string;
  linuxBtn: string;
  shareTitle: string;
  copyBtn: string;
  copiedBtn: string;
  closeBtn: string;
}

const COPY: Record<AppLanguage, InstallCopy> = {
  uz_lat: {
    btnShort: 'Ilova',
    btnFull: 'Ilovani yuklab olish',
    modalTitle: 'Nurul Islam — Barcha qurilmalarda',
    modalSub: 'Veb-sayt, Android APK va Linux Desktop (100% bepul va reklamasiz)',
    pwaTitle: 'Brauzer orqali tezkor o‘rnatish (PWA)',
    pwaDesc:
      'Telefon yoki kompyuter bosh ekraniga o‘rnating — ilova kabi to‘liq ekranda va oflayn ishlaydi.',
    pwaBtn: 'Hozir o‘rnatish',
    iosTitle: 'iPhone / iPad (Safari) da o‘rnatish',
    iosSteps: [
      'Safari pastki panelidagi «Ulashish» (Share) tugmasini bosing.',
      'Pastga surib «Bosh ekranga qo‘shish» (Add to Home Screen) ni tanlang.',
      '«Qo‘shish» (Add) tugmasini bosing — Nurul Islam tayyor!',
    ],
    androidBrowserHint:
      'Chrome menyusidan (⋮) «Bosh ekranga qo‘shish» yoki «Ilovani o‘rnatish» ni tanlashingiz ham mumkin.',
    apkTitle: 'Android uchun rasmiy APK',
    apkBadge: 'Google Play tez kunda',
    apkDesc:
      'Google Play tasdiqlanishini kutmasdan, rasmiy imzolangan APK faylini yuklab olib to‘liq azon eslatmalari va oflayn Qur’ondan foydalaning.',
    apkBtn: 'Android APK yuklab olish',
    linuxTitle: 'Linux Desktop (Fedora RPM)',
    linuxDesc: 'Kompyuter uchun alohida keng ekranli dastur (avtomatik yangilanish bilan).',
    linuxBtn: 'Fedora RPM yuklab olish',
    shareTitle: 'Do‘stlar va yaqinlar bilan ulashing',
    copyBtn: 'Nusxalash',
    copiedBtn: 'Nusxalandi',
    closeBtn: 'Yopish',
  },
  uz_cyr: {
    btnShort: 'Илова',
    btnFull: 'Иловани юклаб олиш',
    modalTitle: 'Nurul Islam — Барча қурилмаларда',
    modalSub: 'Веб-сайт, Android APK ва Linux Desktop (100% бепул ва рекламасиз)',
    pwaTitle: 'Браузер орқали тезкор ўрнатиш (PWA)',
    pwaDesc:
      'Телефон ёки компьютер бош экранига ўрнатинг — илова каби тўлиқ экранда ва офлайн ишлайди.',
    pwaBtn: 'Ҳозир ўрнатиш',
    iosTitle: 'iPhone / iPad (Safari) да ўрнатиш',
    iosSteps: [
      'Safari пастки панелидаги «Улашиш» (Share) тугмасини босинг.',
      'Пастга суриб «Бош экранга қўшиш» (Add to Home Screen) ни танланг.',
      '«Қўшиш» (Add) тугмасини босинг — Nurul Islam тайёр!',
    ],
    androidBrowserHint:
      'Chrome менюсидан (⋮) «Бош экранга қўшиш» ёки «Иловани ўрнатиш» ни танлашингиз ҳам мумкин.',
    apkTitle: 'Android учун расмий APK',
    apkBadge: 'Google Play тез кунда',
    apkDesc:
      'Google Play тасдиқланишини кутмасдан, расмий имзоланган APK файлини юклаб олиб тўлиқ азон эслатмалари ва офлайн Қуръондан фойдаланинг.',
    apkBtn: 'Android APK юклаб олиш',
    linuxTitle: 'Linux Desktop (Fedora RPM)',
    linuxDesc: 'Компьютер учун алоҳида кенг экранли дастур (автоматик янгиланиш билан).',
    linuxBtn: 'Fedora RPM юклаб олиш',
    shareTitle: 'Дўстлар ва яқинлар билан улашинг',
    copyBtn: 'Нусхалаш',
    copiedBtn: 'Нусхаланди',
    closeBtn: 'Ёпиш',
  },
  ru: {
    btnShort: 'Скачать',
    btnFull: 'Установить приложение',
    modalTitle: 'Nurul Islam — На всех устройствах',
    modalSub: 'Веб-приложение, Android APK и Linux Desktop (без рекламы)',
    pwaTitle: 'Быстрая установка из браузера (PWA)',
    pwaDesc:
      'Добавьте на главный экран телефона или ПК — работает в полноэкранном режиме и офлайн.',
    pwaBtn: 'Установить сейчас',
    iosTitle: 'Установка на iPhone / iPad (Safari)',
    iosSteps: [
      'Нажмите кнопку «Поделиться» (Share) внизу Safari.',
      'Прокрутите вниз и выберите «На экран “Домой”» (Add to Home Screen).',
      'Нажмите «Добавить» — Nurul Islam откроется как полноценное приложение.',
    ],
    androidBrowserHint:
      'Также можно нажать меню Chrome (⋮) → «Установить приложение» / «Добавить на главный экран».',
    apkTitle: 'Официальный Android APK',
    apkBadge: 'Скоро в Google Play',
    apkDesc:
      'Пока идёт проверка в Google Play, вы можете установить подписанный официальный APK с уведомлениями об азане и офлайн-Кораном.',
    apkBtn: 'Скачать Android APK',
    linuxTitle: 'Linux Desktop (Fedora RPM)',
    linuxDesc: 'Полноценное десктопное приложение с автообновлением.',
    linuxBtn: 'Скачать Fedora RPM',
    shareTitle: 'Поделитесь сайтом с близкими',
    copyBtn: 'Копия',
    copiedBtn: 'Скопировано',
    closeBtn: 'Закрыть',
  },
  en: {
    btnShort: 'App',
    btnFull: 'Get the App',
    modalTitle: 'Nurul Islam — On Every Device',
    modalSub: 'Web App, Android APK & Linux Desktop (100% free & ad-free)',
    pwaTitle: 'Instant Browser Install (PWA)',
    pwaDesc:
      'Install directly to your phone or computer home screen for full-screen offline access.',
    pwaBtn: 'Install Now',
    iosTitle: 'Install on iPhone / iPad (Safari)',
    iosSteps: [
      'Tap the Share icon in the Safari toolbar.',
      'Scroll down and choose Add to Home Screen.',
      'Tap Add to launch Nurul Islam full-screen.',
    ],
    androidBrowserHint:
      'You can also open your browser menu (⋮) and tap Install App / Add to Home Screen.',
    apkTitle: 'Official Android APK',
    apkBadge: 'Google Play coming soon',
    apkDesc:
      'While Google Play review is pending, install our official signed APK for native Adhan alarms, home widgets, and offline Quran audio.',
    apkBtn: 'Download Android APK',
    linuxTitle: 'Linux Desktop (Fedora RPM)',
    linuxDesc: 'Native widescreen Linux desktop app with built-in updates.',
    linuxBtn: 'Download Fedora RPM',
    shareTitle: 'Share Nurul Islam with family & friends',
    copyBtn: 'Copy',
    copiedBtn: 'Copied',
    closeBtn: 'Close',
  },
};

interface PWAInstallButtonProps {
  compact?: boolean;
  onDarkBar?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  compact = false,
  onDarkBar = false,
}) => {
  const { isDay } = useTheme();
  const { language } = useLanguage();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const isDesktopApp =
    typeof window !== 'undefined' &&
    (new URLSearchParams(window.location.search).get('desktop') === '1' ||
      Boolean((window as Window & { __NQ_LINUX_DESKTOP__?: boolean }).__NQ_LINUX_DESKTOP__));

  // Hide inside native Android APK, Linux Desktop RPM, or already-installed standalone PWA
  if (Capacitor.isNativePlatform() || isDesktopApp || isInstalled) {
    return null;
  }

  const copy = COPY[language] || COPY.uz_lat;
  const siteUrl = UPDATE_SITE_URL;

  const handleCopyUrl = () => {
    void copyTextSafely(siteUrl);
    setCopiedUrl(true);
    window.setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleInstallPwa = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) {
        setShowModal(false);
      }
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className={
          onDarkBar
            ? 'flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold transition active:scale-95 shrink-0 shadow-xs'
            : isDay
            ? 'flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#158509] hover:bg-[#0c5007] text-white text-xs font-extrabold transition active:scale-95 shrink-0 shadow-xs nq-keep-dark'
            : 'flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold transition active:scale-95 shrink-0 shadow-xs'
        }
        title={copy.btnFull}
      >
        <Download className="w-3.5 h-3.5 shrink-0" />
        <span>{compact ? copy.btnShort : copy.btnFull}</span>
      </button>

      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          className="fixed inset-0 bg-black/65 backdrop-blur-sm z-[80] flex items-end sm:items-center justify-center p-3 sm:p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md rounded-3xl border p-5 space-y-3.5 shadow-2xl max-h-[90dvh] overflow-y-auto ${
              isDay
                ? 'bg-white border-[#dde3ea] text-slate-900'
                : 'bg-slate-900 border-emerald-800/80 text-slate-100'
            }`}
          >
            {/* Header */}
            <div
              className={`flex items-start justify-between gap-2 pb-3 border-b ${
                isDay ? 'border-slate-100' : 'border-emerald-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src="/pwa-192x192.png"
                  alt="Nurul Islam"
                  className="w-10 h-10 rounded-2xl border border-emerald-700/30 shadow-xs shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="font-display font-bold text-sm leading-tight truncate">
                    {copy.modalTitle}
                  </h3>
                  <p
                    className={`text-[11px] mt-0.5 leading-snug ${
                      isDay ? 'text-slate-500' : 'text-emerald-300/85'
                    }`}
                  >
                    {copy.modalSub}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className={`p-1.5 rounded-xl shrink-0 ${
                  isDay
                    ? 'bg-slate-100 text-slate-500 hover:text-slate-900'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
                aria-label={copy.closeBtn}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 1. Official Android APK Direct Download */}
            <div
              className={`p-3.5 rounded-2xl border space-y-2 ${
                isDay
                  ? 'bg-[#eef9ea] border-[#c5e8bc]'
                  : 'bg-emerald-950/60 border-emerald-800/70'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <h4
                  className={`text-xs font-extrabold flex items-center gap-1.5 ${
                    isDay ? 'text-[#0c4703]' : 'text-amber-300'
                  }`}
                >
                  <Smartphone className="w-4 h-4 shrink-0" />
                  <span>{copy.apkTitle}</span>
                </h4>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                    isDay
                      ? 'bg-white text-[#158509] border border-[#c5e8bc]'
                      : 'bg-amber-400/15 text-amber-300 border border-amber-400/35'
                  }`}
                >
                  {copy.apkBadge}
                </span>
              </div>
              <p
                className={`text-[11.5px] leading-relaxed ${
                  isDay ? 'text-slate-700' : 'text-slate-300'
                }`}
              >
                {copy.apkDesc}
              </p>
              <a
                href={APK_DOWNLOAD_URL}
                download="Nurul-Islam-release.apk"
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition active:scale-[0.98] ${
                  isDay
                    ? 'bg-[#158509] hover:bg-[#0c5007] text-white nq-keep-dark shadow-xs'
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-xs'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>{copy.apkBtn}</span>
              </a>
            </div>

            {/* 2. Install Web App (PWA) / iOS Safari Guide */}
            <div
              className={`p-3.5 rounded-2xl border space-y-2 ${
                isDay
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-slate-950/80 border-emerald-900/50'
              }`}
            >
              <h4
                className={`text-xs font-extrabold flex items-center gap-1.5 ${
                  isDay ? 'text-slate-900' : 'text-emerald-300'
                }`}
              >
                <Globe className="w-4 h-4 shrink-0" />
                <span>{isIOS ? copy.iosTitle : copy.pwaTitle}</span>
              </h4>

              {isIOS ? (
                <ol
                  className={`list-decimal list-inside space-y-1 text-[11.5px] leading-relaxed ${
                    isDay ? 'text-slate-700' : 'text-slate-300'
                  }`}
                >
                  {copy.iosSteps.map((stepText, idx) => (
                    <li key={idx}>{stepText}</li>
                  ))}
                </ol>
              ) : (
                <>
                  <p
                    className={`text-[11.5px] leading-relaxed ${
                      isDay ? 'text-slate-600' : 'text-slate-300'
                    }`}
                  >
                    {copy.pwaDesc}
                  </p>
                  {isInstallable ? (
                    <button
                      type="button"
                      onClick={() => void handleInstallPwa()}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition active:scale-[0.98] ${
                        isDay
                          ? 'bg-[#0c4703] hover:bg-[#158509] text-white nq-keep-dark'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{copy.pwaBtn}</span>
                    </button>
                  ) : (
                    <p
                      className={`text-[11px] leading-relaxed ${
                        isDay ? 'text-slate-500' : 'text-slate-400'
                      }`}
                    >
                      {copy.androidBrowserHint}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* 3. Linux Desktop RPM */}
            <div
              className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                isDay
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-slate-950/70 border-emerald-900/50'
              }`}
            >
              <div className="min-w-0">
                <h4 className="text-xs font-extrabold flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5 shrink-0 text-[#158509] dark:text-amber-400" />
                  <span className="truncate">{copy.linuxTitle}</span>
                </h4>
                <p
                  className={`text-[11px] leading-snug mt-0.5 ${
                    isDay ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  {copy.linuxDesc}
                </p>
              </div>
              <a
                href={DEFAULT_LINUX_RPM_URL}
                download="nurul-islam-latest.rpm"
                className={`px-3 py-2 rounded-xl text-[11px] font-extrabold shrink-0 border transition ${
                  isDay
                    ? 'bg-white border-[#c5e8bc] text-[#0c4703] hover:bg-[#eef9ea]'
                    : 'bg-slate-900 border-emerald-800 text-emerald-300 hover:bg-emerald-950'
                }`}
              >
                .RPM
              </a>
            </div>

            {/* 4. Quick Copy Website Link */}
            <div className="space-y-1.5">
              <p
                className={`text-[11px] font-bold flex items-center gap-1.5 ${
                  isDay ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copy.shareTitle}</span>
              </p>
              <div className="flex items-center gap-1.5">
                <input
                  readOnly
                  value={siteUrl}
                  className={`flex-1 rounded-xl border px-3 py-2 text-[11.5px] font-mono outline-none ${
                    isDay
                      ? 'bg-slate-50 border-slate-200 text-[#0c4703]'
                      : 'bg-slate-950 border-emerald-900/60 text-emerald-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 transition ${
                    isDay
                      ? 'bg-[#eef9ea] hover:bg-[#ddf3d6] text-[#0c4703] border border-[#c5e8bc]'
                      : 'bg-emerald-950 hover:bg-emerald-900 text-amber-300 border border-emerald-800'
                  }`}
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUrl ? copy.copiedBtn : copy.copyBtn}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
