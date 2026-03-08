# 💳 MOTOR DE VENTAS CONVERSACIONAL - SmarterOS v4.5

**Versión:** 1.0.0  
**Fecha:** 2026-03-06  
**Estado:** ✅ **Especificación Completa**

---

## 📋 DESCRIPCIÓN

El **Motor de Ventas Conversacional** es un módulo estándar de SmarterOS que permite vender desde cualquier canal de chat (WhatsApp, Telegram, Web) con validación de identidad chilena (RUT), creación de órdenes, pagos con Flow.cl y automatización completa.

---

## 🏗️ ARQUITECTURA COMPLETA

```
┌─────────────────────────────────────────────────────────────────┐
│  MOTOR DE VENTAS CONVERSACIONAL - SmarterOS                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. CHANNEL GATEWAY                                             │
│  ├── WhatsApp (Twilio)                                          │
│  ├── Telegram                                                   │
│  ├── Web Mini-App                                               │
│  └── API Externa                                                │
│       │                                                         │
│       ▼                                                         │
│  /events/inbound                                                │
│       │                                                         │
│       ▼                                                         │
│  Event Gateway API (FastAPI)                                    │
│       │                                                         │
│       ▼                                                         │
│  Event Bus (Redis/Queue)                                        │
│       │                                                         │
│       ▼                                                         │
│  n8n workflows                                                  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  2. IDENTITY ENGINE (RUT Engine Chile)                          │
│  ├── Validación matemática (Módulo 11)                          │
│  ├── Normalización                                              │
│  └── Enriquecimiento (razón social, giro, etc)                  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  3. ORDER ENGINE                                                │
│  ├── Creación de orden                                          │
│  ├── Estados: draft → pending → paid → failed                  │
│  └── Auditoría completa                                         │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  4. PAYMENT ENGINE (Flow.cl)                                    │
│  ├── POST /payment/create                                       │
│  ├── Webhook /payments/flow/confirm                             │
│  └── Integración con SII                                        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  5. EVENT SYSTEM                                                │
│  ├── payment.completed                                          │
│  ├── order.created                                              │
│  ├── customer.validated                                         │
│  └── invoice.generated                                          │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  6. AUTOMATION (n8n)                                            │
│  ├── Mensajes automáticos                                       │
│  ├── Notificaciones                                             │
│  ├── Follow-ups                                                 │
│  └── Reportes                                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1️⃣ CHANNEL GATEWAY

### Endpoint Único

```
POST /events/inbound
```

### Normalización de Eventos

```json
{
  "event": "message.received",
  "channel": "whatsapp",
  "user_id": "usr_88321",
  "text": "quiero comprar",
  "timestamp": "2026-03-06T14:45:00Z",
  "metadata": {
    "from": "+56912345678",
    "session_id": "sess_abc123"
  }
}
```

### Canales Soportados

| Canal | Proveedor | Endpoint |
|-------|-----------|----------|
| **WhatsApp** | Twilio | /events/whatsapp |
| **Telegram** | Telegram Bot API | /events/telegram |
| **Web** | Mini-App | /events/web |
| **API** | Externa | /events/api |

---

## 2️⃣ IDENTITY ENGINE (RUT ENGINE)

### Nivel 1 - Validación Matemática

```javascript
// core/identity/validate-rut.js
export function validateRUT(rut) {
  // Limpiar RUT
  const cleanRUT = rut.replace(/\./g, '').replace(/-/g, '');
  
  // Separar cuerpo y dígito verificador
  const body = cleanRUT.slice(0, -1);
  const dv = cleanRUT.slice(-1).toUpperCase();
  
  // Calcular dígito verificador
  let sum = 0;
  let multiplier = 2;
  
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const remainder = sum % 11;
  const calculatedDV = 11 - remainder;
  
  // Mapear dígito verificador
  const dvMap = {
    10: 'K',
    11: '0'
  };
  
  const expectedDV = dvMap[calculatedDV] || calculatedDV.toString();
  
  return {
    valid: expectedDV === dv,
    rut: `${body}-${dv}`,
    body: parseInt(body),
    dv: dv
  };
}
```

### Nivel 2 - Normalización

```javascript
// Salida normalizada
{
  "rut": "12345678-5",
  "rut_numeric": 12345678,
  "dv": "5",
  "formatted": "12.345.678-5"
}
```

### Nivel 3 - Enriquecimiento

```javascript
// Si es empresa
{
  "rut": "78233417-4",
  "type": "company",
  "razon_social": "SMARTER SPA",
  "giro": "Servicios de software",
  "direccion": "Av. Principal 123",
  "region": "Metropolitana",
  "comuna": "Santiago"
}
```

### API Endpoints

```
POST /identity/validate
GET  /identity/:rut
POST /identity/enrich
```

---

## 3️⃣ ORDER ENGINE

### Estructura de Orden

```javascript
{
  "order_id": "SMARTER-938221",
  "user_id": "usr_88321",
  "rut": "12345678-5",
  "tipo_documento": "boleta",
  "items": [
    {
      "product_id": "prod_001",
      "name": "Ecocupon Premium",
      "quantity": 2,
      "unit_price": 6495,
      "total": 12990
    }
  ],
  "subtotal": 12990,
  "tax": 0,
  "total": 12990,
  "status": "pending_payment",
  "payment_provider": "flow",
  "created_at": "2026-03-06T14:45:00Z",
  "updated_at": "2026-03-06T14:45:00Z"
}
```

### Estados de Orden

```
draft → pending_payment → paid → fulfilled
                         ↓
                      failed
                         ↓
                    cancelled
