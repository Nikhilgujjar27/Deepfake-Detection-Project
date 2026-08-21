import React from 'react';
import { ShieldCheck, BookOpen, Github, CheckCircle2 } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-24">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5" /> DeepSentry Forensics Platform
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          About DeepSentry
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
          An evidence-based, explainable AI facial forensics platform engineered for real-world reliability on modern digital imagery.
        </p>
      </div>

      {/* Philosophy & Mandate */}
      <div className="saas-card p-6 sm:p-8 border border-slate-200 bg-white rounded-xl space-y-3 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" /> Engineering Ethos: Empirical Measurement & Explainability
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          DeepSentry was constructed through disciplined empirical validation. By standardizing facial extraction geometry to 1.3× and calibrating a 60/40 dual-model fusion (Vision Transformer + Secondary Boundary Detector), the platform achieves 99.00% benchmark precision and 90.0% real-world smartphone photo accuracy, while generating pixel-aligned attention heatmaps for full transparency.
        </p>
      </div>

      {/* Specifications & System Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="saas-card p-6 border border-slate-200 bg-white rounded-xl space-y-3 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" /> Technical Capabilities
          </h3>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
              <span><strong>Deep Learning Backbone:</strong> 86.5M parameter Vision Transformer (ViT-Base-Patch16)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
              <span><strong>Consensus Ensemble:</strong> Calibrated 60/40 weighted fusion with τ = 0.60 decision threshold</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
              <span><strong>Explainability Layer:</strong> Multi-head self-attention rollout mapped across 196 patch tokens</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
              <span><strong>Backend Stack:</strong> High-performance FastAPI REST API with SQLite persistence</span>
            </li>
          </ul>
        </div>

        <div className="saas-card p-6 border border-slate-200 bg-white rounded-xl space-y-3 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Github className="w-4 h-4 text-slate-700" /> Open Source & Reproducibility
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            The complete codebase, documentation suite, test harnesses, and model configurations are versioned on GitHub for reproducible verification and research analysis.
          </p>
          <div className="pt-1">
            <a
              href="https://github.com/Nikhilgujjar27/Deepfake-Detection-Project"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Github className="w-4 h-4" /> View GitHub Repository →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
