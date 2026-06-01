# Changelog

Alle relevanten Änderungen an der App, gegliedert nach Version.

---

## v1.6 — 1. Juni 2026

- Wetterfrosch: vier eigene Illustrationen (Sonnenbrille / freundlich / bewölkt / Regen) zeigen die aktuelle Wetterlage auf einer Holzleiter
- Frosch-Kachel im Glas-Stil neben dem Sonnenverlauf im Bento-Grid
- Leiter mit Bodenelement, kein Rung-Highlight

---

## v1.5 — 21. Mai 2026

- Stündliche Vorhersage springt automatisch zur aktuellen Uhrzeit (`scrollIntoView`)
- Aktuelle Stunde ist farblich hervorgehoben („Jetzt"-Label, blauer Hintergrund)

## v1.4 — 20. Mai 2026

- Animiertes Sonnen-Icon auf Dashboard, Splash-Screen und Tagesdetailansicht
- Wettersymbol im Dashboard-Hero zeigt den aktuellen Wetterzustand
- Splash-Screen mit sanfter Einblend- und Pop-Animation (DOM-Transition via `useLayoutEffect`)

## v1.3 — 20. Mai 2026

- DWD-Unwetterwarnungen via Bright Sky API direkt im Dashboard
- Radar-Vorschau als Kachel auf dem Dashboard (RainViewer, letzten 8 Frames)
- Niederschlagsmenge (mm) und -wahrscheinlichkeit (%) gemeinsam in der stündlichen Vorhersage
- Bessere Lesbarkeit bei dunklen Wetterlagen: Regen, Nieselregen, Nebel und bedeckter Himmel erhalten `isDark: true`

## v1.2 — 20. Mai 2026

- Favoritenorte speichern und per Dropdown schnell wechseln
- GPS-Standorterkennung via `navigator.geolocation`
- Letzter Standort wird in `localStorage` gespeichert und beim nächsten Start geladen
- Wetter-Animationen im Hintergrund: Regen, Schnee, Sterne, Sonnenglühen

## v1.1 — 19. Mai 2026

- Interaktive Radarkarte mit animiertem Niederschlagsfilm (Leaflet + RainViewer)
- Tagesdetailansicht mit stündlicher Vorhersage, UV-Index, Wind, Luftdruck und Sichtweite
- Sonnenauf- und -untergang mit SVG-Tagesverlauf-Grafik
- Dynamischer Hintergrund passend zum Wetterzustand und Tageszeit (golden hour, Nacht, Regen …)

## v1.0 — 19. Mai 2026

- Erstes Release: aktuelles Wetter, Temperatur, Wind, Luftfeuchtigkeit
- 7-Tage-Vorhersage
- Einstellungen: Temperatureinheit (°C / °F) und Windeinheit (km/h / mph)
- Installierbar als PWA auf dem Homescreen (iOS & Android)
- GitHub Pages Deployment via GitHub Actions
