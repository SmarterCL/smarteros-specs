# 🏗️ SmarterOS - Platform Architecture (Monorepo)

**Fecha**: 2026-03-07  
**Hora**: 1:15 PM CLT  
**Estado**: ✅ **ARQUITECTURA DEFINIDA - MANDATORY**  
**Mandatory**: specs/ ✅  
**Versión**: 4.0  

---

## 📊 RESUMEN EJECUTIVO

```
╔══════════════════════════════════════════════════════════╗
║     SMARTEROS v4 - PLATFORM ARCHITECTURE                 ║
╠══════════════════════════════════════════════════════════╣
║  TIPO: Monorepo / Plataforma                             ║
║  MODELO: Business Operating System                       ║
║  COMPONENTES: CAD + Factory + Runtime + Marketplace      ║
║  ESTADO: ✅ Arquitectura Definida                        ║
╚══════════════════════════════════════════════════════════╝
```

---

## 🎯 EVOLUCIÓN ARQUITECTÓNICA

### ANTES: Proyectos Sueltos

```
dev/2026/
├── app.smarterbot.cl
├── crm.smarterbot.cl
├── odoo.smarterbot.cl
├── flow.smarterbot.cl
├── webcontrol.smarterbot.cl
├── smarterbot.store
├── smarteros-factory
├── picoclaw
└── nunex.lat
```

**Problema**: Difícil de mantener con 30-40 servicios

---

### AHORA: Plataforma / Monorepo

```
smarter-platform/
├── core/
│   ├── smarteros/           # Core del OS
│   ├── validator/           # Gatekeeper de agentes
│   └── agent-runtime/       # Runtime de ejecución
│
├── agents/
│   ├── sales-agent/         # Agente de ventas
│   ├── logistics-agent/     # Agente de logística
│   ├── crm-agent/           # Agente de CRM
│   └── support-agent/       # Agente de soporte
│
├── services/
│   ├── payments/            # Servicio de pagos
│   ├── crm/                 # Servicio de CRM
│   ├── erp/                 # Servicio de ERP
│   ├── logistics/           # Servicio de logística
│   └── messaging/           # Servicio de mensajería
│
├── apps/
│   ├── app.smarterbot/      # Frontend principal
│   ├── webcontrol/          # Panel de control
│   └── smarterbot.store/    # Marketplace
│
├── integrations/
│   ├── mercadopago/         # Integración MP
│   ├── telegram/            # Integración TG
│   ├── whatsapp/            # Integración WA
│   └── odoo/                # Integración Odoo
│
├── blueprints/
│   ├── mvp-startup/         # Blueprint MVP
│   ├── ecommerce/           # Blueprint Ecommerce
│   ├── crm-basic/           # Blueprint CRM
│   ├── marketplace/         # Blueprint Marketplace
│   └── logistics/           # Blueprint Logística
│
├── ui/
│   ├── draw.smarterbot/     # CAD de procesos
│   ├── agent-cad/           # Diseñador de agentes
│   └── store-templates/     # Templates de tienda
│
└── docs/
    └── smarter-docs/        # Documentación
```

**Ventaja**: Escalable a 30-40 servicios

---

## 🤖 FLUJO DE EJECUCIÓN

### Flujo Real del Agente

```
Usuario → Dibuja proceso (CAD)
    ↓
Blueprint generado
    ↓
Factory crea agente
    ↓
Agente conecta skills
    ↓
Skills conectan servicios
    ↓
Servicios ejecutan (MercadoPago, CRM, etc.)
```

### Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────┐
│  SMARTEROS - AGENT EXECUTION FLOW                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [ draw.smarterbot.cl ] ──► Usuario dibuja proceso          │
│           │                                                 │
│           ▼                                                 │
│  [ Blueprint Generator ] ──► Genera blueprint              │
│           │                                                 │
│           ▼                                                 │
│  [ Agent Factory ] ──► Crea agente                         │
│           │                                                 │
│           ▼                                                 │
│  [ Validator.js ] ──► Valida estado                        │
│           │                                                 │
│           ▼                                                 │
│  [ Skills Runtime ] ──► Ejecuta skills                     │
│           │                                                 │
│           ▼                                                 │
│  [ Services ] ──► MercadoPago / CRM / ERP / etc.           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 AGENT CAD (draw.smarterbot.cl)

