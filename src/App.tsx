import { useState, useEffect, useCallback } from 'react';
import { SearchBar } from './components/SearchBar';
import { SplashScreen } from './components/SplashScreen';
import { TabBar } from './components/TabBar';
import WeatherAnimation from './components/WeatherAnimation';
import Dashboard from './pages/Dashboard';
import ForecastPage from './pages/ForecastPage';
import RadarScreen from './pages/RadarScreen';
import SettingsScreen from './pages/SettingsScreen';
import { fetchWeather, searchCities, fetchAlerts } from './api/weather';
import type { WeatherResponse, GeoLocation, TempUnit, WindUnit, Favorite, WeatherAlert } from './types/weather';
import { getWeatherBackground, DEFAULT_THEME } from './lib/weatherTheme';
import './App.css';

const DEFAULT_LAT = 53.5753;
const DEFAULT_LON = 10.0153;
const DEFAULT_CITY = 'Hamburg';
const DEFAULT_COUNTRY = 'Deutschland';

function loadPref<T extends string>(key: string, fallback: T): T {
  return (localStorage.getItem(key) as T | null) ?? fallback;
}

function loadLastLocation() {
  try {
    const raw = localStorage.getItem('lastLocation');
    if (!raw) return null;
    const loc = JSON.parse(raw) as Partial<Favorite>;
    if (loc.lat && loc.lon && loc.city) return loc as Favorite;
  } catch {}
  return null;
}

function loadFavorites(): Favorite[] {
  try { return JSON.parse(localStorage.getItem('favorites') ?? '[]'); }
  catch { return []; }
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
  const [favorites, setFavorites] = useState<Favorite[]>(loadFavorites);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadWeather = useCallback(async (lat: number, lon: number, city: string, countryName: string, tu: TempUnit, wu: WindUnit) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(lat, lon, tu, wu);
      setWeather(data);
      setLastUpdated(new Date());
      setCityName(city);
      setCountry(countryName);
      setCoords({ lat, lon });
      localStorage.setItem('lastLocation', JSON.stringify({ lat, lon, city, country: countryName }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fehler beim Laden der Wetterdaten');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const last = loadLastLocation();
    const loc = last ?? { lat: DEFAULT_LAT, lon: DEFAULT_LON, city: DEFAULT_CITY, country: DEFAULT_COUNTRY };
    loadWeather(loc.lat, loc.lon, loc.city, loc.country, tempUnit, windUnit);
  }, [loadWeather]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch DWD weather alerts via Bright Sky whenever location changes, refresh every 15 min
  useEffect(() => {
    fetchAlerts(coords.lat, coords.lon).then(setAlerts);
    const id = setInterval(() => fetchAlerts(coords.lat, coords.lon).then(setAlerts), 15 * 60 * 1000);
    return () => clearInterval(id);
  }, [coords.lat, coords.lon]);

  function handleSelect(loc: GeoLocation) {
    loadWeather(loc.latitude, loc.longitude, loc.name, loc.country, tempUnit, windUnit);
  }

  function handleSelectFavorite(fav: Favorite) {
    loadWeather(fav.lat, fav.lon, fav.city, fav.country, tempUnit, windUnit);
  }

  function handleRemoveFavorite(fav: Favorite) {
    const next = favorites.filter(f => !(f.lat === fav.lat && f.lon === fav.lon));
    localStorage.setItem('favorites', JSON.stringify(next));
    setFavorites(next);
  }

  function toggleFavorite() {
    const isFav = favorites.some(f => f.lat === coords.lat && f.lon === coords.lon);
    const next = isFav
      ? favorites.filter(f => !(f.lat === coords.lat && f.lon === coords.lon))
      : [...favorites, { lat: coords.lat, lon: coords.lon, city: cityName, country }];
    localStorage.setItem('favorites', JSON.stringify(next));
    setFavorites(next);
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

  const theme = weather
    ? getWeatherBackground(
        weather.current.weather_code,
        weather.daily.sunrise?.[0],
        weather.daily.sunset?.[0],
        weather.utc_offset_seconds,
      )
    : DEFAULT_THEME;

  const isFavorite = favorites.some(f => f.lat === coords.lat && f.lon === coords.lon);

  if (showSplash) {
    return <SplashScreen onDone={() => setShowSplash(false)} />;
  }

  const isRadar = activeTab === 2;

  return (
    <div style={{ minHeight: '100dvh', paddingTop: 'env(safe-area-inset-top)', paddingBottom: 60, position: 'relative', background: theme.background, transition: 'background 2s ease' }}>

      {/* Weather particle animation */}
      {weather && (
        <WeatherAnimation code={weather.current.weather_code} isNight={theme.isNight} />
      )}

      {/* Radar screen renders outside the padded flow */}
      {isRadar && <RadarScreen lat={coords.lat} lon={coords.lon} />}

      {/* Favourite star button — left side, tabs 0+1 */}
      {activeTab <= 1 && (
        <div style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top) + 12px)', left: 16, zIndex: 10 }}>
          <button
            onClick={toggleFavorite}
            aria-label={isFavorite ? 'Aus Favoriten entfernen' : 'Als Favorit speichern'}
            style={{
              width: 44, height: 44, borderRadius: 22, border: 'none',
              background: theme.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <span
              className={`material-symbols-outlined${isFavorite ? ' mat-fill' : ''}`}
              style={{ fontSize: 20, color: isFavorite ? '#f59e0b' : (theme.isDark ? 'rgba(255,255,255,0.9)' : '#414751') }}
            >
              star
            </span>
          </button>
        </div>
      )}

      {/* Search bar — hidden on Radar and Settings tabs */}
      {activeTab <= 1 && (
        <div style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top) + 12px)', right: 16, zIndex: 10 }}>
          <SearchBar
            onSelect={handleSelect}
            onGPS={handleGPS}
            isLoadingGPS={isLoadingGPS}
            favorites={favorites}
            onSelectFavorite={handleSelectFavorite}
            onRemoveFavorite={handleRemoveFavorite}
            isDark={theme.isDark}
          />
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
                onClick={() => { setError(null); loadWeather(coords.lat, coords.lon, cityName, country, tempUnit, windUnit); }}
                aria-label="Erneut versuchen"
                style={{
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                  padding: '5px 10px', background: '#ba1a1a', border: 'none', borderRadius: 6,
                  color: '#fff', fontFamily: 'Inter', fontSize: 12, fontWeight: 600, flexShrink: 0,
                  minHeight: 32,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>refresh</span>
                Retry
              </button>
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
              lat={coords.lat}
              lon={coords.lon}
              alerts={alerts}
              isDark={theme.isDark}
              lastUpdated={lastUpdated}
              onNavigateToRadar={() => setActiveTab(2)}
            />
          )}

          {!isLoading && weather && activeTab === 1 && (
            <ForecastPage
              data={weather.daily}
              hourly={weather.hourly}
              timezone={weather.timezone}
              tempUnit={tempUnit}
              windUnit={windUnit}
              isDark={theme.isDark}
              cityName={cityName}
              country={country}
            />
          )}

          {activeTab === 3 && (
            <SettingsScreen
              tempUnit={tempUnit}
              windUnit={windUnit}
              onTempUnit={handleTempUnit}
              onWindUnit={handleWindUnit}
              isDark={theme.isDark}
            />
          )}

        </div>
      )}

      <TabBar active={activeTab} onChange={setActiveTab} />
    </div>
  );
}
