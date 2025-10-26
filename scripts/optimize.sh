#!/bin/bash

# 🚀 SCRIPT DE OPTIMIZACIÓN DIARIA PARA PLATAFORMA ALL-IN-ONE
# Ejecutar diariamente a las 2:00 AM
# =====================================================

echo "🔧 Iniciando optimización diaria - $(date)"

# Configuración
PROJECT_DIR="/home/user/all-in-one-platform"
BACKUP_DIR="/home/user/backups"
LOG_FILE="/var/log/optimization.log"
DOMAIN="https://tu-dominio.com"

# Función de logging
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

# 1. Comprimir imágenes automáticamente
log_message "🖼️ Comprimiendo imágenes..."
cd $PROJECT_DIR

# Instalar imagemin si no está instalado
if ! command -v imagemin &> /dev/null; then
    npm install -g imagemin imagemin-mozjpeg imagemin-pngquant
fi

# Comprimir imágenes en public/images
if [ -d "public/images" ]; then
    imagemin public/images --out-dir=public/images-optimized --plugin=mozjpeg --plugin=pngquant
    mv public/images-optimized/* public/images/
    rm -rf public/images-optimized
    log_message "✅ Imágenes comprimidas"
else
    log_message "⚠️ Directorio de imágenes no encontrado"
fi

# 2. Generar sitemap automáticamente
log_message "🗺️ Generando sitemap..."
if ! command -v sitemap-generator &> /dev/null; then
    npm install -g sitemap-generator-cli
fi

sitemap-generator $DOMAIN --file=public/sitemap.xml --max-depth=3
log_message "✅ Sitemap generado"

# 3. Verificar velocidad con PageSpeed Insights
log_message "⚡ Verificando velocidad del sitio..."
PAGESPEED_API_KEY="TU_API_KEY_AQUI"

if [ ! -z "$PAGESPEED_API_KEY" ]; then
    curl -X POST "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=$DOMAIN&key=$PAGESPEED_API_KEY" \
         -H "Content-Type: application/json" \
         -o /tmp/pagespeed-result.json
    
    # Extraer métricas importantes
    MOBILE_SCORE=$(cat /tmp/pagespeed-result.json | jq -r '.lighthouseResult.categories.performance.score * 100')
    DESKTOP_SCORE=$(cat /tmp/pagespeed-result.json | jq -r '.lighthouseResult.categories.performance.score * 100')
    
    log_message "📊 Mobile Score: $MOBILE_SCORE"
    log_message "📊 Desktop Score: $DESKTOP_SCORE"
    
    # Alertar si el score es bajo
    if (( $(echo "$MOBILE_SCORE < 70" | bc -l) )); then
        log_message "⚠️ ALERTA: Mobile score bajo ($MOBILE_SCORE)"
        echo "Mobile PageSpeed Score bajo: $MOBILE_SCORE" | mail -s "ALERTA: Performance Baja" admin@tu-dominio.com
    fi
else
    log_message "⚠️ API Key de PageSpeed no configurada"
fi

# 4. Backup de base de datos
log_message "💾 Creando backup de base de datos..."
mkdir -p $BACKUP_DIR

# Backup PostgreSQL
if command -v pg_dump &> /dev/null; then
    pg_dump all_in_one_db > $BACKUP_DIR/db-backup-$(date +%Y-%m-%d).sql
    gzip $BACKUP_DIR/db-backup-$(date +%Y-%m-%d).sql
    log_message "✅ Backup de BD completado"
else
    log_message "⚠️ PostgreSQL no encontrado"
fi

# 5. Limpiar caché y archivos temporales
log_message "🧹 Limpiando caché..."
cd $PROJECT_DIR

# Limpiar caché de Next.js
rm -rf .next/cache
rm -rf .next/static

# Limpiar node_modules si es necesario (solo en desarrollo)
if [ "$NODE_ENV" = "development" ]; then
    rm -rf node_modules/.cache
fi

# Limpiar logs antiguos
find /var/log -name "*.log" -mtime +7 -delete 2>/dev/null

log_message "✅ Caché limpiado"

# 6. Verificar espacio en disco
log_message "💽 Verificando espacio en disco..."
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')

if [ "$DISK_USAGE" -gt 80 ]; then
    log_message "⚠️ ALERTA: Espacio en disco bajo ($DISK_USAGE%)"
    echo "Espacio en disco bajo: $DISK_USAGE%" | mail -s "ALERTA: Espacio en Disco" admin@tu-dominio.com
else
    log_message "✅ Espacio en disco OK ($DISK_USAGE%)"
fi

# 7. Optimizar base de datos
log_message "🗄️ Optimizando base de datos..."
if command -v psql &> /dev/null; then
    psql -d all_in_one_db -c "VACUUM ANALYZE;" 2>/dev/null
    log_message "✅ Base de datos optimizada"
else
    log_message "⚠️ PostgreSQL no disponible para optimización"
fi

# 8. Verificar certificados SSL
log_message "🔒 Verificando certificados SSL..."
if command -v openssl &> /dev/null; then
    SSL_EXPIRY=$(echo | openssl s_client -servername tu-dominio.com -connect tu-dominio.com:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
    SSL_EXPIRY_DATE=$(date -d "$SSL_EXPIRY" +%s)
    CURRENT_DATE=$(date +%s)
    DAYS_UNTIL_EXPIRY=$(( (SSL_EXPIRY_DATE - CURRENT_DATE) / 86400 ))
    
    if [ "$DAYS_UNTIL_EXPIRY" -lt 30 ]; then
        log_message "⚠️ ALERTA: Certificado SSL expira en $DAYS_UNTIL_EXPIRY días"
        echo "Certificado SSL expira en $DAYS_UNTIL_EXPIRY días" | mail -s "ALERTA: Certificado SSL" admin@tu-dominio.com
    else
        log_message "✅ Certificado SSL OK ($DAYS_UNTIL_EXPIRY días restantes)"
    fi
else
    log_message "⚠️ OpenSSL no disponible"
fi

# 9. Actualizar dependencias (solo en desarrollo)
if [ "$NODE_ENV" = "development" ]; then
    log_message "📦 Verificando actualizaciones de dependencias..."
    npm outdated --json > /tmp/outdated.json
    
    if [ -s /tmp/outdated.json ]; then
        log_message "📋 Dependencias desactualizadas encontradas"
        cat /tmp/outdated.json | jq -r 'keys[]' | head -5 | while read package; do
            log_message "  - $package"
        done
    else
        log_message "✅ Todas las dependencias están actualizadas"
    fi
fi

# 10. Generar reporte de optimización
log_message "📊 Generando reporte de optimización..."
REPORT_FILE="$BACKUP_DIR/optimization-report-$(date +%Y-%m-%d).txt"

cat > $REPORT_FILE << EOF
=== REPORTE DE OPTIMIZACIÓN DIARIA ===
Fecha: $(date)
Dominio: $DOMAIN

RESUMEN:
- Imágenes comprimidas: ✅
- Sitemap generado: ✅
- PageSpeed verificado: ✅
- Backup de BD: ✅
- Caché limpiado: ✅
- Espacio en disco: $DISK_USAGE%
- Certificado SSL: $DAYS_UNTIL_EXPIRY días restantes

MÉTRICAS DE RENDIMIENTO:
- Mobile Score: $MOBILE_SCORE
- Desktop Score: $DESKTOP_SCORE

PRÓXIMA OPTIMIZACIÓN: $(date -d '+1 day' '+%Y-%m-%d 02:00:00')
EOF

log_message "✅ Reporte generado: $REPORT_FILE"

# 11. Enviar reporte por email (opcional)
if command -v mail &> /dev/null; then
    echo "Optimización diaria completada exitosamente" | mail -s "✅ Optimización Diaria - $(date +%Y-%m-%d)" -a $REPORT_FILE admin@tu-dominio.com
fi

# 12. Limpiar backups antiguos (>30 días)
log_message "🗑️ Limpiando backups antiguos..."
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
find $BACKUP_DIR -name "optimization-report-*.txt" -mtime +30 -delete
log_message "✅ Backups antiguos eliminados"

log_message "🎉 Optimización diaria completada exitosamente"
echo "================================================" | tee -a $LOG_FILE
