import React, { useState, useMemo } from 'react';
import { Info } from 'lucide-react';
import { Service, UserProfile, Aviso } from './types';
import { servicesData, userProfileData, avisosData } from './data';
import BottomNav from './components/BottomNav';
import TopBar from './components/TopBar';
import ServiceCard from './components/ServiceCard';
import ServiceDetail from './components/ServiceDetail';
import NewsTab from './components/NewsTab';
import AvisosTab from './components/AvisosTab';
import PerfilTab from './components/PerfilTab';
import AsistenteTab from './components/AsistenteTab';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'inicio' | 'noticias' | 'avisos' | 'perfil' | 'asistente'>('inicio');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'bienestar' | 'logistica' | 'soporte' | 'servicios_personal'>('all');
  
  // State for notices to allow dynamic "Mark as read"
  const [avisos, setAvisos] = useState<Aviso[]>(avisosData);

  // Dynamic user profile info
  const user: UserProfile = userProfileData;

  // Count unread notifications
  const unreadAvisosCount = useMemo(() => {
    return avisos.filter(a => !a.read).length;
  }, [avisos]);

  // Handle marking single notice as read
  const handleMarkAsRead = (id: string) => {
    setAvisos(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  // Handle marking all notices as read
  const handleMarkAllAsRead = () => {
    setAvisos(prev => prev.map(a => ({ ...a, read: true })));
  };

  // Filter services based on search text and category selection
  const filteredServices = useMemo(() => {
    return servicesData.filter((service) => {
      const matchesSearch = 
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Categories helper
  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'bienestar', label: 'Bienestar' },
    { id: 'logistica', label: 'Logística' },
    { id: 'servicios_personal', label: 'Servicios al Personal' },
    { id: 'soporte', label: 'Soporte' },
  ] as const;

  return (
    <div id="app-root-layout" className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      
      {/* MAIN VIEWPORT CONTAINER */}
      <main id="phone-wrapper-container" className="w-full min-h-screen flex flex-col relative">
        <div id="phone-screen-container" className="w-full flex-1 overflow-hidden flex flex-col relative">

          {/* TAB CONTENT SCROLLABLE CANVAS */}
          <div id="phone-main-scrollable-content" className="flex-1 overflow-y-auto pt-4 pb-24 relative">
            <div className="max-w-4xl mx-auto w-full px-4 md:px-6">
            
            {/* TAB 1: INICIO */}
            {currentTab === 'inicio' && (
              <>
                {/* Rendering service detail or services grid */}
                {selectedService ? (
                  <ServiceDetail 
                    service={selectedService} 
                    user={user} 
                    onBack={() => setSelectedService(null)} 
                  />
                ) : (
                  <div className="space-y-4 animate-fadeIn">
                    
                    {/* TopBar with Title, Search, and Profile */}
                    <TopBar 
                      searchQuery={searchQuery} 
                      setSearchQuery={setSearchQuery} 
                      user={user} 
                      onOpenProfile={() => setCurrentTab('perfil')}
                    />

                    {/* Horizontal Categories Filters */}
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          id={`category-tab-${cat.id}`}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`py-1.5 px-3.5 rounded-xl text-xs font-bold shrink-0 border transition-all ${
                            selectedCategory === cat.id
                              ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    {/* Responsive Grid of Services Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 pb-4">
                      {filteredServices.map((service) => (
                        <ServiceCard
                          key={service.id}
                          service={service}
                          onClick={() => setSelectedService(service)}
                        />
                      ))}
                    </div>

                    {filteredServices.length === 0 && (
                      <div className="text-center py-10 bg-white border border-slate-200 rounded-2xl p-6">
                        <Info className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs font-bold text-slate-700">No se encontraron servicios</p>
                        <p className="text-[11px] text-slate-400 mt-1">Prueba buscando con otros términos o seleccionando otra categoría.</p>
                      </div>
                    )}

                  </div>
                )}
              </>
            )}

            {/* TAB 2: NOTICIAS */}
            {currentTab === 'noticias' && <NewsTab />}

            {/* TAB 3: AVISOS */}
            {currentTab === 'avisos' && (
              <AvisosTab 
                avisos={avisos} 
                onMarkAsRead={handleMarkAsRead} 
                onMarkAllAsRead={handleMarkAllAsRead} 
              />
            )}

            {/* TAB 4: PERFIL */}
            {currentTab === 'perfil' && <PerfilTab user={user} />}

            {/* TAB 5: ASISTENTE */}
            {currentTab === 'asistente' && <AsistenteTab user={user} />}

            </div>
          </div>

          {/* Bottom Fixed Navigation Bar */}
          <BottomNav 
            currentTab={currentTab} 
            setCurrentTab={(tab) => {
              setCurrentTab(tab);
              // Reset service detail view when switching tabs
              setSelectedService(null);
            }} 
            unreadAvisosCount={unreadAvisosCount}
          />

        </div>
      </main>

    </div>
  );
}

