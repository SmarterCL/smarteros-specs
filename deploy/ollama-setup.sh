#!/bin/bash
# deploy/ollama-setup.sh
# Instalación de Ollama para Mac Intel

set -e

echo "╔══════════════════════════════════════════════════════════╗"
echo "║     OLLAMA SETUP - Mac Intel                            ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Verificar si es Mac Intel
ARCH=$(uname -m)
if [ "$ARCH" != "x86_64" ]; then
  echo "⚠️  Esto parece ser Apple Silicon (M1/M2/M3)"
  echo "   Para MLX Framework, ver: specs/integrations/mlx-openclaw.yml"
  echo ""
fi

# Paso 1: Instalar Ollama
echo "📦 Paso 1: Instalando Ollama..."
if command -v ollama &> /dev/null; then
  echo "✅ Ollama ya está instalado"
  ollama --version
else
  echo "   Instalando con Homebrew..."
  brew install ollama
  echo "✅ Ollama instalado"
fi

echo ""

# Paso 2: Iniciar Ollama
echo "🚀 Paso 2: Iniciando Ollama..."
if pgrep -x "ollama" > /dev/null; then
  echo "✅ Ollama ya está corriendo"
else
  echo "   Iniciando servicio..."
  ollama serve &
  sleep 3
  echo "✅ Ollama iniciado"
fi

echo ""

# Paso 3: Descargar modelos
echo "📥 Paso 3: Descargando modelos..."
echo ""

# Llama 3.1 8B
if ollama list | grep -q "llama3.1"; then
  echo "✅ Llama 3.1 ya está descargado"
else
  echo "   Descargando Llama 3.1 8B (4.5 GB)..."
  ollama pull llama3.1:8b
  echo "✅ Llama 3.1 descargado"
fi

# Mistral 7B (opcional)
if ollama list | grep -q "mistral"; then
  echo "✅ Mistral 7B ya está descargado"
else
  echo "   ¿Descargar Mistral 7B? (y/n)"
  read -r response
  if [[ "$response" =~ ^[Yy]$ ]]; then
    ollama pull mistral:7b
  fi
fi

echo ""

# Paso 4: Configurar para red local
echo "🌐 Paso 4: Configurando para red local..."
echo ""
echo "   Para conectar desde Termux/red local:"
echo "   1. Ejecutá: launchctl setenv OLLAMA_HOST \"0.0.0.0:11434\""
echo "   2. Reiniciá Ollama: brew services restart ollama"
echo "   3. Obtené tu IP: ipconfig getifaddr en0"
echo ""

# Paso 5: Test
echo "🧪 Paso 5: Testeando..."
echo ""
echo "   Ejecutando consulta de prueba..."
ollama run llama3.1:8b "¿Qué es SmarterOS? Respondé en 1 frase." 2>/dev/null | head -3

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║     ✅ OLLAMA SETUP COMPLETADO                          ║"
echo "╠══════════════════════════════════════════════════════════╣"
echo "║  PRÓXIMO:                                                ║"
echo "║  1. docker compose up -d n8n                             ║"
echo "║  2. Abrir: http://localhost:5678                         ║"
echo "║  3. Crear workflow con Ollama                            ║"
echo "╚══════════════════════════════════════════════════════════╝"
