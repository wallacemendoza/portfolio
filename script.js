// ═══════════════════════════════════════════════════════════
// WALLACE MENDOZA PORTFOLIO - INTERACTIVE FUNCTIONALITY
// ═══════════════════════════════════════════════════════════

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ═══════════════════════════════════════════════════════════
// PRELOADER
// ═══════════════════════════════════════════════════════════

const preloader = document.getElementById('preloader');
const preloaderFill = document.getElementById('preloaderFill');
const preloaderPct = document.getElementById('preloaderPct');

if (preloader) {
  const duration = prefersReducedMotion ? 200 : 1400;
  const start = performance.now();

  function tickLoader(now) {
    const progress = Math.min((now - start) / duration, 1);
    // Ease-out so the counter decelerates near 100 like real asset loading
    const eased = 1 - Math.pow(1 - progress, 3);
    const pct = Math.round(eased * 100);

    if (preloaderFill) preloaderFill.style.width = pct + '%';
    if (preloaderPct) preloaderPct.textContent = pct;

    if (progress < 1) {
      requestAnimationFrame(tickLoader);
    } else {
      preloader.classList.add('is-done');
      setTimeout(() => preloader.remove(), 700);
    }
  }

  requestAnimationFrame(tickLoader);
}

// ═══════════════════════════════════════════════════════════
// CUSTOM CURSOR
// ═══════════════════════════════════════════════════════════

const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

if (cursorDot && cursorRing && hasFinePointer && !prefersReducedMotion) {
  document.body.classList.add('has-custom-cursor');

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const hoverTargets = 'a, button, input, .skill-tag, .tech-pill';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) cursorRing.classList.add('is-hovering');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) cursorRing.classList.remove('is-hovering');
  });
}

// ═══════════════════════════════════════════════════════════
// SCROLL PROGRESS BAR
// ═══════════════════════════════════════════════════════════

const scrollProgress = document.getElementById('scrollProgress');

if (scrollProgress) {
  function updateProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    scrollProgress.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

// ═══════════════════════════════════════════════════════════
// TEXT SCRAMBLE / DECODE EFFECT
// ═══════════════════════════════════════════════════════════

const SCRAMBLE_CHARS = '!<>-_\\/[]{}=+*^?#01';

class TextScramble {
  constructor(el) {
    this.el = el;
    this.frameRequest = null;
  }

  setText(newText) {
    const oldText = this.el.textContent;
    const length = Math.max(oldText.length, newText.length);
    return new Promise((resolve) => {
      this.queue = [];
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        const start = Math.floor(Math.random() * 30);
        const end = start + Math.floor(Math.random() * 30);
        this.queue.push({ from, to, start, end, char: '' });
      }
      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.resolve = resolve;
      this.update();
    });
  }

  update() {
    let output = '';
    let complete = 0;
    for (const item of this.queue) {
      if (this.frame >= item.end) {
        complete++;
        output += item.to;
      } else if (this.frame >= item.start) {
        if (!item.char || Math.random() < 0.28) {
          item.char = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
        output += item.char;
      } else {
        output += item.from;
      }
    }
    this.el.textContent = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(() => this.update());
      this.frame++;
    }
  }
}

// Hero role cycler
const typeEl = document.getElementById('typeTarget');
const phrases = [
  'Software Engineer',
  'Backend Architect',
  'Cloud Engineer',
  'Full-Stack Developer'
];

if (typeEl) {
  if (prefersReducedMotion) {
    typeEl.textContent = phrases[0];
  } else {
    const scrambler = new TextScramble(typeEl);
    let phraseIndex = 0;

    function nextPhrase() {
      scrambler.setText(phrases[phraseIndex]).then(() => {
        setTimeout(nextPhrase, 2400);
      });
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
    nextPhrase();
  }
}

// Section titles decode once when scrolled into view
const scrambleTitles = document.querySelectorAll('[data-scramble]');

if (scrambleTitles.length && !prefersReducedMotion && 'IntersectionObserver' in window) {
  const titleObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const finalText = el.textContent;
          el.textContent = '';
          new TextScramble(el).setText(finalText);
          titleObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );
  scrambleTitles.forEach((el) => titleObserver.observe(el));
}

// ═══════════════════════════════════════════════════════════
// PARTICLE FIELD (MOUSE-REACTIVE)
// ═══════════════════════════════════════════════════════════

