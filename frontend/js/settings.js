document.addEventListener('DOMContentLoaded', () => {
    const user = window.AISaksharaAuth?.getUser() || {};
    const fields = {
        settingsName: user.name || 'Student',
        settingsEmail: user.email || '',
        settingsClass: user.className || 'Not provided',
        settingsSchool: user.schoolName || 'Not provided'
    };
    Object.entries(fields).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });

    const language = document.getElementById('settingsLanguage');
    language.value = localStorage.getItem('language') || 'en';
    language.addEventListener('change', () => {
        localStorage.setItem('language', language.value);
        window.AISaksharaApplyLanguage?.(language.value);
        document.getElementById('settingsStatus').textContent = 'Language preference saved.';
    });

    const theme = document.getElementById('settingsTheme');
    theme.value = document.documentElement.dataset.theme || 'light';
    theme.addEventListener('change', () => {
        document.documentElement.dataset.theme = theme.value;
        localStorage.setItem('theme', theme.value);
        const button = document.getElementById('themeToggle');
        if (button) button.innerHTML = `<i class="fas ${theme.value === 'dark' ? 'fa-sun' : 'fa-moon'}" aria-hidden="true"></i>`;
        document.getElementById('settingsStatus').textContent = 'Theme preference saved.';
    });
});
