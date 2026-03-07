#!/usr/bin/env node
/**
 * Smarter CLI - Main Entry Point
 * SmarterOS v4
 */

const { execSync } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const command = args[0];
const subcommand = args[1];

const CLI_DIR = __dirname;

const commands = {
  agent: () => {
    execSync(`node ${path.join(CLI_DIR, 'agent.js')} ${args.slice(1).join(' ')}`, { stdio: 'inherit' });
  },
  blueprint: () => {
    execSync(`node ${path.join(CLI_DIR, 'blueprint.js')} ${args.slice(1).join(' ')}`, { stdio: 'inherit' });
  },
  factory: () => {
    execSync(`node ${path.join(CLI_DIR, 'factory.js')} ${args.slice(1).join(' ')}`, { stdio: 'inherit' });
  },
  deploy: () => {
    execSync(`node ${path.join(CLI_DIR, 'deploy.js')} ${args.slice(1).join(' ')}`, { stdio: 'inherit' });
  },
  health: () => {
    execSync(`node ${path.join(CLI_DIR, 'health.js')} ${args.slice(1).join(' ')}`, { stdio: 'inherit' });
  },
  ui: () => {
    console.log('🎨 Abriendo Visual CAD...');
    console.log('URL: https://draw.smarterbot.cl');
    execSync('open https://draw.smarterbot.cl', { stdio: 'inherit' });
  },
  version: () => {
    console.log('Smarter CLI v4.0.0');
  },
  help: () => {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║     SMARTER CLI - SmarterOS v4                           ║
╚══════════════════════════════════════════════════════════╝

USO:
  smarter <comando> [subcomando] [opciones]

COMANDOS:
  agent               Gestionar agentes
  blueprint           Gestionar blueprints
  factory             Fábrica de agentes
  deploy              Desplegar a producción
  health              Verificar estado del sistema
  ui                  Abrir Visual CAD (draw.smarterbot.cl)
  version             Mostrar versión
  help                Mostrar esta ayuda

EJEMPLOS:
  smarter agent create ventas
  smarter blueprint list
  smarter blueprint validate ventas
  smarter factory view
  smarter deploy --target vps
  smarter health
  smarter ui

DOCUMENTACIÓN:
  https://docs.smarterbot.cl/cli
`);
  }
};

if (commands[command]) {
  commands[command]();
} else {
  commands.help();
}
