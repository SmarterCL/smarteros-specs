import { StateMachineContext } from './state_machine';

export interface SecretInjectorOptions {
  vaultEndpoint?: string;
  tenantId: string;
  provider: string;
}

export class SecretInjector {
  private vaultEndpoint: string;

  constructor(options: SecretInjectorOptions) {
    this.vaultEndpoint = options.vaultEndpoint || process.env.VAULT_ENDPOINT || 'http://vault-mcp:3003';
  }

  async injectSecrets(context: StateMachineContext): Promise<void> {
    const { contract } = context;
    const provider = contract.action.split('.')[0]; // Extraer proveedor de la acción
    
    // Obtener secretos del vault para el tenant y proveedor específicos
    const secrets = await this.fetchSecretsFromVault(contract.tenant, provider);
    
    // Inyectar los secretos en el contexto y en el entorno
    if (secrets) {
      context.secrets = secrets;
      
      // Inyectar en variables de entorno para uso durante la ejecución
      for (const [key, value] of Object.entries(secrets)) {
        process.env[key] = value;
      }
    }
  }

  async removeSecrets(context: StateMachineContext): Promise<void> {
    // Remover los secretos del entorno después de la ejecución
    if (context.secrets) {
      for (const key of Object.keys(context.secrets)) {
        delete process.env[key];
      }
      context.secrets = undefined;
    }
  }

  private async fetchSecretsFromVault(tenantId: string, provider: string): Promise<Record<string, string>> {
    // En una implementación real, esto haría una llamada HTTP al servicio de Vault
    // Por ahora simulamos la recuperación de secretos desde Supabase o sistema similar
    
    // Simular diferentes conjuntos de secretos según el proveedor
    switch (provider) {
      case 'cloudflare':
        return {
          'CF_API_TOKEN': process.env.CF_API_TOKEN || 'fake_cf_token',
          'CF_ACCOUNT_ID': process.env.CF_ACCOUNT_ID || 'fake_cf_account_id',
          'CF_ZONE_ID': process.env.CF_ZONE_ID || 'fake_cf_zone_id'
        };
      case 'odoo':
        return {
          'ODOO_ADMIN_TOKEN': process.env.ODOO_ADMIN_TOKEN || 'fake_odoo_token',
          'ODOO_MASTER_DB': process.env.ODOO_MASTER_DB || 'fake_odoo_master_db',
          'ODOO_HOST': process.env.ODOO_HOST || 'fake_odoo_host'
        };
      case 'n8n':
        return {
          'N8N_API_KEY': process.env.N8N_API_KEY || 'fake_n8n_key',
          'N8N_HOST': process.env.N8N_HOST || 'fake_n8n_host'
        };
      default:
        return {};
    }
  }
}