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
    <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <GitCompare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Dual-Model Consensus & Ensemble</h4>
            <p className="text-xs text-slate-400">Weighted linear fusion with calibrated decision boundary</p>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 ${
          isFake
            ? 'bg-rose-950/70 border border-rose-700/60 text-rose-300'
            : 'bg-emerald-950/70 border border-emerald-700/60 text-emerald-300'
        }`}>
          {isFake ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
          {face.verdict} ({face.confidence.toFixed(1)}%)
        </div>
      </div>

      {/* Primary Model Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-slate-400 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-indigo-400" /> Primary ViT-Base (Weight: 60%)
          </span>
          <span className={face.vit_verdict === 'FAKE' ? 'text-rose-400' : 'text-emerald-400'}>
            {face.vit_verdict} ({vitFakePct.toFixed(1)}% Fake / {(100 - vitFakePct).toFixed(1)}% Real)
          </span>
        </div>
        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden flex border border-slate-800">
          <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${100 - vitFakePct}%` }} />
          <div className="bg-rose-500 h-full transition-all duration-500" style={{ width: `${vitFakePct}%` }} />
        </div>
      </div>

      {/* Secondary Model Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-slate-400 flex items-center gap-1">
            <Layers className="w-3 h-3 text-cyan-400" /> Secondary Boundary Detector (Weight: 40%)
          </span>
          <span className={face.secondary_verdict === 'FAKE' ? 'text-rose-400' : 'text-emerald-400'}>
            {face.secondary_verdict} ({secFakePct.toFixed(1)}% Fake / {(100 - secFakePct).toFixed(1)}% Real)
          </span>
        </div>
        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden flex border border-slate-800">
          <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${100 - secFakePct}%` }} />
          <div className="bg-rose-500 h-full transition-all duration-500" style={{ width: `${secFakePct}%` }} />
        </div>
      </div>

      {/* Calibrated Ensemble Combined */}
      <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
        <div className="flex justify-between text-xs font-mono font-semibold">
          <span className="text-indigo-300">Calibrated Fusion Score (Threshold: 60.0%)</span>
          <span className="text-slate-200">{ensFakePct.toFixed(1)}% Ensemble P(Fake)</span>
        </div>
        <div className="relative w-full bg-slate-900 rounded-full h-3.5 overflow-hidden flex border border-indigo-500/30">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 h-full transition-all duration-500" style={{ width: `${100 - ensFakePct}%` }} />
          <div className="bg-gradient-to-r from-rose-500 to-rose-600 h-full transition-all duration-500" style={{ width: `${ensFakePct}%` }} />
          {/* Threshold Marker at 60% */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-yellow-400 z-10"
            style={{ left: '60%' }}
            title="Decision Threshold (60%)"
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>0% (100% Real)</span>
          <span className="text-yellow-400/80">▲ Threshold (60%)</span>
          <span>100% (100% Fake)</span>
        </div>
      </div>
    </div>
  );
};
