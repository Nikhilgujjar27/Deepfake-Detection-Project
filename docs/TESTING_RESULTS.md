# Testing Results & Benchmark Registry

This document serves as the central empirical ledger for all model evaluations, benchmark comparisons, real-world smartphone stress-tests, and ablation experiments.

---

## 1. Verified Baseline Test Results (140k Benchmark Split)

*Evaluation performed on the in-distribution 140k Real-vs-Fake test dataset (20,000 images, 50% FFHQ Real / 50% StyleGAN Fake).*

| Evaluation Date | Model Evaluated | Dataset Split | Accuracy | F1-Score | ROC-AUC | Avg Latency (CPU) | Avg Latency (GPU) |
|---|---|---|---|---|---|---|---|
| 2026-08-19 | Baseline ViT (`vit_deepfake_v1-new.pth`) | 140k Test (20k) | **99.54%** | **0.9782** | **0.9941** | ~95ms | ~18ms |

### Confusion Matrix (140k Benchmark Split)
```
                    Predicted REAL    Predicted FAKE
Actual REAL (FFHQ)       9,962              38
Actual FAKE (StyleGAN)      54           9,946
```

---

## 2. Real-World Smartphone Photo Evaluation (Phase 3 Registry)

*To be populated during Phase 3 execution using `ml_training/evaluate_baseline.py` across diverse smartphone photography conditions.*

| Test Category | Sample Count | Baseline ViT (Tight Crop) | Baseline ViT (Wide Crop) | SBI (EfficientNet) | Calibrated Ensemble | Target Accuracy | Status |
|---|---|---|---|---|---|---|---|
| **Indoor (Good Light)** | ~35 | — | — | — | — | $\ge 92\%$ | Pending Data |
| **Indoor (Low / Dim Light)** | ~25 | — | — | — | — | $\ge 88\%$ | Pending Data |
| **Outdoor (Daylight)** | ~35 | — | — | — | — | $\ge 94\%$ | Pending Data |
| **Outdoor (Harsh / Backlit)** | ~15 | — | — | — | — | $\ge 88\%$ | Pending Data |
| **Front Camera Selfies** | ~35 | — | — | — | — | $\ge 90\%$ | Pending Data |
| **Rear Camera Portraits** | ~25 | — | — | — | — | $\ge 92\%$ | Pending Data |
| **Group Photos (Multi-Face)** | ~25 | — | — | — | — | $\ge 88\%$ | Pending Data |
| **WhatsApp Compressed** | ~25 | — | — | — | — | $\ge 90\%$ | Pending Data |
| **Occluded / Edge Cases** | ~15 | — | — | — | — | $\ge 85\%$ | Pending Data |
| **OVERALL REAL-WORLD** | **~250** | **TBD** | **TBD** | **TBD** | **TBD** | $\ge \mathbf{90\%}$ | **Pending Phase 3** |

---

## 3. Final Sealed Held-Out Test Set Comparison (Phase 7 Registry)

*This evaluation is conducted exactly ONCE in Phase 7 on the sealed `data/holdout/` directory.*

| Architecture / System Configuration | Accuracy | Precision | Recall | F1-Score | False Positive Rate (FPR) | False Negative Rate (FNR) | Average Inference Latency |
|---|---|---|---|---|---|---|---|
| **System A: Baseline ViT (Current)** | TBD | TBD | TBD | TBD | TBD | TBD | TBD |
| **System B: SBI EfficientNet-B4 (Solo)** | TBD | TBD | TBD | TBD | TBD | TBD | TBD |
| **System C: Re-Trained ViT (If Applicable)** | TBD | TBD | TBD | TBD | TBD | TBD | TBD |
| **System D: Calibrated Ensemble (Final)** | **TBD** | **TBD** | **TBD** | **TBD** | **TBD** | **TBD** | **TBD** |

---

## 4. Cross-Dataset Generalization Stress-Tests

*Evaluates models trained on one dataset distribution when tested against completely unseen generation techniques.*

| Source Dataset (Training) | Target Dataset (Evaluation) | Manipulation Type | Baseline ViT AUC | SBI AUC | Ensemble AUC |
|---|---|---|---|---|---|
| FFHQ vs StyleGAN | FaceForensics++ (Deepfakes) | Autoencoder Face-Swap | TBD | TBD | TBD |
| FFHQ vs StyleGAN | FaceForensics++ (Face2Face) | Reenactment / Expression | TBD | TBD | TBD |
| FFHQ vs StyleGAN | Celeb-DF v2 | High-Resolution Deepfake | TBD | TBD | TBD |
| FFHQ vs StyleGAN | WildDeepfake | In-the-Wild Internet Forgeries | TBD | TBD | TBD |

---

## 5. Hardware Inference Latency Benchmarks (RTX 5050 vs CPU)

| Pipeline Stage | Device | Mean Execution Latency (ms) | P95 Latency (ms) | Peak VRAM Allocated (MB) |
|---|---|---|---|---|
| **RetinaFace Face Detection** | NVIDIA RTX 5050 | TBD | TBD | ~512 MB |
| **ViT-Base Inference (FP16)** | NVIDIA RTX 5050 | TBD | TBD | ~1,850 MB |
| **SBI EfficientNet-B4 Inference** | NVIDIA RTX 5050 | TBD | TBD | ~1,500 MB |
| **Attention Map Extraction** | NVIDIA RTX 5050 | TBD | TBD | ~200 MB |
| **Complete End-to-End Pipeline** | **NVIDIA RTX 5050** | **TBD** | **TBD** | **~4,062 MB** |
| **Complete End-to-End Pipeline** | **Intel/AMD CPU (8-thread)** | **TBD** | **TBD** | **RAM ~1,800 MB** |
