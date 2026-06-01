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
        {/* Ghost sun */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <span
            className="material-symbols-outlined mat-fill"
            style={{
              fontSize: 170,
              color: '#f59e0b',
              opacity: 0.18,
              lineHeight: 1,
              animation: 'sun-pulse 4s ease-in-out infinite',
            }}
          >wb_sunny</span>
        </div>

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
