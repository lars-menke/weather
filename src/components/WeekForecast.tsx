import type { DailyWeatherData } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

interface WeekForecastProps {
  data: DailyWeatherData;
  timezone: string;
}

const DAYS_DE: Record<string, string> = {
  Monday: 'Montag',
  Tuesday: 'Dienstag',
  Wednesday: 'Mittwoch',
  Thursday: 'Donnerstag',
  Friday: 'Freitag',
  Saturday: 'Samstag',
  Sunday: 'Sonntag',
};

function getDayLabel(dateStr: string, index: number, timezone: string): string {
  if (index === 0) return 'Heute';
  if (index === 1) return 'Morgen';
  const date = new Date(dateStr + 'T12:00:00');
  const engDay = date.toLocaleDateString('en-US', { timeZone: timezone, weekday: 'long' });
  return DAYS_DE[engDay] ?? engDay;
}

export function WeekForecast({ data, timezone }: WeekForecastProps) {
  const allMaxTemps = data.temperature_2m_max;
  const allMinTemps = data.temperature_2m_min;
  const globalMax = Math.max(...allMaxTemps);
  const globalMin = Math.min(...allMinTemps);
  const range = globalMax - globalMin || 1;

  return (
    <div className="w-full">
      <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3 px-1">
        7-Tage-Vorhersage
      </p>
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.10)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
        }}
      >
        {data.time.map((dateStr, i) => {
          const dayLabel = getDayLabel(dateStr, i, timezone);
          const max = Math.round(data.temperature_2m_max[i]);
          const min = Math.round(data.temperature_2m_min[i]);
          const code = data.weather_code[i];
          const precip = data.precipitation_sum[i];

          const barLeft = ((min - globalMin) / range) * 100;
          const barWidth = ((max - min) / range) * 100;

          return (
            <div
              key={dateStr}
              className="flex items-center gap-4 px-5 py-4 transition-colors duration-150 hover:bg-white/5"
              style={i < data.time.length - 1 ? { borderBottom: '1px solid rgba(255,255,255,0.08)' } : {}}
            >
              {/* Day label */}
              <div className="w-24 flex-shrink-0">
                <span className={`text-sm font-medium ${i === 0 ? 'text-white' : 'text-white/75'}`}>
                  {dayLabel}
                </span>
              </div>

              {/* Icon + optional precip */}
              <div className="w-12 flex-shrink-0 flex items-center gap-1.5">
                <WeatherIcon code={code} size="sm" />
                {precip > 0.5 && (
                  <span className="text-blue-200/70 text-xs leading-none">{Math.round(precip)}</span>
                )}
              </div>

              {/* Temperature bar */}
              <div className="flex-1 flex items-center gap-3 min-w-0">
                <span className="text-white/45 text-sm tabular-nums w-7 text-right flex-shrink-0">
                  {min}°
                </span>
                <div className="flex-1 relative h-1 rounded-full bg-white/15 min-w-0">
                  <div
                    className="absolute top-0 h-full rounded-full"
                    style={{
                      left: `${barLeft}%`,
                      width: `${Math.max(barWidth, 8)}%`,
                      background: 'linear-gradient(to right, #93c5fd, #fb923c)',
                    }}
                  />
                </div>
                <span className="text-white text-sm font-semibold tabular-nums w-7 flex-shrink-0">
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
