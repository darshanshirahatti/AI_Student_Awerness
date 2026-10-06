const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const User = require('../models/User');
const Certificate = require('../models/Certificate');
const crypto = require('crypto');

// @desc    Get quiz questions based on language
// @route   GET /api/quiz
// @access  Public (or Private depending on your rules)
exports.getQuiz = async (req, res, next) => {
    try {
        const lang = req.query.language || 'en';
        // For security, don't send the correctAnswer to the frontend
        let quizzes = await Quiz.find({ language: lang }).select('-correctAnswer -explanation');
        let questionLanguage = lang;
        if (!quizzes.length && lang !== 'en') {
            quizzes = await Quiz.find({ language: 'en' }).select('-correctAnswer -explanation');
            questionLanguage = 'en';
        }
        res.json({ success: true, data: quizzes, language: questionLanguage, fallback: questionLanguage !== lang });
    } catch (error) {
        next(error);
    }
};

// @desc    Submit quiz answers and calculate score
// @route   POST /api/quiz/submit
// @access  Private
exports.submitQuiz = async (req, res, next) => {
    try {
        const { answers, timeTaken } = req.body;
        if (!Array.isArray(answers) || answers.length === 0 || answers.length > 50) {
            return res.status(400).json({ success: false, message: 'Submit between 1 and 50 quiz answers.' });
        }
        if (answers.some((answer) => !answer.questionId || !Quiz.db.base.Types.ObjectId.isValid(answer.questionId) || typeof answer.selectedOption !== 'string')) {
            return res.status(400).json({ success: false, message: 'One or more quiz answers are invalid.' });
        }

        const quizItems = await Promise.all(answers.map((answer) => Quiz.findById(answer.questionId).lean()));
        if (quizItems.some((quiz) => !quiz)) {
            return res.status(400).json({ success: false, message: 'One or more quiz questions are no longer available.' });
        }

        const review = quizItems.map((quiz, index) => ({
            question: quiz.question,
            selectedOption: answers[index].selectedOption,
            correctAnswer: quiz.correctAnswer,
            explanation: quiz.explanation || '',
            isCorrect: quiz.correctAnswer === answers[index].selectedOption
        }));
        const correctCount = review.filter((answer) => answer.isCorrect).length;
        const wrongCount = answers.length - correctCount;
        const totalQuestions = answers.length;
        const score = correctCount;
        const percentage = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

        const result = await QuizResult.create({
            userId: req.user._id,
            score,
            percentage,
            totalQuestions,
            correctAnswers: correctCount,
            wrongAnswers: wrongCount,
            timeTaken: Number.isFinite(Number(timeTaken)) ? Math.max(0, Number(timeTaken)) : undefined
        });

        await User.findByIdAndUpdate(req.user._id, {
            $inc: { quizAttempts: 1, totalPoints: score }
        });

        let certificate = null;
        if (percentage >= 60) {
            let certificateId;
            do {
                certificateId = `AI-SAK-${new Date().getFullYear()}-${crypto.randomInt(100000, 1000000)}`;
            } while (await Certificate.exists({ certificateId }));
            const verificationUrl = `${(process.env.API_PUBLIC_URL || 'http://localhost:5000').replace(/\/$/, '')}/api/certificates/verify/${certificateId}`;
            certificate = await Certificate.create({
                certificateId,
                userId: req.user._id,
                quizResultId: result._id,
                studentName: req.user.name,
                score: Math.round(percentage),
                percentage: Math.round(percentage),
                grade: percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B+' : 'B',
                issuedBy: 'AI-Sakshara',
                verificationUrl
            });
        }
        
        res.json({
            success: true,
            data: {
                totalQuestions,
                correctAnswers: correctCount,
                wrongAnswers: wrongCount,
                review,
                score,
                percentage,
                certificate: certificate ? {
                    certificateId: certificate.certificateId,
                    studentName: certificate.studentName,
                    score: certificate.score,
                    percentage: certificate.percentage,
                    grade: certificate.grade,
                    date: certificate.issuedAt,
                    issuedBy: certificate.issuedBy,
                    verificationUrl: certificate.verificationUrl
                } : null
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's quiz history
// @route   GET /api/quiz/history
// @access  Private
exports.getHistory = async (req, res, next) => {
    try {
        const history = await QuizResult.find({ userId: req.user._id }).sort({ completedAt: -1 });
        res.json({ success: true, data: history });
    } catch (error) {
        next(error);
    }
};
