# 🛒 SKILLS MARKETPLACE - SmarterOS v4

**Versión:** 1.0.0  
**Fecha:** 2026-03-06  
**Estado:** ✅ **Especificación Completa**

---

## 📋 DESCRIPCIÓN

El **Skills Marketplace** es un marketplace donde terceros pueden publicar, compartir y vender skills para SmarterOS. Las skills son las capacidades que los agentes pueden ejecutar.

---

## 🏗️ ARQUITECTURA

```
┌─────────────────────────────────────────────────────────────────┐
│  SKILLS MARKETPLACE                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Publicar Skill                                                 │
│  ├── Crear skill (JS)                                           │
│  ├── Definir metadata (YAML)                                    │
│  ├── Testear skill                                              │
│  └── Publicar en marketplace                                    │
│                                                                 │
│  Consumir Skill                                                 │
│  ├── Buscar skill                                               │
│  ├── Instalar skill                                             │
│  ├── Configurar credenciales                                    │
│  └── Usar en agente                                             │
│                                                                 │
│  Marketplace                                                    │
│  ├── smarterbot.store/skills                                    │
│  ├── CLI: smarter skill install <skill>                         │
│  └── API: GET /skills, POST /skills                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📚 SKILLS DISPONIBLES

### Payments

| Skill | Función | Precio |
|-------|---------|--------|
| `charge_payment` | Cobrar con MercadoPago | Gratis |
| `create_invoice` | Crear factura | Gratis |
| `refund_payment` | Reembolsar pago | Gratis |
| `split_payment` | Dividir pago | $9/mes |

### Messaging

| Skill | Función | Precio |
|-------|---------|--------|
| `send_telegram` | Enviar Telegram | Gratis |
| `send_whatsapp` | Enviar WhatsApp | $0.01/msg |
| `send_email` | Enviar email | Gratis |
| `auto_responder` | Respuesta automática | $19/mes |

### CRM

| Skill | Función | Precio |
|-------|---------|--------|
| `create_lead` | Crear lead | Gratis |
| `update_crm` | Actualizar CRM | Gratis |
| `score_lead` | Score de lead | $29/mes |
| `nurture_sequence` | Secuencia nurture | $49/mes |

### Logistics

| Skill | Función | Precio |
|-------|---------|--------|
| `create_order` | Crear orden | Gratis |
| `schedule_delivery` | Programar envío | Gratis |
| `track_shipment` | Trackear envío | $0.10/track |
| `optimize_route` | Optimizar ruta | $99/mes |

---

## 🔧 ESTRUCTURA DE SKILL

### Archivo Principal

```javascript
// skills/charge_payment/index.js
import { MercadoPagoAPI } from '@smarteros/mercadopago-sdk';

export const metadata = {
  name: 'charge_payment',
  version: '1.0.0',
  description: 'Cobrar pago con MercadoPago',
  author: 'SmarterOS Team',
  license: 'MIT',
  category: 'payments',
  price: 0,
  credentials: [
    { name: 'MP_ACCESS_TOKEN', required: true }
  ]
};

export async function execute(params) {
  const { amount, currency, customer_id, payment_method } = params;
  
  // Validar parámetros
  if (!amount || amount <= 0) {
    throw new Error('Amount must be positive');
  }
  
  // Conectar a MercadoPago
  const mp = new MercadoPagoAPI(process.env.MP_ACCESS_TOKEN);
  
  // Crear pago
  const payment = await mp.createPayment({
    transaction_amount: amount,
    currency_id: currency || 'CLP',
    payer_id: customer_id,
    payment_method_id: payment_method || 'debit_card'
  });
  
  // Retornar resultado
  return {
    success: payment.status === 'approved',
    payment_id: payment.id,
    status: payment.status,
    transaction_amount: payment.transaction_amount
  };
}
```

### Metadata YAML

```yaml
# skills/charge_payment/metadata.yml
skill:
  name: charge_payment
  version: 1.0.0
  description: Cobrar pago con MercadoPago
  author: SmarterOS Team
  license: MIT
  category: payments
  price: 0
  
  requirements:
    node: '>=18.0.0'
    
  dependencies:
    - '@smarteros/mercadopago-sdk@^1.0.0'
    
  credentials:
    - name: MP_ACCESS_TOKEN
      required: true
      description: MercadoPago Access Token
      
  inputs:
    - name: amount
      type: number
      required: true
      description: Monto a cobrar
      
    - name: currency
      type: string
      required: false
      default: CLP
      description: Moneda
      
    - name: customer_id
      type: string
      required: true
      description: ID del cliente
      
    - name: payment_method
      type: string
      required: false
      default: debit_card
      description: Método de pago
      
  outputs:
    - name: success
      type: boolean
      description: Si el pago fue aprobado
      
    - name: payment_id
      type: string
      description: ID del pago
      
    - name: status
      type: string
      description: Estado del pago
      
  tests:
    - name: charge_success
      inputs:
        amount: 1000
        currency: CLP
        customer_id: test_123
      expected:
        success: true
        
    - name: charge_invalid_amount
      inputs:
        amount: -100
      expected:
        error: 'Amount must be positive'
