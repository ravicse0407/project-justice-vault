import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { AskVault } from './pages/AskVault';
import { EvidenceVault } from './pages/EvidenceVault';
import { DocumentUpload } from './pages/DocumentUpload';
import { ActionPlans } from './pages/ActionPlans';
import { AuditTrail } from './pages/AuditTrail';
import { TrustCenter } from './pages/TrustCenter';
import { Benchmark } from './pages/Benchmark';
import { Scale, CheckCircle2, AlertCircle, Info, ShieldCheck } from 'lucide-react';

export const App = () => {
  const { activeTab, toast } = useApp();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'ask':
        return <AskVault />;
      case 'evidence':
        return <EvidenceVault />;
      case 'documents':
        return <DocumentUpload />;
      case 'actionPlans':
        return <ActionPlans />;
      case 'audit':
        return <AuditTrail />;
      case 'trustCenter':
        return <TrustCenter />;
      case 'benchmark':
        return <Benchmark />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 font-sans">
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {renderActiveTab()}
      </main>

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className={`flex items-center space-x-2 px-4 py-3 rounded-xl shadow-xl border text-xs font-semibold ${
            toast.type === 'success' 
              ? 'bg-emerald-900 text-white border-emerald-700' 
              : toast.type === 'error'
                ? 'bg-rose-900 text-white border-rose-700'
                : toast.type === 'warning'
                  ? 'bg-amber-900 text-white border-amber-700'
                  : 'bg-slate-900 text-white border-slate-700'
          }`}>
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-cyan-400 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* GovTech Civic Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <Scale className="w-4 h-4 text-[#0b1e36]" />
            <span className="font-bold text-slate-800">JUSTICE VAULT</span>
            <span>• Lenovo LEAP AI Hackathon 2026</span>
          </div>

          <div className="text-center md:text-right text-[11px] text-slate-400">
            <p>Complementary public-service intelligence layer for India.gov.in, UMANG, DigiLocker and myScheme.</p>
            <p className="mt-0.5">Strict zero-hallucination policy: <em>"No verified evidence → no confident answer."</em></p>
          </div>
        </div>
      </footer>
    </div>
  );
};
