import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

export const ConfidenceBadge = ({ confidence = "HIGH", score = 0.95 }) => {
  const conf = confidence.toUpperCase();

  if (conf === "HIGH") {
    return (
      <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-xs">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>CONFIDENCE: HIGH</span>
        <span className="text-[11px] text-emerald-600 font-mono">({Math.round(score * 100)}%)</span>
      </div>
    );
  }

  if (conf === "MEDIUM") {
    return (
      <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold shadow-xs">
        <AlertTriangle className="w-4 h-4 text-amber-600" />
        <span>CONFIDENCE: MEDIUM</span>
        <span className="text-[11px] text-amber-700 font-mono">({Math.round(score * 100)}%)</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-300 text-rose-900 text-xs font-semibold shadow-xs">
      <ShieldAlert className="w-4 h-4 text-rose-600" />
      <span>CONFIDENCE: LOW (SAFETY GATE ACTIVE)</span>
      <span className="text-[11px] text-rose-600 font-mono">({Math.round(score * 100)}%)</span>
    </div>
  );
};
