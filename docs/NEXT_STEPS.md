# Prioritized Next Steps — Deepfake Detection System

## 🔴 Critical (Immediate Action Required)

- [x] Audit legacy codebase and identify root causes of real-world classification failures.
- [x] Establish new `Deepfake-Project` workspace with clean modular directory layout.
- [x] Preserve and freeze baseline ViT weights at `models/baseline/vit_deepfake_v1_baseline.pth`.
- [x] Build baseline evaluation script (`ml_training/evaluate_baseline.py`) with zero heuristics/backdoors.
- [x] Create project continuity documentation suite in `docs/`.
- [x] **Phase 3 Baseline Isolation**: Evaluated baseline ViT on 200 benchmark images (98.50% acc) and 30 real smartphone photos under 4 crop padding modes (86.67% acc in Mode B 1.3x).
- [x] **Phase 4 Dual Model Evaluation**: Evaluated Secondary Detector independently; proved complementary value by rescuing **3 out of 4 ViT failure cases** (96.7% complementary accuracy).
- [ ] **Phase 6 Ensemble Calibration**: Build and calibrate the ensemble fusion layer ($w_1 \cdot \text{ViT} + w_2 \cdot \text{Secondary}$) to minimize False Positives and False Negatives.
- [ ] **[USER ACTION]** Continue collecting remaining smartphone photos to reach 250–350 total across 10 categories as per `docs/IMAGE_COLLECTION_GUIDE.md`.

---

## 🟠 High Priority (Phase 3 & Phase 4 Execution)

- [ ] Execute comparative evaluation of face bounding-box margin (tight crop $1.05\times$ vs standardized $1.30\times$ vs legacy wide $1.40\times$).
- [ ] Generate confusion matrices, ROC-AUC curves, confidence distributions, and `failure_analysis.json` for the baseline ViT model.
- [ ] Download and integrate pretrained `SBI (Self-Blended Images)` EfficientNet-B4 model weights in `ml_training/models/sbi_classifier.py`.
- [ ] Run SBI independently on the exact same evaluation images.
- [ ] Conduct cross-model error analysis (identify instances where ViT succeeds while SBI fails, and vice versa).
- [ ] Determine whether baseline ViT requires fine-tuning/re-training or if preprocessing correction is sufficient (Phase 5 Decision Gate).

---

## 🟡 Medium Priority (Ensemble & Backend Buildout)

- [ ] Calibrate ensemble fusion weights ($w_{\text{ViT}}, w_{\text{SBI}}$) and decision threshold $\tau$ on the 50-image calibration split (Phase 6).
- [ ] Run single-pass final evaluation on the sealed `data/holdout/` dataset (Phase 7).
- [ ] Build FastAPI REST endpoints (`backend/app/api/v1/scans.py`, `auth.py`, `history.py`, `analytics.py`).
- [ ] Implement Celery worker tasks with ONNX Runtime model session pooling and GPU execution provider.
- [ ] Implement Server-Sent Events (SSE) stream endpoint for live scan progress reporting.
- [ ] Configure PostgreSQL database models, Alembic migrations, and user authentication with Argon2id.

---

## 🟢 Future (Frontend, Polish & VTU Academic Deliverables)

- [ ] Build professional React 19 + TypeScript frontend with Tailwind CSS and shadcn/ui.
- [ ] Implement educational landing section explaining deepfake mechanics and detection boundaries.
- [ ] Build interactive verification interface with drag-and-drop, webcam capture, and multi-face tabs.
- [ ] Integrate attention heatmap side-by-side visualization in the UI.
- [ ] Build personal scan history and aggregate analytics dashboard.
- [ ] Conduct end-to-end load and latency testing.
- [ ] Compile Phase-2 VTU Academic Major Project Report, system architecture diagrams, and empirical results tables.
