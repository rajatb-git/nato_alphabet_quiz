const sharp = require('sharp');
const path = require('path');

const ASSETS = path.join(__dirname, '..', 'assets');

// Dark gradient background matching app theme (#0f0c29 -> #302b63 -> #24243e)
// We'll create the icons using SVG rendered by sharp

function createMainIcon(size) {
  // Main app icon: "AB" in bold with signal wave accents on dark bg
  const svg = `
  <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#0f0c29"/>
        <stop offset="50%" style="stop-color:#302b63"/>
        <stop offset="100%" style="stop-color:#24243e"/>
      </linearGradient>
      <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#60a5fa"/>
        <stop offset="100%" style="stop-color:#a78bfa"/>
      </linearGradient>
      <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#60a5fa;stop-opacity:0.6"/>
        <stop offset="100%" style="stop-color:#a78bfa;stop-opacity:0.1"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="${size * 0.008}" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <!-- Background -->
    <rect width="${size}" height="${size}" rx="${size * 0.18}" fill="url(#bg)"/>

    <!-- Subtle signal wave arcs in top-right -->
    <g opacity="0.3" stroke="url(#waveGrad)" fill="none" stroke-width="${size * 0.008}" stroke-linecap="round">
      <path d="M${size*0.72} ${size*0.18} A${size*0.08} ${size*0.08} 0 0 1 ${size*0.72} ${size*0.34}"/>
      <path d="M${size*0.78} ${size*0.13} A${size*0.13} ${size*0.13} 0 0 1 ${size*0.78} ${size*0.39}"/>
      <path d="M${size*0.84} ${size*0.08} A${size*0.18} ${size*0.18} 0 0 1 ${size*0.84} ${size*0.44}"/>
    </g>

    <!-- "AB" text -->
    <text
      x="${size * 0.48}"
      y="${size * 0.62}"
      font-family="Arial Black, Arial, Helvetica, sans-serif"
      font-weight="900"
      font-size="${size * 0.42}"
      fill="url(#textGrad)"
      text-anchor="middle"
      dominant-baseline="middle"
      letter-spacing="${size * -0.01}"
      filter="url(#glow)"
    >AB</text>

    <!-- Small subtitle -->
    <text
      x="${size * 0.48}"
      y="${size * 0.82}"
      font-family="Arial, Helvetica, sans-serif"
      font-weight="600"
      font-size="${size * 0.07}"
      fill="#94a3b8"
      text-anchor="middle"
      letter-spacing="${size * 0.015}"
    >ALPHA BRAVO QUIZ</text>
  </svg>`;
  return svg;
}

function createAdaptiveForeground(size) {
  // Android adaptive icon foreground - just the AB text, no background
  // Adaptive icons have safe zone of 66% centered, so we design within that
  const svg = `
  <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#60a5fa"/>
        <stop offset="100%" style="stop-color:#a78bfa"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="${size * 0.006}" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <!-- "AB" text centered in safe zone -->
    <text
      x="${size * 0.5}"
      y="${size * 0.54}"
      font-family="Arial Black, Arial, Helvetica, sans-serif"
      font-weight="900"
      font-size="${size * 0.32}"
      fill="url(#textGrad)"
      text-anchor="middle"
      dominant-baseline="middle"
      letter-spacing="${size * -0.005}"
      filter="url(#glow)"
    >AB</text>

    <!-- Subtitle -->
    <text
      x="${size * 0.5}"
      y="${size * 0.72}"
      font-family="Arial, Helvetica, sans-serif"
      font-weight="600"
      font-size="${size * 0.052}"
      fill="#94a3b8"
      text-anchor="middle"
      letter-spacing="${size * 0.012}"
    >ALPHA BRAVO QUIZ</text>
  </svg>`;
  return svg;
}

function createAdaptiveBackground(size) {
  const svg = `
  <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#0f0c29"/>
        <stop offset="50%" style="stop-color:#302b63"/>
        <stop offset="100%" style="stop-color:#24243e"/>
      </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" fill="url(#bg)"/>
  </svg>`;
  return svg;
}

