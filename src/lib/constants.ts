import { UserPrefs } from '../types';

export const VIBES = [
  'Romantic 💕',
  'Fun & Lively 🎉',
  'Chill & Relaxed 😌',
  'Adventure 🏔️',
  'Fancy & Upscale ✨',
  'Cozy & Intimate 🕯️',
];

export const DIETARY = [
  'Vegetarian',
  'Vegan',
  'Halal',
  'Gluten-Free',
  'Seafood',
  'No preference',
];

export const DRESS_CODES = ['Casual', 'Smart Casual', 'Formal', 'No preference'];

export const PRICE_LEVELS = [
  { value: 0, label: 'Any',       symbol: '' },
  { value: 1, label: 'Budget',    symbol: 'RM' },
  { value: 2, label: 'Mid-range', symbol: 'RM RM' },
  { value: 3, label: 'Upscale',   symbol: 'RM RM RM' },
  { value: 4, label: 'Luxury',    symbol: 'RM RM RM RM' },
];

/** Maps numeric filter price level → Google Places API string */
export const PRICE_API_MAP: Record<number, string> = {
  1: 'PRICE_LEVEL_INEXPENSIVE',
  2: 'PRICE_LEVEL_MODERATE',
  3: 'PRICE_LEVEL_EXPENSIVE',
  4: 'PRICE_LEVEL_VERY_EXPENSIVE',
};

/** Maps Google Places API priceLevel string → display symbol */
export const PRICE_DISPLAY_MAP: Record<string, string> = {
  PRICE_LEVEL_FREE: 'Free',
  PRICE_LEVEL_INEXPENSIVE: 'RM',
  PRICE_LEVEL_MODERATE: 'RM RM',
  PRICE_LEVEL_EXPENSIVE: 'RM RM RM',
  PRICE_LEVEL_VERY_EXPENSIVE: 'RM RM RM RM',
};

export const DEFAULT_PREFS: UserPrefs = {
  vibes: [],
  dietary: [],
  dressCode: 'No preference',
  minRating: 3.5,
  priceLevel: 0,
  openNow: true,
  radius: 20,
  lat: 3.1529,
  lng: 101.703,
};
