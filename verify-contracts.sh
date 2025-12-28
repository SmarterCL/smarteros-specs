#!/bin/bash
# verify-contracts.sh - Herramienta de verificación de contratos MCP

echo "=== Verificador de Contratos MCP ==="
echo "Fecha: $(date)"
echo ""

SPEC_DIR="specs/v3"
VERIFY_LOG="verification-$(date +%Y%m%d-%H%M%S).log"

# Función para registrar mensajes
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $VERIFY_LOG
}

log "Inicio de verificación de contratos MCP"

# Verificar estructura de directorios
log "Verificando estructura de directorios..."
if [ -d "$SPEC_DIR/core" ]; then
    log "  ✓ Directorio core existe"
else
    log "  ⚠ Directorio core no encontrado"
fi

if [ -d "$SPEC_DIR/mcp" ]; then
    log "  ✓ Directorio mcp existe"
else
    log "  ✗ Directorio mcp no encontrado"
fi

if [ -d "$SPEC_DIR/integrations" ]; then
    log "  ✓ Directorio integrations existe"
else
    log "  ⚠ Directorio integrations no encontrado"
fi

if [ -d "$SPEC_DIR/skills" ]; then
    log "  ✓ Directorio skills existe"
else
    log "  ⚠ Directorio skills no encontrado"
fi

# Verificar cumplimiento de reglas MCP
log "Verificando cumplimiento de reglas MCP..."
TOTAL_SPECS=0
COMPLIANT_SPECS=0
NON_COMPLIANT_SPECS=0

for spec_file in $(find $SPEC_DIR -name "*.yaml" -o -name "*.yml"); do
    ((TOTAL_SPECS++))
    spec_name=$(basename "$spec_file")
    
    log "Verificando: $spec_name"
    
    # Verificar campos obligatorios
    HAS_ID=$(grep -c "^id:" "$spec_file" 2>/dev/null || echo 0)
    HAS_VERSION=$(grep -c "^version:" "$spec_file" 2>/dev/null || echo 0)
    HAS_INPUTS=$(grep -c "^inputs:" "$spec_file" 2>/dev/null || echo 0)
    HAS_OUTPUTS=$(grep -c "^outputs:" "$spec_file" 2>/dev/null || echo 0)
    
    if [ $HAS_ID -gt 0 ] && [ $HAS_VERSION -gt 0 ] && [ $HAS_INPUTS -gt 0 ] && [ $HAS_OUTPUTS -gt 0 ]; then
        log "  ✓ Cumple con reglas MCP (id, version, inputs, outputs)"
        ((COMPLIANT_SPECS++))
    else
        log "  ✗ No cumple con reglas MCP"
        ((NON_COMPLIANT_SPECS++))
    fi
done

log "=== Resultado de la verificación ==="
log "Total de especificaciones: $TOTAL_SPECS"
log "Especificaciones que cumplen MCP: $COMPLIANT_SPECS"
log "Especificaciones no conformes: $NON_COMPLIANT_SPECS"

# Verificar README obligatorio
log "Verificando existencia de README obligatorio..."
if [ -f "$SPEC_DIR/README.md" ]; then
    log "✓ README.md existe en specs/v3/"
else
    log "✗ README.md no encontrado en specs/v3/"
fi

if [ $NON_COMPLIANT_SPECS -eq 0 ] && [ $COMPLIANT_SPECS -gt 0 ]; then
    log "✅ Todos los contratos cumplen con las reglas MCP"
    echo "Verificación: APROBADA"
    exit 0
else
    log "❌ Algunos contratos no cumplen con las reglas MCP"
    echo "Verificación: RECHAZADA"
    exit 1
fi