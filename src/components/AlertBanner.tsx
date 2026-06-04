import { useState } from 'react';
import type { WeatherAlert } from '../types/weather';

const SEVERITY: Record<string, { bg: string; border: string; iconColor: string; label: string; icon: string }> = {
  minor:    { bg: 'rgba(245,158,11,0.18)',  border: 'rgba(245,158,11,0.45)',  iconColor: '#f59e0b', label: 'Warnung',           icon: 'warning' },
  moderate: { bg: 'rgba(249,115,22,0.18)',  border: 'rgba(249,115,22,0.45)',  iconColor: '#f97316', label: 'Markante Warnung',  icon: 'warning' },
  severe:   { bg: 'rgba(239,68,68,0.18)',   border: 'rgba(239,68,68,0.45)',   iconColor: '#ef4444', label: 'Unwetterwarnung',   icon: 'thunderstorm' },
  extreme:  { bg: 'rgba(124,58,237,0.18)',  border: 'rgba(124,58,237,0.45)', iconColor: '#a855f7', label: 'Extremes Unwetter', icon: 'thunderstorm' },
};

const TRUNCATE_AT = 80;

function formatDt(iso: string): string {
  return new Date(iso).toLocaleString('de-DE', {
    weekday: 'short', day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit',
  });
}

function AlertItem({ alert, isDark }: { alert: WeatherAlert; isDark: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = SEVERITY[alert.severity] ?? SEVERITY.minor;
  const textPrimary = isDark ? 'rgba(255,255,255,0.95)' : '#0b1c30';
  const textMuted   = isDark ? 'rgba(255,255,255,0.6)'  : '#717783';

  const fullText = [alert.description, alert.instruction].filter(Boolean).join('\n\n');
  const needsTruncation = fullText.length > TRUNCATE_AT;
  const displayText = needsTruncation && !expanded
    ? fullText.slice(0, TRUNCATE_AT).trimEnd() + '…'
    : fullText;

  return (
    <div
      onClick={needsTruncation ? () => setExpanded(e => !e) : undefined}
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderRadius: 14,
        padding: '12px 14px',
        display: 'flex',
        gap: 10,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        cursor: needsTruncation ? 'pointer' : 'default',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <span
        className="material-symbols-outlined mat-fill"
        style={{ fontSize: 22, color: cfg.iconColor, flexShrink: 0, marginTop: 1 }}
      >
        {cfg.icon}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 }}>
          <p style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 700, color: cfg.iconColor, flex: 1 }}>
            {alert.headline}
          </p>
          {needsTruncation && (
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: cfg.iconColor, flexShrink: 0, marginLeft: 4 }}>
              {expanded ? 'expand_less' : 'expand_more'}
            </span>
          )}
        </div>
        <p style={{ fontFamily: 'Inter', fontSize: 12, color: textPrimary, lineHeight: 1.5, marginBottom: 6, whiteSpace: 'pre-line' }}>
          {displayText}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
          <p style={{ fontFamily: 'Inter', fontSize: 11, color: textMuted, fontVariantNumeric: 'tabular-nums' }}>
            {formatDt(alert.onset)} – {formatDt(alert.expires)} Uhr
          </p>
          {alert.url && (
            <a
              href={alert.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, color: cfg.iconColor, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0, marginLeft: 8 }}
            >
              DWD
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>open_in_new</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

interface Props {
  alerts: WeatherAlert[];
  isDark?: boolean;
}

export default function AlertBanner({ alerts, isDark = false }: Props) {
  if (alerts.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {alerts.map(alert => (
        <AlertItem key={alert.id} alert={alert} isDark={isDark} />
      ))}
    </div>
  );
}
