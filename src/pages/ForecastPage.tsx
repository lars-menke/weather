import type { DailyWeatherData } from '../types/weather';
import { getWeatherInfo } from '../components/WeatherIcon';

interface ForecastPageProps {
  data: DailyWeatherData;
  timezone: string;
}

const DAYS_DE: Record<string, string> = {
  Monday: 'Montag', Tuesday: 'Dienstag', Wednesday: 'Mittwoch',
  Thursday: 'Donnerstag', Friday: 'Freitag', Saturday: 'Samstag', Sunday: 'Sonntag',
};

function getDayLabel(dateStr: string, index: number, timezone: string): string {
  if (index === 0) return 'Heute';
  if (index === 1) return 'Morgen';
  const date = new Date(dateStr + 'T12:00:00');
  const eng = date.toLocaleDateString('en-US', { timeZone: timezone, weekday: 'long' });
  return DAYS_DE[eng] ?? eng;
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

export default function ForecastPage({ data, timezone }: ForecastPageProps) {
  const globalMax = Math.max(...data.temperature_2m_max);
  const globalMin = Math.min(...data.temperature_2m_min);
  const range = globalMax - globalMin || 1;

  const glassCard: React.CSSProperties = {
    background: 'rgba(255,255,255,0.5)',
    borderRadius: 16,
    border: '1px solid rgba(255,255,255,0.6)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    padding: 16,
    marginBottom: 10,
  };

  return (
    <div className="animate-fade-in">
      <p style={{
        fontFamily: 'Outfit', fontSize: 20, fontWeight: 500,
        color: '#0b1c30', padding: '0 0 12px 0',
      }}>
        7-Tage-Vorhersage
      </p>

      {data.time.map((dateStr, i) => {
        const dayLabel = getDayLabel(dateStr, i, timezone);
        const max = Math.round(data.temperature_2m_max[i]);
        const min = Math.round(data.temperature_2m_min[i]);
        const code = data.weather_code[i];
        const precip = data.precipitation_sum[i];
        const { icon, color } = getMatIcon(code);
        const info = getWeatherInfo(code);

        const barLeft = ((min - globalMin) / range) * 100;
        const barWidth = Math.max(((max - min) / range) * 100, 6);

        return (
          <div key={dateStr} style={glassCard}>
            {/* Row 1: day + icon + temps */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontFamily: 'Outfit', fontSize: 17, fontWeight: 500, color: '#0b1c30', flex: 1 }}>
                {dayLabel}
              </span>
              <span className="material-symbols-outlined mat-fill" style={{ fontSize: 22, color }}>
                {icon}
              </span>
              <span style={{ fontFamily: 'Outfit', fontSize: 32, fontWeight: 300, color: '#0060ac', lineHeight: 1 }}>
                {max}°
              </span>
              <span style={{ fontFamily: 'Inter', fontSize: 15, color: '#717783' }}>
                / {min}°
              </span>
            </div>

            {/* Row 2: condition + precipitation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontFamily: 'Inter', fontSize: 13, color: '#717783', flex: 1 }}>
                {info.description}
              </span>
              {precip > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className="material-symbols-outlined mat-fill" style={{ fontSize: 14, color: '#3b82f6' }}>water_drop</span>
                  <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#3b82f6' }}>{precip.toFixed(1)} mm</span>
                </div>
              )}
            </div>

            {/* Temp bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#717783', width: 28, textAlign: 'right', flexShrink: 0 }}>
                {min}°
              </span>
              <div style={{ flex: 1, height: 4, borderRadius: 9999, background: 'rgba(0,0,0,0.08)', position: 'relative' }}>
                <div style={{
                  position: 'absolute', top: 0, height: '100%', borderRadius: 9999,
                  left: `${barLeft}%`, width: `${barWidth}%`,
                  background: 'linear-gradient(to right, #93c5fd, #0060ac)',
                }} />
              </div>
              <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: '#0b1c30', width: 28, flexShrink: 0 }}>
                {max}°
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
