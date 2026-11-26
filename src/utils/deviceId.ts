const DEVICE_ID_KEY = 'nq_device_id';
const HARDWARE_ID_KEY = 'nq_hardware_id';

interface NativeHardwareBridge {
  getHardwareId?: () => string;
  saveProgressBackup?: (snapshotJson: string) => void;
  loadProgressBackup?: () => string;
}

function getNativeHardwareBridge(): NativeHardwareBridge | null {
  if (typeof window === 'undefined') return null;
  const win = window as Window & { NqNativeBridge?: NativeHardwareBridge };
  return win.NqNativeBridge || null;
}

/**
 * Returns the deterministic Android hardware ID hash (`nq_hw_<24hex>`) when running
 * inside the Android app. Because it derives from `Settings.Secure.ANDROID_ID`, it
 * stays identical across app uninstalls and reinstalls on the same phone with zero permissions.
 */
export function getHardwareDeviceId(): string {
  try {
    const bridge = getNativeHardwareBridge();
    if (bridge && typeof bridge.getHardwareId === 'function') {
      const hw = String(bridge.getHardwareId() || '').trim();
      if (/^nq_hw_[a-f0-9]{16,40}$/.test(hw)) {
        try {
          localStorage.setItem(HARDWARE_ID_KEY, hw);
        } catch {
          // ignore
        }
        return hw;
      }
    }
    const cached = localStorage.getItem(HARDWARE_ID_KEY);
    if (cached && /^nq_hw_[a-f0-9]{16,40}$/.test(cached)) {
      return cached;
    }
  } catch {
    // ignore bridge errors
  }
  return '';
}

export function saveNativeProgressBackup(snapshotJson: string): void {
  try {
    const bridge = getNativeHardwareBridge();
    if (bridge && typeof bridge.saveProgressBackup === 'function') {
      bridge.saveProgressBackup(snapshotJson);
    }
  } catch {
    // ignore
  }
}

export function loadNativeProgressBackup(): string {
  try {
    const bridge = getNativeHardwareBridge();
    if (bridge && typeof bridge.loadProgressBackup === 'function') {
      return String(bridge.loadProgressBackup() || '');
    }
  } catch {
    // ignore
  }
  return '';
}

/**
 * Generates and persists an anonymous UUID (or deterministic Android hardware ID hash on fresh
 * native installs) so user progress and community actions persist across reinstalls without login.
 */
export function getOrCreateDeviceId(): string {
  const hwId = getHardwareDeviceId();
  try {
    const existing = localStorage.getItem(DEVICE_ID_KEY);
    if (existing && /^[a-zA-Z0-9_-]{8,80}$/.test(existing)) {
      return existing;
    }
  } catch {
    // ignore storage errors
  }

  let nextId = hwId;
  if (!nextId) {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      nextId = crypto.randomUUID();
    } else {
      nextId = `nq_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
    }
  }

  try {
    localStorage.setItem(DEVICE_ID_KEY, nextId);
  } catch {
    // ignore
  }
  return nextId;
}
