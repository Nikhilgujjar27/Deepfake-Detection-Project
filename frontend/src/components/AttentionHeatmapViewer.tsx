import React, { useState } from 'react';
import { Eye, Flame, Layers, Info } from 'lucide-react';
import type { FaceResult } from '../types';

interface Props {
  face: FaceResult;
}

export const AttentionHeatmapViewer: React.FC<Props> = ({ face }) => {
  const [viewMode, setViewMode] = useState<'heatmap' | 'split'>('heatmap');
  const [opacity, setOpacity] = useState<number>(0.85);

  const hasHeatmap = Boolean(face.attention_map);

  return (
    <div className="saas-card-flat p-5 border border-slate-200 bg-white rounded-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">ViT Self-Attention Heatmap</h4>
            <p className="text-xs text-slate-500">12-layer multi-head transformer token saliency across facial patches</p>
          </div>
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setViewMode('heatmap')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              viewMode === 'heatmap'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> Overlay
            </span>
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              viewMode === 'split'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Side-by-Side
            </span>
          </button>
        </div>
      </div>

      {hasHeatmap ? (
        <div className="space-y-4">
          {viewMode === 'heatmap' ? (
            <div className="relative rounded-lg overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center min-h-[260px]">
              <img
                src={`data:image/png;base64,${face.attention_map}`}
                alt="ViT Attention Map Overlay"
                className="max-h-[300px] w-auto object-contain rounded transition-opacity duration-200"
                style={{ opacity }}
              />
              <div className="absolute bottom-2.5 left-2.5 bg-slate-950/80 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] font-mono text-slate-200 border border-slate-700/50">
                14×14 Patch Grid (196 Tokens) • Jet Heatmap
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-[200px]">
              <div className="rounded-lg overflow-hidden bg-slate-50 border border-slate-200 flex flex-col items-center justify-center p-3 relative">
                <span className="absolute top-2 left-2 bg-white border border-slate-200 text-[11px] font-medium px-2 py-0.5 rounded text-slate-600 shadow-xs">
                  Face Crop (1.3×)
                </span>
                <div className="w-full h-36 flex items-center justify-center text-xs text-slate-400 font-mono">
                  Face Crop Region
                </div>
              </div>
              <div className="rounded-lg overflow-hidden bg-slate-900 border border-slate-200 flex flex-col items-center justify-center p-3 relative">
                <span className="absolute top-2 left-2 bg-blue-600 text-[11px] font-medium px-2 py-0.5 rounded text-white shadow-xs">
                  Attention Map
                </span>
                <img
                  src={`data:image/png;base64,${face.attention_map}`}
                  alt="ViT Heatmap"
                  className="max-h-36 w-auto object-contain rounded"
                />
              </div>
            </div>
          )}

          {/* Opacity slider */}
          {viewMode === 'heatmap' && (
            <div className="flex items-center gap-3 px-1 pt-1">
              <span className="text-xs font-medium text-slate-600">Overlay Opacity:</span>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="flex-1 accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-700 w-10 text-right">{Math.round(opacity * 100)}%</span>
            </div>
          )}

          {/* Forensic note */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-slate-900">Interpretation:</strong> Warm red/orange areas indicate tokens where the transformer encoder identified distinct boundary artifacts, facial asymmetry, or synthesis noise. Cool blue areas represent low anomaly weight.
            </p>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-slate-400 text-sm">
          No attention heatmap generated for this face crop.
        </div>
      )}
    </div>
  );
};
