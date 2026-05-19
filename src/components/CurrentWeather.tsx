import type { CurrentWeatherData } from '../types/weather';
import { WeatherIcon, getWeatherInfo } from './WeatherIcon';

interface CurrentWeatherProps {
  data: CurrentWeatherData;
  cityName: string;
  country: string;
  timezone: string;
}

export function CurrentWeather({ data, cityName, country, timezone }: CurrentWeatherProps) {
  const info = getWeatherInfo(data.weathercode);

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
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Location & Time */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg tracking-tight">
          {cityName}
        </h1>
        <p className="text-white/80 text-lg mt-1">{country}</p>
        <p className="text-white/60 text-sm mt-1">{dateStr} · {timeStr}</p>
      </div>

      {/* Weather Icon & Temp */}
      <div className="flex flex-col items-center gap-3">
        <WeatherIcon code={data.weathercode} size="xl" />
        <div className="flex items-start">
          <span className="text-8xl md:text-9xl font-thin text-white drop-shadow-xl leading-none tabular-nums">
            {Math.round(data.temperature_2m)}
          </span>
          <span className="text-4xl text-white/80 mt-4 ml-1">°C</span>
        </div>
        <p className="text-2xl text-white/90 font-light">{info.description}</p>
        <p className="text-white/70 text-base">
          Gefühlt {Math.round(data.apparent_temperature)}°C
        </p>
      </div>

      {/* Stats Row */}
      <div className="flex gap-4 md:gap-8 mt-2 flex-wrap justify-center">
        <StatCard
          icon="💨"
          label="Wind"
          value={`${Math.round(data.windspeed_10m)} km/h`}
        />
        <StatCard
          icon="💧"
          label="Luftfeuchte"
          value={`${data.relativehumidity_2m}%`}
        />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/20">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-white/60 text-xs uppercase tracking-wider">{label}</p>
        <p className="text-white font-semibold text-base">{value}</p>
      </div>
    </div>
  );
}
