const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { getAllMembers, getMember, updateMember, updateStatus } = require('../controllers/memberController');

router.get('/', auth, role('admin', 'executive'), getAllMembers);
router.get('/:id', auth, getMember);
router.put('/:id', auth, updateMember);
router.patch('/:id/status', auth, role('admin', 'executive'), updateStatus);

module.exports = router;
