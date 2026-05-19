import type { WeatherInfo } from '../types/weather';

export function getWeatherInfo(code: number): WeatherInfo {
  if (code === 0) {
    return {
      icon: '☀️',
      description: 'Klar',
      gradient: 'from-amber-400 via-orange-400 to-yellow-300',
      bgClass: 'sunny',
    };
  }
  if (code === 1) {
    return {
      icon: '🌤️',
      description: 'Überwiegend klar',
      gradient: 'from-amber-300 via-orange-300 to-sky-400',
      bgClass: 'mostly-sunny',
    };
  }
  if (code === 2) {
    return {
      icon: '⛅',
      description: 'Teilweise bewölkt',
      gradient: 'from-sky-400 via-blue-400 to-slate-400',
      bgClass: 'partly-cloudy',
    };
  }
  if (code === 3) {
    return {
      icon: '🌥️',
      description: 'Bewölkt',
      gradient: 'from-slate-400 via-gray-400 to-zinc-500',
      bgClass: 'cloudy',
    };
  }
  if (code === 45 || code === 48) {
    return {
      icon: '🌫️',
      description: 'Nebel',
      gradient: 'from-gray-400 via-slate-400 to-gray-500',
      bgClass: 'foggy',
    };
  }
  if (code >= 51 && code <= 55) {
    return {
      icon: '🌦️',
      description: 'Nieselregen',
      gradient: 'from-blue-500 via-sky-500 to-slate-500',
      bgClass: 'drizzle',
    };
  }
  if (code >= 61 && code <= 65) {
    return {
      icon: '🌧️',
      description: 'Regen',
      gradient: 'from-blue-700 via-blue-600 to-slate-600',
      bgClass: 'rain',
    };
  }
  if (code >= 71 && code <= 75) {
    return {
      icon: '🌨️',
      description: 'Schnee',
      gradient: 'from-slate-300 via-blue-200 to-indigo-300',
      bgClass: 'snow',
    };
  }
  if (code >= 80 && code <= 82) {
    return {
      icon: '🌦️',
      description: 'Regenschauer',
      gradient: 'from-blue-600 via-sky-600 to-teal-600',
      bgClass: 'showers',
    };
  }
  if (code === 85 || code === 86) {
    return {
      icon: '🌨️',
      description: 'Schneeschauer',
      gradient: 'from-indigo-300 via-blue-300 to-slate-400',
      bgClass: 'snow-showers',
    };
  }
  if (code === 95) {
    return {
      icon: '⛈️',
      description: 'Gewitter',
      gradient: 'from-gray-800 via-slate-700 to-indigo-800',
      bgClass: 'thunder',
    };
  }
  if (code === 96 || code === 99) {
    return {
      icon: '⛈️',
      description: 'Gewitter mit Hagel',
      gradient: 'from-gray-900 via-slate-800 to-purple-900',
      bgClass: 'thunder-hail',
    };
  }
  return {
    icon: '🌡️',
    description: 'Unbekannt',
    gradient: 'from-slate-500 via-gray-500 to-zinc-600',
    bgClass: 'unknown',
  };
}

interface WeatherIconProps {
  code: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function WeatherIcon({ code, size = 'md' }: WeatherIconProps) {
  const { icon } = getWeatherInfo(code);
  const sizeClass = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
    xl: 'text-8xl',
  }[size];

  return (
    <span
      className={`${sizeClass} inline-block select-none`}
      role="img"
      aria-label={getWeatherInfo(code).description}
    >
      {icon}
    </span>
  );
}
