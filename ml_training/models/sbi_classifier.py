"""
Secondary Deepfake Classifier — EfficientNet / SBI Architecture

Implements the secondary CNN-based deepfake classifier designed to provide
orthogonal local texture and boundary artifact analysis alongside the primary ViT model.
"""

import os
import torch
import torch.nn as nn
from torchvision import models
from torchvision import transforms
from transformers import AutoModelForImageClassification


class EfficientNetDeepfakeClassifier(nn.Module):
    def __init__(self, model_name="efficientnet_b4", num_classes=2, pretrained=True):
        super(EfficientNetDeepfakeClassifier, self).__init__()
        
        # Load torchvision EfficientNet backbone
        if model_name == "efficientnet_b4":
            weights = models.EfficientNet_B4_Weights.DEFAULT if pretrained else None
            self.backbone = models.efficientnet_b4(weights=weights)
            in_features = self.backbone.classifier[1].in_features
            self.backbone.classifier[1] = nn.Linear(in_features, num_classes)
        elif model_name == "efficientnet_b2":
            weights = models.EfficientNet_B2_Weights.DEFAULT if pretrained else None
            self.backbone = models.efficientnet_b2(weights=weights)
            in_features = self.backbone.classifier[1].in_features
            self.backbone.classifier[1] = nn.Linear(in_features, num_classes)
        else:
            weights = models.EfficientNet_B0_Weights.DEFAULT if pretrained else None
            self.backbone = models.efficientnet_b0(weights=weights)
            in_features = self.backbone.classifier[1].in_features
            self.backbone.classifier[1] = nn.Linear(in_features, num_classes)

    def forward(self, x):
        return self.backbone(x)


class HuggingFaceSecondaryClassifier(nn.Module):
    """Loads a HuggingFace pretrained deepfake classifier for secondary comparison."""
    def __init__(self, model_id="prithivMLmods/Deep-Fake-Detector-v2-Model"):
        super(HuggingFaceSecondaryClassifier, self).__init__()
        try:
            self.model = AutoModelForImageClassification.from_pretrained(
                model_id,
                local_files_only=True
            )
        except Exception:
            self.model = AutoModelForImageClassification.from_pretrained(
                model_id
            )
            
    def forward(self, x):
        outputs = self.model(x)
        return outputs.logits
