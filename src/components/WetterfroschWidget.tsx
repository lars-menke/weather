import { useState } from 'react';
import frosch1 from '../assets/frog/frosch_01_sonnebrille.png';
import frosch2 from '../assets/frog/frosch_02_freundlich.png';
import frosch3 from '../assets/frog/frosch_03_bewoelkt.png';
import frosch4 from '../assets/frog/frosch_04_regen.png';
import leiterImg from '../assets/leiter_mit_pflanzen.png';

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

// Ladder PNG 500×500, rendered at 120×120px. Ladder positioned at top:28 in 120×155 container.
// Rung centers in 120px image: rung4=24, rung3=44, rung2=66, rung1=87
// Frog 64px. FROG_TOP = (rung_center + 28) - 64 + 12  (feet ~12px below rung center)
const FROG_TOP: Record<number, number> = { 4: 0, 3: 20, 2: 42, 1: 63 };

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
        borderRadius: 16,
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        height: '100%',
        // Same glassCard style as Dashboard's other tiles
        background: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.5)',
        border: isDark ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(255,255,255,0.6)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        padding: '12px 8px 8px',
      }}
    >
      {/* Ladder + frog — 120×155 inner container */}
      <div style={{ position: 'relative', width: 120, height: 155, flexShrink: 0 }}>

        {/* Ladder PNG — top:28 leaves headroom for topmost frog */}
        <img
          src={leiterImg}
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 28, left: 0,
            width: 120, height: 120,
            objectFit: 'contain',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        />

        {/* Frog — 64×64, positioned on correct rung */}
        <div style={{
          position: 'absolute',
          top: FROG_TOP[rung],
          left: '50%',
          transform: 'translateX(-50%)',
          transition: 'top 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
          width: 64, height: 64,
        }}>
          <div className={tapping ? 'frog-tap-hop' : ''}>
            <img
              src={FROGS[rung]}
              alt=""
              aria-hidden="true"
              style={{ width: 64, height: 64, objectFit: 'contain', display: 'block', userSelect: 'none' }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
