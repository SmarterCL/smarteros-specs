# OpenSpec v3.2 - SmarterMCP: Separación de Capas

## Regla Fundamental de MCP

> **MCP solo define eventos, métricas y contratos. Infraestructura es externa y nunca parte del spec.**

### Esto evita:
- Confusión de capas
- Skills mal diseñadas
- Dashboards dependientes de infra
- Acoplamiento entre lógica de negocio e infraestructura

## Contrato Comercial + Operativo

### 1. Fuente de Verdad
- **Eventos MCP**: Única fuente de verdad
- **Métricas**: Calculadas desde eventos reales
- **Endpoints lógicos**: `/mcp/metrics/*` (no URLs físicas)

### 2. MCP Define (Sí)
- Eventos: `ml_sale`, `pos_transaction`, `onboarding_completed`, `error_prevented`
- Métricas: `sales_ml`, `pos_tx`, `onboardings`, `minutes_saved_today`, `errors_prevented`
- Contratos: Interfaces y contratos de datos
- Lógica de negocio: Reglas de negocio puras

### 3. MCP No Define (No)
- Infraestructura: Caddy, Cloudflare, SSL, puertos, dominios
- Deployment: Contenedores, servidores, redes
- Acceso: URLs, rutas HTTP específicas
- Certificados: SSL/TLS, LetsEncrypt, etc.

## Separación de Capas

### Capa MCP (Lógica de Negocio)
```
Eventos → Métricas → Contratos
   ↓
Lógica pura de negocio
```

### Capa Infraestructura (Acceso)
```
SSL/TLS → Caddy → Cloudflare → Dominios
   ↓
Acceso externo
```

## Skills de MCP

Cada skill debe cumplir:
- ✅ Emite eventos
- ✅ No asume dónde vive
- ✅ No asume cómo se accede
- ✅ No "sabe" de Caddy ni Cloudflare
- ✅ Lógica pura

## Dashboard Operativo

### Arquitectura
```
MCP (eventos) → API metrics → Ionic Dashboard → Mermaid (estructura) → Cards (datos vivos)
```

### Métricas Clave
- `sales_ml`: Ventas realizadas a través del marketplace
- `pos_tx`: Transacciones realizadas vía POS QR
- `onboardings`: Usuarios nuevos dados de alta
- `errors_prevented`: Errores prevenidos por el sistema
- `minutes_saved_today`: Tiempo ahorrado en minutos (convertido a horas visualmente)

### Modo de Uso
- Modo real: Datos reales del MCP
- Modo demo: Datos simulados para presentaciones
- Toggle entre modos sin tocar backend

## Beneficios de la Separación

1. **Escalabilidad**: MCP no cambia con infra
2. **Portabilidad**: MCP funciona en cualquier infra
3. **Claridad**: Contratos limpios sin ruido de infra
4. **Venta**: Contratos comerciales claros sin detalles técnicos
5. **Desarrollo**: Skills reutilizables en cualquier entorno

## Implementación

### 1. Eventos MCP
- Definidos en contrato OpenSpec
- Fuente de verdad única
- No dependen de infraestructura

### 2. Métricas
- Derivadas de eventos reales
- Contrato de datos estable
- No dependen de cómo se accede

### 3. Endpoints Lógicos
- Definidos como `/mcp/metrics/today`
- No como `https://dominio.com/mcp/metrics/today`
- Infra decide cómo exponer

## Conformidad

Este OpenSpec cumple con la regla fundamental:
- ✅ Define eventos y métricas
- ✅ Define contratos de negocio
- ✅ Excluye infraestructura
- ✅ Permite escalamiento limpio
- ✅ Facilita comercialización

## Nota
Este spec es contrato comercial + operativo, no especificación técnica de infraestructura.