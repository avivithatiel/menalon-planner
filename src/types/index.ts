export interface TrailSection {
  id: number;
  name: string;
  from: string;
  to: string;
  distance: number; // km
  duration: number; // hours
  difficulty: 1 | 2 | 3 | 4 | 5;
  elevationGain: number; // meters
  elevationLoss: number; // meters
  highestPoint: number; // meters
  highlights: string[];
  description: string;
  gpxFile: string; // path relative to /public
  fromCoords: [number, number]; // [lat, lng]
  toCoords: [number, number]; // [lat, lng]
}

export interface Village {
  name: string;
  coords: [number, number]; // [lat, lng]
  description: string;
  services: string[];
}

export interface Accommodation {
  id: string;
  name: string;
  type: 'hotel' | 'guesthouse' | 'rooms';
  village: string;
  coords: [number, number]; // [lat, lng]
  phone?: string;
  email?: string;
  website?: string;
  bookingUrl?: string;
  description?: string;
}

export interface WeatherForecast {
  date: string;
  temp: { min: number; max: number };
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  precipitation: number; // percentage
  condition: string;
  icon: string;
}

export interface ItineraryDay {
  dayNumber: number;
  date: string | null;
  sectionIds: number[];
  isRestDay: boolean;
  description: string;
}

export interface ItineraryState {
  startDate: string | null;
  pace: 'relaxed' | 'moderate' | 'fast';
  days: ItineraryDay[];
}

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  1: 'Easy',
  2: 'Moderate',
  3: 'Challenging',
  4: 'Difficult',
  5: 'Expert',
};

export const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  1: 'bg-green-500',
  2: 'bg-green-600',
  3: 'bg-yellow-500',
  4: 'bg-orange-500',
  5: 'bg-red-500',
};
