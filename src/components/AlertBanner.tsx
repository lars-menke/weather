import type { WeatherAlert } from '../types/weather';

const SEVERITY: Record<string, { bg: string; border: string; iconColor: string; label: string; icon: string }> = {
  minor:    { bg: 'rgba(245,158,11,0.18)',  border: 'rgba(245,158,11,0.45)',  iconColor: '#f59e0b', label: 'Warnung',           icon: 'warning' },
  moderate: { bg: 'rgba(249,115,22,0.18)',  border: 'rgba(249,115,22,0.45)',  iconColor: '#f97316', label: 'Markante Warnung',  icon: 'warning' },
  severe:   { bg: 'rgba(239,68,68,0.18)',   border: 'rgba(239,68,68,0.45)',   iconColor: '#ef4444', label: 'Unwetterwarnung',   icon: 'thunderstorm' },
  extreme:  { bg: 'rgba(124,58,237,0.18)',  border: 'rgba(124,58,237,0.45)', iconColor: '#a855f7', label: 'Extremes Unwetter', icon: 'thunderstorm' },
};

function formatDt(iso: string): string {
  return new Date(iso).toLocaleString('de-DE', {
    weekday: 'short', day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit',
  });
}

interface Props {
  alerts: WeatherAlert[];
  isDark?: boolean;
}

export default function AlertBanner({ alerts, isDark = false }: Props) {
  if (alerts.length === 0) return null;

  const textPrimary  = isDark ? 'rgba(255,255,255,0.95)' : '#0b1c30';
  const textMuted    = isDark ? 'rgba(255,255,255,0.6)'  : '#717783';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {alerts.map(alert => {
        const cfg = SEVERITY[alert.severity] ?? SEVERITY.minor;
        return (
          <div
            key={alert.id}
            style={{
              background: cfg.bg,
              border: `1px solid ${cfg.border}`,
              borderRadius: 14,
              padding: '12px 14px',
              display: 'flex',
              gap: 10,
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            <span
              className="material-symbols-outlined mat-fill"
              style={{ fontSize: 22, color: cfg.iconColor, flexShrink: 0, marginTop: 1 }}
            >
              {cfg.icon}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 700, color: cfg.iconColor, marginBottom: 3 }}>
                {alert.headline}
              </p>
              <p style={{ fontFamily: 'Inter', fontSize: 12, color: textPrimary, lineHeight: 1.45, marginBottom: alert.instruction ? 4 : 6 }}>
                {alert.description}
              </p>
              {alert.instruction && (
                <p style={{ fontFamily: 'Inter', fontSize: 12, color: textPrimary, lineHeight: 1.45, marginBottom: 6, fontStyle: 'italic' }}>
                  {alert.instruction}
                </p>
              )}
              <p style={{ fontFamily: 'Inter', fontSize: 11, color: textMuted, fontVariantNumeric: 'tabular-nums' }}>
                {formatDt(alert.onset)} – {formatDt(alert.expires)} Uhr
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
