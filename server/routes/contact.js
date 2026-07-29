const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { send, getAll } = require('../controllers/contactController');

router.post('/', send);
router.get('/', auth, role('admin', 'executive', 'super_admin'), getAll);

module.exports = router;
