import { getWeatherInfo } from '../components/WeatherIcon';
import type { WeatherResponse } from '../types/weather';

interface DashboardProps {
  weather: WeatherResponse;
  cityName: string;
  country: string;
  timezone: string;
}

function getMatIcon(code: number): { icon: string; color: string } {
  if (code === 0 || code === 1) return { icon: 'sunny',             color: '#f59e0b' };
  if (code === 2)                return { icon: 'partly_cloudy_day', color: '#f59e0b' };
  if (code === 3)                return { icon: 'cloud',             color: '#60a5fa' };
  if (code === 45 || code === 48)return { icon: 'foggy',             color: '#94a3b8' };
  if (code >= 51 && code <= 55)  return { icon: 'grain',             color: '#60a5fa' };
  if (code >= 61 && code <= 65)  return { icon: 'rainy',             color: '#3b82f6' };
  if (code >= 71 && code <= 75)  return { icon: 'ac_unit',           color: '#93c5fd' };
  if (code >= 80 && code <= 82)  return { icon: 'rainy',             color: '#3b82f6' };
  if (code === 85 || code === 86)return { icon: 'weather_snowy',     color: '#93c5fd' };
  if (code >= 95)                return { icon: 'thunderstorm',      color: '#6366f1' };
  return                                { icon: 'cloud',             color: '#60a5fa' };
}

export default function Dashboard({ weather, cityName, country, timezone }: DashboardProps) {
  const { current, daily, hourly } = weather;
  const info = getWeatherInfo(current.weather_code);

  const now = new Date();
  const dateStr = now.toLocaleDateString('de-DE', {
    timeZone: timezone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  // Find current hour index in hourly data
  const nowISO = now.toISOString().slice(0, 13); // "2024-01-15T14"
  let currentHourIndex = hourly.time.findIndex(t => t.startsWith(nowISO));
  if (currentHourIndex < 0) currentHourIndex = 0;

  // Show next 24 hours
  const hourlySlice = hourly.time.slice(currentHourIndex, currentHourIndex + 24);

  const todayMax = Math.round(daily.temperature_2m_max[0]);
  const todayMin = Math.round(daily.temperature_2m_min[0]);
  const todayPrecip = daily.precipitation_sum[0];

  const glassCard: React.CSSProperties = {
    background: 'rgba(255,255,255,0.5)',
    borderRadius: 16,
    border: '1px solid rgba(255,255,255,0.6)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Hero section */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, paddingTop: 8 }}>
        <p style={{ fontFamily: 'Inter', fontSize: 15, color: '#414751', fontWeight: 500 }}>
          {cityName}{country ? `, ${country}` : ''}
        </p>

        {/* Temperature */}
        <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: 4, lineHeight: 1 }}>
          <span style={{ fontFamily: 'Outfit', fontWeight: 300, fontSize: 112, letterSpacing: '-0.04em', color: '#0060ac', lineHeight: 1 }}>
            {Math.round(current.temperature_2m)}
          </span>
          <span style={{ fontFamily: 'Outfit', fontWeight: 300, fontSize: 44, color: '#0060ac', marginTop: 12 }}>
            °
          </span>
        </div>

        <p style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 500, color: '#0b1c30', marginTop: 4 }}>
          {info.description}
        </p>
        <p style={{ fontFamily: 'Inter', fontSize: 14, color: '#717783', marginTop: 4 }}>
          Gefühlt {Math.round(current.apparent_temperature)}°
        </p>
        <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#717783', marginTop: 2 }}>
          {dateStr}
        </p>

        {/* Stats row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#0060ac' }}>air</span>
            <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: '#414751' }}>
              {Math.round(current.windspeed_10m)} km/h
            </span>
          </div>
          <div style={{ width: 1, height: 28, background: 'rgba(0,0,0,0.12)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#0060ac' }}>humidity_percentage</span>
            <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: '#414751' }}>
              {current.relativehumidity_2m}%
            </span>
          </div>
        </div>
      </div>

      {/* Hourly forecast strip */}
      <div>
        <p style={{
          fontFamily: 'Inter', fontSize: 11, fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.1em',
          color: '#717783', marginBottom: 8, paddingLeft: 4,
        }}>
          Stündlich
        </p>
        <div style={{ ...glassCard, padding: '12px 8px' }}>
          <div
            className="hide-scrollbar"
            style={{ display: 'flex', overflowX: 'auto', gap: 4 }}
          >
            {hourlySlice.map((timeStr, idx) => {
              const absIdx = currentHourIndex + idx;
              const temp = Math.round(hourly.temperature_2m[absIdx]);
              const code = hourly.weather_code[absIdx];
              const precip = hourly.precipitation_probability[absIdx];
              const { icon, color } = getMatIcon(code);

              const hour = new Date(timeStr + ':00').getHours();
              const label = idx === 0 ? 'Jetzt' : `${String(hour).padStart(2, '0')}:00`;

              return (
                <div
                  key={timeStr}
                  style={{
                    minWidth: 64,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '12px 10px',
                    gap: 4,
                  }}
                >
                  <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#717783' }}>{label}</span>
                  <span className="material-symbols-outlined mat-fill" style={{ fontSize: 20, color }}>{icon}</span>
                  <span style={{ fontFamily: 'Inter', fontSize: 15, fontWeight: 600, color: '#0b1c30' }}>{temp}°</span>
                  {precip > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />
                      <span style={{ fontFamily: 'Inter', fontSize: 11, color: '#3b82f6' }}>{precip}%</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bento grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

        {/* Card: Max/Min Temp */}
        <div style={{ ...glassCard, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#0060ac' }}>device_thermostat</span>
            <span style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#717783' }}>
              Max / Min
            </span>
          </div>
          <p style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 500, color: '#0b1c30' }}>
            {todayMax}° / {todayMin}°
          </p>
          <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#717783', marginTop: 4 }}>
            Heute
          </p>
        </div>

        {/* Card: Precipitation */}
        <div style={{ ...glassCard, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#0060ac' }}>water_drop</span>
            <span style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#717783' }}>
              Niederschlag
            </span>
          </div>
          <p style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 500, color: '#0b1c30' }}>
            {todayPrecip.toFixed(1)} mm
          </p>
          <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#717783', marginTop: 4 }}>
            Heute gesamt
          </p>
        </div>
      </div>
    </div>
  );
}
