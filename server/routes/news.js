const router = require('express').Router();
const multer = require('multer');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { getPublished, getAll, create, update, remove } = require('../controllers/newsController');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.get('/', getPublished);
router.get('/all', auth, role('admin', 'executive', 'super_admin'), getAll);
router.post('/', auth, role('admin', 'executive', 'super_admin'), upload.single('image'), create);
router.put('/:id', auth, role('admin', 'executive', 'super_admin'), upload.single('image'), update);
router.delete('/:id', auth, role('admin', 'executive', 'super_admin'), remove);

module.exports = router;
