import React from 'react';
import { Search, X, Building2, Lock } from 'lucide-react';

interface TopBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenAdminLogin?: () => void;
}

export default function TopBar({ searchQuery, setSearchQuery, onOpenAdminLogin }: TopBarProps) {
  return (
    <header id="app-top-header" className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs mb-4">
      {/* Header Title Bar */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md mb-1">
            Planta Manufactura • Portal Libre y Público
          </span>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight font-display">
            Guía de Trámites y Servicios RH
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {onOpenAdminLogin && (
            <button
              id="admin-login-btn"
              onClick={onOpenAdminLogin}
              className="w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl flex items-center justify-center shrink-0 border border-slate-200 shadow-2xs transition-colors"
              title="Inicio de sesión para Administradores"
              aria-label="Inicio de sesión para Administradores"
            >
              <Lock className="w-4 h-4 text-slate-600" />
            </button>
          )}
          <div className="w-10 h-10 bg-slate-100 text-slate-700 font-bold rounded-xl flex items-center justify-center shrink-0 border border-slate-200 shadow-2xs">
            <Building2 className="w-5 h-5 text-slate-600" />
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" strokeWidth={2.2} />
        </div>
        <input
          id="search-services-input"
          type="text"
          placeholder="Buscar trámites y servicios..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-9 py-2.5 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white transition-all"
        />
        {searchQuery && (
          <button
            id="clear-search-btn"
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            aria-label="Limpiar búsqueda"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </header>
  );
}

