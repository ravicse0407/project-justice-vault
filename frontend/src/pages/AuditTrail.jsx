import React, { useState, useEffect } from 'react';
import { 
  History, 
  ShieldCheck, 
  RotateCw, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink,
  User,
  Filter,
  Link,
  Copy,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuditTrail = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [filterType, setFilterType] = useState('ALL');
  const [copiedHash, setCopiedHash] = useState(null);
  const { showToast } = useApp();

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let url = '/api/audit?';
      if (filterType !== 'ALL') {
        url += `event_type=${filterType}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error(err);
      showToast("Error loading audit trail.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filterType]);

  const verifyHashChain = async () => {
    setVerifying(true);
    setVerifyResult(null);
    try {
      const res = await fetch('/api/audit/verify', { method: 'POST' });
      const data = await res.json();
      setVerifyResult(data);
      if (data.is_valid) {
        showToast(`Cryptographic Audit Chain Intact: ${data.verified_blocks} blocks verified!`, "success");
      } else {
        showToast("Chain verification alert: integrity mismatch detected.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error executing audit chain verification.", "error");
    } finally {
      setVerifying(false);
    }
  };

  const handleCopy = (hash) => {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2500);
  };

  const eventTypes = [
    'ALL',
    'CITIZEN_QUERY_PROCESSED',
    'DOCUMENT_UPLOAD_AND_INDEX',
    'OFFICIAL_ROUTE_CONFIRMED',
    'VAULT_INITIALIZATION'
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full">
            Tamper-Evident Hash-Chained Accountability Log
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0b1e36] tracking-tight mt-2">
            Audit Trail & Ledger
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Cryptographically linked stream of citizen inquiries, retrieved legal standards, conflict alerts, and confirmed official portal redirects.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={verifyHashChain}
            disabled={verifying}
            className="inline-flex items-center space-x-1.5 bg-[#0b1e36] text-white hover:bg-[#162e4e] px-4 py-2 rounded-lg text-xs font-bold transition shadow-xs disabled:opacity-50"
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${verifying ? 'animate-spin' : ''}`} />
            <span>{verifying ? "Verifying Blocks..." : "Verify Hash Chain Integrity"}</span>
          </button>

          <button
            onClick={fetchLogs}
            disabled={loading}
            className="inline-flex items-center space-x-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-lg text-xs font-bold transition shadow-3xs"
          >
            <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Verification Result Banner */}
      {verifyResult && (
        <div className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
          verifyResult.is_valid ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'
        }`}>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold block">{verifyResult.message}</span>
              <span className="font-mono text-[11px] text-slate-600">
                Latest Head Digest: {verifyResult.latest_hash?.slice(0, 32)}... (Verified at {verifyResult.verified_at})
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-200/80 font-bold text-[10px] text-emerald-900">
            CHAIN INTACT
          </span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm flex items-center space-x-3 text-xs">
        <Filter className="w-4 h-4 text-slate-400 shrink-0" />
        <span className="text-slate-500 font-semibold">Filter Event Type:</span>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-800 font-medium focus:outline-none"
        >
          {eventTypes.map((et, i) => (
            <option key={i} value={et}>{et.replace(/_/g, ' ')}</option>
          ))}
        </select>
        <span className="text-slate-400 ml-auto font-mono text-[11px]">
          {logs.length} Cryptographically Chained Blocks
        </span>
      </div>

      {/* Timeline Stream */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-500 animate-pulse">
            Fetching cryptographic audit blocks...
          </div>
        ) : logs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-500">
            No audit records matching this filter.
          </div>
        ) : (
          logs.map((record) => {
            const isRouteConfirmed = record.event_type === 'OFFICIAL_ROUTE_CONFIRMED';
            const isConflict = record.conflict_detected;

            return (
              <div
                key={record.audit_id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:border-slate-300 transition text-xs space-y-2.5"
              >
                {/* Event Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                      isRouteConfirmed 
                        ? 'bg-purple-100 text-purple-800' 
                        : isConflict 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-cyan-100 text-cyan-800'
                    }`}>
                      {record.event_type}
                    </span>

                    <span className="font-mono text-slate-500 font-semibold">
                      ID: {record.audit_id}
                    </span>
                  </div>

                  <span className="text-slate-500 font-mono">
                    {record.timestamp}
                  </span>
                </div>

                {/* User & Query Details */}
                <div className="flex flex-wrap items-center gap-3 text-slate-700">
                  <div className="flex items-center space-x-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold">{record.user_id}</span>
                    <span className="text-slate-400">({record.role})</span>
                  </div>

                  {record.query && (
                    <div className="text-slate-800 font-mono bg-slate-50 px-2.5 py-1 rounded border border-slate-100 line-clamp-1 max-w-lg">
                      "{record.query}"
                    </div>
                  )}

                  {record.confidence && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      record.confidence === 'HIGH' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                    }`}>
                      Conf: {record.confidence}
                    </span>
                  )}
                </div>

                {/* Source Citations & Details */}
                {record.retrieved_source_ids && record.retrieved_source_ids.length > 0 && (
                  <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
                    <span className="font-semibold text-slate-400">Consulted Standards:</span>
                    {record.retrieved_source_ids.map((sid, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                        {sid}
                      </span>
                    ))}
                  </div>
                )}

                {/* Cryptographic Hash Chain Lineage */}
                {record.record_hash && (
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Link className="w-3 h-3 text-cyan-600" />
                      <span>Prev: {record.previous_hash?.slice(0, 12)}...</span>
                      <span>→</span>
                      <span className="text-slate-800 font-bold">Hash: {record.record_hash?.slice(0, 16)}...</span>
                    </div>

                    <button
                      onClick={() => handleCopy(record.record_hash)}
                      className="text-slate-400 hover:text-slate-700 flex items-center space-x-1"
                    >
                      {copiedHash === record.record_hash ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>Copy Digest</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
