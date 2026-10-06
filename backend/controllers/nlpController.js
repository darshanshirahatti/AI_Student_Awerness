const supportedLanguages = new Set(['en', 'kn', 'hi', 'mr']);

exports.translate = async (req, res) => {
    const { text, sourceLanguage, targetLanguage } = req.body;
    if (typeof text !== 'string' || !text.trim()) {
        return res.status(400).json({ success: false, message: 'Enter text to translate.' });
    }
    if (text.length > 2000) {
        return res.status(400).json({ success: false, message: 'Please keep text under 2,000 characters.' });
    }
    if (!supportedLanguages.has(sourceLanguage) || !supportedLanguages.has(targetLanguage) || sourceLanguage === targetLanguage) {
        return res.status(400).json({ success: false, message: 'Choose two different supported languages.' });
    }

    const baseUrl = process.env.LIBRETRANSLATE_URL;
    if (!baseUrl) {
        return res.status(503).json({ success: false, message: 'Translation service is not configured yet.' });
    }

    try {
        const response = await fetch(`${baseUrl.replace(/\/+$/, '')}/translate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                q: text.trim(),
                source: sourceLanguage,
                target: targetLanguage,
                format: 'text',
                ...(process.env.LIBRETRANSLATE_API_KEY ? { api_key: process.env.LIBRETRANSLATE_API_KEY } : {})
            }),
            signal: AbortSignal.timeout(10000)
        });
        if (!response.ok) return res.status(502).json({ success: false, message: 'Translation service is unavailable. Please try again.' });

        const result = await response.json();
        if (typeof result.translatedText !== 'string') {
            return res.status(502).json({ success: false, message: 'Translation service returned an invalid response.' });
        }
        return res.json({ success: true, data: { translatedText: result.translatedText } });
    } catch (error) {
        return res.status(502).json({ success: false, message: 'Translation service is unavailable. Please try again.' });
    }
};
