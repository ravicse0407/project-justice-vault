import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Scale, 
  ShieldCheck, 
  Search, 
  FileText, 
  CheckSquare, 
  History, 
  Lock, 
  BarChart3, 
  Globe, 
  UserCheck, 
  UploadCloud 
} from 'lucide-react';

export const Navbar = () => {
  const { 
    language, 
    setLanguage, 
    role, 
    setRole, 
    demoMode, 
    activeTab, 
    setActiveTab, 
    t 
  } = useApp();

  const navItems = [
    { id: 'dashboard', label: t.nav.dashboard, icon: Scale },
    { id: 'ask', label: t.nav.askVault, icon: Search },
    { id: 'evidence', label: t.nav.evidenceVault, icon: ShieldCheck },
    { id: 'documents', label: t.nav.documents, icon: UploadCloud },
    { id: 'actionPlans', label: t.nav.actionPlans, icon: CheckSquare },
    { id: 'audit', label: t.nav.audit, icon: History },
    { id: 'trustCenter', label: t.nav.trustCenter, icon: Lock },
    { id: 'benchmark', label: t.nav.benchmark, icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Top GovTech Banner */}
      <div className="bg-[#0b1e36] text-slate-200 text-xs px-4 py-1.5 flex flex-wrap justify-between items-center">
        <div className="flex items-center space-x-2 font-medium">
          <span className="bg-cyan-500 text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
            Lenovo LEAP 2026
          </span>
          <span className="hidden sm:inline text-slate-300">Theme 2: Digital Inclusion & Public Access</span>
          <span className="text-slate-400">•</span>
          <span className="text-emerald-400 font-semibold">{t.zeroHallucinationPrinciple}</span>
        </div>
        <div className="flex items-center space-x-4">
          {/* Demo Mode Badge */}
          {demoMode && (
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] px-2 py-0.5 rounded font-mono font-semibold">
              DEMO MODE • VERIFIED SEED
            </span>
          )}
          {/* Language Selector */}
          <div className="flex items-center space-x-1">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <button 
              onClick={() => setLanguage('en')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition ${language === 'en' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              EN
            </button>
            <span className="text-slate-600">|</span>
            <button 
              onClick={() => setLanguage('hi')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition ${language === 'hi' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              हिन्दी
            </button>
          </div>
          {/* Role Switcher */}
          <div className="flex items-center space-x-1.5 pl-2 border-l border-slate-700">
            <UserCheck className="w-3.5 h-3.5 text-teal-400" />
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-slate-800 text-slate-200 text-[11px] rounded border border-slate-700 px-1 py-0.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="citizen">Citizen</option>
              <option value="officer">Verification Officer</option>
              <option value="auditor">Auditor</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Brand & Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <div 
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-[#0b1e36] text-cyan-400 flex items-center justify-center shadow-md group-hover:bg-[#162e4e] transition">
              <Scale className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold tracking-tight text-[#0b1e36] font-sans">
                  {t.brand}
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded font-mono">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">
                Evidence-Grounded AI Action Engine
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden lg:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive 
                      ? 'bg-slate-100 text-cyan-700 font-semibold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile / Tablet Horizontal Navigation */}
      <div className="lg:hidden border-t border-slate-100 px-2 py-1 flex space-x-1 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-1 px-2.5 py-1.5 whitespace-nowrap rounded text-xs font-medium ${
                isActive ? 'bg-cyan-50 text-cyan-700 font-semibold' : 'text-slate-600'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
