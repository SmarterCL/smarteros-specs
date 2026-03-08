#!/usr/bin/env node
/**
 * SmarterOS Agent Runtime v4
 * Motor de ejecución de agentes empresariales
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PLATFORM_DIR = process.env.SMARTER_PLATFORM_DIR || path.join(process.cwd(), 'smarter-platform');
const AGENTS_DIR = path.join(PLATFORM_DIR, 'agents');
const BLUEPRINTS_DIR = path.join(PLATFORM_DIR, 'blueprints');
const SKILLS_DIR = path.join(PLATFORM_DIR, 'core', 'skills');

// Estado del agente
class AgentRuntime {
  constructor(agentName) {
    this.agentName = agentName;
    this.status = 'INITIALIZING';
    this.mcpEndpoint = process.env.MCP_ENDPOINT || 'http://localhost:3051';
    this.skills = [];
    this.blueprint = null;
  }

  // Inicializar agente
  async initialize() {
    console.log(`🤖 Inicializando agente: ${this.agentName}`);
    
    // Cargar blueprint
    this.blueprint = await this.loadBlueprint();
    
    // Cargar skills
    this.skills = await this.loadSkills();
    
    // Conectar MCP
    await this.connectMCP();
    
    this.status = 'READY';
    console.log(`✅ Agente ${this.agentName} listo`);
  }

  // Cargar blueprint
  async loadBlueprint() {
    const blueprintPath = path.join(BLUEPRINTS_DIR, this.agentName, 'blueprint.yml');
    
    if (!fs.existsSync(blueprintPath)) {
      throw new Error(`Blueprint no encontrado: ${this.agentName}`);
    }
    
    const content = fs.readFileSync(blueprintPath, 'utf8');
    // Parse YAML (en producción usar js-yaml)
    return this.parseYAML(content);
  }

  // Cargar skills
  async loadSkills() {
    const skillNames = this.blueprint?.skills || [];
    const loadedSkills = [];
    
    for (const skillName of skillNames) {
      const skillPath = path.join(SKILLS_DIR, `${skillName}.js`);
      
      if (fs.existsSync(skillPath)) {
        const skill = require(skillPath);
        loadedSkills.push({ name: skillName, module: skill });
        console.log(`  ✅ Skill cargada: ${skillName}`);
      } else {
        console.warn(`  ⚠️  Skill no encontrada: ${skillName}`);
      }
    }
    
    return loadedSkills;
  }

  // Conectar MCP
  async connectMCP() {
    console.log(`  📡 Conectando MCP: ${this.mcpEndpoint}`);
    
    try {
      const response = await fetch(`${this.mcpEndpoint}/health`);
      const data = await response.json();
      
      if (data.status === 'ok') {
        console.log(`  ✅ MCP conectado`);
      } else {
        throw new Error('MCP no responde correctamente');
      }
    } catch (error) {
      console.warn(`  ⚠️  MCP no disponible: ${error.message}`);
    }
  }

  // Ejecutar skill
  async executeSkill(skillName, params) {
    const skill = this.skills.find(s => s.name === skillName);
    
    if (!skill) {
      throw new Error(`Skill no encontrada: ${skillName}`);
    }
    
    console.log(`  ⚙️  Ejecutando skill: ${skillName}`);
    
    try {
      const result = await skill.module.execute(params);
      console.log(`  ✅ Skill completada: ${skillName}`);
      return result;
    } catch (error) {
      console.error(`  ❌ Skill falló: ${skillName} - ${error.message}`);
      throw error;
    }
  }

  // Ejecutar flujo completo
  async run() {
    console.log(`\n🚀 Ejecutando agente: ${this.agentName}`);
    console.log(`📋 Blueprint: ${this.blueprint?.name || 'N/A'}`);
    
    this.status = 'RUNNING';
    
    // Ejecutar nodos del blueprint
    if (this.blueprint?.nodes) {
      for (const node of this.blueprint.nodes) {
        console.log(`\n📍 Nodo: ${node.id}`);
        
        if (node.skill) {
          await this.executeSkill(node.skill, node.params || {});
        }
      }
    }
    
    this.status = 'COMPLETED';
    console.log(`\n✅ Agente completado`);
  }

  // Parse YAML simple
  parseYAML(content) {
    // Implementación simple (en producción usar js-yaml)
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
  run: async (agentName) => {
    if (!agentName) {
      console.error('❌ Error: Nombre de agente requerido');
      console.log('Uso: smarter agent run <agent-name>');
      process.exit(1);
    }
    
    const runtime = new AgentRuntime(agentName);
    
    try {
      await runtime.initialize();
      await runtime.run();
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    }
  },
  
  list: () => {
    console.log('🤖 Agentes disponibles:\n');
    
    if (!fs.existsSync(AGENTS_DIR)) {
      console.log('  No hay agentes creados.');
      return;
    }
    
    const agents = fs.readdirSync(AGENTS_DIR);
    
    agents.forEach(agent => {
      const agentPath = path.join(AGENTS_DIR, agent);
      if (fs.statSync(agentPath).isDirectory()) {
        console.log(`  🤖 ${agent}`);
      }
    });
  },
  
  status: async (agentName) => {
    console.log(`📊 Estado del agente: ${agentName}\n`);
    
    const runtime = new AgentRuntime(agentName);
    console.log(`Nombre: ${runtime.agentName}`);
    console.log(`Estado: ${runtime.status}`);
    console.log(`MCP Endpoint: ${runtime.mcpEndpoint}`);
    console.log(`Skills: ${runtime.skills.length}`);
  },
  
  help: () => {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║     SMARTER AGENT RUNTIME - Ayuda                        ║
╚══════════════════════════════════════════════════════════╝

USO:
  smarter agent <comando> [opciones]

COMANDOS:
  run <agent>      Ejecutar agente
  list             Listar agentes disponibles
  status <agent>   Ver estado del agente
  help             Mostrar esta ayuda

EJEMPLOS:
  smarter agent run ventas
  smarter agent list
  smarter agent status ventas

DOCUMENTACIÓN:
  https://docs.smarterbot.cl/agents
`);
  }
};

// Parsear argumentos
const args = process.argv.slice(2);
const command = args[0];
const agentName = args[1];

// Ejecutar comando
if (commands[command]) {
  commands[command](agentName);
} else {
  commands.help();
}
