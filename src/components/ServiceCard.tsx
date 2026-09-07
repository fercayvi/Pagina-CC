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

interface ServiceCardProps {
  key?: string;
  service: Service;
  onClick: () => void;
}

export default function ServiceCard({ service, onClick }: ServiceCardProps) {
  // Dynamically resolve icon from dictionary with fallback to FileText
  const iconKey = service.iconName || service.icon || 'FileText';
  const IconComponent = SERVICE_ICON_MAP[iconKey] || (Icons as any)[iconKey] || FileText;

  return (
    <button
      id={`service-card-${service.id}`}
      onClick={onClick}
      type="button"
      className="group relative bg-white border border-slate-200 hover:border-blue-500 rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all duration-150 active:scale-95 cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500/20 w-full min-h-[140px] sm:min-h-[160px]"
    >
      <div className="mb-3.5 flex items-center justify-center">
        {service.cardImage && typeof service.cardImage === 'string' && service.cardImage.trim().length > 0 ? (
          <img 
            src={service.cardImage} 
            alt={service.title} 
            className="w-16 h-16 sm:w-18 sm:h-18 rounded-full object-cover shadow-xs border-2 border-slate-100 transition-transform duration-150 group-hover:scale-105" 
          />
        ) : (
          /* Ícono dentro de un círculo con fondo de color suave */
          <div className="w-16 h-16 sm:w-18 sm:h-18 p-4 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-150 flex items-center justify-center shadow-xs">
            <IconComponent size={32} strokeWidth={2.5} className="transition-transform duration-150 group-hover:scale-110" />
          </div>
        )}
      </div>

      <div className="w-full">
        <h3 className="text-base sm:text-lg font-bold text-slate-800 group-hover:text-blue-700 leading-snug transition-colors">
          {service.title}
        </h3>
      </div>
    </button>
  );
}

