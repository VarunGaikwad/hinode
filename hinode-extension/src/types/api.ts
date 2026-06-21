export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  icon: string;
  cityName: string;
}

export interface Background {
  image_url: string;
  photographer_name?: string;
  photographer_url?: string;
  photo_url?: string;
  color?: string;
  blur_hash?: string;
  query: string;
  expires_at?: string;
  cached_at?: string;
}

export interface Shayari {
  id: string;
  text: string;
  language: string;
  category?: string | null;
  mood?: string | null;
  author?: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface HomePayload {
  weather: WeatherData | null;
  background: Background | null;
  shayari: Shayari | null;
  serverTime: string;
}

export interface ApiError {
  error: string;
}
