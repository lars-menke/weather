# DESIGN.md — Design-Dokumentation

## Philosophie

**Atmospheric Minimalism** — Die App fühlt sich an wie ein Blick durchs Fenster:  
der Hintergrund *ist* das Wetter, Inhalte schweben als Glasflächen darüber.  
Keine ablenkenden Rahmen, keine schweren Elemente — Luft, Tiefe, Bewegung.

---

## Farben

### Hintergründe (dynamisch, via `weatherTheme.ts`)

| Zustand | Gradient | isDark |
|---|---|---|
| Klarer Himmel | `#2e9ad4 → #d4e3ff` | false |
| Golden Hour | `#d86830 → #f5a84e → #d4e3ff` | false |
| Leicht bewölkt | `#5090bc → #c8e0f4` | false |
| Bedeckt | `#6e8898 → #bcccd8` | **true** |
| Nebel | `#8298a8 → #c8d8e2` | **true** |
| Nieselregen | `#527890 → #a4c0d0` | **true** |
| Regen / Schauer | `#3e6278 → #8aaec4` | **true** |
| Schnee | `#a8cce4 → #e4f2fc` | false |
| Gewitter | `#252e38 → #3e5060` | **true** |
| Nacht (klar) | `#152030 → #2a4060` | **true** |
| Nacht (Regen) | `#0d1c2e → #1e3045` | **true** |
| Nacht (Schnee) | `#1a2a44 → #2e4460` | **true** |

### Semantische Farben

| Token | Wert | Verwendung |
|---|---|---|
| Akzent (hell) | `#0060ac` | Links, Temperatur, Icons |
| Akzent (dunkel) | `#ffffff` | Texte auf dunklem Hintergrund |
| Primärtext hell | `#0b1c30` | Haupttext auf hellem BG |
| Muted hell | `#717783` | Labels, Metadaten |
| Muted dunkel | `rgba(255,255,255,0.6)` | Labels auf dunklem BG |
| Regen / Precip | `#3b82f6` | Niederschlagsangaben |
| Sonne | `#f59e0b` | Sonnen-Icon, Sonnenauf/-untergang |
| Warnung minor | `#f59e0b` | DWD-Warnlevel Warnung |
| Warnung moderate | `#f97316` | DWD-Warnlevel Markant |
| Warnung severe | `#ef4444` | DWD-Warnlevel Unwetter |
| Warnung extreme | `#a855f7` | DWD-Warnlevel Extrem |
| Changelog-Akzent | `#6366f1` | Versions-Badges, Changelog-Icons |

---

## Typografie

| Schriftart | Verwendung |
|---|---|
| **Outfit** (300–700) | Große Zahlen (Temperatur), Überschriften, Tagesnamen |
| **Inter** (400–700) | Alle UI-Labels, Beschreibungen, Metadaten |

### Größenhierarchie
- **112px / Outfit 300** — Haupttemperatur
- **44px / Outfit 300** — Temperatureinheit
- **28–36px / Outfit 600–700** — Seitenüberschriften
- **22px / Outfit 500** — Wetterbeschreibung, Tagestemperatur
- **17–18px / Outfit 500** — Tagesnamen in Forecast
- **15px / Inter 400** — Standardtext
- **13px / Inter 400** — Sekundärtext, Metadaten
- **11px / Inter 600 uppercase** — Section-Labels (0.1em letter-spacing)

---

## Glassmorphismus

Alle Karten-Elemente verwenden semi-transparente Glasflächen:

```css
/* Standard */
background: rgba(255,255,255,0.45);
backdrop-filter: blur(12px);
border: 1px solid rgba(255,255,255,0.55);

/* Elevated (hell) */
background: rgba(255,255,255,0.5);
backdrop-filter: blur(16px);
border: 1px solid rgba(255,255,255,0.6);

/* Auf dunklem Hintergrund */
background: rgba(255,255,255,0.14);
backdrop-filter: blur(16px);
border: 1px solid rgba(255,255,255,0.18);
```

