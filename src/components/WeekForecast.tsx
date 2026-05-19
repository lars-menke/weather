import type { DailyWeatherData } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

interface WeekForecastProps {
  data: DailyWeatherData;
  timezone: string;
}

const DAYS_DE: Record<string, string> = {
  Monday: 'Mo',
  Tuesday: 'Di',
  Wednesday: 'Mi',
  Thursday: 'Do',
  Friday: 'Fr',
  Saturday: 'Sa',
  Sunday: 'So',
};

function getDayLabel(dateStr: string, index: number, timezone: string): string {
  if (index === 0) return 'Heute';
  if (index === 1) return 'Morgen';
  const date = new Date(dateStr + 'T12:00:00');
  const engDay = date.toLocaleDateString('en-US', { timeZone: timezone, weekday: 'long' });
  return DAYS_DE[engDay] ?? engDay.slice(0, 2);
}

export function WeekForecast({ data, timezone }: WeekForecastProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-3 px-1">
        7-Tage-Vorhersage
      </h2>
      <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden">
        {data.time.map((dateStr, i) => {
          const dayLabel = getDayLabel(dateStr, i, timezone);
          const max = Math.round(data.temperature_2m_max[i]);
          const min = Math.round(data.temperature_2m_min[i]);
          const code = data.weathercode[i];
          const precip = data.precipitation_sum[i];

          return (
            <div
              key={dateStr}
              className={`flex items-center gap-3 px-5 py-4 transition-colors hover:bg-white/10 ${
                i < data.time.length - 1 ? 'border-b border-white/10' : ''
              }`}
            >
              {/* Day */}
              <div className="w-14 flex-shrink-0">
                <span className={`text-base font-semibold ${i === 0 ? 'text-white' : 'text-white/80'}`}>
                  {dayLabel}
                </span>
              </div>

              {/* Icon */}
              <div className="flex-shrink-0 w-10 text-center">
                <WeatherIcon code={code} size="sm" />
              </div>

              {/* Precipitation bar */}
              <div className="flex-1 flex items-center gap-2 min-w-0">
                {precip > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-blue-200 text-xs">💧</span>
                    <span className="text-blue-200/80 text-xs font-medium whitespace-nowrap">
                      {precip.toFixed(1)} mm
                    </span>
                  </div>
                )}
              </div>

              {/* Temp range */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-white/50 text-sm tabular-nums w-8 text-right">{min}°</span>
                <div className="relative h-1.5 w-16 rounded-full bg-white/20 overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-blue-300 to-orange-300"
                    style={{ width: '100%' }}
                  />
                </div>
                <span className="text-white font-semibold text-sm tabular-nums w-8">{max}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
