import { AppSettings, Place } from '../types';

const SETTINGS_KEY = 'datenite_settings';
const CACHE_PREFIX = 'datenite_cache_';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

const DEFAULT_SETTINGS: AppSettings = {
  apiKey: import.meta.env.VITE_PLACES_API_KEY ?? '',
  radiusKm: 20,
  lat: 3.1529,  // Trion @ KL Tower A (near Menara KL)
  lng: 101.7030,
};

export function getSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

interface CacheEntry {
  places: Place[];
  timestamp: number;
}

export function getCachedPlaces(categoryId: string): Place[] | null {
  try {
    const stored = localStorage.getItem(CACHE_PREFIX + categoryId);
    if (!stored) return null;
    const entry: CacheEntry = JSON.parse(stored);
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_PREFIX + categoryId);
      return null;
    }
    return entry.places;
  } catch {
    return null;
  }
}

export function setCachedPlaces(categoryId: string, places: Place[]): void {
  const entry: CacheEntry = { places, timestamp: Date.now() };
  localStorage.setItem(CACHE_PREFIX + categoryId, JSON.stringify(entry));
}

export function clearCache(): void {
  Object.keys(localStorage)
    .filter(k => k.startsWith(CACHE_PREFIX))
    .forEach(k => localStorage.removeItem(k));
}
