import React, { useState } from 'react';
import { 
  LogOut, 
  Layers, 
  Newspaper, 
  Plus, 
  Edit3, 
  Eye, 
  EyeOff, 
  Trash2, 
  CheckCircle2, 
  X, 
  FileText, 
  ShieldCheck,
  Save,
  Clock,
  MapPin,
  Phone,
  HelpCircle,
  ListOrdered,
  Info
} from 'lucide-react';
import { Service, NewsItem, ServiceId, StepItem, ServiceFAQ } from '../types';
import { getDefaultServiceDetails } from '../data';

interface AdminPanelProps {
  services?: (Service & { hidden?: boolean })[];
  news?: NewsItem[];
  onDeleteService?: (id: string) => void;
  onDeleteNews?: (id: string) => void;
  onUpdateServices?: (services: (Service & { hidden?: boolean })[]) => void;
  onUpdateNews?: (news: NewsItem[]) => void;
  onSelectService?: (service: Service & { hidden?: boolean }, startInEditMode?: boolean) => void;
  onLogout: () => void;
}

export default function AdminPanel({
  services = [],
  news = [],
  onDeleteService,
  onDeleteNews,
  onUpdateServices,
  onSelectService,
  onUpdateNews,
  onLogout
}: AdminPanelProps) {
  const currentServices = services;
  const currentNews = news;

  const [activeTab, setActiveTab] = useState<'tramites' | 'noticias'>('tramites');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Service Edit / Create Modal state
  const [editingService, setEditingService] = useState<(Service & { hidden?: boolean }) | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState<boolean>(false);
  const [isNewService, setIsNewService] = useState<boolean>(false);
  const [serviceModalTab, setServiceModalTab] = useState<'general' | 'pasos' | 'requisitos' | 'faqs'>('general');

  // News Edit / Create Modal state
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState<boolean>(false);
  const [isNewNews, setIsNewNews] = useState<boolean>(false);

  // Helper for notification toast
  const showToast = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const updateServicesList = (updater: (prev: (Service & { hidden?: boolean })[]) => (Service & { hidden?: boolean })[]) => {
    if (onUpdateServices) {
      onUpdateServices(updater(currentServices));
    }
  };

  const updateNewsList = (updater: (prev: NewsItem[]) => NewsItem[]) => {
    if (onUpdateNews) {
      onUpdateNews(updater(currentNews));
    }
  };

  // --- SERVICE HANDLERS ---
  const handleToggleHideService = (id: string) => {
    updateServicesList(prev => prev.map(s => s.id === id ? { ...s, hidden: !s.hidden } : s));
    showToast('Estado del trámite actualizado correctamente.');
  };

  const handleDeleteService = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este trámite por completo?')) {
      if (onDeleteService) {
        onDeleteService(id);
      } else {
        updateServicesList(prev => prev.filter(service => service.id !== id));
      }
      showToast('Trámite eliminado con éxito.');
    }
  };

  const handleOpenNewServiceModal = () => {
    const newService: Service & { hidden?: boolean } = {
      id: `custom_${Date.now()}` as ServiceId,
      title: 'Nuevo Trámite',
      iconName: 'FileText',
      shortDesc: 'Descripción corta para la tarjeta del catálogo...',
      category: 'Nómina y Pagos',
      fullDescription: 'Descripción completa del procedimiento...',
      steps: [{ num: 1, title: 'Primer paso del trámite', desc: 'Instrucción inicial para el trabajador...' }],
      requirements: ['Gafete oficial activo'],
      location: 'Planta Baja • Edificio de Recursos Humanos',
      schedule: 'Lunes a Viernes de 8:00 AM a 5:00 PM',
      contact: 'Recursos Humanos - Ext. 200',
      faqs: [{ question: '¿Cómo inicio este trámite?', answer: 'Presentándote en la ventanilla de Recursos Humanos.' }],
      showSteps: true,
      showRequirements: true,
      showContact: true,
      showFaqs: true,
      imageUrl: '',
      videoUrl: '',
      attachments: [],
      showAlertNotice: false,
      alertNotice: '',
      hidden: false
    };

    if (onSelectService) {
      onSelectService(newService, true);
    } else {
      setIsNewService(true);
      setServiceModalTab('general');
      setEditingService(newService);
      setIsServiceModalOpen(true);
    }
  };

  const handleOpenEditServiceModal = (service: Service & { hidden?: boolean }) => {
    if (onSelectService) {
      onSelectService(service, true);
    } else {
      setIsNewService(false);
      setServiceModalTab('general');
      const details = getDefaultServiceDetails(service);
      setEditingService({
        ...service,
        fullDescription: service.fullDescription || details.fullDescription,
        steps: service.steps && service.steps.length > 0 ? service.steps : details.steps,
        requirements: service.requirements && service.requirements.length > 0 ? service.requirements : details.requirements,
        location: service.location || details.location,
        schedule: service.schedule || details.schedule,
        contact: service.contact || details.contact,
        faqs: service.faqs && service.faqs.length > 0 ? service.faqs : details.faqs,
        showSteps: service.showSteps ?? details.showSteps,
        showRequirements: service.showRequirements ?? details.showRequirements,
        showContact: service.showContact ?? details.showContact,
        showFaqs: service.showFaqs ?? details.showFaqs,
        imageUrl: service.imageUrl ?? details.imageUrl,
        videoUrl: service.videoUrl ?? details.videoUrl,
        attachments: service.attachments ?? details.attachments,
        showAlertNotice: service.showAlertNotice ?? details.showAlertNotice,
        alertNotice: service.alertNotice ?? details.alertNotice,
      });
      setIsServiceModalOpen(true);
    }
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.title.trim()) return;

    if (isNewService) {
      updateServicesList(prev => [editingService, ...prev]);
      showToast('¡Nuevo trámite creado e integrado al portal!');
    } else {
      updateServicesList(prev => prev.map(s => s.id === editingService.id ? editingService : s));
      showToast('Trámite modificado y guardado con éxito.');
    }
    setIsServiceModalOpen(false);
  };

  // --- DYNAMIC STEP HELPERS ---
  const handleAddStep = () => {
    if (!editingService) return;
    const currentSteps = editingService.steps || [];
    const newStepNum = currentSteps.length + 1;
    setEditingService({
      ...editingService,
      steps: [...currentSteps, { num: newStepNum, title: '', desc: '' }]
    });
  };

  const handleUpdateStep = (index: number, field: 'title' | 'desc', value: string) => {
    if (!editingService || !editingService.steps) return;
    const updatedSteps = editingService.steps.map((step, i) => {
      if (i === index) {
        return { ...step, [field]: value };
      }
      return step;
    });
    setEditingService({ ...editingService, steps: updatedSteps });
  };

  const handleRemoveStep = (index: number) => {
    if (!editingService || !editingService.steps) return;
    const updatedSteps = editingService.steps.filter((_, i) => i !== index).map((step, i) => ({
      ...step,
      num: i + 1
    }));
    setEditingService({ ...editingService, steps: updatedSteps });
  };

  // --- DYNAMIC REQUIREMENT HELPERS ---
  const handleAddRequirement = () => {
    if (!editingService) return;
    const currentReqs = editingService.requirements || [];
    setEditingService({
      ...editingService,
      requirements: [...currentReqs, '']
    });
  };

  const handleUpdateRequirement = (index: number, value: string) => {
    if (!editingService || !editingService.requirements) return;
    const updatedReqs = editingService.requirements.map((req, i) => (i === index ? value : req));
    setEditingService({ ...editingService, requirements: updatedReqs });
  };

  const handleRemoveRequirement = (index: number) => {
    if (!editingService || !editingService.requirements) return;
    const updatedReqs = editingService.requirements.filter((_, i) => i !== index);
    setEditingService({ ...editingService, requirements: updatedReqs });
  };

  // --- DYNAMIC FAQ HELPERS ---
  const handleAddFAQ = () => {
    if (!editingService) return;
    const currentFaqs = editingService.faqs || [];
    setEditingService({
      ...editingService,
      faqs: [...currentFaqs, { question: '', answer: '' }]
    });
  };

  const handleUpdateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    if (!editingService || !editingService.faqs) return;
    const updatedFaqs = editingService.faqs.map((faq, i) => {
      if (i === index) {
        return { ...faq, [field]: value };
      }
      return faq;
    });
    setEditingService({ ...editingService, faqs: updatedFaqs });
  };

  const handleRemoveFAQ = (index: number) => {
    if (!editingService || !editingService.faqs) return;
    const updatedFaqs = editingService.faqs.filter((_, i) => i !== index);
    setEditingService({ ...editingService, faqs: updatedFaqs });
  };

  // --- NEWS HANDLERS ---
  const handleDeleteNews = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este comunicado?')) {
      if (onDeleteNews) {
        onDeleteNews(id);
      } else {
        updateNewsList(prev => prev.filter(news => news.id !== id));
      }
      showToast('Comunicado eliminado correctamente.');
    }
  };

  const handleOpenNewNewsModal = () => {
    setIsNewNews(true);
    setEditingNews({
      id: `news_${Date.now()}`,
      title: '',
      summary: '',
      content: '',
      date: 'Hoy',
      imageName: 'welcome_team',
      category: 'comunicado'
    });
    setIsNewsModalOpen(true);
  };

  const handleOpenEditNewsModal = (item: NewsItem) => {
    setIsNewNews(false);
    setEditingNews({ ...item });
    setIsNewsModalOpen(true);
  };

  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews || !editingNews.title.trim()) return;

    if (isNewNews) {
      updateNewsList(prev => [editingNews, ...prev]);
      showToast('¡Nueva noticia publicada en el boletín!');
    } else {
      updateNewsList(prev => prev.map(n => n.id === editingNews.id ? editingNews : n));
      showToast('Noticia actualizada correctamente.');
    }
    setIsNewsModalOpen(false);
  };

  return (
    <div id="admin-panel-container" className="space-y-4 animate-fadeIn pb-12">
      {/* Toast Alert */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-2.5 animate-slideDown">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{successMessage}</span>
        </div>
      )}

      {/* Top Header Dashboard Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-300 bg-blue-950/80 px-2.5 py-0.5 rounded-md border border-blue-800/60">
                Panel Administrador
              </span>
              <span className="text-[10px] font-medium text-slate-400">
                Lic. Patricia Morales (RH)
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight font-display">
              Gestión de Contenidos y Trámites
            </h2>
          </div>
        </div>

        <button
          id="btn-admin-logout"
          onClick={onLogout}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all border border-slate-700 flex items-center gap-2 self-start md:self-auto active:scale-95 shadow-2xs"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          <span>Cerrar Sesión</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs">
        <button
          id="admin-tab-tramites"
          onClick={() => setActiveTab('tramites')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'tramites'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Gestionar Trámites ({services.length})</span>
        </button>

        <button
          id="admin-tab-noticias"
          onClick={() => setActiveTab('noticias')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'noticias'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Newspaper className="w-4 h-4" />
          <span>Gestionar Noticias ({news.length})</span>
        </button>
      </div>

      {/* VIEW A: GESTIONAR TRÁMITES */}
      {activeTab === 'tramites' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">
                Catálogo Oficial de Trámites
              </h3>
              <p className="text-xs text-slate-500">
                Edita, agrega u oculta los servicios disponibles para los colaboradores de la planta.
              </p>
            </div>
            <button
              id="btn-add-service"
              onClick={handleOpenNewServiceModal}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5 shrink-0 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Nuevo Trámite</span>
            </button>
          </div>

          {/* Services List */}
          <div className="space-y-2.5">
            {currentServices.map((service) => (
              <div
                key={service.id}
                className={`bg-white border rounded-2xl p-4 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  service.hidden ? 'opacity-60 border-slate-200 bg-slate-50' : 'border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 border border-slate-200 mt-0.5">
                    <FileText className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                        {service.category}
                      </span>
                      {service.hidden ? (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-md">
                          Oculto
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                          Visible
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {service.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {service.shortDesc}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <button
                    onClick={() => handleToggleHideService(service.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border ${
                      service.hidden 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                    title={service.hidden ? 'Hacer visible' : 'Ocultar trámite'}
                  >
                    {service.hidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{service.hidden ? 'Mostrar' : 'Ocultar'}</span>
                  </button>

                  <button
                    onClick={() => handleOpenEditServiceModal(service)}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar Contenido</span>
                  </button>

                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 active:scale-95 cursor-pointer"
                    title="Eliminar trámite"
                    aria-label="Eliminar trámite"
                  >
                    <Trash2 className="w-4 h-4 text-rose-600" />
                    <span>Borrar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW B: GESTIONAR NOTICIAS */}
      {activeTab === 'noticias' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">
                Boletín de Noticias Internas
              </h3>
              <p className="text-xs text-slate-500">
                Publica y edita comunicados, avisos y reconocimientos de la planta.
              </p>
            </div>
            <button
              id="btn-add-news"
              onClick={handleOpenNewNewsModal}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5 shrink-0 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Publicar Nueva Noticia</span>
            </button>
          </div>

          {/* News List */}
          <div className="space-y-3">
            {currentNews.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center shrink-0 border border-blue-100 mt-0.5">
                    <Newspaper className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {item.date}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {item.summary}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <button
                    onClick={() => handleOpenEditNewsModal(item)}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar Textos</span>
                  </button>

                  <button
                    onClick={() => handleDeleteNews(item.id)}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 active:scale-95 cursor-pointer"
                    title="Eliminar comunicado"
                    aria-label="Eliminar comunicado"
                  >
                    <Trash2 className="w-4 h-4 text-rose-600" />
                    <span>Borrar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- ENHANCED MODAL FOR ADDING / EDITING SERVICE WITH TABS --- */}
      {isServiceModalOpen && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                  Edición de Trámite Completo
                </span>
                <h3 className="text-base font-bold font-display mt-0.5">
                  {isNewService ? 'Crear Nuevo Trámite' : editingService.title || 'Editar Trámite'}
                </h3>
              </div>
              <button 
                onClick={() => setIsServiceModalOpen(false)} 
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Internal Modal Tabs */}
            <div className="bg-slate-100 p-1.5 border-b border-slate-200 flex items-center gap-1 shrink-0 overflow-x-auto">
              <button
                type="button"
                onClick={() => setServiceModalTab('general')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  serviceModalTab === 'general'
                    ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Info className="w-3.5 h-3.5" />
                <span>Información General</span>
              </button>

              <button
                type="button"
                onClick={() => setServiceModalTab('pasos')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  serviceModalTab === 'pasos'
                    ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>Paso a Paso ({editingService.steps?.length || 0})</span>
              </button>

              <button
                type="button"
                onClick={() => setServiceModalTab('requisitos')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  serviceModalTab === 'requisitos'
                    ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Requisitos y Contacto</span>
              </button>

              <button
                type="button"
                onClick={() => setServiceModalTab('faqs')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  serviceModalTab === 'faqs'
                    ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Preguntas Frecuentes ({editingService.faqs?.length || 0})</span>
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveService} className="flex flex-col flex-1 min-h-0">
              <div className="p-5 overflow-y-auto flex-1 space-y-4">

                {/* TAB 1: INFORMACIÓN GENERAL */}
                {serviceModalTab === 'general' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Título del Trámite *
                      </label>
                      <input
                        type="text"
                        value={editingService.title}
                        onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                        placeholder="Ej. Poliza de Seguro Social o Permiso de Falta"
                        className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Módulo / Categoría Oficial *
                      </label>
                      <select
                        value={editingService.category}
                        onChange={(e) => setEditingService({ ...editingService, category: e.target.value as any })}
                        className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white"
                      >
                        <option value="Nómina y Pagos">Nómina y Pagos</option>
                        <option value="Tarjetas y Créditos">Tarjetas y Créditos</option>
                        <option value="Control y Asistencia">Control y Asistencia</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Descripción Corta (Tarjeta Catálogo) *
                      </label>
                      <textarea
                        rows={2}
                        value={editingService.shortDesc}
                        onChange={(e) => setEditingService({ ...editingService, shortDesc: e.target.value })}
                        placeholder="Resumen para la vista en cuadrícula..."
                        className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Descripción Completa (Vista Detalle)
                      </label>
                      <textarea
                        rows={3}
                        value={editingService.fullDescription || ''}
                        onChange={(e) => setEditingService({ ...editingService, fullDescription: e.target.value })}
                        placeholder="Explicación detallada del trámite para el trabajador..."
                        className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 2: PROCEDIMIENTO PASO A PASO */}
                {serviceModalTab === 'pasos' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Pasos del Procedimiento ({editingService.steps?.length || 0})
                      </span>
                      <button
                        type="button"
                        onClick={handleAddStep}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border border-blue-200"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Agregar Paso</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {editingService.steps && editingService.steps.length > 0 ? (
                        editingService.steps.map((step, idx) => (
                          <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 relative">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-extrabold text-white bg-slate-900 px-2 py-0.5 rounded-md">
                                Paso {step.num || idx + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveStep(idx)}
                                className="text-rose-500 hover:text-rose-700 p-1 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Eliminar paso"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <input
                              type="text"
                              value={step.title}
                              onChange={(e) => handleUpdateStep(idx, 'title', e.target.value)}
                              placeholder="Título del paso (ej. Validación con Supervisor)"
                              className="w-full px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                            />

                            <textarea
                              rows={2}
                              value={step.desc}
                              onChange={(e) => handleUpdateStep(idx, 'desc', e.target.value)}
                              placeholder="Descripción detallada de lo que debe realizar el colaborador..."
                              className="w-full px-3 py-1.5 text-xs font-normal border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                            />
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                          No se han definido pasos. Haz clic en "Agregar Paso".
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: REQUISITOS Y CONTACTO */}
                {serviceModalTab === 'requisitos' && (
                  <div className="space-y-4 animate-fadeIn">
                    {/* Lista de Requisitos */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Requisitos Necesarios
                        </label>
                        <button
                          type="button"
                          onClick={handleAddRequirement}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border border-emerald-200"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Agregar Requisito</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {editingService.requirements && editingService.requirements.length > 0 ? (
                          editingService.requirements.map((req, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                              <input
                                type="text"
                                value={req}
                                onChange={(e) => handleUpdateRequirement(idx, e.target.value)}
                                placeholder="Ej. Gafete oficial activo o Identificación INE"
                                className="flex-1 px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:bg-white"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveRequirement(idx)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-400 italic">No hay requisitos registrados.</p>
                        )}
                      </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Campos de Atención y Ubicación */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Ubicación, Horario y Teléfono
                      </h4>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          Ubicación de Atención
                        </label>
                        <input
                          type="text"
                          value={editingService.location || ''}
                          onChange={(e) => setEditingService({ ...editingService, location: e.target.value })}
                          placeholder="Ej. Planta Baja • Edificio de Recursos Humanos"
                          className="w-full px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Horario de Atención
                        </label>
                        <input
                          type="text"
                          value={editingService.schedule || ''}
                          onChange={(e) => setEditingService({ ...editingService, schedule: e.target.value })}
                          placeholder="Ej. Lunes a Viernes de 8:00 AM a 5:00 PM"
                          className="w-full px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          Teléfono o Extensión de Contacto
                        </label>
                        <input
                          type="text"
                          value={editingService.contact || ''}
                          onChange={(e) => setEditingService({ ...editingService, contact: e.target.value })}
                          placeholder="Ej. Atención a Nóminas - Ext. 201"
                          className="w-full px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: PREGUNTAS FRECUENTES (FAQs) */}
                {serviceModalTab === 'faqs' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Preguntas Frecuentes ({editingService.faqs?.length || 0})
                      </span>
                      <button
                        type="button"
                        onClick={handleAddFAQ}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border border-blue-200"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Agregar Pregunta</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {editingService.faqs && editingService.faqs.length > 0 ? (
                        editingService.faqs.map((faq, idx) => (
                          <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 relative">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                                FAQ #{idx + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveFAQ(idx)}
                                className="text-rose-500 hover:text-rose-700 p-1 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Eliminar pregunta"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <input
                              type="text"
                              value={faq.question}
                              onChange={(e) => handleUpdateFAQ(idx, 'question', e.target.value)}
                              placeholder="Pregunta frecuente (ej. ¿Qué pasa si no cobro a tiempo?)"
                              className="w-full px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                            />

                            <textarea
                              rows={2}
                              value={faq.answer}
                              onChange={(e) => handleUpdateFAQ(idx, 'answer', e.target.value)}
                              placeholder="Respuesta detallada..."
                              className="w-full px-3 py-1.5 text-xs font-normal border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                            />
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                          No hay preguntas registradas. Haz clic en "Agregar Pregunta".
                        </p>
                      )}
                    </div>
                  </div>
                )}

              </div>

              {/* Modal Footer Controls */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
                <div className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Los cambios se actualizarán inmediatamente en el portal.
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setIsServiceModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Cambios</span>
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* --- MODAL FOR ADDING / EDITING NEWS --- */}
      {isNewsModalOpen && editingNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold">
                {isNewNews ? 'Publicar Nueva Noticia' : 'Editar Noticia'}
              </h3>
              <button onClick={() => setIsNewsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNews} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Título del Comunicado
                </label>
                <input
                  type="text"
                  value={editingNews.title}
                  onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                  placeholder="Ej. Jornada de Evaluación en Planta"
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Categoría
                </label>
                <select
                  value={editingNews.category}
                  onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white"
                >
                  <option value="comunicado">Comunicado Oficial</option>
                  <option value="evento">Evento / Capacitación</option>
                  <option value="logro">Logro de Equipo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Resumen Corto
                </label>
                <input
                  type="text"
                  value={editingNews.summary}
                  onChange={(e) => setEditingNews({ ...editingNews, summary: e.target.value })}
                  placeholder="Texto visible en la vista previa..."
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Contenido Completo
                </label>
                <textarea
                  rows={4}
                  value={editingNews.content}
                  onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
                  placeholder="Detalle de la noticia..."
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-1.5 shadow-2xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Publicar Noticia</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
