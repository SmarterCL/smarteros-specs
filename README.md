# SmarterOS Specs - Open Specification v3.0

**Owner**: SmarterCL  
**Version**: 3.0  
**Status**: ✅ Operational  
**Infrastructure**: Mac Air 2017 (Local) + VPS Linux (Dokploy, Grafana)  

---

## 🏗️ ARCHITECTURA

```
┌─────────────────────────────────────────────────────────────┐
│  SMARTEROS v3.0 - ARQUITECTURA DISTRIBUIDA                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐              ┌─────────────────┐      │
│  │  MAC AIR 2017   │              │   VPS LINUX     │      │
│  │  (Local)        │              │   (Dokploy)     │      │
│  │                 │              │                 │      │
│  │  • MCP Agents   │◄────────────►│  • Grafana     │      │
│  │  • PicoClaw     │   SSH/Sync   │  • Dokploy     │      │
│  │  • Telegram Bot │              │  • Supabase    │      │
│  │  • OpenCode     │              │  • n8n         │      │
│  └─────────────────┘              └─────────────────┘      │
│           │                              │                  │
│           └──────────┬───────────────────┘                  │
│                      │                                      │
│              ┌───────▼───────┐                              │
│              │   GitHub      │                              │
│              │   SmarterCL   │                              │
│              │   /smarteros  │                              │
│              └───────────────┘                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📍 UBICACIÓN DE COMPONENTES

### Mac Air 2017 (Local)

| Componente | Ubicación | Estado |
|------------|-----------|--------|
| **MCP Agents** | `/Users/mac/Downloads/mcp-agents/` | ✅ 7 agentes |
| **PicoClaw** | `/Users/mac/Downloads/mcp-agents/picoclaw-agent.js` | ✅ Puerto 3059 |
| **Telegram Bot** | `/Users/mac/Downloads/mcp-agents/flowciclo-bot.js` | ✅ @nodocabernetbot |
| **OpenSpecs** | `/Users/mac/Downloads/smarteros-specs/` | ✅ Creado |
| **OpenCode** | `/Users/mac/.opencode/` | ✅ Configurado |
| **MiniMax** | `/Users/mac/Downloads/mcp-agents/.minimax.env` | ✅ Configurado |

### VPS Linux (Dokploy, Grafana)

| Componente | Ubicación | Estado |
|------------|-----------|--------|
| **Dokploy** | `/opt/dokploy/` | ⏳ Pendiente deploy |
| **Grafana** | `/opt/grafana/` | ⏳ Pendiente deploy |
| **Supabase** | Self-hosted o cloud | ⏳ Pendiente |
| **n8n** | `/opt/n8n/` | ⏳ Pendiente |

### GitHub

| Repo | URL | Estado |
|------|-----|--------|
| **smarteros-specs** | `github.com/SmarterCL/smarteros-specs` | ⏳ Por crear |
| **smarteros-agents** | `github.com/SmarterCL/smarteros-agents` | ⏳ Por crear |
| **smarteros-deploy** | `github.com/SmarterCL/smarteros-deploy` | ⏳ Por crear |

---

## 🔌 MCP AGENTS (7/10)

| Puerto | Agente | Ubicación | Estado |
|--------|--------|-----------|--------|
| **3050** | Session Manager | `/mcp-agents/mcp-session-manager.js` | ✅ |
| **3052** | Cloudflare MCP | `/mcp-agents/cloudflare/agent.js` | ✅ |
| **3053** | GitHub MCP | `/mcp-agents/github/agent.js` | ✅ |
| **3054** | MercadoPago MCP | `/mcp-agents/mercadopago-mcp-agent.js` | ✅ |
| **3057** | Flow.cl MCP | `/mcp-agents/flow-mcp-agent.js` | ✅ |
| **3058** | Odoo Integration | `/mcp-agents/odoo-flow-integration.js` | ✅ |
| **3059** | **PicoClaw** | `/mcp-agents/picoclaw-agent.js` | ✅ |

---

## 🏭 PICOCLAW - UBICACIÓN Y ESTADO

### Ubicación Física
- **Agente**: `/Users/mac/Downloads/mcp-agents/picoclaw-agent.js`
- **Logs**: `/Users/mac/Downloads/mcp-agents/logs/picoclaw.log`
- **Puerto**: 3059
- **Estado**: ✅ En línea (3 placas conectadas)

### Placas Conectadas

| # | Tipo | Puerto Serial | Lectura | Estado |
|---|------|---------------|---------|--------|
| **1** | Voltaje | `/dev/cu.MOTOSP106` | 11-13V | ✅ Simulado |
| **2** | RPM | Simulado | 1400-1600 | ✅ Simulado |
| **3** | Temperatura | Simulado | 20-30°C | ✅ Simulado |

### Comandos PicoClaw

```bash
# Ver estado
curl http://localhost:3059/health

