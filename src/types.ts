export interface PlaceDisplayName {
  text: string;
  languageCode: string;
}

export interface PlacePhoto {
  name: string;
  widthPx: number;
  heightPx: number;
}

export interface PlaceOpeningHours {
  openNow: boolean;
}

export interface Place {
  id: string;
  displayName: PlaceDisplayName;
  rating?: number;
  userRatingCount?: number;
  formattedAddress?: string;
  shortFormattedAddress?: string;
  photos?: PlacePhoto[];
  googleMapsUri?: string;
  priceLevel?: string;
  currentOpeningHours?: PlaceOpeningHours;
  primaryType?: string;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  description: string;
  gradient: string;
  types: string[];
}

export interface AppSettings {
  apiKey: string;
  radiusKm: number;
  lat: number;
  lng: number;
}
