import type { DailyWeatherData, HourlyWeatherData, TempUnit, WindUnit } from '../types/weather';
import { getWeatherInfo } from '../components/WeatherIcon';
import { getMatIcon } from '../lib/weatherCodes';

const DAYS_DE: Record<string, string> = {
  Monday: 'Montag', Tuesday: 'Dienstag', Wednesday: 'Mittwoch',
  Thursday: 'Donnerstag', Friday: 'Freitag', Saturday: 'Samstag', Sunday: 'Sonntag',
};

interface Props {
  dayIndex: number;
  daily: DailyWeatherData;
  hourly: HourlyWeatherData;
  timezone: string;
  tempUnit: TempUnit;
  windUnit: WindUnit;
  onClose: () => void;
}

function getDayLabel(dateStr: string, timezone: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  const eng = date.toLocaleDateString('en-US', { timeZone: timezone, weekday: 'long' });
  return DAYS_DE[eng] ?? eng;
}

function getFullDate(dateStr: string, timezone: string): string {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('de-DE', {
    timeZone: timezone, day: 'numeric', month: 'long',
  });
}

function uvLabel(uv: number): string {
  if (uv <= 2) return 'Niedrig';
  if (uv <= 5) return 'Mittel';
  if (uv <= 7) return 'Hoch';
  if (uv <= 10) return 'Sehr hoch';
  return 'Extrem';
}

