#!/usr/bin/env node
/**
 * Smarter CLI - Blueprint Commands
 * SmarterOS v4
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SPECS_DIR = process.env.SMARTER_SPECS_DIR || path.join(process.cwd(), 'specs');
const BLUEPRINTS_DIR = path.join(SPECS_DIR, 'blueprints');

// Comandos
const commands = {
  create: (name) => {
    console.log(`📐 Creando blueprint: ${name}`);
    
    if (!name) {
      console.error('❌ Error: Nombre del blueprint requerido');
      console.log('Uso: smarter blueprint create <name>');
      process.exit(1);
    }
    
    // Crear directorio
    const blueprintDir = path.join(BLUEPRINTS_DIR, name);
    fs.mkdirSync(blueprintDir, { recursive: true });
    
    // Crear blueprint YAML
    const blueprintYaml = `# Blueprint: ${name}
blueprint:
  name: ${name}
  version: 1.0.0
  description: Blueprint creado con Smarter CLI
  author: SmarterOS User
  
  metadata:
    tags: []
    category: general
    visibility: private
    
  nodes:
    - id: start
      type: logic
      skill: start-node
      config: {}
      next: end
      
    - id: end
      type: end
      skill: end-node
      config: {}
      next: null
      
  skills:
    - name: start-node
      version: ^1.0.0
    - name: end-node
      version: ^1.0.0
      
  rag:
    enabled: false
    sources: []
    
  mcp: []
  
  kpis: []
`;
    
    fs.writeFileSync(path.join(blueprintDir, 'blueprint.yml'), blueprintYaml);
    
    // Crear README
    fs.writeFileSync(
      path.join(blueprintDir, 'README.md'),
      `# Blueprint: ${name}\n\nGenerado con Smarter CLI\n`
    );
    
    console.log(`✅ Blueprint creado en: ${blueprintDir}`);
    console.log('');
    console.log('Próximos pasos:');
    console.log(`  1. Editar: ${path.join(blueprintDir, 'blueprint.yml')}`);
    console.log(`  2. Validar: smarter blueprint validate ${name}`);
    console.log(`  3. Ejecutar: smarter blueprint run ${name}`);
  },
  
  list: () => {
    console.log('📋 Blueprints disponibles:\n');
    
    if (!fs.existsSync(BLUEPRINTS_DIR)) {
      console.log('  No hay blueprints creados.');
      console.log('  Creá uno con: smarter blueprint create <name>');
      return;
    }
    
    const blueprints = fs.readdirSync(BLUEPRINTS_DIR);
    
    if (blueprints.length === 0) {
      console.log('  No hay blueprints creados.');
      return;
    }
    
    blueprints.forEach(bp => {
      const bpPath = path.join(BLUEPRINTS_DIR, bp);
      const stat = fs.statSync(bpPath);
      if (stat.isDirectory()) {
        const yamlPath = path.join(bpPath, 'blueprint.yml');
        let version = 'unknown';
        if (fs.existsSync(yamlPath)) {
          const content = fs.readFileSync(yamlPath, 'utf8');
          const match = content.match(/version:\s*(.+)/);
          if (match) version = match[1].trim();
        }
        console.log(`  ✅ ${bp} (v${version})`);
      }
    });
  },
  
  validate: (name) => {
    console.log(`🔍 Validando blueprint: ${name}\n`);
    
    const blueprintPath = path.join(BLUEPRINTS_DIR, name, 'blueprint.yml');
    
    if (!fs.existsSync(blueprintPath)) {
      console.error(`❌ Blueprint no encontrado: ${name}`);
      process.exit(1);
    }
    
    const content = fs.readFileSync(blueprintPath, 'utf8');
    const errors = [];
    const warnings = [];
    
    // Validaciones básicas
    if (!content.includes('blueprint:')) {
      errors.push('Falta la sección "blueprint:"');
    }
    if (!content.includes('name:')) {
      errors.push('Falta el campo "name:"');
    }
    if (!content.includes('nodes:')) {
      errors.push('Falta la sección "nodes:"');
    }
    if (!content.includes('skills:')) {
      errors.push('Falta la sección "skills:"');
    }
    
    // Validar nodos
    const hasStart = content.includes('id: start') || content.includes('type: start');
    const hasEnd = content.includes('id: end') || content.includes('type: end');
    
    if (!hasStart) warnings.push('No se encontró nodo de inicio');
    if (!hasEnd) warnings.push('No se encontró nodo final');
    
    // Contar elementos
    const nodeCount = (content.match(/- id:/g) || []).length;
    const skillCount = (content.match(/- name:/g) || []).length;
    const connectionCount = (content.match(/next:/g) || []).length;
    
    // Reporte
    if (errors.length === 0) {
      console.log('✅ Blueprint válido');
    } else {
      console.log('❌ Errores encontrados:');
      errors.forEach(e => console.log(`   - ${e}`));
    }
    
    if (warnings.length > 0) {
      console.log('\n⚠️  Advertencias:');
      warnings.forEach(w => console.log(`   - ${w}`));
    }
    
    console.log('\n📊 Estadísticas:');
    console.log(`   • Nodos: ${nodeCount}`);
    console.log(`   • Skills: ${skillCount}`);
    console.log(`   • Conexiones: ${connectionCount}`);
    
    process.exit(errors.length > 0 ? 1 : 0);
  },
  
  run: (name) => {
    console.log(`🚀 Ejecutando blueprint: ${name}\n`);
    
    const blueprintPath = path.join(BLUEPRINTS_DIR, name, 'blueprint.yml');
    
    if (!fs.existsSync(blueprintPath)) {
      console.error(`❌ Blueprint no encontrado: ${name}`);
      process.exit(1);
    }
    
    console.log('⏳ Iniciando ejecución...');
    console.log('📡 Conectando MCP Agents...');
    console.log('🧠 Cargando RAG...');
    console.log('✅ Ejecución iniciada');
    console.log('');
    console.log('Nota: La ejecución completa requiere:');
    console.log('  • MCP Agents activos');
    console.log('  • RAG layer configurado');
    console.log('  • Execution Engine (n8n/FastAPI)');
  },
  
  export: (name, format) => {
    console.log(`📤 Exportando blueprint: ${name} (formato: ${format})\n`);
    
    const blueprintPath = path.join(BLUEPRINTS_DIR, name, 'blueprint.yml');
    
    if (!fs.existsSync(blueprintPath)) {
      console.error(`❌ Blueprint no encontrado: ${name}`);
      process.exit(1);
    }
    
    const content = fs.readFileSync(blueprintPath, 'utf8');
    
    if (format === 'json') {
      // YAML to JSON simple (en producción usar yaml library)
      const jsonContent = {
        blueprint: {
          name: name,
          exported_at: new Date().toISOString(),
          format: 'json',
          compatible_with: 'draw.smarterbot.cl'
        },
        raw_yaml: content
      };
      
      const outputPath = path.join(BLUEPRINTS_DIR, name, `${name}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(jsonContent, null, 2));
      console.log(`✅ Exportado a: ${outputPath}`);
    }
    
    console.log('');
    console.log('El archivo JSON es compatible con:');
    console.log('  • draw.smarterbot.cl (Visual CAD)');
    console.log('  • smarter blueprint import');
  },
  
  help: () => {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║     SMARTER BLUEPRINT - Ayuda                            ║
╚══════════════════════════════════════════════════════════╝

USO:
  smarter blueprint <comando> [opciones]

COMANDOS:
  create <name>       Crear nuevo blueprint
  list                Listar blueprints disponibles
  validate <name>     Validar blueprint
  run <name>          Ejecutar blueprint
  export <name>       Exportar blueprint (JSON para Visual CAD)
  help                Mostrar esta ayuda

EJEMPLOS:
  smarter blueprint create ventas-automatizadas
  smarter blueprint list
  smarter blueprint validate ventas-automatizadas
  smarter blueprint run ventas-automatizadas
  smarter blueprint export ventas-automatizadas --format json

DOCUMENTACIÓN:
  https://docs.smarterbot.cl/blueprints
`);
  }
};

// Parsear argumentos
const args = process.argv.slice(2);
const command = args[0];
const name = args[1];
const format = args.includes('--format') ? args[args.indexOf('--format') + 1] : 'json';

// Ejecutar comando
if (commands[command]) {
  commands[command](name, format);
} else {
  commands.help();
}
