require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

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

app.use(express.static(path.join(__dirname, '../client/src/pages')));
app.use(express.static(path.join(__dirname, '../client/src')));
app.use(express.static(path.join(__dirname, '../client')));
app.use(express.static(path.join(__dirname, '../client/public')));
app.use('/assets', express.static(path.join(__dirname, '../client/public/assets')));
app.use('/images', express.static(path.join(__dirname, '../client/public/assets/images')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/src/pages/index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`GUYGD server running on port ${PORT}`));
