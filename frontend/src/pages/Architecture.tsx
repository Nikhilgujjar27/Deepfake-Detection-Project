import React, { useState } from 'react';
import { Layers, Cpu, HardDrive, Terminal } from 'lucide-react';

const PIPELINE_STAGES = [
  {
    step: 'STAGE 1',
    title: 'Media Ingestion & EXIF Extraction',
    short: 'EXIF & Transposition',
    desc: 'Decodes raw image bytes into normalized RGB arrays, inspects camera hardware EXIF tags (Sensor ISO, Camera Model, DateTime), and executes orientation transposition.',
    input: 'Raw JPEG / PNG / WEBP Binary Payload',
    output: 'Oriented RGB PIL Image (Width × Height × 3) + Provenance Metadata Dict'
  },
  {
    step: 'STAGE 2',
    title: 'Standardized 1.3× Facial Bounding',
    short: '1.3× Geometry Crop',
    desc: 'Executes Haar Cascade face detection with 1.3× padding multiplier (30% bounding margin), capturing essential jawline and forehead textures while excluding irrelevant background noise.',
    input: 'Full resolution photographic frame',
    output: 'Square facial crop tensor scaled to 224 × 224 resolution'
  },
  {
    step: 'STAGE 3',
    title: 'Vision Transformer (ViT-B/16) Encoder',
    short: 'ViT Self-Attention (196 Patches)',
    desc: 'Divides 224×224 normalized crop into 196 discrete 16×16 patch tokens. 12 Transformer encoder layers compute pairwise relational self-attention matrices and CLS token classification.',
    input: 'Normalized Tensor (Mean: [0.485, 0.456, 0.406], Std: [0.229, 0.224, 0.225])',
    output: 'ViT Probability P_ViT(Fake) + 12-layer attention rollout heatmap matrix'
  },
  {
    step: 'STAGE 4',
    title: '60/40 Calibrated Ensemble Consensus',
    short: 'Calibrated Fusion (τ = 0.60)',
    desc: 'Computes weighted linear consensus between the Vision Transformer (60%) and secondary boundary model (40%). Evaluates final score against the calibrated decision boundary τ = 0.60.',
    input: 'P_ViT(Fake) + P_Secondary(Fake)',
    output: 'Final Forensic Verdict (REAL / FAKE) + Calibrated Confidence Score'
  }
];

export const Architecture: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-24">
      {/* Header */}
      <div className="text-center space-y-2 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-xs">
          <Layers className="w-3.5 h-3.5" /> Technical Foundations & Model Pipeline
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
          Inference Architecture & Calibration
        </h1>
        <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
          Deep technical specifications of the 86.5M parameter Vision Transformer backbone, 60/40 dual-model consensus ensemble, and explainability layer.
        </p>
      </div>

      {/* 1. Interactive Multi-Stage Pipeline Flow */}
      <div className="forensic-card p-6 sm:p-10 border border-slate-200 bg-white rounded-2xl space-y-8 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-blue-600" /> Interactive End-to-End Inference Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Click on any stage to inspect the computational transformation and tensor input/output flow.
          </p>
        </div>

        {/* Stage Selector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PIPELINE_STAGES.map((stage, idx) => {
            const isSelected = activeStage === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveStage(idx)}
                className={`p-5 rounded-xl border transition-all duration-200 cursor-pointer space-y-2.5 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {stage.step}
                  </span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />}
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-tight">{stage.short}</h4>
                <p className="text-xs text-slate-500 line-clamp-2">{stage.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Detailed Stage Deep-Dive Card */}
        <div className="p-6 sm:p-7 rounded-xl bg-slate-900 text-white space-y-4 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded bg-blue-600 text-white text-xs font-bold font-mono">
                {PIPELINE_STAGES[activeStage].step}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {PIPELINE_STAGES[activeStage].title}
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">Active Stage Inspector</span>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {PIPELINE_STAGES[activeStage].desc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 block text-[11px]">Tensor Input:</span>
              <span className="text-blue-300 font-semibold">{PIPELINE_STAGES[activeStage].input}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 block text-[11px]">Tensor Output:</span>
              <span className="text-emerald-300 font-semibold">{PIPELINE_STAGES[activeStage].output}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Mathematical Formulation & Technical Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formula Card */}
        <div className="forensic-card p-6 sm:p-8 border border-slate-200 bg-white rounded-xl space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-blue-600" /> Mathematical Consensus Formulation
          </h3>
          <div className="p-4 rounded-xl bg-slate-900 font-mono text-xs sm:text-sm text-blue-300 space-y-2 shadow-inner">
            <div className="font-bold">P_ens(Fake) = 0.60 · P_ViT(Fake) + 0.40 · P_Sec(Fake)</div>
            <div className="text-slate-400">Verdict = FAKE if P_ens(Fake) ≥ 0.60 else REAL</div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            The 60/40 weighting and decision boundary τ = 0.60 were derived empirically over grid search across benchmark images and real-world smartphone photos to minimize false positive alarms on casual mobile photography.
          </p>
        </div>

        {/* Hardware & Parameter Specs Card */}
        <div className="forensic-card p-6 sm:p-8 border border-slate-200 bg-white rounded-xl space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-slate-700" /> Model Architecture & Telemetry Specs
          </h3>
          <div className="space-y-2 text-xs sm:text-sm text-slate-700">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Primary Backbone:</span>
              <span className="font-bold text-slate-900">ViT-Base-Patch16-224 (86.5M params)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Checkpoint Weights:</span>
              <span className="font-bold text-slate-900">327 MB (.pth state dict)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Inference Latency:</span>
              <span className="font-bold text-slate-900">~600ms CPU / ~35ms CUDA</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Peak VRAM Footprint:</span>
              <span className="font-bold text-slate-900">1.2 GB (RTX 3050/5050 Compatible)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
