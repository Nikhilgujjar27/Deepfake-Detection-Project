# DeepSentry — Frontend Page & Component UI Specification

> **Comprehensive Component & Page Blueprint**  
> **Master Reference for Sketch UI Design & React Mapping**

---

## 1. Route Inventory

| Route | Page Component | Auth Status | Purpose | Primary API Calls |
| :--- | :--- | :---: | :--- | :--- |
| `/` | `Home.tsx` | Public | Product overview, visual forensics showcase, live canvas, metrics | None (Static / Animated) |
| `/scan` | `Scanner.tsx` | Public / Hybrid | Core forensic workstation: upload, webcam, multi-stage processing, result view | `POST /api/v1/predict/analyze` |
| `/history` | `HistoryPage.tsx` | **Protected** | Searchable, filterable audit log of past forensic scans | `GET /api/v1/history/`, `DELETE /api/v1/history/{id}` |
| `/education` | `Education.tsx` | Public | Interactive academy: anatomical failure modes & spotter quiz | None (Interactive Local State) |
| `/architecture`| `Architecture.tsx`| Public | Technical pipeline inspector, model card, mathematical formulation | None (Interactive Local State) |
| `/about` | `About.tsx` | Public | Platform mission, engineering ethos, open source reproducibility | None (Static) |
| `/login` | `Login.tsx` | Public (Guest) | Split layout authentication sign-in | `POST /api/v1/auth/login`, `GET /api/v1/auth/me` |
| `/register` | `Register.tsx` | Public (Guest) | Split layout account registration | `POST /api/v1/auth/register`, `GET /api/v1/auth/me` |

---

## 2. Page Specifications

---

### Page 1: Home (`/`)

* **Route:** `/`
* **Authentication:** None
* **Purpose:** High-impact landing page introducing DeepSentry's evidence-based detection, real metrics, and live visual inspection canvas.
* **Layout:**
  * **Header/Navbar:** Sticky navigation with logo, nav items, and primary CTA.
  * **Main Container:** `max-w-7xl` ($1280\text{px}$–$1360\text{px}$) with comfortable side padding.
  * **Footer:** Compact 4-column footer.
* **Section & Component Breakdown:**
  1. **Hero Section (`HomeHero`):**
     * *Left Column:* Model status badge, $H1$ headline (*"Evidence-Based Deepfake Detection with Explainable AI"*), subtitle, CTA buttons (*"Launch Forensic Studio"*, *"Forensics Academy"*), and 3 bullet proof points.
     * *Right Column:* **Live Inspection Canvas (`CanvasPreview`)**: Interactive visual face box with mode toggle (*Patches 196 / Attention Map / 1.3× BBox*), animated laser sweep line, and live confidence badge.
  2. **Metrics Grid (`MetricsSection`):**
     * 4 animated counter cards triggered via `useInView` & `useAnimatedCount`:
       * `99.00%` Benchmark Test Accuracy
       * `90.0%` Smartphone Photo Accuracy
       * `<600ms` Inference Latency
       * `196` Self-Attention Tokens
  3. **Architectural Pillars Grid (`PillarsGrid`):**
     * 3 interactive cards: *Vision Transformer Core*, *Calibrated Dual-Model Fusion*, *Explainable Heatmaps*.
  4. **Empirical Benchmark Table (`BenchmarkTable`):**
     * Comparative table comparing Legacy ($40\%$ wide crop + CLAHE) vs Phase 3 Isolated ViT vs DeepSentry Calibrated 60/40 Ensemble.
  5. **Action Banner (`ActionBanner`):**
     * Dark slate card with centered CTA leading to `/scan`.

---

### Page 2: Forensic Studio (`/scan`)

* **Route:** `/scan`
* **Authentication:** Hybrid (Open to all; saves to database if authenticated).
* **Purpose:** Core forensic workbench for uploading or capturing facial imagery, observing multi-stage execution, and analyzing comprehensive results.
* **Layout:**
  * **Header/Navbar:** Standard sticky navbar.
  * **Container:** `max-w-7xl` ($1280\text{px}$).
* **State Machine for `/scan`:**
```text
  ┌──────────────┐
  │     IDLE     │ ◄─── (Select File / Open Webcam)
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ FILE_LOADED  │ ◄─── (Preview rendered, "Start Forensic Analysis" CTA)
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │  PROCESSING  │ ◄─── (5-Stage Visual Analysis Animation + API Call)
  └──────┬───────┘
         │
    ┌────┴────────────────────────┐
    ▼                             ▼
┌───────────────┐           ┌───────────┐
│ RESULT_READY  │           │   ERROR   │
│ (Command Ctr) │           │ (Alert)   │
└───────────────┘           └───────────┘
```
* **Subcomponents Breakdown:**
  1. **Upload Dropzone (`UploadZone`):**
     * Drag-and-drop bounding box with active dashed border hover state.
     * "Select File" file input button + "Use Webcam" camera stream button.
     * File type indicator: `JPEG • PNG • WEBP • Max 10 MB`.
  2. **Multi-Stage Processing Overlay (`AnalysisPipelineOverlay`):**
     * Rendered during API execution. Displays 5 animated checklist stages:
       * *Stage 1:* Media Ingestion & EXIF Provenance
       * *Stage 2:* Face Extraction & 1.3× Bounding
       * *Stage 3:* ViT-B/16 Multi-Head Self-Attention
       * *Stage 4:* Secondary Boundary Artifact Scan
       * *Stage 5:* Calibrated 60/40 Ensemble Fusion
  3. **Forensic Command Center (Result View):**
     * **Verdict Banner (`VerdictBanner`):** Large header displaying `AUTHENTIC REAL MEDIA` (Emerald) or `SYNTHETIC / DEEPFAKE DETECTED` (Rose), animated certainty counter (`{{confidence}}%`), and quick actions (*Export JSON Report*, *Inspect New Image*).
     * **Multi-Face Tab Bar (`FaceSelector`):** Rendered if `faces_detected > 1`, allowing seamless switching between face crops.
     * **Image Source Card (`MediaInspectionCard`):** Displays original image with face region indicator, face count, and latency in milliseconds.
     * **EXIF Provenance Card (`ExifForensicsCard`):** Displays Camera Device, Timestamp, Software, ISO, and expandable metadata integrity status (*Hardware Sensor Verified* vs *Synthetic/Stripped*).
     * **Dual-Model Consensus Gauge (`EnsembleGauge`):** Animated horizontal progress bars for Primary ViT ($60\%$ weight) and Secondary Boundary ($40\%$ weight), along with the Calibrated Fusion bar and decision boundary pin ($\tau=0.60$).
     * **ViT Attention Heatmap Viewer (`AttentionHeatmapViewer`):** Interactive card featuring Overlay vs Side-by-Side toggle, opacity slider ($20\%$–$100\%$), zoom controls ($80\%$–$180\%$), and Jet colormap interpretation guide.

