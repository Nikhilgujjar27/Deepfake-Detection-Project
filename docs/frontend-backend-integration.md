# DeepSentry — Frontend & Backend Integration Architecture

> **Master Technical Reference Document**  
> **Status:** Verified from Live Codebase (`v2.0.0`)  
> **Purpose:** Single source of truth for Sketch UI/UX design, React implementation, and FastAPI/ML integration.

---

## 1. System Architecture Diagram

```text
┌────────────────────────────────────────────────────────────────────────┐
│                              SKETCH UI                                 │
│                   Master Visual Design & Design Tokens                 │
│         (1440px Desktop / 768px Tablet / 390px Mobile Artboards)       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    │ 1:1 Design Component Handoff
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      FRONTEND LAYER (React 19 + Vite)                  │
│                                                                        │
│  Pages:                                                                │
│   • Home (/)                       • Scanner (/scan)                   │
│   • HistoryPage (/history)         • Education (/education)            │
│   • Architecture (/architecture)   • About (/about)                    │
│   • Login (/login)                 • Register (/register)              │
│                                                                        │
│  State & Context:                                                      │
│   • AuthContext (JWT, user profile, isAuthenticated)                   │
│   • Local Component State (drop zone, webcam stream, active face tabs) │
│                                                                        │
│  Networking & Utilities:                                               │
│   • Axios Client (Bearer Token Interceptor, BaseURL via Vite)          │
│   • Error Boundary (Global render crash protection)                    │
│   • Defensive formatters (formatConfidence, formatBytes, formatDate)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    │ HTTP / REST / JSON / Multipart-FormData
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        BACKEND API LAYER (FastAPI)                     │
│                                                                        │
│  Routers (/api/v1):                                                    │
│   • POST /auth/register         → 201 Created (Token)                  │
│   • POST /auth/login            → 200 OK (Token)                       │
│   • GET  /auth/me               → 200 OK (User Profile, Auth Required) │
│   • POST /predict/analyze       → 200 OK (PredictionResponse)         │
│   • GET  /history/              → 200 OK (List[ScanHistoryResponse])   │
│   • GET  /history/{id}          → 200 OK (ScanHistoryResponse)         │
│   • DELETE /history/{id}        → 200 OK (Deletion confirmation)       │
│   • GET  /health                → 200 OK (Health telemetry)            │
│                                                                        │
│  Security & DB Middleware:                                             │
│   • Direct Bcrypt Hashing (72-byte safe truncation)                    │
│   • PyJWT (HS256 algorithm, 1440 min expiration)                       │
│   • SQLAlchemy 2.0 ORM Session Dependency                              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
┌───────────────────────────────────┐ ┌──────────────────────────────────┐
│      ML FORENSICS SUBSYSTEM       │ │       DATABASE SUBSYSTEM         │
│                                   │ │                                  │
│ 1. Face Detection:                │ │  Engine: SQLite                  │
│    • OpenCV Haar Cascade          │ │  Path: deepfake_sentry.db        │
│    • 1.3× Margin Standardized BBox│ │                                  │
│                                   │ │  Tables:                         │
│ 2. Primary Deepfake Model:        │ │  • users:                        │
│    • ViT-Base-Patch16-224         │ │    id, email, username,          │
│    • 86.5M Parameters             │ │    hashed_password, is_active,   │
│    • 196 Patch Tokens             │ │    created_at                    │
│                                   │ │                                  │
│ 3. Secondary Boundary Model:      │ │  • scan_history:                 │
│    • Deep-Fake-Detector-v2 (HF)   │ │    id, user_id (FK), filename,   │
│                                   │ │    file_size_bytes, final_verdict│
│ 4. Calibrated 60/40 Fusion:       │ │    confidence_score,             │
│    • P_ens = 0.60*ViT + 0.40*Sec  │ │    vit_verdict, vit_confidence,  │
│    • Decision Threshold: τ = 0.60 │ │    secondary_verdict,            │
│                                   │ │    secondary_confidence,         │
│ 5. Explainability Layer:          │ │    ensemble_p_fake,              │
│    • 12-Layer Attention Rollout   │ │    faces_detected, face_results, │
│    • Jet Colormap Heatmap (PNG/b64│ │    attention_map_b64,            │
│                                   │ │    processing_time_ms, created_at│
│ 6. EXIF Hardware Metadata:        │ │                                  │
│    • Camera, ISO, Software, Date  │ │                                  │
└───────────────────────────────────┘ └──────────────────────────────────┘
```

---

## 2. Technology Stack Breakdown

### Frontend Specification
* **Framework:** React `19.0.0`
* **Language:** TypeScript `5.7.3`
* **Build Tool:** Vite `6.1.0` (Fast HMR, ES module bundling)
* **Routing:** React Router DOM `7.1.5` (`BrowserRouter`, `Routes`, `Route`, `Link`, `useNavigate`, `useLocation`)
* **Styling Engine:** Tailwind CSS `4.0.6` with `@tailwindcss/vite`
* **Icons:** `lucide-react` `0.475.0` (100% SVG icon standard, no emoji UI)
* **HTTP Client:** `axios` `1.7.9` (configured with request interceptor for Bearer JWT token)
* **State Management:** React Context (`AuthContext`) for authentication session + React hooks (`useState`, `useEffect`, `useCallback`, `useRef`) for local component state.
* **Custom Hooks:**
  * `useAnimatedCount(target, duration, decimals, trigger)`: Smooth easing numerical counters for metrics and confidence scores with reduced-motion support.
  * `useInView(options)`: `IntersectionObserver` hook for scroll-triggered visual reveals.

