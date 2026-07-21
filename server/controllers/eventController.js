const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM events ORDER BY event_date ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  const { title, description, location, event_date, category } = req.body;
  try {
    await db.query(
      'INSERT INTO events (title, description, location, event_date, category, created_by) VALUES (?,?,?,?,?,?)',
      [title, description, location, event_date, category, req.user.id]
    );
    res.status(201).json({ message: 'Event created' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  const { title, description, location, event_date, category } = req.body;
  try {
    await db.query(
      'UPDATE events SET title=?, description=?, location=?, event_date=?, category=? WHERE id=?',
      [title, description, location, event_date, category, req.params.id]
    );
    res.json({ message: 'Event updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.query('DELETE FROM events WHERE id=?', [req.params.id]);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
