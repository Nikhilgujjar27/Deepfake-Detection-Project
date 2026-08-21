import React, { useState, useEffect, useCallback } from 'react';
import { History, Search, Trash2, ShieldCheck, ShieldAlert, AlertCircle, RefreshCw, Scan, Loader2, LogIn, Calendar, FileText } from 'lucide-react';
import { api, getErrorMessage } from '../lib/api';
import type { ScanHistoryItem } from '../types';
import { formatConfidence, formatDate, formatTime } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const HistoryPage: React.FC = () => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [scans, setScans] = useState<ScanHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterVerdict, setFilterVerdict] = useState<string>('ALL');

  const fetchHistory = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getHistory();
      setScans(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Unable to load audit history. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthLoading) {
      fetchHistory();
    }
  }, [isAuthLoading, fetchHistory]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to remove this scan record?')) return;
    try {
      await api.deleteScan(id);
      setScans((prev) => prev.filter((s) => s.id !== id));
    } catch (err: unknown) {
      alert(getErrorMessage(err, 'Failed to delete scan record.'));
    }
  };

  const filteredScans = scans.filter((scan) => {
    const filename = scan.filename || '';
    const matchesSearch = filename.toLowerCase().includes(searchTerm.toLowerCase().trim());
    const matchesVerdict = filterVerdict === 'ALL' || scan.final_verdict === filterVerdict;
    return matchesSearch && matchesVerdict;
  });

  // 1. Unauthenticated State
  if (!isAuthLoading && !isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 mx-auto flex items-center justify-center">
          <History className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Audit History Requires Sign In</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Please sign in to your account to review, inspect, and export your personal scan records.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-xs transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Continue</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <History className="w-6 h-6 text-blue-600" />
            <span>Audit History</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review your previously processed image forensic records and confidence metrics.
          </p>
        </div>
        <button
          onClick={fetchHistory}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium self-start shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by filename..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'REAL', 'FAKE'].map((v) => (
            <button
              key={v}
              onClick={() => setFilterVerdict(v)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                filterVerdict === v
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {v === 'ALL' ? 'All Results' : v}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="py-24 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="text-xs font-medium text-slate-500">Loading audit history...</p>
        </div>
      ) : error ? (
        <div className="p-8 rounded-xl border border-rose-200 bg-white text-center space-y-4 shadow-xs">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-slate-900">Unable to Load History</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">{error}</p>
          </div>
          <button
            onClick={fetchHistory}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Try Again
          </button>
        </div>
      ) : filteredScans.length === 0 ? (
        <div className="p-12 sm:p-16 rounded-xl text-center space-y-4 border border-slate-200 bg-white shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-slate-900">
              {searchTerm ? 'No Matching Records' : 'No Scan Records Found'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchTerm
                ? `No inspection history matching "${searchTerm}". Try a different search term.`
                : 'Your completed forensic media scans will be archived here automatically.'}
            </p>
          </div>
          <Link
            to="/scan"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors shadow-xs"
          >
            <Scan className="w-3.5 h-3.5" /> Start New Verification
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop Table View (>= 768px) */}
          <div className="hidden md:block rounded-xl border border-slate-200 overflow-hidden bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Verdict</th>
                    <th className="py-3 px-4">Filename</th>
                    <th className="py-3 px-4">Confidence</th>
                    <th className="py-3 px-4">Primary ViT</th>
                    <th className="py-3 px-4">Secondary Model</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredScans.map((scan) => {
                    const isFake = scan.final_verdict === 'FAKE';
                    return (
                      <tr key={scan.id} className="hover:bg-slate-50/75 transition-colors">
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                              isFake
                                ? 'bg-rose-50 border-rose-200 text-rose-700'
                                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            }`}
                          >
                            {isFake ? <ShieldAlert className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                            <span>{scan.final_verdict || 'UNKNOWN'}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-900 max-w-[220px] truncate">
                          {scan.filename || 'Unnamed Media'}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          {formatConfidence(scan.confidence_score)}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {scan.vit_verdict ? `${scan.vit_verdict} (${formatConfidence(scan.vit_confidence)})` : '—'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {scan.secondary_verdict ? `${scan.secondary_verdict} (${formatConfidence(scan.secondary_confidence)})` : '—'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                          {formatDate(scan.created_at)} <span className="text-slate-400 text-[11px]">{formatTime(scan.created_at)}</span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDelete(scan.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                            title="Delete Record"
                            aria-label={`Delete record for ${scan.filename}`}
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

          {/* Mobile Card List View (< 768px) */}
          <div className="md:hidden space-y-3">
            {filteredScans.map((scan) => {
              const isFake = scan.final_verdict === 'FAKE';
              return (
                <div key={scan.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                          isFake
                            ? 'bg-rose-50 border-rose-200 text-rose-700'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        }`}
                      >
                        {isFake ? <ShieldAlert className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                        <span>{scan.final_verdict || 'UNKNOWN'}</span>
                      </span>
                      <h4 className="text-sm font-semibold text-slate-900 truncate max-w-[240px]">
                        {scan.filename || 'Unnamed Media'}
                      </h4>
                    </div>
                    <button
                      onClick={() => handleDelete(scan.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Ensemble Confidence</span>
                      <span className="font-semibold text-slate-900">{formatConfidence(scan.confidence_score)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Primary ViT</span>
                      <span className="text-slate-700 font-medium">
                        {scan.vit_verdict ? `${scan.vit_verdict} (${formatConfidence(scan.vit_confidence)})` : '—'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(scan.created_at)} {formatTime(scan.created_at)}
                    </span>
                    <span>ID #{scan.id}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
