import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, FileText, CheckCircle2, Clock, MapPin, Phone, 
  HelpCircle, Edit3, Save, Plus, Trash2, X, AlertCircle, Check,
  Image as ImageIcon, Video, FileDown, Eye, EyeOff, AlertTriangle,
  ExternalLink, Download, Layers, Sparkles, GripVertical, ChevronUp, ChevronDown, Sliders, Info, ListOrdered,
  Maximize2, Minimize2, ZoomIn, LayoutGrid, Type
} from 'lucide-react';
import { Service, UserProfile, FAQ, StepItem, ServiceFAQ, ServiceAttachment, CategoryConfig } from '../types';
import { getDefaultServiceDetails, defaultCategories } from '../data';
import { SERVICE_ICON_MAP } from './ServiceCard';
import { MediaUploadField } from './MediaUploadField';
import { ImageLightboxModal } from './ImageLightboxModal';
import { DecisionTreeBuilder } from './DecisionTreeBuilder';
import { DecisionTreeNavigator } from './DecisionTreeNavigator';
import { DecisionTreeCanvasEditor } from './DecisionTreeCanvasEditor';
import { BlockBuilder } from './BlockBuilder';
import { PageBuilderFullScreenEditor } from './PageBuilderFullScreenEditor';
import { LayoutBlocksRenderer } from './LayoutBlocksRenderer';
import { ensureServiceLayoutBlocks } from '../utils/layoutBlocks';

// Helper to resolve video URLs (YouTube, Vimeo, direct MP4, or Base64 data URL)
function getEmbedVideoInfo(url?: string): { type: 'youtube' | 'vimeo' | 'direct' | 'iframe'; embedUrl: string } | null {
  if (!url || !url.trim()) return null;
  const cleanUrl = url.trim();

  // Base64 Data URL video or direct MP4/WebM/OGG file
  if (cleanUrl.startsWith('data:video') || cleanUrl.match(/\.(mp4|webm|ogg)$/i)) {
    return { type: 'direct', embedUrl: cleanUrl };
  }

  // YouTube
  const ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const ytMatch = cleanUrl.match(ytRegExp);
  if (ytMatch && ytMatch[2].length === 11) {
    return { type: 'youtube', embedUrl: `https://www.youtube.com/embed/${ytMatch[2]}` };
  }

  // Vimeo
  const vimeoRegExp = /(vimeo\.com\/)(\d+)/;
  const vimeoMatch = cleanUrl.match(vimeoRegExp);
  if (vimeoMatch && vimeoMatch[2]) {
    return { type: 'vimeo', embedUrl: `https://player.vimeo.com/video/${vimeoMatch[2]}` };
  }

  return { type: 'iframe', embedUrl: cleanUrl };
}

