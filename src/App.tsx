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

  const weatherCode = weather?.current.weathercode ?? 0;
  const info = getWeatherInfo(weatherCode);

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-br ${info.gradient} transition-all duration-1000`}
    >
      {/* Decorative blobs for depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative min-h-screen flex flex-col items-center px-4 pb-12">
        {/* Top bar */}
        <div className="w-full max-w-2xl pt-8 pb-4">
          <SearchBar onSelect={handleSelect} onGPS={handleGPS} isLoadingGPS={isLoadingGPS} />
        </div>

        {/* Error */}
        {error && (
          <div className="w-full max-w-2xl mb-4">
            <div className="rounded-2xl bg-red-500/20 backdrop-blur-md border border-red-400/30 px-5 py-4 text-white flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <p className="text-sm">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-white/70 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="flex flex-col items-center gap-8 w-full max-w-2xl mt-8 animate-pulse">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-48 rounded-2xl bg-white/20" />
              <div className="h-5 w-24 rounded-xl bg-white/15" />
              <div className="h-32 w-32 rounded-full bg-white/20 mt-4" />
              <div className="h-24 w-48 rounded-2xl bg-white/20" />
            </div>
            <div className="w-full rounded-3xl bg-white/10 h-64" />
          </div>
        )}

        {/* Content */}
        {!isLoading && weather && (
          <div className="w-full max-w-2xl flex flex-col items-center gap-8 animate-fade-in">
            <CurrentWeather
              data={weather.current}
              cityName={cityName}
              country={country}
              timezone={weather.timezone}
            />
            <WeekForecast data={weather.daily} timezone={weather.timezone} />
          </div>
        )}

        {/* Footer */}
        <p className="mt-auto pt-8 text-white/30 text-xs text-center">
          Powered by Open-Meteo • Keine API-Schlüssel erforderlich
        </p>
      </div>
    </div>
  );
}
