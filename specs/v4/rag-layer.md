# 🧠 RAG LAYER IMPLEMENTATION - SmarterOS v4

**Versión:** 1.0.0  
**Fecha:** 2026-03-06  
**Estado:** ✅ **Especificación Completa**

---

## 📋 DESCRIPCIÓN

La **RAG Layer** (Retrieval-Augmented Generation) es la memoria del sistema. Permite que los agentes accedan a conocimiento histórico, documentación, y contexto para tomar decisiones inteligentes.

---

## 🏗️ ARQUITECTURA

```
┌─────────────────────────────────────────────────────────────────┐
│  RAG LAYER                                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Fuentes de Conocimiento                                        │
│  ├── docs/ (Documentación)                                      │
│  ├── repos/ (Código GitHub)                                     │
│  ├── crm/ (Clientes y ventas)                                   │
│  ├── logs/ (Histórico de ejecución)                             │
│  └── kpis/ (Métricas y KPIs)                                    │
│                                                                 │
│  Procesamiento                                                  │
│  ├── Read → Leer fuentes                                        │
│  ├── Analyze → Analizar con IA (MiniMax/Ollama)                 │
│  ├── Index → Indexar en Supabase/Vector DB                      │
│  └── Suggest → Sugerir mejoras a agentes                        │
│                                                                 │
│  API Endpoints                                                  │
│  ├── GET  /rag/query?q=<query>                                  │
│  ├── POST /rag/ingest                                           │
│  ├── GET  /rag/suggestions                                      │
│  └── POST /rag/feedback                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 CONFIGURACIÓN

### Supabase Vector DB

```sql
-- Tabla de embeddings
CREATE TABLE rag_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  embedding VECTOR(1536),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsqueda vectorial
CREATE INDEX ON rag_embeddings USING ivfflat (embedding vector_cosine_ops);

-- Función de búsqueda
CREATE FUNCTION rag_search(query_embedding VECTOR(1536), match_count INT)
RETURNS TABLE(id UUID, source VARCHAR, content TEXT, similarity FLOAT) AS $$
BEGIN
  RETURN QUERY
  SELECT e.id, e.source, e.content, 1 - (e.embedding <=> query_embedding) AS similarity
  FROM rag_embeddings e
  ORDER BY e.embedding <=> query_embedding
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql;
```

---

## 📡 API ENDPOINTS

### Query RAG

```bash
GET /rag/query?q=mejorar+tiempo+respuesta+whatsapp

# Response:
{
  "query": "mejorar tiempo respuesta whatsapp",
  "results": [
    {
      "source": "docs/ventas.md",
      "content": "El mejor tiempo de respuesta es entre 19:00 y 21:00",
      "similarity": 0.92
    },
    {
      "source": "logs/agent-sales.log",
      "content": "Whatsapp responder node: avg response 5.2s",
      "similarity": 0.87
    }
  ],
  "suggestions": [
    {
      "type": "node_update",
      "node": "whatsapp-responder",
      "change": "schedule_optimization",
      "time": "19:00-21:00"
    }
  ]
}
```

### Ingestar Documento

```bash
POST /rag/ingest
{
  "source": "docs/manual-ventas.md",
  "content": "El proceso de ventas sigue estos pasos...",
  "metadata": {
    "category": "ventas",
    "agent": "agent-sales"
  }
}
```

### Obtener Suggerencias

```bash
GET /rag/suggestions?agent=agent-sales

