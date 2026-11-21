import React from 'react';

interface IconProps {
  className?: string;
  strokeWidth?: number;
}

/** Holy Quran Mushaf resting on a traditional wooden Rahl stand. */
export const MushafIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', strokeWidth = 1.9 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M3.5 6.5 12 9.5l8.5-3v7.8L12 17.3l-8.5-3z"
      fill="currentColor"
      fillOpacity="0.15"
    />
    <path d="M12 9.5v7.8" />
    <path d="M6.2 10.2 9.5 11.4M17.8 10.2l-3.3 1.2" />
    {/* Wooden Rahl stand */}
    <path d="M6 20.5 12 16l6 4.5" />
    <path d="M8.5 18.6h7" />
  </svg>
);

/** Ramadan Fanoos lantern beside crescent moon. */
export const RamadanLanternIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', strokeWidth = 1.9 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M9.5 3v2M7 7.5h5l-1-2.5H8z" />
    <path
      d="M6.5 7.5h6l1 6.5-1.5 4h-5l-1.5-4z"
      fill="currentColor"
      fillOpacity="0.16"
    />
    <path d="M6.5 18h6l.8 2.5H5.7z" />
    <path d="M9.5 10.8v3.2" />
    {/* Crescent moon on top-right */}
    <path
      d="M18.8 5.2a3.6 3.6 0 1 0 2.5 6 2.8 2.8 0 0 1-2.5-6z"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);

/** Mosque dome & minaret paired with prayer-time clock dial. */
export const PrayerTimeIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', strokeWidth = 1.9 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* Minaret spire on left */}
    <path d="M4.5 20.5v-9l1.2-2.2L7 11.5v9" />
    <path d="M5.7 7.3v2" />
    {/* Clock dial */}
    <circle cx="14" cy="14" r="6.5" fill="currentColor" fillOpacity="0.15" />
    <path d="M14 10.6v3.6l2.4 1.5" />
    {/* Crescent crest */}
    <path d="M14 3.5v2" />
    <path d="M12.3 5.2a2.5 2.5 0 0 1 3.4 0" />
  </svg>
);

/** Compass aligned cleanly toward the Holy Kaaba. */
export const QiblaKaabaIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', strokeWidth = 1.9 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="13" r="8.2" fill="currentColor" fillOpacity="0.1" />
    {/* Kaaba cube in upper center */}
    <rect x="9.5" y="2.5" width="5" height="4.8" rx="0.8" fill="currentColor" />
    <path d="M9.8 4.4h4.4" stroke="#ffffff" strokeOpacity="0.8" strokeWidth="1.1" />
    {/* Directional compass arrow pointing toward Kaaba */}
    <path d="m12 9.2 3 7-3-1.6-3 1.6z" fill="currentColor" fillOpacity="0.35" />
  </svg>
);

/** Wudu water droplet & Prayer mat Mihrab arch (Tahorat & Namoz). */
export const WuduNamozGuideIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', strokeWidth = 1.9 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* Prayer mat with Mihrab arch */}
    <rect x="4" y="4" width="11.5" height="16.5" rx="2" fill="currentColor" fillOpacity="0.14" />
    <path d="M6.8 18v-5.8c0-2.2 1.4-3.7 3-4.6 1.6.9 3 2.4 3 4.6V18" />
    {/* Pure Wudu water drop on right */}
    <path
      d="M18.4 7.5c1.8 2.6 2.8 4.4 2.8 6a2.8 2.8 0 0 1-5.6 0c0-1.6 1-3.4 2.8-6z"
      fill="currentColor"
      fillOpacity="0.28"
    />
  </svg>
);

/** Authentic Mosque Dome, Twin Minarets & Mihrab Door (Nearby Masjids). */
export const MasjidDomeIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', strokeWidth = 1.85 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* Central Dome */}
    <path d="M12 2.4v2" />
    <path
      d="M7 12.2c0-3.3 2.2-5.7 5-7.4 2.8 1.7 5 4.1 5 7.4z"
      fill="currentColor"
      fillOpacity="0.2"
    />
    {/* Base & Twin Minarets */}
    <path d="M3.5 20.5v-8.8l1.2-2.2L6 11.7v8.8" />
    <path d="M18 20.5v-8.8l1.3-2.2 1.2 2.2v8.8" />
    <path d="M6 12.2h12v8.3H6z" fill="currentColor" fillOpacity="0.12" />
    {/* Arched mosque doorway */}
    <path d="M10.2 20.5v-3.8a1.8 1.8 0 0 1 3.6 0v3.8" />
  </svg>
);

