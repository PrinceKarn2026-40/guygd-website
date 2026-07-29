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
    btn.textContent = isDark ? '\uD83C\uDF19' : '\u2600\uFE0F';
  });
}

// Apply saved theme immediately
(function () {
  const saved = localStorage.getItem('guygd_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved ? saved === 'dark' : prefersDark);
})();

// ── GLOBAL NAV STATE ──────────────────────────────────
var _navOpen = false;

function openMenu() {
  var nav = document.getElementById('nav-links');
  var overlay = document.getElementById('nav-overlay');
  var hamburger = document.querySelector('.hamburger');
  if (!nav || _navOpen) return;
  _navOpen = true;
  nav.classList.add('open');
  overlay && overlay.classList.add('open');
  hamburger && hamburger.classList.add('active');
  hamburger && hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  var nav = document.getElementById('nav-links');
  var overlay = document.getElementById('nav-overlay');
  var hamburger = document.querySelector('.hamburger');
  if (!nav) return;
  _navOpen = false;
  nav.classList.remove('open');
  overlay && overlay.classList.remove('open');
  hamburger && hamburger.classList.remove('active');
  hamburger && hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

function renderNavbar() {
  const user = getUser();
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';

  const navItems = [
    { href: '/index.html',      label: 'Home' },
    { href: '/about.html',      label: 'About' },
    { href: '/leadership.html', label: 'Leadership' },
    { href: '/programs.html',   label: 'Projects' },
    { href: '/events.html',     label: 'Events' },
    { href: '/news.html',       label: 'News' },
    { href: '/gallery.html',    label: 'Gallery' },
    { href: '/campaign.html',   label: 'Campaign' },
    { href: '/donate.html',     label: 'Donate' },
    { href: '/contact.html',    label: 'Contact' },
  ];

  const links = navItems.map(item => {
    const isActive = page === item.href.replace('/', '') || path === item.href;
    return '<a href="' + item.href + '"' + (isActive ? ' class="active"' : '') + '>' + item.label + '</a>';
  }).join('');

  const cta = user
    ? '<a href="' + (['admin','executive','super_admin'].includes(user.role) ? '/dashboard/admin.html' : '/dashboard/member.html') + '" class="btn-nav">Dashboard</a>'
    : '<a href="/membership.html" class="btn-nav">Join GUYGD</a>';

  document.getElementById('nav-links').innerHTML = links + cta;
}

function renderFooter() {
  document.getElementById('footer').innerHTML = `
    <div class="footer-grid">
      <div class="footer-brand">
        <strong style="color:#fff;font-size:1.1rem;">GUYGD</strong>
        <p>Gbeh-lay United Youths for Growth and Development. Uniting young people through education, leadership, and community service.</p>
        <div class="social-links">
          <a href="https://www.facebook.com/share/1D6KEuhVUc/?mibextid=wwXIfr" target="_blank" rel="noopener" title="Facebook">f</a>
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
        <a href="https://www.google.com/maps/place/Karnplay/@7.2644956,-8.5066949,17z/data=!3m1!4b1!4m6!3m5!1s0xfa5a749bca6995d:0xb6b0c81a43fbb4f0!8m2!3d7.2644956!4d-8.50412!16s%2Fg%2F11sdsjnb3j?hl=en&entry=ttu&g_ep=EgoyMDI2MDcyNi4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener">&#128205; Gbehlay Geh Statutory District</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; ${new Date().getFullYear()} GUYGD. All rights reserved.</span>
      <span>Built with &#10084;&#65039; for the youth of Gbeh-lay</span>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('nav-links')) renderNavbar();
  if (document.getElementById('footer')) renderFooter();

  const hamburger = document.querySelector('.hamburger');
  const nav = document.getElementById('nav-links');
  if (!hamburger || !nav) return;

  hamburger.innerHTML = '<span class="bar"></span><span class="bar"></span><span class="bar"></span>';
  hamburger.setAttribute('aria-label', 'Open menu');
  hamburger.setAttribute('aria-expanded', 'false');

  // Overlay
  let overlay = document.getElementById('nav-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'nav-overlay';
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
  }

  // Mobile header inside drawer
  if (!nav.querySelector('.nav-mobile-header')) {
    const hdr = document.createElement('div');
    hdr.className = 'nav-mobile-header';
    const logo = document.createElement('span');
    logo.textContent = '\uD83C\uDF3F GUYGD';
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Close menu');
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', closeMenu);
    hdr.appendChild(logo);
    hdr.appendChild(closeBtn);
    nav.insertBefore(hdr, nav.firstChild);
  }

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    _navOpen ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  // Close on link tap, then navigate
  nav.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
});
