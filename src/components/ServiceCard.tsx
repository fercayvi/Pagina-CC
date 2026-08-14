import React from 'react';
import * as Icons from 'lucide-react';
import {
  Banknote,
  FileText,
  FileCheck,
  HelpCircle,
  CreditCard,
  PiggyBank,
  Home,
  Calendar,
  CalendarDays,
  Shield,
  ShieldAlert,
  Clock,
  Briefcase
} from 'lucide-react';
import { Service } from '../types';

// Dictionary mapping icon names to Lucide icon components
export const SERVICE_ICON_MAP: Record<string, React.ComponentType<any>> = {
  Banknote,
  FileText,
  FileCheck,
  HelpCircle,
  CreditCard,
  PiggyBank,
  Home,
  Calendar,
  CalendarDays,
  Shield,
  ShieldAlert,
  Clock,
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

  // Kiosk-optimized styles with high contrast, prominent soft backgrounds and crisp borders
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'Nómina y Pagos':
        return {
          cardBorder: 'border-slate-200 hover:border-blue-500',
          iconBg: 'bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600',
        };
      case 'Tarjetas y Créditos':
        return {
          cardBorder: 'border-slate-200 hover:border-purple-500',
          iconBg: 'bg-purple-50 text-purple-600 border-purple-100 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600',
        };
      case 'Control y Asistencia':
        return {
          cardBorder: 'border-slate-200 hover:border-emerald-500',
          iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600',
        };
      default:
        return {
          cardBorder: 'border-slate-200 hover:border-slate-500',
          iconBg: 'bg-slate-100 text-slate-700 border-slate-200 group-hover:bg-slate-800 group-hover:text-white group-hover:border-slate-800',
        };
    }
  };

  const styles = getCategoryStyles(service.category);

  return (
    <button
      id={`service-card-${service.id}`}
      onClick={onClick}
      className={`group relative bg-white border-2 ${styles.cardBorder} rounded-2xl p-3.5 sm:p-4 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.98] cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500/20 w-full`}
    >
      <div className="mb-2">
        {/* Large Kiosk Icon Box */}
        <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl ${styles.iconBg} border flex items-center justify-center transition-all duration-200 shadow-xs shrink-0 mx-auto`}>
          <IconComponent className="w-6.5 h-6.5 sm:w-7 sm:h-7 transition-transform duration-200 group-hover:scale-110" strokeWidth={2.3} />
        </div>
      </div>

      <div className="w-full">
        <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors">
          {service.title}
        </h3>
      </div>
    </button>
  );
}

