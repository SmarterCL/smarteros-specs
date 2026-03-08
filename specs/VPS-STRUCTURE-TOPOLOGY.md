# 🏗️ SmarterOS v5 - VPS Structure & Topology

**Fecha**: 2026-03-08  
**Estado**: ✅ **ESTRUCTURA DEFINIDA - MANDATORY**  
**Mandatory**: specs/ ✅  
**Versión**: 5.0  

---

## 📊 RESUMEN EJECUTIVO

```
╔══════════════════════════════════════════════════════════╗
║     VPS STRUCTURE & TOPOLOGY                             ║
╠══════════════════════════════════════════════════════════╣
║  ESTADO: ✅ ESTRUCTURA DEFINIDA                          ║
║  VPS: Providencia (Dokploy)                              ║
║  SERVICIOS: 10+                                          ║
║  TOPOLOGÍA: Microservices                                ║
╚══════════════════════════════════════════════════════════╝
```

---

## 1️⃣ ESTRUCTURA DE CARPETAS IDEAL

### Root del VPS

```
/opt/
├── smarteros/                    # SmarterOS v5 Platform
│   ├── docker-compose.yml        # Orquestador principal
│   ├── .env                      # Variables de entorno
│   ├── README.md                 # Documentación
│   │
│   ├── services/                 # Servicios (microservices)
│   │   ├── identity-engine/      # RUT validation (:8001)
│   │   ├── order-engine/         # Order management (:8002)
│   │   ├── payment-engine/       # Flow.cl integration (:8003)
│   │   ├── event-bus/            # Redis pub/sub (:6379)
│   │   ├── messaging/            # Notifications (:8005)
│   │   └── analytics/            # Metrics (:8006)
│   │
│   ├── apps/                     # Aplicaciones
│   │   ├── webcontrol/           # Admin panel (:3000)
│   │   ├── crm/                  # CRM (:3001)
│   │   ├── odoo/                 # ERP (:8069)
│   │   └── flow/                 # Flow.cl frontend (:3002)
│   │
│   ├── workflows/                # n8n workflows
│   │   ├── venta-conversacional.json
│   │   ├── payment-confirmation.json
│   │   └── sii-invoicing.json
│   │
│   ├── api/                      # API Gateway
│   │   ├── gateway.js            # API Gateway (:8000)
│   │   └── routes/               # Rutas
│   │
│   └── docs/                     # Documentación
│       ├── specs/                # Specs técnicas
│       └── api/                  # API docs
│
├── dokploy/                      # Dokploy (Docker Manager)
│   ├── docker-compose.yml
│   └── .env
│
├── picoclaw/                     # PicoClaw Hardware
│   ├── agents/
│   ├── skills/
│   └── telemetry/
│
└── backups/                      # Backups automáticos
    ├── postgres/
    ├── redis/
    └── files/
```

---

## 2️⃣ DOCKER / DOKPLOY LAYOUT

### Docker Compose Principal

