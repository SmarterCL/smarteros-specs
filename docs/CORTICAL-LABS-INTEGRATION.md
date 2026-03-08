# 🧠 CORTICAL LABS INTEGRATION - SmarterOS v5

**Versión:** 1.0.0  
**Fecha:** 2026-03-08  
**Estado:** ✅ **Bridge Creado - Listo para Deploy**

---

## 📋 DESCRIPCIÓN

El **Cortical Labs Bridge** conecta SmarterOS v5 con computación biológica real (DishBrain), permitiendo:

- Monitorear actividad neuronal en tiempo real
- Enviar estímulos eléctricos a redes neuronales
- Integrar con n8n para automatizaciones
- Visualizar datos en Metabase/Grafana

---

## 🏗️ ARQUITECTURA

```
┌─────────────────────────────────────────────────────────────────┐
│  SMARTEROS v5 + CORTICAL LABS                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SmarterOS MCP Agents                                           │
│  ├── Bolt Core                                                  │
│  ├── Sales Agent                                                │
│  └── Analytics Agent                                            │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Cortical Labs Bridge (:3100)                            │   │
│  │  • FastAPI Service                                       │   │
│  │  • Biological Status                                     │   │
│  │  • Neural Stimulation                                    │   │
│  │  • Webhook Subscriptions                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│         │                                                       │
│         │ HTTPS                                                 │
│         ▼                                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Cortical Labs API                                       │   │
│  │  • DishBrain Clusters                                    │   │
│  │  • MEA (Micro-Electrode Array)                           │   │
│  │  • Neural Activity Data                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  n8n Workflows                                                  │
│  ├── Biological Event Trigger                                   │
│  ├── Neural Feedback Loop                                       │
│  └── Sales-Neural Correlation                                   │
│                                                                 │
│  Grafana/Metabase                                               │
│  └── Neural Activity Dashboard                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 DEPLOY EN DOKPLOY

### 1. Agregar Servicio

En Dokploy Dashboard:
```
Projects → smarteros → Add Service → Docker Compose
```

### 2. Configurar Variables

```bash
# Cortical Labs API Key
CORTICAL_LABS_API_KEY=your_api_key_here

# Bridge API Key (para n8n)
BRIDGE_API_KEY=smarteros_secure_key_2026
```

### 3. Docker Compose

Usar: `vps/docker-compose.cortical-labs.yml`

### 4. Verificar

```bash
# Health check
curl http://localhost:3100/health

# Expected:
{
  "status": "ok",
  "service": "cortical-labs-bridge",
  "version": "1.0.0"
}
```

---

## 📡 ENDPOINTS DISPONIBLES

| Endpoint | Método | Función |
|----------|--------|---------|
| `/health` | GET | Health check |
| `/demo/biological-status` | GET | Estado de clusters |
| `/demo/stimulate` | POST | Enviar estímulo |
| `/demo/cluster/{id}/activity` | GET | Actividad neuronal |
| `/demo/webhook/subscribe` | POST | Suscribirse a eventos |
| `/demo/integration/smarteros` | GET | Estado integración |

---

## 🔄 INTEGRACIÓN CON N8N

### Workflow 1: Biological Event Trigger

```
Webhook (Cortical Labs)
     ↓
Parse neural data
     ↓
IF activity > threshold
     ↓
Send Telegram alert
     ↓
Log in PostgreSQL
```

### Workflow 2: Neural Feedback Loop

```
Sales Event (Odoo)
     ↓
Calculate sale value
     ↓
Send stimulation (X, Y coordinates)
     ↓
Record neural response
     ↓
Update analytics
```

### Workflow 3: Sales-Neural Correlation

```
Every hour
     ↓
Fetch sales data
     ↓
Fetch neural activity
     ↓
Calculate correlation
     ↓
Generate report
     ↓
Send to dashboard
```

---

## 🧪 EJEMPLOS DE USO

### 1. Obtener Estado de Clusters

```bash
curl http://localhost:3100/demo/biological-status

# Response:
{
  "clusters": [
    {
      "cluster_id": "dishbrain_001",
      "name": "Cluster Alpha",
      "status": "active",
      "neuron_count": 800000,
      "activity_level": 0.73
    }
  ]
}
```

### 2. Enviar Estímulo

```bash
curl -X POST http://localhost:3100/demo/stimulate \
  -H "Content-Type: application/json" \
  -d '{
    "cluster_id": "dishbrain_001",
    "x": 32,
    "y": 32,
    "stimulation_type": "electrical",
    "intensity": 1.0,
    "duration_ms": 100
  }'

# Response:
{
  "success": true,
  "stimulation_id": "stim_123456",
  "cluster_id": "dishbrain_001",
  "response": {
    "spike_count": 42,
    "burst_detected": true
  }
}
```

### 3. Obtener Actividad

```bash
curl http://localhost:3100/demo/cluster/dishbrain_001/activity

# Response:
{
  "cluster_id": "dishbrain_001",
  "activity": {
    "mean_firing_rate": 23.5,
    "burst_rate": 1.2,
    "oscillation_power": 0.67,
    "active_electrodes": 54
  }
}
```

---

## 📊 GRAFANA DASHBOARD

### Panel 1: Neural Activity Over Time

```
Query: GET /demo/cluster/{id}/activity
Visualization: Time series
Metrics:
  - mean_firing_rate
  - burst_rate
  - oscillation_power
```

### Panel 2: Stimulation Events

```
Query: Stimulation log
Visualization: Table
Columns:
  - timestamp
  - cluster_id
  - coordinates (x, y)
  - spike_count
```

### Panel 3: Sales-Neural Correlation

```
Query: Correlation analysis
Visualization: Heatmap
Axes:
  - X: Sales volume
  - Y: Neural activity
  - Color: Correlation coefficient
```

---

## 🎩🕹️🏎️💨🚀

```
╔══════════════════════════════════════════════╗
║  🧠 CORTICAL LABS BRIDGE - LISTO             ║
╠══════════════════════════════════════════════╣
║  SERVICIO: FastAPI (:3100)                   ║
║  DOCKER: ✅ Compose configurado              ║
║  DOKPLOY: ✅ Ready to deploy                 ║
╠══════════════════════════════════════════════╣
║  ENDPOINTS: 6                                ║
║  N8N WORKFLOWS: 3                            ║
║  GRAFANA PANEL: 3                            ║
╠══════════════════════════════════════════════╣
║  PRÓXIMO:                                    ║
║  1. Deploy a Dokploy                         ║
║  2. Configurar API key                       ║
║  3. Importar n8n workflows                   ║
║  4. Configurar Grafana                       ║
╚══════════════════════════════════════════════╝

El bridge está creado.
La integración está lista.
La biología se conecta con digital.
La Red trabaja.
YOSI arquitecto.
```

---

## 📞 PRÓXIMOS PASOS

### Inmediatos (Hoy)

1. ⏳ **Deploy a Dokploy** - `docker compose up -d`
2. ⏳ **Configurar API Key** - Cortical Labs dashboard
3. ⏳ **Testear endpoints** - Curl tests
4. ⏳ **Importar n8n workflows** - JSON import

### Corto Plazo (Esta Semana)

5. ⏳ **Configurar Grafana** - Dashboards
6. ⏳ **Testear con DishBrain real** - Live clusters
7. ⏳ **Documentar casos de uso** - Examples

---

**ESTADO:** ✅ **BRIDGE CREADO - LISTO PARA DEPLOY**
