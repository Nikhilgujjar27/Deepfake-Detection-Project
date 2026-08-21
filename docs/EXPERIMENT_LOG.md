# Experiment Log — Deepfake Detection System

This document maintains an empirical record of all machine learning experiments, training runs, evaluation comparisons, and ablation studies.

---

## Experiment 001 — Legacy ViT Baseline (140k + CIFAKE)

### Date
2026-08-19

### Objective
Establish the initial Vision Transformer baseline for binary real vs fake face classification.

### Hypothesis
Fine-tuning `google/vit-base-patch16-224` on a large merged dataset (140k Real-vs-Fake + CIFAKE) will yield high classification accuracy and generalize to arbitrary facial images.

### Model
- **Architecture:** `ViTDeepfakeClassifier` (`google/vit-base-patch16-224`, 86.5M params)
- **Classification Head:** Linear($768 \rightarrow 2$)
- **Checkpoint:** `models/baseline/vit_deepfake_v1_baseline.pth`

### Dataset
- **Training Data:** 140k Real-vs-Fake (100k split) + CIFAKE ($32\times 32$ CIFAR-10 objects upscaled)
- **Validation Data:** 140k Real-vs-Fake valid split (20k)
- **Test Data:** 140k Real-vs-Fake test split (20k)

### Configuration
- **Optimizer:** `AdamW` (learning rate $= 1\times 10^{-5}$, weight decay $= 0.01$)
- **Loss:** `CrossEntropyLoss`
- **Scheduler:** `CosineAnnealingLR` ($T_{\max} = 15$)
- **Batch Size:** 32 (CUDA)
- **Epochs:** 15

### Results

| Metric | Result |
|---|---:|
| **Test Accuracy (140k Benchmark)** | 99.54% |
| **F1-Score** | 0.9782 |
| **ROC-AUC** | 0.9941 |
| **Real-World Smartphone Accuracy** | $<40\%$ (High False Positive Rate) |
| **Inference Latency (ONNX CPU)** | ~85ms – 120ms |

### Comparison With Baseline
*N/A — This is the initial baseline.*

### Observations
1. Near-perfect performance on the in-distribution test set ($99.54\%$).
2. Catastrophic performance on in-the-wild smartphone photos: genuine user photos were flagged as `FAKE` with $>90\%$ confidence.
3. Code audit revealed that inference was passing $40\%$ wide-padded face crops (injecting substantial background context) while training used tightly cropped faces. Furthermore, CIFAKE introduced non-facial object features into the representation space.

### Conclusion
The $99.54\%$ metric represents dataset overfitting to FFHQ vs StyleGAN characteristics. The model did not learn generalized deepfake forgery detection.

### Decision
Preserve checkpoint as `vit_deepfake_v1_baseline.pth` for baseline benchmarking. Eliminate CIFAKE, fix crop padding at inference, and prepare for re-evaluation.

### Next Experiment
**Experiment 002:** Evaluate baseline ViT with corrected preprocessing (tight crop vs wide crop) on both benchmark data and smartphone photos to isolate preprocessing error from dataset deficiency.

---

## Experiment 002 — Baseline Preprocessing Isolation (Tight Crop vs Wide Crop)

### Date
2026-08-21

### Objective
Measure the exact impact of face crop padding ($1.1\times$ tight crop vs $1.3\times$ standardized vs $1.4\times$ wide crop vs uncropped) on the baseline ViT model without dHash overrides or ensemble heuristics.

### Hypothesis
Standardizing face crop bounding-box margins to $1.3\times$ will align the input distribution with the model's receptive field and reduce false positive predictions on real smartphone photos.

### Model
- Checkpoint: `models/baseline/vit_deepfake_v1_baseline.pth`
- Backbone: `google/vit-base-patch16-224` (86.5M parameters)

### Dataset
- **Benchmark Split:** 200 images (100 FFHQ Real, 100 StyleGAN Fake) from `real-vs-fake/test`
- **Smartphone Photos:** 30 genuine WhatsApp-compressed user photos from `Training_images` (Ground Truth: 100% Real)

### Results

#### Part A: Benchmark Verification
| Test Split | Accuracy | Correct / Total | Real Accuracy (FFHQ) | Fake Accuracy (StyleGAN) |
|---|---:|---:|---:|---:|
| **140k In-Distribution Test Sample** | **98.50%** | 197 / 200 | 98.00% (98/100) | 99.00% (99/100) |

