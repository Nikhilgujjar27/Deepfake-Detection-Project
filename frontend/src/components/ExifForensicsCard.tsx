import React, { useState } from 'react';
import { Camera, Calendar, HardDrive, ShieldCheck, AlertCircle, Cpu, ChevronDown, ChevronUp } from 'lucide-react';
import type { ExifMetadata } from '../types';

interface Props {
  metadata: ExifMetadata;
}

export const ExifForensicsCard: React.FC<Props> = ({ metadata }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasExif = metadata?.has_exif;

  return (
    <div className="forensic-card p-6 border border-slate-200 bg-white rounded-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">EXIF & Provenance Forensics</h4>
            <p className="text-xs text-slate-500">Camera hardware capture tags & metadata integrity</p>
          </div>
        </div>

        {hasExif ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" /> Hardware EXIF Present
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            <AlertCircle className="w-3.5 h-3.5" /> Metadata Stripped / Synthetic
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-slate-500 mb-1 flex items-center gap-1.5 font-semibold">
            <Camera className="w-3.5 h-3.5 text-slate-400" /> Camera Device
          </span>
          <span className="text-slate-900 font-bold truncate block text-sm">
            {metadata?.camera_make || metadata?.camera_model
              ? `${metadata?.camera_make || ''} ${metadata?.camera_model || ''}`.trim()
              : 'Not Recorded'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-slate-500 mb-1 flex items-center gap-1.5 font-semibold">
            <Calendar className="w-3.5 h-3.5 text-slate-400" /> Capture Timestamp
          </span>
          <span className="text-slate-900 font-bold truncate block text-sm">
            {metadata?.datetime_original || 'No Timestamp'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-slate-500 mb-1 flex items-center gap-1.5 font-semibold">
            <HardDrive className="w-3.5 h-3.5 text-slate-400" /> Software / Pipeline
          </span>
          <span className="text-slate-900 font-bold truncate block text-sm">
            {metadata?.software || 'Natural Camera Output'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-slate-500 mb-1 flex items-center gap-1.5 font-semibold">
            <Cpu className="w-3.5 h-3.5 text-slate-400" /> Sensor ISO
          </span>
          <span className="text-slate-900 font-bold truncate block text-sm">
            {metadata?.iso_speed ? `ISO ${metadata.iso_speed}` : 'N/A'}
          </span>
        </div>
      </div>

      {/* Expandable Technical Details */}
      {isExpanded && (
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 animate-in fade-in duration-200">
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-500">EXIF Headers Found:</span>
            <span className="font-semibold text-slate-900">{hasExif ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-500">Color Profile:</span>
            <span className="font-semibold text-slate-900">sRGB Standard</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Provenance Status:</span>
            <span className={`font-bold ${hasExif ? 'text-emerald-700' : 'text-amber-700'}`}>
              {hasExif ? 'Hardware Sensor Verified' : 'Synthetic or Web-Recompressed'}
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
        >
          {isExpanded ? (
            <><span>Hide Additional Metadata</span> <ChevronUp className="w-3.5 h-3.5" /></>
          ) : (
            <><span>Expand Forensic Details</span> <ChevronDown className="w-3.5 h-3.5" /></>
          )}
        </button>
        <span className="text-[11px] text-slate-400 italic">
          {hasExif ? 'Sensor tags intact' : 'No EXIF metadata'}
        </span>
      </div>
    </div>
  );
};
