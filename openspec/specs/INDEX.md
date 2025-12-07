# OpenAPI Specifications Index

## 📊 Estado Actual

**Total Specs:** 2 activas, 3 pendientes  
**Última actualización:** 2025-12-07  
**OpenSpec Version:** 0.16.0

---

## ✅ Active Specs

### 1. api-gateway.yaml
**Status:** ✅ Production  
**Service:** Contact API  
**Framework:** FastAPI (Python)  
**URL:** https://api.smarterbot.cl  
**Version:** 1.0.0  
**Endpoints:** 3 (/, /health, /contact)

**Descripción:**  
Unified contact API for smarterbot.cl and smarterbot.store. Maneja formularios de contacto con integración Supabase y Resend.

**Tags:**
- `contact` - Contact form operations
- `health` - Health and monitoring

**Changelog:**
- 2025-12-07: Initial spec from servicios/api.smarter/openapi.yaml

---

### 2. api-smarteros-legacy.yaml
**Status:** ⚠️ Migration to FastAPI  
**Service:** Legacy API Gateway  
**Framework:** Express.js (TypeScript)  
**URL:** https://api.smarterbot.cl  
**Version:** 1.0.0  
**Endpoints:** 50+ (identity, tenants, services, templates, integrations)

**Descripción:**  
API Gateway for SmarterOS multi-tenant platform. Cubre autenticación (Clerk), gestión tenants, service registry, marketplace templates, e integraciones con Chatwoot, Odoo, Shopify, MercadoLibre.

**Tags:**
- `identity` - Auth & authorization via Clerk
- `tenants` - Tenant management (RUT-based)
- `services` - Service registry & health
- `templates` - Template marketplace
- `chatwoot` - CRM & customer support
- `odoo` - ERP & invoicing
- `shopify` - Ecommerce integration
- `ml` - MercadoLibre marketplace
- `analytics` - Metrics & reporting
- `mcp` - MCP tools & permissions

**Changelog:**
- 2025-12-07: Imported from /root/api-smarteros-openapi.yaml

**TODO:**
- [ ] Migrar endpoints a FastAPI
- [ ] Deprecar rutas legacy
- [ ] Unificar con api-gateway.yaml

---

## 🔄 Pending Specs (To Generate)

### 3. auth-api.yaml
**Status:** ❌ Not Generated  
**Service:** Auth API  
**Framework:** FastAPI (Python)  
**URL:** https://auth.smarterbot.cl  
**Port:** 8003  
**Container:** `smarteros-auth-api`

**Endpoints esperados:**
- `POST /auth/login` - WhatsApp OTP (enviar código)
- `POST /auth/verify` - Verificar código + generar UGID
- `GET /auth/session` - Info sesión actual
- `DELETE /auth/logout` - Cerrar sesión

**Generar con:**
```bash
cd /root/smarteros-auth-api
openspec init
openspec update
mv openspec/specs/auth-api.yml /root/smarteros-specs/openspec/specs/auth-api.yaml
```

---

### 4. calendar-api.yaml
**Status:** ❌ Not Generated  
**Service:** Calendar Booking API  
**Framework:** Python (Flask probable)  
**URL:** https://calendar.smarterbot.cl  
**Port:** 3020  
**Container:** `smarteros-calendar-api`

**Endpoints esperados:**
- `GET /availability` - Disponibilidad agenda
- `POST /booking` - Crear reserva
- `GET /bookings/{id}` - Consultar reserva
- Integración con Odoo Calendar

**Generar con:**
```bash
cd /root/smarteros-calendar-system
openspec init
openspec update
mv openspec/specs/calendar-api.yml /root/smarteros-specs/openspec/specs/calendar-api.yaml
```

---

### 5. contact-api.yaml
**Status:** ❌ Not Generated  
**Service:** Contact Form API (standalone)  
**Framework:** Flask (Python)  
**Port:** 3030  
**Script:** `/root/contact_api.py`

**Nota:** Puede estar duplicado con api-gateway.yaml /contact endpoint. Verificar si es necesario mantener como servicio separado.

**Generar con:**
```bash
cd /root
mkdir -p smarteros-contact-api
mv contact_api.py smarteros-contact-api/
cd smarteros-contact-api
openspec init
openspec update
mv openspec/specs/contact-api.yml /root/smarteros-specs/openspec/specs/contact-api.yaml
```

---

### 6. n8n-cl-api.yaml
**Status:** ❌ Not Generated  
**Service:** N8N Public API (Chile instance)  
**Framework:** N8N (Node.js)  
**URL:** https://n8n.smarterbot.cl  
**Port:** 5678  
**Container:** `n8n-cl`

