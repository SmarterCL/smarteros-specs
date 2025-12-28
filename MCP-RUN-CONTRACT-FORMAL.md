# Contrato de `mcp run` - Especificación Formal

## Descripción

Este documento define formalmente el contrato del comando `mcp run`, que es el mecanismo estándar para ejecutar especificaciones MCP en el modelo operativo sano.

## Comando Estándar

```bash
mcp run [opciones]
```

## Propósito

El comando `mcp run` permite a cualquier entidad (empresa, partner, agente autónomo, integrador, etc.) ejecutar localmente las especificaciones MCP sin depender de servicios externos.

## Contrato Formal

### 1. Identidad del Comando

- **Nombre**: `mcp run`
- **Tipo**: Comando CLI estándar
- **Implementación de referencia**: `mcp-runner` (Python)
- **Ubicación estándar**: `./mcp-runner run`

### 2. Comportamiento Obligatorio

#### 2.1 Descubrimiento de Especificaciones
- Busca archivos `.yaml` y `.yml` en el directorio especificado
- Por defecto: `specs/v3/`
- Recursivo en subdirectorios

#### 2.2 Validación de Contratos
- Verifica que cada especificación contenga:
  - Campo `id` (string)
  - Campo `version` (string)
  - Campo `inputs` (lista)
  - Campo `outputs` (lista)
- Registra especificaciones no conformes
- Continúa procesando otras especificaciones

#### 2.3 Ejecución de Especificaciones
- Para especificaciones conformes:
  - Simula la ejecución del contrato
  - Verifica integridad de inputs/outputs
  - Registra resultados
- Para especificaciones no conformes:
  - Registra error
  - No detiene la ejecución

#### 2.4 Generación de Resultados
- Crea logs detallados
- Genera reporte estructurado (JSON)
- Devuelve código de salida estándar

### 3. Interfaz de Usuario

#### 3.1 Salida Estándar
- Mensajes de progreso con formato: `[timestamp] NIVEL: mensaje`
- Resumen final en formato tabular
- Ejemplo:
```
[2025-12-28 10:30:00] INFO: 📦 Encontradas 5 especificaciones
[2025-12-28 10:30:01] ✓ Especificación spec1.yaml válida
[2025-12-28 10:30:02] ✗ Especificación spec2.yaml incompleta
```

#### 3.2 Archivos Generados
- `mcp-logs/mcp-run-YYYYMMDD.log`: Log detallado
- `mcp-logs/mcp-run-result-YYYYMMDD-HHMMSS.json`: Resultados estructurados

### 4. Parámetros

#### 4.1 Parámetros Obligatorios
- Ninguno. El comando debe funcionar sin parámetros.

#### 4.2 Parámetros Opcionales
- `--specs-dir`: Directorio de especificaciones (default: `specs/v3`)
- `--output`: Archivo de salida para resultados
- `--verbose`: Modo detallado

### 5. Códigos de Salida

- `0`: Ejecución exitosa, todas las especificaciones válidas
- `1`: Algunas especificaciones fallaron o no se encontraron especificaciones
- `2`: Error de sintaxis o parámetros inválidos
- `3`: Error interno del sistema

### 6. Requisitos del Entorno

#### 6.1 Requisitos Técnicos
- Python 3.7+ (para implementación de referencia)
- Módulo `PyYAML`
- Permisos de lectura en directorio de especificaciones
- Permisos de escritura en directorio de logs

#### 6.2 Requisitos de Estructura
- Directorio de especificaciones debe existir
- Archivos de especificación deben tener extensión `.yaml` o `.yml`

### 7. Comportamiento con Errores

#### 7.1 Errores de Sintaxis
- Registra error en log
- Continúa con otras especificaciones
- Devuelve código de salida apropiado

#### 7.2 Errores de Validación
- Registra especificación no conforme
- Continúa procesando
- Incluye en conteo de fallidos

#### 7.3 Errores del Sistema
- Registra error crítico
- Devuelve código de salida 3
- Detiene ejecución si es irrecuperable

### 8. Compatibilidad

#### 8.1 Hacia Atrás
- Compatible con versiones anteriores del contrato
- Parámetros nuevos deben ser opcionales

#### 8.2 Hacia Adelante
- Nuevas versiones deben mantener comportamiento obligatorio
- Pueden añadir funcionalidades opcionales

### 9. Implementaciones Alternativas

Cualquier implementación que cumpla con este contrato es válida:

- Implementación en otros lenguajes
- Integración en otros sistemas
- Adaptaciones específicas de entorno

### 10. Pruebas de Conformidad

Una implementación debe pasar estas pruebas:

1. Ejecutar sin parámetros en directorio con especificaciones válidas
2. Devolver código 0 con todas válidas
3. Devolver código 1 con algunas inválidas
4. Generar logs y resultados estructurados
5. Respetar formato de salida

## Regla MCP Fundamental

> Ninguna especificación MCP válida debe requerir servicios externos para ser ejecutada por `mcp run`.

## Estado

- **Versión**: 1.0
- **Estado**: Estable
- **Fecha**: Diciembre 2025
- **Tipo**: Contrato formal