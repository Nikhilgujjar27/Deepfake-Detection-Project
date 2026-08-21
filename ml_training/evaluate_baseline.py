"""
Baseline Evaluation Script — Phase 3

Tests the existing ViT model with CORRECTED preprocessing (no dHash, no ensemble,
no forced confidence overrides). Evaluates on multiple test conditions and produces
a comprehensive failure analysis report.

Usage:
    python evaluate_baseline.py --weights models/baseline/vit_deepfake_v1_baseline.pth --test-dir data/holdout
    python evaluate_baseline.py --weights models/baseline/vit_deepfake_v1_baseline.pth --test-dir data/processed/test
"""

import os
import sys
import json
import time
import argparse
from pathlib import Path
from datetime import datetime
from collections import defaultdict

import torch
import torch.nn.functional as F
import numpy as np
import pandas as pd
from PIL import Image, ImageOps
from torchvision import transforms
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, classification_report,
    roc_curve, precision_recall_curve
)
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend
import matplotlib.pyplot as plt
import seaborn as sns

# Add parent directory to path for model imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ml_training.models.vit_classifier import load_baseline_model


# ============================================================
# PREPROCESSING — Matches what the model was trained with
# ============================================================

# Inference transform: ONLY resize + normalize (identical to training val transform)
# NO CLAHE, NO bilateral denoising, NO special tricks
INFERENCE_TRANSFORM = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])


def classify_image(model, image_path, device, transform=INFERENCE_TRANSFORM):
    """
    Classify a single image as REAL (0) or FAKE (1).
    
    Returns:
        dict with prediction, confidence, probabilities, and latency
    """
    start_time = time.time()
    
    try:
        # Load and preprocess
        image = Image.open(image_path).convert('RGB')
        image = ImageOps.exif_transpose(image)  # Fix mobile rotation
        
        # Apply transform
        input_tensor = transform(image).unsqueeze(0).to(device)
        
        # Inference
        with torch.no_grad():
            logits = model(input_tensor)
            probabilities = F.softmax(logits, dim=1)
            
        pred_class = torch.argmax(probabilities, dim=1).item()
        confidence = probabilities[0, pred_class].item()
        real_prob = probabilities[0, 0].item()
        fake_prob = probabilities[0, 1].item()
        
        latency_ms = (time.time() - start_time) * 1000
        
        return {
            "path": str(image_path),
            "filename": os.path.basename(image_path),
            "prediction": pred_class,  # 0=REAL, 1=FAKE
            "prediction_label": "REAL" if pred_class == 0 else "FAKE",
            "confidence": confidence,
            "real_probability": real_prob,
            "fake_probability": fake_prob,
            "latency_ms": latency_ms,
            "error": None
        }
    except Exception as e:
        return {
            "path": str(image_path),
            "filename": os.path.basename(image_path),
            "prediction": -1,
            "prediction_label": "ERROR",
            "confidence": 0.0,
            "real_probability": 0.0,
            "fake_probability": 0.0,
            "latency_ms": (time.time() - start_time) * 1000,
            "error": str(e)
        }


