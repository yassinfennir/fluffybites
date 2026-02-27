# Publicar Fluffy Bites en GitHub Pages (GRATIS)

## Resumen rápido

1. **Subir el código** → `git push` (ya configurado)
2. **Activar GitHub Pages** → En GitHub.com: Settings → Pages → Source: main
3. **Dominio propio** → Cuando tengas tu dominio, añade el archivo `CNAME` y configura DNS

---

## Paso 1: Subir el código a GitHub

Desde Cursor o terminal, en la carpeta del proyecto:

```powershell
cd "c:\Users\kalil\Desktop\my-project\Fluffy Bites\Fluffy Bites"
git add index.html style.css script.js Logo/ Fotos/ PUBLICAR-GITHUB-PAGES.md
git commit -m "Sitio Fluffy Bites listo para GitHub Pages"
git push origin main
```

Si pide usuario/contraseña, usa tu cuenta de GitHub. Si usas 2FA, necesitarás un **Personal Access Token** en lugar de la contraseña: [Crear token](https://github.com/settings/tokens).

---

## Paso 2: Activar GitHub Pages

1. Ve a **https://github.com/yassinfennir/fluffybites**
2. Clic en **Settings**
3. En el menú izquierdo, **Pages**
4. En **Source**, elige **Deploy from a branch**
5. **Branch:** `main` | **Folder:** `/ (root)`
6. Clic en **Save**

En 1–2 minutos tu sitio estará en:
**https://yassinfennir.github.io/fluffybites/**

---

## Paso 3: Usar tu dominio propio (cuando tengas los datos DNS)

### 3.1 Crear archivo CNAME

Cuando tengas tu dominio (ej: `fluffybites.com` o `www.fluffybites.com`), crea el archivo `CNAME` en la raíz del proyecto con **una sola línea**:

```
fluffybites.com
```

o, si prefieres con www:

```
www.fluffybites.com
```

Luego:

```powershell
git add CNAME
git commit -m "Añadir dominio personalizado"
git push origin main
```

### 3.2 Configurar en GitHub

1. GitHub → fluffybites → **Settings** → **Pages**
2. En **Custom domain**, escribe tu dominio (ej: `fluffybites.com`)
3. Marca **Enforce HTTPS** (tras propagar DNS)

### 3.3 Configurar DNS en tu proveedor

Ve al panel de tu dominio (donde compraste el dominio) y añade:

| Tipo | Nombre | Valor |
|------|--------|-------|
| **A** | @ | 185.199.108.153 |
| **A** | @ | 185.199.109.153 |
| **A** | @ | 185.199.110.153 |
| **A** | @ | 185.199.111.153 |
| **CNAME** | www | yassinfennir.github.io |

*Si usas solo `www.tudominio.com`, basta con el CNAME de www.*

La propagación puede tardar de 5 minutos a 48 horas.

---

## Registros DNS explicados

| Registro | Nombre | Valor | Uso |
|----------|--------|-------|-----|
| A | @ | 185.199.108.153 | Dominio raíz (tudominio.com) |
| A | @ | 185.199.109.153 | Dominio raíz |
| A | @ | 185.199.110.153 | Dominio raíz |
| A | @ | 185.199.111.153 | Dominio raíz |
| CNAME | www | yassinfennir.github.io | Subdominio www |

Cuando tengas los datos concretos de tu proveedor (registrar), pégalos aquí y te indico qué cambiar si hace falta.

---

## Resumen de URLs

| Antes | Después |
|-------|---------|
| — | https://yassinfennir.github.io/fluffybites/ |
| — | https://tudominio.com (tras configurar DNS) |

Todo esto es **100% gratuito** con GitHub Pages.
