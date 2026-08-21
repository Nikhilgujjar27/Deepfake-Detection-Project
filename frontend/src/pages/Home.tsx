import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Scan,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Eye,
  Check
} from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="pt-12 sm:pt-16 pb-8 border-b border-slate-200/80 bg-white">
        <div className="max-w-5xl mx-auto text-center space-y-6 px-4">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Calibrated Vision Transformer & Boundary Ensemble Active</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.15]">
            Evidence-Based Deepfake Detection with{' '}
            <span className="text-blue-600">Explainable AI</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            High-reliability synthetic media verification built for real-world smartphone imagery. Powered by an 86.5M parameter Vision Transformer, multi-model consensus, and pixel-aligned attention heatmaps.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/scan"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-xs transition-colors"
            >
              <Scan className="w-4 h-4" />
              <span>Launch Forensic Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/education"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm transition-colors"
            >
              <Eye className="w-4 h-4 text-slate-500" />
              <span>Learn Anatomical Artifacts</span>
            </Link>
          </div>

          {/* Key Metrics Bar */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-left">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">99.00%</span>
              <p className="text-xs text-slate-500 mt-1 font-medium">Benchmark Accuracy</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-left">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">90.0%</span>
              <p className="text-xs text-slate-500 mt-1 font-medium">Real Smartphone Accuracy</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-left">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">&lt;600ms</span>
              <p className="text-xs text-slate-500 mt-1 font-medium">CPU Scan Latency</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-left">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">196</span>
              <p className="text-xs text-slate-500 mt-1 font-medium">Transformer Token Patches</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Architectural Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Forensic Architecture
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Engineered for Structural & Texture Verification
          </h3>
          <p className="text-sm text-slate-500">
            Combines global transformer relational attention with micro-texture boundary scanning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="saas-card p-6 border border-slate-200 bg-white rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-slate-900 mb-2">Vision Transformer Core</h4>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              12-layer Transformer backbone with 12 multi-head attention mechanisms dividing facial crops into 196 discrete tokens for structural synthesis analysis.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> 86.5 Million Parameter ViT-Base</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> CLS Token Classification</li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="saas-card p-6 border border-slate-200 bg-white rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-slate-900 mb-2">Calibrated Dual-Model Fusion</h4>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Empirically calibrated 60/40 ensemble combining global transformer self-attention with high-frequency boundary artifact scanning to minimize false alarms.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> τ = 0.60 Calibrated Decision Boundary</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp & JPEG Compression Resistant</li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="saas-card p-6 border border-slate-200 bg-white rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-4 border border-purple-100">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-slate-900 mb-2">Explainable Heatmaps</h4>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Directly generates pixel-aligned Jet colormap overlays revealing exact facial regions (eyes, blending seams, mouth, contours) that triggered the verdict.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Zero Black-Box Decisions</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Multi-Head Attention Rollout</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Forensic Comparison Table */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="saas-card p-6 sm:p-8 border border-slate-200 bg-white rounded-xl">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900">Empirical Performance Benchmark</h3>
            <p className="text-sm text-slate-500 mt-0.5">Tested across standardized in-distribution benchmarks and real-world smartphone photos</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
                  <th className="pb-3">Evaluation Pipeline</th>
                  <th className="pb-3">Benchmark Accuracy</th>
                  <th className="pb-3">Real Mobile Photos</th>
                  <th className="pb-3">False Positive Rate</th>
                  <th className="pb-3">Architecture Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                <tr>
                  <td className="py-3 font-medium text-slate-500">Legacy Architecture (40% Wide Crop + CLAHE)</td>
                  <td className="py-3 text-slate-500">99.5%</td>
                  <td className="py-3 text-rose-600 font-semibold">&lt;40.0% (Failed)</td>
                  <td className="py-3 text-rose-600">&gt;60.0%</td>
                  <td className="py-3 text-slate-400">Deprecated</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-slate-700">Phase 3 Isolated ViT (1.3× Natural Crop)</td>
                  <td className="py-3 text-slate-700">98.5%</td>
                  <td className="py-3 text-slate-700">86.7%</td>
                  <td className="py-3 text-amber-600 font-semibold">13.3%</td>
                  <td className="py-3 text-slate-500">Baseline</td>
                </tr>
                <tr className="bg-blue-50/60 font-semibold text-slate-900">
                  <td className="py-3 text-blue-700 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-blue-600" /> DeepSentry Calibrated 60/40 Ensemble
                  </td>
                  <td className="py-3 text-emerald-700">99.00%</td>
                  <td className="py-3 text-emerald-700 font-bold">90.00%</td>
                  <td className="py-3 text-emerald-700">10.00%</td>
                  <td className="py-3 text-blue-700">Active Production Engine</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. Action Banner */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="rounded-xl p-8 sm:p-10 bg-slate-900 text-white text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-lg bg-blue-600/30 border border-blue-500/40 mx-auto flex items-center justify-center text-blue-400">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Ready to Verify Media Authenticity?
          </h3>
          <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Upload any face portrait or capture a live webcam image to generate bounding boxes, dual-model consensus, and self-attention heatmaps.
          </p>
          <div className="pt-2">
            <Link
              to="/scan"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-slate-900 font-semibold hover:bg-slate-100 shadow-xs transition-colors"
            >
              <Scan className="w-4 h-4 text-blue-600" />
              <span>Open Forensic Studio</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
