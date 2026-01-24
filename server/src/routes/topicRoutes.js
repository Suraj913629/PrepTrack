const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');
const { validateCreateTopic, validateUpdateTopic } = require('../validators/topicValidator');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

router.get('/', topicController.getTopics);
router.post('/', auth, admin, validateCreateTopic, topicController.createTopic);
router.patch('/:id', auth, admin, validateUpdateTopic, topicController.updateTopic);
router.delete('/:id', auth, admin, topicController.deleteTopic);

module.exports = router;
