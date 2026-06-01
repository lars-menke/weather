import { getWeatherInfo } from '../components/WeatherIcon';
import { getMatIcon } from '../lib/weatherCodes';
import RadarTile from '../components/RadarTile';
import AlertBanner from '../components/AlertBanner';
import WetterfroschWidget from '../components/WetterfroschWidget';
import type { WeatherResponse, TempUnit, WindUnit, WeatherAlert } from '../types/weather';

interface DashboardProps {
  weather: WeatherResponse;
  cityName: string;
  country: string;
  timezone: string;
  tempUnit: TempUnit;
  windUnit: WindUnit;
  lat: number;
  lon: number;
  alerts: WeatherAlert[];
  isDark?: boolean;
  onNavigateToRadar: () => void;
}

function getMatIconLocal(code: number) { return getMatIcon(code); }

function formatLocalTime(isoLocal: string): string {
  return isoLocal.slice(11, 16);
}

function utcMsToLocalHHMM(utcMs: number, utcOffsetSeconds: number): string {
  const d = new Date(utcMs + utcOffsetSeconds * 1000);
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
}

function SunArc({
  sunriseIso, sunsetIso, utcOffsetSeconds, isDark, uvIndex = 0,
}: {
  sunriseIso: string; sunsetIso: string; utcOffsetSeconds: number; isDark: boolean; uvIndex?: number;
}) {
  const toUtcMs = (iso: string) => new Date(iso + 'Z').getTime() - utcOffsetSeconds * 1000;
  const sunriseMs = toUtcMs(sunriseIso);
  const sunsetMs  = toUtcMs(sunsetIso);
  const nowMs = Date.now();
  const t = Math.max(0, Math.min(1, (nowMs - sunriseMs) / (sunsetMs - sunriseMs)));

  const dayMs = sunsetMs - sunriseMs;
  const h = Math.floor(dayMs / 3600000);
  const m = Math.floor((dayMs % 3600000) / 60000);

  const angle = Math.PI * t;
  const sunX = 100 - 90 * Math.cos(angle);
  const sunY = 100 - 90 * Math.sin(angle);
  const isAboveHorizon = nowMs >= sunriseMs && nowMs <= sunsetMs;

  const goldenMornEnd   = utcMsToLocalHHMM(sunriseMs + 3600000,  utcOffsetSeconds);
  const goldenEvenStart = utcMsToLocalHHMM(sunsetMs  - 3600000,  utcOffsetSeconds);

  const labelColor = isDark ? 'rgba(255,255,255,0.6)' : '#717783';
  const primaryColor = isDark ? 'rgba(255,255,255,0.9)' : '#0b1c30';

  return (
    <div>
      {/* Sunrise / Sunset header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <div>
          <p style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: primaryColor, fontVariantNumeric: 'tabular-nums' }}>
            {formatLocalTime(sunriseIso)}
          </p>
          <p style={{ fontFamily: 'Inter', fontSize: 10, color: '#f59e0b', marginTop: 1 }}>
            Goldene Std. bis {goldenMornEnd}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: primaryColor, fontVariantNumeric: 'tabular-nums' }}>
            {formatLocalTime(sunsetIso)}
          </p>
          <p style={{ fontFamily: 'Inter', fontSize: 10, color: '#f97316', marginTop: 1 }}>
            Ab {goldenEvenStart}
          </p>
        </div>
      </div>

      {/* Arc SVG (labels removed — shown in header above) */}
      <svg viewBox="0 0 200 108" style={{ width: '100%', height: 'auto', overflow: 'visible' }} aria-hidden="true">
        <line x1="10" y1="100" x2="190" y2="100" stroke={isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'} strokeWidth="1" />
        <path d="M 10,100 A 90,90 0 0 1 190,100" fill="none" stroke={isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'} strokeWidth="2" strokeLinecap="round" />
        {isAboveHorizon && (
          <path
            d={`M 10,100 A 90,90 0 0 1 ${sunX},${sunY}`}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />
        )}
        <circle cx={sunX} cy={sunY} r="8" fill={isAboveHorizon ? '#f59e0b' : 'rgba(245,158,11,0.3)'} />
      </svg>

      {/* Footer: daylight + UV */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
        <p style={{ fontFamily: 'Inter', fontSize: 11, color: labelColor, fontVariantNumeric: 'tabular-nums' }}>
          {h}h {m}min Tageslicht
        </p>
        {uvIndex > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 13, color: '#f59e0b' }}>wb_sunny</span>
            <p style={{ fontFamily: 'Inter', fontSize: 11, color: labelColor, fontVariantNumeric: 'tabular-nums' }}>
              UV {uvIndex}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard({ weather, cityName, country, timezone, tempUnit, windUnit, lat, lon, alerts, isDark = false, onNavigateToRadar }: DashboardProps) {
  const { current, daily, hourly } = weather;
  const info = getWeatherInfo(current.weather_code);
  const { icon: currentIcon, color: currentColor } = getMatIconLocal(current.weather_code);

  const now = new Date();
  const dateStr = now.toLocaleDateString('de-DE', {
    timeZone: timezone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const nowISO = now.toISOString().slice(0, 13);
  let currentHourIndex = hourly.time.findIndex(t => t.startsWith(nowISO));
  if (currentHourIndex < 0) currentHourIndex = 0;

  const hourlySlice = hourly.time.slice(currentHourIndex, currentHourIndex + 24);

  const todayMax = Math.round(daily.temperature_2m_max[0]);
  const todayMin = Math.round(daily.temperature_2m_min[0]);
  const todayPrecip = daily.precipitation_sum[0];
  const tempSuffix = tempUnit === 'fahrenheit' ? '°F' : '°C';
  const windSuffix = windUnit === 'mph' ? 'mph' : 'km/h';
  const currentUvIndex = Math.round(hourly.uv_index[currentHourIndex] ?? 0);

  const c = isDark
    ? { primary: 'rgba(255,255,255,0.95)', muted: 'rgba(255,255,255,0.6)', accent: '#fff', divider: 'rgba(255,255,255,0.2)' }
    : { primary: '#0b1c30',               muted: '#717783',                accent: '#0060ac', divider: 'rgba(0,0,0,0.12)' };

  const glassCard: React.CSSProperties = {
    background: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.5)',
    borderRadius: 16,
    border: isDark ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(255,255,255,0.6)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Hero */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, paddingTop: 8 }}>
        <p style={{ fontFamily: 'Inter', fontSize: 15, color: c.muted, fontWeight: 500 }}>
          {cityName}{country ? `, ${country}` : ''}
        </p>

        <span
          className={`material-symbols-outlined mat-fill animate-pop-in${currentIcon === 'sunny' ? ' sun-animate' : ''}`}
          style={{ fontSize: 72, color: currentColor, lineHeight: 1, marginTop: 8 }}
        >{currentIcon}</span>

        <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: 4, lineHeight: 1 }}>
          <span style={{ fontFamily: 'Outfit', fontWeight: 300, fontSize: 112, letterSpacing: '-0.04em', color: c.accent, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {Math.round(current.temperature_2m)}
          </span>
          <span style={{ fontFamily: 'Outfit', fontWeight: 300, fontSize: 44, color: c.accent, marginTop: 12 }}>
            {tempSuffix}
          </span>
        </div>

        <p style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 500, color: c.primary, marginTop: 4 }}>
          {info.description}
        </p>
        <p style={{ fontFamily: 'Inter', fontSize: 14, color: c.muted, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
          Gefühlt {Math.round(current.apparent_temperature)}{tempSuffix}
        </p>
        <p style={{ fontFamily: 'Inter', fontSize: 13, color: c.muted, marginTop: 2 }}>
          {dateStr}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: c.accent }}>air</span>
            <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: c.primary, fontVariantNumeric: 'tabular-nums' }}>
              {Math.round(current.windspeed_10m)} {windSuffix}
            </span>
          </div>
          <div style={{ width: 1, height: 28, background: c.divider }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: c.accent }}>humidity_percentage</span>
            <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: c.primary, fontVariantNumeric: 'tabular-nums' }}>
              {current.relativehumidity_2m}%
            </span>
          </div>
        </div>
      </div>

      {/* Warnings */}
      <div>
        <p style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: c.muted, marginBottom: 8, paddingLeft: 4 }}>
          Warnungen
        </p>
        {alerts.length === 0 ? (
          <div style={{ ...glassCard, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="material-symbols-outlined mat-fill" style={{ fontSize: 20, color: '#10b981', flexShrink: 0 }}>check_circle</span>
            <p style={{ fontFamily: 'Inter', fontSize: 14, color: c.muted }}>Keine aktiven Warnungen</p>
          </div>
        ) : (
          <AlertBanner alerts={alerts} isDark={isDark} />
        )}
      </div>

      {/* Hourly strip */}
      <div>
        <p style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: c.muted, marginBottom: 8, paddingLeft: 4 }}>
          Stündlich
        </p>
        <div style={{ ...glassCard, padding: '12px 8px' }}>
          <div className="hide-scrollbar" style={{ display: 'flex', overflowX: 'auto', gap: 4 }}>
            {hourlySlice.map((timeStr, idx) => {
              const absIdx = currentHourIndex + idx;
              const temp = Math.round(hourly.temperature_2m[absIdx]);
              const code = hourly.weather_code[absIdx];
              const precipMm   = hourly.precipitation[absIdx] ?? 0;
              const precipProb = hourly.precipitation_probability[absIdx] ?? 0;
              const { icon, color } = getMatIconLocal(code);
              const hour = new Date(timeStr + ':00').getHours();
              const isNow = idx === 0;
              const label = isNow ? 'Jetzt' : `${String(hour).padStart(2, '0')}:00`;
              return (
                <div key={timeStr} style={{
                  minWidth: 64, display: 'flex', flexDirection: 'column', alignItems: 'center',
                  padding: '12px 10px', gap: 4, borderRadius: 10,
                  background: isNow
                    ? (isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,96,172,0.09)')
                    : 'transparent',
                }}>
                  <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: isNow ? 700 : 400, color: isNow ? c.accent : c.muted }}>{label}</span>
                  <span className="material-symbols-outlined mat-fill" style={{ fontSize: 20, color }}>{icon}</span>
                  <span style={{ fontFamily: 'Inter', fontSize: 15, fontWeight: 600, color: c.primary, fontVariantNumeric: 'tabular-nums' }}>{temp}°</span>
                  {precipMm > 0.05 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                      <span style={{ fontFamily: 'Inter', fontSize: 11, color: '#3b82f6', fontVariantNumeric: 'tabular-nums' }}>{precipMm.toFixed(1)}mm</span>
                      {precipProb > 0 && (
                        <span style={{ fontFamily: 'Inter', fontSize: 10, color: '#3b82f6', fontVariantNumeric: 'tabular-nums', opacity: 0.75 }}>{precipProb}%</span>
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

      {/* Bento grid — Frosch zuerst, dann Sonne */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

        <div style={{ ...glassCard, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: c.accent }}>device_thermostat</span>
            <span style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: c.muted }}>Max / Min</span>
          </div>
          <p style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 500, color: c.primary, fontVariantNumeric: 'tabular-nums' }}>
            {todayMax}° / {todayMin}°
          </p>
          <p style={{ fontFamily: 'Inter', fontSize: 12, color: c.muted, marginTop: 4 }}>Heute</p>
        </div>

        <div style={{ ...glassCard, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: c.accent }}>water_drop</span>
            <span style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: c.muted }}>Niederschlag</span>
          </div>
          <p style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 500, color: c.primary, fontVariantNumeric: 'tabular-nums' }}>
            {todayPrecip.toFixed(1)} mm
          </p>
          <p style={{ fontFamily: 'Inter', fontSize: 12, color: c.muted, marginTop: 4 }}>Heute gesamt</p>
        </div>

        {/* Frosch zuerst */}
        <div className="animate-frog-in">
          <WetterfroschWidget code={current.weather_code} isDark={isDark} />
        </div>

        {/* Sonne danach */}
        {daily.sunrise?.[0] && daily.sunset?.[0] && (
          <div style={{ ...glassCard, padding: 16 }}>
            <SunArc
              sunriseIso={daily.sunrise[0]}
              sunsetIso={daily.sunset[0]}
              utcOffsetSeconds={weather.utc_offset_seconds}
              isDark={isDark}
              uvIndex={currentUvIndex}
            />
          </div>
        )}

      </div>

      {/* Radar tile — ganz unten */}
      <div>
        <p style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: c.muted, marginBottom: 8, paddingLeft: 4 }}>
          Radar
        </p>
        <RadarTile lat={lat} lon={lon} isDark={isDark} onExpand={onNavigateToRadar} />
      </div>
    </div>
  );
}
