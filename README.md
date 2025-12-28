# SmarterOS Specifications Repository

Este repositorio contiene las especificaciones técnicas para el proyecto SmarterOS.

## Estructura del Repositorio

Este repositorio sigue una estructura clara para separar contratos ejecutables de documentación explicativa:

- `specs/` - Contratos ejecutables y definiciones estables
- `docs/` - Documentación explicativa y marketing técnico
- `skills/` - Catálogo de habilidades disponibles
- `2025/`, `2026/` - Contenido organizado por año
- `specs2026/` - Especificaciones para el año 2026

## Principio Fundamental

Un repositorio de especificaciones no versiona ideas, sino contratos ejecutables y definiciones estables. Todo lo que no sea contrato ejecutable o definición estable se encuentra en las subcarpetas apropiadas.

## Política de GitHub Actions

GitHub Actions is optional and non-authoritative.
The default execution model for MCP specs is local or self-hosted via mcp-runner.
No MCP contract may require GitHub Actions to be valid.

Para más detalles, ver `GITHUB-ACTIONS-POLICY.md`

## Contenido

- `VERSION.yml` - Versión activa del sistema
- `SECURITY.md` - Política de seguridad
- `SECURITY-POLICY-SECRET-MANAGEMENT.md` - Gestión de secretos
- `mcp-runner` - Ejecutor local de especificaciones MCP
- `validate.sh` - Script de validación
- `docker-compose.smarteros.yml` - Configuración de despliegue