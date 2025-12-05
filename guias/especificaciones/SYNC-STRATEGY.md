# SmarterOS Repository Sync Strategy

## Scope
Synchronize three repositories and remove deprecated Shopify/WhatsApp footprint:
- smarteros-specs (docs, policies, setup) → now updated
- smarteros-os (infrastructure & compose files) → pending refactor
- app.smarterbot.cl (frontend & onboarding) → pending cleanup

## Objectives
1. Align architecture across repos (CRM + BOT + ERP + API + Data + Workflows + KPI).
2. Remove legacy Shopify/WhatsApp references (docs, compose, policies, topics).
3. Point frontend to FastAPI gateway instead of internal Next.js API.
4. Ensure tenant bootstrap pipeline reproducible end-to-end.

## Diff Plan (Phased)
### Phase 1: Specs (Completed)
- Added: `MASTER-OVERVIEW.md`, `SETUP.md`, integrations, policies, bootstrap script.
- Action: Commit & push (done).

### Phase 2: smarteros-os
Tasks:
- Update docker-compose: remove Shopify/WhatsApp services if present; add/verify FastAPI, Chatwoot, Botpress, Odoo, n8n, Metabase, Vault.
- Prune Redpanda topics (remove shopify.* and whatsapp.* definitions).
- Add environment variables for new services referencing Vault injection process.
- Verify Traefik route labels for new domains.

### Phase 3: app.smarterbot.cl
Tasks:
- Remove legacy `/api/contact` implementation and associated handler code.
- Introduce single service config pointing to `FASTAPI_BASE_URL`.
- Update onboarding flows to create contact via FastAPI.
- Ensure no hard-coded Shopify/WhatsApp UI hints remain.

### Phase 4: Security & Policies
Tasks:
- Implement Supabase RLS scripts (`integrations/supabase/rls.sql`).
- Vault: deprecate `smarteros/mcp/shopify` + `smarteros/mcp/whatsapp` paths (archive or delete) and update policies.
- Add HMAC secret storage path: `smarteros/mcp/webhooks`.

### Phase 5: Workflows & Export
Tasks:
- Create n8n workflows: `contact_sync`, `intent_dispatch`, `product_refresh`.
- Export JSON to `integrations/n8n/` in specs repo and commit.
- Document each workflow in README.

### Phase 6: Observability & Metrics
Tasks:
- Define supabase `events` table schema if not present; document event types.
- Build Metabase dashboards definition docs (e.g., `dashboards/tenant-funnel.md`).

## File Movement / Deletions (Expected)
- Delete: Shopify-specific integration docs in specs (Metabase Shopify integration, flows referencing Shopify).
- Delete/Archive: WhatsApp-specific operational guides.
- Move: Any generic event definitions into `integrations/events/` (to create).

## Validation Checklist
```text
[ ] docker-compose updated (smarteros-os)
[ ] no Shopify/WhatsApp services defined
[ ] Traefik routes expose new services
[ ] Frontend uses FastAPI endpoint
[ ] Legacy API route removed
[ ] Vault paths updated, old ones deprecated
[ ] RLS policies applied
[ ] n8n workflows exported & committed
[ ] Event schema documented
[ ] Dashboards defined
```

## Risk Mitigation
- Perform deletions in a branch; merge after review.
- Keep archived legacy docs under `legacy/` for 14 days if needed.
- Add automated smoke test script hitting `/health`, `/contact`, and checking n8n webhook endpoints.

## Next Actions
1. Start Phase 2 modifications in smarteros-os repo.
2. Draft RLS SQL and add to specs.
3. Generate initial n8n workflow skeletons.

---
Generated: 2025-11-22
