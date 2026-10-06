const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true },
    percentage: { type: Number, required: true },
    totalQuestions: { type: Number, required: true, default: 0 },
    correctAnswers: { type: Number, required: true },
    wrongAnswers: { type: Number, required: true },
    timeTaken: { type: Number },
    completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuizResult', quizResultSchema);
