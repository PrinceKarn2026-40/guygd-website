const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM events ORDER BY event_date ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  const { title, description, location, event_date, category } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : (req.body.image_url || null);
  try {
    await db.query(
      'INSERT INTO events (title, description, location, event_date, category, image_url, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7)',
      [title, description, location, event_date, category, image_url, req.user.id]
    );
    res.status(201).json({ message: 'Event created' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  const { title, description, location, event_date, category } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : (req.body.image_url || null);
  try {
    await db.query(
      'UPDATE events SET title=$1, description=$2, location=$3, event_date=$4, category=$5, image_url=$6 WHERE id=$7',
      [title, description, location, event_date, category, image_url, req.params.id]
    );
    res.json({ message: 'Event updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.query('DELETE FROM events WHERE id=$1', [req.params.id]);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
