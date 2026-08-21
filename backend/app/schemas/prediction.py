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
    user_id: Optional[int] = None
    filename: str
    file_size_bytes: Optional[int] = 0
    final_verdict: str
    confidence_score: float
    vit_verdict: Optional[str] = "N/A"
    vit_confidence: Optional[float] = 0.0
    secondary_verdict: Optional[str] = "N/A"
    secondary_confidence: Optional[float] = 0.0
    ensemble_p_fake: Optional[float] = 0.0
    faces_detected: Optional[int] = 1
    face_results: Optional[str] = None
    attention_map_b64: Optional[str] = None
    processing_time_ms: Optional[float] = 0.0
    created_at: datetime
    
    model_config = {
        "from_attributes": True
    }
