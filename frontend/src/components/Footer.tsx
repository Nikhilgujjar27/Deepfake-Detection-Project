import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Github, Layers } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-base font-semibold text-slate-900">
                DeepSentry
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Evidence-based deepfake detection powered by a calibrated Vision Transformer and secondary forensic neural networks. Designed for high real-world reliability on smartphone imagery.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Forensic Tools
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/scan" className="hover:text-blue-600 transition-colors">
                  Forensic Studio
                </Link>
              </li>
              <li>
                <Link to="/education" className="hover:text-blue-600 transition-colors">
                  Forensics Academy
                </Link>
              </li>
              <li>
                <Link to="/architecture" className="hover:text-blue-600 transition-colors">
                  System Architecture
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-blue-600 transition-colors">
                  Audit Records
                </Link>
              </li>
            </ul>
          </div>

          {/* Documentation & Source */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Resources
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/about" className="hover:text-blue-600 transition-colors">
                  Project Documentation
                </Link>
              </li>
              <li>
                <a
                  href="http://localhost:8000/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors inline-flex items-center gap-1"
                >
                  <Layers className="w-3.5 h-3.5" /> API Reference
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Nikhilgujjar27/Deepfake-Detection-Project"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors inline-flex items-center gap-1"
                >
                  <Github className="w-3.5 h-3.5" /> GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} DeepSentry AI Forensics. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>60/40 Calibrated Ensemble Engine</span>
            <span>•</span>
            <span>Vision Transformer ViT-Base</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
