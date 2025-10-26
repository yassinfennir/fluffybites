# 📖 GUÍA DE GESTIÓN DE PRODUCTOS - FLUFFY BITES
## Sistema de Actualización Zero-Code 🚀

---

## 🎯 ACCESO AL PANEL ADMIN

### Método 1: URL Directa
```
https://fluffybites.net/admin
```

### Método 2: Desde el sitio
1. Ve a `https://fluffybites.net`
2. Agrega `/admin` al final de la URL
3. Presiona Enter

---

## 🏠 PANEL DE ADMINISTRACIÓN

Cuando entres al panel verás:

### 📊 Estadísticas (arriba)
- **Total Products**: Número total de productos
- **Available**: Productos disponibles
- **Featured**: Productos destacados
- **Categories**: Categorías activas

### 📋 Tabla de Productos
Muestra todos tus productos con:
- Imagen
- Nombre y descripción
- Categoría
- Precio
- Disponibilidad (toggle switch)
- Destacado (toggle switch)
- Acciones (editar/eliminar)

---

## ➕ AÑADIR NUEVO PRODUCTO

### Paso 1: Abrir el formulario
1. Click en el botón **"➕ Add Product"** (arriba a la derecha)

### Paso 2: Completar información

#### **Product Name** *(obligatorio)*
- Nombre del producto
- Ejemplo: `Chocolate Dreamland`

#### **Description** *(obligatorio)*
- Descripción breve del producto
- Ejemplo: `Premium Chocolate Delights`

#### **Category** *(obligatorio)*
- Selecciona: `Food` o `Drinks`

#### **Subcategory** *(obligatorio)*
- Se actualizan automáticamente según la categoría
- **Food**: Chocolate, Pasteles, Croissants, Delicias, Sándwiches
- **Drinks**: Caffe

#### **Price (€)** *(obligatorio)*
- Precio en euros
- Ejemplo: `5.90`

#### **Image Path** *(obligatorio)*
- Ruta de la imagen del producto
- Formato: `Fotos/Categoria/nombre-imagen.png`
- Ejemplo: `Fotos/Chocolate/1.png`

#### **Fallback Image Path** *(opcional)*
- Imagen alternativa si la principal falla
- Ejemplo: `Fotos/Chocolate/backup.png`

#### **Tags** *(opcional)*
- Etiquetas separadas por comas
- Ejemplo: `bestseller, premium, new`

#### **Allergens** *(opcional)*
- Alérgenos separados por comas
- Ejemplo: `gluten, dairy, nuts`

#### **Featured** *(checkbox)*
- ✅ Marcado = Producto destacado en el home
- ❌ Sin marcar = Producto normal

#### **Available** *(checkbox)*
- ✅ Marcado = Visible en el menú
- ❌ Sin marcar = Oculto (sin inventario)

### Paso 3: Guardar
1. Click en **"💾 Save Product"**
2. Se descargará automáticamente un archivo `products.json`

### Paso 4: Aplicar cambios
**⚠️ IMPORTANTE:** Para que los cambios aparezcan en el sitio:

1. **Reemplaza** el archivo descargado en:
   ```
   data/products.json
   ```
2. **Commit y push** a GitHub:
   ```bash
   git add data/products.json
   git commit -m "Update: products menu"
   git push
   ```
3. Netlify se actualizará automáticamente en 1-2 minutos

---

## ✏️ EDITAR PRODUCTO

### Opción 1: Desde la tabla
1. Busca el producto en la tabla
2. Click en el icono **✏️ (lápiz)** en la columna "Actions"
3. Modifica los campos que necesites
4. Click en **"💾 Save Product"**
5. Descarga el archivo actualizado
6. Reemplaza `data/products.json` y haz commit

### Opción 2: Cambios rápidos (sin recargar)
**Disponibilidad:**
- Toggle ON 🟢 = Producto visible
- Toggle OFF ⚪ = Producto oculto

**Featured:**
- Toggle ON 🟢 = Aparece en destacados
- Toggle OFF ⚪ = Producto normal

*(Después de cambiar el toggle, descarga y actualiza el JSON)*

---

## 🗑️ ELIMINAR PRODUCTO

1. Click en el icono **🗑️ (papelera)** en "Actions"
2. Confirma la eliminación
3. Descarga el archivo actualizado
4. Reemplaza `data/products.json` y haz commit

---

## 📥 EXPORTAR PRODUCTOS

**Para hacer backup:**
1. Click en **"📥 Export"**
2. Se descarga `products.json` con todos tus productos
3. Guárdalo en un lugar seguro

---

## 📤 IMPORTAR PRODUCTOS

**Para restaurar un backup:**
1. Click en **"📤 Import"**
2. Selecciona un archivo `products.json`
3. Los productos se cargarán automáticamente
4. Revisa que todo esté correcto
5. Click en **"📥 Export"** para guardar
6. Reemplaza el archivo y haz commit

