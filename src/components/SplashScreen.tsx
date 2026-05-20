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
      <span
        className="material-symbols-outlined mat-fill"
        style={{
          fontSize: 80, color: '#f59e0b', lineHeight: 1, userSelect: 'none',
          animation: 'splash-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) both, sun-icon-spin 22s linear 0.5s infinite, sun-icon-glow 3s ease-in-out 0.5s infinite',
        }}
      >wb_sunny</span>
      <p
        style={{
          fontFamily: 'Outfit',
          fontSize: 36,
          fontWeight: 600,
          color: '#0060ac',
          letterSpacing: '-0.02em',
          marginTop: 8,
          animation: 'splash-text-in 0.4s ease-out 0.25s both',
        }}
      >
        Weather
      </p>
      <p
        style={{
          fontFamily: 'Inter',
          fontSize: 15,
          color: '#717783',
          animation: 'splash-text-in 0.4s ease-out 0.4s both',
        }}
      >
        Dein persönliches Wetter
      </p>
    </div>
  );
}
