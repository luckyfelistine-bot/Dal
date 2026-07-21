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
      bg: 'linear-gradient(135deg, #0a0518, #1a0f3a, #0f0c29)',
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


function buildUniverseEventHTML(evt) {
  return `
    <div class="garden-wrapper" id="gardenWrapper">
      <div class="garden-stars-bg" id="gardenStarsBg"></div>
      <div class="garden-shooting-container" id="gardenShooting"></div>

      <div class="garden-title">Dal's Constellation Garden</div>
      <div class="garden-subtitle">Touch the stars to connect them with love</div>

      <div class="garden-constellation" id="gardenConstellation">
        <svg class="garden-connections" id="gardenConnections" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="loveLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#e8a0bf;stop-opacity:0.8" />
              <stop offset="50%" style="stop-color:#a78bfa;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#e8a0bf;stop-opacity:0.8" />
            </linearGradient>
          </defs>
        </svg>

        <div class="garden-star" data-star="0" style="left:15%;top:20%">
          <div class="garden-star-photo" style="background-image:url('${evt.memoryImages[0]}')"></div>
          <div class="garden-star-label">Beautiful</div>
          <div class="garden-star-glow"></div>
        </div>

        <div class="garden-star" data-star="1" style="left:75%;top:15%">
          <div class="garden-star-photo" style="background-image:url('${evt.memoryImages[1]}')"></div>
          <div class="garden-star-label">Charming</div>
          <div class="garden-star-glow"></div>
        </div>

        <div class="garden-star" data-star="2" style="left:50%;top:55%">
          <div class="garden-star-photo" style="background-image:url('${evt.memoryImages[2]}')"></div>
          <div class="garden-star-label">Cheerful</div>
          <div class="garden-star-glow"></div>
        </div>

        <div class="garden-star" data-star="3" style="left:20%;top:70%">
          <div class="garden-star-photo" style="background-image:url('${evt.memoryImages[3]}')"></div>
          <div class="garden-star-label">Perfect</div>
          <div class="garden-star-glow"></div>
        </div>

        <div class="garden-star" data-star="4" style="left:80%;top:65%">
          <div class="garden-star-photo" style="background-image:url('${evt.memoryImages[4]}')"></div>
          <div class="garden-star-label">Queen</div>
          <div class="garden-star-glow"></div>
        </div>

        <div class="garden-center-heart" id="gardenCenterHeart">💖</div>
      </div>

      <div class="garden-letter" id="gardenLetter"></div>
      <div class="garden-connections-count" id="gardenCount">Connect the stars 💫</div>
      <div class="garden-floating-hearts" id="gardenHearts"></div>
    </div>
  `;
}

// ===================== CONSTELLATION GARDEN =====================
// Dal's photos are the stars. Click them to connect with glowing love lines.
// Lightweight DOM-based. No canvas. Pure CSS + minimal JS.

let gardenActive = false;
let gardenTypewriterTimeout = null;
let gardenShootingInterval = null;
let gardenHeartsInterval = null;
let gardenConnectedStars = new Set();
let gardenLastStar = null;

function initUniverseSky() {
  gardenActive = true;
  gardenConnectedStars = new Set();
  gardenLastStar = null;

  generateGardenStars();
  startGardenTypewriter();
  startGardenShootingStars();
  startGardenFloatingHearts();

  // Setup star click handlers
  document.querySelectorAll('.garden-star').forEach(star => {
    star.addEventListener('click', onGardenStarClick);
  });

  // Center heart burst
  const heart = document.getElementById('gardenCenterHeart');
  if (heart) {
    heart.addEventListener('click', onGardenHeartBurst);
  }
}

function destroyUniverseSky() {
  gardenActive = false;
  if (gardenTypewriterTimeout) { clearTimeout(gardenTypewriterTimeout); gardenTypewriterTimeout = null; }
  if (gardenShootingInterval) { clearInterval(gardenShootingInterval); gardenShootingInterval = null; }
  if (gardenHeartsInterval) { clearInterval(gardenHeartsInterval); gardenHeartsInterval = null; }
  gardenConnectedStars.clear();
  gardenLastStar = null;
}

function generateGardenStars() {
  const stars = document.querySelectorAll('.garden-star');
  stars.forEach((star, i) => {
    // Stagger entrance animation
    star.style.animationDelay = `${i * 0.3}s`;
    star.classList.add('garden-star-enter');

    // Random float animation delay for each star
    const glow = star.querySelector('.garden-star-glow');
    if (glow) {
      glow.style.animationDelay = `${Math.random() * 3}s`;
    }
  });
}

