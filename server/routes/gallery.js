const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { getAll, upload: uploadImage, remove } = require('../controllers/galleryController');

const storage = multer.diskStorage({
  destination: 'client/public/assets/images/uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.get('/', getAll);
router.post('/', auth, role('admin', 'executive'), upload.single('image'), uploadImage);
router.delete('/:id', auth, role('admin', 'executive'), remove);

module.exports = router;
