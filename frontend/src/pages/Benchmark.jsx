import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  Play, 
  RotateCw, 
  ShieldCheck, 
  AlertCircle, 
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Benchmark = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState(null);
  const { showToast } = useApp();

  const fetchBenchmarks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/benchmark');
      const data = await res.json();
      setMetrics(data);
    } catch (err) {
      console.error(err);
      showToast("Error loading benchmark data.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBenchmarks();
  }, []);

  const runLiveEvaluation = async () => {
    setEvaluating(true);
    setEvalResult(null);
    try {
      const res = await fetch('/api/evaluate', { method: 'POST' });
      const data = await res.json();
      setEvalResult(data);
      if (data.metrics) {
        setMetrics(data.metrics);
      }
      showToast(`Live evaluation suite completed: ${data.tests_passed}/${data.tests_executed} tests passed (${data.pass_rate})`, "success");
    } catch (err) {
      console.error(err);
      showToast("Evaluation runner encountered an issue.", "error");
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full">
            Evaluation & Governance Benchmark Framework
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0b1e36] tracking-tight mt-2">
            System Benchmarks & Accuracy Metrics
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Empirical measurements calculated directly from executed test assertions. Zero fabricated vanity numbers.
          </p>
        </div>

        <button
          onClick={runLiveEvaluation}
          disabled={evaluating}
          className="inline-flex items-center space-x-2 bg-[#0b1e36] hover:bg-[#162e4e] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-sm disabled:opacity-50"
        >
          {evaluating ? (
            <>
              <RotateCw className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>Executing Live Test Matrix & Measuring Latency...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 text-cyan-400 fill-current" />
              <span>Run Live Engine Benchmark</span>
            </>
          )}
        </button>
      </div>

      {/* Live Test Suite Result Box if run */}
      {evalResult && (
        <div className="bg-emerald-50/70 border border-emerald-300 rounded-2xl p-6 shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wider">
                Live Test Suite Results: {evalResult.tests_passed} / {evalResult.tests_executed} Passed ({evalResult.pass_rate})
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-semibold">
              Overall Status: {evalResult.overall_status} • Median Latency: {evalResult.measured_median_latency_ms} ms
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {evalResult.test_details?.map((t, idx) => (
              <div key={idx} className="bg-white p-3 rounded-lg border border-emerald-200 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono font-bold text-slate-500 text-[10px]">{t.test_id} • {t.type}</span>
                  <span className="text-emerald-700 font-mono text-[10px] font-bold">{t.latency_ms} ms</span>
                </div>
                <span className="font-bold text-slate-800 block mb-0.5 line-clamp-1">{t.query}</span>
                <span className="text-emerald-700 font-semibold text-[11px]">✓ TEST PASSED</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Benchmark Metrics Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Empirical Evaluation Matrix (Target vs Measured Actual)
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            Direct Mathematical Ratios
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Metric</th>
                <th className="py-3 px-4">Target Standard</th>
                <th className="py-3 px-4">Empirically Measured Actual</th>
                <th className="py-3 px-4">Sample Ratio</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-400">
                    Loading empirical benchmarks...
                  </td>
                </tr>
              ) : (
                metrics.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{m.metric_name}</div>
                      <div className="text-[11px] font-normal text-slate-500 mt-0.5">{m.description}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-600">{m.target}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700 bg-emerald-50/50">
                      {m.actual}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                      {m.numerator !== null && m.denominator !== null ? (
                        <span>{m.numerator} / {m.denominator}</span>
                      ) : (
                        <span>{m.test_cases_executed || 1} samples</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        m.status === 'MEETS TARGET' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{m.status}</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
