const bcrypt = require('bcryptjs');
const db = require('../config/db');

exports.getAllMembers = async (req, res) => {
  try {
    const result = await db.query('SELECT id, full_name, email, phone, gender, role, status, joined_at FROM members ORDER BY joined_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMember = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, full_name, email, phone, gender, date_of_birth, address, role, status, joined_at FROM members WHERE id = $1',
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Member not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateMember = async (req, res) => {
  const { full_name, phone, gender, date_of_birth, address, status, role } = req.body;
  try {
    if (status) {
      if (!['pending', 'active', 'suspended'].includes(status))
        return res.status(400).json({ message: 'Invalid status' });
      await db.query('UPDATE members SET status=$1 WHERE id=$2', [status, req.params.id]);
    } else if (role) {
      await db.query('UPDATE members SET role=$1 WHERE id=$2', [role, req.params.id]);
    } else {
      await db.query(
        'UPDATE members SET full_name=$1, phone=$2, gender=$3, date_of_birth=$4, address=$5 WHERE id=$6',
        [full_name, phone, gender, date_of_birth, address, req.params.id]
      );
    }
    res.json({ message: 'Member updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePassword = async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ message: 'Password required' });
  try {
    const password_hash = await bcrypt.hash(password, 10);
    await db.query('UPDATE members SET password_hash=$1 WHERE id=$2', [password_hash, req.user.id]);
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    await db.query('DELETE FROM members WHERE id=$1', [req.params.id]);
    res.json({ message: 'Member deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
