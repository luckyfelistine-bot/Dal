<div align="center">

<img src="https://raw.githubusercontent.com/luckyfelistine-bot/Dal/main/Images/Beautiful.jpeg" width="180" style="border-radius: 50%; box-shadow: 0 0 50px rgba(232, 160, 191, 0.6);" />

# 💫 Happy Birthday Dal 💫

### *A love letter written in stardust, code, and infinite devotion*

[![Made with Love](https://img.shields.io/badge/Made%20With-💖-ff69b4?style=for-the-badge)](https://github.com/luckyfelistine-bot/Dal)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

</div>

---

## 🌌 What Is This?

This is not just a birthday page. This is a **universe** built for one person — **Dal**.

A deeply personal, interactive love experience featuring a heaven gate PIN system, 10 immersive sections, a cosmic particle engine, and memories woven into every pixel. Every animation, every word, every star was placed with intention.

> *"In a universe of billions of stars, I found the one that shines just for me."*

---

## ✨ Features

### 🔐 Heaven Gate PIN System
- Enter **`****`** to unlock the gates to paradise
- Animated starfield, light rays, and a lock that pulses with anticipation
- Wrong PIN? The dots shake. Right PIN? The gates swing open in golden light.

### 📜 10 Beautiful Sections
| Section | What It Does |
|---------|-------------|
| 🌟 **Hero** | Full-screen animated title with floating particles |
| 💬 **Quote** | A love poem that fades in like a whisper |
| 📅 **Timeline** | Your journey together — from the beginning to forever |
| 💌 **Messages** | Six cards revealing what Dal means to you |
| 🕯️ **Candles** | Interactive 3D candles — tap to blow them out and make a wish |
| 🖼️ **Gallery** | Memory photos with hover effects and lightbox |
| 💖 **Love Meter** | A draggable heart that calculates infinite love |
| 🎁 **Gift** | A 3D gift box that opens with confetti explosion |
| 🎵 **Music** | Custom playlist with visualizer and progress bar |
| ⏰ **Countdown** | Counting down to the next birthday |

### 🌌 Universe of Love
A **cosmic particle engine** built from scratch:
- 🕳️ **Supermassive Black Hole** with photon ring, accretion disk & gravitational lensing
- 💖 **80 Love Emojis** spiraling out from the singularity
- 🌀 **3 Pattern Formations**: Heart shape → Infinity symbol → Constellation
- ♾️ **Infinite Cycle**: Spiral → Pattern → Hold → Dissolve → Repeat forever
- 🖱️ **Mouse Gravity**: Particles attracted to your cursor
- 💥 **Click Ripples**: Burst particles anywhere
- 💫 **Shooting Stars** with colored trails
- 👻 **Ghost Texts**: Ethereal love phrases floating in the void
- 💌 **Love Letters**: 12 cosmic messages type out with blinking cursor
- 📸 **Memory Stars**: Photos fade in as floating polaroids
- ⚡ **Warp Speed**: Tap the center heart for light-speed burst
- 📱 **Fully Responsive**: Touch support on mobile

### 🎓 Exam Wishes Event
- Breathing exercise, progress bar, quotes, reveal cards, heartfelt letter
- **Click the breathe circle** to start a guided breathing animation

---

## 🚀 Quick Start

### Option 1: Open Directly
```bash
git clone https://github.com/luckyfelistine-bot/Dal.git
cd Dal
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

### Option 2: Local Server (Recommended)
```bash
python -m http.server 8080
# Visit http://localhost:8080
```

---

## 📁 Project Structure

```
Dal/
├── index.html          # Main HTML — 10 sections + heaven gate
├── styles.css          # All styles — gate, sections, events, universe
├── main.js             # All JavaScript — PIN, audio, fireworks, universe engine
├── Images/
│   ├── Beautiful.jpeg
│   ├── Charming.jpg
│   ├── Chearful.jpg
│   ├── Perfect.jpg
│   └── Queen 👑.jpg
└── Music/
    ├── A_Thousand_Years.mp3
    ├── Die_with_you.mp3
    └── Ordinary.aac
```

---

## 🎨 Customization

### Change the PIN
```javascript
const CORRECT_PIN = '****';
```

### Add More Events
The modular `EVENTS` array auto-generates buttons and popups:
```javascript
const EVENTS = [
  { id: 'exam-wishes', label: 'Exam Wishes', icon: '🎓', ... },
  { id: 'universe-of-love', label: 'Universe of Love', icon: '🌌', ... }
];
```

### Add More Love Letters
Expand the `loveLetters` array in the `universe-of-love` event.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **HTML5** | Semantic structure, canvas, audio |
| **CSS3** | Animations, gradients, transforms, filters |
| **Vanilla JavaScript** | Particle systems, canvas rendering, DOM manipulation |
| **Canvas 2D API** | Universe engine, fireworks, ambient background |
| **Web Audio API** | Music player with visualizer |
| **Intersection Observer** | Scroll-triggered animations, meter cleanup |
| **requestAnimationFrame** | 60fps smooth animations |

---

## ♿ Accessibility

- ✅ **Keyboard Navigation**: Arrow keys, Space (music), Escape (popup), PIN digits
- ✅ **Focus Indicators**: Visible `:focus-visible` styles on all interactive elements
- ✅ **Skip Link**: Jump to main content for screen readers
- ✅ **Reduced Motion**: Respects `prefers-reduced-motion` — pauses canvas, disables animations
- ✅ **Image Alt Text**: All gallery images have descriptive alt attributes
- ✅ **Error Handling**: Images fail gracefully, audio has fallback toasts

---

## 🔧 Bug Fixes & Improvements

| Fix | What Changed |
|-----|-------------|
| **Duplicate Event Listeners** | `setupCursorHover()` now uses a flag to prevent re-attachment |
| **Memory Leak** | Infinity meter intervals clear when section scrolls out of view |
| **Loader Safety** | Null check before accessing loader element |
| **Song Bounds** | `loadSong()` validates index before accessing array |
| **Universe Resize** | Only runs when universe popup is actually active |
| **Escape Safety** | Only closes popup if it's actually open |
| **PIN Animation** | Force reflow prevents animation interruption on rapid typing |
| **Canvas Performance** | Ambient canvas pauses when browser tab is hidden |
| **Breathe Circle** | Click to toggle a guided breathing animation |
| **Energy Bar** | Pulses continuously after filling to 100% |
| **Image Errors** | Gallery images hide gracefully if they fail to load |
| **Focus Styles** | All interactive elements have visible focus indicators |
| **Reduced Motion** | Full support for users who prefer less animation |

---

## 💖 Credits

- **Built with infinite love** for Dal
- **Music**: John Michael Howell, JVKE, ZVC — *A Thousand Years* | Juice WRLD — *Die With You*
- **Fonts**: Cormorant Garamond, Playfair Display, Poppins
- **Inspiration**: The universe itself, and the person who makes it worth exploring

---

<div align="center">

### *Happy Birthday, Dal. The universe celebrates you.* 🌌💖

<img src="https://raw.githubusercontent.com/luckyfelistine-bot/Dal/main/Images/Perfect.jpg" width="150" style="border-radius: 12px;" />

</div>
