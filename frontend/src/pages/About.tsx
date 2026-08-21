import React from 'react';
import { Award, BookOpen, Github, ShieldCheck } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-24">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
          <Award className="w-3.5 h-3.5 text-indigo-400" /> VTU Major Project • 8th Semester CSE
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          About DeepSentry
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          An evidence-based, explainable AI facial forensics project designed and evaluated according to strict empirical standards.
        </p>
      </div>

      {/* Philosophy & Mandate */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" /> Development Ethos: "Measure → Compare → Decide → Build"
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Rather than relying on unverified heuristics, hardcoded whitelists, or speculative model swaps, DeepSentry was constructed through disciplined empirical isolation. We identified that the primary driver of real-world false alarms was face-crop background contamination (40% wide crop). Standardizing extraction geometry to 1.3× and calibrating a 60/40 dual-model fusion achieved a 99.00% benchmark and 90.0% real smartphone photo accuracy.
        </p>
      </div>

      {/* Academic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" /> Project Details
          </h3>
          <ul className="space-y-2 text-xs font-mono text-slate-400">
            <li><strong className="text-slate-200">Domain:</strong> Deep Learning, Computer Vision & Media Forensics</li>
            <li><strong className="text-slate-200">Affiliation:</strong> Visvesvaraya Technological University (VTU)</li>
            <li><strong className="text-slate-200">Department:</strong> Computer Science & Engineering</li>
            <li><strong className="text-slate-200">Core Model:</strong> Vision Transformer (ViT-Base-16)</li>
            <li><strong className="text-slate-200">Inference Engine:</strong> FastAPI + PyTorch + OpenCV</li>
          </ul>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Github className="w-4 h-4 text-cyan-400" /> Open Source & Continuity
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            The complete codebase, documentation suite (12 architecture & experiment files in <code>docs/</code>), and baseline model cards are preserved and versioned on GitHub for reproducible academic evaluation.
          </p>
          <a
            href="https://github.com/Nikhilgujjar27/Deepfake-Detection-Project"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-indigo-400 hover:text-cyan-300 transition-colors pt-2"
          >
            View GitHub Repository →
          </a>
        </div>
      </div>
    </div>
  );
};
