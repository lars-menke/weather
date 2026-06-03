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

const FROGS: Record<number, string> = { 4: frosch1, 3: frosch2, 2: frosch3, 1: frosch4 };

// SVG viewBox "0 0 100 200" — rung tops: 50, 84, 118, 152
// Frog 60px: FROG_TOP = rung_top - 52 (bottom sits on rung)
const FROG_TOP: Record<number, number> = { 4: 0, 3: 34, 2: 68, 1: 102 };

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
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '14px 14px 20px 20px',
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        // Glass jar: layered background for depth
        background: isDark
          ? 'linear-gradient(175deg, rgba(180,220,255,0.18) 0%, rgba(130,185,255,0.08) 60%, rgba(100,160,240,0.14) 100%)'
          : 'linear-gradient(175deg, rgba(215,238,255,0.70) 0%, rgba(185,225,255,0.40) 55%, rgba(160,210,255,0.55) 100%)',
        border: isDark
          ? '1.5px solid rgba(170,210,255,0.28)'
          : '1.5px solid rgba(190,225,255,0.80)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: isDark
          ? 'inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.10)'
          : 'inset 0 1.5px 0 rgba(255,255,255,0.90), inset 0 -1px 0 rgba(160,200,255,0.25), 0 2px 8px rgba(100,160,230,0.10)',
        display: 'flex',
        justifyContent: 'center',
        padding: '14px 0 0',
      }}
    >
      {/* Top rim highlight */}
      <div style={{
        position: 'absolute', top: 0, left: '12%', right: '12%', height: 2,
        borderRadius: '0 0 4px 4px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.85) 40%, rgba(255,255,255,0.85) 60%, transparent)',
        pointerEvents: 'none',
      }} />

      {/* Left-side glass reflection */}
      <div style={{
        position: 'absolute',
        left: 8, top: 14, bottom: 20, width: 4,
        borderRadius: 3,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.10) 70%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Subtle right edge */}
      <div style={{
        position: 'absolute',
        right: 8, top: 30, height: '40%', width: 2,
        borderRadius: 2,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Ladder + frog + plants */}
      <div style={{ position: 'relative', width: 100, height: 200 }}>
        <svg viewBox="0 0 100 200" width="100" height="200" aria-hidden="true">
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

          {/* Ground shadow */}
          <ellipse cx="50" cy="178" rx="30" ry="5"   fill="rgba(60,40,10,0.22)"/>
          <ellipse cx="50" cy="175" rx="26" ry="3"   fill="rgba(90,62,28,0.30)"/>

          {/* === Plants === */}
          {/* Left cluster */}
          <g opacity="0.92">
            {/* tall stem left */}
            <path d="M 20 175 Q 18 162 22 152" stroke="#3a8c2e" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
            <ellipse cx="22" cy="151" rx="6" ry="4" fill="#4caf3e" transform="rotate(-20,22,151)"/>
            {/* short stem left */}
            <path d="M 17 175 Q 14 168 15 160" stroke="#3a8c2e" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <ellipse cx="15" cy="159" rx="5" ry="3" fill="#5dc44d" transform="rotate(15,15,159)"/>
            {/* ground blade left */}
            <path d="M 24 175 Q 26 169 28 164" stroke="#4caf3e" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <path d="M 13 175 Q 10 170 9 163"  stroke="#3a8c2e" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          </g>
          {/* Right cluster */}
          <g opacity="0.92">
            <path d="M 80 175 Q 82 162 78 152" stroke="#3a8c2e" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
            <ellipse cx="78" cy="151" rx="6" ry="4" fill="#4caf3e" transform="rotate(20,78,151)"/>
            <path d="M 83 175 Q 86 168 85 160" stroke="#3a8c2e" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <ellipse cx="85" cy="159" rx="5" ry="3" fill="#5dc44d" transform="rotate(-15,85,159)"/>
            <path d="M 76 175 Q 74 169 72 164" stroke="#4caf3e" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <path d="M 87 175 Q 90 170 91 163" stroke="#3a8c2e" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          </g>
          {/* Small grass blades center */}
          <path d="M 44 175 Q 43 171 44 167" stroke="#4caf3e" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
          <path d="M 56 175 Q 57 171 56 167" stroke="#4caf3e" strokeWidth="1.4" fill="none" strokeLinecap="round"/>

          {/* Rail shadows */}
          <rect x="33" y="44" width="10" height="132" rx="5" fill="rgba(0,0,0,0.14)"/>
          <rect x="57" y="44" width="10" height="132" rx="5" fill="rgba(0,0,0,0.14)"/>
          {/* Rails */}
          <rect x="30" y="42" width="10" height="132" rx="5" fill="url(#wfr-rail)"/>
          <rect x="60" y="42" width="10" height="132" rx="5" fill="url(#wfr-rail)"/>

          {/* Rungs */}
          {([50, 84, 118, 152] as const).map((y) => (
            <g key={y}>
              <rect x="31" y={y + 2} width="38" height="8" rx="4" fill="rgba(0,0,0,0.18)"/>
              <rect x="30" y={y}     width="40" height="8" rx="4" fill="url(#wfr-rung)"/>
            </g>
          ))}
        </svg>

        {/* Positioning wrapper — vertical weather transition */}
        <div style={{
          position: 'absolute',
          top: FROG_TOP[rung],
          left: '50%',
          transform: 'translateX(-50%)',
          transition: 'top 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
          width: 60, height: 60,
        }}>
          {/* Tap animation wrapper */}
          <div className={tapping ? 'frog-tap-hop' : ''}>
            <img
              src={FROGS[rung]}
              alt=""
              aria-hidden="true"
              style={{ width: 60, height: 60, objectFit: 'contain', display: 'block', userSelect: 'none', clipPath: 'inset(0 0 10% 0)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
