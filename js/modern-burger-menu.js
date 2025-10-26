/**
 * MODERN BURGER MENU - OPTIMIZADO PARA IPHONE
 * Menú hamburguesa moderno con animaciones suaves y excelente UX
 */

class ModernBurgerMenu {
    constructor() {
        this.isOpen = false;
        this.isAnimating = false;
        this.scrollPosition = 0;
        this.touchStartY = 0;
        this.touchStartX = 0;
        this.swipeThreshold = 50;
        
        this.init();
    }

    init() {
        this.createMenuHTML();
        this.bindEvents();
        this.setupAccessibility();
        this.setupTouchGestures();
        console.log('🍔 Modern Burger Menu inicializado');
    }

    createMenuHTML() {
        // Crear el HTML del menú si no existe
        if (!document.getElementById('modernBurgerMenu')) {
            const menuHTML = `
                <div id="modernBurgerMenu" class="modern-burger-overlay" aria-hidden="true">
                    <div class="modern-burger-content">
                        <div class="modern-burger-header">
                            <button class="modern-burger-close" aria-label="Cerrar menú">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <nav class="modern-burger-nav" role="navigation">
                            <ul class="modern-burger-nav-list">
                                <li class="modern-burger-nav-item">
                                    <a href="index.html" class="modern-burger-nav-link">
                                        <i class="fas fa-home modern-burger-nav-icon"></i>
                                        <span>Home</span>
                                    </a>
                                </li>
                                <li class="modern-burger-nav-item">
                                    <a href="menu.html" class="modern-burger-nav-link">
                                        <i class="fas fa-utensils modern-burger-nav-icon"></i>
                                        <span>Menu</span>
                                    </a>
                                </li>
                                <li class="modern-burger-nav-item">
                                    <a href="about.html" class="modern-burger-nav-link">
                                        <i class="fas fa-info-circle modern-burger-nav-icon"></i>
                                        <span>About</span>
                                    </a>
                                </li>
                                <li class="modern-burger-nav-item">
                                    <a href="locations.html" class="modern-burger-nav-link">
                                        <i class="fas fa-map-marker-alt modern-burger-nav-icon"></i>
                                        <span>Locations</span>
                                    </a>
                                </li>
                                <li class="modern-burger-nav-item">
                                    <a href="contact.html" class="modern-burger-nav-link">
                                        <i class="fas fa-envelope modern-burger-nav-icon"></i>
                                        <span>Contact</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                        
                        <div class="modern-burger-section">
                            <h3 class="modern-burger-section-title">Contacto</h3>
                            <div class="modern-burger-contact">
                                <a href="tel:+358453549022" class="modern-burger-contact-item">
                                    <i class="fas fa-phone modern-burger-contact-icon"></i>
                                    <span>+358 45 3549022</span>
                                </a>
                                <a href="mailto:info@fluffybites.fi" class="modern-burger-contact-item">
                                    <i class="fas fa-envelope modern-burger-contact-icon"></i>
                                    <span>info@fluffybites.fi</span>
                                </a>
                                <a href="https://maps.google.com/?q=Merituulentie+36,+02200+Espoo" class="modern-burger-contact-item">
                                    <i class="fas fa-map-marker-alt modern-burger-contact-icon"></i>
                                    <span>Merituulentie 36, Espoo</span>
                                </a>
                            </div>
                        </div>
                        
                        <div class="modern-burger-section">
                            <h3 class="modern-burger-section-title">Síguenos</h3>
                            <div class="modern-burger-social">
                                <a href="https://www.facebook.com/fluffybites.fi" class="modern-burger-social-link" target="_blank" rel="noopener">
                                    <i class="fab fa-facebook-f"></i>
                                </a>
                                <a href="https://www.instagram.com/fluffybites.fi" class="modern-burger-social-link" target="_blank" rel="noopener">
                                    <i class="fab fa-instagram"></i>
                                </a>
                                <a href="https://www.tiktok.com/@fluffybites.fi" class="modern-burger-social-link" target="_blank" rel="noopener">
                                    <i class="fab fa-tiktok"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', menuHTML);
        }
    }

    bindEvents() {
        // Botón toggle
        const toggleBtn = document.getElementById('modernBurgerToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggle();
            });
            
            // Prevenir zoom en doble tap en iOS
            toggleBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
            });
        }

        // Botón cerrar
        const closeBtn = document.querySelector('.modern-burger-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.close();
            });
        }

        // Overlay click para cerrar
        const overlay = document.getElementById('modernBurgerMenu');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.close();
                }
            });
        }

        // Enlaces de navegación
        const navLinks = document.querySelectorAll('.modern-burger-nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.close();
            });
        });

        // Tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Resize para cerrar en desktop
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    setupAccessibility() {
        const toggleBtn = document.getElementById('modernBurgerToggle');
        const menu = document.getElementById('modernBurgerMenu');
        
        if (toggleBtn) {
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.setAttribute('aria-controls', 'modernBurgerMenu');
            toggleBtn.setAttribute('aria-label', 'Abrir menú de navegación');
        }
        
        if (menu) {
            menu.setAttribute('aria-hidden', 'true');
        }
    }

    setupTouchGestures() {
        const menu = document.getElementById('modernBurgerMenu');
        if (!menu) return;

        // Swipe para cerrar
        menu.addEventListener('touchstart', (e) => {
            this.touchStartY = e.touches[0].clientY;
            this.touchStartX = e.touches[0].clientX;
        }, { passive: true });

        menu.addEventListener('touchmove', (e) => {
            if (!this.isOpen) return;

            const touchY = e.touches[0].clientY;
            const touchX = e.touches[0].clientX;
            const deltaY = touchY - this.touchStartY;
            const deltaX = touchX - this.touchStartX;

            // Swipe hacia abajo o hacia la derecha para cerrar
            if (Math.abs(deltaY) > this.swipeThreshold && deltaY > 0) {
                this.close();
            } else if (Math.abs(deltaX) > this.swipeThreshold && deltaX > 0) {
                this.close();
            }
        }, { passive: true });
    }

    toggle() {
        if (this.isAnimating) return;
        
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        if (this.isOpen || this.isAnimating) return;
        
        this.isAnimating = true;
        this.isOpen = true;
        
        // Guardar posición de scroll
        this.scrollPosition = window.pageYOffset;
        
        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${this.scrollPosition}px`;
        document.body.style.width = '100%';
        
        // Mostrar menú
        const menu = document.getElementById('modernBurgerMenu');
        const toggleBtn = document.getElementById('modernBurgerToggle');
        
        if (menu && toggleBtn) {
            menu.classList.add('active');
            toggleBtn.classList.add('active');
            menu.setAttribute('aria-hidden', 'false');
            toggleBtn.setAttribute('aria-expanded', 'true');
            toggleBtn.setAttribute('aria-label', 'Cerrar menú de navegación');
        }
        
        // Marcar enlace activo
        this.setActiveLink();
        
        // Animar entrada
        setTimeout(() => {
            this.isAnimating = false;
        }, 300);
        
        // Analytics (opcional)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'menu_open', {
                'event_category': 'navigation',
                'event_label': 'burger_menu'
            });
        }
    }

    close() {
        if (!this.isOpen || this.isAnimating) return;
        
        this.isAnimating = true;
        this.isOpen = false;
        
        // Ocultar menú
        const menu = document.getElementById('modernBurgerMenu');
        const toggleBtn = document.getElementById('modernBurgerToggle');
        
        if (menu && toggleBtn) {
            menu.classList.remove('active');
            toggleBtn.classList.remove('active');
            menu.setAttribute('aria-hidden', 'true');
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.setAttribute('aria-label', 'Abrir menú de navegación');
        }
        
        // Restaurar scroll del body
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, this.scrollPosition);
        
        // Animar salida
        setTimeout(() => {
            this.isAnimating = false;
        }, 300);
    }

    setActiveLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.modern-burger-nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if (href === currentPath || 
                (currentPath === '/' && href === 'index.html') ||
                (currentPath.includes('index') && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    handleResize() {
        // Cerrar menú en desktop
        if (window.innerWidth > 1024 && this.isOpen) {
            this.close();
        }
    }

    // Método público para cerrar desde otros scripts
    forceClose() {
        this.close();
    }

    // Método público para abrir desde otros scripts
    forceOpen() {
        this.open();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Solo inicializar en dispositivos móviles
    if (window.innerWidth <= 1024) {
        window.modernBurgerMenu = new ModernBurgerMenu();
    }
    
    // Reinicializar en resize si es necesario
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            if (window.innerWidth <= 1024 && !window.modernBurgerMenu) {
                window.modernBurgerMenu = new ModernBurgerMenu();
            } else if (window.innerWidth > 1024 && window.modernBurgerMenu) {
                window.modernBurgerMenu.forceClose();
                window.modernBurgerMenu = null;
            }
        }, 250);
    });
});

// Exportar para uso global
window.ModernBurgerMenu = ModernBurgerMenu;
