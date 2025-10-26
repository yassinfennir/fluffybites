#!/bin/bash

# 💾 SCRIPT DE BACKUP AUTOMÁTICO 3 VECES AL DÍA
# Ejecutar a las 6:00, 14:00 y 22:00
# =====================================================

echo "💾 Iniciando backup automático - $(date)"

# Configuración
BACKUP_DIR="/home/user/backups"
PROJECT_DIR="/home/user/all-in-one-platform"
DB_NAME="all_in_one_db"
DB_USER="postgres"
S3_BUCKET="mi-bucket-backups"
LOG_FILE="/var/log/backup.log"
DATE=$(date +%Y-%m-%d_%H:%M:%S)

# Crear directorio de backup si no existe
mkdir -p $BACKUP_DIR

# Función de logging
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

# Función para verificar espacio en disco
check_disk_space() {
    local required_space=$1
    local available_space=$(df -BG $BACKUP_DIR | awk 'NR==2 {print $4}' | sed 's/G//')
    
    if [ "$available_space" -lt "$required_space" ]; then
        log_message "⚠️ ALERTA: Espacio insuficiente. Disponible: ${available_space}G, Requerido: ${required_space}G"
        return 1
    fi
    return 0
}

# Función para backup de base de datos PostgreSQL
backup_database() {
    log_message "🗄️ Iniciando backup de base de datos..."
    
    local db_backup_file="$BACKUP_DIR/db_backup_$DATE.sql"
    local db_backup_compressed="$BACKUP_DIR/db_backup_$DATE.sql.gz"
    
    try {
        # Backup de la base de datos
        pg_dump -h localhost -U $DB_USER -d $DB_NAME > $db_backup_file
        
        if [ $? -eq 0 ]; then
            # Comprimir backup
            gzip $db_backup_file
            
            # Verificar integridad
            if [ -f "$db_backup_compressed" ]; then
                local file_size=$(du -h "$db_backup_compressed" | cut -f1)
                log_message "✅ Backup de BD completado: $db_backup_compressed ($file_size)"
                echo "$db_backup_compressed"
            else
                log_message "❌ Error: Archivo de backup no encontrado"
                return 1
            fi
        else
            log_message "❌ Error en backup de base de datos"
            return 1
        fi
    } catch {
        log_message "❌ Error crítico en backup de BD"
        return 1
    }
}

# Función para backup de archivos del proyecto
backup_project_files() {
    log_message "📁 Iniciando backup de archivos del proyecto..."
    
    local files_backup="$BACKUP_DIR/files_backup_$DATE.tar.gz"
    
    try {
        # Crear backup de archivos importantes
        tar -czf $files_backup \
            --exclude='node_modules' \
            --exclude='.git' \
            --exclude='.next' \
            --exclude='*.log' \
            --exclude='backups' \
            -C $PROJECT_DIR \
            .
        
        if [ $? -eq 0 ]; then
            local file_size=$(du -h "$files_backup" | cut -f1)
            log_message "✅ Backup de archivos completado: $files_backup ($file_size)"
            echo "$files_backup"
        else
            log_message "❌ Error en backup de archivos"
            return 1
        fi
    } catch {
        log_message "❌ Error crítico en backup de archivos"
        return 1
    }
}

# Función para backup de configuración del sistema
backup_system_config() {
    log_message "⚙️ Iniciando backup de configuración del sistema..."
    
    local config_backup="$BACKUP_DIR/config_backup_$DATE.tar.gz"
    
    try {
        # Backup de archivos de configuración importantes
        tar -czf $config_backup \
            /etc/nginx/nginx.conf \
            /etc/nginx/sites-available/ \
            /etc/systemd/system/ \
            /home/user/.env* \
            /home/user/automation/ \
            /home/user/scripts/ \
            2>/dev/null
        
        if [ $? -eq 0 ]; then
            local file_size=$(du -h "$config_backup" | cut -f1)
            log_message "✅ Backup de configuración completado: $config_backup ($file_size)"
            echo "$config_backup"
        else
            log_message "⚠️ Backup de configuración parcial (algunos archivos no encontrados)"
            echo "$config_backup"
        fi
    } catch {
        log_message "❌ Error en backup de configuración"
        return 1
    }
}

