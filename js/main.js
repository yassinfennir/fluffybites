/**
 * Main JavaScript File
 * Handles general interactions, smooth scrolling, form validation, and animations
 */

(function() {
    'use strict';

    /**
     * Smooth Scroll for Anchor Links
     */
    function initSmoothScroll() {
        const scrollLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
        
        scrollLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Active Navigation Link Highlighting
     */
    function highlightActiveNavLink() {
        const currentLocation = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        
        navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;
            
            if (linkPath === currentLocation) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    /**
     * Sticky Header on Scroll
     */
    function initStickyHeader() {
        const header = document.querySelector('.site-header');
        let lastScrollTop = 0;
        const scrollThreshold = 100;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScrollTop = scrollTop;
        });
    }

    /**
     * Lazy Loading Images
     */
    function initLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        observer.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }

    /**
     * Contact Form Validation and Submission
     */
    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                subject: document.getElementById('subject').value.trim(),
                message: document.getElementById('message').value.trim()
            };
            
            // Validate form
            if (!validateForm(formData)) {
                return;
            }
            
            // Show loading state
            const submitButton = contactForm.querySelector('.btn-submit');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                showFormMessage('success', 'Thank you! Your message has been sent successfully. We\'ll get back to you soon!');
                contactForm.reset();
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    hideFormMessage();
                }, 5000);
            }, 1500);
        });
    }

    /**
     * Validate Contact Form
     */
    function validateForm(data) {
        // Name validation
        if (data.name.length < 2) {
            showFormMessage('error', 'Please enter a valid name (at least 2 characters).');
            return false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showFormMessage('error', 'Please enter a valid email address.');
            return false;
        }
        
        // Subject validation
        if (data.subject.length < 3) {
            showFormMessage('error', 'Please enter a subject (at least 3 characters).');
            return false;
        }
        
        // Message validation
        if (data.message.length < 10) {
            showFormMessage('error', 'Please enter a message (at least 10 characters).');
            return false;
        }
        
        return true;
    }

    /**
     * Show Form Message
     */
    function showFormMessage(type, message) {
        const formMessage = document.getElementById('formMessage');
        if (!formMessage) return;
        
        formMessage.className = 'form-message ' + type;
        formMessage.textContent = message;
        formMessage.style.display = 'block';
        
        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Hide Form Message
     */
    function hideFormMessage() {
        const formMessage = document.getElementById('formMessage');
        if (!formMessage) return;
        
        formMessage.style.display = 'none';
        formMessage.className = 'form-message';
        formMessage.textContent = '';
    }

    /**
     * Simple Fade-in Animation on Scroll
     */
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-aos]');
        
        if (!animatedElements.length) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    /**
     * Add hover effect to product cards
     */
    function initProductCardEffects() {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }

    /**
     * Menu category smooth scroll
     */
    function initMenuCategoryScroll() {
        const categoryLinks = document.querySelectorAll('.category-link');
        
        categoryLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetElement = document.querySelector(href);
                    if (targetElement) {
                        const headerOffset = 100;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    /**
     * Hero Gallery Functionality
     */
    function initHeroGallery() {
        const heroImages = document.querySelectorAll('.hero-bg-image');
        const indicators = document.querySelectorAll('.hero-gallery-indicators .indicator');
        const prevBtn = document.querySelector('.gallery-nav-btn.prev');
        const nextBtn = document.querySelector('.gallery-nav-btn.next');
        
        if (heroImages.length === 0) return;
        
        let currentIndex = 0;
        const totalImages = heroImages.length;
        
        function showImage(index) {
            // Remove active class from all images and indicators
            heroImages.forEach(img => img.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));
            
            // Add active class to current image and indicator
            heroImages[index].classList.add('active');
            if (indicators[index]) {
                indicators[index].classList.add('active');
            }
        }
        
        function nextImage() {
            currentIndex = (currentIndex + 1) % totalImages;
            showImage(currentIndex);
        }
        
        function prevImage() {
            currentIndex = (currentIndex - 1 + totalImages) % totalImages;
            showImage(currentIndex);
        }
        
        // Event listeners for navigation buttons
        if (nextBtn) {
            nextBtn.addEventListener('click', nextImage);
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', prevImage);
        }
        
        // Event listeners for indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentIndex = index;
                showImage(currentIndex);
            });
        });
        
        // Auto-advance gallery every 5 seconds
        setInterval(nextImage, 5000);
        
        // Initialize with first image
        showImage(0);
    }

    /**
     * Product Filter Functionality
     */
    function initProductFilter() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const productCards = document.querySelectorAll('.product-card');
        
        console.log('Filter buttons found:', filterButtons.length);
        console.log('Product cards found:', productCards.length);
        
        // Force show all products initially
        productCards.forEach(card => {
            card.style.display = 'block';
            card.style.visibility = 'visible';
            card.style.opacity = '1';
        });
        
        if (filterButtons.length === 0) return;
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                console.log('Filter clicked:', filter);
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter product cards
                productCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        card.style.visibility = 'visible';
                        card.style.opacity = '1';
                        card.style.animation = 'fadeIn 0.5s ease-in-out';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    /**
     * Gallery Filter Functionality
     */
    function initGalleryFilter() {
        const filterButtons = document.querySelectorAll('.gallery-filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        if (filterButtons.length === 0) return;
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter gallery items
                galleryItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        item.style.display = 'block';
                        item.style.animation = 'fadeIn 0.5s ease-in-out';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    /**
     * Visual Gallery Interactions
     */
    function initVisualGallery() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const fullscreenBtn = document.getElementById('galleryFullscreen');
        const gallerySection = document.querySelector('.visual-gallery');
        
        // Add click interactions to gallery items
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                // Add a subtle animation on click
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
                
                // Optional: Open image in lightbox or navigate to menu
                const img = this.querySelector('img');
                if (img) {
                    console.log(`Clicked on: ${img.alt}`);
                    // You can add lightbox functionality here
                }
            });
            
            // Add hover sound effect (optional)
            item.addEventListener('mouseenter', function() {
                this.style.filter = 'brightness(1.05)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.filter = 'brightness(1)';
            });
        });
        
        // Fullscreen gallery functionality
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', function() {
                // Scroll to gallery section smoothly
                gallerySection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Add a pulse animation to all gallery items
                galleryItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.animation = 'pulse 0.6s ease-in-out';
                        setTimeout(() => {
                            item.style.animation = '';
                        }, 600);
                    }, index * 100);
                });
            });
        }
        
        // Add intersection observer for scroll animations
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
        
        galleryItems.forEach(item => {
            observer.observe(item);
        });
    }
    
    /**
     * Add CSS animation keyframes dynamically
     */
    function addVisualGalleryAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            .gallery-item {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .gallery-item.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Initialize all functions when DOM is ready
     */
    function init() {
        initSmoothScroll();
        highlightActiveNavLink();
        initStickyHeader();
        initLazyLoading();
        initContactForm();
        initScrollAnimations();
        initProductCardEffects();
        initMenuCategoryScroll();
        initHeroGallery();
        initProductFilter();
        initGalleryFilter();
        initVisualGallery();
        addVisualGalleryAnimations();
        
        console.log('Fluffy Bites website initialized successfully! ☕🍰');
    }

    // Run initialization when DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

