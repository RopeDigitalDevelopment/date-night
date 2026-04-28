import { Logo } from './Logo';

interface Props {
  onStart: () => void;
  onSkip: () => void;
}

const starPositions = Array.from({ length: 30 }, (_, i) => ({
  key: i,
  top: `${(i * 37 + 11) % 100}%`,
  left: `${(i * 61 + 7) % 100}%`,
  size: (i % 3) + 1,
  opacity: 0.1 + (i % 4) * 0.1,
}));

export function SplashScreen({ onStart, onSkip }: Props) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center', position: 'relative' }}>
      {/* Static star field */}
      {starPositions.map(s => (
        <div
          key={s.key}
          style={{
            position: 'fixed',
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: '#fff',
            opacity: s.opacity,
            pointerEvents: 'none',
          }}
        />
      ))}

      <Logo size={80} />

      <h1 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 42,
        fontWeight: 900,
        color: '#fff',
        margin: '24px 0 8px',
        lineHeight: 1.1,
      }}>
        Date Night
      </h1>

      <p style={{ color: '#ff3c6e', letterSpacing: 4, textTransform: 'uppercase', fontSize: 11, marginBottom: 16 }}>
        Kuala Lumpur
      </p>

      <p style={{ color: '#888', fontSize: 16, maxWidth: 280, lineHeight: 1.7, marginBottom: 52 }}>
        The easiest way to decide where to go tonight ✨
      </p>

      <button
        onClick={onStart}
        style={{
          padding: '18px 52px',
          borderRadius: 50,
          background: 'linear-gradient(135deg, #ff3c6e, #ff6b35)',
          border: 'none',
          color: '#fff',
          fontSize: 18,
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 12px 40px rgba(255,60,110,0.4)',
          marginBottom: 16,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        Let's Go 🎲
      </button>

      <button
        onClick={onSkip}
        style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}
      >
        Skip setup — surprise me
      </button>

    </div>
  );
}
