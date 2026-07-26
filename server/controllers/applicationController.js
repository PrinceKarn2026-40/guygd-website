const bcrypt = require('bcryptjs');
const db = require('../config/db');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

/** Generate a readable temporary password like  Gbeh2025#47 */
function generateTempPassword() {
  const words = ['Gbeh','Youth','Unite','Grow','Lead','Serve'];
  const word  = words[Math.floor(Math.random() * words.length)];
  const year  = new Date().getFullYear();
  const num   = Math.floor(10 + Math.random() * 90);
  const sym   = ['#','@','!'][Math.floor(Math.random() * 3)];
  return `${word}${year}${sym}${num}`;
}

function generateMemberId(id) {
  return `GUYGD-${new Date().getFullYear()}-${String(id).padStart(4, '0')}`;
}

async function sendEmail(to, subject, html) {
  try {
    const info = await transporter.sendMail({
      from: `"GUYGD" <${process.env.EMAIL_USER}>`,
      to, subject, html
    });
    console.log(`✅ Email sent to ${to}: ${subject} [${info.messageId}]`);
  } catch (e) {
    console.error('❌ Email send FAILED:', e.message);
    console.error('Email config — HOST:', process.env.EMAIL_HOST, 'PORT:', process.env.EMAIL_PORT, 'USER:', process.env.EMAIL_USER, 'PASS set:', !!process.env.EMAIL_PASS);
  }
}

// ── EMAIL TEMPLATES ────────────────────────────────────────────────────────────

const approvalHtml = (name, memberId, tempPassword, loginUrl) => `
<div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;border-radius:12px;overflow:hidden;border:1px solid #e0e0e0;">
  <div style="background:linear-gradient(135deg,#052e16,#15803d);padding:32px;text-align:center;">
    <h1 style="color:#fff;margin:0 0 4px;font-size:1.6rem;letter-spacing:2px;">GUYGD</h1>
    <p style="color:rgba(255,255,255,0.75);margin:0;font-size:0.82rem;">Gbeh-lay United Youths for Growth and Development</p>
  </div>
  <div style="padding:36px 40px;">
    <h2 style="color:#15803d;margin:0 0 6px;font-size:1.3rem;">🎉 Membership Approved!</h2>
    <p style="color:#6b7280;font-size:0.85rem;margin:0 0 24px;">Welcome to the GUYGD family, <strong>${name}</strong>!</p>
    <p style="color:#374151;line-height:1.7;margin:0 0 24px;">
      Your application has been reviewed and <strong style="color:#15803d;">approved</strong> by the GUYGD administration.
      You are now an official member of Gbeh-lay United Youths for Growth and Development.
    </p>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0 0 6px;color:#166534;font-weight:700;font-size:0.95rem;">🪪 Your Member Details</p>
      <table style="width:100%;font-size:0.88rem;color:#374151;border-collapse:collapse;">
        <tr><td style="padding:5px 0;color:#6b7280;width:40%;">Member ID</td><td style="font-weight:700;color:#15803d;">${memberId}</td></tr>
        <tr><td style="padding:5px 0;color:#6b7280;">Full Name</td><td>${name}</td></tr>
        <tr><td style="padding:5px 0;color:#6b7280;">Temporary Password</td><td style="font-weight:700;font-family:monospace;background:#dcfce7;padding:2px 8px;border-radius:4px;">${tempPassword}</td></tr>
      </table>
    </div>
    <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:16px 20px;margin-bottom:28px;">
      <p style="margin:0;font-size:0.84rem;color:#92400e;">
        ⚠️ <strong>Important:</strong> Please log in and change your password immediately after your first login.
        Do not share this temporary password with anyone.
      </p>
    </div>
    <a href="${loginUrl}" style="display:inline-block;background:linear-gradient(135deg,#16a34a,#052e16);color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:700;font-size:0.95rem;letter-spacing:0.5px;">
      🔐 Login to Your Dashboard
    </a>
    <p style="color:#9ca3af;font-size:0.8rem;margin-top:28px;">
      Need help? Contact us at <a href="mailto:info@guygd.org" style="color:#15803d;">info@guygd.org</a>
    </p>
  </div>
  <div style="background:#f9fafb;padding:16px 40px;border-top:1px solid #e5e7eb;text-align:center;">
    <p style="margin:0;font-size:0.75rem;color:#9ca3af;">© ${new Date().getFullYear()} GUYGD — Gbeh-lay, Liberia · <em>Voice of the Voiceless</em></p>
  </div>
</div>`;

