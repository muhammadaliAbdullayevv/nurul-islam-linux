Name:           nurul-islam
Version:        1.8.77
Release:        1%{?dist}
Summary:        Holy Quran, Prayer Times, Tajweed & Hanafi Fiqh Companion
License:        MIT
URL:            https://nurulislam.mabdullayev.dev
Source0:        nurulislam-linux-%{version}.tar.gz
BuildArch:      noarch

Requires:       python3
Requires:       python3-gobject
Requires:       gtk3
Requires:       webkit2gtk4.1
Requires:       hicolor-icon-theme
Requires:       polkit

%description
Nurul Islam is a comprehensive, ad-free, offline-capable Islamic companion
designed with authentic Hanafi scholarship and multilingual support
(Uzbek Latin, Uzbek Cyrillic, English, and Russian). Includes the Holy Quran
(114 Surahs with audio, translation, and tafsir), accurate Prayer Times and
Ramadan calendar, 10-lesson Muallimi Sani and Tajweed trainer, Hifz trainer,
Everyday Hanafi Fiqh Q&A, 99 Names of Allah with 1v1 live quiz battle,
Digital Tasbih, Qazo tracker, Zakat calculator, and Verified Masjid Support.

%prep
%setup -q -c

%build
# Pre-built web assets and Python GTK3/WebKit2 launcher

