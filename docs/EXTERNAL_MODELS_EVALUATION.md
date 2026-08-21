# Evaluation of External AI Models & APIs for Deepfake Detection

## 1. Summary Matrix of Evaluated Candidates

| Candidate / Framework | Paradigm | VRAM Requirement | Local / Cloud | Academic Suitability | Primary Recommendation |
|---|---|---|---|---|---|
| **SBI (Self-Blended Images)** | EfficientNet-B4 (CNN) | ~1.5 GB | **Local (RTX 5050)** | ✅ High (CVPR 2022) | **⭐️ RECOMMENDED SECONDARY** |
| **RECCE** | Autoencoder + CNN | ~2.5 GB | **Local (RTX 5050)** | ✅ High (CVPR 2022) | Strong Alternative to SBI |
| **dima806/deepfake_vs_real** | ViT-Base | ~1.8 GB | Local / HF API | ⚠️ Outdated (2023) | Rejected (Redundant with ViT) |
| **XceptionNet (FF++)** | Xception CNN | ~1.0 GB | Local | ⚠️ Poor Gen. | Rejected (Fails on compressed data) |
| **Google Gemini 2.5 Flash** | Multimodal LLM | Cloud API | Cloud (Google) | ⚠️ 15-20% gap | Rejected for Primary Verdict |
| **Reality Defender API** | Commercial API | Cloud API | Cloud | ❌ 50 req/mo cap | Rejected (Impractical limits) |
| **Hugging Face Serverless** | Hosted Inference | Cloud API | Cloud | ⚠️ Cold starts | Useful for dev sanity tests |

---

## 2. Deep Dive: Why Self-Blended Images (SBI) is the Best Secondary Model

1. **Orthogonal Feature Learning:** SBI uses an `EfficientNet-B4` convolutional backbone. Convolutions excel at detecting localized pixel discrepancies, high-frequency boundary noise, and color space blending seams. Conversely, Vision Transformers excel at global structural patch consistency.
2. **Zero-Shot Cross-Dataset Robustness:** By training exclusively on synthetic source/target blending masks generated from pristine real images, SBI does not overfit to specific GAN or autoencoder architectures (e.g., DeepFaceLab, Face2Face).
3. **Resource Footprint:** 19M parameters requiring ~1.5GB VRAM, allowing concurrent execution with our 86.5M parameter ViT (~1.8GB) on the 8GB RTX 5050.

---

## 3. Deep Dive: Why General MLLMs (Gemini / GPT-4V) Are Not Primary Classifiers

1. **Classification Gap:** Academic research (*DeepfakeBench-MM 2025/2026*) establishes that general-purpose multimodal LLMs lag specialized deepfake detectors by 15–20% on subtle synthetic artifacts.
2. **High Latency:** Cloud roundtrips average 2,000ms – 5,000ms compared to 18ms – 50ms for local GPU execution.
3. **Data Retention & Privacy:** Free-tier Gemini AI Studio endpoints retain submitted images for model training and potential human review.
4. **Internet Dependency:** Introduces external network failure points into the application architecture.
