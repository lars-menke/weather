import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import froschSun from '../assets/frog/frosch_01_sonnebrille.png';

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const onDoneRef    = useRef(onDone);
  const [fading, setFading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef     = useRef<HTMLParagraphElement>(null);
  const subRef       = useRef<HTMLParagraphElement>(null);

  useEffect(() => { onDoneRef.current = onDone; });

  useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.opacity = '0';
      containerRef.current.style.transform = 'scale(0.72)';
    }
    if (titleRef.current) {
      titleRef.current.style.opacity = '0';
      titleRef.current.style.transform = 'translateY(10px)';
    }
    if (subRef.current) {
      subRef.current.style.opacity = '0';
      subRef.current.style.transform = 'translateY(10px)';
    }
  }, []);

  useEffect(() => {
    function transitionIn(el: HTMLElement | null, css: string, finalTransform: string) {
      if (!el) return;
      el.offsetHeight;
      el.style.transition = css;
      el.style.opacity = '1';
      el.style.transform = finalTransform;
    }

    const t1 = setTimeout(() => {
      transitionIn(containerRef.current, 'opacity 0.55s ease, transform 0.7s cubic-bezier(0.34,1.56,0.64,1)', 'scale(1)');
      transitionIn(titleRef.current,     'opacity 0.4s ease 0.25s, transform 0.4s ease 0.25s', 'translateY(0)');
      transitionIn(subRef.current,       'opacity 0.4s ease 0.4s,  transform 0.4s ease 0.4s',  'translateY(0)');
    }, 80);

    const t3 = setTimeout(() => setFading(true), 2000);
    const t4 = setTimeout(() => onDoneRef.current(), 2400);

    return () => { clearTimeout(t1); clearTimeout(t3); clearTimeout(t4); };
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
      {/* Frog in front, sun ghostly behind */}
      <div
        ref={containerRef}
        style={{ position: 'relative', width: 96, height: 96 }}
      >
        {/* Ghost sun — hand-drawn outline, upper-right of frog */}
        <svg
          viewBox="0 0 100 100"
          fill="none"
          style={{
            position: 'absolute',
            top: -58,
            left: 10,
            width: 170, height: 170,
            opacity: 0.22,
            animation: 'sun-pulse 4s ease-in-out infinite',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        >
            {/* Slightly imperfect circle */}
            <path
              d="M 50 27 C 64 25, 75 36, 74 50 C 73 64, 62 75, 50 74 C 37 74, 25 63, 26 50 C 26 37, 36 25, 50 27 Z"
              stroke="#f59e0b" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"
            />
            {/* 8 rays — subtle curves for hand-drawn feel */}
            <path d="M 50 21 Q 48 15 50 10"   stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round"/>
            <path d="M 67 33 Q 73 27 78 22"   stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round"/>
            <path d="M 79 50 Q 85 51 91 49"   stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round"/>
            <path d="M 67 67 Q 73 73 78 78"   stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round"/>
            <path d="M 50 79 Q 52 85 50 91"   stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round"/>
            <path d="M 33 67 Q 27 73 22 78"   stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round"/>
            <path d="M 21 50 Q 15 49 9 51"    stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round"/>
            <path d="M 33 33 Q 27 27 22 22"   stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round"/>
        </svg>

        {/* Frog */}
        <img
          src={froschSun}
          alt=""
          aria-hidden="true"
          style={{
            position: 'relative', zIndex: 1,
            width: 96, height: 96,
            objectFit: 'contain', userSelect: 'none',
          }}
        />
      </div>

      <p
        ref={titleRef}
        style={{
          fontFamily: 'Outfit', fontSize: 36, fontWeight: 600,
          color: '#0060ac', letterSpacing: '-0.02em', marginTop: 8,
        }}
      >FrogWeather</p>

      <p
        ref={subRef}
        style={{ fontFamily: 'Inter', fontSize: 15, color: '#717783' }}
      >Der Wetterfrosch fürs iPhone</p>
    </div>
  );
}
