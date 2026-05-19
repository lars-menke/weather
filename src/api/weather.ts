import type { GeocodingResponse, GeoLocation, WeatherResponse, TempUnit, WindUnit } from '../types/weather';

export async function searchCities(query: string): Promise<GeoLocation[]> {
  if (!query.trim()) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=de&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Geocoding API error');
  const data: GeocodingResponse = await res.json();
  return data.results ?? [];
}

export async function fetchWeather(
  lat: number,
  lon: number,
  tempUnit: TempUnit = 'celsius',
  windUnit: WindUnit = 'kmh',
): Promise<WeatherResponse> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,weather_code,windspeed_10m,relativehumidity_2m,apparent_temperature` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset` +
    `&hourly=temperature_2m,weather_code,precipitation_probability,windspeed_10m,uv_index,surface_pressure,visibility` +
    `&forecast_days=7` +
    `&timezone=auto` +
    `&temperature_unit=${tempUnit}` +
    (windUnit === 'mph' ? '&wind_speed_unit=mph' : '');
  const res = await fetch(url);
  if (!res.ok) throw new Error('Weather API error');
  return res.json();
}
