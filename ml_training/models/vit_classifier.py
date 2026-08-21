"""
ViT Deepfake Classifier — Model Architecture

Exact reproduction of the original model architecture to ensure
weight compatibility with vit_deepfake_v1_baseline.pth

Architecture:
    - Base: google/vit-base-patch16-224 (86.5M params)
    - Input: 224x224x3 RGB
    - Patches: 16x16 -> 14x14 = 196 patches + 1 [CLS] token = 197 tokens
    - Transformer: 12 layers, 12 heads, hidden_dim=768
    - Classification head: 768 -> 2 (REAL=0, FAKE=1)
"""

import torch
import torch.nn as nn
from transformers import ViTForImageClassification


class ViTDeepfakeClassifier(nn.Module):
    def __init__(self, model_name="google/vit-base-patch16-224", num_labels=2):
        super(ViTDeepfakeClassifier, self).__init__()

        # Load pre-trained ViT with custom classification head
        self.vit = ViTForImageClassification.from_pretrained(
            model_name,
            num_labels=num_labels,
            ignore_mismatched_sizes=True,  # Required when replacing classification head
            attn_implementation="eager"     # Required for output_attentions
        )

    def load_state_dict(self, state_dict, strict=True):
        """
        Custom state dict loading with key remapping.
        Handles naming differences between saved checkpoint and current model.
        """
        new_state_dict = {}
        for k, v in state_dict.items():
            new_key = k
            if "vit.vit.encoder.layer." in k:
                parts = k.split(".")
                layer_idx = parts[4]
                sub_parts = parts[5:]

                if sub_parts[0] in ["layernorm_before", "layernorm_after"]:
                    new_key = f"vit.vit.layers.{layer_idx}.{sub_parts[0]}.{sub_parts[1]}"
                elif sub_parts[0] == "intermediate" and sub_parts[1] == "dense":
                    new_key = f"vit.vit.layers.{layer_idx}.mlp.fc1.{sub_parts[2]}"
                elif sub_parts[0] == "output" and sub_parts[1] == "dense":
                    new_key = f"vit.vit.layers.{layer_idx}.mlp.fc2.{sub_parts[2]}"
                elif sub_parts[0] == "attention":
                    if sub_parts[1] == "attention":
                        proj_name = sub_parts[2]
                        new_proj = {"key": "k_proj", "query": "q_proj", "value": "v_proj"}[proj_name]
                        new_key = f"vit.vit.layers.{layer_idx}.attention.{new_proj}.{sub_parts[3]}"
                    elif sub_parts[1] == "output" and sub_parts[2] == "dense":
                        new_key = f"vit.vit.layers.{layer_idx}.attention.o_proj.{sub_parts[3]}"
            new_state_dict[new_key] = v
        return super().load_state_dict(new_state_dict, strict=strict)

    def forward(self, x, output_attentions=False):
        """
        Forward pass.
        
        Args:
            x: Input tensor [batch_size, 3, 224, 224]
            output_attentions: If True, return attention weights for explainability
            
        Returns:
            If output_attentions=False: logits [batch_size, 2]
            If output_attentions=True: (logits, attentions)
        """
        outputs = self.vit(x, output_attentions=output_attentions)
        if output_attentions:
            return outputs.logits, outputs.attentions
        return outputs.logits


def load_baseline_model(weights_path, device="cpu"):
    """
    Load the baseline ViT model with saved weights.
    
    Args:
        weights_path: Path to .pth checkpoint
        device: 'cpu' or 'cuda'
        
    Returns:
        model: Loaded model in eval mode
    """
    model = ViTDeepfakeClassifier()
    
    # Load checkpoint
    checkpoint = torch.load(weights_path, map_location=device, weights_only=True)
    
    # Handle both raw state_dict and wrapped checkpoint formats
    if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
        state_dict = checkpoint["model_state_dict"]
    else:
        state_dict = checkpoint
    
    model.load_state_dict(state_dict, strict=False)
    model.to(device)
    model.eval()
    
    return model


if __name__ == "__main__":
    # Sanity check
    model = ViTDeepfakeClassifier()
    dummy_input = torch.randn(1, 3, 224, 224)
    output = model(dummy_input)
    print(f"Model initialized. Output shape: {output.shape}")
    
    # Test with attention output
    logits, attentions = model(dummy_input, output_attentions=True)
    print(f"Logits shape: {logits.shape}")
    print(f"Number of attention layers: {len(attentions)}")
    print(f"Attention shape (last layer): {attentions[-1].shape}")
