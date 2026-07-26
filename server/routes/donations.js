const router = require('express').Router();
const multer = require('multer');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { donate, getAll, remove } = require('../controllers/donationController');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/', upload.single('screenshot'), donate);
router.get('/', auth, role('admin', 'executive', 'super_admin'), getAll);
router.delete('/:id', auth, role('admin', 'executive', 'super_admin'), remove);

module.exports = router;
