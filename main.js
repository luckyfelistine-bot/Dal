// ===================== PIN PAD & HEAVEN GATE =====================
// These must be window-global for onclick handlers to work
window.CORRECT_PIN = '2007';
window.gateUnlocked = false;
window.currentPin = '';
window.isProcessing = false;

function generateGateStars() {
  const container = document.getElementById('gateStars');
  if (!container) return;
  for (let i = 0; i < 80; i++) {
    const star = document.createElement('div');
    star.className = 'gate-star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = (Math.random() * 3) + 's';
    star.style.animationDuration = (2 + Math.random() * 3) + 's';
    star.style.width = (1 + Math.random() * 2) + 'px';
    star.style.height = star.style.width;
    container.appendChild(star);
  }
}

// Handle keyboard input for PIN
document.addEventListener('keydown', function(e) {
  if (window.gateUnlocked || window.isProcessing) return;
  const gate = document.getElementById('heavenGate');
  if (!gate || gate.style.display === 'none') return;

  if (e.key >= '0' && e.key <= '9') {
    e.preventDefault();
    window.pressPinKey(e.key);
  } else if (e.key === 'Backspace') {
    e.preventDefault();
    window.clearPin();
  } else if (e.key === 'Escape') {
    e.preventDefault();
    window.clearPin();
  }
});

window.pressPinKey = function(digit) {
  if (window.gateUnlocked || window.isProcessing) return;
  if (window.currentPin.length >= 4) return;

  window.currentPin += digit;
  window.updatePinDots();

  // Animate the key press
  const keys = document.querySelectorAll('.pin-key');
  keys.forEach(function(key) {
    if (key.textContent === digit) {
      key.style.transform = 'scale(0.9)';
      key.style.background = 'rgba(244,208,63,0.3)';
      key.style.borderColor = 'var(--gold)';
      setTimeout(function() {
        key.style.transform = '';
        key.style.background = '';
        key.style.borderColor = '';
      }, 150);
    }
  });

  // Check if PIN is complete
  if (window.currentPin.length === 4) {
    setTimeout(function() { window.checkPin(); }, 300);
  }
};

window.clearPin = function() {
  if (window.gateUnlocked || window.isProcessing) return;
  window.currentPin = '';
  window.updatePinDots();
  const error = document.getElementById('gateError');
  if (error) error.classList.remove('show');
};

window.updatePinDots = function() {
  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById('pinDot' + i);
    if (dot) {
      dot.classList.toggle('filled', i < window.currentPin.length);
      dot.classList.remove('correct', 'wrong');
    }
  }
};

window.checkPin = function() {
  if (window.isProcessing) return;
  window.isProcessing = true;

  const error = document.getElementById('gateError');
  const gate = document.getElementById('heavenGate');

  if (window.currentPin === window.CORRECT_PIN) {
    // CORRECT
    for (let i = 0; i < 4; i++) {
      const dot = document.getElementById('pinDot' + i);
      if (dot) dot.classList.add('correct');
    }
    if (error) error.classList.remove('show');

    const pinArea = document.getElementById('gatePinArea');
    if (pinArea) pinArea.classList.add('fade-out');

    setTimeout(function() {
      window.unlockGateSequence();
    }, 500);

  } else {
    // WRONG
    for (let i = 0; i < 4; i++) {
      const dot = document.getElementById('pinDot' + i);
      if (dot) {
        dot.classList.add('wrong');
        dot.classList.remove('filled');
      }
    }
    if (error) error.classList.add('show');

    const keypad = document.querySelector('.pin-keypad');
    if (keypad) {
      keypad.style.animation = 'none';
      keypad.offsetHeight;
      keypad.style.animation = 'pinShake 0.4s ease';
      setTimeout(function() { keypad.style.animation = ''; }, 400);
    }

    setTimeout(function() {
      window.currentPin = '';
      window.updatePinDots();
      if (error) error.classList.remove('show');
      window.isProcessing = false;
    }, 1200);
  }
};

window.unlockGateSequence = function() {
  window.gateUnlocked = true;
  const gate = document.getElementById('heavenGate');

  const lockGlow = document.getElementById('lockGlow');
  if (lockGlow) lockGlow.classList.add('active');

  setTimeout(function() {
    const shackle = document.getElementById('lockShackle');
    if (shackle) shackle.classList.add('open');

    setTimeout(function() {
      const lockEl = document.getElementById('gateLock');
      if (lockEl) lockEl.classList.add('unlocked');

      setTimeout(function() {
        const leftGate = document.getElementById('gateLeft');
        const rightGate = document.getElementById('gateRight');
        if (leftGate) leftGate.classList.add('open');
        if (rightGate) rightGate.classList.add('open');

        window.burstGateParticles();

        setTimeout(function() {
          const welcome = document.getElementById('gateWelcome');
          if (welcome) welcome.classList.add('show');

          setTimeout(function() {
            gate.classList.add('unlocked');

            setTimeout(function() {
              gate.style.display = 'none';
              showToast('Welcome home, Dal 💫');

              setTimeout(function() {
                const loaderEl = document.getElementById('loader'); if (loaderEl) loaderEl.classList.add('hidden');
                const eyebrow = document.getElementById('heroEyebrow');
                const name = document.getElementById('heroName');
                const sub = document.getElementById('heroSub');
                const date = document.getElementById('heroDate');
                if (eyebrow) eyebrow.classList.add('visible');
                if (name) name.classList.add('visible');
                if (sub) sub.classList.add('visible');
                if (date) date.classList.add('visible');
              }, 500);

            }, 2000);

          }, 2500);

        }, 800);

      }, 600);

    }, 400);

  }, 600);
};

window.burstGateParticles = function() {
  const emojis = ['✨', '💫', '💖', '💛', '🌟', '✦', '💫', '💖'];
  const colors = ['#ffd6e0', '#e2d5f8', '#f4d03f', '#f8b4c0', '#c8e6c9'];

  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'gate-particle';
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.left = '50%';
    p.style.top = '50%';
    p.style.fontSize = (14 + Math.random() * 20) + 'px';
    p.style.color = colors[Math.floor(Math.random() * colors.length)];
    p.style.setProperty('--tx', (Math.random() - 0.5) * 400 + 'px');
    p.style.setProperty('--ty', (Math.random() - 0.5) * 400 + 'px');
    p.style.animationDelay = (Math.random() * 0.5) + 's';
    document.body.appendChild(p);

    requestAnimationFrame(function() {
      p.classList.add('burst');
    });

    setTimeout(function() { p.remove(); }, 2500);
  }
};

generateGateStars();

// ===================== AUDIO ENGINE =====================
const audioPlayer = document.getElementById('audioPlayer');
let isPlaying = false;
let currentSongIndex = 0;

const songs = [
  {
    src: 'Music/John_Michael_Howell,_JVKE,___ZVC_-_A_Thousand_Years_%5BOFFICIAL_LYRIC_VIDEO%5D(256k).mp3',
    title: 'A Thousand Years',
    artist: 'John Michael Howell, JVKE, ZVC',
    duration: '3:45'
  },
  {
    src: 'Music/Juice_wrld_-_Die_with_you__unreleased_music_video(256k).mp3',
    title: 'Die With You',
    artist: 'Juice WRLD',
    duration: '3:30'
  },
  {
    src: 'Music/Ordinary.aac',
    title: 'Ordinary',
    artist: 'Our Song',
    duration: '3:15'
  }
];

function loadSong(index) {
  if (index < 0 || index >= songs.length) {
    console.warn('Invalid song index:', index);
    return;
  }
  currentSongIndex = index;
  if (!audioPlayer) return;
  audioPlayer.src = songs[index].src;
  const trackEl = document.getElementById('musicTrack');
  const artistEl = document.getElementById('musicArtist');
  const totalEl = document.getElementById('totalTime');
  if (trackEl) trackEl.textContent = songs[index].title;
  if (artistEl) artistEl.textContent = songs[index].artist;
  if (totalEl) totalEl.textContent = songs[index].duration;
  updatePlaylistActive();
}

function toggleMusicPlayer() {
  if (!audioPlayer) return;
  if (!audioPlayer.src) loadSong(0);
  if (audioPlayer.paused) {
    audioPlayer.play().then(() => {
      isPlaying = true;
      const playBtn = document.getElementById('playBtn');
      const disc = document.getElementById('musicDisc');
      if (playBtn) playBtn.innerHTML = '⏸';
      if (disc) disc.classList.remove('paused');
      document.querySelectorAll('.music-bar').forEach(b => b.style.animationPlayState = 'running');
      showToast('Playing: ' + songs[currentSongIndex].title + ' 💫');
    }).catch(() => {
      showToast('Tap the play button again to start audio');
    });
  } else {
    audioPlayer.pause();
    isPlaying = false;
    const playBtn = document.getElementById('playBtn');
    const disc = document.getElementById('musicDisc');
    if (playBtn) playBtn.innerHTML = '▶';
    if (disc) disc.classList.add('paused');
    document.querySelectorAll('.music-bar').forEach(b => b.style.animationPlayState = 'paused');
  }
}

function prevSong() {
  let idx = currentSongIndex - 1;
  if (idx < 0) idx = songs.length - 1;
  loadSong(idx);
  if (isPlaying && audioPlayer) audioPlayer.play();
}

