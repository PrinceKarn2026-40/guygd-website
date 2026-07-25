const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/applicationController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../client/public/assets/images/uploads')),
  filename: (req, file, cb) => cb(null, `app-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/', upload.single('photo'), ctrl.submit);
router.get('/', auth, role('admin', 'executive', 'super_admin'), ctrl.getAll);
router.get('/:id', auth, role('admin', 'executive', 'super_admin'), ctrl.getOne);
router.post('/:id/approve', auth, role('admin', 'executive', 'super_admin'), ctrl.approve);
router.post('/:id/reject', auth, role('admin', 'executive', 'super_admin'), ctrl.reject);
router.delete('/:id', auth, role('admin', 'executive', 'super_admin'), ctrl.remove);

module.exports = router;
