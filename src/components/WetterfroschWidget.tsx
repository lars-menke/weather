import frosch1 from '../assets/frog/frosch_01_sonnebrille.png';
import frosch2 from '../assets/frog/frosch_02_freundlich.png';
import frosch3 from '../assets/frog/frosch_03_bewoelkt.png';
import frosch4 from '../assets/frog/frosch_04_regen.png';

interface WetterfroschWidgetProps {
  code: number;
  isDark?: boolean;
}

// WMO code → rung (4 = top/sunny, 1 = bottom/rain)
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

const RUNG_INFOS: Array<{ rung: 1|2|3|4; label: string; icon: string; centerY: number }> = [
  { rung: 4, label: 'Sonnenschein', icon: 'wb_sunny',          centerY: 83  },
  { rung: 3, label: 'Heiter',       icon: 'partly_cloudy_day', centerY: 125 },
  { rung: 2, label: 'Bewölkt',      icon: 'cloud',             centerY: 167 },
  { rung: 1, label: 'Regen',        icon: 'rainy',             centerY: 209 },
];

// SVG viewBox "0 0 140 250" — rung tops: 78, 120, 162, 204 (h=11 each)
// Frog top = rung_top − 71 → frog bottom at rung_top + 5 (sits on rung)
const FROG_TOP: Record<number, number> = { 4: 7, 3: 49, 2: 91, 1: 133 };

export default function WetterfroschWidget({ code, isDark = false }: WetterfroschWidgetProps) {
  const rung = getRung(code);
  const mutedColor  = isDark ? 'rgba(255,255,255,0.55)' : '#717783';
  const accentColor = isDark ? 'rgba(255,255,255,0.95)' : '#0060ac';

  return (
    <div>
      <p style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                  letterSpacing: '0.1em', color: mutedColor, marginBottom: 8, paddingLeft: 4 }}>
        Wetterfrosch
      </p>

      <div style={{
        background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.5)',
        borderRadius: 16,
        border: isDark ? '1px solid rgba(255,255,255,0.16)' : '1px solid rgba(255,255,255,0.6)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        padding: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
      }}>

        {/* Ladder + frog */}
        <div style={{ position: 'relative', width: 140, height: 250, flexShrink: 0 }}>
          <svg viewBox="0 0 140 250" width="140" height="250" aria-hidden="true">
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

            {/* Rail drop shadows */}
            <rect x="43" y="70" width="12" height="152" rx="6" fill="rgba(0,0,0,0.18)"/>
            <rect x="87" y="70" width="12" height="152" rx="6" fill="rgba(0,0,0,0.18)"/>
            {/* Rails */}
            <rect x="40" y="68" width="12" height="152" rx="6" fill="url(#wfr-rail)"/>
            <rect x="88" y="68" width="12" height="152" rx="6" fill="url(#wfr-rail)"/>

            {/* Rungs */}
            {([78, 120, 162, 204] as const).map((y, i) => {
              const r = (4 - i) as 1|2|3|4;
              const active = r === rung;
              return (
                <g key={r}>
                  <rect x="41" y={y + 2} width="58" height="11" rx="5.5" fill="rgba(0,0,0,0.2)"/>
                  <rect x="40" y={y}     width="60" height="11" rx="5.5"
                        fill={active ? '#f0b870' : 'url(#wfr-rung)'}/>
                  {active && (
                    <rect x="40" y={y} width="60" height="11" rx="5.5"
                          fill="none" stroke="rgba(255,200,80,0.7)" strokeWidth="1.5"/>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Frog — animates vertically when rung changes */}
          <img
            src={FROGS[rung]}
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: FROG_TOP[rung],
              left: '50%',
              transform: 'translateX(-50%)',
              width: 76,
              height: 76,
              objectFit: 'contain',
              transition: 'top 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          />
        </div>

        {/* Rung labels aligned to SVG rung positions */}
        <div style={{ position: 'relative', flex: 1, height: 250 }}>
          {RUNG_INFOS.map(({ rung: r, label, icon, centerY }) => {
            const isActive = r === rung;
            return (
              <div key={r} style={{
                position: 'absolute',
                top: centerY - 12,
                left: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                opacity: isActive ? 1 : 0.3,
                transition: 'opacity 0.4s',
              }}>
                <span
                  className={`material-symbols-outlined${isActive ? ' mat-fill' : ''}`}
                  style={{ fontSize: 20, color: isActive ? accentColor : mutedColor }}
                >
                  {icon}
                </span>
                <span style={{
                  fontFamily: 'Inter',
                  fontSize: isActive ? 15 : 13,
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? accentColor : mutedColor,
                  transition: 'font-size 0.4s, font-weight 0.4s',
                }}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
