import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  ExternalLink, 
  Copy, 
  Check, 
  GitFork, 
  FileText, 
  AlertCircle,
  Clock,
  Layers,
  Building2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EvidenceVault = () => {
  const [documents, setDocuments] = useState([]);
  const [ruleGraph, setRuleGraph] = useState({ entities: [], relationships: [] });
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedDocId, setExpandedDocId] = useState(null);
  const [copiedHash, setCopiedHash] = useState(null);
  const [showGraphView, setShowGraphView] = useState(false);
  const { showToast } = useApp();

  useEffect(() => {
    fetchData();
  }, [statusFilter, categoryFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let url = '/api/documents?';
      if (statusFilter !== 'ALL') url += `status=${statusFilter}&`;
      if (categoryFilter !== 'ALL') url += `category=${categoryFilter}&`;
      if (searchQuery) url += `q=${encodeURIComponent(searchQuery)}&`;

      const [docsRes, graphRes] = await Promise.all([
        fetch(url),
        fetch('/api/graph')
      ]);

      const docsData = await docsRes.json();
      const graphData = await graphRes.json();

      setDocuments(docsData);
      setRuleGraph(graphData);
    } catch (err) {
      console.error(err);
      showToast("Error loading evidence documents.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (hash) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2500);
  };

  const categories = [
    'ALL',
    'Housing & Urban Development',
    'Food Security & Civil Supplies',
    'Education & Social Justice',
    'Healthcare & Social Security',
    'Digital Governance & Citizen Rights'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full">
            Verified Knowledge Repository & Rule Graph
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0b1e36] tracking-tight mt-2">
            Evidence Vault
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Authoritative Gazette Notifications, Circulars, and Relationship Graph.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowGraphView(!showGraphView)}
            className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition border ${
              showGraphView 
                ? 'bg-[#0b1e36] text-white border-[#0b1e36]' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <GitFork className="w-4 h-4" />
            <span>{showGraphView ? "Show Documents List" : "Explore Rule Graph"}</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="flex items-center space-x-2 w-full sm:w-72 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus-within:border-cyan-500">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents or sections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchData()}
            className="text-xs bg-transparent focus:outline-none w-full text-slate-800 placeholder:text-slate-400"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Status Filter */}
          <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
            <span className="text-slate-400 font-semibold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-800 font-medium focus:outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="CURRENT">Current (Active)</option>
              <option value="SUPERSEDED">Superseded</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
            <span className="text-slate-400 font-semibold">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-slate-800 font-medium focus:outline-none"
            >
              {categories.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* View 1: Rule Graph Explorer */}
      {showGraphView ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <span className="text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Lightweight Rule & Knowledge Graph
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              Public Service Entities & Inter-Document Relationships
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Extensible graph structure governing requirements, superseded circulars, and multi-authority conflicts.
            </p>
          </div>

          {/* Entities Grid */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Core Entities ({ruleGraph.entities?.length || 0})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ruleGraph.entities?.map((ent) => (
                <div key={ent.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 text-xs">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-mono font-bold text-cyan-800">{ent.id}</span>
                    <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 py-0.2 rounded font-semibold">
                      {ent.type}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-900">{ent.name}</p>
                  {ent.authority && <p className="text-slate-500 mt-0.5">Authority: {ent.authority}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Relationships Grid */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Active Graph Edges & Constraints ({ruleGraph.relationships?.length || 0})
            </h4>
            <div className="space-y-2">
              {ruleGraph.relationships?.map((rel, idx) => (
                <div key={idx} className="p-3.5 rounded-lg border border-slate-200 bg-white text-xs flex flex-wrap items-center justify-between gap-2 shadow-3xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {rel.source}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                      rel.relation === 'RULE_CONFLICTS' 
                        ? 'bg-rose-100 text-rose-800' 
                        : rel.relation === 'RULE_SUPERSEDES'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-teal-100 text-teal-800'
                    }`}>
                      —[{rel.relation}]→
                    </span>
                    <span className="font-mono font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {rel.target}
                    </span>
                  </div>

                  {rel.topic && (
                    <span className="text-slate-600 italic">
                      Topic: {rel.topic}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* View 2: Documents List */
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-500 animate-pulse">
              Loading official evidence documents...
            </div>
          ) : documents.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-500">
              No official documents matched your filters.
            </div>
          ) : (
            documents.map((doc) => {
              const isExpanded = expandedDocId === doc.id;
              const isSuperseded = doc.status === 'SUPERSEDED';

              return (
                <div 
                  key={doc.id}
                  className={`bg-white border rounded-xl overflow-hidden shadow-2xs transition ${
                    isSuperseded ? 'border-amber-300 bg-amber-50/10' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Card Header */}
                  <div 
                    onClick={() => setExpandedDocId(isExpanded ? null : doc.id)}
                    className="p-5 cursor-pointer flex flex-wrap justify-between items-start gap-4"
                  >
                    <div className="space-y-1 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                          {doc.id}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">v{doc.version}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isSuperseded 
                            ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}>
                          {doc.status}
                        </span>
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {doc.category}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 pt-1">
                        {doc.title}
                      </h3>

                      <p className="text-xs text-slate-600 flex items-center space-x-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{doc.issuer}</span>
                        <span className="text-slate-300">•</span>
                        <span>Effective: {doc.effective_date}</span>
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Sections & Integrity Details */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-4 bg-slate-50/50 text-xs">
                      <div>
                        <span className="font-bold text-slate-700 block mb-1">Executive Summary</span>
                        <p className="text-slate-600 leading-relaxed">{doc.summary}</p>
                      </div>

                      {/* Sections Extract */}
                      <div className="space-y-2">
                        <span className="font-bold text-slate-700 block">
                          Indexed Sections ({doc.sections?.length || 0})
                        </span>
                        {doc.sections?.map((sec) => (
                          <div key={sec.section_id} className="bg-white p-3 rounded-lg border border-slate-200">
                            <span className="font-bold text-cyan-800 font-mono block mb-1">
                              {sec.section_id} — {sec.title} (p. {sec.page})
                            </span>
                            <p className="text-slate-700 font-mono text-[11px] leading-relaxed">
                              "{sec.text}"
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Cryptographic SHA-256 Digest & Source URL */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-400 font-semibold">SHA-256:</span>
                          <code className="bg-slate-200/80 px-2 py-0.5 rounded font-mono text-[11px] text-slate-800">
                            {doc.sha256}
                          </code>
                          <button
                            onClick={() => handleCopy(doc.sha256)}
                            className="p-1 text-slate-500 hover:text-slate-800 transition"
                          >
                            {copiedHash === doc.sha256 ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        {doc.url && (
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-cyan-700 hover:text-cyan-900 font-semibold"
                          >
                            <span>Open Gazette Link</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
