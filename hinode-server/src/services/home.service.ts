import { getCurrentWeather } from "../services/weather.service";
import { getBackground } from "../services/background.service";
import { getRandomShayari } from "../services/shayari.service";
import type { WeatherData } from "../types/weather";
import type { Background } from "../types/background";
import type { Shayari } from "../types/shayari";
import type { HomePayload } from "../types/home";

/**
 * Retrieves the combined payload for the home endpoint.
 * Fetches weather, background, and shayari concurrently.
 */
export async function getHomePayload(params: {
  lat?: number;
  lon?: number;
  city?: string;
  unit?: "metric" | "imperial";
  backgroundQuery?: string;
  language?: string;
}): Promise<HomePayload> {
  const {
    lat,
    lon,
    city,
    unit,
    backgroundQuery = "nature",
    language,
  } = params;

  const weatherPromise = getCurrentWeather({ lat, lon, city, unit });
  const backgroundPromise = getBackground(backgroundQuery, false);
  const shayariPromise = getRandomShayari(language);

  const [weather, background, shayari] = await Promise.all([
    weatherPromise,
    backgroundPromise,
    shayariPromise,
  ]);

  return {
    weather,
    background,
    shayari,
    serverTime: new Date().toISOString(),
  };
}
