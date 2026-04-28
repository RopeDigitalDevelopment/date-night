import { useState } from 'react';
import { UserPrefs } from '../types';
import { VIBES, DIETARY, DRESS_CODES, PRICE_LEVELS, DEFAULT_PREFS } from '../lib/constants';

interface Props {
  onDone: (prefs: UserPrefs) => void;
}

export function Onboarding({ onDone }: Props) {
  const [step, setStep] = useState(0);
  const [prefs, setPrefs] = useState<UserPrefs>({ ...DEFAULT_PREFS });

  const toggleArr = (key: 'vibes' | 'dietary', val: string) => {
    setPrefs(p => {
      const arr = p[key];
      return { ...p, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] };
    });
  };

  const chipStyle = (active: boolean): React.CSSProperties => ({
    padding: '10px 18px',
    borderRadius: 30,
    border: active ? '2px solid #ff3c6e' : '2px solid rgba(255,255,255,0.1)',
    background: active ? 'rgba(255,60,110,0.2)' : 'rgba(255,255,255,0.05)',
    color: active ? '#ff3c6e' : '#ccc',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: active ? 700 : 400,
    transition: 'all 0.2s',
    fontFamily: "'DM Sans', sans-serif",
  });

  const steps = [
    {
      title: "What's the vibe tonight?",
      subtitle: 'Pick everything that sounds good',
      content: (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
          {VIBES.map(v => (
            <button key={v} onClick={() => toggleArr('vibes', v)} style={chipStyle(prefs.vibes.includes(v))}>
              {v}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: 'Any dietary needs?',
      subtitle: "We'll make sure the place works for you",
      content: (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
          {DIETARY.map(d => (
            <button key={d} onClick={() => toggleArr('dietary', d)} style={chipStyle(prefs.dietary.includes(d))}>
              {d}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: 'Dress code preference?',
      subtitle: 'So you know what to wear',
      content: (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
          {DRESS_CODES.map(d => (
            <button key={d} onClick={() => setPrefs(p => ({ ...p, dressCode: d }))} style={chipStyle(prefs.dressCode === d)}>
              {d}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "What's your budget?",
      subtitle: 'Price range for tonight',
      content: (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
          {PRICE_LEVELS.map(pl => (
            <button
              key={pl.value}
              onClick={() => setPrefs(p => ({ ...p, priceLevel: pl.value }))}
              style={chipStyle(prefs.priceLevel === pl.value)}
            >
              {pl.symbol ? `${pl.symbol} — ${pl.label}` : pl.label}
            </button>
          ))}
        </div>
      ),
    },
  ];

  const cur = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      {/* Progress bar */}
      <div style={{ width: '100%', maxWidth: 460, marginBottom: 40 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {steps.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 3,
                background: i <= step ? '#ff3c6e' : 'rgba(255,255,255,0.1)',
                transition: 'background 0.4s',
              }}
            />
          ))}
        </div>
      </div>

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: 460,
        background: 'linear-gradient(145deg, #1a0a2e, #0f0f1a)',
        borderRadius: 24,
        border: '1px solid rgba(255,60,110,0.2)',
        padding: '40px 28px',
        boxShadow: '0 20px 80px rgba(0,0,0,0.5)',
      }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: '#fff', margin: '0 0 8px', textAlign: 'center' }}>
          {cur.title}
        </h2>
        <p style={{ color: '#888', fontSize: 14, textAlign: 'center', margin: '0 0 28px', fontFamily: "'DM Sans', sans-serif" }}>
          {cur.subtitle}
        </p>

        {cur.content}

        <div style={{ display: 'flex', gap: 12, marginTop: 36 }}>
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: 14,
                background: 'transparent',
                border: '2px solid rgba(255,255,255,0.1)',
                color: '#fff',
                cursor: 'pointer',
                fontSize: 15,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              ← Back
            </button>
          )}
          <button
            onClick={() => (isLast ? onDone(prefs) : setStep(s => s + 1))}
            style={{
              flex: 2,
              padding: '16px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #ff3c6e, #ff6b35)',
              border: 'none',
              color: '#fff',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(255,60,110,0.4)',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {isLast ? "Let's find a spot! 🎲" : 'Continue →'}
          </button>
        </div>

        {step === 0 && (
          <button
            onClick={() => onDone(prefs)}
            style={{ display: 'block', margin: '16px auto 0', background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}
          >
            Skip setup — surprise me
          </button>
        )}
      </div>
    </div>
  );
}
