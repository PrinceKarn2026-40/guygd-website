const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { getAll, upload: uploadImage, remove } = require('../controllers/galleryController');

const uploadDir = 'client/public/assets/images/uploads/';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB — accept any size
});

router.get('/', getAll);
router.post('/', auth, role('admin', 'executive', 'super_admin'), upload.single('image'), uploadImage);
router.delete('/:id', auth, role('admin', 'executive', 'super_admin'), remove);

module.exports = router;