### Concepto

**Agent CAD** = CAD para procesos empresariales

### Flujo Visual

```
┌─────────────────────────────────────────────────────────────┐
│  AGENT CAD - VISUAL DESIGNER                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [ CRM ] ──► [ SALES AGENT ] ──► [ MERCADOPAGO ]           │
│                                             │               │
│                                             ▼               │
│                                      [ DELIVERY ]           │
│                                                             │
│  Usuario dibuja → Sistema genera → Agente ejecuta           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Comandos CLI

```bash
# Crear nuevo blueprint desde CAD
smarter cad create ecommerce-flow

# Exportar blueprint
smarter cad export ecommerce-flow

# Importar blueprint
smarter cad import ecommerce-flow.json

# Validar blueprint
smarter cad validate ecommerce-flow
```

---

## 📚 BIBLIOTECA DE BLUEPRINTS

### Estructura

```
blueprints/
├── mvp-startup/
│   ├── agents.yaml
│   ├── skills.yaml
│   ├── services.yaml
│   └── flows.yaml
│
├── ecommerce/
│   ├── agents.yaml
│   ├── skills.yaml
│   ├── services.yaml
│   └── flows.yaml
│
├── crm-basic/
│   └── ...
│
├── marketplace/
│   └── ...
│
├── logistics/
│   └── ...
│
└── delivery/
    └── ...
```

### Blueprint Example (ecommerce.yaml)

```yaml
name: ecommerce-basic
version: 1.0.0
description: E-commerce básico con pagos y logística

agents:
  - sales-agent
  - logistics-agent
  - support-agent

skills:
  - charge_payment
  - create_order
  - send_whatsapp
  - schedule_delivery

services:
  - payments: mercadopago
  - messaging: whatsapp
  - logistics: delivery-api

flows:
  checkout:
    - validate_cart
    - charge_payment
    - create_order
    - send_confirmation
    - schedule_delivery
```

---

## 🛠️ SKILLS LIBRARY

### Estructura

```
core/skills/
├── payments/
│   ├── charge_payment.js
│   ├── refund_payment.js
│   └── validate_payment.js
│
├── messaging/
│   ├── send_whatsapp.js
│   ├── send_telegram.js
│   └── send_email.js
│
├── crm/
│   ├── create_invoice.js
│   ├── update_contact.js
│   └── create_deal.js
│
├── logistics/
│   ├── create_order.js
│   ├── schedule_delivery.js
│   └── track_shipment.js
│
└── utils/
    ├── validate_rut.js
    ├── generate_pdf.js
    └── parse_document.js
```

### Skill Example (charge_payment.js)

```javascript
// core/skills/payments/charge_payment.js

import { MercadoPagoAPI } from '../../integrations/mercadopago.js';

export async function charge_payment({ amount, currency, customer_id }) {
  // Validar datos
  if (!amount || !currency || !customer_id) {
    throw new Error('Missing required parameters');
  }

  // Conectar a MercadoPago
  const mp = new MercadoPagoAPI(process.env.MP_ACCESS_TOKEN);

  // Crear pago
  const payment = await mp.createPayment({
    amount,
    currency,
    customer_id,
    description: 'SmarterOS Payment'
  });

  // Retornar resultado
  return {
    success: payment.status === 'approved',
    payment_id: payment.id,
    status: payment.status
  };
}
```

---

## 🏪 MARKETPLACE DE AGENTES (smarterbot.store)

### Concepto

**smarterbot.store** = Marketplace donde empresas compran agentes pre-configurados

### Agentes Disponibles

| Agente | Función | Precio | Estado |
|--------|---------|--------|--------|
| **Agente Ventas** | Gestionar ventas | $99/mes | ✅ Ready |
| **Agente Ecommerce** | Tienda online | $149/mes | ✅ Ready |
| **Agente Logística** | Gestión de envíos | $79/mes | ⏳ WIP |
| **Agente Soporte** | Atención al cliente | $69/mes | ⏳ WIP |
| **Agente CRM** | Gestión de clientes | $89/mes | ⏳ WIP |
| **Agente Contabilidad** | Facturación automática | $129/mes | ⏳ WIP |

### Instalación (1 Click)

```bash
# Instalar agente desde marketplace
smarter store install sales-agent

