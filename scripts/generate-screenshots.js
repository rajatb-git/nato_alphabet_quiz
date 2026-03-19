const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const STORE = path.join(__dirname, '..', 'store-assets');
if (!fs.existsSync(STORE)) fs.mkdirSync(STORE, { recursive: true });

// 1080x1920 = 9:16 aspect ratio
const W = 1080;
const H = 1920;

// Phone frame
const PHONE_PAD_X = 48;
const PHONE_PAD_TOP = 140;
const CAPTION_H = 200;
const PHONE_RADIUS = 44;
const SCREEN_W = W - PHONE_PAD_X * 2;
const SCREEN_H = H - PHONE_PAD_TOP - CAPTION_H - 20;
const SCREEN_BOT = PHONE_PAD_TOP + SCREEN_H;

const STATUS_BAR_H = 40;

// Shorthand positions
const SX = PHONE_PAD_X; // screen left
const CW = SCREEN_W;    // content width
const CX = SX + CW / 2; // center x

function statusBar() {
  const y = PHONE_PAD_TOP;
  return `
    <g opacity="0.7">
      <text x="${SX + 24}" y="${y + 28}" font-family="Arial, sans-serif" font-size="17" fill="white" font-weight="600">9:41</text>
      <g transform="translate(${W - PHONE_PAD_X - 85}, ${y + 12})">
        <rect x="0" y="4" width="20" height="11" rx="2.5" fill="none" stroke="white" stroke-width="1.5"/>
        <rect x="2.5" y="6.5" width="13" height="6" rx="1" fill="white"/>
        <rect x="20" y="7.5" width="2.5" height="5" rx="1" fill="white"/>
        <g transform="translate(32, 0)">
          <path d="M0 15 L0 9 M5.5 15 L5.5 5.5 M11 15 L11 2 M16.5 15 L16.5 0" stroke="white" stroke-width="2.2" stroke-linecap="round"/>
        </g>
      </g>
    </g>`;
}

function tabBar() {
  const y = SCREEN_BOT - 75;
  return `
    <rect x="${SX}" y="${y}" width="${CW}" height="75" fill="#0d0a24"/>
    <rect x="${SX}" y="${y}" width="${CW}" height="1" fill="rgba(255,255,255,0.08)"/>
    <g font-family="Arial, sans-serif" text-anchor="middle">
      <text x="${SX + CW*0.125}" y="${y + 30}" font-size="24" fill="#7c3aed">&#x2302;</text>
      <text x="${SX + CW*0.125}" y="${y + 52}" font-size="12" fill="#7c3aed" font-weight="600">Home</text>
      <text x="${SX + CW*0.375}" y="${y + 30}" font-size="24" fill="#6b6b80">&#x2261;</text>
      <text x="${SX + CW*0.375}" y="${y + 52}" font-size="12" fill="#6b6b80">Stats</text>
      <text x="${SX + CW*0.625}" y="${y + 30}" font-size="24" fill="#6b6b80">&#x2605;</text>
      <text x="${SX + CW*0.625}" y="${y + 52}" font-size="12" fill="#6b6b80">Awards</text>
      <text x="${SX + CW*0.875}" y="${y + 30}" font-size="24" fill="#6b6b80">&#x2699;</text>
      <text x="${SX + CW*0.875}" y="${y + 52}" font-size="12" fill="#6b6b80">Settings</text>
    </g>
  `;
}

