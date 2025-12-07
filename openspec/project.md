# SmarterOS VPS - Project Context

## Purpose
**SmarterOS** es una plataforma multi-tenant de automatización empresarial que unifica:
- **ERP** (Odoo) - Gestión empresarial
- **CRM** (Chatwoot) - Atención al cliente
- **Automation** (N8N) - Workflows visuales
- **AI Agents** (MCP) - Inteligencia artificial
- **Identity** (Clerk + WhatsApp OTP) - Autenticación universal

**Objetivo:** Ofrecer SaaS completo para PYMES chilenas con onboarding en <5 minutos.

---

## Tech Stack

### Backend APIs (Python)
- **FastAPI** (smarteros-auth-api) - Puerto 8003
- **Flask** (calendar-api, contact-api) - Puertos 3020, 3030
- **Python 3.11+** - Runtime principal backend
- **Uvicorn/Gunicorn** - ASGI/WSGI servers

### Frontend (Next.js/React)
- **Next.js 15** (App Router) - smarteros-api-implementation
- **React 19** - UI components
- **TypeScript 5.x** - Type safety
- **Tailwind CSS 4** - Styling
- **Shadcn/ui** - Component library

### Infrastructure
- **Docker Compose** - Orchestration (30+ containers)
- **Caddy 2** - Reverse proxy + SSL automático
- **PostgreSQL 16** - Base de datos principal
- **Supabase** - PostgreSQL + Auth + Realtime
- **Dokploy** - Self-hosted PaaS (alternativa Vercel)

### Automation & Integration
- **N8N 1.121.3** - 2 instancias (cl, store) en puertos 5678/5679
- **Odoo 17** - 2 instancias (erp, demo) en puertos 8069/8070
- **Chatwoot** - CRM en puerto 3100
- **MCP Servers** - 4 activos (vault, hostinger, smarter, validator)

### AI/ML
- **OpenAI API** - GPT-4 para agentes
- **Anthropic Claude** - Asistentes conversacionales
- **MCP Protocol** - Model Context Protocol para tools
- **N8N AI Nodes** - Integración workflows

---

## Project Conventions

### Code Style

#### Python (Backend APIs)
```python
# PEP 8 + Black formatter
# Imports: stdlib → third-party → local
from typing import Optional
from fastapi import APIRouter, HTTPException
from .models import User

# Snake_case para funciones/variables
def create_user_session(ugid: str) -> dict:
    """Docstrings en formato Google."""
    pass

# Type hints obligatorios
async def get_user(ugid: str) -> Optional[User]:
    pass
```

#### TypeScript/React (Frontend)
```typescript
// Prettier + ESLint
// PascalCase para componentes
export function UserDashboard({ userId }: Props) {
  // camelCase para variables
  const userName = useUserName(userId);
  
  // Hooks al inicio
  const [data, setData] = useState<Data | null>(null);
  
  return <div>...</div>;
}

// Named exports (no default exports)
export { UserDashboard };
```

#### Shell Scripts
```bash
#!/bin/bash
set -euo pipefail  # Fail-fast

# UPPER_CASE para constantes
readonly API_URL="https://api.smarterbot.cl"

# lowercase para variables
api_key="..."

# Funciones con snake_case
function check_health() {
  curl -s "$API_URL/health"
}
```

### Architecture Patterns

#### Multi-tenancy (RUT-based)
- Identificador: RUT chileno sin puntos ni guiones (ej: `12345678-9` → `123456789`)
- Schema: PostgreSQL Row-Level Security (RLS) por `tenant_id`
- Subdominios: `{tenant}.smarterbot.cl` (opcional, mayoría usa SaaS compartido)

#### Identity System (UGID)
- **UGID** (Universal Global ID): UUID v4 único por usuario
- **Auth flow:** WhatsApp OTP (6 dígitos) → JWT session token
- **Sync:** Propagación automática a Odoo, Chatwoot, N8N
- **Storage:** Supabase `user_auth` table

#### API Gateway Pattern
```
User → Caddy (SSL/routing) → API Gateway (Express)
                               ↓
                    ┌──────────┼──────────┐
                    ↓          ↓          ↓
                 Auth API   Calendar   Contact
```

#### MCP (Model Context Protocol)
- **Server:** Expone tools vía JSON-RPC
- **Client:** N8N, Copilot, otros agentes
- **Registry:** smarteros-mcp-registry en puerto 3090
- **Discovery:** HTTP GET `/tools` para listado

### Testing Strategy

#### Unit Tests
```bash
# Python: pytest
pytest tests/ -v --cov=app

# TypeScript: Jest + React Testing Library
npm test -- --coverage
```

#### Integration Tests
```bash
# N8N Workflows: test mode en interface
# APIs: curl scripts en /root/test-*.sh
./test-auth-system.sh
./test-tenant-api.sh
```

#### E2E (Manual)
1. Enviar código WhatsApp
2. Verificar UGID generado
3. Confirmar sync en Odoo/Chatwoot
4. Validar sesión JWT

### Git Workflow

#### Branches
- `main` - Producción (VPS)
- `dev` - Desarrollo
- `feature/nombre` - Features
- `fix/nombre` - Bugfixes

#### Commits (Conventional Commits)
```
feat(auth): add WhatsApp OTP verification
fix(api): resolve CORS issue in calendar endpoint
docs(openspec): update project.md with tech stack
chore(deps): bump fastapi to 0.115.0
```

#### Deployment
```bash
# Push a GitHub
git push origin main

# Deploy manual en VPS
ssh root@vps
cd /root/smarteros-api-implementation
docker compose up -d --build
```

