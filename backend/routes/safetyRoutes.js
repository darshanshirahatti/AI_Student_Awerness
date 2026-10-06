const express = require('express');
const { saveSafetyScore } = require('../controllers/safetyController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/score', protect, saveSafetyScore);

module.exports = router;
