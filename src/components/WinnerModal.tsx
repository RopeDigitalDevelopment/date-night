import { useEffect, useState } from 'react';
import { Place, Category } from '../types';
import { getPhotoUrl } from '../lib/places';
import { getSettings } from '../lib/storage';
import { CATEGORIES } from '../lib/categories';
import { PRICE_DISPLAY_MAP } from '../lib/constants';

interface Props {
  place: Place;
  category: Category;
  onSpinAgain: () => void;
  onBack: () => void;
}

function starRating(r: number): string {
  return '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));
}

export function WinnerModal({ place, category, onSpinAgain, onBack }: Props) {
  const [show, setShow] = useState(false);
  const settings = getSettings();

  useEffect(() => {
    const id = setTimeout(() => setShow(true), 80);
    return () => clearTimeout(id);
  }, []);

  const photoUrl = place.photos?.[0]
    ? getPhotoUrl(place.photos[0].name, settings.apiKey)
    : null;

  const catEmoji =
    CATEGORIES.find(c => c.types.some(t => t === place.primaryType))?.emoji ??
    category.emoji;

  const mapsUrl =
    place.googleMapsUri ??
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      place.displayName.text + ' ' + (place.shortFormattedAddress ?? '')
    )}`;

  const priceDisplay = place.priceLevel ? PRICE_DISPLAY_MAP[place.priceLevel] : null;

  return (
    <div
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'scale(1)' : 'scale(0.92)',
        transition: 'all 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        padding: '24px 16px',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 32 }}>🎊</span>
      </div>
      <p style={{
        textAlign: 'center',
        color: '#ff3c6e',
        fontFamily: "'Playfair Display', serif",
        letterSpacing: 3,
        fontSize: 12,
        textTransform: 'uppercase' as const,
        marginBottom: 16,
      }}>
        Tonight you're going to…
      </p>

      <div style={{
        background: 'linear-gradient(145deg, #1a0a2e, #2d1145)',
        borderRadius: 24,
        border: '2px solid #ff3c6e',
        overflow: 'hidden',
        boxShadow: '0 0 80px rgba(255,60,110,0.25), 0 20px 60px rgba(0,0,0,0.5)',
        maxWidth: 420,
        margin: '0 auto',
      }}>
        {/* Photo / placeholder */}
        <div style={{
          height: 200,
          background: photoUrl
            ? undefined
            : 'linear-gradient(135deg, #2d1145 0%, #1a0a2e 50%, #0f0f1a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative' as const,
          overflow: 'hidden',
        }}>
          {photoUrl ? (
            <img src={photoUrl} alt={place.displayName.text} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: 64 }}>{catEmoji}</span>
          )}

          {/* Open / closed badge */}
          {place.currentOpeningHours && (
            <div style={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              background: place.currentOpeningHours.openNow ? 'rgba(0,200,100,0.9)' : 'rgba(200,50,50,0.9)',
              color: '#fff',
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
            }}>
              {place.currentOpeningHours.openNow ? '✓ Open Now' : '✗ Closed'}
            </div>
          )}

          {/* Price badge */}
          {priceDisplay && (
            <div style={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              background: 'rgba(255,215,0,0.2)',
              border: '1px solid rgba(255,215,0,0.5)',
              color: '#ffd700',
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
            }}>
              {priceDisplay}
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '24px 24px 8px' }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 26,
            fontWeight: 700,
            color: '#fff',
            margin: '0 0 8px',
            lineHeight: 1.2,
          }}>
            {place.displayName.text}
          </h2>

          {place.rating && (
            <div style={{ color: '#ffd700', fontSize: 18, marginBottom: 8 }}>
              {starRating(place.rating)}{' '}
              <span style={{ color: '#999', fontSize: 14 }}>{place.rating.toFixed(1)}</span>
              {place.userRatingCount && (
                <span style={{ color: '#555', fontSize: 12, marginLeft: 6 }}>
                  ({place.userRatingCount.toLocaleString()} reviews)
                </span>
              )}
            </div>
          )}

          {place.shortFormattedAddress && (
            <p style={{ color: '#aaa', fontSize: 14, margin: '0 0 16px' }}>
              📍 {place.shortFormattedAddress}
            </p>
          )}
        </div>

        {/* Actions */}
        <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              textAlign: 'center' as const,
              background: 'linear-gradient(135deg, #ff3c6e, #ff6b35)',
              color: '#fff',
              padding: '16px',
              borderRadius: 14,
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: 16,
              boxShadow: '0 8px 30px rgba(255,60,110,0.4)',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            🗺️ Open in Google Maps
          </a>
          <button
            onClick={onSpinAgain}
            style={{
              background: 'rgba(255,60,110,0.1)',
              border: '2px solid #ff3c6e',
              color: '#ff3c6e',
              padding: '14px',
              borderRadius: 14,
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            🎲 Spin Again
          </button>
          <button
            onClick={onBack}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#666',
              padding: '10px',
              borderRadius: 14,
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            ← Change Categories
          </button>
        </div>
      </div>
    </div>
  );
}
