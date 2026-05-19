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
  const timeStr = now.toLocaleTimeString('de-DE', { timeZone: timezone, hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('de-DE', { timeZone: timezone, weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="w-full flex flex-col items-center gap-8">

      {/* Hero temperature */}
      <section className="flex flex-col items-center text-center pt-2 animate-fade-in">
        <div className="relative flex items-start leading-none">
          <span
            className="text-[96px] font-['Outfit'] font-light leading-none tracking-tight"
            style={{ color: '#0060ac', letterSpacing: '-0.04em' }}
          >
            {Math.round(data.temperature_2m)}
          </span>
          <span
            className="text-[40px] font-['Outfit'] font-light mt-3 ml-0.5"
            style={{ color: '#0060ac' }}
          >
            °
          </span>
        </div>
        <p
          className="text-2xl font-['Outfit'] font-medium mt-1"
          style={{ color: '#0b1c30' }}
        >
          {info.description}
        </p>
        <p className="text-sm font-['Inter'] mt-1.5 uppercase tracking-widest" style={{ color: '#414751', opacity: 0.7 }}>
          {cityName}{country ? `, ${country}` : ''} · {timeStr}
        </p>
        <p className="text-xs mt-1" style={{ color: '#414751', opacity: 0.55 }}>
          {dateStr}
        </p>
      </section>

      {/* Details strip */}
      <section className="w-full glass-card rounded-xl p-5">
        <div className="flex justify-around items-center gap-2">
          <DetailItem
            icon="air"
            label="Wind"
            value={`${Math.round(data.windspeed_10m)} km/h`}
          />
          <div className="w-px h-10 bg-white/40" />
          <DetailItem
            icon="humidity_percentage"
            label="Luftfeuchte"
            value={`${data.relativehumidity_2m}%`}
          />
          <div className="w-px h-10 bg-white/40" />
          <DetailItem
            icon="device_thermostat"
            label="Gefühlt"
            value={`${Math.round(data.apparent_temperature)}°`}
          />
        </div>
      </section>
    </div>
  );
}

function DetailItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <span className="material-symbols-outlined" style={{ color: 'rgba(0,96,172,0.75)' }}>{icon}</span>
      <span className="text-[11px] font-['Inter'] font-semibold uppercase tracking-wider" style={{ color: '#414751', opacity: 0.65 }}>
        {label}
      </span>
      <span className="text-base font-['Inter'] font-semibold" style={{ color: '#0b1c30' }}>
        {value}
      </span>
    </div>
  );
}
