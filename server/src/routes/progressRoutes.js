const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { validateUpdateProgress } = require('../validators/progressValidator');
const auth = require('../middlewares/auth');

router.get('/', auth, progressController.getProgress);
router.patch('/:questionId', auth, validateUpdateProgress, progressController.updateProgress);

module.exports = router;
