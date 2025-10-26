// Contact Modern JavaScript - Fluffy Bites

document.addEventListener('DOMContentLoaded', function() {
    initializeContactPage();
});

function initializeContactPage() {
    initializeFormValidation();
    initializeFormSubmission();
    initializeFAQ();
    initializeScrollEffects();
    initializeAnimations();
    initializeAccessibility();
    initializeMapInteraction();
}

// Form Validation
function initializeFormValidation() {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Real-time validation
        input.addEventListener('input', validateField);
        input.addEventListener('blur', validateField);
        
        // Clear validation on focus
        input.addEventListener('focus', clearFieldValidation);
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    
    clearFieldValidation(e);
    
    if (field.hasAttribute('required') && !value) {
        setFieldError(field, 'Este campo es obligatorio');
        return false;
    }
    
    if (value) {
        switch (fieldType) {
            case 'email':
                if (!isValidEmail(value)) {
                    setFieldError(field, 'Por favor, ingresa un email válido');
                    return false;
                }
                break;
            case 'tel':
                if (!isValidPhone(value)) {
                    setFieldError(field, 'Por favor, ingresa un teléfono válido');
                    return false;
                }
                break;
            case 'text':
                if (fieldName === 'firstName' || fieldName === 'lastName') {
                    if (value.length < 2) {
                        setFieldError(field, 'El nombre debe tener al menos 2 caracteres');
                        return false;
                    }
                }
                break;
        }
    }
    
    setFieldValid(field);
    return true;
}

function setFieldError(field, message) {
    const container = field.closest('.input-container');
    const icon = container.querySelector('.input-icon');
    
    field.style.borderColor = '#ef4444';
    field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    
    if (icon) {
        icon.style.color = '#ef4444';
    }
    
    // Remove existing error message
    const existingError = container.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 0.8rem;
        margin-top: 0.5rem;
        animation: slideIn 0.3s ease-out;
    `;
    container.appendChild(errorDiv);
}

function setFieldValid(field) {
    const container = field.closest('.input-container');
    const icon = container.querySelector('.input-icon');
    
    field.style.borderColor = '#10b981';
    field.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
    
    if (icon) {
        icon.style.color = '#10b981';
    }
    
    // Remove error message
    const existingError = container.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function clearFieldValidation(e) {
    const field = e.target;
    const container = field.closest('.input-container');
    const icon = container.querySelector('.input-icon');
    
    field.style.borderColor = '';
    field.style.boxShadow = '';
    
    if (icon) {
        icon.style.color = '';
    }
    
    // Remove error message
    const existingError = container.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Form Submission
function initializeFormSubmission() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    
    form.addEventListener('submit', handleFormSubmission);
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    // Validate all fields
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showError('Por favor, corrige los errores en el formulario.');
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    clearMessages();
    
    // Prepare form data
    const formData = new FormData(form);
    
    // Submit to Netlify Forms
    fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
    })
    .then(response => {
        if (response.ok) {
            showSuccess();
            form.reset();
            trackContactSubmission(formData);
        } else {
            throw new Error('Network response was not ok');
        }
    })
    .catch(error => {
        console.error('Form submission error:', error);
        showError('Error al enviar el mensaje. Por favor, inténtalo de nuevo.');
    })
    .finally(() => {
        setLoadingState(false);
    });
}

function setLoadingState(loading) {
    const submitBtn = document.getElementById('submitBtn');
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    if (loading) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        inputs.forEach(input => input.disabled = true);
    } else {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        inputs.forEach(input => input.disabled = false);
    }
}

function showSuccess() {
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    if (errorMessage) {
        errorMessage.classList.remove('show');
    }
    
    if (successMessage) {
        successMessage.classList.add('show');
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);
    }
    
    animateSuccess();
}

function showError(message) {
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    if (successMessage) {
        successMessage.classList.remove('show');
    }
    
    if (errorMessage) {
        errorMessage.querySelector('span').textContent = message;
        errorMessage.classList.add('show');
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 5000);
    }
    
    animateError();
}

function clearMessages() {
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    if (successMessage) {
        successMessage.classList.remove('show');
    }
    
    if (errorMessage) {
        errorMessage.classList.remove('show');
    }
}

// FAQ Functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
        
        // Keyboard navigation
        question.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
    });
}

// Scroll Effects
function initializeScrollEffects() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', throttle(function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    }, 16));
}

// Animations
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements
    const elementsToAnimate = document.querySelectorAll('.info-card, .form-container, .map-container, .faq-item');
    elementsToAnimate.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
        observer.observe(element);
    });
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: fadeInUp 0.6s ease-out forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .info-card,
        .form-container,
        .map-container,
        .faq-item {
            opacity: 0;
            transform: translateY(30px);
        }
        
        .info-card.animate-in,
        .form-container.animate-in,
        .map-container.animate-in,
        .faq-item.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

// Accessibility
function initializeAccessibility() {
    // Skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Saltar al contenido principal';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-red);
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 10000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.id = 'main-content';
    }
    
    // Keyboard navigation for info cards
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach(card => {
        const link = card.querySelector('.card-link');
        if (link) {
            card.setAttribute('tabindex', '0');
            card.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    link.click();
                }
            });
        }
    });
}

// Map Interaction
function initializeMapInteraction() {
    const mapWrapper = document.querySelector('.map-wrapper');
    if (mapWrapper) {
        // Add loading state for map
        const iframe = mapWrapper.querySelector('iframe');
        if (iframe) {
            iframe.addEventListener('load', function() {
                mapWrapper.classList.add('loaded');
            });
        }
        
        // Add click handler for map
        mapWrapper.addEventListener('click', function() {
            // Could add analytics tracking here
            trackMapInteraction();
        });
    }
}

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
    return phoneRegex.test(phone);
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Animation Functions
function animateSuccess() {
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
        formContainer.style.animation = 'pulse 0.6s ease-in-out';
        setTimeout(() => {
            formContainer.style.animation = '';
        }, 600);
    }
}

function animateError() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            form.style.animation = '';
        }, 500);
    }
}

// Analytics and Tracking
function trackContactSubmission(formData) {
    const firstName = formData.get('firstName');
    const subject = formData.get('subject');
    
    console.log('Contact form submitted:', { firstName, subject });
    
    // Google Analytics tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'contact_form_submit', {
            'event_category': 'engagement',
            'event_label': subject,
            'value': 1
        });
    }
    
    // Facebook Pixel tracking
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: 'Contact Form',
            content_category: 'Contact'
        });
    }
}

function trackMapInteraction() {
    console.log('Map interaction tracked');
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'map_interaction', {
            'event_category': 'engagement',
            'event_label': 'contact_page'
        });
    }
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('Contact page error:', e.error);
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
    
    .map-wrapper.loaded {
        opacity: 1;
        transition: opacity 0.3s ease;
    }
    
    .map-wrapper {
        opacity: 0.7;
    }
`;
document.head.appendChild(style);

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeContactPage,
        validateField,
        isValidEmail,
        isValidPhone,
        throttle,
        debounce
    };
}