```yaml
# /opt/smarteros/docker-compose.yml

version: '3.8'

services:
  # API Gateway
  gateway:
    image: smarteros/gateway:latest
    container_name: smarteros-gateway
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=production
    depends_on:
      - identity-engine
      - order-engine
      - payment-engine
    networks:
      - smarteros-network
    restart: unless-stopped

  # Identity Engine
  identity-engine:
    image: smarteros/identity-engine:latest
    container_name: smarteros-identity-engine
    ports:
      - "8001:8001"
    environment:
      - NODE_ENV=production
    networks:
      - smarteros-network
    restart: unless-stopped

  # Order Engine
  order-engine:
    image: smarteros/order-engine:latest
    container_name: smarteros-order-engine
    ports:
      - "8002:8002"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/smarteros
    depends_on:
      - postgres
    networks:
      - smarteros-network
    restart: unless-stopped

  # Payment Engine
  payment-engine:
    image: smarteros/payment-engine:latest
    container_name: smarteros-payment-engine
    ports:
      - "8003:8003"
    environment:
      - NODE_ENV=production
      - FLOW_API_KEY=${FLOW_API_KEY}
      - FLOW_SECRET=${FLOW_SECRET}
    networks:
      - smarteros-network
    restart: unless-stopped

  # Event Bus (Redis)
  redis:
    image: redis:7-alpine
    container_name: smarteros-redis
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - smarteros-network
    restart: unless-stopped

  # PostgreSQL
  postgres:
    image: postgres:15-alpine
    container_name: smarteros-postgres
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=smarteros
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - smarteros-network
    restart: unless-stopped

  # n8n Workflow Orchestrator
  n8n:
    image: n8nio/n8n:latest
    container_name: smarteros-n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=0.0.0.0
      - N8N_PORT=5678
      - WEBHOOK_URL=${WEBHOOK_URL}
    volumes:
      - n8n-data:/home/node/.n8n
      - ./workflows:/home/node/workflows
    depends_on:
      - redis
      - postgres
    networks:
      - smarteros-network
    restart: unless-stopped

  # WebControl (Admin Panel)
  webcontrol:
    image: smarteros/webcontrol:latest
    container_name: smarteros-webcontrol
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - API_URL=http://gateway:8000
    networks:
      - smarteros-network
    restart: unless-stopped

  # CRM
  crm:
    image: smarteros/crm:latest
    container_name: smarteros-crm
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - API_URL=http://gateway:8000
    networks:
      - smarteros-network
    restart: unless-stopped

  # Odoo ERP
  odoo:
    image: odoo:19
    container_name: smarteros-odoo
    ports:
      - "8069:8069"
    environment:
      - ODOO_DATABASE=smarteros
      - ODOO_ADMIN_PASSWORD=${ODOO_ADMIN_PASSWORD}
    volumes:
      - odoo-data:/var/lib/odoo
    networks:
      - smarteros-network
    restart: unless-stopped

  # Flow.cl Frontend
  flow:
    image: smarteros/flow:latest
    container_name: smarteros-flow
    ports:
      - "3002:3002"
    environment:
      - NODE_ENV=production
      - FLOW_API_KEY=${FLOW_API_KEY}
    networks:
      - smarteros-network
    restart: unless-stopped

volumes:
  redis-data:
  postgres-data:
  n8n-data:
  odoo-data:

networks:
  smarteros-network:
    driver: bridge
```

---

## 3️⃣ TOPOLOGÍA COMPLETA DEL SISTEMA

### Diagrama de Topología

```
┌─────────────────────────────────────────────────────────────┐
│  VPS PROVIDENCIA (Dokploy)                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  TRÁFICO ENTRANTE                                    │   │
│  │  (WhatsApp / Telegram / Web)                         │   │
│  └────────────────┬────────────────────────────────────┘   │
│                   │                                         │
│                   ▼                                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  API GATEWAY (:8000)                                 │   │
│  │  - Rate limiting                                     │   │
│  │  - Authentication                                    │   │
│  │  - Routing                                           │   │
│  └────────────────┬────────────────────────────────────┘   │
│                   │                                         │
│       ┌───────────┼───────────┐                            │
│       │           │           │                            │
│       ▼           ▼           ▼                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                       │
│  │Identity │ │ Order   │ │Payment  │                       │
│  │Engine   │ │ Engine  │ │ Engine  │                       │
│  │:8001    │ │ :8002   │ │ :8003   │                       │
│  └────┬────┘ └────┬────┘ └────┬────┘                       │
│       │           │           │                            │
│       └───────────┼───────────┘                            │
│                   │                                         │
│                   ▼                                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  EVENT BUS (Redis :6379)                             │   │
│  │  - Pub/Sub                                           │   │
│  │  - Caching                                           │   │
│  │  - Session storage                                   │   │
│  └────────────────┬────────────────────────────────────┘   │
│                   │                                         │
│       ┌───────────┼───────────┐                            │
│       │           │           │                            │
│       ▼           ▼           ▼                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                       │
│  │Postgres │ │  n8n    │ │ WebCtrl │                       │
│  │:5432    │ │ :5678   │ │ :3000   │                       │
│  └─────────┘ └────┬────┘ └─────────┘                       │
│                   │                                         │
│                   ▼                                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  WORKFLOWS N8N                                       │   │
│  │  - Venta Conversacional                              │   │
│  │  - Payment Confirmation                              │   │
│  │  - SII Invoicing                                     │   │
│  └────────────────┬────────────────────────────────────┘   │
│                   │                                         │
│       ┌───────────┼───────────┐                            │
│       │           │           │                            │
│       ▼           ▼           ▼                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                       │
│  │  Flow   │ │  CRM    │ │  Odoo   │                       │
│  │ :3002   │ │ :3001   │ │ :8069   │                       │
│  └─────────┘ └─────────┘ └─────────┘                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Datos

```
1. Cliente envía mensaje (WhatsApp/Telegram)
   ↓