function nextSong() {
  let idx = currentSongIndex + 1;
  if (idx >= songs.length) idx = 0;
  loadSong(idx);
  if (isPlaying && audioPlayer) audioPlayer.play();
}

function selectSong(index) {
  loadSong(index);
  if (!audioPlayer) return;
  audioPlayer.play().then(() => {
    isPlaying = true;
    const playBtn = document.getElementById('playBtn');
    const disc = document.getElementById('musicDisc');
    if (playBtn) playBtn.innerHTML = '⏸';
    if (disc) disc.classList.remove('paused');
    document.querySelectorAll('.music-bar').forEach(b => b.style.animationPlayState = 'running');
  });
}

function togglePlaylist() {
  const playlist = document.getElementById('playlist');
  if (playlist) playlist.classList.toggle('show');
}

function updatePlaylistActive() {
  document.querySelectorAll('.playlist-item').forEach((item, i) => {
    item.classList.toggle('active', i === currentSongIndex);
  });
}

function seekMusic(e) {
  const progress = document.getElementById('musicProgress');
  if (!progress || !audioPlayer || !audioPlayer.duration) return;
  const rect = progress.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  audioPlayer.currentTime = pct * audioPlayer.duration;
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m + ':' + String(s).padStart(2, '0');
}

if (audioPlayer) {
  audioPlayer.addEventListener('timeupdate', () => {
    if (audioPlayer.duration) {
      const pct = (audioPlayer.currentTime / audioPlayer.duration) * 100;
      const bar = document.getElementById('progressBar');
      const curr = document.getElementById('currentTime');
      if (bar) bar.style.width = pct + '%';
      if (curr) curr.textContent = formatTime(audioPlayer.currentTime);
    }
  });
  audioPlayer.addEventListener('ended', () => {
    nextSong();
  });
}

// ===================== CUSTOM CURSOR =====================
const dot = document.getElementById('cursorDot');
const outline = document.getElementById('cursorOutline');
let mouseX = 0, mouseY = 0, outlineX = 0, outlineY = 0;

function updateCursor(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (dot) {
    dot.style.left = (mouseX - 4) + 'px';
    dot.style.top = (mouseY - 4) + 'px';
  }
}

function animateOutline() {
  outlineX += (mouseX - outlineX) * 0.15;
  outlineY += (mouseY - outlineY) * 0.15;
  if (outline) {
    outline.style.left = (outlineX - 20) + 'px';
    outline.style.top = (outlineY - 20) + 'px';
  }
  requestAnimationFrame(animateOutline);
}

document.addEventListener('mousemove', updateCursor);
animateOutline();

let cursorHoverSetupDone = false;
function setupCursorHover() {
  if (cursorHoverSetupDone) return;
  cursorHoverSetupDone = true;
  const selectors = 'button,.candle-3d,.gift-box-3d,.gallery-item,.message-card,.nav-dot,.meter-heart,.playlist-item,.music-progress,.event-btn,.event-card,.event-dot,.event-close,.event-heart-container,.gate-input,.universe-center-heart';
  document.querySelectorAll(selectors).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// ===================== AMBIENT CANVAS =====================
const ambientCanvas = document.getElementById('ambientCanvas');
const actx = ambientCanvas ? ambientCanvas.getContext('2d') : null;
let ambientW, ambientH, ambientParticles = [];

function resizeAmbient() {
  if (!ambientCanvas) return;
  ambientW = ambientCanvas.width = window.innerWidth;
  ambientH = ambientCanvas.height = window.innerHeight;
}
resizeAmbient();
window.addEventListener('resize', resizeAmbient);

class AmbientParticle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * ambientW;
    this.y = Math.random() * ambientH;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.hue = Math.random() * 60 + 300;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > ambientW || this.y < 0 || this.y > ambientH) this.reset();
  }
  draw() {
    if (!actx) return;
    actx.beginPath();
    actx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    actx.fillStyle = `hsla(${this.hue},80%,70%,${this.opacity})`;
    actx.fill();
  }
}

for (let i = 0; i < 100; i++) ambientParticles.push(new AmbientParticle());

let ambientFrame = 0;
function animateAmbient() {
  if (!actx || !ambientCanvas) return;
  if (document.hidden) {
    ambientFrame++;
    requestAnimationFrame(animateAmbient);
    return;
  }
  actx.clearRect(0, 0, ambientW, ambientH);
  ambientParticles.forEach(p => { p.update(); p.draw(); });
  if (ambientFrame % 2 === 0) {
    for (let i = 0; i < ambientParticles.length; i += 2) {
      for (let j = i + 1; j < ambientParticles.length; j += 3) {
        const dx = ambientParticles[i].x - ambientParticles[j].x;
        const dy = ambientParticles[i].y - ambientParticles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          actx.beginPath();
          actx.moveTo(ambientParticles[i].x, ambientParticles[i].y);
          actx.lineTo(ambientParticles[j].x, ambientParticles[j].y);
          actx.strokeStyle = `rgba(255,214,224,${0.1 * (1 - dist / 100)})`;
          actx.lineWidth = 0.5;
          actx.stroke();
        }
      }
    }
  }
  ambientFrame++;
  requestAnimationFrame(animateAmbient);
}
animateAmbient();

// ===================== SCROLL OBSERVER =====================
const sections = document.querySelectorAll('.section');
const navDots = document.querySelectorAll('.nav-dot');
let currentSection = 0;

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      const idx = Array.from(sections).indexOf(entry.target);
      currentSection = idx;
      navDots.forEach((d, i) => d.classList.toggle('active', i === idx));

      if (entry.target.id === 'section2') {
        document.querySelectorAll('.timeline-item').forEach((item, i) => {
          setTimeout(() => item.classList.add('visible'), i * 200);
        });
      }
      if (entry.target.id === 'section3') {
        document.querySelectorAll('.message-card').forEach((card, i) => {
          setTimeout(() => card.classList.add('visible'), i * 150);
        });
      }
      if (entry.target.id === 'section5') {
        document.querySelectorAll('.gallery-item').forEach((item, i) => {
          setTimeout(() => item.classList.add('visible'), i * 100);
        });
      }
      if (entry.target.id === 'section6') {
        setTimeout(() => { startInfinityMeter(); }, 500);
      }
    }
  });
}, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

sections.forEach(s => observer.observe(s));

function scrollToSection(idx) {
  if (idx >= 0 && idx < sections.length) {
    sections[idx].scrollIntoView({ behavior: 'smooth' });
  }
}

// ===================== INFINITY LOVE METER =====================
let meterInterval = null;
let meterSparkleInterval = null;
let meterStarted = false;

function startInfinityMeter() {
  if (meterStarted) return;
  meterStarted = true;
  const fill = document.getElementById('meterFill');
  const pctEl = document.getElementById('meterPercent');
  const desc = document.getElementById('meterDesc');
  const wrap = document.getElementById('meterHeartWrap');
  const particlesBox = document.getElementById('meterParticles');
  const section = document.getElementById('loveMeter');

  if (!fill || !pctEl || !desc) return;
  fill.style.width = '100%';
  fill.classList.add('infinite');

  let count = 0;
  const countUp = setInterval(() => {
    count++;
    pctEl.textContent = count + '%';
    if (count >= 100) {
      clearInterval(countUp);
      pctEl.innerHTML = '∞%';
      pctEl.classList.add('infinity');
      desc.textContent = 'Beyond numbers. Beyond time. Beyond everything.';
      desc.classList.add('glow');
      if (wrap) wrap.style.animation = 'heartBeat 0.8s ease-in-out infinite';
      createFirework(window.innerWidth / 2, window.innerHeight / 2);
      startMeterSparkles(particlesBox);
      let beyond = 0;
      meterInterval = setInterval(() => {
        beyond++;
        if (beyond % 4 === 0) pctEl.style.transform = 'scale(1.1)';
        else pctEl.style.transform = 'scale(1)';
      }, 800);
    }
  }, 25);

  if (section && 'IntersectionObserver' in window) {
    const meterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          if (meterInterval) { clearInterval(meterInterval); meterInterval = null; }
          if (meterSparkleInterval) { clearInterval(meterSparkleInterval); meterSparkleInterval = null; }
        }
      });
    }, { threshold: 0.1 });
    meterObserver.observe(section);
  }
}

function startMeterSparkles(container) {
  if (!container) return;
  const emojis = ['✨', '💫', '💖', '💛', '🌟'];
  meterSparkleInterval = setInterval(() => {
    const el = document.createElement('div');
    el.className = 'meter-particle';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = Math.random() * 100 + '%';
    el.style.top = Math.random() * 100 + '%';
    el.style.animationDuration = (3 + Math.random() * 2) + 's';
    el.style.animationDelay = (Math.random() * 2) + 's';
    container.appendChild(el);
    if (container.children.length > 12) container.removeChild(container.firstChild);
  }, 600);
}

function pulseHeart() {
  const heart = document.getElementById('meterHeart');
  if (heart) {
    heart.style.transform = 'scale(1.4)';
    setTimeout(() => heart.style.transform = 'scale(1)', 300);
  }
  createFirework(window.innerWidth / 2, window.innerHeight / 2);
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      createFirework(Math.random() * window.innerWidth, Math.random() * window.innerHeight * 0.6);
    }, i * 150);
  }
}

