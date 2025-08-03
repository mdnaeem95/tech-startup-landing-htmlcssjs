/* ========================================
   FlowSync - Easter Eggs & Fun Interactions
   ======================================== */

const EasterEggs = {
    // Configuration
    config: {
        konamiCode: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'],
        secretWord: 'flowsync',
        partyDuration: 5000,
        clickCombo: 7,
        clickTimeout: 1000
    },
    
    // State
    konamiIndex: 0,
    secretIndex: 0,
    logoClicks: 0,
    clickTimer: null,
    isPartyMode: false,
    achievements: new Set(),
    
    // Initialize all easter eggs
    init() {
        this.initializeKonamiCode();
        this.initializeSecretWord();
        this.initializeLogoEasterEgg();
        this.initializeTimeBasedEggs();
        this.initializeAchievements();
        this.addEasterEggStyles();
    },
    
    // Konami Code Detection
    initializeKonamiCode() {
        document.addEventListener('keydown', (e) => {
            if (this.isPartyMode) return;
            
            if (e.key === this.config.konamiCode[this.konamiIndex]) {
                this.konamiIndex++;
                
                if (this.konamiIndex === this.config.konamiCode.length) {
                    this.activateKonamiCode();
                    this.konamiIndex = 0;
                }
            } else {
                this.konamiIndex = 0;
            }
        });
    },
    
    // Secret Word Detection
    initializeSecretWord() {
        document.addEventListener('keypress', (e) => {
            const char = e.key.toLowerCase();
            
            if (char === this.config.secretWord[this.secretIndex]) {
                this.secretIndex++;
                
                if (this.secretIndex === this.config.secretWord.length) {
                    this.activateSecretWord();
                    this.secretIndex = 0;
                }
            } else {
                this.secretIndex = 0;
            }
        });
    },
    
    // Logo Click Easter Egg
    initializeLogoEasterEgg() {
        const logo = document.querySelector('.logo');
        if (!logo) return;
        
        logo.addEventListener('click', () => {
            this.logoClicks++;
            
            // Clear previous timer
            clearTimeout(this.clickTimer);
            
            // Check for combo
            if (this.logoClicks === this.config.clickCombo) {
                this.activateLogoEasterEgg();
                this.logoClicks = 0;
            }
            
            // Reset counter after timeout
            this.clickTimer = setTimeout(() => {
                this.logoClicks = 0;
            }, this.config.clickTimeout);
        });
    },
    
    // Time-based Easter Eggs
    initializeTimeBasedEggs() {
        const now = new Date();
        const hour = now.getHours();
        const month = now.getMonth();
        const date = now.getDate();
        
        // Late night message
        if (hour >= 22 || hour < 5) {
            this.showLateNightMessage();
        }
        
        // Special dates
        if (month === 11 && date === 25) { // Christmas
            this.activateHolidayTheme('christmas');
        } else if (month === 0 && date === 1) { // New Year
            this.activateHolidayTheme('newyear');
        } else if (month === 3 && date === 1) { // April Fools
            this.activateAprilFools();
        }
    },
    
    // Achievement System
    initializeAchievements() {
        // Track various achievements
        this.trackScrollAchievement();
        this.trackThemeToggleAchievement();
        this.trackFormSubmitAchievement();
    },
    
    // Activate Konami Code
    activateKonamiCode() {
        if (this.isPartyMode) return;
        
        this.isPartyMode = true;
        this.unlockAchievement('konami-master');
        
        // Party mode!
        document.body.classList.add('party-mode');
        
        // Create disco ball
        this.createDiscoBall();
        
        // Rainbow effect
        document.body.style.animation = 'rainbow 3s linear infinite';
        
        // Confetti explosion
        this.createMassiveConfetti();
        
        // Play sound effect (if available)
        this.playSound('party');
        
        // Show message
        this.showMessage('🎉 PARTY MODE ACTIVATED! 🎉', 'rainbow');
        
        // Deactivate after duration
        setTimeout(() => {
            this.deactivatePartyMode();
        }, this.config.partyDuration);
    },
    
    // Activate Secret Word
    activateSecretWord() {
        this.unlockAchievement('word-finder');
        
        // Glow effect on all FlowSync text
        document.querySelectorAll('.logo-text, h1, h2').forEach(el => {
            el.classList.add('secret-glow');
        });
        
        // Show message
        this.showMessage('✨ You found the secret word! ✨', 'primary');
        
        // Remove effect after 3 seconds
        setTimeout(() => {
            document.querySelectorAll('.secret-glow').forEach(el => {
                el.classList.remove('secret-glow');
            });
        }, 3000);
    },
    
    // Activate Logo Easter Egg
    activateLogoEasterEgg() {
        this.unlockAchievement('logo-clicker');
        
        const logo = document.querySelector('.logo-icon');
        if (!logo) return;
        
        // Spin the logo
        logo.style.animation = 'logo-spin 1s ease-in-out';
        
        // Create mini logos
        for (let i = 0; i < 10; i++) {
            this.createMiniLogo(logo);
        }
        
        // Show message
        this.showMessage('🌀 Logo power unleashed! 🌀', 'secondary');
        
        // Reset animation
        setTimeout(() => {
            logo.style.animation = '';
        }, 1000);
    },
    
    // Create Disco Ball
    createDiscoBall() {
        const discoBall = document.createElement('div');
        discoBall.className = 'disco-ball';
        discoBall.innerHTML = '🪩';
        document.body.appendChild(discoBall);
        
        setTimeout(() => {
            discoBall.remove();
        }, this.config.partyDuration);
    },
    
    // Create Massive Confetti
    createMassiveConfetti() {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'party-confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 2 + 's';
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    confetti.remove();
                }, 5000);
            }, i * 20);
        }
    },
    
    // Create Mini Logo
    createMiniLogo(source) {
        const rect = source.getBoundingClientRect();
        const miniLogo = document.createElement('div');
        miniLogo.className = 'mini-logo';
        miniLogo.innerHTML = '◈';
        miniLogo.style.left = rect.left + rect.width / 2 + 'px';
        miniLogo.style.top = rect.top + rect.height / 2 + 'px';
        
        document.body.appendChild(miniLogo);
        
        // Random direction
        const angle = Math.random() * Math.PI * 2;
        const velocity = 200 + Math.random() * 200;
        
        miniLogo.style.setProperty('--x', Math.cos(angle) * velocity + 'px');
        miniLogo.style.setProperty('--y', Math.sin(angle) * velocity + 'px');
        
        setTimeout(() => {
            miniLogo.remove();
        }, 1000);
    },
    
    // Show Message
    showMessage(text, type = 'default') {
        const message = document.createElement('div');
        message.className = `easter-egg-message ${type}`;
        message.textContent = text;
        
        document.body.appendChild(message);
        
        // Trigger animation
        setTimeout(() => {
            message.classList.add('show');
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => {
                message.remove();
            }, 300);
        }, 3000);
    },
    
    // Show Late Night Message
    showLateNightMessage() {
        const messages = [
            "🌙 Burning the midnight oil?",
            "☕ Don't forget to take breaks!",
            "🌟 Night owl mode activated",
            "💤 Sleep is important too!"
        ];
        
        setTimeout(() => {
            this.showMessage(messages[Math.floor(Math.random() * messages.length)], 'night');
        }, 5000);
    },
    
    // Activate Holiday Theme
    activateHolidayTheme(holiday) {
        document.body.classList.add(`holiday-${holiday}`);
        
        if (holiday === 'christmas') {
            this.createSnowflakes();
            this.showMessage('🎄 Happy Holidays! 🎅', 'holiday');
        } else if (holiday === 'newyear') {
            this.createFireworks();
            this.showMessage('🎊 Happy New Year! 🎆', 'holiday');
        }
    },
    
    // Activate April Fools
    activateAprilFools() {
        // Flip the page upside down for 1 second
        document.body.style.transform = 'rotate(180deg)';
        document.body.style.transition = 'transform 1s ease';
        
        setTimeout(() => {
            document.body.style.transform = '';
            this.showMessage('😄 April Fools! 😄', 'primary');
        }, 1000);
    },
    
    // Create Snowflakes
    createSnowflakes() {
        for (let i = 0; i < 50; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.innerHTML = '❄';
            snowflake.style.left = Math.random() * 100 + '%';
            snowflake.style.animationDelay = Math.random() * 10 + 's';
            snowflake.style.fontSize = Math.random() * 10 + 10 + 'px';
            document.body.appendChild(snowflake);
        }
    },
    
    // Track Scroll Achievement
    trackScrollAchievement() {
        let maxScroll = 0;
        
        window.addEventListener('scroll', () => {
            const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            
            if (scrollPercentage > maxScroll) {
                maxScroll = scrollPercentage;
                
                if (maxScroll > 90 && !this.achievements.has('explorer')) {
                    this.unlockAchievement('explorer', '🔍 Explorer - Viewed the entire page!');
                }
            }
        });
    },
    
    // Track Theme Toggle Achievement
    trackThemeToggleAchievement() {
        let toggleCount = 0;
        
        window.addEventListener('themeChanged', () => {
            toggleCount++;
            
            if (toggleCount === 10 && !this.achievements.has('theme-switcher')) {
                this.unlockAchievement('theme-switcher', '🎨 Theme Switcher - Toggled theme 10 times!');
            }
        });
    },
    
    // Track Form Submit Achievement
    trackFormSubmitAchievement() {
        const emailForm = document.getElementById('email-form');
        if (!emailForm) return;
        
        emailForm.addEventListener('submit', () => {
            if (!this.achievements.has('early-adopter')) {
                this.unlockAchievement('early-adopter', '🚀 Early Adopter - Signed up for the trial!');
            }
        });
    },
    
    // Unlock Achievement
    unlockAchievement(id, message) {
        if (this.achievements.has(id)) return;
        
        this.achievements.add(id);
        
        // Show achievement notification
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">🏆</div>
            <div class="achievement-text">
                <div class="achievement-title">Achievement Unlocked!</div>
                <div class="achievement-message">${message || id}</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
        
        // Save to localStorage
        this.saveAchievements();
    },
    
    // Save achievements to localStorage
    saveAchievements() {
        localStorage.setItem('flowsync-achievements', JSON.stringify([...this.achievements]));
    },
    
    // Load achievements from localStorage
    loadAchievements() {
        const saved = localStorage.getItem('flowsync-achievements');
        if (saved) {
            this.achievements = new Set(JSON.parse(saved));
        }
    },
    
    // Play sound effect
    playSound(type) {
        // Implementation depends on having audio files
        // This is a placeholder for future enhancement
    },
    
    // Deactivate party mode
    deactivatePartyMode() {
        this.isPartyMode = false;
        document.body.classList.remove('party-mode');
        document.body.style.animation = '';
    },
    
    // Add Easter Egg Styles
    addEasterEggStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Easter Egg Messages */
            .easter-egg-message {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%) translateY(-100px);
                background: var(--surface);
                color: var(--text-primary);
                padding: 1rem 2rem;
                border-radius: 50px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                font-weight: 600;
                z-index: 10000;
                transition: transform 0.3s var(--ease-spring);
            }
            
            .easter-egg-message.show {
                transform: translateX(-50%) translateY(0);
            }
            
            .easter-egg-message.rainbow {
                background: linear-gradient(45deg, #ff0000, #ff7700, #ffdd00, #00ff00, #0099ff, #6633ff);
                color: white;
                animation: rainbow 3s linear infinite;
            }
            
            .easter-egg-message.primary {
                background: var(--gradient-primary);
                color: white;
            }
            
            .easter-egg-message.secondary {
                background: var(--secondary);
                color: white;
            }
            
            .easter-egg-message.night {
                background: #1a1a2e;
                color: #eee;
            }
            
            /* Party Mode */
            .party-mode {
                animation: party-shake 0.5s infinite;
            }
            
            @keyframes party-shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-2px) rotate(-1deg); }
                75% { transform: translateX(2px) rotate(1deg); }
            }
            
            /* Disco Ball */
            .disco-ball {
                position: fixed;
                top: 50px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 100px;
                z-index: 9999;
                animation: disco-spin 2s linear infinite;
            }
            
            @keyframes disco-spin {
                from { transform: translateX(-50%) rotate(0deg); }
                to { transform: translateX(-50%) rotate(360deg); }
            }
            
            /* Party Confetti */
            .party-confetti {
                position: fixed;
                top: -10px;
                width: 10px;
                height: 10px;
                z-index: 9999;
                animation: confetti-fall 5s linear forwards;
            }
            
            @keyframes confetti-fall {
                to {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
            
            /* Secret Glow */
            .secret-glow {
                animation: secret-glow-pulse 2s ease-in-out infinite;
            }
            
            @keyframes secret-glow-pulse {
                0%, 100% {
                    filter: drop-shadow(0 0 10px var(--primary));
                }
                50% {
                    filter: drop-shadow(0 0 30px var(--primary));
                }
            }
            
            /* Logo Spin */
            @keyframes logo-spin {
                from { transform: rotate(0deg) scale(1); }
                50% { transform: rotate(180deg) scale(1.2); }
                to { transform: rotate(360deg) scale(1); }
            }
            
            /* Mini Logo */
            .mini-logo {
                position: fixed;
                color: var(--primary);
                font-size: 20px;
                pointer-events: none;
                z-index: 9999;
                animation: mini-logo-fly 1s ease-out forwards;
            }
            
            @keyframes mini-logo-fly {
                to {
                    transform: translate(var(--x), var(--y)) scale(0);
                    opacity: 0;
                }
            }
            
            /* Achievement Notification */
            .achievement-notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: var(--surface);
                border-radius: 12px;
                padding: 1rem;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                display: flex;
                align-items: center;
                gap: 1rem;
                transform: translateX(400px);
                transition: transform 0.3s var(--ease-spring);
                z-index: 10000;
            }
            
            .achievement-notification.show {
                transform: translateX(0);
            }
            
            .achievement-icon {
                font-size: 2rem;
            }
            
            .achievement-title {
                font-weight: 700;
                color: var(--text-primary);
            }
            
            .achievement-message {
                font-size: 0.875rem;
                color: var(--text-secondary);
            }
            
            /* Snowflakes */
            .snowflake {
                position: fixed;
                top: -20px;
                color: white;
                user-select: none;
                pointer-events: none;
                animation: snowfall 10s linear infinite;
                z-index: 9999;
            }
            
            @keyframes snowfall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                }
            }
            
            /* Holiday Themes */
            .holiday-christmas {
                --primary: #c41e3a;
                --secondary: #165b33;
            }
            
            .holiday-newyear {
                --primary: #ffd700;
                --secondary: #c0c0c0;
            }
        `;
        document.head.appendChild(style);
    }
};

// Export for use in other modules
window.EasterEggs = EasterEggs;