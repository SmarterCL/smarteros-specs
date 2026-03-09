#!/bin/bash
# ═══════════════════════════════════════════════════════════
# SmarterOS v5 - Python Packages Installation Script
# ═══════════════════════════════════════════════════════════

set -e

echo "╔══════════════════════════════════════════════════════════╗"
echo "║     🐍 SmarterOS v5 - Python Packages Install            ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# ═══════════════════════════════════════════════════════════
# 1. VERIFICAR PYTHON
# ═══════════════════════════════════════════════════════════

echo -e "${YELLOW}[1/8] Verificando Python...${NC}"
if ! command -v python3 &> /dev/null; then
  echo -e "${RED}❌ Python3 no está instalado${NC}"
  exit 1
fi

python3 --version
echo -e "${GREEN}✅ Python verificado${NC}"
echo ""

# ═══════════════════════════════════════════════════════════
# 2. CREAR VIRTUAL ENVIRONMENT (ANTES DE PIP)
# ═══════════════════════════════════════════════════════════

echo -e "${YELLOW}[2/8] Creando virtual environment...${NC}"
python3 -m venv smarteros-venv
echo -e "${GREEN}✅ venv creado${NC}"
echo ""

# ═══════════════════════════════════════════════════════════
# 3. ACTIVAR VIRTUAL ENVIRONMENT
# ═══════════════════════════════════════════════════════════

echo -e "${YELLOW}[3/8] Activando virtual environment...${NC}"
source smarteros-venv/bin/activate
echo -e "${GREEN}✅ venv activado${NC}"
echo ""

# ═══════════════════════════════════════════════════════════
# 4. ACTUALIZAR PIP (DENTRO DEL VENV)
# ═══════════════════════════════════════════════════════════

echo -e "${YELLOW}[4/8] Actualizando pip en el venv...${NC}"
python3 -m pip install --upgrade pip --quiet
pip --version
echo -e "${GREEN}✅ pip actualizado${NC}"
echo ""

# ═══════════════════════════════════════════════════════════
# 5. INSTALAR PAQUETES BASE
# ═══════════════════════════════════════════════════════════

echo -e "${YELLOW}[5/8] Instalando paquetes base...${NC}"
pip install --quiet fastapi uvicorn httpx pydantic python-dotenv uuid

# Verificar instalación
python -c "import fastapi, uvicorn, httpx, pydantic; print('✅ Base packages OK')"
echo -e "${GREEN}✅ Paquetes base instalados${NC}"
echo ""

# ═══════════════════════════════════════════════════════════
# 6. INSTALAR POR SERVICIO
# ═══════════════════════════════════════════════════════════

echo -e "${YELLOW}[6/8] Instalando por servicio...${NC}"

# Bio-AI Bridge
if [ -f "services/bio-ai-bridge/requirements.txt" ]; then
  echo "  📦 Bio-AI Bridge..."
  cd services/bio-ai-bridge
  pip install --quiet -r requirements.txt
  cd ../..
  echo "  ✅ Bio-AI Bridge OK"
fi

# Cortical Labs Bridge
if [ -f "services/cortical-labs-bridge/requirements.txt" ]; then
  echo "  📦 Cortical Labs Bridge..."
  cd services/cortical-labs-bridge
  pip install --quiet -r requirements.txt
  cd ../..
  echo "  ✅ Cortical Labs Bridge OK"
fi

# Kaggle MCP Agent
if [ -f "mcp-agents/kaggle/requirements.txt" ]; then
  echo "  📦 Kaggle MCP Agent..."
  cd mcp-agents/kaggle
  pip install --quiet -r requirements.txt
  cd ../..
  echo "  ✅ Kaggle MCP Agent OK"
fi

echo -e "${GREEN}✅ Servicios instalados${NC}"
echo ""

# ═══════════════════════════════════════════════════════════
# 7. VERIFICAR INSTALACIÓN
# ═══════════════════════════════════════════════════════════

echo -e "${YELLOW}[7/8] Verificando instalación...${NC}"
echo ""
echo "Paquetes instalados:"
pip list
echo ""

# Verificar imports críticos
python -c "
import fastapi
import uvicorn
import httpx
import pydantic
print('✅ Todos los imports críticos OK')
"

echo -e "${GREEN}✅ Instalación verificada${NC}"
echo ""

# ═══════════════════════════════════════════════════════════
# 8. RESUMEN
# ═══════════════════════════════════════════════════════════

echo -e "${YELLOW}[8/8] Resumen...${NC}"
echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║     ✅ INSTALACIÓN COMPLETADA                            ║"
echo "╠══════════════════════════════════════════════════════════╣"
echo "║  VIRTUAL ENV: smarteros-venv                             ║"
echo "║  PYTHON: $(python3 --version)                            ║"
echo "║  PIP: $(pip --version | cut -d' ' -f1)                   ║"
echo "╠══════════════════════════════════════════════════════════╣"
echo "║  PRÓXIMOS PASOS:                                         ║"
echo "║  1. Activar venv: source smarteros-venv/bin/activate     ║"
echo "║  2. Iniciar servicios: python main.py                    ║"
echo "║  3. Testear: curl http://localhost:8000/health           ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
