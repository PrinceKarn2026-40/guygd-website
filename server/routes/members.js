const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { getAllMembers, getMember, updateMember, updatePassword, deleteMember, createAdmin } = require('../controllers/memberController');

router.get('/', auth, role('admin', 'executive', 'super_admin'), getAllMembers);
router.post('/create-admin', auth, role('admin', 'super_admin'), createAdmin);
router.put('/password', auth, updatePassword);
router.get('/:id', auth, getMember);
router.put('/:id', auth, role('admin', 'executive', 'super_admin'), updateMember);
router.delete('/:id', auth, role('admin', 'executive', 'super_admin'), deleteMember);

module.exports = router;
