export interface BBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface FaceResult {
  face_index: number;
  bbox: BBox;
  vit_verdict: 'REAL' | 'FAKE';
  vit_confidence: number;
  vit_p_fake: number;
  secondary_verdict: 'REAL' | 'FAKE';
  secondary_confidence: number;
  secondary_p_fake: number;
  ensemble_p_fake: number;
  verdict: 'REAL' | 'FAKE';
  confidence: number;
  attention_map?: string | null;
}

export interface ExifMetadata {
  has_exif: boolean;
  camera_make?: string | null;
  camera_model?: string | null;
  software?: string | null;
  datetime_original?: string | null;
  iso_speed?: number | null;
  [key: string]: unknown;
}

export interface PredictionResponse {
  final_verdict: 'REAL' | 'FAKE' | 'ERROR';
  confidence: number;
  faces_detected: number;
  faces: FaceResult[];
  metadata: ExifMetadata;
  processing_time_ms: number;
}

export interface User {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  created_at: string;
}

export interface ScanHistoryItem {
  id: number;
  filename: string;
  file_size_bytes: number;
  final_verdict: string;
  confidence_score: number;
  vit_verdict: string;
  vit_confidence: number;
  secondary_verdict: string;
  secondary_confidence: number;
  ensemble_p_fake: number;
  faces_detected: number;
  face_results: string;
  attention_map_b64?: string;
  processing_time_ms: number;
  created_at: string;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
}
