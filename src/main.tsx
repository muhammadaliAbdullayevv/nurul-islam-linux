import { createRoot } from 'react-dom/client';
import { Capacitor } from '@capacitor/core';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import { installGlobalErrorMonitor } from './utils/remoteAppConfig';
import './index.css';

installGlobalErrorMonitor();

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
  const hadController = Boolean(navigator.serviceWorker?.controller);
  let reloadedForSw = false;
  if ('serviceWorker' in navigator && hadController) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (reloadedForSw) return;
      reloadedForSw = true;
      window.location.reload();
    });
  }
  registerSW({
    immediate: true,
    onRegisteredSW(_swUrl, reg) {
      if (!reg) return;
      // Check for fresh web deploys smoothly whenever the user returns to the tab
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          void reg.update();
        }
      });
    },
  });
}

createRoot(document.getElementById('root')!).render(
  <AppErrorBoundary scope="root">
    <App />
  </AppErrorBoundary>
);
