/* ========================================
   FlowSync - Theme Manager
   ======================================== */

const ThemeManager = {
    // Configuration
    config: {
        storageKey: 'flowsync-theme',
        defaultTheme: 'light',
        transitionDuration: 600
    },
    
    // State
    currentTheme: null,
    toggle: null,
    sunIcon: null,
    moonIcon: null,
    
    // Initialize theme system
    init() {
        this.toggle = document.querySelector('.theme-toggle');
        this.sunIcon = document.querySelector('.sun-icon');
        this.moonIcon = document.querySelector('.moon-icon');
        
        if (!this.toggle) return;
        
        // Get saved theme or use default
        this.currentTheme = this.getSavedTheme();
        
        // Apply initial theme
        this.applyTheme(this.currentTheme);
        
        // Bind events
        this.bindEvents();
        
        // Watch for system theme changes
        this.watchSystemTheme();
    },
    
    // Get saved theme from localStorage
    getSavedTheme() {
        const saved = localStorage.getItem(this.config.storageKey);
        
        // If no saved theme, check system preference
        if (!saved) {
            return this.getSystemTheme();
        }
        
        return saved;
    },
    
    // Get system theme preference
    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    },
    
    // Apply theme to document
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        this.updateIcons(theme);
        
        // Update meta theme color
        this.updateMetaThemeColor(theme);
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme } 
        }));
    },
    
    // Update theme toggle icons
    updateIcons(theme) {
        if (!this.sunIcon || !this.moonIcon) return;
        
        if (theme === 'dark') {
            this.sunIcon.style.transform = 'scale(0) rotate(180deg)';
            this.moonIcon.style.transform = 'scale(1) rotate(0deg)';
        } else {
            this.sunIcon.style.transform = 'scale(1) rotate(0deg)';
            this.moonIcon.style.transform = 'scale(0) rotate(-180deg)';
        }
    },
    
    // Update meta theme color for mobile browsers
    updateMetaThemeColor(theme) {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (metaThemeColor) {
            metaThemeColor.content = theme === 'dark' ? '#0a0e27' : '#fafbff';
        } else {
            // Create meta tag if it doesn't exist
            const meta = document.createElement('meta');
            meta.name = 'theme-color';
            meta.content = theme === 'dark' ? '#0a0e27' : '#fafbff';
            document.head.appendChild(meta);
        }
    },
    
    // Toggle between light and dark theme
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        this.saveTheme(newTheme);
        
        // Add ripple effect
        this.addRippleEffect();
    },
    
    // Save theme preference
    saveTheme(theme) {
        localStorage.setItem(this.config.storageKey, theme);
    },
    
    // Add ripple effect on theme change
    addRippleEffect() {
        const ripple = document.createElement('div');
        ripple.className = 'theme-ripple';
        
        const rect = this.toggle.getBoundingClientRect();
        ripple.style.left = rect.left + rect.width / 2 + 'px';
        ripple.style.top = rect.top + rect.height / 2 + 'px';
        
        document.body.appendChild(ripple);
        
        // Force reflow
        ripple.offsetHeight;
        
        ripple.style.transform = 'scale(100)';
        ripple.style.opacity = '0';
        
        setTimeout(() => {
            ripple.remove();
        }, this.config.transitionDuration);
    },
    
    // Bind event listeners
    bindEvents() {
        // Theme toggle click
        this.toggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Keyboard accessibility
        this.toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    },
    
    // Watch for system theme changes
    watchSystemTheme() {
        if (!window.matchMedia) return;
        
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        mediaQuery.addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference
            if (!localStorage.getItem(this.config.storageKey)) {
                const newTheme = e.matches ? 'dark' : 'light';
                this.applyTheme(newTheme);
            }
        });
    },
    
    // Public API
    getTheme() {
        return this.currentTheme;
    },
    
    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.applyTheme(theme);
            this.saveTheme(theme);
        }
    }
};

// Add ripple effect styles
const style = document.createElement('style');
style.textContent = `
    .theme-ripple {
        position: fixed;
        width: 20px;
        height: 20px;
        background: var(--primary);
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(0);
        opacity: 0.5;
        pointer-events: none;
        transition: transform ${ThemeManager.config.transitionDuration}ms ease-out, 
                    opacity ${ThemeManager.config.transitionDuration}ms ease-out;
        z-index: 9999;
    }
`;
document.head.appendChild(style);

// Export for use in other modules
window.ThemeManager = ThemeManager;