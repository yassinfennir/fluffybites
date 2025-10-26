#!/bin/bash

# 🛡️ SCRIPT DE MONITOREO 24/7 PARA PLATAFORMA ALL-IN-ONE
# Ejecutar cada hora para verificar estado del sitio
# =====================================================

echo "🔍 Iniciando monitoreo del sitio - $(date)"

# Configuración
DOMAIN="https://tu-dominio.com"
EMAIL_ADMIN="admin@tu-dominio.com"
LOG_FILE="/var/log/monitor-site.log"
STATUS_FILE="/tmp/site-status.json"

# Función de logging
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

# Función para enviar alertas
send_alert() {
    local subject="$1"
    local message="$2"
    local priority="$3"
    
    # Email
    echo "$message" | mail -s "$priority $subject" $EMAIL_ADMIN
    
    # Log
    log_message "🚨 ALERTA ENVIADA: $subject"
    
    # Slack/Discord webhook (opcional)
    if [ ! -z "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
             --data "{\"text\":\"$priority $subject: $message\"}" \
             $SLACK_WEBHOOK_URL
    fi
}

# Función para verificar respuesta HTTP
check_http_status() {
    local url="$1"
    local timeout="${2:-30}"
    
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" \
                           --max-time $timeout \
                           --connect-timeout 10 \
                           "$url")
    
    echo $status_code
}

# Función para verificar tiempo de respuesta
check_response_time() {
    local url="$1"
    local timeout="${2:-30}"
    
    local response_time=$(curl -s -o /dev/null -w "%{time_total}" \
                             --max-time $timeout \
                             --connect-timeout 10 \
                             "$url")
    
    echo $response_time
}

# Función para verificar contenido específico
check_content() {
    local url="$1"
    local expected_content="$2"
    
    local content=$(curl -s --max-time 30 "$url" | grep -i "$expected_content")
    
    if [ ! -z "$content" ]; then
        echo "OK"
    else
        echo "FAIL"
    fi
}

# Función para verificar base de datos
check_database() {
    if command -v psql &> /dev/null; then
        local db_status=$(psql -d all_in_one_db -c "SELECT 1;" 2>/dev/null | grep -c "1 row")
        if [ "$db_status" -eq 1 ]; then
            echo "OK"
        else
            echo "FAIL"
        fi
    else
        echo "SKIP"
    fi
}

# Función para verificar servicios
check_services() {
    local services=("node" "nginx" "postgresql")
    local failed_services=()
    
    for service in "${services[@]}"; do
        if ! systemctl is-active --quiet $service; then
            failed_services+=($service)
        fi
    done
    
    if [ ${#failed_services[@]} -eq 0 ]; then
        echo "OK"
    else
        echo "FAIL: ${failed_services[*]}"
    fi
}

# Función para verificar espacio en disco
check_disk_space() {
    local usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
    echo $usage
}

# Función para verificar memoria
check_memory() {
    local mem_usage=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
    echo $mem_usage
}

# Función para verificar CPU
check_cpu() {
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//')
    echo $cpu_usage
}

# Función para verificar certificado SSL
check_ssl_certificate() {
    local domain="$1"
    local expiry_date=$(echo | openssl s_client -servername $domain -connect $domain:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
    
    if [ ! -z "$expiry_date" ]; then
        local expiry_timestamp=$(date -d "$expiry_date" +%s)
        local current_timestamp=$(date +%s)
        local days_until_expiry=$(( (expiry_timestamp - current_timestamp) / 86400 ))
        echo $days_until_expiry
    else
        echo "ERROR"
    fi
}

# Función para verificar APIs externas
check_external_apis() {
    local apis=(
        "https://api.stripe.com/v1/account"
        "https://graph.facebook.com/v18.0/me"
        "https://api.twitter.com/2/users/me"
    )
    
    local failed_apis=()
    
    for api in "${apis[@]}"; do
        local status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$api")
        if [ "$status" -ne 200 ] && [ "$status" -ne 401 ]; then
            failed_apis+=($api)
        fi
    done
    
    if [ ${#failed_apis[@]} -eq 0 ]; then
        echo "OK"
    else
        echo "FAIL: ${failed_apis[*]}"
    fi
}

# Función para generar reporte de estado
generate_status_report() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    cat > $STATUS_FILE << EOF
{
  "timestamp": "$timestamp",
  "domain": "$DOMAIN",
  "checks": {
    "http_status": "$(check_http_status $DOMAIN)",
    "response_time": "$(check_response_time $DOMAIN)",
    "content_check": "$(check_content $DOMAIN 'All-in-One')",
    "database": "$(check_database)",
    "services": "$(check_services)",
    "disk_space": "$(check_disk_space)%",
    "memory_usage": "$(check_memory)%",
    "cpu_usage": "$(check_cpu)%",
    "ssl_expiry_days": "$(check_ssl_certificate tu-dominio.com)",
    "external_apis": "$(check_external_apis)"
  }
}
EOF
}

# Función principal de monitoreo
main_monitoring() {
    log_message "🔍 Iniciando verificación completa del sitio"
    
    # Generar reporte de estado
    generate_status_report
    
    # Verificar estado HTTP
    local http_status=$(check_http_status $DOMAIN)
    local response_time=$(check_response_time $DOMAIN)
    
    log_message "📊 Estado HTTP: $http_status"
    log_message "⏱️ Tiempo de respuesta: ${response_time}s"
    
    # Verificaciones críticas
    if [ "$http_status" != "200" ]; then
        send_alert "SITIO DOWN" "El sitio $DOMAIN no responde. Estado HTTP: $http_status" "🚨"
        
        # Intentar reiniciar servicios
        log_message "🔄 Intentando reiniciar servicios..."
        systemctl restart nginx
        systemctl restart nodejs-app
        
        # Esperar y verificar nuevamente
        sleep 30
        local new_status=$(check_http_status $DOMAIN)
        if [ "$new_status" = "200" ]; then
            log_message "✅ Servicios reiniciados exitosamente"
            send_alert "SITIO RECUPERADO" "El sitio $DOMAIN está funcionando nuevamente" "✅"
        else
            log_message "❌ Reinicio falló, estado: $new_status"
            send_alert "REINICIO FALLÓ" "No se pudo recuperar el sitio $DOMAIN" "🚨"
        fi
    else
        log_message "✅ Sitio funcionando correctamente"
    fi
    
    # Verificar tiempo de respuesta
    if (( $(echo "$response_time > 5" | bc -l) )); then
        send_alert "SITIO LENTO" "El sitio $DOMAIN responde en ${response_time}s (lento)" "⚠️"
    fi
    
    # Verificar base de datos
    local db_status=$(check_database)
    if [ "$db_status" = "FAIL" ]; then
        send_alert "BASE DE DATOS DOWN" "La base de datos no responde" "🚨"
    fi
    
    # Verificar servicios
    local services_status=$(check_services)
    if [[ "$services_status" == FAIL* ]]; then
        send_alert "SERVICIOS DOWN" "Servicios fallando: $services_status" "🚨"
    fi
    
    # Verificar espacio en disco
    local disk_usage=$(check_disk_space)
    if [ "$disk_usage" -gt 85 ]; then
        send_alert "ESPACIO EN DISCO BAJO" "Uso de disco: $disk_usage%" "⚠️"
    fi
    
    # Verificar memoria
    local mem_usage=$(check_memory)
    if [ "$mem_usage" -gt 90 ]; then
        send_alert "MEMORIA ALTA" "Uso de memoria: $mem_usage%" "⚠️"
    fi
    
    # Verificar certificado SSL
    local ssl_days=$(check_ssl_certificate tu-dominio.com)
    if [ "$ssl_days" != "ERROR" ] && [ "$ssl_days" -lt 30 ]; then
        send_alert "CERTIFICADO SSL EXPIRANDO" "Certificado expira en $ssl_days días" "⚠️"
    fi
    
    # Verificar APIs externas
    local apis_status=$(check_external_apis)
    if [[ "$apis_status" == FAIL* ]]; then
        send_alert "APIS EXTERNAS FALLANDO" "APIs con problemas: $apis_status" "⚠️"
    fi
    
    # Verificar contenido específico
    local content_status=$(check_content $DOMAIN "All-in-One")
    if [ "$content_status" = "FAIL" ]; then
        send_alert "CONTENIDO ALTERADO" "El contenido esperado no se encuentra en la página" "⚠️"
    fi
    
    # Generar estadísticas de uptime
    local uptime_file="/tmp/uptime-stats.txt"
    if [ ! -f "$uptime_file" ]; then
        echo "0" > $uptime_file
    fi
    
    local current_uptime=$(cat $uptime_file)
    if [ "$http_status" = "200" ]; then
        echo $((current_uptime + 1)) > $uptime_file
    else
        echo "0" > $uptime_file
    fi
    
    local uptime_percentage=$((current_uptime * 100 / 24))
    log_message "📈 Uptime últimas 24h: $uptime_percentage%"
    
    # Limpiar logs antiguos
    find /var/log -name "monitor-site.log*" -mtime +7 -delete 2>/dev/null
    
    log_message "✅ Monitoreo completado"
}

# Función para verificación rápida (cada 5 minutos)
quick_check() {
    local http_status=$(check_http_status $DOMAIN 10)
    
    if [ "$http_status" != "200" ]; then
        log_message "🚨 ALERTA RÁPIDA: Sitio no responde ($http_status)"
        send_alert "SITIO DOWN" "Verificación rápida falló: $http_status" "🚨"
    else
        log_message "✅ Verificación rápida OK"
    fi
}

# Función para monitoreo de rendimiento
performance_monitoring() {
    local response_time=$(check_response_time $DOMAIN)
    local mem_usage=$(check_memory)
    local cpu_usage=$(check_cpu)
    local disk_usage=$(check_disk_space)
    
    # Guardar métricas históricas
    local metrics_file="/tmp/performance-metrics.json"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    if [ ! -f "$metrics_file" ]; then
        echo "[]" > $metrics_file
    fi
    
    # Añadir nueva métrica
    local new_metric="{\"timestamp\":\"$timestamp\",\"response_time\":$response_time,\"memory\":$mem_usage,\"cpu\":$cpu_usage,\"disk\":$disk_usage}"
    
    # Mantener solo últimas 1000 entradas
    local temp_file=$(mktemp)
    jq --argjson new "$new_metric" '. + [$new] | .[-1000:]' $metrics_file > $temp_file
    mv $temp_file $metrics_file
    
    log_message "📊 Métricas guardadas: RT=${response_time}s, MEM=${mem_usage}%, CPU=${cpu_usage}%, DISK=${disk_usage}%"
}

# Ejecutar monitoreo según el tipo
case "${1:-full}" in
    "quick")
        quick_check
        ;;
    "performance")
        performance_monitoring
        ;;
    "full"|*)
        main_monitoring
        performance_monitoring
        ;;
esac

echo "================================================" | tee -a $LOG_FILE
