const db = require('../config/db');

exports.send = async (req, res) => {
  const { sender_name, email, subject, message } = req.body;
  try {
    await db.query(
      'INSERT INTO contact_messages (sender_name, email, subject, message) VALUES ($1,$2,$3,$4)',
      [sender_name, email, subject, message]
    );
    // Send email if configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.EMAIL_PORT || '587'),
          secure: false,
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
          tls: { rejectUnauthorized: false }
        });
        await transporter.sendMail({
          from: `"GUYGD" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_USER,
          replyTo: `${sender_name} <${email}>`,
          subject: `[GUYGD Contact] ${subject}`,
          html: `<p><strong>From:</strong> ${sender_name} &lt;${email}&gt;</p><p><strong>Subject:</strong> ${subject}</p><hr/><p>${message.replace(/\n/g,'<br/>')}</p>`,
        });
      } catch (emailErr) {
        console.error('Email send failed:', emailErr.message);
      }
    }
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM contact_messages ORDER BY received_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
