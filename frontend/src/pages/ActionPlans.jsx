import React from 'react';
import { useApp } from '../context/AppContext';
import { ActionChecklist } from '../components/ActionChecklist';
import { CheckSquare, ArrowRight, Layers, FileText } from 'lucide-react';

export const ActionPlans = () => {
  const { actionPlans, setActiveTab } = useApp();

  // Seed with default PMAY-U 2.0 plan if none exist
  const defaultPmayChecklist = {
    service_name: "Pradhan Mantri Awas Yojana - Urban (PMAY-U 2.0)",
    steps: [
      {
        step_number: 1,
        title: "Verify Household Income Bracket",
        detail: "Ensure annual household income does not exceed ₹3,00,000 for EWS or ₹6,00,000 for LIG.",
        is_completed: false
      },
      {
        step_number: 2,
        title: "Gather Competent Revenue & Property Certificates",
        detail: "Obtain Tehsildar-certified Income Certificate and Land Title / Patta / Possession deed.",
        is_completed: false
      },
      {
        step_number: 3,
        title: "Authenticate Aadhaar & Active Bank Passbook",
        detail: "Ensure all family members' Aadhaar cards have updated biometric/OTP linkage and NPCI DBT bank account is active.",
        is_completed: false
      },
      {
        step_number: 4,
        title: "Draft Pucca House Non-Ownership Affidavit",
        detail: "Prepare notarized self-declaration stating no family member owns a permanent residential pucca house anywhere in India.",
        is_completed: false
      },
      {
        step_number: 5,
        title: "Submit Online at MoHUA Official Portal",
        detail: "Access the official Ministry of Housing & Urban Affairs portal and file under Citizen Assessment.",
        is_completed: false
      }
    ],
    required_documents: [
      "Aadhaar Card of all family members",
      "Income Certificate from Tehsildar / Competent Revenue Authority",
      "Land Title / Patta / Property Possession Document",
      "Aadhaar-seeded NPCI Active Bank Account Passbook",
      "Affidavit of No Pucca House anywhere in India"
    ],
    deadline: "Scheme operational for registrations through March 31, 2029",
    official_portal_url: "https://pmay-urban.gov.in/",
    official_portal_name: "PMAY-U 2.0 Official Citizen Portal (MoHUA)",
    requires_confirmation: true
  };

  const displayedPlans = actionPlans.length > 0 ? actionPlans : [defaultPmayChecklist];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
            Citizen Readiness & Preparation Tracker
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0b1e36] tracking-tight mt-2">
            Action Plans & Checklists
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Deterministic step-by-step guidance compiled from verified legal notices. Complete preparation before visiting the official portal.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('ask')}
          className="inline-flex items-center space-x-1.5 bg-[#0b1e36] hover:bg-[#162e4e] text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow-xs"
        >
          <span>Generate New Action Plan</span>
          <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
        </button>
      </div>

      {/* Action Plans List */}
      <div className="space-y-6">
        {displayedPlans.map((plan, idx) => (
          <ActionChecklist key={idx} checklist={plan} />
        ))}
      </div>
    </div>
  );
};
