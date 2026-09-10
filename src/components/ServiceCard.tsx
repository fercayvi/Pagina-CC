import React from 'react';
import * as Icons from 'lucide-react';
import {
  Banknote,
  Coins,
  ReceiptText,
  FileText,
  FileCheck,
  HelpCircle,
  CreditCard,
  Wallet,
  PiggyBank,
  HandCoins,
  Home,
  Palmtree,
  Sun,
  Stethoscope,
  Cross,
  Shield,
  ShieldAlert,
  Fingerprint,
  UserCheck,
  Clock,
  Calendar,
  CalendarDays,
  Briefcase
} from 'lucide-react';
import { Service } from '../types';

// Dictionary mapping icon names to Lucide icon components
export const SERVICE_ICON_MAP: Record<string, React.ComponentType<any>> = {
  Banknote,
  Coins,
  ReceiptText,
  FileText,
  FileCheck,
  HelpCircle,
  CreditCard,
  Wallet,
  PiggyBank,
  HandCoins,
  Home,
  Palmtree,
  Sun,
  Stethoscope,
  Cross,
  Shield,
  ShieldAlert,
  Fingerprint,
  UserCheck,
  Clock,
  Calendar,
  CalendarDays,
  Briefcase
};

export interface ServiceCardProps {
  key?: string;
  service: Service;
  onClick: () => void;
  onStatusChange?: (serviceId: string, newStatus: 'active' | 'maintenance' | 'inactive') => void;
  onToggleVisibility?: (serviceId: string) => void;
  showQuickActions?: boolean;
}

export default function ServiceCard({ 
  service, 
  onClick,
  onStatusChange,
  onToggleVisibility,
  showQuickActions = false
}: ServiceCardProps) {
  // Dynamically resolve icon from dictionary with fallback to FileText
  const iconKey = service.iconName || service.icon || 'FileText';
  const IconComponent = SERVICE_ICON_MAP[iconKey] || (Icons as any)[iconKey] || FileText;

  const currentStatus = service.status || 'active';

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onStatusChange) return;
    const nextStatusMap: Record<string, 'active' | 'maintenance' | 'inactive'> = {
      active: 'maintenance',
      maintenance: 'inactive',
      inactive: 'active'
    };
    const next = nextStatusMap[currentStatus] || 'active';
    onStatusChange(String(service.id), next);
  };

  return (
    <div
      id={`service-card-${service.id}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group relative bg-white border rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md transition-all duration-150 active:scale-[0.98] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 w-full min-h-[156px] sm:min-h-[172px] select-none ${
        service.hidden 
          ? 'border-dashed border-slate-300 opacity-60 bg-slate-50/50' 
          : 'border-slate-200/90 hover:border-blue-500'
      }`}
    >
      {/* Quick Action Top Bar (if enabled or if status callbacks exist) */}
      {(showQuickActions || onStatusChange || onToggleVisibility) && (
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          {onStatusChange && (
            <button
              type="button"
              onClick={handleStatusClick}
              title={`Estado actual: ${currentStatus === 'active' ? 'Activo' : currentStatus === 'maintenance' ? 'En Mantenimiento' : 'Inactivo'}. Clic para alternar rápido.`}
              className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all border shadow-2xs cursor-pointer min-h-[28px] flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-95 ${
                currentStatus === 'active' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                  : currentStatus === 'maintenance'
                  ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                  : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
              }`}
            >
              {currentStatus === 'active' ? '● Activo' : currentStatus === 'maintenance' ? '▲ Mantenimiento' : '○ Inactivo'}
            </button>
          )}

          {onToggleVisibility && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility(String(service.id));
              }}
              title={service.hidden ? 'Trámite oculto. Clic para mostrar.' : 'Trámite visible. Clic para ocultar.'}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 text-xs transition-colors cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-95"
            >
              {service.hidden ? '👁️‍🗨️' : '👁️'}
            </button>
          )}
        </div>
      )}

      <div className="mb-3.5 flex items-center justify-center">
        {service.cardImage && typeof service.cardImage === 'string' && service.cardImage.trim().length > 0 ? (
          <img 
            src={service.cardImage} 
            alt={service.title} 
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover shadow-2xs border border-slate-100 transition-transform duration-150 group-hover:scale-105" 
          />
        ) : (
          /* Ícono dentro de un contenedor cuadrado suavemente redondeado */
          <div className="w-14 h-14 sm:w-16 sm:h-16 p-3.5 sm:p-4 rounded-2xl bg-blue-50/80 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-150 flex items-center justify-center shadow-2xs">
            <IconComponent size={28} strokeWidth={2.2} className="transition-transform duration-150 group-hover:scale-110 shrink-0" />
          </div>
        )}
      </div>

      <div className="w-full">
        <h3 className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-blue-700 leading-snug transition-colors line-clamp-2">
          {service.title}
        </h3>
      </div>
    </div>
  );
}
