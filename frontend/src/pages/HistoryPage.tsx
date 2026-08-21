import React, { useState, useEffect } from 'react';
import { History, Search, Trash2, ShieldCheck, ShieldAlert, AlertCircle, RefreshCw, Scan, Loader2 } from 'lucide-react';
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

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const data = await api.getHistory();
      setScans(data);
    } catch {
      // Empty state handled
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
    if (!confirm('Are you sure you want to remove this scan record?')) return;
    try {
      await api.deleteScan(id);
      setScans((prev) => prev.filter((s) => s.id !== id));
    } catch {
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
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 mx-auto flex items-center justify-center">
          <History className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Audit History Requires Sign In</h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          Sign in or create an account to view and export your forensic scan history archives.
        </p>
        <div className="pt-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-xs transition-colors"
          >
            Sign In to View History
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <History className="w-6 h-6 text-blue-600" />
            <span>Forensic Scan Audit History</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review past image inspections and forensic consensus logs stored in your account.
          </p>
        </div>
        <button
          onClick={fetchHistory}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium self-start shadow-xs transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Filters Bar */}
      <div className="saas-card p-4 border border-slate-200 bg-white rounded-xl flex flex-col sm:flex-row gap-3 justify-between items-center shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by filename..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="saas-input pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {['ALL', 'REAL', 'FAKE'].map((v) => (
            <button
              key={v}
              onClick={() => setFilterVerdict(v)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                filterVerdict === v
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Table / Empty State */}
      {isLoading ? (
        <div className="py-24 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="text-xs font-medium text-slate-500">Loading audit history records...</p>
        </div>
      ) : filteredScans.length === 0 ? (
        <div className="saas-card p-16 rounded-xl text-center space-y-4 border border-slate-200 bg-white shadow-xs">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-semibold text-slate-900">No Scan Records Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't run any forensic inspections yet, or no records match your filter.
          </p>
          <Link
            to="/scan"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors"
          >
            <Scan className="w-3.5 h-3.5" /> Launch a New Scan
          </Link>
        </div>
      ) : (
        <div className="saas-card rounded-xl border border-slate-200 overflow-hidden bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-3 px-4">Verdict</th>
                  <th className="py-3 px-4">Filename</th>
                  <th className="py-3 px-4">Certainty</th>
                  <th className="py-3 px-4">ViT-Base Result</th>
                  <th className="py-3 px-4">Secondary Result</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredScans.map((scan) => {
                  const isFake = scan.final_verdict === 'FAKE';
                  return (
                    <tr key={scan.id} className="hover:bg-slate-50/75 transition-colors">
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            isFake
                              ? 'bg-rose-50 border-rose-200 text-rose-700'
                              : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          }`}
                        >
                          {isFake ? <ShieldAlert className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                          {scan.final_verdict}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900 max-w-[200px] truncate">
                        {scan.filename}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {formatConfidence(scan.confidence_score)}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {scan.vit_verdict} ({scan.vit_confidence.toFixed(1)}%)
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {scan.secondary_verdict} ({scan.secondary_confidence.toFixed(1)}%)
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {new Date(scan.created_at).toLocaleDateString()}{' '}
                        {new Date(scan.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDelete(scan.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="Delete Record"
                          aria-label="Delete Record"
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
