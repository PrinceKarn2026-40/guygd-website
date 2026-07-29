const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { send, getAll } = require('../controllers/contactController');

router.post('/', send);
router.get('/', auth, role('admin', 'executive', 'super_admin'), getAll);
router.delete('/:id', auth, role('admin', 'executive', 'super_admin'), async (req, res) => {
  const db = require('../config/db');
  try {
    await db.query('DELETE FROM contact_messages WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
