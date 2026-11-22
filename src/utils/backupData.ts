/**
 * Export & Restore user progress and preferences (.json) so users can preserve
 * Qazo counts, Bookmarks, Hifz mastery, Saved Hikmats, Custom Juma checklists,
 * Tasbih totals, and settings across browsers or device migrations.
 */

const BACKUP_SCHEMA_VERSION = 1;
const EXCLUDED_KEYS = new Set([
  'nq_onboarding_in_progress',
  'nq_device_id',
  'nq_masjids_cache_v2',
  'nq_broadcasts_cache_v1',
]);

export interface NurulIslamBackupFile {
  app: 'nurul-islam';
  schemaVersion: number;
  exportedAt: string;
  entries: Record<string, string>;
}

export function buildUserBackupPayload(): NurulIslamBackupFile {
  const entries: Record<string, string> = {};
  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith('nq_')) continue;
      if (EXCLUDED_KEYS.has(key)) continue;
      // Skip any legacy large Surah blob keys
      if (key.startsWith('nq_quran_offline_v1_')) continue;
      const val = localStorage.getItem(key);
      if (val !== null) {
        entries[key] = val;
      }
    }
  } catch {
    // ignore storage read error
  }

  return {
    app: 'nurul-islam',
    schemaVersion: BACKUP_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    entries,
  };
}

export function downloadUserBackupJson(): { ok: boolean; count: number } {
  const payload = buildUserBackupPayload();
  const count = Object.keys(payload.entries).length;
  try {
    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const dateStamp = new Date().toISOString().slice(0, 10);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nurul-islam-backup-${dateStamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
    return { ok: true, count };
  } catch {
    return { ok: false, count: 0 };
  }
}

export function restoreUserBackupJson(rawText: string): { ok: boolean; restoredCount: number } {
  try {
    const parsed = JSON.parse(rawText) as Partial<NurulIslamBackupFile>;
    if (
      !parsed ||
      parsed.app !== 'nurul-islam' ||
      !parsed.entries ||
      typeof parsed.entries !== 'object' ||
      Array.isArray(parsed.entries)
    ) {
      return { ok: false, restoredCount: 0 };
    }

    let restoredCount = 0;
    for (const [key, value] of Object.entries(parsed.entries)) {
      if (
        typeof key === 'string' &&
        key.startsWith('nq_') &&
        !EXCLUDED_KEYS.has(key) &&
        !key.startsWith('nq_quran_offline_v1_') &&
        typeof value === 'string' &&
        value.length <= 512_000
      ) {
        localStorage.setItem(key, value);
        restoredCount += 1;
      }
    }

    if (restoredCount > 0) {
      localStorage.setItem('nq_onboarding_done', '1');
    }
    return { ok: restoredCount > 0, restoredCount };
  } catch {
    return { ok: false, restoredCount: 0 };
  }
}
