/* ==========================================================================
   Menu Interactions - Elegant Modern Design
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize menu functionality
    initMenuFilters();
    initMenuAnimations();
    initMenuInteractions();
    initSmoothScrolling();
    // Enable search and auto-prices
    initMenuSearch();
    injectMenuPrices();
});

/* ==========================================================================
   Menu Filter Functionality
   ========================================================================== */

function initMenuFilters() {
    const categoryNavBtns = document.querySelectorAll('.category-nav-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    const menuCategories = document.querySelectorAll('.menu-category');

    categoryNavBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            categoryNavBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter menu items
            filterMenuItems(category, menuItems, menuCategories);
            
            // Add smooth transition
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

function filterMenuItems(category, menuItems, menuCategories) {
    // Add filtering class for smooth transitions
    menuItems.forEach(item => {
        item.classList.add('filtering');
    });

    setTimeout(() => {
        menuItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            
            if (category === 'all' || itemCategory === category) {
                item.classList.remove('hidden');
                item.style.display = 'block';
            } else {
                item.classList.add('hidden');
                item.style.display = 'none';
            }
        });

        // Show/hide category sections
        menuCategories.forEach(categorySection => {
            const categoryId = categorySection.id;
            const hasVisibleItems = categorySection.querySelectorAll('.menu-item:not(.hidden)').length > 0;
            
            if (category === 'all' || hasVisibleItems) {
                categorySection.classList.remove('hidden');
            } else {
                categorySection.classList.add('hidden');
            }
        });

        // Remove filtering class
        setTimeout(() => {
            menuItems.forEach(item => {
                item.classList.remove('filtering');
            });
        }, 300);
    }, 100);
}

/* ==========================================================================
   Menu Animations
   ========================================================================== */

function initMenuAnimations() {
    // Intersection Observer for scroll animations
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

    // Observe menu items for scroll animations
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });

    // Observe category headers
    const categoryHeaders = document.querySelectorAll('.category-header');
    categoryHeaders.forEach(header => {
        header.style.opacity = '0';
        header.style.transform = 'scale(0.9)';
        header.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(header);
    });
}

/* ==========================================================================
   Menu Item Interactions
   ========================================================================== */

function initMenuInteractions() {
    const menuItems = document.querySelectorAll('.menu-item');
    const menuItemBtns = document.querySelectorAll('.menu-item-btn');

    // Menu item hover effects
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Menu item button interactions
    menuItemBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);

            // Show success feedback
            showAddToCartFeedback(this);
        });
    });

    // Rating hover effects
    const ratingStars = document.querySelectorAll('.menu-item-rating i');
    ratingStars.forEach(star => {
        star.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.3)';
            this.style.color = '#FFD700';
        });

        star.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.color = '';
        });
    });
}

function showAddToCartFeedback(button) {
    const originalText = button.innerHTML;
    const originalBg = button.style.background;
    
    // Change button appearance
    button.innerHTML = '<i class="fas fa-check"></i><span>Agregado</span>';
    button.style.background = 'var(--gradient-gold)';
    button.style.transform = 'scale(1.05)';
    
    // Show success message
    const successMsg = document.createElement('div');
    successMsg.className = 'add-to-cart-success';
    successMsg.innerHTML = '<i class="fas fa-check-circle"></i> ¡Agregado al pedido!';
    successMsg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--gradient-accent);
        color: white;
        padding: 12px 20px;
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(successMsg);
    
    // Animate in
    setTimeout(() => {
        successMsg.style.transform = 'translateX(0)';
    }, 100);
    
    // Reset button after delay
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = originalBg;
        button.style.transform = '';
    }, 2000);
    
    // Remove success message
    setTimeout(() => {
        successMsg.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(successMsg);
        }, 300);
    }, 3000);
}

/* ==========================================================================
   Smooth Scrolling
   ========================================================================== */

