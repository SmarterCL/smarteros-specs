# Especificaciones SmarterOS v3

## Punto de entrada para el usuario MCP

Este es el directorio que debe leer un usuario MCP para entender exactamente qué hacer con las especificaciones v3.

## Contratos disponibles

### Core
- Entidades base del sistema
- Definiciones fundamentales

### MCP
- Reglas de negocio
- Runtime
- Agentes

### Integrations
- Sistemas externos
- Conexiones validadas

### Skills
- Habilidades ejecutables
- Lógica de negocio específica

### Validation
- Reglas globales
- Validaciones comunes

## Cómo usar estas especificaciones

Cada contrato en esta estructura declara explícitamente:

1. **ID**: Identificador único
2. **Versión**: Estado actual
3. **Inputs/Outputs**: Definiciones claras
4. **Reglas**: Comportamiento esperado
5. **Modos de falla**: Qué sucede cuando algo falla

## Estado actual

- **Versión**: v3.0
- **Estado**: Estable
- **Fecha**: Diciembre 2025
- **Compatibilidad**: MCP Runtime v3.x

## Navegación

Para cualquier componente MCP, empieza por su definición específica en las subcarpetas. Cada archivo contiene la información necesaria para que un agente MCP pueda cargarlo y saber exactamente qué hacer.

## Ejecución local de especificaciones

### MCP Runner - Sistema de ejecución local

Este repositorio incluye `mcp-runner`, una herramienta CLI para ejecutar, validar y verificar especificaciones MCP localmente sin depender de servicios externos como GitHub Actions.

#### Instalación

El runner está incluido en este repositorio como `mcp-runner`.

#### Comandos disponibles

```bash
# Ejecutar todas las especificaciones
./mcp-runner run

# Validar todas las especificaciones
./mcp-runner validate

# Verificar cumplimiento de contratos MCP
./mcp-runner verify

# Listar todas las especificaciones encontradas
./mcp-runner list
```

#### Opciones

- `--specs-dir`: Directorio de especificaciones (por defecto: specs/v3)
- `--output`: Archivo para guardar resultados

#### Modelo operativo sano

> Importante: Este repositorio no requiere GitHub Actions para funcionar.
> Las especificaciones se ejecutan localmente en el entorno del usuario.
> GitHub solo sirve para versionar contratos, no para ejecutarlos.

#### Requisitos

- Python 3.7+
- Bibliotecas: PyYAML, json, argparse

#### Resultados

Los resultados de ejecución se guardan en `mcp-logs/` en formato JSON para auditoría y seguimiento.