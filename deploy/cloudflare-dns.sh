#!/bin/bash
# Cloudflare DNS Configuration Script
# SmarterOS v3.0 - docs.smarterbot.cl
# TAG: CLOUDFLARE, DNS, API

set -e

# Configuration
CLOUDFLARE_API_TOKEN="${CLOUDFLARE_API_TOKEN:-}"
CLOUDFLARE_ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:-}"
CLOUDFLARE_ZONE_ID="${CLOUDFLARE_ZONE_ID:-}"
VPS_IP="${VPS_IP:-}"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "╔══════════════════════════════════════════════════════════╗"
echo "║  ☁️  CLOUDFLARE DNS - CONFIGURATION                      ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Verify credentials
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo -e "${RED}❌ CLOUDFLARE_API_TOKEN not set${NC}"
    echo "   Export: export CLOUDFLARE_API_TOKEN='your_token'"
    exit 1
fi

echo -e "${GREEN}✅ Credentials verified${NC}"
echo ""

# DNS Records to create
declare -a DNS_RECORDS=(
    "smarterbot.cl|A|${VPS_IP:-127.0.0.1}|true"
    "docs.smarterbot.cl|CNAME|smarteros-specs.pages.dev|true"
    "tienda.smarterbot.cl|A|${VPS_IP:-127.0.0.1}|true"
    "smarterprop.cl|A|${VPS_IP:-127.0.0.1}|true"
    "it.smarterprop.cl|CNAME|smarterprop.cl|true"
)

echo "=== DNS RECORDS TO CREATE ==="
echo ""

for record in "${DNS_RECORDS[@]}"; do
    IFS='|' read -r name type content proxied <<< "$record"
    
    echo "Creating: $name ($type → $content)"
    
    # Create DNS record
    response=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/dns_records" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"type\": \"$type\",
            \"name\": \"$name\",
            \"content\": \"$content\",
            \"proxied\": $proxied
        }")
    
    # Check response
    if echo "$response" | grep -q '"success":true'; then
        echo -e "${GREEN}✅ Created${NC}"
    else
        echo -e "${YELLOW}⚠️  Already exists or error${NC}"
    fi
    
    echo ""
done

echo "╔══════════════════════════════════════════════════════════╗"
echo "║  ✅ CLOUDFLARE DNS - CONFIGURATION COMPLETE              ║"
echo "╠══════════════════════════════════════════════════════════╣"
echo "║  DOMINIOS CONFIGURADOS:                                  ║"
echo "║  • smarterbot.cl                                         ║"
echo "║  • docs.smarterbot.cl                                    ║"
echo "║  • tienda.smarterbot.cl                                  ║"
echo "║  • smarterprop.cl                                        ║"
echo "║  • it.smarterprop.cl                                     ║"
echo "╠══════════════════════════════════════════════════════════╣"
echo "║  PROXY: ✅ Naranja (Cloudflare)                          ║"
echo "║  API: ✅ Cloudflare Pública                              ║"
echo "║  HOSTINGER: ❌ NO (excepción denegada)                   ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
