import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  FileCheck, 
  UserCheck, 
  AlertTriangle, 
  ExternalLink,
  Cpu,
  Layers
} from 'lucide-react';

export const TrustCenter = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full">
          Governance, Security & Cryptographic Integrity
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0b1e36] tracking-tight mt-2">
          Justice Vault Trust Center
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Technical specifications for cryptographic document integrity, zero-hallucination confidence gating, and RBAC governance.
        </p>
      </div>

      {/* Trust Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1: Zero Hallucination Confidence Gate */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            1. Zero-Hallucination Confidence Gate
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every factual statement emitted by the engine must be tied to an active, official gazette passaged with exact section and page offsets. 
            If no verified source is retrieved, the confidence score drops below 0.20, triggering a mandatory fallback stating: 
            <em>"No verified evidence → no confident answer."</em>
          </p>
        </div>

        {/* Pillar 2: SHA-256 Cryptographic Checksum */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            2. SHA-256 Cryptographic Integrity
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            All ingested legal standards and citizen-uploaded documents are hashed using SHA-256 upon reception. 
            This digest serves as an immutable evidence fingerprint, protecting against silent modifications and ensuring complete evidentiary traceability.
          </p>
        </div>

        {/* Pillar 3: Multi-Authority Conflict Interception */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            3. Cross-Source Conflict Interception
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            When multiple official circulars disagree (such as Central Ministry vs State Directorate deadlines), 
            the system rejects speculative synthesis, flags a <code>⚠ CONFLICT DETECTED</code> alert, downgrades confidence, and directs the citizen to verify with the authoritative institution.
          </p>
        </div>

        {/* Pillar 4: AES-256 Storage Abstraction */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            4. AES-256 Encrypted Storage Abstraction
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Uploaded citizen documents are handled through an enterprise storage abstraction layer ready for envelope encryption via AES-256-GCM. 
            Cryptographic digests and user claims are segregated from raw binary payloads.
          </p>
        </div>
      </div>

      {/* RBAC Governance Matrix */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <UserCheck className="w-5 h-5 text-teal-600" />
          <h3 className="text-base font-bold text-slate-900">
            Role-Based Access Control (RBAC) Architecture
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Role</th>
                <th className="py-2.5 px-4">Query Intelligence</th>
                <th className="py-2.5 px-4">Evidence Trace</th>
                <th className="py-2.5 px-4">Document Ingestion</th>
                <th className="py-2.5 px-4">Audit Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              <tr>
                <td className="py-2.5 px-4 font-bold text-cyan-800">Citizen</td>
                <td className="py-2.5 px-4 text-emerald-600 font-bold">✓ Full Access</td>
                <td className="py-2.5 px-4 text-emerald-600 font-bold">✓ Full Access</td>
                <td className="py-2.5 px-4 text-slate-600">Personal Uploads</td>
                <td className="py-2.5 px-4 text-slate-400">Session Only</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold text-teal-800">Verification Officer</td>
                <td className="py-2.5 px-4 text-emerald-600 font-bold">✓ Full Access</td>
                <td className="py-2.5 px-4 text-emerald-600 font-bold">✓ Full Access</td>
                <td className="py-2.5 px-4 text-emerald-600 font-bold">✓ Full Gazette Upload</td>
                <td className="py-2.5 px-4 text-emerald-600 font-bold">✓ Institutional Trail</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold text-indigo-800">Auditor</td>
                <td className="py-2.5 px-4 text-emerald-600 font-bold">✓ Read Only</td>
                <td className="py-2.5 px-4 text-emerald-600 font-bold">✓ Cryptographic Audit</td>
                <td className="py-2.5 px-4 text-slate-400">Restricted</td>
                <td className="py-2.5 px-4 text-emerald-600 font-bold">✓ Full Immutable Trail</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
