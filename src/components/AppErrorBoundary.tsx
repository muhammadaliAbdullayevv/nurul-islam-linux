import React from 'react';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';
import { AppLanguage } from '../types';

interface AppErrorBoundaryProps {
  children: React.ReactNode;
  scope?: 'root' | 'tab';
  onGoHome?: () => void;
  resetKey?: string;
}

interface AppErrorBoundaryState {
  hasError: boolean;
  isChunkError: boolean;
}

const CHUNK_RELOAD_GUARD_KEY = 'nq_chunk_reload_at';

function detectChunkError(err: unknown): boolean {
  const msg = String((err as Error)?.message || err || '');
  return (
    /Loading chunk|ChunkLoadError|Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(
      msg
    )
  );
}

function getSafeLang(): AppLanguage {
  try {
    const saved = localStorage.getItem('nq_language');
    if (saved === 'uz_lat' || saved === 'uz_cyr' || saved === 'ru' || saved === 'en') {
      return saved;
    }
  } catch {
    // ignore
  }
  return 'uz_lat';
}

const ERROR_COPY: Record<
  AppLanguage,
  {
    title: string;
    chunkTitle: string;
    desc: string;
    chunkDesc: string;
    reloadBtn: string;
    homeBtn: string;
  }
> = {
  uz_lat: {
    title: 'Kutilmagan xatolik yuz berdi',
    chunkTitle: 'Yangi versiya chiqdi yoki aloqa uzildi',
    desc: "Xavotir olmang — barcha saqlangan ma'lumotlaringiz joyida. Sahifani qayta yuklang.",
    chunkDesc: "Ilova yangilangan yoki internet vaqtincha uzilgan. Davom etish uchun qayta yuklang.",
    reloadBtn: 'Qayta yuklash',
    homeBtn: 'Asosiy sahifaga',
  },
  uz_cyr: {
    title: 'Кутилмаган хатолик юз берди',
    chunkTitle: 'Янги версия чиқди ёки алоқа узилди',
    desc: 'Хавотир олманг — барча сақланган маълумотларингиз жойида. Саҳифани қайта юкланг.',
    chunkDesc: 'Илова янгиланган ёки интернет вақтинча узилган. Давом этиш учун қайта юкланг.',
    reloadBtn: 'Қайта юклаш',
    homeBtn: 'Асосий саҳифага',
  },
  ru: {
    title: 'Произошла непредвиденная ошибка',
    chunkTitle: 'Вышло обновление или пропала сеть',
    desc: 'Не переживайте — все ваши данные сохранены. Просто обновите страницу.',
    chunkDesc: 'Приложение обновилось или интернет временно прервался. Перезагрузите страницу.',
    reloadBtn: 'Перезагрузить',
    homeBtn: 'На главную',
  },
  en: {
    title: 'Something went wrong',
    chunkTitle: 'New update available or connection lost',
    desc: 'Your saved progress and bookmarks are safe. Reload to continue smoothly.',
    chunkDesc: 'The app was updated or your network dipped briefly. Reload to refresh.',
    reloadBtn: 'Reload App',
    homeBtn: 'Go Home',
  },
};

export class AppErrorBoundary extends React.Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  constructor(props: AppErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, isChunkError: false };
  }

  static getDerivedStateFromError(error: unknown): AppErrorBoundaryState {
    return {
      hasError: true,
      isChunkError: detectChunkError(error),
    };
  }

  componentDidCatch(error: unknown): void {
    // Automatically recover once if a stale hashed JS chunk was requested right after a deploy
    if (detectChunkError(error)) {
      try {
        const lastReload = Number(sessionStorage.getItem(CHUNK_RELOAD_GUARD_KEY) || '0');
        if (!Number.isFinite(lastReload) || Date.now() - lastReload > 15_000) {
          sessionStorage.setItem(CHUNK_RELOAD_GUARD_KEY, String(Date.now()));
          window.location.reload();
        }
      } catch {
        // Ignore sessionStorage restrictions
      }
    }
  }

  componentDidUpdate(prevProps: AppErrorBoundaryProps): void {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false, isChunkError: false });
    }
  }

  render(): React.ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const lang = getSafeLang();
    const copy = ERROR_COPY[lang] || ERROR_COPY.uz_lat;
    const isRoot = this.props.scope === 'root';

    return (
      <div
        className={`${
          isRoot ? 'min-h-screen bg-[#ecf1f5] text-slate-900' : 'py-12'
        } flex items-center justify-center p-4`}
      >
        <div className="w-full max-w-sm rounded-3xl border border-[#dde3ea] bg-white dark:bg-slate-900 dark:border-emerald-900/60 p-6 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-display text-base font-extrabold text-slate-900 dark:text-white">
              {this.state.isChunkError ? copy.chunkTitle : copy.title}
            </h2>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {this.state.isChunkError ? copy.chunkDesc : copy.desc}
            </p>
          </div>
          <div className="flex items-center gap-2 pt-1">
            {this.props.onGoHome && (
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, isChunkError: false });
                  this.props.onGoHome?.();
                }}
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold inline-flex items-center justify-center gap-1.5 transition"
              >
                <Home className="w-3.5 h-3.5" />
                <span>{copy.homeBtn}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#158509] hover:bg-[#0c5007] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{copy.reloadBtn}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