// ===================== 3D TILT =====================
function setupTilt() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  });
}
setupTilt();

// ===================== CANDLES =====================
let blownCandles3d = 0;
const wishes = ['A wish for endless love...', 'A wish for pure joy...', 'A wish for forever together...'];

function blowCandle3d(el) {
  if (el.classList.contains('blown')) return;
  el.classList.add('blown');
  blownCandles3d++;
  const rect = el.getBoundingClientRect();
  for (let i = 0; i < 12; i++) {
    const spark = document.createElement('div');
    spark.style.cssText = `position:fixed;left:${rect.left + rect.width / 2}px;top:${rect.top}px;width:5px;height:5px;border-radius:50%;pointer-events:none;z-index:200;background:${['#ffd6e0', '#e2d5f8', '#f4d03f', '#f8b4c0'][Math.floor(Math.random() * 4)]};transition:all 0.8s ease-out;`;
    document.body.appendChild(spark);
    requestAnimationFrame(() => {
      spark.style.transform = `translate(${(Math.random() - 0.5) * 80}px,${-Math.random() * 60}px) scale(0)`;
      spark.style.opacity = '0';
    });
    setTimeout(() => spark.remove(), 900);
  }
  const wishText = document.getElementById('candleWishText');
  if (wishText) {
    wishText.textContent = wishes[blownCandles3d - 1];
    wishText.classList.add('show');
    setTimeout(() => wishText.classList.remove('show'), 2000);
  }
  if (blownCandles3d === 3) {
    setTimeout(() => {
      showToast('All wishes made! The stars are listening ✨');
      for (let i = 0; i < 5; i++) {
        setTimeout(() => createFirework(Math.random() * window.innerWidth, Math.random() * window.innerHeight * 0.5), i * 300);
      }
    }, 800);
  }
}

// ===================== GIFT =====================
const letterHTML = `My Dearest Dal,<br><br>
There aren't enough words in any language to describe what you mean to me.<br><br>
You are the first thought that greets me when I wake,<br>
and the last prayer I whisper before I sleep.<br><br>
You make ordinary moments feel like <span class="accent">magic</span>.<br>
You make silence feel like a <span class="accent">symphony</span>.<br>
You make distance feel like nothing at all.<br><br>
I promise to love you on the good days.<br>
I promise to love you harder on the bad ones.<br>
I promise to keep choosing you — <span class="accent">today, tomorrow, and every day after</span>.<br><br>
Happy Birthday, my love.<br>
May your year be as radiant as your smile,<br>
as warm as your heart,<br>
and as endless as my love for you.<br><br>
<span class="accent">You are my infinite.</span>`;

let giftOpened3d = false;
function openGift3d() {
  if (giftOpened3d) return;
  giftOpened3d = true;
  const box = document.getElementById('giftBox3d');
  if (box) box.classList.add('opened');
  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      createFirework(Math.random() * window.innerWidth, Math.random() * window.innerHeight * 0.6);
    }, i * 200);
  }
  const shapes = ['✨', '🎉', '💫', '💖', '🌟', '🎊', '💛', '🥳'];
  const colors = ['#ffd6e0', '#e2d5f8', '#f4d03f', '#f8b4c0', '#c8e6c9'];
  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      const c = document.createElement('div');
      c.className = 'confetti-piece';
      c.innerHTML = shapes[Math.floor(Math.random() * shapes.length)];
      c.style.cssText = `left:${Math.random() * 100}%;top:-20px;font-size:${16 + Math.random() * 20}px;color:${colors[Math.floor(Math.random() * colors.length)]};animation-duration:${2.5 + Math.random() * 2}s;z-index:200;`;
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 4500);
    }, i * 60);
  }
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      const b = document.createElement('div');
      b.style.cssText = `position:fixed;left:${10 + Math.random() * 80}%;bottom:-50px;font-size:${30 + Math.random() * 20}px;animation:balloonUp 7s ease-in forwards;pointer-events:none;z-index:199;filter:hue-rotate(${Math.random() * 360}deg);`;
      b.textContent = '🎈';
      document.body.appendChild(b);
      setTimeout(() => b.remove(), 7500);
    }, i * 300);
  }
  setTimeout(() => {
    const letter = document.getElementById('giftLetter');
    const typeEl = document.getElementById('letterType');
    if (letter) letter.classList.add('show');
    if (typeEl) typeWriter(typeEl, letterHTML, 0);
  }, 500);
  setTimeout(() => {
    const sig = document.getElementById('letterSig');
    if (sig) sig.classList.add('show');
  }, 3500);
  showToast('Happy Birthday Dal! 🎉💫');
}

function typeWriter(el, text, i) {
  if (!el) return;
  if (i === 0) el.innerHTML = '';
  if (i >= text.length) return;
  if (text.charAt(i) === '<') {
    const close = text.indexOf('>', i);
    if (close !== -1) { el.innerHTML += text.substring(i, close + 1); i = close + 1; }
    else { i++; }
  } else { el.innerHTML += text.charAt(i); i++; }
  setTimeout(() => typeWriter(el, text, i), 18 + Math.random() * 18);
}

// ===================== FIREWORKS ENGINE =====================
const fxCanvas = document.getElementById('fxCanvas');
const fxCtx = fxCanvas ? fxCanvas.getContext('2d') : null;
let fxW, fxH, fireworks = [];

function resizeFx() {
  if (!fxCanvas) return;
  fxW = fxCanvas.width = window.innerWidth;
  fxH = fxCanvas.height = window.innerHeight;
}
resizeFx();
window.addEventListener('resize', resizeFx);

function createFirework(x, y) {
  if (!fxCtx) return;
  const particles = [];
  const colors = ['#ffd6e0', '#e2d5f8', '#f4d03f', '#f8b4c0', '#c8e6c9', '#ff6b6b', '#ffd93d'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const count = 40 + Math.random() * 20;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 / count) * i + Math.random() * 0.8;
    const speed = 2 + Math.random() * 5;
    particles.push({
      x: x, y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: 0.01 + Math.random() * 0.015,
      color: color,
      size: 2 + Math.random() * 4,
      gravity: 0.08
    });
  }
  fireworks.push({ particles: particles });
}

let fxFrame = 0;
function animateFx() {
  if (!fxCtx || !fxCanvas) return;
  fxCtx.clearRect(0, 0, fxW, fxH);
  fxCtx.globalCompositeOperation = 'screen';
  fireworks.forEach(fw => {
    fw.particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += p.gravity;
      p.life -= p.decay;
      if (p.life > 0) {
        fxCtx.globalAlpha = p.life;
        fxCtx.fillStyle = p.color;
        fxCtx.beginPath();
        fxCtx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        fxCtx.fill();
        if (Math.random() > 0.7) {
          fxCtx.fillStyle = 'rgba(255,255,255,' + p.life * 0.5 + ')';
          fxCtx.beginPath();
          fxCtx.arc(p.x - p.vx * 2, p.y - p.vy * 2, p.size * 0.3 * p.life, 0, Math.PI * 2);
          fxCtx.fill();
        }
      }
    });
    fw.particles = fw.particles.filter(p => p.life > 0);
  });
  fireworks = fireworks.filter(fw => fw.particles.length > 0);
  fxCtx.globalCompositeOperation = 'source-over';
  fxFrame++;
  requestAnimationFrame(animateFx);
}
animateFx();

// ===================== FLOATING HEARTS ON CLICK =====================
document.addEventListener('click', (e) => {
  const skip = e.target.closest('.candle-3d') || e.target.closest('.gift-box-3d') || e.target.closest('.music-btn') || e.target.closest('.nav-dot') || e.target.closest('.playlist-item') || e.target.closest('.music-progress') || e.target.closest('.event-btn') || e.target.closest('.event-card') || e.target.closest('.event-close') || e.target.closest('.event-heart-container') || e.target.closest('.event-dot') || e.target.closest('.gate-input');
  if (skip) return;
  const heart = document.createElement('div');
  heart.className = 'floating-heart';
  heart.textContent = ['💛', '💖', '💫', '✨', '💕'][Math.floor(Math.random() * 5)];
  heart.style.left = e.clientX + 'px';
  heart.style.top = e.clientY + 'px';
  heart.style.fontSize = (16 + Math.random() * 16) + 'px';
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 4000);
});

// ===================== COUNTDOWN =====================
function updateCountdown() {
  const now = new Date();
  let target = new Date(now.getFullYear(), 5, 1, 0, 0, 0);
  if (target < now) target = new Date(now.getFullYear() + 1, 5, 1, 0, 0, 0);
  const diff = target - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMins = document.getElementById('cdMins');
  const cdSecs = document.getElementById('cdSecs');
  if (cdDays) cdDays.textContent = String(days).padStart(2, '0');
  if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
  if (cdMins) cdMins.textContent = String(mins).padStart(2, '0');
  if (cdSecs) cdSecs.textContent = String(secs).padStart(2, '0');
}
setInterval(updateCountdown, 1000);
updateCountdown();

