export interface WeatherCacheEntry {
  cache_key: string;
  provider: string;
  request_params: string;
  response_json: string;
  cached_at: string;
  expires_at: string;
}

export interface BackgroundCacheEntry {
  cache_key: string;
  provider: string;
  query: string;
  image_url: string;
  photographer_name?: string | null;
  photographer_url?: string | null;
  photo_url?: string | null;
  color?: string | null;
  blur_hash?: string | null;
  response_json: string;
  cached_at: string;
  expires_at: string;
}

export interface GeocodeCacheEntry {
  cache_key: string;
  provider: string;
  query: string;
  lat: number;
  lon: number;
  display_name?: string | null;
  response_json: string;
  cached_at: string;
  expires_at: string;
}

export interface SettingsEntry {
  key: string;
  value: string;
  updated_at: string;
}