```

### API Endpoints

```
POST   /orders/create
GET    /orders/:order_id
PUT    /orders/:order_id/status
GET    /orders/user/:user_id
```

---

## 4️⃣ PAYMENT ENGINE (FLOW.CL)

### Creación de Pago

```javascript
// integrations/flow/create-payment.js
export async function createPayment({ amount, order_id, email, subject }) {
  const response = await fetch('https://www.flow.cl/api/payment/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ApiKey': process.env.FLOW_API_KEY
    },
    body: JSON.stringify({
      amount: amount,
      commerceOrder: order_id,
      subject: subject,
      email: email,
      currency: 'CLP',
      paymentMethod: 'todos',
      returnUrl: `https://smarterbot.cl/payment/success?order=${order_id}`,
      confirmationUrl: `https://api.smarterbot.cl/payments/flow/confirm`
    })
  });
  
  const data = await response.json();
  
  return {
    payment_url: data.url,
    token: data.token,
    flow_order: data.flowOrder
  };
}
```

### Webhook de Confirmación

```javascript
// POST /payments/flow/confirm
export async function confirmPayment(webhookData) {
  const { status, flowOrder, commerceOrder, amount } = webhookData;
  
  // status = 2 → pago aprobado
  if (status === 2) {
    // Actualizar orden
    await updateOrder(commerceOrder, {
      status: 'paid',
      payment_id: flowOrder,
      paid_at: new Date().toISOString()
    });
    
    // Emitir evento
    await emitEvent('payment.completed', {
      order_id: commerceOrder,
      amount: amount,
      payment_provider: 'flow'
    });
    
    return { success: true };
  }
  
  return { success: false, reason: 'payment_not_approved' };
}
```

### Integración con SII

```javascript
// Después de pago aprobado
await generateDTE({
  order_id: commerceOrder,
  tipo_documento: 'boleta',
  rut: customer.rut,
  monto: amount,
  enviar_sii: true
});
```

---

## 5️⃣ EVENT SYSTEM

### Eventos del Sistema

| Evento | Trigger | Payload |
|--------|---------|---------|
| `customer.validated` | RUT validado | `{ rut, type, enriched }` |
| `order.created` | Orden creada | `{ order_id, user_id, total }` |
| `payment.completed` | Pago aprobado | `{ order_id, amount, provider }` |
| `payment.failed` | Pago rechazado | `{ order_id, reason }` |
| `invoice.generated` | Factura creada | `{ invoice_id, order_id, sii_track }` |

### Event Bus

```javascript
// core/event-bus.js
export async function emitEvent(eventType, payload) {
  // Publicar en Redis
  await redis.publish('smarteros_events', JSON.stringify({
    event: eventType,
    payload: payload,
    timestamp: new Date().toISOString()
  }));
  
  // Log para auditoría
  await logEvent(eventType, payload);
}

export async function subscribeToEvent(eventType, handler) {
  await redis.subscribe('smarteros_events', (message) => {
    const event = JSON.parse(message);
    if (event.event === eventType) {
      handler(event.payload);
    }
  });
}
```

---

## 6️⃣ AUTOMATIZACIÓN (n8n)

### Workflow: Pago Confirmado

```
┌─────────────────────────────────────────────────────────────────┐
│  WORKFLOW: Pago Confirmado                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Webhook Flow                                                   │
│       │                                                         │
│       ▼                                                         │
│  Verify Signature                                               │
│       │                                                         │
│       ▼                                                         │
│  HTTP Request Backend                                           │
│  (confirm payment)                                              │
│       │                                                         │
│       ▼                                                         │
│  Update Order (status = paid)                                   │
│       │                                                         │
│       ▼                                                         │
│  IF status = paid                                               │
│       │                                                         │
│       ├──► Send WhatsApp (Twilio)                               │
│       │    "Pago confirmado, Orden #938221"                     │
│       │                                                         │
│       ├──► Send Telegram                                        │
│       │    "✅ Pago recibido"                                   │
│       │                                                         │
│       ├──► Generate Invoice (SII)                               │
│       │                                                         │
│       └──► Notify Team (Slack)                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Mensajes Automáticos

