# 🌐 CLOUDFLARE DNS ACTIVATION - SmarterOS v3.0

**Fecha:** 2026-03-06  
**Hora:** 13:05 CLT  
**Estado:** ⚡ **ACTIVANDO VÍA API PÚBLICA**

---

## 📋 REGLAS DE PUBLICACIÓN (CONSTANCIA)

### ✅ Regla 1: Todo en specs/
**CUMPLIDA** - Todos los archivos están en `specs/`

### ✅ Regla 2: GitHub First
**CUMPLIDA** - Pull realizado, cambios listos para push

### ✅ Regla 3: Cloudflare Only (NO Hostinger)
**CUMPLIDA** - Script `deploy/cloudflare-dns.sh` usa Cloudflare API

### ✅ Regla 4: API Pública Documentada
**EN PROGRESO** - Creando `api/openapi.yaml`

### ✅ Regla 5: docs.smarterbot.cl Semántica
**CUMPLIDA** - Estructura definida en `specs/DOCS-SEMANTICA.md`

---

## 🔧 CLOUDFLARE DNS SCRIPT

```bash
#!/bin/bash
# deploy/cloudflare-dns.sh
# Cloudflare DNS Configuration via Public API

set -e

# Configuration
CLOUDFLARE_API_TOKEN="${CLOUDFLARE_API_TOKEN:-}"
CLOUDFLARE_ZONE_ID="${CLOUDFLARE_ZONE_ID:-}"
VPS_IP="${VPS_IP:-89.116.23.167}"

# DNS Records to create
declare -a DNS_RECORDS=(
  "smarterbot.cl|A|$VPS_IP|true"
  "www.smarterbot.cl|A|$VPS_IP|true"
  "docs.smarterbot.cl|CNAME|smarteros-specs.pages.dev|true"
  "tienda.smarterbot.cl|A|$VPS_IP|true"
  "smarterprop.cl|A|$VPS_IP|true"
  "it.smarterprop.cl|CNAME|smarterprop.cl|true"
  "api.smarterbot.cl|A|$VPS_IP|true"
  "grafana.smarterbot.cl|A|$VPS_IP|true"
  "odoo.smarterbot.cl|A|$VPS_IP|true"
  "n8n.smarterbot.cl|A|$VPS_IP|true"
  "dokploy.smarterbot.cl|A|$VPS_IP|true"
)

# Create DNS Record
create_dns_record() {
  local name=$1
  local type=$2
  local content=$3
  local proxied=$4
  
  echo "📝 Creating $type record: $name → $content"
  
  curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/dns_records" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"type\": \"$type\",
      \"name\": \"$name\",
      \"content\": \"$content\",
      \"proxied\": $proxied,
      \"ttl\": 1
    }" | jq -r '.messages[0] // .result.id'
}

# Main execution
echo "╔══════════════════════════════════════════════════════════╗"
echo "║     CLOUDFLARE DNS ACTIVATION - SmarterOS v3.0          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Verify token
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo "❌ ERROR: CLOUDFLARE_API_TOKEN not set"
  echo ""
  echo "Set it with:"
  echo "  export CLOUDFLARE_API_TOKEN='your_token_here'"
  echo ""
  exit 1
fi

# Create records
for record in "${DNS_RECORDS[@]}"; do
  IFS='|' read -r name type content proxied <<< "$record"
  create_dns_record "$name" "$type" "$content" "$proxied"
  sleep 1
done

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║     ✅ DNS RECORDS CREATED                              ║"
echo "╠══════════════════════════════════════════════════════════╣"
echo "║  PRÓXIMO:                                                ║"
echo "║  1. Verificar propagación: dig smarterbot.cl             ║"
echo "║  2. Configurar SSL/TLS: Full (Strict)                    ║"
echo "║  3. Deploy en Cloudflare Pages                           ║"
echo "╚══════════════════════════════════════════════════════════╝"
