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

  // Set background color base on category for visual grouping and beautiful look
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'dinero':
        return {
          cardBg: 'bg-emerald-50/40 border-emerald-100/80 hover:bg-emerald-50/80',
          iconBg: 'bg-emerald-600 text-white shadow-xs',
          badge: 'bg-emerald-100 text-emerald-800',
          tag: 'Finanzas'
        };
      case 'bienestar':
        return {
          cardBg: 'bg-rose-50/40 border-rose-100/80 hover:bg-rose-50/80',
          iconBg: 'bg-rose-600 text-white shadow-xs',
          badge: 'bg-rose-100 text-rose-800',
          tag: 'Bienestar'
        };
      case 'logistica':
        return {
          cardBg: 'bg-amber-50/40 border-amber-100/80 hover:bg-amber-50/80',
          iconBg: 'bg-amber-600 text-white shadow-xs',
          badge: 'bg-amber-100 text-amber-800',
          tag: 'Logística'
        };
      case 'servicios_personal':
        return {
          cardBg: 'bg-purple-50/40 border-purple-100/80 hover:bg-purple-50/80',
          iconBg: 'bg-purple-600 text-white shadow-xs',
          badge: 'bg-purple-100 text-purple-800',
          tag: 'Servicios al Personal'
        };
      case 'soporte':
      default:
        return {
          cardBg: 'bg-blue-50/40 border-blue-100/80 hover:bg-blue-50/80',
          iconBg: 'bg-blue-600 text-white shadow-xs',
          badge: 'bg-blue-100 text-blue-800',
          tag: 'Soporte'
        };
    }
  };

  const styles = getCategoryStyles(service.category);

  const isServiciosPersonal = service.category === 'servicios_personal';

  return (
    <button
      id={`service-card-${service.id}`}
      onClick={onClick}
      className={`border-2 rounded-2xl p-4 flex flex-col justify-between text-left transition-all active:scale-98 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${styles.cardBg} ${
        isServiciosPersonal 
          ? 'hover:scale-[1.03] hover:shadow-md hover:border-purple-200' 
          : 'hover:shadow-sm'
      }`}
      style={{ minHeight: '135px' }} // Adjusted for a bit higher polish
    >
      <div className="flex justify-between items-start w-full">
        <div className={`p-2 rounded-xl ${styles.iconBg} transition-transform flex items-center justify-center`}>
          <IconComponent className="w-5 h-5" strokeWidth={2.5} />
        </div>
        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md ${styles.badge} tracking-wider uppercase`}>
          {styles.tag}
        </span>
      </div>

      <div className="mt-3.5">
        <h3 className="text-[13px] font-extrabold text-slate-900 tracking-tight leading-tight">
          {service.title}
        </h3>
        <p className="text-[10px] text-slate-500 font-medium mt-1.5 line-clamp-2 leading-relaxed">
          {service.shortDesc}
        </p>
      </div>
    </button>
  );
}
