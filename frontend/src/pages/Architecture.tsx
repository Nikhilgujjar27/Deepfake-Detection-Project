import React from 'react';
import { Layers, Cpu, HardDrive, Terminal } from 'lucide-react';

export const Architecture: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-24">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium">
          <Layers className="w-3.5 h-3.5" /> Technical Foundations & Fusion Math
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Inference Architecture & Calibration
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Technical specifications of the Vision Transformer backbone, calibrated dual-model ensemble, and explainability layer.
        </p>
      </div>

      {/* 1. End-to-End Pipeline Diagram */}
      <div className="saas-card p-6 sm:p-8 border border-slate-200 bg-white rounded-xl space-y-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-blue-600" /> End-to-End Inference Pipeline Flow
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          {/* Step 1 */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold text-[10px]">STAGE 1</span>
            <h4 className="text-slate-900 font-bold text-sm">Media Ingestion & EXIF</h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              Decodes raw image payload, executes EXIF transposition for orientation alignment, and extracts camera provenance metadata.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 font-semibold text-[10px]">STAGE 2</span>
            <h4 className="text-slate-900 font-bold text-sm">1.3× Facial Geometry</h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              Haar Cascade isolates faces with standardized 1.3× bounding margin, preserving critical chin/forehead contours without room noise.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold text-[10px]">STAGE 3</span>
            <h4 className="text-slate-900 font-bold text-sm">ViT-B/16 Self-Attention</h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              224×224 normalized tensor processed across 12 transformer layers, extracting 196 patch tokens + CLS explainability heatmap.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">STAGE 4</span>
            <h4 className="text-slate-900 font-bold text-sm">60/40 Calibrated Fusion</h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              Weighted linear ensemble (0.60 · ViT + 0.40 · Secondary) evaluated against threshold τ = 0.60.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Mathematical Formulation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="saas-card p-6 border border-slate-200 bg-white rounded-xl space-y-3 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-600" /> Linear Fusion Formula
          </h3>
          <div className="p-3.5 rounded-lg bg-slate-900 font-mono text-xs text-blue-300 space-y-1.5">
            <div>P_ens(Fake) = 0.60 · P_ViT(Fake) + 0.40 · P_Sec(Fake)</div>
            <div className="text-slate-300">Verdict = FAKE if P_ens(Fake) ≥ 0.60 else REAL</div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Derived empirically via grid search over benchmark samples and genuine smartphone photography.
          </p>
        </div>

        <div className="saas-card p-6 border border-slate-200 bg-white rounded-xl space-y-3 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-slate-700" /> Model Specifications & VRAM Budget
          </h3>
          <div className="space-y-2 text-xs text-slate-700">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Primary Backbone:</span>
              <span className="font-semibold text-slate-900">ViT-Base-Patch16-224 (86.5M params)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Checkpoint Size:</span>
              <span className="font-semibold text-slate-900">327 MB (.pth weights)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Inference Latency:</span>
              <span className="font-semibold text-slate-900">~600ms CPU / ~35ms CUDA</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Peak VRAM Usage:</span>
              <span className="font-semibold text-slate-900">1.2 GB (RTX GPU Compatible)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
