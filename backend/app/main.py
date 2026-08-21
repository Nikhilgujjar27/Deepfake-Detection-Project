from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.database import init_db
from app.api.v1.auth import router as auth_router
from app.api.v1.history import router as history_router
from app.api.v1.predict import router as predict_router
from app.models.user import User
from app.models.scan import ScanHistory

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize Database Tables
    init_db()
    yield

app = FastAPI(
    title=settings.APP_NAME,
    version='2.0.0',
    description='DeepSentry — AI Facial Forensics & Deepfake Detection Engine',
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1")
app.include_router(history_router, prefix="/api/v1")
app.include_router(predict_router, prefix="/api/v1")

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "app": settings.APP_NAME, "version": "2.0.0"}

@app.get("/", tags=["Root"])
async def root():
    return {
        "app": settings.APP_NAME,
        "version": "2.0.0",
        "docs_url": "/docs"
    }
