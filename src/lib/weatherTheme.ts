export interface WeatherTheme {
  background: string;
  isDark: boolean;
}

function toUtcMs(isoLocal: string, utcOffset: number): number {
  return new Date(isoLocal + 'Z').getTime() - utcOffset * 1000;
}

export function getWeatherBackground(
  code: number,
  sunrise: string | undefined,
  sunset: string | undefined,
  utcOffset: number,
): WeatherTheme {
  const now = Date.now();
  let night = false;
  let golden = false;

  if (sunrise && sunset) {
    const riseMs = toUtcMs(sunrise, utcOffset);
    const setMs  = toUtcMs(sunset,  utcOffset);
    night  = now < riseMs || now > setMs;
    const win = 45 * 60 * 1000;
    golden = !night && (now - riseMs < win || setMs - now < win);
  } else {
    const h = new Date().getHours();
    night  = h < 6 || h >= 21;
    golden = h === 6 || h === 7 || h === 19 || h === 20;
  }

  // Night — overrides all conditions except storm
  if (night && code < 95) {
    if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
      return { background: 'linear-gradient(175deg, #0d1c2e 0%, #1e3045 100%)', isDark: true };
    }
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
      return { background: 'linear-gradient(175deg, #1a2a44 0%, #2e4460 100%)', isDark: true };
    }
    return { background: 'linear-gradient(175deg, #152030 0%, #2a4060 100%)', isDark: true };
  }

  // Thunderstorm
  if (code >= 95) {
    return { background: 'linear-gradient(175deg, #252e38 0%, #3e5060 100%)', isDark: true };
  }

  // Snow
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
    return { background: 'linear-gradient(175deg, #a8cce4 0%, #e4f2fc 100%)', isDark: false };
  }

  // Rain / showers
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
    return { background: 'linear-gradient(175deg, #3e6278 0%, #8aaec4 100%)', isDark: false };
  }

  // Drizzle
  if (code >= 51 && code <= 57) {
    return { background: 'linear-gradient(175deg, #527890 0%, #a4c0d0 100%)', isDark: false };
  }

  // Fog
  if (code === 45 || code === 48) {
    return { background: 'linear-gradient(175deg, #8298a8 0%, #c8d8e2 100%)', isDark: false };
  }

  // Overcast
  if (code === 3) {
    return { background: 'linear-gradient(175deg, #6e8898 0%, #bcccd8 100%)', isDark: false };
  }

  // Partly cloudy
  if (code === 2) {
    if (golden) return { background: 'linear-gradient(175deg, #c87040 0%, #eebc7a 50%, #c8ddf0 100%)', isDark: false };
    return { background: 'linear-gradient(175deg, #5090bc 0%, #c8e0f4 100%)', isDark: false };
  }

  // Clear sky (0 or 1)
  if (golden) return { background: 'linear-gradient(175deg, #d86830 0%, #f5a84e 40%, #d4e3ff 100%)', isDark: false };
  return { background: 'linear-gradient(175deg, #2e9ad4 0%, #d4e3ff 100%)', isDark: false };
}

export const DEFAULT_THEME: WeatherTheme = {
  background: 'linear-gradient(175deg, #2e9ad4 0%, #d4e3ff 100%)',
  isDark: false,
};