2. API Gateway recibe y autentica
   ↓
3. n8n Workflow ejecuta:
   - Limpia RUT
   - Valida RUT (Identity Engine)
   - Crea orden (Order Engine)
   - Crea pago (Payment Engine)
   - Envía link de pago
   ↓
4. Cliente paga en Flow.cl
   ↓
5. Flow.cl webhook confirma pago
   ↓
6. n8n actualiza orden (paid)
   ↓
7. Event Bus emite evento (payment.completed)
   ↓
8. CRM notifica cliente
   ↓
9. Odoo genera factura
   ↓
10. SII recibe factura (futuro)
```

---

## 4️⃣ VARIABLES DE ENTORNO (.env)

### Archivo `/opt/smarteros/.env`

```bash
# Environment
NODE_ENV=production

# Database
POSTGRES_PASSWORD=your_secure_password
DATABASE_URL=postgresql://postgres:your_secure_password@postgres:5432/smarteros

# Redis
REDIS_URL=redis://redis:6379

# Flow.cl
FLOW_API_KEY=your_flow_api_key
FLOW_SECRET=your_flow_secret
WEBHOOK_URL=https://api.smarterbot.cl

# Odoo
ODOO_ADMIN_PASSWORD=your_odoo_password

# n8n
N8N_HOST=0.0.0.0
N8N_PORT=5678

# API Gateway
GATEWAY_PORT=8000
GATEWAY_SECRET=your_gateway_secret

# Telegram
TELEGRAM_BOT_TOKEN=your_telegram_bot_token

# WhatsApp
WHATSAPP_PHONE_ID=your_whatsapp_phone_id
WHATSAPP_TOKEN=your_whatsapp_token
```

---

## 5️⃣ COMANDOS DE GESTIÓN

### Deploy Inicial

```bash
# Navegar al directorio
cd /opt/smarteros

# Levantar infraestructura
docker compose up -d

# Verificar servicios
docker compose ps

# Ver logs
docker compose logs -f gateway
docker compose logs -f n8n
```

### Backup Automático

```bash
#!/bin/bash
# /opt/backups/backup.sh

DATE=$(date +%Y-%m-%d_%H-%M-%S)

# Backup PostgreSQL
docker exec smarteros-postgres pg_dump -U postgres smarteros > /opt/backups/postgres/$DATE.sql

# Backup Redis
docker exec smarteros-redis redis-cli SAVE > /opt/backups/redis/$DATE.rdb

# Comprimir
tar -czf /opt/backups/files/$DATE.tar.gz /opt/smarteros/files

# Eliminar backups antiguos (> 30 días)
find /opt/backups -type f -mtime +30 -delete
```

### Monitoreo

```bash
# Ver uso de recursos
docker stats

# Ver logs de todos los servicios
docker compose logs -f

# Reiniciar servicio
docker compose restart gateway