/** Radiant Friday Sun rising behind Mosque Dome (Juma Mode). */
export const JumaMinbarSunIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', strokeWidth = 1.9 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* Rays of Juma morning */}
    <path d="M12 2.5v2M5.4 5.2l1.4 1.4M18.6 5.2l-1.4 1.4M3.5 11h2M18.5 11h2" />
    {/* Rising sun halo behind dome */}
    <path d="M7.5 12.5a4.5 4.5 0 0 1 9 0" fill="currentColor" fillOpacity="0.18" />
    {/* Mosque silhouette in foreground */}
    <path d="M6 20.5v-5.8c1.8-2 3.8-3.2 6-4.2 2.2 1 4.2 2.2 6 4.2v5.8z" fill="currentColor" fillOpacity="0.22" />
    <path d="M10.4 20.5v-3.2a1.6 1.6 0 0 1 3.2 0v3.2" />
  </svg>
);

/** Ornamental Islamic 8-point Star Medallion for 99 Names of Allah. */
export const AllahNamesIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', strokeWidth = 1.85 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="4.5" y="4.5" width="15" height="15" rx="1.8" fill="currentColor" fillOpacity="0.12" />
    <rect
      x="4.5"
      y="4.5"
      width="15"
      height="15"
      rx="1.8"
      transform="rotate(45 12 12)"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <text
      x="12"
      y="14.7"
      textAnchor="middle"
      fill="currentColor"
      stroke="none"
      fontSize="8.2"
      fontWeight="800"
      fontFamily="system-ui, sans-serif"
    >
      99
    </text>
  </svg>
);

/** Generous giving hand cradling a Crescent Coin (Zakat Calculator). */
export const ZakatHandsIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', strokeWidth = 1.9 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* Coin */}
    <circle cx="13.5" cy="7.5" r="4.3" fill="currentColor" fillOpacity="0.2" />
    <path d="M13.5 5.4v4.2M12 6.8l1.5-1.4L15 6.8" />
    {/* Open giving palm */}
    <path d="M3.5 15.5h5.2l3.8 1.6h4.2c1.2 0 2 .9 1.6 1.9-.3.8-1.2 1.2-2.2 1.2H10.5l-4.2-1.4H3.5z" fill="currentColor" fillOpacity="0.16" />
    <path d="M3.5 14.5v5.5" />
  </svg>
);

/** Prayer Makeup Logbook with Crescent Badge & Checkmarks (Qazo Tracker). */
export const QazoTrackerIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', strokeWidth = 1.9 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="4.5" y="4.5" width="15" height="16" rx="2.5" fill="currentColor" fillOpacity="0.14" />
    <path d="M8.5 2.8v3.2M15.5 2.8v3.2M4.5 9h15" />
    <path d="m8.2 13.8 1.6 1.6 3.2-3.2" />
    <path d="M14.8 14.8h2.2" />
    <path d="m8.2 17.6 1.2 1.2 2-2" />
    <path d="M13.8 18h3.2" />
  </svg>
);

/** Raised cupped palms in supplication (Duolar). */
export const DuaHandsIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', strokeWidth = 2 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M5 10.5V6.2c0-.9 1.2-1.2 1.6-.4l2.2 4.6" />
    <path
      d="M3.2 13.5 4.9 9.8c.4-.9 1.7-.7 1.9.2l1.2 5.4c.3 1.4 1.4 2.4 2.8 2.6v3H6.2c-2 0-3.4-1.8-3-3.8z"
      fill="currentColor"
      fillOpacity="0.16"
    />
    <path d="M19 10.5V6.2c0-.9-1.2-1.2-1.6-.4l-2.2 4.6" />
    <path
      d="M20.8 13.5 19.1 9.8c-.4-.9-1.7-.7-1.9.2l-1.2 5.4c-.3 1.4-1.4 2.4-2.8 2.6v3h4.6c2 0 3.4-1.8 3-3.8z"
      fill="currentColor"
      fillOpacity="0.16"
    />
    <path d="M12 3v2.2M10.4 4.2l.8.9M13.6 4.2l-.8.9" />
  </svg>
);

