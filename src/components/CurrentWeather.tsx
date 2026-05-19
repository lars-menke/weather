import type { CurrentWeatherData } from '../types/weather';
import { WeatherIcon, getWeatherInfo } from './WeatherIcon';

interface CurrentWeatherProps {
  data: CurrentWeatherData;
  cityName: string;
  country: string;
  timezone: string;
}

export function CurrentWeather({ data, cityName, country, timezone }: CurrentWeatherProps) {
  const info = getWeatherInfo(data.weather_code);

  const now = new Date();
  const timeStr = now.toLocaleTimeString('de-DE', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
  });
  const dateStr = now.toLocaleDateString('de-DE', {
    timeZone: timezone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="w-full flex flex-col items-center gap-10 pt-6 pb-4">

      {/* Location */}
      <div className="text-center space-y-1">
        <h1 className="text-5xl md:text-6xl font-semibold text-white tracking-tight"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.2)' }}>
          {cityName}
        </h1>
        <p className="text-white/70 text-base font-light tracking-wide">{country}</p>
        <p className="text-white/50 text-sm">{dateStr} · {timeStr}</p>
      </div>

      {/* Temperature hero */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <span
            className="text-[9rem] md:text-[11rem] font-extralight text-white leading-none tabular-nums select-none"
            style={{ textShadow: '0 4px 40px rgba(0,0,0,0.15)' }}
          >
            {Math.round(data.temperature_2m)}
          </span>
          <span className="absolute top-6 -right-10 text-4xl text-white/70 font-light">°C</span>
        </div>

        <div className="flex items-center gap-3">
          <WeatherIcon code={data.weather_code} size="md" />
          <div>
            <p className="text-white text-xl font-medium leading-tight">{info.description}</p>
            <p className="text-white/60 text-sm">Gefühlt {Math.round(data.apparent_temperature)}°C</p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="w-full grid grid-cols-2 gap-3">
        <MetricCard
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
            </svg>
          }
          label="Wind"
          value={`${Math.round(data.windspeed_10m)}`}
          unit="km/h"
        />
        <MetricCard
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
          }
          label="Luftfeuchte"
          value={`${data.relativehumidity_2m}`}
          unit="%"
        />
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div
      className="rounded-2xl px-5 py-4 flex items-center gap-4"
      style={{
        background: 'rgba(255,255,255,0.10)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.18)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      }}
    >
      <div className="text-white/60 flex-shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-white/50 text-xs uppercase tracking-widest font-medium">{label}</p>
        <p className="text-white font-semibold text-lg leading-tight">
          {value} <span className="text-white/60 font-light text-sm">{unit}</span>
        </p>
      </div>
    </div>
  );
}
