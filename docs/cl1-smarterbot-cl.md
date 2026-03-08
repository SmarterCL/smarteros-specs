# 🌐 cl1.smarterbot.cl - PUBLICADO

**Fecha:** 2026-03-08  
**Dominio:** cl1.smarterbot.cl  
**IP:** 89.116.23.167  
**Cloudflare:** 🟠 Proxied  
**Estado:** ✅ **ONLINE**

---

## 📋 DNS CONFIGURATION

```
Type: A
Name: cl1
Content: 89.116.23.167
Proxy: 🟠 Enabled
TTL: Auto
```

---

## 🚀 SERVICIOS EXPUESTOS

### Bio-AI Bridge (Puerto 8000)

**URL:** https://cl1.smarterbot.cl

**Endpoints:**
- `GET /health` - Health check
- `POST /process-bio-request` - Bio-AI processing
- `GET /demo/cluster/{id}/status` - Cluster status
- `POST /demo/webhook/n8n` - n8n webhook

---

## 🧪 VERIFICAR

```bash
# Health check
curl https://cl1.smarterbot.cl/health

# Bio-AI test
curl -X POST https://cl1.smarterbot.cl/process-bio-request \
  -H "Content-Type: application/json" \
  -H "X-API-Key: smarteros_bio_2026" \
  -d '{"user_input": "test"}'
```

---

## 🔧 CADDY CONFIG

```caddyfile
cl1.smarterbot.cl {
    reverse_proxy localhost:8000
    tls {
        protocols tls1.2 tls1.3
    }
}
```

---

**ESTADO:** ✅ **PUBLICADO Y ACCESIBLE**
