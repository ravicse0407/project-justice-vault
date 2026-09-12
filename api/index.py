import os
import sys
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Top-level FastAPI instance required by Vercel's Python builder
app = FastAPI(
    title="Justice Vault API",
    description="Evidence-Grounded AI Action Engine for Public Services & Citizen Rights",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inject path locations into sys.path
CURRENT_DIR = Path(__file__).resolve().parent
ROOT_DIR = CURRENT_DIR.parent
for p in [
    str(CURRENT_DIR / "backend"),
    str(CURRENT_DIR),
    str(ROOT_DIR),
    "/var/task",
    "/var/task/api",
    "/var/task/api/backend"
]:
    if p not in sys.path:
        sys.path.insert(0, p)

# Mount the application router
router_loaded = False
try:
    from backend.app.api.router import router
    app.include_router(router, prefix="/api")
    app.include_router(router)
    router_loaded = True
except ImportError:
    try:
        from app.api.router import router
        app.include_router(router, prefix="/api")
        app.include_router(router)
        router_loaded = True
    except Exception as e:
        print(f"Router import error: {e}")

@app.get("/")
def root():
    return {
        "service": "Justice Vault - Evidence-Grounded AI Action Engine",
        "tagline": "No verified evidence -> no confident answer",
        "status": "healthy",
        "router_loaded": router_loaded
    }
