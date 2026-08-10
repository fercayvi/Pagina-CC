import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, FileText, CheckCircle2, Clock, MapPin, Phone, 
  HelpCircle, Edit3, Save, Plus, Trash2, X, AlertCircle, Check,
  Image as ImageIcon, Video, FileDown, Eye, EyeOff, AlertTriangle,
  ExternalLink, Download, Layers, Sparkles
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

  // Toast feedback helper
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
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
    <div id={`service-detail-${service.id}`} className={`space-y-3 animate-fadeIn ${isEditing ? 'pb-28' : 'pb-16'}`}>
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-2.5 animate-slideDown">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* ADMIN EDIT MODE INDICATOR BANNER & TOGGLE BUTTON */}
      {isAdminLoggedIn && (
        <div className={`rounded-2xl p-3.5 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isEditing 
            ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-2xs' 
            : 'bg-slate-900 text-white border-slate-800 shadow-2xs'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isEditing ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white'
            }`}>
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  isEditing ? 'bg-amber-200/80 text-amber-900' : 'bg-blue-950 text-blue-300 border border-blue-800/60'
                }`}>
                  Modo Administrador
                </span>
                {isEditing && (
                  <span className="text-[10px] font-bold text-amber-700 animate-pulse">
                    ● Editando en vivo
                  </span>
                )}
              </div>
              <p className="text-xs font-bold mt-0.5">
                {isEditing 
                  ? 'Modo Edición Directa Activo. Modifica elementos, activa/oculta secciones y agrega multimedia.'
                  : 'Puedes editar el contenido directamente en esta vista visual de detalle.'}
              </p>
            </div>
          </div>

          <button
            id="btn-toggle-inline-edit"
            onClick={() => {
              if (isEditing) {
                handleCancelEdit();
              } else {
                setIsEditing(true);
              }
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 active:scale-95 shadow-2xs cursor-pointer ${
              isEditing
                ? 'bg-slate-800 text-slate-100 hover:bg-slate-900'
                : 'bg-amber-500 hover:bg-amber-600 text-white'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>{isEditing ? 'Salir sin Guardar' : 'Activar Modo Edición'}</span>
          </button>
        </div>
      )}

      {/* DYNAMIC SECTIONS CONTROL STRIP (EDIT MODE ONLY) */}
      {isEditing && (
        <div className="bg-blue-50/90 border border-blue-200 rounded-2xl p-4 space-y-3 shadow-2xs animate-fadeIn">
          <div className="flex items-center gap-2 border-b border-blue-200/80 pb-2">
            <Layers className="w-4 h-4 text-blue-700" />
            <h3 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
              Control de Secciones Visibles en el Trámite
            </h3>
          </div>
          <p className="text-[11px] text-blue-800 leading-normal">
            Activa o deshabilita bloques según lo requiera este trámite. Las secciones desactivadas no se mostrarán en la vista del usuario.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
            {/* Toggle Paso a Paso */}
            <button
              type="button"
              onClick={() => setDraft({ ...draft, showSteps: !draft.showSteps })}
              className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                draft.showSteps !== false 
                  ? 'bg-white border-blue-400 text-blue-950 shadow-2xs font-bold' 
                  : 'bg-slate-100/80 border-slate-200 text-slate-400 line-through'
              }`}
            >
              {draft.showSteps !== false ? <Eye className="w-4 h-4 text-emerald-600 shrink-0" /> : <EyeOff className="w-4 h-4 text-slate-400 shrink-0" />}
              <span className="text-[11px] truncate">Paso a Paso</span>
            </button>

            {/* Toggle Requisitos */}
            <button
              type="button"
              onClick={() => setDraft({ ...draft, showRequirements: !draft.showRequirements })}
              className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                draft.showRequirements !== false 
                  ? 'bg-white border-blue-400 text-blue-950 shadow-2xs font-bold' 
                  : 'bg-slate-100/80 border-slate-200 text-slate-400 line-through'
              }`}
            >
              {draft.showRequirements !== false ? <Eye className="w-4 h-4 text-emerald-600 shrink-0" /> : <EyeOff className="w-4 h-4 text-slate-400 shrink-0" />}
              <span className="text-[11px] truncate">Requisitos</span>
            </button>

            {/* Toggle Atención / Ubicación */}
            <button
              type="button"
              onClick={() => setDraft({ ...draft, showContact: !draft.showContact })}
              className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                draft.showContact !== false 
                  ? 'bg-white border-blue-400 text-blue-950 shadow-2xs font-bold' 
                  : 'bg-slate-100/80 border-slate-200 text-slate-400 line-through'
              }`}
            >
              {draft.showContact !== false ? <Eye className="w-4 h-4 text-emerald-600 shrink-0" /> : <EyeOff className="w-4 h-4 text-slate-400 shrink-0" />}
              <span className="text-[11px] truncate">Ubicación/Contacto</span>
            </button>

            {/* Toggle FAQs */}
            <button
              type="button"
              onClick={() => setDraft({ ...draft, showFaqs: !draft.showFaqs })}
              className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                draft.showFaqs !== false 
                  ? 'bg-white border-blue-400 text-blue-950 shadow-2xs font-bold' 
                  : 'bg-slate-100/80 border-slate-200 text-slate-400 line-through'
              }`}
            >
              {draft.showFaqs !== false ? <Eye className="w-4 h-4 text-emerald-600 shrink-0" /> : <EyeOff className="w-4 h-4 text-slate-400 shrink-0" />}
              <span className="text-[11px] truncate">Preguntas FAQs</span>
            </button>

            {/* Toggle Aviso Destacado */}
            <button
              type="button"
              onClick={() => setDraft({ ...draft, showAlertNotice: !draft.showAlertNotice })}
              className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                draft.showAlertNotice 
                  ? 'bg-amber-100 border-amber-400 text-amber-950 shadow-2xs font-bold' 
                  : 'bg-slate-100/80 border-slate-200 text-slate-400 line-through'
              }`}
            >
              {draft.showAlertNotice ? <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" /> : <EyeOff className="w-4 h-4 text-slate-400 shrink-0" />}
              <span className="text-[11px] truncate">Aviso Importante</span>
            </button>
          </div>
        </div>
      )}

      {/* AVISO IMPORTANTE / NOTA RELEVANTE BLOCK */}
      {(isEditing || (draft.showAlertNotice && draft.alertNotice?.trim())) && (
        <div className={`rounded-2xl p-4 border shadow-2xs transition-all ${
          isEditing 
            ? 'bg-amber-50/90 border-amber-300 ring-2 ring-amber-500/10 space-y-2' 
            : 'bg-amber-500 text-white border-amber-600 shadow-md'
        }`}>
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-5 h-5 shrink-0 ${isEditing ? 'text-amber-600' : 'text-amber-100'}`} />
            <h4 className={`text-xs font-bold uppercase tracking-wider ${isEditing ? 'text-amber-900' : 'text-white'}`}>
              Aviso Importante / Nota Relevante
            </h4>
          </div>

          {isEditing ? (
            <div>
              <textarea
                rows={2}
                value={draft.alertNotice || ''}
                onChange={(e) => setDraft({ ...draft, alertNotice: e.target.value })}
                placeholder="Ej. Atención: Fecha límite de entrega es el día 15 de cada mes. No habrá prórroga."
                className="w-full text-xs font-semibold text-slate-800 border border-amber-300 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
              <span className="text-[10px] text-amber-800 font-medium">
                Este mensaje aparecerá en la parte superior del trámite en un recuadro destacado de alerta.
              </span>
            </div>
          ) : (
            <p className="text-xs font-semibold leading-relaxed pl-7 text-amber-50">
              {draft.alertNotice}
            </p>
          )}
        </div>
      )}

      {/* HEADER CARD (Title, Category & Single Return Button) */}
      <div className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-xs transition-all ${
        isEditing ? 'border-blue-400 ring-2 ring-blue-500/10' : 'border-slate-200/90'
      }`}>
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* SINGLE CLEAN BACK BUTTON */}
            <button 
              id="btn-back-to-grid"
              onClick={onBack}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-extrabold text-xs flex items-center gap-1.5 active:scale-95 transition-all shrink-0 border border-slate-300 shadow-2xs cursor-pointer"
              aria-label="Volver al catálogo"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700" strokeWidth={2.5} />
              <span>Volver</span>
            </button>

            <div className="min-w-0 flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wide shrink-0">
                        Categoría:
                      </span>
                      <select
                        value={draft.category}
                        onChange={(e) => setDraft({ ...draft, category: e.target.value as any })}
                        className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                      >
                        <option value="Nómina y Pagos">Nómina y Pagos</option>
                        <option value="Tarjetas y Créditos">Tarjetas y Créditos</option>
                        <option value="Control y Asistencia">Control y Asistencia</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wide shrink-0">
                        Ícono de la Tarjeta:
                      </span>
                      <select
                        value={draft.iconName || draft.icon || 'FileText'}
                        onChange={(e) => setDraft({ ...draft, iconName: e.target.value, icon: e.target.value })}
                        className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
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
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Título del Trámite:</label>
                    <input
                      type="text"
                      value={draft.title}
                      onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                      placeholder="Título del trámite..."
                      className="w-full text-base font-bold text-slate-900 border border-blue-300 rounded-xl px-3 py-1.5 bg-blue-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 font-display"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wide">
                    {draft.category} • Información Oficial
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    {React.createElement(SERVICE_ICON_MAP[draft.iconName || draft.icon || 'FileText'] || FileText, {
                      className: "w-5 h-5 text-blue-600 shrink-0"
                    })}
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display truncate">{draft.title}</h2>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Short & Full Description Edit / Read */}
        {isEditing ? (
          <div className="mt-3 space-y-3 pt-3 border-t border-slate-100">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                Descripción Corta (Para la tarjeta en catálogo):
              </label>
              <input
                type="text"
                value={draft.shortDesc}
                onChange={(e) => setDraft({ ...draft, shortDesc: e.target.value })}
                placeholder="Resumen corto..."
                className="w-full text-xs font-medium text-slate-800 border border-slate-300 rounded-xl px-3 py-1.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                Descripción Completa (Para la vista de detalle):
              </label>
              <textarea
                rows={3}
                value={draft.fullDescription || ''}
                onChange={(e) => setDraft({ ...draft, fullDescription: e.target.value })}
                placeholder="Explicación detallada del trámite..."
                className="w-full text-xs font-medium text-slate-800 border border-slate-300 rounded-xl px-3 py-1.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-600 font-medium mt-2.5 leading-relaxed pl-1">
            {draft.fullDescription}
          </p>
        )}
      </div>

      {/* MULTIMEDIA: BANNER IMAGE & VIDEO EXPLICATIVO */}
      {(isEditing || draft.imageUrl || draft.videoUrl) && (
        <div className={`grid grid-cols-1 ${draft.imageUrl && draft.videoUrl ? 'md:grid-cols-2' : ''} gap-3`}>
          
          {/* Banner Image Block */}
          {(isEditing || draft.imageUrl) && (
            <div className={`bg-white border rounded-2xl p-4 shadow-2xs transition-all space-y-2.5 ${
              isEditing ? 'border-blue-400 ring-2 ring-blue-500/10' : 'border-slate-200'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  Imagen / Banner del Trámite
                </h3>
              </div>

              {isEditing ? (
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">
                    URL de la imagen o banner explicativo:
                  </label>
                  <input
                    type="url"
                    value={draft.imageUrl || ''}
                    onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })}
                    placeholder="Ej. https://images.unsplash.com/photo-..."
                    className="w-full px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20"
                  />
                  {draft.imageUrl && (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 max-h-48 bg-slate-100">
                      <img 
                        src={draft.imageUrl} 
                        alt="Previsualización del Banner" 
                        className="w-full h-36 object-cover"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                draft.imageUrl && (
                  <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 max-h-56">
                    <img 
                      src={draft.imageUrl} 
                      alt={draft.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )
              )}
            </div>
          )}

          {/* Video Explicativo Block */}
          {(isEditing || videoInfo) && (
            <div className={`bg-white border rounded-2xl p-4 shadow-2xs transition-all space-y-2.5 ${
              isEditing ? 'border-blue-400 ring-2 ring-blue-500/10' : 'border-slate-200'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-purple-600" />
                  Video Explicativo del Trámite
                </h3>
              </div>

              {isEditing ? (
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">
                    URL del Video (YouTube, Vimeo o MP4):
                  </label>
                  <input
                    type="url"
                    value={draft.videoUrl || ''}
                    onChange={(e) => setDraft({ ...draft, videoUrl: e.target.value })}
                    placeholder="Ej. https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20"
                  />
                  {videoInfo && (
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-200">
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
                  )}
                </div>
              ) : (
                videoInfo && (
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-200">
                    {videoInfo.type === 'direct' ? (
                      <video src={videoInfo.embedUrl} controls className="w-full h-full" />
                    ) : (
                      <iframe 
                        src={videoInfo.embedUrl} 
                        title="Video explicativo del trámite" 
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      />
                    )}
                  </div>
                )
              )}
            </div>
          )}

        </div>
      )}

      {/* FORMATOS Y DOCUMENTOS ADJUNTOS */}
      {(isEditing || (draft.attachments && draft.attachments.length > 0)) && (
        <div className={`bg-white border rounded-2xl p-4 shadow-2xs transition-all ${
          isEditing ? 'border-blue-400 ring-2 ring-blue-500/10' : 'border-slate-200'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileDown className="w-4 h-4 text-emerald-600" />
              Formatos y Documentos Descargables
            </h3>
            {isEditing && (
              <button
                type="button"
                onClick={handleAddAttachment}
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border border-emerald-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Documento</span>
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2.5">
              {draft.attachments && draft.attachments.length > 0 ? (
                draft.attachments.map((att, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                        Documento #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(idx)}
                        className="text-rose-500 hover:text-rose-700 p-1 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Nombre del Documento:</label>
                        <input
                          type="text"
                          value={att.name}
                          onChange={(e) => handleUpdateAttachment(idx, 'name', e.target.value)}
                          placeholder="Ej. Solicitud de Vacaciones PDF"
                          className="w-full px-3 py-1.5 text-xs font-bold border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">URL de Descarga:</label>
                        <input
                          type="text"
                          value={att.url}
                          onChange={(e) => handleUpdateAttachment(idx, 'url', e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic text-center py-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No hay documentos adjuntos. Haz clic en "Agregar Documento".
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {draft.attachments?.map((att, idx) => (
                <a
                  key={idx}
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-emerald-50 hover:border-emerald-300 transition-all flex items-center justify-between group shadow-2xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                      <FileDown className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-950 truncate">{att.name}</p>
                      <p className="text-[10px] text-slate-400">Clic para descargar archivo</p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PROCEDIMIENTO PASO A PASO */}
      {(isEditing || (draft.showSteps !== false && draft.steps && draft.steps.length > 0)) && (
        <div className={`bg-white border rounded-2xl p-4 shadow-2xs transition-all ${
          isEditing ? 'border-blue-400 ring-2 ring-blue-500/10' : 'border-slate-200'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" />
              Procedimiento Oficial Paso a Paso
            </h3>
            {isEditing && (
              <button
                type="button"
                onClick={handleAddStep}
                className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Paso</span>
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-3">
              {draft.steps && draft.steps.length > 0 ? (
                draft.steps.map((step, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-blue-200/80 space-y-2 relative shadow-2xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-extrabold text-white bg-slate-900 px-2.5 py-0.5 rounded-md">
                        Paso {step.num || idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveStep(idx)}
                        className="text-rose-500 hover:text-rose-700 p-1 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-medium"
                        title="Eliminar este paso"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Eliminar Paso</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Título del paso:</label>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => handleUpdateStep(idx, 'title', e.target.value)}
                        placeholder="Título del paso (ej. Registro en Sistema)"
                        className="w-full px-3 py-1.5 text-xs font-bold border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Descripción del paso:</label>
                      <textarea
                        rows={2}
                        value={step.desc}
                        onChange={(e) => handleUpdateStep(idx, 'desc', e.target.value)}
                        placeholder="Instrucciones detalladas de este paso..."
                        className="w-full px-3 py-1.5 text-xs font-normal border border-slate-300 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No hay pasos registrados. Haz clic en "Agregar Paso".
                </p>
              )}

              <button
                type="button"
                onClick={handleAddStep}
                className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-all border border-blue-200 flex items-center justify-center gap-1.5 mt-2"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Nuevo Paso al Final</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {draft.steps && draft.steps.length > 0 ? (
                draft.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-3 items-start bg-slate-50/80 p-3 rounded-xl border border-slate-200/60">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {step.num || idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{step.title}</h4>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No hay pasos registrados para este trámite.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* REQUISITOS Y ATENCIÓN / UBICACIÓN GRID */}
      {(isEditing || 
        (draft.showRequirements !== false && draft.requirements && draft.requirements.length > 0) || 
        (draft.showContact !== false && (draft.location || draft.schedule || draft.contact))
      ) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          
          {/* REQUISITOS NECESARIOS */}
          {(isEditing || (draft.showRequirements !== false && draft.requirements && draft.requirements.length > 0)) && (
            <div className={`bg-white border rounded-2xl p-4 shadow-2xs transition-all ${
              isEditing ? 'border-blue-400 ring-2 ring-blue-500/10' : 'border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-2.5 border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Requisitos Necesarios
                </h3>
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleAddRequirement}
                    className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border border-emerald-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar</span>
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-2">
                  {draft.requirements && draft.requirements.length > 0 ? (
                    draft.requirements.map((req, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                        <input
                          type="text"
                          value={req}
                          onChange={(e) => handleUpdateRequirement(idx, e.target.value)}
                          placeholder="Ej. Gafete oficial activo o Identificación INE"
                          className="flex-1 px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveRequirement(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Eliminar requisito"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">No hay requisitos registrados.</p>
                  )}

                  <button
                    type="button"
                    onClick={handleAddRequirement}
                    className="w-full py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-all border border-emerald-200 flex items-center justify-center gap-1 mt-2"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Fila de Requisito</span>
                  </button>
                </div>
              ) : (
                <ul className="space-y-2">
                  {draft.requirements?.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* ATENCIÓN Y UBICACIÓN */}
          {(isEditing || (draft.showContact !== false && (draft.location || draft.schedule || draft.contact))) && (
            <div className={`bg-white border rounded-2xl p-4 shadow-2xs transition-all ${
              isEditing ? 'border-blue-400 ring-2 ring-blue-500/10' : 'border-slate-200'
            }`}>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Atención y Ubicación
              </h3>

              {isEditing ? (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      Ubicación de Atención:
                    </label>
                    <input
                      type="text"
                      value={draft.location || ''}
                      onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                      placeholder="Ej. Planta Baja • Edificio de Recursos Humanos"
                      className="w-full px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Horarios de Atención:
                    </label>
                    <input
                      type="text"
                      value={draft.schedule || ''}
                      onChange={(e) => setDraft({ ...draft, schedule: e.target.value })}
                      placeholder="Ej. Lunes a Viernes de 8:00 AM a 5:00 PM"
                      className="w-full px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      Teléfono / Extensión:
                    </label>
                    <input
                      type="text"
                      value={draft.contact || ''}
                      onChange={(e) => setDraft({ ...draft, contact: e.target.value })}
                      placeholder="Ej. Recursos Humanos - Ext. 200"
                      className="w-full px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>
                </div>
              ) : (
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
              )}
            </div>
          )}

        </div>
      )}

      {/* SECCIÓN DE PREGUNTAS FRECUENTES (FAQS) */}
      {(isEditing || (draft.showFaqs !== false && draft.faqs && draft.faqs.length > 0)) && (
        <div className={`bg-white border rounded-2xl p-4 shadow-2xs transition-all ${
          isEditing ? 'border-blue-400 ring-2 ring-blue-500/10' : 'border-slate-200'
        }`}>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            Preguntas Frecuentes Relacionadas
          </h3>
          <FAQAccordion 
            items={draft.faqs || []} 
            isEditing={isEditing}
            onUpdateFAQ={handleUpdateFAQ}
            onRemoveFAQ={handleRemoveFAQ}
            onAddFAQ={handleAddFAQ}
          />
        </div>
      )}

      {/* FIXED ACTION BAR AT BOTTOM DURING EDITING MODE */}
      {isEditing && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-3 sm:p-4 text-white shadow-2xl animate-slideUp">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping"></span>
              <div>
                <p className="text-xs font-bold text-white">Edición Dinámica de Trámite</p>
                <p className="text-[10px] text-slate-400 hidden sm:block">Guarda los cambios para aplicar la configuración global.</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-xl transition-all border border-slate-700 active:scale-95"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all flex items-center gap-1.5 shadow-md active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
