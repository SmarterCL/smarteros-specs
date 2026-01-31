# MCP-SEC-001: Política de Seguridad del Motor de Ejecución Condicional

## Propósito

Esta política establece los requisitos de seguridad mínimos para el funcionamiento del Motor de Ejecución Condicional (MCP) en el sistema SmarterOS.

## Requisitos Obligatorios

### 1. Estado de Seguridad por Defecto
- El estado inicial del MCP debe ser `SAFE-BLOCK`
- Ninguna acción se ejecuta fuera del estado `EXECUTE`
- Las transiciones de estado deben seguir un modelo finito de estados

### 2. Validación Previa Obligatoria
Antes de permitir la ejecución, se deben validar los siguientes elementos:
- Existencia del tenant
- Estado activo de la suscripción
- Vigencia de la política actual
- Presencia de secretos requeridos
- Alcanzabilidad del proveedor destino

### 3. Gestión de Secretos
- Los secretos nunca se almacenan en código
- Los secretos solo se inyectan en tiempo de ejecución
- Los secretos se destruyen al finalizar la acción
- Los secretos se obtienen exclusivamente del Vault

### 4. Control de Acceso
- Solo los tenants registrados pueden ejecutar acciones
- Las suscripciones deben estar activas para permitir ejecución
- Las acciones deben estar dentro del plan suscrito
- Se registra toda actividad para auditoría

## Estados del MCP

```
INIT
 ↓
SAFE-BLOCK ──(condiciones cumplidas)──▶ EXECUTE
   ▲                                   ↓
   └────────(error/falta)◀── ROLLBACK
                                   ↓
                                COMPLETE
```

## Implementación

### Valores Permitidos
- `SAFE-BLOCK`: Estado seguro, no se ejecutan acciones
- `EXECUTE`: Estado de ejecución, se permiten acciones
- `COMPLETE`: Estado de finalización exitosa
- `ROLLBACK`: Estado de reversión en caso de error

### Transiciones Válidas
- `INIT` → `SAFE-BLOCK`
- `SAFE-BLOCK` → `EXECUTE` | `ROLLBACK`
- `EXECUTE` → `COMPLETE` | `ROLLBACK`
- `COMPLETE` → `SAFE-BLOCK`
- `ROLLBACK` → `SAFE-BLOCK`

## Cumplimiento

Este documento debe ser referenciado por todos los componentes del sistema MCP y servir como base para la implementación de controles de seguridad.

## Revisión

- Versión: MCP-SEC-001
- Fecha de entrada en vigor: 2025-01-15
- Responsable: SmarterOS Security Team