// ===================== TOAST =====================
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.innerHTML = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ===================== KEYBOARD NAVIGATION =====================
document.addEventListener('keydown', function(e) {
  if (!window.gateUnlocked) {
    // PIN input is handled in the PIN section above
    return;
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (currentSection < sections.length - 1) scrollToSection(currentSection + 1);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (currentSection > 0) scrollToSection(currentSection - 1);
  } else if (e.key === ' ' && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') {
    e.preventDefault();
    toggleMusicPlayer();
  } else if (e.key === 'Escape') {
    const overlay = document.getElementById('eventOverlay');
    if (overlay && overlay.classList.contains('active')) {
      closeEventPopup();
    }
  }
});

// ===================== MODULAR EVENTS SYSTEM =====================
// To add a new event: Add one object to the EVENTS array below.
// That's it. No HTML, no CSS, no core JS changes needed.

const EVENTS = [
  {
    id: 'exam-wishes',
    label: 'Exam Wishes',
    icon: '🎓',
    isNew: true,
    theme: {
      primary: '#6b9b7a',
      secondary: '#7a9eb8',
      accent: '#e07a5f',
      bg: 'linear-gradient(135deg,#f8faf9,#f4f7f3)',
      text: '#2d2d2d',
      muted: '#7a6e5f'
    },
    ornament: '🩺 ✨ 💚',
    title: 'You Were Born For This',
    subtitle: 'For Dal — Clinical Medicine & Community Health',
    breathe: { text: 'Before you begin, breathe with me...', label: 'Breathe' },
    message: 'Dal, this exam is not a wall. It is a door. And you already have the key.',
    progress: { label: "Infinite's Belief in You", text: "100% — Unshakable" },
    quotes: [
      { text: 'The good physician treats the disease; the great physician treats the patient who has the disease.', author: 'Sir William Osler' },
      { text: "Wherever the art of Medicine is loved, there is also a love of Humanity.", author: "Hippocrates" },
      { text: 'To serve is beautiful, but only if it is done with joy and a whole heart.', author: 'Pearl S. Buck' },
      { text: "The greatest medicine of all is to teach people how not to need it.", author: "Hippocrates" },
      { text: 'You are stronger than you know. More capable than you imagine. And more loved than you realize.', author: 'Infinite' },
      { text: 'The best way to find yourself is to lose yourself in the service of others.', author: 'Mahatma Gandhi' },
      { text: "Believe you can and you're halfway there. Dal, you are already more than halfway.", author: "Theodore Roosevelt (adapted by Infinite)" }
    ],
    heart: {
      title: 'Tap the heart — hear what Infinite knows...',
      label: '"Your heart has never led you wrong, Dal. Trust it."'
    },
    cards: [
      { icon: "🧠", title: "For Your Mind", hidden: "You have absorbed more than you realize. On exam day, let it flow. Don't force it — trust it." },
      { icon: '💪', title: 'For Your Strength', hidden: 'You have survived every hard day so far. This one is no different. You are built for this.' },
      { icon: "🌱", title: "For Your Purpose", hidden: "Community health chose you, Dal. You chose it back. That calling doesn't disappear in an exam room." },
      { icon: '💛', title: 'For Your Heart', hidden: 'No grade can measure the compassion you carry. That is your real qualification. Everything else is just paperwork.' },
      { icon: '🔥', title: 'For Your Courage', hidden: 'Fear is just excitement without breath. Breathe, Dal. Then walk in like you own the room — because you do.' },
      { icon: '⭐', title: 'For Your Future', hidden: 'One day you will look back at this exam and smile. Not because it was easy — but because you conquered it.' }
    ],
    letter: `My Dearest Dal,<br><br>
Tomorrow you walk into that exam room not as a student trying to pass —<br>
but as a <strong>healer who is ready</strong>.<br><br>
I have watched you carry textbooks heavier than your fears.<br>
I have watched you choose study over sleep,<br>
patients over parties,<br>
and purpose over comfort.<br><br>
You are not just studying medicine, Dal.<br>
You are becoming the kind of doctor<br>
who will hold a stranger\'s hand<br>
and make them feel seen.<br><br>
<strong>That is who you already are.</strong><br><br>
The exam is just a formality.<br>
Your heart has already graduated.<br><br>
Go in there. Breathe. Trust yourself.<br>
And know that Infinite is right here,<br>
cheering for you with everything I have.<br><br>
<strong>You were born for this, Dal.<br>
Now go show them why.</strong>`,
    footer: 'May your mind be sharp, your heart be calm,<br>your hands be steady, and your spirit be brave.<br><br>You are going to be an extraordinary doctor, Dal.<br>I have never doubted it. Not for a single day.'
  },
  {
    id: 'universe-of-love',
    label: 'Universe of Love',
    icon: '🌌',
    isNew: true,
    type: 'universe',
    theme: {
      primary: '#e8a0bf',
      secondary: '#a78bfa',
      accent: '#fbbf24',
      bg: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      text: '#f0e6ff',
      muted: '#c4b5fd'
    },
    loveLetters: [
      "In every galaxy, in every star, I find my way back to you.",
      "You are the gravity that holds my universe together.",
      "Across infinite light-years, my love for you travels faster than light.",
      "Every atom in my body remembers the moment I fell for you.",
      "You are my Big Bang — the beginning of everything beautiful.",
      "If love were a constellation, you would be every star in my sky.",
      "The universe whispered your name, and my heart answered.",
      "Forever is not enough time to love you, but I will spend eternity trying.",
      "You are the stardust that makes my soul shine.",
      "In a universe of billions, you are my one and only.",
      "My love for you expands like the universe — infinite and ever-growing.",
      "You are the moon to my tide, the sun to my day, the stars to my night."
    ],
    memoryImages: [
      'Images/Beautiful.jpeg',
      'Images/Charming.jpg',
      'Images/Chearful.jpg',
      'Images/Perfect.jpg',
      'Images/Queen 👑.jpg'
    ]
  }
];

// ===================== EVENTS RENDERER =====================
function renderEventButtons() {
  const sidebar = document.getElementById('eventsSidebar');
  if (!sidebar) return;
  sidebar.innerHTML = '';
  EVENTS.forEach(evt => {
    const btn = document.createElement('button');
    btn.className = 'event-btn' + (evt.isNew ? ' new' : '');
    btn.innerHTML = evt.icon + ' ' + evt.label;
    btn.setAttribute('data-event', evt.id);
    btn.onclick = () => openEventPopup(evt.id);
    sidebar.appendChild(btn);
  });
}

let currentEventId = null;
let eventQuoteInterval = null;
let eventQuoteIndex = 0;

function openEventPopup(eventId) {
  const evt = EVENTS.find(e => e.id === eventId);
  if (!evt) return;
  currentEventId = eventId;
  eventQuoteIndex = 0;

  const overlay = document.getElementById('eventOverlay');
  const content = document.getElementById('eventContent');
  const popup = document.querySelector('.event-popup');
  if (!overlay || !content) return;

  if (popup) popup.classList.remove('universe-active');

  content.innerHTML = buildEventHTML(evt);
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  if (evt.type === 'universe') {
    if (popup) popup.classList.add('universe-active');
    setTimeout(() => {
      initUniverseCanvas();
      startUniverseTypewriter();
      showUniverseMemory();
    }, 300);
  } else {
    setTimeout(() => {
      const breatheCircle = document.getElementById('eventBreatheCircle');
      if (breatheCircle) {
        breatheCircle.addEventListener('click', function() {
          this.classList.toggle('breathing-active');
          if (this.classList.contains('breathing-active')) {
            this.textContent = 'Breathe...';
          } else {
            this.textContent = evt.breathe ? evt.breathe.label : 'Breathe';
          }
        });
      }
    }, 100);
    startEventQuotes(evt);

    setTimeout(() => {
      const fill = document.getElementById('eventProgressFill');
      if (fill) fill.classList.add('full');
    }, 500);

    setTimeout(() => {
      typeEventLetter(evt.letter);
    }, 800);
  }

  setTimeout(setupCursorHover, 100);
}

function buildEventHTML(evt) {
  if (evt.type === 'universe') {
    return buildUniverseEventHTML(evt);
  }

  const quotesHTML = evt.quotes.map((q, i) => 
    `<div class="event-quote-text" id="eventQuoteText${i}" style="display:${i===0?'block':'none'}">${q.text}</div>
     <div class="event-quote-author" id="eventQuoteAuthor${i}" style="display:${i===0?'block':'none'}">— ${q.author}</div>`
  ).join('');

  const dotsHTML = evt.quotes.map((_, i) => 
    `<div class="event-dot ${i===0?'active':''}" onclick="showEventQuote(${i})" data-idx="${i}"></div>`
  ).join('');

  const cardsHTML = evt.cards.map(c => 
    `<div class="event-card" onclick="revealEventCard(this)">
      <div class="event-card-icon">${c.icon}</div>
      <div class="event-card-title">${c.title}</div>
      <div class="event-card-hidden">${c.hidden}</div>
    </div>`
  ).join('');

  return `
    <div class="event-ornament">${evt.ornament}</div>
    <div class="event-title">${evt.title}</div>
    <div class="event-subtitle">${evt.subtitle}</div>
    <div class="event-divider"></div>

    <div class="event-breathe-section">
      <div class="event-breathe-text">${evt.breathe.text}</div>
      <div class="event-breathe-circle" id="eventBreatheCircle">${evt.breathe.label}</div>
    </div>

    <div class="event-message">${evt.message}</div>

    <div class="event-progress-section">
      <div class="event-progress-label">${evt.progress.label}</div>
      <div class="event-progress-bar">
        <div class="event-progress-fill" id="eventProgressFill"></div>
      </div>
      <div class="event-progress-text" id="eventProgressText">${evt.progress.text}</div>
    </div>

    <div class="event-quote-box">
      ${quotesHTML}
      <div class="event-quote-dots">${dotsHTML}</div>
    </div>

    <div class="event-heart-section">
      <div class="event-heart-title">${evt.heart.title}</div>
      <div class="event-heart-container" onclick="revealEventHeart()">
        <svg class="event-heart-svg" viewBox="0 0 24 24" fill="none" stroke="#6b9b7a" stroke-width="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          <path d="M12 8v4M10 10h4" stroke="#e07a5f" stroke-width="1" opacity="0.6"/>
        </svg>
        <div class="event-steth-line" id="eventStethLine"></div>
      </div>
      <div class="event-heart-label" id="eventHeartLabel">${evt.heart.label}</div>
    </div>

    <div class="event-cards">${cardsHTML}</div>

    <div class="event-letter">
      <div class="event-letter-text" id="eventLetterText"></div>
      <div class="event-signature" id="eventLetterSig" style="opacity:0;transition:opacity 1s ease 1s;">— Infinite 💚</div>
    </div>

    <div class="event-footer">${evt.footer}</div>
  `;
}

