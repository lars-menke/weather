import { useState, useEffect, useCallback } from 'react';
import { SearchBar } from './components/SearchBar';
import { SplashScreen } from './components/SplashScreen';
import { TabBar } from './components/TabBar';
import Dashboard from './pages/Dashboard';
import ForecastPage from './pages/ForecastPage';
import RadarScreen from './pages/RadarScreen';
import SettingsScreen from './pages/SettingsScreen';
import { fetchWeather, searchCities } from './api/weather';
import type { WeatherResponse, GeoLocation, TempUnit, WindUnit } from './types/weather';
import './App.css';

const DEFAULT_LAT = 53.5753;
const DEFAULT_LON = 10.0153;
const DEFAULT_CITY = 'Hamburg';
const DEFAULT_COUNTRY = 'Deutschland';

function loadPref<T extends string>(key: string, fallback: T): T {
  return (localStorage.getItem(key) as T | null) ?? fallback;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [cityName, setCityName] = useState(DEFAULT_CITY);
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [coords, setCoords] = useState({ lat: DEFAULT_LAT, lon: DEFAULT_LON });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingGPS, setIsLoadingGPS] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempUnit, setTempUnit] = useState<TempUnit>(() => loadPref('tempUnit', 'celsius'));
  const [windUnit, setWindUnit] = useState<WindUnit>(() => loadPref('windUnit', 'kmh'));

  const loadWeather = useCallback(async (lat: number, lon: number, city: string, countryName: string, tu: TempUnit, wu: WindUnit) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(lat, lon, tu, wu);
      setWeather(data);
      setCityName(city);
      setCountry(countryName);
      setCoords({ lat, lon });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fehler beim Laden der Wetterdaten');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeather(DEFAULT_LAT, DEFAULT_LON, DEFAULT_CITY, DEFAULT_COUNTRY, tempUnit, windUnit);
  }, [loadWeather]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSelect(loc: GeoLocation) {
    loadWeather(loc.latitude, loc.longitude, loc.name, loc.country, tempUnit, windUnit);
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
          const c = cities[0];
          await loadWeather(latitude, longitude, c?.name ?? 'Mein Standort', c?.country ?? '', tempUnit, windUnit);
        } catch {
          await loadWeather(latitude, longitude, 'Mein Standort', '', tempUnit, windUnit);
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

  function handleTempUnit(u: TempUnit) {
    localStorage.setItem('tempUnit', u);
    setTempUnit(u);
    loadWeather(coords.lat, coords.lon, cityName, country, u, windUnit);
  }

  function handleWindUnit(u: WindUnit) {
    localStorage.setItem('windUnit', u);
    setWindUnit(u);
    loadWeather(coords.lat, coords.lon, cityName, country, tempUnit, u);
  }

  if (showSplash) {
    return <SplashScreen onDone={() => setShowSplash(false)} />;
  }

  const isRadar = activeTab === 2;

  return (
    <div style={{ minHeight: '100dvh', paddingTop: 'env(safe-area-inset-top)', paddingBottom: 60, position: 'relative' }}>

      {/* Radar screen renders outside the padded flow */}
      {isRadar && <RadarScreen lat={coords.lat} lon={coords.lon} />}

      {/* Search bar — hidden on Radar and Settings tabs */}
      {activeTab <= 1 && (
        <div style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top) + 12px)', right: 16, zIndex: 10 }}>
          <SearchBar onSelect={handleSelect} onGPS={handleGPS} isLoadingGPS={isLoadingGPS} />
        </div>
      )}

      {/* Scrollable content — hidden on Radar */}
      {!isRadar && (
        <div style={{ padding: '68px 20px 20px' }}>

          {/* Error banner */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(186,26,26,0.08)', border: '1px solid rgba(186,26,26,0.18)',
              borderRadius: 12, padding: '12px 14px', marginBottom: 16,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#ba1a1a', flexShrink: 0 }}>warning</span>
              <p style={{ flex: 1, fontSize: 13, fontFamily: 'Inter', color: '#93000a' }}>{error}</p>
              <button
                onClick={() => setError(null)}
                aria-label="Fehler schließen"
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 32, minHeight: 32, background: 'none', border: 'none', borderRadius: 6, flexShrink: 0 }}
              >
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

          {/* Tab screens */}
          {!isLoading && weather && activeTab === 0 && (
            <Dashboard
              weather={weather}
              cityName={cityName}
              country={country}
              timezone={weather.timezone}
              tempUnit={tempUnit}
              windUnit={windUnit}
            />
          )}

          {!isLoading && weather && activeTab === 1 && (
            <ForecastPage
              data={weather.daily}
              hourly={weather.hourly}
              timezone={weather.timezone}
              tempUnit={tempUnit}
              windUnit={windUnit}
            />
          )}

          {activeTab === 3 && (
            <SettingsScreen
              tempUnit={tempUnit}
              windUnit={windUnit}
              onTempUnit={handleTempUnit}
              onWindUnit={handleWindUnit}
            />
          )}

        </div>
      )}

      <TabBar active={activeTab} onChange={setActiveTab} />
    </div>
  );
}
