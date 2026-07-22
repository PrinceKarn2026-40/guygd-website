const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM team ORDER BY sort_order ASC, created_at ASC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.create = async (req, res) => {
  const { name, position, bio, sort_order } = req.body;
  const photo = req.file ? `/uploads/${req.file.filename}` : null;
  if (!name || !position) return res.status(400).json({ message: 'Name and position required' });
  try {
    await db.query(
      'INSERT INTO team (name, position, bio, photo, sort_order) VALUES ($1,$2,$3,$4,$5)',
      [name, position, bio || null, photo, sort_order || 0]
    );
    res.status(201).json({ message: 'Team member added' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    await db.query('DELETE FROM team WHERE id=$1', [req.params.id]);
    res.json({ message: 'Team member removed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