function showEventQuote(index) {
  const dots = document.querySelectorAll('.event-dot');
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === index);
    const text = document.getElementById('eventQuoteText' + i);
    const author = document.getElementById('eventQuoteAuthor' + i);
    if (text) text.style.display = i === index ? 'block' : 'none';
    if (author) author.style.display = i === index ? 'block' : 'none';
  });
  eventQuoteIndex = index;
}

function startEventQuotes(evt) {
  if (eventQuoteInterval) clearInterval(eventQuoteInterval);
  eventQuoteInterval = setInterval(() => {
    eventQuoteIndex = (eventQuoteIndex + 1) % evt.quotes.length;
    showEventQuote(eventQuoteIndex);
  }, 5000);
}

function stopEventQuotes() {
  if (eventQuoteInterval) {
    clearInterval(eventQuoteInterval);
    eventQuoteInterval = null;
  }
}

function closeEventPopup(e) {
  if (e && e.target !== document.getElementById('eventOverlay')) return;
  const overlay = document.getElementById('eventOverlay');
  const popup = document.querySelector('.event-popup');
  if (overlay) overlay.classList.remove('active');
  if (popup) popup.classList.remove('universe-active');
  document.body.style.overflow = '';
  stopEventQuotes();
  destroyUniverseCanvas();
  const letterText = document.getElementById('eventLetterText');
  const letterSig = document.getElementById('eventLetterSig');
  const progressFill = document.getElementById('eventProgressFill');
  const stethLine = document.getElementById('eventStethLine');
  const heartLabel = document.getElementById('eventHeartLabel');
  if (letterText) letterText.innerHTML = '';
  if (letterSig) letterSig.style.opacity = '0';
  if (progressFill) progressFill.classList.remove('full');
  if (stethLine) stethLine.classList.remove('extended');
  if (heartLabel) heartLabel.classList.remove('show');
  document.querySelectorAll('.event-card').forEach(c => c.classList.remove('revealed'));
  currentEventId = null;
}

function revealEventHeart() {
  const stethLine = document.getElementById('eventStethLine');
  const heartLabel = document.getElementById('eventHeartLabel');
  if (stethLine) stethLine.classList.add('extended');
  setTimeout(() => {
    if (heartLabel) heartLabel.classList.add('show');
  }, 800);
}

function revealEventCard(el) {
  if (el.classList.contains('revealed')) return;
  el.classList.add('revealed');
  const rect = el.getBoundingClientRect();
  for (let i = 0; i < 8; i++) {
    const c = document.createElement('div');
    c.style.cssText = 'position:fixed;left:' + (rect.left + rect.width / 2) + 'px;top:' + rect.top + 'px;width:5px;height:5px;border-radius:50%;pointer-events:none;z-index:10000;transition:all 0.6s ease-out;';
    const colors = ['#6b9b7a', '#7a9eb8', '#e07a5f', '#d4a574'];
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    document.body.appendChild(c);
    setTimeout(() => {
      c.style.transform = 'translate(' + (Math.random() - 0.5) * 60 + 'px,' + (-Math.random() * 50) + 'px) scale(0)';
      c.style.opacity = '0';
    }, 10);
    setTimeout(() => c.remove(), 700);
  }
}

function typeEventLetter(text) {
  const el = document.getElementById('eventLetterText');
  if (!el) return;
  el.innerHTML = '';
  let i = 0;
  function type() {
    if (i < text.length) {
      const char = text.charAt(i);
      if (char === '<') {
        const close = text.indexOf('>', i);
        if (close !== -1) {
          el.innerHTML += text.substring(i, close + 1);
          i = close + 1;
        }
      } else {
        el.innerHTML += char;
        i++;
      }
      setTimeout(type, 20);
    } else {
      const sig = document.getElementById('eventLetterSig');
      if (sig) sig.style.opacity = '1';
    }
  }
  type();
}

// ===================== BALLOON KEYFRAMES INJECT =====================
const balloonStyle = document.createElement('style');
balloonStyle.textContent = `
@keyframes balloonUp{
  0%{transform:translateY(0) translateX(0) scale(0.6);opacity:0}
  10%{opacity:0.9;transform:translateY(-10vh) translateX(10px) scale(1)}
  100%{transform:translateY(-110vh) translateX(-30px) scale(1.1);opacity:0}
}
`;
document.head.appendChild(balloonStyle);

// ===================== INIT =====================
loadSong(0);
renderEventButtons();
setupCursorHover();
showToast('Welcome, Dal. Use arrow keys or scroll to navigate 💫');


// ===================== UNIVERSE OF LOVE — MASTERPIECE SYSTEM =====================
// A cosmic love engine. Black hole. Emoji spirals. Constellations. Infinite.

let universeAnimId = null;
let universeCtx = null;
let universeCanvas = null;
let universeParticles = [];
let universeStarsNear = [];
let universeStarsMid = [];
let universeStarsFar = [];
let universeShootingStars = [];
let universeNebula = [];
let universeGhostTexts = [];
let universeDustRings = [];
let universeCycle = 0;
let universeCycleStart = 0;
let universeTypewriterTimeout = null;
let universeMouseX = -1;
let universeMouseY = -1;
let universeHeartPulse = 0;
let universeWarpActive = false;
let universeWarpTime = 0;

const LOVE_EMOJIS = ['💖','💫','✨','💛','💕','🌟','💗','💘','💝','🌙','⭐','💓','🪐','🌠'];
const CYCLE_PHASES = [
  { name: 'spiral', duration: 4000 },
  { name: 'pattern', duration: 3500 },
  { name: 'hold', duration: 2500 },
  { name: 'dissolve', duration: 2000 }
];
const GHOST_PHRASES = [
  'Infinite love', 'Forever Dal', 'My universe', 'Stardust & you',
  'Eternal', 'Beyond time', 'My everything', 'Cosmic bond',
  'Love transcends', 'You are my light', 'Soul connection', 'Destiny'
];

function buildUniverseEventHTML(evt) {
  return `
    <canvas class="universe-canvas" id="universeCanvas"></canvas>
    <div class="universe-overlay">
      <div class="universe-center-heart" id="universeCenterHeart" title="Tap to send love">💖</div>
      <div class="universe-heart-ring" id="universeHeartRing1"></div>
      <div class="universe-heart-ring" id="universeHeartRing2" style="animation-delay:0.7s"></div>
      <div class="universe-letter" id="universeLetter"></div>
      <div class="universe-memory-container" id="universeMemory"></div>
      <div class="universe-title">Universe of Love</div>
      <div class="universe-subtitle">For Dal — Across All Space & Time</div>
      <div class="universe-ghost-container" id="universeGhostContainer"></div>
      <div class="universe-energy-bar">
        <div class="universe-energy-fill" id="universeEnergyFill"></div>
      </div>
      <div class="universe-energy-label">Love Energy</div>
    </div>
  `;
}

