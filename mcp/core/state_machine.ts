import { MCPContract } from '../types';
import { PolicyValidator } from './policy_validator';

export enum MCPState {
  INIT = 'INIT',
  SAFE_BLOCK = 'SAFE-BLOCK',
  EXECUTE = 'EXECUTE',
  COMPLETE = 'COMPLETE',
  ROLLBACK = 'ROLLBACK'
}

export interface StateMachineContext {
  contract: MCPContract;
  secrets?: Record<string, string>;
  error?: string;
}

export class StateMachine {
  private currentState: MCPState = MCPState.INIT;
  private policyValidator: PolicyValidator;

  constructor(initialState: MCPState = MCPState.INIT) {
    this.currentState = initialState;
    this.policyValidator = new PolicyValidator();
  }

  getState(): MCPState {
    return this.currentState;
  }

  async transition(from: MCPState, to: MCPState, context: StateMachineContext): Promise<boolean> {
    const validTransitions: Record<MCPState, MCPState[]> = {
      [MCPState.INIT]: [MCPState.SAFE_BLOCK],
      [MCPState.SAFE_BLOCK]: [MCPState.EXECUTE, MCPState.ROLLBACK],
      [MCPState.EXECUTE]: [MCPState.COMPLETE, MCPState.ROLLBACK],
      [MCPState.COMPLETE]: [MCPState.SAFE_BLOCK],
      [MCPState.ROLLBACK]: [MCPState.SAFE_BLOCK]
    };

    if (validTransitions[from]?.includes(to)) {
      this.currentState = to;
      return true;
    }

    throw new Error(`Invalid transition from ${from} to ${to}`);
  }

  async process(contract: MCPContract): Promise<{ state: MCPState; result?: any; error?: string }> {
    // Inicialmente pasamos a SAFE-BLOCK
    await this.transition(this.currentState, MCPState.SAFE_BLOCK, { contract });

    // Realizamos las validaciones previas usando el PolicyValidator
    const context: StateMachineContext = { contract };
    const validationResponse = await this.policyValidator.validate(context);

    if (!validationResponse.valid) {
      return {
        state: this.currentState,
        error: `Pre-flight check failed: ${validationResponse.reason}`
      };
    }

    // Si todas las validaciones pasan, podemos pasar a EXECUTE
    await this.transition(MCPState.SAFE_BLOCK, MCPState.EXECUTE, { contract });

    try {
      // Ejecutar la acción correspondiente
      const result = await this.executeAction(contract);

      // Si la ejecución es exitosa, pasar a COMPLETE
      await this.transition(MCPState.EXECUTE, MCPState.COMPLETE, { contract, result });

      return {
        state: this.currentState,
        result
      };
    } catch (error) {
      // Si hay error en la ejecución, hacer rollback
      await this.transition(MCPState.EXECUTE, MCPState.ROLLBACK, {
        contract,
        error: (error as Error).message
      });

      return {
        state: this.currentState,
        error: (error as Error).message
      };
    }
  }

  private async executeAction(contract: MCPContract): Promise<any> {
    // Esta función ejecutará la acción específica basada en el contrato
    // Por ahora retornamos un valor simulado
    return { success: true, action: contract.action, tenant: contract.tenant };
  }
}