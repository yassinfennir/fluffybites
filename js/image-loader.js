/**
 * Sistema de Carga Automática de Imágenes por Carpetas
 * Organiza automáticamente las imágenes según la estructura de carpetas
 */

class ImageLoader {
    constructor() {
        this.imageCategories = {
            'Caffe': {
                title: 'Bebidas de Café',
                description: 'Café specialty, espresso, cappuccino y bebidas artesanales',
                folder: 'Caffe',
                icon: 'fas fa-coffee'
            },
            'Chocolate': {
                title: 'Chocolates Premium',
                description: 'Chocolates artesanales y delicias de cacao',
                folder: 'Chocolate',
                icon: 'fas fa-cookie-bite'
            },
            'Crossants': {
                title: 'Croissants Artesanales',
                description: 'Hojaldres frescos y croissants gourmet',
                folder: 'Crossants',
                icon: 'fas fa-bread-slice'
            },
            'Delicas': {
                title: 'Delicias Especiales',
                description: 'Creaciones únicas y especialidades de la casa',
                folder: 'Delicas',
                icon: 'fas fa-star'
            },
            'Pasteles': {
                title: 'Pasteles Premium',
                description: 'Tortas, pasteles y postres artesanales',
                folder: 'Pasteles',
                icon: 'fas fa-birthday-cake'
            },
            'Sandwitches': {
                title: 'Sándwiches Gourmet',
                description: 'Sándwiches artesanales con ingredientes frescos',
                folder: 'Sandwitches',
                icon: 'fas fa-hamburger'
            }
        };

        this.allImages = [];
        this.loadedImages = new Set();
    }

