# 🧠 SmarterOS — Operating System Cognitivo para PYMEs Chile
**Multi-Tenant Real • RUT Chileno • AI Multi-Agent • Shopify/Odoo Ready**

SmarterOS es un Sistema Operativo para negocios digitales, diseñado para las PYMEs de Chile.  
Integra ERP, CRM, Chat, Automatizaciones, E-commerce, Marketing, KPI y AI Agents en una sola plataforma multi-tenant, con aislamiento por RUT y arquitectura cognitiva en 3 capas.

✔ Auto-hosted en VPS (Hostinger)  
✔ Multi-tenant real por RUT  
✔ API Gateway + MCP + Vault  
✔ Odoo 19 y Shopify listos para venta  
✔ n8n + Botpress + Chatwoot + Metabase  
✔ Portal Next.js con Clerk SSO  
✔ Capacidades nativas de IA en cada módulo  

---

# 🚀 Visión
Construir el primer Operating System cognitivo de LATAM, especializado en empresas con RUT chileno, enfocado en comercio, servicios, ventas por WhatsApp y automatización con IA.

---

# 🏗️ Arquitectura General

                  SmarterOS
           ────────────────────────
            Portal Maestro (Next.js)
           /            |           \
      ERP (Odoo)     CRM (Chatwoot)   Marketing (Blog)
         |              |              |
      Tienda Odoo    Chat IA        Landing
         |              |              |
     Automatizaciones (n8n) — Bot IA (Botpress)
              |             |
              +── KPI (Metabase)

---

# 🧩 Componentes Principales

## 1) Portal Maestro — `app.smarterbot.cl`
Next.js + Clerk SSO  
Dashboard unificado  
Acceso único (SSO)  
Multi-tenant por RUT  
Gestión de tenant, usuarios y dominios  

---

## 2) ERP — `odoo.smarterbot.cl`
Odoo 19.0  
Ventas, inventario, compras, facturación  
Tienda online + POS  
Integración Shopify  
Theme propio vía GitHub Actions  
Addon Clerk integrado  

---

## 3) CRM / Inbox — `crm.smarterbot.cl`
Chatwoot omnicanal  
WhatsApp, Email, Web, Instagram  
Handoff AI ↔ humano  
Workspaces por RUT  
Integración n8n y Botpress  

---

## 4) Automatizaciones — `n8n.smarterbot.store`
Workflows ilimitados  
OCR (Vision API)  
Webhooks Shopify / Odoo  
Clasificación LLM  
Integraciones empresariales  

---

## 5) Bot IA — `botpress.smarterbot.store`
Botpress Cloud + Self-hosted  
AI multi-agent  
RAG por tenant (pgvector)  
Agentes especializados por rol  
Handoff automático → Chatwoot  

---

## 6) KPI — `kpi.smarterbot.cl`
Metabase + PostgreSQL  
Dashboards en tiempo real  
Métricas por tenant  
KPIs de ventas, soporte y conversión  

---

## 7) Marketing — `mkt.smarterbot.cl`
Blog corporativo  
Centro de contenido  
Publicación vía GitHub Actions  
SEO base  

---

# 🔐 IAM y Seguridad

## Clerk (SSO)
Login unificado  
JWT seguro  
Roles por tenant  
Sesiones modernas  

## MCP + Vault
Secrets por tenant  
Audit logs  
Policies por RUT  
Integración segura de agentes  

## Supabase (DB)
Row-Level Security  
Multi-tenant real  
Realtime events  
Tablas normalizadas  

---

# 🌐 Servicios en Producción

| Servicio | Dominio |
|----------|---------|
| Portal | https://app.smarterbot.cl |
| ERP | https://odoo.smarterbot.cl / https://erp.smarterbot.cl |
| CRM | https://crm.smarterbot.cl |
| Chat | https://chatwoot.smarterbot.store |
| Automatizaciones | https://n8n.smarterbot.store |
| Bots IA | https://botpress.smarterbot.store |
| KPI | https://kpi.smarterbot.cl |
| Marketing | https://mkt.smarterbot.store |
| API Gateway | https://api.smarterbot.cl |
| DevOps | https://dokploy.smarterbot.store |

Todos con SSL activo.

---

# 🧠 Arquitectura Cognitiva (3 Capas)

Layer 1 — Inbox (Chatwoot)
Layer 2 — Cognitive AI (Botpress + RAG)
Layer 3 — Execution Engine (n8n)

Latencia total: 2–7s  
Aislamiento por RUT aplicado en toda la plataforma  

---

# 🛠️ Tecnologías

- Odoo 19  
- Next.js 14  
- Clerk SSO  
- FastAPI  
- n8n  
- Chatwoot  
- Botpress  
- Metabase  
- PostgreSQL 16  
- Supabase  
- Caddy + Traefik  
- Docker Compose  
- Hostinger VPS  

---

# 📦 Repositorios

- https://github.com/SmarterCL/smarteros-landing  
- https://github.com/SmarterCL/smarteros-portal  
- https://github.com/SmarterCL/smarteros-crm  
- https://github.com/SmarterCL/smarteros-marketing  
- https://github.com/SmarterCL/odoo-smarter-theme  

---

# 💵 Modelo Comercial

Free — Sandbox  
Starter — $29/mes  
Business — $99/mes  
Enterprise — $299/mes  

---

# 🚀 Roadmap 2026
Pagos Chile (Webpay/Khipu)  
Contabilidad automática  
Booking inteligente  
Shopify App oficial  
Marketplace SmarterBot.store  
Mobile PWA  

---

# 📞 Contacto
Email: smarterbotcl@gmail.com  
WhatsApp: +56 9 7954 0471  
Web: https://smarterbot.cl  

---

# 🟢 SmarterOS — Hecho en Chile para PYMEs de Chile
Automatización, ventas, operaciones y AI en una sola plataforma cognitiva.
