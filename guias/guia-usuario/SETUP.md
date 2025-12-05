# SmarterOS SETUP

> Fecha: 2025-11-22

## 0. Prerrequisitos
- Hostinger VPS activo (Ubuntu 24.04) con acceso SSH
- Dominio apuntado a Cloudflare (A/AAAA + proxied)
- Vault instalado y accesible (http://vault:8200) con token inicial
- Supabase proyecto creado (URL + anon/service keys)
- Odoo instancia (empresa base creada)
- Chatwoot instancia multi-tenant
- Botpress instancia (workspace listo)
- Resend API Key
- Docker + Dokploy instalado para despliegues

## 1. Clonar Repos
```bash
mkdir -p ~/smarteros && cd ~/smarteros
# Specs (arquitectura, políticas, bootstrap)
git clone https://github.com/SmarterCL/smarteros-specs.git
# OS (infra, compose, servicios)
git clone https://github.com/SmarterCL/smarteros-os.git
# Frontend (app/onboarding)
git clone https://github.com/SmarterCL/app.smarterbot.cl.git
```

## 2. Exportar Variables Base
Crear archivo `.env.base` (cifrar luego en Vault):
```bash
HOSTINGER_API_TOKEN=xxx
SUPABASE_URL=https://xyz.supabase.co
SUPABASE_SERVICE_KEY=xxx
RESEND_API_KEY=xxx
CHATWOOT_BASE_URL=https://chatwoot.example.com
CHATWOOT_API_TOKEN=xxx
BOTPRESS_API_URL=https://botpress.example.com
BOTPRESS_API_TOKEN=xxx
ODOO_URL=https://odoo.example.com
ODOO_DB=smarteros
ODOO_USERNAME=api
ODOO_PASSWORD=xxx
FASTAPI_ADMIN_EMAIL=admin@smarterbot.cl
FASTAPI_FROM=no-reply@smarterbot.cl
```

## 3. Inicializar Vault Paths
```bash
vault kv put smarteros/mcp/hostinger api_token=$HOSTINGER_API_TOKEN
vault kv put smarteros/global/resend api_key=$RESEND_API_KEY
vault kv put smarteros/global/supabase url=$SUPABASE_URL service_key=$SUPABASE_SERVICE_KEY
```

## 4. Provisionar Tenant (Ej: RUT 76234567-9)
```bash
cd smarteros-specs
./scripts/bootstrap-tenant.sh 76234567-9 "Empresa Demo" demo@empresa.cl
```
Resultado:
- Nuevos paths: `smarteros/tenants/76234567-9/*`
- SQL sugerido para insertar en `tenants` (guardar y ejecutar en Supabase)

## 5. Aplicar SQL Base (Supabase)
```bash
psql $SUPABASE_CONN -f integrations/supabase/contacts.sql
psql $SUPABASE_CONN -f integrations/supabase/tenants.sql
# Pendiente agregar rls.sql cuando se cree
```

## 6. Desplegar Servicios Núcleo
En repo `smarteros-os` (docker-compose principal):
- Editar compose para incluir FastAPI, Chatwoot, Botpress, Odoo, n8n, Metabase, Vault.
- Remover servicios legacy Shopify / WhatsApp.
```bash
docker compose pull
docker compose up -d
```

## 7. Configurar Reverse Proxy
- Traefik/Caddy: rutas `api.smarterbot.cl`, `chatwoot.smarterbot.cl`, `botpress.smarterbot.cl`, `n8n.smarterbot.cl`, `metabase.smarterbot.cl`.
- Asegurar certificados TLS (Cloudflare Full Strict).

## 8. Frontend (app.smarterbot.cl)
- Actualizar `.env.local` para apuntar a FastAPI.
- Eliminar endpoint legacy `/api/contact` si existe.
- Consumir `POST https://api.smarterbot.cl/contact`.

## 9. Workflows Iniciales (n8n)
1. `contact_sync`:
   - Trigger: FastAPI webhook/event
   - Steps: Supabase lookup → Odoo upsert partner → Chatwoot upsert contact → Log event.
2. `intent_dispatch`:
   - Trigger: Chatwoot message inbound
   - Steps: Botpress classify → action routing → Supabase event log.
3. `product_refresh`:
   - Cron (cada 6h): Odoo export → Supabase cache update.

## 10. Seguridad
- Implementar HMAC secreto compartido para webhooks (pendiente).
- Configurar Vault policies: `api-tenant-read.hcl`, `n8n-tenant-read.hcl` por tenant.
- Activar RLS en Supabase (reglas por `tenant_rut`).

## 11. Observabilidad
- Configurar OTEL Collector → Grafana dashboards (latency, error rate).
- Definir eventos estándar en Supabase `events`.

## 12. Metabase Dashboards
- Crear: `Tenant Funnel`, `Intent Resolution`, `Lead Velocity`, `Contact Sources`.

## 13. Limpieza Legacy
- Eliminar todo rastro de Shopify / WhatsApp en specs, compose, policies.
- Depurar topics Redpanda relacionados.

## 14. Checklist Final
```text
[ ] Vault inicializado y políticas aplicadas
[ ] Tenant bootstrap ejecutado
[ ] Supabase tablas + RLS
[ ] Servicios en línea (FastAPI, Chatwoot, Botpress, Odoo, n8n, Metabase)
[ ] Proxy + TLS listo
[ ] Frontend apuntando a FastAPI
[ ] Workflows n8n base funcionando
[ ] Dashboards Metabase creados
[ ] Legacy removido
```

## 15. Próximos
- Rate limiting FastAPI.
- Firma HMAC webhooks.
- Exportar workflows n8n a repo specs.

---
Generado automáticamente.
