# 📐 SMARTER BLUEPRINT SPEC - SmarterOS v4

**Versión:** 1.0.0  
**Fecha:** 2026-03-06  
**Estado:** ✅ **Especificación Definida**

---

## 📋 DESCRIPCIÓN

Un **Blueprint** es el "ADN" que define cómo se conectan los agentes, nodos y skills en SmarterOS. Es compatible con el **Visual CAD** (`draw.smarterbot.cl`) y el **CLI** (`smarter blueprint`).

---

## 🏗️ ESTRUCTURA DEL BLUEPRINT

```yaml
# Blueprint Schema v1.0
blueprint:
  name: string           # Nombre del blueprint
  version: string        # Versión semántica
  description: string    # Descripción
  author: string         # Autor
  
  metadata:
    tags: string[]       # Tags para búsqueda
    category: string     # Categoría (ventas, soporte, etc.)
    visibility: string   # public, private, internal
    
  nodes:
    - id: string         # ID único del nodo
      type: string       # Tipo de nodo
      skill: string      # Skill a usar
      config: object     # Configuración específica
      next: string       # Siguiente nodo (o end)
      conditions: []     # Condiciones para avanzar
      
  skills:
    - name: string       # Nombre de la skill
      version: string    # Versión requerida
      
  rag:
    enabled: boolean     # Habilitar RAG
    sources: string[]    # Fuentes de conocimiento
    
  mcp:
    - agent: string      # Agente MCP requerido
      actions: string[]  # Acciones permitidas
      
  kpis:
    - name: string       # Nombre del KPI
      type: string       # counter, gauge, histogram
      track: string      # Qué medir
```

---

## 📝 EJEMPLO COMPLETO

### Blueprint: Ventas Automatizadas

```yaml
blueprint:
  name: ventas-automatizadas
  version: 1.0.0
  description: Agente de ventas automatizado con IA
  author: SmarterOS Team
  
  metadata:
    tags: [ventas, ia, whatsapp, pagos]
    category: ventas
    visibility: public
    
  nodes:
    - id: landing
      type: web
      skill: landing-page-builder
      config:
        template: sales-v1
        cta: "Comprar ahora"
        analytics: true
      next: whatsapp
      
    - id: whatsapp
      type: messaging
      skill: whatsapp-responder
      config:
        ai_enabled: true
        response_time: 5s
        business_hours: 09:00-20:00
      next: payment
      conditions:
        - type: user_response
          value: interested
          
    - id: payment
      type: payment
      skill: payment-router
      config:
        providers: [mercadopago, flow_cl]
        currency: CLP
        installments: [1, 3, 6]
      next: confirmation
      conditions:
        - type: payment_status
          value: approved
          
    - id: confirmation
      type: notification
      skill: telegram-notify
      config:
        chat_id: admin
        template: sale_completed
      next: end
      
  skills:
    - name: landing-page-builder
      version: ^1.0.0
    - name: whatsapp-responder
      version: ^2.0.0
    - name: payment-router
      version: ^1.0.0
    - name: telegram-notify
      version: ^1.0.0
      
  rag:
    enabled: true
    sources:
      - docs/ventas.md
      - docs/productos.md
      - history/ventas_anteriores.json
      
  mcp:
    - agent: MercadoPago
      actions: [create_payment, refund]
    - agent: Flow.cl
      actions: [create_order, webhook]
    - agent: Telegram
      actions: [send_message]
      
  kpis:
    - name: conversion_rate
      type: gauge
      track: nodes.payment / nodes.landing
      
    - name: avg_response_time
      type: histogram
      track: nodes.whatsapp.duration
      
    - name: total_sales
      type: counter
      track: nodes.payment.amount
```

---

## 🔧 COMANDOS CLI

### Crear Blueprint

```bash
smarter blueprint create ventas-automatizadas
# Crea: specs/blueprints/ventas-automatizadas.yml
```

### Validar Blueprint

```bash
smarter blueprint validate ventas-automatizadas
# Valida sintaxis y referencias
```

### Listar Blueprints

```bash
smarter blueprint list
# Muestra todos los blueprints disponibles
```