export default function DayDetailScreen({ dayIndex, daily, hourly, timezone, tempUnit, windUnit, onClose }: Props) {
  const startIdx = dayIndex * 24;
  const hourCount = Math.min(24, hourly.time.length - startIdx);
  const indices = Array.from({ length: hourCount }, (_, h) => startIdx + h);

  const dateStr = daily.time[dayIndex] ?? '';
  const dayLabel = dayIndex === 0 ? 'Heute' : dayIndex === 1 ? 'Morgen' : getDayLabel(dateStr, timezone);
  const fullDate = getFullDate(dateStr, timezone);
  const code = daily.weather_code[dayIndex] ?? 0;
  const info = getWeatherInfo(code);
  const { icon, color } = getMatIcon(code);
  const max = Math.round(daily.temperature_2m_max[dayIndex] ?? 0);
  const min = Math.round(daily.temperature_2m_min[dayIndex] ?? 0);
  const tempSuffix = tempUnit === 'fahrenheit' ? '°F' : '°C';
  const windSuffix = windUnit === 'mph' ? 'mph' : 'km/h';

  const uvMax = Math.round(Math.max(0, ...indices.map(i => hourly.uv_index[i] ?? 0)));
  const windMax = Math.round(Math.max(0, ...indices.map(i => hourly.windspeed_10m[i] ?? 0)));
  const pressureAvg = Math.round(indices.reduce((s, i) => s + (hourly.surface_pressure[i] ?? 0), 0) / hourCount);
  const visibilityAvg = Math.round(
    Math.min(24, indices.reduce((s, i) => s + (hourly.visibility[i] ?? 0) / 1000, 0) / hourCount)
  );

  const glassCard: React.CSSProperties = {
    background: 'rgba(255,255,255,0.5)',
    borderRadius: 16,
    border: '1px solid rgba(255,255,255,0.6)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${dayLabel} Detailansicht`}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(212,227,255,0.97)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        overflowY: 'auto',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 32px)',
        animation: 'slide-up 0.32s cubic-bezier(0.32,0.72,0,1)',
      }}
    >
      {/* Handle + close */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 4 }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.15)' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '4px 16px 8px' }}>
        <button
          onClick={onClose}
          aria-label="Schließen"
          style={{ width: 32, height: 32, borderRadius: 16, background: 'rgba(0,0,0,0.07)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#717783' }}>close</span>
        </button>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, paddingTop: 8 }}>
          <span className="material-symbols-outlined mat-fill" style={{ fontSize: 60, color }}>{icon}</span>
          <p style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 700, color: '#0b1c30', letterSpacing: '-0.02em', marginTop: 4 }}>{dayLabel}</p>
          <p style={{ fontFamily: 'Inter', fontSize: 14, color: '#717783' }}>{fullDate}</p>
          <p style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 500, color: '#0b1c30', marginTop: 4 }}>{info.description}</p>
          <p style={{ fontFamily: 'Inter', fontSize: 15, color: '#717783', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
            <span style={{ color: '#0060ac', fontWeight: 600 }}>{max}{tempSuffix}</span>
            {' / '}{min}{tempSuffix}
          </p>
        </div>

        {/* Hourly strip */}
        <div>
          <p style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#717783', marginBottom: 8, paddingLeft: 4 }}>
            Stündlich
          </p>
          <div style={{ ...glassCard, padding: '12px 8px' }}>
            <div className="hide-scrollbar" style={{ display: 'flex', overflowX: 'auto', gap: 4 }}>
              {indices.map((idx, h) => {
                const timeLabel = (hourly.time[idx] ?? '').slice(11, 16);
                const temp = Math.round(hourly.temperature_2m[idx] ?? 0);
                const hCode = hourly.weather_code[idx] ?? 0;
                const precipMm   = hourly.precipitation[idx] ?? 0;
                const precipProb = hourly.precipitation_probability[idx] ?? 0;
                const { icon: hIcon, color: hColor } = getMatIcon(hCode);
                return (
                  <div key={idx} style={{ minWidth: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 10px', gap: 4 }}>
                    <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#717783' }}>{h === 0 ? '00:00' : timeLabel}</span>
                    <span className="material-symbols-outlined mat-fill" style={{ fontSize: 20, color: hColor }}>{hIcon}</span>
                    <span style={{ fontFamily: 'Inter', fontSize: 15, fontWeight: 600, color: '#0b1c30', fontVariantNumeric: 'tabular-nums' }}>{temp}°</span>
                    {precipMm > 0.05 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                        <span style={{ fontFamily: 'Inter', fontSize: 11, color: '#3b82f6', fontVariantNumeric: 'tabular-nums' }}>
                          {precipMm.toFixed(1)}mm
                        </span>
                        {precipProb > 0 && (
                          <span style={{ fontFamily: 'Inter', fontSize: 10, color: '#3b82f6', fontVariantNumeric: 'tabular-nums', opacity: 0.75 }}>
                            {precipProb}%
                          </span>
                        )}
                      </div>
                    ) : precipProb > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />
                        <span style={{ fontFamily: 'Inter', fontSize: 11, color: '#3b82f6', fontVariantNumeric: 'tabular-nums' }}>{precipProb}%</span>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div>
          <p style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#717783', marginBottom: 8, paddingLeft: 4 }}>
            Details
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

            <div style={{ ...glassCard, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#f59e0b' }}>wb_sunny</span>
                <span style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#717783' }}>UV-Index</span>
              </div>
              <p style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 500, color: '#0b1c30', fontVariantNumeric: 'tabular-nums' }}>{uvMax}</p>
              <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#717783', marginTop: 4 }}>{uvLabel(uvMax)}</p>
            </div>

            <div style={{ ...glassCard, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#0060ac' }}>air</span>
                <span style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#717783' }}>Wind max.</span>
              </div>
              <p style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 500, color: '#0b1c30', fontVariantNumeric: 'tabular-nums' }}>{windMax}</p>
              <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#717783', marginTop: 4 }}>{windSuffix}</p>
            </div>

            <div style={{ ...glassCard, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#6366f1' }}>speed</span>
                <span style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#717783' }}>Luftdruck</span>
              </div>
              <p style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 500, color: '#0b1c30', fontVariantNumeric: 'tabular-nums' }}>{pressureAvg}</p>
              <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#717783', marginTop: 4 }}>hPa</p>
            </div>

            <div style={{ ...glassCard, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#10b981' }}>visibility</span>
                <span style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#717783' }}>Sichtweite</span>
              </div>
              <p style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 500, color: '#0b1c30', fontVariantNumeric: 'tabular-nums' }}>{visibilityAvg}</p>
              <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#717783', marginTop: 4 }}>km</p>
            </div>

            <div style={{ ...glassCard, padding: 16, gridColumn: '1 / -1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span className="material-symbols-outlined mat-fill" style={{ fontSize: 18, color: '#3b82f6' }}>water_drop</span>
                <span style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#717783' }}>Niederschlag</span>
              </div>
              <p style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 500, color: '#0b1c30', fontVariantNumeric: 'tabular-nums' }}>
                {(daily.precipitation_sum[dayIndex] ?? 0).toFixed(1)} mm
              </p>
              <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#717783', marginTop: 4 }}>Tagessumme</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
