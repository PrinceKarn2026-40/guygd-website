const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { getAll, create, update, remove } = require('../controllers/eventController');

const uploadDir = 'client/public/assets/images/uploads/';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => cb(null, 'event-' + Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.get('/', getAll);
router.post('/', auth, role('admin', 'executive', 'super_admin'), upload.single('image'), create);
router.put('/:id', auth, role('admin', 'executive', 'super_admin'), upload.single('image'), update);
router.delete('/:id', auth, role('admin', 'executive', 'super_admin'), remove);

module.exports = router;
