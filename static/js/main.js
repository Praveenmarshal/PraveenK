/* ═══════════════════════════════════════════════════════════
   PRAVEEN K PORTFOLIO — MAIN.JS
   Three.js particles · Magnetic cursor · Typewriter · Reveal
═══════════════════════════════════════════════════════════ */

/* ── THEME SWITCHER ──────────────────────────────────────── */
(function initTheme() {
  const saved = localStorage.getItem('pk-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  document.body.setAttribute('data-theme', saved);

  document.querySelectorAll('.theme-btn').forEach(btn => {
    if (btn.dataset.theme === saved) btn.classList.add('active');
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      document.documentElement.setAttribute('data-theme', theme);
      document.body.setAttribute('data-theme', theme);
      localStorage.setItem('pk-theme', theme);
      document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
})();

/* ── THREE.JS PARTICLE FIELD ─────────────────────────────── */
(function initThree() {
  const canvas = document.getElementById('threeCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 3;

  // Particles
  const particleCount = 1800;
  const positions = new Float32Array(particleCount * 3);
  const colors    = new Float32Array(particleCount * 3);
  const sizes     = new Float32Array(particleCount);

  const palette = [
    new THREE.Color('#00e5ff'),
    new THREE.Color('#ff2d78'),
    new THREE.Color('#b400ff'),
    new THREE.Color('#ffd166'),
    new THREE.Color('#ffffff'),
  ];

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 14;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
    sizes[i] = Math.random() * 2 + 0.5;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors,    3));
  geo.setAttribute('size',     new THREE.BufferAttribute(sizes,     1));

  const mat = new THREE.PointsMaterial({
    size: 0.025,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  // Connecting lines (sparse)
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x00e5ff, transparent: true, opacity: 0.04,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const lineGeo = new THREE.BufferGeometry();
  const lineVerts = [];
  for (let i = 0; i < 120; i++) {
    lineVerts.push(
      (Math.random() - 0.5) * 14, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 14, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 8
    );
  }
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lineVerts, 3));
  scene.add(new THREE.LineSegments(lineGeo, lineMat));

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 0.5;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
  });

  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    frame += 0.003;

    particles.rotation.y = frame * 0.08 + mouseX * 0.3;
    particles.rotation.x = frame * 0.04 - mouseY * 0.2;

    // Subtle size pulse
    const s = mat.size;
    mat.size = 0.025 + Math.sin(frame * 2) * 0.003;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

/* ── LOADER ──────────────────────────────────────────────── */
const loaderMessages = [
  'INITIALISING SYSTEMS...', 'LOADING DATA MODULES...', 'COMPILING PORTFOLIO...',
  'CONNECTING TO ANALYTICS ENGINE...', 'READY.'
];
let msgIdx = 0;
const loaderText = document.getElementById('loaderText');
const msgTimer = setInterval(() => {
  msgIdx++;
  if (loaderText && loaderMessages[msgIdx]) loaderText.textContent = loaderMessages[msgIdx];
  if (msgIdx >= loaderMessages.length - 1) clearInterval(msgTimer);
}, 450);

window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
    initReveal();
    initCounters();
    initHoloStats();
    initSectionWipes();
  }, 2400);
});

