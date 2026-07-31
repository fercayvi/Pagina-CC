import React from 'react';
import * as Icons from 'lucide-react';
import { Service } from '../types';

interface ServiceCardProps {
  key?: string;
  service: Service;
  onClick: () => void;
}

export default function ServiceCard({ service, onClick }: ServiceCardProps) {
  // Dynamically resolve icon from lucide-react Icons collection safely
  const IconComponent = (Icons as any)[service.iconName] || Icons.HelpCircle;

  // Modern corporate color pairs
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'bienestar':
        return {
          cardBg: 'bg-white border-slate-200 hover:border-rose-300 hover:shadow-sm',
          iconBg: 'bg-rose-50 text-rose-600 border border-rose-100',
          badge: 'bg-rose-50 text-rose-700 border border-rose-200/60',
          tag: 'Bienestar'
        };
      case 'logistica':
        return {
          cardBg: 'bg-white border-slate-200 hover:border-amber-300 hover:shadow-sm',
          iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
          badge: 'bg-amber-50 text-amber-800 border border-amber-200/60',
          tag: 'Logística'
        };
      case 'servicios_personal':
        return {
          cardBg: 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-sm',
          iconBg: 'bg-purple-50 text-purple-600 border border-purple-100',
          badge: 'bg-purple-50 text-purple-800 border border-purple-200/60',
          tag: 'Servicios al Personal'
        };
      case 'soporte':
      default:
        return {
          cardBg: 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm',
          iconBg: 'bg-blue-50 text-blue-600 border border-blue-100',
          badge: 'bg-blue-50 text-blue-700 border border-blue-200/60',
          tag: 'Soporte'
        };
    }
  };

  const styles = getCategoryStyles(service.category);

  return (
    <button
      id={`service-card-${service.id}`}
      onClick={onClick}
      className={`group border rounded-2xl p-4 flex flex-col justify-between text-left transition-all active:scale-[0.98] cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900/10 ${styles.cardBg}`}
      style={{ minHeight: '140px' }}
    >
      <div className="flex justify-between items-start w-full gap-2">
        <div className={`p-2 rounded-xl ${styles.iconBg} transition-transform group-hover:scale-105 shrink-0 flex items-center justify-center`}>
          <IconComponent className="w-4.5 h-4.5" strokeWidth={2.2} />
        </div>
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${styles.badge} tracking-tight shrink-0`}>
          {styles.tag}
        </span>
      </div>

      <div className="mt-3">
        <h3 className="text-xs font-bold text-slate-900 tracking-tight leading-snug group-hover:text-blue-600 transition-colors">
          {service.title}
        </h3>
        <p className="text-[11px] text-slate-500 font-medium mt-1 line-clamp-2 leading-relaxed">
          {service.shortDesc}
        </p>
      </div>
    </button>
  );
}

