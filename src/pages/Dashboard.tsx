import { useState } from 'react';
import { getWeatherInfo } from '../components/WeatherIcon';
import { getMatIcon } from '../lib/weatherCodes';
import { makeGlass } from '../lib/glassStyle';
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
  lastUpdated?: Date | null;
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

function SectionHeader({
  icon, children, badge,
}: {
  icon: string; children: React.ReactNode; badge?: number;
}) {
  const active = (badge ?? 0) > 0;
  const iconColor = active ? '#ef4444' : 'var(--c-muted-2)';
  const textColor = active ? '#ef4444' : 'var(--c-muted)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, paddingLeft: 2 }}>
      <span className="material-symbols-outlined" style={{ fontSize: 16, color: iconColor }}>{icon}</span>
      <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: textColor }}>{children}</span>
      {active && (
        <span className="badge-pop" style={{
          background: '#ef4444', color: '#fff',
          fontSize: 10, fontWeight: 700, fontFamily: 'Inter',
          lineHeight: 1, padding: '2px 6px', borderRadius: 10,
          display: 'inline-block',
        }}>
          {badge}
        </span>
      )}
    </div>
  );
}

function TempSparkline({ temps }: { temps: number[] }) {
  if (temps.length < 2) return null;
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const range = max - min || 1;
  const W = 300, H = 36, padX = 8, padY = 6;
  const pts = temps.map((t, i) => {
    const x = padX + (i / (temps.length - 1)) * (W - padX * 2);
    const y = H - padY - ((t - min) / range) * (H - padY * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height: H, display: 'block', marginBottom: 2 }}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polyline
        points={pts}
        fill="none"
        style={{ stroke: 'var(--c-bar)', strokeOpacity: 0.4 } as React.CSSProperties}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunArc({
  sunriseIso, sunsetIso, utcOffsetSeconds, isDark, uvIndex = 0,
}: {
  sunriseIso: string; sunsetIso: string; utcOffsetSeconds: number; isDark: boolean; uvIndex?: number;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

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

  const goldenMornEnd   = utcMsToLocalHHMM(sunriseMs + 3600000, utcOffsetSeconds);
  const goldenEvenStart = utcMsToLocalHHMM(sunsetMs  - 3600000, utcOffsetSeconds);
  const nowTimeStr      = utcMsToLocalHHMM(nowMs, utcOffsetSeconds);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <div>
          <p style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: 'var(--c-primary)', fontVariantNumeric: 'tabular-nums' }}>
            {formatLocalTime(sunriseIso)}
          </p>
          <p style={{ fontFamily: 'Inter', fontSize: 10, color: '#f59e0b', marginTop: 1 }}>
            Goldene Std. bis {goldenMornEnd}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: 'var(--c-primary)', fontVariantNumeric: 'tabular-nums' }}>
            {formatLocalTime(sunsetIso)}
          </p>
          <p style={{ fontFamily: 'Inter', fontSize: 10, color: '#f97316', marginTop: 1 }}>
            Ab {goldenEvenStart}
          </p>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', minHeight: 60 }}>
        <svg
          viewBox="0 0 200 108"
          style={{ width: '100%', height: 'auto', overflow: 'visible' }}
          role="img"
          aria-labelledby="sun-arc-title"
        >
          <title id="sun-arc-title">
            Sonnenverlauf: Aufgang {formatLocalTime(sunriseIso)}, Untergang {formatLocalTime(sunsetIso)}
          </title>
          <line x1="10" y1="100" x2="190" y2="100" stroke={isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'} strokeWidth="1" />
          <path
            d="M 10,100 A 90,90 0 0 1 190,100"
            fill="none"
            stroke={isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="283"
            style={{ animation: 'arc-draw 0.5s 0.05s cubic-bezier(0.16, 1, 0.3, 1) both' }}
          />
          {isAboveHorizon && (
            <path
              d={`M 10,100 A 90,90 0 0 1 ${sunX},${sunY}`}
              fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"
              style={{ animation: 'fade-in 0.25s 0.4s ease-out both' }}
              opacity="0.6"
            />
          )}
          <circle
            cx={sunX} cy={sunY} r="9"
            fill={isAboveHorizon ? '#f59e0b' : 'rgba(245,158,11,0.3)'}
            style={{
              cursor: isAboveHorizon ? 'pointer' : 'default',
              animation: 'sun-dot-pop 0.3s 0.45s cubic-bezier(0.16, 1, 0.3, 1) both',
              transformOrigin: `${sunX}px ${sunY}px`,
            }}
            onClick={isAboveHorizon ? () => setShowTooltip(s => !s) : undefined}
            role={isAboveHorizon ? 'button' : undefined}
            aria-label={isAboveHorizon ? `Aktuelle Zeit: ${nowTimeStr} Uhr` : undefined}
            tabIndex={isAboveHorizon ? 0 : undefined}
          />
          {showTooltip && isAboveHorizon && (
            <g>
              <rect
                x={Math.max(2, sunX - 32)} y={sunY - 32}
                width={64} height={22} rx={5}
                fill="rgba(15,25,50,0.85)"
              />
              <text
                x={Math.min(196, Math.max(34, sunX))}
                y={sunY - 16}
                textAnchor="middle"
                fill="#fff"
                fontSize="10"
                fontFamily="Inter"
              >
                {nowTimeStr} Uhr
              </text>
            </g>
          )}
        </svg>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
        <p style={{ fontFamily: 'Inter', fontSize: 11, color: 'var(--c-muted)', fontVariantNumeric: 'tabular-nums' }}>
          {h}h {m}min Tageslicht
        </p>
        {uvIndex > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 13, color: '#f59e0b' }}>wb_sunny</span>
            <p style={{ fontFamily: 'Inter', fontSize: 11, color: 'var(--c-muted)', fontVariantNumeric: 'tabular-nums' }}>UV {uvIndex}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard({
  weather, cityName, country, timezone, tempUnit, windUnit,
  lat, lon, alerts, isDark = false, lastUpdated, onNavigateToRadar,
}: DashboardProps) {
  const { current, daily, hourly } = weather;
  const info = getWeatherInfo(current.weather_code);
  const { icon: currentIcon, color: currentColor } = getMatIconLocal(current.weather_code);

  const now = new Date();
  const dateStr = now.toLocaleDateString('de-DE', {
    timeZone: timezone, weekday: 'long', day: 'numeric', month: 'long',
  });

  const nowISO = now.toISOString().slice(0, 13);
  let currentHourIndex = hourly.time.findIndex(t => t.startsWith(nowISO));
  if (currentHourIndex < 0) currentHourIndex = 0;

  const hourlySlice = hourly.time.slice(currentHourIndex, currentHourIndex + 24);
  const sparklineTemps = hourlySlice.map((_, idx) => Math.round(hourly.temperature_2m[currentHourIndex + idx]));

  const todayMax   = Math.round(daily.temperature_2m_max[0]);
  const todayMin   = Math.round(daily.temperature_2m_min[0]);
  const todayPrecip = daily.precipitation_sum[0];
  const tempSuffix  = tempUnit === 'fahrenheit' ? '°F' : '°C';
  const windSuffix  = windUnit === 'mph' ? 'mph' : 'km/h';
  const currentUvIndex = Math.round(hourly.uv_index[currentHourIndex] ?? 0);

  const glassCard = makeGlass();

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Hero */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, paddingTop: 8 }}>
        <p style={{ fontFamily: 'Inter', fontSize: 15, color: 'var(--c-muted)', fontWeight: 500 }}>
          {cityName}{country ? `, ${country}` : ''}
        </p>

        <span
          className={`material-symbols-outlined mat-fill animate-pop-in${currentIcon === 'sunny' ? ' sun-animate' : ''}`}
          style={{ fontSize: 72, color: currentColor, lineHeight: 1, marginTop: 8 }}
        >{currentIcon}</span>

        <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: 4, lineHeight: 1 }}>
          <span style={{ fontFamily: 'Outfit', fontWeight: 300, fontSize: 112, letterSpacing: '-0.04em', color: 'var(--c-accent)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {Math.round(current.temperature_2m)}
          </span>
          <span style={{ fontFamily: 'Outfit', fontWeight: 300, fontSize: 44, color: 'var(--c-accent)', marginTop: 12 }}>
            {tempSuffix}
          </span>
        </div>

        <p style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 500, color: 'var(--c-primary)', marginTop: 4 }}>
          {info.description}
        </p>
        <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--c-muted)', marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
          Gefühlt {Math.round(current.apparent_temperature)}{tempSuffix}
        </p>
        <p style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--c-muted)', marginTop: 2 }}>{dateStr}</p>

        {lastUpdated && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 3 }}>
            <span
              key={lastUpdated.getTime()}
              className="material-symbols-outlined sync-spin"
              style={{ fontSize: 12, color: 'var(--c-muted)', opacity: 0.65 }}
            >sync</span>
            <p style={{ fontFamily: 'Inter', fontSize: 11, color: 'var(--c-muted)', opacity: 0.65, fontVariantNumeric: 'tabular-nums' }}>
              {lastUpdated.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr
            </p>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--c-accent)' }}>air</span>
            <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: 'var(--c-primary)', fontVariantNumeric: 'tabular-nums' }}>
              {Math.round(current.windspeed_10m)} {windSuffix}
            </span>
          </div>
          <div style={{ width: 1, height: 28, background: 'var(--c-divider)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--c-accent)' }}>humidity_percentage</span>
            <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: 'var(--c-primary)', fontVariantNumeric: 'tabular-nums' }}>
              {current.relativehumidity_2m}%
            </span>
          </div>
        </div>
      </div>

      {/* Warnungen */}
      <div>
        <SectionHeader
          icon={alerts.length > 0 ? 'warning' : 'notifications'}
          badge={alerts.length || undefined}
        >
          Warnungen
        </SectionHeader>
        {alerts.length === 0 ? (
          <div style={{ ...glassCard, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="material-symbols-outlined mat-fill" style={{ fontSize: 20, color: '#10b981', flexShrink: 0 }}>check_circle</span>
            <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--c-muted)' }}>Keine aktiven Warnungen</p>
          </div>
        ) : (
          <AlertBanner alerts={alerts} isDark={isDark} />
        )}
      </div>

      {/* Stündlich */}
      <div>
        <SectionHeader icon="schedule">Stündlich</SectionHeader>
        <div style={{ ...glassCard, padding: '8px 8px 12px' }}>
          <TempSparkline temps={sparklineTemps} />
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
                  <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: isNow ? 700 : 400, color: isNow ? 'var(--c-accent)' : 'var(--c-muted)' }}>{label}</span>
                  <span className="material-symbols-outlined mat-fill" style={{ fontSize: 20, color }}>{icon}</span>
                  <span style={{ fontFamily: 'Inter', fontSize: 15, fontWeight: 600, color: 'var(--c-primary)', fontVariantNumeric: 'tabular-nums' }}>{temp}°</span>
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

      {/* Bento grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

        <div style={{ ...glassCard, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--c-accent)' }}>device_thermostat</span>
            <span style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--c-muted)' }}>Max / Min</span>
          </div>
          <p style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 500, color: 'var(--c-primary)', fontVariantNumeric: 'tabular-nums' }}>
            {todayMax}° / {todayMin}°
          </p>
          <p style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--c-muted)', marginTop: 4 }}>Heute</p>
        </div>

        <div style={{ ...glassCard, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--c-accent)' }}>water_drop</span>
            <span style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--c-muted)' }}>Niederschlag</span>
          </div>
          <p style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 500, color: 'var(--c-primary)', fontVariantNumeric: 'tabular-nums' }}>
            {todayPrecip.toFixed(1)} mm
          </p>
          <p style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--c-muted)', marginTop: 4 }}>Heute gesamt</p>
        </div>

        <div className="animate-frog-in" style={{ height: '100%' }}>
          <WetterfroschWidget code={current.weather_code} isDark={isDark} />
        </div>

        {daily.sunrise?.[0] && daily.sunset?.[0] && (
          <div style={{ ...glassCard, padding: 16, display: 'flex', flexDirection: 'column' }}>
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

      {/* Radar */}
      <div>
        <SectionHeader icon="radar">Radar</SectionHeader>
        <RadarTile lat={lat} lon={lon} isDark={isDark} onExpand={onNavigateToRadar} />
      </div>

    </div>
  );
}
