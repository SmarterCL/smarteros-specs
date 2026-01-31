from fastapi import FastAPI
import os

app = FastAPI(
    title="SmarterMCP",
    version="0.2.1"
)

# Force OpenAPI version to 3.0.3 for gateway compatibility
app.openapi_version = "3.0.3"

@app.get("/")
def read_root():
    return {"service": "SmarterMCP", "status": "running", "version": "0.2.1"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "env": os.getenv("MCP_ENV", "unknown")}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)