**Spec existente:** `/root/n8n-cl/packages/cli/src/public-api/v1/openapi.yml`

**Integrar con:**
```bash
cd /root/n8n-cl
openspec init --existing packages/cli/src/public-api/v1/openapi.yml
# Revisar y copiar a /root/smarteros-specs/openspec/specs/
```

---

### 7. n8n-store-api.yaml
**Status:** ❌ Not Generated  
**Service:** N8N Public API (Store instance)  
**Framework:** N8N (Node.js)  
**URL:** https://n8n.smarterbot.store  
**Port:** 5679  
**Container:** `n8n-store`

**Spec existente:** `/root/n8n-store/packages/cli/src/public-api/v1/openapi.yml`

**Integrar con:**
```bash
cd /root/n8n-store
openspec init --existing packages/cli/src/public-api/v1/openapi.yml
# Revisar y copiar a /root/smarteros-specs/openspec/specs/
```

---

## 🚫 Excluded Services (Not REST APIs)

### Odoo (XML-RPC)
- **URL:** https://erp.smarterbot.cl, https://odoo.smarterbot.store
- **Protocol:** XML-RPC (no REST)
- **Documentación:** `servicios/erp.smarter/odoo.yml`
- **Razón exclusión:** Protocolo custom, no compatible con OpenAPI

### MCP Servers
- **Servidores:** smarteros-vault-mcp, vault-auth-validator, smarter-mcp, hostinger-mcp
- **Protocol:** MCP (Model Context Protocol) - JSON-RPC
- **Documentación:** `mcp/SERVER_README.md`
- **Razón exclusión:** No son APIs REST tradicionales

### Chatwoot Bot
- **Container:** smarteros-chatwoot-bot
- **Port:** 3100
- **Tipo:** Wrapper custom sobre Chatwoot SDK
- **Razón exclusión:** Lógica de negocio, no API pública

---

## 📈 Roadmap

### Corto Plazo (1 semana)
- [ ] Generar auth-api.yaml
- [ ] Generar calendar-api.yaml
- [ ] Revisar si contact-api.yaml es necesario
- [ ] Integrar N8N specs existentes
- [ ] Setup validación CI/CD

### Mediano Plazo (1 mes)
- [ ] Unificar api-gateway.yaml + api-smarteros-legacy.yaml
- [ ] Migrar todos los endpoints legacy a FastAPI
- [ ] Documentar todos los schemas con ejemplos
- [ ] Agregar security schemes completos (Clerk JWT)

### Largo Plazo (3 meses)
- [ ] Auto-generación specs en deploy
- [ ] Contract testing automático
- [ ] SDK auto-generado por lenguaje (Python, TS, Go)
- [ ] Documentación interactiva (Swagger UI embebido)

---

## 🔍 Validación

### Validar todas las specs
```bash
cd /root/smarteros-specs/openspec
openspec validate
```

### Validar una específica
```bash
openspec validate specs/api-gateway.yaml
```

### Ver problemas detallados
```bash
openspec validate --strict
```

---

## 📝 Convenciones

### Estructura de Spec
```yaml
openapi: 3.1.0
info:
  title: [Service Name]
  version: [SemVer]
  description: |
    [Multi-line description]
  contact:
    email: dev@smarterbot.cl

servers:
  - url: https://[service].smarterbot.cl
    description: Production
  - url: http://localhost:[PORT]
    description: Local development

tags:
  - name: [resource]
    description: [Resource operations]

paths:
  /[endpoint]:
    [method]:
      summary: [Action description]
      operationId: [camelCaseVerb]
      tags: [[resource]]
      # ... requestBody, responses, etc
```

### Versionado
- **Specs:** Seguir SemVer (1.0.0, 1.1.0, 2.0.0)
- **Breaking changes:** Incrementar major (1.x.x → 2.0.0)
- **Nuevos endpoints:** Incrementar minor (1.0.x → 1.1.0)
- **Fixes/docs:** Incrementar patch (1.0.0 → 1.0.1)

### Nombres de Operación
- **Formato:** `camelCase` starting with verb
- **Ejemplos:** `getUsers`, `createContact`, `updateTenant`, `deleteSession`
- **Evitar:** `users_get`, `ContactCreate`, `TENANT_UPDATE`

---

## 🔗 Referencias

- **OpenAPI 3.1 Spec:** https://spec.openapis.org/oas/v3.1.0
- **OpenSpec CLI Docs:** https://docs.openspec.ai
- **Swagger Editor:** https://editor.swagger.io (validar online)
- **GitHub Repo:** https://github.com/SmarterCL/smarteros-specs

---

**Mantenido por:** SmarterOS Team  
**Contacto:** dev@smarterbot.cl  
**Última revisión:** 2025-12-07
