document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const errorMsg = document.getElementById('errorMessage');
    const successMsg = document.getElementById('successMessage');

    const showError = (message) => {
        if (!errorMsg) return;
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
    };

    const saveSession = (response, rememberMe) => {
        const authData = response.data || response;
        const user = authData.user || {
            _id: authData._id,
            name: authData.name,
            email: authData.email,
            role: authData.role
        };

        if (!authData.token || !user.name) {
            throw new Error('The server returned an incomplete account. Please try again.');
        }

        window.AISaksharaAuth?.clearSession();
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('token', authData.token);
        storage.setItem('user', JSON.stringify(user));
    };

    const setSubmitting = (form, isSubmitting, label) => {
        const button = form.querySelector('button[type="submit"]');
        if (!button) return;
        button.disabled = isSubmitting;
        button.textContent = isSubmitting ? label : button.dataset.defaultLabel;
    };

    [loginForm, registerForm].filter(Boolean).forEach((form) => {
        const button = form.querySelector('button[type="submit"]');
        if (button) button.dataset.defaultLabel = button.textContent;
    });

    document.querySelectorAll('[data-password-target]').forEach((button) => {
        const input = document.getElementById(button.dataset.passwordTarget);
        if (!input) return;
        button.addEventListener('click', () => {
            const showPassword = input.type === 'password';
            input.type = showPassword ? 'text' : 'password';
            button.setAttribute('aria-label', showPassword ? 'Hide password' : 'Show password');
            button.innerHTML = `<i class="fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}" aria-hidden="true"></i>`;
        });
    });
    
    if (loginForm) {
        const params = new URLSearchParams(window.location.search);
        if (params.has('registered') && successMsg) {
            successMsg.textContent = 'Your account was created. Sign in to continue.';
            successMsg.hidden = false;
        }
        if (params.has('expired')) showError('Your session expired. Please sign in again.');
        if (params.has('logout') && successMsg) {
            successMsg.textContent = 'You have been signed out.';
            successMsg.hidden = false;
        }

        const forgotPassword = document.getElementById('forgotPassword');
        forgotPassword?.addEventListener('click', (event) => {
            event.preventDefault();
            showError('Password reset is not available yet. Please contact your teacher or administrator.');
        });

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (errorMsg) errorMsg.style.display = 'none';
            const email = document.getElementById('email').value.trim().toLowerCase();
            const password = document.getElementById('password').value;
            
            try {
                setSubmitting(loginForm, true, 'Signing in...');
                const response = await loginUser({ email, password });
                saveSession(response, document.getElementById('rememberMe')?.checked);
                window.location.href = `dashboard.html?appReload=${Date.now()}`;
            } catch (error) {
                showError(error.message);
                setSubmitting(loginForm, false);
            }
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (errorMsg) errorMsg.style.display = 'none';
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                showError('Passwords do not match.');
                return;
            }

            if (!document.getElementById('responsibleUse').checked) {
                showError('Please agree to use the platform responsibly.');
                return;
            }

            const userData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim().toLowerCase(),
                password,
                className: document.getElementById('className').value.trim(),
                schoolName: document.getElementById('schoolName').value.trim()
            };

            try {
                setSubmitting(registerForm, true, 'Creating account...');
                await registerUser(userData);
                if (successMsg) {
                    successMsg.textContent = 'Account created successfully! Redirecting you to sign in...';
                    successMsg.hidden = false;
                }
                window.setTimeout(() => {
                    window.location.href = `login.html?registered=1&fresh=${Date.now()}`;
                }, 900);
            } catch (error) {
                showError(error.message);
                setSubmitting(registerForm, false);
            }
        });
    }
});
