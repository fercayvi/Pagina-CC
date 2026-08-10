import React from 'react';
import { Home, FileText, PhoneCall } from 'lucide-react';

interface BottomNavProps {
  currentTab: 'inicio' | 'noticias' | 'asistente';
  setCurrentTab: (tab: 'inicio' | 'noticias' | 'asistente') => void;
}

export default function BottomNav({ currentTab, setCurrentTab }: BottomNavProps) {
  interface TabItem {
    id: 'inicio' | 'noticias' | 'asistente';
    label: string;
    icon: React.ComponentType<any>;
  }

  const tabs: TabItem[] = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'noticias', label: 'Noticias', icon: FileText },
    { id: 'asistente', label: 'Contacto', icon: PhoneCall },
  ];

  return (
    <nav 
      id="bottom-navigation-bar"
      className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-xs z-40"
    >
      <div className="flex justify-around items-center h-20 max-w-4xl mx-auto px-2 md:px-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => setCurrentTab(tab.id)}
              className="relative flex flex-col items-center justify-center w-full h-full text-center transition-all focus:outline-none group cursor-pointer active:scale-95"
              style={{ minHeight: '56px' }}
              aria-label={tab.label}
            >
              <div className={`p-2 rounded-2xl transition-all ${isActive ? 'bg-slate-900 text-white shadow-md scale-105' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                <Icon className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <span className={`text-xs mt-1 tracking-tight transition-colors ${isActive ? 'text-slate-900 font-extrabold' : 'text-slate-800 font-bold'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

