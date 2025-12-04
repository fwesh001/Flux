/* ============================================
   AUTH.JS - Authentication Form Handling
   ============================================ */

class AuthForm {
    constructor() {
        this.isLogin = document.getElementById('loginForm') !== null;
        this.form = this.isLogin ? document.getElementById('loginForm') : document.getElementById('registerForm');
        
        if (!this.form) return;

        this.setupEventListeners();
        this.setupPasswordToggle();
        if (!this.isLogin) {
            this.setupPasswordStrength();
            this.setupPasswordConfirmation();
            this.setupUsernameValidation();
        }
    }

    /**
     * Setup form event listeners
     */
    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation on blur
        const inputs = this.form.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
        inputs.forEach(input => {
            input.addEventListener('blur', (e) => this.validateField(e.target));
            input.addEventListener('input', (e) => this.clearError(e.target));
        });

        // Social buttons
        const socialButtons = document.querySelectorAll('.btn-social');
        socialButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSocialLogin(btn);
            });
        });
    }

    /**
     * Setup password visibility toggle
     */
    setupPasswordToggle() {
        const toggleBtn = document.getElementById('togglePassword');
        const passwordField = this.isLogin 
            ? document.getElementById('password') 
            : document.getElementById('registerPassword');

        if (!toggleBtn || !passwordField) return;

        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const isPassword = passwordField.type === 'password';
            passwordField.type = isPassword ? 'text' : 'password';
            toggleBtn.setAttribute('aria-pressed', isPassword ? 'true' : 'false');
            toggleBtn.textContent = isPassword ? '🙈' : '👁️';
        });
    }

    /**
     * Setup password strength indicator (Register only)
     */
    setupPasswordStrength() {
        const passwordInput = document.getElementById('registerPassword');
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');

        if (!passwordInput) return;

        passwordInput.addEventListener('input', () => {
            const strength = this.calculatePasswordStrength(passwordInput.value);
            
            strengthFill.className = `strength-fill ${strength.level}`;
            strengthText.textContent = `Password strength: ${strength.text}`;
        });
    }

    /**
     * Setup password confirmation validation (Register only)
     */
    setupPasswordConfirmation() {
        const passwordInput = document.getElementById('registerPassword');
        const confirmInput = document.getElementById('confirmPassword');
        const confirmStatus = document.getElementById('confirmStatus');

        if (!passwordInput || !confirmInput) return;

        const updateConfirmStatus = () => {
            if (confirmInput.value === '' || passwordInput.value === '') {
                confirmStatus.textContent = '🔒';
                this.clearError(confirmInput);
            } else if (passwordInput.value === confirmInput.value) {
                confirmStatus.textContent = '✅';
                this.clearError(confirmInput);
            } else {
                confirmStatus.textContent = '❌';
                this.showError(confirmInput, 'Passwords do not match');
            }
        };

        passwordInput.addEventListener('input', updateConfirmStatus);
        confirmInput.addEventListener('input', updateConfirmStatus);
    }

    /**
     * Setup username availability check (Register only)
     */
    setupUsernameValidation() {
        const usernameInput = document.getElementById('username');
        const usernameStatus = document.getElementById('usernameStatus');
        let debounceTimer;

        if (!usernameInput) return;

        usernameInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            const username = usernameInput.value.trim();

            // Validate format
            if (username.length < 3) {
                usernameStatus.textContent = '📝';
                this.clearError(usernameInput);
                return;
            }

            if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
                this.showError(usernameInput, 'Only letters, numbers, underscore, and hyphen allowed');
                usernameStatus.textContent = '❌';
                return;
            }

            // Simulate API check
            usernameStatus.textContent = '⏳';
            debounceTimer = setTimeout(() => {
                if (this.isUsernameAvailable(username)) {
                    usernameStatus.textContent = '✅';
                    this.clearError(usernameInput);
                } else {
                    usernameStatus.textContent = '❌';
                    this.showError(usernameInput, 'Username is already taken');
                }
            }, 500);
        });
    }

    /**
     * Validate individual field
     */
    validateField(field) {
        const value = field.value.trim();
        const name = field.name;

        // Skip validation if empty (will be caught by required attribute)
        if (!value && field.required) {
            this.showError(field, 'This field is required');
            return false;
        }

        if (!value) {
            this.clearError(field);
            return true;
        }

        // Email validation
        if (field.type === 'email' || name === 'email' || name === 'registerEmail') {
            if (!this.validateEmail(value)) {
                this.showError(field, 'Please enter a valid email address');
                return false;
            }
        }

        // Username validation
        if (name === 'username') {
            if (value.length < 3) {
                this.showError(field, 'Username must be at least 3 characters');
                return false;
            }
            if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
                this.showError(field, 'Only letters, numbers, underscore, and hyphen allowed');
                return false;
            }
        }

        // Password validation
        if (name === 'password' || name === 'registerPassword') {
            if (value.length < 8) {
                this.showError(field, 'Password must be at least 8 characters');
                return false;
            }
        }

        // Full name validation
        if (name === 'fullName') {
            if (value.length < 2) {
                this.showError(field, 'Please enter your full name');
                return false;
            }
        }

        this.clearError(field);
        return true;
    }

    /**
     * Validate email format
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Calculate password strength
     */
    calculatePasswordStrength(password) {
        let score = 0;
        const feedback = [];

        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;

        if (score < 2) return { level: 'weak', text: 'Too weak' };
        if (score < 4) return { level: 'fair', text: 'Fair' };
        return { level: 'good', text: 'Strong' };
    }

    /**
     * Check if username is available (simulated)
     */
    isUsernameAvailable(username) {
        // Simulated taken usernames
        const takenUsernames = ['admin', 'test', 'user', 'john', 'jane', 'demo'];
        return !takenUsernames.includes(username.toLowerCase());
    }

    /**
     * Show error message
     */
    showError(field, message) {
        const errorId = `${field.id}Error`;
        const errorElement = document.getElementById(errorId);
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }

        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');
    }

    /**
     * Clear error message
     */
    clearError(field) {
        const errorId = `${field.id}Error`;
        const errorElement = document.getElementById(errorId);
        
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }

        field.classList.remove('error');
        field.setAttribute('aria-invalid', 'false');
    }

    /**
     * Validate entire form
     */
    validateForm() {
        const inputs = this.form.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="checkbox"]');
        let isValid = true;

        // Validate all fields
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                if (input.required && !input.checked) {
                    const errorId = `${input.id}Error`;
                    const errorElement = document.getElementById(errorId);
                    if (errorElement) {
                        errorElement.textContent = 'You must agree to continue';
                        errorElement.classList.add('show');
                    }
                    isValid = false;
                } else if (input.type === 'checkbox' && input.required) {
                    const errorId = `${input.id}Error`;
                    const errorElement = document.getElementById(errorId);
                    if (errorElement) {
                        errorElement.classList.remove('show');
                        errorElement.textContent = '';
                    }
                }
            } else if (!this.validateField(input)) {
                isValid = false;
            }
        });

        // Additional register validation
        if (!this.isLogin) {
            const password = document.getElementById('registerPassword').value;
            const confirm = document.getElementById('confirmPassword').value;
            
            if (password !== confirm) {
                this.showError(document.getElementById('confirmPassword'), 'Passwords do not match');
                isValid = false;
            }
        }

        return isValid;
    }

    /**
     * Handle form submission
     */
    handleSubmit(e) {
        e.preventDefault();

        // Clear previous form error
        const formError = document.getElementById('formError');
        formError.style.display = 'none';
        formError.textContent = '';

        // Validate form
        if (!this.validateForm()) {
            return;
        }

        // Show loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            this.submitForm(submitBtn);
        }, 1000);
    }

    /**
     * Submit form data (simulated)
     */
    submitForm(submitBtn) {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Log form data (in real app, send to backend)
        console.log('Form submitted:', data);

        // Simulate success
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;

        // Show success message
        const formError = document.getElementById('formError');
        formError.className = 'alert alert-success';
        formError.style.display = 'block';
        formError.textContent = this.isLogin 
            ? 'Login successful! Redirecting...'
            : 'Account created! Redirecting to login...';

        // Simulate redirect
        setTimeout(() => {
            if (this.isLogin) {
                window.location.href = '../dashboard.html';
            } else {
                window.location.href = 'login.html';
            }
        }, 1500);
    }

    /**
     * Handle social login/signup
     */
    handleSocialLogin(btn) {
        const provider = btn.textContent.trim();
        console.log(`Social login with: ${provider}`);
        
        // In real app, initiate OAuth flow
        alert(`${provider} login would be initiated here`);
    }

    /**
     * Track analytics event
     */
    trackEvent(name, data) {
        if (window.gtag) {
            gtag('event', name, data);
        }
    }
}

// Initialize auth form when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.authForm = new AuthForm();
    });
} else {
    window.authForm = new AuthForm();
}
