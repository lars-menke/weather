# Changelog

Alle relevanten Änderungen an der App, gegliedert nach Version.

---

## v2.2 — 12. Juni 2026

- CSS-Design-Token-System: Farben via CSS Custom Properties (`--c-primary`, `--c-muted`, etc.), kein isDark-Ternär mehr in Komponenten
- Frosch-Kachel barrierefreiheits-konform: `role="button"`, `tabIndex`, Tastaturnavigation
- Pull-to-Refresh: nach unten ziehen lädt Wetterdaten neu
- Sonne im Tagesverlauf anklicken zeigt aktuelle Uhrzeit als Tooltip
- Temperatur-Sparkline über der stündlichen Vorhersage
- Frosch-Bilder auf WebP umgestellt (~40% kleinere Dateigröße)
- Frosch im Splash-Screen größer (300px) und mit Drop-Shadow
- App auf max. 430px Breite begrenzt, zentriert auf Desktop
- Touch-Targets auf mindestens 44px angehoben (iOS HIG)

## v2.1 — 4. Juni 2026

- Zuletzt-aktualisiert-Zeitstempel im Dashboard-Hero
- Warnungs-Header zeigt Anzahl aktiver Meldungen mit rotem Badge
- Section-Header mit Icons statt reiner Uppercase-Typografie
- Frosch-Kachel zeigt Wetterlaune als Text (Sonnig, Regen …)
- Retry-Button im Fehlerbanner lädt Daten sofort neu
- Glass-Token konsolidiert: makeGlass() als zentrale Quelle

## v2.0 — 4. Juni 2026

- Sechs neue Frosch-Illustrationen – inkl. Schnee-Frosch und Logo
- Schneewetter wird jetzt separat erkannt und mit eigenem Frosch dargestellt
- Frosch-Kachel ohne Leiter – der Frosch steht direkt im Tile
- Nicht verwendete Assets entfernt, Repo aufgeräumt

## v1.9 — 3. Juni 2026

- Alle Grafiken durch korrigierte, vollständig transparente Versionen ersetzt
- Leiter als PNG-Illustration mit Pflanzen am Sockel
- Frog-Positionen pixelgenau auf die Leitersprossен kalibriert

## v1.8 — 3. Juni 2026

- Vier neue Frosch-Illustrationen (Sonnenbrille / freundlich / bewölkt / Regen) mit transparentem Hintergrund
- Pflanzen am Fuß der Leiter
- Frosch-Kachel im verbesserten Glasmorphismus-Stil
- PWA-Icons aus der neuen Sonnen-Illustration generiert

## v1.7 — 1. Juni 2026

- App umbenannt in **FrogWeather** – Der Wetterfrosch fürs iPhone (Titel, PWA-Manifest, Splash)
- Frosch und Sonne gemeinsam im Splash Screen
- Sonnenkachel zeigt Goldene Stunde (Morgen/Abend) und aktuellen UV-Index
- Frosch-Kachel und Wettersymbol starten mit Einflug-Animation
- DWD-Warnungen vollständig auf- und zuklappbar (ab 120 Zeichen)
- Reihenfolge im Bento-Grid: Frosch zuerst, Sonne danach

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
