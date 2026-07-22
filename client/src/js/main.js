const API = window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api';

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

function renderBottomNav() {
  const user = getUser();
  const nav = document.createElement('nav');
  nav.className = 'mobile-bottom-nav';
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const items = [
    { href: '/index.html',      icon: '🏠', label: 'Home' },
    { href: '/events.html',     icon: '📅', label: 'Events' },
    { href: '/news.html',       icon: '📰', label: 'News' },
    { href: '/gallery.html',    icon: '🖼️', label: 'Gallery' },
    user
      ? { href: ['admin','executive','super_admin'].includes(user.role) ? '/dashboard/admin.html' : '/dashboard/member.html', icon: '👤', label: 'Dashboard' }
      : { href: '/membership.html', icon: '✋', label: 'Join Us' },
  ];
  nav.innerHTML = `<div class="mbn-items">${items.map(i =>
    `<a href="${i.href}" class="${i.href.includes(path) ? 'active' : ''}">
      <span class="mbn-icon">${i.icon}</span>${i.label}
    </a>`).join('')}</div>`;
  document.body.appendChild(nav);
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('nav-links')) renderNavbar();
  if (document.getElementById('footer')) renderFooter();
  renderBottomNav();

  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger) hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
});
