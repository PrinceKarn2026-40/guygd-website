const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = async (req, res) => {
  const {
    first_name, last_name, full_name, email, password, phone, gender,
    date_of_birth, address, county, district, town, occupation,
    education_level, nationality, emergency_contact_name,
    emergency_contact_phone, reason_for_joining
  } = req.body;
  const name = full_name || `${first_name || ''} ${last_name || ''}`.trim();
  if (!name || !email)
    return res.status(400).json({ message: 'Name and email are required' });
  try {
    const existing = await db.query('SELECT id FROM members WHERE email = $1', [email]);
    if (existing.rows.length) return res.status(409).json({ message: 'Email already registered' });
    const result = await db.query(
      `INSERT INTO members (
        first_name, last_name, full_name, email, phone, gender,
        date_of_birth, address, county, district, town, occupation,
        education_level, nationality, emergency_contact_name,
        emergency_contact_phone, reason_for_joining
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
      RETURNING id, full_name, email, role, status`,
      [
        first_name || null, last_name || null, name, email,
        phone || null, gender || null, date_of_birth || null, address || null,
        county || null, district || null, town || null, occupation || null,
        education_level || null, nationality || 'Liberian',
        emergency_contact_name || null, emergency_contact_phone || null,
        reason_for_joining || null
      ]
    );
    res.status(201).json({ pending: true, message: 'Application submitted! You will receive an email once approved.' });
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
    const isAdmin = ['admin','executive','super_admin'].includes(member.role);
    if (!isAdmin && member.status !== 'active') return res.status(403).json({ message: 'Account not yet approved. Please wait for admin approval.' });
    const valid = await bcrypt.compare(password, member.password_hash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    await db.query('UPDATE members SET last_login = NOW(), updated_at = NOW() WHERE id = $1', [member.id]);
    const token = jwt.sign(
      { id: member.id, role: member.role, full_name: member.full_name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    res.json({ token, user: { id: member.id, full_name: member.full_name, email: member.email, role: member.role, status: member.status, last_login: member.last_login } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