function createMonochrome(size) {
  const svg = `
  <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <text
      x="${size * 0.5}"
      y="${size * 0.54}"
      font-family="Arial Black, Arial, Helvetica, sans-serif"
      font-weight="900"
      font-size="${size * 0.32}"
      fill="white"
      text-anchor="middle"
      dominant-baseline="middle"
    >AB</text>
    <text
      x="${size * 0.5}"
      y="${size * 0.72}"
      font-family="Arial, Helvetica, sans-serif"
      font-weight="600"
      font-size="${size * 0.052}"
      fill="white"
      text-anchor="middle"
      letter-spacing="${size * 0.012}"
    >ALPHA BRAVO QUIZ</text>
  </svg>`;
  return svg;
}

function createSplashIcon(size) {
  // Larger, more detailed version for splash screen
  const svg = `
  <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#60a5fa"/>
        <stop offset="100%" style="stop-color:#a78bfa"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="${size * 0.01}" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <text
      x="${size * 0.5}"
      y="${size * 0.48}"
      font-family="Arial Black, Arial, Helvetica, sans-serif"
      font-weight="900"
      font-size="${size * 0.38}"
      fill="url(#textGrad)"
      text-anchor="middle"
      dominant-baseline="middle"
      filter="url(#glow)"
    >AB</text>

    <text
      x="${size * 0.5}"
      y="${size * 0.7}"
      font-family="Arial, Helvetica, sans-serif"
      font-weight="600"
      font-size="${size * 0.065}"
      fill="#94a3b8"
      text-anchor="middle"
      letter-spacing="${size * 0.018}"
    >ALPHA BRAVO QUIZ</text>
  </svg>`;
  return svg;
}

function createFavicon(size) {
  const svg = `
  <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#0f0c29"/>
        <stop offset="50%" style="stop-color:#302b63"/>
        <stop offset="100%" style="stop-color:#24243e"/>
      </linearGradient>
      <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#60a5fa"/>
        <stop offset="100%" style="stop-color:#a78bfa"/>
      </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#bg)"/>
    <text
      x="${size * 0.5}"
      y="${size * 0.58}"
      font-family="Arial Black, Arial, Helvetica, sans-serif"
      font-weight="900"
      font-size="${size * 0.5}"
      fill="url(#textGrad)"
      text-anchor="middle"
      dominant-baseline="middle"
    >AB</text>
  </svg>`;
  return svg;
}

function createNotificationIcon(size) {
  // Must be white on transparent for Android notification icons
  const svg = `
  <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <text
      x="${size * 0.5}"
      y="${size * 0.58}"
      font-family="Arial Black, Arial, Helvetica, sans-serif"
      font-weight="900"
      font-size="${size * 0.5}"
      fill="white"
      text-anchor="middle"
      dominant-baseline="middle"
    >AB</text>
  </svg>`;
  return svg;
}

