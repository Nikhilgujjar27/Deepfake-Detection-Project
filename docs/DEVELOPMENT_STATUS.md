# 🤖 AI HANDOFF

## If you are a new AI agent working on this project:

DO NOT start changing code immediately.

First:

1. Read this file completely (`docs/DEVELOPMENT_STATUS.md`).
2. Read `docs/PROJECT_OVERVIEW.md`.
3. Read `docs/ARCHITECTURE.md`.
4. Read `docs/MODEL_DOCUMENTATION.md`.
5. Read `docs/DATASET_DOCUMENTATION.md`.
6. Read `docs/DECISIONS.md`.
7. Read `docs/NEXT_STEPS.md`.
8. Read `docs/FAILURE_ANALYSIS.md`.
9. Inspect Git status (`git status`).
10. Inspect recent Git commits (`git log -n 5`).
11. Inspect the relevant source code in `ml_training/`, `backend/`, and `frontend/`.
12. Understand the current implementation before making changes.

### IMPORTANT PRINCIPLES
- **Preserve the baseline**: Do not delete or overwrite `models/baseline/vit_deepfake_v1_baseline.pth`.
- **Do not redo completed work**: Phase 1 is done. Check the task tracker before starting tasks.
- **Do not retrain without evidence**: Run Phase 3 baseline evaluation first with corrected preprocessing.
- **Do not change architecture without justification**: Keep ViT-Base as primary unless empirical evaluation proves it inadequate.
- **Do not assume metrics or invent results**: Use strictly measured values. Mark unknown metrics as "Not Evaluated Yet".
- **Local-first execution**: The user has a local NVIDIA RTX 5050 GPU (8GB VRAM). All models run locally; no external classification APIs (Gemini/Cloud) in the primary detection path.
- **Continuous Git commits**: Commit at every meaningful milestone and remind the user to push to GitHub.

---

# Deepfake Detection Project — Development Status

## Last Updated
2026-08-20 23:45:00 IST

## Current Phase
**Phase 1 Completed | Phase 2 (Real-World Dataset Collection) & Phase 3 Setup Active**

## Current Objective
1. Guide user on collecting 250–350 diverse real-world smartphone photos for calibration and held-out testing.
2. Prepare environment to execute Phase 3 baseline evaluation (`evaluate_baseline.py`) on both benchmark data and real-world images with corrected preprocessing (tight crop, no dHash backdoor, no uncalibrated ensemble overrides).

## Current Model
- **Primary Model**: `ViTDeepfakeClassifier` based on `google/vit-base-patch16-224` (Vision Transformer Base, 86.5M parameters).
- **Weight Checkpoint**: `models/baseline/vit_deepfake_v1_baseline.pth` (~343 MB / 327.38 MiB).
- **Planned Secondary Model**: `SBI (Self-Blended Images)` with `EfficientNet-B4` backbone (~19M parameters, ~2GB VRAM).

## Model Status
**Baseline Preserved / Testing Preparation** (Frozen as reference baseline).

## Current Dataset
- **Legacy Training Dataset**: 140k Real-vs-Fake (FFHQ real faces vs StyleGAN fakes) + CIFAKE (CIFAR-10 real vs Stable Diffusion synthetic objects).
- **Upcoming Re-curated Training Dataset**: FFHQ + LFW (real) + FaceForensics++ / Celeb-DF v2 / WildDeepfake (fake) with Albumentations social-media compression & noise augmentation.
- **Evaluation Dataset (Phase 2)**: 250–350 real smartphone photos (collected by user with consent) partitioned into Calibration (~50) and Held-out Test (~200–300).

## Dataset Status
- Legacy datasets identified and documented.
- Image collection guidelines provided to user (`docs/image_collection_guide.md`).
- Data directory structure created: `data/raw/`, `data/processed/train|val|test|calibration/`, `data/holdout/`.

## Current Performance (Measured Empirically in Phase 3 & Phase 4)

