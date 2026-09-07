import React, { useState, useMemo } from 'react';
import {
  LayoutGrid,
  Wallet,
  CreditCard,
  CalendarClock,
  ArrowLeft,
  Info
} from 'lucide-react';
import { Service, CategoryConfig } from '../types';
import { defaultCategories } from '../data';
import ServiceCard from './ServiceCard';

const CATEGORY_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutGrid,
  Wallet,
  CreditCard,
  CalendarClock,
};

const CATEGORY_COLOR_MAP: Record<string, { iconColor: string; bgLight: string }> = {
  indigo: {
    iconColor: 'text-indigo-600',
    bgLight: 'bg-indigo-50/80 border-indigo-100',
  },
  emerald: {
    iconColor: 'text-emerald-600',
    bgLight: 'bg-emerald-50/80 border-emerald-100',
  },
  violet: {
    iconColor: 'text-violet-600',
    bgLight: 'bg-violet-50/80 border-violet-100',
  },
  amber: {
    iconColor: 'text-amber-600',
    bgLight: 'bg-amber-50/80 border-amber-100',
  },
};

interface HomeTabProps {
  services: (Service & { hidden?: boolean })[];
  onSelectService: (service: Service & { hidden?: boolean }) => void;
  selectedCategory?: string | null;
  onSelectCategory?: (category: string | null) => void;
  categories?: CategoryConfig[];
}

export default function HomeTab({
  services,
  onSelectService,
  selectedCategory: controlledCategory,
  onSelectCategory,
  categories,
}: HomeTabProps) {
  // Manejo de Estado (inicializado en null)
  const [internalCategory, setInternalCategory] = useState<string | null>(null);

  const activeCategories = useMemo(() => {
    return categories && categories.length > 0 ? categories : defaultCategories;
  }, [categories]);

  const selectedCategory = controlledCategory !== undefined 
    ? controlledCategory 
    : internalCategory;

  const handleCategoryChange = (cat: string | null) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
    setInternalCategory(cat);
  };

  // Obtener el objeto de la categoría activa
  const activeCategoryObj = useMemo(() => {
    if (!selectedCategory) return null;
    return activeCategories.find(c => 
      c.id === selectedCategory || 
      c.label === selectedCategory || 
      c.defaultLabel === selectedCategory
    );
  }, [activeCategories, selectedCategory]);

  const categoryDisplayTitle = activeCategoryObj ? activeCategoryObj.label : selectedCategory;

  // Filtrado de servicios para Nivel 2
  const filteredServices = useMemo(() => {
    if (!selectedCategory) return [];

    // Si la categoría seleccionada es 'all' o equivalente a 'Todos los trámites'
    if (
      selectedCategory === 'all' || 
      selectedCategory === 'Todos los trámites' || 
      (activeCategoryObj && activeCategoryObj.id === 'all')
    ) {
      return services.filter(s => !s.hidden);
    }

    return services.filter((service) => {
      if (service.hidden) return false;
      if (!activeCategoryObj) {
        return service.category === selectedCategory;
      }
      return (
        service.category === activeCategoryObj.label ||
        service.category === activeCategoryObj.defaultLabel ||
        service.category === activeCategoryObj.id
      );
    });
  }, [services, selectedCategory, activeCategoryObj]);

  const getCategoryCount = (cat: CategoryConfig) => {
    if (cat.id === 'all') {
      return services.filter(s => !s.hidden).length;
    }
    return services.filter(s => 
      !s.hidden && (
        s.category === cat.label || 
        s.category === cat.defaultLabel || 
        s.category === cat.id
      )
    ).length;
  };

  return (
    <div className="w-full">
      {/* 1. VISTA INICIAL (NIVEL 1 - 4 TARJETAS PRINCIPALES) */}
      {selectedCategory === null ? (
        <div className="py-2 animate-fadeIn">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {activeCategories.map((cat) => {
              const IconComponent = CATEGORY_ICON_MAP[cat.iconName] || LayoutGrid;
              const colorStyles = CATEGORY_COLOR_MAP[cat.colorScheme] || CATEGORY_COLOR_MAP.indigo;
              const count = getCategoryCount(cat);

              return (
                <button
                  key={cat.id}
                  type="button"
                  id={`cat-card-${cat.id}`}
                  onClick={() => handleCategoryChange(cat.id)}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-500 transition-all cursor-pointer flex flex-col items-center justify-center p-6 gap-4 text-center aspect-square group active:scale-[0.98]"
                >
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border flex items-center justify-center transition-transform group-hover:scale-110 shadow-2xs ${colorStyles.bgLight}`}>
                    <IconComponent className={`w-8 h-8 sm:w-10 sm:h-10 ${colorStyles.iconColor}`} />
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
        /* 2. VISTA SECUNDARIA (NIVEL 2 - TRÁMITES DE LA CATEGORÍA SELECCIONADA) */
        <div className="py-2 animate-fadeIn">
          {/* Botón superior de volver a categorías */}
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

          {/* Título de la categoría seleccionada con nombre personalizado */}
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            {categoryDisplayTitle}
          </h2>

          {/* Cuadrícula con las tarjetas de los trámites */}
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
