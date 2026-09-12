import React from 'react';
import { History, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export const FreshnessAlert = ({ freshness }) => {
  if (!freshness || !freshness.is_outdated) return null;

  return (
    <div className="bg-sky-50/80 border-2 border-sky-400 rounded-xl p-5 shadow-sm mb-6">
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <History className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-bold tracking-wider text-sky-900 uppercase bg-sky-200/60 px-2 py-0.5 rounded">
            Version Governance Gate
          </span>
          <h3 className="text-base font-bold text-sky-950 mt-0.5">
            OLDER VERSION DETECTED • SUPERSEDED DIRECTIVE IDENTIFIED
          </h3>
        </div>
      </div>

      <div className="space-y-3 text-xs text-sky-950 mb-3">
        <div className="bg-white border border-sky-200 p-3 rounded-lg flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-800">Legacy Reference ({freshness.superseded_doc_id}): </span>
            <span className="text-slate-600">{freshness.notice}</span>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-lg flex items-start space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-emerald-950">Active Standard ({freshness.current_doc_id}): </span>
            <span className="text-emerald-800">{freshness.recommended_action}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
