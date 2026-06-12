import { useState } from 'react';
import type { DailyWeatherData, HourlyWeatherData, TempUnit, WindUnit } from '../types/weather';
import { getWeatherInfo } from '../components/WeatherIcon';
import { getMatIcon } from '../lib/weatherCodes';
import { makeGlass } from '../lib/glassStyle';
import DayDetailScreen from './DayDetailScreen';

interface ForecastPageProps {
  data: DailyWeatherData;
  hourly: HourlyWeatherData;
  timezone: string;
  tempUnit: TempUnit;
  windUnit: WindUnit;
  isDark?: boolean;
  cityName: string;
  country: string;
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

export default function ForecastPage({ data, hourly, timezone, tempUnit, windUnit, cityName, country }: ForecastPageProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const globalMax = Math.max(...data.temperature_2m_max);
  const globalMin = Math.min(...data.temperature_2m_min);
  const range = globalMax - globalMin || 1;

  const glassCard: React.CSSProperties = {
    ...makeGlass(),
    padding: 16,
    marginBottom: 10,
    cursor: 'pointer',
    transition: 'background 0.15s',
  };

  return (
    <>
      <div className="animate-fade-in">
        <p style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 500, color: 'var(--c-primary)', padding: '0 0 4px 0' }}>
          7-Tage-Vorhersage
        </p>
        <p style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: 'var(--c-muted)', marginBottom: 4 }}>
          {cityName}{country ? `, ${country}` : ''}
        </p>
        <p style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--c-muted)', marginBottom: 16, opacity: 0.7 }}>
          Tippen für Details
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
            <button
              key={dateStr}
              onClick={() => setSelectedDay(i)}
              aria-label={`${dayLabel} Details anzeigen`}
              style={{ ...glassCard, width: '100%', textAlign: 'left', display: 'block' }}
            >
              {/* Row 1: day + icon + temps */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontFamily: 'Outfit', fontSize: 17, fontWeight: 500, color: 'var(--c-primary)', flex: 1 }}>
                  {dayLabel}
                </span>
                <span className="material-symbols-outlined mat-fill" style={{ fontSize: 22, color }}>
                  {icon}
                </span>
                <span style={{ fontFamily: 'Outfit', fontSize: 32, fontWeight: 300, color: 'var(--c-accent)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                  {max}°
                </span>
                <span style={{ fontFamily: 'Inter', fontSize: 15, color: 'var(--c-muted)', fontVariantNumeric: 'tabular-nums' }}>
                  / {min}°
                </span>
              </div>

              {/* Row 2: condition + precipitation */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--c-muted)', flex: 1 }}>
                  {info.description}
                </span>
                {precip > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span className="material-symbols-outlined mat-fill" style={{ fontSize: 14, color: '#3b82f6' }}>water_drop</span>
                    <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#3b82f6', fontVariantNumeric: 'tabular-nums' }}>{precip.toFixed(1)} mm</span>
                  </div>
                )}
              </div>

              {/* Temp bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--c-muted)', width: 28, textAlign: 'right', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
                  {min}°
                </span>
                <div style={{ flex: 1, height: 4, borderRadius: 9999, background: 'var(--c-bar-trk)', position: 'relative' }}>
                  <div style={{
                    position: 'absolute', top: 0, height: '100%', borderRadius: 9999,
                    left: `${barLeft}%`, width: `${barWidth}%`,
                    background: 'var(--c-bar)',
                  }} />
                </div>
                <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: 'var(--c-primary)', width: 28, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
                  {max}°
                </span>
              </div>

              {/* Tap hint */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--c-chevron)' }}>chevron_right</span>
              </div>
            </button>
          );
        })}
      </div>

      {selectedDay !== null && (
        <DayDetailScreen
          dayIndex={selectedDay}
          daily={data}
          hourly={hourly}
          timezone={timezone}
          tempUnit={tempUnit}
          windUnit={windUnit}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </>
  );
}
