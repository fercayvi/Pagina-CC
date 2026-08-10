import React from 'react';
import { Home, FileText, MessageSquare } from 'lucide-react';

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
    { id: 'asistente', label: 'Asistente', icon: MessageSquare },
  ];

  return (
    <nav 
      id="bottom-navigation-bar"
      className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-xs z-40"
    >
      <div className="flex justify-around items-center h-16 max-w-4xl mx-auto px-2 md:px-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => setCurrentTab(tab.id)}
              className="relative flex flex-col items-center justify-center w-full h-full text-center transition-colors focus:outline-none group"
              style={{ minHeight: '48px' }}
              aria-label={tab.label}
            >
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-slate-900 text-white' : 'text-slate-400 group-hover:text-slate-700'}`}>
                <Icon className="w-4.5 h-4.5" strokeWidth={2.2} />
              </div>
              <span className={`text-[10px] mt-1 tracking-tight transition-colors ${isActive ? 'text-slate-900 font-bold' : 'text-slate-500 font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

