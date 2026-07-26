const router = require('express').Router();
const multer = require('multer');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { getAll, create, remove } = require('../controllers/teamController');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.get('/', getAll);
router.post('/', auth, role('admin', 'executive', 'super_admin'), upload.single('photo'), create);
router.delete('/:id', auth, role('admin', 'executive', 'super_admin'), remove);

module.exports = router;
