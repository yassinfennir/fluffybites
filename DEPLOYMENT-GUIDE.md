# Guía de Deployment para Fluffy Bites en Netlify

## 🚀 Pasos para subir tu sitio web a Netlify

### 1. Preparación del Proyecto
✅ **Archivos listos para deployment:**
- `index.html` - Página principal optimizada
- `netlify.toml` - Configuración de Netlify
- `_redirects` - Redirecciones para SPA
- `robots.txt` - Configuración SEO
- `sitemap.xml` - Mapa del sitio
- Todas las carpetas: `css/`, `js/`, `Fotos/`, `Logo/`, etc.

### 2. Crear cuenta en Netlify
1. Ve a [netlify.com](https://netlify.com)
2. Haz clic en "Sign up" y crea tu cuenta
3. Verifica tu email

### 3. Subir el proyecto
**Opción A: Drag & Drop (Más fácil)**
1. Comprime toda la carpeta del proyecto en un archivo ZIP
2. En el dashboard de Netlify, arrastra el ZIP a la zona de "Deploy manually"
3. Netlify desplegará automáticamente tu sitio

**Opción B: Git Integration (Recomendado)**
1. Sube tu proyecto a GitHub
2. En Netlify, haz clic en "New site from Git"
3. Conecta tu repositorio de GitHub
4. Configura el build:
   - Build command: (dejar vacío)
   - Publish directory: `.` (punto)

### 4. Configurar el dominio personalizado
1. En el dashboard de Netlify, ve a "Site settings"
2. Haz clic en "Domain management"
3. Haz clic en "Add custom domain"
4. Ingresa: `fluffybites.net`
5. Netlify te dará los DNS records que necesitas configurar

### 5. Configurar DNS en tu proveedor de dominio
Configura estos registros DNS en tu proveedor de dominio:

```
Tipo: A
Nombre: @
Valor: 75.2.60.5

Tipo: CNAME
Nombre: www
Valor: fluffybites.net
```

### 6. Verificar SSL
- Netlify automáticamente configurará SSL/HTTPS
- Puede tomar unos minutos en activarse
- Verás un candado verde en la URL

### 7. Configuraciones adicionales
- **Formularios**: Si tienes formularios, Netlify los procesará automáticamente
- **Analytics**: Puedes activar Netlify Analytics en Site settings
- **Branch deploys**: Para desarrollo, puedes configurar deploys automáticos

## 🔧 Configuraciones incluidas

### netlify.toml
- Headers de seguridad
- Cache optimizado para assets estáticos
- Redirecciones HTTPS
- Configuración de build

### _redirects
- Manejo de rutas SPA
- Redirecciones HTTPS
- Manejo de archivos estáticos

### SEO
- Meta tags optimizados
- Open Graph tags
- Twitter Cards
- Schema.org markup
- Sitemap XML
- Robots.txt

## 📱 Características del sitio

- ✅ Responsive design
- ✅ Multiidioma (EN/FI/SV)
- ✅ Optimización de imágenes
- ✅ Animaciones suaves
- ✅ SEO optimizado
- ✅ PWA ready
- ✅ Fast loading

## 🎯 URLs importantes

- **Sitio principal**: https://fluffybites.net
- **Menú**: https://fluffybites.net/food.html
- **Ubicación**: https://fluffybites.net/locations.html
- **Contacto**: https://fluffybites.net/contact.html

## 🆘 Solución de problemas

### Si el sitio no carga:
1. Verifica que todos los archivos estén en la raíz
2. Revisa la consola de Netlify para errores
3. Asegúrate de que el dominio esté configurado correctamente

### Si las imágenes no cargan:
1. Verifica las rutas en el HTML
2. Asegúrate de que la carpeta `Fotos/` esté incluida
3. Revisa que los nombres de archivo coincidan exactamente

### Si el dominio no funciona:
1. Espera hasta 24 horas para propagación DNS
2. Verifica los registros DNS en tu proveedor
3. Usa herramientas como `nslookup` para verificar

## 📞 Soporte

Si necesitas ayuda adicional:
- Documentación de Netlify: https://docs.netlify.com
- Comunidad de Netlify: https://community.netlify.com

¡Tu sitio estará listo en minutos! 🎉
