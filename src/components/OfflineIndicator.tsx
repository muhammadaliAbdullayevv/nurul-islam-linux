import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useLanguage } from '../contexts/LanguageContext';

const OFFLINE_LABELS = {
  uz_lat: 'Oflayn rejim — keshdagi suralar va namoz vaqtlari faol',
  uz_cyr: 'Офлайн режим — кешдаги суралар ва намоз вақтлари фаол',
  en: 'Offline Mode — Cached Surahs & Prayer Times Active',
  ru: 'Офлайн-режим — кэш сур и время намаза активны',
} as const;

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { language } = useLanguage();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-lg">
      <WifiOff className="w-3.5 h-3.5 shrink-0" />
      <span>{OFFLINE_LABELS[language]}</span>
    </div>
  );
};
