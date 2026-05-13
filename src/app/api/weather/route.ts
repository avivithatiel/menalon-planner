import { NextRequest, NextResponse } from 'next/server';

// In-memory cache for weather data
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json({ error: 'lat and lon are required' }, { status: 400 });
  }

  // Validate coordinates are numbers within valid range
  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);
  if (isNaN(latNum) || isNaN(lonNum) || latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180) {
    return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
  }

  const cacheKey = `${latNum.toFixed(4)},${lonNum.toFixed(4)}`;

  // Check cache
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  if (!apiKey) {
    // Return mock data if no API key is configured
    const mockData = getMockForecast();
    return NextResponse.json(mockData);
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latNum}&lon=${lonNum}&units=metric&appid=${apiKey}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`OpenWeatherMap API error: ${res.status}`);
    }

    const data = await res.json();

    // Transform to our format: group by day, take daily summary
    const dailyForecasts = transformToDaily(data.list);

    const result = { forecast: dailyForecasts };

    // Cache the result
    cache.set(cacheKey, { data: result, timestamp: Date.now() });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}

interface OpenWeatherItem {
  dt: number;
  main: { temp: number; temp_min: number; temp_max: number; feels_like: number; humidity: number };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
  pop: number;
}

function transformToDaily(list: OpenWeatherItem[]) {
  const days = new Map<string, OpenWeatherItem[]>();

  for (const item of list) {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0];
    if (!days.has(date)) days.set(date, []);
    days.get(date)!.push(item);
  }

  return Array.from(days.entries()).slice(0, 5).map(([date, items]) => ({
    date,
    temp: {
      min: Math.min(...items.map((i) => i.main.temp_min)),
      max: Math.max(...items.map((i) => i.main.temp_max)),
    },
    feelsLike: items[Math.floor(items.length / 2)].main.feels_like,
    humidity: Math.round(items.reduce((s, i) => s + i.main.humidity, 0) / items.length),
    windSpeed: Math.round(Math.max(...items.map((i) => i.wind.speed)) * 10) / 10,
    precipitation: Math.round(Math.max(...items.map((i) => i.pop)) * 100),
    condition: items[Math.floor(items.length / 2)].weather[0].description,
    icon: items[Math.floor(items.length / 2)].weather[0].icon,
  }));
}

function getMockForecast() {
  const today = new Date();
  return {
    forecast: Array.from({ length: 5 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      return {
        date: date.toISOString().split('T')[0],
        temp: { min: 12 + Math.random() * 5, max: 20 + Math.random() * 8 },
        feelsLike: 18 + Math.random() * 5,
        humidity: 40 + Math.round(Math.random() * 30),
        windSpeed: 5 + Math.round(Math.random() * 15),
        precipitation: Math.round(Math.random() * 40),
        condition: ['clear sky', 'few clouds', 'scattered clouds', 'light rain', 'clear sky'][i],
        icon: '02d',
      };
    }),
  };
}
