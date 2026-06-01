import { useState } from 'react';
import frosch1 from '../assets/frog/frosch_01_sonnebrille.png';
import frosch2 from '../assets/frog/frosch_02_freundlich.png';
import frosch3 from '../assets/frog/frosch_03_bewoelkt.png';
import frosch4 from '../assets/frog/frosch_04_regen.png';

interface WetterfroschWidgetProps {
  code: number;
  isDark?: boolean;
}

function getRung(code: number): 1 | 2 | 3 | 4 {
  if (code === 0) return 4;
  if (code <= 2) return 3;
  if (code <= 48) return 2;
  return 1;
}

const FROGS: Record<number, string> = {
  4: frosch1,
  3: frosch2,
  2: frosch3,
  1: frosch4,
};

// SVG viewBox "0 0 100 190"
// Rung tops: 50, 84, 118, 152  h=8
// Frog 52px: top = rung_top - 46
const FROG_TOP: Record<number, number> = { 4: 4, 3: 38, 2: 72, 1: 106 };

export default function WetterfroschWidget({ code, isDark = false }: WetterfroschWidgetProps) {
  const rung = getRung(code);
  const [tapping, setTapping] = useState(false);

  function handleTap() {
    if (tapping) return;
    setTapping(true);
    setTimeout(() => setTapping(false), 700);
  }

  return (
    <div
      onClick={handleTap}
      style={{
        background:   isDark ? 'rgba(150, 195, 255, 0.10)' : 'rgba(185, 225, 255, 0.32)',
        border:       isDark ? '2px solid rgba(160, 200, 255, 0.22)' : '2px solid rgba(165, 210, 255, 0.60)',
        borderRadius: '12px 12px 18px 18px',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        padding: '14px 0 10px',
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* Left-side glass reflection */}
      <div style={{
        position: 'absolute',
        left: 9, top: 16, bottom: 16, width: 3,
        borderRadius: 2,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.04) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Ladder + frog */}
      <div style={{ position: 'relative', width: 100, height: 190 }}>
        <svg viewBox="0 0 100 190" width="100" height="190" aria-hidden="true">
          <defs>
            <linearGradient id="wfr-rail" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#7a4e1e"/>
              <stop offset="25%"  stopColor="#c8813a"/>
              <stop offset="60%"  stopColor="#e09a48"/>
              <stop offset="100%" stopColor="#8b5a22"/>
            </linearGradient>
            <linearGradient id="wfr-rung" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#e09a48"/>
              <stop offset="50%"  stopColor="#c8813a"/>
              <stop offset="100%" stopColor="#8b5a22"/>
            </linearGradient>
          </defs>

          <ellipse cx="50" cy="176" rx="30" ry="6"   fill="rgba(90,62,28,0.40)"/>
          <ellipse cx="50" cy="173" rx="26" ry="3.5" fill="rgba(130,95,45,0.35)"/>

          <rect x="33" y="44" width="10" height="132" rx="5" fill="rgba(0,0,0,0.18)"/>
          <rect x="57" y="44" width="10" height="132" rx="5" fill="rgba(0,0,0,0.18)"/>
          <rect x="30" y="42" width="10" height="132" rx="5" fill="url(#wfr-rail)"/>
          <rect x="60" y="42" width="10" height="132" rx="5" fill="url(#wfr-rail)"/>

          {([50, 84, 118, 152] as const).map((y) => (
            <g key={y}>
              <rect x="31" y={y + 2} width="38" height="8" rx="4" fill="rgba(0,0,0,0.20)"/>
              <rect x="30" y={y}     width="40" height="8" rx="4" fill="url(#wfr-rung)"/>
            </g>
          ))}
        </svg>

        {/* Positioning wrapper — handles vertical weather transition */}
        <div style={{
          position: 'absolute',
          top: FROG_TOP[rung],
          left: '50%',
          transform: 'translateX(-50%)',
          transition: 'top 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
          width: 52, height: 52,
        }}>
          {/* Animation wrapper — handles tap hop */}
          <div className={tapping ? 'frog-tap-hop' : ''}>
            <img
              src={FROGS[rung]}
              alt=""
              aria-hidden="true"
              style={{ width: 52, height: 52, objectFit: 'contain', display: 'block', userSelect: 'none' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