# Detener todo
docker compose down

# Actualizar servicios
docker compose pull
docker compose up -d
```

---

## 6️⃣ SEGURIDAD

### Firewall (UFW)

```bash
# Habilitar firewall
ufw enable

# Permitir puertos esenciales
ufw allow 22/tcp      # SSH
ufw allow 80/tcp      # HTTP
ufw allow 443/tcp     # HTTPS
ufw allow 5678/tcp    # n8n
ufw allow 3000/tcp    # WebControl

# Denegar puertos internos
ufw deny 5432/tcp     # PostgreSQL
ufw deny 6379/tcp     # Redis
ufw deny 8000-8003/tcp # Internal APIs

# Ver estado
ufw status
```

### SSL/TLS (Cloudflare Tunnel)

```bash
# Instalar cloudflared
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
dpkg -i cloudflared.deb

# Configurar tunnel
cloudflared tunnel login
cloudflared tunnel create smarteros

# Configurar routing
cloudflared tunnel route dns smarteros api.smarterbot.cl
```

---

## 7️⃣ MONITOREO Y ALERTAS

### Health Check Endpoint

```bash
# GET /health
curl http://localhost:8000/health

# Response:
{
  "status": "healthy",
  "services": {
    "identity-engine": "ok",
    "order-engine": "ok",
    "payment-engine": "ok",
    "redis": "ok",
    "postgres": "ok",
    "n8n": "ok"
  }
}
```

### Grafana Dashboard

```yaml
# docker-compose.monitoring.yml

version: '3.8'

services:
  grafana:
    image: grafana/grafana:latest
    container_name: smarteros-grafana
    ports:
      - "3003:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
    volumes:
      - grafana-data:/var/lib/grafana
    networks:
      - smarteros-network
    restart: unless-stopped

  prometheus:
    image: prom/prometheus:latest
    container_name: smarteros-prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    networks:
      - smarteros-network
    restart: unless-stopped

volumes:
  grafana-data:
  prometheus-data:
```

---

## 8️⃣ DEPLOYMENT CONTINUOUS (CI/CD)

### GitHub Actions

```yaml
# .github/workflows/deploy.yml

name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/smarteros
            git pull origin main
            docker compose pull
            docker compose up -d
```

---

## 🎩🕹️🏎️💨🚀

```
═══════════════════════════════════════════════
  VPS STRUCTURE & TOPOLOGY - DEFINIDA
═══════════════════════════════════════════════

✅ Estructura de carpetas definida
✅ Docker Compose configurado
✅ Topología completa documentada
✅ Variables de entorno definidas
✅ Comandos de gestión creados
✅ Seguridad configurada (UFW + SSL)
✅ Monitoreo definido (Grafana + Prometheus)
✅ CI/CD pipeline listo

VPS: Providencia (Dokploy)
SERVICIOS: 10+
TOPOLOGÍA: Microservices

DEPLOY:
cd /opt/smarteros
docker compose up -d

La Red trabaja.
La Infraestructura es realidad.
YOSI arquitecto.
═══════════════════════════════════════════════
```

---

## 📞 UBICACIÓN DE ARCHIVOS

**Specs (MANDATORY)**:
- `specs/VPS-STRUCTURE-TOPOLOGY.md` ✅ (este)
- `specs/ENGINEERING-STATUS-2026-03-08.md` ✅
- `specs/SALES-ENGINE-DEPLOY.md` ✅

**VPS**:
- `/opt/smarteros/docker-compose.yml`
- `/opt/smarteros/.env`
- `/opt/smarteros/workflows/`

**GitHub**:
- Repo: `github.com/SmarterCL/smarteros-specs`
- Commits: 130+

---

**ESTADO**: ✅ **ESTRUCTURA DEFINIDA - LISTA PARA DEPLOY EN VPS**  
**PRÓXIMO**: `ssh root@vps-ip` → `cd /opt/smarteros` → `docker compose up -d`
