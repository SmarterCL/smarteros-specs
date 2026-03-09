# 🐍 Python Packages - SmarterOS v5

**Instalación en Orden Lógico**

---

## 📋 ORDEN DE INSTALACIÓN

### 1. Python Setup

```bash
# Verificar Python
python3 --version

# Debería ser 3.8+
```

### 2. pip Setup

```bash
# Actualizar pip
python3 -m pip install --upgrade pip

# Verificar pip
pip --version
```

### 3. Virtual Environment (Recomendado)

```bash
# Crear venv
python3 -m venv smarteros-venv

# Activar venv (macOS/Linux)
source smarteros-venv/bin/activate

# Activar venv (Windows)
smarteros-venv\Scripts\activate
```

### 4. Paquetes Base (Todos los servicios)

```bash
# FastAPI framework
pip install fastapi

# ASGI server
pip install uvicorn

# HTTP client
pip install httpx

# Data validation
pip install pydantic

# Environment variables
pip install python-dotenv

# UUID generation
pip install uuid
```

### 5. Paquetes Específicos por Servicio

#### Bio-AI Bridge

```bash
cd services/bio-ai-bridge
pip install -r requirements.txt
```

#### Cortical Labs Bridge

```bash
cd services/cortical-labs-bridge
pip install -r requirements.txt
```

#### Kaggle MCP Agent

```bash
cd mcp-agents/kaggle
pip install -r requirements.txt
```

### 6. Paquetes Adicionales (Opcionales)

```bash
# Supabase client
pip install supabase

# PostgreSQL adapter
pip install psycopg2-binary

# Redis client
pip install redis

# Kaggle API
pip install kaggle

# Machine Learning
pip install scikit-learn
pip install pandas
pip install numpy

# Testing
pip install pytest
pip install pytest-asyncio
```

### 7. Verificar Instalación

```bash
# Listar paquetes instalados
pip list

# Verificar FastAPI
python -c "import fastapi; print(fastapi.__version__)"

# Verificar todos
python -c "
import fastapi
import uvicorn
import httpx
import pydantic
print('✅ Todos los paquetes instalados correctamente')
"
```

---

## 🚀 INSTALACIÓN AUTOMÁTICA

```bash
#!/bin/bash
# install-python-packages.sh

echo "╔══════════════════════════════════════════════════════════╗"
echo "║     🐍 SmarterOS v5 - Python Packages Install            ║"
echo "╚══════════════════════════════════════════════════════════╝"

# 1. Verificar Python
echo "[1/8] Verificando Python..."
python3 --version

# 2. Actualizar pip
echo "[2/8] Actualizando pip..."
python3 -m pip install --upgrade pip

# 3. Crear venv
echo "[3/8] Creando virtual environment..."
python3 -m venv smarteros-venv

# 4. Activar venv
echo "[4/8] Activando virtual environment..."
source smarteros-venv/bin/activate

# 5. Instalar paquetes base
echo "[5/8] Instalando paquetes base..."
pip install fastapi uvicorn httpx pydantic python-dotenv uuid

# 6. Instalar por servicio
echo "[6/8] Instalando por servicio..."
cd services/bio-ai-bridge && pip install -r requirements.txt && cd ../..
cd services/cortical-labs-bridge && pip install -r requirements.txt && cd ../..
cd mcp-agents/kaggle && pip install -r requirements.txt && cd ../..

# 7. Verificar
echo "[7/8] Verificando instalación..."
python -c "import fastapi, uvicorn, httpx, pydantic; print('✅ OK')"

# 8. Resumen
echo "[8/8] Resumen..."
pip list

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║     ✅ INSTALACIÓN COMPLETADA                            ║"
echo "╚══════════════════════════════════════════════════════════╝"
```

---

## 📊 PAQUETES POR SERVICIO

| Servicio | Paquetes | Tamaño |
|----------|----------|--------|
| **Bio-AI Bridge** | 5 | ~15 MB |
| **Cortical Labs** | 5 | ~15 MB |
| **Kaggle MCP** | 7 | ~25 MB |
| **Base** | 6 | ~20 MB |
| **TOTAL** | **23** | **~75 MB** |

---

**ESTADO:** ✅ **GUÍA CREADA - LISTA PARA EJECUTAR**
