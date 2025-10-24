/**
 * Theme Switcher - Cambiador de Temas
 * Permite cambiar entre 3 temas diferentes: Rojo Intenso, Naranja Vibrante, Chocolate/Café
 */

class ThemeSwitcher {
    constructor() {
        this.themes = {
            'red': {
                name: 'Rojo Intenso',
                css: 'css/theme-red.css',
                class: 'theme-red'
            },
            'orange': {
                name: 'Naranja Vibrante',
                css: 'css/theme-orange.css',
                class: 'theme-orange'
            },
            'chocolate': {
                name: 'Chocolate/Café',
                css: 'css/theme-chocolate.css',
                class: 'theme-chocolate'
            }
        };
        
        this.currentTheme = localStorage.getItem('selectedTheme') || 'red';
        this.init();
    }
    
    init() {
        // Solo cargar el tema rojo, sin selector
        this.loadTheme('red');
    }
    
    createThemeSelector() {
        // Crear el selector de temas
        const themeSelector = document.createElement('div');
        themeSelector.id = 'theme-selector';
        themeSelector.innerHTML = `
            <div class="theme-selector-container">
                <h4>🎨 Elegir Tema</h4>
                <div class="theme-options">
                    <button class="theme-btn" data-theme="red" title="Tema Rojo Intenso - Colores Pasionales">
                        <div class="theme-preview red-preview"></div>
                        <span>Rojo Intenso</span>
                    </button>
                    <button class="theme-btn" data-theme="orange" title="Tema Naranja Vibrante - Colores Energéticos">
                        <div class="theme-preview orange-preview"></div>
                        <span>Naranja Vibrante</span>
                    </button>
                    <button class="theme-btn" data-theme="chocolate" title="Tema Chocolate/Café - Tonos Cálidos">
                        <div class="theme-preview chocolate-preview"></div>
                        <span>Chocolate/Café</span>
                    </button>
                </div>
                <button id="toggle-theme-selector" class="toggle-btn">
                    <i class="fas fa-palette"></i>
                </button>
            </div>
        `;
        
        // Agregar estilos
        const styles = document.createElement('style');
        styles.textContent = `
            #theme-selector {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                font-family: var(--font-primary);
            }
            
            .theme-selector-container {
                background: var(--color-background);
                border: 1px solid var(--color-border);
                border-radius: 12px;
                padding: 16px;
                box-shadow: var(--color-shadow-medium);
                backdrop-filter: blur(10px);
                transition: all 0.3s ease;
                max-width: 280px;
            }
            
            .theme-selector-container h4 {
                margin: 0 0 12px 0;
                color: var(--color-text-dark);
                font-size: 14px;
                font-weight: 600;
            }
            
            .theme-options {
                display: flex;
                gap: 8px;
                margin-bottom: 12px;
            }
            
            .theme-btn {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 8px;
                border: 2px solid var(--color-border);
                border-radius: 8px;
                background: var(--color-background);
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 12px;
                color: var(--color-text-medium);
            }
            
            .theme-btn:hover {
                border-color: var(--color-secondary);
                transform: translateY(-2px);
                box-shadow: var(--color-shadow-medium);
            }
            
            .theme-btn.active {
                border-color: var(--color-accent);
                background: var(--color-accent-light);
                color: var(--color-accent-dark);
            }
            
            .theme-preview {
                width: 24px;
                height: 24px;
                border-radius: 4px;
                margin-bottom: 4px;
                border: 1px solid rgba(0,0,0,0.1);
            }
            
            .red-preview {
                background: linear-gradient(135deg, #DC2626 0%, #EF4444 100%);
            }
            
            .orange-preview {
                background: linear-gradient(135deg, #EA580C 0%, #FB923C 100%);
            }
            
            .chocolate-preview {
                background: linear-gradient(135deg, #92400E 0%, #B45309 100%);
            }
            
            .toggle-btn {
                position: absolute;
                top: -10px;
                right: -10px;
                width: 32px;
                height: 32px;
                border: none;
                border-radius: 50%;
                background: var(--gradient-primary);
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: var(--color-shadow-medium);
                transition: all 0.3s ease;
                font-size: 14px;
            }
            
            .toggle-btn:hover {
                transform: scale(1.1);
                box-shadow: var(--color-shadow-dark);
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                #theme-selector {
                    top: 10px;
                    right: 10px;
                }
                
                .theme-selector-container {
                    padding: 12px;
                    max-width: 240px;
                }
                
                .theme-options {
                    flex-direction: column;
                    gap: 6px;
                }
                
                .theme-btn {
                    flex-direction: row;
                    justify-content: flex-start;
                    text-align: left;
                }
                
                .theme-preview {
                    margin-right: 8px;
                    margin-bottom: 0;
                }
            }
        `;
        
        document.head.appendChild(styles);
        document.body.appendChild(themeSelector);
    }
    
    setupEventListeners() {
        // Event listeners para los botones de tema
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const theme = e.currentTarget.dataset.theme;
                this.loadTheme(theme);
            });
        });
        
        // Event listener para el botón toggle
        document.getElementById('toggle-theme-selector').addEventListener('click', () => {
            this.toggleSelector();
        });
    }
    
    loadTheme(themeName) {
        if (!this.themes[themeName]) {
            console.warn(`Tema '${themeName}' no encontrado`);
            return;
        }
        
        const theme = this.themes[themeName];
        
        // Remover tema anterior
        const oldThemeLink = document.getElementById('current-theme');
        if (oldThemeLink) {
            oldThemeLink.remove();
        }
        
        // Remover clase anterior del body
        document.body.classList.remove('theme-red', 'theme-orange', 'theme-chocolate');
        
        // Cargar nuevo tema
        const themeLink = document.createElement('link');
        themeLink.id = 'current-theme';
        themeLink.rel = 'stylesheet';
        themeLink.href = theme.css;
        document.head.appendChild(themeLink);
        
        // Agregar clase al body
        document.body.classList.add(theme.class);
        
        // Actualizar botones activos
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-theme="${themeName}"]`).classList.add('active');
        
        // Guardar en localStorage
        this.currentTheme = themeName;
        localStorage.setItem('selectedTheme', themeName);
        
        console.log(`Tema cambiado a: ${theme.name}`);
    }
    
    toggleSelector() {
        const container = document.querySelector('.theme-selector-container');
        container.style.display = container.style.display === 'none' ? 'block' : 'none';
    }
    
    // Método público para cambiar tema programáticamente
    setTheme(themeName) {
        this.loadTheme(themeName);
    }
    
    // Método público para obtener tema actual
    getCurrentTheme() {
        return this.currentTheme;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.themeSwitcher = new ThemeSwitcher();
});

// Exportar para uso global
window.ThemeSwitcher = ThemeSwitcher;
