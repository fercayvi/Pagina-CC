import React, { useState, useMemo } from 'react';
import {
  LayoutGrid,
  Wallet,
  CreditCard,
  CalendarClock,
  ArrowLeft,
  Info
} from 'lucide-react';
import { Service } from '../types';
import ServiceCard from './ServiceCard';

export type MainCategory =
  | 'Todos los trámites'
  | 'Nómina y Pagos'
  | 'Tarjetas y Créditos'
  | 'Control y Asistencia';

export const MAIN_CATEGORIES = [
  {
    id: 'Todos los trámites' as const,
    label: 'Todos los trámites',
    icon: LayoutGrid,
    iconColor: 'text-indigo-600',
    bgLight: 'bg-indigo-50/80 border-indigo-100',
  },
  {
    id: 'Nómina y Pagos' as const,
    label: 'Nómina y Pagos',
    icon: Wallet,
    iconColor: 'text-emerald-600',
    bgLight: 'bg-emerald-50/80 border-emerald-100',
  },
  {
    id: 'Tarjetas y Créditos' as const,
    label: 'Tarjetas y Créditos',
    icon: CreditCard,
    iconColor: 'text-violet-600',
    bgLight: 'bg-violet-50/80 border-violet-100',
  },
  {
    id: 'Control y Asistencia' as const,
    label: 'Control y Asistencia',
    icon: CalendarClock,
    iconColor: 'text-amber-600',
    bgLight: 'bg-amber-50/80 border-amber-100',
  },
] as const;

interface HomeTabProps {
  services: (Service & { hidden?: boolean })[];
  onSelectService: (service: Service & { hidden?: boolean }) => void;
  selectedCategory?: string | null;
  onSelectCategory?: (category: string | null) => void;
}

export default function HomeTab({
  services,
  onSelectService,
  selectedCategory: controlledCategory,
  onSelectCategory,
}: HomeTabProps) {
  // 1. Manejo de Estado (inicializado en null)
  const [internalCategory, setInternalCategory] = useState<string | null>(null);

  const selectedCategory = controlledCategory !== undefined 
    ? controlledCategory 
    : internalCategory;

  const handleCategoryChange = (cat: string | null) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
    setInternalCategory(cat);
  };

  // Filtrado de servicios para Nivel 2
  const filteredServices = useMemo(() => {
    if (!selectedCategory) return [];
    return services.filter((service) => {
      if (service.hidden) return false;
      // Si es 'Todos los trámites', muestra TODO el arreglo de servicios
      if (selectedCategory === 'Todos los trámites') return true;
      // Si es otra categoría, aplica un .filter() para mostrar solo los correspondientes
      return service.category === selectedCategory;
    });
  }, [services, selectedCategory]);

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'Todos los trámites') {
      return services.filter(s => !s.hidden).length;
    }
    return services.filter(s => !s.hidden && s.category === categoryId).length;
  };

  return (
    <div className="w-full">
      {/* 2. VISTA INICIAL (NIVEL 1 - CATEGORÍAS GIGANTES) */}
      {selectedCategory === null ? (
        <div className="py-2 animate-fadeIn">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {MAIN_CATEGORIES.map((cat) => {
              const IconComponent = cat.icon;
              const count = getCategoryCount(cat.id);

              return (
                <button
                  key={cat.id}
                  type="button"
                  id={`cat-card-${cat.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => handleCategoryChange(cat.id)}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-500 transition-all cursor-pointer flex flex-col items-center justify-center p-6 gap-4 text-center aspect-square group active:scale-[0.98]"
                >
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border flex items-center justify-center transition-transform group-hover:scale-110 shadow-2xs ${cat.bgLight}`}>
                    <IconComponent className={`w-8 h-8 sm:w-10 sm:h-10 ${cat.iconColor}`} />
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {cat.label}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium mt-1">
                      {count} {count === 1 ? 'trámite' : 'trámites'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* 3. VISTA SECUNDARIA (NIVEL 2 - TRÁMITES DE LA CATEGORÍA) */
        <div className="py-2 animate-fadeIn">
          {/* a) Botón superior de volver a categorías */}
          <div>
            <button
              type="button"
              id="back-to-categories-btn"
              onClick={() => handleCategoryChange(null)}
              className="text-blue-600 font-bold hover:bg-blue-50 px-4 py-2 rounded-xl mb-6 inline-flex items-center gap-2 -ml-4 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver a Categorías</span>
            </button>
          </div>

          {/* b) Título de la categoría seleccionada en grande */}
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            {selectedCategory}
          </h2>

          {/* c) Cuadrícula con las tarjetas de los trámites */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2.5 sm:gap-3.5 pb-2">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onClick={() => onSelectService(service)}
              />
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-10 bg-white border border-slate-200 rounded-2xl p-6">
              <Info className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">No se encontraron trámites</p>
              <p className="text-[11px] text-slate-400 mt-1">No hay trámites disponibles en esta categoría.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
