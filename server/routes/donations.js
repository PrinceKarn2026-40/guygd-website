const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { donate, getAll } = require('../controllers/donationController');

router.post('/', donate);
router.get('/', auth, role('admin', 'executive'), getAll);

module.exports = router;
