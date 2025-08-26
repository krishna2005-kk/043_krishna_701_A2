const router = require('express').Router();
const employeeController = require('../controllers/employeeController');
const { ensureLoggedIn } = require('../middleware/authMiddleware');
const methodOverride = require('method-override');

router.use(ensureLoggedIn);
router.use(methodOverride('_method'));

router.get('/employees', employeeController.list);
router.get('/employees/new', employeeController.renderAdd);
router.post('/employees', employeeController.create);
router.get('/employees/:id/edit', employeeController.renderEdit);
router.put('/employees/:id', employeeController.update);
router.delete('/employees/:id', employeeController.remove);

module.exports = router;
