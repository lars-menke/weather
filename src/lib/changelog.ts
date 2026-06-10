export interface ChangelogEntry {
  version: string;
  date: string;
  items: { icon: string; text: string }[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '2.1',
    date: '4. Juni 2026',
    items: [
      { icon: 'sync',              text: 'Zuletzt-aktualisiert-Zeitstempel im Dashboard-Hero' },
      { icon: 'warning',           text: 'Warnungs-Header zeigt Anzahl aktiver Meldungen mit rotem Badge' },
      { icon: 'schedule',          text: 'Section-Header mit Icons statt reiner Uppercase-Typografie' },
      { icon: 'cruelty_free',      text: 'Frosch-Kachel zeigt Wetterlaune als Text (Sonnig, Regen …)' },
      { icon: 'refresh',           text: 'Retry-Button im Fehlerbanner lädt Daten sofort neu' },
      { icon: 'tune',              text: 'Glass-Token konsolidiert: makeGlass() als zentrale Quelle' },
    ],
  },
  {
    version: '2.0',
    date: '4. Juni 2026',
    items: [
      { icon: 'cruelty_free',  text: 'Sechs neue Frosch-Illustrationen – inkl. Schnee-Frosch und Logo' },
      { icon: 'ac_unit',       text: 'Schneewetter wird jetzt separat erkannt und mit eigenem Frosch dargestellt' },
      { icon: 'grid_view',     text: 'Frosch-Kachel ohne Leiter – der Frosch steht direkt im Tile' },
      { icon: 'auto_fix_high', text: 'Nicht verwendete Assets entfernt, Repo aufgeräumt' },
    ],
  },
  {
    version: '1.9',
    date: '3. Juni 2026',
    items: [
      { icon: 'cruelty_free', text: 'Alle Grafiken durch korrigierte, vollständig transparente Versionen ersetzt' },
      { icon: 'stairs',       text: 'Leiter jetzt als PNG-Illustration mit Pflanzen am Sockel' },
      { icon: 'tune',         text: 'Frog-Positionen pixelgenau auf die Leitersprossен kalibriert' },
    ],
  },
  {
    version: '1.8',
    date: '3. Juni 2026',
    items: [
      { icon: 'cruelty_free', text: 'Vier neue Frosch-Illustrationen mit transparentem Hintergrund' },
      { icon: 'local_florist', text: 'Pflanzen am Fuß der Leiter' },
      { icon: 'water_drop',   text: 'Frosch-Kachel im verbesserten Glasmorphismus-Stil' },
      { icon: 'apps',         text: 'PWA-Icons aus der neuen Sonnen-Illustration generiert' },
    ],
  },
  {
    version: '1.7',
    date: '1. Juni 2026',
    items: [
      { icon: 'badge',        text: 'App heißt jetzt FrogWeather – Der Wetterfrosch fürs iPhone' },
      { icon: 'cruelty_free', text: 'Frosch und Sonne gemeinsam im Splash Screen' },
      { icon: 'wb_twilight',  text: 'Sonnenkachel zeigt Goldene Stunde und UV-Index' },
      { icon: 'animation',    text: 'Frosch und Wettersymbol mit Einflug-Animation' },
      { icon: 'expand_more',  text: 'DWD-Warnungen vollständig auf- und zuklappbar' },
    ],
  },
  {
    version: '1.6',
    date: '1. Juni 2026',
    items: [
      { icon: 'cruelty_free', text: 'Wetterfrosch: vier eigene Illustrationen zeigen die Wetterlage auf einer Leiter' },
      { icon: 'view_quilt',   text: 'Frosch-Kachel im Glas-Stil neben dem Sonnenverlauf' },
    ],
  },
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
      { icon: 'water_drop', text: 'Niederschlagsmenge und -wahrscheinlichkeit stündlich' },
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
