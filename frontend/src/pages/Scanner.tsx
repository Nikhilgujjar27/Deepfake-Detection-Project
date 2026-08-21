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
  RotateCcw
} from 'lucide-react';
import { api, getErrorMessage } from '../lib/api';
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

    const steps = [
      'Extracting EXIF provenance metadata...',
      'Detecting faces with 1.3× standardized margin...',
      'Executing 12-layer Vision Transformer self-attention...',
      'Scanning high-frequency boundary artifacts...',
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
      setError(getErrorMessage(err, 'Inspection failed. Please verify API server status.'));
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
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Visual Forensics Verification Studio
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Upload any facial image or selfie to execute dual-model forensic analysis, multi-face bounding, and self-attention heatmaps.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="max-w-2xl mx-auto p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Main Upload & Preview Area */}
      {!result && (
        <div className="max-w-2xl mx-auto space-y-6">
          {isWebcamActive ? (
            /* Webcam Capture Box */
            <div className="saas-card p-6 border border-slate-200 bg-white rounded-xl text-center space-y-4 shadow-sm">
              <div className="relative rounded-lg overflow-hidden bg-slate-900 aspect-video flex items-center justify-center border border-slate-200">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-blue-600 text-white text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> Live Camera Stream
                </div>
              </div>
              <div className="flex justify-center gap-3">
                <button
                  onClick={captureWebcamSnapshot}
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Camera className="w-4 h-4" /> Capture Photo
                </button>
                <button
                  onClick={stopWebcam}
                  className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm transition-colors"
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
              className={`p-8 sm:p-12 rounded-xl border-2 border-dashed transition-colors text-center space-y-5 ${
                selectedFile
                  ? 'border-blue-500 bg-blue-50/40'
                  : 'border-slate-300 bg-white hover:border-slate-400'
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
                  <div className="relative max-w-sm mx-auto rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-slate-900">
                    <img src={previewUrl} alt="Preview" className="w-full h-auto max-h-72 object-contain" />
                    {isScanning && (
                      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center space-y-3 p-4">
                        <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
                        <span className="text-xs font-medium text-slate-200 text-center">{scanStep}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-slate-500 font-medium">
                    {selectedFile?.name} ({formatBytes(selectedFile?.size || 0)})
                  </div>

                  <div className="flex flex-wrap justify-center gap-3 pt-2">
                    <button
                      onClick={runAnalysis}
                      disabled={isScanning}
                      className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs flex items-center gap-2 disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      {isScanning ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Scanning Media...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Run Forensic Analysis</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                      disabled={isScanning}
                      className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors"
                    >
                      Change Image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 mx-auto flex items-center justify-center">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">Upload Image for Forensics</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Drag & drop your JPEG, PNG, or WEBP file here, or browse from your device.
                    </p>
                  </div>
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-xs transition-colors cursor-pointer"
                    >
                      Select Image
                    </button>
                    <button
                      onClick={startWebcam}
                      className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-slate-500" /> Use Webcam
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">Supported formats: JPEG, PNG, WEBP • Max 10 MB</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Forensic Results View */}
      {result && (
        <div className="space-y-6">
          {/* Top Verdict Banner */}
          <div
            className={`p-6 sm:p-7 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs ${
              result.final_verdict === 'FAKE'
                ? 'bg-rose-50/80 border-rose-200'
                : 'bg-emerald-50/80 border-emerald-200'
            }`}
          >
            <div className="flex items-center gap-4 text-center md:text-left">
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center p-3 border ${
                  result.final_verdict === 'FAKE'
                    ? 'bg-rose-100 border-rose-200 text-rose-700'
                    : 'bg-emerald-100 border-emerald-200 text-emerald-700'
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
                    className={`text-xl sm:text-2xl font-bold tracking-tight ${
                      result.final_verdict === 'FAKE' ? 'text-rose-900' : 'text-emerald-900'
                    }`}
                  >
                    {result.final_verdict === 'FAKE' ? 'SYNTHETIC / DEEPFAKE DETECTED' : 'AUTHENTIC REAL MEDIA'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-800 shadow-xs">
                    {formatConfidence(result.confidence)} Certainty
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                  {result.final_verdict === 'FAKE'
                    ? 'The calibrated dual-model ensemble detected high-confidence synthetic facial generator artifacts across token patches.'
                    : 'The facial features and frequency boundaries conform to natural camera photography distributions.'}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <button
                onClick={downloadReport}
                className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" /> Export JSON
              </button>
              <button
                onClick={() => {
                  setResult(null);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Inspect New Image
              </button>
            </div>
          </div>

          {/* Multi-Face Selector Bar (if > 1 face) */}
          {result.faces_detected > 1 && (
            <div className="saas-card p-3.5 border border-slate-200 bg-white rounded-xl flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Detected Faces ({result.faces_detected}):</span>
              </div>
              <div className="flex items-center gap-2">
                {result.faces.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveFaceIndex(i)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                      activeFaceIndex === i
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
              <div className="saas-card-flat p-5 border border-slate-200 bg-white rounded-xl space-y-3">
                <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-600" /> Image Source Inspection
                </h4>
                <div className="relative rounded-lg overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center min-h-[240px]">
                  {previewUrl && (
                    <img src={previewUrl} alt="Inspection" className="max-h-72 w-auto object-contain rounded" />
                  )}
                </div>
                <div className="flex justify-between text-xs font-medium text-slate-500 pt-1">
                  <span>Faces Detected: {result.faces_detected}</span>
                  <span>Processing Time: {result.processing_time_ms.toFixed(0)} ms</span>
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
                <div className="saas-card-flat p-12 text-center text-slate-400 text-sm">
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