    /**
     * Carga todas las imágenes de una carpeta específica
     */
    async loadImagesFromFolder(folderName, excludeFolders = []) {
        const images = [];
        
        // Mapeo de archivos conocidos en cada carpeta - ACTUALIZADO CON ARCHIVOS REALES
        const folderImages = {
            'Caffe': [
                '780x520-2.jpg',
                'chocolate-brownie.png',
                'coffee-brownie.png',
                'u3829884585________--ar_169_--raw_--stylize_1000_--v_7_--draf_8ab59bea-24ac-4d60-8986-f28788d9a2d2_0.png',
                'u3829884585________--ar_169_--raw_--stylize_1000_--v_7_--draf_8ab59bea-24ac-4d60-8986-f28788d9a2d2_1.png',
                'u3829884585________--ar_169_--raw_--stylize_1000_--v_7_--draf_8ab59bea-24ac-4d60-8986-f28788d9a2d2_2.png',
                'u3829884585________--ar_169_--raw_--stylize_1000_--v_7_--draf_8ab59bea-24ac-4d60-8986-f28788d9a2d2_3.png',
                'u3829884585_A_cup_of_coffee_with_milk_being_poured_into_it_cr_05cd907d-3155-49ca-8db2-bf78c16d4aef_0.png',
                'u3829884585_COFFE_VIDEO_AND_ITS_LIKE_A_ESPRESSO_ANUCIO_DE_LA__fbe07e45-a133-41c8-ab87-1c29e714412e_0.png',
                'u3829884585_COFFE_VIDEO_AND_ITS_LIKE_A_ESPRESSO_ANUCIO_DE_LA__fbe07e45-a133-41c8-ab87-1c29e714412e_3.png',
                'u3829884585_COFFEE_EXPRESSO_WITH_A_HOT_BROWNIUE_--v_7_78e7d853-1e97-4741-90eb-bed18687cbea_2.png',
                'u3829884585_Its_a_big_cup_of_cappuccino_Serve_in_a_glass_Ther_ad539098-6719-42d5-96bc-792b6b2ea701_2.png',
                'u3829884585_professional_food_photography_of_a_single_cappucc_e6fdd216-0246-49b7-9387-be8b5e4451d4_0.png',
                'u3829884585_The_aroma_of_freshly_brewed_coffee_fills_the_air__091b0b0c-05d9-4ee0-ad57-18baca72d9d0_3.png'
            ],
            'Chocolate': [
                '1.png', '2.png', '3.png', 'choo.png', 'u381.png',
                'u3829884585_A_hyper-realistic_extreme_close-up_food_photograp_dc1da413-b9ff-49b8-9d26-72c2a52f0bfd_3.png',
                'u3829884585_abstract_background_of_silky_creamy_rich_tiramisu_ca9c7f45-75ee-49b1-bd9e-1cb9c786e92f_2.png',
                'u3829884585_Ultra-realistic_high-quality_photograph_inside_a__ae087ae6-8587-4543-b0ff-59057ae75c99_0.png'
            ],
            'Crossants': [
                'croissant-cube.png',
                'u3829884585_A_Croissant_with_Apricot_Jam_and_Pistachios_is_a__3c4dd34f-4b20-4cc6-928d-9ceaca951354_1.png',
                'u3829884585_A_waffle-croissant_with_pistachio_sauce_chocolate_15417b3c-056f-4d33-b6ac-33dfe4c6346c_0.png',
                'u3829884585_Crosan_mini_de_pollo_Mini_Chicken_Pastel_or_Vol-a_cd9c34cd-d510-4ac3-b157-328411b55e55_3.png',
                'u3829884585_food_photography_of_cube_as_croissantcube_pastry__20595531-b974-4ffc-aa78-a9c8e34ff57f_1.png',
                'u3829884585_food_photography_of_cube_as_croissantcube_pastry__20595531-b974-4ffc-aa78-a9c8e34ff57f_2.png',
                'u3829884585_product_photography_of_a_Almond_Croissant_with_Al_c4a5c5d3-a282-452e-bbce-a7f71914257b_0.png',
                'u3829884585_product_photography_of_a_Almond_Croissant_with_Al_c4a5c5d3-a282-452e-bbce-a7f71914257b_3.png',
                'u3829884585_professional_studio_photo_of_a_golden_flaky_Itali_a433f05f-b8a0-4c49-b464-0ffd9721daca_0.png',
                'u3829884585_Ultra_high-quality_professional_food_photography__0acfa84f-e267-4bee-a609-d16b614efc18_1.png',
                'u3829884585_Ultra_high-quality_professional_food_photography__692670dd-29a0-46fa-a324-62fbf7d5b0f9_3.png'
            ],
            'Delicas': [
                'chocolate-explosion.png',
                'heart-chocolate.png',
                'u3829884585_A_dark_background_with_an_explosion_of_chocolate__041cb99e-09a7-41fc-abf9-f36cd3d3ca6a_1.png',
                'u3829884585_Close_up_amateur_photo_from_reddit._taken_with_an_9311a458-32b9-4f1e-9594-b33ccd669f47_0.png',
                'u3829884585_Close_up_amateur_photo_from_reddit._taken_with_an_9311a458-32b9-4f1e-9594-b33ccd669f47_1.png',
                'u3829884585_Close_up_amateur_photo_from_reddit._taken_with_an_9311a458-32b9-4f1e-9594-b33ccd669f47_3.png',
                'u3829884585_Ultra_high-quality_professional_food_photography__5cf55dc3-ec57-44b6-b138-83c82db76ced_2.png'
            ],
            'Pasteles': [
                'chocolate-dreamland-1.png',
                'chocolate-dreamland-2.png',
                'u3829884585_A_realistic_photo_of_Chocolate_Dreamland_Surprise_e84acd32-d415-49eb-aeb7-24b9f3d61008_1.png',
                'u3829884585_A_realistic_photo_of_Chocolate_Dreamland_Surprise_e84acd32-d415-49eb-aeb7-24b9f3d61008_2.png',
                'u3829884585_A_realistic_photo_of_Chocolate_Dreamland_Surprise_e84acd32-d415-49eb-aeb7-24b9f3d61008_3.png',
                'u3829884585_Chocolate_and_Vanilla_Cream_Cake_is_the_perfect_d_95b3a0f9-96c5-4e62-bdd7-a8e2e1b0548c_1.png',
                'u3829884585_Panettone_mockup_with_chocolate_and_chocolate_cre_4768d5ae-ae29-43e2-a23b-95879ee741ea_0.png',
                'u3829884585_Ultra_high-quality_professional_food_photography__0afbc051-f16a-4f27-bc09-1413f749c843_1.png',
                'u3829884585_Ultra_high-quality_professional_food_photography__2a98ed17-ca09-433b-9b48-05a814caf8bd_1.png',
                'u3829884585_Ultra_high-quality_professional_food_photography__b10e0f39-47cd-48a7-b969-249b53c342c1_3.png',
                'u3829884585_Ultra_realistic_professional_food_photography_Who_b3651c72-b395-4df2-a5bf-8e81df34a3fa_2.png'
            ],
            'Sandwitches': [
                'u3829884585_A_highly_detailed_photorealistic_image_of_a_fresh_72d5cb16-5564-49d2-a433-341ebdab2481_3.png',
                'u3829884585_fish_sandwich_on_a_wooden_table_crispy_fried_fish_364ec9a6-ea07-4fcf-8293-a6b9bb74f9ce_2.png',
                'u3829884585_Sandwich_de_queso_y_tomate_basado_en_la_descripci_88028ac4-709b-49e3-82cb-006ce489a9f3_2.png',
                'u3829884585_Ultra_high-quality_professional_food_photography__b07ffd54-58f9-4844-8924-962aac5e3012_2.png'
            ]
        };

        // Cargar imágenes según el tipo de página
        if (folderName === 'all') {
            // MENU: Todas las imágenes
            Object.keys(folderImages).forEach(folder => {
                if (!excludeFolders.includes(folder)) {
                    folderImages[folder].forEach(filename => {
                        images.push(this.createImageObject(folder, filename));
                    });
                }
            });
        } else if (folderName === 'food') {
            // FOOD: Todas excepto Caffe
            Object.keys(folderImages).forEach(folder => {
                if (folder !== 'Caffe' && !excludeFolders.includes(folder)) {
                    folderImages[folder].forEach(filename => {
                        images.push(this.createImageObject(folder, filename));
                    });
                }
            });
        } else if (folderName === 'drinks') {
            // DRINKS: Solo Caffe
            if (folderImages['Caffe']) {
                folderImages['Caffe'].forEach(filename => {
                    images.push(this.createImageObject('Caffe', filename));
                });
            }
        } else if (folderImages[folderName]) {
            // Carpeta específica
            folderImages[folderName].forEach(filename => {
                images.push(this.createImageObject(folderName, filename));
            });
        }

        return images;
    }

