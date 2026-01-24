const express = require('express');
const router = express.Router();
const dailyPlanController = require('../controllers/dailyPlanController');
const { validateGeneratePlan } = require('../validators/dailyPlanValidator');
const auth = require('../middlewares/auth');

router.post('/generate', auth, validateGeneratePlan, dailyPlanController.generate);
router.get('/today', auth, dailyPlanController.getToday);
router.patch('/complete/:questionId', auth, dailyPlanController.completeTask);

module.exports = router;
