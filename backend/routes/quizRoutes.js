const express = require('express');
const router = express.Router();
const { getQuiz, submitQuiz, getHistory } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getQuiz);
router.post('/submit', protect, submitQuiz);
router.get('/history', protect, getHistory);

module.exports = router;
