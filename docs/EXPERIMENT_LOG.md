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

## Experiment 002 — Baseline Preprocessing Isolation (Tight Crop vs Wide Crop) [PENDING]

### Date
*Pending Phase 3 Execution*

### Objective
Measure the exact impact of face crop padding ($1.0\times$ tight crop vs $1.3\times$ standardized vs $1.4\times$ wide crop) on the baseline ViT model without any dHash overrides or ensemble models.

### Hypothesis
Evaluating the existing baseline ViT on real smartphone photos using tight crops (matching its training distribution) will improve real-world accuracy compared to the legacy $40\%$ wide crop, establishing the true baseline performance before any retraining.

### Model
- `models/baseline/vit_deepfake_v1_baseline.pth`

### Dataset
- `data/processed/test/` (Benchmark test split)
- `collected_photos/` (User collected smartphone photos across 10 categories)

### Configuration
- Script: `ml_training/evaluate_baseline.py`
- Test A: Tight Crop ($1.05\times$ bounding box)
- Test B: Standardized Margin ($1.30\times$ bounding box)
- Test C: Wide Margin ($1.40\times$ bounding box)

### Results
| Metric | Test A (Tight) | Test B (1.3x) | Test C (Wide 1.4x) |
|---|---|---|---|
| Benchmark Accuracy | TBD | TBD | TBD |
| Smartphone Accuracy | TBD | TBD | TBD |
| Smartphone FPR | TBD | TBD | TBD |
| F1-Score | TBD | TBD | TBD |
| ROC-AUC | TBD | TBD | TBD |

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
