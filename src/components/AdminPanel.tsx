import React, { useState, useEffect } from 'react';
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
  Check,
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
  LayoutGrid,
  Wallet,
  CreditCard,
  CalendarClock,
  RotateCcw,
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
import { Service, NewsItem, ServiceId, StepItem, ServiceFAQ, ContactInfo, CategoryConfig } from '../types';
import { getDefaultServiceDetails, initialContact, defaultCategories } from '../data';
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
  onRename?: (id: string, newTitle: string) => void;
}

function SortableServiceItem({ service, onToggleHide, onEdit, onDelete, onRename }: SortableServiceItemProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(service.title);

  useEffect(() => {
    setTitleValue(service.title);
  }, [service.title]);

  const handleSaveTitle = () => {
    setIsEditingTitle(false);
    const trimmedTitle = (titleValue || '').trim();
    if (trimmedTitle && trimmedTitle !== service.title && onRename) {
      onRename(service.id, trimmedTitle);
    } else {
      setTitleValue(service.title);
    }
  };

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
      className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between text-left transition-all ${
        isDragging
          ? 'z-50 shadow-2xl scale-105 border-blue-400 rotate-1 bg-white opacity-95 transition-all'
          : `transition-all duration-150 ${
              service.hidden ? 'opacity-60 border-slate-200 bg-slate-50/50' : 'border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
            }`
      }`}
    >
      {/* Top Header: Icon Left, Drag Handle Right */}
      <div>
        <div className="flex items-center justify-between w-full mb-3.5">
          <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 border border-slate-200/80 overflow-hidden shadow-2xs">
            {service.cardImage ? (
              <img src={service.cardImage} alt={service.title} className="w-full h-full object-cover" />
            ) : (
              <IconComponent className="w-5 h-5 text-slate-600" />
            )}
          </div>

          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl p-2 transition-colors touch-none border-none bg-transparent min-w-[40px] min-h-[40px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            title="Arrastrar para reordenar"
          >
            <GripVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Card Content */}
        <div className="space-y-1.5">
          {isEditingTitle ? (
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTitle();
                  if (e.key === 'Escape') {
                    setTitleValue(service.title);
                    setIsEditingTitle(false);
                  }
                }}
                autoFocus
                className="w-full text-sm font-bold text-slate-900 bg-blue-50/50 border border-blue-400 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600/30 min-h-[40px]"
              />
              <button
                type="button"
                onClick={handleSaveTitle}
                className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shrink-0 min-h-[40px] min-w-[40px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500/30 active:scale-95 transition-all shadow-xs cursor-pointer"
                title="Guardar nuevo nombre de la tarjeta"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="group/title flex items-center justify-between gap-1.5">
              <h4 
                className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1 flex-1 cursor-pointer hover:text-blue-600 transition-colors leading-snug" 
                title={`${service.title} (Haz clic para cambiar nombre)`}
                onClick={() => setIsEditingTitle(true)}
              >
                {service.title}
              </h4>
              <button
                type="button"
                onClick={() => setIsEditingTitle(true)}
                className="opacity-0 group-hover/title:opacity-100 p-2 text-slate-400 hover:text-blue-600 rounded-lg transition-all focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                title="Cambiar nombre de la tarjeta"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {service.shortDesc}
          </p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-slate-100 mt-4 pt-3.5 flex items-center justify-between gap-2">
        <button
          onClick={() => onToggleHide(service.id)}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer min-h-[38px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-[0.98] ${
            service.hidden 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
              : 'bg-slate-100 text-slate-600 border-slate-200/80 hover:bg-slate-200 hover:text-slate-900'
          }`}
          title={service.hidden ? 'Hacer visible' : 'Ocultar trámite'}
        >
          {service.hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          <span>{service.hidden ? 'Mostrar' : 'Ocultar'}</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onEdit(service)}
            className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 border border-blue-200/80 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer min-h-[38px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-[0.98]"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editar</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(service.id, service.title);
            }}
            className="p-2.5 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-600 border border-rose-200/80 rounded-xl transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-rose-500/20 active:scale-[0.98]"
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
  categories?: CategoryConfig[];
  onUpdateCategories?: (categories: CategoryConfig[], updatedServices?: (Service & { hidden?: boolean })[]) => void;
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
  categories,
  onUpdateCategories,
  onLogout
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'tramites' | 'categorias' | 'noticias' | 'contacto'>('tramites');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Categories Form State
  const [categoryForms, setCategoryForms] = useState<CategoryConfig[]>(() => {
    if (categories && categories.length > 0) return categories;
    try {
      const saved = localStorage.getItem('cc-categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error al leer categorías en AdminPanel:', e);
    }
    return defaultCategories;
  });

  // Sync categoryForms if props change
  React.useEffect(() => {
    if (categories && categories.length > 0) {
      setCategoryForms(categories);
    }
  }, [categories]);

  // Contact Form State
  const [contactForm, setContactForm] = useState<ContactInfo>(() => {
    try {
      const saved = localStorage.getItem('portalContactInfo') || localStorage.getItem('cc-contact');
      if (saved) {
        return { ...initialContact, ...(contactInfo || {}), ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Error al leer contacto desde localStorage:', e);
    }
    return contactInfo || initialContact;
  });

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

  // --- CATEGORY HANDLERS ---
  const handleToggleHideCategory = (id: string) => {
    const updated = categoryForms.map(c => c.id === id ? { ...c, hidden: !c.hidden } : c);
    setCategoryForms(updated);
    try {
      localStorage.setItem('cc-categories', JSON.stringify(updated));
    } catch (err) {
      console.error('Error guardando cc-categories en localStorage:', err);
    }
    if (onUpdateCategories) {
      onUpdateCategories(updated);
    }
    showToast('Estado de visibilidad de la tarjeta actualizado.');
  };

  const handleCategoryNameChange = (id: string, newLabel: string) => {
    setCategoryForms(prev => prev.map(c => c.id === id ? { ...c, label: newLabel } : c));
  };

  const handleResetCategoryName = (id: string) => {
    setCategoryForms(prev => prev.map(c => c.id === id ? { ...c, label: c.defaultLabel } : c));
  };

  const handleResetAllCategories = () => {
    setCategoryForms(defaultCategories);
    showToast('Valores predeterminados restaurados en el formulario.');
  };

  const handleSaveCategories = (e: React.FormEvent) => {
    e.preventDefault();

    for (const cat of categoryForms) {
      if (!cat.label?.trim()) {
        alert('Por favor asigna un nombre válido a todas las tarjetas.');
        return;
      }
    }

    // Identificar categorías renombradas para actualizar los trámites existentes
    let updatedServices = [...services];
    let servicesChanged = false;

    const currentSavedCategories = categories && categories.length > 0 ? categories : defaultCategories;

    categoryForms.forEach(newCat => {
      const oldCat = currentSavedCategories.find(c => c.id === newCat.id);
      if (oldCat && oldCat.label !== newCat.label && newCat.id !== 'all') {
        updatedServices = updatedServices.map(srv => {
          if (srv.category === oldCat.label || srv.category === oldCat.defaultLabel) {
            servicesChanged = true;
            return { ...srv, category: newCat.label };
          }
          return srv;
        });
      }
    });

    try {
      localStorage.setItem('cc-categories', JSON.stringify(categoryForms));
    } catch (err) {
      console.error('Error guardando cc-categories en localStorage:', err);
    }

    if (servicesChanged) {
      try {
        localStorage.setItem('cc-services-cms-v1', JSON.stringify(updatedServices));
      } catch (err) {
        console.error('Error guardando servicios renombrados en localStorage:', err);
      }
      onUpdateServices(updatedServices);
    }

    if (onUpdateCategories) {
      onUpdateCategories(categoryForms, servicesChanged ? updatedServices : undefined);
    }

    showToast('¡Tarjetas de la pantalla de inicio actualizadas correctamente!');
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

  const handleRenameService = (id: string, newTitle: string) => {
    const updated = services.map(s => s.id === id ? { ...s, title: newTitle } : s);
    onUpdateServices(updated);
    try {
      localStorage.setItem('cc-services-cms-v1', JSON.stringify(updated));
    } catch (err) {
      console.error('Error al guardar trámite renombrado:', err);
    }
    showToast(`Tarjeta renombrada a "${newTitle}"`);
  };

  const handleOpenNewServiceModal = () => {
    const defaultCategory = categoryForms.find(c => c.id !== 'all')?.label || 'Nómina y Pagos';
    const newService: Service & { hidden?: boolean } = {
      id: `custom_${Date.now()}` as ServiceId,
      title: 'Nuevo Trámite',
      iconName: 'FileText',
      shortDesc: 'Descripción corta para la tarjeta del catálogo...',
      category: defaultCategory,
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
    if (!editingService || !editingService.title?.trim()) return;

    let updatedList: (Service & { hidden?: boolean })[];
    if (isNewService) {
      updatedList = [editingService, ...services];
      onUpdateServices(updatedList);
      showToast('¡Nuevo trámite creado e integrado al portal!');
    } else {
      updatedList = services.map(s => s.id === editingService.id ? editingService : s);
      onUpdateServices(updatedList);
      showToast('Trámite modificado y guardado con éxito.');
    }

    try {
      localStorage.setItem('cc-services-cms-v1', JSON.stringify(updatedList));
    } catch (storageErr) {
      console.error('Error al guardar trámites en localStorage:', storageErr);
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
    if (!editingNews || !editingNews.title?.trim()) return;

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
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
            <span>Panel de Administración</span>
          </h1>
        </div>

        <button
          id="btn-admin-logout"
          onClick={onLogout}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 hover:text-white rounded-xl text-xs sm:text-sm font-semibold transition-all border border-slate-700 flex items-center gap-2 min-h-[40px] active:scale-[0.98] shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-500/40"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          <span>Cerrar Sesión</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 bg-white p-1.5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <button
          id="admin-tab-tramites"
          onClick={() => setActiveTab('tramites')}
          className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 min-h-[42px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-[0.98] cursor-pointer ${
            activeTab === 'tramites'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Trámites</span>
        </button>

        <button
          id="admin-tab-categorias"
          onClick={() => setActiveTab('categorias')}
          className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 min-h-[42px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-[0.98] cursor-pointer ${
            activeTab === 'categorias'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Tarjetas de Inicio</span>
        </button>

        <button
          id="admin-tab-noticias"
          onClick={() => setActiveTab('noticias')}
          className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 min-h-[42px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-[0.98] cursor-pointer ${
            activeTab === 'noticias'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Newspaper className="w-4 h-4" />
          <span>Noticias</span>
        </button>

        <button
          id="admin-tab-contacto"
          onClick={() => setActiveTab('contacto')}
          className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 min-h-[42px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-[0.98] cursor-pointer ${
            activeTab === 'contacto'
              ? 'bg-slate-900 text-white shadow-xs'
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                Catálogo de Trámites
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Organiza, edita o cambia la visibilidad de los trámites disponibles en el kiosco.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                id="btn-edit-categories-shortcut"
                type="button"
                onClick={() => setActiveTab('categorias')}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-all border border-slate-200/80 flex items-center gap-2 cursor-pointer min-h-[40px] focus:outline-none focus:ring-2 focus:ring-slate-400/20 active:scale-[0.98]"
                title="Personalizar nombres de las 4 tarjetas principales"
              >
                <LayoutGrid className="w-4 h-4 text-blue-600" />
                <span>Editar Tarjetas</span>
              </button>
              <button
                id="btn-add-service"
                onClick={handleOpenNewServiceModal}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs flex items-center gap-2 active:scale-[0.98] cursor-pointer min-h-[40px] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Trámite</span>
              </button>
            </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4.5">
                {services.map((service) => (
                  <SortableServiceItem
                    key={service.id}
                    service={service}
                    onToggleHide={handleToggleHideService}
                    onEdit={handleOpenEditServiceModal}
                    onDelete={handleDeleteService}
                    onRename={handleRenameService}
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                Boletín de Noticias Internas
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Publica y edita comunicados y avisos para el personal de la planta.
              </p>
            </div>
            <button
              id="btn-add-news"
              onClick={handleOpenNewNewsModal}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs flex items-center gap-2 shrink-0 active:scale-[0.98] cursor-pointer min-h-[40px] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
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
                className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center shrink-0 border border-blue-100/80 mt-0.5 shadow-2xs">
                    <Newspaper className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    {item.date && (
                      <div className="mb-1">
                        <span className="text-xs text-slate-500 font-medium">
                          {item.date}
                        </span>
                      </div>
                    )}
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-sm text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <button
                    onClick={() => handleOpenEditNewsModal(item)}
                    className="px-4 py-2 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 border border-blue-200/80 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 cursor-pointer min-h-[40px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-[0.98]"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Editar</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNews(item.id, item.title);
                    }}
                    className="p-2.5 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-600 border border-rose-200/80 rounded-xl transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-rose-500/20 active:scale-[0.98]"
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
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5">
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

                try {
                  localStorage.setItem('portalContactInfo', JSON.stringify(contactData));
                  localStorage.setItem('cc-contact', JSON.stringify(contactData));
                } catch (storageErr) {
                  console.error('Error al guardar contacto en localStorage:', storageErr);
                }

                if (onUpdateContact) {
                  onUpdateContact(contactData);
                }

                showToast('✅ Cambios guardados correctamente');
                alert('Cambios guardados correctamente');
              }}
              className="space-y-4 sm:space-y-5"
            >
              {/* WhatsApp Input */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Oficial (Número o Enlace)</span>
                </label>
                <input
                  type="text"
                  value={contactForm.whatsapp}
                  onChange={(e) => setContactForm({ ...contactForm, whatsapp: e.target.value })}
                  placeholder="Ej. https://wa.me/525512345678 o 5512345678"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900 min-h-[44px]"
                  required
                />
                <p className="text-xs text-slate-500">
                  Aparecerá en el botón de WhatsApp directo en la pestaña de Contacto.
                </p>
              </div>

              {/* Ubicacion Input */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span>Ubicación Física del Módulo de Servicios al Personal</span>
                </label>
                <input
                  type="text"
                  value={contactForm.ubicacion}
                  onChange={(e) => setContactForm({ ...contactForm, ubicacion: e.target.value })}
                  placeholder="Ej. Módulo de Servicios al Personal, ubicado a un lado de Ropería"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900 min-h-[44px]"
                  required
                />
              </div>

              {/* Croquis de Ubicación (Opcional) */}
              <MediaUploadField
                type="image"
                label="Croquis de Ubicación (Opcional)"
                helperText="Sube una imagen o mapa visual para guiar al personal hacia el módulo."
                value={contactForm.croquisUrl || ''}
                onChange={(url) => setContactForm({ ...contactForm, croquisUrl: url })}
                idPrefix="contact_croquis"
              />

              {/* Horario Input */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span>Horario de Atención del Módulo</span>
                </label>
                <input
                  type="text"
                  value={contactForm.horario}
                  onChange={(e) => setContactForm({ ...contactForm, horario: e.target.value })}
                  placeholder="Ej. Lunes a Viernes de 8:00 AM a 5:00 PM • Sábados de 8:00 AM a 1:00 PM"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900 min-h-[44px]"
                  required
                />
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  id="btn-save-contact-info"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold rounded-xl flex items-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer min-h-[42px] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW D: PERSONALIZAR TARJETAS DE INICIO / CATEGORÍAS */}
      {activeTab === 'categorias' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-blue-600" />
                  <span>Personalizar Tarjetas de la Pantalla de Inicio</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Modifica los títulos de las 4 tarjetas principales que se muestran en el kiosco. Si renombras una categoría, los trámites asociados se actualizarán automáticamente.
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetAllCategories}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-slate-200/80 cursor-pointer self-start sm:self-auto shrink-0 flex items-center gap-2 min-h-[38px] focus:outline-none focus:ring-2 focus:ring-slate-400/20 active:scale-[0.98]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer Todo</span>
              </button>
            </div>

            <form onSubmit={handleSaveCategories} className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {categoryForms.map((cat, index) => {
                  const count = cat.id === 'all'
                    ? services.filter(s => !s.hidden).length
                    : services.filter(s => !s.hidden && (s.category === cat.label || s.category === cat.defaultLabel || s.category === cat.id)).length;

                  const iconMap: Record<string, any> = {
                    LayoutGrid,
                    Wallet,
                    CreditCard,
                    CalendarClock
                  };
                  const IconComp = iconMap[cat.iconName] || LayoutGrid;

                  const colorBgMap: Record<string, string> = {
                    indigo: 'bg-indigo-50/80 border-indigo-100 text-indigo-600',
                    emerald: 'bg-emerald-50/80 border-emerald-100 text-emerald-600',
                    violet: 'bg-violet-50/80 border-violet-100 text-violet-600',
                    amber: 'bg-amber-50/80 border-amber-100 text-amber-600',
                  };
                  const badgeColor = colorBgMap[cat.colorScheme] || colorBgMap.indigo;

                  return (
                    <div 
                      key={cat.id} 
                      className={`bg-white border rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all ${
                        cat.hidden ? 'opacity-65 border-slate-200 bg-slate-50/50' : 'border-slate-200/90'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Vista previa miniatura de la tarjeta real */}
                        <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 shadow-2xs ${badgeColor}`}>
                          <IconComp className="w-7 h-7" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Tarjeta #{index + 1} • {cat.id === 'all' ? 'Ver Todos' : 'Filtro por Categoría'}
                              </span>
                              {cat.hidden && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                  Oculto
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                                {count} {count === 1 ? 'trámite' : 'trámites'}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleToggleHideCategory(cat.id)}
                                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-[0.98] ${
                                  cat.hidden 
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                                    : 'bg-slate-100 text-slate-600 border-slate-200/80 hover:bg-slate-200 hover:text-slate-900'
                                }`}
                                title={cat.hidden ? 'Hacer visible tarjeta' : 'Ocultar tarjeta'}
                              >
                                {cat.hidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                <span>{cat.hidden ? 'Mostrar' : 'Ocultar'}</span>
                              </button>
                            </div>
                          </div>

                          <div className="mt-2.5 space-y-1.5">
                            <label 
                              htmlFor={`input-cat-${cat.id}`} 
                              className="block text-xs sm:text-sm font-bold text-slate-800"
                            >
                              Nombre visible en la tarjeta *
                            </label>
                            <input
                              id={`input-cat-${cat.id}`}
                              type="text"
                              value={cat.label}
                              onChange={(e) => handleCategoryNameChange(cat.id, e.target.value)}
                              placeholder={cat.defaultLabel}
                              className="w-full px-3.5 py-2.5 text-sm font-semibold border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs min-h-[42px]"
                              required
                            />
                          </div>

                          <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                            <span>Predeterminado: <span className="font-semibold text-slate-600">{cat.defaultLabel}</span></span>
                            {cat.label !== cat.defaultLabel && (
                              <button
                                type="button"
                                onClick={() => handleResetCategoryName(cat.id)}
                                className="text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer focus:outline-none"
                              >
                                Restablecer
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Preview en vivo */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-slate-400 font-medium">Vista previa en inicio:</span>
                        <span className="font-bold text-slate-800 truncate max-w-[220px]">
                          {cat.label || <span className="text-slate-400 italic">Sin nombre</span>}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tips & Save Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  💡 Al guardar, los cambios se reflejarán de inmediato en el Kiosco y se conservarán en este dispositivo.
                </p>
                <button
                  type="submit"
                  id="btn-save-categories"
                  className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] cursor-pointer min-h-[42px] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Nombres de Tarjetas</span>
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
            <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center gap-1.5 shrink-0 overflow-x-auto">
              <button
                type="button"
                onClick={() => setServiceModalTab('general')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap min-h-[38px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  serviceModalTab === 'general'
                    ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Info className="w-4 h-4" />
                <span>Información General</span>
              </button>

              <button
                type="button"
                onClick={() => setServiceModalTab('arbol')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap min-h-[38px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  serviceModalTab === 'arbol'
                    ? 'bg-white text-blue-700 shadow-2xs border border-slate-200 font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Árbol de Decisión ({editingService.decisionTree?.length || 0})</span>
              </button>

              <button
                type="button"
                onClick={() => setServiceModalTab('pasos')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap min-h-[38px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  serviceModalTab === 'pasos'
                    ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <ListOrdered className="w-4 h-4" />
                <span>Paso a Paso ({editingService.steps?.length || 0})</span>
              </button>

              <button
                type="button"
                onClick={() => setServiceModalTab('requisitos')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap min-h-[38px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  serviceModalTab === 'requisitos'
                    ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Requisitos y Contacto</span>
              </button>

              <button
                type="button"
                onClick={() => setServiceModalTab('multimedia')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap min-h-[38px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  serviceModalTab === 'multimedia'
                    ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Archivos y Multimedia</span>
              </button>

              <button
                type="button"
                onClick={() => setServiceModalTab('faqs')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap min-h-[38px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  serviceModalTab === 'faqs'
                    ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Preguntas Frecuentes ({editingService.faqs?.length || 0})</span>
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveService} className="flex flex-col flex-1 min-h-0">
              <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">

                {/* TAB 1: INFORMACIÓN GENERAL */}
                {serviceModalTab === 'general' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="space-y-1.5">
                      <label className="block text-xs sm:text-sm font-bold text-slate-700">
                        Título del Trámite *
                      </label>
                      <input
                        type="text"
                        value={editingService.title}
                        onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                        placeholder="Ej. Poliza de Seguro Social o Permiso de Falta"
                        className="w-full px-4 py-2.5 text-sm font-medium border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 min-h-[44px]"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs sm:text-sm font-bold text-slate-700">
                        Módulo / Categoría Oficial *
                      </label>
                      <select
                        value={editingService.category}
                        onChange={(e) => setEditingService({ ...editingService, category: e.target.value as any })}
                        className="w-full px-4 py-2.5 text-sm font-medium border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 min-h-[44px]"
                      >
                        {categoryForms.filter(c => c.id !== 'all').map((cat) => (
                          <option key={cat.id} value={cat.label}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs sm:text-sm font-bold text-slate-700">
                        Ícono de la Tarjeta *
                      </label>
                      <select
                        value={editingService.iconName || editingService.icon || 'FileText'}
                        onChange={(e) => setEditingService({ ...editingService, iconName: e.target.value, icon: e.target.value })}
                        className="w-full px-4 py-2.5 text-sm font-medium border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 min-h-[44px]"
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
                    <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2">
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

                    <div className="space-y-1.5">
                      <label className="block text-xs sm:text-sm font-bold text-slate-700">
                        Descripción Corta (Tarjeta Catálogo) *
                      </label>
                      <textarea
                        rows={2}
                        value={editingService.shortDesc}
                        onChange={(e) => setEditingService({ ...editingService, shortDesc: e.target.value })}
                        placeholder="Resumen para la vista en cuadrícula..."
                        className="w-full px-4 py-2.5 text-sm font-medium border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 leading-relaxed"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs sm:text-sm font-bold text-slate-700">
                        Descripción Completa (Vista Detalle)
                      </label>
                      <textarea
                        rows={3}
                        value={editingService.fullDescription || ''}
                        onChange={(e) => setEditingService({ ...editingService, fullDescription: e.target.value })}
                        placeholder="Explicación detallada del trámite para el trabajador..."
                        className="w-full px-4 py-2.5 text-sm font-medium border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 leading-relaxed"
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
                      <span className="text-xs sm:text-sm font-bold text-slate-700">
                        Pasos del Procedimiento ({editingService.steps?.length || 0})
                      </span>
                      <button
                        type="button"
                        onClick={handleAddStep}
                        className="px-3.5 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 border border-blue-200/80 cursor-pointer min-h-[36px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-[0.98]"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Agregar Paso</span>
                      </button>
                    </div>

                    <div className="space-y-3.5">
                      {editingService.steps && editingService.steps.length > 0 ? (
                        editingService.steps.map((step, idx) => (
                          <div key={idx} className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/90 space-y-3 relative shadow-2xs">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold text-white bg-slate-900 px-2.5 py-1 rounded-md">
                                Paso {step.num || idx + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveStep(idx)}
                                className="text-rose-500 hover:text-rose-700 p-2 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                                title="Eliminar paso"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <input
                              type="text"
                              value={step.title}
                              onChange={(e) => handleUpdateStep(idx, 'title', e.target.value)}
                              placeholder="Título del paso (ej. Validación con Supervisor)"
                              className="w-full px-4 py-2 text-sm font-bold border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 min-h-[42px]"
                            />

                            <textarea
                              rows={2}
                              value={step.desc}
                              onChange={(e) => handleUpdateStep(idx, 'desc', e.target.value)}
                              placeholder="Descripción detallada de lo que debe realizar el colaborador..."
                              className="w-full px-4 py-2.5 text-sm font-normal border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 leading-relaxed"
                            />
                          </div>
                        ))
                      ) : (
                        <p className="text-xs sm:text-sm text-slate-500 italic text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                          No se han definido pasos. Haz clic en "Agregar Paso".
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: REQUISITOS Y CONTACTO */}
                {serviceModalTab === 'requisitos' && (
                  <div className="space-y-5 animate-fadeIn">
                    {/* Lista de Requisitos */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-xs sm:text-sm font-bold text-slate-700">
                          Requisitos Necesarios
                        </label>
                        <button
                          type="button"
                          onClick={handleAddRequirement}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 border border-emerald-200/80 cursor-pointer min-h-[36px] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 active:scale-[0.98]"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Agregar Requisito</span>
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {editingService.requirements && editingService.requirements.length > 0 ? (
                          editingService.requirements.map((req, idx) => (
                            <div key={idx} className="flex items-center gap-2.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                              <input
                                type="text"
                                value={req}
                                onChange={(e) => handleUpdateRequirement(idx, e.target.value)}
                                placeholder="Ej. Gafete oficial activo o Identificación INE"
                                className="flex-1 px-4 py-2 text-sm font-medium border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 min-h-[42px]"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveRequirement(idx)}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs sm:text-sm text-slate-500 italic py-3">No hay requisitos registrados.</p>
                        )}
                      </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Campos de Atención y Ubicación */}
                    <div className="space-y-4">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                        Ubicación, Horario y Teléfono
                      </h4>

                      <div className="space-y-1.5">
                        <label className="block text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-slate-500" />
                          <span>Ubicación de Atención</span>
                        </label>
                        <input
                          type="text"
                          value={editingService.location || ''}
                          onChange={(e) => setEditingService({ ...editingService, location: e.target.value })}
                          placeholder="Ej. Planta Baja • Edificio de Recursos Humanos"
                          className="w-full px-4 py-2.5 text-sm font-medium border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 min-h-[42px]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-slate-500" />
                          <span>Horario de Atención</span>
                        </label>
                        <input
                          type="text"
                          value={editingService.schedule || ''}
                          onChange={(e) => setEditingService({ ...editingService, schedule: e.target.value })}
                          placeholder="Ej. Lunes a Viernes de 8:00 AM a 5:00 PM"
                          className="w-full px-4 py-2.5 text-sm font-medium border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 min-h-[42px]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1.5">
                          <Phone className="w-4 h-4 text-slate-500" />
                          <span>Teléfono o Extensión de Contacto</span>
                        </label>
                        <input
                          type="text"
                          value={editingService.contact || ''}
                          onChange={(e) => setEditingService({ ...editingService, contact: e.target.value })}
                          placeholder="Ej. Atención a Nóminas - Ext. 201"
                          className="w-full px-4 py-2.5 text-sm font-medium border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 min-h-[42px]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: ARCHIVOS Y MULTIMEDIA (DOBLE OPCIÓN: SUBIDA LOCAL O ENLACE URL) */}
                {serviceModalTab === 'multimedia' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="border-b border-slate-100 pb-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-blue-600" />
                        <span>Archivos y Multimedia (Subida Local o Enlace URL)</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
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
                      <span className="text-xs sm:text-sm font-bold text-slate-700">
                        Preguntas Frecuentes ({editingService.faqs?.length || 0})
                      </span>
                      <button
                        type="button"
                        onClick={handleAddFAQ}
                        className="px-3.5 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 border border-blue-200/80 cursor-pointer min-h-[36px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-[0.98]"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Agregar Pregunta</span>
                      </button>
                    </div>

                    <div className="space-y-3.5">
                      {editingService.faqs && editingService.faqs.length > 0 ? (
                        editingService.faqs.map((faq, idx) => (
                          <div key={idx} className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/90 space-y-3 relative shadow-2xs">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-md">
                                FAQ #{idx + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveFAQ(idx)}
                                className="text-rose-500 hover:text-rose-700 p-2 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                                title="Eliminar pregunta"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <input
                              type="text"
                              value={faq.question}
                              onChange={(e) => handleUpdateFAQ(idx, 'question', e.target.value)}
                              placeholder="Pregunta frecuente (ej. ¿Qué pasa si no cobro a tiempo?)"
                              className="w-full px-4 py-2 text-sm font-bold border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 min-h-[42px]"
                            />

                            <textarea
                              rows={2}
                              value={faq.answer}
                              onChange={(e) => handleUpdateFAQ(idx, 'answer', e.target.value)}
                              placeholder="Respuesta detallada..."
                              className="w-full px-4 py-2.5 text-sm font-normal border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 leading-relaxed"
                            />
                          </div>
                        ))
                      ) : (
                        <p className="text-xs sm:text-sm text-slate-500 italic text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                          No hay preguntas registradas. Haz clic en "Agregar Pregunta".
                        </p>
                      )}
                    </div>
                  </div>
                )}

              </div>

              {/* Modal Footer Controls */}
              <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
                <div className="text-xs text-slate-500 font-medium hidden sm:block">
                  Los cambios se actualizarán inmediatamente en el portal.
                </div>
                <div className="flex items-center gap-2.5 ml-auto">
                  <button
                    type="button"
                    onClick={() => setIsServiceModalOpen(false)}
                    className="px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 cursor-pointer min-h-[42px] focus:outline-none focus:ring-2 focus:ring-slate-400/20"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl flex items-center gap-2 shadow-xs active:scale-[0.98] transition-all cursor-pointer min-h-[42px] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
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
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200/90 shadow-xl overflow-hidden">
            <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
              <h3 className="text-base font-bold">
                {isNewNews ? 'Publicar Nueva Noticia' : 'Editar Noticia'}
              </h3>
              <button 
                onClick={() => setIsNewsModalOpen(false)} 
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 active:scale-95 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNews} className="p-5 sm:p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold text-slate-800">
                  Título del Comunicado *
                </label>
                <input
                  type="text"
                  value={editingNews.title}
                  onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                  placeholder="Ej. Jornada de Evaluación en Planta"
                  className="w-full px-4 py-2.5 text-sm font-medium border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 min-h-[44px]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold text-slate-800">
                  Categoría
                </label>
                <select
                  value={editingNews.category}
                  onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value as any })}
                  className="w-full px-4 py-2.5 text-sm font-medium border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 min-h-[44px]"
                >
                  <option value="comunicado">Comunicado Oficial</option>
                  <option value="evento">Evento / Capacitación</option>
                  <option value="logro">Logro de Equipo</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold text-slate-800">
                  Resumen Corto *
                </label>
                <input
                  type="text"
                  value={editingNews.summary}
                  onChange={(e) => setEditingNews({ ...editingNews, summary: e.target.value })}
                  placeholder="Texto visible en la vista previa..."
                  className="w-full px-4 py-2.5 text-sm font-medium border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 min-h-[44px]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold text-slate-800">
                  Contenido Completo *
                </label>
                <textarea
                  rows={4}
                  value={editingNews.content}
                  onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
                  placeholder="Detalle de la noticia..."
                  className="w-full px-4 py-2.5 text-sm font-medium border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 leading-relaxed"
                  required
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewsModalOpen(false)}
                  className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 active:bg-slate-100 cursor-pointer min-h-[42px] focus:outline-none focus:ring-2 focus:ring-slate-400/20 active:scale-[0.98]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl flex items-center gap-2 shadow-xs active:scale-[0.98] cursor-pointer min-h-[42px] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                >
                  <Save className="w-4 h-4" />
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
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200/90 shadow-2xl overflow-hidden p-6 space-y-4 text-center">
            <div className="w-13 h-13 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shrink-0 shadow-2xs">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                ¿Eliminar {deleteConfirmTarget.type === 'service' ? 'Trámite' : 'Noticia'}?
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-2 line-clamp-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                "{deleteConfirmTarget.title}"
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Esta acción eliminará permanentemente el elemento de la lista del portal.
              </p>
            </div>
            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmTarget(null)}
                className="flex-1 py-2.5 px-4 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer min-h-[44px] focus:outline-none focus:ring-2 focus:ring-slate-400/20 active:scale-[0.98]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs active:scale-[0.98] cursor-pointer min-h-[44px] focus:outline-none focus:ring-2 focus:ring-rose-500/30"
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
