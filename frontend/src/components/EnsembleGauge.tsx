import React, { useState, useEffect } from 'react';
import { Cpu, Layers, GitCompare, ShieldAlert, ShieldCheck } from 'lucide-react';
import type { FaceResult } from '../types';
import { formatConfidence } from '../lib/utils';

interface Props {
  face: FaceResult;
}

export const EnsembleGauge: React.FC<Props> = ({ face }) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(timer);
  }, [face]);

  const vitFakePct = (face.vit_p_fake ?? 0) * 100;
  const secFakePct = (face.secondary_p_fake ?? 0) * 100;
  const ensFakePct = (face.ensemble_p_fake ?? 0) * 100;

  const isFake = face.verdict === 'FAKE';

  return (
    <div className="forensic-card p-6 border border-slate-200 bg-white rounded-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">Dual-Model Forensic Consensus</h4>
            <p className="text-xs text-slate-500">60% Vision Transformer (ViT-Base) + 40% Secondary Boundary Detector</p>
          </div>
        </div>

        <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold self-start sm:self-auto border ${
          isFake
            ? 'bg-rose-50 border-rose-200 text-rose-700'
            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
        }`}>
          {isFake ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
          <span>{face.verdict || 'UNKNOWN'} ({formatConfidence(face.confidence)} Certainty)</span>
        </div>
      </div>

      {/* Primary Model Bar (ViT-Base: 60% Weight) */}
      <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
        <div className="flex justify-between text-xs">
          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-blue-600" /> Primary Vision Transformer (Weight: 60%)
          </span>
          <span className={`font-bold ${face.vit_verdict === 'FAKE' ? 'text-rose-600' : 'text-emerald-600'}`}>
            {face.vit_verdict} ({vitFakePct.toFixed(1)}% Fake / {(100 - vitFakePct).toFixed(1)}% Real)
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden flex">
          <div
            className="bg-emerald-500 h-full transition-all duration-700 ease-out"
            style={{ width: animated ? `${100 - vitFakePct}%` : '0%' }}
          />
          <div
            className="bg-rose-500 h-full transition-all duration-700 ease-out"
            style={{ width: animated ? `${vitFakePct}%` : '0%' }}
          />
        </div>
      </div>

      {/* Secondary Model Bar (Boundary Model: 40% Weight) */}
      <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
        <div className="flex justify-between text-xs">
          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-700" /> Secondary Boundary Detector (Weight: 40%)
          </span>
          <span className={`font-bold ${face.secondary_verdict === 'FAKE' ? 'text-rose-600' : 'text-emerald-600'}`}>
            {face.secondary_verdict} ({secFakePct.toFixed(1)}% Fake / {(100 - secFakePct).toFixed(1)}% Real)
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden flex">
          <div
            className="bg-emerald-500 h-full transition-all duration-700 ease-out"
            style={{ width: animated ? `${100 - secFakePct}%` : '0%' }}
          />
          <div
            className="bg-rose-500 h-full transition-all duration-700 ease-out"
            style={{ width: animated ? `${secFakePct}%` : '0%' }}
          />
        </div>
      </div>

      {/* Calibrated Ensemble Combined */}
      <div className="pt-2 border-t border-slate-100 space-y-2.5">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-slate-900">Calibrated Fusion Probability (Decision Boundary: τ = 0.60)</span>
          <span className="text-blue-600">{ensFakePct.toFixed(1)}% Ensemble P(Fake)</span>
        </div>
        <div className="relative w-full bg-slate-200 rounded-full h-3.5 overflow-hidden flex">
          <div
            className="bg-emerald-500 h-full transition-all duration-1000 ease-out"
            style={{ width: animated ? `${100 - ensFakePct}%` : '0%' }}
          />
          <div
            className="bg-rose-500 h-full transition-all duration-1000 ease-out"
            style={{ width: animated ? `${ensFakePct}%` : '0%' }}
          />
          {/* Decision Boundary Pin */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-slate-900 z-10"
            style={{ left: '60%' }}
            title="Decision Boundary (60%)"
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-400 font-medium">
          <span>0% (Authentic Real)</span>
          <span className="text-slate-700 font-semibold">▲ Decision Boundary (60%)</span>
          <span>100% (Synthetic Deepfake)</span>
        </div>
      </div>
    </div>
  );
};
