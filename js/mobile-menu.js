/**
 * Mobile Menu Toggle Functionality
 * Handles hamburger menu open/close and body scroll lock
 */

(function() {
    'use strict';

    // Get DOM elements
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const body = document.body;
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    // Check if elements exist
    if (!mobileMenuToggle || !mobileMenuOverlay) {
        console.warn('Mobile menu elements not found');
        return;
    }

    /**
     * Toggle mobile menu
     */
    function toggleMobileMenu() {
        const isActive = mobileMenuToggle.classList.contains('active');
        
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    /**
     * Open mobile menu
     */
    function openMobileMenu() {
        mobileMenuToggle.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        body.style.overflow = 'hidden'; // Prevent body scroll
        
        // Set ARIA attributes
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        mobileMenuOverlay.setAttribute('aria-hidden', 'false');
    }

    /**
     * Close mobile menu
     */
    function closeMobileMenu() {
        mobileMenuToggle.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        body.style.overflow = ''; // Restore body scroll
        
        // Set ARIA attributes
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuOverlay.setAttribute('aria-hidden', 'true');
    }

    /**
     * Handle escape key press
     */
    function handleEscapeKey(e) {
        if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('active')) {
            closeMobileMenu();
        }
    }

    /**
     * Handle click outside menu
     */
    function handleClickOutside(e) {
        if (mobileMenuOverlay.classList.contains('active')) {
            // If click is on the overlay but not on the nav menu itself
            if (e.target === mobileMenuOverlay) {
                closeMobileMenu();
            }
        }
    }

    // Event Listeners
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    document.addEventListener('keydown', handleEscapeKey);
    mobileMenuOverlay.addEventListener('click', handleClickOutside);

    // Close menu when clicking on a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Close menu on window resize if menu is open
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 1024 && mobileMenuOverlay.classList.contains('active')) {
                closeMobileMenu();
            }
        }, 250);
    });

    // Initialize ARIA attributes
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileMenuToggle.setAttribute('aria-controls', 'mobileMenuOverlay');
    mobileMenuOverlay.setAttribute('aria-hidden', 'true');

})();

