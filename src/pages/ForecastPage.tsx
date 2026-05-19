import { useState } from 'react';
import type { DailyWeatherData, HourlyWeatherData, TempUnit, WindUnit } from '../types/weather';
import { getWeatherInfo } from '../components/WeatherIcon';
import { getMatIcon } from '../lib/weatherCodes';
import DayDetailScreen from './DayDetailScreen';

interface ForecastPageProps {
  data: DailyWeatherData;
  hourly: HourlyWeatherData;
  timezone: string;
  tempUnit: TempUnit;
  windUnit: WindUnit;
  isDark?: boolean;
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

export default function ForecastPage({ data, hourly, timezone, tempUnit, windUnit, isDark = false }: ForecastPageProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const globalMax = Math.max(...data.temperature_2m_max);
  const globalMin = Math.min(...data.temperature_2m_min);
  const range = globalMax - globalMin || 1;

  const titleColor = isDark ? 'rgba(255,255,255,0.95)' : '#0b1c30';
  const mutedColor = isDark ? 'rgba(255,255,255,0.55)' : '#717783';

  const glassCard: React.CSSProperties = {
    background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.5)',
    borderRadius: 16,
    border: isDark ? '1px solid rgba(255,255,255,0.16)' : '1px solid rgba(255,255,255,0.6)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    padding: 16,
    marginBottom: 10,
    cursor: 'pointer',
    transition: 'background 0.15s',
  };

  return (
    <>
      <div className="animate-fade-in">
        <p style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 500, color: titleColor, padding: '0 0 12px 0' }}>
          7-Tage-Vorhersage
        </p>
        <p style={{ fontFamily: 'Inter', fontSize: 13, color: mutedColor, marginBottom: 16 }}>
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
                <span style={{ fontFamily: 'Outfit', fontSize: 17, fontWeight: 500, color: '#0b1c30', flex: 1 }}>
                  {dayLabel}
                </span>
                <span className="material-symbols-outlined mat-fill" style={{ fontSize: 22, color }}>
                  {icon}
                </span>
                <span style={{ fontFamily: 'Outfit', fontSize: 32, fontWeight: 300, color: '#0060ac', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                  {max}°
                </span>
                <span style={{ fontFamily: 'Inter', fontSize: 15, color: '#717783', fontVariantNumeric: 'tabular-nums' }}>
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
                    <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#3b82f6', fontVariantNumeric: 'tabular-nums' }}>{precip.toFixed(1)} mm</span>
                  </div>
                )}
              </div>

              {/* Temp bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#717783', width: 28, textAlign: 'right', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
                  {min}°
                </span>
                <div style={{ flex: 1, height: 4, borderRadius: 9999, background: 'rgba(0,0,0,0.08)', position: 'relative' }}>
                  <div style={{
                    position: 'absolute', top: 0, height: '100%', borderRadius: 9999,
                    left: `${barLeft}%`, width: `${barWidth}%`,
                    background: '#0060ac',
                  }} />
                </div>
                <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: '#0b1c30', width: 28, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
                  {max}°
                </span>
              </div>

              {/* Tap hint */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'rgba(0,96,172,0.4)' }}>chevron_right</span>
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
