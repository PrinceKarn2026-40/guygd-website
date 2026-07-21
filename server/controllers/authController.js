const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = async (req, res) => {
  const { full_name, email, password, phone, gender, date_of_birth, address } = req.body;
  if (!full_name || !email || !password)
    return res.status(400).json({ message: 'Name, email, and password are required' });
  try {
    const [existing] = await db.query('SELECT id FROM members WHERE email = ?', [email]);
    if (existing.length) return res.status(409).json({ message: 'Email already registered' });
    const password_hash = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO members (full_name, email, password_hash, phone, gender, date_of_birth, address) VALUES (?,?,?,?,?,?,?)',
      [full_name, email, password_hash, phone, gender, date_of_birth, address]
    );
    res.status(201).json({ message: 'Registration successful. Awaiting approval.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  try {
    const [rows] = await db.query('SELECT * FROM members WHERE email = ?', [email]);
    const member = rows[0];
    if (!member) return res.status(404).json({ message: 'Member not found' });
    if (member.status !== 'active') return res.status(403).json({ message: 'Account not yet approved' });
    const valid = await bcrypt.compare(password, member.password_hash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign(
      { id: member.id, role: member.role, name: member.full_name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    res.json({ token, role: member.role, name: member.full_name });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
