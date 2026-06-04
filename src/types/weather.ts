export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string;
}

export interface GeocodingResponse {
  results?: GeoLocation[];
}

export interface CurrentWeatherData {
  temperature_2m: number;
  weather_code: number;
  windspeed_10m: number;
  relativehumidity_2m: number;
  apparent_temperature: number;
  time: string;
}

export interface DailyWeatherData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  sunrise: string[];
  sunset: string[];
}

export interface HourlyWeatherData {
  time: string[];
  temperature_2m: number[];
  weather_code: number[];
  precipitation_probability: number[];
  precipitation: number[];
  windspeed_10m: number[];
  uv_index: number[];
  surface_pressure: number[];
  visibility: number[];
}

export interface Favorite {
  lat: number;
  lon: number;
  city: string;
  country: string;
}

export interface WeatherResponse {
  current: CurrentWeatherData;
  daily: DailyWeatherData;
  hourly: HourlyWeatherData;
  timezone: string;
  timezone_abbreviation: string;
  utc_offset_seconds: number;
}

export interface WeatherAlert {
  id: number;
  headline: string;
  description: string;
  instruction?: string | null;
  event: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  urgency: string;
  onset: string;
  expires: string;
  url?: string | null;
}

export interface WeatherInfo {
  icon: string;
  description: string;
  gradient: string;
  bgClass: string;
}

export type TempUnit = 'celsius' | 'fahrenheit';
export type WindUnit = 'kmh' | 'mph';
