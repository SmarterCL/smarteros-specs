# Desactivar GitHub Actions

Los GitHub Actions han sido desactivados intencionalmente como parte del modelo operativo sano.

## Razón

- El sistema MCP ahora se ejecuta localmente con `mcp-runner`
- No se requiere CI/CD externo para validar especificaciones
- El modelo operativo sano no depende de servicios externos
- Se evitan notificaciones de "run failed" innecesarias

## Sistema actual

- Validación local de especificaciones MCP
- Ejecución mediante `mcp run specs/v3`
- Auditoría y logs generados localmente
- Total independencia de servicios externos

## Para reactivar (si es necesario)

Si en el futuro se requiere un workflow específico, se debe:

1. Asegurar que sea compatible con el modelo operativo sano
2. No depender de servicios externos para funcionalidad crítica
3. Servir como complemento, no como requerimiento