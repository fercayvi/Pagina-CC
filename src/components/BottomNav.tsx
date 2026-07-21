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
      className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-[0_-4px_16px_rgba(0,0,0,0.03)] z-40"
    >
      <div className="flex justify-around items-center h-16 max-w-5xl mx-auto px-4 md:px-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => setCurrentTab(tab.id)}
              className="relative flex flex-col items-center justify-center w-full h-full text-center transition-colors focus:outline-none"
              style={{ minHeight: '48px' }} // Touch target guidelines
              aria-label={tab.label}
            >
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-blue-50 text-blue-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}>
                <Icon className="w-5 font-bold h-5" />
              </div>
              <span className={`text-[10px] font-medium mt-0.5 tracking-wide transition-colors ${isActive ? 'text-blue-600 font-semibold' : 'text-slate-400'}`}>
                {tab.label}
              </span>
              
              {/* Badge for notifications */}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span 
                  id="nav-badge"
                  className="absolute top-2 right-1/2 translate-x-4 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white animate-pulse"
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
