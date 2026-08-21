import React, { useState } from 'react';
import { Eye, Flame, Layers, Info, ZoomIn, ZoomOut } from 'lucide-react';
import type { FaceResult } from '../types';

interface Props {
  face: FaceResult;
}

export const AttentionHeatmapViewer: React.FC<Props> = ({ face }) => {
  const [viewMode, setViewMode] = useState<'heatmap' | 'split'>('heatmap');
  const [opacity, setOpacity] = useState<number>(0.85);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const hasHeatmap = Boolean(face.attention_map);

  return (
    <div className="forensic-card p-6 border border-slate-200 bg-white rounded-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">ViT Self-Attention Explainability Heatmap</h4>
            <p className="text-xs text-slate-500">12-layer multi-head transformer token saliency across 196 facial patches</p>
          </div>
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setViewMode('heatmap')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
              viewMode === 'heatmap'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> Overlay Map
            </span>
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
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
            <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-200 flex items-center justify-center min-h-[280px]">
              <div
                className="transition-transform duration-200 flex items-center justify-center"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <img
                  src={`data:image/png;base64,${face.attention_map}`}
                  alt="ViT Attention Map Overlay"
                  className="max-h-[320px] w-auto object-contain rounded transition-opacity duration-200"
                  style={{ opacity }}
                />
              </div>

              {/* Badges */}
              <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] font-mono text-slate-200 border border-slate-700/60 shadow-xs">
                14×14 Patch Grid (196 Tokens) • Jet Heatmap
              </div>

              {/* Zoom Controls */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-slate-900/90 backdrop-blur-xs p-1 rounded-lg border border-slate-700/60 text-slate-300">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
                  className="p-1 hover:text-white rounded hover:bg-slate-800 transition-colors"
                  title="Zoom Out"
                  aria-label="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono px-1">{Math.round(zoomLevel * 100)}%</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.2))}
                  className="p-1 hover:text-white rounded hover:bg-slate-800 transition-colors"
                  title="Zoom In"
                  aria-label="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-h-[220px]">
              <div className="rounded-xl overflow-hidden bg-slate-50 border border-slate-200 flex flex-col items-center justify-center p-4 relative">
                <span className="absolute top-3 left-3 bg-white border border-slate-200 text-xs font-semibold px-2 py-0.5 rounded text-slate-700 shadow-xs">
                  Standardized 1.3× Face Crop
                </span>
                <div className="w-full h-44 flex items-center justify-center text-xs text-slate-400 font-mono">
                  [1.3× Facial Bounding Region]
                </div>
              </div>
              <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-200 flex flex-col items-center justify-center p-3 relative">
                <span className="absolute top-3 left-3 bg-blue-600 text-xs font-semibold px-2 py-0.5 rounded text-white shadow-xs">
                  Attention Rollout
                </span>
                <img
                  src={`data:image/png;base64,${face.attention_map}`}
                  alt="ViT Heatmap"
                  className="max-h-44 w-auto object-contain rounded"
                />
              </div>
            </div>
          )}

          {/* Opacity slider */}
          {viewMode === 'heatmap' && (
            <div className="flex items-center gap-3 px-1 pt-1">
              <span className="text-xs font-semibold text-slate-700">Overlay Opacity:</span>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="flex-1 accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-slate-900 w-12 text-right">{Math.round(opacity * 100)}%</span>
            </div>
          )}

          {/* Forensic note */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-slate-900">Interpretation:</strong> Warm red/amber regions highlight high self-attention weight where the transformer encoder identified distinct boundary anomalies, facial asymmetry, or synthesis noise. Cool blue regions represent low anomaly weight.
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
