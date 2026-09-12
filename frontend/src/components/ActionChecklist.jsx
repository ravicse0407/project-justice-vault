import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  ExternalLink, 
  FileText, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ActionChecklist = ({ checklist }) => {
  const [completedSteps, setCompletedSteps] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmationNotice, setConfirmationNotice] = useState(null);
  const { showToast, addActionPlan } = useApp();

  if (!checklist) return null;

  const toggleStep = (stepNumber) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepNumber]: !prev[stepNumber]
    }));
  };

  const totalSteps = checklist.steps ? checklist.steps.length : 0;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  const handleOpenPortalConfirmed = async () => {
    setIsConfirming(true);
    try {
      const res = await fetch('/api/action/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_name: checklist.service_name,
          official_portal_url: checklist.official_portal_url,
          confirmed_by_user: true,
          timestamp: new Date().toISOString()
        })
      });
      const data = await res.json();
      setConfirmationNotice(data.notice);
      showToast("Official route confirmed. Launching government portal...", "success");
      
      // Save to action plans state
      addActionPlan({
        ...checklist,
        completedCount,
        progressPercent,
        savedAt: new Date().toLocaleString()
      });

      setTimeout(() => {
        setIsConfirming(false);
        setShowConfirmModal(false);
        window.open(checklist.official_portal_url, '_blank', 'noopener,noreferrer');
      }, 1200);
    } catch (err) {
      console.error(err);
      setIsConfirming(false);
      window.open(checklist.official_portal_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Deterministic Action Engine
          </span>
          <h3 className="text-base font-bold text-slate-900 mt-1">
            Action Plan: {checklist.service_name}
          </h3>
        </div>

        {/* Progress Bar */}
        <div className="text-right">
          <span className="text-xs font-semibold text-slate-600">
            Citizen Readiness: {progressPercent}%
          </span>
          <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden mt-1">
            <div 
              className="bg-teal-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Required Documents Checklist */}
      <div className="my-5">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
          <FileText className="w-4 h-4 text-slate-600" />
          <span>Required Verification Artifacts ({checklist.required_documents?.length || 0})</span>
        </h4>
        <div className="flex flex-wrap gap-2">
          {checklist.required_documents?.map((doc, idx) => (
            <span 
              key={idx}
              className="inline-flex items-center space-x-1 px-3 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
              <span>{doc}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Step-by-Step Action Items */}
      <div className="space-y-3 mb-6">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Next Steps (Deterministic Sequence)
        </h4>
        {checklist.steps?.map((step) => {
          const isDone = !!completedSteps[step.step_number];
          return (
            <div 
              key={step.step_number}
              onClick={() => toggleStep(step.step_number)}
              className={`p-3.5 rounded-lg border transition cursor-pointer flex items-start space-x-3 ${
                isDone 
                  ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950' 
                  : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50 text-slate-800'
              }`}
            >
              <button type="button" className="mt-0.5 text-slate-500 shrink-0">
                {isDone ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400" />
                )}
              </button>
              <div>
                <span className={`text-xs font-bold uppercase tracking-wider block ${isDone ? 'text-emerald-700 line-through' : 'text-slate-500'}`}>
                  Step {step.step_number}: {step.title}
                </span>
                <p className={`text-xs mt-0.5 leading-relaxed ${isDone ? 'text-emerald-900 line-through' : 'text-slate-600'}`}>
                  {step.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deadline & Official Portal Routing CTA */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs text-slate-600">
          <Clock className="w-4 h-4 text-slate-500 shrink-0" />
          <span><strong>Operative Window:</strong> {checklist.deadline || "Active ongoing intake"}</span>
        </div>

        <button
          onClick={() => setShowConfirmModal(true)}
          className="inline-flex items-center space-x-2 bg-[#0b1e36] text-cyan-300 hover:bg-[#162e4e] hover:text-white px-5 py-2.5 rounded-lg text-xs font-bold transition shadow-sm"
        >
          <span>Open Official Route: {checklist.official_portal_name}</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* User Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              External Action Safety Confirmation
            </h3>

            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-lg text-xs text-amber-900 mb-4 leading-relaxed">
              <strong>Mandatory Safety Gate:</strong> External action requires explicit user confirmation. 
              Justice Vault does <strong>NOT</strong> automatically submit applications, sign forms, or disburse funds on your behalf.
            </div>

            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              You are proceeding to the verified official government portal:
              <br />
              <code className="text-cyan-700 font-mono font-semibold block mt-1 break-all">
                {checklist.official_portal_url}
              </code>
            </p>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isConfirming}
                onClick={handleOpenPortalConfirmed}
                className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold bg-[#0b1e36] text-white hover:bg-[#162e4e] rounded-lg transition disabled:opacity-50"
              >
                {isConfirming ? (
                  <span>Recording Audit & Launching...</span>
                ) : (
                  <>
                    <span>Confirm & Launch Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
