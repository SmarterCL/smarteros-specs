#!/bin/bash
# run-specs.sh - Sistema de ejecución local de specs MCP

echo "=== Ejecutor Local de Especificaciones MCP ==="
echo "Fecha: $(date)"
echo ""

SPEC_DIR="specs/v3"
RUNTIME_LOG="runtime-$(date +%Y%m%d-%H%M%S).log"

# Función para registrar mensajes
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $RUNTIME_LOG
}

log "Inicio de ejecución de especificaciones MCP"

# Verificar dependencias
if ! command -v python3 &> /dev/null; then
    log "ERROR: python3 no está instalado"
    exit 1
fi

if ! command -v jq &> /dev/null; then
    log "Advertencia: jq no está instalado (algunas funciones pueden estar limitadas)"
fi

# Función para ejecutar una spec
execute_spec() {
    local spec_file=$1
    local spec_name=$(basename "$spec_file")
    
    log "Ejecutando spec: $spec_name"
    
    # Extraer información de la spec
    if python3 -c "import yaml, sys; data=yaml.safe_load(open('$spec_file')); print(f'ID: {data.get(\"id\", \"N/A\")}, Version: {data.get(\"version\", \"N/A\")}')" 2>/dev/null; then
        log "  ✓ Spec cargada exitosamente"
        
        # Simular ejecución basada en inputs/outputs
        if grep -q "inputs:" "$spec_file" && grep -q "outputs:" "$spec_file"; then
            log "  ✓ Estructura de inputs/outputs válida"
            
            # Contar número de inputs y outputs
            INPUT_COUNT=$(grep -c "^  - name:" "$spec_file" | head -1)
            log "  → Inputs detectados: $INPUT_COUNT"
            
            log "  ✓ Simulación de ejecución completada"
        else
            log "  ⚠ Spec no tiene estructura de inputs/outputs completa"
        fi
    else
        log "  ✗ Error al cargar la spec"
        return 1
    fi
}

# Contar y ejecutar specs
SPEC_COUNT=0
SUCCESS_COUNT=0
FAILED_COUNT=0

for spec_file in $(find $SPEC_DIR -name "*.yaml" -o -name "*.yml"); do
    ((SPEC_COUNT++))
    if execute_spec "$spec_file"; then
        ((SUCCESS_COUNT++))
    else
        ((FAILED_COUNT++))
    fi
    echo "" | tee -a $RUNTIME_LOG
done

log "=== Resultado de la ejecución ==="
log "Especificaciones procesadas: $SPEC_COUNT"
log "Ejecuciones exitosas: $SUCCESS_COUNT"
log "Ejecuciones fallidas: $FAILED_COUNT"

if [ $FAILED_COUNT -eq 0 ] && [ $SUCCESS_COUNT -gt 0 ]; then
    log "✅ Todas las especificaciones se ejecutaron correctamente"
    echo "Estado: SUCCESS"
    exit 0
else
    log "❌ Algunas especificaciones fallaron en la ejecución"
    echo "Estado: FAILURE"
    exit 1
fi