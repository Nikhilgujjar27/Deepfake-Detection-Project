"""
Empirical Comparison Script — Phase 3 Investigation

Compares the baseline ViT model on:
1. Benchmark Test Set (FFHQ Real vs StyleGAN Fake)
2. Real Smartphone Photos under 4 face-extraction conditions:
   - Mode A: Tight Face Crop (1.1x margin, matching FFHQ)
   - Mode B: Standardized Margin (1.3x margin)
   - Mode C: Legacy Wide Crop (1.4x margin / 40% padding)
   - Mode D: Full Uncropped Image (Direct Resize to 224x224)

Outputs exact predictions and side-by-side metrics.
"""

import os
os.environ["HF_HUB_OFFLINE"] = "1"
import sys
import json
import time
import glob
from pathlib import Path
from PIL import Image, ImageOps
import torch
import torch.nn.functional as F
from torchvision import transforms
import numpy as np
import cv2
import pandas as pd

# Import ViT model
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ml_training.models.vit_classifier import load_baseline_model

INFERENCE_TRANSFORM = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# MediaPipe face detector setup
try:
    import mediapipe as mp
    mp_face_detection = mp.solutions.face_detection
    face_detector = mp_face_detection.FaceDetection(model_selection=1, min_detection_confidence=0.5)
except Exception as e:
    face_detector = None
    print(f"Warning: MediaPipe face detector init failed: {e}")

# OpenCV Haar Cascade fallback
haar_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')


def detect_and_crop_face(pil_image, padding_multiplier=1.1):
    """
    Detects face and crops with specified padding multiplier.
    padding_multiplier:
      - 1.0 = exact bounding box
      - 1.1 = 10% padding (tight, FFHQ style)
      - 1.3 = 30% padding (standardized)
      - 1.4 = 40% padding (legacy wide crop)
    """
    img_cv = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
    h_img, w_img, _ = img_cv.shape

    bbox = None

    # 1. Try MediaPipe
    if face_detector is not None:
        rgb_img = cv2.cvtColor(img_cv, cv2.COLOR_BGR2RGB)
        results = face_detector.process(rgb_img)
        if results.detections:
            # Pick highest score face
            det = max(results.detections, key=lambda d: d.score[0])
            bb = det.location_data.relative_bounding_box
            x = int(bb.xmin * w_img)
            y = int(bb.ymin * h_img)
            w = int(bb.width * w_img)
            h = int(bb.height * h_img)
            bbox = (x, y, w, h)

    # 2. Fallback to Haar Cascade
    if bbox is None:
        gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
        faces = haar_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(60, 60))
        if len(faces) > 0:
            # Pick largest face
            bbox = max(faces, key=lambda b: b[2] * b[3])

    # If still no face detected, return centered crop
    if bbox is None:
        min_dim = min(w_img, h_img)
        start_x = (w_img - min_dim) // 2
        start_y = (h_img - min_dim) // 2
        return pil_image.crop((start_x, start_y, start_x + min_dim, start_y + min_dim))

    x, y, w, h = bbox
    pad_w = int(w * (padding_multiplier - 1.0) / 2)
    pad_h = int(h * (padding_multiplier - 1.0) / 2)

    x1 = max(0, x - pad_w)
    y1 = max(0, y - pad_h)
    x2 = min(w_img, x + w + pad_w)
    y2 = min(h_img, y + h + pad_h)

    return pil_image.crop((x1, y1, x2, y2))


def predict_single(model, image, device):
    """Predicts REAL (0) or FAKE (1) for a single PIL image."""
    tensor = INFERENCE_TRANSFORM(image).unsqueeze(0).to(device)
    with torch.no_grad():
        logits = model(tensor)
        probs = F.softmax(logits, dim=1)
    
    pred_class = torch.argmax(probs, dim=1).item()
    real_prob = probs[0, 0].item()
    fake_prob = probs[0, 1].item()
    confidence = probs[0, pred_class].item()
    
    return {
        "pred_class": pred_class,
        "verdict": "REAL" if pred_class == 0 else "FAKE",
        "confidence": confidence,
        "real_prob": real_prob,
        "fake_prob": fake_prob
    }