    /**
     * Crea un objeto imagen con metadatos
     */
    createImageObject(folder, filename) {
        const category = this.imageCategories[folder] || {
            title: folder,
            description: `Imágenes de ${folder}`,
            icon: 'fas fa-image'
        };

        return {
            src: `Fotos/${folder}/${filename}`,
            alt: this.generateAltText(folder, filename),
            title: this.generateTitle(folder, filename),
            category: folder,
            categoryInfo: category,
            filename: filename,
            id: `${folder}_${filename.replace(/[^a-zA-Z0-9]/g, '_')}`
        };
    }

    /**
     * Genera texto alternativo descriptivo
     */
    generateAltText(folder, filename) {
        const baseText = {
            'Caffe': 'Bebida de café premium',
            'Chocolate': 'Delicia de chocolate artesanal',
            'Crossants': 'Croissant artesanal',
            'Delicas': 'Delicia especial gourmet',
            'Pasteles': 'Pastel artesanal premium',
            'Sandwitches': 'Sándwich gourmet'
        };

        return `${baseText[folder] || 'Producto gourmet'} en Fluffy Bites`;
    }

    /**
     * Genera título descriptivo
     */
    generateTitle(folder, filename) {
        const titles = {
            'Caffe': ['Espresso Reserva', 'Cappuccino Premium', 'Latte Especial', 'Americano Clásico', 'Mocha Deluxe', 'Flat White'],
            'Chocolate': ['Chocolate Cake', 'Tiramisu Clásico', 'Brownie Artesanal', 'Chocolate Mousse', 'Delicia de Cacao'],
            'Crossants': ['Croissant Butter', 'Almond Croissant', 'Chocolate Croissant', 'Mini Croissant', 'Croissant Cubo'],
            'Delicas': ['Bagel with Cream', 'Blueberry Muffin', 'Cinnamon Roll', 'Chocolate Chip Cookie', 'Red Velvet Cupcake'],
            'Pasteles': ['Chocolate Dreamland', 'Berry Bliss', 'Cheesecake Deluxe', 'Carrot Cake', 'Strawberry Shortcake'],
            'Sandwitches': ['Salty Salmon', 'Salty Fish', 'Salty Tomate & Queso', 'Chicken Deluxe', 'Veggie Supreme']
        };

        const categoryTitles = titles[folder] || ['Producto Premium'];
        const randomIndex = filename.length % categoryTitles.length;
        return categoryTitles[randomIndex];
    }

