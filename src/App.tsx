import React, { useState, useMemo, useEffect } from 'react';
import { Info } from 'lucide-react';
import { Service, NewsItem, UserProfile, MonthlyRecognition, ContactInfo } from './types';
import { initialServices, initialNews, initialRecognitions, userProfileData, initialContact } from './data';
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
  const [selectedService, setSelectedService] = useState<(Service & { hidden?: boolean }) | null>(null);
  const [serviceEditMode, setServiceEditMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'Nómina y Pagos' | 'Tarjetas y Créditos' | 'Control y Asistencia'>('all');
  
  // Admin State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Dynamic content states with LocalStorage persistence
  const [services, setServices] = useState<(Service & { hidden?: boolean })[]>(() => {
    const saved = localStorage.getItem('cc-services');
    return saved ? JSON.parse(saved) : initialServices;
  });
  const [news, setNews] = useState<NewsItem[]>(() => {
    const saved = localStorage.getItem('cc-news');
    return saved ? JSON.parse(saved) : initialNews;
  });
  const [recognitions, setRecognitions] = useState<MonthlyRecognition[]>(() => {
    const saved = localStorage.getItem('cc-recognitions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    const oldSaved = localStorage.getItem('cc-recognition');
    if (oldSaved) {
      try {
        const parsed = JSON.parse(oldSaved);
        if (parsed && typeof parsed === 'object') {
          return [{ id: 'rec-1', ...parsed }];
        }
      } catch (e) {
        console.error(e);
      }
    }
    return initialRecognitions;
  });
  const [contactInfo, setContactInfo] = useState<ContactInfo>(() => {
    const saved = localStorage.getItem('cc-contact');
    return saved ? JSON.parse(saved) : initialContact;
  });

  // LocalStorage Sync Effects
  useEffect(() => {
    localStorage.setItem('cc-services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('cc-news', JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem('cc-recognitions', JSON.stringify(recognitions));
  }, [recognitions]);

  useEffect(() => {
    localStorage.setItem('cc-contact', JSON.stringify(contactInfo));
  }, [contactInfo]);

  // Public user context
  const user: UserProfile = userProfileData;

  // Global Kiosk Inactivity Reset Timer (90 seconds)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const resetInactivityTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // Return to home view, close modals and admin session
        setCurrentTab('inicio');
        setSelectedService(null);
        setServiceEditMode(false);
        setIsAdminLoggedIn(false);
        setIsLoginModalOpen(false);
        setSearchQuery('');
        setSelectedCategory('all');
      }, 90000); // 90 seconds
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'touchend', 'click'];
    events.forEach((evt) => window.addEventListener(evt, resetInactivityTimer, { passive: true }));

    resetInactivityTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach((evt) => window.removeEventListener(evt, resetInactivityTimer));
    };
  }, []);

  const handleUpdateService = (updated: Service & { hidden?: boolean }) => {
    setServices(prev => {
      const exists = prev.some(s => s.id === updated.id);
      if (exists) {
        return prev.map(s => s.id === updated.id ? updated : s);
      }
      return [updated, ...prev];
    });
    setSelectedService(updated);
  };

  const handleSelectService = (service: Service & { hidden?: boolean }, startEditing: boolean = false) => {
    setSelectedService(service);
    setServiceEditMode(startEditing);
  };

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
          <div id="phone-main-scrollable-content" className={`flex-1 overflow-y-auto pt-2 sm:pt-3 relative ${isAdminLoggedIn ? 'pb-8' : 'pb-32'}`}>
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            
            {/* RENDER SELECTED SERVICE DETAIL (Public or Admin) WITH LIGHT FULLSCREEN BACKDROP */}
            {selectedService ? (
              <div className="relative animate-fadeIn min-h-screen">
                {/* Light Full-Screen Background Overlay */}
                <div 
                  id="service-detail-backdrop"
                  className="fixed inset-0 bg-slate-100 z-30 transition-opacity"
                  onClick={() => {
                    setSelectedService(null);
                    setServiceEditMode(false);
                  }}
                  title="Volver al catálogo"
                />

                {/* Service Detail Full-Width Kiosk Container */}
                <div className="relative z-40 w-full max-w-5xl mx-auto px-1 sm:px-3 py-1 sm:py-3">
                  <ServiceDetail 
                    service={selectedService} 
                    user={user} 
                    onBack={() => {
                      setSelectedService(null);
                      setServiceEditMode(false);
                    }} 
                    isAdminLoggedIn={isAdminLoggedIn}
                    onUpdateService={handleUpdateService}
                    initialEditMode={serviceEditMode}
                  />
                </div>
              </div>
            ) : (
              /* ADMIN PANEL OR PUBLIC TABS */
              isAdminLoggedIn ? (
                <AdminPanel
                  services={services}
                  onUpdateServices={setServices}
                  onSelectService={handleSelectService}
                  news={news}
                  onUpdateNews={setNews}
                  recognitions={recognitions}
                  onUpdateRecognitions={setRecognitions}
                  contactInfo={contactInfo}
                  onUpdateContact={setContactInfo}
                  onLogout={() => {
                    setIsAdminLoggedIn(false);
                    setSelectedService(null);
                  }}
                />
              ) : (
                <>
                  {/* TAB 1: INICIO */}
                  {currentTab === 'inicio' && (
                    <div className="space-y-2 sm:space-y-2.5 animate-fadeIn">
                      
                      {/* TopBar with Title, Search & Admin Lock */}
                      <TopBar 
                        searchQuery={searchQuery} 
                        setSearchQuery={setSearchQuery} 
                        onOpenAdminLogin={() => setIsLoginModalOpen(true)}
                      />

                      {/* Horizontal Categories Filters */}
                      <div className="flex gap-2 overflow-x-auto pb-0.5 no-scrollbar">
                        {categories.map((cat) => (
                          <button
                            key={cat.id}
                            id={`category-tab-${cat.id}`}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`py-1.5 px-3 rounded-xl text-xs font-extrabold shrink-0 transition-all cursor-pointer active:scale-95 ${
                              selectedCategory === cat.id
                                ? 'bg-slate-900 text-white shadow-md border-0 ring-2 ring-slate-900'
                                : 'bg-slate-200 hover:bg-slate-300 text-slate-900 border-0 shadow-xs'
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>

                      {/* Responsive Grid of Services Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 pb-4">
                        {filteredServices.map((service) => (
                          <ServiceCard
                            key={service.id}
                            service={service}
                            onClick={() => handleSelectService(service, false)}
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

                  {/* TAB 2: NOTICIAS */}
                  {currentTab === 'noticias' && <NewsTab newsList={news} recognitionsList={recognitions} />}

                  {/* TAB 3: ASISTENTE */}
                  {currentTab === 'asistente' && <AsistenteTab user={user} contactInfo={contactInfo} />}
                </>
              )
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

