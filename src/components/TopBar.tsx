import React from 'react';
import { Lock } from 'lucide-react';

interface TopBarProps {
  setShowAdminLogin: (show: boolean) => void;
}

export default function TopBar({ setShowAdminLogin }: TopBarProps) {
  return (
    <header id="app-top-header" className="bg-white rounded-2xl border border-slate-200/80 p-2.5 sm:p-3 shadow-xs">
      <div className="flex items-center justify-between gap-2.5 sm:gap-4">
        {/* Header Title with Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <img 
            src="/logo.png" 
            alt="Logo de la Empresa" 
            className="h-9 sm:h-10 w-auto object-contain shrink-0"
            onError={(e) => {
              // Hide image if logo is missing or failing
              e.currentTarget.style.display = 'none';
            }}
          />
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            Portal Talento y Cultura
          </h1>
        </div>

        {/* Admin Login Button */}
        <button 
          onClick={() => setShowAdminLogin(true)} 
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg font-medium cursor-pointer"
        >
          <Lock size={16} /> Ingresar
        </button>
      </div>
    </header>
  );
}