function FAQAccordion({ 
  items, 
  isEditing, 
  onUpdateFAQ, 
  onRemoveFAQ, 
  onAddFAQ 
}: { 
  items: ServiceFAQ[];
  isEditing?: boolean;
  onUpdateFAQ?: (index: number, field: 'question' | 'answer', value: string) => void;
  onRemoveFAQ?: (index: number) => void;
  onAddFAQ?: () => void;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  if (isEditing) {
    return (
      <div className="space-y-3">
        {items && items.length > 0 ? (
          items.map((faq, idx) => (
            <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-blue-200/80 space-y-2.5 relative shadow-2xs">
              <div className="flex items-center justify-between gap-2 border-b border-slate-200/70 pb-1.5">
                <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md">
                  FAQ #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveFAQ && onRemoveFAQ(idx)}
                  className="text-rose-500 hover:text-rose-700 p-1 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-medium"
                  title="Eliminar pregunta"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Eliminar</span>
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Pregunta:</label>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => onUpdateFAQ && onUpdateFAQ(idx, 'question', e.target.value)}
                  placeholder="Pregunta frecuente (ej. ¿Cuándo se solicita el trámite?)"
                  className="w-full px-3 py-1.5 text-xs font-bold border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Respuesta:</label>
                <textarea
                  rows={2}
                  value={faq.answer}
                  onChange={(e) => onUpdateFAQ && onUpdateFAQ(idx, 'answer', e.target.value)}
                  placeholder="Explicación detallada de la respuesta..."
                  className="w-full px-3 py-1.5 text-xs font-normal border border-slate-300 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-400 italic text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            No hay preguntas registradas. Haz clic abajo para agregar una.
          </p>
        )}

        <button
          type="button"
          onClick={onAddFAQ}
          className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-all border border-blue-200/80 flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Pregunta Frecuente</span>
        </button>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {items.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all">
            <button
              onClick={() => toggle(idx)}
              className="w-full text-left p-3.5 flex gap-3 items-center justify-between hover:bg-slate-50 transition-colors focus:outline-none"
            >
              <div className="text-xs font-bold text-slate-800 flex gap-2 items-start flex-1 pr-2">
                <span className={`text-[10px] font-extrabold rounded-md px-1.5 py-0.5 shrink-0 transition-colors ${
                  isOpen ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                }`}>FAQ</span>
                <span className="mt-0.5 leading-snug">{faq.question}</span>
              </div>
              <span className={`text-slate-400 transition-transform duration-200 text-xs font-bold ${
                isOpen ? 'rotate-180 text-blue-600' : ''
              }`}>
                ▼
              </span>
            </button>
            
            {isOpen && (
              <div className="px-4 pb-3.5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/60 animate-fadeIn pt-3">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Live Preview Component for Split View Admin Editor
function LivePreviewPanel({ 
  draft, 
  onSelectTab,
  onOpenLightbox
}: { 
  draft: Service & { hidden?: boolean };
  onSelectTab: (tab: 'general' | 'arbol' | 'bloques') => void;
  onOpenLightbox?: (url: string, title?: string) => void;
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoInfo = getEmbedVideoInfo(draft.videoUrl);

  return (
    <>
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 text-slate-900 shadow-sm border border-slate-200/90 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <button 
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity text-left group"
            title="Haz clic para ver la vista previa a pantalla completa"
          >
            <Eye className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-800 group-hover:text-blue-700">
              Vista previa
            </span>
            <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
              <Maximize2 className="w-2.5 h-2.5 text-blue-600" />
              Ampliar
            </span>
          </button>
        </div>

        {/* Preview Container Mockup */}
        <div 
          className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-slate-900 max-h-[650px] overflow-y-auto custom-scrollbar relative group/preview"
        >
          {/* Header Card (Información General) */}
          <div 
            onClick={() => onSelectTab('general')}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-4 cursor-pointer hover:border-blue-300 transition-all flex flex-col gap-2"
            title="Haz clic para editar información general"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider border border-blue-200/60">
                {draft.category || 'Categoría'}
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              {draft.cardImage && draft.cardImage.trim().length > 0 ? (
                <img 
                  src={draft.cardImage} 
                  alt={draft.title || 'Foto'} 
                  className="w-12 h-12 rounded-xl object-cover shadow-2xs border border-slate-200 shrink-0" 
                />
              ) : (
                <div className="bg-blue-50 text-blue-600 rounded-lg p-2 shrink-0 flex items-center justify-center border border-blue-100">
                  {React.createElement(SERVICE_ICON_MAP[draft.iconName || draft.icon || 'FileText'] || FileText, {
                    className: "w-5 h-5"
                  })}
                </div>
              )}
              <h3 className="text-sm font-bold text-slate-900 font-display line-clamp-2">{draft.title || 'Título sin definir'}</h3>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-3 pt-1 border-t border-slate-100 mt-1">
              {draft.shortDesc || draft.fullDescription}
            </p>
          </div>

          {/* Decision Tree Interactive Preview */}
          {draft.decisionTree && draft.decisionTree.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between px-1 mb-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  Árbol de Decisión
                </span>
                <button
                  type="button"
                  onClick={() => onSelectTab('arbol')}
                  className="text-[10px] font-bold text-slate-500 hover:text-blue-600"
                >
                  Editar flujo
                </button>
              </div>
              <DecisionTreeNavigator
                tree={draft.decisionTree}
                onOpenLightbox={onOpenLightbox}
                serviceTitle={draft.title}
              />
            </div>
          )}

          {/* Dynamic Content Blocks */}
          <div className="space-y-2 mt-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                <LayoutGrid className="w-3 h-3 text-blue-600" />
                Bloques de Contenido ({draft.layoutBlocks?.length || 0})
              </span>
              <button
                type="button"
                onClick={() => onSelectTab('bloques')}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                Editar bloques
              </button>
            </div>
            {draft.layoutBlocks && draft.layoutBlocks.length > 0 ? (
              <LayoutBlocksRenderer 
                blocks={draft.layoutBlocks} 
                onOpenLightbox={onOpenLightbox} 
              />
            ) : (
              <div 
                onClick={() => onSelectTab('bloques')}
                className="p-4 rounded-xl border border-dashed border-slate-300 bg-white text-center cursor-pointer hover:border-blue-400 transition-colors"
              >
                <p className="text-xs text-slate-400 font-medium">No hay bloques de contenido añadidos.</p>
                <span className="text-[11px] text-blue-600 font-bold mt-1 inline-block">Haz clic para agregar bloques con el constructor</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FULLSCREEN PREVIEW MODAL OVERLAY */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsFullscreen(false);
          }}
        >
          <div className="bg-slate-100 rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-scaleUp">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-4 sm:px-6 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-blue-600 text-white shrink-0">
                  <Eye className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-white font-display truncate">
                      Vista Previa en Pantalla Completa
                    </h3>
                    <span className="text-[10px] font-extrabold text-blue-300 bg-blue-950 px-2 py-0.5 rounded-md border border-blue-800 shrink-0">
                      Así se verá publicado
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate hidden sm:block">
                    Vista previa exacta interactiva del trámite para los empleados.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700 cursor-pointer shrink-0 active:scale-95"
                title="Cerrar vista previa ampliada"
              >
                <Minimize2 className="w-4 h-4" />
                <span>Cerrar</span>
              </button>
            </div>

            {/* Modal Body: Full Trámite Render */}
            <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
              
              {/* Header Card */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-3 py-1 rounded-md uppercase tracking-wider border border-blue-200/60">
                    {draft.category || 'Categoría'}
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  {draft.cardImage && draft.cardImage.trim().length > 0 ? (
                    <img 
                      src={draft.cardImage} 
                      alt={draft.title || 'Foto'} 
                      className="w-12 h-12 rounded-xl object-cover shadow-2xs border border-slate-200 shrink-0" 
                    />
                  ) : (
                    <div className="bg-blue-50 text-blue-600 rounded-xl p-2.5 shrink-0 border border-blue-100">
                      {React.createElement(SERVICE_ICON_MAP[draft.iconName || draft.icon || 'FileText'] || FileText, {
                        className: "w-7 h-7 text-blue-600"
                      })}
                    </div>
                  )}
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">{draft.title || 'Título sin definir'}</h1>
                </div>

                <p className="text-sm text-slate-600 font-medium leading-relaxed pt-2 border-t border-slate-100">
                  {draft.fullDescription || draft.shortDesc}
                </p>
              </div>

              {/* Árbol de Decisión Independiente */}
              {draft.decisionTree && draft.decisionTree.length > 0 && (
                <div className="mb-4">
                  <DecisionTreeNavigator
                    tree={draft.decisionTree}
                    onOpenLightbox={onOpenLightbox}
                    serviceTitle={draft.title}
                  />
                </div>
              )}

              {/* Dynamic Content Blocks */}
              <LayoutBlocksRenderer
                blocks={draft.layoutBlocks || []}
                onOpenLightbox={onOpenLightbox}
              />
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-900 text-white p-3.5 sm:px-6 flex items-center justify-between border-t border-slate-800 shrink-0">
              <span className="text-xs text-slate-400 hidden sm:inline">
                Vista previa completa en tiempo real.
              </span>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ml-auto active:scale-95"
              >
                Volver a la Edición
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

interface ServiceDetailProps {
  service: Service & { hidden?: boolean };
  user?: UserProfile;
  onBack: () => void;
  isAdminLoggedIn?: boolean;
  onUpdateService?: (updatedService: Service & { hidden?: boolean }) => void;
  initialEditMode?: boolean;
  onLightboxToggle?: (isOpen: boolean) => void;
}

export default function ServiceDetail({ 
  service, 
  user, 
  onBack, 
  isAdminLoggedIn = false,
  onUpdateService,
  initialEditMode = false,
  onLightboxToggle
}: ServiceDetailProps) {
  const [isEditing, setIsEditing] = useState<boolean>(initialEditMode);
  const [toastMsg, setToastMsg] = useState<string>('');
  const [editorTab, setEditorTab] = useState<'general' | 'arbol' | 'bloques'>('general');
  const [mobileViewMode, setMobileViewMode] = useState<'editor' | 'preview'>('editor');
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title?: string } | null>(null);

  // Sync lightbox state with parent component
  useEffect(() => {
    onLightboxToggle?.(Boolean(lightboxImage && lightboxImage.url));
  }, [lightboxImage, onLightboxToggle]);

  // Hydrate draft with current service state or data defaults
  const getPreparedDraft = (s: Service & { hidden?: boolean }) => {
    const computed = getDefaultServiceDetails(s);
    const hydrated: Service & { hidden?: boolean } = {
      ...s,
      decisionTree: s.decisionTree ? [...s.decisionTree] : (computed.decisionTree ? [...computed.decisionTree] : []),
      fullDescription: s.fullDescription || computed.fullDescription,
      steps: s.steps && s.steps.length > 0 ? s.steps : (computed.steps || []),
      requirements: s.requirements && s.requirements.length > 0 ? s.requirements : (computed.requirements || []),
      location: s.location || computed.location,
      schedule: s.schedule || computed.schedule,
      contact: s.contact || computed.contact,
      faqs: s.faqs && s.faqs.length > 0 ? s.faqs : (computed.faqs || []),
      imageUrl: s.imageUrl ?? computed.imageUrl,
      videoUrl: s.videoUrl ?? computed.videoUrl,
      pdfUrl: s.pdfUrl ?? computed.pdfUrl,
      pdfTitle: s.pdfTitle ?? computed.pdfTitle,
      attachments: s.attachments ?? computed.attachments,
      alertNotice: s.alertNotice ?? computed.alertNotice,
      layoutBlocks: s.layoutBlocks && s.layoutBlocks.length > 0 ? s.layoutBlocks : undefined
    };
    return ensureServiceLayoutBlocks(hydrated);
  };

  const [draft, setDraft] = useState<(Service & { hidden?: boolean })>(() => getPreparedDraft(service));
  const [isFlowEditorOpen, setIsFlowEditorOpen] = useState(false);
  const [isPageBuilderOpen, setIsPageBuilderOpen] = useState(false);

  // Available categories from localStorage or defaults
  const availableCategories = React.useMemo<CategoryConfig[]>(() => {
    try {
      const saved = localStorage.getItem('cc-categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error al leer categorías en ServiceDetail:', e);
    }
    return defaultCategories;
  }, []);

  // Sync draft when service prop changes
  useEffect(() => {
    setDraft(getPreparedDraft(service));
  }, [service]);

  // Track if modified
  const isModified = React.useMemo(() => {
    return JSON.stringify(draft) !== JSON.stringify(getPreparedDraft(service));
  }, [draft, service]);

  // Toast feedback helper
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // --- REORDER HANDLERS FOR STEPS ---
  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    if (!draft.steps) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= draft.steps.length) return;
    const newSteps = [...draft.steps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIndex];
    newSteps[targetIndex] = temp;
    const renumbered = newSteps.map((s, i) => ({ ...s, num: i + 1 }));
    setDraft({ ...draft, steps: renumbered });
  };

  // --- REORDER HANDLERS FOR FAQS ---
  const handleMoveFAQ = (index: number, direction: 'up' | 'down') => {
    if (!draft.faqs) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= draft.faqs.length) return;
    const newFaqs = [...draft.faqs];
    const temp = newFaqs[index];
    newFaqs[index] = newFaqs[targetIndex];
    newFaqs[targetIndex] = temp;
    setDraft({ ...draft, faqs: newFaqs });
  };

  // --- REORDER HANDLERS FOR REQUIREMENTS ---
  const handleMoveRequirement = (index: number, direction: 'up' | 'down') => {
    if (!draft.requirements) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= draft.requirements.length) return;
    const newReqs = [...draft.requirements];
    const temp = newReqs[index];
    newReqs[index] = newReqs[targetIndex];
    newReqs[targetIndex] = temp;
    setDraft({ ...draft, requirements: newReqs });
  };

  // --- EDIT HANDLERS FOR STEPS ---
  const handleAddStep = () => {
    const currentSteps = draft.steps || [];
    const newStepNum = currentSteps.length + 1;
    setDraft({
      ...draft,
      steps: [...currentSteps, { num: newStepNum, title: '', desc: '' }]
    });
  };

  const handleUpdateStep = (index: number, field: 'title' | 'desc', value: string) => {
    if (!draft.steps) return;
    const updated = draft.steps.map((step, i) => {
      if (i === index) {
        return { ...step, [field]: value };
      }
      return step;
    });
    setDraft({ ...draft, steps: updated });
  };

  const handleRemoveStep = (index: number) => {
    if (!draft.steps) return;
    const updated = draft.steps.filter((_, i) => i !== index).map((step, i) => ({
      ...step,
      num: i + 1
    }));
    setDraft({ ...draft, steps: updated });
  };

  // --- EDIT HANDLERS FOR REQUIREMENTS ---
  const handleAddRequirement = () => {
    const current = draft.requirements || [];
    setDraft({
      ...draft,
      requirements: [...current, '']
    });
  };

  const handleUpdateRequirement = (index: number, value: string) => {
    if (!draft.requirements) return;
    const updated = draft.requirements.map((req, i) => (i === index ? value : req));
    setDraft({ ...draft, requirements: updated });
  };

  const handleRemoveRequirement = (index: number) => {
    if (!draft.requirements) return;
    const updated = draft.requirements.filter((_, i) => i !== index);
    setDraft({ ...draft, requirements: updated });
  };

  // --- EDIT HANDLERS FOR FAQS ---
  const handleAddFAQ = () => {
    const current = draft.faqs || [];
    setDraft({
      ...draft,
      faqs: [...current, { question: '', answer: '' }]
    });
  };

  const handleUpdateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    if (!draft.faqs) return;
    const updated = draft.faqs.map((faq, i) => {
      if (i === index) {
        return { ...faq, [field]: value };
      }
      return faq;
    });
    setDraft({ ...draft, faqs: updated });
  };

  const handleRemoveFAQ = (index: number) => {
    if (!draft.faqs) return;
    const updated = draft.faqs.filter((_, i) => i !== index);
    setDraft({ ...draft, faqs: updated });
  };

  // --- EDIT HANDLERS FOR ATTACHMENTS ---
  const handleAddAttachment = () => {
    const current = draft.attachments || [];
    setDraft({
      ...draft,
      attachments: [...current, { name: 'Formato de Solicitud PDF', url: 'https://example.com/formato.pdf', fileType: 'pdf' }]
    });
  };

  const handleUpdateAttachment = (index: number, field: keyof ServiceAttachment, value: string) => {
    if (!draft.attachments) return;
    const updated = draft.attachments.map((att, i) => {
      if (i === index) {
        return { ...att, [field]: value };
      }
      return att;
    });
    setDraft({ ...draft, attachments: updated });
  };

  const handleRemoveAttachment = (index: number) => {
    if (!draft.attachments) return;
    const updated = draft.attachments.filter((_, i) => i !== index);
    setDraft({ ...draft, attachments: updated });
  };

  // --- SAVE & CANCEL ACTION BAR ---
  const handleSaveEdit = () => {
    if (!draft.title.trim()) {
      showToast('El título del trámite es obligatorio.');
      return;
    }
    if (onUpdateService) {
      onUpdateService(draft);
    }
    setIsEditing(false);
    showToast('¡Cambios guardados correctamente!');
  };

  const handleCancelEdit = () => {
    setDraft(getPreparedDraft(service));
    setIsEditing(false);
  };

  const videoInfo = getEmbedVideoInfo(draft.videoUrl);

  return (
    <div id={`service-detail-${service.id}`} className={`space-y-4 animate-fadeIn ${isEditing ? 'pb-28' : 'pb-16'}`}>
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-2.5 animate-slideDown">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* ADMIN EDIT MODE TOP HEADER / BAR */}
      {isAdminLoggedIn && (
        <div className={`rounded-2xl p-3 sm:p-4 border transition-all flex items-center justify-between gap-3 ${
          isEditing ? 'bg-slate-900 text-white border-slate-800 shadow-md' : 'bg-slate-900 text-white border-slate-800 shadow-2xs'
        }`}>
          <div className="flex items-center gap-3 min-w-0">
            <button 
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all shrink-0 cursor-pointer"
              title="Volver"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0 flex items-center gap-2.5">
              <h2 className="text-sm sm:text-base font-bold text-white truncate font-display">
                {service.title ? 'Editar Trámite' : 'Nuevo Trámite'}
              </h2>
              {isEditing && isModified && (
                <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-800/80 shrink-0">
                  ● Cambios sin guardar
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isEditing ? (
              <button
                onClick={handleCancelEdit}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Cerrar editor"
              >
                <X className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>Editar Trámite</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ==================== EDIT MODE (SPLIT VIEW) ==================== */}
      {isEditing ? (
        <div className="space-y-4">

          {/* Mobile Switch View Bar */}
          <div className="flex lg:hidden bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setMobileViewMode('editor')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mobileViewMode === 'editor' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>Editar Secciones</span>
            </button>
            <button
              onClick={() => setMobileViewMode('preview')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mobileViewMode === 'preview' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Vista Previa en Vivo</span>
            </button>
          </div>

          {/* SPLIT LAYOUT CONTAINER */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* LEFT COLUMN: VERTICAL SECTION TABS (~260px) */}
            <div className={`lg:col-span-3 space-y-1.5 bg-white border border-slate-200/90 rounded-2xl p-2.5 shadow-2xs ${
              mobileViewMode === 'preview' ? 'hidden lg:block' : 'block'
            }`}>
              {[
                { id: 'general', label: 'General', icon: Info, desc: 'Título, categoría, ícono y descripciones' },
                { id: 'arbol', label: 'Árbol de Decisión', icon: Layers, desc: 'Flujo guiado interactivo (Preguntas y respuestas)' },
                { id: 'bloques', label: 'Constructor de Página', icon: LayoutGrid, desc: 'Bloques de texto, alertas, FAQs y multimedia' },
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = editorTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setEditorTab(tab.id as any);
                      setMobileViewMode('editor');
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center gap-2.5 cursor-pointer ${
                      isActive 
                        ? 'bg-blue-600 text-white font-bold shadow-xs' 
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs leading-none">{tab.label}</p>
                      <p className={`text-[10px] mt-0.5 truncate ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                        {tab.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* MIDDLE COLUMN: ACTIVE EDITOR FORM */}
            <div className={`lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4 ${
              mobileViewMode === 'preview' ? 'hidden lg:block' : 'block'
            }`}>

              {/* TAB 1: GENERAL */}
              {editorTab === 'general' && (
                <div className="space-y-3.5">
                  <div className="border-b border-slate-100 pb-2">
                    <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-blue-600" />
                      Información general
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Categoría</label>
                      <select
                        value={draft.category}
                        onChange={(e) => setDraft({ ...draft, category: e.target.value as any })}
                        className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                      >
                        {availableCategories.filter(c => c.id !== 'all').map((cat) => (
                          <option key={cat.id} value={cat.label}>
                            {cat.label}
                          </option>
                        ))}
                        {/* Fallback if current category is custom and not among available */}
                        {draft.category && !availableCategories.some(c => c.label === draft.category || c.id === draft.category) && (
                          <option value={draft.category}>{draft.category}</option>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Ícono de tarjeta</label>
                      <select
                        value={draft.iconName || draft.icon || 'FileText'}
                        onChange={(e) => setDraft({ ...draft, iconName: e.target.value, icon: e.target.value })}
                        className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                      >
                        <option value="Banknote">💵 Billete / Pagos (Banknote)</option>
                        <option value="ReceiptText">🧾 Recibo de Nómina (ReceiptText)</option>
                        <option value="HelpCircle">❓ Dudas / Aclaración (HelpCircle)</option>
                        <option value="CreditCard">💳 Tarjeta / Vales (CreditCard)</option>
                        <option value="PiggyBank">🐷 Ahorro / Préstamos (PiggyBank)</option>
                        <option value="Home">🏠 Vivienda / Infonavit (Home)</option>
                        <option value="Palmtree">🌴 Vacaciones (Palmtree)</option>
                        <option value="Stethoscope">🩺 Incapacidad IMSS (Stethoscope)</option>
                        <option value="Fingerprint">👆 Checador / Huella (Fingerprint)</option>
                        <option value="FileText">📄 Documento (FileText)</option>
                        <option value="FileCheck">✅ Trámite Verificado (FileCheck)</option>
                        <option value="Clock">⏰ Reloj (Clock)</option>
                        <option value="Shield">🛡️ Seguridad (Shield)</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <MediaUploadField
                      type="image"
                      label="Foto de la Tarjeta / Portada (Opcional)"
                      value={draft.cardImage || ''}
                      onChange={(val) => setDraft(prev => ({ ...prev, cardImage: val }))}
                      placeholderUrl="https://ejemplo.com/foto_tarjeta.jpg o .png"
                      helperText="Si cargas una foto o logo aquí, reemplazará al ícono vectorial genérico en la tarjeta del catálogo."
                      idPrefix="service-detail-card-image"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Título del trámite</label>
                    <input
                      type="text"
                      value={draft.title}
                      onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                      placeholder="Título oficial del trámite..."
                      className="w-full text-sm font-bold text-slate-900 border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 font-display"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Descripción corta</label>
                    <input
                      type="text"
                      value={draft.shortDesc}
                      onChange={(e) => setDraft({ ...draft, shortDesc: e.target.value })}
                      placeholder="Resumen para la tarjeta..."
                      className="w-full text-xs font-medium text-slate-800 border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Descripción completa</label>
                    <textarea
                      rows={4}
                      value={draft.fullDescription || ''}
                      onChange={(e) => setDraft({ ...draft, fullDescription: e.target.value })}
                      placeholder="Explicación detallada del trámite..."
                      className="w-full text-xs font-medium text-slate-800 border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>
                </div>
              )}

              {/* TAB: ÁRBOL DE DECISIÓN DINÁMICO */}
              {editorTab === 'arbol' && (
                <div className="space-y-5">
                  <div className="bg-gradient-to-r from-blue-50 via-indigo-50/40 to-slate-50 border border-blue-200/80 rounded-2xl p-6 shadow-xs">
                    <div className="space-y-1.5">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-100/70 text-blue-700 text-[11px] font-bold uppercase tracking-wider">
                        <Layers className="w-3.5 h-3.5" />
                        <span>Editor Visual Bidimensional</span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900">
                        Editor de Diagrama de Flujo (Flowchart Canvas)
                      </h4>
                      <p className="text-xs text-gray-600 max-w-xl leading-relaxed">
                        Edita el árbol de decisiones en un lienzo infinito interactivo con zoom, paneo libre y panel de propiedades lateral.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsFlowEditorOpen(true)}
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
                    >
                      <Layers className="w-4 h-4" />
                      <span>Abrir Editor en Pantalla Completa</span>
                    </button>

                    <div className="mt-4 pt-3 border-t border-blue-100 flex items-center justify-between text-xs text-blue-900/80 font-medium">
                      <span>Estado actual: {draft.decisionTree?.length || 0} ramas de nivel raíz</span>
                      <span className="text-[11px] text-blue-600 font-semibold">React Flow 2D Canvas</span>
                    </div>
                  </div>

                  {/* Live Interactive Preview */}
                  {draft.decisionTree && draft.decisionTree.length > 0 ? (
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
                          tree={draft.decisionTree}
                          serviceTitle={draft.title}
                          onOpenLightbox={(url, title) => setLightboxImage({ url, title })}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 px-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                        <Layers className="w-6 h-6" />
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

              {/* TAB 3: CONSTRUCTOR DE PÁGINA (BLOQUES DINÁMICOS) */}
              {editorTab === 'bloques' && (
                <div className="space-y-5 animate-fadeIn">
                  {/* Banner de acceso al Editor de Página en Pantalla Completa */}
                  <div className="bg-gradient-to-r from-blue-50 via-indigo-50/40 to-slate-50 border border-blue-200/80 rounded-2xl p-6 shadow-xs">
                    <div className="space-y-1.5">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-100/70 text-blue-700 text-[11px] font-bold uppercase tracking-wider">
                        <LayoutGrid className="w-3.5 h-3.5 text-blue-600" />
                        <span>Constructor de Bloques Modulares</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Editor de Página Completa (Block Builder)
                      </h4>
                      <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                        Diseña y organiza bloques de texto explicativo con formato, avisos de alerta, preguntas frecuentes y material multimedia interactivo en un espacio amplio y sin distracciones.
                      </p>
                    </div>

                    <button
                      id="btn-open-page-builder-fullscreen-detail"
                      type="button"
                      onClick={() => setIsPageBuilderOpen(true)}
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95 text-xs sm:text-sm"
                    >
                      <Maximize2 className="w-4 h-4" />
                      <span>Abrir Editor de Página (Pantalla Completa)</span>
                    </button>

                    <div className="mt-4 pt-3 border-t border-blue-100 flex items-center justify-between text-xs text-blue-900/80 font-medium">
                      <span className="font-bold">
                        Estado actual: {draft.layoutBlocks?.length || 0}{' '}
                        {(draft.layoutBlocks?.length || 0) === 1
                          ? 'bloque configurado'
                          : 'bloques configurados'}
                      </span>
                      <span className="text-[11px] text-blue-600 font-semibold">
                        Layout Blocks v2
                      </span>
                    </div>
                  </div>

                  {/* Resumen de Bloques Configurados */}
                  {draft.layoutBlocks && draft.layoutBlocks.length > 0 ? (
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-blue-600" />
                          Resumen de Bloques Configurados
                        </span>
                        <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/70">
                          {draft.layoutBlocks.length}{' '}
                          {draft.layoutBlocks.length === 1 ? 'bloque configurado' : 'bloques configurados'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex flex-col items-center justify-center text-center">
                          <Type className="w-4 h-4 text-blue-600 mb-1" />
                          <span className="text-[11px] font-bold text-slate-700">
                            {draft.layoutBlocks.filter(b => b.type === 'text').length}
                          </span>
                          <span className="text-[10px] text-slate-400">Texto</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex flex-col items-center justify-center text-center">
                          <AlertTriangle className="w-4 h-4 text-amber-500 mb-1" />
                          <span className="text-[11px] font-bold text-slate-700">
                            {draft.layoutBlocks.filter(b => b.type === 'alert').length}
                          </span>
                          <span className="text-[10px] text-slate-400">Avisos</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex flex-col items-center justify-center text-center">
                          <HelpCircle className="w-4 h-4 text-purple-600 mb-1" />
                          <span className="text-[11px] font-bold text-slate-700">
                            {draft.layoutBlocks.filter(b => b.type === 'faq').length}
                          </span>
                          <span className="text-[10px] text-slate-400">FAQs</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex flex-col items-center justify-center text-center">
                          <ImageIcon className="w-4 h-4 text-emerald-600 mb-1" />
                          <span className="text-[11px] font-bold text-slate-700">
                            {draft.layoutBlocks.filter(b => b.type === 'media').length}
                          </span>
                          <span className="text-[10px] text-slate-400">Media</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 text-center pt-1">
                        Para editar, reordenar o añadir nuevos bloques, haz clic en el botón superior de Pantalla Completa.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-8 px-4 bg-white border border-dashed border-slate-200 rounded-2xl space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
                        <LayoutGrid className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-xs font-bold text-slate-800">
                          0 bloques configurados actualmente
                        </h5>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                          Este trámite aún no tiene bloques modulares. Abre el editor en pantalla completa para comenzar a agregar textos, avisos, preguntas frecuentes y multimedia.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsPageBuilderOpen(true)}
                        className="px-4 py-2 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Crear Primeros Bloques</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* RIGHT COLUMN: LIVE PREVIEW PANEL */}
            <div className={`lg:col-span-4 sticky top-4 ${
              mobileViewMode === 'editor' ? 'hidden lg:block' : 'block'
            }`}>
              <LivePreviewPanel 
                draft={draft} 
                onSelectTab={(t) => { setEditorTab(t); setMobileViewMode('editor'); }} 
                onOpenLightbox={(url, title) => setLightboxImage({ url, title })}
              />
            </div>

          </div>

          {/* FIXED BOTTOM ACTION BAR */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-3 sm:px-6 text-white shadow-2xl animate-slideUp">
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isModified ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></span>
                <span className="text-xs font-bold text-slate-200 hidden sm:inline">
                  {isModified ? '● Cambios sin guardar' : '✓ Sin cambios pendientes'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all border border-slate-700 cursor-pointer active:scale-95"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* ==================== NORMAL PUBLIC VIEW MODE (DYNAMIC LAYOUT BLOCKS) ==================== */
        <div className="space-y-4">
          
          {/* Header Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-2">
            <div className="flex items-center justify-between gap-2">
              <button 
                onClick={onBack}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center gap-1.5 active:scale-95 transition-all shrink-0 border border-slate-300 shadow-2xs cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-slate-700" />
                <span>Volver</span>
              </button>
              <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider border border-blue-200/60">
                {draft.category}
              </span>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              {draft.cardImage && draft.cardImage.trim().length > 0 ? (
                <img 
                  src={draft.cardImage} 
                  alt={draft.title || 'Foto'} 
                  className="w-10 h-10 rounded-xl object-cover shadow-2xs border border-slate-200 shrink-0" 
                />
              ) : (
                React.createElement(SERVICE_ICON_MAP[draft.iconName || draft.icon || 'FileText'] || FileText, {
                  className: "w-6 h-6 text-blue-600 shrink-0"
                })
              )}
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 font-display">{draft.title}</h1>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed pt-1">
              {draft.fullDescription || draft.shortDesc}
            </p>
          </div>

          {/* Árbol de Decisión Independiente */}
          {draft.decisionTree && draft.decisionTree.length > 0 && (
            <div className="space-y-3">
              <DecisionTreeNavigator
                tree={draft.decisionTree}
                onOpenLightbox={(url, title) => setLightboxImage({ url, title })}
                serviceTitle={draft.title}
              />
            </div>
          )}

          {/* Dynamic Layout Blocks */}
          <LayoutBlocksRenderer
            blocks={draft.layoutBlocks || []}
            onOpenLightbox={(url, title) => setLightboxImage({ url, title })}
          />

          {(!draft.decisionTree || draft.decisionTree.length === 0) && (!draft.layoutBlocks || draft.layoutBlocks.length === 0) && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 text-center shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Info className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-slate-800">Contenido en preparación</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                La información detallada, pasos y formatos para este trámite se están actualizando desde el Panel de Talento y Cultura.
              </p>
            </div>
          )}

        </div>
      )}

      {/* LIGHTBOX MODAL FOR HIGH RESOLUTION INFOGRAPHICS & IMAGES */}
      <ImageLightboxModal
        isOpen={Boolean(lightboxImage && lightboxImage.url)}
        imageUrl={lightboxImage?.url || null}
        title={lightboxImage?.title || draft.title}
        onClose={() => setLightboxImage(null)}
      />

      {/* Fullscreen Flowchart Canvas Editor */}
      {isFlowEditorOpen && (
        <DecisionTreeCanvasEditor
          tree={draft.decisionTree || []}
          serviceTitle={draft.title}
          onSave={(newTree) => {
            setDraft(prev => ({ ...prev, decisionTree: newTree }));
            setIsFlowEditorOpen(false);
            showToast('Árbol de decisiones actualizado en el borrador');
          }}
          onClose={() => setIsFlowEditorOpen(false)}
        />
      )}

      {/* Fullscreen Page Builder Editor */}
      {isPageBuilderOpen && (
        <PageBuilderFullScreenEditor
          blocks={draft.layoutBlocks || []}
          onChange={(newBlocks) => {
            setDraft(prev => ({ ...prev, layoutBlocks: newBlocks }));
          }}
          onClose={() => {
            setIsPageBuilderOpen(false);
            showToast('Bloques de contenido actualizados en el borrador');
          }}
          serviceTitle={draft.title}
        />
      )}

    </div>
  );
}