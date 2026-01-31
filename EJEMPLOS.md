# Ejemplos de uso de SmarterMCP

## Ejecución de acciones

### Desde CLI
```bash
# Ejecutar una acción de SSL para Cloudflare
smartermcp exec cloudflare.ssl.full_strict --tenant maestroya

# Crear un tenant en Odoo
smartermcp exec odoo.create_tenant --tenant maestroya

# Crear un checkout de comercio
smartermcp exec commerce.create_checkout --tenant maestroya
```

## Desde código

### Ejemplo completo de uso
```typescript
import { StateMachine } from './core/state_machine';
import { MCPContract } from './types';

async function executeMCPAction() {
  // Definir el contrato MCP
  const contract: MCPContract = {
    tenant: 'maestroya',
    action: 'cloudflare.ssl.full_strict',
    context: {
      env: 'production',
      metadata: {
        zone: 'example.com'
      }
    }
  };

  // Crear instancia de la máquina de estados
  const stateMachine = new StateMachine();

  // Procesar el contrato
  const result = await stateMachine.process(contract);

  // Manejar el resultado
  if (result.state === 'COMPLETE') {
    console.log('Acción completada exitosamente:', result.result);
  } else {
    console.error('Error en la ejecución:', result.error);
  }
}

executeMCPAction();
```

## Acciones disponibles

### Cloudflare
- `cloudflare.ssl.full_strict` - Establecer modo SSL estricto
- `cloudflare.ssl.disable_flexible` - Deshabilitar modo flexible
- `cloudflare.headers.security` - Configurar headers de seguridad
- `cloudflare.rate_limit.basic` - Configurar rate limiting básico

### Odoo
- `odoo.create_db` - Crear base de datos para tenant
- `odoo.enable_webstore` - Habilitar tienda web
- `odoo.create_product` - Crear producto
- `odoo.link_subscription` - Vincular suscripción

### Comercio
- `commerce.create_checkout` - Crear proceso de checkout
- `commerce.verify_payment` - Verificar pago
- `commerce.unlock_features` - Desbloquear funcionalidades

## Estados posibles

- `INIT` - Estado inicial
- `SAFE-BLOCK` - Estado seguro (por defecto)
- `EXECUTE` - Estado de ejecución
- `COMPLETE` - Estado de finalización exitosa
- `ROLLBACK` - Estado de reversión por error

## Validaciones realizadas

Antes de ejecutar cualquier acción, el sistema realiza las siguientes validaciones:

1. Existencia del tenant
2. Estado activo de la suscripción
3. Vigencia de la política MCP-SEC-001
4. Presencia de secretos requeridos
5. Alcanzabilidad del proveedor destino

## Inyección de secretos

Los secretos se inyectan automáticamente según el proveedor:

### Cloudflare
- `CF_API_TOKEN`
- `CF_ACCOUNT_ID`
- `CF_ZONE_ID`

### Odoo
- `ODOO_ADMIN_TOKEN`
- `ODOO_MASTER_DB`
- `ODOO_HOST`

### n8n
- `N8N_API_KEY`
- `N8N_HOST`

Los secretos se inyectan solo durante la ejecución y se eliminan al finalizar.