const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
    explanation: { type: String },
    category: { type: String, default: 'General' },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    language: { type: String, default: 'en' }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
