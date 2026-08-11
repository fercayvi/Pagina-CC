import React, { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface TopBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenAdminLogin?: () => void;
}

export default function TopBar({ searchQuery, setSearchQuery, onOpenAdminLogin }: TopBarProps) {
  const [tapCount, setTapCount] = useState<number>(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSecretTap = () => {
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);

    const nextCount = tapCount + 1;
    if (nextCount >= 5) {
      setTapCount(0);
      if (onOpenAdminLogin) onOpenAdminLogin();
    } else {
      setTapCount(nextCount);
      // Reset tap count if 5 taps are not completed within 2.5 seconds
      tapTimerRef.current = setTimeout(() => {
        setTapCount(0);
      }, 2500);
    }
  };

  return (
    <header id="app-top-header" className="bg-white rounded-2xl border border-slate-200/80 p-2.5 sm:p-3 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
        {/* Header Title with Secret Admin Trigger (5 fast taps) */}
        <div 
          onClick={handleSecretTap}
          className="cursor-pointer select-none group shrink-0"
          title="Guía de Trámites"
        >
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-display group-active:scale-95 transition-transform">
            Guía de Trámites y Servicios RH
          </h1>
        </div>

        {/* Compact Search Input */}
        <div className="relative flex-1 max-w-md md:max-w-lg w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" strokeWidth={2.2} />
          </div>
          <input
            id="search-services-input"
            type="text"
            placeholder="Buscar trámites y servicios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-9 pr-8 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              id="clear-search-btn"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              aria-label="Limpiar búsqueda"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