# Response:
{
  "agent": "agent-sales",
  "suggestions": [
    {
      "id": "sugg-001",
      "type": "node_optimization",
      "node": "whatsapp-responder",
      "description": "Mejorar tiempo de respuesta a 19:00",
      "confidence": 0.89,
      "based_on": ["logs/agent-sales.log", "docs/ventas.md"]
    }
  ]
}
```

### Feedback

```bash
POST /rag/feedback
{
  "suggestion_id": "sugg-001",
  "accepted": true,
  "result": "Tiempo de respuesta mejoró 40%"
}
```

---

## 🔄 FLUJO RAG

### 1. Read (Lectura)

```javascript
async function readSources(sources) {
  const documents = [];
  
  for (const source of sources) {
    if (source.type === 'file') {
      const content = await fs.readFile(source.path, 'utf8');
      documents.push({ source: source.path, content });
    } else if (source.type === 'github') {
      const content = await github.getRepoContent(source.repo);
      documents.push({ source: source.repo, content });
    } else if (source.type === 'database') {
      const content = await db.query(source.query);
      documents.push({ source: 'database', content });
    }
  }
  
  return documents;
}
```

### 2. Analyze (Análisis con IA)

```javascript
async function analyzeWithAI(documents) {
  const analysis = await ollama.generate({
    model: 'llama3.1:8b',
    prompt: `Analizá estos documentos y extraé patrones importantes:
    
    ${documents.map(d => d.content).join('\n---\n')}
    
    Patrones a buscar:
    - Mejores tiempos de respuesta
    - Errores frecuentes
    - Éxitos de conversión
    - Optimizaciones posibles`
  });
  
  return analysis.response;
}
```

### 3. Index (Indexado)

```javascript
async function indexDocuments(documents) {
  for (const doc of documents) {
    const embedding = await getEmbedding(doc.content);
    
    await supabase.from('rag_embeddings').insert({
      source: doc.source,
      content: doc.content,
      embedding: embedding,
      metadata: doc.metadata
    });
  }
}
```

### 4. Suggest (Sugerencias)

```javascript
async function generateSuggestions(analysis, agent) {
  const suggestions = [];
  
  // Analizar patrones y generar sugerencias
  if (analysis.includes('mejor respuesta 19:00')) {
    suggestions.push({
      type: 'node_update',
      node: 'whatsapp-responder',
      change: 'schedule_optimization',
      time: '19:00',
      confidence: 0.89
    });
  }
  
  if (analysis.includes('tasa conversión 5%')) {
    suggestions.push({
      type: 'node_add',
      after: 'landing',
      node: 'ai-qualifier',
      reason: 'Mejorar cualificación de leads',
      confidence: 0.76
    });
  }
  
  return suggestions;
}
```

---

## 📊 INTEGRACIÓN CON AGENTES

### Agente Consulta RAG

```yaml
# En blueprint.yml
rag:
  enabled: true
  auto_suggest: true
  sources:
    - docs/ventas.md
    - logs/agent-sales.log
    - history/conversiones.json
    
  query_on_node:
    - whatsapp-responder
    - payment
    
  apply_suggestions: auto  # auto, manual, disabled
```

### Ejemplo de Uso

```javascript
// Durante ejecución del agente
async function executeNode(node, context) {
  // Consultar RAG para mejorar decisión
  if (node.ragEnabled) {
    const ragData = await rag.query({
      query: `mejor estrategia para ${node.type}`,
      agent: context.agentName
    });
    
    // Aplicar sugerencias
    if (ragData.suggestions.length > 0) {
      context = applySuggestions(context, ragData.suggestions);
    }
  }
  
  // Ejecutar nodo con contexto mejorado
  return await executeWithEnhancedContext(node, context);
}
```

---

## 📈 KPIs DE RAG

| KPI | Tipo | Descripción |
|-----|------|-------------|
| `rag_query_count` | counter | Total de consultas RAG |
| `rag_suggestion_acceptance` | gauge | % de sugerencias aceptadas |
| `rag_improvement_rate` | gauge | Mejora en KPIs después de aplicar sugerencias |
| `rag_latency` | histogram | Tiempo de respuesta de consultas |

---

## 🎩🕹️🏎️💨🚀

```
╔══════════════════════════════════════════════╗
║  🧠 RAG LAYER - IMPLEMENTADA                 ║
╠══════════════════════════════════════════════╣
║  FUENTES: docs, repos, crm, logs, kpis       ║
║  PROCESAMIENTO: Read → Analyze → Index       ║
║  API: 4 endpoints                            ║
║  DB: Supabase Vector                         ║
║  IA: Ollama / MiniMax                        ║
╚══════════════════════════════════════════════╝

La RAG layer está definida.
Las fuentes están claras.
El procesamiento está especificado.
La Red trabaja.
YOSI arquitecto.
```

---

**ESTADO:** ✅ **RAG LAYER ESPECIFICADA**
