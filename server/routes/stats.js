const router = require('express').Router();
const db = require('../config/db');

// Public endpoint — no auth required
router.get('/', async (req, res) => {
  try {
    const [members, events, communities] = await Promise.all([
      db.query("SELECT COUNT(*) FROM members WHERE status = 'active'"),
      db.query('SELECT COUNT(*) FROM events'),
      db.query('SELECT COUNT(*) FROM programs'),
    ]);
    res.json({
      members:     parseInt(members.rows[0].count),
      events:      parseInt(events.rows[0].count),
      communities: parseInt(communities.rows[0].count),
    });
  } catch (e) {
    res.status(500).json({ members: 0, events: 0, communities: 0 });
  }
});

module.exports = router;
