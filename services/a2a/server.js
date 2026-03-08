/**
 * SmarterOS v5 - A2A Server (Node.js)
 * Agent-to-Agent Protocol Server
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.A2A_PORT || 3095;

app.use(express.json());

// ═══════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════

const agents = new Map();
const messages = [];

// ═══════════════════════════════════════════════════════════
// MODELS
// ═══════════════════════════════════════════════════════════

class A2AAgent {
  constructor({ agent_id, name, capabilities, endpoint, status = 'active', metadata = {} }) {
    this.agent_id = agent_id;
    this.name = name || agent_id;
    this.capabilities = capabilities || [];
    this.endpoint = endpoint;
    this.status = status;
    this.metadata = metadata;
    this.registered_at = new Date().toISOString();
  }

  toJSON() {
    return {
      agent_id: this.agent_id,
      name: this.name,
      capabilities: this.capabilities,
      status: this.status,
      endpoint: this.endpoint,
      registered_at: this.registered_at
    };
  }
}

class A2AMessage {
  constructor({ sender_id, receiver_id, message_type, payload, conversation_id = null }) {
    this.message_id = uuidv4();
    this.sender_id = sender_id;
    this.receiver_id = receiver_id;
    this.message_type = message_type; // task/request, task/response, task/status, task/error
    this.payload = payload;
    this.timestamp = new Date().toISOString();
    this.conversation_id = conversation_id;
  }
}

// ═══════════════════════════════════════════════════════════
// ENDPOINTS
// ═══════════════════════════════════════════════════════════

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'a2a-server-nodejs',
    version: '1.0.0',
    agents_registered: agents.size,
    messages_processed: messages.length
  });
});

// Agent Card (Auto-descripción del sistema)
app.get('/.well-known/agent-card.json', (req, res) => {
  res.json({
    name: 'SmarterOS v5',
    description: 'Business Operating System with A2A Protocol Support',
    version: '5.0.0',
    capabilities: [
      'rut_validation',
      'sales_engine',
      'payment_processing',
      'flow_cl_integration',
      'mercadopago_integration',
      'n8n_orchestration',
      'conversational_commerce'
    ],
    protocol: 'A2A v1.0',
    endpoints: {
      a2a: 'http://localhost:3095/a2a/v1',
      mcp: 'http://localhost:3051'
    },
    documentation: 'https://github.com/SmarterCL/smarteros-specs',
    contact: {
      email: 'contact@smarterbot.cl',
      url: 'https://smarterbot.cl'
    }
  });
});

// Register agent
app.post('/a2a/v1/agents/register', (req, res) => {
  const { agent_id, name, capabilities, endpoint, status, metadata } = req.body;

  if (!agent_id || !endpoint) {
    return res.status(400).json({
      success: false,
      error: 'agent_id and endpoint are required'
    });
  }

  const agent = new A2AAgent({
    agent_id,
    name,
    capabilities,
    endpoint,
    status,
    metadata
  });

  agents.set(agent_id, agent);

  console.log(`✅ Agent registered: ${agent_id}`);

  res.json({
    success: true,
    agent_id: agent.agent_id,
    message: `Agent ${agent_id} registered successfully`
  });
});

// List agents
app.get('/a2a/v1/agents', (req, res) => {
  const agentList = Array.from(agents.values()).map(agent => agent.toJSON());

  res.json({
    agents: agentList,
    count: agentList.length
  });
});

// Get specific agent
app.get('/a2a/v1/agents/:agent_id', (req, res) => {
  const agent = agents.get(req.params.agent_id);

  if (!agent) {
    return res.status(404).json({
      success: false,
      error: 'Agent not found'
    });
  }

  res.json(agent.toJSON());
});

// Send message
app.post('/a2a/v1/messages/send', async (req, res) => {
  const { sender_id, receiver_id, message_type, payload, conversation_id } = req.body;

  if (!sender_id || !receiver_id || !payload) {
    return res.status(400).json({
      success: false,
      error: 'sender_id, receiver_id, and payload are required'
    });
  }

  // Validate receiver exists
  if (!agents.has(receiver_id)) {
    return res.status(404).json({
      success: false,
      error: `Receiver agent ${receiver_id} not found`
    });
  }

  // Create message
  const message = new A2AMessage({
    sender_id,
    receiver_id,
    message_type: message_type || 'task/request',
    payload,
    conversation_id
  });

  // Store message
  messages.push(message);

  // Get receiver endpoint
  const receiver = agents.get(receiver_id);

  console.log(`📤 Message ${message.message_id}: ${sender_id} → ${receiver_id}`);

  // Forward to receiver (in production: HTTP POST)
  // await forwardToReceiver(receiver.endpoint, message);

  res.json({
    success: true,
    message_id: message.message_id,
    status: 'delivered',
    receiver: receiver_id,
    timestamp: message.timestamp
  });
});

// Get message by ID
app.get('/a2a/v1/messages/:message_id', (req, res) => {
  const message = messages.find(m => m.message_id === req.params.message_id);

  if (!message) {
    return res.status(404).json({
      success: false,
      error: 'Message not found'
    });
  }

  res.json(message);
});

// Get conversation
app.get('/a2a/v1/conversations/:conversation_id', (req, res) => {
  const conversationMessages = messages.filter(
    m => m.conversation_id === req.params.conversation_id
  );

  res.json({
    conversation_id: req.params.conversation_id,
    messages: conversationMessages,
    count: conversationMessages.length
  });
});

// Unregister agent
app.delete('/a2a/v1/agents/:agent_id', (req, res) => {
  const agentId = req.params.agent_id;

  if (!agents.has(agentId)) {
    return res.status(404).json({
      success: false,
      error: 'Agent not found'
    });
  }

  agents.delete(agentId);

  console.log(`❌ Agent unregistered: ${agentId}`);

  res.json({
    success: true,
    message: `Agent ${agentId} unregistered`
  });
});

// ═══════════════════════════════════════════════════════════
// MCP BRIDGE (Optional)
// ═══════════════════════════════════════════════════════════

// Convert MCP message to A2A format
function mcpToA2A(mcpMessage) {
  const messageTypeMapping = {
    'request': 'task/request',
    'response': 'task/response',
    'status_update': 'task/status',
    'error': 'task/error'
  };

  return {
    sender_id: mcpMessage.agent_id,
    receiver_id: mcpMessage.target_agent,
    message_type: messageTypeMapping[mcpMessage.type] || 'task/request',
    payload: mcpMessage.data,
    timestamp: mcpMessage.timestamp || new Date().toISOString(),
    conversation_id: mcpMessage.conversation_id
  };
}

// Convert A2A message to MCP format
function a2aToMCP(a2aMessage) {
  const messageTypeMapping = {
    'task/request': 'request',
    'task/response': 'response',
    'task/status': 'status_update',
    'task/error': 'error'
  };

  return {
    agent_id: a2aMessage.sender_id,
    target_agent: a2aMessage.receiver_id,
    type: messageTypeMapping[a2aMessage.message_type] || 'request',
    data: a2aMessage.payload,
    timestamp: a2aMessage.timestamp,
    conversation_id: a2aMessage.conversation_id
  };
}

// ═══════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════

app.listen(PORT, () => {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║   🤖 A2A Server (Node.js) - SmarterOS v5                ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`Port: ${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health`);
  console.log(`Agent Card: http://localhost:${PORT}/.well-known/agent-card.json`);
  console.log('');
  console.log('Endpoints:');
  console.log('  POST /a2a/v1/agents/register - Register agent');
  console.log('  GET  /a2a/v1/agents - List agents');
  console.log('  POST /a2a/v1/messages/send - Send message');
  console.log('  GET  /a2a/v1/messages/:id - Get message');
  console.log('  GET  /a2a/v1/conversations/:id - Get conversation');
  console.log('');
  console.log('A2A Protocol Ready! ✅');
  console.log('');
});
