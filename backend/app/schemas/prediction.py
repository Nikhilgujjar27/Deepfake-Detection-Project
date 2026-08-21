from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class FaceResult(BaseModel):
    index: int
    bbox: Dict[str, float]
    vit_verdict: str
    vit_confidence: float
    secondary_verdict: str
    secondary_confidence: float
    ensemble_p_fake: float
    face_verdict: str
    face_confidence: float
    attention_map: Optional[str] = None

class PredictionResponse(BaseModel):
    final_verdict: str
    confidence_score: float
    faces_detected: int
    face_results: List[FaceResult]
    processing_time_ms: float
    metadata: Dict[str, Any]

class ScanHistoryResponse(BaseModel):
    id: int
    filename: str
    final_verdict: str
    confidence_score: float
    faces_detected: int
    processing_time_ms: float
    created_at: datetime
    
    model_config = {
        "from_attributes": True
    }
