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

  // Kiosk-optimized styles with high contrast, prominent shadows and borders
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'Nómina y Pagos':
        return {
          cardBg: 'bg-white border-2 border-slate-300 hover:border-blue-600 shadow-md hover:shadow-xl',
          iconBg: 'bg-blue-100 text-blue-800 border-2 border-blue-200'
        };
      case 'Tarjetas y Créditos':
        return {
          cardBg: 'bg-white border-2 border-slate-300 hover:border-purple-600 shadow-md hover:shadow-xl',
          iconBg: 'bg-purple-100 text-purple-800 border-2 border-purple-200'
        };
      case 'Control y Asistencia':
      default:
        return {
          cardBg: 'bg-white border-2 border-slate-300 hover:border-emerald-600 shadow-md hover:shadow-xl',
          iconBg: 'bg-emerald-100 text-emerald-800 border-2 border-emerald-200'
        };
    }
  };

  const styles = getCategoryStyles(service.category);

  return (
    <button
      id={`service-card-${service.id}`}
      onClick={onClick}
      className={`group border rounded-2xl p-3.5 sm:p-4 h-full flex flex-col justify-between text-left transition-all active:scale-[0.97] cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500/30 ${styles.cardBg}`}
      style={{ minHeight: '135px' }}
    >
      <div className="flex items-center justify-between w-full">
        <div className={`p-2 sm:p-2.5 rounded-xl ${styles.iconBg} transition-transform group-hover:scale-110 shrink-0 flex items-center justify-center shadow-xs`}>
          <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
        </div>
      </div>

      <div className="mt-2 flex-grow flex flex-col justify-between">
        <h3 className="text-sm font-extrabold text-slate-900 tracking-tight leading-snug group-hover:text-blue-700 transition-colors mb-1">
          {service.title}
        </h3>
        <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed">
          {service.shortDesc}
        </p>
      </div>
    </button>
  );
}

