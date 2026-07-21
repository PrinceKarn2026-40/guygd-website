const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { getAll, create, update, remove } = require('../controllers/eventController');

router.get('/', getAll);
router.post('/', auth, role('admin', 'executive'), create);
router.put('/:id', auth, role('admin', 'executive'), update);
router.delete('/:id', auth, role('admin', 'executive'), remove);

module.exports = router;
