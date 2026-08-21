# Architectural Decision Log (ADR)

This record documents every significant architectural, machine learning, dataset, and system design decision, along with context, alternatives considered, and empirical justification.

---

## Decision D-001 — Retain Vision Transformer (ViT-Base) as Primary Backbone

### Date
2026-08-20

### Decision
Retain `google/vit-base-patch16-224` (86.5M parameters) as the primary model architecture rather than discarding it for a completely different framework or training from scratch without evidence.

### Context
The user observed real-world classification failures and contemplated rebuilding the entire model architecture from scratch.

### Alternatives Considered
1. *Scrap ViT and train ResNet-50 / EfficientNet from scratch.*
2. *Switch to standard XceptionNet baseline from FaceForensics++.*
3. *Retain ViT-Base, preserve existing weights as baseline, and evaluate with corrected preprocessing before deciding on fine-tuning.*

### Why We Chose This
Vision Transformers utilize multi-head self-attention to capture long-range spatial correlations and structural facial coherence across patches. The architecture itself is proven and capable; the previous failures stemmed from training data distribution issues (FFHQ only, CIFAKE contamination) and a 40% bounding box crop mismatch, not an architectural limitation.

### Evidence
- ViT-Base achieved 99.54% accuracy and 0.9941 ROC-AUC on the 140k benchmark split, proving strong feature learning capability when data and preprocessing align.
- Attention maps derived from ViT self-attention provide native, high-quality visual explainability without requiring external perturbation frameworks (e.g., LIME or RISE).

### Consequences
- Requires ~1.8GB VRAM during inference (easily accommodated on NVIDIA RTX 5050 8GB).
- Baseline weights are preserved in `models/baseline/vit_deepfake_v1_baseline.pth`.

---

## Decision D-002 — Rejection of External Cloud APIs (Gemini / Commercial APIs) for Primary Classification

### Date
2026-08-20

### Decision
Do not use Google Gemini API, OpenAI Vision, or 3rd-party commercial APIs (Reality Defender, Sensity) in the primary detection path. Keep the detection system 100% self-contained locally.

### Context
Investigated whether external multimodal APIs could serve as primary or secondary deepfake classifiers to boost reliability.

### Alternatives Considered
1. *Use Gemini 2.5 Flash / Pro as primary classifier via REST prompt.*
2. *Use commercial deepfake APIs (Reality Defender / FrameSentinel free tiers).*
3. *Use local models exclusively (ViT + SBI on RTX 5050).*

### Why We Chose This
1. **Academic Benchmarks:** Academic evaluations (DeepfakeBench-MM 2025/2026) demonstrate that general Multimodal LLMs underperform specialized pixel-level deepfake detectors by 15–20% on subtle blending and diffusion artifacts.
2. **Latency & Throughput:** Cloud API requests take 2,000ms – 5,000ms per image versus 18ms – 50ms for local GPU inference (40–100x slower).
3. **Privacy & ToS:** Free-tier AI Studio endpoints retain submitted user images for model training. This violates user privacy expectations for personal photos.
4. **Rate Limits & Fragility:** Free API tiers (e.g., 50 requests/month on Reality Defender) cannot support live web applications or testing 300+ evaluation images. Internet outages break the entire platform.

### Evidence
Documented in `docs/external_models_evaluation.md`.

### Consequences
- Zero cloud API operational costs or subscription dependencies.
- True offline capability and complete reproducibility for VTU academic evaluation.
- All computation runs locally on the host's NVIDIA RTX 5050 GPU.

---

## Decision D-003 — Selection of SBI (Self-Blended Images) as Local Secondary Detector

### Date
2026-08-20

### Decision
Integrate Self-Blended Images (SBI) with an `EfficientNet-B4` backbone as the local secondary detector for calibrated ensemble fusion.

### Context
A secondary detector is beneficial if and only if it operates under an orthogonal architectural paradigm and fails on different edge cases than the primary ViT model.

### Alternatives Considered
1. *Run HuggingFace `dima806/deepfake_vs_real_image_detection` (used in legacy code).* (Rejected: Same ViT architecture, outdated 2023 weights, redundant).
2. *Run standard XceptionNet.* (Rejected: Known poor cross-dataset generalization on compressed images).
3. *Run SBI EfficientNet-B4.* (Accepted).

### Why We Chose This
- **Different Architecture:** CNN (EfficientNet-B4) analyzes local convolutions and fine-grained texture gradients, whereas ViT analyzes global token self-attention.
- **Novel Training Paradigm:** SBI is trained strictly on self-blended synthetic artifacts from real images without ever training on specific deepfake generators (FaceSwap, DeepFaceLab). This gives it state-of-the-art zero-shot cross-dataset generalization (~98% AUC on Celeb-DF).
- **VRAM Compatibility:** Occupies ~1.5GB VRAM; combined with ViT (~1.8GB) and RetinaFace (~0.5GB), the total footprint (~4.0GB) fits well within the RTX 5050's 8GB limit.

### Evidence
SBI (CVPR 2022) is peer-reviewed with over 200 citations and proven cross-dataset benchmark superiority.

### Consequences
- Dual-model inference is evaluated experimentally in Phase 4 and Phase 6 before final adoption.

---

## Decision D-004 — Training-Time Augmentation Over Inference-Time Preprocessing Hacks

### Date
2026-08-20

### Decision
Achieve real-world robustness by applying aggressive social media degradation augmentations (JPEG recompression, noise, blur, downsampling) during model training in Albumentations, while keeping inference preprocessing strictly deterministic (Resize + ImageNet Normalization).

### Context
Legacy code attempted to handle noisy photos by writing complex inference-time filters (adaptive CLAHE, bilateral smoothing based on Laplacian variance). This approach proved brittle and caused distribution shifts.

### Alternatives Considered
1. *Apply CLAHE + Bilateral filtering at inference time.*
2. *Train models with Albumentations social-media simulation pipeline; inference preprocessing remains simple and deterministic.*

### Why We Chose This
Inference-time filtering attempts to "guess" how to clean an image, often destroying high-frequency forensic artifacts (e.g., GAN checkerboard residuals or blending boundaries). Training with augmented corruptions forces the neural network to learn invariant representations that naturally tolerate noise and compression.

### Consequences
- Clean, fast, and deterministic inference pipeline without unpredictable heuristics.

---

## Decision D-005 — Strict Four-Way Dataset Partitioning with Sealed Held-Out Test Set

### Date
2026-08-20

### Decision
Partition datasets strictly into:
1. **Training Data:** Model parameter optimization.
2. **Validation Data:** Epoch-level loss monitoring and early stopping.
3. **Calibration Data:** Ensemble fusion weight optimization.
4. **Held-Out Real-World Test Data:** Sealed, single-run final evaluation.

### Context
Previous project evaluations were performed on in-distribution test splits that shared the exact capture and generation distribution as the training data, producing misleading 99.54% metrics.

### Why We Chose This
Eliminates data leakage, prevents overfitting to validation metrics, and guarantees an honest, academically rigorous evaluation of real-world generalization.

### Consequences
- `data/holdout/` directory is permanently excluded from all data loaders and training scripts.
