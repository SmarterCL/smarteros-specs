#!/usr/bin/env node
/**
 * SmarterOS Blueprint Factory v4
 * Factory para crear y desplegar empresas desde blueprints
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PLATFORM_DIR = process.env.SMARTER_PLATFORM_DIR || path.join(process.cwd(), 'smarter-platform');
const BLUEPRINTS_DIR = path.join(PLATFORM_DIR, 'blueprints');
const AGENTS_DIR = path.join(PLATFORM_DIR, 'agents');
const SERVICES_DIR = path.join(PLATFORM_DIR, 'services');

// Blueprint Factory
class BlueprintFactory {
  constructor() {
    this.availableBlueprints = [];
  }

  // Listar blueprints disponibles
  async listBlueprints() {
    console.log('📋 Blueprints disponibles:\n');
    
    if (!fs.existsSync(BLUEPRINTS_DIR)) {
      console.log('  No hay blueprints disponibles.');
      return;
    }
    
    const blueprints = fs.readdirSync(BLUEPRINTS_DIR);
    
    for (const bp of blueprints) {
      const bpPath = path.join(BLUEPRINTS_DIR, bp);
      if (fs.statSync(bpPath).isDirectory()) {
        const blueprint = await this.loadBlueprint(bp);
        console.log(`  📐 ${bp}`);
        console.log(`     Agentes: ${blueprint.agents?.length || 0}`);
        console.log(`     Skills: ${blueprint.skills?.length || 0}`);
        console.log(`     Servicios: ${blueprint.services?.length || 0}`);
        console.log('');
      }
    }
  }

  // Cargar blueprint
  async loadBlueprint(name) {
    const blueprintPath = path.join(BLUEPRINTS_DIR, name, 'blueprint.yml');
    
    if (!fs.existsSync(blueprintPath)) {
      throw new Error(`Blueprint no encontrado: ${name}`);
    }
    
    const content = fs.readFileSync(blueprintPath, 'utf8');
    return this.parseYAML(content);
  }

  // Deploy de blueprint
  async deploy(blueprintName, options = {}) {
    console.log(`🚀 Desplegando blueprint: ${blueprintName}\n`);
    
    // Cargar blueprint
    const blueprint = await this.loadBlueprint(blueprintName);
    
    console.log(`📋 Blueprint: ${blueprint.name || blueprintName}`);
    console.log(`📝 Descripción: ${blueprint.description || 'N/A'}`);
    console.log('');
    
    // Crear agentes
    if (blueprint.agents) {
      console.log('🤖 Creando agentes...');
      for (const agentName of blueprint.agents) {
        await this.createAgent(agentName, blueprint);
      }
      console.log('');
    }
    
    // Conectar servicios
    if (blueprint.services) {
      console.log('🔌 Conectando servicios...');
      for (const serviceName of blueprint.services) {
        await this.connectService(serviceName);
      }
      console.log('');
    }
    
    // Configurar skills
    if (blueprint.skills) {
      console.log('⚙️  Configurando skills...');
      for (const skillName of blueprint.skills) {
        await this.configureSkill(skillName);
      }
      console.log('');
    }
    
    // Iniciar flujos
    if (blueprint.flows) {
      console.log('📊 Iniciando flujos...');
      for (const flowName of blueprint.flows) {
        await this.startFlow(flowName);
      }
      console.log('');
    }
    
    console.log('✅ Blueprint desplegado exitosamente');
    console.log('');
    console.log('Próximos pasos:');
    console.log(`  1. smarter agent run ${blueprintName}`);
    console.log(`  2. smarter agent status ${blueprintName}`);
    console.log(`  3. smarter logs ${blueprintName}`);
  }

  // Crear agente
  async createAgent(agentName, blueprint) {
    const agentDir = path.join(AGENTS_DIR, agentName);
    
    if (!fs.existsSync(agentDir)) {
      fs.mkdirSync(agentDir, { recursive: true });
      
      // Crear config del agente
      const config = {
        name: agentName,
        blueprint: blueprint.name,
        created_at: new Date().toISOString(),
        status: 'active'
      };
      
      fs.writeFileSync(
        path.join(agentDir, 'config.json'),
        JSON.stringify(config, null, 2)
      );
      
      console.log(`  ✅ Agente creado: ${agentName}`);
    } else {
      console.log(`  ℹ️  Agente ya existe: ${agentName}`);
    }
  }

  // Conectar servicio
  async connectService(serviceName) {
    console.log(`  🔌 Conectando servicio: ${serviceName}`);
    // En producción: conectar a APIs reales
  }

  // Configurar skill
  async configureSkill(skillName) {
    console.log(`  ⚙️  Configurando skill: ${skillName}`);
    // En producción: configurar credenciales
  }

  // Iniciar flujo
  async startFlow(flowName) {
    console.log(`  📊 Iniciando flujo: ${flowName}`);
    // En producción: iniciar workflow en n8n
  }

  // Parse YAML simple
  parseYAML(content) {
    const result = {};
    const lines = content.split('\n');
    let currentSection = null;
    
    for (const line of lines) {
      if (line.trim() && !line.startsWith('#')) {
        if (line.includes(':') && !line.startsWith(' ')) {
          const [key, value] = line.split(':').map(s => s.trim());
          if (value) {
            result[key] = value.replace(/"/g, '');
          } else {
            currentSection = key;
            result[key] = [];
          }
        } else if (line.trim().startsWith('-') && currentSection) {
          result[currentSection].push(line.trim().substring(1).trim());
        }
      }
    }
    
    return result;
  }
}

// Comandos CLI
const commands = {
  list: async () => {
    const factory = new BlueprintFactory();
    await factory.listBlueprints();
  },
  
  deploy: async (blueprintName) => {
    if (!blueprintName) {
      console.error('❌ Error: Nombre de blueprint requerido');
      console.log('Uso: smarter blueprint deploy <blueprint-name>');
      process.exit(1);
    }
    
    const factory = new BlueprintFactory();
    
    try {
      await factory.deploy(blueprintName);
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    }
  },
  
  create: (blueprintName) => {
    console.log(`📐 Creando blueprint: ${blueprintName}\n`);
    
    const blueprintDir = path.join(BLUEPRINTS_DIR, blueprintName);
    fs.mkdirSync(blueprintDir, { recursive: true });
    
    const blueprintYaml = `# Blueprint: ${blueprintName}
blueprint:
  name: ${blueprintName}
  version: 1.0.0
  description: Blueprint creado con SmarterOS Factory
  
  agents:
    - sales-agent
    - crm-agent
    
  services:
    - payments/mercadopago
    - messaging/telegram
    
  skills:
    - create_invoice
    - charge_payment
    - send_notification
    
  flows:
    - checkout
    - onboarding
`;
    
    fs.writeFileSync(path.join(blueprintDir, 'blueprint.yml'), blueprintYaml);
    
    console.log(`✅ Blueprint creado en: ${blueprintDir}`);
    console.log('');
    console.log('Próximos pasos:');
    console.log(`  1. Editar: ${path.join(blueprintDir, 'blueprint.yml')}`);
    console.log(`  2. Deploy: smarter blueprint deploy ${blueprintName}`);
  },
  
  help: () => {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║     SMARTER BLUEPRINT FACTORY - Ayuda                    ║
╚══════════════════════════════════════════════════════════╝

USO:
  smarter blueprint <comando> [opciones]

COMANDOS:
  list                 Listar blueprints disponibles
  deploy <name>        Desplegar blueprint (crear empresa)
  create <name>        Crear nuevo blueprint
  help                 Mostrar esta ayuda

EJEMPLOS:
  smarter blueprint list
  smarter blueprint deploy ecommerce
  smarter blueprint create mi-startup

DOCUMENTACIÓN:
  https://docs.smarterbot.cl/blueprints
`);
  }
};

// Parsear argumentos
const args = process.argv.slice(2);
const command = args[0];
const blueprintName = args[1];

// Ejecutar comando
if (commands[command]) {
  commands[command](blueprintName);
} else {
  commands.help();
}
