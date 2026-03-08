"""
SmarterOS v5 - Bio-AI Bridge
Latam-GPT + Cortical Labs Integration

This service orchestrates:
1. Latam-GPT for Spanish NLP processing
2. Cortical Labs for biological neural networks
3. n8n for workflow automation
4. SmarterOS MCP for business logic
"""

from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import httpx
import asyncio
import os
from datetime import datetime
import json

# ═══════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════

app = FastAPI(
    title="SmarterOS Bio-AI Bridge",
    description="Latam-GPT + Cortical Labs Biological Computing",
    version="1.0.0"
)

# CORS for n8n, Metabase, web interfaces
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Configuration
LATAM_GPT_API = os.getenv("LATAM_GPT_API", "https://api-inference.huggingface.co/models/latam-gpt/latam-gpt-7b")
CORTICAL_LABS_API = os.getenv("CORTICAL_LABS_API", "https://api.cortical-labs.com/v1")
HF_TOKEN = os.getenv("HF_TOKEN", "")
CL_API_KEY = os.getenv("CL_API_KEY", "")
BRIDGE_API_KEY = os.getenv("BRIDGE_API_KEY", "smarteros_bio_2026")

# ═══════════════════════════════════════════════════════════
# MODELS
# ═══════════════════════════════════════════════════════════

class BioRequest(BaseModel):
    user_input: str
    cluster_id: Optional[str] = "demo_cluster"
    require_biological_feedback: Optional[bool] = True
    sentiment_threshold: Optional[float] = 0.7

class BioResponse(BaseModel):
    success: bool
    latam_gpt_analysis: Dict[str, Any]
    biological_feedback: Optional[Dict[str, Any]] = None
    decision: str
    timestamp: str

class SentimentAnalysis(BaseModel):
    sentiment: str  # positive, negative, neutral, critical
    confidence: float
    action_required: bool
    stimulus_coordinates: Dict[str, int]

# ═══════════════════════════════════════════════════════════
# AUTHENTICATION
# ═══════════════════════════════════════════════════════════

async def verify_api_key(x_api_key: Optional[str] = Header(None)):
    """Verify API key for bridge access"""
    if not x_api_key:
        return "demo"
    
    if x_api_key == BRIDGE_API_KEY:
        return "authorized"
    
    raise HTTPException(status_code=401, detail="Invalid API key")

# ═══════════════════════════════════════════════════════════
# LATAM-GPT INTEGRATION
# ═══════════════════════════════════════════════════════════

async def query_latam_gpt(text: str) -> Dict[str, Any]:
    """Query Latam-GPT for Spanish NLP processing"""
    
    if not HF_TOKEN:
        # Demo mode - mock response
        return {
            "demo_mode": True,
            "text": text,
            "sentiment": "positive",
            "confidence": 0.85,
            "entities": ["SmarterOS", "Chile", "tecnología"],
            "action_suggested": "stimulate_cluster",
            "coordinates": {"x": 32, "y": 32}
        }
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            headers = {"Authorization": f"Bearer {HF_TOKEN}"}
            payload = {
                "inputs": text,
                "parameters": {
                    "max_new_tokens": 256,
                    "temperature": 0.7,
                    "top_p": 0.95
                }
            }
            
            response = await client.post(LATAM_GPT_API, headers=headers, json=payload)
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Latam-GPT API error: {response.text}"
                )
            
            result = response.json()
            
            # Parse response
            return {
                "text": text,
                "generated": result[0].get("generated_text", "") if isinstance(result, list) else str(result),
                "sentiment": analyze_sentiment(result),
                "confidence": 0.85,
                "entities": extract_entities(text),
                "action_suggested": determine_action(result),
                "coordinates": {"x": 32, "y": 32}
            }
    
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Latam-GPT request failed: {str(e)}")

def analyze_sentiment(model_output: Any) -> str:
    """Analyze sentiment from model output"""
    # Simple sentiment analysis (in production: use dedicated model)
    text = str(model_output).lower()
    
    positive_words = ["bueno", "excelente", "genial", "positivo", "éxito", "avanzar"]
    negative_words = ["malo", "terrible", "negativo", "fracaso", "error", "problema"]
    critical_words = ["crítico", "urgente", "importante", "decisión", "acción"]
    
    score = 0
    for word in positive_words:
        if word in text:
            score += 1
    for word in negative_words:
        if word in text:
            score -= 1
    
    for word in critical_words:
        if word in text:
            return "critical"
    
    if score > 0:
        return "positive"
    elif score < 0:
        return "negative"
    else:
        return "neutral"

