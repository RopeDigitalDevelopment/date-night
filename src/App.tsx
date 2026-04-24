import { useState, useCallback } from 'react';
import { Place, Category } from './types';
import { CATEGORIES } from './lib/categories';
import { fetchNearbyPlaces } from './lib/places';
import { getSettings, getCachedPlaces, setCachedPlaces } from './lib/storage';
import { CategoryPicker } from './components/CategoryPicker';
import { RandomPicker } from './components/RandomPicker';
import { WinnerModal } from './components/WinnerModal';
import { SettingsModal } from './components/SettingsModal';

type Screen = 'home' | 'loading' | 'pick' | 'winner';

export function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [activeCategories, setActiveCategories] = useState<Category[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [winner, setWinner] = useState<Place | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const handlePick = useCallback(async (categoryIds: string[]) => {
    const settings = getSettings();

    if (!settings.apiKey.trim()) {
      setShowSettings(true);
      return;
    }

    const cats = CATEGORIES.filter(c => categoryIds.includes(c.id));
    setActiveCategories(cats);
    setError(null);
    setScreen('loading');

    try {
      // Fetch all categories in parallel — much faster for wildcard
      const results = await Promise.all(
        cats.map(async (cat) => {
          const cached = getCachedPlaces(cat.id);
          if (cached && cached.length > 0) return cached;

          try {
            const fetched = await fetchNearbyPlaces(cat.types, settings);
            const filtered = fetched
              .filter(p => p.rating && p.rating >= 3.5)
              .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
              .slice(0, 20);
            setCachedPlaces(cat.id, filtered);
            return filtered;
          } catch {
            return [] as Place[];
          }
        })
      );

      // Merge & deduplicate
      const seenIds = new Set<string>();
      const allPlaces: Place[] = [];
      for (const batch of results) {
        for (const p of batch) {
          if (!seenIds.has(p.id)) {
            seenIds.add(p.id);
            allPlaces.push(p);
          }
        }
      }

      if (allPlaces.length === 0) {
        throw new Error('No highly-rated places found nearby. Try increasing the radius in Settings, or pick a different category.');
      }

      // Shuffle so it's not predictable
      const shuffled = allPlaces.sort(() => Math.random() - 0.5);
      setPlaces(shuffled);
      setScreen('pick');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch places. Check your API key in Settings.');
      setScreen('home');
    }
  }, []);

  const handleWinner = useCallback((place: Place) => {
    setWinner(place);
    setScreen('winner');
  }, []);

  const handlePickAgain = useCallback(() => {
    setWinner(null);
    setScreen('pick');
  }, []);

  const handleBack = useCallback(() => {
    setScreen('home');
    setActiveCategories([]);
    setWinner(null);
    setError(null);
  }, []);

  // Determine a representative "category" for the winner card gradient
  const winnerCategory = winner
    ? activeCategories.find(c =>
        c.types.some(t => t === winner.primaryType)
      ) ?? activeCategories[0]
    : activeCategories[0];

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      {screen === 'home' && (
        <CategoryPicker
          categories={CATEGORIES}
          onPick={handlePick}
          onSettings={() => setShowSettings(true)}
          error={error}
        />
      )}

      {screen === 'loading' && (
        <div className="flex flex-col items-center justify-center min-h-screen gap-5">
          <div className="flex gap-2">
            {activeCategories.map(c => (
              <span key={c.id} className="text-4xl animate-bounce" style={{ animationDelay: `${activeCategories.indexOf(c) * 150}ms` }}>
                {c.emoji}
              </span>
            ))}
          </div>
          <p className="text-white font-semibold">Finding great spots…</p>
          <p className="text-white/40 text-sm">Searching within {getSettings().radiusKm} km</p>
        </div>
      )}

      {screen === 'pick' && (
        <RandomPicker
          categories={activeCategories}
          places={places}
          onResult={handleWinner}
          onBack={handleBack}
        />
      )}

      {screen === 'winner' && winner && winnerCategory && (
        <WinnerModal
          place={winner}
          category={winnerCategory}
          onSpinAgain={handlePickAgain}
          onBack={handleBack}
        />
      )}

      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}
