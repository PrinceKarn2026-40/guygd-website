const db = require('../config/db');

exports.getPublished = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT n.*, m.full_name AS author FROM news n LEFT JOIN members m ON n.author_id = m.id WHERE n.published = TRUE ORDER BY n.created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM news ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  const { title, content, summary, category, published } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    await db.query(
      'INSERT INTO news (title, content, summary, category, image_url, author_id, published) VALUES ($1,$2,$3,$4,$5,$6,$7)',
      [title, content, summary || null, category || null, image_url, req.user.id, published || false]
    );
    res.status(201).json({ message: 'Article created' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  const { title, content, summary, category, published } = req.body;
  try {
    await db.query(
      'UPDATE news SET title=$1, content=$2, summary=$3, category=$4, published=$5 WHERE id=$6',
      [title, content, summary, category, published, req.params.id]
    );
    res.json({ message: 'Article updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.query('DELETE FROM news WHERE id=$1', [req.params.id]);
    res.json({ message: 'Article deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
