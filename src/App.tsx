import React, { useState, useMemo } from 'react';
import { Info } from 'lucide-react';
import { Service, NewsItem, UserProfile } from './types';
import { servicesData, newsData, userProfileData } from './data';
import BottomNav from './components/BottomNav';
import TopBar from './components/TopBar';
import ServiceCard from './components/ServiceCard';
import ServiceDetail from './components/ServiceDetail';
import NewsTab from './components/NewsTab';
import AsistenteTab from './components/AsistenteTab';
import AdminPanel from './components/AdminPanel';
import AdminLoginModal from './components/AdminLoginModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'inicio' | 'noticias' | 'asistente'>('inicio');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'Nómina y Pagos' | 'Tarjetas y Créditos' | 'Control y Asistencia'>('all');
  
  // Admin State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Dynamic content states
  const [services, setServices] = useState<(Service & { hidden?: boolean })[]>(servicesData);
  const [news, setNews] = useState<NewsItem[]>(newsData);

  // Public user context
  const user: UserProfile = userProfileData;

  // Filter services based on search text, category selection, and non-hidden status in public view
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      if (service.hidden) return false;

      const matchesSearch = 
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [services, searchQuery, selectedCategory]);

  // Categories helper
  const categories = [
    { id: 'all', label: 'Todos los trámites' },
    { id: 'Nómina y Pagos', label: 'Nómina y Pagos' },
    { id: 'Tarjetas y Créditos', label: 'Tarjetas y Créditos' },
    { id: 'Control y Asistencia', label: 'Control y Asistencia' },
  ] as const;

  return (
    <div id="app-root-layout" className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      
      {/* MAIN VIEWPORT CONTAINER */}
      <main id="phone-wrapper-container" className="w-full min-h-screen flex flex-col relative">
        <div id="phone-screen-container" className="w-full flex-1 overflow-hidden flex flex-col relative">

          {/* TAB CONTENT SCROLLABLE CANVAS */}
          <div id="phone-main-scrollable-content" className={`flex-1 overflow-y-auto pt-4 relative ${isAdminLoggedIn ? 'pb-8' : 'pb-24'}`}>
            <div className="max-w-4xl mx-auto w-full px-4 md:px-6">
            
            {/* ADMIN VIEW */}
            {isAdminLoggedIn ? (
              <AdminPanel
                services={services}
                onUpdateServices={setServices}
                news={news}
                onUpdateNews={setNews}
                onLogout={() => setIsAdminLoggedIn(false)}
              />
            ) : (
              <>
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
                        
                        {/* TopBar with Title, Search & Admin Lock */}
                        <TopBar 
                          searchQuery={searchQuery} 
                          setSearchQuery={setSearchQuery} 
                          onOpenAdminLogin={() => setIsLoginModalOpen(true)}
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
                            <p className="text-xs font-bold text-slate-700">No se encontraron trámites</p>
                            <p className="text-[11px] text-slate-400 mt-1">Prueba buscando con otros términos o seleccionando otra categoría.</p>
                          </div>
                        )}

                      </div>
                    )}
                  </>
                )}

                {/* TAB 2: NOTICIAS */}
                {currentTab === 'noticias' && <NewsTab newsList={news} />}

                {/* TAB 3: ASISTENTE */}
                {currentTab === 'asistente' && <AsistenteTab user={user} />}
              </>
            )}

            </div>
          </div>

          {/* Bottom Fixed Navigation Bar (Hidden when in Admin Mode) */}
          {!isAdminLoggedIn && (
            <BottomNav 
              currentTab={currentTab} 
              setCurrentTab={(tab) => {
                setCurrentTab(tab);
                // Reset service detail view when switching tabs
                setSelectedService(null);
              }} 
            />
          )}

        </div>
      </main>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => setIsAdminLoggedIn(true)}
      />

    </div>
  );
}

