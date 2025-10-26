import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Menu, 
  Coffee, 
  MapPin, 
  Phone, 
  Info, 
  Image, 
  BookOpen,
  X,
  ChevronRight,
  Heart,
  Star,
  Clock,
  Users,
  Camera,
  PenTool,
  Calendar,
  Mail,
  Instagram,
  Facebook,
  Twitter
} from 'lucide-react';

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  // Páginas disponibles con iconos mejorados
  const pages = [
    { id: 'home', name: 'Inicio', icon: Home, href: 'index.html', color: 'text-blue-600' },
    { id: 'menu', name: 'Menú', icon: Menu, href: 'menu.html', color: 'text-green-600' },
    { id: 'drinks', name: 'Bebidas', icon: Coffee, href: 'drinks.html', color: 'text-amber-600' },
    { id: 'gallery', name: 'Galería', icon: Camera, href: 'gallery.html', color: 'text-purple-600' },
    { id: 'blog', name: 'Blog', icon: PenTool, href: 'blog.html', color: 'text-pink-600' },
    { id: 'locations', name: 'Ubicaciones', icon: MapPin, href: 'locations.html', color: 'text-red-600' },
    { id: 'contact', name: 'Contacto', icon: Phone, href: 'contact.html', color: 'text-indigo-600' },
    { id: 'about', name: 'Acerca de', icon: Info, href: 'about.html', color: 'text-teal-600' }
  ];

  // Detectar página actual basada en la URL
  useEffect(() => {
    const currentPath = window.location.pathname;
    const currentPageId = pages.find(page => 
      currentPath.includes(page.href) || 
      (currentPath === '/' && page.id === 'home')
    )?.id || 'home';
    setCurrentPage(currentPageId);
  }, []);

  // Cerrar menú con animación suave
  const closeMenu = () => {
    setIsOpen(false);
    // Restaurar scroll después de la animación
    setTimeout(() => {
      document.body.style.overflow = '';
      document.body.style.position = '';
    }, 500);
  };

  // Abrir menú con animación suave
  const openMenu = () => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
  };

  // Toggle menú con animación
  const toggleMenu = () => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  // Manejar click en enlace con feedback visual
  const handleLinkClick = (pageId, href) => {
    setCurrentPage(pageId);
    
    // Feedback visual antes de navegar
    const button = document.querySelector(`[data-page-id="${pageId}"]`);
    if (button) {
      button.style.transform = 'scale(0.95)';
      button.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
    }
    
    // Navegar después de un breve delay para mostrar el feedback
    setTimeout(() => {
      closeMenu();
      window.location.href = href;
    }, 200);
  };

  // Cerrar al hacer click fuera
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeMenu();
    }
  };

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Cerrar en resize si es desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024 && isOpen) {
        closeMenu();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  return (
    <>
      {/* Botón Hamburger mejorado */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 right-4 z-50 bg-gradient-to-r from-red-500 to-red-600 backdrop-blur-sm border-2 border-white/20 p-3 rounded-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-300/50 lg:hidden"
        aria-label="Abrir menú de navegación"
        aria-expanded={isOpen}
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center">
          <span 
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ease-in-out ${
              isOpen ? 'rotate-45 translate-y-1.5' : '-translate-y-1.5'
            }`}
          />
          <span 
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ease-in-out ${
              isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
            }`}
          />
          <span 
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ease-in-out ${
              isOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-1.5'
            }`}
          />
        </div>
      </button>

      {/* Menú de pantalla completa */}
      <div
        className={`fixed inset-0 bg-gradient-to-br from-red-500 via-red-600 to-pink-600 z-50 lg:hidden transition-all duration-500 ease-out ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
        onClick={handleOverlayClick}
      >
        {/* Cursor de cerrar */}
        <div 
          className="absolute top-6 right-6 z-60 cursor-pointer group"
          onClick={closeMenu}
        >
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110">
            <X className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Cerrar menú
          </div>
        </div>

        {/* Contenido del menú */}
        <div className="h-full flex flex-col justify-center items-center px-4 sm:px-8 py-12 overflow-y-auto">
          {/* Logo y título centrado */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">Fluffy Bites</h1>
            <p className="text-lg sm:text-xl text-red-100">Café & Chocolatería</p>
          </div>

          {/* Navegación centrada mejorada */}
          <nav className="w-full max-w-2xl">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pages.map((page, index) => {
                const Icon = page.icon;
                const isActive = currentPage === page.id;
                
                return (
                  <li key={page.id} className="w-full">
                    <button
                      data-page-id={page.id}
                      onClick={() => handleLinkClick(page.id, page.href)}
                      className={`w-full flex flex-col items-center gap-3 px-6 py-6 text-center transition-all duration-300 group rounded-2xl cursor-pointer ${
                        isActive 
                          ? 'bg-white/40 backdrop-blur-md text-white border-2 border-white/60 shadow-2xl scale-105' 
                          : 'bg-white/15 backdrop-blur-sm text-white/90 hover:bg-white/25 hover:text-white hover:scale-105 hover:shadow-xl border border-white/20'
                      }`}
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      <div className={`p-4 rounded-xl transition-all duration-300 ${
                        isActive 
                          ? 'bg-white/40 text-white shadow-lg' 
                          : 'bg-white/25 text-white/80 group-hover:bg-white/35 group-hover:text-white group-hover:shadow-md'
                      }`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <div className="text-center">
                        <span className={`text-lg font-semibold transition-all duration-300 block ${isActive ? 'font-bold' : ''}`}>
                          {page.name}
                        </span>
                        <span className="text-white/70 text-xs mt-1 block">
                          {page.id === 'home' && 'Página principal'}
                          {page.id === 'menu' && 'Ver nuestro menú'}
                          {page.id === 'drinks' && 'Bebidas y café'}
                          {page.id === 'gallery' && 'Fotos de productos'}
                          {page.id === 'blog' && 'Artículos y noticias'}
                          {page.id === 'locations' && 'Encuentra tiendas'}
                          {page.id === 'contact' && 'Contáctanos'}
                          {page.id === 'about' && 'Nuestra historia'}
                        </span>
                      </div>
                      {isActive && (
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Accesos directos */}
          <div className="mt-8 w-full max-w-2xl">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-lg mb-4 text-center">Accesos Directos</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button 
                  onClick={() => handleLinkClick('menu', 'menu.html')}
                  className="bg-white/20 backdrop-blur-sm text-white px-3 py-3 rounded-xl font-medium hover:bg-white/30 transition-all duration-300 hover:scale-105 text-sm flex flex-col items-center gap-1"
                >
                  <span className="text-lg">📋</span>
                  <span>Menú</span>
                </button>
                <button 
                  onClick={() => handleLinkClick('gallery', 'gallery.html')}
                  className="bg-white/20 backdrop-blur-sm text-white px-3 py-3 rounded-xl font-medium hover:bg-white/30 transition-all duration-300 hover:scale-105 text-sm flex flex-col items-center gap-1"
                >
                  <span className="text-lg">📸</span>
                  <span>Galería</span>
                </button>
                <button 
                  onClick={() => handleLinkClick('contact', 'contact.html')}
                  className="bg-white/20 backdrop-blur-sm text-white px-3 py-3 rounded-xl font-medium hover:bg-white/30 transition-all duration-300 hover:scale-105 text-sm flex flex-col items-center gap-1"
                >
                  <span className="text-lg">📞</span>
                  <span>Contacto</span>
                </button>
                <button 
                  onClick={() => handleLinkClick('locations', 'locations.html')}
                  className="bg-white/20 backdrop-blur-sm text-white px-3 py-3 rounded-xl font-medium hover:bg-white/30 transition-all duration-300 hover:scale-105 text-sm flex flex-col items-center gap-1"
                >
                  <span className="text-lg">📍</span>
                  <span>Ubicaciones</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer centrado */}
          <div className="mt-12 text-center">
            <div className="mb-8">
              <p className="text-white/80 text-lg mb-6">¡Visítanos pronto!</p>
              <button 
                onClick={() => handleLinkClick('locations', 'locations.html')}
                className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-medium hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl border border-white/30"
              >
                Ver Ubicaciones
              </button>
            </div>
            
            {/* Redes sociales */}
            <div className="flex justify-center gap-4 mb-6">
              <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110">
                <Instagram className="w-6 h-6 text-white" />
              </button>
              <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110">
                <Facebook className="w-6 h-6 text-white" />
              </button>
              <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110">
                <Twitter className="w-6 h-6 text-white" />
              </button>
            </div>
            
            {/* Información de contacto */}
            <div className="text-white/70 text-sm">
              <p>📧 info@fluffybites.com</p>
              <p>📞 +1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Componente de página de Galería mejorado
export const GalleryPage = () => {
  const galleryCategories = [
    {
      id: 'cafe',
      name: 'Café & Bebidas',
      icon: Coffee,
      color: 'from-amber-500 to-orange-600',
      images: [
        { id: 1, title: 'Cappuccino Artístico', description: 'Arte en cada taza' },
        { id: 2, title: 'Latte Macchiato', description: 'Perfección en cada sorbo' },
        { id: 3, title: 'Espresso Perfecto', description: 'Intensidad y sabor' },
        { id: 4, title: 'Té de la Casa', description: 'Aromas únicos' }
      ]
    },
    {
      id: 'chocolate',
      name: 'Chocolatería',
      icon: Heart,
      color: 'from-amber-700 to-amber-900',
      images: [
        { id: 5, title: 'Trufas Artesanales', description: 'Delicadeza en cada bocado' },
        { id: 6, title: 'Torta de Chocolate', description: 'Indulgencia pura' },
        { id: 7, title: 'Bombones Gourmet', description: 'Sabores únicos' },
        { id: 8, title: 'Hot Chocolate', description: 'Calidez en invierno' }
      ]
    },
    {
      id: 'ambiente',
      name: 'Nuestro Espacio',
      icon: Camera,
      color: 'from-red-500 to-pink-600',
      images: [
        { id: 9, title: 'Interior Acogedor', description: 'Diseño moderno y cálido' },
        { id: 10, title: 'Terraza Exterior', description: 'Perfecto para el buen tiempo' },
        { id: 11, title: 'Zona de Lectura', description: 'Tranquilidad y comodidad' },
        { id: 12, title: 'Decoración Única', description: 'Cada detalle cuenta' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header mejorado */}
      <header className="bg-white shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Galería Visual
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
              Descubre la magia de Fluffy Bites a través de nuestras imágenes
            </p>
            <div className="flex justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Camera className="w-4 h-4" />
                24+ Fotos
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                3 Categorías
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                Actualizado
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {galleryCategories.map((category, categoryIndex) => (
          <section key={category.id} className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${category.color} text-white`}>
                <category.icon className="w-6 h-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {category.name}
              </h2>
            </div>

            {/* Grid de imágenes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.images.map((image, imageIndex) => (
                <div 
                  key={image.id} 
                  className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
                  style={{
                    animationDelay: `${(categoryIndex * 4 + imageIndex) * 100}ms`
                  }}
                >
                  <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <div className={`aspect-square bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                      <category.icon className="w-16 h-16 text-white/80" />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                          <Camera className="w-6 h-6 text-gray-700" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                      {image.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {image.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Sección de características */}
        <section className="mt-20 bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir Fluffy Bites?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cada imagen cuenta una historia de calidad, pasión y dedicación
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Coffee className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Calidad Premium</h3>
              <p className="text-gray-600 leading-relaxed">
                Ingredientes seleccionados y técnicas artesanales en cada preparación
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-10 h-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Pasión por el Detalle</h3>
              <p className="text-gray-600 leading-relaxed">
                Cada plato y bebida es una obra de arte cuidadosamente elaborada
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Experiencia Única</h3>
              <p className="text-gray-600 leading-relaxed">
                Un ambiente cálido y acogedor que hace que cada visita sea especial
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

// Componente de página de Blog mejorado
export const BlogPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: "El Arte del Latte Art: Técnicas Profesionales",
      excerpt: "Descubre los secretos detrás de las creaciones más impresionantes en tu taza de café. Desde el corazón básico hasta rosettas complejas...",
      date: "20 de Enero, 2024",
      category: "Técnicas",
      readTime: "8 min",
      author: "María González",
      featured: true,
      color: "from-amber-500 to-orange-600"
    },
    {
      id: 2,
      title: "Chocolate Bean to Bar: Nuestro Proceso Artesanal",
      excerpt: "Conoce el viaje completo desde el grano de cacao hasta nuestras deliciosas creaciones. Un proceso que combina tradición y innovación...",
      date: "18 de Enero, 2024",
      category: "Procesos",
      readTime: "6 min",
      author: "Carlos Mendoza",
      featured: false,
      color: "from-amber-700 to-amber-900"
    },
    {
      id: 3,
      title: "Eventos Especiales: Noches de Cata de Café",
      excerpt: "Únete a nuestras noches temáticas donde exploramos diferentes orígenes, métodos de preparación y maridajes únicos...",
      date: "15 de Enero, 2024",
      category: "Eventos",
      readTime: "5 min",
      author: "Ana Rodríguez",
      featured: false,
      color: "from-red-500 to-pink-600"
    },
    {
      id: 4,
      title: "Sostenibilidad en la Industria del Café",
      excerpt: "Cómo Fluffy Bites contribuye a un futuro más sostenible a través de prácticas responsables y comercio justo...",
      date: "12 de Enero, 2024",
      category: "Sostenibilidad",
      readTime: "7 min",
      author: "Luis Fernández",
      featured: false,
      color: "from-green-500 to-emerald-600"
    },
    {
      id: 5,
      title: "Recetas de Temporada: Bebidas de Invierno",
      excerpt: "Calienta tu invierno con nuestras recetas exclusivas de bebidas calientes. Desde el clásico hot chocolate hasta creaciones innovadoras...",
      date: "10 de Enero, 2024",
      category: "Recetas",
      readTime: "4 min",
      author: "Sofia Martín",
      featured: false,
      color: "from-blue-500 to-indigo-600"
    },
    {
      id: 6,
      title: "La Historia del Café en Nuestra Ciudad",
      excerpt: "Un viaje a través del tiempo para descubrir cómo el café se convirtió en parte esencial de nuestra cultura local...",
      date: "8 de Enero, 2024",
      category: "Historia",
      readTime: "9 min",
      author: "Roberto Silva",
      featured: false,
      color: "from-purple-500 to-violet-600"
    }
  ];

  const categories = [
    { name: "Técnicas", count: 12, color: "bg-amber-100 text-amber-800" },
    { name: "Procesos", count: 8, color: "bg-amber-100 text-amber-800" },
    { name: "Eventos", count: 15, color: "bg-red-100 text-red-800" },
    { name: "Sostenibilidad", count: 6, color: "bg-green-100 text-green-800" },
    { name: "Recetas", count: 20, color: "bg-blue-100 text-blue-800" },
    { name: "Historia", count: 4, color: "bg-purple-100 text-purple-800" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header mejorado */}
      <header className="bg-white shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Blog Fluffy Bites
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
              Historias, técnicas y secretos detrás de cada taza perfecta
            </p>
            <div className="flex justify-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <PenTool className="w-4 h-4" />
                65+ Artículos
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                6 Categorías
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Actualizado
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Categorías */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Categorías</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-gray-700">{category.name}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-2">¡No te pierdas nada!</h3>
                <p className="text-red-100 text-sm mb-4">
                  Recibe nuestros artículos más recientes
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Tu correo electrónico"
                    className="w-full px-3 py-2 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <button className="w-full bg-white text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm">
                    Suscribirse
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Artículos */}
          <div className="lg:col-span-3">
            {/* Artículo destacado */}
            <article className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
              <div className="relative">
                <div className="h-64 bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <PenTool className="w-20 h-20 text-white/80" />
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-amber-600 px-3 py-1 rounded-full text-sm font-medium">
                    Destacado
                  </span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full">
                    {blogPosts[0].category}
                  </span>
                  <span className="text-gray-500 text-sm">{blogPosts[0].readTime}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-red-600 transition-colors cursor-pointer">
                  {blogPosts[0].title}
                </h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {blogPosts[0].excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {blogPosts[0].author.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{blogPosts[0].author}</p>
                      <p className="text-xs text-gray-500">{blogPosts[0].date}</p>
                    </div>
                  </div>
                  <button className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:from-red-600 hover:to-pink-700 transition-all duration-300 hover:scale-105">
                    Leer artículo
                  </button>
                </div>
              </div>
            </article>

            {/* Grid de artículos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogPosts.slice(1).map((post, index) => (
                <article 
                  key={post.id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className="relative">
                    <div className={`h-48 bg-gradient-to-br ${post.color} flex items-center justify-center`}>
                      <PenTool className="w-12 h-12 text-white/80" />
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium rounded-full ${
                        post.color.includes('amber') ? 'text-amber-600' :
                        post.color.includes('red') ? 'text-red-600' :
                        post.color.includes('green') ? 'text-green-600' :
                        post.color.includes('blue') ? 'text-blue-600' :
                        'text-purple-600'
                      }`}>
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-gray-500 text-sm">{post.readTime}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-500 text-sm">{post.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-red-600 transition-colors cursor-pointer line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {post.author.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">{post.author}</span>
                      </div>
                      <button className="text-red-600 font-medium hover:text-red-700 transition-colors text-sm">
                        Leer más →
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Paginación */}
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors">
                  ← Anterior
                </button>
                <button className="px-3 py-2 bg-red-600 text-white rounded-lg font-medium">
                  1
                </button>
                <button className="px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors">
                  2
                </button>
                <button className="px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors">
                  3
                </button>
                <button className="px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors">
                  Siguiente →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BurgerMenu;
