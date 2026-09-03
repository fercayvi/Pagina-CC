import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Service, NewsItem, UserProfile, ContactInfo } from './types';
import { initialServices, initialNews, userProfileData, initialContact } from './data';
import BottomNav from './components/BottomNav';
import TopBar from './components/TopBar';
import HomeTab from './components/HomeTab';
import ServiceDetail from './components/ServiceDetail';
import NewsTab from './components/NewsTab';
import AsistenteTab from './components/AsistenteTab';
import AdminPanel from './components/AdminPanel';
import AdminLoginModal from './components/AdminLoginModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'inicio' | 'noticias' | 'asistente'>('inicio');
  const [selectedService, setSelectedService] = useState<(Service & { hidden?: boolean }) | null>(null);
  const [serviceEditMode, setServiceEditMode] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Admin State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isImageZoomed, setIsImageZoomed] = useState<boolean>(false);

  // 100% Offline / LocalStorage State Initialization
  const [services, setServices] = useState<(Service & { hidden?: boolean })[]>(() => {
    try {
      const saved = localStorage.getItem('cc-services-cms-v1');
      return saved ? JSON.parse(saved) : initialServices;
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
    setSelectedService(service);
    setServiceEditMode(startEditing);
  };

  return (
    <div id="app-root-layout" className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      
      {/* MAIN VIEWPORT CONTAINER */}
      <main id="phone-wrapper-container" className="w-full min-h-screen flex flex-col relative">
        <div id="phone-screen-container" className="w-full flex-1 overflow-hidden flex flex-col relative">

          {/* TAB CONTENT SCROLLABLE CANVAS */}
          <div id="phone-main-scrollable-content" className={`flex-1 overflow-y-auto pt-2 sm:pt-3 relative ${isAdminLoggedIn ? 'pb-8' : 'pb-28'}`}>
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
                  onLogout={() => {
                    setIsAdminLoggedIn(false);
                    setSelectedService(null);
                  }}
                />
              ) : (
                <>
                  {/* TAB 1: INICIO */}
                  {currentTab === 'inicio' && (
                    <div className="space-y-4 animate-fadeIn">
                      
                      {/* TopBar with Title & Admin Lock Button */}
                      <TopBar 
                        setShowAdminLogin={setIsLoginModalOpen}
                      />

                      {/* Banner Informativo (Recordatorio de Módulo) */}
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 sm:p-3.5 flex items-start sm:items-center gap-2.5 shadow-xs my-1">
                        <MapPin className="text-blue-600 shrink-0 mt-0.5 sm:mt-0" size={18} />
                        <p className="text-xs sm:text-sm text-blue-800 font-medium">
                          ¿Necesitas ayuda extra? Recuerda que puedes acudir a nuestro módulo de <span className="font-bold">Talento y Cultura</span>, ubicado a un lado de Ropería.
                        </p>
                      </div>

                      {/* Navegación por Niveles (Drill-Down de Trámites) */}
                      <HomeTab
                        services={services}
                        onSelectService={(service) => handleSelectService(service, false)}
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                      />

                    </div>
                  )}

                  {/* TAB 2: NOTICIAS */}
                  {currentTab === 'noticias' && <NewsTab newsList={news} />}

                  {/* TAB 3: ASISTENTE */}
                  {currentTab === 'asistente' && <AsistenteTab user={user} contactInfo={contactInfo} />}
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
