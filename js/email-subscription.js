// Email Subscription JavaScript - Fluffy Bites

document.addEventListener('DOMContentLoaded', function() {
    initializeEmailSubscription();
});

function initializeEmailSubscription() {
    const form = document.getElementById('emailForm');
    const emailInput = document.getElementById('emailInput');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    if (!form || !emailInput || !submitBtn) {
        console.error('Email subscription elements not found');
        return;
    }

    // Form submission handler
    form.addEventListener('submit', handleFormSubmission);

    // Real-time email validation
    emailInput.addEventListener('input', validateEmail);
    emailInput.addEventListener('blur', validateEmail);

    // Enter key handler
    emailInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (isValidEmail(emailInput.value)) {
                form.dispatchEvent(new Event('submit'));
            }
        }
    });

    // Clear messages when user starts typing
    emailInput.addEventListener('input', clearMessages);

    // Initialize form state
    clearMessages();
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const emailInput = document.getElementById('emailInput');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    const email = emailInput.value.trim();
    
    // Validate email
    if (!isValidEmail(email)) {
        showError('Por favor, ingresa una dirección de email válida.');
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
            trackEmailSubscription(email);
        } else {
            throw new Error('Network response was not ok');
        }
    })
    .catch(error => {
        console.error('Form submission error:', error);
        showError('Error al procesar la suscripción. Por favor, inténtalo de nuevo.');
    })
    .finally(() => {
        setLoadingState(false);
    });
}

function validateEmail() {
    const emailInput = document.getElementById('emailInput');
    const email = emailInput.value.trim();
    
    if (email === '') {
        clearValidationState();
        return;
    }
    
    if (isValidEmail(email)) {
        setValidState();
    } else {
        setInvalidState();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function setValidState() {
    const emailInput = document.getElementById('emailInput');
    const inputIcon = emailInput.nextElementSibling;
    
    emailInput.style.borderColor = '#10b981';
    emailInput.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
    
    if (inputIcon) {
        inputIcon.style.color = '#10b981';
    }
}

function setInvalidState() {
    const emailInput = document.getElementById('emailInput');
    const inputIcon = emailInput.nextElementSibling;
    
    emailInput.style.borderColor = '#ef4444';
    emailInput.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    
    if (inputIcon) {
        inputIcon.style.color = '#ef4444';
    }
}

function clearValidationState() {
    const emailInput = document.getElementById('emailInput');
    const inputIcon = emailInput.nextElementSibling;
    
    emailInput.style.borderColor = '';
    emailInput.style.boxShadow = '';
    
    if (inputIcon) {
        inputIcon.style.color = '';
    }
}

function setLoadingState(loading) {
    const submitBtn = document.getElementById('submitBtn');
    const emailInput = document.getElementById('emailInput');
    
    if (loading) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        emailInput.disabled = true;
    } else {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        emailInput.disabled = false;
    }
}

function showSuccess() {
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    // Hide error message
    if (errorMessage) {
        errorMessage.classList.remove('show');
    }
    
    // Show success message
    if (successMessage) {
        successMessage.classList.add('show');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);
    }
    
    // Add success animation
    animateSuccess();
}

function showError(message) {
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    // Hide success message
    if (successMessage) {
        successMessage.classList.remove('show');
    }
    
    // Show error message
    if (errorMessage) {
        errorMessage.querySelector('span').textContent = message;
        errorMessage.classList.add('show');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 5000);
    }
    
    // Add error animation
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

function animateSuccess() {
    const formContainer = document.querySelector('.email-form-container');
    if (formContainer) {
        formContainer.style.animation = 'pulse 0.6s ease-in-out';
        setTimeout(() => {
            formContainer.style.animation = '';
        }, 600);
    }
}

function animateError() {
    const emailInput = document.getElementById('emailInput');
    if (emailInput) {
        emailInput.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            emailInput.style.animation = '';
        }, 500);
    }
}

function trackEmailSubscription(email) {
    // Analytics tracking (placeholder for future implementation)
    console.log('Email subscription tracked:', email);
    
    // You can integrate with Google Analytics, Facebook Pixel, etc.
    if (typeof gtag !== 'undefined') {
        gtag('event', 'email_subscription', {
            'event_category': 'engagement',
            'event_label': 'newsletter_signup'
        });
    }
    
    // Facebook Pixel tracking
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: 'Email Subscription',
            content_category: 'Newsletter'
        });
    }
}

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
`;
document.head.appendChild(style);

// Utility functions
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

// Error handling
window.addEventListener('error', function(e) {
    console.error('Email subscription error:', e.error);
});

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeEmailSubscription,
        isValidEmail,
        handleFormSubmission
    };
}
