import React from 'react';
import { Layers, Cpu, HardDrive, Terminal } from 'lucide-react';

export const Architecture: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-24">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
          <Layers className="w-3.5 h-3.5 text-indigo-400" /> System Architecture & Mathematical Foundations
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Inference Architecture & Calibration
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Technical specifications of the Vision Transformer backbone, calibrated dual-model ensemble, and explainability layer.
        </p>
      </div>

      {/* 1. End-to-End Pipeline Diagram */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-400" /> End-to-End Inference Pipeline Flow
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 font-bold">STAGE 1</span>
            <h4 className="text-white font-bold font-sans text-sm">Media Ingestion & EXIF</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Decodes raw image payload, executes EXIF transposition for orientation alignment, and extracts camera provenance metadata.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-bold">STAGE 2</span>
            <h4 className="text-white font-bold font-sans text-sm">1.3× Facial Geometry</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Haar Cascade isolates faces with standardized 1.3× bounding margin, preserving critical chin/forehead contours without room noise.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-400 font-bold">STAGE 3</span>
            <h4 className="text-white font-bold font-sans text-sm">ViT-B/16 Self-Attention</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              224×224 normalized tensor processed across 12 transformer layers, extracting 196 patch tokens + CLS explainability heatmap.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold">STAGE 4</span>
            <h4 className="text-white font-bold font-sans text-sm">60/40 Calibrated Fusion</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Weighted linear ensemble (0.60 · ViT + 0.40 · Secondary) evaluated against threshold &tau;=0.60.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Mathematical Formulation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" /> Linear Fusion Formula
          </h3>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-300 space-y-2">
            <div>P_ens(Fake) = 0.60 · P_ViT(Fake) + 0.40 · P_Sec(Fake)</div>
            <div className="text-slate-400">Verdict = FAKE if P_ens(Fake) ≥ 0.60 else REAL</div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Derived empirically via grid search over 35 configurations on 200 benchmark samples + 30 genuine smartphone photos.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-purple-400" /> Model Specifications & VRAM Budget
          </h3>
          <div className="space-y-2 font-mono text-xs text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-500">Primary Backbone:</span>
              <span>ViT-Base-Patch16-224 (86.5M params)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-500">Checkpoint Size:</span>
              <span>327 MB (.pth weights)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-500">Inference Latency:</span>
              <span>~95ms CPU / ~18ms CUDA</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Peak VRAM Usage:</span>
              <span>1.2 GB (Easily runs on RTX 3050 / 5050)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
