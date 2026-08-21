import json
import logging
from typing import Optional
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.database import get_db
from app.models.user import User
from app.models.scan import ScanHistory
from app.schemas.prediction import PredictionResponse
from app.services.inference_service import InferenceService
from app.core.security import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/predict", tags=["Prediction"])


@router.post("/analyze", response_model=PredictionResponse)
def analyze_image(
    file: UploadFile = File(...),
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
    if file.content_type and file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{file.content_type}'. Please upload JPEG, PNG, or WEBP."
        )

    # 2. Read bytes & validate size
    image_bytes = file.file.read()
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(image_bytes) > max_bytes:
        raise HTTPException(
            status_code=400,
            detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_MB} MB."
        )

    # 3. Execute Calibrated Ensemble Inference
    try:
        service = InferenceService.get_instance()
        result = service.predict(image_bytes)

        # 4. Save to ScanHistory if user is authenticated
        if current_user:
            try:
                primary_face = result["faces"][0] if result["faces"] else {}
                scan_record = ScanHistory(
                    user_id=current_user.id,
                    filename=file.filename or "upload.jpg",
                    file_size_bytes=len(image_bytes),
                    final_verdict=result["final_verdict"],
                    confidence_score=result["confidence"],
                    vit_verdict=primary_face.get("vit_verdict", "N/A"),
                    vit_confidence=primary_face.get("vit_confidence", 0.0),
                    secondary_verdict=primary_face.get("secondary_verdict", "N/A"),
                    secondary_confidence=primary_face.get("secondary_confidence", 0.0),
                    ensemble_p_fake=primary_face.get("ensemble_p_fake", 0.0),
                    faces_detected=result["faces_detected"],
                    face_results=json.dumps(result["faces"]),
                    attention_map_b64=primary_face.get("attention_map"),
                    processing_time_ms=result["processing_time_ms"]
                )
                db.add(scan_record)
                db.commit()
            except Exception as db_err:
                logger.warning(f"Failed to persist scan record: {db_err}")

        return result

    except ValueError as val_err:
        logger.error(f"Image processing value error: {val_err}")
        raise HTTPException(status_code=400, detail=str(val_err))
    except Exception as err:
        logger.exception(f"Unexpected inference pipeline exception: {err}")
        raise HTTPException(status_code=500, detail=f"Inference error: {str(err)}")