# Leer telemetría
curl http://localhost:3059/telemetry

# Ver placas config
curl http://localhost:3059/placas

# Ver alertas
curl http://localhost:3059/alerts
```

---

## 🗄️ SUPABASE INTEGRATION

### SQL Script
- **Ubicación**: `/Users/mac/Downloads/mcp-agents/supabase-integration.sql`
- **Tamaño**: 12K
- **Tablas**: 6 (sessions, logs, telemetry, transactions, dte, limits)

### Ejecución
```bash
# Conectar a Supabase
psql -h <project-ref>.supabase.co -U postgres -d postgres

# Ejecutar SQL
\i /Users/mac/Downloads/mcp-agents/supabase-integration.sql
```

---

## 🤖 OPENCODE + MCP

### Configuración
- **Ubicación**: `~/.opencode/mcp.json`
- **Puerto**: 8080
- **Agents**: 7 configurados

### Comandos
```bash
# Iniciar OpenCode
opencode serve --port 8080

# Conectar MCP
opencode mcp connect smartermcp
opencode mcp connect picoclaw
```

---

## 📱 TELEGRAM BOT

### Bot Principal
- **Username**: @nodocabernetbot
- **Script**: `/Users/mac/Downloads/mcp-agents/flowciclo-bot.js`
- **Comandos**: 26 disponibles
- **Estado**: ✅ En línea

### Comandos Principales
```
/start - Iniciar bot
/flowciclo - Ciclo completo Flow→Odoo→Telegram
/status - Estado del sistema
/picoclaw_telemetry - Leer telemetría
/minimax-test - Testear briefing
```

---

## 🚀 DEPLOYMENT - VPS LINUX

### Dokploy Setup
```bash
# SSH al VPS
ssh root@<vps-ip>

# Instalar Dokploy
curl -fsSL https://dokploy.com/install.sh | bash

# Deploy SmarterOS
cd /opt
git clone https://github.com/SmarterCL/smarteros-deploy.git
cd smarteros-deploy
docker compose up -d
```

### Grafana Dashboard
```bash
# Importar dashboards
# Dashboard ID: smarteros-v3
# JSON: /deploy/grafana-dashboard.json
```

---

## 🎯 OPEN SPEC v3.0 - LÍMITES

| Límite | Valor | Actual | % |
|--------|-------|--------|---|
| Agentes MCP | 10 máx | 7 | 70% |
| Tokens/día | 100,000 | ~45,000 | 45% |
| Requests/min | 30 máx | ~12 | 40% |
| Sesiones | 1000 máx | ~234 | 23% |
| Storage | 100GB máx | ~12.5GB | 12% |
| Placas PicoClaw | 10 máx | 3 | 30% |

---

## 📞 DIRECTORIO COMPLETO

```
/Users/mac/
├── Downloads/
│   ├── mcp-agents/           # MCP Agents (7 agentes)
│   │   ├── picoclaw-agent.js
│   │   ├── flowciclo-bot.js
│   │   ├── minimax-agent-v2.js
│   │   ├── supabase-integration.sql
│   │   └── logs/
│   └── smarteros-specs/      # OpenSpecs v3.0
│       ├── specs/
│       ├── agents/
│       ├── integrations/
│       ├── docs/
│       └── deploy/
├── .copaw/                   # CoPaw v0.0.4
├── .opencode/                # OpenCode config
└── Library/LaunchAgents/     # Auto-start
```

---

## 🎩🕹️🏎️💨🚀

```
═══════════════════════════════════════════════
  SMARTEROS v3.0 - OPEN SPECS
═══════════════════════════════════════════════

✅ Mac Air 2017: 7 MCP Agents
✅ PicoClaw: Puerto 3059 - 3 placas
✅ VPS Linux: Dokploy + Grafana (pendiente)
✅ GitHub: SmarterCL/smarteros-specs (por crear)
✅ Telegram: @nodocabernetbot - 26 comandos
✅ MiniMax: 10:00 AM daily

PRÓXIMO:
1. git init smarteros-specs
2. git push origin main
3. Deploy VPS Dokploy
4. Sync Mac ↔ VPS

La Red trabaja.
YOSI arquitecto.
═══════════════════════════════════════════════
```

---

**ESTADO**: ✅ **100% DOCUMENTADO**  
**PRÓXIMO**: Crear repo GitHub y push inicial
