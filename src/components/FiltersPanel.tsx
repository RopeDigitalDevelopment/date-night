import { useState } from 'react';
import { Filters } from '../types';
import { DIETARY, DRESS_CODES, PRICE_LEVELS } from '../lib/constants';

interface Props {
  filters: Filters;
  setFilters: (f: Filters) => void;
  onClose: () => void;
}

export function FiltersPanel({ filters, setFilters, onClose }: Props) {
  const [local, setLocal] = useState<Filters>({ ...filters });

  const toggleDietary = (val: string) => {
    setLocal(p => {
      const arr = p.dietary;
      return { ...p, dietary: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] };
    });
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'flex-end' }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxHeight: '88vh',
          background: '#0f0f1a',
          borderRadius: '24px 24px 0 0',
          border: '1px solid rgba(255,60,110,0.2)',
          borderBottom: 'none',
          padding: '24px 20px 32px',
          overflowY: 'auto',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <h3 style={{ color: '#fff', fontFamily: "'Playfair Display', serif", fontSize: 22, margin: 0 }}>Filters</h3>
          <button
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ✕
          </button>
        </div>

        {/* Open Now toggle */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
            <div
              onClick={() => setLocal(p => ({ ...p, openNow: !p.openNow }))}
              style={{
                width: 48,
                height: 26,
                borderRadius: 13,
                background: local.openNow ? '#ff3c6e' : 'rgba(255,255,255,0.1)',
                position: 'relative',
                transition: 'background 0.2s',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <div style={{
                position: 'absolute',
                top: 3,
                left: local.openNow ? 25 : 3,
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: '#fff',
                transition: 'left 0.2s',
              }} />
            </div>
            <span style={{ color: '#fff', fontSize: 15 }}>Open Now Only</span>
          </label>
        </div>

        {/* Price range */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ color: '#888', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Price Range</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {PRICE_LEVELS.map(pl => (
              <button
                key={pl.value}
                onClick={() => setLocal(p => ({ ...p, priceLevel: pl.value }))}
                style={{
                  flex: 1,
                  padding: '10px 4px',
                  borderRadius: 10,
                  border: local.priceLevel === pl.value ? '2px solid #ff3c6e' : '2px solid rgba(255,255,255,0.1)',
                  background: local.priceLevel === pl.value ? 'rgba(255,60,110,0.2)' : 'transparent',
                  color: local.priceLevel === pl.value ? '#ff3c6e' : '#ccc',
                  cursor: 'pointer',
                  fontSize: 10,
                  textAlign: 'center',
                  fontFamily: "'DM Sans', sans-serif",
                  lineHeight: 1.4,
                }}
              >
                {pl.symbol || 'Any'}
                {pl.value > 0 && <><br /><span style={{ fontSize: 9 }}>{pl.label}</span></>}
              </button>
            ))}
          </div>
        </div>

        {/* Min rating */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ color: '#888', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
            Min Rating: {local.minRating}★
          </p>
          <input
            type="range"
            min="3"
            max="5"
            step="0.5"
            value={local.minRating}
            onChange={e => setLocal(p => ({ ...p, minRating: +e.target.value }))}
            style={{ width: '100%', accentColor: '#ff3c6e' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555', fontSize: 11, marginTop: 4 }}>
            <span>3.0</span><span>3.5</span><span>4.0</span><span>4.5</span><span>5.0</span>
          </div>
        </div>

        {/* Dietary */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ color: '#888', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Dietary</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {DIETARY.filter(d => d !== 'No preference').map(d => {
              const active = local.dietary.includes(d);
              return (
                <button
                  key={d}
                  onClick={() => toggleDietary(d)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 20,
                    border: active ? '2px solid #00c864' : '2px solid rgba(255,255,255,0.1)',
                    background: active ? 'rgba(0,200,100,0.1)' : 'transparent',
                    color: active ? '#00c864' : '#ccc',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dress code */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ color: '#888', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Dress Code</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {DRESS_CODES.map(d => {
              const active = local.dressCode === d;
              return (
                <button
                  key={d}
                  onClick={() => setLocal(p => ({ ...p, dressCode: d }))}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 20,
                    border: active ? '2px solid #ffd700' : '2px solid rgba(255,255,255,0.1)',
                    background: active ? 'rgba(255,215,0,0.1)' : 'transparent',
                    color: active ? '#ffd700' : '#ccc',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        {/* Apply */}
        <button
          onClick={() => { setFilters(local); onClose(); }}
          style={{
            width: '100%',
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
            marginBottom: 16,
          }}
        >
          Apply Filters
        </button>

      </div>
    </div>
  );
}
