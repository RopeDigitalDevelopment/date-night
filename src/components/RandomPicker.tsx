import { useEffect, useState, useCallback, useRef } from 'react';
import { Place, Category } from '../types';

interface Props {
  categories: Category[];
  places: Place[];
  onResult: (place: Place) => void;
  onBack: () => void;
}

const ROLL_STAGES = [
  { duration: 1200, interval: 60 },
  { duration: 700, interval: 120 },
  { duration: 500, interval: 220 },
  { duration: 400, interval: 380 },
  { duration: 300, interval: 600 },
];

export function RandomPicker({ categories, places, onResult, onBack }: Props) {
  const [displayName, setDisplayName] = useState('');
  const [isRolling, setIsRolling] = useState(false);
  const [hasRolled, setHasRolled] = useState(false);
  const [landed, setLanded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const winnerRef = useRef<Place | null>(null);

  const categoryLabel = categories.length === 1
    ? `${categories[0].emoji} ${categories[0].name}`
    : categories.length <= 3
      ? categories.map(c => c.emoji).join(' ') + ' Mixed'
      : '🎲 Wildcard';

  const roll = useCallback(() => {
    if (isRolling || places.length === 0) return;

    // Pick winner upfront
    const winner = places[Math.floor(Math.random() * places.length)];
    winnerRef.current = winner;

    setIsRolling(true);
    setLanded(false);
    setHasRolled(true);

    let stageIndex = 0;
    let stageStart = Date.now();

    const tick = () => {
      const now = Date.now();
      const stage = ROLL_STAGES[stageIndex];

      if (now - stageStart >= stage.duration) {
        stageIndex++;
        if (stageIndex >= ROLL_STAGES.length) {
          // Land on winner
          setDisplayName(winner.displayName.text);
          setIsRolling(false);
          setLanded(true);
          timerRef.current = setTimeout(() => {
            onResult(winner);
          }, 900);
          return;
        }
        stageStart = now;
      }

      const idx = Math.floor(Math.random() * places.length);
      setDisplayName(places[idx].displayName.text);
      timerRef.current = setTimeout(tick, stage.interval);
    };

    tick();
  }, [isRolling, places, onResult]);

  // Auto-roll on mount
  useEffect(() => {
    const id = setTimeout(roll, 400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f1a]">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 pt-14 pb-6">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-white/60 active:bg-white/15 transition-colors"
        >
          ←
        </button>
        <div>
          <p className="text-white/40 text-xs uppercase tracking-wider">Picking from</p>
          <h2 className="font-bold text-white text-lg">{categoryLabel}</h2>
        </div>
        <div className="ml-auto text-white/30 text-xs">{places.length} places</div>
      </div>

      {/* Picker arena */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8">
        {/* Display box */}
        <div className="w-full max-w-sm">
          {/* Place counter strip above */}
          <div className="flex justify-center mb-4 gap-1">
            {Array.from({ length: Math.min(places.length, 7) }).map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  isRolling ? 'bg-white/20 w-6' : landed ? 'bg-white/40 w-4' : 'bg-white/10 w-4'
                }`}
              />
            ))}
          </div>

          {/* Main display */}
          <div
            className={`
              relative w-full rounded-3xl border-2 overflow-hidden
              flex flex-col items-center justify-center text-center
              py-12 px-6 min-h-[200px]
              transition-all duration-500
              ${isRolling
                ? 'border-white/10 bg-white/5'
                : landed
                  ? 'border-white/20 bg-white/8 shadow-2xl shadow-white/5'
                  : 'border-white/5 bg-white/3'}
            `}
          >
            {/* Animated background glow when rolling */}
            {isRolling && (
              <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 to-transparent animate-pulse pointer-events-none" />
            )}

            {!hasRolled && !isRolling && (
              <div className="text-white/20 text-lg">Tap to pick…</div>
            )}

            {(isRolling || hasRolled) && (
              <>
                <p
                  className={`
                    text-2xl font-bold leading-tight transition-all duration-300
                    ${isRolling
                      ? 'text-white/50 blur-[2px] scale-95'
                      : landed
                        ? 'text-white blur-0 scale-100'
                        : 'text-white/50'}
                  `}
                  style={{
                    filter: isRolling ? 'blur(2px)' : 'blur(0)',
                    transform: isRolling ? 'scale(0.95)' : 'scale(1)',
                    transition: 'all 0.4s ease-out',
                  }}
                >
                  {displayName}
                </p>

                {landed && (
                  <p className="text-white/40 text-sm mt-3 animate-fade-in">
                    Getting details…
                  </p>
                )}
              </>
            )}
          </div>

          {/* Decorative dots below */}
          <div className="flex justify-center mt-4 gap-2">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className={`rounded-full transition-all duration-500 ${
                  isRolling
                    ? `bg-white/40 w-2 h-2 animate-bounce`
                    : 'bg-white/10 w-1.5 h-1.5'
                }`}
                style={{ animationDelay: `${i * 120}ms` }}
              />
            ))}
          </div>
        </div>

        {/* Roll button */}
        <button
          onClick={roll}
          disabled={isRolling}
          className={`
            w-full max-w-xs py-5 rounded-2xl font-bold text-lg
            transition-all duration-200
            ${isRolling
              ? 'bg-white/5 text-white/20 cursor-not-allowed'
              : hasRolled
                ? 'bg-white/10 text-white/70 border border-white/10 active:bg-white/15'
                : 'bg-white text-[#0f0f1a] shadow-xl active:scale-95'}
          `}
        >
          {isRolling ? '✨  Picking…' : hasRolled ? '🔄  Pick Again' : '🎲  Pick for us!'}
        </button>

        {/* Category chips */}
        <div className="flex flex-wrap justify-center gap-2 max-w-xs">
          {categories.map(cat => (
            <span
              key={cat.id}
              className="px-3 py-1 rounded-full bg-white/8 border border-white/10 text-white/50 text-xs"
            >
              {cat.emoji} {cat.name}
            </span>
          ))}
        </div>
      </div>

      <div className="pb-10" />
    </div>
  );
}