function phoneFrame(screenContent, caption, subtitle) {
  return `
  <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="pageBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#0a0820"/>
        <stop offset="50%" style="stop-color:#1a1545"/>
        <stop offset="100%" style="stop-color:#151030"/>
      </linearGradient>
      <linearGradient id="screenBg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#0f0c29"/>
        <stop offset="50%" style="stop-color:#302b63"/>
        <stop offset="100%" style="stop-color:#24243e"/>
      </linearGradient>
      <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#60a5fa"/>
        <stop offset="100%" style="stop-color:#a78bfa"/>
      </linearGradient>
      <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#7c3aed"/>
        <stop offset="100%" style="stop-color:#a78bfa"/>
      </linearGradient>
      <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#059669"/>
        <stop offset="100%" style="stop-color:#10b981"/>
      </linearGradient>
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#1e1b4b"/>
        <stop offset="100%" style="stop-color:#312e81"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="10" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="shadow">
        <feDropShadow dx="0" dy="6" stdDeviation="16" flood-opacity="0.6"/>
      </filter>
      <clipPath id="screenClip">
        <rect x="${SX}" y="${PHONE_PAD_TOP}" width="${CW}" height="${SCREEN_H}" rx="${PHONE_RADIUS - 4}"/>
      </clipPath>
    </defs>

    <!-- Page background -->
    <rect width="${W}" height="${H}" fill="url(#pageBg)"/>

    <!-- Phone shadow and bezel -->
    <rect x="${SX - 6}" y="${PHONE_PAD_TOP - 6}" width="${CW + 12}" height="${SCREEN_H + 12}" rx="${PHONE_RADIUS + 2}" fill="rgba(0,0,0,0.4)" filter="url(#shadow)"/>
    <rect x="${SX - 3}" y="${PHONE_PAD_TOP - 3}" width="${CW + 6}" height="${SCREEN_H + 6}" rx="${PHONE_RADIUS}" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2.5"/>

    <!-- Screen -->
    <g clip-path="url(#screenClip)">
      <rect x="${SX}" y="${PHONE_PAD_TOP}" width="${CW}" height="${SCREEN_H}" fill="url(#screenBg)"/>
      ${statusBar()}
      ${screenContent}
      ${tabBar()}
    </g>

    <!-- Caption -->
    <text x="${W / 2}" y="${SCREEN_BOT + 75}" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="46" fill="white" text-anchor="middle">${caption}</text>
    <text x="${W / 2}" y="${SCREEN_BOT + 115}" font-family="Arial, sans-serif" font-weight="400" font-size="26" fill="#94a3b8" text-anchor="middle">${subtitle}</text>
  </svg>`;
}

// Content area starts after status bar
const CONTENT_TOP = PHONE_PAD_TOP + STATUS_BAR_H + 15;
const CONTENT_PAD = 28;
const CARD_X = SX + CONTENT_PAD;
const CARD_W = CW - CONTENT_PAD * 2;

// --- Screenshot 1: Home Screen ---
function screenshot1() {
  const y0 = CONTENT_TOP;

  const screen = `
    <!-- Header -->
    <text x="${CX}" y="${y0 + 35}" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="38" fill="url(#textGrad)" text-anchor="middle" filter="url(#glow)">AB</text>
    <text x="${CX}" y="${y0 + 65}" font-family="Arial, sans-serif" font-weight="600" font-size="15" fill="#94a3b8" text-anchor="middle" letter-spacing="4">ALPHA BRAVO QUIZ</text>

    <!-- Quiz section label -->
    <text x="${CARD_X}" y="${y0 + 110}" font-family="Arial, sans-serif" font-weight="700" font-size="20" fill="white">Quizzes</text>

    ${quizCard(CARD_X, y0 + 125, CARD_W, 'Random Quiz', '10 random letters to test your knowledge', '#7c3aed', 'A?')}
    ${quizCard(CARD_X, y0 + 220, CARD_W, 'Full Alphabet', 'Challenge yourself with all 26 letters', '#2563eb', '26')}
    ${quizCard(CARD_X, y0 + 315, CARD_W, 'Daily Challenge', 'A new unique challenge every day', '#d97706', 'DC')}
    ${quizCard(CARD_X, y0 + 410, CARD_W, 'Weak Letters', 'Practice letters below 70% accuracy', '#ef4444', '!!')}

    <!-- Study section -->
    <text x="${CARD_X}" y="${y0 + 525}" font-family="Arial, sans-serif" font-weight="700" font-size="20" fill="white">Study &amp; Practice</text>

    ${quizCard(CARD_X, y0 + 540, CARD_W, 'NATO Flashcards', 'Learn letter by letter with flip cards', '#059669', 'FC')}
    ${quizCard(CARD_X, y0 + 635, CARD_W, 'Spelling Mode', 'Spell words using the NATO alphabet', '#dc2626', 'SP')}
    ${quizCard(CARD_X, y0 + 730, CARD_W, 'Morse Code', 'Identify letters from morse code patterns', '#0891b2', 'MC')}
  `;
  return phoneFrame(screen, 'Multiple Quiz Modes', 'Learn NATO, morse code, and spelling');
}

