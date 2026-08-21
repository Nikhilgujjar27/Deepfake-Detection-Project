# System Architecture — Deepfake Detection Platform

## 1. Overall System Architecture

The system follows an asynchronous, decoupled micro-service design engineered for high-throughput machine learning inference while maintaining responsive HTTP REST communication.

```
[ Client Browser (React + TS + Vite) ]
          │
          ├── HTTP Upload (POST /api/v1/scans/) ────────┐
          ├── SSE Stream (GET /api/v1/scans/{id}/stream) ───┐
          │                                             │   │
          ▼                                             │   │
[ FastAPI Web Gateway (backend/app/main.py) ]           │   │
   ├── Core Security & Auth (JWT + Argon2id)            │   │
   ├── Database Session (SQLAlchemy 2.0 Async)          │   │
   └── Task Dispatcher (Celery Client)                  │   │
          │                                             │   │
          │ [Task Payload: Image Bytes / File Path]     │   │
          ▼                                             │   │
[ Redis Message Broker & State Store ] ◄────────────────┼───┘
          │                                             │
          ▼ [Task Queue]                                │
[ Celery Inference Worker (backend/app/workers/) ]      │
   ├── 1. EXIF Transpose & Image Sanitization          │
   ├── 2. Face Detector (RetinaFace -> MTCNN fallback)  │
   ├── 3. Aligned Face Cropper (1.3x margin padding)    │
   ├── 4. Primary Model: ViT-Base (ONNX Runtime)       │
   ├── 5. Secondary Model: SBI EfficientNet-B4 (PyTorch)│
   ├── 6. Calibrated Decision Fusion Layer              │
   ├── 7. Attention Rollout Heatmap Generator          │
   └── 8. Task State & Result Writeback ────────────────┘
          │
          ▼ [Persistent Record]
[ PostgreSQL Database (Users, Scans, Forensic Logs) ]
```

---

## 2. Component Breakdown

### A. Frontend Layer (`frontend/src/`)
- **Framework:** React 19 with TypeScript, compiled with Vite 6.
- **Styling & Primitives:** Tailwind CSS with Radix UI (shadcn/ui architecture).
- **Core Modules:**
  - `LandingPage`: Product education, deepfake explanation, technology overview.
  - `VerificationInterface`: Drag-and-drop file upload, live progress stream visualizer, webcam snapshot intake.
  - `ResultCard`: Authenticity verdict badge (`REAL` / `FAKE`), confidence gauge, per-face selection tabs.
  - `HeatmapViewer`: Side-by-side interactive visual comparison between original face crop and self-attention heatmaps.
  - `AnalyticsDashboard`: Aggregate system metrics, confidence distributions, history records.
- **State & Streaming:** TanStack Query (`@tanstack/react-query`) for API caching; native `EventSource` hook (`useScanStream`) for unidirectional SSE status feeds.

### B. Backend API Gateway (`backend/app/`)
- **Framework:** FastAPI with Python 3.11/3.12 and Pydantic v2 validation.
- **Routers (`backend/app/api/v1/`):**
  - `/auth`: Registration, login, token refresh (stateless JWT access tokens + secure HTTP-only refresh cookies).
  - `/scans`: Image upload handler, async task initiation, SSE event stream endpoint, scan query/delete.
  - `/users`: Profile management, personal scan history.
  - `/analytics`: Aggregate scan metrics for dashboard.
  - `/support`: In-app user inquiry tickets.
- **Database (`backend/app/db/`):** PostgreSQL 16 managed via SQLAlchemy 2.0 async engine and Alembic schema migrations.

### C. ML Inference Worker (`backend/app/workers/` & `ml_training/`)
- **Queue System:** Celery distributed task queue backed by Redis 7.
- **Worker Concurrency:** Multi-process worker pool isolated from the FastAPI asyncio event loop.
- **Memory & VRAM Management:** Models preloaded at worker startup into local GPU VRAM (NVIDIA RTX 5050 ~8GB total; models consume ~4GB total).

---

## 3. End-to-End ML Inference Pipeline

