document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('predictionForm');
    const status = document.getElementById('predictionStatus');
    const quizScore = document.getElementById('p_quizScore');
    const safetyScore = document.getElementById('p_safety');

    const updateOutput = (input, outputId) => {
        document.getElementById(outputId).textContent = `${input.value}%`;
    };
    quizScore.addEventListener('input', () => updateOutput(quizScore, 'quizScoreOutput'));
    safetyScore.addEventListener('input', () => updateOutput(safetyScore, 'safetyScoreOutput'));

    try {
        const response = await getDashboard();
        const data = response.data;
        if (data.averageScore !== null && data.averageScore !== undefined) {
            quizScore.value = data.averageScore;
            updateOutput(quizScore, 'quizScoreOutput');
        }
        document.getElementById('p_lessons').value = data.lessonsCompleted || 0;
        document.getElementById('p_attempts').value = data.quizAttempts || 0;
        status.textContent = data.averageScore === null
            ? 'No saved quiz score yet. Add any other learning signals you know, then try your estimate.'
            : 'Quiz score and completed lessons were loaded from your account. Adjust any value before calculating.';
    } catch (error) {
        status.textContent = 'Saved learning data is unavailable. You can still enter your own estimates.';
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const values = {
            quizScore: Number(quizScore.value),
            lessonsCompleted: Number(document.getElementById('p_lessons').value),
            quizAttempts: Number(document.getElementById('p_attempts').value),
            safetyScore: Number(safetyScore.value),
            aiQuestionsAsked: Number(document.getElementById('p_questions').value),
            learningMinutes: Number(document.getElementById('p_time').value)
        };
        values.lessonsCompleted = Math.min(6, Math.max(0, values.lessonsCompleted || 0));
        values.aiQuestionsAsked = Math.max(0, values.aiQuestionsAsked || 0);
        values.learningMinutes = Math.max(0, values.learningMinutes || 0);

        const button = document.getElementById('predictButton');
        button.disabled = true;
        button.textContent = 'Analyzing your learning profile...';
        status.textContent = 'Analyzing your learning profile...';
        try {
            const response = await predictAwareness(values);
            const result = response.data;
            const activitySignals = Object.values(values).filter((value) => value > 0).length;
            document.getElementById('resultCard').hidden = false;
            document.getElementById('resultCard').style.display = 'block';
            document.getElementById('r_level').textContent = result.level;
            document.getElementById('r_score').textContent = `${result.score}/100`;
            document.getElementById('r_confidence').textContent = `${activitySignals} of 6 indicators show activity`;
            document.getElementById('r_circle').className = `circle-progress level-${result.level}`;
            document.getElementById('r_recommendation').textContent = result.recommendation;
            status.textContent = 'Prediction saved to your account.';
        } catch (error) {
            status.textContent = error.message || 'Unable to calculate a prediction right now. Please try again.';
        } finally {
            button.disabled = false;
            button.textContent = 'Predict my AI level';
        }
    });
});
