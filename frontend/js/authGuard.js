(function () {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    const loginPage = 'login.html?v=20261006-auth';
    const protectedPages = new Set([
        'dashboard.html', 'ai-basics.html', 'communication.html', 'technologies.html',
        'education.html', 'prediction.html', 'language.html', 'benefits-risks.html',
        'safety.html', 'quiz.html', 'contact.html', 'assistant.html', 'nlp-learning.html',
        'certificates.html', 'progress.html', 'settings.html', 'ai-assistant.html', 'search.html'
    ]);

    const clearSession = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
    };

    const readSession = () => {
        const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
        const token = storage.getItem('token');
        let user;

        try {
            user = JSON.parse(storage.getItem('user') || 'null');
        } catch (error) {
            return null;
        }

        if (!token || !user || !user.name) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
            if (payload.exp && payload.exp * 1000 <= Date.now()) return null;
        } catch (error) {
            return null;
        }

        return { token, user, storage };
    };

    let session = readSession();
    if (!session) clearSession();
    document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') || 'light');

    window.AISaksharaAuth = {
        getToken: () => readSession()?.token || null,
        getUser: () => readSession()?.user || null,
        clearSession
    };

    if (path === 'index.html' || path === '') {
        window.location.replace(session ? `dashboard.html?appReload=${Date.now()}` : loginPage);
        return;
    }

    if (protectedPages.has(path) && !session) {
        window.location.replace(`${loginPage}&expired=1`);
        return;
    }

    window.addEventListener('pageshow', (event) => {
        if (event.persisted && protectedPages.has(path) && !readSession()) {
            window.location.replace(`${loginPage}&expired=1`);
        }
    });

    if (protectedPages.has(path) && session) {
        document.documentElement.classList.add('app-shell-pending');
        document.documentElement.style.visibility = 'hidden';
        const shellVersion = Date.now();
        const stylesheet = document.createElement('link');
        stylesheet.rel = 'stylesheet';
        stylesheet.href = `css/app-shell.css?v=${shellVersion}`;
        document.head.append(stylesheet);

        const shellScript = document.createElement('script');
        shellScript.src = `js/appShell.js?v=${shellVersion}`;
        document.head.append(shellScript);
    }

    if ((path === 'login.html' || path === 'register.html') && session) {
        window.location.replace('dashboard.html');
    }
})();