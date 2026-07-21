const db = require('../config/db');

exports.getPublished = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT n.*, m.full_name AS author FROM news n LEFT JOIN members m ON n.author_id = m.id WHERE n.published = TRUE ORDER BY n.created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  const { title, content, published } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    await db.query(
      'INSERT INTO news (title, content, image_url, author_id, published) VALUES (?,?,?,?,?)',
      [title, content, image_url, req.user.id, published || false]
    );
    res.status(201).json({ message: 'Article created' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  const { title, content, published } = req.body;
  try {
    await db.query(
      'UPDATE news SET title=?, content=?, published=? WHERE id=?',
      [title, content, published, req.params.id]
    );
    res.json({ message: 'Article updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.query('DELETE FROM news WHERE id=?', [req.params.id]);
    res.json({ message: 'Article deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
