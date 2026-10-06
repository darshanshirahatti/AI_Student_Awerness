const express = require('express');
const { getPredictionHistory, predictAwareness } = require('../controllers/predictionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/history', protect, getPredictionHistory);
router.post('/awareness', protect, predictAwareness);

module.exports = router;
