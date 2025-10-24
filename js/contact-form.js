// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const submitBtn = contactForm.querySelector('.btn-submit');
    
    if (!contactForm) return;
    
    // Form submission handler
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Validate form
        if (!validateForm(data)) {
            return;
        }
        
        // Show loading state
        showLoading();
        
        try {
            // Send email using EmailJS
            await sendEmail(data);
            showSuccess();
            contactForm.reset();
        } catch (error) {
            console.error('Error sending email:', error);
            showError();
        }
    });
    
    // Form validation
    function validateForm(data) {
        const errors = [];
        
        if (!data.name || data.name.trim().length < 2) {
            errors.push('Name must be at least 2 characters long');
        }
        
        if (!data.email || !isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (!data.subject || data.subject.trim().length < 3) {
            errors.push('Subject must be at least 3 characters long');
        }
        
        if (!data.message || data.message.trim().length < 10) {
            errors.push('Message must be at least 10 characters long');
        }
        
        if (errors.length > 0) {
            showFormMessage(errors.join('<br>'), 'error');
            return false;
        }
        
        return true;
    }
    
    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Send email using Formspree (easier setup)
    async function sendEmail(data) {
        const response = await fetch('https://formspree.io/f/xpwgqkpn', { // Replace with your Formspree form ID
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                phone: data.phone,
                subject: data.subject,
                message: data.message,
                _replyto: data.email,
                _subject: `New Contact Form Submission: ${data.subject}`
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to send email');
        }
        
        return response;
    }
    
    // Alternative: Send email using Formspree (easier setup)
    async function sendEmailFormspree(data) {
        const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', { // Replace with your Formspree form ID
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                phone: data.phone,
                subject: data.subject,
                message: data.message,
                _replyto: data.email,
                _subject: `New Contact Form Submission: ${data.subject}`
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to send email');
        }
        
        return response;
    }
    
    // Alternative: Send email using Netlify Forms (if hosted on Netlify)
    async function sendEmailNetlify(data) {
        const formData = new FormData();
        formData.append('form-name', 'contact');
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('phone', data.phone);
        formData.append('subject', data.subject);
        formData.append('message', data.message);
        
        const response = await fetch('/', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Failed to send email');
        }
        
        return response;
    }
    
    // Show loading state
    function showLoading() {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        formMessage.innerHTML = '';
        formMessage.className = 'form-message';
    }
    
    // Show success message
    function showSuccess() {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
        showFormMessage('¡Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
    }
    
    // Show error message
    function showError() {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
        showFormMessage('Sorry, there was an error sending your message. Please try again or contact us directly.', 'error');
    }
    
    // Show form message
    function showFormMessage(message, type) {
        formMessage.innerHTML = message;
        formMessage.className = `form-message ${type}`;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            formMessage.innerHTML = '';
            formMessage.className = 'form-message';
        }, 5000);
    }
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    // Validate individual field
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        
        clearFieldError(field);
        
        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    showFieldError(field, 'Name must be at least 2 characters long');
                }
                break;
            case 'email':
                if (!isValidEmail(value)) {
                    showFieldError(field, 'Please enter a valid email address');
                }
                break;
            case 'subject':
                if (value.length < 3) {
                    showFieldError(field, 'Subject must be at least 3 characters long');
                }
                break;
            case 'message':
                if (value.length < 10) {
                    showFieldError(field, 'Message must be at least 10 characters long');
                }
                break;
        }
    }
    
    // Show field error
    function showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }
    
    // Clear field error
    function clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
});
