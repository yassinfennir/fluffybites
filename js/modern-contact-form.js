// Modern Contact Form JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('modernContactForm');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = form.querySelector('.modern-form-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    // Form validation and submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Show loading state
        setLoadingState(true);
        showStatus('loading', 'Sending your message...');
        
        try {
            // Simulate form submission (replace with actual endpoint)
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Here you would typically send to your backend
            // const response = await fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Simulate successful response
            showStatus('success', 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.');
            form.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            showStatus('error', 'Sorry, there was an error sending your message. Please try again or contact us directly.');
        } finally {
            setLoadingState(false);
        }
    });

    // Real-time form validation
    const inputs = form.querySelectorAll('.modern-form-input');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhoneNumber);
    }

    // Form validation function
    function validateForm() {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!validateField({ target: field })) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    // Individual field validation
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        const fieldType = field.type;
        const fieldName = field.name;
        
        // Remove previous error styling
        clearFieldError({ target: field });
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            showFieldError(field, 'This field is required');
            return false;
        }
        
        // Email validation
        if (fieldType === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Phone validation
        if (fieldType === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
        }
        
        // Name validation
        if ((fieldName === 'firstName' || fieldName === 'lastName') && value) {
            if (value.length < 2) {
                showFieldError(field, 'Name must be at least 2 characters long');
                return false;
            }
        }
        
        // Message validation
        if (fieldName === 'message' && value) {
            if (value.length < 10) {
                showFieldError(field, 'Message must be at least 10 characters long');
                return false;
            }
        }
        
        return true;
    }

    // Show field error
    function showFieldError(field, message) {
        field.style.borderColor = '#dc3545';
        field.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.color = '#dc3545';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '5px';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    // Clear field error
    function clearFieldError(e) {
        const field = e.target;
        field.style.borderColor = '#e9ecef';
        field.style.boxShadow = 'none';
        
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    // Phone number formatting
    function formatPhoneNumber(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length >= 6) {
            value = value.replace(/(\d{1,3})(\d{3})(\d{3,4})/, '+$1 ($2) $3');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{1,3})(\d{0,3})/, '+$1 ($2');
        }
        
        e.target.value = value;
    }

    // Show form status
    function showStatus(type, message) {
        formStatus.className = `form-status ${type} show`;
        formStatus.textContent = message;
        
        // Auto-hide success/error messages after 5 seconds
        if (type === 'success' || type === 'error') {
            setTimeout(() => {
                formStatus.classList.remove('show');
            }, 5000);
        }
    }

    // Set loading state
    function setLoadingState(loading) {
        submitBtn.disabled = loading;
        
        if (loading) {
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
        } else {
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    }

    // Smooth scroll to form on page load if there's a hash
    if (window.location.hash === '#contact') {
        setTimeout(() => {
            document.querySelector('.modern-contact-section').scrollIntoView({
                behavior: 'smooth'
            });
        }, 100);
    }

    // Add animation to form elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe form elements
    const animatedElements = document.querySelectorAll('.modern-form-group, .contact-info-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Utility function to handle form data (for backend integration)
function handleFormSubmission(formData) {
    // This function would be called by your backend integration
    // Example implementation:
    
    const data = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
    };
    
    // Send to your backend endpoint
    return fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { handleFormSubmission };
}
