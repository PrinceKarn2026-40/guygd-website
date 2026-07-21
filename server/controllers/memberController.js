const db = require('../config/db');

exports.getAllMembers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, full_name, email, phone, gender, role, status, joined_at FROM members');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMember = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, full_name, email, phone, gender, date_of_birth, address, role, status, joined_at FROM members WHERE id = ?',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Member not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateMember = async (req, res) => {
  const { full_name, phone, gender, date_of_birth, address } = req.body;
  try {
    await db.query(
      'UPDATE members SET full_name=?, phone=?, gender=?, date_of_birth=?, address=? WHERE id=?',
      [full_name, phone, gender, date_of_birth, address, req.params.id]
    );
    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'active', 'suspended'].includes(status))
    return res.status(400).json({ message: 'Invalid status' });
  try {
    await db.query('UPDATE members SET status=? WHERE id=?', [status, req.params.id]);
    res.json({ message: `Member status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
