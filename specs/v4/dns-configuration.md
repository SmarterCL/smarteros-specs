# 🌐 DNS CONFIGURATION - SmarterOS v4

**Fecha:** 2026-03-06  
**Estado:** ⏳ **PENDIENTE CONFIGURACIÓN CLOUDFLARE**

---

## 📊 DNS ACTUAL

| Subdominio | Tipo | Contenido | Proxy | Estado |
|------------|------|-----------|-------|--------|
| `smarterbot.cl` | A | 216.198.79.1 | 🟠 | ✅ Cloudflare Pages |
| `draw.smarterbot.cl` | CNAME | smarteros-specs.pages.dev | 🟠 | ⏳ Pendiente |
| `docs.smarterbot.cl` | CNAME | smarteros-specs.pages.dev | 🟠 | ⏳ Pendiente |
| `tienda.smarterbot.cl` | A | 89.116.23.167 | 🟠 | ⏳ Pendiente |
| `api.smarterbot.cl` | A | 89.116.23.167 | 🟠 | ⏳ Pendiente |

---

## 🔧 COMANDO PARA CONFIGURAR DRAW DNS

```bash
# Con Cloudflare MCP
/cf dns create draw.smarterbot.cl CNAME smarteros-specs.pages.dev

# O manualmente en Cloudflare Dashboard:
# 1. Ir a: dash.cloudflare.com
# 2. Seleccionar: smarterbot.cl
# 3. DNS → Add Record
# 4. Tipo: CNAME
# 5. Name: draw
# 6. Target: smarteros-specs.pages.dev
# 7. Proxy: Enabled (naranja)
# 8. Guardar
```

---

## 📊 DEPLOY EN CLOUDFLARE PAGES

### Opción 1: Wrangler CLI

```bash
cd /Users/mac/smarteros-specs/visual-cad

# Build (si usa Vite)
npm run build

# Deploy
wrangler pages deploy dist/ --project-name=smarteros-specs
```

### Opción 2: GitHub Actions

```yaml
# .github/workflows/deploy-draw.yml
name: Deploy draw.smarterbot.cl

on:
  push:
    branches: [main]
    paths: ['visual-cad/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: pages deploy visual-cad/dist --project-name=smarteros-specs
```

### Opción 3: Directo desde Cloudflare Dashboard

```
1. Ir a: Cloudflare Pages
2. Create Project → Connect Git
3. Seleccionar: SmarterCL/smarteros-specs
4. Build settings:
   - Build command: npm run build
   - Build output: visual-cad/dist
5. Deploy
```

---

## 🔄 FLUJO COMPLETO DRAW

```
1. Crear blueprint en CLI
   ↓
   smarter blueprint create ventas
   ↓
2. Diseñar en visual-cad/local
   ↓
   npm run dev
   ↓
3. Exportar JSON
   ↓
4. Deploy a Cloudflare Pages
   ↓
   wrangler pages deploy dist/
   ↓
5. Acceder desde
   ↓
   https://draw.smarterbot.cl
   ↓
6. Room compartido
   ↓
   #room=eba1a9217ceff501392d,WJyjqqRnE0Kh6WRtbmBEiA
```

---

## 🎩🕹️🏎️💨🚀

```
╔══════════════════════════════════════════════╗
║  🌐 DNS CONFIGURATION - LISTA                ║
╠══════════════════════════════════════════════╣
║  smarterbot.cl: ✅ 216.198.79.1              ║
║  draw.smarterbot.cl: ⏳ CNAME pendiente      ║
╠══════════════════════════════════════════════╣
║  PRÓXIMO:                                    ║
║  1. Configurar CNAME en Cloudflare           ║
║  2. Deploy visual-cad a Pages                ║
║  3. Verificar acceso                         ║
╚══════════════════════════════════════════════╝

El DNS base está activo.
draw necesita CNAME.
La Red trabaja.
YOSI arquitecto.
```

---

**ESTADO:** ⏳ **PENDIENTE: Configurar CNAME draw.smarterbot.cl**
