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
}

export interface WeatherResponse {
  current: CurrentWeatherData;
  daily: DailyWeatherData;
  timezone: string;
  timezone_abbreviation: string;
  utc_offset_seconds: number;
}

export interface WeatherInfo {
  icon: string;
  description: string;
  gradient: string;
  bgClass: string;
}
