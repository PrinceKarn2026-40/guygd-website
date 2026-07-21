const db = require('../config/db');

exports.donate = async (req, res) => {
  const { donor_name, email, amount, purpose, transaction_ref } = req.body;
  try {
    await db.query(
      'INSERT INTO donations (donor_name, email, amount, purpose, transaction_ref) VALUES ($1,$2,$3,$4,$5)',
      [donor_name, email, amount, purpose, transaction_ref]
    );
    res.status(201).json({ message: 'Donation recorded. Thank you!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM donations ORDER BY donated_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
