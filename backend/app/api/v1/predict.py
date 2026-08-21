from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import logging

from app.core.config import settings
from app.services.inference_service import InferenceService

# Mocking a dependency for current_user if it doesn't exist yet
# Replace with actual get_current_user dependency if available
def get_current_user_optional():
    return None

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/predict", tags=["Prediction"])

class BBox(BaseModel):
    x1: int
    y1: int
    x2: int
    y2: int

class FaceResult(BaseModel):
    face_index: int
    bbox: BBox
    vit_prob: float
    sec_prob: float
    ensemble_prob: float
    verdict: str
    attention_map: Optional[str]

class PredictionResponse(BaseModel):
    final_verdict: str
    confidence: float
    faces: List[FaceResult]
    metadata: Dict[str, Any]
    processing_time_ms: int

@router.post("/analyze", response_model=PredictionResponse)
async def analyze_image(
    file: UploadFile = File(...),
    current_user = Depends(get_current_user_optional)
):
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, and WEBP are supported.")
        
    # Read bytes
    image_bytes = await file.read()
    
    # Validate file size
    max_size_bytes = getattr(settings, 'MAX_UPLOAD_SIZE_MB', 10) * 1024 * 1024
    if len(image_bytes) > max_size_bytes:
        raise HTTPException(status_code=400, detail=f"File too large. Maximum size is {settings.MAX_UPLOAD_SIZE_MB} MB.")
        
    try:
        service = InferenceService.get_instance()
        result = service.predict(image_bytes)
        
        # Save scan to database if user authenticated (Placeholder logic)
        if current_user:
            logger.info(f"Saving scan for user {current_user}")
            # db.save_scan(user_id=current_user.id, result=result)
            
        return PredictionResponse(**result)
        
    except ValueError as e:
        logger.error(f"Value error during prediction: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.exception("Internal error during prediction")
        raise HTTPException(status_code=500, detail="Internal server error during analysis.")
