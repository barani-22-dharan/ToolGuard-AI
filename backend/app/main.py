
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base, engine
from app.models.models import Tool

from app.routes.tool_routes import router as tool_router
from app.routes.prediction_routes import router as prediction_router
from app.routes.maintenance_routes import router as maintenance_router
from app.routes.lifecycle_routes import router as lifecycle_router
from app.routes.auth_routes import router as auth_router


# =========================================================
# Create Database Tables
# =========================================================

Base.metadata.create_all(bind=engine)


# =========================================================
# Create FastAPI Application
# =========================================================

app = FastAPI(
    title="ToolGuard AI API",
    description="AI-Based Tool Wear Monitoring and Prediction using PLM",
    version="1.0.0"
)


# =========================================================
# CORS Configuration
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://toolguard-ai-frontend.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# Register API Routes
# =========================================================

app.include_router(tool_router)

app.include_router(prediction_router)

app.include_router(maintenance_router)

app.include_router(lifecycle_router)

app.include_router(auth_router)


# =========================================================
# Root API
# =========================================================

@app.get("/")
def root():
    return {
        "message": "ToolGuard AI API is running"
    }


# =========================================================
# Health Check
# =========================================================

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "service": "ToolGuard AI"
    }
