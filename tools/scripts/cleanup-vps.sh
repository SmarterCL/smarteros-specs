#!/bin/bash
# Script para limpiar el VPS después de migración a repo

echo "🧹 Limpiando VPS - Borrando archivos migrados a repo..."

# Borrar archivos .env (ya están en /tools/envs)
rm -rf /root/*.env && echo "✅ .env eliminados"

# Borrar docker-compose (ya están en /tools/docker)
rm -rf /root/*compose*.yml && echo "✅ docker-compose eliminados"

# Borrar scripts (ya están en /tools/scripts)
rm -rf /root/*.sh && echo "✅ scripts eliminados"

# Borrar configs proxy (ya están en /tools)
rm -rf /root/caddy-custom && echo "✅ caddy-custom eliminado"
rm -rf /root/Caddyfile* && echo "✅ Caddyfiles eliminados"
rm -rf /root/traefik*.yml && echo "✅ traefik configs eliminados"
rm -rf /root/nginx*.conf && echo "✅ nginx configs eliminados"

# Borrar MCP (ya están en /tools)
rm -rf /root/hostinger-mcp && echo "✅ hostinger-mcp eliminado"
rm -rf /root/mcp-smarterbot && echo "✅ mcp-smarterbot eliminado"

# Borrar otros archivos migrables
rm -rf /root/*.md && echo "✅ markdowns eliminados"
rm -rf /root/*.txt && echo "✅ txt files eliminados"
rm -rf /root/*.json && echo "✅ json configs eliminados"

echo ""
echo "✅ VPS limpio. Todo está en:"
echo "   https://github.com/SmarterCL/smarteros-specs/tree/main/tools"
echo ""
echo "Para clonar en otra máquina:"
echo "   git clone https://github.com/SmarterCL/smarteros-specs"
echo "   cd smarteros-specs"
echo "   docker compose -f docker-compose.smarteros.yml up -d"
