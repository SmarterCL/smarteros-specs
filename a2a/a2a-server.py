"""
SmarterOS v5 - A2A Protocol Server
Agent-to-Agent communication protocol implementation
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid

app = FastAPI(
    title="SmarterOS A2A Server",
    description="Agent-to-Agent Protocol Server for SmarterOS v5",
    version="1.0.0"
)

# ═══════════════════════════════════════════════════════════
# MODELS
# ═══════════════════════════════════════════════════════════

class A2AAgent(BaseModel):
    agent_id: str
    name: Optional[str] = None
    capabilities: list[str] = []
    endpoint: str
    status: str = "active"
    metadata: dict = {}

class A2AMessage(BaseModel):
    sender_id: str
    receiver_id: str
    message_type: str  # task/request, task/response, task/status, task/error
    payload: dict
    timestamp: str
    conversation_id: Optional[str] = None

class A2AResponse(BaseModel):
    message_id: str
    status: str
    payload: Optional[dict] = None
    conversation_id: Optional[str] = None

# ═══════════════════════════════════════════════════════════
# STATE
# ═══════════════════════════════════════════════════════════

# Agent registry
agents: dict[str, A2AAgent] = {}

# Message history
messages: list[dict] = []

# ═══════════════════════════════════════════════════════════
# ENDPOINTS
# ═══════════════════════════════════════════════════════════

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "service": "a2a-server",
        "version": "1.0.0",
        "agents_registered": len(agents),
        "messages_processed": len(messages)
    }

@app.post("/a2a/v1/agents/register")
async def register_agent(agent: A2AAgent):
    """Register an A2A-compliant agent"""
    agents[agent.agent_id] = agent
    
    return {
        "success": True,
        "agent_id": agent.agent_id,
        "message": f"Agent {agent.agent_id} registered successfully"
    }

@app.get("/a2a/v1/agents")
async def list_agents():
    """List all registered agents"""
    return {
        "agents": [
            {
                "agent_id": agent.agent_id,
                "name": agent.name,
                "capabilities": agent.capabilities,
                "status": agent.status,
                "endpoint": agent.endpoint
            }
            for agent in agents.values()
        ]
    }

@app.get("/a2a/v1/agents/{agent_id}")
async def get_agent(agent_id: str):
    """Get specific agent details"""
    if agent_id not in agents:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    return agents[agent_id]

@app.post("/a2a/v1/messages/send")
async def send_message(message: A2AMessage):
    """Send message between agents"""
    
    # Validate receiver exists
    if message.receiver_id not in agents:
        raise HTTPException(
            status_code=404,
            detail=f"Receiver agent {message.receiver_id} not found"
        )
    
    # Generate message ID
    message_id = str(uuid.uuid4())
    
    # Store message
    messages.append({
        "message_id": message_id,
        **message.model_dump()
    })
    
    # Get receiver endpoint
    receiver = agents[message.receiver_id]
    
    # Forward message to receiver endpoint
    # In production: HTTP POST to receiver.endpoint
    print(f"Forwarding message to {receiver.endpoint}")
    
    return {
        "success": True,
        "message_id": message_id,
        "status": "delivered",
        "receiver": message.receiver_id
    }

@app.get("/a2a/v1/messages/{message_id}")
async def get_message(message_id: str):
    """Get message by ID"""
    for msg in messages:
        if msg["message_id"] == message_id:
            return msg
    
    raise HTTPException(status_code=404, detail="Message not found")

@app.get("/a2a/v1/conversations/{conversation_id}")
async def get_conversation(conversation_id: str):
    """Get all messages in a conversation"""
    conversation_messages = [
        msg for msg in messages
        if msg.get("conversation_id") == conversation_id
    ]
    
    return {
        "conversation_id": conversation_id,
        "messages": conversation_messages,
        "count": len(conversation_messages)
    }

@app.delete("/a2a/v1/agents/{agent_id}")
async def unregister_agent(agent_id: str):
    """Unregister an agent"""
    if agent_id not in agents:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    del agents[agent_id]
    
    return {
        "success": True,
        "message": f"Agent {agent_id} unregistered"
    }

# ═══════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3095)
