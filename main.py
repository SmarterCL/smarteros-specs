from fastapi import FastAPI
import os

app = FastAPI(title="SmarterMCP API", version="0.2.1")

@app.get("/")
def read_root():
    return {"service": "SmarterMCP API", "status": "running", "version": "0.2.1"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "env": os.getenv("MCP_ENV", "unknown")}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3000)