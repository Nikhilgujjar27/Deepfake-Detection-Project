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
  Eye,
  RotateCcw,
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import { api, getErrorMessage } from '../lib/api';
import type { PredictionResponse, FaceResult } from '../types';
import { AttentionHeatmapViewer } from '../components/AttentionHeatmapViewer';
import { EnsembleGauge } from '../components/EnsembleGauge';
import { ExifForensicsCard } from '../components/ExifForensicsCard';
import { formatBytes } from '../lib/utils';
import { useAnimatedCount } from '../hooks/useAnimatedCount';

export const Scanner: React.FC = () => {
  // State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeFaceIndex, setActiveFaceIndex] = useState<number>(0);
  const [isWebcamActive, setIsWebcamActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Animated confidence score counter when result arrives
  const targetConfidence = result?.confidence ?? 0;
  const animatedConfidence = useAnimatedCount(targetConfidence, 900, 1, Boolean(result));

  const STAGES = [
    { title: 'STAGE 1: Media Ingestion & EXIF Provenance', desc: 'Decoding raw image tensor and extracting camera sensor provenance metadata...' },
    { title: 'STAGE 2: Face Extraction & 1.3× Bounding', desc: 'Isolating facial bounding box with standardized geometric margin...' },
    { title: 'STAGE 3: ViT-B/16 Multi-Head Self-Attention', desc: 'Processing 196 patch tokens across 12 Vision Transformer layers...' },
    { title: 'STAGE 4: Secondary Boundary Artifact Scan', desc: 'Evaluating high-frequency micro-texture edge anomalies...' },
    { title: 'STAGE 5: Calibrated 60/40 Ensemble Fusion', desc: 'Computing weighted probability consensus against decision boundary τ = 0.60...' },
  ];

  // File Handlers
  const handleFileChange = (file: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
      setError('Unsupported file format. Please upload a JPEG, PNG, or WEBP image.');
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

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
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
      setError('Unable to access webcam. Please ensure camera permissions are granted in your browser.');
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
    setCurrentStepIdx(0);

    const stepInterval = setInterval(() => {
      setCurrentStepIdx((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 320);

    try {
      const data = await api.analyzeImage(selectedFile);
      setResult(data);
      setActiveFaceIndex(0);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Inspection failed. Please verify API server status.'));
    } finally {
      clearInterval(stepInterval);
      setIsScanning(false);
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
      pipeline_version: 'DeepSentry v2.0 (Calibrated ViT-Base 60% + Secondary 40%)',
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
      {/* Page Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Visual Forensics Studio
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
          Upload any portrait image or mobile selfie to execute dual-model forensic consensus, 1.3× geometric extraction, and attention heatmap rollout.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="max-w-3xl mx-auto p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Main Upload & Multi-Stage Processing Zone */}
      {!result && (
        <div className="max-w-3xl mx-auto space-y-6">
          {isWebcamActive ? (
            /* Webcam Capture Box */
            <div className="forensic-card p-6 border border-slate-200 bg-white rounded-2xl text-center space-y-5 shadow-sm">
              <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-video flex items-center justify-center border border-slate-800">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-md bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> Live Camera Stream
                </div>
              </div>
              <div className="flex justify-center gap-3">
                <button
                  onClick={captureWebcamSnapshot}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4" /> Capture Photo
                </button>
                <button
                  onClick={stopWebcam}
                  className="px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* Drag & Drop Upload Zone */
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`p-8 sm:p-12 rounded-2xl border-2 border-dashed transition-all duration-200 text-center space-y-5 bg-white ${
                isDragging
                  ? 'border-blue-600 bg-blue-50/50 scale-[1.01]'
                  : selectedFile
                  ? 'border-blue-400 bg-blue-50/20'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                className="hidden"
              />

              {previewUrl ? (
                <div className="space-y-5">
                  <div className="relative max-w-sm mx-auto rounded-xl overflow-hidden border border-slate-200 shadow-md bg-slate-900">
                    <img src={previewUrl} alt="Preview" className="w-full h-auto max-h-80 object-contain" />
                    
                    {/* Visual Inspection Sequence during processing */}
                    {isScanning && (
                      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col justify-center p-6 space-y-3 text-left">
                        <div className="flex items-center gap-2 text-white font-bold text-sm">
                          <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                          <span>Forensic Pipeline Executing...</span>
                        </div>
                        <div className="space-y-2 pt-2">
                          {STAGES.map((stage, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs">
                              {idx < currentStepIdx ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                              ) : idx === currentStepIdx ? (
                                <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-400 border-t-transparent animate-spin flex-shrink-0 mt-0.5" />
                              ) : (
                                <div className="w-3.5 h-3.5 rounded-full border border-slate-700 flex-shrink-0 mt-0.5" />
                              )}
                              <span className={idx === currentStepIdx ? 'text-white font-bold' : idx < currentStepIdx ? 'text-slate-300' : 'text-slate-600'}>
                                {stage.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-xs font-semibold text-slate-600">
                    {selectedFile?.name} ({formatBytes(selectedFile?.size || 0)})
                  </div>

                  <div className="flex flex-wrap justify-center gap-3 pt-1">
                    <button
                      onClick={runAnalysis}
                      disabled={isScanning}
                      className="px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-xs flex items-center gap-2 disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      {isScanning ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Processing Forensics...</span>
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
                      className="px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors cursor-pointer"
                    >
                      Change Image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 mx-auto flex items-center justify-center shadow-xs">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900">
                      {isDragging ? 'Drop image to begin forensic analysis' : 'Upload Facial Media for Forensics'}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Drag and drop your image here, or select a file from your device.
                    </p>
                  </div>
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      Select File
                    </button>
                    <button
                      onClick={startWebcam}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Camera className="w-4 h-4 text-slate-500" /> Use Webcam
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">
                    JPEG • PNG • WEBP • Max 10 MB • 100% Private Client Transfer
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Forensic Result Command Center */}
      {result && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Top Verdict Command Banner */}
          <div
            className={`p-6 sm:p-8 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm ${
              result.final_verdict === 'FAKE'
                ? 'bg-rose-50/90 border-rose-200 text-rose-950'
                : 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
            }`}
          >
            <div className="flex items-center gap-5 text-center md:text-left">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center p-3.5 border shadow-xs ${
                  result.final_verdict === 'FAKE'
                    ? 'bg-rose-100 border-rose-300 text-rose-700'
                    : 'bg-emerald-100 border-emerald-300 text-emerald-700'
                }`}
              >
                {result.final_verdict === 'FAKE' ? (
                  <ShieldAlert className="w-full h-full" />
                ) : (
                  <ShieldCheck className="w-full h-full" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <span
                    className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                      result.final_verdict === 'FAKE' ? 'text-rose-900' : 'text-emerald-900'
                    }`}
                  >
                    {result.final_verdict === 'FAKE' ? 'SYNTHETIC / DEEPFAKE DETECTED' : 'AUTHENTIC REAL MEDIA'}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-800 shadow-xs">
                    {animatedConfidence}% Confidence
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  {result.final_verdict === 'FAKE'
                    ? 'The calibrated dual-model ensemble identified high-confidence synthetic facial synthesis artifacts across patch tokens.'
                    : 'The facial geometry, token self-attention, and frequency boundaries conform to natural camera photography distributions.'}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={downloadReport}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-slate-500" /> Export JSON
              </button>
              <button
                onClick={() => {
                  setResult(null);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Inspect New Image
              </button>
            </div>
          </div>

          {/* Multi-Face Selector Tabs (if > 1 face) */}
          {result.faces_detected > 1 && (
            <div className="forensic-card p-4 border border-slate-200 bg-white rounded-xl flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Detected Faces ({result.faces_detected}):</span>
              </div>
              <div className="flex items-center gap-2">
                {result.faces.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveFaceIndex(i)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      activeFaceIndex === i
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Face #{f.face_index + 1} ({f.verdict})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Forensic Command Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Image Source & EXIF Metadata */}
            <div className="lg:col-span-5 space-y-6">
              {/* Media Card */}
              <div className="forensic-card p-6 border border-slate-200 bg-white rounded-xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-600" /> Image Source Inspection
                  </h4>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    1.3× Standardized Crop
                  </span>
                </div>
                <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-200 flex items-center justify-center min-h-[260px] p-2">
                  {previewUrl && (
                    <img src={previewUrl} alt="Inspection Source" className="max-h-80 w-auto object-contain rounded" />
                  )}
                  {activeFace && (
                    <div className="absolute top-4 left-4 bg-blue-600 text-white text-[11px] font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                      <Maximize2 className="w-3 h-3" /> Face #{activeFace.face_index + 1} Region
                    </div>
                  )}
                </div>
                <div className="flex justify-between text-xs font-semibold text-slate-500 pt-1">
                  <span>Faces Detected: {result.faces_detected}</span>
                  <span>Processing Time: {result.processing_time_ms.toFixed(0)} ms</span>
                </div>
              </div>

              {/* EXIF Card */}
              <ExifForensicsCard metadata={result.metadata} />
            </div>

            {/* Right Column: Model Consensus & Attention Heatmap */}
            <div className="lg:col-span-7 space-y-6">
              {activeFace ? (
                <>
                  <EnsembleGauge face={activeFace} />
                  <AttentionHeatmapViewer face={activeFace} />
                </>
              ) : (
                <div className="forensic-card p-12 text-center text-slate-400 text-sm">
                  No facial bounding data available.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
