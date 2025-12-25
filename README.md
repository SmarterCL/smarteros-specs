# SmarterOS OpenSpec v2 - Multimodal Specifications

OpenSpec v2 contracts for the SmarterOS platform with multimodal AI capabilities and GLM-4.6V integration. This repository contains the source of truth for all entities, endpoints, events, validations, and AI-powered ingestion in the system.

## 🎯 New in v2: Multimodal Support

OpenSpec v2 introduces full multimodal capabilities:

- **Images, Documents, Audio, Video** ingestion and processing
- **GLM-4.6V AI integration** for content analysis
- **Auto-extraction** of text, metadata, and insights
- **Multimodal validation** and processing
- **AI-powered scouts** for intelligent data discovery

## 📁 Structure

```
specs/
├── ach/              # ACHS integration specifications
│   └── validate.yaml          # ACHS validation and certification
├── suseso/           # SUSESO integration specifications
│   └── reportar_suceso.yaml   # Labor incident reporting
├── smarteros/        # Core business entities with multimodal support
│   ├── customers.v2.yaml      # Customer with avatar/documents
│   ├── orders.v2.yaml         # Orders with attachments/images
│   ├── rut.yaml
│   └── events.yaml
├── mcp/              # MCP entities with multimodal capabilities
│   ├── agent.v2.yaml          # AI-analyzer agents
│   ├── ingestion.v2.yaml      # Multimodal ingestion
│   ├── runtime.yaml
│   └── scout.v2.yaml          # AI-powered scouts
└── tenant/           # Multi-tenant isolation
    └── tenant.yaml

skills/
├── voz/              # Vocal health prevention skills
│   ├── evaluar_riesgo_vocal.yaml  # Vocal risk assessment
│   └── monitoreo_preventivo.yaml # Preventive monitoring
└── index.json         # Skills catalog and integration points

docs/
├── V3-STABLE-DEFINITION.md       # v3 Design Freeze definition
├── BLUEPRINT-EJECUCION-V3.md      # Executable contract blueprint
├── SMARTEROS-VOZ-INTEGRATION.md   # Complete integration guide
├── IMPLEMENTATION-SUMMARY.md      # Implementation overview
└── COMPLETION-REPORT.md           # Completion report
```

## 🚀 Multimodal Features

### Supported Content Types
- **Text**: Traditional text processing
- **Image**: JPG, PNG, WEBP, GIF with visual analysis
- **Document**: PDF, DOC, DOCX, XLS with text extraction
- **URL**: Web content scraping and analysis  
- **Audio**: MP3, WAV with speech-to-text
- **Video**: MP4, MOV with content analysis
- **File**: ZIP, RAR with virus scanning

### AI Integration (GLM-4.6V)
- **Visual Analysis**: Object detection, content classification
- **Document Analysis**: Text extraction, structured data
- **Content Summarization**: Automatic content summarization
- **Sentiment Analysis**: Text and audio sentiment
- **Intent Classification**: Understanding user intent
- **Confidence Scoring**: AI confidence levels 0.0-1.0

## 🏗️ Specification Format v2

Each v2 spec file includes the new `ingestion` section for multimodal support:

```yaml
entity: entity_name
description: "Entity description"
tenant_isolated: true
fields:
  field_name:
    type: string/image/document/url/audio/video/file
    required: true/false
    unique: true/false
    description: "Field description"
ingestion:
  multimodal:
    enabled: true
    supported_types: ["image", "document", "url", "audio", "video", "file"]
    ai_processors:
      - type: "image"
        action: "visual_analysis"
        ai_model: "glm-4.6v"
events:
  event_name:
    description: "Event description"
    payload:
      - field1
      - field2
validation:
  rules:
    - field: field_name
      type: validation_type
      required: true
```

## 🤝 Contributing

When adding new multimodal entities or modifying existing ones:
1. Update the appropriate v2 spec file with multimodal support
2. Include ingestion configuration for AI processing
3. Run validation: `./validate.sh`
4. Generate new code: `openspec generate --target mcp --out ../smarteros-mcp/generated`
5. Update documentation if needed

### Adding New Skills

To add executable skills:
1. Create skill specification in `skills/[category]/[skill].yaml`
2. Follow OpenSpec skill format
3. Add to `skills/index.json`
4. Implement in MCP runtime
5. Update integration documentation

### Institutional Integrations

For ACHS/SUSESO integrations:
1. Create spec in `specs/[institution]/[function].yaml`
2. Define API contracts and events
3. Implement security and compliance rules
4. Add to integration blueprint

## 🌐 Marketplace Ready

This multimodal architecture enables SmarterBOT.store to offer:
- **AI-powered automation** bundles
- **Visual content processing** workflows
- **Document analysis** tools
- **Auto-generated insights** modules
- **Real-time AI** capabilities

### Institutional Capabilities

SmarterOS v3 now provides:
- **ACHS integration** for occupational health
- **SUSESO reporting** for labor incidents
- **Vocal health prevention** skills
- **Contractual blueprints** for formal agreements
- **Audit-ready operations** with full traceability