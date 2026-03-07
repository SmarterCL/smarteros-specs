#!/usr/bin/env node

import { StateMachine } from './core/state_machine';
import { MCPContract } from './types';

// Parsear argumentos de línea de comandos
const args = process.argv.slice(2);

async function runCLI() {
  if (args.length < 1) {
    console.log('Usage: smartermcp <command> [options]');
    console.log('Commands:');
    console.log('  exec <action> --tenant <tenant>    Execute an action for a tenant');
    console.log('  status <tenant>                   Get status of a tenant');
    console.log('  logs <tenant>                     View logs for a tenant');
    return;
  }

  const command = args[0];

  switch (command) {
    case 'exec':
      await handleExecCommand(args.slice(1));
      break;
    case 'status':
      await handleStatusCommand(args.slice(1));
      break;
    case 'logs':
      await handleLogsCommand(args.slice(1));
      break;
    default:
      console.log(`Unknown command: ${command}`);
      break;
  }
}

async function handleExecCommand(args: string[]) {
  if (args.length < 1) {
    console.log('Usage: smartermcp exec <action> --tenant <tenant>');
    return;
  }

  const action = args[0];
  const tenantIndex = args.indexOf('--tenant');
  if (tenantIndex === -1 || !args[tenantIndex + 1]) {
    console.log('Usage: smartermcp exec <action> --tenant <tenant>');
    return;
  }
  const tenant = args[tenantIndex + 1];

  // Crear contrato MCP
  const contract: MCPContract = {
    tenant,
    action,
    context: {
      env: 'production', // Por defecto, podría ser pasado como parámetro
      metadata: {}
    }
  };

  console.log(`Executing action: ${action} for tenant: ${tenant}`);
  
  // Crear máquina de estados y procesar el contrato
  const stateMachine = new StateMachine();
  const result = await stateMachine.process(contract);
  
  console.log(`Execution result:`, result);
}

async function handleStatusCommand(args: string[]) {
  if (args.length < 1) {
    console.log('Usage: smartermcp status <tenant>');
    return;
  }

  const tenant = args[0];
  console.log(`Getting status for tenant: ${tenant}`);
  
  // Aquí iría la lógica para obtener el estado del tenant
  console.log(`Status for ${tenant}: active`);
}

async function handleLogsCommand(args: string[]) {
  if (args.length < 1) {
    console.log('Usage: smartermcp logs <tenant>');
    return;
  }

  const tenant = args[0];
  console.log(`Viewing logs for tenant: ${tenant}`);
  
  // Aquí iría la lógica para mostrar los logs del tenant
  console.log(`Logs for ${tenant}: [No logs available yet]`);
}

// Ejecutar el CLI
runCLI().catch(error => {
  console.error('Error running CLI:', error);
  process.exit(1);
});