    /**
     * Carga las imágenes y las renderiza en el contenedor
     */
    async loadAndRenderImages(containerId, folderName = 'all', excludeFolders = []) {
        try {
            const container = document.getElementById(containerId);
            if (!container) {
                console.error(`Contenedor ${containerId} no encontrado`);
                return;
            }

            // Mostrar loading
            container.innerHTML = `
                <div class="loading-container">
                    <div class="loading-spinner"></div>
                    <p>Cargando imágenes...</p>
                </div>
            `;

            // Cargar imágenes
            const images = await this.loadImagesFromFolder(folderName, excludeFolders);
            
            if (images.length === 0) {
                container.innerHTML = `
                    <div class="no-images">
                        <i class="fas fa-image"></i>
                        <p>No se encontraron imágenes</p>
                    </div>
                `;
                return;
            }

            // NO validar imágenes - renderizar directamente para mejorar rendimiento
            // Las imágenes que no existan simplemente no se mostrarán (manejado por onerror en el HTML)
            
            if (images.length === 0) {
                container.innerHTML = `
                    <div class="no-images">
                        <i class="fas fa-image"></i>
                        <p>No se encontraron imágenes</p>
                    </div>
                `;
                return;
            }

            // Renderizar grid directamente sin validación
            this.renderImageGrid(container, images);
            
            // Configurar lazy loading
            this.setupLazyLoading();
            
            // Configurar botones de selección
            this.setupSelectionButtons();

        } catch (error) {
            console.error('Error cargando imágenes:', error);
            this.showErrorMessage(containerId, error);
        }
    }

    /**
     * Valida que las imágenes existan antes de renderizarlas
     * DEPRECATED: Se eliminó para mejorar rendimiento - las imágenes se renderizan directamente
     */
    async validateImages(images) {
        // Método deshabilitado para mejorar rendimiento
        // Las imágenes se renderizan directamente y el navegador maneja los errores
        return images;
    }

    /**
     * Renderiza el grid de imágenes
     */
    renderImageGrid(container, images) {
        const gridHTML = `
            <div class="dynamic-image-grid" style="background: #1a1a1a; padding: 40px 20px; width: 100%;">
                <div class="grid-container" style="max-width: 1400px; margin: 0 auto; width: 100%;">
                    <div class="grid-header" style="text-align: center; margin-bottom: 50px;">
                        <h2 class="grid-title" style="font-size: 3rem; font-weight: 800; color: #FFFFFF; margin-bottom: 10px;">Nuestros Productos</h2>
                        <p class="grid-subtitle" style="font-size: 1.2rem; color: #E63946; font-weight: 500;">Descubre nuestra selección premium</p>
                    </div>
                    
                    <div class="image-grid products-grid" style="
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                        gap: 25px;
                        width: 100%;
                        margin: 0 auto;
                    ">
                        ${images.map(img => this.createImageCard(img)).join('')}
                    </div>
                    
                    <div class="grid-footer" style="text-align: center; margin-top: 60px;">
                        <button class="btn btn-primary" onclick="window.scrollTo({top: 0, behavior: 'smooth'})" style="
                            background: linear-gradient(135deg, #E63946 0%, #d32f2f 100%);
                            color: #ffffff;
                            padding: 16px 32px;
                            border: none;
                            border-radius: 50px;
                            font-weight: 600;
                            font-size: 16px;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            box-shadow: 0 8px 25px rgba(230, 57, 70, 0.3);
                        ">
                            <i class="fas fa-arrow-up"></i> Volver Arriba
                        </button>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = gridHTML;
        
        // Agregar estilos responsivos
        this.addResponsiveStyles();
    }

    /**
     * Crea una tarjeta de imagen individual
     */
    createImageCard(img) {
        // Obtener icono según categoría
        const categoryIcon = img.categoryInfo.icon || 'fas fa-image';
        
        return `
            <div class="product-card" data-category="${img.category}" data-id="${img.id}" style="
                position: relative;
                border-radius: 16px;
                overflow: hidden;
                height: 350px;
                width: 100%;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            ">
                <img 
                    src="${img.src}" 
                    alt="${img.alt}"
                    class="product-image" 
                    loading="lazy"
                    style="
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        display: block;
                        transition: transform 0.3s ease;
                        background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
                    "
                    onerror="
                        this.style.display='none';
                        const errorDiv = this.parentElement.querySelector('.image-error');
                        if(errorDiv) errorDiv.style.display='flex';
                    "
                >
                <div class="image-error" style="
                    display: none;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    color: #666;
                    border-radius: 16px;
                ">
                    <i class="fas fa-image" style="font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.5;"></i>
                    <p style="font-size: 0.9rem; text-align: center; padding: 0 10px;">${img.title}</p>
                </div>
                
                <div class="product-overlay" style="
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: linear-gradient(
                        to bottom,
                        rgba(0, 0, 0, 0),
                        rgba(0, 0, 0, 0.8)
                    );
                    padding: 20px;
                    color: white;
                ">
                    <h3 class="product-name" style="
                        font-size: 22px;
                        font-weight: 700;
                        margin-bottom: 8px;
                        color: #FFFFFF;
                        line-height: 1.2;
                    ">${img.title}</h3>
                    <p class="product-category" style="
                        font-size: 14px;
                        font-weight: 500;
                        color: #E63946;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                    ">
                        <i class="${categoryIcon}"></i>
                        ${img.categoryInfo.title}
                    </p>
                                 </div>
             </div>
             
             <style>
                .products-grid {
                    display: grid !important;
                    grid-template-columns: repeat(3, 1fr) !important;
                    gap: 25px !important;
                    width: 100% !important;
                    max-width: 1400px !important;
                    margin: 0 auto !important;
                    padding: 0 !important;
                }
                
                .product-card {
                    position: relative !important;
                    border-radius: 16px !important;
                    overflow: hidden !important;
                    height: 320px !important;
                    width: 100% !important;
                    display: block !important;
                    box-sizing: border-box !important;
                }
                
                .product-card:hover {
                    transform: scale(1.05);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4) !important;
                }
                
