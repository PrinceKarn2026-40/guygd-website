const router = require('express').Router();
const multer = require('multer');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { getAll, upload: uploadImage, remove } = require('../controllers/galleryController');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

router.get('/', getAll);
router.post('/', auth, role('admin', 'executive', 'super_admin'), upload.single('image'), uploadImage);
router.delete('/:id', auth, role('admin', 'executive', 'super_admin'), remove);

module.exports = router;
