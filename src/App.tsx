import { useState, useCallback } from 'react';
import { Place, Category, UserPrefs, Filters } from './types';
import { CATEGORIES } from './lib/categories';
import { fetchNearbyPlaces } from './lib/places';
import { getSettings, getCachedPlaces, setCachedPlaces } from './lib/storage';
import { PRICE_API_MAP, DEFAULT_PREFS } from './lib/constants';
import { FaviconInjector } from './components/FaviconInjector';
import { SplashScreen } from './components/SplashScreen';
import { Onboarding } from './components/Onboarding';
import { CategoryPicker } from './components/CategoryPicker';
import { RandomPicker } from './components/RandomPicker';
import { WinnerModal } from './components/WinnerModal';
import { SettingsModal } from './components/SettingsModal';

type Screen = 'splash' | 'onboarding' | 'home' | 'loading' | 'pick' | 'winner';

// Fixed star positions so they don't re-randomise on re-render
const STARS = Array.from({ length: 30 }, (_, i) => ({
  key: i,
  top: `${(i * 37 + 11) % 100}%`,
  left: `${(i * 61 + 7) % 100}%`,
  size: (i % 3) + 1,
  opacity: 0.08 + (i % 4) * 0.06,
}));

export function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [prefs, setPrefs] = useState<UserPrefs>(DEFAULT_PREFS);
  const [activeCategories, setActiveCategories] = useState<Category[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [winner, setWinner] = useState<Place | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const handlePick = useCallback(async (categoryIds: string[], filters: Filters) => {
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
      const results = await Promise.all(
        cats.map(async (cat) => {
          const cached = getCachedPlaces(cat.id);
          if (cached && cached.length > 0) return cached;

          try {
            const fetched = await fetchNearbyPlaces(cat.types, settings);
            // Cache unfiltered results so different filter combos can reuse them
            const top = fetched
              .filter(p => p.rating && p.rating >= 3.0)
              .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
              .slice(0, 30);
            setCachedPlaces(cat.id, top);
            return top;
          } catch {
            return [] as Place[];
          }
        })
      );

      // Merge & deduplicate
      const seenIds = new Set<string>();
      let allPlaces: Place[] = [];
      for (const batch of results) {
        for (const p of batch) {
          if (!seenIds.has(p.id)) {
            seenIds.add(p.id);
            allPlaces.push(p);
          }
        }
      }

      // Apply client-side filters from FiltersPanel / Onboarding prefs
      if (filters.minRating > 3.0) {
        allPlaces = allPlaces.filter(p => (p.rating ?? 0) >= filters.minRating);
      }
      if (filters.openNow) {
        allPlaces = allPlaces.filter(p => p.currentOpeningHours?.openNow === true);
      }
      if (filters.priceLevel > 0) {
        const target = PRICE_API_MAP[filters.priceLevel];
        allPlaces = allPlaces.filter(p => !p.priceLevel || p.priceLevel === target);
      }

      if (allPlaces.length === 0) {
        throw new Error(
          'No places matched your filters. Try relaxing the filters or picking a different category.'
        );
      }

      // Shuffle
      const shuffled = allPlaces.sort(() => Math.random() - 0.5);
      setPlaces(shuffled);
      setScreen('pick');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch places. Check your API key in Settings.'
      );
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

  const winnerCategory =
    winner
      ? activeCategories.find(c => c.types.some(t => t === winner.primaryType)) ??
        activeCategories[0]
      : activeCategories[0];

  return (
    <>
      <FaviconInjector />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0f0f1a; font-family: 'DM Sans', sans-serif; color: #fff; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,60,110,0.3); border-radius: 4px; }
        button { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#0f0f1a', position: 'relative', overflow: 'hidden' }}>
        {/* Ambient glow blobs */}
        <div style={{ position: 'fixed', top: '-20%', right: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,60,110,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'fixed', bottom: '-20%', left: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Star field */}
        {STARS.map(s => (
          <div key={s.key} style={{ position: 'fixed', top: s.top, left: s.left, width: s.size, height: s.size, borderRadius: '50%', background: '#fff', opacity: s.opacity, pointerEvents: 'none' }} />
        ))}

        <div style={{ maxWidth: 480, margin: '0 auto', position: 'relative' }}>
          {screen === 'splash' && (
            <SplashScreen
              onStart={() => setScreen('onboarding')}
              onSkip={() => { setPrefs(DEFAULT_PREFS); setScreen('home'); }}
              onSettings={() => setShowSettings(true)}
            />
          )}

          {screen === 'onboarding' && (
            <Onboarding
              onDone={(p) => { setPrefs(p); setScreen('home'); }}
            />
          )}

          {screen === 'home' && (
            <CategoryPicker
              categories={CATEGORIES}
              prefs={prefs}
              onPick={handlePick}
              onSettings={() => setShowSettings(true)}
              error={error}
            />
          )}

          {screen === 'loading' && (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {activeCategories.map((c, i) => (
                  <span
                    key={c.id}
                    style={{
                      fontSize: 36,
                      animation: `bounce 1s ${i * 0.15}s infinite`,
                    }}
                  >
                    {c.emoji}
                  </span>
                ))}
              </div>
              <p style={{ color: '#fff', fontFamily: "'Playfair Display', serif", fontSize: 18 }}>
                Finding great spots…
              </p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
                Searching within {getSettings().radiusKm} km
              </p>
              <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }`}</style>
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
        </div>
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  );
}
