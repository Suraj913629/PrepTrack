const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const { validateCreateQuestion, validateUpdateQuestion } = require('../validators/questionValidator');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

router.get('/', questionController.getQuestions);
router.post('/', auth, admin, validateCreateQuestion, questionController.createQuestion);
router.post('/bulk', auth, admin, questionController.createBulk);
router.patch('/:id', auth, admin, validateUpdateQuestion, questionController.updateQuestion);
router.delete('/:id', auth, admin, questionController.deleteQuestion);

module.exports = router;
