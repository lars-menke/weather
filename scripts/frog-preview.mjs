import sharp from 'sharp';

// Frog style inspired by classic weather-frog illustrations:
// chubby body, large expressive eyes, visible toes, sitting pose on rung.
// Preview shows rung 2 of 4 = "Wechselhaft" (changeable), neutral expression.

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="420" viewBox="0 0 320 420">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#d4e3ff"/>
      <stop offset="100%" stop-color="#f8f9ff"/>
    </linearGradient>
    <!-- Cylindrical rail highlight -->
    <linearGradient id="rail" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#7a4e1e"/>
      <stop offset="25%"  stop-color="#c8813a"/>
      <stop offset="55%"  stop-color="#e09a48"/>
      <stop offset="100%" stop-color="#8b5a22"/>
    </linearGradient>
    <!-- Rung top highlight -->
    <linearGradient id="rung" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#e09a48"/>
      <stop offset="40%"  stop-color="#c8813a"/>
      <stop offset="100%" stop-color="#8b5a22"/>
    </linearGradient>
    <!-- Frog body -->
    <radialGradient id="body" cx="45%" cy="40%" r="60%">
      <stop offset="0%"   stop-color="#72cc5a"/>
      <stop offset="100%" stop-color="#3e9030"/>
    </radialGradient>
    <!-- Frog belly -->
    <radialGradient id="belly" cx="50%" cy="40%" r="60%">
      <stop offset="0%"   stop-color="#c8f0a0"/>
      <stop offset="100%" stop-color="#96dd70"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="320" height="420" fill="url(#bg)"/>

  <!-- Card -->
  <rect x="20" y="20" width="280" height="380" rx="20" ry="20"
        fill="rgba(255,255,255,0.64)" stroke="rgba(255,255,255,0.85)" stroke-width="1.5"/>

  <!-- Card label -->
  <text x="160" y="56" text-anchor="middle"
        font-family="Inter,system-ui,sans-serif" font-size="10" font-weight="700"
        fill="#717783" letter-spacing="1.8">WETTERFROSCH</text>

  <!-- ═══ LADDER ═══ -->
  <!-- Drop shadows for rails -->
  <rect x="122" y="74" width="14" height="276" rx="7" fill="rgba(0,0,0,0.14)"/>
  <rect x="186" y="74" width="14" height="276" rx="7" fill="rgba(0,0,0,0.14)"/>
  <!-- Left rail -->
  <rect x="119" y="72" width="14" height="276" rx="7" fill="url(#rail)"/>
  <!-- Right rail -->
  <rect x="187" y="72" width="14" height="276" rx="7" fill="url(#rail)"/>

  <!-- Rung shadows -->
  <rect x="119" y="92"  width="82" height="14" rx="7" fill="rgba(0,0,0,0.14)" transform="translate(2,2)"/>
  <rect x="119" y="162" width="82" height="14" rx="7" fill="rgba(0,0,0,0.14)" transform="translate(2,2)"/>
  <rect x="119" y="232" width="82" height="14" rx="7" fill="rgba(0,0,0,0.14)" transform="translate(2,2)"/>
  <rect x="119" y="302" width="82" height="14" rx="7" fill="rgba(0,0,0,0.14)" transform="translate(2,2)"/>
  <!-- Rungs -->
  <rect x="119" y="92"  width="82" height="14" rx="7" fill="url(#rung)"/>
  <rect x="119" y="162" width="82" height="14" rx="7" fill="url(#rung)"/>
  <rect x="119" y="232" width="82" height="14" rx="7" fill="url(#rung)"/>
  <rect x="119" y="302" width="82" height="14" rx="7" fill="url(#rung)"/>

  <!-- ═══ FROG — sitting on rung 2 (y=162), neutral expression ═══ -->
  <!-- Frog ground shadow -->
  <ellipse cx="160" cy="162" rx="38" ry="8" fill="rgba(0,0,0,0.10)"/>

  <!-- Back legs — spread wide, curled under, toes visible -->
  <!-- Left back leg -->
  <ellipse cx="132" cy="153" rx="20" ry="13" fill="#3e9030" transform="rotate(-18,132,153)"/>
  <ellipse cx="116" cy="160" rx="15" ry="9"  fill="#3e9030"/>
  <!-- Left toes -->
  <ellipse cx="103" cy="160" rx="6"  ry="4.5" fill="#2e7824" transform="rotate(-10,103,160)"/>
  <ellipse cx="109" cy="165" rx="6"  ry="4.5" fill="#2e7824"/>
  <ellipse cx="116" cy="167" rx="6"  ry="4.5" fill="#2e7824" transform="rotate(5,116,167)"/>
  <!-- Right back leg -->
  <ellipse cx="188" cy="153" rx="20" ry="13" fill="#3e9030" transform="rotate(18,188,153)"/>
  <ellipse cx="204" cy="160" rx="15" ry="9"  fill="#3e9030"/>
  <!-- Right toes -->
  <ellipse cx="217" cy="160" rx="6"  ry="4.5" fill="#2e7824" transform="rotate(10,217,160)"/>
  <ellipse cx="211" cy="165" rx="6"  ry="4.5" fill="#2e7824"/>
  <ellipse cx="204" cy="167" rx="6"  ry="4.5" fill="#2e7824" transform="rotate(-5,204,167)"/>

  <!-- Body (chubby, round) -->
  <ellipse cx="160" cy="133" rx="40" ry="35" fill="url(#body)"/>

  <!-- Belly (light oval) -->
  <ellipse cx="160" cy="141" rx="27" ry="24" fill="url(#belly)"/>

  <!-- Back spots -->
  <circle cx="150" cy="120" r="5.5" fill="#3a8a28" opacity="0.45"/>
  <circle cx="170" cy="117" r="4.5" fill="#3a8a28" opacity="0.45"/>
  <circle cx="178" cy="130" r="3.5" fill="#3a8a28" opacity="0.35"/>

  <!-- Front arms (stubby, resting on rung sides) -->
  <!-- Left arm -->
  <ellipse cx="128" cy="148" rx="11" ry="8"  fill="#4aaa3a" transform="rotate(-30,128,148)"/>
  <circle  cx="122" cy="156" r="8"   fill="#3e9030"/>
  <!-- Left hand toes -->
  <ellipse cx="113" cy="155" rx="4.5" ry="3.5" fill="#2e7824" transform="rotate(-20,113,155)"/>
  <ellipse cx="116" cy="161" rx="4.5" ry="3.5" fill="#2e7824"/>
  <ellipse cx="122" cy="163" rx="4.5" ry="3.5" fill="#2e7824" transform="rotate(15,122,163)"/>
  <!-- Right arm -->
  <ellipse cx="192" cy="148" rx="11" ry="8"  fill="#4aaa3a" transform="rotate(30,192,148)"/>
  <circle  cx="198" cy="156" r="8"   fill="#3e9030"/>
  <!-- Right hand toes -->
  <ellipse cx="207" cy="155" rx="4.5" ry="3.5" fill="#2e7824" transform="rotate(20,207,155)"/>
  <ellipse cx="204" cy="161" rx="4.5" ry="3.5" fill="#2e7824"/>
  <ellipse cx="198" cy="163" rx="4.5" ry="3.5" fill="#2e7824" transform="rotate(-15,198,163)"/>

  <!-- Head (large, round) -->
  <ellipse cx="160" cy="98" rx="38" ry="36" fill="url(#body)"/>

  <!-- Head spots -->
  <circle cx="148" cy="88" r="5"   fill="#3a8a28" opacity="0.4"/>
  <circle cx="172" cy="85" r="4"   fill="#3a8a28" opacity="0.4"/>

  <!-- Eye bump bases (raised mounds) -->
  <circle cx="144" cy="81" r="17" fill="#4aaa3a"/>
  <circle cx="176" cy="81" r="17" fill="#4aaa3a"/>

  <!-- Eye whites -->
  <circle cx="144" cy="79" r="15" fill="white"/>
  <circle cx="176" cy="79" r="15" fill="white"/>

  <!-- Irises (medium green ring) -->
  <circle cx="144" cy="80" r="11" fill="#5ac040"/>
  <circle cx="176" cy="80" r="11" fill="#5ac040"/>

  <!-- Pupils (large, dark — neutral expression) -->
  <circle cx="146" cy="81" r="8.5" fill="#1a2a10"/>
  <circle cx="178" cy="81" r="8.5" fill="#1a2a10"/>

  <!-- Primary eye shine -->
  <circle cx="150" cy="76" r="4"   fill="white"/>
  <circle cx="182" cy="76" r="4"   fill="white"/>
  <!-- Secondary small shine -->
  <circle cx="142" cy="87" r="2"   fill="white" opacity="0.55"/>
  <circle cx="174" cy="87" r="2"   fill="white" opacity="0.55"/>

  <!-- Eyelid line (neutral — not sad, not super happy) -->
  <path d="M 133,74 Q 144,70 155,74" stroke="#3a8a28" stroke-width="2" stroke-linecap="round" fill="none"/>
  <path d="M 165,74 Q 176,70 187,74" stroke="#3a8a28" stroke-width="2" stroke-linecap="round" fill="none"/>

  <!-- Nostril dots -->
  <circle cx="155" cy="107" r="2.8" fill="#2e7824"/>
  <circle cx="165" cy="107" r="2.8" fill="#2e7824"/>

  <!-- Mouth — slight content smile -->
  <path d="M 148,115 Q 160,124 172,115" stroke="#2e7824" stroke-width="3.5" stroke-linecap="round" fill="none"/>

  <!-- ═══ Weather indicator label ═══ -->
  <text x="160" y="364" text-anchor="middle"
        font-family="Inter,system-ui,sans-serif" font-size="13" font-weight="600"
        fill="#0060ac">Wechselhaft</text>
  <text x="160" y="382" text-anchor="middle"
        font-family="Inter,system-ui,sans-serif" font-size="11"
        fill="#717783">Sprosse 2 von 4</text>
</svg>`;

const buf = Buffer.from(svg);
await sharp(buf, { density: 192 })
  .png()
  .toFile('/home/user/weather/scripts/frog-preview.png');

console.log('frog-preview.png written');
