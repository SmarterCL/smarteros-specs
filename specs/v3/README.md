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