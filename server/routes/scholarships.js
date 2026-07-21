const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { apply, getAll, getOne, updateStatus } = require('../controllers/scholarshipController');

const storage = multer.diskStorage({
  destination: 'client/public/assets/images/uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.post('/', auth, upload.single('supporting_docs'), apply);
router.get('/', auth, role('admin', 'executive'), getAll);
router.get('/:id', auth, getOne);
router.patch('/:id', auth, role('admin', 'executive'), updateStatus);

module.exports = router;
