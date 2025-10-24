/**
 * Fluffy Bites - Advanced Animations & Interactive Effects
 * Using GSAP, ScrollTrigger, and Particles.js
 */

(function() {
    'use strict';

    // ==================== GSAP & ScrollTrigger Setup ====================
    
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // ==================== Custom Cursor ====================
    
    function initCustomCursor() {
        // Cursor personalizado desactivado para diseño simple
        return;
    }

    // ==================== Particles Background ====================
    
    function initParticles() {
        // Partículas desactivadas para eliminar fondo marrón
        return;
        
        if (typeof particlesJS === 'undefined') return;
        
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 60,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: ['#6F4E37', '#7B3F00', '#8B4513', '#D2691E']
                },
                shape: {
                    type: 'circle',
                },
                opacity: {
                    value: 0.3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 4,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#6F4E37',
                    opacity: 0.15,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: false
                    },
                    onclick: {
                        enable: false
                    },
                    resize: true
                }
            },
            retina_detect: true
        });
    }

    // ==================== Product Filter Animation ====================
    
    function initProductFilter() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const productCards = document.querySelectorAll('.product-card');
        
        if (!filterButtons.length || !productCards.length) return;
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter products with animation
                productCards.forEach((card, index) => {
                    const category = card.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        // Show card
                        gsap.to(card, {
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            duration: 0.5,
                            delay: index * 0.1,
                            ease: 'back.out(1.7)',
                            onStart: () => {
                                card.style.display = 'block';
                            }
                        });
                    } else {
                        // Hide card
                        gsap.to(card, {
                            opacity: 0,
                            scale: 0.8,
                            y: 20,
                            duration: 0.3,
                            onComplete: () => {
                                card.style.display = 'none';
                            }
                        });
                    }
                });
            });
        });
    }

    // ==================== Product Card Hover Effects ====================
    
    function initProductCardEffects() {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const img = card.querySelector('.product-image img');
            const overlay = card.querySelector('.product-overlay');
            
            card.addEventListener('mouseenter', (e) => {
                // 3D tilt effect
                gsap.to(card, {
                    rotationY: 5,
                    rotationX: -5,
                    z: 50,
                    duration: 0.6,
                    ease: 'power2.out'
                });
                
                // Image zoom
                gsap.to(img, {
                    scale: 1.15,
                    duration: 0.6,
                    ease: 'power2.out'
                });
                
                // Create particle effect
                createParticles(card);
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotationY: 0,
                    rotationX: 0,
                    z: 0,
                    duration: 0.6,
                    ease: 'power2.out'
                });
                
                gsap.to(img, {
                    scale: 1,
                    duration: 0.6,
                    ease: 'power2.out'
                });
            });
            
            // Mouse move parallax
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                gsap.to(card, {
                    rotationX: rotateX,
                    rotationY: rotateY,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            });
        });
    }

    // ==================== Create Particles on Hover ====================
    
    function createParticles(card) {
        const particlesContainer = card.querySelector('.product-particles');
        if (!particlesContainer) return;
        
        // Clear existing particles
        particlesContainer.innerHTML = '';
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.borderRadius = '50%';
            particle.style.background = i % 2 === 0 ? '#FF6B6B' : '#4ECDC4';
            particle.style.left = '50%';
            particle.style.top = '50%';
            particle.style.pointerEvents = 'none';
            
            particlesContainer.appendChild(particle);
            
            const angle = (Math.PI * 2 * i) / 20;
            const velocity = 50 + Math.random() * 50;
            
            gsap.to(particle, {
                x: Math.cos(angle) * velocity,
                y: Math.sin(angle) * velocity,
                opacity: 0,
                duration: 1 + Math.random(),
                ease: 'power2.out',
                onComplete: () => particle.remove()
            });
        }
    }

    // ==================== Favorite Button Effect ====================
    
    function initFavoriteButtons() {
        const favoriteButtons = document.querySelectorAll('.add-to-favorites');
        
        favoriteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                button.classList.toggle('active');
                
                // Heart animation
                gsap.timeline()
                    .to(button, {
                        scale: 1.3,
                        duration: 0.2
                    })
                    .to(button, {
                        scale: 1,
                        duration: 0.2
                    });
                
                // Create floating hearts
                if (button.classList.contains('active')) {
                    createFloatingHearts(button);
                }
            });
        });
    }

    // ==================== Floating Hearts ====================
    
    function createFloatingHearts(button) {
        const rect = button.getBoundingClientRect();
        
        for (let i = 0; i < 5; i++) {
            const heart = document.createElement('i');
            heart.className = 'fas fa-heart';
            heart.style.position = 'fixed';
            heart.style.left = rect.left + rect.width / 2 + 'px';
            heart.style.top = rect.top + rect.height / 2 + 'px';
            heart.style.color = '#FF6B6B';
            heart.style.fontSize = '12px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '9999';
            
            document.body.appendChild(heart);
            
            gsap.to(heart, {
                y: -100,
                x: (Math.random() - 0.5) * 100,
                opacity: 0,
                duration: 1 + Math.random(),
                ease: 'power2.out',
                onComplete: () => heart.remove()
            });
        }
    }

    // ==================== Scroll Reveal Animations ====================
    
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal-section');
        
        if (!revealElements.length) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        revealElements.forEach(el => observer.observe(el));
    }

    // ==================== GSAP Scroll Animations ====================
    
    function initGSAPScrollAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        
        // Parallax hero background
        gsap.to('.hero-bg-image', {
            yPercent: 30,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
        
        // Section titles
        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: title,
                    start: 'top 80%',
                    end: 'top 50%',
                    scrub: 1
                },
                opacity: 0,
                y: 50,
                scale: 0.9
            });
        });
        
        // About section parallax
        const aboutImage = document.querySelector('.about-preview-image img');
        if (aboutImage) {
            gsap.to(aboutImage, {
                yPercent: 20,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.about-preview',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }
        
        // Product cards stagger animation
        gsap.from('.product-card', {
            scrollTrigger: {
                trigger: '.products-grid',
                start: 'top 80%',
            },
            y: 100,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'back.out(1.7)'
        });
        
        // Info items animation
        gsap.from('.info-item', {
            scrollTrigger: {
                trigger: '.location-info',
                start: 'top 80%',
            },
            x: -100,
            opacity: 0,
            duration: 0.6,
            stagger: 0.2,
            ease: 'power2.out'
        });
    }

    // ==================== Smooth Page Transitions ====================
    
    function initPageTransitions() {
        // Fade in page on load
        gsap.from('body', {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out'
        });
        
        // Fade out on link clicks
        const links = document.querySelectorAll('a:not([target="_blank"])');
        
        links.forEach(link => {
            if (link.getAttribute('href') && 
                link.getAttribute('href').endsWith('.html')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const href = link.getAttribute('href');
                    
                    gsap.to('body', {
                        opacity: 0,
                        duration: 0.3,
                        onComplete: () => {
                            window.location.href = href;
                        }
                    });
                });
            }
        });
    }

    // ==================== Number Counter Animation ====================
    
    function initCounters() {
        const counters = document.querySelectorAll('[data-counter]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-counter'));
            
            ScrollTrigger.create({
                trigger: counter,
                start: 'top 80%',
                onEnter: () => {
                    gsap.to(counter, {
                        innerText: target,
                        duration: 2,
                        snap: { innerText: 1 },
                        ease: 'power1.out'
                    });
                },
                once: true
            });
        });
    }

    // ==================== Text Split Animation ====================
    
    function initTextAnimations() {
        const animatedTexts = document.querySelectorAll('.animate-text');
        
        animatedTexts.forEach(text => {
            const words = text.textContent.split(' ');
            text.innerHTML = words.map(word => 
                `<span class="word">${word}</span>`
            ).join(' ');
            
            gsap.from(text.querySelectorAll('.word'), {
                scrollTrigger: {
                    trigger: text,
                    start: 'top 80%',
                },
                opacity: 0,
                y: 20,
                duration: 0.5,
                stagger: 0.05,
                ease: 'power2.out'
            });
        });
    }

    // ==================== Magnetic Buttons ====================
    
    function initMagneticButtons() {
        const magneticButtons = document.querySelectorAll('.btn');
        
        magneticButtons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(button, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            button.addEventListener('mouseleave', () => {
                gsap.to(button, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.3)'
                });
            });
        });
    }


    // ==================== Carousel Functionality ====================
    
    function initCarousel() {
        const track = document.querySelector('.carousel-track');
        const prevBtn = document.querySelector('.carousel-btn-prev');
        const nextBtn = document.querySelector('.carousel-btn-next');
        const indicators = document.querySelectorAll('.carousel-indicator');
        
        if (!track || !prevBtn || !nextBtn) return;
        
        let currentSlide = 0;
        const slides = document.querySelectorAll('.carousel-item');
        const totalSlides = slides.length;
        let slidesPerView = getSlidesPerView();
        
        function getSlidesPerView() {
            if (window.innerWidth >= 1024) return 3;
            if (window.innerWidth >= 768) return 2;
            return 1;
        }
        
        function updateCarousel() {
            const slideWidth = track.offsetWidth / slidesPerView;
            const offset = -currentSlide * slideWidth;
            
            gsap.to(track, {
                x: offset,
                duration: 0.6,
                ease: 'power3.out'
            });
            
            // Update indicators
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentSlide);
            });
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % (totalSlides - slidesPerView + 1);
            updateCarousel();
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + (totalSlides - slidesPerView + 1)) % (totalSlides - slidesPerView + 1);
            updateCarousel();
        }
        
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        
        // Indicator clicks
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentSlide = index;
                updateCarousel();
            });
        });
        
        // Auto-play
        let autoplayInterval = setInterval(nextSlide, 5000);
        
        // Pause on hover
        track.addEventListener('mouseenter', () => {
            clearInterval(autoplayInterval);
        });
        
        track.addEventListener('mouseleave', () => {
            autoplayInterval = setInterval(nextSlide, 5000);
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        });
        
        // Handle resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                slidesPerView = getSlidesPerView();
                currentSlide = 0;
                updateCarousel();
            }, 250);
        });
        
        // Touch/Swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            if (touchEndX < touchStartX - 50) nextSlide();
            if (touchEndX > touchStartX + 50) prevSlide();
        }
        
        // Add to order button animations
        const addButtons = document.querySelectorAll('.carousel-btn-add');
        addButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Animate button
                gsap.timeline()
                    .to(button, {
                        scale: 0.9,
                        duration: 0.1
                    })
                    .to(button, {
                        scale: 1.1,
                        duration: 0.2
                    })
                    .to(button, {
                        scale: 1,
                        duration: 0.1
                    });
                
                // Change button text temporarily
                const originalText = button.textContent;
                button.textContent = '✓ Added!';
                button.style.background = 'var(--gradient-accent)';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = 'var(--gradient-primary)';
                }, 2000);
            });
        });
    }

    // ==================== Initialize All ====================
    
    function init() {
        // Wait for DOM to be fully loaded
        initCustomCursor();
        initParticles();
        initProductFilter();
        initProductCardEffects();
        initFavoriteButtons();
        initScrollReveal();
        initGSAPScrollAnimations();
        initPageTransitions();
        initCounters();
        initTextAnimations();
        initMagneticButtons();
        initCarousel();
        
        console.log('✨ Advanced animations initialized!');
    }

    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

