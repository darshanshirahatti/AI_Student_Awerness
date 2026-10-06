const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    certificateId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quizResultId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuizResult', required: true },
    studentName: { type: String, required: true },
    score: { type: Number, required: true },
    percentage: { type: Number, required: true },
    grade: { type: String, required: true },
    issuedBy: { type: String, default: 'AI-Sakshara' },
    verificationUrl: { type: String, required: true },
    issuedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Certificate', certificateSchema);
