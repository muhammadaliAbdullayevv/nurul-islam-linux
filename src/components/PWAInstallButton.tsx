import React, { useState } from 'react';
import { Download, Smartphone, X, Check, Copy, ExternalLink, Terminal } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Suppress when already running as installed standalone app
  if (isInstalled) {
    return null;
  }

  const appUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const handleCopyUrl = () => {
    if (!appUrl) return;
    navigator.clipboard.writeText(appUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-500/50 transition font-bold text-xs shadow-sm"
        title="Install Nurul Islam on Android or generate APK"
      >
        <Download className="w-3.5 h-3.5" />
        <span>{isInstallable ? 'Install App' : 'Get Android App'}</span>
      </button>

      {showGuideModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-emerald-700/70 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-900/60">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-900/70 text-amber-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Install on Android / Build APK</h3>
                  <p className="text-[11px] text-emerald-400">Standalone PWA & Android Package Guide</p>
                </div>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isIOS ? (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-900/50 space-y-2 text-xs">
                <h4 className="font-bold text-amber-300">Install on iPhone / iPad (Safari)</h4>
                <ol className="list-decimal list-inside space-y-1 text-slate-300">
                  <li>Tap the <strong>Share</strong> icon in the Safari toolbar.</li>
                  <li>Scroll down and select <strong>Add to Home Screen</strong>.</li>
                  <li>Tap <strong>Add</strong> to launch Nurul Islam fullscreen.</li>
                </ol>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                {/* Option 1: Direct Install on Android */}
                <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-800/60 space-y-2">
                  <h4 className="font-bold text-amber-300">Option 1: Install Directly on Android (Instant)</h4>
                  <p className="text-slate-300 leading-relaxed">
                    Nurul Islam is a full offline-capable Progressive Web App (PWA). Open this app URL in <strong>Chrome on Android</strong>, tap the menu (<strong>⋮</strong>) and choose <strong>Add to Home screen / Install app</strong>—Android installs it as a native-style app with its icon on your home screen.
                  </p>
                  {appUrl && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <input
                        readOnly
                        value={appUrl}
                        className="flex-1 bg-slate-950 border border-emerald-900 rounded-xl px-2.5 py-1.5 text-[11px] font-mono text-emerald-300 focus:outline-none"
                      />
                      <button
                        onClick={handleCopyUrl}
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1"
                      >
                        {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Option 2: Package as .APK */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-900/50 space-y-2">
                  <h4 className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-amber-400" />
                    <span>Option 2: Generate a Signed .APK File</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    This web workspace does not include the Android SDK/Gradle binary compiler, so an <code>.apk</code> cannot be compiled directly here. You can package this exact app into an installable <code>.apk</code> in two ways:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 text-slate-300">
                    <li>
                      <strong>PWABuilder (No code needed):</strong> Open{' '}
                      <a
                        href="https://www.pwabuilder.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-300 underline inline-flex items-center gap-0.5"
                      >
                        pwabuilder.com <ExternalLink className="w-3 h-3" />
                      </a>
                      , paste your shared app URL, and download the Android <strong>.apk</strong> package.
                    </li>
                    <li>
                      <strong>Capacitor (Local Android Studio):</strong> Download the ZIP below, extract it, and run{' '}
                      <code className="text-emerald-300">npm install &amp;&amp; npm run build &amp;&amp; npx cap add android</code>, then build the APK in Android Studio.
                    </li>
                  </ul>
                  <a
                    href="/nurul-quran-app.zip"
                    download="nurul-quran-app.zip"
                    className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Source Code (.ZIP)</span>
                  </a>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};
