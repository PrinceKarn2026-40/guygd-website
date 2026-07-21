const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { getPublished, create, update, remove } = require('../controllers/newsController');

const storage = multer.diskStorage({
  destination: 'client/public/assets/images/uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.get('/', getPublished);
router.post('/', auth, role('admin', 'executive'), upload.single('image'), create);
router.put('/:id', auth, role('admin', 'executive'), update);
router.delete('/:id', auth, role('admin', 'executive'), remove);

module.exports = router;
