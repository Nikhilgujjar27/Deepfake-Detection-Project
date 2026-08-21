import os
import sys
import time
import json
import glob
from pathlib import Path
from PIL import Image, ImageOps
import numpy as np
import torch
import torch.nn.functional as F
from torchvision import transforms
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))
sys.path.insert(0, str(PROJECT_ROOT / "backend"))

from ml_training.models.vit_classifier import load_baseline_model
from ml_training.models.sbi_classifier import HuggingFaceSecondaryClassifier
from app.services.face_detector import FaceDetector

# Evaluation transform
EVAL_TRANSFORM = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def evaluate_dataset(images_with_labels, vit_model, sec_model, face_detector, device, desc=""):
    print(f"\n--- Evaluating {desc} ({len(images_with_labels)} samples) ---")
    
    vit_preds, sec_preds, ens_preds, ens_confs = [], [], [], []
    vit_p_fakes, sec_p_fakes, ens_p_fakes = [], [], []
    ground_truth = []
    latencies = []
    
    for idx, (img_path, true_label) in enumerate(images_with_labels):
        try:
            t0 = time.time()
            img = Image.open(img_path)
            img = ImageOps.exif_transpose(img).convert("RGB")
            
            # Detect faces with 1.3x crop
            faces = face_detector.detect_faces(img)
            if not faces:
                crop = img.resize((224, 224))
            else:
                crop = faces[0]["crop"]
                
            tensor = EVAL_TRANSFORM(crop).unsqueeze(0).to(device)
            
            # 1. ViT inference
            with torch.no_grad():
                vit_logits = vit_model(tensor)
                vit_probs = F.softmax(vit_logits, dim=1)
                vit_pf = vit_probs[0, 1].item()
                
            # 2. Secondary inference
            with torch.no_grad():
                if hasattr(sec_model, "predict_proba"):
                    sec_pr, sec_pf = sec_model.predict_proba(tensor)
                else:
                    sec_logits = sec_model(tensor)
                    sec_probs = F.softmax(sec_logits, dim=1)
                    sec_pf = sec_probs[0, 1].item()
                    
            # 3. 60/40 Ensemble (threshold 0.60)
            ens_pf = 0.60 * vit_pf + 0.40 * sec_pf
            
            t_elapsed = (time.time() - t0) * 1000
            latencies.append(t_elapsed)
            
            # Label: 0 = REAL, 1 = FAKE
            ground_truth.append(true_label)
            vit_preds.append(1 if vit_pf > 0.50 else 0)
            sec_preds.append(1 if sec_pf > 0.50 else 0)
            ens_preds.append(1 if ens_pf >= 0.60 else 0)
            
            vit_p_fakes.append(vit_pf)
            sec_p_fakes.append(sec_pf)
            ens_p_fakes.append(ens_pf)
            
            if (idx + 1) % 50 == 0 or (idx + 1) == len(images_with_labels):
                print(f"  Processed {idx+1}/{len(images_with_labels)} images...")
        except Exception as e:
            print(f"  [Warning] Failed on {img_path}: {e}")
            continue

    def compute_stats(preds, y_true):
        acc = accuracy_score(y_true, preds) * 100.0
        # If binary class present in test
        unique = set(y_true)
        if len(unique) > 1:
            prec = precision_score(y_true, preds, zero_division=0) * 100.0
            rec = recall_score(y_true, preds, zero_division=0) * 100.0
            f1 = f1_score(y_true, preds, zero_division=0) * 100.0
            tn, fp, fn, tp = confusion_matrix(y_true, preds, labels=[0, 1]).ravel()
            fpr = (fp / (fp + tn) * 100.0) if (fp + tn) > 0 else 0.0
            fnr = (fn / (fn + tp) * 100.0) if (fn + tp) > 0 else 0.0
        else:
            # Single class evaluation (e.g. all real or all fake)
            only_class = list(unique)[0]
            if only_class == 0: # all real
                fp = sum(1 for p in preds if p == 1)
                tn = len(preds) - fp
                fn, tp, prec, rec, f1, fnr = 0, 0, 100.0, 100.0, 100.0, 0.0
                fpr = (fp / len(preds)) * 100.0
            else: # all fake
                fn = sum(1 for p in preds if p == 0)
                tp = len(preds) - fn
                fp, tn, prec, rec, f1, fpr = 0, 0, 100.0, 100.0, 100.0, 0.0
                fnr = (fn / len(preds)) * 100.0

        return {
            "accuracy": round(acc, 2),
            "precision": round(prec, 2),
            "recall": round(rec, 2),
            "f1": round(f1, 2),
            "fpr": round(fpr, 2),
            "fnr": round(fnr, 2),
            "tp": int(tp), "tn": int(tn), "fp": int(fp), "fn": int(fn)
        }

    return {
        "count": len(ground_truth),
        "vit": compute_stats(vit_preds, ground_truth),
        "secondary": compute_stats(sec_preds, ground_truth),
        "ensemble": compute_stats(ens_preds, ground_truth),
        "mean_latency_ms": round(float(np.mean(latencies)), 1) if latencies else 0.0,
        "ensemble_p_fake_mean": round(float(np.mean(ens_p_fakes)), 4) if ens_p_fakes else 0.0
    }

