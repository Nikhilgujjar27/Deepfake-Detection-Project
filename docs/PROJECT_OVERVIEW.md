# Project Overview — Deepfake Detection Platform

## 1. Project Name & Description
**Project Name:** Deepfake Image Detection System Using Vision Transformers  
**Repository Location:** `c:\Users\NikhilGujjar\Desktop\Deepfake-Project`  
**Academic Context:** VTU Major Project / Final-Year Engineering Project  

This project is a high-reliability, full-stack deepfake and AI-synthesized image detection platform. It is engineered specifically to overcome the common failure mode of academic deepfake detectors: performing well on curated benchmarks (e.g., 99%+ on FFHQ vs StyleGAN) while failing on casual, in-the-wild smartphone photos and messaging-app compressed images.

---

## 2. Problem Statement
The proliferation of generative adversarial networks (GANs), diffusion models (Stable Diffusion, Midjourney, Flux), and facial reenactment/swap techniques has made synthetic media indistinguishable from authentic photography to the human eye. 

Existing open-source detection systems suffer from severe domain shift:
1. **Benchmark Overfitting:** Models trained solely on pristine lab datasets learn camera and dataset specific artifacts rather than generalized forgery boundaries.
2. **False Positives on Real Photos:** Standard smartphone photography introduces lens distortion, dynamic range compression, sensor noise, and aggressive social media re-compression (e.g., WhatsApp, Instagram). Existing detectors misclassify these natural compressions as deepfake manipulation.
3. **Pipeline Inconsistencies:** Arbitrary inference-time hacks (e.g., ad-hoc CLAHE filtering, mismatched crop margins) distort input statistics, corrupting the feature representations learned during training.

---

## 3. Objective & Key Goals
The primary objective is to build an **evidence-based, highly reliable deepfake detection system** that:
- Maintains a **<10% False Positive Rate** on real-world smartphone photos across diverse lighting, phone models, and compression levels.
- Achieves **$\ge 90\%$ detection accuracy** on a sealed, held-out real-world test set.
- Provides real-time inference ($<100$ms per face on local NVIDIA RTX 5050 GPU).
- Delivers visual explainability via Vision Transformer attention heatmaps showing the specific facial regions that triggered the verdict.
- Features a professional, educational web interface with user authentication, asynchronous background processing, scan history, and downloadable forensic reports.

---

## 4. Target Users
1. **General Public / End Users:** Individuals verifying suspicious images received via social media or messaging apps.
2. **Journalists & Fact-Checkers:** Media professionals requiring forensic verification of user-submitted photographs.
3. **Academic Evaluators (VTU Examiners):** Evaluators reviewing architecture design, rigorous empirical evaluation methodology, and software engineering rigor.

---

## 5. Main Features

### Core Detection & Forensics
- **Multi-Format Ingestion:** Drag-and-drop or file-picker upload for JPG, PNG, WEBP, and TIFF images.
- **Automated Face Extraction:** RetinaFace detection with MTCNN fallback and standardized $1.3\times$ bounding box margin alignment.
- **Multi-Face Group Photo Support:** Individual per-face detection, bounding box overlay, per-face authenticity verdicts, and selectable tabs.
- **Authenticity Verdict:** Binary classification (`REAL` vs `FAKE`) accompanied by calibrated probability confidence scores.
- **Visual Explainability (XAI):** Self-attention rollout heatmaps extracted directly from the ViT encoder layers, visualizing decision-critical regions (eyes, mouth, blending seams).
- **EXIF Metadata Forensics:** Extraction of camera make/model, focal length, ISO, exposure, and software tags to provide forensic context.
- **Exportable Reports:** One-click export of complete scan results, metrics, and forensic metadata in JSON format.

### Platform & UX Features
- **Educational Landing Page:** Clean, modern landing experience explaining deepfake mechanics, detection principles, system capabilities, and limitations.
- **Live Scan Progress:** Real-time multi-stage status stream via Server-Sent Events (SSE) (e.g., "Detecting faces..." $\rightarrow$ "Running ViT feature extractor..." $\rightarrow$ "Generating attention heatmap..." $\rightarrow$ "Complete").
- **User Accounts & Authentication:** Secure JWT-based registration and session management.
- **Scan History:** Persistent database records of previous scans with search, filtering, and deletion.
- **Analytics Dashboard:** Visual metrics including total scan volume, class distribution, confidence distributions, and latency percentiles.

---

## 6. System Components & High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React 19)                    │
│   Landing Page │ Verification UI │ Heatmaps │ History       │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / REST / SSE
┌──────────────────────────────▼──────────────────────────────┐
│                    FastAPI Backend (app/)                   │
│   Auth Routing │ Scan Ingestion │ SSE Stream │ Analytics    │
└──────────────┬───────────────────────────────┬──────────────┘
               │ SQLAlchemy                    │ Celery Task Queue
┌──────────────▼──────────────┐        ┌───────▼──────────────┐
│       Database (PostgreSQL) │        │     Redis Broker     │
│   Users │ Scans │ History   │        └───────┬──────────────┘
└─────────────────────────────┘                │
                                       ┌───────▼──────────────┐
                                       │     Celery Worker    │
                                       │   RetinaFace Crop    │
                                       │   ViT-Base Model     │
                                       │   SBI EfficientNet   │
                                       │   Attention Heatmap  │
                                       └──────────────────────┘
```

---

## 7. Current Project Status
- **Phase 1 (Baseline & Scaffolding):** COMPLETED.
  - Project directory structure established.
  - Frozen baseline ViT checkpoint (`models/baseline/vit_deepfake_v1_baseline.pth`) preserved.
  - Exact model architecture recreated in `ml_training/models/vit_classifier.py`.
  - Attention explainability recreated in `ml_training/models/explainability.py`.
  - Comprehensive baseline evaluation script created in `ml_training/evaluate_baseline.py`.
  - Training configuration optimized for RTX 5050 created in `ml_training/configs/train_config.yaml`.
- **Phase 2 (Real-World Dataset Collection):** IN PROGRESS.
  - Image collection protocol and guideline documented. User collecting smartphone samples.
- **Phase 3 (Baseline Evaluation):** READY TO EXECUTE upon environment setup and test image placement.
- **Phases 4–8 (SBI, Ensemble, Backend, Frontend):** PLANNED & SPECIFIED.

---

## 8. Future Goals & Roadmap
1. Validate baseline ViT with corrected preprocessing (tight crop, no dHash backdoor).
2. Integrate SBI (Self-Blended Images) as local secondary detector.
3. Perform empirical ensemble calibration on calibration dataset.
4. Execute single-run validation on sealed held-out real-world test set.
5. Deploy production FastAPI backend + Celery worker with ONNX execution provider.
6. Build professional React frontend with dark-mode aesthetic, landing section, and live verification interface.
7. Compile complete academic documentation, confusion matrices, ROC curves, and system diagrams for VTU Phase-2 project defense.