```
Raw Image Upload
       │
       ▼
1. Image Normalization & EXIF Correction
   └─ PIL ImageOps.exif_transpose (corrects phone orientation metadata)
       │
       ▼
2. Face Detection & Landmark Extraction
   ├─ Primary: RetinaFace (ResNet50 / MobileNet backbone)
   └─ Fallback: MTCNN (if 0 faces detected by RetinaFace)
       │
       ▼
3. Standardized Bounding Box Crop & Alignment
   ├─ Expand detected bbox by exactly 1.3x (30% padding)
   ├─ Landmark affine transformation (eyes horizontal alignment)
   └─ Resize to 256x256 before inference transform
       │
       ▼
4. Dual-Stream Feature Extraction & Inference
   ├──────────────────────────────────────┬──────────────────────────────────────┐
   ▼                                      ▼
Primary Stream: ViT-Base               Secondary Stream: SBI EfficientNet-B4
• google/vit-base-patch16-224          • mapooon/SelfBlendedImages (CVPR 2022)
• 86.5M Parameters, ONNX Runtime       • 19M Parameters, PyTorch / ONNX
• Global patch self-attention          • Local CNN texture & blending artifact
• Input: 224x224x3 (ImageNet norm)     • Input: 224x224x3 (ImageNet norm)
• Output: P_ViT(Fake) in [0.0, 1.0]    • Output: P_SBI(Fake) in [0.0, 1.0]
   │                                      │
   └──────────────────┬───────────────────┘
                      ▼
5. Calibrated Decision Fusion Layer
   └─ P_Final(Fake) = w_ViT * P_ViT + w_SBI * P_SBI  (Weights calibrated empirically)
   └─ Verdict: REAL if P_Final < 0.50 else FAKE
       │
       ▼
6. Explainability Extraction
   └─ ViT Attention Rollout on final encoder layer -> [14x14] CLS attention -> Upscale to face crop -> Apply COLORMAP_JET
       │
       ▼
7. Response Payload Assembly
   └─ Bounding boxes, per-face verdicts, overall image verdict, confidence, base64 heatmaps, latency, EXIF metadata
```

---

## 4. Database Schema Flow

```
[ users ]
  ├── id (UUID, PK)
  ├── email (VARCHAR, Unique, Indexed)
  ├── hashed_password (VARCHAR)
  ├── created_at (TIMESTAMP)
  └── scans (Relationship -> [ scans ])

[ scans ]
  ├── id (UUID, PK)
  ├── user_id (UUID, FK -> users.id, Nullable for guest scans)
  ├── image_hash (VARCHAR, SHA256 for duplicate detection)
  ├── file_path (VARCHAR)
  ├── overall_verdict (VARCHAR: 'REAL' | 'FAKE')
  ├── overall_confidence (FLOAT)
  ├── face_count (INTEGER)
  ├── processing_time_ms (FLOAT)
  ├── exif_metadata (JSONB)
  ├── face_results (JSONB: Bounding boxes, per-face scores, heatmap paths)
  └── created_at (TIMESTAMP)

[ support_tickets ]
  ├── id (UUID, PK)
  ├── user_id (UUID, FK -> users.id, Nullable)
  ├── subject (VARCHAR)
  ├── message (TEXT)
  └── created_at (TIMESTAMP)
```

---

## 5. Deployment & Execution Environment

| Service | Execution Mode | Hardware Target | Port / Socket |
|---|---|---|---|
| **FastAPI Backend** | Uvicorn / Gunicorn | CPU (Async I/O) | `localhost:8000` |
| **Celery Inference Worker** | Standalone Process | NVIDIA RTX 5050 (CUDA) | Redis Broker Connection |
| **Redis** | Docker Container / Service | Memory | `localhost:6379` |
| **PostgreSQL** | Docker Container / Service | Disk / Memory | `localhost:5432` |
| **React Frontend** | Vite Dev Server / Nginx | Web Browser | `localhost:5173` |

---

## 6. External Dependencies & Boundaries
- **No Cloud Inference API Dependency:** Detection is 100% self-contained locally on the host machine; no dependency on Google Gemini, OpenAI, or 3rd-party vision APIs for the classification verdict.
- **HuggingFace Hub:** Used strictly for downloading open-source model weights during build/setup (`google/vit-base-patch16-224`).
