from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .api.router import router

app = FastAPI(
    title="Justice Vault API",
    description="Evidence-Grounded AI Action Engine for Public Services & Citizen Rights",
    version="1.0.0"
)

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.get("/")
def root():
    return {
        "service": "Justice Vault - Evidence-Grounded AI Action Engine",
        "tagline": "No verified evidence -> no confident answer",
        "hackathon": "Lenovo LEAP AI Hackathon 2026",
        "theme": "Theme 2 - Digital Inclusion & Public Access",
        "documentation": "/docs",
        "api_health": "/api/health"
    }
