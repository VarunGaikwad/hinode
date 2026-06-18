import { db } from "../db/db";
import axios from "axios";
import { WeatherData } from "../types/weather";

interface WeatherParams {
  lat?: number;
  lon?: number;
  city?: string;
  unit?: "metric" | "imperial";
}

// Time-to-live for weather cache (20 minutes)
const WEATHER_TTL_MS = 20 * 60 * 1000;

interface WeatherCacheRow {
  response_json: string;
  expires_at: string;
}

function computeCacheKey(params: WeatherParams): string {
  const { lat, lon, city, unit = "metric" } = params;
  if (lat !== undefined && lon !== undefined) {
    return `weather_${lat}_${lon}_${unit}`;
  }
  if (city) {
    return `weather_${city}_${unit}`;
  }
  return `weather_default_${unit}`;
}

export async function getCurrentWeather(params: WeatherParams): Promise<WeatherData | null> {
  const cacheKey = computeCacheKey(params);

  // Check cache first
  const cached: WeatherData | null = await new Promise((resolve) => {
db.get<WeatherCacheRow>(
                "SELECT response_json, expires_at FROM weather_cache WHERE cache_key = ?",
                [cacheKey],
                (err, row) => {
        if (err) {
          console.error("Error reading weather cache:", err);
          resolve(null);
          return;
        }
        if (row) {
          const now = new Date().toISOString();
          if (row.expires_at > now) {
            try {
              resolve(JSON.parse(row.response_json) as WeatherData);
              return;
            } catch (_) {
              // parsing error, fallback to fetch
            }
          }
        }
        resolve(null);
      }
    );
  });

  if (cached) {
    return cached;
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    console.error("OPENWEATHER_API_KEY not set in environment");
    return null;
  }

  const { lat, lon, city, unit = "metric" } = params;
  const queryParams: Record<string, string> = {
    appid: apiKey,
    units: unit,
  };

  if (lat !== undefined && lon !== undefined) {
    queryParams.lat = lat.toString();
    queryParams.lon = lon.toString();
  } else if (city) {
    queryParams.q = city;
  } else {
    console.error("Either lat/lon or city must be provided for weather request");
    return null;
  }

  try {
    const response = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
      params: queryParams,
    });
    const data = response.data;
    const weather: WeatherData = {
      cityName: data.name,
      temperature: data.main.temp,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      condition: data.weather?.[0]?.main ?? "",
      icon: data.weather?.[0]?.icon ?? "",
    };

    // Store in cache
    const expiresAt = new Date(Date.now() + WEATHER_TTL_MS).toISOString();
    db.run(
      "INSERT OR REPLACE INTO weather_cache (cache_key, provider, request_params, response_json, cached_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)",
      [
        cacheKey,
        "openweather",
        JSON.stringify(params),
        JSON.stringify(weather),
        new Date().toISOString(),
        expiresAt,
      ],
      (err) => {
        if (err) {
          console.error("Error inserting weather cache:", err);
        }
      }
    );

    return weather;
  } catch (e) {
    console.error("Error fetching weather from OpenWeather API:", e);
    return null;
  }
}
