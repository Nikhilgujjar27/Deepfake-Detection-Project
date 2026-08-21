import React, { useState, useEffect } from 'react';
import { History, Search, Trash2, ShieldCheck, ShieldAlert, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '../lib/api';
import type { ScanHistoryItem } from '../types';
import { formatConfidence } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const HistoryPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [scans, setScans] = useState<ScanHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterVerdict, setFilterVerdict] = useState<string>('ALL');
  const [selectedScan, setSelectedScan] = useState<ScanHistoryItem | null>(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const data = await api.getHistory();
      setScans(data);
    } catch {
      // Handled silently or empty state
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchHistory();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this scan record?')) return;
    try {
      await api.deleteScan(id);
      setScans((prev) => prev.filter((s) => s.id !== id));
      if (selectedScan?.id === id) setSelectedScan(null);
    } catch (err) {
      alert('Failed to delete scan record.');
    }
  };

  const filteredScans = scans.filter((scan) => {
    const matchesSearch = scan.filename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVerdict = filterVerdict === 'ALL' || scan.final_verdict === filterVerdict;
    return matchesSearch && matchesVerdict;
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 mx-auto flex items-center justify-center">
          <History className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Scan History Requires Authentication</h2>
        <p className="text-sm text-slate-400">
          Sign in or create an account to store and review all your forensic media analysis records.
        </p>
        <div className="pt-2">
          <Link
            to="/login"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg transition-all"
          >
            Sign In to View History
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <History className="w-7 h-7 text-indigo-400" />
            <span>Forensic Scan Audit History</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse and inspect all historical media predictions processed by the calibrated pipeline.
          </p>
        </div>
        <button
          onClick={fetchHistory}
          className="px-4 py-2 rounded-lg glass-card hover:bg-slate-800 text-slate-300 text-xs font-mono flex items-center gap-2 self-start transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by filename..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['ALL', 'REAL', 'FAKE'].map((v) => (
            <button
              key={v}
              onClick={() => setFilterVerdict(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                filterVerdict === v
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Table / Grid */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-3 border-indigo-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-mono text-slate-400">Loading audit history records...</p>
        </div>
      ) : filteredScans.length === 0 ? (
        <div className="glass-card p-16 rounded-3xl text-center space-y-4 border border-slate-800">
          <AlertCircle className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Scan Records Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You have not executed any forensic scans yet, or no records match your filter criteria.
          </p>
          <Link
            to="/scan"
            className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
          >
            Launch Your First Scan
          </Link>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Verdict</th>
                  <th className="py-3.5 px-4 font-semibold">Filename</th>
                  <th className="py-3.5 px-4 font-semibold">Ensemble Conf.</th>
                  <th className="py-3.5 px-4 font-semibold">Primary ViT</th>
                  <th className="py-3.5 px-4 font-semibold">Secondary</th>
                  <th className="py-3.5 px-4 font-semibold">Timestamp</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredScans.map((scan) => {
                  const isFake = scan.final_verdict === 'FAKE';
                  return (
                    <tr key={scan.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            isFake
                              ? 'bg-rose-950/70 border-rose-700/60 text-rose-300'
                              : 'bg-emerald-950/70 border-emerald-700/60 text-emerald-300'
                          }`}
                        >
                          {isFake ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                          {scan.final_verdict}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-sans font-semibold text-white max-w-[200px] truncate">
                        {scan.filename}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-200">
                        {formatConfidence(scan.confidence_score)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {scan.vit_verdict} ({scan.vit_confidence.toFixed(1)}%)
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {scan.secondary_verdict} ({scan.secondary_confidence.toFixed(1)}%)
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(scan.created_at).toLocaleDateString()}{' '}
                        {new Date(scan.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDelete(scan.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
