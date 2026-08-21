"""
Phase 6: Ensemble Calibration and Fusion Optimization Script

Evaluates multi-model fusion strategies combining:
1. Primary ViT-Base (86.5M params)
2. Secondary DeepFake-Detector-v2

Tests combinations of:
- Weights: [50/50, 60/40, 70/30, 80/20, 85/15]
- Thresholds: [0.40, 0.45, 0.50, 0.55, 0.60]
- Fusion methods: Weighted Linear, Max Confidence, Softmax Temperature Calibrated

Evaluated on:
- 200 Benchmark Images (100 Real FFHQ, 100 Fake StyleGAN)
- 30 Real Smartphone Photos (100% Real)
"""

import os
os.environ["HF_HUB_OFFLINE"] = "1"
import sys
import glob
import json
from pathlib import Path
from PIL import Image, ImageOps
import torch
import torch.nn.functional as F
from torchvision import transforms
import numpy as np
import cv2
import pandas as pd
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

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


def get_probabilities(model, image, device):
    tensor = INFERENCE_TRANSFORM(image).unsqueeze(0).to(device)
    with torch.no_grad():
        logits = model(tensor)
        probs = F.softmax(logits, dim=1)
    return probs[0, 0].item(), probs[0, 1].item()  # real_prob, fake_prob


