export interface BBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface FaceResult {
  face_index: number;
  bbox: BBox;
  vit_verdict: 'REAL' | 'FAKE' | string;
  vit_confidence: number;
  vit_p_fake: number;
  secondary_verdict: 'REAL' | 'FAKE' | string;
  secondary_confidence: number;
  secondary_p_fake: number;
  ensemble_p_fake: number;
  verdict: 'REAL' | 'FAKE' | string;
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
  final_verdict: 'REAL' | 'FAKE' | 'ERROR' | string;
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
  user_id?: number | null;
  filename: string;
  file_size_bytes?: number;
  final_verdict: string;
  confidence_score: number;
  vit_verdict?: string | null;
  vit_confidence?: number | null;
  secondary_verdict?: string | null;
  secondary_confidence?: number | null;
  ensemble_p_fake?: number | null;
  faces_detected?: number;
  face_results?: string | null;
  attention_map_b64?: string | null;
  processing_time_ms?: number;
  created_at: string;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
}
