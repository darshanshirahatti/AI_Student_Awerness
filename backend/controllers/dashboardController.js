const QuizResult = require('../models/QuizResult');
const Certificate = require('../models/Certificate');
const PredictionResult = require('../models/PredictionResult');

// @desc    Get user dashboard stats
// @route   GET /api/dashboard
// @access  Private
exports.getDashboard = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const [quizResults, certificateCount, latestPrediction] = await Promise.all([
            QuizResult.find({ userId }).sort({ completedAt: -1 }).limit(20).lean(),
            Certificate.countDocuments({ userId }),
            PredictionResult.findOne({ userId }).sort({ predictedAt: -1 }).lean()
        ]);

        const percentages = quizResults.map((result) => result.percentage);
        const averageScore = percentages.length
            ? Math.round(percentages.reduce((total, score) => total + score, 0) / percentages.length)
            : null;
        const bestScore = percentages.length ? Math.max(...percentages) : null;
        const lessonsCompleted = req.user.completedLessons?.length || 0;
        const totalLessons = 6;
        const calculatedScore = averageScore === null
            ? null
            : Math.round(averageScore * 0.7 + Math.min(lessonsCompleted / totalLessons, 1) * 30);
        const awarenessScore = latestPrediction?.score ?? calculatedScore;
        const awarenessLevel = latestPrediction?.level || (awarenessScore === null
            ? 'NOT STARTED'
            : awarenessScore >= 80 ? 'ADVANCED' : awarenessScore >= 50 ? 'INTERMEDIATE' : 'BEGINNER');

        res.json({
            success: true,
            data: {
                user: {
                    name: req.user.name,
                    email: req.user.email,
                    className: req.user.className,
                    schoolName: req.user.schoolName
                },
                lessonsCompleted,
                totalLessons,
                quizAttempts: req.user.quizAttempts || 0,
                averageScore,
                bestScore,
                safetyScore: req.user.safetyScore ?? null,
                certificates: certificateCount,
                awarenessScore,
                awarenessLevel,
                recentActivity: quizResults.slice(0, 5).map((result) => ({
                    type: 'quiz',
                    score: result.percentage,
                    date: result.completedAt
                }))
            }
        });
    } catch (error) {
        next(error);
    }
};
