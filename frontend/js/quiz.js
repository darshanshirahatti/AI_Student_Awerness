document.addEventListener('DOMContentLoaded', async () => {
    const practiceQuestions = [
        { question: 'Which is an example of artificial intelligence?', options: ['A voice assistant recognizing speech', 'A wooden pencil', 'A paper notebook', 'A standard bicycle'], correctAnswer: 'A voice assistant recognizing speech', explanation: 'Voice assistants use AI to recognize speech and respond to requests.', category: 'AI Basics' },
        { question: 'What does a machine-learning system learn from?', options: ['Examples and data', 'Only electricity', 'A printed instruction manual', 'Random guesses alone'], correctAnswer: 'Examples and data', explanation: 'Machine learning finds patterns in examples and data.', category: 'Machine Learning' },
        { question: 'Which task is commonly supported by computer vision?', options: ['Identifying objects in an image', 'Charging a battery', 'Printing a page', 'Measuring a ruler by hand'], correctAnswer: 'Identifying objects in an image', explanation: 'Computer vision helps computers interpret images and video.', category: 'AI Technologies' },
        { question: 'What is a responsible way to use AI for homework?', options: ['Ask for an explanation, then write in your own words', 'Copy an answer without reading it', 'Submit AI work as your own', 'Avoid checking facts'], correctAnswer: 'Ask for an explanation, then write in your own words', explanation: 'AI can support learning, but submitted work should reflect your own understanding.', category: 'Responsible AI' },
        { question: 'Why should you verify an AI answer?', options: ['AI can produce incorrect information', 'AI answers are always private', 'Verification makes answers shorter', 'AI cannot use language'], correctAnswer: 'AI can produce incorrect information', explanation: 'AI tools can sound confident while being wrong, so verify important claims with trusted sources.', category: 'AI Safety' },
        { question: 'Which information should you never share with an AI chatbot?', options: ['A password or one-time passcode', 'A public science topic', 'A general study question', 'A book title'], correctAnswer: 'A password or one-time passcode', explanation: 'Keep passwords, OTPs, and other private information confidential.', category: 'AI Safety' },
        { question: 'What is natural language processing (NLP)?', options: ['Technology that helps computers work with human language', 'A type of computer screen', 'A way to store batteries', 'A kind of internet cable'], correctAnswer: 'Technology that helps computers work with human language', explanation: 'NLP helps software process or generate human language.', category: 'AI Technologies' },
        { question: 'What is one risk of biased training data?', options: ['AI may make unfair predictions', 'The computer becomes lighter', 'Every answer becomes correct', 'The screen changes color'], correctAnswer: 'AI may make unfair predictions', explanation: 'Patterns in biased data can lead to unfair AI outcomes.', category: 'AI Risks' },
        { question: 'Which statement about generative AI is accurate?', options: ['It can create new text or images from learned patterns', 'It always knows whether a claim is true', 'It only stores photographs', 'It cannot respond to prompts'], correctAnswer: 'It can create new text or images from learned patterns', explanation: 'Generative AI creates content, but its output still needs human review.', category: 'AI Technologies' },
        { question: 'What should you do if an AI interaction makes you uncomfortable?', options: ['Stop and speak with a trusted adult', 'Share more private details', 'Keep it secret', 'Follow every instruction'], correctAnswer: 'Stop and speak with a trusted adult', explanation: 'A teacher, parent, or guardian can help with unsafe online situations.', category: 'AI Safety' }
    ];

    const status = document.getElementById('quizStatus');
    const panel = document.getElementById('quizPanel');
    const resultPanel = document.getElementById('quizResult');
    const selected = new Map();
    let questions = [];
    let currentIndex = 0;
    let practiceMode = false;
    let startedAt = Date.now();
    let secondsLeft = 15 * 60;
    let timer;

    const setStatus = (message) => { status.textContent = message; };

    function renderQuestion() {
        const question = questions[currentIndex];
        document.getElementById('questionCounter').textContent = `Question ${currentIndex + 1} of ${questions.length}`;
        document.getElementById('questionCategory').textContent = question.category || 'AI Awareness';
        document.getElementById('questionText').textContent = question.question;
        document.getElementById('quizProgress').style.width = `${((currentIndex + 1) / questions.length) * 100}%`;
        document.getElementById('previousQuestion').disabled = currentIndex === 0;
        document.getElementById('nextQuestion').hidden = currentIndex === questions.length - 1;
        document.getElementById('finishQuiz').hidden = currentIndex !== questions.length - 1;

        const options = document.getElementById('answerOptions');
        options.replaceChildren();
        question.options.forEach((option, optionIndex) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'answer-option';
            button.setAttribute('aria-pressed', String(selected.get(currentIndex) === option));
            const marker = document.createElement('span');
            marker.className = 'answer-marker';
            marker.textContent = String.fromCharCode(65 + optionIndex);
            const label = document.createElement('span');
            label.textContent = option;
            button.append(marker, label);
            button.addEventListener('click', () => {
                selected.set(currentIndex, option);
                options.querySelectorAll('.answer-option').forEach((item) => item.setAttribute('aria-pressed', 'false'));
                button.setAttribute('aria-pressed', 'true');
                renderNavigation();
                setStatus('Answer selected.');
            });
            options.append(button);
        });
        renderNavigation();
    }

    function renderNavigation() {
        const nav = document.getElementById('questionNav');
        nav.replaceChildren();
        questions.forEach((_, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'question-jump';
            button.textContent = String(index + 1);
            button.setAttribute('aria-label', `Go to question ${index + 1}${selected.has(index) ? ', answered' : ', not answered'}`);
            if (index === currentIndex) button.classList.add('current');
            if (selected.has(index)) button.classList.add('answered');
            button.addEventListener('click', () => {
                currentIndex = index;
                renderQuestion();
                setStatus('');
            });
            nav.append(button);
        });
    }

    function renderResult(score, percentage, review, saved, certificate) {
        window.clearInterval(timer);
        panel.hidden = true;
        status.hidden = true;
        resultPanel.hidden = false;
        const qualified = percentage >= 60;
        document.getElementById('resultTitle').textContent = qualified ? 'Well done, quiz complete!' : 'Quiz complete';
        document.getElementById('resultScore').textContent = `${percentage}%`;
        document.getElementById('resultSummary').textContent = `${score} of ${questions.length} answers correct.`;
        document.getElementById('resultGrade').textContent = qualified ? `Grade ${certificate?.grade || getGrade(percentage)}` : 'Grade: Not Qualified';
        const persistence = document.getElementById('resultPersistence');
        if (!qualified) {
            persistence.textContent = saved
                ? 'You need at least 60% to receive the certificate. Retake the quiz to try again.'
                : 'You need at least 60% to receive the certificate. This practice result was not saved.';
        } else if (certificate) {
            persistence.textContent = saved
                ? `Certificate ${certificate.certificateId} is ready in My Certificates.`
                : 'Practice result only. Sign in to save results or earn a certificate.';
        } else {
            persistence.textContent = saved
                ? 'Your result was saved, but the certificate could not be generated. Contact your teacher or administrator.'
                : 'Practice result only. Sign in to a connected service to save results or earn a certificate.';
        }

        const reviewList = document.getElementById('answerReview');
        reviewList.replaceChildren();
        review.forEach((item, index) => {
            const row = document.createElement('article');
            row.className = `review-item ${item.isCorrect ? 'review-correct' : 'review-incorrect'}`;
            const heading = document.createElement('h3');
            heading.textContent = `${index + 1}. ${item.question}`;
            const result = document.createElement('p');
            result.textContent = `${item.isCorrect ? 'Correct' : 'Review'} · Your answer: ${item.selectedOption}`;
            const answer = document.createElement('p');
            answer.textContent = `Correct answer: ${item.correctAnswer}`;
            const explanation = document.createElement('p');
            explanation.textContent = item.explanation || '';
            row.append(heading, result, answer, explanation);
            reviewList.append(row);
        });
    }

    function getGrade(percentage) {
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B+';
        if (percentage >= 60) return 'B';
        return 'Not Qualified';
    }

    async function finishQuiz() {
        if (selected.size !== questions.length) {
            setStatus(`Answer all questions before finishing. ${questions.length - selected.size} remaining.`);
            return;
        }

        const answers = questions.map((question, index) => ({ questionId: question._id, selectedOption: selected.get(index) }));
        const elapsed = Math.round((Date.now() - startedAt) / 1000);
        const finishButton = document.getElementById('finishQuiz');
        finishButton.disabled = true;
        setStatus('Checking your answers...');

        if (practiceMode) {
            const review = questions.map((question, index) => ({
                question: question.question,
                selectedOption: selected.get(index),
                correctAnswer: question.correctAnswer,
                explanation: question.explanation,
                isCorrect: selected.get(index) === question.correctAnswer
            }));
            const score = review.filter((item) => item.isCorrect).length;
            renderResult(score, Math.round((score / questions.length) * 100), review, false, null);
            finishButton.disabled = false;
            return;
        }

        try {
            const response = await submitQuiz({ answers, timeTaken: elapsed });
            const data = response.data;
            renderResult(data.correctAnswers, Math.round(data.percentage), data.review || [], true, data.certificate);
        } catch (error) {
            setStatus(error.message || 'Unable to save this result. Please try again.');
            finishButton.disabled = false;
        }
    }

    try {
        const language = localStorage.getItem('language') || 'en';
        const response = await getQuiz(language);
        questions = response.data || [];
        if (response.fallback) {
            setStatus('Quiz questions are not yet available in your selected language. Using English questions; your result will still be saved.');
        }
        if (!questions.length) {
            questions = practiceQuestions;
            practiceMode = true;
            setStatus('No saved questions are available. You are using a local practice quiz; results will not be saved.');
        } else {
            status.hidden = true;
        }
    } catch (error) {
        questions = practiceQuestions;
        practiceMode = true;
        setStatus('Quiz service unavailable. You can continue with a local practice quiz; results will not be saved.');
    }

    if (questions.length) {
        panel.hidden = false;
        startedAt = Date.now();
        renderQuestion();
        timer = window.setInterval(() => {
            secondsLeft -= 1;
            const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
            const seconds = (secondsLeft % 60).toString().padStart(2, '0');
            document.getElementById('quizTimer').textContent = `${minutes}:${seconds}`;
            if (secondsLeft <= 0) {
                window.clearInterval(timer);
                setStatus('Time is up. Please answer every question to submit your quiz.');
            }
        }, 1000);
    }

    document.getElementById('previousQuestion').addEventListener('click', () => {
        if (currentIndex > 0) currentIndex -= 1;
        renderQuestion();
    });
    document.getElementById('nextQuestion').addEventListener('click', () => {
        if (currentIndex < questions.length - 1) currentIndex += 1;
        renderQuestion();
    });
    document.getElementById('finishQuiz').addEventListener('click', finishQuiz);
    document.getElementById('retryQuiz').addEventListener('click', () => location.reload());
});
