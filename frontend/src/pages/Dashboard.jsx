import React from 'react';
import { useApp } from '../context/AppContext';
import { TrustStats } from '../components/TrustStats';
import { 
  Search, 
  CheckCircle2, 
  UploadCloud, 
  FileText, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  ExternalLink,
  Layers,
  Scale
} from 'lucide-react';

export const Dashboard = () => {
  const { setActiveTab, t } = useApp();

  const quickActions = [
    {
      title: t.quickActions.action1Title,
      desc: t.quickActions.action1Desc,
      icon: Search,
      action: () => setActiveTab('ask'),
      color: "border-cyan-200 hover:border-cyan-400 bg-cyan-50/30"
    },
    {
      title: t.quickActions.action2Title,
      desc: t.quickActions.action2Desc,
      icon: CheckCircle2,
      action: () => setActiveTab('ask'),
      color: "border-teal-200 hover:border-teal-400 bg-teal-50/30"
    },
    {
      title: t.quickActions.action3Title,
      desc: t.quickActions.action3Desc,
      icon: UploadCloud,
      action: () => setActiveTab('documents'),
      color: "border-indigo-200 hover:border-indigo-400 bg-indigo-50/30"
    },
    {
      title: t.quickActions.action4Title,
      desc: t.quickActions.action4Desc,
      icon: FileText,
      action: () => setActiveTab('evidence'),
      color: "border-slate-200 hover:border-slate-400 bg-slate-50/50"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Section */}
      <section className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm relative overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-cyan-50 rounded-full opacity-60 blur-2xl pointer-events-none" />
        <div className="absolute right-32 -bottom-20 w-64 h-64 bg-teal-50 rounded-full opacity-50 blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-[#0b1e36] text-white px-3 py-1 rounded-full text-xs font-semibold mb-4 shadow-xs">
            <Scale className="w-3.5 h-3.5 text-cyan-400" />
            <span>Lenovo LEAP AI Hackathon 2026 • Theme 2: Public Access</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#0b1e36] tracking-tight leading-tight">
            {t.hero.title1}
            <br />
            <span className="text-cyan-600">{t.hero.title2}</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 mt-4 leading-relaxed font-normal">
            {t.hero.subtitle}
          </p>

          <p className="text-xs text-slate-500 mt-3 font-mono bg-slate-100 p-2 rounded-lg border border-slate-200 inline-block">
            ⚖️ Core Principle: <strong>"No verified evidence → no confident answer."</strong>
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <button
              onClick={() => setActiveTab('ask')}
              className="inline-flex items-center space-x-2 bg-[#0b1e36] hover:bg-[#162e4e] text-white px-6 py-3 rounded-xl font-bold text-sm transition shadow-sm"
            >
              <span>{t.hero.btnAsk}</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </button>

            <button
              onClick={() => setActiveTab('evidence')}
              className="inline-flex items-center space-x-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-6 py-3 rounded-xl font-semibold text-sm transition shadow-2xs"
            >
              <span>{t.hero.btnBrowse}</span>
              <Layers className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>
      </section>

      {/* Trust Statistics */}
      <section>
        <div className="mb-3 flex justify-between items-center">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            System Reliability & Verification Baseline
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">
            Empirical Test Set Data
          </span>
        </div>
        <TrustStats />
      </section>

      {/* Quick Action Pathways */}
      <section>
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
          <span>{t.quickActions.title}</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((act, idx) => {
            const Icon = act.icon;
            return (
              <div
                key={idx}
                onClick={act.action}
                className={`p-5 rounded-xl border transition cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-xs group ${act.color}`}
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center mb-3 shadow-3xs group-hover:scale-105 transition">
                    <Icon className="w-5 h-5 text-[#0b1e36]" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {act.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {act.desc}
                  </p>
                </div>
                <div className="mt-4 flex items-center text-xs font-bold text-cyan-700 group-hover:text-cyan-800">
                  <span>Proceed</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Complementary GovTech Positioning */}
      <section className="bg-slate-900 text-white rounded-2xl p-8 border border-slate-800">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Lock className="w-4 h-4" />
            <span>Complementary Public-Service Intelligence Architecture</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight">
            How Justice Vault Complements Official Government Infrastructure
          </h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Justice Vault does <strong>not</strong> replace official delivery portals like UMANG, DigiLocker, myScheme, or India.gov.in. 
            Instead, it serves as the essential evidence-grounding and cognitive translation layer between complex administrative gazettes and citizen action.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <span className="text-xs font-bold text-cyan-300 block mb-1">1. Zero Hallucination</span>
              <p className="text-[11px] text-slate-400 leading-normal">
                If an official gazette notification does not verify a claim, the system refuses to generate speculative advice.
              </p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <span className="text-xs font-bold text-cyan-300 block mb-1">2. Conflict Detection</span>
              <p className="text-[11px] text-slate-400 leading-normal">
                Cross-examines central vs state circulars to intercept contradictory deadlines without merging them.
              </p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <span className="text-xs font-bold text-cyan-300 block mb-1">3. Confirmed Routing</span>
              <p className="text-[11px] text-slate-400 leading-normal">
                Prepares citizens with verified checklists and mandates explicit user consent before official portal launch.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
