import React, { useState } from 'react';
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
  Check,
  Flame,
  Activity,
  Maximize2
} from 'lucide-react';
import { useAnimatedCount } from '../hooks/useAnimatedCount';
import { useInView } from '../hooks/useInView';

export const Home: React.FC = () => {
  const { ref: metricsRef, isInView: metricsInView } = useInView({ threshold: 0.2 });
  const [activeVisualMode, setActiveVisualMode] = useState<'tokens' | 'attention' | 'boundary'>('tokens');

  // Animated metric counters
  const benchAccuracy = useAnimatedCount(99.0, 1200, 2, metricsInView);
  const mobileAccuracy = useAnimatedCount(90.0, 1200, 1, metricsInView);
  const patchTokens = useAnimatedCount(196, 1000, 0, metricsInView);

  return (
    <div className="space-y-24 pb-24">
      {/* 1. Hero Section */}
      <section className="pt-12 sm:pt-16 pb-12 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Positioning & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Active Model Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Calibrated Vision Transformer & Dual-Model Ensemble Active</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.12]">
                Evidence-Based Deepfake Detection with{' '}
                <span className="text-blue-600">Explainable AI</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Empirical synthetic media forensics engineered for high reliability on smartphone imagery. Powered by an 86.5M parameter Vision Transformer, multi-model consensus, and pixel-aligned self-attention heatmaps.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/scan"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-xs transition-all duration-150"
                >
                  <Scan className="w-4 h-4" />
                  <span>Launch Forensic Studio</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </Link>
                <Link
                  to="/education"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors shadow-xs"
                >
                  <Eye className="w-4 h-4 text-slate-500" />
                  <span>Forensics Academy</span>
                </Link>
              </div>

              {/* Core Feature Bullet Points */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 text-xs font-medium text-slate-600">
                <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>1.3× Natural Crop Margin</span>
                </div>
                <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>60/40 Calibrated Fusion</span>
                </div>
                <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span>Zero Black-Box Output</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Forensic Workstation Visual */}
            <div className="lg:col-span-5">
              <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-slate-900 text-white shadow-lg space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Activity className="w-4 h-4 text-blue-400" />
                    <span className="font-semibold">Live Inspection Canvas</span>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
                    <button
                      onClick={() => setActiveVisualMode('tokens')}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                        activeVisualMode === 'tokens' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Patches (196)
                    </button>
                    <button
                      onClick={() => setActiveVisualMode('attention')}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                        activeVisualMode === 'attention' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Attention Map
                    </button>
                    <button
                      onClick={() => setActiveVisualMode('boundary')}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                        activeVisualMode === 'boundary' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      1.3× BBox
                    </button>
                  </div>
                </div>

                {/* Simulated Visual Face Canvas */}
                <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-4">
                  {/* Subtle Grid Background */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-25" />
                  
                  {/* Face Silhouette Box */}
                  <div className="relative w-44 h-52 rounded-2xl border-2 border-dashed border-blue-500/70 bg-blue-950/20 flex flex-col items-center justify-center p-3 shadow-inner">
                    {/* Bounding Label */}
                    <div className="absolute -top-3 left-3 bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1">
                      <Maximize2 className="w-2.5 h-2.5" /> Face #1 (1.3× Margin)
                    </div>

                    {/* Mode specific overlay */}
                    {activeVisualMode === 'tokens' && (
                      <div className="grid grid-cols-7 grid-rows-7 gap-1 w-full h-full p-1 opacity-75">
                        {Array.from({ length: 49 }).map((_, i) => (
                          <div
                            key={i}
                            className={`rounded-xs border border-blue-400/30 transition-all duration-300 ${
                              [16, 17, 18, 24, 25, 31, 32].includes(i)
                                ? 'bg-blue-500/40 border-blue-400'
                                : 'bg-transparent'
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    {activeVisualMode === 'attention' && (
                      <div className="w-full h-full rounded-xl bg-gradient-to-tr from-blue-900/40 via-amber-500/30 to-rose-500/40 flex items-center justify-center border border-amber-500/30 animate-pulse">
                        <Flame className="w-10 h-10 text-amber-400 opacity-80" />
                      </div>
                    )}

                    {activeVisualMode === 'boundary' && (
                      <div className="w-full h-full flex flex-col justify-between p-2 text-[10px] font-mono text-cyan-300">
                        <span className="self-start bg-slate-900/80 px-1.5 py-0.5 rounded">Top Forehead Margin</span>
                        <span className="self-center text-center bg-slate-900/90 px-2 py-1 rounded text-slate-200">
                          Geometric Extraction Standardized
                        </span>
                        <span className="self-end bg-slate-900/80 px-1.5 py-0.5 rounded">Chin Perimeter</span>
                      </div>
                    )}
                  </div>

                  {/* Sweep Line Animation */}
                  <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scan-sweep pointer-events-none" />
                </div>

                {/* Lower Visual Metrics */}
                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                    <span className="text-slate-400 block text-[11px]">Ensemble Confidence</span>
                    <span className="text-emerald-400 font-bold text-sm">96.0% Authentic</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                    <span className="text-slate-400 block text-[11px]">Transformer Tokens</span>
                    <span className="text-blue-400 font-bold text-sm">196 Discrete Patches</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Key Metrics Section (Animated on Viewport Scroll) */}
      <section ref={metricsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="forensic-card p-6 border border-slate-200 bg-white rounded-xl">
            <span className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              {benchAccuracy}%
            </span>
            <p className="text-sm font-semibold text-slate-800 mt-1">Benchmark Test Accuracy</p>
            <p className="text-xs text-slate-500 mt-0.5">Standardized balanced test set</p>
          </div>

          <div className="forensic-card p-6 border border-slate-200 bg-white rounded-xl">
            <span className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              {mobileAccuracy}%
            </span>
            <p className="text-sm font-semibold text-slate-800 mt-1">Smartphone Photo Accuracy</p>
            <p className="text-xs text-slate-500 mt-0.5">WhatsApp compressed imagery</p>
          </div>

          <div className="forensic-card p-6 border border-slate-200 bg-white rounded-xl">
            <span className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              &lt;600ms
            </span>
            <p className="text-sm font-semibold text-slate-800 mt-1">Inference Latency</p>
            <p className="text-xs text-slate-500 mt-0.5">CPU dual-model forward pass</p>
          </div>

          <div className="forensic-card p-6 border border-slate-200 bg-white rounded-xl">
            <span className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              {patchTokens}
            </span>
            <p className="text-sm font-semibold text-slate-800 mt-1">Self-Attention Tokens</p>
            <p className="text-xs text-slate-500 mt-0.5">14×14 grid patch resolution</p>
          </div>
        </div>
      </section>

      {/* 3. Core Architectural Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <h2 className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Technical Architecture
          </h2>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
            Designed for Multi-Level Structural & Texture Verification
          </h3>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
            Combines global transformer relational self-attention with high-frequency micro-texture boundary scanning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="forensic-card p-7 border border-slate-200 bg-white rounded-xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-xs">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-lg font-bold text-slate-900">Vision Transformer Core</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                12-layer Transformer backbone with 12 multi-head attention mechanisms dividing facial crops into 196 discrete tokens for structural synthesis analysis.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>86.5 Million Parameter ViT-Base Backbone</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>CLS Token Classification Architecture</span>
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="forensic-card p-7 border border-slate-200 bg-white rounded-xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-xs">
              <Layers className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-lg font-bold text-slate-900">Calibrated Dual-Model Fusion</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Empirically calibrated 60/40 ensemble combining global transformer self-attention with high-frequency boundary artifact scanning to eliminate false alarms.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>τ = 0.60 Calibrated Decision Boundary</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Resistant to WhatsApp & JPEG Artifacts</span>
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="forensic-card p-7 border border-slate-200 bg-white rounded-xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-lg font-bold text-slate-900">Explainable Heatmaps</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Generates pixel-aligned Jet colormap overlays revealing exact facial regions (eyes, blending seams, mouth, contours) that triggered the verdict.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>Zero Black-Box Forensic Decisions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>12-Layer Multi-Head Attention Rollout</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Forensic Benchmark Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="forensic-card p-6 sm:p-8 border border-slate-200 bg-white rounded-xl space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Empirical Performance Benchmark</h3>
            <p className="text-sm text-slate-500">
              Evaluated across standardized in-distribution test sets and real-world smartphone photos
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="pb-3 px-3">Evaluation Pipeline</th>
                  <th className="pb-3 px-3">Benchmark Accuracy</th>
                  <th className="pb-3 px-3">Real Mobile Photos</th>
                  <th className="pb-3 px-3">False Positive Rate</th>
                  <th className="pb-3 px-3">Architecture Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
                <tr>
                  <td className="py-3.5 px-3 font-medium text-slate-500">Legacy Architecture (40% Wide Crop + CLAHE)</td>
                  <td className="py-3.5 px-3 text-slate-500">99.5%</td>
                  <td className="py-3.5 px-3 text-rose-600 font-semibold">&lt;40.0% (Failed)</td>
                  <td className="py-3.5 px-3 text-rose-600 font-semibold">&gt;60.0% (High Alarm)</td>
                  <td className="py-3.5 px-3 text-slate-400">Deprecated</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-3 font-medium text-slate-700">Phase 3 Isolated ViT (1.3× Natural Crop)</td>
                  <td className="py-3.5 px-3 text-slate-700">98.5%</td>
                  <td className="py-3.5 px-3 text-slate-700">86.7%</td>
                  <td className="py-3.5 px-3 text-amber-600 font-semibold">13.3%</td>
                  <td className="py-3.5 px-3 text-slate-500">Baseline</td>
                </tr>
                <tr className="bg-blue-50/70 font-semibold text-slate-900">
                  <td className="py-4 px-3 text-blue-700 flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600" /> DeepSentry Calibrated 60/40 Ensemble
                  </td>
                  <td className="py-4 px-3 text-emerald-700 font-bold">99.00%</td>
                  <td className="py-4 px-3 text-emerald-700 font-bold">90.00% (27/30)</td>
                  <td className="py-4 px-3 text-emerald-700 font-bold">10.00%</td>
                  <td className="py-4 px-3 text-blue-700 font-bold">Active Production Engine</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl p-8 sm:p-12 bg-slate-900 text-white text-center space-y-5 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-500/40 mx-auto flex items-center justify-center text-blue-400">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Ready to Verify Media Authenticity?
          </h3>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Upload any face portrait or capture a live webcam image to generate bounding boxes, dual-model consensus, and self-attention heatmaps.
          </p>
          <div className="pt-2">
            <Link
              to="/scan"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-100 shadow-md transition-all duration-150"
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
