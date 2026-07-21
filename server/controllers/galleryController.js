const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM gallery ORDER BY uploaded_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.upload = async (req, res) => {
  const { title, event_id } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;
  if (!image_url) return res.status(400).json({ message: 'Image file required' });
  try {
    await db.query(
      'INSERT INTO gallery (title, image_url, event_id, uploaded_by) VALUES (?,?,?,?)',
      [title, image_url, event_id || null, req.user.id]
    );
    res.status(201).json({ message: 'Image uploaded' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.query('DELETE FROM gallery WHERE id=?', [req.params.id]);
    res.json({ message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