const rejectionHtml = (name, reason) => `
<div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;border-radius:12px;overflow:hidden;border:1px solid #e0e0e0;">
  <div style="background:linear-gradient(135deg,#052e16,#15803d);padding:32px;text-align:center;">
    <h1 style="color:#fff;margin:0 0 4px;font-size:1.6rem;letter-spacing:2px;">GUYGD</h1>
    <p style="color:rgba(255,255,255,0.75);margin:0;font-size:0.82rem;">Gbeh-lay United Youths for Growth and Development</p>
  </div>
  <div style="padding:36px 40px;">
    <h2 style="color:#dc2626;margin:0 0 6px;font-size:1.3rem;">Application Status Update</h2>
    <p style="color:#374151;line-height:1.7;margin:0 0 20px;">
      Dear <strong>${name}</strong>, thank you for your interest in joining GUYGD.
    </p>
    <p style="color:#374151;line-height:1.7;margin:0 0 20px;">
      After careful review of your application, we regret to inform you that we are unable to approve your membership at this time.
    </p>
    ${reason ? `<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:16px 20px;margin-bottom:20px;"><p style="margin:0;color:#991b1b;font-size:0.88rem;"><strong>Reason:</strong> ${reason}</p></div>` : ''}
    <p style="color:#374151;line-height:1.7;margin:0 0 24px;">
      You are welcome to reapply in the future. For questions, please contact us at
      <a href="mailto:info@guygd.org" style="color:#15803d;">info@guygd.org</a>.
    </p>
    <p style="color:#374151;margin-top:24px;">Regards,<br/><strong>GUYGD Administration</strong></p>
  </div>
  <div style="background:#f9fafb;padding:16px 40px;border-top:1px solid #e5e7eb;text-align:center;">
    <p style="margin:0;font-size:0.75rem;color:#9ca3af;">© ${new Date().getFullYear()} GUYGD — Gbeh-lay, Liberia · <em>Voice of the Voiceless</em></p>
  </div>
</div>`;

const adminNotifyHtml = (applicant, email, type, submittedAt) => `
<div style="font-family:Arial,sans-serif;max-width:540px;margin:0 auto;border-radius:10px;overflow:hidden;border:1px solid #e0e0e0;">
  <div style="background:#1a1f36;padding:20px 28px;display:flex;align-items:center;gap:12px;">
    <span style="font-size:1.5rem;">🔔</span>
    <div>
      <h2 style="color:#fff;margin:0;font-size:1rem;">New Membership Application</h2>
      <p style="color:rgba(255,255,255,0.55);margin:0;font-size:0.78rem;">GUYGD Admin Notification</p>
    </div>
  </div>
  <div style="padding:24px 28px;">
    <p style="color:#374151;margin:0 0 16px;line-height:1.6;">
      A new <strong>${type || 'Regular Member'}</strong> application has been submitted and is awaiting your review.
    </p>
    <table style="width:100%;font-size:0.88rem;color:#374151;border-collapse:collapse;background:#f9fafb;border-radius:8px;overflow:hidden;">
      <tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:10px 14px;color:#6b7280;width:35%;">Applicant</td><td style="padding:10px 14px;font-weight:700;">${applicant}</td></tr>
      <tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:10px 14px;color:#6b7280;">Email</td><td style="padding:10px 14px;">${email}</td></tr>
      <tr><td style="padding:10px 14px;color:#6b7280;">Submitted</td><td style="padding:10px 14px;">${new Date(submittedAt).toLocaleString()}</td></tr>
    </table>
    <p style="margin:20px 0 0;font-size:0.85rem;color:#6b7280;">
      Log in to the admin dashboard → Applications to review, approve, or reject this application.
    </p>
  </div>
