// @desc    Ask AI a question
// @route   POST /api/ai/ask
// @access  Public
exports.askAI = async (req, res, next) => {
    try {
        const { question } = req.body;
        if (typeof question !== 'string' || !question.trim()) {
            return res.status(400).json({ success: false, message: 'Please enter a question.' });
        }

        if (question.length > 1000) {
            return res.status(400).json({ success: false, message: 'Please keep your question under 1,000 characters.' });
        }

        const normalizedQuestion = question.toLowerCase();
        let answer = 'I can help you explore AI-Sakshara. Try asking about lessons, the quiz, your dashboard, languages, or staying safe online.';

        if (/machine learning|\bml\b/.test(normalizedQuestion)) {
            answer = 'Machine learning is a way for computers to learn patterns from examples. For instance, a model can study labeled pictures of cats and dogs, then use patterns it learned to classify a new picture. It can still make mistakes, so its results need checking.';
        } else if (/natural language processing|\bnlp\b/.test(normalizedQuestion)) {
            answer = 'Natural language processing (NLP) helps computers work with human language. It is used for translation, speech recognition, summaries, and chat tools. NLP systems can misunderstand context, so review important outputs.';
        } else if (/computer vision|image recognition/.test(normalizedQuestion)) {
            answer = 'Computer vision helps software find patterns in images or video, such as recognizing objects. It does not see or understand exactly like a person, and it can misidentify things.';
        } else if (/generative ai|generate.*(text|image)|what is ai|artificial intelligence/.test(normalizedQuestion)) {
            answer = 'Artificial intelligence (AI) describes computer systems that perform tasks such as recognizing patterns, understanding language, or making predictions. Generative AI can create new text or images from patterns in training data, but it can also invent incorrect details.';
        } else if (/register|sign.?up|create.*account|login|sign.?in|password/.test(normalizedQuestion)) {
            answer = 'To create an account, choose Register and enter your name, email, and password. Then log in to open your student dashboard. Keep your password private.';
        } else if (/dashboard|progress|certificate/.test(normalizedQuestion)) {
            answer = 'Log in and open Dashboard from the top navigation to see your learning progress, quiz scores, completed lessons, and certificates.';
        } else if (/quiz|test|score/.test(normalizedQuestion)) {
            answer = 'Open Quiz from the navigation to test what you have learned. Your results are saved to your account when you are logged in.';
        } else if (/prediction|awareness level/.test(normalizedQuestion)) {
            answer = 'Choose AI Prediction in the navigation to explore your AI awareness level and see what topics you can learn next.';
        } else if (/language|translate|translation|kannada|hindi|marathi/.test(normalizedQuestion)) {
            answer = 'Open Language AI from the navigation to explore language tools. The site also offers Kannada, Hindi, Marathi, and English interface options.';
        } else if (/safety|privacy|personal information|unsafe/.test(normalizedQuestion)) {
            answer = 'Visit the AI Safety lesson for tips. Do not share passwords, private details, or sensitive information with an AI tool; ask a trusted adult if something online makes you uncomfortable.';
        } else if (/lesson|learn|course|ai basics/.test(normalizedQuestion)) {
            answer = 'Choose Start Learning or AI Basics to begin, then use the lessons to explore how AI works, where it is used, and how to use it responsibly.';
        } else if (/contact|message|email/.test(normalizedQuestion)) {
            answer = 'Open Contact from the top navigation to find the website contact form.';
        }

        res.json({
            success: true,
            answer
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Improve grammar
// @route   POST /api/ai/grammar
// @access  Private
exports.grammar = async (req, res, next) => {
    res.json({ success: true, result: "Corrected text will appear here." });
};
