import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Download,
  AlertTriangle,
  Users,
  Eye
} from 'lucide-react';
import { api } from '../lib/api';
import type { PredictionResponse, FaceResult } from '../types';
import { AttentionHeatmapViewer } from '../components/AttentionHeatmapViewer';
import { EnsembleGauge } from '../components/EnsembleGauge';
import { ExifForensicsCard } from '../components/ExifForensicsCard';
import { formatBytes, formatConfidence } from '../lib/utils';

export const Scanner: React.FC = () => {
  // State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeFaceIndex, setActiveFaceIndex] = useState<number>(0);
  const [isWebcamActive, setIsWebcamActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // File Handlers
  const handleFileChange = (file: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Unsupported file type. Please upload JPEG, PNG, or WEBP images.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File exceeds the 10 MB maximum upload limit.');
      return;
    }
    setError(null);
    setSelectedFile(file);
    setResult(null);
    setActiveFaceIndex(0);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Webcam Handlers
  const startWebcam = async () => {
    try {
      setError(null);
      setIsWebcamActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setError('Unable to access camera. Please verify camera permissions.');
      setIsWebcamActive(false);
    }
  };

  const captureWebcamSnapshot = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `webcam_snapshot_${Date.now()}.jpg`, { type: 'image/jpeg' });
            handleFileChange(file);
            stopWebcam();
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsWebcamActive(false);
  };

  // Run Analysis Pipeline
  const runAnalysis = async () => {
    if (!selectedFile) return;

    setIsScanning(true);
    setError(null);
    setResult(null);

    // Simulated progress steps for user feedback
    const steps = [
      'Extracting EXIF provenance metadata...',
      'Running Haar Cascade face detection & 1.3× crop...',
      'Executing 12-Layer Vision Transformer self-attention...',
      'Running Secondary Boundary Artifact Detector...',
      'Computing Calibrated 60/40 Ensemble Fusion...',
    ];

    let stepIdx = 0;
    setScanStep(steps[0]);
    const stepInterval = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setScanStep(steps[stepIdx]);
      }
    }, 280);

    try {
      const data = await api.analyzeImage(selectedFile);
      setResult(data);
      setActiveFaceIndex(0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Inspection failed. Please verify API server status.';
      setError(msg);
    } finally {
      clearInterval(stepInterval);
      setIsScanning(false);
      setScanStep('');
    }
  };

  const activeFace: FaceResult | undefined = result?.faces?.[activeFaceIndex];

  // Download Report
  const downloadReport = () => {
    if (!result || !selectedFile) return;
    const reportData = {
      timestamp: new Date().toISOString(),
      filename: selectedFile.name,
      file_size_bytes: selectedFile.size,
      pipeline_version: 'DeepSentry v2.0 (Calibrated ViT+Secondary)',
      analysis: result,
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DeepSentry_Report_${selectedFile.name.replace(/\.[^/.]+$/, '')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          AI Forensics Verification Studio
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          Upload any portrait image to execute dual-model forensic analysis, multi-face bounding, and attention heatmap explainability.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="max-w-3xl mx-auto p-4 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-200 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Main Upload & Preview Area */}
      {!result && (
        <div className="max-w-3xl mx-auto space-y-6">
          {isWebcamActive ? (
            /* Webcam Capture Box */
            <div className="glass-panel p-6 rounded-3xl border border-indigo-500/40 text-center space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video flex items-center justify-center border border-slate-800">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 px-2 py-1 rounded bg-rose-600/90 text-white text-[11px] font-mono flex items-center gap-1.5 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-white" /> LIVE SENTRY INTAKE
                </div>
              </div>
              <div className="flex justify-center gap-3">
                <button
                  onClick={captureWebcamSnapshot}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-indigo-600/30"
                >
                  <Camera className="w-4 h-4" /> Capture Snapshot
                </button>
                <button
                  onClick={stopWebcam}
                  className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* Drag & Drop Upload Zone */
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className={`glass-panel p-8 sm:p-12 rounded-3xl border-2 border-dashed transition-all duration-300 text-center space-y-5 ${
                selectedFile
                  ? 'border-indigo-500/60 bg-indigo-950/10'
                  : 'border-slate-800 hover:border-indigo-500/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                className="hidden"
              />

              {previewUrl ? (
                <div className="space-y-4">
                  <div className="relative max-w-sm mx-auto rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-950">
                    <img src={previewUrl} alt="Preview" className="w-full h-auto max-h-72 object-contain" />
                    {isScanning && (
                      <div className="absolute inset-0 bg-indigo-950/70 backdrop-blur-xs flex flex-col items-center justify-center space-y-3 p-4">
                        <div className="w-12 h-12 rounded-full border-4 border-indigo-400 border-t-transparent animate-spin" />
                        <span className="text-xs font-mono text-indigo-200 text-center">{scanStep}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-slate-400 font-mono">
                    {selectedFile?.name} ({formatBytes(selectedFile?.size || 0)})
                  </div>

                  <div className="flex flex-wrap justify-center gap-3 pt-2">
                    <button
                      onClick={runAnalysis}
                      disabled={isScanning}
                      className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 hover:scale-[1.02] disabled:opacity-50 transition-all cursor-pointer"
                    >
                      {isScanning ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Executing Forensics...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Start Forensic Analysis</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                      disabled={isScanning}
                      className="px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
                    >
                      Change Image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 mx-auto flex items-center justify-center">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Upload Face Media for Analysis</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Drag & drop your JPEG, PNG, or WEBP image here, or click to browse.
                    </p>
                  </div>
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all"
                    >
                      Select File
                    </button>
                    <button
                      onClick={startWebcam}
                      className="px-4 py-2.5 rounded-xl glass-card hover:bg-slate-800 text-slate-300 text-sm font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Camera className="w-4 h-4 text-indigo-400" /> Use Webcam
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">Max file size: 10 MB • 100% Private Client Transfer</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Forensic Results View */}
      {result && (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Top Verdict Banner */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl ${
              result.final_verdict === 'FAKE'
                ? 'bg-gradient-to-r from-rose-950/80 via-slate-900 to-rose-950/40 border-rose-500/40 glow-rose'
                : 'bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/40 border-emerald-500/40 glow-emerald'
            }`}
          >
            <div className="flex items-center gap-5 text-center md:text-left">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center p-3.5 border ${
                  result.final_verdict === 'FAKE'
                    ? 'bg-rose-600/20 border-rose-500/50 text-rose-400'
                    : 'bg-emerald-600/20 border-emerald-500/50 text-emerald-400'
                }`}
              >
                {result.final_verdict === 'FAKE' ? (
                  <ShieldAlert className="w-full h-full" />
                ) : (
                  <ShieldCheck className="w-full h-full" />
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-1">
                  <span
                    className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                      result.final_verdict === 'FAKE' ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {result.final_verdict === 'FAKE' ? 'SYNTHETIC / DEEPFAKE DETECTED' : 'AUTHENTIC REAL MEDIA'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-slate-900/80 border border-slate-700 text-slate-300">
                    {formatConfidence(result.confidence)} Certainty
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  {result.final_verdict === 'FAKE'
                    ? 'The calibrated dual-model ensemble detected high-confidence synthetic facial generator artifacts across token patches.'
                    : 'The facial features and frequency boundaries conform to natural camera photography distributions.'}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={downloadReport}
                className="px-4 py-2.5 rounded-xl glass-card hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-700"
              >
                <Download className="w-4 h-4 text-indigo-400" /> Export JSON
              </button>
              <button
                onClick={() => {
                  setResult(null);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-lg shadow-indigo-600/30"
              >
                Inspect New Image
              </button>
            </div>
          </div>

          {/* Multi-Face Selector Bar (if > 1 face) */}
          {result.faces_detected > 1 && (
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Detected Faces ({result.faces_detected}):</span>
              </div>
              <div className="flex items-center gap-2">
                {result.faces.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveFaceIndex(i)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                      activeFaceIndex === i
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    Face #{f.face_index + 1} ({f.verdict})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Forensic Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Col: Original Media with Bounding Box & EXIF */}
            <div className="lg:col-span-5 space-y-6">
              {/* Media Card */}
              <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-indigo-400" /> Uploaded Media Inspection
                </h4>
                <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center min-h-[260px]">
                  {previewUrl && (
                    <img src={previewUrl} alt="Inspection" className="max-h-80 w-auto object-contain rounded-lg" />
                  )}
                </div>
                <div className="flex justify-between text-xs font-mono text-slate-400 pt-1">
                  <span>Faces Detected: {result.faces_detected}</span>
                  <span>Processing Time: {result.processing_time_ms}ms</span>
                </div>
              </div>

              {/* EXIF Card */}
              <ExifForensicsCard metadata={result.metadata} />
            </div>

            {/* Right Col: Attention Heatmap & Ensemble Gauge */}
            <div className="lg:col-span-7 space-y-6">
              {activeFace ? (
                <>
                  <EnsembleGauge face={activeFace} />
                  <AttentionHeatmapViewer face={activeFace} />
                </>
              ) : (
                <div className="glass-card p-12 rounded-2xl text-center text-slate-500 font-mono text-sm">
                  No face crops available.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
