// footer year
document.getElementById("year").textContent = new Date().getFullYear();

// typing loop
const typeEl = document.getElementById("typeTarget");

const phrases = ["Wallace Mendoza", "a Software Engineer"];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typeSpeed = 90;
const deleteSpeed = 55;
const pauseAfterType = 1000;
const pauseAfterDelete = 350;

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function tick() {
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

// copy email button
document.getElementById("copyEmail").addEventListener("click", async () => {
  const email = "wmendoza.dev@outlook.com";
  const status = document.getElementById("copyStatus");
  try {
    await navigator.clipboard.writeText(email);
    status.textContent = "Copied.";
  } catch {
    status.textContent = "Copy failed. Click the email address instead.";
  }
  setTimeout(() => (status.textContent = ""), 2000);
});

// project search
document.getElementById("projectSearch").addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase().trim();
  document.querySelectorAll(".project").forEach((card) => {
    const text = card.innerText.toLowerCase();
    const tags = (card.getAttribute("data-tags") || "").toLowerCase();
    const show = text.includes(q) || tags.includes(q);
    card.style.display = show ? "" : "none";
  });
});
