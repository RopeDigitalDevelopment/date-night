import { useEffect, useState } from 'react';
import { Place, Category } from '../types';
import { getPhotoUrl } from '../lib/places';
import { getSettings } from '../lib/storage';

interface Props {
  place: Place;
  category: Category;
  onSpinAgain: () => void;
  onBack: () => void;
}

const PRICE_MAP: Record<string, string> = {
  PRICE_LEVEL_FREE: 'Free',
  PRICE_LEVEL_INEXPENSIVE: 'RM',
  PRICE_LEVEL_MODERATE: 'RM RM',
  PRICE_LEVEL_EXPENSIVE: 'RM RM RM',
  PRICE_LEVEL_VERY_EXPENSIVE: 'RM RM RM RM',
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i === Math.floor(rating) && rating % 1 >= 0.5;
        return (
          <span
            key={i}
            className={filled ? 'text-yellow-400' : half ? 'text-yellow-400/50' : 'text-white/15'}
          >
            ★
          </span>
        );
      })}
      <span className="text-white/60 text-sm ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

export function WinnerModal({ place, category, onSpinAgain, onBack }: Props) {
  const [visible, setVisible] = useState(true); // start visible immediately
  const settings = getSettings();

  useEffect(() => {
    setVisible(true);
  }, []);

  const photoUrl = place.photos?.[0]
    ? getPhotoUrl(place.photos[0].name, settings.apiKey)
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f1a]">
      {/* Hero header */}
      <div
        className={`px-6 pt-14 pb-6 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
      >
        <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Tonight you're going to</p>
        <h1 className="text-3xl font-bold text-white leading-tight">{place.displayName.text}</h1>
        <p className="text-white/40 text-sm mt-1">{category.emoji} {category.name}</p>
      </div>

      {/* Photo */}
      {photoUrl && (
        <div
          className={`mx-6 rounded-3xl overflow-hidden bg-white/5 transition-all duration-700 delay-75 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          style={{ height: 200 }}
        >
          <img
            src={photoUrl}
            alt={place.displayName.text}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Details card */}
      <div
        className={`mx-6 mt-4 bg-white/5 border border-white/8 rounded-3xl p-5 space-y-3 transition-all duration-700 delay-150 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
      >
        {place.rating && (
          <div className="flex items-center justify-between">
            <StarRating rating={place.rating} />
            {place.userRatingCount && (
              <span className="text-white/30 text-xs">{place.userRatingCount.toLocaleString()} reviews</span>
            )}
          </div>
        )}

        {place.currentOpeningHours && (
          <div className={`text-sm font-semibold flex items-center gap-2 ${place.currentOpeningHours.openNow ? 'text-emerald-400' : 'text-red-400'}`}>
            <span className={`w-2 h-2 rounded-full ${place.currentOpeningHours.openNow ? 'bg-emerald-400' : 'bg-red-400'}`} />
            {place.currentOpeningHours.openNow ? 'Open now' : 'Closed now'}
          </div>
        )}

        {place.shortFormattedAddress && (
          <p className="text-white/50 text-sm leading-relaxed">{place.shortFormattedAddress}</p>
        )}

        {place.priceLevel && PRICE_MAP[place.priceLevel] && (
          <p className="text-white/40 text-sm">{PRICE_MAP[place.priceLevel]}</p>
        )}
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <div
        className={`px-6 pb-12 space-y-3 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        {place.googleMapsUri && (
          <a
            href={place.googleMapsUri}
            target="_blank"
            rel="noopener noreferrer"
            className={`block w-full py-4 rounded-2xl font-bold text-center text-white bg-gradient-to-r ${category.gradient} shadow-lg text-base active:opacity-90 transition-opacity`}
          >
            🗺️  Open in Google Maps
          </a>
        )}
        <button
          onClick={onSpinAgain}
          className="w-full py-4 rounded-2xl font-bold text-white bg-white/8 border border-white/10 text-base active:bg-white/15 transition-colors"
        >
          🔄  Spin Again
        </button>
        <button
          onClick={onBack}
          className="w-full py-3 text-white/30 text-sm active:text-white/50 transition-colors"
        >
          ← Change Category
        </button>
      </div>
    </div>
  );
}
