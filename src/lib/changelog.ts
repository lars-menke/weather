export interface ChangelogEntry {
  version: string;
  date: string;
  items: { icon: string; text: string }[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '1.5',
    date: '21. Mai 2026',
    items: [
      { icon: 'schedule', text: 'Stündliche Vorhersage springt automatisch zur aktuellen Uhrzeit' },
      { icon: 'highlight', text: 'Aktuelle Stunde ist farblich hervorgehoben' },
    ],
  },
  {
    version: '1.4',
    date: '20. Mai 2026',
    items: [
      { icon: 'wb_sunny', text: 'Animiertes Sonnen-Icon auf Dashboard, Splash und Tagesdetail' },
      { icon: 'cloud', text: 'Wettersymbol im Dashboard-Hero zeigt aktuellen Zustand' },
      { icon: 'smartphone', text: 'Splash-Screen mit sanfter Einblend-Animation' },
    ],
  },
  {
    version: '1.3',
    date: '20. Mai 2026',
    items: [
      { icon: 'thunderstorm', text: 'DWD-Unwetterwarnungen direkt im Dashboard' },
      { icon: 'radar', text: 'Radar-Vorschau als Kachel auf dem Dashboard' },
      { icon: 'water_drop', text: 'Niederschlagsmenge und -wahrscheinlichkeit in der stündlichen Vorhersage' },
      { icon: 'contrast', text: 'Bessere Lesbarkeit bei Regen, Nebel und bedecktem Himmel' },
    ],
  },
  {
    version: '1.2',
    date: '20. Mai 2026',
    items: [
      { icon: 'star', text: 'Favoritenorte speichern und schnell wechseln' },
      { icon: 'my_location', text: 'GPS-Standorterkennung' },
      { icon: 'history', text: 'Letzter Standort wird beim nächsten Start gemerkt' },
      { icon: 'animation', text: 'Wetter-Animationen: Regen, Schnee, Sterne und Sonne' },
    ],
  },
  {
    version: '1.1',
    date: '19. Mai 2026',
    items: [
      { icon: 'radar', text: 'Interaktive Radarkarte mit Niederschlagsfilm' },
      { icon: 'calendar_today', text: 'Tagesdetailansicht mit stündlicher Vorhersage und UV-Index' },
      { icon: 'wb_twilight', text: 'Sonnenauf- und -untergang mit Tagesverlauf-Grafik' },
      { icon: 'palette', text: 'Dynamischer Hintergrund passend zum aktuellen Wetter' },
    ],
  },
  {
    version: '1.0',
    date: '19. Mai 2026',
    items: [
      { icon: 'cloud', text: 'Aktuelles Wetter, Temperatur, Wind und Luftfeuchtigkeit' },
      { icon: 'date_range', text: '7-Tage-Vorhersage' },
      { icon: 'settings', text: 'Einheiten wählbar: °C/°F und km/h/mph' },
      { icon: 'install_mobile', text: 'Installierbar als PWA auf dem Homescreen' },
    ],
  },
];

export const APP_VERSION = CHANGELOG[0].version;