Border-Radius: **16px** für Karten, **12px** für kleinere Elemente, **22px** für runde Buttons.

---

## Icons

**Material Symbols Outlined** (Google Fonts, variable font).  
Standard: `font-variation-settings: 'FILL' 0, 'wght' 400` — Klasse `.material-symbols-outlined`  
Gefüllt: `'FILL' 1` — zusätzliche Klasse `.mat-fill`

Standardgröße: 22px. Inline via `style={{ fontSize: Xpx }}` überschreiben.

---

## Layout & Navigation

- **4 Tabs** (TabBar unten, 60px hoch): Dashboard, Vorhersage, Radar, Einstellungen
- **Kein Header** — Favoritenstern (links) und Suchfeld (rechts) schweben absolut oben
- `padding-top: env(safe-area-inset-top)` für iPhone-Notch / Dynamic Island
- `padding-bottom: env(safe-area-inset-bottom)` für Home-Indicator
- Scrollbarer Hauptbereich: `padding: 68px 20px 20px`
- Bento-Grid für Detailkarten: `grid-template-columns: 1fr 1fr`, Gap 12px

---

## Animationen

### Hintergrund-Partikel (`WeatherAnimation.tsx`)
Laufen als absolut positionierte, pointer-events-freie Overlay-Schicht.

| Keyframe | Beschreibung |
|---|---|
| `rain-fall` | Schräg fallende Regentropfen, 8° geneigt |
| `snow-drift` | Langsam driftende Schneeflocken mit seitlicher Bewegung |
| `twinkle` | Sterne blinken mit Opacity und Scale |
| `sun-pulse` | Sonnenglühen pulsiert (Opacity + Scale) |
| `sun-ray-rotate` | Sonnenstrahlen rotieren kontinuierlich |

### Icon-Animationen (`index.css`)
| Keyframe | Beschreibung |
|---|---|
| `sun-icon-spin` | Sonnen-Icon dreht sich in 22s (linear, infinite) |
| `sun-icon-glow` | `drop-shadow` pulsiert in 3s |
| `.sun-animate` | Kombiniert beide — auf `wb_sunny`-Icons bei Code 0/1 |

### Screen-Übergänge
| Keyframe | Beschreibung |
|---|---|
| `fade-in` | Seiten blenden mit `translateY(10px)` ein (`.animate-fade-in`) |
| `slide-up` | DayDetailScreen schiebt von unten hoch |
| `splash-pop` | Splash-Icon federt mit `scale(0.72 → 1)` auf |
| `splash-text-in` | Splash-Texte gleiten mit `translateY(8px → 0)` ein |

`prefers-reduced-motion: reduce` → alle Dauern auf 0.01ms, kein flackern.

---

## Splash Screen

- Hintergrund: `linear-gradient(180deg, #d4e3ff, #f8f9ff)`
- Icon `wb_sunny` 80px in `#f59e0b`, federt ein, dreht und glüht danach
- Titel „Weather" in Outfit 600 36px `#0060ac`
- Untertitel „Dein persönliches Wetter" in Inter 15px `#717783`
- Sichtbar: 2,0s → fade-out 0,4s → unmount bei 2,4s
- Implementierung via `useLayoutEffect` (Initialzustand vor Paint) + `useEffect []` (läuft einmal)

---

## Responsive & PWA

- Ausschließlich mobil optimiert (max-width wird nicht eingeschränkt, aber Layout ist für ~375–430px ausgelegt)
- PWA-Manifest: `name: "Weather"`, `display: standalone`, `theme_color: #d4e3ff`
- Service Worker: Workbox `generateSW`, `skipWaiting: true`, `clientsClaim: true`
- iOS-spezifisch: `apple-touch-icon`, `apple-mobile-web-app-capable`, safe-area-insets