### Backend Specification
* **Framework:** FastAPI `0.115.x` (Python 3.13)
* **ASGI Server:** Uvicorn `0.30.x` running on `127.0.0.1:8000`
* **Database & ORM:** SQLAlchemy `2.0.x` using SQLite (`deepfake_sentry.db`)
* **Data Validation:** Pydantic `2.0.x` (`BaseModel` schemas)
* **Security & Auth:** Direct `bcrypt` password hashing + `python-jose` for JWT (`HS256`, 1440 min token lifetime)
* **CORS:** FastAPI `CORSMiddleware` configured for `http://localhost:5173`, `http://127.0.0.1:5173`, and port `3000`/`8000` origins.

### ML & Forensics Subsystem
* **Deep Learning Runtime:** PyTorch `2.x` + Torchvision `0.15.x` + HuggingFace Transformers
* **Primary Backbone:** Vision Transformer `ViT-Base-Patch16-224` ($86.5\text{M}$ parameters) loaded from `models/baseline/vit_deepfake_v1_baseline.pth` ($327\text{ MB}$).
* **Secondary Detector:** `prithivMLmods/Deep-Fake-Detector-v2-Model` (local HuggingFace cache).
* **Face Detector:** OpenCV `CascadeClassifier` (`haarcascade_frontalface_default.xml`) with $1.3\times$ standardized geometric margin.
* **Explainability:** 12-layer multi-head self-attention rollout mapped to Jet colormap base64 PNG.

---

## 3. End-to-End Forensic Workflow

```text
[User selects/drops image or captures webcam]
                       │
                       ▼
[Frontend: validates format (JPEG/PNG/WEBP) & size (<=10MB)]
                       │
                       ▼
[Frontend: POST /api/v1/predict/analyze (multipart/form-data)]
                       │
                       ▼
[FastAPI: extracts bytes, optional JWT Bearer token]
                       │
                       ▼
[InferenceService.predict(image_bytes)]
  ├─ 1. PIL decode & EXIF metadata extraction (Camera, ISO, Software, Timestamp)
  ├─ 2. EXIF orientation transposition & RGB conversion
  ├─ 3. FaceDetector: detects faces, applies 1.3x margin padding, resizes to 224x224
  ├─ 4. For each face:
  │     ├─ Normalized with ImageNet mean/std
  │     ├─ Primary ViT forward pass (with output_attentions=True) -> P_ViT(Fake)
  │     ├─ Secondary detector forward pass -> P_Sec(Fake)
  │     ├─ Calibrated 60/40 Fusion: P_ens = 0.60 * P_ViT + 0.40 * P_Sec
  │     ├─ Verdict: FAKE if P_ens >= 0.60 else REAL
  │     └─ ViT Attention Rollout -> Jet Heatmap (Base64 PNG)
  ├─ 5. Multi-face majority consensus
  └─ 6. Compute execution latency (ms)
                       │
                       ▼
[If authenticated: ScanHistory record auto-saved to SQLite database]
                       │
                       ▼
[FastAPI returns PredictionResponse JSON]
                       │
                       ▼
[Frontend receives payload -> renders Command Center:]
  ├─ Large Verdict Banner (REAL / FAKE) with animated confidence counter
  ├─ Multi-Face selector tabs (if faces_detected > 1)
  ├─ Dual-Model Consensus Gauge with decision threshold marker (τ=0.60)
  ├─ ViT Self-Attention Heatmap Viewer (Overlay / Side-by-Side, Opacity slider, Zoom)
  ├─ Expandable EXIF Hardware Forensics Card (Provenance verified vs Stripped)
  └─ Export JSON Report action
```

---

## 4. Authentication & Session Lifecycle

1. **Registration:**
   - Client sends `POST /api/v1/auth/register` with `email`, `username`, `password`.
   - Backend hashes password with `bcrypt.hashpw(pwd, gensalt())`.
   - Generates JWT token (`sub: email`).
   - Returns `{ access_token, token_type: "bearer" }` with `HTTP 201 Created`.
2. **Login:**
   - Client sends `POST /api/v1/auth/login` with `email`, `password`.
   - Backend validates with `bcrypt.checkpw()`.
   - Returns `{ access_token, token_type: "bearer" }` with `HTTP 200 OK`.
3. **Session Persistence:**
   - Client stores `access_token` in `localStorage.getItem('deepsentry_token')`.
   - On app startup, `AuthContext` calls `GET /api/v1/auth/me` to validate session and hydrate `{ id, email, username, is_active, created_at }`.
   - If token is invalid or expired, client removes key from `localStorage` and resets state to unauthenticated without throwing uncaught errors.
4. **Logout:**
   - Client clears `localStorage.removeItem('deepsentry_token')` and resets auth state.
