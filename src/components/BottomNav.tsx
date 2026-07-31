import React from 'react';
import { Home, FileText, Bell, User, MessageSquare } from 'lucide-react';

interface BottomNavProps {
  currentTab: 'inicio' | 'noticias' | 'avisos' | 'perfil' | 'asistente';
  setCurrentTab: (tab: 'inicio' | 'noticias' | 'avisos' | 'perfil' | 'asistente') => void;
  unreadAvisosCount: number;
}

export default function BottomNav({ currentTab, setCurrentTab, unreadAvisosCount }: BottomNavProps) {
  interface TabItem {
    id: 'inicio' | 'noticias' | 'avisos' | 'perfil' | 'asistente';
    label: string;
    icon: React.ComponentType<any>;
    badge?: number;
  }

  const tabs: TabItem[] = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'noticias', label: 'Noticias', icon: FileText },
    { id: 'avisos', label: 'Avisos', icon: Bell, badge: unreadAvisosCount },
    { id: 'asistente', label: 'Asistente', icon: MessageSquare },
    { id: 'perfil', label: 'Perfil', icon: User },
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
              
              {/* Badge for notifications */}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span 
                  id="nav-badge"
                  className="absolute top-1.5 right-1/2 translate-x-3.5 bg-rose-600 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full border-2 border-white"
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