```javascript
// WhatsApp
{
  "to": "+56912345678",
  "message": "✅ Pago confirmado\n\nOrden #SMARTER-938221\nMonto: $12.990\n\nGracias por tu compra!"
}

// Telegram
{
  "chat_id": "123456789",
  "message": "✅ Pago recibido\n\nCliente: Juan Pérez\nRUT: 12.345.678-5\nOrden: #SMARTER-938221"
}
```

---

## 🔄 FLUJO COMPLETO

```
┌─────────────────────────────────────────────────────────────────┐
│  FLUJO DE VENTA CONVERSACIONAL COMPLETO                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Cliente escribe "quiero comprar"                            │
│       │                                                         │
│       ▼                                                         │
│  2. Bot recibe mensaje (Channel Gateway)                        │
│       │                                                         │
│       ▼                                                         │
│  3. Bot solicita RUT                                            │
│       │                                                         │
│       ▼                                                         │
│  4. Identity Engine valida RUT                                  │
│       │                                                         │
│       ▼                                                         │
│  5. Order Engine crea orden                                     │
│       │                                                         │
│       ▼                                                         │
│  6. Payment Engine genera link de pago                          │
│       │                                                         │
│       ▼                                                         │
│  7. Cliente paga                                                │
│       │                                                         │
│       ▼                                                         │
│  8. Flow webhook confirma                                       │
│       │                                                         │
│       ▼                                                         │
│  9. Event System emite payment.completed                        │
│       │                                                         │
│       ▼                                                         │
│  10. n8n automatiza:                                            │
│      • Mensaje confirmado                                       │
│      • Factura SII                                              │
│      • Notificación equipo                                      │
│                                                                 │
│  TIEMPO OBJETIVO: < 5 segundos                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 API COMPLETA

### Identity Endpoints

```
POST /api/v1/identity/validate
POST /api/v1/identity/enrich
GET  /api/v1/identity/:rut
```

### Order Endpoints

```
POST /api/v1/orders/create
GET  /api/v1/orders/:order_id
PUT  /api/v1/orders/:order_id/status
GET  /api/v1/orders/user/:user_id
```

### Payment Endpoints

```
POST /api/v1/payments/create
POST /api/v1/payments/flow/confirm
GET  /api/v1/payments/:payment_id
```

### Event Endpoints

```
POST /api/v1/events/emit
GET  /api/v1/events/history
```

---

## 🎩🕹️🏎️💨🚀

```
╔══════════════════════════════════════════════╗
║  💳 MOTOR DE VENTAS CONVERSACIONAL           ║
╠══════════════════════════════════════════════╣
║  1. Channel Gateway: ✅                      ║
║  2. Identity Engine (RUT): ✅                ║
║  3. Order Engine: ✅                         ║
║  4. Payment Engine (Flow): ✅                ║
║  5. Event System: ✅                         ║
║  6. Automation (n8n): ✅                     ║
╠══════════════════════════════════════════════╣
║  TIEMPO OBJETIVO: < 5 segundos               ║
║  CANALES: WhatsApp, Telegram, Web            ║
║  PROVEEDOR: Flow.cl                          ║
║  SII: Integrado                              ║
╚══════════════════════════════════════════════╝

El motor está especificado.
El flujo está completo.
La integración está clara.
La Red trabaja.
YOSI arquitecto.
```

---

## 📊 INTEGRACIÓN CON SMARTEROS v4

```
SmarterOS v4.5
│
├── Agent Runtime ← Ejecuta agente de ventas
│
├── Blueprint Factory ← Blueprint: ventas-conversacionales
│
├── Skills Marketplace
│   ├── validate_rut
│   ├── create_order
│   ├── charge_payment
│   ├── send_confirmation
│   └── generate_invoice
│
├── Motor de Ventas Conversacional ← NUEVO
│   ├── Channel Gateway
│   ├── Identity Engine
│   ├── Order Engine
│   ├── Payment Engine
│   └── Event System
│
└── RAG Layer ← Aprende de ventas anteriores
```

---

## 📞 PRÓXIMOS PASOS

### Inmediatos

1. ⏳ **Implementar Identity Engine** - Validación RUT
2. ⏳ **Implementar Order Engine** - Creación de órdenes
3. ⏳ **Implementar Payment Engine** - Flow.cl integration
4. ⏳ **Configurar n8n workflows** - Automatizaciones

### Corto Plazo

5. ⏳ **Testear flujo completo** - End-to-end
6. ⏳ **Deploy a producción** - VPS
7. ⏳ **Documentar API** - OpenAPI spec
8. ⏳ **Crear dashboard** - Métricas de ventas

---

**ESTADO:** ✅ **ESPECIFICACIÓN COMPLETA - LISTA PARA IMPLEMENTAR**
