import React, { useState } from 'react';
import { Eye, Flame, Layers, Sparkles } from 'lucide-react';
import type { FaceResult } from '../types';

interface Props {
  face: FaceResult;
}

export const AttentionHeatmapViewer: React.FC<Props> = ({ face }) => {
  const [viewMode, setViewMode] = useState<'heatmap' | 'split'>('heatmap');
  const [opacity, setOpacity] = useState<number>(0.85);

  const hasHeatmap = Boolean(face.attention_map);

  return (
    <div className="glass-card rounded-xl p-5 border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">ViT Attention Explainability Heatmap</h4>
            <p className="text-xs text-slate-400">Visualizing 12-layer multi-head self-attention on facial patches</p>
          </div>
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setViewMode('heatmap')}
            className={`px-2.5 py-1 rounded font-medium transition-all ${
              viewMode === 'heatmap'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" /> Heatmap Overlay
            </span>
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={`px-2.5 py-1 rounded font-medium transition-all ${
              viewMode === 'split'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3" /> Side-by-Side
            </span>
          </button>
        </div>
      </div>

      {hasHeatmap ? (
        <div className="space-y-4">
          {viewMode === 'heatmap' ? (
            <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80 flex items-center justify-center min-h-[260px]">
              <img
                src={`data:image/png;base64,${face.attention_map}`}
                alt="ViT Attention Map Overlay"
                className="max-h-[320px] w-auto object-contain rounded-lg shadow-inner transition-opacity duration-300"
                style={{ opacity }}
              />
              <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono text-slate-300 border border-slate-700/60">
                Patch Grid: 14×14 (196 Tokens) • Jet Colormap
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 min-h-[220px]">
              <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex flex-col items-center justify-center p-2 relative">
                <span className="absolute top-2 left-2 bg-slate-900/80 text-[10px] font-mono px-2 py-0.5 rounded text-slate-300">
                  Cropped Face
                </span>
                <div className="w-full h-40 bg-slate-900 rounded flex items-center justify-center text-xs text-slate-500 font-mono">
                  [1.3× Face Bounding Box]
                </div>
              </div>
              <div className="rounded-xl overflow-hidden bg-slate-950 border border-indigo-500/30 flex flex-col items-center justify-center p-2 relative">
                <span className="absolute top-2 left-2 bg-indigo-900/80 text-[10px] font-mono px-2 py-0.5 rounded text-indigo-200">
                  Attention Focus
                </span>
                <img
                  src={`data:image/png;base64,${face.attention_map}`}
                  alt="ViT Heatmap"
                  className="max-h-40 w-auto object-contain rounded"
                />
              </div>
            </div>
          )}

          {/* Opacity slider */}
          {viewMode === 'heatmap' && (
            <div className="flex items-center gap-3 px-1">
              <span className="text-xs text-slate-400 font-mono">Overlay Opacity:</span>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="flex-1 accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-300 w-10 text-right">{Math.round(opacity * 100)}%</span>
            </div>
          )}

          {/* Scientific Interpretation Note */}
          <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-800/40 text-xs text-indigo-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-white">What this heatmap means:</strong> Red and warm regions indicate high transformer token attention where the Vision Transformer detected key boundary or facial features. Cool blue regions had lower saliency.
            </p>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-slate-500 text-sm font-mono">
          No attention map available for this face extraction.
        </div>
      )}
    </div>
  );
};