def evaluate_all():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"--- Running Empirical Evaluation on: {device} ---")

    weights_path = "models/baseline/vit_deepfake_v1_baseline.pth"
    if not os.path.exists(weights_path):
        print(f"Error: {weights_path} not found.")
        return

    print("Loading Baseline Model...")
    model = load_baseline_model(weights_path, device=device)
    print("Model Loaded Successfully.")

    # 1. EVALUATE BENCHMARK SAMPLE (140k test set)
    benchmark_dir = r"C:\Users\NikhilGujjar\OneDrive\Desktop\Deepfake Major Project\data\real_vs_fake\real-vs-fake\test"
    if os.path.exists(benchmark_dir):
        print("\n" + "=" * 60)
        print("1. EVALUATING IN-DISTRIBUTION BENCHMARK (140k Test Sample)")
        print("=" * 60)
        real_files = glob.glob(os.path.join(benchmark_dir, "real", "*.*"))[:100]
        fake_files = glob.glob(os.path.join(benchmark_dir, "fake", "*.*"))[:100]

        bench_results = []
        for f in real_files:
            img = Image.open(f).convert('RGB')
            res = predict_single(model, img, device)
            bench_results.append({"type": "REAL (FFHQ)", "correct": res["pred_class"] == 0, **res})

        for f in fake_files:
            img = Image.open(f).convert('RGB')
            res = predict_single(model, img, device)
            bench_results.append({"type": "FAKE (StyleGAN)", "correct": res["pred_class"] == 1, **res})

        bench_df = pd.DataFrame(bench_results)
        acc = bench_df["correct"].mean() * 100
        real_acc = bench_df[bench_df["type"] == "REAL (FFHQ)"]["correct"].mean() * 100
        fake_acc = bench_df[bench_df["type"] == "FAKE (StyleGAN)"]["correct"].mean() * 100

        print(f"Total Benchmark Images: {len(bench_df)}")
        print(f"Overall Benchmark Accuracy : {acc:.2f}%")
        print(f"Real (FFHQ) Accuracy       : {real_acc:.2f}%")
        print(f"Fake (StyleGAN) Accuracy   : {fake_acc:.2f}%")

    # 2. EVALUATE SMARTPHONE PHOTOS UNDER 4 CROPPING CONDITIONS
    phone_dir = r"C:\Users\NikhilGujjar\Pictures\Training_images"
    if os.path.exists(phone_dir):
        phone_images = glob.glob(os.path.join(phone_dir, "*.jpeg")) + glob.glob(os.path.join(phone_dir, "*.jpg")) + glob.glob(os.path.join(phone_dir, "*.png"))
        print("\n" + "=" * 60)
        print(f"2. EVALUATING {len(phone_images)} REAL SMARTPHONE PHOTOS (Ground Truth: ALL REAL)")
        print("=" * 60)

        modes = [
            ("Mode A: Tight Face Crop (1.1x Margin - FFHQ Style)", 1.1, True),
            ("Mode B: Standardized Face Crop (1.3x Margin)", 1.3, True),
            ("Mode C: Legacy Wide Crop (1.4x Margin - Old Inference)", 1.4, True),
            ("Mode D: Full Uncropped Image (Direct Resize)", 1.0, False)
        ]

        summary_rows = []
        detailed_records = []

        for mode_name, pad_mult, use_crop in modes:
            correct_count = 0
            fp_count = 0
            avg_real_prob = []

            for path in phone_images:
                raw_img = Image.open(path).convert('RGB')
                raw_img = ImageOps.exif_transpose(raw_img)

                if use_crop:
                    processed_img = detect_and_crop_face(raw_img, padding_multiplier=pad_mult)
                else:
                    processed_img = raw_img

                res = predict_single(model, processed_img, device)
                is_correct = (res["pred_class"] == 0)

                if is_correct:
                    correct_count += 1
                else:
                    fp_count += 1

                avg_real_prob.append(res["real_prob"])
                detailed_records.append({
                    "image": os.path.basename(path),
                    "mode": mode_name,
                    "verdict": res["verdict"],
                    "confidence": res["confidence"],
                    "real_prob": res["real_prob"],
                    "fake_prob": res["fake_prob"],
                    "correct": is_correct
                })

            accuracy = (correct_count / len(phone_images)) * 100
            fpr = (fp_count / len(phone_images)) * 100
            mean_p_real = np.mean(avg_real_prob) * 100

            summary_rows.append({
                "Preprocessing Mode": mode_name,
                "Correct (REAL)": f"{correct_count}/{len(phone_images)}",
                "False FAKE": f"{fp_count}/{len(phone_images)}",
                "Real Accuracy": f"{accuracy:.1f}%",
                "False Positive Rate": f"{fpr:.1f}%",
                "Mean P(REAL)": f"{mean_p_real:.1f}%"
            })

        print("\n" + "=" * 80)
        print("EMPIRICAL COMPARISON TABLE: REAL SMARTPHONE PHOTOS")
        print("=" * 80)
        summary_df = pd.DataFrame(summary_rows)
        print(summary_df.to_string(index=False))
        print("=" * 80)

        # Save to experiment results
        os.makedirs("ml_training/results/baseline", exist_ok=True)
        summary_df.to_csv("ml_training/results/baseline/crop_padding_comparison.csv", index=False)
        pd.DataFrame(detailed_records).to_csv("ml_training/results/baseline/smartphone_predictions_by_crop.csv", index=False)
        print("\nSaved detailed comparison to: ml_training/results/baseline/crop_padding_comparison.csv")


if __name__ == "__main__":
    evaluate_all()
