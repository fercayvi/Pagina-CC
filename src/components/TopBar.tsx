import React, { useState, useEffect } from 'react';
import { Lock, Home, Search, FileText, PhoneCall, X } from 'lucide-react';

export interface TopBarProps {
  setShowAdminLogin: (show: boolean) => void;
  currentTab?: 'inicio' | 'buscar' | 'noticias' | 'asistente';
  setCurrentTab?: (tab: 'inicio' | 'buscar' | 'noticias' | 'asistente') => void;
  unreadNewsCount?: number;
  searchQuery?: string;
  onSearch?: (query: string) => void;
  onGoHome?: () => void;
}

export default function TopBar({ 
  setShowAdminLogin, 
  currentTab = 'inicio', 
  setCurrentTab,
  unreadNewsCount = 0,
  searchQuery = '',
  onSearch,
  onGoHome
}: TopBarProps) {
  const [localSearch, setLocalSearch] = useState<string>(searchQuery);

  // Sync internal state when external searchQuery changes
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(localSearch);
    }
    if (setCurrentTab) {
      setCurrentTab('buscar');
    }
  };

  const handleClear = () => {
    setLocalSearch('');
    if (onSearch) {
      onSearch('');
    }
  };

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const scrollContainer = document.getElementById('phone-main-scrollable-content');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'instant' });
    }
    if (onGoHome) {
      onGoHome();
    } else if (setCurrentTab) {
      setCurrentTab('inicio');
    }
  };

  return (
    <header id="app-top-header" className="bg-white rounded-2xl border border-slate-200/80 p-2.5 sm:p-3 shadow-xs space-y-2.5 md:space-y-0">
      <div className="flex items-center justify-between gap-2.5 sm:gap-4">
        {/* Header Title with Logo */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <img 
            src="/logo.png" 
            alt="Logo de la Empresa" 
            onClick={handleHomeClick}
            className="h-9 sm:h-10 w-auto object-contain shrink-0 cursor-pointer hover:opacity-80 transition-opacity duration-150"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <button
            type="button"
            onClick={handleHomeClick}
            className="flex flex-col text-left cursor-pointer hover:opacity-80 transition-opacity duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 rounded-lg"
            title="Volver al inicio"
          >
            <h1 className="text-lg sm:text-2xl font-bold text-slate-800 tracking-tight leading-tight">
              Portal Talento y Cultura
            </h1>
            <span className="hidden lg:inline text-[11px] font-medium text-slate-400">
              Módulo de autoservicio para colaboradores
            </span>
          </button>
        </div>

        {/* Quick Search Bar (Desktop & Large screens in-header) */}
        <form 
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-xs lg:max-w-sm xl:max-w-md mx-2 relative items-center"
        >
          <input
            type="text"
            id="topbar-search-input"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Buscar trámite o servicio..."
            className="w-full pl-9 pr-8 py-2 bg-slate-100 hover:bg-slate-200/60 focus:bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 font-medium rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
          <button
            type="submit"
            className="absolute left-2.5 p-0.5 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
            title="Buscar trámite"
          >
            <Search className="w-4 h-4" />
          </button>
          {localSearch && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 p-0.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              title="Borrar búsqueda"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Desktop Navigation Links */}
        {setCurrentTab && (
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/60 shadow-2xs">
            <button
              type="button"
              id="desktop-nav-inicio"
              onClick={() => setCurrentTab('inicio')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                currentTab === 'inicio'
                  ? 'bg-white text-blue-700 shadow-xs scale-102'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Home className="w-4 h-4" strokeWidth={currentTab === 'inicio' ? 2.5 : 2} />
              <span>Inicio</span>
            </button>

            <button
              type="button"
              id="desktop-nav-noticias"
              onClick={() => setCurrentTab('noticias')}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                currentTab === 'noticias'
                  ? 'bg-white text-blue-700 shadow-xs scale-102'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <FileText className="w-4 h-4" strokeWidth={currentTab === 'noticias' ? 2.5 : 2} />
              <span>Noticias</span>
              
              {/* Badge punto rojo de notificación */}
              {unreadNewsCount > 0 && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                </span>
              )}
            </button>

            <button
              type="button"
              id="desktop-nav-asistente"
              onClick={() => setCurrentTab('asistente')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                currentTab === 'asistente'
                  ? 'bg-white text-emerald-700 shadow-xs scale-102'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <PhoneCall className="w-4 h-4 text-emerald-600" strokeWidth={2} />
              <span>Contacto</span>
            </button>
          </nav>
        )}

        {/* Admin Login Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => setShowAdminLogin(true)} 
            className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 hover:text-slate-800 transition-colors bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-2 rounded-xl font-bold cursor-pointer active:scale-95 shadow-2xs"
            title="Acceso administrativo"
          >
            <Lock size={15} className="text-slate-500" /> 
            <span>Ingresar</span>
          </button>
        </div>
      </div>

      {/* Mobile Quick Search Input (Visible only on smaller screens < md) */}
      <form 
        onSubmit={handleSearchSubmit}
        className="md:hidden flex w-full relative items-center pt-1"
      >
        <input
          type="text"
          id="mobile-topbar-search-input"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Buscar trámite o servicio..."
          className="w-full pl-9 pr-8 py-2 bg-slate-100 hover:bg-slate-200/60 focus:bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 font-medium rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-2xs"
        />
        <button
          type="submit"
          className="absolute left-2.5 p-0.5 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
          title="Buscar trámite"
        >
          <Search className="w-4 h-4" />
        </button>
        {localSearch && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 p-0.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            title="Borrar búsqueda"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </form>
    </header>
  );
}

