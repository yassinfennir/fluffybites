# 🚀 Guía de Workflow de Git para Fluffy Bites

## 📋 Configuración Actual

- **Repositorio**: https://github.com/yassinfennir/fluffybites
- **Rama Principal**: `main`
- **Integración**: Netlify (actualización automática)

## ⚡ Método Rápido (Recomendado)

### Usar el script de despliegue automático:

```powershell
.\deploy.ps1 "Descripción de los cambios realizados"
```

**Ejemplo:**
```powershell
.\deploy.ps1 "Actualización del menú principal"
.\deploy.ps1 "Corrección de estilos en la página de contacto"
.\deploy.ps1 "Nuevas imágenes en la galería"
```

## 📝 Método Manual (Paso a Paso)

Si prefieres hacerlo manualmente:

```powershell
# 1. Ver qué archivos han cambiado
git status

# 2. Agregar todos los cambios al staging
git add .

# 3. Crear un commit con un mensaje descriptivo
git commit -m "Update: [describe el cambio]"

# 4. Subir los cambios a GitHub
git push origin main
```

**Ejemplos de mensajes de commit:**
- `Update: Mejoras en el diseño del header`
- `Fix: Corrección de responsive en mobile`
- `Add: Nuevas secciones en la página about`
- `Update: Optimización de imágenes`

## 🔍 Comandos Útiles

```powershell
# Ver historial de commits
git log --oneline

# Ver cambios detallados
git diff

# Ver el estado actual
git status

# Deshacer cambios no guardados
git restore <archivo>

# Verificar la configuración de Git
git config --list
```

## 🌐 Integración con Netlify

El sitio se actualiza automáticamente cuando haces push a la rama `main`:

1. Haces cambios en el código
2. Ejecutas `.\deploy.ps1 "Mensaje"`
3. GitHub recibe los cambios
4. Netlify detecta el cambio automáticamente
5. Netlify construye y despliega el sitio (30-60 segundos)

## 📁 Archivos Excluidos (.gitignore)

Los siguientes tipos de archivos no se suben al repositorio:

- Archivos de sistema (`.DS_Store`, `Thumbs.db`)
- Archivos de backup (`*_old*`, `*_new*`, `*_backup*`)
- Archivos temporales (`*.tmp`, `*.cache`)
- Carpetas de desarrollo (`node_modules/`, `.netlify/`)
- Variables de entorno (`.env`)

## ⚠️ Consejos Importantes

1. **Siempre haz commit después de cambios importantes**
2. **Usa mensajes descriptivos en español**
3. **No subas archivos pesados innecesarios**
4. **Verifica que Netlify se actualice correctamente**
5. **Haz push regularmente, no acumules muchos cambios**

## 🆘 Solución de Problemas

### Error: "fatal: not a git repository"
```powershell
# Estás en el directorio incorrecto
cd "C:\Users\kalil\Desktop\my-project\Fluffy Bites\Fluffy Bites"
```

### Error: "fatal: authentication failed"
```powershell
# Configura tus credenciales
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

### Ver qué cambios están listos para commit
```powershell
git status
git diff --cached
```

## 📞 Enlaces Útiles

- **Repositorio**: https://github.com/yassinfennir/fluffybites
- **Netlify Dashboard**: https://app.netlify.com
- **Sitio en vivo**: (configura tu URL de Netlify aquí)

---

**Última actualización**: 2025-01-25