def evaluate_directory(model, test_dir, device, condition_label="all"):
    """
    Evaluate all images in a directory structured as test_dir/real/ and test_dir/fake/.
    
    Returns:
        results_df: DataFrame with per-image predictions
        metrics: dict with aggregate metrics
    """
    results = []
    
    # Collect images from real/ and fake/ subdirectories
    for label_name, true_label in [("real", 0), ("fake", 1)]:
        class_dir = os.path.join(test_dir, label_name)
        if not os.path.exists(class_dir):
            # Try uppercase
            class_dir = os.path.join(test_dir, label_name.upper())
        if not os.path.exists(class_dir):
            print(f"  Warning: {class_dir} not found, skipping")
            continue
            
        image_files = [
            f for f in os.listdir(class_dir) 
            if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.tiff', '.bmp'))
        ]
        
        print(f"  Processing {len(image_files)} {label_name} images...")
        
        for i, img_file in enumerate(image_files):
            img_path = os.path.join(class_dir, img_file)
            result = classify_image(model, img_path, device)
            result["true_label"] = true_label
            result["true_label_name"] = label_name.upper()
            result["condition"] = condition_label
            result["correct"] = result["prediction"] == true_label
            results.append(result)
            
            if (i + 1) % 100 == 0:
                print(f"    Processed {i+1}/{len(image_files)}")
    
    if not results:
        print(f"  No images found in {test_dir}")
        return pd.DataFrame(), {}
    
    df = pd.DataFrame(results)
    
    # Filter out errors
    valid_df = df[df["prediction"] != -1]
    
    if len(valid_df) == 0:
        return df, {}
    
    # Calculate metrics
    y_true = valid_df["true_label"].values
    y_pred = valid_df["prediction"].values
    y_prob = valid_df["fake_probability"].values
    
    metrics = {
        "condition": condition_label,
        "total_images": len(df),
        "valid_images": len(valid_df),
        "errors": len(df) - len(valid_df),
        "accuracy": accuracy_score(y_true, y_pred),
        "precision": precision_score(y_true, y_pred, zero_division=0),
        "recall": recall_score(y_true, y_pred, zero_division=0),
        "f1_score": f1_score(y_true, y_pred, zero_division=0),
        "false_positive_rate": (((y_pred == 1) & (y_true == 0)).sum() / 
                                max((y_true == 0).sum(), 1)),
        "false_negative_rate": (((y_pred == 0) & (y_true == 1)).sum() / 
                                max((y_true == 1).sum(), 1)),
        "avg_latency_ms": valid_df["latency_ms"].mean(),
        "median_latency_ms": valid_df["latency_ms"].median(),
        "avg_real_confidence": valid_df[valid_df["true_label"] == 0]["real_probability"].mean() if (valid_df["true_label"] == 0).any() else 0,
        "avg_fake_confidence": valid_df[valid_df["true_label"] == 1]["fake_probability"].mean() if (valid_df["true_label"] == 1).any() else 0,
    }
    
    # ROC-AUC (needs both classes)
    if len(np.unique(y_true)) == 2:
        metrics["roc_auc"] = roc_auc_score(y_true, y_prob)
    else:
        metrics["roc_auc"] = None
    
    # Confusion matrix
    cm = confusion_matrix(y_true, y_pred, labels=[0, 1])
    metrics["confusion_matrix"] = cm.tolist()
    metrics["true_positives"] = int(cm[1, 1])   # Correctly identified FAKE
    metrics["true_negatives"] = int(cm[0, 0])    # Correctly identified REAL
    metrics["false_positives"] = int(cm[0, 1])   # REAL misclassified as FAKE
    metrics["false_negatives"] = int(cm[1, 0])   # FAKE misclassified as REAL
    
    return df, metrics


def generate_plots(results_df, metrics, output_dir):
    """Generate evaluation plots and save to output directory."""
    os.makedirs(output_dir, exist_ok=True)
    valid_df = results_df[results_df["prediction"] != -1]
    
    if len(valid_df) == 0:
        return
    
    y_true = valid_df["true_label"].values
    y_prob = valid_df["fake_probability"].values
    
    # 1. Confusion Matrix
    fig, ax = plt.subplots(figsize=(8, 6))
    cm = confusion_matrix(y_true, valid_df["prediction"].values, labels=[0, 1])
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                xticklabels=['REAL', 'FAKE'], yticklabels=['REAL', 'FAKE'],
                ax=ax, annot_kws={"size": 16})
    ax.set_xlabel('Predicted', fontsize=14)
    ax.set_ylabel('Actual', fontsize=14)
    ax.set_title(f'Confusion Matrix — {metrics.get("condition", "all")}', fontsize=16)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'confusion_matrix.png'), dpi=150)
    plt.close()
    
    # 2. ROC Curve
    if len(np.unique(y_true)) == 2:
        fpr, tpr, thresholds = roc_curve(y_true, y_prob)
        fig, ax = plt.subplots(figsize=(8, 6))
        ax.plot(fpr, tpr, 'b-', linewidth=2, label=f'ROC (AUC = {metrics.get("roc_auc", 0):.4f})')
        ax.plot([0, 1], [0, 1], 'k--', linewidth=1)
        ax.set_xlabel('False Positive Rate', fontsize=14)
        ax.set_ylabel('True Positive Rate', fontsize=14)
        ax.set_title(f'ROC Curve — {metrics.get("condition", "all")}', fontsize=16)
        ax.legend(fontsize=12)
        ax.grid(True, alpha=0.3)
        plt.tight_layout()
        plt.savefig(os.path.join(output_dir, 'roc_curve.png'), dpi=150)
        plt.close()
    
    # 3. Confidence Distribution
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))
    
    real_probs = valid_df[valid_df["true_label"] == 0]["fake_probability"].values
    fake_probs = valid_df[valid_df["true_label"] == 1]["fake_probability"].values
    
    if len(real_probs) > 0:
        axes[0].hist(real_probs, bins=50, alpha=0.7, color='green', edgecolor='darkgreen')
        axes[0].set_title('REAL Images — Fake Probability Distribution', fontsize=12)
        axes[0].set_xlabel('P(FAKE)')
        axes[0].axvline(x=0.5, color='red', linestyle='--', label='Threshold')
        axes[0].legend()
    
    if len(fake_probs) > 0:
        axes[1].hist(fake_probs, bins=50, alpha=0.7, color='red', edgecolor='darkred')
        axes[1].set_title('FAKE Images — Fake Probability Distribution', fontsize=12)
        axes[1].set_xlabel('P(FAKE)')
        axes[1].axvline(x=0.5, color='red', linestyle='--', label='Threshold')
        axes[1].legend()
    
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'confidence_distribution.png'), dpi=150)
    plt.close()
    
    # 4. Latency Distribution
    fig, ax = plt.subplots(figsize=(8, 5))
    ax.hist(valid_df["latency_ms"].values, bins=50, alpha=0.7, color='steelblue', edgecolor='navy')
    ax.set_xlabel('Inference Latency (ms)', fontsize=12)
    ax.set_ylabel('Count', fontsize=12)
    ax.set_title('Inference Latency Distribution', fontsize=14)
    ax.axvline(x=valid_df["latency_ms"].mean(), color='red', linestyle='--',
               label=f'Mean: {valid_df["latency_ms"].mean():.1f}ms')
    ax.legend()
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'latency_distribution.png'), dpi=150)
    plt.close()


