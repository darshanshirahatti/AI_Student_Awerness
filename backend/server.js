const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Route files
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const quizRoutes = require('./routes/quizRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const nlpRoutes = require('./routes/nlpRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const safetyRoutes = require('./routes/safetyRoutes');

// Middleware
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({ origin: '*' })); // Allow all for dev, restrict in prod
app.use(express.json());
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/nlp', nlpRoutes);
app.use('/api/prediction', predictionRoutes);
app.use('/api/safety', safetyRoutes);

// Add placeholders for other routes to prevent 404 on unimplemented features yet
app.get('/api/lessons', (req, res) => res.json({success: true, data: []}));
app.post('/api/contact', (req, res) => res.json({success: true, message: 'Message sent'}));

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        });
    } catch (error) {
        console.error(`Unable to start backend: ${error.message}`);
        process.exitCode = 1;
    }
};

startServer();
