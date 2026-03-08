"""
SmarterOS v5 - Cortical Labs Bridge
Biological Computing Integration with DishBrain

FastAPI service that connects SmarterOS MCP agents with
Cortical Labs biological neural networks (DishBrain)
"""

from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import httpx
import asyncio
from datetime import datetime
import os

# ═══════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════

app = FastAPI(
    title="Cortical Labs Bridge",
    description="Biological Computing Integration for SmarterOS v5",
    version="1.0.0"
)

# CORS for n8n and web interfaces
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cortical Labs API Configuration
CL_API_BASE = os.getenv("CORTICAL_LABS_API_BASE", "https://api.cortical-labs.com/v1")
CL_API_KEY = os.getenv("CORTICAL_LABS_API_KEY", "")

# ═══════════════════════════════════════════════════════════
# MODELS
# ═══════════════════════════════════════════════════════════

class StimulationRequest(BaseModel):
    cluster_id: str
    x: int  # X coordinate (0-63 for MEA grid)
    y: int  # Y coordinate (0-63 for MEA grid)
    stimulation_type: str = "electrical"  # electrical, optical
    intensity: Optional[float] = 1.0
    duration_ms: Optional[int] = 100

class StimulationResponse(BaseModel):
    success: bool
    stimulation_id: str
    cluster_id: str
    timestamp: str
    response: Optional[Dict[str, Any]] = None

class ClusterStatus(BaseModel):
    cluster_id: str
    name: str
    status: str  # active, inactive, maintenance
    neuron_count: int
    activity_level: float  # 0.0 - 1.0
    last_activity: str

class BiologicalEvent(BaseModel):
    event_id: str
    cluster_id: str
    event_type: str  # spike, burst, oscillation
    timestamp: str
    data: Dict[str, Any]

# ═══════════════════════════════════════════════════════════
# AUTHENTICATION
# ═══════════════════════════════════════════════════════════

async def verify_api_key(x_api_key: Optional[str] = Header(None)):
    """Verify API key for bridge access"""
    if not x_api_key:
        # Allow access without key for demo mode
        return "demo"
    
    if x_api_key == os.getenv("BRIDGE_API_KEY", "smarteros_demo_key"):
        return "authorized"
    
    raise HTTPException(status_code=401, detail="Invalid API key")

# ═══════════════════════════════════════════════════════════
# ENDPOINTS
# ═══════════════════════════════════════════════════════════

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "service": "cortical-labs-bridge",
        "version": "1.0.0",
        "cortical_labs_api": CL_API_BASE,
        "authenticated": bool(CL_API_KEY)
    }

@app.get("/demo/biological-status")
async def get_brain_status(auth: str = Depends(verify_api_key)):
    """
    Get status of available biological clusters (DishBrain)
    
    This endpoint queries Cortical Labs API to get the current
    status of available neural clusters.
    """
    if not CL_API_KEY:
        # Demo mode - return mock data
        return {
            "demo_mode": True,
            "clusters": [
                {
                    "cluster_id": "dishbrain_demo_001",
                    "name": "Demo Cluster Alpha",
                    "status": "active",
                    "neuron_count": 800000,
                    "activity_level": 0.73,
                    "last_activity": datetime.utcnow().isoformat() + "Z"
                },
                {
                    "cluster_id": "dishbrain_demo_002",
                    "name": "Demo Cluster Beta",
                    "status": "active",
                    "neuron_count": 750000,
                    "activity_level": 0.65,
                    "last_activity": datetime.utcnow().isoformat() + "Z"
                }
            ]
        }
    
    try:
        async with httpx.AsyncClient() as client:
            headers = {"Authorization": f"Bearer {CL_API_KEY}"}
            response = await client.get(f"{CL_API_BASE}/clusters", headers=headers)
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Cortical Labs API error: {response.text}"
                )
            
            return response.json()
    
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Request failed: {str(e)}")

@app.post("/demo/stimulate", response_model=StimulationResponse)
async def stimulate_neurons(
    request: StimulationRequest,
    auth: str = Depends(verify_api_key)
):
    """
    Send electrical stimulation to biological neural network
    
    This sends a stimulation signal to specific coordinates
    on the MEA (Micro-Electrode Array) grid.
    """
    if not CL_API_KEY:
        # Demo mode
        return StimulationResponse(
            success=True,
            stimulation_id=f"stim_demo_{datetime.utcnow().timestamp()}",
            cluster_id=request.cluster_id,
            timestamp=datetime.utcnow().isoformat() + "Z",
            response={
                "demo_mode": True,
                "message": "Stimulation sent to demo cluster",
                "coordinates": {"x": request.x, "y": request.y},
                "simulated_response": {
                    "spike_count": 42,
                    "burst_detected": True,
                    "activity_change": "+15%"
                }
            }
        )
    
    try:
        async with httpx.AsyncClient() as client:
            headers = {"Authorization": f"Bearer {CL_API_KEY}"}
            payload = {
                "x": request.x,
                "y": request.y,
                "type": request.stimulation_type,
                "intensity": request.intensity,
                "duration_ms": request.duration_ms
            }
            
            response = await client.post(
                f"{CL_API_BASE}/clusters/{request.cluster_id}/stimulate",
                json=payload,
                headers=headers
            )
            
            if response.status_code not in [200, 201]:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Stimulation failed: {response.text}"
                )
            
            result = response.json()
            
            return StimulationResponse(
                success=True,
                stimulation_id=result.get("stimulation_id", "unknown"),
                cluster_id=request.cluster_id,
                timestamp=datetime.utcnow().isoformat() + "Z",
                response=result
            )
    
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Request failed: {str(e)}")

