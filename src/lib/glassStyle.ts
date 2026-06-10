import type { CSSProperties } from 'react';

export function makeGlass(isDark: boolean): CSSProperties {
  return {
    background: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.5)',
    borderRadius: 16,
    border: isDark ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(255,255,255,0.6)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
  };
}
