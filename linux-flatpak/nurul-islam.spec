Name:           nurul-islam
Version:        1.8.58
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
* Sun Nov 22 2026 Muhammadali Abdullayev <admin@mabdullayev.dev> - 1.8.58-1
- Add native in-app & forced RPM self-updater (PolicyKit + DNF/RPM + auto-relaunch) matching mobile OTA flow
* Sun Nov 22 2026 Muhammadali Abdullayev <admin@mabdullayev.dev> - 1.8.57-1
- Release 1.8.57 with 60% smaller cold-start bundle, zero-spinner background tab prefetching, and gapless next-ayah audio pre-buffering
* Sat Nov 21 2026 Muhammadali Abdullayev <admin@mabdullayev.dev> - 1.8.56-1
- Release 1.8.56 with Muallimi Sani 10-lesson trainer, Hanafi Fiqh Q&A, and Seerah & 25 Prophets
