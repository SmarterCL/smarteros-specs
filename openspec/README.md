# OpenSpec - SmarterOS Specifications

Spec-driven development con IA para todas las APIs de SmarterOS.

## 🎯 Propósito

Este directorio centraliza todas las especificaciones OpenAPI y change proposals para el ecosistema SmarterOS. Utilizamos [@fission-ai/openspec](https://docs.openspec.ai) para desarrollo spec-driven con asistencia de IA.

## 📁 Estructura

```
openspec/
├── specs/           # ✅ Especificaciones OpenAPI activas
├── changes/         # 🔄 Change proposals en revisión
├── archived/        # 📦 Cambios aprobados e integrados
├── project.md       # 📖 Contexto completo del proyecto (345 líneas)
├── AGENTS.md        # 🤖 Instrucciones para AI assistants
└── README.md        # 📄 Este archivo
```

## 🚀 Inicio Rápido

### Instalación (si no está instalado)
```bash
npm install -g @fission-ai/openspec@latest
```

### Comandos Básicos

```bash
# Listar specs existentes
openspec list --specs

# Crear propuesta de cambio
openspec change --name add-new-endpoint

# Validar todas las specs
openspec validate

# Ver dashboard interactivo
openspec view

# Actualizar spec desde código
cd /root/smarteros-auth-api
openspec update
```

## 📊 Specs Disponibles

Ver [specs/INDEX.md](specs/INDEX.md) para lista completa y estado.

**Specs principales:**
- `api-gateway.yaml` - Contact API (FastAPI) ✅ Production
- `api-smarteros-legacy.yaml` - Legacy API Gateway (Express) ⚠️ Migration

**Pendientes (generar desde código):**
- Auth API (FastAPI - puerto 8003)
- Calendar API (Python - puerto 3020)
- Contact API (Flask - puerto 3030)
- N8N Public APIs (x2)

## 🔄 Workflow de Desarrollo

### 1. Planificar cambio
```bash
openspec change --name feature-name
# IA ayuda a crear proposal.md, tasks.md, design.md
```

### 2. Implementar
```bash
# Codifica cambios en tu API
nano app/main.py
```

### 3. Actualizar spec
```bash
openspec update
# IA detecta cambios y actualiza spec automáticamente
```

### 4. Validar
```bash
openspec validate feature-name
# Verifica consistencia spec ↔ código
```

### 5. Aprobar e integrar
```bash
openspec archive feature-name
# Merge change proposal a main spec
```

## 🔗 Sincronización VPS ↔ GitHub

### Desde VPS a GitHub
```bash
/root/smarteros-specs/sync-to-github.sh
```

### Desde GitHub a VPS
```bash
/root/smarteros-specs/sync-from-github.sh
```

### Automático (cron)
```bash
# Agregar a crontab
*/60 * * * * /root/smarteros-specs/sync-from-github.sh
```

## 📖 Documentación

- **Contexto Proyecto:** [project.md](project.md) - Tech stack, architecture, conventions
- **AI Instructions:** [AGENTS.md](AGENTS.md) - Para GitHub Copilot, Cursor, Cline, etc.
- **Plan Implementación:** `/root/OPENSPEC-IMPLEMENTATION-PLAN.md`
- **Setup Completo:** `/root/OPENSPEC-SETUP-COMPLETE.md`

## 🏗️ Arquitectura

### APIs Integradas

```
openspec/
  └── specs/
        ├── api-gateway.yaml       (api.smarterbot.cl)
        ├── api-smarteros-legacy.yaml
        ├── auth-api.yaml          (auth.smarterbot.cl - TODO)
        ├── calendar-api.yaml      (calendar.smarterbot.cl - TODO)
        └── contact-api.yaml       (puerto 3030 - TODO)
```

### Relación con Servicios

```
servicios/
├── api.smarter/
│   └── openapi.yaml → ../../openspec/specs/api-gateway.yaml (planned symlink)
├── app.smarter/
├── crm.smarter/
└── erp.smarter/
```

## 🤖 Integración con AI Assistants

### GitHub Copilot
```bash
# Copilot lee automáticamente AGENTS.md
# Usa comandos como:
gh copilot explain "Leer project.md y resumir tech stack"
```

### Cursor / Cline
```bash
# Detectan automáticamente openspec/
# Comandos slash disponibles:
# /openspec list
# /openspec change
# /openspec validate
```

### Claude / ChatGPT
```
# Copiar manualmente:
"Lee el contenido de openspec/project.md y ayúdame con..."
```

## 🔍 Validación Automática

### Pre-commit Hook (por repo)
```bash
# Agregar a .git/hooks/pre-commit
#!/bin/bash
openspec validate || {
  echo "❌ Spec OpenAPI inválida"
  exit 1
}
```

### CI/CD (GitHub Actions)
```yaml
# .github/workflows/validate-specs.yml
- run: npm install -g @fission-ai/openspec@latest
- run: cd openspec && openspec validate
```

## 📝 Convenciones

### Nombres de Specs
- **kebab-case:** `auth-api.yaml`, `calendar-api.yaml`
- **Sufijo .yaml** (no .yml) para consistencia
- **Prefijo describe servicio:** `api-`, `auth-`, `calendar-`

### Change Proposals
- **Formato:** `add-feature-name`, `update-endpoint-x`, `remove-deprecated-y`
- **Verbos:** add, update, remove, refactor, fix
- **Documentar:** Siempre incluir `proposal.md`, `tasks.md`

### Commits
```
feat(openspec): add calendar API spec
fix(openspec): correct auth endpoint schemas
docs(openspec): update project.md with new services
```

## 🚨 Troubleshooting

### Spec no valida
```bash
# Ver errores detallados
openspec validate --strict

# Regenerar desde código
openspec update --force
```

### Divergencia código ↔ spec
```bash
# Ver diferencias
openspec diff

# Sincronizar
openspec update
```

### AI assistant no lee AGENTS.md
```bash
# Verificar ubicación
ls -la /root/openspec/AGENTS.md

# Reiniciar extension (Cursor/Cline)
# O recargar VS Code
```

## 🔗 Enlaces

- **OpenSpec Docs:** https://docs.openspec.ai
- **GitHub Repo:** https://github.com/SmarterCL/smarteros-specs
- **Documentación VPS:** `/root/SMARTEROS-COMPLETE-STATUS-2025-12-01.md`

## 👥 Mantenedores

- **SmarterOS Team** - dev@smarterbot.cl
- **Última actualización:** 2025-12-07

---

**🎯 Próximo paso:** Lee [specs/INDEX.md](specs/INDEX.md) para ver estado de cada API.
