import type { CurrentWeatherData } from '../types/weather';
import { getWeatherInfo } from './WeatherIcon';

interface CurrentWeatherProps {
  data: CurrentWeatherData;
  cityName: string;
  country: string;
  timezone: string;
}

export function CurrentWeather({ data, cityName, country, timezone }: CurrentWeatherProps) {
  const info = getWeatherInfo(data.weather_code);

  const now = new Date();
  const dateStr = now.toLocaleDateString('de-DE', {
    timeZone: timezone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="w-full flex flex-col items-center">

      {/* City */}
      <p className="text-[15px] font-['Inter'] font-medium tracking-wide" style={{ color: '#414751' }}>
        {cityName}{country ? `, ${country}` : ''}
      </p>
      <p className="text-[13px] font-['Inter'] mt-0.5" style={{ color: '#717783' }}>
        {dateStr}
      </p>

      {/* Temperature */}
      <div className="flex items-start mt-2 leading-none">
        <span
          className="font-['Outfit'] font-light"
          style={{ fontSize: 112, letterSpacing: '-0.04em', color: '#0060ac', lineHeight: 1 }}
        >
          {Math.round(data.temperature_2m)}
        </span>
        <span
          className="font-['Outfit'] font-light"
          style={{ fontSize: 44, color: '#0060ac', marginTop: 12 }}
        >
          °
        </span>
      </div>

      {/* Condition */}
      <p className="text-[22px] font-['Outfit'] font-medium mt-1" style={{ color: '#0b1c30' }}>
        {info.description}
      </p>
      <p className="text-[14px] font-['Inter'] mt-1" style={{ color: '#717783' }}>
        Gefühlt {Math.round(data.apparent_temperature)}°
      </p>

      {/* Stats — inline, no card box */}
      <div className="flex items-center gap-5 mt-6">
        <Stat icon="air" value={`${Math.round(data.windspeed_10m)} km/h`} />
        <div className="w-px h-7" style={{ background: 'rgba(0,0,0,0.12)' }} />
        <Stat icon="humidity_percentage" value={`${data.relativehumidity_2m}%`} />
      </div>
    </div>
  );
}

function Stat({ icon, value }: { icon: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#0060ac' }}>{icon}</span>
      <span className="text-[14px] font-['Inter'] font-medium" style={{ color: '#414751' }}>{value}</span>
    </div>
  );
}