# Función para backup de logs
backup_logs() {
    log_message "📋 Iniciando backup de logs..."
    
    local logs_backup="$BACKUP_DIR/logs_backup_$DATE.tar.gz"
    
    try {
        # Backup de logs importantes
        tar -czf $logs_backup \
            /var/log/nginx/ \
            /var/log/cron.log \
            /var/log/optimization.log \
            /var/log/monitor-site.log \
            /var/log/backup.log \
            $PROJECT_DIR/logs/ \
            2>/dev/null
        
        if [ $? -eq 0 ]; then
            local file_size=$(du -h "$logs_backup" | cut -f1)
            log_message "✅ Backup de logs completado: $logs_backup ($file_size)"
            echo "$logs_backup"
        else
            log_message "⚠️ Backup de logs parcial"
            echo "$logs_backup"
        fi
    } catch {
        log_message "❌ Error en backup de logs"
        return 1
    }
}

# Función para sincronizar con AWS S3
sync_to_s3() {
    local backup_files=("$@")
    
    log_message "☁️ Iniciando sincronización con S3..."
    
    if ! command -v aws &> /dev/null; then
        log_message "⚠️ AWS CLI no instalado, saltando sincronización S3"
        return 0
    fi
    
    try {
        # Crear directorio temporal para esta sesión de backup
        local temp_dir="/tmp/backup_session_$DATE"
        mkdir -p $temp_dir
        
        # Copiar archivos de backup al directorio temporal
        for file in "${backup_files[@]}"; do
            if [ -f "$file" ]; then
                cp "$file" "$temp_dir/"
            fi
        done
        
        # Crear archivo de metadatos
        cat > "$temp_dir/backup_metadata.json" << EOF
{
  "backup_date": "$DATE",
  "backup_type": "automated",
  "files": [
    $(printf '"%s",' "${backup_files[@]}" | sed 's/,$//')
  ],
  "system_info": {
    "hostname": "$(hostname)",
    "disk_usage": "$(df -h / | awk 'NR==2 {print $5}')",
    "memory_usage": "$(free | awk 'NR==2{printf "%.1f%%", $3*100/$2}')"
  }
}
EOF
        
        # Sincronizar con S3
        aws s3 sync "$temp_dir" "s3://$S3_BUCKET/backups/$DATE/" --delete
        
        if [ $? -eq 0 ]; then
            log_message "✅ Sincronización con S3 completada"
            
            # Limpiar directorio temporal
            rm -rf "$temp_dir"
        else
            log_message "❌ Error en sincronización con S3"
            rm -rf "$temp_dir"
            return 1
        fi
    } catch {
        log_message "❌ Error crítico en sincronización S3"
        return 1
    }
}

# Función para verificar integridad de backups
verify_backups() {
    local backup_files=("$@")
    local verification_passed=true
    
    log_message "🔍 Verificando integridad de backups..."
    
    for file in "${backup_files[@]}"; do
        if [ -f "$file" ]; then
            # Verificar que el archivo no esté corrupto
            if [[ "$file" == *.gz ]]; then
                if ! gzip -t "$file" 2>/dev/null; then
                    log_message "❌ Archivo corrupto detectado: $file"
                    verification_passed=false
                else
                    log_message "✅ Integridad verificada: $file"
                fi
            elif [[ "$file" == *.tar.gz ]]; then
                if ! tar -tzf "$file" >/dev/null 2>&1; then
                    log_message "❌ Archivo corrupto detectado: $file"
                    verification_passed=false
                else
                    log_message "✅ Integridad verificada: $file"
                fi
            fi
        else
            log_message "❌ Archivo no encontrado: $file"
            verification_passed=false
        fi
    done
    
    if [ "$verification_passed" = true ]; then
        log_message "✅ Verificación de integridad completada exitosamente"
        return 0
    else
        log_message "❌ Verificación de integridad falló"
        return 1
    fi
}

# Función para limpiar backups antiguos
cleanup_old_backups() {
    log_message "🧹 Limpiando backups antiguos..."
    
    # Eliminar backups locales más antiguos que 30 días
    find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
    find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
    find $BACKUP_DIR -name "backup_metadata.json" -mtime +30 -delete
    
    # Eliminar backups de S3 más antiguos que 90 días (si AWS CLI está disponible)
    if command -v aws &> /dev/null; then
        aws s3 ls "s3://$S3_BUCKET/backups/" | while read -r line; do
            backup_date=$(echo $line | awk '{print $1}')
            if [ ! -z "$backup_date" ]; then
                backup_timestamp=$(date -d "$backup_date" +%s)
                current_timestamp=$(date +%s)
                days_old=$(( (current_timestamp - backup_timestamp) / 86400 ))
                
                if [ $days_old -gt 90 ]; then
                    backup_folder=$(echo $line | awk '{print $2}' | sed 's|/||')
                    aws s3 rm "s3://$S3_BUCKET/backups/$backup_folder" --recursive
                    log_message "🗑️ Eliminado backup S3 antiguo: $backup_folder"
                fi
            fi
        done
    fi
    
    log_message "✅ Limpieza de backups antiguos completada"
}