---

### Page 3: Audit History (`/history`)

* **Route:** `/history`
* **Authentication:** **Required** (Displays "Sign In to Continue" card if unauthenticated).
* **Purpose:** Archival audit log where investigators review, search, filter, and delete previously scanned forensic records.
* **Layout:**
  * **Top Toolbar:** Live search input (by filename) + Segmented verdict filter control (*All Results / REAL / FAKE*) + Refresh action button.
  * **Desktop Table View ($\ge 768\text{px}$):** Clean table with columns: `Verdict Badge`, `Filename`, `Confidence`, `Primary ViT`, `Secondary Model`, `Date & Time`, `Actions` (Delete icon with confirmation).
  * **Mobile Card List View ($< 768\text{px}$):** Stacked cards displaying verdict, filename, confidence metrics grid, and timestamps.
  * **Empty State:** Clean illustration with *"Start New Verification"* CTA when no scans exist.
  * **Defensive Rendering:** All numbers formatted through `formatConfidence` with safe fallbacks (`—`) to prevent `.toFixed()` exceptions.

---

### Page 4: Forensics Academy (`/education`)

* **Route:** `/education`
* **Authentication:** None
* **Purpose:** Educational intelligence module breaking down synthetic generation artifacts and testing visual literacy through an interactive quiz.
* **Subcomponents:**
  1. **Anatomical Failure Modes (`FailureModeCards`):**
     * 4 cards with click-to-expand forensic inspection tips:
       * *1. Corneal Specular Reflection Asymmetry*
       * *2. Ear Lobe & Jewelry Topology Gaps*
       * *3. Teeth & Interdental Separation Smearing*
       * *4. Face-Swap Boundary Blending Seams*
  2. **Interactive Spotter Quiz (`SpotterQuiz`):**
     * Live score counter (`Score: X / 3`) and reset action.
     * 3 multiple choice questions with immediate visual feedback (Emerald check for correct, Coral cross for incorrect) and detailed anatomical explanations.

---

### Page 5: System Architecture (`/architecture`)

* **Route:** `/architecture`
* **Authentication:** None
* **Purpose:** Transparent technical documentation of the 86.5M parameter Vision Transformer backbone, calibrated ensemble mathematics, and hardware telemetry.
* **Subcomponents:**
  1. **Interactive 4-Stage Pipeline Inspector (`PipelineInspector`):**
     * 4 clickable stages (*Stage 1 EXIF $\rightarrow$ Stage 2 1.3× Crop $\rightarrow$ Stage 3 ViT-B/16 $\rightarrow$ Stage 4 Calibrated Fusion*).
     * Live Inspector Card displaying description, exact Tensor Input shape, and Tensor Output shape.
  2. **Mathematical Formulation Card (`ModelCard`):**
     * Technical monospace model card showing $P_{\text{ens}}(\text{Fake}) = 0.60 \cdot P_{\text{ViT}} + 0.40 \cdot P_{\text{Sec}}$ and decision threshold $\tau=0.60$.
  3. **Hardware Specs & Telemetry Card (`TelemetryCard`):**
     * Key-value specs: $86.5\text{M}$ params, $327\text{ MB}$ weights, $\sim 600\text{ms}$ CPU / $\sim 35\text{ms}$ CUDA latency, $1.2\text{ GB}$ VRAM footprint.

---

### Page 6: About (`/about`)

* **Route:** `/about`
* **Authentication:** None
* **Purpose:** Platform mission, engineering approach, and open-source reproducibility.
* **Subcomponents:**
  1. **Engineering Ethos Card:** Empirical measurement, transparent AI, zero unverified heuristics.
  2. **4 Core Capability Cards:** Vision Transformer Backbone, Self-Attention Explainability, High-Throughput REST API, Open Source & Reproducibility (with direct GitHub link).

---

### Page 7 & 8: Authentication (`/login`, `/register`)

* **Routes:** `/login`, `/register`
* **Authentication:** Public (Redirects to `/scan` upon successful authentication).
* **Layout:** Desktop dual-column split ($5\text{ cols}$ visual diagram / $7\text{ cols}$ auth card) $\rightarrow$ Mobile single-column card.
* **Left Column:** DeepSentry forensic pipeline illustration with 3 privilege bullets.
* **Right Card:**
  * Clean form inputs with Lucide icons (`Mail`, `Lock`, `User`) and generous `pl-10 pr-10` padding (zero text/icon overlap).
  * Password visibility toggle (`Eye` / `EyeOff`).
  * Generic placeholder values strictly (`you@example.com`, `alex_analyst`).
  * Clean loading button with `Loader2` spinner.
