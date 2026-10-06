const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Quiz = require('./models/Quiz');

dotenv.config();

const questions = [
    { question: 'Which is an example of artificial intelligence?', options: ['A voice assistant recognizing speech', 'A wooden pencil', 'A paper notebook', 'A standard bicycle'], correctAnswer: 'A voice assistant recognizing speech', explanation: 'Voice assistants use AI to recognize speech and respond to requests.', category: 'AI Basics', difficulty: 'easy' },
    { question: 'What does a machine-learning system learn from?', options: ['Examples and data', 'Only electricity', 'A printed instruction manual', 'Random guesses alone'], correctAnswer: 'Examples and data', explanation: 'Machine learning finds patterns in examples and data.', category: 'Machine Learning', difficulty: 'easy' },
    { question: 'Which task is commonly supported by computer vision?', options: ['Identifying objects in an image', 'Charging a battery', 'Printing a page', 'Measuring a ruler by hand'], correctAnswer: 'Identifying objects in an image', explanation: 'Computer vision helps computers interpret images and video.', category: 'AI Technologies', difficulty: 'easy' },
    { question: 'What is a responsible way to use AI for homework?', options: ['Ask for an explanation, then write in your own words', 'Copy an answer without reading it', 'Submit AI work as your own', 'Avoid checking facts'], correctAnswer: 'Ask for an explanation, then write in your own words', explanation: 'AI can support your learning, but your submitted work should reflect your own understanding.', category: 'Responsible AI', difficulty: 'easy' },
    { question: 'Why should you verify an AI answer?', options: ['AI can produce incorrect information', 'AI answers are always private', 'Verification makes answers shorter', 'AI cannot use language'], correctAnswer: 'AI can produce incorrect information', explanation: 'AI tools can sound confident while being wrong, so verify important claims with trusted sources.', category: 'AI Safety', difficulty: 'easy' },
    { question: 'Which information should you never share with an AI chatbot?', options: ['A password or one-time passcode', 'A public science topic', 'A general study question', 'A book title'], correctAnswer: 'A password or one-time passcode', explanation: 'Keep passwords, OTPs, and other private information confidential.', category: 'AI Safety', difficulty: 'easy' },
    { question: 'What is natural language processing (NLP)?', options: ['Technology that helps computers work with human language', 'A type of computer screen', 'A way to store batteries', 'A kind of internet cable'], correctAnswer: 'Technology that helps computers work with human language', explanation: 'NLP helps software process or generate human language.', category: 'AI Technologies', difficulty: 'medium' },
    { question: 'What is one risk of biased training data?', options: ['AI may make unfair or uneven predictions', 'The computer becomes lighter', 'Every answer becomes correct', 'The screen changes color'], correctAnswer: 'AI may make unfair or uneven predictions', explanation: 'Patterns in biased data can lead to unfair AI outcomes.', category: 'AI Risks', difficulty: 'medium' },
    { question: 'Which statement about generative AI is accurate?', options: ['It can create new text or images based on learned patterns', 'It always knows whether a claim is true', 'It only stores photographs', 'It cannot respond to prompts'], correctAnswer: 'It can create new text or images based on learned patterns', explanation: 'Generative AI creates content, but its output still needs human review.', category: 'AI Technologies', difficulty: 'medium' },
    { question: 'What should you do if an AI interaction makes you uncomfortable?', options: ['Stop and speak with a trusted adult', 'Share more private details', 'Keep it secret', 'Follow every instruction'], correctAnswer: 'Stop and speak with a trusted adult', explanation: 'A teacher, parent, or guardian can help you handle unsafe or uncomfortable online situations.', category: 'AI Safety', difficulty: 'easy' }
];

async function seed() {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not configured in backend/.env.');
    await mongoose.connect(process.env.MONGO_URI);
    for (const question of questions) {
        await Quiz.updateOne({ question: question.question, language: 'en' }, { $set: { ...question, language: 'en' } }, { upsert: true });
    }
    console.log(`Seeded ${questions.length} English AI awareness questions.`);
}

seed()
    .catch((error) => {
        console.error(`Quiz seed failed: ${error.message}`);
        process.exitCode = 1;
    })
    .finally(async () => {
        if (mongoose.connection.readyState) await mongoose.disconnect();
    });