/* ── CUSTOM CURSOR ───────────────────────────────────────── */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function animCursor() {
  requestAnimationFrame(animCursor);
  if (!dot || !ring) return;
  dot.style.transform  = `translate(${mx - 3}px, ${my - 3}px)`;
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`;
}
animCursor();

document.querySelectorAll('a,button,.project-card,.stat-card,.contact-card,.skill-chip,.badge').forEach(el => {
  el.addEventListener('mouseenter', () => ring && ring.classList.add('hover'));
  el.addEventListener('mouseleave', () => ring && ring.classList.remove('hover'));
});
document.addEventListener('mousedown', () => ring && ring.classList.add('clicking'));
document.addEventListener('mouseup',   () => ring && ring.classList.remove('clicking'));

/* ── PAGE PROGRESS ───────────────────────────────────────── */
const progress = document.getElementById('pageProgress');
window.addEventListener('scroll', () => {
  if (!progress) return;
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  progress.style.width = pct + '%';
});

/* ── NAVBAR SCROLL ───────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── HAMBURGER ───────────────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger && hamburger.addEventListener('click', () => {
  mobileMenu && mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mobile-menu a').forEach(a =>
  a.addEventListener('click', () => mobileMenu && mobileMenu.classList.remove('open'))
);

/* ── TYPEWRITER ──────────────────────────────────────────── */
const phrases = [
  'Python & Pandas Expert',
  'Power BI Dashboard Builder',
  'SQL Data Engineer',
  'Machine Learning Enthusiast',
  'Data Story Teller',
  'Insight Generator'
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const twEl = document.getElementById('typewriterText');

function typewrite() {
  if (!twEl) return;
  const current = phrases[phraseIdx];
  if (!deleting) {
    twEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) { deleting = true; setTimeout(typewrite, 2000); return; }
    setTimeout(typewrite, 60);
  } else {
    twEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(typewrite, 400);
      return;
    }
    setTimeout(typewrite, 35);
  }
}
setTimeout(typewrite, 2800);

/* ══════════════════════════════════════════════════════════
   3D CINEMATIC SCROLL ANIMATION SYSTEM
══════════════════════════════════════════════════════════ */

/* ── Section side label ─ */
const sectionLabel = document.createElement('div');
sectionLabel.className = 'scroll-section-label';
document.body.appendChild(sectionLabel);
const sectionNames = {
  hero:'HERO', about:'ABOUT', skills:'SKILLS',
  experience:'EXPERIENCE', projects:'PROJECTS',
  resume:'RESUME', contact:'CONTACT'
};

/* ── Scroll state ─ */
let lastScrollY = 0, ticking = false;

function onScroll() {
  lastScrollY = window.scrollY;
  if (!ticking) { requestAnimationFrame(processScroll); ticking = true; }
}
window.addEventListener('scroll', onScroll, { passive: true });

function processScroll() {
  ticking = false;
  const sy = window.scrollY;
  const wh = window.innerHeight;

  // Nav
  const nb = document.getElementById('navbar');
  if (nb) nb.classList.toggle('scrolled', sy > 60);

  // Section label
  let cur = 'hero';
  document.querySelectorAll('section[id]').forEach(s => {
    if (sy >= s.offsetTop - wh * 0.4) cur = s.id;
  });
  if (sectionNames[cur]) {
    sectionLabel.textContent = '— ' + sectionNames[cur] + ' —';
    sectionLabel.classList.add('visible');
  }

  // Nav active link
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
  });

  // Hero parallax
  if (sy < wh * 1.2) {
    const p = sy * 0.4;
    const heroName = document.querySelector('.hero-name');
    const heroDesc = document.querySelector('.hero-desc');
    const heroArt  = document.querySelector('.hero-art-col');
    const gridBg   = document.querySelector('.hero-grid-bg');
    if (heroName) heroName.style.transform = `translateY(${p * 0.5}px)`;
    if (heroDesc) heroDesc.style.transform = `translateY(${p * 0.3}px)`;
    if (heroArt)  heroArt.style.transform  = `translateY(${p * 0.2}px)`;
    if (gridBg)   gridBg.style.transform   = `translateY(${p * 0.15}px)`;
  }

  // Float badges wave
  document.querySelectorAll('.float-badge').forEach((b, i) => {
    b.style.transform = `translateY(${Math.sin(sy * 0.004 + i * 1.2) * 10}px)`;
  });

  // Skills cube scroll rotation
  const skillSec = document.getElementById('skills');
  if (skillSec) {
    const rel = sy - skillSec.offsetTop;
    if (rel > -wh && rel < wh) {
      const cube = skillSec.querySelector('.cube');
      if (cube) cube.style.setProperty('--scroll-rot', rel * 0.05 + 'deg');
    }
  }

  // Projects cards wave tilt
  const projSec = document.getElementById('projects');
  if (projSec) {
    const rel = sy - projSec.offsetTop + wh * 0.5;
    if (rel > -wh && rel < wh * 2) {
      document.querySelectorAll('.project-card').forEach((c, i) => {
        if (!c.matches(':hover') && !c.classList.contains('active-card')) {
          const tilt = Math.sin(rel * 0.001 + i * 0.3) * 3;
          c.style.transform = `perspective(1000px) rotateY(${tilt + 8}deg) rotateX(2deg) scale(.95)`;
        }
      });
    }
  }

  revealOnScroll();
}

/* ── Reveal on scroll ─ */
function initReveal() {
  // Auto-tag timeline cards with stagger
  document.querySelectorAll('.timeline-item').forEach((item, i) => {
    const card = item.querySelector('.timeline-card');
    if (card && !card.classList.contains('reveal-left')) {
      card.classList.add('reveal-left');
      card.style.transitionDelay = (i * 0.15) + 's';
    }
  });
  // Auto-tag section tags
  document.querySelectorAll('.section-tag').forEach(el => {
    if (!el.classList.contains('reveal')) el.classList.add('reveal');
  });
  revealOnScroll();
}

function revealOnScroll() {
  const wh = window.innerHeight;
  document.querySelectorAll(
    '.reveal,.reveal-left,.reveal-right,.reveal-flip,.reveal-zoom,.reveal-rotate,.reveal-drop'
  ).forEach(el => {
    const rect = el.getBoundingClientRect();
    const inView = rect.top < wh * 0.88 && rect.bottom > 0;

    if (inView && !el.classList.contains('revealed')) {
      el.classList.add('revealed');
      spawnBurst(el);
    } else if (!inView && el.classList.contains('revealed')) {
      // Remove so it re-animates next time it enters
      el.classList.remove('revealed');
    }
  });
}

/* ── Particle burst on reveal ─ */
function spawnBurst(el) {
  if (Math.random() > 0.35) return;
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top  + rect.height / 2;
  for (let i = 0; i < 5; i++) {
    const p = document.createElement('div');
    p.className = 'scroll-particle';
    p.style.cssText = `left:${cx}px;top:${cy}px;`;
    document.body.appendChild(p);
    const angle = (i / 5) * Math.PI * 2 + Math.random() * 0.5;
    const dist  = 30 + Math.random() * 60;
    p.animate([
      { transform:'translate(0,0) scale(1)', opacity:1 },
      { transform:`translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist}px) scale(0)`, opacity:0 }
    ], { duration: 600 + Math.random() * 400, easing:'cubic-bezier(.22,1,.36,1)', fill:'forwards' })
    .onfinish = () => p.remove();
  }
}

/* ── Section wipe effects ─ */
function initSectionWipes() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const id = e.target.id;

      if (id === 'skills') {
        setTimeout(() => {
          e.target.querySelectorAll('.skill-fill').forEach((bar, i) => {
            setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, i * 80);
          });
        }, 300);
        const cc = e.target.querySelector('.cube-container');
        if (cc) {
          cc.style.transform  = 'scale(0) rotateY(180deg)';
          cc.style.transition = 'transform 1s cubic-bezier(.22,1,.36,1) .3s';
          setTimeout(() => { cc.style.transform = ''; }, 50);
        }
      }

      if (id === 'experience') {
        e.target.querySelectorAll('.timeline-dot').forEach((dot, i) => {
          setTimeout(() => dot.classList.add('visible'), i * 300 + 200);
        });
      }

      if (id === 'about') {
        e.target.querySelectorAll('.badge').forEach((b, i) => {
          b.style.cssText = `opacity:0;transform:translateY(20px) scale(.8);transition:all .5s cubic-bezier(.22,1,.36,1) ${.3+i*.06}s`;
          setTimeout(() => { b.style.opacity='1'; b.style.transform=''; }, 50);
        });
      }

      if (id === 'contact') {
        e.target.querySelectorAll('.contact-card').forEach((c, i) => {
          c.style.transitionDelay = (i * 0.1) + 's';
        });
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('section[id]').forEach(s => obs.observe(s));
}

/* ── Counters ─ */
function initCounters() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = +el.dataset.count;
      let   cur = 0;
      const step = Math.max(20, 1800 / end);
      const timer = setInterval(() => {
        cur++;
        el.textContent = cur;
        el.classList.toggle('counting', true);
        setTimeout(() => el.classList.remove('counting'), 150);
        if (cur >= end) clearInterval(timer);
      }, step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
}

/* ── Holo card stats ─ */
function initHoloStats() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, end = +el.dataset.count;
      let cur = 0;
      const t = setInterval(() => { el.textContent = ++cur; if (cur >= end) clearInterval(t); }, 300);
      obs.unobserve(el);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.hs-val[data-count]').forEach(el => obs.observe(el));
}

/* ── Skill bars (triggered by section wipe, keep as fallback) ─ */
const skillObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.skill-fill').forEach(bar => { bar.style.width = bar.dataset.width + '%'; });
    skillObs.unobserve(e.target);
  });
}, { threshold: 0.2 });
document.querySelectorAll('.skill-category').forEach(s => skillObs.observe(s));

/* ── Magnetic buttons ─ */
document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX-r.left-r.width/2)*.25}px,${(e.clientY-r.top-r.height/2)*.35}px)`;
  });
  el.addEventListener('mouseleave', () => el.style.transform = '');
});

