const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = async (req, res) => {
  const { full_name, email, password, phone, gender, date_of_birth, address } = req.body;
  if (!full_name || !email || !password)
    return res.status(400).json({ message: 'Name, email, and password are required' });
  try {
    const existing = await db.query('SELECT id FROM members WHERE email = $1', [email]);
    if (existing.rows.length) return res.status(409).json({ message: 'Email already registered' });
    const password_hash = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO members (full_name, email, password_hash, phone, gender, date_of_birth, address) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id, full_name, email, role, status',
      [full_name, email, password_hash, phone || null, gender || null, date_of_birth || null, address || null]
    );
    const member = result.rows[0];
    const token = jwt.sign(
      { id: member.id, role: member.role, full_name: member.full_name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    res.status(201).json({ token, user: member });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  try {
    const result = await db.query('SELECT * FROM members WHERE email = $1', [email]);
    const member = result.rows[0];
    if (!member) return res.status(404).json({ message: 'Member not found' });
    if (member.status !== 'active') return res.status(403).json({ message: 'Account not yet approved. Please wait for admin approval.' });
    const valid = await bcrypt.compare(password, member.password_hash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign(
      { id: member.id, role: member.role, full_name: member.full_name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    res.json({ token, user: { id: member.id, full_name: member.full_name, email: member.email, role: member.role, status: member.status } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
