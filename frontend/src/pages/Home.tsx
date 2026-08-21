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
  Award
} from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative pt-12 lg:pt-20 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-cyan-500/15 to-purple-600/20 blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center space-y-6 px-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-medium shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Calibrated ViT-Base + CNN Ensemble Active</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Scientific Deepfake Detection with{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
              Explainable AI
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Eliminate synthetic media fraud and deceptive face manipulation. Powered by an 86.5M parameter Vision Transformer, multi-model consensus calibration, and full attention heatmap provenance.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/scan"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition-all duration-300 hover:scale-[1.02]"
            >
              <Scan className="w-5 h-5" />
              <span>Verify Media Now</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            <Link
              to="/education"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-xl glass-card hover:bg-slate-800/60 text-slate-300 hover:text-white font-semibold text-base transition-all duration-200 border border-slate-700/60"
            >
              <Eye className="w-5 h-5 text-indigo-400" />
              <span>Explore Academy</span>
            </Link>
          </div>

          {/* Telemetry Metrics Bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-card p-4 rounded-xl border border-slate-800/80 text-left">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">99.00%</span>
              <p className="text-xs text-slate-400 mt-1">Benchmark Test Accuracy</p>
            </div>
            <div className="glass-card p-4 rounded-xl border border-slate-800/80 text-left">
              <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">90.0%</span>
              <p className="text-xs text-slate-400 mt-1">Real Smartphone Accuracy</p>
            </div>
            <div className="glass-card p-4 rounded-xl border border-slate-800/80 text-left">
              <span className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono">&lt;110ms</span>
              <p className="text-xs text-slate-400 mt-1">CPU Inference Latency</p>
            </div>
            <div className="glass-card p-4 rounded-xl border border-slate-800/80 text-left">
              <span className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">196</span>
              <p className="text-xs text-slate-400 mt-1">Attention Patches / Crop</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Feature Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">
            Scientific Pipeline
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
            Engineered for Precision & Explainability
          </h3>
          <p className="text-sm text-slate-400">
            Unlike superficial CNN detectors that overfit to specific generators, DeepSentry analyzes both global relational patch attention and micro-texture boundaries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 relative group hover:border-indigo-500/40 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center mb-5 text-indigo-400 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Vision Transformer Core</h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              12-layer Transformer backbone with 12 multi-head attention mechanisms dividing facial crops into 196 discrete $16\times16$ tokens for structural synthesis analysis.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 86.5 Million Parameters</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> CLS Token Classification</li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 relative group hover:border-cyan-500/40 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-cyan-600/15 border border-cyan-500/30 flex items-center justify-center mb-5 text-cyan-400 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Calibrated Dual-Model Fusion</h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Empirically calibrated 60/40 ensemble combining global transformer self-attention with high-frequency boundary artifact scanning to eliminate false alarms.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> $\tau=0.60$ Calibrated Boundary</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Robust to Mobile Compression</li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 relative group hover:border-purple-500/40 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center mb-5 text-purple-400 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Explainable Heatmaps</h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Directly generates pixel-aligned Jet colormap overlays revealing exact facial regions (eyes, blending seams, mouth, contours) that triggered the verdict.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Zero Black-Box Decisions</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Multi-Head Attention Rollout</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Forensic Comparison Table */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 rounded-3xl border border-slate-800">
          <div className="mb-6 text-center sm:text-left">
            <h3 className="text-2xl font-bold text-white">Empirical Performance Comparison</h3>
            <p className="text-sm text-slate-400 mt-1">Measured across benchmark datasets and authentic smartphone photos</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-mono text-slate-400">
                  <th className="pb-3 font-semibold">Evaluation Mode</th>
                  <th className="pb-3 font-semibold">Benchmark Accuracy</th>
                  <th className="pb-3 font-semibold">Real Mobile Photos</th>
                  <th className="pb-3 font-semibold">False Positive Rate</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                <tr>
                  <td className="py-3 text-slate-400">Legacy Architecture (40% Padding)</td>
                  <td className="py-3 text-slate-400">99.5%</td>
                  <td className="py-3 text-rose-400">&lt;40.0% (Failed)</td>
                  <td className="py-3 text-rose-400">&gt;60.0% (High Alarm)</td>
                  <td className="py-3 text-slate-500">Deprecated</td>
                </tr>
                <tr>
                  <td className="py-3 text-slate-300">Phase 3 Isolated ViT (1.3× Crop)</td>
                  <td className="py-3 text-slate-300">98.5%</td>
                  <td className="py-3 text-slate-300">86.7%</td>
                  <td className="py-3 text-amber-400">13.3%</td>
                  <td className="py-3 text-slate-400">Baseline</td>
                </tr>
                <tr className="bg-indigo-950/20 text-white font-semibold">
                  <td className="py-3.5 text-indigo-300 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-indigo-400" /> DeepSentry Calibrated Ensemble
                  </td>
                  <td className="py-3.5 text-emerald-400 font-bold">99.00%</td>
                  <td className="py-3.5 text-emerald-400 font-bold">90.00% (27/30)</td>
                  <td className="py-3.5 text-emerald-400 font-bold">10.00%</td>
                  <td className="py-3.5 text-indigo-400 font-bold">Active Engine</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. CTA Banner */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-r from-indigo-900/60 via-slate-900 to-cyan-950/60 border border-indigo-500/30 text-center space-y-6 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 mx-auto flex items-center justify-center text-indigo-300">
            <Shield className="w-7 h-7" />
          </div>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to Inspect Your Image?
          </h3>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Upload any face portrait or capture a live webcam shot. Our dual-model pipeline will generate bounding boxes, ensemble predictions, and attention heatmaps in under 200ms.
          </p>
          <div className="pt-2">
            <Link
              to="/scan"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-slate-950 font-bold hover:bg-slate-100 shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Scan className="w-5 h-5 text-indigo-600" />
              <span>Open Forensic Studio</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
