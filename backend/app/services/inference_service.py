"""
Inference Service — Calibrated 60/40 Ensemble Deepfake Detector

Implements the empirically validated dual-model ensemble:
  P_ens(Fake) = 0.60 * P_ViT(Fake) + 0.40 * P_Secondary(Fake)
  Verdict = FAKE if P_ens(Fake) >= 0.60, else REAL

NO preprocessing hacks (no CLAHE, no bilateral denoising, no dHash templates).
All parameters derived from Phase 6 grid search calibration.
"""

import io
import os
import sys
import time
import logging

import numpy as np
import torch
import torch.nn.functional as F
import torchvision.transforms as transforms
from PIL import Image, ImageOps

from app.core.config import settings
from app.services.face_detector import FaceDetector

logger = logging.getLogger(__name__)

# Add project root to sys.path to import ml_training modules
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

os.environ["HF_HUB_OFFLINE"] = "1"

from ml_training.models.vit_classifier import load_baseline_model
from ml_training.models.sbi_classifier import HuggingFaceSecondaryClassifier
from ml_training.models.explainability import generate_attention_map


# Standard ImageNet normalization — matches training distribution
INFERENCE_TRANSFORM = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])


class InferenceService:
    """
    Singleton inference service implementing the calibrated 60/40 ensemble.
    
    Models loaded on first call to get_instance():
      - Primary: ViT-Base-Patch16-224 (86.5M params) from vit_deepfake_v1_baseline.pth
      - Secondary: Deep-Fake-Detector-v2 from HuggingFace (cached locally)
    """
    _instance = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def __init__(self):
        logger.info("Initializing InferenceService...")
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        logger.info(f"Inference device: {self.device}")

        # Load face detector
        self.face_detector = FaceDetector.get_instance()

        # Load Primary ViT Model
        weights_path = os.path.join(PROJECT_ROOT, 'models', 'baseline', 'vit_deepfake_v1_baseline.pth')
        logger.info(f"Loading Primary ViT from: {weights_path}")
        self.vit_model = load_baseline_model(weights_path, device=self.device)
        logger.info("Primary ViT loaded successfully.")

        # Load Secondary HuggingFace Model
        logger.info(f"Loading Secondary Model: {settings.SECONDARY_MODEL_ID}")
        self.secondary_model = HuggingFaceSecondaryClassifier(settings.SECONDARY_MODEL_ID)
        self.secondary_model.to(self.device)
        self.secondary_model.eval()
        logger.info("Secondary model loaded successfully.")

        # Calibrated ensemble parameters (from Phase 6 grid search)
        self.weight_vit = settings.ENSEMBLE_WEIGHT_VIT
        self.weight_sec = settings.ENSEMBLE_WEIGHT_SECONDARY
        self.threshold = settings.ENSEMBLE_THRESHOLD
        logger.info(
            f"Ensemble config: ViT={self.weight_vit:.0%} + Sec={self.weight_sec:.0%}, "
            f"threshold={self.threshold}"
        )
        logger.info("InferenceService ready.")

    def _extract_exif_metadata(self, image: Image.Image) -> dict:
        """Extract camera and image capture parameters from EXIF headers."""
        metadata = {
            "has_exif": False,
            "camera_make": None,
            "camera_model": None,
            "software": None,
            "datetime_original": None,
            "iso_speed": None,
        }
        try:
            exif_data = image._getexif()
            if exif_data:
                metadata["has_exif"] = True
                tags_mapping = {
                    271: "camera_make",
                    272: "camera_model",
                    305: "software",
                    36867: "datetime_original",
                    34855: "iso_speed",
                }
                for tag_id, key in tags_mapping.items():
                    val = exif_data.get(tag_id)
                    if val is not None:
                        if key == "iso_speed":
                            metadata[key] = int(val) if not isinstance(val, int) else val
                        else:
                            metadata[key] = str(val)
        except Exception as e:
            logger.debug(f"EXIF extraction note: {e}")
        return metadata

    def _get_model_probabilities(self, model, input_tensor):
        """Run forward pass and return (p_real, p_fake) probabilities."""
        with torch.no_grad():
            logits = model(input_tensor)
            # Handle HuggingFace output objects
            if hasattr(logits, 'logits'):
                logits = logits.logits
            probs = F.softmax(logits, dim=1)
            return probs[0, 0].item(), probs[0, 1].item()  # (p_real, p_fake)

    def predict(self, image_bytes: bytes) -> dict:
        """
        Full prediction pipeline.
        
        Steps:
          1. Decode image, EXIF transpose, convert to RGB
          2. Extract EXIF metadata
          3. Detect all faces (1.3x padded crop)
          4. For each face: run ViT + Secondary -> ensemble -> verdict
          5. Multi-face majority consensus
          6. Return structured result
        """
        start_time = time.time()

        # 1. Decode image
        try:
            raw_image = Image.open(io.BytesIO(image_bytes))
            metadata = self._extract_exif_metadata(raw_image)
            image = ImageOps.exif_transpose(raw_image)
            if image.mode != 'RGB':
                image = image.convert('RGB')
        except Exception as e:
            logger.error(f"Failed to decode image: {e}")
            raise ValueError(f"Invalid image data: {e}")

        # 3. Detect faces
        faces = self.face_detector.detect_faces(image)
        faces_detected = len(faces)
        logger.info(f"Faces detected: {faces_detected}")

        face_results = []
        fake_vote_count = 0

        # 4. Process each face
        for face_info in faces:
            crop = face_info['crop']
            input_tensor = INFERENCE_TRANSFORM(crop).unsqueeze(0).to(self.device)

            # 4a. Primary ViT with attention output
            with torch.no_grad():
                vit_logits, attentions = self.vit_model(input_tensor, output_attentions=True)
                vit_probs = F.softmax(vit_logits, dim=1)
                vit_p_real = vit_probs[0, 0].item()
                vit_p_fake = vit_probs[0, 1].item()

            # 4b. Secondary model
            sec_p_real, sec_p_fake = self._get_model_probabilities(
                self.secondary_model, input_tensor
            )

            # 4c. Calibrated ensemble
            p_ens_fake = self.weight_vit * vit_p_fake + self.weight_sec * sec_p_fake
            face_verdict = "FAKE" if p_ens_fake >= self.threshold else "REAL"
            face_confidence = p_ens_fake if face_verdict == "FAKE" else (1.0 - p_ens_fake)

            if face_verdict == "FAKE":
                fake_vote_count += 1

            # 4d. Generate attention heatmap
            attention_map_b64 = None
            try:
                heatmaps = generate_attention_map(attentions, crop)
                attention_map_b64 = heatmaps.get("head_all")
            except Exception as e:
                logger.warning(f"Attention map generation failed for face {face_info['index']}: {e}")

            face_results.append({
                "face_index": face_info['index'],
                "bbox": face_info['bbox'],
                "vit_verdict": "FAKE" if vit_p_fake > 0.5 else "REAL",
                "vit_confidence": round(max(vit_p_real, vit_p_fake) * 100, 2),
                "vit_p_fake": round(vit_p_fake, 4),
                "secondary_verdict": "FAKE" if sec_p_fake > 0.5 else "REAL",
                "secondary_confidence": round(max(sec_p_real, sec_p_fake) * 100, 2),
                "secondary_p_fake": round(sec_p_fake, 4),
                "ensemble_p_fake": round(p_ens_fake, 4),
                "verdict": face_verdict,
                "confidence": round(face_confidence * 100, 2),
                "attention_map": attention_map_b64,
            })

        # 5. Multi-face consensus
        if faces_detected > 1:
            final_verdict = "FAKE" if fake_vote_count > (faces_detected // 2) else "REAL"
        elif faces_detected == 1:
            final_verdict = face_results[0]["verdict"]
        else:
            final_verdict = "REAL"

        # Compute overall confidence
        if face_results:
            if final_verdict == "FAKE":
                fake_confs = [f["ensemble_p_fake"] for f in face_results if f["verdict"] == "FAKE"]
                overall_confidence = round(np.mean(fake_confs) * 100, 2) if fake_confs else 50.0
            else:
                real_confs = [1.0 - f["ensemble_p_fake"] for f in face_results if f["verdict"] == "REAL"]
                overall_confidence = round(np.mean(real_confs) * 100, 2) if real_confs else 50.0
        else:
            overall_confidence = 0.0

        processing_time_ms = int((time.time() - start_time) * 1000)

        # 6. Return structured result
        return {
            "final_verdict": final_verdict,
            "confidence": overall_confidence,
            "faces_detected": faces_detected,
            "faces": face_results,
            "metadata": metadata,
            "processing_time_ms": processing_time_ms,
        }
