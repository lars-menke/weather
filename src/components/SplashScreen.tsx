import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onDone: () => void;
}

export function SplashScreen({ onDone }: SplashScreenProps) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 1500);
    const doneTimer = setTimeout(() => onDone(), 1900);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #d4e3ff 0%, #f8f9ff 100%)',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.4s ease',
        gap: 16,
      }}
    >
      <span style={{ fontSize: 80, lineHeight: 1, userSelect: 'none' }}>☀️</span>
      <p
        style={{
          fontFamily: 'Outfit',
          fontSize: 36,
          fontWeight: 600,
          color: '#0060ac',
          letterSpacing: '-0.02em',
          marginTop: 8,
        }}
      >
        Wetter
      </p>
      <p
        style={{
          fontFamily: 'Inter',
          fontSize: 15,
          color: '#717783',
        }}
      >
        Dein persönliches Wetter
      </p>
    </div>
  );
}
