# SmarterOS Specs

Especificaciones técnicas, arquitectura y esquemas de datos para la plataforma SmarterOS.

## 📋 Contenido

### OpenSpec
Especificaciones formales del sistema:
- **runtime.validation.v1** - Validación continua de integridad funcional y semántica
- **api-mcp.yaml** - API MCP con rate limiting y autenticación
- **auth-api.yaml** - Sistema de autenticación y autorización

### Supabase Schemas
Esquemas de base de datos multi-tenant:
- **runtime-validation** - Sistema de scouts y validación continua
- **mcp-memory** - Memoria persistente con pgvector
- **auth-system** - Autenticación y gestión de usuarios

### MCP (Model Context Protocol)
Configuraciones de agentes y servicios MCP:
- **cloudflare-mcp-server** - Gestión de DNS y certificados
- **github-mcp-server** - Integración con GitHub
- **smarteros-mcp** - Protocolo central de SmarterOS

## 🏗️ Arquitectura

```
smarteros-specs/
├── openspec/
│   ├── specs/              # Especificaciones YAML
│   │   ├── runtime.validation.v1.yaml
│   │   ├── api-mcp.yaml
│   │   └── auth-api.yaml
│   └── supabase-*.sql      # Schemas SQL
├── mcp/                    # Configuraciones MCP
├── specs/                  # Specs adicionales
└── supabase/              # Migraciones Supabase
```

## 🚀 Uso

### Validar Specs
```bash
npm install -g @fission-ai/openspec
openspec check openspec/specs/*.yaml
```

### Aplicar Schema a Supabase
```bash
psql $SUPABASE_DB_URL -f openspec/supabase-schema-runtime-validation.sql
```

### Generar Docs
```bash
openspec docs openspec/specs/runtime.validation.v1.yaml > docs/runtime-validation.md
```

## 📚 Especificaciones Principales

### Runtime Validation (v1.0)
Sistema de validación continua para sitios productivos:
- ✅ Validación de links críticos
- ✅ Detección de nuevas URLs
- ✅ Comparación semántica con IA
- ✅ Alertas automáticas
- ✅ Multi-tenant con RLS
- ✅ SLA compliance

**Stack**: Firecrawl + OpenRouter + Supabase + Mailgun

**Casos de uso**:
- Ecommerce: Monitoreo de checkout y pasarelas
- Afiliados: Tracking de funnels y ofertas
- SaaS: Validación de signup flow

### API MCP (v2.0)
API central con gobernanza:
- ✅ Rate limiting por tenant (300 RPM)
- ✅ Autenticación JWT
- ✅ Integración con Qwen (Alibaba Cloud)
- ✅ Endpoints MCP estándar
- ✅ Validación contractual automática

### Auth System
Sistema de autenticación multi-tenant:
- ✅ JWT con refresh tokens
- ✅ RLS por tenant
- ✅ Integración con Clerk
- ✅ Soporte WhatsApp OTP

## 🔧 Stack Técnico

- **OpenSpec**: Validación de contratos
- **Supabase**: PostgreSQL + pgvector + RLS
- **OpenRouter**: LLM unificado (Qwen, GPT, Claude)
- **Mailgun**: Alertas y notificaciones
- **Firecrawl**: Web scraping
- **n8n**: Workflow automation
- **MCP**: Model Context Protocol

## 📊 Estado Actual

```
✅ Runtime Validation v1.0 - ACTIVE
✅ API MCP v2.0 - ACTIVE  
✅ MCP Memory - ACTIVE
✅ Auth System - ACTIVE
⏳ Embeddings Search - IN PROGRESS
```

## 🎯 Próximos Specs

- [ ] Payment Gateway Validation
- [ ] SII Compliance Checker
- [ ] Webhook Security Spec
- [ ] Multi-region Deployment

## 📝 Contribuir

1. Fork el repositorio
2. Crear rama: `git checkout -b feature/nueva-spec`
3. Validar: `openspec check openspec/specs/*.yaml`
4. Commit: `git commit -m "feat: nueva spec"`
5. Push: `git push origin feature/nueva-spec`
6. Crear Pull Request

## 📖 Documentación

- [OpenSpec Runtime Validation](/root/OPENSPEC-RUNTIME-VALIDATION-COMPLETE.md)
- [API MCP Documentation](https://api.smarterbot.cl/docs)
- [Supabase Schemas](/openspec/)

## 🔗 Enlaces

- **GitHub**: https://github.com/SmarterCL/smarteros-specs
- **API Docs**: https://api.smarterbot.cl/docs
- **Main Repo**: https://github.com/SmarterCL/smarteros-os

---

**SmarterOS** - Sistema operativo para PyMEs con IA, contabilidad y pagos para Chile
