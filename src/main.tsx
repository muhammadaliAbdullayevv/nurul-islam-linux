import { createRoot } from 'react-dom/client';
import { Capacitor } from '@capacitor/core';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

if (Capacitor.isNativePlatform()) {
  // Native APK bundles assets locally; unregister any prior PWA service worker so APK updates apply immediately.
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((reg) => reg.unregister());
    });
  }
  if ('caches' in window) {
    caches.keys().then((keys) => {
      keys.forEach((key) => caches.delete(key));
    });
  }
} else {
  registerSW({ immediate: true });
}

createRoot(document.getElementById('root')!).render(<App />);