function quizCard(x, y, w, title, subtitle, color, icon) {
  return `
    <rect x="${x}" y="${y}" width="${w}" height="82" rx="16" fill="url(#cardGrad)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    <rect x="${x + 18}" y="${y + 18}" width="46" height="46" rx="14" fill="${color}" opacity="0.2"/>
    <text x="${x + 41}" y="${y + 48}" font-family="Arial Black, sans-serif" font-weight="900" font-size="16" fill="${color}" text-anchor="middle">${icon}</text>
    <text x="${x + 80}" y="${y + 36}" font-family="Arial, sans-serif" font-weight="700" font-size="19" fill="white">${title}</text>
    <text x="${x + 80}" y="${y + 58}" font-family="Arial, sans-serif" font-weight="400" font-size="14" fill="#a0a0b8">${subtitle}</text>
    <text x="${x + w - 20}" y="${y + 46}" font-family="Arial, sans-serif" font-size="22" fill="#6b6b80" text-anchor="end">&#x203A;</text>
  `;
}

// --- Screenshot 2: Quiz in Action ---
function screenshot2() {
  const y0 = CONTENT_TOP;

  const screen = `
    <!-- Progress bar -->
    <rect x="${CARD_X}" y="${y0 + 20}" width="${CARD_W}" height="8" rx="4" fill="rgba(255,255,255,0.1)"/>
    <rect x="${CARD_X}" y="${y0 + 20}" width="${CARD_W * 0.7}" height="8" rx="4" fill="url(#purpleGrad)"/>
    <text x="${CARD_X}" y="${y0 + 55}" font-family="Arial, sans-serif" font-size="16" fill="#a0a0b8">Question 7 / 10</text>
    <text x="${CARD_X + CARD_W}" y="${y0 + 55}" font-family="Arial, sans-serif" font-size="16" fill="#10b981" text-anchor="end">Score: 6</text>

    <!-- Letter card - larger and more centered -->
    <rect x="${CX - 150}" y="${y0 + 100}" width="300" height="380" rx="32" fill="url(#cardGrad)" stroke="rgba(255,255,255,0.12)" stroke-width="2" filter="url(#shadow)"/>
    <text x="${CX}" y="${y0 + 340}" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="220" fill="url(#textGrad)" text-anchor="middle" dominant-baseline="middle" filter="url(#glow)">F</text>

    <!-- Hint text -->
    <text x="${CX}" y="${y0 + 540}" font-family="Arial, sans-serif" font-size="20" fill="#6b6b80" text-anchor="middle">What is the NATO word for this letter?</text>

    <!-- Input field -->
    <rect x="${CARD_X}" y="${y0 + 585}" width="${CARD_W}" height="64" rx="16" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
    <text x="${CARD_X + 24}" y="${y0 + 625}" font-family="Arial, sans-serif" font-size="22" fill="white">Foxtrot</text>

    <!-- Submit button -->
    <rect x="${CARD_X}" y="${y0 + 680}" width="${CARD_W}" height="62" rx="16" fill="url(#purpleGrad)"/>
    <text x="${CX}" y="${y0 + 718}" font-family="Arial, sans-serif" font-weight="700" font-size="20" fill="white" text-anchor="middle">Submit</text>

    <!-- Correct banner -->
    <rect x="${CARD_X}" y="${y0 + 775}" width="${CARD_W}" height="58" rx="14" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="1.5"/>
    <text x="${CX}" y="${y0 + 811}" font-family="Arial, sans-serif" font-weight="600" font-size="20" fill="#10b981" text-anchor="middle">&#x2713; Correct! Foxtrot</text>
  `;
  return phoneFrame(screen, 'Test Your Knowledge', 'Name the NATO word for each letter');
}

