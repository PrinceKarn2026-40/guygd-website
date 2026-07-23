const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { apply, getAll, getMine, getOne, updateStatus } = require('../controllers/scholarshipController');

const storage = multer.diskStorage({
  destination: 'client/public/assets/images/uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.post('/apply', auth, upload.single('document'), apply);
router.get('/my', auth, getMine);
router.get('/', auth, role('admin', 'executive', 'super_admin'), getAll);
router.get('/:id', auth, getOne);
router.put('/:id', auth, role('admin', 'executive', 'super_admin'), updateStatus);

module.exports = router;
