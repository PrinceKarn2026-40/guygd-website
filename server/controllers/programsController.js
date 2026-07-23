const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM programs ORDER BY sort_order ASC, id ASC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.create = async (req, res) => {
  const { title, icon, description, bullets } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    await db.query(
      'INSERT INTO programs (title, icon, description, bullets, image_url) VALUES ($1,$2,$3,$4,$5)',
      [title, icon || '📌', description, bullets || null, image_url]
    );
    res.status(201).json({ message: 'Program created' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.update = async (req, res) => {
  const { title, icon, description, bullets } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : req.body.image_url || null;
  try {
    await db.query(
      'UPDATE programs SET title=$1, icon=$2, description=$3, bullets=$4, image_url=$5 WHERE id=$6',
      [title, icon || '📌', description, bullets || null, image_url, req.params.id]
    );
    res.json({ message: 'Program updated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    await db.query('DELETE FROM programs WHERE id=$1', [req.params.id]);
    res.json({ message: 'Program deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
