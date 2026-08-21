# DeepSentry — Master Sketch UI/UX Design Handoff Specification

> **The Definitive Engineering & UI/UX Bridge for DeepSentry**  
> **Status:** Final Architectural Specification (`v2.0.0`)  
> **Authoritative Target:** Sketch UI Design $\rightarrow$ React 19 Component Implementation $\rightarrow$ FastAPI & PyTorch Backend

---

## 1. Core Design Principles

1. **Digital Forensics + Precision + Trust:**  
   The UI communicates deep technical capability and forensic credibility. Avoid generic AI glowing gradients, saturated cartoonish colors, or ungrounded statistics.
2. **Generous Spacing & High-Resolution Layout:**  
   Designed for desktop monitors ($1920\times1080$ and $1440\times900$) using a responsive `max-w-7xl` container ($1280\text{px}$–$1360\text{px}$) with comfortable side gutters, while gracefully collapsing into stacked cards on mobile ($390\text{px}$).
3. **Restrained Color Coding:**  
   * **Emerald (`#059669` / `#10B981`):** Authentic real media, sensor verification, correct quiz answers.
   * **Rose / Coral (`#E11D48` / `#F43F5E`):** Synthetic deepfakes, anomalies, incorrect answers.
   * **Amber (`#D97706`):** Stripped metadata, review warning.
   * **Deep Indigo Blue (`#2563EB`):** Primary branding, active tabs, buttons.
4. **Authentic Data Grounding:**  
   Every single UI element, badge, and metric in Sketch maps directly to an existing database column, Pydantic schema field, or PyTorch inference tensor.

---

## 2. Sketch Artboards & Screens Checklist

### Desktop Artboards ($1440\text{px} \times \text{Auto}$)
1. `Desktop / Home / Default (1440)` — Full hero with interactive canvas, 4 animated metrics, architecture pillars, benchmark table, and action banner.
2. `Desktop / Scan / 01_Upload_Idle (1440)` — Dropzone with "Select File", "Use Webcam", format badges.
3. `Desktop / Scan / 02_Upload_Dragging (1440)` — Active drag-over state with blue accent dashed border.
4. `Desktop / Scan / 03_Processing_Sequence (1440)` — Active multi-stage processing overlay (Stages 1–5 checklist).
5. `Desktop / Scan / 04_Result_Authentic_Real (1440)` — Full command center with Emerald verdict, consensus bars, EXIF hardware card, and Jet attention heatmap.
6. `Desktop / Scan / 05_Result_Synthetic_Fake (1440)` — Full command center with Rose verdict, deepfake consensus, and anomaly heatmap rollout.
7. `Desktop / History / Default (1440)` — Search toolbar, segmented filter tabs (All/REAL/FAKE), table with verdict pills, certainty percentages, and actions.
8. `Desktop / History / Empty_State (1440)` — Clean empty state with "Start New Verification" CTA.
9. `Desktop / History / Delete_Confirm_Modal (1440)` — Modal dialog confirming record deletion.
10. `Desktop / Academy / Default (1440)` — 4 anatomical failure mode cards + interactive spotter quiz with score counter.
11. `Desktop / Academy / Card_Expanded (1440)` — Card #1 expanded showing forensic inspection tip.
12. `Desktop / Architecture / Default (1440)` — Interactive 4-stage pipeline inspector, mathematical formulation card, hardware specs telemetry card.
13. `Desktop / About / Default (1440)` — Mission ethos, 4 technical capability cards, GitHub link.
14. `Desktop / Login / Default (1440)` — Dual-column split layout with left pipeline diagram and right sign-in card.
15. `Desktop / Register / Default (1440)` — Dual-column split layout with left platform privileges and right sign-up card.

### Mobile Artboards ($390\text{px} \times \text{Auto}$)
1. `Mobile / Home (390)` — Single-column stacked hero, canvas preview, metrics grid, and cards.
2. `Mobile / Navigation_Drawer_Open (390)` — Slide-down mobile drawer with all navigation links and auth buttons.
3. `Mobile / Scan / Upload_Idle (390)` — Compact dropzone with stacked action buttons.
4. `Mobile / Scan / Result_Command_Center (390)` — Stacked command center (Verdict $\rightarrow$ Media Card $\rightarrow$ Consensus $\rightarrow$ Heatmap $\rightarrow$ EXIF).
5. `Mobile / History / Card_List (390)` — Stacked card list replacing the desktop table.
6. `Mobile / Academy (390)` — Stacked failure cards and full-width quiz options.
7. `Mobile / Architecture (390)` — Vertical stage selectors and stacked model card.
8. `Mobile / Login (390)` — Single-column auth card.
9. `Mobile / Register (390)` — Single-column register card.

---

## 3. Dynamic Data Placeholders for Sketch

When designing dynamic components in Sketch, use these explicit string tokens:

