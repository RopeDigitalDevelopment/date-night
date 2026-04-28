import { useEffect, useState } from 'react';
import { Place, Category } from '../types';
import { getPhotoUrl } from '../lib/places';
import { getSettings } from '../lib/storage';
import { CATEGORIES } from '../lib/categories';
import { PRICE_DISPLAY_MAP } from '../lib/constants';
import { searchYouTubeVideos, YouTubeVideo } from '../lib/youtube';

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
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [videosLoading, setVideosLoading] = useState(true);
  const settings = getSettings();

  useEffect(() => {
    const id = setTimeout(() => setShow(true), 80);
    return () => clearTimeout(id);
  }, []);

  // Fetch YouTube videos for this place
  useEffect(() => {
    if (!settings.apiKey) return;
    setVideosLoading(true);
    const query = `${place.displayName.text} ${place.shortFormattedAddress ?? 'Kuala Lumpur'} review`;
    searchYouTubeVideos(query, settings.apiKey)
      .then(results => {
        setVideos(results);
        setVideosLoading(false);
      })
      .catch(() => setVideosLoading(false));
  }, [place.displayName.text, place.shortFormattedAddress, settings.apiKey]);

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

  const tiktokUrl = `https://www.tiktok.com/search?q=${encodeURIComponent(
    place.displayName.text + ' Kuala Lumpur review'
  )}`;

  return (
    <div
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'scale(1)' : 'scale(0.92)',
        transition: 'all 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        padding: '24px 16px 40px',
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
          background: photoUrl ? undefined : 'linear-gradient(135deg, #2d1145 0%, #1a0a2e 50%, #0f0f1a 100%)',
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

          {place.currentOpeningHours && (
            <div style={{
              position: 'absolute', bottom: 12, right: 12,
              background: place.currentOpeningHours.openNow ? 'rgba(0,200,100,0.9)' : 'rgba(200,50,50,0.9)',
              color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
            }}>
              {place.currentOpeningHours.openNow ? '✓ Open Now' : '✗ Closed'}
            </div>
          )}

          {priceDisplay && (
            <div style={{
              position: 'absolute', bottom: 12, left: 12,
              background: 'rgba(255,215,0,0.2)', border: '1px solid rgba(255,215,0,0.5)',
              color: '#ffd700', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
            }}>
              {priceDisplay}
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '24px 24px 8px' }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 26, fontWeight: 700, color: '#fff', margin: '0 0 8px', lineHeight: 1.2,
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

        {/* ── Video Section ── */}
        <div style={{ padding: '0 24px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <p style={{ color: '#888', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, margin: 0 }}>
              📹 Videos & Reviews
            </p>
            <a
              href={tiktokUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', padding: '4px 10px', borderRadius: 20,
                fontSize: 11, fontWeight: 600, textDecoration: 'none',
              }}
            >
              🎵 TikTok
            </a>
          </div>

          {videosLoading ? (
            <div style={{ display: 'flex', gap: 8 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  flex: 1, aspectRatio: '16/9', borderRadius: 10,
                  background: 'rgba(255,255,255,0.05)',
                  animation: 'shimmer 1.5s infinite',
                }} />
              ))}
              <style>{`@keyframes shimmer { 0%,100%{opacity:0.4} 50%{opacity:0.8} }`}</style>
            </div>
          ) : videos.length > 0 ? (
            <>
              {/* Active video player */}
              {activeVideo && (
                <div style={{ position: 'relative', marginBottom: 10 }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`}
                    style={{ width: '100%', aspectRatio: '16/9', border: 'none', borderRadius: 12 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <button
                    onClick={() => setActiveVideo(null)}
                    style={{
                      position: 'absolute', top: 8, right: 8,
                      background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff',
                      borderRadius: '50%', width: 28, height: 28, cursor: 'pointer',
                      fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >✕</button>
                </div>
              )}

              {/* Thumbnail strip */}
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                {videos.map(v => (
                  <button
                    key={v.videoId}
                    onClick={() => setActiveVideo(v.videoId === activeVideo ? null : v.videoId)}
                    style={{
                      flex: '0 0 auto',
                      width: 140,
                      background: 'none',
                      border: v.videoId === activeVideo ? '2px solid #ff3c6e' : '2px solid transparent',
                      borderRadius: 10,
                      padding: 0,
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={v.thumbnail}
                      alt={v.title}
                      style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
                    />
                    {/* Play overlay */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(0,0,0,0.35)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.9)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10,
                      }}>▶</div>
                    </div>
                    <p style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                      color: '#fff', fontSize: 9, padding: '10px 5px 4px',
                      margin: 0, lineHeight: 1.3,
                      overflow: 'hidden', display: '-webkit-box',
                      WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    }}>
                      {v.title}
                    </p>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(place.displayName.text + ' Kuala Lumpur review')}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'block', textAlign: 'center',
                padding: '12px', borderRadius: 12,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#888', fontSize: 13, textDecoration: 'none',
              }}
            >
              Search reviews on YouTube →
            </a>
          )}
        </div>

        {/* Actions */}
        <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block', textAlign: 'center' as const,
              background: 'linear-gradient(135deg, #ff3c6e, #ff6b35)',
              color: '#fff', padding: '16px', borderRadius: 14,
              textDecoration: 'none', fontWeight: 700, fontSize: 16,
              boxShadow: '0 8px 30px rgba(255,60,110,0.4)',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            🗺️ Open in Google Maps
          </a>
          <button
            onClick={onSpinAgain}
            style={{
              background: 'rgba(255,60,110,0.1)', border: '2px solid #ff3c6e',
              color: '#ff3c6e', padding: '14px', borderRadius: 14,
              fontSize: 16, fontWeight: 700, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            🎲 Spin Again
          </button>
          <button
            onClick={onBack}
            style={{
              background: 'transparent', border: 'none', color: '#666',
              padding: '10px', borderRadius: 14, fontSize: 14, cursor: 'pointer',
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
