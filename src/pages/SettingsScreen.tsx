import { useState } from 'react';
import type { TempUnit, WindUnit } from '../types/weather';
import { CHANGELOG, APP_VERSION } from '../lib/changelog';
import { makeGlass } from '../lib/glassStyle';

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

function Row({ icon, iconColor, label, children, divider = true }: {
  icon: string; iconColor: string; label: string; children: React.ReactNode; divider?: boolean; isDark?: boolean;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
      borderBottom: divider ? `1px solid var(--c-divider)` : undefined,
    }}>
      <span className="material-symbols-outlined" style={{ fontSize: 20, color: iconColor, flexShrink: 0 }}>{icon}</span>
      <span style={{ fontFamily: 'Inter', fontSize: 15, color: 'var(--c-primary)', flex: 1 }}>{label}</span>
      {children}
    </div>
  );
}

function InfoRow({ icon, iconColor, label, value, divider = true }: {
  icon: string; iconColor: string; label: string; value: string; divider?: boolean; isDark?: boolean;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
      borderBottom: divider ? `1px solid var(--c-divider)` : undefined,
    }}>
      <span className="material-symbols-outlined" style={{ fontSize: 20, color: iconColor, flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'Inter', fontSize: 15, color: 'var(--c-primary)' }}>{label}</div>
        <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--c-muted)', marginTop: 2 }}>{value}</div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode; isDark?: boolean }) {
  return (
    <p style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--c-muted)', marginBottom: 8, paddingLeft: 4 }}>
      {children}
    </p>
  );
}

export default function SettingsScreen({ tempUnit, windUnit, onTempUnit, onWindUnit, isDark = false }: Props) {
  const [expandedVersion, setExpandedVersion] = useState<string | null>(CHANGELOG[0].version);

  const glassCard = { ...makeGlass(), overflow: 'hidden' as const };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 32, paddingTop: 8 }}>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <p style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 700, color: 'var(--c-primary)', letterSpacing: '-0.02em' }}>
          Einstellungen
        </p>
        <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--c-muted-2)', fontVariantNumeric: 'tabular-nums' }}>
          v{APP_VERSION}
        </span>
      </div>

      <section>
        <SectionLabel>Einheiten</SectionLabel>
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
        <SectionLabel>Datenquellen</SectionLabel>
        <div style={glassCard}>
          <InfoRow icon="cloud" iconColor="#0060ac" label="Wettervorhersage" value="Open-Meteo (open-meteo.com)" />
          <InfoRow icon="verified" iconColor="#10b981" label="Messwerte & Warnungen" value="Quelle: Deutscher Wetterdienst (via Bright Sky)" />
          <InfoRow icon="radar" iconColor="#6366f1" label="Radardaten" value="RainViewer (rainviewer.com)" />
          <InfoRow icon="map" iconColor="#f59e0b" label="Karten" value="OpenStreetMap contributors" divider={false} />
        </div>
      </section>

      {/* Aktuelle Version */}
      <section>
        <SectionLabel>Was ist neu? · v{APP_VERSION}</SectionLabel>
        <div style={{ ...glassCard, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {CHANGELOG[0].items.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span className="material-symbols-outlined mat-fill" style={{ fontSize: 16, color: '#6366f1', flexShrink: 0, marginTop: 1 }}>
                {item.icon}
              </span>
              <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--c-primary)', lineHeight: 1.4 }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Ältere Versionen */}
      <section>
        <SectionLabel>Ältere Versionen</SectionLabel>
        <div style={{ ...glassCard, overflow: 'hidden' }}>
          <button
            onClick={() => setExpandedVersion(expandedVersion === 'older' ? null : 'older')}
            aria-expanded={expandedVersion === 'older'}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 600, color: 'var(--c-primary)' }}>
                Kompletter Changelog
              </div>
              <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--c-muted-2)', marginTop: 1 }}>
                v{CHANGELOG[CHANGELOG.length - 1].version} – v{CHANGELOG[0].version}
              </div>
            </div>
            <span className="material-symbols-outlined" style={{
              fontSize: 18, color: 'var(--c-muted-2)',
              transform: expandedVersion === 'older' ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease', flexShrink: 0,
            }}>expand_more</span>
          </button>

          {expandedVersion === 'older' && (
            <div style={{ padding: '0 16px 16px' }}>
              {CHANGELOG.map((entry, ei) => (
                <div key={entry.version}>
                  <div style={{
                    height: 1,
                    background: 'var(--c-divider)',
                    marginBottom: 12,
                  }} />
                  <div style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 700, color: 'var(--c-muted-2)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Version {entry.version} · {entry.date}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: ei < CHANGELOG.length - 1 ? 16 : 0 }}>
                    {entry.items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <span className="material-symbols-outlined mat-fill" style={{ fontSize: 16, color: 'var(--c-muted-2)', flexShrink: 0, marginTop: 1 }}>
                          {item.icon}
                        </span>
                        <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--c-muted)', lineHeight: 1.4 }}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
