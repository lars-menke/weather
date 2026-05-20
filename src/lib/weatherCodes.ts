export function getMatIcon(code: number): { icon: string; color: string } {
  if (code === 0 || code === 1) return { icon: 'sunny',             color: '#f59e0b' };
  if (code === 2)                return { icon: 'partly_cloudy_day', color: '#f59e0b' };
  if (code === 3)                return { icon: 'cloud',             color: '#60a5fa' };
  if (code === 45 || code === 48)return { icon: 'foggy',             color: '#94a3b8' };
  if (code >= 51 && code <= 55)  return { icon: 'grain',             color: '#60a5fa' };
  if (code >= 61 && code <= 65)  return { icon: 'rainy',             color: '#3b82f6' };
  if (code >= 71 && code <= 75)  return { icon: 'ac_unit',           color: '#93c5fd' };
  if (code >= 80 && code <= 82)  return { icon: 'rainy',             color: '#3b82f6' };
  if (code === 85 || code === 86)return { icon: 'weather_snowy',     color: '#93c5fd' };
  if (code >= 95)                return { icon: 'thunderstorm',      color: '#6366f1' };
  return                                { icon: 'cloud',             color: '#60a5fa' };
}
