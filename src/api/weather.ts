import type { GeocodingResponse, GeoLocation, WeatherResponse, TempUnit, WindUnit, WeatherAlert, CurrentObservation } from '../types/weather';

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

// Bright Sky (DWD) icon/condition → WMO-Code, damit die bestehende
// Icon-, Theme- und Frosch-Logik unverändert weiterläuft.
function brightSkyToWmo(icon: string | null, condition: string | null): number {
  switch (icon) {
    case 'clear-day':
    case 'clear-night':         return 0;
    case 'partly-cloudy-day':
    case 'partly-cloudy-night': return 2;
    case 'cloudy':              return 3;
    case 'wind':                return 3;
    case 'fog':                 return 45;
    case 'rain':                return 61;
    case 'sleet':               return 66;
    case 'snow':                return 71;
    case 'hail':                return 96;
    case 'thunderstorm':        return 95;
  }
  switch (condition) {
    case 'dry':          return 1;
    case 'fog':          return 45;
    case 'rain':         return 61;
    case 'sleet':        return 66;
    case 'snow':         return 71;
    case 'hail':         return 96;
    case 'thunderstorm': return 95;
  }
  return 3;
}

/**
 * Echte aktuelle Messwerte der nächstgelegenen DWD-Station (via Bright Sky).
 * Liefert nur etwas zurück, wenn eine Station in Reichweite ist (im Wesentlichen
 * Deutschland) und die Messung aktuell ist – sonst null (Fallback: Open-Meteo).
 */
export async function fetchCurrentObservation(
  lat: number,
  lon: number,
  tempUnit: TempUnit = 'celsius',
  windUnit: WindUnit = 'kmh',
): Promise<CurrentObservation | null> {
  try {
    // units=dwd → Temperatur in °C, Wind in km/h
    const res = await fetch(`https://api.brightsky.dev/current_weather?lat=${lat}&lon=${lon}&units=dwd`);
    if (!res.ok) return null;
    const data = await res.json();
    const w = data.weather;
    if (!w || w.temperature == null) return null;

    // Veraltete Messungen (> 3 h) verwerfen
    const ageMs = Date.now() - new Date(w.timestamp).getTime();
    if (!Number.isFinite(ageMs) || ageMs > 3 * 60 * 60 * 1000) return null;

    const tempC = w.temperature as number;
    const obs: CurrentObservation = {
      temperature_2m: tempUnit === 'fahrenheit' ? tempC * 9 / 5 + 32 : tempC,
      weather_code: brightSkyToWmo(w.icon ?? null, w.condition ?? null),
      source: 'DWD',
    };

    const windKmh = w.wind_speed_30 ?? w.wind_speed_10 ?? w.wind_speed_60;
    if (typeof windKmh === 'number') {
      obs.windspeed_10m = windUnit === 'mph' ? windKmh * 0.621371 : windKmh;
    }
    if (typeof w.relative_humidity === 'number') {
      obs.relativehumidity_2m = Math.round(w.relative_humidity);
    }

    return obs;
  } catch {
    return null;
  }
}

export async function searchCities(query: string): Promise<GeoLocation[]> {  if (!query.trim()) return [];
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