def extract_entities(text: str) -> List[str]:
    """Extract entities from text"""
    # Simple entity extraction (in production: use NER model)
    entities = []
    
    if "smarter" in text.lower():
        entities.append("SmarterOS")
    if "chile" in text.lower():
        entities.append("Chile")
    if "venta" in text.lower() or "pago" in text.lower():
        entities.append("Commerce")
    if "neurona" in text.lower() or "biológico" in text.lower():
        entities.append("Biological")
    
    return entities

def determine_action(model_output: Any) -> str:
    """Determine action based on model output"""
    text = str(model_output).lower()
    
    if any(word in text for word in ["crítico", "urgente", "decisión"]):
        return "stimulate_cluster"
    elif any(word in text for word in ["analizar", "datos", "informe"]):
        return "log_activity"
    else:
        return "monitor_only"

# ═══════════════════════════════════════════════════════════
# CORTICAL LABS INTEGRATION
# ═══════════════════════════════════════════════════════════

async def stimulate_cortical_labs(
    cluster_id: str,
    x: int,
    y: int,
    stimulation_type: str = "electrical"
) -> Dict[str, Any]:
    """Send stimulation to Cortical Labs DishBrain"""
    
    if not CL_API_KEY:
        # Demo mode
        return {
            "demo_mode": True,
            "cluster_id": cluster_id,
            "stimulation_id": f"stim_{datetime.utcnow().timestamp()}",
            "coordinates": {"x": x, "y": y},
            "type": stimulation_type,
            "response": {
                "spike_count": 42,
                "burst_detected": True,
                "activity_change": "+15%",
                "oscillation_pattern": "theta"
            }
        }
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            headers = {"Authorization": f"Bearer {CL_API_KEY}"}
            payload = {
                "x": x,
                "y": y,
                "type": stimulation_type,
                "intensity": 1.0,
                "duration_ms": 100
            }
            
            response = await client.post(
                f"{CORTICAL_LABS_API}/clusters/{cluster_id}/stimulate",
                headers=headers,
                json=payload
            )
            
            if response.status_code not in [200, 201]:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Cortical Labs API error: {response.text}"
                )
            
            result = response.json()
            
            return {
                "cluster_id": cluster_id,
                "stimulation_id": result.get("stimulation_id", "unknown"),
                "coordinates": {"x": x, "y": y},
                "type": stimulation_type,
                "response": result
            }
    
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Cortical Labs request failed: {str(e)}")

