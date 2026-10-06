let currentLanguage = localStorage.getItem('language') || 'en';

async function loadTranslations(lang) {
    try {
        const response = await fetch(`assets/translations/${lang}.json`);
        const translations = await response.json();
        
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key]) {
                if (element.tagName === 'INPUT' && element.type === 'button') {
                    element.value = translations[key];
                } else {
                    element.textContent = translations[key];
                }
            }
        });
        document.documentElement.lang = lang;
    } catch (error) {
        console.error("Error loading translations", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadTranslations(currentLanguage);
    
    const langSelect = document.getElementById('languageSelector');
    if (langSelect) {
        langSelect.value = currentLanguage;
        langSelect.addEventListener('change', (e) => {
            currentLanguage = e.target.value;
            localStorage.setItem('language', currentLanguage);
            loadTranslations(currentLanguage);
        });
    }
});