function onGardenStarClick(e) {
  if (!gardenActive) return;
  const star = e.currentTarget;
  const starId = star.dataset.star;

  // Toggle active state
  if (gardenConnectedStars.has(starId)) {
    gardenConnectedStars.delete(starId);
    star.classList.remove('garden-star-active');
  } else {
    gardenConnectedStars.add(starId);
    star.classList.add('garden-star-active');
    spawnGardenSparkles(star);
  }

  // Draw connection line from previous star
  if (gardenLastStar && gardenLastStar !== starId) {
    drawGardenLine(gardenLastStar, starId);
  }
  gardenLastStar = starId;

  // Update count text
  updateGardenCount();

  // If all 5 connected, celebrate!
  if (gardenConnectedStars.size === 5) {
    celebrateGardenComplete();
  }
}

function drawGardenLine(fromId, toId) {
  const svg = document.getElementById('gardenConnections');
  const fromStar = document.querySelector(`.garden-star[data-star="${fromId}"]`);
  const toStar = document.querySelector(`.garden-star[data-star="${toId}"]`);
  if (!svg || !fromStar || !toStar) return;

  const constellation = document.getElementById('gardenConstellation');
  const rect = constellation.getBoundingClientRect();
  const fromRect = fromStar.getBoundingClientRect();
  const toRect = toStar.getBoundingClientRect();

  const x1 = fromRect.left + fromRect.width / 2 - rect.left;
  const y1 = fromRect.top + fromRect.height / 2 - rect.top;
  const x2 = toRect.left + toRect.width / 2 - rect.left;
  const y2 = toRect.top + toRect.height / 2 - rect.top;

  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', x1);
  line.setAttribute('y1', y1);
  line.setAttribute('x2', x2);
  line.setAttribute('y2', y2);
  line.setAttribute('stroke', 'url(#loveLine)');
  line.setAttribute('stroke-width', '2');
  line.setAttribute('stroke-linecap', 'round');
  line.style.opacity = '0';
  line.style.transition = 'opacity 0.8s ease';

  svg.appendChild(line);
  requestAnimationFrame(() => { line.style.opacity = '1'; });
}

function spawnGardenSparkles(star) {
  const rect = star.getBoundingClientRect();
  const wrapper = document.getElementById('gardenWrapper');
  if (!wrapper) return;

  for (let i = 0; i < 8; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'garden-sparkle';
    const angle = (i / 8) * Math.PI * 2;
    const dist = 30 + Math.random() * 20;
    sparkle.style.cssText = `
      left: ${rect.left + rect.width/2 - wrapper.getBoundingClientRect().left}px;
      top: ${rect.top + rect.height/2 - wrapper.getBoundingClientRect().top}px;
      --sparkle-tx: ${Math.cos(angle) * dist}px;
      --sparkle-ty: ${Math.sin(angle) * dist}px;
    `;
    sparkle.textContent = ['✨','💫','💖','⭐'][Math.floor(Math.random()*4)];
    wrapper.appendChild(sparkle);
    setTimeout(() => { if (sparkle.parentNode) sparkle.remove(); }, 1200);
  }
}

function updateGardenCount() {
  const countEl = document.getElementById('gardenCount');
  if (!countEl) return;
  const count = gardenConnectedStars.size;
  const labels = [
    'Connect the stars 💫',
    '1 star lit ✨',
    '2 stars connected 💕',
    '3 stars shining 🌟',
    '4 stars glowing 💗',
    'All stars connected! The universe is complete 💖'
  ];
  countEl.textContent = labels[count] || labels[0];
}

function celebrateGardenComplete() {
  const wrapper = document.getElementById('gardenWrapper');
  if (!wrapper) return;

  // Burst of hearts
  for (let i = 0; i < 20; i++) {
    const heart = document.createElement('div');
    heart.className = 'garden-celebration-heart';
    heart.style.left = `${10 + Math.random() * 80}%`;
    heart.style.top = `${10 + Math.random() * 80}%`;
    heart.style.animationDelay = `${Math.random() * 0.5}s`;
    heart.textContent = ['💖','💗','💕','💝','💘'][Math.floor(Math.random()*5)];
    wrapper.appendChild(heart);
    setTimeout(() => { if (heart.parentNode) heart.remove(); }, 3000);
  }

  // Show special message
  const countEl = document.getElementById('gardenCount');
  if (countEl) {
    countEl.style.color = '#e8a0bf';
    countEl.style.textShadow = '0 0 20px rgba(232,160,191,0.6)';
  }
}

