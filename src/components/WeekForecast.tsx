import type { DailyWeatherData } from '../types/weather';

interface WeekForecastProps {
  data: DailyWeatherData;
  timezone: string;
}

const DAYS_DE: Record<string, string> = {
  Monday: 'Mo', Tuesday: 'Di', Wednesday: 'Mi',
  Thursday: 'Do', Friday: 'Fr', Saturday: 'Sa', Sunday: 'So',
};

function getDayLabel(dateStr: string, index: number, timezone: string): string {
  if (index === 0) return 'Heute';
  if (index === 1) return 'Morgen';
  const date = new Date(dateStr + 'T12:00:00');
  const eng = date.toLocaleDateString('en-US', { timeZone: timezone, weekday: 'long' });
  return DAYS_DE[eng] ?? eng.slice(0, 2);
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

export function WeekForecast({ data, timezone }: WeekForecastProps) {
  const globalMax = Math.max(...data.temperature_2m_max);
  const globalMin = Math.min(...data.temperature_2m_min);
  const range = globalMax - globalMin || 1;

  return (
    <div className="w-full">
      {/* Section label */}
      <p className="text-[11px] font-['Inter'] font-semibold uppercase tracking-widest px-1 mb-2"
         style={{ color: '#717783' }}>
        7-Tage-Vorhersage
      </p>

      {/* Forecast card — subtle, no heavy border */}
      <div style={{
        background: 'rgba(255,255,255,0.5)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.6)',
      }}>
        {data.time.map((dateStr, i) => {
          const dayLabel = getDayLabel(dateStr, i, timezone);
          const max = Math.round(data.temperature_2m_max[i]);
          const min = Math.round(data.temperature_2m_min[i]);
          const code = data.weather_code[i];
          const { icon, color } = getMatIcon(code);
          const barLeft = ((min - globalMin) / range) * 100;
          const barWidth = Math.max(((max - min) / range) * 100, 6);

          return (
            <div
              key={dateStr}
              className="flex items-center"
              style={{
                padding: '11px 16px',
                borderBottom: i < data.time.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
              }}
            >
              {/* Day */}
              <span style={{
                width: 52,
                flexShrink: 0,
                fontSize: 14,
                fontFamily: 'Inter',
                fontWeight: i === 0 ? 600 : 500,
                color: i === 0 ? '#0060ac' : '#0b1c30',
              }}>
                {dayLabel}
              </span>

              {/* Icon */}
              <span
                className="material-symbols-outlined mat-fill"
                style={{ fontSize: 20, color, width: 26, flexShrink: 0 }}
              >
                {icon}
              </span>

              {/* Bar + temps */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 13, fontFamily: 'Inter', color: '#717783', width: 24, textAlign: 'right', flexShrink: 0 }}>
                  {min}°
                </span>
                <div style={{ flex: 1, height: 4, borderRadius: 9999, background: 'rgba(0,0,0,0.08)', position: 'relative', minWidth: 0 }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    height: '100%',
                    borderRadius: 9999,
                    left: `${barLeft}%`,
                    width: `${barWidth}%`,
                    background: 'linear-gradient(to right, #93c5fd, #0060ac)',
                  }} />
                </div>
                <span style={{ fontSize: 13, fontFamily: 'Inter', fontWeight: 600, color: '#0b1c30', width: 24, flexShrink: 0 }}>
                  {max}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
