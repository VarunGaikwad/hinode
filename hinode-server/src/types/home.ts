export interface HomePayload {
  weather: WeatherData | null;
  background: Background | null;
  shayari: Shayari | null;
  serverTime: string;
}
