import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = 'DeepSentry'
    SECRET_KEY: str = 'development_secret_key_12345'
    ALGORITHM: str = 'HS256'
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8000"
    ]
    
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    MODEL_PATH: str = os.path.join(BASE_DIR, 'models', 'baseline', 'vit_deepfake_v1_baseline.pth')
    SECONDARY_MODEL_ID: str = 'prithivMLmods/Deep-Fake-Detector-v2-Model'
    DATABASE_URL: str = f"sqlite+aiosqlite:///{os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'deepfake_sentry.db')}"
    
    ENSEMBLE_WEIGHT_VIT: float = 0.60
    ENSEMBLE_WEIGHT_SECONDARY: float = 0.40
    ENSEMBLE_THRESHOLD: float = 0.60
    FACE_CROP_PADDING: float = 1.3
    MAX_UPLOAD_SIZE_MB: int = 10

    model_config = {
        "env_file": ".env"
    }

settings = Settings()
