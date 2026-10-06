document.addEventListener('DOMContentLoaded', () => {
    const source = document.getElementById('sourceLang');
    const target = document.getElementById('targetLang');
    const input = document.getElementById('inputText');
    const output = document.getElementById('outputText');
    const translateButton = document.getElementById('translateBtn');
    const translationStatus = document.getElementById('translationStatus');
    const listenButton = document.getElementById('listenBtn');
    const askButton = document.getElementById('askBtn');
    const chatInput = document.getElementById('chatInput');
    const chatLanguage = document.getElementById('chatLang');
    const chatResponse = document.getElementById('chatResponse');
    const languageTags = { en: 'en-US', kn: 'kn-IN', hi: 'hi-IN', mr: 'mr-IN' };

    translateButton.addEventListener('click', async () => {
        const text = input.value.trim();
        if (!text) {
            translationStatus.textContent = 'Enter text to translate.';
            input.focus();
            return;
        }
        if (source.value === target.value) {
            translationStatus.textContent = 'Choose two different languages.';
            return;
        }

        translateButton.disabled = true;
        translateButton.textContent = 'Translating...';
        translationStatus.textContent = 'Sending your text to the configured translation service...';
        try {
            const result = await translateText(text, source.value, target.value);
            const translatedText = result.data?.translatedText || result.translatedText;
            if (!translatedText) throw new Error('Translation service returned no text.');
            output.textContent = translatedText;
            translationStatus.textContent = 'Translation complete.';
        } catch (error) {
            output.textContent = 'No translation is available right now.';
            translationStatus.textContent = error.message || 'Unable to connect to AI-Sakshara services. Please try again.';
        } finally {
            translateButton.disabled = false;
            translateButton.textContent = 'TRANSLATE';
        }
    });

    listenButton.addEventListener('click', () => {
        const text = output.textContent.trim();
        if (!text || text === 'Your translation will appear here.' || text === 'No translation is available right now.') {
            translationStatus.textContent = 'Translate some text before listening.';
            return;
        }
        if (!window.speechSynthesis) {
            translationStatus.textContent = 'Text-to-speech is not available in this browser.';
            return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = languageTags[target.value] || 'en-US';
        window.speechSynthesis.speak(utterance);
    });

    document.getElementById('speakBtn').addEventListener('click', () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            translationStatus.textContent = 'Speech input is not available in this browser. You can type your text instead.';
            return;
        }

        const button = document.getElementById('speakBtn');
        const recognition = new SpeechRecognition();
        recognition.lang = languageTags[source.value] || 'en-US';
        recognition.onstart = () => {
            button.disabled = true;
            button.textContent = 'Listening...';
            translationStatus.textContent = 'Listening for your speech...';
        };
        recognition.onresult = (event) => {
            input.value = event.results[0][0].transcript;
            translationStatus.textContent = 'Speech added to the text field.';
        };
        recognition.onerror = () => {
            translationStatus.textContent = 'Speech input stopped. You can type your text instead.';
        };
        recognition.onend = () => {
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-microphone" aria-hidden="true"></i> Speak';
        };
        try {
            recognition.start();
        } catch (error) {
            translationStatus.textContent = 'Unable to start speech input. Please try again.';
        }
    });

    const askQuestion = async () => {
        const question = chatInput.value.trim();
        if (!question || askButton.disabled) return;
        askButton.disabled = true;
        askButton.textContent = 'AI is thinking...';
        chatResponse.textContent = 'Thinking...';
        try {
            const result = await askAI(question, chatLanguage.value);
            chatResponse.textContent = result.answer || 'Try asking about a lesson, quiz, dashboard, language, or safety topic.';
            if (chatLanguage.value !== 'en') {
                chatResponse.textContent += ' The student guide currently replies in English.';
            }
        } catch (error) {
            chatResponse.textContent = error.message || 'Unable to connect to AI-Sakshara services. Please try again.';
        } finally {
            askButton.disabled = false;
            askButton.textContent = 'ASK AI';
        }
    };

    askButton.addEventListener('click', askQuestion);
    chatInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            askQuestion();
        }
    });
});
