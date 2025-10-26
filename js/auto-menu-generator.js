/**
 * ═══════════════════════════════════════════════════════════
 * FLUFFY BITES - AUTO MENU GENERATOR
 * Apple-Style Premium Product Display System
 * ═══════════════════════════════════════════════════════════
 *
 * Features:
 * ✓ Auto-generates menu from JSON
 * ✓ Smooth Apple-style animations
 * ✓ Lazy loading & performance optimization
 * ✓ Zero-code product updates
 * ✓ Real-time filtering
 * ✓ Touch-optimized interactions
 */

class AutoMenuGenerator {
    constructor(config = {}) {
        this.config = {
            jsonPath: config.jsonPath || 'data/products.json',
            containerId: config.containerId || 'products-container',
            animationDelay: config.animationDelay || 80,
            lazyLoadOffset: config.lazyLoadOffset || 200,
            enableParallax: config.enableParallax || true,
            enable3DHover: config.enable3DHover || true,
            ...config
        };

        this.products = [];
        this.categories = {};
        this.currentCategory = 'food';
        this.isLoading = false;
        this.observers = new Map();
    }

    /**
     * Initialize the menu system
     */
    async init() {
        console.log('🚀 Initializing Auto Menu Generator...');

        try {
            this.showLoader();
            await this.loadData();
            await this.buildMenu();
            this.setupEventListeners();
            this.initializeAnimations();
            this.hideLoader();

            console.log('✅ Menu system ready!');
        } catch (error) {
            console.error('❌ Failed to initialize menu:', error);
            this.showErrorState();
        }
    }

    /**
     * Load product data from JSON
     */
    async loadData() {
        try {
            const response = await fetch(this.config.jsonPath);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            this.products = data.products;
            this.categories = data.categories;
            this.metadata = data.metadata;

            console.log(`📦 Loaded ${this.products.length} products from ${this.metadata?.cafeName || 'database'}`);
        } catch (error) {
            console.error('Error loading products:', error);
            throw error;
        }
    }

    /**
     * Build the complete menu structure
     */
    async buildMenu() {
        const container = document.getElementById(this.config.containerId);
        if (!container) {
            throw new Error(`Container #${this.config.containerId} not found`);
        }

        // Clear existing content
        container.innerHTML = '';

        // Create category sections
        for (const [categoryKey, categoryData] of Object.entries(this.categories)) {
            const section = this.createCategorySection(categoryKey, categoryData);
            container.appendChild(section);
        }

        // Show initial category
        this.switchCategory(this.currentCategory);
    }

