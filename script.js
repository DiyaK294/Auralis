// Utility: clamp header elevation on scroll
const header = document.querySelector("[data-elevate]");
const navToggle = document.querySelector(".nav-toggle");
const navList = document.getElementById("nav-menu");
const yearEl = document.getElementById("year");
const form = document.querySelector(".contact-form");
const formNote = document.querySelector(".form-note");
const themeToggle = document.getElementById("theme-toggle");

// Current year in footer
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Header elevation
let lastY = 0;
const onScroll = () => {
  const y = window.scrollY || document.documentElement.scrollTop;
  const elevated = y > 12 && y >= lastY;
  header?.classList.toggle("is-elevated", elevated);
  lastY = y;
};
addEventListener("scroll", onScroll, { passive: true });

// Mobile nav toggle
navToggle?.addEventListener("click", () => {
  const open = navList.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(open));
});
navList?.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => {
    navList.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// Intersection Observer for fade-up
const ioRoot = document.querySelector("[data-io]");
if (ioRoot && "IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("in-view");
    });
  }, { rootMargin: "0px 0px -15% 0px", threshold: 0.1 });

  [...ioRoot.children].forEach((el) => io.observe(el));
}

// Theme toggle (light/dark)
const applyTheme = (mode) => {
  document.documentElement.dataset.theme = mode;
  try { localStorage.setItem("theme", mode); } catch {}
};
const saved = (() => { try { return localStorage.getItem("theme"); } catch { return null; } })();
if (saved) applyTheme(saved);
themeToggle?.addEventListener("click", () => {
  const current = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(current);
});

// Contact form (demo only)
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const name = (data.get("name") || "").toString().trim();
  const email = (data.get("email") || "").toString().trim();
  const message = (data.get("message") || "").toString().trim();

  if (!name || !email || !message) {
    formNote.textContent = "Please fill in all fields.";
    formNote.style.color = "crimson";
    return;
  }
  // Fake latency
  formNote.textContent = "Thanks! We'll get back to you within 1–2 business days.";
  formNote.style.color = "inherit";
  form.reset();
});
