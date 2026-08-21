"""
Attention Map Explainability Module

Extracts attention maps from ViT self-attention layers and generates
visual heatmap overlays showing which facial regions influenced the prediction.

Preserved from original project — this module works correctly.
"""

import torch
import numpy as np
import cv2
from PIL import Image
import base64
from io import BytesIO


def generate_attention_map(attentions, original_image):
    """
    Generates attention heatmap overlays from ViT attention weights.
    
    Args:
        attentions: Tuple of attention tensors from all transformer layers.
                    Each tensor shape: [batch_size, num_heads, seq_len, seq_len]
        original_image: PIL Image of the original face crop
        
    Returns:
        dict: Mapping of head names to base64-encoded heatmap overlay images.
              Keys: "head_all" (average of all heads), "head_0", "head_1", ..., "head_11"
    """
    heatmaps = {}
    try:
        if attentions is None or len(attentions) == 0:
            return heatmaps

        # Get the last layer's attention [batch_size, num_heads, seq_len, seq_len]
        last_layer_attention = attentions[-1]
        num_heads = last_layer_attention.shape[1]

        # 1. Average across all heads — primary heatmap
        att_mat_all = torch.mean(last_layer_attention, dim=1)
        # Extract [CLS] token attention to all patches (skip [CLS]-to-[CLS] at index 0)
        cls_attention_all = att_mat_all[0, 0, 1:]
        dim = int(np.sqrt(cls_attention_all.shape[-1]))  # 14 for ViT-Base

        heatmap_all = cls_attention_all.reshape(dim, dim).cpu().numpy()
        heatmap_all = (heatmap_all - heatmap_all.min()) / (heatmap_all.max() - heatmap_all.min() + 1e-8)
        heatmap_all = cv2.resize(heatmap_all, (original_image.size[0], original_image.size[1]))
        heatmap_all = np.uint8(255 * heatmap_all)
        heatmap_img_all = cv2.applyColorMap(heatmap_all, cv2.COLORMAP_JET)
        original_cv = cv2.cvtColor(np.array(original_image), cv2.COLOR_RGB2BGR)
        overlayed_all = cv2.addWeighted(original_cv, 0.6, heatmap_img_all, 0.4, 0)
        _, buffer_all = cv2.imencode('.png', overlayed_all)
        heatmaps["head_all"] = base64.b64encode(buffer_all).decode('utf-8')

        # 2. Individual heads — for detailed analysis
        for h in range(num_heads):
            cls_attention_head = last_layer_attention[0, h, 0, 1:]
            heatmap_head = cls_attention_head.reshape(dim, dim).cpu().numpy()
            heatmap_head = (heatmap_head - heatmap_head.min()) / (heatmap_head.max() - heatmap_head.min() + 1e-8)
            heatmap_head = cv2.resize(heatmap_head, (original_image.size[0], original_image.size[1]))
            heatmap_head = np.uint8(255 * heatmap_head)
            heatmap_img_head = cv2.applyColorMap(heatmap_head, cv2.COLORMAP_JET)
            overlayed_head = cv2.addWeighted(original_cv, 0.6, heatmap_img_head, 0.4, 0)
            _, buffer_head = cv2.imencode('.png', overlayed_head)
            heatmaps[f"head_{h}"] = base64.b64encode(buffer_head).decode('utf-8')

    except Exception as e:
        print(f"Error in heatmap generation: {e}")

    return heatmaps


def get_attention_summary(attentions):
    """
    Extract a simplified attention summary for logging/analysis.
    
    Args:
        attentions: Tuple of attention tensors from all transformer layers
        
    Returns:
        dict with attention statistics
    """
    if attentions is None or len(attentions) == 0:
        return {}
    
    last_layer = attentions[-1]
    cls_attention = torch.mean(last_layer, dim=1)[0, 0, 1:]  # Average heads, CLS->patches
    dim = int(np.sqrt(cls_attention.shape[-1]))
    attention_grid = cls_attention.reshape(dim, dim).cpu().numpy()
    
    return {
        "max_attention": float(attention_grid.max()),
        "min_attention": float(attention_grid.min()),
        "mean_attention": float(attention_grid.mean()),
        "std_attention": float(attention_grid.std()),
        "top_patch_row": int(np.unravel_index(attention_grid.argmax(), attention_grid.shape)[0]),
        "top_patch_col": int(np.unravel_index(attention_grid.argmax(), attention_grid.shape)[1]),
    }