const canvas = document.getElementById('particleCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let particles = [];
  const mouse = { x: -9999, y: -9999 };
  const REPEL_RADIUS = 140;
  const LINK_DIST = 120;
  const MOUSE_LINK_DIST = 180;

  function resizeCanvas() {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  class Particle {
    constructor() {
      this.x = Math.random() * window.innerWidth;
      this.y = Math.random() * window.innerHeight;
      // Depth gives a parallax feel: far particles are smaller, dimmer, slower
      this.depth = Math.random() * 0.7 + 0.3;
      this.size = this.depth * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4 * this.depth;
      this.speedY = (Math.random() - 0.5) * 0.4 * this.depth;
      this.opacity = this.depth * 0.5 + 0.1;
    }

    update() {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.hypot(dx, dy);

      if (dist < REPEL_RADIUS && dist > 0) {
        const force = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * 1.6 * this.depth;
        this.x += (dx / dist) * force;
        this.y += (dy / dist) * force;
      }

      this.x += this.speedX;
      this.y += this.speedY;

      const w = window.innerWidth;
      const h = window.innerHeight;
      if (this.x > w) this.x = 0;
      if (this.x < 0) this.x = w;
      if (this.y > h) this.y = 0;
      if (this.y < 0) this.y = h;
    }

    draw() {
      ctx.fillStyle = `rgba(0, 255, 213, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function init() {
    particles = [];
    const particleCount = Math.min(
      Math.floor((window.innerWidth * window.innerHeight) / 14000),
      110
    );
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });

    // Particle-to-particle links
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.hypot(dx, dy);

        if (distance < LINK_DIST) {
          ctx.strokeStyle = `rgba(0, 255, 213, ${0.15 * (1 - distance / LINK_DIST)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // Brighter links from the cursor, so the field feels alive under the mouse
      const mdx = p1.x - mouse.x;
      const mdy = p1.y - mouse.y;
      const mDist = Math.hypot(mdx, mdy);
      if (mDist < MOUSE_LINK_DIST) {
        ctx.strokeStyle = `rgba(130, 87, 255, ${0.35 * (1 - mDist / MOUSE_LINK_DIST)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }

    requestAnimationFrame(animate);
  }

  resizeCanvas();
  init();

  if (!prefersReducedMotion) {
    animate();

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });
  } else {
    // Static frame so the background isn't empty
    particles.forEach((p) => p.draw());
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    init();
  });
}

// ═══════════════════════════════════════════════════════════
// GLOW ORB MOUSE PARALLAX
// ═══════════════════════════════════════════════════════════

const orbs = document.querySelectorAll('.glow-orb');

if (orbs.length && hasFinePointer && !prefersReducedMotion) {
  window.addEventListener('mousemove', (e) => {
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    orbs.forEach((orb, i) => {
      const strength = (i + 1) * 14;
      orb.style.translate = `${nx * strength}px ${ny * strength}px`;
    });
  }, { passive: true });
}

// ═══════════════════════════════════════════════════════════
// SCROLL REVEAL
// ═══════════════════════════════════════════════════════════

const revealSelectors = [
  '.section-header',
  '.glass-card',
  '.skill-card',
  '.cert-card-new',
  '.project-card',
  '.contact-card'
];

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const revealEls = document.querySelectorAll(revealSelectors.join(', '));

  // Stagger siblings inside the same parent grid
  const groups = new Map();
  revealEls.forEach((el) => {
    el.classList.add('reveal');
    const parent = el.parentElement;
    const index = groups.get(parent) || 0;
    el.style.transitionDelay = `${Math.min(index * 90, 450)}ms`;
    groups.set(parent, index + 1);
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          revealObserver.unobserve(el);
          // Drop the reveal transition once done so card hover
          // effects get their original snappy timing back
          const delayMs = (parseFloat(el.style.transitionDelay) || 0);
          setTimeout(() => {
            el.classList.remove('reveal', 'is-visible');
            el.style.transitionDelay = '';
          }, delayMs + 850);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -5% 0px' }
  );

  revealEls.forEach((el) => revealObserver.observe(el));
}

// ═══════════════════════════════════════════════════════════
// 3D TILT CARDS
// ═══════════════════════════════════════════════════════════

if (hasFinePointer && !prefersReducedMotion) {
  // Cert cards are excluded: their embedded iframes swallow mouse
  // events, which makes tilt flicker
  const tiltEls = document.querySelectorAll('.project-card, .skill-card, .hero-card');

  tiltEls.forEach((el) => {
    el.classList.add('tilt-card');

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - py) * 8;
      const ry = (px - 0.5) * 8;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
      el.style.setProperty('--gx', `${px * 100}%`);
      el.style.setProperty('--gy', `${py * 100}%`);
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

// ═══════════════════════════════════════════════════════════
// MAGNETIC BUTTONS
// ═══════════════════════════════════════════════════════════

if (hasFinePointer && !prefersReducedMotion) {
  const magneticEls = document.querySelectorAll('.cta-btn, .social-link, .logo-badge');

  magneticEls.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${dx * 0.18}px, ${dy * 0.18}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

// ═══════════════════════════════════════════════════════════
// MOBILE MENU
// ═══════════════════════════════════════════════════════════

const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  // Close menu when clicking a link
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
}

// ═══════════════════════════════════════════════════════════
// COPY EMAIL
// ═══════════════════════════════════════════════════════════

const copyBtn = document.getElementById('copyEmail');
const copyStatus = document.getElementById('copyStatus');
const email = 'wmendoza.dev@outlook.com';

if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = email;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      if (copyStatus) {
        copyStatus.textContent = '✓ Email copied to clipboard!';
        setTimeout(() => {
          copyStatus.textContent = '';
        }, 3000);
      }
    } catch (err) {
      if (copyStatus) {
        copyStatus.textContent = 'Failed to copy. Please select manually.';
        setTimeout(() => {
          copyStatus.textContent = '';
        }, 3000);
      }
    }
  });
}

// ═══════════════════════════════════════════════════════════
// PROJECT SEARCH
// ═══════════════════════════════════════════════════════════

const projectSearch = document.getElementById('projectSearch');
const projectGrid = document.getElementById('projectGrid');

if (projectSearch && projectGrid) {
  projectSearch.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    const projects = projectGrid.querySelectorAll('.project');

    projects.forEach(project => {
      const title = project.querySelector('h3').textContent.toLowerCase();
      const description = project.querySelector('p').textContent.toLowerCase();
      const tags = project.getAttribute('data-tags').toLowerCase();

      const matches = title.includes(searchTerm) ||
                     description.includes(searchTerm) ||
                     tags.includes(searchTerm);

      project.style.display = matches ? '' : 'none';
    });
  });
}

// ═══════════════════════════════════════════════════════════
// ACTIVE SECTION HIGHLIGHTING
// ═══════════════════════════════════════════════════════════

const navLinks = document.querySelectorAll('.nav-link');
const sections = ['about', 'skills', 'certifications', 'projects', 'contact']
  .map(id => document.getElementById(id))
  .filter(Boolean);

function setActiveLink(id) {
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === `#${id}`) {
      link.classList.add('isActive');
    } else {
      link.classList.remove('isActive');
    }
  });
}

if (sections.length && navLinks.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visibleEntries.length && visibleEntries[0].target.id) {
        setActiveLink(visibleEntries[0].target.id);
      }
    },
    {
      root: null,
      threshold: [0.2, 0.4, 0.6],
      rootMargin: '-10% 0px -60% 0px'
    }
  );

  sections.forEach(section => observer.observe(section));
}

