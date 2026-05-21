import type { TempUnit, WindUnit } from '../types/weather';

interface Props {
  tempUnit: TempUnit;
  windUnit: WindUnit;
  onTempUnit: (u: TempUnit) => void;
  onWindUnit: (u: WindUnit) => void;
}

const glassCard: React.CSSProperties = {
  background: 'var(--c-card-bg)',
  borderRadius: 16,
  border: '1px solid var(--c-card-border)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  overflow: 'hidden',
};

const rowDivider: React.CSSProperties = {
  borderBottom: '1px solid rgba(0,0,0,0.06)',
};

function SegmentToggle<T extends string>({
  options, value, onChange, labels, ariaLabels,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
  labels: Record<T, string>;
  ariaLabels: Record<T, string>;
}) {
  return (
    <div style={{ display: 'flex', background: 'rgba(0,0,0,0.07)', borderRadius: 9, padding: 3, gap: 3 }}>
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          aria-label={ariaLabels[opt]}
          aria-pressed={value === opt}
          style={{
            padding: '5px 16px', borderRadius: 7, border: 'none',
            cursor: 'pointer', fontFamily: 'Inter', fontSize: 13,
            fontWeight: value === opt ? 600 : 400,
            background: value === opt ? '#fff' : 'transparent',
            color: value === opt ? 'var(--c-accent)' : 'var(--c-muted)',
            boxShadow: value === opt ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
            transition: 'background 0.15s, color 0.15s, box-shadow 0.15s',
          }}
        >
          {labels[opt]}
        </button>
      ))}
    </div>
  );
}

function Row({ icon, iconColor, label, children, divider = true }: {
  icon: string; iconColor: string; label: string; children: React.ReactNode; divider?: boolean;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', ...(divider ? rowDivider : {}) }}>
      <span className="material-symbols-outlined" style={{ fontSize: 20, color: iconColor, flexShrink: 0 }}>{icon}</span>
      <span style={{ fontFamily: 'Inter', fontSize: 15, color: 'var(--c-primary)', flex: 1 }}>{label}</span>
      {children}
    </div>
  );
}

function InfoRow({ icon, iconColor, label, value, divider = true }: {
  icon: string; iconColor: string; label: string; value: string; divider?: boolean;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', ...(divider ? rowDivider : {}) }}>
      <span className="material-symbols-outlined" style={{ fontSize: 20, color: iconColor, flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'Inter', fontSize: 15, color: 'var(--c-primary)' }}>{label}</div>
        <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--c-muted)', marginTop: 2 }}>{value}</div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--c-muted)', marginBottom: 8, paddingLeft: 4 }}>
      {children}
    </p>
  );
}

export default function SettingsScreen({ tempUnit, windUnit, onTempUnit, onWindUnit }: Props) {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 32, paddingTop: 8 }}>

      <p style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 700, color: 'var(--c-primary)', letterSpacing: '-0.02em' }}>
        Einstellungen
      </p>

      <section>
        <SectionLabel>Einheiten</SectionLabel>
        <div style={glassCard}>
          <Row icon="device_thermostat" iconColor="var(--c-accent)" label="Temperatur">
            <SegmentToggle
              options={['celsius', 'fahrenheit'] as TempUnit[]}
              value={tempUnit}
              onChange={onTempUnit}
              labels={{ celsius: '°C', fahrenheit: '°F' }}
              ariaLabels={{ celsius: 'Celsius', fahrenheit: 'Fahrenheit' }}
            />
          </Row>
          <Row icon="air" iconColor="var(--c-accent)" label="Windgeschwindigkeit" divider={false}>
            <SegmentToggle
              options={['kmh', 'mph'] as WindUnit[]}
              value={windUnit}
              onChange={onWindUnit}
              labels={{ kmh: 'km/h', mph: 'mph' }}
              ariaLabels={{ kmh: 'Kilometer pro Stunde', mph: 'Meilen pro Stunde' }}
            />
          </Row>
        </div>
      </section>

      <section>
        <SectionLabel>Datenquellen</SectionLabel>
        <div style={glassCard}>
          <InfoRow icon="cloud" iconColor="var(--c-accent)" label="Wetterdaten" value="Open-Meteo (open-meteo.com)" />
          <InfoRow icon="radar" iconColor="#6366f1" label="Radardaten" value="RainViewer (rainviewer.com)" />
          <InfoRow icon="map" iconColor="#10b981" label="Karten" value="OpenStreetMap contributors" divider={false} />
        </div>
      </section>

    </div>
  );
}
