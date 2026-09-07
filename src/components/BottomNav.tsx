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
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-40"
    >
      <div className="flex justify-around items-center h-20 max-w-4xl mx-auto px-4 sm:px-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => setCurrentTab(tab.id)}
              className={`relative flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-2xl font-bold transition-all duration-150 cursor-pointer active:scale-95 focus:outline-none select-none ${
                isActive 
                  ? 'bg-blue-100 text-blue-700 shadow-2xs scale-102' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
              style={{ minHeight: '50px' }}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-sm sm:text-base tracking-tight ${isActive ? 'font-extrabold' : 'font-semibold'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

