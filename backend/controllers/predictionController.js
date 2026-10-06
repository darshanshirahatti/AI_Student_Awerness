const PredictionResult = require('../models/PredictionResult');

const recommendations = {
    BEGINNER: 'Start with AI Basics and AI Safety, then try the quiz again.',
    INTERMEDIATE: 'Continue with AI Technologies, NLP, and responsible AI practice.',
    ADVANCED: 'Explore generative AI, computer vision, and AI ethics in more depth.',
    'AI-AWARE': 'Challenge yourself with AI projects and research, and keep verifying claims.'
};

exports.predictAwareness = async (req, res, next) => {
    try {
        const fields = ['quizScore', 'lessonsCompleted', 'quizAttempts', 'safetyScore', 'aiQuestionsAsked', 'learningMinutes'];
        const metrics = {};
        for (const field of fields) {
            const value = Number(req.body[field]);
            if (!Number.isFinite(value) || value < 0) {
                return res.status(400).json({ success: false, message: 'Enter valid non-negative values for every learning indicator.' });
            }
            metrics[field] = value;
        }
        if (metrics.quizScore > 100 || metrics.safetyScore > 100 || metrics.lessonsCompleted > 6) {
            return res.status(400).json({ success: false, message: 'Quiz and safety scores must be at most 100, and lessons completed at most 6.' });
        }

        const score = Math.min(100, Math.round(
            metrics.quizScore * 0.35 + metrics.safetyScore * 0.25 + (metrics.lessonsCompleted / 6) * 20 +
            Math.min(metrics.aiQuestionsAsked / 10, 1) * 10 + Math.min(metrics.learningMinutes / 120, 1) * 10
        ));
        const level = score >= 85 ? 'AI-AWARE' : score >= 65 ? 'ADVANCED' : score >= 40 ? 'INTERMEDIATE' : 'BEGINNER';
        const signals = [metrics.quizScore > 0, metrics.lessonsCompleted > 0, metrics.quizAttempts > 0, metrics.safetyScore > 0, metrics.aiQuestionsAsked > 0, metrics.learningMinutes > 0].filter(Boolean).length;
        const confidence = Math.round((signals / fields.length) * 100);
        const result = await PredictionResult.create({
            userId: req.user._id,
            ...metrics,
            score,
            level,
            confidence,
            recommendation: recommendations[level]
        });

        return res.json({
            success: true,
            data: {
                id: result._id,
                score,
                level,
                confidence,
                recommendation: result.recommendation,
                predictedAt: result.predictedAt
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getPredictionHistory = async (req, res, next) => {
    try {
        const history = await PredictionResult.find({ userId: req.user._id })
            .sort({ predictedAt: -1 })
            .limit(50)
            .select('score level confidence recommendation predictedAt')
            .lean();
        res.json({ success: true, data: history });
    } catch (error) {
        next(error);
    }
};
