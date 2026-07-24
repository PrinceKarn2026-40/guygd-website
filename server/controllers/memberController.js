const bcrypt = require('bcryptjs');
const db = require('../config/db');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

async function sendApprovalEmail(member) {
  await transporter.sendMail({
    from: `"GUYGD" <${process.env.EMAIL_USER}>`,
    to: member.email,
    subject: 'Your GUYGD Membership Has Been Approved!',
    html: `<p>Dear ${member.full_name},</p>
           <p>Congratulations! Your GUYGD membership application has been <strong>approved</strong>.</p>
           <p>You can now <a href="${process.env.CLIENT_URL}/membership.html?login">log in here</a>.</p>
           <p>Welcome to the family!<br/>— GUYGD Team</p>`
  });
}

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
      const prev = await db.query('SELECT status, email, full_name FROM members WHERE id=$1', [req.params.id]);
      await db.query('UPDATE members SET status=$1 WHERE id=$2', [status, req.params.id]);
      if (status === 'active' && prev.rows[0]?.status !== 'active') {
        sendApprovalEmail(prev.rows[0]).catch(e => console.error('Email error:', e.message));
      }
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
  const password = req.body.newPassword || req.body.password;
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
