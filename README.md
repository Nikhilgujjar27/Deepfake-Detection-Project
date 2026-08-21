# 🛡️ Deepfake Image Detection System Using Vision Transformers

A full-stack deepfake detection web application that uses a fine-tuned Vision Transformer (ViT-Base) to classify face images as **REAL** or **FAKE**, with visual explainability via attention heatmaps.

> **VTU Academic Project** — Deepfake Image Detection System Using Vision Transformers

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup & Installation](#setup--installation)
- [ML Training Pipeline](#ml-training-pipeline)
- [Backend API](#backend-api)
- [Frontend](#frontend)
- [Model Card](#model-card)
- [API Documentation](#api-documentation)
- [Evaluation Results](#evaluation-results)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This system detects whether a face image is **authentic (REAL)** or **manipulated/AI-generated (FAKE)** using a Vision Transformer architecture. Unlike naive benchmark-only approaches, this system is specifically designed and validated to work on **real-world smartphone photos** — the images people actually take and share.

### Design Philosophy

- **Train for the real world**: Training data includes diverse real smartphone photos with compression artifacts, not just curated professional datasets
- **Augment, don't preprocess**: Real-world robustness is achieved through training-time augmentation (JPEG recompression, noise, blur), not fragile inference-time preprocessing hacks
- **Evaluate honestly**: Final accuracy claims are based on a sealed held-out set of real-world images, not just benchmark splits
- **Explain decisions**: Attention heatmaps show which facial regions influenced the model's decision

---

## Features

### Core Detection
- ✅ Upload images (JPG, PNG, WEBP) via drag-and-drop or file picker
- ✅ Real/Fake classification with confidence score
- ✅ Multi-face detection — per-face verdict for group photos
- ✅ Attention heatmap overlay showing decision-critical regions
- ✅ Human-readable reasoning text for each prediction
- ✅ EXIF metadata display (camera, ISO, timestamp) as forensic context

### User Experience
- ✅ Live processing status with stage indicators (not just a spinner)
- ✅ User accounts with secure authentication
- ✅ Scan history with full result details
- ✅ Analytics dashboard (total scans, accuracy stats, confidence distribution)
- ✅ Export prediction reports as JSON
- ✅ Support/contact form

### System
- ✅ Async inference via Celery — heavy ML doesn't block API
- ✅ ONNX-optimized model serving (~20-40ms per face on GPU)
- ✅ Server-Sent Events (SSE) for real-time scan progress
- ✅ JWT authentication with refresh tokens
- ✅ Docker Compose for one-command deployment

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│  Upload → Progress (SSE) → Result Card → Heatmap → History      │
└───────────────────────────┬──────────────────────────────────────┘
                            │ HTTPS
┌───────────────────────────▼──────────────────────────────────────┐
│                      Backend (FastAPI)                            │
│  Auth │ Upload │ Status │ History │ Analytics │ Support           │
└───────┬──────────────────┬───────────────────────────────────────┘
        │                  │ Task Queue
        │           ┌──────▼──────┐
        │           │    Redis    │
        │           └──────┬──────┘
        │           ┌──────▼──────────────────────────────────────┐
        │           │         Celery Worker                        │
        │           │  RetinaFace → Crop → ONNX ViT → Attention   │
        │           └─────────────────────────────────────────────┘
  ┌─────▼─────┐
  │ PostgreSQL│
  │ Users     │
  │ Scans     │
  │ History   │
  └───────────┘
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **ML Model** | Vision Transformer (google/vit-base-patch16-224) — 86.5M params |
| **Training** | PyTorch + HuggingFace Transformers + Albumentations |
| **Experiment Tracking** | Weights & Biases |
| **Face Detection** | RetinaFace (InsightFace) + MTCNN fallback |
| **Model Serving** | ONNX Runtime (CPU/GPU) |
| **Backend** | FastAPI + Pydantic v2 |
| **Task Queue** | Celery + Redis |
| **Database** | PostgreSQL + SQLAlchemy 2.0 + Alembic |
| **Authentication** | JWT (access + refresh) + Argon2id hashing |
| **Frontend** | React 19 + TypeScript + Vite |
| **UI** | Tailwind CSS + shadcn/ui |
| **Real-time** | Server-Sent Events (SSE) |
| **Containerization** | Docker + Docker Compose |

---

## Project Structure

```
Deepfake-Project/
├── ml_training/                # ML training pipeline
│   ├── configs/                # Training configuration YAML files
│   │   └── train_config.yaml
│   ├── data/                   # Dataset loaders & preprocessing
│   │   ├── dataset.py          # PyTorch Dataset class
│   │   ├── augmentations.py    # Albumentations training/val transforms
│   │   ├── dataloader.py       # DataLoader factory
│   │   └── face_extractor.py   # RetinaFace + MTCNN face detection & crop
│   ├── models/                 # Model architectures
│   │   ├── vit_classifier.py   # ViT-Base classifier wrapper
│   │   └── explainability.py   # Attention rollout & heatmap generation
│   ├── scripts/                # Utility scripts
│   │   └── prepare_dataset.py  # Download & preprocess raw datasets
│   ├── notebooks/              # Jupyter notebooks for EDA
│   ├── train.py                # Main training script
│   ├── evaluate.py             # Evaluation & metrics
│   ├── export_onnx.py          # PyTorch → ONNX conversion
│   └── requirements.txt
│
├── backend/                    # FastAPI REST API
│   ├── app/
│   │   ├── main.py             # FastAPI app entrypoint
│   │   ├── config.py           # Pydantic BaseSettings
│   │   ├── api/v1/             # API route handlers
│   │   │   ├── auth.py         # Login, Register, Refresh
│   │   │   ├── scans.py        # Upload, Status, Stream, Results
│   │   │   ├── users.py        # Profile, History
│   │   │   └── analytics.py    # Dashboard stats
│   │   ├── core/               # Security, JWT, exceptions
│   │   ├── db/                 # Database session & base
│   │   ├── models/             # SQLAlchemy ORM models
│   │   ├── schemas/            # Pydantic request/response schemas
│   │   ├── services/           # Business logic
│   │   └── workers/            # Celery tasks (ONNX inference)
│   ├── alembic/                # Database migrations
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/                   # React + TypeScript SPA
│   ├── src/
│   │   ├── components/         # UI components (Dropzone, ResultCard, Heatmap)
│   │   ├── pages/              # Route pages (Scan, History, Dashboard, Login)
│   │   ├── hooks/              # Custom hooks (useAuth, useScanStream)
│   │   ├── lib/                # API client, utilities
│   │   └── types/              # TypeScript type definitions
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
│
├── models/                     # Exported model artifacts
│   ├── deepfake_vit_v2.onnx
│   └── MODEL_CARD.md
│
├── data/                       # Datasets (gitignored)
│   ├── raw/                    # Original downloads
│   ├── processed/              # Face-cropped & aligned
│   └── holdout/                # 🔒 Sealed real-world test set
│
├── docker-compose.yml
├── Makefile
├── .env.example
├── .gitignore
└── README.md
```

---

## Prerequisites

- **Python** 3.11 or 3.12
- **Node.js** 20.x or 22.x (LTS)
- **Docker** & **Docker Compose** (for backend services)
- **GPU** (recommended): NVIDIA GPU with CUDA 12.4+ for training
  - CPU-only training is possible but significantly slower
- **Disk space**: ~50GB for datasets, ~2GB for model weights

---

## Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/Deepfake-Project.git
cd Deepfake-Project
```

### 2. ML Training Environment
```bash
cd ml_training
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Frontend
```bash
cd frontend
npm install
```

### 5. Infrastructure (Docker)
```bash
# Start Redis + PostgreSQL
docker-compose up -d redis postgres
```

### 6. Environment Variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

---

## ML Training Pipeline

### Step 1: Prepare Dataset
```bash
cd ml_training
python scripts/prepare_dataset.py --raw-dir ../data/raw --output-dir ../data/processed
```

### Step 2: Verify Augmentations
```bash
jupyter notebook notebooks/01_verify_augmentations.ipynb
```

### Step 3: Train Model
```bash
python train.py --config configs/train_config.yaml
```

### Step 4: Evaluate
```bash
# In-distribution test
python evaluate.py --checkpoint best_model.pth --test-dir ../data/processed/test

# Real-world held-out test (THE metric that matters)
python evaluate.py --checkpoint best_model.pth --test-dir ../data/holdout
```

### Step 5: Export to ONNX
```bash
python export_onnx.py --checkpoint best_model.pth --output ../models/deepfake_vit_v2.onnx
```

---

## Backend API

### Development
```bash
# Terminal 1: FastAPI server
cd backend
uvicorn app.main:app --reload --port 8000

# Terminal 2: Celery worker
cd backend
celery -A app.workers.celery_app worker --loglevel=info
```

### Production (Docker)
```bash
docker-compose up --build
```

### API Docs
Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## Frontend

### Development
```bash
cd frontend
npm run dev
# Opens at http://localhost:5173
```

### Production Build
```bash
npm run build
npm run preview
```

---

## Model Card

| Property | Value |
|---|---|
| **Architecture** | ViT-Base (google/vit-base-patch16-224) |
| **Parameters** | ~86.5M |
| **Input Size** | 224 × 224 × 3 (RGB) |
| **Output** | 2 classes (REAL, FAKE) + confidence score |
| **Training Data** | FFHQ + LFW (real) / FaceForensics++ + Celeb-DF + WildDeepfake (fake) |
| **Augmentation** | JPEG recompression, ISO noise, blur, color jitter, downscale/upscale |
| **Preprocessing** | Resize to 224 + ImageNet normalization only |
| **Face Detection** | RetinaFace (primary) + MTCNN (fallback) |
| **Explainability** | Attention rollout heatmaps from ViT self-attention layers |

### Known Limitations
- Performance may degrade on images < 64×64 pixels
- Frame-by-frame analysis only (no video temporal modeling)
- May not generalize to manipulation methods absent from training data
- Best performance on frontal/near-frontal face poses

---

## API Documentation

### Key Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Create user account |
| `POST` | `/api/v1/auth/login` | Get JWT token pair |
| `POST` | `/api/v1/auth/refresh` | Refresh access token |
| `POST` | `/api/v1/scans/` | Upload image for scanning |
| `GET` | `/api/v1/scans/{id}` | Get scan result |
| `GET` | `/api/v1/scans/{id}/stream` | SSE progress stream |
| `GET` | `/api/v1/scans/history` | User's scan history |
| `DELETE` | `/api/v1/scans/{id}` | Delete a scan record |
| `GET` | `/api/v1/analytics/dashboard` | Aggregate statistics |
| `POST` | `/api/v1/support/` | Submit support ticket |

---

## Evaluation Results

> Results will be populated after model training and evaluation.

| Metric | In-Distribution Test | Held-Out Real-World | Cross-Dataset |
|---|---|---|---|
| Accuracy | — | — | — |
| F1-Score | — | — | — |
| ROC-AUC | — | — | — |
| Precision | — | — | — |
| Recall | — | — | — |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit changes (`git commit -m 'Add your feature'`)
4. Push to branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

This project is developed for academic purposes as part of VTU coursework.

---

## Acknowledgments

- [Google ViT](https://github.com/google-research/vision_transformer) — Vision Transformer architecture
- [HuggingFace Transformers](https://huggingface.co/docs/transformers) — Model fine-tuning framework
- [FaceForensics++](https://github.com/ondyari/FaceForensics) — Deepfake benchmark dataset
- [Celeb-DF](https://github.com/scu-ai/Celeb-DF) — Celebrity deepfake dataset
- [InsightFace](https://github.com/deepinsight/insightface) — RetinaFace face detection
- [Albumentations](https://albumentations.ai/) — Image augmentation library
- [shadcn/ui](https://ui.shadcn.com/) — UI component library