                .product-card:hover .product-image {
                    transform: scale(1.1);
                }
                
                @media (max-width: 1199px) and (min-width: 769px) {
                    .products-grid {
                        grid-template-columns: repeat(2, 1fr) !important;
                        gap: 20px !important;
                    }
                }
                
                @media (max-width: 768px) {
                    .products-grid {
                        grid-template-columns: 1fr !important;
                        gap: 20px !important;
                    }
                    
                    .product-card {
                        height: 350px !important;
                    }
                    
                    .grid-title {
                        font-size: 2.5rem !important;
                    }
                    
                    .grid-subtitle {
                        font-size: 1rem !important;
                    }
                    
                    .grid-container {
                        padding: 0 15px !important;
                    }
                }
                
                @media (max-width: 480px) {
                    .product-card {
                        height: 320px !important;
                    }
                    
                    .product-name {
                        font-size: 18px !important;
                    }
                    
                    .product-category {
                        font-size: 13px !important;
                    }
                    
                    .product-overlay {
                        padding: 15px !important;
                    }
                    
                    .dynamic-image-grid {
                        padding: 30px 15px !important;
                    }
                }
            </style>
        `;
    }

    /**
     * Agrega estilos responsivos adicionales
     */
    addResponsiveStyles() {
        // Los estilos ya están incluidos en el createImageCard
        console.log('Estilos responsivos aplicados');
    }

    /**
     * Configura lazy loading para las imágenes
     */
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('.card-image').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    /**
     * Muestra un mensaje de error personalizado
     */
    showErrorMessage(containerId, error) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let errorMessage = 'Error cargando imágenes';
        let errorDetails = '';

        if (error.message) {
            errorDetails = error.message;
        }

        // Determinar el tipo de error y mostrar mensaje apropiado
        if (errorDetails.includes('404') || errorDetails.includes('not found')) {
            errorMessage = 'Algunas imágenes no se encontraron';
        } else if (errorDetails.includes('network') || errorDetails.includes('fetch')) {
            errorMessage = 'Error de conexión';
        } else if (errorDetails.includes('timeout')) {
            errorMessage = 'Tiempo de espera agotado';
        }

        container.innerHTML = `
            <div class="error-container">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${errorMessage}</p>
                <small style="opacity: 0.7; margin-top: 0.5rem; font-size: 0.9rem;">
                    Intenta recargar la página o verifica tu conexión
                </small>
                <button onclick="location.reload()" style="
                    margin-top: 1rem;
                    padding: 0.5rem 1rem;
                    background: var(--accent-red, #dc143c);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                ">
                    <i class="fas fa-refresh"></i> Recargar
                </button>
            </div>
        `;
    }

    /**
     * Configura botones de selección (placeholder para futuras funcionalidades)
     */
    setupSelectionButtons() {
        // Esta función se puede expandir en el futuro para agregar funcionalidades
        // como selección múltiple, favoritos, etc.
        console.log('Botones de selección configurados');
    }

}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.imageLoader = new ImageLoader();
});
