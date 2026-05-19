import { useState, useEffect, useCallback } from 'react';
import { SearchBar } from './components/SearchBar';
import { CurrentWeather } from './components/CurrentWeather';
import { WeekForecast } from './components/WeekForecast';
import { getWeatherInfo } from './components/WeatherIcon';
import { fetchWeather, searchCities } from './api/weather';
import type { WeatherResponse, GeoLocation } from './types/weather';
import './App.css';

// Hamburg, Germany defaults
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

  // Load Hamburg on mount
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
          // Reverse-geocode via city search not available; use coords directly
          // Try to get city name by fetching nearby city
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

  const weatherCode = weather?.current.weather_code ?? 0;
  const info = getWeatherInfo(weatherCode);

  return (
    <div
      className={`min-h-screen w-full transition-all duration-1000 bg-gradient-to-br ${info.gradient}`}
    >
      {/* Layered background for depth */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.25) 100%)' }}
        />
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative min-h-screen flex flex-col items-center px-5 pb-16">
        {/* Search bar */}
        <div className="w-full max-w-lg pt-10 pb-2">
          <SearchBar onSelect={handleSelect} onGPS={handleGPS} isLoadingGPS={isLoadingGPS} />
        </div>

        {/* Error banner */}
        {error && (
          <div className="w-full max-w-lg mt-3">
            <div
              className="rounded-2xl px-5 py-4 text-white flex items-center gap-3"
              style={{
                background: 'rgba(239,68,68,0.20)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(239,68,68,0.30)',
              }}
            >
              <span className="text-lg flex-shrink-0">⚠️</span>
              <p className="text-sm flex-1">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-white/60 hover:text-white transition-colors text-lg leading-none flex-shrink-0"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="flex flex-col items-center gap-10 w-full max-w-lg mt-10 animate-pulse">
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="h-10 w-44 rounded-2xl bg-white/15" />
              <div className="h-4 w-28 rounded-xl bg-white/10" />
              <div className="h-36 w-36 rounded-full bg-white/15 mt-6" />
              <div className="h-8 w-32 rounded-xl bg-white/10" />
            </div>
            <div className="grid grid-cols-2 gap-3 w-full">
              <div className="h-20 rounded-2xl bg-white/10" />
              <div className="h-20 rounded-2xl bg-white/10" />
            </div>
            <div className="w-full rounded-3xl bg-white/10 h-72" />
          </div>
        )}

        {/* Main content */}
        {!isLoading && weather && (
          <div className="w-full max-w-lg flex flex-col gap-6 animate-fade-in">
            <CurrentWeather
              data={weather.current}
              cityName={cityName}
              country={country}
              timezone={weather.timezone}
            />
            <WeekForecast data={weather.daily} timezone={weather.timezone} />
          </div>
        )}

        <p className="mt-auto pt-10 text-white/25 text-xs text-center tracking-wide">
          Open-Meteo · Keine API-Schlüssel erforderlich
        </p>
      </div>
    </div>
  );
}
