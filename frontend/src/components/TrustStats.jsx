import React, { useState, useEffect } from 'react';
import { ShieldCheck, Database, CheckCircle2, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TrustStats = () => {
  const { t } = useApp();
  const [docCount, setDocCount] = useState(null);
  const [groundedRate, setGroundedRate] = useState(null);
  const [auditChainStatus, setAuditChainStatus] = useState("VERIFYING");

  useEffect(() => {
    // Fetch live system health
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (data.documents_indexed !== undefined) {
          setDocCount(data.documents_indexed);
        }
        if (data.audit_chain_intact !== undefined) {
          setAuditChainStatus(data.audit_chain_intact ? "ACTIVE (CHAIN INTACT)" : "TAMPER ALERT");
        }
      })
      .catch(() => {});

    // Fetch live benchmark metrics
    fetch('/api/benchmark')
      .then(res => res.json())
      .then(metrics => {
        const gm = metrics.find(m => m.metric_name === "Grounded Claim Rate");
        if (gm && gm.actual) {
          setGroundedRate(gm.actual);
        }
      })
      .catch(() => {});
  }, []);

  const stats = [
    {
      icon: ShieldCheck,
      value: docCount !== null ? `${docCount} Standards` : "Loading...",
      label: t.trustStats.sourcesVerified,
      detail: "GoI Gazette, MoHUA, NHA, MeitY Standards",
      color: "text-emerald-600 bg-emerald-50 border-emerald-200"
    },
    {
      icon: Database,
      value: docCount !== null ? `${docCount} Documents` : "Loading...",
      label: t.trustStats.documentsIndexed,
      detail: "SHA-256 Fingerprinted & Passaged",
      color: "text-cyan-600 bg-cyan-50 border-cyan-200"
    },
    {
      icon: CheckCircle2,
      value: groundedRate || "Evaluating...",
      label: t.trustStats.claimsGrounded,
      detail: "Empirically Tested Factual Grounding",
      color: "text-teal-600 bg-teal-50 border-teal-200"
    },
    {
      icon: Lock,
      value: auditChainStatus,
      label: t.trustStats.safetyStatus,
      detail: "Hash-Chained Cryptographic Audit Gate",
      color: "text-indigo-600 bg-indigo-50 border-indigo-200"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div 
            key={idx}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:shadow-xs transition"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {item.label}
              </span>
              <div className={`p-2 rounded-lg border ${item.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 font-sans tracking-tight">
              {item.value}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              {item.detail}
            </p>
          </div>
        );
      })}
    </div>
  );
};
