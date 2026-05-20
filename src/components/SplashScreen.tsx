import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const onDoneRef = useRef(onDone);
  const [fading, setFading] = useState(false);
  const iconRef  = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const subRef   = useRef<HTMLParagraphElement>(null);

  // Keep ref fresh so stale-closure is not an issue, without re-running the effect
  useEffect(() => { onDoneRef.current = onDone; });

  // Set hidden state before the first paint to avoid a flash of visible content
  useLayoutEffect(() => {
    if (iconRef.current) {
      iconRef.current.style.opacity = '0';
      iconRef.current.style.transform = 'scale(0.72)';
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
    // Direct DOM transitions — more reliable on iOS Safari than CSS @keyframes
    // toggled via React state changes (avoids re-run when onDone changes).
    function transitionIn(
      el: HTMLElement | null,
      css: string,
      finalTransform: string,
    ) {
      if (!el) return;
      el.offsetHeight; // force reflow so the initial hidden state is committed
      el.style.transition = css;
      el.style.opacity = '1';
      el.style.transform = finalTransform;
    }

    const t1 = setTimeout(() => {
      transitionIn(iconRef.current,  'opacity 0.55s ease, transform 0.7s cubic-bezier(0.34,1.56,0.64,1)', 'scale(1)');
      transitionIn(titleRef.current, 'opacity 0.4s ease 0.25s, transform 0.4s ease 0.25s', 'translateY(0)');
      transitionIn(subRef.current,   'opacity 0.4s ease 0.4s,  transform 0.4s ease 0.4s',  'translateY(0)');
    }, 80);

    // Add the continuous sun spin+glow only after the pop-in is done
    const t2 = setTimeout(() => iconRef.current?.classList.add('sun-animate'), 900);

    const t3 = setTimeout(() => setFading(true), 2000);
    const t4 = setTimeout(() => onDoneRef.current(), 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []); // run exactly once on mount

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
        ref={iconRef}
        className="material-symbols-outlined mat-fill"
        style={{ fontSize: 80, color: '#f59e0b', lineHeight: 1, userSelect: 'none' }}
      >wb_sunny</span>

      <p
        ref={titleRef}
        style={{
          fontFamily: 'Outfit',
          fontSize: 36,
          fontWeight: 600,
          color: '#0060ac',
          letterSpacing: '-0.02em',
          marginTop: 8,
        }}
      >Weather</p>

      <p
        ref={subRef}
        style={{ fontFamily: 'Inter', fontSize: 15, color: '#717783' }}
      >Dein persönliches Wetter</p>
    </div>
  );
}