/* ── Ripple ─ */
function createRipple(e) {
  const btn = e.currentTarget;
  const r   = btn.getBoundingClientRect();
  const rip = document.createElement('span');
  rip.className = 'ripple';
  rip.style.left = (e.clientX - r.left - 5) + 'px';
  rip.style.top  = (e.clientY - r.top  - 5) + 'px';
  btn.appendChild(rip);
  setTimeout(() => rip.remove(), 700);
}
window.createRipple = createRipple;

/* ── Holo card mouse tilt ─ */
const holoCard = document.getElementById('holoCard');
if (holoCard) {
  holoCard.addEventListener('mousemove', e => {
    const r = holoCard.getBoundingClientRect();
    holoCard.style.transform = `rotateY(${((e.clientX-r.left)/r.width-.5)*20}deg) rotateX(${-(((e.clientY-r.top)/r.height-.5))*20}deg) scale(1.04)`;
    holoCard.style.animation = 'none';
  });
  holoCard.addEventListener('mouseleave', () => { holoCard.style.transform=''; holoCard.style.animation=''; });
}

/* ── VanillaTilt ─ */
if (typeof VanillaTilt !== 'undefined') VanillaTilt.init(document.querySelectorAll('[data-tilt]'));

/* ── Glitch ─ */
function triggerGlitch() {
  document.querySelectorAll('.name-row').forEach(el => {
    el.style.textShadow = `${Math.random()*6-3}px 0 var(--accent),${Math.random()*-6+3}px 0 var(--accent-alt)`;
    setTimeout(() => el.style.textShadow = '', 80);
  });
}
setInterval(() => { if (Math.random() > 0.6) triggerGlitch(); }, 3000);

