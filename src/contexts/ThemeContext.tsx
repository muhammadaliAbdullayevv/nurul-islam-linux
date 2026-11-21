import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeMode } from '../types';
import { syncNativeSystemBarsTheme } from '../utils/nativePrayerBridge';

interface ThemeContextValue {
  theme: ThemeMode;
  isDay: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'day',
  isDay: true,
  setTheme: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('nq_theme');
    return saved === 'night' ? 'night' : 'day';
  });

  useEffect(() => {
    localStorage.setItem('nq_theme', theme);
    const root = document.documentElement;
    root.dataset.theme = theme;

    if (theme === 'day') {
      document.body.style.backgroundColor = '#ecf1f5';
      document.body.style.color = '#0f172a';
    } else {
      document.body.style.backgroundColor = '#020617';
      document.body.style.color = '#F1F5F9';
    }

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'day' ? '#0c4703' : '#051f05');
    }
    syncNativeSystemBarsTheme(theme === 'day');
  }, [theme]);

  const setTheme = (next: ThemeMode) => setThemeState(next);
  const toggleTheme = () => setThemeState((prev) => (prev === 'day' ? 'night' : 'day'));

  return (
    <ThemeContext.Provider value={{ theme, isDay: theme === 'day', setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
