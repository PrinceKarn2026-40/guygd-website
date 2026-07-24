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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

async function migrate() {
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
}

migrate().then(() => {
  app.listen(PORT, () => console.log(`GUYGD server running on port ${PORT}`));
});