</div>`;

// ── CONTROLLERS ────────────────────────────────────────────────────────────────

exports.getAll = async (req, res) => {
  try {
    const r = await db.query('SELECT * FROM applications ORDER BY submitted_at DESC');
    res.json(r.rows);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const r = await db.query('SELECT * FROM applications WHERE id=$1', [req.params.id]);
    if (!r.rows.length) return res.status(404).json({ message: 'Not found' });
    res.json(r.rows[0]);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.submit = async (req, res) => {
  const {
    full_name, first_name, last_name, email, phone, gender, date_of_birth,
    address, county, district, town, occupation, education_level, nationality,
    emergency_contact_name, emergency_contact_phone, reason_for_joining, membership_type
  } = req.body;
  const name = full_name || `${first_name || ''} ${last_name || ''}`.trim();
  if (!name || !email) return res.status(400).json({ message: 'Name and email are required' });

  try {
    // Block duplicate pending applications for same email
    const exists = await db.query(
      "SELECT id FROM applications WHERE email=$1 AND status='pending'", [email]
    );
    if (exists.rows.length)
      return res.status(409).json({ message: 'A pending application already exists for this email. Please wait for it to be reviewed.' });

    // Block email already registered as a member
    const memberExists = await db.query(
      "SELECT id FROM members WHERE email=$1", [email]
    );
    if (memberExists.rows.length)
      return res.status(409).json({ message: 'This email is already registered as a GUYGD member.' });

    const photo_url = req.file ? `/uploads/${req.file.filename}` : null;
    const r = await db.query(
      `INSERT INTO applications
        (full_name,first_name,last_name,email,phone,gender,date_of_birth,
         address,county,district,town,occupation,education_level,nationality,
         emergency_contact_name,emergency_contact_phone,reason_for_joining,
         membership_type,photo_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
       RETURNING id, submitted_at`,
      [name, first_name||null, last_name||null, email,
       phone||null, gender||null, date_of_birth||null, address||null,
       county||null, district||null, town||null, occupation||null,
       education_level||null, nationality||'Liberian',
       emergency_contact_name||null, emergency_contact_phone||null,
       reason_for_joining||null, membership_type||'Regular Member', photo_url]
    );

    // Notify all admins/super_admins
    const admins = await db.query(
      "SELECT email FROM members WHERE role IN ('admin','executive','super_admin') AND status='active'"
    );
    const adminEmails = admins.rows.map(a => a.email).filter(Boolean);
    const notifyTargets = adminEmails.length
      ? adminEmails
      : [process.env.ADMIN_EMAIL || process.env.EMAIL_USER || 'admin@guygd.org'];

    notifyTargets.forEach(adminEmail => {
      sendEmail(
        adminEmail,
        `🔔 New Membership Application — ${name}`,
        adminNotifyHtml(name, email, membership_type, r.rows[0].submitted_at)
      );
    });

    res.status(201).json({
      message: 'Application submitted successfully. You will be notified by email once reviewed.',
      application_id: r.rows[0].id
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.approve = async (req, res) => {
  try {
    const appResult = await db.query('SELECT * FROM applications WHERE id=$1', [req.params.id]);
    if (!appResult.rows.length) return res.status(404).json({ message: 'Application not found' });
    const a = appResult.rows[0];
    if (a.status === 'approved') return res.status(400).json({ message: 'This application has already been approved' });

    // Generate and hash a temporary password
    const tempPassword = generateTempPassword();
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    // Check if member already exists (reapplication scenario)
    const existingMember = await db.query('SELECT id FROM members WHERE email=$1', [a.email]);
    let memberId, memberDbId;

    if (existingMember.rows.length) {
      // Reactivate existing member and update password
      memberDbId = existingMember.rows[0].id;
      memberId   = generateMemberId(memberDbId);
      await db.query(
        `UPDATE members SET status='active', role='member',
         password_hash=$1, member_id=$2, updated_at=NOW()
         WHERE id=$3`,
        [passwordHash, memberId, memberDbId]
      );
    } else {
      // Create new member record
      const newMember = await db.query(
        `INSERT INTO members
          (full_name,first_name,last_name,email,phone,gender,date_of_birth,
           address,county,district,town,occupation,education_level,nationality,
           emergency_contact_name,emergency_contact_phone,reason_for_joining,
           profile_photo,password_hash,role,status,joined_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,'member','active',NOW())
         RETURNING id`,
        [a.full_name, a.first_name, a.last_name, a.email, a.phone, a.gender,
         a.date_of_birth, a.address, a.county, a.district, a.town,
         a.occupation, a.education_level, a.nationality,
         a.emergency_contact_name, a.emergency_contact_phone,
         a.reason_for_joining, a.photo_url, passwordHash]
      );
      memberDbId = newMember.rows[0].id;
      memberId   = generateMemberId(memberDbId);
      await db.query('UPDATE members SET member_id=$1 WHERE id=$2', [memberId, memberDbId]);
    }

    // Mark application approved, record approval date, link member
    await db.query(
      'UPDATE applications SET status=$1, reviewed_at=NOW(), member_id=$2 WHERE id=$3',
      ['approved', memberDbId, req.params.id]
    );
    // Ensure joined_at is set on the member record
    await db.query(
      `UPDATE members SET joined_at=COALESCE(joined_at, NOW()) WHERE id=$1`,
      [memberDbId]
    );

    // Send approval email with credentials
    const loginUrl = `${process.env.CLIENT_URL || 'https://guygd-website-production.up.railway.app'}/membership.html?login`;
    sendEmail(
      a.email,
      '✅ Your GUYGD Membership Has Been Approved!',
      approvalHtml(a.full_name, memberId, tempPassword, loginUrl)
    );

    res.json({
      message: 'Application approved successfully',
      member_id:   memberDbId,
      member_code: memberId,
      temp_password: tempPassword   // returned so admin can manually share if needed
    });
  } catch (e) {
    console.error('Approve error:', e);
    res.status(500).json({ message: e.message });
  }
};

exports.reject = async (req, res) => {
  const { reason } = req.body;
  try {
    const appResult = await db.query('SELECT * FROM applications WHERE id=$1', [req.params.id]);
    if (!appResult.rows.length) return res.status(404).json({ message: 'Application not found' });
    const a = appResult.rows[0];
    if (a.status === 'rejected') return res.status(400).json({ message: 'This application is already rejected' });

    await db.query(
      'UPDATE applications SET status=$1, reviewed_at=NOW(), rejection_reason=$2 WHERE id=$3',
      ['rejected', reason || null, req.params.id]
    );

    sendEmail(
      a.email,
      'Update on Your GUYGD Membership Application',
      rejectionHtml(a.full_name, reason)
    );

    res.json({ message: 'Application rejected' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.query('DELETE FROM applications WHERE id=$1', [req.params.id]);
    res.json({ message: 'Application deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};
