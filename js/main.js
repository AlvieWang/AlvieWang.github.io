// ========== Component Loader ==========
// Dynamically loads HTML components into placeholder elements.
// Falls back gracefully if fetch fails (e.g., opened as file://).

const COMPONENTS = [
  { id: 'c-nav',          file: 'components/nav.html' },
  { id: 'c-hero',         file: 'components/hero.html' },
  { id: 'c-bio',          file: 'components/bio.html' },
  { id: 'c-education',    file: 'components/education.html' },
  { id: 'c-experience',   file: 'components/experience.html' },
  { id: 'c-projects',     file: 'components/projects.html' },
  { id: 'c-publications', file: 'components/publications.html' },
  { id: 'c-skills',       file: 'components/skills.html' },
  { id: 'c-honors',       file: 'components/honors.html' },
  { id: 'c-status',       file: 'components/status.html' },
  { id: 'c-contact',      file: 'components/contact.html' },
  { id: 'c-footer',       file: 'components/footer.html' }
];

async function loadComponents() {
  const fetches = COMPONENTS.map(async (comp) => {
    const el = document.getElementById(comp.id);
    if (!el) return;
    try {
      const resp = await fetch(comp.file);
      if (!resp.ok) throw new Error(resp.status);
      el.innerHTML = await resp.text();
    } catch (e) {
      console.warn(`[components] Could not load ${comp.file}:`, e.message);
    }
  });
  await Promise.all(fetches);
  initApp();
}

// ========== App Initialisation (runs after all components are in DOM) ==========
function initApp() {

  // --- Theme Toggle ---
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateThemeIcon(next);
    });
  }

  function updateThemeIcon(theme) {
    if (themeToggle) themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
  }

  // --- Scroll Reveal ---
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // --- Skill Bar Animation ---
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(fill => {
          fill.style.width = fill.dataset.w + '%';
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-category').forEach(el => skillObserver.observe(el));

  // --- Navbar Shadow on Scroll ---
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.style.boxShadow = window.scrollY > 10 ? 'var(--shadow-md)' : 'none';
    }
  });

  // --- Smooth Scroll ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// Kick off
loadComponents();
