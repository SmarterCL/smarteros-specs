# 🎨 SmarterOS Demo - draw.smarterbot.cl

**Fecha**: 2026-03-07  
**Hora**: 1:30 PM CLT  
**Estado**: ✅ **DEMO CREADO - LISTO PARA IMPORTAR**  
**Mandatory**: specs/ ✅  
**URL**: https://draw.smarterbot.cl  

---

## 📊 INSTRUCCIONES PARA CREAR EL DEMO

### Paso 1: Abrir draw.smarterbot.cl

```
URL: https://draw.smarterbot.cl/#room=eba1a9217ceff501392d,WJyjqqRnE0Kh6WRtbmBEiA
```

### Paso 2: Importar Diagrama

1. **Abrir el archivo**:
   ```
   /Users/mac/Downloads/smarteros-specs/drawio/smarteros-v4-demo.drawio
   ```

2. **En draw.smarterbot.cl**:
   - Click en `File` → `Import From` → `Device...`
   - Seleccionar `smarteros-v4-demo.drawio`
   - Click en `Import`

3. **Guardar en la sala**:
   - Click en `File` → `Save`
   - El diagrama se guarda en la sala compartida

---

## 🏗️ DIAGRAMA 1: AGENT EXECUTION FLOW

### Componentes

| Componente | Color | Función |
|------------|-------|---------|
| **draw.smarterbot.cl** | 🟢 Verde | Usuario dibuja proceso |
| **Blueprint Generator** | 🔵 Azul | Genera blueprint |
| **Agent Factory** | 🔵 Azul | Crea agente |
| **Validator.js** | 🔴 Rojo | Valida estado (Gatekeeper) |
| **Skills Runtime** | 🔵 Azul | Ejecuta skills |
| **Services** | 🔵 Azul | Conecta servicios |

### Servicios Conectados

| Servicio | Color | Tipo |
|----------|-------|------|
| MercadoPago | 🟢 Verde | Pagos |
| Telegram | 🟢 Verde | Mensajería |
| Odoo ERP | 🟢 Verde | ERP |

### Flujo

```
draw.smarterbot.cl
    ↓
Blueprint Generator
    ↓
Agent Factory
    ↓
Validator.js (Gatekeeper)
    ↓
Skills Runtime
    ↓
Services → MercadoPago, Telegram, Odoo
```

---

## 🏗️ DIAGRAMA 2: PLATFORM ARCHITECTURE

### Carpetas Principales (7)

| Carpeta | Color | Componentes |
|---------|-------|-------------|
| **core/** | 🔵 Azul | smarteros, validator, agent-runtime |
| **agents/** | 🔵 Azul | sales, logistics, crm, support |
| **services/** | 🔵 Azul | payments, crm, erp, logistics |
| **apps/** | 🔵 Azul | app.smarterbot, webcontrol, store |
| **integrations/** | 🔵 Azul | mercadopago, telegram, whatsapp, odoo |
| **blueprints/** | 🔵 Azul | mvp, ecommerce, crm, marketplace |
| **ui/** | 🟣 Magenta | draw.smarterbot, agent-cad |

### Estructura Visual

```
┌──────────────────────────────────────────────────────────┐
│  SMARTEROS v4 - PLATFORM ARCHITECTURE                    │
├──────────────────────────────────────────────────────────┤
│  core/      agents/    services/   apps/    integrations/│
│  smarteros  sales      payments    app      mercadopago  │
│  validator  logistics  crm         web      telegram     │
│  runtime    crm        erp         store    whatsapp     │
│             support    logistics            odoo         │
├──────────────────────────────────────────────────────────┤
│  blueprints/              ui/ (CAD)                      │
│  mvp-startup              draw.smarterbot ⭐             │
│  ecommerce                agent-cad                      │
│  crm-basic                store-templates                │
│  marketplace                                             │
│  logistics                                               │
└──────────────────────────────────────────────────────────┘
```

---

## 🎯 ELEMENTOS CLAVE DEL DEMO

### 1. Validator.js (Gatekeeper)

**Destacado en ROJO** porque es el componente crítico:

```javascript
// Funciones principales:
1. Validar BOT_STATUS
2. Conectar MCP_ENDPOINT (http://localhost:3051)
3. Inicializar MercadoPagoAPI
```

### 2. draw.smarterbot.cl (CAD)

**Destacado en VERDE** porque es la entrada del usuario:

```
Usuario → Dibuja proceso → Sistema genera blueprint
```

### 3. ui/ Folder (Magenta)

**Destacado en MAGENTA** porque es la interfaz visual:

```
draw.smarterbot.cl → Agent CAD → Blueprint Generator
```

---

## 📋 GUÍA DE PRESENTACIÓN

### Demo Flow (5 minutos)

1. **Minuto 1**: Mostrar draw.smarterbot.cl
   - Usuario dibuja proceso simple
   - Ejemplo: CRM → Ventas → Pago → Envío

2. **Minuto 2**: Mostrar Blueprint Generator
   - Sistema genera blueprint automáticamente
   - Muestra YAML generado

3. **Minuto 3**: Mostrar Agent Factory
   - Factory crea agente desde blueprint
   - Agente conecta skills automáticamente

4. **Minuto 4**: Mostrar Validator.js
   - Valida estado del agente
   - Conecta MercadoPago (si hay token)

5. **Minuto 5**: Mostrar Platform Architecture
   - 7 carpetas principales
   - Marketplace de agentes
   - RAG integration con docs

---

## 🔧 COMANDOS CLI PARA EL DEMO

```bash
# 1. Mostrar estado del sistema
smarter status

# 2. Ver agentes instalados
smarter agent list

# 3. Crear agente desde blueprint
smarter blueprint deploy ecommerce

# 4. Ver skills disponibles
smarter skill list

# 5. Ejecutar health check
smarter health check

# 6. Abrir documentación
smarter docs

# 7. Ver arquitectura
smarter architecture
```

---

## 🎩🕹️🏎️💨🚀

```
═══════════════════════════════════════════════
  DEMO INSTRUCTIONS - draw.smarterbot.cl
═══════════════════════════════════════════════

PASOS:
1. Abrir: https://draw.smarterbot.cl
2. Importar: smarteros-v4-demo.drawio
3. Guardar en sala
4. Presentar flujo (5 min)

COMPONENTES CLAVE:
🟢 draw.smarterbot.cl (Entrada)
🔴 Validator.js (Gatekeeper)
🔵 Agent Factory (Core)
🟣 ui/ folder (CAD)

DEMO FLOW:
1. Usuario dibuja → 2. Blueprint → 3. Agente
→ 4. Skills → 5. Servicios

La Red trabaja.
El Arquitecto demuestra.
La Plataforma escala.
═══════════════════════════════════════════════
```

---

## 📞 UBICACIÓN DE ARCHIVOS

**Diagrama draw.io**:
- `drawio/smarteros-v4-demo.drawio` ✅

**Specs**:
- `specs/DEMO-INSTRUCTIONS.md` ✅ (este)
- `specs/PLATFORM-ARCHITECTURE.md` ✅
- `specs/ARCHITECTURE-DIAGRAMS.md` ✅

**GitHub**:
- Repo: `github.com/SmarterCL/smarteros-specs`
- Commits: 126+

**URL**:
- https://draw.smarterbot.cl
- Room: `eba1a9217ceff501392d,WJyjqqRnE0Kh6WRtbmBEiA`

---

**ESTADO**: ✅ **DEMO CREADO - LISTO PARA IMPORTAR**  
**PRÓXIMO**: Importar en draw.smarterbot.cl y presentar
