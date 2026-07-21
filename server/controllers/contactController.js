const db = require('../config/db');
const nodemailer = require('nodemailer');

exports.send = async (req, res) => {
  const { sender_name, email, subject, message } = req.body;
  try {
    await db.query(
      'INSERT INTO contact_messages (sender_name, email, subject, message) VALUES (?,?,?,?)',
      [sender_name, email, subject, message]
    );
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: `[GUYGD Contact] ${subject}`,
      text: `From: ${sender_name} <${email}>\n\n${message}`,
    });
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM contact_messages ORDER BY received_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
