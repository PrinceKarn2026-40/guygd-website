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
    subject: '✅ Your GUYGD Membership Has Been Approved!',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #e0e0e0;border-radius:10px;overflow:hidden;">
        <div style="background:#1a6b3c;padding:28px 32px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:1.5rem;letter-spacing:1px;">GUYGD</h1>
          <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:0.85rem;">Gbeh-lay United Youths for Growth and Development</p>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#1a6b3c;margin:0 0 16px;">🎉 Membership Approved!</h2>
          <p style="color:#374151;line-height:1.7;">Dear <strong>${member.full_name}</strong>,</p>
          <p style="color:#374151;line-height:1.7;">We are pleased to inform you that your GUYGD membership application has been <strong style="color:#1a6b3c;">approved</strong>. Welcome to the family!</p>
          <p style="color:#374151;line-height:1.7;">You are now an official member of <strong>Gbeh-lay United Youths for Growth and Development</strong>. Together, we will work toward education, leadership, and sustainable community development in Gbeh-lay.</p>
          <div style="background:#f0fdf4;border-left:4px solid #1a6b3c;padding:14px 18px;border-radius:6px;margin:24px 0;">
            <p style="margin:0;color:#166534;font-weight:600;">📌 Motto: Voice of the Voiceless</p>
          </div>
          <p style="color:#374151;line-height:1.7;">If you have any questions, feel free to contact us at <a href="mailto:info@guygd.org" style="color:#1a6b3c;">info@guygd.org</a>.</p>
          <p style="color:#374151;margin-top:24px;">Warm regards,<br/><strong>GUYGD Administration</strong></p>
        </div>
        <div style="background:#f9fafb;padding:16px 32px;text-align:center;border-top:1px solid #e0e0e0;">
          <p style="margin:0;font-size:0.78rem;color:#9ca3af;">© ${new Date().getFullYear()} GUYGD — Gbeh-lay, Liberia</p>
        </div>
      </div>`
  });
}

async function sendRejectionEmail(member) {
  await transporter.sendMail({
    from: `"GUYGD" <${process.env.EMAIL_USER}>`,
    to: member.email,
    subject: 'Update on Your GUYGD Membership Application',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #e0e0e0;border-radius:10px;overflow:hidden;">
        <div style="background:#1a6b3c;padding:28px 32px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:1.5rem;letter-spacing:1px;">GUYGD</h1>
          <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:0.85rem;">Gbeh-lay United Youths for Growth and Development</p>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#dc2626;margin:0 0 16px;">Application Status Update</h2>
          <p style="color:#374151;line-height:1.7;">Dear <strong>${member.full_name}</strong>,</p>
          <p style="color:#374151;line-height:1.7;">Thank you for your interest in joining GUYGD. After careful review, we regret to inform you that your membership application has not been approved at this time.</p>
          <p style="color:#374151;line-height:1.7;">You are welcome to reapply in the future. If you believe this decision was made in error or would like more information, please contact us.</p>
          <p style="color:#374151;line-height:1.7;">Contact us at <a href="mailto:info@guygd.org" style="color:#1a6b3c;">info@guygd.org</a>.</p>
          <p style="color:#374151;margin-top:24px;">Regards,<br/><strong>GUYGD Administration</strong></p>
        </div>
        <div style="background:#f9fafb;padding:16px 32px;text-align:center;border-top:1px solid #e0e0e0;">
          <p style="margin:0;font-size:0.78rem;color:#9ca3af;">© ${new Date().getFullYear()} GUYGD — Gbeh-lay, Liberia</p>
        </div>
      </div>`
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
      if (status === 'suspended' && prev.rows[0]?.status !== 'suspended') {
        sendRejectionEmail(prev.rows[0]).catch(e => console.error('Email error:', e.message));
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