### Ejecutar Blueprint

```bash
smarter blueprint run ventas-automatizadas
# Ejecuta el blueprint
```

### Exportar para Visual CAD

```bash
smarter blueprint export ventas-automatizadas --format json
# Exporta para draw.smarterbot.cl
```

---

## 🎨 INTEGRACIÓN CON VISUAL CAD

### Exportar a JSON para Draw

```json
{
  "blueprint": {
    "name": "ventas-automatizadas",
    "nodes": [
      {
        "id": "landing",
        "x": 100,
        "y": 100,
        "type": "web",
        "skill": "landing-page-builder"
      },
      {
        "id": "whatsapp",
        "x": 300,
        "y": 100,
        "type": "messaging",
        "skill": "whatsapp-responder"
      }
    ],
    "connections": [
      {
        "from": "landing",
        "to": "whatsapp"
      }
    ]
  }
}
```

### Importar desde Visual CAD

```bash
smarter blueprint import draw-export.json
# Importa desde draw.smarterbot.cl
```

---

## 📊 VALIDACIÓN DE BLUEPRINTS

### Reglas de Validación

```yaml
validation:
  - rule: unique_node_ids
    message: "Los IDs de nodos deben ser únicos"
    
  - rule: valid_node_types
    message: "Tipo de nodo no válido"
    allowed: [web, messaging, payment, notification, logic, end]
    
  - rule: skill_exists
    message: "Skill no encontrada"
    
  - rule: no_orphan_nodes
    message: "Nodo sin conexión"
    
  - rule: has_start_node
    message: "Debe tener nodo de inicio"
    
  - rule: has_end_node
    message: "Debe tener nodo final"
```

### Comando de Validación

```bash
smarter blueprint validate ventas-automatizadas

# Output esperado:
# ✅ Blueprint válido
# ✅ 4 nodos
# ✅ 4 skills
# ✅ 3 conexiones
# ✅ 2 MCP agents
# ✅ 3 KPIs
```

---

## 🔄 VERSIONADO DE BLUEPRINTS

### Estructura de Versiones

```
blueprints/
├── ventas-automatizadas/
│   ├── v1.0.0.yml
│   ├── v1.1.0.yml
│   └── latest.yml (symlink a v1.1.0)
```

### Comandos de Versión

```bash
# Crear nueva versión
smarter blueprint version create ventas-automatizadas 1.1.0

# Listar versiones
smarter blueprint version list ventas-automatizadas

# Revertir a versión anterior
smarter blueprint version revert ventas-automatizadas 1.0.0
```

---

## 📈 KPIs Y MÉTRICAS

### Tipos de KPIs

| Tipo | Función | Ejemplo |
|------|---------|---------|
| **counter** | Contador acumulativo | Total de ventas |
| **gauge** | Valor instantáneo | Tasa de conversión |
| **histogram** | Distribución | Tiempo de respuesta |

### Ejemplo de Tracking

```yaml
kpis:
  - name: conversion_rate
    type: gauge
    track: nodes.payment / nodes.landing
    alert:
      threshold: 0.05  # 5%
      action: notify_admin
      
  - name: avg_response_time
    type: histogram
    track: nodes.whatsapp.duration
    buckets: [1s, 5s, 10s, 30s]
    
  - name: total_sales
    type: counter
    track: nodes.payment.amount
    currency: CLP
```

---

## 🎩🕹️🏎️💨🚀

```
╔══════════════════════════════════════════════╗
║  SMARTER BLUEPRINT SPEC - DEFINIDO           ║
╠══════════════════════════════════════════════╣
║  ESTRUCTURA: YAML Schema v1.0                ║
║  VALIDACIÓN: 7 reglas                        ║
║  KPIs: 3 tipos (counter, gauge, histogram)   ║
║  VERSIONADO: Semántico                       ║
║  VISUAL CAD: Compatible con draw.smarterbot  ║
╚══════════════════════════════════════════════╝

El blueprint está definido.
El schema está listo.
La validación está clara.
La Red trabaja.
YOSI arquitecto.
```

---

**ESTADO:** ✅ **BLUEPRINT SPEC DEFINIDO**
