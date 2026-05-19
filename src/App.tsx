import { useState, useEffect, useCallback } from 'react';
import { SearchBar } from './components/SearchBar';
import { CurrentWeather } from './components/CurrentWeather';
import { WeekForecast } from './components/WeekForecast';
import { fetchWeather, searchCities } from './api/weather';
import type { WeatherResponse, GeoLocation } from './types/weather';
import './App.css';

const DEFAULT_LAT = 53.5753;
const DEFAULT_LON = 10.0153;
const DEFAULT_CITY = 'Hamburg';
const DEFAULT_COUNTRY = 'Deutschland';

export default function App() {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [cityName, setCityName] = useState(DEFAULT_CITY);
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingGPS, setIsLoadingGPS] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = useCallback(async (lat: number, lon: number, city: string, countryName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(lat, lon);
      setWeather(data);
      setCityName(city);
      setCountry(countryName);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fehler beim Laden der Wetterdaten');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeather(DEFAULT_LAT, DEFAULT_LON, DEFAULT_CITY, DEFAULT_COUNTRY);
  }, [loadWeather]);

  function handleSelect(loc: GeoLocation) {
    loadWeather(loc.latitude, loc.longitude, loc.name, loc.country);
  }

  function handleGPS() {
    if (!navigator.geolocation) {
      setError('Geolocation wird von Ihrem Browser nicht unterstützt.');
      return;
    }
    setIsLoadingGPS(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const cities = await searchCities(`${latitude.toFixed(2)}`);
          if (cities.length > 0) {
            const c = cities[0];
            await loadWeather(latitude, longitude, c.name, c.country);
          } else {
            await loadWeather(latitude, longitude, 'Mein Standort', '');
          }
        } catch {
          await loadWeather(latitude, longitude, 'Mein Standort', '');
        } finally {
          setIsLoadingGPS(false);
        }
      },
      (err) => {
        setIsLoadingGPS(false);
        setError(`Standort konnte nicht ermittelt werden: ${err.message}`);
      },
      { timeout: 10000 }
    );
  }

  return (
    <div style={{ minHeight: '100dvh', paddingTop: 'env(safe-area-inset-top)' }}>

      {/* Top bar — icon buttons only, no nav chrome */}
      <div style={{
        position: 'absolute', top: 'calc(env(safe-area-inset-top) + 12px)',
        right: 16, zIndex: 10,
      }}>
        <SearchBar onSelect={handleSelect} onGPS={handleGPS} isLoadingGPS={isLoadingGPS} />
      </div>

      {/* Scrollable content */}
      <div style={{ padding: '60px 20px 40px', display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* Error */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(186,26,26,0.08)', border: '1px solid rgba(186,26,26,0.18)',
            borderRadius: 12, padding: '12px 14px',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#ba1a1a', flexShrink: 0 }}>warning</span>
            <p style={{ flex: 1, fontSize: 13, fontFamily: 'Inter', color: '#93000a' }}>{error}</p>
            <button onClick={() => setError(null)}>
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#93000a' }}>close</span>
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="animate-pulse" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ height: 16, width: 120, borderRadius: 8, background: 'rgba(0,0,0,0.08)' }} />
            <div style={{ height: 110, width: 160, borderRadius: 12, background: 'rgba(0,96,172,0.08)', marginTop: 8 }} />
            <div style={{ height: 24, width: 140, borderRadius: 8, background: 'rgba(0,0,0,0.07)' }} />
            <div style={{ height: 16, width: 100, borderRadius: 8, background: 'rgba(0,0,0,0.05)' }} />
            <div style={{ height: 36, width: 180, borderRadius: 8, background: 'rgba(0,0,0,0.05)', marginTop: 8 }} />
            <div style={{ width: '100%', height: 300, borderRadius: 16, background: 'rgba(255,255,255,0.4)', marginTop: 12 }} />
          </div>
        )}

        {/* Weather content */}
        {!isLoading && weather && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <CurrentWeather
              data={weather.current}
              cityName={cityName}
              country={country}
              timezone={weather.timezone}
            />
            <WeekForecast data={weather.daily} timezone={weather.timezone} />
            <p style={{ textAlign: 'center', fontSize: 11, fontFamily: 'Inter', color: '#c1c7d3', paddingBottom: 'env(safe-area-inset-bottom)' }}>
              Open-Meteo · Keine API-Schlüssel erforderlich
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
