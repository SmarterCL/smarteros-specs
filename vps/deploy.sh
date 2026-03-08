#!/bin/bash
# ═══════════════════════════════════════════════════════════
# SMARTEROS v5 - DEPLOY AUTOMÁTICO
# ═══════════════════════════════════════════════════════════

set -e

echo "╔══════════════════════════════════════════════════════════╗"
echo "║     🚀 SMARTEROS v5 - Deploy Automático                 ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# ═══════════════════════════════════════════════════════════
# 1. VERIFICAR CONEXIÓN
# ═══════════════════════════════════════════════════════════

echo -e "${YELLOW}[1/8] Verificando conexión...${NC}"
if ! docker ps &>/dev/null; then
  echo -e "${RED}❌ Docker no está corriendo${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Docker verificado${NC}"
echo ""

# ═══════════════════════════════════════════════════════════
# 2. PULL CAMBIOS
# ═══════════════════════════════════════════════════════════

echo -e "${YELLOW}[2/8] Pulling cambios...${NC}"
git pull origin main
echo -e "${GREEN}✅ Cambios actualizados${NC}"
echo ""

# ═══════════════════════════════════════════════════════════
# 3. VERIFICAR .ENV
# ═══════════════════════════════════════════════════════════

echo -e "${YELLOW}[3/8] Verificando .env...${NC}"
if [ ! -f .env ]; then
  echo -e "${RED}❌ .env no encontrado${NC}"
  echo "Copiando .env.example..."
  cp .env.example .env
  echo -e "${YELLOW}⚠️  Editá .env con tus API keys${NC}"
  exit 1
fi
echo -e "${GREEN}✅ .env verificado${NC}"
echo ""

# ═══════════════════════════════════════════════════════════
# 4. DEPLOY BIO-AI BRIDGE
# ═══════════════════════════════════════════════════════════

echo -e "${YELLOW}[4/8] Deploy Bio-AI Bridge...${NC}"
docker compose -f docker-compose.bio-ai-bridge.yml up -d
echo -e "${GREEN}✅ Bio-AI Bridge deployed${NC}"
echo ""

# ═══════════════════════════════════════════════════════════
# 5. DEPLOY CORTICAL LABS BRIDGE
# ═══════════════════════════════════════════════════════════

echo -e "${YELLOW}[5/8] Deploy Cortical Labs Bridge...${NC}"
docker compose -f docker-compose.cortical-labs.yml up -d
echo -e "${GREEN}✅ Cortical Labs Bridge deployed${NC}"
echo ""

# ═══════════════════════════════════════════════════════════
# 6. RESTART ALL SERVICES
# ═══════════════════════════════════════════════════════════

echo -e "${YELLOW}[6/8] Restarting all services...${NC}"
docker compose restart
echo -e "${GREEN}✅ Servicios reiniciados${NC}"
echo ""

# ═══════════════════════════════════════════════════════════
# 7. HEALTH CHECKS
# ═══════════════════════════════════════════════════════════

echo -e "${YELLOW}[7/8] Verificando health checks...${NC}"
echo ""

# Bio-AI Bridge
if curl -s http://localhost:8000/health | grep -q "ok"; then
  echo -e "${GREEN}✅ Bio-AI Bridge (:8000) - OK${NC}"
else
  echo -e "${RED}❌ Bio-AI Bridge (:8000) - FAILED${NC}"
fi

# Cortical Labs Bridge
if curl -s http://localhost:3100/health | grep -q "ok"; then
  echo -e "${GREEN}✅ Cortical Labs Bridge (:3100) - OK${NC}"
else
  echo -e "${RED}❌ Cortical Labs Bridge (:3100) - FAILED${NC}"
fi

# Sales Engine
if curl -s http://localhost:3080/health | grep -q "ok"; then
  echo -e "${GREEN}✅ Sales Engine (:3080) - OK${NC}"
else
  echo -e "${RED}❌ Sales Engine (:3080) - FAILED${NC}"
fi

# Identity Engine
if curl -s http://localhost:3070/health | grep -q "ok"; then
  echo -e "${GREEN}✅ Identity Engine (:3070) - OK${NC}"
else
  echo -e "${RED}❌ Identity Engine (:3070) - FAILED${NC}"
fi

# A2A Server
if curl -s http://localhost:3095/health | grep -q "ok"; then
  echo -e "${GREEN}✅ A2A Server (:3095) - OK${NC}"
else
  echo -e "${RED}❌ A2A Server (:3095) - FAILED${NC}"
fi

echo ""

# ═══════════════════════════════════════════════════════════
# 8. RESUMEN
# ═══════════════════════════════════════════════════════════

echo -e "${YELLOW}[8/8] Resumen...${NC}"
echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║     ✅ DEPLOY COMPLETADO                                 ║"
echo "╠══════════════════════════════════════════════════════════╣"
echo "║  SERVICIOS:                                              ║"
echo "║  • Bio-AI Bridge:       http://localhost:8000           ║"
echo "║  • Cortical Labs:       http://localhost:3100           ║"
echo "║  • Sales Engine:        http://localhost:3080           ║"
echo "║  • Identity Engine:     http://localhost:3070           ║"
echo "║  • A2A Server:          http://localhost:3095           ║"
echo "║  • n8n:                 http://localhost:5678           ║"
echo "║  • Grafana:             http://localhost:3000           ║"
echo "╠══════════════════════════════════════════════════════════╣"
echo "║  PRÓXIMOS PASOS:                                         ║"
echo "║  1. Configurar DNS en Cloudflare                         ║"
echo "║  2. Importar n8n workflows                               ║"
echo "║  3. Configurar Grafana                                   ║"
echo "║  4. Testear end-to-end                                   ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
