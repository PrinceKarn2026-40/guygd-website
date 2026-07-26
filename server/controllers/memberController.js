const bcrypt = require('bcryptjs');
const db = require('../config/db');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  tls: { rejectUnauthorized: false }
});

async function sendEmail(to, subject, html) {
  try { await transporter.sendMail({ from: `"GUYGD" <${process.env.EMAIL_USER}>`, to, subject, html }); }
  catch (e) { console.error('Email error:', e.message); }
}

exports.getAllMembers = async (req, res) => {
  try {
    const r = await db.query(
      `SELECT id, member_id, full_name, first_name, last_name, email, phone, gender,
              date_of_birth, address, county, district, town, occupation, education_level,
              nationality, profile_photo, membership_type, reason_for_joining,
              role, status, joined_at, updated_at
       FROM members ORDER BY joined_at DESC`
    );
    res.json(r.rows);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.getMember = async (req, res) => {
  try {
    const r = await db.query(
      `SELECT id, member_id, full_name, first_name, last_name, email, phone, gender,
              date_of_birth, address, county, district, town, occupation, education_level,
              nationality, profile_photo, emergency_contact_name, emergency_contact_phone,
              reason_for_joining, role, status, joined_at, updated_at
       FROM members WHERE id=$1`, [req.params.id]
    );
    if (!r.rows.length) return res.status(404).json({ message: 'Member not found' });
    res.json(r.rows[0]);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.updateMember = async (req, res) => {
  const { full_name, first_name, last_name, phone, gender, date_of_birth, address,
          county, district, town, occupation, education_level, status, role } = req.body;
  try {
    if (status) {
      if (!['pending', 'active', 'suspended', 'inactive'].includes(status))
        return res.status(400).json({ message: 'Invalid status' });
      const prev = await db.query('SELECT status, email, full_name FROM members WHERE id=$1', [req.params.id]);
      await db.query('UPDATE members SET status=$1, updated_at=NOW() WHERE id=$2', [status, req.params.id]);
      if (status === 'active' && prev.rows[0]?.status !== 'active') {
        sendEmail(prev.rows[0].email, '✅ Your GUYGD Membership is Active',
          `<p>Dear ${prev.rows[0].full_name}, your GUYGD membership has been activated. Welcome!</p>`);
      }
      if (status === 'suspended') {
        sendEmail(prev.rows[0].email, 'Your GUYGD Membership Has Been Suspended',
          `<p>Dear ${prev.rows[0].full_name}, your GUYGD membership has been suspended. Contact info@guygd.org for more information.</p>`);
      }
    } else if (role) {
      await db.query('UPDATE members SET role=$1, updated_at=NOW() WHERE id=$2', [role, req.params.id]);
    } else {
      await db.query(
        `UPDATE members SET full_name=$1, first_name=$2, last_name=$3, phone=$4, gender=$5,
         date_of_birth=$6, address=$7, county=$8, district=$9, town=$10,
         occupation=$11, education_level=$12, updated_at=NOW() WHERE id=$13`,
        [full_name, first_name||null, last_name||null, phone, gender, date_of_birth||null,
         address, county||null, district||null, town||null, occupation||null, education_level||null,
         req.params.id]
      );
    }
    res.json({ message: 'Member updated' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.updatePassword = async (req, res) => {
  const password = req.body.newPassword || req.body.password;
  if (!password) return res.status(400).json({ message: 'Password required' });
  try {
    const hash = await bcrypt.hash(password, 10);
    await db.query('UPDATE members SET password_hash=$1, updated_at=NOW() WHERE id=$2', [hash, req.user.id]);
    res.json({ message: 'Password updated' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.deleteMember = async (req, res) => {
  try {
    const target = await db.query('SELECT role FROM members WHERE id=$1', [req.params.id]);
    if (!target.rows.length) return res.status(404).json({ message: 'Member not found' });
    const targetRole = target.rows[0].role;
    const requesterRole = req.user.role;
    // Only super_admin can delete super_admin accounts
    if (targetRole === 'super_admin' && requesterRole !== 'super_admin')
      return res.status(403).json({ message: 'Only super_admin can delete another super_admin' });
    await db.query('DELETE FROM members WHERE id=$1', [req.params.id]);
    res.json({ message: 'Member deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.createAdmin = async (req, res) => {
  const { full_name, email, password, role: userRole, phone } = req.body;
  if (!full_name || !email || !password)
    return res.status(400).json({ message: 'Full name, email and password are required' });
  const allowedRoles = ['admin', 'executive', 'super_admin'];
  const assignedRole = allowedRoles.includes(userRole) ? userRole : 'admin';
  try {
    const exists = await db.query('SELECT id FROM members WHERE email=$1', [email]);
    if (exists.rows.length) return res.status(409).json({ message: 'Email already in use' });
    const hash = await bcrypt.hash(password, 10);
    const year = new Date().getFullYear();
    const count = await db.query('SELECT COUNT(*) FROM members');
    const seq = String(parseInt(count.rows[0].count) + 1).padStart(4, '0');
    const member_id = `GUYGD-${year}-${seq}`;
    await db.query(
      `INSERT INTO members (full_name, email, password_hash, phone, role, status, member_id, joined_at)
       VALUES ($1,$2,$3,$4,$5,'active',$6,NOW())`,
      [full_name, email, hash, phone || null, assignedRole, member_id]
    );
    sendEmail(email, '✅ Your GUYGD Admin Account',
      `<p>Dear ${full_name},</p><p>Your GUYGD admin account has been created.</p><p><strong>Email:</strong> ${email}<br/><strong>Password:</strong> ${password}<br/><strong>Role:</strong> ${assignedRole}</p><p>Please log in and change your password.</p>`);
    res.status(201).json({ message: 'Admin user created', member_id });
  } catch (e) { res.status(500).json({ message: e.message }); }
};
