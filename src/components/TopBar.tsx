import React from 'react';
import { Search, X } from 'lucide-react';
import { UserProfile } from '../types';

interface TopBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  user: UserProfile;
  onOpenProfile: () => void;
}

export default function TopBar({ searchQuery, setSearchQuery, user, onOpenProfile }: TopBarProps) {
  // Helper to dynamically calculate next Friday for a hyper-realistic operario payment indicator
  const getNextFridayFormatted = () => {
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0: Sun, 1: Mon, ..., 4: Thu, 5: Fri, 6: Sat
    // If today is Friday before 2:00 PM shift end, maybe show today, else next Friday
    let daysUntilFriday = (5 - dayOfWeek + 7) % 7;
    if (daysUntilFriday === 0) daysUntilFriday = 7; // show next week's Friday if today is already Friday
    
    const nextFriday = new Date(today);
    nextFriday.setDate(today.getDate() + daysUntilFriday);
    return `Viernes ${nextFriday.getDate()} de ${months[nextFriday.getMonth()]}`;
  };

  const nextFridayStr = getNextFridayFormatted();
  const initials = user.name.split(' ').map(n => n[0]).slice(0, 2).join('');

  return (
    <header id="app-top-header" className="bg-white z-30 pt-4 pb-2">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2.5xl font-extrabold text-slate-900 tracking-tight leading-none">
            Centro de Servicios
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1.5">
            Planta Manufactura • {user.department.split(' - ')[0]}
          </p>
        </div>
        <button
          id="user-avatar-btn"
          onClick={onOpenProfile}
          className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-extrabold text-sm shadow-md hover:scale-105 active:scale-95 transition-transform border border-blue-500/10"
          aria-label="Ver perfil"
        >
          {initials}
        </button>
      </div>

      {/* Greeting Card */}
      <div className="p-4.5 bg-slate-900 rounded-2xl shadow-lg mb-5 transition-all hover:bg-slate-800/95">
        <p className="text-slate-400 text-[10px] uppercase tracking-widest font-extrabold mb-1">
          Hola, {user.name}
        </p>
        <p className="text-white text-sm font-medium">
          Próximo Pago:{' '}
          <span className="text-blue-400 font-extrabold underline decoration-2 underline-offset-4 italic ml-1">
            {nextFridayStr}
          </span>
        </p>
      </div>

      {/* Search Bar (Quick Solve) */}
      <div className="relative mb-2">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" strokeWidth={2.5} />
        </div>
        <input
          id="search-services-input"
          type="text"
          placeholder="¿Qué necesitas resolver hoy?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-11 pr-10 py-3 border border-slate-200 rounded-xl bg-slate-50 placeholder-slate-400 text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 focus:bg-white transition-all shadow-2xs"
        />
        {searchQuery && (
          <button
            id="clear-search-btn"
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
            aria-label="Limpiar búsqueda"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        )}
      </div>
    </header>
  );
}