function initSmoothScrolling() {
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ==========================================================================
   Search Functionality
   ========================================================================== */

function initMenuSearch() {
    // Create search input if it doesn't exist
    const searchContainer = document.createElement('div');
    searchContainer.className = 'menu-search-container';
    searchContainer.innerHTML = `
        <div class="search-input-wrapper">
            <i class="fas fa-search"></i>
            <input type="text" id="menuSearch" placeholder="Buscar en el menú..." class="search-input">
            <button class="search-clear" id="searchClear">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Insert search before category navigation
    const categoryNav = document.querySelector('.menu-category-nav');
    if (categoryNav) {
        categoryNav.parentNode.insertBefore(searchContainer, categoryNav);
    }
    
    // Add search functionality
    const searchInput = document.getElementById('menuSearch');
    const searchClear = document.getElementById('searchClear');
    const menuItems = document.querySelectorAll('.menu-item');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                // Show all items
                menuItems.forEach(item => {
                    item.classList.remove('hidden');
                    item.style.display = 'block';
                });
            } else {
                // Filter items based on search term
                menuItems.forEach(item => {
                    const itemName = item.querySelector('.menu-item-name').textContent.toLowerCase();
                    const itemDescription = item.querySelector('.menu-item-description').textContent.toLowerCase();
                    
                    if (itemName.includes(searchTerm) || itemDescription.includes(searchTerm)) {
                        item.classList.remove('hidden');
                        item.style.display = 'block';
                    } else {
                        item.classList.add('hidden');
                        item.style.display = 'none';
                    }
                });
            }
        });
    }
    
    if (searchClear) {
        searchClear.addEventListener('click', function() {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
        });
    }
}

/* ==========================================================================
   Menu Statistics
   ========================================================================== */

function initMenuStats() {
    // Add menu statistics
    const menuStats = document.createElement('div');
    menuStats.className = 'menu-stats';
    menuStats.innerHTML = `
        <div class="stat-item">
            <i class="fas fa-coffee"></i>
            <span class="stat-number">12</span>
            <span class="stat-label">Bebidas</span>
        </div>
        <div class="stat-item">
            <i class="fas fa-birthday-cake"></i>
            <span class="stat-number">8</span>
            <span class="stat-label">Pasteles</span>
        </div>
        <div class="stat-item">
            <i class="fas fa-heart"></i>
            <span class="stat-number">6</span>
            <span class="stat-label">Chocolates</span>
        </div>
        <div class="stat-item">
            <i class="fas fa-hamburger"></i>
            <span class="stat-number">4</span>
            <span class="stat-label">Sándwiches</span>
        </div>
    `;
    
    // Insert stats after hero section
    const heroSection = document.querySelector('.menu-hero');
    if (heroSection) {
        heroSection.insertAdjacentElement('afterend', menuStats);
    }
}

/* ==========================================================================
   Initialize Additional Features
   ========================================================================== */

// Initialize search and stats when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Uncomment these lines to enable additional features
    // initMenuSearch();
    // initMenuStats();
});

/* ==========================================================================
   Utility Functions
   ========================================================================== */

// Debounce function for performance optimization
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

// Throttle function for scroll events
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

// Add scroll-based header effects
window.addEventListener('scroll', throttle(function() {
    const header = document.querySelector('.site-header');
    const scrollY = window.scrollY;
    
    if (scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}, 100));

/* ==========================================================================
   Export Functions for External Use
   ========================================================================== */

// Make functions available globally if needed
window.MenuInteractions = {
    filterMenuItems,
    showAddToCartFeedback,
    initMenuSearch,
    initMenuStats
};

/* ==========================================================================
   Inject Prices for Menu Items (simple mapping)
   ========================================================================== */

function injectMenuPrices() {
    const priceByName = new Map([
        ['Espresso Premium', '€3.90'],
        ['Cappuccino Artesanal', '€4.50'],
        ['Latte Cremoso', '€4.20'],
        ['Mocha Especial', '€4.90'],
        ['Americano Clásico', '€3.80'],
        ['Cold Brew Premium', '€4.60'],
        ['Brownie de Chocolate', '€3.50'],
        ['Tiramisu Clásico', '€4.80'],
        ['Croissant Artesanal', '€2.90'],
        ['Cheesecake de Fresa', '€4.50'],
        ['Muffin de Arándanos', '€2.80'],
        ['Roll de Canela', '€3.20'],
        ['Explosión de Chocolate', '€5.20'],
        ['Chocolate del Corazón', '€5.50'],
        ['Explosión Oscura', '€5.00'],
        ['Flujo de Chocolate', '€4.70'],
        ['Club Sandwich', '€6.90'],
        ['Panini Caprese', '€6.50'],
        ['Wrap de Pollo', '€6.80'],
        ['BLT Premium', '€6.70'],
    ]);

    document.querySelectorAll('.menu-item').forEach(item => {
        const nameEl = item.querySelector('.menu-item-name');
        const footer = item.querySelector('.menu-item-footer');
        if (!nameEl || !footer) return;
        const name = nameEl.textContent.trim();
        const price = priceByName.get(name);
        if (!price) return;
        let priceEl = item.querySelector('.menu-item-price');
        if (!priceEl) {
            priceEl = document.createElement('span');
            priceEl.className = 'menu-item-price';
            footer.prepend(priceEl);
        }
        priceEl.textContent = price;
    });
}
