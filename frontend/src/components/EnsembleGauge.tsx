import React from 'react';
import { Cpu, Layers, GitCompare, ShieldAlert, ShieldCheck } from 'lucide-react';
import type { FaceResult } from '../types';

interface Props {
  face: FaceResult;
}

export const EnsembleGauge: React.FC<Props> = ({ face }) => {
  const vitFakePct = face.vit_p_fake * 100;
  const secFakePct = face.secondary_p_fake * 100;
  const ensFakePct = face.ensemble_p_fake * 100;

  const isFake = face.verdict === 'FAKE';

  return (
    <div className="saas-card-flat p-5 border border-slate-200 bg-white rounded-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
            <GitCompare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Dual-Model Forensic Consensus</h4>
            <p className="text-xs text-slate-500">60% Vision Transformer + 40% Secondary Boundary Detector</p>
          </div>
        </div>

        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold self-start sm:self-auto border ${
          isFake
            ? 'bg-rose-50 border-rose-200 text-rose-700'
            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
        }`}>
          {isFake ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
          <span>{face.verdict} ({face.confidence.toFixed(1)}% Certainty)</span>
        </div>
      </div>

      {/* Primary Model Bar */}
      <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-100">
        <div className="flex justify-between text-xs">
          <span className="font-medium text-slate-700 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-blue-600" /> Primary Vision Transformer (Weight: 60%)
          </span>
          <span className={`font-semibold ${face.vit_verdict === 'FAKE' ? 'text-rose-600' : 'text-emerald-600'}`}>
            {face.vit_verdict} ({vitFakePct.toFixed(1)}% Fake / {(100 - vitFakePct).toFixed(1)}% Real)
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden flex">
          <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${100 - vitFakePct}%` }} />
          <div className="bg-rose-500 h-full transition-all duration-300" style={{ width: `${vitFakePct}%` }} />
        </div>
      </div>

      {/* Secondary Model Bar */}
      <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-100">
        <div className="flex justify-between text-xs">
          <span className="font-medium text-slate-700 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-600" /> Secondary Boundary Model (Weight: 40%)
          </span>
          <span className={`font-semibold ${face.secondary_verdict === 'FAKE' ? 'text-rose-600' : 'text-emerald-600'}`}>
            {face.secondary_verdict} ({secFakePct.toFixed(1)}% Fake / {(100 - secFakePct).toFixed(1)}% Real)
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden flex">
          <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${100 - secFakePct}%` }} />
          <div className="bg-rose-500 h-full transition-all duration-300" style={{ width: `${secFakePct}%` }} />
        </div>
      </div>

      {/* Calibrated Ensemble Combined */}
      <div className="pt-2 border-t border-slate-100 space-y-2">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-800">Calibrated Fusion Probability (Decision Threshold: τ = 0.60)</span>
          <span className="text-blue-600">{ensFakePct.toFixed(1)}% P(Fake)</span>
        </div>
        <div className="relative w-full bg-slate-200 rounded-full h-3 overflow-hidden flex">
          <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${100 - ensFakePct}%` }} />
          <div className="bg-rose-500 h-full transition-all duration-300" style={{ width: `${ensFakePct}%` }} />
          {/* Threshold Marker at 60% */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-slate-900 z-10"
            style={{ left: '60%' }}
            title="Decision Boundary (60%)"
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>0% (Real)</span>
          <span className="text-slate-600 font-medium">▲ Decision Boundary (60%)</span>
          <span>100% (Fake)</span>
        </div>
      </div>
    </div>
  );
};
