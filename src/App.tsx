import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Service, NewsItem, UserProfile, ContactInfo, CategoryConfig } from './types';
import { initialServices, initialNews, userProfileData, initialContact, defaultCategories } from './data';
import BottomNav from './components/BottomNav';
import TopBar from './components/TopBar';
import HomeTab from './components/HomeTab';
import ServiceDetail from './components/ServiceDetail';
import NewsTab from './components/NewsTab';
import AsistenteTab from './components/AsistenteTab';
import SearchTab from './components/SearchTab';
import AdminPanel from './components/AdminPanel';
import AdminLoginModal from './components/AdminLoginModal';
import ScrollProgressBar from './components/ScrollProgressBar';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'inicio' | 'buscar' | 'noticias' | 'asistente'>('inicio');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedService, setSelectedService] = useState<(Service & { hidden?: boolean }) | null>(null);
  const [serviceEditMode, setServiceEditMode] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Admin State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isImageZoomed, setIsImageZoomed] = useState<boolean>(false);
  const [unreadNewsCount, setUnreadNewsCount] = useState<number>(0);

  // 100% Offline / LocalStorage State Initialization
  const [services, setServices] = useState<(Service & { hidden?: boolean })[]>(() => {
    try {
      const saved = localStorage.getItem('cc-services-cms-v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((s: Service) => {
            if (!s.tags || s.tags.length === 0) {
              const defaultMatch = initialServices.find(init => init.id === s.id);
              if (defaultMatch && defaultMatch.tags) {
                return { ...s, tags: defaultMatch.tags };
              }
            }
            return s;
          });
        }
      }
      return initialServices;
    } catch (e) {
      console.error('Error al cargar trámites desde localStorage:', e);
      return initialServices;
    }
  });

  const [news, setNews] = useState<NewsItem[]>(() => {
    try {
      const saved = localStorage.getItem('cc-news');
      return saved ? JSON.parse(saved) : initialNews;
    } catch (e) {
      console.error('Error al cargar noticias desde localStorage:', e);
      return initialNews;
    }
  });

  const [contactInfo, setContactInfo] = useState<ContactInfo>(() => {
    try {
      const saved = localStorage.getItem('portalContactInfo') || localStorage.getItem('cc-contact');
      if (saved) {
        return { ...initialContact, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Error al cargar contacto desde localStorage:', e);
    }
    return initialContact;
  });

  const [categories, setCategories] = useState<CategoryConfig[]>(() => {
    try {
      const saved = localStorage.getItem('cc-categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error al cargar categorías desde localStorage:', e);
    }
    return defaultCategories;
  });

  const handleUpdateCategories = (newCategories: CategoryConfig[], updatedServices?: (Service & { hidden?: boolean })[]) => {
    setCategories(newCategories);
    try {
      localStorage.setItem('cc-categories', JSON.stringify(newCategories));
    } catch (err) {
      console.error('Error al guardar categorías:', err);
    }

    if (updatedServices) {
      setServices(updatedServices);
      try {
        localStorage.setItem('cc-services-cms-v1', JSON.stringify(updatedServices));
      } catch (err) {
        console.error('Error al guardar servicios actualizados:', err);
      }
    }
  };

  // Guardar trámites en localStorage de forma reactiva
  useEffect(() => {
    try {
      localStorage.setItem('cc-services-cms-v1', JSON.stringify(services));
    } catch (e: any) {
      console.error('Error al guardar trámites en localStorage:', e);
      if (e?.name === 'QuotaExceededError' || e?.code === 22) {
        alert('Aviso de almacenamiento: Se ha alcanzado el límite de 5MB en localStorage. Procura usar enlaces URL para imágenes pesadas o eliminar elementos obsoletos.');
      }
    }
  }, [services]);

  // Guardar noticias en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cc-news', JSON.stringify(news));
    } catch (e) {
      console.error('Error al guardar noticias en localStorage:', e);
    }
  }, [news]);

  // Guardar información de contacto en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('portalContactInfo', JSON.stringify(contactInfo));
      localStorage.setItem('cc-contact', JSON.stringify(contactInfo));
    } catch (e) {
      console.error('Error al sincronizar contactInfo en localStorage:', e);
    }
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
        setSelectedCategory(null);
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

  // Handler para actualizar un trámite individual
  const handleUpdateService = (updated: Service & { hidden?: boolean }) => {
    setServices(prev => {
      const exists = prev.some(s => s.id === updated.id);
      const nextServices = exists 
        ? prev.map(s => s.id === updated.id ? updated : s) 
        : [updated, ...prev];

      try {
        localStorage.setItem('cc-services-cms-v1', JSON.stringify(nextServices));
      } catch (err) {
        console.error('Error guardando trámite actualizado en localStorage:', err);
      }
      return nextServices;
    });
    setSelectedService(updated);
  };

  // Handler para actualizar la lista completa de trámites
  const handleUpdateServices = (newServices: (Service & { hidden?: boolean })[]) => {
    setServices(newServices);
    try {
      localStorage.setItem('cc-services-cms-v1', JSON.stringify(newServices));
    } catch (err) {
      console.error('Error guardando catálogo de trámites en localStorage:', err);
    }
  };

  // Handler para actualizar la información de contacto
  const handleUpdateContact = (updatedContact: ContactInfo) => {
    setContactInfo(updatedContact);
    try {
      localStorage.setItem('portalContactInfo', JSON.stringify(updatedContact));
      localStorage.setItem('cc-contact', JSON.stringify(updatedContact));
    } catch (err) {
      console.error('Error guardando contacto en localStorage:', err);
    }
  };

  const handleSelectService = (service: Service & { hidden?: boolean }, startEditing: boolean = false) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const scrollContainer = document.getElementById('phone-main-scrollable-content');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'instant' });
    }
    setSelectedService(service);
    setServiceEditMode(startEditing);
  };

  return (
    <div id="app-root-layout" className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* MAIN VIEWPORT CONTAINER */}
      <main id="phone-wrapper-container" className="w-full min-h-screen flex flex-col relative">
        <div id="phone-screen-container" className="w-full flex-1 overflow-hidden flex flex-col relative">

          {/* TAB CONTENT SCROLLABLE CANVAS */}
          <div id="phone-main-scrollable-content" className={`flex-1 overflow-y-auto pt-2 sm:pt-3 relative ${isAdminLoggedIn ? 'pb-8' : 'pb-28'}`}>
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            
            {/* RENDER SELECTED SERVICE DETAIL (Public or Admin) WITH LIGHT FULLSCREEN BACKDROP */}
            {selectedService ? (
              <div className="relative animate-fadeIn min-h-screen">
                {/* Light Full-Screen Background Overlay (Static background, no click-to-close on margins) */}
                <div 
                  id="service-detail-backdrop"
                  className="fixed inset-0 bg-slate-50 z-30 pointer-events-none"
                  aria-hidden="true"
                />

                {/* Service Detail Full-Width Kiosk Container */}
                <div className="relative z-40 w-full max-w-5xl mx-auto px-1 sm:px-3 py-1 sm:py-3">
                  <ServiceDetail 
                    service={selectedService} 
                    user={user} 
                    onBack={() => {
                      setSelectedService(null);
                      setServiceEditMode(false);
                      setIsImageZoomed(false);
                    }} 
                    isAdminLoggedIn={isAdminLoggedIn}
                    onUpdateService={handleUpdateService}
                    initialEditMode={serviceEditMode}
                    onLightboxToggle={setIsImageZoomed}
                  />
                </div>
              </div>
            ) : (
              /* ADMIN PANEL OR PUBLIC TABS */
              isAdminLoggedIn ? (
                <AdminPanel
                  services={services}
                  onUpdateServices={handleUpdateServices}
                  onSelectService={handleSelectService}
                  news={news}
                  onUpdateNews={setNews}
                  contactInfo={contactInfo}
                  onUpdateContact={handleUpdateContact}
                  categories={categories}
                  onUpdateCategories={handleUpdateCategories}
                  onLogout={() => {
                    setIsAdminLoggedIn(false);
                    setSelectedService(null);
                  }}
                />
              ) : (
                <>
                  {/* TopBar with Navigation & Admin Lock Button */}
                  <TopBar 
                    setShowAdminLogin={setIsLoginModalOpen}
                    currentTab={currentTab}
                    setCurrentTab={(tab) => {
                      setCurrentTab(tab);
                      setSelectedService(null);
                    }}
                    unreadNewsCount={unreadNewsCount}
                    searchQuery={searchQuery}
                    onSearch={(query) => {
                      setSearchQuery(query);
                      setCurrentTab('buscar');
                      setSelectedService(null);
                    }}
                    onGoHome={() => {
                      window.scrollTo({ top: 0, behavior: 'instant' });
                      const scrollContainer = document.getElementById('phone-main-scrollable-content');
                      if (scrollContainer) {
                        scrollContainer.scrollTo({ top: 0, behavior: 'instant' });
                      }
                      setSelectedService(null);
                      setServiceEditMode(false);
                      setCurrentTab('inicio');
                    }}
                  />

                  {/* TAB 1: INICIO */}
                  {currentTab === 'inicio' && (
                    <div className="space-y-4 animate-fadeIn">
                      {/* Hero Search Bar */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          setCurrentTab('buscar');
                          setSelectedService(null);
                          window.scrollTo({ top: 0, behavior: 'instant' });
                          const scrollContainer = document.getElementById('phone-main-scrollable-content');
                          if (scrollContainer) {
                            scrollContainer.scrollTo({ top: 0, behavior: 'instant' });
                          }
                        }}
                        className="w-full mt-4 sm:mt-6 mb-6 relative flex items-center"
                      >
                        <div className="absolute left-4 sm:left-5 pointer-events-none flex items-center justify-center text-slate-400">
                          <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <input
                          type="text"
                          id="hero-search-input"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Ej. Vacaciones, recibos de nómina, vales, incapacidad..."
                          className="w-full pl-12 sm:pl-14 pr-12 py-3.5 sm:py-4 bg-slate-50 focus:bg-white text-base sm:text-lg text-slate-800 placeholder:text-slate-400 font-medium rounded-2xl border border-slate-200 shadow-md hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer"
                            title="Borrar búsqueda"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </form>

                      {/* Navegación por Niveles (Drill-Down de Trámites) */}
                      <HomeTab
                        services={services}
                        onSelectService={(service) => handleSelectService(service, false)}
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                        categories={categories}
                      />
                    </div>
                  )}

                  {/* TAB: BÚSQUEDA GLOBAL */}
                  {currentTab === 'buscar' && (
                    <SearchTab 
                      services={services}
                      searchQuery={searchQuery}
                      onSearchQueryChange={setSearchQuery}
                      onSelectService={(service) => handleSelectService(service, false)}
                      categories={categories}
                    />
                  )}

                  {/* TAB 2: NOTICIAS */}
                  {currentTab === 'noticias' && (
                    <NewsTab 
                      newsList={news} 
                      onUnreadCountChange={setUnreadNewsCount}
                    />
                  )}

                  {/* TAB 3: ASISTENTE */}
                  {currentTab === 'asistente' && (
                    <AsistenteTab 
                      user={user} 
                      contactInfo={contactInfo} 
                    />
                  )}
                </>
              )
            )}

            </div>
          </div>

          {/* Bottom Fixed Navigation Bar (Hidden when in Admin Mode or when image is zoomed) */}
          {!isAdminLoggedIn && !isImageZoomed && (
            <BottomNav 
              currentTab={currentTab} 
              setCurrentTab={(tab) => {
                setCurrentTab(tab);
                setSelectedService(null);
              }} 
              unreadNewsCount={unreadNewsCount}
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

      {/* Global Scroll Progress Bar */}
      <ScrollProgressBar className={isImageZoomed ? 'hidden' : ''} />

    </div>
  );
}
