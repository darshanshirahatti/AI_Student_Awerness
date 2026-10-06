document.addEventListener('DOMContentLoaded', () => {
    const scenarios = [
        { prompt: 'A student enters their one-time passcode into an AI chatbot to "verify their school account."', safe: false, explanation: 'Unsafe. Never share OTPs, passwords, or account codes with a chatbot. Stop and tell a trusted adult.' },
        { prompt: 'You ask an AI tool to explain a science topic, then check the explanation against your textbook.', safe: true, explanation: 'A thoughtful approach. Use AI to support learning and verify important facts with trusted sources.' },
        { prompt: 'You paste a class list with students’ full names and contact details into a public chatbot.', safe: false, explanation: 'Unsafe. Do not share other people’s personal information with an AI tool.' },
        { prompt: 'An AI-generated image of your teacher looks real, and you want to post it as a prank.', safe: false, explanation: 'Unsafe. Realistic fake images can mislead and harm people. Do not share them as real.' },
        { prompt: 'You use an AI tool to translate a short sentence that contains no private information.', safe: true, explanation: 'Generally safe. Keep personal, sensitive, and identifying information out of translation tools.' }
    ];
    const scenarioPanel = document.getElementById('scenarioPanel');
    const resultPanel = document.getElementById('safetyResult');
    const safeButton = document.getElementById('safeChoice');
    const unsafeButton = document.getElementById('unsafeChoice');
    const nextButton = document.getElementById('nextScenario');
    let index = 0;
    let score = 0;

    const render = () => {
        document.getElementById('scenarioCount').textContent = `Scenario ${index + 1} of ${scenarios.length}`;
        document.getElementById('scenarioTitle').textContent = scenarios[index].prompt;
        document.getElementById('scenarioFeedback').textContent = '';
        safeButton.disabled = false;
        unsafeButton.disabled = false;
        nextButton.hidden = true;
    };

    const answer = (choice) => {
        const scenario = scenarios[index];
        safeButton.disabled = true;
        unsafeButton.disabled = true;
        const correct = choice === scenario.safe;
        if (correct) score += 1;
        document.getElementById('scenarioFeedback').textContent = `${correct ? 'Correct.' : 'Not quite.'} ${scenario.explanation}`;
        nextButton.textContent = index === scenarios.length - 1 ? 'See my result' : 'Next scenario';
        nextButton.hidden = false;
    };

    safeButton.addEventListener('click', () => answer(true));
    unsafeButton.addEventListener('click', () => answer(false));
    nextButton.addEventListener('click', async () => {
        index += 1;
        if (index < scenarios.length) {
            render();
            return;
        }
        scenarioPanel.hidden = true;
        resultPanel.hidden = false;
        const percentage = Math.round((score / scenarios.length) * 100);
        resultPanel.textContent = `Safety check complete: ${score} of ${scenarios.length} correct (${percentage}%). Review any missed explanations above to strengthen your safety choices.`;
        try {
            await saveSafetyScore(percentage);
            resultPanel.textContent += ' Your score was saved to your account.';
        } catch (error) {
            resultPanel.textContent += ' Your score could not be saved right now.';
        }
    });
    render();
});
