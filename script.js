// ═══════════════════════════════════════════════════════════
// WALLACE MENDOZA PORTFOLIO - INTERACTIVE FUNCTIONALITY
// ═══════════════════════════════════════════════════════════

// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ═══════════════════════════════════════════════════════════
// TYPING ANIMATION
// ═══════════════════════════════════════════════════════════

const typeEl = document.getElementById('typeTarget');
const phrases = [
  'Wallace Mendoza',
  'Software Engineer',
  'Backend Architect',
  'Cloud Engineer',
  'Full-Stack Developer'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typeSpeed = 100;
const deleteSpeed = 50;
const pauseAfterType = 2000;
const pauseAfterDelete = 500;

function typeText() {
  if (!typeEl) return;

  const currentPhrase = phrases[phraseIndex];

  if (!isDeleting) {
    typeEl.textContent = currentPhrase.slice(0, charIndex);
    charIndex++;

    if (charIndex > currentPhrase.length) {
      isDeleting = true;
      setTimeout(typeText, pauseAfterType);
      return;
    }
  } else {
    typeEl.textContent = currentPhrase.slice(0, charIndex);
    charIndex--;

    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(typeText, pauseAfterDelete);
      return;
    }
  }

  setTimeout(typeText, isDeleting ? deleteSpeed : typeSpeed);
}

if (typeEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  typeText();
} else if (typeEl) {
  typeEl.textContent = phrases[0];
}

// ═══════════════════════════════════════════════════════════
// PARTICLE CANVAS BACKGROUND
// ═══════════════════════════════════════════════════════════

const canvas = document.getElementById('particleCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0) this.y = canvas.height;
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
    const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 100);
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    // Draw connections
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach(p2 => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          ctx.strokeStyle = `rgba(0, 255, 213, ${0.15 * (1 - distance / 120)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });
    });

    animationId = requestAnimationFrame(animate);
  }

  resizeCanvas();
  init();
  
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animate();
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    init();
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
          entry.target.style.width = entry.target.getAttribute('style').match(/width:\s*(\d+%)/)[1];
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