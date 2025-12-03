/* ============================================
   THEME.JS - Theme Management
   ============================================ */

class ThemeManager {
    constructor() {
        this.themeKey = 'flux-theme';
        this.themes = ['eyecare', 'dark', 'high-contrast'];
        this.currentTheme = this.loadTheme();
        this.init();
    }

    /**
     * Initialize theme manager
     */
    init() {
        this.applyTheme(this.currentTheme);
        this.setupEventListeners();
        this.setupSystemPreferenceListener();
    }

    /**
     * Load theme from localStorage or use system preference
     */
    loadTheme() {
        // Check localStorage first
        const savedTheme = localStorage.getItem(this.themeKey);
        if (savedTheme && this.themes.includes(savedTheme)) {
            return savedTheme;
        }

        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        // Default to eyecare theme
        return 'eyecare';
    }

    /**
     * Apply theme to document
     */
    applyTheme(theme) {
        if (!this.themes.includes(theme)) {
            console.warn(`Theme "${theme}" not found. Using eyecare.`);
            theme = 'eyecare';
        }

        // Remove all theme classes
        this.themes.forEach(t => {
            document.body.classList.remove(`${t}-theme`);
        });

        // Apply new theme
        document.body.classList.add(`${theme}-theme`);
        this.currentTheme = theme;

        // Save to localStorage
        localStorage.setItem(this.themeKey, theme);

        // Update meta theme color
        this.updateMetaThemeColor();

        // Emit custom event
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }

    /**
     * Update meta theme-color tag
     */
    updateMetaThemeColor() {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            const colors = {
                eyecare: '#e8f5f0',
                dark: '#0f1419',
                'high-contrast': '#000000'
            };
            metaThemeColor.setAttribute('content', colors[this.currentTheme]);
        }
    }

    /**
     * Toggle between themes
     */
    toggleTheme() {
        const themeIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (themeIndex + 1) % this.themes.length;
        this.applyTheme(this.themes[nextIndex]);
        this.updateThemeToggleIcon();
    }

    /**
     * Set specific theme
     */
    setTheme(theme) {
        if (this.themes.includes(theme)) {
            this.applyTheme(theme);
            this.updateThemeToggleIcon();
        }
    }

    /**
     * Get current theme
     */
    getTheme() {
        return this.currentTheme;
    }

    /**
     * Update theme toggle button icon
     */
    updateThemeToggleIcon() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        const icons = {
            eyecare: '👁️‍🗨️',
            dark: '🌙',
            'high-contrast': '☀️'
        };

        const nextThemeIndex = (this.themes.indexOf(this.currentTheme) + 1) % this.themes.length;
        const nextTheme = this.themes[nextThemeIndex];
        
        const iconElement = themeToggle.querySelector('.theme-icon');
        if (iconElement) {
            iconElement.textContent = icons[nextTheme];
        }
    }

    /**
     * Setup event listeners for theme toggle
     */
    setupEventListeners() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
            this.updateThemeToggleIcon();
        }
    }

    /**
     * Listen to system preference changes
     */
    setupSystemPreferenceListener() {
        if (!window.matchMedia) return;

        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        darkModeQuery.addEventListener('change', (e) => {
            // Only apply system preference if user hasn't manually selected a theme
            if (!localStorage.getItem(this.themeKey)) {
                this.applyTheme(e.matches ? 'dark' : 'eyecare');
            }
        });
    }
}

// Initialize theme manager when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.themeManager = new ThemeManager();
    });
} else {
    window.themeManager = new ThemeManager();
}
