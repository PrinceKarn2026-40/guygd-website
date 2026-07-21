const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { getAllMembers, getMember, updateMember, updatePassword, deleteMember } = require('../controllers/memberController');

router.get('/', auth, role('admin', 'executive'), getAllMembers);
router.get('/:id', auth, getMember);
router.put('/password', auth, updatePassword);
router.put('/:id', auth, role('admin', 'executive'), updateMember);
router.delete('/:id', auth, role('admin', 'executive'), deleteMember);

module.exports = router;
