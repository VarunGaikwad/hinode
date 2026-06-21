import type { HomePayload, WeatherData, Background, Shayari } from '../types/api';
import { loadSettings } from './storageService';

export interface HomeRequestParams {
  lat?: number;
  lon?: number;
  city?: string;
  unit?: 'metric' | 'imperial';
  backgroundQuery?: string;
  language?: string;
}

async function getServerBaseUrl(): Promise<string> {
  const settings = await loadSettings();
  return (
    import.meta.env.VITE_SERVER_BASE_URL ||
    settings.serverBaseUrl ||
    'http://localhost:7000'
  );
}

async function getJson<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(body.error || `HTTP ${response.status}`);
    }

    return response.json() as Promise<T>;
  } catch (err) {
    // Surface network/CORS errors in the extension console for easier debugging.
    console.error(`[apiClient] GET ${url} failed:`, err);
    throw err;
  }
}

function buildQueryString(params: Record<string, string | number | undefined>): string {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      qs.set(key, String(value));
    }
  });
  const query = qs.toString();
  return query ? `?${query}` : '';
}

export async function fetchHome(params: HomeRequestParams = {}): Promise<HomePayload> {
  const baseUrl = await getServerBaseUrl();
  const query = buildQueryString({
    lat: params.lat,
    lon: params.lon,
    city: params.city,
    unit: params.unit,
    backgroundQuery: params.backgroundQuery,
    language: params.language,
  });
  const data = await getJson<HomePayload>(`${baseUrl}/api/home${query}`);
  return data;
}

export async function fetchWeather(params: Omit<HomeRequestParams, 'backgroundQuery' | 'language'> = {}): Promise<WeatherData> {
  const baseUrl = await getServerBaseUrl();
  const query = buildQueryString({
    lat: params.lat,
    lon: params.lon,
    city: params.city,
    unit: params.unit,
  });
  const data = await getJson<{ weather: WeatherData }>(`${baseUrl}/api/weather/current${query}`);
  return data.weather;
}

export async function fetchBackground(query = 'nature', random = false): Promise<Background> {
  const baseUrl = await getServerBaseUrl();
  const path = random ? 'random' : 'today';
  const qs = buildQueryString({ query });
  const data = await getJson<{ background: Background }>(`${baseUrl}/api/background/${path}${qs}`);
  return data.background;
}

export async function fetchShayari(language?: string): Promise<Shayari> {
  const baseUrl = await getServerBaseUrl();
  const qs = buildQueryString({ language });
  const data = await getJson<{ shayari: Shayari }>(`${baseUrl}/api/shayari/random${qs}`);
  return data.shayari;
}

export async function refreshBackground(query = 'nature'): Promise<Background> {
  return fetchBackground(query, true);
}
