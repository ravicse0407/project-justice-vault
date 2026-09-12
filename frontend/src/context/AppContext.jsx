import React, { createContext, useContext, useState } from 'react';
import { translations } from './translations';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [role, setRole] = useState('citizen'); // citizen, officer, auditor
  const [demoMode, setDemoMode] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const [actionPlans, setActionPlans] = useState([]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const t = translations[language] || translations.en;

  const addActionPlan = (plan) => {
    setActionPlans(prev => [plan, ...prev.filter(p => p.service_name !== plan.service_name)]);
  };

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      role,
      setRole,
      demoMode,
      setDemoMode,
      activeTab,
      setActiveTab,
      toast,
      showToast,
      actionPlans,
      addActionPlan,
      t
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
