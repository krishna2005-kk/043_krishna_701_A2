const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const employeeController = require('../controllers/employeeController');

router.get('/profile', auth, employeeController.profile);

module.exports = router;
