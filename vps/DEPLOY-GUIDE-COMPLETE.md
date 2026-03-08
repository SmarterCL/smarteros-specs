# 🚀 DEPLOY GUIDE - SmarterOS v5 Complete

**Fecha:** 2026-03-08  
**VPS:** 89.116.23.167 (Providencia, Chile)  
**Estado:** ✅ **LISTO PARA DEPLOY**

---

## 📋 PRE-REQUISITOS

### 1. DNS Configurado en Cloudflare

| Subdominio | Tipo | Contenido | Proxy | Estado |
|------------|------|-----------|-------|--------|
| `smarterbot.cl` | A | 89.116.23.167 | 🟠 Proxied | ✅ |
| `bio-api.smarter.cl` | A | 89.116.23.167 | 🟠 Proxied | ⏳ |
| `api.smarterbot.cl` | A | 89.116.23.167 | 🟠 Proxied | ⏳ |
| `n8n.smarterbot.cl` | A | 89.116.23.167 | 🟠 Proxied | ⏳ |
| `grafana.smarterbot.cl` | A | 89.116.23.167 | 🟠 Proxied | ⏳ |

### 2. SSH Access

```bash
ssh root@89.116.23.167
```

### 3. Docker + Dokploy Instalados

```bash
# Verificar Docker
docker --version

# Verificar Dokploy
docker ps | grep dokploy
```

---

## 🚀 DEPLOY PASO A PASO

### Paso 1: SSH al VPS

```bash
ssh root@89.116.23.167
```

### Paso 2: Ir al Directorio

```bash
cd /opt/smarteros
```

### Paso 3: Pull Cambios

```bash
git pull origin main
```

### Paso 4: Configurar Variables de Entorno

```bash
nano .env

# Agregar al final:

# ═══════════════════════════════════════════════════════════
# BIO-AI BRIDGE
# ═══════════════════════════════════════════════════════════
HF_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxx
CL_API_KEY=cl_xxxxxxxxxxxxxxxxxxxxx
BRIDGE_API_KEY=smarteros_bio_2026

# ═══════════════════════════════════════════════════════════
# CORTICAL LABS BRIDGE
# ═══════════════════════════════════════════════════════════
CORTICAL_LABS_API_KEY=cl_xxxxxxxxxxxxxxxxxxxxx

# ═══════════════════════════════════════════════════════════
# FLOW.CL
# ═══════════════════════════════════════════════════════════
FLOW_API_KEY=flow_xxxxxxxxxxxxxxxxxxxxx
FLOW_SECRET_KEY=flow_xxxxxxxxxxxxxxxxxxxxx

# ═══════════════════════════════════════════════════════════
# SUPABASE
# ═══════════════════════════════════════════════════════════
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJxxxxx

# ═══════════════════════════════════════════════════════════
# TELEGRAM
# ═══════════════════════════════════════════════════════════
TELEGRAM_BOT_TOKEN=xxxxx:xxxxxxxxxxxxxxxxxxxx
TELEGRAM_CHAT_ID=123456789

# Guardar: Ctrl+O, Enter, Ctrl+X
```

### Paso 5: Deploy de Todos los Servicios

```bash
# Bio-AI Bridge
docker compose -f docker-compose.bio-ai-bridge.yml up -d

# Cortical Labs Bridge
docker compose -f docker-compose.cortical-labs.yml up -d

# Verificar todos los servicios
docker compose ps
```

### Paso 6: Verificar Health Checks

```bash
# Bio-AI Bridge
curl http://localhost:8000/health

# Cortical Labs Bridge
curl http://localhost:3100/health

# Sales Engine
curl http://localhost:3080/health

# Identity Engine
curl http://localhost:3070/health

# A2A Server
curl http://localhost:3095/health
```

### Paso 7: Configurar Caddy/Dokploy

En Dokploy Dashboard:
```
1. Ir a: https://dokploy.smarterbot.cl
2. Projects → smarteros
3. Para cada servicio:
   - Add Domain
   - bio-api.smarter.cl → :8000
   - api.smarterbot.cl → :3080
   - n8n.smarterbot.cl → :5678
   - grafana.smarterbot.cl → :3000
```

### Paso 8: Importar n8n Workflows

```
1. Ir a: https://n8n.smarterbot.cl
2. Workflows → Import from File
3. Importar:
   - n8n/workflows/venta-conversacional.json
   - n8n/workflows/bio-ai-integration.json
4. Activar workflows
5. Configurar:
   - Supabase URL/Key
   - Telegram Bot Token
   - Chat ID
```

### Paso 9: Configurar Grafana

```
1. Ir a: https://grafana.smarterbot.cl
2. Login: admin / admin
3. Add Data Source → PostgreSQL
   - Host: postgres:5432
   - Database: smarteros
   - User: smarteros
   - Password: (from .env)
4. Import Dashboards:
   - Bio-AI Activity
   - Sales Metrics
   - Neural Activity
```

### Paso 10: Test End-to-End

