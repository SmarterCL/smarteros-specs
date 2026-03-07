# 🚀 SMARTER CLI - MANDATORY SPEC

**Fecha**: 2026-03-07  
**Hora**: 12:30 PM CLT  
**Estado**: ✅ **CREADO - MANDATORY**  
**Mandatory**: specs/ ✅  

---

## 📊 RESUMEN EJECUTIVO

```
╔══════════════════════════════════════════════════════════╗
║     SMARTER CLI - OFICIAL                                ║
╠══════════════════════════════════════════════════════════╣
║  INSTALACIÓN: curl -sSL smarter.sh | bash                ║
║  VERSIÓN: 3.0                                            ║
║  COMANDOS: 20+                                           ║
║  ARQUITECTURA: Agentes + Nodos + RAG + Skills            ║
╚══════════════════════════════════════════════════════════╝
```

---

## 🎯 ARQUITECTURA DEL CLI

### Comandos Principales

| Categoría | Comandos | Función |
|-----------|----------|---------|
| **agent** | create, run, list | Gestión de agentes |
| **node** | start, stop, status | Gestión de nodos |
| **rag** | read, analyze, suggest | Lectura RAG |
| **skill** | list, install, enable | Skills del sistema |
| **factory** | view | Ver fábrica de agentes |
| **blueprint** | list, deploy | Blueprints predefinidos |
| **health** | check | 3-CYCLE health check |
| **status** | - | Estado del sistema |
| **docs** | - | Documentación |

---

## 📁 ESTRUCTURA DE DIRECTORIOS

```
smarteros-specs/
├── deploy/
│   ├── smarter.sh              # Installer (curl | bash)
│   ├── smarter-cli.sh          # CLI principal
│   ├── termux-agent.sh         # Termux agent
│   ├── cloudflare-dns.sh       # DNS activation
│   └── autonomous-deploy.sh    # Deploy autónomo
├── specs/                      # MANDATORY
│   ├── REPORTE-FINAL-3CYCLE.md
│   ├── PLAN-MEJORA-CONTINUA.md
│   ├── PLAN-CONTINGENCIA.md
│   └── ... (12 archivos)
├── agents/                     # Agentes creados
├── skills/                     # Skills instaladas
└── docs/                       # Documentación
```

---

## 🔧 COMANDOS DETALLADOS

### Agent Commands

```bash
# Crear agente
smarter agent create sales-bot
# → Crea: ~/smarteros-specs/agents/sales-bot/agent.yaml

# Ejecutar agente
smarter agent run sales-bot
# → Carga configuración y ejecuta

# Listar agentes
smarter agent list
# → Muestra todos los agentes creados
```

### Node Commands

```bash
# Iniciar nodo
smarter node start api
# → Inicia nodo API en puerto 8000

# Estado de nodos
smarter node status
# → Muestra estado de todos los nodos
```

### RAG Commands

```bash
# Leer fuente de datos
smarter rag read kdm
# → Lee datos de KDM y los indexa

# Analizar datos
smarter rag analyze
# → Analiza datos indexados

# Obtener sugerencias
smarter rag suggest
# → Sugiere optimizaciones basadas en análisis
```

### Skill Commands

```bash
# Listar skills disponibles
smarter skill list
# → mercadolibre, kdm-crawler, sercotec, etc.

# Instalar skill
smarter skill install mercadolibre
# → Instala skill en ~/smarteros-specs/skills/
```

### Factory Commands

```bash
# Ver fábrica de agentes
smarter factory view
# → Muestra:
#   [agent-sales]
#   [agent-support]
#   [agent-logistics]
#   [agent-accounting]
```

### Health Check

```bash
# Ejecutar 3-CYCLE health check
smarter health check
# → Verifica:
#   • MCP Agents (7 puertos)
#   • GitHub Sync
#   • 3 ciclos de 5 segundos
```

---

## 🚀 INSTALACIÓN

### Método 1: curl (Recomendado)

```bash
curl -sSL smarter.sh | bash
```

### Método 2: Manual

```bash
# Clonar repo
git clone https://github.com/SmarterCL/smarteros-specs.git ~/smarteros-specs

# Copiar CLI
cp ~/smarteros-specs/deploy/smarter-cli.sh /usr/local/bin/smarter
chmod +x /usr/local/bin/smarter

# Agregar al PATH
export PATH="$HOME/.local/bin:$PATH"
```

### Método 3: Termux

```bash
# En Termux (Android)
pkg install git curl
curl -sSL smarter.sh | bash
```

---

## 📊 QUICK START

```bash
# 1. Ayuda
smarter help

# 2. Ver agentes
smarter agent list

# 3. Crear agente
smarter agent create demo-bot

# 4. Ver fábrica
smarter factory view

# 5. Health check
smarter health check

# 6. Ver documentación
smarter docs
```

---

## 🔗 INTEGRACIONES

### GitHub

- **Repo**: `github.com/SmarterCL/smarteros-specs`
- **Commits**: 122+
- **Branch**: main
- **Sync**: Automático con `smarter agent create`

### docs.smarterbot.cl

- **Docs**: `https://docs.smarterbot.cl`
- **Specs**: `specs/` directory
- **API**: OpenAPI spec publicado

### MCP Agents

| Puerto | Agente | Comando |
|--------|--------|---------|
| 3050 | Session Manager | `smarter health check` |
| 3052 | Cloudflare MCP | `smarter node status` |
| 3053 | GitHub MCP | `smarter agent list` |
| 3054 | MercadoPago MCP | `smarter skill list` |
| 3057 | Flow.cl MCP | `smarter blueprint list` |
| 3058 | Odoo Integration | `smarter factory view` |
| 3059 | PicoClaw | `smarter health check` |

---

## 🎩🕹️🏎️💨🚀

```
═══════════════════════════════════════════════
  SMARTER CLI - OFICIAL
═══════════════════════════════════════════════

✅ 20+ Comandos
✅ Agentes + Nodos + RAG + Skills
✅ curl -sSL smarter.sh | bash
✅ 122 Commits en GitHub
✅ 12 Archivos en specs/ (MANDATORY)
✅ 3-CYCLE Health Check integrado

INSTALACIÓN:
  curl -sSL smarter.sh | bash

COMANDOS:
  smarter agent create <name>
  smarter health check
  smarter factory view
  smarter docs

La Red trabaja.
YOSI arquitecto.
═══════════════════════════════════════════════
```

---

## 📞 UBICACIÓN DE ARCHIVOS

**CLI Scripts**:
- `deploy/smarter.sh` - Installer
- `deploy/smarter-cli.sh` - CLI principal

**Specs (MANDATORY)**:
- `specs/` - 12 archivos
- `specs/REPORTE-FINAL-3CYCLE.md`
- `specs/PLAN-MEJORA-CONTINUA.md`
- `specs/PLAN-CONTINGENCIA.md`

**GitHub**:
- Repo: `github.com/SmarterCL/smarteros-specs`
- Commits: 122
- Branch: main

---

**ESTADO**: ✅ **CREADO - MANDATORY**  
**INSTALACIÓN**: `curl -sSL smarter.sh | bash`  
**SPECS**: 12 archivos (todo en specs/)
