/* ========================================
   FlowSync - Main JavaScript
   ======================================== */

// Initialize all modules when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize modules
    initializeApp();
});

// Main app initialization
function initializeApp() {
    // Core functionality
    initializeLoader();
    initializeHeader();
    initializeSmoothScroll();
    initializeMobileMenu();
    initializeCursor();
    
    // Import and initialize other modules
    if (window.ThemeManager) {
        window.ThemeManager.init();
    }
    
    if (window.AnimationManager) {
        window.AnimationManager.init();
    }
    
    if (window.FormHandler) {
        window.FormHandler.init();
    }
    
    if (window.EasterEggs) {
        window.EasterEggs.init();
    }
}

// Loading Screen
function initializeLoader() {
    const loader = document.querySelector('.loading');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            // Trigger initial animations after loader
            if (window.AnimationManager) {
                window.AnimationManager.triggerHeroAnimations();
            }
        }, 800);
    });
}

// Header Scroll Effects
function initializeHeader() {
    const header = document.querySelector('header');
    const progressIndicator = document.querySelector('.progress-indicator');
    let lastScroll = 0;
    
    function updateHeader() {
        const currentScroll = window.scrollY;
        
        // Add scrolled class
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }
    
    function updateProgress() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPosition = window.scrollY;
        const progress = (scrollPosition / scrollHeight) * 100;
        progressIndicator.style.width = progress + '%';
    }
    
    // Throttled scroll handler
    window.addEventListener('scroll', throttle(() => {
        updateHeader();
        updateProgress();
    }, 50));
}

// Smooth Scroll for Navigation Links
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const offset = 80;
                const targetPosition = target.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const mobileToggle = document.querySelector('.mobile-toggle');
                const navLinks = document.querySelector('.nav-links');
                
                if (mobileToggle.classList.contains('active')) {
                    mobileToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                }
            }
        });
    });
}

// Mobile Menu Toggle
function initializeMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!mobileToggle || !navLinks) return;
    
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav') && navLinks.classList.contains('active')) {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Custom Cursor (Desktop only)
function initializeCursor() {
    if (window.innerWidth <= 1024) return;
    
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (!cursor || !cursorFollower) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Direct cursor position
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
        cursor.style.opacity = '1';
        cursorFollower.style.opacity = '1';
    });
    
    // Smooth follower animation
    function animateFollower() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateFollower);
    }
    
    animateFollower();
    
    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .feature-card, .pricing-card, input, textarea');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorFollower.style.opacity = '0';
    });
}

// Utility Functions
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// CTA Button Special Effect
document.addEventListener('DOMContentLoaded', function() {
    const ctaButtons = document.querySelectorAll('.btn');
    
    ctaButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });
});

// Start Trial Button - Scroll to CTA
document.addEventListener('DOMContentLoaded', function() {
    const startTrialBtn = document.getElementById('start-trial-btn');
    const emailInput = document.querySelector('.email-input');
    
    if (startTrialBtn && emailInput) {
        startTrialBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const ctaSection = document.querySelector('.cta');
            const offset = 80;
            const targetPosition = ctaSection.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Focus email input after scroll
            setTimeout(() => {
                emailInput.focus();
                emailInput.style.boxShadow = '0 0 0 4px rgba(91, 103, 245, 0.2)';
                setTimeout(() => {
                    emailInput.style.boxShadow = '';
                }, 2000);
            }, 800);
        });
    }
});

// Export utilities for other modules
window.FlowSyncUtils = {
    throttle,
    debounce
};