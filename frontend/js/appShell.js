(function () {
    const sections = [
        { title: 'MAIN', links: [['Dashboard', 'dashboard.html', 'fa-house'], ['My Progress', 'progress.html', 'fa-chart-line']] },
        { title: 'LEARN AI', links: [['AI Basics', 'ai-basics.html', 'fa-robot'], ['AI & Communication', 'communication.html', 'fa-comments'], ['AI Technologies', 'technologies.html', 'fa-rocket'], ['AI in Education', 'education.html', 'fa-book-open'], ['Benefits & Risks', 'benefits-risks.html', 'fa-scale-balanced']] },
        { title: 'AI TOOLS', links: [['Web Search', 'search.html', 'fa-magnifying-glass'], ['AI Prediction', 'prediction.html', 'fa-brain'], ['Language AI', 'language.html', 'fa-globe'], ['AI Learning Assistant', 'ai-assistant.html', 'fa-message']] },
        { title: 'SAFETY & ASSESSMENT', links: [['AI Safety', 'safety.html', 'fa-shield-halved'], ['AI Quiz', 'quiz.html', 'fa-list-check'], ['Certificates', 'certificates.html', 'fa-award']] },
        { title: 'SYSTEM', links: [['Settings', 'settings.html', 'fa-gear'], ['Contact', 'contact.html', 'fa-headset']] }
    ];
    const navKeys = {
        'dashboard.html': 'nav_dashboard', 'ai-basics.html': 'nav_ai_basics',
        'communication.html': 'nav_communication', 'technologies.html': 'nav_ai_technologies',
        'education.html': 'nav_education', 'benefits-risks.html': 'nav_benefits',
        'prediction.html': 'nav_prediction', 'language.html': 'nav_language', 'search.html': 'nav_search',
        'assistant.html': 'nav_assistant', 'ai-assistant.html': 'nav_assistant', 'safety.html': 'nav_safety', 'quiz.html': 'nav_quiz',
        'certificates.html': 'nav_certificates', 'progress.html': 'nav_progress',
        'contact.html': 'nav_contact', 'settings.html': 'nav_settings'
    };
    const groupKeys = { MAIN: 'nav_group_main', 'LEARN AI': 'nav_group_learn', 'AI TOOLS': 'nav_group_tools', 'SAFETY & ASSESSMENT': 'nav_group_safety', SYSTEM: 'nav_group_system' };
    const pageTitles = {
        'dashboard.html': 'Student Dashboard', 'ai-basics.html': 'AI Basics', 'communication.html': 'AI & Communication',
        'technologies.html': 'AI Technologies', 'education.html': 'AI in Education', 'benefits-risks.html': 'Benefits & Risks',
        'prediction.html': 'AI Prediction', 'language.html': 'Language AI', 'assistant.html': 'AI Learning Assistant',
        'safety.html': 'AI Safety', 'quiz.html': 'AI Quiz', 'certificates.html': 'Certificates', 'search.html': 'Search the Internet', 'ai-assistant.html': 'AI Learning Assistant',
        'progress.html': 'My Progress', 'settings.html': 'Settings', 'contact.html': 'Contact', 'nlp-learning.html': 'Natural Language Processing'
    };
    const pageClasses = {
        'dashboard.html': 'dashboard-page', 'ai-basics.html': 'ai-basics-page', 'communication.html': 'communication-page',
        'technologies.html': 'technologies-page', 'education.html': 'education-page', 'benefits-risks.html': 'benefits-risks-page',
        'prediction.html': 'prediction-page', 'language.html': 'language-page', 'assistant.html': 'assistant-page',
        'safety.html': 'safety-page', 'quiz.html': 'quiz-page', 'certificates.html': 'certificates-page',
        'progress.html': 'progress-page', 'settings.html': 'settings-page', 'contact.html': 'contact-page', 'nlp-learning.html': 'nlp-learning-page', 'search.html': 'search-page'
    };

    const make = (tag, className, text) => {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text) node.textContent = text;
        return node;
    };

    function start() {
        const main = document.querySelector('main');
        if (!main || document.querySelector('.app-shell')) return;

        const currentPath = location.pathname.split('/').pop();
        const user = window.AISaksharaAuth?.getUser() || {};
        document.body.classList.add('app-page');
        document.body.classList.add(pageClasses[currentPath] || 'student-page');
        const shell = make('div', 'app-shell');
        const sidebar = make('aside', 'app-sidebar');
        sidebar.id = 'appSidebar';
        sidebar.setAttribute('aria-label', 'Main navigation');

        const brandRow = make('div', 'sidebar-brand-row');
        const brand = make('a', 'sidebar-brand');
        brand.href = 'dashboard.html';
        brand.innerHTML = '<i class="fas fa-robot" aria-hidden="true"></i><span class="sidebar-brand-copy"><strong>AI-Sakshara</strong><small>AI Awareness Platform</small></span>';
        brandRow.append(brand);
        sidebar.append(brandRow);

        const nav = make('nav', 'sidebar-navigation');
        sections.forEach((section) => {
            const group = make('div', 'sidebar-group');
            const sectionTitle = make('p', 'sidebar-section-title', section.title);
            sectionTitle.dataset.i18n = groupKeys[section.title];
            group.append(sectionTitle);
            section.links.forEach(([label, href, icon]) => {
                const link = make('a', 'sidebar-link');
                link.href = href;
                link.title = label;
                link.dataset.i18n = navKeys[href];
                if (href === currentPath) {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                }
                const glyph = make('i', `fas ${icon}`);
                glyph.setAttribute('aria-hidden', 'true');
                link.append(glyph, make('span', 'sidebar-link-label', label));
                group.append(link);
            });
            nav.append(group);
        });
        sidebar.append(nav);

        const sidebarFooter = make('div', 'sidebar-footer');
        const logout = make('button', 'sidebar-link sidebar-logout');
        logout.type = 'button';
        logout.title = 'Logout';
        logout.dataset.i18nTitle = 'nav_logout';
        logout.innerHTML = '<i class="fas fa-arrow-right-from-bracket" aria-hidden="true"></i><span class="sidebar-link-label">Logout</span>';
        sidebarFooter.append(logout);
        sidebar.append(sidebarFooter);

        const overlay = make('button', 'sidebar-overlay');
        overlay.type = 'button';
        overlay.setAttribute('aria-label', 'Close navigation menu');
        const appMain = make('div', 'app-main');
        const topbar = make('header', 'app-topbar');
        const start = make('div', 'topbar-start');
        const mobileMenu = make('button', 'topbar-icon-button mobile-menu-button');
        mobileMenu.type = 'button';
        mobileMenu.setAttribute('aria-label', 'Open navigation menu');
        mobileMenu.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
        const desktopMenu = make('button', 'topbar-icon-button desktop-menu-button');
        desktopMenu.type = 'button';
        desktopMenu.setAttribute('aria-label', 'Toggle sidebar');
        desktopMenu.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
        const topBrand = make('a', 'topbar-brand', 'AI-Sakshara');
        topBrand.href = 'dashboard.html';
        const pageTitle = make('span', 'topbar-page-title', pageTitles[currentPath] || 'Student Dashboard');
        start.append(mobileMenu, desktopMenu, topBrand, pageTitle);

        const searchForm = make('form', 'topbar-search');
        searchForm.setAttribute('role', 'search');
        const searchIcon = make('i', 'fas fa-magnifying-glass');
        searchIcon.setAttribute('aria-hidden', 'true');
        const search = make('input');
        search.type = 'search';
        search.placeholder = 'Search the web...';
        search.setAttribute('aria-label', 'Search the web');
        search.dataset.i18nPlaceholder = 'search_topics';
        searchForm.append(searchIcon, search);

        const controls = make('div', 'topbar-controls');
        const languageLabel = make('label', 'language-control');
        languageLabel.setAttribute('aria-label', 'Interface language');
        languageLabel.innerHTML = '<i class="fas fa-globe" aria-hidden="true"></i>';
        const language = make('select', 'topbar-language');
        language.id = 'languageSelector';
        [['en', 'English'], ['kn', 'ಕನ್ನಡ'], ['hi', 'हिन्दी'], ['mr', 'मराठी']].forEach(([value, label]) => {
            const option = make('option', '', label);
            option.value = value;
            language.append(option);
        });
        language.value = localStorage.getItem('language') || 'en';
        languageLabel.append(language);

        const themeButton = make('button', 'topbar-icon-button');
        themeButton.type = 'button';
        themeButton.id = 'themeToggle';
        themeButton.dataset.shellManaged = 'true';
        themeButton.setAttribute('aria-label', 'Toggle dark mode');
        const updateThemeIcon = () => {
            const icon = document.documentElement.dataset.theme === 'dark' ? 'fa-sun' : 'fa-moon';
            themeButton.innerHTML = `<i class="fas ${icon}" aria-hidden="true"></i>`;
        };
        updateThemeIcon();

        const profile = make('div', 'profile-wrap');
        const profileButton = make('button', 'profile-button');
        profileButton.type = 'button';
        profileButton.setAttribute('aria-expanded', 'false');
        profileButton.setAttribute('aria-label', 'Open student profile menu');
        const initials = (user.name || 'Student').trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
        profileButton.append(make('span', 'profile-avatar', initials), make('span', 'profile-name', user.name || 'Student'));
        profileButton.insertAdjacentHTML('beforeend', '<i class="fas fa-chevron-down" aria-hidden="true"></i>');
        const profileMenu = make('div', 'profile-menu');
        profileMenu.hidden = true;
        profileMenu.append(make('strong', 'profile-menu-name', user.name || 'Student'));
        profileMenu.append(make('span', 'profile-menu-email', user.email || ''));
        const profileSettings = make('a', '', 'My Profile & Settings');
        profileSettings.href = 'settings.html';
        const profileLogout = make('button', '', 'Logout');
        profileLogout.type = 'button';
        profileMenu.append(profileSettings, profileLogout);
        profile.append(profileButton, profileMenu);
        controls.append(languageLabel, themeButton, profile);
        topbar.append(start, searchForm, controls);

        const content = make('div', 'app-content main-content');
        const oldNav = document.querySelector('body > .navbar');
        const oldFooter = document.querySelector('body > .footer');
        oldNav?.remove();
        content.append(main);
        if (oldFooter) content.append(oldFooter);
        appMain.append(topbar, content);
        shell.append(sidebar, overlay, appMain);
        document.body.prepend(shell);
        document.documentElement.classList.remove('app-shell-pending');
        document.documentElement.style.visibility = '';

        const closeDrawer = () => document.body.classList.remove('sidebar-open');
        mobileMenu.addEventListener('click', () => document.body.classList.toggle('sidebar-open'));
        overlay.addEventListener('click', closeDrawer);
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a[href]');
            if (!link || link.target || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            const destination = new URL(link.href, location.href);
            if (destination.origin !== location.origin || !destination.pathname.endsWith('.html')) return;
            if (destination.searchParams.has('appReload')) return;
            event.preventDefault();
            destination.searchParams.set('appReload', Date.now());
            location.assign(destination.href);
        });
        nav.addEventListener('click', (event) => {
            if (event.target.closest('a') && matchMedia('(max-width: 768px)').matches) closeDrawer();
        });

        const setCollapsed = (collapsed) => {
            document.body.classList.toggle('sidebar-collapsed', collapsed);
            desktopMenu.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
            localStorage.setItem('sidebarCollapsed', String(collapsed));
        };
        setCollapsed(localStorage.getItem('sidebarCollapsed') === 'true');
        desktopMenu.addEventListener('click', () => setCollapsed(!document.body.classList.contains('sidebar-collapsed')));

        const showLogout = () => {
            let dialog = document.getElementById('logoutDialog');
            if (!dialog) {
                dialog = make('dialog', 'logout-dialog');
                dialog.id = 'logoutDialog';
                dialog.innerHTML = '<form method="dialog"><h2>Log out?</h2><p>Are you sure you want to end your session?</p><div class="dialog-actions"><button value="cancel" class="btn btn-outline">Cancel</button><button value="logout" class="btn btn-primary">Log out</button></div></form>';
                document.body.append(dialog);
                dialog.querySelector('form').addEventListener('submit', (event) => {
                    if (event.submitter?.value === 'logout') {
                        event.preventDefault();
                        dialog.close('logout');
                        window.AISaksharaAuth?.clearSession();
                        location.replace('login.html?v=20261006-auth&logout=1');
                    }
                });
            }
            if (dialog.showModal) dialog.showModal();
            else if (confirm('Are you sure you want to log out?')) {
                window.AISaksharaAuth?.clearSession();
                location.replace('login.html?v=20261006-auth&logout=1');
            }
        };
        logout.addEventListener('click', showLogout);
        profileLogout.addEventListener('click', showLogout);
        profileButton.addEventListener('click', () => {
            profileMenu.hidden = !profileMenu.hidden;
            profileButton.setAttribute('aria-expanded', String(!profileMenu.hidden));
        });
        document.addEventListener('click', (event) => {
            if (!profile.contains(event.target)) {
                profileMenu.hidden = true;
                profileButton.setAttribute('aria-expanded', 'false');
            }
        });

        themeButton.addEventListener('click', () => {
            const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
            document.documentElement.dataset.theme = next;
            localStorage.setItem('theme', next);
            updateThemeIcon();
        });
        language.addEventListener('change', () => {
            localStorage.setItem('language', language.value);
            applyLanguage(language.value);
        });
        async function applyLanguage(code) {
            try {
                const response = await fetch(`assets/translations/${code}.json`);
                if (!response.ok) return;
                const dictionary = await response.json();
                document.querySelectorAll('[data-i18n]').forEach((element) => {
                    const translation = dictionary[element.dataset.i18n];
                    if (translation) {
                        const label = element.querySelector('.sidebar-link-label');
                        if (label) label.textContent = translation;
                        else element.textContent = translation;
                    }
                });
                document.querySelectorAll('[data-i18n-title]').forEach((element) => {
                    const translation = dictionary[element.dataset.i18nTitle];
                    if (translation) element.title = translation;
                });
                document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
                    const translation = dictionary[element.dataset.i18nPlaceholder];
                    if (translation) element.placeholder = translation;
                });
                document.documentElement.lang = code;
            } catch (error) {
                console.error('Unable to load language preferences.');
            }
        }
        window.AISaksharaApplyLanguage = applyLanguage;
        applyLanguage(language.value);
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const query = search.value.trim();
            if (!query) return;
            location.href = `search.html?q=${encodeURIComponent(query)}&appReload=${Date.now()}`;
        });

        const welcome = document.getElementById('welcomeHeading');
        if (welcome && user.name) welcome.textContent = `Welcome back, ${user.name}!`;
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
    else start();
})();
