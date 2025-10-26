// Contact Nuevo JavaScript - Fluffy Bites

document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    // Input elements
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const subjectSelect = document.getElementById('subject');
    const messageTextarea = document.getElementById('message');
    
    // Error elements
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const subjectError = document.getElementById('subjectError');
    const messageError = document.getElementById('messageError');
    
    // FAQ elements
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Validation patterns
    const patterns = {
        name: /^[a-zA-ZÀ-ÿ\s]{2,50}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[\+]?[0-9\s\-\(\)]{10,20}$/,
        message: /^.{10,1000}$/
    };
    
    // Error messages
    const errorMessages = {
        name: 'El nombre debe tener entre 2 y 50 caracteres',
        email: 'Por favor ingresa un email válido',
        phone: 'Por favor ingresa un número de teléfono válido',
        subject: 'Por favor selecciona un asunto',
        message: 'El mensaje debe tener entre 10 y 1000 caracteres'
    };
    
    // Initialize
    init();
    
    function init() {
        setupFormValidation();
        setupFAQ();
        setupAnimations();
        setupFormSubmission();
    }
    
    // Form validation setup
    function setupFormValidation() {
        // Real-time validation
        nameInput.addEventListener('blur', () => validateField('name', nameInput, nameError));
        emailInput.addEventListener('blur', () => validateField('email', emailInput, emailError));
        phoneInput.addEventListener('blur', () => validateField('phone', phoneInput, phoneError));
        subjectSelect.addEventListener('change', () => validateField('subject', subjectSelect, subjectError));
        messageTextarea.addEventListener('blur', () => validateField('message', messageTextarea, messageError));
        
        // Clear errors on input
        nameInput.addEventListener('input', () => clearError(nameError));
        emailInput.addEventListener('input', () => clearError(emailError));
        phoneInput.addEventListener('input', () => clearError(phoneError));
        subjectSelect.addEventListener('change', () => clearError(subjectError));
        messageTextarea.addEventListener('input', () => clearError(messageError));
    }
    
    // Validate individual field
    function validateField(fieldName, input, errorElement) {
        const value = input.value.trim();
        let isValid = true;
        
        // Required field validation
        if (fieldName === 'subject') {
            isValid = value !== '';
        } else if (fieldName === 'phone') {
            // Phone is optional, but if provided, must be valid
            isValid = value === '' || patterns[fieldName].test(value);
        } else {
            isValid = value !== '' && patterns[fieldName].test(value);
        }
        
        if (!isValid) {
            showError(errorElement, errorMessages[fieldName]);
            input.style.borderColor = 'var(--error-red)';
            input.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
        } else {
            clearError(errorElement);
            input.style.borderColor = 'var(--success-green)';
            input.style.backgroundColor = 'rgba(16, 185, 129, 0.05)';
        }
        
        return isValid;
    }
    
    // Show error message
    function showError(errorElement, message) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    // Clear error message
    function clearError(errorElement) {
        errorElement.classList.remove('show');
        errorElement.textContent = '';
    }
    
    // Validate entire form
    function validateForm() {
        const fields = [
            { name: 'name', input: nameInput, error: nameError },
            { name: 'email', input: emailInput, error: emailError },
            { name: 'phone', input: phoneInput, error: phoneError },
            { name: 'subject', input: subjectSelect, error: subjectError },
            { name: 'message', input: messageTextarea, error: messageError }
        ];
        
        let isFormValid = true;
        
        fields.forEach(field => {
            const isValid = validateField(field.name, field.input, field.error);
            if (!isValid) {
                isFormValid = false;
            }
        });
        
        return isFormValid;
    }
    
    // Setup form submission
    function setupFormSubmission() {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Clear previous messages
            hideMessages();
            
            // Validate form
            if (!validateForm()) {
                showError(errorMessage, 'Por favor corrige los errores en el formulario');
                shakeForm();
                return;
            }
            
            // Show loading state
            setLoadingState(true);
            
            try {
                // Simulate form submission (replace with actual submission logic)
                await submitForm();
                
                // Show success message
                showSuccessMessage();
                
                // Reset form
                resetForm();
                
            } catch (error) {
                console.error('Form submission error:', error);
                showErrorMessage();
            } finally {
                setLoadingState(false);
            }
        });
    }
    
    // Submit form (replace with actual submission logic)
    async function submitForm() {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random success/failure for demo
                if (Math.random() > 0.1) { // 90% success rate
                    resolve();
                } else {
                    reject(new Error('Submission failed'));
                }
            }, 2000);
        });
    }
    
    // Set loading state
    function setLoadingState(loading) {
        if (loading) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        } else {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }
    
    // Show success message
    function showSuccessMessage() {
        successMessage.classList.add('show');
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Hide after 5 seconds
        setTimeout(() => {
            hideMessages();
        }, 5000);
    }
    
    // Show error message
    function showErrorMessage() {
        errorMessage.classList.add('show');
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Hide after 5 seconds
        setTimeout(() => {
            hideMessages();
        }, 5000);
    }
    
    // Hide all messages
    function hideMessages() {
        successMessage.classList.remove('show');
        errorMessage.classList.remove('show');
    }
    
    // Reset form
    function resetForm() {
        contactForm.reset();
        
        // Clear all errors
        [nameError, emailError, phoneError, subjectError, messageError].forEach(clearError);
        
        // Reset input styles
        [nameInput, emailInput, phoneInput, subjectSelect, messageTextarea].forEach(input => {
            input.style.borderColor = '';
            input.style.backgroundColor = '';
        });
    }
    
    // Shake form animation
    function shakeForm() {
        const formContainer = document.querySelector('.form-container');
        formContainer.style.animation = 'shake 0.5s ease-in-out';
        
        setTimeout(() => {
            formContainer.style.animation = '';
        }, 500);
    }
    
    // Setup FAQ functionality
    function setupFAQ() {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                } else {
                    item.classList.add('active');
                }
            });
            
            // Keyboard accessibility
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        });
    }
    
    // Setup animations
    function setupAnimations() {
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                }
            });
        }, observerOptions);
        
        // Observe elements
        const animatedElements = document.querySelectorAll('.info-card, .form-container, .faq-item');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            observer.observe(el);
        });
    }
    
    // Phone number formatting
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            if (value.length <= 3) {
                value = value;
            } else if (value.length <= 6) {
                value = value.slice(0, 3) + ' ' + value.slice(3);
            } else if (value.length <= 10) {
                value = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6);
            } else {
                value = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6, 10);
            }
        }
        
        e.target.value = value;
    });
    
    // Character counter for message
    messageTextarea.addEventListener('input', function(e) {
        const maxLength = 1000;
        const currentLength = e.target.value.length;
        
        // Update character count (if you want to add a counter)
        // You can add a character counter element to show current/max length
        
        if (currentLength > maxLength) {
            e.target.value = e.target.value.slice(0, maxLength);
        }
    });
    
    // Auto-resize textarea
    messageTextarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });
    
    // Form field focus effects
    const formInputs = document.querySelectorAll('.input-container input, .input-container select, .input-container textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading animation to submit button
    submitBtn.addEventListener('click', function() {
        if (!this.disabled) {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        }
    });
    
    // Initialize tooltips (if you want to add them)
    function initTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', showTooltip);
            element.addEventListener('mouseleave', hideTooltip);
        });
    }
    
    function showTooltip(e) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = e.target.dataset.tooltip;
        document.body.appendChild(tooltip);
        
        const rect = e.target.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    }
    
    function hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }
    
    // Initialize tooltips
    initTooltips();
    
    // Add CSS for tooltips
    const tooltipStyle = document.createElement('style');
    tooltipStyle.textContent = `
        .tooltip {
            position: absolute;
            background: var(--text-dark);
            color: var(--accent-white);
            padding: 0.5rem 1rem;
            border-radius: 4px;
            font-size: 0.875rem;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            animation: fadeIn 0.2s ease-out forwards;
        }
        
        @keyframes fadeIn {
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(tooltipStyle);
    
    console.log('Contact form initialized successfully!');
});
