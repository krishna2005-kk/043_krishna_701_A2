const router = require('express').Router();
const adminController = require('../controllers/adminController');
const { ensureLoggedIn } = require('../middleware/authMiddleware');

router.get('/login', adminController.renderLogin);
router.post('/login', adminController.login);
router.get('/logout', adminController.logout);

router.get('/dashboard', ensureLoggedIn, adminController.dashboard);

module.exports = router;
