import React from 'react';
import { ShieldCheck, Github, Target, Cpu, Database, Eye } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-24">
      {/* Header */}
      <div className="text-center space-y-2 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5" /> Platform Mission & Ethos
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
          About DeepSentry
        </h1>
        <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
          An evidence-based, explainable visual forensics platform engineered for real-world reliability on modern digital imagery.
        </p>
      </div>

      {/* Engineering Ethos Card */}
      <div className="forensic-card p-6 sm:p-10 border border-slate-200 bg-white rounded-2xl space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Engineering Ethos: Empirical Measurement & Transparent AI
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              No unverified heuristics, no hardcoded whitelists, and zero black-box verdicts.
            </p>
          </div>
        </div>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          DeepSentry was constructed through disciplined empirical validation. By standardizing facial extraction geometry to 1.3× and calibrating a 60/40 dual-model fusion (Vision Transformer + Secondary Boundary Detector), the platform achieves 99.00% benchmark precision and 90.0% real-world smartphone photo accuracy, while generating pixel-aligned attention heatmaps for full forensic auditability.
        </p>
      </div>

      {/* 4 Feature Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="forensic-card p-6 sm:p-8 border border-slate-200 bg-white rounded-xl space-y-3.5 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Vision Transformer Backbone</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            The core model utilizes an 86.5M parameter ViT-Base-Patch16 architecture dividing crops into 196 discrete tokens, learning pairwise spatial dependencies across facial features that standard CNNs frequently miss.
          </p>
        </div>

        <div className="forensic-card p-6 sm:p-8 border border-slate-200 bg-white rounded-xl space-y-3.5 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Eye className="w-5 h-5 text-purple-600" />
            <h3 className="text-base font-bold text-slate-900">Self-Attention Explainability</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Every classification outputs a 12-layer attention rollout Jet heatmap, providing human investigators with actionable visual proof of the precise facial regions that influenced the model’s prediction.
          </p>
        </div>

        <div className="forensic-card p-6 sm:p-8 border border-slate-200 bg-white rounded-xl space-y-3.5 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">High-Throughput REST API</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Built on FastAPI and SQLAlchemy SQLite with sub-600ms latency on CPU and sub-35ms latency on CUDA-enabled GPUs, complete with JWT authentication and audit history persistence.
          </p>
        </div>

        <div className="forensic-card p-6 sm:p-8 border border-slate-200 bg-white rounded-xl space-y-3.5 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Github className="w-5 h-5 text-slate-800" />
            <h3 className="text-base font-bold text-slate-900">Open Source & Reproducibility</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            The complete codebase, documentation suite, test harnesses, and model configurations are versioned on GitHub for reproducible verification and research analysis.
          </p>
          <div className="pt-2">
            <a
              href="https://github.com/Nikhilgujjar27/Deepfake-Detection-Project"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Github className="w-4 h-4" /> View GitHub Repository →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