function onGardenHeartBurst(e) {
  e.stopPropagation();
  const wrapper = document.getElementById('gardenWrapper');
  if (!wrapper || !gardenActive) return;

  const heart = e.currentTarget;
  heart.classList.add('garden-heart-burst');
  setTimeout(() => heart.classList.remove('garden-heart-burst'), 600);

  for (let i = 0; i < 12; i++) {
    const particle = document.createElement('div');
    particle.className = 'garden-heart-particle';
    particle.style.left = '50%';
    particle.style.top = '50%';
    const angle = (i / 12) * Math.PI * 2;
    const dist = 60 + Math.random() * 80;
    particle.style.cssText += `
      --heart-tx: ${Math.cos(angle) * dist}px;
      --heart-ty: ${Math.sin(angle) * dist}px;
      --heart-rot: ${Math.random() * 360}deg;
    `;
    particle.textContent = ['💖','✨','💫','🌟','💗'][Math.floor(Math.random()*5)];
    wrapper.appendChild(particle);
    setTimeout(() => { if (particle.parentNode) particle.remove(); }, 2000);
  }
}

function startGardenTypewriter() {
  const evt = EVENTS.find(e => e.id === 'universe-of-love');
  if (!evt || !evt.loveLetters) return;
  const letterEl = document.getElementById('gardenLetter');
  if (!letterEl) return;

  let letterIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function typeNext() {
    if (!letterEl || !gardenActive) return;
    const letters = evt.loveLetters;
    const currentText = letters[letterIdx];

    if (!isDeleting) {
      if (charIdx === 0) {
        letterEl.style.opacity = '0';
        setTimeout(() => { if (letterEl) letterEl.style.opacity = '1'; }, 200);
      }
      if (charIdx < currentText.length) {
        letterEl.innerHTML = currentText.substring(0, charIdx + 1) + '<span class="garden-cursor">|</span>';
        charIdx++;
        gardenTypewriterTimeout = setTimeout(typeNext, 35 + Math.random() * 20);
      } else {
        letterEl.innerHTML = currentText;
        gardenTypewriterTimeout = setTimeout(() => {
          isDeleting = true;
          typeNext();
        }, 3500);
      }
    } else {
      if (charIdx > 0) {
        letterEl.innerHTML = currentText.substring(0, charIdx - 1) + '<span class="garden-cursor">|</span>';
        charIdx--;
        gardenTypewriterTimeout = setTimeout(typeNext, 18);
      } else {
        isDeleting = false;
        letterIdx = (letterIdx + 1) % letters.length;
        typeNext();
      }
    }
  }

  typeNext();
}

function startGardenShootingStars() {
  gardenShootingInterval = setInterval(() => {
    if (!gardenActive) return;
    const container = document.getElementById('gardenShooting');
    if (!container) return;

    const star = document.createElement('div');
    star.className = 'garden-shooting-star';
    star.style.top = `${5 + Math.random() * 40}%`;
    star.style.animationDuration = `${1 + Math.random() * 1.5}s`;
    container.appendChild(star);
    setTimeout(() => { if (star.parentNode) star.remove(); }, 3000);
  }, 5000 + Math.random() * 5000);
}

function startGardenFloatingHearts() {
  gardenHeartsInterval = setInterval(() => {
    if (!gardenActive) return;
    const container = document.getElementById('gardenHearts');
    if (!container) return;

    const heart = document.createElement('div');
    heart.className = 'garden-floating-heart';
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDuration = `${4 + Math.random() * 4}s`;
    heart.style.animationDelay = `${Math.random() * 2}s`;
    heart.textContent = ['💖','💕','💗','💝','💘'][Math.floor(Math.random()*5)];
    container.appendChild(heart);
    setTimeout(() => { if (heart.parentNode) heart.remove(); }, 10000);
  }, 2000);
}

// ===================== INIT =====================
loadSong(0);
renderEventButtons();
setupCursorHover();
showToast('Welcome, Dal. Use arrow keys or scroll to navigate 💫');


