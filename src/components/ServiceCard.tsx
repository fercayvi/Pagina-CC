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

  // High-contrast vibrant color palettes tailored per icon & category
  const getIconAndCardStyles = (icon: string, category: string) => {
    switch (icon) {
      case 'Banknote':
      case 'Coins':
        return {
          cardBorder: 'border-slate-200 hover:border-emerald-500',
          iconBg: 'bg-emerald-100 text-emerald-700 border-emerald-300 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600',
          titleHover: 'group-hover:text-emerald-700'
        };
      case 'ReceiptText':
      case 'FileCheck':
      case 'FileText':
        return {
          cardBorder: 'border-slate-200 hover:border-blue-500',
          iconBg: 'bg-blue-100 text-blue-700 border-blue-300 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600',
          titleHover: 'group-hover:text-blue-700'
        };
      case 'HelpCircle':
        return {
          cardBorder: 'border-slate-200 hover:border-indigo-500',
          iconBg: 'bg-indigo-100 text-indigo-700 border-indigo-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600',
          titleHover: 'group-hover:text-indigo-700'
        };
      case 'CreditCard':
      case 'Wallet':
        return {
          cardBorder: 'border-slate-200 hover:border-purple-500',
          iconBg: 'bg-purple-100 text-purple-700 border-purple-300 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600',
          titleHover: 'group-hover:text-purple-700'
        };
      case 'PiggyBank':
      case 'HandCoins':
        return {
          cardBorder: 'border-slate-200 hover:border-amber-500',
          iconBg: 'bg-amber-100 text-amber-700 border-amber-300 group-hover:bg-amber-600 group-hover:text-white group-hover:border-amber-600',
          titleHover: 'group-hover:text-amber-700'
        };
      case 'Home':
        return {
          cardBorder: 'border-slate-200 hover:border-cyan-500',
          iconBg: 'bg-cyan-100 text-cyan-700 border-cyan-300 group-hover:bg-cyan-600 group-hover:text-white group-hover:border-cyan-600',
          titleHover: 'group-hover:text-cyan-700'
        };
      case 'Palmtree':
      case 'Sun':
      case 'Calendar':
      case 'CalendarDays':
        return {
          cardBorder: 'border-slate-200 hover:border-orange-500',
          iconBg: 'bg-orange-100 text-orange-600 border-orange-300 group-hover:bg-orange-600 group-hover:text-white group-hover:border-orange-600',
          titleHover: 'group-hover:text-orange-700'
        };
      case 'Stethoscope':
      case 'Cross':
      case 'ShieldAlert':
      case 'Shield':
        return {
          cardBorder: 'border-slate-200 hover:border-rose-500',
          iconBg: 'bg-rose-100 text-rose-600 border-rose-300 group-hover:bg-rose-600 group-hover:text-white group-hover:border-rose-600',
          titleHover: 'group-hover:text-rose-700'
        };
      case 'Fingerprint':
      case 'UserCheck':
      case 'Clock':
        return {
          cardBorder: 'border-slate-200 hover:border-teal-500',
          iconBg: 'bg-teal-100 text-teal-700 border-teal-300 group-hover:bg-teal-600 group-hover:text-white group-hover:border-teal-600',
          titleHover: 'group-hover:text-teal-700'
        };
      default:
        // Fallback based on category
        if (category === 'Nómina y Pagos') {
          return {
            cardBorder: 'border-slate-200 hover:border-blue-500',
            iconBg: 'bg-blue-100 text-blue-700 border-blue-300 group-hover:bg-blue-600 group-hover:text-white',
            titleHover: 'group-hover:text-blue-700'
          };
        } else if (category === 'Tarjetas y Créditos') {
          return {
            cardBorder: 'border-slate-200 hover:border-purple-500',
            iconBg: 'bg-purple-100 text-purple-700 border-purple-300 group-hover:bg-purple-600 group-hover:text-white',
            titleHover: 'group-hover:text-purple-700'
          };
        } else {
          return {
            cardBorder: 'border-slate-200 hover:border-emerald-500',
            iconBg: 'bg-emerald-100 text-emerald-700 border-emerald-300 group-hover:bg-emerald-600 group-hover:text-white',
            titleHover: 'group-hover:text-emerald-700'
          };
        }
    }
  };

  const styles = getIconAndCardStyles(iconKey, service.category);

  return (
    <button
      id={`service-card-${service.id}`}
      onClick={onClick}
      className={`group relative bg-white border-2 ${styles.cardBorder} rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.98] cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500/20 w-full`}
    >
      <div className="mb-2.5 flex items-center justify-center">
        {service.cardImage && service.cardImage.trim().length > 0 ? (
          <img 
            src={service.cardImage} 
            alt={service.title} 
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-sm border border-slate-100 transition-transform duration-200 group-hover:scale-105" 
          />
        ) : (
          /* Large Vibrant Kiosk Icon Box */
          <div className={`w-16 h-16 rounded-2xl ${styles.iconBg} border-2 flex items-center justify-center transition-all duration-200 shadow-sm shrink-0 mx-auto`}>
            <IconComponent size={36} strokeWidth={2.5} className="transition-transform duration-200 group-hover:scale-110" />
          </div>
        )}
      </div>

      <div className="w-full">
        <h3 className={`text-base sm:text-lg font-bold text-slate-800 leading-snug ${styles.titleHover} transition-colors`}>
          {service.title}
        </h3>
      </div>
    </button>
  );
}