// --- Screenshot 3: Flashcards ---
function screenshot3() {
  const y0 = CONTENT_TOP;

  const screen = `
    <!-- Header -->
    <text x="${CX}" y="${y0 + 45}" font-family="Arial, sans-serif" font-weight="700" font-size="28" fill="white" text-anchor="middle">NATO Flashcards</text>
    <text x="${CX}" y="${y0 + 75}" font-family="Arial, sans-serif" font-size="16" fill="#a0a0b8" text-anchor="middle">Card 8 of 26</text>

    <!-- Flashcard - larger -->
    <rect x="${CX - 190}" y="${y0 + 120}" width="380" height="560" rx="32" fill="url(#cardGrad)" stroke="rgba(124,58,237,0.35)" stroke-width="2" filter="url(#shadow)"/>

    <text x="${CX}" y="${y0 + 380}" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="200" fill="url(#textGrad)" text-anchor="middle" dominant-baseline="middle" filter="url(#glow)">H</text>

    <rect x="${CX - 100}" y="${y0 + 480}" width="200" height="3" rx="1.5" fill="rgba(255,255,255,0.1)"/>

    <text x="${CX}" y="${y0 + 550}" font-family="Arial, sans-serif" font-weight="700" font-size="56" fill="url(#purpleGrad)" text-anchor="middle">Hotel</text>

    <text x="${CX}" y="${y0 + 620}" font-family="Arial, sans-serif" font-size="16" fill="#6b6b80" text-anchor="middle">Tap card to flip</text>

    <!-- Navigation buttons -->
    <rect x="${CX - 190}" y="${y0 + 730}" width="170" height="58" rx="14" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    <text x="${CX - 105}" y="${y0 + 766}" font-family="Arial, sans-serif" font-weight="600" font-size="18" fill="white" text-anchor="middle">&#x2039; Previous</text>

    <rect x="${CX + 20}" y="${y0 + 730}" width="170" height="58" rx="14" fill="url(#purpleGrad)"/>
    <text x="${CX + 105}" y="${y0 + 766}" font-family="Arial, sans-serif" font-weight="600" font-size="18" fill="white" text-anchor="middle">Next &#x203A;</text>

    <!-- Shuffle -->
    <rect x="${CX - 65}" y="${y0 + 820}" width="130" height="40" rx="20" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    <text x="${CX}" y="${y0 + 846}" font-family="Arial, sans-serif" font-size="15" fill="#a0a0b8" text-anchor="middle">Shuffle: On</text>
  `;
  return phoneFrame(screen, 'Study with Flashcards', 'Flip cards to learn each letter');
}

// --- Screenshot 4: Morse Code ---
function screenshot4() {
  const y0 = CONTENT_TOP;

  const screen = `
    <!-- Progress -->
    <rect x="${CARD_X}" y="${y0 + 15}" width="${CARD_W}" height="8" rx="4" fill="rgba(255,255,255,0.1)"/>
    <rect x="${CARD_X}" y="${y0 + 15}" width="${CARD_W * 0.5}" height="8" rx="4" fill="#0891b2"/>
    <text x="${CARD_X}" y="${y0 + 48}" font-family="Arial, sans-serif" font-size="16" fill="#a0a0b8">Question 5 / 10</text>
    <text x="${CARD_X + CARD_W}" y="${y0 + 48}" font-family="Arial, sans-serif" font-size="16" fill="#10b981" text-anchor="end">Score: 4</text>

    <!-- Morse display card -->
    <rect x="${CX - 155}" y="${y0 + 80}" width="310" height="250" rx="28" fill="url(#cardGrad)" stroke="rgba(8,145,178,0.3)" stroke-width="2" filter="url(#shadow)"/>

    <text x="${CX}" y="${y0 + 130}" font-family="Arial, sans-serif" font-weight="600" font-size="18" fill="#a0a0b8" text-anchor="middle">Identify this letter</text>

    <!-- Morse dots and dashes: . - . (R) -->
    <circle cx="${CX - 55}" cy="${y0 + 200}" r="18" fill="#0891b2"/>
    <rect x="${CX - 25}" y="${y0 + 185}" width="50" height="30" rx="15" fill="#0891b2"/>
    <circle cx="${CX + 55}" cy="${y0 + 200}" r="18" fill="#0891b2"/>

    <text x="${CX}" y="${y0 + 275}" font-family="monospace" font-size="36" fill="#67e8f9" text-anchor="middle" letter-spacing="12">. &#x2013; .</text>

    <!-- Select label -->
    <text x="${CX}" y="${y0 + 370}" font-family="Arial, sans-serif" font-weight="600" font-size="18" fill="white" text-anchor="middle">Select the correct letter</text>

    <!-- Letter grid -->
    ${letterGrid(CARD_X, y0 + 400, CARD_W)}
  `;
  return phoneFrame(screen, 'Morse Code Quiz', 'Identify letters from morse patterns');
}

