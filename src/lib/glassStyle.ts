import type { CSSProperties } from 'react';

export function makeGlass(): CSSProperties {
  return {
    background: 'var(--glass-bg)',
    borderRadius: 16,
    border: '1px solid var(--glass-b)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
  };
}
