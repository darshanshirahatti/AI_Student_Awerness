const mongoose = require('mongoose');

const predictionResultSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    quizScore: { type: Number, required: true, min: 0, max: 100 },
    lessonsCompleted: { type: Number, required: true, min: 0 },
    quizAttempts: { type: Number, required: true, min: 0 },
    safetyScore: { type: Number, required: true, min: 0, max: 100 },
    aiQuestionsAsked: { type: Number, required: true, min: 0 },
    learningMinutes: { type: Number, required: true, min: 0 },
    score: { type: Number, required: true, min: 0, max: 100 },
    level: { type: String, required: true },
    confidence: { type: Number, required: true, min: 0, max: 100 },
    recommendation: { type: String, required: true },
    predictedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('PredictionResult', predictionResultSchema);