    /**
     * Create a category section
     */
    createCategorySection(categoryKey, categoryData) {
        const section = document.createElement('div');
        section.className = 'menu-content';
        section.id = `menu-${categoryKey}`;
        section.dataset.category = categoryKey;

        // Get products for this category
        const categoryProducts = this.products.filter(
            p => p.category === categoryKey && p.available !== false
        );

        // Sort: featured first, then by name
        categoryProducts.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return a.name.localeCompare(b.name);
        });

        // Create product cards
        categoryProducts.forEach((product, index) => {
            const card = this.createProductCard(product, index);
            section.appendChild(card);
        });

        return section;
    }

    /**
     * Create a product card with Apple-style design
     */
    createProductCard(product, index) {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.dataset.productId = product.id;
        card.dataset.index = index;

        // Initial animation state
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px) scale(0.95)';

        // Get badge from subcategory
        const subcategory = this.categories[product.category]?.subcategories?.[product.subcategory];
        const badge = subcategory?.badge || product.subcategory?.toUpperCase() || 'SPECIAL';

        card.innerHTML = `
            <div class="product-image-container">
                <img
                    data-src="${product.image}"
                    alt="${product.name}"
                    class="product-image lazy-image"
                    onerror="this.onerror=null; this.src='${product.fallbackImage || product.image}';"
                >
                ${product.featured ? `
                    <div class="featured-indicator">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span>Featured</span>
                    </div>
                ` : ''}
                ${product.tags?.includes('bestseller') ? `
                    <div class="bestseller-badge">Bestseller</div>
                ` : ''}
            </div>
            <div class="product-details">
                <span class="product-badge">${badge}</span>
                <h3 class="product-name">${this.escapeHtml(product.name)}</h3>
                <p class="product-description">${this.escapeHtml(product.description)}</p>
                ${product.price ? `
                    <div class="product-footer">
                        <span class="product-price">€${product.price.toFixed(2)}</span>
                        ${product.allergens?.length > 0 ? `
                            <span class="allergen-indicator" title="${product.allergens.join(', ')}">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="12" y1="8" x2="12" y2="12"/>
                                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                                </svg>
                            </span>
                        ` : ''}
                    </div>
                ` : ''}
            </div>
        `;

        // Add click handler
        card.addEventListener('click', () => this.handleProductClick(product));

        // Setup lazy loading
        this.setupLazyLoad(card.querySelector('.lazy-image'));

        // Staggered entrance animation
        requestAnimationFrame(() => {
            setTimeout(() => {
                card.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, index * this.config.animationDelay);
        });

        return card;
    }

    /**
     * Switch between categories
     */
    switchCategory(categoryKey) {
        // Hide all sections with fade out
        const allSections = document.querySelectorAll('.menu-content');
        allSections.forEach(section => {
            section.classList.remove('active');
            section.style.opacity = '0';
        });

        // Show selected section with fade in
        const selectedSection = document.getElementById(`menu-${categoryKey}`);
        if (selectedSection) {
            setTimeout(() => {
                selectedSection.classList.add('active');
                selectedSection.style.opacity = '1';
                this.currentCategory = categoryKey;

                // Re-animate cards
                this.animateCards(selectedSection);
            }, 300);
        }

        // Update button states
        this.updateCategoryButtons(categoryKey);
    }

    /**
     * Animate cards in a section
     */
    animateCards(section) {
        const cards = section.querySelectorAll('.product-card');

        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px) scale(0.98)';

            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, index * this.config.animationDelay);
        });
    }

    /**
     * Update category button states
     */
    updateCategoryButtons(activeCategory) {
        document.querySelectorAll('[data-category-btn]').forEach(btn => {
            const category = btn.dataset.categoryBtn;
            if (category === activeCategory) {
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
            } else {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            }
        });
    }

    /**
     * Setup lazy loading for images
     */
    setupLazyLoad(img) {
        if (!img) return;

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const image = entry.target;
                        image.src = image.dataset.src;
                        image.classList.add('loaded');
                        observer.unobserve(image);
                    }
                });
            }, {
                rootMargin: `${this.config.lazyLoadOffset}px`
            });

            observer.observe(img);
            this.observers.set(img, observer);
        } else {
            // Fallback for older browsers
            img.src = img.dataset.src;
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Category buttons
        document.querySelectorAll('[data-category-btn]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.categoryBtn;
                this.switchCategory(category);
            });
        });

        // Search functionality (if exists)
        const searchInput = document.querySelector('[data-product-search]');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.handleSearch(e.target.value);
            }, 300));
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.navigateCategory('prev');
            if (e.key === 'ArrowRight') this.navigateCategory('next');
        });
    }

    /**
     * Initialize animations
     */
    initializeAnimations() {
        if (this.config.enable3DHover) {
            this.setup3DHover();
        }

        if (this.config.enableParallax) {
            this.setupParallax();
        }

        // Smooth scroll
        document.documentElement.style.scrollBehavior = 'smooth';
    }

    /**
     * Setup 3D hover effect (Apple-style)
     */
    setup3DHover() {
        document.addEventListener('mousemove', (e) => {
            const cards = document.querySelectorAll('.product-card:hover');

            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * 5; // Max 5 degrees
                const rotateY = ((centerX - x) / centerX) * 5;

                card.style.transform = `
                    perspective(1000px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    scale3d(1.03, 1.03, 1.03)
                    translateZ(10px)
                `;
            });
        });

        // Reset on mouse leave
        document.addEventListener('mouseout', (e) => {
            if (e.target.classList.contains('product-card')) {
                e.target.style.transform = '';
            }
        });
    }

    /**
     * Setup parallax scrolling
     */
    setupParallax() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const cards = document.querySelectorAll('.product-card');

                    cards.forEach((card, index) => {
                        const speed = 0.03 + (index % 3) * 0.01;
                        const yPos = -(scrolled * speed);
                        card.style.transform = `translateY(${yPos}px)`;
                    });

                    ticking = false;
                });

                ticking = true;
            }
        }, { passive: true });
    }

    /**
     * Handle product click
     */
    handleProductClick(product) {
        console.log('Product clicked:', product);

        // Dispatch custom event
        const event = new CustomEvent('productSelected', {
            detail: { product },
            bubbles: true
        });
        document.dispatchEvent(event);

        // TODO: Open product modal
        // this.openProductModal(product);
    }

    /**
     * Handle search
     */
    handleSearch(query) {
        const normalizedQuery = query.toLowerCase().trim();

        if (!normalizedQuery) {
            this.switchCategory(this.currentCategory);
            return;
        }

        const results = this.products.filter(product =>
            product.name.toLowerCase().includes(normalizedQuery) ||
            product.description.toLowerCase().includes(normalizedQuery) ||
            product.tags?.some(tag => tag.toLowerCase().includes(normalizedQuery))
        );

        this.displaySearchResults(results, query);
    }

    /**
     * Display search results
     */
    displaySearchResults(results, query) {
        const container = document.getElementById(this.config.containerId);
        if (!container) return;

        container.innerHTML = '';

        if (results.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                    </svg>
                    <h3>No products found</h3>
                    <p>No results for "${this.escapeHtml(query)}"</p>
                </div>
            `;
            return;
        }

        const section = document.createElement('div');
        section.className = 'menu-content active';

        results.forEach((product, index) => {
            const card = this.createProductCard(product, index);
            section.appendChild(card);
        });

        container.appendChild(section);
    }

    /**
     * Navigate between categories
     */
    navigateCategory(direction) {
        const categories = Object.keys(this.categories);
        const currentIndex = categories.indexOf(this.currentCategory);

        let newIndex;
        if (direction === 'next') {
            newIndex = (currentIndex + 1) % categories.length;
        } else {
            newIndex = (currentIndex - 1 + categories.length) % categories.length;
        }

        this.switchCategory(categories[newIndex]);
    }

    /**
     * Show loading state
     */
    showLoader() {
        const container = document.getElementById(this.config.containerId);
        if (container) {
            container.innerHTML = `
                <div class="menu-loader">
                    <div class="loader-spinner"></div>
                    <p>Loading delicious menu...</p>
                </div>
            `;
        }
    }

    /**
     * Hide loading state
     */
    hideLoader() {
        const loader = document.querySelector('.menu-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 300);
        }
    }

    /**
     * Show error state
     */
    showErrorState() {
        const container = document.getElementById(this.config.containerId);
        if (container) {
            container.innerHTML = `
                <div class="error-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <h3>Unable to load menu</h3>
                    <p>Please refresh the page or try again later.</p>
                    <button onclick="location.reload()">Refresh Page</button>
                </div>
            `;
        }
    }

    /**
     * Utility: Debounce function
     */
    debounce(func, wait) {
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

    /**
     * Utility: Escape HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Cleanup
     */
    destroy() {
        // Cleanup observers
        this.observers.forEach((observer, element) => {
            observer.disconnect();
        });
        this.observers.clear();

        console.log('🧹 Menu system cleaned up');
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAutoMenu);
} else {
    initAutoMenu();
}

function initAutoMenu() {
    window.autoMenuGenerator = new AutoMenuGenerator({
        jsonPath: 'data/products.json',
        containerId: 'products-container',
        animationDelay: 80,
        enableParallax: true,
        enable3DHover: true
    });

    window.autoMenuGenerator.init();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AutoMenuGenerator;
}
