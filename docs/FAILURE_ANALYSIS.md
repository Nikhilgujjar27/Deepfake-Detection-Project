# Failure Analysis & Root Cause Investigation

This document catalogs every critical flaw, failure mode, and discrepancy uncovered during the deep technical audit and ongoing empirical evaluations, alongside verified remediations.

---

## Failure 001 — Face Crop Bounding Box Padding Discrepancy

```
Problem
   ↓  Severe False Positive Rate on real-world smartphone photos
Observed behavior
   ↓  Genuine user selfies and portraits classified as FAKE with >90% confidence
Root cause
   ↓  Training was performed on tight 256x256 facial crops (FFHQ), while inference
   ↓  extracted faces using MediaPipe expanded with a 40% wide-padding multiplier
Evidence
   ↓  Legacy dataset.py loaded tight crops; legacy inference_service.py:440 applied:
   ↓  "w_pad = int(w * 0.40); h_pad = int(h * 0.40)" injecting shirts, walls, background noise
Fix
   ↓  Standardize face extraction everywhere using RetinaFace with an exact 1.30x (30%)
   ↓  bounding box margin across both data preparation and inference
Before result
   ↓  Real smartphone photos misclassified as FAKE
After result
   ↓  Scheduled for measurement in Experiment 002
```

---

## Failure 002 — dHash Perceptual Template Backdoor

```
Problem
   ↓  Artificially inflated self-test validation (false sense of calibration)
Observed behavior
   ↓  Specific test subjects always passed with 98.75% REAL confidence regardless of actual model prediction
Root cause
   ↓  48 hardcoded hexadecimal perceptual hash templates in the backend inference service
   ↓  bypassed the ViT classifier entirely whenever Hamming distance was <= 4
Evidence
   ↓  Legacy inference_service.py lines 485-499:
   ↓  "is_user = any(sum(c1 != c2 for c1, c2 in zip(crop_dhash, temp)) <= 4 for temp in USER_TEMPLATES)"
   ↓  "if is_user: return {'is_fake': False, 'confidence': 0.9875}"
Fix
   ↓  Completely removed dHash comparison logic from the authenticity classification path.
   ↓  Predictions are driven 100% by neural network inference.
Before result
   ↓  Biased, non-blind evaluation results
After result
   ↓  Eliminated backdoor; evaluation in evaluate_baseline.py is strictly objective
```

---

## Failure 003 — CIFAKE Non-Facial Object Data Contamination

```
Problem
   ↓  Degraded facial decision boundary and noisy attention maps
Observed behavior
   ↓  Model attention focused on random lighting gradients and background pixels rather than facial features
Root cause
   ↓  The training pipeline merged CIFAKE (60,000 CIFAR-10 general object images: airplanes, ships,
   ↓  automobiles, frogs upscaled from 32x32) into the face training dataset
Evidence
   ↓  Legacy ml_model/training/dataset.py lines 91-100:
   ↓  "path_cifake = os.path.join('data', 'cifake', split) ... ConcatDataset(dataset_list)"
Fix
   ↓  Purged CIFAKE from all active data loaders. Future training pipelines restrict inputs exclusively
   ↓  to human face datasets (FFHQ, LFW, FaceForensics++, Celeb-DF).
Before result
   ↓  ViT learned non-face texture statistics that corrupted face representation space
After result
   ↓  Cleaner facial representation learning in re-curated dataset
```

---

## Failure 004 — Dead Denoising Preprocessing Code

```
Problem
   ↓  Documentation claimed inference-time bilateral filtering and CLAHE were active, but code was dead
Observed behavior
   ↓  Preprocessing produced raw image inputs without the claimed adaptive denoising
Root cause
   ↓  Method `_apply_adversarial_denoising` was implemented in the service class but never invoked
   ↓  in the execution flow of `predict()`
Evidence
   ↓  Legacy inference_service.py line 137 defines `_apply_adversarial_denoising()`, but search for
   ↓  call sites in the repository yielded 0 invocations.
Fix
   ↓  Rather than reviving brittle inference-time denoising, augmentations (Gaussian noise, ISO grain,
   ↓  CLAHE, JPEG compression) are moved to training-time in Albumentations. Inference preprocessing
   ↓  remains strictly deterministic: Resize(224) + ImageNet Normalize.
Before result
   ↓  Unused dead code and false documentation claims
After result
   ↓  Clean, transparent pipeline where training augmentation teaches model invariance directly
```

---

## Failure 005 — Frontend Canvas JPEG Transcode Transparency Corruption

```
Problem
   ↓  Uploading transparent PNG images resulted in solid black backgrounds and corrupted inference
Observed behavior
   ↓  PNG images uploaded via browser had black boxes around heads, causing false FAKE verdicts
Root cause
   ↓  Client-side `compressImage` utility in `Dashboard.tsx` drew uploaded images onto an HTML5 canvas
   ↓  and forcefully exported them as `image/jpeg`. Alpha transparency channels converted to black RGB (0,0,0).
Evidence
   ↓  Legacy frontend `src/pages/Dashboard.tsx` line 32:
   ↓  "canvas.toDataURL('image/jpeg', 0.85)"
Fix
   ↓  Preserve raw uploaded image binary stream without lossy client-side canvas re-encoding.
   ↓  Image sanitization and format handling is performed server-side via PIL with proper alpha flattening.
Before result
   ↓  Corrupted image inputs for PNG uploads
After result
   ↓  Pristine image ingestion across JPG, PNG, WEBP, and TIFF
```

---

## Failure 006 — Absence of Smartphone Degradation in Training Distribution

```
Problem
   ↓  Model fails to generalize to everyday photos taken on mobile devices
Observed behavior
   ↓  High confidence FAKE on genuine smartphone camera photos, especially low-light or WhatsApp-compressed
Root cause
   ↓  Real training class was composed 100% of FFHQ (clean, high-resolution DSLR portraits from Flickr).
   ↓  Model learned "Real = High-res DSLR studio statistics; Low-res/Noise/Compression = GAN/Fake".
Evidence
   ↓  FFHQ dataset analysis shows high dynamic range, crisp focus, studio lighting, and zero WhatsApp 
   ↓  compression artifacts.
Fix
   ↓  Integrate LFW (in-the-wild real photos) and apply Albumentations JPEG/WebP compression (Q=30-85),
   ↓  downscale/upscale resizing, and ISO sensor noise directly during training.
Before result
   ↓  Massive domain gap between training data and real user photos
After result
   ↓  Model learns robust invariant representations across compression levels
```
