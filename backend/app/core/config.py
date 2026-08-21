import os
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

class Settings:
    APP_NAME: str = os.getenv("APP_NAME", "DeepSentry")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "development_secret_key_12345")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8000"
    ]
    
    BASE_DIR: str = BASE_DIR
    MODEL_PATH: str = os.getenv("MODEL_PATH", os.path.join(BASE_DIR, "models", "baseline", "vit_deepfake_v1_baseline.pth"))
    SECONDARY_MODEL_ID: str = os.getenv("SECONDARY_MODEL_ID", "prithivMLmods/Deep-Fake-Detector-v2-Model")
    
    # SQLite Database absolute path
    db_path = os.path.join(BASE_DIR, "deepfake_sentry.db").replace("\\", "/")
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{db_path}")
    
    # Calibrated Ensemble Hyperparameters (Phase 6 Empirical Optima)
    ENSEMBLE_WEIGHT_VIT: float = float(os.getenv("ENSEMBLE_WEIGHT_VIT", "0.60"))
    ENSEMBLE_WEIGHT_SECONDARY: float = float(os.getenv("ENSEMBLE_WEIGHT_SECONDARY", "0.40"))
    ENSEMBLE_THRESHOLD: float = float(os.getenv("ENSEMBLE_THRESHOLD", "0.60"))
    FACE_CROP_PADDING: float = float(os.getenv("FACE_CROP_PADDING", "1.3"))
    MAX_UPLOAD_SIZE_MB: int = int(os.getenv("MAX_UPLOAD_SIZE_MB", "10"))

settings = Settings()
