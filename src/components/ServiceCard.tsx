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
          iconBg: 'bg-blue-100 text-blue-800 border-2 border-blue-200',
          badge: 'bg-blue-100 text-blue-900 border border-blue-300 font-black',
          tag: 'Nómina y Pagos'
        };
      case 'Tarjetas y Créditos':
        return {
          cardBg: 'bg-white border-2 border-slate-300 hover:border-purple-600 shadow-md hover:shadow-xl',
          iconBg: 'bg-purple-100 text-purple-800 border-2 border-purple-200',
          badge: 'bg-purple-100 text-purple-900 border border-purple-300 font-black',
          tag: 'Tarjetas y Créditos'
        };
      case 'Control y Asistencia':
      default:
        return {
          cardBg: 'bg-white border-2 border-slate-300 hover:border-emerald-600 shadow-md hover:shadow-xl',
          iconBg: 'bg-emerald-100 text-emerald-800 border-2 border-emerald-200',
          badge: 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-black',
          tag: 'Control y Asistencia'
        };
    }
  };

  const styles = getCategoryStyles(service.category);

  return (
    <button
      id={`service-card-${service.id}`}
      onClick={onClick}
      className={`group border rounded-2xl p-5 sm:p-6 h-full flex flex-col justify-between text-left transition-all active:scale-[0.97] cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500/30 ${styles.cardBg}`}
      style={{ minHeight: '180px' }}
    >
      <div className="flex justify-between items-start w-full gap-2">
        <div className={`p-3 rounded-2xl ${styles.iconBg} transition-transform group-hover:scale-110 shrink-0 flex items-center justify-center shadow-xs`}>
          <IconComponent className="w-6 h-6" strokeWidth={2.5} />
        </div>
        <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${styles.badge} tracking-tight shrink-0 shadow-2xs`}>
          {styles.tag}
        </span>
      </div>

      <div className="mt-4 flex-grow flex flex-col justify-between">
        <h3 className="text-base font-extrabold text-slate-900 tracking-tight leading-snug group-hover:text-blue-700 transition-colors mb-1.5">
          {service.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-700 font-medium line-clamp-3 leading-relaxed flex-grow">
          {service.shortDesc}
        </p>
      </div>
    </button>
  );
}

