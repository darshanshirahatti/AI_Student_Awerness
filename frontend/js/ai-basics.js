document.addEventListener('DOMContentLoaded', () => {
    const choices = document.querySelectorAll('.spot-ai-choice');
    const feedback = document.getElementById('spotAiFeedback');
    choices.forEach((choice) => {
        choice.addEventListener('click', () => {
            choices.forEach((button) => {
                button.disabled = true;
                button.classList.toggle('spot-ai-selected', button === choice);
            });
            feedback.textContent = choice.dataset.answer === 'ai'
                ? 'Correct. Face ID uses AI to recognize patterns in your face. A basic pocket calculator follows fixed arithmetic instructions.'
                : 'A basic calculator follows fixed arithmetic instructions. Face ID uses AI to recognize patterns in your face.';
        });
    });
});
