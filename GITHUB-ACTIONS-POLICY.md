# Política Oficial de GitHub Actions

## Decisión Final (Clara y Estable)

**Default**: ❌ sin GitHub Actions  
**Opcional**: ✅ permitido si alguien quiere  
**Nunca requerido**: regla MCP

Esta decisión se deja escrita como política formal, no como workaround.

## Política Oficial

GitHub Actions is optional and non-authoritative.  
The default execution model for MCP specs is local or self-hosted via mcp-runner.  
No MCP contract may require GitHub Actions to be valid.

## Estado Actual

GitHub Actions puede existir como:
- Ejemplo
- Referencia
- Conveniencia local

Pero **nunca como requerimiento** para la funcionalidad del sistema MCP.

## Beneficios de la Decisión

- ✅ No te ata a pagos
- ✅ No te ata a GitHub
- ✅ No rompe adopción
- ✅ No genera deuda futura
- ✅ Mantiene MCP vendible
- ✅ Garantiza independencia operativa
- ✅ Permite adopción en entornos aislados

## Modelo de Ejecución

### Default (Recomendado)
- Ejecución vía `mcp-runner`
- Local o self-hosted
- Total independencia de servicios externos

### Opcional (Si se desea)
- GitHub Actions como conveniencia
- Otros sistemas CI/CD
- Integraciones externas

## Regla MCP Fundamental

> No MCP contract may require GitHub Actions to be valid.

Esta regla garantiza que el sistema sea verdaderamente portable, institucional y vendible.

## Implementación

- Sistema `mcp-runner` como ejecución por defecto
- Validación local de especificaciones
- Documentación clara de independencia
- Eliminación de dependencias no esenciales