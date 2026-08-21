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

## 2. Real-World Smartphone Photo Evaluation (Phase 3 Baseline)

*Evaluated on 30 genuine WhatsApp-compressed smartphone photos from `Training_images` across 4 face crop extraction conditions (Ground Truth: 100% REAL).*

| Preprocessing Extraction Mode | Sample Count | Correct (REAL) | False FAKE | Real Accuracy | False Positive Rate (FPR) | Mean P(REAL) Confidence | Status |
|---|---|---|---|---|---|---|---|
| **Mode A: Tight Crop (1.1x Margin)** | 30 | 21 / 30 | 9 / 30 | 70.0% | 30.0% | 72.1% | Evaluated |
| **Mode B: Standardized Margin (1.3x)** | 30 | **26 / 30** | **4 / 30** | **86.7%** | **13.3%** | **81.8%** | **Optimal Baseline** |
| **Mode C: Legacy Wide Crop (1.4x Margin)**| 30 | 25 / 30 | 5 / 30 | 83.3% | 16.7% | 81.7% | Evaluated |
| **Mode D: Full Uncropped (Direct Resize)** | 30 | 25 / 30 | 5 / 30 | 83.3% | 16.7% | 81.4% | Evaluated |

### Verified Failure Cases in Mode B (1.3x Margin)
1. `WhatsApp Image 2026-07-21 at 8.49.27 PM.jpeg` — P(Fake) = 67.46% (Low light / Evening)
2. `WhatsApp Image 2026-07-21 at 8.49.28 PM (1).jpeg` — P(Fake) = 98.98% (High ISO sensor grain)
3. `WhatsApp Image 2026-07-21 at 9.55.44 PM (1).jpeg` — P(Fake) = 83.17% (Backlit screen reflection)
4. `WhatsApp Image 2026-07-21 at 9.55.53 PM.jpeg` — P(Fake) = 92.85% (Dim mixed indoor light)

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
