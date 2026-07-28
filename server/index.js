require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/db');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../client/public/assets/images/uploads')));
app.use('/images', express.static(path.join(__dirname, '../client/public/assets/images')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/members', require('./routes/members'));
app.use('/api/scholarships', require('./routes/scholarships'));
app.use('/api/events', require('./routes/events'));
app.use('/api/news', require('./routes/news'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/team', require('./routes/team'));
app.use('/api/programs', require('./routes/programs'));
app.use('/api/applications', require('./routes/applications'));

const staticOpts = { setHeaders: (res, filePath) => {
  if (filePath.endsWith('.html')) res.setHeader('Content-Type', 'text/html; charset=utf-8');
  if (filePath.endsWith('.css'))  res.setHeader('Content-Type', 'text/css; charset=utf-8');
  if (filePath.endsWith('.js'))   res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
}};
app.use('/src', express.static(path.join(__dirname, '../client/src'), staticOpts));
app.use(express.static(path.join(__dirname, '../client/src/pages'), staticOpts));
app.use(express.static(path.join(__dirname, '../client/public'), staticOpts));
app.use('/assets', express.static(path.join(__dirname, '../client/public/assets'), staticOpts));
app.use('/images', express.static(path.join(__dirname, '../client/public/assets/images'), staticOpts));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/src/pages/index.html'));
});

// Explicit HTML page routes
const pages = ['about','programs','membership','scholarships','news','events','gallery','contact','donate','campaign','leadership'];
pages.forEach(p => {
  app.get(`/${p}`, (req, res) => res.sendFile(path.join(__dirname, `../client/src/pages/${p}.html`)));
  app.get(`/${p}.html`, (req, res) => res.sendFile(path.join(__dirname, `../client/src/pages/${p}.html`)));
});

// Dashboard routes
app.get('/dashboard/admin', (req, res) => res.sendFile(path.join(__dirname, '../client/src/pages/dashboard/admin.html')));
app.get('/dashboard/admin.html', (req, res) => res.sendFile(path.join(__dirname, '../client/src/pages/dashboard/admin.html')));
app.get('/dashboard/member', (req, res) => res.sendFile(path.join(__dirname, '../client/src/pages/dashboard/member.html')));
app.get('/dashboard/member.html', (req, res) => res.sendFile(path.join(__dirname, '../client/src/pages/dashboard/member.html')));
app.get('/dashboard/admin-login', (req, res) => res.sendFile(path.join(__dirname, '../client/src/pages/dashboard/admin-login.html')));
app.get('/dashboard/admin-login.html', (req, res) => res.sendFile(path.join(__dirname, '../client/src/pages/dashboard/admin-login.html')));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

async function migrate() {
  await db.query(`ALTER TABLE members ALTER COLUMN password_hash DROP NOT NULL`).catch(() => {});
  await db.query(`ALTER TABLE members ADD COLUMN IF NOT EXISTS member_id VARCHAR(30) UNIQUE`).catch(() => {});
  await db.query(`ALTER TABLE members ADD COLUMN IF NOT EXISTS membership_type VARCHAR(50) DEFAULT 'Regular Member'`).catch(() => {});
  await db.query(`ALTER TABLE donations ADD COLUMN IF NOT EXISTS screenshot_url VARCHAR(255)`).catch(() => {});
  // Clear old ephemeral disk paths that no longer exist on Railway
  await db.query(`UPDATE donations SET screenshot_url = NULL WHERE screenshot_url LIKE '/uploads/%' OR screenshot_url LIKE '/assets/images/uploads/%'`).catch(() => {});
  await db.query(`ALTER TABLE applications ADD COLUMN IF NOT EXISTS rejection_reason TEXT`).catch(() => {});
  await db.query(`ALTER TABLE applications ALTER COLUMN photo_url TYPE TEXT`).catch(() => {});
  await db.query(`ALTER TABLE members ALTER COLUMN profile_photo TYPE TEXT`).catch(() => {});
  await db.query(`ALTER TABLE programs ALTER COLUMN image_url TYPE TEXT`).catch(() => {});
  await db.query(`ALTER TABLE donations ALTER COLUMN screenshot_url TYPE TEXT`).catch(() => {});
  await db.query(`
    CREATE TABLE IF NOT EXISTS programs (
      id SERIAL PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      icon VARCHAR(10) DEFAULT '📌',
      description TEXT,
      bullets TEXT,
      image_url VARCHAR(255),
      sort_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `).catch(e => console.error('Migration error:', e.message));
  await db.query(`
    CREATE TABLE IF NOT EXISTS applications (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(100) NOT NULL,
      first_name VARCHAR(50),
      last_name VARCHAR(50),
      email VARCHAR(100) NOT NULL,
      phone VARCHAR(20),
      gender VARCHAR(10),
      date_of_birth DATE,
      address TEXT,
      county VARCHAR(100),
      district VARCHAR(100),
      town VARCHAR(100),
      occupation VARCHAR(100),
      education_level VARCHAR(50),
      nationality VARCHAR(50) DEFAULT 'Liberian',
      emergency_contact_name VARCHAR(100),
      emergency_contact_phone VARCHAR(20),
      reason_for_joining TEXT,
      membership_type VARCHAR(50) DEFAULT 'Regular Member',
      photo_url VARCHAR(255),
      status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
      member_id INT REFERENCES members(id) ON DELETE SET NULL,
      reviewed_at TIMESTAMP,
      submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `).catch(e => console.error('Applications table error:', e.message));
}

migrate().then(async () => {
  // Seed super_admin if not exists
  const bcrypt = require('bcryptjs');
  const existing = await db.query("SELECT id FROM members WHERE email = 'admin@guygd.org'").catch(() => ({ rows: [] }));
  if (!existing.rows.length) {
    const hash = await bcrypt.hash('Admin@2025', 10);
    await db.query(
      `INSERT INTO members (full_name, email, password_hash, role, status)
       VALUES ('Super Admin', 'admin@guygd.org', $1, 'super_admin', 'active')`,
      [hash]
    ).catch(e => console.error('Seed error:', e.message));
    console.log('Super admin account created: admin@guygd.org / Admin@2025');
  }
  app.listen(PORT, () => console.log(`GUYGD server running on port ${PORT}`));
});