/* ── Init all on load ─ */

/* ── CONTACT FORM ────────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    const name  = document.getElementById('formName');
    const email = document.getElementById('formEmail');
    const msg   = document.getElementById('formMsg');

    [name, email, msg].forEach(f => f.closest('.form-group').classList.remove('error'));

    if (!name.value.trim() || name.value.trim().length < 2) {
      name.closest('.form-group').classList.add('error'); valid = false;
    }
    if (!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      email.closest('.form-group').classList.add('error'); valid = false;
    }
    if (!msg.value.trim() || msg.value.trim().length < 10) {
      msg.closest('.form-group').classList.add('error'); valid = false;
    }
    if (!valid) return;

    const btn = contactForm.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<span>Sending...</span>';
    btn.disabled = true;

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.value, email: email.value, message: msg.value })
      });
      const data = await res.json();
      if (data.success) {
        btn.innerHTML = '<span>✓ Message Sent!</span>';
        btn.style.background = 'linear-gradient(135deg,#00e5ff,#00ff88)';
        contactForm.reset();
        setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.disabled = false; }, 3000);
      } else throw new Error();
    } catch {
      btn.innerHTML = '<span>✗ Try Again</span>';
      btn.style.background = 'linear-gradient(135deg,#ff2d78,#ff6b6b)';
      setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.disabled = false; }, 2500);
    }
  });
}

/* ── CHATBOT ─────────────────────────────────────────────── */
const chatWindow = document.getElementById('chatbotWindow');
function toggleChatbot() {
  chatWindow && chatWindow.classList.toggle('open');
}
window.toggleChatbot = toggleChatbot;