| Placeholder Token | Visual Field | Example Value in Sketch | Data Source |
| :--- | :--- | :--- | :--- |
| `{{final_verdict}}` | Master Verdict Badge | `AUTHENTIC REAL MEDIA` or `SYNTHETIC / DEEPFAKE DETECTED` | `PredictionResponse.final_verdict` |
| `{{confidence}}` | Master Certainty Score | `96.0%` | `PredictionResponse.confidence` |
| `{{faces_detected}}` | Number of Faces Found | `1 Face Detected` | `PredictionResponse.faces_detected` |
| `{{vit_verdict}}` | ViT Model Verdict | `REAL (98.2%)` | `FaceResult.vit_verdict` + `vit_confidence` |
| `{{vit_p_fake}}` | ViT Fake Probability | `1.8% Fake / 98.2% Real` | `FaceResult.vit_p_fake` |
| `{{secondary_verdict}}` | Boundary Model Verdict | `REAL (92.6%)` | `FaceResult.secondary_verdict` + `secondary_confidence` |
| `{{secondary_p_fake}}` | Boundary Fake Probability | `7.4% Fake / 92.6% Real` | `FaceResult.secondary_p_fake` |
| `{{ensemble_p_fake}}` | Calibrated Fusion Probability | `4.0% Ensemble P(Fake)` | `FaceResult.ensemble_p_fake` |
| `{{attention_map_img}}` | Base64 PNG Heatmap Image | `[Jet Colormap Overlay Canvas]` | `FaceResult.attention_map` |
| `{{camera_device}}` | Camera Hardware Make/Model | `Apple iPhone 15 Pro` or `Not Recorded` | `ExifMetadata.camera_make` + `camera_model` |
| `{{capture_datetime}}`| Hardware Timestamp | `2026:08:21 14:22:05` or `No Timestamp` | `ExifMetadata.datetime_original` |
| `{{software_pipeline}}`| Image Editing Software | `Natural Camera Output` or `Photoshop / GIMP` | `ExifMetadata.software` |
| `{{iso_speed}}` | Sensor ISO Sensitivity | `ISO 64` or `N/A` | `ExifMetadata.iso_speed` |
| `{{processing_time}}` | Latency Telemetry | `482 ms` | `PredictionResponse.processing_time_ms` |
| `{{filename}}` | Inspected Filename | `portrait_capture_01.jpg` | Client File Object / History Record |
| `{{created_at_date}}` | Archival Scan Date | `Aug 21, 2026` | `ScanHistoryResponse.created_at` |
| `{{created_at_time}}` | Archival Scan Time | `04:40 PM` | `ScanHistoryResponse.created_at` |
| `{{user_email}}` | Logged In User Email | `alex@example.com` | `User.email` |
| `{{user_username}}` | Logged In Username | `alex_analyst` | `User.username` |
| `{{quiz_score}}` | Live Academy Score | `Score: 2 / 3` | React State `correctCount` / `totalCount` |

---

## 4. Static vs. Dynamic Content Matrix

| Content Area | Type | Source & Notes |
| :--- | :---: | :--- |
| **DeepSentry Logo & Branding** | Static | Hardcoded SVG Shield icon & typography |
| **Navigation Link Labels** | Static | `Forensic Studio`, `Audit History`, `Academy`, `Architecture`, `About` |
| **Hero Headline & Subtitle** | Static | Hardcoded product positioning copy |
| **Live Inspection Canvas Mode Buttons** | Static / State | Local state switching between Patches (196), Attention Map, 1.3× BBox |
| **Animated Benchmark Metrics** | Static Values (Dynamic Animation) | `99.00%`, `90.0%`, `<600ms`, `196` tokens (animated count-up via hook) |
| **Architecture Pillars Copy** | Static | ViT-Base 86.5M specs, 60/40 calibrated fusion, 12-layer rollout |
| **Upload Dropzone Labels** | Static / State | Changes text on `isDragging` (`Drop image to begin analysis`) |
| **Scan Execution Checklist** | Static Sequence | 5-stage sequential progress indicators |
| **Forensic Verdict & Confidence** | **Dynamic** | Sourced from `POST /api/v1/predict/analyze` payload |
| **Consensus Progress Bars** | **Dynamic** | Sourced from `FaceResult.vit_p_fake`, `secondary_p_fake`, `ensemble_p_fake` |
| **ViT Heatmap Image** | **Dynamic** | Sourced from `FaceResult.attention_map` (Base64 data URL) |
| **EXIF Camera & Sensor Specs** | **Dynamic** | Sourced from `PredictionResponse.metadata` |
| **Audit History Table Rows** | **Dynamic** | Sourced from `GET /api/v1/history/` list |
| **Academy Failure Modes Content** | Static | 4 anatomical failure explanations with click-to-expand state |
| **Academy Quiz Questions** | Static Data (Dynamic State) | Array of 3 forensic questions with live answer checking and score tracking |
| **Architecture Pipeline Inspector** | Static Data (Dynamic State) | 4 stages with interactive inspector displaying Tensor I/O shapes |
| **User Profile Badge** | **Dynamic** | Sourced from `GET /api/v1/auth/me` |

---

## 5. Non-Visual Functionality (Bridging Sketch to Code)

Sketch represents visual states and screen layouts. The following architectural capabilities must be implemented in React and FastAPI during handoff:

