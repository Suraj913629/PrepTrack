const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');
const auth = require('../middlewares/auth');

router.get('/progress/pdf', auth, exportController.progressPdf);

module.exports = router;