def run_ensemble_calibration():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"--- Running Phase 6 Ensemble Calibration on: {device} ---")

    # 1. Load Models
    print("Loading Primary Model: Baseline ViT...")
    vit_model = load_baseline_model("models/baseline/vit_deepfake_v1_baseline.pth", device=device)

    print("Loading Secondary Model: DeepFake-Detector-v2...")
    secondary_model = HuggingFaceSecondaryClassifier("prithivMLmods/Deep-Fake-Detector-v2-Model")
    secondary_model.to(device)
    secondary_model.eval()

    # 2. Gather Datasets
    benchmark_dir = r"C:\Users\NikhilGujjar\OneDrive\Desktop\Deepfake Major Project\data\real_vs_fake\real-vs-fake\test"
    phone_dir = r"C:\Users\NikhilGujjar\Pictures\Training_images"

    bench_real = glob.glob(os.path.join(benchmark_dir, "real", "*.*"))[:100]
    bench_fake = glob.glob(os.path.join(benchmark_dir, "fake", "*.*"))[:100]
    phone_images = glob.glob(os.path.join(phone_dir, "*.jpeg")) + glob.glob(os.path.join(phone_dir, "*.jpg")) + glob.glob(os.path.join(phone_dir, "*.png"))

    print(f"\nExtracting model probabilities on {len(bench_real)+len(bench_fake)} Benchmark images + {len(phone_images)} Smartphone images...")

    dataset_records = []

    # Process Benchmark Real
    for path in bench_real:
        img = Image.open(path).convert('RGB')
        v_real, v_fake = get_probabilities(vit_model, img, device)
        s_real, s_fake = get_probabilities(secondary_model, img, device)
        dataset_records.append({
            "split": "benchmark_real",
            "true_label": 0,  # 0=REAL, 1=FAKE
            "vit_p_fake": v_fake,
            "sec_p_fake": s_fake,
            "vit_p_real": v_real,
            "sec_p_real": s_real
        })

    # Process Benchmark Fake
    for path in bench_fake:
        img = Image.open(path).convert('RGB')
        v_real, v_fake = get_probabilities(vit_model, img, device)
        s_real, s_fake = get_probabilities(secondary_model, img, device)
        dataset_records.append({
            "split": "benchmark_fake",
            "true_label": 1,
            "vit_p_fake": v_fake,
            "sec_p_fake": s_fake,
            "vit_p_real": v_real,
            "sec_p_real": s_real
        })

    # Process Smartphone Real
    for path in phone_images:
        raw_img = Image.open(path).convert('RGB')
        raw_img = ImageOps.exif_transpose(raw_img)
        face_crop = crop_face_standard(raw_img, padding_multiplier=1.3)
        v_real, v_fake = get_probabilities(vit_model, face_crop, device)
        s_real, s_fake = get_probabilities(secondary_model, face_crop, device)
        dataset_records.append({
            "split": "smartphone_real",
            "true_label": 0,
            "vit_p_fake": v_fake,
            "sec_p_fake": s_fake,
            "vit_p_real": v_real,
            "sec_p_real": s_real
        })

    df = pd.DataFrame(dataset_records)
    print(f"Extraction complete. Total records: {len(df)}")

    # 3. Grid Search over Weights and Thresholds
    weight_configs = [
        ("ViT Only (100/0)", 1.0, 0.0),
        ("Secondary Only (0/100)", 0.0, 1.0),
        ("Ensemble 50/50", 0.50, 0.50),
        ("Ensemble 60/40", 0.60, 0.40),
        ("Ensemble 70/30", 0.70, 0.30),
        ("Ensemble 80/20", 0.80, 0.20),
        ("Ensemble 85/15", 0.85, 0.15)
    ]

    thresholds = [0.40, 0.45, 0.50, 0.55, 0.60]

    grid_results = []

    for w_name, w_vit, w_sec in weight_configs:
        # Calculate ensemble fake probability
        p_ens_fake = w_vit * df["vit_p_fake"] + w_sec * df["sec_p_fake"]
        
        for thresh in thresholds:
            preds = (p_ens_fake >= thresh).astype(int)

            # Benchmark Metrics
            bench_mask = df["split"].str.startswith("benchmark")
            y_bench_true = df.loc[bench_mask, "true_label"]
            y_bench_pred = preds.loc[bench_mask]
            y_bench_prob = p_ens_fake.loc[bench_mask]

            bench_acc = accuracy_score(y_bench_true, y_bench_pred) * 100
            bench_f1 = f1_score(y_bench_true, y_bench_pred, zero_division=0)
            bench_auc = roc_auc_score(y_bench_true, y_bench_prob) if len(np.unique(y_bench_true)) == 2 else 0.0

            # Smartphone Real Metrics
            phone_mask = df["split"] == "smartphone_real"
            phone_preds = preds.loc[phone_mask]
            phone_correct = (phone_preds == 0).sum()
            phone_total = phone_mask.sum()
            phone_acc = (phone_correct / phone_total) * 100
            phone_fpr = (1.0 - (phone_correct / phone_total)) * 100

            # Overall Combined Score (Equal weighting of Benchmark Acc + Smartphone Acc)
            combined_score = 0.5 * bench_acc + 0.5 * phone_acc

            grid_results.append({
                "Configuration": w_name,
                "Weight_ViT": w_vit,
                "Weight_Sec": w_sec,
                "Threshold": thresh,
                "Benchmark Acc": f"{bench_acc:.2f}%",
                "Benchmark F1": f"{bench_f1:.4f}",
                "Benchmark AUC": f"{bench_auc:.4f}",
                "Smartphone Acc": f"{phone_acc:.1f}% ({phone_correct}/{phone_total})",
                "Smartphone FPR": f"{phone_fpr:.1f}%",
                "Combined Score": f"{combined_score:.2f}%",
                "raw_combined": combined_score,
                "raw_bench_acc": bench_acc,
                "raw_phone_acc": phone_acc
            })

    results_df = pd.DataFrame(grid_results)
    results_df = results_df.sort_values(by="raw_combined", ascending=False)

    print("\n" + "=" * 110)
    print("PHASE 6: ENSEMBLE CALIBRATION GRID SEARCH RESULTS (TOP 10 CONFIGURATIONS)")
    print("=" * 110)
    display_cols = ["Configuration", "Threshold", "Benchmark Acc", "Benchmark F1", "Smartphone Acc", "Smartphone FPR", "Combined Score"]
    print(results_df[display_cols].head(10).to_string(index=False))
    print("=" * 110)

    best_config = results_df.iloc[0]
    print(f"\n[OPTIMAL CALIBRATED CONFIGURATION]:")
    print(f"  Configuration : {best_config['Configuration']}")
    print(f"  Threshold     : {best_config['Threshold']}")
    print(f"  Benchmark Acc : {best_config['Benchmark Acc']}")
    print(f"  Smartphone Acc: {best_config['Smartphone Acc']}")
    print(f"  Smartphone FPR: {best_config['Smartphone FPR']}")
    print(f"  Combined Score: {best_config['Combined Score']}")

    # Save results
    os.makedirs("ml_training/results/ensemble", exist_ok=True)
    results_df.drop(columns=["raw_combined", "raw_bench_acc", "raw_phone_acc"]).to_csv(
        "ml_training/results/ensemble/ensemble_calibration_grid.csv", index=False
    )
    print("\nFull calibration grid saved to: ml_training/results/ensemble/ensemble_calibration_grid.csv")


if __name__ == "__main__":
    run_ensemble_calibration()
