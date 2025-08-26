const router = require('express').Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const adminController = require('../controllers/adminController');

// Protected by ADMIN_SECRET header (x-admin-secret) or query param ?adminSecret=...
router.get('/leaves', adminMiddleware, adminController.listLeaves);
router.put('/leaves/:id/status', adminMiddleware, adminController.updateStatus);

// create employee via admin (will return generated password in response)
router.post('/employee/create', adminMiddleware, adminController.createEmployee);

module.exports = router;
