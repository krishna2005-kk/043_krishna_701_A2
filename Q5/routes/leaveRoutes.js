const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const leaveController = require('../controllers/leaveController');

router.post('/apply', auth, leaveController.apply);
router.get('/my', auth, leaveController.listForEmployee);
router.put('/:id/status', leaveController.updateStatus);

module.exports = router;