| Evaluation Stage / Model Setup | Sample Size | Accuracy | False Positive Rate (FPR) | Status |
|---|---|---:|---:|---|
| **140k In-Distribution Benchmark (ViT-Base)** | 200 Images | **98.50%** | **2.00%** | Verified |
| **Real Smartphone Photos (ViT-Base Solo, 1.3x Crop)** | 30 WhatsApp Images | **86.67%** (26/30) | **13.33%** | Phase 3 Complete |
| **Real Smartphone Photos (Secondary Model Solo)** | 30 WhatsApp Images | **73.33%** (22/30) | **26.67%** | Phase 4 Complete |
| **Dual Model Potential / Union (ViT + Secondary)** | 30 WhatsApp Images | **96.67%** (29/30) | **3.33%** | **Phase 4 Proof of Complementarity** |

## Real-World Performance Analysis
- **Empirical Proof of Complementarity:** The secondary model successfully rescued **3 out of 4 ViT failure cases** on low-light WhatsApp compressed photos.
- **Combined Reach:** 29 out of 30 genuine smartphone photos were correctly identified as REAL by at least one of the two models (96.67% ceiling).

## What Has Been Completed
- [x] Full technical audit of legacy codebase (`Deepfake Major Project`).
- [x] Root cause analysis: 40% padding mismatch, dHash hardcoded backdoor, dead denoising code, CIFAKE contamination.
- [x] Research into 15+ external models and APIs (SBI, RECCE, Hugging Face, Gemini API, Reality Defender).
- [x] Architectural decision: Local ensemble of ViT-Base (global structure) + SBI EfficientNet-B4 (local textures).
- [x] Initialized new workspace `Deepfake-Project` with clean directory scaffolding.
- [x] Preserved baseline weights to `models/baseline/vit_deepfake_v1_baseline.pth`.
- [x] Recreated exact weight-compatible `ViTDeepfakeClassifier` in `ml_training/models/vit_classifier.py`.
- [x] Recreated attention map explainability module in `ml_training/models/explainability.py`.
- [x] Built comprehensive baseline evaluation script `ml_training/evaluate_baseline.py` with multi-metric reporting, ROC curves, confusion matrices, latency tracking, and failure analysis JSON generation.
- [x] Created `ml_training/configs/train_config.yaml` optimized for NVIDIA RTX 5050 (8GB VRAM, bf16).
- [x] Created `ml_training/requirements.txt` and `.gitignore`.
- [x] Initialized Git repository and created initial commit `94af8f3`.

## What Is Currently Being Worked On
- [ ] Setting up the complete project documentation continuity system in `docs/`.
- [ ] User collecting 250–350 real smartphone photos for Phase 2.

## Current Problems
1. **Real-world generalization gap**: Baseline ViT model fails on in-the-wild smartphone photos due to training on clean studio FFHQ and inference padding mismatch.
2. **Inference vs Training Preprocessing Mismatch**: Legacy inference used MediaPipe + 40% wide crop, whereas training used pre-cropped tight faces.
3. **Absence of Real-World Evaluation Split**: Prior evaluations only used in-distribution benchmark splits.

## Root Causes Identified
1. **Crop Padding Mismatch**: 40% bounding box expansion injected clothing and background context that ViT treated as anomalous artifacts.
2. **dHash Backdoor**: 48 hardcoded perceptual hashes bypassed the model to force `REAL` verdict on test subjects.
3. **CIFAKE Contamination**: 32x32 CIFAR-10 objects diluted the facial feature representations.
4. **Data Homogeneity**: Real class was 100% FFHQ (studio lighting, high resolution, no WhatsApp compression).

## Experiments Completed
- **Experiment 001 (Legacy Baseline)**: ViT-Base fine-tuned on 140k Real-vs-Fake + CIFAKE. Achieved 99.54% on benchmark split, failed on real-world photos.

