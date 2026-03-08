"""
SmarterOS v5 - MCP to A2A Bridge
Protocol translation between MCP and A2A
"""

import asyncio
from typing import Any
from datetime import datetime

class MCPA2ABridge:
    """Bridge between MCP agents and A2A protocol"""
    
    def __init__(
        self,
        mcp_endpoint: str = "http://localhost:3051",
        a2a_endpoint: str = "http://localhost:3095"
    ):
        self.mcp_endpoint = mcp_endpoint
        self.a2a_endpoint = a2a_endpoint
        self.message_queue = asyncio.Queue()
    
    # ═══════════════════════════════════════════════════════
    # MESSAGE CONVERSION
    # ═══════════════════════════════════════════════════════
    
    async def mcp_to_a2a(self, mcp_message: dict) -> dict:
        """Convert MCP message to A2A format"""
        
        message_type_mapping = {
            "request": "task/request",
            "response": "task/response",
            "status_update": "task/status",
            "error": "task/error",
            "notification": "task/notification"
        }
        
        return {
            "sender_id": mcp_message.get("agent_id", "unknown"),
            "receiver_id": mcp_message.get("target_agent", "unknown"),
            "message_type": message_type_mapping.get(
                mcp_message.get("type", "request"),
                "task/request"
            ),
            "payload": mcp_message.get("data", {}),
            "timestamp": mcp_message.get(
                "timestamp",
                datetime.utcnow().isoformat() + "Z"
            ),
            "conversation_id": mcp_message.get("conversation_id")
        }
    
    async def a2a_to_mcp(self, a2a_message: dict) -> dict:
        """Convert A2A message to MCP format"""
        
        message_type_mapping = {
            "task/request": "request",
            "task/response": "response",
            "task/status": "status_update",
            "task/error": "error",
            "task/notification": "notification"
        }
        
        return {
            "agent_id": a2a_message.get("sender_id", "unknown"),
            "target_agent": a2a_message.get("receiver_id", "unknown"),
            "type": message_type_mapping.get(
                a2a_message.get("message_type", "request"),
                "request"
            ),
            "data": a2a_message.get("payload", {}),
            "timestamp": a2a_message.get(
                "timestamp",
                datetime.utcnow().isoformat() + "Z"
            ),
            "conversation_id": a2a_message.get("conversation_id")
        }
    
    # ═══════════════════════════════════════════════════════
    # MESSAGE ROUTING
    # ═══════════════════════════════════════════════════════
    
    async def route_via_mcp(self, message: dict):
        """Route message through MCP bus"""
        await self.message_queue.put(message)
        print(f"Message queued for MCP routing: {message.get('message_id')}")
    
    async def route_via_a2a(self, message: dict):
        """Route message through A2A protocol"""
        import aiohttp
        
        a2a_message = await self.mcp_to_a2a(message)
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.a2a_endpoint}/a2a/v1/messages/send",
                json=a2a_message
            ) as response:
                result = await response.json()
                print(f"A2A message sent: {result}")
                return result
    
    async def process_queue(self):
        """Process message queue"""
        while True:
            message = await self.message_queue.get()
            
            # Determine routing based on receiver
            receiver = message.get("receiver_id", "")
            
            if receiver.startswith("smarteros-"):
                # Route via MCP
                await self.route_via_mcp(message)
            else:
                # Route via A2A
                await self.route_via_a2a(message)
            
            self.message_queue.task_done()
    
    # ═══════════════════════════════════════════════════════
    # AGENT REGISTRATION
    # ═══════════════════════════════════════════════════════
    
    async def register_agent(
        self,
        agent_id: str,
        capabilities: list[str],
        endpoint: str,
        name: Optional[str] = None
    ):
        """Register agent in A2A protocol"""
        import aiohttp
        
        agent_data = {
            "agent_id": agent_id,
            "name": name or agent_id,
            "capabilities": capabilities,
            "endpoint": endpoint,
            "status": "active"
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.a2a_endpoint}/a2a/v1/agents/register",
                json=agent_data
            ) as response:
                result = await response.json()
                print(f"Agent registered: {result}")
                return result
    
    async def list_agents(self):
        """List all registered agents"""
        import aiohttp
        
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.a2a_endpoint}/a2a/v1/agents"
            ) as response:
                result = await response.json()
                return result.get("agents", [])

# ═══════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════

if __name__ == "__main__":
    bridge = MCPA2ABridge()
    
    # Start message queue processor
    asyncio.create_task(bridge.process_queue())
    
    # Keep running
    asyncio.get_event_loop().run_forever()
