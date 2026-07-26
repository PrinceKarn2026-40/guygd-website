const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { donate, getAll } = require('../controllers/donationController');

const uploadDir = 'client/public/assets/images/uploads/';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => cb(null, 'donation-' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/', upload.single('screenshot'), donate);
router.get('/', auth, role('admin', 'executive', 'super_admin'), getAll);

module.exports = router;
