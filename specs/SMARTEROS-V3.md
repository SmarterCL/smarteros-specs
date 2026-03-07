# SmarterOS v3.0 - Especificación Abierta

**Versión**: 3.0  
**Fecha**: 2026-03-07  
**Estado**: ✅ Operativa  
**Licencia**: MIT  

---

## 🎯 OBJETIVO

SmarterOS es un sistema operativo autónomo para gestión de negocios digitales, combinando:
- MCP Agents para automatización
- PicoClaw para telemetría hardware
- Telegram para control remoto
- IA (MiniMax, OpenRouter) para inteligencia

---

## 🏗️ ARQUITECTURA

### Infraestructura

| Componente | Ubicación | Función |
|------------|-----------|---------|
| **Mac Air 2017** | Local | MCP Agents, PicoClaw, Telegram Bot |
| **VPS Linux** | Remoto | Dokploy, Grafana, Supabase |
| **GitHub** | Cloud | Código, specs, CI/CD |

### Agentes MCP (7/10)

| Puerto | Agente | Función |
|--------|--------|---------|
| 3050 | Session Manager | Gestión de sesiones |
| 3052 | Cloudflare | DNS, Workers, Tunnel |
| 3053 | GitHub | Repos, Commits, Issues |
| 3054 | MercadoPago | Pagos LATAM |
| 3057 | Flow.cl | Pagos Chile, DTE |
| 3058 | Odoo | ERP, Ventas, Stock |
| 3059 | PicoClaw | Hardware, Telemetría |

---

## 📍 UBICACIÓN DE COMPONENTES

### Mac Air 2017 (Local)

```
/Users/mac/Downloads/
├── mcp-agents/           # 7 MCP Agents
│   ├── picoclaw-agent.js
│   ├── flowciclo-bot.js
│   ├── minimax-agent-v2.js
│   └── logs/
├── smarteros-specs/      # OpenSpecs (este repo)
└── .copaw/               # CoPaw v0.0.4
```

### VPS Linux (Remoto)

```
/opt/
├── dokploy/              # Dokploy deployment
├── grafana/              # Grafana dashboards
├── supabase/             # Supabase (self-hosted)
└── n8n/                  # n8n workflows
```

---

## 🔌 MCP AGENTS - ESPECIFICACIÓN

### Session Manager (3050)

```javascript
// Función principal
- Crear sesiones
- Gestionar límites
- Loggear acciones
```

### PicoClaw (3059)

```javascript
// Hardware
- 3 placas (Voltaje, RPM, Temperatura)
- Lectura cada 5 segundos
- Alertas automáticas
- Puerto: /dev/cu.MOTOSP106
```

### Flow.cl (3057)

```javascript
// Pagos
- Webpay simulado (test mode)
- Generación de órdenes
- Callbacks de pago
```

### Odoo (3058)

```javascript
// ERP
- Crear ventas
- Generar facturas
- Actualizar stock
```

---

## 📱 TELEGRAM BOT

### Comandos (26)

| Comando | Función | Agente |
|---------|---------|--------|
| `/flowciclo` | Ciclo completo | Flow + Odoo |
| `/status` | Estado sistema | Session |
| `/picoclaw_telemetry` | Leer telemetría | PicoClaw |
| `/minimax-test` | Test briefing | MiniMax |

---

## 🤖 IA INTEGRATION

### MiniMax

- **Schedule**: 10:00 AM daily
- **Delivery**: Telegram
- **Categories**: Tech, Science
- **Group ID**: 1984011015955681627

### OpenRouter

- **Model**: Llama 3 70B
- **Tokens/día**: 100,000 máx
- **Latencia**: ~1500ms

---

## 🗄️ SUPABASE SCHEMA

### Tablas (6)

1. `mcp_sessions` - Sesiones de usuarios
2. `mcp_agent_logs` - Audit trail
3. `picoclaw_telemetry` - Telemetría hardware
4. `flow_transactions` - Transacciones Flow
5. `sii_dte_documents` - DTE del SII
6. `usage_limits` - Límites del sistema

---

## 🚀 DEPLOYMENT

### Mac Air 2017

```bash
# Iniciar agentes
cd /Users/mac/Downloads/mcp-agents
./start-all-agents.sh
```

### VPS Linux

```bash
# SSH
ssh root@<vps-ip>

# Deploy
cd /opt/smarteros-deploy
docker compose up -d
```

### GitHub

```bash
# Push
git add .
git commit -m "SmarterOS v3.0"
git push origin main
```

---

## 🎯 OPEN SPEC v3.0 - LÍMITES

| Límite | Valor | Estado |
|--------|-------|--------|
| Agentes MCP | 10 máx | 7/10 (70%) |
| Tokens/día | 100K | ~45K (45%) |
| Requests/min | 30 máx | ~12 (40%) |
| Sesiones | 1000 máx | ~234 (23%) |
| Storage | 100GB máx | ~12.5GB (12%) |
| Placas PicoClaw | 10 máx | 3/10 (30%) |

---

## 📞 SOPORTE

- **GitHub**: `github.com/SmarterCL/smarteros-specs`
- **Telegram**: @nodocabernetbot
- **Email**: smarterbotcl@gmail.com

---

**ESTADO**: ✅ **100% OPERATIVO**  
**VERSIÓN**: 3.0  
**LICENCIA**: MIT
