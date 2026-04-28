import { useEffect, useRef, useState } from 'react';
import { Place, Category } from '../types';

interface Props {
  categories: Category[];
  places: Place[];
  onResult: (place: Place) => void;
  onBack: () => void;
}

const ROLL_STAGES = [
  { duration: 1200, interval: 60 },
  { duration: 700,  interval: 120 },
  { duration: 500,  interval: 220 },
  { duration: 400,  interval: 380 },
  { duration: 300,  interval: 600 },
];

export function RandomPicker({ categories, places, onResult, onBack }: Props) {
  const [display, setDisplay] = useState(places[0]?.displayName.text ?? '');
  const [blur, setBlur] = useState(true);
  const winnerRef = useRef<Place>(places[Math.floor(Math.random() * places.length)]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const categoryLabel =
    categories.length === 1
      ? `${categories[0].emoji} ${categories[0].name}`
      : categories.length <= 3
        ? categories.map(c => c.emoji).join(' ') + ' Mixed'
        : '🎲 Wildcard';

  useEffect(() => {
    const allNames = places.map(p => p.displayName.text);
    let stageIdx = 0;
    let elapsed = 0;

    const runStage = () => {
      if (stageIdx >= ROLL_STAGES.length) {
        setBlur(false);
        setDisplay(winnerRef.current.displayName.text);
        timerRef.current = setTimeout(() => onResult(winnerRef.current), 800);
        return;
      }
      const { duration, interval } = ROLL_STAGES[stageIdx];
      const tick = () => {
        setDisplay(allNames[Math.floor(Math.random() * allNames.length)]);
        elapsed += interval;
        if (elapsed >= duration) {
          elapsed = 0;
          stageIdx++;
          runStage();
        } else {
          timerRef.current = setTimeout(tick, interval);
        }
      };
      timerRef.current = setTimeout(tick, interval);
    };

    const startId = setTimeout(runStage, 300);
    return () => {
      clearTimeout(startId);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Category label */}
      <p style={{ color: '#ff3c6e', fontFamily: "'Playfair Display', serif", fontSize: 14, letterSpacing: 4, textTransform: 'uppercase' as const, opacity: 0.8, marginBottom: 8 }}>
        Finding your perfect night…
      </p>
      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginBottom: 28 }}>{categoryLabel} · {places.length} places</p>

      {/* Slot display */}
      <div style={{
        background: 'linear-gradient(135deg, #1a0a2e 0%, #2d1145 100%)',
        border: '2px solid #ff3c6e',
        borderRadius: 20,
        padding: '40px 32px',
        width: '100%',
        maxWidth: 380,
        textAlign: 'center' as const,
        boxShadow: '0 0 60px rgba(255,60,110,0.3)',
        marginBottom: 32,
      }}>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: blur ? 22 : 26,
          fontWeight: 700,
          color: '#fff',
          filter: blur ? 'blur(3px)' : 'none',
          transition: 'filter 0.4s, font-size 0.4s',
          minHeight: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1.3,
        }}>
          {display}
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 6, justifyContent: 'center' }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#ff3c6e',
                opacity: blur ? 1 : 0,
                transition: 'opacity 0.3s',
                animation: blur ? `pulse 1s ${i * 0.2}s infinite` : 'none',
              }}
            />
          ))}
        </div>
        <style>{`@keyframes pulse { 0%,100%{transform:scale(1);opacity:0.5} 50%{transform:scale(1.5);opacity:1} }`}</style>
      </div>

      <button
        onClick={onBack}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#444',
          fontSize: 14,
          cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        ← Change categories
      </button>
    </div>
  );
}
