import { useState } from 'react';
import frosch1 from '../assets/frog/frosch_01_sonnig.png';
import frosch2 from '../assets/frog/frosch_02_neutral.png';
import frosch3 from '../assets/frog/frosch_03_bewoelkt.png';
import frosch4 from '../assets/frog/frosch_04_regen.png';
import frosch5 from '../assets/frog/frosch_05_schnee.png';

interface WetterfroschWidgetProps {
  code: number;
  isDark?: boolean;
}

type Condition = 'sunny' | 'neutral' | 'cloudy' | 'rain' | 'snow';

function getCondition(code: number): Condition {
  if (code === 0) return 'sunny';
  if (code <= 2)  return 'neutral';
  if (code <= 48) return 'cloudy';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
  return 'rain';
}

const FROGS: Record<Condition, string> = {
  sunny:   frosch1,
  neutral: frosch2,
  cloudy:  frosch3,
  rain:    frosch4,
  snow:    frosch5,
};

const LABELS: Record<Condition, string> = {
  sunny:   'Sonnig',
  neutral: 'Leicht bewölkt',
  cloudy:  'Bewölkt',
  rain:    'Regen',
  snow:    'Schnee',
};

export default function WetterfroschWidget({ code, isDark = false }: WetterfroschWidgetProps) {
  const condition = getCondition(code);
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
        borderRadius: 16,
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        height: '100%',
        background: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.5)',
        border: isDark ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(255,255,255,0.6)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        padding: '12px 8px 16px',
      }}
    >
      <div className={tapping ? 'frog-tap-hop' : ''}>
        <img
          src={FROGS[condition]}
          alt=""
          aria-hidden="true"
          style={{
            width: 96,
            height: 96,
            objectFit: 'contain',
            display: 'block',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        />
      </div>
      <span style={{
        fontFamily: 'Inter',
        fontSize: 12,
        fontWeight: 500,
        color: isDark ? 'rgba(255,255,255,0.55)' : '#717783',
      }}>
        {LABELS[condition]}
      </span>
    </div>
  );
}
