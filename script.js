// script.js

// footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// typing loop
const typeEl = document.getElementById("typeTarget");
const phrases = ["Wallace Mendoza", "a Software Engineer", "a Full Stack Developer"];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typeSpeed = 85;
const deleteSpeed = 50;
const pauseAfterType = 950;
const pauseAfterDelete = 250;

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function tick() {
  if (!typeEl) return;

  const current = phrases[phraseIndex];

  if (!isDeleting) {
    charIndex++;
    typeEl.textContent = current.slice(0, charIndex);

    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(tick, pauseAfterType);
      return;
    }

    setTimeout(tick, typeSpeed);
    return;
  }

  charIndex--;
  typeEl.textContent = current.slice(0, charIndex);

  if (charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    setTimeout(tick, pauseAfterDelete);
    return;
  }

  setTimeout(tick, deleteSpeed);
}

// start typing
if (typeEl) {
  if (prefersReducedMotion) {
    typeEl.textContent = phrases[0];
  } else {
    tick();
  }
}

// copy email button (with fallback)
const copyBtn = document.getElementById("copyEmail");
const copyStatus = document.getElementById("copyStatus");
const email = "wmendoza.dev@outlook.com";

async function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
}

if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    try {
      await copyToClipboard(email);
      if (copyStatus) copyStatus.textContent = "Copied.";
    } catch {
      if (copyStatus) copyStatus.textContent = "Copy failed. Click the email address instead.";
    }
    setTimeout(() => {
      if (copyStatus) copyStatus.textContent = "";
    }, 1800);
  });
}

// project search
const projectSearch = document.getElementById("projectSearch");
if (projectSearch) {
  projectSearch.addEventListener("input", (e) => {
    const q = (e.target.value || "").toLowerCase().trim();
    document.querySelectorAll(".project").forEach((card) => {
      const text = (card.innerText || "").toLowerCase();
      const tags = (card.getAttribute("data-tags") || "").toLowerCase();
      const show = !q || text.includes(q) || tags.includes(q);
      card.style.display = show ? "" : "none";
    });
  });
}

// mobile menu
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  // close menu when clicking a link
  mobileMenu.querySelectorAll("a[href^='#']").forEach((a) => {
    a.addEventListener("click", () => mobileMenu.classList.add("hidden"));
  });
}

// active section highlighting
const navLinks = Array.from(document.querySelectorAll(".navlink"));
const sections = ["about", "skills", "projects", "contact"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

function setActive(id) {
  navLinks.forEach((a) => {
    const href = a.getAttribute("href") || "";
    const active = href === `#${id}`;
    a.classList.toggle("isActive", active);
  });
}

if (sections.length) {
  const obs = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
      if (visible?.target?.id) setActive(visible.target.id);
    },
    { root: null, threshold: [0.2, 0.35, 0.5], rootMargin: "-20% 0px -65% 0px" }
  );

  sections.forEach((s) => obs.observe(s));
}
