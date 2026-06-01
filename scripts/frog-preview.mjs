import sharp from 'sharp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="400" viewBox="0 0 320 400">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#d4e3ff"/>
      <stop offset="100%" stop-color="#f8f9ff"/>
    </linearGradient>
    <linearGradient id="card" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.72)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.52)"/>
    </linearGradient>
    <!-- wood grain -->
    <linearGradient id="wood" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#a0622a"/>
      <stop offset="40%"  stop-color="#c8813a"/>
      <stop offset="100%" stop-color="#9a5a24"/>
    </linearGradient>
    <linearGradient id="woodrung" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#b06e30"/>
      <stop offset="50%"  stop-color="#d48c48"/>
      <stop offset="100%" stop-color="#a86228"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="320" height="400" fill="url(#bg)"/>

  <!-- Card -->
  <rect x="20" y="20" width="280" height="360" rx="20" ry="20"
        fill="rgba(255,255,255,0.62)"
        stroke="rgba(255,255,255,0.8)" stroke-width="1.5"/>

  <!-- Card label -->
  <text x="160" y="58" text-anchor="middle"
        font-family="Inter,system-ui,sans-serif" font-size="11" font-weight="600"
        fill="#717783" letter-spacing="1.2" text-decoration="none">WETTERFROSCH</text>

  <!-- ═══ LADDER ═══ -->
  <!-- Left rail -->
  <rect x="118" y="75" width="14" height="255" rx="5" fill="url(#wood)"/>
  <!-- Right rail -->
  <rect x="188" y="75" width="14" height="255" rx="5" fill="url(#wood)"/>
  <!-- Rungs (5) -->
  <rect x="118" y="88"  width="84" height="11" rx="4" fill="url(#woodrung)"/>
  <rect x="118" y="143" width="84" height="11" rx="4" fill="url(#woodrung)"/>
  <rect x="118" y="198" width="84" height="11" rx="4" fill="url(#woodrung)"/>
  <rect x="118" y="253" width="84" height="11" rx="4" fill="url(#woodrung)"/>
  <rect x="118" y="308" width="84" height="11" rx="4" fill="url(#woodrung)"/>
  <!-- Shadow lines on rungs -->
  <rect x="118" y="96"  width="84" height="3" rx="1" fill="rgba(0,0,0,0.07)"/>
  <rect x="118" y="151" width="84" height="3" rx="1" fill="rgba(0,0,0,0.07)"/>
  <rect x="118" y="206" width="84" height="3" rx="1" fill="rgba(0,0,0,0.07)"/>
  <rect x="118" y="261" width="84" height="3" rx="1" fill="rgba(0,0,0,0.07)"/>
  <rect x="118" y="316" width="84" height="3" rx="1" fill="rgba(0,0,0,0.07)"/>

  <!-- ═══ FROG (sitting on rung 2 from top = partly cloudy preview) ═══ -->
  <!-- Frog shadow -->
  <ellipse cx="160" cy="163" rx="28" ry="6" fill="rgba(0,0,0,0.08)"/>

  <!-- Back legs -->
  <ellipse cx="136" cy="156" rx="12" ry="8" fill="#4a9e4a" transform="rotate(-20,136,156)"/>
  <ellipse cx="184" cy="156" rx="12" ry="8" fill="#4a9e4a" transform="rotate(20,184,156)"/>
  <!-- Feet -->
  <ellipse cx="127" cy="162" rx="9" ry="5" fill="#3d8c3d"/>
  <ellipse cx="193" cy="162" rx="9" ry="5" fill="#3d8c3d"/>

  <!-- Body -->
  <ellipse cx="160" cy="142" rx="27" ry="24" fill="#5aba5a"/>
  <!-- Belly -->
  <ellipse cx="160" cy="148" rx="18" ry="15" fill="#8ad87a"/>

  <!-- Arms gripping rung -->
  <path d="M133,148 Q122,152 120,158" stroke="#4a9e4a" stroke-width="9" stroke-linecap="round" fill="none"/>
  <path d="M187,148 Q198,152 200,158" stroke="#4a9e4a" stroke-width="9" stroke-linecap="round" fill="none"/>
  <!-- Fingers -->
  <circle cx="119" cy="159" r="4.5" fill="#3d8c3d"/>
  <circle cx="199" cy="159" r="4.5" fill="#3d8c3d"/>

  <!-- Eye bumps -->
  <ellipse cx="149" cy="123" rx="11" ry="10" fill="#5aba5a"/>
  <ellipse cx="171" cy="123" rx="11" ry="10" fill="#5aba5a"/>
  <!-- Eyes whites -->
  <circle cx="149" cy="122" r="8.5" fill="white"/>
  <circle cx="171" cy="122" r="8.5" fill="white"/>
  <!-- Pupils -->
  <circle cx="151" cy="123" r="5" fill="#1a3a1a"/>
  <circle cx="173" cy="123" r="5" fill="#1a3a1a"/>
  <!-- Eye shine -->
  <circle cx="153" cy="121" r="2" fill="white"/>
  <circle cx="175" cy="121" r="2" fill="white"/>

  <!-- Nostril dots -->
  <circle cx="155" cy="133" r="2" fill="#3d8c3d"/>
  <circle cx="165" cy="133" r="2" fill="#3d8c3d"/>

  <!-- Smile -->
  <path d="M148,138 Q160,146 172,138" stroke="#3d8c3d" stroke-width="2.5" stroke-linecap="round" fill="none"/>

  <!-- ═══ Weather indicator label ═══ -->
  <text x="160" y="355" text-anchor="middle"
        font-family="Inter,system-ui,sans-serif" font-size="13" font-weight="500"
        fill="#0060ac">Wechselhaft</text>
  <text x="160" y="374" text-anchor="middle"
        font-family="Inter,system-ui,sans-serif" font-size="11"
        fill="#717783">Rung 2 von 5</text>
</svg>`;

const buf = Buffer.from(svg);
await sharp(buf, { density: 192 })
  .png()
  .toFile('/home/user/weather/scripts/frog-preview.png');

console.log('frog-preview.png written');