# Listar agentes instalados
smarter store list

# Actualizar agente
smarter store update sales-agent

# Desinstalar agente
smarter store uninstall sales-agent
```

---

## 🔧 VALIDATOR.JS - GATEKEEPER DEL AGENTE

### Funciones Principales

1. **Validar estado del agente**
   ```javascript
   BOT_STATUS: AWAITING_ACTIVE_TOKEN
   ```

2. **Conectar MCP**
   ```javascript
   MCP_ENDPOINT: http://localhost:3051
   ```

3. **Activar pagos**
   ```javascript
   import { MercadoPagoAPI } from './mercadopago-api-wrapper.js';
   const mp = new MercadoPagoAPI(process.env.MP_ACCESS_TOKEN);
   ```

### Flujo de Validación

```
Agente inicia
    ↓
Validator.js valida estado
    ↓
Conecta MCP endpoint
    ↓
Inicializa skills
    ↓
Conecta MercadoPago (si existe MP_ACCESS_TOKEN)
    ↓
Agente listo para ejecutar
```

---

## 📊 EXPLORADOR TIPO WINDOWS

### Estructura Visual

```
SmarterOS
│
├── Agents
│   ├── SalesAgent
│   ├── CRMManager
│   ├── LogisticsAgent
│   └── SupportAgent
│
├── Skills
│   ├── Payments
│   ├── Messaging
│   ├── CRM
│   └── Logistics
│
├── Blueprints
│   ├── Ecommerce
│   ├── MVP
│   ├── Marketplace
│   └── Logistics
│
├── Flows
│   ├── Checkout
│   ├── Onboarding
│   ├── Payment
│   └── Delivery
│
└── Docs
    ├── Architecture
    ├── API Reference
    └── Tutorials
```

---

## 🧠 RAG INTEGRATION (docs.smarterbot.cl)

### Flujo de Aprendizaje

```
Agente → Lee documentación de empresa
    ↓
Aprende procesos
    ↓
Crea flows automáticamente
    ↓
Propone mejoras
    ↓
Ejecuta autónomamente
```

### Comandos CLI

```bash
# Indexar documentación
smarter rag index ./docs

# Consultar documentación
smarter rag query "¿Cómo procesar reembolso?"

# Ver documentos indexados
smarter rag list
```

---

## 🎩🕹️🏎️💨🚀

```
═══════════════════════════════════════════════
  SMARTEROS v4 - PLATFORM ARCHITECTURE
═══════════════════════════════════════════════

✅ Monorepo / Plataforma definida
✅ Agent CAD (draw.smarterbot.cl)
✅ Factory de agentes
✅ Runtime de skills
✅ Marketplace de blueprints
✅ Validator.js como gatekeeper
✅ RAG integration con docs

COMPONENTES:
1. CAD de procesos
2. Factory de agentes
3. Runtime de skills
4. Marketplace de blueprints

PRÓXIMO:
1. Migrar dev/2026 a smarter-platform
2. Crear smarter dev command
3. Conectar draw.smarterbot.cl con factory

La Red trabaja.
El Arquitecto diseña.
La Plataforma escala.
═══════════════════════════════════════════════
```

---

## 📞 UBICACIÓN DE ARCHIVOS

**Specs (MANDATORY)**:
- `specs/PLATFORM-ARCHITECTURE.md` ✅ (este)
- `specs/LOCAL-IA-STACK.md` ✅
- `specs/SMARTER-CLI-SPEC.md` ✅
- `specs/ARCHITECTURE-DIAGRAMS.md` ✅

**GitHub**:
- Repo: `github.com/SmarterCL/smarteros-specs`
- Commits: 125+
- Branch: main

**Draw.io**:
- URL: https://draw.smarterbot.cl
- Room: `eba1a9217ceff501392d,WJyjqqRnE0Kh6WRtbmBEiA`

---

**ESTADO**: ✅ **ARQUITECTURA DEFINIDA - MANDATORY**  
**PRÓXIMO**: Migrar a monorepo + `smarter dev` command
