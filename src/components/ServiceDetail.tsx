import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, FileText, CheckCircle2, Clock, MapPin, Phone, 
  HelpCircle, Edit3, Save, Plus, Trash2, X, AlertCircle, Check,
  Image as ImageIcon, Video, FileDown, Eye, EyeOff, AlertTriangle,
  ExternalLink, Download, Layers, Sparkles, GripVertical, ChevronUp, ChevronDown, Sliders, Info, ListOrdered
} from 'lucide-react';
import { Service, UserProfile, FAQ, StepItem, ServiceFAQ, ServiceAttachment } from '../types';
import { getDefaultServiceDetails } from '../data';
import { SERVICE_ICON_MAP } from './ServiceCard';

// Helper to resolve video URLs (YouTube, Vimeo, direct MP4)
function getEmbedVideoInfo(url?: string): { type: 'youtube' | 'vimeo' | 'direct' | 'iframe'; embedUrl: string } | null {
  if (!url || !url.trim()) return null;
  const cleanUrl = url.trim();

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

  // Direct MP4 / WebM
  if (cleanUrl.match(/\.(mp4|webm|ogg)$/i)) {
    return { type: 'direct', embedUrl: cleanUrl };
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
  onSelectTab 
}: { 
  draft: Service & { hidden?: boolean };
  onSelectTab: (tab: 'general' | 'contenido' | 'faqs' | 'multimedia' | 'visibilidad') => void;
}) {
  const videoInfo = getEmbedVideoInfo(draft.videoUrl);

  return (
    <div className="bg-slate-900 rounded-2xl p-3.5 sm:p-4 text-white space-y-3.5 shadow-xl border border-slate-800">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold text-slate-200">
            Vista previa
          </span>
        </div>
      </div>

      {/* Preview Card Mockup */}
      <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-3 text-slate-100 max-h-[600px] overflow-y-auto custom-scrollbar">
        
        {/* Banner Alert Notice */}
        {draft.showAlertNotice && draft.alertNotice && (
          <div 
            onClick={() => onSelectTab('visibilidad')}
            className="bg-amber-500 text-slate-950 p-2.5 rounded-lg text-xs font-bold flex items-start gap-2 cursor-pointer hover:opacity-90 transition-opacity"
            title="Haz clic para editar el aviso"
          >
            <AlertTriangle className="w-4 h-4 shrink-0 text-slate-950 mt-0.5" />
            <div>
              <span className="text-[9px] uppercase font-extrabold block text-slate-900">Aviso destacado</span>
              <p className="text-[11px] font-semibold leading-tight">{draft.alertNotice}</p>
            </div>
          </div>
        )}

        {/* Title & Header */}
        <div 
          onClick={() => onSelectTab('general')}
          className="p-2.5 rounded-lg hover:bg-slate-900/80 cursor-pointer border border-transparent hover:border-blue-500/30 transition-all space-y-1"
          title="Haz clic para editar información general"
        >
          <div className="flex items-center justify-between gap-1.5">
            <span className="text-[9px] font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800/50">
              {draft.category || 'Categoría'}
            </span>
          </div>
          <h3 className="text-sm font-bold text-white font-display mt-1">{draft.title || 'Título sin definir'}</h3>
          <p className="text-[11px] text-slate-400 line-clamp-2">{draft.shortDesc || draft.fullDescription}</p>
        </div>

        {/* Multimedia Preview */}
        {(draft.imageUrl || videoInfo) && (
          <div 
            onClick={() => onSelectTab('multimedia')}
            className="p-1 rounded-lg hover:bg-slate-900 cursor-pointer border border-transparent hover:border-purple-500/30 transition-all"
            title="Haz clic para editar multimedia"
          >
            {draft.imageUrl && (
              <img src={draft.imageUrl} alt="Banner" className="w-full h-24 object-cover rounded-lg" />
            )}
            {videoInfo && !draft.imageUrl && (
              <div className="w-full h-24 bg-slate-900 rounded-lg flex items-center justify-center text-xs text-purple-400 font-bold border border-purple-900/50">
                Video adjunto
              </div>
            )}
          </div>
        )}

        {/* Attachments Preview */}
        {draft.attachments && draft.attachments.length > 0 && (
          <div 
            onClick={() => onSelectTab('multimedia')}
            className="p-2 rounded-lg hover:bg-slate-900 cursor-pointer border border-transparent hover:border-purple-500/30 transition-all space-y-1"
          >
            <div className="flex items-center gap-1.5 text-purple-400">
              <FileDown className="w-3.5 h-3.5" />
              <span className="text-xs font-bold text-purple-400">
                Adjuntos PDF
              </span>
            </div>
            {draft.attachments.map((att, i) => (
              <div key={i} className="text-[11px] font-semibold text-slate-300 truncate bg-slate-900/80 px-2 py-1 rounded border border-slate-800 flex items-center gap-1.5">
                <FileText className="w-3 h-3 text-purple-400 shrink-0" />
                <span className="truncate">{att.name || 'Documento sin título'}</span>
              </div>
            ))}
          </div>
        )}

        {/* Steps Preview */}
        {draft.showSteps !== false && (
          <div 
            onClick={() => onSelectTab('contenido')}
            className="p-2 rounded-lg hover:bg-slate-900 cursor-pointer border border-transparent hover:border-blue-500/30 transition-all space-y-1.5"
            title="Haz clic para editar pasos"
          >
            <div className="flex items-center gap-1.5 text-blue-400">
              <ListOrdered className="w-3.5 h-3.5" />
              <span className="text-xs font-bold text-blue-400">
                Pasos
              </span>
            </div>
            <div className="space-y-1">
              {draft.steps?.slice(0, 3).map((st, i) => (
                <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-extrabold text-[9px] flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="truncate">{st.title || st.desc}</span>
                </div>
              ))}
              {(draft.steps?.length || 0) > 3 && (
                <span className="text-[10px] text-slate-500 block italic">
                  +{(draft.steps?.length || 0) - 3} pasos más...
                </span>
              )}
            </div>
          </div>
        )}

        {/* Requirements Preview */}
        {draft.showRequirements !== false && (
          <div 
            onClick={() => onSelectTab('contenido')}
            className="p-2 rounded-lg hover:bg-slate-900 cursor-pointer border border-transparent hover:border-emerald-500/30 transition-all space-y-1.5"
            title="Haz clic para editar requisitos"
          >
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="text-xs font-bold text-emerald-400">
                Requisitos
              </span>
            </div>
            <div className="space-y-1">
              {draft.requirements?.slice(0, 2).map((req, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                  <span className="truncate">{req}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQs Preview */}
        {draft.showFaqs !== false && (
          <div 
            onClick={() => onSelectTab('faqs')}
            className="p-2 rounded-lg hover:bg-slate-900 cursor-pointer border border-transparent hover:border-amber-500/30 transition-all space-y-1"
            title="Haz clic para editar FAQs"
          >
            <div className="flex items-center gap-1.5 text-amber-400">
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="text-xs font-bold text-amber-400">
                Preguntas frecuentes
              </span>
            </div>
            {draft.faqs?.slice(0, 2).map((faq, i) => (
              <p key={i} className="text-[10px] text-slate-400 truncate italic">
                • {faq.question}
              </p>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

interface ServiceDetailProps {
  service: Service & { hidden?: boolean };
  user?: UserProfile;
  onBack: () => void;
  isAdminLoggedIn?: boolean;
  onUpdateService?: (updatedService: Service & { hidden?: boolean }) => void;
  initialEditMode?: boolean;
}

export default function ServiceDetail({ 
  service, 
  user, 
  onBack, 
  isAdminLoggedIn = false,
  onUpdateService,
  initialEditMode = false
}: ServiceDetailProps) {
  const [isEditing, setIsEditing] = useState<boolean>(initialEditMode);
  const [toastMsg, setToastMsg] = useState<string>('');
  const [editorTab, setEditorTab] = useState<'general' | 'contenido' | 'faqs' | 'multimedia' | 'visibilidad'>('general');
  const [mobileViewMode, setMobileViewMode] = useState<'editor' | 'preview'>('editor');

  // Hydrate draft with current service state or data defaults
  const getPreparedDraft = (s: Service & { hidden?: boolean }) => {
    const computed = getDefaultServiceDetails(s);
    return {
      ...s,
      fullDescription: s.fullDescription || computed.fullDescription,
      steps: s.steps && s.steps.length > 0 ? s.steps : (computed.steps || []),
      requirements: s.requirements && s.requirements.length > 0 ? s.requirements : (computed.requirements || []),
      location: s.location || computed.location,
      schedule: s.schedule || computed.schedule,
      contact: s.contact || computed.contact,
      faqs: s.faqs && s.faqs.length > 0 ? s.faqs : (computed.faqs || []),
      showSteps: s.showSteps ?? computed.showSteps,
      showRequirements: s.showRequirements ?? computed.showRequirements,
      showContact: s.showContact ?? computed.showContact,
      showFaqs: s.showFaqs ?? computed.showFaqs,
      imageUrl: s.imageUrl ?? computed.imageUrl,
      videoUrl: s.videoUrl ?? computed.videoUrl,
      attachments: s.attachments ?? computed.attachments,
      showAlertNotice: s.showAlertNotice ?? computed.showAlertNotice,
      alertNotice: s.alertNotice ?? computed.alertNotice,
    };
  };

  const [draft, setDraft] = useState<(Service & { hidden?: boolean })>(() => getPreparedDraft(service));

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
                { id: 'general', label: 'General', icon: Info, desc: 'Título, categoría e ícono' },
                { id: 'contenido', label: 'Contenido', icon: ListOrdered, desc: 'Pasos, requisitos y contacto' },
                { id: 'faqs', label: 'Preguntas Frecuentes', icon: HelpCircle, desc: 'FAQs reordenables' },
                { id: 'multimedia', label: 'Multimedia', icon: ImageIcon, desc: 'Imágenes, video y PDFs' },
                { id: 'visibilidad', label: 'Visibilidad', icon: Eye, desc: 'Toggles y aviso importante' },
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
                        <option value="Nómina y Pagos">Nómina y Pagos</option>
                        <option value="Tarjetas y Créditos">Tarjetas y Créditos</option>
                        <option value="Control y Asistencia">Control y Asistencia</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Ícono de tarjeta</label>
                      <select
                        value={draft.iconName || draft.icon || 'FileText'}
                        onChange={(e) => setDraft({ ...draft, iconName: e.target.value, icon: e.target.value })}
                        className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                      >
                        <option value="Banknote">💵 Billete</option>
                        <option value="FileText">📄 Documento</option>
                        <option value="FileCheck">✅ Documento Verificado</option>
                        <option value="HelpCircle">❓ Duda / Ayuda</option>
                        <option value="CreditCard">💳 Tarjeta</option>
                        <option value="PiggyBank">🐷 Ahorro</option>
                        <option value="Home">🏠 Casa</option>
                        <option value="Calendar">📅 Calendario</option>
                        <option value="Shield">🛡️ Seguridad</option>
                        <option value="Clock">⏰ Reloj</option>
                      </select>
                    </div>
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

              {/* TAB 2: CONTENIDO (PASOS, REQUISITOS, CONTACTO) */}
              {editorTab === 'contenido' && (
                <div className="space-y-5">
                  
                  {/* Pasos Reordenables */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        <ListOrdered className="w-4 h-4 text-blue-600" />
                        Pasos del Procedimiento ({draft.steps?.length || 0})
                      </h3>
                      <button
                        type="button"
                        onClick={handleAddStep}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border border-blue-200 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Paso</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {draft.steps && draft.steps.length > 0 ? (
                        draft.steps.map((st, idx) => (
                          <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5">
                                <GripVertical className="w-4 h-4 text-slate-400 cursor-grab" />
                                <span className="w-5 h-5 rounded-md bg-blue-600 text-white font-extrabold text-[10px] flex items-center justify-center">
                                  #{idx + 1}
                                </span>
                                <span className="text-xs font-bold text-slate-700">Paso {idx + 1}</span>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleMoveStep(idx, 'up')}
                                  disabled={idx === 0}
                                  className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 rounded hover:bg-slate-200 cursor-pointer"
                                  title="Mover arriba"
                                >
                                  <ChevronUp className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveStep(idx, 'down')}
                                  disabled={idx === (draft.steps?.length || 0) - 1}
                                  className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 rounded hover:bg-slate-200 cursor-pointer"
                                  title="Mover abajo"
                                >
                                  <ChevronDown className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveStep(idx)}
                                  className="p-1 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50 cursor-pointer ml-1"
                                  title="Eliminar paso"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <input
                              type="text"
                              value={st.title}
                              onChange={(e) => handleUpdateStep(idx, 'title', e.target.value)}
                              placeholder="Título del paso (ej. Llenar solicitud)"
                              className="w-full text-xs font-bold text-slate-900 border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                            />
                            <textarea
                              rows={2}
                              value={st.desc}
                              onChange={(e) => handleUpdateStep(idx, 'desc', e.target.value)}
                              placeholder="Instrucciones detalladas del paso..."
                              className="w-full text-xs font-medium text-slate-800 border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                            />
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic py-1">No hay pasos registrados.</p>
                      )}
                    </div>
                  </div>

                  {/* Requisitos Reordenables */}
                  <div className="space-y-2.5 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Requisitos ({draft.requirements?.length || 0})
                      </h3>
                      <button
                        type="button"
                        onClick={handleAddRequirement}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border border-emerald-200 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Requisito</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {draft.requirements && draft.requirements.length > 0 ? (
                        draft.requirements.map((req, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                            <GripVertical className="w-4 h-4 text-slate-400 cursor-grab shrink-0" />
                            <input
                              type="text"
                              value={req}
                              onChange={(e) => handleUpdateRequirement(idx, e.target.value)}
                              placeholder="Ej. Gafete oficial activo o Identificación INE"
                              className="flex-1 px-2.5 py-1 text-xs font-medium border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            />
                            <button
                              type="button"
                              onClick={() => handleMoveRequirement(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveRequirement(idx, 'down')}
                              disabled={idx === (draft.requirements?.length || 0) - 1}
                              className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveRequirement(idx)}
                              className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic py-1">No hay requisitos registrados.</p>
                      )}
                    </div>
                  </div>

                  {/* Contacto & Ubicación */}
                  <div className="space-y-2.5 pt-3 border-t border-slate-100">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-blue-600" />
                      Ubicación, Horarios y Teléfono
                    </h3>
                    <div className="space-y-2 text-xs">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Ubicación</label>
                        <input
                          type="text"
                          value={draft.location || ''}
                          onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                          placeholder="Ej. Edificio A - Oficina RH"
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Horario</label>
                        <input
                          type="text"
                          value={draft.schedule || ''}
                          onChange={(e) => setDraft({ ...draft, schedule: e.target.value })}
                          placeholder="Ej. Lunes a Viernes de 8:00 AM a 5:00 PM"
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Contacto / Extensión</label>
                        <input
                          type="text"
                          value={draft.contact || ''}
                          onChange={(e) => setDraft({ ...draft, contact: e.target.value })}
                          placeholder="Ej. Ext. 200 - RH"
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: PREGUNTAS FRECUENTES (FAQS REORDENABLES) */}
              {editorTab === 'faqs' && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-blue-600" />
                      Preguntas Frecuentes ({draft.faqs?.length || 0})
                    </h3>
                    <button
                      type="button"
                      onClick={handleAddFAQ}
                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border border-blue-200 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>FAQ</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {draft.faqs && draft.faqs.length > 0 ? (
                      draft.faqs.map((faq, idx) => (
                        <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-1.5">
                            <div className="flex items-center gap-1.5">
                              <GripVertical className="w-4 h-4 text-slate-400 cursor-grab" />
                              <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                                FAQ #{idx + 1}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleMoveFAQ(idx, 'up')}
                                disabled={idx === 0}
                                className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 rounded hover:bg-slate-200 cursor-pointer"
                              >
                                <ChevronUp className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveFAQ(idx, 'down')}
                                disabled={idx === (draft.faqs?.length || 0) - 1}
                                className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 rounded hover:bg-slate-200 cursor-pointer"
                              >
                                <ChevronDown className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveFAQ(idx)}
                                className="p-1 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50 cursor-pointer ml-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Pregunta</label>
                            <input
                              type="text"
                              value={faq.question}
                              onChange={(e) => handleUpdateFAQ(idx, 'question', e.target.value)}
                              placeholder="Ej. ¿Puedo solicitar el trámite si soy de nuevo ingreso?"
                              className="w-full text-xs font-bold text-slate-900 border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Respuesta</label>
                            <textarea
                              rows={2}
                              value={faq.answer}
                              onChange={(e) => handleUpdateFAQ(idx, 'answer', e.target.value)}
                              placeholder="Respuesta explicativa..."
                              className="w-full text-xs font-medium text-slate-800 border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic py-1">No hay preguntas frecuentes registradas.</p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: MULTIMEDIA */}
              {editorTab === 'multimedia' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-2">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-purple-600" />
                      Multimedia y Adjuntos
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">URL de imagen banner</label>
                    <input
                      type="url"
                      value={draft.imageUrl || ''}
                      onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })}
                      placeholder="Ej. https://images.unsplash.com/photo-..."
                      className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white text-slate-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">URL de video (YouTube / Vimeo / MP4)</label>
                    <input
                      type="url"
                      value={draft.videoUrl || ''}
                      onChange={(e) => setDraft({ ...draft, videoUrl: e.target.value })}
                      placeholder="Ej. https://www.youtube.com/watch?v=..."
                      className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white text-slate-900"
                    />
                  </div>

                  <div className="pt-2 space-y-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700">Documentos descargables (PDF)</label>
                      <button
                        type="button"
                        onClick={handleAddAttachment}
                        className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-lg text-[11px] font-bold border border-purple-200 cursor-pointer"
                      >
                        + Agregar PDF
                      </button>
                    </div>

                    {draft.attachments && draft.attachments.length > 0 ? (
                      draft.attachments.map((att, idx) => (
                        <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">PDF #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveAttachment(idx)}
                              className="text-rose-500 hover:text-rose-700 cursor-pointer text-xs"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={att.name}
                            onChange={(e) => handleUpdateAttachment(idx, 'name', e.target.value)}
                            placeholder="Nombre del documento"
                            className="w-full text-xs font-bold border border-slate-300 rounded-lg px-2 py-1 bg-white"
                          />
                          <input
                            type="url"
                            value={att.url}
                            onChange={(e) => handleUpdateAttachment(idx, 'url', e.target.value)}
                            placeholder="Link de descarga PDF"
                            className="w-full text-xs border border-slate-300 rounded-lg px-2 py-1 bg-white"
                          />
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No hay adjuntos agregados.</p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: VISIBILIDAD & AVISO DESTACADO (CONDITIONAL RENDER FOR ALERT NOTICE!) */}
              {editorTab === 'visibilidad' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-2">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-blue-600" />
                      Visibilidad de Secciones
                    </h3>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { key: 'showSteps', label: 'Mostrar Pasos del Procedimiento' },
                      { key: 'showRequirements', label: 'Mostrar Requisitos Necesarios' },
                      { key: 'showContact', label: 'Mostrar Datos de Ubicación y Contacto' },
                      { key: 'showFaqs', label: 'Mostrar Preguntas Frecuentes (FAQs)' },
                      { key: 'showAlertNotice', label: 'Mostrar Aviso Importante Destacado (Banner Alerta)' },
                    ].map((item) => {
                      const isChecked = Boolean((draft as any)[item.key] !== false);
                      return (
                        <label key={item.key} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                          <span className="text-xs font-bold text-slate-800">{item.label}</span>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => setDraft({ ...draft, [item.key]: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                          />
                        </label>
                      );
                    })}
                  </div>

                  {/* CONDITIONAL TEXTAREA FOR ALERT NOTICE - ONLY RENDERED IF showAlertNotice IS TRUE */}
                  {draft.showAlertNotice ? (
                    <div className="pt-3 border-t border-amber-200/80 bg-amber-50 p-3.5 rounded-2xl border space-y-2 animate-fadeIn">
                      <div className="flex items-center gap-1.5 text-amber-900">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <label className="text-xs font-bold text-slate-900">Mensaje del aviso importante</label>
                      </div>
                      <textarea
                        rows={3}
                        value={draft.alertNotice || ''}
                        onChange={(e) => setDraft({ ...draft, alertNotice: e.target.value })}
                        placeholder="Ej. Atención: Fecha límite de entrega es el día 15 de cada mes. No habrá prórroga."
                        className="w-full text-xs font-semibold text-slate-900 border border-amber-300 rounded-xl p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                      />
                      <p className="text-[10px] text-amber-800 font-medium">
                        Este aviso se resaltará en un recuadro de color ambar en la parte superior del trámite.
                      </p>
                    </div>
                  ) : null}
                </div>
              )}

            </div>

            {/* RIGHT COLUMN: LIVE PREVIEW PANEL */}
            <div className={`lg:col-span-4 sticky top-4 ${
              mobileViewMode === 'editor' ? 'hidden lg:block' : 'block'
            }`}>
              <LivePreviewPanel draft={draft} onSelectTab={(t) => { setEditorTab(t); setMobileViewMode('editor'); }} />
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
        /* ==================== NORMAL PUBLIC VIEW MODE ==================== */
        <div className="space-y-3">
          
          {/* Aviso Importante Notice Box */}
          {draft.showAlertNotice && draft.alertNotice && (
            <div className="bg-amber-500 text-white rounded-2xl p-4 shadow-md flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-100 mt-0.5" />
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-100 mb-0.5">Aviso Importante</h4>
                <p className="text-xs font-medium leading-relaxed">{draft.alertNotice}</p>
              </div>
            </div>
          )}

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
              {React.createElement(SERVICE_ICON_MAP[draft.iconName || draft.icon || 'FileText'] || FileText, {
                className: "w-6 h-6 text-blue-600 shrink-0"
              })}
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 font-display">{draft.title}</h1>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed pt-1">
              {draft.fullDescription || draft.shortDesc}
            </p>
          </div>

          {/* Multimedia: Banner and/or Video */}
          {(draft.imageUrl || videoInfo) && (
            <div className={`grid grid-cols-1 ${draft.imageUrl && videoInfo ? 'md:grid-cols-2' : ''} gap-3`}>
              {draft.imageUrl && (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                  <img src={draft.imageUrl} alt={draft.title} className="w-full h-48 object-cover" />
                </div>
              )}
              {videoInfo && (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs p-2">
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
                    {videoInfo.type === 'direct' ? (
                      <video src={videoInfo.embedUrl} controls className="w-full h-full" />
                    ) : (
                      <iframe 
                        src={videoInfo.embedUrl} 
                        title="Video explicativo" 
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Downloadable PDF Formats */}
          {draft.attachments && draft.attachments.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2.5">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <FileDown className="w-4 h-4 text-emerald-600" />
                Formatos y Documentos Descargables
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {draft.attachments.map((att, idx) => (
                  <a
                    key={idx}
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 bg-slate-50 hover:bg-emerald-50/50 transition-all flex items-center justify-between gap-2 group"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-800 truncate">{att.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase">Documento Oficial PDF</p>
                    </div>
                    <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Procedure Steps */}
          {draft.showSteps !== false && draft.steps && draft.steps.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <ListOrdered className="w-4 h-4 text-blue-600" />
                Paso a Paso del Trámite
              </h3>
              <div className="space-y-2.5">
                {draft.steps.map((st, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                      {st.num || idx + 1}
                    </span>
                    <div>
                      {st.title && <h4 className="text-xs font-bold text-slate-900">{st.title}</h4>}
                      <p className="text-xs text-slate-600 font-medium leading-relaxed mt-0.5">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Requirements & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {draft.showRequirements !== false && draft.requirements && draft.requirements.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2.5">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Requisitos Necesarios
                </h3>
                <ul className="space-y-2">
                  {draft.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {draft.showContact !== false && (draft.location || draft.schedule || draft.contact) && (
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2.5">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Atención y Ubicación
                </h3>
                <div className="space-y-2 text-xs text-slate-700">
                  {draft.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{draft.location}</span>
                    </div>
                  )}
                  {draft.schedule && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{draft.schedule}</span>
                    </div>
                  )}
                  {draft.contact && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-semibold text-blue-700">{draft.contact}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* FAQs Accordion */}
          {draft.showFaqs !== false && draft.faqs && draft.faqs.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                Preguntas Frecuentes
              </h3>
              <FAQAccordion items={draft.faqs} />
            </div>
          )}

        </div>
      )}

    </div>
  );
}