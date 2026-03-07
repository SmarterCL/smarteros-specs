# docs.smarterbot.cl - Semántica de Archivos

**Dominio**: docs.smarterbot.cl  
**Hosting**: Cloudflare Pages (NO Hostinger)  
**API**: Cloudflare API Pública  
**Estado**: ✅ Configurado  

---

## 📁 ESTRUCTURA SEMÁNTICA

```
docs.smarterbot.cl/
├── index.md                    # Landing page
├── README.md                   # Documentación principal
│
├── specs/                      # Especificaciones técnicas
│   ├── ORDEN-LOGICO-EJECUCION.md
│   ├── REPORTE-FINAL-v3.0.md
│   ├── SMARTEROS-V3.md
│   └── v3/
│       ├── mcp/
│       │   ├── agent.yaml
│       │   ├── ingestion.yaml
│       │   └── runtime.yaml
│       └── skills/
│           └── *.yaml
│
├── agents/                     # Agentes MCP
│   ├── cloudflare/
│   ├── github/
│   ├── picoclaw/
│   └── README.md
│
├── deploy/                     # Scripts de deploy
│   ├── autonomous-deploy.sh
│   ├── cloudflare-dns.sh
│   └── vps-setup.sh
│
├── docs/                       # Documentación de usuario
│   ├── getting-started.md
│   ├── mcp-agents.md
│   ├── picoclaw.md
│   └── telegram.md
│
├── integrations/               # Integraciones
│   ├── flow-cl.md
│   ├── mercadolibre.md
│   ├── supabase.md
│   └── telegram.md
│
└── api/                        # API Documentation
    ├── openapi.yaml
    ├── mcp-endpoints.md
    └── webhooks.md
```

---

## 🌐 CLOUDFLARE DNS CONFIGURATION

### Dominios Principales

| Dominio | Tipo | Contenido | Proxy | Estado |
|---------|------|-----------|-------|--------|
| `smarterbot.cl` | A | `<VPS-IP>` | ✅ Naranja | ⏳ Pendiente |
| `docs.smarterbot.cl` | CNAME | `smarteros-specs.pages.dev` | ✅ Naranja | ⏳ Pendiente |
| `tienda.smarterbot.cl` | A | `<VPS-IP>` | ✅ Naranja | ⏳ Pendiente |
| `smarterprop.cl` | A | `<VPS-IP>` | ✅ Naranja | ⏳ Pendiente |
| `it.smarterprop.cl` | CNAME | `smarterprop.cl` | ✅ Naranja | ⏳ Pendiente |

---

## 🔌 CLOUDFLARE API PÚBLICA

### Endpoints

```bash
# Base URL
https://api.cloudflare.com/client/v4/

# Authentication
Authorization: Bearer <API_TOKEN>
Content-Type: application/json
```

### DNS Management

```bash
# List DNS Records
GET /zones/{zone_id}/dns_records

# Create DNS Record
POST /zones/{zone_id}/dns_records
{
  "type": "CNAME",
  "name": "docs",
  "content": "smarteros-specs.pages.dev",
  "proxied": true
}

# Update DNS Record
PUT /zones/{zone_id}/dns_records/{record_id}

# Delete DNS Record
DELETE /zones/{zone_id}/dns_records/{record_id}
```

### Pages Deployment

```bash
# List Projects
GET /accounts/{account_id}/pages/projects

# Create Deployment
POST /accounts/{account_id}/pages/projects/{project_name}/deployments
```

---

## 📋 REGLAS DE PUBLICACIÓN

### 1. Todo en specs/

- ✅ Todos los reportes finales van en `specs/`
- ✅ El orden lógico se documenta en `specs/ORDEN-LOGICO-EJECUCION.md`
- ✅ Cada fase tiene su reporte: `specs/FASE-X-*.md`

### 2. GitHub First

- ✅ Todo commit local debe hacer push inmediato
- ✅ Pull antes de cualquier cambio
- ✅ Commit messages semánticos: `feat:`, `fix:`, `docs:`

### 3. Cloudflare Only (NO Hostinger)

- ✅ DNS gestionado 100% vía Cloudflare API
- ✅ Pages hosting en Cloudflare
- ✅ Sin excepciones

### 4. API Pública

- ✅ Todos los endpoints documentados en `api/`
- ✅ OpenAPI spec en `api/openapi.yaml`
- ✅ Webhooks configurados en Cloudflare

---

## 🚀 DEPLOY AUTOMÁTICO

### GitHub Actions

```yaml
# .github/workflows/deploy-docs.yml
name: Deploy Docs to Cloudflare Pages

on:
  push:
    branches: [main]
    paths: ['docs/**', 'specs/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: pages deploy docs --project-name=smarteros-specs
```

### Wrangler CLI

```bash
# Install
npm install -g wrangler

# Login
wrangler login

# Deploy
wrangler pages deploy docs/ --project-name=smarteros-specs
```

---

## 🎩🕹️🏎️💨🚀

```
═══════════════════════════════════════════════
  docs.smarterbot.cl - SEMÁNTICA
═══════════════════════════════════════════════

✅ Estructura: Ordenada por carpetas
✅ Hosting: Cloudflare Pages (NO Hostinger)
✅ DNS: Cloudflare API Pública
✅ Deploy: GitHub Actions + Wrangler
✅ Specs: Todo en specs/

REGLAS:
1. Todo en specs/
2. GitHub First (pull → commit → push)
3. Cloudflare Only
4. API Pública documentada

La Red trabaja.
YOSI arquitecto.
═══════════════════════════════════════════════
```

---

**ESTADO**: ✅ **DOCUMENTADO**  
**PRÓXIMO**: Configurar DNS en Cloudflare vía API