let universeActive = false;
function initUniverseCanvas() {
  universeActive = true;
  universeCanvas = document.getElementById('universeCanvas');
  if (!universeCanvas) return;
  universeCtx = universeCanvas.getContext('2d');

  const popup = document.querySelector('.event-popup');
  const rect = popup ? popup.getBoundingClientRect() : { width: 800, height: 600 };
  universeCanvas.width = rect.width * window.devicePixelRatio;
  universeCanvas.height = rect.height * window.devicePixelRatio;
  universeCanvas.style.width = rect.width + 'px';
  universeCanvas.style.height = rect.height + 'px';
  universeCtx.scale(window.devicePixelRatio, window.devicePixelRatio);

  const w = rect.width;
  const h = rect.height;
  const cx = w / 2;
  const cy = h / 2;

  // 3 layers of parallax stars
  universeStarsFar = createStarLayer(80, w, h, 0.3, 0.5);
  universeStarsMid = createStarLayer(60, w, h, 0.6, 1.2);
  universeStarsNear = createStarLayer(40, w, h, 1.0, 2.5);

  // Nebula clouds
  universeNebula = [];
  for (let i = 0; i < 6; i++) {
    universeNebula.push({
      x: Math.random() * w,
      y: Math.random() * h,
      radius: 120 + Math.random() * 250,
      hue: 260 + Math.random() * 80,
      opacity: 0.02 + Math.random() * 0.04,
      driftX: (Math.random() - 0.5) * 0.2,
      driftY: (Math.random() - 0.5) * 0.2
    });
  }

  // Dust rings around black hole
  universeDustRings = [];
  for (let i = 0; i < 3; i++) {
    universeDustRings.push({
      radius: 80 + i * 40,
      tilt: (Math.random() - 0.5) * 0.3,
      speed: 0.0003 + i * 0.0002,
      particles: 40 + i * 20,
      hue: 280 + i * 20
    });
  }

  // Love particles
  universeParticles = [];
  for (let i = 0; i < 80; i++) {
    universeParticles.push(new LoveParticle(cx, cy));
  }

  // Ghost texts
  universeGhostTexts = [];
  for (let i = 0; i < 8; i++) {
    universeGhostTexts.push({
      text: GHOST_PHRASES[i % GHOST_PHRASES.length],
      x: Math.random() * w,
      y: Math.random() * h,
      opacity: 0,
      targetOpacity: 0.08 + Math.random() * 0.12,
      phase: Math.random() * Math.PI * 2,
      speed: 0.0003 + Math.random() * 0.0005,
      size: 14 + Math.random() * 8
    });
  }

  universeShootingStars = [];
  universeCycleStart = performance.now();
  universeCycle = 0;
  universeWarpActive = false;
  universeWarpTime = 0;

  // Mouse/touch tracking
  universeCanvas.addEventListener('mousemove', onUniverseMouseMove);
  universeCanvas.addEventListener('touchmove', onUniverseTouchMove, { passive: true });
  universeCanvas.addEventListener('click', onUniverseClick);

  const heart = document.getElementById('universeCenterHeart');
  if (heart) {
    heart.addEventListener('click', onUniverseHeartClick);
  }

  window.addEventListener('resize', onUniverseResize);

  // Start energy bar animation
  setTimeout(() => {
    const fill = document.getElementById('universeEnergyFill');
    if (fill) {
      fill.classList.add('full');
      setTimeout(() => { if (fill) fill.classList.add('pulsing'); }, 3000);
    }
  }, 800);

  animateUniverse();
}

function createStarLayer(count, w, h, minSize, maxSize) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size: minSize + Math.random() * (maxSize - minSize),
      opacity: 0.2 + Math.random() * 0.8,
      twinkleSpeed: 0.005 + Math.random() * 0.02,
      twinklePhase: Math.random() * Math.PI * 2,
      parallax: minSize / maxSize
    });
  }
  return stars;
}

function destroyUniverseCanvas() {
  universeActive = false;
  if (universeAnimId) {
    cancelAnimationFrame(universeAnimId);
    universeAnimId = null;
  }
  if (universeTypewriterTimeout) {
    clearTimeout(universeTypewriterTimeout);
    universeTypewriterTimeout = null;
  }
  if (universeCanvas) {
    universeCanvas.removeEventListener('mousemove', onUniverseMouseMove);
    universeCanvas.removeEventListener('touchmove', onUniverseTouchMove);
    universeCanvas.removeEventListener('click', onUniverseClick);
  }
  const heart = document.getElementById('universeCenterHeart');
  if (heart) {
    heart.removeEventListener('click', onUniverseHeartClick);
  }
  window.removeEventListener('resize', onUniverseResize);
  universeParticles = [];
  universeStarsNear = [];
  universeStarsMid = [];
  universeStarsFar = [];
  universeShootingStars = [];
  universeNebula = [];
  universeGhostTexts = [];
  universeDustRings = [];
  universeCtx = null;
  universeCanvas = null;
  universeMouseX = -1;
  universeMouseY = -1;
}

function onUniverseMouseMove(e) {
  const rect = universeCanvas.getBoundingClientRect();
  universeMouseX = (e.clientX - rect.left);
  universeMouseY = (e.clientY - rect.top);
}

function onUniverseTouchMove(e) {
  if (e.touches.length > 0) {
    const rect = universeCanvas.getBoundingClientRect();
    universeMouseX = (e.touches[0].clientX - rect.left);
    universeMouseY = (e.touches[0].clientY - rect.top);
  }
}

function onUniverseClick(e) {
  const rect = universeCanvas.getBoundingClientRect();
  const x = (e.clientX - rect.left);
  const y = (e.clientY - rect.top);
  createRipple(x, y);
}

function createRipple(x, y) {
  const cx = universeCanvas ? universeCanvas.width / (2 * window.devicePixelRatio) : 400;
  const cy = universeCanvas ? universeCanvas.height / (2 * window.devicePixelRatio) : 300;
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const p = new LoveParticle(cx, cy);
    p.x = x;
    p.y = y;
    p.vx = Math.cos(angle) * (2 + Math.random() * 3);
    p.vy = Math.sin(angle) * (2 + Math.random() * 3);
    p.speed = 2 + Math.random() * 3;
    p.targetOpacity = 1;
    p.phase = 'burst';
    p.burstLife = 1;
    universeParticles.push(p);
  }
  if (universeParticles.length > 150) {
    universeParticles = universeParticles.slice(-150);
  }
}

