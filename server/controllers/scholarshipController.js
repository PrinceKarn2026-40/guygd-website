const db = require('../config/db');

exports.apply = async (req, res) => {
  const { applicant_name, school, level, essay } = req.body;
  const supporting_docs = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    await db.query(
      'INSERT INTO scholarships (member_id, applicant_name, school, level, essay, supporting_docs) VALUES ($1,$2,$3,$4,$5,$6)',
      [req.user.id, applicant_name, school, level, essay, supporting_docs]
    );
    res.status(201).json({ message: 'Scholarship application submitted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM scholarships ORDER BY applied_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMine = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM scholarships WHERE member_id=$1 ORDER BY applied_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM scholarships WHERE id=$1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Application not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  if (!['submitted', 'under_review', 'approved', 'rejected'].includes(status))
    return res.status(400).json({ message: 'Invalid status' });
  try {
    await db.query('UPDATE scholarships SET status=$1 WHERE id=$2', [status, req.params.id]);
    res.json({ message: `Application status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
