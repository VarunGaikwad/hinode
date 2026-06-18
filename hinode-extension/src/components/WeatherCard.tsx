import React from 'react';
import type { WeatherData } from '../types/api';

interface WeatherCardProps {
  weather: WeatherData;
}

export default function WeatherCard({ weather }: WeatherCardProps) {
  return (
    <div className="p-4 bg-white bg-opacity-20 rounded-md backdrop-blur-sm text-black">
      <h2 className="text-xl font-bold mb-2">Weather in {weather.cityName}</h2>
      <p>Temp: {weather.temperature}°</p>
      <p>Condition: {weather.condition}</p>
      <p>Humidity: {weather.humidity}%</p>
      <p>Wind: {weather.windSpeed} m/s</p>
    </div>
  );
}
