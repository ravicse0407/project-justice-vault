import React from 'react';
import { AlertTriangle, GitCompare, ExternalLink, ArrowRight } from 'lucide-react';

export const ConflictAlert = ({ conflict }) => {
  if (!conflict) return null;

  return (
    <div className="bg-amber-50/80 border-2 border-amber-400 rounded-xl p-5 shadow-sm mb-6">
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-bold tracking-wider text-amber-900 uppercase bg-amber-200/60 px-2 py-0.5 rounded">
            Safety Engine Intercept
          </span>
          <h3 className="text-base font-bold text-amber-950 mt-0.5">
            ⚠ CONFLICT DETECTED ACROSS OFFICIAL SOURCES
          </h3>
        </div>
      </div>

      <p className="text-sm text-amber-900 mb-4 leading-relaxed font-medium">
        {conflict.description} Justice Vault refuses to merge conflicting directives into a hallucinated consensus.
      </p>

      {/* Side-by-Side Comparator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Source A */}
        <div className="bg-white border border-amber-300 rounded-lg p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-mono">
              SOURCE A • {conflict.source_a.doc_id}
            </span>
            {conflict.source_a.deadline && (
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                Deadline: {conflict.source_a.deadline}
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-slate-800 mb-1">{conflict.source_a.issuer}</p>
          <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100 leading-relaxed font-mono">
            "{conflict.source_a.claim}"
          </p>
        </div>

        {/* Source B */}
        <div className="bg-white border border-amber-300 rounded-lg p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-mono">
              SOURCE B • {conflict.source_b.doc_id}
            </span>
            {conflict.source_b.deadline && (
              <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                Deadline: {conflict.source_b.deadline}
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-slate-800 mb-1">{conflict.source_b.issuer}</p>
          <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100 leading-relaxed font-mono">
            "{conflict.source_b.claim}"
          </p>
        </div>
      </div>

      {/* Recommended Action Guidance */}
      <div className="bg-amber-100/90 border border-amber-300 rounded-lg p-3 text-xs text-amber-950 flex items-start space-x-2">
        <ArrowRight className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Recommended Citizen Action: </span>
          <span>{conflict.recommended_action}</span>
        </div>
      </div>
    </div>
  );
};