async function sendMessage() {
  const input = document.getElementById('chatInput');
  const msgs  = document.getElementById('chatMessages');
  if (!input || !msgs) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';

  const userMsg = document.createElement('div');
  userMsg.className = 'chat-msg user';
  userMsg.textContent = text;
  msgs.appendChild(userMsg);

  const typing = document.createElement('div');
  typing.className = 'chat-msg bot';
  typing.innerHTML = '<em style="color:var(--muted)">Thinking...</em>';
  msgs.appendChild(typing);
  msgs.scrollTop = msgs.scrollHeight;

  const qr = document.getElementById('quickReplies');
  if (qr) qr.style.display = 'none';

  try {
    const res  = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });
    const data = await res.json();
    typing.innerHTML = data.reply || data.response || 'Sorry, I could not get a response.';
  } catch {
    typing.innerHTML = '⚠️ Connection error. Please try again.';
  }
  msgs.scrollTop = msgs.scrollHeight;
}
window.sendMessage = sendMessage;

function sendQuickReply(text) {
  const input = document.getElementById('chatInput');
  if (input) { input.value = text; sendMessage(); }
}
window.sendQuickReply = sendQuickReply;

document.getElementById('chatInput') &&
  document.getElementById('chatInput').addEventListener('keydown', e => e.key === 'Enter' && sendMessage());

function exportChatHistory() {
  const msgs = document.querySelectorAll('.chat-msg');
  let text = 'Praveen K Portfolio — Chat Export\n' + new Date().toLocaleString() + '\n\n';
  msgs.forEach(m => {
    text += (m.classList.contains('user') ? 'You: ' : 'AI: ') + m.textContent + '\n';
  });
  const a = document.createElement('a');
  a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
  a.download = 'chat-export.txt';
  a.click();
}
window.exportChatHistory = exportChatHistory;

/* ── RESUME DOWNLOAD ─────────────────────────────────────── */
function downloadResumePDF() {
  // Try direct static file first (most reliable)
  const link = document.createElement('a');
  link.href = '/static/resume/Praveen_K_resume.pdf';
  link.download = 'Praveen_K_Resume.pdf';
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
window.downloadResumePDF = downloadResumePDF;

/* ── PROJECTS HORIZONTAL SCROLL ──────────────────────────── */
(function initProjectsScroll() {
  const track   = document.getElementById('projectsTrack');
  const bar     = document.getElementById('projectsScrollBar');
  const count   = document.getElementById('projCount');
  const cards   = document.querySelectorAll('.project-card');
  if (!track || !cards.length) return;

  const CARD_W  = 340 + 28; // card width + gap
  let current   = 0;

  // Update scroll progress bar + counter
  function updateUI() {
    const maxScroll = track.scrollWidth - track.clientWidth;
    const pct = maxScroll > 0 ? (track.scrollLeft / maxScroll) * 100 : 0;
    if (bar) bar.style.width = Math.max(8, pct) + '%';

    // Active card
    const idx = Math.round(track.scrollLeft / CARD_W);
    current = Math.max(0, Math.min(idx, cards.length - 1));
    if (count) count.textContent = (current + 1) + ' / ' + cards.length;

    cards.forEach((c, i) => c.classList.toggle('active-card', i === current));
  }

  track.addEventListener('scroll', updateUI, { passive: true });

  // Arrow nav
  window.scrollProjects = function(dir) {
    const next = Math.max(0, Math.min(current + dir, cards.length - 1));
    track.scrollTo({ left: next * CARD_W, behavior: 'smooth' });
  };

  // Drag to scroll
  let isDown = false, startX = 0, scrollLeft = 0;
  track.addEventListener('mousedown', e => {
    isDown = true; startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft; track.style.cursor = 'grabbing';
  });
  track.addEventListener('mouseleave', () => { isDown = false; track.style.cursor = 'grab'; });
  track.addEventListener('mouseup',    () => { isDown = false; track.style.cursor = 'grab'; });
  track.addEventListener('mousemove',  e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    track.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });

  // Touch support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchmove',  e => {
    const diff = touchStartX - e.touches[0].clientX;
    track.scrollLeft += diff * 0.8;
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  // Keyboard arrow keys when hovering
  track.setAttribute('tabindex', '0');
  track.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') scrollProjects(1);
    if (e.key === 'ArrowLeft')  scrollProjects(-1);
  });

  // Init
  updateUI();
  setTimeout(updateUI, 100);
})();

