const express = require('express');
const { translate } = require('../controllers/nlpController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/translate', protect, translate);

module.exports = router;