/** Open Hadith volume with crescent emblem (Hadislar). */
export const HadithBookIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', strokeWidth = 2 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 7.2v12.3" />
    <path
      d="M3.5 6.8A2 2 0 0 1 5.5 5H10a2.5 2.5 0 0 1 2 1 2.5 2.5 0 0 1 2-1h4.5a2 2 0 0 1 2 1.8v11.5a1.5 1.5 0 0 1-1.5 1.5H14a2.5 2.5 0 0 0-2 1 2.5 2.5 0 0 0-2-1H5a1.5 1.5 0 0 1-1.5-1.5z"
      fill="currentColor"
      fillOpacity="0.15"
    />
    <path d="M6.5 9.5h3M6.5 13h3M14.5 13h3" />
    <path d="M16.4 8.2a1.7 1.7 0 1 0 1.3 2.7 1.3 1.3 0 0 1-1.3-2.7z" fill="currentColor" stroke="none" />
  </svg>
);

/** Prayer beads loop with Imam bead & tassel (Zikrlar / Tasbeh). */
export const ZikrBeadsIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', strokeWidth = 2 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2.4v2.3" />
    <circle cx="12" cy="6.2" r="1.45" fill="currentColor" stroke="none" />
    <circle cx="8.2" cy="7.7" r="1.45" fill="currentColor" fillOpacity="0.25" />
    <circle cx="5.4" cy="10.7" r="1.45" fill="currentColor" fillOpacity="0.25" />
    <circle cx="5.0" cy="14.6" r="1.45" fill="currentColor" fillOpacity="0.25" />
    <circle cx="7.2" cy="18.2" r="1.45" fill="currentColor" fillOpacity="0.25" />
    <circle cx="10.4" cy="20.2" r="1.45" fill="currentColor" fillOpacity="0.25" />
    <circle cx="13.6" cy="20.2" r="1.45" fill="currentColor" fillOpacity="0.25" />
    <circle cx="16.8" cy="18.2" r="1.45" fill="currentColor" fillOpacity="0.25" />
    <circle cx="19.0" cy="14.6" r="1.45" fill="currentColor" fillOpacity="0.25" />
    <circle cx="18.6" cy="10.7" r="1.45" fill="currentColor" fillOpacity="0.25" />
    <circle cx="15.8" cy="7.7" r="1.45" fill="currentColor" fillOpacity="0.25" />
  </svg>
);

/** Classical 8-pointed Rub el-Hizb Quran Ayah emblem (Oyatlar). */
export const RubElHizbIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', strokeWidth = 1.9 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="5" y="5" width="14" height="14" rx="1.5" fill="currentColor" fillOpacity="0.14" />
    <rect x="5" y="5" width="14" height="14" rx="1.5" transform="rotate(45 12 12)" fill="currentColor" fillOpacity="0.1" />
    <circle cx="12" cy="12" r="2.3" fill="currentColor" stroke="none" />
  </svg>
);

/** Crisp Shield/Pillar badge with bold "40" inside (40 Farz). */
export const FortyFardIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', strokeWidth = 2 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M12 2.8 4.5 5.8v5.5c0 4.9 3.2 8.9 7.5 10 4.3-1.1 7.5-5.1 7.5-10V5.8z"
      fill="currentColor"
      fillOpacity="0.16"
    />
    <text
      x="12"
      y="14.8"
      textAnchor="middle"
      fill="currentColor"
      stroke="none"
      fontSize="8.8"
      fontWeight="800"
      fontFamily="system-ui, sans-serif"
    >
      40
    </text>
  </svg>
);

/** Mihrab arch + sincere intention heart (Niyatlar). */
export const NiyatHeartIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', strokeWidth = 2 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M5 20.5V11c0-4.2 3-7 7-8.2 4 1.2 7 4 7 8.2v9.5z"
      fill="currentColor"
      fillOpacity="0.14"
    />
    <path
      d="M12 16.3s-3.3-2-3.3-4.3a1.9 1.9 0 0 1 3.3-1.2 1.9 1.9 0 0 1 3.3 1.2c0 2.3-3.3 4.3-3.3 4.3z"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);

/** Mosque dome rising above a warm giving heart (Masjidga Ehson). */
export const MasjidEhsonIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', strokeWidth = 2 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2.4v1.8" />
    <path
      d="M5.5 13v-2c0-2.9 2.6-5.2 6.5-6.6 3.9 1.4 6.5 3.7 6.5 6.6v2"
      fill="currentColor"
      fillOpacity="0.16"
    />
    <path d="M3.5 13h17" />
    <path
      d="M12 20.8s-4.8-2.9-4.8-5.9a2.6 2.6 0 0 1 4.8-1.4 2.6 2.6 0 0 1 4.8 1.4c0 3-4.8 5.9-4.8 5.9z"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);
