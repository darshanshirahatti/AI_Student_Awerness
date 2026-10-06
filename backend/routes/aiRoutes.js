const express = require('express');
const router = express.Router();
const { askAI, grammar } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/ask', askAI);
router.post('/grammar', protect, grammar);

module.exports = router;
