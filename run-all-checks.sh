#!/bin/bash
# run-all-checks.sh - Ejecutar todas las herramientas de verificación local

echo "=== Ejecución Completa de Verificación Local ==="
echo "Fecha: $(date)"
echo ""

# Hacer ejecutables los scripts si no lo son
chmod +x validate-specs.sh run-specs.sh verify-contracts.sh

# Directorio para logs
LOGS_DIR="local-checks-$(date +%Y%m%d-%H%M%S)"
mkdir -p "vps/2025/ops/validation-logs/$LOGS_DIR"

echo "Ejecutando validación de especificaciones..."
./validate-specs.sh
VALIDATE_RESULT=$?
echo "Resultado validación: $([ $VALIDATE_RESULT -eq 0 ] && echo 'SUCCESS' || echo 'FAILURE')"
echo ""

echo "Ejecutando verificación de contratos..."
./verify-contracts.sh
VERIFY_RESULT=$?
echo "Resultado verificación: $([ $VERIFY_RESULT -eq 0 ] && echo 'SUCCESS' || echo 'FAILURE')"
echo ""

echo "Ejecutando simulación de ejecución..."
./run-specs.sh
RUN_RESULT=$?
echo "Resultado ejecución: $([ $RUN_RESULT -eq 0 ] && echo 'SUCCESS' || echo 'FAILURE')"
echo ""

echo "=== Resumen ==="
echo "Validación: $([ $VALIDATE_RESULT -eq 0 ] && echo '✓ Aprobada' || echo '✗ Fallida')"
echo "Verificación: $([ $VERIFY_RESULT -eq 0 ] && echo '✓ Aprobada' || echo '✗ Fallida')"
echo "Ejecución: $([ $RUN_RESULT -eq 0 ] && echo '✓ Aprobada' || echo '✗ Fallida')"

# Copiar logs al directorio VPS
cp validation-*.log vps/2025/ops/validation-logs/$LOGS_DIR/ 2>/dev/null || echo "No hay logs de validación para copiar"
cp verification-*.log vps/2025/ops/validation-logs/$LOGS_DIR/ 2>/dev/null || echo "No hay logs de verificación para copiar"
cp runtime-*.log vps/2025/ops/validation-logs/$LOGS_DIR/ 2>/dev/null || echo "No hay logs de ejecución para copiar"

echo ""
echo "Logs guardados en: vps/2025/ops/validation-logs/$LOGS_DIR/"

if [ $VALIDATE_RESULT -eq 0 ] && [ $VERIFY_RESULT -eq 0 ] && [ $RUN_RESULT -eq 0 ]; then
    echo ""
    echo "🎉 ¡Todas las verificaciones pasaron!"
    echo "Estado: SUCCESS"
    exit 0
else
    echo ""
    echo "❌ Algunas verificaciones fallaron"
    echo "Estado: FAILURE"
    exit 1
fi