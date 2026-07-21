const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { getPublished, getAll, create, update, remove } = require('../controllers/newsController');

router.get('/', getPublished);
router.get('/all', auth, role('admin', 'executive'), getAll);
router.post('/', auth, role('admin', 'executive'), create);
router.put('/:id', auth, role('admin', 'executive'), update);
router.delete('/:id', auth, role('admin', 'executive'), remove);

module.exports = router;
