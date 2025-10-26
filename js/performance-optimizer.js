/* ==========================================================================
   Fluffy Bites - Performance Optimizer
   Sistema de Optimización de Rendimiento
   ========================================================================== */

class PerformanceOptimizer {
    constructor() {
        this.imageCache = new Map();
        this.resourceCache = new Map();
        this.lazyImages = new Set();
        this.intersectionObserver = null;
        this.performanceMetrics = {
            loadTime: 0,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            cumulativeLayoutShift: 0
        };
        
        this.init();
        this.setupPerformanceMonitoring();
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.setupResourcePreloading();
    }

    init() {
        console.log('⚡ Performance Optimizer initialized');
        
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Setup service worker for caching
        this.setupServiceWorker();
        
        // Optimize images
        this.optimizeImages();
        
        // Setup compression
        this.setupCompression();
    }

    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.performanceMetrics.largestContentfulPaint = lastEntry.startTime;
                console.log('📊 LCP:', lastEntry.startTime + 'ms');
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    console.log('📊 FID:', entry.processingStart - entry.startTime + 'ms');
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift
            const clsObserver = new PerformanceObserver((list) => {
                let clsValue = 0;
                list.getEntries().forEach((entry) => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                this.performanceMetrics.cumulativeLayoutShift = clsValue;
                console.log('📊 CLS:', clsValue);
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }

        // Monitor page load time
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            this.performanceMetrics.loadTime = loadTime;
            console.log('📊 Page Load Time:', loadTime + 'ms');
        });
    }

    setupLazyLoading() {
        // Create intersection observer for lazy loading
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    this.intersectionObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        // Find all images with data-src attribute
        document.querySelectorAll('img[data-src]').forEach(img => {
            this.lazyImages.add(img);
            this.intersectionObserver.observe(img);
        });

        // Also observe regular images for optimization
        document.querySelectorAll('img').forEach(img => {
            if (!img.hasAttribute('data-src')) {
                this.optimizeImage(img);
            }
        });
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;

        // Check cache first
        if (this.imageCache.has(src)) {
            img.src = this.imageCache.get(src);
            img.classList.remove('lazy');
            return;
        }

        // Create a new image to preload
        const imageLoader = new Image();
        imageLoader.onload = () => {
            img.src = src;
            img.classList.remove('lazy');
            this.imageCache.set(src, src);
        };
        imageLoader.onerror = () => {
            console.warn('Failed to load image:', src);
            img.classList.add('error');
        };
        imageLoader.src = src;
    }

    optimizeImage(img) {
        // Add loading optimization
        img.loading = 'lazy';
        
        // Add error handling
        img.onerror = () => {
            img.classList.add('error');
            console.warn('Image failed to load:', img.src);
        };

        // Add load event
        img.onload = () => {
            img.classList.add('loaded');
        };
    }

    setupImageOptimization() {
        // Convert images to WebP format if supported
        if (this.supportsWebP()) {
            this.convertImagesToWebP();
        }

        // Add responsive images
        this.addResponsiveImages();
    }

    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    convertImagesToWebP() {
        document.querySelectorAll('img').forEach(img => {
            const src = img.src;
            if (src && !src.includes('.webp')) {
                // In a real implementation, you would convert the image server-side
                // For now, we'll just add a class to indicate WebP support
                img.classList.add('webp-supported');
            }
        });
    }

    addResponsiveImages() {
        document.querySelectorAll('img').forEach(img => {
            if (!img.hasAttribute('srcset')) {
                const src = img.src;
                if (src) {
                    // Generate srcset for different screen sizes
                    const srcset = this.generateSrcSet(src);
                    img.srcset = srcset;
                    img.sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
                }
            }
        });
    }

    generateSrcSet(src) {
        // This would typically be done server-side
        // For demo purposes, we'll create a simple srcset
        const baseSrc = src.replace(/\.[^/.]+$/, '');
        const extension = src.split('.').pop();
        
        return [
            `${baseSrc}-320w.${extension} 320w`,
            `${baseSrc}-640w.${extension} 640w`,
            `${baseSrc}-1024w.${extension} 1024w`,
            `${baseSrc}-1920w.${extension} 1920w`
        ].join(', ');
    }

    preloadCriticalResources() {
        // Preload critical CSS
        const criticalCSS = document.createElement('link');
        criticalCSS.rel = 'preload';
        criticalCSS.href = 'css/apple-style.css';
        criticalCSS.as = 'style';
        criticalCSS.onload = () => {
            criticalCSS.rel = 'stylesheet';
        };
        document.head.appendChild(criticalCSS);

        // Preload critical fonts
        const fontPreload = document.createElement('link');
        fontPreload.rel = 'preload';
        fontPreload.href = 'https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@300;400;500;600;700&display=swap';
        fontPreload.as = 'style';
        document.head.appendChild(fontPreload);

        // Preload critical images
        const criticalImages = [
            'Logo/1.png',
            'Fotos/Caffe/1.png',
            'Fotos/Chocolate/1.png'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = src;
            link.as = 'image';
            document.head.appendChild(link);
        });
    }

    setupResourcePreloading() {
        // Preload next page resources
        const nextPageResources = [
            'menu.html',
            'contact.html',
            'locations.html'
        ];

        nextPageResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = resource;
            document.head.appendChild(link);
        });
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('🔧 Service Worker registered:', registration);
                })
                .catch(error => {
                    console.log('❌ Service Worker registration failed:', error);
                });
        }
    }

    setupCompression() {
        // Enable gzip compression headers (this would be done server-side)
        // For client-side, we can optimize data structures
        this.optimizeDataStructures();
    }

    optimizeDataStructures() {
        // Optimize product data structure
        if (window.productManager) {
            const products = productManager.getAllProducts();
            const optimizedProducts = products.map(product => ({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
                available: product.available,
                featured: product.featured
            }));
            
            // Store optimized version
            sessionStorage.setItem('optimized-products', JSON.stringify(optimizedProducts));
        }
    }

    // Performance utilities
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

    throttle(func, limit) {
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

    // Memory management
    cleanup() {
        // Clear caches periodically
        setInterval(() => {
            this.imageCache.clear();
            this.resourceCache.clear();
            console.log('🧹 Cache cleaned up');
        }, 300000); // 5 minutes
    }

    // Get performance metrics
    getPerformanceMetrics() {
        return {
            ...this.performanceMetrics,
            memoryUsage: performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1048576),
                total: Math.round(performance.memory.totalJSHeapSize / 1048576),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
            } : null,
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            } : null
        };
    }
}

// Service Worker for caching
const serviceWorkerCode = `
const CACHE_NAME = 'fluffy-bites-v1';
const urlsToCache = [
    '/',
    '/css/apple-style.css',
    '/js/apple-style.js',
    '/js/product-manager.js',
    '/js/admin-panel.js',
    '/Logo/1.png',
    '/Fotos/Caffe/1.png',
    '/Fotos/Chocolate/1.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
        )
    );
});
`;

// Create service worker file
const createServiceWorker = () => {
    const blob = new Blob([serviceWorkerCode], { type: 'application/javascript' });
    const swUrl = URL.createObjectURL(blob);
    
    // In a real implementation, this would be served from the server
    console.log('🔧 Service Worker code ready:', swUrl);
};

// Initialize Performance Optimizer
document.addEventListener('DOMContentLoaded', () => {
    const optimizer = new PerformanceOptimizer();
    
    // Make optimizer globally available
    window.performanceOptimizer = optimizer;
    
    // Setup cleanup
    optimizer.cleanup();
    
    // Create service worker
    createServiceWorker();
});

// Export for global access
window.PerformanceOptimizer = PerformanceOptimizer;
