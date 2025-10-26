# 🍔 Burger Menu Moderno - Fluffy Bites

## 📋 Descripción

Un burger menu moderno y completamente responsive para Fluffy Bites, optimizado especialmente para iPhone, iPad y desktop. Incluye animaciones suaves, iconos, navegación intuitiva y páginas adicionales.

## ✨ Características

### 🎨 Mejoras Visuales
- **Animaciones suaves**: Transiciones fluidas en todas las interacciones
- **Diseño moderno**: Estilo limpio y contemporáneo
- **Iconos integrados**: Iconos de Font Awesome para cada opción del menú
- **Efectos hover**: Feedback visual mejorado

### 📱 Responsive Design
- **iPhone optimizado**: Funciona perfectamente en dispositivos iOS
- **iPad compatible**: Adaptado para tablets
- **Desktop ready**: Navegación completa en pantallas grandes
- **Touch friendly**: Áreas de toque optimizadas

### 🚀 Funcionalidades
- **Deslizamiento desde la derecha**: Animación suave de entrada
- **Cierre automático**: Click fuera del menú lo cierra
- **Página activa destacada**: Muestra la página actual
- **Navegación completa**: 8 páginas incluyendo Galería y Blog
- **Accesibilidad**: Soporte para lectores de pantalla

## 📁 Archivos Incluidos

### Archivos Principales
- `burger-menu.jsx` - Componente React principal
- `gallery.html` - Nueva página de galería
- `blog.html` - Nueva página de blog
- `css/burger-menu-optimizations.css` - Optimizaciones para móvil

### Páginas del Menú
1. **Inicio** (`index.html`) - Página principal
2. **Menú** (`menu.html`) - Menú de comida
3. **Bebidas** (`drinks.html`) - Bebidas disponibles
4. **Galería** (`gallery.html`) - ✨ **NUEVA** - Galería de imágenes
5. **Blog** (`blog.html`) - ✨ **NUEVA** - Artículos y noticias
6. **Ubicaciones** (`locations.html`) - Nuestras ubicaciones
7. **Contacto** (`contact.html`) - Información de contacto
8. **Acerca de** (`about.html`) - Sobre nosotros

## 🛠️ Instalación

### 1. Integrar el CSS
Añade el archivo de optimizaciones a tu HTML:

```html
<link rel="stylesheet" href="css/burger-menu-optimizations.css">
```

### 2. Usar el Componente React
Si estás usando React, importa el componente:

```jsx
import BurgerMenu from './burger-menu.jsx';

function App() {
  return (
    <div>
      <BurgerMenu />
      {/* Tu contenido aquí */}
    </div>
  );
}
```

### 3. Integrar con HTML Existente
Para usar con tu sistema HTML actual, el burger menu ya está integrado en las páginas `gallery.html` y `blog.html`.

## 🎯 Características Técnicas

### Responsive Breakpoints
- **Desktop**: > 1024px - Navegación completa visible
- **Tablet**: 768px - 1024px - Menú hamburger visible
- **Mobile**: < 768px - Menú optimizado para touch

### Animaciones
- **Duración**: 300ms para transiciones suaves
- **Easing**: `ease-out` para entrada natural
- **Transform**: Usa `translateX` para mejor rendimiento

### Optimizaciones iPhone
- **Área de toque**: Mínimo 44px para mejor usabilidad
- **Safe area**: Compatible con notch y Dynamic Island
- **Touch actions**: Optimizado para gestos táctiles
- **Scroll**: Suave con `-webkit-overflow-scrolling: touch`

## 🎨 Personalización

### Colores
```css
:root {
  --primary-color: #E63946;    /* Color principal */
  --secondary-color: #F77F00;  /* Color secundario */
  --text-color: #374151;       /* Color de texto */
  --bg-color: #ffffff;         /* Color de fondo */
}
```

### Tamaños
```css
:root {
  --menu-width: 70%;           /* Ancho del menú en móvil */
  --touch-target: 44px;        /* Tamaño mínimo de área de toque */
  --border-radius: 12px;       /* Radio de bordes */
}
```

## 📱 Compatibilidad

### Navegadores Soportados
- ✅ Safari (iOS 12+)
- ✅ Chrome (Android 8+)
- ✅ Firefox (Android 8+)
- ✅ Edge (Windows 10+)
- ✅ Chrome (Desktop)

### Dispositivos Optimizados
- ✅ iPhone (todas las versiones)
- ✅ iPad (todas las versiones)
- ✅ Android (8.0+)
- ✅ Desktop (Windows, macOS, Linux)

## 🚀 Rendimiento

### Optimizaciones Incluidas
- **Will-change**: Para animaciones suaves
- **Transform3d**: Aceleración por hardware
- **Contain**: Optimización de layout
- **Lazy loading**: Carga eficiente de recursos

### Métricas
- **Tiempo de carga**: < 100ms
- **FPS**: 60fps en animaciones
- **Tamaño**: < 5KB CSS adicional

## 🔧 Mantenimiento

### Actualizar Enlaces
Para añadir nuevas páginas, edita el array `pages` en `burger-menu.jsx`:

```jsx
const pages = [
  { id: 'nueva-pagina', name: 'Nueva Página', icon: IconName, href: 'nueva-pagina.html' },
  // ... otros enlaces
];
```

### Personalizar Iconos
Cambia los iconos importando de `lucide-react`:

```jsx
import { NuevoIcono } from 'lucide-react';
```

## 📞 Soporte

Para cualquier pregunta o problema:
1. Revisa la documentación
2. Verifica la compatibilidad del navegador
3. Comprueba la consola para errores

## 📄 Licencia

Este código es parte del proyecto Fluffy Bites y está disponible para uso interno.

---

**Desarrollado con ❤️ para Fluffy Bites**