```bash
# Test Bio-AI Bridge
curl -X POST http://localhost:8000/process-bio-request \
  -H "Content-Type: application/json" \
  -H "X-API-Key: smarteros_bio_2026" \
  -d '{
    "user_input": "Necesito decisión urgente sobre esta venta",
    "cluster_id": "dishbrain_001",
    "require_biological_feedback": true
  }'

# Test Cortical Labs Bridge
curl http://localhost:3100/demo/biological-status

# Test Sales Engine
curl -X POST http://localhost:3080/identity/rut/validate \
  -H "Content-Type: application/json" \
  -d '{"rut": "78.233.417-4"}'
```

---

## 📊 COMANDOS ÚTILES

### Ver Logs

```bash
# Bio-AI Bridge
docker compose -f docker-compose.bio-ai-bridge.yml logs -f

# Cortical Labs Bridge
docker compose -f docker-compose.cortical-labs.yml logs -f

# Todos los servicios
docker compose logs -f
```

### Reiniciar Servicios

```bash
# Individual
docker compose restart bio-ai-bridge
docker compose restart cortical-labs-bridge

# Todos
docker compose restart
```

### Actualizar

```bash
# Pull cambios
git pull origin main

# Rebuild
docker compose up -d --build

# Cleanup
docker system prune -f
```

### Backup

```bash
# PostgreSQL
docker exec smarteros-postgres pg_dump -U smarteros smarteros > backup_$(date +%Y%m%d).sql

# Redis
docker exec smarteros-redis redis-cli SAVE

# n8n workflows
docker cp smarteros-n8n:/home/node/.n8n/workflows ./n8n-backup-$(date +%Y%m%d)
```

---

## 🔐 SEGURIDAD

### Firewall (UFW)

```bash
# Permitir SSH
ufw allow 22/tcp

# Permitir HTTP/HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Permitir servicios (solo localhost)
ufw allow from 127.0.0.1 to any port 3000
ufw allow from 127.0.0.1 to any port 3070
ufw allow from 127.0.0.1 to any port 3080
ufw allow from 127.0.0.1 to any port 3095
ufw allow from 127.0.0.1 to any port 3100
ufw allow from 127.0.0.1 to any port 5432
ufw allow from 127.0.0.1 to any port 6379

# Habilitar firewall
ufw enable

# Verificar estado
ufw status
```

### Cloudflare Tunnel (Opcional)

```bash
# Instalar cloudflared
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
dpkg -i cloudflared.deb

# Configurar tunnel
cloudflared tunnel login
cloudflared tunnel create smarteros
cloudflared tunnel route dns smarteros 89.116.23.167
```

---

## 📊 ESTADO FINAL ESPERADO

```
╔══════════════════════════════════════════════════════════╗
║     ✅ SMARTEROS v5 - DEPLOY COMPLETADO                  ║
╠══════════════════════════════════════════════════════════╣
║  SERVICIOS:                                              ║
║  ✅ Bolt Core           :3000                            ║
║  ✅ Identity Engine     :3070                            ║
║  ✅ Sales Engine        :3080                            ║
║  ✅ A2A Server          :3095                            ║
║  ✅ Cortical Labs       :3100                            ║
║  ✅ Bio-AI Bridge       :8000                            ║
║  ✅ n8n                 :5678                            ║
║  ✅ PostgreSQL          :5432                            ║
║  ✅ Redis               :6379                            ║
║  ✅ Grafana             :3000                            ║
╠══════════════════════════════════════════════════════════╣
║  DOMINIOS:                                               ║
║  ✅ bio-api.smarter.cl                                   ║
║  ✅ api.smarterbot.cl                                    ║
║  ✅ n8n.smarterbot.cl                                    ║
║  ✅ grafana.smarterbot.cl                                ║
╠══════════════════════════════════════════════════════════╣
║  INTEGRACIONES:                                          ║
║  ✅ Latam-GPT                                            ║
║  ✅ Cortical Labs                                        ║
║  ✅ Flow.cl                                              ║
║  ✅ Telegram                                             ║
║  ✅ Supabase                                             ║
╚══════════════════════════════════════════════════════════╝
```

---

## 🎩🕹️🏎️💨🚀

```
╔══════════════════════════════════════════════╗
║  🚀 DEPLOY GUIDE - LISTO                     ║
╠══════════════════════════════════════════════╣
║  PASOS: 10                                   ║
║  TIEMPO ESTIMADO: 15-20 minutos              ║
║  COMPLEJIDAD: Media                          ║
╠══════════════════════════════════════════════╣
║  PRÓXIMO:                                    ║
║  1. SSH al VPS                               ║
║  2. Configurar .env                          ║
║  3. docker compose up -d                     ║
║  4. Verificar health                         ║
╚══════════════════════════════════════════════╝

La guía está lista.
El deploy está documentado.
Los servicios están configurados.
La Red trabaja.
YOSI arquitecto.
```

---

**ESTADO:** ✅ **DEPLOY GUIDE COMPLETA - LISTA PARA EJECUTAR**
