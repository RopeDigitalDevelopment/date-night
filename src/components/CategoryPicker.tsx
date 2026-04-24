import { useState } from 'react';
import { Category } from '../types';

interface Props {
  categories: Category[];
  onPick: (categoryIds: string[]) => void;
  onSettings: () => void;
  error: string | null;
}

export function CategoryPicker({ categories, onPick, onSettings, error }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [wildcard, setWildcard] = useState(false);

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
    onPick(ids);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f1a]">
      {/* Header */}
      <div className="flex items-start justify-between px-6 pt-14 pb-4">
        <div>
          <p className="text-white/40 text-xs tracking-widest uppercase mb-1">Tonight's plan</p>
          <h1 className="text-4xl font-bold text-white leading-tight">Date<br />Night 🌙</h1>
        </div>
        <button
          onClick={onSettings}
          className="mt-1 w-11 h-11 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-lg active:bg-white/15 transition-colors"
          aria-label="Settings"
        >
          ⚙️
        </button>
      </div>

      <div className="px-6 pb-3">
        <p className="text-white/40 text-sm">
          {wildcard
            ? 'Picking from everywhere 🎲'
            : selectedIds.length === 0
              ? 'What are you in the mood for?'
              : `${selectedIds.length} categor${selectedIds.length === 1 ? 'y' : 'ies'} selected`}
        </p>
      </div>

      {error && (
        <div className="mx-6 mb-3 p-4 bg-red-500/15 border border-red-500/25 rounded-2xl text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* WILDCARD banner */}
      <div className="px-6 mb-4">
        <button
          onClick={toggleWildcard}
          className={`
            w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3
            border-2 transition-all duration-200 active:scale-95
            ${wildcard
              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 border-transparent text-white shadow-lg shadow-orange-500/30'
              : 'bg-white/5 border-white/10 text-white/60'}
          `}
        >
          <span className="text-2xl">🎲</span>
          <div className="text-left">
            <div className="font-bold">Wildcard — Surprise Us!</div>
            <div className={`text-xs font-normal ${wildcard ? 'text-white/80' : 'text-white/30'}`}>
              Pick randomly from all categories
            </div>
          </div>
        </button>
      </div>

      {/* Category chips */}
      <div className="px-6 flex-1">
        <p className="text-white/30 text-xs uppercase tracking-wider mb-3">
          — or pick specific vibes —
        </p>
        <div className="grid grid-cols-2 gap-3">
          {categories.map(cat => {
            const selected = selectedIds.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`
                  rounded-2xl p-4 flex items-center gap-3 text-left
                  border-2 transition-all duration-150 active:scale-95
                  ${selected
                    ? `bg-gradient-to-br ${cat.gradient} border-transparent shadow-lg`
                    : 'bg-white/5 border-white/8 hover:border-white/20'}
                `}
              >
                <span className="text-2xl flex-shrink-0">{cat.emoji}</span>
                <div className="min-w-0">
                  <div className={`font-bold text-sm leading-tight ${selected ? 'text-white' : 'text-white/70'}`}>
                    {cat.name}
                  </div>
                  <div className={`text-xs mt-0.5 ${selected ? 'text-white/70' : 'text-white/30'}`}>
                    {cat.description}
                  </div>
                </div>
                {selected && (
                  <div className="ml-auto flex-shrink-0 w-5 h-5 rounded-full bg-white/30 flex items-center justify-center text-xs">
                    ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 py-6">
        <button
          onClick={handlePick}
          disabled={!canPick}
          className={`
            w-full py-5 rounded-2xl font-bold text-lg transition-all duration-200
            ${canPick
              ? 'bg-white text-[#0f0f1a] shadow-xl active:scale-95'
              : 'bg-white/8 text-white/20 cursor-not-allowed'}
          `}
        >
          {canPick ? '🎲  Pick somewhere for us' : 'Select a category above'}
        </button>
      </div>

      <div className="pb-4 text-center">
        <p className="text-white/20 text-xs">Powered by Google Places · Kuala Lumpur</p>
      </div>
    </div>
  );
}
