import React from 'react';
import { Cloud, CloudLightning, CloudRain, CloudSnow, CloudSun, Sun, Wind } from 'lucide-react';
import type { WeatherData } from '../types/api';

interface WeatherCardProps {
  weather: WeatherData;
  unit?: 'metric' | 'imperial';
}

function getWeatherIcon(condition: string, iconCode?: string) {
  const code = iconCode?.toLowerCase() ?? '';
  const cond = condition.toLowerCase();

  if (code.includes('13') || cond.includes('snow') || cond.includes('ice')) {
    return <CloudSnow className="w-12 h-12 text-hinode-text-primary" aria-hidden="true" />;
  }
  if (code.includes('11') || cond.includes('thunder') || cond.includes('storm')) {
    return <CloudLightning className="w-12 h-12 text-hinode-text-primary" aria-hidden="true" />;
  }
  if (code.includes('09') || code.includes('10') || cond.includes('rain') || cond.includes('drizzle')) {
    return <CloudRain className="w-12 h-12 text-hinode-text-primary" aria-hidden="true" />;
  }
  if (code.includes('02') || code.includes('03') || code.includes('04') || cond.includes('cloud')) {
    return <CloudSun className="w-12 h-12 text-hinode-text-primary" aria-hidden="true" />;
  }
  if (code.includes('01') || cond.includes('sun') || cond.includes('clear')) {
    return <Sun className="w-12 h-12 text-hinode-text-primary" aria-hidden="true" />;
  }
  return <Cloud className="w-12 h-12 text-hinode-text-primary" aria-hidden="true" />;
}

export default function WeatherCard({ weather, unit = 'metric' }: WeatherCardProps) {
  const unitLabel = unit === 'metric' ? '°C' : '°F';
  const speedUnit = unit === 'metric' ? 'km/h' : 'mph';
  // The API returns windSpeed in m/s for metric; convert to km/h for display.
  const displayWind = unit === 'metric' ? Math.round(weather.windSpeed * 3.6) : weather.windSpeed;

  return (
    <div
      className="glass-card p-5 flex items-center gap-4 min-w-[220px] animate-in-5"
      role="region"
      aria-label={`Weather in ${weather.cityName}: ${weather.temperature}${unitLabel}, ${weather.condition}`}
    >
      {getWeatherIcon(weather.condition, weather.icon)}
      <div className="flex flex-col">
        <span className="text-3xl font-light text-hinode-text-primary">
          {Math.round(weather.temperature)}{unitLabel}
        </span>
        <span className="text-base font-medium text-hinode-text-secondary">
          {weather.cityName} · {weather.condition}
        </span>
        <span className="text-sm text-hinode-text-tertiary">
          H:{weather.humidity}% · W:{displayWind} {speedUnit}
        </span>
      </div>
    </div>
  );
}
