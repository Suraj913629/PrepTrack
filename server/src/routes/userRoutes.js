const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

router.get('/', auth, admin, userController.getAllUsers);

module.exports = router;
