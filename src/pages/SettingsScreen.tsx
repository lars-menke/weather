import type { TempUnit, WindUnit } from '../types/weather';

interface Props {
  tempUnit: TempUnit;
  windUnit: WindUnit;
  onTempUnit: (u: TempUnit) => void;
  onWindUnit: (u: WindUnit) => void;
  isDark?: boolean;
}

function SegmentToggle<T extends string>({
  options, value, onChange, labels, ariaLabels, isDark,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
  labels: Record<T, string>;
  ariaLabels: Record<T, string>;
  isDark?: boolean;
}) {
  return (
    <div style={{ display: 'flex', background: isDark ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.07)', borderRadius: 9, padding: 3, gap: 3 }}>
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
            background: value === opt ? (isDark ? 'rgba(255,255,255,0.18)' : '#fff') : 'transparent',
            color: value === opt ? (isDark ? '#fff' : '#0060ac') : (isDark ? 'rgba(255,255,255,0.5)' : '#717783'),
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

function Row({ icon, iconColor, label, children, divider = true, isDark = false }: {
  icon: string; iconColor: string; label: string; children: React.ReactNode; divider?: boolean; isDark?: boolean;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
      borderBottom: divider ? `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}` : undefined,
    }}>
      <span className="material-symbols-outlined" style={{ fontSize: 20, color: iconColor, flexShrink: 0 }}>{icon}</span>
      <span style={{ fontFamily: 'Inter', fontSize: 15, color: isDark ? 'rgba(255,255,255,0.95)' : '#0b1c30', flex: 1 }}>{label}</span>
      {children}
    </div>
  );
}

function InfoRow({ icon, iconColor, label, value, divider = true, isDark = false }: {
  icon: string; iconColor: string; label: string; value: string; divider?: boolean; isDark?: boolean;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
      borderBottom: divider ? `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}` : undefined,
    }}>
      <span className="material-symbols-outlined" style={{ fontSize: 20, color: iconColor, flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'Inter', fontSize: 15, color: isDark ? 'rgba(255,255,255,0.95)' : '#0b1c30' }}>{label}</div>
        <div style={{ fontFamily: 'Inter', fontSize: 13, color: isDark ? 'rgba(255,255,255,0.6)' : '#717783', marginTop: 2 }}>{value}</div>
      </div>
    </div>
  );
}

function SectionLabel({ children, isDark }: { children: React.ReactNode; isDark?: boolean }) {
  return (
    <p style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: isDark ? 'rgba(255,255,255,0.6)' : '#717783', marginBottom: 8, paddingLeft: 4 }}>
      {children}
    </p>
  );
}

export default function SettingsScreen({ tempUnit, windUnit, onTempUnit, onWindUnit, isDark = false }: Props) {
  const glassCard: React.CSSProperties = {
    background: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.5)',
    borderRadius: 16,
    border: isDark ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(255,255,255,0.6)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    overflow: 'hidden',
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 32, paddingTop: 8 }}>

      <p style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 700, color: isDark ? 'rgba(255,255,255,0.95)' : '#0b1c30', letterSpacing: '-0.02em' }}>
        Einstellungen
      </p>

      <section>
        <SectionLabel isDark={isDark}>Einheiten</SectionLabel>
        <div style={glassCard}>
          <Row icon="device_thermostat" iconColor="#0060ac" label="Temperatur" isDark={isDark}>
            <SegmentToggle
              options={['celsius', 'fahrenheit'] as TempUnit[]}
              value={tempUnit}
              onChange={onTempUnit}
              labels={{ celsius: '°C', fahrenheit: '°F' }}
              ariaLabels={{ celsius: 'Celsius', fahrenheit: 'Fahrenheit' }}
              isDark={isDark}
            />
          </Row>
          <Row icon="air" iconColor="#0060ac" label="Windgeschwindigkeit" divider={false} isDark={isDark}>
            <SegmentToggle
              options={['kmh', 'mph'] as WindUnit[]}
              value={windUnit}
              onChange={onWindUnit}
              labels={{ kmh: 'km/h', mph: 'mph' }}
              ariaLabels={{ kmh: 'Kilometer pro Stunde', mph: 'Meilen pro Stunde' }}
              isDark={isDark}
            />
          </Row>
        </div>
      </section>

      <section>
        <SectionLabel isDark={isDark}>Datenquellen</SectionLabel>
        <div style={glassCard}>
          <InfoRow icon="cloud" iconColor="#0060ac" label="Wetterdaten" value="Open-Meteo (open-meteo.com)" isDark={isDark} />
          <InfoRow icon="radar" iconColor="#6366f1" label="Radardaten" value="RainViewer (rainviewer.com)" isDark={isDark} />
          <InfoRow icon="map" iconColor="#10b981" label="Karten" value="OpenStreetMap contributors" divider={false} isDark={isDark} />
        </div>
      </section>

    </div>
  );
}