```

---

## 🛒 PUBLICAR SKILL

### Paso 1: Crear Skill

```bash
# Crear estructura
smarter skill create shipping

# Output:
✅ Skill creada: shipping
📁 skills/shipping/
  ├── index.js
  ├── metadata.yml
  └── tests/
```

### Paso 2: Implementar

```javascript
// skills/shipping/index.js
export const metadata = {
  name: 'shipping',
  version: '1.0.0',
  description: 'Calcular envío',
  category: 'logistics',
  price: 0.10
};

export async function execute(params) {
  const { origin, destination, weight } = params;
  
  // Calcular envío
  const cost = calculateShipping(origin, destination, weight);
  
  return {
    success: true,
    cost,
    estimated_days: 3
  };
}
```

### Paso 3: Testear

```bash
# Ejecutar tests
smarter skill test shipping

# Output:
✅ Test: shipping_success
✅ Test: shipping_invalid_origin
✅ 2/2 tests passed
```

### Paso 4: Publicar

```bash
# Publicar en marketplace
smarter skill publish shipping

# Output:
✅ Skill publicada: shipping
🔗 https://smarterbot.store/skills/shipping
💰 Precio: $0.10/uso
```

---

## 📥 INSTALAR SKILL

### Desde CLI

```bash
# Instalar skill gratis
smarter skill install send_telegram

# Instalar skill paga
smarter skill install optimize_route --subscribe

# Output:
✅ Skill instalada: optimize_route
💳 Suscripción activa: $99/mes
📁 skills/optimize_route/
```

### Desde Marketplace Web

```
1. Ir a: https://smarterbot.store/skills
2. Buscar skill
3. Click: Instalar
4. Configurar credenciales
5. ✅ Skill lista para usar
```

---

## 💰 MODELO DE NEGOCIO

### Para Creadores

| Plan | Comisión | Features |
|------|----------|----------|
| **Free** | 30% | Publicar skills gratis |
| **Pro** | 20% | Analytics, soporte |
| **Enterprise** | 10% | API prioritaria, SLA |

### Para Consumidores

| Plan | Costo | Features |
|------|-------|----------|
| **Free** | $0 | Skills gratis |
| **Startup** | $49/mes | 10 skills premium |
| **Business** | $149/mes | Skills ilimitadas |
| **Enterprise** | Custom | Custom skills |

---

## 📊 API DEL MARKETPLACE

### Listar Skills

```bash
GET /api/skills

# Response:
{
  "skills": [
    {
      "name": "charge_payment",
      "version": "1.0.0",
      "category": "payments",
      "price": 0,
      "downloads": 1250,
      "rating": 4.8
    }
  ]
}
```

### Obtener Skill

```bash
GET /api/skills/charge_payment

# Response:
{
  "name": "charge_payment",
  "version": "1.0.0",
  "description": "Cobrar pago con MercadoPago",
  "author": "SmarterOS Team",
  "category": "payments",
  "price": 0,
  "code": "...",
  "metadata": {...}
}
```

### Instalar Skill

```bash
POST /api/skills/charge_payment/install

# Body:
{
  "credentials": {
    "MP_ACCESS_TOKEN": "tu_token"
  }
}

# Response:
{
  "success": true,
  "installed": true,
  "path": "skills/charge_payment"
}
```

---

## 🎩🕹️🏎️💨🚀

```
╔══════════════════════════════════════════════╗
║  🛒 SKILLS MARKETPLACE - DEFINIDO            ║
╠══════════════════════════════════════════════╣
║  CATEGORÍAS: 4                               ║
║  • Payments                                  ║
║  • Messaging                                 ║
║  • CRM                                       ║
║  • Logistics                                 ║
╠══════════════════════════════════════════════╣
║  MODELO:                                     ║
║  • Free: 30% comisión                        ║
║  • Pro: 20% comisión                         ║
║  • Enterprise: 10% comisión                  ║
╠══════════════════════════════════════════════╣
║  PRÓXIMO:                                    ║
║  1. Crear primeras 10 skills                 ║
║  2. Deploy marketplace web                   ║
║  3. Onboard creators                         ║
╚══════════════════════════════════════════════╝

El marketplace está definido.
Las skills están especificadas.
El modelo está claro.
La Red trabaja.
YOSI arquitecto.
```

---

## 📊 ESTADO DE LAS 3 PIEZAS

| Pieza | Estado | Archivos |
|-------|--------|----------|
| **1. Agent Runtime** | ✅ Especificado | `core/agent-runtime.js` |
| **2. Blueprint Factory** | ✅ Especificado | `core/blueprint-factory.js` |
| **3. Skills Marketplace** | ✅ Especificado | `specs/v4/SKILLS-MARKETPLACE.md` |

---

**ESTADO:** ✅ **LAS 3 PIEZAS DEFINIDAS - CICLO v4 CERRADO**
