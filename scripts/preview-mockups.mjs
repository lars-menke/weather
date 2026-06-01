import sharp from 'sharp';
import fs from 'fs';

const OUT = '/home/user/weather/scripts';
const FROG_DIR = '/home/user/weather/src/assets/frog';

// Resize helper
async function resizeFrog(file, size) {
  return sharp(file)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

// ─────────────────────────────────────────────
// MOCKUP 1 — Splash Screen
// ─────────────────────────────────────────────
const splashSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="390" height="480" viewBox="0 0 390 480">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#d4e3ff"/>
      <stop offset="100%" stop-color="#f8f9ff"/>
    </linearGradient>
  </defs>
  <rect width="390" height="480" fill="url(#bg)"/>

  <!-- Sun (right side of pair) -->
  <g transform="translate(245,195)">
    <line x1="0" y1="-52" x2="0" y2="-42" stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/>
    <line x1="37" y1="-37" x2="30" y2="-30" stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/>
    <line x1="52" y1="0" x2="42" y2="0"  stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/>
    <line x1="37" y1="37" x2="30" y2="30" stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/>
    <line x1="0" y1="52" x2="0" y2="42"   stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/>
    <line x1="-37" y1="37" x2="-30" y2="30" stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/>
    <line x1="-52" y1="0" x2="-42" y2="0"  stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/>
    <line x1="-37" y1="-37" x2="-30" y2="-30" stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/>
    <circle r="34" fill="#f59e0b"/>
    <circle r="34" fill="none" stroke="rgba(245,200,50,0.3)" stroke-width="10"/>
  </g>

  <!-- Title -->
  <text x="195" y="298" text-anchor="middle"
        font-family="Outfit,sans-serif" font-size="40" font-weight="600"
        fill="#0060ac" letter-spacing="-1">FrogWeather</text>

  <!-- Subtitle -->
  <text x="195" y="326" text-anchor="middle"
        font-family="Inter,sans-serif" font-size="15"
        fill="#717783">Der Wetterfrosch fürs iPhone</text>

  <!-- Label: frog placeholder box (frog image composited separately) -->
</svg>`;

const frog90 = await resizeFrog(`${FROG_DIR}/frosch_02_freundlich.png`, 92);

await sharp(Buffer.from(splashSvg), { density: 192 })
  .composite([{ input: frog90, top: 148, left: 108 }])
  .png()
  .toFile(`${OUT}/preview-01-splash.png`);
console.log('preview-01-splash.png ✓');


// ─────────────────────────────────────────────
// MOCKUP 2 — Verbesserter SunArc (halbe Karte)
// ─────────────────────────────────────────────
const sunArcSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="390" height="340" viewBox="0 0 390 340">
  <defs>
    <linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#5090bc"/>
      <stop offset="100%" stop-color="#c8e0f4"/>
    </linearGradient>
  </defs>
  <rect width="390" height="340" fill="url(#bg2)"/>

  <!-- Section label -->
  <text x="20" y="28" font-family="Inter,sans-serif" font-size="11" font-weight="700"
        fill="rgba(255,255,255,0.6)" letter-spacing="1.5">BENTO GRID — NEUE AUFTEILUNG</text>

  <!-- ── FROSCH-KACHEL (links) ── -->
  <!-- Glas-Jar Card -->
  <rect x="16" y="42" width="163" height="260" rx="14"
        fill="rgba(185,225,255,0.32)" stroke="rgba(165,210,255,0.60)" stroke-width="2"/>
  <!-- Reflexlinie -->
  <rect x="25" y="58" width="3" height="228" rx="1.5"
        fill="url(#refl)"/>
  <defs>
    <linearGradient id="refl" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.5)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.02)"/>
    </linearGradient>
    <linearGradient id="rail" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#7a4e1e"/>
      <stop offset="50%"  stop-color="#e09a48"/>
      <stop offset="100%" stop-color="#8b5a22"/>
    </linearGradient>
    <linearGradient id="rungG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#e09a48"/>
      <stop offset="100%" stop-color="#8b5a22"/>
    </linearGradient>
    <!-- Sun arc gradient for right card -->
    <linearGradient id="arcfill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.55)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.42)"/>
    </linearGradient>
  </defs>
  <!-- Leiter -->
  <rect x="86" y="68" width="8" height="180" rx="4" fill="url(#rail)"/>
  <rect x="115" y="68" width="8" height="180" rx="4" fill="url(#rail)"/>
  <rect x="86" y="78" width="37" height="7" rx="3.5" fill="url(#rungG)"/>
  <rect x="86" y="107" width="37" height="7" rx="3.5" fill="url(#rungG)"/>
  <rect x="86" y="136" width="37" height="7" rx="3.5" fill="url(#rungG)"/>
  <rect x="86" y="165" width="37" height="7" rx="3.5" fill="url(#rungG)"/>
  <!-- Boden -->
  <ellipse cx="105" cy="253" rx="24" ry="5" fill="rgba(90,62,28,0.4)"/>
  <!-- Frosch Placeholder -->
  <text x="105" y="122" text-anchor="middle" font-family="Inter,sans-serif" font-size="9"
        fill="rgba(0,0,0,0.3)">(Frosch)</text>

  <!-- ── SONNENVERLAUF-KACHEL (rechts) — VERBESSERT ── -->
  <rect x="211" y="42" width="163" height="260" rx="14"
        fill="rgba(255,255,255,0.50)" stroke="rgba(255,255,255,0.60)" stroke-width="1.5"/>

  <!-- Arc SVG (kleiner, zentriert oben) -->
  <!-- Horizon -->
  <line x1="222" y1="165" x2="363" y2="165" stroke="rgba(0,0,0,0.08)" stroke-width="1"/>
  <!-- Arc track -->
  <path d="M 226,165 A 66,66 0 0 1 358,165" fill="none" stroke="rgba(0,0,0,0.07)" stroke-width="2"/>
  <!-- Progress arc (ca. 60% des Tages) -->
  <path d="M 226,165 A 66,66 0 0 1 323,109" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>
  <!-- Sun dot -->
  <circle cx="323" cy="109" r="7" fill="#f59e0b"/>

  <!-- Sunrise/Sunset Zeiten — ZWEISPALTIG -->
  <text x="234" y="186" font-family="Inter,sans-serif" font-size="10" fill="#717783">🌅</text>
  <text x="248" y="186" font-family="Inter,sans-serif" font-size="13" font-weight="600"
        fill="#0b1c30">06:15</text>

  <text x="327" y="186" font-family="Inter,sans-serif" font-size="10" fill="#717783">🌇</text>
  <text x="341" y="186" font-family="Inter,sans-serif" font-size="13" font-weight="600"
        fill="#0b1c30">21:32</text>

  <!-- Divider -->
  <line x1="234" y1="194" x2="362" y2="194" stroke="rgba(0,0,0,0.07)" stroke-width="1"/>

  <!-- Tageslicht -->
  <text x="292" y="213" text-anchor="middle"
        font-family="Inter,sans-serif" font-size="12" font-weight="600" fill="#0b1c30">15h 17min</text>
  <text x="292" y="228" text-anchor="middle"
        font-family="Inter,sans-serif" font-size="10" fill="#717783">Tageslicht</text>

  <!-- Golden/blaue Stunden (extra Infos zum Füllen) -->
  <rect x="224" y="242" width="142" height="1" fill="rgba(0,0,0,0.07)"/>
  <text x="234" y="258" font-family="Inter,sans-serif" font-size="10" fill="#717783">Goldene Stunde</text>
  <text x="362" y="258" text-anchor="end" font-family="Inter,sans-serif" font-size="10"
        font-weight="600" fill="#f59e0b">21:05 – 21:32</text>
  <text x="234" y="276" font-family="Inter,sans-serif" font-size="10" fill="#717783">UV-Index</text>
  <text x="362" y="276" text-anchor="end" font-family="Inter,sans-serif" font-size="10"
        font-weight="600" fill="#ef4444">6 · Hoch</text>

  <!-- Frosch label -->
  <text x="97" y="322" text-anchor="middle" font-family="Inter,sans-serif" font-size="10"
        fill="rgba(255,255,255,0.6)" letter-spacing="1">FROSCH</text>
  <text x="292" y="322" text-anchor="middle" font-family="Inter,sans-serif" font-size="10"
        fill="#717783" letter-spacing="1">SONNE</text>
</svg>`;

const frog54 = await resizeFrog(`${FROG_DIR}/frosch_02_freundlich.png`, 54);

await sharp(Buffer.from(sunArcSvg), { density: 192 })
  .composite([{ input: frog54, top: 78, left: 78 }])
  .png()
  .toFile(`${OUT}/preview-02-bento.png`);
console.log('preview-02-bento.png ✓');


// ─────────────────────────────────────────────
// MOCKUP 3 — DWD Alert Banner (expand/collapse)
// ─────────────────────────────────────────────
const alertSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="390" height="420" viewBox="0 0 390 420">
  <defs>
    <linearGradient id="bgAlert" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#d4e3ff"/>
      <stop offset="100%" stop-color="#f8f9ff"/>
    </linearGradient>
  </defs>
  <rect width="390" height="420" fill="url(#bgAlert)"/>

  <text x="20" y="28" font-family="Inter,sans-serif" font-size="11" font-weight="700"
        fill="#717783" letter-spacing="1.5">DWD WARNUNGEN</text>

  <!-- ── COLLAPSED (vorher) ── -->
  <text x="20" y="52" font-family="Inter,sans-serif" font-size="10" fill="#aaa">VORHER — zusammengefasst</text>
  <rect x="16" y="60" width="358" height="68" rx="12"
        fill="rgba(239,68,68,0.12)" stroke="rgba(239,68,68,0.4)" stroke-width="1.5"/>
  <!-- Icon -->
  <circle cx="46" cy="94" r="14" fill="rgba(239,68,68,0.15)"/>
  <text x="46" y="99" text-anchor="middle" font-family="Inter,sans-serif" font-size="16" fill="#ef4444">⚡</text>
  <!-- Text -->
  <text x="70" y="82" font-family="Inter,sans-serif" font-size="13" font-weight="700" fill="#ef4444">Unwetterwarnung vor Gewitter</text>
  <text x="70" y="98" font-family="Inter,sans-serif" font-size="11" fill="#374151">Gewitter mit Starkregen, Hagel bis 3 cm und Sturmb...</text>
  <text x="70" y="114" font-family="Inter,sans-serif" font-size="10" fill="#9ca3af">Mo., 2. Jun · 14:00 – 22:00 Uhr</text>
  <!-- Expand hint -->
  <text x="358" y="114" text-anchor="end" font-family="Inter,sans-serif" font-size="10"
        fill="#ef4444">Mehr ▼</text>

  <!-- ── EXPANDED (nachher) ── -->
  <text x="20" y="152" font-family="Inter,sans-serif" font-size="10" fill="#aaa">NACHHER — vollständig ausgeklappt</text>
  <rect x="16" y="160" width="358" height="236" rx="12"
        fill="rgba(239,68,68,0.12)" stroke="rgba(239,68,68,0.4)" stroke-width="1.5"/>

  <!-- Icon -->
  <circle cx="46" cy="188" r="14" fill="rgba(239,68,68,0.15)"/>
  <text x="46" y="193" text-anchor="middle" font-family="Inter,sans-serif" font-size="16" fill="#ef4444">⚡</text>

  <!-- Headline -->
  <text x="70" y="178" font-family="Inter,sans-serif" font-size="13" font-weight="700" fill="#ef4444">Unwetterwarnung vor Gewitter</text>
  <text x="70" y="194" font-family="Inter,sans-serif" font-size="11" font-weight="600" fill="#6b7280">Amtliche Warnung des DWD</text>

  <!-- Divider -->
  <line x1="70" y1="202" x2="362" y2="202" stroke="rgba(239,68,68,0.2)" stroke-width="1"/>

  <!-- Description -->
  <text x="70" y="218" font-family="Inter,sans-serif" font-size="12" fill="#1f2937">Es treten Gewitter mit Starkregen zwischen</text>
  <text x="70" y="233" font-family="Inter,sans-serif" font-size="12" fill="#1f2937">25 l/m² und 40 l/m² in kurzer Zeit auf. Hagel</text>
  <text x="70" y="248" font-family="Inter,sans-serif" font-size="12" fill="#1f2937">bis 3 cm Durchmesser und Sturmböen bis</text>
  <text x="70" y="263" font-family="Inter,sans-serif" font-size="12" fill="#1f2937">90 km/h sind möglich.</text>

  <!-- Instruction (italic style) -->
  <text x="70" y="282" font-family="Inter,sans-serif" font-size="11" fill="#4b5563" font-style="italic">Empfehlung: Suchen Sie ein festes Gebäude auf.</text>
  <text x="70" y="296" font-family="Inter,sans-serif" font-size="11" fill="#4b5563" font-style="italic">Halten Sie sich von Bäumen und Gewässern fern.</text>

  <!-- Divider -->
  <line x1="70" y1="306" x2="362" y2="306" stroke="rgba(239,68,68,0.15)" stroke-width="1"/>

  <!-- Time range -->
  <text x="70" y="323" font-family="Inter,sans-serif" font-size="11" fill="#9ca3af">Mo., 2. Jun · 14:00 Uhr</text>
  <text x="195" y="323" text-anchor="middle" font-family="Inter,sans-serif" font-size="11" fill="#9ca3af">→</text>
  <text x="362" y="323" text-anchor="end" font-family="Inter,sans-serif" font-size="11" fill="#9ca3af">22:00 Uhr</text>

  <!-- Collapse button -->
  <text x="362" y="382" text-anchor="end" font-family="Inter,sans-serif" font-size="11"
        fill="#ef4444">Weniger ▲</text>
</svg>`;

await sharp(Buffer.from(alertSvg), { density: 192 })
  .png()
  .toFile(`${OUT}/preview-03-alert.png`);
console.log('preview-03-alert.png ✓');

console.log('\nAlle Mockups erstellt.');