%install
install -Dm755 nurulislam-desktop %{buildroot}%{_bindir}/nurulislam-desktop
install -Dm644 dev.mabdullayev.nurulislam.App.desktop %{buildroot}%{_datadir}/applications/dev.mabdullayev.nurulislam.App.desktop
install -Dm644 dev.mabdullayev.nurulislam.App.metainfo.xml %{buildroot}%{_datadir}/metainfo/dev.mabdullayev.nurulislam.App.metainfo.xml
install -Dm644 icon-512.png %{buildroot}%{_datadir}/icons/hicolor/512x512/apps/dev.mabdullayev.nurulislam.App.png
install -Dm644 icon-192.png %{buildroot}%{_datadir}/icons/hicolor/192x192/apps/dev.mabdullayev.nurulislam.App.png
install -Dm644 icon.svg %{buildroot}%{_datadir}/icons/hicolor/scalable/apps/dev.mabdullayev.nurulislam.App.svg
mkdir -p %{buildroot}%{_datadir}/nurulislam/www
cp -r www/* %{buildroot}%{_datadir}/nurulislam/www/

%files
%{_bindir}/nurulislam-desktop
%{_datadir}/applications/dev.mabdullayev.nurulislam.App.desktop
%{_datadir}/metainfo/dev.mabdullayev.nurulislam.App.metainfo.xml
%{_datadir}/icons/hicolor/512x512/apps/dev.mabdullayev.nurulislam.App.png
%{_datadir}/icons/hicolor/192x192/apps/dev.mabdullayev.nurulislam.App.png
%{_datadir}/icons/hicolor/scalable/apps/dev.mabdullayev.nurulislam.App.svg
%{_datadir}/nurulislam/

%changelog
* Tue Nov 24 2026 Muhammadali Abdullayev <admin@mabdullayev.dev> - 1.8.77-1
- Add instant zero-cache Live Sync (ETag 304 + 15s foreground refresh + immediate focus/visibility updates), per-device Owner Controls (direct messages with seen receipts, remote commands, feature mute, tester maintenance bypass, soft-block), city/version broadcast targeting, smart 5-star Play Store rating funnel, automatic crash reporting, and Owner Telegram alerts
* Tue Nov 24 2026 Muhammadali Abdullayev <admin@mabdullayev.dev> - 1.8.76-1
- Add live Remote App Config support (Hijri moon-sighting offset, Ramadan mode, feature switches, official Zakat Nisab notes, Quran Radio remote stream control, maintenance notices), in-app Feedback & Bug Reporting, dynamic Telegram/Privacy Policy links, accurate platform telemetry, and upgrade Owner Control Center to a full SaaS dashboard
* Mon Nov 23 2026 Muhammadali Abdullayev <admin@mabdullayev.dev> - 1.8.75-1
- Remove all AI-authored book texts and curate a 100% verbatim human-translated 31-book Islamic Library (11 full-length verified Uzbek classical books + 20 verbatim Arabic/Russian/English classics) with explicit translator credits, language badges on covers, language filter pills, and automatic native-language-first shelf sorting
* Mon Nov 23 2026 Muhammadali Abdullayev <admin@mabdullayev.dev> - 1.8.74-1
- Expand Islamic Library into a 41-book Hybrid Full-Length Library (700+ chapters, 3,800+ pages): 16 full-length offline bundled books + 25 cloud volumes auto-cached permanently in IndexedDB, with instant per-chapter swipe pagination and lightweight lazy catalog
* Mon Nov 23 2026 Muhammadali Abdullayev <admin@mabdullayev.dev> - 1.8.73-1
- Remove background star watermarks and sparkle glyphs from generated PNG share cards across Quran Ayahs, Hadiths, Duas, Wisdom, and Library book passages
* Mon Nov 23 2026 Muhammadali Abdullayev <admin@mabdullayev.dev> - 1.8.72-1
- Upgrade Islamic Library into a full-screen zero-scroll auto-paginated swipe book reader: pages fit the exact viewport without scrolling, turn interactively by swiping left/right (touch, mouse drag, or arrow keys), and automatically track reading progress with Next/Prev/Mark Read buttons removed
* Mon Nov 23 2026 Muhammadali Abdullayev <admin@mabdullayev.dev> - 1.8.71-1
- Bundle 168 100% offline Arabic MP3 clips (including Mishary Al-Afasy recitation for Al-Fatihah & Al-Ikhlas) fixing Muallimi Sani & Tajweed audio on all platforms, and redesign the Islamic Library into an authentic physical bound book experience with standing hardcover covers, stacked parchment pages, serif typography, drop caps, and swipe page-turning
* Mon Nov 23 2026 Muhammadali Abdullayev <admin@mabdullayev.dev> - 1.8.70-1
- Add 24/7 Live Quran Radio (16 verified streams with auto-failover, favorites & persistent background mini-player) and Classical Islamic Library (13 public-domain Hanafi & Central Asian classics with offline chapter e-reader, Sepia paper mode, progress tracking & PNG quote cards)
* Mon Nov 23 2026 Muhammadali Abdullayev <admin@mabdullayev.dev> - 1.8.69-1
- Add 1-tap Prayer Notification bell icon on Home prayer banner, simplify Settings, eliminate loading spinners on local tabs, redesign luxury honey-amber and jade Tasbih beads, highlight saved Quran ayahs with direct Back navigation to Profile, enlarge app header logo, and replace off-season Ramadan indicator with year-round Khatm progress
* Mon Nov 23 2026 Muhammadali Abdullayev <admin@mabdullayev.dev> - 1.8.68-1
- Redesign Profile and Settings: top-right Settings gear button on the green Profile hero banner, Saved Ayahs directly on Profile, modern sliding notification switch, and removal of technical clutter
* Mon Nov 23 2026 Muhammadali Abdullayev <admin@mabdullayev.dev> - 1.8.67-1
- Add custom Nurul Islam prayer notification chime sound with Chime/System/Silent selector and instant preview in Settings
* Sun Nov 22 2026 Muhammadali Abdullayev <admin@mabdullayev.dev> - 1.8.66-1
- Add persistent cross-tab Web/Linux Quran audio & mini-player with Media Session API, iOS Qibla compass permission, self-hosted offline fonts, JSON Backup & Restore, React ErrorBoundary, direct bookmark ayah jump, honest Web settings, and localStorage quota fix
* Sun Nov 22 2026 Muhammadali Abdullayev <admin@mabdullayev.dev> - 1.8.65-1
- Transform web edition into a full responsive website (widescreen desktop layout, edge-to-edge mobile web, URL hash routing, and localized PWA/APK/RPM download hub)
* Sun Nov 22 2026 Muhammadali Abdullayev <admin@mabdullayev.dev> - 1.8.64-1
- Bundle all 114 Surahs offline for instant Surah text loading, add Web/Linux offline Surah MP3 caching, and add modern PNG Share Cards for Quran Ayahs, Hadiths, Zikr, and Duas
* Sun Nov 22 2026 Muhammadali Abdullayev <admin@mabdullayev.dev> - 1.8.63-1
- Redesign Wisdom PNG Quote Card with modern Nurul Islam Day/Night emerald-and-gold palettes, elevated card layout, geometric watermarks, and app logo footer
* Sun Nov 22 2026 Muhammadali Abdullayev <admin@mabdullayev.dev> - 1.8.62-1
- Add Muhammad Sharif Gulkhani (Zarbulmasal) and enrich Scholars & Wisdom library to 9 scholars and 83 source-cited works
* Sun Nov 22 2026 Muhammadali Abdullayev <admin@mabdullayev.dev> - 1.8.61-1
- Make Juma Mode checklist fully customizable with Men/Women Hanafi presets, custom tasks, ordering, and visibility toggles
* Sun Nov 22 2026 Muhammadali Abdullayev <admin@mabdullayev.dev> - 1.8.60-1
- Compact Daily Hikmat banner, remove font size switcher, and add native Android & Linux Desktop PNG Quote Card sharing
* Sun Nov 22 2026 Muhammadali Abdullayev <admin@mabdullayev.dev> - 1.8.59-1
- Add Scholars & Wisdom (Allomalar va Hikmatlar) featuring 8 Movarounnahr masters (Yasawi, Naqshband, Navoi, Sufi Allahyar, Ghijduwani, Bukhari, Maturidi, Marghinani) with 48 curated works, commentary, and PNG Quote Card generator
* Sun Nov 22 2026 Muhammadali Abdullayev <admin@mabdullayev.dev> - 1.8.58-1
- Add native in-app & forced RPM self-updater (PolicyKit + DNF/RPM + auto-relaunch) matching mobile OTA flow
* Sun Nov 22 2026 Muhammadali Abdullayev <admin@mabdullayev.dev> - 1.8.57-1
- Release 1.8.57 with 60% smaller cold-start bundle, zero-spinner background tab prefetching, and gapless next-ayah audio pre-buffering
* Sat Nov 21 2026 Muhammadali Abdullayev <admin@mabdullayev.dev> - 1.8.56-1
- Release 1.8.56 with Muallimi Sani 10-lesson trainer, Hanafi Fiqh Q&A, and Seerah & 25 Prophets