---

## Domain Context

### Chilean Business Requirements
- **RUT** (Rol Único Tributario): Identificador fiscal obligatorio
- **SII** (Servicio de Impuestos Internos): Integración facturación electrónica
- **Ley 19.628**: Protección de datos personales (compliance GDPR-like)
- **WhatsApp Business:** Canal preferido de comunicación B2C

### SmarterOS Terminology
- **Tenant** = Empresa cliente (identificada por RUT)
- **UGID** = Universal Global ID (usuario único cross-system)
- **Template** = Plantilla de automatización (marketplace)
- **Agent** = Bot IA con acceso a MCP tools
- **Workflow** = Flujo N8N (visual automation)
- **Instance** = Contenedor/servicio dedicado por tenant

### Integration Patterns
1. **Webhook-based:** N8N recibe eventos de Chatwoot, Shopify, ML
2. **XML-RPC:** Odoo (legacy, migrar a REST)
3. **REST API:** Majority de integraciones
4. **MCP:** Agentes IA (nuevas integraciones)

---

## Important Constraints

### Technical
- **Monolito VPS:** 1 servidor, 30+ containers (migrar a k8s en Q2 2025)
- **SSL/TLS:** Cloudflare Origin Certificates (no Let's Encrypt directamente)
- **Puerto 80/443:** Único entry point (Caddy reverse proxy)
- **No service mesh:** Comunicación container-to-container por nombres Docker

### Business
- **Chile-first:** Localización (es-CL), RUT validation, SII compliance
- **Multi-tenant:** Aislamiento datos crítico (PostgreSQL RLS)
- **Uptime:** >99% SLA informal (no 24/7 support aún)

### Regulatory
- **Ley 19.628:** Consentimiento explícito para datos personales
- **SII Compliance:** Facturas electrónicas con firma digital
- **WhatsApp Policy:** Ventanas de 24h para mensajes proactivos

### Performance
- **N8N:** Max 100 workflows activos por instancia
- **Odoo:** 50 concurrent users por container (8GB RAM)
- **Supabase:** Connection pooling (PgBouncer) habilitado
- **Caddy:** Rate limiting 100 req/min per IP

---

## External Dependencies

### Critical (outage = downtime)
1. **Supabase Cloud** (DB principal)
   - URL: `https://[proyecto].supabase.co`
   - Backup diario automático
   - Failover: no configurado (TODO)

2. **Cloudflare** (DNS + SSL)
   - API Key almacenado en `/root/.env.cloudflare`
   - CAA records para Cloudflare Origin CA

3. **WhatsApp Business API** (Meta)
   - Phone ID: almacenado en `WHATSAPP_PHONE_ID`
   - Token: renovar cada 60 días

### High Priority
4. **Clerk.com** (Auth UI)
   - Publishable key: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Webhook secret: `CLERK_WEBHOOK_SECRET`

5. **OpenAI API** (Agentes IA)
   - Key: `OPENAI_API_KEY`
   - Límite: 10K tokens/min (tier 2)

6. **Anthropic** (Claude)
   - Key: `ANTHROPIC_API_KEY`
   - Límite: 5K tokens/min

### Medium Priority
7. **Odoo.com** (Apps/Modules)
   - Cuenta: `dev@smarterbot.cl`
   - Apps instaladas: accounting_cl, whatsapp_connector

8. **Chatwoot Cloud** (opcional)
   - Self-hosted primario
   - Cloud backup: `https://app.chatwoot.com`

9. **N8N Cloud** (templates)
   - Comunidad: importar workflows .json
   - No usamos N8N Cloud (self-hosted)

### Monitoring
10. **GitHub** (repos + webhooks)
    - Org: `smarteros-os`
    - PAT: `GITHUB_TOKEN`
    - Webhooks: N8N endpoints

11. **Sentry** (error tracking - TODO)
    - DSN: pendiente configuración

---

## OpenSpec Usage

### Specs Location
```
/root/
├── smarteros-api-implementation/     # Main API Gateway
│   └── openspec/specs/api-gateway.yml
├── smarteros-auth-api/               # Auth API
│   └── openspec/specs/auth-api.yml
├── smarteros-calendar-system/        # Calendar API
│   └── openspec/specs/calendar-api.yml
└── api-smarteros-openapi.yaml        # Legacy (unificar)
```

### Change Workflow
1. **Proponer:** `openspec change --name feature-name`
2. **Implementar:** Codificar cambios
3. **Validar:** `openspec validate feature-name`
4. **Archivar:** `openspec archive feature-name` (merge a main spec)

### Validation CI/CD
```bash
# Pre-commit hook (cada repo)
openspec validate || exit 1

# Global check
/root/validate-specs.sh  # Valida 5 APIs
```

---

## Key Files Reference

### Configuration
- `/root/.env*` - Variables de entorno (múltiples archivos)
- `/root/Caddyfile` - Reverse proxy + SSL
- `/root/docker-compose-*.yml` - 15+ compose files

### Documentation
- `/root/SMARTEROS-COMPLETE-STATUS-2025-12-01.md` - Estado completo
- `/root/OPENSPEC-IMPLEMENTATION-PLAN.md` - Este plan
- `/root/README.md` - Onboarding general

### Scripts
- `/root/smarteros-*.sh` - Automation helpers
- `/root/deploy-*.sh` - Deployment scripts
- `/root/validate-specs.sh` - OpenSpec validation

---

**Última actualización:** 2025-12-07  
**Mantenedores:** SmarterOS Team  
**Contacto:** dev@smarterbot.cl
