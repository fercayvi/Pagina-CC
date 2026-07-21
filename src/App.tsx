import React, { useState, useMemo } from 'react';
import { 
  Wifi, Battery, Shield, ArrowRight, BellRing, Info, 
  Sparkles, CheckCircle2, User, BookOpen, Clock, AlertCircle,
  ChevronLeft, ChevronRight, RefreshCw
} from 'lucide-react';
import { Service, ServiceId, UserProfile, Aviso } from './types';
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

  // Handle quick banner click to open first unread high priority notice
  const handleOpenUrgentNotice = () => {
    setCurrentTab('avisos');
  };

  return (
    <div id="app-root-layout" className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-700">
      
      {/* CENTER: Full-Screen Device Viewport (No simulated device frame borders, clean full screen browser interface) */}
      <main 
        id="phone-wrapper-container"
        className="w-full min-h-screen bg-slate-50 flex flex-col relative"
      >
        {/* Notch / Speaker bar: visible ONLY on smartphone (mobile) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5.5 bg-slate-900 rounded-b-xl z-50 flex items-center justify-center md:hidden">
          <div className="w-10 h-1 bg-slate-800 rounded-full"></div>
        </div>

        {/* INNER SCREEN CONTAINER */}
        <div 
          id="phone-screen-container"
          className="w-full flex-1 bg-slate-50 overflow-hidden flex flex-col relative"
        >
          {/* Mobile Status Bar: hidden on desktop browser view */}
          <div className="h-9 bg-white px-6 flex justify-between items-center shrink-0 z-30 pt-3 text-slate-900 md:hidden">
            <span className="text-[10px] font-extrabold tracking-tight">11:05</span>
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black uppercase tracking-wider">4G</span>
              <Battery className="w-4 h-4 text-slate-900" />
            </div>
          </div>

          {/* Desktop Browser Header bar: visible only on md/lg screens */}
          <div className="hidden md:flex items-center justify-between h-12 bg-slate-100 border-b border-slate-200/85 px-6 shrink-0 z-30 select-none">
            {/* Mac style Action Buttons */}
            <div className="flex items-center gap-1.5 w-20">
              <span className="w-3 h-3 rounded-full bg-rose-400"></span>
              <span className="w-3 h-3 rounded-full bg-amber-400"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-3.5 text-slate-400 px-2 shrink-0">
              <ChevronLeft 
                className="w-4.5 h-4.5 cursor-pointer hover:text-slate-600 transition-colors" 
                onClick={() => selectedService && setSelectedService(null)} 
              />
              <ChevronRight className="w-4.5 h-4.5 opacity-40 cursor-not-allowed" />
              <RefreshCw className="w-3.5 h-3.5 ml-0.5 cursor-pointer hover:text-slate-600 transition-colors" onClick={() => window.location.reload()} />
            </div>

            {/* URL bar */}
            <div className="flex-1 max-w-xl bg-white border border-slate-200/80 rounded-lg py-1 px-3.5 flex items-center justify-between text-[11px] text-slate-500 font-semibold shadow-2xs mx-4">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-emerald-500 font-extrabold text-xs">🔒</span>
                <span className="tracking-tight text-slate-600 select-all truncate">https://servicios.planta.mx</span>
              </div>
              <span className="text-slate-300 text-[9px] select-none">100%</span>
            </div>

            {/* Platform Tag */}
            <div className="w-20 flex justify-end">
              <div className="bg-slate-200/60 text-slate-600 font-extrabold text-[9px] px-2.5 py-0.5 rounded-md tracking-wider uppercase">
                PORTAL DETALLADO
              </div>
            </div>
          </div>

          {/* TAB CONTENT SCROLLABLE CANVAS */}
          <div id="phone-main-scrollable-content" className="flex-1 overflow-y-auto pt-4 pb-24 relative">
            <div className="max-w-5xl mx-auto w-full px-4 md:px-8">
            
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
                  <div className="space-y-4.5 animate-fadeIn">
                    
                    {/* TopBar with Search, Avatar, and Greeting Card */}
                    <TopBar 
                      searchQuery={searchQuery} 
                      setSearchQuery={setSearchQuery} 
                      user={user} 
                      onOpenProfile={() => setCurrentTab('perfil')}
                    />

                    {/* Urgent Notification Banner (Only if unread high-priority notices exist) */}
                    {avisos.some(a => !a.read && a.urgency === 'alta') && (
                      <button
                        id="urgent-notice-banner"
                        onClick={handleOpenUrgentNotice}
                        className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-2xl p-3.5 text-left flex items-start justify-between transition-all hover:scale-[1.01] active:scale-99 shadow-md"
                      >
                        <div className="flex gap-2.5 items-start">
                          <AlertCircle className="w-4.5 h-4.5 mt-0.5 shrink-0 text-white animate-pulse" />
                          <div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-100">Aviso Urgente de Transporte</h4>
                            <p className="text-xs font-bold leading-snug mt-1">Cambio de parada en la Ruta Oriente por obras viales.</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4.5 h-4.5 shrink-0 text-white mt-1" />
                      </button>
                    )}

                    {/* Horizontal Categories Filters */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          id={`category-tab-${cat.id}`}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`py-1.5 px-4 rounded-full text-xs font-extrabold shrink-0 border-2 transition-all ${
                            selectedCategory === cat.id
                              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                              : 'bg-white text-slate-500 border-slate-200/80 hover:bg-slate-100 hover:text-slate-700'
                          }`}
                          style={{ minHeight: '36px' }}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    {/* Responsive Grid of Services (2 columns on mobile, adapts to 3 columns on tablet/medium browser, 4 columns on desktop browser mockup) */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
                      {filteredServices.map((service) => (
                        <ServiceCard
                          key={service.id}
                          service={service}
                          onClick={() => setSelectedService(service)}
                        />
                      ))}
                    </div>

                    {filteredServices.length === 0 && (
                      <div className="text-center py-10 bg-white border border-slate-100 rounded-2xl p-4">
                        <Info className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs font-bold text-slate-700">No encontramos resultados</p>
                        <p className="text-[10px] text-slate-400 mt-1">Intenta buscando otra palabra, o entra directo al tema de Preguntas Frecuentes.</p>
                      </div>
                    )}

                    {/* Wireframe notes section inside the grid bottom (as shown in the wireframe image) */}
                    <div className="bg-slate-100 border border-slate-200/50 rounded-2xl p-4 text-[10px] text-slate-500 leading-relaxed space-y-1">
                      <p className="font-extrabold text-slate-600 uppercase tracking-wider text-[9px]">Notas de Interacción (Prototipo)</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        <li>Tarjetas: mín. 110px de alto, cuadrícula de 2 columnas.</li>
                        <li>Áreas táctiles: mín. 48px de alto para fácil uso en planta.</li>
                        <li>La búsqueda y filtros actualizan el menú en tiempo real.</li>
                        <li>Toca cualquier tarjeta para abrir su flujo interactivo.</li>
                      </ul>
                    </div>

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
