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
  Info,
  Award,
  MessageSquare,
  Building2,
  PhoneCall,
  LayoutDashboard
} from 'lucide-react';
import { Service, NewsItem, ServiceId, StepItem, ServiceFAQ, MonthlyRecognition, ContactInfo } from '../types';
import { getDefaultServiceDetails, recognitionData, initialContact } from '../data';
import { SERVICE_ICON_MAP } from './ServiceCard';

interface AdminPanelProps {
  services: (Service & { hidden?: boolean })[];
  onUpdateServices: (services: (Service & { hidden?: boolean })[]) => void;
  onSelectService?: (service: Service & { hidden?: boolean }, startInEditMode?: boolean) => void;
  news: NewsItem[];
  onUpdateNews: (news: NewsItem[]) => void;
  recognition?: MonthlyRecognition;
  onUpdateRecognition?: (recognition: MonthlyRecognition) => void;
  recognitions?: MonthlyRecognition[];
  onUpdateRecognitions?: (recognitions: MonthlyRecognition[]) => void;
  contactInfo?: ContactInfo;
  onUpdateContact?: (contact: ContactInfo) => void;
  onLogout: () => void;
}

export default function AdminPanel({
  services,
  onUpdateServices,
  onSelectService,
  news,
  onUpdateNews,
  recognition,
  onUpdateRecognition,
  recognitions,
  onUpdateRecognitions,
  contactInfo,
  onUpdateContact,
  onLogout
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'tramites' | 'noticias' | 'contacto'>('tramites');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Contact Form State
  const [contactForm, setContactForm] = useState<ContactInfo>(() => contactInfo || initialContact);

  // Sync contactForm if props change
  React.useEffect(() => {
    if (contactInfo) {
      setContactForm(contactInfo);
    }
  }, [contactInfo]);

  // Service Edit / Create Modal state
  const [editingService, setEditingService] = useState<(Service & { hidden?: boolean }) | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState<boolean>(false);
  const [isNewService, setIsNewService] = useState<boolean>(false);
  const [serviceModalTab, setServiceModalTab] = useState<'general' | 'pasos' | 'requisitos' | 'faqs'>('general');

  // News Edit / Create Modal state
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState<boolean>(false);
  const [isNewNews, setIsNewNews] = useState<boolean>(false);

  // Recognition Edit / Create Modal state
  const [editingRecognition, setEditingRecognition] = useState<MonthlyRecognition | null>(null);
  const [isRecognitionModalOpen, setIsRecognitionModalOpen] = useState<boolean>(false);
  const [isNewRecognition, setIsNewRecognition] = useState<boolean>(false);

  // Delete Confirmation Modal state
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{
    type: 'service' | 'news' | 'recognition';
    id: string;
    title: string;
  } | null>(null);

  // Helper for notification toast
  const showToast = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // --- SERVICE HANDLERS ---
  const handleToggleHideService = (id: string) => {
    const updated = services.map(s => s.id === id ? { ...s, hidden: !s.hidden } : s);
    onUpdateServices(updated);
    showToast('Estado del trámite actualizado correctamente.');
  };

  const handleDeleteService = (id: string, title?: string) => {
    const serviceObj = services.find(s => s.id === id);
    setDeleteConfirmTarget({
      type: 'service',
      id,
      title: title || serviceObj?.title || 'Trámite'
    });
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
      onUpdateServices([editingService, ...services]);
      showToast('¡Nuevo trámite creado e integrado al portal!');
    } else {
      const updated = services.map(s => s.id === editingService.id ? editingService : s);
      onUpdateServices(updated);
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
  const handleDeleteNews = (id: string, title?: string) => {
    const newsObj = news.find(n => n.id === id);
    setDeleteConfirmTarget({
      type: 'news',
      id,
      title: title || newsObj?.title || 'Noticia'
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmTarget) return;
    if (deleteConfirmTarget.type === 'service') {
      const updated = services.filter(s => s.id !== deleteConfirmTarget.id);
      onUpdateServices(updated);
      showToast('Trámite eliminado con éxito.');
    } else if (deleteConfirmTarget.type === 'news') {
      const updated = news.filter(n => n.id !== deleteConfirmTarget.id);
      onUpdateNews(updated);
      showToast('Noticia eliminada correctamente.');
    } else if (deleteConfirmTarget.type === 'recognition') {
      const currentList = recognitions || (recognition ? [recognition] : []);
      const updated = currentList.filter(r => r.id !== deleteConfirmTarget.id);
      if (onUpdateRecognitions) {
        onUpdateRecognitions(updated);
      } else if (onUpdateRecognition && updated.length > 0) {
        onUpdateRecognition(updated[0]);
      }
      showToast('Reconocimiento eliminado correctamente.');
    }
    setDeleteConfirmTarget(null);
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
      onUpdateNews([editingNews, ...news]);
      showToast('¡Nueva noticia publicada en el boletín!');
    } else {
      const updated = news.map(n => n.id === editingNews.id ? editingNews : n);
      onUpdateNews(updated);
      showToast('Noticia actualizada correctamente.');
    }
    setIsNewsModalOpen(false);
  };

  // --- RECOGNITION HANDLERS ---
  const recognitionsList = recognitions || (recognition ? [recognition] : []);

  const handleOpenAddRecognitionModal = () => {
    setIsNewRecognition(true);
    setEditingRecognition({
      id: `rec_${Date.now()}`,
      badgeTitle: 'Reconocimiento Mensual',
      name: '',
      initials: '',
      position: '',
      message: '',
      photoUrl: ''
    });
    setIsRecognitionModalOpen(true);
  };

  const handleOpenEditRecognitionModal = (rec: MonthlyRecognition) => {
    setIsNewRecognition(false);
    setEditingRecognition({ ...rec });
    setIsRecognitionModalOpen(true);
  };

  const handlePromptDeleteRecognition = (rec: MonthlyRecognition) => {
    setDeleteConfirmTarget({
      type: 'recognition',
      id: rec.id,
      title: rec.name
    });
  };

  const handleSaveRecognition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecognition || !editingRecognition.name.trim()) return;

    if (isNewRecognition) {
      const updated = [editingRecognition, ...recognitionsList];
      if (onUpdateRecognitions) {
        onUpdateRecognitions(updated);
      } else if (onUpdateRecognition) {
        onUpdateRecognition(editingRecognition);
      }
      showToast('¡Nuevo reconocimiento publicado!');
    } else {
      const updated = recognitionsList.map(r => r.id === editingRecognition.id ? editingRecognition : r);
      if (onUpdateRecognitions) {
        onUpdateRecognitions(updated);
      } else if (onUpdateRecognition) {
        onUpdateRecognition(editingRecognition);
      }
      showToast('Reconocimiento actualizado correctamente.');
    }
    setIsRecognitionModalOpen(false);
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
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm border border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-white flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-blue-400" />
            <span>Panel de Administración</span>
          </h1>
        </div>

        <button
          id="btn-admin-logout"
          onClick={onLogout}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all border border-slate-700 flex items-center gap-2 active:scale-95 shadow-2xs cursor-pointer"
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
          <span>Trámites</span>
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
          <span>Noticias</span>
        </button>

        <button
          id="admin-tab-contacto"
          onClick={() => setActiveTab('contacto')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'contacto'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Contacto</span>
        </button>
      </div>

      {/* VIEW A: GESTIONAR TRÁMITES */}
      {activeTab === 'tramites' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">
                Trámites
              </h3>
            </div>
            <button
              id="btn-add-service"
              onClick={handleOpenNewServiceModal}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Trámite</span>
            </button>
          </div>

          {/* Services List */}
          <div className="space-y-2.5">
            {services.map((service) => (
              <div
                key={service.id}
                className={`bg-white border rounded-2xl p-4 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  service.hidden ? 'opacity-60 border-slate-200 bg-slate-50' : 'border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 border border-slate-200 mt-0.5">
                    {React.createElement(SERVICE_ICON_MAP[service.iconName || service.icon || 'FileText'] || FileText, {
                      className: "w-5 h-5 text-slate-600"
                    })}
                  </div>
                  <div className="min-w-0 flex-1">
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
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border cursor-pointer ${
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
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteService(service.id, service.title);
                    }}
                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                    title="Eliminar trámite"
                  >
                    <Trash2 className="w-4 h-4" />
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
          {/* Monthly Recognition Management Card */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-display">
                    Reconocimientos Mensuales
                  </h3>
                  <p className="text-xs text-slate-500">
                    Agrega, edita o elimina los reconocimientos de colaboradores destacados.
                  </p>
                </div>
              </div>
              <button
                id="btn-add-recognition"
                onClick={handleOpenAddRecognitionModal}
                className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Reconocimiento</span>
              </button>
            </div>

            {recognitionsList.length === 0 ? (
              <div className="text-center py-6 bg-amber-50/50 border border-amber-200/60 rounded-xl p-4">
                <Award className="w-8 h-8 text-amber-400 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-amber-900">No hay reconocimientos vigentes</p>
                <p className="text-[11px] text-amber-700 mt-0.5">Haz clic en "+ Agregar Reconocimiento" para publicar un colaborador destacado.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recognitionsList.map((rec) => {
                  const initials = rec.initials || (rec.name ? rec.name.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'RH');

                  return (
                    <div key={rec.id || rec.name} className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-2xl p-4 text-white shadow-sm border border-amber-400/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="bg-white/20 text-amber-100 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-white/20">
                            {rec.badgeTitle || 'Reconocimiento Mensual'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          {rec.photoUrl ? (
                            <img 
                              src={rec.photoUrl} 
                              alt={rec.name} 
                              className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-xs shrink-0"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-amber-100 border-2 border-white flex items-center justify-center font-black text-amber-800 text-sm shadow-xs shrink-0">
                              {initials}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-black truncate">{rec.name}</h4>
                            <p className="text-[11px] text-amber-100 font-extrabold truncate">{rec.position}</p>
                          </div>
                        </div>
                        <p className="text-xs text-amber-50/95 line-clamp-2 italic bg-amber-800/30 p-2 rounded-xl border border-amber-400/20">
                          "{rec.message}"
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        <button
                          id={`btn-edit-recognition-${rec.id}`}
                          onClick={() => handleOpenEditRecognitionModal(rec)}
                          className="px-3 py-2 bg-white text-amber-900 hover:bg-amber-50 text-xs font-black rounded-xl transition-all shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                          <span>Editar</span>
                        </button>
                        <button
                          id={`btn-delete-recognition-${rec.id}`}
                          onClick={() => handlePromptDeleteRecognition(rec)}
                          className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

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
            {news.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center shrink-0 border border-blue-100 mt-0.5">
                    <Newspaper className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    {item.date && (
                      <div className="mb-1">
                        <span className="text-[10px] text-slate-400 font-medium">
                          {item.date}
                        </span>
                      </div>
                    )}
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
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNews(item.id, item.title);
                    }}
                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                    title="Eliminar noticia"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW C: GESTIONAR CONTACTO */}
      {activeTab === 'contacto' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold shrink-0 border border-blue-100">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  Información Oficial de Contacto de RH
                </h3>
                <p className="text-xs text-slate-500">
                  Edita la información de canales directos, extensión, ubicación física y horarios mostrados en la aplicación.
                </p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (onUpdateContact) {
                  onUpdateContact(contactForm);
                }
                showToast('✅ Cambios guardados correctamente');
              }}
              className="space-y-4"
            >
              {/* WhatsApp Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Oficial (Número o Enlace)</span>
                </label>
                <input
                  type="text"
                  value={contactForm.whatsapp}
                  onChange={(e) => setContactForm({ ...contactForm, whatsapp: e.target.value })}
                  placeholder="Ej. https://wa.me/525512345678 o 5512345678"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
                  required
                />
                <p className="text-[11px] text-slate-400">
                  Aparecerá en el botón de WhatsApp directo en la pestaña de Contacto RH.
                </p>
              </div>

              {/* Conmutador / Telefono Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <PhoneCall className="w-4 h-4 text-blue-600" />
                  <span>Extensión / Teléfono Interno</span>
                </label>
                <input
                  type="text"
                  value={contactForm.telefono}
                  onChange={(e) => setContactForm({ ...contactForm, telefono: e.target.value })}
                  placeholder="Ej. Ext. 202 (5512345678)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
                  required
                />
                <p className="text-[11px] text-slate-400">
                  Teléfono de urgencias y permisos de incapacidad para personal de planta.
                </p>
              </div>

              {/* Ubicacion Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span>Ubicación Física de la Ventanilla</span>
                </label>
                <input
                  type="text"
                  value={contactForm.ubicacion}
                  onChange={(e) => setContactForm({ ...contactForm, ubicacion: e.target.value })}
                  placeholder="Ej. Planta Baja • Edificio Administrativo (junto al Comedor General)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
                  required
                />
              </div>

              {/* Horario Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span>Horario de Atención Presencial</span>
                </label>
                <input
                  type="text"
                  value={contactForm.horario}
                  onChange={(e) => setContactForm({ ...contactForm, horario: e.target.value })}
                  placeholder="Ej. Lunes a Viernes de 8:00 AM a 5:00 PM • Sábados de 8:00 AM a 1:00 PM"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
                  required
                />
              </div>

              {/* Save Button */}
              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  id="btn-save-contact-info"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
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
                        Ícono de la Tarjeta *
                      </label>
                      <select
                        value={editingService.iconName || editingService.icon || 'FileText'}
                        onChange={(e) => setEditingService({ ...editingService, iconName: e.target.value, icon: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white"
                      >
                        <option value="Banknote">💵 Billete (Banknote)</option>
                        <option value="FileText">📄 Documento (FileText)</option>
                        <option value="FileCheck">✅ Documento Verificado (FileCheck)</option>
                        <option value="HelpCircle">❓ Duda / Ayuda (HelpCircle)</option>
                        <option value="CreditCard">💳 Tarjeta (CreditCard)</option>
                        <option value="PiggyBank">🐷 Ahorro (PiggyBank)</option>
                        <option value="Home">🏠 Casa (Home)</option>
                        <option value="Calendar">📅 Calendario (Calendar)</option>
                        <option value="CalendarDays">📆 Días Calendario (CalendarDays)</option>
                        <option value="Shield">🛡️ Seguridad / Salud (Shield)</option>
                        <option value="ShieldAlert">🛡️ Alerta de Seguridad (ShieldAlert)</option>
                        <option value="Clock">⏰ Reloj (Clock)</option>
                        <option value="Briefcase">💼 Maletín (Briefcase)</option>
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

      {/* --- MODAL CREAR / EDITAR RECONOCIMIENTO MENSUAL --- */}
      {isRecognitionModalOpen && editingRecognition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 bg-amber-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-200" />
                <h3 className="text-sm font-bold font-display">
                  {isNewRecognition ? 'Agregar Nuevo Reconocimiento' : 'Editar Reconocimiento Mensual'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsRecognitionModalOpen(false)}
                className="p-1 hover:bg-amber-700 rounded-lg text-amber-100 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRecognition} className="p-4 sm:p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Distinción / Etiqueta *
                </label>
                <input
                  type="text"
                  required
                  value={editingRecognition.badgeTitle || ''}
                  onChange={(e) => setEditingRecognition({ ...editingRecognition, badgeTitle: e.target.value })}
                  placeholder="Ej. Reconocimiento Mensual"
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nombre del Colaborador *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRecognition.name}
                    onChange={(e) => {
                      const newName = e.target.value;
                      const calculatedInitials = newName.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase();
                      setEditingRecognition({ 
                        ...editingRecognition, 
                        name: newName,
                        initials: editingRecognition.initials || calculatedInitials 
                      });
                    }}
                    placeholder="Ej. Mateo Rodríguez"
                    className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Iniciales
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={editingRecognition.initials || ''}
                    onChange={(e) => setEditingRecognition({ ...editingRecognition, initials: e.target.value.toUpperCase() })}
                    placeholder="Ej. MR"
                    className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white uppercase text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Puesto / Área / Logro Destacado *
                </label>
                <input
                  type="text"
                  required
                  value={editingRecognition.position}
                  onChange={(e) => setEditingRecognition({ ...editingRecognition, position: e.target.value })}
                  placeholder="Ej. Línea 2 - Montacargas • ¡Cero Retardos y 5S Perfecto!"
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mensaje o Cita de Reconocimiento *
                </label>
                <textarea
                  required
                  rows={3}
                  value={editingRecognition.message}
                  onChange={(e) => setEditingRecognition({ ...editingRecognition, message: e.target.value })}
                  placeholder="Escribe la razón del reconocimiento al colaborador..."
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  URL de Fotografía (Opcional)
                </label>
                <input
                  type="url"
                  value={editingRecognition.photoUrl || ''}
                  onChange={(e) => setEditingRecognition({ ...editingRecognition, photoUrl: e.target.value })}
                  placeholder="https://ejemplo.com/foto.jpg"
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRecognitionModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Reconocimiento</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CUSTOM DELETE CONFIRMATION MODAL --- */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-2xl overflow-hidden p-5 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shrink-0 shadow-2xs">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                ¿Eliminar {deleteConfirmTarget.type === 'service' ? 'Trámite' : 'Noticia'}?
              </h3>
              <p className="text-xs font-semibold text-slate-600 mt-1 line-clamp-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                "{deleteConfirmTarget.title}"
              </p>
              <p className="text-[11px] text-slate-400 mt-2">
                Esta acción eliminará permanentemente el elemento de la lista del portal.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmTarget(null)}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
