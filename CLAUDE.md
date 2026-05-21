# CLAUDE.md — Projektkontext für Claude Code

## Überblick

Progressive Web App (PWA) für Wetterdaten, optimiert für den iPhone-Homescreen.  
Stack: **React 19 + Vite 8 + TypeScript 6**, Styling via Inline-Styles und globales CSS.

## Befehle

```bash
npm run dev      # Entwicklungsserver (http://localhost:5173)
npm run build    # TypeScript-Check + Vite-Build → dist/
npm run lint     # ESLint
npm run preview  # Vorschau des Build-Outputs
```

## Deployment

Push auf `main` triggert GitHub Actions (`.github/workflows/deploy.yml`) und deployt nach **GitHub Pages**.  
Service Worker mit `skipWaiting: true` und `clientsClaim: true` — neue Versionen werden sofort aktiviert.

## Projektstruktur

```
src/
  api/          weather.ts         Open-Meteo + Bright Sky API-Aufrufe
  components/   AlertBanner        DWD-Warnbanner
                RadarTile          Kompakte Radar-Kachel (Leaflet)
                SearchBar          Stadtsuche + GPS + Favoriten-Dropdown
                SplashScreen       Einblend-Animation beim Start
                TabBar             Untere Navigationsleiste (4 Tabs)
                WeatherAnimation   Hintergrund-Partikel (Regen, Schnee, Sterne, Sonne)
                WeatherIcon        WMO-Code → Beschreibung
  lib/          changelog.ts       Versionsdaten für die In-App-Anzeige
                weatherCodes.ts    WMO-Code → Material-Symbol-Icon + Farbe
                weatherTheme.ts    WMO-Code + Tageszeit → Hintergrundgradient + isDark
  pages/        Dashboard          Hauptansicht mit Hero, stündl. Vorhersage, Radar, Warnungen
                DayDetailScreen    Tagesdetail (modal, slide-up)
                ForecastPage       7-Tage-Liste → öffnet DayDetailScreen
                RadarScreen        Vollbild-Radarkarte
                SettingsScreen     Einheiten, Datenquellen, Changelog
  types/        weather.ts         TypeScript-Interfaces für API-Responses
```

## Wichtige Konventionen

### Styling
- **Kein CSS-Modul-System** — ausschließlich Inline-Styles (`style={{...}}`) und globales `index.css`
- Tailwind ist eingebunden, wird aber kaum genutzt — Inline-Styles bevorzugen
- Glassmorphismus-Klassen: `.glass-card`, `.glass-card-elevated`, `.glass-header` in `index.css`
- Icons: **Material Symbols Outlined** (Font), Klasse `.material-symbols-outlined`, filled via `.mat-fill`

### isDark-Pattern
`weatherTheme.ts` gibt `{ background, isDark, isNight }` zurück.  
`isDark` fließt als Prop von `App` durch alle Komponenten: `Dashboard`, `ForecastPage`, `SettingsScreen`, `SearchBar`.  
Faustregel: Regen, Nieselregen, Nebel, Bedeckt, Nacht und Gewitter → `isDark: true`.

### API
- **Wetterdaten**: `https://api.open-meteo.com/v1/forecast` (kein API-Key)
- **Geocoding**: `https://geocoding-api.open-meteo.com/v1/search` (kein API-Key)
- **Unwetterwarnungen**: `https://api.brightsky.dev/alerts` (DWD-Daten, CORS-freundlich, kein Key)
- **Radar**: RainViewer API via Leaflet-Tile-Layer in `RadarTile.tsx` und `RadarScreen.tsx`

### State & Persistenz
`localStorage`-Keys: `lastLocation`, `favorites`, `tempUnit`, `windUnit`

### Animations
CSS-Keyframes in `index.css`: `rain-fall`, `snow-drift`, `twinkle`, `sun-pulse`, `sun-ray-rotate`, `sun-icon-spin`, `sun-icon-glow`, `splash-pop`, `splash-text-in`.  
`prefers-reduced-motion: reduce` setzt alle Animationsdauern via `!important` auf 0.01ms.

### Changelog pflegen
Neue Version in `src/lib/changelog.ts` oben einfügen und `APP_VERSION` anpassen.  
Parallel `CHANGELOG.md` im Root aktualisieren.