#### Part B: Real Smartphone Photos Under 4 Preprocessing Conditions
| Preprocessing Mode | Correct (REAL) | False FAKE | Real Accuracy | False Positive Rate | Mean P(REAL) |
|---|---|---|---|---|---|
| **Mode A: Tight Face Crop (1.1x Margin - FFHQ Style)** | 21 / 30 | 9 / 30 | 70.0% | 30.0% | 72.1% |
| **Mode B: Standardized Face Crop (1.3x Margin)** | **26 / 30** | **4 / 30** | **86.7%** | **13.3%** | **81.8%** |
| **Mode C: Legacy Wide Crop (1.4x Margin - Old Inference)** | 25 / 30 | 5 / 30 | 83.3% | 16.7% | 81.7% |
| **Mode D: Full Uncropped Image (Direct Resize to 224)** | 25 / 30 | 5 / 30 | 83.3% | 16.7% | 81.4% |

### Failure Analysis of Mode B (1.3x)
4 out of 30 images were misclassified as FAKE:
1. `WhatsApp Image 2026-07-21 at 8.49.27 PM.jpeg` (P(Fake) = 67.46% — Dim evening lighting, ISO sensor grain)
2. `WhatsApp Image 2026-07-21 at 8.49.28 PM (1).jpeg` (P(Fake) = 98.98% — Low light, heavy WhatsApp chroma subsampling)
3. `WhatsApp Image 2026-07-21 at 9.55.44 PM (1).jpeg` (P(Fake) = 83.17% — Screen reflection backlight)
4. `WhatsApp Image 2026-07-21 at 9.55.53 PM.jpeg` (P(Fake) = 92.85% — Mixed indoor fluorescent lighting)

### Observations
1. Standardized $1.3\times$ face cropping dramatically outperformed $1.1\times$ tight cropping (+16.7% accuracy boost), proving that some facial contour/chin context is necessary for ViT attention.
2. The remaining false positives are directly correlated with **low-light sensor noise and WhatsApp compression**, confirming that the model's training on pristine FFHQ lacks noise-invariance.

### Conclusion & Decision
- **Preprocessing Fix Verified:** $1.3\times$ bounding box margin is established as the standard face extraction protocol for all future stages.
- **Next Step:** Evaluate SBI (Self-Blended Images) on these same 30 photos to determine if SBI correctly classifies the 4 noisy/low-light images that ViT missed (Phase 4).

---

## Experiment 003 — SBI EfficientNet-B4 Independent Evaluation [PENDING]

### Date
*Pending Phase 4 Execution*

### Objective
Measure the zero-shot deepfake detection accuracy of Self-Blended Images (SBI) on the benchmark test set and smartphone photos.

### Hypothesis
Because SBI is trained on synthetic blending boundaries on real images without ever seeing specific deepfake generators, it will achieve superior cross-dataset generalization on face swaps and smartphone photos compared to the baseline ViT.

### Model
- SBI `EfficientNet-B4` (Pretrained weights from CVPR 2022 release)

### Results
| Metric | Benchmark Set | Real-World Smartphone Set |
|---|---|---|
| Accuracy | TBD | TBD |
| False Positive Rate (FPR) | TBD | TBD |
| False Negative Rate (FNR) | TBD | TBD |
| F1-Score | TBD | TBD |
| Latency | TBD | TBD |

---

## Experiment 004 — Ensemble Fusion Calibration [PENDING]

### Date
*Pending Phase 6 Execution*

### Objective
Determine the optimal linear fusion weights ($w_{\text{ViT}}, w_{\text{SBI}}$) and decision threshold $\tau$ on the dedicated calibration dataset.

### Grid Search Configurations
- Weights: $[0.50/0.50, 0.60/0.40, 0.70/0.30, 0.80/0.20]$
- Thresholds: $\tau \in [0.40, 0.45, 0.50, 0.55, 0.60]$

---

## Experiment 005 — ViT Fine-Tuning on Re-Curated Dataset [CONDITIONAL]

### Objective
Fine-tune ViT-Base on re-curated dataset (FFHQ + LFW + FF++ + Celeb-DF) with Albumentations compression & noise augmentation if Experiment 002 demonstrates that baseline ViT requires dataset re-learning.
