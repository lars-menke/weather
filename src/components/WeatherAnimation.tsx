import { useMemo } from 'react';

function s(n: number) {
  const x = Math.sin(n + 1) * 10000;
  return x - Math.floor(x);
}

type AnimType = 'sun' | 'rain' | 'storm' | 'snow' | 'night' | 'none';

function getType(code: number, isNight: boolean): AnimType {
  if (code >= 95) return 'storm';
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
  if (isNight) return 'night';
  if (code <= 1) return 'sun';
  return 'none';
}

interface Props {
  code: number;
  isNight: boolean;
}

export default function WeatherAnimation({ code, isNight }: Props) {
  const type = getType(code, isNight);

  const rainDrops = useMemo(() =>
    Array.from({ length: type === 'storm' ? 28 : 22 }, (_, i) => ({
      left:     s(i * 3.7) * 100,
      delay:    -(s(i * 2.3) * 2),
      duration: 0.65 + s(i * 1.9) * 0.55,
      height:   14 + Math.round(s(i * 4.1) * 16),
    }))
  , [type]);

  const snowFlakes = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      left:     s(i * 4.1) * 100,
      delay:    -(s(i * 3.3) * 6),
      duration: 4 + s(i * 2.1) * 4,
      size:     4 + Math.round(s(i * 5.7) * 5),
    }))
  , []);

  const stars = useMemo(() =>
    Array.from({ length: 32 }, (_, i) => ({
      left:     s(i * 7.3) * 100,
      top:      s(i * 4.9) * 72,
      size:     1.5 + s(i * 3.1) * 2,
      delay:    -(s(i * 6.7) * 4),
      duration: 2 + s(i * 2.9) * 3,
    }))
  , []);

  const wrap: React.CSSProperties = {
    position: 'fixed', inset: 0,
    zIndex: 1, pointerEvents: 'none',
    overflow: 'hidden',
  };

  if (type === 'none') return null;

  if (type === 'sun') {
    return (
      <div style={wrap}>
        <div style={{ position: 'absolute', top: -140, left: '50%', transform: 'translateX(-50%)' }}>
          <div style={{
            width: 420, height: 420, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,230,100,0.42) 0%, rgba(255,200,60,0.14) 50%, transparent 72%)',
            animation: 'sun-pulse 5s ease-in-out infinite',
          }} />
        </div>
        <div style={{ position: 'absolute', top: -90, left: '50%', transform: 'translateX(-50%)' }}>
          <div style={{ width: 380, height: 380, animation: 'sun-ray-rotate 70s linear infinite' }}>
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: '50%', top: 0,
                width: 7, height: 185,
                marginLeft: -3.5,
                background: 'rgba(255,220,80,0.11)',
                borderRadius: 4,
                transformOrigin: '50% 190px',
                transform: `rotate(${i * 45}deg)`,
              }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'rain' || type === 'storm') {
    return (
      <div style={wrap}>
        {rainDrops.map((d, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${d.left}%`,
            top: 0,
            width: 1.5,
            height: d.height,
            borderRadius: 1,
            background: type === 'storm'
              ? 'rgba(200,220,255,0.5)'
              : 'rgba(180,215,245,0.45)',
            animation: `rain-fall ${d.duration}s ${d.delay}s linear infinite`,
          }} />
        ))}
        {type === 'storm' && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(255,255,255,0.18)',
            opacity: 0,
            animation: 'lightning-flash 8s ease-in-out infinite',
          }} />
        )}
      </div>
    );
  }

  if (type === 'snow') {
    return (
      <div style={wrap}>
        {snowFlakes.map((f, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${f.left}%`,
            top: 0,
            width: f.size,
            height: f.size,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.78)',
            animation: `snow-drift ${f.duration}s ${f.delay}s linear infinite`,
          }} />
        ))}
      </div>
    );
  }

  if (type === 'night') {
    return (
      <div style={wrap}>
        {stars.map((st, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${st.left}%`,
            top: `${st.top}%`,
            width: st.size,
            height: st.size,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.92)',
            animation: `twinkle ${st.duration}s ${st.delay}s ease-in-out infinite`,
          }} />
        ))}
      </div>
    );
  }

  return null;
}
