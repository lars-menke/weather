import sharp from 'sharp';
import fs from 'fs';

const OUT = '/home/user/weather/scripts';
const FROG_DIR = '/home/user/weather/src/assets/frog';

async function resizeFrog(file, size) {
  return sharp(file)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

// ─────────────────────────────────────────────
// MOCKUP 1 — Splash Screen
// ─────────────────────────────────────────────
// Frog composited at left=90, top=138 (100x100px)
// Sun drawn in SVG centered at x=268, y=188
const splashSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="390" height="480" viewBox="0 0 390 480">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#d4e3ff"/>
      <stop offset="100%" stop-color="#f8f9ff"/>
    </linearGradient>
  </defs>
  <rect width="390" height="480" fill="url(#bg)"/>

  <!-- Sun — 8 rounded rays + filled circle -->
  <g transform="translate(268,188)">
    <rect x="-5" y="-54" width="10" height="16" rx="5" fill="#f59e0b"/>
    <rect x="-5" y="-54" width="10" height="16" rx="5" fill="#f59e0b" transform="rotate(45)"/>
    <rect x="-5" y="-54" width="10" height="16" rx="5" fill="#f59e0b" transform="rotate(90)"/>
    <rect x="-5" y="-54" width="10" height="16" rx="5" fill="#f59e0b" transform="rotate(135)"/>
    <rect x="-5" y="-54" width="10" height="16" rx="5" fill="#f59e0b" transform="rotate(180)"/>
    <rect x="-5" y="-54" width="10" height="16" rx="5" fill="#f59e0b" transform="rotate(225)"/>
    <rect x="-5" y="-54" width="10" height="16" rx="5" fill="#f59e0b" transform="rotate(270)"/>
    <rect x="-5" y="-54" width="10" height="16" rx="5" fill="#f59e0b" transform="rotate(315)"/>
    <circle r="34" fill="#f59e0b"/>
    <circle cx="-9" cy="-9" r="11" fill="rgba(255,255,255,0.18)"/>
  </g>

  <!-- "+" Verbindung zwischen Frosch und Sonne -->
  <text x="195" y="196" text-anchor="middle"
        font-family="Arial,sans-serif" font-size="28" font-weight="300"
        fill="rgba(100,140,200,0.4)">+</text>

  <!-- Title -->
  <text x="195" y="292" text-anchor="middle"
        font-family="Arial,sans-serif" font-size="40" font-weight="700"
        fill="#0060ac">FrogWeather</text>

  <!-- Subtitle -->
  <text x="195" y="322" text-anchor="middle"
        font-family="Arial,sans-serif" font-size="15"
        fill="#717783">Der Wetterfrosch fuers iPhone</text>
</svg>`;

const frog100 = await resizeFrog(`${FROG_DIR}/frosch_02_freundlich.png`, 100);

await sharp(Buffer.from(splashSvg), { density: 192 })
  .composite([{ input: frog100, top: 138, left: 90 }])
  .png()
  .toFile(`${OUT}/preview-01-splash.png`);
console.log('preview-01-splash.png ✓');


// ─────────────────────────────────────────────
// MOCKUP 2 — Bento Grid: Frosch + verbesserter SunArc
// ─────────────────────────────────────────────
// Two cards side by side. Each card ~174px wide.
// Left card: Frosch-Jar.  Right card: improved SunArc.
// Frog (58px) composited at top=94, left=74
const bentoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="390" height="310" viewBox="0 0 390 310">
  <defs>
    <linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#5090bc"/>
      <stop offset="100%" stop-color="#c8e0f4"/>
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
    <linearGradient id="refl" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"  stop-color="rgba(255,255,255,0.55)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.02)"/>
    </linearGradient>
  </defs>
  <rect width="390" height="310" fill="url(#bg2)"/>

  <!-- ─ LABEL ─ -->
  <text x="20" y="24" font-family="Arial,sans-serif" font-size="10" font-weight="700"
        fill="rgba(255,255,255,0.55)" letter-spacing="1.5">BENTO-GRID — NEUE REIHENFOLGE</text>

  <!-- ════ LINKE KACHEL: Wetterfrosch-Jar ════ -->
  <rect x="12" y="34" width="174" height="264" rx="14"
        fill="rgba(185,225,255,0.32)" stroke="rgba(165,210,255,0.60)" stroke-width="2"/>
  <!-- Glas-Reflexlinie -->
  <rect x="21" y="50" width="3" height="232" rx="1.5" fill="url(#refl)"/>

  <!-- Leiter -->
  <rect x="83"  y="64" width="9" height="170" rx="4" fill="url(#rail)"/>
  <rect x="116" y="64" width="9" height="170" rx="4" fill="url(#rail)"/>
  <!-- Sprossen -->
  <rect x="83" y="75"  width="42" height="8" rx="4" fill="url(#rungG)"/>
  <rect x="83" y="107" width="42" height="8" rx="4" fill="url(#rungG)"/>
  <rect x="83" y="139" width="42" height="8" rx="4" fill="url(#rungG)"/>
  <rect x="83" y="171" width="42" height="8" rx="4" fill="url(#rungG)"/>
  <!-- Boden -->
  <ellipse cx="104" cy="241" rx="27" ry="5" fill="rgba(90,62,28,0.45)"/>

  <!-- ════ RECHTE KACHEL: Verbesserter SunArc ════ -->
  <rect x="204" y="34" width="174" height="264" rx="14"
        fill="rgba(255,255,255,0.52)" stroke="rgba(255,255,255,0.65)" stroke-width="1.5"/>

  <!-- Arc: Horizon-Linie -->
  <line x1="217" y1="145" x2="365" y2="145"
        stroke="rgba(0,0,0,0.09)" stroke-width="1"/>
  <!-- Arc track -->
  <path d="M 220,145 A 70,70 0 0 1 362,145"
        fill="none" stroke="rgba(0,0,0,0.07)" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Progress (ca. 55% des Tages) -->
  <path d="M 220,145 A 70,70 0 0 1 325,95"
        fill="none" stroke="#f59e0b" stroke-width="3" stroke-linecap="round" opacity="0.75"/>
  <!-- Sun dot on arc -->
  <circle cx="325" cy="95" r="8" fill="#f59e0b"/>

  <!-- Sonnenauf- / -untergang zweispaltig -->
  <text x="220" y="163" font-family="Arial,sans-serif" font-size="10" fill="#9ca3af">Aufgang</text>
  <text x="220" y="178" font-family="Arial,sans-serif" font-size="14" font-weight="700" fill="#374151">06:15</text>

  <text x="365" y="163" text-anchor="end" font-family="Arial,sans-serif" font-size="10" fill="#9ca3af">Untergang</text>
  <text x="365" y="178" text-anchor="end" font-family="Arial,sans-serif" font-size="14" font-weight="700" fill="#374151">21:32</text>

  <!-- Trennlinie -->
  <line x1="216" y1="187" x2="366" y2="187" stroke="rgba(0,0,0,0.07)" stroke-width="1"/>

  <!-- Tageslicht zentral -->
  <text x="291" y="204" text-anchor="middle"
        font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="#374151">15h 17min</text>
  <text x="291" y="219" text-anchor="middle"
        font-family="Arial,sans-serif" font-size="10" fill="#9ca3af">Tageslicht</text>

  <!-- Trennlinie -->
  <line x1="216" y1="228" x2="366" y2="228" stroke="rgba(0,0,0,0.06)" stroke-width="1"/>

  <!-- Goldene Stunde -->
  <text x="220" y="244" font-family="Arial,sans-serif" font-size="10" fill="#9ca3af">Goldene Stunde</text>
  <text x="365" y="244" text-anchor="end"
        font-family="Arial,sans-serif" font-size="10" font-weight="600" fill="#f59e0b">21:05 - 21:32</text>

  <!-- UV-Index -->
  <text x="220" y="262" font-family="Arial,sans-serif" font-size="10" fill="#9ca3af">UV-Index heute</text>
  <text x="365" y="262" text-anchor="end"
        font-family="Arial,sans-serif" font-size="10" font-weight="600" fill="#ef4444">6 · Hoch</text>

  <!-- Labels -->
  <text x="99" y="290" text-anchor="middle"
        font-family="Arial,sans-serif" font-size="9" font-weight="700"
        fill="rgba(255,255,255,0.55)" letter-spacing="1">FROSCH</text>
  <text x="291" y="290" text-anchor="middle"
        font-family="Arial,sans-serif" font-size="9" font-weight="700"
        fill="rgba(0,80,140,0.4)" letter-spacing="1">SONNE</text>
</svg>`;

const frog58 = await resizeFrog(`${FROG_DIR}/frosch_02_freundlich.png`, 58);

await sharp(Buffer.from(bentoSvg), { density: 192 })
  .composite([{ input: frog58, top: 90, left: 75 }])
  .png()
  .toFile(`${OUT}/preview-02-bento.png`);
console.log('preview-02-bento.png ✓');


// ─────────────────────────────────────────────
// MOCKUP 3 — Alert Banner (collapsed + expanded)
// ─────────────────────────────────────────────
const alertSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="390" height="430" viewBox="0 0 390 430">
  <defs>
    <linearGradient id="bgA" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#d4e3ff"/>
      <stop offset="100%" stop-color="#f8f9ff"/>
    </linearGradient>
  </defs>
  <rect width="390" height="430" fill="url(#bgA)"/>
  <text x="20" y="26" font-family="Arial,sans-serif" font-size="10" font-weight="700"
        fill="#717783" letter-spacing="1.5">DWD WARNUNGEN</text>

  <!-- ── COLLAPSED ── -->
  <text x="20" y="48" font-family="Arial,sans-serif" font-size="9" fill="#aaa">VORHER</text>
  <rect x="12" y="54" width="366" height="70" rx="12"
        fill="rgba(239,68,68,0.11)" stroke="rgba(239,68,68,0.38)" stroke-width="1.5"/>
  <!-- Warn icon circle -->
  <circle cx="42" cy="89" r="15" fill="rgba(239,68,68,0.18)"/>
  <text x="42" y="95" text-anchor="middle"
        font-family="Arial,sans-serif" font-size="17" font-weight="700" fill="#ef4444">!</text>
  <!-- Content -->
  <text x="68" y="76" font-family="Arial,sans-serif" font-size="12" font-weight="700"
        fill="#ef4444">Unwetterwarnung vor Gewitter</text>
  <text x="68" y="93" font-family="Arial,sans-serif" font-size="11" fill="#374151">Gewitter mit Starkregen, Hagel bis 3 cm und...</text>
  <text x="68" y="109" font-family="Arial,sans-serif" font-size="10" fill="#9ca3af">Mo., 2. Jun  14:00 - 22:00 Uhr</text>
  <!-- Expand -->
  <rect x="328" y="102" width="42" height="18" rx="9"
        fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.3)" stroke-width="1"/>
  <text x="349" y="115" text-anchor="middle"
        font-family="Arial,sans-serif" font-size="10" fill="#ef4444">Mehr v</text>

  <!-- ── EXPANDED ── -->
  <text x="20" y="148" font-family="Arial,sans-serif" font-size="9" fill="#aaa">NACHHER — vollstaendig ausgeklappt</text>
  <rect x="12" y="154" width="366" height="262" rx="12"
        fill="rgba(239,68,68,0.11)" stroke="rgba(239,68,68,0.38)" stroke-width="1.5"/>
  <!-- Warn icon -->
  <circle cx="42" cy="182" r="15" fill="rgba(239,68,68,0.18)"/>
  <text x="42" y="188" text-anchor="middle"
        font-family="Arial,sans-serif" font-size="17" font-weight="700" fill="#ef4444">!</text>
  <!-- Headline + source -->
  <text x="68" y="172" font-family="Arial,sans-serif" font-size="12" font-weight="700"
        fill="#ef4444">Unwetterwarnung vor Gewitter</text>
  <text x="68" y="188" font-family="Arial,sans-serif" font-size="10" fill="#9ca3af">Amtliche Warnung des DWD</text>

  <!-- Divider -->
  <line x1="68" y1="197" x2="366" y2="197" stroke="rgba(239,68,68,0.18)" stroke-width="1"/>

  <!-- Description -->
  <text x="68" y="214" font-family="Arial,sans-serif" font-size="12" fill="#1f2937">Es treten Gewitter mit Starkregen zwischen 25 und</text>
  <text x="68" y="230" font-family="Arial,sans-serif" font-size="12" fill="#1f2937">40 l/m2 in kurzer Zeit auf. Hagel bis 3 cm und</text>
  <text x="68" y="246" font-family="Arial,sans-serif" font-size="12" fill="#1f2937">Sturmboeen bis 90 km/h sind moeglich.</text>

  <!-- Instruction -->
  <text x="68" y="266" font-family="Arial,sans-serif" font-size="11" fill="#6b7280" font-style="italic">Empfehlung: Suchen Sie ein festes Gebaeude auf.</text>
  <text x="68" y="281" font-family="Arial,sans-serif" font-size="11" fill="#6b7280" font-style="italic">Halten Sie sich von Baeumen und Gewaessern fern.</text>

  <!-- Divider -->
  <line x1="68" y1="292" x2="366" y2="292" stroke="rgba(239,68,68,0.12)" stroke-width="1"/>

  <!-- Time range -->
  <text x="68" y="310" font-family="Arial,sans-serif" font-size="11" fill="#9ca3af">Beginn: Mo., 2. Jun  14:00 Uhr</text>
  <text x="68" y="326" font-family="Arial,sans-serif" font-size="11" fill="#9ca3af">Ende:   Mo., 2. Jun  22:00 Uhr</text>

  <!-- Collapse button -->
  <rect x="284" y="390" width="80" height="18" rx="9"
        fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.3)" stroke-width="1"/>
  <text x="324" y="403" text-anchor="middle"
        font-family="Arial,sans-serif" font-size="10" fill="#ef4444">Weniger ^</text>
</svg>`;

await sharp(Buffer.from(alertSvg), { density: 192 })
  .png()
  .toFile(`${OUT}/preview-03-alert.png`);
console.log('preview-03-alert.png ✓');

console.log('\nAlle Mockups erstellt.');
