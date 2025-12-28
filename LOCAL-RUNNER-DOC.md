# Sistema de Ejecución Local para Especificaciones MCP

## Descripción

Este sistema proporciona una alternativa local al uso de GitHub Actions para validar, ejecutar y verificar las especificaciones MCP. Es especialmente útil cuando GitHub Actions no está disponible o funcional.

## Componentes del Sistema

### 1. Validador de Especificaciones (`validate-specs.sh`)

Valida la sintaxis y estructura de las especificaciones MCP.

**Uso:**
```bash
./validate-specs.sh
```

**Funcionalidades:**
- Verifica sintaxis YAML
- Valida campos obligatorios (id, version, inputs, outputs)
- Genera logs de validación
- Retorna código de salida (0 para éxito, 1 para error)

### 2. Ejecutor de Especificaciones (`run-specs.sh`)

Simula la ejecución de las especificaciones MCP.

**Uso:**
```bash
./run-specs.sh
```

**Funcionalidades:**
- Carga y procesa cada spec
- Verifica estructura de inputs/outputs
- Simula ejecución de contratos
- Genera logs de ejecución

### 3. Verificador de Contratos (`verify-contracts.sh`)

Verifica el cumplimiento de las reglas MCP.

**Uso:**
```bash
./verify-contracts.sh
```

**Funcionalidades:**
- Verifica estructura de directorios
- Valida cumplimiento de reglas MCP
- Confirma existencia de archivos obligatorios
- Genera reporte de cumplimiento

## Requisitos del Sistema

- Bash
- Python 3 (para procesamiento YAML)
- JQ (opcional, para procesamiento JSON avanzado)

## Flujo de Trabajo Recomendado

1. **Validación Inicial:**
   ```bash
   ./validate-specs.sh
   ```

2. **Verificación de Contratos:**
   ```bash
   ./verify-contracts.sh
   ```

3. **Ejecución Simulada:**
   ```bash
   ./run-specs.sh
   ```

## Archivos de Log

Cada ejecución genera archivos de log con timestamps:
- `validation-YYYYMMDD-HHMMSS.log`
- `runtime-YYYYMMDD-HHMMSS.log`
- `verification-YYYYMMDD-HHMMSS.log`

## Integración con VPS

Los resultados de estas herramientas pueden integrarse con el sistema VPS:

```
vps/
├── 2025/
│   ├── ops/
│   │   ├── validation-logs/
│   │   ├── runtime-logs/
│   │   └── verification-logs/
│   └── reports/
│       └── compliance-report.md
```

## Principios de Operación

- **Autonomía:** No depende de servicios externos
- **Transparencia:** Genera logs detallados
- **Conformidad:** Verifica cumplimiento MCP
- **Portabilidad:** Funciona en cualquier sistema Unix

## Estado del Sistema

Este sistema proporciona las mismas funcionalidades que GitHub Actions pero de forma local, asegurando que las especificaciones puedan validarse y ejecutarse sin depender de servicios externos.