const db = require('../config/db');

exports.donate = async (req, res) => {
  const { donor_name, email, amount, purpose, transaction_ref } = req.body;
  const screenshot_url = req.file
    ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
    : null;
  try {
    await db.query(
      'INSERT INTO donations (donor_name, email, amount, purpose, transaction_ref, screenshot_url) VALUES ($1,$2,$3,$4,$5,$6)',
      [donor_name, email, amount, purpose, transaction_ref, screenshot_url]
    );
    res.status(201).json({ message: 'Donation recorded. Thank you!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.query('DELETE FROM donations WHERE id=$1', [req.params.id]);
    res.json({ message: 'Donation deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

  try {
    const result = await db.query('SELECT * FROM donations ORDER BY donated_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
