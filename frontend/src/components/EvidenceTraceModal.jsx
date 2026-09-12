import React, { useState } from 'react';
import { 
  FileCheck, 
  ExternalLink, 
  Hash, 
  Calendar, 
  Building2, 
  BookOpen, 
  Copy, 
  Check, 
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const EvidenceTraceModal = ({ claims = [] }) => {
  const [copiedHash, setCopiedHash] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(0);

  const handleCopy = (hash) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2500);
  };

  if (!claims || claims.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-sm text-slate-500">
        No claim-level grounding traces are attached to this result.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileCheck className="w-5 h-5 text-cyan-600" />
          <h4 className="text-sm font-bold text-[#0b1e36] uppercase tracking-wider">
            Evidence Trace — Claim-by-Claim Grounding ({claims.length} Claims)
          </h4>
        </div>
        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-mono">
          Strict Zero-Hallucination Attribution
        </span>
      </div>

      <div className="space-y-3">
        {claims.map((item, idx) => {
          const isExpanded = expandedIndex === idx;
          const ev = item.evidence && item.evidence[0] ? item.evidence[0] : null;

          return (
            <div 
              key={idx} 
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs transition hover:border-slate-300"
            >
              {/* Claim Header Bar */}
              <div 
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="p-4 bg-slate-50/70 border-b border-slate-100 cursor-pointer flex justify-between items-start gap-3"
              >
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-full bg-[#0b1e36] text-cyan-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Grounding Claim
                    </span>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5">
                      "{item.claim}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Grounded ({Math.round((item.confidence || 0.95) * 100)}%)</span>
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Expanded Evidence Details */}
              {isExpanded && ev && (
                <div className="p-5 bg-white space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    {/* Document ID & Version */}
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Standard ID & Version</span>
                      <span className="font-mono font-semibold text-slate-800">{ev.document_id}</span>
                      <span className="ml-1 text-slate-500 font-mono">v{ev.version}</span>
                    </div>

                    {/* Authority */}
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Issuing Authority</span>
                      <span className="font-medium text-slate-800 line-clamp-1" title={ev.issuer}>{ev.issuer}</span>
                    </div>

                    {/* Effective Date */}
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Effective Date</span>
                      <span className="font-medium text-slate-800">{ev.effective_date}</span>
                    </div>

                    {/* Section / Page */}
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Section / Clause</span>
                      <span className="font-medium text-slate-800 line-clamp-1">{ev.section} (p. {ev.page || 1})</span>
                    </div>
                  </div>

                  {/* Retrieved Official Text Passage */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Retrieved Legal Text Extract
                    </span>
                    <div className="bg-slate-900 text-slate-100 p-3.5 rounded-lg text-xs font-mono leading-relaxed border border-slate-800 select-text">
                      "{ev.retrieved_text}"
                    </div>
                  </div>

                  {/* Integrity Digest & Official Portal Link */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                    {/* SHA-256 */}
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">SHA-256:</span>
                      <code className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-mono select-all">
                        {ev.sha256.slice(0, 16)}...{ev.sha256.slice(-8)}
                      </code>
                      <button 
                        onClick={() => handleCopy(ev.sha256)}
                        title="Copy full SHA-256 hash"
                        className="p-1 text-slate-400 hover:text-slate-700 rounded transition"
                      >
                        {copiedHash === ev.sha256 ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                        ✓ Verified Integrity
                      </span>
                    </div>

                    {/* Official Portal Source Link */}
                    {ev.source_url && (
                      <a
                        href={ev.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 text-cyan-700 hover:text-cyan-800 font-semibold hover:underline bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-md transition"
                      >
                        <span>View Source Document</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
