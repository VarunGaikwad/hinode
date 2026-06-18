export interface WeatherData {
  cityName: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  icon: string;
}

export interface Background {
  image_url: string;
  photographer_name?: string;
  photographer_url?: string;
  photo_url?: string;
  color?: string;
  blur_hash?: string;
  query: string;
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
