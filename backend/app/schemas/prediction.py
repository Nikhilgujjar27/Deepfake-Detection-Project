from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class BBox(BaseModel):
    x1: int
    y1: int
    x2: int
    y2: int

class FaceResult(BaseModel):
    face_index: int
    bbox: Dict[str, Any]
    vit_verdict: str
    vit_confidence: float
    vit_p_fake: float
    secondary_verdict: str
    secondary_confidence: float
    secondary_p_fake: float
    ensemble_p_fake: float
    verdict: str
    confidence: float
    attention_map: Optional[str] = None

class PredictionResponse(BaseModel):
    final_verdict: str
    confidence: float
    faces_detected: int
    faces: List[FaceResult]
    metadata: Dict[str, Any]
    processing_time_ms: float

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
