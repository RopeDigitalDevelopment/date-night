import { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'food',
    name: 'Cafes & Restaurants',
    emoji: '🍽️',
    description: 'Restaurants, cafes & bars',
    gradient: 'from-orange-500 to-rose-500',
    types: ['restaurant', 'cafe', 'bar', 'bakery'],
  },
  {
    id: 'activities',
    name: 'Activities',
    emoji: '🎭',
    description: 'Cinema, bowling & entertainment',
    gradient: 'from-violet-500 to-indigo-500',
    types: ['movie_theater', 'bowling_alley', 'amusement_park', 'night_club'],
  },
  {
    id: 'sports',
    name: 'Sports & Fitness',
    emoji: '🎾',
    description: 'Padel, gym & sports clubs',
    gradient: 'from-blue-500 to-cyan-500',
    types: ['sports_club', 'gym', 'golf_course'],
  },
  {
    id: 'shopping',
    name: 'Shopping',
    emoji: '🛍️',
    description: 'Malls, boutiques & stores',
    gradient: 'from-fuchsia-500 to-pink-500',
    types: ['shopping_mall', 'clothing_store', 'department_store'],
  },
  {
    id: 'outdoors',
    name: 'Outdoors & Nature',
    emoji: '🌿',
    description: 'Parks, gardens & nature',
    gradient: 'from-green-500 to-teal-500',
    types: ['park', 'zoo', 'botanical_garden'],
  },
  {
    id: 'wellness',
    name: 'Spa & Wellness',
    emoji: '💆',
    description: 'Spas, massage & relaxation',
    gradient: 'from-pink-400 to-rose-600',
    types: ['spa', 'beauty_salon'],
  },
];
