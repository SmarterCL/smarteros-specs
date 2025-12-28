# MCP OpenSpec v3.2 - Documentación Expandida

## Resumen Ejecutivo

Esta especificación detalla la arquitectura de MCP (Micro Control Plane) con énfasis en la separación de capas entre lógica de negocio e infraestructura.

## 1. Arquitectura de MCP

### 1.1 Capa de Eventos
- Todos los eventos deben seguir el formato `dominio_tipo`
- Ejemplos: `ml_sale`, `pos_transaction`, `onboarding_completed`
- Cada evento debe tener un schema asociado
- Los eventos son la única fuente de verdad

### 1.2 Capa de Métricas
- Las métricas se calculan a partir de eventos
- Formato: `nombre_metrica: tipo_dato`
- Ejemplos: `sales_ml: integer`, `pos_tx: integer`, `onboardings: integer`
- Las métricas deben ser calculables en tiempo real

### 1.3 Capa de Contratos
- Definición de APIs lógicas (no físicas)
- Contratos de datos entre servicios
- Interfaces estables que no cambian con la infra

## 2. Separación de Responsabilidades

### 2.1 MCP (Lógica de Negocio)
- Solo define eventos, métricas y contratos
- No conoce detalles de infraestructura
- Skills puras de negocio
- Portabilidad entre entornos

### 2.2 Infraestructura (Acceso)
- Gestión de SSL/TLS
- Configuración de Caddy/Cloudflare
- Rutas HTTP físicas
- Despliegue y orquestación

## 3. Implementación de Skills

### 3.1 Requisitos para una Skill MCP
- ✅ Debe emitir eventos MCP
- ✅ No debe asumir ubicación física
- ✅ No debe asumir protocolo de acceso
- ✅ Debe ser independiente de infraestructura
- ✅ Debe implementar lógica de negocio pura

### 3.2 Ejemplo de Skill MCP
```
// Ejemplo de skill que cumple MCP
class POSProcessor {
  processTransaction(transaction) {
    // Lógica de negocio
    const result = this.validateAndProcess(transaction);
    
    // Emisión de evento MCP
    this.emitEvent('pos_transaction', {
      id: transaction.id,
      amount: transaction.amount,
      status: result.status
    });
    
    return result;
  }
}
```

## 4. Dashboard Operativo

### 4.1 Arquitectura del Dashboard
- Capa de visualización (Ionic)
- Capa de métricas (API MCP)
- Capa de eventos (fuente de verdad)
- Modo demo para presentaciones

### 4.2 Métricas Clave
- `sales_ml`: Ventas marketplace
- `pos_tx`: Transacciones POS QR
- `onboardings`: Altas de usuarios
- `errors_prevented`: Errores prevenidos
- `minutes_saved_today`: Tiempo ahorrado

## 5. Beneficios del Enfoque

### 5.1 Técnicos
- Desacoplamiento entre capas
- Mayor portabilidad
- Facilidad de testing
- Escalabilidad horizontal

### 5.2 Comerciales
- Contratos claros
- Demostraciones consistentes
- Facilidad de integración
- Reducción de tiempo de comercialización

## 6. Consideraciones de Implementación

### 6.1 MCP SDK
- Debe incluir emisión de eventos MCP
- Validación de contratos
- Interfaz estándar para métricas
- Herramientas de desarrollo

### 6.2 MCP API
- Endpoints lógicos (no físicos)
- Autenticación estándar
- Rate limiting
- Logging y monitoreo

## 7. Casos de Uso

### 7.1 Marketplace
- Evento: `ml_sale`
- Métrica: `sales_ml`
- Contrato: Detalles de venta

### 7.2 POS QR
- Evento: `pos_transaction`
- Métrica: `pos_tx`
- Contrato: Detalles de transacción

### 7.3 Onboarding
- Evento: `onboarding_completed`
- Métrica: `onboardings`
- Contrato: Datos de usuario

## 8. Próximos Pasos

### 8.1 Versiones Futuras
- MCP v3.3: Mejoras en contratos
- MCP v3.4: Soporte para microservicios
- MCP v3.5: Integración con IA

### 8.2 Implementación
- Crear MCP SDK
- Implementar MCP API
- Desarrollar dashboard
- Documentar mejores prácticas