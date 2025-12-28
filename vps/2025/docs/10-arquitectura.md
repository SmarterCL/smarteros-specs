# 10-arquitectura.md - Arquitectura 2025

## Estructura del sistema SmarterOS

### Capas del sistema

1. **MCP (Micro Control Plane)** - Lógica de negocio pura
2. **Infraestructura** - Acceso y orquestación
3. **Integraciones** - Sistemas externos
4. **Dashboard** - Visualización operativa

### Componentes MCP

- Eventos: Fuente de verdad
- Métricas: Derivadas de eventos
- Contratos: Interfaces estables
- Skills: Lógica ejecutable

### Relaciones

```
Eventos MCP → Métricas → Contratos → Skills
     ↓
Infraestructura (externa al spec)
```