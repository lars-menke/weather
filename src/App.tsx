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
    <div className="min-h-screen w-full">
      {/* Subtle radial accent top-right like the design */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 85% 5%, rgba(96,165,250,0.18) 0%, transparent 55%)' }}
        aria-hidden
      />

      {/* Sticky header */}
      <header className="glass-header sticky top-0 z-50 w-full">
        <div className="max-w-lg mx-auto px-6 h-16 flex items-center">
          <SearchBar
            cityName={cityName}
            onSelect={handleSelect}
            onGPS={handleGPS}
            isLoadingGPS={isLoadingGPS}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-lg mx-auto px-6 pt-8 pb-12 flex flex-col gap-8">

        {/* Error banner */}
        {error && (
          <div
            className="rounded-xl px-4 py-3.5 flex items-center gap-3"
            style={{ background: 'rgba(186,26,26,0.08)', border: '1px solid rgba(186,26,26,0.2)' }}
          >
            <span className="material-symbols-outlined text-[18px] flex-shrink-0" style={{ color: '#ba1a1a' }}>
              warning
            </span>
            <p className="text-sm font-['Inter'] flex-1" style={{ color: '#93000a' }}>{error}</p>
            <button
              onClick={() => setError(null)}
              className="flex-shrink-0 transition-opacity hover:opacity-60"
              style={{ color: '#93000a' }}
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="flex flex-col items-center gap-8 animate-pulse">
            <div className="flex flex-col items-center gap-3 pt-4">
              <div className="h-28 w-36 rounded-2xl" style={{ background: 'rgba(0,96,172,0.08)' }} />
              <div className="h-7 w-40 rounded-lg" style={{ background: 'rgba(0,0,0,0.07)' }} />
              <div className="h-4 w-52 rounded" style={{ background: 'rgba(0,0,0,0.05)' }} />
            </div>
            <div className="glass-card w-full rounded-xl p-5">
              <div className="flex justify-around">
                {[1, 2, 3].map(n => (
                  <div key={n} className="flex flex-col items-center gap-2">
                    <div className="h-6 w-6 rounded-full" style={{ background: 'rgba(0,0,0,0.07)' }} />
                    <div className="h-3 w-12 rounded" style={{ background: 'rgba(0,0,0,0.05)' }} />
                    <div className="h-5 w-14 rounded" style={{ background: 'rgba(0,0,0,0.07)' }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card w-full rounded-xl overflow-hidden">
              {[1, 2, 3, 4, 5, 6, 7].map(n => (
                <div key={n} className="flex items-center gap-4 px-5 py-3.5" style={{ borderBottom: n < 7 ? '1px solid rgba(255,255,255,0.3)' : 'none' }}>
                  <div className="h-4 w-20 rounded" style={{ background: 'rgba(0,0,0,0.06)' }} />
                  <div className="h-5 w-5 rounded-full" style={{ background: 'rgba(0,0,0,0.06)' }} />
                  <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(0,0,0,0.06)' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weather content */}
        {!isLoading && weather && (
          <div className="flex flex-col gap-8 animate-fade-in">
            <CurrentWeather
              data={weather.current}
              cityName={cityName}
              country={country}
              timezone={weather.timezone}
            />
            <WeekForecast data={weather.daily} timezone={weather.timezone} />
          </div>
        )}

        <p className="text-center text-xs font-['Inter'] mt-2" style={{ color: '#717783', opacity: 0.5 }}>
          Open-Meteo · Keine API-Schlüssel erforderlich
        </p>
      </main>
    </div>
  );
}
