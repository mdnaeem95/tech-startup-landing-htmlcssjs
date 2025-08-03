/* ========================================
   FlowSync - Form Handler
   ======================================== */

const FormHandler = {
    // Configuration
    config: {
        emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        successDuration: 3000,
        confettiCount: 50,
        confettiColors: ['#5b67f5', '#00d4ff', '#ff6b6b', '#00d68f', '#ffaa00']
    },
    
    // State
    forms: new Map(),
    
    // Initialize form handling
    init() {
        this.initializeEmailForm();
        this.initializeContactForms();
        this.addFormStyles();
    },
    
    // Initialize main email capture form
    initializeEmailForm() {
        const emailForm = document.getElementById('email-form');
        if (!emailForm) return;
        
        const emailInput = emailForm.querySelector('.email-input');
        const submitButton = emailForm.querySelector('.btn');
        
        if (!emailInput || !submitButton) return;
        
        // Store form elements
        this.forms.set('email-form', {
            form: emailForm,
            input: emailInput,
            button: submitButton,
            originalButtonText: submitButton.textContent
        });
        
        // Add event listeners
        emailForm.addEventListener('submit', (e) => this.handleEmailSubmit(e));
        emailInput.addEventListener('input', (e) => this.handleInputChange(e));
        emailInput.addEventListener('blur', (e) => this.handleInputBlur(e));
    },
    
    // Initialize other contact forms
    initializeContactForms() {
        // Initialize any other forms on the page
        const contactForms = document.querySelectorAll('form[data-form-type="contact"]');
        
        contactForms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleContactSubmit(e));
        });
    },
    
    // Handle email form submission
    handleEmailSubmit(e) {
        e.preventDefault();
        
        const formData = this.forms.get('email-form');
        if (!formData) return;
        
        const { input, button } = formData;
        const email = input.value.trim();
        
        // Validate email
        if (!this.validateEmail(email)) {
            this.showError(input, 'Please enter a valid email address');
            return;
        }
        
        // Show success state
        this.showSuccess(formData);
        
        // Simulate API call
        this.submitToAPI(email).then(() => {
            // Create confetti effect
            this.createConfetti(button);
            
            // Reset form after delay
            setTimeout(() => {
                this.resetForm(formData);
            }, this.config.successDuration);
        });
    },
    
    // Handle contact form submission
    handleContactSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate all fields
        const errors = this.validateContactForm(data);
        
        if (Object.keys(errors).length > 0) {
            this.showFormErrors(form, errors);
            return;
        }
        
        // Submit form
        this.submitContactForm(form, data);
    },
    
    // Handle input change
    handleInputChange(e) {
        const input = e.target;
        
        // Remove error state on input
        if (input.classList.contains('error')) {
            input.classList.remove('error');
            input.style.borderColor = '';
            
            const errorMessage = input.parentElement.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        }
    },
    
    // Handle input blur
    handleInputBlur(e) {
        const input = e.target;
        const value = input.value.trim();
        
        if (value && !this.validateEmail(value)) {
            this.showError(input, 'Please enter a valid email address');
        }
    },
    
    // Validate email
    validateEmail(email) {
        return this.config.emailRegex.test(email);
    },
    
    // Validate contact form
    validateContactForm(data) {
        const errors = {};
        
        // Check required fields
        if (!data.name || data.name.trim().length < 2) {
            errors.name = 'Name must be at least 2 characters';
        }
        
        if (!data.email || !this.validateEmail(data.email)) {
            errors.email = 'Please enter a valid email address';
        }
        
        if (!data.message || data.message.trim().length < 10) {
            errors.message = 'Message must be at least 10 characters';
        }
        
        return errors;
    },
    
    // Show error state
    showError(input, message) {
        input.classList.add('error');
        input.style.borderColor = 'var(--error)';
        
        // Add shake animation
        input.classList.add('shake');
        setTimeout(() => {
            input.classList.remove('shake');
        }, 500);
        
        // Show error message
        if (message) {
            const errorEl = document.createElement('div');
            errorEl.className = 'error-message';
            errorEl.textContent = message;
            
            // Remove existing error message
            const existingError = input.parentElement.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            
            input.parentElement.appendChild(errorEl);
        }
    },
    
    // Show form errors
    showFormErrors(form, errors) {
        Object.entries(errors).forEach(([field, message]) => {
            const input = form.querySelector(`[name="${field}"]`);
            if (input) {
                this.showError(input, message);
            }
        });
    },
    
    // Show success state
    showSuccess(formData) {
        const { input, button } = formData;
        
        // Update button
        button.textContent = '✓ Check your email!';
        button.style.background = 'var(--success)';
        button.disabled = true;
        
        // Update input
        input.style.borderColor = 'var(--success)';
        input.disabled = true;
    },
    
    // Reset form
    resetForm(formData) {
        const { form, input, button, originalButtonText } = formData;
        
        // Reset button
        button.textContent = originalButtonText;
        button.style.background = '';
        button.disabled = false;
        
        // Reset input
        input.value = '';
        input.style.borderColor = '';
        input.disabled = false;
        
        // Focus input
        input.focus();
    },
    
    // Create confetti effect
    createConfetti(element) {
        const rect = element.getBoundingClientRect();
        const container = element.closest('section') || document.body;
        
        for (let i = 0; i < this.config.confettiCount; i++) {
            this.createConfettiParticle(container, rect, i);
        }
    },
    
    // Create single confetti particle
    createConfettiParticle(container, rect, index) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Random properties
        const color = this.config.confettiColors[Math.floor(Math.random() * this.config.confettiColors.length)];
        const size = Math.random() * 10 + 5;
        const isSquare = Math.random() > 0.5;
        
        // Set styles
        confetti.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            border-radius: ${isSquare ? '0' : '50%'};
            pointer-events: none;
            z-index: 1000;
        `;
        
        container.appendChild(confetti);
        
        // Animate
        const angle = (Math.PI * 2 * index) / this.config.confettiCount;
        const velocity = 10 + Math.random() * 10;
        const rotateSpeed = Math.random() * 10 - 5;
        
        let x = 0;
        let y = 0;
        let opacity = 1;
        let rotation = 0;
        
        const animate = () => {
            x += Math.cos(angle) * velocity;
            y += Math.sin(angle) * velocity + 2;
            opacity -= 0.02;
            rotation += rotateSpeed;
            
            confetti.style.transform = `translate(${x - size/2}px, ${y - size/2}px) rotate(${rotation}deg)`;
            confetti.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                confetti.remove();
            }
        };
        
        requestAnimationFrame(animate);
    },
    
    // Simulate API submission
    async submitToAPI(email) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Email submitted:', email);
                resolve({ success: true });
            }, 500);
        });
    },
    
    // Submit contact form
    async submitContactForm(form, data) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Show success
            submitButton.textContent = '✓ Sent!';
            submitButton.style.background = 'var(--success)';
            
            // Reset form
            setTimeout(() => {
                form.reset();
                submitButton.textContent = originalText;
                submitButton.style.background = '';
                submitButton.disabled = false;
            }, 3000);
            
        } catch (error) {
            // Show error
            submitButton.textContent = 'Error - Try Again';
            submitButton.style.background = 'var(--error)';
            submitButton.disabled = false;
            
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.style.background = '';
            }, 3000);
        }
    },
    
    // Add form-specific styles
    addFormStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .error-message {
                color: var(--error);
                font-size: 0.875rem;
                margin-top: 0.5rem;
                display: flex;
                align-items: center;
                gap: 0.25rem;
            }
            
            .error-message::before {
                content: '⚠';
                font-size: 1rem;
            }
            
            input.error {
                animation: shake 0.5s ease;
            }
            
            .confetti {
                transition: none !important;
            }
        `;
        document.head.appendChild(style);
    }
};

// Export for use in other modules
window.FormHandler = FormHandler;