// ═══════════════════════════════════════════════════════════
// SMOOTH SCROLL WITH OFFSET
// ═══════════════════════════════════════════════════════════

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');

    if (targetId === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const target = document.querySelector(targetId);
    if (target) {
      const offset = 100;
      const targetPosition = target.offsetTop - offset;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  });
});

// ═══════════════════════════════════════════════════════════
// PROGRESS BAR ANIMATIONS ON SCROLL
// ═══════════════════════════════════════════════════════════

const progressBars = document.querySelectorAll('.progress-fill');

if (progressBars.length && 'IntersectionObserver' in window) {
  const progressObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.getAttribute('data-target');
          progressObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  progressBars.forEach(bar => {
    const targetWidth = bar.style.width;
    bar.style.width = '0%';
    bar.setAttribute('data-target', targetWidth);
    progressObserver.observe(bar);
  });
}

// ═══════════════════════════════════════════════════════════
// CONSOLE MESSAGE
// ═══════════════════════════════════════════════════════════

console.log(
  '%c👋 Hey there!',
  'font-size: 24px; font-weight: bold; color: #00ffd5;'
);
console.log(
  '%cLooking for a developer? Let\'s talk!\n💼 wmendoza.dev@outlook.com',
  'font-size: 14px; color: #a1a1aa;'
);
