interface TabBarProps {
  active: number;
  onChange: (i: number) => void;
}

const TABS = [
  { icon: 'home', label: 'Wetter' },
  { icon: 'calendar_month', label: 'Vorhersage' },
  { icon: 'radar', label: 'Radar' },
  { icon: 'settings', label: 'Einstellungen' },
];

export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 430,
        zIndex: 100,
        background: 'var(--tabbar-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--tabbar-b)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        display: 'flex',
        alignItems: 'stretch',
      }}
    >
      {TABS.map((tab, i) => {
        const isActive = active === i;
        return (
          <button
            key={tab.label}
            onClick={() => onChange(i)}
            aria-label={tab.label}
            aria-current={isActive ? 'page' : undefined}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              padding: '10px 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isActive ? 'var(--c-accent)' : 'var(--c-muted)',
              transition: 'color 0.2s',
              minHeight: 56,
            }}
          >
            <span
              className={isActive ? 'material-symbols-outlined mat-fill' : 'material-symbols-outlined'}
              style={{ fontSize: 24 }}
            >
              {tab.icon}
            </span>
            <span style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: isActive ? 600 : 400, letterSpacing: '0.01em' }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
