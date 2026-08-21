# Image Collection Guide — Real-World Evaluation Dataset

## 1. Objective
We need **250–350 real smartphone photos** collected with informed consent from friends, family, and diverse individuals. These photos form our empirical ground truth to test real-world generalization.

| Split | Target Count | Purpose | Touched During Training? |
|---|---|---|---|
| **Calibration Split** | ~50 photos | Optimizing ensemble weights and decision thresholds in Phase 6 | ⚠️ Used for calibration only |
| **Held-Out Test Split** | ~200–300 photos | Final single-pass empirical validation in Phase 7 | 🔒 **NEVER** exposed to training/tuning |

---

## 2. Collection Categories & Targets

```
collected_photos/
├── indoor_good_light/        (30-40 photos) Living rooms, offices, overhead/window light
├── indoor_low_light/         (20-30 photos) Evening, dim rooms, lamp illumination, screen glow
├── outdoor_daylight/         (30-40 photos) Parks, streets, natural sunlight, overcast
├── outdoor_harsh_backlit/    (15-20 photos) Sun directly behind subject, strong facial shadows
├── selfies/                  (30-40 photos) Front camera, varied angles, beauty mode on/off
├── rear_camera_portraits/    (20-30 photos) 1-3 meter distance, normal photo distance
├── group_photos/             (20-30 photos) 2 to 5+ people in frame, varied face sizes
├── whatsapp_compressed/      (20-30 photos) Original photos sent and saved via WhatsApp
├── edge_cases/               (15-20 photos) Glasses, hats, masks, side angles (45°-90°)
└── screenshots/              (10-15 photos) Mobile screenshots of social media profile pictures
```

---

## 3. Recommended Naming Convention
`{category}_{device}_{index}.jpg` (e.g., `selfie_samsung_001.jpg`, `indoor_good_iphone_012.jpg`, `whatsapp_redmi_005.jpg`).

---

## 4. Exclusion Criteria (What NOT to Include)
- ❌ Professional DSLR / Studio portraits (already represented in FFHQ).
- ❌ Stock photos downloaded from Google Images.
- ❌ AI-generated synthetic faces (these are sourced separately for the FAKE class).
- ❌ Cartoonish AR filters (Snapchat dog ears, anime face morphs).
- ❌ Photos where no face is clearly discernable.

---

## 5. Privacy & Consent
- Obtain verbal or written consent from all photographed subjects.
- All images remain strictly local on the development machine (`data/holdout/real/`).
- Images are never uploaded to public cloud repositories, public S3 buckets, or public APIs.
