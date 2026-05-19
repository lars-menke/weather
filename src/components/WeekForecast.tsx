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
  if (code === 0 || code === 1) return { icon: 'sunny', color: '#f59e0b' };
  if (code === 2) return { icon: 'partly_cloudy_day', color: '#f59e0b' };
  if (code === 3) return { icon: 'cloud', color: '#60a5fa' };
  if (code === 45 || code === 48) return { icon: 'foggy', color: '#94a3b8' };
  if (code >= 51 && code <= 55) return { icon: 'grain', color: '#60a5fa' };
  if (code >= 61 && code <= 65) return { icon: 'rainy', color: '#3b82f6' };
  if (code >= 71 && code <= 75) return { icon: 'ac_unit', color: '#93c5fd' };
  if (code >= 80 && code <= 82) return { icon: 'rainy', color: '#3b82f6' };
  if (code === 85 || code === 86) return { icon: 'weather_snowy', color: '#93c5fd' };
  if (code >= 95) return { icon: 'thunderstorm', color: '#6366f1' };
  return { icon: 'cloud', color: '#60a5fa' };
}

export function WeekForecast({ data, timezone }: WeekForecastProps) {
  const globalMax = Math.max(...data.temperature_2m_max);
  const globalMin = Math.min(...data.temperature_2m_min);
  const range = globalMax - globalMin || 1;

  return (
    <section className="w-full glass-card rounded-xl overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center gap-2 px-5 py-3.5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.35)' }}
      >
        <span className="material-symbols-outlined text-[18px]" style={{ color: '#414751', opacity: 0.65 }}>
          calendar_month
        </span>
        <span
          className="text-[11px] font-['Inter'] font-semibold uppercase tracking-widest"
          style={{ color: '#414751', opacity: 0.65 }}
        >
          7-Tage-Vorhersage
        </span>
      </div>

      {/* Rows */}
      <div className="flex flex-col">
        {data.time.map((dateStr, i) => {
          const dayLabel = getDayLabel(dateStr, i, timezone);
          const max = Math.round(data.temperature_2m_max[i]);
          const min = Math.round(data.temperature_2m_min[i]);
          const code = data.weather_code[i];
          const { icon, color } = getMatIcon(code);
          const barLeft = ((min - globalMin) / range) * 100;
          const barWidth = Math.max(((max - min) / range) * 100, 8);

          return (
            <div
              key={dateStr}
              className="flex items-center px-4 py-3"
              style={i < data.time.length - 1 ? { borderBottom: '1px solid rgba(255,255,255,0.25)' } : {}}
            >
              {/* Day — fixed width, no wrapping */}
              <span
                className="text-sm font-['Inter'] font-medium flex-shrink-0"
                style={{ color: i === 0 ? '#0060ac' : '#0b1c30', width: 52 }}
              >
                {dayLabel}
              </span>

              {/* Icon */}
              <span
                className="material-symbols-outlined mat-fill flex-shrink-0"
                style={{ color, fontSize: '20px', width: 28 }}
              >
                {icon}
              </span>

              {/* Temp bar + values */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span
                  className="text-sm font-['Inter'] tabular-nums text-right flex-shrink-0"
                  style={{ color: '#414751', opacity: 0.6, width: 26 }}
                >
                  {min}°
                </span>
                <div className="relative h-1.5 flex-1 rounded-full min-w-0" style={{ background: 'rgba(0,0,0,0.08)' }}>
                  <div
                    className="absolute top-0 h-full rounded-full"
                    style={{
                      left: `${barLeft}%`,
                      width: `${barWidth}%`,
                      background: 'linear-gradient(to right, #93c5fd, #0060ac)',
                    }}
                  />
                </div>
                <span
                  className="text-sm font-['Inter'] font-semibold tabular-nums flex-shrink-0"
                  style={{ color: '#0b1c30', width: 26 }}
                >
                  {max}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