def generate_failure_report(results_df, output_dir):
    """
    Generate a detailed failure analysis report.
    Lists every misclassified image with its prediction details.
    """
    valid_df = results_df[results_df["prediction"] != -1]
    failures = valid_df[~valid_df["correct"]].copy()
    
    report = {
        "total_failures": len(failures),
        "false_positives": [],  # REAL images classified as FAKE
        "false_negatives": [],  # FAKE images classified as REAL
    }
    
    for _, row in failures.iterrows():
        entry = {
            "filename": row["filename"],
            "path": row["path"],
            "true_label": row["true_label_name"],
            "predicted": row["prediction_label"],
            "confidence": round(row["confidence"], 4),
            "real_probability": round(row["real_probability"], 4),
            "fake_probability": round(row["fake_probability"], 4),
            "condition": row.get("condition", "unknown"),
        }
        
        if row["true_label"] == 0 and row["prediction"] == 1:
            report["false_positives"].append(entry)
        elif row["true_label"] == 1 and row["prediction"] == 0:
            report["false_negatives"].append(entry)
    
    # Sort by confidence (most confident mistakes first — these are the worst)
    report["false_positives"].sort(key=lambda x: x["confidence"], reverse=True)
    report["false_negatives"].sort(key=lambda x: x["confidence"], reverse=True)
    
    report["summary"] = {
        "total_false_positives": len(report["false_positives"]),
        "total_false_negatives": len(report["false_negatives"]),
        "avg_fp_confidence": (
            np.mean([x["confidence"] for x in report["false_positives"]])
            if report["false_positives"] else 0
        ),
        "avg_fn_confidence": (
            np.mean([x["confidence"] for x in report["false_negatives"]])
            if report["false_negatives"] else 0
        ),
    }
    
    # Save
    report_path = os.path.join(output_dir, "failure_analysis.json")
    with open(report_path, 'w') as f:
        json.dump(report, f, indent=2)
    
    return report


