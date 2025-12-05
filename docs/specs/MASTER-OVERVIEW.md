# SmarterOS Master Overview

## Core Pillars
- CRM: Chatwoot
- BOT: Botpress
- ERP: Odoo
- Workflows: n8n
- API Gateway: FastAPI (api.smarterbot.cl)
- Data Lake + OLTP: Supabase (Postgres + Storage + Auth)
- Metrics & BI: Metabase
- Secrets & Policy: Vault
- Observability: Redpanda (events), Grafana, OTEL Collector
- Infrastructure: Hostinger VPS + Dokploy + Traefik + Cloudflare

## Tenant Model Summary
Each tenant provisioned via `scripts/bootstrap-tenant.sh` obtains isolated secrets and runtime context:
- Vault Paths: `smarteros/tenants/<rut>/{chatwoot,botpress,odoo,supabase}`
- Supabase RLS: row-level policies keyed by `tenant_rut`
- Chatwoot: dedicated inbox ID + account mapping
- Botpress: workspace + bot IDs for intent routing
- Odoo: company (or database partition) for ERP separation
- n8n: namespaced workflows tagged with `tenant:<rut>`

## High-Level Data Flows
1. Contact Intake: Frontend → FastAPI `/contact` → Supabase `contacts` → (optional) Chatwoot conversation + Resend email → n8n enrichment → Odoo partner sync.
2. Conversational Loop: Chatwoot inbound → Webhook → FastAPI → Botpress intent → n8n action → Odoo / Supabase write-back → Event logged → Metabase dashboard.
3. Product & Inventory Sync: Odoo → n8n scheduled export → Supabase cache table → Frontend storefront consumption.
4. Event Analytics: (Chatwoot, Botpress, Odoo) → n8n emit → Supabase `events` → Metabase metrics.

## Security Layers
- Vault policies per service (api, n8n) restrict tenant scopes.
- API Key or HMAC planned for webhook authenticity (Chatwoot/Botpress).
- Supabase RLS ensures tenant isolation at row level.
- Segregated SSH operations vs MCP API control (Hostinger Tier 0).

## Pending Enhancements
- Implement RLS SQL scripts (tenants, contacts policies).
- HMAC signature validation for inbound webhooks.
- n8n base workflows: contact_sync, intent_dispatch, product_refresh.
- Rate limiting & API keys for FastAPI.
- Metabase curated dashboards (tenant KPIs, intent resolution, lead funnel).

## Decommissioned Components
- Shopify (removed) → replaced by headless Next.js + Odoo product master.
- WhatsApp direct layer (removed) → replaced by Chatwoot omnichannel abstraction.

## Observability & Auditing
- Structured events via Supabase `events` (type, source, metadata JSONB).
- Redpanda topics used for internal buffering (optional, future refactor) but Shopify/WhatsApp topics to be pruned.
- Grafana dashboards for system health (CPU, latency, error rates).

## Multi-Repo Synchronization Targets
- smarteros-specs: source of truth for architecture, policies, bootstrap.
- smarteros-os: compose stacks, reverse proxy routes for Chatwoot/Botpress/FastAPI.
- app.smarterbot.cl: remove legacy API contact handling; point to FastAPI endpoint; reflect new tenant onboarding.

## Next Operational Steps
1. Finalize cleanup (remove Shopify/WhatsApp mentions across specs & compose).
2. Introduce `SETUP.md` with end-to-end installation.
3. Implement initial n8n workflows and export JSON to `integrations/n8n/` (new dir).
4. Add Supabase RLS migration scripts under `integrations/supabase/rls.sql`.
5. Document webhook schemas for Chatwoot & Botpress under existing integration directories.

---
Generated: 2025-11-22
