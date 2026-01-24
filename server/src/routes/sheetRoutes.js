const express = require('express');
const router = express.Router();
const sheetController = require('../controllers/sheetController');
const { validateCreateSheet, validateUpdateSheet } = require('../validators/sheetValidator');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

router.get('/', sheetController.getSheets);
router.post('/', auth, admin, validateCreateSheet, sheetController.createSheet);
router.patch('/:id', auth, admin, validateUpdateSheet, sheetController.updateSheet);
router.delete('/:id', auth, admin, sheetController.deleteSheet);

module.exports = router;
