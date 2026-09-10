import React from 'react';
import { Home, FileText, PhoneCall } from 'lucide-react';

export interface BottomNavProps {
  currentTab: 'inicio' | 'noticias' | 'asistente';
  setCurrentTab: (tab: 'inicio' | 'noticias' | 'asistente') => void;
  unreadNewsCount?: number;
}

export default function BottomNav({ 
  currentTab, 
  setCurrentTab,
  unreadNewsCount = 0
}: BottomNavProps) {
  interface TabItem {
    id: 'inicio' | 'noticias' | 'asistente';
    label: string;
    icon: React.ComponentType<any>;
    badge?: boolean;
  }

  const tabs: TabItem[] = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'noticias', label: 'Noticias', icon: FileText, badge: unreadNewsCount > 0 },
    { id: 'asistente', label: 'Contacto', icon: PhoneCall },
  ];

  return (
    <nav 
      id="bottom-navigation-bar"
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg z-40"
    >
      <div className="flex justify-around items-center h-18 max-w-lg mx-auto px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => setCurrentTab(tab.id)}
              className={`relative flex items-center justify-center gap-2 px-4 py-2 rounded-2xl font-bold transition-all duration-150 cursor-pointer active:scale-95 focus:outline-none select-none ${
                isActive 
                  ? 'bg-blue-100 text-blue-700 shadow-2xs scale-102' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
              style={{ minHeight: '46px' }}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon className="w-5 h-5 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600 border border-white"></span>
                  </span>
                )}
              </div>
              <span className={`text-sm tracking-tight ${isActive ? 'font-extrabold' : 'font-semibold'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
