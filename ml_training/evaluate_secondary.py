"""
Phase 4: Secondary Detector Independent Evaluation Script

Evaluates the secondary model independently on:
1. Benchmark Test Split (FFHQ Real vs StyleGAN Fake)
2. 30 Real Smartphone Photos (100% Real)

Compares per-image predictions against the baseline ViT model to identify:
- Which images ViT got wrong that Secondary gets right (complementary value)
- Which images Secondary gets wrong that ViT gets right
- Agreement and disagreement matrices
"""

import os
os.environ["HF_HUB_OFFLINE"] = "1"
import sys
import glob
from pathlib import Path
from PIL import Image, ImageOps
import torch
import torch.nn.functional as F
from torchvision import transforms
import numpy as np
import cv2
import pandas as pd

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ml_training.models.vit_classifier import load_baseline_model
from ml_training.models.sbi_classifier import HuggingFaceSecondaryClassifier

INFERENCE_TRANSFORM = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

haar_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')


def crop_face_standard(pil_image, padding_multiplier=1.3):
    img_cv = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
    h_img, w_img, _ = img_cv.shape

    gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
    faces = haar_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(60, 60))
    if len(faces) > 0:
        x, y, w, h = max(faces, key=lambda b: b[2] * b[3])
        pad_w = int(w * (padding_multiplier - 1.0) / 2)
        pad_h = int(h * (padding_multiplier - 1.0) / 2)
        x1 = max(0, x - pad_w)
        y1 = max(0, y - pad_h)
        x2 = min(w_img, x + w + pad_w)
        y2 = min(h_img, y + h + pad_h)
        return pil_image.crop((x1, y1, x2, y2))

    min_dim = min(w_img, h_img)
    start_x = (w_img - min_dim) // 2
    start_y = (h_img - min_dim) // 2
    return pil_image.crop((start_x, start_y, start_x + min_dim, start_y + min_dim))


def predict_model(model, image, device):
    tensor = INFERENCE_TRANSFORM(image).unsqueeze(0).to(device)
    with torch.no_grad():
        logits = model(tensor)
        probs = F.softmax(logits, dim=1)
    
    pred_class = torch.argmax(probs, dim=1).item()
    return {
        "pred_class": pred_class,
        "verdict": "REAL" if pred_class == 0 else "FAKE",
        "confidence": probs[0, pred_class].item(),
        "real_prob": probs[0, 0].item(),
        "fake_prob": probs[0, 1].item()
    }


def evaluate_dual():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"--- Running Dual Independent Evaluation on: {device} ---")

    # Load Baseline ViT
    print("Loading Primary Model: Baseline ViT...")
    vit_model = load_baseline_model("models/baseline/vit_deepfake_v1_baseline.pth", device=device)

    # Load Secondary Model
    print("Loading Secondary Model: DeepFake-Detector-v2...")
    secondary_model = HuggingFaceSecondaryClassifier("prithivMLmods/Deep-Fake-Detector-v2-Model")
    secondary_model.to(device)
    secondary_model.eval()
    print("Both models loaded successfully.")

    phone_dir = r"C:\Users\NikhilGujjar\Pictures\Training_images"
    phone_images = glob.glob(os.path.join(phone_dir, "*.jpeg")) + glob.glob(os.path.join(phone_dir, "*.jpg")) + glob.glob(os.path.join(phone_dir, "*.png"))

    print(f"\nEvaluating {len(phone_images)} Real Smartphone Photos on both models...")

    comparison_records = []
    vit_correct_count = 0
    sec_correct_count = 0
    both_correct_count = 0
    either_correct_count = 0

    for path in phone_images:
        raw_img = Image.open(path).convert('RGB')
        raw_img = ImageOps.exif_transpose(raw_img)
        face_crop = crop_face_standard(raw_img, padding_multiplier=1.3)

        vit_res = predict_model(vit_model, face_crop, device)
        sec_res = predict_model(secondary_model, face_crop, device)

        vit_correct = (vit_res["pred_class"] == 0)
        sec_correct = (sec_res["pred_class"] == 0)

        if vit_correct: vit_correct_count += 1
        if sec_correct: sec_correct_count += 1
        if vit_correct and sec_correct: both_correct_count += 1
        if vit_correct or sec_correct: either_correct_count += 1

        comparison_records.append({
            "filename": os.path.basename(path),
            "ViT_Verdict": vit_res["verdict"],
            "ViT_P(REAL)": f"{vit_res['real_prob']*100:.1f}%",
            "ViT_P(FAKE)": f"{vit_res['fake_prob']*100:.1f}%",
            "Secondary_Verdict": sec_res["verdict"],
            "Secondary_P(REAL)": f"{sec_res['real_prob']*100:.1f}%",
            "Secondary_P(FAKE)": f"{sec_res['fake_prob']*100:.1f}%",
            "ViT_Correct": vit_correct,
            "Secondary_Correct": sec_correct,
            "Agreement": vit_res["verdict"] == sec_res["verdict"]
        })

    df = pd.DataFrame(comparison_records)
    
    print("\n" + "=" * 90)
    print("PHASE 4: DUAL MODEL INDEPENDENT COMPARISON (REAL SMARTPHONE PHOTOS)")
    print("=" * 90)
    print(f"Total Test Images           : {len(phone_images)}")
    print(f"Primary ViT Accuracy        : {vit_correct_count}/{len(phone_images)} ({vit_correct_count/len(phone_images)*100:.1f}%)")
    print(f"Secondary Model Accuracy    : {sec_correct_count}/{len(phone_images)} ({sec_correct_count/len(phone_images)*100:.1f}%)")
    print(f"Both Models Correct (Consensus): {both_correct_count}/{len(phone_images)} ({both_correct_count/len(phone_images)*100:.1f}%)")
    print(f"Either Model Correct (Union): {either_correct_count}/{len(phone_images)} ({either_correct_count/len(phone_images)*100:.1f}%)")
    print("=" * 90)

    # Disagreement breakdown
    vit_only = df[df["ViT_Correct"] & (~df["Secondary_Correct"])]
    sec_only = df[(~df["ViT_Correct"]) & df["Secondary_Correct"]]

    print(f"\nImages ViT got right while Secondary failed: {len(vit_only)}")
    print(f"Images Secondary got right while ViT failed: {len(sec_only)}")

    if len(sec_only) > 0:
        print("\n--- Secondary Rescued These ViT Failure Cases ---")
        for _, row in sec_only.iterrows():
            print(f"  • {row['filename']}: ViT said {row['ViT_Verdict']} ({row['ViT_P(FAKE)']}) -> Secondary said {row['Secondary_Verdict']} ({row['Secondary_P(REAL)']})")

    # Save results
    os.makedirs("ml_training/results/secondary", exist_ok=True)
    df.to_csv("ml_training/results/secondary/dual_model_comparison.csv", index=False)
    print("\nDetailed comparison saved to: ml_training/results/secondary/dual_model_comparison.csv")


if __name__ == "__main__":
    evaluate_dual()
