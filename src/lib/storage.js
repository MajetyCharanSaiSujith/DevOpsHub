// LocalStorage persistence utility with versioning and safety

const STORAGE_KEY = 'devopshub_state_v1';

export const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const getStoredData = (fallbackData) => {
  if (!isBrowser()) return fallbackData;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallbackData;
    const parsed = JSON.parse(raw);
    return {
      ...fallbackData,
      ...parsed,
    };
  } catch (err) {
    console.error('Failed to read from localStorage:', err);
    return fallbackData;
  }
};

export const setStoredData = (data) => {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
};

export const clearStoredData = () => {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear localStorage:', err);
  }
};