@app.get("/demo/cluster/{cluster_id}/activity")
async def get_cluster_activity(
    cluster_id: str,
    auth: str = Depends(verify_api_key)
):
    """
    Get real-time neural activity from a specific cluster
    """
    if not CL_API_KEY:
        # Demo mode - generate synthetic neural activity
        import random
        
        return {
            "demo_mode": True,
            "cluster_id": cluster_id,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "activity": {
                "mean_firing_rate": random.uniform(5, 50),  # Hz
                "burst_rate": random.uniform(0.1, 2),  # bursts/min
                "oscillation_power": random.uniform(0.3, 0.9),
                "active_electrodes": random.randint(40, 60),
                "spike_data": [
                    {"electrode": i, "count": random.randint(0, 100)}
                    for i in range(10)
                ]
            }
        }
    
    try:
        async with httpx.AsyncClient() as client:
            headers = {"Authorization": f"Bearer {CL_API_KEY}"}
            response = await client.get(
                f"{CL_API_BASE}/clusters/{cluster_id}/activity",
                headers=headers
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Activity fetch failed: {response.text}"
                )
            
            return response.json()
    
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Request failed: {str(e)}")

@app.post("/demo/webhook/subscribe")
async def subscribe_to_events(
    webhook_url: str,
    cluster_id: Optional[str] = None,
    event_types: Optional[List[str]] = None,
    auth: str = Depends(verify_api_key)
):
    """
    Subscribe to biological events via webhook
    
    This allows n8n or other services to receive real-time
    notifications when neural activity exceeds thresholds.
    """
    # Store webhook subscription (in production: use Redis/PostgreSQL)
    subscription_id = f"sub_{datetime.utcnow().timestamp()}"
    
    return {
        "success": True,
        "subscription_id": subscription_id,
        "webhook_url": webhook_url,
        "cluster_id": cluster_id or "all",
        "event_types": event_types or ["spike", "burst", "oscillation"],
        "message": "Webhook subscription created"
    }

@app.get("/demo/integration/smarteros")
async def smarteros_integration_status(auth: str = Depends(verify_api_key)):
    """
    Get integration status with SmarterOS MCP agents
    
    This endpoint shows how biological computing integrates
    with the SmarterOS ecosystem.
    """
    return {
        "integration": "cortical-labs-smarteros",
        "status": "active",
        "mcp_agents_connected": [
            "smarteros-sales-agent",
            "smarteros-analytics-agent",
            "smarteros-bolt-core"
        ],
        "biological_clusters": 2,
        "n8n_workflows": [
            "biological-event-trigger",
            "neural-feedback-loop",
            "sales-neural-correlation"
        ],
        "capabilities": [
            "real-time neural monitoring",
            "electrical stimulation",
            "pattern recognition",
            "biological feedback loops"
        ]
    }

# ═══════════════════════════════════════════════════════════
# BACKGROUND TASKS
# ═══════════════════════════════════════════════════════════

async def monitor_neural_activity():
    """Background task to monitor neural activity"""
    while True:
        try:
            # In production: query Cortical Labs API
            # For now: just log
            print(f"[{datetime.utcnow()}] Monitoring neural activity...")
            await asyncio.sleep(60)  # Check every minute
        except Exception as e:
            print(f"Monitor error: {e}")
            await asyncio.sleep(10)

@app.on_event("startup")
async def startup_event():
    """Start background tasks on startup"""
    asyncio.create_task(monitor_neural_activity())
    print("╔══════════════════════════════════════════════════════════╗")
    print("║   🧠 Cortical Labs Bridge - SmarterOS v5                ║")
    print("╚══════════════════════════════════════════════════════════╝")
    print("")
    print(f"API Base: {CL_API_BASE}")
    print(f"Auth Configured: {bool(CL_API_KEY)}")
    print("")
    print("Endpoints:")
    print("  GET  /health - Health check")
    print("  GET  /demo/biological-status - Get cluster status")
    print("  POST /demo/stimulate - Send stimulation")
    print("  GET  /demo/cluster/{id}/activity - Get activity")
    print("  POST /demo/webhook/subscribe - Subscribe to events")
    print("  GET  /demo/integration/smarteros - SmarterOS status")
    print("")

# ═══════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3100)
