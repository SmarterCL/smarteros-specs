# SmarterOS v3.0 - Reglas de Publicación

**Versión**: 3.0  
**Fecha**: 2026-03-07  
**Estado**: ✅ **ACTIVADO**  

---

## 📋 REGLAS OBLIGATORIAS

### 1. Todo en specs/ ✅

```
✅ CORRECTO:
specs/REPORTE-FINAL-v3.0.md
specs/FASE-1-SUPABASE.md
specs/ORDEN-LOGICO-EJECUCION.md

❌ INCORRECTO:
/REPORTE-FINAL.md
/docs/reporte.md
/root/reporte-final.md
```

**Regla**: Todo reporte, especificación o documentación técnica DEBE estar en `specs/`

---

### 2. GitHub First ✅

```bash
# Flujo obligatorio:
git pull origin main          # 1. Pull primero
git add .                     # 2. Agregar cambios
git commit -m "feat: ..."     # 3. Commit semántico
git push origin main          # 4. Push inmediato
```

**Regla**: Sin excepciones - todo cambio local debe hacer push a GitHub

---

### 3. Cloudflare Only (NO Hostinger) ✅

```
✅ PERMITIDO:
- Cloudflare DNS
- Cloudflare Pages
- Cloudflare Workers
- Cloudflare API Pública

❌ DENEGADO:
- Hostinger
- GoDaddy DNS
- Namecheap
- Cualquier otro hosting que no sea Cloudflare
```

**Regla**: Sin excepciones - todo DNS y hosting vía Cloudflare

---

### 4. API Pública Documentada ✅

```
✅ REQUERIDO:
api/openapi.yaml
api/mcp-endpoints.md
api/webhooks.md

❌ INCOMPLETO:
- Endpoints sin documentar
- API keys en código
- Webhooks sin especificar
```

**Regla**: Toda API debe estar documentada en `api/`

---

### 5. docs.smarterbot.cl Semántica ✅

```
docs.smarterbot.cl/
├── specs/           # Especificaciones técnicas
├── agents/          # Agentes MCP
├── deploy/          # Scripts de deploy
├── docs/            # Documentación de usuario
├── integrations/    # Integraciones
└── api/             # API Documentation
```

**Regla**: Estructura de carpetas debe seguir la semántica definida

---

## 🚀 ACTIVACIÓN

### Estado Actual

| Regla | Estado | Verificación |
|-------|--------|--------------|
| 1. Todo en specs/ | ✅ ACTIVADO | `specs/` existe |
| 2. GitHub First | ✅ ACTIVADO | Remote configurado |
| 3. Cloudflare Only | ✅ ACTIVADO | Script creado |
| 4. API Pública | ✅ ACTIVADO | `api/` folder existe |
| 5. Docs Semántica | ✅ ACTIVADO | Estructura creada |

---

## 📊 VERIFICACIÓN AUTOMÁTICA

```bash
#!/bin/bash
# verify-rules.sh

echo "=== VERIFYING PUBLICATION RULES ==="

# Rule 1: specs/ exists
if [ -d "specs" ]; then
    echo "✅ Rule 1: specs/ exists"
else
    echo "❌ Rule 1: specs/ missing"
fi

# Rule 2: GitHub remote
if git remote -v | grep -q "origin"; then
    echo "✅ Rule 2: GitHub remote configured"
else
    echo "❌ Rule 2: GitHub remote missing"
fi

# Rule 3: Cloudflare script
if [ -f "deploy/cloudflare-dns.sh" ]; then
    echo "✅ Rule 3: Cloudflare script exists"
else
    echo "❌ Rule 3: Cloudflare script missing"
fi

# Rule 4: api/ folder
if [ -d "api" ]; then
    echo "✅ Rule 4: api/ folder exists"
else
    echo "❌ Rule 4: api/ folder missing"
fi

# Rule 5: docs structure
if [ -d "docs" ] && [ -d "specs" ] && [ -d "deploy" ]; then
    echo "✅ Rule 5: Docs structure complete"
else
    echo "❌ Rule 5: Docs structure incomplete"
fi

echo ""
echo "=== VERIFICATION COMPLETE ==="
```

---

## 🎩🕹️🏎️💨🚀

```
═══════════════════════════════════════════════
  REGLAS DE PUBLICACIÓN - ACTIVADAS
═══════════════════════════════════════════════

✅ 1. Todo en specs/
✅ 2. GitHub First (pull → commit → push)
✅ 3. Cloudflare Only (NO Hostinger)
✅ 4. API Pública documentada
✅ 5. docs.smarterbot.cl semántica

ESTADO: ACTIVADO
EXCEPCIONES: 0
DENEGADAS: Hostinger, GoDaddy, Namecheap

La Red trabaja.
YOSI arquitecto.
═══════════════════════════════════════════════
```

---

## 📞 UBICACIÓN

**Reglas**: `specs/REGLAS-PUBLICACION.md`  
**Verificación**: `deploy/verify-rules.sh`  
**DNS Script**: `deploy/cloudflare-dns.sh`

---

**ESTADO**: ✅ **ACTIVADO - SIN EXCEPCIONES**