function letterGrid(x, y, w) {
  const cols = 7;
  const cellW = Math.floor(w / cols);
  const cellH = cellW + 4;
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  let svg = '';

  letters.forEach((letter, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const cx = x + col * cellW + cellW / 2;
    const cy = y + row * cellH + cellH / 2;
    const isSelected = letter === 'R';
    const fill = isSelected ? '#0891b2' : 'rgba(255,255,255,0.06)';
    const stroke = isSelected ? '#0891b2' : 'rgba(255,255,255,0.08)';
    const textFill = isSelected ? 'white' : '#a0a0b8';

    svg += `<rect x="${cx - cellW/2 + 4}" y="${cy - cellH/2 + 4}" width="${cellW - 8}" height="${cellH - 8}" rx="12" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`;
    svg += `<text x="${cx}" y="${cy + 7}" font-family="Arial, sans-serif" font-weight="700" font-size="24" fill="${textFill}" text-anchor="middle">${letter}</text>`;
  });
  return svg;
}

// --- Screenshot 5: Stats Screen ---
function screenshot5() {
  const y0 = CONTENT_TOP;
  const halfW = (CARD_W - 20) / 2;

  const screen = `
    <!-- Header -->
    <text x="${CX}" y="${y0 + 40}" font-family="Arial, sans-serif" font-weight="700" font-size="28" fill="white" text-anchor="middle">Your Progress</text>

    <!-- Stat cards row 1 -->
    ${statCard(CARD_X, y0 + 70, halfW, '87%', 'Accuracy', '#10b981')}
    ${statCard(CARD_X + halfW + 20, y0 + 70, halfW, '42', 'Sessions', '#7c3aed')}

    <!-- Stat cards row 2 -->
    ${statCard(CARD_X, y0 + 200, halfW, '7', 'Day Streak', '#f59e0b')}
    ${statCard(CARD_X + halfW + 20, y0 + 200, halfW, '14', 'Best Streak', '#ef4444')}

    <!-- Letter accuracy section -->
    <text x="${CARD_X}" y="${y0 + 360}" font-family="Arial, sans-serif" font-weight="700" font-size="22" fill="white">Letter Accuracy</text>

    ${letterAccuracyBars(CARD_X, y0 + 385, CARD_W)}
  `;
  return phoneFrame(screen, 'Track Your Progress', 'Detailed stats and letter accuracy');
}

function statCard(x, y, w, value, label, color) {
  return `
    <rect x="${x}" y="${y}" width="${w}" height="115" rx="18" fill="url(#cardGrad)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    <text x="${x + w/2}" y="${y + 58}" font-family="Arial Black, sans-serif" font-weight="900" font-size="44" fill="${color}" text-anchor="middle">${value}</text>
    <text x="${x + w/2}" y="${y + 90}" font-family="Arial, sans-serif" font-weight="500" font-size="17" fill="#a0a0b8" text-anchor="middle">${label}</text>
  `;
}

function letterAccuracyBars(x, y, w) {
  const letters = [
    { l: 'A', pct: 100 }, { l: 'B', pct: 95 }, { l: 'C', pct: 90 },
    { l: 'D', pct: 85 }, { l: 'E', pct: 100 }, { l: 'F', pct: 80 },
    { l: 'G', pct: 70 }, { l: 'H', pct: 75 }, { l: 'I', pct: 95 },
    { l: 'J', pct: 60 }, { l: 'K', pct: 85 }, { l: 'L', pct: 90 },
    { l: 'M', pct: 100 }, { l: 'N', pct: 65 },
  ];
  const barH = 30;
  const gap = 4;
  let svg = '';

  letters.forEach((item, i) => {
    const by = y + i * (barH + gap);
    const barW = w - 60;
    const fillW = barW * (item.pct / 100);
    const color = item.pct >= 90 ? '#10b981' : item.pct >= 70 ? '#f59e0b' : '#ef4444';

    svg += `<text x="${x + 2}" y="${by + 20}" font-family="Arial, sans-serif" font-weight="700" font-size="16" fill="white">${item.l}</text>`;
    svg += `<rect x="${x + 30}" y="${by + 4}" width="${barW}" height="${barH - 8}" rx="5" fill="rgba(255,255,255,0.06)"/>`;
    svg += `<rect x="${x + 30}" y="${by + 4}" width="${fillW}" height="${barH - 8}" rx="5" fill="${color}" opacity="0.85"/>`;
    svg += `<text x="${x + w}" y="${by + 20}" font-family="Arial, sans-serif" font-size="14" fill="${color}" text-anchor="end" font-weight="600">${item.pct}%</text>`;
  });
  return svg;
}

