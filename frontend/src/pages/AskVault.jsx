import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VoiceInput } from '../components/VoiceInput';
import { ConfidenceBadge } from '../components/ConfidenceBadge';
import { ConflictAlert } from '../components/ConflictAlert';
import { FreshnessAlert } from '../components/FreshnessAlert';
import { ActionChecklist } from '../components/ActionChecklist';
import { EvidenceTraceModal } from '../components/EvidenceTraceModal';
import { 
  Search, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  FileText,
  HelpCircle,
  ExternalLink,
  RotateCw
} from 'lucide-react';

export const AskVault = () => {
  const { language, role, showToast, t } = useApp();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('answer'); // 'answer', 'trace', 'checklist'

  const sampleQueries = [
    {
      label: "PMAY-U 2.0 (Judge Flow 1)",
      text: "What documents do I need for PM Awas Yojana and what is the income limit?"
    },
    {
      label: "Scholarship Conflict (Judge Flow 2)",
      text: "What is the deadline for the scholarship application?"
    },
    {
      label: "ONORC Superseded (Judge Flow 3)",
      text: "Can I use manual migration slips for One Nation One Ration Card?"
    },
    {
      label: "Senior 70+ Health Cover",
      text: "Who is eligible for the 70+ Ayushman Bharat health scheme?"
    }
  ];

  const handleSearch = async (queryText = query) => {
    const q = queryText.trim();
    if (!q) {
      showToast("Please enter or dictate a question first.", "warning");
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          language: language,
          user_role: role
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      setResponse(data);
      setActiveSubTab('answer');
    } catch (err) {
      console.error(err);
      showToast("Failed to connect to Justice Vault intelligence gateway.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (text) => {
    setQuery(text);
    handleSearch(text);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full">
          Grounded Public Intelligence Query Interface
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0b1e36] tracking-tight mt-3">
          Ask Justice Vault
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Submit any public service inquiry. Justice Vault verifies official gazettes and orders before answering.
        </p>
      </div>

      {/* Query Input Box */}
      <div className="bg-white border border-slate-300 rounded-2xl p-4 sm:p-5 shadow-sm focus-within:border-cyan-600 focus-within:ring-2 focus-within:ring-cyan-500/20 transition">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.ask.inputPlaceholder}
              className="w-full text-slate-900 placeholder:text-slate-400 text-sm sm:text-base focus:outline-none bg-transparent"
            />
            {/* Real Web Speech Voice Input */}
            <VoiceInput onSpeechResult={(transcript) => {
              setQuery(transcript);
              handleSearch(transcript);
            }} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="text-[11px] text-slate-400 font-mono">
              Role: <span className="text-slate-700 font-semibold uppercase">{role}</span> | Mode: <span className="text-slate-700 font-semibold uppercase">{language}</span>
            </div>

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="inline-flex items-center space-x-2 bg-[#0b1e36] hover:bg-[#162e4e] text-white px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RotateCw className="w-4 h-4 text-cyan-400 animate-spin" />
                  <span>{t.ask.processing}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>{t.ask.btnSubmit}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Preset Judge Demo Chips */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          {t.ask.sampleQueries}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {sampleQueries.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(chip.text)}
              className="text-left p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-cyan-400 transition text-xs flex flex-col justify-between group shadow-3xs"
            >
              <span className="font-bold text-cyan-800 text-[11px] mb-0.5 group-hover:text-cyan-600">
                {chip.label}
              </span>
              <span className="text-slate-700 line-clamp-1">
                "{chip.text}"
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-4 animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-1/4" />
          <div className="h-6 bg-slate-200 rounded w-3/4" />
          <div className="space-y-2 pt-4">
            <div className="h-3 bg-slate-200 rounded w-full" />
            <div className="h-3 bg-slate-200 rounded w-5/6" />
            <div className="h-3 bg-slate-200 rounded w-2/3" />
          </div>
        </div>
      )}

      {/* Query Result Section */}
      {response && !loading && (
        <div className="space-y-6">
          {/* Main Verified Result Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            {/* Top Bar: Confidence & Evidence Status */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <ConfidenceBadge 
                confidence={response.confidence} 
                score={response.confidence_score} 
              />

              <div className="flex flex-wrap gap-2 text-xs">
                <span className={`badge-evidence ${response.evidence_status.source_verified ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>
                  ✓ {t.results.sourceVerified}
                </span>
                <span className={`badge-evidence ${response.evidence_status.freshness_checked ? 'bg-sky-50 text-sky-800 border-sky-200' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>
                  ✓ {t.results.freshnessChecked}
                </span>
                <span className={`badge-evidence ${response.evidence_status.no_conflict_detected ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>
                  {response.evidence_status.no_conflict_detected ? '✓ No conflict' : '⚠ Conflict Intercepted'}
                </span>
                <span className="badge-evidence bg-slate-50 text-slate-700 border-slate-200 font-mono">
                  {response.processing_time_ms} ms
                </span>
              </div>
            </div>

            {/* Intercept Warnings (Conflict or Freshness) */}
            <div className="mt-4">
              <ConflictAlert conflict={response.conflict} />
              <FreshnessAlert freshness={response.freshness} />
            </div>

            {/* Grounded Plain-Language Answer */}
            <div className="my-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                {t.results.verifiedGuidance}
              </h3>
              <div className="text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line font-medium bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                {response.plain_language_answer}
              </div>
            </div>

            {/* Consulted Official Sources Tags */}
            {response.sources_consulted && response.sources_consulted.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Official Gazette References Consulted
                </span>
                <div className="flex flex-wrap gap-2">
                  {response.sources_consulted.map((s, idx) => (
                    <a
                      key={idx}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1 rounded-md text-xs font-mono transition"
                    >
                      <span>{s.id} (v{s.version})</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sub-Tabs: Action Checklist & Evidence Trace */}
          <div className="flex border-b border-slate-200 space-x-4">
            {response.action_checklist && (
              <button
                onClick={() => setActiveSubTab('checklist')}
                className={`pb-3 text-sm font-bold border-b-2 transition flex items-center space-x-1.5 ${
                  activeSubTab === 'checklist'
                    ? 'border-teal-600 text-teal-800'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <span>Deterministic Action Checklist</span>
                <span className="bg-teal-100 text-teal-800 text-[11px] px-1.5 py-0.2 rounded-full font-mono">
                  {response.action_checklist.steps?.length || 0}
                </span>
              </button>
            )}

            {response.claims && response.claims.length > 0 && (
              <button
                onClick={() => setActiveSubTab('trace')}
                className={`pb-3 text-sm font-bold border-b-2 transition flex items-center space-x-1.5 ${
                  activeSubTab === 'trace'
                    ? 'border-cyan-600 text-cyan-800'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <span>Evidence Trace & Claims</span>
                <span className="bg-cyan-100 text-cyan-800 text-[11px] px-1.5 py-0.2 rounded-full font-mono">
                  {response.claims.length}
                </span>
              </button>
            )}
          </div>

          {/* Sub-Tab Content */}
          {activeSubTab === 'checklist' && response.action_checklist && (
            <ActionChecklist checklist={response.action_checklist} />
          )}

          {activeSubTab === 'trace' && response.claims && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <EvidenceTraceModal claims={response.claims} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
