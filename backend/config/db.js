const mongoose = require('mongoose');

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is not configured. Add it to backend/.env.');
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        throw new Error(`MongoDB connection failed: ${error.message}. Start MongoDB or update MONGO_URI in backend/.env.`);
    }
};

module.exports = connectDB;
