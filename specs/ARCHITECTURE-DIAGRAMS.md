# 🎨 SmarterOS - Architecture Diagrams (draw.smarterbot.cl)

**Fecha**: 2026-03-07  
**Hora**: 1:00 PM CLT  
**Estado**: ✅ **ACTIVO - MANDATORY**  
**Mandatory**: specs/ ✅  
**URL**: https://draw.smarterbot.cl  

---

## 📊 RESUMEN EJECUTIVO

```
╔══════════════════════════════════════════════════════════╗
║     draw.smarterbot.cl - ARCHITECTURE DIAGRAMS           ║
╠══════════════════════════════════════════════════════════╣
║  URL: https://draw.smarterbot.cl                         ║
║  ROOM: eba1a9217ceff501392d,WJyjqqRnE0Kh6WRtbmBEiA       ║
║  ESTADO: ✅ Activo                                       ║
║  INTEGRACIÓN: GitHub + docs.smarterbot.cl                ║
╚══════════════════════════════════════════════════════════╝
```

---

## 🏗️ DIAGRAMAS DE ARQUITECTURA

### Room ID Actual

```
Room: eba1a9217ceff501392d,WJyjqqRnE0Kh6WRtbmBEiA
URL: https://draw.smarterbot.cl/#room=eba1a9217ceff501392d,WJyjqqRnE0Kh6WRtbmBEiA
```

### Diagramas Principales

| Diagrama | ID | Estado | Última Actualización |
|----------|-----|--------|---------------------|
| **SmarterOS v4 Architecture** | Main | ✅ Activo | 2026-03-07 |
| **MCP Agents Flow** | MCP-01 | ✅ Activo | 2026-03-07 |
| **Local IA Stack** | IA-01 | ✅ Activo | 2026-03-07 |
| **CLI Architecture** | CLI-01 | ✅ Activo | 2026-03-07 |
| **Deployment Flow** | DEPLOY-01 | ✅ Activo | 2026-03-07 |

---

## 🔗 INTEGRACIÓN CON GITHUB

### Sync Automático

```bash
# Exportar diagramas a GitHub
smarter diagrams export

# Importar desde GitHub
smarter diagrams import

# Ver estado de sync
smarter diagrams status
```

### Estructura en GitHub

```
smarteros-specs/
├── diagrams/
│   ├── architecture.drawio
│   ├── mcp-agents.drawio
│   ├── local-ia-stack.drawio
│   └── cli-architecture.drawio
├── specs/
│   ├── LOCAL-IA-STACK.md
│   ├── SMARTER-CLI-SPEC.md
│   └── ...
└── docs/
    └── architecture/
        └── *.png (exported from draw.io)
```

---

## 📐 DIAGRAMAS DOCUMENTADOS

### 1. SmarterOS v4 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  SMARTEROS v4 - FULL ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐         ┌─────────────┐                   │
│  │  Smarter CLI │        │  OpenCode   │                   │
│  │  (Terminal) │        │  (MCP)      │                   │
│  └──────┬──────┘         └──────┬──────┘                   │
│         │                       │                          │
│         └───────────┬───────────┘                          │
│                     │                                      │
│              ┌──────▼──────┐                               │
│              │  n8n (IA)   │                               │
│              │  Orchestrator│                              │
│              └──────┬──────┘                               │
│                     │                                      │
│         ┌───────────┼───────────┐                          │
│         │           │           │                          │
│  ┌──────▼──────┐ ┌──▼──────┐ ┌─▼──────────┐               │
│  │   Ollama    │ │ MiniMax │ │ Supabase   │               │
│  │  (LLM)      │ │ (MLX)   │ │ (RAG)      │               │
│  └─────────────┘ └─────────┘ └────────────┘               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2. MCP Agents Flow

```
┌─────────────────────────────────────────────────────────────┐
│  MCP AGENTS - FLOW                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Port 3050: Session Manager ──► WebMCP Extension           │
│  Port 3052: Cloudflare MCP ──► DNS + Workers               │
│  Port 3053: GitHub MCP ──► Repos + CI/CD                   │
│  Port 3054: MercadoPago MCP ──► Pagos LATAM                │
│  Port 3057: Flow.cl MCP ──► Pagos Chile + DTE              │
│  Port 3058: Odoo Integration ──► ERP + Stock               │
│  Port 3059: PicoClaw ──► Hardware + Telemetry              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3. Local IA Stack

```
┌─────────────────────────────────────────────────────────────┐
│  LOCAL IA STACK - v4                                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  User Input ──► Smarter CLI ──► n8n Orchestrator           │
│                                      │                      │
│                    ┌─────────────────┼─────────────────┐   │
│                    │                 │                 │   │
│             ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐│
│             │   Ollama    │  │  MiniMax    │  │  Supabase   ││
│             │  :11434     │  │  (MLX)      │  │  :54321     ││
│             │  llama3.1   │  │  Advanced   │  │  RAG        ││
│             │  mistral    │  │  Reasoning  │  │  Embeddings ││
│             └─────────────┘  └─────────────┘  └─────────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4. CLI Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  SMARTER CLI - COMMANDS                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  smarter agent create/run/list                              │
│  smarter node start/stop/status                             │
│  smarter rag read/analyze/suggest                           │
│  smarter skill list/install/enable                          │
│  smarter factory view                                       │
│  smarter blueprint list/deploy                              │
│  smarter health check (3-CYCLE)                             │
│  smarter status/docs/specs                                  │
│                                                             │
│  Install: curl -sSL smarter.sh | bash                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5. Deployment Flow