function onUniverseResize() {
  if (!universeActive || !universeCanvas) return;
  const popup = document.querySelector('.event-popup');
  if (!popup) return;
  const rect = popup.getBoundingClientRect();
  universeCanvas.width = rect.width * window.devicePixelRatio;
  universeCanvas.height = rect.height * window.devicePixelRatio;
  universeCanvas.style.width = rect.width + 'px';
  universeCanvas.style.height = rect.height + 'px';
  if (universeCtx) {
    universeCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  universeParticles.forEach(p => { p.cx = cx; p.cy = cy; });
}

function onUniverseHeartClick(e) {
  e.stopPropagation();
  const cx = universeCanvas ? universeCanvas.width / (2 * window.devicePixelRatio) : 400;
  const cy = universeCanvas ? universeCanvas.height / (2 * window.devicePixelRatio) : 300;
  for (let i = 0; i < 30; i++) {
    const p = new LoveParticle(cx, cy);
    p.speed = 3 + Math.random() * 5;
    p.targetOpacity = 1;
    p.x = cx;
    p.y = cy;
    p.cx = cx;
    p.cy = cy;
    p.emoji = LOVE_EMOJIS[Math.floor(Math.random() * LOVE_EMOJIS.length)];
    p.size = 20 + Math.random() * 16;
    p.baseSize = p.size;
    universeParticles.push(p);
  }
  if (universeParticles.length > 150) {
    universeParticles = universeParticles.slice(-150);
  }
  // Trigger warp effect
  universeWarpActive = true;
  universeWarpTime = 0;
}

class LoveParticle {
  constructor(cx, cy) {
    this.cx = cx;
    this.cy = cy;
    this.reset();
  }

  reset() {
    this.x = this.cx;
    this.y = this.cy;
    this.angle = Math.random() * Math.PI * 2;
    this.distance = 0;
    this.spiralTightness = 0.12 + Math.random() * 0.08;
    this.speed = 0.8 + Math.random() * 2.5;
    this.emoji = LOVE_EMOJIS[Math.floor(Math.random() * LOVE_EMOJIS.length)];
    this.baseSize = 14 + Math.random() * 16;
    this.size = this.baseSize;
    this.opacity = 0;
    this.targetOpacity = 0.6 + Math.random() * 0.4;
    this.phase = 'spiral';
    this.vx = 0;
    this.vy = 0;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.04;
    this.trail = [];
    this.patternIndex = Math.floor(Math.random() * 3);
    this.patternT = Math.random();
    this.driftX = 0;
    this.driftY = 0;
    this.burstLife = 0;
    this.gravityStrength = 0.02 + Math.random() * 0.03;
  }

  update(phase, phaseProgress, mouseX, mouseY) {
    this.rotation += this.rotSpeed;

    // Mouse gravity attraction
    if (mouseX > 0 && mouseY > 0) {
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200 && dist > 5) {
        const force = (1 - dist / 200) * this.gravityStrength;
        this.vx += (dx / dist) * force;
        this.vy += (dy / dist) * force;
      }
    }

    if (this.phase === 'burst') {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.98;
      this.vy *= 0.98;
      this.burstLife -= 0.015;
      this.opacity = this.targetOpacity * this.burstLife;
      this.size = this.baseSize * (1 + (1 - this.burstLife));
      if (this.burstLife <= 0) this.reset();
      return;
    }

    if (phase === 'spiral') {
      this.distance += this.speed * (1 + phaseProgress * 2);
      this.angle += this.spiralTightness;
      const targetX = this.cx + Math.cos(this.angle) * this.distance;
      const targetY = this.cy + Math.sin(this.angle) * this.distance;
      this.x += (targetX - this.x) * 0.1 + this.vx;
      this.y += (targetY - this.y) * 0.1 + this.vy;
      this.opacity = Math.min(this.targetOpacity, phaseProgress * 3);
      this.size = this.baseSize * (0.5 + phaseProgress * 0.5);
      this.vx *= 0.95;
      this.vy *= 0.95;
      // Add trail during spiral
      this.trail.push({ x: this.x, y: this.y, opacity: this.opacity * 0.4, size: this.size * 0.3 });
      if (this.trail.length > 10) this.trail.shift();
    } else if (phase === 'pattern') {
      const patternPos = this.getPatternPosition();
      const ease = 0.04;
      this.x += (patternPos.x - this.x) * ease + this.vx;
      this.y += (patternPos.y - this.y) * ease + this.vy;
      this.opacity = this.targetOpacity;
      this.size = this.baseSize;
      this.vx *= 0.92;
      this.vy *= 0.92;
      this.trail = [];
    } else if (phase === 'hold') {
      this.patternT += 0.0008;
      const patternPos = this.getPatternPosition();
      this.x = patternPos.x + Math.sin(this.patternT * Math.PI * 2 + this.angle) * 4 + this.vx;
      this.y = patternPos.y + Math.cos(this.patternT * Math.PI * 2 + this.angle) * 4 + this.vy;
      this.opacity = this.targetOpacity * (0.8 + Math.sin(performance.now() * 0.001 + this.angle) * 0.2);
      this.size = this.baseSize * (1 + Math.sin(performance.now() * 0.002) * 0.1);
      this.vx *= 0.95;
      this.vy *= 0.95;
      this.trail = [];
    } else if (phase === 'dissolve') {
      this.driftX += (Math.random() - 0.5) * 3;
      this.driftY += (Math.random() - 0.5) * 3;
      this.x += this.driftX + this.vx;
      this.y += this.driftY + this.vy;
      this.opacity = this.targetOpacity * (1 - phaseProgress);
      this.size = this.baseSize * (1 + phaseProgress * 0.5);
      this.rotation += this.rotSpeed * 4;
      this.vx *= 0.9;
      this.vy *= 0.9;
      this.trail = [];
      if (phaseProgress > 0.95) this.reset();
    }
  }

  getPatternPosition() {
    const cx = this.cx;
    const cy = this.cy;
    const scale = Math.min(cx, cy) * 0.5;

    if (this.patternIndex === 0) {
      // Heart shape parametric
      const t = this.patternT * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
      return { x: cx + x * scale / 16, y: cy + y * scale / 16 };
    } else if (this.patternIndex === 1) {
      // Infinity symbol (lemniscate)
      const t = this.patternT * Math.PI * 2;
      const denom = 1 + Math.sin(t) * Math.sin(t);
      const x = Math.sin(t) / denom;
      const y = Math.sin(t) * Math.cos(t) / denom;
      return { x: cx + x * scale * 0.9, y: cy + y * scale * 0.9 };
    } else {
      // Constellation (star pattern)
      const idx = Math.floor(this.patternT * 12);
      const angle = (idx / 12) * Math.PI * 2 + this.patternT * 0.3;
      const dist = (0.25 + (this.patternT % 1) * 0.75) * scale;
      return { x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist };
    }
  }

  draw(ctx) {
    // Draw trail
    for (let i = 0; i < this.trail.length; i++) {
      const t = this.trail[i];
      const trailOpacity = (i / this.trail.length) * t.opacity;
      ctx.globalAlpha = trailOpacity;
      const gradient = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, t.size * 2);
      gradient.addColorStop(0, 'rgba(232, 160, 191, 0.8)');
      gradient.addColorStop(1, 'rgba(167, 139, 250, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.size * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw particle with glow
    ctx.globalAlpha = this.opacity;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.font = `${this.size}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(232, 160, 191, 0.8)';
    ctx.shadowBlur = 20;
    ctx.fillText(this.emoji, 0, 0);
    ctx.restore();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }
}

function drawStars(ctx, stars, w, h, time) {
  stars.forEach(star => {
    star.twinklePhase += star.twinkleSpeed;
    const twinkle = 0.3 + Math.sin(star.twinklePhase) * 0.7;
    ctx.globalAlpha = star.opacity * twinkle;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
    // Star glow
    if (star.size > 1.5) {
      ctx.globalAlpha = star.opacity * twinkle * 0.3;
      const g = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 4);
      g.addColorStop(0, 'rgba(255,255,255,0.5)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  ctx.globalAlpha = 1;
}

function drawNebula(ctx, nebula, w, h, time) {
  nebula.forEach(cloud => {
    cloud.x += cloud.driftX;
    cloud.y += cloud.driftY;
    if (cloud.x < -cloud.radius) cloud.x = w + cloud.radius;
    if (cloud.x > w + cloud.radius) cloud.x = -cloud.radius;
    if (cloud.y < -cloud.radius) cloud.y = h + cloud.radius;
    if (cloud.y > h + cloud.radius) cloud.y = -cloud.radius;

    const ng = ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.radius);
    ng.addColorStop(0, `hsla(${cloud.hue + Math.sin(time * 0.0001) * 30}, 70%, 60%, ${cloud.opacity})`);
    ng.addColorStop(0.5, `hsla(${cloud.hue + Math.sin(time * 0.0001) * 30}, 70%, 50%, ${cloud.opacity * 0.5})`);
    ng.addColorStop(1, `hsla(${cloud.hue + Math.sin(time * 0.0001) * 30}, 70%, 40%, 0)`);
    ctx.fillStyle = ng;
    ctx.fillRect(cloud.x - cloud.radius, cloud.y - cloud.radius, cloud.radius * 2, cloud.radius * 2);
  });
}

function drawBlackHole(ctx, cx, cy, time) {
  const bhRadius = 35 + Math.sin(time * 0.0015) * 6;

  // Gravitational lensing glow
  const lensGlow = ctx.createRadialGradient(cx, cy, bhRadius * 0.8, cx, cy, bhRadius * 4);
  lensGlow.addColorStop(0, 'rgba(0,0,0,0.95)');
  lensGlow.addColorStop(0.2, 'rgba(20,10,40,0.7)');
  lensGlow.addColorStop(0.4, 'rgba(60,30,90,0.4)');
  lensGlow.addColorStop(0.7, 'rgba(100,50,120,0.15)');
  lensGlow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = lensGlow;
  ctx.beginPath();
  ctx.arc(cx, cy, bhRadius * 4, 0, Math.PI * 2);
  ctx.fill();

  // Photon ring (bright ring around event horizon)
  const ringGradient = ctx.createRadialGradient(cx, cy, bhRadius * 0.9, cx, cy, bhRadius * 1.3);
  ringGradient.addColorStop(0, 'rgba(232, 160, 191, 0)');
  ringGradient.addColorStop(0.5, 'rgba(232, 160, 191, 0.6)');
  ringGradient.addColorStop(0.7, 'rgba(167, 139, 250, 0.4)');
  ringGradient.addColorStop(1, 'rgba(232, 160, 191, 0)');
  ctx.fillStyle = ringGradient;
  ctx.beginPath();
  ctx.arc(cx, cy, bhRadius * 1.3, 0, Math.PI * 2);
  ctx.fill();

  // Event horizon (dark center)
  ctx.fillStyle = 'rgba(0,0,0,0.98)';
  ctx.beginPath();
  ctx.arc(cx, cy, bhRadius, 0, Math.PI * 2);
  ctx.fill();

  // Accretion disk (rotating, glowing)
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(time * 0.0003);
  const diskGradient = ctx.createRadialGradient(0, 0, bhRadius * 1.1, 0, 0, bhRadius * 2.8);
  diskGradient.addColorStop(0, 'rgba(232, 160, 191, 0)');
  diskGradient.addColorStop(0.3, 'rgba(232, 160, 191, 0.25)');
  diskGradient.addColorStop(0.5, 'rgba(167, 139, 250, 0.35)');
  diskGradient.addColorStop(0.7, 'rgba(232, 160, 191, 0.2)');
  diskGradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = diskGradient;
  ctx.beginPath();
  ctx.ellipse(0, 0, bhRadius * 2.8, bhRadius * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Dust rings
  universeDustRings.forEach((ring, idx) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(time * ring.speed + idx * 2);
    ctx.scale(1, Math.cos(ring.tilt));
    for (let i = 0; i < ring.particles; i++) {
      const angle = (i / ring.particles) * Math.PI * 2;
      const r = ring.radius + Math.sin(angle * 3 + time * 0.001) * 5;
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;
      ctx.globalAlpha = 0.3 + Math.sin(angle * 5 + time * 0.002) * 0.2;
      ctx.fillStyle = `hsla(${ring.hue + Math.sin(time * 0.0005) * 20}, 70%, 70%, 0.8)`;
      ctx.beginPath();
      ctx.arc(px, py, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });
  ctx.globalAlpha = 1;
}

function drawGhostTexts(ctx, w, h, time) {
  universeGhostTexts.forEach(ghost => {
    ghost.phase += ghost.speed;
    ghost.opacity = ghost.targetOpacity * (0.5 + Math.sin(ghost.phase) * 0.5);
    ghost.y += Math.sin(ghost.phase * 2) * 0.3;

    ctx.globalAlpha = ghost.opacity;
    ctx.font = `${ghost.size}px 'Cormorant Garamond', serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(200, 180, 255, 0.6)';
    ctx.shadowColor = 'rgba(167, 139, 250, 0.5)';
    ctx.shadowBlur = 15;
    ctx.fillText(ghost.text, ghost.x, ghost.y);
    ctx.shadowBlur = 0;
  });
  ctx.globalAlpha = 1;
}

