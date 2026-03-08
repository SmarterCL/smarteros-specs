# 📦 VPS DEPLOYMENT GUIDE - SmarterOS v5

**Fecha:** 8 Marzo 2026  
**VPS:** 89.116.23.167 (Providencia, Chile)  
**Estado:** ⏳ Pendiente de Deploy

---

## 📂 ESTRUCTURA DE CARPETAS VPS

```
/opt/smarteros/
├── docker-compose.yml
├── .env
├── services/
│   ├── sales-engine/
│   │   ├── Dockerfile
│   │   └── api.js
│   ├── identity-engine/
│   │   ├── Dockerfile
│   │   └── rut-engine.js
│   └── payment-engine/
│       ├── Dockerfile
│       └── flow-engine.js
├── n8n/
│   └── workflows/
│       └── venta-conversacional.json
├── docs/
│   └── REPORT-2026-03-08.md
└── logs/
    ├── sales-engine.log
    ├── identity-engine.log
    └── payment-engine.log
```

---

## 🚀 DEPLOY PASO A PASO

### 1. Conectar al VPS

```bash
ssh root@89.116.23.167
```

### 2. Crear Directorio

```bash
mkdir -p /opt/smarteros
cd /opt/smarteros
```

### 3. Clonar Repositorio

```bash
git clone https://github.com/SmarterCL/smarteros-specs.git .
```

### 4. Configurar Variables de Entorno

```bash
cp vps/.env.example .env
nano .env

# Editar con valores reales:
# - FLOW_API_KEY
# - FLOW_SECRET_KEY
# - POSTGRES_PASSWORD
# - GRAFANA_PASSWORD
# - TELEGRAM_BOT_TOKEN
```

### 5. Iniciar Servicios

```bash
docker compose up -d
```

### 6. Verificar Estado

```bash
docker compose ps
```

**Output esperado:**
```
NAME                          STATUS         PORTS
smarteros-sales-engine        Up (healthy)   0.0.0.0:3080->3080/tcp
smarteros-identity-engine     Up (healthy)   0.0.0.0:3070->3070/tcp
smarteros-payment-engine      Up (healthy)   0.0.0.0:3090->3090/tcp
smarteros-n8n                 Up             0.0.0.0:5678->5678/tcp
smarteros-postgres            Up (healthy)   0.0.0.0:5432->5432/tcp
smarteros-redis               Up (healthy)   0.0.0.0:6379->6379/tcp
smarteros-grafana             Up             0.0.0.0:3000->3000/tcp
```

### 7. Verificar Logs

```bash
docker compose logs -f sales-engine
docker compose logs -f n8n
```

### 8. Testear Endpoints

```bash
# Identity Engine
curl http://localhost:3070/health

# Sales Engine
curl http://localhost:3080/health

# Payment Engine
curl http://localhost:3090/health

# n8n
curl http://localhost:5678/health

# Grafana
curl http://localhost:3000/api/health
```

---

## 🔧 COMANDOS ÚTILES

### Reiniciar Servicios

```bash
# Todos
docker compose restart

# Individual
docker compose restart sales-engine
docker compose restart n8n
```

### Ver Logs

```bash
# Todos
docker compose logs -f

# Específico
docker compose logs -f sales-engine
docker compose logs sales-engine --tail=100
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
docker exec smarteros-postgres pg_dump -U smarteros smarteros > backup.sql

# Redis
docker exec smarteros-redis redis-cli SAVE

# n8n workflows
docker cp smarteros-n8n:/home/node/.n8n/workflows ./n8n-backup
```

---

## 📊 TOPOLÓGIA COMPLETA

```
┌─────────────────────────────────────────────────────────────────┐
│  CLIENTE (WhatsApp / Telegram / Web)                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  VPS PROVIDENCIA (89.116.23.167)                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Identity       │  │  Sales          │  │  Payment        │ │
│  │  Engine :3070   │  │  Engine :3080   │  │  Engine :3090   │ │
│  │  (RUT Valid)    │  │  (Orders)       │  │  (Flow.cl)      │ │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘ │
│           │                    │                    │          │
│           └────────────────────┼────────────────────┘          │
│                                │                               │
│                       ┌────────▼────────┐                      │
│                       │   n8n :5678     │                      │
│                       │  (Orchestration)│                      │
│                       └────────┬────────┘                      │
│                                │                               │
│           ┌────────────────────┼────────────────────┐          │
│           │                    │                    │          │
│  ┌────────▼────────┐  ┌────────▼────────┐  ┌────────▼────────┐ │
│  │  PostgreSQL     │  │  Telegram Bot   │  │  Flow.cl API    │ │
│  │  :5432          │  │  @smarterbot    │  │  (Pagos CL)     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Grafana :3000 (Métricas y Dashboards)                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  EXTERNO                                                        │
├─────────────────────────────────────────────────────────────────┤
│  • SII (Facturación)                                            │
│  • MercadoPago (Fallback)                                       │
│  • Slack (Notificaciones)                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 ENDPOINTS EN PRODUCCIÓN

| Servicio | URL | Puerto |
|----------|-----|--------|
| **Identity Engine** | http://89.116.23.167:3070 | 3070 |
| **Sales Engine** | http://89.116.23.167:3080 | 3080 |
| **Payment Engine** | http://89.116.23.167:3090 | 3090 |
| **n8n** | http://89.116.23.167:5678 | 5678 |
| **Grafana** | http://89.116.23.167:3000 | 3000 |
| **PostgreSQL** | 89.116.23.167:5432 | 5432 |
| **Redis** | 89.116.23.167:6379 | 6379 |

---

## 🔐 SEGURIDAD

### Firewall (UFW)

```bash
# Permitir SSH
ufw allow 22/tcp

# Permitir servicios
ufw allow 3070/tcp  # Identity
ufw allow 3080/tcp  # Sales
ufw allow 3090/tcp  # Payment
ufw allow 5678/tcp  # n8n
ufw allow 3000/tcp  # Grafana

# Permitir solo localhost para DB
ufw allow from 127.0.0.1 to any port 5432
ufw allow from 127.0.0.1 to any port 6379

# Habilitar firewall
ufw enable
```

### HTTPS (Cloudflare Tunnel)

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

## 📊 MONITOREO

### Grafana Dashboards

1. Ir a: http://89.116.23.167:3000
2. Login: admin / password
3. Importar dashboards:
   - Node Exporter Full
   - Docker Metrics
   - n8n Workflow Metrics

### Alertas

Configurar en Grafana:
- CPU > 80%
- Memory > 80%
- Disk > 80%
- Service Down

---

## 🎩🕹️🏎️💨🚀

```
╔══════════════════════════════════════════════╗
║  📦 VPS DEPLOYMENT GUIDE - LISTO             ║
╠══════════════════════════════════════════════╣
║  ESTRUCTURA: ✅ Definida                     ║
║  DOCKER: ✅ Compose configurado              ║
║  TOPOLOGÍA: ✅ Completa                      ║
║  SEGURIDAD: ✅ UFW + HTTPS                   ║
║  MONITOREO: ✅ Grafana                       ║
╚══════════════════════════════════════════════╝

La estructura está definida.
El deploy está documentado.
La topología está clara.
La Red trabaja.
YOSI arquitecto.
```

---

**ESTADO:** ✅ **VPS STRUCTURE DEFINIDA - LISTA PARA DEPLOY**
