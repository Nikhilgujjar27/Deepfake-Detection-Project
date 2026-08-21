import React from 'react';
import { Camera, Calendar, HardDrive, ShieldCheck, AlertCircle, Cpu } from 'lucide-react';
import type { ExifMetadata } from '../types';

interface Props {
  metadata: ExifMetadata;
}

export const ExifForensicsCard: React.FC<Props> = ({ metadata }) => {
  const hasExif = metadata.has_exif;

  return (
    <div className="glass-card rounded-xl p-5 border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">EXIF Header Forensics</h4>
            <p className="text-xs text-slate-400">Hardware capture metadata & provenance signals</p>
          </div>
        </div>

        {hasExif ? (
          <span className="flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-2 py-0.5 rounded">
            <ShieldCheck className="w-3.5 h-3.5" /> EXIF Present
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs font-mono text-amber-400 bg-amber-950/50 border border-amber-800/40 px-2 py-0.5 rounded">
            <AlertCircle className="w-3.5 h-3.5" /> Stripped / Synthetic
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
          <span className="text-slate-500 block mb-1 flex items-center gap-1">
            <Camera className="w-3 h-3 text-slate-400" /> Camera Device
          </span>
          <span className="text-slate-200 font-semibold truncate block">
            {metadata.camera_make || metadata.camera_model
              ? `${metadata.camera_make || ''} ${metadata.camera_model || ''}`.trim()
              : 'Unknown / Not Recorded'}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
          <span className="text-slate-500 block mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" /> Capture Date
          </span>
          <span className="text-slate-200 font-semibold truncate block">
            {metadata.datetime_original || 'No Timestamp'}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
          <span className="text-slate-500 block mb-1 flex items-center gap-1">
            <HardDrive className="w-3 h-3 text-slate-400" /> Software / Pipeline
          </span>
          <span className="text-slate-200 font-semibold truncate block">
            {metadata.software || 'Natural Camera Output'}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
          <span className="text-slate-500 block mb-1 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-slate-400" /> Sensor ISO
          </span>
          <span className="text-slate-200 font-semibold truncate block">
            {metadata.iso_speed ? `ISO ${metadata.iso_speed}` : 'N/A'}
          </span>
        </div>
      </div>

      <p className="mt-3 text-[11px] text-slate-500 leading-relaxed">
        *Note: Synthetic images generated via Midjourney, DALL-E, or StyleGAN typically lack authentic camera EXIF tags, whereas genuine mobile photos retain sensor records.
      </p>
    </div>
  );
};
