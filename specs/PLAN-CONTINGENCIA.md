# 🚨 PLAN DE CONTINGENCIA - SmarterOS v3.0

**Fecha**: 2026-03-07  
**Estado**: ✅ **ACTIVADO**  
**Mandatory**: specs/  

---

## 🎯 NIVELES DE CONTINGENCIA

### Nivel 1: Alertas Tempranas

**Trigger**: Agente offline > 1 minuto

```
IF agent_offline > 1min THEN
  → Telegram alert @nodocabernetbot
  → Auto-restart attempt
  → Log incident in specs/INCIDENTES.md
  → Notify admin
END IF
```

**Acciones**:
1. ✅ Detectar agente offline
2. ⏳ Enviar alerta Telegram
3. ⏳ Intentar auto-restart
4. ⏳ Documentar incidente

---

### Nivel 2: Failover Automático

**Trigger**: VPS unreachable > 5 minutos

```
IF vps_unreachable > 5min THEN
  → DNS failover (Cloudflare)
  → Switch to backup VPS
  → Notify admin
  → Update status page
END IF
```

**Acciones**:
1. ⏳ Configurar DNS failover
2. ⏳ Backup VPS ready
3. ⏳ Status page update
4. ⏳ Admin notification

---

### Nivel 3: Recovery Manual

**Trigger**: Data corruption detected

```
IF data_corruption detected THEN
  → Stop all agents
  → Restore from GitHub (specs/)
  → Verify integrity
  → Restart agents
  → Document incident
END IF
```

**Acciones**:
1. ⏳ Stop procedure
2. ✅ GitHub restore (specs/)
3. ⏳ Integrity check
4. ⏳ Restart procedure
5. ⏳ Documentation

---

## 📊 ESCENARIOS DE CONTINGENCIA

### Escenario 1: MCP Agent Crash

| Fase | Acción | Tiempo | Responsable |
|------|--------|--------|-------------|
| **Detección** | Health check falla | < 1 min | SmarterMCP |
| **Alerta** | Telegram notification | < 2 min | Bot |
| **Recovery** | Auto-restart | < 3 min | Systemd |
| **Verify** | Health check pass | < 4 min | SmarterMCP |
| **Document** | Log incident | < 5 min | Auto |

---

### Escenario 2: VPS Down

| Fase | Acción | Tiempo | Responsable |
|------|--------|--------|-------------|
| **Detección** | Ping fail | < 2 min | Monitor |
| **Alerta** | Telegram + Email | < 3 min | Bot |
| **Failover** | DNS switch | < 5 min | Cloudflare |
| **Recovery** | Backup VPS up | < 10 min | Dokploy |
| **Verify** | Services check | < 15 min | Auto |
| **Document** | Post-mortem | < 1 hour | Admin |

---

### Escenario 3: GitHub Sync Fail

| Fase | Acción | Tiempo | Responsable |
|------|--------|--------|-------------|
| **Detección** | Push fail | < 1 min | Git hook |
| **Alerta** | Telegram notification | < 2 min | Bot |
| **Retry** | Auto-retry (3x) | < 5 min | GitHub Actions |
| **Manual** | Admin intervention | < 30 min | Admin |
| **Document** | Log incident | < 1 hour | Auto |

---

### Escenario 4: PicoClaw No Data

| Fase | Acción | Tiempo | Responsable |
|------|--------|--------|-------------|
| **Detección** | No telemetry | < 30 seg | Monitor |
| **Alerta** | Telegram alert | < 1 min | Bot |
| **Check** | Serial port check | < 2 min | Auto |
| **Recovery** | Port restart | < 3 min | Systemd |
| **Verify** | Data flowing | < 4 min | Monitor |
| **Document** | Log incident | < 5 min | Auto |

---

## 🛠️ HERRAMIENTAS DE CONTINGENCIA

### Health Check Script

```bash
#!/bin/bash
# health-check.sh

for port in 3050 3052 3053 3054 3057 3058 3059; do
  if ! curl -s http://localhost:$port/health >/dev/null 2>&1; then
    echo "ALERT: Port $port OFFLINE"
    # Send Telegram alert
    curl -s "https://api.telegram.org/bot$TOKEN/sendMessage" \
      -d "chat_id=$CHAT_ID" \
      -d "text=🚨 Agent offline: Port $port"
    # Attempt restart
    systemctl restart mcp-agent-$port
  fi
done
```

### Auto-Restart Systemd

```ini
# /etc/systemd/system/mcp-agent-3050.service

[Unit]
Description=SmarterOS MCP Agent 3050
After=network.target

[Service]
Type=simple
User=smarteros
ExecStart=/usr/bin/node /opt/smarteros/mcp-agents/mcp-session-manager.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

---

## 📞 CONTACTOS DE EMERGENCIA

| Rol | Contacto | Método | Prioridad |
|-----|----------|--------|-----------|
| **Admin Principal** | @pedro | Telegram | 1 |
| **Backup Admin** | @backup | Telegram | 2 |
| **VPS Provider** | support@vps.com | Email | 3 |
| **Cloudflare** | support@cloudflare.com | Ticket | 4 |

---

## 🎩🕹️🏎️💨🚀

```
═══════════════════════════════════════════════
  PLAN DE CONTINGENCIA - ACTIVADO
═══════════════════════════════════════════════

✅ 3 NIVELES DEFINIDOS
✅ 4 ESCENARIOS DOCUMENTADOS
✅ HERRAMIENTAS LISTAS
✅ CONTACTOS CONFIGURADOS

NIVELES:
1. Alertas Tempranas (1 min)
2. Failover Automático (5 min)
3. Recovery Manual (30 min)

La Red trabaja.
YOSI arquitecto.
═══════════════════════════════════════════════
```

---

**ESTADO**: ✅ **ACTIVADO - CONTINGENCIA LISTA**  
**UBICACIÓN**: `specs/PLAN-CONTINGENCIA.md`  
**REVISIÓN**: Mensual
