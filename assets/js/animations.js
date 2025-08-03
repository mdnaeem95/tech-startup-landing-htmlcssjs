/* ========================================
   FlowSync - Animation Manager
   ======================================== */

const AnimationManager = {
    // Configuration
    config: {
        observerThreshold: 0.1,
        observerRootMargin: '-50px',
        staggerDelay: 100,
        countDuration: 2000
    },
    
    // State
    observers: [],
    animatedElements: new Set(),
    
    // Initialize all animations
    init() {
        this.initializeObservers();
        this.initializeCounters();
        this.initializePricingToggle();
        this.initializeFAQ();
        this.initializeProgressBars();
        this.initializeParallax();
    },
    
    // Trigger hero animations (called after loader)
    triggerHeroAnimations() {
        // Hero animations are CSS-based and triggered automatically
        // This method can be used for additional JS-based animations
    },
    
    // Initialize Intersection Observers
    initializeObservers() {
        // Options for different types of animations
        const fadeInOptions = {
            threshold: this.config.observerThreshold,
            rootMargin: this.config.observerRootMargin
        };
        
        // Feature cards observer
        this.createObserver('.feature-card', fadeInOptions, (entry, index) => {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * this.config.staggerDelay);
        });
        
        // Pricing cards observer
        this.createObserver('.pricing-card', fadeInOptions, (entry, index) => {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * this.config.staggerDelay);
        });
        
        // Testimonial cards observer
        this.createObserver('.testimonial-card', fadeInOptions, (entry) => {
            entry.target.classList.add('visible');
        });
        
        // Dashboard preview observer
        this.createObserver('.dashboard', { threshold: 0.5 }, (entry) => {
            const progressFills = entry.target.querySelectorAll('.progress-fill');
            progressFills.forEach((fill, index) => {
                setTimeout(() => {
                    fill.style.width = fill.getAttribute('data-width') || fill.style.width;
                }, index * 200);
            });
        });
    },
    
    // Create and setup an intersection observer
    createObserver(selector, options, callback) {
        const elements = document.querySelectorAll(selector);
        if (!elements.length) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animatedElements.add(entry.target);
                    callback(entry, index);
                    
                    // Optionally unobserve after animation
                    if (!entry.target.hasAttribute('data-repeat-animation')) {
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, options);
        
        elements.forEach(el => observer.observe(el));
        this.observers.push(observer);
    },
    
    // Initialize number counters
    initializeCounters() {
        const counters = document.querySelectorAll('.stat-number');
        if (!counters.length) return;
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.hasAttribute('data-counted')) {
                    entry.target.setAttribute('data-counted', 'true');
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => counterObserver.observe(counter));
    },
    
    // Animate a counter element
    animateCounter(element) {
        const target = parseFloat(element.getAttribute('data-count'));
        const duration = this.config.countDuration;
        const isDecimal = target % 1 !== 0;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const updateCounter = () => {
            current += increment;
            
            if (current < target) {
                if (isDecimal) {
                    element.textContent = current.toFixed(1);
                } else {
                    element.textContent = Math.floor(current) + this.getCounterSuffix(element);
                }
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = isDecimal ? target.toFixed(1) : target + this.getCounterSuffix(element);
            }
        };
        
        updateCounter();
    },
    
    // Get counter suffix based on context
    getCounterSuffix(element) {
        const label = element.nextElementSibling?.textContent || '';
        if (label.includes('Productivity')) return '%';
        if (label.includes('Support')) return '/7';
        return '';
    },
    
    // Initialize pricing toggle
    initializePricingToggle() {
        const toggle = document.getElementById('pricing-toggle');
        const priceElements = document.querySelectorAll('.price-value');
        
        if (!toggle || !priceElements.length) return;
        
        const prices = {
            monthly: ['19', '49', 'Custom'],
            yearly: ['15', '39', 'Custom']
        };
        
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            const isYearly = toggle.classList.contains('active');
            
            priceElements.forEach((priceEl, index) => {
                if (priceEl.textContent !== 'Custom') {
                    this.animatePriceChange(priceEl, isYearly ? prices.yearly[index] : prices.monthly[index]);
                }
            });
        });
    },
    
    // Animate price change
    animatePriceChange(element, newPrice) {
        element.style.transform = 'scale(0.8)';
        element.style.opacity = '0.5';
        
        setTimeout(() => {
            element.textContent = newPrice;
            element.style.transform = 'scale(1)';
            element.style.opacity = '1';
        }, 150);
    },
    
    // Initialize FAQ accordion
    initializeFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (!question || !answer) return;
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                
                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                    
                    // Smooth height animation
                    const answerContent = answer.querySelector('.faq-answer-content');
                    if (answerContent) {
                        answer.style.maxHeight = answerContent.scrollHeight + 'px';
                    }
                } else {
                    answer.style.maxHeight = '0';
                }
            });
        });
    },
    
    // Initialize progress bars in dashboard
    initializeProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        
        progressBars.forEach(bar => {
            // Store original width
            bar.setAttribute('data-width', bar.style.width);
            bar.style.width = '0';
        });
    },
    
    // Initialize parallax effects
    initializeParallax() {
        const parallaxElements = document.querySelectorAll('.shape');
        if (!parallaxElements.length) return;
        
        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.2);
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick);
    },
    
    // Cleanup method
    destroy() {
        // Disconnect all observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
        this.animatedElements.clear();
    }
};

// Export for use in other modules
window.AnimationManager = AnimationManager;