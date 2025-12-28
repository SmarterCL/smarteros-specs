# Contrato MCP Run - Especificación de Ejecución

## Descripción

Este documento define el contrato exacto para la ejecución de especificaciones MCP a través del comando `mcp run`.

## Comando estándar

```bash
mcp run [opciones]
```

## Inputs (Entradas)

### Parámetros obligatorios
- Ninguno. El comando se ejecuta en el directorio actual por defecto.

### Parámetros opcionales
- `--specs-dir`: Directorio que contiene las especificaciones (por defecto: `specs/v3`)
- `--output`: Archivo de salida para resultados (por defecto: no se guarda archivo)
- `--verbose`: Modo detallado (por defecto: falso)

### Archivos de entrada
- Archivos YAML/YML en el directorio de especificaciones
- Cada archivo debe contener:
  - `id`: Identificador único de la especificación
  - `version`: Versión de la especificación
  - `inputs`: Definición de entradas esperadas
  - `outputs`: Definición de salidas esperadas

## Outputs (Salidas)

### Salida estándar (stdout)
- Mensajes de progreso con formato: `[timestamp] NIVEL: mensaje`
- Resumen final en formato tabular
- Resultados en formato JSON si se especifica archivo de salida

### Archivos generados
- `mcp-logs/mcp-run-YYYYMMDD.log`: Log detallado de ejecución
- `mcp-logs/mcp-run-result-YYYYMMDD-HHMMSS.json`: Resultados estructurados

### Estructura de resultados JSON
```json
{
  "total_specs": 5,
  "successful": 4,
  "failed": 1,
  "results": [
    {
      "id": "mcp.agent.invoice-validator",
      "version": "3.0",
      "status": "success",
      "inputs_count": 1,
      "outputs_count": 1,
      "timestamp": "2025-12-28T10:30:00"
    }
  ],
  "timestamp": "2025-12-28T10:30:00"
}
```

## Códigos de salida (Exit codes)

- `0`: Ejecución exitosa, todas las especificaciones válidas
- `1`: Algunas especificaciones fallaron o no se encontraron especificaciones
- `2`: Error de sintaxis o parámetros inválidos
- `3`: Error interno del sistema

## Reglas de negocio

### Validación
1. Cada especificación debe tener los campos: `id`, `version`, `inputs`, `outputs`
2. Los campos `inputs` y `outputs` deben ser listas
3. Cada entrada/salida debe tener al menos un nombre

### Ejecución
1. El sistema procesa todas las especificaciones encontradas
2. Cada especificación se valida antes de ejecutarse
3. Los resultados se acumulan en un informe final

### Errores
1. Si no se encuentran especificaciones, se considera un error
2. Si alguna especificación no cumple con el contrato MCP, se registra como error
3. Errores de sintaxis YAML se registran pero no detienen la ejecución

## Comportamiento esperado

### Caso exitoso
- Todas las especificaciones se validan correctamente
- Se generan logs detallados
- Se devuelve código de salida 0
- Se muestra resumen en consola

### Caso con errores
- Se registran los errores en logs
- Se devuelve código de salida 1
- Se muestra resumen indicando errores

### Caso sin especificaciones
- Se devuelve código de salida 1
- Se emite advertencia sobre ausencia de especificaciones

## Contrato de compatibilidad

Este contrato garantiza:
- Compatibilidad hacia atrás con versiones futuras
- Mismo formato de salida independientemente del entorno
- Mismos códigos de error en todos los sistemas
- Mismas reglas de validación en todas las ejecuciones

## Excepciones

El contrato no aplica si:
- No hay permisos de lectura en los archivos de especificación
- No hay espacio en disco para generar logs
- El entorno no tiene Python 3.7+ instalado