def main():
    parser = argparse.ArgumentParser(description="Baseline ViT Evaluation — Phase 3")
    parser.add_argument("--weights", type=str, required=True,
                        help="Path to model weights (.pth file)")
    parser.add_argument("--test-dir", type=str, required=True,
                        help="Path to test directory with real/ and fake/ subdirs")
    parser.add_argument("--output-dir", type=str, default=None,
                        help="Directory to save results (default: ml_training/results/baseline/)")
    parser.add_argument("--condition", type=str, default="all",
                        help="Label for this evaluation condition (e.g., 'benchmark', 'smartphone', 'whatsapp')")
    parser.add_argument("--device", type=str, default=None,
                        help="Device to use (default: auto-detect)")
    args = parser.parse_args()
    
    # Setup device
    if args.device:
        device = torch.device(args.device)
    elif torch.cuda.is_available():
        device = torch.device("cuda")
    else:
        device = torch.device("cpu")
    print(f"Using device: {device}")
    
    # Setup output directory
    if args.output_dir is None:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        args.output_dir = os.path.join("ml_training", "results", "baseline", 
                                        f"{args.condition}_{timestamp}")
    os.makedirs(args.output_dir, exist_ok=True)
    
    # Load model
    print(f"\nLoading model from: {args.weights}")
    model = load_baseline_model(args.weights, device=device)
    print("Model loaded successfully.")
    
    # Count parameters
    total_params = sum(p.numel() for p in model.parameters())
    print(f"Total parameters: {total_params:,}")
    
    # Evaluate
    print(f"\nEvaluating on: {args.test_dir}")
    print(f"Condition: {args.condition}")
    print("-" * 60)
    
    results_df, metrics = evaluate_directory(model, args.test_dir, device, args.condition)
    
    if len(results_df) == 0:
        print("No images found. Check the test directory structure.")
        print("Expected: test_dir/real/ and test_dir/fake/")
        return
    
    # Print results
    print("\n" + "=" * 60)
    print(f"EVALUATION RESULTS — {args.condition}")
    print("=" * 60)
    print(f"Total images:        {metrics['total_images']}")
    print(f"Valid images:        {metrics['valid_images']}")
    print(f"Errors:              {metrics['errors']}")
    print(f"")
    print(f"Accuracy:            {metrics['accuracy']:.4f} ({metrics['accuracy']*100:.2f}%)")
    print(f"Precision:           {metrics['precision']:.4f}")
    print(f"Recall:              {metrics['recall']:.4f}")
    print(f"F1-Score:            {metrics['f1_score']:.4f}")
    if metrics.get('roc_auc') is not None:
        print(f"ROC-AUC:             {metrics['roc_auc']:.4f}")
    print(f"")
    print(f"False Positive Rate: {metrics['false_positive_rate']:.4f} ({metrics['false_positives']} REAL → FAKE)")
    print(f"False Negative Rate: {metrics['false_negative_rate']:.4f} ({metrics['false_negatives']} FAKE → REAL)")
    print(f"")
    print(f"Avg Latency:         {metrics['avg_latency_ms']:.1f}ms")
    print(f"Median Latency:      {metrics['median_latency_ms']:.1f}ms")
    print(f"")
    print(f"Avg REAL confidence:  {metrics['avg_real_confidence']:.4f}")
    print(f"Avg FAKE confidence:  {metrics['avg_fake_confidence']:.4f}")
    print(f"")
    print("Confusion Matrix:")
    cm = np.array(metrics['confusion_matrix'])
    print(f"                  Predicted REAL  Predicted FAKE")
    print(f"  Actual REAL:    {cm[0,0]:>14d}  {cm[0,1]:>14d}")
    print(f"  Actual FAKE:    {cm[1,0]:>14d}  {cm[1,1]:>14d}")
    print("=" * 60)
    
    # Save results
    results_df.to_csv(os.path.join(args.output_dir, "predictions.csv"), index=False)
    
    with open(os.path.join(args.output_dir, "metrics.json"), 'w') as f:
        # Convert numpy types for JSON serialization
        serializable_metrics = {}
        for k, v in metrics.items():
            if isinstance(v, (np.integer, np.int64)):
                serializable_metrics[k] = int(v)
            elif isinstance(v, (np.floating, np.float64)):
                serializable_metrics[k] = float(v)
            else:
                serializable_metrics[k] = v
        json.dump(serializable_metrics, f, indent=2)
    
    # Generate plots
    print(f"\nGenerating plots...")
    generate_plots(results_df, metrics, args.output_dir)
    
    # Generate failure report
    print(f"Generating failure analysis...")
    failure_report = generate_failure_report(results_df, args.output_dir)
    print(f"  False Positives (REAL→FAKE): {failure_report['summary']['total_false_positives']}")
    print(f"  False Negatives (FAKE→REAL): {failure_report['summary']['total_false_negatives']}")
    
    print(f"\nAll results saved to: {args.output_dir}")
    print(f"  - predictions.csv        (per-image predictions)")
    print(f"  - metrics.json           (aggregate metrics)")
    print(f"  - failure_analysis.json  (every misclassified image)")
    print(f"  - confusion_matrix.png   (visual confusion matrix)")
    print(f"  - roc_curve.png          (ROC curve)")
    print(f"  - confidence_distribution.png")
    print(f"  - latency_distribution.png")


if __name__ == "__main__":
    main()
