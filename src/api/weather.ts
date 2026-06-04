import type { GeocodingResponse, GeoLocation, WeatherResponse, TempUnit, WindUnit, WeatherAlert } from '../types/weather';

export async function fetchAlerts(lat: number, lon: number): Promise<WeatherAlert[]> {
  try {
    const res = await fetch(`https://api.brightsky.dev/alerts?lat=${lat}&lon=${lon}`);
    if (!res.ok) return [];
    const data = await res.json();
    // Bright Sky uses localized field names (headline_de, description_de, etc.)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data.alerts ?? []).map((a: any): WeatherAlert => ({
      id: a.id,
      headline: a.headline_de ?? a.headline_en ?? '',
      description: a.description_de ?? a.description_en ?? '',
      instruction: a.instruction_de ?? a.instruction_en ?? null,
      event: a.event_de ?? a.event_en ?? '',
      severity: a.severity,
      urgency: a.urgency,
      onset: a.onset,
      expires: a.expires,
      url: a.url ?? null,
    }));
  } catch {
    return [];
  }
}

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
    `&hourly=temperature_2m,weather_code,precipitation_probability,precipitation,windspeed_10m,uv_index,surface_pressure,visibility` +
    `&forecast_days=7` +
    `&timezone=auto` +
    `&temperature_unit=${tempUnit}` +
    (windUnit === 'mph' ? '&wind_speed_unit=mph' : '');
  const res = await fetch(url);
  if (!res.ok) throw new Error('Weather API error');
  return res.json();
}
