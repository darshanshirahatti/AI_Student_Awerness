document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('chatForm');
    const input = document.getElementById('chatInput');
    const messages = document.getElementById('chatMessages');
    const sendButton = document.getElementById('sendQuestion');
    const status = document.getElementById('chatStatus');

    const getLocalHelpAnswer = (question) => {
        const text = question.toLowerCase();
        if (/register|sign.?up|create.*account|login|sign.?in|password/.test(text)) {
            return 'To create an account, choose Register and enter your name, email, and password. Then log in to open your student dashboard. Keep your password private.';
        }
        if (/dashboard|progress|certificate/.test(text)) {
            return 'Log in and open Dashboard from the top navigation to see your learning progress, quiz scores, completed lessons, and certificates.';
        }
        if (/quiz|test|score/.test(text)) {
            return 'Open Quiz from the navigation to test what you have learned. Your results are saved to your account when you are logged in.';
        }
        if (/prediction|awareness level/.test(text)) {
            return 'Choose AI Prediction in the navigation to explore your AI awareness level and see what topics you can learn next.';
        }
        if (/language|translate|translation|kannada|hindi|marathi/.test(text)) {
            return 'Open Language AI from the navigation to explore language tools. The site also offers Kannada, Hindi, Marathi, and English interface options.';
        }
        if (/safety|privacy|personal information|unsafe/.test(text)) {
            return 'Visit the AI Safety lesson for tips. Do not share passwords, private details, or sensitive information with an AI tool; ask a trusted adult if something online makes you uncomfortable.';
        }
        if (/lesson|learn|course|ai basics/.test(text)) {
            return 'Choose Start Learning or AI Basics to begin, then use the lessons to explore how AI works, where it is used, and how to use it responsibly.';
        }
        if (/contact|message|email/.test(text)) {
            return 'Open Contact from the top navigation to find the website contact form.';
        }
        return 'I can help you explore AI-Sakshara. Try asking about lessons, the quiz, your dashboard, languages, or staying safe online.';
    };

    const addMessage = (text, type) => {
        const message = document.createElement('li');
        message.className = `chat-message ${type}-message`;

        const label = document.createElement('span');
        label.className = 'message-label';
        label.textContent = type === 'user' ? 'You' : 'Student guide';

        const content = document.createElement('p');
        content.textContent = text;
        message.append(label, content);
        messages.append(message);
        messages.scrollTop = messages.scrollHeight;
        return content;
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const question = input.value.trim();
        if (!question || sendButton.disabled) return;

        addMessage(question, 'user');
        input.value = '';
        input.disabled = true;
        sendButton.disabled = true;
        status.textContent = 'The student guide is thinking...';
        const reply = addMessage('Thinking...', 'assistant');

        try {
            const result = await askAI(question);
            reply.textContent = result.answer || 'I could not find an answer. Try asking about a lesson, quiz, or another page.';
            status.textContent = '';
        } catch (error) {
            reply.textContent = getLocalHelpAnswer(question);
            status.textContent = 'Showing built-in website guidance while the server is unavailable.';
        } finally {
            input.disabled = false;
            sendButton.disabled = false;
            input.focus();
            messages.scrollTop = messages.scrollHeight;
        }
    });
});