| Capability | Sketch Representation | React 19 Implementation | Backend Connection |
| :--- | :--- | :--- | :--- |
| **File Validation** | Error banner artboard variant | Checked before upload in `Scanner.tsx` (Format: JPEG/PNG/WEBP, Size: $\le 10\text{ MB}$) | Enforced again in FastAPI router (`400 Bad Request`) |
| **Webcam Stream** | Live camera frame artboard | HTML5 `navigator.mediaDevices.getUserMedia` with HTML5 `<video>` & canvas snapshot | Blob converted to `File` and sent via standard POST |
| **Authentication Flow** | Login/Register artboards | `AuthContext.tsx` with JWT in `localStorage` (`deepsentry_token`) and Axios interceptor | PyJWT verification + `require_current_user` dependency |
| **Defensive Null Handling**| Data fallback dashes (`—`) | `formatConfidence(val)`, `formatDate(val)` in `utils.ts` preventing `.toFixed` crashes | Pydantic default schema values |
| **Interactive Heatmap Opacity** | Heatmap slider visual | Live CSS `opacity` style applied to `<img>` element | Rendered client-side from base64 string |
| **Zoom & Pan Controls** | Zoom in/out buttons | CSS `transform: scale(zoomLevel)` ($0.8\times$ to $1.8\times$) | Rendered client-side |
| **Global Crash Protection**| Error state fallback card | React `ErrorBoundary.tsx` wrapping all route elements | Catches client-side exceptions cleanly |

---

## 6. Sketch Prototype Navigation Flows

```text
1. Primary Forensic Workflow:
   [Desktop / Home]
         │ (Click "Launch Forensic Studio" CTA)
         ▼
   [Desktop / Scan / Upload_Idle]
         │ (Select or Drag Image)
         ▼
   [Desktop / Scan / Processing_Sequence]
         │ (Wait 1.2s — API response received)
         ▼
   [Desktop / Scan / Result_Command_Center]
         │ (Click "Inspect New Image" or "Export JSON")
         ▼
   [Desktop / Scan / Upload_Idle]

2. History Management Flow:
   [Desktop / Scan / Result_Command_Center]
         │ (Click "Audit History" in Navbar)
         ▼
   [Desktop / History / Default]
         │ (Click Trash Icon on Row #1)
         ▼
   [Desktop / History / Delete_Confirm_Modal]
         │ (Click "Delete Record")
         ▼
   [Desktop / History / Default] (Row #1 removed)

3. Forensics Academy Flow:
   [Desktop / Home]
         │ (Click "Forensics Academy" in Navbar)
         ▼
   [Desktop / Academy / Default]
         │ (Click Card #1)
         ▼
   [Desktop / Academy / Card_Expanded]
         │ (Select Question #1 Option B)
         ▼
   [Desktop / Academy / Quiz_Feedback_Correct] (Score: 1/3)
```

---

## 7. Design-to-Code Mapping Reference

| Sketch Component Name | React Component File | Primary Props / Inputs | Associated API Endpoint |
| :--- | :--- | :--- | :--- |
| `Navbar / Desktop` | `frontend/src/components/Navbar.tsx` | None (reads `AuthContext`) | `GET /api/v1/auth/me` |
| `Footer / Master` | `frontend/src/components/Footer.tsx` | None | None |
| `Home / HeroCanvas` | `frontend/src/pages/Home.tsx` | None | None |
| `Scan / UploadZone` | `frontend/src/pages/Scanner.tsx` | `onFileSelect: (f: File) => void` | `POST /api/v1/predict/analyze` |
| `Scan / ProcessingOverlay`| `frontend/src/pages/Scanner.tsx` | `currentStepIdx: number` | None (UI feedback during request) |
| `Forensic / VerdictBanner`| `frontend/src/pages/Scanner.tsx` | `result: PredictionResponse` | `POST /api/v1/predict/analyze` |
| `Forensic / ConsensusGauge`| `frontend/src/components/EnsembleGauge.tsx`| `face: FaceResult` | `POST /api/v1/predict/analyze` |
| `Forensic / HeatmapViewer` | `frontend/src/components/AttentionHeatmapViewer.tsx` | `face: FaceResult` | `POST /api/v1/predict/analyze` |
| `Forensic / ExifCard` | `frontend/src/components/ExifForensicsCard.tsx` | `metadata: ExifMetadata` | `POST /api/v1/predict/analyze` |
| `History / Table` | `frontend/src/pages/HistoryPage.tsx` | None (fetches history) | `GET /api/v1/history/`, `DELETE /api/v1/history/{id}` |
| `Academy / QuizCard` | `frontend/src/pages/Education.tsx` | `quiz: QuizItem` | None (Local State) |
| `Architecture / StageInspector` | `frontend/src/pages/Architecture.tsx` | `stage: PipelineStage` | None (Local State) |
| `Auth / LoginForm` | `frontend/src/pages/Login.tsx` | None | `POST /api/v1/auth/login` |
| `Auth / RegisterForm` | `frontend/src/pages/Register.tsx` | None | `POST /api/v1/auth/register` |
