export type ThemeMode = 'light' | 'dark' | 'system';
export type TemperatureUnit = 'metric' | 'imperial';
export type ClockFormat = '12h' | '24h';
export type BackgroundRefresh = 'daily' | 'every_tab' | 'manual';
export type ShayariLanguage = 'hindi' | 'marathi' | 'english';

export interface ExtensionSettings {
  userName: string;
  serverBaseUrl: string;
  useCurrentLocation: boolean;
  weatherCity?: string;
  temperatureUnit: TemperatureUnit;
  clockFormat: ClockFormat;
  backgroundQuery: string;
  backgroundRefresh: BackgroundRefresh;
  shayariLanguage: ShayariLanguage;
  theme: ThemeMode;
  overlayIntensity: number;
}

export const DEFAULT_SETTINGS: ExtensionSettings = {
  userName: 'Friend',
  serverBaseUrl: 'http://localhost:7000',
  useCurrentLocation: true,
  temperatureUnit: 'metric',
  clockFormat: '12h',
  backgroundQuery: 'sunrise landscape',
  backgroundRefresh: 'daily',
  shayariLanguage: 'hindi',
  theme: 'system',
  overlayIntensity: 0.35,
};
