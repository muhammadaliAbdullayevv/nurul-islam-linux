const DEVICE_ID_KEY = 'nq_device_id';

/**
 * Generates and persists an anonymous, random UUID for this device so community
 * actions like Hashar RSVPs avoid duplicates without requiring user login.
 */
export function getOrCreateDeviceId(): string {
  try {
    const existing = localStorage.getItem(DEVICE_ID_KEY);
    if (existing && /^[a-zA-Z0-9_-]{8,80}$/.test(existing)) {
      return existing;
    }
  } catch {
    // ignore storage errors
  }

  let nextId = '';
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    nextId = crypto.randomUUID();
  } else {
    nextId = `nq_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
  }

  try {
    localStorage.setItem(DEVICE_ID_KEY, nextId);
  } catch {
    // ignore
  }
  return nextId;
}
