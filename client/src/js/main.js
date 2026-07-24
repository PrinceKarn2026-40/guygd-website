const API = window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : '/api';

function getToken() { return localStorage.getItem('guygd_token'); }
function getUser() { return JSON.parse(localStorage.getItem('guygd_user') || 'null'); }

async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const res = await fetch(`${API}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

function showAlert(containerId, message, type = 'success') {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.className = `alert alert-${type}`;
  el.textContent = message;
  el.style.display = 'block';
  setTimeout(() => (el.style.display = 'none'), 5000);
}

function applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
}

function toggleDark() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  localStorage.setItem('guygd_theme', isDark ? 'light' : 'dark');
  applyTheme(!isDark);
  document.querySelectorAll('.dark-toggle').forEach(btn => {
    btn.textContent = isDark ? '🌙' : '☀️';
  });
}

// Apply saved theme immediately
(function() {
  const saved = localStorage.getItem('guygd_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved ? saved === 'dark' : prefersDark);
})();

function renderNavbar() {
  const user = getUser();
  const links = `
    <a href="/index.html">Home</a>
    <a href="/about.html">About</a>
    <a href="/leadership.html">Leadership</a>
    <a href="/programs.html">Projects</a>
    <a href="/events.html">Events</a>
    <a href="/news.html">News</a>
    <a href="/gallery.html">Gallery</a>
    <a href="/campaign.html">Campaign</a>
    <a href="/donate.html">Donate</a>
    <a href="/contact.html">Contact</a>
    ${user
      ? `<a href="${['admin','executive','super_admin'].includes(user.role) ? '/dashboard/admin.html' : '/dashboard/member.html'}" class="btn-nav">Dashboard</a>`
      : `<a href="/membership.html" class="btn-nav">Join Us</a>`}
  `;
  document.getElementById('nav-links').innerHTML = links;
  // inject dark toggle after nav-links
  const existing = document.querySelector('.dark-toggle');
  if (!existing) {
    const btn = document.createElement('button');
    btn.className = 'dark-toggle';
    btn.title = 'Toggle dark mode';
    btn.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
    btn.addEventListener('click', toggleDark);
    document.getElementById('nav-links').after(btn);
  }
  highlightActiveLink();
}

function highlightActiveLink() {
  const path = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href').includes(path)) a.classList.add('active');
  });
}

function renderFooter() {
  document.getElementById('footer').innerHTML = `
    <div class="footer-grid">
      <div class="footer-brand">
        <strong style="color:#fff;font-size:1.1rem;">GUYGD</strong>
        <p>Gbeh-lay United Youths for Growth and Development. Uniting young people through education, leadership, and community service.</p>
        <div class="social-links">
          <a href="#" title="Facebook">f</a>
          <a href="#" title="Twitter">t</a>
          <a href="#" title="Instagram">in</a>
          <a href="#" title="WhatsApp">w</a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Quick Links</h4>
        <a href="/about.html">About Us</a>
        <a href="/leadership.html">Leadership</a>
        <a href="/programs.html">Projects</a>
        <a href="/membership.html">Membership</a>
      </div>
      <div class="footer-col">
        <h4>Resources</h4>
        <a href="/events.html">Events</a>
        <a href="/news.html">News</a>
        <a href="/gallery.html">Gallery</a>
        <a href="/campaign.html">Campaign</a>
      </div>
      <div class="footer-col">
        <h4>Contact</h4>
        <a href="/contact.html">Contact Us</a>
        <a href="mailto:info@guygd.org">info@guygd.org</a>
        <a href="#">Gbeh-lay, Liberia</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© ${new Date().getFullYear()} GUYGD. All rights reserved.</span>
      <span>Built with ❤️ for the youth of Gbeh-lay</span>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('nav-links')) renderNavbar();
  if (document.getElementById('footer')) renderFooter();

  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  // Replace hamburger inner content with animated bars
  hamburger.innerHTML = '<span class="bar"></span><span class="bar"></span><span class="bar"></span>';
  hamburger.setAttribute('aria-label', 'Toggle menu');
  hamburger.setAttribute('aria-expanded', 'false');

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  function openMenu() {
    navLinks.classList.add('open');
    hamburger.classList.add('active');
    overlay.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // Add nav header if not present
    if (!navLinks.querySelector('.nav-mobile-header')) {
      const header = document.createElement('div');
      header.className = 'nav-mobile-header';
      header.innerHTML = '<span>🌿 GUYGD</span>';
      navLinks.insertBefore(header, navLinks.firstChild);
    }
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    overlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Close when any nav link is tapped
  navLinks.addEventListener('click', e => {
    if (e.target.tagName === 'A') closeMenu();
  });

  // Close when overlay is tapped
  overlay.addEventListener('click', closeMenu);

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
});
