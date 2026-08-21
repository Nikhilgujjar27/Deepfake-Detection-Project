import React from 'react';
import { Shield, Github, Cpu, FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Synopsis */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                <Shield className="w-4 h-4 text-indigo-400" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">DeepSentry</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Scientific Deepfake Detection & Facial Media Forensics System powered by a Calibrated Vision Transformer (ViT-Base-16) and Secondary Boundary Texture Ensemble. Validated on synthetic benchmarks and real-world smartphone imagery.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" /> ViT-B/16 + CNN Ensemble
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-emerald-400" /> 99.0% Benchmark Acc
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 font-mono">System</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/scan" className="hover:text-indigo-400 transition-colors">Forensic Scanner</Link></li>
              <li><Link to="/education" className="hover:text-indigo-400 transition-colors">Deepfake Academy</Link></li>
              <li><Link to="/architecture" className="hover:text-indigo-400 transition-colors">Architecture & Metrics</Link></li>
              <li><Link to="/history" className="hover:text-indigo-400 transition-colors">Audit History</Link></li>
            </ul>
          </div>

          {/* Col 3: Academic & Research */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 font-mono">Academic & Code</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a
                  href="https://github.com/Nikhilgujjar27/Deepfake-Detection-Project"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors"
                >
                  <Github className="w-4 h-4" /> GitHub Repository
                </a>
              </li>
              <li><Link to="/about" className="hover:text-indigo-400 transition-colors">VTU Major Project</Link></li>
              <li><Link to="/about" className="hover:text-indigo-400 transition-colors">Research Methodology</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono">
          <p>© 2026 DeepSentry AI Forensics. Engineered for VTU Computer Science & Engineering.</p>
          <p className="mt-2 sm:mt-0">Calibrated Dual-Model Inference Pipeline • Zero Heuristics</p>
        </div>
      </div>
    </footer>
  );
};
