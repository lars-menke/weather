import { useEffect, useRef, useState } from 'react';
import logoImg from '../assets/frog/frosch_00_logo.webp';

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const onDoneRef = useRef(onDone);
  const [fading, setFading] = useState(false);

  useEffect(() => { onDoneRef.current = onDone; });

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 2200);
    const t2 = setTimeout(() => onDoneRef.current(), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(180deg, #d4e3ff 0%, #f8f9ff 100%)',
        opacity: fading ? 0 : 1, transition: 'opacity 0.4s ease',
        gap: 16,
      }}
    >
      {/* Bob wrapper handles the idle float; inner img handles the hop entrance —
          split across two elements so the two transforms don't collide. */}
      <div className="splash-frog-bob" style={{ paddingBottom: 16 }}>
        <img
          className="splash-frog-hop"
          src={logoImg}
          alt="FrogWeather Logo"
          style={{
            width: 'min(82vw, 360px)',
            objectFit: 'contain',
            userSelect: 'none',
            display: 'block',
          }}
        />
      </div>

      <p
        style={{
          fontFamily: 'Outfit', fontSize: 36, fontWeight: 600,
          color: '#0060ac', letterSpacing: '-0.02em', marginTop: 8,
          animation: 'splash-text-rise 0.4s ease 0.55s both',
        }}
      >FrogWeather</p>

      <p
        style={{
          fontFamily: 'Inter', fontSize: 15, color: '#717783',
          animation: 'splash-text-rise 0.4s ease 0.72s both',
        }}
      >Der Wetterfrosch fürs iPhone</p>
    </div>
  );
}
