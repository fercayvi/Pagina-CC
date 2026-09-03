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
  MessageSquare,
  Building2,
  PhoneCall,
  LayoutDashboard,
  GripVertical,
  Image as ImageIcon,
  Video,
  FileDown,
  GitBranch
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Service, NewsItem, ServiceId, StepItem, ServiceFAQ, ContactInfo } from '../types';
import { getDefaultServiceDetails, initialContact } from '../data';
import { SERVICE_ICON_MAP } from './ServiceCard';
import { MediaUploadField } from './MediaUploadField';
import { DecisionTreeBuilder } from './DecisionTreeBuilder';
import { DecisionTreeNavigator } from './DecisionTreeNavigator';
import { DecisionTreeCanvasEditor } from './DecisionTreeCanvasEditor';

interface SortableServiceItemProps {
  key?: React.Key;
  service: Service & { hidden?: boolean };
  onToggleHide: (id: string) => void;
  onEdit: (service: Service & { hidden?: boolean }) => void;
  onDelete: (id: string, title?: string) => void;
}

function SortableServiceItem({ service, onToggleHide, onEdit, onDelete }: SortableServiceItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: service.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const IconComponent = SERVICE_ICON_MAP[service.iconName || service.icon || 'FileText'] || FileText;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border rounded-2xl p-4 shadow-2xs flex flex-col justify-between text-left transition-all ${
        isDragging
          ? 'z-50 shadow-2xl scale-105 border-blue-400 rotate-1 bg-white opacity-95 transition-all'
          : `transition-transform duration-200 ${
              service.hidden ? 'opacity-60 border-slate-200 bg-slate-50' : 'border-slate-200/90 hover:border-slate-300'
            }`
      }`}
    >
      {/* Top Header: Icon Left, Drag Handle Right */}
      <div>
        <div className="flex items-center justify-between w-full mb-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 border border-slate-200">
            <IconComponent className="w-5 h-5 text-slate-600" />
          </div>

          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md p-2 transition-colors touch-none border-none bg-transparent"
            title="Arrastrar para reordenar"
          >
            <GripVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Card Content */}
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-900 line-clamp-1" title={service.title}>
            {service.title}
          </h4>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {service.shortDesc}
          </p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-slate-100 mt-4 pt-4 flex items-center justify-between gap-1.5">
        <button
          onClick={() => onToggleHide(service.id)}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border cursor-pointer ${
            service.hidden 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 hover:text-slate-900'
          }`}
          title={service.hidden ? 'Hacer visible' : 'Ocultar trámite'}
        >
          {service.hidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>{service.hidden ? 'Mostrar' : 'Ocultar'}</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(service)}
            className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editar</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(service.id, service.title);
            }}
            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl transition-colors cursor-pointer"
            title="Eliminar trámite"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface AdminPanelProps {
  services: (Service & { hidden?: boolean })[];
  onUpdateServices: (services: (Service & { hidden?: boolean })[]) => void;
  onSelectService?: (service: Service & { hidden?: boolean }, startInEditMode?: boolean) => void;
  news: NewsItem[];
  onUpdateNews: (news: NewsItem[]) => void;
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
  const [serviceModalTab, setServiceModalTab] = useState<'general' | 'arbol' | 'pasos' | 'requisitos' | 'multimedia' | 'faqs'>('general');
  const [isFlowEditorOpen, setIsFlowEditorOpen] = useState<boolean>(false);

  // News Edit / Create Modal state
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState<boolean>(false);
  const [isNewNews, setIsNewNews] = useState<boolean>(false);

  // Delete Confirmation Modal state
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{
    type: 'service' | 'news';
    id: string;
    title: string;
  } | null>(null);

  // Configure dnd-kit sensors with pointer activation constraints
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = services.findIndex((item) => item.id === active.id);
      const newIndex = services.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const updatedServices = arrayMove(services, oldIndex, newIndex);
        onUpdateServices(updatedServices);
        showToast('Orden de trámites actualizado.');
      }
    }
  };

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
      imageUrl: '',
      videoUrl: '',
      pdfUrl: '',
      pdfTitle: '',
      attachments: [],
      alertNotice: '',
      decisionTree: [],
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
        decisionTree: service.decisionTree ? [...service.decisionTree] : [],
        fullDescription: service.fullDescription || details.fullDescription,
        steps: service.steps && service.steps.length > 0 ? service.steps : details.steps,
        requirements: service.requirements && service.requirements.length > 0 ? service.requirements : details.requirements,
        location: service.location || details.location,
        schedule: service.schedule || details.schedule,
        contact: service.contact || details.contact,
        faqs: service.faqs && service.faqs.length > 0 ? service.faqs : details.faqs,
        imageUrl: service.imageUrl ?? details.imageUrl,
        videoUrl: service.videoUrl ?? details.videoUrl,
        pdfUrl: service.pdfUrl ?? details.pdfUrl,
        pdfTitle: service.pdfTitle ?? details.pdfTitle,
        attachments: service.attachments ?? details.attachments,
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
          <h1 className="text-lg font-semibold text-white">
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={services.map((s) => s.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((service) => (
                  <SortableServiceItem
                    key={service.id}
                    service={service}
                    onToggleHide={handleToggleHideService}
                    onEdit={handleOpenEditServiceModal}
                    onDelete={handleDeleteService}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
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
                Publica y edita comunicados y avisos para el personal de la planta.
              </p>
            </div>
            <button
              id="btn-add-news"
              onClick={handleOpenNewNewsModal}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const contactData: ContactInfo = {
                  whatsapp: contactForm.whatsapp,
                  telefono: contactForm.telefono,
                  ubicacion: contactForm.ubicacion,
                  horario: contactForm.horario,
                  croquisUrl: contactForm.croquisUrl || '',
                };

                if (onUpdateContact) {
                  onUpdateContact(contactData);
                }

                showToast('✅ Cambios guardados correctamente');
                alert('Cambios guardados correctamente');
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

              {/* Croquis de Ubicación (Opcional) */}
              <MediaUploadField
                type="image"
                label="Croquis de Ubicación (Opcional)"
                helperText="Sube una imagen o mapa visual para guiar al personal hacia la ventanilla."
                value={contactForm.croquisUrl || ''}
                onChange={(url) => setContactForm({ ...contactForm, croquisUrl: url })}
                idPrefix="contact_croquis"
              />

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
                onClick={() => setServiceModalTab('arbol')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  serviceModalTab === 'arbol'
                    ? 'bg-white text-blue-700 shadow-2xs border border-slate-200 font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Árbol de Decisión ({editingService.decisionTree?.length || 0})</span>
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
                onClick={() => setServiceModalTab('multimedia')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  serviceModalTab === 'multimedia'
                    ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Archivos y Multimedia</span>
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

                    {/* FOTO DE PORTADA / TARJETA */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <MediaUploadField
                        type="image"
                        label="Foto de la Tarjeta / Portada (Opcional)"
                        value={editingService.cardImage || ''}
                        onChange={(val) => setEditingService(prev => prev ? ({ ...prev, cardImage: val }) : prev)}
                        placeholderUrl="https://ejemplo.com/foto_tarjeta.jpg o .png"
                        helperText="Si cargas una foto o logo aquí, reemplazará al ícono vectorial genérico en la tarjeta del catálogo."
                        idPrefix="admin-panel-service-card"
                      />
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

                {/* TAB: ÁRBOL DE DECISIÓN DINÁMICO */}
                {serviceModalTab === 'arbol' && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="bg-gradient-to-r from-blue-50 via-indigo-50/40 to-slate-50 border border-blue-200/80 rounded-2xl p-6 shadow-xs">
                      <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-100/70 text-blue-700 text-[11px] font-bold uppercase tracking-wider">
                          <GitBranch className="w-3.5 h-3.5" />
                          <span>Editor Visual Bidimensional</span>
                        </div>
                        <h4 className="text-sm font-bold text-gray-900">
                          Editor de Diagrama de Flujo (Flowchart Canvas)
                        </h4>
                        <p className="text-xs text-gray-600 max-w-xl leading-relaxed">
                          Diseña el árbol de decisiones en un lienzo infinito interactivo con zoom, paneo libre y panel de propiedades lateral.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsFlowEditorOpen(true)}
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
                      >
                        <GitBranch className="w-4 h-4" />
                        <span>Abrir Editor en Pantalla Completa</span>
                      </button>

                      <div className="mt-4 pt-3 border-t border-blue-100 flex items-center justify-between text-xs text-blue-900/80 font-medium">
                        <span>Estado actual: {editingService.decisionTree?.length || 0} ramas de nivel raíz</span>
                        <span className="text-[11px] text-blue-600 font-semibold">React Flow 2D Canvas</span>
                      </div>
                    </div>

                    {/* Live Interactive Preview */}
                    {editingService.decisionTree && editingService.decisionTree.length > 0 ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5 text-blue-600" />
                            Vista Previa Interactiva (Estilo Colaborador)
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            Navegación paso a paso
                          </span>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                          <DecisionTreeNavigator
                            tree={editingService.decisionTree}
                            serviceTitle={editingService.title}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 px-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                          <GitBranch className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <h5 className="text-xs font-bold text-slate-800">No hay árbol de decisiones creado aún</h5>
                          <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            Haz clic en el botón superior para abrir el lienzo visual y comenzar a trazar las preguntas y opciones de este trámite.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsFlowEditorOpen(true)}
                          className="px-4 py-2 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Crear Primer Diagrama</span>
                        </button>
                      </div>
                    )}
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

                {/* TAB 4: ARCHIVOS Y MULTIMEDIA (DOBLE OPCIÓN: SUBIDA LOCAL O ENLACE URL) */}
                {serviceModalTab === 'multimedia' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="border-b border-slate-100 pb-2">
                      <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-blue-600" />
                        <span>Archivos y Multimedia (Subida Local o Enlace URL)</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Carga archivos locales desde tu computadora (conversión Base64 instantánea sin servidor) o ingresa enlaces URL externos.
                      </p>
                    </div>

                    {/* 1. FOTO DE LA TARJETA / PORTADA */}
                    <MediaUploadField
                      type="image"
                      label="Foto de la Tarjeta / Portada (Catálogo Principal)"
                      value={editingService.cardImage || ''}
                      onChange={(val) => setEditingService(prev => prev ? ({ ...prev, cardImage: val }) : prev)}
                      placeholderUrl="https://ejemplo.com/foto_portada.jpg o .png"
                      helperText="Reemplaza al ícono genérico en la cuadrícula de inicio. Si está vacío, se mostrará el ícono seleccionado."
                      idPrefix="admin-panel-service-card-media"
                    />

                    {/* 2. IMAGEN / INFOGRAFÍA */}
                    <MediaUploadField
                      type="image"
                      label="Infografía o Imagen Principal"
                      value={editingService.imageUrl || ''}
                      onChange={(val) => setEditingService({ ...editingService, imageUrl: val })}
                      placeholderUrl="https://ejemplo.com/infografia.png o .jpg"
                      helperText="Se muestra como infografía visual destacada en la cabecera del trámite."
                      idPrefix="admin-panel-service"
                    />

                    {/* 3. VIDEO TUTORIAL */}
                    <MediaUploadField
                      type="video"
                      label="Video Tutorial Explicativo"
                      value={editingService.videoUrl || ''}
                      onChange={(val) => setEditingService({ ...editingService, videoUrl: val })}
                      placeholderUrl="https://www.youtube.com/watch?v=... o video directo .mp4"
                      helperText="Soporta videos locales .MP4, enlaces de YouTube o Vimeo."
                      idPrefix="admin-panel-service"
                    />

                    {/* 4. DOCUMENTO / FORMATO PDF */}
                    <MediaUploadField
                      type="pdf"
                      label="Formato o Documento Descargable (PDF / Word)"
                      value={editingService.pdfUrl || ''}
                      onChange={(val) => setEditingService({ ...editingService, pdfUrl: val })}
                      titleValue={editingService.pdfTitle || ''}
                      onTitleChange={(title) => setEditingService({ ...editingService, pdfTitle: title })}
                      placeholderUrl="https://ejemplo.com/formato_oficial.pdf"
                      helperText="Los colaboradores podrán abrir o descargar directamente este archivo oficial."
                      idPrefix="admin-panel-service"
                    />
                  </div>
                )}

                {/* TAB 5: PREGUNTAS FRECUENTES (FAQs) */}
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

      {/* Fullscreen Flowchart Canvas Editor */}
      {isFlowEditorOpen && editingService && (
        <DecisionTreeCanvasEditor
          tree={editingService.decisionTree || []}
          serviceTitle={editingService.title}
          onSave={(newTree) => {
            setEditingService(prev => prev ? ({ ...prev, decisionTree: newTree }) : prev);
            setIsFlowEditorOpen(false);
          }}
          onClose={() => setIsFlowEditorOpen(false)}
        />
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