# Función para generar reporte de backup
generate_backup_report() {
    local backup_files=("$@")
    local report_file="$BACKUP_DIR/backup_report_$DATE.txt"
    
    log_message "📊 Generando reporte de backup..."
    
    cat > $report_file << EOF
=== REPORTE DE BACKUP AUTOMÁTICO ===
Fecha: $(date)
Tipo: Backup Automático
Duración: $(date -d @$SECONDS -u +%H:%M:%S)

ARCHIVOS GENERADOS:
EOF

    for file in "${backup_files[@]}"; do
        if [ -f "$file" ]; then
            local file_size=$(du -h "$file" | cut -f1)
            echo "- $file ($file_size)" >> $report_file
        fi
    done

    cat >> $report_file << EOF

ESTADÍSTICAS DEL SISTEMA:
- Espacio en disco usado: $(df -h / | awk 'NR==2 {print $5}')
- Memoria usada: $(free | awk 'NR==2{printf "%.1f%%", $3*100/$2}')
- Carga del sistema: $(uptime | awk -F'load average:' '{print $2}')

ESTADO DE SERVICIOS:
- PostgreSQL: $(systemctl is-active postgresql)
- Nginx: $(systemctl is-active nginx)
- Node.js App: $(systemctl is-active nodejs-app)

PRÓXIMO BACKUP: $(date -d '+8 hours' '+%Y-%m-%d %H:%M:%S')
EOF

    log_message "✅ Reporte generado: $report_file"
    echo "$report_file"
}

# Función para enviar notificación de backup
send_backup_notification() {
    local status="$1"
    local backup_files=("${@:2}")
    local report_file="$BACKUP_DIR/backup_report_$DATE.txt"
    
    if command -v mail &> /dev/null; then
        local subject=""
        local message=""
        
        if [ "$status" = "success" ]; then
            subject="✅ Backup Automático Exitoso"
            message="El backup automático se completó exitosamente."
        else
            subject="❌ Backup Automático Falló"
            message="El backup automático falló. Revisa los logs."
        fi
        
        cat > /tmp/backup_email.txt << EOF
$message

Archivos generados:
$(printf '%s\n' "${backup_files[@]}")

Reporte completo adjunto.

Fecha: $(date)
Sistema: $(hostname)
EOF

        mail -s "$subject" -a "$report_file" admin@tu-dominio.com < /tmp/backup_email.txt
        rm -f /tmp/backup_email.txt
    fi
}

# Función principal de backup
main_backup() {
    local start_time=$(date +%s)
    local backup_files=()
    local backup_success=true
    
    log_message "🚀 Iniciando proceso de backup completo..."
    
    # Verificar espacio en disco (requerir al menos 2GB)
    if ! check_disk_space 2; then
        log_message "❌ Backup cancelado por espacio insuficiente"
        send_backup_notification "failed"
        exit 1
    fi
    
    # Backup de base de datos
    if db_backup=$(backup_database); then
        backup_files+=("$db_backup")
    else
        backup_success=false
    fi
    
    # Backup de archivos del proyecto
    if files_backup=$(backup_project_files); then
        backup_files+=("$files_backup")
    else
        backup_success=false
    fi
    
    # Backup de configuración del sistema
    if config_backup=$(backup_system_config); then
        backup_files+=("$config_backup")
    else
        backup_success=false
    fi
    
    # Backup de logs
    if logs_backup=$(backup_logs); then
        backup_files+=("$logs_backup")
    else
        backup_success=false
    fi
    
    # Verificar integridad de backups
    if ! verify_backups "${backup_files[@]}"; then
        backup_success=false
    fi
    
    # Sincronizar con S3
    if ! sync_to_s3 "${backup_files[@]}"; then
        log_message "⚠️ Sincronización S3 falló, pero backups locales están OK"
    fi
    
    # Generar reporte
    local report_file=$(generate_backup_report "${backup_files[@]}")
    backup_files+=("$report_file")
    
    # Limpiar backups antiguos
    cleanup_old_backups
    
    # Calcular tiempo total
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    if [ "$backup_success" = true ]; then
        log_message "🎉 Backup completado exitosamente en ${duration}s"
        send_backup_notification "success" "${backup_files[@]}"
    else
        log_message "❌ Backup completado con errores en ${duration}s"
        send_backup_notification "failed" "${backup_files[@]}"
    fi
    
    log_message "================================================"
}

# Ejecutar backup principal
main_backup
