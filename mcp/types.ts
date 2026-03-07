export interface MCPContract {
  tenant: string;
  action: string;
  context: {
    env: 'production' | 'staging';
    metadata?: Record<string, any>;
  };
}