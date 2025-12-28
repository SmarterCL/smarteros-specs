#!/bin/bash
# validate-specs.sh - Script de validación local para specs MCP

echo "=== Validador Local de Especificaciones MCP ==="
echo "Fecha: $(date)"
echo ""

# Directorio base de las especificaciones
SPEC_DIR="specs/v3"
LOG_FILE="validation-$(date +%Y%m%d-%H%M%S).log"

# Función para registrar mensajes
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

log "Inicio de validación de especificaciones MCP"

# Verificar que exista el directorio de specs
if [ ! -d "$SPEC_DIR" ]; then
    log "ERROR: No se encuentra el directorio $SPEC_DIR"
    exit 1
fi

# Contar archivos YAML en las carpetas de specs
YAML_COUNT=$(find $SPEC_DIR -name "*.yaml" -o -name "*.yml" | wc -l)
log "Se encontraron $YAML_COUNT archivos de especificación"

# Validar cada archivo YAML
VALID_COUNT=0
INVALID_COUNT=0

for spec_file in $(find $SPEC_DIR -name "*.yaml" -o -name "*.yml"); do
    log "Validando: $spec_file"
    
    # Verificar sintaxis YAML
    if python3 -c "import yaml; yaml.safe_load(open('$spec_file'))" 2>/dev/null; then
        log "  ✓ Sintaxis YAML válida"
        
        # Verificar que tenga campos obligatorios para specs MCP
        if grep -q "id:" "$spec_file" && grep -q "version:" "$spec_file" && grep -q "inputs:" "$spec_file" && grep -q "outputs:" "$spec_file"; then
            log "  ✓ Campos obligatorios presentes (id, version, inputs, outputs)"
            ((VALID_COUNT++))
        else
            log "  ⚠ Archivo no contiene campos obligatorios para spec MCP"
            ((INVALID_COUNT++))
        fi
    else
        log "  ✗ Sintaxis YAML inválida"
        ((INVALID_COUNT++))
    fi
done

log "=== Resultado de la validación ==="
log "Especificaciones válidas: $VALID_COUNT"
log "Especificaciones inválidas: $INVALID_COUNT"
log "Total procesadas: $((VALID_COUNT + INVALID_COUNT))"

if [ $INVALID_COUNT -eq 0 ]; then
    log "✅ Todas las especificaciones son válidas"
    echo "Resultado: SUCCESS"
    exit 0
else
    log "❌ Algunas especificaciones tienen problemas"
    echo "Resultado: FAILURE"
    exit 1
fi