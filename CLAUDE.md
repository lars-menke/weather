# Weather App - Claude Code Context

Eine Wetter-PWA mit Open-Meteo-Daten, 7-Tage-Vorhersage, Radar und animierten Wettereffekten.

## Stack

- React 18, TypeScript, Vite 5
- Inline Styles + CSS Custom Properties (kein Tailwind, keine CSS Modules, keine UI-Libraries)
- Daten: Open-Meteo API + Geocoding
- Radar: RainViewer API + Leaflet
- Deployment: GitHub Pages

## Dateistruktur

```
src/
├── index.css              Reset, CSS-Tokens (:root + [data-theme="dark"]), Keyframes
├── App.css                Leer (Legacy)
├── App.tsx                Root: State, Datenabruf, data-theme, Navigation
├── api/
│   └── weather.ts         Open-Meteo Fetch + Geocoding
├── components/
│   ├── TabBar.tsx
│   ├── SearchBar.tsx      Vollbild-Stadtsuche + Favoriten
│   ├── SplashScreen.tsx
│   ├── WeatherAnimation.tsx  Partikelanimationen (Regen, Schnee, Sonne, Blitz)
│   └── WeatherIcon.tsx
├── pages/
│   ├── Dashboard.tsx         Aktuelle Bedingungen + Stundenstreifen + Bento-Grid
│   ├── ForecastPage.tsx      7-Tage-Karten (Tippen für Details)
│   ├── DayDetailScreen.tsx   Modal-Detail für einzelne Vorhersagetage
│   ├── RadarScreen.tsx       Leaflet-Radarkarte mit RainViewer-Tiles
│   └── SettingsScreen.tsx    Einheitenumschalter + Datenquelleninfo
├── lib/
│   ├── weatherTheme.ts    Wetter-Code + Uhrzeit -> Hintergrund + isDark
│   ├── weatherCodes.ts    Wetter-Code -> Material Symbol + Farbe
│   └── clubs.ts           (Legacy, ungenutzt)
└── types/
    └── weather.ts         API-Response-Typen + App-Typen
```

## Theming

Dark/Light-Modus wird durch die Wetterbedingungen gesteuert, nicht durch `prefers-color-scheme`. `getWeatherBackground()` gibt `{ background, isDark, isNight }` basierend auf Wetter-Code und Lokalzeit zurück.

**`App.tsx` setzt `data-theme="dark"|"light"` am Root-Div.** Alle Komponenten lesen Farben aus CSS Custom Properties - niemals aus einem `isDark`-Prop.

```css
:root       { --c-primary: #0b1c30;               --c-muted: #717783; ... }
[data-theme="dark"] { --c-primary: rgba(255,255,255,0.95); ... }
```

**Regel: Kein `isDark`-Prop in Komponenten. `var(--c-*)` in Inline-Styles verwenden.**

## Styling

Alle Styles sind React-Inline-Styles mit CSS-Variablen-Referenzen:
```tsx
style={{ color: 'var(--c-primary)', background: 'var(--c-card-bg)' }}
```

Glasskarten-Pattern (wird uberall verwendet):
```tsx
const glassCard: React.CSSProperties = {
  background: 'var(--c-card-bg)',
  borderRadius: 16,
  border: '1px solid var(--c-card-border)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
};
```

Dynamische Werte (Breiten, Positionen) verwenden Literal-Werte in Inline-Styles.

## CSS Token Referenz

| Variable | Light | Dark |
|---|---|---|
| `--c-primary` | `#0b1c30` | `rgba(255,255,255,0.95)` |
| `--c-muted` | `#717783` | `rgba(255,255,255,0.58)` |
| `--c-accent` | `#0060ac` | `rgba(255,255,255,0.95)` |
| `--c-card-bg` | `rgba(255,255,255,0.5)` | `rgba(255,255,255,0.13)` |
| `--c-card-border` | `rgba(255,255,255,0.6)` | `rgba(255,255,255,0.17)` |
| `--c-divider` | `rgba(0,0,0,0.12)` | `rgba(255,255,255,0.2)` |
| `--c-bar-track` | `rgba(0,0,0,0.08)` | `rgba(255,255,255,0.12)` |
| `--c-bar-fill` | `#0060ac` | `rgba(255,255,255,0.75)` |
| `--c-chevron` | `rgba(0,96,172,0.4)` | `rgba(255,255,255,0.3)` |

## Schriften

- **Inter** - Body-Text, Labels, Datenwerte
- **Outfit** - Grosse Temperaturanzeige, Screen-Titel, prominente Zahlen

Alle Zahlen: `fontVariantNumeric: 'tabular-nums'`

## Regeln

- Kein Tailwind, keine CSS Modules, keine UI-Libraries
- Kein `isDark`-Prop in Komponenten - `data-theme` am Root setzen, `var(--c-*)` lesen
- Keine hardcodierten Farben fur Primary/Muted/Accent/Card-Surfaces - alles aus Tokens
- Ausnahmen: Wetter-Icon-Farben (pro Bedingung), Niederschlagsblau (`#3b82f6`), Statusfarben (UV-Index etc.) bleiben hardcodiert - semantisch, nicht theme-abhangig
- SVG fill/stroke: `style={{ fill: 'var(--c-muted)' }}` verwenden, nicht Attributform - CSS-Variablen funktionieren nicht in Presentation Attributes
- `DayDetailScreen` und seine Karten verwenden immer Light-Mode-Farben (eigener opaker Hintergrund)
- `onPointerDown` statt `onMouseDown` fur Touch-sichere Interaktionen
- Keyframes fur Animationen sind in `index.css` definiert

## Animationen in index.css

- `animate-fade-in` - Seiteneinblendungen
- `animate-spin` - Lade-Spinner
- `animate-pulse` - Lade-Skelett
- `slide-up` - Modal-Einblendung
- `rain-fall`, `snow-drift`, `twinkle`, `sun-pulse`, `sun-ray-rotate`, `lightning-flash` - Wetteranimationen
