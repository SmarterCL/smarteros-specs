/**
 * SmarterOS v5 - A2A Client (Node.js)
 * Client for Agent-to-Agent communication
 */

const axios = require('axios');

class A2AClient {
  constructor({ a2aEndpoint = 'http://localhost:3095', agentId, agentName, capabilities = [] }) {
    this.a2aEndpoint = a2aEndpoint;
    this.agentId = agentId;
    this.agentName = agentName;
    this.capabilities = capabilities;
    this.registered = false;
  }

  // Register this agent in A2A network
  async register(endpoint) {
    try {
      const response = await axios.post(`${this.a2aEndpoint}/a2a/v1/agents/register`, {
        agent_id: this.agentId,
        name: this.agentName,
        capabilities: this.capabilities,
        endpoint: endpoint || `http://localhost:${process.env.PORT || 3000}`,
        status: 'active'
      });

      this.registered = true;
      console.log(`✅ Agent registered: ${this.agentId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to register agent:', error.message);
      throw error;
    }
  }

  // Send message to another agent
  async sendMessage(receiverId, payload, conversationId = null) {
    if (!this.registered) {
      throw new Error('Agent not registered. Call register() first.');
    }

    try {
      const response = await axios.post(`${this.a2aEndpoint}/a2a/v1/messages/send`, {
        sender_id: this.agentId,
        receiver_id: receiverId,
        message_type: 'task/request',
        payload,
        conversation_id: conversationId
      });

      console.log(`📤 Message sent to ${receiverId}: ${response.data.message_id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to send message:', error.message);
      throw error;
    }
  }

  // Send response to a message
  async sendResponse(receiverId, payload, conversationId) {
    try {
      const response = await axios.post(`${this.a2aEndpoint}/a2a/v1/messages/send`, {
        sender_id: this.agentId,
        receiver_id: receiverId,
        message_type: 'task/response',
        payload,
        conversation_id: conversationId
      });

      console.log(`📤 Response sent to ${receiverId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to send response:', error.message);
      throw error;
    }
  }

  // List all registered agents
  async listAgents() {
    try {
      const response = await axios.get(`${this.a2aEndpoint}/a2a/v1/agents`);
      return response.data.agents;
    } catch (error) {
      console.error('❌ Failed to list agents:', error.message);
      throw error;
    }
  }

  // Get specific agent details
  async getAgent(agentId) {
    try {
      const response = await axios.get(`${this.a2aEndpoint}/a2a/v1/agents/${agentId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to get agent:', error.message);
      throw error;
    }
  }

  // Get message by ID
  async getMessage(messageId) {
    try {
      const response = await axios.get(`${this.a2aEndpoint}/a2a/v1/messages/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to get message:', error.message);
      throw error;
    }
  }

  // Get conversation
  async getConversation(conversationId) {
    try {
      const response = await axios.get(`${this.a2aEndpoint}/a2a/v1/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to get conversation:', error.message);
      throw error;
    }
  }

  // Unregister agent
  async unregister() {
    try {
      await axios.delete(`${this.a2aEndpoint}/a2a/v1/agents/${this.agentId}`);
      this.registered = false;
      console.log(`❌ Agent unregistered: ${this.agentId}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to unregister agent:', error.message);
      throw error;
    }
  }
}

// ═══════════════════════════════════════════════════════════
// EXAMPLE USAGE
// ═══════════════════════════════════════════════════════════

async function exampleUsage() {
  // Create client for SmarterOS Sales Agent
  const salesAgent = new A2AClient({
    agentId: 'smarteros-sales-agent',
    agentName: 'SmarterOS Sales Agent',
    capabilities: ['rut_validation', 'sales', 'payments', 'orders']
  });

  try {
    // Register agent
    await salesAgent.register('http://localhost:3080');

    // List all agents
    const agents = await salesAgent.listAgents();
    console.log('Registered agents:', agents);

    // Send message to external agent (e.g., Google ADK Currency Agent)
    const response = await salesAgent.sendMessage(
      'google-adk-currency-agent',
      {
        task: 'currency_conversion',
        amount: 10000,
        from: 'CLP',
        to: 'USD'
      },
      'conv_123456'
    );

    console.log('Message response:', response);

    // Get conversation
    const conversation = await salesAgent.getConversation('conv_123456');
    console.log('Conversation:', conversation);

    // Unregister when done
    await salesAgent.unregister();

  } catch (error) {
    console.error('Example failed:', error.message);
  }
}

// Export for use in other modules
module.exports = { A2AClient };

// Run example if executed directly
if (require.main === module) {
  exampleUsage();
}
