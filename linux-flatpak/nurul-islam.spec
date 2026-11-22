Name:           nurul-islam
Version:        1.8.64
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