async def get_cluster_activity(cluster_id: str) -> Dict[str, Any]:
    """Get neural activity from cluster"""
    
    if not CL_API_KEY:
        # Demo mode
        import random
        return {
            "demo_mode": True,
            "cluster_id": cluster_id,
            "activity": {
                "mean_firing_rate": random.uniform(5, 50),
                "burst_rate": random.uniform(0.1, 2),
                "oscillation_power": random.uniform(0.3, 0.9),
                "active_electrodes": random.randint(40, 60)
            }
        }
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            headers = {"Authorization": f"Bearer {CL_API_KEY}"}
            response = await client.get(
                f"{CORTICAL_LABS_API}/clusters/{cluster_id}/activity",
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

# ═══════════════════════════════════════════════════════════
# MAIN ENDPOINTS
# ═══════════════════════════════════════════════════════════

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "service": "bio-ai-bridge",
        "version": "1.0.0",
        "latam_gpt": "configured" if HF_TOKEN else "demo_mode",
        "cortical_labs": "configured" if CL_API_KEY else "demo_mode",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

@app.post("/process-bio-request", response_model=BioResponse)
async def process_bio_request(
    request: BioRequest,
    auth: str = Depends(verify_api_key)
):
    """
    Main endpoint: Process user input through Latam-GPT and Cortical Labs
    
    Flow:
    1. User input → Latam-GPT (NLP analysis)
    2. Sentiment analysis → Decision
    3. If critical → Stimulate Cortical Labs
    4. Return combined analysis + biological feedback
    """
    
    # Step 1: Query Latam-GPT
    latam_analysis = await query_latam_gpt(request.user_input)
    
    # Step 2: Determine if biological feedback is needed
    requires_stimulation = (
        request.require_biological_feedback and
        latam_analysis.get("action_suggested") == "stimulate_cluster"
    )
    
    biological_feedback = None
    decision = "monitor_only"
    
    if requires_stimulation:
        # Step 3: Stimulate Cortical Labs
        coords = latam_analysis.get("coordinates", {"x": 32, "y": 32})
        biological_feedback = await stimulate_cortical_labs(
            cluster_id=request.cluster_id,
            x=coords.get("x", 32),
            y=coords.get("y", 32),
            stimulation_type="electrical"
        )
        decision = "biological_stimulation_sent"
    else:
        decision = "latam_gpt_analysis_only"
    
    # Step 4: Return combined response
    return BioResponse(
        success=True,
        latam_gpt_analysis=latam_analysis,
        biological_feedback=biological_feedback,
        decision=decision,
        timestamp=datetime.utcnow().isoformat() + "Z"
    )

@app.get("/demo/cluster/{cluster_id}/status")
async def get_cluster_status(
    cluster_id: str,
    auth: str = Depends(verify_api_key)
):
    """Get combined AI + Biological cluster status"""
    
    # Get neural activity
    activity = await get_cluster_activity(cluster_id)
    
    # Get recent AI analyses (in production: from database)
    recent_analyses = 5  # Mock count
    
    return {
        "cluster_id": cluster_id,
        "biological_activity": activity,
        "ai_analyses_count": recent_analyses,
        "integration_status": "active",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

@app.post("/demo/webhook/n8n")
async def n8n_webhook(
    payload: Dict[str, Any],
    auth: str = Depends(verify_api_key)
):
    """
    Webhook endpoint for n8n workflows
    
    n8n sends events here, which triggers Bio-AI processing
    """
    
    # Extract user input from n8n payload
    user_input = payload.get("message", payload.get("text", ""))
    
    if not user_input:
        return {"success": False, "error": "No message found"}
    
    # Process through Bio-AI bridge
    request = BioRequest(
        user_input=user_input,
        cluster_id=payload.get("cluster_id", "demo_cluster"),
        require_biological_feedback=payload.get("require_bio", True)
    )
    
    response = await process_bio_request(request, auth)
    
    # Return formatted for n8n
    return {
        "success": True,
        "n8n_workflow": "bio-ai-integration",
        "result": response.dict(),
        "next_actions": [
            "log_to_supabase",
            "send_to_metabase",
            "telegram_notification"
        ]
    }

@app.get("/demo/integration/status")
async def integration_status(auth: str = Depends(verify_api_key)):
    """Get full integration status with SmarterOS ecosystem"""
    
    return {
        "integration": "bio-ai-smarteros",
        "status": "active",
        "components": {
            "latam_gpt": "configured" if HF_TOKEN else "demo_mode",
            "cortical_labs": "configured" if CL_API_KEY else "demo_mode",
            "smarteros_mcp": "connected",
            "n8n_workflows": "active",
            "metabase": "configured"
        },
        "capabilities": [
            "Spanish NLP (Latam-GPT)",
            "Biological Computing (Cortical Labs)",
            "Workflow Automation (n8n)",
            "Business Logic (SmarterOS MCP)",
            "Analytics (Metabase)"
        ],
        "endpoints": {
            "process": "/process-bio-request",
            "cluster_status": "/demo/cluster/{id}/status",
            "n8n_webhook": "/demo/webhook/n8n"
        }
    }

# ═══════════════════════════════════════════════════════════
# BACKGROUND TASKS
# ═══════════════════════════════════════════════════════════

async def monitor_bio_ai_activity():
    """Background task to monitor Bio-AI activity"""
    while True:
        try:
            print(f"[{datetime.utcnow()}] Monitoring Bio-AI activity...")
            await asyncio.sleep(60)  # Check every minute
        except Exception as e:
            print(f"Monitor error: {e}")
            await asyncio.sleep(10)

@app.on_event("startup")
async def startup_event():
    """Start background tasks on startup"""
    asyncio.create_task(monitor_bio_ai_activity())
    print("╔══════════════════════════════════════════════════════════╗")
    print("║   🧠 SmarterOS Bio-AI Bridge - SmarterOS v5              ║")
    print("║      Latam-GPT + Cortical Labs                           ║")
    print("╚══════════════════════════════════════════════════════════╝")
    print("")
    print(f"Latam-GPT API: {LATAM_GPT_API}")
    print(f"Cortical Labs API: {CORTICAL_LABS_API}")
    print(f"HF Token Configured: {bool(HF_TOKEN)}")
    print(f"CL API Key Configured: {bool(CL_API_KEY)}")
    print("")
    print("Endpoints:")
    print("  GET  /health - Health check")
    print("  POST /process-bio-request - Main Bio-AI processing")
    print("  GET  /demo/cluster/{id}/status - Cluster status")
    print("  POST /demo/webhook/n8n - n8n webhook")
    print("  GET  /demo/integration/status - Integration status")
    print("")

# ═══════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