```
┌─────────────────────────────────────────────────────────────┐
│  DEPLOYMENT FLOW                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Local Dev ──► Git Commit ──► GitHub ──► Cloudflare Pages  │
│      │                              │                      │
│      │                              └──► docs.smarterbot.cl│
│      │                              │                      │
│      └──────────────────────────────────► VPS (Dokploy)    │
│                                                             │
│  DNS: Cloudflare (NO Hostinger)                            │
│  Hosting: Cloudflare Pages + VPS                           │
│  CI/CD: GitHub Actions                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 COMANDOS PARA DIAGRAMAS

### Exportar Diagramas

```bash
# Exportar todos los diagramas
smarter diagrams export

# Exportar diagrama específico
smarter diagrams export architecture

# Formatos disponibles
smarter diagrams export --format png
smarter diagrams export --format svg
smarter diagrams export --format pdf
```

### Importar Diagramas

```bash
# Importar desde GitHub
smarter diagrams import

# Importar desde archivo local
smarter diagrams import ./diagrams/architecture.drawio
```

### Ver Estado

```bash
# Ver estado de sync
smarter diagrams status

# Ver últimos cambios
smarter diagrams log
```

---

## 📊 INTEGRACIÓN CON DOCS.SMARTERBOT.CL

### Estructura de Documentación

```
docs.smarterbot.cl/
├── architecture/
│   ├── overview.md
│   ├── mcp-agents.md
│   ├── local-ia-stack.md
│   └── cli.md
├── diagrams/
│   ├── architecture.png
│   ├── mcp-agents.png
│   ├── local-ia-stack.png
│   └── cli.png
├── specs/
│   └── *.md (from GitHub)
└── api/
    └── openapi.yaml
```

### Auto-Update desde GitHub

```yaml
# .github/workflows/update-docs.yml
name: Update Docs from Diagrams

on:
  push:
    branches: [main]
    paths: ['diagrams/**']

jobs:
  update-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Export diagrams
        run: smarter diagrams export --format png
      - name: Deploy to Cloudflare Pages
        run: wrangler pages deploy docs/ --project-name=smarteros-specs
```

---

## 🎩🕹️🏎️💨🚀

```
═══════════════════════════════════════════════
  draw.smarterbot.cl - ARCHITECTURE
═══════════════════════════════════════════════

✅ Room: eba1a9217ceff501392d,WJyjqqRnE0Kh6WRtbmBEiA
✅ 5 Diagramas principales
✅ Integración GitHub activa
✅ docs.smarterbot.cl sync
✅ Export: PNG, SVG, PDF
✅ CLI commands: smarter diagrams

DIAGRAMAS:
1. SmarterOS v4 Architecture
2. MCP Agents Flow
3. Local IA Stack
4. CLI Architecture
5. Deployment Flow

La Red trabaja.
Los diagramas documentan.
El Arquitecto diseña.
═══════════════════════════════════════════════
```

---

## 📞 UBICACIÓN DE ARCHIVOS

**Draw.io**:
- URL: https://draw.smarterbot.cl
- Room: `eba1a9217ceff501392d,WJyjqqRnE0Kh6WRtbmBEiA`

**GitHub**:
- Repo: `github.com/SmarterCL/smarteros-specs`
- Commits: 124+
- Diagrams: `diagrams/` folder

**Specs (MANDATORY)**:
- `specs/LOCAL-IA-STACK.md` ✅
- `specs/SMARTER-CLI-SPEC.md` ✅
- `specs/REPORTE-FINAL-3CYCLE.md` ✅
- `specs/ARCHITECTURE-DIAGRAMS.md` ✅ (este)

**Docs**:
- `docs.smarterbot.cl/architecture/`
- Auto-sync desde GitHub

---

**ESTADO**: ✅ **ACTIVO - MANDATORY**  
**URL**: https://draw.smarterbot.cl  
**SPECS**: 14 archivos + 1 nuevo (este)
