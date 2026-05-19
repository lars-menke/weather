// Generates all PWA icons from an inline SVG using sharp
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Weather app icon SVG: sky-blue circle, white sun with rays + small cloud
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60a5fa"/>
      <stop offset="100%" stop-color="#0060ac"/>
    </linearGradient>
    <linearGradient id="cloud" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#e0eeff"/>
    </linearGradient>
  </defs>

  <!-- Background circle -->
  <rect width="512" height="512" rx="115" fill="url(#bg)"/>

  <!-- Sun -->
  <circle cx="210" cy="195" r="62" fill="#FDE68A"/>

  <!-- Sun rays -->
  <g stroke="#FDE68A" stroke-width="18" stroke-linecap="round">
    <line x1="210" y1="95"  x2="210" y2="115"/>
    <line x1="210" y1="275" x2="210" y2="295"/>
    <line x1="110" y1="195" x2="130" y2="195"/>
    <line x1="290" y1="195" x2="310" y2="195"/>
    <line x1="139" y1="124" x2="153" y2="138"/>
    <line x1="267" y1="252" x2="281" y2="266"/>
    <line x1="139" y1="266" x2="153" y2="252"/>
    <line x1="267" y1="138" x2="281" y2="124"/>
  </g>

  <!-- Cloud body -->
  <rect x="148" y="290" width="224" height="90" rx="45" fill="url(#cloud)"/>
  <!-- Cloud bumps -->
  <circle cx="200" cy="283" r="52" fill="url(#cloud)"/>
  <circle cx="268" cy="262" r="64" fill="url(#cloud)"/>
  <circle cx="335" cy="285" r="44" fill="url(#cloud)"/>
</svg>`;

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);

const sizes = [
  { name: 'icon-192.png',          size: 192 },
  { name: 'icon-512.png',          size: 512 },
  { name: 'apple-touch-icon.png',  size: 180 },
  { name: 'favicon-32.png',        size: 32  },
];

(async () => {
  for (const { name, size } of sizes) {
    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(path.join(publicDir, name));
    console.log(`✓ ${name} (${size}x${size})`);
  }
  console.log('All icons generated.');
})();
