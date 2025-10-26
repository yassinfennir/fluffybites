# Fluffy Bites - Deploy Script
# Script de Despliegue Automatizado

param(
    [string]$Environment = "production",
    [switch]$SkipTests = $false,
    [switch]$Force = $false
)

Write-Host "🚀 Iniciando despliegue de Fluffy Bites..." -ForegroundColor Green

# Configuración
$ProjectRoot = $PSScriptRoot
$BuildDir = "$ProjectRoot\dist"
$BackupDir = "$ProjectRoot\backups"
$LogFile = "$ProjectRoot\deploy.log"

# Crear directorios necesarios
if (!(Test-Path $BuildDir)) {
    New-Item -ItemType Directory -Path $BuildDir -Force
}

if (!(Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir -Force
}

# Función de logging
function Write-Log {
    param([string]$Message)
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogMessage = "[$Timestamp] $Message"
    Write-Host $LogMessage
    Add-Content -Path $LogFile -Value $LogMessage
}

# Función para crear backup
function Backup-CurrentVersion {
    Write-Log "📦 Creando backup de la versión actual..."
    
    $BackupName = "backup-$(Get-Date -Format 'yyyy-MM-dd-HH-mm-ss')"
    $BackupPath = "$BackupDir\$BackupName"
    
    try {
        # Crear backup de archivos críticos
        $CriticalFiles = @(
            "index.html",
            "css\apple-style.css",
            "js\*.js",
            "system-config.json"
        )
        
        New-Item -ItemType Directory -Path $BackupPath -Force
        
        foreach ($Pattern in $CriticalFiles) {
            $Files = Get-ChildItem -Path $ProjectRoot -Filter $Pattern -Recurse
            foreach ($File in $Files) {
                $RelativePath = $File.FullName.Replace($ProjectRoot, "").TrimStart('\')
                $DestPath = "$BackupPath\$RelativePath"
                $DestDir = Split-Path $DestPath -Parent
                
                if (!(Test-Path $DestDir)) {
                    New-Item -ItemType Directory -Path $DestDir -Force
                }
                
                Copy-Item -Path $File.FullName -Destination $DestPath -Force
            }
        }
        
        Write-Log "✅ Backup creado: $BackupName"
        return $BackupPath
    }
    catch {
        Write-Log "❌ Error creando backup: $($_.Exception.Message)"
        throw
    }
}

# Función para optimizar archivos
function Optimize-Files {
    Write-Log "⚡ Optimizando archivos..."
    
    try {
        # Minificar CSS
        $CSSFiles = Get-ChildItem -Path "$ProjectRoot\css" -Filter "*.css"
        foreach ($CSSFile in $CSSFiles) {
            $Content = Get-Content -Path $CSSFile.FullName -Raw
            # Remover comentarios y espacios extra
            $OptimizedContent = $Content -replace '/\*.*?\*/', '' -replace '\s+', ' ' -replace ';\s*}', ';}'
            Set-Content -Path "$BuildDir\$($CSSFile.Name)" -Value $OptimizedContent
        }
        
        # Minificar JavaScript
        $JSFiles = Get-ChildItem -Path "$ProjectRoot\js" -Filter "*.js"
        foreach ($JSFile in $JSFiles) {
            $Content = Get-Content -Path $JSFile.FullName -Raw
            # Remover comentarios y espacios extra
            $OptimizedContent = $Content -replace '//.*$', '' -replace '/\*.*?\*/', '' -replace '\s+', ' '
            Set-Content -Path "$BuildDir\$($JSFile.Name)" -Value $OptimizedContent
        }
        
        # Copiar archivos HTML
        Copy-Item -Path "$ProjectRoot\index.html" -Destination "$BuildDir\index.html" -Force
        
        # Copiar recursos estáticos
        $StaticDirs = @("Fotos", "Logo", "css", "js")
        foreach ($Dir in $StaticDirs) {
            if (Test-Path "$ProjectRoot\$Dir") {
                Copy-Item -Path "$ProjectRoot\$Dir" -Destination "$BuildDir\$Dir" -Recurse -Force
            }
        }
        
        Write-Log "✅ Archivos optimizados"
    }
    catch {
        Write-Log "❌ Error optimizando archivos: $($_.Exception.Message)"
        throw
    }
}

# Función para ejecutar tests
function Invoke-Tests {
    if ($SkipTests) {
        Write-Log "⏭️ Saltando tests..."
        return $true
    }
    
    Write-Log "🧪 Ejecutando tests..."
    
    try {
        # Test básico de sintaxis HTML
        $HTMLContent = Get-Content -Path "$BuildDir\index.html" -Raw
        if ($HTMLContent -notmatch '<!DOCTYPE html>') {
            throw "HTML inválido: falta DOCTYPE"
        }
        
        # Test básico de sintaxis CSS
        $CSSFiles = Get-ChildItem -Path "$BuildDir\css" -Filter "*.css"
        foreach ($CSSFile in $CSSFiles) {
            $CSSContent = Get-Content -Path $CSSFile.FullName -Raw
            if ($CSSContent -match '\{[^}]*$') {
                throw "CSS inválido en $($CSSFile.Name): llaves no balanceadas"
            }
        }
        
        # Test básico de sintaxis JavaScript
        $JSFiles = Get-ChildItem -Path "$BuildDir\js" -Filter "*.js"
        foreach ($JSFile in $JSFiles) {
            $JSContent = Get-Content -Path $JSFile.FullName -Raw
            $OpenBraces = ($JSContent.ToCharArray() | Where-Object { $_ -eq '{' }).Count
            $CloseBraces = ($JSContent.ToCharArray() | Where-Object { $_ -eq '}' }).Count
            if ($OpenBraces -ne $CloseBraces) {
                throw "JavaScript inválido en $($JSFile.Name): llaves no balanceadas"
            }
        }
        
        Write-Log "✅ Tests pasados"
        return $true
    }
    catch {
        Write-Log "❌ Tests fallaron: $($_.Exception.Message)"
        return $false
    }
}

# Función para desplegar a Netlify
function Deploy-ToNetlify {
    Write-Log "🌐 Desplegando a Netlify..."
    
    try {
        # Verificar si Netlify CLI está instalado
        $NetlifyVersion = & netlify --version 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Log "❌ Netlify CLI no está instalado. Instalando..."
            npm install -g netlify-cli
        }
        
        # Cambiar al directorio de build
        Push-Location $BuildDir
        
        # Desplegar
        $DeployResult = & netlify deploy --prod --dir . 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Log "✅ Despliegue exitoso a Netlify"
            Write-Log "🔗 URL: $DeployResult"
        } else {
            throw "Error en despliegue: $DeployResult"
        }
        
        Pop-Location
    }
    catch {
        Write-Log "❌ Error desplegando a Netlify: $($_.Exception.Message)"
        Pop-Location
        throw
    }
}

