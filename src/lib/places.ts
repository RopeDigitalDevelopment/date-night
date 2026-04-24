import { Place, AppSettings } from '../types';

const BASE_URL = 'https://places.googleapis.com/v1';

const FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.rating',
  'places.userRatingCount',
  'places.formattedAddress',
  'places.shortFormattedAddress',
  'places.photos',
  'places.googleMapsUri',
  'places.priceLevel',
  'places.currentOpeningHours',
  'places.primaryType',
].join(',');

export async function fetchNearbyPlaces(
  types: string[],
  settings: AppSettings
): Promise<Place[]> {
  const response = await fetch(`${BASE_URL}/places:searchNearby`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': settings.apiKey,
      'X-Goog-FieldMask': FIELD_MASK,
    },
    body: JSON.stringify({
      includedTypes: types,
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: { latitude: settings.lat, longitude: settings.lng },
          radius: settings.radiusKm * 1000,
        },
      },
      rankPreference: 'POPULARITY',
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error((err as any).error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  return (data.places ?? []) as Place[];
}

export function getPhotoUrl(photoName: string, apiKey: string, maxWidth = 600): string {
  return `${BASE_URL}/${photoName}/media?maxWidthPx=${maxWidth}&key=${apiKey}`;
}