function createFeatureGraphic(width, height) {
  // Google Play feature graphic: 1024x500
  const svg = `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#0f0c29"/>
        <stop offset="50%" style="stop-color:#302b63"/>
        <stop offset="100%" style="stop-color:#24243e"/>
      </linearGradient>
      <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#60a5fa"/>
        <stop offset="100%" style="stop-color:#a78bfa"/>
      </linearGradient>
      <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#60a5fa;stop-opacity:0.4"/>
        <stop offset="100%" style="stop-color:#a78bfa;stop-opacity:0.05"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="6" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <rect width="${width}" height="${height}" fill="url(#bg)"/>

    <!-- Signal wave arcs on the left -->
    <g opacity="0.25" stroke="url(#waveGrad)" fill="none" stroke-width="3" stroke-linecap="round">
      <path d="M140 150 A40 40 0 0 1 140 250"/>
      <path d="M120 130 A60 60 0 0 1 120 270"/>
      <path d="M100 110 A80 80 0 0 1 100 290"/>
    </g>

    <!-- Signal wave arcs on the right -->
    <g opacity="0.25" stroke="url(#waveGrad)" fill="none" stroke-width="3" stroke-linecap="round">
      <path d="M884 200 A40 40 0 0 0 884 300"/>
      <path d="M904 180 A60 60 0 0 0 904 320"/>
      <path d="M924 160 A80 80 0 0 0 924 340"/>
    </g>

    <!-- "AB" text -->
    <text
      x="${width * 0.5}"
      y="${height * 0.42}"
      font-family="Arial Black, Arial, Helvetica, sans-serif"
      font-weight="900"
      font-size="180"
      fill="url(#textGrad)"
      text-anchor="middle"
      dominant-baseline="middle"
      filter="url(#glow)"
    >AB</text>

    <!-- App name -->
    <text
      x="${width * 0.5}"
      y="${height * 0.68}"
      font-family="Arial, Helvetica, sans-serif"
      font-weight="700"
      font-size="36"
      fill="#e2e8f0"
      text-anchor="middle"
      letter-spacing="8"
    >ALPHA BRAVO QUIZ</text>

    <!-- Tagline -->
    <text
      x="${width * 0.5}"
      y="${height * 0.82}"
      font-family="Arial, Helvetica, sans-serif"
      font-weight="400"
      font-size="22"
      fill="#94a3b8"
      text-anchor="middle"
      letter-spacing="2"
    >Master the NATO Phonetic Alphabet</text>
  </svg>`;
  return svg;
}

async function generate() {
  console.log('Generating icons...');

  // Main icon (1024x1024)
  await sharp(Buffer.from(createMainIcon(1024)))
    .png()
    .toFile(path.join(ASSETS, 'icon.png'));
  console.log('  ✓ icon.png (1024x1024)');

  // Android adaptive foreground (512x512)
  await sharp(Buffer.from(createAdaptiveForeground(512)))
    .png()
    .toFile(path.join(ASSETS, 'android-icon-foreground.png'));
  console.log('  ✓ android-icon-foreground.png (512x512)');

  // Android adaptive background (512x512)
  await sharp(Buffer.from(createAdaptiveBackground(512)))
    .png()
    .toFile(path.join(ASSETS, 'android-icon-background.png'));
  console.log('  ✓ android-icon-background.png (512x512)');

  // Monochrome (512x512)
  await sharp(Buffer.from(createMonochrome(512)))
    .png()
    .toFile(path.join(ASSETS, 'android-icon-monochrome.png'));
  console.log('  ✓ android-icon-monochrome.png (512x512)');

  // Splash icon (512x512)
  await sharp(Buffer.from(createSplashIcon(512)))
    .png()
    .toFile(path.join(ASSETS, 'splash-icon.png'));
  console.log('  ✓ splash-icon.png (512x512)');

  // Favicon (48x48)
  await sharp(Buffer.from(createFavicon(48)))
    .png()
    .toFile(path.join(ASSETS, 'favicon.png'));
  console.log('  ✓ favicon.png (48x48)');

  // Notification icon (96x96)
  await sharp(Buffer.from(createNotificationIcon(96)))
    .png()
    .toFile(path.join(ASSETS, 'notification-icon.png'));
  console.log('  ✓ notification-icon.png (96x96)');

  // Google Play feature graphic (1024x500)
  const STORE = path.join(__dirname, '..', 'store-assets');
  const fs = require('fs');
  if (!fs.existsSync(STORE)) fs.mkdirSync(STORE, { recursive: true });

  await sharp(Buffer.from(createFeatureGraphic(1024, 500)))
    .png()
    .toFile(path.join(STORE, 'feature-graphic.png'));
  console.log('  ✓ store-assets/feature-graphic.png (1024x500)');

  console.log('\nDone! All icons generated.');
}

generate().catch(console.error);
