# Model Documentation — Deepfake Detection Models

## 1. Primary Model: Vision Transformer (ViT-Base)

### A. Model Specifications
- **Model Class:** `ViTDeepfakeClassifier` (`ml_training/models/vit_classifier.py`)
- **Base Backbone:** `google/vit-base-patch16-224` (ImageNet-21k pre-trained weights)
- **Total Parameters:** ~86.5 Million parameters
- **Architecture Details:**
  - Patch Size: $16 \times 16$ pixels ($14 \times 14 = 196$ patch tokens + 1 `[CLS]` token = 197 total tokens)
  - Hidden Dimension: $768$
  - Transformer Encoder Layers: 12 Layers
  - Multi-Head Attention: 12 heads per layer ($d_k = 64$ per head)
  - Feedforward Intermediate Dim: $3072$
  - Activation: GELU
  - Classification Head: Linear projection layer from $768 \rightarrow 2$ output classes (`0: REAL`, `1: FAKE`)
  - Attention Implementation: `eager` (Required for extracting self-attention weights for explainability)

### B. Input Preprocessing & Normalization
- **Input Dimensions:** $(3, 224, 224)$ (Channels, Height, Width)
- **Color Space:** RGB (with EXIF auto-rotation applied)
- **Normalization:** Standard ImageNet normalization:
  - Mean: $[0.485, 0.456, 0.406]$
  - Standard Deviation: $[0.229, 0.224, 0.225]$
- **Inference Transforms:** Strict Resize to $(224, 224) \rightarrow$ Normalize. No test-time CLAHE, bilateral filtering, or heuristic distortions.

### C. Training Hyperparameters (Baseline Checkpoint)
- **Optimizer:** `AdamW` (learning rate $= 1\times 10^{-5}$, weight decay $= 0.01$)
- **Loss Function:** `CrossEntropyLoss()`
- **Learning Rate Scheduler:** `CosineAnnealingLR` ($T_{\max} = 15$)
- **Batch Size:** 32 (CUDA) / 8 (CPU)
- **Epochs:** 15 epochs
- **Baseline Weight Artifact:** `models/baseline/vit_deepfake_v1_baseline.pth` (Size: 343,281,823 bytes / 327.38 MiB)
- **ONNX Export:** `models/baseline/vit_deepfake_v1.onnx` (Opset 18+, FP32 / FP16)

### D. Verified Performance Metrics (Baseline Checkpoint)

| Dataset / Benchmark | Test Split Size | Accuracy | F1-Score | ROC-AUC | Latency (RTX 5050) | Latency (CPU) |
|---|---|---|---|---|---|---|
| **140k In-Distribution Test Split** | 20,000 images | 99.54% | 0.9782 | 0.9941 | ~18ms | ~95ms |
| **Held-Out Real-World Smartphone Set** | ~250–350 images | *Not Evaluated Yet (Phase 3 Pending)* | — | — | — | — |
| **Cross-Dataset (Celeb-DF / FF++)** | Variable | *Not Evaluated Yet (Phase 3 Pending)* | — | — | — | — |

---

## 2. Secondary Model: SBI (Self-Blended Images)

### A. Model Specifications
- **Model Name:** Self-Blended Images (SBI) Detector (CVPR 2022)
- **Source Repository:** `mapooon/SelfBlendedImages`
- **Base Backbone:** `EfficientNet-B4` (Convolutional Neural Network)
- **Total Parameters:** ~19 Million parameters
- **Core Mechanism:** Trained on synthetic self-blended images derived exclusively from real faces (blending real face crops with perturbed source masks). No actual deepfake videos used during training, resulting in strong cross-manipulation generalization.
- **Role in System:** Provides orthogonal local texture and boundary seam detection to complement the ViT's global attention mechanism.

### B. Input & Runtime Requirements
- **Input Dimensions:** $(3, 224, 224)$ or $(3, 380, 380)$ (standard EfficientNet-B4 input)
- **Normalization:** ImageNet mean and standard deviation
- **VRAM Footprint:** ~2.0 GB VRAM
- **Inference Latency:** ~15ms – 25ms on NVIDIA RTX 5050

---

## 3. Calibrated Ensemble Layer

### A. Mathematical Formulation
Given an input face crop $x$, the individual models output estimated probabilities of forgery:
$$\hat{y}_{\text{ViT}} = P(\text{Fake} \mid x, \theta_{\text{ViT}}), \quad \hat{y}_{\text{SBI}} = P(\text{Fake} \mid x, \theta_{\text{SBI}})$$

The ensemble probability $\hat{y}_{\text{ens}}$ is computed via weighted linear combination:
$$\hat{y}_{\text{ens}} = w_{\text{ViT}} \cdot \hat{y}_{\text{ViT}} + w_{\text{SBI}} \cdot \hat{y}_{\text{SBI}}, \quad \text{where } w_{\text{ViT}} + w_{\text{SBI}} = 1.0$$

The final classification verdict $\hat{C} \in \{\text{REAL}, \text{FAKE}\}$ is determined by decision threshold $\tau$:
$$\hat{C} = \begin{cases} \text{FAKE} & \text{if } \hat{y}_{\text{ens}} \ge \tau \\ \text{REAL} & \text{if } \hat{y}_{\text{ens}} < \tau \end{cases}$$

### B. Calibration Protocol
- **Calibration Split:** Dedicated 50-image subset from collected real smartphone photos + 50 known deepfakes.
- **Candidate Weights:** Grid search over $w_{\text{ViT}} \in \{0.5, 0.6, 0.7, 0.8\}$ and $\tau \in [0.40, 0.60]$.
- **Selection Criterion:** Minimum total classification error and minimum False Positive Rate ($FPR \le 0.05$) on the calibration split.

---

## 4. Hardware Optimization & VRAM Budget (NVIDIA RTX 5050 — 8GB VRAM)

| Component | Precision | VRAM Allocation |
|---|---|---|
| **ViT-Base Model** | FP16 / BF16 (ONNX) | ~1.8 GB |
| **SBI EfficientNet-B4 Model** | FP16 (PyTorch) | ~1.5 GB |
| **RetinaFace Detector** | FP32 / FP16 | ~0.5 GB |
| **PyTorch & CUDA Runtime Context** | — | ~1.2 GB |
| **Working Memory / Batch Tensors** | — | ~0.8 GB |
| **Total Allocated VRAM** | — | **~5.8 GB (Safe within 8.0 GB limit)** |

---

## 5. Explainability (Attention Map Rollout)
- **Module:** `ml_training/models/explainability.py`
- **Algorithm:**
  1. Extract attention tensors from layer 12 of the ViT encoder: shape `[1, 12, 197, 197]`.
  2. Average attention maps across all 12 heads: `[1, 197, 197]`.
  3. Extract attention from index 0 (`[CLS]` token) across indices 1 to 196 (patch tokens): shape `[196]`.
  4. Reshape `[196]` to spatial grid `14 x 14`.
  5. Min-max normalize attention values to $[0.0, 1.0]$.
  6. Bilinearly upscale `14 x 14` grid to original face crop dimensions.
  7. Apply OpenCV `COLORMAP_JET` and alpha-blend with original RGB image ($60\%$ image, $40\%$ heatmap overlay).
  8. Encode resulting composite image as base64 PNG string for API transmission.