---

## 🔍 BUSCAR PRODUCTOS

1. Usa el campo de búsqueda arriba a la derecha
2. Busca por:
   - Nombre del producto
   - Descripción
   - Categoría

---

## 📝 ESTRUCTURA DE CATEGORÍAS

### 🍔 FOOD
```
├── 🍫 Chocolate       → Productos de chocolate premium
├── 🍰 Pasteles        → Tartas y pasteles
├── 🥐 Croissants      → Croissants artesanales
├── ⭐ Delicias        → Delicias especiales
└── 🥪 Sándwiches      → Sandwiches gourmet
```

### 🥤 DRINKS
```
└── ☕ Caffe           → Cafés especiales
```

---

## 🖼️ GESTIÓN DE IMÁGENES

### Dónde guardar imágenes:
```
Fotos/
├── Caffe/            → Imágenes de café
├── Chocolate/        → Imágenes de chocolates
├── Pasteles/         → Imágenes de pasteles
├── Crossants/        → Imágenes de croissants
├── Delicas/          → Imágenes de delicias
└── Sandwitches/      → Imágenes de sandwiches
```

### Formato de imágenes recomendado:
- **Formato**: PNG o JPG
- **Tamaño**: 800x800px (cuadrado)
- **Peso**: Máximo 500KB
- **Nombre**: Sin espacios, usar guiones
  - ✅ `chocolate-cake-premium.png`
  - ❌ `Chocolate Cake Premium.png`

### Subir imágenes nuevas:
1. Optimiza la imagen (comprime si es > 500KB)
2. Guarda en la carpeta correspondiente
3. Commit y push a GitHub
4. Usa la ruta en el formulario: `Fotos/Categoria/nombre.png`

---

## 🔄 WORKFLOW COMPLETO

### Flujo para actualizar productos:

```
1. Ve a /admin
   ↓
2. Añade/Edita/Elimina productos
   ↓
3. Click en "Save" o "Export"
   ↓
4. Se descarga products.json
   ↓
5. Reemplaza data/products.json
   ↓
6. git add data/products.json
   ↓
7. git commit -m "Update: menu changes"
   ↓
8. git push
   ↓
9. Netlify se actualiza automáticamente
   ↓
10. ¡Cambios visibles en 1-2 minutos! ✅
```

---

## ⚠️ TROUBLESHOOTING

### El producto no aparece en el sitio
- ✅ Verifica que `Available` esté marcado
- ✅ Revisa que la categoría sea correcta
- ✅ Comprueba que hiciste commit del JSON
- ✅ Espera 1-2 minutos para que Netlify actualice

### La imagen no se muestra
- ✅ Verifica la ruta de la imagen
- ✅ Comprueba que la imagen exista en GitHub
- ✅ Revisa el nombre (sin espacios, case-sensitive)
- ✅ Usa la imagen fallback como respaldo

### Los cambios no se guardan
- ✅ Descargaste el archivo JSON?
- ✅ Reemplazaste el archivo en `data/products.json`?
- ✅ Hiciste commit y push a GitHub?

---

## 🎨 TIPS Y MEJORES PRÁCTICAS

### ✨ Productos Destacados
- Máximo 3-4 productos featured por categoría
- Usa para productos premium o bestsellers
- Aparecen primero en el menú

### 💰 Precios
- Siempre usa 2 decimales: `5.90` no `5.9`
- Mantén precios competitivos
- Actualiza regularmente

### 📝 Descripciones
- Cortas y atractivas (máximo 50 caracteres)
- Destaca lo especial del producto
- Usa lenguaje apetitoso

### 🏷️ Tags
- Usa para categorizar mejor
- Ejemplos útiles:
  - `bestseller` → Más vendidos
  - `new` → Nuevos productos
  - `premium` → Productos premium
  - `seasonal` → De temporada
  - `vegan` → Opciones veganas
  - `gluten-free` → Sin gluten

---

## 📞 SOPORTE

¿Necesitas ayuda?

- 📧 Email: info@fluffybites.fi
- 📱 Teléfono: +358 45 3549022
- 💻 GitHub: [Reportar Issue](https://github.com/yassinfennir/fluffybites/issues)

---

## 🚀 PRÓXIMOS PASOS

Una vez domines el panel admin, podrás:

1. ✅ Actualizar el menú diariamente
2. ✅ Gestionar disponibilidad en tiempo real
3. ✅ Destacar productos especiales
4. ✅ Crear ofertas y promociones
5. ✅ Experimentar con nuevos productos

---

**¡Felicidades! Ya puedes gestionar tu menú sin tocar código 🎉**

*Última actualización: 2025-10-26*
