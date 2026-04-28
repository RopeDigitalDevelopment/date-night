import { useState } from 'react';
import { Category, UserPrefs, Filters } from '../types';
import { Logo } from './Logo';
import { FiltersPanel } from './FiltersPanel';

interface Props {
  categories: Category[];
  prefs: UserPrefs;
  onPick: (categoryIds: string[], filters: Filters) => void;
  onSettings: () => void;
  error: string | null;
}

export function CategoryPicker({ categories, prefs, onPick, onSettings, error }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [wildcard, setWildcard] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    openNow: prefs.openNow,
    minRating: prefs.minRating,
    priceLevel: prefs.priceLevel,
    dietary: [...prefs.dietary],
    dressCode: prefs.dressCode,
  });

  const toggleCategory = (id: string) => {
    if (wildcard) setWildcard(false);
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleWildcard = () => {
    const next = !wildcard;
    setWildcard(next);
    if (next) setSelectedIds([]);
  };

  const canPick = wildcard || selectedIds.length > 0;

  const handlePick = () => {
    if (!canPick) return;
    const ids = wildcard ? categories.map(c => c.id) : selectedIds;
    onPick(ids, filters);
  };

  const activeFilterCount = [
    filters.openNow,
    filters.priceLevel > 0,
    filters.minRating > 3.5,
    filters.dietary.length > 0,
    filters.dressCode !== 'No preference',
  ].filter(Boolean).length;

  return (
    <div style={{ minHeight: '100vh', padding: '0 16px 40px', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 52, marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Logo size={36} />
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: '#fff', fontWeight: 700, lineHeight: 1 }}>
              Date Night
            </div>
            <div style={{ fontSize: 10, color: '#ff3c6e', letterSpacing: 3, textTransform: 'uppercase' as const }}>
              Kuala Lumpur
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowFilters(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: activeFilterCount > 0 ? 'rgba(255,60,110,0.2)' : 'rgba(255,255,255,0.05)',
            border: activeFilterCount > 0 ? '2px solid #ff3c6e' : '2px solid rgba(255,255,255,0.1)',
            color: activeFilterCount > 0 ? '#ff3c6e' : '#aaa',
            padding: '8px 16px',
            borderRadius: 20,
            cursor: 'pointer',
            fontSize: 14,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          🎚️ Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
        </button>
      </div>

      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, color: '#fff', margin: '0 0 6px', lineHeight: 1.2 }}>
        What's the plan?
      </h1>
      <p style={{ color: '#666', fontSize: 14, margin: '0 0 20px' }}>
        Pick categories, then let fate decide ✨
      </p>

      {error && (
        <div style={{
          margin: '0 0 16px',
          padding: '14px 16px',
          background: 'rgba(255,60,110,0.1)',
          border: '1px solid rgba(255,60,110,0.3)',
          borderRadius: 14,
          color: '#ff9aaa',
          fontSize: 14,
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        {categories.map(cat => {
          const active = selectedIds.includes(cat.id) && !wildcard;
          return (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              style={{
                padding: '20px 16px',
                borderRadius: 16,
                border: active ? '2px solid #ff3c6e' : '2px solid rgba(255,255,255,0.08)',
                background: active
                  ? 'linear-gradient(135deg, rgba(255,60,110,0.2), rgba(255,107,53,0.1))'
                  : 'rgba(255,255,255,0.03)',
                color: active ? '#fff' : '#aaa',
                cursor: 'pointer',
                textAlign: 'left' as const,
                transition: 'all 0.2s',
                boxShadow: active ? '0 4px 20px rgba(255,60,110,0.2)' : 'none',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 6 }}>{cat.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: active ? 700 : 400, lineHeight: 1.3 }}>{cat.name}</div>
              <div style={{ fontSize: 11, color: active ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)', marginTop: 3 }}>
                {cat.description}
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={toggleWildcard}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: 16,
          border: wildcard ? '2px solid #ffd700' : '2px solid rgba(255,255,255,0.08)',
          background: wildcard
            ? 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,107,53,0.1))'
            : 'rgba(255,255,255,0.03)',
          color: wildcard ? '#ffd700' : '#aaa',
          cursor: 'pointer',
          fontSize: 16,
          fontWeight: wildcard ? 700 : 400,
          marginBottom: 28,
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        🎲 Wildcard — Surprise Us Completely
      </button>

      <button
        onClick={handlePick}
        disabled={!canPick}
        style={{
          width: '100%',
          padding: '20px',
          borderRadius: 16,
          background: canPick ? 'linear-gradient(135deg, #ff3c6e, #ff6b35)' : 'rgba(255,255,255,0.05)',
          border: 'none',
          color: canPick ? '#fff' : '#444',
          fontSize: 18,
          fontWeight: 700,
          cursor: canPick ? 'pointer' : 'default',
          boxShadow: canPick ? '0 12px 40px rgba(255,60,110,0.4)' : 'none',
          transition: 'all 0.3s',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {canPick ? '🎰 Roll the Dice!' : 'Pick at least one category'}
      </button>

      {showFilters && (
        <FiltersPanel
          filters={filters}
          setFilters={setFilters}
          onClose={() => setShowFilters(false)}
          onSettings={onSettings}
        />
      )}
    </div>
  );
}
