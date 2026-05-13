'use client';

import { useEffect, useState } from 'react';
import { WeatherForecast } from '@/types';

interface WeatherWidgetProps {
  lat: number;
  lon: number;
  villageName: string;
}

export default function WeatherWidget({ lat, lon, villageName }: WeatherWidgetProps) {
  const [forecast, setForecast] = useState<WeatherForecast[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
        if (!res.ok) throw new Error('Failed to fetch weather');
        const data = await res.json();
        setForecast(data.forecast);
      } catch (err) {
        setError('Weather unavailable');
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, [lat, lon]);

  if (loading) {
    return (
      <div className="bg-[var(--color-cream)] rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32 mb-3" />
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 w-16 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !forecast) {
    return (
      <div className="bg-[var(--color-cream)] rounded-lg p-4 text-sm text-[var(--color-stone)]">
        {error || 'Weather data unavailable'} — check your API key configuration.
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-cream)] rounded-lg p-4">
      <h4 className="text-sm font-medium text-[var(--color-forest)] mb-3">
        5-Day Forecast — {villageName}
      </h4>
      <div className="flex gap-2 overflow-x-auto">
        {forecast.slice(0, 5).map((day) => (
          <div
            key={day.date}
            className="flex-shrink-0 flex flex-col items-center bg-white rounded-lg p-2 min-w-[70px] shadow-sm"
          >
            <span className="text-xs text-[var(--color-stone)]">
              {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
            </span>
            <span className="text-2xl my-1">{getWeatherEmoji(day.condition)}</span>
            <span className="text-xs font-medium">
              {Math.round(day.temp.max)}° / {Math.round(day.temp.min)}°
            </span>
            <span className="text-xs text-blue-500">{day.precipitation}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function getWeatherEmoji(condition: string): string {
  const c = condition.toLowerCase();
  if (c.includes('clear') || c.includes('sun')) return '☀️';
  if (c.includes('cloud') && c.includes('few')) return '🌤️';
  if (c.includes('cloud')) return '☁️';
  if (c.includes('rain') || c.includes('drizzle')) return '🌧️';
  if (c.includes('thunder')) return '⛈️';
  if (c.includes('snow')) return '❄️';
  if (c.includes('mist') || c.includes('fog')) return '🌫️';
  return '🌤️';
}
