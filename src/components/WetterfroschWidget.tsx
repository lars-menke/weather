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

// Ladder PNG is 500×500. Rendered at 120×120px inside the widget.
// Rung centers measured from pixel scan (y in rendered 120px):
//   rung4=24, rung3=44, rung2=66, rung1=87
// Inner container: 120×140 (20px top padding for top frog headroom)
// Frog size 54px. FROG_TOP = rung_center + 20 (offset) - 42 (frog up-shift)
const FROG_TOP: Record<number, number> = { 4: 2, 3: 22, 2: 44, 1: 65 };

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
        background: isDark
          ? 'linear-gradient(160deg, rgba(255,255,255,0.16) 0%, rgba(180,220,255,0.08) 100%)'
          : 'linear-gradient(160deg, rgba(255,255,255,0.82) 0%, rgba(220,238,255,0.58) 60%, rgba(200,228,255,0.68) 100%)',
        border: isDark
          ? '1px solid rgba(255,255,255,0.22)'
          : '1px solid rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: isDark
          ? 'inset 0 1px 0 rgba(255,255,255,0.14), 0 2px 12px rgba(0,0,0,0.18)'
          : 'inset 0 1.5px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(180,210,255,0.3), 0 2px 12px rgba(100,160,230,0.12)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        padding: '12px 8px 8px',
      }}
    >
      {/* Top rim highlight */}
      <div style={{
        position: 'absolute', top: 0, left: '12%', right: '12%', height: 2,
        borderRadius: '0 0 4px 4px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.85) 40%, rgba(255,255,255,0.85) 60%, transparent)',
        pointerEvents: 'none',
      }} />
      {/* Left glass reflection */}
      <div style={{
        position: 'absolute', left: 7, top: 14, bottom: 18, width: 4,
        borderRadius: 3,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.10) 70%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Ladder + frog — fixed 120×140 inner container */}
      <div style={{ position: 'relative', width: 120, height: 140, flexShrink: 0 }}>

        {/* Ladder PNG, positioned 20px from top to leave room for top frog */}
        <img
          src={leiterImg}
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 20, left: 0,
            width: 120, height: 120,
            objectFit: 'contain',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        />

        {/* Frog — positioned on the correct rung */}
        <div style={{
          position: 'absolute',
          top: FROG_TOP[rung],
          left: '50%',
          transform: 'translateX(-50%)',
          transition: 'top 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
          width: 54, height: 54,
        }}>
          <div className={tapping ? 'frog-tap-hop' : ''}>
            <img
              src={FROGS[rung]}
              alt=""
              aria-hidden="true"
              style={{ width: 54, height: 54, objectFit: 'contain', display: 'block', userSelect: 'none' }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