// --- Screenshot 6: Achievements ---
function screenshot6() {
  const y0 = CONTENT_TOP;
  const colW = (CARD_W - 20) / 2;

  const achievements = [
    { emoji: '&#x1F476;', name: 'First Steps', desc: 'Complete your first quiz', unlocked: true },
    { emoji: '&#x1F3AF;', name: 'Perfect 10', desc: 'Score 10/10 on a quiz', unlocked: true },
    { emoji: '&#x1F4AB;', name: 'Flawless', desc: '100% on full alphabet', unlocked: true },
    { emoji: '&#x1F525;', name: 'On a Roll', desc: '3-day streak', unlocked: true },
    { emoji: '&#x2694;', name: 'Week Warrior', desc: '7-day streak', unlocked: true },
    { emoji: '&#x1F9D1;', name: 'Scholar', desc: '70%+ on all letters', unlocked: false },
    { emoji: '&#x26A1;', name: 'Speed Demon', desc: 'Quiz under 30 seconds', unlocked: false },
    { emoji: '&#x1F396;', name: 'Centurion', desc: '100 quiz sessions', unlocked: false },
    { emoji: '&#x1F4C5;', name: 'Weekly Regular', desc: '7 daily challenges', unlocked: false },
    { emoji: '&#x1F3C6;', name: 'Monthly Master', desc: '30-day streak', unlocked: false },
  ];

  const rowH = 155;
  let cards = '';
  achievements.forEach((a, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const ax = CARD_X + col * (colW + 20);
    const ay = y0 + 90 + row * rowH;
    const opacity = a.unlocked ? 1 : 0.35;
    const borderColor = a.unlocked ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.05)';

    cards += `
      <g opacity="${opacity}">
        <rect x="${ax}" y="${ay}" width="${colW}" height="${rowH - 15}" rx="18" fill="url(#cardGrad)" stroke="${borderColor}" stroke-width="1.5"/>
        <text x="${ax + colW/2}" y="${ay + 45}" font-size="34" text-anchor="middle">${a.emoji}</text>
        <text x="${ax + colW/2}" y="${ay + 80}" font-family="Arial, sans-serif" font-weight="700" font-size="17" fill="white" text-anchor="middle">${a.name}</text>
        <text x="${ax + colW/2}" y="${ay + 102}" font-family="Arial, sans-serif" font-size="13" fill="#a0a0b8" text-anchor="middle">${a.desc}</text>
        ${a.unlocked ? `<text x="${ax + colW/2}" y="${ay + 126}" font-family="Arial, sans-serif" font-size="13" fill="#10b981" text-anchor="middle" font-weight="600">&#x2713; Unlocked</text>` : ''}
      </g>`;
  });

  const screen = `
    <text x="${CX}" y="${y0 + 40}" font-family="Arial, sans-serif" font-weight="700" font-size="28" fill="white" text-anchor="middle">Achievements</text>
    <text x="${CX}" y="${y0 + 68}" font-family="Arial, sans-serif" font-size="16" fill="#a0a0b8" text-anchor="middle">5 of 15 unlocked</text>
    ${cards}
  `;
  return phoneFrame(screen, 'Earn Achievements', '15 badges to unlock as you learn');
}

async function generate() {
  console.log('Generating Play Store screenshots (1080x1920, 9:16)...\n');

  const screenshots = [
    { fn: screenshot1, name: 'screenshot-1-home' },
    { fn: screenshot2, name: 'screenshot-2-quiz' },
    { fn: screenshot3, name: 'screenshot-3-flashcards' },
    { fn: screenshot4, name: 'screenshot-4-morse' },
    { fn: screenshot5, name: 'screenshot-5-stats' },
    { fn: screenshot6, name: 'screenshot-6-achievements' },
  ];

  for (const s of screenshots) {
    const svg = s.fn();
    await sharp(Buffer.from(svg))
      .png()
      .toFile(path.join(STORE, `${s.name}.png`));
    console.log(`  ✓ ${s.name}.png (1080x1920)`);
  }

  console.log(`\nDone! ${screenshots.length} screenshots saved to store-assets/`);
}

generate().catch(console.error);