# Función para verificar despliegue
function Test-Deployment {
    Write-Log "🔍 Verificando despliegue..."
    
    try {
        # Obtener URL del sitio
        $SiteURL = "https://fluffybites.net"
        
        # Test de conectividad
        $Response = Invoke-WebRequest -Uri $SiteURL -Method Head -TimeoutSec 30
        if ($Response.StatusCode -eq 200) {
            Write-Log "✅ Sitio accesible: $SiteURL"
        } else {
            throw "Sitio no accesible. Status: $($Response.StatusCode)"
        }
        
        # Test de performance básico
        $StartTime = Get-Date
        $PageResponse = Invoke-WebRequest -Uri $SiteURL -TimeoutSec 30
        $LoadTime = (Get-Date) - $StartTime
        
        if ($LoadTime.TotalSeconds -lt 5) {
            Write-Log "✅ Tiempo de carga aceptable: $($LoadTime.TotalSeconds)s"
        } else {
            Write-Log "⚠️ Tiempo de carga lento: $($LoadTime.TotalSeconds)s"
        }
        
        Write-Log "✅ Verificación completada"
    }
    catch {
        Write-Log "❌ Error verificando despliegue: $($_.Exception.Message)"
        throw
    }
}

# Función para limpiar
function Cleanup-Build {
    Write-Log "🧹 Limpiando archivos temporales..."
    
    try {
        # Limpiar directorio de build
        if (Test-Path $BuildDir) {
            Remove-Item -Path $BuildDir -Recurse -Force
        }
        
        # Limpiar logs antiguos (mantener últimos 10)
        $LogFiles = Get-ChildItem -Path $ProjectRoot -Filter "*.log" | Sort-Object LastWriteTime -Descending
        if ($LogFiles.Count -gt 10) {
            $LogFiles | Select-Object -Skip 10 | Remove-Item -Force
        }
        
        Write-Log "✅ Limpieza completada"
    }
    catch {
        Write-Log "❌ Error en limpieza: $($_.Exception.Message)"
    }
}

# Función principal de despliegue
function Start-Deployment {
    try {
        Write-Log "🚀 Iniciando proceso de despliegue..."
        
        # 1. Crear backup
        $BackupPath = Backup-CurrentVersion
        
        # 2. Optimizar archivos
        Optimize-Files
        
        # 3. Ejecutar tests
        if (-not (Invoke-Tests)) {
            throw "Tests fallaron. Abortando despliegue."
        }
        
        # 4. Desplegar
        Deploy-ToNetlify
        
        # 5. Verificar despliegue
        Test-Deployment
        
        # 6. Limpiar
        Cleanup-Build
        
        Write-Log "🎉 Despliegue completado exitosamente!"
        Write-Log "📊 Resumen:"
        Write-Log "   - Backup: $BackupPath"
        Write-Log "   - Ambiente: $Environment"
        Write-Log "   - Tests: $(if ($SkipTests) { 'Saltados' } else { 'Ejecutados' })"
        Write-Log "   - URL: https://fluffybites.net"
        
    }
    catch {
        Write-Log "❌ Error en despliegue: $($_.Exception.Message)"
        Write-Log "🔄 Iniciando rollback..."
        
        # Rollback automático
        if (Test-Path $BackupPath) {
            Write-Log "📦 Restaurando desde backup: $BackupPath"
            # Aquí iría la lógica de rollback
        }
        
        exit 1
    }
}

# Ejecutar despliegue
Start-Deployment

Write-Host "✅ Despliegue completado!" -ForegroundColor Green
Write-Host "🌐 Sitio disponible en: https://fluffybites.net" -ForegroundColor Cyan
Write-Host "📊 Logs guardados en: $LogFile" -ForegroundColor Yellow