def main():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Evaluation running on device: {device}")
    
    # 1. Load models
    weights_path = PROJECT_ROOT / "models" / "baseline" / "vit_deepfake_v1_baseline.pth"
    print(f"Loading ViT Baseline model from: {weights_path}...")
    vit_model = load_baseline_model(str(weights_path), device=device)
    vit_model.eval()
    
    print("Loading Secondary HuggingFace model...")
    sec_classifier = HuggingFaceSecondaryClassifier().to(device)
    sec_classifier.eval()
    
    face_detector = FaceDetector.get_instance()
    
    # 2. Gather Datasets
    # A. Smartphone WhatsApp images (Real)
    phone_dir = Path(r"C:\Users\NikhilGujjar\Pictures\Training_images")
    phone_imgs = [(str(p), 0) for p in phone_dir.glob("*.jpeg")] + [(str(p), 0) for p in phone_dir.glob("*.jpg")] + [(str(p), 0) for p in phone_dir.glob("*.png")]
    
    # B. Benchmark test images (Real & Fake)
    bench_dir = Path(r"C:\Users\NikhilGujjar\OneDrive\Desktop\Deepfake Major Project\data\real_vs_fake\real-vs-fake\test")
    bench_real = [(str(p), 0) for p in (bench_dir / "real").glob("*.jpg")][:150]
    bench_fake = [(str(p), 1) for p in (bench_dir / "fake").glob("*.jpg")][:150]
    bench_combined = bench_real + bench_fake
    
    results = {}
    
    # Run Evaluations
    if phone_imgs:
        results["smartphone_whatsapp_real"] = evaluate_dataset(
            phone_imgs, vit_model, sec_classifier, face_detector, device, "Real Smartphone / WhatsApp Photos"
        )
        
    if bench_real:
        results["benchmark_real_only"] = evaluate_dataset(
            bench_real, vit_model, sec_classifier, face_detector, device, "Benchmark Real Faces"
        )
        
    if bench_fake:
        results["benchmark_fake_only"] = evaluate_dataset(
            bench_fake, vit_model, sec_classifier, face_detector, device, "Benchmark AI Deepfake Faces"
        )
        
    if bench_combined:
        results["benchmark_combined_balanced"] = evaluate_dataset(
            bench_combined, vit_model, sec_classifier, face_detector, device, "Benchmark Balanced (Real + Fake)"
        )
        
    # Print clean summary table
    print("\n" + "="*80)
    print("                      COMPREHENSIVE FORENSIC BENCHMARK REPORT")
    print("="*80)
    print(f"{'Dataset Category':<32} | {'ViT-Base':<12} | {'Secondary':<12} | {'60/40 Ensemble (Prod)':<15}")
    print("-"*80)
    for cat, res in results.items():
        v_acc = f"{res['vit']['accuracy']}%"
        s_acc = f"{res['secondary']['accuracy']}%"
        e_acc = f"{res['ensemble']['accuracy']}%"
        print(f"{cat:<32} | {v_acc:<12} | {s_acc:<12} | {e_acc:<15}")
        
    print("="*80)
    
    # Save output to JSON
    out_file = PROJECT_ROOT / "docs" / "COMPREHENSIVE_EVALUATION_REPORT.json"
    with open(out_file, "w") as f:
        json.dump(results, f, indent=2)
    print(f"\nDetailed JSON report saved to: {out_file}")

if __name__ == "__main__":
    main()
