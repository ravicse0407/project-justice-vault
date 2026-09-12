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
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuditTrail = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');
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
            Tamper-Evident Accountability Log
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0b1e36] tracking-tight mt-2">
            Audit Trail & Evidence Governance Log
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Immutable log of queries, retrieved gazettes, conflict alerts, and user-confirmed portal redirects.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="inline-flex items-center space-x-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-lg text-xs font-bold transition shadow-3xs"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Audit Stream</span>
        </button>
      </div>

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
          {logs.length} Recorded Events
        </span>
      </div>

      {/* Timeline Stream */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-500 animate-pulse">
            Fetching tamper-evident audit records...
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

                    <span className="font-mono text-slate-400">
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
                    <span className="font-semibold text-slate-400">Retrieved Standards:</span>
                    {record.retrieved_source_ids.map((sid, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                        {sid}
                      </span>
                    ))}
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
