import React, { useState, useEffect } from 'react';
import { 
  X, Save, FileText, ListOrdered, CheckCircle2, 
  ImageIcon, HelpCircle, AlertTriangle, Plus, Trash2, MapPin, Clock, Phone,
  Sparkles, Eye, Image as ImageLucide, Layers, GitBranch
} from 'lucide-react';
import { Service, StepItem, ServiceFAQ } from '../types';
import { MediaUploadField } from './MediaUploadField';
import { SERVICE_ICON_MAP } from './ServiceCard';
import { DecisionTreeBuilder } from './DecisionTreeBuilder';
import { DecisionTreeNavigator } from './DecisionTreeNavigator';
import { DecisionTreeCanvasEditor } from './DecisionTreeCanvasEditor';

interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: (Service & { hidden?: boolean }) | null;
  onSave: (updatedService: Service & { hidden?: boolean }) => void;
}

export const EditServiceModal: React.FC<EditServiceModalProps> = ({
  isOpen,
  onClose,
  service,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'arbol' | 'pasos' | 'requisitos' | 'multimedia' | 'faqs' | 'aviso'>('general');
  const [editingService, setEditingService] = useState<(Service & { hidden?: boolean }) | null>(null);
  const [visualMode, setVisualMode] = useState<'icon' | 'image'>('icon');
  const [isFlowEditorOpen, setIsFlowEditorOpen] = useState(false);

  useEffect(() => {
    if (service) {
      const hasImage = Boolean(service.cardImage && service.cardImage.trim().length > 0);
      setVisualMode(hasImage ? 'image' : 'icon');
      setEditingService({
        ...service,
        steps: service.steps ? [...service.steps] : [],
        requirements: service.requirements ? [...service.requirements] : [],
        faqs: service.faqs ? [...service.faqs] : [],
        decisionTree: service.decisionTree ? [...service.decisionTree] : [],
        cardImage: service.cardImage || '',
        imageUrl: service.imageUrl || '',
        videoUrl: service.videoUrl || '',
        pdfUrl: service.pdfUrl || '',
        pdfTitle: service.pdfTitle || '',
        alertNotice: service.alertNotice || ''
      });
    }
  }, [service, isOpen]);

  if (!isOpen || !editingService) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService.title.trim()) {
      alert('Por favor, ingresa el título del trámite.');
      return;
    }
    // If user explicitly chose icon mode and emptied cardImage, ensure cardImage is clean
    const serviceToSave = {
      ...editingService,
      cardImage: visualMode === 'icon' && !editingService.cardImage ? '' : editingService.cardImage
    };
    onSave(serviceToSave);
    onClose();
  };

  // Step handlers
  const handleAddStep = () => {
    const nextNum = (editingService.steps?.length || 0) + 1;
    setEditingService({
      ...editingService,
      steps: [...(editingService.steps || []), { num: nextNum, title: '', desc: '' }]
    });
  };

  const handleUpdateStep = (index: number, field: keyof StepItem, value: any) => {
    const updated = [...(editingService.steps || [])];
    updated[index] = { ...updated[index], [field]: value };
    setEditingService({ ...editingService, steps: updated });
  };

  const handleRemoveStep = (index: number) => {
    const updated = (editingService.steps || []).filter((_, i) => i !== index);
    const renumbered = updated.map((step, idx) => ({ ...step, num: idx + 1 }));
    setEditingService({ ...editingService, steps: renumbered });
  };

  // Requirement handlers
  const handleAddRequirement = () => {
    setEditingService({
      ...editingService,
      requirements: [...(editingService.requirements || []), '']
    });
  };

  const handleUpdateRequirement = (index: number, value: string) => {
    const updated = [...(editingService.requirements || [])];
    updated[index] = value;
    setEditingService({ ...editingService, requirements: updated });
  };

  const handleRemoveRequirement = (index: number) => {
    setEditingService({
      ...editingService,
      requirements: (editingService.requirements || []).filter((_, i) => i !== index)
    });
  };

  // FAQ handlers
  const handleAddFAQ = () => {
    setEditingService({
      ...editingService,
      faqs: [...(editingService.faqs || []), { question: '', answer: '' }]
    });
  };

  const handleUpdateFAQ = (index: number, field: keyof ServiceFAQ, value: string) => {
    const updated = [...(editingService.faqs || [])];
    updated[index] = { ...updated[index], [field]: value };
    setEditingService({ ...editingService, faqs: updated });
  };

  const handleRemoveFAQ = (index: number) => {
    setEditingService({
      ...editingService,
      faqs: (editingService.faqs || []).filter((_, i) => i !== index)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {editingService.id ? 'Editar Trámite o Servicio' : 'Nuevo Trámite de Talento y Cultura'}
              </h3>
              <p className="text-xs text-slate-300">
                {editingService.title || 'Configura la información para el catálogo del colaborador'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-100/80 px-4 pt-2 gap-1 overflow-x-auto custom-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'general'
                ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>General</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('arbol')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'arbol'
                ? 'bg-white text-blue-700 shadow-2xs border border-slate-200 font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Árbol de Decisión ({editingService.decisionTree?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pasos')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'pasos'
                ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Pasos ({editingService.steps?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('requisitos')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'requisitos'
                ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Requisitos y Contacto</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('multimedia')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'multimedia'
                ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Archivos y Multimedia</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('faqs')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'faqs'
                ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Preguntas Frecuentes ({editingService.faqs?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('aviso')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'aviso'
                ? 'bg-white text-amber-700 shadow-2xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Aviso Destacado</span>
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSave} className="flex flex-col flex-1 min-h-0">
          <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-4">

            {/* TAB 1: INFORMACIÓN GENERAL */}
            {activeTab === 'general' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
                {/* Form Fields Left Column */}
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Título del Trámite *
                    </label>
                    <input
                      type="text"
                      value={editingService.title}
                      onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                      placeholder="Ej. Póliza de Seguro Social o Solicitud de Vacaciones"
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

                  {/* IDENTIFICADOR VISUAL DE LA TARJETA (SELECTOR ÍCONO vs FOTO) */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Identificador Visual de la Tarjeta *
                        </label>
                        <p className="text-[11px] text-slate-500">
                          Elige cómo se presentará este trámite en el catálogo de inicio.
                        </p>
                      </div>

                      <div className="flex bg-slate-200/80 p-0.5 rounded-xl text-xs font-semibold shrink-0">
                        <button
                          type="button"
                          onClick={() => setVisualMode('icon')}
                          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                            visualMode === 'icon'
                              ? 'bg-white text-blue-700 shadow-xs font-bold'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Usar Ícono</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setVisualMode('image')}
                          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                            visualMode === 'image'
                              ? 'bg-white text-blue-700 shadow-xs font-bold'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <ImageLucide className="w-3.5 h-3.5" />
                          <span>Subir Foto</span>
                        </button>
                      </div>
                    </div>

                    {visualMode === 'icon' ? (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Seleccionar Ícono Vectorial
                        </label>
                        <select
                          value={editingService.iconName || editingService.icon || 'FileText'}
                          onChange={(e) => setEditingService({ ...editingService, iconName: e.target.value, icon: e.target.value })}
                          className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                        >
                          <option value="Banknote">💵 Billete (Banknote)</option>
                          <option value="Coins">🪙 Monedas (Coins)</option>
                          <option value="ReceiptText">🧾 Recibo / Nómina (ReceiptText)</option>
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
                    ) : (
                      <div className="space-y-2">
                        <MediaUploadField
                          type="image"
                          label="Imagen / Foto de la tarjeta (Opcional)"
                          value={editingService.cardImage || ''}
                          onChange={(val) => setEditingService(prev => prev ? ({ ...prev, cardImage: val }) : prev)}
                          placeholderUrl="https://ejemplo.com/foto_tarjeta.jpg o .png"
                          helperText="Sube una foto o pega un enlace. Se ajustará automáticamente a proporción cuadrada con bordes redondeados."
                          idPrefix="modal-service-card-general"
                        />
                      </div>
                    )}
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

                {/* Right Column: Live Card Preview */}
                <div className="lg:col-span-5 flex flex-col justify-start">
                  <div className="bg-slate-100/80 rounded-2xl p-4 border border-slate-200 space-y-3 sticky top-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-700">
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        <span>Vista previa de la Tarjeta</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                        En vivo
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500">
                      Así se mostrará este trámite en el catálogo general:
                    </p>

                    {/* Card Mockup */}
                    <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-sm w-full transition-all">
                      <div className="mb-3 flex items-center justify-center">
                        {editingService.cardImage && editingService.cardImage.trim().length > 0 ? (
                          <img 
                            src={editingService.cardImage} 
                            alt={editingService.title || 'Foto de tarjeta'} 
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-sm border border-slate-200 mx-auto mb-2" 
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 border-2 border-blue-300 flex items-center justify-center shadow-sm mx-auto">
                            {React.createElement(
                              SERVICE_ICON_MAP[editingService.iconName || editingService.icon || 'FileText'] || FileText, 
                              { size: 32, strokeWidth: 2.5 }
                            )}
                          </div>
                        )}
                      </div>

                      <div className="w-full space-y-1.5">
                        <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-md">
                          {editingService.category || 'Categoría'}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                          {editingService.title || 'Título del Trámite'}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                          {editingService.shortDesc || 'Descripción corta de ejemplo para la tarjeta del catálogo...'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ÁRBOL DE DECISIÓN (DIVULGACIÓN PROGRESIVA) */}
            {activeTab === 'arbol' && (
              <div className="space-y-5 animate-fadeIn">
                {/* Banner de acceso al Editor de Diagrama de Flujo en Pantalla Completa */}
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
                      Edita el árbol de decisiones en un lienzo infinito interactivo con zoom, paneo, conexión de ramas y panel de propiedades lateral.
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

                {/* Live Interactive Preview for Admin */}
                {editingService.decisionTree && editingService.decisionTree.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        Vista Previa Interactiva (Estilo Colaborador)
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        Prueba la navegación paso a paso
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
            {activeTab === 'pasos' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Pasos del Procedimiento ({editingService.steps?.length || 0})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border border-blue-200 cursor-pointer"
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
                            className="text-rose-500 hover:text-rose-700 p-1 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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
            {activeTab === 'requisitos' && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Requisitos Necesarios
                    </label>
                    <button
                      type="button"
                      onClick={handleAddRequirement}
                      className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border border-emerald-200 cursor-pointer"
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
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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

            {/* TAB 4: ARCHIVOS Y MULTIMEDIA (DOBLE OPCIÓN: SUBIR ARCHIVO LOCAL O ENLACE URL) */}
            {activeTab === 'multimedia' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    <span>Archivos y Multimedia (Subida Local o Enlace URL)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Carga archivos locales desde tu computadora (conversión Base64 instantánea) o ingresa enlaces URL externos.
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
                  idPrefix="modal-service-card-media"
                />

                {/* 2. IMAGEN / INFOGRAFÍA */}
                <MediaUploadField
                  type="image"
                  label="Infografía o Banner del Trámite (Cabecera Detalle)"
                  value={editingService.imageUrl || ''}
                  onChange={(val) => setEditingService({ ...editingService, imageUrl: val })}
                  placeholderUrl="https://ejemplo.com/infografia.png o .jpg"
                  helperText="Se muestra como banner visual o infografía en la cabecera del trámite."
                  idPrefix="modal-service"
                />

                {/* 3. VIDEO TUTORIAL */}
                <MediaUploadField
                  type="video"
                  label="Video Tutorial Explicativo"
                  value={editingService.videoUrl || ''}
                  onChange={(val) => setEditingService({ ...editingService, videoUrl: val })}
                  placeholderUrl="https://www.youtube.com/watch?v=... o video directo .mp4"
                  helperText="Soporta videos directos locales (.MP4) o enlaces de YouTube y Vimeo."
                  idPrefix="modal-service"
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
                  idPrefix="modal-service"
                />
              </div>
            )}

            {/* TAB 5: PREGUNTAS FRECUENTES (FAQs) */}
            {activeTab === 'faqs' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Preguntas Frecuentes ({editingService.faqs?.length || 0})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddFAQ}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border border-blue-200 cursor-pointer"
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
                            className="text-rose-500 hover:text-rose-700 p-1 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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

            {/* TAB 6: AVISO DESTACADO */}
            {activeTab === 'aviso' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Aviso Destacado (Banner de Alerta Opcional)
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Si escribes un texto aquí, se mostrará automáticamente un recuadro de aviso destacado en la parte superior del trámite. Si lo dejas vacío, no se mostrará ningún banner.
                  </p>
                </div>

                <div className="p-4 bg-amber-50/90 border border-amber-200/90 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-amber-900">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <label className="text-xs font-bold text-slate-900">Texto del Aviso Importante</label>
                    </div>
                    {editingService.alertNotice && editingService.alertNotice.trim().length > 0 && (
                      <button
                        type="button"
                        onClick={() => setEditingService({ ...editingService, alertNotice: '' })}
                        className="text-amber-800 hover:text-red-600 font-bold underline cursor-pointer text-xs transition-colors"
                      >
                        Limpiar aviso
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={4}
                    value={editingService.alertNotice || ''}
                    onChange={(e) => setEditingService({ ...editingService, alertNotice: e.target.value })}
                    placeholder="Ej. Atención: Por período vacacional, las solicitudes recibidas después del día 15 se procesarán la siguiente quincena..."
                    className="w-full text-xs font-medium text-slate-900 border border-amber-300 rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  />
                  <p className="text-[11px] text-amber-800 font-medium leading-relaxed">
                    💡 <strong>Visualización 100% automática:</strong> Al contener texto, el banner ámbar aparecerá en la cabecera del trámite para todos los colaboradores.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Modal Footer Controls */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
            <div className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Los cambios se actualizarán inmediatamente en el portal y LocalStorage.
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </div>
        </form>

      </div>

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
    </div>
  );
};