function drawConstellationLines(ctx, particles, phase, phaseProgress) {
  if (phase !== 'pattern' && phase !== 'hold') return;

  const patternParticles = particles.filter(p => p.patternIndex === 2 && p.opacity > 0.3);
  if (patternParticles.length < 3) return;

  const lineOpacity = phase === 'pattern'
    ? phaseProgress * 0.2
    : (0.2 - Math.abs(0.5 - phaseProgress) * 0.15);

  ctx.globalAlpha = lineOpacity;
  ctx.strokeStyle = 'rgba(167, 139, 250, 0.6)';
  ctx.lineWidth = 1;
  ctx.shadowColor = 'rgba(167, 139, 250, 0.4)';
  ctx.shadowBlur = 8;

  for (let i = 0; i < patternParticles.length; i++) {
    for (let j = i + 1; j < patternParticles.length; j++) {
      const p1 = patternParticles[i];
      const p2 = patternParticles[j];
      const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      if (dist < 120) {
        const alpha = (1 - dist / 120) * lineOpacity;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
}

function drawPulseRings(ctx, cx, cy, time) {
  const pulseProgress = ((time - universeCycleStart) % 2500) / 2500;
  const pulseRadius = 60 + pulseProgress * 200;
  ctx.globalAlpha = (1 - pulseProgress) * 0.25;
  ctx.strokeStyle = 'rgba(232, 160, 191, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, pulseRadius, 0, Math.PI * 2);
  ctx.stroke();

  // Second ring
  const pulse2 = ((time - universeCycleStart + 1250) % 2500) / 2500;
  const radius2 = 60 + pulse2 * 200;
  ctx.globalAlpha = (1 - pulse2) * 0.15;
  ctx.strokeStyle = 'rgba(167, 139, 250, 0.3)';
  ctx.beginPath();
  ctx.arc(cx, cy, radius2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function drawWarpEffect(ctx, w, h, cx, cy, time) {
  if (!universeWarpActive) return;
  universeWarpTime += 0.016;
  const progress = Math.min(universeWarpTime / 1.5, 1);

  ctx.save();
  ctx.globalAlpha = (1 - progress) * 0.3;
  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * progress);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
  gradient.addColorStop(0.5, 'rgba(232, 160, 191, 0.1)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  // Warp streaks
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * Math.PI * 2 + time * 0.001;
    const dist = 50 + progress * 300;
    const x1 = cx + Math.cos(angle) * 50;
    const y1 = cy + Math.sin(angle) * 50;
    const x2 = cx + Math.cos(angle) * dist;
    const y2 = cy + Math.sin(angle) * dist;
    ctx.globalAlpha = (1 - progress) * 0.5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 2 * (1 - progress);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  ctx.restore();

  if (progress >= 1) {
    universeWarpActive = false;
    universeWarpTime = 0;
  }
}

function animateUniverse() {
  if (!universeCtx || !universeCanvas) return;
  const ctx = universeCtx;
  const w = universeCanvas.width / window.devicePixelRatio;
  const h = universeCanvas.height / window.devicePixelRatio;
  const cx = w / 2;
  const cy = h / 2;
  const now = performance.now();

  const totalCycleTime = CYCLE_PHASES.reduce((a, p) => a + p.duration, 0);
  const elapsed = (now - universeCycleStart) % totalCycleTime;
  let accumulated = 0;
  let currentPhase = CYCLE_PHASES[0].name;
  let phaseProgress = 0;
  for (const phase of CYCLE_PHASES) {
    if (elapsed < accumulated + phase.duration) {
      currentPhase = phase.name;
      phaseProgress = (elapsed - accumulated) / phase.duration;
      break;
    }
    accumulated += phase.duration;
  }

  // Check for cycle reset
  if (elapsed < 50 && universeCycle > 0) {
    universeParticles.forEach(p => {
      p.patternIndex = (p.patternIndex + 1) % 3;
      p.patternT = Math.random();
      p.reset();
    });
    showUniverseMemory();
  }
  universeCycle = Math.floor((now - universeCycleStart) / totalCycleTime);

  // Background
  const bgGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h));
  bgGradient.addColorStop(0, '#1a0f3a');
  bgGradient.addColorStop(0.3, '#0f0c29');
  bgGradient.addColorStop(0.7, '#0a0818');
  bgGradient.addColorStop(1, '#050510');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, w, h);

  // Nebula
  drawNebula(ctx, universeNebula, w, h, now);

  // Parallax stars (far -> mid -> near)
  drawStars(ctx, universeStarsFar, w, h, now);
  drawStars(ctx, universeStarsMid, w, h, now);
  drawStars(ctx, universeStarsNear, w, h, now);

  // Black hole
  drawBlackHole(ctx, cx, cy, now);

  // Pulse rings
  drawPulseRings(ctx, cx, cy, now);

  // Love particles
  universeParticles.forEach(p => {
    p.update(currentPhase, phaseProgress, universeMouseX, universeMouseY);
    p.draw(ctx);
  });

  // Constellation connections
  drawConstellationLines(ctx, universeParticles, currentPhase, phaseProgress);

  // Shooting stars
  if (Math.random() < 0.004) {
    universeShootingStars.push({
      x: Math.random() * w,
      y: Math.random() * h * 0.4,
      vx: -4 - Math.random() * 5,
      vy: 1 + Math.random() * 3,
      length: 60 + Math.random() * 120,
      opacity: 1,
      hue: 280 + Math.random() * 60
    });
  }
  universeShootingStars = universeShootingStars.filter(s => {
    s.x += s.vx;
    s.y += s.vy;
    s.opacity -= 0.015;
    if (s.opacity <= 0) return false;
    ctx.globalAlpha = s.opacity;
    ctx.strokeStyle = `hsla(${s.hue}, 80%, 80%, 0.9)`;
    ctx.lineWidth = 2;
    ctx.shadowColor = `hsla(${s.hue}, 80%, 70%, 0.6)`;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x - s.vx * s.length / 15, s.y - s.vy * s.length / 15);
    ctx.stroke();
    ctx.shadowBlur = 0;
    return true;
  });
  ctx.globalAlpha = 1;

  // Ghost texts
  drawGhostTexts(ctx, w, h, now);

  // Warp effect
  drawWarpEffect(ctx, w, h, cx, cy, now);

  // Heartbeat sync for center heart
  universeHeartPulse = Math.sin(now * 0.003) * 0.5 + 0.5;
  const heart = document.getElementById('universeCenterHeart');
  if (heart) {
    const scale = 1 + universeHeartPulse * 0.15;
    heart.style.transform = `translate(-50%, -50%) scale(${scale})`;
  }

  universeAnimId = requestAnimationFrame(animateUniverse);
}

function startUniverseTypewriter() {
  const evt = EVENTS.find(e => e.id === 'universe-of-love');
  if (!evt || !evt.loveLetters) return;
  const letterEl = document.getElementById('universeLetter');
  if (!letterEl) return;

  let letterIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function typeNext() {
    if (!letterEl) return;
    const letters = evt.loveLetters;
    const currentText = letters[letterIdx];

    if (!isDeleting) {
      if (charIdx === 0) {
        letterEl.style.opacity = '0';
        setTimeout(() => { if (letterEl) letterEl.style.opacity = '1'; }, 150);
      }
      if (charIdx < currentText.length) {
        letterEl.innerHTML = currentText.substring(0, charIdx + 1) + '<span class="universe-cursor">|</span>';
        charIdx++;
        universeTypewriterTimeout = setTimeout(typeNext, 35 + Math.random() * 25);
      } else {
        letterEl.innerHTML = currentText;
        universeTypewriterTimeout = setTimeout(() => {
          isDeleting = true;
          typeNext();
        }, 3500);
      }
    } else {
      if (charIdx > 0) {
        letterEl.innerHTML = currentText.substring(0, charIdx - 1) + '<span class="universe-cursor">|</span>';
        charIdx--;
        universeTypewriterTimeout = setTimeout(typeNext, 20);
      } else {
        isDeleting = false;
        letterIdx = (letterIdx + 1) % letters.length;
        typeNext();
      }
    }
  }

  typeNext();
}

function showUniverseMemory() {
  const evt = EVENTS.find(e => e.id === 'universe-of-love');
  if (!evt || !evt.memoryImages) return;
  const container = document.getElementById('universeMemory');
  if (!container) return;

  container.innerHTML = '';
  const imgSrc = evt.memoryImages[Math.floor(Math.random() * evt.memoryImages.length)];
  const img = document.createElement('div');
  img.className = 'universe-memory';
  const rotation = (Math.random() - 0.5) * 25;
  const left = 8 + Math.random() * 70;
  const top = 8 + Math.random() * 60;
  img.style.cssText = `background-image:url('${imgSrc}');left:${left}%;top:${top}%;--rotation:${rotation}deg;`;
  container.appendChild(img);

  setTimeout(() => img.classList.add('visible'), 100);
  setTimeout(() => img.classList.remove('visible'), 5000);
  setTimeout(() => { if (img.parentNode) img.parentNode.removeChild(img); }, 6500);
}