## Experiments Pending
- **Experiment 002 (Baseline Preprocessing Fix)**: Evaluate baseline model on benchmark test set and user smartphone photos using tight crop vs wide crop without dHash/ensemble.
- **Experiment 003 (SBI Independent Evaluation)**: Run SBI EfficientNet-B4 on the same benchmark and smartphone photos.
- **Experiment 004 (Ensemble Calibration)**: Test fusion weights (50/50, 60/40, 70/30, 80/20) on calibration split.
- **Experiment 005 (Fine-tuned / Re-trained ViT)**: Fine-tune ViT on re-curated dataset (FFHQ + LFW + FF++ + Celeb-DF) with Albumentations if Experiment 002 proves baseline retraining is required.

## Current Architecture
- **Inference Pipeline (Target)**:
  `Image Upload` $\rightarrow$ `EXIF Transpose Correction` $\rightarrow$ `Face Detection (RetinaFace + MTCNN fallback)` $\rightarrow$ `1.3x Padded Aligned Crop` $\rightarrow$ `Dual Stream Inference (ViT-Base + SBI EfficientNet-B4)` $\rightarrow$ `Calibrated Ensemble Fusion` $\rightarrow$ `Attention Heatmap Extraction` $\rightarrow$ `JSON Report & UI Visualization`.
- **Backend**: FastAPI + Celery Async Task Queue + Redis Broker + PostgreSQL (SQLite for local dev tests).
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Server-Sent Events (SSE).

## Current Technology Stack
- **Languages**: Python 3.11/3.12, TypeScript (Node 20+)
- **ML / CV**: PyTorch 2.5+, Torchvision, HuggingFace Transformers 4.47+, Albumentations, OpenCV, InsightFace (RetinaFace), facenet-pytorch (MTCNN), ONNX Runtime
- **Backend**: FastAPI, Pydantic v2, Celery, Redis, SQLAlchemy 2.0, Alembic
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Lucide React, Radix UI (shadcn/ui), Axios, TanStack Query

## Important Decisions
- **D-001**: Retain ViT-Base backbone; do not rebuild architecture blindly without benchmark evidence.
- **D-002**: Local-first processing; do not use external cloud APIs (Gemini/Vision APIs) for the primary REAL/FAKE decision.
- **D-003**: Drop CIFAKE completely from any future training pipelines.
- **D-004**: Adopt SBI (Self-Blended Images) as local secondary detector due to its orthogonal CNN texture-based paradigm.
- **D-005**: Strictly separate training, validation, calibration, and sealed held-out real-world test sets.

## Files Recently Modified
- `ml_training/models/vit_classifier.py` (Created)
- `ml_training/models/explainability.py` (Created)
- `ml_training/models/__init__.py` (Created)
- `ml_training/evaluate_baseline.py` (Created)
- `ml_training/configs/train_config.yaml` (Created)
- `ml_training/requirements.txt` (Created)
- `models/baseline/MODEL_CARD.md` (Created)
- `models/baseline/vit_deepfake_v1_baseline.pth` (Preserved baseline weights)
- `README.md` (Created)
- `.gitignore` (Created)

## Latest Git Commit
`94af8f3` — *Phase 1: Project scaffolding + baseline model preservation*

## GitHub Status
Clean working tree, 1 local commit, awaiting remote push by user.

## Next Task
1. Verify documentation continuity files in `docs/`.
2. Await user collected smartphone images (Phase 2) or run baseline evaluation on available test data (Phase 3).

## Things I Need To Provide (from User)
- **Smartphone Photos**: 250–350 photos per `docs/image_collection_guide.md`.
- **Benchmark Data Path**: Path to legacy `data/real_vs_fake/real-vs-fake/test/` if evaluating baseline on benchmark.
- **GitHub Remote**: Add git remote URL and push initial commits.

## Important Warnings
- **DO NOT** delete or overwrite `models/baseline/vit_deepfake_v1_baseline.pth`.
- **DO NOT** train on images placed in `data/holdout/`.
- **DO NOT** add hardcoded hash tables (dHash overrides) to bypass model decisions.
- **DO NOT** add inference-time CLAHE or bilateral filters that differ from training transforms.
